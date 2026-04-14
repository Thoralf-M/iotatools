// Copyright (c) IOTA Tools
// SPDX-License-Identifier: Apache-2.0

/// On-chain web-app hosting.
///
/// An `App` is a shared object that stores the HTML/JS payload of a web app.
/// The payload is split into fixed-size chunks, and each chunk is attached to
/// the `App` as a *dynamic field* (NOT a dynamic object field) keyed by its
/// index. This way the top-level `App` object stays small - only carrying
/// metadata (name, description, timestamps, versions, chunk count, ...) - and
/// loading the list of apps is cheap. The actual bytes are fetched lazily by
/// reading the dynamic fields once a user selects the app.
///
/// Updates to an existing app require the `AppCap` that is handed to the
/// publisher when the app is created. The app version is bumped on every
/// update so clients can show a history / cache bust.
///
/// The `PACKAGE_VERSION` constant tracks the version of this Move package and
/// is stamped into every new `App`. A later package upgrade can bump it to
/// introduce new features without breaking old apps.
module onchain_apps::app {
    use std::string::{Self, String};
    use iota::clock::{Self, Clock};
    use iota::dynamic_field as df;
    use iota::event;
    use iota::transfer;

    // === Errors ===

    const E_WRONG_APP: u64 = 1;
    const E_CHUNK_TOO_LARGE: u64 = 2;
    const E_INDEX_OUT_OF_RANGE: u64 = 3;

    // === Constants ===

    /// Current on-chain package version. Bumped on package upgrades.
    const PACKAGE_VERSION: u64 = 1;

    /// Hard cap for a single chunk. Clients should target ~128 KiB; this is a
    /// safety net so a malformed publish tx fails fast.
    const MAX_CHUNK_SIZE: u64 = 256 * 1024; // 256 KiB

    // === Structs ===

    /// Top-level, shared object for a published web app. The payload bytes
    /// live in dynamic fields keyed by `ChunkKey { index }` so loading the
    /// metadata is fast and the actual content can be fetched on demand.
    public struct App has key, store {
        id: UID,
        /// Short human-readable name shown in the app list.
        name: String,
        /// Free-form description / README shown alongside the app.
        description: String,
        /// MIME type hint (e.g. `text/html`). Mostly `text/html` for now.
        content_type: String,
        /// Version of this individual app. Starts at 1, +1 per update.
        app_version: u64,
        /// Version of this Move package at publish/update time.
        package_version: u64,
        /// Unix ms timestamp of first publish.
        published_at_ms: u64,
        /// Unix ms timestamp of last update (== published_at_ms on create).
        updated_at_ms: u64,
        /// Number of chunks currently attached as dynamic fields.
        chunk_count: u64,
        /// Total byte size of the payload (sum of all chunks).
        total_size: u64,
        /// Address that first published this app.
        publisher: address,
    }

    /// Capability handed to the publisher. Required to mutate the `App`.
    /// Without this cap nobody can update or append content.
    public struct AppCap has key, store {
        id: UID,
        app_id: ID,
    }

    /// Dynamic-field key for chunks. Chunks are stored as `vector<u8>`
    /// values attached directly to `App.id` (plain dynamic fields, NOT
    /// dynamic *object* fields).
    public struct ChunkKey has copy, drop, store {
        index: u64,
    }

    // === Events ===

    public struct AppPublished has copy, drop {
        app_id: ID,
        publisher: address,
        name: String,
        chunk_count: u64,
        total_size: u64,
        package_version: u64,
        published_at_ms: u64,
    }

    public struct AppUpdated has copy, drop {
        app_id: ID,
        app_version: u64,
        chunk_count: u64,
        total_size: u64,
        updated_at_ms: u64,
    }

    public struct AppChunksAppended has copy, drop {
        app_id: ID,
        added_chunks: u64,
        new_chunk_count: u64,
        new_total_size: u64,
    }

    // === Public constructors ===

    /// Create an `App` together with its `AppCap` without sharing / transferring.
    /// Useful for tests and for programmable transactions that want to do
    /// something extra before finally sharing the app.
    public fun create_app(
        name: vector<u8>,
        description: vector<u8>,
        content_type: vector<u8>,
        chunks: vector<vector<u8>>,
        clock: &Clock,
        ctx: &mut TxContext,
    ): (App, AppCap) {
        let now = clock::timestamp_ms(clock);
        let publisher = ctx.sender();
        let chunk_count = chunks.length();

        let mut app = App {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            content_type: string::utf8(content_type),
            app_version: 1,
            package_version: PACKAGE_VERSION,
            published_at_ms: now,
            updated_at_ms: now,
            chunk_count: 0,
            total_size: 0,
            publisher,
        };

        let total_size = attach_chunks(&mut app, 0, chunks);
        app.chunk_count = chunk_count;
        app.total_size = total_size;

        let cap = AppCap {
            id: object::new(ctx),
            app_id: object::id(&app),
        };

        event::emit(AppPublished {
            app_id: object::id(&app),
            publisher,
            name: app.name,
            chunk_count,
            total_size,
            package_version: PACKAGE_VERSION,
            published_at_ms: now,
        });

        (app, cap)
    }

    // === Entry functions ===

    /// Publish a new app. Shares the `App` so anybody can read it and
    /// transfers the `AppCap` to the sender.
    public entry fun publish(
        name: vector<u8>,
        description: vector<u8>,
        content_type: vector<u8>,
        chunks: vector<vector<u8>>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let (app, cap) = create_app(name, description, content_type, chunks, clock, ctx);
        transfer::public_share_object(app);
        transfer::public_transfer(cap, ctx.sender());
    }

    /// Append more chunks to an existing app. Needed when the payload is so
    /// large that it does not fit into a single transaction (transactions
    /// have a size limit, and each chunk has a max size).
    public entry fun append_chunks(
        app: &mut App,
        cap: &AppCap,
        chunks: vector<vector<u8>>,
        clock: &Clock,
    ) {
        assert!(cap.app_id == object::id(app), E_WRONG_APP);
        let start = app.chunk_count;
        let added = chunks.length();
        let added_size = attach_chunks(app, start, chunks);
        app.chunk_count = start + added;
        app.total_size = app.total_size + added_size;
        app.updated_at_ms = clock::timestamp_ms(clock);

        event::emit(AppChunksAppended {
            app_id: object::id(app),
            added_chunks: added,
            new_chunk_count: app.chunk_count,
            new_total_size: app.total_size,
        });
    }

    /// Replace all chunks + metadata. Bumps `app_version`. Requires the cap.
    public entry fun update_app(
        app: &mut App,
        cap: &AppCap,
        name: vector<u8>,
        description: vector<u8>,
        content_type: vector<u8>,
        chunks: vector<vector<u8>>,
        clock: &Clock,
    ) {
        assert!(cap.app_id == object::id(app), E_WRONG_APP);

        // Remove old chunks.
        let old = app.chunk_count;
        let mut i = 0u64;
        while (i < old) {
            let _removed: vector<u8> = df::remove(&mut app.id, ChunkKey { index: i });
            i = i + 1;
        };

        app.name = string::utf8(name);
        app.description = string::utf8(description);
        app.content_type = string::utf8(content_type);
        app.app_version = app.app_version + 1;
        app.package_version = PACKAGE_VERSION;
        app.updated_at_ms = clock::timestamp_ms(clock);

        let new_count = chunks.length();
        let new_size = attach_chunks(app, 0, chunks);
        app.chunk_count = new_count;
        app.total_size = new_size;

        event::emit(AppUpdated {
            app_id: object::id(app),
            app_version: app.app_version,
            chunk_count: app.chunk_count,
            total_size: app.total_size,
            updated_at_ms: app.updated_at_ms,
        });
    }

    /// Only update metadata (name / description / content_type), keep chunks.
    /// Does not bump `app_version` because the app content did not change,
    /// but does bump `updated_at_ms`.
    public entry fun update_metadata(
        app: &mut App,
        cap: &AppCap,
        name: vector<u8>,
        description: vector<u8>,
        content_type: vector<u8>,
        clock: &Clock,
    ) {
        assert!(cap.app_id == object::id(app), E_WRONG_APP);
        app.name = string::utf8(name);
        app.description = string::utf8(description);
        app.content_type = string::utf8(content_type);
        app.updated_at_ms = clock::timestamp_ms(clock);
    }

    // === Internal helpers ===

    /// Attach `chunks` to `app` starting at `start_index`. Returns the total
    /// byte size of the attached chunks.
    fun attach_chunks(app: &mut App, start_index: u64, mut chunks: vector<vector<u8>>): u64 {
        let count = chunks.length();
        // We want `chunks[0]` to end up at key `start_index`, but vector::pop_back
        // gives us the last element first, so we attach in reverse and compute
        // the correct index.
        let mut i = 0u64;
        let mut total_size = 0u64;
        while (i < count) {
            let chunk = chunks.pop_back();
            let size = chunk.length();
            assert!(size <= MAX_CHUNK_SIZE, E_CHUNK_TOO_LARGE);
            total_size = total_size + size;
            let idx = start_index + count - i - 1;
            df::add(&mut app.id, ChunkKey { index: idx }, chunk);
            i = i + 1;
        };
        chunks.destroy_empty();
        total_size
    }

    // === Read-only accessors ===

    public fun name(app: &App): &String { &app.name }
    public fun description(app: &App): &String { &app.description }
    public fun content_type(app: &App): &String { &app.content_type }
    public fun app_version(app: &App): u64 { app.app_version }
    public fun package_version(app: &App): u64 { app.package_version }
    public fun published_at_ms(app: &App): u64 { app.published_at_ms }
    public fun updated_at_ms(app: &App): u64 { app.updated_at_ms }
    public fun chunk_count(app: &App): u64 { app.chunk_count }
    public fun total_size(app: &App): u64 { app.total_size }
    public fun publisher(app: &App): address { app.publisher }
    public fun app_cap_app_id(cap: &AppCap): ID { cap.app_id }

    /// Read a single chunk by index. Mainly for tests - in practice clients
    /// fetch chunks by reading the dynamic fields off-chain via the RPC.
    public fun chunk(app: &App, index: u64): &vector<u8> {
        assert!(index < app.chunk_count, E_INDEX_OUT_OF_RANGE);
        df::borrow(&app.id, ChunkKey { index })
    }

    /// Exposed so tests / external callers can fabricate the dynamic-field
    /// name used for a given chunk index.
    public fun chunk_key(index: u64): ChunkKey { ChunkKey { index } }

    public fun current_package_version(): u64 { PACKAGE_VERSION }
    public fun max_chunk_size(): u64 { MAX_CHUNK_SIZE }

    // === Test-only helpers ===

    #[test_only]
    public fun destroy_for_testing(app: App, cap: AppCap) {
        let App {
            mut id,
            name: _,
            description: _,
            content_type: _,
            app_version: _,
            package_version: _,
            published_at_ms: _,
            updated_at_ms: _,
            chunk_count,
            total_size: _,
            publisher: _,
        } = app;
        let mut i = 0u64;
        while (i < chunk_count) {
            let _removed: vector<u8> = df::remove(&mut id, ChunkKey { index: i });
            i = i + 1;
        };
        id.delete();
        let AppCap { id: cap_id, app_id: _ } = cap;
        cap_id.delete();
    }
}

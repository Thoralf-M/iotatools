// Copyright (c) IOTA Tools
// SPDX-License-Identifier: Apache-2.0

/// Generic per-user, per-app key/value storage.
///
/// A single shared `Storage` object is created on package publish. Any
/// deployed app can call `set`/`remove` to persist arbitrary bytes keyed by
/// `(app_id, sender, key)`. The data is stored as plain dynamic fields on
/// the `Storage` object - no app-specific Move struct needed.
///
/// This lets game-style apps keep a high-score table, a player registry, a
/// shared scoreboard etc. without having to write their own Move contract.
module onchain_apps::generic_storage {
    use std::string::String;
    use iota::dynamic_field as df;
    use iota::event;
    use iota::transfer;

    // === Errors ===
    const E_MISSING: u64 = 1;

    // === Constants ===
    const STORAGE_VERSION: u64 = 1;

    public struct Storage has key {
        id: UID,
        version: u64,
    }

    /// Key for per-user state scoped to one app.
    public struct UserKey has copy, drop, store {
        app_id: address,
        user: address,
        key: String,
    }

    /// Key for shared state scoped to one app (not per user).
    public struct SharedKey has copy, drop, store {
        app_id: address,
        key: String,
    }

    public struct ValueSet has copy, drop {
        app_id: address,
        user: address,
        shared: bool,
        key: String,
        size: u64,
    }

    public struct ValueRemoved has copy, drop {
        app_id: address,
        user: address,
        shared: bool,
        key: String,
    }

    fun init(ctx: &mut TxContext) {
        let storage = Storage {
            id: object::new(ctx),
            version: STORAGE_VERSION,
        };
        transfer::share_object(storage);
    }

    // === Per-user state (sender scoped) ===

    public entry fun set(
        storage: &mut Storage,
        app_id: address,
        key: String,
        value: vector<u8>,
        ctx: &TxContext,
    ) {
        let user = ctx.sender();
        let k = UserKey { app_id, user, key };
        let size = value.length();
        if (df::exists_(&storage.id, k)) {
            let existing: &mut vector<u8> = df::borrow_mut(&mut storage.id, k);
            *existing = value;
        } else {
            df::add(&mut storage.id, k, value);
        };

        event::emit(ValueSet { app_id, user, shared: false, key, size });
    }

    public entry fun remove(
        storage: &mut Storage,
        app_id: address,
        key: String,
        ctx: &TxContext,
    ) {
        let user = ctx.sender();
        let k = UserKey { app_id, user, key };
        assert!(df::exists_(&storage.id, k), E_MISSING);
        let _: vector<u8> = df::remove(&mut storage.id, k);
        event::emit(ValueRemoved { app_id, user, shared: false, key });
    }

    public fun get(
        storage: &Storage,
        app_id: address,
        user: address,
        key: String,
    ): &vector<u8> {
        df::borrow(&storage.id, UserKey { app_id, user, key })
    }

    public fun exists(
        storage: &Storage,
        app_id: address,
        user: address,
        key: String,
    ): bool {
        df::exists_(&storage.id, UserKey { app_id, user, key })
    }

    // === Shared (per-app) state ===

    public entry fun set_shared(
        storage: &mut Storage,
        app_id: address,
        key: String,
        value: vector<u8>,
        ctx: &TxContext,
    ) {
        let user = ctx.sender();
        let k = SharedKey { app_id, key };
        let size = value.length();
        if (df::exists_(&storage.id, k)) {
            let existing: &mut vector<u8> = df::borrow_mut(&mut storage.id, k);
            *existing = value;
        } else {
            df::add(&mut storage.id, k, value);
        };

        event::emit(ValueSet { app_id, user, shared: true, key, size });
    }

    public fun get_shared(
        storage: &Storage,
        app_id: address,
        key: String,
    ): &vector<u8> {
        df::borrow(&storage.id, SharedKey { app_id, key })
    }

    public fun exists_shared(storage: &Storage, app_id: address, key: String): bool {
        df::exists_(&storage.id, SharedKey { app_id, key })
    }

    public fun version(storage: &Storage): u64 { storage.version }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) { init(ctx); }
}

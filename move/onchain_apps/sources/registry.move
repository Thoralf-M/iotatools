// Copyright (c) IOTA Tools
// SPDX-License-Identifier: Apache-2.0

/// A single shared `Registry` object that indexes every `App` published
/// through this package. The UI walks its dynamic fields to enumerate the
/// catalogue without having to rely on an external indexer.
///
/// Each published app gets two dynamic fields attached to the registry:
/// * `IndexKey { index: u64 }          -> ID` for ordered iteration
/// * `AppIdKey { app_id: ID }          -> u64` for existence / reverse lookup
module onchain_apps::registry {
    use iota::dynamic_field as df;
    use iota::event;
    use iota::transfer;

    // === Errors ===
    const E_ALREADY_REGISTERED: u64 = 1;

    // === Constants ===
    const REGISTRY_VERSION: u64 = 1;

    public struct Registry has key {
        id: UID,
        version: u64,
        count: u64,
    }

    public struct IndexKey has copy, drop, store { index: u64 }
    public struct AppIdKey has copy, drop, store { app_id: ID }

    public struct AppRegistered has copy, drop {
        registry_id: ID,
        app_id: ID,
        index: u64,
    }

    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            version: REGISTRY_VERSION,
            count: 0,
        };
        transfer::share_object(registry);
    }

    /// Register an app in the shared registry. Intended to be called in the
    /// same PTB as `app::publish` by the client.
    public entry fun register(registry: &mut Registry, app_id: ID) {
        assert!(!df::exists_(&registry.id, AppIdKey { app_id }), E_ALREADY_REGISTERED);
        let index = registry.count;
        df::add(&mut registry.id, IndexKey { index }, app_id);
        df::add(&mut registry.id, AppIdKey { app_id }, index);
        registry.count = index + 1;

        event::emit(AppRegistered {
            registry_id: object::id(registry),
            app_id,
            index,
        });
    }

    public fun count(registry: &Registry): u64 { registry.count }
    public fun version(registry: &Registry): u64 { registry.version }
    public fun app_at(registry: &Registry, index: u64): ID {
        *df::borrow<IndexKey, ID>(&registry.id, IndexKey { index })
    }
    public fun contains(registry: &Registry, app_id: ID): bool {
        df::exists_(&registry.id, AppIdKey { app_id })
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) { init(ctx); }
}

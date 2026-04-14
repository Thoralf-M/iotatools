// Copyright (c) IOTA Tools
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module onchain_apps::generic_storage_tests {
    use std::string;
    use iota::test_scenario as ts;
    use onchain_apps::generic_storage::{Self, Storage};

    const USER_A: address = @0xA;
    const USER_B: address = @0xB;
    const APP_ID: address = @0x42;

    #[test]
    fun set_and_get_per_user() {
        let mut s = ts::begin(USER_A);
        generic_storage::init_for_testing(s.ctx());
        s.next_tx(USER_A);

        let mut store = s.take_shared<Storage>();
        generic_storage::set(
            &mut store,
            APP_ID,
            string::utf8(b"name"),
            b"alice",
            s.ctx(),
        );
        assert!(
            generic_storage::exists(&store, APP_ID, USER_A, string::utf8(b"name")),
            0,
        );
        let got = generic_storage::get(&store, APP_ID, USER_A, string::utf8(b"name"));
        assert!(got == b"alice", 1);

        // A different user does NOT see the value.
        assert!(
            !generic_storage::exists(&store, APP_ID, USER_B, string::utf8(b"name")),
            2,
        );

        ts::return_shared(store);
        ts::end(s);
    }

    #[test]
    fun set_overwrites_existing_value() {
        let mut s = ts::begin(USER_A);
        generic_storage::init_for_testing(s.ctx());
        s.next_tx(USER_A);

        let mut store = s.take_shared<Storage>();
        generic_storage::set(&mut store, APP_ID, string::utf8(b"k"), b"v1", s.ctx());
        generic_storage::set(&mut store, APP_ID, string::utf8(b"k"), b"v2", s.ctx());
        assert!(generic_storage::get(&store, APP_ID, USER_A, string::utf8(b"k")) == b"v2", 0);

        ts::return_shared(store);
        ts::end(s);
    }

    #[test]
    fun remove_deletes_entry() {
        let mut s = ts::begin(USER_A);
        generic_storage::init_for_testing(s.ctx());
        s.next_tx(USER_A);

        let mut store = s.take_shared<Storage>();
        generic_storage::set(&mut store, APP_ID, string::utf8(b"k"), b"v", s.ctx());
        generic_storage::remove(&mut store, APP_ID, string::utf8(b"k"), s.ctx());
        assert!(!generic_storage::exists(&store, APP_ID, USER_A, string::utf8(b"k")), 0);

        ts::return_shared(store);
        ts::end(s);
    }

    #[test]
    fun shared_state_is_not_per_user() {
        let mut s = ts::begin(USER_A);
        generic_storage::init_for_testing(s.ctx());
        s.next_tx(USER_A);

        let mut store = s.take_shared<Storage>();
        generic_storage::set_shared(
            &mut store, APP_ID, string::utf8(b"high_score"), b"9000", s.ctx(),
        );

        // Different user, same app, same key - sees the same value.
        s.next_tx(USER_B);
        assert!(
            generic_storage::exists_shared(&store, APP_ID, string::utf8(b"high_score")),
            0,
        );
        assert!(
            generic_storage::get_shared(&store, APP_ID, string::utf8(b"high_score")) == b"9000",
            1,
        );

        ts::return_shared(store);
        ts::end(s);
    }
}

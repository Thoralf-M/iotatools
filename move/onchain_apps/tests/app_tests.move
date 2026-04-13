// Copyright (c) IOTA Tools
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module onchain_apps::app_tests {
    use iota::clock;
    use iota::test_scenario as ts;
    use onchain_apps::app::{Self, App};
    use onchain_apps::registry::{Self, Registry};

    const PUBLISHER: address = @0xA11CE;
    const OTHER: address = @0xB0B;

    // Matches the private `E_WRONG_APP` constant in `onchain_apps::app`.
    const E_WRONG_APP: u64 = 1;

    fun html_chunks(): vector<vector<u8>> {
        let mut v = vector::empty<vector<u8>>();
        v.push_back(b"<html><body>");
        v.push_back(b"hello ");
        v.push_back(b"world</body></html>");
        v
    }

    #[test]
    fun publish_and_read_back() {
        let mut s = ts::begin(PUBLISHER);
        let clock = clock::create_for_testing(s.ctx());

        let (app, cap) = app::create_app(
            b"my game",
            b"a demo game",
            b"text/html",
            html_chunks(),
            &clock,
            s.ctx(),
        );

        assert!(app::name(&app).as_bytes() == b"my game", 0);
        assert!(app::description(&app).as_bytes() == b"a demo game", 1);
        assert!(app::content_type(&app).as_bytes() == b"text/html", 2);
        assert!(app::app_version(&app) == 1, 3);
        assert!(app::package_version(&app) == app::current_package_version(), 4);
        assert!(app::chunk_count(&app) == 3, 5);

        let expected_size = b"<html><body>".length() + b"hello ".length() + b"world</body></html>".length();
        assert!(app::total_size(&app) == expected_size, 6);
        assert!(app::publisher(&app) == PUBLISHER, 7);
        assert!(app::published_at_ms(&app) == app::updated_at_ms(&app), 8);

        // Chunk ordering: index 0 must be the first input chunk.
        assert!(app::chunk(&app, 0) == b"<html><body>", 9);
        assert!(app::chunk(&app, 1) == b"hello ", 10);
        assert!(app::chunk(&app, 2) == b"world</body></html>", 11);

        app::destroy_for_testing(app, cap);
        clock::destroy_for_testing(clock);
        ts::end(s);
    }

    #[test]
    fun append_chunks_increases_counts() {
        let mut s = ts::begin(PUBLISHER);
        let clock = clock::create_for_testing(s.ctx());

        let (mut app, cap) = app::create_app(
            b"n",
            b"d",
            b"text/html",
            html_chunks(),
            &clock,
            s.ctx(),
        );

        let mut more = vector::empty<vector<u8>>();
        more.push_back(b"extra");

        app::append_chunks(&mut app, &cap, more, &clock);

        assert!(app::chunk_count(&app) == 4, 0);
        assert!(app::chunk(&app, 3) == b"extra", 1);
        let expected = b"<html><body>".length()
            + b"hello ".length()
            + b"world</body></html>".length()
            + b"extra".length();
        assert!(app::total_size(&app) == expected, 2);

        app::destroy_for_testing(app, cap);
        clock::destroy_for_testing(clock);
        ts::end(s);
    }

    #[test]
    fun update_replaces_chunks_and_bumps_version() {
        let mut s = ts::begin(PUBLISHER);
        let mut clock = clock::create_for_testing(s.ctx());

        let (mut app, cap) = app::create_app(
            b"n1",
            b"d1",
            b"text/html",
            html_chunks(),
            &clock,
            s.ctx(),
        );

        // Advance the clock so updated_at_ms moves forward.
        clock::increment_for_testing(&mut clock, 1_000);

        let mut new_chunks = vector::empty<vector<u8>>();
        new_chunks.push_back(b"<html>v2");
        new_chunks.push_back(b"</html>");

        app::update_app(
            &mut app,
            &cap,
            b"n2",
            b"d2",
            b"text/html",
            new_chunks,
            &clock,
        );

        assert!(app::app_version(&app) == 2, 0);
        assert!(app::name(&app).as_bytes() == b"n2", 1);
        assert!(app::description(&app).as_bytes() == b"d2", 2);
        assert!(app::chunk_count(&app) == 2, 3);
        assert!(app::chunk(&app, 0) == b"<html>v2", 4);
        assert!(app::chunk(&app, 1) == b"</html>", 5);
        assert!(app::updated_at_ms(&app) > app::published_at_ms(&app), 6);

        app::destroy_for_testing(app, cap);
        clock::destroy_for_testing(clock);
        ts::end(s);
    }

    #[test]
    fun metadata_only_update_keeps_chunks() {
        let mut s = ts::begin(PUBLISHER);
        let mut clock = clock::create_for_testing(s.ctx());

        let (mut app, cap) = app::create_app(
            b"n1", b"d1", b"text/html", html_chunks(), &clock, s.ctx(),
        );

        clock::increment_for_testing(&mut clock, 500);
        app::update_metadata(&mut app, &cap, b"new name", b"new desc", b"text/html", &clock);

        assert!(app::name(&app).as_bytes() == b"new name", 0);
        assert!(app::description(&app).as_bytes() == b"new desc", 1);
        // app_version stays the same (only content updates bump it).
        assert!(app::app_version(&app) == 1, 2);
        assert!(app::chunk_count(&app) == 3, 3);
        assert!(app::updated_at_ms(&app) > app::published_at_ms(&app), 4);

        app::destroy_for_testing(app, cap);
        clock::destroy_for_testing(clock);
        ts::end(s);
    }

    #[test]
    #[expected_failure(abort_code = E_WRONG_APP)]
    fun update_with_wrong_cap_fails() {
        let mut s = ts::begin(PUBLISHER);
        let clock = clock::create_for_testing(s.ctx());

        let (mut app_a, cap_a) = app::create_app(
            b"a", b"", b"text/html", html_chunks(), &clock, s.ctx(),
        );
        let (app_b, cap_b) = app::create_app(
            b"b", b"", b"text/html", html_chunks(), &clock, s.ctx(),
        );

        // Using cap_b to update app_a must abort.
        let mut new_chunks = vector::empty<vector<u8>>();
        new_chunks.push_back(b"x");
        app::update_app(&mut app_a, &cap_b, b"x", b"", b"text/html", new_chunks, &clock);

        app::destroy_for_testing(app_a, cap_a);
        app::destroy_for_testing(app_b, cap_b);
        clock::destroy_for_testing(clock);
        ts::end(s);
    }

    #[test]
    fun registry_tracks_apps() {
        let mut s = ts::begin(PUBLISHER);
        registry::init_for_testing(s.ctx());
        s.next_tx(PUBLISHER);

        let mut reg = s.take_shared<Registry>();
        let clock = clock::create_for_testing(s.ctx());

        let (app, cap) = app::create_app(
            b"n", b"", b"text/html", html_chunks(), &clock, s.ctx(),
        );
        let app_id = object::id(&app);
        registry::register(&mut reg, app_id);

        assert!(registry::count(&reg) == 1, 0);
        assert!(registry::app_at(&reg, 0) == app_id, 1);
        assert!(registry::contains(&reg, app_id), 2);

        // A second app bumps the counter and is indexed under the next slot.
        let (app2, cap2) = app::create_app(
            b"n2", b"", b"text/html", html_chunks(), &clock, s.ctx(),
        );
        let app_id2 = object::id(&app2);
        registry::register(&mut reg, app_id2);
        assert!(registry::count(&reg) == 2, 3);
        assert!(registry::app_at(&reg, 1) == app_id2, 4);

        app::destroy_for_testing(app, cap);
        app::destroy_for_testing(app2, cap2);
        clock::destroy_for_testing(clock);
        ts::return_shared(reg);
        ts::end(s);
    }

    #[test]
    fun unused_address_is_other() {
        // Silences unused-constant warnings for OTHER while giving us a
        // single place to note that access control is enforced by the cap
        // transfer, which the `update_with_wrong_cap_fails` test covers.
        assert!(OTHER != PUBLISHER, 0);
    }
}

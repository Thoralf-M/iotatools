# onchain_apps

Move smart contracts that power the **On-Chain Apps** page of [iotatools.dev](https://iotatools.dev).

## Overview

Three modules:

| Module              | Purpose                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `app`               | `App` shared object holding web-app metadata. Payload bytes are stored as plain **dynamic fields** (`ChunkKey { index }`).    |
| `registry`          | `Registry` shared object indexing every published app so the UI can enumerate the catalogue without an external indexer.     |
| `generic_storage`   | `Storage` shared object with per-user and per-app key/value storage, for apps that need persistent on-chain state.            |

### Design notes

- The top-level `App` object is intentionally small. Loading the list of apps only reads metadata; the actual bytes are loaded lazily.
- Chunks are **dynamic fields**, not dynamic *object* fields — we just need `vector<u8>` values, not separate objects.
- `PACKAGE_VERSION` is stamped into every `App` and can be bumped with a Move package upgrade to introduce new features.
- Each `App` has its own `app_version` that is bumped on every content update.
- Every update requires the publisher's `AppCap`; without it, the `App` is immutable.
- The default chunk cap is **256 KiB**. Clients should target ~128 KiB to leave room for tx overhead.

## Build & test

Install the IOTA CLI (`iota`), then from the `move/onchain_apps` directory:

```bash
iota move build
iota move test
```

## Publish to devnet

```bash
iota client switch --env devnet
iota client faucet                # get free devnet IOTA
iota client publish --gas-budget 500000000
```

Write down:

- the **package id** of the resulting publish,
- the object id of the shared `Registry` (from the object changes of the publish tx),
- the object id of the shared generic `Storage`.

Open the *On-Chain Apps* page in iotatools.dev and paste those three ids into the configuration panel. They are persisted in `localStorage`.

## Upgrading

```toml
# Move.toml after the first publish
published-at = "0x<package id>"

[addresses]
onchain_apps = "0x<package id>"
```

Then:

```bash
iota client upgrade --upgrade-capability <UpgradeCap>
```

Bump `PACKAGE_VERSION` in `app.move` for each breaking or feature-adding upgrade. Existing apps keep working because the UI reads the metadata from the object itself.

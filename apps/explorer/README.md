# IOTASCOPE — IOTA Explorer

A developer-grade blockchain explorer for IOTA, built entirely on the
**`@iota/sdk-wasm`** bindings of [`iota-rust-sdk`](../iota-rust-sdk) —
`iota-sdk-ffi` compiled to `wasm32-unknown-unknown` via UniFFI /
uniffi-bindgen-react-native. All chain access (GraphQL transport, BCS
codecs, digest derivation, type parsing) runs through the wasm module in the
browser; there is no separate backend.

## Prerequisites

The wasm package is consumed as a local `file:` dependency and must be built
first:

```bash
# one-time toolchain setup (macOS)
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.122 --locked
brew install llvm          # Apple clang has no wasm32 backend (needed for blst)
npm install -g pnpm

# build the bindings
cd ../iota-rust-sdk
export LLVM_BIN="$(brew --prefix llvm)/bin"
export CC_wasm32_unknown_unknown="$LLVM_BIN/clang"
export AR_wasm32_unknown_unknown="$LLVM_BIN/llvm-ar"
make wasm                  # → bindings/wasm/dist/
```

## Run

Standalone (path routing, BrowserRouter):

```bash
pnpm --filter iota-explorer dev     # from the iotatools root
# or: cd apps/explorer && pnpm dev
```

Integrated into iotatools: the root `pnpm build` also runs
`build:integrated` (relative base + hash routing for static hosting) and
bundles the output under `docs/explorer/` — reachable at
`https://iotatools.dev/explorer/` and linked from the tools page as
"Explorer ↗".

Networks: mainnet (default), testnet, devnet, localnet, or any custom GraphQL
endpoint — switchable in the top bar, persisted in localStorage.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Live network pulse: epoch, checkpoint stream, throughput, latest transactions |
| `/checkpoints`, `/checkpoint/:id` | Stream + full summary, rolling gas, contained txs, signing-message BCS |
| `/transactions`, `/tx/:digest` | Filterable list; PTB inputs/commands with dataflow, effects, events, signatures, raw JSON, BCS with locally re-derived digest |
| `/epochs`, `/epoch/:id` | Epoch history; economics, storage fund, committee, protocol version |
| `/events` | Event stream with full `EventFilter` surface |
| `/analytics` | Client-side network history: throughput, fees, rewards, stake, supply / net inflation (mint vs burn) — interactive hover charts |
| `/objects`, `/object/:id` | Object queries by type/owner; contents, browsable dynamic fields (Table/Bag containers incl. bare table UIDs), BCS, time-travel by version |
| `/packages`, `/package/:id` | Package directory; module browser with function signatures, structs, enums, linkage, type origins, view-function runner, live activity (calls + events) |
| `/address/:addr` | Balance breakdown, portfolio, assets, staking positions, human-readable activity feed (net amounts, counterparties, status), owned objects with type facets |
| `/coin/:type`, `/names` | Coin metadata + supply; IOTA-Names lookup |
| `/staking` | Network staking stats, rewards calculator, look up any address's positions |
| `/validators`, `/validator/:addr` | Committee with stake distribution (joined/left diff per epoch); per-validator profile |
| `/graphql` | GraphQL console through `client.runQuery` with presets + service config |
| `/protocol/:version?` | Every feature flag and parameter of a protocol version |
| `/lab/decode` | Local BCS decoder: paste bytes, decode against any chain type |
| `/lab/dryrun` | Dry-run transaction bytes against the network (no gas, no commit) |

Search (`/` to focus) resolves addresses, object ids, digests (tx → checkpoint
fallback), checkpoint numbers, `name.iota`, `pkg::module::Type`, and
`epoch:N` / `cp:N` prefixes — validated through the SDK's own parsers.

## Known wasm-binding quirks (worked around here)

Status as of the 2026-07 SDK rebuild (`make wasm`); documented in code where
relevant. Remaining items are upstream candidates for `iota-rust-sdk`:

1. `client.checkpoint(digest, undefined)` returns null for existing digests
   (the seq-number variant works). Digest→sequence resolution goes through
   `client.runQuery` in `src/lib/checkpoints.ts`.
2. `client.runQuery` resolves to the GraphQL `data` payload serialized as a
   JSON **string**, not an object (`parseRunQuery` handles both). Related:
   `Query.variables` is typed as `Value` in the generated d.ts, but the
   runtime converter expects a JSON **string** — always `JSON.stringify`
   the variables (see `gql()` in `src/lib/gql.ts`).
3. The wasm HTTP layer sets a `User-Agent` header on every fetch. Chromium
   silently drops it, but **Safari forwards it into the CORS preflight**,
   which the public GraphQL endpoints reject — every request fails. The app
   installs a small `fetch` shim at boot that strips the header
   (`src/lib/sdk.tsx`). Upstream fix: skip `.user_agent()` on wasm32 in
   `iota-sdk-graphql-client` (client.rs).

Breaking API renames that came with the rebuild:

- `Query.query` → `Query.queryString`.
- Digests are now typed: `client.transaction()` takes a
  `TransactionDigest.fromBase58(…)` — the generic `Digest` no longer lowers
  ("Cannot lower this object to a pointer").
- `UserSignature.as*Opt()` / `PublicKey.as*Opt()` dropped; the `as*()`
  accessors throw on non-matching variants instead of returning undefined.
- `TypeOrigin.package_` → `package`, `TransactionsFilter.function_` →
  `function`; `SignatureScheme.ZkLoginAuthenticatorDeprecated` removed.

## Notes

- Validator commission displays the **IIP-8 effective rate**
  (`max(commission, votingPower)`, protocol ≥ 20) next to the declared rate —
  mirrors `validator_set.move` and the GraphQL `effectiveCommissionRate` field.
- Validator staking pools are wrapped inside the system state object (`0x5`)
  and have no standalone object record; the object page explains this instead
  of erroring, and offers dynamic-field / view-as-address escapes.

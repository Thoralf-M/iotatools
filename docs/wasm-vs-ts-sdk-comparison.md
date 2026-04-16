# WASM SDK vs TypeScript SDK: Can We Replace @iota/iota-sdk?

A comparison of the IOTA WASM binding (Rust/uniffi) with the pure-TypeScript
`@iota/iota-sdk` to evaluate whether the WASM SDK can fully replace the TS SDK
in browser applications like iotatools.dev.

---

## At a Glance

| Dimension | WASM SDK (Rust) | TS SDK (@iota/iota-sdk) |
|---|---|---|
| Language | Rust compiled to WASM via wasm-bindgen + uniffi | Pure TypeScript |
| Binary / bundle | **7.2 MB** uncompressed, **~2.2 MB** gzipped | Tree-shakeable; JS assets for iotatools total ~6.4 MB uncompressed (includes app code + all deps) |
| Crypto implementation | Rust-native (ed25519-dalek, k256, p256) | Pure JS (@noble/curves, @noble/hashes) |
| Network client | GraphQL-native `GraphQlClient` | `IotaClient` (JSON-RPC) + optional GraphQL transport |
| BCS support | Pre-compiled Rust types only | Flexible schema builder (`bcs.struct(...)`) |
| Tree-shaking | Not possible (monolithic WASM blob) | Excellent (modular entry points) |
| API surface | 113 classes, 441 functions, 113 interfaces | Modular: client, transactions, crypto, bcs, graphql, multisig, verify |

---

## Pros of the WASM SDK

### 1. Single source of truth with the Rust codebase
The WASM binding is auto-generated from the same Rust crates that power IOTA
nodes and the CLI. This means **type definitions, serialization logic, and
cryptography are always in sync** with the protocol. No risk of the SDK
drifting from the canonical implementation.

### 2. Faster and auditable cryptography
Rust's `ed25519-dalek`, `k256`, and `p256` crates are well-audited and
significantly faster than their JS equivalents for CPU-intensive operations
(key derivation, signature verification, BLS). For apps that do batch
verification or heavy signing, this matters.

### 3. Comprehensive protocol coverage
The WASM SDK exposes **113 classes** covering the full protocol surface:
transaction types (v1-v4), epoch changes, checkpoint structures, ZkLogin,
Passkey authentication, BLS12-381, multisig aggregation, and more. Many of
these are internal protocol types that the TS SDK doesn't expose at all.

### 4. Correct BCS by construction
BCS serialization/deserialization is generated from the Rust type definitions.
There is no risk of hand-written BCS schemas diverging from the actual
on-chain format, which is a real risk with the TS SDK's manual `bcs.struct()`
definitions.

### 5. GraphQL-native client
The WASM SDK's `GraphQlClient` talks GraphQL directly without needing the
JSON-RPC to GraphQL translation layer (`@iota/graphql-transport`). This
simplifies the networking stack as IOTA moves toward GraphQL as its primary API.

### 6. Consistent cross-platform behavior
The same Rust code compiles to WASM (browser), native (mobile via uniffi), and
server. Behavior is identical across all targets, reducing platform-specific
bugs.

---

## Cons of the WASM SDK

### 1. Large binary size (the biggest concern)
- **Uncompressed:** 7.2 MB (WASM) + ~2 MB (JS glue, 56k-line FFI file)
- **Gzipped (browser load):** ~2.2 MB for the WASM binary alone
- For comparison, the entire current iotatools JS bundle is ~6.4 MB
  uncompressed. The WASM binary alone nearly matches that.
- **Impact:** Slower initial page load, higher bandwidth usage, problematic on
  mobile networks. The WASM must be fetched, compiled, and initialized before
  *any* SDK function can be called.

### 2. No tree-shaking
The WASM binary is a monolithic blob. Even if the app only uses `Address` and
`GraphQlClient`, the full 7.2 MB is loaded. The TS SDK has modular entry
points (`/client`, `/bcs`, `/transactions`, `/crypto`, etc.) so bundlers
include only what's imported.

### 3. Missing flexible BCS schema builder
The TS SDK's `bcs.struct('StakedIota', { ... })` lets apps define custom BCS
schemas for *any* Move struct. The WASM SDK only has pre-compiled types. This
breaks:
- Dynamic field BCS decoding
- Custom staking struct deserialization
- Move authenticator parsing
- Any app that needs to decode arbitrary on-chain data

This is a **hard blocker** for apps that work with custom Move types.

### 4. No typed GraphQL (loss of DX)
The TS SDK provides typed GraphQL via `graphql` tagged templates and
`gql.tada`, giving compile-time type safety for queries. The WASM SDK only
offers `runQuery(queryString)` with untyped JSON responses. This is a
significant developer experience regression.

### 5. API incompatibility requires adapter layer
The WASM SDK has fundamentally different API shapes:
- `Transaction` class vs `TransactionBuilder` + `ClientTransactionBuilder`
- `IotaClient` (JSON-RPC) vs `GraphQlClient` (GraphQL-only)
- Different type names for the same concepts (e.g., `IotaObjectData` vs
  `ObjectInterface`)

The existing `wasm-sdk.ts` adapter (286 lines) only covers basic operations.
A full migration requires rewriting significant application code.

### 6. WASM initialization overhead
The WASM module requires async initialization (`uniffiInitAsync()`) before any
function can be called. This adds complexity:
- Must handle the loading state in the UI
- Cannot use SDK functions at module import time
- Server-side rendering / pre-rendering is not possible
- Test environments (vitest/jsdom) need special WASM setup

### 7. Gaps in key functionality
Currently missing features that iotatools uses:

| Feature | TS SDK | WASM SDK |
|---|---|---|
| BIP39 mnemonic derivation | `Ed25519Keypair.deriveKeypairFromSeed()` | Not exposed |
| Signature parsing | `parseSerializedSignature()` | Internal only |
| Intent message construction | `messageWithIntent()` | Internal only |
| Partial multisig parsing | `parsePartialSignatures()` | Has `MultisigAggregator` (different API) |
| Public key from raw bytes | `publicKeyFromRawBytes()` | Has verifier classes (different API) |
| Ledger signing integration | Low-level signature construction | Handles signing internally |
| `devInspectTransactionBlock` | Available via JSON-RPC | Not available |

### 8. Debugging is harder
WASM stack traces are opaque compared to TypeScript. When something goes wrong
inside the WASM module, the error messages and stack traces point to WASM
memory offsets rather than readable source locations. The TS SDK is fully
source-mappable.

### 9. Dependency on uniffi-bindgen-react-native runtime
The FFI layer depends on `uniffi-bindgen-react-native`, which adds another
runtime dependency and is primarily designed for React Native, not web
applications. This is an unusual dependency for a browser-targeted project.

---

## Bundle Size Comparison

```
Current setup (TS SDK):
  JS assets total:     ~6.4 MB uncompressed (app + all deps, tree-shaken)
  No WASM binary

WASM SDK setup:
  WASM binary:          7.2 MB uncompressed / ~2.2 MB gzipped
  JS FFI glue:         ~2.0 MB (56,555-line generated file)
  App JS (reduced):     ~4-5 MB (minus TS SDK deps, plus adapter code)
  Total:               ~13-14 MB uncompressed
```

The WASM approach roughly **doubles** the total asset size.

---

## Feasibility Assessment

### Can the WASM SDK fully replace the TS SDK today?

**No, not without significant gaps.** The three blocking issues are:

1. **Custom BCS schemas** - Apps that decode arbitrary Move structs cannot work
   with only pre-compiled BCS types. A separate `@iota/bcs` dependency or a
   custom BCS implementation would still be needed.

2. **Ledger/hardware wallet signing** - The WASM SDK internalizes signing,
   but hardware wallets need low-level access to intent messages and raw
   signature construction (`messageWithIntent`, `toSerializedSignature`).

3. **Bundle size** - A ~2.2 MB gzipped WASM binary is a significant payload
   for a web application, especially one that lazy-loads pages. Every user
   pays this cost upfront regardless of which features they use.

### Hybrid approach (recommended path forward)

A practical middle ground:

| Use WASM SDK for | Keep TS SDK for |
|---|---|
| Transaction building & execution | Custom BCS schema definitions |
| GraphQL client operations | Typed GraphQL queries (gql.tada) |
| Cryptographic operations (signing, verification) | Ledger/Keystone signature construction |
| Address validation & normalization | BIP39 mnemonic derivation |
| BCS serialization of known protocol types | Decoding arbitrary Move structs |

This is essentially what `wasm-sdk.ts` already implements - an adapter that
selectively uses the WASM SDK while falling back to the TS SDK where needed.

---

## Recommendation

**Short term:** Continue with the hybrid approach. Use the WASM SDK where it
provides clear value (correctness of BCS encoding, GraphQL client, protocol
types) and keep the TS SDK for flexibility (custom BCS, typed GraphQL, hardware
wallet integration).

**Medium term:** Work with the WASM SDK team to:
1. Expose BIP39/mnemonic derivation
2. Add low-level signature construction APIs for hardware wallet integration
3. Explore splitting the WASM binary into smaller modules (crypto, client,
   transactions) to enable partial loading
4. Add a flexible BCS schema builder on the WASM side

**Long term:** If the WASM binary can be reduced to <1 MB gzipped and the API
gaps are closed, a full replacement becomes viable. Until then, the TS SDK
remains necessary for a complete web application.

---

*Generated for iotatools.dev - April 2026*

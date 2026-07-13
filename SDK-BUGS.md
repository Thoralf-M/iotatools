# `@iota/sdk-wasm` bugs & behavioral regressions

Issues found in **`@iota/sdk-wasm@3.0.0-alpha.1`**
(https://github.com/iotaledger/iota-rust-sdk) while migrating IOTA Tools off
`@iota/iota-sdk`. Each entry lists what breaks, how it was verified, and the
workaround currently applied in the codebase.

The separate "GAP DOCUMENTATION" block at the bottom of
[`src/lib/utils/wasm-sdk.ts`](src/lib/utils/wasm-sdk.ts) tracks _missing
features_ (things the WASM SDK simply doesn't provide). This file tracks
_bugs_ — things that exist but behave incorrectly or inconsistently.

---

## 1. `Address.fromHex()` rejects abbreviated / short-form addresses

**Severity:** high (functional regression)

`Address.fromHex()` accepts _only_ a full 64-character hex string. Any
abbreviated form throws, including the extremely common short constants
(`0x5`, `0x6`, …):

```
Address.fromHex('0x5')
// Error: SdkFfiError.Generic: address must be hex string of length 64
Address.fromHex('5')          // throws
Address.fromHex('0X5')        // throws (uppercase 0X prefix)
```

The old `@iota/iota-sdk` `normalizeIotaAddress()` / `isValidIotaAddress()`
left-padded short addresses, so `0x5` was valid input. With the WASM SDK, code
that routes user input through `Address.fromHex()` silently rejects valid
addresses.

**Verified:** Node probe against `dist/node.js` after `initAsync()`.

**Workaround:** use `Address.fromPrefixedShortHex()` (or `fromShortHex()` for
un-prefixed input) instead — these left-pad and accept both short and full
forms:

```
Address.fromPrefixedShortHex('0x5').toCanonicalString(true)
// 0x0000000000000000000000000000000000000000000000000000000000000005
```

Applied in:

- [`src/lib/utils/wasm-sdk.ts`](src/lib/utils/wasm-sdk.ts) — `isValidIotaAddress()`
  and `normalizeIotaAddress()` now use `fromPrefixedShortHex()`.
- [`src/lib/pages/faucet/Faucet.svelte`](src/lib/pages/faucet/Faucet.svelte) —
  faucet request uses `fromPrefixedShortHex()` (it validated with
  `isValidIotaAddress` but then re-parsed with the strict `fromHex`, so a `0x5`
  passed validation and then threw).

**Note:** `fromHex()` also does not accept the `0X` (uppercase) prefix.

---

## 2. `base64Encode()` / `base64Decode()` require the full WASM binary to be initialized

**Severity:** medium (usability / testability)

Base64 is a pure, dependency-free transform, but these helpers are implemented
as WASM FFI calls. Calling them before `initAsync()` has run throws an opaque
internal error rather than a clear "not initialized" message:

```
base64Encode(new Uint8Array([1,2,3]).buffer)
// TypeError: Cannot read properties of undefined (reading 'rustcallstatus_new')
```

This means every context that only needs base64 must first download and
instantiate the ~2 MB `index_bg.wasm`. In particular it breaks the Vitest/jsdom
test environment, where the binary isn't loaded.

**Verified:** Node probe — calling `base64Encode` on a fresh import (no
`initAsync()`) throws `rustcallstatus_new`; the same call succeeds after
`initAsync()`.

**Workaround:** [`src/lib/utils/wasm-sdk.ts`](src/lib/utils/wasm-sdk.ts) ships
pure-JS `base64Encode` / `base64Decode` (btoa/atob based) and exports those
instead of the WASM versions, so encoding works everywhere including tests.

---

## 3. `MultisigMemberPublicKeyInterface` type export dropped in the published package

**Severity:** low (typing inconsistency)

The generated `iota_sdk_ffi` bindings reference `MultisigMemberPublicKeyInterface`
internally (it is the return type of `MultisigMember.publicKey()`), but the
published package's public entry point does **not** re-export the type, even
though sibling interfaces like `MultisigMemberInterface` are exported. Importing
it fails to type-check:

```
'"@iota/sdk-wasm"' has no exported member named 'MultisigMemberPublicKeyInterface'.
Did you mean 'MultisigMemberInterface'?
```

**Verified:** `Object.keys(sdk).includes('MultisigMemberPublicKeyInterface')` is
`false` while the type is used in the `.d.ts` internals; `svelte-check` fails on
the import.

**Workaround:** the app doesn't consume this type, so the re-export was simply
removed from [`src/lib/utils/wasm-sdk.ts`](src/lib/utils/wasm-sdk.ts).

---

## Packaging note (not a bug, but a footgun)

The bundled ESM entry (`dist/iota-sdk.js`) locates its binary via
`new URL('./index_bg.wasm', import.meta.url)`. Vite's dependency optimizer
(esbuild) rewrites that URL and breaks the lookup, so `@iota/sdk-wasm` must be
listed under `optimizeDeps.exclude` in
[`vite.config.ts`](vite.config.ts). Worth flagging upstream as a docs/DX item.

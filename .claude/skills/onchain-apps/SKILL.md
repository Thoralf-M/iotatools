---
name: onchain-apps
description: |
    Author web apps that run on the IOTA Tools "On-Chain Apps" page. The skill
    describes the JavaScript bridge (`window.iota`) that is injected into every
    sandboxed app iframe, how to query and write on-chain state, how to
    build/sign/execute programmable transaction blocks from inside the iframe,
    how to persist per-user data in `localStorage`, and how to upload or
    upgrade an app - either via `iota client publish`/`iota client upgrade` or
    via the in-page publish / update forms.
    Use this skill whenever the user asks Claude to write, debug, or upgrade
    a small web app (game, tool, dashboard, ...) for this on-chain app
    platform.
---

# Building apps for the IOTA On-Chain Apps page

You are writing a small, self-contained HTML + JavaScript app. The app will be
stored on the IOTA devnet by splitting its bytes into chunks attached as
*dynamic fields* on a shared Move `App` object. When a user opens the On-Chain
Apps page and selects the app, iotatools reassembles the bytes and loads them
into a sandboxed iframe. The iframe is given access to a tiny `window.iota`
bridge that lets the app:

- know who the active signer is,
- query on-chain state through the standard `IotaClient` RPC,
- build, sign, and execute programmable transaction blocks,
- read / write per-user and per-app shared state via the generic-storage Move
  contract,
- read / write per-app entries in the browser's `localStorage`,
- resize its own iframe.

All of this happens over `postMessage`. The host keeps the private key - the
app never sees it.

## Iframe environment

The app runs with `sandbox="allow-scripts"` (no `allow-same-origin`). This
means:

- The app's origin is `null` / opaque. You cannot reach cookies, the parent
  `localStorage`, fetch a same-origin URL, etc.
- You *can* make CORS requests to the wider internet (e.g. fetch public
  assets), but prefer on-chain storage wherever possible.
- Do **not** depend on `window.parent` beyond `postMessage` - the bridge is
  the only supported channel.

The **entire app payload must be self-contained**: inline your CSS and JS,
inline images as data URLs, etc. The only external entry point is `window.iota`.

## The `window.iota` bridge

Every call returns a `Promise`. All messages are asynchronous.

### `iota.getAddress(): Promise<string>`

Returns the active IOTA address as a `0x`-prefixed hex string. This is the
signer for every transaction the host will execute on behalf of the app.

### `iota.getNetwork(): Promise<string>`

Returns the currently selected network name (e.g. `"devnet"`).

### `iota.getAppId(): Promise<string>`

Returns the on-chain object id of *this* app. Pair it with
`iota.storage.*` to scope state to the app.

### `iota.client` — read-only RPC proxy

Thin wrapper around an `IotaClient` running on the host. Every method is
forwarded to the SDK and the raw response is returned. Helpers on `iota.client`:

- `getObject(input)` → `{ data: { objectId, digest, content: {...} } }`
- `multiGetObjects(input)` → array of the above
- `getOwnedObjects(input)`
- `getDynamicFields(input)`
- `getDynamicFieldObject(input)`
- `getBalance(input)` → `{ coinType, totalBalance, coinObjectCount }`
- `getCoins(input)`
- `getReferenceGasPrice()`
- `getLatestCheckpointSequenceNumber()`
- `queryEvents(input)`
- `call(method, args)` — escape hatch for any other `IotaClient` method. `args`
  is the positional argument array.

All inputs are the same shapes as the `@iota/iota-sdk/client` SDK docs.

```js
const { totalBalance } = await iota.client.getBalance({ owner: await iota.getAddress() });
```

### `iota.signAndExecuteTransaction(txJson)`

Signs and executes a programmable transaction block. `txJson` is the JSON
produced by `Transaction.toJSON()` from `@iota/iota-sdk/transactions` - either
the serialized string or a plain object. Because the sandboxed iframe cannot
load npm packages directly, the canonical way to build a PTB from inside an
app is to construct the JSON by hand using the template below.

The returned value is an `IotaTransactionBlockResponse` with
`showEffects: true, showObjectChanges: true, showEvents: true`.

#### Minimal PTB JSON template

```js
const txJson = {
    version: 2,
    sender: await iota.getAddress(),
    expiration: { None: true },
    gasData: { payment: [], owner: null, price: null, budget: null },
    inputs: [
        // Pure inputs: { Pure: { bytes: base64 } }
        // Object inputs: { Object: { ... } }
    ],
    commands: [
        // { MoveCall: { package, module, function, type_arguments, arguments } }
        // { TransferObjects: { objects, address } }
        // ... see `Transaction` in @iota/iota-sdk/transactions
    ],
};
const result = await iota.signAndExecuteTransaction(txJson);
```

**Simpler alternatives:** prefer the on-chain storage helpers below, which
hide the PTB plumbing. Only reach for `signAndExecuteTransaction` when you
actually need a bespoke PTB (e.g. move-calling your own package, splitting
coins, transferring NFTs, ...).

### `iota.storage` — generic on-chain key/value store

Every app shares a single `Storage` Move object. Entries are keyed by
`(appId, user, key)` (per-user) or `(appId, key)` (per-app shared). Values
are `Uint8Array` on chain; the bridge handles UTF-8 encoding for convenience.

- `iota.storage.set(key, value) -> Promise<IotaTransactionBlockResponse>`
- `iota.storage.get(key, { user?, encoding? }) -> Promise<string | null>`
- `iota.storage.remove(key) -> Promise<IotaTransactionBlockResponse>`
- `iota.storage.setShared(key, value) -> Promise<IotaTransactionBlockResponse>`
- `iota.storage.getShared(key, { encoding? }) -> Promise<string | null>`

Notes:

- `key` is a UTF-8 string (≤ ~1 KiB is plenty).
- `value` is a string (UTF-8 encoded) or a `Uint8Array`. Accepts
  `{ base64: "..." }` for arbitrary binary payloads.
- By default `get` and `getShared` return `null` if the entry does not exist,
  or a UTF-8 string if it does. Pass `{ encoding: "base64" }` to get
  base64-encoded bytes for binary data.
- `set`/`setShared`/`remove` cost gas. Each call is a separate transaction.
- `get`/`getShared` are read-only (no gas, no tx).

```js
// per-user profile
await iota.storage.set('name', 'alice');
const name = await iota.storage.get('name'); // 'alice'

// shared leaderboard
await iota.storage.setShared('highscore:alice', '9000');
const score = await iota.storage.getShared('highscore:alice');

// read somebody else's per-user entry
const bobName = await iota.storage.get('name', { user: '0xBOB...' });
```

### `iota.localStorage` — sandboxed browser localStorage

Each app gets its own namespace (`onchainApps:<appId>:<key>`). Perfect for
transient state that does not belong on chain: UI preferences, draft text,
session-only secrets, etc.

- `iota.localStorage.get(key) -> Promise<string | null>`
- `iota.localStorage.set(key, value) -> Promise<true>`
- `iota.localStorage.remove(key) -> Promise<true>`

The host's signer private key is **NOT** exposed through this API.

### `iota.resize(heightInPixels)`

Ask the host to resize the iframe height. No Promise; returns immediately.
Use this after rendering so users do not see inner scrollbars.

```js
iota.resize(document.body.scrollHeight);
```

### `iota.webrtc` — peer-to-peer data channels via on-chain signaling

Two helpers for establishing a WebRTC `RTCDataChannel` between two browser
tabs / devices, using on-chain shared storage as the signaling channel. Once
connected, **all communication is peer-to-peer** — no data hits the chain.

#### `iota.webrtc.host(opts?) -> Promise<{ channel, roomId, pc }>`

Creates a room, writes the SDP offer to shared storage, and waits for
a peer to answer. Returns when the `RTCDataChannel` is open.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `roomId` | `string` | random UUID | Identifier for the room. Share this with the peer. |
| `iceServers` | `RTCIceServer[]` | Google STUN | Custom STUN/TURN servers. |
| `timeout` | `number` | 120000 | Milliseconds to wait for the peer before rejecting. |
| `label` | `string` | `'data'` | Data channel label. |

#### `iota.webrtc.join(opts) -> Promise<{ channel, roomId, pc }>`

Joins an existing room. Reads the offer from shared storage, writes the
answer back, and waits for the data channel to open.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `roomId` | `string` | *required* | Room to join. |
| `iceServers` | `RTCIceServer[]` | Google STUN | Custom STUN/TURN servers. |
| `timeout` | `number` | 120000 | Milliseconds to wait for the offer before rejecting. |

#### Example: two-player game lobby

```js
// Player 1 (host)
const { channel, roomId } = await iota.webrtc.host();
log('Room: ' + roomId + ' — share this with Player 2');
channel.onmessage = (e) => log('P2 says: ' + e.data);
channel.send('hello from Player 1');

// Player 2 (guest, in another browser tab)
const { channel } = await iota.webrtc.join({ roomId: 'paste-room-id-here' });
channel.onmessage = (e) => log('P1 says: ' + e.data);
channel.send('hello from Player 2');
```

**How it works under the hood:**
1. Host creates an `RTCPeerConnection`, generates an SDP offer, waits for
   ICE gathering to finish, then writes the complete offer to
   `iota.storage.setShared('webrtc:<roomId>:offer', ...)`.
2. Guest polls `iota.storage.getShared('webrtc:<roomId>:offer')` every
   ~2.5 s until it appears, sets it as remote description, generates an
   answer (with ICE), and writes it to `…:answer`.
3. Host picks up the answer, sets remote description. WebRTC punches
   through NAT via STUN. The `RTCDataChannel` opens.
4. From this point on, `channel.send()` / `channel.onmessage` are direct
   peer-to-peer — low latency, no gas, no chain involvement.

**Privacy:** The SDP offer/answer are written to public on-chain storage.
They contain your public IP (via ICE candidates). If that is a concern,
encrypt the SDP blobs with a shared room password before writing, or use a
TURN server that masks your IP.

## App authoring rules

Keep the payload small and self-contained:

1. **One file.** Inline CSS, JS, and small images (`data:` URLs). The publish
   form takes a single HTML blob.
2. **No external fetches** unless absolutely required. Public CDN assets will
   work, but they make your app fragile.
3. **Initialise lazily.** Wait for `DOMContentLoaded` (or rely on deferred
   execution) before touching the DOM.
4. **Handle errors.** All `iota.*` calls can reject (no funds, wrong network,
   rejected tx, storage entry missing). Always `try { ... } catch (e) { ... }`
   around them.
5. **Namespace your storage keys.** Prefix `"v1:"` so later app versions can
   migrate data. Shared keys should include the user address to avoid
   collisions (`"score:" + addr`).
6. **Don't leak secrets.** The sandbox is not a secure enclave. Treat
   `iota.localStorage` like browser localStorage - anything written there is
   visible to the host and to the user. Never store keys stronger than
   "session convenience".
7. **Be forgiving.** `getAppId()`, `getAddress()`, and `getNetwork()` are
   cheap - call them on startup and cache the results.

## Skeleton

```html
<h2 id="t">Loading...</h2>
<pre id="log"></pre>
<script>
(async () => {
    const log = (m) => { document.getElementById('log').textContent += m + String.fromCharCode(10); };
    try {
        const [addr, net, appId] = await Promise.all([
            iota.getAddress(),
            iota.getNetwork(),
            iota.getAppId(),
        ]);
        document.getElementById('t').textContent = 'Connected on ' + net;
        log('address: ' + addr);
        log('app id:  ' + appId);

        // Load saved state.
        const saved = await iota.storage.get('v1:greeting');
        if (saved) log('saved greeting: ' + saved);

        // Save an entry on chain. Every `set` costs gas.
        await iota.storage.set('v1:greeting', 'hello ' + Date.now());
        log('saved new greeting');

        // Resize so the user sees all the log output.
        iota.resize(document.body.scrollHeight + 16);
    } catch (e) {
        log('error: ' + (e.message || e));
    }
})();
</script>
```

## Publishing and upgrading an app

Apps are stored in the `onchain_apps::app::App` Move object. Publishing and
updating both go through the same page under *On-Chain Apps*.

### Publish from the web page (recommended for first-time users)

1. Open the **On-Chain Apps** tab on iotatools.dev.
2. Click **Generate new random key** if you do not have one yet (devnet only!)
   and **Request devnet IOTA from faucet**.
3. In the *Package configuration* panel, paste:
   - the `onchain_apps` package id,
   - the shared `Registry` object id,
   - the shared `Storage` object id.
4. Click **+ Publish new app**, fill in *name*, *description*, paste the HTML
   payload (or load a file), and click **Publish to devnet**.
5. After the tx lands, the page shows a share link containing the new
   `appId`. Anybody with that link loads the app from chain.

The form chunks the payload automatically (96 KiB per chunk) and, if needed,
sends follow-up `append_chunks` transactions. You do not have to worry about
the 256 KiB per-chunk hard cap or the move tx size limit.

### Publish / upgrade via the IOTA CLI

For package-level upgrades (adding new entry functions etc.):

```bash
cd move/onchain_apps
iota move build
iota move test
iota client switch --env devnet
iota client faucet
iota client publish --gas-budget 500000000
```

Take note of the package id printed in the output, then set it in `Move.toml`
under `[addresses]` and `published-at`, and use `iota client upgrade` for the
next iteration.

### Upgrading your own app (new version of an existing app)

Every `App` is paired with a `onchain_apps::app::AppCap` that is transferred
to the publisher at creation time. Holding the cap is what lets you upgrade.
On the **On-Chain Apps** page the list of caps you own appears under
*My apps* - click one and use the **Update** form to publish a new name,
description, or payload.

Because the `App` itself is a shared object, its object id does not change on
upgrade. Every user who loads the app via that id automatically gets the
latest `app_version` the next time they open it; caches should key on
`app_version` (or `updated_at_ms`) to bust when needed.

Under the hood the update flow:

1. Encodes the payload into chunks (96 KiB each).
2. Sends one `app::update_app(app, cap, name, description, content_type, chunks[0], clock)`.
3. Sends `app::append_chunks(app, cap, chunks[i], clock)` for any remaining chunks.

Losing the `AppCap` means losing the ability to upgrade the app. Treat it
like a Move `OwnerCap`: keep it in a wallet you control, optionally transfer
it to a DAO or another address if you want to hand over maintenance.

## Things to NOT do

- Don't rely on cookies, IndexedDB (the origin is sandboxed), or
  cross-iframe window access.
- Don't call `window.parent.postMessage` directly with your own shape - use
  the `iota.*` bridge.
- Don't publish code that calls `eval`, loads a `<script src="...">` from an
  untrusted CDN, or otherwise pulls code the publisher did not audit.
- Don't use mainnet addresses or keys. This page is devnet-only by design.
- Don't assume the user is the app's publisher. `getAddress()` returns the
  viewer's signer key, which is freshly generated on first visit.

## Reference: Move types

```move
struct App has key, store {
    id: UID,
    name: String,
    description: String,
    content_type: String,
    app_version: u64,       // bumped on each content update
    package_version: u64,   // version of the onchain_apps package
    published_at_ms: u64,
    updated_at_ms: u64,
    chunk_count: u64,
    total_size: u64,
    publisher: address,
}

// Plain dynamic fields on `App`:
// Field<ChunkKey { index: u64 }, vector<u8>>

struct AppCap has key, store { id: UID, app_id: ID }

// Entry functions (all require the cap for updates):
app::publish(name, description, content_type, chunks, clock, ctx)
app::append_chunks(app, cap, chunks, clock)
app::update_app(app, cap, name, description, content_type, chunks, clock)
app::update_metadata(app, cap, name, description, content_type, clock)

// Generic storage:
generic_storage::set(storage, app_id, key, value, ctx)
generic_storage::remove(storage, app_id, key, ctx)
generic_storage::set_shared(storage, app_id, key, value, ctx)
// reads via dynamic field queries on the storage object
```

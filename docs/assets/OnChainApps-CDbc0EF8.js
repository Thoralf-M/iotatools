import { $ as untrack, B as comment, D as set_class, Dt as pop, E as set_style, I as if_block, Mt as reset, N as each, Nt as noop, Ot as push, R as set_text, Tt as writable, U as delegate, V as from_html, W as delegated, Y as get, _t as remove_textarea_child, at as user_effect, bt as store_mutate, ct as sibling, ft as set, gt as user_derived, h as bind_value, it as template_effect, jt as next, lt as proxy, n as onDestroy, ot as child, pt as state, r as onMount, st as first_child, u as bind_this, v as remove_input_defaults, vt as setup_stores, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import { D as keypairFromBech32PrivateKey, c as IOTA_CLOCK_OBJECT_ID, g as sharedClientConfig, o as Transaction, r as getSelectedNetworkConfig, t as getClient } from "./client-BTFoHz6u.js";
import { L as iotaBcs, Q as toBase64, Z as fromBase64, t as Ed25519Keypair } from "./keypair-DsT3ivIR.js";
import { n as updatePageQueryParams, r as usePageQueryParams, t as getCurrentPageQueryParams } from "./page-query-params-DpZVVwhi.js";
import { n as requestIotaFromFaucetV0 } from "./faucet-DG92jVSx.js";
//#region .claude/skills/onchain-apps/SKILL.md?raw
var SKILL_default = "---\nname: onchain-apps\ndescription: |\n    Author web apps that run on the IOTA Tools \"On-Chain Apps\" page. The skill\n    describes the JavaScript bridge (`window.iota`) that is injected into every\n    sandboxed app iframe, how to query and write on-chain state, how to\n    build/sign/execute programmable transaction blocks from inside the iframe,\n    how to persist per-user data in `localStorage`, and how to upload or\n    upgrade an app - either via `iota client publish`/`iota client upgrade` or\n    via the in-page publish / update forms.\n    Use this skill whenever the user asks Claude to write, debug, or upgrade\n    a small web app (game, tool, dashboard, ...) for this on-chain app\n    platform.\n---\n\n# Building apps for the IOTA On-Chain Apps page\n\nYou are writing a small, self-contained HTML + JavaScript app. The app will be\nstored on the IOTA devnet by splitting its bytes into chunks attached as\n*dynamic fields* on a shared Move `App` object. When a user opens the On-Chain\nApps page and selects the app, iotatools reassembles the bytes and loads them\ninto a sandboxed iframe. The iframe is given access to a tiny `window.iota`\nbridge that lets the app:\n\n- know who the active signer is,\n- query on-chain state through the standard `IotaClient` RPC,\n- build, sign, and execute programmable transaction blocks,\n- read / write per-user and per-app shared state via the generic-storage Move\n  contract,\n- read / write per-app entries in the browser's `localStorage`,\n- resize its own iframe.\n\nAll of this happens over `postMessage`. The host keeps the private key - the\napp never sees it.\n\n## Iframe environment\n\nThe app runs with `sandbox=\"allow-scripts\"` (no `allow-same-origin`). This\nmeans:\n\n- The app's origin is `null` / opaque. You cannot reach cookies, the parent\n  `localStorage`, fetch a same-origin URL, etc.\n- You *can* make CORS requests to the wider internet (e.g. fetch public\n  assets), but prefer on-chain storage wherever possible.\n- Do **not** depend on `window.parent` beyond `postMessage` - the bridge is\n  the only supported channel.\n\nThe **entire app payload must be self-contained**: inline your CSS and JS,\ninline images as data URLs, etc. The only external entry point is `window.iota`.\n\n## The `window.iota` bridge\n\nEvery call returns a `Promise`. All messages are asynchronous.\n\n### `iota.getAddress(): Promise<string>`\n\nReturns the active IOTA address as a `0x`-prefixed hex string. This is the\nsigner for every transaction the host will execute on behalf of the app.\n\n### `iota.getNetwork(): Promise<string>`\n\nReturns the currently selected network name (e.g. `\"devnet\"`).\n\n### `iota.getAppId(): Promise<string>`\n\nReturns the on-chain object id of *this* app. Pair it with\n`iota.storage.*` to scope state to the app.\n\n### `iota.client` — read-only RPC proxy\n\nThin wrapper around an `IotaClient` running on the host. Every method is\nforwarded to the SDK and the raw response is returned. Helpers on `iota.client`:\n\n- `getObject(input)` → `{ data: { objectId, digest, content: {...} } }`\n- `multiGetObjects(input)` → array of the above\n- `getOwnedObjects(input)`\n- `getDynamicFields(input)`\n- `getDynamicFieldObject(input)`\n- `getBalance(input)` → `{ coinType, totalBalance, coinObjectCount }`\n- `getCoins(input)`\n- `getReferenceGasPrice()`\n- `getLatestCheckpointSequenceNumber()`\n- `queryEvents(input)`\n- `call(method, args)` — escape hatch for any other `IotaClient` method. `args`\n  is the positional argument array.\n\nAll inputs are the same shapes as the `@iota/iota-sdk/client` SDK docs.\n\n```js\nconst { totalBalance } = await iota.client.getBalance({ owner: await iota.getAddress() });\n```\n\n### `iota.signAndExecuteTransaction(txJson)`\n\nSigns and executes a programmable transaction block. `txJson` is the JSON\nproduced by `Transaction.toJSON()` from `@iota/iota-sdk/transactions` - either\nthe serialized string or a plain object. Because the sandboxed iframe cannot\nload npm packages directly, the canonical way to build a PTB from inside an\napp is to construct the JSON by hand using the template below.\n\nThe returned value is an `IotaTransactionBlockResponse` with\n`showEffects: true, showObjectChanges: true, showEvents: true`.\n\n#### Minimal PTB JSON template\n\n```js\nconst txJson = {\n    version: 2,\n    sender: await iota.getAddress(),\n    expiration: { None: true },\n    gasData: { payment: [], owner: null, price: null, budget: null },\n    inputs: [\n        // Pure inputs: { Pure: { bytes: base64 } }\n        // Object inputs: { Object: { ... } }\n    ],\n    commands: [\n        // { MoveCall: { package, module, function, type_arguments, arguments } }\n        // { TransferObjects: { objects, address } }\n        // ... see `Transaction` in @iota/iota-sdk/transactions\n    ],\n};\nconst result = await iota.signAndExecuteTransaction(txJson);\n```\n\n**Simpler alternatives:** prefer the on-chain storage helpers below, which\nhide the PTB plumbing. Only reach for `signAndExecuteTransaction` when you\nactually need a bespoke PTB (e.g. move-calling your own package, splitting\ncoins, transferring NFTs, ...).\n\n### `iota.storage` — generic on-chain key/value store\n\nEvery app shares a single `Storage` Move object. Entries are keyed by\n`(appId, user, key)` (per-user) or `(appId, key)` (per-app shared). Values\nare `Uint8Array` on chain; the bridge handles UTF-8 encoding for convenience.\n\n- `iota.storage.set(key, value) -> Promise<IotaTransactionBlockResponse>`\n- `iota.storage.get(key, { user?, encoding? }) -> Promise<string | null>`\n- `iota.storage.remove(key) -> Promise<IotaTransactionBlockResponse>`\n- `iota.storage.setShared(key, value) -> Promise<IotaTransactionBlockResponse>`\n- `iota.storage.getShared(key, { encoding? }) -> Promise<string | null>`\n\nNotes:\n\n- `key` is a UTF-8 string (≤ ~1 KiB is plenty).\n- `value` is a string (UTF-8 encoded) or a `Uint8Array`. Accepts\n  `{ base64: \"...\" }` for arbitrary binary payloads.\n- By default `get` and `getShared` return `null` if the entry does not exist,\n  or a UTF-8 string if it does. Pass `{ encoding: \"base64\" }` to get\n  base64-encoded bytes for binary data.\n- `set`/`setShared`/`remove` cost gas. Each call is a separate transaction.\n- `get`/`getShared` are read-only (no gas, no tx).\n\n```js\n// per-user profile\nawait iota.storage.set('name', 'alice');\nconst name = await iota.storage.get('name'); // 'alice'\n\n// shared leaderboard\nawait iota.storage.setShared('highscore:alice', '9000');\nconst score = await iota.storage.getShared('highscore:alice');\n\n// read somebody else's per-user entry\nconst bobName = await iota.storage.get('name', { user: '0xBOB...' });\n```\n\n### `iota.localStorage` — sandboxed browser localStorage\n\nEach app gets its own namespace (`onchainApps:<appId>:<key>`). Perfect for\ntransient state that does not belong on chain: UI preferences, draft text,\nsession-only secrets, etc.\n\n- `iota.localStorage.get(key) -> Promise<string | null>`\n- `iota.localStorage.set(key, value) -> Promise<true>`\n- `iota.localStorage.remove(key) -> Promise<true>`\n\nThe host's signer private key is **NOT** exposed through this API.\n\n### `iota.resize(heightInPixels)`\n\nAsk the host to resize the iframe height. No Promise; returns immediately.\nUse this after rendering so users do not see inner scrollbars.\n\n```js\niota.resize(document.body.scrollHeight);\n```\n\n### `iota.webrtc` — peer-to-peer data channels via on-chain signaling\n\nTwo helpers for establishing a WebRTC `RTCDataChannel` between two browser\ntabs / devices, using on-chain shared storage as the signaling channel. Once\nconnected, **all communication is peer-to-peer** — no data hits the chain.\n\n#### `iota.webrtc.host(opts?) -> Promise<{ channel, roomId, pc }>`\n\nCreates a room, writes the SDP offer to shared storage, and waits for\na peer to answer. Returns when the `RTCDataChannel` is open.\n\n| Option | Type | Default | Description |\n|--------|------|---------|-------------|\n| `roomId` | `string` | random UUID | Identifier for the room. Share this with the peer. |\n| `iceServers` | `RTCIceServer[]` | Google STUN | Custom STUN/TURN servers. |\n| `timeout` | `number` | 120000 | Milliseconds to wait for the peer before rejecting. |\n| `label` | `string` | `'data'` | Data channel label. |\n\n#### `iota.webrtc.join(opts) -> Promise<{ channel, roomId, pc }>`\n\nJoins an existing room. Reads the offer from shared storage, writes the\nanswer back, and waits for the data channel to open.\n\n| Option | Type | Default | Description |\n|--------|------|---------|-------------|\n| `roomId` | `string` | *required* | Room to join. |\n| `iceServers` | `RTCIceServer[]` | Google STUN | Custom STUN/TURN servers. |\n| `timeout` | `number` | 120000 | Milliseconds to wait for the offer before rejecting. |\n\n#### Example: two-player game lobby\n\n```js\n// Player 1 (host)\nconst { channel, roomId } = await iota.webrtc.host();\nlog('Room: ' + roomId + ' — share this with Player 2');\nchannel.onmessage = (e) => log('P2 says: ' + e.data);\nchannel.send('hello from Player 1');\n\n// Player 2 (guest, in another browser tab)\nconst { channel } = await iota.webrtc.join({ roomId: 'paste-room-id-here' });\nchannel.onmessage = (e) => log('P1 says: ' + e.data);\nchannel.send('hello from Player 2');\n```\n\n**How it works under the hood:**\n1. Host creates an `RTCPeerConnection`, generates an SDP offer, waits for\n   ICE gathering to finish, then writes the complete offer to\n   `iota.storage.setShared('webrtc:<roomId>:offer', ...)`.\n2. Guest polls `iota.storage.getShared('webrtc:<roomId>:offer')` every\n   ~2.5 s until it appears, sets it as remote description, generates an\n   answer (with ICE), and writes it to `…:answer`.\n3. Host picks up the answer, sets remote description. WebRTC punches\n   through NAT via STUN. The `RTCDataChannel` opens.\n4. From this point on, `channel.send()` / `channel.onmessage` are direct\n   peer-to-peer — low latency, no gas, no chain involvement.\n\n**Privacy:** The SDP offer/answer are written to public on-chain storage.\nThey contain your public IP (via ICE candidates). If that is a concern,\nencrypt the SDP blobs with a shared room password before writing, or use a\nTURN server that masks your IP.\n\n## Multi-player apps — proven patterns\n\nBuilding a real-time multi-player game or tool on top of `iota.webrtc` requires\na few more patterns beyond the basic two-player example above. These patterns\nare extracted from the working Undercover game and will save you hours of\ndebugging.\n\n### Star topology: one host, many players\n\nDo **not** try to build a full-mesh of N*(N-1)/2 peer connections. Instead:\n\n- One player is the **host**: they create one WebRTC connection *per player slot*.\n- All other players are **guests**: each guest connects only to the host.\n- The host is the authoritative game state. It broadcasts a sanitised state\n  snapshot to every connected guest after any state change.\n- Guests only send events to the host (`sendToHost(msg)`); they never talk to\n  each other directly.\n\n```\nGuest A ──┐\nGuest B ──┼──► Host (state authority, relay)\nGuest C ──┘\n```\n\n### Slot-based player discovery\n\nShared storage is used only for *signaling* (slot booking + SDP exchange).\nGame data flows over the open `RTCDataChannel` — never back through storage.\n\n1. **Host** registers the game by writing lobby info:\n   ```js\n   await iota.storage.setShared('game:' + code + ':lobby', JSON.stringify(settings));\n   ```\n\n2. **Guest** discovers the lobby, then claims an empty slot (with optimistic\n   concurrency — check + write + re-read):\n   ```js\n   for (let slot = 0; slot < MAX_SLOTS; slot++) {\n       const key = 'game:' + code + ':s' + slot;\n       const val = await iota.storage.getShared(key);\n       if (!val) {\n           await iota.storage.setShared(key, name + '\\t' + addr);\n           await sleep(2500);                         // wait for race window\n           const verify = await iota.storage.getShared(key);\n           if (verify && verify.includes(addr)) { mySlot = slot; break; }\n       }\n   }\n   ```\n\n3. **Host lobby loop** polls storage for new slots and opens one WebRTC\n   connection per discovered slot. Keep a `discovered` set to avoid\n   re-connecting the same slot.\n\n   ```js\n   async function hostLobbyLoop(preDiscovered = {}) {\n       const discovered = { ...preDiscovered };           // reuse for Play Again\n       while (!lobbyAbort && S.screen === 'lobby') {\n           for (let sl = 0; sl < MAX_SLOTS; sl++) {\n               if (discovered[sl]) continue;\n               const v = await iota.storage.getShared('game:' + code + ':s' + sl);\n               if (!v) continue;\n               discovered[sl] = true;\n               // establish WebRTC connection for this slot …\n           }\n           await sleep(3000);\n       }\n   }\n   ```\n\n4. The host's `channels` object maps `slot → RTCDataChannel`. Use a helper:\n   ```js\n   function sendTo(slot, msg) {\n       const ch = channels[slot];\n       if (ch && ch.readyState === 'open') ch.send(JSON.stringify(msg));\n   }\n   function broadcast(msg) {\n       const data = JSON.stringify(msg);\n       for (const sl in channels) sendTo(sl, data);  // sendTo checks readyState\n   }\n   ```\n\n### Connection reliability — retry + multiple ICE servers\n\nWebRTC connections are not 100% reliable — especially across mobile networks or\nstrict NATs. Always:\n\n```js\nconst ICE_SERVERS = [\n    { urls: 'stun:stun.l.google.com:19302' },\n    { urls: 'stun:stun1.l.google.com:19302' },\n    { urls: 'stun:stun.cloudflare.com:3478' },\n];\n\n// Host side — retry per slot\nfor (let attempt = 0; attempt < 2 && !connected; attempt++) {\n    try {\n        const roomId = 'game-' + code + '-' + slot + (attempt > 0 ? '-r' + attempt : '');\n        const { channel } = await iota.webrtc.host({ roomId, iceServers: ICE_SERVERS, timeout: 90000 });\n        // … success\n        connected = true;\n    } catch (e) {\n        if (attempt === 0) await sleep(3000);\n    }\n}\n\n// Guest side — same pattern\nfor (let attempt = 0; attempt < 2 && !channel; attempt++) {\n    try {\n        const roomId = 'game-' + code + '-' + mySlot + (attempt > 0 ? '-r' + attempt : '');\n        const res = await iota.webrtc.join({ roomId, iceServers: ICE_SERVERS, timeout: 120000 });\n        channel = res.channel;\n    } catch (e) {\n        if (attempt === 0) await sleep(3000);\n    }\n}\nif (!channel) throw new Error('Could not connect. Use a different browser/device than the host.');\n```\n\n> **Same-browser limitation:** Two tabs on the same browser *can* connect via\n> `BroadcastChannel` (the bridge handles this internally), but WebRTC between\n> two tabs in the same browser often fails or loops. Tell users to test with\n> two different devices or browsers.\n\n### Message protocol\n\nUse a simple `{ t: 'type', d: payload }` envelope for all data channel messages.\nAlways wrap `JSON.parse` in a try-catch on the `onmessage` handler:\n\n```js\nchannel.onmessage = e => {\n    try { handleMsg(JSON.parse(e.data)); } catch (err) { console.error(err); }\n};\n```\n\nCommon message types for a multi-player game:\n\n| Sent by | Type | Payload | Meaning |\n|---------|------|---------|---------|\n| Guest→Host | `join` | `{name, addr, slot}` | Player announces themselves |\n| Host→Guest | `welcome` | `{id, players}` | You are player #id, here's the lobby |\n| Host→All | `plist` | `{players}` | Player list changed |\n| Host→Guest | `w` | `{word}` | Private game assignment |\n| Host→All | `s` | full state view | Authoritative state snapshot |\n| Guest→Host | `c` | `{text}` | Submit a clue |\n| Guest→Host | `v` | `{target}` | Cast a vote |\n| Host→All | `restart` | `{players}` | Play Again — reset state, keep connections |\n| Both directions | `chat` / `chatmsg` | `{text}` / `{id,name,text}` | In-game chat relay |\n\n### State broadcasting — hide private info\n\nThe host holds *all* game state (including every player's role and word).\nWhen broadcasting to guests, strip what they should not see:\n\n```js\nfunction broadcastState() {\n    const view = {\n        phase: S.phase,\n        players: S.players.map(p => ({ id: p.id, name: p.name, alive: p.alive, connected: p.connected })),\n        // Only reveal words/roles at game end:\n        citizenWord:   S.winner ? S.citizenWord   : '',\n        undercoverWord: S.winner ? S.undercoverWord : '',\n        roles:         S.winner ? S.roles          : {},\n        // Only reveal full votes in result phase:\n        votes:    S.phase === 'result'  ? S.votes    : {},\n        voteTally: S.phase === 'result' ? S.voteTally : {},\n        // ... other non-secret fields\n    };\n    broadcast({ t: 's', d: view });\n}\n```\n\n### Play Again — reuse connections\n\nDo **not** call `goHome()` (which tears down WebRTC) when starting a new round.\nInstead:\n\n1. Reset only the game-state fields, leave `channels` and `players` intact.\n2. Broadcast a `{t:'restart'}` message so guests switch back to the lobby screen.\n3. Restart the lobby loop with slots already in `channels` pre-marked as\n   `discovered` so the loop only picks up *new* players:\n\n```js\nfunction playAgainHost() {\n    S.players = S.players.map(p => ({ ...p, alive: true }));\n    Object.assign(S, { screen: 'lobby', phase: '', round: 0, /* ... */ });\n    broadcast({ t: 'restart', d: { players: S.players } });\n    const preDiscovered = {};\n    for (const sl in channels) preDiscovered[sl] = true;\n    hostLobbyLoop(preDiscovered);\n    render();\n}\n```\n\n### In-game chat without re-rendering\n\nAppending chat messages via full `render()` calls will erase whatever the\nplayer is typing in a clue/vote input. Use direct DOM manipulation instead:\n\n```js\n// On receiving a chatmsg (both host and guest)\nfunction appendChatMsg(m) {\n    const container = document.getElementById('chat-msgs');\n    if (!container) return;\n    const div = document.createElement('div');\n    div.className = 'chat-msg';\n    div.innerHTML = `<b style=\"color:${pcolor(m.id)}\">${esc(m.name)}:</b> ${esc(m.text)}`;\n    container.appendChild(div);\n    container.scrollTop = container.scrollHeight;\n}\n```\n\nOnly call `render()` when toggling chat open/closed (which rebuilds the full\npanel anyway).\n\n### Duplicate name prevention\n\nBefore accepting a `join` message, check for name collisions:\n\n```js\ncase 'join': {\n    const isDup = S.players.some(p => p.id !== player.id &&\n                                      p.name.toLowerCase() === msg.d.name.toLowerCase());\n    if (isDup) {\n        sendTo(player.slot, { t: 'nameError', d: { msg: 'Name already taken' } });\n    } else {\n        player.name = msg.d.name;\n        broadcast({ t: 'plist', d: { players: sanitisedPlayers() } });\n    }\n    break;\n}\n```\n\nThe guest shows a rename form when it receives `{t:'nameError'}` and keeps the\nWebRTC connection open until a unique name is accepted.\n\n### Disconnection handling\n\n```js\nchannel.onclose = () => {\n    const p = S.players.find(x => x.slot === slot);\n    if (p) p.connected = false;\n    if (S.screen === 'lobby') render();\n};\n```\n\nMark players as `connected: false` rather than removing them — the host can\nstill advance a disconnected speaker (`skipSpeaker`) and votes from alive-but-\noffline players are simply absent (auto-skip them in `checkAllVotes`).\n\n### Preventing blank host status messages during connection\n\nThe host's UI shows connecting status while waiting for each slot. Reset it\nafter each connection attempt so stale messages don't linger:\n\n```js\nif (!connected) {\n    S.connectMsg = '';  render();\n}\n```\n\n\n\nKeep the payload small and self-contained:\n\n1. **One file.** Inline CSS, JS, and small images (`data:` URLs). The publish\n   form takes a single HTML blob.\n2. **No external fetches** unless absolutely required. Public CDN assets will\n   work, but they make your app fragile.\n3. **Initialise lazily.** Wait for `DOMContentLoaded` (or rely on deferred\n   execution) before touching the DOM.\n4. **Handle errors.** All `iota.*` calls can reject (no funds, wrong network,\n   rejected tx, storage entry missing). Always `try { ... } catch (e) { ... }`\n   around them.\n5. **Namespace your storage keys.** Prefix `\"v1:\"` so later app versions can\n   migrate data. Shared keys should include the user address to avoid\n   collisions (`\"score:\" + addr`).\n6. **Don't leak secrets.** The sandbox is not a secure enclave. Treat\n   `iota.localStorage` like browser localStorage - anything written there is\n   visible to the host and to the user. Never store keys stronger than\n   \"session convenience\".\n7. **Be forgiving.** `getAppId()`, `getAddress()`, and `getNetwork()` are\n   cheap - call them on startup and cache the results.\n\n## Skeleton\n\n```html\n<h2 id=\"t\">Loading...</h2>\n<pre id=\"log\"></pre>\n<script>\n(async () => {\n    const log = (m) => { document.getElementById('log').textContent += m + String.fromCharCode(10); };\n    try {\n        const [addr, net, appId] = await Promise.all([\n            iota.getAddress(),\n            iota.getNetwork(),\n            iota.getAppId(),\n        ]);\n        document.getElementById('t').textContent = 'Connected on ' + net;\n        log('address: ' + addr);\n        log('app id:  ' + appId);\n\n        // Load saved state.\n        const saved = await iota.storage.get('v1:greeting');\n        if (saved) log('saved greeting: ' + saved);\n\n        // Save an entry on chain. Every `set` costs gas.\n        await iota.storage.set('v1:greeting', 'hello ' + Date.now());\n        log('saved new greeting');\n\n        // Resize so the user sees all the log output.\n        iota.resize(document.body.scrollHeight + 16);\n    } catch (e) {\n        log('error: ' + (e.message || e));\n    }\n})();\n<\/script>\n```\n\n## Publishing and upgrading an app\n\nApps are stored in the `onchain_apps::app::App` Move object. Publishing and\nupdating both go through the same page under *On-Chain Apps*.\n\n### Publish from the web page (recommended for first-time users)\n\n1. Open the **On-Chain Apps** tab on iotatools.dev.\n2. Click **Generate new random key** if you do not have one yet (devnet only!)\n   and **Request devnet IOTA from faucet**.\n3. In the *Package configuration* panel, paste:\n   - the `onchain_apps` package id,\n   - the shared `Registry` object id,\n   - the shared `Storage` object id.\n4. Click **+ Publish new app**, fill in *name*, *description*, paste the HTML\n   payload (or load a file), and click **Publish to devnet**.\n5. After the tx lands, the page shows a share link containing the new\n   `appId`. Anybody with that link loads the app from chain.\n\nThe form chunks the payload automatically (96 KiB per chunk) and, if needed,\nsends follow-up `append_chunks` transactions. You do not have to worry about\nthe 256 KiB per-chunk hard cap or the move tx size limit.\n\n### Publish / upgrade via the IOTA CLI\n\nFor package-level upgrades (adding new entry functions etc.):\n\n```bash\ncd move/onchain_apps\niota move build\niota move test\niota client switch --env devnet\niota client faucet\niota client publish --gas-budget 500000000\n```\n\nTake note of the package id printed in the output, then set it in `Move.toml`\nunder `[addresses]` and `published-at`, and use `iota client upgrade` for the\nnext iteration.\n\n### Upgrading your own app (new version of an existing app)\n\nEvery `App` is paired with a `onchain_apps::app::AppCap` that is transferred\nto the publisher at creation time. Holding the cap is what lets you upgrade.\nOn the **On-Chain Apps** page the list of caps you own appears under\n*My apps* - click one and use the **Update** form to publish a new name,\ndescription, or payload.\n\nBecause the `App` itself is a shared object, its object id does not change on\nupgrade. Every user who loads the app via that id automatically gets the\nlatest `app_version` the next time they open it; caches should key on\n`app_version` (or `updated_at_ms`) to bust when needed.\n\nUnder the hood the update flow:\n\n1. Encodes the payload into chunks (96 KiB each).\n2. Sends one `app::update_app(app, cap, name, description, content_type, chunks[0], clock)`.\n3. Sends `app::append_chunks(app, cap, chunks[i], clock)` for any remaining chunks.\n\nLosing the `AppCap` means losing the ability to upgrade the app. Treat it\nlike a Move `OwnerCap`: keep it in a wallet you control, optionally transfer\nit to a DAO or another address if you want to hand over maintenance.\n\n## Things to NOT do\n\n- Don't rely on cookies, IndexedDB (the origin is sandboxed), or\n  cross-iframe window access.\n- Don't call `window.parent.postMessage` directly with your own shape - use\n  the `iota.*` bridge.\n- Don't publish code that calls `eval`, loads a `<script src=\"...\">` from an\n  untrusted CDN, or otherwise pulls code the publisher did not audit.\n- Don't use mainnet addresses or keys. This page is devnet-only by design.\n- Don't assume the user is the app's publisher. `getAddress()` returns the\n  viewer's signer key, which is freshly generated on first visit.\n\n## Reference: Move types\n\n```move\nstruct App has key, store {\n    id: UID,\n    name: String,\n    description: String,\n    content_type: String,\n    app_version: u64,       // bumped on each content update\n    package_version: u64,   // version of the onchain_apps package\n    published_at_ms: u64,\n    updated_at_ms: u64,\n    chunk_count: u64,\n    total_size: u64,\n    publisher: address,\n}\n\n// Plain dynamic fields on `App`:\n// Field<ChunkKey { index: u64 }, vector<u8>>\n\nstruct AppCap has key, store { id: UID, app_id: ID }\n\n// Entry functions (all require the cap for updates):\napp::publish(name, description, content_type, chunks, clock, ctx)\napp::append_chunks(app, cap, chunks, clock)\napp::update_app(app, cap, name, description, content_type, chunks, clock)\napp::update_metadata(app, cap, name, description, content_type, clock)\n\n// Generic storage:\ngeneric_storage::set(storage, app_id, key, value, ctx)\ngeneric_storage::remove(storage, app_id, key, ctx)\ngeneric_storage::set_shared(storage, app_id, key, value, ctx)\n// reads via dynamic field queries on the storage object\n```\n";
//#endregion
//#region src/lib/pages/onchain-apps/onchain-apps-bridge.ts
/**
* Build a MessageEvent handler to be attached to the host `window`. The
* supplied `handler` routes each request to the appropriate backend method
* (wallet, storage, client rpc, ...).
*/
function createIframeBridge(iframe, handler, onReady, onResize) {
	async function handleMessage(event) {
		if (event.source !== iframe.contentWindow) return;
		const data = event.data;
		if (!data || typeof data !== "object") return;
		if (data.kind === "ready") {
			onReady?.();
			return;
		}
		if (data.kind === "resize") {
			if (typeof data.height === "number") onResize?.(data.height);
			return;
		}
		if (data.kind !== "req") return;
		const req = data;
		try {
			const result = await handler(req.method, req.args);
			const resp = {
				kind: "res",
				id: req.id,
				result
			};
			iframe.contentWindow?.postMessage(resp, "*");
		} catch (err) {
			console.error("[Bridge] error handling", req.method, ":", err);
			const resp = {
				kind: "res",
				id: req.id,
				error: err?.message ?? String(err)
			};
			iframe.contentWindow?.postMessage(resp, "*");
		}
	}
	return { handleMessage };
}
/**
* JavaScript that is injected at the top of every sandboxed app iframe. It
* exposes a small `window.iota` API that proxies to the host page over
* `postMessage`. Keep this self-contained - no external dependencies, no
* optional chaining on `parent.postMessage` (sandboxed iframes can access
* `window.parent.postMessage` without same-origin privileges).
*/
var BOOTSTRAP_JS = String.raw`
(function () {
    if (window.iota) return;
    var pending = Object.create(null);
    var idSeq = 0;

    function send(method, args) {
        var id = 'req-' + (++idSeq) + '-' + Date.now().toString(36);
        return new Promise(function (resolve, reject) {
            pending[id] = { resolve: resolve, reject: reject };
            window.parent.postMessage({ kind: 'req', id: id, method: method, args: args }, '*');
        });
    }

    window.addEventListener('message', function (event) {
        var data = event.data;
        if (!data || data.kind !== 'res') return;
        var entry = pending[data.id];
        if (!entry) return;
        delete pending[data.id];
        if (data.error) entry.reject(new Error(data.error));
        else entry.resolve(data.result);
    });

    function makeClient() {
        return {
            call: function (method, args) { return send('rpc', { method: method, args: args }); },
            getObject: function (input) { return send('rpc', { method: 'getObject', args: [input] }); },
            multiGetObjects: function (input) { return send('rpc', { method: 'multiGetObjects', args: [input] }); },
            getOwnedObjects: function (input) { return send('rpc', { method: 'getOwnedObjects', args: [input] }); },
            getDynamicFields: function (input) { return send('rpc', { method: 'getDynamicFields', args: [input] }); },
            getDynamicFieldObject: function (input) { return send('rpc', { method: 'getDynamicFieldObject', args: [input] }); },
            getBalance: function (input) { return send('rpc', { method: 'getBalance', args: [input] }); },
            getCoins: function (input) { return send('rpc', { method: 'getCoins', args: [input] }); },
            getReferenceGasPrice: function () { return send('rpc', { method: 'getReferenceGasPrice', args: [] }); },
            getLatestCheckpointSequenceNumber: function () { return send('rpc', { method: 'getLatestCheckpointSequenceNumber', args: [] }); },
            queryEvents: function (input) { return send('rpc', { method: 'queryEvents', args: [input] }); },
        };
    }

    // --- WebRTC helpers (proxied to host page for ICE compatibility) ---

    function makeWebRTC() {
        var channelHandlers = Object.create(null);

        // Listen for push messages from the host page (data relay + close).
        window.addEventListener('message', function (event) {
            var d = event.data;
            if (!d) return;
            if (d.kind === 'webrtcData') {
                var ch = channelHandlers[d.channelId];
                if (ch && ch.onmessage) ch.onmessage({ data: d.data });
            } else if (d.kind === 'webrtcClose') {
                var ch2 = channelHandlers[d.channelId];
                if (ch2) {
                    ch2.readyState = 'closed';
                    if (ch2.onclose) ch2.onclose();
                    delete channelHandlers[d.channelId];
                }
            }
        });

        function makeChannel(chId) {
            var ch = {
                readyState: 'open',
                send: function (data) { send('webrtcSend', { channelId: chId, data: data }); },
                close: function () { ch.readyState = 'closed'; send('webrtcClose', { channelId: chId }); },
                onmessage: null,
                onclose: null,
                onerror: null,
                addEventListener: function (type, fn) { if (type === 'open') fn(); else ch['on' + type] = fn; },
                removeEventListener: function () {},
            };
            channelHandlers[chId] = ch;
            return ch;
        }

        return {
            host: async function (opts) {
                opts = opts || {};
                console.log('[iota.webrtc] host() called, proxying to host page');
                var result = await send('webrtcHost', {
                    roomId: opts.roomId || crypto.randomUUID(),
                    iceServers: opts.iceServers,
                    timeout: opts.timeout,
                    label: opts.label,
                });
                console.log('[iota.webrtc] host() resolved:', result.roomId, result.channelId);
                return { channel: makeChannel(result.channelId), roomId: result.roomId, pc: null };
            },
            join: async function (opts) {
                if (!opts || !opts.roomId) throw new Error('roomId is required');
                console.log('[iota.webrtc] join() called, proxying to host page, room:', opts.roomId);
                var result = await send('webrtcJoin', {
                    roomId: opts.roomId,
                    iceServers: opts.iceServers,
                    timeout: opts.timeout,
                });
                console.log('[iota.webrtc] join() resolved:', result.roomId, result.channelId);
                return { channel: makeChannel(result.channelId), roomId: result.roomId, pc: null };
            },
        };
    }

    window.iota = {
        getAddress: function () { return send('getAddress'); },
        getNetwork: function () { return send('getNetwork'); },
        getAppId: function () { return send('getAppId'); },
        // Read a query parameter from the host page URL (e.g. ?gameId=xyz).
        getParam: function (key) { return send('getParam', { key: key }); },
        client: makeClient(),
        signAndExecuteTransaction: function (txJson) {
            return send('signAndExecute', { txJson: txJson });
        },
        storage: {
            set: function (key, value) { return send('storageSet', { key: key, value: value }); },
            get: function (key, opts) { return send('storageGet', { key: key, opts: opts || {} }); },
            remove: function (key) { return send('storageRemove', { key: key }); },
            setShared: function (key, value) { return send('storageSetShared', { key: key, value: value }); },
            getShared: function (key, opts) { return send('storageGetShared', { key: key, opts: opts || {} }); },
        },
        localStorage: {
            get: function (key) { return send('localGet', { key: key }); },
            set: function (key, value) { return send('localSet', { key: key, value: value }); },
            remove: function (key) { return send('localRemove', { key: key }); },
        },
        // WebRTC peer-to-peer via on-chain signaling.
        webrtc: makeWebRTC(),
        resize: function (height) {
            window.parent.postMessage({ kind: 'resize', height: Number(height) }, '*');
        },
    };

    window.parent.postMessage({ kind: 'ready' }, '*');
})();
`;
//#endregion
//#region src/lib/pages/onchain-apps/onchain-apps-client.ts
/**
* Soft chunk size used by the UI when splitting a payload for upload. The
* Move contract enforces a hard cap of 256 KiB; we stay well below that so
* every single tx fits comfortably in the transaction size limit.
*/
var DEFAULT_CHUNK_SIZE = 96 * 1024;
/** Split `bytes` into chunks of at most `chunkSize` bytes. */
function splitChunks(bytes, chunkSize = DEFAULT_CHUNK_SIZE) {
	if (chunkSize <= 0) throw new Error("chunkSize must be > 0");
	const chunks = [];
	for (let i = 0; i < bytes.length; i += chunkSize) chunks.push(bytes.slice(i, i + chunkSize));
	if (chunks.length === 0) chunks.push(/* @__PURE__ */ new Uint8Array());
	return chunks;
}
function fieldsOf(obj) {
	const content = obj.data?.content;
	if (!content || content.dataType !== "moveObject") throw new Error(`Object ${obj.data?.objectId ?? "?"} is not a move object`);
	return content.fields;
}
function asNumber(value) {
	if (typeof value === "number") return value;
	if (typeof value === "string") return Number(value);
	if (typeof value === "bigint") return Number(value);
	return Number(value);
}
function parseApp(obj) {
	const fields = fieldsOf(obj);
	return {
		id: obj.data.objectId,
		name: String(fields.name ?? ""),
		description: String(fields.description ?? ""),
		contentType: String(fields.content_type ?? ""),
		appVersion: asNumber(fields.app_version),
		packageVersion: asNumber(fields.package_version),
		publishedAtMs: asNumber(fields.published_at_ms),
		updatedAtMs: asNumber(fields.updated_at_ms),
		chunkCount: asNumber(fields.chunk_count),
		totalSize: asNumber(fields.total_size),
		publisher: String(fields.publisher ?? "")
	};
}
/**
* Read the registry's `count` field and every `IndexKey { index }` dynamic
* field to recover the list of registered app ids.
*/
async function listAppIds(client, registryId) {
	const ids = [];
	let cursor = null;
	do {
		const page = await client.getDynamicFields({
			parentId: registryId,
			cursor: cursor ?? null
		});
		const indexEntries = page.data.filter((f) => String(f.name?.type ?? "").endsWith("::registry::IndexKey"));
		if (indexEntries.length > 0) {
			const parsed = (await client.multiGetObjects({
				ids: indexEntries.map((f) => f.objectId),
				options: { showContent: true }
			})).map((w) => {
				const f = fieldsOf(w);
				return {
					idx: asNumber(f?.name?.fields?.index ?? f?.name?.index ?? 0),
					appId: typeof f?.value === "string" ? f.value : String(f?.value ?? "")
				};
			}).filter((x) => !!x.appId);
			parsed.sort((a, b) => a.idx - b.idx);
			for (const p of parsed) ids.push(p.appId);
		}
		cursor = page.hasNextPage ? page.nextCursor ?? null : null;
	} while (cursor);
	return ids;
}
/** Fetch the metadata for a batch of app ids. */
async function fetchAppMetadatas(client, appIds) {
	if (appIds.length === 0) return [];
	const results = [];
	for (let i = 0; i < appIds.length; i += 50) {
		const batch = appIds.slice(i, i + 50);
		const responses = await client.multiGetObjects({
			ids: batch,
			options: { showContent: true }
		});
		for (const r of responses) {
			if (!r.data) continue;
			try {
				const meta = parseApp(r);
				if (!meta.name && meta.totalSize === 0 && meta.chunkCount === 0) {
					console.warn("skipping empty app entry", r.data.objectId);
					continue;
				}
				results.push(meta);
			} catch (err) {
				console.warn("failed to parse app", r, err);
			}
		}
	}
	return results;
}
/** Fetch full metadata for a single app. */
async function fetchAppMetadata(client, appId) {
	const resp = await client.getObject({
		id: appId,
		options: { showContent: true }
	});
	if (!resp.data) throw new Error(`App ${appId} not found`);
	return parseApp(resp);
}
/**
* Enumerate every `AppCap` held by `owner` and resolve each of them to the
* matching `App`. Apps whose `App` object has been deleted / is unreadable
* are still returned with `app: null` so the UI can surface stale caps.
*/
async function fetchOwnedAppCaps(client, packageId, owner) {
	if (!packageId || !owner || owner === "0x") return [];
	const caps = [];
	let cursor = null;
	do {
		const page = await client.getOwnedObjects({
			owner,
			filter: { StructType: `${packageId}::app::AppCap` },
			options: {
				showContent: true,
				showType: true
			},
			cursor: cursor ?? null
		});
		for (const item of page.data) {
			if (!item.data) continue;
			try {
				const fields = fieldsOf(item);
				const appId = String(fields.app_id ?? "");
				if (!appId) continue;
				caps.push({
					capId: item.data.objectId,
					appId
				});
			} catch (err) {
				console.warn("failed to parse AppCap", item, err);
			}
		}
		cursor = page.hasNextPage ? page.nextCursor ?? null : null;
	} while (cursor);
	if (caps.length === 0) return [];
	const appMetas = await fetchAppMetadatas(client, caps.map((c) => c.appId));
	const byId = new Map(appMetas.map((m) => [m.id, m]));
	return caps.map((c) => ({
		capId: c.capId,
		appId: c.appId,
		app: byId.get(c.appId) ?? null
	}));
}
function toUint8(value) {
	if (value == null) return /* @__PURE__ */ new Uint8Array();
	if (value instanceof Uint8Array) return value;
	if (Array.isArray(value)) return new Uint8Array(value);
	if (typeof value === "string") try {
		return fromBase64(value);
	} catch {
		return new TextEncoder().encode(value);
	}
	throw new Error("unknown bytes encoding");
}
/** Load every chunk of an app and concatenate them into a single blob. */
async function fetchAppContent(client, app) {
	if (app.chunkCount === 0) return /* @__PURE__ */ new Uint8Array();
	const buffers = Array.from({ length: app.chunkCount });
	const entries = [];
	let cursor = null;
	do {
		const page = await client.getDynamicFields({
			parentId: app.id,
			cursor: cursor ?? null
		});
		for (const f of page.data) {
			if (!String(f.name?.type ?? "").endsWith("::app::ChunkKey")) continue;
			const idx = asNumber(f.name?.value?.index ?? f.name?.value);
			entries.push({
				index: idx,
				objectId: f.objectId
			});
		}
		cursor = page.hasNextPage ? page.nextCursor ?? null : null;
	} while (cursor);
	if (entries.length !== app.chunkCount) console.warn(`app ${app.id} advertises ${app.chunkCount} chunks but registry lists ${entries.length}`);
	for (let i = 0; i < entries.length; i += 50) {
		const batch = entries.slice(i, i + 50);
		const responses = await client.multiGetObjects({
			ids: batch.map((b) => b.objectId),
			options: { showContent: true }
		});
		for (let j = 0; j < responses.length; j++) {
			const resp = responses[j];
			const entry = batch[j];
			if (!resp.data) continue;
			const fields = fieldsOf(resp);
			buffers[entry.index] = toUint8(fields.value);
		}
	}
	const totalLen = buffers.reduce((sum, b) => sum + (b?.length ?? 0), 0);
	const out = new Uint8Array(totalLen);
	let offset = 0;
	for (const b of buffers) {
		if (!b) continue;
		out.set(b, offset);
		offset += b.length;
	}
	return out;
}
function chunksArgument(tx, chunks) {
	const bytes = iotaBcs.vector(iotaBcs.vector(iotaBcs.u8())).serialize(chunks.map((c) => Array.from(c))).toBytes();
	return tx.pure(bytes);
}
/**
* Build a PTB that creates a new `App`, shares it, registers it in the
* registry, and transfers the `AppCap` to the sender. Only the *first*
* batch of chunks is attached here; subsequent chunks (if any) are added
* via `buildAppendChunksTx` in follow-up transactions.
*/
function buildPublishTx(params) {
	const tx = new Transaction();
	const appType = `${params.packageId}::app::App`;
	const [app, cap] = tx.moveCall({
		target: `${params.packageId}::app::create_app`,
		arguments: [
			tx.pure.string(params.name),
			tx.pure.string(params.description),
			tx.pure.string(params.contentType),
			chunksArgument(tx, params.firstChunks),
			tx.object(IOTA_CLOCK_OBJECT_ID)
		]
	});
	const appId = tx.moveCall({
		target: `0x2::object::id`,
		typeArguments: [appType],
		arguments: [app]
	});
	tx.moveCall({
		target: `${params.packageId}::registry::register`,
		arguments: [tx.object(params.registryId), appId]
	});
	tx.moveCall({
		target: `0x2::transfer::public_share_object`,
		typeArguments: [appType],
		arguments: [app]
	});
	tx.transferObjects([cap], tx.moveCall({
		target: `0x2::tx_context::sender`,
		arguments: []
	}));
	return tx;
}
/** Build a PTB that appends more chunks to an existing app. */
function buildAppendChunksTx(params) {
	const tx = new Transaction();
	tx.moveCall({
		target: `${params.packageId}::app::append_chunks`,
		arguments: [
			tx.object(params.appId),
			tx.object(params.appCapId),
			chunksArgument(tx, params.chunks),
			tx.object(IOTA_CLOCK_OBJECT_ID)
		]
	});
	return tx;
}
/** Build a PTB that replaces an app's name/description/contents. */
function buildUpdateAppTx(params) {
	const tx = new Transaction();
	tx.moveCall({
		target: `${params.packageId}::app::update_app`,
		arguments: [
			tx.object(params.appId),
			tx.object(params.appCapId),
			tx.pure.string(params.name),
			tx.pure.string(params.description),
			tx.pure.string(params.contentType),
			chunksArgument(tx, params.chunks),
			tx.object(IOTA_CLOCK_OBJECT_ID)
		]
	});
	return tx;
}
/**
* Build a PTB that writes a key/value pair into the shared generic storage
* (per-user by default; pass `shared: true` for app-level shared state).
*/
function buildStorageSetTx(params) {
	const tx = new Transaction();
	const target = params.shared ? `${params.packageId}::generic_storage::set_shared` : `${params.packageId}::generic_storage::set`;
	tx.moveCall({
		target,
		arguments: [
			tx.object(params.storageId),
			tx.pure.address(params.appId),
			tx.pure.string(params.key),
			tx.pure(iotaBcs.vector(iotaBcs.u8()).serialize(Array.from(params.value)).toBytes())
		]
	});
	return tx;
}
//#endregion
//#region src/lib/pages/onchain-apps/onchain-apps-config.ts
var DEFAULT_CONFIG = {
	packageId: "0x76f9af5d12803e11caa60a6f7adaca9b59c3674eba1fda3e8af22c97381052f5",
	registryId: "0x6d998e1a16bb43e270a52e048a87c90b7386073e45fbcc6ae190ce674b2b2415",
	storageId: "0xa3bf3f0a63f0389c8d01778e5e65847b1770cd4e5abab201c76890d45e01b37d"
};
var CONFIG_KEY = "onchainAppsConfig";
var RANDOM_KEY_KEY = "onchainAppsRandomKey";
function loadConfig() {
	if (typeof localStorage === "undefined") return { ...DEFAULT_CONFIG };
	try {
		const raw = localStorage.getItem(CONFIG_KEY);
		if (!raw) return { ...DEFAULT_CONFIG };
		const parsed = JSON.parse(raw);
		return {
			packageId: parsed.packageId || DEFAULT_CONFIG.packageId,
			registryId: parsed.registryId || DEFAULT_CONFIG.registryId,
			storageId: parsed.storageId || DEFAULT_CONFIG.storageId
		};
	} catch {
		return { ...DEFAULT_CONFIG };
	}
}
var onChainAppsConfig = writable(loadConfig());
onChainAppsConfig.subscribe((value) => {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(CONFIG_KEY, JSON.stringify(value));
	} catch (err) {
		console.warn("failed to persist onchain-apps config", err);
	}
});
function loadRandomKey() {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(RANDOM_KEY_KEY);
}
function saveRandomKey(bech32PrivateKey) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(RANDOM_KEY_KEY, bech32PrivateKey);
}
//#endregion
//#region src/lib/pages/onchain-apps/onchain-apps-key.ts
/** Generate a fresh Ed25519 keypair and persist it to `localStorage`. */
function generateAndStoreRandomKey() {
	const keypair = Ed25519Keypair.generate();
	const bech32 = keypair.getSecretKey();
	saveRandomKey(bech32);
	return {
		bech32PrivateKey: bech32,
		address: keypair.toIotaAddress()
	};
}
/** Read the stored key if any; otherwise return `null`. */
function getStoredRandomKey() {
	const bech32 = loadRandomKey();
	if (!bech32) return null;
	try {
		return {
			bech32PrivateKey: bech32,
			address: keypairFromBech32PrivateKey(bech32).toIotaAddress()
		};
	} catch {
		return null;
	}
}
/** Return the stored key, generating a new one if nothing is stored yet. */
function ensureRandomKey() {
	return getStoredRandomKey() ?? generateAndStoreRandomKey();
}
/** Resolve a bech32 private key to an `Ed25519Keypair`. */
function keypairFor(bech32PrivateKey) {
	const kp = keypairFromBech32PrivateKey(bech32PrivateKey);
	if (!(kp instanceof Ed25519Keypair)) throw new Error("Random key must be Ed25519");
	return kp;
}
//#endregion
//#region src/lib/pages/onchain-apps/OnChainApps.svelte
var DEFAULT_HTML = "<!-- Minimal example app. -->\n<!-- This code runs inside a sandboxed iframe, with access to the iota bridge. -->\n<h3 id=\"title\">Hello On-Chain Apps</h3>\n<p>Your address: <code id=\"addr\">?</code></p>\n<input id=\"name\" placeholder=\"your name\" />\n<button id=\"save\">Save name on chain</button>\n<pre id=\"log\"></pre>\n\n<script>\n(async () => {\n    const log = (m) => { document.getElementById('log').textContent += m + String.fromCharCode(10); };\n    const addr = await iota.getAddress();\n    document.getElementById('addr').textContent = addr;\n    try {\n        const saved = await iota.storage.getShared('player:' + addr);\n        if (saved) document.getElementById('name').value = saved;\n    } catch (e) { log('no previous name: ' + e.message); }\n\n    document.getElementById('save').onclick = async () => {\n        const name = document.getElementById('name').value;\n        if (!name) return;\n        try {\n            await iota.storage.setShared('player:' + addr, name);\n            log('saved \"' + name + '\"');\n        } catch (e) { log('error: ' + e.message); }\n    };\n})();\n<\/script>\n";
function formatSize(bytes) {
	if (!bytes) return "0 B";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}
function formatDate(ms) {
	if (!ms) return "—";
	try {
		return new Date(ms).toLocaleString();
	} catch {
		return String(ms);
	}
}
var root = from_html(`<div> </div>`);
var root_1 = from_html(`<a> </a>`);
var root_2 = from_html(`<section class="panel publish-panel svelte-1r06gu"><h3 class="svelte-1r06gu">Publish an app</h3> <label class="svelte-1r06gu">Name <input placeholder="my cover game" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Description <textarea rows="2" placeholder="Short description shown in the list" class="svelte-1r06gu"></textarea></label> <label class="svelte-1r06gu">Content type <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Load HTML from file (optional) <input type="file" accept=".html,.htm,text/html" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">HTML payload <textarea rows="12" spellcheck="false" class="svelte-1r06gu"></textarea></label> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu"> </button> <!></div> <details class="skill-docs svelte-1r06gu"><summary class="svelte-1r06gu">App development guide (SKILL.md)</summary> <div class="skill-toolbar svelte-1r06gu"><a href="https://github.com/thoralf-m/iotatools/blob/main/.claude/skills/onchain-apps/SKILL.md" target="_blank" rel="noopener noreferrer" class="skill-link svelte-1r06gu">View on GitHub ↗</a> <button class="skill-copy svelte-1r06gu">Copy</button></div> <pre class="skill-pre svelte-1r06gu"> </pre></details></section>`);
var root_3 = from_html(`<p>Loading app bytes...</p>`);
var root_4 = from_html(`<button class="maximize-exit-btn svelte-1r06gu" title="Exit fullscreen (Esc)">✕</button>`);
var root_5 = from_html(`<!> <iframe sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>`, 1);
var root_6 = from_html(`<section class="panel viewer svelte-1r06gu"><div class="viewer-header svelte-1r06gu"><div><h3 class="svelte-1r06gu"> </h3> <p class="muted svelte-1r06gu"> </p> <p class="app-meta"><span> </span> <span> </span> <span> </span> <span> </span> <span> </span> <span>by <code class="address-code svelte-1r06gu"> </code></span></p></div> <div class="viewer-actions svelte-1r06gu"><button class="svelte-1r06gu">Copy share link</button> <button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu">← Back to list</button></div></div> <!></section>`);
var root_7 = from_html(`<section class="panel update-panel svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <p class="muted svelte-1r06gu"> <code> </code>) stays the same, so existing share links keep working.</p> <label class="svelte-1r06gu">Name <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Description <textarea rows="2" class="svelte-1r06gu"></textarea></label> <label class="svelte-1r06gu">Content type <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Replace HTML from file (optional) <input type="file" accept=".html,.htm,text/html" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">HTML payload <textarea rows="12" spellcheck="false" class="svelte-1r06gu"></textarea></label> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu">Cancel</button></div></section>`);
var root_8 = from_html(`<div class="error-block svelte-1r06gu"> </div>`);
var root_9 = from_html(`<p>Loading...</p>`);
var root_10 = from_html(`<p class="muted svelte-1r06gu">Nothing published yet. Use <em>+ Publish new app</em> above to upload your first app.</p>`);
var root_11 = from_html(`<div class="app-desc svelte-1r06gu"> </div>`);
var root_12 = from_html(`<li><div class="app-card svelte-1r06gu"><div class="app-card-top svelte-1r06gu"><div class="app-avatar svelte-1r06gu"> </div> <div class="app-card-title svelte-1r06gu"><div class="app-name svelte-1r06gu"> </div> <div class="app-size svelte-1r06gu"> </div></div> <button>★</button></div> <!> <div class="app-card-footer svelte-1r06gu"><span class="app-date svelte-1r06gu"> </span> <button class="open-btn svelte-1r06gu">Open →</button></div></div></li>`);
var root_13 = from_html(`<div class="apps-divider svelte-1r06gu"></div> <ul class="apps svelte-1r06gu"></ul>`, 1);
var root_14 = from_html(`<ul class="apps svelte-1r06gu"></ul> <!>`, 1);
var root_15 = from_html(`<ul class="apps svelte-1r06gu"></ul>`);
var root_16 = from_html(`<p class="muted svelte-1r06gu">No apps published from this address yet. After publishing, the upgrade
                    capabilities will appear here.</p>`);
var root_17 = from_html(`<div class="app-name svelte-1r06gu"> </div> <div class="app-desc svelte-1r06gu"> </div> <div class="app-meta"><span> </span> <span> </span> <span> </span> <span> </span></div>`, 1);
var root_18 = from_html(`<div class="app-name svelte-1r06gu">— stale cap —</div> <div class="app-desc muted svelte-1r06gu">App object not found (deleted?). Cap id preserved for
                                        reference.</div>`, 1);
var root_19 = from_html(`<li><div class="app-card svelte-1r06gu"><!> <div class="app-id"> </div> <div class="app-id"> </div> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu">Open</button> <button class="svelte-1r06gu">Update</button></div></div></li>`);
var root_20 = from_html(`<section class="panel svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <!> <!></section> <section class="panel my-apps-panel svelte-1r06gu"><div class="my-apps-header svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <button class="svelte-1r06gu"> </button></div> <p class="muted svelte-1r06gu">Every <code>AppCap</code> owned by your random signer address. Selecting one lets
                you publish a new <em>app_version</em> - viewers load the app via its shared object id,
                so they get the updated payload automatically on their next visit.</p> <!> <!></section>`, 1);
var root_21 = from_html(`<div class="key-row svelte-1r06gu"><strong>Balance:</strong> </div>`);
var root_22 = from_html(`<main class="svelte-1r06gu"><header class="top svelte-1r06gu"><div><h2>On-Chain Apps</h2> <p class="subtitle svelte-1r06gu">Web apps published directly to the IOTA devnet and loaded from dynamic fields.</p></div> <div class="top-actions svelte-1r06gu"><button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu"> </button></div></header> <!> <!> <!> <details class="panel key-panel svelte-1r06gu"><summary class="svelte-1r06gu">Sandbox signer</summary> <p class="muted svelte-1r06gu">A random Ed25519 key is used for every tx this page signs. It is kept in your browser's <code>localStorage</code>. Devnet only.</p> <div class="key-info svelte-1r06gu"><div class="key-row svelte-1r06gu"><strong>Network:</strong> </div> <div class="key-row svelte-1r06gu"><strong>Address:</strong> <code class="address-code svelte-1r06gu"> </code></div> <!></div> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu">Generate new random key</button> <button class="svelte-1r06gu">Request devnet IOTA from faucet</button> <a target="_blank" rel="noopener noreferrer">View in explorer ↗</a></div></details> <details class="panel config-panel svelte-1r06gu"><summary class="svelte-1r06gu">Package configuration</summary> <p class="muted svelte-1r06gu">Override the Move package / object ids if you deployed your own instance. Otherwise the
            defaults point at the canonical devnet deployment.</p> <label class="svelte-1r06gu">Package ID <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Registry object ID (shared) <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Generic storage object ID (shared) <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label></details></main>`);
function OnChainApps($$anchor, $$props) {
	push($$props, true);
	const $onChainAppsConfig = () => store_get(onChainAppsConfig, "$onChainAppsConfig", $$stores);
	const $sharedClientConfig = () => store_get(sharedClientConfig, "$sharedClientConfig", $$stores);
	const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const pageParams = usePageQueryParams({ appId: "" });
	let randomKey = state(proxy(ensureRandomKey()));
	let signerBalance = state("");
	let apps = state(proxy([]));
	let loadingList = state(false);
	let loadError = state("");
	let selectedApp = state(null);
	let selectedAppContent = state(null);
	let loadingApp = state(false);
	let iframeSrcDoc = state("");
	let iframeHeight = state(560);
	let statusMessage = state("");
	let statusIsError = state(false);
	let showPublish = state(false);
	let publishName = state("");
	let publishDescription = state("");
	let publishContentType = state("text/html");
	let publishHtml = state(DEFAULT_HTML);
	let publishing = state(false);
	let publishResultUrl = state("");
	let myApps = state(proxy([]));
	let loadingMyApps = state(false);
	let myAppsError = state("");
	let updateTarget = state(null);
	let updateName = state("");
	let updateDescription = state("");
	let updateContentType = state("text/html");
	let updateHtml = state("");
	let updating = state(false);
	let iframeEl = state(void 0);
	let appMaximized = state(false);
	const STARRED_KEY = "onchainApps:starred";
	function loadStarred() {
		try {
			const raw = localStorage.getItem(STARRED_KEY);
			return new Set(raw ? JSON.parse(raw) : []);
		} catch {
			return /* @__PURE__ */ new Set();
		}
	}
	function saveStarred(set) {
		localStorage.setItem(STARRED_KEY, JSON.stringify([...set]));
	}
	let starred = state(proxy(loadStarred()));
	function toggleStar(id) {
		const next = new Set(get(starred));
		if (next.has(id)) next.delete(id);
		else next.add(id);
		set(starred, next, true);
		saveStarred(next);
	}
	let sortedApps = user_derived(() => {
		return {
			pinned: get(apps).filter((a) => get(starred).has(a.id)),
			rest: get(apps).filter((a) => !get(starred).has(a.id))
		};
	});
	const proxyChannels = /* @__PURE__ */ new Map();
	let webrtcIdSeq = 0;
	const DEFAULT_ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];
	const WEBRTC_POLL_MS = 2500;
	function rtcLog(...args) {
		console.log("[WebRTC]", ...args);
	}
	function gatherIce(pc) {
		return new Promise((resolve) => {
			const candidates = [];
			pc.onicecandidate = (e) => {
				if (e.candidate) candidates.push(e.candidate.candidate);
			};
			if (pc.iceGatheringState === "complete") {
				rtcLog("ICE already complete, candidates:", candidates.length);
				resolve(pc.localDescription);
				return;
			}
			const check = () => {
				if (pc.iceGatheringState === "complete") {
					pc.removeEventListener("icegatheringstatechange", check);
					rtcLog("ICE gathering complete, candidates:", candidates.length);
					candidates.forEach((c) => rtcLog("  candidate:", c));
					resolve(pc.localDescription);
				}
			};
			pc.addEventListener("icegatheringstatechange", check);
			setTimeout(() => {
				pc.removeEventListener("icegatheringstatechange", check);
				rtcLog("ICE gathering safety-net timeout (8s), state:", pc.iceGatheringState, "candidates:", candidates.length);
				candidates.forEach((c) => rtcLog("  candidate:", c));
				resolve(pc.localDescription);
			}, 8e3);
		});
	}
	function waitForOpen(dc) {
		return new Promise((resolve, reject) => {
			rtcLog("waitForOpen: current state =", dc.readyState);
			if (dc.readyState === "open") {
				resolve(dc);
				return;
			}
			const onOpen = () => {
				rtcLog("DataChannel opened!");
				resolve(dc);
			};
			const onError = (e) => {
				rtcLog("DataChannel error:", e);
				reject(e);
			};
			dc.addEventListener("open", onOpen);
			dc.addEventListener("error", onError);
			setTimeout(() => {
				dc.removeEventListener("open", onOpen);
				dc.removeEventListener("error", onError);
				rtcLog("DataChannel open timeout (30s), state:", dc.readyState);
				reject(/* @__PURE__ */ new Error("DataChannel open timeout after 30s, state=" + dc.readyState));
			}, 3e4);
		});
	}
	function listenForDataChannel(pc) {
		let rejectFn = null;
		let resolved = false;
		const promise = new Promise((resolve, reject) => {
			rejectFn = reject;
			pc.addEventListener("datachannel", (e) => {
				rtcLog("datachannel event received, label:", e.channel.label);
				resolved = true;
				resolve(e.channel);
			});
		});
		function startTimeout(ms) {
			setTimeout(() => {
				if (!resolved && rejectFn) {
					rtcLog("DataChannel receive timeout (" + ms + "ms) — ICE state:", pc.iceConnectionState, "connection:", pc.connectionState);
					rejectFn(/* @__PURE__ */ new Error("DataChannel receive timeout (" + ms / 1e3 + "s after signaling)"));
				}
			}, ms);
		}
		return {
			promise,
			startTimeout
		};
	}
	async function rtcReadShared(key) {
		const client = getClient();
		const appId = get(selectedApp)?.id ?? "";
		if (!$onChainAppsConfig().storageId || !appId) return null;
		const bytes = await readStorageValue(client, appId, "", key, true);
		if (!bytes) return null;
		return new TextDecoder().decode(bytes);
	}
	async function rtcWriteShared(key, value) {
		rtcLog("writing shared key:", key, "(" + value.length + " bytes)");
		const client = getClient();
		const appId = get(selectedApp)?.id ?? "";
		const tx = buildStorageSetTx({
			packageId: $onChainAppsConfig().packageId,
			storageId: $onChainAppsConfig().storageId,
			appId,
			key,
			value: new TextEncoder().encode(value),
			shared: true
		});
		const result = await client.signAndExecuteTransaction({
			transaction: tx,
			signer: keypairFor(get(randomKey).bech32PrivateKey),
			options: { showEffects: true }
		});
		const status = result.effects?.status?.status;
		rtcLog("write result:", status, "digest:", result.digest);
		if (status !== "success") throw new Error("Storage write failed: " + JSON.stringify(result.effects?.status));
	}
	async function rtcPollShared(key, timeoutMs) {
		const deadline = Date.now() + timeoutMs;
		let attempts = 0;
		while (Date.now() < deadline) {
			try {
				const val = await rtcReadShared(key);
				attempts++;
				if (val !== null && val !== "") {
					rtcLog("poll found key:", key, "after", attempts, "attempts");
					return val;
				}
			} catch (e) {
				rtcLog("poll read error for", key, ":", e);
			}
			await new Promise((r) => setTimeout(r, WEBRTC_POLL_MS));
		}
		throw new Error("WebRTC signaling timeout for key: " + key + " after " + attempts + " attempts");
	}
	function registerProxy(channelId, proxy) {
		proxyChannels.set(channelId, proxy);
	}
	function pushToIframe(channelId, data) {
		get(iframeEl)?.contentWindow?.postMessage({
			kind: "webrtcData",
			channelId,
			data
		}, "*");
	}
	function pushCloseToIframe(channelId) {
		get(iframeEl)?.contentWindow?.postMessage({
			kind: "webrtcClose",
			channelId
		}, "*");
		proxyChannels.delete(channelId);
	}
	/** Wire up an RTCDataChannel + its PeerConnection as a proxy channel. */
	function setupRTCProxy(channelId, pc, dc) {
		pc.onconnectionstatechange = () => rtcLog("pc connection state:", pc.connectionState);
		pc.oniceconnectionstatechange = () => rtcLog("pc ICE connection state:", pc.iceConnectionState);
		dc.onmessage = (e) => pushToIframe(channelId, e.data);
		dc.onclose = () => {
			rtcLog("DataChannel closed for", channelId);
			pushCloseToIframe(channelId);
		};
		registerProxy(channelId, {
			send: (data) => dc.send(data),
			close: () => {
				try {
					dc.close();
				} catch {}
				try {
					pc.close();
				} catch {}
			}
		});
	}
	/** Wire up a BroadcastChannel as a proxy channel (same-browser fast path). */
	function setupBCProxy(channelId, bc) {
		bc.onmessage = (e) => {
			const msg = e.data;
			if (msg?.t === "d") pushToIframe(channelId, msg.p);
			else if (msg?.t === "x") {
				rtcLog("BC peer closed", channelId);
				pushCloseToIframe(channelId);
				bc.close();
			}
		};
		registerProxy(channelId, {
			send: (data) => bc.postMessage({
				t: "d",
				p: data
			}),
			close: () => {
				bc.postMessage({ t: "x" });
				bc.close();
			}
		});
	}
	/**
	* BroadcastChannel handshake for same-browser connections.
	* Returns the channel + id on success, null on timeout.
	*/
	function bcHost(roomId) {
		const bcName = "iota-rtc:" + roomId;
		const bc = new BroadcastChannel(bcName);
		let done = false;
		let timer;
		const promise = new Promise((resolve) => {
			bc.onmessage = (e) => {
				if (done) return;
				if (e.data?.t === "ping") {
					done = true;
					clearTimeout(timer);
					bc.postMessage({ t: "pong" });
					const chId = "bc-" + ++webrtcIdSeq;
					setupBCProxy(chId, bc);
					rtcLog("HOST: BroadcastChannel connected (same browser)!", chId);
					resolve(chId);
				}
			};
		});
		function cancel() {
			if (!done) {
				done = true;
				bc.close();
			}
		}
		return {
			promise,
			cancel
		};
	}
	function bcJoin(roomId, timeoutMs) {
		const bcName = "iota-rtc:" + roomId;
		const bc = new BroadcastChannel(bcName);
		return new Promise((resolve) => {
			let done = false;
			bc.onmessage = (e) => {
				if (done) return;
				if (e.data?.t === "pong") {
					done = true;
					const chId = "bc-" + ++webrtcIdSeq;
					setupBCProxy(chId, bc);
					rtcLog("JOIN: BroadcastChannel connected (same browser)!", chId);
					resolve(chId);
				}
			};
			bc.postMessage({ t: "ping" });
			const retryInterval = setInterval(() => {
				if (!done) bc.postMessage({ t: "ping" });
			}, 500);
			setTimeout(() => {
				clearInterval(retryInterval);
				if (!done) {
					done = true;
					bc.close();
					resolve(null);
				}
			}, timeoutMs);
		});
	}
	function cleanupWebRTC() {
		for (const [, proxy] of proxyChannels) try {
			proxy.close();
		} catch {}
		proxyChannels.clear();
	}
	onMount(() => {
		if ($sharedClientConfig().selected !== "devnet") sharedClientConfig.update((cfg) => ({
			...cfg,
			selected: "devnet"
		}));
		refreshList();
		refreshMyApps();
		(async () => {
			try {
				const bal = await getClient().getBalance({ owner: get(randomKey).address });
				if (BigInt(bal.totalBalance) === 0n) {
					setStatus("New signer detected — requesting devnet funds...");
					await requestFromFaucet();
				}
				await refreshBalance();
			} catch {}
		})();
		function onKeyDown(e) {
			if (e.key === "Escape" && get(appMaximized)) {
				set(appMaximized, false);
				document.body.classList.remove("app-maximized");
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});
	user_effect(() => {
		const wanted = $pageParams().appId;
		if (wanted && (!get(selectedApp) || get(selectedApp).id !== wanted)) openApp(wanted);
		else if (!wanted && get(selectedApp)) {
			set(selectedApp, null);
			set(selectedAppContent, null);
			set(iframeSrcDoc, "");
		}
	});
	user_effect(() => {
		if (get(iframeEl)) {
			const handler = createIframeBridge(get(iframeEl), onBridgeRequest, void 0, (h) => {
				set(iframeHeight, Math.max(200, Math.min(4e3, h)), true);
			});
			window.addEventListener("message", handler.handleMessage);
			return () => {
				window.removeEventListener("message", handler.handleMessage);
				cleanupWebRTC();
			};
		}
	});
	onDestroy(() => {
		document.body.classList.remove("app-maximized");
	});
	function setStatus(msg, isError = false) {
		set(statusMessage, msg, true);
		set(statusIsError, isError, true);
	}
	async function refreshMyApps() {
		set(myAppsError, "");
		if (!$onChainAppsConfig().packageId || !get(randomKey).address) {
			set(myApps, [], true);
			return;
		}
		set(loadingMyApps, true);
		try {
			const client = getClient();
			set(myApps, await fetchOwnedAppCaps(client, $onChainAppsConfig().packageId, get(randomKey).address), true);
		} catch (err) {
			set(myAppsError, err?.message ?? String(err), true);
			set(myApps, [], true);
		} finally {
			set(loadingMyApps, false);
		}
	}
	async function startUpdate(owned) {
		set(updateTarget, owned, true);
		set(updateName, owned.app?.name ?? "", true);
		set(updateDescription, owned.app?.description ?? "", true);
		set(updateContentType, owned.app?.contentType ?? "text/html", true);
		set(updateHtml, "");
		setStatus("");
		if (owned.app) try {
			const bytes = await fetchAppContent(getClient(), owned.app);
			set(updateHtml, new TextDecoder().decode(bytes), true);
		} catch (err) {
			setStatus(`Could not load existing payload: ${err?.message ?? err}`, true);
		}
	}
	function cancelUpdate() {
		set(updateTarget, null);
		set(updateHtml, "");
	}
	async function onUpdateFileSelected(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		set(updateHtml, await file.text(), true);
		if (file.type) set(updateContentType, file.type, true);
	}
	async function submitUpdate() {
		if (!get(updateTarget) || !get(updateTarget).app) return;
		if (!$onChainAppsConfig().packageId) {
			setStatus("Package ID is required.", true);
			return;
		}
		if (!get(updateName).trim()) {
			setStatus("Name is required.", true);
			return;
		}
		set(updating, true);
		setStatus("");
		try {
			const client = getClient();
			const signer = keypairFor(get(randomKey).bech32PrivateKey);
			const chunks = splitChunks(new TextEncoder().encode(get(updateHtml)), DEFAULT_CHUNK_SIZE);
			const firstBatch = chunks.slice(0, 1);
			const updateTx = buildUpdateAppTx({
				packageId: $onChainAppsConfig().packageId,
				appId: get(updateTarget).app.id,
				appCapId: get(updateTarget).capId,
				name: get(updateName),
				description: get(updateDescription),
				contentType: get(updateContentType),
				chunks: firstBatch
			});
			await client.signAndExecuteTransaction({
				transaction: updateTx,
				signer,
				options: {
					showEffects: true,
					showEvents: true
				}
			});
			for (let i = 1; i < chunks.length; i++) {
				const appendTx = buildAppendChunksTx({
					packageId: $onChainAppsConfig().packageId,
					appId: get(updateTarget).app.id,
					appCapId: get(updateTarget).capId,
					chunks: [chunks[i]]
				});
				await client.signAndExecuteTransaction({
					transaction: appendTx,
					signer,
					options: { showEffects: true }
				});
				setStatus(`Uploaded chunk ${i + 1} / ${chunks.length}...`);
			}
			setStatus(`Updated ${get(updateTarget).app.id}. Existing viewers will pick up the new version on their next load.`);
			set(updateTarget, null);
			await Promise.all([refreshList(), refreshMyApps()]);
		} catch (err) {
			setStatus(`Update failed: ${err?.message ?? err}`, true);
		} finally {
			set(updating, false);
		}
	}
	async function refreshList() {
		setStatus("");
		set(apps, [], true);
		set(selectedApp, null);
		set(selectedAppContent, null);
		set(iframeSrcDoc, "");
		set(loadError, "");
		if (!$onChainAppsConfig().registryId) {
			set(loadError, "Registry ID not configured yet. Publish the Move package and paste the IDs into the settings below.");
			return;
		}
		set(loadingList, true);
		try {
			const client = getClient();
			const metas = await fetchAppMetadatas(client, await listAppIds(client, $onChainAppsConfig().registryId));
			metas.sort((a, b) => (b.publishedAtMs || 0) - (a.publishedAtMs || 0));
			set(apps, metas, true);
		} catch (err) {
			set(loadError, err?.message ?? String(err), true);
		} finally {
			set(loadingList, false);
		}
	}
	async function openApp(appId) {
		set(loadingApp, true);
		try {
			const client = getClient();
			const app = await fetchAppMetadata(client, appId);
			set(selectedApp, app, true);
			updatePageQueryParams({ appId: app.id });
			const hashParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
			for (const [key, val] of hashParams.entries()) if (key !== "appId" && val) writeAppLocal(app.id, "_param_" + key, val);
			const bytes = await fetchAppContent(client, app);
			set(selectedAppContent, bytes, true);
			const html = new TextDecoder().decode(bytes);
			set(iframeSrcDoc, wrapAppHtml(html), true);
			if (!get(appMaximized)) {
				set(appMaximized, true);
				window.scrollTo(0, 0);
				document.body.classList.add("app-maximized");
			}
		} catch (err) {
			setStatus(`Failed to load app: ${err?.message ?? err}`, true);
			set(selectedApp, null);
			set(selectedAppContent, null);
			set(iframeSrcDoc, "");
		} finally {
			set(loadingApp, false);
		}
	}
	function wrapAppHtml(userHtml) {
		return `<!DOCTYPE html><html><head><meta charset="utf-8"><script>` + BOOTSTRAP_JS + "<\/script></head><body>" + userHtml + `</body></html>`;
	}
	function closeApp() {
		set(selectedApp, null);
		set(selectedAppContent, null);
		set(iframeSrcDoc, "");
		set(appMaximized, false);
		document.body.classList.remove("app-maximized");
		updatePageQueryParams({ appId: null });
	}
	async function onBridgeRequest(method, args) {
		if (method.startsWith("webrtc")) console.log("[Bridge] request:", method, args);
		const client = getClient();
		const appId = get(selectedApp)?.id ?? "";
		switch (method) {
			case "getAddress": return get(randomKey).address;
			case "getNetwork": return $sharedClientConfig().selected;
			case "getAppId": return appId;
			case "getParam": {
				const key = args?.key;
				if (!key) return null;
				return getCurrentPageQueryParams()[key] ?? null;
			}
			case "rpc": {
				const { method: rpcMethod, args: rpcArgs = [] } = args ?? {};
				const fn = client[rpcMethod];
				if (typeof fn !== "function") throw new Error(`Unknown client RPC method: ${rpcMethod}`);
				return await fn.apply(client, rpcArgs);
			}
			case "signAndExecute": {
				const txJson = args?.txJson;
				if (!txJson) throw new Error("missing txJson");
				const tx = typeof txJson === "string" ? Transaction.from(txJson) : Transaction.from(JSON.stringify(txJson));
				return await client.signAndExecuteTransaction({
					transaction: tx,
					signer: keypairFor(get(randomKey).bech32PrivateKey),
					options: {
						showEffects: true,
						showObjectChanges: true,
						showEvents: true
					}
				});
			}
			case "storageSet":
			case "storageSetShared": {
				const { key, value } = args ?? {};
				if (!$onChainAppsConfig().packageId || !$onChainAppsConfig().storageId) throw new Error("on-chain storage is not configured");
				if (!appId) throw new Error("no active app");
				const bytes = coerceToBytes(value);
				const tx = buildStorageSetTx({
					packageId: $onChainAppsConfig().packageId,
					storageId: $onChainAppsConfig().storageId,
					appId,
					key,
					value: bytes,
					shared: method === "storageSetShared"
				});
				return await client.signAndExecuteTransaction({
					transaction: tx,
					signer: keypairFor(get(randomKey).bech32PrivateKey),
					options: {
						showEffects: true,
						showEvents: true
					}
				});
			}
			case "storageGet":
			case "storageGetShared": {
				const { key, opts = {} } = args ?? {};
				if (!$onChainAppsConfig().storageId) throw new Error("on-chain storage is not configured");
				if (!appId) throw new Error("no active app");
				const bytes = await readStorageValue(client, appId, opts.user ?? get(randomKey).address, key, method === "storageGetShared");
				if (!bytes) return null;
				return opts.encoding === "base64" ? toBase64(bytes) : new TextDecoder().decode(bytes);
			}
			case "storageRemove": {
				const { key } = args ?? {};
				if (!$onChainAppsConfig().packageId || !$onChainAppsConfig().storageId) throw new Error("on-chain storage is not configured");
				if (!appId) throw new Error("no active app");
				const tx = new Transaction();
				tx.moveCall({
					target: `${$onChainAppsConfig().packageId}::generic_storage::remove`,
					arguments: [
						tx.object($onChainAppsConfig().storageId),
						tx.pure.address(appId),
						tx.pure.string(key)
					]
				});
				return await client.signAndExecuteTransaction({
					transaction: tx,
					signer: keypairFor(get(randomKey).bech32PrivateKey),
					options: { showEffects: true }
				});
			}
			case "localGet": return readAppLocal(appId, args?.key);
			case "localSet":
				writeAppLocal(appId, args?.key, args?.value);
				return true;
			case "localRemove":
				removeAppLocal(appId, args?.key);
				return true;
			case "webrtcHost": {
				const roomId = args?.roomId || crypto.randomUUID();
				const prefix = "webrtc:" + roomId;
				const iceServers = args?.iceServers || DEFAULT_ICE_SERVERS;
				const timeout = args?.timeout || 12e4;
				rtcLog("HOST: creating room", roomId);
				const bcHandle = bcHost(roomId);
				const pc = new RTCPeerConnection({ iceServers });
				const dc = pc.createDataChannel(args?.label || "data");
				rtcLog("HOST: creating offer...");
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				rtcLog("HOST: gathering ICE...");
				const fullOffer = await gatherIce(pc);
				rtcLog("HOST: writing offer to chain...");
				await rtcWriteShared(prefix + ":offer", JSON.stringify(fullOffer));
				const earlyBc = await Promise.race([bcHandle.promise, new Promise((r) => setTimeout(() => r(null), 0))]);
				if (earlyBc) {
					pc.close();
					return {
						channelId: earlyBc,
						roomId
					};
				}
				rtcLog("HOST: polling for answer (+ BC fallback)...");
				const rtcPath = (async () => {
					const answerJson = await rtcPollShared(prefix + ":answer", timeout);
					rtcLog("HOST: got answer, setting remote desc...");
					await pc.setRemoteDescription(JSON.parse(answerJson));
					rtcLog("HOST: waiting for datachannel open...");
					await waitForOpen(dc);
					const chId = "ch-" + ++webrtcIdSeq;
					setupRTCProxy(chId, pc, dc);
					rtcLog("HOST: WebRTC connected!", chId);
					return chId;
				})();
				const winnerId = await Promise.race([bcHandle.promise.then((id) => id ? id : rtcPath), rtcPath]);
				bcHandle.cancel();
				if (winnerId.startsWith("bc-")) pc.close();
				return {
					channelId: winnerId,
					roomId
				};
			}
			case "webrtcJoin": {
				if (!args?.roomId) throw new Error("roomId is required");
				const jRoomId = args.roomId;
				const jPrefix = "webrtc:" + jRoomId;
				const jIce = args?.iceServers || DEFAULT_ICE_SERVERS;
				const jTimeout = args?.timeout || 12e4;
				rtcLog("JOIN: joining room", jRoomId);
				const bcChId = await bcJoin(jRoomId, 2e3);
				if (bcChId) return {
					channelId: bcChId,
					roomId: jRoomId
				};
				rtcLog("JOIN: BC not available, using WebRTC...");
				const jPc = new RTCPeerConnection({ iceServers: jIce });
				const dcListener = listenForDataChannel(jPc);
				rtcLog("JOIN: polling for offer...");
				const offerJson = await rtcPollShared(jPrefix + ":offer", jTimeout);
				rtcLog("JOIN: got offer, setting remote desc...");
				await jPc.setRemoteDescription(JSON.parse(offerJson));
				rtcLog("JOIN: creating answer...");
				const jAnswer = await jPc.createAnswer();
				await jPc.setLocalDescription(jAnswer);
				rtcLog("JOIN: gathering ICE...");
				const fullAnswer = await gatherIce(jPc);
				rtcLog("JOIN: writing answer to chain...");
				await rtcWriteShared(jPrefix + ":answer", JSON.stringify(fullAnswer));
				rtcLog("JOIN: signaling done, waiting for datachannel (30 s)...");
				dcListener.startTimeout(3e4);
				const jDc = await dcListener.promise;
				rtcLog("JOIN: got datachannel, waiting for open...");
				await waitForOpen(jDc);
				const joinChId = "ch-" + ++webrtcIdSeq;
				setupRTCProxy(joinChId, jPc, jDc);
				rtcLog("JOIN: WebRTC connected!", joinChId);
				return {
					channelId: joinChId,
					roomId: jRoomId
				};
			}
			case "webrtcSend": {
				const proxy = proxyChannels.get(args?.channelId);
				if (!proxy) throw new Error("Unknown channel: " + args?.channelId);
				proxy.send(args.data);
				return true;
			}
			case "webrtcClose": {
				rtcLog("closing channel", args?.channelId);
				const proxy = proxyChannels.get(args?.channelId);
				if (proxy) {
					try {
						proxy.close();
					} catch {}
					proxyChannels.delete(args.channelId);
				}
				return true;
			}
			default: throw new Error(`Unsupported bridge method: ${method}`);
		}
	}
	function coerceToBytes(value) {
		if (value instanceof Uint8Array) return value;
		if (typeof value === "string") return new TextEncoder().encode(value);
		if (value && typeof value === "object" && "base64" in value) return fromBase64(value.base64);
		return new TextEncoder().encode(JSON.stringify(value));
	}
	async function readStorageValue(client, appId, user, key, shared) {
		if (!$onChainAppsConfig().packageId) return null;
		const pkg = $onChainAppsConfig().packageId;
		const storageId = $onChainAppsConfig().storageId;
		const keyType = shared ? `${pkg}::generic_storage::SharedKey` : `${pkg}::generic_storage::UserKey`;
		const keyValue = shared ? {
			app_id: appId,
			key
		} : {
			app_id: appId,
			user,
			key
		};
		try {
			const resp = await client.getDynamicFieldObject({
				parentObjectId: storageId,
				name: {
					type: keyType,
					value: keyValue
				},
				options: { showContent: true }
			});
			if (!resp.data) return null;
			const raw = (resp.data.content?.fields)?.value;
			if (raw == null) return null;
			if (typeof raw === "string") return fromBase64(raw);
			if (Array.isArray(raw)) return new Uint8Array(raw);
			return null;
		} catch {
			return null;
		}
	}
	function localKeyFor(appId, key) {
		return `onchainApps:${appId}:${key}`;
	}
	function readAppLocal(appId, key) {
		if (!appId || typeof localStorage === "undefined") return null;
		return localStorage.getItem(localKeyFor(appId, key));
	}
	function writeAppLocal(appId, key, value) {
		if (!appId || typeof localStorage === "undefined") return;
		localStorage.setItem(localKeyFor(appId, key), String(value));
	}
	function removeAppLocal(appId, key) {
		if (!appId || typeof localStorage === "undefined") return;
		localStorage.removeItem(localKeyFor(appId, key));
	}
	async function refreshBalance() {
		try {
			const bal = await getClient().getBalance({ owner: get(randomKey).address });
			const nano = BigInt(bal.totalBalance);
			if (nano === 0n) set(signerBalance, "0 IOTA");
			else if (nano < 1000000000n) set(signerBalance, `${(Number(nano) / 1e9).toFixed(4)} IOTA`);
			else set(signerBalance, `${(Number(nano) / 1e9).toFixed(2)} IOTA`);
		} catch {
			set(signerBalance, "");
		}
	}
	function rotateKey() {
		if (!confirm("Generating a new random key will drop the current one (along with whatever devnet IOTA it holds). Continue?")) return;
		set(randomKey, generateAndStoreRandomKey(), true);
		set(signerBalance, "");
		refreshMyApps();
		refreshBalance();
	}
	async function requestFromFaucet() {
		const faucetUrl = $sharedClientConfig().networks.find((n) => n.name === $sharedClientConfig().selected)?.faucet;
		if (!faucetUrl) {
			setStatus("Selected network has no faucet configured.", true);
			return;
		}
		try {
			await requestIotaFromFaucetV0({
				host: faucetUrl,
				recipient: get(randomKey).address
			});
			setStatus(`Requested funds — balance will update shortly.`);
			setTimeout(() => refreshBalance(), 3e3);
		} catch (err) {
			setStatus(`Faucet request failed: ${err?.message ?? err}`, true);
		}
	}
	function copyShareLink() {
		if (!get(selectedApp)) return;
		const url = new URL(window.location.href);
		if (url.hash && url.hash.startsWith("#/")) {
			const [route] = url.hash.split("?");
			url.hash = `${route}?appId=${get(selectedApp).id}`;
		} else url.searchParams.set("appId", get(selectedApp).id);
		navigator.clipboard.writeText(url.toString());
		setStatus("Shareable link copied to clipboard.");
	}
	async function publishApp() {
		if (!$onChainAppsConfig().packageId || !$onChainAppsConfig().registryId) {
			setStatus("Configure packageId and registryId before publishing.", true);
			return;
		}
		if (!get(publishName).trim()) {
			setStatus("Name is required.", true);
			return;
		}
		set(publishing, true);
		set(publishResultUrl, "");
		setStatus("");
		try {
			const client = getClient();
			const signer = keypairFor(get(randomKey).bech32PrivateKey);
			const chunks = splitChunks(new TextEncoder().encode(get(publishHtml)), DEFAULT_CHUNK_SIZE);
			const firstBatch = chunks.slice(0, 1);
			const publishTx = buildPublishTx({
				packageId: $onChainAppsConfig().packageId,
				registryId: $onChainAppsConfig().registryId,
				name: get(publishName),
				description: get(publishDescription),
				contentType: get(publishContentType),
				firstChunks: firstBatch
			});
			const objectChanges = (await client.signAndExecuteTransaction({
				transaction: publishTx,
				signer,
				options: {
					showEffects: true,
					showObjectChanges: true,
					showEvents: true
				}
			})).objectChanges ?? [];
			const newApp = objectChanges.find((c) => c.type === "created" && typeof c.objectType === "string" && c.objectType.endsWith("::app::App"));
			const newCap = objectChanges.find((c) => c.type === "created" && typeof c.objectType === "string" && c.objectType.endsWith("::app::AppCap"));
			if (!newApp || !newCap) throw new Error(`Could not find created App/AppCap in object changes: ${JSON.stringify(objectChanges)}`);
			const appId = newApp.objectId;
			const capId = newCap.objectId;
			for (let i = 1; i < chunks.length; i++) {
				const appendTx = buildAppendChunksTx({
					packageId: $onChainAppsConfig().packageId,
					appId,
					appCapId: capId,
					chunks: [chunks[i]]
				});
				await client.signAndExecuteTransaction({
					transaction: appendTx,
					signer,
					options: { showEffects: true }
				});
				setStatus(`Uploaded chunk ${i + 1} / ${chunks.length}...`);
			}
			setStatus(`Published app ${appId} (${chunks.length} chunks).`);
			set(publishResultUrl, window.location.href.split("?")[0] + `?appId=${appId}`);
			await Promise.all([refreshList(), refreshMyApps()]);
			set(showPublish, false);
		} catch (err) {
			setStatus(`Publish failed: ${err?.message ?? err}`, true);
		} finally {
			set(publishing, false);
		}
	}
	async function onFileSelected(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		set(publishHtml, await file.text(), true);
		if (!get(publishName)) set(publishName, file.name, true);
		if (!get(publishContentType) && file.type) set(publishContentType, file.type, true);
	}
	var main = root_22();
	var header = child(main);
	var div = sibling(child(header), 2);
	var button = child(div);
	var text = child(button, true);
	reset(button);
	var button_1 = sibling(button, 2);
	var text_1 = child(button_1, true);
	reset(button_1);
	reset(div);
	reset(header);
	var node = sibling(header, 2);
	var consequent = ($$anchor) => {
		var div_1 = root();
		let classes;
		var text_2 = child(div_1, true);
		reset(div_1);
		template_effect(() => {
			classes = set_class(div_1, 1, "status svelte-1r06gu", null, classes, { error: get(statusIsError) });
			set_text(text_2, get(statusMessage));
		});
		append($$anchor, div_1);
	};
	if_block(node, ($$render) => {
		if (get(statusMessage)) $$render(consequent);
	});
	var node_1 = sibling(node, 2);
	var consequent_2 = ($$anchor) => {
		var section = root_2();
		var label = sibling(child(section), 2);
		var input_1 = sibling(child(label));
		remove_input_defaults(input_1);
		reset(label);
		var label_1 = sibling(label, 2);
		var textarea = sibling(child(label_1));
		remove_textarea_child(textarea);
		reset(label_1);
		var label_2 = sibling(label_1, 2);
		var input_2 = sibling(child(label_2));
		remove_input_defaults(input_2);
		reset(label_2);
		var label_3 = sibling(label_2, 2);
		var input_3 = sibling(child(label_3));
		reset(label_3);
		var label_4 = sibling(label_3, 2);
		var textarea_1 = sibling(child(label_4));
		remove_textarea_child(textarea_1);
		reset(label_4);
		var div_2 = sibling(label_4, 2);
		var button_2 = child(div_2);
		var text_3 = child(button_2, true);
		reset(button_2);
		var node_2 = sibling(button_2, 2);
		var consequent_1 = ($$anchor) => {
			var a_1 = root_1();
			var text_4 = child(a_1, true);
			reset(a_1);
			template_effect(() => {
				set_attribute(a_1, "href", get(publishResultUrl));
				set_text(text_4, get(publishResultUrl));
			});
			append($$anchor, a_1);
		};
		if_block(node_2, ($$render) => {
			if (get(publishResultUrl)) $$render(consequent_1);
		});
		reset(div_2);
		var details = sibling(div_2, 2);
		var div_3 = sibling(child(details), 2);
		var button_3 = sibling(child(div_3), 2);
		reset(div_3);
		var pre = sibling(div_3, 2);
		var text_5 = child(pre, true);
		reset(pre);
		reset(details);
		reset(section);
		template_effect(() => {
			button_2.disabled = get(publishing);
			set_text(text_3, get(publishing) ? "Publishing..." : "Publish to devnet");
			set_text(text_5, SKILL_default);
		});
		bind_value(input_1, () => get(publishName), ($$value) => set(publishName, $$value));
		bind_value(textarea, () => get(publishDescription), ($$value) => set(publishDescription, $$value));
		bind_value(input_2, () => get(publishContentType), ($$value) => set(publishContentType, $$value));
		delegated("change", input_3, onFileSelected);
		bind_value(textarea_1, () => get(publishHtml), ($$value) => set(publishHtml, $$value));
		delegated("click", button_2, publishApp);
		delegated("click", button_3, () => navigator.clipboard.writeText(SKILL_default).then(() => {
			const btn = document.querySelector(".skill-copy");
			if (btn) {
				btn.textContent = "Copied!";
				setTimeout(() => {
					btn.textContent = "Copy";
				}, 2e3);
			}
		}));
		append($$anchor, section);
	};
	if_block(node_1, ($$render) => {
		if (get(showPublish)) $$render(consequent_2);
	});
	var node_3 = sibling(node_1, 2);
	var consequent_6 = ($$anchor) => {
		var section_1 = root_6();
		var div_4 = child(section_1);
		var div_5 = child(div_4);
		var h3 = child(div_5);
		var text_6 = child(h3, true);
		reset(h3);
		var p = sibling(h3, 2);
		var text_7 = child(p, true);
		reset(p);
		var p_1 = sibling(p, 2);
		var span = child(p_1);
		var text_8 = child(span);
		reset(span);
		var span_1 = sibling(span, 2);
		var text_9 = child(span_1);
		reset(span_1);
		var span_2 = sibling(span_1, 2);
		var text_10 = child(span_2);
		reset(span_2);
		var span_3 = sibling(span_2, 2);
		var text_11 = child(span_3);
		reset(span_3);
		var span_4 = sibling(span_3, 2);
		var text_12 = child(span_4);
		reset(span_4);
		var span_5 = sibling(span_4, 2);
		var code = sibling(child(span_5));
		var text_13 = child(code, true);
		reset(code);
		reset(span_5);
		reset(p_1);
		reset(div_5);
		var div_6 = sibling(div_5, 2);
		var button_4 = child(div_6);
		var button_5 = sibling(button_4, 2);
		var text_14 = child(button_5, true);
		reset(button_5);
		var button_6 = sibling(button_5, 2);
		reset(div_6);
		reset(div_4);
		var node_4 = sibling(div_4, 2);
		var consequent_3 = ($$anchor) => {
			append($$anchor, root_3());
		};
		var consequent_5 = ($$anchor) => {
			var fragment = root_5();
			var node_5 = first_child(fragment);
			var consequent_4 = ($$anchor) => {
				var button_7 = root_4();
				delegated("click", button_7, () => {
					set(appMaximized, false);
					document.body.classList.remove("app-maximized");
				});
				append($$anchor, button_7);
			};
			if_block(node_5, ($$render) => {
				if (get(appMaximized)) $$render(consequent_4);
			});
			var iframe = sibling(node_5, 2);
			let classes_1;
			bind_this(iframe, ($$value) => set(iframeEl, $$value), () => get(iframeEl));
			template_effect(() => {
				set_attribute(iframe, "title", get(selectedApp).name);
				set_attribute(iframe, "srcdoc", get(iframeSrcDoc));
				set_style(iframe, `height: ${get(appMaximized) ? "100%" : get(iframeHeight) + "px"}`);
				classes_1 = set_class(iframe, 1, "svelte-1r06gu", null, classes_1, { "iframe-maximized": get(appMaximized) });
			});
			append($$anchor, fragment);
		};
		if_block(node_4, ($$render) => {
			if (get(loadingApp)) $$render(consequent_3);
			else if (get(iframeSrcDoc)) $$render(consequent_5, 1);
		});
		reset(section_1);
		template_effect(($0, $1, $2) => {
			set_text(text_6, get(selectedApp).name);
			set_text(text_7, get(selectedApp).description || "");
			set_text(text_8, `v${get(selectedApp).appVersion ?? ""}`);
			set_text(text_9, `pkg v${get(selectedApp).packageVersion ?? ""}`);
			set_text(text_10, `${get(selectedApp).chunkCount ?? ""} chunks (${$0 ?? ""})`);
			set_text(text_11, `published ${$1 ?? ""}`);
			set_text(text_12, `last update ${$2 ?? ""}`);
			set_text(text_13, get(selectedApp).publisher);
			set_text(text_14, get(appMaximized) ? "↙ Minimize" : "↗ Maximize");
		}, [
			() => formatSize(get(selectedApp).totalSize),
			() => formatDate(get(selectedApp).publishedAtMs),
			() => formatDate(get(selectedApp).updatedAtMs)
		]);
		delegated("click", button_4, copyShareLink);
		delegated("click", button_5, () => {
			set(appMaximized, !get(appMaximized));
			if (get(appMaximized)) {
				window.scrollTo(0, 0);
				document.body.classList.add("app-maximized");
			} else document.body.classList.remove("app-maximized");
		});
		delegated("click", button_6, closeApp);
		append($$anchor, section_1);
	};
	var consequent_7 = ($$anchor) => {
		var section_2 = root_7();
		var h3_1 = child(section_2);
		var text_15 = child(h3_1);
		reset(h3_1);
		var p_3 = sibling(h3_1, 2);
		var text_16 = child(p_3);
		var code_1 = sibling(text_16);
		var text_17 = child(code_1, true);
		reset(code_1);
		next();
		reset(p_3);
		var label_5 = sibling(p_3, 2);
		var input_4 = sibling(child(label_5));
		remove_input_defaults(input_4);
		reset(label_5);
		var label_6 = sibling(label_5, 2);
		var textarea_2 = sibling(child(label_6));
		remove_textarea_child(textarea_2);
		reset(label_6);
		var label_7 = sibling(label_6, 2);
		var input_5 = sibling(child(label_7));
		remove_input_defaults(input_5);
		reset(label_7);
		var label_8 = sibling(label_7, 2);
		var input_6 = sibling(child(label_8));
		reset(label_8);
		var label_9 = sibling(label_8, 2);
		var textarea_3 = sibling(child(label_9));
		remove_textarea_child(textarea_3);
		reset(label_9);
		var div_7 = sibling(label_9, 2);
		var button_8 = child(div_7);
		var text_18 = child(button_8, true);
		reset(button_8);
		var button_9 = sibling(button_8, 2);
		reset(div_7);
		reset(section_2);
		template_effect(() => {
			set_text(text_15, `Update ${get(updateTarget).app.name ?? ""}`);
			set_text(text_16, `Current on-chain version: v${get(updateTarget).app.appVersion ?? ""}. Publishing will bump it to
                v${get(updateTarget).app.appVersion + 1}. The shared object id (`);
			set_text(text_17, get(updateTarget).app.id);
			button_8.disabled = get(updating);
			set_text(text_18, get(updating) ? "Updating..." : "Publish new version");
			button_9.disabled = get(updating);
		});
		bind_value(input_4, () => get(updateName), ($$value) => set(updateName, $$value));
		bind_value(textarea_2, () => get(updateDescription), ($$value) => set(updateDescription, $$value));
		bind_value(input_5, () => get(updateContentType), ($$value) => set(updateContentType, $$value));
		delegated("change", input_6, onUpdateFileSelected);
		bind_value(textarea_3, () => get(updateHtml), ($$value) => set(updateHtml, $$value));
		delegated("click", button_8, submitUpdate);
		delegated("click", button_9, cancelUpdate);
		append($$anchor, section_2);
	};
	var alternate_4 = ($$anchor) => {
		var fragment_1 = root_20();
		var section_3 = first_child(fragment_1);
		var h3_2 = child(section_3);
		var text_19 = child(h3_2);
		reset(h3_2);
		var node_6 = sibling(h3_2, 2);
		var consequent_8 = ($$anchor) => {
			var div_8 = root_8();
			var text_20 = child(div_8, true);
			reset(div_8);
			template_effect(() => set_text(text_20, get(loadError)));
			append($$anchor, div_8);
		};
		if_block(node_6, ($$render) => {
			if (get(loadError)) $$render(consequent_8);
		});
		var node_7 = sibling(node_6, 2);
		var consequent_9 = ($$anchor) => {
			append($$anchor, root_9());
		};
		var consequent_10 = ($$anchor) => {
			append($$anchor, root_10());
		};
		var alternate_1 = ($$anchor) => {
			const appCard = ($$anchor, app = noop) => {
				const initials = user_derived(() => app().name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?");
				const hue = user_derived(() => [...app().id].reduce((h, c) => h * 31 + c.charCodeAt(0) & 65535, 0) % 360);
				var li = root_12();
				var div_9 = child(li);
				var div_10 = child(div_9);
				var div_11 = child(div_10);
				var text_21 = child(div_11, true);
				reset(div_11);
				var div_12 = sibling(div_11, 2);
				var div_13 = child(div_12);
				var text_22 = child(div_13, true);
				reset(div_13);
				var div_14 = sibling(div_13, 2);
				var text_23 = child(div_14, true);
				reset(div_14);
				reset(div_12);
				var button_10 = sibling(div_12, 2);
				let classes_2;
				reset(div_10);
				var node_8 = sibling(div_10, 2);
				var consequent_11 = ($$anchor) => {
					var div_15 = root_11();
					var text_24 = child(div_15, true);
					reset(div_15);
					template_effect(() => set_text(text_24, app().description));
					append($$anchor, div_15);
				};
				if_block(node_8, ($$render) => {
					if (app().description) $$render(consequent_11);
				});
				var div_16 = sibling(node_8, 2);
				var span_6 = child(div_16);
				var text_25 = child(span_6, true);
				reset(span_6);
				var button_11 = sibling(span_6, 2);
				reset(div_16);
				reset(div_9);
				reset(li);
				template_effect(($0, $1, $2, $3, $4) => {
					set_style(div_11, `--hue:${get(hue) ?? ""}`);
					set_text(text_21, get(initials));
					set_text(text_22, app().name);
					set_text(text_23, $0);
					classes_2 = set_class(button_10, 1, "star-btn svelte-1r06gu", null, classes_2, $1);
					set_attribute(button_10, "title", $2);
					set_attribute(button_10, "aria-label", $3);
					set_text(text_25, $4);
				}, [
					() => formatSize(app().totalSize),
					() => ({ starred: get(starred).has(app().id) }),
					() => get(starred).has(app().id) ? "Unstar" : "Star",
					() => get(starred).has(app().id) ? "Unstar" : "Star",
					() => formatDate(app().publishedAtMs)
				]);
				delegated("click", button_10, () => toggleStar(app().id));
				delegated("click", button_11, () => openApp(app().id));
				append($$anchor, li);
			};
			var fragment_2 = comment();
			var node_9 = first_child(fragment_2);
			var consequent_13 = ($$anchor) => {
				var fragment_3 = root_14();
				var ul = first_child(fragment_3);
				each(ul, 21, () => get(sortedApps).pinned, (app) => app.id, ($$anchor, app) => {
					appCard($$anchor, () => get(app));
				});
				reset(ul);
				var node_10 = sibling(ul, 2);
				var consequent_12 = ($$anchor) => {
					var fragment_5 = root_13();
					var ul_1 = sibling(first_child(fragment_5), 2);
					each(ul_1, 21, () => get(sortedApps).rest, (app) => app.id, ($$anchor, app) => {
						appCard($$anchor, () => get(app));
					});
					reset(ul_1);
					append($$anchor, fragment_5);
				};
				if_block(node_10, ($$render) => {
					if (get(sortedApps).rest.length > 0) $$render(consequent_12);
				});
				append($$anchor, fragment_3);
			};
			var alternate = ($$anchor) => {
				var ul_2 = root_15();
				each(ul_2, 21, () => get(sortedApps).rest, (app) => app.id, ($$anchor, app) => {
					appCard($$anchor, () => get(app));
				});
				reset(ul_2);
				append($$anchor, ul_2);
			};
			if_block(node_9, ($$render) => {
				if (get(sortedApps).pinned.length > 0) $$render(consequent_13);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment_2);
		};
		if_block(node_7, ($$render) => {
			if (get(loadingList)) $$render(consequent_9);
			else if (get(apps).length === 0 && !get(loadError)) $$render(consequent_10, 1);
			else $$render(alternate_1, -1);
		});
		reset(section_3);
		var section_4 = sibling(section_3, 2);
		var div_17 = child(section_4);
		var h3_3 = child(div_17);
		var text_26 = child(h3_3);
		reset(h3_3);
		var button_12 = sibling(h3_3, 2);
		var text_27 = child(button_12, true);
		reset(button_12);
		reset(div_17);
		var node_11 = sibling(div_17, 4);
		var consequent_14 = ($$anchor) => {
			var div_18 = root_8();
			var text_28 = child(div_18, true);
			reset(div_18);
			template_effect(() => set_text(text_28, get(myAppsError)));
			append($$anchor, div_18);
		};
		if_block(node_11, ($$render) => {
			if (get(myAppsError)) $$render(consequent_14);
		});
		var node_12 = sibling(node_11, 2);
		var consequent_15 = ($$anchor) => {
			append($$anchor, root_16());
		};
		var alternate_3 = ($$anchor) => {
			var ul_3 = root_15();
			each(ul_3, 21, () => get(myApps), (owned) => owned.capId, ($$anchor, owned) => {
				var li_1 = root_19();
				var div_19 = child(li_1);
				var node_13 = child(div_19);
				var consequent_16 = ($$anchor) => {
					var fragment_8 = root_17();
					var div_20 = first_child(fragment_8);
					var text_29 = child(div_20, true);
					reset(div_20);
					var div_21 = sibling(div_20, 2);
					var text_30 = child(div_21, true);
					reset(div_21);
					var div_22 = sibling(div_21, 2);
					var span_7 = child(div_22);
					var text_31 = child(span_7);
					reset(span_7);
					var span_8 = sibling(span_7, 2);
					var text_32 = child(span_8);
					reset(span_8);
					var span_9 = sibling(span_8, 2);
					var text_33 = child(span_9);
					reset(span_9);
					var span_10 = sibling(span_9, 2);
					var text_34 = child(span_10);
					reset(span_10);
					reset(div_22);
					template_effect(($0, $1) => {
						set_text(text_29, get(owned).app.name);
						set_text(text_30, get(owned).app.description || "—");
						set_text(text_31, `v${get(owned).app.appVersion ?? ""}`);
						set_text(text_32, `pkg v${get(owned).app.packageVersion ?? ""}`);
						set_text(text_33, `${get(owned).app.chunkCount ?? ""} chunks · ${$0 ?? ""}`);
						set_text(text_34, `updated ${$1 ?? ""}`);
					}, [() => formatSize(get(owned).app.totalSize), () => formatDate(get(owned).app.updatedAtMs)]);
					append($$anchor, fragment_8);
				};
				var alternate_2 = ($$anchor) => {
					var fragment_9 = root_18();
					next(2);
					append($$anchor, fragment_9);
				};
				if_block(node_13, ($$render) => {
					if (get(owned).app) $$render(consequent_16);
					else $$render(alternate_2, -1);
				});
				var div_23 = sibling(node_13, 2);
				var text_35 = child(div_23);
				reset(div_23);
				var div_24 = sibling(div_23, 2);
				var text_36 = child(div_24);
				reset(div_24);
				var div_25 = sibling(div_24, 2);
				var button_13 = child(div_25);
				var button_14 = sibling(button_13, 2);
				reset(div_25);
				reset(div_19);
				reset(li_1);
				template_effect(() => {
					set_text(text_35, `app ${get(owned).appId ?? ""}`);
					set_text(text_36, `cap ${get(owned).capId ?? ""}`);
					button_13.disabled = !get(owned).app;
					button_14.disabled = !get(owned).app;
				});
				delegated("click", button_13, () => openApp(get(owned).appId));
				delegated("click", button_14, () => startUpdate(get(owned)));
				append($$anchor, li_1);
			});
			reset(ul_3);
			append($$anchor, ul_3);
		};
		if_block(node_12, ($$render) => {
			if (get(myApps).length === 0 && !get(loadingMyApps)) $$render(consequent_15);
			else $$render(alternate_3, -1);
		});
		reset(section_4);
		template_effect(() => {
			set_text(text_19, `Published apps (${get(apps).length ?? ""})`);
			set_text(text_26, `My apps (${get(myApps).length ?? ""})`);
			button_12.disabled = get(loadingMyApps);
			set_text(text_27, get(loadingMyApps) ? "Loading..." : "↻ Refresh");
		});
		delegated("click", button_12, refreshMyApps);
		append($$anchor, fragment_1);
	};
	if_block(node_3, ($$render) => {
		if (get(selectedApp)) $$render(consequent_6);
		else if (get(updateTarget) && get(updateTarget).app) $$render(consequent_7, 1);
		else $$render(alternate_4, -1);
	});
	var details_1 = sibling(node_3, 2);
	var div_26 = sibling(child(details_1), 4);
	var div_27 = child(div_26);
	var text_37 = sibling(child(div_27));
	reset(div_27);
	var div_28 = sibling(div_27, 2);
	var code_2 = sibling(child(div_28), 2);
	var text_38 = child(code_2, true);
	reset(code_2);
	reset(div_28);
	var node_14 = sibling(div_28, 2);
	var consequent_17 = ($$anchor) => {
		var div_29 = root_21();
		var text_39 = sibling(child(div_29));
		reset(div_29);
		template_effect(() => set_text(text_39, ` ${get(signerBalance) ?? ""}`));
		append($$anchor, div_29);
	};
	if_block(node_14, ($$render) => {
		if (get(signerBalance)) $$render(consequent_17);
	});
	reset(div_26);
	var div_30 = sibling(div_26, 2);
	var button_15 = child(div_30);
	var button_16 = sibling(button_15, 2);
	var a_2 = sibling(button_16, 2);
	reset(div_30);
	reset(details_1);
	var details_2 = sibling(details_1, 2);
	var label_10 = sibling(child(details_2), 4);
	var input_7 = sibling(child(label_10));
	remove_input_defaults(input_7);
	reset(label_10);
	var label_11 = sibling(label_10, 2);
	var input_8 = sibling(child(label_11));
	remove_input_defaults(input_8);
	reset(label_11);
	var label_12 = sibling(label_11, 2);
	var input_9 = sibling(child(label_12));
	remove_input_defaults(input_9);
	reset(label_12);
	reset(details_2);
	reset(main);
	template_effect(($0) => {
		button.disabled = get(loadingList);
		set_text(text, get(loadingList) ? "Loading..." : "↻ Reload list");
		set_text(text_1, get(showPublish) ? "Hide publish form" : "+ Publish new app");
		set_text(text_37, ` ${$sharedClientConfig().selected ?? ""}`);
		set_text(text_38, get(randomKey).address);
		set_attribute(a_2, "href", $0);
	}, [() => `${getSelectedNetworkConfig().explorer}/address/${get(randomKey).address}?network=${$sharedClientConfig().selected}`]);
	delegated("click", button, refreshList);
	delegated("click", button_1, () => set(showPublish, !get(showPublish)));
	delegated("click", button_15, rotateKey);
	delegated("click", button_16, requestFromFaucet);
	bind_value(input_7, () => $onChainAppsConfig().packageId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).packageId = $$value, untrack($onChainAppsConfig)));
	bind_value(input_8, () => $onChainAppsConfig().registryId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).registryId = $$value, untrack($onChainAppsConfig)));
	bind_value(input_9, () => $onChainAppsConfig().storageId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).storageId = $$value, untrack($onChainAppsConfig)));
	append($$anchor, main);
	pop();
	$$cleanup();
}
delegate(["click", "change"]);
//#endregion
export { DEFAULT_HTML, OnChainApps as default, formatDate, formatSize };

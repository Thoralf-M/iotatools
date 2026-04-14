import { J as fromBase64, aD as Transaction, bh as IOTA_CLOCK_OBJECT_ID, K as iotaBcs, ad as writable, be as Ed25519Keypair, bo as keypairFromBech32PrivateKey, p as push, o as state, Q as proxy, C as onMount, b0 as sharedClientConfig, B as getClient, g as get, s as set, u as user_effect, _ as onDestroy, b as sibling, h as child, i as if_block, t as template_effect, G as getSelectedNetworkConfig, c as set_text, V as set_attribute, k as delegated, H as bind_value, d as append, l as pop, E as store_get, F as setup_stores, z as set_class, W as first_child, q as from_html, L as toBase64, a8 as set_style, e as each, bs as store_mutate, a2 as untrack, r as delegate } from "./index-BWVyRlg_.js";
import { b as bind_this } from "./this-DMBNcc5p.js";
import { a as requestIotaFromFaucetV0 } from "./faucet-JrOhy6oz.js";
import { u as usePageQueryParams, a as updatePageQueryParams, g as getCurrentPageQueryParams } from "./page-query-params-B6gOnDUO.js";
function createIframeBridge(iframe, handler, onReady, onResize) {
  async function handleMessage(event) {
    if (event.source !== iframe.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    if (data.kind === "ready") {
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
      const resp = { kind: "res", id: req.id, result };
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
const BOOTSTRAP_JS = String.raw`
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
const DEFAULT_CHUNK_SIZE = 96 * 1024;
function splitChunks(bytes, chunkSize = DEFAULT_CHUNK_SIZE) {
  if (chunkSize <= 0) throw new Error("chunkSize must be > 0");
  const chunks = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(bytes.slice(i, i + chunkSize));
  }
  if (chunks.length === 0) chunks.push(new Uint8Array());
  return chunks;
}
function fieldsOf(obj) {
  const content = obj.data?.content;
  if (!content || content.dataType !== "moveObject") {
    throw new Error(`Object ${obj.data?.objectId ?? "?"} is not a move object`);
  }
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
async function listAppIds(client, registryId) {
  const ids = [];
  let cursor = null;
  do {
    const page = await client.getDynamicFields({
      parentId: registryId,
      cursor: cursor ?? null
    });
    const indexEntries = page.data.filter(
      (f) => /::registry::IndexKey$/.test(String(f.name?.type ?? ""))
    );
    if (indexEntries.length > 0) {
      const wrappers = await client.multiGetObjects({
        ids: indexEntries.map((f) => f.objectId),
        options: { showContent: true }
      });
      const parsed = wrappers.map((w) => {
        const f = fieldsOf(w);
        const idx = asNumber(f?.name?.fields?.index ?? f?.name?.index ?? 0);
        const appId = typeof f?.value === "string" ? f.value : String(f?.value ?? "");
        return { idx, appId };
      }).filter((x) => !!x.appId);
      parsed.sort((a, b) => a.idx - b.idx);
      for (const p of parsed) ids.push(p.appId);
    }
    cursor = page.hasNextPage ? page.nextCursor ?? null : null;
  } while (cursor);
  return ids;
}
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
        results.push(parseApp(r));
      } catch (err) {
        console.warn("failed to parse app", r, err);
      }
    }
  }
  return results;
}
async function fetchAppMetadata(client, appId) {
  const resp = await client.getObject({ id: appId, options: { showContent: true } });
  if (!resp.data) throw new Error(`App ${appId} not found`);
  return parseApp(resp);
}
async function fetchOwnedAppCaps(client, packageId, owner) {
  if (!packageId || !owner || owner === "0x") return [];
  const caps = [];
  let cursor = null;
  do {
    const page = await client.getOwnedObjects({
      owner,
      filter: { StructType: `${packageId}::app::AppCap` },
      options: { showContent: true, showType: true },
      cursor: cursor ?? null
    });
    for (const item of page.data) {
      if (!item.data) continue;
      try {
        const fields = fieldsOf(item);
        const appId = String(fields.app_id ?? "");
        if (!appId) continue;
        caps.push({ capId: item.data.objectId, appId });
      } catch (err) {
        console.warn("failed to parse AppCap", item, err);
      }
    }
    cursor = page.hasNextPage ? page.nextCursor ?? null : null;
  } while (cursor);
  if (caps.length === 0) return [];
  const appMetas = await fetchAppMetadatas(
    client,
    caps.map((c) => c.appId)
  );
  const byId = new Map(appMetas.map((m) => [m.id, m]));
  return caps.map((c) => ({
    capId: c.capId,
    appId: c.appId,
    app: byId.get(c.appId) ?? null
  }));
}
function toUint8(value) {
  if (value == null) return new Uint8Array();
  if (value instanceof Uint8Array) return value;
  if (Array.isArray(value)) return new Uint8Array(value);
  if (typeof value === "string") {
    try {
      return fromBase64(value);
    } catch {
      return new TextEncoder().encode(value);
    }
  }
  throw new Error("unknown bytes encoding");
}
async function fetchAppContent(client, app) {
  if (app.chunkCount === 0) return new Uint8Array();
  const buffers = new Array(app.chunkCount);
  const entries = [];
  let cursor = null;
  do {
    const page = await client.getDynamicFields({ parentId: app.id, cursor: cursor ?? null });
    for (const f of page.data) {
      if (!/::app::ChunkKey$/.test(String(f.name?.type ?? ""))) continue;
      const idxStr = f.name?.value?.index ?? f.name?.value;
      const idx = asNumber(idxStr);
      entries.push({ index: idx, objectId: f.objectId });
    }
    cursor = page.hasNextPage ? page.nextCursor ?? null : null;
  } while (cursor);
  if (entries.length !== app.chunkCount) {
    console.warn(
      `app ${app.id} advertises ${app.chunkCount} chunks but registry lists ${entries.length}`
    );
  }
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
  tx.transferObjects([cap], tx.moveCall({ target: `0x2::tx_context::sender`, arguments: [] }));
  return tx;
}
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
const DEFAULT_CONFIG = {
  packageId: "0x76f9af5d12803e11caa60a6f7adaca9b59c3674eba1fda3e8af22c97381052f5",
  registryId: "0x6d998e1a16bb43e270a52e048a87c90b7386073e45fbcc6ae190ce674b2b2415",
  storageId: "0xa3bf3f0a63f0389c8d01778e5e65847b1770cd4e5abab201c76890d45e01b37d"
};
const CONFIG_KEY = "onchainAppsConfig";
const RANDOM_KEY_KEY = "onchainAppsRandomKey";
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
const onChainAppsConfig = writable(loadConfig());
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
function generateAndStoreRandomKey() {
  const keypair = Ed25519Keypair.generate();
  const bech32 = keypair.getSecretKey();
  saveRandomKey(bech32);
  return { bech32PrivateKey: bech32, address: keypair.toIotaAddress() };
}
function getStoredRandomKey() {
  const bech32 = loadRandomKey();
  if (!bech32) return null;
  try {
    const keypair = keypairFromBech32PrivateKey(bech32);
    return { bech32PrivateKey: bech32, address: keypair.toIotaAddress() };
  } catch {
    return null;
  }
}
function ensureRandomKey() {
  return getStoredRandomKey() ?? generateAndStoreRandomKey();
}
function keypairFor(bech32PrivateKey) {
  const kp = keypairFromBech32PrivateKey(bech32PrivateKey);
  if (!(kp instanceof Ed25519Keypair)) {
    throw new Error("Random key must be Ed25519");
  }
  return kp;
}
const END = "<\/script>";
const DEFAULT_HTML = `<!-- Minimal example app. -->
<!-- This code runs inside a sandboxed iframe, with access to the iota bridge. -->
<h3 id="title">Hello On-Chain Apps</h3>
<p>Your address: <code id="addr">?</code></p>
<input id="name" placeholder="your name" />
<button id="save">Save name on chain</button>
<pre id="log"></pre>

<script>
(async () => {
    const log = (m) => { document.getElementById('log').textContent += m + String.fromCharCode(10); };
    const addr = await iota.getAddress();
    document.getElementById('addr').textContent = addr;
    try {
        const saved = await iota.storage.getShared('player:' + addr);
        if (saved) document.getElementById('name').value = saved;
    } catch (e) { log('no previous name: ' + e.message); }

    document.getElementById('save').onclick = async () => {
        const name = document.getElementById('name').value;
        if (!name) return;
        try {
            await iota.storage.setShared('player:' + addr, name);
            log('saved "' + name + '"');
        } catch (e) { log('error: ' + e.message); }
    };
})();
` + END + `
`;
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
var root_1 = from_html(`<div class="key-row svelte-1r06gu"><strong>Balance:</strong> </div>`);
var root_2 = from_html(`<div> </div>`);
var root_4 = from_html(`<a> </a>`);
var root_3 = from_html(`<section class="panel publish-panel svelte-1r06gu"><h3 class="svelte-1r06gu">Publish an app</h3> <label class="svelte-1r06gu">Name <input placeholder="my cover game" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Description <textarea rows="2" placeholder="Short description shown in the list" class="svelte-1r06gu"></textarea></label> <label class="svelte-1r06gu">Content type <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Load HTML from file (optional) <input type="file" accept=".html,.htm,text/html" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">HTML payload <textarea rows="12" spellcheck="false" class="svelte-1r06gu"></textarea></label> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu"> </button> <!></div></section>`);
var root_6 = from_html(`<p>Loading app bytes...</p>`);
var root_8 = from_html(`<button class="maximize-exit-btn svelte-1r06gu" title="Exit fullscreen (Esc)">✕</button>`);
var root_7 = from_html(`<!> <iframe sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>`, 1);
var root_5 = from_html(`<section class="panel viewer svelte-1r06gu"><div class="viewer-header svelte-1r06gu"><div><h3 class="svelte-1r06gu"> </h3> <p class="muted svelte-1r06gu"> </p> <p class="app-meta svelte-1r06gu"><span> </span> <span> </span> <span> </span> <span> </span> <span> </span> <span>by <code class="address-code svelte-1r06gu"> </code></span></p></div> <div class="viewer-actions svelte-1r06gu"><button class="svelte-1r06gu">Copy share link</button> <button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu">← Back to list</button></div></div> <!></section>`);
var root_9 = from_html(`<section class="panel update-panel svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <p class="muted svelte-1r06gu"> <code> </code>) stays the same, so existing share links keep working.</p> <label class="svelte-1r06gu">Name <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Description <textarea rows="2" class="svelte-1r06gu"></textarea></label> <label class="svelte-1r06gu">Content type <input class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Replace HTML from file (optional) <input type="file" accept=".html,.htm,text/html" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">HTML payload <textarea rows="12" spellcheck="false" class="svelte-1r06gu"></textarea></label> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu">Cancel</button></div></section>`);
var root_11 = from_html(`<div class="error-block svelte-1r06gu"> </div>`);
var root_12 = from_html(`<p class="muted svelte-1r06gu">No apps published from this address yet. After publishing, the upgrade
                    capabilities will appear here.</p>`);
var root_15 = from_html(`<div class="app-name svelte-1r06gu"> </div> <div class="app-desc svelte-1r06gu"> </div> <div class="app-meta svelte-1r06gu"><span> </span> <span> </span> <span> </span> <span> </span></div>`, 1);
var root_16 = from_html(
  `<div class="app-name svelte-1r06gu">— stale cap —</div> <div class="app-desc muted svelte-1r06gu">App object not found (deleted?). Cap id preserved for
                                        reference.</div>`,
  1
);
var root_14 = from_html(`<li><div class="app-card svelte-1r06gu"><!> <div class="app-id svelte-1r06gu"> </div> <div class="app-id svelte-1r06gu"> </div> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu">Open</button> <button class="svelte-1r06gu">Update</button></div></div></li>`);
var root_13 = from_html(`<ul class="apps svelte-1r06gu"></ul>`);
var root_17 = from_html(`<div class="error-block svelte-1r06gu"> </div>`);
var root_18 = from_html(`<p>Loading...</p>`);
var root_19 = from_html(`<p class="muted svelte-1r06gu">Nothing published yet. Use <em>+ Publish new app</em> above to upload your first app.</p>`);
var root_21 = from_html(`<li><button class="app-card svelte-1r06gu"><div class="app-name svelte-1r06gu"> </div> <div class="app-desc svelte-1r06gu"> </div> <div class="app-meta svelte-1r06gu"><span> </span> <span> </span> <span> </span></div> <div class="app-id svelte-1r06gu"> </div></button></li>`);
var root_20 = from_html(`<ul class="apps svelte-1r06gu"></ul>`);
var root_10 = from_html(
  `<section class="panel my-apps-panel svelte-1r06gu"><div class="my-apps-header svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <button class="svelte-1r06gu"> </button></div> <p class="muted svelte-1r06gu">Every <code>AppCap</code> owned by your random signer address. Selecting one lets
                you publish a new <em>app_version</em> - viewers load the app via its shared object id,
                so they get the updated payload automatically on their next visit.</p> <!> <!></section> <section class="panel svelte-1r06gu"><h3 class="svelte-1r06gu"> </h3> <!> <!></section>`,
  1
);
var root = from_html(`<main class="svelte-1r06gu"><header class="top svelte-1r06gu"><div><h2>On-Chain Apps</h2> <p class="subtitle svelte-1r06gu">Web apps published directly to the IOTA devnet and loaded from dynamic fields.</p></div> <div class="top-actions svelte-1r06gu"><button class="svelte-1r06gu"> </button> <button class="svelte-1r06gu"> </button></div></header> <section class="panel key-panel svelte-1r06gu"><h3 class="svelte-1r06gu">Sandbox signer</h3> <p class="muted svelte-1r06gu">A random Ed25519 key is used for every tx this page signs. It is kept in your browser's <code>localStorage</code>. Devnet only.</p> <div class="key-info svelte-1r06gu"><div class="key-row svelte-1r06gu"><strong>Network:</strong> </div> <div class="key-row svelte-1r06gu"><strong>Address:</strong> <code class="address-code svelte-1r06gu"> </code></div> <!></div> <div class="kv svelte-1r06gu"><button class="svelte-1r06gu">Generate new random key</button> <button class="svelte-1r06gu">Request devnet IOTA from faucet</button> <a target="_blank" rel="noopener noreferrer">View in explorer ↗</a></div></section> <details class="panel config-panel svelte-1r06gu"><summary class="svelte-1r06gu">Package configuration</summary> <p class="muted svelte-1r06gu">Override the Move package / object ids if you deployed your own instance. Otherwise the
            defaults point at the canonical devnet deployment.</p> <label class="svelte-1r06gu">Package ID <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Registry object ID (shared) <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label> <label class="svelte-1r06gu">Generic storage object ID (shared) <input placeholder="0x..." spellcheck="false" class="svelte-1r06gu"/></label></details> <!> <!> <!></main>`);
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
  const proxyChannels = /* @__PURE__ */ new Map();
  let webrtcIdSeq = 0;
  const DEFAULT_ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ];
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
      setTimeout(
        () => {
          pc.removeEventListener("icegatheringstatechange", check);
          rtcLog("ICE gathering safety-net timeout (8s), state:", pc.iceGatheringState, "candidates:", candidates.length);
          candidates.forEach((c) => rtcLog("  candidate:", c));
          resolve(pc.localDescription);
        },
        8e3
      );
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
      setTimeout(
        () => {
          dc.removeEventListener("open", onOpen);
          dc.removeEventListener("error", onError);
          rtcLog("DataChannel open timeout (30s), state:", dc.readyState);
          reject(new Error("DataChannel open timeout after 30s, state=" + dc.readyState));
        },
        3e4
      );
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
      setTimeout(
        () => {
          if (!resolved && rejectFn) {
            rtcLog("DataChannel receive timeout (" + ms + "ms) — ICE state:", pc.iceConnectionState, "connection:", pc.connectionState);
            rejectFn(new Error("DataChannel receive timeout (" + ms / 1e3 + "s after signaling)"));
          }
        },
        ms
      );
    }
    return { promise, startTimeout };
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
    if (status !== "success") {
      throw new Error("Storage write failed: " + JSON.stringify(result.effects?.status));
    }
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
  function registerProxy(channelId, proxy2) {
    proxyChannels.set(channelId, proxy2);
  }
  function pushToIframe(channelId, data) {
    get(iframeEl)?.contentWindow?.postMessage({ kind: "webrtcData", channelId, data }, "*");
  }
  function pushCloseToIframe(channelId) {
    get(iframeEl)?.contentWindow?.postMessage({ kind: "webrtcClose", channelId }, "*");
    proxyChannels.delete(channelId);
  }
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
        } catch {
        }
        try {
          pc.close();
        } catch {
        }
      }
    });
  }
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
      send: (data) => bc.postMessage({ t: "d", p: data }),
      close: () => {
        bc.postMessage({ t: "x" });
        bc.close();
      }
    });
  }
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
    return { promise, cancel };
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
      const retryInterval = setInterval(
        () => {
          if (!done) bc.postMessage({ t: "ping" });
        },
        500
      );
      setTimeout(
        () => {
          clearInterval(retryInterval);
          if (!done) {
            done = true;
            bc.close();
            resolve(null);
          }
        },
        timeoutMs
      );
    });
  }
  function cleanupWebRTC() {
    for (const [, proxy2] of proxyChannels) {
      try {
        proxy2.close();
      } catch {
      }
    }
    proxyChannels.clear();
  }
  onMount(() => {
    if ($sharedClientConfig().selected !== "devnet") {
      sharedClientConfig.update((cfg) => ({ ...cfg, selected: "devnet" }));
    }
    refreshList();
    refreshMyApps();
    (async () => {
      try {
        const client = getClient();
        const bal = await client.getBalance({ owner: get(randomKey).address });
        if (BigInt(bal.totalBalance) === 0n) {
          setStatus("New signer detected — requesting devnet funds...");
          await requestFromFaucet();
        }
        await refreshBalance();
      } catch {
      }
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
    if (wanted && (!get(selectedApp) || get(selectedApp).id !== wanted)) {
      void openApp(wanted);
    } else if (!wanted && get(selectedApp)) {
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
    if (owned.app) {
      try {
        const client = getClient();
        const bytes = await fetchAppContent(client, owned.app);
        set(updateHtml, new TextDecoder().decode(bytes), true);
      } catch (err) {
        setStatus(`Could not load existing payload: ${err?.message ?? err}`, true);
      }
    }
  }
  function cancelUpdate() {
    set(updateTarget, null);
    set(updateHtml, "");
  }
  async function onUpdateFileSelected(event) {
    const input = event.target;
    const file = input.files?.[0];
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
      const bytes = new TextEncoder().encode(get(updateHtml));
      const chunks = splitChunks(bytes, DEFAULT_CHUNK_SIZE);
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
        options: { showEffects: true, showEvents: true }
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
      const ids = await listAppIds(client, $onChainAppsConfig().registryId);
      const metas = await fetchAppMetadatas(client, ids);
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
      for (const [key, val] of hashParams.entries()) {
        if (key !== "appId" && val) {
          writeAppLocal(app.id, "_param_" + key, val);
        }
      }
      const bytes = await fetchAppContent(client, app);
      set(selectedAppContent, bytes, true);
      const html = new TextDecoder().decode(bytes);
      set(iframeSrcDoc, wrapAppHtml(html), true);
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
    const CLOSE_SCRIPT = "<\/script>";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><script>` + BOOTSTRAP_JS + CLOSE_SCRIPT + `</head><body>` + userHtml + `</body></html>`;
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
    if (method.startsWith("webrtc")) {
      console.log("[Bridge] request:", method, args);
    }
    const client = getClient();
    const appId = get(selectedApp)?.id ?? "";
    switch (method) {
      case "getAddress":
        return get(randomKey).address;
      case "getNetwork":
        return $sharedClientConfig().selected;
      case "getAppId":
        return appId;
      case "getParam": {
        const key = args?.key;
        if (!key) return null;
        const params = getCurrentPageQueryParams();
        return params[key] ?? null;
      }
      case "rpc": {
        const { method: rpcMethod, args: rpcArgs = [] } = args ?? {};
        const fn = client[rpcMethod];
        if (typeof fn !== "function") {
          throw new Error(`Unknown client RPC method: ${rpcMethod}`);
        }
        return await fn.apply(client, rpcArgs);
      }
      case "signAndExecute": {
        const txJson = args?.txJson;
        if (!txJson) throw new Error("missing txJson");
        const tx = typeof txJson === "string" ? Transaction.from(txJson) : Transaction.from(JSON.stringify(txJson));
        return await client.signAndExecuteTransaction({
          transaction: tx,
          signer: keypairFor(get(randomKey).bech32PrivateKey),
          options: { showEffects: true, showObjectChanges: true, showEvents: true }
        });
      }
      case "storageSet":
      case "storageSetShared": {
        const { key, value } = args ?? {};
        if (!$onChainAppsConfig().packageId || !$onChainAppsConfig().storageId) {
          throw new Error("on-chain storage is not configured");
        }
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
          options: { showEffects: true, showEvents: true }
        });
      }
      case "storageGet":
      case "storageGetShared": {
        const { key, opts = {} } = args ?? {};
        if (!$onChainAppsConfig().storageId) {
          throw new Error("on-chain storage is not configured");
        }
        if (!appId) throw new Error("no active app");
        const user = opts.user ?? get(randomKey).address;
        const bytes = await readStorageValue(client, appId, user, key, method === "storageGetShared");
        if (!bytes) return null;
        return opts.encoding === "base64" ? toBase64(bytes) : new TextDecoder().decode(bytes);
      }
      case "storageRemove": {
        const { key } = args ?? {};
        if (!$onChainAppsConfig().packageId || !$onChainAppsConfig().storageId) {
          throw new Error("on-chain storage is not configured");
        }
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
      case "localGet":
        return readAppLocal(appId, args?.key);
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
        const earlyBc = await Promise.race([
          bcHandle.promise,
          new Promise((r) => setTimeout(() => r(null), 0))
        ]);
        if (earlyBc) {
          pc.close();
          return { channelId: earlyBc, roomId };
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
        return { channelId: winnerId, roomId };
      }
      case "webrtcJoin": {
        if (!args?.roomId) throw new Error("roomId is required");
        const jRoomId = args.roomId;
        const jPrefix = "webrtc:" + jRoomId;
        const jIce = args?.iceServers || DEFAULT_ICE_SERVERS;
        const jTimeout = args?.timeout || 12e4;
        rtcLog("JOIN: joining room", jRoomId);
        const bcChId = await bcJoin(jRoomId, 2e3);
        if (bcChId) {
          return { channelId: bcChId, roomId: jRoomId };
        }
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
        return { channelId: joinChId, roomId: jRoomId };
      }
      case "webrtcSend": {
        const proxy2 = proxyChannels.get(args?.channelId);
        if (!proxy2) throw new Error("Unknown channel: " + args?.channelId);
        proxy2.send(args.data);
        return true;
      }
      case "webrtcClose": {
        rtcLog("closing channel", args?.channelId);
        const proxy2 = proxyChannels.get(args?.channelId);
        if (proxy2) {
          try {
            proxy2.close();
          } catch {
          }
          proxyChannels.delete(args.channelId);
        }
        return true;
      }
      default:
        throw new Error(`Unsupported bridge method: ${method}`);
    }
  }
  function coerceToBytes(value) {
    if (value instanceof Uint8Array) return value;
    if (typeof value === "string") return new TextEncoder().encode(value);
    if (value && typeof value === "object" && "base64" in value) {
      return fromBase64(value.base64);
    }
    return new TextEncoder().encode(JSON.stringify(value));
  }
  async function readStorageValue(client, appId, user, key, shared) {
    if (!$onChainAppsConfig().packageId) return null;
    const pkg = $onChainAppsConfig().packageId;
    const storageId = $onChainAppsConfig().storageId;
    const keyType = shared ? `${pkg}::generic_storage::SharedKey` : `${pkg}::generic_storage::UserKey`;
    const keyValue = shared ? { app_id: appId, key } : { app_id: appId, user, key };
    try {
      const resp = await client.getDynamicFieldObject({
        parentObjectId: storageId,
        name: { type: keyType, value: keyValue },
        options: { showContent: true }
      });
      if (!resp.data) return null;
      const fields = resp.data.content?.fields;
      const raw = fields?.value;
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
      const client = getClient();
      const bal = await client.getBalance({ owner: get(randomKey).address });
      const nano = BigInt(bal.totalBalance);
      if (nano === 0n) {
        set(signerBalance, "0 IOTA");
      } else if (nano < 1000000000n) {
        set(signerBalance, `${(Number(nano) / 1e9).toFixed(4)} IOTA`);
      } else {
        set(signerBalance, `${(Number(nano) / 1e9).toFixed(2)} IOTA`);
      }
    } catch {
      set(signerBalance, "");
    }
  }
  function rotateKey() {
    const ok = confirm("Generating a new random key will drop the current one (along with whatever devnet IOTA it holds). Continue?");
    if (!ok) return;
    set(randomKey, generateAndStoreRandomKey(), true);
    set(signerBalance, "");
    void refreshMyApps();
    void refreshBalance();
  }
  async function requestFromFaucet() {
    const faucetUrl = $sharedClientConfig().networks.find((n) => n.name === $sharedClientConfig().selected)?.faucet;
    if (!faucetUrl) {
      setStatus("Selected network has no faucet configured.", true);
      return;
    }
    try {
      await requestIotaFromFaucetV0({ host: faucetUrl, recipient: get(randomKey).address });
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
    } else {
      url.searchParams.set("appId", get(selectedApp).id);
    }
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
      const bytes = new TextEncoder().encode(get(publishHtml));
      const chunks = splitChunks(bytes, DEFAULT_CHUNK_SIZE);
      const firstBatch = chunks.slice(0, 1);
      const publishTx = buildPublishTx({
        packageId: $onChainAppsConfig().packageId,
        registryId: $onChainAppsConfig().registryId,
        name: get(publishName),
        description: get(publishDescription),
        contentType: get(publishContentType),
        firstChunks: firstBatch
      });
      const result = await client.signAndExecuteTransaction({
        transaction: publishTx,
        signer,
        options: { showEffects: true, showObjectChanges: true, showEvents: true }
      });
      const objectChanges = result.objectChanges ?? [];
      const newApp = objectChanges.find((c) => c.type === "created" && typeof c.objectType === "string" && c.objectType.endsWith("::app::App"));
      const newCap = objectChanges.find((c) => c.type === "created" && typeof c.objectType === "string" && c.objectType.endsWith("::app::AppCap"));
      if (!newApp || !newCap) {
        throw new Error(`Could not find created App/AppCap in object changes: ${JSON.stringify(objectChanges)}`);
      }
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
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    set(publishHtml, await file.text(), true);
    if (!get(publishName)) set(publishName, file.name, true);
    if (!get(publishContentType) && file.type) set(publishContentType, file.type, true);
  }
  var main = root();
  var header = child(main);
  var div = sibling(child(header), 2);
  var button = child(div);
  var text = child(button);
  var button_1 = sibling(button, 2);
  var text_1 = child(button_1);
  var section = sibling(header, 2);
  var div_1 = sibling(child(section), 4);
  var div_2 = child(div_1);
  var text_2 = sibling(child(div_2));
  var div_3 = sibling(div_2, 2);
  var code = sibling(child(div_3), 2);
  var text_3 = child(code);
  var node = sibling(div_3, 2);
  {
    var consequent = ($$anchor2) => {
      var div_4 = root_1();
      var text_4 = sibling(child(div_4));
      template_effect(() => set_text(text_4, ` ${get(signerBalance) ?? ""}`));
      append($$anchor2, div_4);
    };
    if_block(node, ($$render) => {
      if (get(signerBalance)) $$render(consequent);
    });
  }
  var div_5 = sibling(div_1, 2);
  var button_2 = child(div_5);
  var button_3 = sibling(button_2, 2);
  var a_1 = sibling(button_3, 2);
  var details = sibling(section, 2);
  var label = sibling(child(details), 4);
  var input_1 = sibling(child(label));
  var label_1 = sibling(label, 2);
  var input_2 = sibling(child(label_1));
  var label_2 = sibling(label_1, 2);
  var input_3 = sibling(child(label_2));
  var node_1 = sibling(details, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_6 = root_2();
      let classes;
      var text_5 = child(div_6);
      template_effect(() => {
        classes = set_class(div_6, 1, "status svelte-1r06gu", null, classes, { error: get(statusIsError) });
        set_text(text_5, get(statusMessage));
      });
      append($$anchor2, div_6);
    };
    if_block(node_1, ($$render) => {
      if (get(statusMessage)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var section_1 = root_3();
      var label_3 = sibling(child(section_1), 2);
      var input_4 = sibling(child(label_3));
      var label_4 = sibling(label_3, 2);
      var textarea = sibling(child(label_4));
      var label_5 = sibling(label_4, 2);
      var input_5 = sibling(child(label_5));
      var label_6 = sibling(label_5, 2);
      var input_6 = sibling(child(label_6));
      var label_7 = sibling(label_6, 2);
      var textarea_1 = sibling(child(label_7));
      var div_7 = sibling(label_7, 2);
      var button_4 = child(div_7);
      var text_6 = child(button_4);
      var node_3 = sibling(button_4, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var a_2 = root_4();
          var text_7 = child(a_2);
          template_effect(() => {
            set_attribute(a_2, "href", get(publishResultUrl));
            set_text(text_7, get(publishResultUrl));
          });
          append($$anchor3, a_2);
        };
        if_block(node_3, ($$render) => {
          if (get(publishResultUrl)) $$render(consequent_2);
        });
      }
      template_effect(() => {
        button_4.disabled = get(publishing);
        set_text(text_6, get(publishing) ? "Publishing..." : "Publish to devnet");
      });
      bind_value(input_4, () => get(publishName), ($$value) => set(publishName, $$value));
      bind_value(textarea, () => get(publishDescription), ($$value) => set(publishDescription, $$value));
      bind_value(input_5, () => get(publishContentType), ($$value) => set(publishContentType, $$value));
      delegated("change", input_6, onFileSelected);
      bind_value(textarea_1, () => get(publishHtml), ($$value) => set(publishHtml, $$value));
      delegated("click", button_4, publishApp);
      append($$anchor2, section_1);
    };
    if_block(node_2, ($$render) => {
      if (get(showPublish)) $$render(consequent_3);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var section_2 = root_5();
      var div_8 = child(section_2);
      var div_9 = child(div_8);
      var h3 = child(div_9);
      var text_8 = child(h3);
      var p = sibling(h3, 2);
      var text_9 = child(p);
      var p_1 = sibling(p, 2);
      var span = child(p_1);
      var text_10 = child(span);
      var span_1 = sibling(span, 2);
      var text_11 = child(span_1);
      var span_2 = sibling(span_1, 2);
      var text_12 = child(span_2);
      var span_3 = sibling(span_2, 2);
      var text_13 = child(span_3);
      var span_4 = sibling(span_3, 2);
      var text_14 = child(span_4);
      var span_5 = sibling(span_4, 2);
      var code_1 = sibling(child(span_5));
      var text_15 = child(code_1);
      var div_10 = sibling(div_9, 2);
      var button_5 = child(div_10);
      var button_6 = sibling(button_5, 2);
      var text_16 = child(button_6);
      var button_7 = sibling(button_6, 2);
      var node_5 = sibling(div_8, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var p_2 = root_6();
          append($$anchor3, p_2);
        };
        var consequent_6 = ($$anchor3) => {
          var fragment = root_7();
          var node_6 = first_child(fragment);
          {
            var consequent_5 = ($$anchor4) => {
              var button_8 = root_8();
              delegated("click", button_8, () => set(appMaximized, false));
              append($$anchor4, button_8);
            };
            if_block(node_6, ($$render) => {
              if (get(appMaximized)) $$render(consequent_5);
            });
          }
          var iframe = sibling(node_6, 2);
          let classes_1;
          bind_this(iframe, ($$value) => set(iframeEl, $$value), () => get(iframeEl));
          template_effect(() => {
            set_attribute(iframe, "title", get(selectedApp).name);
            set_attribute(iframe, "srcdoc", get(iframeSrcDoc));
            set_style(iframe, `height: ${get(appMaximized) ? "100%" : get(iframeHeight) + "px"}`);
            classes_1 = set_class(iframe, 1, "svelte-1r06gu", null, classes_1, { "iframe-maximized": get(appMaximized) });
          });
          append($$anchor3, fragment);
        };
        if_block(node_5, ($$render) => {
          if (get(loadingApp)) $$render(consequent_4);
          else if (get(iframeSrcDoc)) $$render(consequent_6, 1);
        });
      }
      template_effect(
        ($0, $1, $2) => {
          set_text(text_8, get(selectedApp).name);
          set_text(text_9, get(selectedApp).description || "");
          set_text(text_10, `v${get(selectedApp).appVersion ?? ""}`);
          set_text(text_11, `pkg v${get(selectedApp).packageVersion ?? ""}`);
          set_text(text_12, `${get(selectedApp).chunkCount ?? ""} chunks (${$0 ?? ""})`);
          set_text(text_13, `published ${$1 ?? ""}`);
          set_text(text_14, `last update ${$2 ?? ""}`);
          set_text(text_15, get(selectedApp).publisher);
          set_text(text_16, get(appMaximized) ? "↙ Minimize" : "↗ Maximize");
        },
        [
          () => formatSize(get(selectedApp).totalSize),
          () => formatDate(get(selectedApp).publishedAtMs),
          () => formatDate(get(selectedApp).updatedAtMs)
        ]
      );
      delegated("click", button_5, copyShareLink);
      delegated("click", button_6, () => {
        set(appMaximized, !get(appMaximized));
        if (get(appMaximized)) {
          window.scrollTo(0, 0);
          document.body.classList.add("app-maximized");
        } else {
          document.body.classList.remove("app-maximized");
        }
      });
      delegated("click", button_7, closeApp);
      append($$anchor2, section_2);
    };
    var consequent_8 = ($$anchor2) => {
      var section_3 = root_9();
      var h3_1 = child(section_3);
      var text_17 = child(h3_1);
      var p_3 = sibling(h3_1, 2);
      var text_18 = child(p_3);
      var code_2 = sibling(text_18);
      var text_19 = child(code_2);
      var label_8 = sibling(p_3, 2);
      var input_7 = sibling(child(label_8));
      var label_9 = sibling(label_8, 2);
      var textarea_2 = sibling(child(label_9));
      var label_10 = sibling(label_9, 2);
      var input_8 = sibling(child(label_10));
      var label_11 = sibling(label_10, 2);
      var input_9 = sibling(child(label_11));
      var label_12 = sibling(label_11, 2);
      var textarea_3 = sibling(child(label_12));
      var div_11 = sibling(label_12, 2);
      var button_9 = child(div_11);
      var text_20 = child(button_9);
      var button_10 = sibling(button_9, 2);
      template_effect(() => {
        set_text(text_17, `Update ${get(updateTarget).app.name ?? ""}`);
        set_text(text_18, `Current on-chain version: v${get(updateTarget).app.appVersion ?? ""}. Publishing will bump it to
                v${get(updateTarget).app.appVersion + 1}. The shared object id (`);
        set_text(text_19, get(updateTarget).app.id);
        button_9.disabled = get(updating);
        set_text(text_20, get(updating) ? "Updating..." : "Publish new version");
        button_10.disabled = get(updating);
      });
      bind_value(input_7, () => get(updateName), ($$value) => set(updateName, $$value));
      bind_value(textarea_2, () => get(updateDescription), ($$value) => set(updateDescription, $$value));
      bind_value(input_8, () => get(updateContentType), ($$value) => set(updateContentType, $$value));
      delegated("change", input_9, onUpdateFileSelected);
      bind_value(textarea_3, () => get(updateHtml), ($$value) => set(updateHtml, $$value));
      delegated("click", button_9, submitUpdate);
      delegated("click", button_10, cancelUpdate);
      append($$anchor2, section_3);
    };
    var alternate_3 = ($$anchor2) => {
      var fragment_1 = root_10();
      var section_4 = first_child(fragment_1);
      var div_12 = child(section_4);
      var h3_2 = child(div_12);
      var text_21 = child(h3_2);
      var button_11 = sibling(h3_2, 2);
      var text_22 = child(button_11);
      var node_7 = sibling(div_12, 4);
      {
        var consequent_9 = ($$anchor3) => {
          var div_13 = root_11();
          var text_23 = child(div_13);
          template_effect(() => set_text(text_23, get(myAppsError)));
          append($$anchor3, div_13);
        };
        if_block(node_7, ($$render) => {
          if (get(myAppsError)) $$render(consequent_9);
        });
      }
      var node_8 = sibling(node_7, 2);
      {
        var consequent_10 = ($$anchor3) => {
          var p_4 = root_12();
          append($$anchor3, p_4);
        };
        var alternate_1 = ($$anchor3) => {
          var ul = root_13();
          each(ul, 21, () => get(myApps), (owned) => owned.capId, ($$anchor4, owned) => {
            var li = root_14();
            var div_14 = child(li);
            var node_9 = child(div_14);
            {
              var consequent_11 = ($$anchor5) => {
                var fragment_2 = root_15();
                var div_15 = first_child(fragment_2);
                var text_24 = child(div_15);
                var div_16 = sibling(div_15, 2);
                var text_25 = child(div_16);
                var div_17 = sibling(div_16, 2);
                var span_6 = child(div_17);
                var text_26 = child(span_6);
                var span_7 = sibling(span_6, 2);
                var text_27 = child(span_7);
                var span_8 = sibling(span_7, 2);
                var text_28 = child(span_8);
                var span_9 = sibling(span_8, 2);
                var text_29 = child(span_9);
                template_effect(
                  ($0, $1) => {
                    set_text(text_24, get(owned).app.name);
                    set_text(text_25, get(owned).app.description || "—");
                    set_text(text_26, `v${get(owned).app.appVersion ?? ""}`);
                    set_text(text_27, `pkg v${get(owned).app.packageVersion ?? ""}`);
                    set_text(text_28, `${get(owned).app.chunkCount ?? ""} chunks · ${$0 ?? ""}`);
                    set_text(text_29, `updated ${$1 ?? ""}`);
                  },
                  [
                    () => formatSize(get(owned).app.totalSize),
                    () => formatDate(get(owned).app.updatedAtMs)
                  ]
                );
                append($$anchor5, fragment_2);
              };
              var alternate = ($$anchor5) => {
                var fragment_3 = root_16();
                append($$anchor5, fragment_3);
              };
              if_block(node_9, ($$render) => {
                if (get(owned).app) $$render(consequent_11);
                else $$render(alternate, -1);
              });
            }
            var div_18 = sibling(node_9, 2);
            var text_30 = child(div_18);
            var div_19 = sibling(div_18, 2);
            var text_31 = child(div_19);
            var div_20 = sibling(div_19, 2);
            var button_12 = child(div_20);
            var button_13 = sibling(button_12, 2);
            template_effect(() => {
              set_text(text_30, `app ${get(owned).appId ?? ""}`);
              set_text(text_31, `cap ${get(owned).capId ?? ""}`);
              button_12.disabled = !get(owned).app;
              button_13.disabled = !get(owned).app;
            });
            delegated("click", button_12, () => openApp(get(owned).appId));
            delegated("click", button_13, () => startUpdate(get(owned)));
            append($$anchor4, li);
          });
          append($$anchor3, ul);
        };
        if_block(node_8, ($$render) => {
          if (get(myApps).length === 0 && !get(loadingMyApps)) $$render(consequent_10);
          else $$render(alternate_1, -1);
        });
      }
      var section_5 = sibling(section_4, 2);
      var h3_3 = child(section_5);
      var text_32 = child(h3_3);
      var node_10 = sibling(h3_3, 2);
      {
        var consequent_12 = ($$anchor3) => {
          var div_21 = root_17();
          var text_33 = child(div_21);
          template_effect(() => set_text(text_33, get(loadError)));
          append($$anchor3, div_21);
        };
        if_block(node_10, ($$render) => {
          if (get(loadError)) $$render(consequent_12);
        });
      }
      var node_11 = sibling(node_10, 2);
      {
        var consequent_13 = ($$anchor3) => {
          var p_5 = root_18();
          append($$anchor3, p_5);
        };
        var consequent_14 = ($$anchor3) => {
          var p_6 = root_19();
          append($$anchor3, p_6);
        };
        var alternate_2 = ($$anchor3) => {
          var ul_1 = root_20();
          each(ul_1, 21, () => get(apps), (app) => app.id, ($$anchor4, app) => {
            var li_1 = root_21();
            var button_14 = child(li_1);
            var div_22 = child(button_14);
            var text_34 = child(div_22);
            var div_23 = sibling(div_22, 2);
            var text_35 = child(div_23);
            var div_24 = sibling(div_23, 2);
            var span_10 = child(div_24);
            var text_36 = child(span_10);
            var span_11 = sibling(span_10, 2);
            var text_37 = child(span_11);
            var span_12 = sibling(span_11, 2);
            var text_38 = child(span_12);
            var div_25 = sibling(div_24, 2);
            var text_39 = child(div_25);
            template_effect(
              ($0, $1) => {
                set_text(text_34, get(app).name);
                set_text(text_35, get(app).description || "—");
                set_text(text_36, `v${get(app).appVersion ?? ""} · pkg v${get(app).packageVersion ?? ""}`);
                set_text(text_37, `${get(app).chunkCount ?? ""} chunks · ${$0 ?? ""}`);
                set_text(text_38, $1);
                set_text(text_39, get(app).id);
              },
              [
                () => formatSize(get(app).totalSize),
                () => formatDate(get(app).publishedAtMs)
              ]
            );
            delegated("click", button_14, () => openApp(get(app).id));
            append($$anchor4, li_1);
          });
          append($$anchor3, ul_1);
        };
        if_block(node_11, ($$render) => {
          if (get(loadingList)) $$render(consequent_13);
          else if (get(apps).length === 0 && !get(loadError)) $$render(consequent_14, 1);
          else $$render(alternate_2, -1);
        });
      }
      template_effect(() => {
        set_text(text_21, `My apps (${get(myApps).length ?? ""})`);
        button_11.disabled = get(loadingMyApps);
        set_text(text_22, get(loadingMyApps) ? "Loading..." : "↻ Refresh");
        set_text(text_32, `Published apps (${get(apps).length ?? ""})`);
      });
      delegated("click", button_11, refreshMyApps);
      append($$anchor2, fragment_1);
    };
    if_block(node_4, ($$render) => {
      if (get(selectedApp)) $$render(consequent_7);
      else if (get(updateTarget) && get(updateTarget).app) $$render(consequent_8, 1);
      else $$render(alternate_3, -1);
    });
  }
  template_effect(
    ($0) => {
      button.disabled = get(loadingList);
      set_text(text, get(loadingList) ? "Loading..." : "↻ Reload list");
      set_text(text_1, get(showPublish) ? "Hide publish form" : "+ Publish new app");
      set_text(text_2, ` ${$sharedClientConfig().selected ?? ""}`);
      set_text(text_3, get(randomKey).address);
      set_attribute(a_1, "href", $0);
    },
    [
      () => `${getSelectedNetworkConfig().explorer}/address/${get(randomKey).address}?network=${$sharedClientConfig().selected}`
    ]
  );
  delegated("click", button, refreshList);
  delegated("click", button_1, () => set(showPublish, !get(showPublish)));
  delegated("click", button_2, rotateKey);
  delegated("click", button_3, requestFromFaucet);
  bind_value(input_1, () => $onChainAppsConfig().packageId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).packageId = $$value, untrack($onChainAppsConfig)));
  bind_value(input_2, () => $onChainAppsConfig().registryId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).registryId = $$value, untrack($onChainAppsConfig)));
  bind_value(input_3, () => $onChainAppsConfig().storageId, ($$value) => store_mutate(onChainAppsConfig, untrack($onChainAppsConfig).storageId = $$value, untrack($onChainAppsConfig)));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click", "change"]);
export {
  DEFAULT_HTML,
  OnChainApps as default,
  formatDate,
  formatSize
};

/**
 * postMessage bridge between the sandboxed iframe that hosts a deployed
 * on-chain web app and the host page.
 *
 * ### Wire format
 *
 * Messages between the two sides are `{ kind, id, method?, args?, result?, error? }`.
 *
 * ```
 * iframe -> host:   { kind: 'req',   id, method, args }
 * host   -> iframe: { kind: 'res',   id, result | error }
 * iframe -> host:   { kind: 'ready' }                         // on boot
 * iframe -> host:   { kind: 'resize', height: number }        // optional UX helper
 * ```
 *
 * The host side (`createIframeBridge`) returns a lightweight controller
 * that implements every allowed `method`. The guest side (`BOOTSTRAP_JS`)
 * is a JavaScript string that is prepended to the user's HTML payload; it
 * exposes `window.iota.*` to the app code running inside the iframe.
 */

export type BridgeMethod =
    | 'getAddress'
    | 'getNetwork'
    | 'getAppId'
    | 'getParam'
    | 'rpc' // calls a named method on the IotaClient
    | 'signAndExecute'
    | 'storageSet'
    | 'storageGet'
    | 'storageRemove'
    | 'storageSetShared'
    | 'storageGetShared'
    | 'localGet'
    | 'localSet'
    | 'localRemove'
    | 'webrtcHost'
    | 'webrtcJoin'
    | 'webrtcSend'
    | 'webrtcClose';

export interface BridgeRequest {
    kind: 'req';
    id: string;
    method: BridgeMethod;
    args?: any;
}

export interface BridgeResponse {
    kind: 'res';
    id: string;
    result?: any;
    error?: string;
}

export type BridgeHandler = (method: BridgeMethod, args: any) => Promise<any>;

export interface IframeBridgeController {
    handleMessage: (event: MessageEvent) => Promise<void>;
}

/**
 * Build a MessageEvent handler to be attached to the host `window`. The
 * supplied `handler` routes each request to the appropriate backend method
 * (wallet, storage, client rpc, ...).
 */
export function createIframeBridge(
    iframe: HTMLIFrameElement,
    handler: BridgeHandler,
    onReady?: () => void,
    onResize?: (height: number) => void,
): IframeBridgeController {
    async function handleMessage(event: MessageEvent) {
        // Accept messages only from the sandboxed iframe we own.
        if (event.source !== iframe.contentWindow) return;

        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.kind === 'ready') {
            onReady?.();
            return;
        }
        if (data.kind === 'resize') {
            if (typeof data.height === 'number') onResize?.(data.height);
            return;
        }

        if (data.kind !== 'req') return;
        const req = data as BridgeRequest;
        try {
            const result = await handler(req.method, req.args);
            const resp: BridgeResponse = { kind: 'res', id: req.id, result };
            iframe.contentWindow?.postMessage(resp, '*');
        } catch (err: any) {
            console.error('[Bridge] error handling', req.method, ':', err);
            const resp: BridgeResponse = {
                kind: 'res',
                id: req.id,
                error: err?.message ?? String(err),
            };
            iframe.contentWindow?.postMessage(resp, '*');
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
export const BOOTSTRAP_JS = String.raw`
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

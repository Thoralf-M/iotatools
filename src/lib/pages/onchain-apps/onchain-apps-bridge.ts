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
    | 'localRemove';

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

    // --- WebRTC helpers ---

    var DEFAULT_ICE_SERVERS = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ];
    var POLL_INTERVAL_MS = 2500;

    // Wait for ICE gathering to finish, then return the local description
    // (which now contains all gathered candidates).
    function gatherIce(pc) {
        return new Promise(function (resolve) {
            if (pc.iceGatheringState === 'complete') {
                resolve(pc.localDescription);
                return;
            }
            function check() {
                if (pc.iceGatheringState === 'complete') {
                    pc.removeEventListener('icegatheringstatechange', check);
                    resolve(pc.localDescription);
                }
            }
            pc.addEventListener('icegatheringstatechange', check);
            // Safety net: resolve after 8s even if not complete.
            setTimeout(function () {
                pc.removeEventListener('icegatheringstatechange', check);
                resolve(pc.localDescription);
            }, 8000);
        });
    }

    // Poll on-chain shared storage until a value appears or timeout.
    function pollShared(key, timeoutMs) {
        var deadline = Date.now() + (timeoutMs || 120000);
        return new Promise(function (resolve, reject) {
            function tick() {
                if (Date.now() > deadline) {
                    reject(new Error('WebRTC signaling timeout waiting for key: ' + key));
                    return;
                }
                send('storageGetShared', { key: key, opts: {} }).then(function (val) {
                    if (val != null && val !== '') resolve(val);
                    else setTimeout(tick, POLL_INTERVAL_MS);
                }).catch(function () {
                    setTimeout(tick, POLL_INTERVAL_MS);
                });
            }
            tick();
        });
    }

    function waitForOpen(dc) {
        return new Promise(function (resolve, reject) {
            if (dc.readyState === 'open') { resolve(dc); return; }
            dc.addEventListener('open', function () { resolve(dc); });
            dc.addEventListener('error', function (e) { reject(e); });
            setTimeout(function () { reject(new Error('DataChannel open timeout')); }, 30000);
        });
    }

    function waitForDataChannel(pc) {
        return new Promise(function (resolve, reject) {
            pc.addEventListener('datachannel', function (e) { resolve(e.channel); });
            setTimeout(function () { reject(new Error('DataChannel receive timeout')); }, 30000);
        });
    }

    function makeWebRTC() {
        return {
            // Create a room and wait for a peer to join.
            // Returns { channel: RTCDataChannel, roomId: string, pc: RTCPeerConnection }
            host: async function (opts) {
                opts = opts || {};
                var roomId = opts.roomId || crypto.randomUUID();
                var prefix = 'webrtc:' + roomId;
                var pc = new RTCPeerConnection({
                    iceServers: opts.iceServers || DEFAULT_ICE_SERVERS,
                });
                var dc = pc.createDataChannel(opts.label || 'data');

                var offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                var fullOffer = await gatherIce(pc);

                await send('storageSetShared', {
                    key: prefix + ':offer',
                    value: JSON.stringify(fullOffer),
                });

                var answerJson = await pollShared(prefix + ':answer', opts.timeout || 120000);
                await pc.setRemoteDescription(JSON.parse(answerJson));

                await waitForOpen(dc);
                return { channel: dc, roomId: roomId, pc: pc };
            },

            // Join an existing room.
            // Returns { channel: RTCDataChannel, roomId: string, pc: RTCPeerConnection }
            join: async function (opts) {
                if (!opts || !opts.roomId) throw new Error('roomId is required');
                var roomId = opts.roomId;
                var prefix = 'webrtc:' + roomId;
                var pc = new RTCPeerConnection({
                    iceServers: opts.iceServers || DEFAULT_ICE_SERVERS,
                });

                var dcPromise = waitForDataChannel(pc);

                var offerJson = await pollShared(prefix + ':offer', opts.timeout || 120000);
                await pc.setRemoteDescription(JSON.parse(offerJson));

                var answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                var fullAnswer = await gatherIce(pc);

                await send('storageSetShared', {
                    key: prefix + ':answer',
                    value: JSON.stringify(fullAnswer),
                });

                var dc = await dcPromise;
                await waitForOpen(dc);
                return { channel: dc, roomId: roomId, pc: pc };
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

<script lang="ts" module>
    import skillMd from '../../../../.claude/skills/onchain-apps/SKILL.md?raw';

    // The DEFAULT_HTML template literal below embeds a closing script tag.
    // To keep Svelte's own parser from seeing it as the end of this script
    // block, we assemble the closing tag at runtime from two halves.
    const END = '<' + '/' + 'script>';
    export const DEFAULT_HTML =
        `<!-- Minimal example app. -->
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
` +
        END +
        `
`;

    export function formatSize(bytes: number): string {
        if (!bytes) return '0 B';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
        return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
    }

    export function formatDate(ms: number): string {
        if (!ms) return '—';
        try {
            return new Date(ms).toLocaleString();
        } catch {
            return String(ms);
        }
    }
</script>

<script lang="ts">
    import { fromBase64, toBase64 } from '@iota/bcs';
    import type { IotaClient } from '@iota/iota-sdk/client';
    import { requestIotaFromFaucetV0 } from '@iota/iota-sdk/faucet';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { onDestroy, onMount } from 'svelte';

    import { getClient, getSelectedNetworkConfig } from '../../utils/client';
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import {
        getCurrentPageQueryParams,
        updatePageQueryParams,
        usePageQueryParams,
    } from '../../utils/page-query-params';
    import { BOOTSTRAP_JS, createIframeBridge, type BridgeMethod } from './onchain-apps-bridge';
    import {
        buildAppendChunksTx,
        buildPublishTx,
        buildStorageSetTx,
        buildUpdateAppTx,
        DEFAULT_CHUNK_SIZE,
        fetchAppContent,
        fetchAppMetadata,
        fetchAppMetadatas,
        fetchOwnedAppCaps,
        listAppIds,
        splitChunks,
        type AppMetadata,
        type OwnedAppCap,
    } from './onchain-apps-client';
    import { onChainAppsConfig } from './onchain-apps-config';
    import {
        ensureRandomKey,
        generateAndStoreRandomKey,
        keypairFor,
        type RandomKey,
    } from './onchain-apps-key';

    // --- state ---

    const pageParams = usePageQueryParams({ appId: '' });

    let randomKey: RandomKey = $state(ensureRandomKey());
    let signerBalance = $state('');
    let apps: AppMetadata[] = $state([]);
    let loadingList = $state(false);
    let loadError = $state('');
    let selectedApp: AppMetadata | null = $state(null);
    let selectedAppContent: Uint8Array | null = $state(null);
    let loadingApp = $state(false);
    let iframeSrcDoc = $state('');
    let iframeHeight = $state(560);
    let statusMessage = $state('');
    let statusIsError = $state(false);

    // Publish form state.
    let showPublish = $state(false);
    let publishName = $state('');
    let publishDescription = $state('');
    let publishContentType = $state('text/html');
    let publishHtml = $state(DEFAULT_HTML);
    let publishing = $state(false);
    let publishResultUrl = $state('');

    // My-apps (upgrade capability) state.
    let myApps: OwnedAppCap[] = $state([]);
    let loadingMyApps = $state(false);
    let myAppsError = $state('');
    let updateTarget: OwnedAppCap | null = $state(null);
    let updateName = $state('');
    let updateDescription = $state('');
    let updateContentType = $state('text/html');
    let updateHtml = $state('');
    let updating = $state(false);

    let iframeEl: HTMLIFrameElement | undefined = $state();
    let appMaximized = $state(false);

    // --- Starred apps ---
    const STARRED_KEY = 'onchainApps:starred';
    function loadStarred(): Set<string> {
        try {
            const raw = localStorage.getItem(STARRED_KEY);
            return new Set(raw ? JSON.parse(raw) : []);
        } catch {
            return new Set();
        }
    }
    function saveStarred(set: Set<string>) {
        localStorage.setItem(STARRED_KEY, JSON.stringify([...set]));
    }
    let starred: Set<string> = $state(loadStarred());
    function toggleStar(id: string, e: MouseEvent) {
        e.stopPropagation();
        const next = new Set(starred);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        starred = next;
        saveStarred(next);
    }
    let sortedApps = $derived.by(() => {
        const pinned = apps.filter((a) => starred.has(a.id));
        const rest = apps.filter((a) => !starred.has(a.id));
        return { pinned, rest };
    });

    // --- WebRTC state (connections are managed on the host page for ICE compatibility) ---

    // Abstracted channel that works for both WebRTC DataChannel and BroadcastChannel.
    interface ProxyChannel {
        send(data: string): void;
        close(): void;
    }
    const proxyChannels = new Map<string, ProxyChannel>();
    let webrtcIdSeq = 0;

    const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ];
    const WEBRTC_POLL_MS = 2500;

    function rtcLog(...args: unknown[]) {
        console.log('[WebRTC]', ...args);
    }

    function gatherIce(pc: RTCPeerConnection): Promise<RTCSessionDescription | null> {
        return new Promise((resolve) => {
            const candidates: string[] = [];
            pc.onicecandidate = (e) => {
                if (e.candidate) candidates.push(e.candidate.candidate);
            };
            if (pc.iceGatheringState === 'complete') {
                rtcLog('ICE already complete, candidates:', candidates.length);
                resolve(pc.localDescription);
                return;
            }
            const check = () => {
                if (pc.iceGatheringState === 'complete') {
                    pc.removeEventListener('icegatheringstatechange', check);
                    rtcLog('ICE gathering complete, candidates:', candidates.length);
                    candidates.forEach((c) => rtcLog('  candidate:', c));
                    resolve(pc.localDescription);
                }
            };
            pc.addEventListener('icegatheringstatechange', check);
            setTimeout(() => {
                pc.removeEventListener('icegatheringstatechange', check);
                rtcLog(
                    'ICE gathering safety-net timeout (8s), state:',
                    pc.iceGatheringState,
                    'candidates:',
                    candidates.length,
                );
                candidates.forEach((c) => rtcLog('  candidate:', c));
                resolve(pc.localDescription);
            }, 8000);
        });
    }

    function waitForOpen(dc: RTCDataChannel): Promise<RTCDataChannel> {
        return new Promise((resolve, reject) => {
            rtcLog('waitForOpen: current state =', dc.readyState);
            if (dc.readyState === 'open') {
                resolve(dc);
                return;
            }
            const onOpen = () => {
                rtcLog('DataChannel opened!');
                resolve(dc);
            };
            const onError = (e: Event) => {
                rtcLog('DataChannel error:', e);
                reject(e);
            };
            dc.addEventListener('open', onOpen);
            dc.addEventListener('error', onError);
            setTimeout(() => {
                dc.removeEventListener('open', onOpen);
                dc.removeEventListener('error', onError);
                rtcLog('DataChannel open timeout (30s), state:', dc.readyState);
                reject(new Error('DataChannel open timeout after 30s, state=' + dc.readyState));
            }, 30000);
        });
    }

    // Returns a promise that resolves when a datachannel event fires.
    // The timeout is NOT started here — it is started later after signaling
    // completes, so signaling time doesn't eat into the connection window.
    function listenForDataChannel(pc: RTCPeerConnection): {
        promise: Promise<RTCDataChannel>;
        startTimeout: (ms: number) => void;
    } {
        let rejectFn: ((e: Error) => void) | null = null;
        let resolved = false;
        const promise = new Promise<RTCDataChannel>((resolve, reject) => {
            rejectFn = reject;
            pc.addEventListener('datachannel', (e) => {
                rtcLog('datachannel event received, label:', e.channel.label);
                resolved = true;
                resolve(e.channel);
            });
        });
        function startTimeout(ms: number) {
            setTimeout(() => {
                if (!resolved && rejectFn) {
                    rtcLog('DataChannel receive timeout (' + ms + 'ms) — ICE state:', pc.iceConnectionState, 'connection:', pc.connectionState);
                    rejectFn(new Error('DataChannel receive timeout (' + (ms / 1000) + 's after signaling)'));
                }
            }, ms);
        }
        return { promise, startTimeout };
    }

    async function rtcReadShared(key: string): Promise<string | null> {
        const client = getClient();
        const appId = selectedApp?.id ?? '';
        if (!$onChainAppsConfig.storageId || !appId) return null;
        const bytes = await readStorageValue(client, appId, '', key, true);
        if (!bytes) return null;
        return new TextDecoder().decode(bytes);
    }

    async function rtcWriteShared(key: string, value: string): Promise<void> {
        rtcLog('writing shared key:', key, '(' + value.length + ' bytes)');
        const client = getClient();
        const appId = selectedApp?.id ?? '';
        const tx = buildStorageSetTx({
            packageId: $onChainAppsConfig.packageId,
            storageId: $onChainAppsConfig.storageId,
            appId,
            key,
            value: new TextEncoder().encode(value),
            shared: true,
        });
        const result = await client.signAndExecuteTransaction({
            transaction: tx,
            signer: keypairFor(randomKey.bech32PrivateKey),
            options: { showEffects: true },
        });
        const status = result.effects?.status?.status;
        rtcLog('write result:', status, 'digest:', result.digest);
        if (status !== 'success') {
            throw new Error('Storage write failed: ' + JSON.stringify(result.effects?.status));
        }
    }

    async function rtcPollShared(key: string, timeoutMs: number): Promise<string> {
        const deadline = Date.now() + timeoutMs;
        let attempts = 0;
        while (Date.now() < deadline) {
            try {
                const val = await rtcReadShared(key);
                attempts++;
                if (val !== null && val !== '') {
                    rtcLog('poll found key:', key, 'after', attempts, 'attempts');
                    return val;
                }
            } catch (e) {
                rtcLog('poll read error for', key, ':', e);
            }
            await new Promise((r) => setTimeout(r, WEBRTC_POLL_MS));
        }
        throw new Error('WebRTC signaling timeout for key: ' + key + ' after ' + attempts + ' attempts');
    }

    function registerProxy(channelId: string, proxy: ProxyChannel) {
        proxyChannels.set(channelId, proxy);
    }

    function pushToIframe(channelId: string, data: string) {
        iframeEl?.contentWindow?.postMessage({ kind: 'webrtcData', channelId, data }, '*');
    }

    function pushCloseToIframe(channelId: string) {
        iframeEl?.contentWindow?.postMessage({ kind: 'webrtcClose', channelId }, '*');
        proxyChannels.delete(channelId);
    }

    /** Wire up an RTCDataChannel + its PeerConnection as a proxy channel. */
    function setupRTCProxy(channelId: string, pc: RTCPeerConnection, dc: RTCDataChannel) {
        pc.onconnectionstatechange = () =>
            rtcLog('pc connection state:', pc.connectionState);
        pc.oniceconnectionstatechange = () =>
            rtcLog('pc ICE connection state:', pc.iceConnectionState);
        dc.onmessage = (e) => pushToIframe(channelId, e.data);
        dc.onclose = () => {
            rtcLog('DataChannel closed for', channelId);
            pushCloseToIframe(channelId);
        };
        registerProxy(channelId, {
            send: (data) => dc.send(data),
            close: () => {
                try { dc.close(); } catch { /* ok */ }
                try { pc.close(); } catch { /* ok */ }
            },
        });
    }

    /** Wire up a BroadcastChannel as a proxy channel (same-browser fast path). */
    function setupBCProxy(channelId: string, bc: BroadcastChannel) {
        bc.onmessage = (e) => {
            const msg = e.data;
            if (msg?.t === 'd') pushToIframe(channelId, msg.p);
            else if (msg?.t === 'x') {
                rtcLog('BC peer closed', channelId);
                pushCloseToIframe(channelId);
                bc.close();
            }
        };
        registerProxy(channelId, {
            send: (data) => bc.postMessage({ t: 'd', p: data }),
            close: () => {
                bc.postMessage({ t: 'x' });
                bc.close();
            },
        });
    }

    /**
     * BroadcastChannel handshake for same-browser connections.
     * Returns the channel + id on success, null on timeout.
     */
    function bcHost(roomId: string): {
        promise: Promise<string | null>;
        cancel: () => void;
    } {
        const bcName = 'iota-rtc:' + roomId;
        const bc = new BroadcastChannel(bcName);
        let done = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const promise = new Promise<string | null>((resolve) => {
            bc.onmessage = (e) => {
                if (done) return;
                if (e.data?.t === 'ping') {
                    done = true;
                    clearTimeout(timer);
                    bc.postMessage({ t: 'pong' });
                    const chId = 'bc-' + ++webrtcIdSeq;
                    setupBCProxy(chId, bc);
                    rtcLog('HOST: BroadcastChannel connected (same browser)!', chId);
                    resolve(chId);
                }
            };
            // This never resolves on its own — it gets cancelled or resolved by a ping.
        });
        function cancel() {
            if (!done) { done = true; bc.close(); }
        }
        return { promise, cancel };
    }

    function bcJoin(roomId: string, timeoutMs: number): Promise<string | null> {
        const bcName = 'iota-rtc:' + roomId;
        const bc = new BroadcastChannel(bcName);
        return new Promise<string | null>((resolve) => {
            let done = false;
            bc.onmessage = (e) => {
                if (done) return;
                if (e.data?.t === 'pong') {
                    done = true;
                    const chId = 'bc-' + ++webrtcIdSeq;
                    setupBCProxy(chId, bc);
                    rtcLog('JOIN: BroadcastChannel connected (same browser)!', chId);
                    resolve(chId);
                }
            };
            // Send ping immediately and retry a few times.
            bc.postMessage({ t: 'ping' });
            const retryInterval = setInterval(() => {
                if (!done) bc.postMessage({ t: 'ping' });
            }, 500);
            setTimeout(() => {
                clearInterval(retryInterval);
                if (!done) { done = true; bc.close(); resolve(null); }
            }, timeoutMs);
        });
    }

    function cleanupWebRTC() {
        for (const [, proxy] of proxyChannels) {
            try { proxy.close(); } catch { /* ok */ }
        }
        proxyChannels.clear();
    }

    // --- effects ---

    // Make sure the user is on devnet by default so the app stays isolated
    // from real funds and transactions.
    onMount(() => {
        if ($sharedClientConfig.selected !== 'devnet') {
            sharedClientConfig.update((cfg) => ({ ...cfg, selected: 'devnet' }));
        }
        refreshList();
        refreshMyApps();

        // Auto-fund from faucet if the balance is zero (first-time use).
        (async () => {
            try {
                const client = getClient();
                const bal = await client.getBalance({ owner: randomKey.address });
                if (BigInt(bal.totalBalance) === 0n) {
                    setStatus('New signer detected — requesting devnet funds...');
                    await requestFromFaucet();
                }
                await refreshBalance();
            } catch {
                /* non-critical */
            }
        })();

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && appMaximized) {
                appMaximized = false;
                document.body.classList.remove('app-maximized');
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    });

    $effect(() => {
        const wanted = $pageParams.appId;
        if (wanted && (!selectedApp || selectedApp.id !== wanted)) {
            void openApp(wanted);
        } else if (!wanted && selectedApp) {
            selectedApp = null;
            selectedAppContent = null;
            iframeSrcDoc = '';
        }
    });

    $effect(() => {
        if (iframeEl) {
            const handler = createIframeBridge(iframeEl, onBridgeRequest, undefined, (h) => {
                iframeHeight = Math.max(200, Math.min(4000, h));
            });
            window.addEventListener('message', handler.handleMessage);
            return () => {
                window.removeEventListener('message', handler.handleMessage);
                cleanupWebRTC();
            };
        }
    });

    onDestroy(() => {
        document.body.classList.remove('app-maximized');
    });

    // --- helpers ---

    function setStatus(msg: string, isError = false) {
        statusMessage = msg;
        statusIsError = isError;
    }

    async function refreshMyApps() {
        myAppsError = '';
        if (!$onChainAppsConfig.packageId || !randomKey.address) {
            myApps = [];
            return;
        }
        loadingMyApps = true;
        try {
            const client = getClient();
            myApps = await fetchOwnedAppCaps(
                client,
                $onChainAppsConfig.packageId,
                randomKey.address,
            );
        } catch (err: any) {
            myAppsError = err?.message ?? String(err);
            myApps = [];
        } finally {
            loadingMyApps = false;
        }
    }

    async function startUpdate(owned: OwnedAppCap) {
        updateTarget = owned;
        updateName = owned.app?.name ?? '';
        updateDescription = owned.app?.description ?? '';
        updateContentType = owned.app?.contentType ?? 'text/html';
        updateHtml = '';
        setStatus('');

        // Pre-populate the editor with the existing payload so small edits
        // don't require re-typing everything from scratch.
        if (owned.app) {
            try {
                const client = getClient();
                const bytes = await fetchAppContent(client, owned.app);
                updateHtml = new TextDecoder().decode(bytes);
            } catch (err: any) {
                setStatus(`Could not load existing payload: ${err?.message ?? err}`, true);
            }
        }
    }

    function cancelUpdate() {
        updateTarget = null;
        updateHtml = '';
    }

    async function onUpdateFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        updateHtml = await file.text();
        if (file.type) updateContentType = file.type;
    }

    async function submitUpdate() {
        if (!updateTarget || !updateTarget.app) return;
        if (!$onChainAppsConfig.packageId) {
            setStatus('Package ID is required.', true);
            return;
        }
        if (!updateName.trim()) {
            setStatus('Name is required.', true);
            return;
        }
        updating = true;
        setStatus('');
        try {
            const client = getClient();
            const signer = keypairFor(randomKey.bech32PrivateKey);
            const bytes = new TextEncoder().encode(updateHtml);
            const chunks = splitChunks(bytes, DEFAULT_CHUNK_SIZE);
            const firstBatch = chunks.slice(0, 1);
            const updateTx = buildUpdateAppTx({
                packageId: $onChainAppsConfig.packageId,
                appId: updateTarget.app.id,
                appCapId: updateTarget.capId,
                name: updateName,
                description: updateDescription,
                contentType: updateContentType,
                chunks: firstBatch,
            });
            await client.signAndExecuteTransaction({
                transaction: updateTx,
                signer,
                options: { showEffects: true, showEvents: true },
            });

            // Upload any remaining chunks in follow-up transactions.
            for (let i = 1; i < chunks.length; i++) {
                const appendTx = buildAppendChunksTx({
                    packageId: $onChainAppsConfig.packageId,
                    appId: updateTarget.app.id,
                    appCapId: updateTarget.capId,
                    chunks: [chunks[i]],
                });
                await client.signAndExecuteTransaction({
                    transaction: appendTx,
                    signer,
                    options: { showEffects: true },
                });
                setStatus(`Uploaded chunk ${i + 1} / ${chunks.length}...`);
            }

            setStatus(
                `Updated ${updateTarget.app.id}. Existing viewers will pick up the new version on their next load.`,
            );
            updateTarget = null;
            await Promise.all([refreshList(), refreshMyApps()]);
        } catch (err: any) {
            setStatus(`Update failed: ${err?.message ?? err}`, true);
        } finally {
            updating = false;
        }
    }

    async function refreshList() {
        setStatus('');
        apps = [];
        selectedApp = null;
        selectedAppContent = null;
        iframeSrcDoc = '';
        loadError = '';
        if (!$onChainAppsConfig.registryId) {
            loadError =
                'Registry ID not configured yet. Publish the Move package and paste the IDs into the settings below.';
            return;
        }
        loadingList = true;
        try {
            const client = getClient();
            const ids = await listAppIds(client, $onChainAppsConfig.registryId);
            const metas = await fetchAppMetadatas(client, ids);
            // Show newest apps first (by publish date, falling back to index).
            metas.sort((a, b) => (b.publishedAtMs || 0) - (a.publishedAtMs || 0));
            apps = metas;
        } catch (err: any) {
            loadError = err?.message ?? String(err);
        } finally {
            loadingList = false;
        }
    }

    async function openApp(appId: string) {
        loadingApp = true;
        try {
            const client = getClient();
            const app = await fetchAppMetadata(client, appId);
            selectedApp = app;
            updatePageQueryParams({ appId: app.id });

            // Pass extra URL params (e.g. ?room=CODE) into the app's localStorage
            // so the app can read them on load without needing URL access.
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            for (const [key, val] of hashParams.entries()) {
                if (key !== 'appId' && val) {
                    writeAppLocal(app.id, '_param_' + key, val);
                }
            }

            const bytes = await fetchAppContent(client, app);
            selectedAppContent = bytes;
            const html = new TextDecoder().decode(bytes);
            iframeSrcDoc = wrapAppHtml(html);
            if (!appMaximized) {
                appMaximized = true;
                window.scrollTo(0, 0);
                document.body.classList.add('app-maximized');
            }
        } catch (err: any) {
            setStatus(`Failed to load app: ${err?.message ?? err}`, true);
            selectedApp = null;
            selectedAppContent = null;
            iframeSrcDoc = '';
        } finally {
            loadingApp = false;
        }
    }

    function wrapAppHtml(userHtml: string): string {
        // Inject the bootstrap BEFORE the user HTML so `window.iota` is
        // available by the time the app's own scripts run. `CLOSE_SCRIPT`
        // is spelled in two halves so Svelte's parser does not close our
        // own <script> tag when it tokenises this file.
        const CLOSE_SCRIPT = '<' + '/script>';
        return (
            `<!DOCTYPE html><html><head><meta charset="utf-8"><script>` +
            BOOTSTRAP_JS +
            CLOSE_SCRIPT +
            `</head><body>` +
            userHtml +
            `</body></html>`
        );
    }

    function closeApp() {
        selectedApp = null;
        selectedAppContent = null;
        iframeSrcDoc = '';
        appMaximized = false;
        document.body.classList.remove('app-maximized');
        updatePageQueryParams({ appId: null });
    }

    // --- bridge request handler ---

    async function onBridgeRequest(method: BridgeMethod, args: any): Promise<any> {
        if (method.startsWith('webrtc')) {
            console.log('[Bridge] request:', method, args);
        }
        const client = getClient();
        const appId = selectedApp?.id ?? '';
        switch (method) {
            case 'getAddress':
                return randomKey.address;
            case 'getNetwork':
                return $sharedClientConfig.selected;
            case 'getAppId':
                return appId;
            case 'getParam': {
                const key = args?.key;
                if (!key) return null;
                const params = getCurrentPageQueryParams();
                return params[key] ?? null;
            }
            case 'rpc': {
                const { method: rpcMethod, args: rpcArgs = [] } = args ?? {};
                const fn = (client as any)[rpcMethod];
                if (typeof fn !== 'function') {
                    throw new Error(`Unknown client RPC method: ${rpcMethod}`);
                }
                return await fn.apply(client, rpcArgs);
            }
            case 'signAndExecute': {
                const txJson = args?.txJson;
                if (!txJson) throw new Error('missing txJson');
                const tx =
                    typeof txJson === 'string'
                        ? Transaction.from(txJson)
                        : Transaction.from(JSON.stringify(txJson));
                return await client.signAndExecuteTransaction({
                    transaction: tx,
                    signer: keypairFor(randomKey.bech32PrivateKey),
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                        showEvents: true,
                    },
                });
            }
            case 'storageSet':
            case 'storageSetShared': {
                const { key, value } = args ?? {};
                if (!$onChainAppsConfig.packageId || !$onChainAppsConfig.storageId) {
                    throw new Error('on-chain storage is not configured');
                }
                if (!appId) throw new Error('no active app');
                const bytes = coerceToBytes(value);
                const tx = buildStorageSetTx({
                    packageId: $onChainAppsConfig.packageId,
                    storageId: $onChainAppsConfig.storageId,
                    appId,
                    key,
                    value: bytes,
                    shared: method === 'storageSetShared',
                });
                return await client.signAndExecuteTransaction({
                    transaction: tx,
                    signer: keypairFor(randomKey.bech32PrivateKey),
                    options: { showEffects: true, showEvents: true },
                });
            }
            case 'storageGet':
            case 'storageGetShared': {
                const { key, opts = {} } = args ?? {};
                if (!$onChainAppsConfig.storageId) {
                    throw new Error('on-chain storage is not configured');
                }
                if (!appId) throw new Error('no active app');
                const user: string = opts.user ?? randomKey.address;
                const bytes = await readStorageValue(
                    client,
                    appId,
                    user,
                    key,
                    method === 'storageGetShared',
                );
                if (!bytes) return null;
                return opts.encoding === 'base64'
                    ? toBase64(bytes)
                    : new TextDecoder().decode(bytes);
            }
            case 'storageRemove': {
                const { key } = args ?? {};
                if (!$onChainAppsConfig.packageId || !$onChainAppsConfig.storageId) {
                    throw new Error('on-chain storage is not configured');
                }
                if (!appId) throw new Error('no active app');
                const tx = new Transaction();
                tx.moveCall({
                    target: `${$onChainAppsConfig.packageId}::generic_storage::remove`,
                    arguments: [
                        tx.object($onChainAppsConfig.storageId),
                        tx.pure.address(appId),
                        tx.pure.string(key),
                    ],
                });
                return await client.signAndExecuteTransaction({
                    transaction: tx,
                    signer: keypairFor(randomKey.bech32PrivateKey),
                    options: { showEffects: true },
                });
            }
            case 'localGet':
                return readAppLocal(appId, args?.key);
            case 'localSet':
                writeAppLocal(appId, args?.key, args?.value);
                return true;
            case 'localRemove':
                removeAppLocal(appId, args?.key);
                return true;
            case 'webrtcHost': {
                const roomId = args?.roomId || crypto.randomUUID();
                const prefix = 'webrtc:' + roomId;
                const iceServers = args?.iceServers || DEFAULT_ICE_SERVERS;
                const timeout = args?.timeout || 120000;
                rtcLog('HOST: creating room', roomId);

                // Start BroadcastChannel listener (same-browser fast path).
                const bcHandle = bcHost(roomId);

                // Start WebRTC signaling in parallel.
                const pc = new RTCPeerConnection({ iceServers });
                const dc = pc.createDataChannel(args?.label || 'data');
                rtcLog('HOST: creating offer...');
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                rtcLog('HOST: gathering ICE...');
                const fullOffer = await gatherIce(pc);
                rtcLog('HOST: writing offer to chain...');
                await rtcWriteShared(prefix + ':offer', JSON.stringify(fullOffer));

                // Check if BC already connected while we did signaling.
                const earlyBc = await Promise.race([
                    bcHandle.promise,
                    new Promise<null>((r) => setTimeout(() => r(null), 0)),
                ]);
                if (earlyBc) {
                    pc.close();
                    return { channelId: earlyBc, roomId };
                }

                // Race BC listener against WebRTC answer polling.
                rtcLog('HOST: polling for answer (+ BC fallback)...');
                const rtcPath = (async (): Promise<string> => {
                    const answerJson = await rtcPollShared(prefix + ':answer', timeout);
                    rtcLog('HOST: got answer, setting remote desc...');
                    await pc.setRemoteDescription(JSON.parse(answerJson));
                    rtcLog('HOST: waiting for datachannel open...');
                    await waitForOpen(dc);
                    const chId = 'ch-' + ++webrtcIdSeq;
                    setupRTCProxy(chId, pc, dc);
                    rtcLog('HOST: WebRTC connected!', chId);
                    return chId;
                })();

                const winnerId = await Promise.race([
                    bcHandle.promise.then((id) => (id ? id : rtcPath)),
                    rtcPath,
                ]);
                bcHandle.cancel();
                if (winnerId.startsWith('bc-')) pc.close();
                return { channelId: winnerId, roomId };
            }
            case 'webrtcJoin': {
                if (!args?.roomId) throw new Error('roomId is required');
                const jRoomId = args.roomId;
                const jPrefix = 'webrtc:' + jRoomId;
                const jIce = args?.iceServers || DEFAULT_ICE_SERVERS;
                const jTimeout = args?.timeout || 120000;
                rtcLog('JOIN: joining room', jRoomId);

                // Try BroadcastChannel first (< 2 s for same browser).
                const bcChId = await bcJoin(jRoomId, 2000);
                if (bcChId) {
                    return { channelId: bcChId, roomId: jRoomId };
                }

                // Fall back to WebRTC.
                rtcLog('JOIN: BC not available, using WebRTC...');
                const jPc = new RTCPeerConnection({ iceServers: jIce });
                const dcListener = listenForDataChannel(jPc);
                rtcLog('JOIN: polling for offer...');
                const offerJson = await rtcPollShared(jPrefix + ':offer', jTimeout);
                rtcLog('JOIN: got offer, setting remote desc...');
                await jPc.setRemoteDescription(JSON.parse(offerJson));
                rtcLog('JOIN: creating answer...');
                const jAnswer = await jPc.createAnswer();
                await jPc.setLocalDescription(jAnswer);
                rtcLog('JOIN: gathering ICE...');
                const fullAnswer = await gatherIce(jPc);
                rtcLog('JOIN: writing answer to chain...');
                await rtcWriteShared(jPrefix + ':answer', JSON.stringify(fullAnswer));
                rtcLog('JOIN: signaling done, waiting for datachannel (30 s)...');
                dcListener.startTimeout(30000);
                const jDc = await dcListener.promise;
                rtcLog('JOIN: got datachannel, waiting for open...');
                await waitForOpen(jDc);
                const joinChId = 'ch-' + ++webrtcIdSeq;
                setupRTCProxy(joinChId, jPc, jDc);
                rtcLog('JOIN: WebRTC connected!', joinChId);
                return { channelId: joinChId, roomId: jRoomId };
            }
            case 'webrtcSend': {
                const proxy = proxyChannels.get(args?.channelId);
                if (!proxy) throw new Error('Unknown channel: ' + args?.channelId);
                proxy.send(args.data);
                return true;
            }
            case 'webrtcClose': {
                rtcLog('closing channel', args?.channelId);
                const proxy = proxyChannels.get(args?.channelId);
                if (proxy) {
                    try {
                        proxy.close();
                    } catch {
                        /* ok */
                    }
                    proxyChannels.delete(args.channelId);
                }
                return true;
            }
            default:
                throw new Error(`Unsupported bridge method: ${method}`);
        }
    }

    function coerceToBytes(value: unknown): Uint8Array {
        if (value instanceof Uint8Array) return value;
        if (typeof value === 'string') return new TextEncoder().encode(value);
        if (value && typeof value === 'object' && 'base64' in (value as any)) {
            return fromBase64((value as any).base64);
        }
        return new TextEncoder().encode(JSON.stringify(value));
    }

    async function readStorageValue(
        client: IotaClient,
        appId: string,
        user: string,
        key: string,
        shared: boolean,
    ): Promise<Uint8Array | null> {
        if (!$onChainAppsConfig.packageId) return null;
        const pkg = $onChainAppsConfig.packageId;
        const storageId = $onChainAppsConfig.storageId;
        const keyType = shared
            ? `${pkg}::generic_storage::SharedKey`
            : `${pkg}::generic_storage::UserKey`;
        const keyValue = shared ? { app_id: appId, key } : { app_id: appId, user, key };
        try {
            const resp = await client.getDynamicFieldObject({
                parentObjectId: storageId,
                name: { type: keyType, value: keyValue },
                options: { showContent: true },
            });
            if (!resp.data) return null;
            const fields = (resp.data.content as any)?.fields;
            const raw = fields?.value;
            if (raw == null) return null;
            if (typeof raw === 'string') return fromBase64(raw);
            if (Array.isArray(raw)) return new Uint8Array(raw);
            return null;
        } catch {
            return null;
        }
    }

    function localKeyFor(appId: string, key: string): string {
        return `onchainApps:${appId}:${key}`;
    }

    function readAppLocal(appId: string, key: string): string | null {
        if (!appId || typeof localStorage === 'undefined') return null;
        return localStorage.getItem(localKeyFor(appId, key));
    }

    function writeAppLocal(appId: string, key: string, value: string) {
        if (!appId || typeof localStorage === 'undefined') return;
        localStorage.setItem(localKeyFor(appId, key), String(value));
    }

    function removeAppLocal(appId: string, key: string) {
        if (!appId || typeof localStorage === 'undefined') return;
        localStorage.removeItem(localKeyFor(appId, key));
    }

    // --- balance ---

    async function refreshBalance() {
        try {
            const client = getClient();
            const bal = await client.getBalance({ owner: randomKey.address });
            const nano = BigInt(bal.totalBalance);
            if (nano === 0n) {
                signerBalance = '0 IOTA';
            } else if (nano < 1_000_000_000n) {
                signerBalance = `${(Number(nano) / 1e9).toFixed(4)} IOTA`;
            } else {
                signerBalance = `${(Number(nano) / 1e9).toFixed(2)} IOTA`;
            }
        } catch {
            signerBalance = '';
        }
    }

    // --- actions: key / faucet ---

    function rotateKey() {
        const ok = confirm(
            'Generating a new random key will drop the current one (along with whatever devnet IOTA it holds). Continue?',
        );
        if (!ok) return;
        randomKey = generateAndStoreRandomKey();
        signerBalance = '';
        void refreshMyApps();
        void refreshBalance();
    }

    async function requestFromFaucet() {
        const faucetUrl = $sharedClientConfig.networks.find(
            (n) => n.name === $sharedClientConfig.selected,
        )?.faucet;
        if (!faucetUrl) {
            setStatus('Selected network has no faucet configured.', true);
            return;
        }
        try {
            await requestIotaFromFaucetV0({ host: faucetUrl, recipient: randomKey.address });
            setStatus(`Requested funds — balance will update shortly.`);
            // Balance takes a moment to reflect.
            setTimeout(() => refreshBalance(), 3000);
        } catch (err: any) {
            setStatus(`Faucet request failed: ${err?.message ?? err}`, true);
        }
    }

    function copyShareLink() {
        if (!selectedApp) return;
        const url = new URL(window.location.href);
        if (url.hash && url.hash.startsWith('#/')) {
            const [route] = url.hash.split('?');
            url.hash = `${route}?appId=${selectedApp.id}`;
        } else {
            url.searchParams.set('appId', selectedApp.id);
        }
        navigator.clipboard.writeText(url.toString());
        setStatus('Shareable link copied to clipboard.');
    }

    // --- actions: publishing ---

    async function publishApp() {
        if (!$onChainAppsConfig.packageId || !$onChainAppsConfig.registryId) {
            setStatus('Configure packageId and registryId before publishing.', true);
            return;
        }
        if (!publishName.trim()) {
            setStatus('Name is required.', true);
            return;
        }
        publishing = true;
        publishResultUrl = '';
        setStatus('');

        try {
            const client = getClient();
            const signer = keypairFor(randomKey.bech32PrivateKey);
            const bytes = new TextEncoder().encode(publishHtml);
            const chunks = splitChunks(bytes, DEFAULT_CHUNK_SIZE);
            const firstBatch = chunks.slice(0, 1); // one chunk per tx to stay well within limits
            const publishTx = buildPublishTx({
                packageId: $onChainAppsConfig.packageId,
                registryId: $onChainAppsConfig.registryId,
                name: publishName,
                description: publishDescription,
                contentType: publishContentType,
                firstChunks: firstBatch,
            });

            const result = await client.signAndExecuteTransaction({
                transaction: publishTx,
                signer,
                options: { showEffects: true, showObjectChanges: true, showEvents: true },
            });

            const objectChanges = (result as any).objectChanges ?? [];
            const newApp = objectChanges.find(
                (c: any) =>
                    c.type === 'created' &&
                    typeof c.objectType === 'string' &&
                    c.objectType.endsWith('::app::App'),
            );
            const newCap = objectChanges.find(
                (c: any) =>
                    c.type === 'created' &&
                    typeof c.objectType === 'string' &&
                    c.objectType.endsWith('::app::AppCap'),
            );
            if (!newApp || !newCap) {
                throw new Error(
                    `Could not find created App/AppCap in object changes: ${JSON.stringify(objectChanges)}`,
                );
            }
            const appId: string = newApp.objectId;
            const capId: string = newCap.objectId;

            // Upload any remaining chunks in follow-up transactions.
            for (let i = 1; i < chunks.length; i++) {
                const appendTx = buildAppendChunksTx({
                    packageId: $onChainAppsConfig.packageId,
                    appId,
                    appCapId: capId,
                    chunks: [chunks[i]],
                });
                await client.signAndExecuteTransaction({
                    transaction: appendTx,
                    signer,
                    options: { showEffects: true },
                });
                setStatus(`Uploaded chunk ${i + 1} / ${chunks.length}...`);
            }

            setStatus(`Published app ${appId} (${chunks.length} chunks).`);
            publishResultUrl = window.location.href.split('?')[0] + `?appId=${appId}`;
            await Promise.all([refreshList(), refreshMyApps()]);
            showPublish = false;
        } catch (err: any) {
            setStatus(`Publish failed: ${err?.message ?? err}`, true);
        } finally {
            publishing = false;
        }
    }

    async function onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        publishHtml = await file.text();
        if (!publishName) publishName = file.name;
        if (!publishContentType && file.type) publishContentType = file.type;
    }
</script>

<main>
    <header class="top">
        <div>
            <h2>On-Chain Apps</h2>
            <p class="subtitle">
                Web apps published directly to the IOTA devnet and loaded from dynamic fields.
            </p>
        </div>
        <div class="top-actions">
            <button onclick={refreshList} disabled={loadingList}>
                {loadingList ? 'Loading...' : '↻ Reload list'}
            </button>
            <button onclick={() => (showPublish = !showPublish)}>
                {showPublish ? 'Hide publish form' : '+ Publish new app'}
            </button>
        </div>
    </header>

    <details class="panel config-panel">
        <summary>Package configuration</summary>
        <p class="muted">
            Override the Move package / object ids if you deployed your own instance. Otherwise the
            defaults point at the canonical devnet deployment.
        </p>
        <label>
            Package ID
            <input
                bind:value={$onChainAppsConfig.packageId}
                placeholder="0x..."
                spellcheck="false"
            />
        </label>
        <label>
            Registry object ID (shared)
            <input
                bind:value={$onChainAppsConfig.registryId}
                placeholder="0x..."
                spellcheck="false"
            />
        </label>
        <label>
            Generic storage object ID (shared)
            <input
                bind:value={$onChainAppsConfig.storageId}
                placeholder="0x..."
                spellcheck="false"
            />
        </label>
    </details>

    {#if statusMessage}
        <div class="status" class:error={statusIsError}>{statusMessage}</div>
    {/if}

    {#if showPublish}
        <section class="panel publish-panel">
            <h3>Publish an app</h3>
            <label>
                Name <input bind:value={publishName} placeholder="my cover game" />
            </label>
            <label>
                Description
                <textarea
                    bind:value={publishDescription}
                    rows="2"
                    placeholder="Short description shown in the list"
                ></textarea>
            </label>
            <label>
                Content type
                <input bind:value={publishContentType} />
            </label>
            <label>
                Load HTML from file (optional)
                <input type="file" accept=".html,.htm,text/html" onchange={onFileSelected} />
            </label>
            <label>
                HTML payload
                <textarea bind:value={publishHtml} rows="12" spellcheck="false"></textarea>
            </label>
            <div class="kv">
                <button onclick={publishApp} disabled={publishing}>
                    {publishing ? 'Publishing...' : 'Publish to devnet'}
                </button>
                {#if publishResultUrl}
                    <a href={publishResultUrl}>{publishResultUrl}</a>
                {/if}
            </div>

            <details class="skill-docs">
                <summary>App development guide (SKILL.md)</summary>
                <pre class="skill-pre">{skillMd}</pre>
            </details>
        </section>
    {/if}

    {#if selectedApp}
        <section class="panel viewer">
            <div class="viewer-header">
                <div>
                    <h3>{selectedApp.name}</h3>
                    <p class="muted">{selectedApp.description || ''}</p>
                    <p class="app-meta">
                        <span>v{selectedApp.appVersion}</span>
                        <span>pkg v{selectedApp.packageVersion}</span>
                        <span
                            >{selectedApp.chunkCount} chunks ({formatSize(
                                selectedApp.totalSize,
                            )})</span
                        >
                        <span>published {formatDate(selectedApp.publishedAtMs)}</span>
                        <span>last update {formatDate(selectedApp.updatedAtMs)}</span>
                        <span>by <code class="address-code">{selectedApp.publisher}</code></span>
                    </p>
                </div>
                <div class="viewer-actions">
                    <button onclick={copyShareLink}>Copy share link</button>
                    <button onclick={() => { appMaximized = !appMaximized; if (appMaximized) { window.scrollTo(0, 0); document.body.classList.add('app-maximized'); } else { document.body.classList.remove('app-maximized'); } }}>
                        {appMaximized ? '↙ Minimize' : '↗ Maximize'}
                    </button>
                    <button onclick={closeApp}>← Back to list</button>
                </div>
            </div>
            {#if loadingApp}
                <p>Loading app bytes...</p>
            {:else if iframeSrcDoc}
                {#if appMaximized}
                    <button
                        class="maximize-exit-btn"
                        onclick={() => { appMaximized = false; document.body.classList.remove('app-maximized'); }}
                        title="Exit fullscreen (Esc)"
                    >
                        ✕
                    </button>
                {/if}
                <iframe
                    bind:this={iframeEl}
                    title={selectedApp.name}
                    srcdoc={iframeSrcDoc}
                    sandbox="allow-scripts"
                    referrerpolicy="no-referrer"
                    class:iframe-maximized={appMaximized}
                    style="height: {appMaximized ? '100%' : iframeHeight + 'px'}"
                ></iframe>
            {/if}
        </section>
    {:else if updateTarget && updateTarget.app}
        <section class="panel update-panel">
            <h3>Update {updateTarget.app.name}</h3>
            <p class="muted">
                Current on-chain version: v{updateTarget.app.appVersion}. Publishing will bump it to
                v{updateTarget.app.appVersion + 1}. The shared object id (<code
                    >{updateTarget.app.id}</code
                >) stays the same, so existing share links keep working.
            </p>
            <label>
                Name <input bind:value={updateName} />
            </label>
            <label>
                Description
                <textarea bind:value={updateDescription} rows="2"></textarea>
            </label>
            <label>
                Content type
                <input bind:value={updateContentType} />
            </label>
            <label>
                Replace HTML from file (optional)
                <input type="file" accept=".html,.htm,text/html" onchange={onUpdateFileSelected} />
            </label>
            <label>
                HTML payload
                <textarea bind:value={updateHtml} rows="12" spellcheck="false"></textarea>
            </label>
            <div class="kv">
                <button onclick={submitUpdate} disabled={updating}>
                    {updating ? 'Updating...' : 'Publish new version'}
                </button>
                <button onclick={cancelUpdate} disabled={updating}>Cancel</button>
            </div>
        </section>
    {:else}
        <section class="panel">
            <h3>Published apps ({apps.length})</h3>
            {#if loadError}
                <div class="error-block">{loadError}</div>
            {/if}
            {#if loadingList}
                <p>Loading...</p>
            {:else if apps.length === 0 && !loadError}
                <p class="muted">
                    Nothing published yet. Use <em>+ Publish new app</em> above to upload your first app.
                </p>
            {:else}
                {#snippet appCard(app: AppMetadata)}
                    {@const initials = app.name.trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('') || '?'}
                    {@const hue = [...app.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0) % 360}
                    <li>
                        <div class="app-card" onclick={() => openApp(app.id)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openApp(app.id)}>
                            <div class="app-card-top">
                                <div class="app-avatar" style="--hue:{hue}">{initials}</div>
                                <div class="app-card-title">
                                    <div class="app-name">{app.name}</div>
                                    <div class="app-size">{formatSize(app.totalSize)}</div>
                                </div>
                                <button
                                    class="star-btn"
                                    class:starred={starred.has(app.id)}
                                    onclick={(e) => toggleStar(app.id, e)}
                                    title={starred.has(app.id) ? 'Unstar' : 'Star'}
                                    aria-label={starred.has(app.id) ? 'Unstar' : 'Star'}
                                >★</button>
                            </div>
                            {#if app.description}
                                <div class="app-desc">{app.description}</div>
                            {/if}
                            <div class="app-card-footer">
                                <span class="app-date">{formatDate(app.publishedAtMs)}</span>
                                <span class="app-id-short" title={app.id}>{app.id.slice(0, 6)}…{app.id.slice(-4)}</span>
                            </div>
                        </div>
                    </li>
                {/snippet}

                {#if sortedApps.pinned.length > 0}
                    <ul class="apps">
                        {#each sortedApps.pinned as app (app.id)}
                            {@render appCard(app)}
                        {/each}
                    </ul>
                    {#if sortedApps.rest.length > 0}
                        <div class="apps-divider"></div>
                        <ul class="apps">
                            {#each sortedApps.rest as app (app.id)}
                                {@render appCard(app)}
                            {/each}
                        </ul>
                    {/if}
                {:else}
                    <ul class="apps">
                        {#each sortedApps.rest as app (app.id)}
                            {@render appCard(app)}
                        {/each}
                    </ul>
                {/if}
            {/if}
        </section>

        <section class="panel my-apps-panel">
            <div class="my-apps-header">
                <h3>My apps ({myApps.length})</h3>
                <button onclick={refreshMyApps} disabled={loadingMyApps}>
                    {loadingMyApps ? 'Loading...' : '↻ Refresh'}
                </button>
            </div>
            <p class="muted">
                Every <code>AppCap</code> owned by your random signer address. Selecting one lets
                you publish a new <em>app_version</em> - viewers load the app via its shared object id,
                so they get the updated payload automatically on their next visit.
            </p>
            {#if myAppsError}
                <div class="error-block">{myAppsError}</div>
            {/if}
            {#if myApps.length === 0 && !loadingMyApps}
                <p class="muted">
                    No apps published from this address yet. After publishing, the upgrade
                    capabilities will appear here.
                </p>
            {:else}
                <ul class="apps">
                    {#each myApps as owned (owned.capId)}
                        <li>
                            <div class="app-card">
                                {#if owned.app}
                                    <div class="app-name">{owned.app.name}</div>
                                    <div class="app-desc">{owned.app.description || '—'}</div>
                                    <div class="app-meta">
                                        <span>v{owned.app.appVersion}</span>
                                        <span>pkg v{owned.app.packageVersion}</span>
                                        <span
                                            >{owned.app.chunkCount} chunks · {formatSize(
                                                owned.app.totalSize,
                                            )}</span
                                        >
                                        <span>updated {formatDate(owned.app.updatedAtMs)}</span>
                                    </div>
                                {:else}
                                    <div class="app-name">— stale cap —</div>
                                    <div class="app-desc muted">
                                        App object not found (deleted?). Cap id preserved for
                                        reference.
                                    </div>
                                {/if}
                                <div class="app-id">app {owned.appId}</div>
                                <div class="app-id">cap {owned.capId}</div>
                                <div class="kv">
                                    <button
                                        onclick={() => openApp(owned.appId)}
                                        disabled={!owned.app}
                                    >
                                        Open
                                    </button>
                                    <button
                                        onclick={() => startUpdate(owned)}
                                        disabled={!owned.app}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/if}

    <details class="panel key-panel">
        <summary>Sandbox signer</summary>
        <p class="muted">
            A random Ed25519 key is used for every tx this page signs. It is kept in your browser's
            <code>localStorage</code>. Devnet only.
        </p>
        <div class="key-info">
            <div class="key-row">
                <strong>Network:</strong> {$sharedClientConfig.selected}
            </div>
            <div class="key-row">
                <strong>Address:</strong> <code class="address-code">{randomKey.address}</code>
            </div>
            {#if signerBalance}
                <div class="key-row">
                    <strong>Balance:</strong> {signerBalance}
                </div>
            {/if}
        </div>
        <div class="kv">
            <button onclick={rotateKey}>Generate new random key</button>
            <button onclick={requestFromFaucet}>Request devnet IOTA from faucet</button>
            <a
                href={`${getSelectedNetworkConfig().explorer}/address/${randomKey.address}?network=${$sharedClientConfig.selected}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                View in explorer ↗
            </a>
        </div>
    </details>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 1100px;
        margin: 0 auto;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .top-actions {
        display: flex;
        gap: 0.5rem;
    }

    .subtitle {
        margin: 0;
        color: rgba(255, 255, 255, 0.7);
    }

    .panel {
        padding: 1rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 8px;
        background: rgba(55, 65, 81, 0.15);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .panel h3 {
        margin: 0 0 0.25rem 0;
    }

    details.panel > summary {
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        list-style: revert;
    }

    details.panel > summary:hover {
        color: rgba(255, 255, 255, 0.9);
    }

    details.panel[open] > summary {
        margin-bottom: 0.5rem;
    }

    .muted {
        color: rgba(255, 255, 255, 0.65);
        font-size: 0.9rem;
        margin: 0;
    }

    .kv {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
    }

    input:not([type]),
    textarea {
        font-family: inherit;
        padding: 0.4rem 0.5rem;
        border-radius: 4px;
        border: 1px solid rgba(156, 163, 175, 0.4);
        background: rgba(0, 0, 0, 0.25);
        color: inherit;
        font-size: 0.9rem;
    }

    textarea {
        font-family: ui-monospace, Menlo, Consolas, monospace;
    }

    button {
        padding: 0.4rem 0.75rem;
        border-radius: 4px;
        border: 1px solid rgba(156, 163, 175, 0.4);
        background: rgba(55, 65, 81, 0.5);
        color: inherit;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .apps {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 0.75rem;
    }

    .app-card {
        width: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        transition: background 0.15s, border-color 0.15s, transform 0.15s;
        cursor: pointer;
    }

    .app-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    .app-card-top {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .app-avatar {
        flex-shrink: 0;
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.95rem;
        font-weight: 800;
        background: hsl(var(--hue), 55%, 18%);
        border: 1px solid hsl(var(--hue), 55%, 30%);
        color: hsl(var(--hue), 80%, 72%);
        letter-spacing: -0.5px;
    }

    .app-card-title {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .app-name {
        font-weight: 700;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .app-size {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.4);
    }

    .star-btn {
        flex-shrink: 0;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        line-height: 1;
        padding: 2px 4px;
        color: rgba(255, 255, 255, 0.18);
        transition: color 0.15s, transform 0.12s;
        border-radius: 4px;
    }

    .star-btn:hover {
        color: #facc15;
        transform: scale(1.15);
    }

    .star-btn.starred {
        color: #facc15;
    }

    .apps-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.07);
        margin: 0.25rem 0;
    }

    .app-desc {
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.55);
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .app-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.4rem;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .app-date {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.35);
    }

    .app-id-short {
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.25);
    }

    .skill-docs {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 0.75rem;
        margin-top: 0.25rem;
    }

    .skill-docs > summary {
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.55);
        list-style: revert;
        user-select: none;
    }

    .skill-docs > summary:hover {
        color: rgba(255, 255, 255, 0.85);
    }

    .skill-pre {
        margin-top: 0.75rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 8px;
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-size: 0.78rem;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
        color: rgba(255, 255, 255, 0.75);
        max-height: 600px;
        overflow-y: auto;
    }

    .key-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .key-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        align-items: baseline;
    }

    .address-code {
        word-break: break-all;
        font-size: 0.8rem;
    }

    .viewer-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .my-apps-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
    }

    .viewer-actions {
        display: flex;
        gap: 0.5rem;
    }

    iframe {
        width: 100%;
        min-height: 200px;
        border: 1px solid rgba(156, 163, 175, 0.3);
        border-radius: 6px;
        background: white;
    }

    iframe.iframe-maximized {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh !important;
        min-height: 100vh;
        border: none;
        border-radius: 0;
        z-index: 9999;
    }

    /* Prevent body scroll when app is maximized. Applied via JS. */
    :global(body.app-maximized) {
        overflow: hidden !important;
    }

    .maximize-exit-btn {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 10000;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        transition: opacity 0.2s;
        opacity: 0.7;
    }

    .maximize-exit-btn:hover {
        opacity: 1;
    }

    .status {
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        background: rgba(59, 130, 246, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.4);
        font-size: 0.9rem;
    }

    .status.error {
        background: rgba(220, 38, 38, 0.15);
        border-color: rgba(220, 38, 38, 0.4);
    }

    .error-block {
        color: #fecaca;
        background: rgba(220, 38, 38, 0.15);
        padding: 0.5rem;
        border-radius: 4px;
    }
</style>

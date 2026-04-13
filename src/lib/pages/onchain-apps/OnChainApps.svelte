<script lang="ts" module>
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
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
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

    // --- effects ---

    // Make sure the user is on devnet by default so the app stays isolated
    // from real funds and transactions.
    onMount(() => {
        if ($sharedClientConfig.selected !== 'devnet') {
            sharedClientConfig.update((cfg) => ({ ...cfg, selected: 'devnet' }));
        }
        refreshList();
        refreshMyApps();
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
            return () => window.removeEventListener('message', handler.handleMessage);
        }
    });

    onDestroy(() => {
        // nothing; the effect returns its own cleanup
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
            const bytes = await fetchAppContent(client, app);
            selectedAppContent = bytes;
            const html = new TextDecoder().decode(bytes);
            iframeSrcDoc = wrapAppHtml(html);
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
        updatePageQueryParams({ appId: null });
    }

    // --- bridge request handler ---

    async function onBridgeRequest(method: BridgeMethod, args: any): Promise<any> {
        const client = getClient();
        const appId = selectedApp?.id ?? '';
        switch (method) {
            case 'getAddress':
                return randomKey.address;
            case 'getNetwork':
                return $sharedClientConfig.selected;
            case 'getAppId':
                return appId;
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

    // --- actions: key / faucet ---

    function rotateKey() {
        const ok = confirm(
            'Generating a new random key will drop the current one (along with whatever devnet IOTA it holds). Continue?',
        );
        if (!ok) return;
        randomKey = generateAndStoreRandomKey();
        void refreshMyApps();
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
            setStatus(`Requested funds from ${faucetUrl} for ${randomKey.address}.`);
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

    <section class="panel key-panel">
        <h3>Sandbox signer</h3>
        <p class="muted">
            A random Ed25519 key is used for every tx this page signs. It is kept in your browser's
            <code>localStorage</code>. Fund it from the faucet before publishing or interacting with
            apps. Devnet only - never paste a real-value key here.
        </p>
        <div class="kv">
            <span><strong>Network:</strong> {$sharedClientConfig.selected}</span>
            <span><strong>Address:</strong> <code>{randomKey.address}</code></span>
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
    </section>

    <section class="panel config-panel">
        <h3>Package configuration</h3>
        <p class="muted">
            Deploy the <code>onchain_apps</code> Move package (see <code>move/onchain_apps/</code> in
            the repo) and paste the resulting ids here. They are saved in your browser.
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
    </section>

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
                        <span>by <code>{selectedApp.publisher}</code></span>
                    </p>
                </div>
                <div class="viewer-actions">
                    <button onclick={copyShareLink}>Copy share link</button>
                    <button onclick={closeApp}>← Back to list</button>
                </div>
            </div>
            {#if loadingApp}
                <p>Loading app bytes...</p>
            {:else if iframeSrcDoc}
                <iframe
                    bind:this={iframeEl}
                    title={selectedApp.name}
                    srcdoc={iframeSrcDoc}
                    sandbox="allow-scripts"
                    referrerpolicy="no-referrer"
                    style="height: {iframeHeight}px"
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
                <ul class="apps">
                    {#each apps as app (app.id)}
                        <li>
                            <button class="app-card" onclick={() => openApp(app.id)}>
                                <div class="app-name">{app.name}</div>
                                <div class="app-desc">{app.description || '—'}</div>
                                <div class="app-meta">
                                    <span>v{app.appVersion} · pkg v{app.packageVersion}</span>
                                    <span
                                        >{app.chunkCount} chunks · {formatSize(app.totalSize)}</span
                                    >
                                    <span>{formatDate(app.publishedAtMs)}</span>
                                </div>
                                <div class="app-id">{app.id}</div>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/if}
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
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.75rem;
    }

    .app-card {
        width: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.75rem;
    }

    .app-name {
        font-weight: 600;
    }

    .app-desc {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.75);
        min-height: 2em;
    }

    .app-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.55);
    }

    .app-id {
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-size: 0.7rem;
        word-break: break-all;
        color: rgba(255, 255, 255, 0.55);
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

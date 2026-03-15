<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import { getClient, getSelectedNetworkConfig } from '../utils/client';
    import { getTransactionLink } from '../utils/explorer-links';
    import {
        base64Decode as fromBase64,
        signedTransactionFromBcs,
        transactionEffectsToJson,
        transactionFromBcs,
    } from '../utils/wasm-sdk';
    import {
        formatJsonWithCompactArrays,
        getTransactionData,
        isTransactionData,
    } from './transaction-view';
    import TransactionCommands from './TransactionCommands.svelte';
    import TransactionEffects from './TransactionEffects.svelte';
    import TransactionSignatures from './TransactionSignatures.svelte';

    let { value = $bindable(), showTypeInfo = true, shortPackageIds = true } = $props();

    let viewMode = $state(
        new URLSearchParams(window.location.hash.split('?')[1] || '').get('view') || 'formatted',
    );
    let prevViewMode = $state('formatted');
    let commandIndex = $state(
        parseInt(
            new URLSearchParams(window.location.hash.split('?')[1] || '').get('commandIndex') || '',
        ) || null,
    );
    let hidden = $derived(
        !value || (typeof value === 'object' && !Object.keys(value || {}).length),
    );
    let isDryRunning = $state(false);
    let dryRunError = $state('');

    function isValidTxBytes(str: string): boolean {
        try {
            const raw = fromBase64(str);
            const arr = new Uint8Array(raw);
            // Try multiple BCS parse strategies (same as decodeBcsToDecodedBCS)
            const attempts = [
                () => {
                    const s = signedTransactionFromBcs(arr.slice(4).buffer as ArrayBuffer);
                    s.transaction.asV1();
                },
                () => {
                    const s = signedTransactionFromBcs(arr.buffer as ArrayBuffer);
                    s.transaction.asV1();
                },
                () => {
                    const t = transactionFromBcs(arr.slice(4).buffer as ArrayBuffer);
                    t.asV1();
                },
                () => {
                    const t = transactionFromBcs(arr.buffer as ArrayBuffer);
                    t.asV1();
                },
            ];
            for (const attempt of attempts) {
                try {
                    attempt();
                    return true;
                } catch {}
            }
            return false;
        } catch {
            return false;
        }
    }

    let hasTxBytes = $derived(
        value &&
            ((typeof value === 'string' && isValidTxBytes(value)) ||
                (typeof value === 'object' &&
                    (('transactionBytes' in value && value.transactionBytes) ||
                        ('rawTransaction' in value && value.rawTransaction) ||
                        ('bytes' in value && value.bytes) ||
                        isTransactionData(value)))),
    );

    // Derived values for transaction bytes display
    let signedTxBytes = $derived(value?.rawTransaction || '');
    let unsignedTxBytes = $derived(value?.transactionBytes || value?.bytes || '');
    let txBytes = $derived(
        unsignedTxBytes || signedTxBytes || (typeof value === 'string' ? value : ''),
    );

    let hasDryRunResults = $derived(
        value && typeof value === 'object' && 'effects' in value && value.effects,
    );

    let isDryRunResult = $derived(
        value &&
            typeof value === 'object' &&
            'effects' in value &&
            !('transactionBytes' in value || 'rawTransaction' in value || 'bytes' in value),
    );

    let transactionData = $derived(getTransactionData(value));

    const RAW_TX_EXCLUDED_FIELDS = new Set([
        'effects',
        'decodedBCS',
        'transactionBytes',
        'bytes',
        'rawTransaction',
        'isDryRun',
        'originalDigest',
        'webWalletResponse',
        'transactionData',
        'objectChanges',
        'balanceChanges',
        'events',
    ]);

    let rawTxJsonData = $derived(
        transactionData
            ? Object.fromEntries(
                  Object.entries(transactionData).filter(([k]) => !RAW_TX_EXCLUDED_FIELDS.has(k)),
              )
            : null,
    );

    // Check if transaction has signatures
    let hasSignatures = $derived(
        transactionData?.signatures &&
            Array.isArray(transactionData.signatures) &&
            transactionData.signatures.length > 0,
    );

    $effect(() => {
        if (value) {
            const isTxData = isTransactionData(value);
            const hasBytes = hasTxBytes;
            const hasSigs = hasSignatures;

            // Define valid modes
            const validModes = isTxData
                ? ['formatted', 'commands', 'json', 'rawtxjson', 'tree']
                : ['json', 'tree'];
            if (hasBytes) validModes.push('txbytes');
            if (hasSigs) validModes.push('signatures');

            // If current viewMode is not valid for this data, set default
            if (!validModes.includes(viewMode)) {
                viewMode = isTxData ? 'formatted' : 'json';
            }

            // Update prevViewMode if it's not valid
            if (!validModes.includes(prevViewMode)) {
                prevViewMode = viewMode;
            }

            dryRunError = ''; // clear any previous errors
        }
    });

    $effect(() => {
        const hashParts = window.location.hash.split('?');
        const path = hashParts[0];
        const params = new URLSearchParams(hashParts[1] || '');
        const currentView = params.get('view');
        const currentCommandIndex = params.get('commandIndex');
        const newCommandIndex = commandIndex !== null ? commandIndex.toString() : null;
        if (currentView !== viewMode || currentCommandIndex !== newCommandIndex) {
            params.set('view', viewMode);
            if (commandIndex !== null) {
                params.set('commandIndex', commandIndex.toString());
            } else {
                params.delete('commandIndex');
            }
            window.location.hash = path + '?' + params.toString();
        }
    });

    function parseTxFromBytes(base64Str: string) {
        const raw = fromBase64(base64Str);
        const arr = new Uint8Array(raw);
        const strategies: Array<{ offset: number; method: 'signed' | 'transaction' }> = [
            { offset: 4, method: 'signed' },
            { offset: 0, method: 'signed' },
            { offset: 4, method: 'transaction' },
            { offset: 0, method: 'transaction' },
            { offset: 1, method: 'signed' },
        ];
        for (const { offset, method } of strategies) {
            try {
                const sliced = arr.slice(offset);
                if (method === 'signed') {
                    return signedTransactionFromBcs(sliced.buffer as ArrayBuffer).transaction;
                } else {
                    return transactionFromBcs(sliced.buffer as ArrayBuffer);
                }
            } catch {}
        }
        throw new Error('Failed to parse transaction bytes');
    }

    async function performDryRun() {
        if (!hasTxBytes || isDryRunning) return;

        try {
            isDryRunning = true;
            const client = getClient(true);

            const txObj = parseTxFromBytes(txBytes);
            const dryRunResult = await client.dryRunTx(txObj, false);

            // Serialize WASM effects object to plain JSON
            let effectsJson: any = null;
            if (dryRunResult.effects) {
                try {
                    effectsJson = JSON.parse(transactionEffectsToJson(dryRunResult.effects));
                } catch (e) {
                    console.warn('Failed to serialize dry run effects:', e);
                }
            }

            // Build normalized result from DryRunResult
            const updatedData = {
                ...value,
                // Mark that this is from a dry run
                isDryRun: true,
                // Preserve any original metadata
                originalDigest: value.digest || value.transactionDigest,
                transactionBytes: txBytes,
                // Map dry run results
                devInspectResults: dryRunResult.results,
                ...(effectsJson ? { effects: effectsJson } : {}),
                ...(dryRunResult.error ? { dryRunError: dryRunResult.error } : {}),
            };

            value = updatedData;
        } catch (error) {
            console.error('Dry run failed:', error);
            dryRunError = `Dry run failed: ${error instanceof Error ? error.message : String(error)}`;
        } finally {
            isDryRunning = false;
        }
    }
</script>

{#if !hidden}
    <div class="transaction-view ultra-compact">
        {#if transactionData?.digest}
            <div class="header-line">
                <span class="tx-header">Transaction</span>
                <a
                    href={transactionData?.digest
                        ? getTransactionLink(getSelectedNetworkConfig(), transactionData.digest)
                        : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tx-id-short"
                    title={transactionData?.digest}
                >
                    {transactionData?.digest}
                </a>
            </div>
        {/if}
        <div class="view-controls">
            {#if isTransactionData(value)}
                <button
                    class:active={viewMode === 'formatted'}
                    onclick={() => {
                        viewMode = 'formatted';
                    }}
                >
                    Formatted View
                </button>
            {/if}
            {#if isTransactionData(value)}
                <button
                    class:active={viewMode === 'commands'}
                    onclick={() => {
                        viewMode = 'commands';
                    }}
                >
                    PTB Commands
                </button>
            {/if}
            <button
                class:active={viewMode === 'json'}
                onclick={() => {
                    viewMode = 'json';
                }}
            >
                Raw JSON
            </button>
            {#if isTransactionData(value)}
                <button
                    class:active={viewMode === 'rawtxjson'}
                    onclick={() => {
                        viewMode = 'rawtxjson';
                    }}
                >
                    Raw TX JSON
                </button>
            {/if}
            <button
                class:active={viewMode === 'tree'}
                onclick={() => {
                    viewMode = 'tree';
                }}
            >
                JSON Tree
            </button>

            {#if hasSignatures}
                <button
                    class:active={viewMode === 'signatures'}
                    onclick={() => {
                        viewMode = 'signatures';
                    }}
                >
                    Signatures
                </button>
            {/if}

            {#if hasTxBytes && !isDryRunResult}
                <button
                    class:active={viewMode === 'txbytes'}
                    onclick={() => {
                        if (viewMode === 'txbytes') {
                            viewMode = prevViewMode;
                        } else {
                            prevViewMode = viewMode;
                            viewMode = 'txbytes';
                        }
                    }}
                >
                    Tx Bytes
                </button>
            {/if}
            {#if hasTxBytes && !isDryRunResult}
                <button disabled={isDryRunning} onclick={performDryRun}>
                    {isDryRunning ? 'Running...' : hasDryRunResults ? 'Re-run Dry' : 'Dry Run'}
                </button>
            {/if}
            <button class="close-btn" style="margin-left: auto;" onclick={() => (value = null)}>
                ×
            </button>
        </div>

        {#if dryRunError}
            <div class="error-message">
                {dryRunError}
                <button onclick={() => (dryRunError = '')}>×</button>
            </div>
        {/if}

        {#if viewMode === 'txbytes' && hasTxBytes}
            <div class="tx-bytes-view">
                {#if unsignedTxBytes}
                    <div class="tx-bytes-section">
                        <div class="tx-bytes-header">
                            <strong>Unsigned Transaction (TransactionData)</strong>
                            <button
                                class="copy-btn"
                                onclick={() => navigator.clipboard.writeText(unsignedTxBytes)}
                            >
                                Copy
                            </button>
                        </div>
                        <pre class="wrap-bytes">{unsignedTxBytes}</pre>
                    </div>
                {:else if txBytes && !signedTxBytes}
                    <div class="tx-bytes-section">
                        <div class="tx-bytes-header">
                            <strong>Transaction Bytes</strong>
                            <button
                                class="copy-btn"
                                onclick={() => navigator.clipboard.writeText(txBytes)}
                            >
                                Copy
                            </button>
                        </div>
                        <pre class="wrap-bytes">{txBytes}</pre>
                    </div>
                {/if}
                {#if transactionData?.signatures && Array.isArray(transactionData.signatures) && transactionData.signatures.length > 0}
                    <div class="tx-bytes-section">
                        <div class="tx-bytes-header">
                            <strong
                                >Signature{transactionData.signatures.length > 1 ? 's' : ''} ({transactionData
                                    .signatures.length})</strong
                            >
                            <button
                                class="copy-btn"
                                onclick={() =>
                                    navigator.clipboard.writeText(
                                        transactionData.signatures.join('\n'),
                                    )}
                            >
                                Copy All
                            </button>
                        </div>
                        {#each transactionData.signatures as sig, i}
                            <div class="signature-item">
                                {#if transactionData.signatures.length > 1}
                                    <span class="signature-label">#{i + 1}</span>
                                {/if}
                                <pre class="wrap-bytes">{sig}</pre>
                            </div>
                        {/each}
                    </div>
                {/if}
                {#if signedTxBytes}
                    <div class="tx-bytes-section">
                        <div class="tx-bytes-header">
                            <strong>Signed Transaction (SenderSignedData)</strong>
                            <button
                                class="copy-btn"
                                onclick={() => navigator.clipboard.writeText(signedTxBytes)}
                            >
                                Copy
                            </button>
                        </div>
                        <pre class="wrap-bytes">{signedTxBytes}</pre>
                    </div>
                {/if}
            </div>
        {:else if viewMode === 'signatures' && hasSignatures}
            <div class="signatures-view">
                <TransactionSignatures signatures={transactionData.signatures} {transactionData} />
            </div>
        {:else if viewMode === 'formatted' && isTransactionData(value)}
            <div class="formatted-view">
                <TransactionEffects transactionData={getTransactionData(value)} />
            </div>
        {:else if viewMode === 'tree'}
            <div class="tree-view">
                <div class="json-view-header">
                    <button
                        class="copy-btn"
                        onclick={() =>
                            navigator.clipboard.writeText(
                                formatJsonWithCompactArrays(
                                    isTransactionData(value) ? transactionData : value,
                                ),
                            )}
                    >
                        Copy
                    </button>
                </div>
                <JSONTree
                    value={isTransactionData(value) ? transactionData : value}
                    defaultExpandedLevel={1}
                />
            </div>
        {:else if viewMode === 'commands'}
            <div class="commands-view-container">
                <TransactionCommands
                    transactionData={getTransactionData(value)}
                    {commandIndex}
                    onCommandIndexChange={(i: number) => (commandIndex = i)}
                    {showTypeInfo}
                    {shortPackageIds}
                />
            </div>
        {:else if viewMode === 'rawtxjson' && isTransactionData(value)}
            <div class="json-view">
                <div class="json-view-header">
                    <button
                        class="copy-btn"
                        onclick={() =>
                            navigator.clipboard.writeText(
                                formatJsonWithCompactArrays(rawTxJsonData),
                            )}
                    >
                        Copy
                    </button>
                </div>
                <pre>{formatJsonWithCompactArrays(rawTxJsonData)}</pre>
            </div>
        {:else}
            <div class="json-view">
                <div class="json-view-header">
                    <button
                        class="copy-btn"
                        onclick={() =>
                            navigator.clipboard.writeText(
                                formatJsonWithCompactArrays(
                                    isTransactionData(value) ? transactionData : value,
                                ),
                            )}
                    >
                        Copy
                    </button>
                </div>
                <pre>{formatJsonWithCompactArrays(
                        isTransactionData(value) ? transactionData : value,
                    )}</pre>
            </div>
        {/if}
    </div>
{/if}

<style>
    .transaction-view {
        text-align: left;
        word-break: break-all;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .view-controls {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
        margin-bottom: 0;
    }

    .view-controls button {
        padding: 0.4rem 0.6rem;
        font-size: 0.85rem;
        border-radius: 4px;
    }

    .view-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .view-controls button.active {
        background: var(--primary-color);
        color: white;
    }

    .view-controls .close-btn {
        background: #911a26;
        color: white;
        border: none;
        border-radius: 4px;
        width: 1.6rem;
        height: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .view-controls .close-btn:hover {
        background: #6e0e18;
    }

    .error-message {
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
    }

    .error-message button {
        background: none;
        border: none;
        color: #c33;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        margin-left: 0.5rem;
    }

    .formatted-view {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .json-view-header {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 0.2rem;
    }

    .json-view .copy-btn,
    .tree-view .copy-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.3rem 0.7rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .json-view .copy-btn:hover,
    .tree-view .copy-btn:hover {
        background: var(--primary-color-dark, #005fa3);
    }

    .json-view pre {
        margin: 0;
        background: var(--background-light);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        overflow-x: auto;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.85);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
    }

    .tree-view {
        background: var(--background-light);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }

    .commands-view-container {
        background: var(--background-light);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }

    .tx-bytes-view {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .tx-bytes-section {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .tx-bytes-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .signature-item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
    }
    .signature-item .signature-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        min-width: 1.5rem;
        padding-top: 0.75rem;
    }
    .signature-item .wrap-bytes {
        flex: 1;
    }
    .tx-bytes-view .copy-btn {
        align-self: flex-start;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.3rem 0.7rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    .tx-bytes-view .copy-btn:hover {
        background: var(--primary-color-dark, #005fa3);
    }
    .tx-bytes-view .wrap-bytes {
        background: var(--background-light);
        padding: 0.75rem;
        border-radius: 6px;

        border: 1px solid var(--border-color);
        font-size: 0.75rem;
        color: #ffb86c;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        white-space: pre-wrap;
        word-break: break-all;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 60vh;
    }

    .header-line {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.375rem;
        background: var(--background-light);
        border-radius: 6px;
        border: 1px solid var(--border-color);
        font-weight: 600;
        margin-bottom: 10px;
    }

    .tx-header {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
    }

    .tx-id-short {
        font-family: 'JetBrains Mono', monospace;
        background: rgba(0, 0, 0, 0.3);
        padding: 3px 6px;
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.85rem;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .tx-id-short:hover {
        background: rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        text-decoration: underline;
    }
</style>

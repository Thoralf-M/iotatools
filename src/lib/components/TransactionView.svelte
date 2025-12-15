<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import { getClient } from '../lib/client';
    import {
        formatJsonWithCompactArrays,
        getTransactionData,
        isTransactionData,
    } from '../lib/transaction-view';
    import TransactionCommands from './TransactionCommands.svelte';
    import TransactionEffects from './TransactionEffects.svelte';

    let { value = $bindable() } = $props();

    let viewMode = $state('formatted');
    let showTxBytes = $state(false);
    let prevViewMode = $state('formatted');
    let hidden = $derived(!value || !Object.keys(value || {}).length);
    let isDryRunning = $state(false);
    let dryRunError = $state('');

    let hasTxBytes = $derived(
        value && typeof value === 'object' && 'transactionBytes' in value && value.transactionBytes,
    );

    let hasDryRunResults = $derived(
        value && typeof value === 'object' && 'effects' in value && value.effects,
    );

    $effect(() => {
        if (value) {
            // If the data is transaction data, use formatted view, otherwise use json view
            if (isTransactionData(value)) {
                viewMode = 'formatted';
                prevViewMode = 'formatted';
            } else {
                viewMode = 'json';
                prevViewMode = 'json';
            }
            showTxBytes = false; // reset when value changes
            dryRunError = ''; // clear any previous errors
        }
    });

    $effect(() => {
        if (showTxBytes) {
            if (viewMode !== 'txbytes') {
                prevViewMode = viewMode;
                viewMode = 'txbytes';
            }
        } else if (viewMode === 'txbytes') {
            viewMode = prevViewMode;
        }
    });

    async function performDryRun() {
        if (!hasTxBytes || isDryRunning) return;

        try {
            isDryRunning = true;
            const client = getClient();
            const txBytes = value.transactionBytes;

            const dryRunResult = await client.dryRunTransactionBlock({
                transactionBlock: txBytes,
            });

            // Update the transaction data with dry run effects
            // Dry run returns the same structure as a regular transaction response
            // We want to merge the effects and other dry run data while preserving original metadata
            const updatedData = {
                ...value,
                ...dryRunResult,
                // Keep the original transactionBytes
                transactionBytes: txBytes,
                // Mark that this is from a dry run
                isDryRun: true,
                // Preserve any original metadata that might be important
                originalDigest: value.digest || value.transactionDigest,
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
        <div class="view-controls">
            {#if isTransactionData(value)}
                <button
                    class:active={viewMode === 'formatted'}
                    onclick={() => {
                        showTxBytes = false;
                        viewMode = 'formatted';
                    }}
                >
                    Formatted View
                </button>
            {/if}
            <button
                class:active={viewMode === 'json'}
                onclick={() => {
                    showTxBytes = false;
                    viewMode = 'json';
                }}
            >
                Raw JSON
            </button>
            <button
                class:active={viewMode === 'tree'}
                onclick={() => {
                    showTxBytes = false;
                    viewMode = 'tree';
                }}
            >
                JSON Tree
            </button>
            {#if isTransactionData(value)}
                <button
                    class:active={viewMode === 'commands'}
                    onclick={() => {
                        showTxBytes = false;
                        viewMode = 'commands';
                    }}
                >
                    PTB Commands
                </button>
            {/if}
            {#if hasTxBytes}
                <button
                    class:active={showTxBytes}
                    onclick={() => {
                        showTxBytes = !showTxBytes;
                        if (!showTxBytes) {
                            // restore previous viewMode if leaving txbytes
                            viewMode = prevViewMode;
                        }
                    }}
                >
                    Tx Bytes
                </button>
            {/if}
            {#if hasTxBytes}
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

        {#if showTxBytes && hasTxBytes}
            <div class="tx-bytes-view">
                <button
                    class="copy-btn"
                    onclick={() => navigator.clipboard.writeText(value.transactionBytes)}
                >
                    Copy Bytes
                </button>
                <pre class="wrap-bytes">{value.transactionBytes}</pre>
            </div>
        {:else if viewMode === 'formatted' && isTransactionData(value)}
            <div class="formatted-view">
                <TransactionEffects transactionData={getTransactionData(value)} />
            </div>
        {:else if viewMode === 'tree'}
            <div class="tree-view">
                <JSONTree {value} defaultExpandedLevel={1} />
            </div>
        {:else if viewMode === 'commands'}
            <div class="commands-view-container">
                <TransactionCommands transactionData={getTransactionData(value)} />
            </div>
        {:else}
            <div class="json-view">
                <pre>{formatJsonWithCompactArrays(value)}</pre>
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

    .json-view pre {
        margin: 0;
        background: var(--background-light);
        backdrop-filter: blur(10px);
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
        backdrop-filter: blur(10px);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }

    .commands-view-container {
        background: var(--background-light);
        backdrop-filter: blur(10px);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }

    .tx-bytes-view {
        display: flex;
        flex-direction: column;
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
        backdrop-filter: blur(10px);
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
</style>

<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import {
        formatJsonWithCompactArrays,
        getTransactionData,
        isTransactionData,
    } from '../lib/transaction-view';
    import TransactionEffects from './TransactionEffects.svelte';

    let { value = $bindable() } = $props();

    let viewMode = $state('formatted');
    let showTxBytes = $state(false);
    let prevViewMode = $state('formatted');
    let hidden = $derived(!value || !Object.keys(value || {}).length);

    let hasTxBytes = $derived(
        value && typeof value === 'object' && 'transactionBytes' in value && value.transactionBytes,
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
            <button class="close-btn" style="margin-left: auto;" onclick={() => (value = null)}>
                ×
            </button>
        </div>

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

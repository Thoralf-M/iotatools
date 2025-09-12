<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import {
        formatJsonWithCompactArrays,
        getTransactionData,
        isTransactionData,
        normalizeOwner,
    } from '../lib/transaction-view';
    import TransactionEffects from './TransactionEffects.svelte';

    export let value: any;

    let viewMode: 'formatted' | 'json' | 'tree' | 'txbytes' = 'formatted';
    let showTxBytes = false;
    let prevViewMode: 'formatted' | 'json' | 'tree' = 'formatted';

    // Set default view mode based on data type when value changes
    $: if (value) {
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

    $: if (showTxBytes) {
        if (viewMode !== 'txbytes') {
            prevViewMode = viewMode;
            viewMode = 'txbytes';
        }
    } else if (viewMode === 'txbytes') {
        viewMode = prevViewMode;
    }

    $: hasTxBytes =
        value && typeof value === 'object' && 'transactionBytes' in value && value.transactionBytes;
</script>

<div class="transaction-view ultra-compact" hidden={!value || Object.keys(value).length === 0}>
    <div class="view-controls">
        {#if isTransactionData(value)}
            <button
                class:active={viewMode === 'formatted'}
                on:click={() => {
                    showTxBytes = false;
                    viewMode = 'formatted';
                }}
            >
                Formatted View
            </button>
        {/if}
        <button
            class:active={viewMode === 'json'}
            on:click={() => {
                showTxBytes = false;
                viewMode = 'json';
            }}
        >
            Raw JSON
        </button>
        <button
            class:active={viewMode === 'tree'}
            on:click={() => {
                showTxBytes = false;
                viewMode = 'tree';
            }}
        >
            JSON Tree
        </button>
        {#if hasTxBytes}
            <button
                class:active={showTxBytes}
                on:click={() => {
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
    </div>

    {#if showTxBytes && hasTxBytes}
        <div class="tx-bytes-view">
            <button
                class="copy-btn"
                on:click={() => navigator.clipboard.writeText(value.transactionBytes)}
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

<style>
    .transaction-view {
        text-align: left;
        word-break: break-all;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }

    .view-controls {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
    }

    .view-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .view-controls button.active {
        background: var(--primary-color);
        color: white;
    }

    .formatted-view {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .json-view pre {
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

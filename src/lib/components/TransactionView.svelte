<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import TransactionEffects from './TransactionEffects.svelte';

    export let value: any;

    let viewMode: 'formatted' | 'json' | 'tree' = 'formatted';

    // Set default view mode based on data type, but only when value first loads
    $: if (value && viewMode === 'formatted') {
        // Only change viewMode if we're in the default state and data is not transaction data
        if (!isTransactionData(value)) {
            viewMode = 'json';
        }
    }

    function isTransactionData(data: any): boolean {
        return (
            data &&
            typeof data === 'object' &&
            (data.digest || data.effects || data.decodedBCS || (data.sender && data.timestamp))
        );
    }
</script>

<div class="transaction-view ultra-compact" hidden={!value || Object.keys(value).length === 0}>
    <div class="view-controls">
        <button
            class:active={viewMode === 'formatted'}
            on:click={() => (viewMode = 'formatted')}
            disabled={!isTransactionData(value)}
        >
            Formatted View
        </button>
        <button class:active={viewMode === 'json'} on:click={() => (viewMode = 'json')}>
            Raw JSON
        </button>
        <button class:active={viewMode === 'tree'} on:click={() => (viewMode = 'tree')}>
            JSON Tree
        </button>
    </div>

    {#if viewMode === 'formatted' && isTransactionData(value)}
        <div class="formatted-view">
            <TransactionEffects transactionData={value} />
        </div>
    {:else if viewMode === 'tree'}
        <div class="tree-view">
            <JSONTree {value} />
        </div>
    {:else}
        <div class="json-view">
            <pre>{JSON.stringify(value, null, 2)}</pre>
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
</style>

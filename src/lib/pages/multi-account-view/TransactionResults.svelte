<script lang="ts">
    import TransactionView from '../../components/TransactionView.svelte';

    interface Props {
        results: any[];
        getAccountDisplayName: (address: string) => string;
        title?: string;
    }

    let { results, getAccountDisplayName, title = 'Transfers' }: Props = $props();

    let currentResultIndex = $state(0);

    // Reset selection when the results array swaps or shrinks below the
    // current index — otherwise the tab pointer would stick on a stale slot.
    $effect(() => {
        if (results.length === 0) currentResultIndex = 0;
        else if (currentResultIndex >= results.length) currentResultIndex = 0;
    });
</script>

{#if results.length > 0}
    <div class="transactions-container">
        <div class="transactions-tabs">
            <span class="transactions-label">{title}({results.length}):</span>
            {#each results as result, i}
                {@const label = result.sender ? getAccountDisplayName(result.sender) : ''}
                <button
                    onclick={() => (currentResultIndex = i)}
                    class="transaction-tab {currentResultIndex === i ? 'active' : ''}"
                    title={result.sender ? `From ${result.sender}` : ''}
                >
                    {i + 1}
                    {#if label}(from: {label}){/if}
                </button>
            {/each}
        </div>
        <div class="transaction-content">
            <TransactionView value={results[currentResultIndex]} />
        </div>
    </div>
{/if}

<style>
    .transactions-container {
        margin-bottom: 0.5rem;
    }

    .transactions-tabs {
        display: flex;
        align-items: flex-end;
        gap: 0.25rem;
        flex-wrap: wrap;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0;
    }

    .transactions-label {
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 0.5rem 0.5rem 0;
        align-self: center;
    }

    .transaction-tab {
        padding: 0.4rem 0.75rem;
        border: 1px solid var(--border-color);
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-muted);
        cursor: pointer;
        position: relative;
        bottom: -1px;
        transition:
            background 0.15s,
            color 0.15s;
    }

    .transaction-tab:hover {
        background: rgba(255, 255, 255, 0.08);
        color: var(--text-color);
    }

    .transaction-tab.active {
        background: var(--background-card);
        color: white;
        font-weight: bold;
        border-color: var(--border-color);
        border-bottom: 1px solid var(--background-card);
    }

    .transaction-content {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 8px 8px;
        padding: 0.75rem;
    }
</style>

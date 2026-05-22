<script lang="ts">
    import { onDestroy } from 'svelte';

    import { fetchPruningCutoff, formatTimeAgo, type PruningCutoff } from '../utils/pruning-cutoff';
    import { queryAwareClientConfig } from '../utils/query-param-store';

    const REFRESH_MS = 60_000;

    let cutoff = $state<PruningCutoff | null>(null);
    let loading = $state(false);
    let error = $state<string | null>(null);
    let now = $state(Date.now());

    let abortController: AbortController | null = null;
    let refreshInterval: ReturnType<typeof setInterval> | null = null;
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    let currentNetwork = $state('');
    let currentIndexerUrl = '';

    async function load(indexerUrl: string) {
        if (abortController) abortController.abort();
        abortController = new AbortController();
        loading = true;
        try {
            const result = await fetchPruningCutoff(indexerUrl, abortController.signal);
            cutoff = result;
            error = null;
        } catch (e: any) {
            if (e?.name !== 'AbortError') {
                error = e?.message || String(e);
                cutoff = null;
            }
        } finally {
            loading = false;
        }
    }

    // React to network changes (also runs on first subscribe).
    const unsubscribe = queryAwareClientConfig.subscribe((config) => {
        const network = config.networks.find((n) => n.name === config.selected);
        if (!network) return;
        if (network.name === currentNetwork && network.indexer === currentIndexerUrl) return;
        currentNetwork = network.name;
        currentIndexerUrl = network.indexer;
        cutoff = null;
        error = null;
        load(network.indexer);

        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(() => load(currentIndexerUrl), REFRESH_MS);
    });

    // Re-render the relative-time label every 30s without re-fetching.
    tickInterval = setInterval(() => (now = Date.now()), 30_000);

    onDestroy(() => {
        unsubscribe();
        if (abortController) abortController.abort();
        if (refreshInterval) clearInterval(refreshInterval);
        if (tickInterval) clearInterval(tickInterval);
    });

    const formatter = new Intl.NumberFormat('en-US');
</script>

{#if cutoff}
    {@const ageLabel = formatTimeAgo(cutoff.timestampMs, now)}
    {@const isoTimestamp = new Date(cutoff.timestampMs).toISOString()}
    <span
        class="pruning-cutoff"
        title={`Pruning cutoff on ${currentNetwork}: oldest checkpoint still in the indexer's filtered transaction index (probed via TransactionKind=ConsensusCommitPrologueV1).\nCheckpoint #${cutoff.checkpoint} at ${isoTimestamp}`}
    >
        <span class="label">Pruning cutoff:</span>
        <span class="value">#{formatter.format(cutoff.checkpoint)}</span>
        {#if ageLabel}<span class="age">({ageLabel})</span>{/if}
    </span>
{:else if loading}
    <span class="pruning-cutoff loading" title="Querying oldest available checkpoint"
        >Pruning cutoff: …</span
    >
{:else if error}
    <span
        class="pruning-cutoff error"
        title={`Failed to fetch oldest available checkpoint: ${error}`}>Pruning cutoff: n/a</span
    >
{/if}

<style>
    .pruning-cutoff {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.2rem 0.5rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.75rem;
        font-weight: 400;
        white-space: nowrap;
        height: 32px;
        box-sizing: border-box;
    }

    .pruning-cutoff .label {
        color: rgba(255, 255, 255, 0.6);
    }

    .pruning-cutoff .value {
        font-variant-numeric: tabular-nums;
    }

    .pruning-cutoff .age {
        color: rgba(255, 255, 255, 0.55);
    }

    .pruning-cutoff.loading,
    .pruning-cutoff.error {
        color: rgba(255, 255, 255, 0.55);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .pruning-cutoff {
            font-size: 0.7rem;
            padding: 0.15rem 0.4rem;
        }
    }
</style>

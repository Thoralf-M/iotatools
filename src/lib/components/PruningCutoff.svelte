<script lang="ts">
    import { onDestroy } from 'svelte';

    import {
        fetchPruningCutoff,
        formatReadableDate,
        formatReadableDateTime,
        formatTimeAgo,
        formatVerboseAgo,
        type PruningCutoff,
    } from '../utils/pruning-cutoff';
    import { queryAwareClientConfig } from '../utils/query-param-store';

    const REFRESH_MS = 60_000;

    // Below this checkpoint the probe (oldest ConsensusCommitPrologueV1) is the
    // genesis-adjacent entry, i.e. pruning hasn't started yet for this index.
    const NO_PRUNING_BELOW = 2;

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

<div class="pruning-cutoff-container">
    {#if cutoff}
        {@const noPruning = cutoff.checkpoint < NO_PRUNING_BELOW}
        {@const chipAge = formatVerboseAgo(cutoff.timestampMs, now)}
        {@const tooltipAge = formatTimeAgo(cutoff.timestampMs, now)}
        {@const dateOnly = formatReadableDate(cutoff.timestampMs)}
        {@const dateTime = formatReadableDateTime(cutoff.timestampMs)}
        <span class="pruning-cutoff" class:no-pruning={noPruning}>
            {#if noPruning}
                <span class="value">no pruning</span>
            {:else}
                <span class="value">{dateOnly}</span>
                {#if chipAge}<span class="age">({chipAge})</span>{/if}
            {/if}
            <span class="info-icon" aria-hidden="true">ⓘ</span>
        </span>
        <div class="tooltip" role="tooltip">
            <div class="tooltip-title">
                {#if noPruning}
                    No pruning on {currentNetwork}
                {:else}
                    Pruning cutoff on {currentNetwork}: checkpoint #{formatter.format(
                        cutoff.checkpoint,
                    )}
                {/if}
            </div>
            <div class="tooltip-body">
                {#if noPruning}
                    The indexer still holds filtered-query data back to genesis. Everything below is
                    currently retrievable for the entire chain history.
                {:else}
                    The indexer has pruned filtered-query indexes older than checkpoint #{formatter.format(
                        cutoff.checkpoint,
                    )} ({dateTime}{tooltipAge ? `, ${tooltipAge}` : ''}).
                {/if}
            </div>
            <div class="tooltip-section">
                <div class="tooltip-section-title good">Still available for all checkpoints:</div>
                <ul>
                    <li>Direct transaction lookup by digest</li>
                    <li>Direct checkpoint lookup by sequence number / digest</li>
                    <li>Object lookup by ID (current and past versions)</li>
                    <li>Current network / system state, validators, balances</li>
                </ul>
            </div>
            <div class="tooltip-section">
                <div class="tooltip-section-title bad">
                    {#if noPruning}
                        Will be the first to go once pruning kicks in:
                    {:else}
                        Pruned below the cutoff (filtered indexes only):
                    {/if}
                </div>
                <ul>
                    <li>
                        Transactions filtered by kind / sender / recipient / input / changed obj
                    </li>
                    <li>Events filtered by module / sender / type</li>
                    <li>GraphQL queries that rely on those same filtered indexes</li>
                </ul>
            </div>
            <div class="tooltip-footer">
                Probed via <code>iotax_queryTransactionBlocks</code> with
                <code>TransactionKind=ConsensusCommitPrologueV1</code> ascending — that kind is emitted
                once per consensus commit, so the oldest result tracks the actual filtered-index pruning
                watermark.
            </div>
        </div>
    {:else if loading}
        <span class="pruning-cutoff loading" title="Querying oldest available checkpoint"
            >Pruning cutoff: …</span
        >
    {:else if error}
        <span
            class="pruning-cutoff error"
            title={`Failed to fetch oldest available checkpoint: ${error}`}
            >Pruning cutoff: n/a</span
        >
    {/if}
</div>

<style>
    .pruning-cutoff-container {
        position: relative;
        display: inline-flex;
        align-items: center;
    }

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
        cursor: help;
    }

    .pruning-cutoff.no-pruning {
        border-color: rgba(16, 185, 129, 0.35);
    }

    .pruning-cutoff .value {
        font-variant-numeric: tabular-nums;
    }

    .pruning-cutoff .age {
        color: rgba(255, 255, 255, 0.55);
    }

    .pruning-cutoff .info-icon {
        margin-left: 0.15rem;
        opacity: 0.55;
        font-size: 0.8rem;
    }

    .pruning-cutoff.loading,
    .pruning-cutoff.error {
        color: rgba(255, 255, 255, 0.55);
        font-style: italic;
    }

    .tooltip {
        visibility: hidden;
        opacity: 0;
        /* Stay visible briefly when the pointer leaves so the user can move
           into the panel to read / copy from it. */
        transition:
            opacity 0.2s ease 1s,
            visibility 0s linear 1.2s;
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: min(28rem, calc(100vw - 2rem));
        background: rgba(17, 24, 39, 0.98);
        color: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(156, 163, 175, 0.25);
        border-radius: 8px;
        padding: 0.75rem 0.9rem;
        font-size: 0.78rem;
        line-height: 1.45;
        z-index: 50;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        text-align: left;
        white-space: normal;
        user-select: text;
        cursor: text;
    }

    /* Transparent bridge across the 8px gap so moving from the chip into the
       tooltip keeps the hover state. */
    .tooltip::before {
        content: '';
        position: absolute;
        top: -10px;
        left: 0;
        right: 0;
        height: 10px;
    }

    .pruning-cutoff-container:hover .tooltip,
    .pruning-cutoff-container:focus-within .tooltip,
    .tooltip:hover {
        visibility: visible;
        opacity: 1;
        transition:
            opacity 0.15s ease 0s,
            visibility 0s linear 0s;
    }

    .tooltip-title {
        font-weight: 600;
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
    }

    .tooltip-body {
        opacity: 0.85;
        margin-bottom: 0.6rem;
    }

    .tooltip-section {
        margin-top: 0.4rem;
    }

    .tooltip-section-title {
        font-weight: 600;
        margin-bottom: 0.2rem;
    }

    .tooltip-section-title.good {
        color: rgba(110, 231, 183, 0.95);
    }

    .tooltip-section-title.bad {
        color: rgba(252, 165, 165, 0.95);
    }

    .tooltip ul {
        margin: 0 0 0 1rem;
        padding: 0;
    }

    .tooltip li {
        margin: 0.1rem 0;
    }

    .tooltip-footer {
        margin-top: 0.6rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(156, 163, 175, 0.15);
        opacity: 0.6;
        font-size: 0.72rem;
    }

    .tooltip code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0 0.2rem;
        border-radius: 3px;
        font-size: 0.72rem;
    }

    @media (max-width: 768px) {
        .pruning-cutoff {
            font-size: 0.7rem;
            padding: 0.15rem 0.4rem;
        }

        .tooltip {
            right: auto;
            left: 0;
            width: min(22rem, calc(100vw - 1rem));
        }
    }
</style>

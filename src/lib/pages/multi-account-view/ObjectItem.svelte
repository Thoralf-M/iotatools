<script lang="ts">
    import { dragHandle } from 'svelte-dnd-action';

    import {
        fiatValue,
        formatIotaCompact,
        objectDisplayAmount,
        type Currency,
        type FiatPrice,
    } from './balance-utils';
    import type { ExtendedObject } from './multi-account-service';

    type Variant = 'standard' | 'timelocked';

    /** Per-stake metric block surfaced when the parent is in staking mode and
     *  the object is a StakedIota for a known validator. Timelocked stakes
     *  intentionally do not get one — they should be unlocked first before
     *  any optimization is meaningful. */
    export interface StakingMetricInfo {
        metricType: 'commission' | 'rewards';
        /** Validator commission in percent (e.g. 5 = 5%). */
        commissionPct: number;
        /** Realized return over the chosen window as a fraction of principal. */
        rewardsFractionInWindow: number;
        /** Actual nano-IOTA earned in the window for this specific stake. */
        rewardsInWindowNano: bigint;
        /** Stake principal in nano-IOTA — used for fiat conversions. */
        principalNano: bigint;
        validatorName: string;
        /** Whether a clearly-better alternative exists (used to highlight). */
        hasBetterAlternative: boolean;
    }

    interface Props {
        item: ExtendedObject;
        accountAddress: string;
        getAccountDisplayName: (address: string) => string;
        variant?: Variant;
        stakingMetric?: StakingMetricInfo;
        onOptimize?: () => void;
        /** Optional CoinGecko price block for IOTA→fiat conversion. */
        currentPrice?: FiatPrice;
        selectedCurrency?: Currency;
    }

    let {
        item,
        accountAddress,
        getAccountDisplayName,
        variant = 'standard',
        stakingMetric,
        onOptimize,
        currentPrice = null,
        selectedCurrency = 'USD',
    }: Props = $props();

    let isForeign = $derived(variant === 'standard' && accountAddress !== item.currentOwner);
    let amountDisplay = $derived(objectDisplayAmount(item));

    function fmtPct(n: number, digits = 2): string {
        return `${n.toFixed(digits)}%`;
    }

    /** "Window rewards 0.123% — 12.34 IOTA (≈ $1.23)" or
     *  "Commission 5.00%" (commission has no per-stake IOTA equivalent). */
    function metricLabel(m: StakingMetricInfo): string {
        if (m.metricType === 'commission') return `Commission ${fmtPct(m.commissionPct)}`;
        const pct = fmtPct(m.rewardsFractionInWindow * 100, 3);
        const iota = `${formatIotaCompact(m.rewardsInWindowNano)} IOTA`;
        const fiat = fiatValue(m.rewardsInWindowNano, currentPrice, selectedCurrency);
        return fiat
            ? `Window rewards ${pct} — ${iota} (≈ ${fiat})`
            : `Window rewards ${pct} — ${iota}`;
    }
</script>

{#if variant === 'timelocked'}
    <div class="object-item" style="border-color: rgba(248, 113, 113, 0.3);">
        <div class="object-header">
            <span class="object-type" title={item.label}>
                {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                    IOTA Coin
                {:else}
                    {item.label}
                {/if}
            </span>
            <span class="object-amount">{amountDisplay}</span>
        </div>
        <details class="object-details">
            <summary>Data</summary>
            <pre>{JSON.stringify(item, null, 2)}</pre>
        </details>
    </div>
{:else}
    <div class="object-item" class:foreign={isForeign}>
        <div use:dragHandle class="object-header">
            <span class="object-type" title={item.label}>
                {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                    IOTA Coin
                {:else}
                    {item.label}
                {/if}
            </span>
            <span class="object-amount">{amountDisplay}</span>
        </div>

        {#if stakingMetric}
            <div class="staking-row" class:warn={stakingMetric.hasBetterAlternative}>
                <span class="validator" title={stakingMetric.validatorName}
                    >→ {stakingMetric.validatorName}</span
                >
                <span class="metric">{metricLabel(stakingMetric)}</span>
                {#if onOptimize && stakingMetric.hasBetterAlternative}
                    <button class="optimize" onclick={onOptimize} title="Show better alternatives">
                        Optimize
                    </button>
                {:else if onOptimize}
                    <button
                        class="optimize quiet"
                        onclick={onOptimize}
                        title="Compare alternatives"
                    >
                        Compare
                    </button>
                {/if}
            </div>
        {/if}

        <div style="position: relative;">
            {#if isForeign}
                <div
                    style="position: absolute; left: 0; top: 0; height: 1.2rem; display: flex; align-items: center; font-size: 0.7rem; color: #f59e0b; pointer-events: none;"
                >
                    From: {getAccountDisplayName(item.currentOwner)}
                </div>
            {/if}
            <details class="object-details">
                <summary style="text-align: center; list-style-position: inside;">Data</summary>
                <pre>{JSON.stringify(item, null, 2)}</pre>
            </details>
        </div>
    </div>
{/if}

<style>
    .object-item {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        margin-bottom: 0.25rem;
        padding: 0.4rem;
        font-size: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .object-item.foreign {
        border-left: 3px solid #f59e0b;
    }

    .object-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
    }

    .object-type {
        font-weight: 500;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
    }

    .object-amount {
        font-family: monospace;
    }

    .object-details {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }

    details summary {
        cursor: pointer;
        color: var(--accent-color);
    }

    .staking-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.78rem;
        color: var(--text-muted);
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
        padding: 0.2rem 0.4rem;
    }

    .staking-row.warn {
        background: rgba(245, 158, 11, 0.1);
        color: #fbbf24;
    }

    .validator {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50%;
        font-weight: 500;
    }

    .metric {
        font-family: monospace;
        margin-left: auto;
    }

    .optimize {
        font-size: 0.72rem;
        padding: 0.1rem 0.5rem;
        background: #059669;
        border: none;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    }

    .optimize.quiet {
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-muted);
    }

    .optimize:hover {
        filter: brightness(1.15);
    }
</style>

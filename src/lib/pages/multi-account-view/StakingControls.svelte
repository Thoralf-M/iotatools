<script lang="ts">
    import { STAKING_TIME_FRAME_LABELS, type StakingTimeFrame } from './staking-metrics';

    /** Which value to surface per-stake-object in the account cards: the
     *  validator's commission rate, or the realized rewards % of principal
     *  over the chosen timeframe. (This selector only affects the small badge
     *  on each StakedIota row — the comparison table below shows both
     *  separately and is unaffected.) */
    export type StakingMetricType = 'commission' | 'rewards';

    interface Props {
        timeFrame: StakingTimeFrame;
        metricType: StakingMetricType;
        loading?: boolean;
        loadError?: string;
        validatorsLoaded?: number;
    }

    let {
        timeFrame = $bindable(),
        metricType = $bindable(),
        loading = false,
        loadError = '',
        validatorsLoaded,
    }: Props = $props();

    /** Stable order of the timeframe presets — must match the keys defined
     *  in STAKING_TIME_FRAME_LABELS so prev/next steps walk through them in
     *  the same order as the dropdown. */
    const TIME_FRAME_ORDER = Object.keys(STAKING_TIME_FRAME_LABELS) as StakingTimeFrame[];
    let timeFrameIndex = $derived(TIME_FRAME_ORDER.indexOf(timeFrame));

    function prevTimeFrame() {
        if (loading) return;
        const len = TIME_FRAME_ORDER.length;
        const i = ((timeFrameIndex < 0 ? 0 : timeFrameIndex - 1) + len) % len;
        timeFrame = TIME_FRAME_ORDER[i];
    }
    function nextTimeFrame() {
        if (loading) return;
        const len = TIME_FRAME_ORDER.length;
        const i = ((timeFrameIndex < 0 ? 0 : timeFrameIndex + 1) + len) % len;
        timeFrame = TIME_FRAME_ORDER[i];
    }
</script>

<div class="staking-controls">
    <label class="control-row">
        Timeframe (can make a big difference!):
        <button
            type="button"
            class="nav-btn"
            onclick={prevTimeFrame}
            disabled={loading}
            title="Shorter timeframe"
            aria-label="Previous timeframe"
        >
            ◀
        </button>
        <select bind:value={timeFrame} disabled={loading}>
            {#each Object.entries(STAKING_TIME_FRAME_LABELS) as [value, label]}
                <option {value}>{label}</option>
            {/each}
        </select>
        <button
            type="button"
            class="nav-btn"
            onclick={nextTimeFrame}
            disabled={loading}
            title="Longer timeframe"
            aria-label="Next timeframe"
        >
            ▶
        </button>
    </label>

    <fieldset
        class="metric-fieldset"
        disabled={loading}
        title="Controls the small badge shown next to each StakedIota in the account cards below — the validator-comparison table is unaffected."
    >
        <legend>Per-stake badge</legend>
        <label>
            <input type="radio" bind:group={metricType} value="rewards" />
            Rewards %
        </label>
        <label>
            <input type="radio" bind:group={metricType} value="commission" />
            Commission
        </label>
    </fieldset>

    {#if loading}
        <span class="status">Loading staking data…</span>
    {:else if validatorsLoaded !== undefined && !loadError}
        <span class="status">{validatorsLoaded} validators loaded</span>
    {/if}
    {#if loadError}
        <span class="status error">{loadError}</span>
    {/if}
</div>

<style>
    .staking-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 0.5rem 0.75rem;
        /* Solid base + green tint overlay. The original tint alone was
           ~6%-alpha and let everything underneath bleed through, which
           looks bad once the bar starts overlapping the chart on scroll. */
        background:
            linear-gradient(rgba(5, 150, 105, 0.06), rgba(5, 150, 105, 0.06)),
            rgb(12, 17, 28);
        border: 1px solid rgba(5, 150, 105, 0.25);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        /* Sticky so the timeframe + per-stake-badge picker stay accessible
           while the user scrolls down through the chart, table, etc. The
           subtle box-shadow appears as a depth cue once the bar pins. */
        position: sticky;
        top: 0;
        z-index: 30;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .control-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.9rem;
    }

    .control-row select {
        padding: 0.25rem 0.4rem;
        background-color: #232324;
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    /* Same visual language as the prev/next buttons in StakingTrendChart for
       consistency. Wraps the timeframe dropdown so users can step through
       1d → 7d → … → all without opening the dropdown each time. */
    .nav-btn {
        font-size: 0.85rem;
        padding: 0.15rem 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-muted);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        line-height: 1;
    }

    .nav-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
    }

    .nav-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .metric-fieldset {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        padding: 0.1rem 0.5rem 0.25rem;
        margin: 0;
        font-size: 0.85rem;
    }

    .metric-fieldset legend {
        padding: 0 0.3rem;
        color: var(--text-muted);
        font-size: 0.75rem;
    }

    .metric-fieldset label {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
    }

    .status {
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .status.error {
        color: #ef4444;
        opacity: 1;
    }
</style>

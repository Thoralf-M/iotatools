<script lang="ts">
    import { fiatValue, formatIotaCompact, type Currency, type FiatPrice } from './balance-utils';
    import {
        aprToApy,
        computeBreakevenDays,
        poolNetAprOverWindow,
        STAKING_TIME_FRAME_LABELS,
        type StakingTimeFrame,
    } from './staking-metrics';
    import { effectiveCommissionBps, type ValidatorInfoFull } from './validator-info';

    interface Props {
        validators: ValidatorInfoFull[];
        timeFrame: StakingTimeFrame;
        fromEpoch: number;
        toEpoch: number;
        /** Per-pool sum of the user's staked principal (nano-IOTA). Pools the
         *  user has any stake in are highlighted; the amount + share-of-total
         *  is shown inline so the user can see at a glance which switches
         *  would have the biggest impact. */
        userStakeByPool: Map<string, bigint>;
        /** Lowest net APR among the user's current stakes. Used as the
         *  "old APR" baseline when computing per-row break-even days — the
         *  minimum is more actionable than an average because it surfaces any
         *  validator that beats at least one of the user's stakes. */
        userMinNetApr: number;
        /** CoinGecko price block for IOTA→fiat conversion. */
        currentPrice?: FiatPrice;
        selectedCurrency?: Currency;
    }

    let {
        validators,
        timeFrame,
        fromEpoch,
        toEpoch,
        userStakeByPool,
        userMinNetApr,
        currentPrice = null,
        selectedCurrency = 'USD',
    }: Props = $props();

    let userStakeTotal = $derived.by(() => {
        let sum = 0n;
        for (const v of userStakeByPool.values()) sum += v;
        return sum;
    });

    type SortKey = 'name' | 'commission' | 'apr' | 'breakeven' | 'stake';
    let sortKey = $state<SortKey>('apr');
    let sortDir = $state<'asc' | 'desc'>('desc');

    function toggleSort(key: SortKey, event?: MouseEvent) {
        // Clicks on the inline tooltip icon shouldn't change the sort.
        // Detecting the originating element here keeps the icon span free
        // of its own click handler (which trips a11y lints).
        if (event && (event.target as Element | null)?.closest('.tooltip-container')) return;
        if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else {
            sortKey = key;
            sortDir = key === 'name' ? 'asc' : 'desc';
        }
    }

    function indicator(key: SortKey) {
        if (sortKey !== key) return '';
        return sortDir === 'asc' ? ' ▲' : ' ▼';
    }

    interface Row {
        v: ValidatorInfoFull;
        /** IIP-8 effective commission, in pct units (0–100). */
        commissionPct: number;
        /** Raw declared commission, in pct units. Shown alongside the
         *  effective rate when the floor has bumped it up. */
        declaredCommissionPct: number;
        apr: number;
        /** null = switching to this validator never breaks even (APR ≤ user's). */
        breakevenDays: number | null;
        stakeIota: bigint;
        userStake: bigint | undefined;
        userShareOfTotal: number;
    }

    let rows = $derived.by<Row[]>(() => {
        const totalNum = Number(userStakeTotal);
        return validators.map((v) => {
            const userStake = userStakeByPool.get(v.poolId);
            const apr = poolNetAprOverWindow(v.poolId, fromEpoch, toEpoch);
            // Skip the breakeven calculation for pools the user is already
            // staked with — switching to yourself is meaningless.
            const breakevenDays =
                userMinNetApr > 0 && userStake === undefined
                    ? computeBreakevenDays(userMinNetApr, apr)
                    : null;
            return {
                v,
                // IIP-8: effective commission floor is the validator's
                // voting-power share. Always show the higher of declared
                // commission and voting power so the user sees what they'll
                // actually be charged.
                commissionPct: effectiveCommissionBps(v) / 100,
                declaredCommissionPct: v.commissionBps / 100,
                apr,
                breakevenDays,
                stakeIota: v.stakingPoolIotaBalance,
                userStake,
                userShareOfTotal: userStake && totalNum > 0 ? Number(userStake) / totalNum : 0,
            };
        });
    });

    let sortedRows = $derived.by<Row[]>(() => {
        const dir = sortDir === 'asc' ? 1 : -1;
        return [...rows].sort((a, b) => {
            switch (sortKey) {
                case 'name':
                    return dir * a.v.name.localeCompare(b.v.name);
                case 'commission':
                    return dir * (a.commissionPct - b.commissionPct);
                case 'apr':
                    return dir * (a.apr - b.apr);
                case 'breakeven': {
                    // Sort nulls last regardless of direction — "never
                    // breaks even" is the worst case in either ordering.
                    const aBe = a.breakevenDays;
                    const bBe = b.breakevenDays;
                    if (aBe === null && bBe === null) return 0;
                    if (aBe === null) return 1;
                    if (bBe === null) return -1;
                    return dir * (aBe - bBe);
                }
                case 'stake':
                    if (a.stakeIota > b.stakeIota) return dir;
                    if (a.stakeIota < b.stakeIota) return -dir;
                    return 0;
            }
        });
    });

    let bestApr = $derived(rows.reduce((m, r) => (r.apr > m ? r.apr : m), 0));

    function formatPct(n: number, digits = 2): string {
        return `${(n * 100).toFixed(digits)}%`;
    }

    /** Inline IOTA + optional fiat (e.g. "1_234.56 IOTA · ≈ $123.45"). The
     *  fiat suffix is dropped when no price has been fetched yet. */
    function fmtIotaFiat(nano: bigint, sep = ' · '): string {
        const iota = `${formatIotaCompact(nano)} IOTA`;
        const f = fiatValue(nano, currentPrice, selectedCurrency);
        return f ? `${iota}${sep}≈ ${f}` : iota;
    }
</script>

<details class="comparison-section" open>
    <summary>
        <span class="chevron" aria-hidden="true">▶</span>
        <span class="title">Validator comparison ({STAKING_TIME_FRAME_LABELS[timeFrame]})</span>
        <span class="subtitle"
            >{validators.length} validators · best net APR: {formatPct(bestApr)}</span
        >
    </summary>

    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th class="sortable" onclick={(e) => toggleSort('name', e)}>
                        Validator{indicator('name')}
                    </th>
                    <th>
                        Status
                        <span class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <span class="tooltip">
                                <strong>Committee</strong> validators earn rewards each epoch.
                                <strong>Active</strong> validators are registered but not currently in
                                the committee, so they earn nothing — switching to one would drop your
                                yield to zero.
                            </span>
                        </span>
                    </th>
                    <th class="sortable right" onclick={(e) => toggleSort('commission', e)}>
                        Effective commission{indicator('commission')}
                        <span class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <span class="tooltip">
                                The cut the validator takes from rewards before distributing the
                                remainder to delegators. Shown here is the
                                <strong>effective commission per IIP-8</strong>:
                                <em>max(declared commission, voting-power share)</em>. Validators
                                with disproportionately large stake are forced to keep at least
                                their voting-power percentage as commission, so the effective rate
                                can be higher than what the validator declared. When that's the
                                case, the declared rate is shown in parentheses.
                            </span>
                        </span>
                    </th>
                    <th class="sortable right" onclick={(e) => toggleSort('breakeven', e)}>
                        Days to break even{indicator('breakeven')}
                        <span class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <span class="tooltip">
                                If you moved your <em>worst-yielding</em> stake to this validator
                                today, how many days until cumulative earnings overtake what you'd
                                have made by leaving it where it is. Compared against the lowest net
                                APR among your current stakes (not the average — using the minimum
                                surfaces any validator that beats at least one of your stakes).
                                Accounts for the ≈1 epoch of activation delay where the new stake
                                earns nothing.<br /><br />
                                <strong>—</strong> means this validator's APR is at or below even your
                                weakest stake (so switching anything to here would lose money), or that
                                you have no stakes to compare against.
                            </span>
                        </span>
                    </th>
                    <th class="sortable right" onclick={(e) => toggleSort('apr', e)}>
                        Net APR / APY{indicator('apr')}
                        <span class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <span class="tooltip">
                                <strong>APR</strong> = Annual Percentage Rate (linear): the window
                                return projected to a full year (365 epochs ≈ 1 year on mainnet).<br
                                /><br />
                                <strong>APY</strong> = Annual Percentage Yield (compounded): what
                                the same return becomes when each epoch's growth compounds into the
                                next — which is what actually happens, since the pool token amount
                                stays constant and only the IOTA value per token grows. APY ≥ APR.<br
                                /><br />
                                <strong>Net</strong> = after commission. The exchange rate already reflects
                                only what delegators receive, so these numbers are what you actually earn
                                — no further commission deduction is applied on top.
                            </span>
                        </span>
                    </th>
                    <th class="sortable right" onclick={(e) => toggleSort('stake', e)}>
                        Pool stake (IOTA){indicator('stake')}
                        <span class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <span class="tooltip">
                                Total IOTA delegated to this validator's staking pool right now.
                                Larger pools are usually closer to the protocol's voting-power cap,
                                which can effectively raise their commission.
                            </span>
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each sortedRows as row (row.v.address)}
                    <tr
                        class:user-row={row.userStake !== undefined}
                        class:best-row={row.apr === bestApr && bestApr > 0}
                    >
                        <td title={row.v.address}>
                            <span class="name">{row.v.name}</span>
                            {#if row.userStake !== undefined}
                                <span
                                    class="badge user"
                                    title="Your stake with this validator. Switching higher-share stakes has the largest impact on your overall APR."
                                >
                                    your stake:
                                    <span class="user-amount">{fmtIotaFiat(row.userStake)}</span>
                                    {#if row.userShareOfTotal > 0}
                                        <span class="user-share"
                                            >· {formatPct(row.userShareOfTotal, 1)} of total</span
                                        >
                                    {/if}
                                </span>
                            {/if}
                            {#if row.apr === bestApr && bestApr > 0}<span class="badge best"
                                    >best APR</span
                                >{/if}
                        </td>
                        <td>{row.v.isCommittee ? 'Committee' : 'Active'}</td>
                        <td class="right">
                            {formatPct(row.commissionPct / 100)}
                            {#if row.commissionPct - row.declaredCommissionPct > 0.01}
                                <span
                                    class="declared-hint"
                                    title="Declared {formatPct(
                                        row.declaredCommissionPct / 100,
                                    )} — bumped to {formatPct(
                                        row.commissionPct / 100,
                                    )} by the IIP-8 voting-power floor."
                                    >(decl. {formatPct(row.declaredCommissionPct / 100)})</span
                                >
                            {/if}
                        </td>
                        <td class="right">
                            {#if row.breakevenDays === null}
                                <span class="muted">—</span>
                            {:else}
                                {Math.ceil(row.breakevenDays)} days
                            {/if}
                        </td>
                        <td class="right">
                            {formatPct(row.apr)}
                            <span class="apy-hint">/ {formatPct(aprToApy(row.apr))} APY</span>
                        </td>
                        <td class="right">{fmtIotaFiat(row.stakeIota)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</details>

<style>
    .comparison-section {
        margin: 0.5rem 0;
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
    }

    .comparison-section summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        user-select: none;
    }

    /* Hide the default disclosure marker so our chevron is the only one. */
    .comparison-section summary::-webkit-details-marker {
        display: none;
    }
    .comparison-section summary::marker {
        content: '';
    }

    .chevron {
        display: inline-block;
        width: 1em;
        font-size: 0.7rem;
        color: var(--text-muted);
        transition: transform 0.15s ease;
        transform: rotate(0deg);
    }

    .comparison-section[open] > summary .chevron {
        transform: rotate(90deg);
    }

    .comparison-section summary:hover .chevron {
        color: var(--text-color);
    }

    .title {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .table-wrapper {
        /* Cap to ~half the viewport so the surrounding controls/cards stay
           visible while the table itself scrolls. The header is made sticky
           below so it remains anchored as the user scrolls down. */
        max-height: 50vh;
        overflow: auto;
        margin-top: 0.5rem;
    }

    .table-wrapper thead th {
        position: sticky;
        top: 0;
        background: var(--background-card);
        z-index: 1;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.85rem;
    }

    th,
    td {
        padding: 0.3rem 0.5rem;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
    }

    th.right,
    td.right {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    th.sortable {
        cursor: pointer;
        user-select: none;
    }

    th.sortable:hover {
        background: rgba(255, 255, 255, 0.04);
    }

    tr.user-row {
        background: rgba(245, 158, 11, 0.08);
    }

    tr.best-row {
        background: rgba(16, 185, 129, 0.1);
    }

    .badge {
        margin-left: 0.4rem;
        font-size: 0.7rem;
        padding: 0.05rem 0.4rem;
        border-radius: 999px;
    }

    .badge.user {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
    }

    .user-amount {
        font-family: monospace;
        font-weight: 600;
    }

    .user-share {
        opacity: 0.85;
        margin-left: 0.15rem;
    }

    .muted {
        color: var(--text-muted);
    }

    /* Inline "(decl. 1.00%)" annotation on rows where the IIP-8 voting-power
       floor pushed the effective commission above what the validator
       declared. Same column, smaller and dimmer so it doesn't compete with
       the main number. */
    .declared-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-left: 0.25rem;
    }

    /* APY annotation next to the APR value — same dimming pattern as
       declared-hint above so the primary number stays the eye-catcher. */
    .apy-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-left: 0.25rem;
    }

    .badge.best {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
    }

    .name {
        font-weight: 500;
    }

    /* Tooltip pattern matches ../staking-rewards/StakingRewards.svelte so it
       reads consistently across the app. The container takes the click on the
       icon and stops propagation so it doesn't trigger column sorting. */
    .tooltip-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: help;
        margin-left: 0.25rem;
    }

    .info-icon {
        font-size: 0.85rem;
        opacity: 0.6;
        font-weight: normal;
    }

    .tooltip-container:hover .info-icon {
        opacity: 1;
    }

    .tooltip {
        visibility: hidden;
        width: 280px;
        background-color: #1f2937;
        color: #fff;
        text-align: left;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.6rem 0.7rem;
        position: absolute;
        /* z-index needs to clear the sticky thead (z-index: 1) plus any
           other stacked elements in the table. */
        z-index: 100;
        /* Render below the icon, not above. The table wrapper has
           `overflow: auto` so anything positioned above the sticky <th>
           gets clipped. Below the header sits inside the scrolled body
           area, which is visible. */
        top: calc(100% + 6px);
        right: 0;
        opacity: 0;
        transition: opacity 0.15s;
        font-size: 0.8rem;
        line-height: 1.4;
        font-weight: normal;
        text-transform: none;
        white-space: normal;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .tooltip-container:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }
</style>

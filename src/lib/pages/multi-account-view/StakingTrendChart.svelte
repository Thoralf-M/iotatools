<script lang="ts">
    import Chart from 'chart.js/auto';
    import zoomPlugin from 'chartjs-plugin-zoom';
    import { onDestroy, onMount, untrack } from 'svelte';

    import { nanoToIota } from '../../utils/iota-nano-conversion';
    import { formatIotaWithFiat, type Currency, type FiatPrice } from './balance-utils';
    import {
        ACTIVATION_DELAY_DAYS,
        aprToApy,
        computeBreakevenDays,
        EPOCHS_PER_YEAR,
        poolPerEpochReturnSeries,
        poolReturnSeries,
    } from './staking-metrics';
    import { effectiveCommissionBps, type ValidatorInfoFull } from './validator-info';

    Chart.register(zoomPlugin);

    /** A handle to one of the user's staked objects, with its current
     *  validator pre-resolved so the chart doesn't have to look it up. */
    export interface UserStakeRef {
        stakeId: string;
        accountAddress: string;
        principal: bigint;
        validator: ValidatorInfoFull;
    }

    type Mode = 'validators' | 'my-stake';

    interface Props {
        validators: ValidatorInfoFull[];
        fromEpoch: number;
        toEpoch: number;
        userPoolIds: Set<string>;
        userStakes: UserStakeRef[];
        aprByPool: Map<string, number>;
        currentPrice?: FiatPrice;
        selectedCurrency?: Currency;
        /** When set, the chart switches to "my-stake" mode, replaces the
         *  selection with this single stake, and clears the request back to
         *  null. Used to focus the chart from outside (e.g. clicking the
         *  per-stake "Optimize" button in an account card). */
        focusStakeRequest?: string | null;
        /** Selected switch-target validator address. Bindable so the host can
         *  share it with per-account stake controls (the AccountCard's
         *  "Stake X IOTA" button stakes to this same validator). Empty string
         *  means "no target picked". */
        switchTargetAddress?: string;
        /** Pending "stake new liquid IOTA from account X" intent originated by
         *  an AccountCard click. When set, the chart focuses itself, clears
         *  any existing-stake selection, auto-picks a target if needed, and
         *  shows a banner above the chart with a confirm button. The chart
         *  clears it back to `null` after a successful confirm or explicit
         *  cancel. */
        pendingNewStake?: {
            accountAddress: string;
            accountLabel: string;
            amountNano: bigint;
        } | null;
        /** Build + execute the switch transaction(s). Receives the currently-
         *  selected stakes and the chosen target validator. The host owns
         *  building the actual PTB(s) so it can group by sending account. */
        onSwitch?: (stakes: UserStakeRef[], newValidator: ValidatorInfoFull) => void;
        /** Build + execute a new-stake transaction for a pending stake intent.
         *  Called only when `pendingNewStake` is set and the user clicks the
         *  banner's confirm button. */
        onStakeNew?: (
            accountAddress: string,
            amountNano: bigint,
            target: ValidatorInfoFull,
        ) => void;
    }

    let {
        validators,
        fromEpoch,
        toEpoch,
        userPoolIds,
        userStakes,
        aprByPool,
        currentPrice = null,
        selectedCurrency = 'USD',
        focusStakeRequest = $bindable(null),
        switchTargetAddress = $bindable(''),
        pendingNewStake = $bindable(null),
        onSwitch,
        onStakeNew,
    }: Props = $props();

    let mode = $state<Mode>('my-stake');
    /** Which of the user's stakes to combine into the projection. Stored as a
     *  `Set` wrapped in `$state` — toggle helpers reassign the whole set so
     *  Svelte tracks the change. Default is "all selected" so users see the
     *  full picture immediately. */
    let selectedStakeIds = $state<Set<string>>(new Set());
    /** How many top-APR committee validators to show alongside the user's
     *  stakes. `'all'` shows every committee validator (can be a lot of
     *  lines). `0` shows only the user's stakes. */
    let topN = $state<number | 'all'>(10);
    const TOP_N_OPTIONS: Array<{ value: number | 'all'; label: string }> = [
        { value: 0, label: '0 (only my stakes)' },
        { value: 5, label: 'Top 5' },
        { value: 10, label: 'Top 10' },
        { value: 20, label: 'Top 20' },
        { value: 'all', label: 'All committee' },
    ];

    /** How many days into the future the stay/switch projection extends.
     *  `'auto'` adapts to the breakeven distance (1.5× breakeven + 14 days,
     *  floor 90 days) so the crossover is always visible; numeric values
     *  pin the horizon for direct comparison across different selections. */
    let projectionHorizon = $state<number | 'auto'>('auto');
    const PROJECTION_HORIZON_OPTIONS: Array<{ value: number | 'auto'; label: string }> = [
        { value: 'auto', label: 'Auto (adapt to breakeven)' },
        { value: 30, label: '30 days' },
        { value: 60, label: '60 days' },
        { value: 90, label: '90 days' },
        { value: 180, label: '180 days' },
        { value: 365, label: '365 days' },
        { value: 730, label: '2 years' },
    ];

    /** Crossover point published from buildMyStakeDatasets so the legend hint
     *  below the chart can mention the day count without recomputing it. */
    let breakevenInfo = $state<{ days: number; epoch: number } | null>(null);

    /** Tracks whether the default "select all stakes" has already run.
     *  Without this we can't distinguish "fresh visit, initialize" from
     *  "user explicitly cleared with the None button" — both look like
     *  `selectedStakeIds.size === 0` to the effect. Non-reactive on
     *  purpose so we don't loop. */
    let stakesInitialized = false;

    /** Default-select the user's stakes at the highest-commission validator
     *  on first visit — that's typically the most expensive exposure and
     *  therefore the best switch candidate to investigate first. After
     *  initialization just prune IDs that disappear from the synced stake
     *  list. The user's explicit clear (None button) is respected — we
     *  never re-fill an empty set once they've interacted. */
    $effect(() => {
        if (mode !== 'my-stake') return;
        const validIds = userStakes.map((s) => s.stakeId);
        if (!stakesInitialized && validIds.length > 0) {
            // Find the validator the user is staked with that has the
            // highest IIP-8 effective commission. Tie-break by total
            // principal (bigger exposure wins).
            let pickedAddr: string | null = null;
            let pickedComm = -1;
            let pickedPrincipal = 0n;
            const totalsByAddr = new Map<string, bigint>();
            for (const s of userStakes) {
                totalsByAddr.set(
                    s.validator.address,
                    (totalsByAddr.get(s.validator.address) ?? 0n) + s.principal,
                );
            }
            for (const s of userStakes) {
                const eff = effectiveCommissionBps(s.validator);
                const total = totalsByAddr.get(s.validator.address) ?? s.principal;
                if (eff > pickedComm || (eff === pickedComm && total > pickedPrincipal)) {
                    pickedComm = eff;
                    pickedPrincipal = total;
                    pickedAddr = s.validator.address;
                }
            }
            const ids = pickedAddr
                ? userStakes.filter((s) => s.validator.address === pickedAddr).map((s) => s.stakeId)
                : validIds;
            selectedStakeIds = new Set(ids);
            stakesInitialized = true;
            return;
        }
        // Drop selections that no longer correspond to a synced stake.
        const valid = new Set(validIds);
        const pruned = new Set([...selectedStakeIds].filter((id) => valid.has(id)));
        if (pruned.size !== selectedStakeIds.size) selectedStakeIds = pruned;
    });

    /** Tracks whether the user has chosen a switch target (including the
     *  `(none — only show stay)` option, which sets `switchTargetAddress`
     *  to the empty string). Without this flag the auto-pick effect below
     *  would treat `''` as "needs picking" and immediately overwrite the
     *  user's explicit None choice — same class of bug as the stake-list
     *  None button before its `stakesInitialized` fix. Non-reactive on
     *  purpose so flipping it doesn't itself retrigger the effect. */
    let switchTargetTouched = false;

    /** Auto-pick the highest-APR alternative committee validator as default
     *  switch target. Excludes pools the currently-selected stakes are in,
     *  and respects an explicit user choice (touched flag). Also clears
     *  the target if the user adds a stake at its pool — the target then
     *  becomes "switch to yourself", which has no meaning. */
    $effect(() => {
        if (mode !== 'my-stake' || selectedStakeIds.size === 0) return;

        if (switchTargetAddress) {
            const target = validators.find((v) => v.address === switchTargetAddress);
            if (target) {
                const userPools = new Set(
                    userStakes
                        .filter((s) => selectedStakeIds.has(s.stakeId))
                        .map((s) => s.validator.poolId),
                );
                if (userPools.has(target.poolId)) {
                    switchTargetAddress = '';
                    switchTargetTouched = false;
                }
            }
        }

        if (switchTargetTouched) return;
        if (switchTargetAddress) return;

        const selectedStakes = userStakes.filter((s) => selectedStakeIds.has(s.stakeId));
        const myPools = new Set(selectedStakes.map((s) => s.validator.poolId));
        const baseline = weightedOldApr(selectedStakes);
        const better = validators
            .filter((v) => v.isCommittee && !myPools.has(v.poolId))
            .map((v) => ({ v, apr: aprByPool.get(v.poolId) ?? 0 }))
            .filter((x) => x.apr > baseline)
            .sort((a, b) => b.apr - a.apr)[0];
        if (better) switchTargetAddress = better.v.address;
    });

    function toggleStake(id: string) {
        const next = new Set(selectedStakeIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        selectedStakeIds = next;
    }
    function selectAllStakes() {
        selectedStakeIds = new Set(userStakes.map((s) => s.stakeId));
    }
    function selectNoneStakes() {
        selectedStakeIds = new Set();
    }

    interface StakeGroup {
        validator: UserStakeRef['validator'];
        stakes: UserStakeRef[];
        totalPrincipal: bigint;
    }

    /** Stakes grouped by validator. Groups sorted by total principal
     *  descending (biggest exposures first); stakes within a group sorted
     *  by principal descending. */
    let stakeGroups = $derived.by<StakeGroup[]>(() => {
        const map = new Map<string, StakeGroup>();
        for (const s of userStakes) {
            const key = s.validator.address;
            const existing = map.get(key);
            if (existing) {
                existing.stakes.push(s);
                existing.totalPrincipal += s.principal;
            } else {
                map.set(key, {
                    validator: s.validator,
                    stakes: [s],
                    totalPrincipal: s.principal,
                });
            }
        }
        for (const g of map.values()) {
            g.stakes.sort((a, b) =>
                a.principal < b.principal ? 1 : a.principal > b.principal ? -1 : 0,
            );
        }
        return [...map.values()].sort((a, b) =>
            a.totalPrincipal < b.totalPrincipal ? 1 : a.totalPrincipal > b.totalPrincipal ? -1 : 0,
        );
    });

    type GroupState = 'all' | 'partial' | 'none';
    function groupSelectionState(g: StakeGroup): GroupState {
        let any = false;
        let all = true;
        for (const s of g.stakes) {
            if (selectedStakeIds.has(s.stakeId)) any = true;
            else all = false;
        }
        return all ? 'all' : any ? 'partial' : 'none';
    }

    function toggleGroup(g: StakeGroup) {
        const state = groupSelectionState(g);
        const next = new Set(selectedStakeIds);
        if (state === 'all') {
            // Fully selected → deselect every stake in this group.
            for (const s of g.stakes) next.delete(s.stakeId);
        } else {
            // 'none' or 'partial' → select every stake in this group.
            for (const s of g.stakes) next.add(s.stakeId);
        }
        selectedStakeIds = next;
    }

    /** Sorted-by-APR-descending list of valid switch targets (committee
     *  validators excluding any pool the selected stakes are already in).
     *  Drives the prev/next navigation buttons. */
    let targetCandidates = $derived.by(() => {
        const myPools = new Set(
            userStakes
                .filter((s) => selectedStakeIds.has(s.stakeId))
                .map((s) => s.validator.poolId),
        );
        return validators
            .filter((v) => v.isCommittee && !myPools.has(v.poolId))
            .sort((a, b) => (aprByPool.get(b.poolId) ?? 0) - (aprByPool.get(a.poolId) ?? 0));
    });
    let targetIndex = $derived(
        targetCandidates.findIndex((v) => v.address === switchTargetAddress),
    );
    function prevTarget() {
        // "Previous" goes to the higher-APR side (index − 1) since the list
        // is sorted descending. Wraps around to the bottom for convenience.
        if (targetCandidates.length === 0) return;
        const idx = targetIndex < 0 ? 0 : targetIndex - 1;
        const wrapped = (idx + targetCandidates.length) % targetCandidates.length;
        switchTargetAddress = targetCandidates[wrapped].address;
        switchTargetTouched = true;
    }
    function nextTarget() {
        if (targetCandidates.length === 0) return;
        const idx = targetIndex < 0 ? 0 : targetIndex + 1;
        const wrapped = idx % targetCandidates.length;
        switchTargetAddress = targetCandidates[wrapped].address;
        switchTargetTouched = true;
    }
    function onTargetSelectChange() {
        switchTargetTouched = true;
    }

    /** Principal-weighted average APR across the given stakes. */
    function weightedOldApr(stakes: UserStakeRef[]): number {
        let totalP = 0;
        let weighted = 0;
        for (const s of stakes) {
            const p = Number(s.principal);
            const apr = aprByPool.get(s.validator.poolId) ?? 0;
            totalP += p;
            weighted += p * apr;
        }
        return totalP > 0 ? weighted / totalP : 0;
    }

    /** Derived "current basket" state surfaced by the metrics row + Switch
     *  button below the chart. Computing once here means the markup and the
     *  chart-builder agree on numbers; previously the projection chart and
     *  the (now-deleted) OptimizePanel could drift if their inputs differed. */
    let selectedStakeRefs = $derived(userStakes.filter((s) => selectedStakeIds.has(s.stakeId)));
    let combinedPrincipal = $derived(selectedStakeRefs.reduce((sum, s) => sum + s.principal, 0n));
    let combinedOldApr = $derived(weightedOldApr(selectedStakeRefs));
    let switchTarget = $derived(
        switchTargetAddress
            ? (validators.find((v) => v.address === switchTargetAddress) ?? null)
            : null,
    );
    let switchTargetApr = $derived(switchTarget ? (aprByPool.get(switchTarget.poolId) ?? 0) : 0);
    let projectionBreakeven = $derived(
        switchTarget ? computeBreakevenDays(combinedOldApr, switchTargetApr) : null,
    );

    /** "X IOTA / year (≈ $Y) / year" — yield on the current basket at a given
     *  APR. Used by the metrics row. */
    function aprToYearlyText(apr: number): string {
        const yearlyNano = BigInt(Math.floor(Number(combinedPrincipal) * apr));
        return formatIotaWithFiat(yearlyNano, currentPrice, selectedCurrency) + ' / year';
    }
    function aprDiffYearlyText(): string {
        const diff = switchTargetApr - combinedOldApr;
        const sign = diff >= 0 ? '+' : '−';
        const absNano = BigInt(Math.floor(Math.abs(Number(combinedPrincipal) * diff)));
        return `${sign}${formatIotaWithFiat(absNano, currentPrice, selectedCurrency)} / year`;
    }

    function fmtPctValue(x: number, digits = 2): string {
        return `${(x * 100).toFixed(digits)}%`;
    }

    function handleSwitch() {
        if (!switchTarget || selectedStakeRefs.length === 0) return;
        onSwitch?.(selectedStakeRefs, switchTarget);
    }

    /** Pending-new-stake confirm: hand the intent off to the host, which
     *  builds + executes the transaction and clears `pendingNewStake` on
     *  success (so the banner disappears). */
    function handleConfirmNewStake() {
        if (!pendingNewStake || !switchTarget) return;
        onStakeNew?.(pendingNewStake.accountAddress, pendingNewStake.amountNano, switchTarget);
    }
    function handleCancelNewStake() {
        pendingNewStake = null;
    }
    /** Net APR of the auto/explicitly-picked target — used for the banner's
     *  "≈ X IOTA / year" preview. */
    let pendingTargetApr = $derived(switchTarget ? (aprByPool.get(switchTarget.poolId) ?? 0) : 0);
    let pendingYearlyText = $derived.by(() => {
        if (!pendingNewStake || pendingTargetApr <= 0) return '';
        const yearly = BigInt(Math.floor(Number(pendingNewStake.amountNano) * pendingTargetApr));
        return formatIotaWithFiat(yearly, currentPrice, selectedCurrency) + ' / year';
    });

    /** Switching is performed one PTB per sending account (a transaction can
     *  only have one sender). Surfacing the count makes the button label
     *  honest — "1 transaction" when all selected stakes share an account,
     *  "N transactions" when they span N accounts. */
    let switchTxCount = $derived.by(() => {
        const accounts = new Set<string>();
        for (const s of selectedStakeRefs) accounts.add(s.accountAddress);
        return accounts.size;
    });

    /** Width of the active window in epochs (mainnet ≈ 1 day each). Drives
     *  the "based on N-day window" annotation on the metrics card so users
     *  can see why the breakeven number changes with the timeframe. */
    let windowDays = $derived(Math.max(1, toEpoch - fromEpoch));

    /** External focus request (e.g. user clicked "Optimize" on a stake card).
     *  Open the section, jump into my-stake mode, replace the selection with
     *  just that stake, scroll into view, and clear the request so the same
     *  signal can fire again later for the same stake. */
    let detailsEl: HTMLDetailsElement | undefined = $state();
    $effect(() => {
        if (focusStakeRequest === null) return;
        untrack(() => {
            mode = 'my-stake';
            stakesInitialized = true;
            selectedStakeIds = new Set([focusStakeRequest!]);
            // Reset the target so the auto-pick effect suggests a fresh
            // best-alternative for the newly-focused stake instead of
            // sticking with whatever the user previously had.
            switchTargetAddress = '';
            switchTargetTouched = false;
            if (detailsEl) detailsEl.open = true;
            requestAnimationFrame(() => {
                detailsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            focusStakeRequest = null;
        });
    });

    /** Pending new-stake request from an AccountCard. Same focus mechanic as
     *  `focusStakeRequest`, but here we *clear* the existing-stake selection
     *  rather than replacing it — the user is staking fresh liquid IOTA, so
     *  there's no "stay" baseline to compare against. We do not clear
     *  `pendingNewStake` itself: the banner needs it to render, and the
     *  confirm/cancel handlers below own clearing. */
    $effect(() => {
        if (pendingNewStake === null) return;
        untrack(() => {
            mode = 'my-stake';
            stakesInitialized = true;
            selectedStakeIds = new Set();
            if (detailsEl) detailsEl.open = true;
            requestAnimationFrame(() => {
                detailsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    });

    /** Auto-pick a target validator when a new-stake intent arrives without
     *  one already chosen. Picks the highest-APR committee validator — same
     *  rationale as the existing-stake auto-pick (best alternative). The
     *  user can override via the Switch target dropdown. */
    $effect(() => {
        if (pendingNewStake === null) return;
        if (switchTargetAddress) return;
        if (validators.length === 0) return;
        untrack(() => {
            const best = validators
                .filter((v) => v.isCommittee)
                .map((v) => ({ v, apr: aprByPool.get(v.poolId) ?? 0 }))
                .sort((a, b) => b.apr - a.apr)[0];
            if (best) {
                switchTargetAddress = best.v.address;
                switchTargetTouched = true;
            }
        });
    });

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    onMount(buildChart);
    onDestroy(() => chart?.destroy());

    /** Rebuild on any input change. The dataset is small so a full rebuild
     *  is cheaper than computing a diff. Price/currency are captured in the
     *  tooltip closure, so they need to be in the dependency set too —
     *  otherwise the tooltip would keep rendering with stale fiat. */
    $effect(() => {
        void mode;
        void selectedStakeIds;
        void switchTargetAddress;
        void validators;
        void fromEpoch;
        void toEpoch;
        void userPoolIds;
        void userStakes;
        void topN;
        void projectionHorizon;
        void aprByPool;
        void currentPrice;
        void selectedCurrency;
        void pendingNewStake;
        if (canvas) buildChart();
    });

    /** Stable color palette. Returns the same color for the same index across
     *  rebuilds — important so toggling lines via the legend doesn't reshuffle
     *  colors. */
    const PALETTE = [
        '#34d399',
        '#f87171',
        '#60a5fa',
        '#fbbf24',
        '#a78bfa',
        '#22d3ee',
        '#f472b6',
        '#fb923c',
        '#4ade80',
        '#e879f9',
    ];
    function colorFor(i: number): string {
        return PALETTE[i % PALETTE.length];
    }

    function buildChart() {
        if (!canvas) return;
        if (chart) {
            chart.destroy();
            chart = null;
        }
        const datasets = mode === 'validators' ? buildValidatorsDatasets() : buildMyStakeDatasets();
        chart = new Chart(canvas, {
            type: 'line',
            data: { datasets },
            options: chartOptions(),
        });
    }

    function buildValidatorsDatasets() {
        // Pool composition: the top N committee validators by APR, unioned
        // with whichever ones the user is staked with. N is configurable —
        // 0 shows only the user's stakes, 'all' shows every committee
        // validator.
        const committee = validators.filter((v) => v.isCommittee);
        const sorted = [...committee].sort(
            (a, b) => (aprByPool.get(b.poolId) ?? 0) - (aprByPool.get(a.poolId) ?? 0),
        );
        let pool: ValidatorInfoFull[];
        if (topN === 'all') {
            pool = sorted;
        } else {
            const top = sorted.slice(0, topN);
            const userOnes = committee.filter((v) => userPoolIds.has(v.poolId));
            const seen = new Set<string>();
            pool = [...userOnes, ...top].filter((v) => {
                if (seen.has(v.address)) return false;
                seen.add(v.address);
                return true;
            });
        }
        return pool.map((v, i) => {
            // All-validators mode plots per-epoch returns (what each validator
            // earned in that single epoch), not the cumulative growth. Makes
            // it easy to compare raw daily yield and spot epochs with zero
            // earnings (e.g. validator downtime).
            const series = poolPerEpochReturnSeries(v.poolId, fromEpoch, toEpoch);
            const isUser = userPoolIds.has(v.poolId);
            return {
                label: v.name + (isUser ? ' (your stake)' : ''),
                data: series.map((p) => ({ x: p.epoch, y: p.returnFraction * 100 })),
                borderColor: colorFor(i),
                backgroundColor: 'transparent',
                tension: 0.05,
                pointRadius: 0,
                borderWidth: isUser ? 3 : 1.5,
                fill: false,
            };
        });
    }

    function buildMyStakeDatasets() {
        breakevenInfo = null;
        const selected = userStakes.filter((s) => selectedStakeIds.has(s.stakeId));

        // New-stake-only branch: no existing stake selected, but the user
        // requested a fresh stake from an AccountCard. Project the cumulative
        // return for the new stake at the target validator's APR/APY, starting
        // from zero at the current epoch with the protocol's activation gap.
        // Done before the early-return so callers don't need to check both
        // selection state and pendingNewStake.
        if (selected.length === 0 && pendingNewStake && switchTargetAddress) {
            return buildNewStakeProjection();
        }

        if (selected.length === 0) return [];

        const target = switchTargetAddress
            ? validators.find((v) => v.address === switchTargetAddress)
            : null;
        const oldApr = weightedOldApr(selected);
        const newApr = target ? (aprByPool.get(target.poolId) ?? 0) : 0;

        // Combined past series: principal-weighted average of each selected
        // stake's cumulative return at each epoch. Only epochs where every
        // selected stake has cached rate data contribute — this avoids
        // mixed-coverage epochs dragging the curve toward zero.
        const totalPrincipalNum = selected.reduce((s, x) => s + Number(x.principal), 0);
        const seriesPerStake = selected.map((s) => ({
            weight: Number(s.principal) / totalPrincipalNum,
            series: poolReturnSeries(s.validator.poolId, fromEpoch, toEpoch),
        }));
        const epochAccum = new Map<number, { sum: number; count: number }>();
        for (const { weight, series } of seriesPerStake) {
            for (const p of series) {
                const acc = epochAccum.get(p.epoch) ?? { sum: 0, count: 0 };
                acc.sum += weight * p.returnFraction;
                acc.count += 1;
                epochAccum.set(p.epoch, acc);
            }
        }
        const pastSeries = [...epochAccum.entries()]
            .filter(([, v]) => v.count === selected.length)
            .map(([epoch, v]) => ({ epoch, returnFraction: v.sum }))
            .sort((a, b) => a.epoch - b.epoch);

        const lastEpoch = pastSeries[pastSeries.length - 1]?.epoch ?? toEpoch;
        const lastReturn = pastSeries[pastSeries.length - 1]?.returnFraction ?? 0;

        // Projection horizon: 'auto' extends just past the breakeven so the
        // crossover is clearly visible (1.5× breakeven + 14 days, floor 90).
        // A numeric value pins the horizon to that exact day count so the
        // user can compare projections at the same scale across different
        // selections.
        const breakevenDays = target ? computeBreakevenDays(oldApr, newApr) : null;
        const horizonDays =
            projectionHorizon === 'auto'
                ? Math.max(90, breakevenDays !== null ? Math.ceil(breakevenDays * 1.5) + 14 : 0)
                : projectionHorizon;

        // Two distinct projections per scenario (Stay, Switch):
        //   APR = linear extrapolation: lastReturn + apr × t / 365
        //   APY = compounded growth: (1 + lastReturn) × (1 + apr/365)^t − 1
        // For typical staking returns over the projection horizon the gap
        // between the two is small (≈0.13pp at 1 year for 5% APR), but the
        // pool actually auto-compounds at every epoch, so the APY curve is
        // the realistic one. Plotting both lets users see by how much the
        // linear approximation undershoots.
        const stayAprPoints: { x: number; y: number }[] = [];
        const stayApyPoints: { x: number; y: number }[] = [];
        const switchAprPoints: { x: number; y: number }[] = [];
        const switchApyPoints: { x: number; y: number }[] = [];
        const diffPoints: { x: number; y: number }[] = [];
        const oneBase = 1 + lastReturn;
        for (let d = 0; d <= horizonDays; d++) {
            // The activation gap: for the first ACTIVATION_DELAY_DAYS the new
            // stake sits idle (no rewards), so its cumulative line stays flat
            // at the unstake-point value. After the gap it climbs at newApr.
            const eff = Math.max(0, d - ACTIVATION_DELAY_DAYS);

            const stayApr = lastReturn + (oldApr * d) / EPOCHS_PER_YEAR;
            const stayApy = oneBase * Math.pow(1 + oldApr / EPOCHS_PER_YEAR, d) - 1;
            const switchApr = lastReturn + (newApr * eff) / EPOCHS_PER_YEAR;
            const switchApy = oneBase * Math.pow(1 + newApr / EPOCHS_PER_YEAR, eff) - 1;

            const x = lastEpoch + d;
            stayAprPoints.push({ x, y: stayApr * 100 });
            stayApyPoints.push({ x, y: stayApy * 100 });
            switchAprPoints.push({ x, y: switchApr * 100 });
            switchApyPoints.push({ x, y: switchApy * 100 });
            // Difference uses the APY curves — that's the realistic gap a
            // delegator would actually realize. Negative during the gap,
            // positive once the higher APR/APY catches up.
            diffPoints.push({ x, y: (switchApy - stayApy) * 100 });
        }

        if (breakevenDays !== null) {
            breakevenInfo = {
                days: Math.ceil(breakevenDays),
                epoch: lastEpoch + Math.ceil(breakevenDays),
            };
        }

        const basketLabel =
            selected.length === 1
                ? selected[0].validator.name
                : `your basket (${selected.length} stakes)`;
        const fmtRate = (r: number) => `${(r * 100).toFixed(2)}%`;
        const datasets: any[] = [
            {
                label: `Realized — ${basketLabel} (APR ${fmtRate(oldApr)} / APY ${fmtRate(aprToApy(oldApr))})`,
                data: pastSeries.map((p) => ({ x: p.epoch, y: p.returnFraction * 100 })),
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                tension: 0.05,
                pointRadius: 0,
                borderWidth: 2.5,
                fill: false,
                yAxisID: 'y',
            },
            // Stay scenario — two lines:
            //   APR (linear): dashed, lighter shade = optimistic-floor view.
            //   APY (compounded): solid, deeper shade = realistic auto-compounding.
            // The eye reads "solid lines = what actually happens; dashed = the
            // linear approximation the headline APR number suggests".
            {
                label: `Stay — ${basketLabel} · APR ${fmtRate(oldApr)} (linear)`,
                data: stayAprPoints,
                borderColor: '#f87171',
                backgroundColor: 'transparent',
                tension: 0.1,
                pointRadius: 0,
                borderWidth: 1.5,
                borderDash: [5, 5],
                fill: false,
                yAxisID: 'y',
            },
            {
                label: `Stay — ${basketLabel} · APY ${fmtRate(aprToApy(oldApr))} (compounded)`,
                data: stayApyPoints,
                borderColor: '#dc2626',
                backgroundColor: 'transparent',
                tension: 0.1,
                pointRadius: 0,
                borderWidth: 2,
                fill: false,
                yAxisID: 'y',
            },
        ];
        if (target) {
            datasets.push(
                {
                    label: `Switch to ${target.name} · APR ${fmtRate(newApr)} (linear)`,
                    data: switchAprPoints,
                    borderColor: '#34d399',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    fill: false,
                    yAxisID: 'y',
                },
                {
                    label: `Switch to ${target.name} · APY ${fmtRate(aprToApy(newApr))} (compounded)`,
                    data: switchApyPoints,
                    borderColor: '#059669',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y',
                },
            );

            // Difference series goes on the secondary y-axis because the gap
            // (often a few hundredths of a percent) is dwarfed by the
            // cumulative-return scale and would otherwise render as a flat
            // line near the floor. Computed from APY (the realistic
            // compounded outcome) rather than APR.
            datasets.push({
                label: `Switch − Stay (APY, right axis)`,
                data: diffPoints,
                borderColor: '#fbbf24',
                backgroundColor: '#fbbf2422',
                tension: 0.1,
                pointRadius: 0,
                borderWidth: 1.5,
                fill: 'origin',
                yAxisID: 'yDiff',
            });

            // Vertical breakeven marker — a synthetic dataset of two points
            // at the same x and the y-bounds of the cumulative axis. Excluded
            // from the tooltip via filter (it has no semantic value, only
            // marks the position). Y-bounds use the APY curves since they
            // dominate the visible range.
            if (breakevenDays !== null) {
                const bx = lastEpoch + breakevenDays;
                const yMin = Math.min(...stayApyPoints.map((p) => p.y), 0);
                const yMax = Math.max(...switchApyPoints.map((p) => p.y));
                datasets.push({
                    label: `Breakeven (day +${Math.ceil(breakevenDays)})`,
                    data: [
                        { x: bx, y: yMin },
                        { x: bx, y: yMax },
                    ],
                    borderColor: '#fbbf24',
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    borderWidth: 1.5,
                    borderDash: [3, 4],
                    fill: false,
                    yAxisID: 'y',
                    // Custom marker so the tooltip filter below can drop it.
                    isBreakeven: true,
                });
            }
        }
        return datasets;
    }

    /** Project the cumulative return of a *new* stake at the chosen target
     *  validator. Differs from the switch projection in two ways:
     *    1. The starting value is 0 — there is no realized history to bridge
     *       from, so day 0 is the bottom of the chart.
     *    2. There is no "stay" comparison line and no breakeven — staking
     *       nothing yields nothing, so the comparison is degenerate.
     *  We still draw the dashed APR (linear) line alongside the solid APY
     *  (compounded) line so the user can see how compounding pulls ahead
     *  of the headline rate over the chosen horizon, mirroring how the
     *  switch projection presents both. */
    function buildNewStakeProjection() {
        if (!pendingNewStake) return [];
        const target = validators.find((v) => v.address === switchTargetAddress);
        if (!target) return [];

        const newApr = aprByPool.get(target.poolId) ?? 0;
        // 'auto' has no breakeven to anchor on for new stakes, so default to a
        // year. Numeric horizons pass through so the user can pin to 30 / 90
        // / 365 / etc. for cross-comparison with the switch view.
        const horizonDays = projectionHorizon === 'auto' ? 365 : projectionHorizon;
        const aprPoints: { x: number; y: number }[] = [];
        const apyPoints: { x: number; y: number }[] = [];
        for (let d = 0; d <= horizonDays; d++) {
            // Activation gap: identical to the switch projection — new stakes
            // earn nothing for the first ACTIVATION_DELAY_DAYS, then climb.
            const eff = Math.max(0, d - ACTIVATION_DELAY_DAYS);
            const aprY = (newApr * eff) / EPOCHS_PER_YEAR;
            const apyY = Math.pow(1 + newApr / EPOCHS_PER_YEAR, eff) - 1;
            const x = toEpoch + d;
            aprPoints.push({ x, y: aprY * 100 });
            apyPoints.push({ x, y: apyY * 100 });
        }

        const fmtRate = (r: number) => `${(r * 100).toFixed(2)}%`;
        return [
            {
                label: `New stake → ${target.name} · APR ${fmtRate(newApr)} (linear)`,
                data: aprPoints,
                borderColor: '#34d399',
                backgroundColor: 'transparent',
                tension: 0.1,
                pointRadius: 0,
                borderWidth: 1.5,
                borderDash: [5, 5],
                fill: false,
                yAxisID: 'y',
            },
            {
                label: `New stake → ${target.name} · APY ${fmtRate(aprToApy(newApr))} (compounded)`,
                data: apyPoints,
                borderColor: '#059669',
                backgroundColor: 'transparent',
                tension: 0.1,
                pointRadius: 0,
                borderWidth: 2,
                fill: false,
                yAxisID: 'y',
            },
        ];
    }

    function chartOptions() {
        const isStakeMode = mode === 'my-stake';
        // Combined principal used to convert tooltip percentages into IOTA
        // amounts. In new-stake-only mode there is no existing-stake selection
        // (it gets cleared when pendingNewStake lands), so the pending intent's
        // amount is what the projection lines are denominated in. We add both
        // anyway to keep the math right in a future where the user selects
        // existing stakes alongside a pending new-stake.
        const selectedPrincipalIota = userStakes
            .filter((s) => selectedStakeIds.has(s.stakeId))
            .reduce((sum, s) => sum + Number(s.principal) / 1e9, 0);
        const pendingPrincipalIota =
            isStakeMode && pendingNewStake ? Number(pendingNewStake.amountNano) / 1e9 : 0;
        const principalIota = isStakeMode ? selectedPrincipalIota + pendingPrincipalIota : 0;
        const priceRate = currentPrice
            ? selectedCurrency === 'USD'
                ? currentPrice.usd
                : currentPrice.eur
            : null;
        const fiatSym = selectedCurrency === 'USD' ? '$' : '€';
        return {
            responsive: true,
            maintainAspectRatio: false,
            // `mode: 'x'` (NOT 'index'!) groups tooltip items by their x
            // VALUE, which is what we want for a multi-line chart where the
            // datasets have different lengths (Realized covers past epochs,
            // projections cover future ones, etc.). With 'index' the tooltip
            // matches by *array position* — so e.g. realized[25] and
            // stayApy[25] would group together even though they're at very
            // different x values, and the title showed a misleading offset.
            interaction: {
                mode: 'x' as const,
                intersect: false,
            },
            scales: {
                x: { type: 'linear' as const, title: { display: true, text: 'Epoch' } },
                y: {
                    title: {
                        display: true,
                        text: isStakeMode
                            ? 'Cumulative net return (%)'
                            : 'Net return per epoch (%)',
                    },
                    position: 'left' as const,
                },
                ...(isStakeMode
                    ? {
                          yDiff: {
                              title: {
                                  display: true,
                                  text: 'Switch − Stay (pp)',
                              },
                              position: 'right' as const,
                              grid: { drawOnChartArea: false },
                          },
                      }
                    : {}),
            },
            plugins: {
                legend: {
                    display: true,
                    position: (mode === 'validators' ? 'right' : 'top') as 'right' | 'top',
                    labels: { font: { size: 11 } },
                },
                tooltip: {
                    // Match interaction.mode — see the comment up there for
                    // why 'index' is wrong for variable-length datasets.
                    mode: 'x' as const,
                    intersect: false,
                    // Hide the synthetic breakeven-marker dataset from the
                    // tooltip — it'd just show 0 / its boundary y values.
                    filter: (item: any) => !item.dataset?.isBreakeven,
                    callbacks: {
                        title: (items: any[]) => {
                            const x = items[0]?.parsed?.x;
                            if (x === undefined) return '';
                            // In stake-projection mode the chart spans past
                            // (realized) and future (projected) epochs. Annotate
                            // the title with the offset from "now" (= toEpoch,
                            // i.e. the current epoch on mainnet ≈ 1 day each).
                            // All-validators mode is purely historical, so the
                            // offset is always negative there — still useful to
                            // see "how recent is this point".
                            const offset = (x as number) - toEpoch;
                            let suffix: string;
                            if (offset === 0) suffix = 'today';
                            else if (offset > 0)
                                suffix = `+${offset} day${offset === 1 ? '' : 's'}`;
                            else suffix = `${-offset} day${-offset === 1 ? '' : 's'} ago`;
                            return `Epoch ${x} · ${suffix}`;
                        },
                        label: (ctx: any) => {
                            const v = ctx.parsed.y as number;
                            const isDiff = ctx.dataset.yAxisID === 'yDiff';
                            const pctSuffix = isDiff ? ' pp' : '%';
                            // For stake-projection mode the percentages map to
                            // IOTA on the user's principal. Surface that — and
                            // the fiat value — in the tooltip so the numbers
                            // are concrete, not abstract.
                            if (isStakeMode && principalIota > 0) {
                                const iotaAmount = principalIota * (v / 100);
                                const iotaStr = iotaAmount.toFixed(2);
                                const fiat =
                                    priceRate !== null
                                        ? ` (≈ ${fiatSym}${(iotaAmount * priceRate).toFixed(2)})`
                                        : '';
                                return `${ctx.dataset.label}: ${v.toFixed(3)}${pctSuffix} — ${iotaStr} IOTA${fiat}`;
                            }
                            return `${ctx.dataset.label}: ${v.toFixed(3)}${pctSuffix}`;
                        },
                    },
                },
                zoom: {
                    // Wheel + pinch zoom on both axes; drag-pans. Reset
                    // button below the chart restores the initial fit.
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy' as const,
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy' as const,
                    },
                },
            },
        };
    }

    function resetZoom() {
        chart?.resetZoom();
    }

    function fmtIota(nano: bigint): string {
        const [intPart, decPart = ''] = nanoToIota(nano.toString()).split('.');
        return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '_')}.${decPart.slice(0, 2).padEnd(2, '0')}`;
    }

    /** "1_234.56 IOTA · ≈ $123.45" — drops the fiat tail when there's no
     *  price. Used in the stake chips so users can see USD/EUR exposure
     *  alongside the IOTA amount when picking which to switch. */
    function fmtIotaFiat(nano: bigint): string {
        const iota = `${fmtIota(nano)} IOTA`;
        const f = fiatValueLocal(nano);
        return f ? `${iota} · ≈ ${f}` : iota;
    }
    function fiatValueLocal(nano: bigint): string {
        if (!currentPrice) return '';
        const rate = selectedCurrency === 'USD' ? currentPrice.usd : currentPrice.eur;
        const v = (Number(nano) / 1e9) * rate;
        const symbol = selectedCurrency === 'USD' ? '$' : '€';
        return `${symbol}${v.toFixed(2)}`;
    }
    function fmtCommission(v: ValidatorInfoFull): string {
        return `${(effectiveCommissionBps(v) / 100).toFixed(2)}% comm`;
    }

    /** Min/max effective commission across the loaded validator set. Used
     *  to map each chip's commission onto a green→red gradient so users can
     *  spot at a glance which stakes are at low- vs high-commission
     *  validators. */
    let commissionRange = $derived.by(() => {
        if (validators.length === 0) return { min: 0, max: 0 };
        let min = Infinity;
        let max = -Infinity;
        for (const v of validators) {
            const eff = effectiveCommissionBps(v);
            if (eff < min) min = eff;
            if (eff > max) max = eff;
        }
        return {
            min: min === Infinity ? 0 : min,
            max: max === -Infinity ? 0 : max,
        };
    });

    /** CSS color string for a chip's commission tint. Linearly interpolates
     *  hue from 142 (green-ish) at the lowest observed commission to 0 (red)
     *  at the highest. Saturation/lightness/alpha are tuned to be visible on
     *  the dark background without overpowering the chip text. Returns an
     *  empty string when there's no spread, so the chip falls back to the
     *  default neutral background. */
    function commissionTint(v: ValidatorInfoFull): string {
        const { min, max } = commissionRange;
        if (max === min) return '';
        const eff = effectiveCommissionBps(v);
        const t = Math.max(0, Math.min(1, (eff - min) / (max - min)));
        const hue = 142 * (1 - t);
        return `hsl(${hue}, 60%, 40%, 0.35)`;
    }
</script>

<details class="trend-section" open bind:this={detailsEl}>
    <summary>
        <span class="chevron" aria-hidden="true">▶</span>
        <span class="title">Net return over time</span>
        <span class="subtitle">
            {#if mode === 'validators'}
                {topN === 'all'
                    ? 'all committee'
                    : topN === 0
                      ? 'only your stakes'
                      : `top ${topN} + your stakes`}
            {:else if selectedStakeIds.size === 0}
                no stakes selected
            {:else if selectedStakeIds.size === 1}
                projection for 1 stake
            {:else}
                projection for {selectedStakeIds.size} stakes (combined)
            {/if}
        </span>
    </summary>

    <!-- Mode toggle on its own row above the per-mode controls. Keeps the
         "which view am I in" decision visually separate from the in-mode
         options (stake selection, switch target, projection horizon). -->
    <div class="mode-toggle-row">
        <div class="mode-toggle">
            <button
                class:active={mode === 'my-stake'}
                title={userStakes.length === 0
                    ? 'No stakes synced yet — Sync to load them, or compare validators in the other tab.'
                    : 'Pick one of your stakes and project stay vs switch.'}
                onclick={() => (mode = 'my-stake')}
            >
                My stake projection
            </button>
            <button class:active={mode === 'validators'} onclick={() => (mode = 'validators')}>
                All validators
            </button>
        </div>
    </div>

    <div class="chart-controls">
        {#if mode === 'validators'}
            <label class="select-row">
                Show:
                <select bind:value={topN}>
                    {#each TOP_N_OPTIONS as opt (opt.value)}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
                <span class="row-hint">+ your stakes (always)</span>
            </label>
        {:else if userStakes.length > 0}
            <!-- Stakes are toggled as chips (multi-select) so users can build
                 a basket without re-opening a dropdown for each addition.
                 Selected stakes are combined principal-weighted in the chart.

                 Stakes are grouped by validator so a single click can flip
                 every stake at one validator on/off. Individual stake chips
                 still allow per-stake control inside each group. -->
            <div class="stakes-controls">
                <div class="stakes-header">
                    <div class="stakes-actions">
                        <button
                            type="button"
                            class="chip-action"
                            onclick={selectAllStakes}
                            disabled={selectedStakeIds.size === userStakes.length}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            class="chip-action"
                            onclick={selectNoneStakes}
                            disabled={selectedStakeIds.size === 0}
                        >
                            None
                        </button>
                    </div>
                    <span class="chip-label">Stakes:</span>
                    <span class="stakes-hint">sorted by total IOTA, largest first</span>
                </div>
                <!-- One row per validator, stacked vertically. Order is
                     `stakeGroups` (largest total principal first) so the
                     biggest exposures sit at the top. -->
                <div class="stakes-list">
                    {#each stakeGroups as g (g.validator.address)}
                        {@const state = groupSelectionState(g)}
                        {#if g.stakes.length === 1}
                            <!-- Single-stake validator collapses into one chip;
                                 the group toggle and the stake toggle are the
                                 same action. -->
                            {@const s = g.stakes[0]}
                            <button
                                type="button"
                                class="chip stake-row-item"
                                class:selected={selectedStakeIds.has(s.stakeId)}
                                style="--commission-tint: {commissionTint(g.validator)}"
                                onclick={() => toggleStake(s.stakeId)}
                                title="{g.validator.name} — {fmtIotaFiat(
                                    s.principal,
                                )} · effective commission {fmtCommission(
                                    g.validator,
                                )} · click to toggle"
                            >
                                {g.validator.name} · {fmtIotaFiat(s.principal)} · {fmtCommission(
                                    g.validator,
                                )}
                            </button>
                        {:else}
                            <span class="stake-group stake-row-item">
                                <button
                                    type="button"
                                    class="chip group-toggle"
                                    class:all={state === 'all'}
                                    class:partial={state === 'partial'}
                                    style="--commission-tint: {commissionTint(g.validator)}"
                                    onclick={() => toggleGroup(g)}
                                    title="Toggle all {g.stakes.length} stakes at {g.validator
                                        .name} ({fmtIotaFiat(
                                        g.totalPrincipal,
                                    )} total · effective commission {fmtCommission(g.validator)})"
                                >
                                    {g.validator.name} · {g.stakes.length} stakes · {fmtIotaFiat(
                                        g.totalPrincipal,
                                    )} · {fmtCommission(g.validator)}
                                </button>
                                {#each g.stakes as s (s.stakeId)}
                                    <button
                                        type="button"
                                        class="chip stake-sub-chip"
                                        class:selected={selectedStakeIds.has(s.stakeId)}
                                        onclick={() => toggleStake(s.stakeId)}
                                        title="Click to toggle this single stake ({fmtIota(
                                            s.principal,
                                        )} IOTA)"
                                    >
                                        {fmtIota(s.principal)}
                                    </button>
                                {/each}
                            </span>
                        {/if}
                    {/each}
                </div>
            </div>

            <!-- Switch target: prev/next steps along the APR-sorted candidate
                 list (highest first). The dropdown is still there for direct
                 selection; the buttons make it one click to compare against
                 the next-best (or worse) validator. -->
            <div class="target-row">
                <span class="chip-label">Switch target:</span>
                <button
                    type="button"
                    class="nav-btn"
                    onclick={prevTarget}
                    disabled={targetCandidates.length === 0}
                    title="Previous candidate (higher APR)"
                    aria-label="Previous candidate"
                >
                    ◀
                </button>
                <select
                    bind:value={switchTargetAddress}
                    onchange={onTargetSelectChange}
                    class="target-select"
                >
                    <option value="">(none — only show stay)</option>
                    {#each targetCandidates as v (v.address)}
                        {@const candidateApr = aprByPool.get(v.poolId) ?? 0}
                        {@const candidateApy = aprToApy(candidateApr)}
                        {@const candidateBe = computeBreakevenDays(combinedOldApr, candidateApr)}
                        <option value={v.address}>
                            {v.name} — {(candidateApr * 100).toFixed(2)}% APR / {(
                                candidateApy * 100
                            ).toFixed(2)}% APY · {candidateBe === null
                                ? 'no breakeven'
                                : `≈ ${Math.ceil(candidateBe)} days breakeven`}
                        </option>
                    {/each}
                </select>
                <button
                    type="button"
                    class="nav-btn"
                    onclick={nextTarget}
                    disabled={targetCandidates.length === 0}
                    title="Next candidate (lower APR)"
                    aria-label="Next candidate"
                >
                    ▶
                </button>
                {#if targetIndex >= 0}
                    <span class="row-hint">
                        {targetIndex + 1} / {targetCandidates.length}
                    </span>
                {/if}
            </div>

            <!-- How far the stay/switch projection extends past the present.
                 Auto sizes itself around the breakeven so the crossover is
                 always on screen; numeric presets pin the horizon for
                 cross-selection comparisons. -->
            <label class="select-row">
                <span class="chip-label">Project:</span>
                <select bind:value={projectionHorizon} class="target-select">
                    {#each PROJECTION_HORIZON_OPTIONS as opt (opt.value)}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
            </label>
        {/if}
    </div>

    {#if mode === 'my-stake'}
        <div class="legend-hint">
            Solid blue = realized return on your selected stake{selectedStakeIds.size > 1
                ? 's (principal-weighted)'
                : ''}. Each scenario gets <strong>two projection lines</strong>: the dashed, lighter
            one is the linear <strong>APR</strong> extrapolation; the solid, deeper one is the
            compounded <strong>APY</strong> (what actually happens — the staking pool auto-compounds
            at every epoch). Red = stay; green = switch (flat for ≈1 epoch during activation, then
            climbs). Amber filled area = APY-based
            <em>switch − stay</em> on the right axis: negative during the activation gap, positive
            once the higher APY catches up.
            {#if breakevenInfo}
                <span class="breakeven-pill">
                    Breakeven at day +{breakevenInfo.days} (epoch {breakevenInfo.epoch})
                </span>
            {/if}
        </div>
    {/if}

    <div class="zoom-row">
        <span class="zoom-hint">Wheel/pinch to zoom · drag to pan</span>
        <button class="reset-button" onclick={resetZoom} title="Reset zoom and pan">
            Reset zoom
        </button>
    </div>

    {#if pendingNewStake}
        <!-- New-stake intent originated by an AccountCard click. Sits above
             the canvas as a confirm banner: shows what's about to be staked,
             from which account, to which validator (auto-picked or chosen
             via the Switch target dropdown), and the projected yearly yield
             at the target's net APR. The chart's existing-stake lines stay
             visible behind it so the user can compare against the rest of
             their portfolio while deciding. -->
        <div class="new-stake-banner">
            <div class="new-stake-summary">
                <span class="banner-tag">New stake</span>
                <strong>
                    {nanoToIota(pendingNewStake.amountNano.toString())} IOTA
                </strong>
                from <strong>{pendingNewStake.accountLabel}</strong>
                {#if switchTarget}
                    → <strong>{switchTarget.name}</strong>
                    <span class="banner-meta">
                        APR {fmtPctValue(pendingTargetApr)} · APY {fmtPctValue(
                            aprToApy(pendingTargetApr),
                        )}{pendingYearlyText ? ` · ≈ ${pendingYearlyText}` : ''}
                    </span>
                {:else}
                    <span class="banner-meta-warn">Pick a target validator below.</span>
                {/if}
            </div>
            <div class="new-stake-actions">
                <button type="button" class="banner-cancel" onclick={handleCancelNewStake}>
                    Cancel
                </button>
                <button
                    type="button"
                    class="banner-confirm"
                    disabled={!switchTarget || !onStakeNew}
                    onclick={handleConfirmNewStake}
                    title={switchTarget
                        ? `Stake to ${switchTarget.name}`
                        : 'Pick a target validator first'}
                >
                    Stake{switchTarget ? ` → ${switchTarget.name}` : ''}
                </button>
            </div>
        </div>
    {/if}

    <div class="chart-wrapper">
        <canvas bind:this={canvas}></canvas>
    </div>

    {#if mode === 'my-stake' && selectedStakeRefs.length > 0}
        <!-- Optimize-stake metrics + action — merged from the old standalone
             OptimizePanel so users have everything (chart, projections, the
             actual decision values, and the Switch button) in one place. -->
        <div class="optimize-section">
            <!-- All four cards' APR numbers come from the timeframe-specific
                 window. The smaller the window, the noisier the APR — and
                 therefore the noisier the breakeven. Surfacing the window
                 here makes the source of these numbers unambiguous. -->
            <div class="metrics-context">
                Numbers below are derived from the selected timeframe ({windowDays} epochs ≈
                {windowDays} days). Shorter windows give noisier APR estimates and therefore noisier breakeven
                numbers — pick a longer window for a more stable read.
            </div>
            <div class="metrics">
                <div class="metric">
                    <div class="label">Current net APR / APY</div>
                    <div class="value">{fmtPctValue(combinedOldApr)}</div>
                    <div class="sub-value">
                        APY {fmtPctValue(aprToApy(combinedOldApr))} · {aprToYearlyText(
                            combinedOldApr,
                        )}
                    </div>
                </div>
                <div class="metric">
                    <div class="label">
                        Target net APR / APY
                        {#if switchTarget}
                            <span class="commission-line">
                                {switchTarget.name} · effective commission
                                {fmtPctValue(effectiveCommissionBps(switchTarget) / 10000)}
                            </span>
                        {/if}
                    </div>
                    <div class="value highlight">
                        {switchTarget ? fmtPctValue(switchTargetApr) : '—'}
                    </div>
                    <div class="sub-value">
                        {switchTarget
                            ? `APY ${fmtPctValue(aprToApy(switchTargetApr))} · ${aprToYearlyText(switchTargetApr)}`
                            : ''}
                    </div>
                </div>
                <div class="metric">
                    <div class="label">Yearly difference</div>
                    <div class="value" class:highlight={switchTargetApr > combinedOldApr}>
                        {switchTarget ? aprDiffYearlyText() : '—'}
                    </div>
                    <div class="sub-value">on selected basket</div>
                </div>
                <div class="metric">
                    <div class="label">Breakeven</div>
                    <div class="value">
                        {#if projectionBreakeven === null}
                            —
                        {:else}
                            ≈ {Math.ceil(projectionBreakeven)} days
                        {/if}
                    </div>
                    <div class="sub-value">
                        {ACTIVATION_DELAY_DAYS} epoch activation delay · based on
                        {windowDays}-day window
                    </div>
                </div>
            </div>

            <div class="optimize-actions">
                <button
                    type="button"
                    class="primary"
                    disabled={!switchTarget ||
                        projectionBreakeven === null ||
                        selectedStakeRefs.length === 0 ||
                        !onSwitch}
                    onclick={handleSwitch}
                    title={!switchTarget
                        ? 'Pick a switch target first.'
                        : projectionBreakeven === null
                          ? 'Switching to this validator would not be profitable in the chosen window.'
                          : `Build one PTB per sending account: ${switchTxCount} transaction(s) covering ${selectedStakeRefs.length} stake(s), all re-staked to ${switchTarget.name}.`}
                >
                    Switch {selectedStakeRefs.length === 1
                        ? '1 stake'
                        : `${selectedStakeRefs.length} stakes`} in {switchTxCount === 1
                        ? '1 transaction'
                        : `${switchTxCount} transactions`}
                </button>
            </div>

            <div class="optimize-note">
                The protocol activates new stakes at the next epoch boundary, so switched principal
                earns nothing for ≈1 epoch — that loss is what the breakeven calculation accounts
                for. A transaction can only have one sender, so stakes from different accounts are
                bundled into one PTB per account ({switchTxCount}
                {switchTxCount === 1 ? 'transaction' : 'transactions'} for the current selection).
            </div>
        </div>
    {/if}
</details>

<style>
    .trend-section {
        margin: 0.5rem 0;
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
    }

    .trend-section summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        user-select: none;
    }

    .trend-section summary::-webkit-details-marker {
        display: none;
    }
    .trend-section summary::marker {
        content: '';
    }

    .chevron {
        display: inline-block;
        width: 1em;
        font-size: 0.7rem;
        color: var(--text-muted);
        transition: transform 0.15s ease;
    }

    .trend-section[open] > summary .chevron {
        transform: rotate(90deg);
    }

    .title {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .chart-controls {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        align-items: center;
        margin: 0.5rem 0;
        font-size: 0.85rem;
    }

    .mode-toggle {
        display: inline-flex;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
    }

    .mode-toggle button {
        background: transparent;
        color: var(--text-muted);
        border: none;
        padding: 0.3rem 0.7rem;
        cursor: pointer;
        font-size: 0.85rem;
    }

    .mode-toggle button:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.05);
    }

    .mode-toggle button.active {
        background: #059669;
        color: white;
    }

    .mode-toggle button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .select-row {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }

    .row-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-style: italic;
    }

    /* Chip group used to build the multi-stake selection. Clickable buttons
       that visually toggle their "selected" state — saves the user from
       opening a dropdown for every change. */
    .target-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
    }

    /* Stakes are now stacked vertically (one validator per line) so users can
       scan top-to-bottom by exposure size. The header row still keeps the
       label + action buttons together horizontally. */
    .stakes-controls {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-size: 0.85rem;
    }

    .stakes-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .stakes-hint {
        font-size: 0.72rem;
        color: var(--text-muted);
        font-style: italic;
    }

    .stakes-actions {
        display: flex;
        gap: 0.35rem;
    }

    .mode-toggle-row {
        margin-bottom: 0.5rem;
    }

    .stakes-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
    }

    /* Each row item is the chip (single-stake) or the stake-group container
       (multi-stake). `align-items: flex-start` on the parent keeps them
       compact rather than stretching to full width. */
    .stake-row-item {
        max-width: 100%;
    }

    .chip-label {
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    .chip {
        font-size: 0.78rem;
        padding: 0.2rem 0.6rem;
        /* `--commission-tint` is set inline based on each validator's
           effective commission. Falls back to the neutral grey when no tint
           is set (validator-less chips, action chips, etc.). The selected /
           group-state classes below have higher specificity and override
           the tint when active. */
        background: var(--commission-tint, rgba(255, 255, 255, 0.04));
        color: var(--text-muted);
        border: 1px solid var(--border-color);
        border-radius: 999px;
        cursor: pointer;
        white-space: nowrap;
        transition:
            background 0.15s,
            color 0.15s,
            border-color 0.15s;
    }

    .chip:hover {
        /* Plain hover bg deliberately discards the commission tint — gives
           a clear "you are hovering" visual without losing the selection
           contrast. The tint is the resting state, not the active one. */
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
    }

    .chip.selected {
        /* Selection is signaled purely by the border so the commission tint
           (set via `--commission-tint`) stays visible — letting the user see
           which selected stakes are at high-commission validators at a
           glance. The box-shadow adds a second pixel of blue ring without
           shifting layout. */
        border-color: rgba(59, 130, 246, 0.9);
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.45);
    }

    /* Visual unit for a multi-stake validator: the group-toggle chip is
       followed inline by per-stake sub-chips, sharing a subtle background so
       the relationship is clear. */
    .stake-group {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem;
        padding: 0.15rem 0.35rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: 999px;
    }

    .group-toggle {
        font-weight: 500;
        /* Inherits `--commission-tint` from the chip-level rule when not
           in the all/partial states. Default fallback ensures it stays
           visible if no tint is computed yet. */
        background: var(--commission-tint, rgba(255, 255, 255, 0.04));
    }

    .group-toggle.all {
        /* Same approach as `.chip.selected` — let the commission tint show
           through, signal "all selected" via the bright blue border ring. */
        border-color: rgba(59, 130, 246, 0.9);
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.45);
    }

    /* "partial" = some-but-not-all stakes selected. Dashed border keeps it
       distinguishable from the solid-bordered fully-selected state, with
       the commission tint still visible underneath. */
    .group-toggle.partial {
        border: 1px dashed rgba(59, 130, 246, 0.9);
    }

    .stake-sub-chip {
        font-size: 0.72rem;
        padding: 0.1rem 0.5rem;
    }

    .chip-action {
        font-size: 0.72rem;
        padding: 0.2rem 0.6rem;
        background: transparent;
        color: var(--text-muted);
        border: 1px dashed var(--border-color);
        border-radius: 999px;
        cursor: pointer;
    }

    .chip-action:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-color);
    }

    .chip-action:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

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

    .target-select {
        background-color: #232324;
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        padding: 0.25rem 0.4rem;
        font-size: 0.85rem;
        max-width: 28rem;
    }

    /* New-stake confirm banner — sits above the canvas when an AccountCard
       requests a stake. Distinct (green-tinted, bordered) so it doesn't get
       lost between the dense control row and the chart itself. */
    .new-stake-banner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.6rem;
        padding: 0.5rem 0.75rem;
        margin: 0.4rem 0;
        background: rgba(74, 222, 128, 0.08);
        border: 1px solid rgba(74, 222, 128, 0.4);
        border-radius: 6px;
        font-size: 0.8rem;
    }

    .new-stake-summary {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.4rem;
    }

    .banner-tag {
        background: rgba(74, 222, 128, 0.25);
        border: 1px solid rgba(74, 222, 128, 0.45);
        color: #bbf7d0;
        padding: 0.05rem 0.4rem;
        border-radius: 999px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .banner-meta {
        color: var(--text-muted);
        font-size: 0.75rem;
    }

    .banner-meta-warn {
        color: #fbbf24;
        font-size: 0.75rem;
    }

    .new-stake-actions {
        display: flex;
        gap: 0.4rem;
    }

    .banner-cancel,
    .banner-confirm {
        font-size: 0.78rem;
        padding: 0.25rem 0.6rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .banner-cancel {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--border-color);
        color: inherit;
    }

    .banner-cancel:hover {
        background: rgba(255, 255, 255, 0.12);
    }

    .banner-confirm {
        background: rgba(74, 222, 128, 0.22);
        border: 1px solid rgba(74, 222, 128, 0.55);
        color: #bbf7d0;
        font-weight: 600;
    }

    .banner-confirm:hover:not(:disabled) {
        background: rgba(74, 222, 128, 0.35);
    }

    .banner-confirm:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Metrics + action area below the chart, merged in from the old
       OptimizePanel. Visual style matches the metric cards there so the
       transition is invisible to users who used to see both. */
    .optimize-section {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .metrics-context {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-style: italic;
        line-height: 1.4;
    }

    .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.5rem;
    }

    .metric {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.4rem 0.6rem;
    }

    .metric .label {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .metric .commission-line {
        display: block;
        font-size: 0.65rem;
        font-style: italic;
        opacity: 0.85;
    }

    .metric .value {
        font-family: monospace;
        font-size: 0.95rem;
        margin-top: 0.15rem;
    }

    .metric .value.highlight {
        color: #34d399;
        font-weight: 600;
    }

    .metric .sub-value {
        font-size: 0.7rem;
        color: var(--text-muted);
        margin-top: 0.15rem;
        font-family: monospace;
    }

    .optimize-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .optimize-actions .primary {
        padding: 0.45rem 0.9rem;
        background: #059669;
        color: white;
        border: 1px solid #047857;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .optimize-actions .primary:hover:not(:disabled) {
        background: #047857;
    }

    .optimize-actions .primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .optimize-note {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-style: italic;
    }

    .select-row select {
        background-color: #232324;
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        padding: 0.25rem 0.4rem;
        font-size: 0.85rem;
        max-width: 28rem;
    }

    .legend-hint {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }

    .breakeven-pill {
        display: inline-block;
        margin-left: 0.4rem;
        padding: 0.05rem 0.5rem;
        font-size: 0.75rem;
        background: rgba(251, 191, 36, 0.15);
        color: #fbbf24;
        border-radius: 999px;
        font-weight: 500;
    }

    .chart-wrapper {
        height: 320px;
        position: relative;
    }

    .zoom-row {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .zoom-hint {
        font-size: 0.72rem;
        color: var(--text-muted);
        font-style: italic;
    }

    .reset-button {
        padding: 0.15rem 0.5rem;
        font-size: 0.72rem;
        background: rgba(5, 150, 105, 0.2);
        color: #34d399;
        border: 1px solid rgba(5, 150, 105, 0.4);
        border-radius: 4px;
        cursor: pointer;
    }

    .reset-button:hover {
        background: rgba(5, 150, 105, 0.35);
    }
</style>

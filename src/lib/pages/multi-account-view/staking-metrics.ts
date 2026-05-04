import { getIotaAmount, getTokenAmount } from '../staking-rewards/compute/utils';
import { exchangeRateCache } from '../staking-rewards/graphql-requests';

/** Mainnet has ≈24h epochs, so this is a reasonable annualization constant.
 *  If/when other networks are supported with different epoch lengths, plumb
 *  this through from network config instead. */
export const EPOCHS_PER_YEAR = 365;

/** One epoch of unproductive activation delay between an unstake transaction
 *  and the new stake actually earning. ~1 day on mainnet. */
export const ACTIVATION_DELAY_DAYS = 1;

/** Reference principal used for synthetic APR computations — large enough to
 *  avoid bigint truncation when multiplied by exchange-rate ratios. */
const REFERENCE_PRINCIPAL_NANO = 1_000_000_000_000_000n; // 1e15 nano = 1e6 IOTA

export type CachedRate = { iota: string; pool: string };

/** Available time-frame presets for the staking view. Kept separate from the
 *  TimeFrame type in ../staking-rewards because that one supports custom date
 *  ranges (which we don't need here). */
export type StakingTimeFrame =
    | 'last-1-day'
    | 'last-7-days'
    | 'last-15-days'
    | 'last-30-days'
    | 'last-50-days'
    | 'last-90-days'
    | 'all';

export const STAKING_TIME_FRAME_LABELS: Record<StakingTimeFrame, string> = {
    'last-1-day': 'Last 1 day',
    'last-7-days': 'Last 7 days',
    'last-15-days': 'Last 15 days',
    'last-30-days': 'Last 30 days',
    'last-50-days': 'Last 50 days',
    'last-90-days': 'Last 90 days',
    all: 'All time',
};

export const STAKING_TIME_FRAME_DAYS: Record<StakingTimeFrame, number | null> = {
    'last-1-day': 1,
    'last-7-days': 7,
    'last-15-days': 15,
    'last-30-days': 30,
    'last-50-days': 50,
    'last-90-days': 90,
    all: null,
};

/** The cache stores rates with a +1 epoch offset (the rate effective at logical
 *  epoch E is keyed at E+1, because rates are computed at the *end* of an epoch
 *  and inserted under the next epoch's index — see the comment on
 *  fetchPoolExchangeRates in staking-rewards/graphql-requests.ts).
 *
 *  This helper hides that offset and returns the rate active at the requested
 *  logical epoch, or null if not cached. */
export function getCachedRate(poolId: string, logicalEpoch: number): CachedRate | null {
    const entry = exchangeRateCache.get(poolId);
    if (!entry) return null;
    return entry.epochData[logicalEpoch + 1] ?? null;
}

/** Find the closest cached rate at-or-before the requested epoch. Used as a
 *  fallback when the exact requested epoch hasn't been fetched (e.g. the
 *  window starts at an epoch we don't have). */
export function findClosestCachedRate(
    poolId: string,
    targetEpoch: number,
): { rate: CachedRate; epoch: number } | null {
    const entry = exchangeRateCache.get(poolId);
    if (!entry) return null;
    let bestLogical = -1;
    for (const k of Object.keys(entry.epochData)) {
        const logical = parseInt(k) - 1;
        if (logical <= targetEpoch && logical > bestLogical) bestLogical = logical;
    }
    if (bestLogical === -1) return null;
    return { rate: entry.epochData[bestLogical + 1], epoch: bestLogical };
}

/** Earliest cached rate for a pool. Used as a forward fallback when the
 *  caller wants a rate at an epoch that *precedes* the pool's first cached
 *  data — e.g. an "all time" window with `fromEpoch = 1` against a pool
 *  whose first entry is at epoch 100. Without this, the closest-before
 *  lookup returns null and the APR comes out as 0. */
export function findEarliestCachedRate(
    poolId: string,
): { rate: CachedRate; epoch: number } | null {
    const entry = exchangeRateCache.get(poolId);
    if (!entry) return null;
    let earliest = Infinity;
    for (const k of Object.keys(entry.epochData)) {
        const logical = parseInt(k) - 1;
        if (logical < earliest) earliest = logical;
    }
    if (earliest === Infinity) return null;
    return { rate: entry.epochData[earliest + 1], epoch: earliest };
}

/** Resolve a rate at logical epoch E, falling back in this priority order:
 *  1) exact match, 2) closest at-or-before E, 3) earliest cached entry.
 *  Step 3 is what makes "all time" computations work for pools whose
 *  history doesn't reach back to epoch 1. Returns null only if the pool
 *  has no rates at all. */
export function resolveRate(poolId: string, logicalEpoch: number): CachedRate | null {
    return (
        getCachedRate(poolId, logicalEpoch) ??
        findClosestCachedRate(poolId, logicalEpoch)?.rate ??
        findEarliestCachedRate(poolId)?.rate ??
        null
    );
}

/** Like `resolveRate` but also reports the *actual* epoch the returned rate
 *  came from — important for window-length calculations: an all-time window
 *  asking for `fromEpoch=1` against a pool starting at epoch 100 must
 *  annualize over (toEpoch − 100), not (toEpoch − 1). */
function resolveRateWithEpoch(
    poolId: string,
    logicalEpoch: number,
): { rate: CachedRate; epoch: number } | null {
    const exact = getCachedRate(poolId, logicalEpoch);
    if (exact) return { rate: exact, epoch: logicalEpoch };
    return (
        findClosestCachedRate(poolId, logicalEpoch) ??
        findEarliestCachedRate(poolId) ??
        null
    );
}

/** Cumulative net return per epoch for a pool, baselined at `fromEpoch`.
 *  Each point is `{ epoch, returnFraction }` where returnFraction is the
 *  growth of one IOTA staked at fromEpoch (e.g. 0.0123 = +1.23%).
 *
 *  Only epochs that have an *exact* cached rate produce a point — missing
 *  epochs are skipped rather than papered over with the closest-rate
 *  fallback, otherwise the line would show artificial flat segments.
 *
 *  For very long windows the series is strided to keep the chart point
 *  count manageable (cap ≈200 points). */
export function poolReturnSeries(
    poolId: string,
    fromEpoch: number,
    toEpoch: number,
): Array<{ epoch: number; returnFraction: number }> {
    if (toEpoch <= fromEpoch) return [];
    const baseline = resolveRate(poolId, fromEpoch);
    if (!baseline) return [];
    const baselineTokens = getTokenAmount(baseline, REFERENCE_PRINCIPAL_NANO);

    const stride = Math.max(1, Math.ceil((toEpoch - fromEpoch) / 200));
    const points: Array<{ epoch: number; returnFraction: number }> = [];
    for (let e = fromEpoch; e <= toEpoch; e += stride) {
        const rate = getCachedRate(poolId, e);
        if (!rate) continue;
        const value = getIotaAmount(rate, baselineTokens);
        const ret =
            value > REFERENCE_PRINCIPAL_NANO
                ? Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO)
                : 0;
        points.push({ epoch: e, returnFraction: ret });
    }
    return points;
}

/** Per-epoch net return for a pool. Each point is the return earned in that
 *  single epoch (R(E) / R(E−1) − 1), not a cumulative figure — useful for
 *  comparing validators' raw daily yield and for spotting epochs where a
 *  validator earned nothing (downtime).
 *
 *  Only epochs that have an exact cached rate AND a cached predecessor
 *  produce a point; missing epochs are skipped (the line will have gaps
 *  rather than artificial zero-return spikes). Strided to ≈200 points max. */
export function poolPerEpochReturnSeries(
    poolId: string,
    fromEpoch: number,
    toEpoch: number,
): Array<{ epoch: number; returnFraction: number }> {
    if (toEpoch <= fromEpoch) return [];
    const stride = Math.max(1, Math.ceil((toEpoch - fromEpoch) / 200));
    const points: Array<{ epoch: number; returnFraction: number }> = [];
    for (let e = fromEpoch; e <= toEpoch; e += stride) {
        const rPrev = getCachedRate(poolId, e - 1);
        const rNow = getCachedRate(poolId, e);
        if (!rPrev || !rNow) continue;
        // Synthetic 1e15-nano stake passed through both rates to compute the
        // per-epoch growth, mirroring the technique used in
        // poolNetAprOverWindow but over a single-epoch window.
        const tokens = getTokenAmount(rPrev, REFERENCE_PRINCIPAL_NANO);
        const value = getIotaAmount(rNow, tokens);
        const ret =
            value > REFERENCE_PRINCIPAL_NANO
                ? Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO)
                : 0;
        points.push({ epoch: e, returnFraction: ret });
    }
    return points;
}

/** Adjust a requested [fromEpoch, toEpoch] so it lands on epochs we actually
 *  have cached rates for, then return the resolved start/end pair. Two
 *  things this handles:
 *
 *    1. **Current epoch is in progress** → its rate hasn't been computed yet,
 *       so resolving toEpoch falls back to the most recent completed epoch.
 *       To preserve the user's requested window length, we shift `fromEpoch`
 *       back by the same gap. Without this the 1-day window would compare
 *       `rate(N-1)` to `rate(N-1)` (both fall back to the same point) and
 *       always return 0% APR; longer windows would compute the correct
 *       growth but annualize over too many days, slightly underestimating.
 *    2. **Pool didn't exist at fromEpoch** → start falls forward to the
 *       earliest cached rate. The "all time" case relies on this.
 *
 *  Returns null when either end can't be resolved or the resolved span has
 *  zero length (no measurable growth available). */
function resolveWindow(
    poolId: string,
    fromEpoch: number,
    toEpoch: number,
): { start: { rate: CachedRate; epoch: number }; end: { rate: CachedRate; epoch: number } } | null {
    if (toEpoch <= fromEpoch) return null;
    const end = resolveRateWithEpoch(poolId, toEpoch);
    if (!end) return null;
    const gap = Math.max(0, toEpoch - end.epoch);
    const adjustedFrom = Math.max(1, fromEpoch - gap);
    const start = resolveRateWithEpoch(poolId, adjustedFrom);
    if (!start) return null;
    if (end.epoch <= start.epoch) return null;
    return { start, end };
}

/** Net APR (annualized) over the given window for a pool. The exchange rate
 *  already encodes commission, so this is what a *delegator* would have
 *  realized. Returns 0 when data is missing or the window can't be made
 *  positive. Annualization uses the *actual* completed-epoch span (see
 *  `resolveWindow`). */
export function poolNetAprOverWindow(poolId: string, fromEpoch: number, toEpoch: number): number {
    const w = resolveWindow(poolId, fromEpoch, toEpoch);
    if (!w) return 0;
    const tokens = getTokenAmount(w.start.rate, REFERENCE_PRINCIPAL_NANO);
    const value = getIotaAmount(w.end.rate, tokens);
    if (value <= REFERENCE_PRINCIPAL_NANO) return 0;
    const periodReturn =
        Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO);
    const epochsInWindow = w.end.epoch - w.start.epoch;
    return (periodReturn * EPOCHS_PER_YEAR) / epochsInWindow;
}

/** Window-only return (not annualized) as a fraction. Same window-resolution
 *  rules as `poolNetAprOverWindow`. */
export function poolReturnOverWindow(poolId: string, fromEpoch: number, toEpoch: number): number {
    const w = resolveWindow(poolId, fromEpoch, toEpoch);
    if (!w) return 0;
    const tokens = getTokenAmount(w.start.rate, REFERENCE_PRINCIPAL_NANO);
    const value = getIotaAmount(w.end.rate, tokens);
    if (value <= REFERENCE_PRINCIPAL_NANO) return 0;
    return Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO);
}

/** Compute realized rewards (in nano-IOTA) for a single stake over a window.
 *  - principal: nano-IOTA at activation
 *  - activationEpoch: logical epoch when the stake activated
 *  - fromEpoch / toEpoch: window endpoints (logical epochs)
 *
 *  When activationEpoch > fromEpoch the window is clipped to start at activation
 *  (a stake can't earn before it exists). */
export function stakeRewardsInWindow(
    poolId: string,
    principal: bigint,
    activationEpoch: number,
    fromEpoch: number,
    toEpoch: number,
): bigint {
    const startEpoch = Math.max(fromEpoch, activationEpoch);
    if (toEpoch <= startEpoch) return 0n;

    // Convention matches ../staking-rewards/compute/rewards-calculator.ts:
    // baseline = activation - 1 (rate at the boundary into the activation epoch).
    const rBaseline = resolveRate(poolId, activationEpoch - 1);
    const rStart = resolveRate(poolId, startEpoch);
    const rEnd = resolveRate(poolId, toEpoch);
    if (!rBaseline || !rStart || !rEnd) return 0n;

    const tokens = getTokenAmount(rBaseline, principal);
    const valueAtStart = getIotaAmount(rStart, tokens);
    const valueAtEnd = getIotaAmount(rEnd, tokens);
    return valueAtEnd > valueAtStart ? valueAtEnd - valueAtStart : 0n;
}

/** Total accumulated rewards from activation to current (window-independent)
 *  using the latest cached rate. Useful as the "all-time" view. */
export function stakeAccumulatedRewards(
    poolId: string,
    principal: bigint,
    activationEpoch: number,
    currentEpoch: number,
): bigint {
    return stakeRewardsInWindow(poolId, principal, activationEpoch, activationEpoch, currentEpoch);
}

/** Convert an annualized linear rate (APR) to its compounded equivalent
 *  (APY). On IOTA mainnet the natural compounding period is one epoch
 *  (≈1 day), so we use 365 compounding periods per year by default —
 *  matching the staking pool's auto-compounding behavior (pool tokens stay
 *  the same; their IOTA value grows each epoch).
 *
 *  For typical staking returns (~5% APR) the difference is ~0.13pp; for
 *  very-low or zero APR it's negligible, but exposing both lets users see
 *  the more accurate compounded yield. */
export function aprToApy(apr: number, compoundsPerYear: number = EPOCHS_PER_YEAR): number {
    if (apr <= 0) return apr;
    return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1;
}

/** Days until cumulative new-validator earnings catch up with cumulative old.
 *  Assumes one epoch (~1 day) of activation delay where the new stake earns
 *  nothing. Returns null when newApr <= oldApr (switching is never profitable). */
export function computeBreakevenDays(
    oldApr: number,
    newApr: number,
    delayDays = ACTIVATION_DELAY_DAYS,
): number | null {
    if (newApr <= oldApr) return null;
    return (newApr * delayDays) / (newApr - oldApr);
}

/** Project incremental rewards over a horizon for both options.
 *  - stay(t)   = principal × old_apr × t / 365
 *  - switch(t) = max(0, principal × new_apr × (t-delay) / 365)
 *
 *  Returns nano-IOTA values for direct chart plotting. */
export function projectStayVsSwitch(
    principal: bigint,
    oldApr: number,
    newApr: number,
    horizonDays: number,
    stepDays = 1,
    delayDays = ACTIVATION_DELAY_DAYS,
): Array<{ day: number; stay: number; switchVal: number }> {
    const points: Array<{ day: number; stay: number; switchVal: number }> = [];
    const principalNum = Number(principal);
    for (let t = 0; t <= horizonDays; t += stepDays) {
        const stay = (principalNum * oldApr * t) / EPOCHS_PER_YEAR;
        const eff = Math.max(0, t - delayDays);
        const switchVal = (principalNum * newApr * eff) / EPOCHS_PER_YEAR;
        points.push({ day: t, stay, switchVal });
    }
    return points;
}

/** Resolve a [fromEpoch, toEpoch] range for a staking time-frame. We map days
 *  → epochs 1:1 since mainnet epochs are ≈24h. For "all" we return [1, current]. */
export function timeFrameToEpochRange(
    timeFrame: StakingTimeFrame,
    currentEpoch: number,
): { fromEpoch: number; toEpoch: number } {
    const days = STAKING_TIME_FRAME_DAYS[timeFrame];
    if (days === null) return { fromEpoch: 1, toEpoch: currentEpoch };
    return { fromEpoch: Math.max(1, currentEpoch - days), toEpoch: currentEpoch };
}

/** Days covered by the chosen time-frame, used for annualization conversions. */
export function timeFrameDays(timeFrame: StakingTimeFrame, currentEpoch: number): number {
    const days = STAKING_TIME_FRAME_DAYS[timeFrame];
    return days ?? Math.max(1, currentEpoch - 1);
}

/**
 * Time frame filtering utilities for staking rewards.
 * Provides date range presets and epoch filtering by timestamp.
 */

export type TimeFrame =
    | 'all'
    | 'last-3-days'
    | 'last-7-days'
    | 'last-month'
    | 'last-quarter'
    | 'ytd'
    | 'custom'
    | 'custom-epochs';

export type DateRange = {
    start: Date;
    end: Date;
};

export type EpochRange = {
    start: number;
    end: number;
};

export const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
    all: 'All time',
    'last-3-days': 'Last 3 days',
    'last-7-days': 'Last 7 days',
    'last-month': 'Last month',
    'last-quarter': 'Last quarter',
    ytd: 'Year to date',
    custom: 'Custom dates',
    'custom-epochs': 'Custom epochs',
};

/**
 * Compute the date range for a given time frame preset.
 * "Last 7 days" = rolling 7-day window ending at the reference instant
 *                 (start is midnight local time 7 days ago).
 * "Last month" = previous calendar month.
 * "Last quarter" = previous calendar quarter (Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec).
 * "YTD" = January 1 of current year through today.
 */
export function getTimeFrameDateRange(
    timeFrame: TimeFrame,
    referenceDate?: Date,
): DateRange | null {
    if (timeFrame === 'all' || timeFrame === 'custom') return null;

    const now = referenceDate ?? new Date();

    switch (timeFrame) {
        case 'last-3-days': {
            // Start at midnight 2 days ago so the window covers 3 full days
            // including today (mirrors the "last-7-days" arithmetic).
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
            return { start, end: now };
        }
        case 'last-7-days': {
            // Start at midnight 6 days ago so the window covers 7 full days
            // including today. Date arithmetic via the Date ctor normalizes
            // month/year rollover automatically.
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
            return { start, end: now };
        }
        case 'last-month': {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            return { start, end };
        }
        case 'last-quarter': {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
            const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
            const start = new Date(year, prevQuarter * 3, 1);
            const end = new Date(year, prevQuarter * 3 + 3, 0, 23, 59, 59, 999);
            return { start, end };
        }
        case 'ytd': {
            const start = new Date(now.getFullYear(), 0, 1);
            const end = now;
            return { start, end };
        }
        default:
            return null;
    }
}

/**
 * Filter an array of epoch numbers by a time frame using epoch timestamps.
 * Returns only epochs whose end timestamp falls within the computed date range.
 * For 'custom-epochs', filters by direct epoch number bounds instead.
 */
export function filterEpochsByTimeFrame(
    epochs: number[],
    epochTimestamps: Record<number | string, number>,
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
    customEpochRange?: EpochRange,
): number[] {
    if (timeFrame === 'all') return epochs;

    if (timeFrame === 'custom-epochs') {
        if (!customEpochRange) return epochs;
        return epochs.filter(
            (epoch) => epoch >= customEpochRange.start && epoch <= customEpochRange.end,
        );
    }

    const range =
        timeFrame === 'custom' ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
    if (!range) return epochs;

    const startTs = Math.floor(range.start.getTime() / 1000);
    const endTs = Math.floor(range.end.getTime() / 1000);

    return epochs.filter((epoch) => {
        const ts = epochTimestamps[epoch];
        if (!ts) return false;
        return ts >= startTs && ts <= endTs;
    });
}

/**
 * Compute the start epoch for a time frame using the epoch timestamps cache.
 * Returns the latest epoch whose timestamp is <= the time frame's start date,
 * or undefined if the time frame is 'all' or no matching epoch exists.
 * For 'custom-epochs', returns the explicitly-selected start epoch.
 */
export function getStartEpochForTimeFrame(
    epochTimestamps: Record<number | string, number>,
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
    customEpochRange?: EpochRange,
): number | undefined {
    if (timeFrame === 'all') return undefined;

    if (timeFrame === 'custom-epochs') {
        return customEpochRange?.start;
    }

    const range =
        timeFrame === 'custom' ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
    if (!range) return undefined;

    const startTs = Math.floor(range.start.getTime() / 1000);

    let best: number | undefined;
    for (const [epochStr, ts] of Object.entries(epochTimestamps)) {
        if (ts <= startTs) {
            const epoch = parseInt(epochStr);
            if (best === undefined || epoch > best) {
                best = epoch;
            }
        }
    }
    return best;
}

/**
 * Map a date range to the inclusive epoch range whose timestamps fall in it.
 * Returns null if no epoch in the cache falls inside the range.
 */
export function getEpochRangeForDateRange(
    epochTimestamps: Record<number | string, number>,
    range: DateRange,
): EpochRange | null {
    const startTs = Math.floor(range.start.getTime() / 1000);
    const endTs = Math.floor(range.end.getTime() / 1000);

    let startEpoch: number | undefined;
    let endEpoch: number | undefined;
    for (const [epochStr, ts] of Object.entries(epochTimestamps)) {
        if (ts < startTs || ts > endTs) continue;
        const epoch = parseInt(epochStr);
        if (startEpoch === undefined || epoch < startEpoch) startEpoch = epoch;
        if (endEpoch === undefined || epoch > endEpoch) endEpoch = epoch;
    }
    if (startEpoch === undefined || endEpoch === undefined) return null;
    return { start: startEpoch, end: endEpoch };
}

/**
 * Map an epoch range to the date range spanned by their cached timestamps.
 * Falls back to the nearest available cached epoch on either side (the smallest
 * epoch >= start and the largest epoch <= end) so the mapping still resolves
 * when the cache lags behind the live current epoch or the start predates the
 * first cached epoch. Returns null only when the cache has no overlap at all.
 */
export function getDateRangeForEpochRange(
    epochTimestamps: Record<number | string, number>,
    epochRange: EpochRange,
): DateRange | null {
    let startTs: number | undefined;
    let endTs: number | undefined;
    let bestStartEpoch: number | undefined;
    let bestEndEpoch: number | undefined;

    for (const [epochStr, ts] of Object.entries(epochTimestamps)) {
        const epoch = parseInt(epochStr);
        if (epoch >= epochRange.start && (bestStartEpoch === undefined || epoch < bestStartEpoch)) {
            bestStartEpoch = epoch;
            startTs = ts;
        }
        if (epoch <= epochRange.end && (bestEndEpoch === undefined || epoch > bestEndEpoch)) {
            bestEndEpoch = epoch;
            endTs = ts;
        }
    }

    if (startTs === undefined || endTs === undefined) return null;
    return {
        start: new Date(startTs * 1000),
        end: new Date(endTs * 1000),
    };
}

/**
 * Get a human-readable description of the active time frame.
 */
export function getTimeFrameDescription(
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
    customEpochRange?: EpochRange,
): string {
    if (timeFrame === 'all') return '';

    if (timeFrame === 'custom-epochs') {
        if (!customEpochRange) return '';
        return `Epoch ${customEpochRange.start} to ${customEpochRange.end}`;
    }

    const range =
        timeFrame === 'custom' ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
    if (!range) return '';

    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return `${fmt(range.start)} to ${fmt(range.end)}`;
}

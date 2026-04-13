/**
 * Time frame filtering utilities for staking rewards.
 * Provides date range presets and epoch filtering by timestamp.
 */

export type TimeFrame = 'all' | 'last-month' | 'last-quarter' | 'ytd' | 'custom';

export type DateRange = {
    start: Date;
    end: Date;
};

export const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
    all: 'All time',
    'last-month': 'Last month',
    'last-quarter': 'Last quarter',
    ytd: 'Year to date',
    custom: 'Custom',
};

/**
 * Compute the date range for a given time frame preset.
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
 */
export function filterEpochsByTimeFrame(
    epochs: number[],
    epochTimestamps: Record<number | string, number>,
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
): number[] {
    if (timeFrame === 'all') return epochs;

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
 */
export function getStartEpochForTimeFrame(
    epochTimestamps: Record<number | string, number>,
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
): number | undefined {
    if (timeFrame === 'all') return undefined;

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
 * Get a human-readable description of the active time frame.
 */
export function getTimeFrameDescription(
    timeFrame: TimeFrame,
    customRange?: DateRange,
    referenceDate?: Date,
): string {
    if (timeFrame === 'all') return '';

    const range =
        timeFrame === 'custom' ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
    if (!range) return '';

    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return `${fmt(range.start)} to ${fmt(range.end)}`;
}

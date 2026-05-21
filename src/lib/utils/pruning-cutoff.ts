/**
 * Pruning cutoff: queries the network's GraphQL endpoint for its indexed range
 * (`availableRange`). The first checkpoint is the oldest data still served by the
 * indexer / GraphQL service — i.e. the pruning cutoff. Used to display, next to
 * the network dropdown, what the oldest data is the user can query against.
 */

export interface AvailableRange {
    firstCheckpoint: number;
    firstTimestamp: string;
    lastCheckpoint: number;
    lastTimestamp: string;
}

const QUERY =
    '{ availableRange { first { sequenceNumber timestamp } last { sequenceNumber timestamp } } }';

export async function fetchAvailableRange(
    graphqlUrl: string,
    signal?: AbortSignal,
): Promise<AvailableRange | null> {
    const res = await fetch(graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: QUERY }),
        signal,
    });
    if (!res.ok) {
        throw new Error(`GraphQL HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data?.errors?.length) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
    }
    const r = data?.data?.availableRange;
    if (!r?.first || !r?.last) return null;
    return {
        firstCheckpoint: Number(r.first.sequenceNumber),
        firstTimestamp: r.first.timestamp,
        lastCheckpoint: Number(r.last.sequenceNumber),
        lastTimestamp: r.last.timestamp,
    };
}

/**
 * Format a duration like "3m ago", "5h ago", "2d ago". Returns "just now" for
 * intervals under a minute and "in the future" for negative deltas (clock skew).
 */
export function formatTimeAgo(timestamp: string, now: number = Date.now()): string {
    const then = Date.parse(timestamp);
    if (Number.isNaN(then)) return '';
    const diffSec = Math.round((now - then) / 1000);
    if (diffSec < 0) return 'in the future';
    if (diffSec < 60) return 'just now';
    const minutes = Math.floor(diffSec / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

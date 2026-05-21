/**
 * Pruning cutoff: queries the indexer for the oldest checkpoint it still holds
 * (`iota_getCheckpoints` ascending, limit 1). Indexers prune old checkpoints,
 * so this is the actual cutoff the user can query historical data against.
 * Used to display, next to the network dropdown, what the oldest data is.
 */

export interface PruningCutoff {
    checkpoint: number;
    timestampMs: number;
}

export async function fetchPruningCutoff(
    rpcUrl: string,
    signal?: AbortSignal,
): Promise<PruningCutoff | null> {
    const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'iota_getCheckpoints',
            // [cursor, limit, descending]: ascending from the oldest still in the DB.
            params: [null, 1, false],
        }),
        signal,
    });
    if (!res.ok) {
        throw new Error(`RPC HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data?.error) {
        throw new Error(data.error.message || 'RPC error');
    }
    const first = data?.result?.data?.[0];
    if (!first) return null;
    return {
        checkpoint: Number(first.sequenceNumber),
        timestampMs: Number(first.timestampMs),
    };
}

/**
 * Format a duration like "3m ago", "5h ago", "2d ago". Returns "just now" for
 * intervals under a minute and "in the future" for negative deltas (clock skew).
 */
export function formatTimeAgo(timestampMs: number, now: number = Date.now()): string {
    if (!Number.isFinite(timestampMs)) return '';
    const diffSec = Math.round((now - timestampMs) / 1000);
    if (diffSec < 0) return 'in the future';
    if (diffSec < 60) return 'just now';
    const minutes = Math.floor(diffSec / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

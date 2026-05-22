/**
 * Pruning cutoff: indexers prune the *filtered* tx/event indexes (e.g.
 * "transactions by kind"), per IOTA indexer PR
 * https://github.com/iotaledger/iota/pull/10875 — the underlying `checkpoints`
 * table is not what gets pruned, so `iota_getCheckpoints` ascending always
 * returns #0 and the GraphQL `availableRange` is just a recent indexing window.
 *
 * We detect the real cutoff by querying the filtered transactions index for the
 * oldest entry of a transaction kind that exists in every checkpoint
 * (`ConsensusCommitPrologueV1` — emitted once per consensus commit). The oldest
 * result is the pruning cutoff for filtered queries.
 */

export interface PruningCutoff {
    checkpoint: number;
    timestampMs: number;
}

const PROBE_TX_KIND = 'ConsensusCommitPrologueV1';

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
            method: 'iotax_queryTransactionBlocks',
            // [query, cursor, limit, descending]: ascending → oldest match still
            // present in the (prunable) filtered-tx index.
            params: [{ filter: { TransactionKind: PROBE_TX_KIND } }, null, 1, false],
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
    if (!first?.checkpoint || !first?.timestampMs) return null;
    return {
        checkpoint: Number(first.checkpoint),
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

/**
 * Verbose "X days ago" / "X hours ago" / "X minutes ago" — used on the chip,
 * where the relative-time label is the primary signal rather than a subscript.
 */
export function formatVerboseAgo(timestampMs: number, now: number = Date.now()): string {
    if (!Number.isFinite(timestampMs)) return '';
    const diffMs = now - timestampMs;
    if (diffMs < 0) return 'in the future';
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (diffMs < minute) return 'just now';
    if (diffMs < hour) {
        const m = Math.floor(diffMs / minute);
        return `${m} minute${m === 1 ? '' : 's'} ago`;
    }
    if (diffMs < day) {
        const h = Math.floor(diffMs / hour);
        return `${h} hour${h === 1 ? '' : 's'} ago`;
    }
    const d = Math.floor(diffMs / day);
    return `${d} day${d === 1 ? '' : 's'} ago`;
}

/**
 * Human-readable date-only, e.g. "21 May 2026" or "May 21, 2026" — used on
 * the compact chip.
 */
export function formatReadableDate(timestampMs: number): string {
    if (!Number.isFinite(timestampMs)) return '';
    return new Date(timestampMs).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Human-readable date+time, used inside the tooltip where precision is
 * useful and space is not a constraint.
 */
export function formatReadableDateTime(timestampMs: number): string {
    if (!Number.isFinite(timestampMs)) return '';
    return new Date(timestampMs).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

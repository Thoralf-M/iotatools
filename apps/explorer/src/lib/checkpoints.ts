// Checkpoint listing helpers.
//
// `client.checkpoints(paginationFilter)` works through the wasm bridge since
// the 2026-07 SDK rebuild, so listing uses the typed API again. One quirk
// remains: `client.checkpoint(digest, undefined)` still returns null for
// existing digests, so digest→sequence resolution goes through
// client.runQuery (same SDK, same transport) with explicit GraphQL.

import { Query } from "@iota/sdk-wasm";
import type { GraphQlClient } from "@iota/sdk-wasm";
import { pageBack } from "./sdk";

export interface CheckpointRow {
  sequenceNumber: bigint;
  digest: string;
  epoch: bigint | null;
  timestampMs: number | null;
  networkTotalTransactions: bigint | null;
}

/** runQuery resolves to the GraphQL `data` payload serialized as a JSON string. */
export function parseRunQuery(res: unknown): any {
  if (typeof res === "string") {
    try {
      return JSON.parse(res);
    } catch {
      return res;
    }
  }
  return res;
}

/**
 * Newest-first page of checkpoints via the typed client. `before` is the
 * page cursor from a previous call — pass undefined for the live head.
 */
export async function listCheckpoints(
  client: GraphQlClient,
  opts: { limit: number; before?: string },
): Promise<{ rows: CheckpointRow[]; hasMore: boolean; nextBefore?: string }> {
  const page = await client.checkpoints(pageBack(opts.limit, opts.before));
  // Backward pages arrive in ascending order — newest first for the UI.
  const rows: CheckpointRow[] = [...page.data].reverse().map((cp) => ({
    sequenceNumber: cp.sequenceNumber(),
    digest: cp.digest().toBase58(),
    epoch: cp.epoch(),
    timestampMs: Number(cp.timestampMs()),
    networkTotalTransactions: cp.networkTotalTransactions(),
  }));
  return {
    rows,
    hasMore: page.pageInfo.hasPreviousPage,
    nextBefore: page.pageInfo.startCursor ?? undefined,
  };
}

/** Resolve a checkpoint digest to its sequence number (workaround for checkpoint(digest)). */
export async function checkpointSeqByDigest(
  client: GraphQlClient,
  digestB58: string,
): Promise<bigint | null> {
  const res = parseRunQuery(
    await client.runQuery(
      Query.new({
        queryString: `query CpByDigest($digest: String!) { checkpoint(id: { digest: $digest }) { sequenceNumber } }`,
        variables: JSON.stringify({ digest: digestB58 }),
      }),
    ),
  );
  const seq = res?.checkpoint?.sequenceNumber;
  return seq != null ? BigInt(seq) : null;
}

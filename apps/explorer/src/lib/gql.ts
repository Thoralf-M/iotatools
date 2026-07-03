// Targeted GraphQL reads through client.runQuery for data the typed FFI
// surface doesn't expose (balance changes, display metadata, grouped coin
// balances, staking positions, epoch system parameters). Same SDK client,
// same transport — just explicit queries. All shapes verified against the
// live mainnet schema.

import { Query } from "@iota/sdk-wasm";
import type { GraphQlClient } from "@iota/sdk-wasm";
import { parseRunQuery } from "./checkpoints";

export async function gql(
  client: GraphQlClient,
  query: string,
  variables?: Record<string, unknown>,
): Promise<any> {
  // NOTE: Query.variables is typed as `Value` in the generated d.ts, but the
  // runtime converter lowers it as a JSON *string* — always stringify.
  const res = await client.runQuery(
    Query.new({ queryString: query, variables: variables ? JSON.stringify(variables) : undefined }),
  );
  return parseRunQuery(res);
}

// ── transaction extras ─────────────────────────────────────────────────────

export interface BalanceChangeRow {
  ownerAddress: string;
  /** signed decimal string in base units (nanos for IOTA) */
  amount: string;
  coinType: string;
}

export interface TxExtras {
  timestampMs: number | null;
  checkpointSeq: bigint | null;
  balanceChanges: BalanceChangeRow[];
  /** object id → Move type repr for objects written by this tx */
  objectTypes: Record<string, string>;
}

export async function txExtras(client: GraphQlClient, digest: string): Promise<TxExtras> {
  const data = await gql(
    client,
    `query TxExtras($d: String!) {
      transactionBlock(digest: $d) {
        effects {
          timestamp
          checkpoint { sequenceNumber }
          balanceChanges(first: 50) {
            nodes { owner { address } amount coinType { repr } }
          }
          objectChanges(first: 50) {
            nodes { address outputState { asMoveObject { contents { type { repr } } } } }
          }
        }
      }
    }`,
    { d: digest },
  );
  const fx = data?.transactionBlock?.effects;
  const objectTypes: Record<string, string> = {};
  for (const n of fx?.objectChanges?.nodes ?? []) {
    const t = n?.outputState?.asMoveObject?.contents?.type?.repr;
    if (n?.address && t) objectTypes[n.address] = t;
  }
  return {
    timestampMs: fx?.timestamp ? new Date(fx.timestamp).getTime() : null,
    checkpointSeq: fx?.checkpoint?.sequenceNumber != null ? BigInt(fx.checkpoint.sequenceNumber) : null,
    balanceChanges: (fx?.balanceChanges?.nodes ?? [])
      .filter((n: any) => n?.owner?.address)
      .map((n: any) => ({
        ownerAddress: n.owner.address as string,
        amount: String(n.amount ?? "0"),
        coinType: String(n.coinType?.repr ?? ""),
      })),
    objectTypes,
  };
}

// ── address portfolio ──────────────────────────────────────────────────────

export interface CoinBalanceRow {
  coinType: string;
  totalBalance: string;
  coinObjectCount: number;
}

/** All coin types held by an address, pre-grouped by the indexer. */
export async function addressBalances(client: GraphQlClient, addr: string): Promise<CoinBalanceRow[]> {
  const data = await gql(
    client,
    `query Balances($a: IotaAddress!) {
      address(address: $a) {
        balances(first: 50) { nodes { coinType { repr } totalBalance coinObjectCount } }
      }
    }`,
    { a: addr },
  );
  return (data?.address?.balances?.nodes ?? []).map((n: any) => ({
    coinType: String(n.coinType?.repr ?? ""),
    totalBalance: String(n.totalBalance ?? "0"),
    coinObjectCount: Number(n.coinObjectCount ?? 0),
  }));
}

export interface StakeRow {
  principal: string;
  estimatedReward: string | null;
  activatedEpoch: bigint | null;
  status: string;
  /** decoded Move contents of the StakedIota object (has pool_id etc.) */
  json: any;
}

export async function addressStakes(client: GraphQlClient, addr: string): Promise<StakeRow[]> {
  const data = await gql(
    client,
    `query Stakes($a: IotaAddress!) {
      address(address: $a) {
        stakedIotas(first: 50) {
          nodes { principal estimatedReward activatedEpoch { epochId } stakeStatus contents { json } }
        }
      }
    }`,
    { a: addr },
  );
  return (data?.address?.stakedIotas?.nodes ?? []).map((n: any) => ({
    principal: String(n.principal ?? "0"),
    estimatedReward: n.estimatedReward != null ? String(n.estimatedReward) : null,
    activatedEpoch: n.activatedEpoch?.epochId != null ? BigInt(n.activatedEpoch.epochId) : null,
    status: String(n.stakeStatus ?? ""),
    json: n.contents?.json ?? null,
  }));
}

export interface AssetRow {
  objectId: string;
  version: number;
  type: string;
  display: Record<string, string> | null;
}

/** Owned objects with their Display metadata (name/image for NFT-like assets). */
export async function ownedObjectsWithDisplay(
  client: GraphQlClient,
  addr: string,
  cursor?: string,
  limit = 24,
): Promise<{ rows: AssetRow[]; hasNext: boolean; endCursor: string | null }> {
  const data = await gql(
    client,
    `query Owned($a: IotaAddress!, $first: Int, $after: String) {
      objects(first: $first, after: $after, filter: { owner: $a }) {
        pageInfo { hasNextPage endCursor }
        nodes { address version asMoveObject { contents { type { repr } } } display { key value } }
      }
    }`,
    { a: addr, first: limit, after: cursor ?? null },
  );
  const conn = data?.objects;
  return {
    rows: (conn?.nodes ?? []).map((n: any) => ({
      objectId: String(n.address),
      version: Number(n.version ?? 0),
      type: String(n.asMoveObject?.contents?.type?.repr ?? "unknown"),
      display: Array.isArray(n.display)
        ? Object.fromEntries(n.display.filter((d: any) => d?.value != null).map((d: any) => [d.key, d.value]))
        : null,
    })),
    hasNext: !!conn?.pageInfo?.hasNextPage,
    endCursor: conn?.pageInfo?.endCursor ?? null,
  };
}

/** Display metadata for one object (null when no Display is registered). */
export async function objectDisplay(client: GraphQlClient, id: string): Promise<Record<string, string> | null> {
  const data = await gql(
    client,
    `query Display($a: IotaAddress!) {
      object(address: $a) { display { key value } }
    }`,
    { a: id },
  );
  const d = data?.object?.display;
  if (!Array.isArray(d) || d.length === 0) return null;
  return Object.fromEntries(d.filter((x: any) => x?.value != null).map((x: any) => [x.key, x.value]));
}

// ── epoch / network ─────────────────────────────────────────────────────────

export interface SystemParameters {
  durationMs: number | null;
  minValidatorCount: number | null;
  maxValidatorCount: number | null;
  minValidatorJoiningStake: string | null;
}

export async function epochSystemParameters(
  client: GraphQlClient,
  epochId?: bigint,
): Promise<SystemParameters> {
  const data = await gql(
    client,
    `query SysParams($id: UInt53) {
      epoch(id: $id) {
        systemParameters { durationMs minValidatorCount maxValidatorCount minValidatorJoiningStake }
      }
    }`,
    { id: epochId != null ? Number(epochId) : null },
  );
  const p = data?.epoch?.systemParameters;
  return {
    durationMs: p?.durationMs != null ? Number(p.durationMs) : null,
    minValidatorCount: p?.minValidatorCount ?? null,
    maxValidatorCount: p?.maxValidatorCount ?? null,
    minValidatorJoiningStake: p?.minValidatorJoiningStake ?? null,
  };
}

// ── per-epoch total supply (batched via aliases: one round-trip) ────────────

/** epochId(string) → total supply in nanos. Missing epochs are omitted. */
export async function epochSupplies(
  client: GraphQlClient,
  ids: bigint[],
): Promise<Map<string, bigint>> {
  const out = new Map<string, bigint>();
  if (ids.length === 0) return out;
  const q = `query { ${ids.map((id) => `e${id}: epoch(id: ${id}) { iotaTotalSupply }`).join(" ")} }`;
  const data = await gql(client, q);
  for (const id of ids) {
    const s = data?.[`e${id}`]?.iotaTotalSupply;
    if (s != null) {
      try {
        out.set(id.toString(), BigInt(s));
      } catch {
        /* skip malformed */
      }
    }
  }
  return out;
}

// ── address activity feed ───────────────────────────────────────────────────
// One query per page: digest + timestamp + status + balance changes, so the
// address page can render a human activity feed without per-row lookups.

export interface FeedRow {
  digest: string;
  timestampMs: number | null;
  success: boolean | null;
  sender: string | null;
  isSystem: boolean;
  /** net IOTA change (nanos, signed) for the queried address */
  netIota: bigint;
  /** number of non-IOTA coin types that changed for the queried address */
  otherCoinChanges: number;
  /** address on the opposite side of the largest IOTA flow, if any */
  counterparty: string | null;
}

export async function addressTxFeed(
  client: GraphQlClient,
  addr: string,
  mode: "sent" | "recv",
  cursor?: string,
  limit = 20,
): Promise<{ rows: FeedRow[]; hasMore: boolean; nextCursor?: string }> {
  const filter = mode === "sent" ? "sentAddress: $a" : "recvAddress: $a";
  const data = await gql(
    client,
    `query Feed($a: IotaAddress!, $before: String) {
      transactionBlocks(last: ${limit}, before: $before, filter: { ${filter} }) {
        pageInfo { hasPreviousPage startCursor }
        nodes {
          digest
          sender { address }
          effects {
            status
            timestamp
            balanceChanges(first: 30) { nodes { owner { address } amount coinType { repr } } }
          }
        }
      }
    }`,
    { a: addr, before: cursor ?? null },
  );
  const conn = data?.transactionBlocks;
  const nodes: any[] = conn?.nodes ?? [];
  const rows = nodes
    .map((n): FeedRow => {
      let netIota = 0n;
      const others = new Set<string>();
      let biggestOpposite: { amt: bigint; owner: string } | null = null;
      for (const bc of n?.effects?.balanceChanges?.nodes ?? []) {
        const owner = bc?.owner?.address as string | undefined;
        const isIota = String(bc?.coinType?.repr ?? "").endsWith("::iota::IOTA");
        let amt = 0n;
        try {
          amt = BigInt(bc?.amount ?? 0);
        } catch {
          continue;
        }
        if (owner === addr) {
          if (isIota) netIota += amt;
          else others.add(String(bc?.coinType?.repr));
        } else if (owner && isIota) {
          // candidate counterparty: largest flow on the other side
          const mag = amt < 0n ? -amt : amt;
          if (biggestOpposite == null || mag > (biggestOpposite.amt < 0n ? -biggestOpposite.amt : biggestOpposite.amt)) {
            biggestOpposite = { amt, owner };
          }
        }
      }
      const sender = n?.sender?.address ?? null;
      return {
        digest: String(n.digest),
        timestampMs: n?.effects?.timestamp ? new Date(n.effects.timestamp).getTime() : null,
        success: n?.effects?.status != null ? n.effects.status === "SUCCESS" : null,
        sender,
        isSystem: sender == null,
        netIota,
        otherCoinChanges: others.size,
        counterparty: biggestOpposite?.owner ?? null,
      };
    })
    .reverse(); // ascending → newest first
  return {
    rows,
    hasMore: !!conn?.pageInfo?.hasPreviousPage,
    nextCursor: conn?.pageInfo?.startCursor ?? undefined,
  };
}

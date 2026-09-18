// Validator sets that live outside `activeValidators()`.
//
// The GraphQL client only exposes the active set. Candidates, pending joiners
// and retired (inactive) validators are Move tables hanging off the system
// state, so they have to be walked by hand:
//
//   0x5 ──dynamic field(system_state_version)──▶ IotaSystemStateInner
//        .validators.validator_candidates      Table<address, ValidatorWrapper>
//        .validators.inactive_validators       Table<ID, ValidatorWrapper>
//        .validators.pending_active_validators TableVec<ValidatorV1>
//
// Each ValidatorWrapper is a `Versioned`, i.e. one more dynamic-field hop to
// the ValidatorV1 body; TableVec entries hold the body directly. Both shapes
// are handled by `fetchValidatorTable`.

import type { GraphQlClient } from "@iota/sdk-wasm";
import { Address } from "@iota/sdk-wasm";
import { bytesToHex } from "./format";
import { collectAllPages, MAX_PAGE_SIZE } from "./paging";
import { pageFwd } from "./sdk";

export const SYSTEM_STATE_ID = "0x0000000000000000000000000000000000000000000000000000000000000005";

/** Where a validator sits relative to the committee. */
export type ValidatorStatus = "committee" | "active" | "candidate" | "pending" | "inactive";

/** A validator body (ValidatorV1) decoded from its Move JSON. */
export interface MoveValidator {
  address: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  commissionRate: string | null;
  gasPrice: string | null;
  stake: string | null;
  rewardsPool: string | null;
  pendingStake: string | null;
  pendingTotalIotaWithdraw: string | null;
  poolTokenBalance: string | null;
  stakingPoolId: string | null;
  activationEpoch: string | null;
  deactivationEpoch: string | null;
  nextEpochStake: string | null;
  nextEpochGasPrice: string | null;
  nextEpochCommissionRate: string | null;
  netAddress: string | null;
  p2pAddress: string | null;
  primaryAddress: string | null;
  protocolPubKey: string | null;
  networkPubKey: string | null;
  authorityPubKey: string | null;
}

/** A Move table reference: its object id and entry count. */
export interface TableRef {
  id: string;
  size: number;
}

export interface ValidatorSetInfo {
  /** Active-set addresses that also sit on this epoch's committee. */
  committee: Set<string>;
  /** Addresses leaving the active set at the next epoch boundary. */
  pendingRemoval: Set<string>;
  /** Address → number of epochs the validator has been below the stake threshold. */
  atRisk: Map<string, string>;
  candidates: TableRef | null;
  pending: TableRef | null;
  inactive: TableRef | null;
}

/** `valueAsJson` arrives as a JSON string; anything else passes through. */
function parseJson(v: unknown): any {
  if (typeof v !== "string") return v ?? null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "bigint" || typeof v === "boolean") return String(v);
  return null;
}

/** Move `Url`/`String` option: `{ url: "…" }`, a bare string, or absent. */
function url(v: unknown): string | null {
  if (v && typeof v === "object" && "url" in (v as Record<string, unknown>)) return str((v as any).url);
  return str(v);
}

/** Move `vector<u8>` pubkey/proof blobs arrive as number arrays. */
function keyHex(v: unknown): string | null {
  return Array.isArray(v) ? bytesToHex(v as number[]) : str(v);
}

/** Pad/normalise an address so it compares equal to `Address.toHex()` output. */
export function normAddr(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  try {
    return Address.fromHex(s).toHex();
  } catch {
    return s.toLowerCase();
  }
}

function tableRef(v: any): TableRef | null {
  const id = str(v?.id);
  if (!id) return null;
  return { id, size: Number(str(v?.size) ?? "0") };
}

function toMoveValidator(v: any): MoveValidator | null {
  const meta = v?.metadata;
  const pool = v?.staking_pool;
  const address = normAddr(meta?.iota_address);
  if (!address) return null;
  return {
    address,
    name: str(meta?.name),
    description: str(meta?.description) || null,
    imageUrl: url(meta?.image_url),
    projectUrl: url(meta?.project_url),
    commissionRate: str(v?.commission_rate),
    gasPrice: str(v?.gas_price),
    stake: str(pool?.iota_balance),
    rewardsPool: str(pool?.rewards_pool?.value ?? pool?.rewards_pool),
    pendingStake: str(pool?.pending_stake),
    pendingTotalIotaWithdraw: str(pool?.pending_total_iota_withdraw),
    poolTokenBalance: str(pool?.pool_token_balance),
    stakingPoolId: str(pool?.id?.id ?? pool?.id),
    activationEpoch: str(pool?.activation_epoch),
    deactivationEpoch: str(pool?.deactivation_epoch),
    nextEpochStake: str(v?.next_epoch_stake),
    nextEpochGasPrice: str(v?.next_epoch_gas_price),
    nextEpochCommissionRate: str(v?.next_epoch_commission_rate),
    netAddress: str(meta?.net_address),
    p2pAddress: str(meta?.p2p_address),
    primaryAddress: str(meta?.primary_address),
    protocolPubKey: keyHex(meta?.protocol_pubkey_bytes),
    networkPubKey: keyHex(meta?.network_pubkey_bytes),
    authorityPubKey: keyHex(meta?.authority_pubkey_bytes),
  };
}

/** The IotaSystemStateInner body, stored as a dynamic field of 0x5. */
async function systemStateInner(client: GraphQlClient): Promise<any> {
  const page = await client.dynamicFields(Address.fromHex(SYSTEM_STATE_ID), pageFwd(MAX_PAGE_SIZE));
  for (const f of page.data) {
    const value = parseJson(f.valueAsJson);
    if (value?.validators) return value;
  }
  throw new Error("no system state body found under 0x5");
}

/**
 * Committee membership plus the table handles for the non-active sets.
 * Latest state only — the dynamic field of 0x5 has no historic view.
 */
export async function fetchValidatorSetInfo(client: GraphQlClient): Promise<ValidatorSetInfo> {
  const inner = await systemStateInner(client);
  const vs = inner.validators ?? {};
  const active: Array<string | null> = (vs.active_validators ?? []).map((v: any) => normAddr(v?.metadata?.iota_address));

  // committee_members / pending_removals are indices into active_validators.
  const byIndex = (list: unknown): Set<string> => {
    const out = new Set<string>();
    for (const i of Array.isArray(list) ? list : []) {
      const addr = active[Number(str(i) ?? -1)];
      if (addr) out.add(addr);
    }
    return out;
  };

  const atRisk = new Map<string, string>();
  for (const entry of vs.at_risk_validators?.contents ?? []) {
    const addr = normAddr(entry?.key);
    if (addr) atRisk.set(addr, str(entry?.value) ?? "?");
  }

  return {
    committee: byIndex(vs.committee_members),
    pendingRemoval: byIndex(vs.pending_removals),
    atRisk,
    candidates: tableRef(vs.validator_candidates),
    pending: tableRef(vs.pending_active_validators?.contents),
    inactive: tableRef(vs.inactive_validators),
  };
}

/** Run `work` over `items` with a bounded number of requests in flight. */
async function mapLimit<T, R>(items: T[], limit: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(work))));
  }
  return out;
}

/**
 * Drain a validator table into decoded bodies, sorted by stake. Entries are
 * either a `ValidatorWrapper` (one extra hop through `Versioned`) or the
 * validator body itself, as in `pending_active_validators`.
 */
export async function fetchValidatorTable(client: GraphQlClient, table: TableRef): Promise<MoveValidator[]> {
  if (table.size === 0) return [];
  const entries = await collectAllPages((p) => client.dynamicFields(Address.fromHex(table.id), p));

  // Kept low on purpose: a table with dozens of entries means one request per
  // validator, and the public endpoints rate-limit bursts (the rejection comes
  // back without CORS headers, so it surfaces as a network error).
  const rows = await mapLimit(entries, 4, async (entry) => {
    const value = parseJson(entry.valueAsJson);
    const innerId = str(value?.inner?.id);
    if (!innerId) return toMoveValidator(value);
    const page = await client.dynamicFields(Address.fromHex(innerId), pageFwd(1));
    return toMoveValidator(parseJson(page.data[0]?.valueAsJson));
  });

  return rows
    .filter((v): v is MoveValidator => v != null)
    .sort((a, b) => {
      const sa = BigInt(a.stake ?? "0");
      const sb = BigInt(b.stake ?? "0");
      return sb > sa ? 1 : sb < sa ? -1 : 0;
    });
}

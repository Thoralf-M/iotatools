// Every validator the system state knows about: the consensus committee, the
// rest of the active set, candidates waiting to join, pending joiners and
// retired pools. Expandable rows expose credentials and next-epoch values.
//
// The active set comes from `activeValidators()`; the other sets are walked
// out of the 0x5 tables (see lib/validator-set.ts) and only load for the tab
// that needs them.

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import {
  AddressLink,
  Amount,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  Pill,
  Section,
  SortTh,
  Stat,
  Tabs,
  cmpValues,
  useSort,
  useTabParam,
} from "../components/ui";
import { effectiveCommissionBps, fmtBps, fmtInt, fmtIota, toBig } from "../lib/format";
import { collectAllPages } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";
import {
  fetchValidatorSetInfo,
  fetchValidatorTable,
  type MoveValidator,
  type TableRef,
  type ValidatorStatus,
} from "../lib/validator-set";

type Num = bigint | number | string | null | undefined;

/** Basis-point fields are numbers in the SDK types and strings in Move JSON. */
function toNum(v: Num): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

interface Row {
  status: ValidatorStatus;
  address: string;
  name: string | null;
  imageUrl: string | null;
  description: string | null;
  projectUrl: string | null;
  stake: Num;
  votingPower: number | null;
  commissionRate: number | null;
  gasPrice: Num;
  apy: number | null;
  stakingPoolId: string | null;
  activationEpoch: Num;
  deactivationEpoch: Num;
  rewardsPool: Num;
  pendingStake: Num;
  pendingTotalIotaWithdraw: Num;
  nextEpochStake: Num;
  nextEpochGasPrice: Num;
  nextEpochCommissionRate: Num;
  netAddress: string | null;
  primaryAddress: string | null;
  protocolPubKey: string | null;
  /** epochs spent below the low-stake threshold, when at risk of removal */
  atRisk: string | null;
  /** scheduled to leave the active set at the next epoch boundary */
  leaving: boolean;
}

type SortKey = "name" | "status" | "stake" | "votingPower" | "commission" | "effective" | "gasPrice" | "apy";

/** Sets appear in this order when sorting the mixed ALL tab by status. */
const STATUS_ORDER: Record<ValidatorStatus, number> = {
  committee: 0,
  active: 1,
  pending: 2,
  candidate: 3,
  inactive: 4,
};

const STATUS_PILL: Record<ValidatorStatus, { color: "teal" | "amber" | "coral" | "blue" | "violet"; label: string }> = {
  committee: { color: "teal", label: "COMMITTEE" },
  active: { color: "blue", label: "ACTIVE" },
  candidate: { color: "violet", label: "CANDIDATE" },
  pending: { color: "amber", label: "PENDING" },
  inactive: { color: "coral", label: "INACTIVE" },
};

function moveRow(v: MoveValidator, status: ValidatorStatus): Row {
  return {
    status,
    address: v.address,
    name: v.name,
    imageUrl: v.imageUrl,
    description: v.description,
    projectUrl: v.projectUrl,
    stake: v.stake,
    votingPower: null,
    commissionRate: toNum(v.commissionRate),
    gasPrice: v.gasPrice,
    apy: null,
    stakingPoolId: v.stakingPoolId,
    activationEpoch: v.activationEpoch,
    deactivationEpoch: v.deactivationEpoch,
    rewardsPool: v.rewardsPool,
    pendingStake: v.pendingStake,
    pendingTotalIotaWithdraw: v.pendingTotalIotaWithdraw,
    nextEpochStake: v.nextEpochStake,
    nextEpochGasPrice: v.nextEpochGasPrice,
    nextEpochCommissionRate: v.nextEpochCommissionRate,
    netAddress: v.netAddress,
    primaryAddress: v.primaryAddress,
    protocolPubKey: v.protocolPubKey,
    atRisk: null,
    leaving: false,
  };
}

export default function Validators() {
  const client = useClient();
  const { network } = useNetwork();
  const [params] = useSearchParams();
  const epochParam = params.get("epoch");
  const [tab, setTab] = useTabParam("committee");
  const [open, setOpen] = useState<string | null>(null);
  const sort = useSort<SortKey>("stake", "desc");

  // Active set + committee membership. The membership/table handles come from
  // the live system state, so they are unavailable for a historic epoch.
  const qActive = useQuery({
    queryKey: [network, "validators", epochParam],
    queryFn: async () => {
      const [all, epoch] = await Promise.all([
        collectAllPages((p) => client.activeValidators(epochParam ? BigInt(epochParam) : undefined, p)),
        client.epoch(epochParam ? BigInt(epochParam) : undefined).catch(() => null),
      ]);
      const vals = [...all].sort((a, b) => {
        const sa = toBig(a.stakingPoolIotaBalance) ?? 0n;
        const sb = toBig(b.stakingPoolIotaBalance) ?? 0n;
        return sb > sa ? 1 : sb < sa ? -1 : 0;
      });
      const total = vals.reduce((acc, v) => acc + (toBig(v.stakingPoolIotaBalance) ?? 0n), 0n);
      return { vals, total, protocolVersion: epoch?.protocolConfigs?.protocolVersion ?? null };
    },
  });

  const qSet = useQuery({
    queryKey: [network, "validator-set-info"],
    enabled: !epochParam,
    queryFn: () => fetchValidatorSetInfo(client),
  });

  const info = epochParam ? null : (qSet.data ?? null);

  const useTable = (status: "candidate" | "pending" | "inactive", table: TableRef | null | undefined) =>
    useQuery({
      queryKey: [network, "validator-table", status, table?.id ?? null],
      enabled: !!table && (tab === status || (tab === "all" && status !== "inactive")),
      queryFn: async () => (await fetchValidatorTable(client, table!)).map((v) => moveRow(v, status)),
    });

  const qCandidates = useTable("candidate", info?.candidates);
  const qPending = useTable("pending", info?.pending);
  const qInactive = useTable("inactive", info?.inactive);

  if (qActive.isPending) return <LoadingBlock label="activeValidators()…" />;
  if (qActive.error) return <ErrorNote error={qActive.error} />;
  const { vals, total, protocolVersion } = qActive.data!;
  const top10 = vals.slice(0, 10).reduce((acc, v) => acc + (toBig(v.stakingPoolIotaBalance) ?? 0n), 0n);

  // Without the system state (historic epoch, or the query failed) the whole
  // active set is shown as the committee, as it was before the split.
  const activeRows: Row[] = vals.map((v) => {
    const address = v.address.toHex();
    return {
      status: !info || info.committee.has(address) ? "committee" : "active",
      address,
      name: v.name ?? null,
      imageUrl: v.imageUrl ?? null,
      description: v.description ?? null,
      projectUrl: v.projectUrl ?? null,
      stake: v.stakingPoolIotaBalance ?? null,
      votingPower: toNum(v.votingPower),
      commissionRate: toNum(v.commissionRate),
      gasPrice: v.gasPrice ?? null,
      apy: toNum(v.apy),
      stakingPoolId: v.stakingPoolId.toHex(),
      activationEpoch: v.stakingPoolActivationEpoch ?? null,
      deactivationEpoch: null,
      rewardsPool: v.rewardsPool ?? null,
      pendingStake: v.pendingStake ?? null,
      pendingTotalIotaWithdraw: v.pendingTotalIotaWithdraw ?? null,
      nextEpochStake: v.nextEpochStake ?? null,
      nextEpochGasPrice: v.nextEpochGasPrice ?? null,
      nextEpochCommissionRate: v.nextEpochCommissionRate ?? null,
      netAddress: v.credentials?.netAddress ?? null,
      primaryAddress: v.credentials?.primaryAddress ?? null,
      protocolPubKey: v.credentials?.protocolPubKey ?? null,
      atRisk: info?.atRisk.get(address) ?? null,
      leaving: info?.pendingRemoval.has(address) ?? false,
    };
  });

  const committeeRows = activeRows.filter((r) => r.status === "committee");
  const activeOnlyRows = activeRows.filter((r) => r.status === "active");
  const extraQueries = { candidate: qCandidates, pending: qPending, inactive: qInactive } as const;

  const rowsFor = (id: string): Row[] => {
    switch (id) {
      case "committee":
        return committeeRows;
      case "active":
        return activeOnlyRows;
      case "candidate":
      case "pending":
      case "inactive":
        return extraQueries[id].data ?? [];
      default:
        // ALL is every validator still in play — retired pools stay on their
        // own tab.
        return [...activeRows, ...(qCandidates.data ?? []), ...(qPending.data ?? [])];
    }
  };

  const count = (id: string): number | string | undefined => {
    switch (id) {
      case "committee":
        return committeeRows.length;
      case "active":
        return activeOnlyRows.length;
      case "candidate":
        return info?.candidates?.size;
      case "pending":
        return info?.pending?.size;
      case "inactive":
        return info?.inactive?.size;
      default:
        return info ? vals.length + (info.candidates?.size ?? 0) + (info.pending?.size ?? 0) : vals.length;
    }
  };

  const tabs = [
    { id: "all", label: "ALL" },
    { id: "committee", label: "COMMITTEE" },
    { id: "active", label: "ACTIVE" },
    { id: "candidate", label: "CANDIDATE" },
    { id: "pending", label: "PENDING" },
    { id: "inactive", label: "INACTIVE" },
  ]
    .filter((t) => info != null || t.id === "committee" || t.id === "active")
    .map((t) => ({ ...t, count: count(t.id) }));

  // Every set is fully in memory, so the table sorts client-side across all
  // its rows rather than just the visible page.
  const rows = rowsFor(tab)
    .map((v) => {
      const effective = effectiveCommissionBps(v.commissionRate, v.votingPower, protocolVersion);
      return {
        v,
        effective,
        values: {
          name: v.name ?? "",
          status: STATUS_ORDER[v.status],
          stake: toBig(v.stake),
          votingPower: v.votingPower,
          commission: v.commissionRate,
          effective,
          gasPrice: toBig(v.gasPrice),
          apy: v.apy,
        } as Record<SortKey, unknown>,
      };
    })
    .sort((a, b) => cmpValues(a.values[sort.key], b.values[sort.key], sort.dir));

  const pendingTables =
    tab === "all"
      ? [qCandidates, qPending].some((q) => q.isFetching)
      : (extraQueries as Record<string, typeof qCandidates>)[tab]?.isFetching === true;
  const tableError = [qCandidates, qPending, qInactive].find((q) => q.error)?.error;

  return (
    <>
      <div className="page-head">
        <h1>
          VALIDATORS
          {epochParam && <Pill color="amber">EPOCH {epochParam}</Pill>}
        </h1>
        <div className="sub">
          Active set via <span className="mono">client.activeValidators(epoch?)</span>, other sets walked from the 0x5
          validator tables
        </div>
      </div>

      <div className="stat-grid">
        <Stat label={<Info tip={TERMS.committee}>Committee size</Info>} value={committeeRows.length} />
        <Stat label={<Info tip={TERMS.stake}>Total stake</Info>} value={fmtIota(total, { maxFrac: 0, unit: false })} hint="IOTA" color="violet" />
        <Stat
          label="Top-10 concentration"
          value={total > 0n ? `${((Number(top10) / Number(total)) * 100).toFixed(1)}%` : "—"}
          hint="share of stake held by the 10 largest validators — lower is healthier"
          color="amber"
        />
        <Stat
          label={<Info tip={TERMS.validatorCandidate}>Candidates</Info>}
          value={info?.candidates?.size ?? "—"}
          hint="registered, not yet joined"
          color="blue"
        />
      </div>

      <Section
        index="01"
        title="Validators"
        aux={`click a column to sort, a row for credentials & next-epoch values · ${sort.key} ${sort.dir === "desc" ? "▼" : "▲"}`}
      >
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        {qSet.error && !epochParam && (
          <div style={{ marginBottom: 10 }}>
            <ErrorNote error={qSet.error} />
          </div>
        )}
        {epochParam && (
          <div className="muted small" style={{ marginBottom: 10 }}>
            Candidate, pending and inactive sets are only available for the current epoch — drop{" "}
            <span className="mono">?epoch={epochParam}</span> to see them.
          </div>
        )}
        {tableError && (
          <div style={{ marginBottom: 10 }}>
            <ErrorNote error={tableError} />
          </div>
        )}
        {pendingTables && <LoadingBlock label="walking 0x5 validator tables…" />}
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <SortTh colKey="name" sort={sort} firstDir="asc"><Info tip={TERMS.validator}>VALIDATOR</Info></SortTh>
                <SortTh colKey="status" sort={sort} firstDir="asc">STATUS</SortTh>
                <SortTh colKey="stake" sort={sort} numeric><Info tip={TERMS.stake}>STAKE (IOTA)</Info></SortTh>
                <th className="num">SHARE</th>
                <SortTh colKey="votingPower" sort={sort} numeric><Info tip={TERMS.votingPower}>VOTING POWER</Info></SortTh>
                <SortTh colKey="commission" sort={sort} numeric><Info tip={TERMS.commission}>COMMISSION</Info></SortTh>
                <SortTh colKey="effective" sort={sort} numeric><Info tip={TERMS.effectiveCommission}>EFFECTIVE (IIP-8)</Info></SortTh>
                <SortTh colKey="gasPrice" sort={sort} numeric><Info tip={TERMS.refGasPrice}>GAS QUOTE</Info></SortTh>
                <SortTh colKey="apy" sort={sort} numeric><Info tip={TERMS.apy}>APY</Info></SortTh>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ v, effective }, i) => {
                // An address can appear twice in the inactive set — one row per
                // retired pool — so the pool id is what makes a row unique.
                const key = `${v.status}:${v.address}:${v.stakingPoolId ?? i}`;
                const stake = toBig(v.stake);
                const share = total > 0n && stake != null && (v.status === "committee" || v.status === "active")
                  ? (Number(stake) / Number(total)) * 100
                  : null;
                const expanded = open === key;
                const floored = effective != null && v.commissionRate != null && effective > v.commissionRate;
                const pill = STATUS_PILL[v.status];
                return (
                  <React.Fragment key={key}>
                    <tr style={{ cursor: "pointer" }} onClick={() => setOpen(expanded ? null : key)}>
                      <td className="dim">{i + 1}</td>
                      <td>
                        <div className="validator-cell">
                          {v.imageUrl ? <img className="validator-img" src={v.imageUrl} alt="" loading="lazy" /> : <span className="validator-img" />}
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{v.name ?? "—"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="row" style={{ gap: 4, display: "inline-flex", flexWrap: "wrap" }}>
                          <Pill color={pill.color}>{pill.label}</Pill>
                          {v.leaving && <Pill color="coral" title="leaves the active set at the next epoch boundary">LEAVING</Pill>}
                          {v.atRisk && (
                            <Pill color="amber" title={`below the low-stake threshold for ${v.atRisk} epoch(s)`}>AT RISK {v.atRisk}</Pill>
                          )}
                        </span>
                      </td>
                      <td className="num">{stake != null ? fmtIota(stake, { maxFrac: 0, unit: false }) : "—"}</td>
                      <td className="num dim">{share != null ? `${share.toFixed(2)}%` : "—"}</td>
                      <td className="num dim">{v.votingPower != null ? fmtBps(v.votingPower) : "—"}</td>
                      <td className="num dim">{v.commissionRate != null ? fmtBps(v.commissionRate) : "—"}</td>
                      <td className="num" style={floored ? { color: "var(--amber)" } : undefined} title={floored ? "floored at voting power by IIP-8" : undefined}>
                        {effective != null ? fmtBps(effective) : "—"}
                        {floored && " ▲"}
                      </td>
                      <td className="num dim">{v.gasPrice != null ? fmtInt(v.gasPrice) : "—"}</td>
                      <td className="num">{v.apy != null ? fmtBps(v.apy) : "—"}</td>
                      <td className="dim">{expanded ? "▾" : "▸"}</td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={11} style={{ whiteSpace: "normal", background: "var(--bg-inset)" }}>
                          <div style={{ padding: "8px 4px", display: "grid", gap: 10 }}>
                            <div className="row">
                              <Link
                                className="btn ghost"
                                to={v.status === "committee" || v.status === "active" ? `/validator/${v.address}` : `/address/${v.address}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {v.status === "committee" || v.status === "active" ? "full profile →" : "view account →"}
                              </Link>
                            </div>
                            {v.description && <div className="muted" style={{ fontFamily: "var(--font-display)" }}>{v.description}</div>}
                            <KV
                              rows={[
                                ["Address", <AddressLink addr={v.address} full />],
                                v.projectUrl && ["Project", <a href={v.projectUrl} target="_blank" rel="noreferrer">{v.projectUrl}</a>],
                                v.stakingPoolId && [
                                  "Staking pool id",
                                  <span className="row" style={{ gap: 8, display: "inline-flex" }}>
                                    <Hash value={v.stakingPoolId} full />
                                    <Pill color="amber" title="wrapped inside the system state object (0x5) — no standalone object record">
                                      WRAPPED
                                    </Pill>
                                  </span>,
                                ],
                                ["Pool activation epoch", v.activationEpoch != null ? fmtInt(v.activationEpoch) : "—"],
                                v.deactivationEpoch != null && ["Pool deactivation epoch", fmtInt(v.deactivationEpoch)],
                                ["Rewards pool", <Amount nanos={v.rewardsPool ?? null} maxFrac={0} />],
                                ["Pending stake", <Amount nanos={v.pendingStake ?? null} maxFrac={0} />],
                                ["Pending withdrawals", <Amount nanos={v.pendingTotalIotaWithdraw ?? null} maxFrac={0} />],
                                ["Next epoch stake", <Amount nanos={v.nextEpochStake ?? null} maxFrac={0} />],
                                ["Next epoch gas quote", v.nextEpochGasPrice != null ? fmtInt(v.nextEpochGasPrice) : "—"],
                                ["Next epoch commission", v.nextEpochCommissionRate != null ? fmtBps(v.nextEpochCommissionRate) : "—"],
                                effective != null && [
                                  <Info tip={TERMS.effectiveCommission}>Effective commission (IIP-8)</Info>,
                                  <span style={floored ? { color: "var(--amber)" } : undefined}>
                                    {fmtBps(effective)}
                                    {floored && ` — floored at voting power (declared ${fmtBps(v.commissionRate)})`}
                                  </span>,
                                ],
                                v.netAddress && ["Network address", <span className="mono small">{v.netAddress}</span>],
                                v.primaryAddress && ["Primary address", <span className="mono small">{v.primaryAddress}</span>],
                                v.protocolPubKey && [
                                  "Protocol pubkey",
                                  <span className="mono small" style={{ overflowWrap: "anywhere" }}>{v.protocolPubKey}</span>,
                                ],
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {rows.length === 0 && !pendingTables && (
                <tr>
                  <td colSpan={11} className="faint">
                    no validators in this set
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section index="02" title="Status legend" aux="what the numbers mean, in plain language">
        <div className="panel pad" style={{ display: "grid", gap: 10, fontSize: 13 }}>
          <div><Pill color="teal">COMMITTEE</Pill> <span className="muted">Selected to run consensus this epoch. Stake-weighted selection happens at every epoch boundary.</span></div>
          <div><Pill color="blue">ACTIVE</Pill> <span className="muted">In the active validator set and earning for its stakers, but not on this epoch's consensus committee.</span></div>
          <div><Pill color="violet">CANDIDATE</Pill> <span className="muted">Registered as a validator and collecting stake. It joins the active set once it reaches the minimum joining stake and requests to join.</span></div>
          <div><Pill color="amber">PENDING</Pill> <span className="muted">Accepted to join — it becomes active at the next epoch boundary.</span></div>
          <div><Pill color="coral">INACTIVE</Pill> <span className="muted">Left the active set. The pool stays around so stakers can withdraw at the exchange rate it retired with.</span></div>
          <div><Pill color="violet">STAKE</Pill> <span className="muted">The validator's own IOTA plus everything delegated to it. More stake → more voting power and more rewards to share.</span></div>
          <div><Pill color="blue">VOTING POWER</Pill> <span className="muted">Share of consensus votes, in basis points (10,000 = 100%). Capped so no single validator can dominate.</span></div>
          <div><Pill color="amber">COMMISSION</Pill> <span className="muted">The cut a validator keeps from staking rewards before passing the rest to its delegators.</span></div>
          <div><Pill>APY</Pill> <span className="muted">Estimated yearly return for staking with this validator, extrapolated from recent epochs. Not a guarantee.</span></div>
          <div><Pill>GAS QUOTE</Pill> <span className="muted">The gas price this validator proposes for the next epoch — the stake-weighted quorum of quotes becomes the reference gas price.</span></div>
        </div>
      </Section>
    </>
  );
}

// Epoch detail: lifecycle, economics (storage fund flows, gas, rewards),
// validator set summary, protocol config and the committee for that epoch.

import { useQuery } from "@tanstack/react-query";
import type { Validator } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { JsonTree } from "../components/JsonTree";
import {
  AddressLink,
  Amount,
  cmpValues,
  Empty,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  Pill,
  PrevNext,
  Section,
  SortTh,
  Stat,
  Tabs,
  useSort,
  useTabParam,
} from "../components/ui";
import { Info, TERMS } from "../components/Info";
import { durationBetween, effectiveCommissionBps, fmtBps, fmtInt, fmtIota, fmtRfc3339, rfc3339Ms } from "../lib/format";
import { epochSystemParameters } from "../lib/gql";
import { collectAllPages } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

export default function EpochDetail() {
  const { id = "" } = useParams();
  const client = useClient();
  const { network } = useNetwork();
  const [tab, setTab] = useTabParam("overview");

  const q = useQuery({
    queryKey: [network, "epoch", id],
    queryFn: async () => {
      const [epoch, params] = await Promise.all([
        client.epoch(BigInt(id)),
        epochSystemParameters(client, BigInt(id)).catch(() => null),
      ]);
      if (epoch == null) throw new Error(`epoch ${id} not found`);
      return { epoch, params };
    },
  });

  const vals = useQuery({
    queryKey: [network, "epoch-validators", id],
    enabled: tab === "validators",
    queryFn: () => collectAllPages((p) => client.activeValidators(BigInt(id), p)),
  });

  // previous committee for the joined/left diff (best-effort — old epochs
  // may not report a validator set anymore)
  const prevVals = useQuery({
    queryKey: [network, "epoch-validators", String(BigInt(id || "0") - 1n)],
    enabled: tab === "validators" && BigInt(id || "0") > 0n,
    queryFn: () => collectAllPages((p) => client.activeValidators(BigInt(id) - 1n, p)),
    retry: 2,
  });

  if (q.isPending) return <LoadingBlock />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { epoch: e, params } = q.data!;
  const start = rfc3339Ms(e.startTimestamp);
  const end = rfc3339Ms(e.endTimestamp ?? null);
  const live = e.endTimestamp == null;
  const vs = e.validatorSet;
  const durationMs = params?.durationMs ?? 86_400_000;
  const elapsed = live && start ? Date.now() - start : null;
  const progress = elapsed != null ? Math.min(100, (elapsed / durationMs) * 100) : null;

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/epochs">EPOCHS</Link> / {fmtInt(e.epochId)}
        </div>
        <h1>
          EPOCH {fmtInt(e.epochId)}
          <PrevNext current={e.epochId} base="/epoch" max={live ? e.epochId : null} label="epoch" />
          {live ? <Pill color="teal">LIVE</Pill> : <Pill>ENDED</Pill>}
          {e.protocolConfigs && (
            <Link to={`/protocol/${e.protocolConfigs.protocolVersion}`}>
              <Pill color="violet">PROTOCOL v{String(e.protocolConfigs.protocolVersion)}</Pill>
            </Link>
          )}
        </h1>
        <div className="sub">
          {fmtRfc3339(e.startTimestamp)} → {live ? "now" : fmtRfc3339(e.endTimestamp)}
          {start && <> · {durationBetween(start, end ?? Date.now())}</>}
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "validators", label: "Committee" },
          { id: "protocol", label: "Protocol", count: e.protocolConfigs ? `v${e.protocolConfigs.protocolVersion}` : undefined },
          { id: "raw", label: "Raw" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <>
          {progress != null && (
            <div className="panel pad" style={{ marginBottom: 14 }}>
              <div className="row spread">
                <span className="muted small"><Info tip={TERMS.epochProgress}>EPOCH PROGRESS</Info></span>
                <span className="mono small">
                  {durationBetween(0, elapsed!)} / {durationBetween(0, durationMs)} · ~{durationBetween(0, Math.max(0, durationMs - elapsed!))} left
                </span>
              </div>
              <div className="progress-track" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <div className="stat-grid">
            <Stat label="Transactions" value={e.totalTransactions != null ? fmtInt(e.totalTransactions) : "—"} />
            <Stat label={<Info tip={TERMS.checkpoint}>Checkpoints</Info>} value={e.totalCheckpoints != null ? fmtInt(e.totalCheckpoints) : "—"} />
            <Stat
              label={<Info tip={TERMS.refGasPrice}>Reference gas price</Info>}
              value={e.referenceGasPrice != null ? <>{fmtInt(e.referenceGasPrice)}<small>nanos</small></> : "—"}
              color="amber"
            />
            <Stat
              label={<Info tip={TERMS.stake}>Total stake</Info>}
              value={vs?.totalStake ? fmtIota(vs.totalStake, { maxFrac: 0, unit: false }) : "—"}
              hint="IOTA"
              color="violet"
            />
            <Stat label={<Info tip={TERMS.computationCost}>Gas fees</Info>} value={e.totalGasFees ? fmtIota(e.totalGasFees, { maxFrac: 1, unit: false }) : "—"} hint="IOTA paid in epoch" />
            <Stat
              label={<Info tip={TERMS.delegation}>Stake rewards</Info>}
              value={e.totalStakeRewards ? fmtIota(e.totalStakeRewards, { maxFrac: 1, unit: false }) : "—"}
              hint="IOTA distributed"
              color="blue"
            />
          </div>

          {params && (
            <Section index="00" title="System parameters" aux="rules for this epoch">
              <KV
                rows={[
                  ["Epoch duration", `${durationBetween(0, durationMs)}`],
                  params.minValidatorCount != null && ["Validator count (min/max)", `${params.minValidatorCount} / ${params.maxValidatorCount ?? "—"}`],
                  params.minValidatorJoiningStake != null && [
                    <Info tip={TERMS.validator}>Min joining stake</Info>,
                    <Amount nanos={params.minValidatorJoiningStake} maxFrac={0} />,
                  ],
                ]}
              />
            </Section>
          )}

          <Section index="01" title={<Info tip={TERMS.storageFund}>Storage fund</Info>}>
            <KV
              rows={[
                ["Fund size", <Amount nanos={e.fundSize ?? null} />],
                [<Info tip={TERMS.fundInflow}>Inflow (storage fees)</Info>, <Amount nanos={e.fundInflow ?? null} />],
                [<Info tip={TERMS.fundOutflow}>Outflow (rebates paid)</Info>, <Amount nanos={e.fundOutflow ?? null} />],
                ["Net inflow", <Amount nanos={e.netInflow ?? null} />],
              ]}
            />
          </Section>

          <Section index="02" title="System">
            <KV
              rows={[
                ["Epoch id", fmtInt(e.epochId)],
                ["Start", `${fmtRfc3339(e.startTimestamp)}`],
                ["End", live ? "in progress" : fmtRfc3339(e.endTimestamp)],
                ["System state version", e.systemStateVersion != null ? fmtInt(e.systemStateVersion) : "—"],
                [
                  "Protocol version",
                  e.protocolConfigs ? (
                    <Link to={`/protocol/${e.protocolConfigs.protocolVersion}`}>v{String(e.protocolConfigs.protocolVersion)}</Link>
                  ) : (
                    "—"
                  ),
                ],
                e.liveObjectSetDigest != null && ["Live object set digest", <span className="mono">{e.liveObjectSetDigest}</span>],
              ]}
            />
          </Section>

          {vs && (
            <Section index="03" title="Validator set" aux="counts link to the individual entries">
              <KV
                rows={[
                  ["Total stake", <Amount nanos={vs.totalStake ?? null} maxFrac={0} />],
                  ["Pending removals", vs.pendingRemovals?.length ? vs.pendingRemovals.join(", ") : "none"],
                  ["Pending active validators", <SetCount size={vs.pendingActiveValidatorsSize} tableId={vs.pendingActiveValidatorsId} />],
                  ["Validator candidates", <SetCount size={vs.validatorCandidatesSize} tableId={vs.validatorCandidatesId} />],
                  ["Inactive pools", <SetCount size={vs.inactivePoolsSize} tableId={vs.inactivePoolsId} />],
                  ["Staking pool mappings", <SetCount size={vs.stakingPoolMappingsSize} tableId={vs.stakingPoolMappingsId} />],
                ]}
              />
            </Section>
          )}
        </>
      )}

      {tab === "validators" &&
        (vals.isPending ? (
          <LoadingBlock label={`activeValidators(epoch = ${id})…`} />
        ) : vals.error ? (
          <ErrorNote error={vals.error} />
        ) : !vals.data?.length ? (
          <Empty>committee data unavailable for this epoch</Empty>
        ) : (
          <CommitteeTable
            validators={vals.data}
            previous={prevVals.data ?? null}
            epochId={id}
            protocolVersion={e.protocolConfigs?.protocolVersion ?? null}
          />
        ))}

      {tab === "protocol" &&
        (e.protocolConfigs ? (
          <Section index="01" title={`Protocol v${e.protocolConfigs.protocolVersion}`} aux={<Link to={`/protocol/${e.protocolConfigs.protocolVersion}`}>full view →</Link>}>
            <KV
              rows={[
                ["Version", String(e.protocolConfigs.protocolVersion)],
                ["Feature flags", `${e.protocolConfigs.featureFlags.length} flags`],
                ["Config entries", `${e.protocolConfigs.configs.length} keys`],
              ]}
            />
          </Section>
        ) : (
          <Empty>protocol configs not embedded for this epoch</Empty>
        ))}

      {tab === "raw" && (
        <Section index="01" title="Epoch record" aux="GraphQL Epoch record from client.epoch(id)">
          <JsonTree
            data={JSON.parse(
              JSON.stringify(e, (_k, v) => {
                if (typeof v === "bigint") return v.toString();
                if (v && typeof v === "object" && typeof (v as any).toHex === "function") return (v as any).toHex();
                return v;
              }),
            )}
          />
        </Section>
      )}
    </>
  );
}

// ── sortable committee table ────────────────────────────────────────────────

type CommitteeSortKey =
  | "name"
  | "address"
  | "stake"
  | "votingPower"
  | "commission"
  | "effective"
  | "gasPrice"
  | "apy";

function CommitteeTable({
  validators,
  previous,
  epochId,
  protocolVersion,
}: {
  validators: Validator[];
  previous: Validator[] | null;
  epochId: string;
  protocolVersion: bigint | null;
}) {
  const sort = useSort<CommitteeSortKey>("stake", "desc");

  // committee diff vs the previous epoch: who joined, who left, stake deltas
  const diff = useMemo(() => {
    if (!previous || previous.length === 0) return null;
    const prevByAddr = new Map(previous.map((v) => [v.address.toHex(), v]));
    const curAddrs = new Set(validators.map((v) => v.address.toHex()));
    const left = previous.filter((v) => !curAddrs.has(v.address.toHex()));
    return { prevByAddr, left };
  }, [previous, validators]);

  const rows = useMemo(() => {
    const derived = validators.map((v) => {
      const effective = effectiveCommissionBps(v.commissionRate, v.votingPower, protocolVersion);
      return {
        v,
        addr: v.address.toHex(),
        effective,
        floored: effective != null && v.commissionRate != null && effective > v.commissionRate,
        values: {
          name: v.name ?? null,
          address: v.address.toHex(),
          stake: v.stakingPoolIotaBalance ?? null,
          votingPower: v.votingPower ?? null,
          commission: v.commissionRate ?? null,
          effective,
          gasPrice: v.gasPrice ?? null,
          apy: v.apy ?? null,
        } as Record<CommitteeSortKey, unknown>,
      };
    });
    return derived.sort((a, b) => cmpValues(a.values[sort.key], b.values[sort.key], sort.dir));
  }, [validators, protocolVersion, sort.key, sort.dir]);

  return (
    <Section index="01" title="Committee" aux={`${validators.length} validators · sorted by ${sort.key} ${sort.dir === "desc" ? "▼" : "▲"}`}>
      <div className="panel tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <SortTh colKey="name" sort={sort} firstDir="asc">VALIDATOR</SortTh>
              <SortTh colKey="address" sort={sort} firstDir="asc">ADDRESS</SortTh>
              <SortTh colKey="stake" sort={sort} numeric>STAKE</SortTh>
              <SortTh colKey="votingPower" sort={sort} numeric>VOTING POWER</SortTh>
              <SortTh colKey="commission" sort={sort} numeric>COMMISSION</SortTh>
              <SortTh colKey="effective" sort={sort} numeric>
                <Info tip={TERMS.effectiveCommission}>EFFECTIVE (IIP-8)</Info>
              </SortTh>
              <SortTh colKey="gasPrice" sort={sort} numeric>GAS PRICE</SortTh>
              <SortTh colKey="apy" sort={sort} numeric>APY</SortTh>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ v, addr, effective, floored }) => (
              <tr key={addr}>
                <td>
                  <div className="validator-cell">
                    {v.imageUrl ? <img className="validator-img" src={v.imageUrl} alt="" loading="lazy" /> : <span className="validator-img" />}
                    <Link to={`/validator/${addr}?epoch=${epochId}`} style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                      {v.name ?? "—"}
                    </Link>
                    {diff && !diff.prevByAddr.has(addr) && (
                      <Pill color="teal" title="not in the previous epoch's committee">NEW</Pill>
                    )}
                  </div>
                </td>
                <td>
                  <AddressLink addr={addr} />
                </td>
                <td className="num">{v.stakingPoolIotaBalance ? fmtIota(v.stakingPoolIotaBalance, { maxFrac: 0, unit: false }) : "—"}</td>
                <td className="num dim">{v.votingPower != null ? fmtBps(v.votingPower) : "—"}</td>
                <td className="num dim">{v.commissionRate != null ? fmtBps(v.commissionRate) : "—"}</td>
                <td className="num" style={floored ? { color: "var(--amber)" } : undefined} title={floored ? "floored at voting power by IIP-8" : undefined}>
                  {effective != null ? fmtBps(effective) : "—"}
                  {floored && " ▲"}
                </td>
                <td className="num dim">{v.gasPrice != null ? fmtInt(v.gasPrice) : "—"}</td>
                <td className="num">{v.apy != null ? fmtBps(v.apy) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {diff && diff.left.length > 0 && (
        <div className="panel pad" style={{ marginTop: 10 }}>
          <span className="faint small" style={{ letterSpacing: "0.14em" }}>LEFT SINCE THE PREVIOUS EPOCH · </span>
          {diff.left.map((v, i) => {
            const a = v.address.toHex();
            return (
              <span key={a} className="small">
                {i > 0 && ", "}
                <Link to={`/validator/${a}?epoch=${String(BigInt(epochId) - 1n)}`}>{v.name ?? a.slice(0, 10)}</Link>
              </span>
            );
          })}
        </div>
      )}
    </Section>
  );
}

/**
 * A validator-set size with a drill-down: the sets live in on-chain Tables,
 * so the count links to the browsable dynamic-field container when the
 * table id is exposed and the set is non-empty.
 */
function SetCount({ size, tableId }: { size: number | bigint | null | undefined; tableId?: { toHex(): string } | null }) {
  if (size == null) return <>—</>;
  const n = String(size);
  if (tableId == null || n === "0") return <>{n}</>;
  const hex = tableId.toHex();
  return (
    <span className="row" style={{ gap: 8, display: "inline-flex" }}>
      {n}
      <Link className="pill teal" style={{ fontSize: 9.5, textDecoration: "none" }} to={`/object/${hex}?tab=dynamic`} title={hex}>
        view entries →
      </Link>
    </span>
  );
}

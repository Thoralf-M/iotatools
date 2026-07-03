// Staking — the delegator's view of the network: how much is staked, what it
// yields, when the next payout lands, a rewards calculator against the real
// committee, and a lookup for any address's staking positions.

import { useQuery } from "@tanstack/react-query";
import { Address, NameFormat } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import {
  AddressLink,
  Amount,
  Empty,
  ErrorNote,
  LoadingBlock,
  Pill,
  Section,
  Spinner,
  Stat,
  TxLink,
} from "../components/ui";
import { durationBetween, effectiveCommissionBps, fmtBps, fmtInt, fmtIota, rfc3339Ms, toBig } from "../lib/format";
import { addressStakes, epochSupplies, epochSystemParameters, type StakeRow } from "../lib/gql";
import { collectAllPages } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

const NANOS = 1e9;

function useStakingOverview() {
  const client = useClient();
  const { network } = useNetwork();
  return useQuery({
    queryKey: [network, "staking-overview"],
    queryFn: async () => {
      const epoch = await client.epoch();
      if (!epoch) throw new Error("current epoch unavailable");
      const [validators, params, supplies] = await Promise.all([
        collectAllPages((p) => client.activeValidators(undefined, p)),
        epochSystemParameters(client).catch(() => null),
        epochSupplies(client, [epoch.epochId]).catch(() => new Map<string, bigint>()),
      ]);
      return {
        epoch,
        validators,
        durationMs: params?.durationMs ?? 86_400_000,
        minJoiningStake: params?.minValidatorJoiningStake ?? null,
        supply: supplies.get(epoch.epochId.toString()) ?? null,
        protocolVersion: epoch.protocolConfigs?.protocolVersion ?? null,
      };
    },
  });
}

/** Positions of one address, with pool ids resolved to validator names. */
function StakeLookup({
  poolToValidator,
}: {
  poolToValidator: Map<string, { name: string; addr: string; apy: number | null }>;
}) {
  const client = useClient();
  const { network } = useNetwork();
  const [params, setParams] = useSearchParams();
  const addrParam = params.get("addr");
  const [draft, setDraft] = useState(addrParam ?? "");
  const [parseError, setParseError] = useState<string | null>(null);

  const q = useQuery({
    queryKey: [network, "staking-lookup", addrParam],
    enabled: !!addrParam,
    queryFn: () => addressStakes(client, addrParam!),
  });

  const lookup = () => {
    try {
      const hex = Address.fromHex(draft.trim()).toHex();
      setParseError(null);
      const next = new URLSearchParams(params);
      next.set("addr", hex);
      setParams(next);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e));
    }
  };

  const totals = useMemo(() => {
    if (!q.data) return null;
    let principal = 0n;
    let reward = 0n;
    for (const s of q.data) {
      try {
        principal += BigInt(s.principal);
        if (s.estimatedReward != null) reward += BigInt(s.estimatedReward);
      } catch {
        /* skip malformed */
      }
    }
    return { principal, reward };
  }, [q.data]);

  return (
    <>
      <div className="panel pad row" style={{ gap: 10 }}>
        <input
          className="input"
          style={{ flex: 1, maxWidth: 520 }}
          placeholder="your address (0x…) — see every staking position it holds"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
        />
        <button className="btn" disabled={!draft.trim()} onClick={lookup}>
          look up
        </button>
        {addrParam && (
          <Link className="btn ghost" to={`/address/${addrParam}?tab=staking`}>
            full account view →
          </Link>
        )}
      </div>
      {parseError && <div className="error-note" style={{ marginTop: 10 }}>{parseError}</div>}

      {addrParam &&
        (q.isPending ? (
          <LoadingBlock label="address.stakedIotas via GraphQL…" />
        ) : q.error ? (
          <ErrorNote error={q.error} />
        ) : q.data!.length === 0 ? (
          <Empty>no staking positions for this address</Empty>
        ) : (
          <>
            {totals && (
              <div className="stat-grid" style={{ marginTop: 12 }}>
                <Stat label="Positions" value={q.data!.length} />
                <Stat label={<Info tip={TERMS.stake}>Staked principal</Info>} value={<Amount nanos={totals.principal} maxFrac={2} />} color="violet" />
                <Stat
                  label={<Info tip="Estimated rewards accrued so far, claimable when the stake is withdrawn.">Est. rewards</Info>}
                  value={<Amount nanos={totals.reward} maxFrac={4} />}
                  color="amber"
                />
              </div>
            )}
            <div className="panel tbl-wrap" style={{ marginTop: 12 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>VALIDATOR</th>
                    <th className="num">PRINCIPAL</th>
                    <th className="num">EST. REWARDS</th>
                    <th>STATUS</th>
                    <th className="num">ACTIVE SINCE</th>
                    <th>STAKE OBJECT</th>
                  </tr>
                </thead>
                <tbody>
                  {q.data!.map((s: StakeRow, i) => {
                    const poolId = s.json?.pool_id != null ? String(s.json.pool_id) : null;
                    const v = poolId ? poolToValidator.get(poolId) : undefined;
                    const stakeId = s.json?.id != null ? String(s.json.id) : null;
                    return (
                      <tr key={i}>
                        <td>
                          {v ? (
                            <Link to={`/validator/${v.addr}`} style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                              {v.name}
                            </Link>
                          ) : poolId ? (
                            <span className="dim mono" title={poolId}>pool {poolId.slice(0, 10)}…</span>
                          ) : (
                            "—"
                          )}
                          {v?.apy != null && <span className="faint"> · APY {fmtBps(v.apy)}</span>}
                        </td>
                        <td className="num"><Amount nanos={s.principal} maxFrac={2} /></td>
                        <td className="num">{s.estimatedReward != null ? <Amount nanos={s.estimatedReward} maxFrac={4} /> : <span className="faint">—</span>}</td>
                        <td>
                          {s.status.toUpperCase() === "ACTIVE" ? (
                            <Pill color="teal">ACTIVE</Pill>
                          ) : s.status.toUpperCase() === "PENDING" ? (
                            <Pill color="amber" title="activates at the next epoch boundary">PENDING</Pill>
                          ) : (
                            <Pill>{s.status || "—"}</Pill>
                          )}
                        </td>
                        <td className="num dim">{s.activatedEpoch != null ? <Link to={`/epoch/${s.activatedEpoch}`}>{fmtInt(s.activatedEpoch)}</Link> : "—"}</td>
                        <td>{stakeId ? <Link to={`/object/${stakeId}`} className="mono small">{stakeId.slice(0, 10)}…{stakeId.slice(-4)}</Link> : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ))}
    </>
  );
}

/** What-if rewards calculator against the live committee. */
function Calculator({
  validators,
  durationMs,
  protocolVersion,
}: {
  validators: Array<{ name: string; addr: string; apy: number | null; effective: number | null; stake: bigint | null }>;
  durationMs: number;
  protocolVersion: bigint | null;
}) {
  const [amount, setAmount] = useState("1000");
  const [valAddr, setValAddr] = useState(validators[0]?.addr ?? "");
  const v = validators.find((x) => x.addr === valAddr) ?? validators[0];
  const amt = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const apyFrac = v?.apy != null ? v.apy / 10_000 : null; // bps → fraction
  const perYear = apyFrac != null ? amt * apyFrac : null;
  const epochsPerYear = 365 * (86_400_000 / durationMs);
  const perEpoch = perYear != null ? perYear / epochsPerYear : null;

  return (
    <div className="panel pad">
      <div className="row" style={{ gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="field" style={{ width: 170 }}>
          <label>stake amount (IOTA)</label>
          <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="field" style={{ minWidth: 260, flex: 1, maxWidth: 380 }}>
          <label>validator (sorted by APY)</label>
          <select className="input" value={valAddr} onChange={(e) => setValAddr(e.target.value)}>
            {validators.map((x) => (
              <option key={x.addr} value={x.addr}>
                {x.name} — APY {x.apy != null ? fmtBps(x.apy) : "?"} · commission {x.effective != null ? fmtBps(x.effective) : "?"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="stat-grid" style={{ marginTop: 14 }}>
        <Stat label="Per epoch (~24h)" value={perEpoch != null ? `${perEpoch.toFixed(3)} IOTA` : "—"} />
        <Stat label="Per month" value={perYear != null ? `${(perYear / 12).toFixed(2)} IOTA` : "—"} color="blue" />
        <Stat label="Per year" value={perYear != null ? `${perYear.toFixed(2)} IOTA` : "—"} color="violet" />
        <Stat
          label="Effective commission"
          value={v?.effective != null ? fmtBps(v.effective) : "—"}
          hint={v && v.effective != null && v.apy != null ? "already reflected in the APY" : undefined}
          color="amber"
        />
      </div>
      <div className="faint small" style={{ marginTop: 10 }}>
        Estimate based on the validator's recent APY ({v?.apy != null ? fmtBps(v.apy) : "?"}, IIP-8 effective commission applied
        {protocolVersion != null ? ` · protocol v${protocolVersion}` : ""}). Real yields move with total stake and network fees.
        New stakes activate at the next epoch boundary.
      </div>
    </div>
  );
}

export default function Staking() {
  const q = useStakingOverview();

  const derived = useMemo(() => {
    if (!q.data) return null;
    const { epoch, validators, durationMs, supply, protocolVersion } = q.data;
    const rows = validators
      .map((v) => ({
        name: v.name ?? v.address.toHex().slice(0, 10),
        addr: v.address.toHex(),
        apy: v.apy ?? null,
        effective: effectiveCommissionBps(v.commissionRate, v.votingPower, protocolVersion),
        stake: toBig(v.stakingPoolIotaBalance),
        poolId: v.stakingPoolId.toHex(),
      }))
      .sort((a, b) => (b.apy ?? -1) - (a.apy ?? -1));
    const poolToValidator = new Map(rows.map((r) => [r.poolId, { name: r.name, addr: r.addr, apy: r.apy }]));
    const totalStake = toBig(epoch.validatorSet?.totalStake) ?? rows.reduce((acc, r) => acc + (r.stake ?? 0n), 0n);
    const apys = rows.map((r) => r.apy).filter((a): a is number => a != null && a > 0);
    const avgApy = apys.length ? apys.reduce((a, b) => a + b, 0) / apys.length : null;
    const stakedPct = supply != null && supply > 0n && totalStake != null ? (Number(totalStake) / Number(supply)) * 100 : null;
    const startMs = rfc3339Ms(epoch.startTimestamp);
    const nextChangeMs = startMs != null ? startMs + durationMs : null;
    return { rows, poolToValidator, totalStake, avgApy, stakedPct, nextChangeMs, durationMs };
  }, [q.data]);

  if (q.isPending) return <LoadingBlock label="committee + supply through the wasm SDK…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  const d = derived!;
  const { epoch, minJoiningStake, protocolVersion, durationMs } = q.data!;

  return (
    <>
      <div className="page-head">
        <h1>STAKING</h1>
        <div className="sub">
          <Info tip={TERMS.delegation}>
            Delegate IOTA to a validator, earn a share of every epoch's rewards. Stakes activate at the next epoch boundary and can be withdrawn anytime.
          </Info>
        </div>
      </div>

      <div className="stat-grid">
        <Stat
          label={<Info tip={TERMS.stake}>Total staked</Info>}
          value={d.totalStake != null ? fmtIota(d.totalStake, { maxFrac: 0, unit: false }) : "—"}
          hint="IOTA"
          color="violet"
        />
        <Stat
          label={<Info tip="Share of the entire IOTA supply currently locked in staking — a decentralization and security signal.">Staked share of supply</Info>}
          value={d.stakedPct != null ? `${d.stakedPct.toFixed(1)}%` : "—"}
          hint="of total supply"
        />
        <Stat
          label={<Info tip={TERMS.apy}>Average APY</Info>}
          value={d.avgApy != null ? fmtBps(Math.round(d.avgApy)) : "—"}
          hint="across the committee"
          color="blue"
        />
        <Stat
          label={<Info tip={TERMS.epochProgress}>Next reward payout</Info>}
          value={d.nextChangeMs != null ? `~${durationBetween(Date.now(), Math.max(Date.now(), d.nextChangeMs))}` : "—"}
          hint={`epoch ${fmtInt(epoch.epochId)} ends · rewards distribute at the boundary`}
          color="amber"
        />
      </div>

      <Section index="01" title="Your staking positions" aux="stakedIotas of any address — try your own">
        <StakeLookup poolToValidator={d.poolToValidator} />
      </Section>

      <Section index="02" title="Rewards calculator" aux="estimates only — not financial advice">
        <Calculator validators={d.rows} durationMs={d.durationMs} protocolVersion={protocolVersion} />
      </Section>

      <Section
        index="03"
        title="Where to stake"
        aux={
          <>
            top of {d.rows.length} validators by APY · <Link to="/validators">full committee →</Link>
          </>
        }
      >
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>VALIDATOR</th>
                <th className="num"><Info tip={TERMS.apy}>APY</Info></th>
                <th className="num"><Info tip={TERMS.effectiveCommission}>EFFECTIVE COMMISSION</Info></th>
                <th className="num"><Info tip={TERMS.stake}>STAKE (IOTA)</Info></th>
                <th className="num">SHARE</th>
              </tr>
            </thead>
            <tbody>
              {d.rows.slice(0, 12).map((r) => {
                const share = d.totalStake && d.totalStake > 0n && r.stake != null ? (Number(r.stake) / Number(d.totalStake)) * 100 : null;
                return (
                  <tr key={r.addr}>
                    <td>
                      <Link to={`/validator/${r.addr}`} style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                        {r.name}
                      </Link>
                    </td>
                    <td className="num" style={{ color: "var(--teal)" }}>{r.apy != null ? fmtBps(r.apy) : "—"}</td>
                    <td className="num dim">{r.effective != null ? fmtBps(r.effective) : "—"}</td>
                    <td className="num dim">{r.stake != null ? fmtIota(r.stake, { maxFrac: 0, unit: false }) : "—"}</td>
                    <td className="num dim">{share != null ? `${share.toFixed(2)}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="faint small" style={{ marginTop: 8 }}>
          Staking with smaller validators strengthens decentralization — and IIP-8 makes large validators effectively more
          expensive (commission floored at voting power).
          {minJoiningStake != null && <> Validators themselves need ≥ {fmtIota(minJoiningStake, { maxFrac: 0 })} to join.</>}
        </div>
      </Section>
    </>
  );
}

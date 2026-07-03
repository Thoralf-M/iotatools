// Active validator committee with stake distribution and per-validator
// economics; expandable rows expose credentials and next-epoch values.

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { AddressLink, Amount, ErrorNote, Hash, KV, LoadingBlock, Pill, Section, Stat } from "../components/ui";
import { effectiveCommissionBps, fmtBps, fmtInt, fmtIota, toBig } from "../lib/format";
import { collectAllPages } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

export default function Validators() {
  const client = useClient();
  const { network } = useNetwork();
  const [params] = useSearchParams();
  const epochParam = params.get("epoch");
  const [open, setOpen] = useState<string | null>(null);

  const q = useQuery({
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

  if (q.isPending) return <LoadingBlock label="activeValidators()…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { vals, total, protocolVersion } = q.data!;
  const top10 = vals.slice(0, 10).reduce((acc, v) => acc + (toBig(v.stakingPoolIotaBalance) ?? 0n), 0n);

  return (
    <>
      <div className="page-head">
        <h1>
          VALIDATORS
          {epochParam && <Pill color="amber">EPOCH {epochParam}</Pill>}
        </h1>
        <div className="sub">
          Committee via <span className="mono">client.activeValidators(epoch?)</span>
        </div>
      </div>

      <div className="stat-grid">
        <Stat label={<Info tip={TERMS.committee}>Committee size</Info>} value={vals.length} />
        <Stat label={<Info tip={TERMS.stake}>Total stake</Info>} value={fmtIota(total, { maxFrac: 0, unit: false })} hint="IOTA" color="violet" />
        <Stat
          label="Top-10 concentration"
          value={total > 0n ? `${((Number(top10) / Number(total)) * 100).toFixed(1)}%` : "—"}
          hint="share of stake held by the 10 largest validators — lower is healthier"
          color="amber"
        />
      </div>

      <Section index="01" title="Committee" aux="click a row for credentials & next-epoch values">
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th><Info tip={TERMS.validator}>VALIDATOR</Info></th>
                <th className="num"><Info tip={TERMS.stake}>STAKE (IOTA)</Info></th>
                <th className="num">SHARE</th>
                <th className="num"><Info tip={TERMS.votingPower}>VOTING POWER</Info></th>
                <th className="num"><Info tip={TERMS.commission}>COMMISSION</Info></th>
                <th className="num"><Info tip={TERMS.effectiveCommission}>EFFECTIVE (IIP-8)</Info></th>
                <th className="num"><Info tip={TERMS.refGasPrice}>GAS QUOTE</Info></th>
                <th className="num"><Info tip={TERMS.apy}>APY</Info></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vals.map((v, i) => {
                const hex = v.address.toHex();
                const stake = toBig(v.stakingPoolIotaBalance);
                const share = total > 0n && stake != null ? (Number(stake) / Number(total)) * 100 : null;
                const expanded = open === hex;
                const effective = effectiveCommissionBps(v.commissionRate, v.votingPower, protocolVersion);
                const floored = effective != null && v.commissionRate != null && effective > v.commissionRate;
                return (
                  <React.Fragment key={hex}>
                    <tr style={{ cursor: "pointer" }} onClick={() => setOpen(expanded ? null : hex)}>
                      <td className="dim">{i + 1}</td>
                      <td>
                        <div className="validator-cell">
                          {v.imageUrl ? <img className="validator-img" src={v.imageUrl} alt="" loading="lazy" /> : <span className="validator-img" />}
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{v.name ?? "—"}</span>
                        </div>
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
                        <td colSpan={10} style={{ whiteSpace: "normal", background: "var(--bg-inset)" }}>
                          <div style={{ padding: "8px 4px", display: "grid", gap: 10 }}>
                            <div className="row">
                              <Link className="btn ghost" to={`/validator/${hex}`} onClick={(e) => e.stopPropagation()}>
                                full profile →
                              </Link>
                            </div>
                            {v.description && <div className="muted" style={{ fontFamily: "var(--font-display)" }}>{v.description}</div>}
                            <KV
                              rows={[
                                ["Address", <AddressLink addr={hex} full />],
                                v.projectUrl && ["Project", <a href={v.projectUrl} target="_blank" rel="noreferrer">{v.projectUrl}</a>],
                                [
                                  "Staking pool id",
                                  <span className="row" style={{ gap: 8, display: "inline-flex" }}>
                                    <Hash value={v.stakingPoolId.toHex()} full />
                                    <Pill color="amber" title="wrapped inside the system state object (0x5) — no standalone object record">
                                      WRAPPED
                                    </Pill>
                                  </span>,
                                ],
                                ["Pool activation epoch", v.stakingPoolActivationEpoch != null ? fmtInt(v.stakingPoolActivationEpoch) : "—"],
                                ["Rewards pool", <Amount nanos={v.rewardsPool ?? null} maxFrac={0} />],
                                ["Pending stake", <Amount nanos={v.pendingStake ?? null} maxFrac={0} />],
                                ["Pending withdrawals", <Amount nanos={v.pendingTotalIotaWithdraw ?? null} maxFrac={0} />],
                                ["Next epoch stake", <Amount nanos={v.nextEpochStake ?? null} maxFrac={0} />],
                                ["Next epoch gas quote", v.nextEpochGasPrice != null ? fmtInt(v.nextEpochGasPrice) : "—"],
                                ["Next epoch commission", v.nextEpochCommissionRate != null ? fmtBps(v.nextEpochCommissionRate) : "—"],
                                [
                                  <Info tip={TERMS.effectiveCommission}>Effective commission (IIP-8)</Info>,
                                  effective != null ? (
                                    <span style={floored ? { color: "var(--amber)" } : undefined}>
                                      {fmtBps(effective)}
                                      {floored && ` — floored at voting power (declared ${fmtBps(v.commissionRate)})`}
                                    </span>
                                  ) : (
                                    "—"
                                  ),
                                ],
                                v.credentials?.netAddress && ["Network address", <span className="mono small">{v.credentials.netAddress}</span>],
                                v.credentials?.primaryAddress && ["Primary address", <span className="mono small">{v.credentials.primaryAddress}</span>],
                                v.credentials?.protocolPubKey && [
                                  "Protocol pubkey",
                                  <span className="mono small" style={{ overflowWrap: "anywhere" }}>{v.credentials.protocolPubKey}</span>,
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
            </tbody>
          </table>
        </div>
      </Section>

      <Section index="02" title="Status legend" aux="what the numbers mean, in plain language">
        <div className="panel pad" style={{ display: "grid", gap: 10, fontSize: 13 }}>
          <div><Pill color="teal">COMMITTEE</Pill> <span className="muted">Selected to run consensus this epoch. Stake-weighted selection happens at every epoch boundary.</span></div>
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

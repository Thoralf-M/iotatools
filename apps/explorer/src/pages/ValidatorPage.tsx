// Single-validator detail: identity, pool economics, next-epoch commitments
// and consensus credentials for one member of the active committee.
//
// There is no per-validator query in the SDK, so we drain the full
// activeValidators connection (collectAllPages — pages >50 trap the wasm
// client) and pick the matching address. ?epoch=N shows a historic committee.

import { useQuery } from "@tanstack/react-query";
import { Address, type ValidatorCredentials } from "@iota/sdk-wasm";
import React, { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import {
  AddressLink,
  Amount,
  Collapse,
  CopyBtn,
  Empty,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  ObjectLink,
  Pill,
  Section,
  Stat,
} from "../components/ui";
import { bytesToHex, effectiveCommissionBps, fmtBps, fmtInt } from "../lib/format";
import { collectAllPages } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

/** Base64 pubkey / proof blob: monospaced, wrap-anywhere, with copy. */
function B64({ value }: { value: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2, maxWidth: "100%" }}>
      <span className="mono small" style={{ overflowWrap: "anywhere" }}>
        {value}
      </span>
      <CopyBtn text={value} />
    </span>
  );
}

/** KV rows for a ValidatorCredentials record — only the fields that are set. */
function credRows(c: ValidatorCredentials): Array<[React.ReactNode, React.ReactNode] | null | undefined | false | ""> {
  return [
    c.netAddress && ["Network address", <span className="mono small">{c.netAddress}</span>],
    c.p2pAddress && ["P2P address", <span className="mono small">{c.p2pAddress}</span>],
    c.primaryAddress && ["Primary address", <span className="mono small">{c.primaryAddress}</span>],
    c.protocolPubKey && ["Protocol pubkey", <B64 value={c.protocolPubKey} />],
    c.networkPubKey && ["Network pubkey", <B64 value={c.networkPubKey} />],
    c.authorityPubKey && ["Authority pubkey", <B64 value={c.authorityPubKey} />],
    c.proofOfPossession && ["Proof of possession", <B64 value={c.proofOfPossession} />],
  ];
}

export default function ValidatorPage() {
  const { addr = "" } = useParams();
  const [params] = useSearchParams();
  const epochParam = params.get("epoch");
  const client = useClient();
  const { network } = useNetwork();

  const addrHex = useMemo(() => {
    try {
      return Address.fromHex(addr).toHex();
    } catch {
      try {
        return Address.fromShortHex(addr.startsWith("0x") ? addr : `0x${addr}`).toHex();
      } catch {
        return null;
      }
    }
  }, [addr]);

  const q = useQuery({
    queryKey: [network, "validator", addrHex, epochParam],
    enabled: !!addrHex,
    queryFn: async () => {
      const [all, epoch] = await Promise.all([
        collectAllPages((p) => client.activeValidators(epochParam ? BigInt(epochParam) : undefined, p)),
        client.epoch(epochParam ? BigInt(epochParam) : undefined).catch(() => null),
      ]);
      return {
        v: all.find((v) => v.address.toHex() === addrHex) ?? null,
        protocolVersion: epoch?.protocolConfigs?.protocolVersion ?? null,
      };
    },
  });

  if (!addrHex) {
    return (
      <Empty>
        “{addr}” is not a valid address — <Link to="/validators">back to the committee table</Link>
      </Empty>
    );
  }
  if (q.isPending) return <LoadingBlock label="activeValidators()…" />;
  if (q.error) return <ErrorNote error={q.error} />;

  const v = q.data?.v;
  if (!v) {
    return (
      <Empty>
        <Hash value={addrHex} copy={false} /> is not in the active set for this epoch
        {epochParam ? ` (epoch ${epochParam})` : ""} — <Link to="/validators">back to the committee table</Link>
      </Empty>
    );
  }
  const effective = effectiveCommissionBps(v.commissionRate, v.votingPower, q.data?.protocolVersion);
  const floored = effective != null && v.commissionRate != null && effective > v.commissionRate;

  return (
    <>
      <div className="page-head">
        <h1 style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {v.imageUrl ? (
            <img className="validator-img" style={{ width: 56, height: 56 }} src={v.imageUrl} alt="" />
          ) : (
            <span className="validator-img" style={{ width: 56, height: 56 }} />
          )}
          <Info tip={TERMS.validator}>{v.name ?? "VALIDATOR"}</Info>
          {epochParam && <Pill color="amber">EPOCH {epochParam}</Pill>}
          {v.apy != null && <Pill color="teal" title="estimated staking APY">APY {fmtBps(v.apy)}</Pill>}
          {effective != null && (
            <Pill
              color={floored ? "amber" : "violet"}
              title={floored ? `declared ${fmtBps(v.commissionRate)}, floored at voting power by IIP-8` : "commission on staking rewards"}
            >
              COMMISSION {fmtBps(effective)}
              {floored && " ▲"}
            </Pill>
          )}
        </h1>
        {v.description && <div className="sub">{v.description}</div>}
        <div className="sub" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {v.projectUrl && (
            <a href={v.projectUrl} target="_blank" rel="noreferrer">
              {v.projectUrl} ↗
            </a>
          )}
          <Link to={`/address/${addrHex}`}>view account →</Link>
          <Link to="/validators">committee table →</Link>
        </div>
      </div>

      <div className="stat-grid">
        <Stat
          label={<Info tip={TERMS.stake}>Stake</Info>}
          value={<Amount nanos={v.stakingPoolIotaBalance ?? null} maxFrac={0} />}
          color="violet"
        />
        <Stat
          label={<Info tip={TERMS.votingPower}>Voting power</Info>}
          value={v.votingPower != null ? fmtBps(v.votingPower) : "—"}
          color="blue"
        />
        <Stat
          label={<Info tip={TERMS.commission}>Commission</Info>}
          value={v.commissionRate != null ? fmtBps(v.commissionRate) : "—"}
          hint="declared"
          color="amber"
        />
        <Stat
          label={<Info tip={TERMS.effectiveCommission}>Effective (IIP-8)</Info>}
          value={
            effective != null ? (
              <span style={floored ? { color: "var(--amber)" } : undefined}>{fmtBps(effective)}</span>
            ) : (
              "—"
            )
          }
          hint={floored ? "floored at voting power" : "= declared"}
          color="amber"
        />
        <Stat label={<Info tip={TERMS.apy}>APY</Info>} value={v.apy != null ? fmtBps(v.apy) : "—"} />
        <Stat
          label={<Info tip={TERMS.refGasPrice}>Gas quote</Info>}
          value={v.gasPrice != null ? fmtInt(v.gasPrice) : "—"}
          hint="nanos / gas unit"
        />
      </div>

      <Section index="01" title="Identity" aux="who this validator is on-chain">
        <KV
          rows={[
            ["Address", <AddressLink addr={addrHex} full />],
            [
              "Staking pool id",
              <span className="row" style={{ gap: 8, display: "inline-flex" }}>
                <Hash value={v.stakingPoolId.toHex()} full />
                <Pill color="amber" title="the pool is wrapped inside the system state object (0x5) — it has no standalone object record">
                  WRAPPED
                </Pill>
              </span>,
            ],
            [
              <Info tip="The capability object that authorizes operating this validator (gas price quotes, tallying). It can be delegated to another address.">
                Operation cap
              </Info>,
              v.operationCap ? <Hash value={bytesToHex(v.operationCap)} head={10} tail={10} /> : <span className="faint">—</span>,
            ],
            [
              <Info tip={TERMS.epoch}>Pool activation epoch</Info>,
              v.stakingPoolActivationEpoch != null ? (
                <Link to={`/epoch/${v.stakingPoolActivationEpoch}`}>{fmtInt(v.stakingPoolActivationEpoch)}</Link>
              ) : (
                <span className="faint">—</span>
              ),
            ],
            [
              <Info tip="Number of entries in the pool's historical exchange-rate table (pool tokens ↔ IOTA) — roughly the number of epochs the pool has been active.">
                Exchange rates table size
              </Info>,
              v.exchangeRatesSize != null ? fmtInt(v.exchangeRatesSize) : <span className="faint">—</span>,
            ],
          ]}
        />
      </Section>

      <Section index="02" title="Pool economics" aux={<Info tip={TERMS.delegation}>staking pool state this epoch</Info>}>
        <KV
          rows={[
            [
              <Info tip="Staking rewards accumulated by the pool, paid out at epoch boundaries.">Rewards pool</Info>,
              <Amount nanos={v.rewardsPool ?? null} />,
            ],
            [
              <Info tip="Total pool tokens issued — stakers hold pool tokens whose exchange rate vs IOTA grows with rewards.">
                Pool token balance
              </Info>,
              v.poolTokenBalance != null ? fmtInt(v.poolTokenBalance) : <span className="faint">—</span>,
            ],
            [
              <Info tip="stake added this epoch, activates at the boundary">Pending stake</Info>,
              <Amount nanos={v.pendingStake ?? null} />,
            ],
            [
              <Info tip="Stake withdrawn during the current epoch — leaves the pool at the boundary.">
                Pending total withdraw
              </Info>,
              <Amount nanos={v.pendingTotalIotaWithdraw ?? null} />,
            ],
            [
              <Info tip="Pool tokens burned for withdrawals this epoch, settled at the boundary.">
                Pending pool token withdraw
              </Info>,
              v.pendingPoolTokenWithdraw != null ? fmtInt(v.pendingPoolTokenWithdraw) : <span className="faint">—</span>,
            ],
          ]}
        />
      </Section>

      <Section
        index="03"
        title={<Info tip="Values committed for the next epoch boundary.">Next epoch</Info>}
        aux="takes effect at the boundary"
      >
        <KV
          rows={[
            [
              <Info tip={TERMS.stake}>Next epoch stake</Info>,
              <Amount nanos={v.nextEpochStake ?? null} />,
            ],
            [
              <Info tip={TERMS.refGasPrice}>Next epoch gas price</Info>,
              v.nextEpochGasPrice != null ? fmtInt(v.nextEpochGasPrice) : <span className="faint">—</span>,
            ],
            [
              <Info tip={TERMS.commission}>Next epoch commission</Info>,
              v.nextEpochCommissionRate != null ? fmtBps(v.nextEpochCommissionRate) : <span className="faint">—</span>,
            ],
          ]}
        />
      </Section>

      <Section
        index="04"
        title="Credentials"
        aux={<Info tip="Network endpoints and public keys this validator uses for consensus, plus a proof it owns its authority key." />}
      >
        {v.credentials ? <KV rows={credRows(v.credentials)} /> : <Empty>no credentials published</Empty>}
        {v.nextEpochCredentials && (
          <div style={{ marginTop: 10 }}>
            <Collapse label="next epoch credentials">
              <KV rows={credRows(v.nextEpochCredentials)} />
            </Collapse>
          </div>
        )}
      </Section>
    </>
  );
}

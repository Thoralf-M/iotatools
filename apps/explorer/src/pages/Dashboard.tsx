// Pulse — live network overview. Everything on this page is polled through
// the wasm SDK client: epoch record, checkpoint stream, transaction stream,
// supply, plus a small hot-functions leaderboard computed client-side from
// the most recent PTBs.

import { useQuery } from "@tanstack/react-query";
import { TransactionBlockKindInput, TransactionsFilter, transactionToJson } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import {
  Age,
  ErrorNote,
  Hash,
  LoadingBlock,
  Pill,
  Section,
  Sparkline,
  Stat,
  TxLink,
} from "../components/ui";
import { listCheckpoints, type CheckpointRow } from "../lib/checkpoints";
import {
  durationBetween,
  fmtCompact,
  fmtInt,
  fmtIota,
  rfc3339Ms,
  timeAgo,
  toBig,
} from "../lib/format";
import { epochSystemParameters } from "../lib/gql";
import { fetchValidatorSetInfo } from "../lib/validator-set";
import { pageBack, useClient, useNetwork } from "../lib/sdk";
import { commandViews, isSystemKind, kindLabel, kindTag, ptbBody, summarizeKind, unwrapV1 } from "../lib/tx";

const IOTA_TYPE = "0x2::iota::IOTA";

/** A compacted number that expands to its full digits on click. */
function ToggleNum({ compact, full }: { compact: string; full: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <span
      style={{ cursor: "pointer" }}
      title={expanded ? `≈${compact} — click to round` : `${full} — click for exact digits`}
      onClick={() => setExpanded((v) => !v)}
    >
      {expanded ? full : `≈${compact}`}
    </span>
  );
}

/** Whole IOTA, compacted — nine-digit amounts wrap mid-number in a stat tile. */
function compactIota(nanos: bigint | string | number | null | undefined): string {
  const b = toBig(nanos);
  return b == null ? "—" : fmtCompact(b / 1_000_000_000n);
}

/** Share of the total IOTA supply, as a percentage string. */
function shareOfSupply(amount: bigint | string | number | null | undefined, supply: bigint | string | number | null | undefined): string {
  const a = toBig(amount);
  const s = toBig(supply);
  if (a == null || s == null || s === 0n) return "—";
  const pct = (Number(a) / Number(s)) * 100;
  if (pct > 0 && pct < 0.01) return `${Number(pct.toPrecision(2))}%`;
  return `${pct.toFixed(pct < 1 ? 2 : 1)}%`;
}

interface TxRow {
  digest: string;
  kindT: string;
  summary: string;
  sender: string;
}

function useDashboard(paused: boolean) {
  const client = useClient();
  const { network } = useNetwork();
  return useQuery({
    queryKey: [network, "dashboard"],
    refetchInterval: paused ? false : 4000,
    queryFn: async () => {
      const [chainId, epoch, totalTx, refGas, supply, cpList, txPage, ptbPage, sysParams] = await Promise.all([
        client.chainId(),
        client.epoch(),
        client.totalTransactionBlocks(),
        client.referenceGasPrice(),
        client.totalSupply(IOTA_TYPE).catch(() => null),
        listCheckpoints(client, { limit: 40 }),
        client.transactions(undefined, pageBack(10)),
        client.transactions(TransactionsFilter.new({ kind: TransactionBlockKindInput.ProgrammableTx }), pageBack(50)),
        epochSystemParameters(client).catch(() => null),
      ]);
      const txs = [...txPage.data].reverse();

      // hot functions: count MoveCall targets across the latest 50 PTBs
      const fnCounts = new Map<string, number>();
      for (const st of ptbPage.data) {
        try {
          const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
          const ptb = ptbBody(j?.kind);
          if (!ptb) continue;
          for (const v of commandViews(ptb.commands)) {
            if (v.target) {
              const key = `${v.target.pkg}::${v.target.module}::${v.target.fn}`;
              fnCounts.set(key, (fnCounts.get(key) ?? 0) + 1);
            }
          }
        } catch {
          /* skip unparseable */
        }
      }
      const hotFns = [...fnCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

      // the PTB page is ascending — its tail is the newest programmable traffic
      const ptbRows: TxRow[] = [...ptbPage.data]
        .slice(-10)
        .reverse()
        .map((st) => {
          const digest = st.transaction.digest().toBase58();
          try {
            const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
            return { digest, kindT: kindTag(j?.kind), summary: summarizeKind(j?.kind), sender: (j?.sender as string) ?? "" };
          } catch {
            return { digest, kindT: "Unknown", summary: "", sender: "" };
          }
        });

      const txRows: TxRow[] = txs.map((st) => {
        const digest = st.transaction.digest().toBase58();
        try {
          const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
          return {
            digest,
            kindT: kindTag(j?.kind),
            summary: summarizeKind(j?.kind),
            sender: (j?.sender as string) ?? "",
          };
        } catch {
          return { digest, kindT: "Unknown", summary: "", sender: "" };
        }
      });

      return { chainId, epoch, totalTx, refGas, supply, cps: cpList.rows, txRows, ptbRows, hotFns, sysParams };
    },
  });
}

export default function Dashboard() {
  const [paused, setPaused] = useState(false);
  const [allKinds, setAllKinds] = useState(false);
  const { data, error, isPending } = useDashboard(paused);
  const client = useClient();
  const { network } = useNetwork();

  // The committee only changes at an epoch boundary, and counting it means
  // reading the whole system state — so it is fetched once per epoch.
  const epochId = data?.epoch?.epochId;
  const committee = useQuery({
    queryKey: [network, "committee-size", epochId?.toString() ?? ""],
    enabled: epochId != null,
    staleTime: Infinity,
    queryFn: async () => {
      const info = await fetchValidatorSetInfo(client);
      return { committee: info.committee.size, active: info.activeCount };
    },
  });

  // Programmable traffic is what people come here for; system transactions
  // (consensus prologue, randomness) drown it out, so they are off by default.
  const visibleTxs = useMemo(() => (data ? (allKinds ? data.txRows : data.ptbRows) : []), [data, allKinds]);

  if (isPending) return <LoadingBlock label="booting feed — querying via wasm SDK…" />;
  if (error) return <ErrorNote error={error} />;
  const { chainId, epoch, totalTx, refGas, supply, cps, hotFns, sysParams } = data!;

  const newest: CheckpointRow | undefined = cps[0];
  const series: number[] = [];
  for (let i = cps.length - 1; i > 0; i--) {
    const a = cps[i - 1].networkTotalTransactions;
    const b = cps[i].networkTotalTransactions;
    if (a != null && b != null) series.push(Math.max(0, Number(a - b)));
  }
  let tps: string | null = null;
  const first = cps[0];
  const last = cps[cps.length - 1];
  if (cps.length > 2 && first?.timestampMs != null && last?.timestampMs != null && first.networkTotalTransactions != null && last.networkTotalTransactions != null) {
    const spanMs = first.timestampMs - last.timestampMs;
    const txSpan = Number(first.networkTotalTransactions - last.networkTotalTransactions);
    if (spanMs > 0) tps = (txSpan / (spanMs / 1000)).toFixed(1);
  }

  // epoch progress against the real epoch duration from system parameters
  const startMs = rfc3339Ms(epoch?.startTimestamp ?? null);
  const epochElapsed = startMs ? Date.now() - startMs : null;
  const durationMs = sysParams?.durationMs ?? 86_400_000;
  const progress = epochElapsed != null ? Math.min(100, (epochElapsed / durationMs) * 100) : 0;
  const remainingMs = epochElapsed != null ? Math.max(0, durationMs - epochElapsed) : null;

  return (
    <>
      <div className="page-head">
        <h1>
          NETWORK PULSE
          <Pill color="teal" title="chain identifier (first 4 bytes of the genesis checkpoint digest)">
            CHAIN {chainId}
          </Pill>
        </h1>
      </div>

      <div className="stat-grid">
        <Stat
          size="lead"
          label={<Info tip={TERMS.epochProgress}>Epoch progress</Info>}
          value={
            <Link to={`/epoch/${epoch?.epochId ?? ""}`} className="mono">
              {epoch ? fmtInt(epoch.epochId) : "—"}
            </Link>
          }
          hint={
            <>
              <div className="progress-track" style={{ margin: "2px 0 5px" }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {epochElapsed != null
                ? `${progress.toFixed(0)}% · ${durationBetween(0, epochElapsed)} of ${durationBetween(0, durationMs)}`
                : startMs
                  ? `started ${timeAgo(startMs)}`
                  : "—"}
              {remainingMs != null && <> · ~{durationBetween(0, remainingMs)} left</>}
              <div style={{ marginTop: 3 }} title={epoch?.startTimestamp ?? undefined}>
                <Link to="/epochs">all epochs →</Link>
              </div>
            </>
          }
        />
        <Stat
          label={<Info tip={TERMS.checkpoint}>Latest checkpoint</Info>}
          value={newest ? <Link to={`/checkpoint/${newest.sequenceNumber}`}>{fmtInt(newest.sequenceNumber)}</Link> : "—"}
          hint={
            <>
              {newest?.timestampMs != null && (
                <div>
                  <Age ms={newest.timestampMs} />
                </div>
              )}
              {epoch?.totalCheckpoints != null && <div>{fmtInt(epoch.totalCheckpoints)} this epoch</div>}
            </>
          }
        />
        <Stat
          label={<Info tip={TERMS.tps}>Throughput</Info>}
          value={tps ? <>{tps}<small>tx/s</small></> : "—"}
          hint={
            <>
              <Sparkline values={series.slice(-30)} width={150} height={18} /> tx per checkpoint, last {cps.length}
            </>
          }
          color="blue"
        />
        <Stat
          label={<Info tip={TERMS.checkpointTotalTx}>Total transactions</Info>}
          value={totalTx != null ? <ToggleNum compact={fmtCompact(totalTx)} full={fmtInt(totalTx)} /> : "—"}
          hint="since genesis"
        />
        <Stat
          label={<Info tip={TERMS.refGasPrice}>Reference gas price</Info>}
          value={refGas != null ? <>{fmtInt(refGas)}<small>nanos</small></> : "—"}
          color="amber"
        />
        <Stat
          label={<Info tip={TERMS.totalSupply}>Total supply</Info>}
          value={
            supply != null ? (
              <ToggleNum compact={compactIota(supply)} full={fmtIota(supply, { maxFrac: 0, unit: false })} />
            ) : (
              "—"
            )
          }
          hint={<Link to={`/coin/${encodeURIComponent(IOTA_TYPE)}`}>0x2::iota::IOTA →</Link>}
        />
        <Stat
          label={<Info tip={TERMS.stake}>Total stake</Info>}
          value={
            epoch?.validatorSet?.totalStake ? (
              <ToggleNum
                compact={compactIota(epoch.validatorSet.totalStake)}
                full={fmtIota(epoch.validatorSet.totalStake, { maxFrac: 0, unit: false })}
              />
            ) : (
              "—"
            )
          }
          hint={
            <>
              <div>{shareOfSupply(epoch?.validatorSet?.totalStake, supply)} of supply</div>
              <Link to="/staking">staking →</Link>
            </>
          }
          color="violet"
        />
        <Stat
          label={<Info tip={TERMS.committee}>Committee</Info>}
          value={committee.data != null ? fmtInt(committee.data.committee) : "—"}
          hint={
            <>
              {committee.data != null && <div>of {fmtInt(committee.data.active)} active</div>}
              <Link to="/validators">validators →</Link>
            </>
          }
          color="violet"
        />
        <Stat
          label={<Info tip={TERMS.storageFund}>Storage fund</Info>}
          value={epoch?.fundSize ? fmtIota(epoch.fundSize, { maxFrac: 0, unit: false }) : "—"}
          hint={<>{shareOfSupply(epoch?.fundSize, supply)} of supply</>}
        />
        <Stat
          label={<Info tip={TERMS.protocolVersion}>Protocol version</Info>}
          value={epoch?.protocolConfigs?.protocolVersion != null ? fmtInt(epoch.protocolConfigs.protocolVersion) : "—"}
          hint={<Link to="/protocol">protocol config →</Link>}
          color="blue"
        />
      </div>

      <Section
        index="01"
        title="Latest transactions"
        aux={
          <span className="row" style={{ gap: 8 }}>
            <span className="faint small">{allKinds ? "all kinds" : "programmable only"}</span>
            <button className="btn ghost" style={{ padding: "3px 9px" }} onClick={() => setAllKinds((v) => !v)}>
              {allKinds ? "PTBs only" : "show all kinds"}
            </button>
            <button className="btn ghost" style={{ padding: "3px 9px" }} onClick={() => setPaused((v) => !v)}>
              {paused ? "▶ resume" : "⏸ pause"}
            </button>
            <Link to="/transactions">all →</Link>
          </span>
        }
      >
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th><Info tip={TERMS.digest}>DIGEST</Info></th>
                <th><Info tip={TERMS.txKind}>KIND</Info></th>
                <th>SUMMARY</th>
                <th>SENDER</th>
              </tr>
            </thead>
            <tbody>
              {visibleTxs.map((t) => (
                <tr key={t.digest}>
                  <td>
                    <TxLink digest={t.digest} />
                  </td>
                  <td>
                    <Pill color={isSystemKind(t.kindT) ? "violet" : "teal"}>{kindLabel(t.kindT)}</Pill>
                  </td>
                  <td className="dim" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.summary}
                  </td>
                  <td>
                    {t.sender && t.sender !== "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
                      <Hash value={t.sender} to={`/address/${t.sender}`} head={6} tail={6} copy={false} />
                    ) : (
                      <span className="faint">system</span>
                    )}
                  </td>
                </tr>
              ))}
              {visibleTxs.length === 0 && (
                <tr>
                  <td colSpan={4} className="dim">no programmable transactions in the last batch — try "show all kinds"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section index="02" title="Hot functions" aux="from the last 50 PTBs">
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>FUNCTION</th>
                <th className="num">CALLS</th>
              </tr>
            </thead>
            <tbody>
              {hotFns.length === 0 && (
                <tr><td colSpan={2} className="dim">no Move calls in the recent batch</td></tr>
              )}
              {hotFns.map(([fn, count]) => {
                const [pkg, mod, name] = fn.split("::");
                return (
                  <tr key={fn}>
                    <td style={{ maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <Link to={`/transactions?fn=${encodeURIComponent(fn)}`} title={fn}>
                        {pkg.slice(0, 8)}…::{mod}::<b>{name}</b>
                      </Link>
                    </td>
                    <td className="num">{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

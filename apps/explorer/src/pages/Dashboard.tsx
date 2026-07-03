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
} from "../lib/format";
import { epochSystemParameters } from "../lib/gql";
import { pageBack, useClient, useNetwork } from "../lib/sdk";
import { commandViews, isSystemKind, kindLabel, kindTag, ptbBody, summarizeKind, unwrapV1 } from "../lib/tx";

const IOTA_TYPE = "0x2::iota::IOTA";

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

      return { chainId, epoch, totalTx, refGas, supply, cps: cpList.rows, txRows, hotFns, sysParams };
    },
  });
}

export default function Dashboard() {
  const [paused, setPaused] = useState(false);
  const [hideSystem, setHideSystem] = useState(false);
  const { data, error, isPending } = useDashboard(paused);

  const visibleTxs = useMemo(() => {
    if (!data) return [];
    return hideSystem ? data.txRows.filter((t) => !isSystemKind(t.kindT)) : data.txRows;
  }, [data, hideSystem]);

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
        <div className="sub">
          Live view through <span className="mono">iota-sdk-ffi → wasm32</span> · GraphQL transport
        </div>
      </div>

      <div className="stat-grid">
        <Stat
          label={<Info tip={TERMS.epoch}>Epoch</Info>}
          value={
            <Link to={`/epoch/${epoch?.epochId ?? ""}`} className="mono">
              {epoch ? fmtInt(epoch.epochId) : "—"}
            </Link>
          }
          hint={
            remainingMs != null
              ? `${progress.toFixed(0)}% · ends in ~${durationBetween(0, remainingMs)}`
              : startMs
                ? `started ${timeAgo(startMs)}`
                : undefined
          }
        />
        <Stat
          label={<Info tip={TERMS.checkpoint}>Latest checkpoint</Info>}
          value={newest ? <Link to={`/checkpoint/${newest.sequenceNumber}`}>{fmtInt(newest.sequenceNumber)}</Link> : "—"}
          hint={newest?.timestampMs != null ? <Age ms={newest.timestampMs} /> : undefined}
        />
        <Stat
          label={<Info tip={TERMS.checkpointTotalTx}>Total transactions</Info>}
          value={fmtCompact(totalTx)}
          hint={totalTx != null ? fmtInt(totalTx) : undefined}
        />
        <Stat
          label={<Info tip={TERMS.tps}>Throughput</Info>}
          value={tps ? <>{tps}<small>tx/s</small></> : "—"}
          hint={`over last ${cps.length} checkpoints`}
          color="blue"
        />
        <Stat
          label={<Info tip={TERMS.refGasPrice}>Reference gas price</Info>}
          value={refGas != null ? <>{fmtInt(refGas)}<small>nanos</small></> : "—"}
          color="amber"
        />
        <Stat
          label={<Info tip={TERMS.totalSupply}>Total supply</Info>}
          value={supply != null ? fmtIota(supply, { maxFrac: 0, unit: false }) : "—"}
          hint={<Link to={`/coin/${encodeURIComponent(IOTA_TYPE)}`}>0x2::iota::IOTA →</Link>}
        />
        <Stat
          label={<Info tip={TERMS.stake}>Total stake</Info>}
          value={epoch?.validatorSet?.totalStake ? fmtIota(epoch.validatorSet.totalStake, { maxFrac: 0, unit: false }) : "—"}
          hint={<Link to="/validators">validators →</Link>}
          color="violet"
        />
      </div>

      <Section
        index="01"
        title="Checkpoint stream"
        aux={
          <>
            tx per checkpoint <Sparkline values={series.slice(-30)} width={150} height={20} />
          </>
        }
      >
        <div className="panel ticks tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th><Info tip={TERMS.checkpointSeq}>SEQ</Info></th>
                <th><Info tip={TERMS.checkpointDigest}>DIGEST</Info></th>
                <th className="num">TXS</th>
                <th className="num"><Info tip={TERMS.checkpointTotalTx}>NETWORK TOTAL</Info></th>
                <th>AGE</th>
              </tr>
            </thead>
            <tbody>
              {cps.slice(0, 10).map((cp, i) => {
                const next = cps[i + 1];
                const delta =
                  next?.networkTotalTransactions != null && cp.networkTotalTransactions != null
                    ? cp.networkTotalTransactions - next.networkTotalTransactions
                    : null;
                return (
                  <tr key={cp.sequenceNumber.toString()}>
                    <td>
                      <Link to={`/checkpoint/${cp.sequenceNumber}`}>{fmtInt(cp.sequenceNumber)}</Link>
                    </td>
                    <td>
                      <Hash value={cp.digest} to={`/checkpoint/${cp.sequenceNumber}`} copy={false} />
                    </td>
                    <td className="num">{delta != null ? fmtInt(delta) : "—"}</td>
                    <td className="num dim">{fmtInt(cp.networkTotalTransactions)}</td>
                    <td className="dim">
                      <Age ms={cp.timestampMs} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        index="02"
        title="Latest transactions"
        aux={
          <span className="row" style={{ gap: 8 }}>
            <button className="btn ghost" style={{ padding: "3px 9px" }} onClick={() => setHideSystem((v) => !v)}>
              {hideSystem ? "show system" : "hide system"}
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
                  <td colSpan={4} className="dim">only system transactions in the last batch — toggle "show system"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="grid-2">
        <Section index="03" title="Hot functions" aux="from the last 50 PTBs">
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

        <Section index="04" title="Epoch detail" aux={<Link to="/epochs">all epochs →</Link>}>
          <div className="panel pad">
            <div className="row spread">
              <span className="muted small">
                <Info tip={TERMS.epochProgress}>EPOCH {epoch ? fmtInt(epoch.epochId) : "—"} PROGRESS</Info>
              </span>
              <span className="mono small">
                {epochElapsed != null ? durationBetween(0, epochElapsed) : "—"} / {durationBetween(0, durationMs)}
              </span>
            </div>
            <div className="progress-track" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="row spread" style={{ marginTop: 8 }}>
              <span className="faint small mono">{epoch?.startTimestamp ?? ""}</span>
              <span className="faint small mono">{remainingMs != null ? `~${durationBetween(0, remainingMs)} left` : ""}</span>
            </div>
            <div className="row" style={{ gap: 26, marginTop: 16 }}>
              <div>
                <div className="faint small"><Info tip={TERMS.systemState}>SYSTEM STATE VERSION</Info></div>
                <div className="mono" style={{ fontSize: 18, marginTop: 4 }}>
                  {epoch?.systemStateVersion != null ? fmtInt(epoch.systemStateVersion) : "—"}
                </div>
              </div>
              <div>
                <div className="faint small">CHECKPOINTS THIS EPOCH</div>
                <div className="mono" style={{ fontSize: 18, marginTop: 4 }}>
                  {epoch?.totalCheckpoints != null ? fmtInt(epoch.totalCheckpoints) : "—"}
                </div>
              </div>
              <div>
                <div className="faint small"><Info tip={TERMS.storageFund}>STORAGE FUND</Info></div>
                <div className="mono" style={{ fontSize: 18, marginTop: 4 }}>
                  {epoch?.fundSize ? fmtIota(epoch.fundSize, { maxFrac: 0 }) : "—"}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

// Analytics — network history charted client-side. No indexer backend: the
// page fans out client.epoch(id) over the trailing window through the wasm
// SDK and derives live throughput from the most recent checkpoints.

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Epoch } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Info, TERMS } from "../components/Info";
import { ErrorNote, LoadingBlock, Section, Sparkline, Stat } from "../components/ui";
import { listCheckpoints, type CheckpointRow } from "../lib/checkpoints";
import { fmtCompact, fmtInt } from "../lib/format";
import { epochSupplies } from "../lib/gql";
import { useClient, useNetwork } from "../lib/sdk";

const WINDOWS = [14, 30, 60] as const;

const NANOS = 1e9;

/** bigint | decimal-string | undefined → number (plotting only) or null. */
function toNum(v: bigint | string | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Axis/stat formatter that survives fractional values (fmtCompact is int-only). */
function fmtNum(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 100) return fmtCompact(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(Math.abs(v) < 1 ? 3 : 1);
}

// ── data ────────────────────────────────────────────────────────────────────

function useAnalytics(windowSize: number) {
  const client = useClient();
  const { network } = useNetwork();
  return useQuery({
    queryKey: [network, "analytics", windowSize],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const [current, cpList] = await Promise.all([
        client.epoch(),
        listCheckpoints(client, { limit: 50 }),
      ]);
      if (!current) throw new Error("could not resolve the current epoch");
      const head = current.epochId;
      const ids: bigint[] = [];
      for (let i = BigInt(windowSize) - 1n; i >= 0n; i--) {
        const id = head - i;
        if (id >= 0n) ids.push(id);
      }
      // one extra epoch of supply before the window so the first delta exists
      const supplyIds = ids[0] > 0n ? [ids[0] - 1n, ...ids] : [...ids];
      // fan out one epoch query per id; individual failures become gaps
      const fetched = await Promise.all(
        ids.map((id) =>
          id === head ? Promise.resolve(current) : client.epoch(id).catch(() => undefined),
        ),
      );
      const epochs = fetched.filter((e): e is Epoch => e != null);
      // supplies come as ONE aliased query — run it after the fan-out (the
      // public endpoint rate-limits bursts) and retry once on failure
      let supplies = new Map<string, bigint>();
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          supplies = await epochSupplies(client, supplyIds);
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 1200));
        }
      }
      return { epochs, headId: head, cps: cpList.rows, supplies };
    },
  });
}

// ── chart ───────────────────────────────────────────────────────────────────

interface ChartPoint {
  x: string; // epoch id label
  v: number | null; // primary series; null → gap, not zero. May be negative.
  v2?: number | null; // optional second series, drawn mirrored below zero
  note?: string; // extra tooltip line
}

/**
 * Dependency-free bar / step chart with an interactive hover crosshair:
 * moving over the plot highlights the epoch slot and shows a value readout.
 * Supports negative values (zero baseline) and a mirrored second series
 * (v up in teal, v2 down in coral — used for minted vs burned).
 */
function BarChart({
  points,
  unit,
  step = false,
  posLabel,
  negLabel,
}: {
  points: ChartPoint[];
  unit?: string;
  step?: boolean;
  posLabel?: string; // series names for the tooltip when v2 is present
  negLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 760;
  const H = 190;
  const padL = 50;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const hasV2 = points.some((p) => p.v2 != null);
  const vals = points.map((p) => p.v).filter((v): v is number => v != null);
  const vals2 = points.map((p) => p.v2).filter((v): v is number => v != null);
  if (points.length === 0 || (vals.length === 0 && vals2.length === 0)) {
    return <div className="empty">no data points in this window</div>;
  }
  // signed range: positives up, negatives (and the mirrored series) down
  const hi = Math.max(0, ...vals);
  const lo = Math.min(0, ...vals, ...(hasV2 ? vals2.map((v) => -v) : [0]));
  const span = hi - lo || 1;
  const yMax = hi + span * 0.06;
  const yMin = lo < 0 ? lo - span * 0.06 : 0;
  const y = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const y0 = y(0);

  const n = points.length;
  const slot = plotW / n;
  const bw = Math.max(1.5, slot * 0.62);
  let lastIdx = -1;
  for (let i = n - 1; i >= 0; i--) if (points[i].v != null || points[i].v2 != null) { lastIdx = i; break; }
  const labelEvery = Math.max(1, Math.ceil(n / 7));

  let stepPath = "";
  if (step) {
    let pen = false;
    points.forEach((p, i) => {
      if (p.v == null) {
        pen = false;
        return;
      }
      const x0 = padL + i * slot;
      const yy = y(p.v);
      stepPath += `${pen ? "L" : "M"}${x0.toFixed(1)},${yy.toFixed(1)} L${(x0 + slot).toFixed(1)},${yy.toFixed(1)} `;
      pen = true;
    });
  }

  const grid = yMin < 0 ? [hi, 0, lo] : [hi, hi / 2, 0];

  // hover tooltip content
  const hp = hover != null ? points[hover] : null;
  const tipLines: string[] = [];
  if (hp) {
    tipLines.push(`epoch ${hp.x}${hp.note ? ` ${hp.note}` : ""}`);
    if (hasV2) {
      if (hp.v != null) tipLines.push(`${posLabel ?? "value"}: ${fmtNum(hp.v)}${unit ? ` ${unit}` : ""}`);
      if (hp.v2 != null) tipLines.push(`${negLabel ?? "second"}: ${fmtNum(hp.v2)}${unit ? ` ${unit}` : ""}`);
      if (hp.v != null && hp.v2 != null) tipLines.push(`net: ${hp.v - hp.v2 >= 0 ? "+" : ""}${fmtNum(hp.v - hp.v2)}${unit ? ` ${unit}` : ""}`);
    } else if (hp.v != null) {
      tipLines.push(`${hp.v > 0 && yMin < 0 ? "+" : ""}${fmtNum(hp.v)}${unit ? ` ${unit}` : ""}`);
    } else {
      tipLines.push("no data");
    }
  }
  const tipW = Math.max(90, 8 + 6.2 * Math.max(...tipLines.map((l) => l.length), 0));
  const tipH = 13 * tipLines.length + 8;
  const tipX = hover != null ? Math.min(Math.max(padL, padL + hover * slot + slot / 2 - tipW / 2), W - padR - tipW) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "auto" }}
      role="img"
      onMouseLeave={() => setHover(null)}
    >
      {/* gridlines + y labels */}
      {grid.map((gv, gi) => (
        <g key={gi}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(gv)}
            y2={y(gv)}
            stroke="var(--hairline)"
            strokeWidth={1}
            strokeDasharray={gv === 0 ? undefined : "3 4"}
          />
          <text x={padL - 7} y={y(gv) + 3} textAnchor="end" fill="var(--ink-faint)" fontFamily="var(--font-mono)" fontSize={9}>
            {yMin < 0 && gv > 0 ? "+" : ""}
            {fmtNum(gv)}
          </text>
        </g>
      ))}

      {unit && (
        <text x={W - padR} y={padT - 3} textAnchor="end" fill="var(--ink-faint)" fontFamily="var(--font-mono)" fontSize={8.5}>
          {unit}
        </text>
      )}

      {/* hover slot highlight */}
      {hover != null && (
        <rect x={padL + hover * slot} y={padT} width={slot} height={plotH} fill="var(--teal)" fillOpacity={0.07} />
      )}

      {/* bars */}
      {points.map((p, i) => {
        const cx = padL + i * slot + slot / 2;
        const isLast = i === lastIdx;
        const isHover = i === hover;
        const alpha = isHover ? 1 : isLast ? 0.95 : 0.42;
        return (
          <g key={i}>
            {!step && p.v != null && (
              <rect
                x={cx - bw / 2}
                y={Math.min(y(p.v), y0 - (p.v >= 0 ? 1 : 0))}
                width={bw}
                height={Math.max(1, Math.abs(y0 - y(p.v)))}
                fill={p.v >= 0 ? "var(--teal)" : "var(--coral)"}
                fillOpacity={alpha}
              />
            )}
            {p.v2 != null && (
              <rect
                x={cx - bw / 2}
                y={y0}
                width={bw}
                height={Math.max(1, y(-p.v2) - y0)}
                fill="var(--coral)"
                fillOpacity={alpha}
              />
            )}
          </g>
        );
      })}

      {step && (
        <>
          <path d={stepPath} fill="none" stroke="var(--teal)" strokeWidth={1.6} strokeLinejoin="round" />
          {lastIdx >= 0 && points[lastIdx].v != null && (
            <circle cx={padL + lastIdx * slot + slot / 2} cy={y(points[lastIdx].v!)} r={2.6} fill="var(--teal)" />
          )}
        </>
      )}

      {/* x labels */}
      {points.map((p, i) => {
        const show = i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= labelEvery / 2);
        if (!show && i !== hover) return null;
        return (
          <text
            key={`x${i}`}
            x={padL + i * slot + slot / 2}
            y={H - 7}
            textAnchor="middle"
            fill={i === hover ? "var(--teal)" : i === lastIdx ? "var(--teal)" : "var(--ink-faint)"}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fontWeight={i === hover ? 700 : 400}
          >
            {p.x}
          </text>
        );
      })}

      {/* zero baseline */}
      <line x1={padL} x2={W - padR} y1={y0} y2={y0} stroke="var(--hairline-strong)" strokeWidth={1} />

      {/* hover capture layer (above bars, below tooltip) */}
      {points.map((_, i) => (
        <rect
          key={`h${i}`}
          x={padL + i * slot}
          y={padT}
          width={slot}
          height={plotH}
          fill="transparent"
          onMouseEnter={() => setHover(i)}
        />
      ))}

      {/* tooltip readout */}
      {hp && (
        <g pointerEvents="none">
          <rect x={tipX} y={padT + 2} width={tipW} height={tipH} rx={3} fill="#0a1216" stroke="var(--hairline-strong)" />
          {tipLines.map((l, li) => (
            <text
              key={li}
              x={tipX + 7}
              y={padT + 15 + li * 13}
              fill={li === 0 ? "var(--teal)" : "var(--ink)"}
              fontFamily="var(--font-mono)"
              fontSize={9.5}
            >
              {l}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}

function ChartSection({
  index,
  title,
  tip,
  aux,
  children,
}: {
  index: string;
  title: string;
  tip: string;
  aux?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Section index={index} title={<Info tip={tip}>{title}</Info>} aux={aux}>
      <div className="panel pad ticks">{children}</div>
    </Section>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

export default function Analytics() {
  const [win, setWin] = useState<number>(30);
  const { data, error, isPending, isFetching } = useAnalytics(win);

  const winPills = (
    <div className="row" style={{ gap: 6 }}>
      <span className="faint small" style={{ letterSpacing: "0.18em" }}>WINDOW</span>
      {WINDOWS.map((w) => (
        <button
          key={w}
          className={`pill${w === win ? " teal" : ""}`}
          style={{ cursor: "pointer", background: w === win ? undefined : "transparent" }}
          onClick={() => setWin(w)}
        >
          {w} EPOCHS
        </button>
      ))}
      {isFetching && !isPending && <span className="spinner" />}
    </div>
  );

  if (isPending) {
    return (
      <>
        <PageHead winPills={winPills} />
        <LoadingBlock label={`reading ${win} epochs through the wasm SDK…`} />
      </>
    );
  }
  if (error) {
    return (
      <>
        <PageHead winPills={winPills} />
        <ErrorNote error={error} />
      </>
    );
  }

  const { epochs, headId, cps, supplies } = data!;

  // ── live throughput over the last 50 checkpoints ──────────────────────────
  const txSeries: number[] = [];
  for (let i = cps.length - 1; i > 0; i--) {
    const older: CheckpointRow = cps[i];
    const newer: CheckpointRow = cps[i - 1];
    if (older.networkTotalTransactions != null && newer.networkTotalTransactions != null) {
      txSeries.push(Math.max(0, Number(newer.networkTotalTransactions - older.networkTotalTransactions)));
    }
  }
  let tps: string | null = null;
  let cadenceMs: number | null = null;
  const newest = cps[0];
  const oldest = cps[cps.length - 1];
  if (cps.length > 2 && newest?.timestampMs != null && oldest?.timestampMs != null) {
    const spanMs = newest.timestampMs - oldest.timestampMs;
    if (spanMs > 0) {
      cadenceMs = spanMs / (cps.length - 1);
      if (newest.networkTotalTransactions != null && oldest.networkTotalTransactions != null) {
        const txSpan = Number(newest.networkTotalTransactions - oldest.networkTotalTransactions);
        tps = (txSpan / (spanMs / 1000)).toFixed(2);
      }
    }
  }

  // ── per-epoch series (Number() for plotting only) ─────────────────────────
  const inProgress = "(epoch in progress)";
  const pt = (e: Epoch, v: number | null, note?: string): ChartPoint => ({
    x: e.epochId.toString(),
    v,
    note: e.epochId === headId ? inProgress : note,
  });
  const txPts = epochs.map((e) => pt(e, toNum(e.totalTransactions)));
  const feePts = epochs.map((e) => {
    const n = toNum(e.totalGasFees);
    return pt(e, n != null ? n / NANOS : null);
  });
  const rewardPts = epochs.map((e) => {
    const n = toNum(e.totalStakeRewards);
    return pt(e, n != null ? n / NANOS : null);
  });
  const cpPts = epochs.map((e) => pt(e, toNum(e.totalCheckpoints)));
  const rgpPts = epochs.map((e) => pt(e, toNum(e.referenceGasPrice)));
  const stakePts = epochs.map((e) => {
    const n = toNum(e.validatorSet?.totalStake); // null for old epochs → gap
    return pt(e, n != null ? n / NANOS : null);
  });

  // ── supply / inflation series ─────────────────────────────────────────────
  // ΔS(e) = supply(e) − supply(e−1): the *net* change (mint − burn) at the
  // epoch boundary. Minted ≈ stake rewards; burned is derived as mint − ΔS.
  const supplyOf = (id: bigint): number | null => {
    const s = supplies.get(id.toString());
    return s != null ? Number(s) / NANOS : null;
  };
  const supplyPts = epochs.map((e) => pt(e, supplyOf(e.epochId)));
  const deltaPts: ChartPoint[] = epochs.map((e) => {
    const cur = supplyOf(e.epochId);
    const prev = e.epochId > 0n ? supplyOf(e.epochId - 1n) : null;
    return pt(e, cur != null && prev != null ? cur - prev : null);
  });
  const mintBurnPts: ChartPoint[] = epochs.map((e, i) => {
    const minted = toNum(e.totalStakeRewards);
    const delta = deltaPts[i].v;
    const mintedIota = minted != null ? minted / NANOS : null;
    // burn = mint − ΔS; only meaningful when both sides are known
    const burned = mintedIota != null && delta != null ? Math.max(0, mintedIota - delta) : null;
    return { ...pt(e, mintedIota), v2: burned };
  });
  const lastDelta = [...deltaPts].reverse().find((p) => p.v != null)?.v ?? null;

  const avg = (pts: ChartPoint[]): number | null => {
    const vs = pts.map((p) => p.v).filter((v): v is number => v != null);
    return vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
  };
  const avgTx = avg(txPts);
  const avgFees = avg(feePts);
  const avgRewards = avg(rewardPts);

  const epochAux = `${epochs.length} of ${win} epochs · ending at ${fmtInt(headId)}`;

  return (
    <>
      <PageHead winPills={winPills} />

      <Section
        index="01"
        title={<Info tip="Computed live from the most recent 50 checkpoints fetched through the wasm SDK — no indexer involved.">Live throughput</Info>}
        aux={`last ${cps.length} checkpoints`}
      >
        <div className="stat-grid">
          <Stat
            label={<Info tip={TERMS.tps}>Throughput</Info>}
            value={tps != null ? <>{tps}<small>tx/s</small></> : "—"}
            hint={`measured over ${cps.length} checkpoints`}
            color="blue"
          />
          <Stat
            label={<Info tip="Average time between two consecutive checkpoints — the network's heartbeat interval. Lower is snappier finality.">Checkpoint cadence</Info>}
            value={cadenceMs != null ? <>{fmtInt(Math.round(cadenceMs))}<small>ms</small></> : "—"}
            hint="avg gap between checkpoints"
          />
          <div className="stat violet">
            <div className="k">
              <Info tip="Transactions bundled into each of the recent checkpoints, oldest to newest — a quick visual of how bursty traffic is right now.">TX PER CHECKPOINT</Info>
            </div>
            <div style={{ marginTop: 8 }}>
              <Sparkline values={txSeries} width={260} height={40} color="var(--violet)" />
            </div>
            <div className="hint">{txSeries.length ? `latest: ${fmtInt(txSeries[txSeries.length - 1])} tx` : "no data"}</div>
          </div>
        </div>
      </Section>

      <Section index="02" title="Window averages" aux={epochAux}>
        <div className="stat-grid">
          <Stat
            label={<Info tip={`Mean number of transactions per epoch over the selected ${win}-epoch window. The in-progress epoch reports no totals yet and is excluded.`}>Avg tx / epoch</Info>}
            value={avgTx != null ? fmtNum(avgTx) : "—"}
            hint={avgTx != null ? `${fmtInt(Math.round(avgTx))} exact` : undefined}
          />
          <Stat
            label={<Info tip="Mean total gas fees paid per epoch, converted from nanos to IOTA (1 IOTA = 10⁹ nanos).">Avg gas fees / epoch</Info>}
            value={avgFees != null ? <>{fmtNum(avgFees)}<small>IOTA</small></> : "—"}
            color="amber"
          />
          <Stat
            label={<Info tip="Mean IOTA distributed as staking rewards to validators and delegators per epoch, paid out at each epoch boundary.">Avg stake rewards / epoch</Info>}
            value={avgRewards != null ? <>{fmtNum(avgRewards)}<small>IOTA</small></> : "—"}
            color="violet"
          />
        </div>
      </Section>

      <ChartSection
        index="03"
        title="Transactions per epoch"
        tip="How many transactions (user-submitted and system) the network executed in each epoch. Totals are reported once an epoch ends, so the in-progress epoch shows as a gap and the newest finished epoch is highlighted."
        aux={epochAux}
      >
        <BarChart points={txPts} unit="tx" />
      </ChartSection>

      <ChartSection
        index="04"
        title="Gas fees per epoch"
        tip="All gas fees paid by transactions in each epoch, shown in IOTA (converted from nanos). Part of these fees is burned, part flows to validators via the storage fund."
        aux="nanos ÷ 10⁹"
      >
        <BarChart points={feePts} unit="IOTA" />
      </ChartSection>

      <ChartSection
        index="05"
        title="Stake rewards per epoch"
        tip="IOTA paid out as staking rewards at each epoch change, shared between validators (commission) and their delegators."
        aux="paid at epoch boundary"
      >
        <BarChart points={rewardPts} unit="IOTA" />
      </ChartSection>

      <ChartSection
        index="06"
        title="Checkpoints per epoch"
        tip={TERMS.checkpoint + " This chart counts how many checkpoints were certified in each epoch — steadier counts mean a steadier consensus rhythm."}
        aux={epochAux}
      >
        <BarChart points={cpPts} unit="cp" />
      </ChartSection>

      <ChartSection
        index="07"
        title="Reference gas price"
        tip={TERMS.refGasPrice + " It is fixed per epoch, so the line moves in steps at epoch boundaries."}
        aux="nanos / gas unit"
      >
        <BarChart points={rgpPts} unit="nanos" step />
      </ChartSection>

      <ChartSection
        index="08"
        title="Total stake per epoch"
        tip={TERMS.stake + " Snapshot at the start of each epoch. Older epochs may not report a validator set anymore — those show as gaps, not zeros."}
        aux="validatorSet.totalStake"
      >
        <BarChart points={stakePts} unit="IOTA" />
      </ChartSection>

      <ChartSection
        index="09"
        title="Net supply change (inflation)"
        tip="The real inflation signal: change in total IOTA supply at each epoch boundary — everything minted (stake rewards) minus everything burned (computation fees). Positive bars grow the supply, negative bars shrink it."
        aux={lastDelta != null ? `latest: ${lastDelta >= 0 ? "+" : ""}${fmtNum(lastDelta)} IOTA` : "ΔiotaTotalSupply"}
      >
        <BarChart points={deltaPts} unit="IOTA" />
      </ChartSection>

      <ChartSection
        index="10"
        title="Minted vs burned"
        tip="Minted (up, teal) is the IOTA created as stake rewards each epoch. Burned (down, coral) is derived as minted − net supply change — dominated by burned computation fees. Hover a bar for the exact split and the resulting net."
        aux="burned derived from ΔiotaTotalSupply"
      >
        <BarChart points={mintBurnPts} unit="IOTA" posLabel="minted" negLabel="burned" />
      </ChartSection>

      <ChartSection
        index="11"
        title="Total supply"
        tip="Total IOTA in existence at each epoch (iotaTotalSupply). The slope is the inflation rate — flat means mint and burn cancel out."
        aux="iotaTotalSupply · nanos ÷ 10⁹"
      >
        <BarChart points={supplyPts} unit="IOTA" step />
      </ChartSection>
    </>
  );
}

function PageHead({ winPills }: { winPills: React.ReactNode }) {
  return (
    <div className="page-head">
      <h1>ANALYTICS</h1>
      <div className="sub row spread" style={{ gap: 14 }}>
        <span>
          Network history computed client-side — epoch fan-out via <span className="mono">iota-sdk-ffi → wasm32</span>, no indexer
        </span>
        {winPills}
      </div>
    </div>
  );
}

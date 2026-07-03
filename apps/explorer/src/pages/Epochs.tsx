// Epoch list. There is no "epochs" connection in the client API, so we read
// the current epoch and fan out `client.epoch(id)` for the trailing window —
// the wasm client handles the parallelism happily.

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { Amount, ErrorNote, LoadingBlock, Pill, Section } from "../components/ui";
import { durationBetween, fmtInt, fmtRfc3339, rfc3339Ms } from "../lib/format";
import { useClient, useNetwork } from "../lib/sdk";

const WINDOW = 12;

export default function Epochs() {
  const client = useClient();
  const { network } = useNetwork();
  const [before, setBefore] = useState<bigint | null>(null); // exclusive upper bound

  const q = useQuery({
    queryKey: [network, "epochs", before?.toString() ?? "head"],
    queryFn: async () => {
      let high: bigint;
      if (before == null) {
        const current = await client.epoch();
        if (current == null) throw new Error("current epoch unavailable");
        high = current.epochId;
      } else {
        high = before - 1n;
      }
      const ids: bigint[] = [];
      for (let i = 0n; i < BigInt(WINDOW) && high - i >= 0n; i++) ids.push(high - i);
      const epochs = await Promise.all(ids.map((id) => client.epoch(id).catch(() => null)));
      return { epochs: epochs.filter((e) => e != null), high };
    },
  });

  if (q.isPending) return <LoadingBlock label={`fan-out: ${WINDOW} × client.epoch(id)…`} />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { epochs, high } = q.data!;
  const oldest = epochs[epochs.length - 1];

  return (
    <>
      <div className="page-head">
        <h1>EPOCHS</h1>
        <div className="sub">
          Validator committee periods. Fan-out reads through <span className="mono">client.epoch(id)</span>.
        </div>
      </div>
      <Section index="01" title="History" aux={`epochs ${fmtInt(oldest?.epochId ?? 0n)} – ${fmtInt(high)}`}>
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th><Info tip={TERMS.epoch}>EPOCH</Info></th>
                <th>START</th>
                <th>DURATION</th>
                <th className="num"><Info tip={TERMS.refGasPrice}>REF GAS</Info></th>
                <th className="num"><Info tip={TERMS.checkpoint}>CHECKPOINTS</Info></th>
                <th className="num">TRANSACTIONS</th>
                <th className="num"><Info tip={TERMS.computationCost}>GAS FEES</Info></th>
                <th className="num"><Info tip={TERMS.delegation}>STAKE REWARDS</Info></th>
              </tr>
            </thead>
            <tbody>
              {epochs.map((e) => {
                const start = rfc3339Ms(e.startTimestamp);
                const end = rfc3339Ms(e.endTimestamp ?? null);
                const live = e.endTimestamp == null;
                return (
                  <tr key={e.epochId.toString()}>
                    <td>
                      <Link to={`/epoch/${e.epochId}`}>{fmtInt(e.epochId)}</Link>{" "}
                      {live && <Pill color="teal">LIVE</Pill>}
                    </td>
                    <td className="dim">{fmtRfc3339(e.startTimestamp).slice(0, 16)}</td>
                    <td className="dim">{start ? durationBetween(start, end ?? Date.now()) : "—"}</td>
                    <td className="num">{e.referenceGasPrice ? fmtInt(e.referenceGasPrice) : "—"}</td>
                    <td className="num dim">{e.totalCheckpoints ? fmtInt(e.totalCheckpoints) : "—"}</td>
                    <td className="num dim">{e.totalTransactions ? fmtInt(e.totalTransactions) : "—"}</td>
                    <td className="num">
                      <Amount nanos={e.totalGasFees ?? null} maxFrac={1} />
                    </td>
                    <td className="num">
                      <Amount nanos={e.totalStakeRewards ?? null} maxFrac={1} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pager">
          {before != null && (
            <button
              className="btn ghost"
              onClick={() => setBefore(null)}
            >
              ⇤ latest
            </button>
          )}
          {oldest && oldest.epochId > 0n && (
            <button className="btn ghost" onClick={() => setBefore(oldest.epochId)}>
              older ⇥
            </button>
          )}
        </div>
      </Section>
    </>
  );
}

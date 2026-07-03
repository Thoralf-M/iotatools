// Checkpoint detail: summary (typed accessors), rolling gas, contained
// transactions, raw serde JSON and the exact BCS signing message.

import { useQuery } from "@tanstack/react-query";
import { checkpointSummaryToJson, transactionToJson, TransactionsFilter } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HexDump } from "../components/HexDump";
import { JsonString } from "../components/JsonTree";
import {
  Age,
  Amount,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  Pill,
  PrevNext,
  Section,
  Tabs,
  TxLink,
  useTabParam,
} from "../components/ui";
import { checkpointSeqByDigest } from "../lib/checkpoints";
import { fmtInt, fmtTimestamp } from "../lib/format";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";
import { isSystemKind, kindLabel, kindTag, summarizeKind, unwrapV1 } from "../lib/tx";

export default function CheckpointDetail() {
  const { id = "" } = useParams();
  const client = useClient();
  const { network } = useNetwork();
  const [tab, setTab] = useTabParam("overview");

  const q = useQuery({
    queryKey: [network, "checkpoint", id],
    queryFn: async () => {
      // digest URLs resolve to a sequence number first (the typed
      // checkpoint(digest) lookup still returns null — see lib/checkpoints)
      let seq: bigint;
      if (/^\d+$/.test(id)) {
        seq = BigInt(id);
      } else {
        const found = await checkpointSeqByDigest(client, id);
        if (found == null) throw new Error(`checkpoint ${id} not found on ${network}`);
        seq = found;
      }
      const cp = await client.checkpoint(undefined, seq);
      if (cp == null) throw new Error(`checkpoint ${id} not found on ${network}`);
      return {
        cp,
        json: checkpointSummaryToJson(cp),
        signing: new Uint8Array(cp.signingMessage()),
      };
    },
  });

  const seqForTxs = q.data?.cp.sequenceNumber();
  const txs = usePagedList({
    queryKey: [network, "checkpoint-txs", seqForTxs?.toString() ?? ""],
    limit: 25,
    enabled: seqForTxs != null,
    fetcher: (p) => client.transactions(TransactionsFilter.new({ atCheckpoint: seqForTxs! }), p),
  });

  const txRows = useMemo(
    () =>
      txs.rows.map((st) => {
        const digest = st.transaction.digest().toBase58();
        try {
          const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
          return { digest, tag: kindTag(j?.kind), summary: summarizeKind(j?.kind), sender: j?.sender as string };
        } catch {
          return { digest, tag: "Unknown", summary: "", sender: "" };
        }
      }),
    [txs.rows],
  );

  if (q.isPending) return <LoadingBlock />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { cp, json, signing } = q.data!;
  const gas = cp.epochRollingGasCostSummary();
  const eoe = cp.endOfEpochData();

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/checkpoints">CHECKPOINTS</Link> / {fmtInt(cp.sequenceNumber())}
        </div>
        <h1>
          CHECKPOINT {fmtInt(cp.sequenceNumber())}
          <PrevNext current={cp.sequenceNumber()} base="/checkpoint" label="checkpoint" />
          {eoe && <Pill color="amber">END OF EPOCH</Pill>}
        </h1>
        <div className="sub">
          <Age ms={cp.timestampMs()} /> · epoch <Link to={`/epoch/${cp.epoch()}`}>{fmtInt(cp.epoch())}</Link>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "transactions", label: "Transactions" },
          { id: "raw", label: "Raw JSON" },
          { id: "bcs", label: "Signing BCS", count: signing.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <>
          <Section index="01" title="Summary">
            <KV
              rows={[
                ["Digest", <Hash value={cp.digest().toBase58()} full />],
                ["Sequence number", fmtInt(cp.sequenceNumber())],
                ["Epoch", <Link to={`/epoch/${cp.epoch()}`}>{fmtInt(cp.epoch())}</Link>],
                ["Timestamp", `${fmtTimestamp(cp.timestampMs())} (${fmtInt(cp.timestampMs())} ms)`],
                ["Network total transactions", fmtInt(cp.networkTotalTransactions())],
                ["Content digest", <Hash value={cp.contentDigest().toBase58()} full />],
                [
                  "Previous digest",
                  cp.previousDigest() ? (
                    <Hash
                      value={cp.previousDigest()!.toBase58()}
                      to={`/checkpoint/${cp.previousDigest()!.toBase58()}`}
                      full
                    />
                  ) : (
                    <span className="faint">genesis</span>
                  ),
                ],
                ["Commitments", cp.checkpointCommitments().length === 0 ? <span className="faint">none</span> : `${cp.checkpointCommitments().length}`],
              ]}
            />
          </Section>

          <Section index="02" title="Epoch rolling gas summary" aux="cumulative across the epoch so far">
            <div className="stat-grid">
              <div className="stat amber">
                <div className="k">Computation</div>
                <div className="v"><Amount nanos={gas.computationCost} /></div>
                <div className="hint">burned: <Amount nanos={gas.computationCostBurned} /></div>
              </div>
              <div className="stat">
                <div className="k">Storage cost</div>
                <div className="v"><Amount nanos={gas.storageCost} /></div>
              </div>
              <div className="stat blue">
                <div className="k">Storage rebate</div>
                <div className="v"><Amount nanos={gas.storageRebate} /></div>
              </div>
              <div className="stat violet">
                <div className="k">Non-refundable fee</div>
                <div className="v"><Amount nanos={gas.nonRefundableStorageFee} /></div>
              </div>
            </div>
          </Section>

          {eoe && (
            <Section index="03" title="End of epoch data">
              <KV
                rows={[
                  ["Next epoch protocol version", fmtInt(eoe.nextEpochProtocolVersion)],
                  ["Next committee size", `${eoe.nextEpochCommittee.length} validators`],
                  [
                    "Epoch commitments",
                    eoe.epochCommitments.length === 0 ? <span className="faint">none</span> : `${eoe.epochCommitments.length}`,
                  ],
                  ["Epoch supply change", `${eoe.epochSupplyChange >= 0n ? "+" : ""}${fmtInt(eoe.epochSupplyChange)} nanos`],
                ]}
              />
            </Section>
          )}
        </>
      )}

      {tab === "transactions" &&
        (txs.isPending ? (
          <LoadingBlock />
        ) : txs.error ? (
          <ErrorNote error={txs.error} />
        ) : (
          <Section index="01" title="Transactions in this checkpoint" aux={`filter: atCheckpoint = ${cp.sequenceNumber()}`}>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>DIGEST</th>
                    <th>KIND</th>
                    <th>SUMMARY</th>
                    <th>SENDER</th>
                  </tr>
                </thead>
                <tbody>
                  {txRows.map((t) => (
                    <tr key={t.digest}>
                      <td><TxLink digest={t.digest} /></td>
                      <td><Pill color={isSystemKind(t.tag) ? "violet" : "teal"}>{kindLabel(t.tag)}</Pill></td>
                      <td className="dim">{t.summary}</td>
                      <td>{t.sender ? <Hash value={t.sender} to={`/address/${t.sender}`} head={6} tail={6} copy={false} /> : <span className="faint">system</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {txs.hasMore && (
              <div className="pager">
                <button className="btn ghost" onClick={txs.next}>more ⇥</button>
              </div>
            )}
          </Section>
        ))}

      {tab === "raw" && (
        <Section index="01" title="CheckpointSummary · serde JSON" aux="checkpointSummaryToJson(cp)">
          <JsonString json={json} />
        </Section>
      )}

      {tab === "bcs" && (
        <Section index="01" title="Signing message" aux="cp.signingMessage() — BCS the committee signs (intent ∥ summary)">
          <HexDump bytes={signing} />
        </Section>
      )}
    </>
  );
}

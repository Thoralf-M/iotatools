// Checkpoint list — live-following, newest first, cursor-paged.
// Listing goes through lib/checkpoints (runQuery workaround; see note there).

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { Age, ErrorNote, Hash, LoadingBlock, Section, Spinner } from "../components/ui";
import { listCheckpoints } from "../lib/checkpoints";
import { fmtInt } from "../lib/format";
import { useClient, useNetwork } from "../lib/sdk";

export default function Checkpoints() {
  const client = useClient();
  const { network } = useNetwork();
  const [before, setBefore] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);

  const q = useQuery({
    queryKey: [network, "checkpoints", before ?? "head"],
    refetchInterval: page === 0 ? 5000 : false,
    queryFn: () => listCheckpoints(client, { limit: 30, before }),
  });

  return (
    <>
      <div className="page-head">
        <h1>CHECKPOINTS</h1>
        <div className="sub">
          <Info tip={TERMS.checkpoint}>Certified bundles of transactions — the unit of finality on IOTA.</Info>
        </div>
      </div>
      <Section index="01" title="Stream" aux={page === 0 ? "live · refreshes every 5s" : `page ${page + 1}`}>
        {q.error ? (
          <ErrorNote error={q.error} />
        ) : q.isPending ? (
          <LoadingBlock />
        ) : (
          <>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th><Info tip={TERMS.checkpointSeq}>SEQUENCE</Info></th>
                    <th><Info tip={TERMS.checkpointDigest}>DIGEST</Info></th>
                    <th><Info tip={TERMS.epoch}>EPOCH</Info></th>
                    <th className="num"><Info tip={TERMS.checkpointTotalTx}>NETWORK TX TOTAL</Info></th>
                    <th>TIMESTAMP</th>
                    <th>AGE</th>
                  </tr>
                </thead>
                <tbody>
                  {q.data!.rows.map((cp) => (
                    <tr key={cp.sequenceNumber.toString()}>
                      <td>
                        <Link to={`/checkpoint/${cp.sequenceNumber}`}>{fmtInt(cp.sequenceNumber)}</Link>
                      </td>
                      <td>
                        <Hash value={cp.digest} to={`/checkpoint/${cp.sequenceNumber}`} />
                      </td>
                      <td>{cp.epoch != null ? <Link to={`/epoch/${cp.epoch}`}>{fmtInt(cp.epoch)}</Link> : "—"}</td>
                      <td className="num dim">{fmtInt(cp.networkTotalTransactions)}</td>
                      <td className="dim">
                        {cp.timestampMs != null ? new Date(cp.timestampMs).toISOString().slice(0, 19).replace("T", " ") : "—"}
                      </td>
                      <td className="dim">
                        <Age ms={cp.timestampMs} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <span>page {page + 1}</span>
              {page > 0 && (
                <button
                  className="btn ghost"
                  onClick={() => {
                    setBefore(undefined);
                    setPage(0);
                  }}
                >
                  ⇤ live head
                </button>
              )}
              <button
                className="btn ghost"
                disabled={!q.data!.hasMore || q.isFetching}
                onClick={() => {
                  if (q.data!.nextBefore) {
                    setBefore(q.data!.nextBefore);
                    setPage((p) => p + 1);
                  }
                }}
              >
                {q.isFetching ? <Spinner /> : "older ⇥"}
              </button>
            </div>
          </>
        )}
      </Section>
    </>
  );
}

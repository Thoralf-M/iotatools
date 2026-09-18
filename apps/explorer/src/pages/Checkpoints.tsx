// Checkpoint list — live-following, newest first, cursor-paged. Each
// checkpoint carries the transactions it committed: the first few inline, the
// rest behind an expander. All kinds are shown by default; the toggle narrows
// to programmable blocks (fetched as a separate connection, so a checkpoint
// full of consensus prologues can't crowd its PTBs out of the page).

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { Age, ErrorNote, Hash, LoadingBlock, Pill, Section, Spinner, TxLink } from "../components/ui";
import { fmtInt } from "../lib/format";
import { checkpointFeed, type FeedTxRow } from "../lib/gql";
import { useClient, useNetwork } from "../lib/sdk";
import { isSystemKind, kindLabel } from "../lib/tx";

// The server rejects the query outright past a complexity budget: 11 fetched
// checkpoints (10 shown + 1 for the count) times 12 transactions on two
// aliased connections is inside it, 21 is not.
const CHECKPOINTS_PER_PAGE = 10;
const TXS_PER_CHECKPOINT = 12;
/** transactions listed under a checkpoint before the "… more" expander */
const TXS_COLLAPSED = 3;

/** One transaction, indented under its checkpoint. */
function TxTr({ tx }: { tx: FeedTxRow }) {
  const call = tx.calls[0];
  return (
    <tr>
      <td></td>
      <td style={{ paddingLeft: 18 }}>
        <span className="faint">└ </span>
        <TxLink digest={tx.digest} />
      </td>
      <td>
        <Pill color={isSystemKind(tx.tag) ? "violet" : "teal"}>{kindLabel(tx.tag)}</Pill>
      </td>
      <td className="dim" style={{ maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis" }}>
        {call && (
          <span className="mono small" title={tx.calls.join(", ")}>
            {call.split("::").slice(1).join("::")}
            {tx.calls.length > 1 && ` +${tx.calls.length - 1}`}
          </span>
        )}
        {tx.sender ? (
          <>
            {call && " · "}
            <Hash value={tx.sender} to={`/address/${tx.sender}`} head={6} tail={6} copy={false} />
          </>
        ) : (
          !call && <span className="faint">system</span>
        )}
      </td>
      <td>{tx.success === false && <Pill color="coral">FAILED</Pill>}</td>
      <td></td>
    </tr>
  );
}

export default function Checkpoints() {
  const client = useClient();
  const { network } = useNetwork();
  const [before, setBefore] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [ptbOnly, setPtbOnly] = useState(false);
  const [openCps, setOpenCps] = useState<Set<string>>(new Set());

  const toggleCp = (key: string) =>
    setOpenCps((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const q = useQuery({
    queryKey: [network, "checkpoint-feed", before ?? "head"],
    refetchInterval: page === 0 ? 5000 : false,
    queryFn: () =>
      checkpointFeed(client, {
        checkpoints: CHECKPOINTS_PER_PAGE,
        txsPerCheckpoint: TXS_PER_CHECKPOINT,
        before,
      }),
  });

  return (
    <>
      <div className="page-head">
        <h1>CHECKPOINTS</h1>
        <div className="sub">
          <Info tip={TERMS.checkpoint}>Certified bundles of transactions — the unit of finality on IOTA.</Info>
        </div>
      </div>
      <Section
        index="01"
        title="Stream"
        aux={
          <span className="row" style={{ gap: 8 }}>
            {page === 0 ? "live · refreshes every 5s" : `page ${page + 1}`} · {ptbOnly ? "programmable only" : "all kinds"}
            <button className="btn ghost" style={{ padding: "3px 9px" }} onClick={() => setPtbOnly((v) => !v)}>
              {ptbOnly ? "show all kinds" : "PTBs only"}
            </button>
          </span>
        }
      >
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
                    <th><Info tip={TERMS.txKind}>TXS / KIND</Info></th>
                    <th>SUMMARY / SENDER</th>
                    <th className="num"><Info tip={TERMS.checkpointTotalTx}>NETWORK TX TOTAL</Info></th>
                    <th>AGE</th>
                  </tr>
                </thead>
                <tbody>
                  {q.data!.rows.map((cp) => {
                    const key = cp.sequenceNumber.toString();
                    const list = ptbOnly ? cp.ptbs : cp.txs;
                    const hasMore = ptbOnly ? cp.hasMorePtbs : cp.hasMoreTxs;
                    const expanded = openCps.has(key);
                    const visible = expanded ? list : list.slice(0, TXS_COLLAPSED);
                    const rest = list.length - visible.length;
                    return (
                      <React.Fragment key={key}>
                        <tr>
                          <td>
                            <Link to={`/checkpoint/${cp.sequenceNumber}`}>{fmtInt(cp.sequenceNumber)}</Link>
                            {cp.epoch != null && (
                              <span className="faint small">
                                {" · "}
                                <Link to={`/epoch/${cp.epoch}`}>epoch {fmtInt(cp.epoch)}</Link>
                              </span>
                            )}
                          </td>
                          <td>
                            <Hash value={cp.digest} to={`/checkpoint/${cp.sequenceNumber}`} />
                          </td>
                          <td className="dim">
                            {cp.txCount != null ? fmtInt(cp.txCount) : `${fmtInt(cp.txs.length)}${cp.hasMoreTxs ? "+" : ""}`} tx
                            {ptbOnly && (
                              <span className="faint">
                                {" · "}
                                {fmtInt(list.length)}
                                {hasMore && "+"} ptb
                              </span>
                            )}
                          </td>
                          <td></td>
                          <td className="num dim">{fmtInt(cp.networkTotalTransactions)}</td>
                          <td className="dim">
                            <Age ms={cp.timestampMs} />
                          </td>
                        </tr>
                        {visible.map((t) => (
                          <TxTr key={t.digest} tx={t} />
                        ))}
                        {list.length === 0 && (
                          <tr>
                            <td></td>
                            <td colSpan={5} className="faint small" style={{ paddingLeft: 18 }}>
                              {ptbOnly ? "no programmable transactions" : "no transactions"}
                            </td>
                          </tr>
                        )}
                        {(list.length > TXS_COLLAPSED || hasMore) && (
                          <tr>
                            <td></td>
                            <td colSpan={5} className="faint small" style={{ paddingLeft: 18 }}>
                              {list.length > TXS_COLLAPSED && (
                                <button
                                  className="btn ghost"
                                  style={{ padding: "0 8px" }}
                                  title={expanded ? "collapse" : `show all ${list.length}`}
                                  onClick={() => toggleCp(key)}
                                >
                                  {expanded ? "▴ less" : `… ${rest} more`}
                                </button>
                              )}
                              {hasMore && (
                                <>
                                  {list.length > TXS_COLLAPSED && " · "}
                                  <Link to={`/checkpoint/${cp.sequenceNumber}`}>all in this checkpoint →</Link>
                                </>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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

// Transaction list with the full TransactionsFilter surface exposed:
// kind, function target, sender/recipient, checkpoint bounds, object usage.

import { Address, ObjectId, TransactionBlockKindInput, TransactionsFilter, transactionToJson } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { ErrorNote, Hash, LoadingBlock, Pager, Pill, Section, TxLink } from "../components/ui";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";
import { isSystemKind, kindLabel, kindTag, ptbBody, summarizeKind, unwrapV1 } from "../lib/tx";

interface FilterState {
  kind: "" | "programmable" | "system";
  fn: string;
  sent: string;
  recv: string;
  atCheckpoint: string;
  inputObject: string;
  changedObject: string;
}

function buildFilter(f: FilterState) {
  const empty = !f.kind && !f.fn && !f.sent && !f.recv && !f.atCheckpoint && !f.inputObject && !f.changedObject;
  if (empty) return undefined;
  return TransactionsFilter.new({
    kind: f.kind === "programmable" ? TransactionBlockKindInput.ProgrammableTx : f.kind === "system" ? TransactionBlockKindInput.SystemTx : undefined,
    function: f.fn || undefined,
    sentAddress: f.sent ? Address.fromHex(f.sent) : undefined,
    recvAddress: f.recv ? Address.fromHex(f.recv) : undefined,
    atCheckpoint: f.atCheckpoint ? BigInt(f.atCheckpoint) : undefined,
    inputObject: f.inputObject ? ObjectId.fromHex(f.inputObject) : undefined,
    changedObject: f.changedObject ? ObjectId.fromHex(f.changedObject) : undefined,
  });
}

export default function Transactions() {
  const client = useClient();
  const { network } = useNetwork();
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<FilterState>({
    kind: "",
    fn: params.get("fn") ?? "",
    sent: params.get("sent") ?? "",
    recv: params.get("recv") ?? "",
    atCheckpoint: params.get("cp") ?? "",
    inputObject: "",
    changedObject: "",
  });
  const [applied, setApplied] = useState<FilterState>(draft);
  const [filterError, setFilterError] = useState<string | null>(null);

  const list = usePagedList({
    queryKey: [network, "transactions", applied],
    limit: 25,
    newestFirst: true,
    refetchInterval: 6000,
    fetcher: (p) => {
      const filter = buildFilter(applied);
      return client.transactions(filter, p);
    },
  });

  const rows = useMemo(
    () =>
      list.rows.map((st) => {
        const digest = st.transaction.digest().toBase58();
        try {
          const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
          const ptb = ptbBody(j?.kind);
          return {
            digest,
            tag: kindTag(j?.kind),
            summary: summarizeKind(j?.kind),
            sender: (j?.sender as string) ?? "",
            cmds: ptb?.commands.length ?? null,
            budget: j?.gas_payment?.budget as string | undefined,
            sigs: st.signatures.length,
          };
        } catch {
          return { digest, tag: "Unknown", summary: "", sender: "", cmds: null, budget: undefined, sigs: st.signatures.length };
        }
      }),
    [list.rows],
  );

  const set = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  // Auto-apply: filters take effect as you type (debounced), no button needed.
  const resetRef = React.useRef(list.reset);
  resetRef.current = list.reset;
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        buildFilter(draft); // validate addresses/ids via SDK parsers
        setFilterError(null);
        setApplied((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(draft)) {
            resetRef.current();
            return draft;
          }
          return prev;
        });
      } catch (e) {
        setFilterError(e instanceof Error ? e.message : String(e));
      }
    }, 400);
    return () => clearTimeout(t);
  }, [draft]);

  return (
    <>
      <div className="page-head">
        <h1>TRANSACTIONS</h1>
        <div className="sub">
          Newest first via <span className="mono">client.transactions(TransactionsFilter, PaginationFilter)</span>
        </div>
      </div>

      <Section index="00" title="Filter">
        <div className="panel pad">
          <div className="row" style={{ gap: 12, alignItems: "flex-end" }}>
            <div className="field">
              <label>kind</label>
              <select className="input" value={draft.kind} onChange={set("kind")}>
                <option value="">any</option>
                <option value="programmable">programmable</option>
                <option value="system">system</option>
              </select>
            </div>
            <div className="field" style={{ flex: 2, minWidth: 220 }}>
              <label>function (pkg::module::fn)</label>
              <input className="input" placeholder="0x…::pool::swap" value={draft.fn} onChange={set("fn")} />
            </div>
            <div className="field" style={{ flex: 2, minWidth: 200 }}>
              <label>sent by</label>
              <input className="input" placeholder="0x…" value={draft.sent} onChange={set("sent")} />
            </div>
            <div className="field" style={{ flex: 2, minWidth: 200 }}>
              <label>affected address</label>
              <input className="input" placeholder="0x…" value={draft.recv} onChange={set("recv")} />
            </div>
            <div className="field" style={{ width: 130 }}>
              <label>at checkpoint</label>
              <input className="input" placeholder="seq" value={draft.atCheckpoint} onChange={set("atCheckpoint")} />
            </div>
            <div className="field" style={{ flex: 2, minWidth: 200 }}>
              <label>input object</label>
              <input className="input" placeholder="0x…" value={draft.inputObject} onChange={set("inputObject")} />
            </div>
            <span className="faint small mono" style={{ paddingBottom: 8 }}>
              {list.isFetching ? "applying…" : "filters apply as you type"}
            </span>
          </div>
          {filterError && <div className="error-note" style={{ marginTop: 10 }}>{filterError}</div>}
        </div>
      </Section>

      <Section index="01" title="Results" aux={list.page === 0 && !buildFilterSafe(applied) ? "live · 6s" : undefined}>
        {list.error ? (
          <>
            <ErrorNote error={list.error} />
            {String((list.error as Error).message ?? "").includes("timed out") && (
              <div className="searchline-hint" style={{ marginTop: 8 }}>
                the indexer times out on broad filters — narrowing helps: combine the kind with a checkpoint,
                sender or function target
              </div>
            )}
          </>
        ) : list.isPending ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <div className="empty">no transactions match this filter</div>
        ) : (
          <>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th><Info tip={TERMS.digest}>DIGEST</Info></th>
                    <th><Info tip={TERMS.txKind}>KIND</Info></th>
                    <th>SUMMARY</th>
                    <th>SENDER</th>
                    <th className="num"><Info tip={TERMS.ptbCommands}>CMDS</Info></th>
                    <th className="num"><Info tip={TERMS.signature}>SIGS</Info></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.digest}>
                      <td>
                        <TxLink digest={t.digest} />
                      </td>
                      <td>
                        <Pill color={isSystemKind(t.tag) ? "violet" : "teal"}>{kindLabel(t.tag)}</Pill>
                      </td>
                      <td className="dim" style={{ maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.summary}
                      </td>
                      <td>
                        {t.sender && t.sender !== "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
                          <Hash value={t.sender} to={`/address/${t.sender}`} head={6} tail={6} copy={false} />
                        ) : (
                          <span className="faint">system</span>
                        )}
                      </td>
                      <td className="num dim">{t.cmds ?? "—"}</td>
                      <td className="num dim">{t.sigs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager hasNext={list.hasMore} onNext={list.next} onReset={list.reset} page={list.page} loading={list.isFetching} />
          </>
        )}
      </Section>
    </>
  );
}

function buildFilterSafe(f: FilterState) {
  try {
    return buildFilter(f);
  } catch {
    return undefined;
  }
}

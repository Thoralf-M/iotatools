// Event stream with the full EventFilter surface: type prefix, emitting
// module, sender, transaction digest. Each row expands to the decoded JSON.

import { Address, EventFilter } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { JsonString } from "../components/JsonTree";
import { Age, AddressLink, Empty, ErrorNote, LoadingBlock, Pager, Section, TypePill } from "../components/ui";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

interface FilterState {
  type: string;
  module: string;
  sender: string;
  tx: string;
}

function buildFilter(f: FilterState) {
  if (!f.type && !f.module && !f.sender && !f.tx) return undefined;
  return EventFilter.new({
    eventType: f.type || undefined,
    emittingModule: f.module || undefined,
    sender: f.sender ? Address.fromHex(f.sender) : undefined,
    transactionDigest: f.tx || undefined,
  });
}

export default function Events() {
  const client = useClient();
  const { network } = useNetwork();
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<FilterState>({
    type: params.get("type") ?? "",
    module: params.get("module") ?? "",
    sender: "",
    tx: "",
  });
  const [applied, setApplied] = useState<FilterState>(draft);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);

  const list = usePagedList({
    queryKey: [network, "events", applied],
    limit: 25,
    newestFirst: true,
    refetchInterval: 8000,
    fetcher: (p) => client.events(buildFilter(applied), p),
  });

  const set = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  // Auto-apply: filters take effect as you type (debounced), no button needed.
  const resetRef = React.useRef(list.reset);
  resetRef.current = list.reset;
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        buildFilter(draft);
        setFilterError(null);
        setApplied((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(draft)) {
            setOpenRow(null);
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
        <h1>EVENTS</h1>
        <div className="sub">
          <Info tip={TERMS.events}>
            Move events via <span className="mono">client.events(EventFilter, PaginationFilter)</span>
          </Info>
        </div>
      </div>

      <Section index="00" title="Filter">
        <div className="panel pad row" style={{ gap: 12, alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 2, minWidth: 240 }}>
            <label>event type (package::module::Type)</label>
            <input className="input" placeholder="0x3::validator::StakingRequestEvent" value={draft.type} onChange={set("type")} />
          </div>
          <div className="field" style={{ flex: 1.5, minWidth: 200 }}>
            <label>emitting module (package::module)</label>
            <input className="input" placeholder="0x…::pool" value={draft.module} onChange={set("module")} />
          </div>
          <div className="field" style={{ flex: 1.5, minWidth: 200 }}>
            <label>sender</label>
            <input className="input" placeholder="0x…" value={draft.sender} onChange={set("sender")} />
          </div>
          <div className="field" style={{ flex: 1.5, minWidth: 200 }}>
            <label>transaction digest</label>
            <input className="input" placeholder="base58…" value={draft.tx} onChange={set("tx")} />
          </div>
          <span className="faint small mono" style={{ paddingBottom: 8 }}>
            {list.isFetching ? "applying…" : "filters apply as you type"}
          </span>
        </div>
        {filterError && <div className="error-note" style={{ marginTop: 10 }}>{filterError}</div>}
      </Section>

      <Section
        index="01"
        title="Stream"
        aux={
          applied.type ? (
            <Link to={`/objects?type=${encodeURIComponent(applied.type)}`}>objects with this type →</Link>
          ) : list.page === 0 ? (
            "live · 8s"
          ) : undefined
        }
      >
        {list.error ? (
          <ErrorNote error={list.error} />
        ) : list.isPending ? (
          <LoadingBlock />
        ) : list.rows.length === 0 ? (
          <Empty>no events match</Empty>
        ) : (
          <>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>TYPE</th>
                    <th>MODULE</th>
                    <th>SENDER</th>
                    <th>AGE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.rows.map((e, i) => {
                    const expanded = openRow === i;
                    return (
                      <React.Fragment key={i}>
                        <tr style={{ cursor: "pointer" }} onClick={() => setOpenRow(expanded ? null : i)}>
                          <td><TypePill type={e.type} /></td>
                          <td className="dim">
                            {e.packageId && e.module ? (
                              <Link to={`/package/${e.packageId.toHex()}?module=${e.module}`}>{e.module}</Link>
                            ) : (
                              <span className="faint">system</span>
                            )}
                          </td>
                          <td>{e.sender ? <AddressLink addr={e.sender.toHex()} /> : <span className="faint">—</span>}</td>
                          <td className="dim">{e.timestamp ? <Age ms={e.timestamp} /> : "—"}</td>
                          <td className="dim">{expanded ? "▾" : "▸"}</td>
                        </tr>
                        {expanded && (
                          <tr>
                            <td colSpan={5} style={{ whiteSpace: "normal", background: "var(--bg-inset)" }}>
                              <div style={{ padding: "6px 2px" }}>
                                <div className="faint small mono" style={{ marginBottom: 6 }}>decoded Move value (event.json)</div>
                                <JsonString json={e.json} />
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
            <Pager hasNext={list.hasMore} onNext={list.next} onReset={list.reset} page={list.page} loading={list.isFetching} />
          </>
        )}
      </Section>
    </>
  );
}

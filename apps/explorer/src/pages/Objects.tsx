// Object explorer landing: query objects by type tag or owner, plus quick
// links to well-known system objects.

import { Address, ObjectFilter } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Empty, ErrorNote, Hash, LoadingBlock, ObjectLink, Pager, Section, TypePill } from "../components/ui";
import { normalizeTypeTag } from "../lib/format";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

const WELL_KNOWN: Array<[string, string, string]> = [
  ["0x0000000000000000000000000000000000000000000000000000000000000005", "IotaSystemState", "validators, stake, parameters"],
  ["0x0000000000000000000000000000000000000000000000000000000000000006", "Clock", "consensus timestamp, ticks every commit"],
  ["0x0000000000000000000000000000000000000000000000000000000000000008", "Random", "randomness beacon state"],
  ["0x0000000000000000000000000000000000000000000000000000000000000403", "DenyList", "per-coin deny lists"],
];

const WELL_KNOWN_PKGS: Array<[string, string]> = [
  ["0x0000000000000000000000000000000000000000000000000000000000000001", "move_stdlib"],
  ["0x0000000000000000000000000000000000000000000000000000000000000002", "iota_framework"],
  ["0x0000000000000000000000000000000000000000000000000000000000000003", "iota_system"],
  ["0x000000000000000000000000000000000000000000000000000000000000107a", "stardust"],
];

export default function Objects() {
  const client = useClient();
  const { network } = useNetwork();
  const [typeTag, setTypeTag] = useState("");
  const [owner, setOwner] = useState("");
  const [applied, setApplied] = useState<{ typeTag: string; owner: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const list = usePagedList({
    queryKey: [network, "objects-query", applied],
    limit: 24,
    enabled: applied != null,
    fetcher: (p) =>
      client.objects(
        ObjectFilter.new({
          typeTag: applied?.typeTag || undefined,
          owner: applied?.owner ? Address.fromHex(applied.owner) : undefined,
        }),
        p,
      ),
  });

  return (
    <>
      <div className="page-head">
        <h1>OBJECTS</h1>
        <div className="sub">
          Everything on IOTA is an object. Query the live set via <span className="mono">client.objects(ObjectFilter)</span>.
        </div>
      </div>

      <Section index="00" title="Query">
        <div className="panel pad row" style={{ gap: 12, alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 2, minWidth: 280 }}>
            <label>type tag</label>
            <input
              className="input"
              placeholder="0x2::coin::Coin<0x2::iota::IOTA>"
              value={typeTag}
              onChange={(e) => setTypeTag(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 2, minWidth: 240 }}>
            <label>owner</label>
            <input className="input" placeholder="0x…" value={owner} onChange={(e) => setOwner(e.target.value)} />
          </div>
          <button
            className="btn"
            disabled={!typeTag && !owner}
            onClick={() => {
              try {
                if (owner) Address.fromHex(owner);
                setErr(null);
                setApplied({ typeTag, owner });
                list.reset();
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              }
            }}
          >
            query
          </button>
        </div>
        {err && <div className="error-note" style={{ marginTop: 10 }}>{err}</div>}
      </Section>

      {applied &&
        (list.isPending ? (
          <LoadingBlock />
        ) : list.error ? (
          <ErrorNote error={list.error} />
        ) : list.rows.length === 0 ? (
          <Empty>no objects match</Empty>
        ) : (
          <Section index="01" title="Results">
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>OBJECT</th>
                    <th>TYPE</th>
                    <th className="num">VERSION</th>
                    <th>DIGEST</th>
                  </tr>
                </thead>
                <tbody>
                  {list.rows.map((o) => {
                    const oid = o.id().toHex();
                    return (
                      <tr key={oid}>
                        <td><ObjectLink id={oid} /></td>
                        <td><TypePill type={normalizeTypeTag(String(o.objectType()))} /></td>
                        <td className="num dim">{String(o.version().asU64())}</td>
                        <td className="dim"><Hash value={o.digest().toBase58()} copy={false} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pager hasNext={list.hasMore} onNext={list.next} onReset={list.reset} page={list.page} loading={list.isFetching} />
          </Section>
        ))}

      <Section index="02" title="System objects" aux="singletons every developer ends up reading">
        <div className="panel tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>WHAT IT IS</th>
              </tr>
            </thead>
            <tbody>
              {WELL_KNOWN.map(([id, name, desc]) => (
                <tr key={id}>
                  <td><Hash value={id} to={`/object/${id}`} head={6} tail={4} /></td>
                  <td>{name}</td>
                  <td className="dim" style={{ whiteSpace: "normal" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section index="03" title="Framework packages">
        <div className="panel pad row" style={{ gap: 10 }}>
          {WELL_KNOWN_PKGS.map(([id, name]) => (
            <Link key={id} to={`/package/${id}`} className="pill violet" style={{ textDecoration: "none" }}>
              {name}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

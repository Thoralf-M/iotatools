// Move package browser: module list with bytecode sizes, per-module API
// (functions with full signatures, structs with abilities + fields, enums),
// version history, linkage and type-origin tables.

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Address,
  EventFilter,
  MoveAbility,
  MoveFunctionInterface,
  movePackageToJson,
  MoveVisibility,
  ObjectId,
  TransactionsFilter,
  transactionToJson,
} from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { HexDump } from "../components/HexDump";
import { Info, TERMS } from "../components/Info";
import { JsonString } from "../components/JsonTree";
import {
  Age,
  Collapse,
  Empty,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  ObjectLink,
  Pill,
  Section,
  Spinner,
  Tabs,
  TxLink,
  TypePill,
} from "../components/ui";
import { fmtInt, prettifyTypeRepr } from "../lib/format";
import { usePagedList } from "../lib/paging";
import { errMsg, pageFwd, useClient, useNetwork } from "../lib/sdk";
import { kindTag, ptbBody, unwrapV1 } from "../lib/tx";

const VIS: Record<string, { label: string; color?: "teal" | "amber" | "violet" }> = {
  [MoveVisibility.Public]: { label: "public", color: "teal" },
  [MoveVisibility.Friend]: { label: "friend", color: "amber" },
  [MoveVisibility.Private]: { label: "private" },
};

const ABILITY: Record<string, string> = {
  [MoveAbility.Copy]: "copy",
  [MoveAbility.Drop]: "drop",
  [MoveAbility.Store]: "store",
  [MoveAbility.Key]: "key",
};

function abilities(list: MoveAbility[] | undefined): string {
  if (!list || list.length === 0) return "";
  return `has ${list.map((a) => ABILITY[a] ?? a).join(", ")}`;
}

// ── inline view-function runner ─────────────────────────────────────────────
// moveViewCallJson(functionName, typeArguments?, moveArguments?) executes a
// read-only Move call server-side. Probed conventions (devnet):
//   • functionName:   "0xPKG::module::function"
//   • typeArguments:  plain type strings, e.g. "0x2::iota::IOTA" or "u64"
//   • moveArguments:  each arg is a STRING containing JSON — '"0x6"' for an
//     object id / address, '[0,1,2]' for vector<u8>, '"hi"' for strings.
//     u64/u128/u256 must be JSON strings ('"7"'), not JSON numbers.
//   • &TxContext / &mut TxContext params are supplied by the server — omit them.

const TX_CONTEXT_RE = /^&(mut )?0x0*2::tx_context::TxContext$/;

function isTxContext(repr: string): boolean {
  return TX_CONTEXT_RE.test(repr);
}

/** Encode one user input as the JSON string moveViewCallJson expects. */
function encodeArg(raw: string, repr: string): string {
  const t = raw.trim();
  // u64+ integers must travel as JSON strings — the server rejects JSON numbers
  if (/^(u64|u128|u256)$/.test(repr.replace(/^&(mut )?/, "")) && /^\d+$/.test(t)) {
    return JSON.stringify(t);
  }
  // looks like JSON already? ([ { " number bool null) → pass through if valid
  if (/^[[{"]/.test(t) || t === "true" || t === "false" || t === "null" || /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(t)) {
    try {
      JSON.parse(t);
      return t;
    } catch {
      /* fall through: treat as plain string */
    }
  }
  // plain string / address / object id → JSON-quote it
  return JSON.stringify(t);
}

function FunctionRunner({
  pkgId,
  moduleName,
  fn,
  open,
}: {
  pkgId: string;
  moduleName: string;
  fn: MoveFunctionInterface;
  open: boolean;
}) {
  const client = useClient();
  const allParams = useMemo(() => fn.parameters() ?? [], [fn]);
  const userParams = useMemo(
    () => allParams.map((p, idx) => ({ repr: p.repr, idx })).filter((p) => !isTxContext(p.repr)),
    [allParams],
  );
  const tps = useMemo(() => fn.typeParameters() ?? [], [fn]);
  const [args, setArgs] = useState<string[]>(() => userParams.map(() => ""));
  const [tyArgs, setTyArgs] = useState<string[]>(() => tps.map(() => ""));

  const run = useMutation({
    mutationFn: async () => {
      const functionName = `${pkgId}::${moduleName}::${fn.name()}`;
      return client.moveViewCallJson(
        functionName,
        tps.length ? tyArgs.map((t) => t.trim()) : undefined,
        userParams.map((p, i) => encodeArg(args[i] ?? "", p.repr)),
      );
    },
  });

  if (!open) return null;

  const hiddenCtx = allParams.length - userParams.length;
  const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--hairline-strong, #333)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Pill color="teal">view call</Pill>
        <Info tip={TERMS.viewFunction} />
        <span className="faint" style={{ fontSize: 11 }}>
          read-only — free, no transaction is created
        </span>
      </div>

      {tps.map((tp, i) => (
        <div key={`ty${i}`} style={{ marginBottom: 6 }}>
          <div className="faint mono" style={{ fontSize: 10, marginBottom: 2 }}>
            type T{i}
            {tp.constraints.length ? ` (${tp.constraints.map((c) => ABILITY[c] ?? c).join("+")})` : ""}
          </div>
          <input
            className="input mono"
            style={inputStyle}
            placeholder='type argument, e.g. "0x2::iota::IOTA" or "u64"'
            value={tyArgs[i] ?? ""}
            onChange={(e) => setTyArgs((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
          />
        </div>
      ))}

      {userParams.map((p, i) => (
        <div key={p.idx} style={{ marginBottom: 6 }}>
          <div className="mono" style={{ fontSize: 10, marginBottom: 2, color: "var(--blue)" }}>
            arg{p.idx}: <span title={p.repr}>{prettifyTypeRepr(p.repr)}</span>
          </div>
          <input
            className="input mono"
            style={inputStyle}
            placeholder={p.repr.startsWith("&") ? "object id (0x…)" : "value — JSON or plain string"}
            value={args[i] ?? ""}
            onChange={(e) => setArgs((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
          />
        </div>
      ))}

      {hiddenCtx > 0 && (
        <div className="faint" style={{ fontSize: 10, marginBottom: 6 }}>
          {hiddenCtx} TxContext parameter{hiddenCtx > 1 ? "s" : ""} supplied automatically by the node
        </div>
      )}

      <button className="btn" disabled={run.isPending} onClick={() => run.mutate()}>
        {run.isPending ? <Spinner /> : "execute (read-only)"}
      </button>

      {run.error != null && <div className="error-note" style={{ marginTop: 8 }}>⚠ {errMsg(run.error)}</div>}
      {run.data &&
        (run.data.error != null ? (
          <div className="error-note" style={{ marginTop: 8 }}>⚠ {run.data.error}</div>
        ) : (
          <div style={{ marginTop: 8 }}>
            {run.data.results?.length ? (
              run.data.results.map((r, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  {run.data.results!.length > 1 && (
                    <div className="faint mono" style={{ fontSize: 10, marginBottom: 2 }}>
                      return value {i}
                    </div>
                  )}
                  <JsonString json={r} />
                </div>
              ))
            ) : (
              <Empty>call succeeded — no return values</Empty>
            )}
          </div>
        ))}
    </div>
  );
}

export default function PackagePage() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const moduleName = params.get("module");
  const tab = params.get("tab") ?? "modules";
  const client = useClient();
  const { network } = useNetwork();
  // which function runners are expanded, keyed "module::function" so opening
  // one card never resets another
  const [runOpen, setRunOpen] = useState<Record<string, boolean>>({});

  const q = useQuery({
    queryKey: [network, "package", id],
    queryFn: async () => {
      const pkg = await client.packageLatest(Address.fromHex(id));
      if (pkg == null) throw new Error(`package ${id} not found`);
      const modules = pkg.modules(); // Map<Identifier, ArrayBuffer>
      const moduleList = [...modules.entries()]
        .map(([ident, bytes]) => ({ name: String(ident), size: (bytes as ArrayBuffer).byteLength, bytes: bytes as ArrayBuffer }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return {
        pkg,
        moduleList,
        version: pkg.version().asU64(),
        typeOrigins: pkg.typeOriginTable(),
        linkage: pkg.linkageTable(), // Map<ObjectId, UpgradeInfo>
        json: movePackageToJson(pkg),
      };
    },
  });

  // recent transactions calling this package (narrowed to the selected
  // module when one is open) + events it emitted — the package's pulse
  const activityTarget = moduleName ? `${id}::${moduleName}` : id;
  const activityTxs = usePagedList({
    queryKey: [network, "pkg-activity-tx", id, moduleName ?? ""],
    limit: 15,
    newestFirst: true,
    enabled: tab === "activity",
    fetcher: (p) => client.transactions(TransactionsFilter.new({ function: activityTarget }), p),
  });
  const activityEvents = usePagedList({
    queryKey: [network, "pkg-activity-ev", id, moduleName ?? ""],
    limit: 10,
    newestFirst: true,
    enabled: tab === "activity",
    fetcher: (p) => client.events(EventFilter.new({ emittingModule: activityTarget }), p),
  });

  const versions = useQuery({
    queryKey: [network, "package-versions", id],
    enabled: tab === "versions",
    queryFn: async () => {
      const page = await client.packageVersions(Address.fromHex(id), undefined, undefined, pageFwd(50));
      return page.data;
    },
  });

  const mod = useQuery({
    queryKey: [network, "module", id, moduleName],
    enabled: !!moduleName,
    queryFn: async () => {
      const m = await client.normalizedMoveModule(Address.fromHex(id), moduleName!);
      if (m == null) throw new Error(`module ${moduleName} not found in package`);
      return m;
    },
  });

  const selectedBytes = useMemo(() => {
    if (!moduleName || !q.data) return null;
    return q.data.moduleList.find((m) => m.name === moduleName)?.bytes ?? null;
  }, [moduleName, q.data]);

  if (q.isPending) return <LoadingBlock label="packageLatest(address)…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  const d = q.data!;

  const setTab = (t: string) => {
    const next = new URLSearchParams(params);
    next.set("tab", t);
    setParams(next);
  };
  const openModule = (name: string) => {
    const next = new URLSearchParams(params);
    next.set("module", name);
    next.set("tab", "modules");
    setParams(next);
  };

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/packages">PACKAGES</Link> / PACKAGE
        </div>
        <h1>
          MOVE PACKAGE
          <Pill color="violet">v{String(d.version)}</Pill>
          <Pill>{d.moduleList.length} MODULES</Pill>
        </h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>{id}</div>
      </div>

      <Tabs
        tabs={[
          { id: "modules", label: "Modules", count: d.moduleList.length },
          { id: "linkage", label: "Linkage", count: d.linkage.size },
          { id: "origins", label: "Type Origins", count: d.typeOrigins.length },
          { id: "activity", label: "Activity" },
          { id: "versions", label: "Versions" },
          { id: "raw", label: "Raw JSON" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "modules" && (
        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 14, alignItems: "start" }}>
          <div className="panel">
            {d.moduleList.map((m) => (
              <button
                key={m.name}
                className="nav-item"
                style={{ width: "100%", border: "none", background: m.name === moduleName ? "var(--teal-dim)" : "none", cursor: "pointer", textAlign: "left" }}
                onClick={() => openModule(m.name)}
              >
                <span className="mono" style={{ color: m.name === moduleName ? "var(--teal)" : undefined }}>{m.name}</span>
                <span className="faint mono" style={{ marginLeft: "auto", fontSize: 10 }}>{m.size}B</span>
              </button>
            ))}
          </div>
          <div>
            {!moduleName && <Empty>select a module to inspect its API surface</Empty>}
            {moduleName && mod.isPending && <LoadingBlock label={`normalizedMoveModule(${moduleName})…`} />}
            {moduleName && mod.error && <ErrorNote error={mod.error} />}
            {moduleName && mod.data && (
              <>
                <Section index="01" title={`module ${moduleName}`} aux={`file format v${mod.data.fileFormatVersion}`}>
                  <div />
                </Section>

                <Section index="02" title="Functions" aux={`${mod.data.functions?.nodes.length ?? 0} exposed`}>
                  {!mod.data.functions?.nodes.length ? (
                    <Empty>no exposed functions</Empty>
                  ) : (
                    <div>
                      {mod.data.functions.nodes.map((f) => {
                        const vis = VIS[f.visibility() ?? ""] ?? { label: "?" };
                        const tps = f.typeParameters() ?? [];
                        const isPublic = f.visibility() === MoveVisibility.Public;
                        const runKey = `${moduleName}::${f.name()}`;
                        return (
                          <div className="cmd-card" key={f.name()}>
                            <div className="cmd-head">
                              <Pill color={vis.color}>{vis.label}</Pill>
                              {f.isEntry() && <Pill color="amber">entry</Pill>}
                              <b className="mono">{f.name()}</b>
                              {tps.length > 0 && (
                                <span className="dim">
                                  &lt;{tps.map((t, i) => `T${i}${t.constraints.length ? ": " + t.constraints.map((c) => ABILITY[c] ?? c).join("+") : ""}`).join(", ")}&gt;
                                </span>
                              )}
                              {isPublic && (
                                <button
                                  className="btn ghost"
                                  style={{ marginLeft: "auto", padding: "2px 8px", fontSize: 10 }}
                                  onClick={() => setRunOpen((prev) => ({ ...prev, [runKey]: !prev[runKey] }))}
                                >
                                  {runOpen[runKey] ? "▾ close" : "▸ run"}
                                </button>
                              )}
                            </div>
                            <div className="cmd-body" style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                              <div>
                                <span className="faint">args </span>(
                                {(f.parameters() ?? []).map((p, i) => (
                                  <span key={i}>
                                    {i > 0 && ", "}
                                    <span style={{ color: "var(--blue)" }} title={p.repr}>{prettifyTypeRepr(p.repr)}</span>
                                  </span>
                                ))}
                                )
                              </div>
                              {(f.returnType() ?? []).length > 0 && (
                                <div>
                                  <span className="faint">returns </span>
                                  {(f.returnType() ?? []).map((r, i) => (
                                    <span key={i}>
                                      {i > 0 && ", "}
                                      <span style={{ color: "var(--amber)" }} title={r.repr}>{prettifyTypeRepr(r.repr)}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {isPublic && (
                              <FunctionRunner
                                key={runKey}
                                pkgId={id}
                                moduleName={moduleName}
                                fn={f}
                                open={!!runOpen[runKey]}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Section>

                <Section index="03" title="Structs" aux={`${mod.data.structs?.nodes.length ?? 0} types`}>
                  {!mod.data.structs?.nodes.length ? (
                    <Empty>no structs</Empty>
                  ) : (
                    mod.data.structs.nodes.map((s) => (
                      <div className="cmd-card" key={s.name}>
                        <div className="cmd-head">
                          <Pill color="blue">struct</Pill>
                          <b className="mono">{s.name}</b>
                          {s.typeParameters?.length ? (
                            <span className="dim">
                              &lt;{s.typeParameters.map((t, i) => `${t.isPhantom ? "phantom " : ""}T${i}`).join(", ")}&gt;
                            </span>
                          ) : null}
                          <span className="dim">{abilities(s.abilities)}</span>
                          <span style={{ marginLeft: "auto", display: "inline-flex", gap: 6 }}>
                            {(s.abilities ?? []).includes(MoveAbility.Key) && (
                              <Link
                                className="pill teal"
                                style={{ fontSize: 9.5, textDecoration: "none" }}
                                to={`/objects?type=${encodeURIComponent(`${id}::${moduleName}::${s.name}`)}`}
                                title="objects have the key ability — query live instances of this type"
                              >
                                find objects →
                              </Link>
                            )}
                            <Link
                              className="pill"
                              style={{ fontSize: 9.5, textDecoration: "none" }}
                              to={`/events?type=${encodeURIComponent(`${id}::${moduleName}::${s.name}`)}`}
                              title="events emitted with this type"
                            >
                              events →
                            </Link>
                          </span>
                        </div>
                        <div className="cmd-body">
                          {(s.fields ?? []).map((fl) => (
                            <div key={fl.name}>
                              <span style={{ color: "var(--ink)" }}>{fl.name}</span>
                              <span className="faint">: </span>
                              <span style={{ color: "var(--blue)", overflowWrap: "anywhere" }} title={fl.type?.repr}>{fl.type?.repr ? prettifyTypeRepr(fl.type.repr) : "?"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </Section>

                {!!mod.data.enums?.nodes.length && (
                  <Section index="04" title="Enums" aux={`${mod.data.enums.nodes.length} types`}>
                    {mod.data.enums.nodes.map((en) => (
                      <div className="cmd-card" key={en.name}>
                        <div className="cmd-head">
                          <Pill color="violet">enum</Pill>
                          <b className="mono">{en.name}</b>
                          <span className="dim">{abilities(en.abilities)}</span>
                        </div>
                        <div className="cmd-body">
                          {(en.variants ?? []).map((v) => (
                            <div key={v.name}>
                              <span style={{ color: "var(--violet)" }}>{v.name}</span>
                              {!!v.fields?.length && (
                                <span className="faint">
                                  {" "}
                                  {"{ "}
                                  {v.fields.map((fl, i) => `${i > 0 ? ", " : ""}${fl.name}: ${fl.type?.repr ? prettifyTypeRepr(fl.type.repr) : "?"}`)}
                                  {" }"}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Section>
                )}

                {selectedBytes && (
                  <Section index="05" title="Module bytecode" aux={`${selectedBytes.byteLength} bytes`}>
                    <Collapse label={`module bytecode (${selectedBytes.byteLength} bytes)`}>
                      <HexDump bytes={new Uint8Array(selectedBytes)} />
                    </Collapse>
                  </Section>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {tab === "activity" && (
        <>
          <Section
            index="01"
            title={moduleName ? `Calls into ${moduleName}` : "Recent calls"}
            aux={
              <>
                filter: function = {activityTarget.slice(0, 20)}…{moduleName && (
                  <button className="btn ghost" style={{ marginLeft: 8, padding: "2px 8px" }} onClick={() => openModule("")}>
                    whole package
                  </button>
                )}
              </>
            }
          >
            {activityTxs.isPending ? (
              <LoadingBlock />
            ) : activityTxs.error ? (
              <ErrorNote error={activityTxs.error} />
            ) : activityTxs.rows.length === 0 ? (
              <Empty>no transactions found calling this {moduleName ? "module" : "package"}</Empty>
            ) : (
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>DIGEST</th>
                      <th>CALL</th>
                      <th>SENDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityTxs.rows.map((st) => {
                      const digest = st.transaction.digest().toBase58();
                      let summary = "";
                      let sender = "";
                      try {
                        const j = unwrapV1(JSON.parse(transactionToJson(st.transaction)));
                        const cmds = ptbBody(j?.kind)?.commands ?? [];
                        const call = cmds
                          .map((c: any) => c?.MoveCall)
                          .find((mc: any) => mc && String(mc.package) === id && (!moduleName || mc.module === moduleName));
                        summary = call ? `${call.module}::${call.function}` : kindTag(j?.kind);
                        sender = j?.sender ?? "";
                      } catch {
                        /* digest-only row */
                      }
                      return (
                        <tr key={digest}>
                          <td><TxLink digest={digest} /></td>
                          <td className="dim">{summary}</td>
                          <td>{sender ? <Hash value={sender} to={`/address/${sender}`} head={6} tail={4} copy={false} /> : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {activityTxs.hasMore && !activityTxs.isPending && (
              <div className="pager">
                <button className="btn ghost" disabled={activityTxs.isFetching} onClick={activityTxs.next}>older ⇥</button>
              </div>
            )}
          </Section>

          <Section index="02" title="Recent events" aux={`filter: emittingModule = ${activityTarget.slice(0, 24)}…`}>
            {activityEvents.isPending ? (
              <LoadingBlock />
            ) : activityEvents.error ? (
              <ErrorNote error={activityEvents.error} />
            ) : activityEvents.rows.length === 0 ? (
              <Empty>no events emitted</Empty>
            ) : (
              activityEvents.rows.map((e, i) => (
                <div className="cmd-card" key={i}>
                  <div className="cmd-head" style={{ flexWrap: "wrap" }}>
                    <span className="idx">#{i}</span>
                    <TypePill type={e.type} />
                    {e.module && <span className="dim">from {e.module}</span>}
                    {e.sender && <Hash value={e.sender.toHex()} to={`/address/${e.sender.toHex()}`} head={6} tail={4} copy={false} />}
                    {e.timestamp && <span className="dim"><Age ms={e.timestamp} /></span>}
                  </div>
                  <div className="cmd-body">
                    <JsonString json={e.json} />
                  </div>
                </div>
              ))
            )}
          </Section>
        </>
      )}

      {tab === "linkage" && (
        <Section index="01" title="Linkage table" aux="dependency package → version pinned at publish/upgrade">
          {d.linkage.size === 0 ? (
            <Empty>no dependencies</Empty>
          ) : (
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>RUNTIME ID</th>
                    <th>STORAGE ID (UPGRADED)</th>
                    <th className="num">VERSION</th>
                  </tr>
                </thead>
                <tbody>
                  {[...d.linkage.entries()].map(([oid, info]) => (
                    <tr key={String(oid.toHex?.() ?? oid)}>
                      <td><Hash value={oid.toHex()} to={`/package/${oid.toHex()}`} /></td>
                      <td><Hash value={info.upgradedId.toHex()} to={`/package/${info.upgradedId.toHex()}`} /></td>
                      <td className="num">{String(info.upgradedVersion.asU64())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {tab === "origins" && (
        <Section index="01" title="Type origin table" aux="where each type was first defined">
          <div className="panel tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>MODULE</th>
                  <th>TYPE</th>
                  <th>ORIGIN PACKAGE</th>
                </tr>
              </thead>
              <tbody>
                {d.typeOrigins.map((t, i) => (
                  <tr key={i}>
                    <td className="dim">{String(t.moduleName)}</td>
                    <td>{String(t.datatypeName)}</td>
                    <td><Hash value={t.package.toHex()} to={`/package/${t.package.toHex()}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {tab === "versions" &&
        (versions.isPending ? (
          <LoadingBlock />
        ) : versions.error ? (
          <ErrorNote error={versions.error} />
        ) : (
          <Section index="01" title="Version history" aux="packageVersions(address)">
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="num">VERSION</th>
                    <th>STORAGE ID</th>
                    <th className="num">MODULES</th>
                  </tr>
                </thead>
                <tbody>
                  {(versions.data ?? []).map((p) => (
                    <tr key={String(p.version().asU64())}>
                      <td className="num">{String(p.version().asU64())}</td>
                      <td><Hash value={p.id().toHex()} to={`/package/${p.id().toHex()}`} /></td>
                      <td className="num dim">{p.modules().size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ))}

      {tab === "raw" && (
        <Section index="01" title="MovePackage · serde JSON" aux="movePackageToJson(pkg) — module bytecode base64-encoded">
          <JsonString json={d.json} />
        </Section>
      )}
    </>
  );
}

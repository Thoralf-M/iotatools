// Object detail: typed header, decoded Move contents (server-side JSON),
// dynamic fields, owning transaction, raw serde JSON and struct BCS.
// Supports time-travel via ?version=N (client.object(id, Version)).
//
// Ids that have no live object record but *parent* dynamic fields (Table /
// Bag / ObjectTable UIDs — e.g. the IOTA-Names registry) render as a
// browsable dynamic-field container instead of a dead end.

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Address, ObjectId, objectToJson, Version } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { HexDump } from "../components/HexDump";
import { JsonString, JsonTree } from "../components/JsonTree";
import {
  Empty,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  OwnerBadge,
  Pill,
  Section,
  Spinner,
  Tabs,
  TxLink,
  TypePill,
  useTabParam,
} from "../components/ui";
import { Info, TERMS } from "../components/Info";
import { fmtInt, fmtIota, normalizeTypeTag, shortType, splitTypeTag } from "../lib/format";
import { parseRunQuery } from "../lib/checkpoints";
import { objectDisplay } from "../lib/gql";
import { pageFwd, useClient, useNetwork } from "../lib/sdk";

function ownerToJsonShape(ownerJson: any): unknown {
  return ownerJson;
}

// ── dynamic-field browser ────────────────────────────────────────────────────
// Cursor-appended so entries accumulate; big tables (thousands of entries)
// are browsable via load-more / load-all plus a client-side text filter over
// everything loaded (matches field names, name types and value types).

const DYN_PAGE = 25;
const DYN_LOAD_ALL_CAP = 500;

interface DynRow {
  nameType: string;
  nameJson: unknown;
  valueType: string | null;
  valueJson: unknown;
}

function useDynamicFields(parentId: string, enabled: boolean) {
  const client = useClient();
  const { network } = useNetwork();
  const q = useInfiniteQuery({
    queryKey: [network, "dynfields", parentId],
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const page = await client.dynamicFields(Address.fromHex(parentId), pageFwd(DYN_PAGE, pageParam));
      return {
        rows: page.data.map(
          (f): DynRow => ({
            nameType: normalizeTypeTag(f.name.typeTag.toString()),
            nameJson: f.name.json != null ? parseRunQuery(f.name.json) : null,
            valueType: f.value != null ? normalizeTypeTag(String(f.value.typeTag)) : null,
            valueJson: f.valueAsJson != null ? parseRunQuery(f.valueAsJson) : null,
          }),
        ),
        hasNext: page.pageInfo.hasNextPage,
        endCursor: page.pageInfo.endCursor ?? undefined,
      };
    },
    getNextPageParam: (last) => (last.hasNext && last.endCursor ? last.endCursor : undefined),
  });
  const rows = useMemo(() => q.data?.pages.flatMap((p) => p.rows) ?? [], [q.data]);
  return { ...q, rows };
}

function DynamicFieldList({ dyn }: { dyn: ReturnType<typeof useDynamicFields> }) {
  const [filter, setFilter] = useState("");
  const [loadingAll, setLoadingAll] = useState(false);

  const loadAll = async () => {
    setLoadingAll(true);
    try {
      let res = await dyn.fetchNextPage();
      while (res.hasNextPage && (res.data?.pages.reduce((n, p) => n + p.rows.length, 0) ?? 0) < DYN_LOAD_ALL_CAP) {
        res = await dyn.fetchNextPage();
      }
    } finally {
      setLoadingAll(false);
    }
  };

  const visible = useMemo(() => {
    if (!filter) return dyn.rows;
    const needle = filter.toLowerCase();
    return dyn.rows.filter(
      (r) =>
        JSON.stringify(r.nameJson ?? "").toLowerCase().includes(needle) ||
        r.nameType.toLowerCase().includes(needle) ||
        (r.valueType ?? "").toLowerCase().includes(needle),
    );
  }, [dyn.rows, filter]);

  return (
    <>
      <div className="panel pad row" style={{ gap: 10, marginBottom: 10 }}>
        <input
          className="input"
          style={{ flex: 1, maxWidth: 380 }}
          placeholder="filter loaded entries… name, key or value type"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="faint small mono">
          {filter ? `${visible.length} of ` : ""}
          {dyn.rows.length} loaded{dyn.hasNextPage ? "+" : " · complete"}
        </span>
        {dyn.hasNextPage && (
          <>
            <button className="btn ghost" disabled={dyn.isFetchingNextPage || loadingAll} onClick={() => dyn.fetchNextPage()}>
              {dyn.isFetchingNextPage && !loadingAll ? <Spinner /> : `load ${DYN_PAGE} more ⇣`}
            </button>
            <button
              className="btn ghost"
              disabled={loadingAll}
              onClick={loadAll}
              title={`fetches every page (capped at ${DYN_LOAD_ALL_CAP} entries)`}
            >
              {loadingAll ? <><Spinner /> loading all…</> : "load all ⇊"}
            </button>
          </>
        )}
      </div>
      {visible.map((f, i) => (
        <div className="cmd-card" key={i}>
          <div className="cmd-head" style={{ flexWrap: "wrap" }}>
            <span className="idx">#{i}</span>
            <TypePill type={f.nameType} />
            <span className="dim" style={{ overflowWrap: "anywhere", whiteSpace: "normal" }}>
              name: {f.nameJson != null ? JSON.stringify(f.nameJson) : "(bcs)"}
            </span>
            {f.valueType && (splitTypeTag(f.valueType) ? (
              <Link
                className="dim"
                style={{ color: "var(--ink-dim)" }}
                title={`${f.valueType} — open the defining module`}
                to={`/package/${splitTypeTag(f.valueType)!.pkg}?module=${splitTypeTag(f.valueType)!.module}`}
              >
                → {shortType(f.valueType)}
              </Link>
            ) : (
              <span className="dim" title={f.valueType}>
                → {shortType(f.valueType)}
              </span>
            ))}
          </div>
          {f.valueJson != null && (
            <div className="cmd-body">
              <JsonTree data={f.valueJson} />
            </div>
          )}
        </div>
      ))}
      {visible.length === 0 && <Empty>{filter ? "no loaded entries match the filter" : "no entries"}</Empty>}
    </>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function ObjectPage() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const versionParam = params.get("version");
  const client = useClient();
  const { network } = useNetwork();
  const [tab, setTab] = useTabParam("overview");
  const [versionDraft, setVersionDraft] = useState(versionParam ?? "");
  // version changes must not clobber the ?tab= param
  const setVersionParam = (v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set("version", v);
    else next.delete("version");
    setParams(next);
  };

  const q = useQuery({
    queryKey: [network, "object", id, versionParam],
    queryFn: async () => {
      const oid = ObjectId.fromHex(id);
      const version = versionParam ? Version.fromU64(BigInt(versionParam)) : undefined;
      const [obj, contents, display] = await Promise.all([
        client.object(oid, version),
        client.moveObjectContents(oid, version).catch(() => null),
        objectDisplay(client, id).catch(() => null),
      ]);
      // No live record: wrapped (e.g. a Table UID or a staking pool),
      // deleted, or actually an account address.
      if (obj == null) return { missing: true as const };
      const json = objectToJson(obj);
      const parsed = JSON.parse(json);
      const struct = obj.asStructOpt();
      const bcs: Uint8Array | null = struct ? new Uint8Array(struct.contents as unknown as ArrayBuffer) : null;
      return {
        missing: false as const,
        obj,
        json,
        display,
        ownerJson: parsed?.owner ?? null,
        typeStr: parsed?.data?.Struct?.type ?? (obj.objectType().isPackage() ? "package" : normalizeTypeTag(String(obj.objectType()))),
        contents,
        bcs,
        version: obj.version().asU64(),
        digest: obj.digest().toBase58(),
        prevTx: obj.previousTransaction().toBase58(),
        rebate: obj.storageRebate(),
        isPackage: obj.objectType().isPackage(),
      };
    },
  });

  const missing = q.data?.missing === true;
  const dyn = useDynamicFields(id, !q.isPending && (tab === "dynamic" || missing));

  if (q.isPending) return <LoadingBlock />;
  if (q.error) return <ErrorNote error={q.error} />;

  if (q.data!.missing) {
    const probing = dyn.isPending;
    const isContainer = dyn.rows.length > 0;
    return (
      <>
        <div className="page-head">
          <div className="crumbs">
            <Link to="/objects">OBJECTS</Link> / OBJECT
          </div>
          <h1>
            {isContainer ? (
              <>
                DYNAMIC FIELD CONTAINER{" "}
                <Pill color="teal" title="a Table / Bag / ObjectTable UID — the entries below live under this id">
                  TABLE
                </Pill>
              </>
            ) : (
              <>
                OBJECT <Pill color="amber">NO LIVE RECORD</Pill>
              </>
            )}
          </h1>
          <div className="sub mono" style={{ overflowWrap: "anywhere" }}>{id}</div>
        </div>

        {probing ? (
          <LoadingBlock label="probing dynamicFields(id)…" />
        ) : isContainer ? (
          <Section
            index="01"
            title={<Info tip={TERMS.dynamicFields}>Entries</Info>}
            aux="this id has no live object record — it is the UID of a wrapped collection; its entries are dynamic fields"
          >
            <DynamicFieldList dyn={dyn} />
          </Section>
        ) : (
          <Section index="01" title="Why is there nothing here?">
            <div className="panel pad" style={{ lineHeight: 1.7, maxWidth: 720 }}>
              The indexer has no live object under this id{versionParam ? ` at version ${versionParam}` : ""}, and no
              dynamic fields parented by it. That usually means one of:
              <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                <li>
                  <b>wrapped</b> — the object lives <i>inside</i> another object and is not separately addressable.
                  Validator staking pools are the classic case: the pool is stored in the system state object (
                  <Link to="/object/0x0000000000000000000000000000000000000000000000000000000000000005">0x5</Link>).
                </li>
                <li><b>deleted</b> — it existed and was removed by a transaction.</li>
                <li><b>never existed</b> — the id might actually be an account address.</li>
              </ul>
            </div>
          </Section>
        )}

        <Section index="02" title="Look elsewhere">
          <div className="panel pad row" style={{ gap: 10 }}>
            <Link className="btn" to={`/address/${id}`}>view as address →</Link>
            <span className="faint small">balances, owned objects and transactions for this id as an account</span>
          </div>
        </Section>
      </>
    );
  }

  const d = q.data! as Exclude<typeof q.data, { missing: true } | undefined> & { missing: false };
  if (d.isPackage) return <Navigate to={`/package/${id}`} replace />;

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/objects">OBJECTS</Link> / OBJECT
        </div>
        <h1>
          OBJECT
          <TypePill type={d.typeStr} />
          {versionParam && <Pill color="amber">HISTORIC v{versionParam}</Pill>}
        </h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>
          {id}
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "contents", label: "Contents" },
          { id: "dynamic", label: "Dynamic Fields" },
          { id: "raw", label: "Raw JSON" },
          { id: "bcs", label: "BCS", count: d.bcs?.length ?? 0 },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <>
          {d.display && (d.display.name || d.display.image_url) && (
            <div className="display-banner" style={{ marginBottom: 14 }}>
              {d.display.image_url && <img src={d.display.image_url} alt="" loading="lazy" />}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{d.display.name ?? "—"}</div>
                {d.display.description && <div className="muted small" style={{ marginTop: 3 }}>{d.display.description}</div>}
                <div className="faint small mono" style={{ marginTop: 3 }}>
                  <Info tip="Objects can register human-readable Display metadata on-chain (name, image, description). This is what wallets and marketplaces show.">
                    on-chain Display metadata
                  </Info>
                </div>
              </div>
            </div>
          )}
          <Section index="01" title="State">
            <KV
              rows={[
                [<Info tip={TERMS.objectId}>Object id</Info>, <Hash value={id} full />],
                ["Type", <span className="mono small">{d.typeStr}</span>],
                [<Info tip={TERMS.objectVersion}>Version (lamport)</Info>, fmtInt(d.version)],
                [<Info tip={TERMS.objectDigest}>Digest</Info>, <Hash value={d.digest} full />],
                [<Info tip={TERMS.owner}>Owner</Info>, <OwnerBadge owner={ownerToJsonShape(d.ownerJson)} />],
                ["Last transaction", <TxLink digest={d.prevTx} full />],
                [<Info tip={TERMS.storageRebateObj}>Storage rebate</Info>, <span>{fmtIota(d.rebate)} <span className="faint">({fmtInt(d.rebate)} nanos)</span></span>],
              ]}
            />
          </Section>
          <Section index="02" title="Time travel" aux="client.object(id, Version.fromU64(n)) — needs an indexer with history">
            <div className="panel pad row" style={{ gap: 10 }}>
              <input
                className="input"
                style={{ width: 160 }}
                placeholder={`version (now ${d.version})`}
                value={versionDraft}
                onChange={(e) => setVersionDraft(e.target.value.replace(/[^\d]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && versionDraft) setVersionParam(versionDraft);
                }}
              />
              <button className="btn" disabled={!versionDraft} onClick={() => setVersionParam(versionDraft)}>
                view at version
              </button>
              {versionParam && (
                <button className="btn ghost" onClick={() => setVersionParam(null)}>
                  back to latest
                </button>
              )}
            </div>
          </Section>
        </>
      )}

      {tab === "contents" &&
        (d.contents != null ? (
          <Section index="01" title="Move contents" aux="client.moveObjectContents(id) — BCS decoded against the on-chain layout">
            <JsonTree data={parseRunQuery(d.contents)} />
          </Section>
        ) : (
          <Empty>contents unavailable (not a Move object, or pruned)</Empty>
        ))}

      {tab === "dynamic" &&
        (dyn.isPending ? (
          <LoadingBlock label="dynamicFields(address)…" />
        ) : dyn.error ? (
          <ErrorNote error={dyn.error} />
        ) : dyn.rows.length === 0 ? (
          <Empty>no dynamic fields attached</Empty>
        ) : (
          <Section index="01" title={<Info tip={TERMS.dynamicFields}>Dynamic fields</Info>}>
            <DynamicFieldList dyn={dyn} />
          </Section>
        ))}

      {tab === "raw" && (
        <Section index="01" title="Object · serde JSON" aux="objectToJson(obj)">
          <JsonString json={d.json} />
        </Section>
      )}

      {tab === "bcs" &&
        (d.bcs ? (
          <Section index="01" title="Struct contents BCS" aux="obj.asStruct().contents — first 32 bytes are the object id">
            <HexDump bytes={d.bcs} />
          </Section>
        ) : (
          <Empty>no struct BCS (package object)</Empty>
        ))}
    </>
  );
}

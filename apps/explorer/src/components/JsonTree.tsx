// Collapsible JSON tree with chain-aware affordances: hex strings that look
// like addresses/objects and base58 digests become explorer links.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fmtInt } from "../lib/format";
import { CopyBtn } from "./ui";

const ADDR_RE = /^0x[0-9a-fA-F]{64}$/;
const DIGEST_RE = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

// Object ids and account addresses share the same hex space. Route by the
// JSON key when it's telling (…address, sender, staker…, owner, recipient →
// address page; …id, package → object page); otherwise let /resolve ask the
// chain which one it is.
const ADDRESS_KEY_RE = /(address|sender|staker|owner|recipient|delegator|payer|beneficiary)/i;
const OBJECT_KEY_RE = /(object_?id|pool_?id|package|_id)$/i;

function hexTarget(hex: string, jkey?: string): string {
  if (jkey) {
    if (ADDRESS_KEY_RE.test(jkey)) return `/address/${hex}`;
    if (OBJECT_KEY_RE.test(jkey)) return `/object/${hex}`;
  }
  return `/resolve/${hex}`;
}

function Leaf({ v, jkey }: { v: unknown; jkey?: string }) {
  if (v === null || v === undefined) return <span className="jz">null</span>;
  switch (typeof v) {
    case "string": {
      if (ADDR_RE.test(v)) {
        return (
          <span className="js">
            "<Link to={hexTarget(v, jkey)}>{v}</Link>"
          </span>
        );
      }
      if (DIGEST_RE.test(v) && jkey !== "digest_b58_nolink") {
        return (
          <span className="js">
            "<Link to={`/tx/${v}`}>{v}</Link>"
          </span>
        );
      }
      return <LongString v={v} />;
    }
    case "number":
      return <span className="jn">{String(v)}</span>;
    case "bigint":
      return <span className="jn">{v.toString()}</span>;
    case "boolean":
      return <span className="jb">{String(v)}</span>;
    default:
      return <span className="jz">{String(v)}</span>;
  }
}

/** Long string leaves truncate but stay expandable in place. */
function LongString({ v }: { v: string }) {
  const [open, setOpen] = useState(false);
  if (v.length <= 220) return <span className="js">"{v}"</span>;
  if (!open) {
    return (
      <span className="js">
        "{v.slice(0, 200)}
        <span className="json-collapsed" onClick={() => setOpen(true)} title="click to show the full value">
          {" "}… +{fmtInt(v.length - 200)} chars ▸
        </span>
        "
      </span>
    );
  }
  return (
    <span className="js" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
      "{v}"
      <span className="json-collapsed" onClick={() => setOpen(false)} title="collapse">
        {" "}⤴ collapse
      </span>
      <CopyBtn text={v} />
    </span>
  );
}

function isLeaf(v: unknown): boolean {
  return v === null || v === undefined || typeof v !== "object";
}

/** Move Table/Bag/ObjectTable UIDs serialize as exactly { id: 0x…, size: "N" }. */
function tableShape(v: unknown): { id: string; size: string } | null {
  if (v == null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length !== 2 || !("id" in o) || !("size" in o)) return null;
  const id = typeof o.id === "string" ? o.id : null;
  const size = typeof o.size === "string" ? o.size : typeof o.size === "number" ? String(o.size) : null;
  if (id == null || size == null || !ADDR_RE.test(id) || !/^\d+$/.test(size)) return null;
  return { id, size };
}

function Node({
  k,
  v,
  depth,
  last,
}: {
  k: string | null;
  v: unknown;
  depth: number;
  last: boolean;
}) {
  const [open, setOpen] = useState(depth < 3);
  const comma = last ? "" : ",";
  const keyPart = k !== null ? (
    <>
      <span className="jk">"{k}"</span>
      <span className="jp">: </span>
    </>
  ) : null;

  if (isLeaf(v)) {
    return (
      <div className="json-row">
        <span className="toggle"> </span>
        {keyPart}
        <Leaf v={v} jkey={k ?? undefined} />
        <span className="jp">{comma}</span>
      </div>
    );
  }

  // Table / Bag / ObjectTable UIDs serialize as { id, size } — the id has no
  // live object record, its entries are dynamic fields. Link straight to the
  // browsable container view instead of the (useless) account fallback.
  const ts = tableShape(v);
  if (ts) {
    return (
      <div className="json-row">
        <span className="toggle"> </span>
        {keyPart}
        <span className="jp">{"{ "}</span>
        <span className="jk">"id"</span>
        <span className="jp">: </span>
        <span className="js">
          "<Link to={`/object/${ts.id}?tab=dynamic`}>{ts.id}</Link>"
        </span>
        <span className="jp">, </span>
        <span className="jk">"size"</span>
        <span className="jp">: </span>
        <span className="jn">"{ts.size}"</span>
        <span className="jp">{" }"}</span>
        {ts.size !== "0" && (
          <Link
            to={`/object/${ts.id}?tab=dynamic`}
            className="pill teal"
            style={{ marginLeft: 8, fontSize: 9.5, textDecoration: "none", verticalAlign: "1px" }}
            title="this is a dynamic-field collection — browse its entries"
          >
            browse {fmtInt(ts.size)} entr{ts.size === "1" ? "y" : "ies"} →
          </Link>
        )}
        <span className="jp">{comma}</span>
      </div>
    );
  }

  const isArr = Array.isArray(v);
  const entries: Array<[string | null, unknown]> = isArr
    ? (v as unknown[]).map((x) => [null, x] as [null, unknown])
    : Object.entries(v as Record<string, unknown>);
  const openCh = isArr ? "[" : "{";
  const closeCh = isArr ? "]" : "}";

  if (entries.length === 0) {
    return (
      <div className="json-row">
        <span className="toggle"> </span>
        {keyPart}
        <span className="jp">
          {openCh}
          {closeCh}
          {comma}
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="json-row">
        <span className="toggle" onClick={() => setOpen(true)}>
          ▸
        </span>
        {keyPart}
        <span className="json-collapsed" onClick={() => setOpen(true)}>
          {openCh} … {entries.length} {isArr ? (entries.length === 1 ? "item" : "items") : entries.length === 1 ? "key" : "keys"} {closeCh}
        </span>
        <span className="jp">{comma}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="json-row">
        <span className="toggle" onClick={() => setOpen(false)}>
          ▾
        </span>
        {keyPart}
        <span className="jp">{openCh}</span>
      </div>
      <div className="json-children">
        {entries.map(([ck, cv], i) => (
          <Node key={ck ?? i} k={ck} v={cv} depth={depth + 1} last={i === entries.length - 1} />
        ))}
      </div>
      <div className="json-row">
        <span className="toggle"> </span>
        <span className="jp">
          {closeCh}
          {comma}
        </span>
      </div>
    </div>
  );
}

export function JsonTree({ data, raw }: { data: unknown; raw?: string }) {
  const text =
    raw ??
    JSON.stringify(data, (_k, val) => (typeof val === "bigint" ? val.toString() : val), 2);
  return (
    <div className="panel" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 6, right: 8, zIndex: 1 }}>
        <CopyBtn text={text} />
      </div>
      <div className="json-tree">
        <Node k={null} v={data} depth={0} last />
      </div>
    </div>
  );
}

/** Parse a JSON string (from the SDK *ToJson helpers) and render it. */
export function JsonString({ json }: { json: string }) {
  try {
    return <JsonTree data={JSON.parse(json)} raw={json} />;
  } catch {
    return (
      <div className="panel json-tree">
        <span className="js">{json}</span>
      </div>
    );
  }
}

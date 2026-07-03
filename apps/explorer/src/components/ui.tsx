// Small shared UI atoms: hashes, pills, stats, sections, tabs, pager, etc.

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fmtInt, fmtIota, normalizeTypeTag, shortType, timeAgo, toMs, truncMiddle } from "../lib/format";

export function Spinner() {
  return <span className="spinner" />;
}

export function LoadingBlock({ label = "querying via @iota/sdk-wasm…" }: { label?: string }) {
  return (
    <div className="loading-block">
      <Spinner /> {label}
    </div>
  );
}

export function ErrorNote({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : String(error);
  return <div className="error-note">⚠ {msg}</div>;
}

export function Empty({ children = "nothing here" }: { children?: React.ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`copy-btn${done ? " done" : ""}`}
      title="copy"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
    >
      {done ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

/** Truncated middle hash with optional link + copy. */
export function Hash({
  value,
  to,
  full = false,
  copy = true,
  head = 8,
  tail = 8,
}: {
  value: string;
  to?: string;
  full?: boolean;
  copy?: boolean;
  head?: number;
  tail?: number;
}) {
  const t = full ? null : truncMiddle(value, head, tail);
  const body = t ? (
    <>
      {t.head}
      <span className="mid">{t.mid}</span>
      {t.tail}
    </>
  ) : (
    value
  );
  const inner = <span className={`hash${full ? " full" : ""}`}>{body}</span>;
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {to ? <Link to={to}>{inner}</Link> : inner}
      {copy && <CopyBtn text={value} />}
    </span>
  );
}

export function AddressLink({ addr, full = false }: { addr: string; full?: boolean }) {
  return <Hash value={addr} to={`/address/${addr}`} full={full} />;
}

export function ObjectLink({ id, full = false }: { id: string; full?: boolean }) {
  return <Hash value={id} to={`/object/${id}`} full={full} />;
}

export function TxLink({ digest, full = false }: { digest: string; full?: boolean }) {
  return <Hash value={digest} to={`/tx/${digest}`} full={full} />;
}

export function Pill({
  color,
  children,
  title,
}: {
  color?: "teal" | "amber" | "coral" | "blue" | "violet";
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span className={`pill${color ? ` ${color}` : ""}`} title={title}>
      {children}
    </span>
  );
}

export function TypePill({ type }: { type: string }) {
  const full = normalizeTypeTag(type);
  return (
    <Pill color="blue" title={full}>
      <span className="trunc">{shortType(full)}</span>
    </Pill>
  );
}

export function StatusPill({ success }: { success: boolean }) {
  return success ? (
    <Pill color="teal">
      <span className="led" style={{ width: 5, height: 5 }} /> SUCCESS
    </Pill>
  ) : (
    <Pill color="coral">
      <span className="led coral" style={{ width: 5, height: 5 }} /> FAILURE
    </Pill>
  );
}

/** Owner from JSON shape: {Address|Object: hex}|{Shared:{...}}|"Immutable" */
export function OwnerBadge({ owner }: { owner: unknown }) {
  if (owner == null) return <span className="faint">—</span>;
  if (typeof owner === "string") return <Pill color="violet">{owner.toUpperCase()}</Pill>;
  const o = owner as Record<string, unknown>;
  if (o.Address || o.ObjectOwner || o.Object) {
    const addr = String(o.Address ?? o.ObjectOwner ?? o.Object);
    const isObj = !o.Address;
    return (
      <span className="row" style={{ gap: 6, display: "inline-flex" }}>
        <Pill color={isObj ? "blue" : "teal"}>{isObj ? "OBJECT" : "ADDRESS"}</Pill>
        <Hash value={addr} to={isObj ? `/object/${addr}` : `/address/${addr}`} head={6} tail={6} />
      </span>
    );
  }
  if ("Shared" in o || "SharedV1" in o) {
    const v = (o.Shared as Record<string, unknown>)?.initial_shared_version ?? (o.Shared as unknown);
    return <Pill color="amber">SHARED {v != null && typeof v !== "object" ? `@${v}` : ""}</Pill>;
  }
  if ("Immutable" in o) return <Pill color="violet">IMMUTABLE</Pill>;
  return <Pill>{JSON.stringify(owner).slice(0, 30)}</Pill>;
}

export function Amount({ nanos, maxFrac = 4 }: { nanos: bigint | string | number | null | undefined; maxFrac?: number }) {
  if (nanos == null) return <span className="faint">—</span>;
  return (
    <span className="mono" title={`${fmtInt(nanos)} nanos`}>
      {fmtIota(nanos, { maxFrac })}
    </span>
  );
}

export function Age({ ms }: { ms: bigint | string | number | null | undefined }) {
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 5000);
    return () => clearInterval(t);
  }, []);
  const t = toMs(ms);
  return <span title={t != null ? new Date(t).toISOString() : undefined}>{t != null ? timeAgo(t) : "—"}</span>;
}

let sectionCounter = 0;

export function Section({
  title,
  aux,
  children,
  index,
}: {
  title: React.ReactNode;
  aux?: React.ReactNode;
  children: React.ReactNode;
  index?: string;
}) {
  return (
    <section className="section">
      <div className="section-head">
        {index && <span className="index">{index}</span>}
        <h2>{title}</h2>
        <div className="rule" />
        {aux && <span className="aux">{aux}</span>}
      </div>
      {children}
    </section>
  );
}

export function KV({ rows }: { rows: Array<[React.ReactNode, React.ReactNode] | null | false | undefined | ""> }) {
  const real = rows.filter(Boolean) as Array<[React.ReactNode, React.ReactNode]>;
  return (
    <div className="kv panel">
      {real.map(([k, v], i) => (
        <React.Fragment key={i}>
          <div className="k">{k}</div>
          <div className="v">{v}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Tab state mirrored into the `?tab=` query param so every view is
 * deep-linkable (e.g. /object/0x5?tab=dynamic). The default tab keeps a
 * clean URL; other query params (version, epoch, …) are preserved.
 */
export function useTabParam(defaultTab: string): [string, (t: string) => void] {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? defaultTab;
  const setTab = (t: string) => {
    const next = new URLSearchParams(params);
    if (t === defaultTab) next.delete("tab");
    else next.set("tab", t);
    setParams(next, { replace: true });
  };
  return [tab, setTab];
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: string; label: string; count?: number | string }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t.id} className={`tab${t.id === active ? " active" : ""}`} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count !== undefined && <span className="n">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  color,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  color?: "amber" | "blue" | "violet";
}) {
  return (
    <div className={`stat${color ? ` ${color}` : ""}`}>
      <div className="k">{label}</div>
      <div className="v">{value}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

/** Cursor pager driven by PageInfo from the SDK. */
// ── column sorting ──────────────────────────────────────────────────────────

export type SortDir = "asc" | "desc";

export function useSort<K extends string>(initialKey: K, initialDir: SortDir = "desc") {
  const [key, setKey] = useState<K>(initialKey);
  const [dir, setDir] = useState<SortDir>(initialDir);
  return {
    key,
    dir,
    toggle: (k: K, firstDir: SortDir = "desc") => {
      if (k === key) setDir((d) => (d === "desc" ? "asc" : "desc"));
      else {
        setKey(k);
        setDir(firstDir);
      }
    },
  };
}

/** Null-safe comparator for the mixed value types in chain tables (nulls sort last). */
export function cmpValues(a: unknown, b: unknown, dir: SortDir): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  let base: number;
  if (typeof a === "bigint" && typeof b === "bigint") base = a > b ? 1 : a < b ? -1 : 0;
  else if (typeof a === "number" && typeof b === "number") base = a - b;
  else base = String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
  return dir === "asc" ? base : -base;
}

/** Clickable, sort-aware table header cell. */
export function SortTh<K extends string>({
  colKey,
  sort,
  numeric,
  firstDir,
  children,
}: {
  colKey: K;
  sort: ReturnType<typeof useSort<K>>;
  numeric?: boolean;
  firstDir?: SortDir;
  children: React.ReactNode;
}) {
  const active = sort.key === colKey;
  return (
    <th
      className={numeric ? "num" : undefined}
      style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
      title="click to sort"
      onClick={() => sort.toggle(colKey, firstDir)}
    >
      {children}{" "}
      <span style={{ color: active ? "var(--teal)" : "var(--ink-faint)", fontSize: 8 }}>
        {active ? (sort.dir === "desc" ? "▼" : "▲") : "⇅"}
      </span>
    </th>
  );
}

/** ◀ / ▶ stepping between numbered entities (checkpoints, epochs). */
export function PrevNext({
  current,
  base,
  max,
  label,
}: {
  current: bigint;
  base: string;
  max?: bigint | null;
  label: string;
}) {
  const prev = current > 0n ? current - 1n : null;
  const next = max == null || current < max ? current + 1n : null;
  const btnStyle: React.CSSProperties = { padding: "4px 10px", fontSize: 12 };
  return (
    <span style={{ display: "inline-flex", gap: 5 }}>
      {prev != null ? (
        <Link className="btn ghost" style={btnStyle} to={`${base}/${prev}`} title={`${label} ${prev}`}>
          ◀
        </Link>
      ) : (
        <button className="btn ghost" style={btnStyle} disabled>
          ◀
        </button>
      )}
      {next != null ? (
        <Link className="btn ghost" style={btnStyle} to={`${base}/${next}`} title={`${label} ${next}`}>
          ▶
        </Link>
      ) : (
        <button className="btn ghost" style={btnStyle} disabled title="already at the latest">
          ▶
        </button>
      )}
    </span>
  );
}

export function Pager({
  hasNext,
  onNext,
  onReset,
  page,
  loading,
}: {
  hasNext: boolean;
  onNext: () => void;
  onReset?: () => void;
  page: number;
  loading?: boolean;
}) {
  return (
    <div className="pager">
      <span>page {page + 1}</span>
      {onReset && page > 0 && (
        <button className="btn ghost" onClick={onReset}>
          ⇤ first
        </button>
      )}
      <button className="btn ghost" disabled={!hasNext || loading} onClick={onNext}>
        {loading ? <Spinner /> : "next ⇥"}
      </button>
    </div>
  );
}

/** Show heavy/technical content (BCS dumps, raw JSON) behind a toggle. */
export function Collapse({
  label,
  children,
  defaultOpen = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button className="btn ghost" style={{ padding: "4px 10px" }} onClick={() => setOpen((v) => !v)}>
        {open ? "▾" : "▸"} {label}
      </button>
      {open && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}

/** Tiny dependency-free sparkline. */
export function Sparkline({
  values,
  width = 220,
  height = 42,
  color = "var(--teal)",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / span) * (height - 10);
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={`${d} L${width - 2},${height - 2} L2,${height - 2} Z`} fill={color} opacity={0.07} stroke="none" />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.4} fill={color} />
    </svg>
  );
}

// Formatting helpers. All chain integers arrive as bigint (u64) or as decimal
// strings from the GraphQL layer; everything here is bigint-safe.

const NANOS_PER_IOTA = 1_000_000_000n;

export function toBig(v: bigint | number | string | null | undefined): bigint | null {
  if (v === null || v === undefined) return null;
  try {
    return BigInt(v);
  } catch {
    return null;
  }
}

/** Group digits: 1234567 → "1,234,567". Works on bigint/string/number. */
export function fmtInt(v: bigint | number | string | null | undefined): string {
  const b = toBig(v);
  if (b === null) return "—";
  const neg = b < 0n;
  const s = (neg ? -b : b).toString();
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + grouped;
}

/** Nanos → IOTA with up to `maxFrac` decimals, trimming trailing zeros. */
export function fmtIota(
  nanos: bigint | number | string | null | undefined,
  opts: { maxFrac?: number; unit?: boolean } = {},
): string {
  const b = toBig(nanos);
  if (b === null) return "—";
  const { maxFrac = 4, unit = true } = opts;
  const neg = b < 0n;
  const abs = neg ? -b : b;
  const whole = abs / NANOS_PER_IOTA;
  const frac = abs % NANOS_PER_IOTA;
  let fracStr = frac.toString().padStart(9, "0").slice(0, maxFrac).replace(/0+$/, "");
  const head = fmtInt(whole);
  return `${neg ? "-" : ""}${head}${fracStr ? "." + fracStr : ""}${unit ? " IOTA" : ""}`;
}

/** Compact large numbers: 721603100 → "721.6M". */
export function fmtCompact(v: bigint | number | string | null | undefined): string {
  const b = toBig(v);
  if (b === null) return "—";
  const n = Number(b);
  if (!Number.isFinite(n)) return fmtInt(b);
  if (n < 10_000) return fmtInt(b);
  const units = ["", "K", "M", "B", "T"];
  let u = 0;
  let x = n;
  while (x >= 1000 && u < units.length - 1) {
    x /= 1000;
    u++;
  }
  return `${x.toFixed(x >= 100 ? 0 : 1)}${units[u]}`;
}

export function truncMiddle(s: string, head = 6, tail = 6): { head: string; mid: string; tail: string } | null {
  if (s.length <= head + tail + 2) return null;
  return { head: s.slice(0, head), mid: "…", tail: s.slice(s.length - tail) };
}

/**
 * Normalise a timestamp to epoch ms. Accepts bigint/number ms, decimal-string
 * ms, or RFC3339 strings (GraphQL DateTime). Returns null when unparseable —
 * callers must render a placeholder instead of crashing on Invalid Date.
 */
export function toMs(v: bigint | number | string | null | undefined): number | null {
  if (v == null) return null;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (/^\d+$/.test(v)) return Number(v);
  const parsed = Date.parse(v);
  return Number.isNaN(parsed) ? null : parsed;
}

/** ms timestamp (bigint/string/number/RFC3339) → relative "12s ago" */
export function timeAgo(ms: bigint | number | string | null | undefined): string {
  const t = toMs(ms);
  if (t === null) return "—";
  const diff = Date.now() - t;
  const future = diff < 0;
  const d = Math.abs(diff);
  const fmt = (n: number, u: string) => `${n}${u}${future ? " from now" : " ago"}`;
  if (d < 1500) return "just now";
  if (d < 60_000) return fmt(Math.floor(d / 1000), "s");
  if (d < 3_600_000) return fmt(Math.floor(d / 60_000), "m");
  if (d < 86_400_000) return fmt(Math.floor(d / 3_600_000), "h");
  return fmt(Math.floor(d / 86_400_000), "d");
}

export function fmtTimestamp(ms: bigint | number | string | null | undefined): string {
  const b = toBig(ms);
  if (b === null) return "—";
  const d = new Date(Number(b));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().replace("T", " ").replace(".000Z", " UTC").replace("Z", " UTC");
}

/** RFC3339 string → "2026-06-12 10:21:09 UTC" */
export function fmtRfc3339(s: string | null | undefined): string {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}

export function rfc3339Ms(s: string | null | undefined): number | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export function durationBetween(aMs: number, bMs: number): string {
  let d = Math.abs(bMs - aMs);
  const h = Math.floor(d / 3_600_000);
  d -= h * 3_600_000;
  const m = Math.floor(d / 60_000);
  d -= m * 60_000;
  const s = Math.floor(d / 1000);
  if (h > 48) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** JSON.stringify that survives bigint, Map, ArrayBuffer and SDK class instances. */
export function safeJson(v: unknown, space = 2): string {
  return JSON.stringify(
    v,
    (_k, val) => {
      if (typeof val === "bigint") return val.toString();
      if (val instanceof Map) return Object.fromEntries(val);
      if (val instanceof ArrayBuffer) return bytesToHex(new Uint8Array(val));
      if (val instanceof Uint8Array) return bytesToHex(val);
      if (val && typeof val === "object") {
        // SDK wrapper classes (Address, ObjectId, Digest…) expose conversion methods
        const o = val as Record<string, unknown>;
        if (typeof o.toHex === "function") return (o.toHex as () => string)();
        if (typeof o.toBase58 === "function") return (o.toBase58 as () => string)();
      }
      return val;
    },
    space,
  );
}

export function bytesToHex(bytes: Uint8Array | ArrayBuffer | number[]): string {
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : Uint8Array.from(bytes as ArrayLike<number>);
  let out = "0x";
  for (const b of arr) out += b.toString(16).padStart(2, "0");
  return out;
}

export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** "0x2::coin::Coin<0x2::iota::IOTA>" → { pkg, module, name, generics } */
/**
 * Unwrap the FFI ObjectType Display wrapper: "Struct(0x…::m::N)" → "0x…::m::N",
 * "Package" stays as-is. Without this, non-framework types render as an
 * uninformative truncated hex blob.
 */
export function normalizeTypeTag(t: string): string {
  const m = t.match(/^Struct\((.*)\)$/s);
  return m ? m[1] : t;
}

export function splitTypeTag(t: string): { pkg: string; module: string; name: string; generics: string | null } | null {
  const m = normalizeTypeTag(t).match(/^(0x[0-9a-fA-F]+)::([^:<]+)::([^<]+)(<.*>)?$/);
  if (!m) return null;
  return { pkg: m[1], module: m[2], name: m[3], generics: m[4] ?? null };
}

/** Shorten a type for pills: 0x2::coin::Coin<0x2::iota::IOTA> → coin::Coin<…IOTA> */
export function shortType(t: string): string {
  const norm = normalizeTypeTag(t);
  const p = splitTypeTag(norm);
  if (!p) return norm.length > 48 ? norm.slice(0, 45) + "…" : norm;
  let g = "";
  if (p.generics) {
    const inner = p.generics.slice(1, -1);
    const last = inner.split("::").pop() ?? inner;
    g = `<${inner.length > 22 ? "…" + last.slice(-18) : inner}>`;
  }
  return `${p.module}::${p.name}${g}`;
}

export function gasTotal(gas: {
  computationCost: bigint;
  storageCost: bigint;
  storageRebate: bigint;
}): bigint {
  return gas.computationCost + gas.storageCost - gas.storageRebate;
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** Basis points (string|number) → "2.00%" */
export function fmtBps(v: string | number | bigint | null | undefined): string {
  const b = toBig(v);
  if (b === null) return "—";
  return `${(Number(b) / 100).toFixed(2)}%`;
}

/**
 * IIP-8 dynamic minimum commission (protocol ≥ 20): the commission actually
 * charged is floored at the validator's voting power —
 * max(commissionRate, votingPower), both in basis points. Mirrors
 * validator_set.move / the GraphQL `effectiveCommissionRate` field.
 */
export function effectiveCommissionBps(
  commission: number | null | undefined,
  votingPower: number | null | undefined,
  protocolVersion?: bigint | number | string | null,
): number | null {
  if (commission == null) return null;
  const pv = toBig(protocolVersion ?? null);
  const iip8Active = pv == null ? true : pv >= 20n; // every live network is ≥ 20
  if (!iip8Active || votingPower == null) return commission;
  return Math.max(commission, votingPower);
}

// ── package id prettification ───────────────────────────────────────────────

/** Well-known system packages → their common names. */
export const KNOWN_PACKAGES: Record<string, string> = {
  "0x0000000000000000000000000000000000000000000000000000000000000001": "std",
  "0x0000000000000000000000000000000000000000000000000000000000000002": "iota",
  "0x0000000000000000000000000000000000000000000000000000000000000003": "iota_system",
  "0x000000000000000000000000000000000000000000000000000000000000107a": "stardust",
  "0x000000000000000000000000000000000000000000000000000000000000000b": "bridge",
};

/** Full 64-char package id → known name or middle-ellipsized hex. */
export function shortPackage(hex: string): string {
  const known = KNOWN_PACKAGES[hex.toLowerCase()];
  if (known) return known;
  return `${hex.slice(0, 8)}…${hex.slice(-4)}`;
}

const FULL_HEX_RE = /0x[0-9a-fA-F]{64}/g;

/**
 * Make Move type reprs readable: every embedded full-length package id
 * becomes its known name (std, iota, …) or a middle-ellipsized hex.
 * `0x…0001::ascii::String` → `std::ascii::String`. Show the original in a
 * title attribute — this is display-only and lossy.
 */
export function prettifyTypeRepr(repr: string): string {
  return repr.replace(FULL_HEX_RE, (m) => shortPackage(m));
}

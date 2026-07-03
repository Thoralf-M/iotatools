// Smart search resolution: classify free text and figure out where it leads,
// using the SDK's own parsers (Address/ObjectId/Digest) for validation.

import { Address, Digest, ObjectId, TransactionDigest } from "@iota/sdk-wasm";
import type { GraphQlClient } from "@iota/sdk-wasm";
import { checkpointSeqByDigest } from "./checkpoints";
import { pageFwd } from "./sdk";

export interface Resolution {
  to: string;
  label: string;
}

function tryParseAddress(q: string): string | null {
  try {
    return Address.fromHex(q).toHex();
  } catch {
    try {
      return Address.fromShortHex(q.startsWith("0x") ? q : `0x${q}`).toHex();
    } catch {
      return null;
    }
  }
}

function tryParseDigest(q: string): string | null {
  try {
    return Digest.fromBase58(q).toBase58();
  } catch {
    return null;
  }
}

/**
 * Resolve a query string to an explorer route. Performs lookups through the
 * SDK client where the same syntax can mean different things (object vs
 * address, transaction vs checkpoint digest).
 */
export async function resolveQuery(
  q: string,
  client: GraphQlClient,
): Promise<Resolution | null> {
  const query = q.trim();
  if (!query) return null;

  // explicit prefixes
  const pfx = query.match(/^(epoch|e|cp|checkpoint|tx|obj|addr|pkg)\s*[:#]\s*(.+)$/i);
  if (pfx) {
    const [, kind, rest] = pfx;
    const k = kind.toLowerCase();
    if ((k === "epoch" || k === "e") && /^\d+$/.test(rest)) return { to: `/epoch/${rest}`, label: `Epoch ${rest}` };
    if ((k === "cp" || k === "checkpoint") && /^\d+$/.test(rest))
      return { to: `/checkpoint/${rest}`, label: `Checkpoint ${rest}` };
    if (k === "tx") return { to: `/tx/${rest}`, label: "Transaction" };
    if (k === "obj") return { to: `/object/${rest}`, label: "Object" };
    if (k === "addr") return { to: `/address/${rest}`, label: "Address" };
    if (k === "pkg") return { to: `/package/${rest}`, label: "Package" };
  }

  // bare number → epoch if it's within the epoch range, else checkpoint.
  // Epoch ids are small (hundreds), checkpoint sequences huge (hundreds of
  // millions), so the current epoch id is a natural disambiguation point.
  // Explicit prefixes (`cp:421` / `epoch:421`) bypass the heuristic.
  if (/^\d+$/.test(query)) {
    try {
      const current = await client.epoch();
      if (current != null && BigInt(query) <= current.epochId) {
        return { to: `/epoch/${query}`, label: `Epoch ${query}` };
      }
    } catch {
      /* fall through to checkpoint */
    }
    return { to: `/checkpoint/${query}`, label: `Checkpoint ${query}` };
  }

  // *.iota name → IOTA-Names lookup
  if (/^[a-z0-9@._-]+\.iota$/i.test(query)) {
    try {
      const addr = await client.iotaNamesLookup(query.toLowerCase());
      if (addr) return { to: `/address/${addr.toHex()}`, label: `${query} → address` };
    } catch {
      /* fall through */
    }
    return null;
  }

  // Move type / function path with '::' → coin type, function calls, events
  // by type, or a package module — disambiguated against live chain data.
  if (query.includes("::")) {
    const seg = query.split("::");
    const pkg = tryParseAddress(seg[0]);
    if (pkg && seg.length >= 3) {
      // coin type? (has registered metadata)
      try {
        const meta = await client.coinMetadata(query);
        if (meta != null) return { to: `/coin/${encodeURIComponent(query)}`, label: "Coin" };
      } catch {
        /* not a coin */
      }
      // lowercase last segment → likely a function target
      const lastSeg = seg[seg.length - 1];
      if (/^[a-z]/.test(lastSeg) && !query.includes("<")) {
        return { to: `/transactions?fn=${encodeURIComponent(query)}`, label: "Transactions calling function" };
      }
      // Type name → objects of that type; the results page cross-links to
      // events with the same type, so both are one click away.
      return { to: `/objects?type=${encodeURIComponent(query)}`, label: "Objects by type" };
    }
    if (pkg && seg.length === 2) return { to: `/package/${pkg}?module=${seg[1]}`, label: "Package module" };
    return null;
  }

  // hex → object, dynamic-field container (Table/Bag UID), or address —
  // all three share the same 32-byte space, so ask the chain in that order.
  const hex = tryParseAddress(query);
  if (hex) {
    try {
      const obj = await client.object(ObjectId.fromHex(hex));
      if (obj != null) {
        const isPkg = obj.objectType().isPackage();
        return isPkg
          ? { to: `/package/${hex}`, label: "Move package" }
          : { to: `/object/${hex}`, label: "Object" };
      }
    } catch {
      /* fall through */
    }
    try {
      const dyn = await client.dynamicFields(Address.fromHex(hex), pageFwd(1));
      if (dyn.data.length > 0) {
        return { to: `/object/${hex}?tab=dynamic`, label: "Dynamic field container" };
      }
    } catch {
      /* fall through */
    }
    return { to: `/address/${hex}`, label: "Address" };
  }

  // base58 digest → transaction first, checkpoint second
  const dig = tryParseDigest(query);
  if (dig) {
    try {
      const tx = await client.transaction(TransactionDigest.fromBase58(dig));
      if (tx != null) return { to: `/tx/${dig}`, label: "Transaction" };
    } catch {
      /* fall through */
    }
    try {
      const seq = await checkpointSeqByDigest(client, dig);
      if (seq != null) return { to: `/checkpoint/${seq}`, label: "Checkpoint" };
    } catch {
      /* fall through */
    }
    return { to: `/tx/${dig}`, label: "Transaction (unindexed)" };
  }

  return null;
}

export const SEARCH_PLACEHOLDER =
  "address / object / tx digest / epoch / checkpoint / name.iota / pkg::module::Type";

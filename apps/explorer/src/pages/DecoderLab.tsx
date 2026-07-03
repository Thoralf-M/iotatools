// BCS Decoder lab — paste any chain bytes (base64 / hex / base58), decode them
// locally in wasm against every known chain type (or one you pick), and get
// the canonical serde JSON back. Includes an encoding conversion matrix and a
// standalone string converter. Nothing here touches the network except the
// "load example" button.

import { useMutation } from "@tanstack/react-query";
import {
  base64Decode,
  base64Encode,
  checkpointSummaryFromBcs,
  checkpointSummaryToJson,
  eventFromBcs,
  eventToJson,
  hexDecode,
  hexEncode,
  objectFromBcs,
  objectToJson,
  SignatureScheme,
  signedTransactionFromBcs,
  signedTransactionToJson,
  transactionEffectsFromBcs,
  transactionEffectsToJson,
  transactionFromBcs,
  transactionKindFromBcs,
  transactionKindToJson,
  TransactionBlockKindInput,
  TransactionsFilter,
  transactionToJson,
  UserSignature,
  userSignatureFromBcs,
  userSignatureToJson,
} from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { HexDump } from "../components/HexDump";
import { Info, TERMS } from "../components/Info";
import { JsonString, JsonTree } from "../components/JsonTree";
import { CopyBtn, Empty, Hash, KV, Pill, Section, Spinner } from "../components/ui";
import { fmtInt } from "../lib/format";
import { errMsg, pageBack, useClient } from "../lib/sdk";
import { kindLabel, kindTag, ptbBody, unwrapV1 } from "../lib/tx";

// ── encodings ───────────────────────────────────────────────────────────────
// The SDK ships base64/hex codecs; base58 (only used for 32-byte digests on
// chain) has no standalone helper in the ffi surface, so we carry a tiny
// bitcoin-alphabet implementation here.

const B58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Encode(bytes: Uint8Array): string {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  const digits: number[] = [];
  for (const b of bytes) {
    let carry = b;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  return "1".repeat(zeros) + digits.reverse().map((d) => B58_ALPHABET[d]).join("");
}

function base58Decode(s: string): Uint8Array {
  let zeros = 0;
  while (zeros < s.length && s[zeros] === "1") zeros++;
  const bytes: number[] = [];
  for (const ch of s) {
    const v = B58_ALPHABET.indexOf(ch);
    if (v < 0) throw new Error(`invalid base58 character '${ch}'`);
    let carry = v;
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  return new Uint8Array([...new Array<number>(zeros).fill(0), ...bytes.reverse()]);
}

type Enc = "hex" | "base64" | "base58" | "json" | "utf8";

const ENC_LABEL: Record<Enc, string> = {
  hex: "HEX",
  base64: "BASE64",
  base58: "BASE58",
  json: "JSON",
  utf8: "UTF-8",
};

/** Guess how the pasted blob is encoded. Hex wins over base64 (any bare hex is also valid base64). */
function detectEncoding(raw: string): Enc | null {
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("{") || s.startsWith("[")) return "json";
  if (/^0x[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) return "hex";
  if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) return "hex";
  if (/^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(s)) return "base58";
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(s.replace(/\s+/g, ""))) return "base64";
  return null;
}

function toBytes(raw: string, enc: Enc): Uint8Array {
  const s = raw.trim();
  switch (enc) {
    case "hex":
      return new Uint8Array(hexDecode(s.startsWith("0x") || s.startsWith("0X") ? s.slice(2) : s));
    case "base64":
      return new Uint8Array(base64Decode(s.replace(/\s+/g, "")));
    case "base58":
      return base58Decode(s);
    case "utf8":
      return new TextEncoder().encode(raw);
    default:
      throw new Error(`cannot turn ${enc} into bytes`);
  }
}

/** Exact ArrayBuffer for the ffi (views may be offset into a larger buffer). */
function toAb(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

function utf8IfPrintable(bytes: Uint8Array): string | null {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    // allow common whitespace, reject other control characters
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) return null;
    return text;
  } catch {
    return null;
  }
}

// ── typed decoders ──────────────────────────────────────────────────────────
// Each entry pairs a *FromBcs parser with its *ToJson serializer (all verified
// against the d.ts of @iota/sdk-wasm) plus locally derived identifiers.

interface DerivedRow {
  k: string;
  v: string;
  hash?: boolean;
  tip?: string;
}

interface Decoded {
  json: string;
  derived: DerivedRow[];
  note?: string;
}

interface Decoder {
  id: string;
  label: string;
  decode: (ab: ArrayBuffer) => Decoded;
}

// Auto-detect tries these in order; first clean parse wins. BCS rejects
// trailing bytes, so false positives are rare — Transaction goes first since
// it is by far the most common blob developers paste.
const DECODERS: Decoder[] = [
  {
    id: "transaction",
    label: "Transaction",
    decode(ab) {
      const tx = transactionFromBcs(ab);
      const json = transactionToJson(tx);
      const kind = unwrapV1(JSON.parse(json))?.kind;
      const ptb = ptbBody(kind);
      return {
        json,
        derived: [
          { k: "Digest", v: tx.digest().toBase58(), hash: true, tip: TERMS.digest },
          { k: "Sender", v: tx.sender().toHex(), hash: true },
          { k: "Kind", v: kindLabel(kindTag(kind)) },
          ...(ptb ? [{ k: "Commands", v: String(ptb.commands.length) }] : []),
        ],
      };
    },
  },
  {
    id: "signedTransaction",
    label: "SignedTransaction",
    decode(ab) {
      const st = signedTransactionFromBcs(ab);
      return {
        json: signedTransactionToJson(st),
        derived: [
          { k: "Digest", v: st.transaction.digest().toBase58(), hash: true, tip: TERMS.digest },
          { k: "Sender", v: st.transaction.sender().toHex(), hash: true },
          { k: "Signatures", v: String(st.signatures.length) },
        ],
      };
    },
  },
  {
    id: "effects",
    label: "TransactionEffects",
    decode(ab) {
      const fx = transactionEffectsFromBcs(ab);
      return {
        json: transactionEffectsToJson(fx),
        derived: [{ k: "Effects digest", v: fx.digest().toBase58(), hash: true, tip: TERMS.digest }],
      };
    },
  },
  {
    id: "object",
    label: "Object",
    decode(ab) {
      const obj = objectFromBcs(ab);
      return {
        json: objectToJson(obj),
        derived: [
          { k: "Object id", v: obj.id().toHex(), hash: true, tip: TERMS.objectId },
          { k: "Version", v: fmtInt(obj.version().asU64()), tip: TERMS.objectVersion },
          { k: "Digest", v: obj.digest().toBase58(), hash: true, tip: TERMS.objectDigest },
        ],
      };
    },
  },
  {
    id: "checkpoint",
    label: "CheckpointSummary",
    decode(ab) {
      const cp = checkpointSummaryFromBcs(ab);
      return {
        json: checkpointSummaryToJson(cp),
        derived: [
          { k: "Sequence", v: fmtInt(cp.sequenceNumber()), tip: TERMS.checkpointSeq },
          { k: "Epoch", v: fmtInt(cp.epoch()), tip: TERMS.epoch },
          { k: "Digest", v: cp.digest().toBase58(), hash: true, tip: TERMS.checkpointDigest },
        ],
      };
    },
  },
  {
    id: "event",
    label: "Event",
    decode(ab) {
      const ev = eventFromBcs(ab);
      return {
        json: eventToJson(ev),
        derived: [
          { k: "Event type", v: ev.type },
          { k: "Emitting module", v: `${ev.packageId.toHex()}::${ev.module}` },
          { k: "Sender", v: ev.sender.toHex(), hash: true },
        ],
      };
    },
  },
  {
    id: "signature",
    label: "UserSignature",
    decode(ab) {
      // On-chain form is BCS (length-prefixed); wallets exchange the raw
      // flag‖sig‖pubkey bytes base64-encoded — accept both.
      let sig;
      let note: string | undefined;
      try {
        sig = userSignatureFromBcs(ab);
      } catch {
        sig = UserSignature.fromBase64(base64Encode(ab));
        note = "parsed as raw flag‖signature‖pubkey bytes (wallet format), not BCS";
      }
      return {
        json: userSignatureToJson(sig),
        note,
        derived: [{ k: "Scheme", v: SignatureScheme[Number(sig.scheme())] ?? `scheme ${sig.scheme()}`, tip: TERMS.signatureScheme }],
      };
    },
  },
  {
    id: "kind",
    label: "TransactionKind",
    decode(ab) {
      const kind = transactionKindFromBcs(ab);
      const json = transactionKindToJson(kind);
      const parsed = JSON.parse(json);
      const ptb = ptbBody(parsed);
      return {
        json,
        derived: [
          { k: "Kind", v: kindLabel(kindTag(parsed)), tip: TERMS.txKind },
          ...(ptb ? [{ k: "Commands", v: String(ptb.commands.length) }] : []),
        ],
      };
    },
  },
];

// ── conversion matrix ───────────────────────────────────────────────────────

function ConversionMatrix({ bytes }: { bytes: Uint8Array }) {
  const ab = toAb(bytes);
  const utf8 = utf8IfPrintable(bytes);
  const rows: Array<{ label: React.ReactNode; value: string | null }> = [
    { label: "hex", value: "0x" + hexEncode(ab) },
    { label: <Info tip={TERMS.base64}>base64</Info>, value: base64Encode(ab) },
    { label: <Info tip={TERMS.base58}>base58</Info>, value: base58Encode(bytes) },
    { label: "utf-8", value: utf8 },
  ];
  return (
    <div className="panel tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>ENCODING</th>
            <th>VALUE · {fmtInt(bytes.length)} bytes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="dim" style={{ whiteSpace: "nowrap" }}>
                {r.label}
              </td>
              <td className="mono" style={{ whiteSpace: "normal", overflowWrap: "anywhere", maxWidth: 720 }}>
                {r.value == null ? (
                  <span className="faint">not printable</span>
                ) : (
                  <>
                    {r.value.length > 600 ? r.value.slice(0, 580) + `… (+${r.value.length - 580})` : r.value} <CopyBtn text={r.value} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── string converter ────────────────────────────────────────────────────────

function StringConverter() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState<Enc>("utf8");

  const out = useMemo(() => {
    if (!text.trim() && from !== "utf8") return null;
    if (!text) return null;
    try {
      return { bytes: toBytes(text, from), error: null as string | null };
    } catch (e) {
      return { bytes: null, error: errMsg(e) };
    }
  }, [text, from]);

  return (
    <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="field" style={{ flex: 1, minWidth: 260 }}>
          <label>input</label>
          <input
            className="input"
            value={text}
            spellCheck={false}
            placeholder="hello world · 0xdeadbeef · aGVsbG8="
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="field">
          <label>interpret as</label>
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value as Enc)}>
            <option value="utf8">utf-8 text</option>
            <option value="hex">hex</option>
            <option value="base64">base64</option>
            <option value="base58">base58</option>
          </select>
        </div>
      </div>
      {out?.error && <div className="error-note">⚠ {out.error}</div>}
      {out?.bytes && out.bytes.length > 0 && <ConversionMatrix bytes={out.bytes} />}
    </div>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

type Outcome =
  | { kind: "empty" }
  | { kind: "json"; value: unknown }
  | { kind: "badInput"; error: string }
  | {
      kind: "bytes";
      enc: Enc;
      bytes: Uint8Array;
      matched: (Decoded & { label: string }) | null;
      failures: Array<{ label: string; error: string }>;
    };

export default function DecoderLab() {
  const client = useClient();
  const [input, setInput] = useState("");
  const [typeSel, setTypeSel] = useState("auto");

  const outcome = useMemo<Outcome>(() => {
    const s = input.trim();
    if (!s) return { kind: "empty" };
    const enc = detectEncoding(s);
    if (enc === "json") {
      try {
        return { kind: "json", value: JSON.parse(s) };
      } catch (e) {
        return { kind: "badInput", error: `looks like JSON but does not parse: ${errMsg(e)}` };
      }
    }
    if (enc == null) return { kind: "badInput", error: "unrecognized encoding — expected hex (0x… or bare), base64, base58 or JSON" };
    let bytes: Uint8Array;
    try {
      bytes = toBytes(s, enc);
    } catch (e) {
      return { kind: "badInput", error: `failed to decode ${ENC_LABEL[enc]}: ${errMsg(e)}` };
    }
    if (bytes.length === 0) return { kind: "badInput", error: "decoded to zero bytes" };
    const ab = toAb(bytes);
    const candidates = typeSel === "auto" ? DECODERS : DECODERS.filter((d) => d.id === typeSel);
    const failures: Array<{ label: string; error: string }> = [];
    for (const d of candidates) {
      try {
        const decoded = d.decode(ab);
        return { kind: "bytes", enc, bytes, matched: { ...decoded, label: d.label }, failures };
      } catch (e) {
        failures.push({ label: d.label, error: errMsg(e) });
      }
    }
    return { kind: "bytes", enc, bytes, matched: null, failures };
  }, [input, typeSel]);

  const example = useMutation({
    mutationFn: async () => {
      const page = await client.transactions(
        TransactionsFilter.new({ kind: TransactionBlockKindInput.ProgrammableTx }),
        pageBack(1),
      );
      const tx = page.data[0]?.transaction;
      if (tx == null) throw new Error("no recent programmable transaction found on this network");
      return tx.toBase64();
    },
    onSuccess: (b64) => {
      setInput(b64);
      setTypeSel("auto");
    },
  });

  return (
    <>
      <div className="page-head">
        <div className="crumbs">LAB / DECODE</div>
        <h1>
          BCS DECODER <Pill color="teal">WASM · LOCAL</Pill>
        </h1>
        <div className="sub">
          <Info tip={TERMS.bcs}>
            paste any chain bytes — transactions, effects, objects, events — and decode them to typed JSON entirely in your browser
          </Info>
        </div>
      </div>

      <Section
        index="01"
        title="Input"
        aux={
          outcome.kind === "bytes"
            ? `${ENC_LABEL[outcome.enc]} detected · ${fmtInt(outcome.bytes.length)} bytes`
            : outcome.kind === "json"
              ? "JSON detected"
              : "base64 / hex / base58 / JSON"
        }
      >
        <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            className="code"
            rows={7}
            spellCheck={false}
            placeholder="AAACACBxv5…  (base64)   ·   0x000003…  (hex)   ·   8EGPaKEs…  (base58 digest)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field">
              <label>decode as</label>
              <select className="input" value={typeSel} onChange={(e) => setTypeSel(e.target.value)}>
                <option value="auto">auto-detect</option>
                {DECODERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn ghost" disabled={example.isPending} onClick={() => example.mutate()}>
              {example.isPending ? <Spinner /> : "load example"}
            </button>
            {input && (
              <button className="btn ghost" onClick={() => setInput("")}>
                clear
              </button>
            )}
            <span className="faint mono" style={{ fontSize: 11 }}>
              example = latest programmable tx from the network, as base64 BCS
            </span>
          </div>
          {example.error != null && <div className="error-note">⚠ {errMsg(example.error)}</div>}
        </div>
      </Section>

      {outcome.kind === "empty" && <Empty>paste bytes above — everything is decoded locally, nothing leaves your browser</Empty>}

      {outcome.kind === "badInput" && (
        <Section index="02" title="Decoded">
          <div className="error-note">⚠ {outcome.error}</div>
        </Section>
      )}

      {outcome.kind === "json" && (
        <Section index="02" title="Decoded" aux="input is already JSON — nothing to BCS-decode">
          <div style={{ marginBottom: 10 }}>
            <Pill color="amber">JSON PASSTHROUGH</Pill>
          </div>
          <JsonTree data={outcome.value} />
        </Section>
      )}

      {outcome.kind === "bytes" && (
        <>
          {outcome.matched ? (
            <Section
              index="02"
              title="Decoded"
              aux={typeSel === "auto" ? `auto-detect tried ${outcome.failures.length + 1} type(s)` : "explicit type"}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                <Pill color="teal">✓ {outcome.matched.label.toUpperCase()}</Pill>
                <span className="faint mono" style={{ fontSize: 11 }}>
                  {outcome.matched.note ?? "clean BCS parse — all bytes consumed"}
                </span>
              </div>
              {outcome.matched.derived.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <KV
                    rows={outcome.matched.derived.map((d) => [
                      d.tip ? <Info tip={d.tip}>{d.k}</Info> : d.k,
                      d.hash ? <Hash value={d.v} full /> : <span className="mono">{d.v}</span>,
                    ])}
                  />
                  <div className="faint mono" style={{ fontSize: 10.5, marginTop: 6 }}>
                    identifiers above (digest, sender, …) are derived locally in wasm from the pasted bytes — no indexer involved
                  </div>
                </div>
              )}
              <JsonString json={outcome.matched.json} />
            </Section>
          ) : (
            <Section index="02" title="Decoded" aux="no type matched">
              <div className="error-note" style={{ marginBottom: 10 }}>
                ⚠ the bytes did not parse as any of the {outcome.failures.length} attempted types — per-type errors below
              </div>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>PARSE ERROR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcome.failures.map((f) => (
                      <tr key={f.label}>
                        <td>
                          <Pill color="coral">{f.label}</Pill>
                        </td>
                        <td className="dim" style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                          {f.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          <Section index="03" title="Bytes" aux={`${fmtInt(outcome.bytes.length)} bytes · input read as ${ENC_LABEL[outcome.enc]}`}>
            <HexDump bytes={outcome.bytes} />
            <div style={{ marginTop: 10 }}>
              <ConversionMatrix bytes={outcome.bytes} />
            </div>
          </Section>
        </>
      )}

      <Section index="04" title="String converter" aux="arbitrary bytes/strings · all encodings at once">
        <StringConverter />
      </Section>
    </>
  );
}

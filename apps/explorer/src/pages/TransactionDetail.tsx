// Transaction detail — the developer view of a transaction:
//  · typed overview (status, sender, gas, expiration, balance changes)
//  · full PTB breakdown (inputs + commands with argument wiring and
//    result-chaining, heuristic pure-input decoding)
//  · effects (changed objects with Move types, gas, dependencies), events
//  · signatures with public key extraction and address derivation in wasm
//  · canonical serde JSON and raw BCS, with the digest re-derived locally
//    in wasm from the BCS bytes as an integrity check.

import { useQuery } from "@tanstack/react-query";
import {
  TransactionDigest,
  EventFilter,
  SignatureScheme,
  signedTransactionToJson,
  Transaction,
  transactionEffectsToJson,
  transactionToJson,
  userSignatureToBcs,
  userSignatureToJson,
} from "@iota/sdk-wasm";
import type { UserSignatureInterface } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HexDump } from "../components/HexDump";
import { Info, TERMS } from "../components/Info";
import { JsonString, JsonTree } from "../components/JsonTree";
import {
  AddressLink,
  Age,
  Amount,
  Collapse,
  CopyBtn,
  Empty,
  ErrorNote,
  Hash,
  KV,
  LoadingBlock,
  ObjectLink,
  OwnerBadge,
  Pill,
  Section,
  StatusPill,
  Tabs,
  TxLink,
  TypePill,
  useTabParam,
} from "../components/ui";
import { base64ToBytes, bytesToHex, fmtInt, fmtIota, fmtTimestamp, shortType, timeAgo } from "../lib/format";
import { txExtras } from "../lib/gql";
import { pageFwd, useClient, useNetwork } from "../lib/sdk";
import { argLabel, commandViews, effectsView, kindLabel, kindTag, netGas, ptbBody, unwrapV1 } from "../lib/tx";

const SCHEME_LABELS: Record<number, string> = {
  [SignatureScheme.Ed25519]: "Ed25519",
  [SignatureScheme.Secp256k1]: "Secp256k1",
  [SignatureScheme.Secp256r1]: "Secp256r1",
  [SignatureScheme.Multisig]: "Multisig",
  [SignatureScheme.Bls12381]: "BLS12-381",
  [SignatureScheme.PasskeyAuthenticator]: "Passkey",
  [SignatureScheme.MoveAuthenticator]: "MoveAuthenticator",
};

function useTx(digest: string) {
  const client = useClient();
  const { network } = useNetwork();
  return useQuery({
    queryKey: [network, "tx", digest],
    queryFn: async () => {
      const d = TransactionDigest.fromBase58(digest);
      const [signed, fx, events, extras] = await Promise.all([
        client.transaction(d),
        client.transactionEffects(d),
        client.events(EventFilter.new({ transactionDigest: digest }), pageFwd(50)).catch(() => null),
        // GraphQL extras (timestamp, checkpoint, balance changes, object
        // types) are best-effort — the page must work without them.
        txExtras(client, digest).catch(() => null),
      ]);
      if (signed == null) throw new Error(`transaction ${digest} not found on this network (it may not be indexed yet)`);
      const tx = signed.transaction;
      const txJsonStr = transactionToJson(tx);
      const fxJsonStr = fx ? transactionEffectsToJson(fx) : null;
      const bcsBase64 = tx.toBase64();
      const bytes = base64ToBytes(bcsBase64);
      // Integrity check: parse the BCS back through the wasm SDK and re-derive
      // the digest locally (Blake2b over intent ∥ BCS) — no trust in the indexer.
      let derived: string | null = null;
      try {
        derived = Transaction.fromBase64(bcsBase64).digest().toBase58();
      } catch {
        derived = null;
      }
      return {
        signed,
        fx,
        events: events?.data ?? [],
        extras,
        txJson: unwrapV1(JSON.parse(txJsonStr)),
        txJsonStr,
        fxView: fxJsonStr ? effectsView(JSON.parse(fxJsonStr)) : null,
        fxJsonStr,
        bytes,
        derived,
        verified: derived === digest,
      };
    },
  });
}

// ── pure-input heuristics ────────────────────────────────────────────────────

/** Little-endian unsigned bigint from raw bytes. */
function leUint(bytes: Uint8Array): bigint {
  let v = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(bytes[i]);
  return v;
}

function isPrintable(bytes: Uint8Array): boolean {
  if (bytes.length === 0) return false;
  for (const b of bytes) if (b < 0x20 || b > 0x7e) return false;
  return true;
}

/** Heuristic decodings of a Pure input's BCS bytes — guesses, not facts. */
function decodePure(bytes: Uint8Array): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = [];
  const n = bytes.length;
  if (n === 1) {
    out.push({ label: "u8", value: String(bytes[0]) });
    if (bytes[0] === 0 || bytes[0] === 1) out.push({ label: "bool", value: bytes[0] === 1 ? "true" : "false" });
  } else if (n === 2) out.push({ label: "u16", value: fmtInt(leUint(bytes)) });
  else if (n === 4) out.push({ label: "u32", value: fmtInt(leUint(bytes)) });
  else if (n === 8) out.push({ label: "u64", value: fmtInt(leUint(bytes)) });
  else if (n === 16) out.push({ label: "u128", value: fmtInt(leUint(bytes)) });
  else if (n === 32) out.push({ label: "address/u256", value: bytesToHex(bytes) });
  // ULEB(short)-prefixed string: first byte = remaining length, rest printable.
  const dec = (b: Uint8Array) => {
    let s = "";
    for (const x of b) s += String.fromCharCode(x);
    return s.length > 80 ? s.slice(0, 77) + "…" : s;
  };
  if (n > 1 && bytes[0] === n - 1 && isPrintable(bytes.slice(1))) {
    out.push({ label: "string?", value: `"${dec(bytes.slice(1))}"` });
  } else if (n > 1 && isPrintable(bytes)) {
    out.push({ label: "string?", value: `"${dec(bytes)}"` });
  }
  return out;
}

// ── result chaining ──────────────────────────────────────────────────────────

// Argument lists live in different fields depending on the command tag.
const ARG_FIELDS = ["arguments", "objects", "address", "coin", "amounts", "coins_to_merge", "elements", "ticket"];

function argProducer(a: any): number | null {
  if (a && typeof a === "object") {
    if ("Result" in a) return Number(a.Result);
    if ("NestedResult" in a && Array.isArray(a.NestedResult)) return Number(a.NestedResult[0]);
  }
  return null;
}

function eachArg(cmd: any, f: (a: any) => void) {
  const tag = kindTag(cmd);
  const body = cmd && typeof cmd === "object" ? (cmd[tag] ?? {}) : {};
  for (const field of ARG_FIELDS) {
    const v = body?.[field];
    if (v == null) continue;
    for (const a of Array.isArray(v) ? v : [v]) f(a);
  }
}

/** For each command index i: the list of later command indexes consuming Result(i). */
function resultConsumers(commands: any[]): number[][] {
  const usedBy: number[][] = commands.map(() => []);
  commands.forEach((cmd, j) => {
    eachArg(cmd, (a) => {
      const i = argProducer(a);
      if (i != null && Number.isFinite(i) && i >= 0 && i < usedBy.length && !usedBy[i].includes(j)) usedBy[i].push(j);
    });
  });
  return usedBy;
}

function usesGasArg(commands: any[]): boolean {
  let found = false;
  commands.forEach((cmd) => eachArg(cmd, (a) => {
    if (a === "Gas" || a === "GasCoin") found = true;
  }));
  return found;
}

// ── signatures ───────────────────────────────────────────────────────────────

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

interface MultisigMemberView {
  scheme: string;
  pubB64: string;
  weight: number;
  derived: string | null;
}

interface SigView {
  scheme: string;
  b64: string;
  bcs: Uint8Array | null;
  pubB64: string | null;
  sigB64: string | null;
  derived: string | null;
  multisig: {
    threshold: number;
    bitmap: number;
    sigCount: number;
    members: MultisigMemberView[];
  } | null;
  json: string | null;
}

/**
 * Decode a UserSignature entirely in wasm: scheme, public key, signature
 * bytes, and the address derived from the public key (Blake2b-256 over
 * flag ∥ pubkey). Every step degrades gracefully — partial info still renders.
 */
function sigView(s: UserSignatureInterface): SigView {
  const v: SigView = { scheme: "?", b64: "", bcs: null, pubB64: null, sigB64: null, derived: null, multisig: null, json: null };
  try {
    v.scheme = SCHEME_LABELS[Number(s.scheme())] ?? `scheme ${s.scheme()}`;
  } catch { /* keep placeholder */ }
  try {
    v.b64 = s.toBase64();
  } catch { /* ignore */ }
  try {
    v.bcs = new Uint8Array(userSignatureToBcs(s));
  } catch { /* ignore */ }
  try {
    v.json = userSignatureToJson(s);
  } catch { /* ignore */ }
  // The as*() accessors throw for non-matching variants — each probe is
  // wrapped so we fall through to the next scheme.
  try {
    const simple = s.asSimple();
    if (simple) {
      const pk = simple.ed25519PubKeyOpt() ?? simple.secp256k1PubKeyOpt() ?? simple.secp256r1PubKeyOpt() ?? null;
      if (pk) {
        v.pubB64 = bytesToBase64(new Uint8Array(pk.toBytes()));
        v.derived = pk.deriveAddress().toHex();
      }
      const sg = simple.ed25519SigOpt() ?? simple.secp256k1SigOpt() ?? simple.secp256r1SigOpt() ?? null;
      if (sg) v.sigB64 = bytesToBase64(new Uint8Array(sg.toBytes()));
    }
  } catch { /* derivation unavailable for this scheme */ }
  try {
    const ms = s.asMultisig();
    if (ms) {
      const committee = ms.committee();
      const members: MultisigMemberView[] = committee.members().map((m) => {
        const pk = m.publicKey();
        let derived: string | null = null;
        for (const probe of [() => pk.asEd25519(), () => pk.asSecp256k1(), () => pk.asSecp256r1(), () => pk.asPasskey()]) {
          try {
            derived = probe().deriveAddress().toHex();
            break;
          } catch { /* wrong variant — try the next */ }
        }
        let scheme = "?";
        try {
          scheme = SCHEME_LABELS[Number(pk.scheme())] ?? "?";
        } catch { /* ignore */ }
        return { scheme, pubB64: pk.toBase64(), weight: Number(m.weight()), derived };
      });
      // The multisig address is derived from the whole committee
      // (flag 0x03 ∥ threshold ∥ members).
      v.derived = committee.deriveAddress().toHex();
      v.multisig = {
        threshold: Number(committee.threshold()),
        bitmap: Number(ms.bitmap()),
        sigCount: ms.signatures().length,
        members,
      };
    }
  } catch { /* fall back to JSON below */ }
  try {
    const pa = s.asPasskeyAuthenticator();
    if (pa) {
      const pk = pa.publicKey();
      v.derived = pk.deriveAddress().toHex();
      v.pubB64 = bytesToBase64(new Uint8Array(pk.inner().toBytes()));
      const inner = pa.signature().secp256r1SigOpt();
      if (inner) v.sigB64 = bytesToBase64(new Uint8Array(inner.toBytes()));
    }
  } catch { /* ignore */ }
  return v;
}

function SignatureCard({ s, idx, sender, gasOwner }: { s: UserSignatureInterface; idx: number; sender: string; gasOwner: string | null }) {
  const v = sigView(s);
  const isSender = v.derived != null && v.derived === sender;
  const isGasOwner = v.derived != null && gasOwner != null && v.derived === gasOwner && v.derived !== sender;
  const decoded = v.pubB64 != null || v.multisig != null;
  return (
    <div className="cmd-card">
      <div className="cmd-head">
        <span className="idx">#{idx}</span>
        <Pill color="blue">{v.scheme}</Pill>
        {isSender && <Pill color="teal">SENDER ✓</Pill>}
        {isGasOwner && <Pill color="amber">GAS OWNER ✓</Pill>}
      </div>
      <div className="cmd-body">
        <KV
          rows={[
            v.pubB64 != null && [
              "Public key",
              <span className="mono" style={{ overflowWrap: "anywhere" }}>
                {v.pubB64} <CopyBtn text={v.pubB64} />
              </span>,
            ],
            v.derived != null && [
              <Info tip={TERMS.derivedAddress}>Derived address</Info>,
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <AddressLink addr={v.derived} full />
                {isSender && <Pill color="teal">SENDER ✓</Pill>}
                {isGasOwner && <Pill color="amber">GAS OWNER ✓</Pill>}
              </span>,
            ],
            v.sigB64 != null && [
              "Signature bytes",
              <span className="mono" style={{ overflowWrap: "anywhere" }}>
                {v.sigB64} <CopyBtn text={v.sigB64} />
              </span>,
            ],
            v.b64 !== "" && [
              <Info tip={TERMS.signature}>Full signature</Info>,
              <span className="mono" style={{ overflowWrap: "anywhere" }}>
                {v.b64} <CopyBtn text={v.b64} />
              </span>,
            ],
          ]}
        />
        {v.multisig && (
          <div style={{ marginTop: 10 }}>
            <div className="dim" style={{ marginBottom: 6 }}>
              <Info tip={TERMS.multisig}>committee</Info> · threshold {v.multisig.threshold} · bitmap 0b
              {v.multisig.bitmap.toString(2)} · {v.multisig.sigCount} member signature{v.multisig.sigCount === 1 ? "" : "s"}
            </div>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SCHEME</th>
                    <th>PUBLIC KEY</th>
                    <th>WEIGHT</th>
                    <th>MEMBER ADDRESS</th>
                  </tr>
                </thead>
                <tbody>
                  {v.multisig.members.map((m, i) => (
                    <tr key={i}>
                      <td className="dim">{i}</td>
                      <td>
                        <Pill color="blue">{m.scheme}</Pill>
                      </td>
                      <td className="mono" style={{ whiteSpace: "normal", overflowWrap: "anywhere", maxWidth: 420 }}>
                        {m.pubB64} <CopyBtn text={m.pubB64} />
                      </td>
                      <td>{m.weight}</td>
                      <td>{m.derived ? <AddressLink addr={m.derived} /> : <span className="faint">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!decoded && v.json && (
          <div style={{ marginTop: 10 }}>
            <div className="dim" style={{ marginBottom: 6 }}>
              decoded JSON (derivation unavailable for this scheme)
            </div>
            <JsonString json={v.json} />
          </div>
        )}
        {v.bcs && (
          <div style={{ marginTop: 10 }}>
            <Collapse label={<Info tip={TERMS.bcs}>signature BCS ({v.bcs.length} bytes)</Info>}>
              <HexDump bytes={v.bcs} />
            </Collapse>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PTB cards ────────────────────────────────────────────────────────────────

function InputCard({ input, idx }: { input: any; idx: number }) {
  const tag = typeof input === "string" ? input : Object.keys(input ?? {})[0] ?? "?";
  const body = typeof input === "object" ? input[tag] : null;
  let content: React.ReactNode;
  if (tag === "Pure") {
    const b64 = typeof body === "string" ? body : (body?.value ?? "");
    let hex = "";
    let len = 0;
    let guesses: Array<{ label: string; value: string }> = [];
    try {
      const bytes = base64ToBytes(b64);
      len = bytes.length;
      hex = bytesToHex(bytes);
      guesses = decodePure(bytes);
    } catch {
      hex = b64;
    }
    content = (
      <>
        <span className="dim">{len}B</span> <span style={{ overflowWrap: "anywhere" }}>{hex.length > 90 ? hex.slice(0, 88) + "…" : hex}</span>
        <CopyBtn text={hex} />
        {guesses.length > 0 && (
          <div className="dim" style={{ marginTop: 3 }}>
            <Info tip={TERMS.pureInput}>decoded?</Info>{" "}
            {guesses.map((g, i) => (
              <span key={i}>
                {i > 0 && " · "}
                <span className="faint">{g.label}</span>{" "}
                <span className="mono" style={{ color: "var(--amber)", overflowWrap: "anywhere" }}>{g.value}</span>
              </span>
            ))}
          </div>
        )}
      </>
    );
  } else if (body?.object_id) {
    content = (
      <>
        <ObjectLink id={body.object_id} />
        {body.version != null && <span className="dim"> v{body.version}</span>}
        {body.initial_shared_version != null && <span className="dim"> shared@{body.initial_shared_version}</span>}
        {body.mutable != null && <Pill color={body.mutable ? "amber" : undefined}>{body.mutable ? "MUT" : "READ"}</Pill>}
      </>
    );
  } else {
    content = <span className="dim">{JSON.stringify(body)}</span>;
  }
  const color = tag === "Pure" ? undefined : tag === "Shared" ? "amber" : "blue";
  return (
    <tr>
      <td className="dim">{idx}</td>
      <td>
        <Pill color={color as any}>{tag.toUpperCase()}</Pill>
      </td>
      <td style={{ whiteSpace: "normal" }}>{content}</td>
    </tr>
  );
}

function CommandCard({ view, idx, usedBy }: { view: ReturnType<typeof commandViews>[number]; idx: number; usedBy: number[] }) {
  const { tag, target, body } = view;
  return (
    <div className="cmd-card">
      <div className="cmd-head">
        <span className="idx">#{idx}</span>
        <Pill color="teal">{tag}</Pill>
        {target && (
          <span className="mono">
            <Link to={`/package/${target.pkg}?module=${target.module}`}>
              {target.pkg.slice(0, 8)}…::{target.module}
            </Link>
            ::<b>{target.fn}</b>
            {target.typeArgs.length > 0 && <span className="dim">&lt;{target.typeArgs.map(shortType).join(", ")}&gt;</span>}
          </span>
        )}
        {usedBy.length > 0 && (
          <span className="dim">→ used by {usedBy.map((j) => `#${j}`).join(", ")}</span>
        )}
      </div>
      <div className="cmd-body">
        {tag === "MoveCall" && (
          <div>
            args: [{(body.arguments ?? []).map((a: any, i: number) => (
              <span key={i}>
                {i > 0 && ", "}
                <span style={{ color: "var(--amber)" }}>{argLabel(a)}</span>
              </span>
            ))}]
          </div>
        )}
        {tag === "TransferObjects" && (
          <div>
            objects [{(body.objects ?? []).map((a: any, i: number) => (
              <span key={i} style={{ color: "var(--amber)" }}>
                {i > 0 ? ", " : ""}
                {argLabel(a)}
              </span>
            ))}] → <span style={{ color: "var(--amber)" }}>{argLabel(body.address)}</span>
          </div>
        )}
        {tag === "SplitCoins" && (
          <div>
            split <span style={{ color: "var(--amber)" }}>{argLabel(body.coin)}</span> into [{(body.amounts ?? []).map((a: any, i: number) => (
              <span key={i} style={{ color: "var(--amber)" }}>
                {i > 0 ? ", " : ""}
                {argLabel(a)}
              </span>
            ))}]
          </div>
        )}
        {tag === "MergeCoins" && (
          <div>
            merge [{(body.coins_to_merge ?? []).map((a: any, i: number) => (
              <span key={i} style={{ color: "var(--amber)" }}>
                {i > 0 ? ", " : ""}
                {argLabel(a)}
              </span>
            ))}] into <span style={{ color: "var(--amber)" }}>{argLabel(body.coin)}</span>
          </div>
        )}
        {tag === "MakeMoveVector" && (
          <div>
            {body.type_ && <span className="dim">&lt;{shortType(String(body.type_))}&gt; </span>}
            elements: [{(body.elements ?? []).map((a: any, i: number) => (
              <span key={i} style={{ color: "var(--amber)" }}>
                {i > 0 ? ", " : ""}
                {argLabel(a)}
              </span>
            ))}]
          </div>
        )}
        {tag === "Publish" && (
          <div>
            {(body.modules ?? []).length} module{(body.modules ?? []).length === 1 ? "" : "s"} · deps: [
            {(body.dependencies ?? []).map((d: string, i: number) => (
              <span key={i}>
                {i > 0 && ", "}
                <ObjectLink id={d} />
              </span>
            ))}
            ]
          </div>
        )}
        {tag === "Upgrade" && (
          <div>
            package <ObjectLink id={String(body.package)} /> · ticket <span style={{ color: "var(--amber)" }}>{argLabel(body.ticket)}</span> ·{" "}
            {(body.modules ?? []).length} modules
          </div>
        )}
        {!["MoveCall", "TransferObjects", "SplitCoins", "MergeCoins", "MakeMoveVector", "Publish", "Upgrade"].includes(tag) && (
          <JsonTree data={body} />
        )}
      </div>
    </div>
  );
}

export default function TransactionDetail() {
  const { digest = "" } = useParams();
  const q = useTx(digest);
  const [tab, setTab] = useTabParam("overview");

  if (q.isPending) return <LoadingBlock />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { signed, events, extras, txJson, txJsonStr, fxView, fxJsonStr, bytes, derived, verified } = q.data!;

  const kind = txJson?.kind;
  const tag = kindTag(kind);
  const ptb = ptbBody(kind);
  const cmds = ptb ? commandViews(ptb.commands) : [];
  const usedBy = ptb ? resultConsumers(ptb.commands) : [];
  const gasArgUsed = ptb ? usesGasArg(ptb.commands) : false;
  const gasPay = txJson?.gas_payment;
  const sender: string = txJson?.sender ?? "";
  const gasOwner: string | null = gasPay?.owner ?? null;
  const isSystem = sender === "0x0000000000000000000000000000000000000000000000000000000000000000";
  const balanceChanges = extras?.balanceChanges ?? [];

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/transactions">TRANSACTIONS</Link> / TX
        </div>
        <h1>
          <span className="mono">TX</span>
          {fxView && <StatusPill success={fxView.success} />}
          <Info tip={TERMS.txKind}>
            <Pill color={tag === "Programmable" ? "teal" : "violet"}>{kindLabel(tag)}</Pill>
          </Info>
          {verified && (
            <Pill color="teal" title={`Digest re-derived in wasm from raw BCS: ${derived}`}>
              ✓ DIGEST VERIFIED IN WASM
            </Pill>
          )}
        </h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>
          {digest} <CopyBtn text={digest} />
        </div>
        {extras?.timestampMs != null && (
          <div className="sub dim">
            <Info tip={TERMS.checkpoint}>executed</Info> {fmtTimestamp(extras.timestampMs)} · <Age ms={extras.timestampMs} />
            {extras.checkpointSeq != null && (
              <>
                {" "}· checkpoint <Link to={`/checkpoint/${extras.checkpointSeq}`}>{fmtInt(extras.checkpointSeq)}</Link>
              </>
            )}
          </div>
        )}
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "ptb", label: "Programmable Tx", count: ptb ? `${ptb.inputs.length}·${cmds.length}` : 0 },
          { id: "effects", label: "Effects", count: fxView?.changed.length ?? 0 },
          { id: "events", label: "Events", count: events.length },
          { id: "raw", label: "Raw JSON" },
          { id: "bcs", label: "BCS", count: bytes.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <>
          <Section index="01" title="Transaction">
            <KV
              rows={[
                [<Info tip={TERMS.digest}>Digest</Info>, <Hash value={digest} full />],
                ["Status", fxView ? <StatusPill success={fxView.success} /> : <span className="faint">effects unavailable</span>],
                ["Sender", isSystem ? <Pill color="violet">SYSTEM</Pill> : <AddressLink addr={sender} full />],
                [<Info tip={TERMS.txKind}>Kind</Info>, kindLabel(tag)],
                extras?.timestampMs != null && [
                  <Info tip={TERMS.checkpoint}>Executed at</Info>,
                  <span>
                    {fmtTimestamp(extras.timestampMs)} · <Age ms={extras.timestampMs} />
                  </span>,
                ],
                extras?.checkpointSeq != null && [
                  <Info tip={TERMS.checkpoint}>Checkpoint</Info>,
                  <Link to={`/checkpoint/${extras.checkpointSeq}`}>{fmtInt(extras.checkpointSeq)}</Link>,
                ],
                fxView?.epoch != null && ["Executed in epoch", <Link to={`/epoch/${fxView.epoch}`}>{fmtInt(fxView.epoch)}</Link>],
                [
                  <Info tip={TERMS.expiration}>Expiration</Info>,
                  typeof txJson?.expiration === "string" ? txJson.expiration : JSON.stringify(txJson?.expiration),
                ],
                fxView?.lamport != null && [<Info tip={TERMS.lamport}>Lamport version</Info>, fmtInt(fxView.lamport)],
                [<Info tip={TERMS.signature}>Signatures</Info>, `${signed.signatures.length}`],
              ]}
            />
          </Section>

          {fxView?.gas && (
            <Section
              index="02"
              title="Gas"
              aux={
                gasPay ? (
                  <>
                    <Info tip={TERMS.gasBudget}>budget {fmtIota(gasPay.budget)}</Info> ·{" "}
                    <Info tip={TERMS.gasPrice}>price {fmtInt(gasPay.price)} nanos</Info>
                  </>
                ) : undefined
              }
            >
              <div className="stat-grid">
                <div className="stat amber">
                  <div className="k">
                    <Info tip={TERMS.netGas}>Net gas paid</Info>
                  </div>
                  <div className="v">
                    <Amount nanos={netGas(fxView.gas)} />
                  </div>
                  <div className="hint">computation + storage − rebate</div>
                </div>
                <div className="stat">
                  <div className="k">
                    <Info tip={TERMS.computationCost}>Computation</Info>
                  </div>
                  <div className="v"><Amount nanos={fxView.gas.computation} /></div>
                  <div className="hint">burned: {fmtIota(fxView.gas.burned)}</div>
                </div>
                <div className="stat">
                  <div className="k">
                    <Info tip={TERMS.storageCost}>Storage</Info>
                  </div>
                  <div className="v"><Amount nanos={fxView.gas.storage} /></div>
                </div>
                <div className="stat blue">
                  <div className="k">
                    <Info tip={TERMS.storageRebate}>Rebate</Info>
                  </div>
                  <div className="v"><Amount nanos={fxView.gas.rebate} /></div>
                </div>
              </div>
              {gasPay?.objects?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <KV
                    rows={[
                      ["Gas owner", <AddressLink addr={gasPay.owner} full />],
                      [
                        <Info tip={TERMS.gasCoin}>Gas coins</Info>,
                        <div>
                          {gasPay.objects.map((o: any) => (
                            <div key={o.object_id}>
                              <ObjectLink id={o.object_id} /> <span className="dim">v{o.version}</span>
                            </div>
                          ))}
                        </div>,
                      ],
                    ]}
                  />
                </div>
              )}
            </Section>
          )}

          {balanceChanges.length > 0 && (
            <Section index="03" title="Balance changes" aux={<><Info tip={TERMS.balanceChanges} /> {balanceChanges.length} entries</>}>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>OWNER</th>
                      <th>AMOUNT</th>
                      <th>COIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceChanges.map((b, i) => {
                      const neg = b.amount.startsWith("-");
                      const isIota = b.coinType.endsWith("::iota::IOTA");
                      return (
                        <tr key={i}>
                          <td>
                            <AddressLink addr={b.ownerAddress} />
                          </td>
                          <td className="mono" style={{ color: neg ? "var(--coral)" : "var(--teal)" }}>
                            {neg ? "" : "+"}
                            {isIota ? fmtIota(b.amount) : fmtInt(b.amount)}
                          </td>
                          <td>
                            <Link to={`/coin/${encodeURIComponent(b.coinType)}`}>
                              <TypePill type={b.coinType} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {!fxView?.success && fxView?.errorJson && (
            <Section index="04" title="Execution error">
              <JsonString json={fxView.errorJson} />
            </Section>
          )}

          <Section index="05" title="Signatures" aux={<><Info tip={TERMS.signature} /> decoded + address-derived in wasm</>}>
            {signed.signatures.length === 0 ? (
              <Empty>system transaction — no user signatures</Empty>
            ) : (
              signed.signatures.map((s, i) => (
                <SignatureCard key={i} s={s} idx={i} sender={sender} gasOwner={gasOwner} />
              ))
            )}
          </Section>
        </>
      )}

      {tab === "ptb" &&
        (ptb ? (
          <>
            <div className="dim" style={{ margin: "10px 0 2px" }}>
              <Info tip={TERMS.ptb}>programmable transaction block</Info>
            </div>
            <Section index="01" title="Inputs" aux={<><Info tip={TERMS.ptbInputs} /> {ptb.inputs.length} values</>}>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>TYPE</th>
                      <th>VALUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ptb.inputs.map((inp: any, i: number) => (
                      <InputCard key={i} input={inp} idx={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            <Section
              index="02"
              title="Commands"
              aux={
                <>
                  <Info tip={TERMS.ptbCommands} /> {cmds.length} commands · executed in order
                  {gasArgUsed && (
                    <>
                      {" "}· <Info tip={TERMS.gasCoin}>Gas = gas coin</Info>
                    </>
                  )}
                </>
              }
            >
              {cmds.map((c, i) => (
                <CommandCard key={i} view={c} idx={i} usedBy={usedBy[i] ?? []} />
              ))}
            </Section>
          </>
        ) : (
          <Section index="01" title={`${kindLabel(tag)} payload`}>
            <JsonTree data={kind?.[tag] ?? kind} />
          </Section>
        ))}

      {tab === "effects" &&
        (fxView ? (
          <>
            <Section index="01" title="Changed objects" aux={`${fxView.changed.length} objects`}>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>OBJECT</th>
                      <th>TYPE</th>
                      <th>OP</th>
                      <th>OWNER AFTER</th>
                      <th>NEW DIGEST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fxView.changed.map((c) => {
                      const op =
                        c.idOp === "created" ? (
                          <Pill color="teal">CREATED</Pill>
                        ) : c.idOp === "deleted" ? (
                          <Pill color="coral">DELETED</Pill>
                        ) : c.outputState === "Missing" ? (
                          <Pill color="amber">WRAPPED</Pill>
                        ) : c.isPackage ? (
                          <Pill color="violet">PACKAGE</Pill>
                        ) : (
                          <Pill>MUTATED</Pill>
                        );
                      const objType = extras?.objectTypes?.[c.objectId];
                      return (
                        <tr key={c.objectId}>
                          <td>
                            {c.isPackage ? <Hash value={c.objectId} to={`/package/${c.objectId}`} /> : <ObjectLink id={c.objectId} />}
                          </td>
                          <td>{objType ? <TypePill type={objType} /> : <span className="faint">—</span>}</td>
                          <td>{op}</td>
                          <td>{c.outputOwner ? <OwnerBadge owner={c.outputOwner} /> : <span className="faint">—</span>}</td>
                          <td>{c.outputDigest ? <Hash value={c.outputDigest} copy={false} /> : <span className="faint">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
            <Section index="02" title="Dependencies" aux="transactions this one depends on">
              {fxView.dependencies.length === 0 ? (
                <Empty>none</Empty>
              ) : (
                <div className="panel pad row" style={{ gap: 12 }}>
                  {fxView.dependencies.map((d) => (
                    <TxLink key={d} digest={d} />
                  ))}
                </div>
              )}
            </Section>
            {fxView.unchangedShared.length > 0 && (
              <Section index="03" title="Unchanged shared objects">
                <JsonTree data={fxView.unchangedShared} />
              </Section>
            )}
          </>
        ) : (
          <Empty>effects not available</Empty>
        ))}

      {tab === "events" &&
        (events.length === 0 ? (
          <Empty>no events emitted</Empty>
        ) : (
          <Section index="01" title="Events" aux={`filter: transactionDigest = ${digest.slice(0, 8)}…`}>
            {events.map((e, i) => (
              <div className="cmd-card" key={i}>
                <div className="cmd-head">
                  <span className="idx">#{i}</span>
                  <TypePill type={e.type} />
                  {e.module && (
                    <span className="dim">
                      emitted by{" "}
                      {e.packageId ? (
                        <Link to={`/package/${e.packageId.toHex()}?module=${e.module}`}>{e.module}</Link>
                      ) : (
                        e.module
                      )}
                    </span>
                  )}
                  {e.timestamp && <span className="dim">{timeAgo(e.timestamp)}</span>}
                </div>
                <div className="cmd-body">
                  <JsonString json={e.json} />
                </div>
              </div>
            ))}
          </Section>
        ))}

      {tab === "raw" && (
        <>
          <Section
            index="01"
            title="SignedTransaction · serde JSON"
            aux={<><Info tip={TERMS.rawJson} /> signedTransactionToJson(signed)</>}
          >
            <JsonString json={signedTransactionToJson(signed)} />
          </Section>
          {fxJsonStr && (
            <Section
              index="02"
              title="TransactionEffects · serde JSON"
              aux={<><Info tip={TERMS.rawJson} /> transactionEffectsToJson(fx)</>}
            >
              <JsonString json={fxJsonStr} />
            </Section>
          )}
        </>
      )}

      {tab === "bcs" && (
        <>
          <Section
            index="01"
            title="Transaction BCS"
            aux={
              <>
                <Info tip={TERMS.bcs} />{" "}
                <Info tip={TERMS.signingMessage}>digest re-derived in wasm:</Info>{" "}
                <span style={{ color: verified ? "var(--teal)" : "var(--coral)" }}>{derived ?? "n/a"}</span>
              </>
            }
          >
            <HexDump bytes={bytes} />
          </Section>
          <Section index="02" title="Base64" aux={<Info tip={TERMS.base64} />}>
            <div className="panel pad mono small" style={{ overflowWrap: "anywhere" }}>
              {signed.transaction.toBase64()} <CopyBtn text={signed.transaction.toBase64()} />
            </div>
          </Section>
        </>
      )}
    </>
  );
}

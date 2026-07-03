// Dry Run lab — execute a transaction against live chain state without
// committing anything or paying gas. Paste base64 transaction bytes (a plain
// Transaction or a SignedTransaction envelope), preview what it would do:
// effects, gas, per-command return values and mutated references.

import { useMutation } from "@tanstack/react-query";
import {
  base64Decode,
  signedTransactionFromBcs,
  signedTransactionToJson,
  Transaction,
  transactionEffectsToJson,
  TransactionBlockKindInput,
  TransactionsFilter,
  transactionToJson,
  type DryRunEffect,
  type TransactionArgument,
  type TransactionInterface,
} from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Info, TERMS } from "../components/Info";
import { JsonTree } from "../components/JsonTree";
import {
  AddressLink,
  Amount,
  Empty,
  ErrorNote,
  Hash,
  KV,
  ObjectLink,
  OwnerBadge,
  Pill,
  Section,
  Spinner,
  StatusPill,
  Tabs,
} from "../components/ui";
import { bytesToHex, fmtInt, fmtIota } from "../lib/format";
import { errMsg, pageBack, useClient } from "../lib/sdk";
import { effectsView, kindLabel, kindTag, netGas, ptbBody, unwrapV1, type EffectsView, type Json } from "../lib/tx";

// ── parsing ─────────────────────────────────────────────────────────────────

interface ParsedTx {
  tx: TransactionInterface;
  fromEnvelope: boolean;
  envelopeSigs: number;
  digest: string;
  sender: string;
  kindTag: string;
  commands: number | null;
  inputs: number | null;
}

type ParseOutcome = { ok: ParsedTx } | { error: string } | null;

function parseInput(raw: string): ParseOutcome {
  const s = raw.replace(/\s+/g, "");
  if (!s) return null;
  let tx: TransactionInterface | null = null;
  let fromEnvelope = false;
  let envelopeSigs = 0;
  let txErr: unknown = null;
  try {
    tx = Transaction.fromBase64(s);
  } catch (e) {
    txErr = e;
  }
  if (tx == null) {
    // maybe it's a SignedTransaction envelope — extract the inner transaction
    try {
      const st = signedTransactionFromBcs(base64Decode(s));
      tx = st.transaction;
      fromEnvelope = true;
      envelopeSigs = st.signatures.length;
    } catch {
      return { error: `not a Transaction (${errMsg(txErr)}) and not a SignedTransaction envelope either` };
    }
  }
  try {
    const j = unwrapV1(JSON.parse(transactionToJson(tx)));
    const kind = j?.kind;
    const ptb = ptbBody(kind);
    return {
      ok: {
        tx,
        fromEnvelope,
        envelopeSigs,
        digest: tx.digest().toBase58(),
        sender: tx.sender().toHex(),
        kindTag: kindTag(kind),
        commands: ptb ? ptb.commands.length : null,
        inputs: ptb ? ptb.inputs.length : null,
      },
    };
  } catch (e) {
    return { error: errMsg(e) };
  }
}

// ── dry-run result sanitization ─────────────────────────────────────────────
// DryRunEffect carries ffi enum instances (TransactionArgument), TypeTag
// wrappers and ArrayBuffers — flatten everything to plain JSON-able values.

function argLabelFfi(a: TransactionArgument): string {
  const tag = String((a as { tag: string }).tag);
  if (tag === "GasCoin") return "Gas";
  if (tag === "Input") return `Input(${(a as { inner: { index: number } }).inner.index})`;
  if (tag === "Result") {
    const inner = (a as { inner: { cmd: number; index: number | undefined } }).inner;
    return inner.index == null ? `Result(${inner.cmd})` : `Result(${inner.cmd})[${inner.index}]`;
  }
  return tag;
}

interface CmdResultView {
  mutated_references: Array<{ argument: string; type: string; bytes: number; bcs_hex: string }>;
  return_values: Array<{ type: string; bytes: number; bcs_hex: string }>;
}

function sanitizeResult(r: DryRunEffect): CmdResultView {
  return {
    mutated_references: r.mutatedReferences.map((m) => ({
      argument: argLabelFfi(m.input),
      type: String(m.typeTag),
      bytes: m.bcs.byteLength,
      bcs_hex: bytesToHex(new Uint8Array(m.bcs)),
    })),
    return_values: r.returnValues.map((v) => ({
      type: String(v.typeTag),
      bytes: v.bcs.byteLength,
      bcs_hex: bytesToHex(new Uint8Array(v.bcs)),
    })),
  };
}

interface RunData {
  error: string | null;
  fxView: EffectsView | null;
  fxJson: Json | null;
  results: CmdResultView[];
  signedJson: Json | null;
}

// ── command result card ─────────────────────────────────────────────────────

function CmdResultCard({ r, idx, defaultOpen }: { r: CmdResultView; idx: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cmd-card">
      <div className="cmd-head" style={{ cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        <span className="idx">{open ? "▾" : "▸"} #{idx}</span>
        <Pill color="blue">COMMAND {idx}</Pill>
        <span className="dim">
          {r.return_values.length} return value{r.return_values.length === 1 ? "" : "s"} · {r.mutated_references.length} mutated reference
          {r.mutated_references.length === 1 ? "" : "s"}
        </span>
      </div>
      {open && (
        <div className="cmd-body">
          {r.return_values.length === 0 && r.mutated_references.length === 0 ? (
            <span className="faint">no observable outputs for this command</span>
          ) : (
            <JsonTree data={r} />
          )}
        </div>
      )}
    </div>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

export default function DryRunLab() {
  const client = useClient();
  const [input, setInput] = useState("");
  const [skipChecks, setSkipChecks] = useState(false);
  const [tab, setTab] = useState("effects");

  const parsed = useMemo(() => parseInput(input), [input]);
  const tx = parsed != null && "ok" in parsed ? parsed.ok : null;

  const run = useMutation({
    mutationFn: async (vars: { tx: TransactionInterface; skip: boolean }): Promise<RunData> => {
      const res = await client.dryRunTx(vars.tx, vars.skip);
      const fxStr = res.effects != null ? transactionEffectsToJson(res.effects) : null;
      const fxJson = fxStr != null ? (JSON.parse(fxStr) as Json) : null;
      return {
        error: res.error ?? null,
        fxView: fxJson != null ? effectsView(fxJson) : null,
        fxJson,
        results: res.results.map(sanitizeResult),
        signedJson: res.transaction != null ? (JSON.parse(signedTransactionToJson(res.transaction)) as Json) : null,
      };
    },
    onSuccess: () => setTab("effects"),
  });

  const example = useMutation({
    mutationFn: async () => {
      const page = await client.transactions(
        TransactionsFilter.new({ kind: TransactionBlockKindInput.ProgrammableTx }),
        pageBack(1),
      );
      const t = page.data[0]?.transaction;
      if (t == null) throw new Error("no recent programmable transaction found on this network");
      return t.toBase64();
    },
    onSuccess: (b64) => {
      setInput(b64);
      run.reset();
    },
  });

  const d = run.data;
  const fxView = d?.fxView ?? null;

  return (
    <>
      <div className="page-head">
        <div className="crumbs">LAB / DRY RUN</div>
        <h1>
          DRY RUN <Pill color="teal">NO GAS · NO COMMIT</Pill>
        </h1>
        <div className="sub">
          <Info tip={TERMS.dryRun}>execute a transaction against live state and preview its effects — nothing is committed, no gas is paid</Info>
        </div>
      </div>

      <Section index="01" title="Transaction bytes" aux="base64 BCS · Transaction or SignedTransaction envelope">
        <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            className="code"
            rows={6}
            spellCheck={false}
            placeholder="AAACACBxv5… (base64 transaction bytes, e.g. from a wallet's signing prompt or tx.toBase64())"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              run.reset();
            }}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn" disabled={tx == null || run.isPending} onClick={() => tx != null && run.mutate({ tx: tx.tx, skip: skipChecks })}>
              {run.isPending ? <Spinner /> : "DRY RUN"}
            </button>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={skipChecks} onChange={(e) => setSkipChecks(e.target.checked)} />
              <span className="mono" style={{ fontSize: 12 }}>
                skipChecks
              </span>
              <Info tip={TERMS.devInspect} />
            </label>
            <button className="btn ghost" disabled={example.isPending} onClick={() => example.mutate()}>
              {example.isPending ? <Spinner /> : "load example"}
            </button>
            <span className="faint mono" style={{ fontSize: 11 }}>
              client.dryRunTx(tx, skipChecks)
            </span>
          </div>
          {example.error != null && <div className="error-note">⚠ {errMsg(example.error)}</div>}
        </div>
      </Section>

      {parsed != null && (
        <Section index="02" title="Parse status" aux={tx?.fromEnvelope ? "extracted from SignedTransaction envelope" : "Transaction.fromBase64"}>
          {"error" in parsed ? (
            <div className="error-note">⚠ {parsed.error}</div>
          ) : (
            <KV
              rows={[
                ["Status", <Pill color="teal">✓ PARSED{parsed.ok.fromEnvelope ? ` · ENVELOPE (${parsed.ok.envelopeSigs} sig)` : ""}</Pill>],
                [<Info tip={TERMS.digest}>Digest</Info>, <Hash value={parsed.ok.digest} full />],
                ["Sender", <AddressLink addr={parsed.ok.sender} full />],
                [<Info tip={TERMS.txKind}>Kind</Info>, kindLabel(parsed.ok.kindTag)],
                parsed.ok.commands != null && [
                  <Info tip={TERMS.ptbCommands}>Commands</Info>,
                  `${parsed.ok.commands} commands · ${parsed.ok.inputs} inputs`,
                ],
              ]}
            />
          )}
        </Section>
      )}

      {run.error != null && (
        <Section index="03" title="Dry run failed">
          <ErrorNote error={run.error} />
        </Section>
      )}

      {d != null && (
        <>
          {d.error != null && (
            <Section index="03" title="Execution error" aux="DryRunResult.error">
              <div className="error-note">⚠ {d.error}</div>
            </Section>
          )}

          <Section index="04" title="Result" aux="simulated — nothing was committed to the chain">
            <Tabs
              tabs={[
                { id: "effects", label: "Effects", count: fxView?.changed.length ?? 0 },
                { id: "commands", label: "Command results", count: d.results.length },
                { id: "raw", label: "Raw" },
              ]}
              active={tab}
              onChange={setTab}
            />

            {tab === "effects" &&
              (fxView == null ? (
                <Empty>no effects returned{d.error != null ? " — the dry run aborted before execution" : ""}</Empty>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
                    <StatusPill success={fxView.success} />
                    {fxView.epoch != null && <span className="dim mono">simulated in epoch {fmtInt(fxView.epoch)}</span>}
                  </div>

                  {!fxView.success && fxView.errorJson != null && <div className="error-note" style={{ marginBottom: 12 }}>⚠ {fxView.errorJson}</div>}

                  {fxView.gas != null && (
                    <div className="stat-grid" style={{ marginBottom: 14 }}>
                      <div className="stat amber">
                        <div className="k">
                          <Info tip={TERMS.netGas}>Net gas (would pay)</Info>
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
                        <div className="v">
                          <Amount nanos={fxView.gas.computation} />
                        </div>
                        <div className="hint">burned: {fmtIota(fxView.gas.burned)}</div>
                      </div>
                      <div className="stat">
                        <div className="k">
                          <Info tip={TERMS.storageCost}>Storage</Info>
                        </div>
                        <div className="v">
                          <Amount nanos={fxView.gas.storage} />
                        </div>
                      </div>
                      <div className="stat blue">
                        <div className="k">
                          <Info tip={TERMS.storageRebate}>Rebate</Info>
                        </div>
                        <div className="v">
                          <Amount nanos={fxView.gas.rebate} />
                        </div>
                      </div>
                    </div>
                  )}

                  {fxView.changed.length === 0 ? (
                    <Empty>no objects would change</Empty>
                  ) : (
                    <div className="panel tbl-wrap">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>OBJECT</th>
                            <th>OP</th>
                            <th>
                              <Info tip={TERMS.owner}>OWNER AFTER</Info>
                            </th>
                            <th>NEW DIGEST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fxView.changed.map((c) => {
                            const op =
                              c.idOp === "Created" || c.idOp === "created" ? (
                                <Pill color="teal">CREATED</Pill>
                              ) : c.idOp === "Deleted" || c.idOp === "deleted" ? (
                                <Pill color="coral">DELETED</Pill>
                              ) : c.outputState === "Missing" ? (
                                <Pill color="amber">WRAPPED</Pill>
                              ) : c.isPackage ? (
                                <Pill color="violet">PACKAGE</Pill>
                              ) : (
                                <Pill>MUTATED</Pill>
                              );
                            return (
                              <tr key={c.objectId}>
                                <td>
                                  <ObjectLink id={c.objectId} />
                                </td>
                                <td>{op}</td>
                                <td>
                                  <OwnerBadge owner={c.outputOwner} />
                                </td>
                                <td>{c.outputDigest != null ? <Hash value={c.outputDigest} head={6} tail={6} /> : <span className="faint">—</span>}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ))}

            {tab === "commands" &&
              (d.results.length === 0 ? (
                <Empty>no per-command results returned{skipChecks ? "" : " — try skipChecks for richer introspection"}</Empty>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div className="faint mono" style={{ fontSize: 11, marginBottom: 8 }}>
                    one entry per PTB command — BCS return values and mutated by-ref arguments, typed
                  </div>
                  {d.results.map((r, i) => (
                    <CmdResultCard key={i} r={r} idx={i} defaultOpen={d.results.length <= 3} />
                  ))}
                </div>
              ))}

            {tab === "raw" && (
              <div style={{ marginTop: 12 }}>
                <JsonTree
                  data={{
                    error: d.error,
                    effects: d.fxJson,
                    results: d.results,
                    transaction: d.signedJson,
                  }}
                />
              </div>
            )}
          </Section>
        </>
      )}

      {d == null && run.error == null && parsed == null && (
        <Empty>paste transaction bytes (or load an example), then hit DRY RUN — the network simulates it for free</Empty>
      )}
    </>
  );
}

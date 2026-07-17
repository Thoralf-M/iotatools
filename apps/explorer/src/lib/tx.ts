// Helpers over the canonical serde JSON of transactions/effects produced by
// the SDK's transactionToJson / transactionEffectsToJson (snake_case keys,
// PascalCase enum tags, u64 as decimal strings).

import { fmtInt, fmtIota } from "./format";

export type Json = Record<string, any>;

/** Unwrap the {V1: …} version envelope. */
export function unwrapV1(j: Json | null | undefined): Json | null {
  if (!j) return null;
  return (j.V1 ?? j.v1 ?? j) as Json;
}

export function kindTag(kind: Json | null | undefined): string {
  if (!kind) return "Unknown";
  if (typeof kind === "string") return kind;
  const keys = Object.keys(kind);
  return keys[0] ?? "Unknown";
}

const KIND_LABELS: Record<string, string> = {
  Programmable: "PROGRAMMABLE",
  ProgrammableTransaction: "PROGRAMMABLE",
  ProgrammableSystemTransaction: "PROG · SYSTEM",
  ConsensusCommitPrologueV1: "CONSENSUS COMMIT",
  Genesis: "GENESIS",
  ChangeEpoch: "CHANGE EPOCH",
  EndOfEpoch: "END OF EPOCH",
  RandomnessStateUpdate: "RANDOMNESS",
  AuthenticatorStateUpdateV1: "AUTHENTICATOR",
};

export function kindLabel(tag: string): string {
  return KIND_LABELS[tag] ?? tag.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
}

export function isSystemKind(tag: string): boolean {
  return tag !== "Programmable" && tag !== "ProgrammableTransaction";
}

/** Extract PTB body {inputs, commands} if this is a programmable tx. */
export function ptbBody(kind: Json | null | undefined): { inputs: any[]; commands: Json[] } | null {
  if (!kind || typeof kind !== "object") return null;
  const body = kind.Programmable ?? kind.ProgrammableTransaction;
  if (!body) return null;
  return { inputs: body.inputs ?? [], commands: body.commands ?? [] };
}

/** PTB argument → short label. "Gas" | {Input:0} | {Result:1} | {NestedResult:[a,b]} */
export function argLabel(arg: any): string {
  if (arg === "Gas" || arg === "GasCoin") return "Gas";
  if (arg && typeof arg === "object") {
    if ("Input" in arg) return `Input(${arg.Input})`;
    if ("Result" in arg) return `Result(${arg.Result})`;
    if ("NestedResult" in arg) return `Result(${arg.NestedResult[0]})[${arg.NestedResult[1]}]`;
  }
  return JSON.stringify(arg);
}

export interface CommandView {
  tag: string;
  /** for MoveCall */
  target?: { pkg: string; module: string; fn: string; typeArgs: string[] };
  body: Json;
}

export function commandViews(commands: Json[]): CommandView[] {
  return commands.map((c) => {
    const tag = kindTag(c);
    const body = typeof c === "object" ? (c[tag] ?? {}) : {};
    if (tag === "MoveCall") {
      return {
        tag,
        body,
        target: {
          pkg: body.package,
          module: body.module,
          fn: body.function,
          typeArgs: body.type_arguments ?? [],
        },
      };
    }
    return { tag, body };
  });
}

/** One-line summary of a transaction for table rows, e.g. "MoveCall pool::swap +2". */
export function summarizeKind(kind: Json | null | undefined): string {
  const tag = kindTag(kind);
  const ptb = ptbBody(kind);
  if (!ptb) return kindLabel(tag);
  const views = commandViews(ptb.commands);
  if (views.length === 0) return "PTB · empty";
  const first = views.find((v) => v.tag === "MoveCall") ?? views[0];
  let head: string;
  if (first.target) head = `${first.target.module}::${first.target.fn}`;
  else head = first.tag;
  const extra = views.length - 1;
  return extra > 0 ? `${head} +${extra}` : head;
}

export interface EffectsView {
  success: boolean;
  errorJson: string | null;
  epoch: string | null;
  gas: { computation: string; burned: string; storage: string; rebate: string; nonRefundable: string } | null;
  dependencies: string[];
  lamport: string | null;
  changed: Array<{
    objectId: string;
    idOp: string;
    inputState: Json | string | null;
    outputState: Json | string | null;
    outputOwner: unknown;
    outputDigest: string | null;
    isPackage: boolean;
  }>;
  unchangedShared: Json[];
  eventsDigest: string | null;
  txDigest: string | null;
  gasObjectIndex: number | null;
}

export function effectsView(fxJson: Json | null | undefined): EffectsView | null {
  const fx = unwrapV1(fxJson);
  if (!fx) return null;
  const status = fx.status ?? {};
  const success = status.success === true || status === "Success";
  const gcs = fx.gas_cost_summary;
  const changed = (fx.changed_objects ?? []).map((c: Json) => {
    const out = c.output_state;
    const outObj = out && typeof out === "object" ? (out.ObjectWrite ?? out.PackageWrite ?? null) : null;
    return {
      objectId: c.object_id,
      idOp: typeof c.id_operation === "string" ? c.id_operation : kindTag(c.id_operation),
      inputState: c.input_state ?? null,
      outputState: out ?? null,
      outputOwner: outObj?.owner ?? null,
      outputDigest: outObj?.digest ?? null,
      isPackage: !!(out && typeof out === "object" && out.PackageWrite),
    };
  });
  return {
    success,
    errorJson: success ? null : JSON.stringify(status, null, 2),
    epoch: fx.epoch ?? null,
    gas: gcs
      ? {
          computation: gcs.computation_cost,
          burned: gcs.computation_cost_burned,
          storage: gcs.storage_cost,
          rebate: gcs.storage_rebate,
          nonRefundable: gcs.non_refundable_storage_fee,
        }
      : null,
    dependencies: fx.dependencies ?? [],
    lamport: fx.lamport_version ?? null,
    changed,
    unchangedShared: fx.unchanged_shared_objects ?? [],
    eventsDigest: fx.events_digest ?? null,
    txDigest: fx.transaction_digest ?? null,
    gasObjectIndex: fx.gas_object_index ?? null,
  };
}

/** Net gas in nanos from the effects gas summary (computation + storage − rebate). */
export function netGas(gas: NonNullable<EffectsView["gas"]>): bigint {
  try {
    return BigInt(gas.computation) + BigInt(gas.storage) - BigInt(gas.rebate);
  } catch {
    return 0n;
  }
}

// ── plain-language action summary ────────────────────────────────────────────
// "What is this transaction doing?" — the single line a reader wants before any
// of the low-level detail. Derived from the PTB commands, cross-referenced with
// the emitted events (which carry the resolved amounts/parties) and the net
// balance changes. Best-effort: every branch degrades to a safe generic form,
// so an unrecognised shape still reads sensibly rather than lying.

export type PillColor = "teal" | "amber" | "coral" | "blue" | "violet";

export interface TxAction {
  /** short chip, e.g. "STAKE", "SEND", "CALL" */
  label: string;
  color: PillColor;
  /** human sentence; when `party` is set it reads as the lead-in to that link */
  sentence: string;
  /** an address the sentence points at (validator, recipient…) — rendered as a link */
  party: { role: string; address: string } | null;
  /** move-call targets involved (module::fn), for the "via" line */
  functions: string[];
}

interface EventLite {
  type: string;
  json: any;
}

/** The single counterparty that gained coins, if there is exactly one. */
function soleRecipient(
  balanceChanges: Array<{ ownerAddress: string; amount: string; coinType: string }>,
  sender: string,
): { address: string; amount: string; coinType: string } | null {
  const gains = balanceChanges.filter((b) => b.ownerAddress !== sender && !b.amount.startsWith("-") && b.amount !== "0");
  return gains.length === 1 ? { address: gains[0].ownerAddress, amount: gains[0].amount, coinType: gains[0].coinType } : null;
}

export function interpretTx(input: {
  kind: Json | null | undefined;
  events: EventLite[];
  balanceChanges: Array<{ ownerAddress: string; amount: string; coinType: string }>;
  sender: string;
}): TxAction {
  const { kind, events, balanceChanges, sender } = input;
  const tag = kindTag(kind);
  const ptb = ptbBody(kind);
  if (!ptb) {
    return { label: kindLabel(tag), color: "violet", sentence: "System transaction injected by the protocol.", party: null, functions: [] };
  }

  const views = commandViews(ptb.commands);
  const calls = views.filter((v) => v.tag === "MoveCall" && v.target);
  const functions = calls.map((v) => `${v.target!.module}::${v.target!.fn}`);
  const findEvent = (suffix: string) => events.find((e) => e.type.endsWith(suffix))?.json ?? null;

  // Staking (request_add_stake / request_add_stake_mul_coin).
  if (calls.some((v) => v.target!.fn.startsWith("request_add_stake"))) {
    const e = findEvent("::StakingRequestEvent");
    const amount = e?.amount != null ? fmtIota(e.amount) : null;
    const validator = typeof e?.validator_address === "string" ? e.validator_address : null;
    return {
      label: "STAKE",
      color: "teal",
      sentence: amount ? `Staked ${amount} with validator` : "Added stake to validator",
      party: validator ? { role: "validator", address: validator } : null,
      functions,
    };
  }

  // Unstaking (request_withdraw_stake).
  if (calls.some((v) => v.target!.fn.startsWith("request_withdraw_stake"))) {
    const e = findEvent("::UnstakingRequestEvent");
    const principal = e?.principal_amount != null ? fmtIota(e.principal_amount) : null;
    const reward = e?.reward_amount != null && e.reward_amount !== "0" ? fmtIota(e.reward_amount) : null;
    return {
      label: "UNSTAKE",
      color: "amber",
      sentence: principal ? `Withdrew ${principal} of stake${reward ? ` plus ${reward} rewards` : ""}.` : "Withdrew staked IOTA.",
      party: null,
      functions,
    };
  }

  if (views.some((v) => v.tag === "Publish")) {
    return { label: "PUBLISH", color: "violet", sentence: "Published a new Move package.", party: null, functions };
  }
  if (views.some((v) => v.tag === "Upgrade")) {
    return { label: "UPGRADE", color: "violet", sentence: "Upgraded a Move package.", party: null, functions };
  }

  // A plain value transfer: TransferObjects with no contract logic around it.
  if (views.some((v) => v.tag === "TransferObjects") && calls.length === 0) {
    const rcpt = soleRecipient(balanceChanges, sender);
    if (rcpt) {
      const isIota = rcpt.coinType.endsWith("::iota::IOTA");
      return {
        label: "SEND",
        color: "blue",
        sentence: `Sent ${isIota ? fmtIota(rcpt.amount) : fmtInt(rcpt.amount)} to`,
        party: { role: "recipient", address: rcpt.address },
        functions: [],
      };
    }
    const moved = views.filter((v) => v.tag === "TransferObjects").reduce((n, v) => n + (v.body.objects?.length ?? 0), 0);
    return { label: "TRANSFER", color: "blue", sentence: `Transferred ${moved} object${moved === 1 ? "" : "s"}.`, party: null, functions: [] };
  }

  // Generic contract interaction: lead with the first call, count the rest.
  if (calls.length > 0) {
    const first = calls[0].target!;
    const more = views.length - 1;
    return {
      label: "CALL",
      color: "blue",
      sentence: `Called ${first.module}::${first.fn}${more > 0 ? ` and ran ${more} more command${more === 1 ? "" : "s"}` : ""}.`,
      party: null,
      functions,
    };
  }

  // Only coin plumbing (split/merge) and nothing else recognisable.
  const rcpt = soleRecipient(balanceChanges, sender);
  if (rcpt) {
    const isIota = rcpt.coinType.endsWith("::iota::IOTA");
    return {
      label: "SEND",
      color: "blue",
      sentence: `Sent ${isIota ? fmtIota(rcpt.amount) : fmtInt(rcpt.amount)} to`,
      party: { role: "recipient", address: rcpt.address },
      functions: [],
    };
  }
  const steps = views.map((v) => v.tag).join(" · ");
  return { label: "PTB", color: "blue", sentence: steps ? `Programmable block: ${steps}.` : "Empty programmable block.", party: null, functions: [] };
}

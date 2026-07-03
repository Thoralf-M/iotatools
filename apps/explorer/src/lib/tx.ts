// Helpers over the canonical serde JSON of transactions/effects produced by
// the SDK's transactionToJson / transactionEffectsToJson (snake_case keys,
// PascalCase enum tags, u64 as decimal strings).

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

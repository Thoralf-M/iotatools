// Inline explanations for non-experts: a small ⓘ that reveals a plain-language
// tooltip on hover/focus. Use next to any label, stat or table header.
//
//   <Info tip={TERMS.checkpoint}>Checkpoint</Info>
//   <Info tip="..." />            ← bare icon
//
// TERMS centralises the copy so the same concept reads identically everywhere.

import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

// The tip is portalled to <body> and positioned from the icon's viewport rect,
// so it can never be clipped by overflow:hidden/auto ancestors (stat cards,
// scrollable tables) or lose the z-order battle with sticky bars.
const TIP_WIDTH = 290;
const GAP = 9;

interface TipPos {
  left: number;
  top: number;
  below: boolean;
}

export function Info({ tip, children }: { tip: string; children?: React.ReactNode }) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<TipPos | null>(null);

  const show = useCallback(() => {
    const rect = dotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(TIP_WIDTH, window.innerWidth - 24);
    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    // prefer above; flip below when there is no headroom
    const below = rect.top < 160;
    const top = below ? rect.bottom + GAP : rect.top - GAP;
    setPos({ left, top, below });
  }, []);

  const hide = useCallback(() => setPos(null), []);

  return (
    <span className="info-wrap">
      {children}
      <span
        ref={dotRef}
        className="info-dot"
        tabIndex={0}
        aria-label={tip}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        i
      </span>
      {pos != null &&
        createPortal(
          <span
            className={`info-tip-portal${pos.below ? " below" : ""}`}
            role="tooltip"
            style={{
              left: pos.left,
              top: pos.top,
              width: Math.min(TIP_WIDTH, window.innerWidth - 24),
            }}
          >
            {tip}
          </span>,
          document.body,
        )}
    </span>
  );
}

export const TERMS = {
  checkpoint:
    "A checkpoint bundles every transaction the validator committee agreed on in one consensus round and certifies it. Once a transaction is in a checkpoint it is final.",
  checkpointSeq:
    "Checkpoints are numbered from 0 (genesis). This sequence number only ever increases — it's the network's heartbeat.",
  checkpointDigest:
    "A 32-byte hash uniquely identifying this checkpoint's contents. Each checkpoint also references the previous digest, forming a verifiable chain.",
  contentDigest:
    "Hash of the list of transactions inside the checkpoint — lets you verify the transaction list wasn't tampered with.",
  signingMessage:
    "The exact bytes (intent prefix + BCS-encoded summary) that validators sign. Recomputing this lets you independently verify committee signatures.",
  epoch:
    "Time is divided into epochs (roughly 24h). The validator committee, their stakes and the reference gas price are fixed for a whole epoch and can only change at the boundary.",
  epochProgress: "How far into the epoch the network currently is. At the end, staking rewards are paid out and a new committee takes over.",
  protocolVersion:
    "The version of the on-chain rule set (feature flags + cost parameters). It only changes at epoch boundaries when enough validators support an upgrade.",
  refGasPrice:
    "The minimum gas price (in nanos per gas unit) that a quorum of validators committed to accept this epoch. Wallets use it as the default gas price.",
  gasPrice: "What the sender offered to pay per unit of computation. Must be at least the epoch's reference gas price.",
  gasBudget: "The maximum the sender allows this transaction to cost. Unused budget is not charged; execution aborts if the budget is exceeded.",
  computationCost: "Fee for executing the transaction's logic (CPU). A part of it is burned (removed from supply).",
  computationCostBurned: "The burned share of the computation fee — permanently removed from the IOTA supply.",
  storageCost:
    "A deposit paid for the bytes this transaction stores on-chain. It is refunded later (as storage rebate) when the data is deleted or rewritten.",
  storageRebate: "Deposit returned to the sender for on-chain data this transaction deleted or replaced.",
  netGas: "What the sender actually paid: computation + storage − rebate. Can even be negative if more storage was freed than used.",
  nonRefundableFee: "Small share of the storage deposit kept by the system when objects are deleted.",
  storageFund:
    "Pool holding all storage deposits. It redistributes storage fees from past transactions to the validators that store the data in future epochs.",
  fundInflow: "Storage deposits paid into the storage fund during this epoch.",
  fundOutflow: "Storage rebates paid out of the storage fund during this epoch.",
  totalSupply: "All IOTA in existence right now. Burning (computation fees) decreases it; epoch rewards can mint new supply.",
  tps: "Transactions per second, measured over the most recent checkpoints. Includes system transactions.",
  digest:
    "A transaction digest is the Blake2b-256 hash of the signed payload, shown in base58. It uniquely identifies the transaction forever.",
  txKind:
    "Programmable transactions are submitted by users and contain commands. System transactions (consensus prologue, epoch change, randomness) are injected by the protocol itself and pay no gas.",
  ptb:
    "A Programmable Transaction Block chains up to 1024 commands. Each command can use the outputs of earlier commands — like a tiny script executed atomically.",
  ptbInputs:
    "The values a PTB works with: 'pure' inputs are plain bytes (numbers, addresses, strings); object inputs reference on-chain objects by id and version.",
  ptbCommands:
    "Executed strictly in order. If any command fails the whole transaction aborts (gas is still charged). Arguments like Input(0) or Result(1) wire commands together.",
  pureInput: "Raw BCS bytes. The expected type is only known to the receiving function — the decoded guesses here are heuristics.",
  gasCoin: "The coin object that pays for gas. It can also be used inside the PTB (e.g. split off a payment) via the special Gas argument.",
  expiration: "An optional epoch after which this transaction is invalid and can no longer be executed.",
  lamport:
    "Every object touched by a transaction gets the same new version number — one higher than the highest version among all inputs (a Lamport timestamp).",
  objectVersion:
    "Versions increase with every mutation but are not consecutive — they jump to the transaction's Lamport version. Old versions stay queryable on nodes that keep history.",
  objectDigest: "Hash of the object's current contents. Changes on every mutation.",
  objectId:
    "32-byte identity of the object, assigned at creation (hash of the creating transaction and a counter) and stable across upgrades and transfers.",
  owner:
    "Address-owned objects can only be used by their owner. Shared objects are usable by everyone (and require consensus). Immutable objects can never change. Object-owned objects live inside another object.",
  shared: "Anyone can use this object in a transaction, so accesses must be ordered by consensus. The version shown is when it became shared.",
  immutable: "Frozen forever — anyone can read it, nobody can change it. Move packages are always immutable.",
  storageRebateObj: "The deposit that will be refunded to whoever deletes this object.",
  dynamicFields:
    "Key→value entries attached to an object at runtime — like a HashMap that lives on-chain. Used for collections too large to fit in a single object.",
  movePackage:
    "Compiled Move bytecode published on-chain. Packages are immutable; upgrades publish a new package object that shares the original's identity via the linkage table.",
  moduleBytecode: "The compiled Move bytecode of this module, exactly as stored on-chain.",
  linkage: "Which dependency versions this package was compiled against. An upgraded dependency shows original id → upgraded id.",
  typeOrigins: "For upgraded packages: which package version first defined each type. Type identity is pinned to where it first appeared.",
  entryFunction: "Callable directly from a transaction (not just from other Move code).",
  viewFunction: "Read-only call executed against current chain state — free, no transaction needed. Run it right here from the browser.",
  events:
    "Structured records emitted by Move code during execution — the chain's log output. Indexed by type, module and sender; great for tracking protocol activity.",
  validator:
    "An entity running a node that participates in consensus. Voting power is proportional to stake (own + delegated). Validators earn commission on staking rewards.",
  votingPower: "Share of total consensus voting power, in basis points (10000 = 100%). Capped to limit single-validator influence.",
  commission: "Share of staking rewards the validator keeps before passing the rest to its delegators.",
  effectiveCommission:
    "What the validator actually charges. Since IIP-8 (protocol v20) the commission is floored at the validator's voting power: max(commission, voting power). Large validators therefore charge more than their declared rate — an incentive to stake with smaller ones.",
  apy: "Estimated annual percentage yield for staking with this validator, based on recent epochs.",
  stake: "IOTA locked in the validator's staking pool — its own plus everything delegated to it. More stake = more voting power.",
  committee: "The validators selected to run consensus this epoch. Selection is stake-weighted at the epoch boundary.",
  delegation: "Anyone can stake IOTA with a validator to earn rewards. The stake activates at the next epoch boundary.",
  bcs:
    "Binary Canonical Serialization — the compact, deterministic byte format used for everything on-chain (transactions, objects, events). What you sign is BCS bytes.",
  base58: "Digests are shown base58-encoded (like Bitcoin addresses) — compact and without easily-confused characters.",
  base64: "Transaction bytes and signatures are usually exchanged base64-encoded.",
  signature:
    "Cryptographic proof that the sender authorized exactly these transaction bytes. The first byte of a public key encodes the scheme (Ed25519, Secp256k1, …).",
  signatureScheme: "The signature algorithm. IOTA supports Ed25519, ECDSA Secp256k1/r1, multisig combinations and passkeys (WebAuthn).",
  derivedAddress:
    "An address is the Blake2b-256 hash of (scheme flag ∥ public key). Deriving it from a signature's public key and comparing with the sender proves who signed.",
  multisig: "An address controlled by a committee of keys: each key has a weight, and signatures must reach the threshold to authorize a transaction.",
  coinType:
    "The Move type identifying a currency, e.g. 0x2::iota::IOTA. Every Coin<T> object holds a balance of exactly one coin type.",
  coinMetadata: "On-chain metadata registered for a coin type: symbol, name, decimals, icon. Decimals tell you how to display raw amounts.",
  balanceChanges: "Net effect of this transaction on each address's coin balances — gas paid, amounts moved, all coin types combined.",
  iotaNames: "The on-chain naming system: human-readable names like alice.iota that resolve to addresses (and back).",
  chainId: "First 4 bytes of the genesis checkpoint digest — identifies the network (mainnet/testnet/…) so transactions can't be replayed across chains.",
  dryRun:
    "Executes a transaction against current state without committing anything or charging gas. Returns the would-be effects — perfect for debugging and previewing.",
  devInspect: "Like dry-run but with relaxed checks (skipChecks): lets you call functions with synthetic inputs to probe behaviour.",
  faucet: "Test networks give out free IOTA so you can develop without real funds. Mainnet has no faucet.",
  checkpointTotalTx: "Running total of all transactions ever executed, as of this checkpoint — deltas between checkpoints give you throughput.",
  rawJson:
    "The canonical serde JSON of the underlying Rust type from iota-sdk-types — field names and enum tags match the BCS structure one-to-one.",
  systemState:
    "The 0x5 object: validator set, stake, epoch parameters. The source of truth the committee updates at every epoch change.",
} as const;

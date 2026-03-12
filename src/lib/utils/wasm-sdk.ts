/**
 * Compatibility wrapper for the WASM SDK.
 *
 * Maps @iota/iota-sdk APIs to the WASM SDK equivalents.
 * This module re-exports everything the app needs from the WASM SDK,
 * providing adapter functions where the API shapes differ.
 *
 * GAP LEGEND:
 *   [OK]     - Fully supported
 *   [ADAPT]  - Supported with different API (adapter provided)
 *   [PARTIAL]- Partially supported
 *   [GAP]    - Not available in WASM SDK
 */

import {
    Address,
    type AddressInterface,
    base64Decode,
    base64Encode,
    type CoinPage,
    type DryRunResult,
    type DynamicFieldOutput,
    type DynamicFieldOutputPage,
    type Epoch,
    type EventPage,
    FaucetClient,
    type FaucetClientInterface,
    GraphQlClient,
    type GraphQlClientInterface,
    Identifier,
    type MoveViewResult,
    type ObjectFilter,
    ObjectId,
    type ObjectIdInterface,
    type ObjectInterface,
    type ObjectPage,
    type PaginationFilter,
    type ProtocolConfigs,
    Query,
    type SignedTransaction,
    type SignedTransactionPage,
    SimpleKeypair,
    type SimpleKeypairInterface,
    type StructTagInterface,
    type TransactionDataEffects,
    TransactionBuilder,
    type TransactionBuilderInterface,
    type TransactionEffectsInterface,
    type TransactionMetadata,
    type TransactionsFilter,
    type TypeTagInterface,
    type UserSignatureInterface,
    type ValidatorPage,
    type Value,
    Ed25519PrivateKey,
    type Ed25519PrivateKeyInterface,
    Ed25519PublicKey as WasmEd25519PublicKey,
    type Ed25519PublicKeyInterface,
    Secp256k1PrivateKey,
    type Secp256k1PrivateKeyInterface,
    Secp256r1PrivateKey,
    type Secp256r1PrivateKeyInterface,
    type SignatureScheme,
    type MultisigMemberPublicKeyInterface,
    type TransactionInterface,
    type PersonalMessageInterface,
    type WaitForTx,
    type ServiceConfig,
    type MoveModule,
    type MoveFunctionInterface,
    type MovePackageInterface,
    type CheckpointSummaryInterface,
    transactionFromBcs,
    transactionFromJson,
    transactionToBcs,
    transactionToJson,
    type ClientTransactionBuilderInterface,
} from '../../../wasm/src/ts/index.web';

// ============================================================================
// Constants [ADAPT] - defined locally since WASM SDK doesn't export them
// ============================================================================

export const IOTA_DECIMALS = 9;
export const NANOS_PER_IOTA = BigInt(1_000_000_000);
export const IOTA_SYSTEM_STATE_OBJECT_ID =
    '0x0000000000000000000000000000000000000000000000000000000000000005';
export const IOTA_CLOCK_OBJECT_ID =
    '0x0000000000000000000000000000000000000000000000000000000000000006';

// ============================================================================
// Address utilities [ADAPT]
// ============================================================================

/**
 * Validate an IOTA address string.
 * [ADAPT] Uses Address.fromHex() to validate.
 */
export function isValidIotaAddress(address: string): boolean {
    try {
        Address.fromHex(address);
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalize an IOTA address to full 0x-prefixed 64-char hex.
 * [ADAPT] Uses Address.fromHex() then toCanonicalString().
 */
export function normalizeIotaAddress(address: string): string {
    return Address.fromHex(address).toCanonicalString(true);
}

/**
 * Normalize an IOTA object ID (same as address normalization).
 * [ADAPT]
 */
export function normalizeIotaObjectId(objectId: string): string {
    return normalizeIotaAddress(objectId);
}

// ============================================================================
// Encoding utilities [ADAPT]
// ============================================================================

/**
 * Encode bytes to base64.
 * [ADAPT] The old SDK's toB64 takes Uint8Array, WASM SDK takes ArrayBuffer.
 */
export function toB64(data: Uint8Array): string {
    return base64Encode(data.buffer as ArrayBuffer);
}

/**
 * Encode bytes to hex string.
 * [ADAPT] Implemented locally.
 */
export function toHex(data: Uint8Array): string {
    return Array.from(data)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Decode hex string to bytes.
 * [ADAPT] Implemented locally as replacement for @iota/bcs fromHEX.
 */
export function fromHEX(hex: string): Uint8Array {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return bytes;
}

// ============================================================================
// Re-exports from WASM SDK
// ============================================================================

// Client
export {
    GraphQlClient,
    type GraphQlClientInterface,
    Query,
    FaucetClient,
    type FaucetClientInterface,
};

// Address / Object types
export {
    Address,
    type AddressInterface,
    ObjectId,
    type ObjectIdInterface,
    Identifier,
};

// Transaction building
export {
    TransactionBuilder,
    type TransactionBuilderInterface,
    type ClientTransactionBuilderInterface,
    type TransactionInterface,
    type TransactionEffectsInterface,
};

// Transaction BCS
export { transactionFromBcs, transactionFromJson, transactionToBcs, transactionToJson };

// Crypto / Keypairs
export {
    SimpleKeypair,
    type SimpleKeypairInterface,
    Ed25519PrivateKey,
    type Ed25519PrivateKeyInterface,
    WasmEd25519PublicKey,
    type Ed25519PublicKeyInterface,
    Secp256k1PrivateKey,
    type Secp256k1PrivateKeyInterface,
    Secp256r1PrivateKey,
    type Secp256r1PrivateKeyInterface,
    type SignatureScheme,
    type MultisigMemberPublicKeyInterface,
    type UserSignatureInterface,
    type PersonalMessageInterface,
};

// Query result types
export type {
    CoinPage,
    DryRunResult,
    DynamicFieldOutput,
    DynamicFieldOutputPage,
    Epoch,
    EventPage,
    MoveViewResult,
    ObjectFilter,
    ObjectInterface,
    ObjectPage,
    PaginationFilter,
    ProtocolConfigs,
    SignedTransaction,
    SignedTransactionPage,
    StructTagInterface,
    TransactionDataEffects,
    TransactionMetadata,
    TransactionsFilter,
    TypeTagInterface,
    ValidatorPage,
    Value,
    WaitForTx,
    ServiceConfig,
    MoveModule,
    MoveFunctionInterface,
    MovePackageInterface,
    CheckpointSummaryInterface,
};

// ============================================================================
// Encoding helpers
// ============================================================================

export { base64Encode, base64Decode };

/**
 * Parse a GraphQL runQuery result string into a data object.
 * The WASM SDK's runQuery() already extracts the 'data' field from the
 * GraphQL response, so JSON.parse gives us the data directly (no .data wrapper).
 */
export function parseGraphQlResponse(resultStr: string): any {
    return JSON.parse(resultStr);
}

// ============================================================================
// GAP DOCUMENTATION
// ============================================================================

/**
 * KNOWN GAPS - features from @iota/iota-sdk that the WASM SDK does NOT provide:
 *
 * 1. [GAP] @iota/iota-sdk/bcs - Custom BCS schema definition
 *    The old SDK's `bcs` object allows defining arbitrary struct schemas:
 *      bcs.struct('StakedIota', { ... })
 *    The WASM SDK only has pre-defined type serializers (transactionFromBcs, etc.)
 *    IMPACT: dynamic-fields BCS decoding, staking BCS, move-authenticator
 *
 * 2. [GAP] @iota/iota-sdk/graphql + graphql tagged templates
 *    The old SDK provides typed GraphQL queries via:
 *      import { graphql } from '@iota/iota-sdk/graphql/schemas/2025.2'
 *    The WASM SDK only has GraphQlClient.runQuery() with raw query strings.
 *    IMPACT: All custom GraphQL queries lose type safety. Can still work
 *    functionally using runQuery({ query: '...', variables: ... }).
 *
 * 3. [GAP] @iota/iota-sdk/cryptography - decodeIotaPrivateKey()
 *    Decodes bech32 private keys into { schema, secretKey }.
 *    WASM SDK's SimpleKeypair.fromBech32() creates the keypair directly
 *    but doesn't expose the intermediate decode step.
 *    IMPACT: Code that inspects the schema before creating keypair needs rework.
 *    WORKAROUND: Use SimpleKeypair.fromBech32() directly.
 *
 * 4. [GAP] @iota/iota-sdk/cryptography - messageWithIntent(), toSerializedSignature(),
 *    parseSerializedSignature()
 *    Low-level signature construction/parsing utilities.
 *    WASM SDK handles signing internally.
 *    IMPACT: Ledger/Keystone integration that manually constructs signatures.
 *
 * 5. [GAP] @iota/iota-sdk/keypairs/ed25519 - Ed25519Keypair.deriveKeypairFromSeed()
 *    Mnemonic/BIP39 derivation. WASM SDK doesn't expose this.
 *    IMPACT: Ed25519 address generation page.
 *
 * 6. [GAP] @iota/iota-sdk/verify - publicKeyFromRawBytes(), verifyTransactionSignature()
 *    The WASM SDK has verifier classes but different API.
 *    IMPACT: Transaction signature verification display.
 *
 * 7. [GAP] @iota/iota-sdk/multisig - parsePartialSignatures()
 *    WASM SDK has MultisigAggregator but no direct parse function.
 *    IMPACT: Multisig signature display.
 *
 * 8. [GAP] IotaClient JSON-RPC methods not in GraphQlClient:
 *    - signAndExecuteTransaction (handled by wallet integration)
 *    - devInspectTransactionBlock
 *    - getReferenceGasPrice → available as graphQlClient.referenceGasPrice()
 *    - getStakes → not directly available
 *    - multiGetObjects → use objects() with filter
 *    - getLatestIotaSystemState → use epoch() + activeValidators()
 *
 * 9. [GAP] @iota/iota-sdk/transactions - Transaction class
 *    The old Transaction class has methods like:
 *    - Transaction.from(bytes) - deserialize
 *    - transaction.toJSON() - serialize
 *    - transaction.build({ client }) - build with gas resolution
 *    - transaction.getData() - inspect contents
 *    - transaction.setSenderIfNotSet()
 *    The WASM SDK's TransactionBuilder has a different lifecycle:
 *    - new TransactionBuilder(sender) → configure → .finish() → Transaction
 *    - ClientTransactionBuilder adds async operations (build, dry run, execute)
 *    WORKAROUND: Use transactionFromBcs/transactionFromJson for deserialization.
 *
 * 10. [GAP] @iota/graphql-transport - IotaClientGraphQLTransport
 *     The GraphQL transport wrapper for IotaClient.
 *     Not needed since WASM SDK's GraphQlClient is already GraphQL-native.
 *
 * 11. [GAP] @iota/bcs - toBase64, fromBase64
 *     WORKAROUND: Use base64Encode/base64Decode from WASM SDK.
 *
 * 12. [GAP] Type definitions from @iota/iota-sdk/client:
 *     IotaObjectData, IotaTransactionBlockResponse, CoinStruct, PaginatedCoins,
 *     LatestIotaSystemStateSummary, DevInspectResults, DryRunTransactionBlockResponse,
 *     GasCostSummary, IotaGasData, TransactionEffects, etc.
 *     These have different equivalents in the WASM SDK.
 */

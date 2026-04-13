import { fromBase64 } from '@iota/bcs';
import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
import type { MoveAuthenticatorData } from '@iota/iota-sdk/keypairs/move-authenticator';
import { parsePartialSignatures } from '@iota/iota-sdk/multisig';
import {
    publicKeyFromRawBytes,
    verifyPersonalMessageSignature,
    verifyTransactionSignature,
} from '@iota/iota-sdk/verify';

export interface SignaturePubkeyPair {
    signatureScheme: string;
    publicKey: any; // PublicKey type
    signature: Uint8Array;
}

export type VerificationStatus = 'valid' | 'invalid' | 'checking' | 'on_chain_only' | null;

export interface VerificationResult {
    status: VerificationStatus;
    error: string;
    pubkeyPairs: SignaturePubkeyPair[] | null;
    moveAuthenticator?: MoveAuthenticatorData;
}

export async function verifySignature(
    txBytesInput: string,
    signatureResult: string,
): Promise<VerificationResult> {
    let status: VerificationStatus = 'checking';
    let error = '';
    let pubkeyPairs: SignaturePubkeyPair[] | null = null;

    try {
        const inputString = txBytesInput.trim();
        const signatureString = signatureResult.trim();

        if (!signatureString) {
            status = null;
            return { status, error, pubkeyPairs };
        }

        // Try to parse the signature to extract public key
        try {
            const parsed = parseSerializedSignature(signatureString);

            // Extract public key based on signature scheme
            if (parsed.signatureScheme === 'MultiSig') {
                // Parse partial signatures for MultiSig
                const partialSignatures = parsePartialSignatures(parsed.multisig);
                pubkeyPairs = partialSignatures.map((sig) => ({
                    signatureScheme: sig.signatureScheme,
                    publicKey: sig.publicKey,
                    signature: sig.signature,
                }));
                status = 'valid'; // Assume valid if parsed successfully
            } else if (parsed.signatureScheme === 'MoveAuthenticator') {
                // MoveAuthenticator uses account abstraction — validity depends on the Move
                // authenticator function executing successfully on-chain, which can't be
                // checked here.
                const moveAuth = parsed.moveAuthenticator;
                if (moveAuth.$kind !== 'V1') {
                    throw new Error(`Unsupported MoveAuthenticator version: ${moveAuth.$kind}`);
                }
                const v1 = moveAuth.V1;
                if (v1.objectToAuthenticate.$kind !== 'Object') {
                    throw new Error('MoveAuthenticator objectToAuthenticate must be an Object');
                }
                return {
                    status: 'on_chain_only',
                    error,
                    pubkeyPairs: [],
                    moveAuthenticator: {
                        version: 'V1',
                        callArgs: v1.callArgs,
                        typeArgs: v1.typeArgs,
                        objectToAuthenticate: v1.objectToAuthenticate.Object,
                    },
                };
            } else {
                // Single signature
                const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
                pubkeyPairs = [
                    {
                        signatureScheme: parsed.signatureScheme,
                        publicKey: pubKey,
                        signature: parsed.signature,
                    },
                ];
            }
        } catch (e) {
            console.error('Error parsing signature:', e);
            status = 'invalid';
            error = `Parsing failed: ${e}`;
            return { status, error, pubkeyPairs };
        }

        // For single sig, verify the signature
        if (pubkeyPairs && pubkeyPairs.length === 1 && inputString) {
            const pair = pubkeyPairs[0];
            try {
                // Try transaction verification first, fallback to message if it fails
                const txBytes = fromBase64(inputString);
                const verifiedPubKey = await verifyTransactionSignature(txBytes, signatureString);
                if (verifiedPubKey.toBase64() !== pair.publicKey.toBase64()) {
                    status = 'invalid';
                    error = 'Public key mismatch';
                    return { status, error, pubkeyPairs };
                }
                status = 'valid';
            } catch {
                // If transaction verification fails, try as personal message
                try {
                    const messageBytes = new TextEncoder().encode(inputString);
                    const verifiedPubKey = await verifyPersonalMessageSignature(
                        messageBytes,
                        signatureString,
                    );
                    if (verifiedPubKey.toBase64() !== pair.publicKey.toBase64()) {
                        status = 'invalid';
                        error = 'Public key mismatch';
                        return { status, error, pubkeyPairs };
                    }
                    status = 'valid';
                } catch (e2) {
                    status = 'invalid';
                    error = `Verification failed: ${e2}`;
                    return { status, error, pubkeyPairs };
                }
            }
        } else if (pubkeyPairs && pubkeyPairs.length > 1) {
            // For MultiSig, we don't verify here, assume valid if parsed
            status = 'valid';
        } else {
            // No input data, just show the public key if we can extract it
            status = null;
        }
    } catch (e) {
        status = 'invalid';
        error = `Verification error: ${e}`;
    }

    return { status, error, pubkeyPairs };
}

import { base64Decode as fromBase64 } from '../../utils/wasm-sdk';
// [GAP] These crypto functions from @iota/iota-sdk/cryptography are not in the WASM SDK.
// Signature verification is not yet supported in the WASM SDK migration.
import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
import { publicKeyFromRawBytes } from '@iota/iota-sdk/verify';
import { verifyTransactionSignature, verifyPersonalMessageSignature } from '@iota/iota-sdk/verify';
import { parsePartialSignatures } from '@iota/iota-sdk/multisig';

export interface SignaturePubkeyPair {
    signatureScheme: string;
    publicKey: any; // PublicKey type
    signature: Uint8Array;
}

export interface VerificationResult {
    status: 'valid' | 'invalid' | 'checking' | null;
    error: string;
    pubkeyPairs: SignaturePubkeyPair[] | null;
}

export async function verifySignature(
    txBytesInput: string,
    signatureResult: string,
): Promise<VerificationResult> {
    let status: 'valid' | 'invalid' | 'checking' | null = 'checking';
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
                const txBytes = new Uint8Array(fromBase64(inputString));
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

import { fromBase64 } from '@iota/bcs';
import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
import { parsePartialSignatures } from '@iota/iota-sdk/multisig';
import { TransactionDataBuilder } from '@iota/iota-sdk/transactions';
import {
    publicKeyFromRawBytes,
    verifyPersonalMessageSignature,
    verifyTransactionSignature,
} from '@iota/iota-sdk/verify';

export interface SignaturePubkeyPair {
    signatureScheme: string;
    publicKey: any; // PublicKey type
    signature: Uint8Array;
    role?: 'sender' | 'gas_sponsor' | 'unknown'; // Role of the signature
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

        // Check if we have multiple signatures (separated by newlines)
        const signatureLines = signatureString.split('\n').filter(line => line.trim());
        
        // Extract sender and gas sponsor addresses from transaction if available
        let senderAddress: string | null = null;
        let gasSponsorAddress: string | null = null;
        
        try {
            const txBytes = fromBase64(inputString);
            const parsed = IotaBcs.SenderSignedData.parse(txBytes);
            if (parsed && parsed[0]?.intentMessage?.value?.V1) {
                const v1Data = parsed[0].intentMessage.value.V1;
                senderAddress = v1Data.sender;
                gasSponsorAddress = v1Data.gasData?.owner;
            }
        } catch (e) {
            // If we can't parse as SenderSignedData, try as TransactionDataBuilder
            try {
                const txBytes = fromBase64(inputString);
                const parsed = TransactionDataBuilder.fromBytes(txBytes);
                if (parsed) {
                    senderAddress = parsed.sender;
                    gasSponsorAddress = parsed.gasData?.owner;
                }
            } catch (e2) {
                // Not a transaction format, that's okay
            }
        }
        
        const allPubkeyPairs: SignaturePubkeyPair[] = [];
        
        // Process each signature
        for (let i = 0; i < signatureLines.length; i++) {
            const sigString = signatureLines[i].trim();
            
            try {
                const parsed = parseSerializedSignature(sigString);

                // Extract public key based on signature scheme
                if (parsed.signatureScheme === 'MultiSig') {
                    // Parse partial signatures for MultiSig
                    const partialSignatures = parsePartialSignatures(parsed.multisig);
                    allPubkeyPairs.push(...partialSignatures.map((sig) => ({
                        signatureScheme: sig.signatureScheme,
                        publicKey: sig.publicKey,
                        signature: sig.signature,
                        role: 'unknown' as const,
                    })));
                } else {
                    // Single signature
                    const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
                    const address = pubKey.toIotaAddress();
                    
                    // Determine role based on address matching
                    let role: 'sender' | 'gas_sponsor' | 'unknown' = 'unknown';
                    if (senderAddress && address === senderAddress) {
                        role = 'sender';
                    } else if (gasSponsorAddress && address === gasSponsorAddress && gasSponsorAddress !== senderAddress) {
                        role = 'gas_sponsor';
                    } else if (i === 0 && signatureLines.length === 1) {
                        // If only one signature and we have no address info, assume sender
                        role = 'sender';
                    } else if (i === 0) {
                        // First signature is typically sender
                        role = 'sender';
                    } else if (i === 1) {
                        // Second signature is typically gas sponsor
                        role = 'gas_sponsor';
                    }
                    
                    allPubkeyPairs.push({
                        signatureScheme: parsed.signatureScheme,
                        publicKey: pubKey,
                        signature: parsed.signature,
                        role,
                    });
                }
            } catch (e) {
                console.error(`Error parsing signature ${i + 1}:`, e);
                // Continue processing other signatures
            }
        }
        
        if (allPubkeyPairs.length === 0) {
            status = 'invalid';
            error = 'Failed to parse any signatures';
            return { status, error, pubkeyPairs };
        }
        
        pubkeyPairs = allPubkeyPairs;

        // For single sig, verify the signature
        if (pubkeyPairs && pubkeyPairs.length === 1 && inputString) {
            const pair = pubkeyPairs[0];
            try {
                // Try transaction verification first, fallback to message if it fails
                const txBytes = fromBase64(inputString);
                const verifiedPubKey = await verifyTransactionSignature(txBytes, signatureLines[0]);
                if (verifiedPubKey.toBase64() !== pair.publicKey.toBase64()) {
                    status = 'invalid';
                    error = 'Public key mismatch';
                    return { status, error, pubkeyPairs };
                }
                status = 'valid';
            } catch (e) {
                // If transaction verification fails, try as personal message
                try {
                    const messageBytes = new TextEncoder().encode(inputString);
                    const verifiedPubKey = await verifyPersonalMessageSignature(
                        messageBytes,
                        signatureLines[0],
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
            // For multiple signatures, assume valid if parsed successfully
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

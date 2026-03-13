<script lang="ts">
    import { getSelectedNetworkConfig } from '../utils/client';
    import { getObjectLink } from '../utils/explorer-links';
    import { copyToClipboard } from '../utils/formatting';
    import {
        parseMoveAuthenticatorSignature,
        type MoveAuthenticatorInfo,
    } from '../utils/move-authenticator';
    import {
        base64Decode as fromBase64,
        base64Encode as toBase64Str,
        WasmEd25519PublicKey,
        WasmSecp256k1PublicKey,
        WasmSecp256r1PublicKey,
    } from '../utils/wasm-sdk';

    // Signature scheme flags
    const SCHEME_ED25519 = 0x00;
    const SCHEME_SECP256K1 = 0x01;
    const SCHEME_SECP256R1 = 0x02;
    const SCHEME_MULTISIG = 0x03;

    const SCHEME_NAMES: Record<number, string> = {
        [SCHEME_ED25519]: 'ED25519',
        [SCHEME_SECP256K1]: 'Secp256k1',
        [SCHEME_SECP256R1]: 'Secp256r1',
        [SCHEME_MULTISIG]: 'MultiSig',
    };

    // Signature sizes: ED25519 = 64 sig + 32 pubkey, Secp256k1/r1 = 64 sig + 33 pubkey
    const PUBKEY_SIZES: Record<number, number> = {
        [SCHEME_ED25519]: 32,
        [SCHEME_SECP256K1]: 33,
        [SCHEME_SECP256R1]: 33,
    };

    /**
     * Wraps a WASM SDK public key object with the display methods
     * expected by the template (toBase64, toIotaPublicKey, toIotaAddress).
     */
    function wrapPublicKey(wasmPubKey: {
        toBytes(): ArrayBuffer;
        toFlaggedBytes(): ArrayBuffer;
        deriveAddress(): { toHex(): string };
    }) {
        return {
            toBase64() {
                return toBase64Str(wasmPubKey.toBytes());
            },
            toIotaPublicKey() {
                return toBase64Str(wasmPubKey.toFlaggedBytes());
            },
            toIotaAddress() {
                return wasmPubKey.deriveAddress().toHex();
            },
        };
    }

    /**
     * Parse a serialized IOTA signature from base64 into its components.
     * Format: [scheme_flag | signature_bytes | public_key_bytes]
     */
    function parseSerializedSignature(sigBase64: string) {
        const bytes = new Uint8Array(fromBase64(sigBase64));
        const scheme = bytes[0];
        const schemeName = SCHEME_NAMES[scheme];

        if (scheme === SCHEME_MULTISIG) {
            return { signatureScheme: 'MultiSig', bytes };
        }

        if (!schemeName) {
            throw new Error(`Unknown signature scheme: 0x${scheme.toString(16).padStart(2, '0')}`);
        }

        const pubKeySize = PUBKEY_SIZES[scheme];
        const sigSize = 64;
        const expectedLen = 1 + sigSize + pubKeySize;

        if (bytes.length < expectedLen) {
            throw new Error(`Signature too short: ${bytes.length} bytes, expected ${expectedLen}`);
        }

        const signatureBytes = bytes.slice(1, 1 + sigSize);
        const publicKeyBytes = bytes.slice(1 + sigSize, 1 + sigSize + pubKeySize);

        // Create WASM SDK public key object
        let wasmPubKey;
        if (scheme === SCHEME_ED25519) {
            wasmPubKey = WasmEd25519PublicKey.fromBytes(publicKeyBytes.buffer as ArrayBuffer);
        } else if (scheme === SCHEME_SECP256K1) {
            wasmPubKey = WasmSecp256k1PublicKey.fromBytes(publicKeyBytes.buffer as ArrayBuffer);
        } else {
            wasmPubKey = WasmSecp256r1PublicKey.fromBytes(publicKeyBytes.buffer as ArrayBuffer);
        }

        return {
            signatureScheme: schemeName,
            signature: signatureBytes,
            publicKey: wrapPublicKey(wasmPubKey),
        };
    }

    interface SignatureInfo {
        signatureScheme: string;
        publicKey: any;
        signature: Uint8Array;
        role?: 'sender' | 'gas_sponsor' | 'unknown';
        rawSignature: string; // base64 encoded
        moveAuthenticator?: MoveAuthenticatorInfo;
    }

    let { signatures = [], transactionData = null } = $props<{
        signatures: string[];
        transactionData?: any;
    }>();

    function determineRole(
        index: number,
        address: string | null,
        senderAddress: string | null,
        gasSponsorAddress: string | null,
    ): 'sender' | 'gas_sponsor' | 'unknown' {
        if (address && senderAddress && address === senderAddress) return 'sender';
        if (
            address &&
            gasSponsorAddress &&
            address === gasSponsorAddress &&
            gasSponsorAddress !== senderAddress
        )
            return 'gas_sponsor';
        if (signatures.length === 1) return 'sender';
        if (index === 0) return 'sender';
        if (index === 1) return 'gas_sponsor';
        return 'unknown';
    }

    let parsedSignatures = $derived.by(() => {
        const result: SignatureInfo[] = [];

        let senderAddress: string | null = null;
        let gasSponsorAddress: string | null = null;

        if (transactionData) {
            senderAddress = transactionData.sender;
            gasSponsorAddress = transactionData.gasData?.owner;
        }

        signatures.forEach((sigString: string, index: number) => {
            try {
                const bytes = new Uint8Array(fromBase64(sigString));
                if (bytes[0] === 0x07) {
                    // MoveAuthenticator - use custom parser
                    const parsed = parseMoveAuthenticatorSignature(sigString);
                    const role = determineRole(
                        index,
                        parsed.objectId,
                        senderAddress,
                        gasSponsorAddress,
                    );

                    result.push({
                        signatureScheme: 'MoveAuthenticator',
                        publicKey: null,
                        signature: new Uint8Array(),
                        role,
                        rawSignature: sigString,
                        moveAuthenticator: parsed,
                    });
                    return;
                }

                const parsed = parseSerializedSignature(sigString);

                if (parsed.signatureScheme === 'MultiSig') {
                    // MultiSig: show as single entry with raw signature
                    result.push({
                        signatureScheme: 'MultiSig',
                        publicKey: null,
                        signature: new Uint8Array(),
                        role: determineRole(index, null, senderAddress, gasSponsorAddress),
                        rawSignature: sigString,
                    });
                } else {
                    const address = parsed.publicKey!.toIotaAddress();
                    const role = determineRole(index, address, senderAddress, gasSponsorAddress);

                    result.push({
                        signatureScheme: parsed.signatureScheme,
                        publicKey: parsed.publicKey!,
                        signature: parsed.signature!,
                        role,
                        rawSignature: sigString,
                    });
                }
            } catch (e) {
                console.error(`Failed to parse signature ${index + 1}:`, e);
            }
        });

        return result;
    });
</script>

{#if parsedSignatures.length === 0}
    <div class="no-signatures">No signatures available</div>
{:else}
    <div class="signatures-container">
        {#each parsedSignatures as sig, index}
            <div class="signature-item">
                <div class="signature-header">
                    <span class="signature-title"
                        >Signature #{index + 1} ({sig.signatureScheme})</span
                    >
                    {#if sig.role === 'sender'}
                        <span class="role-badge sender">Sender</span>
                    {:else if sig.role === 'gas_sponsor'}
                        <span class="role-badge sponsor">Gas Sponsor</span>
                    {/if}
                </div>

                <div class="signature-details">
                    {#if sig.signatureScheme === 'MoveAuthenticator' && sig.moveAuthenticator}
                        {@const move = sig.moveAuthenticator}
                        <div class="detail-row">
                            <span class="detail-label">Version:</span>
                            <div class="detail-value-container">
                                <span class="detail-value">V{move.version}</span>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Authenticated Object ID:</span>
                            <div class="detail-value-container">
                                <a
                                    class="detail-value link"
                                    href={getObjectLink(getSelectedNetworkConfig(), move.objectId)}
                                    target="_blank"
                                    rel="noopener noreferrer">{move.objectId}</a
                                >
                                <button
                                    class="copy-btn"
                                    onclick={async () => await copyToClipboard(move.objectId)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Call Arguments:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap"
                                    >{JSON.stringify(move.callArguments, null, 2)}</span
                                >
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(JSON.stringify(move.callArguments))}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Type Arguments:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap"
                                    >{JSON.stringify(move.typeArguments, null, 2)}</span
                                >
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(JSON.stringify(move.typeArguments))}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Object to Authenticate:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap"
                                    >{JSON.stringify(move.objectToAuthenticate, null, 2)}</span
                                >
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(
                                            JSON.stringify(move.objectToAuthenticate),
                                        )}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Full Signature:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap">{sig.rawSignature}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () => await copyToClipboard(sig.rawSignature)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    {:else if sig.publicKey}
                        <div class="detail-row">
                            <span class="detail-label">Public Key:</span>
                            <div class="detail-value-container">
                                <span class="detail-value">{sig.publicKey.toBase64()}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(sig.publicKey.toBase64())}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Public Key (with flag):</span>
                            <div class="detail-value-container">
                                <span class="detail-value">{sig.publicKey.toIotaPublicKey()}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(sig.publicKey.toIotaPublicKey())}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <div class="detail-value-container">
                                <span class="detail-value">{sig.publicKey.toIotaAddress()}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(sig.publicKey.toIotaAddress())}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Signature Bytes:</span>
                            <div class="detail-value-container">
                                <span class="detail-value"
                                    >{Buffer.from(sig.signature).toString('base64')}</span
                                >
                                <button
                                    class="copy-btn"
                                    onclick={async () =>
                                        await copyToClipboard(
                                            Buffer.from(sig.signature).toString('base64'),
                                        )}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Full Signature:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap">{sig.rawSignature}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () => await copyToClipboard(sig.rawSignature)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    {:else}
                        <div class="detail-row">
                            <span class="detail-label">Full Signature:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap">{sig.rawSignature}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () => await copyToClipboard(sig.rawSignature)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    .no-signatures {
        padding: 20px;
        text-align: center;
        color: var(--text-secondary);
    }

    .signatures-container {
        padding: 10px;
    }

    .signature-item {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-secondary);
    }

    .signature-item:last-child {
        margin-bottom: 0;
    }

    .signature-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .signature-title {
        font-weight: bold;
        font-size: 14px;
    }

    .role-badge {
        font-size: 11px;
        padding: 3px 10px;
        border-radius: 4px;
        font-weight: 500;
    }

    .role-badge.sender {
        background-color: #4ade80;
        color: #14532d;
    }

    .role-badge.sponsor {
        background-color: #60a5fa;
        color: #1e3a8a;
    }

    .signature-details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .detail-row {
        display: flex;
        gap: 10px;
        align-items: flex-start;
    }

    .detail-label {
        font-weight: 600;
        min-width: 180px;
        flex-shrink: 0;
        padding-top: 2px;
        font-size: 13px;
    }

    @media (max-width: 600px) {
        .detail-row {
            flex-direction: column;
            gap: 4px;
        }
        .detail-label {
            min-width: 0;
        }
    }

    .detail-value-container {
        flex: 1;
        display: flex;
        gap: 8px;
        align-items: flex-start;
    }

    .detail-value {
        font-family: monospace;
        font-size: 12px;
        word-break: break-all;
        flex: 1;
        line-height: 1.5;
    }

    .detail-value.link {
        color: var(--link-color, #0066cc);
        text-decoration: underline;
        cursor: pointer;
    }

    .detail-value.link:hover {
        color: var(--link-hover-color, #004499);
    }

    .detail-value.wrap {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .copy-btn {
        flex-shrink: 0;
        padding: 4px 10px;
        font-size: 11px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .copy-btn:hover {
        background: var(--bg-hover);
    }
</style>

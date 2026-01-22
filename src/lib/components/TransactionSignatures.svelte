<script lang="ts">
    import { fromBase64 } from '@iota/bcs';
    import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
    import { parsePartialSignatures } from '@iota/iota-sdk/multisig';
    import { publicKeyFromRawBytes } from '@iota/iota-sdk/verify';

    import { copyToClipboard } from '../utils/formatting';

    interface SignatureInfo {
        signatureScheme: string;
        publicKey: any;
        signature: Uint8Array;
        role?: 'sender' | 'gas_sponsor' | 'unknown';
        rawSignature: string; // base64 encoded
    }

    let { signatures = [], transactionData = null } = $props<{
        signatures: string[];
        transactionData?: any;
    }>();

    let parsedSignatures = $derived.by(() => {
        const result: SignatureInfo[] = [];

        // Extract sender and gas sponsor addresses from transaction data
        let senderAddress: string | null = null;
        let gasSponsorAddress: string | null = null;

        if (transactionData) {
            senderAddress = transactionData.sender;
            gasSponsorAddress = transactionData.gasData?.owner;
        }

        signatures.forEach((sigString: string, index: number) => {
            try {
                const parsed = parseSerializedSignature(sigString);

                if (parsed.signatureScheme === 'MultiSig') {
                    const partialSignatures = parsePartialSignatures(parsed.multisig);
                    partialSignatures.forEach((sig) => {
                        result.push({
                            signatureScheme: sig.signatureScheme,
                            publicKey: sig.publicKey,
                            signature: sig.signature,
                            role: 'unknown',
                            rawSignature: sigString,
                        });
                    });
                } else {
                    const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
                    const address = pubKey.toIotaAddress();

                    // Determine role
                    let role: 'sender' | 'gas_sponsor' | 'unknown' = 'unknown';
                    if (senderAddress && address === senderAddress) {
                        role = 'sender';
                    } else if (
                        gasSponsorAddress &&
                        address === gasSponsorAddress &&
                        gasSponsorAddress !== senderAddress
                    ) {
                        role = 'gas_sponsor';
                    } else if (signatures.length === 1) {
                        role = 'sender';
                    } else if (index === 0) {
                        role = 'sender';
                    } else if (index === 1) {
                        role = 'gas_sponsor';
                    }

                    result.push({
                        signatureScheme: parsed.signatureScheme,
                        publicKey: pubKey,
                        signature: parsed.signature,
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

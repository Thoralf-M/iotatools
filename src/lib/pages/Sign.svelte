<script lang="ts">
    import { fromBase64 } from '@iota/bcs';
    import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import { Transaction, TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import {
        verifyTransactionSignature,
        verifyPersonalMessageSignature,
    } from '@iota/iota-sdk/verify';
    import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
    import { get } from 'svelte/store';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import TransactionView from '../components/TransactionView.svelte';
    import { getClient } from '../lib/client';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';
    import { activeAddress, iota_wallets } from '../lib/signer-data';

    // Use query parameters for the transaction bytes
    const queryParamValues = usePageQueryParams({
        tx: '', // Query parameter for transaction bytes
    });

    let error = '';
    let value: any;
    let signatureResult = '';
    let signatureTextarea: HTMLTextAreaElement;
    let submitResult: any = null;
    let signatureTypeLabel = '';
    let txBytesInput = '';
    let dryRunResult: any;

    // Signature verification state
    let signatureVerificationStatus: 'valid' | 'invalid' | 'checking' | null = null;
    let signatureVerificationError = '';
    let signaturePublicKey = '';
    let signatureAddress = '';
    // Dry run transaction function
    async function dryRunTransaction() {
        try {
            error = '';
            dryRunResult = '';

            const inputString = txBytesInput.trim();
            if (!inputString) {
                error = 'Please enter transaction bytes';
                return;
            }

            // Parse transaction bytes
            let txBytes: Uint8Array;
            try {
                txBytes = fromBase64(inputString);
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            const client = getClient();
            const result = await client.dryRunTransactionBlock({
                transactionBlock: txBytes,
            });
            dryRunResult = result;
        } catch (e) {
            error = `Error dry running transaction: ${e}`;
        }
    }

    $: if ($queryParamValues.tx !== txBytesInput) {
        txBytesInput = $queryParamValues.tx;
        processTransactionBytes(txBytesInput);
    }

    // Function to update transaction bytes and query parameter
    function updateTxBytes(newTxBytes: string) {
        txBytesInput = newTxBytes;
        updatePageQueryParams({ tx: newTxBytes || null });

        // Process the transaction bytes
        processTransactionBytes(newTxBytes);
    }

    // Function to process transaction bytes and update the value
    function processTransactionBytes(inputString: string) {
        try {
            let txBytes = fromBase64(inputString);
            value = TransactionDataBuilder.fromBytes(txBytes);
        } catch (e) {
            console.log('error TransactionDataBuilder', e);
            try {
                value = IotaBcs.SenderSignedData.parse(fromBase64(inputString))[0];
            } catch (e) {
                console.log('error SenderSignedData', e);
                value = e;
            }
        }
    }

    let txBytesTextarea: HTMLTextAreaElement;
    const exampleTx =
        'AAACAAgAypo7AAAAAAAg0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpECAgABAQAAAQEDAAAAAAEBANKra+ym7GUCu4vTTXPpQ8bRIIfMk38vrNsEbPtnkEqRAhqhmE/Wz9u5hD63usyXx55ZG8kDHwdq9KNGKDXH3pQ2Mj0AAAAAAAAgnPGssCCNJPH94p+4VvX3Fzp32jLZO9zsO5eMsp4LujqznOy0o0pHmEqaslIo0HQKO7U5nouSh6qph3HYLxK94jM9AAAAAAAAIMX/XZSN7Cn09U1FYXDGPcaUk5v9VkmnwMeY1geClYzW0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpHoAwAAAAAAAOBvPAAAAAAAAA==';

    function insertExampleTx() {
        updateTxBytes(exampleTx);
    }

    async function signTransaction() {
        try {
            error = '';
            signatureResult = '';

            const inputString = txBytesInput.trim();
            if (!inputString) {
                error = 'Please enter transaction bytes';
                return;
            }

            const wallets = get(iota_wallets);
            const senderAddress = get(activeAddress);

            if (!wallets || wallets.length === 0) {
                error = 'No wallet available';
                return;
            }

            if (!wallets[0].signTransaction) {
                error = 'Current wallet does not support transaction signing';
                return;
            }

            // Parse transaction bytes
            let transactionBytes: Uint8Array;

            try {
                transactionBytes = fromBase64(inputString);
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            const result = await wallets[0].signTransaction({
                transaction: Transaction.from(transactionBytes),
                account: { address: senderAddress },
            });

            signatureTypeLabel = 'Transaction Signature';
            signatureResult = result.signature;
            // Also update the signature textarea if present
            if (signatureTextarea) {
                signatureTextarea.value = signatureResult;
            }
        } catch (e) {
            error = `Error signing transaction: ${e}`;
            console.error('Error signing transaction:', e);
        }
    }

    async function signPersonalMessage() {
        try {
            error = '';
            signatureResult = '';

            const inputString = txBytesInput.trim();
            if (!inputString) {
                error = 'Please enter a message';
                return;
            }

            const wallets = get(iota_wallets);
            const senderAddress = get(activeAddress);

            if (!wallets || wallets.length === 0) {
                error = 'No wallet available';
                return;
            }

            if (!wallets[0].signPersonalMessage) {
                error = 'Current wallet does not support message signing';
                return;
            }

            // Convert string to bytes
            const messageBytes = new TextEncoder().encode(inputString);

            const result = await wallets[0].signPersonalMessage({
                message: messageBytes,
                account: { address: senderAddress },
            });

            signatureTypeLabel = 'Message Signature';
            signatureResult = result.signature;
        } catch (e) {
            error = `Error signing message: ${e}`;
        }
    }
    async function verifySignature() {
        signatureVerificationStatus = 'checking';
        signatureVerificationError = '';
        signaturePublicKey = '';
        signatureAddress = '';

        try {
            const inputString = txBytesInput.trim();
            const signatureString = signatureResult.trim();

            if (!signatureString) {
                signatureVerificationStatus = null;
                return;
            }

            // Try to parse the signature to extract public key
            try {
                const parsed = parseSerializedSignature(signatureString);
                
                // Extract public key based on signature scheme
                if (parsed.signatureScheme === 'MultiSig') {
                    signatureVerificationError = 'MultiSig signature verification not yet supported in UI';
                    signatureVerificationStatus = 'invalid';
                    return;
                } else if (parsed.signatureScheme === 'Passkey') {
                    signaturePublicKey = Buffer.from(parsed.publicKey).toString('base64');
                } else if (parsed.publicKey) {
                    signaturePublicKey = Buffer.from(parsed.publicKey).toString('base64');
                }
            } catch (e) {
                console.error('Error parsing signature:', e);
            }

            // Verify the signature based on what we're signing
            let publicKey;
            if (inputString) {
                try {
                    // Try as transaction first
                    const txBytes = fromBase64(inputString);
                    publicKey = await verifyTransactionSignature(txBytes, signatureString);
                    signatureVerificationStatus = 'valid';
                } catch (e) {
                    // If transaction verification fails, try as personal message
                    try {
                        const messageBytes = new TextEncoder().encode(inputString);
                        publicKey = await verifyPersonalMessageSignature(
                            messageBytes,
                            signatureString,
                        );
                        signatureVerificationStatus = 'valid';
                    } catch (e2) {
                        signatureVerificationStatus = 'invalid';
                        signatureVerificationError = `Verification failed: ${e2}`;
                        return;
                    }
                }

                // Extract address from public key
                if (publicKey) {
                    signatureAddress = publicKey.toIotaAddress();
                    if (!signaturePublicKey) {
                        signaturePublicKey = publicKey.toBase64();
                    }
                }
            } else {
                // No input data, just show the public key if we can extract it
                signatureVerificationStatus = null;
            }
        } catch (e) {
            signatureVerificationStatus = 'invalid';
            signatureVerificationError = `Verification error: ${e}`;
        }
    }

    // Watch for changes to signature and trigger verification
    $: {
        signatureResult;
        txBytesInput;
        verifySignature();
    }

    async function submitSignedTx() {
        try {
            error = '';
            submitResult = null;

            const inputString = txBytesInput.trim();
            const signatureString = signatureResult.trim();
            if (!inputString) {
                error = 'Please enter transaction bytes';
                return;
            }
            if (!signatureString) {
                error = 'Please enter a signature';
                return;
            }

            let txBytes: Uint8Array;
            try {
                txBytes = fromBase64(inputString);
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            let bcsSignature: Uint8Array;
            try {
                bcsSignature = fromBase64(signatureString);
            } catch (e) {
                error = 'Invalid base64 signature';
                return;
            }

            const client = getClient();
            const result = await client.executeTransactionBlock({
                transactionBlock: txBytes,
                signature: signatureString,
                options: {
                    showBalanceChanges: true,
                    showObjectChanges: true,
                    showEffects: true,
                    showInput: true,
                },
            });
            console.log(result);
            submitResult = result;
        } catch (e) {
            error = `Error submitting signed transaction: ${e}`;
        }
    }
</script>

<main>
    <div>
        <div style="float: left; display: flex; align-items: center; gap: 10px;">
            <span>Tx bytes base64 encoded or message:</span>
            <button onclick={insertExampleTx} style="padding: 4px 8px; font-size: 12px;">
                Example tx
            </button>
        </div>
        <div class="box">
            <textarea
                bind:this={txBytesTextarea}
                value={txBytesInput}
                oninput={(e) => updateTxBytes((e.target as HTMLTextAreaElement)?.value || '')}
                placeholder="base64 transaction bytes or message"
            ></textarea>
        </div>
    </div>

    <!-- Signing buttons -->
    <div style="margin: 20px 0; display: flex; gap: 10px;">
        <button
            onclick={signTransaction}
            style="padding: 8px 16px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
            Sign Transaction
        </button>
        <button
            onclick={signPersonalMessage}
            style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
            Sign Personal Message
        </button>
        <button
            onclick={dryRunTransaction}
            style="padding: 8px 16px; background: #ffc107; color: #333; border: none; border-radius: 4px; cursor: pointer;"
        >
            Dry Run Transaction
        </button>
    </div>
    {#if dryRunResult}
        <div class="dry-run-result">
            <button
                class="dry-run-close"
                onclick={() => (dryRunResult = undefined)}
                aria-label="Close dry run result"
                title="Close">&#10005;</button
            >
            <div class="dry-run-title">Dry Run Result</div>
            <JsonToggleView value={dryRunResult} />
        </div>
    {/if}

    <div style="margin: 20px 0;">
        <div style="margin-bottom: 6px; font-weight: bold;">
            {signatureTypeLabel || 'Signature'}
        </div>
        <textarea
            bind:this={signatureTextarea}
            value={signatureResult}
            oninput={(e) => (signatureResult = (e.target as HTMLTextAreaElement).value)}
            placeholder="Signature (base64)"
            style="width: 100%; height: 60px;"
        ></textarea>

        <!-- Signature Verification Status -->
        {#if signatureVerificationStatus === 'checking'}
            <div style="margin-top: 8px; padding: 8px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; color: #856404;">
                🔍 Verifying signature...
            </div>
        {/if}

        {#if signatureVerificationStatus === 'valid'}
            <div style="margin-top: 8px; padding: 8px; background: #d4edda; border: 1px solid #28a745; border-radius: 4px; color: #155724;">
                ✓ Signature is valid
            </div>
        {/if}

        {#if signatureVerificationStatus === 'invalid'}
            <div style="margin-top: 8px; padding: 8px; background: #f8d7da; border: 1px solid #dc3545; border-radius: 4px; color: #721c24;">
                ✗ Invalid signature
                {#if signatureVerificationError}
                    <div style="margin-top: 4px; font-size: 12px;">
                        {signatureVerificationError}
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Public Key and Address Display -->
        {#if signaturePublicKey}
            <div style="margin-top: 12px; padding: 10px; background: #e7f3ff; border: 1px solid #007acc; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 6px;">Public Key:</div>
                <div style="word-break: break-all; font-family: monospace; font-size: 12px;">
                    {signaturePublicKey}
                </div>
            </div>
        {/if}

        {#if signatureAddress}
            <div style="margin-top: 8px; padding: 10px; background: #e7f3ff; border: 1px solid #007acc; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 6px;">Address:</div>
                <div style="word-break: break-all; font-family: monospace; font-size: 12px;">
                    {signatureAddress}
                </div>
            </div>
        {/if}

        <button
            onclick={submitSignedTx}
            style="margin-top: 8px; padding: 8px 16px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
            Submit Signed Tx
        </button>
    </div>
    {#if submitResult}
        <div style="margin: 20px 0;">
            <TransactionView value={submitResult} />
        </div>
    {/if}
    {#if error}
        <div
            style="color: red; margin: 10px 0; padding: 10px; border: 1px solid #fcc; border-radius: 4px;"
        >
            {error}
        </div>
    {/if}

    <TransactionView {value} />
</main>

<style>
    textarea {
        width: 100%;
        height: 100px;
    }

    .dry-run-result {
        margin: 20px 0;
        padding: 10px;
        border: 1px solid #c4ab5f6d;
        border-radius: 4px;
        position: relative;
    }
    .dry-run-close {
        position: absolute;
        top: 8px;
        right: 8px;
        color: #850804;
        font-size: 22px;
        cursor: pointer;
        line-height: 1;
        padding: 0.2rem;
    }
</style>

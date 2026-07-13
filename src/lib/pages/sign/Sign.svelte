<script lang="ts">
    import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import type { MoveAuthenticatorData } from '@iota/iota-sdk/keypairs/move-authenticator';
    import { Transaction, TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import { get } from 'svelte/store';

    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import MoveAuthenticatorDetails from '../../components/MoveAuthenticatorDetails.svelte';
    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient, getLegacyClient, getSelectedChain } from '../../utils/client';
    import { copyToClipboard } from '../../utils/formatting';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { activeAddress } from '../../utils/signer-data';
    import { base64Decode as fromBase64, toB64 as toBase64 } from '../../utils/wasm-sdk';
    import { getActiveWallet } from '../../utils/web-wallet';
    import type { SignaturePubkeyPair, VerificationStatus } from './sign-utils';
    import { verifySignature } from './sign-utils';

    // Use query parameters for the transaction bytes and signature(s)
    const queryParamValues = usePageQueryParams({
        tx: '', // Query parameter for transaction bytes
        signature: '', // Query parameter for the signature(s), comma-separated base64
    });

    // A transaction can carry several signatures: the sender signature and an
    // optional sponsor signature, each of which may itself be a multisig. We
    // allow up to MAX_SIGNATURES fields (10 sender + 10 sponsor) while still
    // defaulting to a single field.
    const MAX_SIGNATURES = 20;

    interface SignatureEntry {
        value: string;
        status: VerificationStatus;
        error: string;
        pubkeyPairs: SignaturePubkeyPair[] | null;
        moveAuthenticator: MoveAuthenticatorData | null;
    }

    function createSignatureEntry(value = ''): SignatureEntry {
        return { value, status: null, error: '', pubkeyPairs: null, moveAuthenticator: null };
    }

    let error = '';
    let value: any;
    let signatures: SignatureEntry[] = [createSignatureEntry()];
    let submitResult: any = null;
    let signatureTypeLabel = '';
    let txBytesInput = '';
    let dryRunResult: any;
    let signedTxBytes = ''; // Combined signed transaction bytes

    // Tracks the last signature param we read from / wrote to the URL so the
    // reactive sync below can ignore our own updates and avoid clobbering input.
    let lastSignatureParam = '';
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
                txBytes = new Uint8Array(fromBase64(inputString));
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            const legacyClient = getLegacyClient();
            const result = await legacyClient.dryRunTransactionBlock({
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

    // Sync signatures from the URL. Only `$queryParamValues.signature` is a
    // dependency here, so this runs when the store emits (initial load, shared
    // link, back/forward) but not when the user edits a field locally. The
    // `lastSignatureParam` guard ignores echoes of our own writes.
    $: syncSignaturesFromUrl($queryParamValues.signature);

    function syncSignaturesFromUrl(urlValue: string) {
        if (urlValue === lastSignatureParam) {
            return;
        }
        lastSignatureParam = urlValue;
        signatures = urlValue
            ? urlValue.split(',').map((v) => createSignatureEntry(v))
            : [createSignatureEntry()];
    }

    // Function to update transaction bytes and query parameter
    function updateTxBytes(newTxBytes: string) {
        txBytesInput = newTxBytes;
        updatePageQueryParams({ tx: newTxBytes || null });

        // Process the transaction bytes
        processTransactionBytes(newTxBytes);
    }

    // Persist the current (non-empty) signatures into the URL query parameter.
    function pushSignaturesToUrl() {
        const param = signatures
            .map((s) => s.value.trim())
            .filter(Boolean)
            .join(',');
        lastSignatureParam = param;
        updatePageQueryParams({ signature: param || null });
    }

    // Update a single signature field's value.
    function updateSignatureValue(index: number, newValue: string) {
        signatures[index].value = newValue;
        signatures = [...signatures];
        pushSignaturesToUrl();
    }

    // Add an empty signature field (up to MAX_SIGNATURES).
    function addSignatureField() {
        if (signatures.length >= MAX_SIGNATURES) {
            return;
        }
        signatures = [...signatures, createSignatureEntry()];
    }

    // Remove a signature field (at least one field always remains).
    function removeSignatureField(index: number) {
        if (signatures.length <= 1) {
            return;
        }
        signatures = signatures.filter((_, i) => i !== index);
        pushSignaturesToUrl();
    }

    // Place a wallet-produced signature into the first empty field, or append a
    // new field if all are filled. Lets the user sign with several accounts in
    // sequence by switching the active address between clicks.
    function addOrFillSignature(signature: string) {
        const emptyIndex = signatures.findIndex((s) => !s.value.trim());
        if (emptyIndex >= 0) {
            signatures[emptyIndex].value = signature;
            signatures = [...signatures];
        } else if (signatures.length < MAX_SIGNATURES) {
            signatures = [...signatures, createSignatureEntry(signature)];
        } else {
            error = `Maximum of ${MAX_SIGNATURES} signatures reached`;
            return;
        }
        pushSignaturesToUrl();
    }

    // Function to process transaction bytes and update the value
    function processTransactionBytes(inputString: string) {
        if (!inputString) {
            value = null;
            return;
        }
        try {
            let txBytes = new Uint8Array(fromBase64(inputString));
            value = TransactionDataBuilder.fromBytes(txBytes);
            // Store the original transaction bytes for display
            value.transactionBytes = inputString;
        } catch (e) {
            console.log('error TransactionDataBuilder', e);
            try {
                const signedData = IotaBcs.SenderSignedData.parse(
                    new Uint8Array(fromBase64(inputString)),
                );
                value = signedData[0];
                // Store the original signed transaction bytes
                value.rawTransaction = inputString;
                // Extract unsigned transaction bytes for display
                const v1Data = signedData[0].intentMessage.value.V1;
                if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
                    const normalizedTxData = {
                        version: 2 as const,
                        sender: v1Data.sender,
                        inputs: v1Data.kind.ProgrammableTransaction.inputs,
                        commands: v1Data.kind.ProgrammableTransaction.commands,
                        gasData: v1Data.gasData,
                        expiration: v1Data.expiration,
                    };
                    const txDataBuilder = new TransactionDataBuilder(normalizedTxData);
                    value.transactionBytes = toBase64(txDataBuilder.build());
                }
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

            const inputString = txBytesInput.trim();
            if (!inputString) {
                error = 'Please enter transaction bytes';
                return;
            }

            const wallet = getActiveWallet();
            const senderAddress = get(activeAddress);

            if (!wallet) {
                error = 'No wallet available';
                return;
            }

            if (!wallet.signTransaction) {
                error = 'Current wallet does not support transaction signing';
                return;
            }

            // Parse transaction bytes
            let transactionBytes: Uint8Array;

            try {
                transactionBytes = new Uint8Array(fromBase64(inputString));
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            const result = await wallet.signTransaction({
                transaction: Transaction.from(transactionBytes),
                account: { address: senderAddress },
                // @ts-ignore
                chain: getSelectedChain(),
            });

            signatureTypeLabel = 'Transaction Signature';
            addOrFillSignature(result.signature);
        } catch (e) {
            error = `Error signing transaction: ${e}`;
            console.error('Error signing transaction:', e);
        }
    }

    async function signPersonalMessage() {
        try {
            error = '';

            const inputString = txBytesInput.trim();
            if (!inputString) {
                error = 'Please enter a message';
                return;
            }

            const wallet = getActiveWallet();
            const senderAddress = get(activeAddress);

            if (!wallet) {
                error = 'No wallet available';
                return;
            }

            if (!wallet.signPersonalMessage) {
                error = 'Current wallet does not support message signing';
                return;
            }

            // Convert string to bytes
            const messageBytes = new TextEncoder().encode(inputString);

            const result = await wallet.signPersonalMessage({
                message: messageBytes,
                account: { address: senderAddress },
            });

            signatureTypeLabel = 'Message Signature';
            addOrFillSignature(result.signature);
        } catch (e) {
            error = `Error signing message: ${e}`;
        }
    }
    let verificationTimeout: ReturnType<typeof setTimeout> | undefined;

    // Verify every non-empty signature against the current transaction bytes and
    // store the result on each entry.
    async function verifyAllSignatures() {
        const entries = signatures;
        await Promise.all(
            entries.map(async (entry) => {
                if (!entry.value.trim()) {
                    entry.status = null;
                    entry.error = '';
                    entry.pubkeyPairs = null;
                    entry.moveAuthenticator = null;
                    return;
                }
                const result = await verifySignature(txBytesInput, entry.value);
                entry.status = result.status;
                entry.error = result.error;
                entry.pubkeyPairs = result.pubkeyPairs;
                entry.moveAuthenticator = result.moveAuthenticator ?? null;
            }),
        );
        signatures = [...signatures];
    }

    // Build the combined signed transaction bytes from the tx bytes and all
    // non-empty signatures (sender + sponsor, each possibly a multisig).
    function createSignedTxBytes() {
        try {
            const sigs = signatures.map((s) => s.value.trim()).filter(Boolean);
            if (!txBytesInput.trim() || sigs.length === 0) {
                signedTxBytes = '';
                return;
            }

            // Parse the transaction data from bytes
            const txBytes = new Uint8Array(fromBase64(txBytesInput.trim()));
            const transactionData = IotaBcs.TransactionData.parse(txBytes);

            // Create the SenderSignedData structure
            const senderSignedData = [
                {
                    intentMessage: {
                        intent: {
                            scope: { TransactionData: null },
                            version: { V0: null },
                            appId: { Iota: null },
                        },
                        value: transactionData,
                    },
                    txSignatures: sigs, // signatures are already base64 encoded
                },
            ];

            // Serialize to BCS and encode as base64
            const senderSignedDataBytes =
                IotaBcs.SenderSignedData.serialize(senderSignedData).toBytes();
            signedTxBytes = toBase64(senderSignedDataBytes);
        } catch (e) {
            console.error('Error creating signed transaction bytes:', e);
            signedTxBytes = '';
        }
    }

    // Key over signature values + tx bytes so the block below re-runs whenever
    // a field is edited, added, removed, or the transaction changes.
    $: signaturesKey = signatures.map((s) => s.value).join('') + ' ' + txBytesInput;

    $: onSignaturesChanged(signaturesKey);

    // Watch for changes and trigger verification (debounced) plus rebuild the
    // combined signed transaction bytes. The `_key` argument only declares the
    // reactive dependency.
    function onSignaturesChanged(_key: string) {
        if (verificationTimeout) {
            clearTimeout(verificationTimeout);
        }
        createSignedTxBytes();
        if (signatures.some((s) => s.value.trim())) {
            verificationTimeout = setTimeout(() => {
                verifyAllSignatures();
            }, 300);
        }
    }

    async function submitSignedTx() {
        try {
            error = '';
            submitResult = null;

            const inputString = txBytesInput.trim();
            const signatureStrings = signatures.map((s) => s.value.trim()).filter(Boolean);
            if (!inputString) {
                error = 'Please enter transaction bytes';
                return;
            }
            if (signatureStrings.length === 0) {
                error = 'Please enter a signature';
                return;
            }

            let txBytes: Uint8Array;
            try {
                txBytes = new Uint8Array(fromBase64(inputString));
            } catch (e) {
                error = 'Invalid base64 transaction bytes';
                return;
            }

            for (const signatureString of signatureStrings) {
                try {
                    fromBase64(signatureString);
                } catch (e) {
                    error = 'Invalid base64 signature';
                    return;
                }
            }

            const client = getLegacyClient();
            const result = await client.executeTransactionBlock({
                transactionBlock: txBytes,
                signature: signatureStrings,
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
    <div style="margin-top: 20px; display: flex; gap: 10px;">
        <button onclick={signTransaction}> Sign Tx </button>
        <button onclick={signPersonalMessage}> Sign Message </button>
        <button onclick={dryRunTransaction}> Dry Run </button>
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

    <div>
        <div class="signatures-header">
            <span style="font-weight: bold;">{signatureTypeLabel || 'Signatures'}</span>
            <button
                onclick={addSignatureField}
                disabled={signatures.length >= MAX_SIGNATURES}
                class="add-signature-button"
                title={signatures.length >= MAX_SIGNATURES
                    ? `Maximum of ${MAX_SIGNATURES} signatures`
                    : 'Add another signature (e.g. sponsor signature)'}
            >
                + Add signature
            </button>
        </div>

        {#each signatures as entry, index}
            <div class="signature-block">
                <div class="signature-block-header">
                    <span>Signature #{index + 1}</span>
                    {#if signatures.length > 1}
                        <button
                            class="remove-signature-button"
                            onclick={() => removeSignatureField(index)}
                            title="Remove this signature"
                        >
                            Remove
                        </button>
                    {/if}
                </div>
                <textarea
                    value={entry.value}
                    oninput={(e) =>
                        updateSignatureValue(index, (e.target as HTMLTextAreaElement).value)}
                    placeholder="Signature (base64)"
                    class="signature-textarea"
                ></textarea>

                <!-- Signature Verification Status -->
                {#if entry.status === 'checking'}
                    <div style="margin-top: 8px; padding: 8px; border-radius: 4px;">
                        🔍 Verifying signature...
                    </div>
                {/if}

                {#if entry.status === 'valid'}
                    <div style="margin-top: 8px; padding: 8px; border-radius: 4px;">
                        ✓ Signature is valid
                    </div>
                {/if}

                {#if entry.status === 'invalid'}
                    <div style="margin-top: 8px; padding: 8px; border-radius: 4px;">
                        ✗ Invalid signature
                        {#if entry.error}
                            <div style="margin-top: 4px; font-size: 12px;">
                                {entry.error}
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if entry.status === 'on_chain_only'}
                    <div style="margin-top: 8px; padding: 8px; border-radius: 4px;">
                        ⓘ Signature parsed. MoveAuthenticator validity depends on on-chain execution
                        and cannot be verified here.
                    </div>
                {/if}

                {#if entry.moveAuthenticator}
                    <div class="signature-details-container">
                        <div class="signature-item">
                            <div class="signature-header">MoveAuthenticator</div>
                            <div class="signature-details">
                                <MoveAuthenticatorDetails data={entry.moveAuthenticator} />
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Public Key and Address Display -->
                {#if entry.pubkeyPairs}
                    <div class="signature-details-container">
                        {#each entry.pubkeyPairs as pair, pairIndex}
                            <div class="signature-item">
                                <div class="signature-header">
                                    Public key #{pairIndex + 1} ({pair.signatureScheme})
                                </div>
                                <div class="signature-details">
                                    <div class="detail-item">
                                        <span class="detail-label">Public key:</span>
                                        <span class="detail-value">{pair.publicKey.toBase64()}</span
                                        >
                                        <button
                                            class="copy-button"
                                            onclick={async () =>
                                                await copyToClipboard(pair.publicKey.toBase64())}
                                            >Copy</button
                                        >
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Public key with flag:</span>
                                        <span class="detail-value"
                                            >{pair.publicKey.toIotaPublicKey()}</span
                                        >
                                        <button
                                            class="copy-button"
                                            onclick={async () =>
                                                await copyToClipboard(
                                                    pair.publicKey.toIotaPublicKey(),
                                                )}>Copy</button
                                        >
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Address:</span>
                                        <span class="detail-value"
                                            >{pair.publicKey.toIotaAddress()}</span
                                        >
                                        <button
                                            class="copy-button"
                                            onclick={async () =>
                                                await copyToClipboard(
                                                    pair.publicKey.toIotaAddress(),
                                                )}>Copy</button
                                        >
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Signature:</span>
                                        <span class="detail-value"
                                            >{Buffer.from(pair.signature).toString('base64')}</span
                                        >
                                        <button
                                            class="copy-button"
                                            onclick={async () =>
                                                await copyToClipboard(
                                                    Buffer.from(pair.signature).toString('base64'),
                                                )}>Copy</button
                                        >
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}

        <!-- Signed Transaction Bytes Output -->
        {#if signedTxBytes}
            <div style="margin-top: 20px;">
                <div
                    style="margin-bottom: 6px; font-weight: bold; display: flex; align-items: center; gap: 10px;"
                >
                    Signed Transaction Bytes
                    <button
                        class="copy-button"
                        onclick={async () => await copyToClipboard(signedTxBytes)}
                        style="padding: 4px 10px; font-size: 12px;"
                    >
                        Copy
                    </button>
                </div>
                <textarea
                    value={signedTxBytes}
                    readonly
                    placeholder="Signed transaction bytes (base64)"
                    class="signature-textarea"
                    style="height: 100px;"
                ></textarea>
                <div style="margin-top: 4px; font-size: 12px; color: #666;">
                    This combines the transaction bytes with all signatures and can be submitted to
                    the network.
                </div>
            </div>
        {/if}

        <button onclick={submitSignedTx}> Submit Signed Tx </button>
    </div>
    {#if submitResult}
        <div style="margin: 20px 0;">
            <TransactionView value={submitResult} />
        </div>
    {/if}
    {#if error}
        <div style="color: #ef4444; margin: 10px 0;">
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

    .signature-textarea {
        height: 40px;
        min-height: 60px;
    }

    .signatures-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
    }

    .add-signature-button {
        padding: 4px 10px;
        font-size: 12px;
    }

    .add-signature-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .signature-block {
        margin-bottom: 16px;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
    }

    .signature-block-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
        font-weight: bold;
    }

    .remove-signature-button {
        padding: 2px 8px;
        font-size: 12px;
        background: #850804;
        color: white;
        border: 1px solid #a33;
        border-radius: 4px;
        cursor: pointer;
        font-weight: normal;
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

    .signature-details-container {
        margin-top: 12px;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
    }

    .signature-item {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .signature-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .signature-header {
        font-weight: bold;
        margin-bottom: 8px;
    }

    .signature-details {
        display: block;
    }

    .detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
    }

    .detail-label {
        font-weight: bold;
        flex-shrink: 0;
        width: 160px;
        text-align: right;
        padding-right: 8px;
    }

    .detail-value {
        word-break: break-all;
        font-family: monospace;
        font-size: 12px;
        flex-shrink: 0;
    }

    .copy-button {
        flex-shrink: 0;
        margin-left: 8px;
        padding: 2px 6px;
        font-size: 10px;
        background: #333;
        color: white;
        border: 1px solid #666;
        border-radius: 4px;
        cursor: pointer;
    }

    button {
        border-radius: 4px;
    }
</style>

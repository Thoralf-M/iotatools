<script lang="ts">
    import { fromB64, toB64 } from '@iota/bcs';
    import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import { Transaction, TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import { get } from 'svelte/store';

    import TransactionView from '../components/TransactionView.svelte';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';
    import { activeAddress, iota_wallets } from '../lib/signer-data';

    // Use query parameters for the transaction bytes
    const queryParamValues = usePageQueryParams({
        tx: '', // Query parameter for transaction bytes
    });

    let error = '';
    let value: any;
    let signatureResult = '';
    let signatureTypeLabel = '';
    let txBytesInput = '';

    // Reactive assignment from query parameters
    $: txBytesInput = $queryParamValues.tx;

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
            let txBytes = fromB64(inputString);
            value = TransactionDataBuilder.fromBytes(txBytes);
        } catch (e) {
            console.log('error TransactionDataBuilder', e);
            try {
                value = IotaBcs.SenderSignedData.parse(fromB64(inputString))[0];
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
                transactionBytes = fromB64(inputString);
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
    </div>

    <!-- Signature result -->
    {#if signatureResult}
        <div style="margin: 20px 0; padding: 10px; border: 1px solid #e9ecef; border-radius: 4px;">
            <div style="margin-bottom: 6px; font-weight: bold;">{signatureTypeLabel}</div>
            <div>{signatureResult}</div>
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
</style>

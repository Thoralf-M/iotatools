<script lang="ts">
    import { fromBase64, toBase64 } from '@iota/bcs';
    import { bcs } from '@iota/iota-sdk/bcs';
    import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
    import { TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import { onMount } from 'svelte';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient, getSelectedNetworkConfig } from '../lib/client';
    import { getTransactionData } from '../lib/transaction-view';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';

    // Query parameter integration
    const queryParamDefaults = {
        txInput: '',
    };

    const pageParams = usePageQueryParams(queryParamDefaults);

    let txBytesTextarea: HTMLTextAreaElement;
    let txInput = '';
    let transactionData: any = null;
    let error = '';
    let loading = false;
    let inputType: 'base64' | 'base58' | 'json' | null = null;

    // GraphQL pagination
    let currentCursor: string | null = null;
    let hasNextPage = false;
    let loadingLatest = false;
    let loadingPrevious = false;

    // Initialize from query parameters
    onMount(() => {
        const params = $pageParams;
        if (params.txInput && txBytesTextarea) {
            txBytesTextarea.value = params.txInput;
            const event = new Event('input', { bubbles: true });
            txBytesTextarea.dispatchEvent(event);
        }
    });

    function detectInputType(input: string): 'base64' | 'base58' | 'json' | null {
        const trimmed = input.trim();

        // Check if it's JSON
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                JSON.parse(trimmed);
                return 'json';
            } catch {
                return null;
            }
        }

        // Check if it's base58 (transaction digest format)
        // Base58 uses characters [1-9A-HJ-NP-Za-km-z] and is typically 43-44 chars for tx digests
        if (/^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(trimmed)) {
            return 'base58';
        }

        // Check if it's base64
        if (/^[A-Za-z0-9+/]+=*$/.test(trimmed)) {
            return 'base64';
        }

        return null;
    }

    async function fetchTransactionByDigest(digest: string) {
        try {
            loading = true;
            error = '';
            transactionData = null;

            const client = getClient();
            const tx = await client.getTransactionBlock({
                digest,
                options: {
                    showInput: true,
                    showRawInput: true,
                    showEffects: true,
                    showEvents: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                    showRawEffects: true,
                },
            });

            transactionData = tx;
            // If the API response includes rawTransaction, extract it for dry run functionality
            if (tx.rawTransaction) {
                transactionData.transactionBytes = tx.rawTransaction;
            }
            inputType = 'base58';

            // Update query parameters with the digest
            updatePageQueryParams({ txInput: digest });
        } catch (e: any) {
            error = `Failed to fetch transaction: ${e.message || e}`;
            transactionData = null;
        } finally {
            loading = false;
        }
    }

    async function processInput() {
        const input = txInput.trim();
        if (!input) {
            error = 'Please enter transaction data';
            return;
        }

        const type = detectInputType(input);

        if (!type) {
            error =
                'Invalid input format. Expected base64 transaction bytes, base58 digest, or JSON.';
            return;
        }

        if (type === 'base58') {
            await fetchTransactionByDigest(input);
            return;
        }

        try {
            loading = true;
            error = '';
            transactionData = null;

            if (type === 'json') {
                const parsed = JSON.parse(input);
                transactionData = parsed;
                inputType = 'json';
            } else if (type === 'base64') {
                // Try multiple decoding methods like in Converter page
                let decoded = false;

                // First try: TransactionDataBuilder (unsigned transaction)
                try {
                    const txBytes = fromBase64(input);
                    transactionData = TransactionDataBuilder.fromBytes(txBytes);
                    // Add the original transaction bytes for dry run functionality
                    transactionData.transactionBytes = input;
                    inputType = 'base64';
                    decoded = true;
                } catch (e1) {
                    console.log('TransactionDataBuilder failed, trying JSON then SenderSignedData:', e1);

                    // Second try: Check if it's a JSON string containing signed transaction data
                    try {
                        const jsonData = JSON.parse(input);
                        if (jsonData && jsonData.intentMessage && jsonData.txSignatures) {
                            // This is a JSON signed transaction format
                            transactionData = getTransactionData(jsonData);
                            inputType = 'json';
                            decoded = true;
                        } else {
                            throw new Error('Not a signed transaction JSON format');
                        }
                    } catch (e2) {
                        console.log('JSON parsing failed, trying SenderSignedData BCS:', e2);

                        // Third try: SenderSignedData (signed transaction)
                        try {
                            const txBytes = fromBase64(input);
                            const signedData = bcs.SenderSignedData.parse(txBytes);
                            transactionData = signedData[0];
                            // For dry run, we need just the transaction bytes without signatures
                            // Extract the transaction part from the signed data and build it properly
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
                                const transactionBytesForDryRun = toBase64(txDataBuilder.build());
                                transactionData.transactionBytes = transactionBytesForDryRun;
                            } else {
                                throw new Error('Unsupported transaction kind');
                            }
                            inputType = 'base64';
                            decoded = true;
                        } catch (e3) {
                            console.log('SenderSignedData failed:', e3);
                            throw new Error(
                                `Failed to decode base64 transaction. Tried TransactionDataBuilder, JSON, and SenderSignedData formats.`,
                            );
                        }
                    }
                }
            }

            updatePageQueryParams({ txInput: input });
        } catch (e: any) {
            error = `Failed to process transaction: ${e.message || e}`;
            transactionData = null;
        } finally {
            loading = false;
        }
    }

    async function fetchLatestPTB() {
        try {
            loadingLatest = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const graphqlClient = new IotaGraphQLClient({
                url: config.graphql,
            });

            const result = await graphqlClient.query({
                query: `
                    query {
                        transactionBlocks(last: 1, filter: {kind: PROGRAMMABLE_TX}) {
                            nodes {
                                digest
                            }
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                `,
            });

            const nodes = result.data?.transactionBlocks?.nodes;
            const pageInfo = result.data?.transactionBlocks?.pageInfo;

            if (!nodes || nodes.length === 0) {
                error = 'No PTB transactions found';
                return;
            }

            const digest = nodes[0].digest;
            currentCursor = pageInfo?.startCursor || null;
            hasNextPage = pageInfo?.hasPreviousPage || false;
            // Update textarea with the digest
            txInput = digest;
            if (txBytesTextarea) {
                txBytesTextarea.value = digest;
            }
            await fetchTransactionByDigest(digest);
        } catch (e: any) {
            error = `Failed to fetch latest PTB: ${e.message || e}`;
        } finally {
            loadingLatest = false;
        }
    }

    async function fetchPreviousPTB() {
        if (!currentCursor) {
            error = 'No cursor available for pagination';
            return;
        }

        try {
            loadingPrevious = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const graphqlClient = new IotaGraphQLClient({
                url: config.graphql,
            });

            const result = await graphqlClient.query({
                query: `
                    query {
                        transactionBlocks(before: "${currentCursor}", last: 1, filter: {kind: PROGRAMMABLE_TX}) {
                            nodes {
                                digest
                            }
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                `,
            });

            const nodes = result.data?.transactionBlocks?.nodes;
            const pageInfo = result.data?.transactionBlocks?.pageInfo;

            if (!nodes || nodes.length === 0) {
                error = 'No more PTB transactions found';
                return;
            }

            const digest = nodes[0].digest;
            currentCursor = pageInfo?.startCursor || null;
            hasNextPage = pageInfo?.hasPreviousPage || false;

            // Update textarea with the digest
            txInput = digest;
            if (txBytesTextarea) {
                txBytesTextarea.value = digest;
            }

            await fetchTransactionByDigest(digest);
        } catch (e: any) {
            error = `Failed to fetch previous PTB: ${e.message || e}`;
        } finally {
            loadingPrevious = false;
        }
    }

    let inputTimeout: ReturnType<typeof setTimeout> | null = null;

    function handleInput(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        txInput = target.value;
        updatePageQueryParams({ txInput: txInput });

        // Clear existing timeout
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }

        // Debounce the processing to avoid processing on every keystroke
        if (txInput.trim()) {
            inputTimeout = setTimeout(() => {
                processInput();
            }, 500);
        } else {
            // Clear transaction data if input is empty
            transactionData = null;
            error = '';
        }
    }

    const exampleSignedTx =
        'AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDts1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=';
    const exampleTx =
        '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';

    function loadExample(example: string) {
        if (txBytesTextarea) {
            txBytesTextarea.value = example;
            txInput = example;
            updatePageQueryParams({ txInput: example });
            // Automatically process the example
            processInput();
        }
    }
</script>

<div class="transaction-page">
    <h2>Transaction Viewer</h2>

    <div class="input-section">
        <label for="tx-input">
            Tx digest (base58), Tx bytes (base64), or JSON:
            <textarea
                id="tx-input"
                bind:this={txBytesTextarea}
                placeholder="Enter transaction bytes (base64), transaction digest (base58), or JSON..."
                rows="6"
                oninput={handleInput}
            ></textarea>
        </label>

        <div class="button-group">
            <button onclick={fetchLatestPTB} disabled={loadingLatest}>
                {loadingLatest ? 'Loading...' : 'Fetch Latest PTB'}
            </button>

            <button onclick={fetchPreviousPTB} disabled={loadingPrevious || !hasNextPage}>
                {loadingPrevious ? 'Loading...' : 'Previous PTB'}
            </button>

            <div class="divider"></div>

            <span class="examples-label">Examples:</span>
            <button class="example-btn" onclick={() => loadExample(exampleTx)}>
                Example Tx (base64)
            </button>
            <button class="example-btn" onclick={() => loadExample(exampleSignedTx)}>
                Example Signed Tx (base64)
            </button>
        </div>
    </div>

    {#if loading}
        <div class="loading-message">
            <div class="spinner"></div>
            <span>Loading transaction...</span>
        </div>
    {/if}

    {#if error}
        <div class="error-message">
            <strong>Error:</strong>
            {error}
        </div>
    {/if}

    {#if transactionData && !loading}
        <div class="transaction-result">
            <div class="result-header">
                <h3>Transaction Data</h3>
                {#if inputType}
                    <span class="input-type-badge">{inputType}</span>
                {/if}
            </div>
            <TransactionView value={transactionData} />
        </div>
    {/if}
</div>

<style>
    .transaction-page {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }

    h2 {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
    }

    .input-section {
        margin-bottom: 2rem;
    }

    label {
        display: block;
        margin-bottom: 1rem;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
    }

    textarea {
        width: 100%;
        padding: 0.75rem;
        margin-top: 0.5rem;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.85rem;
        resize: vertical;
    }

    textarea:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .button-group {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .divider {
        width: 1px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0 0.25rem;
    }

    button {
        padding: 0.6rem 1.2rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    button:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.3);
        border-color: rgba(59, 130, 246, 0.5);
        transform: translateY(-1px);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .loading-message {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: rgba(59, 130, 246, 1);
        display: flex;
        align-items: center;
        gap: 1rem;
        font-weight: 500;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-top-color: rgba(59, 130, 246, 1);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error-message {
        padding: 1rem;
        margin-bottom: 1.5rem;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        border-radius: 6px;
        color: #fca5a5;
    }

    .transaction-result {
        margin-top: 2rem;
    }

    .result-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .result-header h3 {
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-size: 1.2rem;
    }

    .input-type-badge {
        padding: 0.25rem 0.75rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(59, 130, 246, 1);
        text-transform: uppercase;
    }

    .examples-label {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
        font-size: 0.9rem;
    }

    .example-btn {
        padding: 0.5rem 1rem;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 6px;
        color: rgba(16, 185, 129, 1);
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .example-btn:hover {
        background: rgba(16, 185, 129, 0.25);
        border-color: rgba(16, 185, 129, 0.5);
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        .transaction-page {
            padding: 0.5rem;
        }

        h2 {
            font-size: 1.25rem;
        }

        .button-group {
            flex-direction: column;
            align-items: stretch;
        }

        .divider {
            display: none;
        }

        button {
            width: 100%;
        }

        .examples-section {
            flex-direction: column;
            align-items: stretch;
        }

        .example-btn {
            width: 100%;
        }
    }
</style>

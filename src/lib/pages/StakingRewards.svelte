<script lang="ts">
    import JsonToggleView from '../components/JsonToggleView.svelte';
    import StakingRewardsTable from '../components/StakingRewardsTable.svelte';
    import { EpochPTBAnalyzer } from '../epoch-ptb-analyzer';
    // @ts-ignore
    import exchangeRateCacheBinary from '../lib/exchange-rate-cache.bin?raw';
    import { activeAddress } from '../lib/signer-data';
    import {
        fetchReceivedStakeTransactions,
        fetchStakeTransactions,
        processStakeTransactionsWithExchangeRates,
        setInitialExchangeRateCacheFromBinary,
        type StakeObject,
        type ValidatorInfo,
    } from '../lib/staking-rewards/index';

    let address = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
    let epoch: number | '' = '';
    let epochLoading = false;
    let error = '';
    let transactions: any[] = [];
    let stakeObjects: StakeObject[] = [];
    let validatorInfo: Record<string, ValidatorInfo> = {};
    let loadingTxs = false;
    let loadingStep: string | null = null;
    let fetchReceivedTxs = true;

    // Initialize exchange rate cache on component load
    setInitialExchangeRateCacheFromBinary(exchangeRateCacheBinary);

    async function getCurrentEpochAndEndTimestamp() {
        try {
            error = '';
            epochLoading = true;
            const currentEpochId = await new EpochPTBAnalyzer().getCurrentEpoch();
            if (currentEpochId) {
                epoch = parseInt(currentEpochId);
            } else {
                error = 'Failed to fetch current epoch.';
            }
        } catch (err: any) {
            error = err?.toString() ?? 'Error fetching current epoch.';
        } finally {
            epochLoading = false;
        }
    }

    async function fetchTransactions() {
        error = '';
        transactions = [];
        stakeObjects = [];
        validatorInfo = {};
        loadingTxs = true;
        loadingStep = 'Fetching stake txs...';
        try {
            // Step 1: Fetch sent stake transactions
            loadingStep = 'Fetching stake txs...';
            const sentTxs = await fetchStakeTransactions(address);
            console.log('sentTxs:', sentTxs);

            let receivedTxs: any[] = [];
            if (fetchReceivedTxs) {
                // Step 2: Fetch received stake transactions
                loadingStep = 'Fetching received txs...';
                receivedTxs = await fetchReceivedStakeTransactions(address);
                console.log('receivedTxs:', receivedTxs);
            }

            // Step 3: Get current epoch and end timestamp
            loadingStep = 'Fetching epoch info...';
            await getCurrentEpochAndEndTimestamp();

            // A tx can be in both sent and received lists
            let uniqueTxs = [sentTxs, ...(fetchReceivedTxs ? receivedTxs : [])]
                .flat()
                .reduce((acc: any, tx: any) => {
                    if (!acc.some((t: any) => t.digest === tx.digest)) {
                        acc.push(tx);
                    }
                    return acc;
                }, []);

            // Step 4: Process transactions with exchange rates
            loadingStep = 'Fetching exchange rates...';
            const result = await processStakeTransactionsWithExchangeRates(
                uniqueTxs,
                epoch as number,
            );
            stakeObjects = result.stakeObjects;
            validatorInfo = result.validatorInfo;
            console.log(stakeObjects);
            transactions = uniqueTxs;

            console.log('fetching txs complete');
        } catch (err: any) {
            error = err?.toString() ?? 'Error fetching transactions.';
        } finally {
            loadingTxs = false;
            loadingStep = null;
        }
    }
</script>

<main>
    <div class="input-row">
        <button onclick={fetchTransactions} disabled={loadingTxs}>
            {loadingTxs ? (loadingStep ?? 'Loading...') : 'Fetch data'}
        </button>
        <span>
            address:
            <input bind:value={address} placeholder="address" size="67" />
            <button onclick={() => (address = $activeAddress)}> Set to active address </button>
        </span>
        <span>
            <button
                type="button"
                onclick={() => (fetchReceivedTxs = !fetchReceivedTxs)}
                disabled={loadingTxs}
                style="margin-left: 1rem;"
            >
                {fetchReceivedTxs ? 'Skip received txs' : 'Include received txs'}
            </button>
        </span>
    </div>
    {#if loadingTxs}
        <div style="text-align: left;">
            Loading can take over a minute, depending on the number of transactions/epochs.
        </div>
    {/if}
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
    <div>
        <h3>Staking Rewards:</h3>
        <StakingRewardsTable currentEpoch={epoch || 1} {stakeObjects} {validatorInfo} />
    </div>
    <details>
        <summary>Stake objects:</summary>
        <JsonToggleView value={stakeObjects} />
    </details>
    <details>
        <summary>Transactions:</summary>
        <JsonToggleView value={transactions} />
    </details>
</main>

<style>
    .input-row {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .input-row span {
        display: flex;
        align-items: center;
    }
    .input-row button {
        margin-left: 0.5rem;
    }
    .error-message {
        color: #d63031;
        margin-bottom: 1rem;
    }
</style>

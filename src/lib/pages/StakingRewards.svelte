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
    } from '../lib/staking-rewards/index';

    let address = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
    let epoch: number | '' = '';
    let epochLoading = false;
    let error = '';
    let transactions: any[] = [];
    let stakeObjects: StakeObject[] = [];
    let loadingTxs = false;

    // Initialize exchange rate cache on component load
    setInitialExchangeRateCacheFromBinary(exchangeRateCacheBinary);

    async function getCurrentEpoch() {
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
        loadingTxs = true;
        try {
            const sentTxs = await fetchStakeTransactions(address);
            const receivedTxs = await fetchReceivedStakeTransactions(address);

            await getCurrentEpoch();
            // Use the new refactored function
            stakeObjects = await processStakeTransactionsWithExchangeRates(
                [sentTxs, receivedTxs],
                epoch as number,
            );
            console.log(stakeObjects);
            transactions = [sentTxs, receivedTxs];

            console.log('fetching txs complete');
        } catch (err: any) {
            error = err?.toString() ?? 'Error fetching transactions.';
        } finally {
            loadingTxs = false;
        }
    }
</script>

<main>
    <div class="input-row">
        <button onclick={fetchTransactions} disabled={loadingTxs}>
            {loadingTxs ? 'Loading...' : 'Fetch data'}
        </button>
        <span>
            address:
            <input bind:value={address} placeholder="address" size="67" />
            <button onclick={() => (address = $activeAddress)}> Set to active address </button>
        </span>
    </div>
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
    <div>
        <h3>Staking Rewards:</h3>
        <StakingRewardsTable currentEpoch={epoch || 1} {stakeObjects} />
    </div>
    <div>
        <h3>Stake objects:</h3>
        <JsonToggleView value={stakeObjects} />
    </div>
    <div>
        <h3>Transactions:</h3>
        <JsonToggleView value={transactions} />
    </div>
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

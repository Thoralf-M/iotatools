<script lang="ts">
    import { onMount } from 'svelte';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import StakingRewardsTable from '../components/StakingRewardsTable.svelte';
    import { EpochPTBAnalyzer } from '../lib/epoch-ptb-analyzer';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';
    import { activeAddress, iota_accounts } from '../lib/signer-data';
    // @ts-ignore
    import exchangeRateCacheBinary from '../lib/staking-rewards/cache/exchange-rate-cache.bin?raw';
    import {
        fetchReceivedStakeTransactions,
        fetchStakeTransactions,
        processStakeTransactionsWithExchangeRates,
        setInitialExchangeRateCacheFromBinary,
        type StakeObject,
        type ValidatorInfo,
    } from '../lib/staking-rewards/index';

    // Use query parameters for the address field
    const queryParamValues = usePageQueryParams({
        address:
            $activeAddress || '0x5caab122e732ae3e00c374b7653f7d01b840891467cc157ca3f6b776b64c3fc1',
    });

    let address = '';
    let additionalAddresses: string[] = [];
    let useAllWalletAddresses = false;

    let initialActiveAddress = '';

    $: if (!initialActiveAddress) initialActiveAddress = $activeAddress;

    // Reactive assignment from query parameters
    $: address = $queryParamValues.address;

    // Automatically update address when activeAddress changes after initial load and from initial
    $: if ($activeAddress !== initialActiveAddress && $activeAddress && address !== $activeAddress)
        updateAddress($activeAddress);

    // Function to update address and query parameter
    function updateAddress(newAddress: string) {
        address = newAddress;
        updatePageQueryParams({ address: newAddress || null });
        $activeAddress = newAddress;
    }

    // Get all addresses to fetch (main + additional)
    $: allAddresses = (() => {
        if (useAllWalletAddresses && $iota_accounts.length > 0) {
            // Use all wallet addresses
            return $iota_accounts.map((acc) => acc.address).filter((addr) => addr && addr !== '0x');
        } else {
            // Use main address + any manually added addresses
            const addresses = [address, ...additionalAddresses].filter(
                (addr) => addr && addr.trim() !== '',
            );
            // Remove duplicates
            return [...new Set(addresses)];
        }
    })();

    function addAddress() {
        additionalAddresses = [...additionalAddresses, ''];
    }

    function removeAddress(index: number) {
        additionalAddresses = additionalAddresses.filter((_, i) => i !== index);
    }

    function updateAdditionalAddress(index: number, value: string) {
        additionalAddresses[index] = value;
        additionalAddresses = [...additionalAddresses];
    }

    let epoch: number | '' = '';
    let epochLoading = false;
    let error = '';
    let transactions: any[] = [];
    let stakeObjects: StakeObject[] = [];
    let validatorInfo: Record<string, ValidatorInfo> = {};
    let loadingTxs = false;
    let loadingStep: string | null = null;
    let fetchReceivedTxs = false;
    let showPriceColumns = true;
    let showValidatorColumns = true;

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

    async function loadExampleData() {
        error = '';
        transactions = [];
        stakeObjects = [];
        validatorInfo = {};
        loadingTxs = true;
        loadingStep = 'Loading example data...';
        try {
            // Step 1: Fetch sent stake transactions from public folder
            loadingStep = 'Loading sent transactions...';
            const sentUrl = new URL('/example-sent.json', import.meta.url).href.replace(
                'src/lib/pages/',
                '',
            );
            console.log('Fetching from:', sentUrl);
            const sentResponse = await fetch(sentUrl);
            if (!sentResponse.ok) {
                throw new Error(`Failed to fetch sent transactions: ${sentResponse.statusText}`);
            }
            const sentTxs = await sentResponse.json();
            console.log('sentTxs:', sentTxs);

            let receivedTxs: any[] = [];
            if (fetchReceivedTxs) {
                // Step 2: Fetch received stake transactions from public folder
                loadingStep = 'Loading received transactions...';
                const receivedUrl = new URL('/example-received.json', import.meta.url).href.replace(
                    'src/lib/pages/',
                    '',
                );
                console.log('Fetching from:', receivedUrl);
                const receivedResponse = await fetch(receivedUrl);
                if (!receivedResponse.ok) {
                    throw new Error(
                        `Failed to fetch received transactions: ${receivedResponse.statusText}`,
                    );
                }
                receivedTxs = await receivedResponse.json();
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
                allAddresses,
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
    async function fetchTransactions() {
        error = '';
        transactions = [];
        stakeObjects = [];
        validatorInfo = {};
        loadingTxs = true;
        loadingStep = 'Fetching stake txs...';
        try {
            // Fetch transactions for all addresses
            const allTxsPromises = allAddresses.map(async (addr, index) => {
                loadingStep = `Fetching stake txs for address ${index + 1}/${allAddresses.length}...`;
                const sentTxs = await fetchStakeTransactions(addr);

                let receivedTxs: any[] = [];
                if (fetchReceivedTxs) {
                    loadingStep = `Fetching received txs for address ${index + 1}/${allAddresses.length}...`;
                    receivedTxs = await fetchReceivedStakeTransactions(addr);
                }

                return { sentTxs, receivedTxs, address: addr };
            });

            const allTxsResults = await Promise.all(allTxsPromises);
            console.log('All transactions fetched:', allTxsResults);

            // Step 2: Get current epoch and end timestamp
            loadingStep = 'Fetching epoch info...';
            await getCurrentEpochAndEndTimestamp();

            // Step 3: Combine and deduplicate transactions
            const allTxs = allTxsResults
                .flatMap((result) => [
                    result.sentTxs,
                    ...(fetchReceivedTxs ? result.receivedTxs : []),
                ])
                .flat();

            let uniqueTxs = allTxs.reduce((acc: any, tx: any) => {
                if (!acc.some((t: any) => t.digest === tx.digest)) {
                    acc.push(tx);
                }
                return acc;
            }, []);

            // Step 4: Process transactions with exchange rates for all addresses
            loadingStep = 'Fetching exchange rates...';
            const result = await processStakeTransactionsWithExchangeRates(
                uniqueTxs,
                epoch as number,
                allAddresses,
            );
            stakeObjects = result.stakeObjects;
            validatorInfo = result.validatorInfo;
            console.log('Processed stake objects:', stakeObjects);
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

<main class="container">
    <div class="toolbar">
        <div
            style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1; flex-wrap: wrap;"
        >
            <input
                id="address-input"
                type="text"
                value={address}
                oninput={(e) => updateAddress((e.target as HTMLInputElement)?.value || '')}
                placeholder="Enter primary address (0x...)"
            />
        </div>

        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <label class="toggle-row">
                <div class="toggle-switch">
                    <input
                        type="checkbox"
                        bind:checked={useAllWalletAddresses}
                        disabled={loadingTxs}
                    />
                    <span class="slider"></span>
                </div>
                <div style="display: flex; flex-direction: column; line-height: 1.2;">
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <span class="toggle-label"> Use all wallet addresses </span>
                    </div>
                    <span style="font-size: 0.75rem; opacity: 0.7;"
                        >Fetch data for all connected wallet addresses</span
                    >
                </div>
            </label>

            <label class="toggle-row">
                <div class="toggle-switch">
                    <input type="checkbox" bind:checked={fetchReceivedTxs} disabled={loadingTxs} />
                    <span class="slider"></span>
                </div>
                <div style="display: flex; flex-direction: column; line-height: 1.2;">
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <span class="toggle-label"> Include received </span>
                        <div class="tooltip-container">
                            <span class="info-icon">ⓘ</span>
                            <div class="tooltip">
                                If staking normal, this is not needed, but if StakedIota objects
                                were transferred in a tx like validators get for their rewards, then
                                received txs must be included to find these StakedIota objects.
                            </div>
                        </div>
                    </div>
                    <span style="font-size: 0.75rem; opacity: 0.7;"
                        >Slower, checks received transactions</span
                    >
                </div>
            </label>

            <button onclick={fetchTransactions} disabled={loadingTxs} style="background: #059669;">
                {loadingTxs ? (loadingStep ?? 'Loading...') : 'Fetch Data'}
            </button>
        </div>
        <!-- only for development -->
        <!-- <button type="button" onclick={loadExampleData}> load example data </button> -->
    </div>

    {#if !useAllWalletAddresses && !loadingTxs}
        <details class="address-management">
            <summary>Manage additional addresses</summary>
            <div class="address-list">
                {#each additionalAddresses as addr, index}
                    <div class="address-item">
                        <input
                            type="text"
                            value={addr}
                            oninput={(e) =>
                                updateAdditionalAddress(
                                    index,
                                    (e.target as HTMLInputElement)?.value || '',
                                )}
                            placeholder="Enter additional address (0x...)"
                        />
                        <button onclick={() => removeAddress(index)} class="remove-btn"
                            >Remove</button
                        >
                    </div>
                {/each}
                <button onclick={addAddress} class="add-btn">Add Address</button>
            </div>
        </details>
    {/if}

    {#if allAddresses.length > 1}
        <div class="info-message">
            Fetching data for {allAddresses.length} addresses: {allAddresses
                .slice(0, 3)
                .map((a) => a.slice(0, 8) + '...')
                .join(', ')}
            {#if allAddresses.length > 3}
                and {allAddresses.length - 3} more
            {/if}
        </div>
    {/if}

    {#if loadingTxs}
        <div class="loading-message">
            Loading can take minutes, depending on the number of transactions/epochs.
        </div>
    {/if}
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
    <div class="summary-section">
        <StakingRewardsTable
            currentEpoch={epoch || 1}
            {stakeObjects}
            {validatorInfo}
            bind:showPriceColumns
            bind:showValidatorColumns
        />
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
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0;
        height: 100%;
        box-sizing: border-box;
    }

    @media (min-width: 768px) {
        .container {
            padding: 1rem;
        }
    }

    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        background: var(--background-card);
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }

    .toolbar input {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        flex-grow: 1;
        min-width: 200px;
    }

    .toolbar button {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .toolbar button:hover {
        background: var(--primary-hover);
        border-color: var(--accent-color);
    }

    .toolbar button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .summary-section {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.75rem;
    }

    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .summary-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-muted);
    }

    .error-message {
        color: #ef4444;
        padding: 0 0.5rem;
    }

    .loading-message {
        padding: 0 0.5rem;
        font-style: italic;
        opacity: 0.8;
    }

    .toggle-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        font-size: 0.9rem;
    }

    /* Toggle Switch */
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #475569;
        transition: 0.4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #059669;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #059669;
    }

    input:checked + .slider:before {
        transform: translateX(16px);
    }

    .tooltip-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: help;
    }

    .info-icon {
        font-size: 0.85rem;
        opacity: 0.7;
    }

    .tooltip {
        visibility: hidden;
        width: 250px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -125px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 0.8rem;
        line-height: 1.4;
        pointer-events: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }

    .tooltip-container:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }

    .address-management {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .address-management summary {
        cursor: pointer;
        user-select: none;
        font-weight: 500;
        padding: 0.25rem 0;
    }

    .address-management summary:hover {
        color: var(--accent-color);
    }

    .address-list {
        margin-top: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .address-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .address-item input {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
    }

    .remove-btn {
        background: #ef4444;
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
    }

    .remove-btn:hover {
        background: #dc2626;
    }

    .add-btn {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        align-self: flex-start;
    }

    .add-btn:hover {
        background: var(--primary-hover);
    }

    .info-message {
        background: rgba(5, 150, 105, 0.1);
        border: 1px solid rgba(5, 150, 105, 0.3);
        border-radius: 8px;
        padding: 0.75rem;
        color: #10b981;
        font-size: 0.9rem;
    }
</style>

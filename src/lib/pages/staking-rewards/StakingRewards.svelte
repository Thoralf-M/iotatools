<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { get } from 'svelte/store';

    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { activeAddress, iota_accounts } from '../../utils/signer-data';
    import { EpochPTBAnalyzer } from '../programmable-transaction-block';
    // @ts-ignore
    import exchangeRateCacheBinary from './cache/exchange-rate-cache.bin?raw';
    import epochTimestampsCacheJson from './cache/mainnet-epoch-timestamps-cache.json';
    import { fetchCurrentStakedObjects, fetchEpochTimestampsForDisplay } from './graphql-requests';
    import {
        fetchReceivedStakeTransactions,
        fetchStakeTransactions,
        processStakeTransactionsWithExchangeRates,
        setInitialExchangeRateCacheFromBinary,
        type StakeObject,
        type ValidatorInfo,
    } from './index';
    import StakingRewardsChart from './StakingRewardsChart.svelte';
    import StakingRewardsTable from './StakingRewardsTable.svelte';
    import { computeEpochData } from './table-utils';
    import {
        filterEpochsByTimeFrame,
        getStartEpochForTimeFrame,
        getTimeFrameDateRange,
        getTimeFrameDescription,
        TIME_FRAME_LABELS,
        type DateRange,
        type TimeFrame,
    } from './timeframe';

    // Query-param-backed fields. `addresses` is a comma/whitespace-separated
    // list used when the multi-address toggle is on; its presence on load
    // auto-enables that toggle. Timeframe + custom date bounds round-trip so
    // shared URLs preserve the full filter state.
    const queryParamValues = usePageQueryParams({
        address:
            $activeAddress || '0x5caab122e732ae3e00c374b7653f7d01b840891467cc157ca3f6b776b64c3fc1',
        addresses: '',
        timeFrame: 'all',
        customStart: '',
        customEnd: '',
    });

    // One-shot snapshot used to seed local state that's either bound with
    // `bind:value` (incompatible with reactive re-reads) or whose query-param
    // key is only relevant under certain conditions.
    const initialQueryParams = get(queryParamValues);

    function isValidTimeFrame(v: unknown): v is TimeFrame {
        return typeof v === 'string' && v in TIME_FRAME_LABELS;
    }

    let address = '';
    let textareaValue = initialQueryParams.addresses;
    let useMultipleAddresses = initialQueryParams.addresses.trim() !== '';
    let hasAutoAddedPrimary = false;
    // Treat a URL-supplied address list as pre-edited so the auto-add-primary
    // effect below doesn't clobber it on mount.
    let userHasEditedTextarea = initialQueryParams.addresses.trim() !== '';

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

    // Get all addresses to fetch
    $: allAddresses = (() => {
        const addresses = useMultipleAddresses ? additionalAddresses : address ? [address] : [];
        return [...new Set(addresses.filter((addr) => addr && addr.trim() !== ''))];
    })();

    function parseAddresses(value: string): string[] {
        return value
            .split(/[, \n]+/)
            .map((s) => s.trim())
            .filter((s) => s);
    }

    $: additionalAddresses = useMultipleAddresses ? parseAddresses(textareaValue) : [];
    $: invalidAddresses = additionalAddresses.filter((addr) => !isValidIotaAddress(addr));
    $: duplicateAddresses = additionalAddresses.filter(
        (addr, index) => additionalAddresses.indexOf(addr) !== index,
    );

    // When address management is opened, add the primary address to the textarea if it's empty and user hasn't edited
    $: if (
        useMultipleAddresses &&
        !hasAutoAddedPrimary &&
        !userHasEditedTextarea &&
        address &&
        textareaValue.trim() === ''
    ) {
        textareaValue = address;
        hasAutoAddedPrimary = true;
    }

    // Reset flags when closed
    $: if (!useMultipleAddresses) {
        hasAutoAddedPrimary = false;
        userHasEditedTextarea = false;
    }

    function handleTextareaInput(e: Event) {
        textareaValue = (e.target as HTMLTextAreaElement).value;
        userHasEditedTextarea = true;
    }

    function addAllWalletAddresses() {
        // Get all wallet addresses that are not already in the list
        const walletAddresses = $iota_accounts
            .map((acc) => acc.address)
            .filter((addr) => addr && addr !== '0x');

        const existingAddresses = new Set([address, ...additionalAddresses]);
        const newAddresses = walletAddresses.filter((addr) => !existingAddresses.has(addr));

        if (newAddresses.length > 0) {
            textareaValue += (textareaValue ? '\n' : '') + newAddresses.join('\n');
        }
    }

    let epoch: number | '' = '';
    let error = '';
    let transactions: any[] = [];
    let stakeObjects: StakeObject[] = [];
    let validatorInfo: Record<string, ValidatorInfo> = {};
    let loadingTxs = false;
    let loadingStep: string | null = null;
    let fetchReceivedTxs = false;
    let showPriceColumns = true;
    let showValidatorColumns = true;
    let noTransactionsFound = false;

    // Computed table data
    $: tableData = computeEpochData(stakeObjects, validatorInfo, epoch || 1);

    let epochEndDates: string[] = [];
    // Seed from the bundled cache so the time-frame filter has data to match
    // against on first render. The reactive fetch below replaces it once the
    // async call resolves (possibly with freshly fetched epochs).
    let epochTimestamps: Record<number, number> = epochTimestampsCacheJson as Record<
        number,
        number
    >;
    let epochPrices: Record<number, number> = {};

    // Time frame filtering — seeded from URL once so the <select>/<input>
    // two-way bindings can own the state from then on.
    let selectedTimeFrame: TimeFrame = isValidTimeFrame(initialQueryParams.timeFrame)
        ? (initialQueryParams.timeFrame as TimeFrame)
        : 'all';
    let customDateStart = initialQueryParams.customStart || '';
    let customDateEnd = initialQueryParams.customEnd || '';

    // Sync local UI state back to the URL. Each reactive writes only when the
    // value is meaningful and clears the param otherwise so shared links stay
    // minimal.
    $: updatePageQueryParams({
        timeFrame: selectedTimeFrame === 'all' ? null : selectedTimeFrame,
    });
    $: updatePageQueryParams({
        customStart: selectedTimeFrame === 'custom' && customDateStart ? customDateStart : null,
        customEnd: selectedTimeFrame === 'custom' && customDateEnd ? customDateEnd : null,
    });
    $: updatePageQueryParams({
        addresses: useMultipleAddresses && textareaValue.trim() ? textareaValue : null,
    });

    $: customDateRange =
        selectedTimeFrame === 'custom' && customDateStart && customDateEnd
            ? ({
                  start: new Date(customDateStart + 'T00:00:00'),
                  end: new Date(customDateEnd + 'T23:59:59.999'),
              } as DateRange)
            : undefined;

    $: timeFrameFilteredEpochs = filterEpochsByTimeFrame(
        tableData.epochs,
        epochTimestamps,
        selectedTimeFrame,
        customDateRange,
    );

    $: timeFrameFilteredEpochEndDates = timeFrameFilteredEpochs.map((ep) => {
        const idx = tableData.epochs.indexOf(ep);
        return idx >= 0 ? epochEndDates[idx] : '';
    });

    // Only tell the chart to drop its last epoch when the filter ends at the
    // pending current epoch (that epoch has partial data). For closed ranges
    // that end earlier, every epoch in the filter is complete and should render.
    // Compare against tableData.epochs's last entry (authoritative) rather than
    // `epoch` — the latter can be '' before fetch completes.
    $: chartSkipLastEpoch =
        timeFrameFilteredEpochs.length > 0 &&
        tableData.epochs.length > 0 &&
        timeFrameFilteredEpochs[timeFrameFilteredEpochs.length - 1] ===
            tableData.epochs[tableData.epochs.length - 1];

    $: filteredTableDataForChart = {
        ...tableData,
        epochs: timeFrameFilteredEpochs,
    };

    // Build the CSV filename suffix from the active timeframe's date range so
    // the exported file reflects the filter (e.g. "2026-01-01_to_2026-03-31")
    // instead of today's date.
    $: csvFileNameSuffix = (() => {
        if (selectedTimeFrame === 'all') return '';
        const range =
            selectedTimeFrame === 'custom'
                ? customDateRange
                : getTimeFrameDateRange(selectedTimeFrame);
        if (!range) return '';
        const fmt = (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return `${fmt(range.start)}_to_${fmt(range.end)}`;
    })();

    // Fetch epoch end dates when tableData changes
    $: if (tableData.epochs.length > 0) {
        fetchEpochTimestampsForDisplay(tableData.epochs, epoch || 1, epochTimestampsCacheJson).then(
            ({ epochEndDates: dates, fetchedEpochTimestamps }) => {
                epochEndDates = dates;
                epochTimestamps = fetchedEpochTimestamps;
            },
        );
    } else {
        epochEndDates = [];
        // Keep epochTimestamps seeded from the bundled cache so the time-frame
        // filter can still compute even before any tableData is available.
    }

    function handlePricesFetched(prices: Record<number, number>) {
        epochPrices = prices;
    }

    // Initialize exchange rate cache on component load
    setInitialExchangeRateCacheFromBinary(exchangeRateCacheBinary);

    async function getCurrentEpochAndEndTimestamp() {
        try {
            error = '';
            const currentEpochId = await new EpochPTBAnalyzer().getCurrentEpoch();
            if (currentEpochId) {
                epoch = parseInt(currentEpochId);
            } else {
                error = 'Failed to fetch current epoch.';
            }
        } catch (err: any) {
            error = err?.toString() ?? 'Error fetching current epoch.';
        } finally {
        }
    }
    async function fetchTransactions() {
        error = '';
        transactions = [];
        stakeObjects = [];
        validatorInfo = {};
        noTransactionsFound = false;
        loadingTxs = true;
        loadingStep = 'Fetching stake txs...';
        try {
            // Determine the filter's start epoch (undefined for "all").
            // See ProcessingOptions in processor.ts for how it's used.
            const startEpoch = getStartEpochForTimeFrame(
                epochTimestampsCacheJson,
                selectedTimeFrame,
                customDateRange,
            );

            // Fetch transactions for all addresses in parallel. The loading
            // step shows a monotonic completion counter rather than each
            // promise's map-index, which jumps around when promises finish
            // out of order.
            let sentDone = 0;
            let receivedDone = 0;
            const total = allAddresses.length;
            const allTxsPromises = allAddresses.map(async (addr) => {
                try {
                    const sentTxs = await fetchStakeTransactions(addr);
                    sentDone++;
                    loadingStep = `Fetching stake txs ${sentDone}/${total}...`;

                    let receivedTxs: any[] = [];
                    if (fetchReceivedTxs) {
                        receivedTxs = await fetchReceivedStakeTransactions(addr);
                        receivedDone++;
                        loadingStep = `Fetching received txs ${receivedDone}/${total}...`;
                    }

                    return { sentTxs, receivedTxs, address: addr, error: null };
                } catch (err) {
                    console.error(`Failed to fetch transactions for address ${addr}:`, err);
                    return { sentTxs: [], receivedTxs: [], address: addr, error: err };
                }
            });

            const allTxsResults = await Promise.all(allTxsPromises);

            // Check if any addresses had errors
            const failedAddresses = allTxsResults.filter((r) => r.error);
            if (failedAddresses.length > 0) {
                console.warn(
                    `Failed to fetch transactions for ${failedAddresses.length} address(es)`,
                );
            }

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

            // Fetch current on-chain stake objects to supplement the filtered
            // transactions. See supplementMissingStakeObjects in processor.ts.
            let currentStakeObjects;
            if (startEpoch !== undefined) {
                loadingStep = 'Fetching current stake objects...';
                currentStakeObjects = await fetchCurrentStakedObjects(allAddresses);
                console.log(
                    `Fetched ${currentStakeObjects.length} current stake objects from chain`,
                );
            }

            if (
                uniqueTxs.length === 0 &&
                (!currentStakeObjects || currentStakeObjects.length === 0)
            ) {
                noTransactionsFound = true;
                loadingTxs = false;
                loadingStep = null;
                return;
            }

            // Step 4: Process transactions with exchange rates for all addresses
            loadingStep = 'Fetching exchange rates...';
            const result = await processStakeTransactionsWithExchangeRates(
                uniqueTxs,
                epoch as number,
                allAddresses,
                { startEpoch, currentStakeObjects },
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
    <div
        class="toolbar"
        style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start;"
    >
        <div
            class="address-section"
            style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;"
        >
            <label class="toggle-row" style="margin-bottom: 0.5rem;">
                <div class="toggle-switch">
                    <input type="checkbox" bind:checked={useMultipleAddresses} />
                    <span class="slider"></span>
                </div>
                <span>Multiple addresses</span>
            </label>
            {#if !useMultipleAddresses}
                <input
                    id="address-input"
                    type="text"
                    value={address}
                    oninput={(e) => updateAddress((e.target as HTMLInputElement)?.value || '')}
                    placeholder="Enter primary address (0x...)"
                    style="width: 100%;"
                />
            {:else}
                <p
                    style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.8; text-align: left !important;"
                >
                    Enter all addresses below, separated by comma, newline, or space:
                </p>
                <textarea
                    value={textareaValue}
                    placeholder="Enter addresses separated by comma, newline, or space (0x...)"
                    rows="4"
                    style="width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-color); color: white; padding: 0.4rem 0.8rem; border-radius: 4px;"
                    oninput={handleTextareaInput}
                ></textarea>
                {#if invalidAddresses.length > 0 || duplicateAddresses.length > 0}
                    <div class="error-message">
                        {#if invalidAddresses.length > 0}Invalid addresses: {invalidAddresses.join(
                                ', ',
                            )}{/if}
                        {#if duplicateAddresses.length > 0}{invalidAddresses.length > 0
                                ? '; '
                                : ''}Duplicate addresses: {duplicateAddresses.join(', ')}{/if}
                    </div>
                {/if}
                <div class="address-buttons">
                    {#if $iota_accounts.length > 0}
                        <button onclick={addAllWalletAddresses} class="add-btn">
                            Add All Wallet Addresses
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
        <div
            class="options-section"
            style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;"
        >
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
            <div class="timeframe-controls">
                <label class="timeframe-label">
                    Time frame:
                    <select bind:value={selectedTimeFrame}>
                        {#each Object.entries(TIME_FRAME_LABELS) as [value, label]}
                            <option {value}>{label}</option>
                        {/each}
                    </select>
                </label>
                {#if selectedTimeFrame === 'custom'}
                    <label class="timeframe-date">
                        From:
                        <input type="date" bind:value={customDateStart} />
                    </label>
                    <label class="timeframe-date">
                        To:
                        <input type="date" bind:value={customDateEnd} />
                    </label>
                {/if}
                {#if selectedTimeFrame !== 'all'}
                    <span class="timeframe-info">
                        {getTimeFrameDescription(selectedTimeFrame, customDateRange)}
                        {#if tableData.epochs.length > 0}
                            ({timeFrameFilteredEpochs.length} of {tableData.epochs.length} epochs)
                        {/if}
                    </span>
                {/if}
            </div>
            <button
                onclick={fetchTransactions}
                disabled={loadingTxs}
                style="background: #059669; margin: 0 auto;"
            >
                {loadingTxs ? (loadingStep ?? 'Loading...') : 'Fetch Data'}
            </button>
        </div>
    </div>

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
    {#if tableData.negativeAvailableEpochs.length > 0}
        <div class="error-message">
            Available Rewards went negative at {tableData.negativeAvailableEpochs.length} epoch(s). This
            is most likely because stake objects were received from another address and the incoming transactions
            were not fetched{fetchReceivedTxs
                ? ' completely'
                : ' — try enabling "Include received" above and fetching again'}. Offending epoch{tableData
                .negativeAvailableEpochs.length === 1
                ? ''
                : 's'}: {tableData.negativeAvailableEpochs.slice(0, 10).join(', ')}{tableData
                .negativeAvailableEpochs.length > 10
                ? '…'
                : ''}
        </div>
    {/if}

    <div class="summary-section">
        <StakingRewardsTable
            currentEpoch={epoch || 1}
            {stakeObjects}
            {validatorInfo}
            bind:showPriceColumns
            bind:showValidatorColumns
            onPricesFetched={handlePricesFetched}
            {noTransactionsFound}
            {timeFrameFilteredEpochs}
            {csvFileNameSuffix}
        />
    </div>
    {#if stakeObjects.length > 0}
        <StakingRewardsChart
            tableData={filteredTableDataForChart}
            epochEndDates={timeFrameFilteredEpochEndDates}
            {epochPrices}
            skipLastEpoch={chartSkipLastEpoch}
        />
    {/if}
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

    .address-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .add-btn {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
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

    .timeframe-controls {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-size: 0.9rem;
    }

    .timeframe-label select {
        margin-left: 0.25rem;
    }

    .timeframe-date input {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.3rem 0.5rem;
        border-radius: 4px;
        margin-left: 0.25rem;
    }

    .timeframe-info {
        color: #10b981;
        font-size: 0.85rem;
    }
</style>

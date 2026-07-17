<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { get } from 'svelte/store';

    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import {
        sharedStakingSkipPaginationEnabled,
        sharedStakingSkipPaginationSenders,
    } from '../../utils/local-storage-store';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { activeAddress, iota_accounts } from '../../utils/signer-data';
    import { EpochPTBAnalyzer } from '../programmable-transaction-block';
    // @ts-ignore
    import exchangeRateCacheBinary from './cache/exchange-rate-cache.bin?raw';
    import epochTimestampsCacheJson from './cache/mainnet-epoch-timestamps-cache.json';
    import { formatNanoAsIota } from './formatting';
    import { fetchCurrentStakedObjects, fetchEpochTimestampsForDisplay } from './graphql-requests';
    import { mapWithConcurrency } from './graphql-retry';
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
    import { computeEpochData, rebaselineStakeObjects } from './table-utils';
    import {
        filterEpochsByTimeFrame,
        getDateRangeForEpochRange,
        getEpochRangeForDateRange,
        getStartEpochForTimeFrame,
        getTimeFrameDateRange,
        getTimeFrameDescription,
        TIME_FRAME_LABELS,
        type DateRange,
        type EpochRange,
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
        // Default to a narrow window: it bounds how much transaction history is
        // fetched and processed, and covers the common case. See the note next
        // to the Time frame control.
        timeFrame: 'last-3-days',
        customStart: '',
        customEnd: '',
        customEpochStart: '',
        customEpochEnd: '',
        fetchReceivedTxs: false,
        ignorePreviousRewards: false,
    });

    // One-shot snapshot used to seed local state that's either bound with
    // `bind:value` (incompatible with reactive re-reads) or whose query-param
    // key is only relevant under certain conditions.
    const initialQueryParams = get(queryParamValues);

    function isValidTimeFrame(v: unknown): v is TimeFrame {
        return typeof v === 'string' && v in TIME_FRAME_LABELS;
    }

    function fmtDate(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function parseEpochParam(raw: string): number | null {
        if (!raw) return null;
        const n = parseInt(raw);
        return Number.isFinite(n) ? n : null;
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
    let fetchReceivedTxs = initialQueryParams.fetchReceivedTxs;
    // When on (and a narrower time frame than "All time" is selected), rewards
    // accrued before the window are removed from the report. Defaults to off so
    // the output is unchanged unless the user explicitly enables it.
    let ignorePreviousRewards = initialQueryParams.ignorePreviousRewards;
    let showPriceColumns = true;
    let showValidatorColumns = true;
    let noTransactionsFound = false;

    // Skip-pagination sender list — addresses whose transactions are skipped
    // when looking for stake objects because they post huge, non-staking
    // transactions. Both the on/off flag and the address list are persisted
    // independently in localStorage so the user can keep a preferred list
    // configured but toggle the feature off without losing it.
    let skipSendersTextarea = $sharedStakingSkipPaginationSenders.join('\n');
    $: skipSendersList = $sharedStakingSkipPaginationEnabled
        ? parseAddresses(skipSendersTextarea)
        : [];
    $: skipSendersSet = new Set(skipSendersList);
    $: skipSendersInvalid = skipSendersList.filter((a) => !isValidIotaAddress(a));
    // Persist whenever the (parsed) list changes — invalid entries are still
    // persisted so the user can fix them across reloads.
    $: $sharedStakingSkipPaginationSenders = parseAddresses(skipSendersTextarea);

    // Per-sender skipped tx counts for the most recent fetch. Reset at the
    // start of fetchTransactions and incremented by the onSkipPagination
    // callback so the user sees exactly which senders contributed to the
    // skipped pagination after a run.
    let skippedSendersCounts: Record<string, number> = {};
    $: skippedSendersTotal = Object.values(skippedSendersCounts).reduce((a, b) => a + b, 0);

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
        : 'last-3-days';
    let customDateStart = initialQueryParams.customStart || '';
    let customDateEnd = initialQueryParams.customEnd || '';
    // bind:value on <input type="number"> yields `null` (not '') when cleared,
    // so use number | null throughout to match what Svelte hands back.
    let customEpochStart: number | null = parseEpochParam(initialQueryParams.customEpochStart);
    let customEpochEnd: number | null = parseEpochParam(initialQueryParams.customEpochEnd);

    // Sync local UI state back to the URL. Each reactive writes only when the
    // value is meaningful and clears the param otherwise so shared links stay
    // minimal.
    $: updatePageQueryParams({
        // Omit the param when it equals the default so shared links stay minimal;
        // every other value (including 'all') round-trips explicitly.
        timeFrame: selectedTimeFrame === 'last-3-days' ? null : selectedTimeFrame,
    });
    $: updatePageQueryParams({
        customStart: selectedTimeFrame === 'custom' && customDateStart ? customDateStart : null,
        customEnd: selectedTimeFrame === 'custom' && customDateEnd ? customDateEnd : null,
    });
    $: updatePageQueryParams({
        customEpochStart:
            selectedTimeFrame === 'custom-epochs' &&
            typeof customEpochStart === 'number' &&
            Number.isFinite(customEpochStart)
                ? String(customEpochStart)
                : null,
        customEpochEnd:
            selectedTimeFrame === 'custom-epochs' &&
            typeof customEpochEnd === 'number' &&
            Number.isFinite(customEpochEnd)
                ? String(customEpochEnd)
                : null,
    });
    $: updatePageQueryParams({
        addresses: useMultipleAddresses && textareaValue.trim() ? textareaValue : null,
    });
    $: updatePageQueryParams({
        fetchReceivedTxs: fetchReceivedTxs ? true : null,
    });
    $: updatePageQueryParams({
        ignorePreviousRewards: ignorePreviousRewards ? true : null,
    });

    $: customDateRange =
        selectedTimeFrame === 'custom' && customDateStart && customDateEnd
            ? ({
                  start: new Date(customDateStart + 'T00:00:00'),
                  end: new Date(customDateEnd + 'T23:59:59.999'),
              } as DateRange)
            : undefined;

    // Latest epoch we know about — prefer the live current epoch once fetched,
    // otherwise fall back to the highest epoch in the timestamp cache so the
    // open-ended "To epoch" can resolve before any fetch happens.
    $: latestKnownEpoch = (() => {
        if (typeof epoch === 'number') return epoch;
        const keys = Object.keys(epochTimestamps).map(Number);
        return keys.length > 0 ? Math.max(...keys) : undefined;
    })();

    // Empty "From epoch" defaults to 0; empty "To epoch" defaults to the latest
    // known epoch — together with `<input type="number">` returning null on
    // clear (and occasionally NaN), we treat anything non-finite as empty.
    $: customEpochRange = (() => {
        if (selectedTimeFrame !== 'custom-epochs') return undefined;
        const startNum =
            typeof customEpochStart === 'number' && Number.isFinite(customEpochStart)
                ? customEpochStart
                : null;
        const endNum =
            typeof customEpochEnd === 'number' && Number.isFinite(customEpochEnd)
                ? customEpochEnd
                : null;
        const start = startNum ?? 0;
        const end = endNum ?? latestKnownEpoch;
        if (end == null || start > end) return undefined;
        return { start, end } as EpochRange;
    })();

    // Cross-mapped info: when filtering by epochs, show the date range those
    // epochs span; when filtering by date, show the epoch range that falls
    // inside the cache. Computed from the bundled cache so the user sees the
    // mapping before fetching anything.
    $: mappedDateRangeForEpochs =
        selectedTimeFrame === 'custom-epochs' && customEpochRange
            ? getDateRangeForEpochRange(epochTimestamps, customEpochRange)
            : null;

    $: dateRangeForEpochMapping = (() => {
        if (selectedTimeFrame === 'all' || selectedTimeFrame === 'custom-epochs') return null;
        if (selectedTimeFrame === 'custom') return customDateRange ?? null;
        return getTimeFrameDateRange(selectedTimeFrame);
    })();

    $: mappedEpochRangeForDates = dateRangeForEpochMapping
        ? getEpochRangeForDateRange(epochTimestamps, dateRangeForEpochMapping)
        : null;

    $: timeFrameFilteredEpochs = filterEpochsByTimeFrame(
        tableData.epochs,
        epochTimestamps,
        selectedTimeFrame,
        customDateRange,
        undefined,
        customEpochRange,
    );

    // Restrict the negative-rewards warning to the active filter so it only
    // calls out epochs the user is actually viewing — otherwise a narrow
    // selection (e.g. epochs 154-160) gets spammed with offenders from
    // unrelated parts of the underlying computation.
    $: filteredNegativeEpochs =
        selectedTimeFrame === 'all'
            ? tableData.negativeAvailableEpochs
            : tableData.negativeAvailableEpochs.filter((e) => timeFrameFilteredEpochs.includes(e));

    $: timeFrameFilteredEpochEndDates = timeFrameFilteredEpochs.map((ep) => {
        const idx = tableData.epochs.indexOf(ep);
        return idx >= 0 ? epochEndDates[idx] : '';
    });

    // "Ignore previous rewards" — only meaningful for a narrower time frame than
    // "All time". The window start is the first epoch actually displayed; every
    // reward accrued before it is stripped from the figures (table, chart,
    // export). When the option is off, displayStakeObjects === stakeObjects so
    // the output is byte-for-byte unchanged.
    $: rebaseStartEpoch =
        ignorePreviousRewards && selectedTimeFrame !== 'all' && timeFrameFilteredEpochs.length > 0
            ? timeFrameFilteredEpochs[0]
            : undefined;

    $: rebaseResult =
        rebaseStartEpoch !== undefined
            ? rebaselineStakeObjects(stakeObjects, rebaseStartEpoch)
            : null;

    $: displayStakeObjects = rebaseResult ? rebaseResult.stakeObjects : stakeObjects;

    $: previousRewardsRemoved = rebaseResult ? rebaseResult.previousRewardsRemoved : 0n;

    $: previousRewardsNotice =
        rebaseStartEpoch !== undefined && previousRewardsRemoved > 0n
            ? `Previous rewards ignored: ${formatNanoAsIota(previousRewardsRemoved)} — accrued before epoch ${rebaseStartEpoch}`
            : '';

    // Re-based epoch data drives the chart so it matches the table/export.
    $: displayTableData = rebaseResult
        ? computeEpochData(displayStakeObjects, validatorInfo, epoch || 1)
        : tableData;

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
        ...displayTableData,
        epochs: timeFrameFilteredEpochs,
    };

    // Build the default export filename stem from the active timeframe so the
    // file reflects the filter (e.g. "2026-01-01_to_2026-03-31") instead of
    // today's date. The user can override this entirely in the export dialog.
    $: exportFileName = (() => {
        const today = fmtDate(new Date());
        if (selectedTimeFrame === 'all') return `staking-rewards-table-${today}`;
        if (selectedTimeFrame === 'custom-epochs') {
            if (!customEpochRange) return `staking-rewards-table-${today}`;
            return `staking-rewards-table-epoch-${customEpochRange.start}_to_${customEpochRange.end}`;
        }
        const range =
            selectedTimeFrame === 'custom'
                ? customDateRange
                : getTimeFrameDateRange(selectedTimeFrame);
        if (!range) return `staking-rewards-table-${today}`;
        return `staking-rewards-table-${fmtDate(range.start)}_to_${fmtDate(range.end)}`;
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
        skippedSendersCounts = {};
        loadingTxs = true;
        loadingStep = 'Fetching stake txs...';
        try {
            // Snapshot the skip-pagination set once per fetch so toggling the
            // UI mid-fetch can't corrupt the in-flight result.
            const skipSendersSnapshot = $sharedStakingSkipPaginationEnabled
                ? skipSendersSet
                : undefined;
            const recordSkippedSender = (sender: string) => {
                skippedSendersCounts = {
                    ...skippedSendersCounts,
                    [sender]: (skippedSendersCounts[sender] ?? 0) + 1,
                };
            };
            // Determine the filter's start epoch (undefined for "all").
            // See ProcessingOptions in processor.ts for how it's used.
            const startEpoch = getStartEpochForTimeFrame(
                epochTimestampsCacheJson,
                selectedTimeFrame,
                customDateRange,
                undefined,
                customEpochRange,
            );

            // Fetch transactions for all addresses in parallel. The loading
            // step shows a monotonic completion counter rather than each
            // promise's map-index, which jumps around when promises finish
            // out of order. In-flight transaction counts per address/role are
            // tracked separately so a single address paginating through many
            // transactions still surfaces "still working" feedback instead of
            // going silent for minutes.
            let sentDone = 0;
            let receivedDone = 0;
            const total = allAddresses.length;
            type FetchProgress = { role: 'sent' | 'received'; transactions: number };
            const inFlight = new Map<string, FetchProgress>();

            function renderLoadingStep(phase: 'stake' | 'received') {
                const baseDone = phase === 'stake' ? sentDone : receivedDone;
                const phaseLabel = phase === 'stake' ? 'stake' : 'received';
                const targetRole = phase === 'stake' ? 'sent' : 'received';
                let foundSoFar = 0;
                for (const p of inFlight.values()) {
                    if (p.role === targetRole) foundSoFar += p.transactions;
                }
                if (foundSoFar === 0) {
                    loadingStep = `Fetching ${phaseLabel} txs ${baseDone}/${total}...`;
                    return;
                }
                loadingStep =
                    `Fetching ${phaseLabel} txs ${baseDone}/${total}` + ` (${foundSoFar} found)...`;
            }

            // Cap how many addresses fetch at once. Each address fans out into
            // many sequential GraphQL requests (paginated sent/received txs +
            // objectChanges), so running every address in parallel floods the
            // endpoint and trips its rate limiter (HTTP 429). A small pool keeps
            // throughput high without the burst; per-request retries in
            // graphql-requests.ts absorb any 429s that still slip through.
            const ADDRESS_FETCH_CONCURRENCY = 10;
            const allTxsResults = await mapWithConcurrency(
                allAddresses,
                ADDRESS_FETCH_CONCURRENCY,
                async (addr) => {
                    try {
                        const sentKey = `sent:${addr}`;
                        inFlight.set(sentKey, { role: 'sent', transactions: 0 });
                        renderLoadingStep('stake');
                        const sentTxs = await fetchStakeTransactions(addr, {
                            startEpoch,
                            skipPaginationSenders: skipSendersSnapshot,
                            onSkipPagination: recordSkippedSender,
                            onProgress: ({ transactions }) => {
                                const entry = inFlight.get(sentKey);
                                if (entry) {
                                    entry.transactions = transactions;
                                    renderLoadingStep('stake');
                                }
                            },
                        });
                        inFlight.delete(sentKey);
                        sentDone++;
                        renderLoadingStep('stake');

                        let receivedTxs: any[] = [];
                        if (fetchReceivedTxs) {
                            const recvKey = `recv:${addr}`;
                            inFlight.set(recvKey, { role: 'received', transactions: 0 });
                            renderLoadingStep('received');
                            receivedTxs = await fetchReceivedStakeTransactions(addr, {
                                startEpoch,
                                skipPaginationSenders: skipSendersSnapshot,
                                onSkipPagination: recordSkippedSender,
                                onProgress: ({ transactions }) => {
                                    const entry = inFlight.get(recvKey);
                                    if (entry) {
                                        entry.transactions = transactions;
                                        renderLoadingStep('received');
                                    }
                                },
                            });
                            inFlight.delete(recvKey);
                            receivedDone++;
                            renderLoadingStep('received');
                        }

                        return { sentTxs, receivedTxs, address: addr, error: null };
                    } catch (err) {
                        console.error(`Failed to fetch transactions for address ${addr}:`, err);
                        return { sentTxs: [], receivedTxs: [], address: addr, error: err };
                    }
                },
            );

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
                    oninput={handleTextareaInput}></textarea>
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
            {#if fetchReceivedTxs}
                <label class="toggle-row" style="margin-top: 0.5rem;">
                    <div class="toggle-switch">
                        <input
                            type="checkbox"
                            bind:checked={$sharedStakingSkipPaginationEnabled}
                            disabled={loadingTxs}
                        />
                        <span class="slider"></span>
                    </div>
                    <div style="display: flex; flex-direction: column; line-height: 1.2;">
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <span class="toggle-label"> Skip object changes by sender </span>
                            <div class="tooltip-container">
                                <span class="info-icon">ⓘ</span>
                                <div class="tooltip">
                                    Transactions from these addresses are skipped when looking for
                                    stake objects — useful for senders that post huge non-staking
                                    transactions and would otherwise dominate fetch time.
                                </div>
                            </div>
                        </div>
                        <span style="font-size: 0.75rem; opacity: 0.7;"
                            >Speeds up received-tx fetch for known-noisy senders</span
                        >
                    </div>
                </label>
                {#if $sharedStakingSkipPaginationEnabled}
                    <details class="skip-senders-details">
                        <summary>
                            Skip-sender addresses ({skipSendersList.length}){skippedSendersTotal > 0
                                ? ` — last fetch skipped ${skippedSendersTotal} tx${skippedSendersTotal === 1 ? '' : 's'}`
                                : ''}
                        </summary>
                        <p
                            style="margin: 0.4rem 0 0.25rem 0; font-size: 0.9rem; opacity: 0.8; text-align: left !important;"
                        >
                            Sender addresses whose transactions should be skipped:
                        </p>
                        <textarea
                            bind:value={skipSendersTextarea}
                            placeholder="Enter sender addresses separated by comma, newline, or space (0x...)"
                            rows="3"
                            disabled={loadingTxs}
                            class="skip-senders-textarea"></textarea>
                        {#if skipSendersInvalid.length > 0}
                            <div class="error-message">
                                Invalid skip-sender addresses: {skipSendersInvalid.join(', ')}
                            </div>
                        {/if}
                        {#if skippedSendersTotal > 0}
                            <p
                                style="margin: 0.5rem 0 0.25rem 0; font-size: 0.9rem; opacity: 0.85;"
                            >
                                Last fetch skipped pagination for {skippedSendersTotal} transaction{skippedSendersTotal ===
                                1
                                    ? ''
                                    : 's'}:
                            </p>
                            <ul style="margin: 0 0 0 1.25rem; padding: 0; font-size: 0.85rem;">
                                {#each Object.entries(skippedSendersCounts) as [sender, count]}
                                    <li>
                                        <code style="opacity: 0.9;">{sender}</code>: {count}
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </details>
                {/if}
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
                    <div class="tooltip-container">
                        <span class="info-icon">ⓘ</span>
                        <div class="tooltip">
                            A wider frame (especially "All time") fetches and processes more
                            transaction history, so it takes longer for very active addresses.
                            Recent windows are fast.
                        </div>
                    </div>
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
                {#if selectedTimeFrame === 'custom-epochs'}
                    <label class="timeframe-date">
                        From epoch:
                        <input
                            type="number"
                            min="0"
                            step="1"
                            bind:value={customEpochStart}
                            placeholder="0"
                            class="epoch-input"
                        />
                    </label>
                    <label class="timeframe-date">
                        To epoch:
                        <input
                            type="number"
                            min="0"
                            step="1"
                            bind:value={customEpochEnd}
                            placeholder={latestKnownEpoch !== undefined
                                ? `current (${latestKnownEpoch})`
                                : 'current'}
                            class="epoch-input"
                        />
                    </label>
                {/if}
                {#if selectedTimeFrame !== 'all'}
                    <span class="timeframe-info">
                        {#if selectedTimeFrame === 'custom-epochs' && customEpochRange}
                            Epoch {customEpochRange.start} to {customEpochRange.end}{!(
                                typeof customEpochEnd === 'number' &&
                                Number.isFinite(customEpochEnd)
                            )
                                ? ' (current)'
                                : ''}
                        {:else}
                            {getTimeFrameDescription(
                                selectedTimeFrame,
                                customDateRange,
                                undefined,
                                customEpochRange,
                            )}
                        {/if}
                        {#if selectedTimeFrame === 'custom-epochs' && mappedDateRangeForEpochs}
                            <span class="timeframe-mapping">
                                ≈ {fmtDate(mappedDateRangeForEpochs.start)} to {fmtDate(
                                    mappedDateRangeForEpochs.end,
                                )}
                            </span>
                        {:else if selectedTimeFrame !== 'custom-epochs' && mappedEpochRangeForDates}
                            <span class="timeframe-mapping">
                                ≈ epoch {mappedEpochRangeForDates.start} to {mappedEpochRangeForDates.end}
                            </span>
                        {/if}
                        {#if tableData.epochs.length > 0}
                            ({timeFrameFilteredEpochs.length} of {tableData.epochs.length} epochs)
                        {/if}
                    </span>
                {/if}
            </div>
            {#if selectedTimeFrame !== 'all'}
                <label class="toggle-row">
                    <div class="toggle-switch">
                        <input type="checkbox" bind:checked={ignorePreviousRewards} />
                        <span class="slider"></span>
                    </div>
                    <div style="display: flex; flex-direction: column; line-height: 1.2;">
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <span class="toggle-label"> Ignore previous rewards </span>
                            <div class="tooltip-container">
                                <span class="info-icon">ⓘ</span>
                                <div class="tooltip">
                                    Removes rewards that accrued before the selected time frame.
                                    Accumulated, available, and unstake rewards are re-based to
                                    start at the window, and the amount removed is shown in the
                                    report and exports.
                                </div>
                            </div>
                        </div>
                        <span style="font-size: 0.75rem; opacity: 0.7;"
                            >Report only rewards earned within the selected time frame</span
                        >
                    </div>
                </label>
            {/if}
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
    {#if filteredNegativeEpochs.length > 0}
        <div class="error-message">
            Available Rewards went negative at {filteredNegativeEpochs.length} epoch(s). This is most
            likely because stake objects were received from another address and the incoming transactions
            were not fetched{fetchReceivedTxs
                ? ' completely'
                : ' — try enabling "Include received" above and fetching again'}. Offending epoch{filteredNegativeEpochs.length ===
            1
                ? ''
                : 's'}: {filteredNegativeEpochs
                .slice(0, 10)
                .join(', ')}{filteredNegativeEpochs.length > 10 ? '…' : ''}
        </div>
    {/if}
    {#if previousRewardsNotice && stakeObjects.length > 0}
        <div class="info-message">
            {previousRewardsNotice}
        </div>
    {/if}

    <div class="summary-section">
        <StakingRewardsTable
            currentEpoch={epoch || 1}
            stakeObjects={displayStakeObjects}
            {validatorInfo}
            bind:showPriceColumns
            bind:showValidatorColumns
            onPricesFetched={handlePricesFetched}
            {noTransactionsFound}
            {timeFrameFilteredEpochs}
            {exportFileName}
            {previousRewardsNotice}
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

    .skip-senders-details {
        text-align: left;
    }

    .skip-senders-details summary {
        cursor: pointer;
        list-style: revert;
        font-size: 0.9rem;
        opacity: 0.85;
        text-align: left;
    }

    .skip-senders-textarea {
        width: 100%;
        min-width: 22rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.85rem;
    }

    .timeframe-controls {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-size: 0.9rem;
    }

    .timeframe-label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
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

    .timeframe-mapping {
        opacity: 0.75;
        font-size: 0.8rem;
        margin-left: 0.25rem;
    }

    .epoch-input {
        width: 7rem;
    }
</style>

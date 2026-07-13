<script lang="ts">
    import { onMount } from 'svelte';
    import { List } from 'svelte-virtual';
    import { get } from 'svelte/store';

    import { getSelectedNetworkConfig } from '../../utils/client';
    import { copyToClipboard } from '../../utils/formatting';
    import { sharedStakingCurrency } from '../../utils/local-storage-store';
    import { NANOS_PER_IOTA } from '../../utils/wasm-sdk';
    import type { ActionDetails, StakeObject, ValidatorInfo } from './';
    import pricesCache from './cache/iota-prices-coingecko.json';
    import epochTimestampsCacheJson from './cache/mainnet-epoch-timestamps-cache.json';
    import { buildExportSections, exportTableToCSV, type ExportProgress } from './csv-export';
    import ExportDialog from './ExportDialog.svelte';
    import { nanoToIota } from './formatting';
    import { fetchEpochTimestampsForDisplay } from './graphql-requests';
    import { exportTableToPDF } from './pdf-export';
    import {
        fetchAllPrices as fetchAllPricesUtil,
        reloadFromCoinGeckoCache,
    } from './price-fetching';
    import {
        computeCumulativeUnstakeFiat,
        computeEarnedValueForEpoch,
        computeEpochData,
        formatMultipleActionDetails,
        formatPrincipal,
        getActionNames,
        getFirstPrincipal,
        getValidatorRewardsForEpoch,
        getValidatorTotalPrincipal,
        isActiveInEpoch,
        isPreActivationInEpoch,
    } from './table-utils';
    import type { ExportOptions } from './types';

    type Amount = number | string | bigint | null | undefined;

    // BigInt() crashes on null/undefined/'' — common when reading missing entries
    // from rewardsByEpoch / accumulatedRewards on stakes with deactivated pools.
    function asNanos(amount: Amount): bigint {
        return amount == null || amount === '' ? 0n : BigInt(amount);
    }

    function toIota(amount: Amount): bigint {
        return asNanos(amount) / NANOS_PER_IOTA;
    }

    function formatIota(amount: Amount, decimals: number = 2): string {
        const bigAmount = asNanos(amount);
        const whole = bigAmount / NANOS_PER_IOTA;
        const nano = bigAmount % NANOS_PER_IOTA;
        const decimal = nano.toString().padStart(9, '0').slice(0, decimals);
        return `${whole.toLocaleString('en-US')}.${decimal} IOTA`;
    }

    function formatExactIota(amount: Amount): string {
        const bigAmount = asNanos(amount);
        const whole = bigAmount / NANOS_PER_IOTA;
        const nano = bigAmount % NANOS_PER_IOTA;
        const trimmedNano = nano.toString().padStart(9, '0').replace(/0+$/, '');
        const wholeStr = whole.toLocaleString('en-US');
        return trimmedNano === '' ? `${wholeStr} IOTA` : `${wholeStr}.${trimmedNano} IOTA`;
    }

    function formatNano(amount: Amount): string {
        return asNanos(amount).toLocaleString('en-US').replace(/,/g, '_') + ' NANO';
    }

    let {
        currentEpoch = 0,
        stakeObjects = [],
        validatorInfo = {},
        showPriceColumns = $bindable(true),
        showValidatorColumns = $bindable(true),
        hideUnstaked = $bindable(false),
        showCompactView = $bindable(true),
        onPricesFetched,
        noTransactionsFound = false,
        timeFrameFilteredEpochs = undefined as number[] | undefined,
        exportFileName = '' as string,
        previousRewardsNotice = '' as string,
    } = $props();

    let windowWidth = $state(0);
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
        const updateWidth = () => {
            windowWidth = window.innerWidth;
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    });

    // Computed table data
    let tableData = $derived.by(() => computeEpochData(stakeObjects, validatorInfo, currentEpoch));

    // Destructure for easy access
    let { uniqueValidators, epochData, validatorPrincipal, epochs } = $derived(tableData);

    // Filtered epochs based on showCompactView
    // Use time-frame-filtered epochs from parent when available, otherwise all epochs
    let baseEpochs = $derived(timeFrameFilteredEpochs ?? epochs);

    let filteredEpochs = $derived.by(() => {
        if (!showCompactView) return baseEpochs;
        // When a timeframe filter narrows the epoch set, always keep its
        // first and last epoch so the compact view has visible endpoints.
        const isTimeFrameFiltered = baseEpochs.length !== epochs.length;
        const firstEpoch = baseEpochs[0];
        const lastEpoch = baseEpochs[baseEpochs.length - 1];
        return baseEpochs.filter((epoch) => {
            if (epoch === currentEpoch || epoch === currentEpoch - 1) return true;
            if (isTimeFrameFiltered && (epoch === firstEpoch || epoch === lastEpoch)) return true;
            const hasPreActive = stakeObjects.some((stakeObject) =>
                isPreActivationInEpoch(stakeObject, epoch, epochData),
            );
            if (hasPreActive) return true;
            return stakeObjects.some(
                (stakeObject) =>
                    stakeObject.actionByEpoch &&
                    stakeObject.actionByEpoch[epoch] &&
                    stakeObject.actionByEpoch[epoch].length > 0,
            );
        });
    });

    let filteredEpochEndDates = $derived.by(() => {
        if (!showCompactView && !timeFrameFilteredEpochs) return epochEndDates;
        return filteredEpochs.map((epoch) => epochEndDates[epochs.indexOf(epoch)]);
    });

    let height = $derived.by(() => {
        const maxHeight = windowWidth < 768 ? 600 : 800;
        const contentHeight = filteredEpochs.length * 50 + 60;
        return Math.min(contentHeight, maxHeight);
    });

    // Elements for scroll synchronization
    let headerElement = $state<HTMLElement>();
    let listElement = $state<any>(null); // Reference to the List component
    let isScrolling = $state(false);
    let virtualListContainer = $state<HTMLElement | null>(null);

    // Synchronize horizontal scroll between header and virtual list
    function syncHeaderScroll(event: Event) {
        if (isScrolling) return;
        isScrolling = true;

        const target = event.target as HTMLElement;
        const scrollLeft = target.scrollLeft;

        // Sync with the virtual list container if found
        if (virtualListContainer) {
            virtualListContainer.scrollLeft = scrollLeft;
        }

        setTimeout(() => {
            isScrolling = false;
        }, 10);
    }

    function syncListScroll(event: Event) {
        if (isScrolling) return;
        isScrolling = true;

        const target = event.target as HTMLElement;
        if (headerElement) {
            headerElement.scrollLeft = target.scrollLeft;
        }

        setTimeout(() => {
            isScrolling = false;
        }, 10);
    }

    // Global scroll event handler to catch any scroll within the table area
    function handleGlobalScroll(event: Event) {
        const target = event.target as HTMLElement;

        // Check if this scroll event is from within our virtual list area
        if (target && target !== headerElement) {
            // Check if the target is a scrollable element with horizontal scroll
            if (target.scrollWidth > target.clientWidth && target.scrollLeft !== undefined) {
                // Cache this as our virtual list container
                virtualListContainer = target;
                // Sync the scroll
                syncListScroll(event);
            }
        }
    }

    // Set up scroll synchronization for the virtual list
    function setupScrollSync(node: HTMLElement) {
        // Add a global scroll listener to catch scroll events from any child
        const scrollHandler = (event: Event) => {
            handleGlobalScroll(event);
        };

        // Use capture phase to catch scroll events from any descendant
        node.addEventListener('scroll', scrollHandler, { passive: true, capture: true });

        return {
            destroy() {
                node.removeEventListener('scroll', scrollHandler, { capture: true });
            },
        };
    }

    let selectedStakeObject = $state<StakeObject | null>(null);
    let selectedValidator = $state<ValidatorInfo | null>(null);
    let selectedAction = $state<{
        actions: ActionDetails[];
        epoch: number;
        stakeObjectId: string;
    } | null>(null);

    let epochEndDates = $state<string[]>([]);
    let isMainnet = $derived.by(() => {
        try {
            return getSelectedNetworkConfig().name?.toLowerCase().includes('mainnet');
        } catch {
            return false;
        }
    });

    let epochTimestampsCache = $derived.by(() =>
        isMainnet && Object.keys(epochTimestampsCacheJson).length > 0
            ? { ...epochTimestampsCacheJson }
            : {},
    );

    $effect(() => {
        if (!epochs.length) {
            epochEndDates = [];
        } else {
            // Fetch timestamps for each epoch using reusable function
            fetchEpochTimestampsForDisplay(epochs, currentEpoch, epochTimestampsCache).then(
                ({ epochEndDates: dates }) => {
                    epochEndDates = dates;
                },
            );
        }
    });

    let selectedCurrency = $state<'usd' | 'eur'>(get(sharedStakingCurrency));
    let previousCurrency = $state<'usd' | 'eur'>(get(sharedStakingCurrency));

    $effect(() => {
        sharedStakingCurrency.set(selectedCurrency);
    });
    function reloadPricesFromCache() {
        epochPrices = reloadFromCoinGeckoCache({
            epochs,
            epochEndDates,
            selectedCurrency,
            loadedCache,
        });
    }

    $effect(() => {
        if (!isFetchingPrice && selectedCurrency !== previousCurrency) {
            previousCurrency = selectedCurrency;
            reloadPricesFromCache();
        }
    });
    let isFetchingPrice = $state(false);
    let priceError = $state<string>('');
    let epochPrices = $state<Record<number, number>>({});
    let loadedCache = $state<Record<string, { usd: number; eur: number }>>(pricesCache);

    // Running cumulative unstake fiat across the filtered epochs. Reactive so
    // the Total Earned column updates when prices or filters change.
    let cumulativeUnstakeFiat = $derived.by(() =>
        Object.keys(epochPrices).length > 0
            ? computeCumulativeUnstakeFiat(filteredEpochs, epochData, epochPrices)
            : {},
    );

    // Export dialog state
    let showExportDialog = $state(false);
    let exporting = $state(false);
    let exportProgress = $state<ExportProgress | null>(null);

    function openExportDialog() {
        showExportDialog = true;
    }

    let exportError = $state<string>('');

    /**
     * Run a synchronous callback after yielding to the browser so the dialog
     * can repaint into its "Generating…" state before the work blocks the
     * thread. Without this yield, the disabled button + label change never
     * paints because the export starts on the same tick as the click.
     */
    function nextPaint(): Promise<void> {
        return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }

    async function handleExportConfirm(opts: {
        format: 'csv' | 'pdf';
        includePrices: boolean;
        includeValidators: boolean;
        wrapStakeObjects: boolean;
        wrapValidators: boolean;
        fileName: string;
    }) {
        exportError = '';
        exporting = true;
        exportProgress = null;
        const options: ExportOptions = {
            showPriceColumns: opts.includePrices,
            showValidatorColumns: opts.includeValidators,
            epochPrices,
            selectedCurrency,
            fileName: opts.fileName || exportFileName,
            wrapStakeObjects: opts.wrapStakeObjects,
            wrapValidators: opts.wrapValidators,
            ...(previousRewardsNotice && { previousRewardsNotice }),
        };

        const onProgress = (p: ExportProgress) => {
            exportProgress = p;
        };
        const exporter = opts.format === 'pdf' ? exportTableToPDF : exportTableToCSV;

        // Leave the dialog open after exporting — Chrome occasionally drops
        // rapid same-tab downloads, and keeping the dialog open lets users
        // retry without reopening it. Closed manually via X / Cancel / Esc.
        try {
            // Yield so the disabled-button / "Generating…" label paint before
            // the export runs. The exporters themselves chunk + yield between
            // batches, so the page stays responsive even on huge datasets.
            await nextPaint();
            await exporter(
                filteredEpochs,
                filteredEpochEndDates,
                currentEpoch,
                stakeObjects,
                uniqueValidators,
                epochData,
                options,
                onProgress,
            );
        } catch (err) {
            console.error('Export failed:', err);
            exportError =
                err instanceof Error
                    ? err.message
                    : opts.format === 'pdf'
                      ? 'Failed to export PDF'
                      : 'Failed to export';
        } finally {
            exporting = false;
            exportProgress = null;
        }
    }

    async function fetchAllPrices() {
        showPriceColumns = true;
        isFetchingPrice = true;
        priceError = '';
        epochPrices = {};
        const {
            epochPrices: prices,
            updatedCache,
            error,
        } = await fetchAllPricesUtil({
            epochs,
            epochEndDates,
            currentEpoch,
            selectedCurrency,
            loadedCache,
        });
        if (updatedCache) {
            loadedCache = updatedCache; // allow user to copy from console if desired
            console.log('Copy this to iota-prices-coingecko.json:');
            console.log(JSON.stringify(updatedCache, null, 2));
        }
        if (error) priceError = error;
        epochPrices = prices;
        isFetchingPrice = false;
        if (onPricesFetched) {
            onPricesFetched(prices);
        }
    }
</script>

{#if selectedStakeObject}
    <div class="address-hover-inline">
        <button
            class="close-hover"
            aria-label="Close address info"
            onclick={() => (selectedStakeObject = null)}>×</button
        >
        <div class="full-address">
            {selectedStakeObject.objectId}
        </div>
        <div class="principal">{formatPrincipal(getFirstPrincipal(selectedStakeObject))}</div>
        <div class="pool-id">
            Pool: {selectedStakeObject.poolId}
        </div>
        <div class="epochs-info">
            First Epoch: {selectedStakeObject.firstEpoch}
        </div>
        <div class="epochs-info">
            Last Epoch: {selectedStakeObject.lastEpoch}
        </div>
        {#if selectedStakeObject.actionByEpoch && Object.keys(selectedStakeObject.actionByEpoch).length > 0}
            <div class="actions-section">
                <div class="actions-title">Actions:</div>
                <div class="actions-list">
                    {#each Object.entries(selectedStakeObject.actionByEpoch).sort(([a], [b]) => Number(a) - Number(b)) as [epoch, actions]}
                        <div class="action-epoch-group">
                            <div class="action-epoch-label">Epoch {epoch}</div>
                            <div class="action-details-text">
                                {formatMultipleActionDetails(actions)}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}

{#if selectedValidator}
    <div class="validator-hover-inline">
        <button
            class="close-hover"
            aria-label="Close validator info"
            onclick={() => (selectedValidator = null)}>×</button
        >
        <div class="validator-display-name">{selectedValidator.name}</div>
        <div class="validator-display-pool-id">
            Pool ID: {selectedValidator.poolId}
            <button
                class="copy-btn validator-copy-btn"
                title="Copy pool ID"
                onclick={async (e) => {
                    e.stopPropagation();
                    if (selectedValidator?.poolId) {
                        await copyToClipboard(selectedValidator.poolId);
                    }
                }}
            >
                📋
            </button>
        </div>
        <div class="validator-stats">
            <div>
                Total stake objects: {stakeObjects.filter(
                    (obj) => obj.poolId === selectedValidator?.poolId,
                ).length}
            </div>
            <div>
                Total principal staked: {selectedValidator
                    ? getValidatorTotalPrincipal(selectedValidator.poolId, validatorPrincipal)
                    : '0'}
            </div>
        </div>
    </div>
{/if}

{#if selectedAction}
    <div class="action-hover-inline">
        <button
            class="close-hover"
            aria-label="Close action info"
            onclick={() => (selectedAction = null)}>×</button
        >
        <div class="action-title">
            Epoch {selectedAction.epoch} - {getActionNames(selectedAction.actions)}
        </div>
        <div class="action-stake-object">
            Stake Object: {selectedAction.stakeObjectId}
        </div>
        <div class="action-details">
            {formatMultipleActionDetails(selectedAction.actions)}
        </div>
    </div>
{/if}

<ExportDialog
    open={showExportDialog}
    defaultFileName={exportFileName}
    pricesAvailable={Object.keys(epochPrices).length > 0}
    validatorsAvailable={uniqueValidators.length > 0}
    stakeObjectsAvailable={stakeObjects.length > 0}
    {exporting}
    {exportProgress}
    buildPreview={(opts, previewRowLimit) =>
        buildExportSections({
            epochs: filteredEpochs,
            epochEndDates: filteredEpochEndDates,
            currentEpoch,
            stakeObjects,
            uniqueValidators,
            epochData,
            options: {
                showPriceColumns: opts.includePrices,
                showValidatorColumns: opts.includeValidators,
                epochPrices,
                selectedCurrency,
                wrapStakeObjects: opts.wrapStakeObjects,
                wrapValidators: opts.wrapValidators,
                ...(previousRewardsNotice && { previousRewardsNotice }),
            },
            previewRowLimit,
        })}
    onCancel={() => !exporting && (showExportDialog = false)}
    onExport={handleExportConfirm}
/>

<div style="margin-bottom: 8px; text-align: left;">
    The data may be incomplete or incorrect, so it is advisable to check it against other sources.
    <br />
    Values are estimates due to rounding. Epochs before the first transaction are hidden.
</div>

<div class="table-controls">
    <div class="controls-left">
        <label class="control-item">
            Currency:
            <select bind:value={selectedCurrency}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
            </select>
        </label>
        <button
            class="control-item"
            onclick={fetchAllPrices}
            disabled={isFetchingPrice || noTransactionsFound}
        >
            {isFetchingPrice ? 'Fetching... (rate limited)' : 'Fetch prices from coingecko'}
        </button>
        {#if priceError}
            <span style="color: red;">{priceError}</span>
        {/if}
        {#if Object.keys(epochPrices).length > 0}
            <span style="color: green;"
                >Prices loaded for {Object.keys(epochPrices).length} epochs</span
            >
        {/if}

        <label class="toggle-row control-item">
            <div class="toggle-switch">
                <input type="checkbox" bind:checked={showPriceColumns} />
                <span class="slider"></span>
            </div>
            <span class="toggle-label"> Show Prices </span>
        </label>

        <label class="toggle-row control-item">
            <div class="toggle-switch">
                <input type="checkbox" bind:checked={showValidatorColumns} />
                <span class="slider"></span>
            </div>
            <span class="toggle-label"> Show Validators </span>
        </label>

        <label class="toggle-row control-item">
            <div class="toggle-switch">
                <input type="checkbox" bind:checked={hideUnstaked} />
                <span class="slider"></span>
            </div>
            <span class="toggle-label"> Hide unstaked </span>
        </label>

        <label class="control-item toggle-row">
            <div class="toggle-switch">
                <input type="checkbox" bind:checked={showCompactView} />
                <span class="slider"></span>
            </div>
            <span>Compact view</span>
        </label>
    </div>
    <div class="controls-right">
        <button
            onclick={openExportDialog}
            style="min-width: 120px;"
            disabled={epochs.length === 0 || noTransactionsFound}
        >
            Export table...
        </button>
        {#if exportError}
            <div class="export-error" role="alert">
                Export failed: {exportError}
                <button
                    type="button"
                    class="export-error-dismiss"
                    aria-label="Dismiss"
                    onclick={() => (exportError = '')}>×</button
                >
            </div>
        {/if}
    </div>
</div>
{#if noTransactionsFound}
    <div style="text-align: center; padding: 2rem; color: #bacce6;">
        No stake transactions for this address.
    </div>
{:else if filteredEpochs.length > 0 && mounted}
    <div class="table-container">
        <div class="virtual-table" style="height: {height + 80}px">
            <!-- Fixed header that scrolls horizontally -->
            <div class="table-header" bind:this={headerElement} onscroll={syncHeaderScroll}>
                <div class="header-row">
                    <div class="header-cell epoch-header">Epoch</div>
                    <div class="header-cell end-date-header">End Date</div>
                    <div class="header-cell rewards-header">Staked</div>
                    <div class="header-cell rewards-header">Rewards</div>
                    <div class="header-cell rewards-header">Accumulated</div>
                    <div class="header-cell rewards-header">Unstake Rewards</div>
                    <div class="header-cell rewards-header">Unstake Total</div>
                    <div class="header-cell rewards-header">Available Rewards</div>
                    {#if showPriceColumns && Object.keys(epochPrices).length > 0}
                        <div class="header-cell rewards-header">
                            Price ({selectedCurrency.toUpperCase()})
                        </div>
                        <div class="header-cell rewards-header">
                            Rewards in {selectedCurrency.toUpperCase()}
                        </div>
                        <div class="header-cell rewards-header">
                            Accumulated in {selectedCurrency.toUpperCase()}
                        </div>
                        <div
                            class="header-cell rewards-header"
                            title="Cumulative unstake rewards × price on the day they were unstaked + current available rewards × price at this epoch"
                        >
                            Total Earned ({selectedCurrency.toUpperCase()})
                        </div>
                    {/if}
                    {#if showValidatorColumns}
                        {#each uniqueValidators as validator}
                            <div class="header-cell validator-header-cell">
                                <div class="validator-header">
                                    <div
                                        class="validator-name clickable-validator"
                                        role="button"
                                        tabindex="0"
                                        onclick={() => {
                                            selectedValidator =
                                                selectedValidator?.poolId === validator.poolId
                                                    ? null
                                                    : validator;
                                        }}
                                        onkeydown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                selectedValidator =
                                                    selectedValidator?.poolId === validator.poolId
                                                        ? null
                                                        : validator;
                                            }
                                        }}
                                    >
                                        {validator.name}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {/if}
                    {#each stakeObjects.filter((obj) => !hideUnstaked || obj.lastEpoch >= currentEpoch) as stakeObject}
                        <div class="header-cell stake-header-cell">
                            <div class="stake-header">
                                <div class="address-container">
                                    <span
                                        class="address"
                                        role="button"
                                        tabindex="0"
                                        onclick={() => {
                                            selectedStakeObject = stakeObject;
                                        }}
                                        onkeydown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                selectedStakeObject = stakeObject;
                                            }
                                        }}
                                    >
                                        {stakeObject.objectId.slice(
                                            0,
                                            6,
                                        )}..{stakeObject.objectId.slice(-3)}
                                        <button
                                            class="copy-btn"
                                            title="Copy full address"
                                            onclick={async (e) => {
                                                e.stopPropagation();
                                                await copyToClipboard(stakeObject.objectId);
                                            }}
                                        >
                                            📋
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Virtual scrolling body -->
            <div class="table-body" use:setupScrollSync>
                <List
                    bind:this={listElement}
                    itemCount={filteredEpochs.length}
                    itemSize={50}
                    {height}
                >
                    {#snippet item({ index, style }: { index: number; style: any })}
                        {#snippet amountCell(amount: bigint, displayValue?: string)}
                            <div class="table-cell rewards-cell">
                                <div class="amount-popup-container">
                                    {#if filteredEpochs[index] === currentEpoch}
                                        <span class="amount-value">pending</span>
                                    {:else}
                                        <button
                                            class="amount-value"
                                            title={formatExactIota(amount)}
                                            onclick={() => copyToClipboard(formatExactIota(amount))}
                                            onkeydown={(e) =>
                                                e.key === 'Enter' &&
                                                copyToClipboard(formatExactIota(amount))}
                                            type="button"
                                        >
                                            {displayValue ??
                                                (amount === 0n ? '0' : formatIota(amount, 2))}
                                        </button>
                                        <div class="amount-popup">
                                            <div>
                                                {formatExactIota(amount)}
                                            </div>
                                            <div class="nano-amount">
                                                {formatNano(amount)}
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/snippet}

                        <div
                            {style}
                            class="table-row"
                            class:highlight-recent={index === filteredEpochs.length - 2}
                        >
                            <div class="data-row">
                                <div class="table-cell epoch-cell">{filteredEpochs[index]}</div>
                                <div class="table-cell end-date-cell">
                                    {filteredEpochEndDates[index] || '-'}
                                </div>
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.totalStaked ?? 0n,
                                )}
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.totalRewards ?? 0n,
                                    epochData[filteredEpochs[index]]?.display.rewardsDisplay ?? '0',
                                )}
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.totalAccumulated ?? 0n,
                                    epochData[filteredEpochs[index]]?.display.accumulatedDisplay ??
                                        '0',
                                )}
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.totalUnstakeRewards ?? 0n,
                                    epochData[filteredEpochs[index]]?.display
                                        .unstakeRewardsDisplay ?? '0',
                                )}
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.totalUnstakeAccumulated ?? 0n,
                                    epochData[filteredEpochs[index]]?.display
                                        .unstakeAccumulatedDisplay ?? '0',
                                )}
                                {@render amountCell(
                                    epochData[filteredEpochs[index]]?.availableRewards ?? 0n,
                                    epochData[filteredEpochs[index]]?.display
                                        .availableRewardsDisplay ?? '0',
                                )}
                                {#if Object.keys(epochPrices).length > 0}
                                    {#if showPriceColumns && Object.keys(epochPrices).length > 0}
                                        <div class="table-cell rewards-cell">
                                            {filteredEpochs[index] === currentEpoch
                                                ? 'pending'
                                                : epochPrices[filteredEpochs[index]]
                                                  ? epochPrices[filteredEpochs[index]].toFixed(6)
                                                  : 'no price'}
                                        </div>
                                        <div class="table-cell rewards-cell">
                                            {filteredEpochs[index] === currentEpoch
                                                ? 'pending'
                                                : epochPrices[filteredEpochs[index]]
                                                  ? `${(nanoToIota(epochData[filteredEpochs[index]]?.totalRewards ?? 0n) * epochPrices[filteredEpochs[index]]).toFixed(2)} ${selectedCurrency.toUpperCase()}`
                                                  : 'no price'}
                                        </div>
                                        <div class="table-cell rewards-cell">
                                            {filteredEpochs[index] === currentEpoch
                                                ? 'pending'
                                                : epochPrices[filteredEpochs[index]]
                                                  ? `${(nanoToIota(epochData[filteredEpochs[index]]?.totalAccumulated ?? 0n) * epochPrices[filteredEpochs[index]]).toFixed(2)} ${selectedCurrency.toUpperCase()}`
                                                  : 'no price'}
                                        </div>
                                        {@const earned =
                                            filteredEpochs[index] === currentEpoch
                                                ? null
                                                : computeEarnedValueForEpoch(
                                                      filteredEpochs[index],
                                                      epochData,
                                                      cumulativeUnstakeFiat,
                                                      epochPrices,
                                                  )}
                                        <div class="table-cell rewards-cell">
                                            {filteredEpochs[index] === currentEpoch
                                                ? 'pending'
                                                : earned !== null
                                                  ? `${earned.toFixed(2)} ${selectedCurrency.toUpperCase()}`
                                                  : 'no price'}
                                        </div>
                                    {/if}
                                {/if}
                                {#if showValidatorColumns}
                                    {#each uniqueValidators as validator}
                                        <div class="table-cell validator-cell">
                                            <div class="validator-popup-container">
                                                {#if filteredEpochs[index] === currentEpoch}
                                                    pending
                                                {:else}
                                                    <button
                                                        class="validator-reward-value"
                                                        title={formatExactIota(
                                                            epochData[filteredEpochs[index]]
                                                                ?.validatorRewards[
                                                                validator.poolId
                                                            ] ?? 0n,
                                                        )}
                                                        onclick={() =>
                                                            copyToClipboard(
                                                                formatExactIota(
                                                                    epochData[filteredEpochs[index]]
                                                                        ?.validatorRewards[
                                                                        validator.poolId
                                                                    ] ?? 0n,
                                                                ),
                                                            )}
                                                        onkeydown={(e) =>
                                                            e.key === 'Enter' &&
                                                            copyToClipboard(
                                                                formatExactIota(
                                                                    epochData[filteredEpochs[index]]
                                                                        ?.validatorRewards[
                                                                        validator.poolId
                                                                    ] ?? 0n,
                                                                ),
                                                            )}
                                                        type="button"
                                                    >
                                                        {getValidatorRewardsForEpoch(
                                                            validator.poolId,
                                                            filteredEpochs[index],
                                                            epochData,
                                                        )}
                                                    </button>
                                                    <div class="validator-popup">
                                                        <div>
                                                            Validator: {validator.name}
                                                        </div>
                                                        <div>
                                                            Pool ID: {validator.poolId}
                                                        </div>
                                                        <div>
                                                            Rewards this epoch: {formatExactIota(
                                                                epochData[filteredEpochs[index]]
                                                                    ?.validatorRewards[
                                                                    validator.poolId
                                                                ] ?? 0n,
                                                            )}
                                                        </div>
                                                        <div class="nano-amount">
                                                            {formatNano(
                                                                epochData[filteredEpochs[index]]
                                                                    ?.validatorRewards[
                                                                    validator.poolId
                                                                ] ?? 0n,
                                                            )}
                                                        </div>
                                                        <div>
                                                            Accumulated rewards: {formatExactIota(
                                                                epochData[filteredEpochs[index]]
                                                                    ?.validatorAccumulated[
                                                                    validator.poolId
                                                                ] ?? 0n,
                                                            )}
                                                        </div>
                                                        <div class="nano-amount">
                                                            {formatNano(
                                                                epochData[filteredEpochs[index]]
                                                                    ?.validatorAccumulated[
                                                                    validator.poolId
                                                                ] ?? 0n,
                                                            )}
                                                        </div>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                {/if}
                                {#each stakeObjects.filter((obj) => !hideUnstaked || obj.lastEpoch >= currentEpoch) as stakeObject}
                                    <div class="table-cell stake-cell">
                                        <div class="stake-popup-container">
                                            {#if isActiveInEpoch(stakeObject, filteredEpochs[index], epochData) && filteredEpochs[index] >= stakeObject.firstEpoch && filteredEpochs[index] !== currentEpoch}
                                                <div class="stake-cell-content">
                                                    {#if !stakeObject.rewardsByEpoch[filteredEpochs[index]] || stakeObject.rewardsByEpoch[filteredEpochs[index]] === '0'}
                                                        <span class="stake-value">-</span>
                                                    {:else}
                                                        <button
                                                            class="stake-value"
                                                            title={formatExactIota(
                                                                BigInt(
                                                                    stakeObject.rewardsByEpoch[
                                                                        filteredEpochs[index]
                                                                    ],
                                                                ),
                                                            )}
                                                            onclick={() =>
                                                                copyToClipboard(
                                                                    formatExactIota(
                                                                        BigInt(
                                                                            stakeObject
                                                                                .rewardsByEpoch[
                                                                                filteredEpochs[
                                                                                    index
                                                                                ]
                                                                            ],
                                                                        ),
                                                                    ),
                                                                )}
                                                            onkeydown={(e) =>
                                                                e.key === 'Enter' &&
                                                                copyToClipboard(
                                                                    formatExactIota(
                                                                        BigInt(
                                                                            stakeObject
                                                                                .rewardsByEpoch[
                                                                                filteredEpochs[
                                                                                    index
                                                                                ]
                                                                            ],
                                                                        ),
                                                                    ),
                                                                )}
                                                            type="button"
                                                        >
                                                            {formatIota(
                                                                stakeObject.rewardsByEpoch[
                                                                    filteredEpochs[index]
                                                                ],
                                                                2,
                                                            )}
                                                        </button>
                                                    {/if}
                                                    <div class="stake-popup">
                                                        <div>
                                                            Rewards this epoch: {formatIota(
                                                                stakeObject.rewardsByEpoch[
                                                                    filteredEpochs[index]
                                                                ],
                                                                9,
                                                            )}
                                                        </div>
                                                        <div>
                                                            Accumulated rewards: {formatIota(
                                                                stakeObject.accumulatedRewards[
                                                                    filteredEpochs[index]
                                                                ],
                                                                9,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            {:else if isActiveInEpoch(stakeObject, filteredEpochs[index] - 1, epochData) && filteredEpochs[index] === currentEpoch && (!stakeObject.actionByEpoch || !stakeObject.actionByEpoch[filteredEpochs[index]] || stakeObject.actionByEpoch[filteredEpochs[index]].length === 0)}
                                                pending
                                            {:else if !stakeObject.actionByEpoch || !stakeObject.actionByEpoch[filteredEpochs[index]] || stakeObject.actionByEpoch[filteredEpochs[index]].length === 0}
                                                <div class="inactive-indicator">-</div>
                                            {/if}
                                            {#if stakeObject.actionByEpoch && stakeObject.actionByEpoch[filteredEpochs[index]] && stakeObject.actionByEpoch[filteredEpochs[index]].length > 0}
                                                <button
                                                    class="action-indicator clickable-action"
                                                    type="button"
                                                    onclick={() => {
                                                        const actionsData =
                                                            stakeObject.actionByEpoch?.[
                                                                filteredEpochs[index]
                                                            ];
                                                        if (actionsData && actionsData.length > 0) {
                                                            selectedAction = {
                                                                actions: actionsData,
                                                                epoch: filteredEpochs[index],
                                                                stakeObjectId: stakeObject.objectId,
                                                            };
                                                        }
                                                    }}
                                                    >{getActionNames(
                                                        stakeObject.actionByEpoch[
                                                            filteredEpochs[index]
                                                        ],
                                                    )}

                                                    {#if stakeObject.principalByEpoch[filteredEpochs[index]] && stakeObject.principalByEpoch[filteredEpochs[index] - 1] && stakeObject.principalByEpoch[filteredEpochs[index]] !== stakeObject.principalByEpoch[filteredEpochs[index] - 1]}
                                                        <span class="principal-change-tooltip">
                                                            <span class="principal-change-icon"
                                                                >❗</span
                                                            >
                                                            <span class="principal-tooltip-text">
                                                                Principal amount changed from
                                                                {formatIota(
                                                                    stakeObject.principalByEpoch[
                                                                        filteredEpochs[index] - 1
                                                                    ],
                                                                    2,
                                                                )} to
                                                                {formatIota(
                                                                    stakeObject.principalByEpoch[
                                                                        filteredEpochs[index]
                                                                    ],
                                                                    2,
                                                                )}
                                                            </span>
                                                        </span>
                                                    {/if}
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/snippet}
                </List>
            </div>
        </div>
    </div>
{/if}

<style>
    .table-container {
        border-radius: 4px;
    }

    .virtual-table {
        display: flex;
        flex-direction: column;
    }

    .table-header {
        position: sticky;
        top: 0;
        z-index: 20;
        background-color: #131d2b;
        border-bottom: 1px solid #bacce6;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .table-header::-webkit-scrollbar {
        display: none;
    }
    .table-body {
        flex: 1;
        overflow: auto;
    }
    .table-row {
        display: flex;
        align-items: center;
        min-height: 32px;
    }
    .table-row.highlight-recent {
        background-color: #1e2a3a;
        border-left: 3px solid #4a90e2;
    }
    .header-row {
        display: flex;
        align-items: center;
        min-height: 60px;
        font-weight: 600;
        min-width: fit-content;
    }
    .data-row {
        display: flex;
        align-items: center;
        min-height: 32px;
        border-bottom: 1px solid #2a3441;
        min-width: fit-content;
    }
    .data-row:hover {
        background-color: #1a2332;
    }
    .table-cell,
    .header-cell {
        padding: 4px;
        text-align: center;
        border-right: 1px solid #2a3441;
    }
    .header-cell {
        padding: 8px 4px;
        font-weight: 600;
        border-right: 1px solid #bacce6;
    }
    .epoch-header,
    .epoch-cell {
        position: sticky;
        left: 0;
        z-index: 21;
        background-color: #131d2b;
        box-shadow: 2px 0 4px -2px #0002;
        width: 70px;
        flex-shrink: 0;
        font-size: 1em !important;
    }
    .end-date-header,
    .end-date-cell {
        width: 150px;
        flex-shrink: 0;
        font-size: 1em !important;
    }
    .rewards-header,
    .rewards-cell {
        width: 140px;
        flex-shrink: 0;
        font-size: 1em !important;
        cursor: pointer;
    }
    .validator-header-cell,
    .validator-cell {
        width: 150px;
        flex-shrink: 0;
        font-size: 1em !important;
    }
    .stake-header-cell,
    .stake-cell {
        width: 140px;
        flex-shrink: 0;
    }

    .validator-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.85em;
    }

    .validator-name {
        font-weight: bold;
        color: #ffffff;
        word-break: break-word;
    }

    .clickable-validator {
        cursor: pointer;
        padding: 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
    }

    .clickable-validator:hover {
        background-color: rgba(186, 204, 230, 0.1);
    }

    .stake-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.85em;
    }

    .address-container {
        position: relative;
        display: inline-block;
    }

    .address {
        font-family: monospace;
        font-weight: bold;
        color: #ffffff;
        word-break: break-all;
    }

    .address:hover {
        background-color: rgba(186, 204, 230, 0.1);
    }

    .close-hover {
        position: absolute;
        top: 8px;
        right: 12px;
        background: none;
        border: none;
        color: #ff3b3b;
        font-size: 1.5em;
        cursor: pointer;
        z-index: 10000;
        padding: 0;
        font-weight: bold;
    }

    .full-address {
        font-family: monospace;
        margin-bottom: 4px;
        word-break: break-all;
        color: #a5bbe1;
    }

    .principal {
        color: #a5bbe1;
        font-weight: 500;
        margin-bottom: 2px;
    }

    .pool-id {
        color: #bacce6;
        font-size: 0.9em;
        font-family: monospace;
    }

    .epoch-cell {
        font-weight: 500;
        background-color: #131d2b;
        font-size: 0.75em;
    }

    .rewards-cell {
        font-size: 0.75em;
    }

    .validator-cell {
        font-size: 0.75em;
        padding: 4px;
        color: white;
        font-weight: normal;
    }

    .stake-cell {
        padding: 4px;
    }

    .inactive-indicator {
        color: #e2e8f0;
        font-size: 1em;
        font-size: 0.75em;
    }

    .copy-btn {
        background: none;
        background-color: rgba(102, 108, 113, 0.479);
        border: none;
        cursor: pointer;
        font-size: 0.1em;
        color: #a1b5d8;
        line-height: 1;
        padding: 0.3rem;
        border-radius: 3px;
    }

    .address-hover-inline {
        position: relative;
        margin: 0 auto 16px auto;
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 16px 16px 16px 16px;
        min-width: 260px;
        max-width: 600px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        font-family: monospace;
        display: flex;
        flex-direction: column;
    }

    .address-hover-inline .full-address,
    .address-hover-inline .pool-id,
    .address-hover-inline .epochs-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
    }

    .actions-section {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #3a4451;
    }

    .actions-title {
        font-weight: 600;
        margin-bottom: 8px;
        color: #bacce6;
    }

    .actions-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .action-epoch-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .action-epoch-label {
        font-size: 0.95em;
        color: #bacce6;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .action-details-text {
        color: #a5bbe1;
        font-size: 0.85em;
        padding-left: 12px;
        white-space: pre-line;
        line-height: 1.5;
    }

    .validator-hover-inline {
        position: relative;
        margin: 0 auto 16px auto;
        background: #2a3441;
        color: #fff;
        border: 1px solid #38a169;
        border-radius: 6px;
        padding: 16px 16px 16px 16px;
        min-width: 260px;
        max-width: 600px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        display: flex;
        flex-direction: column;
    }

    .validator-display-name {
        font-size: 1.2em;
        font-weight: bold;
        color: #38a169;
        margin-bottom: 8px;
    }

    .validator-display-pool-id {
        font-family: monospace;
        color: #a5bbe1;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .validator-copy-btn {
        background-color: rgba(56, 161, 105, 0.2);
        border: 1px solid #38a169;
        color: #38a169;
    }

    .validator-copy-btn:hover {
        background-color: rgba(56, 161, 105, 0.3);
    }

    .validator-stats {
        color: #bacce6;
        font-size: 0.9em;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    /* Add CSS for popup */
    .stake-popup-container {
        position: relative;
    }
    .stake-cell-content .stake-popup {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translateX(-50%) translateY(-8px);
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 8px 12px;
        min-width: 180px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        z-index: 9999;
    }
    .stake-cell-content:hover .stake-popup {
        display: block;
    }

    /* Validator popup styles */
    .validator-popup-container {
        position: relative;
        display: inline-block;
    }
    .validator-popup-container .validator-popup {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translateX(-50%) translateY(-8px);
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 8px 12px;
        min-width: 200px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        z-index: 9999;
    }
    .validator-popup-container:hover .validator-popup {
        display: block;
    }
    .validator-reward-value {
        cursor: pointer;
        font-weight: normal;
        color: white;
        background: none;
        border: none;
        padding: 0;
        font-family: inherit;
        font-size: inherit;
        text-align: inherit;
    }
    .validator-reward-value:focus {
        outline: 2px solid #007acc;
        outline-offset: 2px;
    }
    .amount-popup-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }
    .amount-popup-container .amount-popup {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translateX(-50%) translateY(-8px);
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 8px 12px;
        min-width: 180px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        font-weight: normal;
        white-space: pre-line;
        z-index: 9999;
    }
    .amount-popup-container:hover .amount-popup {
        display: block;
    }
    .amount-value {
        cursor: pointer;
        font-weight: normal;
        color: white;
        background: none;
        border: none;
        padding: 0;
        font-family: inherit;
        font-size: inherit;
        text-align: inherit;
    }
    .amount-value:focus {
        outline: 2px solid #007acc;
        outline-offset: 2px;
    }
    .nano-amount {
        font-size: 0.9em;
        color: #cccccc;
        margin-top: 2px;
    }
    .stake-value {
        cursor: pointer;
        font-weight: normal;
        color: white;
        background: none;
        border: none;
        padding: 0;
        font-family: inherit;
        font-size: inherit;
        text-align: inherit;
    }
    .stake-value:focus {
        outline: 2px solid #007acc;
        outline-offset: 2px;
    }

    .principal-change-tooltip {
        position: relative;
        display: inline-block;
        margin-left: 6px;
    }
    .principal-change-icon {
        color: #ff9800;
        font-size: 1em;
        cursor: pointer;
        vertical-align: middle;
    }
    .principal-tooltip-text {
        visibility: hidden;
        width: max-content;
        background-color: #232b3a;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 8px 12px;
        position: absolute;
        z-index: 10000;
        left: 50%;
        bottom: 120%;
        transform: translateX(-50%);
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        border: 1px solid #ff9800;
    }
    .principal-change-tooltip:hover .principal-tooltip-text {
        visibility: visible;
    }
    .action-indicator {
        font-size: 0.75em;
        margin-left: 10px;
        text-align: center;
        background: none;
        border: none;
        color: inherit;
        font-family: inherit;
    }

    .clickable-action {
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
    }

    .clickable-action:hover {
        background-color: rgba(186, 204, 230, 0.2);
    }

    .action-hover-inline {
        position: relative;
        margin: 0 auto 16px auto;
        background: #2a3441;
        color: #fff;
        border: 1px solid #4fc3f7;
        border-radius: 6px;
        padding: 16px 40px 16px 16px;
        min-width: 300px;
        max-width: 700px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .action-stake-object {
        font-family: monospace;
        color: #a5bbe1;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .action-details {
        color: #bacce6;
        font-family: monospace;
        font-size: 0.9em;
        white-space: pre-line;
        line-height: 1.4;
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

    .table-controls {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .control-item select {
        margin-left: 0.25rem;
    }

    .export-error {
        margin-top: 0.4rem;
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.1);
        color: rgba(254, 202, 202, 0.95);
        border-radius: 6px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 320px;
    }

    .export-error-dismiss {
        background: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        padding: 0 0.25rem;
        margin-left: auto;
    }

    .controls-left {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        min-width: 0;
    }

    .controls-right {
        margin-left: auto;
    }

    @media (max-width: 768px) {
        .table-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .controls-left {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
        }

        .controls-right {
            margin-left: 0;
            width: 100%;
        }

        .controls-right button {
            width: 100%;
        }

        .control-item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Ensure buttons in control-item take full width if they are the item */
        button.control-item {
            justify-content: center;
        }

        .toggle-row {
            background: rgba(255, 255, 255, 0.03);
            padding: 0.5rem;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
    }
</style>

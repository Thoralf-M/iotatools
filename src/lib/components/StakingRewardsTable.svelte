<script lang="ts">
    import { onMount } from 'svelte';
    import { List } from 'svelte-virtual';

    import { getSelectedNetworkConfig } from '../lib/client';
    import type {
        ActionDetails,
        StakeObject,
        TableComputationResult,
        ValidatorInfo,
    } from '../lib/staking-rewards/';
    import pricesCache from '../lib/staking-rewards/cache/iota-prices-coingecko.json';
    import epochTimestampsCacheJson from '../lib/staking-rewards/cache/mainnet-epoch-timestamps-cache.json';
    import { exportTableToCSV, type ExportOptions } from '../lib/staking-rewards/csv-export';
    import { fetchEpochTimestampsForDisplay } from '../lib/staking-rewards/graphql-requests';
    import {
        fetchAllPrices as fetchAllPricesUtil,
        reloadFromCoinGeckoCache,
    } from '../lib/staking-rewards/price-fetching';
    import {
        computeEpochData,
        formatActionDetails,
        formatMultipleActionDetails,
        formatPrincipal,
        getActionNames,
        getFirstPrincipal,
        getTotalAccumulatedRewardsForEpoch,
        getTotalAccumulatedUnstakeRewardsForEpoch,
        getTotalRewardsForEpoch,
        getTotalStakedForEpoch,
        getTotalUnstakeRewardsForEpoch,
        getValidatorAccumulatedRewardsForEpoch,
        getValidatorRewardsForEpoch,
        getValidatorTotalPrincipal,
        hasActionType,
        isActiveInEpoch,
        isPreActivationInEpoch,
    } from '../lib/staking-rewards/table-utils';

    let {
        currentEpoch = 0,
        stakeObjects = [],
        validatorInfo = {},
        showPriceColumns = $bindable(true),
        showValidatorColumns = $bindable(true),
    } = $props();

    let height = $state(800);

    onMount(() => {
        const updateHeight = () => {
            height = window.innerWidth < 768 ? 600 : 800;
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    });

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    // Computed table data
    let tableData = $derived.by(() => computeEpochData(stakeObjects, validatorInfo, currentEpoch));

    // Destructure for easy access
    let { minEpoch, uniqueValidators, epochData, validatorPrincipal, epochs } = $derived(tableData);

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

    let selectedCurrency = $state<'usd' | 'eur'>('usd');
    let previousCurrency = $state<'usd' | 'eur'>('usd');
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

    // Export table data to CSV
    function handleExportCSV() {
        const options: ExportOptions = {
            showPriceColumns,
            showValidatorColumns,
            epochPrices,
            selectedCurrency,
        };

        exportTableToCSV(
            epochs,
            epochEndDates,
            currentEpoch,
            stakeObjects,
            uniqueValidators,
            epochData,
            options,
        );
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
    }
</script>

{#if selectedStakeObject}
    <div class="address-hover-inline">
        <button
            class="close-hover"
            aria-label="Close address info"
            onclick={() => (selectedStakeObject = null)}>×</button
        >
        <div class="full-address">{selectedStakeObject.objectId}</div>
        <div class="principal">{formatPrincipal(getFirstPrincipal(selectedStakeObject))}</div>
        <div class="pool-id">
            Pool: {selectedStakeObject.poolId}
        </div>
        First Epoch: {selectedStakeObject.firstEpoch}
        Last Epoch: {selectedStakeObject.lastEpoch}
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
                onclick={(e) => {
                    e.stopPropagation();
                    if (selectedValidator?.poolId) {
                        copyToClipboard(selectedValidator.poolId);
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
        <button class="control-item" onclick={fetchAllPrices} disabled={isFetchingPrice}>
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
    </div>
    <div class="controls-right">
        <button onclick={handleExportCSV} style="min-width: 120px;"> Export table to CSV </button>
    </div>
</div>
<div class="table-container">
    <div class="virtual-table">
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
                {#each stakeObjects as stakeObject}
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
                                    {stakeObject.objectId.slice(0, 6)}..{stakeObject.objectId.slice(
                                        -3,
                                    )}
                                    <button
                                        class="copy-btn"
                                        title="Copy full address"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(stakeObject.objectId);
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
            {#key epochData}
                <List bind:this={listElement} itemCount={epochs.length} itemSize={50} {height}>
                    <div slot="item" let:index let:style {style} class="table-row">
                        <div class="data-row">
                            <div class="table-cell epoch-cell">{epochs[index]}</div>
                            <div class="table-cell end-date-cell">
                                {epochEndDates[index] || '-'}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalStakedForEpoch(epochs[index], stakeObjects)}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalRewardsForEpoch(epochs[index], epochData)}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalAccumulatedRewardsForEpoch(epochs[index], epochData)}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalUnstakeRewardsForEpoch(epochs[index], epochData)}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalAccumulatedUnstakeRewardsForEpoch(
                                          epochs[index],
                                          epochData,
                                      )}
                            </div>
                            {#if Object.keys(epochPrices).length > 0}
                                {#if showPriceColumns && Object.keys(epochPrices).length > 0}
                                    <div class="table-cell rewards-cell">
                                        {epochs[index] === currentEpoch
                                            ? 'pending'
                                            : epochPrices[epochs[index]]
                                              ? epochPrices[epochs[index]].toFixed(6)
                                              : 'no price'}
                                    </div>
                                    <div class="table-cell rewards-cell">
                                        {epochs[index] === currentEpoch
                                            ? 'pending'
                                            : epochPrices[epochs[index]]
                                              ? `${(
                                                    Number(
                                                        getTotalRewardsForEpoch(
                                                            epochs[index],
                                                            epochData,
                                                        ).replace(' IOTA', ''),
                                                    ) * epochPrices[epochs[index]]
                                                ).toFixed(2)} ${selectedCurrency.toUpperCase()}`
                                              : 'no price'}
                                    </div>
                                    <div class="table-cell rewards-cell">
                                        {epochs[index] === currentEpoch
                                            ? 'pending'
                                            : epochPrices[epochs[index]]
                                              ? `${(
                                                    Number(
                                                        getTotalAccumulatedRewardsForEpoch(
                                                            epochs[index],
                                                            epochData,
                                                        ).replace(' IOTA', ''),
                                                    ) * epochPrices[epochs[index]]
                                                ).toFixed(2)} ${selectedCurrency.toUpperCase()}`
                                              : 'no price'}
                                    </div>
                                {/if}
                            {/if}
                            {#if showValidatorColumns}
                                {#each uniqueValidators as validator}
                                    <div class="table-cell validator-cell">
                                        <div class="validator-popup-container">
                                            {#if epochs[index] === currentEpoch}
                                                pending
                                            {:else}
                                                <span class="validator-reward-value">
                                                    {getValidatorRewardsForEpoch(
                                                        validator.poolId,
                                                        epochs[index],
                                                        epochData,
                                                    )}
                                                </span>
                                                <div class="validator-popup">
                                                    <div>
                                                        Validator: {validator.name}
                                                    </div>
                                                    <div>
                                                        Pool ID: {validator.poolId}
                                                    </div>
                                                    <div>
                                                        Rewards this epoch: {getValidatorRewardsForEpoch(
                                                            validator.poolId,
                                                            epochs[index],
                                                            epochData,
                                                        )}
                                                    </div>
                                                    <div>
                                                        Accumulated rewards: {getValidatorAccumulatedRewardsForEpoch(
                                                            validator.poolId,
                                                            epochs[index],
                                                            epochData,
                                                        )}
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                            {#each stakeObjects as stakeObject}
                                <div class="table-cell stake-cell">
                                    <div class="stake-popup-container">
                                        {#if isPreActivationInEpoch(stakeObject, epochs[index], epochData)}
                                            <div class="pre-active-indicator">pre-active</div>
                                        {:else if isActiveInEpoch(stakeObject, epochs[index], epochData) && epochs[index] >= stakeObject.firstEpoch && epochs[index] !== currentEpoch && !hasActionType(stakeObject.actionByEpoch?.[epochs[index]], 'Unstaked')}
                                            <div class="stake-cell-content">
                                                <span class="stake-value">
                                                    {stakeObject.rewardsByEpoch[epochs[index]] ===
                                                    '0'
                                                        ? '-'
                                                        : (
                                                              Number(
                                                                  stakeObject.rewardsByEpoch[
                                                                      epochs[index]
                                                                  ],
                                                              ) / 1_000_000_000
                                                          ).toFixed(2) + ' IOTA'}
                                                </span>
                                                <div class="stake-popup">
                                                    <div>
                                                        Rewards this epoch: {(
                                                            Number(
                                                                stakeObject.rewardsByEpoch[
                                                                    epochs[index]
                                                                ],
                                                            ) / 1_000_000_000
                                                        ).toFixed(9)} IOTA
                                                    </div>
                                                    <div>
                                                        Accumulated rewards: {(
                                                            Number(
                                                                stakeObject.accumulatedRewards[
                                                                    epochs[index]
                                                                ],
                                                            ) / 1_000_000_000
                                                        ).toFixed(9)} IOTA
                                                    </div>
                                                </div>
                                            </div>
                                        {:else if isActiveInEpoch(stakeObject, epochs[index - 1], epochData) && epochs[index] === currentEpoch && (!stakeObject.actionByEpoch || !stakeObject.actionByEpoch[epochs[index]] || stakeObject.actionByEpoch[epochs[index]].length === 0)}
                                            pending
                                        {:else if !stakeObject.actionByEpoch || !stakeObject.actionByEpoch[epochs[index]] || stakeObject.actionByEpoch[epochs[index]].length === 0}
                                            <div class="inactive-indicator">-</div>
                                        {/if}
                                        {#if stakeObject.actionByEpoch && stakeObject.actionByEpoch[epochs[index]] && stakeObject.actionByEpoch[epochs[index]].length > 0}
                                            <button
                                                class="action-indicator clickable-action"
                                                type="button"
                                                onclick={() => {
                                                    const actionsData =
                                                        stakeObject.actionByEpoch?.[epochs[index]];
                                                    if (actionsData && actionsData.length > 0) {
                                                        selectedAction = {
                                                            actions: actionsData,
                                                            epoch: epochs[index],
                                                            stakeObjectId: stakeObject.objectId,
                                                        };
                                                    }
                                                }}
                                                >{getActionNames(
                                                    stakeObject.actionByEpoch[epochs[index]],
                                                )}

                                                {#if stakeObject.principalByEpoch[epochs[index]] && stakeObject.principalByEpoch[epochs[index - 1]] && stakeObject.principalByEpoch[epochs[index]] !== stakeObject.principalByEpoch[epochs[index - 1]]}
                                                    <span class="principal-change-tooltip">
                                                        <span class="principal-change-icon">❗</span
                                                        >
                                                        <span class="principal-tooltip-text">
                                                            Principal amount changed from
                                                            {(
                                                                Number(
                                                                    stakeObject.principalByEpoch[
                                                                        epochs[index - 1]
                                                                    ],
                                                                ) / 1_000_000_000
                                                            ).toFixed(2)} IOTA to
                                                            {(
                                                                Number(
                                                                    stakeObject.principalByEpoch[
                                                                        epochs[index]
                                                                    ],
                                                                ) / 1_000_000_000
                                                            ).toFixed(2)} IOTA
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
                </List>
            {/key}
        </div>
    </div>
</div>

<style>
    .table-container {
        overflow-x: auto;
        border-radius: 4px;
    }

    .virtual-table {
        display: flex;
        flex-direction: column;
        height: 900px;
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
        color: #38a169;
        font-weight: bold;
    }

    .stake-cell {
        padding: 4px;
    }

    .inactive-indicator {
        color: #e2e8f0;
        font-size: 1em;
        font-size: 0.75em;
    }

    .pre-active-indicator {
        color: black;
        background-color: #ff9800;
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
        font-weight: bold;
        color: #38a169;
    }
    .stake-value {
        cursor: pointer;
        font-weight: bold;
        color: #38a169;
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

    .action-title {
        font-size: 1.2em;
        font-weight: bold;
        color: #4fc3f7;
    }

    .action-stake-object {
        font-family: monospace;
        color: #a5bbe1;
        font-size: 0.9em;
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

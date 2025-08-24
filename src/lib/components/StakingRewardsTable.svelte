<script lang="ts">
    import { List } from 'svelte-virtual';

    import { getSelectedNetworkConfig } from '../lib/client';
    import type { ActionDetails, StakeObject, ValidatorInfo } from '../lib/staking-rewards/';
    import {
        fetchEpochEndTimestamp,
        fetchEpochStartTimestamp,
    } from '../lib/staking-rewards/graphql-requests';
    import pricesCache from './iota-prices-coingecko.json';
    import epochTimestampsCacheJson from './mainnet-epoch-timestamps-cache.json';

    export let currentEpoch: number = 0;
    export let stakeObjects: StakeObject[] = [];
    export let validatorInfo: Record<string, ValidatorInfo> = {};

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    // Toggle state for columns
    let showPriceColumns = true;
    let showValidatorColumns = true;
    // Efficient computation: single pass over stakeObjects
    let minEpoch = 0;
    let uniqueValidators: ValidatorInfo[] = [];
    let epochData: Record<
        number,
        {
            totalRewards: bigint;
            totalAccumulated: bigint;
            validatorRewards: Record<string, bigint>;
            validatorAccumulated: Record<string, bigint>;
            stakeRewards: Record<string, string>;
            stakeAccumulated: Record<string, string>;
            preActive: Record<string, boolean>;
            active: Record<string, boolean>;
        }
    > = {};
    let validatorPrincipal: Record<string, bigint> = {};

    $: {
        // Reset
        minEpoch = 0;
        uniqueValidators = [];
        epochData = {};
        validatorPrincipal = {};
        if (stakeObjects.length === 0) {
            minEpoch = 0;
            uniqueValidators = [];
            epochData = {};
            validatorPrincipal = {};
        } else {
            let min = Infinity;
            const poolIds = new Set<string>();
            // Find minEpoch and uniqueValidators
            stakeObjects.forEach((stakeObject) => {
                if (stakeObject.firstEpoch < min) min = stakeObject.firstEpoch;
                poolIds.add(stakeObject.poolId);
            });
            minEpoch = min === Infinity ? 0 : min;
            uniqueValidators = Array.from(poolIds).map(
                (poolId) =>
                    validatorInfo[poolId] || { name: `Unknown (${poolId.slice(0, 6)}...)`, poolId },
            );

            // Build epochData and validatorPrincipal
            const epochRange = Array.from({ length: currentEpoch + 1 }, (_, i) => i).slice(
                minEpoch,
            );
            epochRange.forEach((epoch) => {
                epochData[epoch] = {
                    totalRewards: 0n,
                    totalAccumulated: 0n,
                    validatorRewards: {},
                    validatorAccumulated: {},
                    stakeRewards: {},
                    stakeAccumulated: {},
                    preActive: {},
                    active: {},
                };
            });
            stakeObjects.forEach((stakeObject) => {
                // Principal for validator
                if (!validatorPrincipal[stakeObject.poolId]) {
                    const firstPrincipal = getFirstPrincipal(stakeObject);
                    if (firstPrincipal && firstPrincipal !== '0') {
                        try {
                            validatorPrincipal[stakeObject.poolId] = BigInt(firstPrincipal);
                        } catch {}
                    } else {
                        validatorPrincipal[stakeObject.poolId] = 0n;
                    }
                }
                epochRange.forEach((epoch) => {
                    // Rewards
                    const rewards = stakeObject.rewardsByEpoch[epoch];
                    if (rewards && rewards !== '0') {
                        try {
                            epochData[epoch].totalRewards += BigInt(rewards);
                            if (!epochData[epoch].validatorRewards[stakeObject.poolId]) {
                                epochData[epoch].validatorRewards[stakeObject.poolId] = 0n;
                            }
                            epochData[epoch].validatorRewards[stakeObject.poolId] +=
                                BigInt(rewards);
                        } catch {}
                    }
                    epochData[epoch].stakeRewards[stakeObject.objectId] = rewards || '0';
                    // Pre-active/active
                    epochData[epoch].preActive[stakeObject.objectId] =
                        epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
                    epochData[epoch].active[stakeObject.objectId] =
                        epoch >= stakeObject.firstEpoch && epoch <= stakeObject.lastEpoch;
                });
            });

            // Compute accumulated rewards for each epoch (totalAccumulated)
            for (let i = 0; i < epochRange.length; i++) {
                const epoch = epochRange[i];
                const prevEpoch = epochRange[i - 1];
                epochData[epoch].totalAccumulated =
                    epochData[epoch].totalRewards +
                    (prevEpoch !== undefined ? epochData[prevEpoch].totalAccumulated : 0n);
            }

            // Compute validatorAccumulated and stakeAccumulated for each epoch
            stakeObjects.forEach((stakeObject) => {
                epochRange.forEach((epoch, i) => {
                    // Validator accumulated
                    if (!epochData[epoch].validatorAccumulated[stakeObject.poolId]) {
                        epochData[epoch].validatorAccumulated[stakeObject.poolId] = 0n;
                    }
                    const rewards = stakeObject.rewardsByEpoch[epoch];
                    if (rewards && rewards !== '0') {
                        epochData[epoch].validatorAccumulated[stakeObject.poolId] +=
                            BigInt(rewards);
                    }
                    if (i > 0) {
                        const prevEpoch = epochRange[i - 1];
                        epochData[epoch].validatorAccumulated[stakeObject.poolId] +=
                            epochData[prevEpoch].validatorAccumulated[stakeObject.poolId] || 0n;
                    }
                    // Stake accumulated
                    if (!epochData[epoch].stakeAccumulated[stakeObject.objectId]) {
                        epochData[epoch].stakeAccumulated[stakeObject.objectId] = '0';
                    }
                    const stakeRewards = stakeObject.rewardsByEpoch[epoch];
                    let prevAccum =
                        i > 0
                            ? BigInt(
                                  epochData[epochRange[i - 1]].stakeAccumulated[
                                      stakeObject.objectId
                                  ] || '0',
                              )
                            : 0n;
                    let currAccum =
                        (stakeRewards && stakeRewards !== '0' ? BigInt(stakeRewards) : 0n) +
                        prevAccum;
                    epochData[epoch].stakeAccumulated[stakeObject.objectId] = currAccum.toString();
                });
            });
        }
    }

    let epochs: number[] = [];
    $: epochs = Array.from({ length: currentEpoch + 1 }, (_, i) => i).slice(minEpoch);

    // Efficient lookup helpers
    function isActiveInEpoch(stakeObject: StakeObject, epoch: number): boolean {
        return epochData[epoch]?.active[stakeObject.objectId] ?? false;
    }
    function isPreActivationInEpoch(stakeObject: StakeObject, epoch: number): boolean {
        return epochData[epoch]?.preActive[stakeObject.objectId] ?? false;
    }
    function getTotalRewardsForEpoch(epoch: number): string {
        const total = epochData[epoch]?.totalRewards ?? 0n;
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    function getTotalAccumulatedRewardsForEpoch(epoch: number): string {
        const total = epochData[epoch]?.totalAccumulated ?? 0n;
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    function getValidatorRewardsForEpoch(validatorPoolId: string, epoch: number): string {
        const total = epochData[epoch]?.validatorRewards[validatorPoolId] ?? 0n;
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    function getValidatorAccumulatedRewardsForEpoch(
        validatorPoolId: string,
        epoch: number,
    ): string {
        const total = epochData[epoch]?.validatorAccumulated[validatorPoolId] ?? 0n;
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    function getValidatorTotalPrincipal(validatorPoolId: string): string {
        const total = validatorPrincipal[validatorPoolId] ?? 0n;
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    function formatPrincipal(principal: string): string {
        if (!principal || principal === '0') return 'N/A';
        try {
            const value = BigInt(principal);
            return 'Initial amount: ' + (Number(value) / 1_000_000_000).toFixed(2) + ' IOTA';
        } catch {
            return 'N/A';
        }
    }

    function getFirstPrincipal(stakeObject: StakeObject): string {
        const epochs = Object.keys(stakeObject.principalByEpoch).map(Number);
        if (epochs.length === 0) return '';
        const minEpoch = Math.min(...epochs);
        return stakeObject.principalByEpoch[minEpoch];
    }

    function formatActionDetails(action: ActionDetails): string {
        let details = `Action: ${action.action}\nTransaction: ${action.digest}`;

        if (action.amount) {
            const iotaAmount = (Number(action.amount) / 1_000_000_000).toFixed(2);
            if (action.action === 'Partial Unstake') {
                details += `\nUnstaked Amount: ${iotaAmount} IOTA`;
            } else {
                details += `\nAmount: ${iotaAmount} IOTA`;
            }
        }

        if (action.totalRewards) {
            const iotaRewards = (Number(action.totalRewards) / 1_000_000_000).toFixed(2);
            if (action.action === 'Partial Unstake') {
                details += `\nUnstake Rewards: ${iotaRewards} IOTA`;
            } else {
                details += `\nTotal Rewards: ${iotaRewards} IOTA`;
            }
        }

        if (action.fromAddress && action.toAddress) {
            details += `\nFrom: ${action.fromAddress}\nTo: ${action.toAddress}`;
        }

        if (action.principalChange) {
            const fromAmount = (Number(action.principalChange.from) / 1_000_000_000).toFixed(2);
            const toAmount = (Number(action.principalChange.to) / 1_000_000_000).toFixed(2);
            details += `\nPrincipal changed from ${fromAmount} IOTA to ${toAmount} IOTA`;
        }

        if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
            details += `\nMerged stake objects:`;
            action.mergedStakeObjects.forEach((obj) => {
                const amount = (Number(obj.amount) / 1_000_000_000).toFixed(2);
                details += `\n  - ${obj.objectId}: ${amount} IOTA`;
            });
        }

        if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
            details += `\nSplit into stake objects:`;
            action.splitStakeObjects.forEach((obj) => {
                const amount = (Number(obj.amount) / 1_000_000_000).toFixed(2);
                details += `\n  - ${obj.objectId}: ${amount} IOTA`;
            });
        }

        return details;
    }

    // Elements for scroll synchronization
    let headerElement: HTMLElement;
    let listElement: any; // Reference to the List component
    let isScrolling = false;
    let virtualListContainer: HTMLElement | null = null;

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

    let selectedStakeObject: StakeObject | null = null;
    let selectedValidator: ValidatorInfo | null = null;
    let selectedAction: {
        action: ActionDetails;
        epoch: number;
        stakeObjectId: string;
    } | null = null;

    let epochEndDates: string[] = [];
    let epochTimestampsCache: Record<number, number> = {};
    let isMainnet = false;

    $: {
        // Determine if mainnet is selected
        try {
            isMainnet = getSelectedNetworkConfig().name?.toLowerCase().includes('mainnet');
        } catch {}
        if (isMainnet && Object.keys(epochTimestampsCacheJson).length > 0) {
            epochTimestampsCache = { ...epochTimestampsCacheJson };
        } else {
            epochTimestampsCache = {};
        }
    }

    function formatDate(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    $: {
        if (!epochs.length) {
            epochEndDates = [];
        } else {
            // Fetch timestamps for each epoch
            let promises: Promise<number | null>[] = [];
            let fetchedEpochTimestamps: Record<number, number> = {};
            for (let i = 0; i < epochs.length; i++) {
                const epochNum = epochs[i];
                // Use cache if mainnet and available
                if (isMainnet && epochTimestampsCache[epochNum]) {
                    promises.push(Promise.resolve(epochTimestampsCache[epochNum]));
                } else {
                    if (epochNum == currentEpoch) {
                        promises.push(fetchEpochStartTimestamp(epochNum));
                    } else {
                        promises.push(fetchEpochEndTimestamp(epochNum));
                    }
                }
            }
            Promise.all(promises).then((timestamps) => {
                epochEndDates = timestamps.map((ts, i) => {
                    if (!ts) return '';
                    // For current epoch, add 24 hours to start timestamp
                    if (epochs[i] === currentEpoch) {
                        return formatDate(new Date((ts + 24 * 60 * 60) * 1000));
                    }
                    return formatDate(new Date(ts * 1000));
                });
                // Build checkpoint object for cache
                for (let i = 0; i < epochs.length; i++) {
                    if (timestamps[i]) {
                        fetchedEpochTimestamps[epochs[i]] = timestamps[i] as number;
                    }
                }
                // Log for easy copy-paste into cache file
                console.log('Copy this to mainnet-epoch-timestamps-cache.json:');
                console.log(JSON.stringify(fetchedEpochTimestamps, null, 2));
            });
        }
    }

    // Price fetch state
    let selectedCurrency: 'usd' | 'eur' = 'usd';
    let previousCurrency: 'usd' | 'eur' = selectedCurrency;
    function reloadPricesFromCache() {
        let cache: Record<string, { usd: number; eur: number }> = { ...loadedCache };
        let newEpochPrices: Record<number, number> = {};
        for (let i = 0; i < epochs.length; i++) {
            const epoch = epochs[i];
            const dateStr = epochEndDates[i];
            if (!dateStr) continue;
            const formattedDate = formatDateForCoinGecko(dateStr);
            if (cache[formattedDate]) {
                const cached = cache[formattedDate];
                if (selectedCurrency === 'usd' && typeof cached.usd === 'number') {
                    newEpochPrices[epoch] = cached.usd;
                } else if (selectedCurrency === 'eur' && typeof cached.eur === 'number') {
                    newEpochPrices[epoch] = cached.eur;
                }
            }
        }
        epochPrices = newEpochPrices;
    }

    $: if (!isFetchingPrice && selectedCurrency !== previousCurrency) {
        previousCurrency = selectedCurrency;
        reloadPricesFromCache();
    }
    let isFetchingPrice = false;
    let priceError: string = '';
    let epochPrices: Record<number, number> = {};

    let loadedCache: Record<string, { usd: number; eur: number }> = pricesCache;

    // Export table data to CSV
    function exportTableToCSV() {
        // Build header row
        let headers = ['Epoch', 'End Date', 'Rewards', 'Accumulated'];
        if (showPriceColumns && Object.keys(epochPrices).length > 0) {
            headers.push(
                `Price (${selectedCurrency.toUpperCase()})`,
                `Rewards in ${selectedCurrency.toUpperCase()}`,
                `Accumulated in ${selectedCurrency.toUpperCase()}`,
            );
        }
        if (showValidatorColumns) {
            uniqueValidators.forEach((validator) => {
                headers.push(`Validator: ${validator.name}`);
            });
        }
        stakeObjects.forEach((stakeObject) => {
            headers.push(
                `Stake: ${stakeObject.objectId}`,
                `Action: ${stakeObject.objectId}`,
                `Action Details: ${stakeObject.objectId}`,
            );
        });

        let rows: string[][] = [];
        for (let i = 0; i < epochs.length; i++) {
            const epoch = epochs[i];
            const row: string[] = [];
            row.push(
                epoch.toString(),
                epochEndDates[i] || '-',
                epoch === currentEpoch
                    ? 'pending'
                    : getTotalRewardsForEpoch(epoch).replace(' IOTA', ''),
                epoch === currentEpoch
                    ? 'pending'
                    : getTotalAccumulatedRewardsForEpoch(epoch).replace(' IOTA', ''),
            );
            if (showPriceColumns && Object.keys(epochPrices).length > 0) {
                row.push(
                    epoch === currentEpoch
                        ? 'pending'
                        : epochPrices[epoch]
                          ? epochPrices[epoch].toString()
                          : 'no price',
                    epoch === currentEpoch
                        ? 'pending'
                        : epochPrices[epoch]
                          ? (
                                Number(getTotalRewardsForEpoch(epoch).replace(' IOTA', '')) *
                                epochPrices[epoch]
                            ).toFixed(4)
                          : 'no price',
                    epoch === currentEpoch
                        ? 'pending'
                        : epochPrices[epoch]
                          ? (
                                Number(
                                    getTotalAccumulatedRewardsForEpoch(epoch).replace(' IOTA', ''),
                                ) * epochPrices[epoch]
                            ).toFixed(4)
                          : 'no price',
                );
            }
            if (showValidatorColumns) {
                uniqueValidators.forEach((validator) => {
                    row.push(
                        epoch === currentEpoch
                            ? 'pending'
                            : getValidatorRewardsForEpoch(validator.poolId, epoch).replace(
                                  ' IOTA',
                                  '',
                              ),
                    );
                });
            }
            stakeObjects.forEach((stakeObject) => {
                if (epoch === currentEpoch) {
                    row.push('pending', '', '');
                } else if (isPreActivationInEpoch(stakeObject, epoch)) {
                    row.push('pre-active', '', '');
                } else if (isActiveInEpoch(stakeObject, epoch) && epoch >= stakeObject.firstEpoch) {
                    // Add reward amount
                    row.push(
                        stakeObject.rewardsByEpoch[epoch] === '0'
                            ? '-'
                            : (Number(stakeObject.rewardsByEpoch[epoch]) / 1_000_000_000).toFixed(
                                  4,
                              ),
                    );

                    // Add action information
                    const action = stakeObject.actionByEpoch?.[epoch];
                    if (action) {
                        row.push(action.action);

                        // Format action details for CSV
                        let actionDetails = `TX: ${action.digest}`;
                        if (action.amount) {
                            const amount = (Number(action.amount) / 1_000_000_000).toFixed(2);
                            actionDetails += ` | Amount: ${amount} IOTA`;
                        }
                        if (action.totalRewards) {
                            const rewards = (Number(action.totalRewards) / 1_000_000_000).toFixed(
                                2,
                            );
                            actionDetails += ` | Rewards: ${rewards} IOTA`;
                        }
                        if (action.fromAddress && action.toAddress) {
                            actionDetails += ` | From: ${action.fromAddress} To: ${action.toAddress}`;
                        }
                        if (action.principalChange) {
                            const from = (
                                Number(action.principalChange.from) / 1_000_000_000
                            ).toFixed(2);
                            const to = (Number(action.principalChange.to) / 1_000_000_000).toFixed(
                                2,
                            );
                            actionDetails += ` | Principal: ${from} → ${to} IOTA`;
                        }
                        if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
                            actionDetails += ` | Merged: ${action.mergedStakeObjects.length} objects`;
                        }
                        if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
                            actionDetails += ` | Split: ${action.splitStakeObjects.length} objects`;
                        }

                        row.push(actionDetails);
                    } else {
                        row.push('', '');
                    }
                } else {
                    row.push('-', '', '');
                }
            });
            rows.push(row);
        }

        // Convert to CSV string
        let csvContent = '';
        csvContent += headers.map((h) => '"' + h.replace(/"/g, '""') + '"').join(',') + '\n';
        rows.forEach((row) => {
            csvContent +=
                row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',') + '\n';
        });

        // Download as file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staking-rewards-table.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Helper to format date for CoinGecko API (DD-MM-YYYY)
    function formatDateForCoinGecko(dateStr: string): string {
        const [date] = dateStr.split(' ');
        const [yyyy, mm, dd] = date.split('-');
        return `${dd}-${mm}-${yyyy}`;
    }

    async function fetchAllPrices() {
        showPriceColumns = true;
        isFetchingPrice = true;
        priceError = '';
        epochPrices = {};
        let cache: Record<string, { usd: number; eur: number }> = { ...loadedCache };
        const now = new Date();
        for (let i = 0; i < epochs.length; i++) {
            const epoch = epochs[i];
            const dateStr = epochEndDates[i];
            if (!dateStr) continue;
            // Skip if the epoch end date is in the future (current epoch or later)
            const epochEndDate = new Date(dateStr);
            if (epochEndDate > now) continue;
            const formattedDate = formatDateForCoinGecko(dateStr);
            // Use cached price if available
            if (cache[formattedDate]) {
                const cached = cache[formattedDate];
                if (selectedCurrency === 'usd' && typeof cached.usd === 'number') {
                    epochPrices[epoch] = cached.usd;
                } else if (selectedCurrency === 'eur' && typeof cached.eur === 'number') {
                    epochPrices[epoch] = cached.eur;
                }
                continue;
            }
            // Otherwise, fetch from API with retry logic
            let success = false;
            let attempt = 0;
            while (!success && attempt < 5) {
                try {
                    const url = `https://api.coingecko.com/api/v3/coins/iota/history?date=${formattedDate}`;
                    const res = await fetch(url);
                    if (!res.ok) throw new Error('API error for epoch ' + epoch);
                    const data = await res.json();
                    const usd = data?.market_data?.current_price?.['usd'];
                    const eur = data?.market_data?.current_price?.['eur'];
                    if (typeof usd !== 'number' && typeof eur !== 'number')
                        throw new Error('No price data for epoch ' + epoch);
                    if (typeof usd === 'number') {
                        if (selectedCurrency === 'usd') epochPrices[epoch] = usd;
                    }
                    if (typeof eur === 'number') {
                        if (selectedCurrency === 'eur') epochPrices[epoch] = eur;
                    }
                    cache[formattedDate] = { usd, eur };
                    console.log('Copy this to iota-prices-coingecko.json:');
                    console.log(JSON.stringify(cache, null, 2));
                    success = true;
                } catch (e) {
                    attempt++;
                    priceError =
                        typeof e === 'object' && e && 'message' in e
                            ? (e as any).message
                            : 'Failed to fetch prices';
                    // Wait extra 10s before retrying
                    await new Promise((r) => setTimeout(r, attempt * 10000));
                }
            }
            // To avoid rate limits, add a small delay except for the last round
            if (i < epochs.length - 1) {
                await new Promise((r) => setTimeout(r, 5000));
            }
        }
        isFetchingPrice = false;
    }
</script>

{#if selectedStakeObject}
    <div class="address-hover-inline">
        <button
            class="close-hover"
            aria-label="Close address info"
            on:click={() => (selectedStakeObject = null)}>×</button
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
            on:click={() => (selectedValidator = null)}>×</button
        >
        <div class="validator-display-name">{selectedValidator.name}</div>
        <div class="validator-display-pool-id">
            Pool ID: {selectedValidator.poolId}
            <button
                class="copy-btn validator-copy-btn"
                title="Copy pool ID"
                on:click={(e) => {
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
                    ? getValidatorTotalPrincipal(selectedValidator.poolId)
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
            on:click={() => (selectedAction = null)}>×</button
        >
        <div class="action-title">
            Epoch {selectedAction.epoch} - {selectedAction.action.action}
        </div>
        <div class="action-stake-object">
            Stake Object: {selectedAction.stakeObjectId}
        </div>
        <div class="action-details">
            {formatActionDetails(selectedAction.action)}
        </div>
    </div>
{/if}

<div style="margin-bottom: 8px; text-align: left;">
    The data may be incomplete or incorrect, so it is advisable to check it against other sources.
    <br />
    Values are estimates due to rounding. Epochs before the first transaction are hidden.
</div>

<div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
    <div style="display: flex; flex: 1; align-items: center; gap: 12px;">
        <label>
            Currency:
            <select bind:value={selectedCurrency} on:change={reloadPricesFromCache}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
            </select>
        </label>
        <button on:click={fetchAllPrices} disabled={isFetchingPrice}>
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
        <button on:click={() => (showPriceColumns = !showPriceColumns)}>
            {showPriceColumns ? 'Hide' : 'Show'} Price Columns
        </button>
        <button on:click={() => (showValidatorColumns = !showValidatorColumns)}>
            {showValidatorColumns ? 'Hide' : 'Show'} Validator Columns
        </button>
    </div>
    <div style="margin-left: auto;">
        <button on:click={exportTableToCSV} style="min-width: 120px;"> Export table to CSV </button>
    </div>
</div>
<div class="table-container">
    <div class="virtual-table">
        <!-- Fixed header that scrolls horizontally -->
        <div class="table-header" bind:this={headerElement} on:scroll={syncHeaderScroll}>
            <div class="header-row">
                <div class="header-cell epoch-header">Epoch</div>
                <div class="header-cell end-date-header">End Date</div>
                <div class="header-cell rewards-header">Rewards</div>
                <div class="header-cell rewards-header">Accumulated</div>
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
                                    on:click={() => {
                                        selectedValidator =
                                            selectedValidator?.poolId === validator.poolId
                                                ? null
                                                : validator;
                                    }}
                                    on:keydown={(e) => {
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
                                    on:click={() => {
                                        selectedStakeObject = stakeObject;
                                    }}
                                    on:keydown={(e) => {
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
                                        on:click={(e) => {
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
                <List bind:this={listElement} itemCount={epochs.length} itemSize={50} height={800}>
                    <div slot="item" let:index let:style {style} class="table-row">
                        <div class="data-row">
                            <div class="table-cell epoch-cell">{epochs[index]}</div>
                            <div class="table-cell end-date-cell">
                                {epochEndDates[index] || '-'}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalRewardsForEpoch(epochs[index])}
                            </div>
                            <div class="table-cell rewards-cell">
                                {epochs[index] === currentEpoch
                                    ? 'pending'
                                    : getTotalAccumulatedRewardsForEpoch(epochs[index])}
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
                                                        )}
                                                    </div>
                                                    <div>
                                                        Accumulated rewards: {getValidatorAccumulatedRewardsForEpoch(
                                                            validator.poolId,
                                                            epochs[index],
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
                                        {#if isPreActivationInEpoch(stakeObject, epochs[index])}
                                            <div class="pre-active-indicator">pre-active</div>
                                        {:else if isActiveInEpoch(stakeObject, epochs[index]) && epochs[index] >= stakeObject.firstEpoch && epochs[index] !== currentEpoch && (!stakeObject.actionByEpoch || (stakeObject.actionByEpoch && stakeObject.actionByEpoch[epochs[index]]?.action !== 'Unstaked'))}
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
                                        {:else if isActiveInEpoch(stakeObject, epochs[index - 1]) && epochs[index] === currentEpoch && (!stakeObject.actionByEpoch || (stakeObject.actionByEpoch && !stakeObject.actionByEpoch[epochs[index]]))}
                                            pending
                                        {:else if !stakeObject.actionByEpoch || !stakeObject.actionByEpoch[epochs[index]]}
                                            <div class="inactive-indicator">-</div>
                                        {/if}
                                        {#if stakeObject.actionByEpoch && stakeObject.actionByEpoch[epochs[index]]}
                                            <button
                                                class="action-indicator clickable-action"
                                                type="button"
                                                on:click={() => {
                                                    const actionData =
                                                        stakeObject.actionByEpoch?.[epochs[index]];
                                                    if (actionData) {
                                                        selectedAction = {
                                                            action: actionData,
                                                            epoch: epochs[index],
                                                            stakeObjectId: stakeObject.objectId,
                                                        };
                                                    }
                                                }}
                                                >{stakeObject.actionByEpoch[epochs[index]].action}

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
        width: 130px;
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
</style>

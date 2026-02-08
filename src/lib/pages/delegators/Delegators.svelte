<script lang="ts">
    import { onDestroy } from 'svelte';

    import { getClient } from '../../utils/client';
    import {
        fetchDelegatorData,
        type DelegatorData,
        type DelegatorStats,
        type StakedObject,
    } from './delegators-service';
    import DelegatorsCharts from './DelegatorsCharts.svelte';

    let isLoading = $state(false);
    let isPaused = $state(false);
    let delegatorData = $state<DelegatorData | null>(null);
    let stats = $state<DelegatorStats | null>(null);
    let progressMessage = $state('');
    let normalProgress = $state('');
    let timelockedProgress = $state('');
    let syncPercentage = $state(0);
    let abortController = $state<AbortController | null>(null);
    let resumeType = $state<string | null>(null);
    let resumeCursor = $state<string | null>(null);
    let resumeTimelockedCursor = $state<string | null>(null);
    let resumeStakedObjects = $state<StakedObject[]>([]);
    let showRawData = $state(false);
    let chartVersion = $state(0);
    let sortColumn = $state<string>('totalStakedAmount');
    let sortDirection = $state<'asc' | 'desc'>('desc');
    let expandedValidatorPoolId = $state<string | null>(null);
    let objectSortColumn = $state<string>('amount');
    let objectSortDirection = $state<'asc' | 'desc'>('desc');
    let objectRowsLimit = $state<number>(200);
    let richlistRowsLimit = $state<number>(200);
    let startTime = $state<number | null>(null);
    let elapsedTime = $state<number>(0);
    let timerInterval = $state<NodeJS.Timeout | null>(null);

    type SortableColumn = 'name' | 'stakedObjectCount' | 'timelockedObjectCount' | 'uniqueAddresses' | 'totalStakedAmount' | 'averageStakedAmount' | 'averageStakeDuration' | 'stakePercentage' | 'systemStakePercentage';
    
    type ObjectRow = {
        id?: string;
        ownerAddress: string;
        amount: bigint;
        activationEpoch: number;
        isTimelocked?: boolean;
        objectCount?: number;
        objectIds?: string[];
    };

    function sortValidators(column: SortableColumn) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }

        if (stats) {
            stats.validators.sort((a, b) => {
                let aVal = a[column];
                let bVal = b[column];
                
                if (typeof aVal === 'string') {
                    return sortDirection === 'asc' 
                        ? aVal.localeCompare(bVal as string)
                        : (bVal as string).localeCompare(aVal);
                } else {
                    return sortDirection === 'asc' 
                        ? (aVal as number) - (bVal as number)
                        : (bVal as number) - (aVal as number);
                }
            });
            stats = { ...stats, validators: [...stats.validators] };
        }
    }

    function getSortIcon(column: string): string {
        if (sortColumn !== column) return '';
        return sortDirection === 'asc' ? '↑' : '↓';
    }

    function toggleValidatorDetails(poolId: string) {
        if (expandedValidatorPoolId === poolId) {
            expandedValidatorPoolId = null;
        } else {
            expandedValidatorPoolId = poolId;
            objectRowsLimit = 200;
        }
    }

    function getValidatorStakedObjects(poolId: string): StakedObject[] {
        if (!delegatorData) return [];
        return delegatorData.stakedObjects.filter(obj => obj.poolId === poolId);
    }

    function sortObjectTable(column: string) {
        if (objectSortColumn === column) {
            objectSortDirection = objectSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            objectSortColumn = column;
            objectSortDirection = 'desc';
        }
        objectRowsLimit = 200;
    }

    function getObjectSortIcon(column: string): string {
        if (objectSortColumn !== column) return '';
        return objectSortDirection === 'asc' ? '↑' : '↓';
    }

    function formatElapsedTime(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        } else if (mins > 0) {
            return `${mins}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    function startTimer() {
        startTime = Date.now();
        elapsedTime = 0;
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(() => {
            if (startTime) {
                elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function getSortedObjectRows(poolId: string): ObjectRow[] {
        const objects = getValidatorStakedObjects(poolId);
        
        if (objectSortColumn === 'owner') {
            // Group by owner address
            const groupedMap = new Map<string, ObjectRow>();
            
            for (const obj of objects) {
                const existing = groupedMap.get(obj.ownerAddress);
                if (existing) {
                    existing.amount += obj.principal;
                    existing.objectCount!++;
                    existing.objectIds!.push(obj.id);
                } else {
                    groupedMap.set(obj.ownerAddress, {
                        ownerAddress: obj.ownerAddress,
                        amount: obj.principal,
                        activationEpoch: obj.stakeActivationEpoch,
                        objectCount: 1,
                        objectIds: [obj.id],
                    });
                }
            }
            
            const grouped = Array.from(groupedMap.values());
            grouped.sort((a, b) => {
                const cmp = Number(b.amount - a.amount);
                return objectSortDirection === 'asc' ? -cmp : cmp;
            });
            
            return grouped;
        } else {
            // Individual objects
            const rows: ObjectRow[] = objects.map(obj => ({
                id: obj.id,
                ownerAddress: obj.ownerAddress,
                amount: obj.principal,
                activationEpoch: obj.stakeActivationEpoch,
                isTimelocked: obj.isTimelocked,
            }));
            
            rows.sort((a, b) => {
                let aVal: any;
                let bVal: any;
                
                if (objectSortColumn === 'amount') {
                    aVal = Number(a.amount);
                    bVal = Number(b.amount);
                } else if (objectSortColumn === 'epoch') {
                    aVal = a.activationEpoch;
                    bVal = b.activationEpoch;
                } else {
                    return 0;
                }
                
                return objectSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            });
            
            return rows;
        }
    }

    type RichlistRow = {
        ownerAddress: string;
        totalStakedAmount: bigint;
        objectCount: number;
    };

    function getRichlistRows(): RichlistRow[] {
        if (!delegatorData) return [];

        const byOwner = new Map<string, RichlistRow>();

        for (const obj of delegatorData.stakedObjects) {
            const existing = byOwner.get(obj.ownerAddress);
            if (existing) {
                existing.totalStakedAmount += obj.principal;
                existing.objectCount += 1;
            } else {
                byOwner.set(obj.ownerAddress, {
                    ownerAddress: obj.ownerAddress,
                    totalStakedAmount: obj.principal,
                    objectCount: 1,
                });
            }
        }

        const rows = Array.from(byOwner.values());
        rows.sort((a, b) => {
            if (a.totalStakedAmount === b.totalStakedAmount) {
                return b.objectCount - a.objectCount;
            }
            return a.totalStakedAmount > b.totalStakedAmount ? -1 : 1;
        });

        return rows;
    }

    async function fetchData() {
        try {
            isLoading = true;
            isPaused = false;
            if (!resumeType) {
                delegatorData = null;
                stats = null;
                syncPercentage = 0;
                startTimer();
            } else {
                // Resume timer from paused state
                if (startTime) {
                    const pausedElapsed = elapsedTime;
                    startTime = Date.now() - (pausedElapsed * 1000);
                    if (timerInterval) clearInterval(timerInterval);
                    timerInterval = setInterval(() => {
                        if (startTime) {
                            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                        }
                    }, 1000);
                }
            }
            progressMessage = resumeType ? 'Resuming data fetch...' : 'Starting to fetch delegator data...';

            abortController = new AbortController();

            const client = getClient(true);
            const result = await fetchDelegatorData(
                client,
                (progress, currentData, currentStats) => {
                    // Parse progress message to update appropriate status
                    if (progress.startsWith('[Normal]')) {
                        normalProgress = progress.replace('[Normal] ', '');
                    } else if (progress.startsWith('[Timelocked]')) {
                        timelockedProgress = progress.replace('[Timelocked] ', '');
                    } else {
                        progressMessage = progress;
                        normalProgress = '';
                        timelockedProgress = '';
                    }
                    // Update reactivity with current progress
                    if (currentData && currentStats) {
                        delegatorData = currentData;
                        stats = {
                            validators: [...currentStats.validators],
                            global: currentStats.global
                        };
                        chartVersion++;
                        
                        // Calculate and display sync percentage based on total stake from system state
                        const totalStakeFromSystem = Number(currentData.totalStake);
                        const syncedStake = currentStats.global.totalStakedAmount;
                        const calculatedSyncPercentage = totalStakeFromSystem > 0 ? (syncedStake / totalStakeFromSystem) * 100 : 0;
                        syncPercentage = calculatedSyncPercentage;
                        
                        // Calculate estimated remaining time
                        let estimatedTimeMessage = '';
                        if (elapsedTime > 0 && syncPercentage > 0 && syncPercentage < 100) {
                            const remainingPercentage = 100 - syncPercentage;
                            const estimatedRemainingSeconds = Math.round((elapsedTime * remainingPercentage) / syncPercentage);
                            estimatedTimeMessage = ` • ETA: ${formatElapsedTime(estimatedRemainingSeconds)}`;
                        }
                        
                        // Add percentage to main progress message
                        progressMessage = `Syncing data... ${syncPercentage.toFixed(2)}% complete${estimatedTimeMessage}`;
                    }
                },
                () => isPaused,
                abortController.signal,
                resumeType,
                resumeCursor,
                resumeTimelockedCursor,
                resumeStakedObjects,
            );

            if (result.resumeType) {
                // paused
                stopTimer();
                resumeType = result.resumeType;
                resumeCursor = result.resumeCursor || null;
                resumeTimelockedCursor = result.resumeTimelockedCursor || null;
                resumeStakedObjects = result.resumeStakedObjects || [];
                progressMessage = `Data fetch was paused after ${formatElapsedTime(elapsedTime)} (${syncPercentage.toFixed(2)}% synced).`;
                normalProgress = '';
                timelockedProgress = '';
            } else {
                // completed
                stopTimer();
                delegatorData = result.data;
                stats = {
                    validators: [...result.stats.validators],
                    global: result.stats.global
                };
                progressMessage = `Data fetch completed in ${formatElapsedTime(elapsedTime)}!`;
                normalProgress = '';
                timelockedProgress = '';
                syncPercentage = 100;
                resumeType = null;
                resumeCursor = null;
                resumeTimelockedCursor = null;
                resumeStakedObjects = [];
            }
        } catch (err: any) {
            stopTimer();
            if (err.name === 'AbortError') {
                progressMessage = `Data fetch was paused after ${formatElapsedTime(elapsedTime)} (${syncPercentage.toFixed(2)}% synced).`;
            } else {
                progressMessage = `Error after ${formatElapsedTime(elapsedTime)}: ${err.toString()}`;
                console.error(err);
            }
            normalProgress = '';
            timelockedProgress = '';
        } finally {
            isLoading = false;
        }
    }

    function startFreshFetch() {
        resumeType = null;
        resumeCursor = null;
        resumeTimelockedCursor = null;
        resumeStakedObjects = [];
        startTime = null;
        elapsedTime = 0;
        fetchData();
    }

    function pauseFetching() {
        isPaused = true;
        if (abortController) {
            abortController.abort();
        }
        stopTimer();
        progressMessage = `Fetching paused by user after ${formatElapsedTime(elapsedTime)} (${syncPercentage.toFixed(2)}% synced).`;
    }

    onDestroy(() => {
        if (abortController) {
            abortController.abort();
        }
        stopTimer();
    });
</script>

<main>
    <h1>Delegators Overview</h1>

    {#if delegatorData && stats}
        {@const wrappedStake = Math.max(0, Number(delegatorData.totalStake) - stats.global.totalStakedAmount)}
        <div class="info-banner">
            <div class="info-text">
                This page aggregates only `StakedIota` and `TimelockedStakedIota` objects.
                Additional stake can be wrapped in other object types and is reflected in the
                system-state totals.
            </div>
            <div class="info-metrics">
                <div>
                    System total stake: {(Number(delegatorData.totalStake) / 1_000_000_000).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )} IOTA
                </div>
                <div>
                    Wrapped stake (other objects): {(wrappedStake / 1_000_000_000).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )} IOTA
                </div>
            </div>
        </div>
    {:else}
        <div class="info-banner">
            <div class="info-text">
                This page aggregates only `StakedIota` and `TimelockedStakedIota` objects.
                Additional stake can be wrapped in other object types and is reflected in the
                system-state totals.
            </div>
        </div>
    {/if}

    <div class="controls">
        {#if resumeType && !isLoading}
            <button onclick={startFreshFetch}>Fetch/Refresh Data</button>
            <button onclick={fetchData}>Continue Fetching</button>
        {:else if !isLoading}
            <button onclick={fetchData} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Fetch/Refresh Data'}
            </button>
        {/if}
        {#if isLoading}
            <button onclick={pauseFetching}>Pause Fetching</button>
        {/if}
    </div>

    {#if progressMessage || normalProgress || timelockedProgress}
        <div class="progress-message">
            {#if progressMessage}
                <div>{progressMessage}</div>
                {#if isLoading && syncPercentage > 0}
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {syncPercentage}%"></div>
                        </div>
                        <span class="progress-percentage">{syncPercentage.toFixed(1)}%</span>
                    </div>
                {/if}
            {/if}
            {#if isLoading && elapsedTime > 0}
                <div class="timer">Elapsed time: {formatElapsedTime(elapsedTime)}</div>
            {/if}
            {#if normalProgress}
                <div>Normal Staked: {normalProgress}</div>
            {/if}
            {#if timelockedProgress}
                <div>Timelocked Staked: {timelockedProgress}</div>
            {/if}
        </div>
    {/if}

    {#if stats}
        <div class="stats-container">
            <h2>Global Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Staked Objects</div>
                    <div class="stat-value">{stats.global.totalStakedObjects.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Timelocked Objects</div>
                    <div class="stat-value">
                        {stats.global.totalTimelockedObjects.toLocaleString()}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Unique Addresses</div>
                    <div class="stat-value">
                        {stats.global.totalUniqueAddresses.toLocaleString()}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Staked Amount (IOTA)</div>
                    <div class="stat-value">
                        {(stats.global.totalStakedAmount / 1_000_000_000).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2, maximumFractionDigits: 2,
                            },
                        )}
                    </div>
                </div>
                {#if delegatorData}
                    <div class="stat-card">
                        <div class="stat-label">Total Stake (System State)</div>
                        <div class="stat-value">
                            {(Number(delegatorData.totalStake) / 1_000_000_000).toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                            )}
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Wrapped Stake (Other Objects)</div>
                        <div class="stat-value">
                            {(
                                Math.max(
                                    0,
                                    Number(delegatorData.totalStake) - stats.global.totalStakedAmount,
                                ) / 1_000_000_000
                            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                {/if}
                <div class="stat-card">
                    <div class="stat-label">Average Staked Amount (IOTA)</div>
                    <div class="stat-value">
                        {(stats.global.averageStakedAmount / 1_000_000_000).toLocaleString(
                            undefined,
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                        )}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Stake Duration (epochs)</div>
                    <div class="stat-value">
                        {stats.global.averageStakeDuration.toLocaleString(undefined, {
                            minimumFractionDigits: 2, maximumFractionDigits: 2,
                        })}
                    </div>
                </div>
                {#if stats.global.totalSupply}
                    <div class="stat-card">
                        <div class="stat-label">Total Stake Percentage</div>
                        <div class="stat-value">
                            {stats.global.totalStakePercentage.toFixed(2)}%
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        {#if stats && !isLoading}

        <h2>Validator Statistics</h2>
            <p>Showing {stats.validators.length} validators</p>
            <div class="validators-table-container">
            <table class="validators-table">
                <thead>
                    <tr>
                        <th class="rank-header">Rank</th>
                        <th class="sortable" onclick={() => sortValidators('name')}>
                            Validator Name {getSortIcon('name')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('stakedObjectCount')}>
                            Staked Objects {getSortIcon('stakedObjectCount')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('timelockedObjectCount')}>
                            Timelocked Objects {getSortIcon('timelockedObjectCount')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('uniqueAddresses')}>
                            Unique Addresses {getSortIcon('uniqueAddresses')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('totalStakedAmount')}>
                            Total Staked (IOTA) {getSortIcon('totalStakedAmount')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('averageStakedAmount')}>
                            Avg Amount (IOTA) {getSortIcon('averageStakedAmount')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('averageStakeDuration')}>
                            Avg Duration (epochs) {getSortIcon('averageStakeDuration')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('stakePercentage')}>
                            Stake % (Objects) {getSortIcon('stakePercentage')}
                        </th>
                        <th class="sortable" onclick={() => sortValidators('systemStakePercentage')}>
                            Stake % (System) {getSortIcon('systemStakePercentage')}
                        </th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {#each stats.validators as validator, index (validator.address)}
                        <tr>
                            <td class="rank-cell">{index + 1}</td>
                            <td class="name-cell">
                                <button
                                    class="details-btn"
                                    onclick={() => toggleValidatorDetails(validator.poolId)}
                                    title="View staked objects"
                                >
                                    {expandedValidatorPoolId === validator.poolId ? '▼' : '▶'}
                                </button>
                                <span class="validator-name">{validator.name}</span>
                            </td>
                            <td class="numeric-cell">{validator.stakedObjectCount.toLocaleString()}</td>
                            <td class="numeric-cell">{validator.timelockedObjectCount.toLocaleString()}</td>
                            <td class="numeric-cell">{validator.uniqueAddresses.toLocaleString()}</td>
                            <td class="numeric-cell"
                                >{(validator.totalStakedAmount / 1_000_000_000).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                                )}</td
                            >
                            <td class="numeric-cell"
                                >{(validator.averageStakedAmount / 1_000_000_000).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                                )}</td
                            >
                            <td class="numeric-cell"
                                >{validator.averageStakeDuration.toLocaleString(undefined, {
                                    minimumFractionDigits: 2, maximumFractionDigits: 2,
                                })}</td
                            >
                            <td class="numeric-cell">{validator.stakePercentage.toFixed(2)}%</td>
                            <td class="numeric-cell">{validator.systemStakePercentage.toFixed(2)}%</td>
                            <td class="address-cell">
                                <span class="address-text">{validator.address.slice(0, 10)}...{validator.address.slice(-8)}</span>
                                <button
                                    class="copy-btn"
                                    onclick={() => navigator.clipboard.writeText(validator.address)}
                                    title="Copy address"
                                >
                                    📋
                                </button>
                            </td>
                        </tr>
                        {#if expandedValidatorPoolId === validator.poolId}
                            {@const objectRows = getSortedObjectRows(validator.poolId)}
                            <tr class="details-row">
                                <td colspan="10">
                                    <div class="details-container">
                                        <h3>Staked Objects for {validator.name}</h3>
                                        <div class="objects-table-container">
                                            <table class="objects-table">
                                                <thead>
                                                    <tr>
                                                        {#if objectSortColumn !== 'owner'}
                                                            <th>Object ID</th>
                                                            <th>Type</th>
                                                        {:else}
                                                            <th>Count</th>
                                                        {/if}
                                                        <th class="sortable" onclick={() => sortObjectTable('amount')}>
                                                            Amount (IOTA) {getObjectSortIcon('amount')}
                                                        </th>
                                                        <th class="sortable" onclick={() => sortObjectTable('epoch')}>
                                                            Activation Epoch {getObjectSortIcon('epoch')}
                                                        </th>
                                                        <th class="sortable" onclick={() => sortObjectTable('owner')}>
                                                            Owner Address {getObjectSortIcon('owner')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each objectRows.slice(0, objectRowsLimit) as row}
                                                        <tr>
                                                            {#if row.id}
                                                                <td class="object-id-cell">
                                                                    <span class="object-id-text">{row.id.slice(0, 10)}...{row.id.slice(-8)}</span>
                                                                    <button
                                                                        class="copy-btn"
                                                                        onclick={() => navigator.clipboard.writeText(row.id!)}
                                                                        title="Copy object ID"
                                                                    >
                                                                        📋
                                                                    </button>
                                                                </td>
                                                                <td class="type-cell">
                                                                    <span class="type-badge" class:timelocked={row.isTimelocked}>
                                                                        {row.isTimelocked ? 'Timelocked' : 'Normal'}
                                                                    </span>
                                                                </td>
                                                            {:else}
                                                                <td class="count-cell">
                                                                    {row.objectCount} object{row.objectCount !== 1 ? 's' : ''}
                                                                </td>
                                                            {/if}
                                                            <td class="numeric-cell">{(Number(row.amount) / 1_000_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            <td class="numeric-cell">
                                                                {#if row.id}
                                                                    {row.activationEpoch.toLocaleString()}
                                                                {:else}
                                                                    <span class="muted">Multiple</span>
                                                                {/if}
                                                            </td>
                                                            <td class="owner-address-cell">
                                                                <span class="owner-address-text">{row.ownerAddress.slice(0, 10)}...{row.ownerAddress.slice(-8)}</span>
                                                                <button
                                                                    class="copy-btn"
                                                                    onclick={() => navigator.clipboard.writeText(row.ownerAddress)}
                                                                    title="Copy owner address"
                                                                >
                                                                    📋
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                        {#if objectRows.length > objectRowsLimit}
                                            <div class="objects-footer">
                                                <div class="objects-count">
                                                    Showing {objectRowsLimit.toLocaleString()} of {objectRows.length.toLocaleString()} objects
                                                </div>
                                                <button
                                                    class="load-more-btn"
                                                    onclick={() => (objectRowsLimit += 200)}
                                                >
                                                    Load 200 more
                                                </button>
                                            </div>
                                        {:else if objectRows.length > 0}
                                            <div class="objects-footer">
                                                <div class="objects-count">
                                                    Showing {objectRows.length.toLocaleString()} objects
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
        {/if}

        {#if delegatorData && !isLoading}
            <h2>Delegator Richlist</h2>
            {@const richlistRows = getRichlistRows()}
            <div class="richlist-table-container">
                <table class="richlist-table">
                    <thead>
                        <tr>
                            <th class="rank-header">Rank</th>
                            <th>Owner Address</th>
                            <th>Total Staked (IOTA)</th>
                            <th>Staked Objects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each richlistRows.slice(0, richlistRowsLimit) as row, index (row.ownerAddress)}
                            <tr>
                                <td class="rank-cell">{index + 1}</td>
                                <td class="richlist-address-cell">
                                    <span class="richlist-address-text">{row.ownerAddress}</span>
                                    <button
                                        class="copy-btn"
                                        onclick={() => navigator.clipboard.writeText(row.ownerAddress)}
                                        title="Copy address"
                                    >
                                        📋
                                    </button>
                                </td>
                                <td class="numeric-cell">
                                    {(Number(row.totalStakedAmount) / 1_000_000_000).toLocaleString(
                                        undefined,
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                                    )}
                                </td>
                                <td class="numeric-cell">{row.objectCount.toLocaleString()}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {#if richlistRows.length > richlistRowsLimit}
                <div class="objects-footer">
                    <div class="objects-count">
                        Showing {richlistRowsLimit.toLocaleString()} of {richlistRows.length.toLocaleString()} addresses
                    </div>
                    <button
                        class="load-more-btn"
                        onclick={() => (richlistRowsLimit += 200)}
                    >
                        Load 200 more
                    </button>
                </div>
            {:else if richlistRows.length > 0}
                <div class="objects-footer">
                    <div class="objects-count">
                        Showing {richlistRows.length.toLocaleString()} addresses
                    </div>
                </div>
            {/if}
        {/if}

        {#if delegatorData && !isLoading}
            {#key chartVersion}
                <DelegatorsCharts data={delegatorData} {stats} />
            {/key}
        {/if}
    {/if}

</main>

<style>
    main {
        padding: 1rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    h1 {
        margin-bottom: 1.5rem;
    }

    h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .info-banner {
        padding: 1rem;
        border-radius: 8px;
        background: rgba(59, 130, 246, 0.08);
        border: 1px solid rgba(59, 130, 246, 0.2);
        color: #d4d4d4;
        margin-bottom: 1rem;
    }

    .info-text {
        margin-bottom: 0.5rem;
    }

    .info-metrics {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
        font-size: 0.9rem;
        color: #bdbdbd;
    }

    button {
        padding: 0.75rem 1.5rem;
        background: #059669;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background 0.2s;
    }

    button:hover:not(:disabled) {
        background: #047857;
    }

    button:disabled {
        background: #6b7280;
        cursor: not-allowed;
    }

    .progress-message {
        padding: 1rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        margin-bottom: 1rem;
        color: #ddd;
    }

    .progress-message > div {
        margin-bottom: 0.25rem;
    }

    .progress-message > div:last-child {
        margin-bottom: 0;
    }

    .progress-bar-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #059669, #10b981);
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .progress-percentage {
        font-size: 0.9rem;
        font-weight: 500;
        color: #10b981;
        min-width: 3rem;
        text-align: right;
    }

    .stats-container {
        margin-bottom: 2rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .stat-card {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
    }

    .stat-label {
        font-size: 0.85rem;
        color: #999;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;
    }

    .validators-table-container {
        overflow-x: auto;
        overflow-y: auto;
        max-height: 600px;
        margin-bottom: 2rem;
    }

    .validators-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }

    .validators-table th,
    .validators-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .validators-table td.numeric-cell {
        text-align: right;
        font-family: monospace;
    }

    .validators-table th {
        background: rgba(0, 0, 0, 0.3);
        font-weight: 600;
        color: #fff;
    }

    .validators-table th.sortable {
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
    }

    .validators-table th.sortable:hover {
        background: rgba(0, 0, 0, 0.5);
    }

    .rank-header,
    .rank-cell {
        text-align: center;
        width: 60px;
        font-weight: 600;
    }

    .rank-header {
        background: rgba(0, 0, 0, 0.4);
    }

    .rank-cell {
        color: #999;
    }

    .validators-table tbody tr:hover {
        background: rgba(59, 130, 246, 0.1);
    }

    .address-cell {
        font-family: monospace;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }

    .address-text {
        flex: 1;
    }

    .copy-btn {
        padding: 0.25rem 0.5rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        font-size: 0.9rem;
        min-width: unset;
        flex-shrink: 0;
    }

    .copy-btn:hover {
        background: rgba(59, 130, 246, 0.3);
    }

    .name-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .validator-name {
        flex: 1;
    }

    .details-btn {
        padding: 0.3rem 0.5rem;
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.3);
        font-size: 0.9rem;
        min-width: unset;
        flex-shrink: 0;
    }

    .details-btn:hover {
        background: rgba(16, 185, 129, 0.3);
    }

    .details-row {
        background: rgba(0, 0, 0, 0.4) !important;
    }

    .details-row td {
        padding: 0 !important;
    }

    .details-container {
        padding: 1.5rem;
    }

    .details-container h3 {
        margin: 0 0 1rem 0;
        color: #fff;
        font-size: 1.1rem;
    }

    .objects-table-container {
        overflow-x: auto;
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid var(--border-color);
        border-radius: 6px;
    }

    .objects-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.75rem;
    }

    .objects-count {
        color: #999;
        font-size: 0.9rem;
    }

    .load-more-btn {
        padding: 0.4rem 0.75rem;
        font-size: 0.9rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .load-more-btn:hover {
        background: rgba(59, 130, 246, 0.3);
    }

    .objects-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(0, 0, 0, 0.3);
    }

    .richlist-table-container {
        overflow-x: auto;
        max-height: 600px;
        overflow-y: auto;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        margin-bottom: 2rem;
        background: rgba(0, 0, 0, 0.2);
    }

    .richlist-table {
        width: 100%;
        border-collapse: collapse;
    }

    .richlist-table th,
    .richlist-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .richlist-table td.numeric-cell {
        text-align: right;
        font-family: monospace;
    }

    .richlist-table th {
        background: rgba(0, 0, 0, 0.3);
        font-weight: 600;
        color: #fff;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .richlist-table tbody tr:hover {
        background: rgba(59, 130, 246, 0.1);
    }

    .richlist-address-cell {
        font-family: monospace;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: normal;
        word-break: break-all;
    }

    .richlist-address-text {
        flex: 1;
    }

    .objects-table th,
    .objects-table td {
        padding: 0.6rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
        font-size: 0.9rem;
    }

    .objects-table td.numeric-cell {
        text-align: right;
        font-family: monospace;
    }

    .objects-table th {
        background: rgba(0, 0, 0, 0.4);
        font-weight: 600;
        color: #ddd;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .objects-table th.sortable {
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
    }

    .objects-table th.sortable:hover {
        background: rgba(0, 0, 0, 0.6);
    }

    .objects-table tbody tr:hover {
        background: rgba(59, 130, 246, 0.1);
    }

    .object-id-cell,
    .owner-address-cell {
        font-family: monospace;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }

    .object-id-text,
    .owner-address-text {
        flex: 1;
    }

    .type-cell {
        text-align: center;
    }

    .type-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #60a5fa;
    }

    .type-badge.timelocked {
        background: rgba(245, 158, 11, 0.2);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #fbbf24;
    }

    .count-cell {
        text-align: center;
        color: #999;
        font-style: italic;
    }

    .muted {
        color: #999;
        font-style: italic;
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

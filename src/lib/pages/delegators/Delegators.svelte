<script lang="ts">
    import { onDestroy } from 'svelte';

    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import { getClient } from '../../utils/client';
    import {
        fetchDelegatorData,
        type DelegatorData,
        type DelegatorStats,
    } from './delegators-service';
    import DelegatorsCharts from './DelegatorsCharts.svelte';

    let isLoading = false;
    let isPaused = false;
    let delegatorData: DelegatorData | null = null;
    let stats: DelegatorStats | null = null;
    let progressMessage = '';
    let abortController: AbortController | null = null;

    async function fetchData() {
        try {
            isLoading = true;
            isPaused = false;
            delegatorData = null;
            stats = null;
            progressMessage = 'Starting to fetch delegator data...';

            abortController = new AbortController();

            const client = getClient(true);
            const result = await fetchDelegatorData(
                client,
                (progress, currentData, currentStats) => {
                    progressMessage = progress;
                    // Update reactivity with current progress
                    if (currentData && currentStats) {
                        delegatorData = currentData;
                        stats = currentStats;
                    }
                },
                () => isPaused,
                abortController.signal,
            );

            delegatorData = result.data;
            stats = result.stats;
            progressMessage = 'Data fetch completed!';
        } catch (err: any) {
            if (err.name === 'AbortError') {
                progressMessage = 'Data fetch was paused.';
            } else {
                progressMessage = `Error: ${err.toString()}`;
                console.error(err);
            }
        } finally {
            isLoading = false;
        }
    }

    function pauseFetching() {
        isPaused = true;
        if (abortController) {
            abortController.abort();
        }
        progressMessage = 'Fetching paused by user.';
    }

    onDestroy(() => {
        if (abortController) {
            abortController.abort();
        }
    });
</script>

<main>
    <h1>Delegators Overview</h1>

    <div class="controls">
        <button on:click={fetchData} disabled={isLoading}>
            {isLoading ? 'Fetching...' : 'Fetch/Refresh Data'}
        </button>
        {#if isLoading}
            <button on:click={pauseFetching}>Pause Fetching</button>
        {/if}
    </div>

    {#if progressMessage}
        <div class="progress-message">
            {progressMessage}
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
                                maximumFractionDigits: 2,
                            },
                        )}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Staked Amount (IOTA)</div>
                    <div class="stat-value">
                        {(stats.global.averageStakedAmount / 1_000_000_000).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                        )}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Stake Duration (epochs)</div>
                    <div class="stat-value">
                        {stats.global.averageStakeDuration.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
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

        <h2>Validator Statistics</h2>
        <div class="validators-table-container">
            <table class="validators-table">
                <thead>
                    <tr>
                        <th>Validator Name</th>
                        <th>Address</th>
                        <th>Staked Objects</th>
                        <th>Timelocked Objects</th>
                        <th>Unique Addresses</th>
                        <th>Total Staked (IOTA)</th>
                        <th>Avg Amount (IOTA)</th>
                        <th>Avg Duration (epochs)</th>
                        <th>Stake %</th>
                    </tr>
                </thead>
                <tbody>
                    {#each stats.validators as validator}
                        <tr>
                            <td>{validator.name}</td>
                            <td class="address-cell" title={validator.address}
                                >{validator.address.slice(0, 10)}...{validator.address.slice(
                                    -8,
                                )}</td
                            >
                            <td>{validator.stakedObjectCount.toLocaleString()}</td>
                            <td>{validator.timelockedObjectCount.toLocaleString()}</td>
                            <td>{validator.uniqueAddresses.toLocaleString()}</td>
                            <td
                                >{(validator.totalStakedAmount / 1_000_000_000).toLocaleString(
                                    undefined,
                                    { maximumFractionDigits: 2 },
                                )}</td
                            >
                            <td
                                >{(validator.averageStakedAmount / 1_000_000_000).toLocaleString(
                                    undefined,
                                    { maximumFractionDigits: 2 },
                                )}</td
                            >
                            <td
                                >{validator.averageStakeDuration.toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                })}</td
                            >
                            <td>{validator.stakePercentage.toFixed(2)}%</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        {#if delegatorData}
            <DelegatorsCharts data={delegatorData} {stats} />
        {/if}
    {/if}

    {#if delegatorData}
        <h2>Raw Data</h2>
        <JsonToggleView value={delegatorData} />
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

    .validators-table th {
        background: rgba(0, 0, 0, 0.3);
        font-weight: 600;
        color: #fff;
    }

    .validators-table tbody tr:hover {
        background: rgba(59, 130, 246, 0.1);
    }

    .address-cell {
        font-family: monospace;
        font-size: 0.85rem;
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

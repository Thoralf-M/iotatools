<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onDestroy, onMount } from 'svelte';

    import type { DelegatorData, DelegatorStats } from './delegators-service';

    export let data: DelegatorData;
    export let stats: DelegatorStats;

    let stakeActivationCanvas: HTMLCanvasElement;
    let stakedAmountsCanvas: HTMLCanvasElement;
    let addressDistributionCanvas: HTMLCanvasElement;
    let stakeCompositionCanvas: HTMLCanvasElement;

    let charts: Chart[] = [];

    let minEpochFilter = '';
    let maxEpochFilter = '';

    function createStakeActivationChart() {
        if (!stakeActivationCanvas) return;

        // Group by stake activation epoch
        const epochCounts = new Map<number, number>();
        data.stakedObjects.forEach((obj) => {
            const count = epochCounts.get(obj.stakeActivationEpoch) || 0;
            epochCounts.set(obj.stakeActivationEpoch, count + 1);
        });

        // Sort by epoch
        const sortedEpochs = Array.from(epochCounts.keys()).sort((a, b) => a - b);
        const counts = sortedEpochs.map((epoch) => epochCounts.get(epoch) || 0);

        // Filter by epoch range
        const minEpoch = minEpochFilter ? parseInt(minEpochFilter) : Math.min(...sortedEpochs);
        const maxEpoch = maxEpochFilter ? parseInt(maxEpochFilter) : Math.max(...sortedEpochs);
        const filteredEpochs = sortedEpochs.filter(e => e >= minEpoch && e <= maxEpoch);
        const filteredCounts = filteredEpochs.map(e => epochCounts.get(e) || 0);

        const chart = new Chart(stakeActivationCanvas, {
            type: 'line',
            data: {
                labels: filteredEpochs,
                datasets: [
                    {
                        label: 'Number of Objects',
                        data: filteredCounts,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stake Activation Epoch Distribution',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Epoch ${context.label}: ${context.parsed.y} objects`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Objects',
                        },
                    },
                },
            },
        });

        charts.push(chart);
    }

    function updateStakeActivationChart() {
        const existingChart = charts.find(c => c.canvas === stakeActivationCanvas);
        if (existingChart) {
            existingChart.destroy();
            charts = charts.filter(c => c !== existingChart);
        }
        createStakeActivationChart();
    }

    function createStakedAmountsChart() {
        if (!stakedAmountsCanvas) return;

        // Create buckets for staked amounts
        const buckets = [
            { label: '< 100', min: 0, max: 100, count: 0 },
            { label: '100-1K', min: 100, max: 1000, count: 0 },
            { label: '1K-10K', min: 1000, max: 10000, count: 0 },
            { label: '10K-100K', min: 10000, max: 100000, count: 0 },
            { label: '100K-1M', min: 100000, max: 1000000, count: 0 },
            { label: '> 1M', min: 1000000, max: Infinity, count: 0 },
        ];

        data.stakedObjects.forEach((obj) => {
            const iotaAmount = Number(obj.principal) / 1_000_000_000;
            const bucket = buckets.find((b) => iotaAmount >= b.min && iotaAmount < b.max);
            if (bucket) bucket.count++;
        });

        const chart = new Chart(stakedAmountsCanvas, {
            type: 'bar',
            data: {
                labels: buckets.map((b) => b.label + ' IOTA'),
                datasets: [
                    {
                        label: 'Number of Objects',
                        data: buckets.map((b) => b.count),
                        backgroundColor: 'rgba(234, 88, 12, 0.6)',
                        borderColor: 'rgba(234, 88, 12, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Staked Amount Distribution',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                if (value == null) return '';
                                return `${value.toLocaleString()} objects`;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Objects',
                        },
                    },
                },
            },
        });

        charts.push(chart);
    }

    function createAddressDistributionChart() {
        if (!addressDistributionCanvas) return;

        // Count objects per address
        const addressCounts = new Map<string, number>();
        data.stakedObjects.forEach((obj) => {
            const count = addressCounts.get(obj.ownerAddress) || 0;
            addressCounts.set(obj.ownerAddress, count + 1);
        });

        // Create buckets
        const buckets = [
            { label: '1 object', min: 1, max: 1, count: 0 },
            { label: '2-5 objects', min: 2, max: 5, count: 0 },
            { label: '6-10 objects', min: 6, max: 10, count: 0 },
            { label: '11-50 objects', min: 11, max: 50, count: 0 },
            { label: '> 50 objects', min: 51, max: Infinity, count: 0 },
        ];

        addressCounts.forEach((count) => {
            const bucket = buckets.find((b) => count >= b.min && count <= b.max);
            if (bucket) bucket.count++;
        });

        const chart = new Chart(addressDistributionCanvas, {
            type: 'pie',
            data: {
                labels: buckets.map((b) => b.label),
                datasets: [
                    {
                        label: 'Number of Addresses',
                        data: buckets.map((b) => b.count),
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.6)',
                            'rgba(16, 185, 129, 0.6)',
                            'rgba(234, 88, 12, 0.6)',
                            'rgba(124, 58, 237, 0.6)',
                            'rgba(245, 158, 11, 0.6)',
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(234, 88, 12, 1)',
                            'rgba(124, 58, 237, 1)',
                            'rgba(245, 158, 11, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Address Distribution by Object Count',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce(
                                    (a: number, b: number) => a + b,
                                    0,
                                );
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} addresses (${percentage}%)`;
                            },
                        },
                    },
                },
            },
        });

        charts.push(chart);
    }

    function createStakeCompositionChart() {
        if (!stakeCompositionCanvas) return;

        const totalStake = Number(data.totalStake);
        const totalStakedAmount = stats.global.totalStakedAmount;
        const wrappedStake = Math.max(0, totalStake - totalStakedAmount);

        const chart = new Chart(stakeCompositionCanvas, {
            type: 'pie',
            data: {
                labels: ['StakedIota', 'TimelockedStakedIota', 'Wrapped Stake'],
                datasets: [
                    {
                        label: 'Stake Composition (IOTA)',
                        data: [
                            stats.global.totalNormalStakedAmount / 1_000_000_000,
                            stats.global.totalTimelockedAmount / 1_000_000_000,
                            wrappedStake / 1_000_000_000,
                        ],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.6)',
                            'rgba(245, 158, 11, 0.6)',
                            'rgba(148, 163, 184, 0.6)',
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(148, 163, 184, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stake Composition',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce(
                                    (a: number, b: number) => a + b,
                                    0,
                                );
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: ${value.toLocaleString()} IOTA (${percentage}%)`;
                            },
                        },
                    },
                },
            },
        });

        charts.push(chart);
    }

    onMount(() => {
        createStakeActivationChart();
        createStakedAmountsChart();
        createAddressDistributionChart();
        createStakeCompositionChart();
    });

    onDestroy(() => {
        charts.forEach((chart) => chart.destroy());
        charts = [];
    });
</script>

<div class="charts-container">
    <h2>Charts for live objects</h2>

    <div class="chart-row">
        <div class="chart-card">
            <div class="filters">
                <label>Min Epoch: <input type="number" bind:value={minEpochFilter} on:input={updateStakeActivationChart} /></label>
                <label>Max Epoch: <input type="number" bind:value={maxEpochFilter} on:input={updateStakeActivationChart} /></label>
            </div>
            <canvas bind:this={stakeActivationCanvas}></canvas>
        </div>
    </div>

    <div class="chart-row">
        <div class="chart-card">
            <canvas bind:this={stakedAmountsCanvas}></canvas>
        </div>
        <div class="chart-card">
            <canvas bind:this={addressDistributionCanvas}></canvas>
        </div>
    </div>

    <div class="chart-row">
        <div class="chart-card">
            <canvas bind:this={stakeCompositionCanvas}></canvas>
        </div>
    </div>
</div>

<style>
    .charts-container {
        margin-top: 2rem;
    }

    h2 {
        margin-bottom: 1.5rem;
    }

    .chart-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .filters label {
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
    }

    .filters input {
        margin-top: 0.25rem;
        padding: 0.25rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
    }

    .chart-card {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        height: 400px;
    }

    @media (max-width: 1024px) {
        .chart-row {
            grid-template-columns: 1fr;
        }
    }
</style>

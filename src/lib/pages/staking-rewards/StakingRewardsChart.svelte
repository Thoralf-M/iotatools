<script lang="ts">
    import Chart from 'chart.js/auto';
    import zoomPlugin from 'chartjs-plugin-zoom';
    import { onDestroy, onMount } from 'svelte';

    import 'chartjs-adapter-date-fns';

    import type { TableComputationResult } from './types';

    Chart.register(zoomPlugin);

    export let tableData: TableComputationResult;
    export let epochEndDates: string[];
    export let epochPrices: Record<number, number>;

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    // All metrics available, staked amount hidden by default
    let selectedMetrics: string[] = [
        'rewards',
        'accumulatedRewards',
        'availableRewards',
        'unstakeTotal',
        'rewardsPrice',
        'accumulatedPrice',
        'stakedAmount',
    ];

    let showStakedAmount: boolean = false;

    let lastClickTime = 0;

    const metricOptions = [
        { value: 'stakedAmount', label: 'Staked Amount' },
        { value: 'rewards', label: 'Rewards' },
        { value: 'accumulatedRewards', label: 'Accumulated Rewards' },
        { value: 'availableRewards', label: 'Available Rewards' },
        { value: 'unstakeTotal', label: 'Unstake Total' },
        { value: 'rewardsPrice', label: 'Rewards Price' },
        { value: 'accumulatedPrice', label: 'Accumulated Price' },
    ];

    // Function to get data for a specific metric
    function getMetricData(metric: string) {
        const { epochs, epochData } = tableData;
        return epochs.slice(0, -1).map((epoch, index) => {
            const date = epochEndDates[index] ? new Date(epochEndDates[index]) : new Date();
            let value: number = 0;

            switch (metric) {
                case 'stakedAmount':
                    // Total staked amount for this epoch
                    value = Number(epochData[epoch]?.totalStaked || 0n);
                    break;
                case 'rewards':
                    value = Number(epochData[epoch]?.totalRewards || 0n);
                    break;
                case 'accumulatedRewards':
                    value = Number(epochData[epoch]?.totalAccumulated || 0n);
                    break;
                case 'availableRewards':
                    value = Number(epochData[epoch]?.availableRewards || 0n);
                    break;
                case 'unstakeTotal':
                    value = Number(epochData[epoch]?.totalUnstakeAccumulated || 0n);
                    break;
                case 'rewardsPrice':
                    const rewards = Number(epochData[epoch]?.totalRewards || 0n);
                    const price = epochPrices[epoch] || 0;
                    value = (rewards / 1000000000) * price;
                    break;
                case 'accumulatedPrice':
                    const accumulated = Number(epochData[epoch]?.totalAccumulated || 0n);
                    const accPrice = epochPrices[epoch] || 0;
                    value = (accumulated / 1000000000) * accPrice;
                    break;
            }

            return {
                x: date,
                y: value,
            };
        });
    }

    // Function to get all datasets
    function getDatasets() {
        const colors = [
            '#059669', // green
            '#dc2626', // red
            '#2563eb', // blue
            '#ea580c', // orange
            '#7c3aed', // purple
            '#0891b2', // cyan
            '#f59e0b', // amber
        ];

        return selectedMetrics.map((metric, index) => {
            const data = getMetricData(metric);
            const option = metricOptions.find((opt) => opt.value === metric);
            return {
                label: option?.label || metric,
                data: data as any,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20', // Add transparency
                tension: 0.1,
                fill: false,
                pointRadius: 3,
                pointHoverRadius: 5,
                hidden: metric === 'stakedAmount' && !showStakedAmount,
            };
        });
    }

    function createChart() {
        if (!canvas) return;

        const datasets = getDatasets();

        chart = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                        },
                        title: {
                            display: true,
                            text: 'Epoch End Date',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value',
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        onClick: function (event, legendItem, legend) {
                            const index = legendItem.datasetIndex;
                            if (index === undefined) return;
                            const ci = legend.chart;
                            const now = Date.now();
                            const isDoubleClick = now - lastClickTime < 300;
                            lastClickTime = now;
                            if (isDoubleClick) {
                                // Solo mode: hide all, show only this one
                                ci.data.datasets.forEach((dataset, i) => {
                                    if (i === index) {
                                        ci.show(i);
                                    } else {
                                        ci.hide(i);
                                    }
                                });
                                // Update legend items
                                if (legend.legendItems) {
                                    legend.legendItems.forEach((item, i) => {
                                        item.hidden = i !== index;
                                    });
                                }
                                // Update showStakedAmount if applicable
                                if (legendItem.text === 'Staked Amount') {
                                    showStakedAmount = true;
                                }
                            } else {
                                // Normal toggle
                                if (ci.isDatasetVisible(index)) {
                                    ci.hide(index);
                                    legendItem.hidden = true;
                                } else {
                                    ci.show(index);
                                    legendItem.hidden = false;
                                }
                                // Update showStakedAmount if applicable
                                if (legendItem.text === 'Staked Amount') {
                                    showStakedAmount = ci.isDatasetVisible(index);
                                }
                            }
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.y;
                                if (value == null) return '';

                                const datasetLabel = context.dataset.label || '';
                                const isPriceMetric = datasetLabel.includes('Price');

                                if (isPriceMetric) {
                                    // For price metrics, show USD and EUR
                                    const usdValue = formatCurrency(value);
                                    const eurValue = (value * 0.85).toFixed(2); // Approximate EUR conversion
                                    return `${datasetLabel}: $${usdValue} USD / €${eurValue} EUR`;
                                } else {
                                    // For amount metrics, show NANO and IOTA
                                    const nanoValue = formatNumberWithUnderscores(value);
                                    const iotaValue = formatIotaWithUnderscores(
                                        (value / 1000000000).toFixed(2),
                                    );
                                    return [
                                        `${datasetLabel}: ${nanoValue} NANO`,
                                        `${iotaValue} IOTA`,
                                    ];
                                }
                            },
                        },
                    },
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'xy',
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                    },
                },
            },
        });
    }

    // Helper function to format numbers with underscores
    function formatNumberWithUnderscores(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
    }

    // Helper function to format IOTA amounts with underscores in decimal part
    function formatIotaWithUnderscores(iotaStr: string): string {
        const [intPart, decPart] = iotaStr.split('.');
        if (!decPart) return intPart;
        // Add underscores every 3 digits in the decimal part
        const formattedDec = decPart.replace(/(\d{3})(?=\d)/g, '$1_');
        return `${intPart}.${formattedDec}`;
    }

    // Helper function to format currency
    function formatCurrency(value: number): string {
        return value.toFixed(2);
    }

    function resetZoom() {
        if (chart) {
            chart.resetZoom();
        }
    }

    function updateChart() {
        if (!chart) return;

        const datasets = getDatasets();
        chart.data.datasets = datasets;
        chart.update();
    }

    onMount(() => {
        createChart();
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

    // Reactive: update chart when data or metrics change
    $: if (chart && tableData && epochEndDates && epochPrices) {
        updateChart();
    }

    // Reactive: update chart when selected metrics change
    $: if (chart && selectedMetrics) {
        updateChart();
    }
</script>

<div class="chart-container">
    <div class="chart-header">
        <div class="legend-instructions">
            Click legend to toggle. Double-click to view only that metric.
        </div>
        <button class="reset-button" onclick={resetZoom} title="Reset Zoom">🔍 Reset</button>
    </div>
    <div class="chart-wrapper">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .chart-container {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .legend-instructions {
        font-size: 0.85rem;
        color: #666;
        font-style: italic;
    }

    .reset-button {
        padding: 0.5rem 1rem;
        background: #059669;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .reset-button:hover {
        background: #047857;
    }

    .chart-wrapper {
        height: 400px;
        position: relative;
    }
</style>

<script lang="ts">
    import Chart from 'chart.js/auto';
    import zoomPlugin from 'chartjs-plugin-zoom';
    import { onDestroy, onMount } from 'svelte';

    import 'chartjs-adapter-date-fns';

    import type { CheckpointData } from '../lib/epoch-ptb-analyzer';

    Chart.register(zoomPlugin);

    export let checkpointData: CheckpointData[] = [];
    export let title: string = 'Transactions per Checkpoint Over Time';

    // Callback prop instead of createEventDispatcher
    export let onCheckpointSelected: ((checkpoint: string) => void) | undefined = undefined;

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;
    let bucketTime: number = 3600000; // Will be dynamically set based on transaction count
    let userOverrideBucketTime = false; // Track if user manually selected a bucket time
    let lastDataLength = 0; // Track data length to detect new data loads
    let zoomState: { min?: number; max?: number } = {}; // Store zoom state
    let filterState: { min?: number; max?: number } = {}; // Store filter boundaries
    let isDataFiltered = false; // Track if data is currently filtered by zoom
    let originalDataLength = 0; // Track original data length for UI feedback
    let filteredDataLength = 0; // Track filtered data length for UI feedback
    let selectedCheckpoint: string | null = null; // Track selected checkpoint for feedback
    let resizeObserver: ResizeObserver | null = null;
    let isResettingZoom = false; // Track when we're resetting zoom to avoid unwanted filtering changes
    let cachedAggregatedData: any[] = []; // Cache aggregated data to avoid reprocessing
    let lastBucketTime = 0; // Track last bucket time to detect changes

    const bucketOptions = [
        { value: 3600000, label: '1 hour', displayUnit: 'hour' },
        { value: 600000, label: '10 minutes', displayUnit: '10 minutes' },
        { value: 60000, label: '1 minute', displayUnit: 'minute' },
        { value: 10000, label: '10 seconds', displayUnit: '10 seconds' },
        { value: 1000, label: '1 second (only use for small selections)', displayUnit: 'second' },
        { value: 200, label: '200 ms (only use for small selections)', displayUnit: '200 ms' },
    ];

    // Function to calculate bucket time based on total transaction count
    function calculateBucketTime(data: CheckpointData[]): number {
        const totalTxs = data.reduce((sum, cp) => sum + cp.transactionCount, 0);

        if (totalTxs <= 100) {
            return 10000; // 10 seconds
        } else if (totalTxs <= 500) {
            return 60000; // 1 minute
        } else if (totalTxs <= 1000) {
            return 600000; // 10 minutes
        } else {
            return 3600000; // 1 hour
        }
    }

    // Update bucket time when checkpoint data changes (only if user hasn't manually overridden)
    $: if (checkpointData.length > 0) {
        // Check if this is new data (different length or first time)
        const isNewData = checkpointData.length !== lastDataLength;

        if (isNewData) {
            // Reset user override flag for new data
            userOverrideBucketTime = false;
            lastDataLength = checkpointData.length;
        }

        // Calculate new bucket time if user hasn't overridden or if it's new data
        if (!userOverrideBucketTime) {
            const newBucketTime = calculateBucketTime(checkpointData);
            if (bucketTime !== newBucketTime) {
                bucketTime = newBucketTime;
            }
        }
    }

    // Function to filter data based on zoom state
    function filterDataByZoom(data: CheckpointData[]): CheckpointData[] {
        if (!zoomState.min || !zoomState.max) {
            return data;
        }

        const zoomStart = new Date(zoomState.min);
        const zoomEnd = new Date(zoomState.max);

        return data.filter((cp) => {
            const cpTime = new Date(cp.timestamp);
            return cpTime >= zoomStart && cpTime <= zoomEnd;
        });
    }

    // Function to handle checkpoint selection
    function selectCheckpoint(checkpointRange: string) {
        // Extract the first checkpoint number from the range
        let firstCheckpoint: string;
        if (checkpointRange === 'No transactions') {
            return; // Don't select if no transactions
        }

        // Handle both single checkpoint and range formats
        if (checkpointRange.includes('-')) {
            firstCheckpoint = checkpointRange.split('-')[0];
        } else {
            firstCheckpoint = checkpointRange;
        }

        selectedCheckpoint = firstCheckpoint;

        // Use callback prop instead of dispatcher
        if (onCheckpointSelected) {
            onCheckpointSelected(firstCheckpoint);
        }

        // Clear the feedback after 2 seconds
        setTimeout(() => {
            selectedCheckpoint = null;
        }, 2000);
    }

    function createChart(preserveDataFilter = false) {
        if (!canvas || checkpointData.length === 0) return;

        // Ensure canvas has proper dimensions for text rendering
        const container = canvas.parentElement;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            canvas.style.width = '100%';
            canvas.style.height = `${containerRect.height - 120}px`; // Account for controls
        }

        // Store original data length for UI feedback
        originalDataLength = checkpointData.length;

        // Check if zoom range is too narrow for the current bucket size
        let shouldResetZoom = false;
        if (zoomState.min && zoomState.max) {
            const zoomDuration = zoomState.max - zoomState.min;
            // If zoom range is smaller than 2 bucket intervals, reset zoom
            if (zoomDuration < bucketTime * 2) {
                shouldResetZoom = true;
            }
        }

        // Always use all data for aggregation, we'll filter the aggregated data later
        let dataToProcess = checkpointData;

        // If zoom range is too narrow, reset zoom and use all data
        if (shouldResetZoom) {
            zoomState = {};
            if (!preserveDataFilter) {
                isDataFiltered = false;
                filteredDataLength = checkpointData.length;
            }
        }

        // Store current zoom state before destroying chart (only if we're not resetting zoom)
        if (
            chart &&
            chart.scales &&
            chart.scales.x &&
            !shouldResetZoom &&
            !isResettingZoom &&
            dataToProcess.length > 0 &&
            zoomState.min &&
            zoomState.max
        ) {
            const currentMin = chart.scales.x.min;
            const currentMax = chart.scales.x.max;
            zoomState = {
                min: currentMin,
                max: currentMax,
            };
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Check if we need to reprocess aggregated data
        const needsReprocessing =
            cachedAggregatedData.length === 0 ||
            lastBucketTime !== bucketTime ||
            lastDataLength !== checkpointData.length;

        let aggregatedData = cachedAggregatedData;

        if (needsReprocessing) {
            // Only recreate aggregated data when necessary
            aggregatedData = [];
            const sortedData = [...dataToProcess].sort(
                (a, b) => a.sequenceNumber - b.sequenceNumber,
            );

            if (sortedData.length === 0) return;

            // Get the time range
            const startTime = new Date(sortedData[0].timestamp);
            const endTime = new Date(sortedData[sortedData.length - 1].timestamp);

            // Round start time down to the nearest bucket interval
            const roundedStartTime = new Date(startTime);
            roundedStartTime.setSeconds(0, 0);
            if (bucketTime >= 3600000) {
                // 1 hour or more
                roundedStartTime.setMinutes(0);
            } else if (bucketTime >= 600000) {
                // 10 minutes or more
                const minutes = Math.floor(roundedStartTime.getMinutes() / 10) * 10;
                roundedStartTime.setMinutes(minutes);
            }

            // Adaptive aggregation strategy based on timeframe granularity
            const bucketMap = new Map();

            // For very small timeframes, use a different approach
            if (bucketTime <= 1000) {
                // For ≤1s timeframes: create individual data points for each checkpoint with minimal aggregation
                sortedData.forEach((cp) => {
                    const cpTime = new Date(cp.timestamp);
                    // Round to the nearest bucket time for very minimal aggregation
                    const bucketStart = new Date(
                        Math.floor(cpTime.getTime() / bucketTime) * bucketTime,
                    );
                    const bucketKey = bucketStart.getTime();

                    if (!bucketMap.has(bucketKey)) {
                        bucketMap.set(bucketKey, []);
                    }
                    bucketMap.get(bucketKey).push(cp);
                });

                // Convert directly to aggregated data with strategic gap filling
                bucketMap.forEach((checkpoints, time) => {
                    const totalPTBs = checkpoints.reduce(
                        (sum: number, cp: any) => sum + cp.transactionCount,
                        0,
                    );
                    const checkpointCount = checkpoints.length;

                    let checkpointRange = 'No transactions';
                    if (checkpoints.length > 0) {
                        const minCheckpoint = Math.min(
                            ...checkpoints.map((cp: any) => cp.sequenceNumber),
                        );
                        const maxCheckpoint = Math.max(
                            ...checkpoints.map((cp: any) => cp.sequenceNumber),
                        );
                        checkpointRange =
                            minCheckpoint === maxCheckpoint
                                ? `${minCheckpoint}`
                                : `${minCheckpoint}-${maxCheckpoint}`;
                    }

                    aggregatedData.push({
                        x: new Date(time),
                        y: totalPTBs,
                        checkpointRange,
                        checkpointCount,
                        averageTransactions:
                            checkpointCount > 0
                                ? Math.round((totalPTBs / checkpointCount) * 100) / 100
                                : 0,
                    });
                });

                // Sort by time
                aggregatedData.sort((a, b) => a.x.getTime() - b.x.getTime());

                // Add strategic zero points between transactions when there are significant gaps
                const enhancedData = [];
                for (let i = 0; i < aggregatedData.length; i++) {
                    const current = aggregatedData[i];
                    enhancedData.push(current);

                    // Check if there's a next data point and if there's a significant gap
                    if (i < aggregatedData.length - 1) {
                        const next = aggregatedData[i + 1];
                        const timeDiff = next.x.getTime() - current.x.getTime();

                        // Add a zero point if gap is larger than 3 bucket intervals
                        const significantGap = bucketTime * 3;
                        if (timeDiff > significantGap) {
                            // Add one zero point in the middle of the gap
                            const midTime = new Date(
                                current.x.getTime() + Math.floor(timeDiff / 2),
                            );
                            enhancedData.push({
                                x: midTime,
                                y: 0,
                                checkpointRange: 'No transactions',
                                checkpointCount: 0,
                                averageTransactions: 0,
                            });
                        }
                    }
                }

                aggregatedData = enhancedData;
            } else {
                // For larger timeframes, use the previous aggregation logic
                sortedData.forEach((cp) => {
                    const cpTime = new Date(cp.timestamp);
                    const bucketStart = new Date(
                        cpTime.getTime() - (cpTime.getTime() % bucketTime),
                    );
                    bucketStart.setSeconds(0, 0);

                    if (bucketTime >= 3600000) {
                        bucketStart.setMinutes(0);
                    } else if (bucketTime >= 600000) {
                        const minutes = Math.floor(bucketStart.getMinutes() / 10) * 10;
                        bucketStart.setMinutes(minutes);
                    }

                    const bucketKey = bucketStart.getTime();

                    if (!bucketMap.has(bucketKey)) {
                        bucketMap.set(bucketKey, []);
                    }
                    bucketMap.get(bucketKey).push(cp);
                });

                // Convert map to array and fill gaps based on timeframe granularity
                const bucketTimes = Array.from(bucketMap.keys()).sort((a, b) => a - b);

                if (bucketTimes.length > 0) {
                    const firstBucket = bucketTimes[0];
                    const lastBucket = bucketTimes[bucketTimes.length - 1];

                    // Adaptive gap filling based on bucket size
                    let maxGapSize;
                    let fillAllBuckets = false;

                    if (bucketTime <= 10000) {
                        // For small timeframes (≤10s), fill moderate gaps
                        maxGapSize = bucketTime * 5; // Fill gaps larger than 5 buckets
                    } else if (bucketTime <= 60000) {
                        // For medium timeframes (≤1min), be more selective
                        maxGapSize = bucketTime * 10; // Fill gaps larger than 10 buckets
                    } else {
                        // For large timeframes (>1min), only fill significant gaps
                        maxGapSize = bucketTime * 20; // Fill gaps larger than 20 buckets
                    }

                    for (let time = firstBucket; time <= lastBucket; time += bucketTime) {
                        const checkpointsInBucket = bucketMap.get(time) || [];
                        const totalPTBs = checkpointsInBucket.reduce(
                            (sum: number, cp: any) => sum + cp.transactionCount,
                            0,
                        );
                        const checkpointCount = checkpointsInBucket.length;

                        // Decision logic for including buckets
                        const hasData = checkpointCount > 0;
                        const isAtBoundary = time === firstBucket || time === lastBucket;
                        const nextDataBucket = bucketTimes.find((t) => t > time);
                        const isSignificantGap =
                            nextDataBucket && nextDataBucket - time > maxGapSize;

                        // For small timeframes, be more inclusive to preserve detail
                        const shouldInclude =
                            hasData ||
                            isAtBoundary ||
                            isSignificantGap ||
                            (fillAllBuckets && (time - firstBucket) % (bucketTime * 2) === 0);

                        if (shouldInclude) {
                            let checkpointRange = 'No transactions';
                            if (checkpointsInBucket.length > 0) {
                                const minCheckpoint = Math.min(
                                    ...checkpointsInBucket.map((cp: any) => cp.sequenceNumber),
                                );
                                const maxCheckpoint = Math.max(
                                    ...checkpointsInBucket.map((cp: any) => cp.sequenceNumber),
                                );
                                checkpointRange =
                                    minCheckpoint === maxCheckpoint
                                        ? `${minCheckpoint}`
                                        : `${minCheckpoint}-${maxCheckpoint}`;
                            }

                            aggregatedData.push({
                                x: new Date(time),
                                y: totalPTBs,
                                checkpointRange,
                                checkpointCount,
                                averageTransactions:
                                    checkpointCount > 0
                                        ? Math.round((totalPTBs / checkpointCount) * 100) / 100
                                        : 0,
                            });
                        }
                    }
                }
            }

            // Cache the results
            cachedAggregatedData = aggregatedData;
            lastBucketTime = bucketTime;
            lastDataLength = checkpointData.length;

            // Debug logging for performance analysis
            const bucketTimeLabel =
                bucketTime < 1000
                    ? `${bucketTime}ms`
                    : bucketTime < 60000
                      ? `${bucketTime / 1000}s`
                      : `${bucketTime / 60000}min`;
            console.log(
                `Aggregation optimized (${bucketTimeLabel}): ${sortedData.length} transactions → ${aggregatedData.length} buckets`,
            );
        }

        // Use cached aggregated data
        aggregatedData = cachedAggregatedData;

        // Staged zero-point filtering for optimal performance
        let filteredAggregatedData;

        // For very granular timeframes (≤1s), apply minimal filtering to preserve detail
        if (bucketTime <= 1000) {
            // Very conservative filtering - only remove consecutive zeros in the middle of long sequences
            filteredAggregatedData = [];
            let consecutiveZeros = 0;

            for (let i = 0; i < aggregatedData.length; i++) {
                const point = aggregatedData[i];
                const isZero = point.y === 0;

                if (!isZero) {
                    filteredAggregatedData.push(point);
                    consecutiveZeros = 0;
                } else {
                    consecutiveZeros++;
                    // For very granular views, keep most zero points - only skip every 10th consecutive zero
                    if (
                        consecutiveZeros === 1 ||
                        consecutiveZeros % 10 === 0 ||
                        i === aggregatedData.length - 1
                    ) {
                        filteredAggregatedData.push(point);
                    }
                }
            }
        } else {
            // Standard filtering for larger timeframes
            // Stage 1: Basic filtering - remove obvious redundant zero points
            const basicFiltered = [];
            let lastNonZero = -1;
            let lastZero = -1;

            for (let i = 0; i < aggregatedData.length; i++) {
                const point = aggregatedData[i];
                const isZero = point.y === 0;

                if (!isZero) {
                    // Always keep non-zero points
                    basicFiltered.push(point);
                    lastNonZero = basicFiltered.length - 1;
                } else {
                    // For zero points, keep first and last of sequences
                    const isFirstZero = i === 0 || aggregatedData[i - 1].y !== 0;
                    const isLastZero =
                        i === aggregatedData.length - 1 || aggregatedData[i + 1].y !== 0;

                    if (isFirstZero || isLastZero) {
                        basicFiltered.push(point);
                        lastZero = basicFiltered.length - 1;
                    }
                }
            }

            // Stage 2: Advanced filtering based on timeframe and zoom level
            if (basicFiltered.length > 1000) {
                // For large datasets, apply more aggressive filtering
                filteredAggregatedData = [];

                // Determine sampling rate based on bucket size and data density
                let samplingRate;
                const dataPointsPerHour = 3600000 / bucketTime;

                if (dataPointsPerHour > 360) {
                    // High frequency (seconds) - moderate filtering
                    samplingRate = 50; // Keep every 50th zero point
                } else if (dataPointsPerHour > 60) {
                    // Medium frequency (minutes) - more aggressive
                    samplingRate = 100; // Keep every 100th zero point
                } else {
                    // Low frequency (hours) - very aggressive
                    samplingRate = 200; // Keep every 200th zero point
                }

                let zeroCount = 0;
                for (let i = 0; i < basicFiltered.length; i++) {
                    const point = basicFiltered[i];
                    const isZero = point.y === 0;

                    if (!isZero) {
                        filteredAggregatedData.push(point);
                        zeroCount = 0; // Reset zero count
                    } else {
                        const isFirstZero = i === 0 || basicFiltered[i - 1].y !== 0;
                        const isLastZero =
                            i === basicFiltered.length - 1 || basicFiltered[i + 1].y !== 0;
                        const shouldKeep =
                            isFirstZero || isLastZero || zeroCount % samplingRate === 0;

                        if (shouldKeep) {
                            filteredAggregatedData.push(point);
                        }

                        zeroCount++;
                    }
                }
            } else {
                // For smaller datasets, use the basic filtered data
                filteredAggregatedData = basicFiltered;
            }
        }

        // Debug logging for performance analysis
        const bucketTimeLabel =
            bucketTime < 1000
                ? `${bucketTime}ms`
                : bucketTime < 60000
                  ? `${bucketTime / 1000}s`
                  : `${bucketTime / 60000}min`;

        // Handle debug logging for different filtering paths
        if (bucketTime <= 1000) {
            console.log(
                `Filtering optimized (${bucketTimeLabel}): ${aggregatedData.length} → final: ${filteredAggregatedData.length} points (granular mode)`,
            );
        } else {
            const basicFilteredLength = filteredAggregatedData.length; // In this case, basicFiltered was used to create filteredAggregatedData
            console.log(
                `Filtering optimized (${bucketTimeLabel}): ${aggregatedData.length} → stage1: ${basicFilteredLength} → final: ${filteredAggregatedData.length} points`,
            );
        }

        // Prepare data for Chart.js
        let chartData = filteredAggregatedData;

        // If we're resetting zoom or should reset zoom, always show all aggregated data without filtering
        if (isResettingZoom || shouldResetZoom) {
            // If data is filtered, apply the stored filter boundaries
            if (isDataFiltered && filterState.min && filterState.max) {
                const filterStart = new Date(filterState.min);
                const filterEnd = new Date(filterState.max);

                chartData = filteredAggregatedData.filter((dataPoint) => {
                    const pointTime = new Date(dataPoint.x);
                    return pointTime >= filterStart && pointTime <= filterEnd;
                });
            } else {
                chartData = filteredAggregatedData;
                if (!preserveDataFilter) {
                    isDataFiltered = false;
                    filteredDataLength = checkpointData.length;
                }
            }
        }
        // Filter data by zoom state or filter state
        else if (
            (zoomState.min && zoomState.max) ||
            (isDataFiltered && filterState.min && filterState.max)
        ) {
            // Use zoom state if available, otherwise use filter state
            const filterStart = new Date((zoomState.min || filterState.min)!);
            const filterEnd = new Date((zoomState.max || filterState.max)!);

            chartData = filteredAggregatedData.filter((dataPoint) => {
                const pointTime = new Date(dataPoint.x);
                return pointTime >= filterStart && pointTime <= filterEnd;
            });

            if (!preserveDataFilter) {
                // Count original checkpoints in the filtered time range for UI feedback
                const filteredCheckpoints = filterDataByZoom(checkpointData);
                isDataFiltered = true;
                filteredDataLength = filteredCheckpoints.length;
            }
        } else if (!preserveDataFilter) {
            isDataFiltered = false;
            filteredDataLength = checkpointData.length;
        }

        // Only recreate chart if it doesn't exist or if we reprocessed data
        if (!chart || needsReprocessing) {
            // Destroy existing chart if it exists
            if (chart) {
                chart.destroy();
            }

            // Get current bucket option for labeling
            const currentBucketOption =
                bucketOptions.find((opt) => opt.value === bucketTime) || bucketOptions[0];

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: `Transactions per ${currentBucketOption.displayUnit}`,
                            data: chartData as any,
                            borderColor: '#007acc',
                            backgroundColor: 'rgba(0, 122, 204, 0.1)',
                            borderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: 2.5, // Add explicit aspect ratio to prevent text stretching
                    devicePixelRatio: window.devicePixelRatio || 1, // Ensure proper pixel ratio
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    onClick: (event: any, activeElements: any) => {
                        if (activeElements.length > 0) {
                            const dataIndex = activeElements[0].index;
                            const dataPoint = chartData[dataIndex];
                            if (dataPoint && dataPoint.checkpointRange) {
                                selectCheckpoint(dataPoint.checkpointRange);
                            }
                        }
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x',
                                modifierKey: 'ctrl',
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true,
                                },
                                drag: {
                                    enabled: true,
                                    backgroundColor: 'rgba(0, 122, 204, 0.2)',
                                    borderColor: 'rgba(0, 122, 204, 0.8)',
                                    borderWidth: 2,
                                },
                                mode: 'x',
                                onZoomComplete: function ({ chart }: any) {
                                    // Update zoom state when user zooms
                                    if (chart.scales && chart.scales.x) {
                                        zoomState = {
                                            min: chart.scales.x.min,
                                            max: chart.scales.x.max,
                                        };
                                    }
                                },
                            },
                        },
                        title: {
                            display: true,
                            text: title,
                            font: {
                                size: 16,
                                weight: 'bold',
                            },
                        },
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                title: function (context: any) {
                                    const dataPoint = context[0].raw as any;
                                    return `Checkpoints: ${dataPoint.checkpointRange}`;
                                },
                                label: function (context: any) {
                                    const dataPoint = context.raw as any;
                                    const date = new Date(dataPoint.x);
                                    return [
                                        `Total Transactions: ${dataPoint.y}`,
                                        `Checkpoint Count: ${dataPoint.checkpointCount}`,
                                        `Average per Checkpoint: ${dataPoint.averageTransactions}`,
                                        `Time: ${date.toLocaleString()}`,
                                    ];
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            display: true,
                            title: {
                                display: true,
                                text: 'Time',
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                            },
                            // Only apply zoom constraints if we're not resetting zoom and have valid zoom state
                            ...(zoomState.min &&
                            zoomState.max &&
                            !isResettingZoom &&
                            !shouldResetZoom
                                ? {
                                      min: zoomState.min,
                                      max: zoomState.max,
                                  }
                                : {}),
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: `Transaction Count per ${currentBucketOption.displayUnit}`,
                            },
                            beginAtZero: true,
                        },
                    },
                },
            });
        } else {
            // Just update the data without recreating the chart
            chart.data.datasets[0].data = chartData as any;
            chart.update('none'); // Use 'none' mode for fastest update
        }
    }

    onMount(() => {
        createChart(false);

        // Set up resize observer to handle container resizing
        if (canvas && 'ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                if (chart) {
                    chart.resize();
                }
            });
            resizeObserver.observe(canvas.parentElement!);
        }
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });

    // Function to reset zoom
    function resetZoom() {
        // Set flag to prevent filtering state changes during reset
        isResettingZoom = true;

        // Clear zoom state completely but preserve filter state
        zoomState = {};

        // Don't clear data filtering - keep the previous filter if it exists
        // isDataFiltered and filteredDataLength should remain unchanged

        // Reset the chart's zoom plugin if it exists
        if (chart) {
            chart.resetZoom();
        }

        // Recreate chart without any zoom constraints but preserve data filter
        createChart(true); // Pass true to preserve data filter

        // Clear the reset flag after a delay to ensure chart is fully created
        setTimeout(() => {
            isResettingZoom = false;
        }, 100);
    }

    // Function to apply data filtering based on current zoom
    function applyDataFilter() {
        if (chart && chart.scales && chart.scales.x) {
            // Get the exact visible range from the chart
            const visibleMin = chart.scales.x.min;
            const visibleMax = chart.scales.x.max;

            // Set both zoom state and filter state
            zoomState = {
                min: visibleMin,
                max: visibleMax,
            };

            // Store filter boundaries separately from zoom state
            filterState = {
                min: visibleMin,
                max: visibleMax,
            };

            // Set data filtering flag
            isDataFiltered = true;

            createChart(false); // Recreate chart with filtered data
        }
    }

    // Function to clear data filtering and show all data
    function clearDataFilter() {
        zoomState = {};
        filterState = {}; // Clear filter state as well
        isDataFiltered = false;
        filteredDataLength = checkpointData.length;
        createChart(false); // Recreate chart with all data
    }

    // Recreate chart when data or bucket time changes
    $: if (canvas && (checkpointData.length > 0 || bucketTime)) {
        createChart(false);
    }
</script>

<div class="chart-container">
    <div class="chart-controls">
        <div class="control-group">
            <label for="bucket-time">Time bucket:</label>
            <select
                id="bucket-time"
                value={bucketTime}
                on:change={(e) => {
                    userOverrideBucketTime = true;
                    bucketTime = parseInt((e.target as HTMLSelectElement).value);
                }}
            >
                {#each bucketOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
        <div class="control-group">
            <button class="reset-zoom-btn" on:click={resetZoom} title="Reset zoom to show all data">
                Reset Zoom
            </button>
            {#if chart && chart.scales && chart.scales.x && (chart.scales.x.min !== undefined || chart.scales.x.max !== undefined)}
                <button
                    class="filter-btn"
                    on:click={applyDataFilter}
                    title="Apply data filter to current zoom level for better performance"
                >
                    Filter Data
                </button>
            {/if}
            {#if isDataFiltered}
                <button class="clear-filter-btn" on:click={clearDataFilter} title="Show all data">
                    Show All Data
                </button>
            {/if}
        </div>
        <div class="zoom-instructions">
            <small
                >💡 Drag to select range, Ctrl+drag to pan, mouse wheel to zoom, click data point to
                select checkpoint</small
            >
        </div>
    </div>

    {#if selectedCheckpoint}
        <div class="selection-feedback">
            📍 <strong>Selected:</strong> Checkpoint {selectedCheckpoint}
        </div>
    {/if}

    {#if isDataFiltered}
        <div class="data-filter-info">
            📊 <strong>Data Filtered:</strong> Showing {filteredDataLength} of {originalDataLength} transactions
            ({Math.round((filteredDataLength / originalDataLength) * 100)}% of total data)
        </div>
    {/if}
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .chart-container {
        position: relative;
        width: 100%;
        height: 450px; /* Fixed total height */
        margin: 20px 0;
        padding: 20px;
        background: #1a1a1a;
        border-radius: 8px;
        border: 1px solid #333;
        display: flex;
        flex-direction: column;
    }

    .chart-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
        flex-shrink: 0; /* Prevent controls from shrinking */
        flex-wrap: wrap;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .chart-controls label {
        font-weight: bold;
        color: #ccc;
        font-size: 14px;
    }

    .chart-controls select {
        padding: 5px 10px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #2a2a2a;
        color: #ccc;
        font-size: 14px;
        cursor: pointer;
    }

    .chart-controls select:hover {
        border-color: #007acc;
    }

    .chart-controls select:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    .reset-zoom-btn {
        padding: 6px 12px;
        border: 1px solid #007acc;
        border-radius: 4px;
        background: #007acc;
        color: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .reset-zoom-btn:hover {
        background: #005999;
        border-color: #005999;
    }

    .reset-zoom-btn:active {
        transform: translateY(1px);
    }

    .filter-btn {
        padding: 6px 12px;
        border: 1px solid #28a745;
        border-radius: 4px;
        background: #28a745;
        color: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        background: #1e7e34;
        border-color: #1e7e34;
    }

    .filter-btn:active {
        transform: translateY(1px);
    }

    .clear-filter-btn {
        padding: 6px 12px;
        border: 1px solid #ffc107;
        border-radius: 4px;
        background: #ffc107;
        color: #212529;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .clear-filter-btn:hover {
        background: #e0a800;
        border-color: #e0a800;
    }

    .clear-filter-btn:active {
        transform: translateY(1px);
    }

    .data-filter-info {
        background: rgba(40, 167, 69, 0.1);
        border: 1px solid rgba(40, 167, 69, 0.3);
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
        color: #28a745;
        font-size: 13px;
        line-height: 1.4;
    }

    .selection-feedback {
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid rgba(255, 193, 7, 0.3);
        border-radius: 4px;
        padding: 8px 10px;
        margin-bottom: 10px;
        color: #ffc107;
        font-size: 12px;
        line-height: 1.4;
        animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .zoom-instructions {
        color: #888;
        font-style: italic;
    }

    .zoom-instructions small {
        font-size: 11px;
    }

    canvas {
        width: 100% !important;
        height: auto !important;
        flex: 1; /* Take remaining space after controls */
        min-height: 250px; /* Minimum height for readability */
        max-height: 350px; /* Maximum height to prevent stretching */
        cursor: pointer; /* Indicate that data points are clickable */
        display: block; /* Ensure proper block layout */
    }

    @media (max-width: 768px) {
        .chart-container {
            height: auto;
            min-height: 400px;
        }

        .chart-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
        }

        .control-group {
            justify-content: center;
        }

        .zoom-instructions small {
            font-size: 10px;
            text-align: center;
        }

        canvas {
            min-height: 200px;
            max-height: 300px;
        }
    }
</style>

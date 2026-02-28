import { p as push, V as prop, q as onMount, g as get, m as mutable_source, W as onDestroy, X as legacy_pre_effect, n as set, Y as deep_read_state, Z as legacy_pre_effect_reset, i as init, a as from_html, s as sibling, c as child, L as each, t as template_effect, e as set_text, _ as untrack, k as append, O as index, $ as init_select, b as if_block, a0 as select_option, h as event, l as pop, u as mutate, y as bind_value, a1 as bind_group, Q as first_child, P as getTransactionLink, x as getSelectedNetworkConfig, a2 as formatAddress, d as set_attribute, M as getObjectLink, S as getAddressLink, U as text, a3 as copyToClipboard, R as comment, a4 as set_style, D as TransactionView, a5 as set_class } from "./index-BXT6y7v8.js";
import { b as bind_this } from "./this-B3Wwp6yM.js";
import { C as Chart } from "./auto-Bkf-6vH1.js";
import { p as plugin, E as EpochPTBAnalyzer } from "./epoch-ptb-analyzer-BmPUXXMD.js";
import "./index-a-qIJzeT.js";
var root_1$1 = from_html(`<option> </option>`);
var root_2 = from_html(`<button class="filter-btn svelte-1s1yw9c" title="Apply data filter to current zoom level for better performance">Filter Data</button>`);
var root_3 = from_html(`<button class="clear-filter-btn svelte-1s1yw9c" title="Show all data">Show All Data</button>`);
var root_4$1 = from_html(`<div class="selection-feedback svelte-1s1yw9c">📍 <strong>Selected:</strong> </div>`);
var root_5$1 = from_html(`<div class="data-filter-info svelte-1s1yw9c">📊 <strong>Data Filtered:</strong> </div>`);
var root$1 = from_html(`<div class="chart-container svelte-1s1yw9c"><div class="chart-controls svelte-1s1yw9c"><div class="control-group svelte-1s1yw9c"><label for="bucket-time" class="svelte-1s1yw9c">Time bucket:</label> <select id="bucket-time" class="svelte-1s1yw9c"></select></div> <div class="control-group svelte-1s1yw9c"><button class="reset-zoom-btn svelte-1s1yw9c" title="Reset zoom to show all data">Reset Zoom</button> <!> <!></div> <div class="zoom-instructions svelte-1s1yw9c"><small class="svelte-1s1yw9c">💡 Drag to select range, Ctrl+drag to pan, mouse wheel to zoom, click data point to
                select checkpoint</small></div></div> <!> <!> <canvas class="svelte-1s1yw9c"></canvas></div>`);
function TransactionChart($$anchor, $$props) {
  push($$props, false);
  Chart.register(plugin);
  let checkpointData = prop($$props, "checkpointData", 24, () => []);
  let title = prop($$props, "title", 8, "Transactions per Checkpoint Over Time");
  let onCheckpointSelected = prop($$props, "onCheckpointSelected", 8, void 0);
  let canvas = mutable_source();
  let chart = mutable_source(null);
  let bucketTime = mutable_source(
    36e5
    // Will be dynamically set based on transaction count
  );
  let userOverrideBucketTime = mutable_source(
    false
    // Track if user manually selected a bucket time
  );
  let lastDataLength = mutable_source(
    0
    // Track data length to detect new data loads
  );
  let zoomState = {};
  let filterState = {};
  let isDataFiltered = mutable_source(
    false
    // Track if data is currently filtered by zoom
  );
  let originalDataLength = mutable_source(
    0
    // Track original data length for UI feedback
  );
  let filteredDataLength = mutable_source(
    0
    // Track filtered data length for UI feedback
  );
  let selectedCheckpoint = mutable_source(
    null
    // Track selected checkpoint for feedback
  );
  let resizeObserver = null;
  let isResettingZoom = false;
  let cachedAggregatedData = [];
  let lastBucketTime = 0;
  const bucketOptions = [
    { value: 36e5, label: "1 hour", displayUnit: "hour" },
    {
      value: 6e5,
      label: "10 minutes",
      displayUnit: "10 minutes"
    },
    { value: 6e4, label: "1 minute", displayUnit: "minute" },
    { value: 1e4, label: "10 seconds", displayUnit: "10 seconds" },
    {
      value: 1e3,
      label: "1 second (only use for small selections)",
      displayUnit: "second"
    },
    {
      value: 200,
      label: "200 ms (only use for small selections)",
      displayUnit: "200 ms"
    }
  ];
  function calculateBucketTime(data) {
    const totalTxs = data.reduce((sum, cp) => sum + cp.transactionCount, 0);
    if (totalTxs <= 100) {
      return 1e4;
    } else if (totalTxs <= 500) {
      return 6e4;
    } else if (totalTxs <= 1e3) {
      return 6e5;
    } else {
      return 36e5;
    }
  }
  function filterDataByZoom(data) {
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
  function selectCheckpoint(checkpointRange) {
    let firstCheckpoint;
    if (checkpointRange === "No transactions") {
      return;
    }
    if (checkpointRange.includes("-")) {
      firstCheckpoint = checkpointRange.split("-")[0];
    } else {
      firstCheckpoint = checkpointRange;
    }
    set(selectedCheckpoint, firstCheckpoint);
    if (onCheckpointSelected()) {
      onCheckpointSelected()(firstCheckpoint);
    }
    setTimeout(
      () => {
        set(selectedCheckpoint, null);
      },
      2e3
    );
  }
  function createChart(preserveDataFilter = false) {
    if (!get(canvas) || checkpointData().length === 0) return;
    const container = get(canvas).parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      mutate(canvas, get(canvas).style.width = "100%");
      mutate(
        canvas,
        // Account for controls
        get(canvas).style.height = `${containerRect.height - 120}px`
      );
    }
    set(originalDataLength, checkpointData().length);
    let shouldResetZoom = false;
    if (zoomState.min && zoomState.max) {
      const zoomDuration = zoomState.max - zoomState.min;
      if (zoomDuration < get(bucketTime) * 2) {
        shouldResetZoom = true;
      }
    }
    let dataToProcess = checkpointData();
    if (shouldResetZoom) {
      zoomState = {};
      if (!preserveDataFilter) {
        set(isDataFiltered, false);
        set(filteredDataLength, checkpointData().length);
      }
    }
    if (get(chart) && get(chart).scales && get(chart).scales.x && !shouldResetZoom && !isResettingZoom && dataToProcess.length > 0 && zoomState.min && zoomState.max) {
      const currentMin = get(chart).scales.x.min;
      const currentMax = get(chart).scales.x.max;
      zoomState = { min: currentMin, max: currentMax };
    }
    const ctx = get(canvas).getContext("2d");
    if (!ctx) return;
    const needsReprocessing = cachedAggregatedData.length === 0 || lastBucketTime !== get(bucketTime) || get(lastDataLength) !== checkpointData().length;
    let aggregatedData = cachedAggregatedData;
    if (needsReprocessing) {
      aggregatedData = [];
      const sortedData = [...dataToProcess].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      if (sortedData.length === 0) return;
      const startTime = new Date(sortedData[0].timestamp);
      new Date(sortedData[sortedData.length - 1].timestamp);
      const roundedStartTime = new Date(startTime);
      roundedStartTime.setSeconds(0, 0);
      if (get(bucketTime) >= 36e5) {
        roundedStartTime.setMinutes(0);
      } else if (get(bucketTime) >= 6e5) {
        const minutes = Math.floor(roundedStartTime.getMinutes() / 10) * 10;
        roundedStartTime.setMinutes(minutes);
      }
      const bucketMap = /* @__PURE__ */ new Map();
      if (get(bucketTime) <= 1e3) {
        sortedData.forEach((cp) => {
          const cpTime = new Date(cp.timestamp);
          const bucketStart = new Date(Math.floor(cpTime.getTime() / get(bucketTime)) * get(bucketTime));
          const bucketKey = bucketStart.getTime();
          if (!bucketMap.has(bucketKey)) {
            bucketMap.set(bucketKey, []);
          }
          bucketMap.get(bucketKey).push(cp);
        });
        bucketMap.forEach((checkpoints, time) => {
          const totalPTBs = checkpoints.reduce((sum, cp) => sum + cp.transactionCount, 0);
          const checkpointCount = checkpoints.length;
          let checkpointRange = "No transactions";
          if (checkpoints.length > 0) {
            const minCheckpoint = Math.min(...checkpoints.map((cp) => cp.sequenceNumber));
            const maxCheckpoint = Math.max(...checkpoints.map((cp) => cp.sequenceNumber));
            checkpointRange = minCheckpoint === maxCheckpoint ? `${minCheckpoint}` : `${minCheckpoint}-${maxCheckpoint}`;
          }
          aggregatedData.push({
            x: new Date(time),
            y: totalPTBs,
            checkpointRange,
            checkpointCount,
            averageTransactions: checkpointCount > 0 ? Math.round(totalPTBs / checkpointCount * 100) / 100 : 0
          });
        });
        aggregatedData.sort((a, b) => a.x.getTime() - b.x.getTime());
        const enhancedData = [];
        for (let i = 0; i < aggregatedData.length; i++) {
          const current = aggregatedData[i];
          enhancedData.push(current);
          if (i < aggregatedData.length - 1) {
            const next = aggregatedData[i + 1];
            const timeDiff = next.x.getTime() - current.x.getTime();
            const significantGap = get(bucketTime) * 3;
            if (timeDiff > significantGap) {
              const midTime = new Date(current.x.getTime() + Math.floor(timeDiff / 2));
              enhancedData.push({
                x: midTime,
                y: 0,
                checkpointRange: "No transactions",
                checkpointCount: 0,
                averageTransactions: 0
              });
            }
          }
        }
        aggregatedData = enhancedData;
      } else {
        sortedData.forEach((cp) => {
          const cpTime = new Date(cp.timestamp);
          const bucketStart = new Date(cpTime.getTime() - cpTime.getTime() % get(bucketTime));
          bucketStart.setSeconds(0, 0);
          if (get(bucketTime) >= 36e5) {
            bucketStart.setMinutes(0);
          } else if (get(bucketTime) >= 6e5) {
            const minutes = Math.floor(bucketStart.getMinutes() / 10) * 10;
            bucketStart.setMinutes(minutes);
          }
          const bucketKey = bucketStart.getTime();
          if (!bucketMap.has(bucketKey)) {
            bucketMap.set(bucketKey, []);
          }
          bucketMap.get(bucketKey).push(cp);
        });
        const bucketTimes = Array.from(bucketMap.keys()).sort((a, b) => a - b);
        if (bucketTimes.length > 0) {
          const firstBucket = bucketTimes[0];
          const lastBucket = bucketTimes[bucketTimes.length - 1];
          let maxGapSize;
          let fillAllBuckets = false;
          if (get(bucketTime) <= 1e4) {
            maxGapSize = get(
              bucketTime
              // Fill gaps larger than 5 buckets
            ) * 5;
          } else if (get(bucketTime) <= 6e4) {
            maxGapSize = get(
              bucketTime
              // Fill gaps larger than 10 buckets
            ) * 10;
          } else {
            maxGapSize = get(
              bucketTime
              // Fill gaps larger than 20 buckets
            ) * 20;
          }
          for (let time = firstBucket; time <= lastBucket; time += get(bucketTime)) {
            const checkpointsInBucket = bucketMap.get(time) || [];
            const totalPTBs = checkpointsInBucket.reduce((sum, cp) => sum + cp.transactionCount, 0);
            const checkpointCount = checkpointsInBucket.length;
            const hasData = checkpointCount > 0;
            const isAtBoundary = time === firstBucket || time === lastBucket;
            const nextDataBucket = bucketTimes.find((t) => t > time);
            const isSignificantGap = nextDataBucket && nextDataBucket - time > maxGapSize;
            const shouldInclude = hasData || isAtBoundary || isSignificantGap || fillAllBuckets;
            if (shouldInclude) {
              let checkpointRange = "No transactions";
              if (checkpointsInBucket.length > 0) {
                const minCheckpoint = Math.min(...checkpointsInBucket.map((cp) => cp.sequenceNumber));
                const maxCheckpoint = Math.max(...checkpointsInBucket.map((cp) => cp.sequenceNumber));
                checkpointRange = minCheckpoint === maxCheckpoint ? `${minCheckpoint}` : `${minCheckpoint}-${maxCheckpoint}`;
              }
              aggregatedData.push({
                x: new Date(time),
                y: totalPTBs,
                checkpointRange,
                checkpointCount,
                averageTransactions: checkpointCount > 0 ? Math.round(totalPTBs / checkpointCount * 100) / 100 : 0
              });
            }
          }
        }
      }
      cachedAggregatedData = aggregatedData;
      lastBucketTime = get(bucketTime);
      set(lastDataLength, checkpointData().length);
      const bucketTimeLabel2 = get(bucketTime) < 1e3 ? `${get(bucketTime)}ms` : get(bucketTime) < 6e4 ? `${get(bucketTime) / 1e3}s` : `${get(bucketTime) / 6e4}min`;
      console.log(`Aggregation optimized (${bucketTimeLabel2}): ${sortedData.length} transactions → ${aggregatedData.length} buckets`);
    }
    aggregatedData = cachedAggregatedData;
    let filteredAggregatedData;
    if (get(bucketTime) <= 1e3) {
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
          if (consecutiveZeros === 1 || consecutiveZeros % 10 === 0 || i === aggregatedData.length - 1) {
            filteredAggregatedData.push(point);
          }
        }
      }
    } else {
      const basicFiltered = [];
      for (let i = 0; i < aggregatedData.length; i++) {
        const point = aggregatedData[i];
        const isZero = point.y === 0;
        if (!isZero) {
          basicFiltered.push(point);
          basicFiltered.length - 1;
        } else {
          const isFirstZero = i === 0 || aggregatedData[i - 1].y !== 0;
          const isLastZero = i === aggregatedData.length - 1 || aggregatedData[i + 1].y !== 0;
          if (isFirstZero || isLastZero) {
            basicFiltered.push(point);
            basicFiltered.length - 1;
          }
        }
      }
      if (basicFiltered.length > 1e3) {
        filteredAggregatedData = [];
        let samplingRate;
        const dataPointsPerHour = 36e5 / get(bucketTime);
        if (dataPointsPerHour > 360) {
          samplingRate = 50;
        } else if (dataPointsPerHour > 60) {
          samplingRate = 100;
        } else {
          samplingRate = 200;
        }
        let zeroCount = 0;
        for (let i = 0; i < basicFiltered.length; i++) {
          const point = basicFiltered[i];
          const isZero = point.y === 0;
          if (!isZero) {
            filteredAggregatedData.push(point);
            zeroCount = 0;
          } else {
            const isFirstZero = i === 0 || basicFiltered[i - 1].y !== 0;
            const isLastZero = i === basicFiltered.length - 1 || basicFiltered[i + 1].y !== 0;
            const shouldKeep = isFirstZero || isLastZero || zeroCount % samplingRate === 0;
            if (shouldKeep) {
              filteredAggregatedData.push(point);
            }
            zeroCount++;
          }
        }
      } else {
        filteredAggregatedData = basicFiltered;
      }
    }
    const bucketTimeLabel = get(bucketTime) < 1e3 ? `${get(bucketTime)}ms` : get(bucketTime) < 6e4 ? `${get(bucketTime) / 1e3}s` : `${get(bucketTime) / 6e4}min`;
    if (get(bucketTime) <= 1e3) {
      console.log(`Filtering optimized (${bucketTimeLabel}): ${aggregatedData.length} → final: ${filteredAggregatedData.length} points (granular mode)`);
    } else {
      const basicFilteredLength = filteredAggregatedData.length;
      console.log(`Filtering optimized (${bucketTimeLabel}): ${aggregatedData.length} → stage1: ${basicFilteredLength} → final: ${filteredAggregatedData.length} points`);
    }
    let chartData = filteredAggregatedData;
    if (isResettingZoom || shouldResetZoom) {
      if (get(isDataFiltered) && filterState.min && filterState.max) {
        const filterStart = new Date(filterState.min);
        const filterEnd = new Date(filterState.max);
        chartData = filteredAggregatedData.filter((dataPoint) => {
          const pointTime = new Date(dataPoint.x);
          return pointTime >= filterStart && pointTime <= filterEnd;
        });
      } else {
        chartData = filteredAggregatedData;
        if (!preserveDataFilter) {
          set(isDataFiltered, false);
          set(filteredDataLength, checkpointData().length);
        }
      }
    } else if (zoomState.min && zoomState.max || get(isDataFiltered) && filterState.min && filterState.max) {
      const filterStart = new Date(zoomState.min || filterState.min);
      const filterEnd = new Date(zoomState.max || filterState.max);
      chartData = filteredAggregatedData.filter((dataPoint) => {
        const pointTime = new Date(dataPoint.x);
        return pointTime >= filterStart && pointTime <= filterEnd;
      });
      if (!preserveDataFilter) {
        const filteredCheckpoints = filterDataByZoom(checkpointData());
        set(isDataFiltered, true);
        set(filteredDataLength, filteredCheckpoints.length);
      }
    } else if (!preserveDataFilter) {
      set(isDataFiltered, false);
      set(filteredDataLength, checkpointData().length);
    }
    if (!get(chart) || needsReprocessing) {
      if (get(chart)) {
        get(chart).destroy();
      }
      const currentBucketOption = bucketOptions.find((opt) => opt.value === get(bucketTime)) || bucketOptions[0];
      set(chart, new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: `Transactions per ${currentBucketOption.displayUnit}`,
              data: chartData,
              borderColor: "#007acc",
              backgroundColor: "rgba(0, 122, 204, 0.1)",
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2.5,
          // Add explicit aspect ratio to prevent text stretching
          devicePixelRatio: window.devicePixelRatio || 1,
          // Ensure proper pixel ratio
          interaction: { intersect: false, mode: "index" },
          onClick: (event2, activeElements) => {
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
              pan: { enabled: true, mode: "x", modifierKey: "ctrl" },
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                drag: {
                  enabled: true,
                  backgroundColor: "rgba(0, 122, 204, 0.2)",
                  borderColor: "rgba(0, 122, 204, 0.8)",
                  borderWidth: 2
                },
                mode: "x",
                onZoomComplete({ chart: chart2 }) {
                  if (chart2.scales && chart2.scales.x) {
                    zoomState = { min: chart2.scales.x.min, max: chart2.scales.x.max };
                  }
                }
              }
            },
            title: {
              display: true,
              text: title(),
              font: { size: 16, weight: "bold" }
            },
            legend: { display: false },
            tooltip: {
              callbacks: {
                title(context) {
                  const dataPoint = context[0].raw;
                  return `Checkpoints: ${dataPoint.checkpointRange}`;
                },
                label(context) {
                  const dataPoint = context.raw;
                  const date = new Date(dataPoint.x);
                  return [
                    `Total Transactions: ${dataPoint.y}`,
                    `Checkpoint Count: ${dataPoint.checkpointCount}`,
                    `Average per Checkpoint: ${dataPoint.averageTransactions}`,
                    `Time: ${date.toLocaleString()}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: "time",
              display: true,
              title: { display: true, text: "Time" },
              ticks: { autoSkip: true, maxTicksLimit: 10 },
              // Only apply zoom constraints if we're not resetting zoom and have valid zoom state
              ...zoomState.min && zoomState.max && !isResettingZoom && !shouldResetZoom ? { min: zoomState.min, max: zoomState.max } : {}
            },
            y: {
              display: true,
              title: {
                display: true,
                text: `Transaction Count per ${currentBucketOption.displayUnit}`
              },
              beginAtZero: true
            }
          }
        }
      }));
    } else {
      mutate(chart, get(chart).data.datasets[0].data = chartData);
      get(
        chart
        // Use 'none' mode for fastest update
      ).update("none");
    }
  }
  onMount(() => {
    createChart(false);
    if (get(canvas) && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        if (get(chart)) {
          get(chart).resize();
        }
      });
      resizeObserver.observe(get(canvas).parentElement);
    }
  });
  onDestroy(() => {
    if (get(chart)) {
      get(chart).destroy();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
  function resetZoom() {
    isResettingZoom = true;
    zoomState = {};
    if (get(chart)) {
      get(chart).resetZoom();
    }
    createChart(true);
    setTimeout(
      () => {
        isResettingZoom = false;
      },
      100
    );
  }
  function applyDataFilter() {
    if (get(chart) && get(chart).scales && get(chart).scales.x) {
      const visibleMin = get(chart).scales.x.min;
      const visibleMax = get(chart).scales.x.max;
      zoomState = { min: visibleMin, max: visibleMax };
      filterState = { min: visibleMin, max: visibleMax };
      set(isDataFiltered, true);
      createChart(false);
    }
  }
  function clearDataFilter() {
    zoomState = {};
    filterState = {};
    set(isDataFiltered, false);
    set(filteredDataLength, checkpointData().length);
    createChart(false);
  }
  legacy_pre_effect(
    () => (deep_read_state(checkpointData()), get(lastDataLength), get(userOverrideBucketTime), get(bucketTime)),
    () => {
      if (checkpointData().length > 0) {
        const isNewData = checkpointData().length !== get(lastDataLength);
        if (isNewData) {
          set(userOverrideBucketTime, false);
          set(lastDataLength, checkpointData().length);
        }
        if (!get(userOverrideBucketTime)) {
          const newBucketTime = calculateBucketTime(checkpointData());
          if (get(bucketTime) !== newBucketTime) {
            set(bucketTime, newBucketTime);
          }
        }
      }
    }
  );
  legacy_pre_effect(
    () => (get(canvas), deep_read_state(checkpointData()), get(bucketTime)),
    () => {
      if (get(canvas) && (checkpointData().length > 0 || get(bucketTime))) {
        createChart(false);
      }
    }
  );
  legacy_pre_effect_reset();
  init();
  var div = root$1();
  var div_1 = child(div);
  var div_2 = child(div_1);
  var select = sibling(child(div_2), 2);
  each(select, 5, () => bucketOptions, index, ($$anchor2, option) => {
    var option_1 = root_1$1();
    var text2 = child(option_1);
    var option_1_value = {};
    template_effect(() => {
      set_text(text2, (get(option), untrack(() => get(option).label)));
      if (option_1_value !== (option_1_value = (get(option), untrack(() => get(option).value)))) {
        option_1.value = (option_1.__value = (get(option), untrack(() => get(option).value))) ?? "";
      }
    });
    append($$anchor2, option_1);
  });
  var select_value;
  init_select(select);
  var div_3 = sibling(div_2, 2);
  var button = child(div_3);
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var button_1 = root_2();
      event("click", button_1, applyDataFilter);
      append($$anchor2, button_1);
    };
    if_block(node, ($$render) => {
      if (get(chart), untrack(() => get(chart) && get(chart).scales && get(chart).scales.x && (get(chart).scales.x.min !== void 0 || get(chart).scales.x.max !== void 0))) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var button_2 = root_3();
      event("click", button_2, clearDataFilter);
      append($$anchor2, button_2);
    };
    if_block(node_1, ($$render) => {
      if (get(isDataFiltered)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(div_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_4 = root_4$1();
      var text_1 = sibling(child(div_4), 2);
      template_effect(() => set_text(text_1, ` Checkpoint ${get(selectedCheckpoint) ?? ""}`));
      append($$anchor2, div_4);
    };
    if_block(node_2, ($$render) => {
      if (get(selectedCheckpoint)) $$render(consequent_2);
    });
  }
  var node_3 = sibling(node_2, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_5 = root_5$1();
      var text_2 = sibling(child(div_5), 2);
      template_effect(
        ($0) => set_text(text_2, ` Showing ${get(filteredDataLength) ?? ""} of ${get(originalDataLength) ?? ""} transactions
            (${$0 ?? ""}% of total data)`),
        [
          () => (get(filteredDataLength), get(originalDataLength), untrack(() => Math.round(get(filteredDataLength) / get(originalDataLength) * 100)))
        ]
      );
      append($$anchor2, div_5);
    };
    if_block(node_3, ($$render) => {
      if (get(isDataFiltered)) $$render(consequent_3);
    });
  }
  var canvas_1 = sibling(node_3, 2);
  bind_this(canvas_1, ($$value) => set(canvas, $$value), () => get(canvas));
  template_effect(() => {
    if (select_value !== (select_value = get(bucketTime))) {
      select.value = (select.__value = get(bucketTime)) ?? "", select_option(select, get(bucketTime));
    }
  });
  event("change", select, (e) => {
    set(userOverrideBucketTime, true);
    set(bucketTime, parseInt(e.target.value));
  });
  event("click", button, resetZoom);
  append($$anchor, div);
  pop();
}
function hasPreviousCheckpoint(selectedCheckpoint, checkpointData) {
  if (!selectedCheckpoint) return false;
  const current = parseInt(selectedCheckpoint);
  return checkpointData.some((cp) => cp.transactionCount > 0 && cp.sequenceNumber < current);
}
function hasNextCheckpoint(selectedCheckpoint, checkpointData) {
  if (!selectedCheckpoint) return false;
  const current = parseInt(selectedCheckpoint);
  return checkpointData.some((cp) => cp.transactionCount > 0 && cp.sequenceNumber > current);
}
function getPreviousCheckpoint(selectedCheckpoint, checkpointData) {
  if (!selectedCheckpoint) return;
  const current = parseInt(selectedCheckpoint);
  const checkpointsWithTxs = checkpointData.filter((cp) => cp.transactionCount > 0).map((cp) => cp.sequenceNumber).sort((a, b) => a - b);
  const lower = checkpointsWithTxs.filter((num) => num < current).pop();
  return lower?.toString();
}
function getNextCheckpoint(selectedCheckpoint, checkpointData) {
  if (!selectedCheckpoint) return;
  const current = parseInt(selectedCheckpoint);
  const checkpointsWithTxs = checkpointData.filter((cp) => cp.transactionCount > 0).map((cp) => cp.sequenceNumber).sort((a, b) => a - b);
  const higher = checkpointsWithTxs.find((num) => num > current);
  return higher?.toString();
}
var root_4 = from_html(`<span class="checkpoint-count svelte-5fvkuj"> </span>`);
var root_1 = from_html(`<input id="epoch-input" type="number" placeholder="Epoch" min="0" style="width: 7rem;"/> <button class="fetch-current-epoch-btn" title="Fetch current epoch"><!></button> <!>`, 1);
var root_8 = from_html(`<span class="checkpoint-count svelte-5fvkuj"> </span>`);
var root_5 = from_html(`<input id="start-checkpoint" type="number" placeholder="Start" min="0" style="width: 8rem;"/> <span class="range-separator svelte-5fvkuj">to</span> <input id="end-checkpoint" type="number" placeholder="End" min="0" style="width: 8rem;"/> <button class="fetch-current-epoch-btn" title="Fetch current epoch range"><!></button> <!>`, 1);
var root_9 = from_html(`<div class="error"><strong>Error:</strong> </div>`);
var root_12 = from_html(`<p> </p>`);
var root_13 = from_html(`<p> </p>`);
var root_11 = from_html(`<!> <p><em> </em></p>`, 1);
var root_15 = from_html(`<p> </p>`);
var root_16 = from_html(`<p> </p>`);
var root_14 = from_html(`<!> <p><em>This may take a while for large ranges with many transactions.</em></p>`, 1);
var root_18 = from_html(`<div class="progress-section svelte-5fvkuj"><div class="progress-label svelte-5fvkuj"><span> </span> <span class="progress-percentage svelte-5fvkuj"> </span></div> <div class="progress-bar svelte-5fvkuj"><div class="progress-fill svelte-5fvkuj"></div></div></div>`);
var root_17 = from_html(`<div class="progress-info svelte-5fvkuj"><div class="progress-header svelte-5fvkuj"><p class="svelte-5fvkuj"><strong>Progress:</strong> </p> <button class="stop-btn svelte-5fvkuj" title="Stop fetching data"> </button></div> <!></div>`);
var root_10 = from_html(`<div class="loading"><!> <!></div>`);
var root_20 = from_html(`<h3> </h3>`);
var root_21 = from_html(`<h3> </h3>`);
var root_22 = from_html(`<div class="checkpoint-info"><p><strong>Checkpoint Range:</strong> </p></div>`);
var root_24 = from_html(`<div class="transaction-id-item svelte-5fvkuj"><a target="_blank" rel="noopener noreferrer" class="tx-id link-style svelte-5fvkuj"> </a> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy transaction ID">📋</button></div>`);
var root_23 = from_html(`<div class="function-item svelte-5fvkuj"><div class="function-header svelte-5fvkuj"><div class="function-signature svelte-5fvkuj"><div class="function-parts svelte-5fvkuj"><a target="_blank" rel="noopener noreferrer" class="package-id link-style svelte-5fvkuj"> </a><span class="separator svelte-5fvkuj">::</span><span class="module svelte-5fvkuj"> </span><span class="separator svelte-5fvkuj">::</span><span class="function-name svelte-5fvkuj"> </span> <button class="copy-btn svelte-5fvkuj" style="padding: 4px 8px; font-size: 13px;" title="Copy full function signature">📋</button></div> <div class="function-actions svelte-5fvkuj"><details class="svelte-5fvkuj"><summary class="svelte-5fvkuj">Txs</summary></details></div></div> <div class="function-stats svelte-5fvkuj"><div class="call-count svelte-5fvkuj"><span class="count-label">Calls:</span> <span class="count-value"> </span></div> <div class="tx-count svelte-5fvkuj"><span class="count-label">Txs:</span> <span class="count-value"> </span></div></div></div> <div class="transaction-ids-section svelte-5fvkuj"><div class="transaction-ids-list svelte-5fvkuj"></div></div></div>`);
var root_25 = from_html(`<div class="address-item svelte-5fvkuj"><div class="address-header svelte-5fvkuj"><div class="address-left svelte-5fvkuj"><div class="address-info svelte-5fvkuj"><a target="_blank" rel="noopener noreferrer" class="link-style svelte-5fvkuj"> </a></div> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy address">📋</button></div> <div class="address-stats svelte-5fvkuj"><div class="tx-count svelte-5fvkuj"><span class="count-label">TXs:</span> <span class="count-value"> </span></div></div></div></div>`);
var root_26 = from_html(`<div class="address-item svelte-5fvkuj"><div class="address-header svelte-5fvkuj"><div class="address-left svelte-5fvkuj"><div class="address-info svelte-5fvkuj"><a target="_blank" rel="noopener noreferrer" class="link-style svelte-5fvkuj"> </a></div> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy address">📋</button></div> <div class="address-stats svelte-5fvkuj"><div class="call-count svelte-5fvkuj"><span class="count-label">Calls:</span> <span class="count-value"> </span></div></div></div></div>`);
var root_29 = from_html(`<span class="module-name svelte-5fvkuj"> </span>`);
var root_28 = from_html(`<div class="modules-row svelte-5fvkuj"><span class="modules-label svelte-5fvkuj">Modules:</span> <div class="modules-list svelte-5fvkuj"></div></div>`);
var root_27 = from_html(`<div class="package-item svelte-5fvkuj"><div class="package-left svelte-5fvkuj"><div class="package-header svelte-5fvkuj"><div class="package-info svelte-5fvkuj"><div class="package-id-row svelte-5fvkuj"><span class="package-label svelte-5fvkuj">Package:</span> <a target="_blank" rel="noopener noreferrer" class="package-id link-style svelte-5fvkuj"> </a> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy package ID">📋</button></div> <!> <div class="sender-row svelte-5fvkuj"><span class="sender-label svelte-5fvkuj">Sender:</span> <a target="_blank" rel="noopener noreferrer" class="sender-address link-style svelte-5fvkuj"> </a> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy sender address">📋</button></div></div></div></div> <div class="package-meta svelte-5fvkuj"><div class="version-info"><span class="version-label"> </span></div> <a target="_blank" rel="noopener noreferrer" class="copy-btn tx-btn link-style svelte-5fvkuj">TX</a></div></div>`);
var root_32 = from_html(`<div class="transaction-id-item svelte-5fvkuj"><a target="_blank" rel="noopener noreferrer" class="tx-id link-style svelte-5fvkuj"> </a> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy transaction ID">📋</button></div>`);
var root_31 = from_html(`<div class="function-item svelte-5fvkuj"><div class="function-header svelte-5fvkuj"><div class="function-signature svelte-5fvkuj"><div class="address-left svelte-5fvkuj"><div class="address-info svelte-5fvkuj"><span> </span></div> <button class="copy-btn" style="padding: 4px 8px; align-self: center;" title="Copy command type">📋</button></div> <div class="function-actions svelte-5fvkuj"><details class="svelte-5fvkuj"><summary class="svelte-5fvkuj">Txs</summary></details></div> <div class="address-stats svelte-5fvkuj"><div class="call-count svelte-5fvkuj"><span class="count-label">Count:</span> <span class="count-value"> </span></div></div></div></div> <div class="transaction-ids-section svelte-5fvkuj"><div class="transaction-ids-list svelte-5fvkuj"></div></div></div>`);
var root_34 = from_html(`<button class="clear-checkpoint-btn" title="Clear checkpoint selection">✕</button>`);
var root_35 = from_html(`<div class="checkpoint-loading svelte-5fvkuj"><p> </p></div>`);
var root_38 = from_html(`<span class="transaction-digest svelte-5fvkuj"> </span>`);
var root_39 = from_html(`<span class="transaction-digest svelte-5fvkuj"> </span>`);
var root_40 = from_html(`<span> </span>`);
var root_37 = from_html(`<details class="transaction-details svelte-5fvkuj"><summary class="transaction-summary svelte-5fvkuj"><span class="transaction-number svelte-5fvkuj"></span> <!> <!></summary> <div class="transaction-content svelte-5fvkuj"><!></div></details>`);
var root_36 = from_html(`<div class="checkpoint-transactions"><div class="transaction-list svelte-5fvkuj"></div></div>`);
var root_41 = from_html(`<div class="no-transactions svelte-5fvkuj"><p> </p></div>`);
var root_42 = from_html(`<div class="checkpoint-placeholder svelte-5fvkuj"><p>Click on a data point in the chart above or enter a checkpoint
                                number to inspect its transactions</p></div>`);
var root_33 = from_html(`<!> <div class="checkpoint-inspector svelte-5fvkuj"><h4 class="svelte-5fvkuj">Checkpoint Inspector</h4> <div class="checkpoint-input-section svelte-5fvkuj"><label for="checkpoint-input" class="svelte-5fvkuj">Checkpoint Number:</label> <div class="checkpoint-input-container svelte-5fvkuj"><button class="svelte-5fvkuj">&lt;</button> <input id="checkpoint-input" type="number" placeholder="Enter checkpoint number or click on chart" min="0" style="width: 8rem;" class="svelte-5fvkuj"/> <button class="svelte-5fvkuj">&gt;</button></div> <!> <div class="checkpoint-filter-row" style="margin-top: 10px; display: flex; align-items: center; gap: 8px;"><input id="checkpoint-filter-input" type="text" placeholder="Filter transactions by substring (JSON)" style="width: 18rem; font-size: 12px;" class="svelte-5fvkuj"/> <button class="example-btn svelte-5fvkuj" title="Insert example substring">Example</button> <button class="fetch-current-epoch-btn" title="Filter transactions by substring">Filter</button></div> <h5> </h5></div> <!></div>`, 1);
var root_19 = from_html(`<div class="results"><!> <!> <div class="summary-cards svelte-5fvkuj"><div class="summary-card svelte-5fvkuj"><h4 class="svelte-5fvkuj">Total PTBs</h4> <div class="metric svelte-5fvkuj"> </div> </div> <div class="summary-card svelte-5fvkuj"><h4 class="svelte-5fvkuj">Unique Senders</h4> <div class="metric svelte-5fvkuj"> </div></div> <div class="summary-card svelte-5fvkuj"><h4 class="svelte-5fvkuj">Called Functions</h4> <div class="metric svelte-5fvkuj"> </div></div> <div class="summary-card svelte-5fvkuj"><h4 class="svelte-5fvkuj">Published Packages</h4> <div class="metric svelte-5fvkuj"> </div></div></div> <div class="details-section svelte-5fvkuj"><details class="svelte-5fvkuj"><summary class="svelte-5fvkuj"> </summary> <div class="function-list svelte-5fvkuj"></div></details> <details class="svelte-5fvkuj"><summary class="svelte-5fvkuj"> </summary> <div class="address-list svelte-5fvkuj"></div></details> <details class="svelte-5fvkuj"><summary class="svelte-5fvkuj"> </summary> <div class="address-list svelte-5fvkuj"></div></details> <details class="svelte-5fvkuj"><summary class="svelte-5fvkuj"> </summary> <div class="package-list svelte-5fvkuj"></div></details> <details class="svelte-5fvkuj"><summary class="svelte-5fvkuj"> </summary> <div class="command-type-list"><!></div></details></div> <!></div>`);
var root = from_html(`<div class="epoch-transaction-blocks svelte-5fvkuj"><p style="margin-top:0;">Query programmable transaction blocks data for a specific epoch or checkpoint range</p> <div class="input-section svelte-5fvkuj"><div class="filter-section svelte-5fvkuj"><div class="filter-row svelte-5fvkuj"><div class="filter-group svelte-5fvkuj"><label for="input-object-filter" class="svelte-5fvkuj">Input Object:</label> <div class="input-with-button svelte-5fvkuj"><input id="input-object-filter" type="text" placeholder="0x... object ID" class="wide-input svelte-5fvkuj"/> <button class="example-btn svelte-5fvkuj" title="Insert example object ID">Example</button></div></div> <div class="filter-group svelte-5fvkuj"><label for="function-filter" class="svelte-5fvkuj">Function:</label> <div class="input-with-button svelte-5fvkuj"><input id="function-filter" type="text" placeholder="package::module::function" class="wide-input svelte-5fvkuj"/> <button class="example-btn svelte-5fvkuj" title="Insert example function">Example</button></div></div></div></div> <div class="input-row-single svelte-5fvkuj"><div class="mode-selection-column svelte-5fvkuj"><label class="mode-option-stacked svelte-5fvkuj"><span class="mode-label-stacked svelte-5fvkuj">Epoch Number</span> <input type="radio" class="svelte-5fvkuj"/></label> <label class="mode-option-stacked svelte-5fvkuj"><span class="mode-label-stacked svelte-5fvkuj">Checkpoint Range</span> <input type="radio" class="svelte-5fvkuj"/></label></div> <div class="input-controls svelte-5fvkuj"><!></div></div> <div class="button-row svelte-5fvkuj"><button> </button> <div class="input-group svelte-5fvkuj"><label for="transaction-limit">Limit to:</label> <input id="transaction-limit" type="number" placeholder="Max transactions" min="1" style="width: 6rem;"/></div> <button> </button></div></div> <!> <!> <!></div>`);
function PTBs($$anchor, $$props) {
  push($$props, false);
  const epochCheckpointCount = mutable_source();
  const checkpointRangeCount = mutable_source();
  const binding_group = [];
  let epoch = mutable_source("");
  let startCheckpoint = mutable_source("");
  let endCheckpoint = mutable_source("");
  let transactionLimit = mutable_source(10);
  let inputObjectFilter = mutable_source("");
  let functionFilter = mutable_source("");
  let loading = mutable_source(false);
  let epochLoading = mutable_source(false);
  let error = mutable_source("");
  let inputMode = mutable_source(
    "epoch"
    // Track which input mode is selected
  );
  let isLimitedQuery = mutable_source(false);
  let processedTransactions = mutable_source(0);
  let processedCheckpoints = mutable_source(0);
  let totalCheckpoints = mutable_source(0);
  let selectedCheckpoint = mutable_source("");
  let checkpointTransactions = mutable_source([]);
  let loadingCheckpointTransactions = mutable_source(false);
  let stopRequested = mutable_source(
    false
    // Track if user requested to stop fetching
  );
  let checkpointFilterSubstring = mutable_source("");
  let filteredCheckpointTransactions = mutable_source([]);
  function filterCheckpointTransactions() {
    if (!get(checkpointFilterSubstring)) {
      set(filteredCheckpointTransactions, []);
      return;
    }
    const substr = get(checkpointFilterSubstring).toLowerCase();
    let allTxs = [];
    if (get(displayData).transactionsByCheckpoint && get(displayData).transactionsByCheckpoint.size > 0) {
      for (const txArr of get(displayData).transactionsByCheckpoint.values()) {
        if (Array.isArray(txArr)) allTxs = allTxs.concat(txArr);
      }
    } else {
      allTxs = get(checkpointTransactions);
    }
    set(filteredCheckpointTransactions, allTxs.filter((tx) => {
      try {
        return JSON.stringify(tx).toLowerCase().includes(substr);
      } catch {
        return false;
      }
    }));
  }
  let displayData = mutable_source({
    totalPTBs: 0,
    failedPTBs: 0,
    uniqueSendersCount: 0,
    calledPackagesCount: 0,
    calledFunctionsCount: 0,
    publishedPackagesCount: 0,
    uniqueSendersList: [],
    calledPackagesList: [],
    calledFunctionsList: [],
    publishedPackagesList: [],
    commandTypeStats: [],
    checkpointRange: null,
    checkpointData: [],
    transactionsByCheckpoint: /* @__PURE__ */ new Map()
  });
  const analyzer = new EpochPTBAnalyzer();
  async function getCurrentEpoch() {
    try {
      set(epochLoading, true);
      const currentEpochId = await analyzer.getCurrentEpoch();
      if (currentEpochId) {
        set(epoch, currentEpochId);
        console.log("Current epoch:", currentEpochId);
        try {
          const range = await analyzer.getCheckpointRangeForEpoch(parseInt(currentEpochId));
          if (range) {
            set(displayData, { ...get(displayData), checkpointRange: range });
            console.log("Current epoch checkpoint range:", range);
          }
        } catch (rangeErr) {
          console.error("Error fetching checkpoint range for current epoch:", rangeErr);
        }
      } else {
        set(epoch, "223");
      }
    } catch (err) {
      console.error("Error fetching current epoch:", err);
      set(epoch, "223");
    } finally {
      set(epochLoading, false);
    }
  }
  async function getCurrentEpochRange() {
    try {
      set(epochLoading, true);
      const currentEpochId = await analyzer.getCurrentEpoch();
      if (currentEpochId) {
        const range = await analyzer.getCheckpointRangeForEpoch(parseInt(currentEpochId));
        if (range) {
          set(startCheckpoint, range.first.toString());
          set(endCheckpoint, range.last.toString());
          console.log("Current epoch checkpoint range:", range);
        }
      }
    } catch (err) {
      console.error("Error fetching current epoch range:", err);
      set(startCheckpoint, "");
      set(endCheckpoint, "");
    } finally {
      set(epochLoading, false);
    }
  }
  onMount(() => {
    getCurrentEpoch();
  });
  function stopFetching() {
    set(stopRequested, true);
    analyzer.requestStop();
  }
  async function fetchEpochTransactionBlocks() {
    if (get(inputMode) === "epoch") {
      if (!get(epoch) || get(epoch).toString().trim() === "") {
        set(error, "Please enter an epoch number");
        return;
      }
    } else {
      if (!get(startCheckpoint) || !get(endCheckpoint) || get(startCheckpoint).toString().trim() === "" || get(endCheckpoint).toString().trim() === "") {
        set(error, "Please enter both start and end checkpoint numbers");
        return;
      }
    }
    const hasEpoch = get(inputMode) === "epoch" && get(epoch) && get(epoch).toString().trim() !== "";
    const hasCheckpointRange = get(inputMode) === "checkpoint" && get(startCheckpoint).toString().trim() !== "" && get(endCheckpoint).toString().trim() !== "";
    set(loading, true);
    set(isLimitedQuery, false);
    set(stopRequested, false);
    set(error, "");
    set(processedTransactions, 0);
    set(processedCheckpoints, 0);
    set(totalCheckpoints, 0);
    set(selectedCheckpoint, "");
    set(checkpointTransactions, []);
    set(displayData, {
      totalPTBs: 0,
      failedPTBs: 0,
      uniqueSendersCount: 0,
      calledPackagesCount: 0,
      calledFunctionsCount: 0,
      publishedPackagesCount: 0,
      uniqueSendersList: [],
      calledPackagesList: [],
      calledFunctionsList: [],
      publishedPackagesList: [],
      commandTypeStats: [],
      checkpointRange: null,
      checkpointData: [],
      transactionsByCheckpoint: /* @__PURE__ */ new Map()
    });
    try {
      await analyzer.fetchAllTransactionBlocks(
        hasEpoch ? get(epoch) : void 0,
        hasCheckpointRange ? get(startCheckpoint) : void 0,
        hasCheckpointRange ? get(endCheckpoint) : void 0,
        (data, complete, processed, processedCp, totalCp) => {
          set(displayData, data);
          set(processedTransactions, processed);
          set(processedCheckpoints, processedCp);
          set(totalCheckpoints, totalCp);
          if (hasEpoch && data.checkpointRange) {
            set(startCheckpoint, data.checkpointRange.first.toString());
            set(endCheckpoint, data.checkpointRange.last.toString());
          }
          if (complete && data.checkpointData.length > 0 && !get(selectedCheckpoint)) {
            const firstCheckpointWithTxs = data.checkpointData.find((cp) => cp.transactionCount > 0);
            if (firstCheckpointWithTxs) {
              set(selectedCheckpoint, firstCheckpointWithTxs.sequenceNumber.toString());
              fetchCheckpointTransactions(get(selectedCheckpoint));
            }
          }
        },
        get(inputObjectFilter) || void 0,
        get(functionFilter) || void 0
      );
    } catch (err) {
      if (get(stopRequested)) {
        console.log("Fetch stopped by user request");
      } else {
        set(error, err.toString());
        console.error("Error fetching epoch transaction blocks:", err);
      }
    } finally {
      set(loading, false);
      set(
        stopRequested,
        false
        // Reset stop flag when done
      );
    }
  }
  async function fetchLimitedTransactionBlocks() {
    if (get(inputMode) === "epoch") {
      if (!get(epoch) || get(epoch).toString().trim() === "") {
        set(error, "Please enter an epoch number");
        return;
      }
    } else {
      if (!get(startCheckpoint) || !get(endCheckpoint) || get(startCheckpoint).toString().trim() === "" || get(endCheckpoint).toString().trim() === "") {
        set(error, "Please enter both start and end checkpoint numbers");
        return;
      }
    }
    const hasEpoch = get(inputMode) === "epoch" && get(epoch) && get(epoch).toString().trim() !== "";
    const hasCheckpointRange = get(inputMode) === "checkpoint" && get(startCheckpoint).toString().trim() !== "" && get(endCheckpoint).toString().trim() !== "";
    set(loading, true);
    set(isLimitedQuery, true);
    set(stopRequested, false);
    set(error, "");
    set(processedTransactions, 0);
    set(processedCheckpoints, 0);
    set(totalCheckpoints, 0);
    set(selectedCheckpoint, "");
    set(checkpointTransactions, []);
    set(displayData, {
      totalPTBs: 0,
      failedPTBs: 0,
      uniqueSendersCount: 0,
      calledPackagesCount: 0,
      calledFunctionsCount: 0,
      publishedPackagesCount: 0,
      uniqueSendersList: [],
      calledPackagesList: [],
      calledFunctionsList: [],
      publishedPackagesList: [],
      commandTypeStats: [],
      checkpointRange: null,
      checkpointData: [],
      transactionsByCheckpoint: /* @__PURE__ */ new Map()
    });
    try {
      await analyzer.fetchLimitedTransactionBlocks(
        get(transactionLimit),
        hasEpoch ? get(epoch) : void 0,
        hasCheckpointRange ? get(startCheckpoint) : void 0,
        hasCheckpointRange ? get(endCheckpoint) : void 0,
        (data, complete, processed, processedCp, totalCp) => {
          set(displayData, data);
          set(processedTransactions, processed);
          set(processedCheckpoints, processedCp);
          set(totalCheckpoints, totalCp);
          if (hasEpoch && data.checkpointRange) {
            set(startCheckpoint, data.checkpointRange.first.toString());
            set(endCheckpoint, data.checkpointRange.last.toString());
          }
          if (complete && data.checkpointData.length > 0 && !get(selectedCheckpoint)) {
            const firstCheckpointWithTxs = data.checkpointData.find((cp) => cp.transactionCount > 0);
            if (firstCheckpointWithTxs) {
              set(selectedCheckpoint, firstCheckpointWithTxs.sequenceNumber.toString());
              fetchCheckpointTransactions(get(selectedCheckpoint));
            }
          }
        },
        get(inputObjectFilter) || void 0,
        get(functionFilter) || void 0
      );
    } catch (err) {
      if (get(stopRequested)) {
        console.log("Limited fetch stopped by user request");
      } else {
        set(error, err.toString());
        console.error("Error fetching limited epoch transaction blocks:", err);
      }
    } finally {
      set(loading, false);
      set(
        stopRequested,
        false
        // Reset stop flag when done
      );
    }
  }
  function handleCheckpointSelection(checkpoint) {
    set(selectedCheckpoint, checkpoint);
    fetchCheckpointTransactions(get(selectedCheckpoint));
  }
  function fetchCheckpointTransactions(checkpoint) {
    if (!checkpoint || checkpoint.trim() === "") {
      set(checkpointTransactions, []);
      set(filteredCheckpointTransactions, []);
      return;
    }
    set(loadingCheckpointTransactions, true);
    try {
      const transactions = analyzer.getCheckpointTransactions(checkpoint, get(displayData));
      set(checkpointTransactions, transactions || []);
      set(filteredCheckpointTransactions, []);
      set(checkpointFilterSubstring, "");
    } catch (err) {
      console.error("Error fetching checkpoint transactions:", err);
      set(checkpointTransactions, []);
      set(filteredCheckpointTransactions, []);
    } finally {
      set(loadingCheckpointTransactions, false);
    }
  }
  function onCheckpointInputChange() {
    const checkpointStr = String(get(selectedCheckpoint) || "").trim();
    if (checkpointStr !== "") {
      fetchCheckpointTransactions(checkpointStr);
    } else {
      set(checkpointTransactions, []);
      set(filteredCheckpointTransactions, []);
      set(checkpointFilterSubstring, "");
    }
  }
  function previousCheckpoint() {
    const prev = getPreviousCheckpoint(get(selectedCheckpoint), get(displayData).checkpointData);
    if (prev !== void 0) {
      set(selectedCheckpoint, prev);
      fetchCheckpointTransactions(get(selectedCheckpoint));
    }
  }
  function nextCheckpoint() {
    const next = getNextCheckpoint(get(selectedCheckpoint), get(displayData).checkpointData);
    if (next !== void 0) {
      set(selectedCheckpoint, next);
      fetchCheckpointTransactions(get(selectedCheckpoint));
    }
  }
  function toggleTransactionIds(event2) {
    const detailsElement = event2.target;
    const functionItem = detailsElement.parentElement.parentElement.parentElement.parentElement;
    const transactionSection = functionItem?.querySelector(".transaction-ids-section");
    if (transactionSection) {
      if (detailsElement.open) {
        transactionSection.classList.add("show");
      } else {
        transactionSection.classList.remove("show");
      }
    }
  }
  legacy_pre_effect(() => get(inputMode), () => {
    if (get(inputMode) === "epoch") {
      set(startCheckpoint, "");
      set(endCheckpoint, "");
    } else if (get(inputMode) === "checkpoint") {
      set(epoch, "");
    }
  });
  legacy_pre_effect(() => (get(epoch), get(displayData)), () => {
    set(epochCheckpointCount, get(epoch) && get(epoch).toString().trim() !== "" && get(displayData).checkpointRange ? get(displayData).checkpointRange.last - get(displayData).checkpointRange.first + 1 : null);
  });
  legacy_pre_effect(() => (get(startCheckpoint), get(endCheckpoint)), () => {
    set(checkpointRangeCount, get(startCheckpoint) && get(endCheckpoint) && get(startCheckpoint).toString().trim() !== "" && get(endCheckpoint).toString().trim() !== "" ? parseInt(get(endCheckpoint)) - parseInt(get(startCheckpoint)) + 1 : null);
  });
  legacy_pre_effect_reset();
  init();
  var div = root();
  var div_1 = sibling(child(div), 2);
  var div_2 = child(div_1);
  var div_3 = child(div_2);
  var div_4 = child(div_3);
  var div_5 = sibling(child(div_4), 2);
  var input = child(div_5);
  var button = sibling(input, 2);
  var div_6 = sibling(div_4, 2);
  var div_7 = sibling(child(div_6), 2);
  var input_1 = child(div_7);
  var button_1 = sibling(input_1, 2);
  var div_8 = sibling(div_2, 2);
  var div_9 = child(div_8);
  var label = child(div_9);
  var input_2 = sibling(child(label), 2);
  input_2.value = input_2.__value = "epoch";
  var label_1 = sibling(label, 2);
  var input_3 = sibling(child(label_1), 2);
  input_3.value = input_3.__value = "checkpoint";
  var div_10 = sibling(div_9, 2);
  var node = child(div_10);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment = root_1();
      var input_4 = first_child(fragment);
      var button_2 = sibling(input_4, 2);
      var node_1 = child(button_2);
      {
        var consequent = ($$anchor3) => {
          var text$1 = text("Loading...");
          append($$anchor3, text$1);
        };
        var alternate = ($$anchor3) => {
          var text_1 = text("Get Current");
          append($$anchor3, text_1);
        };
        if_block(node_1, ($$render) => {
          if (get(epochLoading)) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      var node_2 = sibling(button_2, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var span = root_4();
          var text_2 = child(span);
          template_effect(($0) => set_text(text_2, `(${$0 ?? ""} checkpoints)`), [
            () => (get(epochCheckpointCount), untrack(() => get(epochCheckpointCount).toLocaleString()))
          ]);
          append($$anchor3, span);
        };
        if_block(node_2, ($$render) => {
          if (get(epochCheckpointCount)) $$render(consequent_1);
        });
      }
      template_effect(() => {
        input_4.disabled = get(loading) || get(epochLoading);
        button_2.disabled = get(loading) || get(epochLoading);
      });
      bind_value(input_4, () => get(epoch), ($$value) => set(epoch, $$value));
      event("click", button_2, getCurrentEpoch);
      append($$anchor2, fragment);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_1 = root_5();
      var input_5 = first_child(fragment_1);
      var input_6 = sibling(input_5, 4);
      var button_3 = sibling(input_6, 2);
      var node_3 = child(button_3);
      {
        var consequent_3 = ($$anchor3) => {
          var text_3 = text("Loading...");
          append($$anchor3, text_3);
        };
        var alternate_1 = ($$anchor3) => {
          var text_4 = text("Get Current");
          append($$anchor3, text_4);
        };
        if_block(node_3, ($$render) => {
          if (get(epochLoading)) $$render(consequent_3);
          else $$render(alternate_1, false);
        });
      }
      var node_4 = sibling(button_3, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var span_1 = root_8();
          var text_5 = child(span_1);
          template_effect(($0) => set_text(text_5, `(${$0 ?? ""} checkpoints)`), [
            () => (get(checkpointRangeCount), untrack(() => get(checkpointRangeCount).toLocaleString()))
          ]);
          append($$anchor3, span_1);
        };
        if_block(node_4, ($$render) => {
          if (get(checkpointRangeCount) && get(checkpointRangeCount) > 0) $$render(consequent_4);
        });
      }
      template_effect(() => {
        input_5.disabled = get(loading);
        input_6.disabled = get(loading);
        button_3.disabled = get(loading) || get(epochLoading);
      });
      bind_value(input_5, () => get(startCheckpoint), ($$value) => set(startCheckpoint, $$value));
      bind_value(input_6, () => get(endCheckpoint), ($$value) => set(endCheckpoint, $$value));
      event("click", button_3, getCurrentEpochRange);
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (get(inputMode) === "epoch") $$render(consequent_2);
      else $$render(alternate_2, false);
    });
  }
  var div_11 = sibling(div_8, 2);
  var button_4 = child(div_11);
  var text_6 = child(button_4);
  var div_12 = sibling(button_4, 2);
  var input_7 = sibling(child(div_12), 2);
  var button_5 = sibling(div_12, 2);
  var text_7 = child(button_5);
  var node_5 = sibling(div_1, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_13 = root_9();
      var text_8 = sibling(child(div_13));
      template_effect(() => set_text(text_8, ` ${get(error) ?? ""}`));
      append($$anchor2, div_13);
    };
    if_block(node_5, ($$render) => {
      if (get(error)) $$render(consequent_5);
    });
  }
  var node_6 = sibling(node_5, 2);
  {
    var consequent_11 = ($$anchor2) => {
      var div_14 = root_10();
      var node_7 = child(div_14);
      {
        var consequent_7 = ($$anchor3) => {
          var fragment_2 = root_11();
          var node_8 = first_child(fragment_2);
          {
            var consequent_6 = ($$anchor4) => {
              var p = root_12();
              var text_9 = child(p);
              template_effect(() => set_text(text_9, `Fetching up to ${get(transactionLimit) ?? ""} transaction blocks for epoch ${get(epoch) ?? ""}...`));
              append($$anchor4, p);
            };
            var alternate_3 = ($$anchor4) => {
              var p_1 = root_13();
              var text_10 = child(p_1);
              template_effect(() => set_text(text_10, `Fetching up to ${get(transactionLimit) ?? ""} transaction blocks for checkpoint range ${get(startCheckpoint) ?? ""}
                        - ${get(endCheckpoint) ?? ""}...`));
              append($$anchor4, p_1);
            };
            if_block(node_8, ($$render) => {
              if (get(inputMode) === "epoch") $$render(consequent_6);
              else $$render(alternate_3, false);
            });
          }
          var p_2 = sibling(node_8, 2);
          var em = child(p_2);
          var text_11 = child(em);
          template_effect(() => set_text(text_11, `This query will stop after finding ${get(transactionLimit) ?? ""} transactions.`));
          append($$anchor3, fragment_2);
        };
        var alternate_5 = ($$anchor3) => {
          var fragment_3 = root_14();
          var node_9 = first_child(fragment_3);
          {
            var consequent_8 = ($$anchor4) => {
              var p_3 = root_15();
              var text_12 = child(p_3);
              template_effect(() => set_text(text_12, `Fetching all transaction blocks for epoch ${get(epoch) ?? ""}...`));
              append($$anchor4, p_3);
            };
            var alternate_4 = ($$anchor4) => {
              var p_4 = root_16();
              var text_13 = child(p_4);
              template_effect(() => set_text(text_13, `Fetching all transaction blocks for checkpoint range ${get(startCheckpoint) ?? ""} - ${get(endCheckpoint) ?? ""}...`));
              append($$anchor4, p_4);
            };
            if_block(node_9, ($$render) => {
              if (get(inputMode) === "epoch") $$render(consequent_8);
              else $$render(alternate_4, false);
            });
          }
          append($$anchor3, fragment_3);
        };
        if_block(node_7, ($$render) => {
          if (get(isLimitedQuery)) $$render(consequent_7);
          else $$render(alternate_5, false);
        });
      }
      var node_10 = sibling(node_7, 2);
      {
        var consequent_10 = ($$anchor3) => {
          var div_15 = root_17();
          var div_16 = child(div_15);
          var p_5 = child(div_16);
          var text_14 = sibling(child(p_5));
          var button_6 = sibling(p_5, 2);
          var text_15 = child(button_6);
          var node_11 = sibling(div_16, 2);
          {
            var consequent_9 = ($$anchor4) => {
              var div_17 = root_18();
              var div_18 = child(div_17);
              var span_2 = child(div_18);
              var text_16 = child(span_2);
              var span_3 = sibling(span_2, 2);
              var text_17 = child(span_3);
              var div_19 = sibling(div_18, 2);
              var div_20 = child(div_19);
              template_effect(
                ($0, $1, $2, $3) => {
                  set_text(text_16, `Checkpoints: ${$0 ?? ""} / ${$1 ?? ""}`);
                  set_text(text_17, `${$2 ?? ""}%`);
                  set_style(div_20, `width: ${$3 ?? ""}%`);
                },
                [
                  () => (get(processedCheckpoints), untrack(() => get(processedCheckpoints).toLocaleString())),
                  () => (get(totalCheckpoints), untrack(() => get(totalCheckpoints).toLocaleString())),
                  () => (get(processedCheckpoints), get(totalCheckpoints), untrack(() => Math.round(get(processedCheckpoints) / get(totalCheckpoints) * 100))),
                  () => (get(processedCheckpoints), get(totalCheckpoints), untrack(() => Math.round(get(processedCheckpoints) / get(totalCheckpoints) * 100)))
                ]
              );
              append($$anchor4, div_17);
            };
            if_block(node_11, ($$render) => {
              if (get(totalCheckpoints) > 0) $$render(consequent_9);
            });
          }
          template_effect(
            ($0) => {
              set_text(text_14, ` ${$0 ?? ""} transactions processed`);
              button_6.disabled = get(stopRequested);
              set_text(text_15, get(stopRequested) ? "Stopping..." : "Stop");
            },
            [
              () => (get(processedTransactions), untrack(() => get(processedTransactions).toLocaleString()))
            ]
          );
          event("click", button_6, stopFetching);
          append($$anchor3, div_15);
        };
        if_block(node_10, ($$render) => {
          if (get(processedTransactions) > 0) $$render(consequent_10);
        });
      }
      append($$anchor2, div_14);
    };
    if_block(node_6, ($$render) => {
      if (get(loading)) $$render(consequent_11);
    });
  }
  var node_12 = sibling(node_6, 2);
  {
    var consequent_24 = ($$anchor2) => {
      var div_21 = root_19();
      var node_13 = child(div_21);
      {
        var consequent_12 = ($$anchor3) => {
          var h3 = root_20();
          var text_18 = child(h3);
          template_effect(() => set_text(text_18, `Epoch ${get(epoch) ?? ""} Summary`));
          append($$anchor3, h3);
        };
        var alternate_6 = ($$anchor3) => {
          var h3_1 = root_21();
          var text_19 = child(h3_1);
          template_effect(() => set_text(text_19, `Checkpoint Range ${get(startCheckpoint) ?? ""} - ${get(endCheckpoint) ?? ""} Summary`));
          append($$anchor3, h3_1);
        };
        if_block(node_13, ($$render) => {
          if (get(inputMode) === "epoch") $$render(consequent_12);
          else $$render(alternate_6, false);
        });
      }
      var node_14 = sibling(node_13, 2);
      {
        var consequent_13 = ($$anchor3) => {
          var div_22 = root_22();
          var p_6 = child(div_22);
          var text_20 = sibling(child(p_6));
          template_effect(
            ($0, $1, $2) => set_text(text_20, ` ${$0 ?? ""} - ${$1 ?? ""},
                        total: ${$2 ?? ""} checkpoints`),
            [
              () => (get(displayData), untrack(() => get(displayData).checkpointRange.first.toLocaleString())),
              () => (get(displayData), untrack(() => get(displayData).checkpointRange.last.toLocaleString())),
              () => (get(displayData), untrack(() => (get(displayData).checkpointRange.last - get(displayData).checkpointRange.first + 1).toLocaleString()))
            ]
          );
          append($$anchor3, div_22);
        };
        if_block(node_14, ($$render) => {
          if (get(displayData), untrack(() => get(displayData).checkpointRange)) $$render(consequent_13);
        });
      }
      var div_23 = sibling(node_14, 2);
      var div_24 = child(div_23);
      var div_25 = sibling(child(div_24), 2);
      var text_21 = child(div_25);
      var text_22 = sibling(div_25);
      var div_26 = sibling(div_24, 2);
      var div_27 = sibling(child(div_26), 2);
      var text_23 = child(div_27);
      var div_28 = sibling(div_26, 2);
      var div_29 = sibling(child(div_28), 2);
      var text_24 = child(div_29);
      var div_30 = sibling(div_28, 2);
      var div_31 = sibling(child(div_30), 2);
      var text_25 = child(div_31);
      var div_32 = sibling(div_23, 2);
      var details = child(div_32);
      var summary = child(details);
      var text_26 = child(summary);
      var div_33 = sibling(summary, 2);
      each(
        div_33,
        5,
        () => (get(displayData), untrack(() => get(displayData).calledFunctionsList)),
        index,
        ($$anchor3, func) => {
          var div_34 = root_23();
          var div_35 = child(div_34);
          var div_36 = child(div_35);
          var div_37 = child(div_36);
          var a = child(div_37);
          var text_27 = child(a);
          var span_4 = sibling(a, 2);
          var text_28 = child(span_4);
          var span_5 = sibling(span_4, 2);
          var text_29 = child(span_5);
          var button_7 = sibling(span_5, 2);
          var div_38 = sibling(div_37, 2);
          var details_1 = child(div_38);
          var div_39 = sibling(div_36, 2);
          var div_40 = child(div_39);
          var span_6 = sibling(child(div_40), 2);
          var text_30 = child(span_6);
          var div_41 = sibling(div_40, 2);
          var span_7 = sibling(child(div_41), 2);
          var text_31 = child(span_7);
          var div_42 = sibling(div_35, 2);
          var div_43 = child(div_42);
          each(div_43, 5, () => (get(func), untrack(() => get(func).transactionIds)), index, ($$anchor4, txId) => {
            var div_44 = root_24();
            var a_1 = child(div_44);
            var text_32 = child(a_1);
            var button_8 = sibling(a_1, 2);
            template_effect(
              ($0, $1) => {
                set_attribute(a_1, "href", $0);
                set_attribute(a_1, "title", get(txId));
                set_text(text_32, $1);
              },
              [
                () => (deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), get(txId), untrack(() => getTransactionLink(getSelectedNetworkConfig(), get(txId)))),
                () => (deep_read_state(formatAddress), get(txId), untrack(() => formatAddress(get(txId))))
              ]
            );
            event("click", button_8, async () => await copyToClipboard(get(txId)));
            append($$anchor4, div_44);
          });
          template_effect(
            ($0, $1, $2) => {
              set_attribute(a, "href", $0);
              set_attribute(a, "title", (get(func), untrack(() => get(func).package)));
              set_text(text_27, (get(func), untrack(() => get(func).package)));
              set_text(text_28, (get(func), untrack(() => get(func).module)));
              set_text(text_29, (get(func), untrack(() => get(func).function)));
              set_text(text_30, $1);
              set_text(text_31, $2);
            },
            [
              () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(func), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(func).package))),
              () => (get(func), untrack(() => get(func).callCount.toLocaleString())),
              () => (get(func), untrack(() => get(func).transactionIds.length.toLocaleString()))
            ]
          );
          event("click", button_7, async () => await copyToClipboard(get(func).fullName));
          event("toggle", details_1, toggleTransactionIds);
          append($$anchor3, div_34);
        }
      );
      var details_2 = sibling(details, 2);
      var summary_1 = child(details_2);
      var text_33 = child(summary_1);
      var div_45 = sibling(summary_1, 2);
      each(
        div_45,
        5,
        () => (get(displayData), untrack(() => get(displayData).uniqueSendersList)),
        index,
        ($$anchor3, sender) => {
          var div_46 = root_25();
          var div_47 = child(div_46);
          var div_48 = child(div_47);
          var div_49 = child(div_48);
          var a_2 = child(div_49);
          var text_34 = child(a_2);
          var button_9 = sibling(div_49, 2);
          var div_50 = sibling(div_48, 2);
          var div_51 = child(div_50);
          var span_8 = sibling(child(div_51), 2);
          var text_35 = child(span_8);
          template_effect(
            ($0, $1) => {
              set_attribute(a_2, "href", $0);
              set_text(text_34, (get(sender), untrack(() => get(sender).address)));
              set_text(text_35, $1);
            },
            [
              () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(sender), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(sender).address))),
              () => (get(sender), untrack(() => get(sender).txCount.toLocaleString()))
            ]
          );
          event("click", button_9, async () => await copyToClipboard(get(sender).address));
          append($$anchor3, div_46);
        }
      );
      var details_3 = sibling(details_2, 2);
      var summary_2 = child(details_3);
      var text_36 = child(summary_2);
      var div_52 = sibling(summary_2, 2);
      each(
        div_52,
        5,
        () => (get(displayData), untrack(() => get(displayData).calledPackagesList)),
        index,
        ($$anchor3, pkg) => {
          var div_53 = root_26();
          var div_54 = child(div_53);
          var div_55 = child(div_54);
          var div_56 = child(div_55);
          var a_3 = child(div_56);
          var text_37 = child(a_3);
          var button_10 = sibling(div_56, 2);
          var div_57 = sibling(div_55, 2);
          var div_58 = child(div_57);
          var span_9 = sibling(child(div_58), 2);
          var text_38 = child(span_9);
          template_effect(
            ($0, $1) => {
              set_attribute(a_3, "href", $0);
              set_text(text_37, (get(pkg), untrack(() => get(pkg).package)));
              set_text(text_38, $1);
            },
            [
              () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(pkg), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(pkg).package))),
              () => (get(pkg), untrack(() => get(pkg).callCount.toLocaleString()))
            ]
          );
          event("click", button_10, async () => await copyToClipboard(get(pkg).package));
          append($$anchor3, div_53);
        }
      );
      var details_4 = sibling(details_3, 2);
      var summary_3 = child(details_4);
      var text_39 = child(summary_3);
      var div_59 = sibling(summary_3, 2);
      each(
        div_59,
        5,
        () => (get(displayData), untrack(() => get(displayData).publishedPackagesList)),
        index,
        ($$anchor3, pkg) => {
          var div_60 = root_27();
          var div_61 = child(div_60);
          var div_62 = child(div_61);
          var div_63 = child(div_62);
          var div_64 = child(div_63);
          var a_4 = sibling(child(div_64), 2);
          var text_40 = child(a_4);
          var button_11 = sibling(a_4, 2);
          var node_15 = sibling(div_64, 2);
          {
            var consequent_14 = ($$anchor4) => {
              var div_65 = root_28();
              var div_66 = sibling(child(div_65), 2);
              each(div_66, 5, () => (get(pkg), untrack(() => get(pkg).modules)), index, ($$anchor5, moduleName) => {
                var span_10 = root_29();
                var text_41 = child(span_10);
                template_effect(() => set_text(text_41, get(moduleName)));
                append($$anchor5, span_10);
              });
              append($$anchor4, div_65);
            };
            if_block(node_15, ($$render) => {
              if (get(pkg), untrack(() => get(pkg).modules && get(pkg).modules.length > 0)) $$render(consequent_14);
            });
          }
          var div_67 = sibling(node_15, 2);
          var a_5 = sibling(child(div_67), 2);
          var text_42 = child(a_5);
          var button_12 = sibling(a_5, 2);
          var div_68 = sibling(div_61, 2);
          var div_69 = child(div_68);
          var span_11 = child(div_69);
          var text_43 = child(span_11);
          var a_6 = sibling(div_69, 2);
          template_effect(
            ($0, $1, $2, $3) => {
              set_attribute(a_4, "href", $0);
              set_text(text_40, (get(pkg), untrack(() => get(pkg).packageId)));
              set_attribute(a_5, "href", $1);
              set_text(text_42, (get(pkg), untrack(() => get(pkg).sender)));
              set_text(text_43, `v${(get(pkg), untrack(() => get(pkg).version)) ?? ""}`);
              set_attribute(a_6, "href", $2);
              set_attribute(a_6, "title", `View transaction: ${$3 ?? ""}`);
            },
            [
              () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(pkg), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(pkg).packageId))),
              () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(pkg), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(pkg).sender))),
              () => (deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), get(pkg), untrack(() => getTransactionLink(getSelectedNetworkConfig(), get(pkg).txId))),
              () => (deep_read_state(formatAddress), get(pkg), untrack(() => formatAddress(get(pkg).txId)))
            ]
          );
          event("click", button_11, async () => await copyToClipboard(get(pkg).packageId));
          event("click", button_12, async () => await copyToClipboard(get(pkg).sender));
          append($$anchor3, div_60);
        }
      );
      var details_5 = sibling(details_4, 2);
      var summary_4 = child(details_5);
      var text_44 = child(summary_4);
      var div_70 = sibling(summary_4, 2);
      var node_16 = child(div_70);
      {
        var consequent_15 = ($$anchor3) => {
          var fragment_4 = comment();
          var node_17 = first_child(fragment_4);
          each(
            node_17,
            1,
            () => (get(displayData), untrack(() => get(displayData).commandTypeStats)),
            index,
            ($$anchor4, cmd) => {
              var div_71 = root_31();
              var div_72 = child(div_71);
              var div_73 = child(div_72);
              var div_74 = child(div_73);
              var div_75 = child(div_74);
              var span_12 = child(div_75);
              var text_45 = child(span_12);
              var button_13 = sibling(div_75, 2);
              var div_76 = sibling(div_74, 2);
              var details_6 = child(div_76);
              var div_77 = sibling(div_76, 2);
              var div_78 = child(div_77);
              var span_13 = sibling(child(div_78), 2);
              var text_46 = child(span_13);
              var div_79 = sibling(div_72, 2);
              var div_80 = child(div_79);
              each(div_80, 5, () => (get(cmd), untrack(() => get(cmd).digests)), index, ($$anchor5, txId) => {
                var div_81 = root_32();
                var a_7 = child(div_81);
                var text_47 = child(a_7);
                var button_14 = sibling(a_7, 2);
                template_effect(
                  ($0, $1) => {
                    set_attribute(a_7, "href", $0);
                    set_attribute(a_7, "title", get(txId));
                    set_text(text_47, $1);
                  },
                  [
                    () => (deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), get(txId), untrack(() => getTransactionLink(getSelectedNetworkConfig(), get(txId)))),
                    () => (deep_read_state(formatAddress), get(txId), untrack(() => formatAddress(get(txId))))
                  ]
                );
                event("click", button_14, async () => await copyToClipboard(get(txId)));
                append($$anchor5, div_81);
              });
              template_effect(
                ($0) => {
                  set_text(text_45, (get(cmd), untrack(() => get(cmd).type)));
                  set_text(text_46, $0);
                },
                [
                  () => (get(cmd), untrack(() => get(cmd).count.toLocaleString()))
                ]
              );
              event("click", button_13, async () => await copyToClipboard(get(cmd).type));
              event("toggle", details_6, toggleTransactionIds);
              append($$anchor4, div_71);
            }
          );
          append($$anchor3, fragment_4);
        };
        if_block(node_16, ($$render) => {
          if (get(displayData), untrack(() => get(displayData).commandTypeStats)) $$render(consequent_15);
        });
      }
      var node_18 = sibling(div_32, 2);
      {
        var consequent_23 = ($$anchor3) => {
          var fragment_5 = root_33();
          var node_19 = first_child(fragment_5);
          TransactionChart(node_19, {
            get checkpointData() {
              return get(displayData), untrack(() => get(displayData).checkpointData);
            },
            title: "Transactions per Checkpoint Over Time",
            onCheckpointSelected: handleCheckpointSelection
          });
          var div_82 = sibling(node_19, 2);
          var div_83 = sibling(child(div_82), 2);
          var div_84 = sibling(child(div_83), 2);
          var button_15 = child(div_84);
          var input_8 = sibling(button_15, 2);
          var button_16 = sibling(input_8, 2);
          var node_20 = sibling(div_84, 2);
          {
            var consequent_16 = ($$anchor4) => {
              var button_17 = root_34();
              event("click", button_17, () => {
                set(selectedCheckpoint, "");
                set(checkpointTransactions, []);
                set(checkpointFilterSubstring, "");
                set(filteredCheckpointTransactions, []);
              });
              append($$anchor4, button_17);
            };
            if_block(node_20, ($$render) => {
              if (get(selectedCheckpoint)) $$render(consequent_16);
            });
          }
          var div_85 = sibling(node_20, 2);
          var input_9 = child(div_85);
          var button_18 = sibling(input_9, 2);
          var button_19 = sibling(button_18, 2);
          var h5 = sibling(div_85, 2);
          var text_48 = child(h5);
          var node_21 = sibling(div_83, 2);
          {
            var consequent_17 = ($$anchor4) => {
              var div_86 = root_35();
              var p_7 = child(div_86);
              var text_49 = child(p_7);
              template_effect(() => set_text(text_49, `Loading transactions for checkpoint ${get(selectedCheckpoint) ?? ""}...`));
              append($$anchor4, div_86);
            };
            var consequent_21 = ($$anchor4) => {
              var div_87 = root_36();
              var div_88 = child(div_87);
              each(
                div_88,
                5,
                () => (get(filteredCheckpointTransactions), get(checkpointFilterSubstring), get(checkpointTransactions), untrack(() => get(filteredCheckpointTransactions).length > 0 || get(checkpointFilterSubstring) ? get(filteredCheckpointTransactions) : get(checkpointTransactions))),
                index,
                ($$anchor5, tx, index2) => {
                  var details_7 = root_37();
                  var summary_5 = child(details_7);
                  var span_14 = child(summary_5);
                  span_14.textContent = `Transaction ${index2 + 1}`;
                  var node_22 = sibling(span_14, 2);
                  {
                    var consequent_18 = ($$anchor6) => {
                      var span_15 = root_38();
                      var text_50 = child(span_15);
                      template_effect(() => {
                        set_attribute(span_15, "title", (get(tx), untrack(() => get(tx).digest)));
                        set_text(text_50, (get(tx), untrack(() => get(tx).digest)));
                      });
                      append($$anchor6, span_15);
                    };
                    var consequent_19 = ($$anchor6) => {
                      var span_16 = root_39();
                      var text_51 = child(span_16);
                      template_effect(() => {
                        set_attribute(span_16, "title", (get(tx), untrack(() => get(tx).transactionDigest)));
                        set_text(text_51, (get(tx), untrack(() => get(tx).transactionDigest)));
                      });
                      append($$anchor6, span_16);
                    };
                    if_block(node_22, ($$render) => {
                      if (get(tx), untrack(() => get(tx).digest)) $$render(consequent_18);
                      else if (get(tx), untrack(() => get(tx).transactionDigest)) $$render(consequent_19, 1);
                    });
                  }
                  var node_23 = sibling(node_22, 2);
                  {
                    var consequent_20 = ($$anchor6) => {
                      var span_17 = root_40();
                      let classes;
                      var text_52 = child(span_17);
                      template_effect(() => {
                        classes = set_class(span_17, 1, "transaction-status svelte-5fvkuj", null, classes, {
                          success: get(tx).effects.status.status === "success",
                          failure: get(tx).effects.status.status === "failure"
                        });
                        set_text(text_52, (get(tx), untrack(() => get(tx).effects.status.status)));
                      });
                      append($$anchor6, span_17);
                    };
                    if_block(node_23, ($$render) => {
                      if (get(tx), untrack(() => get(tx).effects && get(tx).effects.status)) $$render(consequent_20);
                    });
                  }
                  var div_89 = sibling(summary_5, 2);
                  var node_24 = child(div_89);
                  TransactionView(node_24, {
                    get value() {
                      return get(tx);
                    }
                  });
                  append($$anchor5, details_7);
                }
              );
              append($$anchor4, div_87);
            };
            var consequent_22 = ($$anchor4) => {
              var div_90 = root_41();
              var p_8 = child(div_90);
              var text_53 = child(p_8);
              template_effect(() => set_text(text_53, `No transactions found for checkpoint ${get(selectedCheckpoint) ?? ""}`));
              append($$anchor4, div_90);
            };
            var alternate_7 = ($$anchor4) => {
              var div_91 = root_42();
              append($$anchor4, div_91);
            };
            if_block(node_21, ($$render) => {
              if (get(loadingCheckpointTransactions)) $$render(consequent_17);
              else if (get(selectedCheckpoint), get(filteredCheckpointTransactions), get(checkpointTransactions), untrack(() => get(selectedCheckpoint) && (get(filteredCheckpointTransactions).length > 0 || get(checkpointTransactions).length > 0))) $$render(consequent_21, 1);
              else if (get(selectedCheckpoint), get(checkpointTransactions), get(loadingCheckpointTransactions), untrack(() => get(selectedCheckpoint) && get(checkpointTransactions).length === 0 && !get(loadingCheckpointTransactions))) $$render(consequent_22, 2);
              else $$render(alternate_7, false);
            });
          }
          template_effect(
            ($0, $1) => {
              button_15.disabled = $0;
              input_8.disabled = get(loadingCheckpointTransactions);
              button_16.disabled = $1;
              input_9.disabled = get(loadingCheckpointTransactions) || !get(selectedCheckpoint);
              button_18.disabled = get(loadingCheckpointTransactions) || !get(selectedCheckpoint);
              button_19.disabled = (get(loadingCheckpointTransactions), get(selectedCheckpoint), get(checkpointTransactions), untrack(() => get(loadingCheckpointTransactions) || !get(selectedCheckpoint) || !get(checkpointTransactions).length));
              set_text(text_48, `Transactions: ${(get(filteredCheckpointTransactions), get(checkpointFilterSubstring), get(checkpointTransactions), untrack(() => get(filteredCheckpointTransactions).length > 0 || get(checkpointFilterSubstring) ? get(filteredCheckpointTransactions).length : get(checkpointTransactions).length)) ?? ""}`);
            },
            [
              () => (get(selectedCheckpoint), deep_read_state(hasPreviousCheckpoint), get(displayData), untrack(() => !get(selectedCheckpoint) || !hasPreviousCheckpoint(get(selectedCheckpoint), get(displayData).checkpointData))),
              () => (get(selectedCheckpoint), deep_read_state(hasNextCheckpoint), get(displayData), untrack(() => !get(selectedCheckpoint) || !hasNextCheckpoint(get(selectedCheckpoint), get(displayData).checkpointData)))
            ]
          );
          event("click", button_15, previousCheckpoint);
          bind_value(input_8, () => get(selectedCheckpoint), ($$value) => set(selectedCheckpoint, $$value));
          event("input", input_8, onCheckpointInputChange);
          event("click", button_16, nextCheckpoint);
          bind_value(input_9, () => get(checkpointFilterSubstring), ($$value) => set(checkpointFilterSubstring, $$value));
          event("click", button_18, () => set(checkpointFilterSubstring, "MoveCall"));
          event("click", button_19, filterCheckpointTransactions);
          append($$anchor3, fragment_5);
        };
        if_block(node_18, ($$render) => {
          if (get(displayData), get(loading), untrack(() => get(displayData).checkpointData.length > 0 && !get(loading))) $$render(consequent_23);
        });
      }
      template_effect(
        ($0, $1, $2, $3) => {
          set_text(text_21, $0);
          set_text(text_22, ` Failed: ${(get(displayData), untrack(() => get(displayData).failedPTBs)) ?? ""}`);
          set_text(text_23, $1);
          set_text(text_24, $2);
          set_text(text_25, $3);
          set_text(text_26, `Called Functions (${(get(displayData), untrack(() => get(displayData).calledFunctionsCount)) ?? ""})`);
          set_text(text_33, `Unique Sender Addresses (${(get(displayData), untrack(() => get(displayData).uniqueSendersCount)) ?? ""})`);
          set_text(text_36, `Called Packages (${(get(displayData), untrack(() => get(displayData).calledPackagesCount)) ?? ""})`);
          set_text(text_39, `Published Packages (${(get(displayData), untrack(() => get(displayData).publishedPackagesCount)) ?? ""})`);
          set_text(text_44, `PTB Command Types (${(get(displayData), untrack(() => get(displayData).commandTypeStats ? get(displayData).commandTypeStats.length : 0)) ?? ""})`);
        },
        [
          () => (get(displayData), untrack(() => get(displayData).totalPTBs.toLocaleString())),
          () => (get(displayData), untrack(() => get(displayData).uniqueSendersCount.toLocaleString())),
          () => (get(displayData), untrack(() => get(displayData).calledFunctionsCount.toLocaleString())),
          () => (get(displayData), untrack(() => get(displayData).publishedPackagesCount.toLocaleString()))
        ]
      );
      append($$anchor2, div_21);
    };
    if_block(node_12, ($$render) => {
      if (get(displayData), untrack(() => get(displayData).totalPTBs > 0)) $$render(consequent_24);
    });
  }
  template_effect(() => {
    input.disabled = get(loading);
    button.disabled = get(loading);
    input_1.disabled = get(loading);
    button_1.disabled = get(loading);
    input_2.disabled = get(loading) || get(epochLoading);
    input_3.disabled = get(loading);
    button_4.disabled = get(loading) || get(inputMode) === "epoch" && !get(epoch) || get(inputMode) === "checkpoint" && (!get(startCheckpoint) || !get(endCheckpoint)) || get(epochLoading);
    set_text(text_6, get(loading) ? "Loading..." : "Query All Data");
    input_7.disabled = get(loading);
    button_5.disabled = get(loading) || get(inputMode) === "epoch" && !get(epoch) || get(inputMode) === "checkpoint" && (!get(startCheckpoint) || !get(endCheckpoint)) || get(epochLoading) || !get(transactionLimit) || get(transactionLimit) <= 0;
    set_text(text_7, get(loading) ? "Loading..." : `Query Limited (${get(transactionLimit)})`);
  });
  bind_value(input, () => get(inputObjectFilter), ($$value) => set(inputObjectFilter, $$value));
  event("click", button, () => set(inputObjectFilter, "0xa92a67ae8a8c644acfa6dd5a4d8098a20b07b6061cbf36aff8daef3ba892913f"));
  bind_value(input_1, () => get(functionFilter), ($$value) => set(functionFilter, $$value));
  event("click", button_1, () => set(functionFilter, "0x1efac8bf200acca64b62ce75557cd7232310fc8c4ea90960487d2908055fc94f::payments::handle_base_payment"));
  bind_group(binding_group, [], input_2, () => get(inputMode), ($$value) => set(inputMode, $$value));
  bind_group(binding_group, [], input_3, () => get(inputMode), ($$value) => set(inputMode, $$value));
  event("click", button_4, fetchEpochTransactionBlocks);
  bind_value(input_7, () => get(transactionLimit), ($$value) => set(transactionLimit, $$value));
  event("click", button_5, fetchLimitedTransactionBlocks);
  append($$anchor, div);
  pop();
}
export {
  PTBs as default
};

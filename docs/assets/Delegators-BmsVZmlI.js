import { p as push, M as prop, q as onMount, N as onDestroy, i as init, f as from_html, s as sibling, c as child, k as append, l as pop, g as get, m as mutable_source, n as set, b as if_block, t as template_effect, e as set_text, h as event, J as first_child, H as each, d as set_attribute, I as index, o as getClient } from "./index-1ne5tMKe.js";
import { J as JsonToggleView } from "./JsonToggleView-wWGsu26h.js";
import { g as graphql } from "./index-a-qIJzeT.js";
import { b as bind_this } from "./this-Y0w_F7_s.js";
import { C as Chart } from "./auto-Bkf-6vH1.js";
import "./transaction-view-Dg-5UHVh.js";
const STAKED_IOTA_TYPE = "0x3::staking_pool::StakedIota";
const TIMELOCKED_STAKED_IOTA_TYPE = "0x3::timelocked_staking::TimelockedStakedIota";
async function fetchDelegatorData(client, progressCallback, isPaused, signal) {
  progressCallback("Fetching system state and validators...");
  const systemState = await client.getLatestIotaSystemState();
  const totalSupply = BigInt(systemState.iotaTotalSupply);
  const currentEpoch = parseInt(systemState.epoch);
  const validators = systemState.activeValidators.map((v) => ({
    address: v.iotaAddress,
    name: v.name || "Unknown",
    poolId: v.stakingPoolId
  }));
  progressCallback(`Found ${validators.length} active validators. Fetching staked objects...`);
  const stakedObjects = [];
  await fetchStakedObjectsOfType(
    client,
    STAKED_IOTA_TYPE,
    false,
    stakedObjects,
    progressCallback,
    isPaused,
    signal
  );
  await fetchStakedObjectsOfType(
    client,
    TIMELOCKED_STAKED_IOTA_TYPE,
    true,
    stakedObjects,
    progressCallback,
    isPaused,
    signal
  );
  progressCallback("Computing statistics...");
  const stats = computeStats(stakedObjects, validators, totalSupply, currentEpoch);
  progressCallback("Done!");
  return {
    data: {
      validators,
      stakedObjects,
      totalSupply,
      currentEpoch
    },
    stats
  };
}
async function fetchStakedObjectsOfType(client, objectType, isTimelocked, stakedObjects, progressCallback, isPaused, signal) {
  const gqlClient = client.transport?.client;
  if (!gqlClient) {
    throw new Error("GraphQL client not available");
  }
  const typeLabel = isTimelocked ? "TimelockedStakedIota" : "StakedIota";
  let cursor = null;
  let pageCount = 0;
  while (true) {
    if (isPaused()) {
      throw new Error("Paused");
    }
    if (signal.aborted) {
      throw new Error("Aborted");
    }
    pageCount++;
    progressCallback(
      `Fetching ${typeLabel} objects (page ${pageCount}, total ${stakedObjects.length} objects)...`
    );
    const query = `query getStakedIota($type: String, $cursor: String) {
            objects(filter: {type: $type}, after: $cursor) {
                nodes {
                    address
                    owner {
                        ... on AddressOwner {
                            owner {
                                address
                            }
                        }
                    }
                    asMoveObject {
                        contents {
                            json
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }`;
    const result = await queryGraphQL(gqlClient, query, {
      type: objectType,
      cursor
    });
    if (result.errors) {
      throw new Error("GraphQL query failed: " + JSON.stringify(result.errors));
    }
    const objects = result.data.objects.nodes;
    for (const node of objects) {
      try {
        const json = node.asMoveObject?.contents?.json;
        if (!json) continue;
        const ownerAddress = node.owner?.owner?.address;
        if (!ownerAddress) continue;
        let poolId;
        let stakeActivationEpoch;
        let principal;
        if (isTimelocked) {
          poolId = json.pool_id;
          stakeActivationEpoch = parseInt(json.stake_activation_epoch || "0");
          principal = BigInt(json.principal || "0");
        } else {
          poolId = json.pool_id;
          stakeActivationEpoch = parseInt(json.stake_activation_epoch || "0");
          principal = BigInt(json.principal?.value || json.principal || "0");
        }
        stakedObjects.push({
          id: json.id,
          poolId,
          stakeActivationEpoch,
          principal,
          ownerAddress,
          isTimelocked
        });
      } catch (err) {
        console.warn("Error processing node:", err, node);
      }
    }
    const pageInfo = result.data.objects.pageInfo;
    if (!pageInfo.hasNextPage) {
      break;
    }
    cursor = pageInfo.endCursor;
  }
  progressCallback(`Fetched ${stakedObjects.length} ${typeLabel} objects.`);
}
async function queryGraphQL(gqlClient, query, variables) {
  const options = {
    query: graphql(query),
    variables
  };
  return gqlClient.query(options);
}
function computeStats(stakedObjects, validators, totalSupply, currentEpoch) {
  const validatorMap = /* @__PURE__ */ new Map();
  validators.forEach((v) => validatorMap.set(v.poolId, v));
  const validatorStatsMap = /* @__PURE__ */ new Map();
  validators.forEach((v) => {
    validatorStatsMap.set(v.poolId, {
      name: v.name,
      address: v.address,
      poolId: v.poolId,
      stakedObjectCount: 0,
      timelockedObjectCount: 0,
      uniqueAddresses: 0,
      totalStakedAmount: 0,
      averageStakedAmount: 0,
      averageStakeDuration: 0,
      stakePercentage: 0
    });
  });
  const validatorAddresses = /* @__PURE__ */ new Map();
  validators.forEach((v) => {
    validatorAddresses.set(v.poolId, /* @__PURE__ */ new Set());
  });
  let totalStakedAmount = 0;
  let totalStakeDuration = 0;
  let totalTimelockedCount = 0;
  const globalAddresses = /* @__PURE__ */ new Set();
  stakedObjects.forEach((obj) => {
    const validatorStats = validatorStatsMap.get(obj.poolId);
    if (!validatorStats) return;
    const amount = Number(obj.principal);
    const duration = currentEpoch - obj.stakeActivationEpoch;
    validatorStats.stakedObjectCount++;
    if (obj.isTimelocked) {
      validatorStats.timelockedObjectCount++;
      totalTimelockedCount++;
    }
    validatorStats.totalStakedAmount += amount;
    validatorStats.averageStakeDuration += duration;
    validatorAddresses.get(obj.poolId)?.add(obj.ownerAddress);
    globalAddresses.add(obj.ownerAddress);
    totalStakedAmount += amount;
    totalStakeDuration += duration;
  });
  const validatorStatsList = [];
  validatorStatsMap.forEach((stats, poolId) => {
    if (stats.stakedObjectCount > 0) {
      stats.averageStakedAmount = stats.totalStakedAmount / stats.stakedObjectCount;
      stats.averageStakeDuration = stats.averageStakeDuration / stats.stakedObjectCount;
    }
    stats.uniqueAddresses = validatorAddresses.get(poolId)?.size || 0;
    stats.stakePercentage = stats.totalStakedAmount / Number(totalSupply) * 100;
    validatorStatsList.push(stats);
  });
  validatorStatsList.sort((a, b) => b.totalStakedAmount - a.totalStakedAmount);
  const globalStats = {
    totalStakedObjects: stakedObjects.filter((o) => !o.isTimelocked).length,
    totalTimelockedObjects: totalTimelockedCount,
    totalUniqueAddresses: globalAddresses.size,
    totalStakedAmount,
    averageStakedAmount: stakedObjects.length > 0 ? totalStakedAmount / stakedObjects.length : 0,
    averageStakeDuration: stakedObjects.length > 0 ? totalStakeDuration / stakedObjects.length : 0,
    totalSupply,
    totalStakePercentage: totalStakedAmount / Number(totalSupply) * 100
  };
  return {
    validators: validatorStatsList,
    global: globalStats
  };
}
var root$1 = from_html(`<div class="charts-container svelte-23mjk6"><h2 class="svelte-23mjk6">Charts</h2> <div class="chart-row svelte-23mjk6"><div class="chart-card svelte-23mjk6"><canvas></canvas></div> <div class="chart-card svelte-23mjk6"><canvas></canvas></div></div> <div class="chart-row svelte-23mjk6"><div class="chart-card svelte-23mjk6"><canvas></canvas></div> <div class="chart-card svelte-23mjk6"><canvas></canvas></div></div></div>`);
function DelegatorsCharts($$anchor, $$props) {
  push($$props, false);
  let data = prop($$props, "data", 8);
  let stats = prop($$props, "stats", 8);
  let stakeByValidatorCanvas = mutable_source();
  let stakeActivationCanvas = mutable_source();
  let stakedAmountsCanvas = mutable_source();
  let addressDistributionCanvas = mutable_source();
  let charts = [];
  function createStakeByValidatorChart() {
    if (!get(stakeByValidatorCanvas)) return;
    const topValidators = stats().validators.slice(0, 15);
    const chart = new Chart(get(stakeByValidatorCanvas), {
      type: "bar",
      data: {
        labels: topValidators.map((v) => v.name || v.address.slice(0, 8)),
        datasets: [
          {
            label: "Total Staked Amount (IOTA)",
            data: topValidators.map((v) => v.totalStakedAmount / 1e9),
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Top 15 Validators by Stake" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                if (value == null) return "";
                return `${context.dataset.label}: ${value.toLocaleString()} IOTA`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Amount (IOTA)" }
          }
        }
      }
    });
    charts.push(chart);
  }
  function createStakeActivationChart() {
    if (!get(stakeActivationCanvas)) return;
    const epochCounts = /* @__PURE__ */ new Map();
    data().stakedObjects.forEach((obj) => {
      const count = epochCounts.get(obj.stakeActivationEpoch) || 0;
      epochCounts.set(obj.stakeActivationEpoch, count + 1);
    });
    const sortedEpochs = Array.from(epochCounts.keys()).sort((a, b) => a - b);
    const counts = sortedEpochs.map((epoch) => epochCounts.get(epoch) || 0);
    const chart = new Chart(get(stakeActivationCanvas), {
      type: "line",
      data: {
        labels: sortedEpochs,
        datasets: [
          {
            label: "Number of Objects",
            data: counts,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Stake Activation Epoch Distribution" },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Epoch ${context.label}: ${context.parsed.y} objects`;
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: "Epoch" } },
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Objects" }
          }
        }
      }
    });
    charts.push(chart);
  }
  function createStakedAmountsChart() {
    if (!get(stakedAmountsCanvas)) return;
    const buckets = [
      { label: "< 100", min: 0, max: 100, count: 0 },
      { label: "100-1K", min: 100, max: 1e3, count: 0 },
      { label: "1K-10K", min: 1e3, max: 1e4, count: 0 },
      { label: "10K-100K", min: 1e4, max: 1e5, count: 0 },
      { label: "100K-1M", min: 1e5, max: 1e6, count: 0 },
      { label: "> 1M", min: 1e6, max: Infinity, count: 0 }
    ];
    data().stakedObjects.forEach((obj) => {
      const iotaAmount = Number(obj.principal) / 1e9;
      const bucket = buckets.find((b) => iotaAmount >= b.min && iotaAmount < b.max);
      if (bucket) bucket.count++;
    });
    const chart = new Chart(get(stakedAmountsCanvas), {
      type: "bar",
      data: {
        labels: buckets.map((b) => b.label + " IOTA"),
        datasets: [
          {
            label: "Number of Objects",
            data: buckets.map((b) => b.count),
            backgroundColor: "rgba(234, 88, 12, 0.6)",
            borderColor: "rgba(234, 88, 12, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Staked Amount Distribution" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                if (value == null) return "";
                return `${value.toLocaleString()} objects`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Objects" }
          }
        }
      }
    });
    charts.push(chart);
  }
  function createAddressDistributionChart() {
    if (!get(addressDistributionCanvas)) return;
    const addressCounts = /* @__PURE__ */ new Map();
    data().stakedObjects.forEach((obj) => {
      const count = addressCounts.get(obj.ownerAddress) || 0;
      addressCounts.set(obj.ownerAddress, count + 1);
    });
    const buckets = [
      { label: "1 object", min: 1, max: 1, count: 0 },
      { label: "2-5 objects", min: 2, max: 5, count: 0 },
      { label: "6-10 objects", min: 6, max: 10, count: 0 },
      { label: "11-50 objects", min: 11, max: 50, count: 0 },
      { label: "> 50 objects", min: 51, max: Infinity, count: 0 }
    ];
    addressCounts.forEach((count) => {
      const bucket = buckets.find((b) => count >= b.min && count <= b.max);
      if (bucket) bucket.count++;
    });
    const chart = new Chart(get(addressDistributionCanvas), {
      type: "pie",
      data: {
        labels: buckets.map((b) => b.label),
        datasets: [
          {
            label: "Number of Addresses",
            data: buckets.map((b) => b.count),
            backgroundColor: [
              "rgba(59, 130, 246, 0.6)",
              "rgba(16, 185, 129, 0.6)",
              "rgba(234, 88, 12, 0.6)",
              "rgba(124, 58, 237, 0.6)",
              "rgba(245, 158, 11, 0.6)"
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(234, 88, 12, 1)",
              "rgba(124, 58, 237, 1)",
              "rgba(245, 158, 11, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Address Distribution by Object Count" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = (value / total * 100).toFixed(1);
                return `${label}: ${value} addresses (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    charts.push(chart);
  }
  onMount(() => {
    createStakeByValidatorChart();
    createStakeActivationChart();
    createStakedAmountsChart();
    createAddressDistributionChart();
  });
  onDestroy(() => {
    charts.forEach((chart) => chart.destroy());
    charts = [];
  });
  init();
  var div = root$1();
  var div_1 = sibling(child(div), 2);
  var div_2 = child(div_1);
  var canvas = child(div_2);
  bind_this(canvas, ($$value) => set(stakeByValidatorCanvas, $$value), () => get(stakeByValidatorCanvas));
  var div_3 = sibling(div_2, 2);
  var canvas_1 = child(div_3);
  bind_this(canvas_1, ($$value) => set(stakeActivationCanvas, $$value), () => get(stakeActivationCanvas));
  var div_4 = sibling(div_1, 2);
  var div_5 = child(div_4);
  var canvas_2 = child(div_5);
  bind_this(canvas_2, ($$value) => set(stakedAmountsCanvas, $$value), () => get(stakedAmountsCanvas));
  var div_6 = sibling(div_5, 2);
  var canvas_3 = child(div_6);
  bind_this(canvas_3, ($$value) => set(addressDistributionCanvas, $$value), () => get(addressDistributionCanvas));
  append($$anchor, div);
  pop();
}
var root_1 = from_html(`<button class="svelte-z1qq95">Pause Fetching</button>`);
var root_2 = from_html(`<div class="progress-message svelte-z1qq95"> </div>`);
var root_4 = from_html(`<div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Stake Percentage</div> <div class="stat-value svelte-z1qq95"> </div></div>`);
var root_5 = from_html(`<tr class="svelte-z1qq95"><td class="svelte-z1qq95"> </td><td class="address-cell svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td><td class="svelte-z1qq95"> </td></tr>`);
var root_3 = from_html(`<div class="stats-container svelte-z1qq95"><h2 class="svelte-z1qq95">Global Statistics</h2> <div class="stats-grid svelte-z1qq95"><div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Staked Objects</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Timelocked Objects</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Unique Addresses</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Staked Amount (IOTA)</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Average Staked Amount (IOTA)</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Average Stake Duration (epochs)</div> <div class="stat-value svelte-z1qq95"> </div></div> <!></div></div> <h2 class="svelte-z1qq95">Validator Statistics</h2> <div class="validators-table-container svelte-z1qq95"><table class="validators-table svelte-z1qq95"><thead><tr><th class="svelte-z1qq95">Validator Name</th><th class="svelte-z1qq95">Address</th><th class="svelte-z1qq95">Staked Objects</th><th class="svelte-z1qq95">Timelocked Objects</th><th class="svelte-z1qq95">Unique Addresses</th><th class="svelte-z1qq95">Total Staked (IOTA)</th><th class="svelte-z1qq95">Avg Amount (IOTA)</th><th class="svelte-z1qq95">Avg Duration (epochs)</th><th class="svelte-z1qq95">Stake %</th></tr></thead><tbody class="svelte-z1qq95"></tbody></table></div> <!>`, 1);
var root_7 = from_html(`<h2 class="svelte-z1qq95">Raw Data</h2> <!>`, 1);
var root = from_html(`<main class="svelte-z1qq95"><h1 class="svelte-z1qq95">Delegators Overview</h1> <div class="controls svelte-z1qq95"><button class="svelte-z1qq95"> </button> <!></div> <!> <!> <!></main>`);
function Delegators($$anchor, $$props) {
  push($$props, false);
  let isLoading = mutable_source(false);
  let isPaused = false;
  let delegatorData = mutable_source(null);
  let stats = mutable_source(null);
  let progressMessage = mutable_source("");
  let abortController = null;
  async function fetchData() {
    try {
      set(isLoading, true);
      isPaused = false;
      set(delegatorData, null);
      set(stats, null);
      set(progressMessage, "Starting to fetch delegator data...");
      abortController = new AbortController();
      const client = getClient(true);
      const result = await fetchDelegatorData(
        client,
        (progress) => {
          set(progressMessage, progress);
          set(delegatorData, result.data);
          set(stats, result.stats);
        },
        () => isPaused,
        abortController.signal
      );
      set(delegatorData, result.data);
      set(stats, result.stats);
      set(progressMessage, "Data fetch completed!");
    } catch (err) {
      if (err.name === "AbortError") {
        set(progressMessage, "Data fetch was paused.");
      } else {
        set(progressMessage, `Error: ${err.toString()}`);
        console.error(err);
      }
    } finally {
      set(isLoading, false);
    }
  }
  function pauseFetching() {
    isPaused = true;
    if (abortController) {
      abortController.abort();
    }
    set(progressMessage, "Fetching paused by user.");
  }
  onDestroy(() => {
    if (abortController) {
      abortController.abort();
    }
  });
  init();
  var main = root();
  var div = sibling(child(main), 2);
  var button = child(div);
  var text = child(button);
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var button_1 = root_1();
      event("click", button_1, pauseFetching);
      append($$anchor2, button_1);
    };
    if_block(node, ($$render) => {
      if (get(isLoading)) $$render(consequent);
    });
  }
  var node_1 = sibling(div, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_1 = root_2();
      var text_1 = child(div_1);
      template_effect(() => set_text(text_1, get(progressMessage)));
      append($$anchor2, div_1);
    };
    if_block(node_1, ($$render) => {
      if (get(progressMessage)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment = root_3();
      var div_2 = first_child(fragment);
      var div_3 = sibling(child(div_2), 2);
      var div_4 = child(div_3);
      var div_5 = sibling(child(div_4), 2);
      var text_2 = child(div_5);
      var div_6 = sibling(div_4, 2);
      var div_7 = sibling(child(div_6), 2);
      var text_3 = child(div_7);
      var div_8 = sibling(div_6, 2);
      var div_9 = sibling(child(div_8), 2);
      var text_4 = child(div_9);
      var div_10 = sibling(div_8, 2);
      var div_11 = sibling(child(div_10), 2);
      var text_5 = child(div_11);
      var div_12 = sibling(div_10, 2);
      var div_13 = sibling(child(div_12), 2);
      var text_6 = child(div_13);
      var div_14 = sibling(div_12, 2);
      var div_15 = sibling(child(div_14), 2);
      var text_7 = child(div_15);
      var node_3 = sibling(div_14, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var div_16 = root_4();
          var div_17 = sibling(child(div_16), 2);
          var text_8 = child(div_17);
          template_effect(($0) => set_text(text_8, `${$0 ?? ""}%`), [() => get(stats).global.totalStakePercentage.toFixed(2)]);
          append($$anchor3, div_16);
        };
        if_block(node_3, ($$render) => {
          if (get(stats).global.totalSupply) $$render(consequent_2);
        });
      }
      var div_18 = sibling(div_2, 4);
      var table = child(div_18);
      var tbody = sibling(child(table));
      each(tbody, 5, () => get(stats).validators, index, ($$anchor3, validator) => {
        var tr = root_5();
        var td = child(tr);
        var text_9 = child(td);
        var td_1 = sibling(td);
        var text_10 = child(td_1);
        var td_2 = sibling(td_1);
        var text_11 = child(td_2);
        var td_3 = sibling(td_2);
        var text_12 = child(td_3);
        var td_4 = sibling(td_3);
        var text_13 = child(td_4);
        var td_5 = sibling(td_4);
        var text_14 = child(td_5);
        var td_6 = sibling(td_5);
        var text_15 = child(td_6);
        var td_7 = sibling(td_6);
        var text_16 = child(td_7);
        var td_8 = sibling(td_7);
        var text_17 = child(td_8);
        template_effect(
          ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
            set_text(text_9, get(validator).name);
            set_attribute(td_1, "title", get(validator).address);
            set_text(text_10, `${$0 ?? ""}...${$1 ?? ""}`);
            set_text(text_11, $2);
            set_text(text_12, $3);
            set_text(text_13, $4);
            set_text(text_14, $5);
            set_text(text_15, $6);
            set_text(text_16, $7);
            set_text(text_17, `${$8 ?? ""}%`);
          },
          [
            () => get(validator).address.slice(0, 10),
            () => get(validator).address.slice(-8),
            () => get(validator).stakedObjectCount.toLocaleString(),
            () => get(validator).timelockedObjectCount.toLocaleString(),
            () => get(validator).uniqueAddresses.toLocaleString(),
            () => (get(validator).totalStakedAmount / 1e9).toLocaleString(void 0, { maximumFractionDigits: 2 }),
            () => (get(validator).averageStakedAmount / 1e9).toLocaleString(void 0, { maximumFractionDigits: 2 }),
            () => get(validator).averageStakeDuration.toLocaleString(void 0, { maximumFractionDigits: 2 }),
            () => get(validator).stakePercentage.toFixed(2)
          ]
        );
        append($$anchor3, tr);
      });
      var node_4 = sibling(div_18, 2);
      {
        var consequent_3 = ($$anchor3) => {
          DelegatorsCharts($$anchor3, {
            get data() {
              return get(delegatorData);
            },
            get stats() {
              return get(stats);
            }
          });
        };
        if_block(node_4, ($$render) => {
          if (get(delegatorData)) $$render(consequent_3);
        });
      }
      template_effect(
        ($0, $1, $2, $3, $4, $5) => {
          set_text(text_2, $0);
          set_text(text_3, $1);
          set_text(text_4, $2);
          set_text(text_5, $3);
          set_text(text_6, $4);
          set_text(text_7, $5);
        },
        [
          () => get(stats).global.totalStakedObjects.toLocaleString(),
          () => get(stats).global.totalTimelockedObjects.toLocaleString(),
          () => get(stats).global.totalUniqueAddresses.toLocaleString(),
          () => (get(stats).global.totalStakedAmount / 1e9).toLocaleString(void 0, { maximumFractionDigits: 2 }),
          () => (get(stats).global.averageStakedAmount / 1e9).toLocaleString(void 0, { maximumFractionDigits: 2 }),
          () => get(stats).global.averageStakeDuration.toLocaleString(void 0, { maximumFractionDigits: 2 })
        ]
      );
      append($$anchor2, fragment);
    };
    if_block(node_2, ($$render) => {
      if (get(stats)) $$render(consequent_4);
    });
  }
  var node_5 = sibling(node_2, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var fragment_2 = root_7();
      var node_6 = sibling(first_child(fragment_2), 2);
      JsonToggleView(node_6, {
        get value() {
          return get(delegatorData);
        }
      });
      append($$anchor2, fragment_2);
    };
    if_block(node_5, ($$render) => {
      if (get(delegatorData)) $$render(consequent_5);
    });
  }
  template_effect(() => {
    button.disabled = get(isLoading);
    set_text(text, get(isLoading) ? "Fetching..." : "Fetch/Refresh Data");
  });
  event("click", button, fetchData);
  append($$anchor, main);
  pop();
}
export {
  Delegators as default
};

import { at as is_runes, ac as block, ae as BranchManager, o as getClient, I as IotaGraphQLClient, x as getSelectedNetworkConfig, p as push, V as prop, q as onMount, W as onDestroy, i as init, a as from_html, s as sibling, c as child, g as get, m as mutable_source, n as set, y as bind_value, h as event, k as append, l as pop, H as state, J as proxy, b as if_block, t as template_effect, N as user_derived, e as set_text, Q as first_child, v as delegated, au as update, av as tick, L as each, O as index, R as comment, E as delegate, a4 as set_style, a5 as set_class, U as text } from "./index-BVB862TN.js";
import { g as graphql } from "./index-a-qIJzeT.js";
import { b as bind_this } from "./this-JiT3FbuU.js";
import { C as Chart } from "./auto-Bkf-6vH1.js";
const NAN = /* @__PURE__ */ Symbol("NaN");
function key(node, get_key, render_fn) {
  var branches = new BranchManager(node);
  var legacy = !is_runes();
  block(() => {
    var key2 = get_key();
    if (key2 !== key2) {
      key2 = /** @type {any} */
      NAN;
    }
    if (legacy && key2 !== null && typeof key2 === "object") {
      key2 = /** @type {V} */
      {};
    }
    branches.ensure(key2, render_fn);
  });
}
const STAKED_IOTA_TYPE = "0x3::staking_pool::StakedIota";
const TIMELOCKED_STAKED_IOTA_TYPE = "0x3::timelocked_staking::TimelockedStakedIota";
function parseBigIntValue(value) {
  if (value == null) return 0n;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  const normalized = value.replace(/_/g, "");
  return normalized ? BigInt(normalized) : 0n;
}
function parseNumberValue(value, fallback = 0) {
  if (value == null) return fallback;
  if (typeof value === "number") return value;
  const normalized = value.replace(/_/g, "");
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
async function fetchDelegatorData(client, progressCallback, isPaused, signal, resumeType = null, resumeCursor = null, resumeTimelockedCursor = null, resumeStakedObjects = []) {
  progressCallback(
    resumeType ? "Resuming fetch, getting system state..." : "Fetching system state and validators..."
  );
  const systemState = await getClient(false).getLatestIotaSystemState();
  const totalSupply = BigInt(systemState.iotaTotalSupply);
  const totalStake = BigInt(systemState.totalStake);
  const currentEpoch = parseInt(systemState.epoch);
  const validators = systemState.activeValidators.map((v) => {
    return {
      address: v.iotaAddress,
      name: v.name || "Unknown",
      poolId: v.stakingPoolId,
      commissionRate: parseNumberValue(v.commissionRate),
      nextEpochStake: parseBigIntValue(v.nextEpochStake),
      nextEpochGasPrice: parseBigIntValue(v.nextEpochGasPrice),
      nextEpochCommissionRate: parseNumberValue(v.nextEpochCommissionRate),
      stakingPoolActivationEpoch: parseNumberValue(v.stakingPoolActivationEpoch),
      stakingPoolDeactivationEpoch: v.stakingPoolDeactivationEpoch == null ? null : parseNumberValue(v.stakingPoolDeactivationEpoch),
      stakingPoolIotaBalance: parseBigIntValue(v.stakingPoolIotaBalance),
      rewardsPool: parseBigIntValue(v.rewardsPool),
      poolTokenBalance: parseBigIntValue(v.poolTokenBalance),
      pendingStake: parseBigIntValue(v.pendingStake),
      pendingTotalIotaWithdraw: parseBigIntValue(v.pendingTotalIotaWithdraw),
      pendingPoolTokenWithdraw: parseBigIntValue(v.pendingPoolTokenWithdraw)
    };
  });
  progressCallback(
    resumeType ? `Resuming, found ${validators.length} active validators. Continuing staked objects...` : `Found ${validators.length} active validators. Fetching staked objects...`
  );
  let stakedObjects = resumeStakedObjects || [];
  let currentResumeType = resumeType || null;
  if (currentResumeType === "StakedIota" && resumeTimelockedCursor) {
    const normalStakedObjects = stakedObjects.filter(
      (obj) => !obj.isTimelocked
    );
    const timelockedStakedObjects = stakedObjects.filter(
      (obj) => obj.isTimelocked
    );
    const fetchPromises = [];
    if (resumeCursor) {
      fetchPromises.push(
        fetchStakedObjectsOfType(
          STAKED_IOTA_TYPE,
          false,
          normalStakedObjects,
          (message) => {
            const combined = [...normalStakedObjects, ...timelockedStakedObjects];
            const currentData = {
              validators,
              stakedObjects: combined,
              totalSupply,
              totalStake,
              currentEpoch
            };
            const currentStats = computeStats(
              combined,
              validators,
              totalSupply,
              totalStake,
              currentEpoch
            );
            progressCallback(`[Normal] ${message}`, currentData, currentStats);
          },
          isPaused,
          signal,
          resumeCursor
        )
      );
    } else {
      fetchPromises.push(
        Promise.resolve({
          stakedObjects: normalStakedObjects,
          cursor: null,
          paused: false
        })
      );
    }
    if (resumeTimelockedCursor) {
      fetchPromises.push(
        fetchStakedObjectsOfType(
          TIMELOCKED_STAKED_IOTA_TYPE,
          true,
          timelockedStakedObjects,
          (message) => {
            const combined = [...normalStakedObjects, ...timelockedStakedObjects];
            const currentData = {
              validators,
              stakedObjects: combined,
              totalSupply,
              totalStake,
              currentEpoch
            };
            const currentStats = computeStats(
              combined,
              validators,
              totalSupply,
              totalStake,
              currentEpoch
            );
            progressCallback(`[Timelocked] ${message}`, currentData, currentStats);
          },
          isPaused,
          signal,
          resumeTimelockedCursor
        )
      );
    } else {
      fetchPromises.push(
        Promise.resolve({
          stakedObjects: timelockedStakedObjects,
          cursor: null,
          paused: false
        })
      );
    }
    const [normalResult, timelockedResult] = await Promise.all(fetchPromises);
    if (normalResult.paused || timelockedResult.paused) {
      const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
      return {
        data: {
          validators,
          stakedObjects: combined,
          totalSupply,
          totalStake,
          currentEpoch
        },
        stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
        resumeType: "StakedIota",
        // Always mark as StakedIota for parallel resume
        resumeCursor: normalResult.cursor,
        resumeTimelockedCursor: timelockedResult.cursor,
        resumeStakedObjects: combined
      };
    }
    stakedObjects = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
  } else if (currentResumeType) {
    if (currentResumeType === "StakedIota") {
      const result = await fetchStakedObjectsOfType(
        STAKED_IOTA_TYPE,
        false,
        stakedObjects,
        (message) => {
          const currentData = {
            validators,
            stakedObjects: [...stakedObjects],
            totalSupply,
            totalStake,
            currentEpoch
          };
          const currentStats = computeStats(
            stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          );
          progressCallback(message, currentData, currentStats);
        },
        isPaused,
        signal,
        resumeCursor
      );
      if (result.paused) {
        return {
          data: {
            validators,
            stakedObjects: result.stakedObjects,
            totalSupply,
            totalStake,
            currentEpoch
          },
          stats: computeStats(
            result.stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          ),
          resumeType: "StakedIota",
          resumeCursor: result.cursor,
          resumeTimelockedCursor,
          resumeStakedObjects: result.stakedObjects
        };
      }
      const timelockedResult = await fetchStakedObjectsOfType(
        TIMELOCKED_STAKED_IOTA_TYPE,
        true,
        result.stakedObjects,
        // This array already has both old and new StakedIota objects
        (message) => {
          const currentData = {
            validators,
            stakedObjects: [...result.stakedObjects],
            totalSupply,
            totalStake,
            currentEpoch
          };
          const currentStats = computeStats(
            result.stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          );
          progressCallback(message, currentData, currentStats);
        },
        isPaused,
        signal,
        resumeTimelockedCursor
      );
      if (timelockedResult.paused) {
        return {
          data: {
            validators,
            stakedObjects: timelockedResult.stakedObjects,
            totalSupply,
            totalStake,
            currentEpoch
          },
          stats: computeStats(
            timelockedResult.stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          ),
          resumeType: "TimelockedStakedIota",
          resumeCursor: timelockedResult.cursor,
          resumeTimelockedCursor: timelockedResult.cursor,
          resumeStakedObjects: timelockedResult.stakedObjects
        };
      }
      stakedObjects = timelockedResult.stakedObjects;
    } else if (currentResumeType === "TimelockedStakedIota") {
      const result = await fetchStakedObjectsOfType(
        TIMELOCKED_STAKED_IOTA_TYPE,
        true,
        stakedObjects,
        (message) => {
          const currentData = {
            validators,
            stakedObjects: [...stakedObjects],
            totalSupply,
            totalStake,
            currentEpoch
          };
          const currentStats = computeStats(
            stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          );
          progressCallback(message, currentData, currentStats);
        },
        isPaused,
        signal,
        resumeCursor
      );
      if (result.paused) {
        return {
          data: {
            validators,
            stakedObjects: result.stakedObjects,
            totalSupply,
            totalStake,
            currentEpoch
          },
          stats: computeStats(
            result.stakedObjects,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          ),
          resumeType: "TimelockedStakedIota",
          resumeCursor: result.cursor,
          resumeTimelockedCursor: result.cursor,
          resumeStakedObjects: result.stakedObjects
        };
      }
      stakedObjects = result.stakedObjects;
    }
  } else {
    const normalStakedObjects = [];
    const timelockedStakedObjects = [];
    const [normalResult, timelockedResult] = await Promise.all([
      fetchStakedObjectsOfType(
        STAKED_IOTA_TYPE,
        false,
        normalStakedObjects,
        (message) => {
          const combined = [...normalStakedObjects, ...timelockedStakedObjects];
          const currentData = {
            validators,
            stakedObjects: combined,
            totalSupply,
            totalStake,
            currentEpoch
          };
          const currentStats = computeStats(
            combined,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          );
          progressCallback(`[Normal] ${message}`, currentData, currentStats);
        },
        isPaused,
        signal,
        null
      ),
      fetchStakedObjectsOfType(
        TIMELOCKED_STAKED_IOTA_TYPE,
        true,
        timelockedStakedObjects,
        (message) => {
          const combined = [...normalStakedObjects, ...timelockedStakedObjects];
          const currentData = {
            validators,
            stakedObjects: combined,
            totalSupply,
            totalStake,
            currentEpoch
          };
          const currentStats = computeStats(
            combined,
            validators,
            totalSupply,
            totalStake,
            currentEpoch
          );
          progressCallback(`[Timelocked] ${message}`, currentData, currentStats);
        },
        isPaused,
        signal,
        null
      )
    ]);
    if (normalResult.paused) {
      const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
      return {
        data: {
          validators,
          stakedObjects: combined,
          totalSupply,
          totalStake,
          currentEpoch
        },
        stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
        resumeType: "StakedIota",
        resumeCursor: normalResult.cursor,
        resumeTimelockedCursor: timelockedResult.cursor,
        resumeStakedObjects: combined
      };
    }
    if (timelockedResult.paused) {
      const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
      return {
        data: {
          validators,
          stakedObjects: combined,
          totalSupply,
          totalStake,
          currentEpoch
        },
        stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
        resumeType: "StakedIota",
        // Use StakedIota to indicate parallel resume
        resumeCursor: normalResult.cursor,
        // null since normal completed
        resumeTimelockedCursor: timelockedResult.cursor,
        resumeStakedObjects: combined
      };
    }
    stakedObjects = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
  }
  progressCallback("Computing final statistics...");
  const stats = computeStats(stakedObjects, validators, totalSupply, totalStake, currentEpoch);
  progressCallback("Done!");
  return {
    data: {
      validators,
      stakedObjects,
      totalSupply,
      totalStake,
      currentEpoch
    },
    stats
  };
}
async function fetchStakedObjectsOfType(objectType, isTimelocked, stakedObjects, progressCallback, isPaused, signal, startingCursor = null) {
  const existingIds = new Set(stakedObjects.map((obj) => obj.id));
  const gqlClient = new IotaGraphQLClient({
    url: getSelectedNetworkConfig().graphql
  });
  const typeLabel = isTimelocked ? "TimelockedStakedIota" : "StakedIota";
  let cursor = startingCursor;
  while (true) {
    if (isPaused()) {
      return { stakedObjects, cursor, paused: true };
    }
    if (signal.aborted) {
      return { stakedObjects, cursor, paused: true };
    }
    progressCallback(
      `Fetching ${typeLabel} objects (total ${stakedObjects.length} objects)...`
    );
    const query = `query getStakedIota($type: String, $cursor: String) {
            objects(filter: {type: $type}, after: $cursor) {
                edges {
                    cursor
                    node {
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
    const edges = result.data.objects.edges || [];
    const objects = edges.map((edge) => edge.node);
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
          const stakedIota = json.staked_iota;
          if (!stakedIota) {
            console.warn("No staked_iota field in timelocked object:", json);
            continue;
          }
          poolId = stakedIota.pool_id || "";
          stakeActivationEpoch = parseInt(stakedIota.stake_activation_epoch || "0");
          principal = BigInt(stakedIota.principal?.value || stakedIota.principal || "0");
        } else {
          poolId = json.pool_id || "";
          stakeActivationEpoch = parseInt(json.stake_activation_epoch || "0");
          principal = BigInt(json.principal?.value || json.principal || "0");
        }
        const objectId = json.id || node.address;
        if (objectId && existingIds.has(objectId)) {
          continue;
        }
        if (!objectId) {
          console.warn(`[${typeLabel}] Object missing ID:`, json);
          continue;
        }
        const obj = {
          id: objectId,
          poolId,
          stakeActivationEpoch,
          principal,
          ownerAddress,
          isTimelocked
        };
        stakedObjects.push(obj);
        existingIds.add(objectId);
      } catch (err) {
        console.warn("Error processing node:", err, node);
      }
    }
    const pageInfo = result.data.objects.pageInfo || {};
    const lastEdgeCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
    const nextCursor = pageInfo.endCursor || lastEdgeCursor || null;
    if (!nextCursor || nextCursor === cursor) {
      break;
    }
    cursor = nextCursor;
  }
  progressCallback(`Fetched ${stakedObjects.length} ${typeLabel} objects.`);
  return { stakedObjects, cursor: null, paused: false };
}
async function queryGraphQL(gqlClient, query, variables) {
  const options = {
    query: graphql(query),
    variables
  };
  return gqlClient.query(options);
}
function computeStats(stakedObjects, validators, totalSupply, totalStake, currentEpoch) {
  const validatorMap = /* @__PURE__ */ new Map();
  validators.forEach((v) => validatorMap.set(v.poolId, v));
  const validatorAmounts = /* @__PURE__ */ new Map();
  const validatorCounts = /* @__PURE__ */ new Map();
  const validatorTimelockedCounts = /* @__PURE__ */ new Map();
  const validatorDurations = /* @__PURE__ */ new Map();
  const validatorAddresses = /* @__PURE__ */ new Map();
  validators.forEach((v) => {
    validatorAmounts.set(v.poolId, 0n);
    validatorCounts.set(v.poolId, 0);
    validatorTimelockedCounts.set(v.poolId, 0);
    validatorDurations.set(v.poolId, 0);
    validatorAddresses.set(v.poolId, /* @__PURE__ */ new Set());
  });
  let totalStakedAmount = 0n;
  let totalNormalStakedAmount = 0n;
  let totalTimelockedAmount = 0n;
  let totalStakeDuration = 0;
  let totalTimelockedCount = 0;
  const globalAddresses = /* @__PURE__ */ new Set();
  stakedObjects.forEach((obj) => {
    const amount = obj.principal;
    const duration = currentEpoch - obj.stakeActivationEpoch;
    if (validatorAmounts.has(obj.poolId)) {
      validatorAmounts.set(obj.poolId, validatorAmounts.get(obj.poolId) + amount);
      validatorCounts.set(obj.poolId, validatorCounts.get(obj.poolId) + 1);
      validatorDurations.set(obj.poolId, validatorDurations.get(obj.poolId) + duration);
      validatorAddresses.get(obj.poolId)?.add(obj.ownerAddress);
      if (obj.isTimelocked) {
        validatorTimelockedCounts.set(
          obj.poolId,
          validatorTimelockedCounts.get(obj.poolId) + 1
        );
      }
    }
    if (obj.isTimelocked) {
      totalTimelockedCount++;
      totalTimelockedAmount += amount;
    } else {
      totalNormalStakedAmount += amount;
    }
    globalAddresses.add(obj.ownerAddress);
    totalStakedAmount += amount;
    totalStakeDuration += duration;
  });
  const validatorStatsList = [];
  validators.forEach((v) => {
    const poolId = v.poolId;
    const count = validatorCounts.get(poolId) || 0;
    const amount = validatorAmounts.get(poolId) || 0n;
    const duration = validatorDurations.get(poolId) || 0;
    const timelockedCount = validatorTimelockedCounts.get(poolId) || 0;
    const uniqueAddresses = validatorAddresses.get(poolId)?.size || 0;
    const averageStakedAmount = count > 0 ? Number(amount) / count : 0;
    const averageStakeDuration = count > 0 ? duration / count : 0;
    const stakePercentage = Number(amount) / Number(totalSupply) * 100;
    const systemStakePercentage = totalStake > 0n ? Number(v.nextEpochStake) / Number(totalStake) * 100 : 0;
    validatorStatsList.push({
      name: v.name,
      address: v.address,
      poolId: v.poolId,
      stakedObjectCount: count,
      timelockedObjectCount: timelockedCount,
      uniqueAddresses,
      totalStakedAmount: Number(amount),
      averageStakedAmount,
      averageStakeDuration,
      stakePercentage,
      systemStakePercentage
    });
  });
  validatorStatsList.sort((a, b) => b.totalStakedAmount - a.totalStakedAmount);
  const globalStats = {
    totalStakedObjects: stakedObjects.filter((o) => !o.isTimelocked).length,
    totalTimelockedObjects: totalTimelockedCount,
    totalUniqueAddresses: globalAddresses.size,
    totalStakedAmount: Number(totalStakedAmount),
    totalNormalStakedAmount: Number(totalNormalStakedAmount),
    totalTimelockedAmount: Number(totalTimelockedAmount),
    averageStakedAmount: stakedObjects.length > 0 ? Number(totalStakedAmount) / stakedObjects.length : 0,
    averageStakeDuration: stakedObjects.length > 0 ? totalStakeDuration / stakedObjects.length : 0,
    totalSupply,
    totalStakePercentage: Number(totalStakedAmount) / Number(totalSupply) * 100
  };
  return {
    validators: validatorStatsList,
    global: globalStats
  };
}
var root$1 = from_html(`<div class="charts-container svelte-23mjk6"><h2 class="svelte-23mjk6">Charts for live objects</h2> <div class="chart-row svelte-23mjk6"><div class="chart-card svelte-23mjk6"><div class="filters svelte-23mjk6"><label class="svelte-23mjk6">Min Epoch: <input type="number" class="svelte-23mjk6"/></label> <label class="svelte-23mjk6">Max Epoch: <input type="number" class="svelte-23mjk6"/></label></div> <canvas></canvas></div></div> <div class="chart-row svelte-23mjk6"><div class="chart-card svelte-23mjk6"><canvas></canvas></div> <div class="chart-card svelte-23mjk6"><canvas></canvas></div></div> <div class="chart-row svelte-23mjk6"><div class="chart-card svelte-23mjk6"><canvas></canvas></div></div></div>`);
function DelegatorsCharts($$anchor, $$props) {
  push($$props, false);
  let data = prop($$props, "data", 8);
  let stats = prop($$props, "stats", 8);
  let chartData = prop($$props, "chartData", 8);
  let stakeActivationCanvas = mutable_source();
  let stakedAmountsCanvas = mutable_source();
  let addressDistributionCanvas = mutable_source();
  let stakeCompositionCanvas = mutable_source();
  let charts = [];
  let minEpochFilter = mutable_source("");
  let maxEpochFilter = mutable_source("");
  function createStakeActivationChart() {
    if (!get(stakeActivationCanvas)) return;
    const epochCounts = chartData().epochCounts;
    const sortedEpochs = Array.from(epochCounts.keys()).sort((a, b) => a - b);
    const minEpoch = get(minEpochFilter) ? parseInt(get(minEpochFilter)) : Math.min(...sortedEpochs);
    const maxEpoch = get(maxEpochFilter) ? parseInt(get(maxEpochFilter)) : Math.max(...sortedEpochs);
    const filteredEpochs = sortedEpochs.filter((e) => e >= minEpoch && e <= maxEpoch);
    const filteredCounts = filteredEpochs.map((e) => epochCounts.get(e) || 0);
    const chart = new Chart(get(stakeActivationCanvas), {
      type: "line",
      data: {
        labels: filteredEpochs,
        datasets: [
          {
            label: "Number of Objects",
            data: filteredCounts,
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
  function updateStakeActivationChart() {
    const existingChart = charts.find((c) => c.canvas === get(stakeActivationCanvas));
    if (existingChart) {
      existingChart.destroy();
      charts = charts.filter((c) => c !== existingChart);
    }
    createStakeActivationChart();
  }
  function createStakedAmountsChart() {
    if (!get(stakedAmountsCanvas)) return;
    const bucketLabels = [
      "< 100 IOTA",
      "100-1K IOTA",
      "1K-10K IOTA",
      "10K-100K IOTA",
      "100K-1M IOTA",
      "> 1M IOTA"
    ];
    const chart = new Chart(get(stakedAmountsCanvas), {
      type: "bar",
      data: {
        labels: bucketLabels,
        datasets: [
          {
            label: "Number of Objects",
            data: chartData().amountBuckets,
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
    const bucketLabels = [
      "1 object",
      "2-5 objects",
      "6-10 objects",
      "11-50 objects",
      "> 50 objects"
    ];
    const chart = new Chart(get(addressDistributionCanvas), {
      type: "pie",
      data: {
        labels: bucketLabels,
        datasets: [
          {
            label: "Number of Addresses",
            data: chartData().addressBuckets,
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
  function createStakeCompositionChart() {
    if (!get(stakeCompositionCanvas)) return;
    const totalStake = Number(data().totalStake);
    const totalStakedAmount = stats().global.totalStakedAmount;
    const wrappedStake = Math.max(0, totalStake - totalStakedAmount);
    const chart = new Chart(get(stakeCompositionCanvas), {
      type: "pie",
      data: {
        labels: ["StakedIota", "TimelockedStakedIota", "Wrapped Stake"],
        datasets: [
          {
            label: "Stake Composition (IOTA)",
            data: [
              stats().global.totalNormalStakedAmount / 1e9,
              stats().global.totalTimelockedAmount / 1e9,
              wrappedStake / 1e9
            ],
            backgroundColor: [
              "rgba(59, 130, 246, 0.6)",
              "rgba(245, 158, 11, 0.6)",
              "rgba(148, 163, 184, 0.6)"
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(148, 163, 184, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Stake Composition" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (value / total * 100).toFixed(1) : "0.0";
                return `${label}: ${value.toLocaleString()} IOTA (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    charts.push(chart);
  }
  onMount(() => {
    console.log("DelegatorsCharts: onMount triggered");
    requestAnimationFrame(() => {
      console.time("charts total");
      console.time("chart stakeActivation");
      createStakeActivationChart();
      console.timeEnd("chart stakeActivation");
      console.time("chart stakedAmounts");
      createStakedAmountsChart();
      console.timeEnd("chart stakedAmounts");
      console.time("chart addressDistribution");
      createAddressDistributionChart();
      console.timeEnd("chart addressDistribution");
      console.time("chart stakeComposition");
      createStakeCompositionChart();
      console.timeEnd("chart stakeComposition");
      console.timeEnd("charts total");
    });
  });
  onDestroy(() => {
    charts.forEach((chart) => chart.destroy());
    charts = [];
  });
  init();
  var div = root$1();
  var div_1 = sibling(child(div), 2);
  var div_2 = child(div_1);
  var div_3 = child(div_2);
  var label_1 = child(div_3);
  var input = sibling(child(label_1));
  var label_2 = sibling(label_1, 2);
  var input_1 = sibling(child(label_2));
  var canvas = sibling(div_3, 2);
  bind_this(canvas, ($$value) => set(stakeActivationCanvas, $$value), () => get(stakeActivationCanvas));
  var div_4 = sibling(div_1, 2);
  var div_5 = child(div_4);
  var canvas_1 = child(div_5);
  bind_this(canvas_1, ($$value) => set(stakedAmountsCanvas, $$value), () => get(stakedAmountsCanvas));
  var div_6 = sibling(div_5, 2);
  var canvas_2 = child(div_6);
  bind_this(canvas_2, ($$value) => set(addressDistributionCanvas, $$value), () => get(addressDistributionCanvas));
  var div_7 = sibling(div_4, 2);
  var div_8 = child(div_7);
  var canvas_3 = child(div_8);
  bind_this(canvas_3, ($$value) => set(stakeCompositionCanvas, $$value), () => get(stakeCompositionCanvas));
  bind_value(input, () => get(minEpochFilter), ($$value) => set(minEpochFilter, $$value));
  event("input", input, updateStakeActivationChart);
  bind_value(input_1, () => get(maxEpochFilter), ($$value) => set(maxEpochFilter, $$value));
  event("input", input_1, updateStakeActivationChart);
  append($$anchor, div);
  pop();
}
var root_1 = from_html(`<div class="info-banner svelte-z1qq95"><div class="info-text svelte-z1qq95">This page aggregates only \`StakedIota\` and \`TimelockedStakedIota\` objects.
                Additional stake can be wrapped in other object types and is reflected in the
                system-state totals.</div> <div class="info-metrics svelte-z1qq95"><div> </div> <div> </div></div></div>`);
var root_2 = from_html(`<div class="info-banner svelte-z1qq95"><div class="info-text svelte-z1qq95">This page aggregates only \`StakedIota\` and \`TimelockedStakedIota\` objects.
                Additional stake can be wrapped in other object types and is reflected in the
                system-state totals.</div></div>`);
var root_3 = from_html(`<button class="svelte-z1qq95">Fetch/Refresh Data</button> <button class="svelte-z1qq95">Continue Fetching</button>`, 1);
var root_4 = from_html(`<button class="svelte-z1qq95"> </button>`);
var root_5 = from_html(`<button class="svelte-z1qq95">Pause Fetching</button>`);
var root_8 = from_html(`<div class="progress-bar-container svelte-z1qq95"><div class="progress-bar svelte-z1qq95"><div class="progress-fill svelte-z1qq95"></div></div> <span class="progress-percentage svelte-z1qq95"> </span></div>`);
var root_7 = from_html(`<div class="svelte-z1qq95"> </div> <!>`, 1);
var root_9 = from_html(`<div class="timer svelte-z1qq95"> </div>`);
var root_10 = from_html(`<div class="svelte-z1qq95"> </div>`);
var root_11 = from_html(`<div class="svelte-z1qq95"> </div>`);
var root_6 = from_html(`<div class="progress-message svelte-z1qq95"><!> <!> <!> <!></div>`);
var root_13 = from_html(`<div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Stake (System State)</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Wrapped Stake (Other Objects)</div> <div class="stat-value svelte-z1qq95"> </div></div>`, 1);
var root_14 = from_html(`<div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Stake Percentage</div> <div class="stat-value svelte-z1qq95"> </div></div>`);
var root_18 = from_html(`<th class="svelte-z1qq95">Object ID</th> <th class="svelte-z1qq95">Type</th>`, 1);
var root_19 = from_html(`<th class="svelte-z1qq95">Count</th>`);
var root_21 = from_html(`<td class="object-id-cell svelte-z1qq95"><span class="object-id-text svelte-z1qq95"> </span> <button class="copy-btn svelte-z1qq95" title="Copy object ID">📋</button></td> <td class="type-cell svelte-z1qq95"><span> </span></td>`, 1);
var root_22 = from_html(`<td class="count-cell svelte-z1qq95"> </td>`);
var root_24 = from_html(`<span class="muted svelte-z1qq95">Multiple</span>`);
var root_20 = from_html(`<tr class="svelte-z1qq95"><!><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"><!></td><td class="owner-address-cell svelte-z1qq95"><span class="owner-address-text svelte-z1qq95"> </span> <button class="copy-btn svelte-z1qq95" title="Copy owner address">📋</button></td></tr>`);
var root_25 = from_html(`<div class="objects-footer svelte-z1qq95"><div class="objects-count svelte-z1qq95"> </div> <button class="load-more-btn svelte-z1qq95">Load 200 more</button></div>`);
var root_26 = from_html(`<div class="objects-footer svelte-z1qq95"><div class="objects-count svelte-z1qq95"> </div></div>`);
var root_17 = from_html(`<tr class="details-row svelte-z1qq95"><td colspan="10" class="svelte-z1qq95"><div class="details-container svelte-z1qq95"><h3 class="svelte-z1qq95"> </h3> <div class="objects-table-container svelte-z1qq95"><table class="objects-table svelte-z1qq95"><thead><tr class="svelte-z1qq95"><!><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th></tr></thead><tbody class="svelte-z1qq95"></tbody></table></div> <!></div></td></tr>`);
var root_16 = from_html(`<tr class="svelte-z1qq95"><td class="rank-cell svelte-z1qq95"> </td><td class="name-cell svelte-z1qq95"><button class="details-btn svelte-z1qq95" title="View staked objects"> </button> <span class="validator-name svelte-z1qq95"> </span></td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td><td class="address-cell svelte-z1qq95"><span class="address-text svelte-z1qq95"> </span> <button class="copy-btn svelte-z1qq95" title="Copy address">📋</button></td></tr> <!>`, 1);
var root_15 = from_html(`<h2 class="svelte-z1qq95">Validator Statistics</h2> <p> </p> <div class="validators-table-container svelte-z1qq95"><table class="validators-table svelte-z1qq95"><thead><tr><th class="rank-header svelte-z1qq95">Rank</th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="sortable svelte-z1qq95"> </th><th class="svelte-z1qq95">Address</th></tr></thead><tbody class="svelte-z1qq95"></tbody></table></div>`, 1);
var root_28 = from_html(`<tr class="svelte-z1qq95"><td class="rank-cell svelte-z1qq95"> </td><td class="richlist-address-cell svelte-z1qq95"><span class="richlist-address-text svelte-z1qq95"> </span> <button class="copy-btn svelte-z1qq95" title="Copy address">📋</button></td><td class="numeric-cell svelte-z1qq95"> </td><td class="numeric-cell svelte-z1qq95"> </td></tr>`);
var root_29 = from_html(`<div class="objects-footer svelte-z1qq95"><div class="objects-count svelte-z1qq95"> </div> <button class="load-more-btn svelte-z1qq95">Load 200 more</button></div>`);
var root_30 = from_html(`<div class="objects-footer svelte-z1qq95"><div class="objects-count svelte-z1qq95"> </div></div>`);
var root_27 = from_html(`<h2 class="svelte-z1qq95">Delegator Richlist</h2> <div class="richlist-table-container svelte-z1qq95"><table class="richlist-table svelte-z1qq95"><thead><tr><th class="rank-header svelte-z1qq95">Rank</th><th class="svelte-z1qq95">Owner Address</th><th class="svelte-z1qq95">Total Staked (IOTA)</th><th class="svelte-z1qq95">Staked Objects</th></tr></thead><tbody class="svelte-z1qq95"></tbody></table></div> <!>`, 1);
var root_12 = from_html(`<div class="stats-container svelte-z1qq95"><h2 class="svelte-z1qq95">Global Statistics</h2> <div class="stats-grid svelte-z1qq95"><div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Staked Objects</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Timelocked Objects</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Unique Addresses</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Total Staked Amount (IOTA)</div> <div class="stat-value svelte-z1qq95"> </div></div> <!> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Average Staked Amount (IOTA)</div> <div class="stat-value svelte-z1qq95"> </div></div> <div class="stat-card svelte-z1qq95"><div class="stat-label svelte-z1qq95">Average Stake Duration (epochs)</div> <div class="stat-value svelte-z1qq95"> </div></div> <!></div></div> <!> <!> <!>`, 1);
var root = from_html(`<main class="svelte-z1qq95"><h1 class="svelte-z1qq95">Delegators Overview</h1> <!> <div class="controls svelte-z1qq95"><!> <!></div> <!> <!></main>`);
function Delegators($$anchor, $$props) {
  push($$props, true);
  let isLoading = state(false);
  let isPaused = state(false);
  let delegatorData = state(null);
  let stats = state(null);
  let progressMessage = state("");
  let normalProgress = state("");
  let timelockedProgress = state("");
  let syncPercentage = state(0);
  let abortController = state(null);
  let resumeType = state(null);
  let resumeCursor = state(null);
  let resumeTimelockedCursor = state(null);
  let resumeStakedObjects = state(proxy([]));
  let chartVersion = state(0);
  let sortColumn = state("totalStakedAmount");
  let sortDirection = state("desc");
  let expandedValidatorPoolId = state(null);
  let objectSortColumn = state("amount");
  let objectSortDirection = state("desc");
  let objectRowsLimit = state(200);
  let richlistRowsLimit = state(200);
  let startTime = state(null);
  let elapsedTime = state(0);
  let timerInterval = state(null);
  let showCharts = state(false);
  let showRichlist = state(false);
  let computedObjectsByPoolId = state(/* @__PURE__ */ new Map());
  let computedChartData = state(null);
  let computedRichlistRows = state([]);
  function computeDerivedData(stakedObjects) {
    console.time("computeDerivedData total");
    console.log("computeDerivedData: processing", stakedObjects.length, "objects");
    console.time("computeDerivedData loop");
    const objectsByPoolId = /* @__PURE__ */ new Map();
    const epochCounts = /* @__PURE__ */ new Map();
    const amountBuckets = [0, 0, 0, 0, 0, 0];
    const addressCounts = /* @__PURE__ */ new Map();
    const byOwner = /* @__PURE__ */ new Map();
    for (let i = 0; i < stakedObjects.length; i++) {
      const obj = stakedObjects[i];
      const poolObjects = objectsByPoolId.get(obj.poolId);
      if (poolObjects) {
        poolObjects.push(obj);
      } else {
        objectsByPoolId.set(obj.poolId, [obj]);
      }
      epochCounts.set(obj.stakeActivationEpoch, (epochCounts.get(obj.stakeActivationEpoch) || 0) + 1);
      const iotaAmount = Number(obj.principal) / 1e9;
      if (iotaAmount < 100) amountBuckets[0]++;
      else if (iotaAmount < 1e3) amountBuckets[1]++;
      else if (iotaAmount < 1e4) amountBuckets[2]++;
      else if (iotaAmount < 1e5) amountBuckets[3]++;
      else if (iotaAmount < 1e6) amountBuckets[4]++;
      else amountBuckets[5]++;
      addressCounts.set(obj.ownerAddress, (addressCounts.get(obj.ownerAddress) || 0) + 1);
      const existing = byOwner.get(obj.ownerAddress);
      if (existing) {
        existing.totalStakedAmount += obj.principal;
        existing.objectCount += 1;
      } else {
        byOwner.set(obj.ownerAddress, {
          ownerAddress: obj.ownerAddress,
          totalStakedAmount: obj.principal,
          objectCount: 1
        });
      }
    }
    console.timeEnd("computeDerivedData loop");
    console.time("computeDerivedData addressBuckets");
    const addressBuckets = [0, 0, 0, 0, 0];
    for (const count of addressCounts.values()) {
      if (count === 1) addressBuckets[0]++;
      else if (count <= 5) addressBuckets[1]++;
      else if (count <= 10) addressBuckets[2]++;
      else if (count <= 50) addressBuckets[3]++;
      else addressBuckets[4]++;
    }
    console.timeEnd("computeDerivedData addressBuckets");
    console.time("computeDerivedData sort");
    const richlistRows = Array.from(byOwner.values());
    richlistRows.sort((a, b) => {
      if (a.totalStakedAmount === b.totalStakedAmount) {
        return b.objectCount - a.objectCount;
      }
      return a.totalStakedAmount > b.totalStakedAmount ? -1 : 1;
    });
    console.timeEnd("computeDerivedData sort");
    set(computedObjectsByPoolId, objectsByPoolId);
    set(computedChartData, { epochCounts, amountBuckets, addressBuckets });
    set(computedRichlistRows, richlistRows);
    console.timeEnd("computeDerivedData total");
  }
  function sortValidators(column) {
    if (get(sortColumn) === column) {
      set(sortDirection, get(sortDirection) === "asc" ? "desc" : "asc", true);
    } else {
      set(sortColumn, column, true);
      set(sortDirection, "desc");
    }
    if (get(stats)) {
      get(stats).validators.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        if (typeof aVal === "string") {
          return get(sortDirection) === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else {
          return get(sortDirection) === "asc" ? aVal - bVal : bVal - aVal;
        }
      });
      set(stats, { ...get(stats), validators: [...get(stats).validators] }, true);
    }
  }
  function getSortIcon(column) {
    if (get(sortColumn) !== column) return "";
    return get(sortDirection) === "asc" ? "↑" : "↓";
  }
  function toggleValidatorDetails(poolId) {
    if (get(expandedValidatorPoolId) === poolId) {
      set(expandedValidatorPoolId, null);
    } else {
      set(expandedValidatorPoolId, poolId, true);
      set(objectRowsLimit, 200);
    }
  }
  function getValidatorStakedObjects(poolId) {
    return get(computedObjectsByPoolId).get(poolId) || [];
  }
  function sortObjectTable(column) {
    if (get(objectSortColumn) === column) {
      set(objectSortDirection, get(objectSortDirection) === "asc" ? "desc" : "asc", true);
    } else {
      set(objectSortColumn, column, true);
      set(objectSortDirection, "desc");
    }
    set(objectRowsLimit, 200);
  }
  function getObjectSortIcon(column) {
    if (get(objectSortColumn) !== column) return "";
    return get(objectSortDirection) === "asc" ? "↑" : "↓";
  }
  function formatElapsedTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
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
    set(startTime, Date.now(), true);
    set(elapsedTime, 0);
    if (get(timerInterval)) {
      clearInterval(get(timerInterval));
    }
    set(
      timerInterval,
      setInterval(
        () => {
          if (get(startTime)) {
            set(elapsedTime, Math.floor((Date.now() - get(startTime)) / 1e3), true);
          }
        },
        1e3
      ),
      true
    );
  }
  function stopTimer() {
    if (get(timerInterval)) {
      clearInterval(get(timerInterval));
      set(timerInterval, null);
    }
  }
  function getSortedObjectRows(poolId) {
    const objects = getValidatorStakedObjects(poolId);
    if (get(objectSortColumn) === "owner") {
      const groupedMap = /* @__PURE__ */ new Map();
      for (const obj of objects) {
        const existing = groupedMap.get(obj.ownerAddress);
        if (existing) {
          existing.amount += obj.principal;
          existing.objectCount++;
          existing.objectIds.push(obj.id);
        } else {
          groupedMap.set(obj.ownerAddress, {
            ownerAddress: obj.ownerAddress,
            amount: obj.principal,
            activationEpoch: obj.stakeActivationEpoch,
            objectCount: 1,
            objectIds: [obj.id]
          });
        }
      }
      const grouped = Array.from(groupedMap.values());
      grouped.sort((a, b) => {
        const cmp = Number(b.amount - a.amount);
        return get(objectSortDirection) === "asc" ? -cmp : cmp;
      });
      return grouped;
    } else {
      const rows = objects.map((obj) => ({
        id: obj.id,
        ownerAddress: obj.ownerAddress,
        amount: obj.principal,
        activationEpoch: obj.stakeActivationEpoch,
        isTimelocked: obj.isTimelocked
      }));
      rows.sort((a, b) => {
        let aVal;
        let bVal;
        if (get(objectSortColumn) === "amount") {
          aVal = Number(a.amount);
          bVal = Number(b.amount);
        } else if (get(objectSortColumn) === "epoch") {
          aVal = a.activationEpoch;
          bVal = b.activationEpoch;
        } else {
          return 0;
        }
        return get(objectSortDirection) === "asc" ? aVal - bVal : bVal - aVal;
      });
      return rows;
    }
  }
  async function fetchData() {
    try {
      set(isLoading, true);
      set(isPaused, false);
      if (!get(resumeType)) {
        set(delegatorData, null);
        set(stats, null);
        set(syncPercentage, 0);
        startTimer();
      } else {
        if (get(startTime)) {
          const pausedElapsed = get(elapsedTime);
          set(startTime, Date.now() - pausedElapsed * 1e3);
          if (get(timerInterval)) clearInterval(get(timerInterval));
          set(
            timerInterval,
            setInterval(
              () => {
                if (get(startTime)) {
                  set(elapsedTime, Math.floor((Date.now() - get(startTime)) / 1e3), true);
                }
              },
              1e3
            ),
            true
          );
        }
      }
      set(
        progressMessage,
        get(resumeType) ? "Resuming data fetch..." : "Starting to fetch delegator data...",
        true
      );
      set(abortController, new AbortController(), true);
      const client = getClient(true);
      const result = await fetchDelegatorData(
        client,
        (progress, currentData, currentStats) => {
          if (progress.startsWith("[Normal]")) {
            set(normalProgress, progress.replace("[Normal] ", ""), true);
          } else if (progress.startsWith("[Timelocked]")) {
            set(timelockedProgress, progress.replace("[Timelocked] ", ""), true);
          } else {
            set(progressMessage, progress, true);
            set(normalProgress, "");
            set(timelockedProgress, "");
          }
          if (currentData && currentStats) {
            set(delegatorData, currentData, true);
            set(
              stats,
              {
                validators: [...currentStats.validators],
                global: currentStats.global
              },
              true
            );
            update(chartVersion);
            const totalStakeFromSystem = Number(currentData.totalStake);
            const syncedStake = currentStats.global.totalStakedAmount;
            const calculatedSyncPercentage = totalStakeFromSystem > 0 ? syncedStake / totalStakeFromSystem * 100 : 0;
            set(syncPercentage, calculatedSyncPercentage, true);
            let estimatedTimeMessage = "";
            if (get(elapsedTime) > 0 && get(syncPercentage) > 0 && get(syncPercentage) < 100) {
              const remainingPercentage = 100 - get(syncPercentage);
              const estimatedRemainingSeconds = Math.round(get(elapsedTime) * remainingPercentage / get(syncPercentage));
              estimatedTimeMessage = ` • ETA: ${formatElapsedTime(estimatedRemainingSeconds)}`;
            }
            set(progressMessage, `Syncing data... ${get(syncPercentage).toFixed(2)}% complete${estimatedTimeMessage}`);
          }
        },
        () => get(isPaused),
        get(abortController).signal,
        get(resumeType),
        get(resumeCursor),
        get(resumeTimelockedCursor),
        get(resumeStakedObjects)
      );
      if (result.resumeType) {
        stopTimer();
        set(resumeType, result.resumeType, true);
        set(resumeCursor, result.resumeCursor || null, true);
        set(resumeTimelockedCursor, result.resumeTimelockedCursor || null, true);
        set(resumeStakedObjects, result.resumeStakedObjects || [], true);
        set(progressMessage, `Data fetch was paused after ${formatElapsedTime(get(elapsedTime))} (${get(syncPercentage).toFixed(2)}% synced). Preparing display...`);
        set(normalProgress, "");
        set(timelockedProgress, "");
        console.time("paused: computeDerivedData");
        computeDerivedData(result.resumeStakedObjects || []);
        console.timeEnd("paused: computeDerivedData");
        console.time("paused: tick+showRichlist");
        await tick();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        set(showRichlist, true);
        console.timeEnd("paused: tick+showRichlist");
        console.time("paused: tick+showCharts");
        await tick();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        set(showCharts, true);
        console.timeEnd("paused: tick+showCharts");
        set(progressMessage, `Data fetch was paused after ${formatElapsedTime(get(elapsedTime))} (${get(syncPercentage).toFixed(2)}% synced).`);
      } else {
        stopTimer();
        console.time("completed: assign delegatorData");
        set(delegatorData, result.data, true);
        console.timeEnd("completed: assign delegatorData");
        set(
          stats,
          {
            validators: [...result.stats.validators],
            global: result.stats.global
          },
          true
        );
        set(progressMessage, `Data fetch completed in ${formatElapsedTime(get(elapsedTime))}! Preparing display...`);
        set(normalProgress, "");
        set(timelockedProgress, "");
        set(syncPercentage, 100);
        set(resumeType, null);
        set(resumeCursor, null);
        set(resumeTimelockedCursor, null);
        set(resumeStakedObjects, [], true);
        console.time("completed: computeDerivedData");
        computeDerivedData(result.data.stakedObjects);
        console.timeEnd("completed: computeDerivedData");
        console.time("completed: tick+showRichlist");
        await tick();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        set(showRichlist, true);
        console.timeEnd("completed: tick+showRichlist");
        console.time("completed: tick+showCharts");
        await tick();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        set(showCharts, true);
        console.timeEnd("completed: tick+showCharts");
        set(progressMessage, `Data fetch completed in ${formatElapsedTime(get(elapsedTime))}!`);
      }
    } catch (err) {
      stopTimer();
      if (err.name === "AbortError") {
        set(progressMessage, `Data fetch was paused after ${formatElapsedTime(get(elapsedTime))} (${get(syncPercentage).toFixed(2)}% synced).`);
      } else {
        set(progressMessage, `Error after ${formatElapsedTime(get(elapsedTime))}: ${err.toString()}`);
        console.error(err);
      }
      set(normalProgress, "");
      set(timelockedProgress, "");
    } finally {
      set(isLoading, false);
    }
  }
  function startFreshFetch() {
    set(resumeType, null);
    set(resumeCursor, null);
    set(resumeTimelockedCursor, null);
    set(resumeStakedObjects, [], true);
    set(startTime, null);
    set(elapsedTime, 0);
    set(showCharts, false);
    set(showRichlist, false);
    fetchData();
  }
  function pauseFetching() {
    set(isPaused, true);
    if (get(abortController)) {
      get(abortController).abort();
    }
    stopTimer();
    set(showCharts, false);
    set(showRichlist, false);
    set(progressMessage, `Fetching paused by user after ${formatElapsedTime(get(elapsedTime))} (${get(syncPercentage).toFixed(2)}% synced).`);
  }
  onDestroy(() => {
    if (get(abortController)) {
      get(abortController).abort();
    }
    stopTimer();
  });
  var main = root();
  var node = sibling(child(main), 2);
  {
    var consequent = ($$anchor2) => {
      const wrappedStake = user_derived(() => Math.max(0, Number(get(delegatorData).totalStake) - get(stats).global.totalStakedAmount));
      var div = root_1();
      var div_1 = sibling(child(div), 2);
      var div_2 = child(div_1);
      var text2 = child(div_2);
      var div_3 = sibling(div_2, 2);
      var text_1 = child(div_3);
      template_effect(
        ($0, $1) => {
          set_text(text2, `System total stake: ${$0 ?? ""} IOTA`);
          set_text(text_1, `Wrapped stake (other objects): ${$1 ?? ""} IOTA`);
        },
        [
          () => (Number(get(delegatorData).totalStake) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          () => (get(wrappedStake) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ]
      );
      append($$anchor2, div);
    };
    var alternate = ($$anchor2) => {
      var div_4 = root_2();
      append($$anchor2, div_4);
    };
    if_block(node, ($$render) => {
      if (get(delegatorData) && get(stats)) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  var div_5 = sibling(node, 2);
  var node_1 = child(div_5);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment = root_3();
      var button = first_child(fragment);
      var button_1 = sibling(button, 2);
      delegated("click", button, startFreshFetch);
      delegated("click", button_1, fetchData);
      append($$anchor2, fragment);
    };
    var consequent_2 = ($$anchor2) => {
      var button_2 = root_4();
      var text_2 = child(button_2);
      template_effect(() => {
        button_2.disabled = get(isLoading);
        set_text(text_2, get(isLoading) ? "Fetching..." : "Fetch/Refresh Data");
      });
      delegated("click", button_2, fetchData);
      append($$anchor2, button_2);
    };
    if_block(node_1, ($$render) => {
      if (get(resumeType) && !get(isLoading)) $$render(consequent_1);
      else if (!get(isLoading)) $$render(consequent_2, 1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var button_3 = root_5();
      delegated("click", button_3, pauseFetching);
      append($$anchor2, button_3);
    };
    if_block(node_2, ($$render) => {
      if (get(isLoading)) $$render(consequent_3);
    });
  }
  var node_3 = sibling(div_5, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var div_6 = root_6();
      var node_4 = child(div_6);
      {
        var consequent_5 = ($$anchor3) => {
          var fragment_1 = root_7();
          var div_7 = first_child(fragment_1);
          var text_3 = child(div_7);
          var node_5 = sibling(div_7, 2);
          {
            var consequent_4 = ($$anchor4) => {
              var div_8 = root_8();
              var div_9 = child(div_8);
              var div_10 = child(div_9);
              var span = sibling(div_9, 2);
              var text_4 = child(span);
              template_effect(
                ($0) => {
                  set_style(div_10, `width: ${get(syncPercentage) ?? ""}%`);
                  set_text(text_4, `${$0 ?? ""}%`);
                },
                [() => get(syncPercentage).toFixed(1)]
              );
              append($$anchor4, div_8);
            };
            if_block(node_5, ($$render) => {
              if (get(isLoading) && get(syncPercentage) > 0) $$render(consequent_4);
            });
          }
          template_effect(() => set_text(text_3, get(progressMessage)));
          append($$anchor3, fragment_1);
        };
        if_block(node_4, ($$render) => {
          if (get(progressMessage)) $$render(consequent_5);
        });
      }
      var node_6 = sibling(node_4, 2);
      {
        var consequent_6 = ($$anchor3) => {
          var div_11 = root_9();
          var text_5 = child(div_11);
          template_effect(($0) => set_text(text_5, `Elapsed time: ${$0 ?? ""}`), [() => formatElapsedTime(get(elapsedTime))]);
          append($$anchor3, div_11);
        };
        if_block(node_6, ($$render) => {
          if (get(isLoading) && get(elapsedTime) > 0) $$render(consequent_6);
        });
      }
      var node_7 = sibling(node_6, 2);
      {
        var consequent_7 = ($$anchor3) => {
          var div_12 = root_10();
          var text_6 = child(div_12);
          template_effect(() => set_text(text_6, `Normal Staked: ${get(normalProgress) ?? ""}`));
          append($$anchor3, div_12);
        };
        if_block(node_7, ($$render) => {
          if (get(normalProgress)) $$render(consequent_7);
        });
      }
      var node_8 = sibling(node_7, 2);
      {
        var consequent_8 = ($$anchor3) => {
          var div_13 = root_11();
          var text_7 = child(div_13);
          template_effect(() => set_text(text_7, `Timelocked Staked: ${get(timelockedProgress) ?? ""}`));
          append($$anchor3, div_13);
        };
        if_block(node_8, ($$render) => {
          if (get(timelockedProgress)) $$render(consequent_8);
        });
      }
      append($$anchor2, div_6);
    };
    if_block(node_3, ($$render) => {
      if (get(progressMessage) || get(normalProgress) || get(timelockedProgress)) $$render(consequent_9);
    });
  }
  var node_9 = sibling(node_3, 2);
  {
    var consequent_23 = ($$anchor2) => {
      var fragment_2 = root_12();
      var div_14 = first_child(fragment_2);
      var div_15 = sibling(child(div_14), 2);
      var div_16 = child(div_15);
      var div_17 = sibling(child(div_16), 2);
      var text_8 = child(div_17);
      var div_18 = sibling(div_16, 2);
      var div_19 = sibling(child(div_18), 2);
      var text_9 = child(div_19);
      var div_20 = sibling(div_18, 2);
      var div_21 = sibling(child(div_20), 2);
      var text_10 = child(div_21);
      var div_22 = sibling(div_20, 2);
      var div_23 = sibling(child(div_22), 2);
      var text_11 = child(div_23);
      var node_10 = sibling(div_22, 2);
      {
        var consequent_10 = ($$anchor3) => {
          var fragment_3 = root_13();
          var div_24 = first_child(fragment_3);
          var div_25 = sibling(child(div_24), 2);
          var text_12 = child(div_25);
          var div_26 = sibling(div_24, 2);
          var div_27 = sibling(child(div_26), 2);
          var text_13 = child(div_27);
          template_effect(
            ($0, $1) => {
              set_text(text_12, $0);
              set_text(text_13, $1);
            },
            [
              () => (Number(get(delegatorData).totalStake) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              () => (Math.max(0, Number(get(delegatorData).totalStake) - get(stats).global.totalStakedAmount) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ]
          );
          append($$anchor3, fragment_3);
        };
        if_block(node_10, ($$render) => {
          if (get(delegatorData)) $$render(consequent_10);
        });
      }
      var div_28 = sibling(node_10, 2);
      var div_29 = sibling(child(div_28), 2);
      var text_14 = child(div_29);
      var div_30 = sibling(div_28, 2);
      var div_31 = sibling(child(div_30), 2);
      var text_15 = child(div_31);
      var node_11 = sibling(div_30, 2);
      {
        var consequent_11 = ($$anchor3) => {
          var div_32 = root_14();
          var div_33 = sibling(child(div_32), 2);
          var text_16 = child(div_33);
          template_effect(($0) => set_text(text_16, `${$0 ?? ""}%`), [() => get(stats).global.totalStakePercentage.toFixed(2)]);
          append($$anchor3, div_32);
        };
        if_block(node_11, ($$render) => {
          if (get(stats).global.totalSupply) $$render(consequent_11);
        });
      }
      var node_12 = sibling(div_14, 2);
      {
        var consequent_18 = ($$anchor3) => {
          var fragment_4 = root_15();
          var p = sibling(first_child(fragment_4), 2);
          var text_17 = child(p);
          var div_34 = sibling(p, 2);
          var table = child(div_34);
          var thead = child(table);
          var tr = child(thead);
          var th = sibling(child(tr));
          var text_18 = child(th);
          var th_1 = sibling(th);
          var text_19 = child(th_1);
          var th_2 = sibling(th_1);
          var text_20 = child(th_2);
          var th_3 = sibling(th_2);
          var text_21 = child(th_3);
          var th_4 = sibling(th_3);
          var text_22 = child(th_4);
          var th_5 = sibling(th_4);
          var text_23 = child(th_5);
          var th_6 = sibling(th_5);
          var text_24 = child(th_6);
          var th_7 = sibling(th_6);
          var text_25 = child(th_7);
          var th_8 = sibling(th_7);
          var text_26 = child(th_8);
          var tbody = sibling(thead);
          each(tbody, 23, () => get(stats).validators, (validator) => validator.address, ($$anchor4, validator, index$1) => {
            var fragment_5 = root_16();
            var tr_1 = first_child(fragment_5);
            var td = child(tr_1);
            var text_27 = child(td);
            var td_1 = sibling(td);
            var button_4 = child(td_1);
            var text_28 = child(button_4);
            var span_1 = sibling(button_4, 2);
            var text_29 = child(span_1);
            var td_2 = sibling(td_1);
            var text_30 = child(td_2);
            var td_3 = sibling(td_2);
            var text_31 = child(td_3);
            var td_4 = sibling(td_3);
            var text_32 = child(td_4);
            var td_5 = sibling(td_4);
            var text_33 = child(td_5);
            var td_6 = sibling(td_5);
            var text_34 = child(td_6);
            var td_7 = sibling(td_6);
            var text_35 = child(td_7);
            var td_8 = sibling(td_7);
            var text_36 = child(td_8);
            var td_9 = sibling(td_8);
            var text_37 = child(td_9);
            var td_10 = sibling(td_9);
            var span_2 = child(td_10);
            var text_38 = child(span_2);
            var button_5 = sibling(span_2, 2);
            var node_13 = sibling(tr_1, 2);
            {
              var consequent_17 = ($$anchor5) => {
                const objectRows = user_derived(() => getSortedObjectRows(get(validator).poolId));
                var tr_2 = root_17();
                var td_11 = child(tr_2);
                var div_35 = child(td_11);
                var h3 = child(div_35);
                var text_39 = child(h3);
                var div_36 = sibling(h3, 2);
                var table_1 = child(div_36);
                var thead_1 = child(table_1);
                var tr_3 = child(thead_1);
                var node_14 = child(tr_3);
                {
                  var consequent_12 = ($$anchor6) => {
                    var fragment_6 = root_18();
                    append($$anchor6, fragment_6);
                  };
                  var alternate_1 = ($$anchor6) => {
                    var th_9 = root_19();
                    append($$anchor6, th_9);
                  };
                  if_block(node_14, ($$render) => {
                    if (get(objectSortColumn) !== "owner") $$render(consequent_12);
                    else $$render(alternate_1, false);
                  });
                }
                var th_10 = sibling(node_14);
                var text_40 = child(th_10);
                var th_11 = sibling(th_10);
                var text_41 = child(th_11);
                var th_12 = sibling(th_11);
                var text_42 = child(th_12);
                var tbody_1 = sibling(thead_1);
                each(tbody_1, 21, () => get(objectRows).slice(0, get(objectRowsLimit)), index, ($$anchor6, row) => {
                  var tr_4 = root_20();
                  var node_15 = child(tr_4);
                  {
                    var consequent_13 = ($$anchor7) => {
                      var fragment_7 = root_21();
                      var td_12 = first_child(fragment_7);
                      var span_3 = child(td_12);
                      var text_43 = child(span_3);
                      var button_6 = sibling(span_3, 2);
                      var td_13 = sibling(td_12, 2);
                      var span_4 = child(td_13);
                      let classes;
                      var text_44 = child(span_4);
                      template_effect(
                        ($0, $1) => {
                          set_text(text_43, `${$0 ?? ""}...${$1 ?? ""}`);
                          classes = set_class(span_4, 1, "type-badge svelte-z1qq95", null, classes, { timelocked: get(row).isTimelocked });
                          set_text(text_44, get(row).isTimelocked ? "Timelocked" : "Normal");
                        },
                        [
                          () => get(row).id.slice(0, 10),
                          () => get(row).id.slice(-8)
                        ]
                      );
                      delegated("click", button_6, () => navigator.clipboard.writeText(get(row).id));
                      append($$anchor7, fragment_7);
                    };
                    var alternate_2 = ($$anchor7) => {
                      var td_14 = root_22();
                      var text_45 = child(td_14);
                      template_effect(() => set_text(text_45, `${get(row).objectCount ?? ""} object${get(row).objectCount !== 1 ? "s" : ""}`));
                      append($$anchor7, td_14);
                    };
                    if_block(node_15, ($$render) => {
                      if (get(row).id) $$render(consequent_13);
                      else $$render(alternate_2, false);
                    });
                  }
                  var td_15 = sibling(node_15);
                  var text_46 = child(td_15);
                  var td_16 = sibling(td_15);
                  var node_16 = child(td_16);
                  {
                    var consequent_14 = ($$anchor7) => {
                      var text_47 = text();
                      template_effect(($0) => set_text(text_47, $0), [() => get(row).activationEpoch.toLocaleString()]);
                      append($$anchor7, text_47);
                    };
                    var alternate_3 = ($$anchor7) => {
                      var span_5 = root_24();
                      append($$anchor7, span_5);
                    };
                    if_block(node_16, ($$render) => {
                      if (get(row).id) $$render(consequent_14);
                      else $$render(alternate_3, false);
                    });
                  }
                  var td_17 = sibling(td_16);
                  var span_6 = child(td_17);
                  var text_48 = child(span_6);
                  var button_7 = sibling(span_6, 2);
                  template_effect(
                    ($0, $1, $2) => {
                      set_text(text_46, $0);
                      set_text(text_48, `${$1 ?? ""}...${$2 ?? ""}`);
                    },
                    [
                      () => (Number(get(row).amount) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                      () => get(row).ownerAddress.slice(0, 10),
                      () => get(row).ownerAddress.slice(-8)
                    ]
                  );
                  delegated("click", button_7, () => navigator.clipboard.writeText(get(row).ownerAddress));
                  append($$anchor6, tr_4);
                });
                var node_17 = sibling(div_36, 2);
                {
                  var consequent_15 = ($$anchor6) => {
                    var div_37 = root_25();
                    var div_38 = child(div_37);
                    var text_49 = child(div_38);
                    var button_8 = sibling(div_38, 2);
                    template_effect(
                      ($0, $1) => set_text(text_49, `Showing ${$0 ?? ""} of
                                                        ${$1 ?? ""} objects`),
                      [
                        () => get(objectRowsLimit).toLocaleString(),
                        () => get(objectRows).length.toLocaleString()
                      ]
                    );
                    delegated("click", button_8, () => set(objectRowsLimit, get(objectRowsLimit) + 200));
                    append($$anchor6, div_37);
                  };
                  var consequent_16 = ($$anchor6) => {
                    var div_39 = root_26();
                    var div_40 = child(div_39);
                    var text_50 = child(div_40);
                    template_effect(($0) => set_text(text_50, `Showing ${$0 ?? ""} objects`), [() => get(objectRows).length.toLocaleString()]);
                    append($$anchor6, div_39);
                  };
                  if_block(node_17, ($$render) => {
                    if (get(objectRows).length > get(objectRowsLimit)) $$render(consequent_15);
                    else if (get(objectRows).length > 0) $$render(consequent_16, 1);
                  });
                }
                template_effect(
                  ($0, $1, $2) => {
                    set_text(text_39, `Staked Objects for ${get(validator).name ?? ""}`);
                    set_text(text_40, `Amount (IOTA) ${$0 ?? ""}`);
                    set_text(text_41, `Activation Epoch ${$1 ?? ""}`);
                    set_text(text_42, `Owner Address ${$2 ?? ""}`);
                  },
                  [
                    () => getObjectSortIcon("amount"),
                    () => getObjectSortIcon("epoch"),
                    () => getObjectSortIcon("owner")
                  ]
                );
                delegated("click", th_10, () => sortObjectTable("amount"));
                delegated("click", th_11, () => sortObjectTable("epoch"));
                delegated("click", th_12, () => sortObjectTable("owner"));
                append($$anchor5, tr_2);
              };
              if_block(node_13, ($$render) => {
                if (get(expandedValidatorPoolId) === get(validator).poolId) $$render(consequent_17);
              });
            }
            template_effect(
              ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) => {
                set_text(text_27, get(index$1) + 1);
                set_text(text_28, get(expandedValidatorPoolId) === get(validator).poolId ? "▼" : "▶");
                set_text(text_29, get(validator).name);
                set_text(text_30, $0);
                set_text(text_31, $1);
                set_text(text_32, $2);
                set_text(text_33, $3);
                set_text(text_34, $4);
                set_text(text_35, $5);
                set_text(text_36, `${$6 ?? ""}%`);
                set_text(text_37, `${$7 ?? ""}%`);
                set_text(text_38, `${$8 ?? ""}...${$9 ?? ""}`);
              },
              [
                () => get(validator).stakedObjectCount.toLocaleString(),
                () => get(validator).timelockedObjectCount.toLocaleString(),
                () => get(validator).uniqueAddresses.toLocaleString(),
                () => (get(validator).totalStakedAmount / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                () => (get(validator).averageStakedAmount / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                () => get(validator).averageStakeDuration.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                () => get(validator).stakePercentage.toFixed(2),
                () => get(validator).systemStakePercentage.toFixed(2),
                () => get(validator).address.slice(0, 10),
                () => get(validator).address.slice(-8)
              ]
            );
            delegated("click", button_4, () => toggleValidatorDetails(get(validator).poolId));
            delegated("click", button_5, () => navigator.clipboard.writeText(get(validator).address));
            append($$anchor4, fragment_5);
          });
          template_effect(
            ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
              set_text(text_17, `Showing ${get(stats).validators.length ?? ""} validators`);
              set_text(text_18, `Validator Name ${$0 ?? ""}`);
              set_text(text_19, `Staked Objects ${$1 ?? ""}`);
              set_text(text_20, `Timelocked Objects ${$2 ?? ""}`);
              set_text(text_21, `Unique Addresses ${$3 ?? ""}`);
              set_text(text_22, `Total Staked (IOTA) ${$4 ?? ""}`);
              set_text(text_23, `Avg Amount (IOTA) ${$5 ?? ""}`);
              set_text(text_24, `Avg Duration (epochs) ${$6 ?? ""}`);
              set_text(text_25, `Stake % (Objects) ${$7 ?? ""}`);
              set_text(text_26, `Stake % (System) ${$8 ?? ""}`);
            },
            [
              () => getSortIcon("name"),
              () => getSortIcon("stakedObjectCount"),
              () => getSortIcon("timelockedObjectCount"),
              () => getSortIcon("uniqueAddresses"),
              () => getSortIcon("totalStakedAmount"),
              () => getSortIcon("averageStakedAmount"),
              () => getSortIcon("averageStakeDuration"),
              () => getSortIcon("stakePercentage"),
              () => getSortIcon("systemStakePercentage")
            ]
          );
          delegated("click", th, () => sortValidators("name"));
          delegated("click", th_1, () => sortValidators("stakedObjectCount"));
          delegated("click", th_2, () => sortValidators("timelockedObjectCount"));
          delegated("click", th_3, () => sortValidators("uniqueAddresses"));
          delegated("click", th_4, () => sortValidators("totalStakedAmount"));
          delegated("click", th_5, () => sortValidators("averageStakedAmount"));
          delegated("click", th_6, () => sortValidators("averageStakeDuration"));
          delegated("click", th_7, () => sortValidators("stakePercentage"));
          delegated("click", th_8, () => sortValidators("systemStakePercentage"));
          append($$anchor3, fragment_4);
        };
        if_block(node_12, ($$render) => {
          if (get(stats) && !get(isLoading)) $$render(consequent_18);
        });
      }
      var node_18 = sibling(node_12, 2);
      {
        var consequent_21 = ($$anchor3) => {
          var fragment_9 = root_27();
          var div_41 = sibling(first_child(fragment_9), 2);
          var table_2 = child(div_41);
          var tbody_2 = sibling(child(table_2));
          each(tbody_2, 23, () => get(computedRichlistRows).slice(0, get(richlistRowsLimit)), (row) => row.ownerAddress, ($$anchor4, row, index2) => {
            var tr_5 = root_28();
            var td_18 = child(tr_5);
            var text_51 = child(td_18);
            var td_19 = sibling(td_18);
            var span_7 = child(td_19);
            var text_52 = child(span_7);
            var button_9 = sibling(span_7, 2);
            var td_20 = sibling(td_19);
            var text_53 = child(td_20);
            var td_21 = sibling(td_20);
            var text_54 = child(td_21);
            template_effect(
              ($0, $1) => {
                set_text(text_51, get(index2) + 1);
                set_text(text_52, get(row).ownerAddress);
                set_text(text_53, $0);
                set_text(text_54, $1);
              },
              [
                () => (Number(get(row).totalStakedAmount) / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                () => get(row).objectCount.toLocaleString()
              ]
            );
            delegated("click", button_9, () => navigator.clipboard.writeText(get(row).ownerAddress));
            append($$anchor4, tr_5);
          });
          var node_19 = sibling(div_41, 2);
          {
            var consequent_19 = ($$anchor4) => {
              var div_42 = root_29();
              var div_43 = child(div_42);
              var text_55 = child(div_43);
              var button_10 = sibling(div_43, 2);
              template_effect(
                ($0, $1) => set_text(text_55, `Showing ${$0 ?? ""} of ${$1 ?? ""}
                        addresses`),
                [
                  () => get(richlistRowsLimit).toLocaleString(),
                  () => get(computedRichlistRows).length.toLocaleString()
                ]
              );
              delegated("click", button_10, () => set(richlistRowsLimit, get(richlistRowsLimit) + 200));
              append($$anchor4, div_42);
            };
            var consequent_20 = ($$anchor4) => {
              var div_44 = root_30();
              var div_45 = child(div_44);
              var text_56 = child(div_45);
              template_effect(($0) => set_text(text_56, `Showing ${$0 ?? ""} addresses`), [() => get(computedRichlistRows).length.toLocaleString()]);
              append($$anchor4, div_44);
            };
            if_block(node_19, ($$render) => {
              if (get(computedRichlistRows).length > get(richlistRowsLimit)) $$render(consequent_19);
              else if (get(computedRichlistRows).length > 0) $$render(consequent_20, 1);
            });
          }
          append($$anchor3, fragment_9);
        };
        if_block(node_18, ($$render) => {
          if (get(delegatorData) && !get(isLoading) && get(showRichlist)) $$render(consequent_21);
        });
      }
      var node_20 = sibling(node_18, 2);
      {
        var consequent_22 = ($$anchor3) => {
          var fragment_10 = comment();
          var node_21 = first_child(fragment_10);
          key(node_21, () => get(chartVersion), ($$anchor4) => {
            DelegatorsCharts($$anchor4, {
              get data() {
                return get(delegatorData);
              },
              get stats() {
                return get(stats);
              },
              get chartData() {
                return get(computedChartData);
              }
            });
          });
          append($$anchor3, fragment_10);
        };
        if_block(node_20, ($$render) => {
          if (get(delegatorData) && !get(isLoading) && get(showCharts) && get(computedChartData)) $$render(consequent_22);
        });
      }
      template_effect(
        ($0, $1, $2, $3, $4, $5) => {
          set_text(text_8, $0);
          set_text(text_9, $1);
          set_text(text_10, $2);
          set_text(text_11, $3);
          set_text(text_14, $4);
          set_text(text_15, $5);
        },
        [
          () => get(stats).global.totalStakedObjects.toLocaleString(),
          () => get(stats).global.totalTimelockedObjects.toLocaleString(),
          () => get(stats).global.totalUniqueAddresses.toLocaleString(),
          () => (get(stats).global.totalStakedAmount / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          () => (get(stats).global.averageStakedAmount / 1e9).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          () => get(stats).global.averageStakeDuration.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ]
      );
      append($$anchor2, fragment_2);
    };
    if_block(node_9, ($$render) => {
      if (get(stats)) $$render(consequent_23);
    });
  }
  append($$anchor, main);
  pop();
}
delegate(["click"]);
export {
  Delegators as default
};

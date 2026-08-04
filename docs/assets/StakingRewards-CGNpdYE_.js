const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-DFDj40yB.js","assets/rolldown-runtime-D3Q5gio6.js","assets/index-RSDd7ke0.js","assets/disclose-version-CpEJO7r1.js","assets/legacy-DxVWxrJw.js","assets/client-BTFoHz6u.js","assets/keypair-DsT3ivIR.js","assets/mainnet-transaction-confirmation-bplSEzLB.js","assets/transaction-view-OeA30yKg.js","assets/transaction-view-QnfdbPMt.css","assets/explorer-links-hyzWVZGi.js","assets/client-CmDrt-ez.js","assets/transaction-execution-Cg5fkaOd.js","assets/signer-data-D1Egmbld.js","assets/index-BwwTFTu_.css","assets/typeof-CRRZfkuU.js"])))=>i.map(i=>d[i]);
import { $ as untrack, B as comment, C as bind_select_value, Ct as get$1, D as set_class, Dt as pop, E as set_style, G as event, H as text, I as if_block, J as deep_read_state, Mt as reset, N as each, Nt as noop, Ot as push, P as index, Pt as to_array, R as set_text, S as set_value, U as delegate, V as from_html, W as delegated, Y as get, _ as attribute_effect, _t as remove_textarea_child, a as rest_props, at as user_effect, ct as sibling, d as bind_element_size, dt as mutate, ft as set, g as STYLE, gt as user_derived, h as bind_value, ht as derived_safe_equal, i as prop, it as template_effect, j as snippet, jt as next, k as action, lt as proxy, m as bind_group, n as onDestroy, nt as legacy_pre_effect_reset, ot as child, p as bind_checked, pt as state, r as onMount, s as init, st as first_child, tt as legacy_pre_effect, u as bind_this, ut as mutable_source, v as remove_input_defaults, vt as setup_stores, xt as store_set, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { C as sharedStakingCurrency, T as sharedStakingSkipPaginationSenders, r as getSelectedNetworkConfig, u as NANOS_PER_IOTA, w as sharedStakingSkipPaginationEnabled } from "./client-BTFoHz6u.js";
import { B as isValidIotaAddress } from "./keypair-DsT3ivIR.js";
import { a as iota_accounts, t as activeAddress } from "./signer-data-D1Egmbld.js";
import { o as copyToClipboard, t as __vitePreload } from "./index-RSDd7ke0.js";
import { n as updatePageQueryParams, r as usePageQueryParams } from "./page-query-params-ClAYBvGa.js";
import { t as auto_default } from "./auto-DlIbMOkz.js";
import { t as JsonToggleView } from "./JsonToggleView-I_OHyvOi.js";
import { a as processStakeTransactionsWithExchangeRates, c as fetchCurrentStakedObjects, d as formatNanoAsIota, f as formatNanoAsIotaFullPrecision, i as mapWithConcurrency, l as fetchEpochTimestampsForDisplay, n as fetchReceivedStakeTransactions, p as nanoToIota, r as fetchStakeTransactions, t as exchange_rate_cache_default, u as setInitialExchangeRateCacheFromBinary } from "./exchange-rate-cache-BdKS2bQY.js";
import { t as plugin } from "./chartjs-plugin-zoom.esm-DAYqusPu.js";
import { t as EpochPTBAnalyzer } from "./programmable-transaction-block-DR8mHtC0.js";
//#region src/lib/pages/staking-rewards/table-utils.ts
function safeBigInt(value) {
	if (!value) return 0n;
	try {
		return BigInt(value);
	} catch {
		return 0n;
	}
}
/**
* Accumulated rewards a stake object had earned strictly before `startEpoch`.
*
* `accumulatedRewards` is dense from the stake's first epoch onward but resets
* to '0' at full-unstake epochs (see rewards-calculator.ts), so we look up the
* value at the largest recorded epoch that is still `< startEpoch` rather than
* assuming `startEpoch - 1` exists. Returns 0n when the stake only starts in or
* after the window (nothing to ignore).
*/
function getAccumulatedBefore(accumulatedRewards, startEpoch) {
	let bestEpoch = -Infinity;
	for (const epochStr of Object.keys(accumulatedRewards)) {
		const epoch = Number(epochStr);
		if (epoch < startEpoch && epoch > bestEpoch) bestEpoch = epoch;
	}
	if (bestEpoch === -Infinity) return 0n;
	return safeBigInt(accumulatedRewards[bestEpoch]);
}
/**
* Re-baseline stake objects so that only rewards accrued from `startEpoch`
* onward are reflected — used by the "Ignore previous rewards" option when a
* narrower time frame than "All time" is selected.
*
* For each stake object we compute its pre-window earnings `B` (accumulated
* rewards just before `startEpoch`) and:
*   - zero out per-epoch and accumulated rewards before the window,
*   - subtract `B` from accumulated rewards within the window (clamped ≥ 0),
*   - subtract `B` from the realized rewards of unstake actions within the
*     window, distributing it across the object's window unstakes in epoch
*     order so multiple (partial) unstakes never over-subtract.
*
* Principal and exchange-rate maps are left untouched (principal is not a
* reward, so "Total Staked" stays correct). The returned `previousRewardsRemoved`
* is the sum of every object's `B` — the total previous reward shown in the
* "ignored" notice.
*
* Known limitation: `preTransferRewards` is left unchanged; a stake transferred
* in before the window keeps its original pre-transfer adjustment.
*/
function rebaselineStakeObjects(stakeObjects, startEpoch) {
	let previousRewardsRemoved = 0n;
	return {
		stakeObjects: stakeObjects.map((obj) => {
			const baseline = getAccumulatedBefore(obj.accumulatedRewards, startEpoch);
			previousRewardsRemoved += baseline;
			const rewardsByEpoch = {};
			for (const [epochStr, value] of Object.entries(obj.rewardsByEpoch)) rewardsByEpoch[Number(epochStr)] = Number(epochStr) < startEpoch ? "0" : value;
			const accumulatedRewards = {};
			for (const [epochStr, value] of Object.entries(obj.accumulatedRewards)) {
				const epoch = Number(epochStr);
				if (epoch < startEpoch) accumulatedRewards[epoch] = "0";
				else {
					const rebasedValue = safeBigInt(value) - baseline;
					accumulatedRewards[epoch] = (rebasedValue > 0n ? rebasedValue : 0n).toString();
				}
			}
			let actionByEpoch = obj.actionByEpoch;
			if (actionByEpoch && baseline > 0n) {
				const next = {};
				let remaining = baseline;
				const orderedEpochs = Object.keys(actionByEpoch).map(Number).sort((a, b) => a - b);
				for (const epoch of orderedEpochs) next[epoch] = actionByEpoch[epoch].map((action) => {
					if (epoch >= startEpoch && remaining > 0n && (action.action === "Unstaked" || action.action === "Partial Unstake") && action.totalRewards) {
						const original = safeBigInt(action.totalRewards);
						const subtract = original < remaining ? original : remaining;
						remaining -= subtract;
						return {
							...action,
							totalRewards: (original - subtract).toString()
						};
					}
					return action;
				});
				actionByEpoch = next;
			}
			return {
				...obj,
				rewardsByEpoch,
				accumulatedRewards,
				...actionByEpoch ? { actionByEpoch } : {}
			};
		}),
		previousRewardsRemoved
	};
}
/**
* Get the first principal amount for a stake object.
*/
function getFirstPrincipal(stakeObject) {
	const epochs = Object.keys(stakeObject.principalByEpoch).map(Number);
	if (epochs.length === 0) return "";
	const minEpoch = Math.min(...epochs);
	return stakeObject.principalByEpoch[minEpoch];
}
/**
* Compute display data for an epoch entry.
*/
function computeEpochDisplayData(entry, totalPreTransferRewards) {
	const adjustedUnstake = entry.totalUnstakeAccumulated > totalPreTransferRewards ? entry.totalUnstakeAccumulated - totalPreTransferRewards : 0n;
	const rawAvailable = entry.totalAccumulated - adjustedUnstake;
	const isNegative = rawAvailable < 0n;
	const availableRewards = isNegative ? 0n : rawAvailable;
	return {
		availableRewards,
		isNegative,
		display: {
			stakedDisplay: formatNanoAsIota(entry.totalStaked),
			rewardsDisplay: formatNanoAsIota(entry.totalRewards),
			accumulatedDisplay: formatNanoAsIota(entry.totalAccumulated),
			unstakeRewardsDisplay: formatNanoAsIota(entry.totalUnstakeRewards),
			unstakeAccumulatedDisplay: formatNanoAsIota(entry.totalUnstakeAccumulated),
			availableRewardsDisplay: formatNanoAsIota(availableRewards)
		}
	};
}
/**
* Compute all epoch data for the staking rewards table.
* Returns pre-computed display values to avoid repeated calculations in UI.
*/
function computeEpochData(stakeObjects, validatorInfo, currentEpoch) {
	if (stakeObjects.length === 0) return {
		minEpoch: 0,
		uniqueValidators: [],
		epochData: {},
		validatorPrincipal: {},
		epochs: [],
		totalPreTransferRewards: 0n,
		negativeAvailableEpochs: []
	};
	let minEpoch = Infinity;
	const poolIds = /* @__PURE__ */ new Set();
	stakeObjects.forEach((stakeObject) => {
		if (stakeObject.firstEpoch < minEpoch) minEpoch = stakeObject.firstEpoch;
		poolIds.add(stakeObject.poolId);
	});
	const finalMinEpoch = minEpoch === Infinity ? 0 : minEpoch;
	const uniqueValidators = Array.from(poolIds).map((poolId) => validatorInfo[poolId] || {
		name: `Unknown (${poolId.slice(0, 6)}...)`,
		poolId
	});
	const epochRange = Array.from({ length: currentEpoch + 1 }, (_, i) => i).slice(finalMinEpoch);
	const epochs = epochRange;
	const rawEpochData = {};
	epochRange.forEach((epoch) => {
		rawEpochData[epoch] = {
			totalRewards: 0n,
			totalAccumulated: 0n,
			totalUnstakeRewards: 0n,
			totalUnstakeAccumulated: 0n,
			totalStaked: 0n,
			validatorRewards: {},
			validatorAccumulated: {},
			stakeRewards: {},
			stakeAccumulated: {},
			preActive: {},
			active: {}
		};
	});
	const validatorPrincipal = {};
	stakeObjects.forEach((stakeObject) => {
		if (!validatorPrincipal[stakeObject.poolId]) {
			const firstPrincipal = getFirstPrincipal(stakeObject);
			if (firstPrincipal && firstPrincipal !== "0") try {
				validatorPrincipal[stakeObject.poolId] = BigInt(firstPrincipal);
			} catch {
				validatorPrincipal[stakeObject.poolId] = 0n;
			}
			else validatorPrincipal[stakeObject.poolId] = 0n;
		}
		epochRange.forEach((epoch) => {
			const rewards = stakeObject.rewardsByEpoch[epoch];
			if (rewards && rewards !== "0") try {
				rawEpochData[epoch].totalRewards += BigInt(rewards);
				if (!rawEpochData[epoch].validatorRewards[stakeObject.poolId]) rawEpochData[epoch].validatorRewards[stakeObject.poolId] = 0n;
				rawEpochData[epoch].validatorRewards[stakeObject.poolId] += BigInt(rewards);
			} catch {}
			rawEpochData[epoch].stakeRewards[stakeObject.objectId] = rewards || "0";
			rawEpochData[epoch].preActive[stakeObject.objectId] = epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
			rawEpochData[epoch].active[stakeObject.objectId] = epoch >= stakeObject.firstEpoch && epoch <= stakeObject.lastEpoch;
		});
	});
	epochRange.forEach((epoch) => {
		let total = 0n;
		for (const stakeObject of stakeObjects) {
			const principal = stakeObject.principalByEpoch[epoch];
			if (principal && principal !== "0") try {
				let endPrincipal = BigInt(principal);
				if (stakeObject.actionByEpoch && stakeObject.actionByEpoch[epoch]) {
					const actions = stakeObject.actionByEpoch[epoch];
					for (const action of actions) if ((action.action === "Unstaked" || action.action === "Partial Unstake") && action.amount) try {
						endPrincipal -= BigInt(action.amount);
					} catch {}
					else if (action.action === "Unlocked" && stakeObject.lastEpoch === epoch && action.amount) try {
						endPrincipal -= BigInt(action.amount);
					} catch {}
				}
				if (endPrincipal > 0n) total += endPrincipal;
			} catch {
				continue;
			}
		}
		rawEpochData[epoch].totalStaked = total;
	});
	for (let i = 0; i < epochRange.length; i++) {
		const epoch = epochRange[i];
		const prevEpoch = epochRange[i - 1];
		rawEpochData[epoch].totalAccumulated = rawEpochData[epoch].totalRewards + (prevEpoch !== void 0 ? rawEpochData[prevEpoch].totalAccumulated : 0n);
	}
	stakeObjects.forEach((stakeObject) => {
		epochRange.forEach((epoch, i) => {
			if (!rawEpochData[epoch].validatorAccumulated[stakeObject.poolId]) rawEpochData[epoch].validatorAccumulated[stakeObject.poolId] = 0n;
			const rewards = stakeObject.rewardsByEpoch[epoch];
			if (rewards && rewards !== "0") rawEpochData[epoch].validatorAccumulated[stakeObject.poolId] += BigInt(rewards);
			if (!rawEpochData[epoch].stakeAccumulated[stakeObject.objectId]) rawEpochData[epoch].stakeAccumulated[stakeObject.objectId] = "0";
			const stakeRewards = stakeObject.rewardsByEpoch[epoch];
			const prevAccum = i > 0 ? BigInt(rawEpochData[epochRange[i - 1]].stakeAccumulated[stakeObject.objectId] || "0") : 0n;
			const currAccum = (stakeRewards && stakeRewards !== "0" ? BigInt(stakeRewards) : 0n) + prevAccum;
			rawEpochData[epoch].stakeAccumulated[stakeObject.objectId] = currAccum.toString();
		});
	});
	epochRange.forEach((epoch, i) => {
		if (i > 0) {
			const prevEpoch = epochRange[i - 1];
			Object.keys(rawEpochData[epoch].validatorAccumulated).forEach((poolId) => {
				rawEpochData[epoch].validatorAccumulated[poolId] += rawEpochData[prevEpoch].validatorAccumulated[poolId] || 0n;
			});
		}
	});
	stakeObjects.forEach((stakeObject) => {
		if (stakeObject.actionByEpoch) Object.entries(stakeObject.actionByEpoch).forEach(([epochStr, actions]) => {
			const epoch = parseInt(epochStr);
			for (const actionDetails of actions) if (epochRange.includes(epoch) && (actionDetails.action === "Unstaked" || actionDetails.action === "Partial Unstake") && actionDetails.totalRewards) try {
				const unstakeRewards = BigInt(actionDetails.totalRewards);
				rawEpochData[epoch].totalUnstakeRewards += unstakeRewards;
			} catch {}
		});
	});
	for (let i = 0; i < epochRange.length; i++) {
		const epoch = epochRange[i];
		const prevEpoch = epochRange[i - 1];
		rawEpochData[epoch].totalUnstakeAccumulated = rawEpochData[epoch].totalUnstakeRewards + (prevEpoch !== void 0 ? rawEpochData[prevEpoch].totalUnstakeAccumulated : 0n);
	}
	let totalPreTransferRewards = 0n;
	for (const stakeObject of stakeObjects) if (stakeObject.preTransferRewards) try {
		totalPreTransferRewards += BigInt(stakeObject.preTransferRewards);
	} catch {}
	const epochData = {};
	const negativeAvailableEpochs = [];
	epochRange.forEach((epoch) => {
		const raw = rawEpochData[epoch];
		const { display, availableRewards, isNegative } = computeEpochDisplayData(raw, totalPreTransferRewards);
		if (isNegative) negativeAvailableEpochs.push(epoch);
		epochData[epoch] = {
			...raw,
			availableRewards,
			display
		};
	});
	if (negativeAvailableEpochs.length > 0) console.error(`[StakingRewards] Available Rewards went negative at ${negativeAvailableEpochs.length} epoch(s) — indicates incorrect ownership/transfer accounting. First offending epochs: ${negativeAvailableEpochs.slice(0, 5).join(", ")}`);
	return {
		minEpoch: finalMinEpoch,
		uniqueValidators,
		epochData,
		validatorPrincipal,
		epochs,
		totalPreTransferRewards,
		negativeAvailableEpochs
	};
}
/**
* Check if a stake object is active in a given epoch.
*/
function isActiveInEpoch(stakeObject, epoch, epochData) {
	return epochData[epoch]?.active[stakeObject.objectId] ?? false;
}
/**
* Check if a stake object is in pre-activation state in a given epoch.
*/
function isPreActivationInEpoch(stakeObject, epoch, epochData) {
	return epochData[epoch]?.preActive[stakeObject.objectId] ?? false;
}
/**
* Get validator rewards for an epoch formatted as IOTA string.
*/
function getValidatorRewardsForEpoch(validatorPoolId, epoch, epochData) {
	return formatNanoAsIota(epochData[epoch]?.validatorRewards[validatorPoolId] ?? 0n);
}
/**
* Get validator total principal formatted as IOTA string.
*/
function getValidatorTotalPrincipal(validatorPoolId, validatorPrincipal) {
	return formatNanoAsIota(validatorPrincipal[validatorPoolId] ?? 0n);
}
/**
* Format principal amount as a display string.
*/
function formatPrincipal(principal) {
	if (!principal || principal === "0") return "N/A";
	try {
		return "Initial amount: " + formatNanoAsIota(BigInt(principal));
	} catch {
		return "N/A";
	}
}
/**
* Format action details for display.
*/
function formatActionDetails(action) {
	let details = `Action: ${action.action}\nTransaction: ${action.digest}`;
	if (action.timestamp) details += `\nTime: ${action.timestamp}`;
	if (action.amount) {
		const iotaAmount = formatNanoAsIota(BigInt(action.amount), 9);
		if (action.action === "Partial Unstake") details += `\nUnstaked Amount: ${iotaAmount}`;
		else details += `\nAmount: ${iotaAmount}`;
	}
	if (action.totalRewards) {
		const iotaRewards = formatNanoAsIota(BigInt(action.totalRewards), 9);
		if (action.action === "Partial Unstake") details += `\nUnstake Rewards: ${iotaRewards}`;
		else details += `\nTotal Rewards: ${iotaRewards}`;
	}
	if (action.fromAddress && action.toAddress) details += `\nFrom: ${action.fromAddress}\nTo: ${action.toAddress}`;
	if (action.principalChange) {
		const fromAmount = formatNanoAsIota(BigInt(action.principalChange.from), 9);
		const toAmount = formatNanoAsIota(BigInt(action.principalChange.to), 9);
		details += `\nPrincipal changed from ${fromAmount} to ${toAmount}`;
	}
	if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
		details += `\nMerged stake objects:`;
		action.mergedStakeObjects.forEach((obj) => {
			const amount = formatNanoAsIota(BigInt(obj.amount), 9);
			details += `\n  - ${obj.objectId}: ${amount}`;
		});
	}
	if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
		details += `\nSplit into stake objects:`;
		action.splitStakeObjects.forEach((obj) => {
			const amount = formatNanoAsIota(BigInt(obj.amount), 9);
			details += `\n  - ${obj.objectId}: ${amount}`;
		});
	}
	return details;
}
/**
* Format multiple action details for display.
*/
function formatMultipleActionDetails(actions) {
	if (actions.length === 0) return "";
	if (actions.length === 1) return formatActionDetails(actions[0]);
	return actions.map((action, index) => {
		return `--- Action ${index + 1} ---\n${formatActionDetails(action)}`;
	}).join("\n\n");
}
/**
* Get combined action names for display.
*/
function getActionNames(actions) {
	if (actions.length === 0) return "";
	if (actions.length === 1) return actions[0].action;
	return actions.map((a) => a.action).join(", ");
}
/**
* Running fiat value of unstake rewards using each epoch's own price.
* If a price is missing for an epoch where unstake rewards occurred, that
* slice contributes 0 — the running total stays consistent so later epochs
* aren't punished for a single missing price point.
*/
function computeCumulativeUnstakeFiat(epochs, epochData, epochPrices) {
	const result = {};
	let running = 0;
	for (const epoch of epochs) {
		const data = epochData[epoch];
		const price = epochPrices[epoch];
		if (data && price) running += nanoToIota(data.totalUnstakeRewards) * price;
		result[epoch] = running;
	}
	return result;
}
/**
* Total earned value at a given epoch in fiat:
*   Σ(unstakeRewards[i] × price[i]) for i ≤ epoch + availableRewards[epoch] × price[epoch]
*
* Returns null when the epoch's own price is unknown (the "current" leg can't
* be computed). The cumulative leg survives missing prices via 0-substitution.
*/
function computeEarnedValueForEpoch(epoch, epochData, cumulativeUnstakeFiat, epochPrices) {
	const data = epochData[epoch];
	const price = epochPrices[epoch];
	if (!data || !price) return null;
	return (cumulativeUnstakeFiat[epoch] ?? 0) + nanoToIota(data.availableRewards) * price;
}
//#endregion
//#region src/lib/pages/staking-rewards/csv-export.ts
/**
* Build the full ordered list of export sections from the given inputs.
* This is pure (no DOM, no I/O) so it can be snapshot-tested and reused by
* the PDF exporter. The same function drives both CSV and PDF output — they
* only differ in how they serialize the resulting sections.
*/
function buildExportSections(inputs) {
	const { epochs, epochEndDates, currentEpoch, stakeObjects, uniqueValidators, epochData, options, previewRowLimit } = inputs;
	const { showPriceColumns, showValidatorColumns, epochPrices, selectedCurrency, wrapStakeObjects = false, wrapValidators = false } = options;
	const hasPrices = showPriceColumns && Object.keys(epochPrices).length > 0;
	const currencyLabel = selectedCurrency.toUpperCase();
	const cumulativeUnstakeFiat = hasPrices ? computeCumulativeUnstakeFiat(epochs, epochData, epochPrices) : {};
	const mainHeaders = [
		"Epoch",
		"End Date",
		"Staked",
		"Rewards",
		"Accumulated",
		"Unstake Rewards",
		"Unstake Accumulated",
		"Available Rewards"
	];
	if (hasPrices) mainHeaders.push(`Price (${currencyLabel})`, `Rewards in ${currencyLabel}`, `Accumulated in ${currencyLabel}`, `Total Earned (${currencyLabel})`);
	if (showValidatorColumns && !wrapValidators) uniqueValidators.forEach((validator) => {
		mainHeaders.push(`Validator: ${validator.name}`);
	});
	if (!wrapStakeObjects) stakeObjects.forEach((stakeObject) => {
		mainHeaders.push(`Stake: ${stakeObject.objectId}`, `Action: ${stakeObject.objectId}`);
	});
	const mainRows = [];
	let mainTruncated = false;
	for (let i = 0; i < epochs.length; i++) {
		if (previewRowLimit !== void 0 && mainRows.length >= previewRowLimit) {
			mainTruncated = true;
			break;
		}
		const epoch = epochs[i];
		const data = epochData[epoch];
		const isPending = epoch === currentEpoch;
		const row = [];
		row.push(epoch.toString(), epochEndDates[i] || "-", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.totalStaked) : "0", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.totalRewards) : "0", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.totalAccumulated) : "0", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.totalUnstakeRewards) : "0", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.totalUnstakeAccumulated) : "0", isPending ? "pending" : data ? formatNanoAsIotaFullPrecision(data.availableRewards) : "0");
		if (hasPrices) {
			const rewardsIota = data ? nanoToIota(data.totalRewards) : 0;
			const accumulatedIota = data ? nanoToIota(data.totalAccumulated) : 0;
			const price = epochPrices[epoch];
			const earned = isPending ? null : computeEarnedValueForEpoch(epoch, epochData, cumulativeUnstakeFiat, epochPrices);
			row.push(isPending ? "pending" : price ? price.toString() : "no price", isPending ? "pending" : price ? (rewardsIota * price).toFixed(4) : "no price", isPending ? "pending" : price ? (accumulatedIota * price).toFixed(4) : "no price", isPending ? "pending" : earned !== null ? earned.toFixed(4) : "no price");
		}
		if (showValidatorColumns && !wrapValidators) uniqueValidators.forEach((validator) => {
			if (isPending) row.push("pending");
			else {
				const rewards = data?.validatorRewards[validator.poolId] ?? 0n;
				row.push(formatNanoAsIotaFullPrecision(rewards));
			}
		});
		if (!wrapStakeObjects) stakeObjects.forEach((stakeObject) => {
			row.push(...buildStakeObjectCells(stakeObject, epoch, currentEpoch, epochData));
		});
		mainRows.push(row);
	}
	const sections = [{
		...options.previousRewardsNotice && { title: options.previousRewardsNotice },
		headers: mainHeaders,
		rows: mainRows,
		...mainTruncated && { truncated: true }
	}];
	if (wrapValidators && showValidatorColumns && uniqueValidators.length > 0) {
		const { rows, truncated } = buildValidatorLongRows(epochs, epochEndDates, currentEpoch, uniqueValidators, epochData, previewRowLimit);
		sections.push({
			title: "--- Validators ---",
			headers: [
				"Epoch",
				"End Date",
				"Validator",
				"Pool ID",
				"Rewards"
			],
			rows,
			...truncated && { truncated: true }
		});
	}
	if (wrapStakeObjects && stakeObjects.length > 0) {
		const { rows, truncated } = buildStakeObjectLongRows(epochs, epochEndDates, currentEpoch, stakeObjects, epochData, previewRowLimit);
		sections.push({
			title: "--- Stake Objects ---",
			headers: [
				"Epoch",
				"End Date",
				"Stake Object",
				"Reward",
				"Action"
			],
			rows,
			...truncated && { truncated: true }
		});
	}
	return sections;
}
/**
* Async variant of {@link sectionsToCsv} that yields between row batches so
* the UI thread can repaint. For huge sections (tens of thousands of rows in
* the long-format stake-objects table) the synchronous path was responsible
* for noticeable freezes — chunking lets the dialog's "Generating…" indicator
* stay alive and the browser handle input events between batches.
*/
var CSV_CHUNK_SIZE = 2e3;
var yieldToBrowser$1 = () => new Promise((resolve) => setTimeout(resolve, 0));
async function sectionsToCsvAsync(sections, onProgress) {
	const rowsTotal = sections.reduce((sum, s) => sum + s.rows.length, 0);
	let rowsDone = 0;
	onProgress?.({
		rowsDone,
		rowsTotal
	});
	const parts = [];
	for (const section of sections) {
		const lines = [];
		if (section.title) lines.push(csvRow([section.title]));
		lines.push(csvRow(section.headers));
		for (let i = 0; i < section.rows.length; i += CSV_CHUNK_SIZE) {
			const end = Math.min(i + CSV_CHUNK_SIZE, section.rows.length);
			for (let j = i; j < end; j++) lines.push(csvRow(section.rows[j]));
			rowsDone += end - i;
			onProgress?.({
				rowsDone,
				rowsTotal
			});
			if (end < section.rows.length) await yieldToBrowser$1();
		}
		lines.push("");
		parts.push(lines.join("\n"));
		await yieldToBrowser$1();
	}
	return parts.join("\n");
}
/**
* Export table data to CSV format and trigger download.
*
* When `wrapStakeObjects` or `wrapValidators` is set, the per-object columns
* are emitted as extra sections below the main table (long format) instead of
* as wide columns. This keeps the main table readable when the data is
* viewed in a PDF or printout.
*/
async function exportTableToCSV(epochs, epochEndDates, currentEpoch, stakeObjects, uniqueValidators, epochData, options, onProgress) {
	downloadCSV(await sectionsToCsvAsync(buildExportSections({
		epochs,
		epochEndDates,
		currentEpoch,
		stakeObjects,
		uniqueValidators,
		epochData,
		options
	}), onProgress), `${options.fileName?.trim() || `staking-rewards-table-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`}.csv`);
}
/**
* Build the two cells (stake reward / merged action+details) for a stake
* object in a given epoch. The action name is prepended to its own TX data
* so the two legacy columns collapse into one without losing information.
*/
function buildStakeObjectCells(stakeObject, epoch, currentEpoch, epochData) {
	if (epoch === currentEpoch) return ["pending", ""];
	if (!isActiveInEpoch(stakeObject, epoch, epochData) || epoch < stakeObject.firstEpoch) return ["-", ""];
	const reward = !stakeObject.rewardsByEpoch[epoch] || stakeObject.rewardsByEpoch[epoch] === "0" ? "-" : formatNanoAsIotaFullPrecision(BigInt(stakeObject.rewardsByEpoch[epoch]));
	const actions = stakeObject.actionByEpoch?.[epoch];
	if (!actions || actions.length === 0) return [reward, ""];
	return [reward, actions.map((action) => {
		let details = `${action.action}: TX: ${action.digest}`;
		if (action.amount) details += ` | Amount: ${formatNanoAsIotaFullPrecision(BigInt(action.amount), true)}`;
		if (action.totalRewards) details += ` | Rewards: ${formatNanoAsIotaFullPrecision(BigInt(action.totalRewards), true)}`;
		if (action.fromAddress && action.toAddress) details += ` | From: ${action.fromAddress} To: ${action.toAddress}`;
		if (action.principalChange) {
			const from = formatNanoAsIotaFullPrecision(BigInt(action.principalChange.from), true);
			const to = formatNanoAsIotaFullPrecision(BigInt(action.principalChange.to), true);
			details += ` | Principal: ${from} → ${to}`;
		}
		if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) details += ` | Merged: ${action.mergedStakeObjects.length} objects`;
		if (action.splitStakeObjects && action.splitStakeObjects.length > 0) details += ` | Split: ${action.splitStakeObjects.length} objects`;
		return details;
	}).join(" ;; ")];
}
function buildStakeObjectLongRows(epochs, epochEndDates, currentEpoch, stakeObjects, epochData, previewRowLimit) {
	const rows = [];
	for (const stakeObject of stakeObjects) for (let i = 0; i < epochs.length; i++) {
		if (previewRowLimit !== void 0 && rows.length >= previewRowLimit) return {
			rows,
			truncated: true
		};
		const epoch = epochs[i];
		const [reward, action] = buildStakeObjectCells(stakeObject, epoch, currentEpoch, epochData);
		if (reward === "-" && !action) continue;
		rows.push([
			epoch.toString(),
			epochEndDates[i] || "-",
			stakeObject.objectId,
			reward,
			action
		]);
	}
	return {
		rows,
		truncated: false
	};
}
function buildValidatorLongRows(epochs, epochEndDates, currentEpoch, uniqueValidators, epochData, previewRowLimit) {
	const rows = [];
	for (const validator of uniqueValidators) for (let i = 0; i < epochs.length; i++) {
		if (previewRowLimit !== void 0 && rows.length >= previewRowLimit) return {
			rows,
			truncated: true
		};
		const epoch = epochs[i];
		const data = epochData[epoch];
		const isPending = epoch === currentEpoch;
		const rewards = data?.validatorRewards[validator.poolId] ?? 0n;
		if (!isPending && rewards === 0n) continue;
		rows.push([
			epoch.toString(),
			epochEndDates[i] || "-",
			validator.name,
			validator.poolId,
			isPending ? "pending" : formatNanoAsIotaFullPrecision(rewards)
		]);
	}
	return {
		rows,
		truncated: false
	};
}
function csvRow(cells) {
	return cells.map((cell) => "\"" + String(cell).replace(/"/g, "\"\"") + "\"").join(",");
}
function downloadCSV(csvContent, filename) {
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
//#endregion
//#region src/lib/pages/staking-rewards/cache/mainnet-epoch-timestamps-cache.json
var mainnet_epoch_timestamps_cache_default = {
	"1": 1746603545,
	"2": 1746689945,
	"3": 1746776346,
	"4": 1746862746,
	"5": 1746949146,
	"6": 1747035547,
	"7": 1747121947,
	"8": 1747208347,
	"9": 1747294748,
	"10": 1747381148,
	"11": 1747467548,
	"12": 1747553949,
	"13": 1747640349,
	"14": 1747726750,
	"15": 1747813150,
	"16": 1747899550,
	"17": 1747985951,
	"18": 1748072351,
	"19": 1748158752,
	"20": 1748245152,
	"21": 1748331552,
	"22": 1748417953,
	"23": 1748504353,
	"24": 1748590754,
	"25": 1748677154,
	"26": 1748763554,
	"27": 1748849955,
	"28": 1748936355,
	"29": 1749022755,
	"30": 1749109156,
	"31": 1749195556,
	"32": 1749281956,
	"33": 1749368357,
	"34": 1749454757,
	"35": 1749541157,
	"36": 1749627557,
	"37": 1749713958,
	"38": 1749800358,
	"39": 1749886759,
	"40": 1749973159,
	"41": 1750059559,
	"42": 1750145960,
	"43": 1750232360,
	"44": 1750318760,
	"45": 1750405161,
	"46": 1750491561,
	"47": 1750577961,
	"48": 1750664362,
	"49": 1750750762,
	"50": 1750837163,
	"51": 1750923563,
	"52": 1751009964,
	"53": 1751096364,
	"54": 1751182764,
	"55": 1751269164,
	"56": 1751355565,
	"57": 1751441965,
	"58": 1751528366,
	"59": 1751614766,
	"60": 1751701166,
	"61": 1751787567,
	"62": 1751873967,
	"63": 1751960367,
	"64": 1752046768,
	"65": 1752133169,
	"66": 1752219569,
	"67": 1752305969,
	"68": 1752392370,
	"69": 1752478770,
	"70": 1752565170,
	"71": 1752651571,
	"72": 1752737971,
	"73": 1752824371,
	"74": 1752910772,
	"75": 1752997172,
	"76": 1753083572,
	"77": 1753169972,
	"78": 1753256373,
	"79": 1753342773,
	"80": 1753429174,
	"81": 1753515574,
	"82": 1753601974,
	"83": 1753688375,
	"84": 1753774775,
	"85": 1753861176,
	"86": 1753947576,
	"87": 1754033976,
	"88": 1754120377,
	"89": 1754206777,
	"90": 1754293177,
	"91": 1754379578,
	"92": 1754465978,
	"93": 1754552379,
	"94": 1754638779,
	"95": 1754725179,
	"96": 1754811579,
	"97": 1754897980,
	"98": 1754984380,
	"99": 1755070780,
	"100": 1755157181,
	"101": 1755243581,
	"102": 1755329982,
	"103": 1755416382,
	"104": 1755502782,
	"105": 1755589183,
	"106": 1755675583,
	"107": 1755761984,
	"108": 1755848384,
	"109": 1755934785,
	"110": 1756021186,
	"111": 1756107586,
	"112": 1756193987,
	"113": 1756280387,
	"114": 1756366788,
	"115": 1756453189,
	"116": 1756539589,
	"117": 1756625989,
	"118": 1756712390,
	"119": 1756798790,
	"120": 1756885191,
	"121": 1756971591,
	"122": 1757057992,
	"123": 1757144392,
	"124": 1757230792,
	"125": 1757317192,
	"126": 1757403593,
	"127": 1757489994,
	"128": 1757576394,
	"129": 1757662795,
	"130": 1757749195,
	"131": 1757835595,
	"132": 1757921995,
	"133": 1758008396,
	"134": 1758094796,
	"135": 1758181196,
	"136": 1758267597,
	"137": 1758353997,
	"138": 1758440397,
	"139": 1758526798,
	"140": 1758613198,
	"141": 1758699599,
	"142": 1758785999,
	"143": 1758872399,
	"144": 1758958800,
	"145": 1759045200,
	"146": 1759131600,
	"147": 1759218001,
	"148": 1759304401,
	"149": 1759390801,
	"150": 1759477201,
	"151": 1759563602,
	"152": 1759650002,
	"153": 1759736402,
	"154": 1759822803,
	"155": 1759909203,
	"156": 1759995604,
	"157": 1760082004,
	"158": 1760168404,
	"159": 1760254805,
	"160": 1760341205,
	"161": 1760427606,
	"162": 1760514006,
	"163": 1760600406,
	"164": 1760686807,
	"165": 1760773207,
	"166": 1760859607,
	"167": 1760946008,
	"168": 1761032408,
	"169": 1761118808,
	"170": 1761205209,
	"171": 1761291609,
	"172": 1761378009,
	"173": 1761464410,
	"174": 1761550810,
	"175": 1761637210,
	"176": 1761723611,
	"177": 1761810011,
	"178": 1761896411,
	"179": 1761982811,
	"180": 1762069212,
	"181": 1762155612,
	"182": 1762242012,
	"183": 1762328413,
	"184": 1762414813,
	"185": 1762501214,
	"186": 1762587614,
	"187": 1762674014,
	"188": 1762760415,
	"189": 1762846815,
	"190": 1762933216,
	"191": 1763019616,
	"192": 1763106016,
	"193": 1763192416,
	"194": 1763278817,
	"195": 1763365217,
	"196": 1763451618,
	"197": 1763538018,
	"198": 1763624418,
	"199": 1763710819,
	"200": 1763797219,
	"201": 1763883619,
	"202": 1763970020,
	"203": 1764056420,
	"204": 1764142820,
	"205": 1764229221,
	"206": 1764315621,
	"207": 1764402021,
	"208": 1764488422,
	"209": 1764574822,
	"210": 1764661223,
	"211": 1764747623,
	"212": 1764834023,
	"213": 1764920424,
	"214": 1765006824,
	"215": 1765093224,
	"216": 1765179625,
	"217": 1765266025,
	"218": 1765352425,
	"219": 1765438826,
	"220": 1765525226,
	"221": 1765611627,
	"222": 1765698027,
	"223": 1765784427,
	"224": 1765870828,
	"225": 1765957228,
	"226": 1766043628,
	"227": 1766130028,
	"228": 1766216429,
	"229": 1766302829,
	"230": 1766389230,
	"231": 1766475630,
	"232": 1766562031,
	"233": 1766648431,
	"234": 1766734831,
	"235": 1766821232,
	"236": 1766907632,
	"237": 1766994032,
	"238": 1767080433,
	"239": 1767166833,
	"240": 1767253233,
	"241": 1767339634,
	"242": 1767426034,
	"243": 1767512434,
	"244": 1767598835,
	"245": 1767685235,
	"246": 1767771636,
	"247": 1767858036,
	"248": 1767944437,
	"249": 1768030837,
	"250": 1768117237,
	"251": 1768203638,
	"252": 1768290038,
	"253": 1768376438,
	"254": 1768462839,
	"255": 1768549239,
	"256": 1768635640,
	"257": 1768722040,
	"258": 1768808440,
	"259": 1768894841,
	"260": 1768981241,
	"261": 1769067642,
	"262": 1769154042,
	"263": 1769240442,
	"264": 1769326843,
	"265": 1769413243,
	"266": 1769499644,
	"267": 1769586044,
	"268": 1769672444,
	"269": 1769758845,
	"270": 1769845245,
	"271": 1769931646,
	"272": 1770018046,
	"273": 1770104447,
	"274": 1770190847,
	"275": 1770277247,
	"276": 1770363648,
	"277": 1770450048,
	"278": 1770536449,
	"279": 1770622850,
	"280": 1770709250,
	"281": 1770795650,
	"282": 1770882051,
	"283": 1770968451,
	"284": 1771054851,
	"285": 1771141252,
	"286": 1771227652,
	"287": 1771314053,
	"288": 1771400453,
	"289": 1771486854,
	"290": 1771573254,
	"291": 1771659654,
	"292": 1771746055,
	"293": 1771832455,
	"294": 1771918855,
	"295": 1772005256,
	"296": 1772091656,
	"297": 1772178056,
	"298": 1772264457,
	"299": 1772350857,
	"300": 1772437257,
	"301": 1772523658,
	"302": 1772610058,
	"303": 1772696458,
	"304": 1772782859,
	"305": 1772869259,
	"306": 1772955659,
	"307": 1773042060,
	"308": 1773128460,
	"309": 1773214861,
	"310": 1773301261,
	"311": 1773387662,
	"312": 1773474062,
	"313": 1773560463,
	"314": 1773646863,
	"315": 1773733263,
	"316": 1773819664,
	"317": 1773906064,
	"318": 1773992465,
	"319": 1774078865,
	"320": 1774165265,
	"321": 1774251666,
	"322": 1774338066,
	"323": 1774424466,
	"324": 1774510867,
	"325": 1774597267,
	"326": 1774683668,
	"327": 1774770068,
	"328": 1774856468,
	"329": 1774942868,
	"330": 1775029269,
	"331": 1775115669,
	"332": 1775202070,
	"333": 1775288470,
	"334": 1775374870,
	"335": 1775461271,
	"336": 1775547671,
	"337": 1775634072,
	"338": 1775720472,
	"339": 1775806872,
	"340": 1775893272,
	"341": 1775979673,
	"342": 1776066073,
	"343": 1776152473,
	"344": 1776238874,
	"345": 1776325274,
	"346": 1776411674,
	"347": 1776498075,
	"348": 1776584475,
	"349": 1776670876,
	"350": 1776757276,
	"351": 1776843677,
	"352": 1776930077,
	"353": 1777016477,
	"354": 1777102878,
	"355": 1777189278,
	"356": 1777275678,
	"357": 1777362079,
	"358": 1777448479,
	"359": 1777534879,
	"360": 1777621280,
	"361": 1777707680,
	"362": 1777794081,
	"363": 1777880481,
	"364": 1777966881,
	"365": 1778053282,
	"366": 1778139682,
	"367": 1778226082,
	"368": 1778312483,
	"369": 1778398883,
	"370": 1778485283,
	"371": 1778571684,
	"372": 1778658084,
	"373": 1778744484,
	"374": 1778830885,
	"375": 1778917285,
	"376": 1779003686,
	"377": 1779090086,
	"378": 1779176486,
	"379": 1779262887,
	"380": 1779349287,
	"381": 1779435687,
	"382": 1779522088,
	"383": 1779608488,
	"384": 1779694889,
	"385": 1779781289,
	"386": 1779867689,
	"387": 1779954090,
	"388": 1780040490,
	"389": 1780126891,
	"390": 1780213291,
	"391": 1780299692,
	"392": 1780386092,
	"393": 1780472493,
	"394": 1780558893,
	"395": 1780645293,
	"396": 1780731694,
	"397": 1780818094,
	"398": 1780904495,
	"399": 1780990895,
	"400": 1781077295,
	"401": 1781163696,
	"402": 1781250096,
	"403": 1781336497,
	"404": 1781422897,
	"405": 1781509297,
	"406": 1781595698,
	"407": 1781682098,
	"408": 1781768498,
	"409": 1781854899,
	"410": 1781941299,
	"411": 1782027700,
	"412": 1782114100,
	"413": 1782200501,
	"414": 1782286901,
	"415": 1782373301,
	"416": 1782459702,
	"417": 1782546102,
	"418": 1782632502,
	"419": 1782718903,
	"420": 1782805303,
	"421": 1782891703,
	"422": 1782978104,
	"423": 1783064505,
	"424": 1783150905,
	"425": 1783237306,
	"426": 1783323706,
	"427": 1783410106,
	"428": 1783496507,
	"429": 1783582907,
	"430": 1783669308,
	"431": 1783755708,
	"432": 1783842108,
	"433": 1783928509,
	"434": 1784014909,
	"435": 1784101310,
	"436": 1784187710,
	"437": 1784274110,
	"438": 1784360511,
	"439": 1784446911,
	"440": 1784533312,
	"441": 1784619712,
	"442": 1784706113,
	"443": 1784792513,
	"444": 1784878914,
	"445": 1784965314,
	"446": 1785051715,
	"447": 1785138115,
	"448": 1785224515,
	"449": 1785310916,
	"450": 1785397316,
	"451": 1785483717,
	"452": 1785570117,
	"453": 1785656517,
	"454": 1785742918,
	"455": 1785829318
};
//#endregion
//#region src/lib/pages/staking-rewards/StakingRewardsChart.svelte
var root$4 = from_html(`<div class="chart-container svelte-1o6uvwg"><div class="chart-header svelte-1o6uvwg"><div class="legend-instructions svelte-1o6uvwg">Click legend to toggle. Double-click to view only that metric. For price metrics, click
            "Fetch prices from coingecko" above the table first.</div> <button class="reset-button svelte-1o6uvwg" title="Reset Zoom">🔍 Reset</button></div> <div class="chart-wrapper svelte-1o6uvwg"><canvas></canvas></div></div>`);
function StakingRewardsChart($$anchor, $$props) {
	push($$props, false);
	auto_default.register(plugin);
	let tableData = prop($$props, "tableData", 8);
	let epochEndDates = prop($$props, "epochEndDates", 8);
	let epochPrices = prop($$props, "epochPrices", 8);
	let skipLastEpoch = prop($$props, "skipLastEpoch", 8, true);
	let canvas = mutable_source();
	let chart = mutable_source(null);
	let selectedMetrics = [
		"rewards",
		"accumulatedRewards",
		"availableRewards",
		"unstakeTotal",
		"rewardsPrice",
		"accumulatedPrice",
		"stakedAmount"
	];
	let showStakedAmount = false;
	let lastClickTime = 0;
	const metricOptions = [
		{
			value: "stakedAmount",
			label: "Staked Amount"
		},
		{
			value: "rewards",
			label: "Rewards"
		},
		{
			value: "accumulatedRewards",
			label: "Accumulated Rewards"
		},
		{
			value: "availableRewards",
			label: "Available Rewards"
		},
		{
			value: "unstakeTotal",
			label: "Unstake Total"
		},
		{
			value: "rewardsPrice",
			label: "Rewards Price"
		},
		{
			value: "accumulatedPrice",
			label: "Accumulated Price"
		}
	];
	function getMetricData(metric) {
		const { epochs, epochData } = tableData();
		return (skipLastEpoch() ? epochs.slice(0, -1) : epochs).map((epoch, index) => {
			const date = epochEndDates()[index] ? new Date(epochEndDates()[index]) : /* @__PURE__ */ new Date();
			let value = 0;
			switch (metric) {
				case "stakedAmount":
					value = Number(epochData[epoch]?.totalStaked || 0n);
					break;
				case "rewards":
					value = Number(epochData[epoch]?.totalRewards || 0n);
					break;
				case "accumulatedRewards":
					value = Number(epochData[epoch]?.totalAccumulated || 0n);
					break;
				case "availableRewards":
					value = Number(epochData[epoch]?.availableRewards || 0n);
					break;
				case "unstakeTotal":
					value = Number(epochData[epoch]?.totalUnstakeAccumulated || 0n);
					break;
				case "rewardsPrice":
					const rewards = Number(epochData[epoch]?.totalRewards || 0n);
					const price = epochPrices()[epoch] || 0;
					value = rewards / 1e9 * price;
					break;
				case "accumulatedPrice":
					const accumulated = Number(epochData[epoch]?.totalAccumulated || 0n);
					const accPrice = epochPrices()[epoch] || 0;
					value = accumulated / 1e9 * accPrice;
					break;
			}
			return {
				x: date,
				y: value
			};
		});
	}
	function getDatasets() {
		const colors = [
			"#059669",
			"#dc2626",
			"#2563eb",
			"#ea580c",
			"#7c3aed",
			"#0891b2",
			"#f59e0b"
		];
		return selectedMetrics.map((metric, index) => {
			const data = getMetricData(metric);
			return {
				label: metricOptions.find((opt) => opt.value === metric)?.label || metric,
				data,
				borderColor: colors[index % colors.length],
				backgroundColor: colors[index % colors.length] + "20",
				tension: .1,
				fill: false,
				pointRadius: 3,
				pointHoverRadius: 5,
				hidden: metric === "stakedAmount" && !showStakedAmount
			};
		});
	}
	function createChart() {
		if (!get(canvas)) return;
		const datasets = getDatasets();
		set(chart, new auto_default(get(canvas), {
			type: "line",
			data: { datasets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: "time",
						time: { unit: "day" },
						title: {
							display: true,
							text: "Epoch End Date"
						}
					},
					y: { title: {
						display: true,
						text: "Value"
					} }
				},
				plugins: {
					legend: {
						display: true,
						onClick(event, legendItem, legend) {
							const index = legendItem.datasetIndex;
							if (index === void 0) return;
							const ci = legend.chart;
							const now = Date.now();
							const isDoubleClick = now - lastClickTime < 300;
							lastClickTime = now;
							if (isDoubleClick) {
								ci.data.datasets.forEach((dataset, i) => {
									if (i === index) ci.show(i);
									else ci.hide(i);
								});
								if (legend.legendItems) legend.legendItems.forEach((item, i) => {
									item.hidden = i !== index;
								});
								if (legendItem.text === "Staked Amount") showStakedAmount = true;
							} else {
								if (ci.isDatasetVisible(index)) {
									ci.hide(index);
									legendItem.hidden = true;
								} else {
									ci.show(index);
									legendItem.hidden = false;
								}
								if (legendItem.text === "Staked Amount") showStakedAmount = ci.isDatasetVisible(index);
							}
						}
					},
					tooltip: { callbacks: { label(context) {
						const value = context.parsed.y;
						if (value == null) return "";
						const datasetLabel = context.dataset.label || "";
						if (datasetLabel.includes("Price")) return `${datasetLabel}: $${formatCurrency(value)} USD / €${(value * .85).toFixed(2)} EUR`;
						else {
							const nanoValue = formatNumberWithUnderscores(value);
							const iotaValue = formatIotaWithUnderscores((value / 1e9).toFixed(2));
							return [`${datasetLabel}: ${nanoValue} NANO`, `${iotaValue} IOTA`];
						}
					} } },
					zoom: {
						zoom: {
							wheel: { enabled: true },
							pinch: { enabled: true },
							mode: "xy"
						},
						pan: {
							enabled: true,
							mode: "xy"
						}
					}
				}
			}
		}));
	}
	function formatNumberWithUnderscores(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
	}
	function formatIotaWithUnderscores(iotaStr) {
		const [intPart, decPart] = iotaStr.split(".");
		if (!decPart) return intPart;
		return `${intPart}.${decPart.replace(/(\d{3})(?=\d)/g, "$1_")}`;
	}
	function formatCurrency(value) {
		return value.toFixed(2);
	}
	function resetZoom() {
		if (get(chart)) get(chart).resetZoom();
	}
	function updateChart() {
		if (!get(chart)) return;
		const datasets = getDatasets();
		mutate(chart, get(chart).data.datasets = datasets);
		get(chart).update();
	}
	onMount(() => {
		createChart();
	});
	onDestroy(() => {
		if (get(chart)) get(chart).destroy();
	});
	legacy_pre_effect(() => (get(chart), deep_read_state(tableData()), deep_read_state(epochEndDates()), deep_read_state(epochPrices())), () => {
		if (get(chart) && tableData() && epochEndDates() && epochPrices()) updateChart();
	});
	legacy_pre_effect(() => get(chart), () => {
		if (get(chart) && selectedMetrics) updateChart();
	});
	legacy_pre_effect_reset();
	init();
	var div = root$4();
	var div_1 = child(div);
	var button = sibling(child(div_1), 2);
	reset(div_1);
	var div_2 = sibling(div_1, 2);
	bind_this(child(div_2), ($$value) => set(canvas, $$value), () => get(canvas));
	reset(div_2);
	reset(div);
	delegated("click", button, resetZoom);
	append($$anchor, div);
	pop();
}
delegate(["click"]);
//#endregion
//#region node_modules/.pnpm/svelte-virtual@1.0.0-next.22_svelte@5.56.6/node_modules/svelte-virtual/dist/utils.js
function scrollStop$2(refresh = 100) {
	let isScrolling;
	return (callback) => {
		clearTimeout(isScrolling);
		isScrolling = setTimeout(callback, refresh);
	};
}
function scrollSpeed(refresh = 200) {
	let lastScrollPosition = void 0;
	let isScrollingFast;
	return (speed, callback) => (scrollPosition) => {
		if (!lastScrollPosition) lastScrollPosition = scrollPosition;
		else {
			if (Math.abs(scrollPosition - lastScrollPosition) > speed) {
				callback.fast();
				if (isScrollingFast !== void 0) {
					clearTimeout(isScrollingFast);
					isScrollingFast = void 0;
				}
				isScrollingFast = setTimeout(() => {
					callback.slow();
					isScrollingFast = void 0;
				}, refresh);
			} else if (isScrollingFast === void 0) callback.slow();
			lastScrollPosition = scrollPosition;
		}
	};
}
var getListIndices = (itemCount, itemSize, size, overScan, scrollPosition) => {
	const indices = [];
	const startIndexTemp = ~~(scrollPosition / itemSize);
	const startIndexOverScan = startIndexTemp > overScan ? startIndexTemp - overScan : 0;
	const startIndex = startIndexOverScan >= 0 ? startIndexOverScan : startIndexTemp;
	const endIndexOverScan = Math.min(itemCount, ~~((scrollPosition + size) / itemSize)) + overScan;
	const endIndex = endIndexOverScan < itemCount ? endIndexOverScan : itemCount;
	for (let i = startIndex; i < endIndex; i++) indices.push(i);
	return indices;
};
//#endregion
//#region node_modules/.pnpm/svelte-virtual@1.0.0-next.22_svelte@5.56.6/node_modules/svelte-virtual/dist/list/List.svelte
var scrollStop = scrollStop$2();
var _scrollSpeed = scrollSpeed();
var rest_excludes = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"itemCount",
	"itemSize",
	"height",
	"width",
	"stickyIndices",
	"overScan",
	"marginLeft",
	"marginTop",
	"layout",
	"scrollPosition",
	"scrollAlignment",
	"scrollBehavior",
	"getKey",
	"onscroll",
	"header",
	"item",
	"placeholder",
	"footer"
]);
var root$3 = from_html(`<div><!></div>`);
var root_1$3 = from_html(`<div><!> <div><!> <!></div> <!></div>`);
function List($$anchor, $$props) {
	push($$props, true);
	/**
	* @default "100%"
	*/
	/**
	* @default "100%"
	*/
	/**
	* @default 1
	*/
	/**
	* @default 0
	*/
	/**
	* @default 0
	*/
	/**
	* @default "vertical"
	*/
	/**
	* @default 0
	*/
	/**
	* @default "auto"
	*/
	/**
	* @default "auto"
	*/
	/**
	* @default
	* ```ts
	* (index: number) => index
	* ```
	*/
	let height = prop($$props, "height", 3, "100%"), width = prop($$props, "width", 3, "100%"), stickyIndices = prop($$props, "stickyIndices", 19, () => []), overScan = prop($$props, "overScan", 3, 1), marginLeft = prop($$props, "marginLeft", 3, 0), marginTop = prop($$props, "marginTop", 3, 0), layout = prop($$props, "layout", 3, "vertical"), scrollPosition = prop($$props, "scrollPosition", 15, 0), scrollAlignment = prop($$props, "scrollAlignment", 3, "auto"), scrollBehavior = prop($$props, "scrollBehavior", 3, "auto"), getKey = prop($$props, "getKey", 3, (index) => index), rest = rest_props($$props, rest_excludes);
	let list = state(void 0);
	let _scrollPosition = state(proxy(scrollPosition()));
	let headerHeight = state(0);
	let headerWidth = state(0);
	let offsetHeight = state(0);
	let clientHeight = state(0);
	let offsetWidth = state(0);
	let clientWidth = state(0);
	let indices = state(proxy([]));
	let manualScroll = false;
	let isScrolling = false;
	let isScrollingFast = state(false);
	function scrollToIndex(index, alignment = scrollAlignment(), behavior = scrollBehavior()) {
		scrollTo(getScrollToPosition(index, alignment), behavior);
	}
	function scrollToPosition(position, behavior = scrollBehavior()) {
		scrollTo(position, behavior);
	}
	const getScrollToPosition = (index, alignment) => {
		const extra = get(isVertical) ? marginTop() + get(headerHeight) : marginLeft() + get(headerWidth);
		const maxOffset = index * $$props.itemSize + extra;
		const minOffset = maxOffset - get(size) + $$props.itemSize + extra;
		let offset;
		switch (alignment) {
			case "start":
				offset = maxOffset;
				break;
			case "center":
				offset = maxOffset - (get(size) - $$props.itemSize) / 2;
				break;
			case "end":
				offset = minOffset;
				break;
			default:
				offset = Math.max(minOffset, Math.min(maxOffset, scrollPosition()));
				break;
		}
		return Math.max(0, Math.min(get(innerSize) - get(size), offset));
	};
	const scrollTo = (direction, behavior = scrollBehavior()) => {
		if (get(list)) {
			manualScroll = true;
			get(list).scrollTo({
				[get(isVertical) ? "top" : "left"]: direction,
				behavior
			});
			manualScroll = false;
		}
	};
	const scrollToManual = (scrollPosition) => {
		if (get(list) && !manualScroll && !isScrolling) {
			manualScroll = true;
			get(list).scrollTo({
				top: scrollPosition,
				behavior: scrollBehavior()
			});
			manualScroll = false;
		}
	};
	const getItemStyle = (index) => {
		const ixis = index * $$props.itemSize;
		return `position: absolute; transform: translate3d(${get(isVertical) ? `${marginLeft()}px, ${ixis + marginTop()}px` : `${get(headerWidth) + ixis + marginLeft()}px, ${marginTop()}px`}, 0px); ${get(itemSizeInternal)} will-change: transform;`;
	};
	const onScroll = (event) => {
		isScrolling = true;
		if (!manualScroll) {
			if (get(isVertical)) {
				set(_scrollPosition, Math.max(0, event.currentTarget["scrollTop"] - get(headerHeight)), true);
				scrollPosition(event.currentTarget["scrollTop"]);
			} else {
				set(_scrollPosition, Math.max(0, event.currentTarget["scrollLeft"] - get(headerWidth)), true);
				scrollPosition(event.currentTarget["scrollLeft"]);
			}
			get(scrollSpeed)(get(_scrollPosition));
		}
		scrollStop(() => {
			isScrolling = false;
		});
	};
	let isVertical = user_derived(() => layout() === "vertical");
	let innerSize = user_derived(() => $$props.itemCount * $$props.itemSize);
	let itemSizeInternal = user_derived(() => get(isVertical) ? `height: ${$$props.itemSize}px; width: ${marginLeft() > 0 ? `${get(clientWidth) - marginLeft()}px` : "100%"};` : `height: ${marginTop() > 0 ? `${get(clientHeight) - marginTop()}px` : "100%"}; width: ${$$props.itemSize}px;`);
	let size = user_derived(() => get(isVertical) ? get(offsetHeight) : get(offsetWidth));
	user_effect(() => {
		if (get(size)) set(indices, getListIndices($$props.itemCount, $$props.itemSize, get(size), overScan(), get(_scrollPosition)), true);
	});
	user_effect(() => {
		if (get(list)) scrollToManual(scrollPosition());
	});
	let scrollSpeed = user_derived(() => _scrollSpeed(get(size), {
		fast: () => {
			set(isScrollingFast, true);
		},
		slow: () => {
			set(isScrollingFast, false);
		}
	}));
	var $$exports = {
		scrollToIndex,
		scrollToPosition
	};
	var div = root_1$3();
	var event_handler = (e) => {
		onScroll(e);
		$$props.onscroll?.(e);
	};
	attribute_effect(div, () => ({
		onscroll: event_handler,
		...rest,
		[STYLE]: {
			position: "relative",
			overflow: "auto",
			height: typeof height() === "number" ? `${height()}px` : height(),
			width: typeof width() !== "number" ? width() : `${width()}px`
		}
	}));
	var node = child(div);
	var consequent_1 = ($$anchor) => {
		var fragment = comment();
		var node_1 = first_child(fragment);
		var consequent = ($$anchor) => {
			var div_1 = root$3();
			snippet(child(div_1), () => $$props.header);
			reset(div_1);
			bind_element_size(div_1, "offsetHeight", ($$value) => set(headerHeight, $$value));
			append($$anchor, div_1);
		};
		var alternate = ($$anchor) => {
			var div_2 = root$3();
			set_style(div_2, "", {}, { position: "absolute" });
			snippet(child(div_2), () => $$props.header);
			reset(div_2);
			bind_element_size(div_2, "offsetWidth", ($$value) => set(headerWidth, $$value));
			append($$anchor, div_2);
		};
		if_block(node_1, ($$render) => {
			if (get(isVertical)) $$render(consequent);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment);
	};
	if_block(node, ($$render) => {
		if ($$props.header) $$render(consequent_1);
	});
	var div_3 = sibling(node, 2);
	let styles;
	var node_4 = child(div_3);
	var consequent_3 = ($$anchor) => {
		const stickyIndex = user_derived(() => Math.max(...stickyIndices().filter((i) => i < get(indices)[0])));
		var fragment_1 = comment();
		var node_5 = first_child(fragment_1);
		var consequent_2 = ($$anchor) => {
			var div_4 = root$3();
			let styles_1;
			snippet(child(div_4), () => $$props.item, () => ({
				index: get(stickyIndex),
				style: ""
			}));
			reset(div_4);
			template_effect(() => styles_1 = set_style(div_4, "", styles_1, {
				position: "sticky",
				top: get(isVertical) ? `${marginTop()}px` : "0px",
				left: get(isVertical) ? "0px" : `${marginLeft()}px`,
				"z-index": "1"
			}));
			append($$anchor, div_4);
		};
		if_block(node_5, ($$render) => {
			if (get(stickyIndex) >= 0) $$render(consequent_2);
		});
		append($$anchor, fragment_1);
	};
	if_block(node_4, ($$render) => {
		if (stickyIndices().length && get(indices).length) $$render(consequent_3);
	});
	each(sibling(node_4, 2), 17, () => get(indices), (index) => getKey()(index), ($$anchor, index) => {
		const style = user_derived(() => getItemStyle(get(index)));
		var fragment_2 = comment();
		var node_8 = first_child(fragment_2);
		var consequent_4 = ($$anchor) => {
			var fragment_3 = comment();
			snippet(first_child(fragment_3), () => $$props.item, () => ({
				index: get(index),
				style: get(style)
			}));
			append($$anchor, fragment_3);
		};
		var alternate_1 = ($$anchor) => {
			var fragment_4 = comment();
			snippet(first_child(fragment_4), () => $$props.placeholder, () => ({
				index: get(index),
				style: get(style)
			}));
			append($$anchor, fragment_4);
		};
		if_block(node_8, ($$render) => {
			if (!get(isScrollingFast) || !$$props.placeholder) $$render(consequent_4);
			else $$render(alternate_1, -1);
		});
		append($$anchor, fragment_2);
	});
	reset(div_3);
	var node_11 = sibling(div_3, 2);
	var consequent_6 = ($$anchor) => {
		var fragment_5 = comment();
		var node_12 = first_child(fragment_5);
		var consequent_5 = ($$anchor) => {
			var div_5 = root$3();
			snippet(child(div_5), () => $$props.footer);
			reset(div_5);
			append($$anchor, div_5);
		};
		var alternate_2 = ($$anchor) => {
			var div_6 = root$3();
			let styles_2;
			snippet(child(div_6), () => $$props.footer);
			reset(div_6);
			template_effect(() => styles_2 = set_style(div_6, "", styles_2, {
				position: "absolute",
				top: "0px",
				left: `${get(headerWidth) + $$props.itemCount * $$props.itemSize + marginLeft()}px`
			}));
			append($$anchor, div_6);
		};
		if_block(node_12, ($$render) => {
			if (get(isVertical)) $$render(consequent_5);
			else $$render(alternate_2, -1);
		});
		append($$anchor, fragment_5);
	};
	if_block(node_11, ($$render) => {
		if ($$props.footer) $$render(consequent_6);
	});
	reset(div);
	bind_this(div, ($$value) => set(list, $$value), () => get(list));
	template_effect(() => styles = set_style(div_3, "", styles, {
		height: get(isVertical) ? `${get(innerSize)}px` : "100%",
		width: !get(isVertical) ? `${get(innerSize)}px` : "100%"
	}));
	bind_element_size(div, "offsetHeight", ($$value) => set(offsetHeight, $$value));
	bind_element_size(div, "clientHeight", ($$value) => set(clientHeight, $$value));
	bind_element_size(div, "offsetWidth", ($$value) => set(offsetWidth, $$value));
	bind_element_size(div, "clientWidth", ($$value) => set(clientWidth, $$value));
	append($$anchor, div);
	return pop($$exports);
}
//#endregion
//#region src/lib/pages/staking-rewards/cache/iota-prices-coingecko.json
var iota_prices_coingecko_default = {
	"06-05-2025": {
		"usd": .2036531179377237,
		"eur": .17998842198024229
	},
	"07-05-2025": {
		"usd": .19717670573190155,
		"eur": .17383670189771064
	},
	"08-05-2025": {
		"usd": .20623671142459296,
		"eur": .18240296586880989
	},
	"09-05-2025": {
		"usd": .23032239804696206,
		"eur": .2051711921802338
	},
	"10-05-2025": {
		"usd": .23722432759679116,
		"eur": .21085684358440798
	},
	"11-05-2025": {
		"usd": .2564765945809729,
		"eur": .22796922109329779
	},
	"12-05-2025": {
		"usd": .24680272463039415,
		"eur": .2197810347187863
	},
	"13-05-2025": {
		"usd": .24245270334155083,
		"eur": .21851704510956307
	},
	"14-05-2025": {
		"usd": .2525430704843509,
		"eur": .2257601202302741
	},
	"15-05-2025": {
		"usd": .23964555702746965,
		"eur": .21427859552499798
	},
	"16-05-2025": {
		"usd": .2258622439853062,
		"eur": .20180294603150345
	},
	"17-05-2025": {
		"usd": .22364137759128536,
		"eur": .2003582974116343
	},
	"18-05-2025": {
		"usd": .21490293629336857,
		"eur": .19252960649880232
	},
	"19-05-2025": {
		"usd": .2272059478708705,
		"eur": .20314461078539758
	},
	"20-05-2025": {
		"usd": .22291773217277108,
		"eur": .19845607775052435
	},
	"21-05-2025": {
		"usd": .2239120908237089,
		"eur": .19837491686526498
	},
	"22-05-2025": {
		"usd": .22737883689843502,
		"eur": .2006761484295935
	},
	"23-05-2025": {
		"usd": .2308315297476423,
		"eur": .20457744404873476
	},
	"24-05-2025": {
		"usd": .20972649382197034,
		"eur": .18445927502578097
	},
	"25-05-2025": {
		"usd": .20717747081811388,
		"eur": .18221735066636002
	},
	"26-05-2025": {
		"usd": .20917942143147725,
		"eur": .1839354396737053
	},
	"27-05-2025": {
		"usd": .20594456346812867,
		"eur": .18078802315136983
	},
	"28-05-2025": {
		"usd": .20891332095636944,
		"eur": .18425131233079114
	},
	"29-05-2025": {
		"usd": .20765550355751294,
		"eur": .1847261828546925
	},
	"30-05-2025": {
		"usd": .1987806919422563,
		"eur": .17469801355206824
	},
	"31-05-2025": {
		"usd": .17796293804389385,
		"eur": .15682805952180112
	},
	"01-06-2025": {
		"usd": .18183079736573007,
		"eur": .160236571870576
	},
	"02-06-2025": {
		"usd": .18433256587274788,
		"eur": .16232915614964977
	},
	"03-06-2025": {
		"usd": .18887271687349205,
		"eur": .1649234675012165
	},
	"04-06-2025": {
		"usd": .1870216666848577,
		"eur": .1642723511493116
	},
	"05-06-2025": {
		"usd": .18189402454299905,
		"eur": .1592816869879117
	},
	"06-06-2025": {
		"usd": .17080719955688037,
		"eur": .14913859822109457
	},
	"07-06-2025": {
		"usd": .17562017526333495,
		"eur": .1540461148331106
	},
	"08-06-2025": {
		"usd": .1797215953944664,
		"eur": .1576436960082332
	},
	"09-06-2025": {
		"usd": .18120538495391755,
		"eur": .15886149255140483
	},
	"10-06-2025": {
		"usd": .189868997577049,
		"eur": .16613803104588407
	},
	"11-06-2025": {
		"usd": .19616166501338528,
		"eur": .17150865543949811
	},
	"12-06-2025": {
		"usd": .18907236508263287,
		"eur": .16428970482942687
	},
	"13-06-2025": {
		"usd": .17635379757528338,
		"eur": .15203496159724708
	},
	"14-06-2025": {
		"usd": .17200379545443253,
		"eur": .14892742224867495
	},
	"15-06-2025": {
		"usd": .16972492436136427,
		"eur": .14695428905919497
	},
	"16-06-2025": {
		"usd": .1700931693713722,
		"eur": .14727312958217026
	},
	"17-06-2025": {
		"usd": .17007692755222617,
		"eur": .1472134861813805
	},
	"18-06-2025": {
		"usd": .16297782084206314,
		"eur": .14196997973552122
	},
	"19-06-2025": {
		"usd": .1643648537164598,
		"eur": .1432429838247725
	},
	"20-06-2025": {
		"usd": .16449848806998815,
		"eur": .1429097064956829
	},
	"21-06-2025": {
		"usd": .15908668115396263,
		"eur": .13804221771087297
	},
	"22-06-2025": {
		"usd": .15053459227828372,
		"eur": .1306214248079356
	},
	"23-06-2025": {
		"usd": .14688420486514928,
		"eur": .12770024640453173
	},
	"24-06-2025": {
		"usd": .16167796681135763,
		"eur": .13939162915421294
	},
	"25-06-2025": {
		"usd": .16324123505967575,
		"eur": .14057355715928926
	},
	"26-06-2025": {
		"usd": .15673652737530355,
		"eur": .1341479725230296
	},
	"27-06-2025": {
		"usd": .15240003551475445,
		"eur": .13028709516163461
	},
	"28-06-2025": {
		"usd": .1543759501184052,
		"eur": .13171356064102335
	},
	"29-06-2025": {
		"usd": .15876087613093748,
		"eur": .13545477951491586
	},
	"30-06-2025": {
		"usd": .1634425553865192,
		"eur": .13933069240312299
	},
	"01-07-2025": {
		"usd": .15962209250458798,
		"eur": .13544429377501055
	},
	"02-07-2025": {
		"usd": .1515620870250062,
		"eur": .12839460952653792
	},
	"03-07-2025": {
		"usd": .1638261749764789,
		"eur": .13883383667911725
	},
	"04-07-2025": {
		"usd": .16374046244859028,
		"eur": .13913796674430226
	},
	"05-07-2025": {
		"usd": .15539718748659764,
		"eur": .1319309689986216
	},
	"06-07-2025": {
		"usd": .15616273236514852,
		"eur": .13258091047615223
	},
	"07-07-2025": {
		"usd": .15933974630213896,
		"eur": .13529171377098131
	},
	"08-07-2025": {
		"usd": .1577762390791673,
		"eur": .1344184135409311
	},
	"09-07-2025": {
		"usd": .16051098280115608,
		"eur": .1369221282577154
	},
	"10-07-2025": {
		"usd": .17250536822934964,
		"eur": .14706962418930034
	},
	"11-07-2025": {
		"usd": .1817015035250281,
		"eur": .1552866474500772
	},
	"12-07-2025": {
		"usd": .18787044382060797,
		"eur": .16072316468853012
	},
	"13-07-2025": {
		"usd": .18718629256721936,
		"eur": .1601378732912561
	},
	"14-07-2025": {
		"usd": .21845492167015637,
		"eur": .18700920951542405
	},
	"15-07-2025": {
		"usd": .2203737486882821,
		"eur": .18889247719316626
	},
	"16-07-2025": {
		"usd": .22387248673273424,
		"eur": .19286435634035662
	},
	"17-07-2025": {
		"usd": .22913515617138006,
		"eur": .19691623272696604
	},
	"18-07-2025": {
		"usd": .2433213326221119,
		"eur": .20947995835969588
	},
	"19-07-2025": {
		"usd": .22860710154059552,
		"eur": .1965906769698351
	},
	"20-07-2025": {
		"usd": .23408333619514402,
		"eur": .2012999649610142
	},
	"21-07-2025": {
		"usd": .2410552015650557,
		"eur": .20724142422071898
	},
	"22-07-2025": {
		"usd": .23748901774580522,
		"eur": .20306284722239096
	},
	"23-07-2025": {
		"usd": .23243048271627567,
		"eur": .19801659301482114
	},
	"24-07-2025": {
		"usd": .2079032316974563,
		"eur": .17655308758333346
	},
	"25-07-2025": {
		"usd": .2000609265137286,
		"eur": .17017522512832817
	},
	"26-07-2025": {
		"usd": .20715666135828686,
		"eur": .17635598747755257
	},
	"27-07-2025": {
		"usd": .2111318388807903,
		"eur": .1797401236804777
	},
	"28-07-2025": {
		"usd": .2212863431656585,
		"eur": .18820669029851067
	},
	"29-07-2025": {
		"usd": .20276879610678428,
		"eur": .17488078696544146
	},
	"30-07-2025": {
		"usd": .20351157247607707,
		"eur": .17616246629730703
	},
	"31-07-2025": {
		"usd": .1999643741430497,
		"eur": .17495283022523705
	},
	"01-08-2025": {
		"usd": .18861744684201204,
		"eur": .16508798620081158
	},
	"02-08-2025": {
		"usd": .1796190382758028,
		"eur": .15493040146479384
	},
	"03-08-2025": {
		"usd": .17660620902533977,
		"eur": .15237813302778058
	},
	"04-08-2025": {
		"usd": .184208495613436,
		"eur": .1590128260004215
	},
	"05-08-2025": {
		"usd": .18982869262429228,
		"eur": .1638827170877115
	},
	"06-08-2025": {
		"usd": .18342047301991105,
		"eur": .1583599172116737
	},
	"07-08-2025": {
		"usd": .18768404651684364,
		"eur": .1609263073730303
	},
	"08-08-2025": {
		"usd": .19899928664090583,
		"eur": .1704198050906854
	},
	"09-08-2025": {
		"usd": .2013131739633304,
		"eur": .1728474911649155
	},
	"10-08-2025": {
		"usd": .206545782587767,
		"eur": .17730013904803474
	},
	"11-08-2025": {
		"usd": .206628218815129,
		"eur": .17740644285385576
	},
	"12-08-2025": {
		"usd": .19802428251798293,
		"eur": .1704694016298881
	},
	"13-08-2025": {
		"usd": .21150319884338772,
		"eur": .1811294359606876
	},
	"14-08-2025": {
		"usd": .2175065664131508,
		"eur": .1857205918106658
	},
	"15-08-2025": {
		"usd": .2001194649197859,
		"eur": .17177814605891603
	},
	"16-08-2025": {
		"usd": .19876572170508894,
		"eur": .16981509680729917
	},
	"17-08-2025": {
		"usd": .20796616877265914,
		"eur": .17767548035858385
	},
	"18-08-2025": {
		"usd": .20899106789854693,
		"eur": .17852560396670417
	},
	"19-08-2025": {
		"usd": .20138646626272505,
		"eur": .1726004861615975
	},
	"20-08-2025": {
		"usd": .1916852531554007,
		"eur": .16463558865637634
	},
	"21-08-2025": {
		"usd": .1981451982813977,
		"eur": .17008446973638108
	},
	"23-08-2025": {
		"usd": .21186185683949935,
		"eur": .18070015562626168
	},
	"25-08-2025": {
		"usd": .20335246689207143,
		"eur": .1736426714791399
	},
	"26-08-2025": {
		"usd": .18880529328794918,
		"eur": .1625634343791504
	},
	"28-08-2025": {
		"usd": .19491472204013596,
		"eur": .16735572949088115
	},
	"30-08-2025": {
		"usd": .19216446962678918,
		"eur": .16444685869229086
	},
	"31-08-2025": {
		"usd": .1927735758990246,
		"eur": .16494709576515232
	},
	"01-09-2025": {
		"usd": .18946984133550962,
		"eur": .16207932319268306
	},
	"02-09-2025": {
		"usd": .1838748288517812,
		"eur": .15694121167123007
	},
	"03-09-2025": {
		"usd": .18744030075911897,
		"eur": .16109912785313926
	},
	"04-09-2025": {
		"usd": .18843350516876362,
		"eur": .16161206847654705
	},
	"05-09-2025": {
		"usd": .18245059300243957,
		"eur": .1565172481636659
	},
	"22-08-2025": {
		"usd": .19299769086903165,
		"eur": .166175836780508
	},
	"24-08-2025": {
		"usd": .20735354258918634,
		"eur": .17689268512220718
	},
	"27-08-2025": {
		"usd": .1969398719867188,
		"eur": .1691930134225101
	},
	"29-08-2025": {
		"usd": .20227717036127502,
		"eur": .1731591694105991
	},
	"06-09-2025": {
		"usd": .18419080622459594,
		"eur": .1571363080339086
	},
	"07-09-2025": {
		"usd": .1820580461520891,
		"eur": .15538599621666965
	},
	"08-09-2025": {
		"usd": .18575322102638553,
		"eur": .15860761681203164
	},
	"09-09-2025": {
		"usd": .1908231359748676,
		"eur": .16214108287589327
	},
	"10-09-2025": {
		"usd": .18962962136663505,
		"eur": .16206543886402375
	},
	"11-09-2025": {
		"usd": .1950068361765679,
		"eur": .16663217147186019
	},
	"12-09-2025": {
		"usd": .19470580630014767,
		"eur": .1659288722464048
	},
	"13-09-2025": {
		"usd": .19902103485739772,
		"eur": .16958582380198867
	},
	"14-09-2025": {
		"usd": .20215297640831256,
		"eur": .17227961816659781
	},
	"15-09-2025": {
		"usd": .19392376669911351,
		"eur": .16538381203023833
	},
	"16-09-2025": {
		"usd": .18764972398943114,
		"eur": .1595080825324602
	},
	"17-09-2025": {
		"usd": .18868676124288356,
		"eur": .1589395385858981
	},
	"18-09-2025": {
		"usd": .19429332951281922,
		"eur": .16429385655605153
	},
	"19-09-2025": {
		"usd": .19555406094019517,
		"eur": .1658658256244985
	},
	"20-09-2025": {
		"usd": .18726448709407156,
		"eur": .1594341753445861
	},
	"21-09-2025": {
		"usd": .18743388877877315,
		"eur": .1595454130334908
	},
	"22-09-2025": {
		"usd": .18418903306455942,
		"eur": .15693071387230234
	},
	"23-09-2025": {
		"usd": .1713477949041276,
		"eur": .14518795570831952
	},
	"24-09-2025": {
		"usd": .169931622229169,
		"eur": .14384134054183578
	},
	"25-09-2025": {
		"usd": .17051956431397378,
		"eur": .14518513160471808
	},
	"26-09-2025": {
		"usd": .15947472182389616,
		"eur": .13673952705651604
	},
	"27-09-2025": {
		"usd": .1668152039055408,
		"eur": .14252223939118477
	},
	"28-09-2025": {
		"usd": .16523857221733224,
		"eur": .14120544808118238
	},
	"29-09-2025": {
		"usd": .16701738950987707,
		"eur": .14267026253668524
	},
	"30-09-2025": {
		"usd": .16757201422093249,
		"eur": .14284441751443486
	},
	"01-10-2025": {
		"usd": .1649734054187207,
		"eur": .1405632804593451
	},
	"02-10-2025": {
		"usd": .17815696349551885,
		"eur": .15181022094898397
	},
	"03-10-2025": {
		"usd": .18318684000595015,
		"eur": .15624243726999507
	},
	"04-10-2025": {
		"usd": .19038362626800512,
		"eur": .16213202881521704
	},
	"05-10-2025": {
		"usd": .18623307715923462,
		"eur": .158664994747353
	},
	"06-10-2025": {
		"usd": .18822387024356108,
		"eur": .16072737438290075
	},
	"07-10-2025": {
		"usd": .19247482891832599,
		"eur": .16436580490309372
	},
	"08-10-2025": {
		"usd": .1832661827664195,
		"eur": .1572123291596142
	},
	"09-10-2025": {
		"usd": .18697742032168807,
		"eur": .1607826316443009
	},
	"10-10-2025": {
		"usd": .17999079966189316,
		"eur": .15563210477125017
	},
	"11-10-2025": {
		"usd": .14815044233312305,
		"eur": .1274963447161354
	},
	"12-10-2025": {
		"usd": .13824235771632404,
		"eur": .11895906948083178
	},
	"13-10-2025": {
		"usd": .1548843515169533,
		"eur": .13350783285798948
	},
	"14-10-2025": {
		"usd": .1617038597533243,
		"eur": .1398057613616694
	},
	"15-10-2025": {
		"usd": .15177794886483809,
		"eur": .13081301256608693
	},
	"16-10-2025": {
		"usd": .1447979292192896,
		"eur": .12433204510550606
	},
	"17-10-2025": {
		"usd": .13858460204967096,
		"eur": .11846641395472231
	},
	"18-10-2025": {
		"usd": .13806668779772774,
		"eur": .11840543918858012
	},
	"19-10-2025": {
		"usd": .14182268147344035,
		"eur": .12166315459271669
	},
	"20-10-2025": {
		"usd": .14369035034348973,
		"eur": .1232509727685298
	},
	"21-10-2025": {
		"usd": .14704479642227097,
		"eur": .12629192316880672
	},
	"22-10-2025": {
		"usd": .14260212109716938,
		"eur": .12293001588969382
	},
	"23-10-2025": {
		"usd": .13949401702116754,
		"eur": .12017800149621247
	},
	"24-10-2025": {
		"usd": .14377927895445303,
		"eur": .12375082539609779
	},
	"25-10-2025": {
		"usd": .1463124279608012,
		"eur": .12585809684430926
	},
	"26-10-2025": {
		"usd": .1466829399057303,
		"eur": .1261768115898491
	},
	"27-10-2025": {
		"usd": .15077402498314077,
		"eur": .12963068191170507
	},
	"28-10-2025": {
		"usd": .14633835565930756,
		"eur": .12558860119530743
	},
	"29-10-2025": {
		"usd": .14455909407974293,
		"eur": .12405685600278939
	},
	"30-10-2025": {
		"usd": .14230460040358237,
		"eur": .1226591657086671
	},
	"31-10-2025": {
		"usd": .13656945270348103,
		"eur": .11802304788744292
	},
	"01-11-2025": {
		"usd": .1374962364060858,
		"eur": .11854100525514287
	},
	"02-11-2025": {
		"usd": .14156875996170282,
		"eur": .1221104170424867
	},
	"03-11-2025": {
		"usd": .14178346857806845,
		"eur": .12296015350617549
	},
	"04-11-2025": {
		"usd": .12659234966299535,
		"eur": .10989924947468453
	},
	"05-11-2025": {
		"usd": .1270056551536597,
		"eur": .11057887072174051
	},
	"06-11-2025": {
		"usd": .12992003498754867,
		"eur": .1130145801948989
	},
	"07-11-2025": {
		"usd": .12609323488157842,
		"eur": .10918690613512624
	},
	"08-11-2025": {
		"usd": .1431524254685537,
		"eur": .12373322634404256
	},
	"09-11-2025": {
		"usd": .14208600994461398,
		"eur": .1228114743515873
	},
	"10-11-2025": {
		"usd": .14122876717406097,
		"eur": .1223560845590569
	},
	"11-11-2025": {
		"usd": .14909932981284504,
		"eur": .12899403068423201
	},
	"12-11-2025": {
		"usd": .1415153655589878,
		"eur": .12214672353639143
	},
	"13-11-2025": {
		"usd": .13932012782311273,
		"eur": .12019217087363858
	},
	"14-11-2025": {
		"usd": .13741922748993204,
		"eur": .11817229048769218
	},
	"15-11-2025": {
		"usd": .1307434582510958,
		"eur": .11247232144742167
	},
	"16-11-2025": {
		"usd": .13356762202882708,
		"eur": .11491663999158776
	},
	"17-11-2025": {
		"usd": .12921508176122232,
		"eur": .11128119134850052
	},
	"18-11-2025": {
		"usd": .12414391416740571,
		"eur": .1071119898632085
	},
	"19-11-2025": {
		"usd": .12767082865556625,
		"eur": .1102520591479441
	},
	"20-11-2025": {
		"usd": .12354837589140821,
		"eur": .10706702254749437
	},
	"21-11-2025": {
		"usd": .11790309953568562,
		"eur": .10222080826644407
	},
	"22-11-2025": {
		"usd": .11397098870948802,
		"eur": .09897240659531939
	},
	"23-11-2025": {
		"usd": .11515149780192638,
		"eur": .09996220918136768
	},
	"24-11-2025": {
		"usd": .11554527392828241,
		"eur": .10040445232326814
	},
	"25-11-2025": {
		"usd": .11848796814505293,
		"eur": .10284471263867047
	},
	"26-11-2025": {
		"usd": .11835430848799902,
		"eur": .1023326857479786
	},
	"27-11-2025": {
		"usd": .11719206967860644,
		"eur": .10101007150531477
	},
	"28-11-2025": {
		"usd": .11834756295392454,
		"eur": .10202743402257834
	},
	"29-11-2025": {
		"usd": .11399153498283654,
		"eur": .09829797838714448
	},
	"30-11-2025": {
		"usd": .1126099008829104,
		"eur": .09710655799865747
	},
	"01-12-2025": {
		"usd": .10907814600142478,
		"eur": .0940364878241203
	},
	"02-12-2025": {
		"usd": .0990196610574005,
		"eur": .08530335858806833
	},
	"03-12-2025": {
		"usd": .1041243787994477,
		"eur": .08953467909082671
	},
	"04-12-2025": {
		"usd": .10456020633289491,
		"eur": .08962712678484354
	},
	"05-12-2025": {
		"usd": .10078657362900743,
		"eur": .0865756667473174
	},
	"06-12-2025": {
		"usd": .09999621748449747,
		"eur": .08586685195015546
	},
	"07-12-2025": {
		"usd": .10286131224878495,
		"eur": .08833842643369125
	},
	"08-12-2025": {
		"usd": .10078667277941426,
		"eur": .08657474405078906
	},
	"09-12-2025": {
		"usd": .10352125858511524,
		"eur": .08893925410081589
	},
	"10-12-2025": {
		"usd": .1070772904853347,
		"eur": .09208507781261151
	},
	"11-12-2025": {
		"usd": .10459673718045599,
		"eur": .0893834555477702
	},
	"12-12-2025": {
		"usd": .10167302310333418,
		"eur": .08660325096500421
	},
	"13-12-2025": {
		"usd": .10008760340139013,
		"eur": .08522809736240275
	},
	"14-12-2025": {
		"usd": .10028745586604176,
		"eur": .08544551412260278
	},
	"15-12-2025": {
		"usd": .09464512390017991,
		"eur": .08062931679205007
	},
	"16-12-2025": {
		"usd": .09173951092875283,
		"eur": .07804693022508184
	},
	"17-12-2025": {
		"usd": .09284611256196375,
		"eur": .07902011940202402
	},
	"18-12-2025": {
		"usd": .08987662385356682,
		"eur": .07654073040617458
	},
	"19-12-2025": {
		"usd": .08461208400886328,
		"eur": .07215244696605409
	},
	"20-12-2025": {
		"usd": .08975321410888476,
		"eur": .07663030692081062
	},
	"21-12-2025": {
		"usd": .09029803170357555,
		"eur": .07710205794647843
	},
	"22-12-2025": {
		"usd": .08700950667064065,
		"eur": .07431699488506097
	},
	"23-12-2025": {
		"usd": .08586545053492631,
		"eur": .072983486318424
	},
	"24-12-2025": {
		"usd": .08430053962253461,
		"eur": .07147539272652068
	},
	"25-12-2025": {
		"usd": .08381279162719046,
		"eur": .0711817010522231
	},
	"26-12-2025": {
		"usd": .0821853212149839,
		"eur": .06974649066377486
	},
	"27-12-2025": {
		"usd": .08358845117005509,
		"eur": .07099710482805383
	},
	"28-12-2025": {
		"usd": .08731379252681827,
		"eur": .07415499279647908
	},
	"29-12-2025": {
		"usd": .0856489274787189,
		"eur": .07273640952309975
	},
	"30-12-2025": {
		"usd": .08291979302422502,
		"eur": .0704401983344931
	},
	"31-12-2025": {
		"usd": .08404093516921547,
		"eur": .07154640125573786
	},
	"01-01-2026": {
		"usd": .08076827616135737,
		"eur": .06884138635716205
	},
	"02-01-2026": {
		"usd": .08476584980166141,
		"eur": .07214184132239958
	},
	"03-01-2026": {
		"usd": .09478504949465844,
		"eur": .0808326902090447
	},
	"04-01-2026": {
		"usd": .09397961024629178,
		"eur": .08013641365701299
	},
	"05-01-2026": {
		"usd": .10185163015489586,
		"eur": .08701653281631466
	},
	"06-01-2026": {
		"usd": .10705498991364493,
		"eur": .0913970200338853
	},
	"07-01-2026": {
		"usd": .11279571803917185,
		"eur": .09651117463442054
	},
	"08-01-2026": {
		"usd": .10709548323154279,
		"eur": .09170307780860606
	},
	"09-01-2026": {
		"usd": .10612064507226585,
		"eur": .09103357908298688
	},
	"10-01-2026": {
		"usd": .10505525465194544,
		"eur": .0902917346604529
	},
	"11-01-2026": {
		"usd": .10125150288627169,
		"eur": .08702252793416106
	},
	"12-01-2026": {
		"usd": .09830072380610655,
		"eur": .08456919399835533
	},
	"13-01-2026": {
		"usd": .09497742776243315,
		"eur": .0813956555924052
	},
	"14-01-2026": {
		"usd": .10358230944473994,
		"eur": .08896881364596658
	},
	"15-01-2026": {
		"usd": .10096699473068992,
		"eur": .08669409842157012
	},
	"16-01-2026": {
		"usd": .09625016807849145,
		"eur": .08291384103970374
	},
	"17-01-2026": {
		"usd": .09492979165981415,
		"eur": .08181998743159381
	},
	"18-01-2026": {
		"usd": .095283859059175,
		"eur": .08209695410082142
	},
	"19-01-2026": {
		"usd": .0888549717488149,
		"eur": .07645454960149381
	},
	"20-01-2026": {
		"usd": .08572517128762805,
		"eur": .07364718045457155
	},
	"21-01-2026": {
		"usd": .08279447557934773,
		"eur": .07059495798615757
	},
	"22-01-2026": {
		"usd": .08744958501740736,
		"eur": .0749241809553641
	},
	"23-01-2026": {
		"usd": .08767635834263161,
		"eur": .07459557173606103
	},
	"24-01-2026": {
		"usd": .08948680626576243,
		"eur": .0756666428796906
	},
	"25-01-2026": {
		"usd": .08841056651858491,
		"eur": .0747405247234813
	},
	"26-01-2026": {
		"usd": .08298941613056571,
		"eur": .06997742258603817
	},
	"01-02-2026": {
		"usd": .07301786617081334,
		"eur": .06159904018755686
	},
	"27-01-2026": {
		"usd": .08635302107451744,
		"eur": .07271727457570361
	},
	"28-01-2026": {
		"usd": .08720914349879048,
		"eur": .07253228069366155
	},
	"29-01-2026": {
		"usd": .08570921244677238,
		"eur": .07159984760299716
	},
	"30-01-2026": {
		"usd": .0813185534034935,
		"eur": .06793181182365698
	},
	"31-01-2026": {
		"usd": .07773334314602717,
		"eur": .06557709201147886
	},
	"02-02-2026": {
		"usd": .07104730783592943,
		"eur": .05995049987234345
	},
	"03-02-2026": {
		"usd": .07457689052876522,
		"eur": .06322315556088495
	},
	"04-02-2026": {
		"usd": .07285445929454967,
		"eur": .06166022591502352
	},
	"05-02-2026": {
		"usd": .07780323592910396,
		"eur": .06592268180272978
	},
	"06-02-2026": {
		"usd": .06716852175377419,
		"eur": .057028560204259164
	},
	"07-02-2026": {
		"usd": .0732860033589118,
		"eur": .062014616042311156
	},
	"08-02-2026": {
		"usd": .07106852179734491,
		"eur": .06013818314491326
	},
	"09-02-2026": {
		"usd": .06938466143900096,
		"eur": .05868672618435148
	},
	"10-02-2026": {
		"usd": .06872310486484004,
		"eur": .05772603362436834
	},
	"11-02-2026": {
		"usd": .06731165937758939,
		"eur": .05661879841550305
	},
	"12-02-2026": {
		"usd": .06457548457008937,
		"eur": .05437972588680253
	},
	"13-02-2026": {
		"usd": .06706609187706034,
		"eur": .05650687104147658
	},
	"14-02-2026": {
		"usd": .068403119967497,
		"eur": .05762928655701638
	},
	"15-02-2026": {
		"usd": .07232418365214648,
		"eur": .06091996172550871
	},
	"16-02-2026": {
		"usd": .06872246124634049,
		"eur": .05792836170330028
	},
	"17-02-2026": {
		"usd": .07057646431562717,
		"eur": .05956194841220882
	},
	"18-02-2026": {
		"usd": .06900975939251186,
		"eur": .058232160219386334
	},
	"19-02-2026": {
		"usd": .06667740063987021,
		"eur": .056564372607420456
	},
	"20-02-2026": {
		"usd": .06769868785651238,
		"eur": .05752046093203717
	},
	"21-02-2026": {
		"usd": .07040367201577022,
		"eur": .05971991478737708
	},
	"22-02-2026": {
		"usd": .06864928102806427,
		"eur": .05826868594524862
	},
	"23-02-2026": {
		"usd": .06794997014776304,
		"eur": .0574421188141428
	},
	"24-02-2026": {
		"usd": .06627146758196405,
		"eur": .056191047191006656
	},
	"25-02-2026": {
		"usd": .0657789765684176,
		"eur": .05586207228198639
	},
	"26-02-2026": {
		"usd": .07074075739302868,
		"eur": .059880565577293515
	},
	"27-02-2026": {
		"usd": .06941296360259573,
		"eur": .058818046490149926
	},
	"01-03-2026": {
		"usd": .06861792214579067,
		"eur": .058062221328337264
	},
	"02-03-2026": {
		"usd": .06597011128724573,
		"eur": .05610052084789474
	},
	"28-02-2026": {
		"usd": .06724504745995048,
		"eur": .056899531398332016
	},
	"03-03-2026": {
		"usd": .06677859831165978,
		"eur": .057088489467851444
	},
	"04-03-2026": {
		"usd": .06597814791294634,
		"eur": .056820974785960605
	},
	"05-03-2026": {
		"usd": .06834339626951448,
		"eur": .05873431475402074
	},
	"06-03-2026": {
		"usd": .06616205995702681,
		"eur": .05699279239170237
	},
	"07-03-2026": {
		"usd": .06472822005964876,
		"eur": .0556921605393218
	},
	"08-03-2026": {
		"usd": .06343401469163651,
		"eur": .05460444388466355
	},
	"09-03-2026": {
		"usd": .06368076181195433,
		"eur": .055245034975486544
	},
	"10-03-2026": {
		"usd": .06315064851347761,
		"eur": .05436538289487666
	},
	"11-03-2026": {
		"usd": .06314151087065194,
		"eur": .05438075252037072
	},
	"12-03-2026": {
		"usd": .06313511702682596,
		"eur": .05469205782682852
	},
	"13-03-2026": {
		"usd": .06348331679731942,
		"eur": .05509621839864156
	},
	"14-03-2026": {
		"usd": .06372630070617273,
		"eur": .05556640280595013
	},
	"15-03-2026": {
		"usd": .06362660950139043,
		"eur": .05550365477278591
	},
	"16-03-2026": {
		"usd": .06438093272978052,
		"eur": .056306276146811454
	},
	"17-03-2026": {
		"usd": .06768663125125207,
		"eur": .058861309835557575
	},
	"18-03-2026": {
		"usd": .0666855608788314,
		"eur": .05778217158921598
	},
	"19-03-2026": {
		"usd": .06334455364726464,
		"eur": .05525279367525576
	},
	"20-03-2026": {
		"usd": .06216400639579,
		"eur": .05370230400920146
	},
	"21-03-2026": {
		"usd": .061826292480163574,
		"eur": .05343028196135735
	},
	"22-03-2026": {
		"usd": .06043431730916213,
		"eur": .0521547554034896
	},
	"23-03-2026": {
		"usd": .0572823147912204,
		"eur": .049553154774126244
	},
	"24-03-2026": {
		"usd": .05880175692312788,
		"eur": .05065788999454545
	},
	"25-03-2026": {
		"usd": .058971989158527756,
		"eur": .050779423508657606
	},
	"26-03-2026": {
		"usd": .059587999067610184,
		"eur": .05154361919348281
	},
	"27-03-2026": {
		"usd": .05733337925060773,
		"eur": .049702765139385846
	},
	"28-03-2026": {
		"usd": .05495741373286952,
		"eur": .0476048262217901
	},
	"29-03-2026": {
		"usd": .05489701292744009,
		"eur": .04755662353488621
	},
	"30-03-2026": {
		"usd": .053256293087237394,
		"eur": .046345064164427324
	},
	"01-04-2026": {
		"usd": .054617692199355306,
		"eur": .04720492439636661
	},
	"02-04-2026": {
		"usd": .058925902039454615,
		"eur": .05083879339175579
	},
	"31-03-2026": {
		"usd": .054659518485340904,
		"eur": .04770901411474496
	},
	"03-04-2026": {
		"usd": .05890981177645155,
		"eur": .05103356994193997
	},
	"04-04-2026": {
		"usd": .06375557276504817,
		"eur": .055336203092414195
	},
	"05-04-2026": {
		"usd": .0611847249032443,
		"eur": .05310944254106431
	},
	"06-04-2026": {
		"usd": .059167891940456414,
		"eur": .05139755019559209
	},
	"07-04-2026": {
		"usd": .057666491130431555,
		"eur": .04996593857083825
	},
	"08-04-2026": {
		"usd": .05984546823392565,
		"eur": .05121772661504529
	},
	"09-04-2026": {
		"usd": .0583260405558856,
		"eur": .05002041238072749
	},
	"10-04-2026": {
		"usd": .05715568202581347,
		"eur": .04888142540598253
	},
	"11-04-2026": {
		"usd": .05746270948079767,
		"eur": .048985753115480916
	},
	"12-04-2026": {
		"usd": .05736530125307287,
		"eur": .04891935058428169
	},
	"13-04-2026": {
		"usd": .05438715624904456,
		"eur": .04658869068880656
	},
	"14-04-2026": {
		"usd": .05632555808542383,
		"eur": .047875147256983865
	},
	"15-04-2026": {
		"usd": .05490947648833016,
		"eur": .04653215729841159
	},
	"16-04-2026": {
		"usd": .055620357035443053,
		"eur": .04710855131688106
	},
	"17-04-2026": {
		"usd": .05911611099009776,
		"eur": .05017024726229923
	},
	"18-04-2026": {
		"usd": .059994145166214534,
		"eur": .05096124668755377
	},
	"19-04-2026": {
		"usd": .056913174966650514,
		"eur": .048350303227043104
	},
	"20-04-2026": {
		"usd": .056346308704587955,
		"eur": .047993081131750194
	},
	"21-04-2026": {
		"usd": .05809301755609611,
		"eur": .04929883846543673
	},
	"22-04-2026": {
		"usd": .058113273960908,
		"eur": .049488159952903996
	},
	"23-04-2026": {
		"usd": .057840975702119116,
		"eur": .04940735655792023
	},
	"24-04-2026": {
		"usd": .05701738033411889,
		"eur": .04879957934132301
	},
	"25-04-2026": {
		"usd": .05801656327632778,
		"eur": .04949068120349176
	},
	"26-04-2026": {
		"usd": .05770915824224108,
		"eur": .049227297000429444
	},
	"27-04-2026": {
		"usd": .058016713797313706,
		"eur": .04955926932679651
	},
	"28-04-2026": {
		"usd": .05684883841786161,
		"eur": .04849205917043595
	},
	"29-04-2026": {
		"usd": .05581216478564718,
		"eur": .04763534777156115
	},
	"01-05-2026": {
		"usd": .05440799864560035,
		"eur": .04638178509340004
	},
	"02-05-2026": {
		"usd": .054713961862676644,
		"eur": .04666001196252879
	},
	"30-04-2026": {
		"usd": .05519574429388009,
		"eur": .0472372355113784
	},
	"03-05-2026": {
		"usd": .05543520116252652,
		"eur": .04726538295599802
	},
	"04-05-2026": {
		"usd": .05457465622054577,
		"eur": .046532698603854804
	},
	"05-05-2026": {
		"usd": .05481219261688849,
		"eur": .046880703908646876
	},
	"06-05-2026": {
		"usd": .05765961818167635,
		"eur": .04921271475653349
	},
	"07-05-2026": {
		"usd": .059104953463048615,
		"eur": .05030487604688877
	},
	"08-05-2026": {
		"usd": .05808162243766196,
		"eur": .04951522202595363
	},
	"09-05-2026": {
		"usd": .061742290244053276,
		"eur": .052355115919927905
	},
	"10-05-2026": {
		"usd": .061258458009841914,
		"eur": .05196456979442074
	},
	"11-05-2026": {
		"usd": .06301816676783173,
		"eur": .0535408646676175
	},
	"12-05-2026": {
		"usd": .0654724736252189,
		"eur": .05558220175939334
	},
	"13-05-2026": {
		"usd": .062283483345452105,
		"eur": .05306459355807502
	},
	"14-05-2026": {
		"usd": .06041399070835223,
		"eur": .05156714715099326
	},
	"15-05-2026": {
		"usd": .062341636571431464,
		"eur": .053452467295984185
	},
	"16-05-2026": {
		"usd": .05799195984849628,
		"eur": .0498962822536462
	},
	"17-05-2026": {
		"usd": .056512601010774315,
		"eur": .048604623213533635
	},
	"18-05-2026": {
		"usd": .05487381015065583,
		"eur": .04725030145404552
	},
	"19-05-2026": {
		"usd": .056089167662752334,
		"eur": .04812203793126435
	},
	"20-05-2026": {
		"usd": .055817541487718454,
		"eur": .04807737882715801
	},
	"21-05-2026": {
		"usd": .05566510882961356,
		"eur": .04788112267131573
	},
	"22-05-2026": {
		"usd": .05697340464709854,
		"eur": .049039345289348245
	},
	"23-05-2026": {
		"usd": .05792026618029359,
		"eur": .04989471825781975
	},
	"24-05-2026": {
		"usd": .05800940396605068,
		"eur": .049990880074631434
	},
	"25-05-2026": {
		"usd": .056220420054101376,
		"eur": .04827990414608015
	},
	"26-05-2026": {
		"usd": .057401764482532446,
		"eur": .04932654165689426
	},
	"27-05-2026": {
		"usd": .056354970457888114,
		"eur": .048421768556590285
	},
	"28-05-2026": {
		"usd": .05512049924759081,
		"eur": .047444859486365294
	},
	"29-05-2026": {
		"usd": .059713658262627506,
		"eur": .05124584352537909
	},
	"30-05-2026": {
		"usd": .06499467129561283,
		"eur": .055729615907751925
	},
	"31-05-2026": {
		"usd": .062180645295007005,
		"eur": .05331287692755017
	},
	"01-06-2026": {
		"usd": .060695080432079454,
		"eur": .052099321751127484
	},
	"02-06-2026": {
		"usd": .05759728526320925,
		"eur": .04950135324932729
	},
	"03-06-2026": {
		"usd": .05275724465166513,
		"eur": .045398980711118794
	},
	"04-06-2026": {
		"usd": .05051314102536883,
		"eur": .043513585586624486
	},
	"05-06-2026": {
		"usd": .0476361275106828,
		"eur": .0410205173942542
	},
	"06-06-2026": {
		"usd": .04440273340789634,
		"eur": .03853402413337468
	},
	"07-06-2026": {
		"usd": .04483750174546764,
		"eur": .03890608315206496
	},
	"08-06-2026": {
		"usd": .0468345237096248,
		"eur": .04064908816329465
	},
	"09-06-2026": {
		"usd": .04708226311025991,
		"eur": .040835435523053736
	},
	"10-06-2026": {
		"usd": .04530162782540774,
		"eur": .039273204305797255
	},
	"11-06-2026": {
		"usd": .04444069296778947,
		"eur": .03852319249566346
	},
	"12-06-2026": {
		"usd": .04636333546828933,
		"eur": .04005370278107437
	},
	"13-06-2026": {
		"usd": .04649521995851736,
		"eur": .04017386933861721
	},
	"14-06-2026": {
		"usd": .04645873166672715,
		"eur": .040156233046282276
	},
	"15-06-2026": {
		"usd": .047617709367763765,
		"eur": .041025989859984215
	},
	"16-06-2026": {
		"usd": .0495051914313209,
		"eur": .0427064949764833
	},
	"17-06-2026": {
		"usd": .0481323306046917,
		"eur": .04145209257239714
	},
	"18-06-2026": {
		"usd": .047425773210560906,
		"eur": .04121347117770952
	},
	"19-06-2026": {
		"usd": .045794050832460194,
		"eur": .03996419339718301
	},
	"20-06-2026": {
		"usd": .044893946361775565,
		"eur": .03911474864662419
	},
	"21-06-2026": {
		"usd": .04509088472153389,
		"eur": .03930346966752502
	},
	"22-06-2026": {
		"usd": .043835962605349686,
		"eur": .03825643361301557
	},
	"23-06-2026": {
		"usd": .04315523052823211,
		"eur": .037769371447847686
	},
	"24-06-2026": {
		"usd": .04175809507050905,
		"eur": .03668978979751616
	},
	"25-06-2026": {
		"usd": .04013912717254289,
		"eur": .03535257639634432
	},
	"26-06-2026": {
		"usd": .037734937258996216,
		"eur": .03320934849858754
	},
	"27-06-2026": {
		"usd": .038374116945388455,
		"eur": .033684799854661995
	},
	"28-06-2026": {
		"usd": .03741666484156597,
		"eur": .0328519065642246
	},
	"29-06-2026": {
		"usd": .03552527876900797,
		"eur": .031205404870696604
	},
	"01-07-2026": {
		"usd": .035126710870299976,
		"eur": .03077721615020682
	},
	"30-06-2026": {
		"usd": .035101572341549266,
		"eur": .030733041257354096
	},
	"02-07-2026": {
		"usd": .03746879752142056,
		"eur": .03293143854796909
	},
	"03-07-2026": {
		"usd": .039264012045969764,
		"eur": .034365551695150716
	},
	"04-07-2026": {
		"usd": .03951874468054938,
		"eur": .03453981755699165
	},
	"05-07-2026": {
		"usd": .03926326395332978,
		"eur": .03433152315794389
	},
	"06-07-2026": {
		"usd": .03819206785583141,
		"eur": .03339678639205678
	},
	"07-07-2026": {
		"usd": .03786349108893336,
		"eur": .03309094949113766
	},
	"08-07-2026": {
		"usd": .03635197566486314,
		"eur": .031880573602157986
	},
	"09-07-2026": {
		"usd": .03639384499288946,
		"eur": .031867688066503766
	},
	"10-07-2026": {
		"usd": .03681682397722031,
		"eur": .0322031973141629
	},
	"11-07-2026": {
		"usd": .03907221126219118,
		"eur": .03421705921854005
	},
	"12-07-2026": {
		"usd": .03946839865785066,
		"eur": .03457439616107449
	},
	"13-07-2026": {
		"usd": .038451218668143265,
		"eur": .03372760180841787
	},
	"14-07-2026": {
		"usd": .0366661170320574,
		"eur": .03221162380606681
	},
	"15-07-2026": {
		"usd": .036793878883924144,
		"eur": .03220549821770439
	},
	"16-07-2026": {
		"usd": .03720811408960658,
		"eur": .032437289701037215
	},
	"17-07-2026": {
		"usd": .035420673477503065,
		"eur": .03095157626349955
	},
	"18-07-2026": {
		"usd": .03583980044442024,
		"eur": .031328716442081954
	},
	"19-07-2026": {
		"usd": .03605145219448654,
		"eur": .03152176748351028
	},
	"20-07-2026": {
		"usd": .035753308082138134,
		"eur": .03128861373538114
	},
	"21-07-2026": {
		"usd": .03626266726291393,
		"eur": .03176910632369542
	},
	"22-07-2026": {
		"usd": .03672388776936154,
		"eur": .032207069917056685
	},
	"23-07-2026": {
		"usd": .03632663638801256,
		"eur": .0318333584065429
	},
	"24-07-2026": {
		"usd": .035057699642736806,
		"eur": .030817155351651002
	},
	"25-07-2026": {
		"usd": .034615009765579796,
		"eur": .030424862833456363
	},
	"26-07-2026": {
		"usd": .03466814948155458,
		"eur": .030473476735033887
	},
	"27-07-2026": {
		"usd": .03503171731464222,
		"eur": .030743029385831778
	},
	"28-07-2026": {
		"usd": .032081655528438016,
		"eur": .028221013265456844
	},
	"29-07-2026": {
		"usd": .03264533119098067,
		"eur": .028670533601160435
	},
	"30-07-2026": {
		"usd": .032078444066254284,
		"eur": .02797458455997024
	},
	"31-07-2026": {
		"usd": .032467295841230884,
		"eur": .028175444003978572
	},
	"01-08-2026": {
		"usd": .03201620907371126,
		"eur": .027752098252019953
	},
	"02-08-2026": {
		"usd": .032373467618188996,
		"eur": .028061774959992875
	},
	"03-08-2026": {
		"usd": .03386748410001397,
		"eur": .029337741969121204
	}
};
//#endregion
//#region src/lib/pages/staking-rewards/pdf-export.ts
var FONT_SIZE = 8;
var CHAR_WIDTH = FONT_SIZE * .55;
var CELL_PADDING = 4;
var MIN_COL_WIDTH = 55;
var MAX_COL_WIDTH = 220;
var PAGE_MARGIN = 30;
/**
* Maximum rows fed to a single autoTable call. autoTable is fully synchronous
* and a 23k-row long-format section can lock the main thread for tens of
* seconds — chunking lets us await between batches so the UI can repaint and
* the "Generating PDF…" indicator stays responsive. Continuation chunks pass
* `showHead: 'never'` and resume at the previous `finalY` so the PDF output
* is identical to a single-call render.
*/
var ROW_CHUNK_SIZE = 500;
var yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));
/**
* Estimate a comfortable width for each column by measuring the longest cell
* (or header) and converting to points, clamped into [MIN, MAX].
*/
function estimateColumnWidths(section) {
	return section.headers.map((header, i) => {
		let maxChars = header.length;
		for (const row of section.rows) {
			const cell = row[i] ?? "";
			if (cell.length > maxChars) maxChars = cell.length;
		}
		const content = maxChars * CHAR_WIDTH + CELL_PADDING * 2;
		return Math.max(MIN_COL_WIDTH, Math.min(MAX_COL_WIDTH, content));
	});
}
/**
* Number of leading columns that stay pinned on every horizontal slice (so
* continuation slices still carry context like epoch/date or stake-object id).
*/
var REPEAT_COLS = 2;
/**
* Split a section's columns into groups that each fit within the usable page
* width. The first REPEAT_COLS columns are repeated at the start of every
* group. Exported for unit testing.
*/
function splitIntoColumnGroups(colWidths, usableWidth) {
	if (colWidths.length <= REPEAT_COLS) return [colWidths.map((_, i) => i)];
	const repeatIndices = Array.from({ length: REPEAT_COLS }, (_, i) => i);
	const repeatWidth = repeatIndices.reduce((sum, i) => sum + colWidths[i], 0);
	const groups = [];
	let current = [...repeatIndices];
	let currentWidth = repeatWidth;
	for (let i = REPEAT_COLS; i < colWidths.length; i++) {
		const w = colWidths[i];
		if (currentWidth + w > usableWidth && current.length > REPEAT_COLS) {
			groups.push(current);
			current = [...repeatIndices, i];
			currentWidth = repeatWidth + w;
		} else {
			current.push(i);
			currentWidth += w;
		}
	}
	groups.push(current);
	return groups;
}
/**
* Render the given sections into a fresh jsPDF document. Returns the doc so
* the caller can either trigger download or extract a blob URL for preview.
* jsPDF + autotable are loaded dynamically to keep them out of the initial
* bundle.
*/
async function renderSectionsToPdf(sections, onProgress) {
	const [{ jsPDF }, autoTableModule] = await Promise.all([__vitePreload(() => import("./jspdf.es.min-DFDj40yB.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])), __vitePreload(() => import("./jspdf.plugin.autotable--ALKN5AO.js"), [])]);
	const autoTable = autoTableModule.default;
	const doc = new jsPDF({
		orientation: "landscape",
		unit: "pt",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const usableWidth = pageWidth - PAGE_MARGIN * 2;
	const bottomLimit = pageHeight - PAGE_MARGIN;
	doc.setFontSize(14);
	doc.text("Staking Rewards", 40, 40);
	let startY = 60;
	const rowHeight = 18;
	const titleHeight = 16;
	const gapAfterTable = 24;
	const rowsTotal = sections.reduce((sum, s) => sum + s.rows.length, 0);
	let rowsDone = 0;
	const reportProgress = () => onProgress?.({
		rowsDone,
		rowsTotal
	});
	reportProgress();
	for (const section of sections) {
		const colWidths = estimateColumnWidths(section);
		const groups = splitIntoColumnGroups(colWidths, usableWidth);
		for (let g = 0; g < groups.length; g++) {
			const group = groups[g];
			const headers = group.map((i) => section.headers[i]);
			const rows = section.rows.map((row) => group.map((i) => row[i] ?? ""));
			const isFirstGroup = g === 0;
			const showTitle = isFirstGroup && !!section.title;
			const estimatedHeight = (showTitle ? titleHeight : 0) + rowHeight + Math.min(rows.length, ROW_CHUNK_SIZE) * rowHeight;
			if (startY > 60 && startY + estimatedHeight > bottomLimit) {
				doc.addPage();
				startY = 40;
			}
			if (showTitle) {
				doc.setFontSize(11);
				doc.text(section.title.replace(/^-+\s*|\s*-+$/g, ""), 40, startY);
				startY += titleHeight;
			}
			const columnStyles = {};
			group.forEach((srcIdx, localIdx) => {
				columnStyles[localIdx] = { cellWidth: colWidths[srcIdx] };
			});
			const chunkCount = rows.length === 0 ? 1 : Math.ceil(rows.length / ROW_CHUNK_SIZE);
			for (let chunk = 0; chunk < chunkCount; chunk++) {
				const sliceStart = chunk * ROW_CHUNK_SIZE;
				const chunkRows = rows.slice(sliceStart, sliceStart + ROW_CHUNK_SIZE);
				const isFirstChunk = chunk === 0;
				autoTable(doc, {
					startY,
					head: isFirstChunk ? [headers] : void 0,
					body: chunkRows,
					styles: {
						fontSize: FONT_SIZE,
						cellPadding: CELL_PADDING,
						overflow: "linebreak"
					},
					columnStyles,
					headStyles: {
						fillColor: [
							59,
							130,
							246
						],
						textColor: 255,
						valign: "middle"
					},
					margin: {
						left: PAGE_MARGIN,
						right: PAGE_MARGIN
					},
					showHead: isFirstChunk ? "firstPage" : "never"
				});
				startY = doc.lastAutoTable?.finalY ?? startY;
				if (isFirstGroup) {
					rowsDone += chunkRows.length;
					reportProgress();
				}
				if (chunk < chunkCount - 1) await yieldToBrowser();
			}
			startY += gapAfterTable;
			if (g < groups.length - 1) await yieldToBrowser();
		}
	}
	return doc;
}
/**
* Render the given sections and return a blob URL pointing to the resulting
* PDF. Caller is responsible for calling `URL.revokeObjectURL` when done.
* Used for the in-dialog PDF preview.
*/
async function renderSectionsToPdfBlobUrl(sections, onProgress) {
	return (await renderSectionsToPdf(sections, onProgress)).output("bloburl");
}
/**
* Export table data as a PDF and trigger download.
*/
async function exportTableToPDF(epochs, epochEndDates, currentEpoch, stakeObjects, uniqueValidators, epochData, options, onProgress) {
	const doc = await renderSectionsToPdf(buildExportSections({
		epochs,
		epochEndDates,
		currentEpoch,
		stakeObjects,
		uniqueValidators,
		epochData,
		options
	}), onProgress);
	const stem = options.fileName?.trim() || `staking-rewards-table-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
	doc.save(`${stem}.pdf`);
}
//#endregion
//#region src/lib/pages/staking-rewards/ExportDialog.svelte
var root$2 = from_html(`<span class="hint svelte-1ubkki9">(fetch prices first)</span>`);
var root_1$2 = from_html(`<div class="pdf-preview-error svelte-1ubkki9"> </div>`);
var root_2$2 = from_html(`<div class="pdf-preview-overlay svelte-1ubkki9">Updating…</div>`);
var root_3$2 = from_html(`<iframe class="pdf-preview-iframe svelte-1ubkki9" title="PDF preview"></iframe> <!>`, 1);
var root_4$2 = from_html(`<div class="pdf-preview-loading svelte-1ubkki9">Rendering PDF preview…</div>`);
var root_5$2 = from_html(`<div class="preview-hint svelte-1ubkki9"></div> <div><!></div>`, 1);
var root_6$2 = from_html(`<div class="preview-section-title svelte-1ubkki9"> </div>`);
var root_7$2 = from_html(`<th class="svelte-1ubkki9"> </th>`);
var root_8$2 = from_html(`<td class="svelte-1ubkki9"> </td>`);
var root_9$2 = from_html(`<tr></tr>`);
var root_10$2 = from_html(`<div class="preview-more svelte-1ubkki9">… more rows below in the export</div>`);
var root_11$2 = from_html(`<!> <table class="preview-table svelte-1ubkki9"><thead><tr></tr></thead><tbody></tbody></table> <!>`, 1);
var root_12$2 = from_html(`<div class="preview-hint svelte-1ubkki9"></div> <div></div>`, 1);
var root_13$2 = from_html(` <!>`, 1);
var root_14$2 = from_html(`<div class="modal-overlay svelte-1ubkki9" role="presentation" tabindex="-1"><div role="dialog" aria-modal="true" aria-labelledby="export-title" tabindex="-1"><div class="modal-header svelte-1ubkki9"><h3 id="export-title" class="svelte-1ubkki9">Export table</h3> <button class="close-btn svelte-1ubkki9" aria-label="Close">×</button></div> <div class="modal-body svelte-1ubkki9"><section><div class="section-title svelte-1ubkki9">Format</div> <div class="format-row svelte-1ubkki9"><label><input type="radio"/> <span>CSV</span></label> <label><input type="radio"/> <span>PDF</span></label></div></section> <section><div class="section-title svelte-1ubkki9">Columns</div> <label class="option svelte-1ubkki9"><input type="checkbox" class="svelte-1ubkki9"/> <span class="svelte-1ubkki9">Include price columns <!></span></label> <label class="option svelte-1ubkki9"><input type="checkbox" class="svelte-1ubkki9"/> <span class="svelte-1ubkki9">Include validator columns</span></label></section> <section><div class="section-title svelte-1ubkki9">Layout</div> <p class="section-description svelte-1ubkki9">Wrap options move per-object data into extra sections below the main table
                        (one row per epoch × object). Keeps the main table readable for PDF /
                        printout.</p> <label class="option svelte-1ubkki9"><input type="checkbox" class="svelte-1ubkki9"/> <span class="svelte-1ubkki9">Wrap stake objects to rows</span></label> <label class="option svelte-1ubkki9"><input type="checkbox" class="svelte-1ubkki9"/> <span class="svelte-1ubkki9">Wrap validators to rows</span></label></section> <section><div class="preview-header svelte-1ubkki9"><div class="section-title svelte-1ubkki9">Preview</div> <button type="button" class="maximize-btn svelte-1ubkki9"> </button></div> <!></section> <section><div class="section-title svelte-1ubkki9">Filename</div> <label class="filename-field svelte-1ubkki9"><input type="text" placeholder="staking-rewards-table-YYYY-MM-DD" class="svelte-1ubkki9"/> <span> </span></label></section></div> <div class="actions svelte-1ubkki9"><button class="secondary svelte-1ubkki9">Cancel</button> <button class="primary svelte-1ubkki9"><!></button></div></div></div>`);
function ExportDialog($$anchor, $$props) {
	push($$props, true);
	const binding_group = [];
	let open = prop($$props, "open", 3, false), defaultFileName = prop($$props, "defaultFileName", 3, ""), pricesAvailable = prop($$props, "pricesAvailable", 3, false), validatorsAvailable = prop($$props, "validatorsAvailable", 3, false), stakeObjectsAvailable = prop($$props, "stakeObjectsAvailable", 3, false), exporting = prop($$props, "exporting", 3, false), exportProgress = prop($$props, "exportProgress", 3, null);
	/** Default filename stem (no extension) shown when the dialog opens. */
	/**
	* Set by the parent while a download is being generated. Disables the
	* dialog controls and replaces the Export label with a progress hint.
	*/
	/**
	* Live progress emitted by the exporters as they yield between row
	* batches. Drives the "Generating PDF… (40%)" label so the user can
	* see that work is happening on huge datasets.
	*/
	/**
	* Builds the ExportSection[] the dialog previews. When
	* `previewRowLimit` is set the implementation should short-circuit row
	* generation so previews don't pay for building rows that will never
	* be shown.
	*/
	const PREVIEW_ROW_LIMIT = 5;
	let format = state("csv");
	let includePrices = state(true);
	let includeValidators = state(true);
	let wrapStakeObjects = state(true);
	let wrapValidators = state(true);
	let fileName = state("");
	let isMaximized = state(false);
	let effectiveOpts = user_derived(() => ({
		includePrices: pricesAvailable() && get(includePrices),
		includeValidators: validatorsAvailable() && get(includeValidators),
		wrapStakeObjects: stakeObjectsAvailable() && get(wrapStakeObjects),
		wrapValidators: validatorsAvailable() && get(wrapValidators)
	}));
	let progressPct = user_derived(() => exportProgress() && exportProgress().rowsTotal > 0 ? Math.min(100, Math.round(exportProgress().rowsDone / exportProgress().rowsTotal * 100)) : null);
	let previewSections = user_derived(() => open() && get(format) === "csv" ? $$props.buildPreview(get(effectiveOpts), PREVIEW_ROW_LIMIT) : []);
	let pdfPreviewUrl = state(null);
	let pdfPreviewLoading = state(false);
	let pdfPreviewError = state("");
	const PDF_PREVIEW_DEBOUNCE_MS = 250;
	const PDF_PREVIEW_ROW_LIMIT = 25;
	user_effect(() => {
		const shouldRender = open() && get(format) === "pdf";
		const opts = get(effectiveOpts);
		if (!shouldRender) {
			if (get(pdfPreviewUrl)) {
				URL.revokeObjectURL(get(pdfPreviewUrl));
				set(pdfPreviewUrl, null);
			}
			set(pdfPreviewError, "");
			return;
		}
		let cancelled = false;
		set(pdfPreviewLoading, true);
		set(pdfPreviewError, "");
		const timeout = setTimeout(async () => {
			try {
				const sections = $$props.buildPreview(opts, PDF_PREVIEW_ROW_LIMIT);
				if (cancelled) return;
				const url = await renderSectionsToPdfBlobUrl(sections);
				if (cancelled) {
					URL.revokeObjectURL(url);
					return;
				}
				if (get(pdfPreviewUrl)) URL.revokeObjectURL(get(pdfPreviewUrl));
				set(pdfPreviewUrl, url, true);
			} catch (err) {
				if (!cancelled) set(pdfPreviewError, err instanceof Error ? err.message : "Failed to render PDF", true);
			} finally {
				if (!cancelled) set(pdfPreviewLoading, false);
			}
		}, PDF_PREVIEW_DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(timeout);
		};
	});
	user_effect(() => {
		if (open()) set(fileName, untrack(() => defaultFileName()), true);
	});
	function handleExport() {
		$$props.onExport({
			format: get(format),
			includePrices: pricesAvailable() && get(includePrices),
			includeValidators: validatorsAvailable() && get(includeValidators),
			wrapStakeObjects: stakeObjectsAvailable() && get(wrapStakeObjects),
			wrapValidators: validatorsAvailable() && get(wrapValidators),
			fileName: get(fileName)
		});
	}
	function handleKeydown(e) {
		if (e.key === "Escape") $$props.onCancel();
	}
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_9 = ($$anchor) => {
		var div = root_14$2();
		var div_1 = child(div);
		let classes;
		var div_2 = child(div_1);
		var button = sibling(child(div_2), 2);
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var section_1 = child(div_3);
		var div_4 = sibling(child(section_1), 2);
		var label = child(div_4);
		let classes_1;
		var input = child(label);
		remove_input_defaults(input);
		input.value = input.__value = "csv";
		next(2);
		reset(label);
		var label_1 = sibling(label, 2);
		let classes_2;
		var input_1 = child(label_1);
		remove_input_defaults(input_1);
		input_1.value = input_1.__value = "pdf";
		next(2);
		reset(label_1);
		reset(div_4);
		reset(section_1);
		var section_2 = sibling(section_1, 2);
		var label_2 = sibling(child(section_2), 2);
		var input_2 = child(label_2);
		remove_input_defaults(input_2);
		var span = sibling(input_2, 2);
		var node_1 = sibling(child(span));
		var consequent = ($$anchor) => {
			append($$anchor, root$2());
		};
		if_block(node_1, ($$render) => {
			if (!pricesAvailable()) $$render(consequent);
		});
		reset(span);
		reset(label_2);
		var label_3 = sibling(label_2, 2);
		var input_3 = child(label_3);
		remove_input_defaults(input_3);
		next(2);
		reset(label_3);
		reset(section_2);
		var section_3 = sibling(section_2, 2);
		var label_4 = sibling(child(section_3), 4);
		var input_4 = child(label_4);
		remove_input_defaults(input_4);
		next(2);
		reset(label_4);
		var label_5 = sibling(label_4, 2);
		var input_5 = child(label_5);
		remove_input_defaults(input_5);
		next(2);
		reset(label_5);
		reset(section_3);
		var section_4 = sibling(section_3, 2);
		var div_5 = child(section_4);
		var button_1 = sibling(child(div_5), 2);
		var text$2 = child(button_1, true);
		reset(button_1);
		reset(div_5);
		var node_2 = sibling(div_5, 2);
		var consequent_4 = ($$anchor) => {
			var fragment_1 = root_5$2();
			var div_6 = first_child(fragment_1);
			div_6.textContent = "First 25 rows of each section. Full export contains all\n                            epochs.";
			var div_7 = sibling(div_6, 2);
			let classes_3;
			var node_3 = child(div_7);
			var consequent_1 = ($$anchor) => {
				var div_8 = root_1$2();
				var text_1 = child(div_8);
				reset(div_8);
				template_effect(() => set_text(text_1, `Failed to render PDF preview: ${get(pdfPreviewError) ?? ""}`));
				append($$anchor, div_8);
			};
			var consequent_3 = ($$anchor) => {
				var fragment_2 = root_3$2();
				var iframe = first_child(fragment_2);
				var node_4 = sibling(iframe, 2);
				var consequent_2 = ($$anchor) => {
					append($$anchor, root_2$2());
				};
				if_block(node_4, ($$render) => {
					if (get(pdfPreviewLoading)) $$render(consequent_2);
				});
				template_effect(() => set_attribute(iframe, "src", get(pdfPreviewUrl)));
				append($$anchor, fragment_2);
			};
			var alternate = ($$anchor) => {
				append($$anchor, root_4$2());
			};
			if_block(node_3, ($$render) => {
				if (get(pdfPreviewError)) $$render(consequent_1);
				else if (get(pdfPreviewUrl)) $$render(consequent_3, 1);
				else $$render(alternate, -1);
			});
			reset(div_7);
			template_effect(() => classes_3 = set_class(div_7, 1, "pdf-preview-frame svelte-1ubkki9", null, classes_3, { maximized: get(isMaximized) }));
			append($$anchor, fragment_1);
		};
		var alternate_1 = ($$anchor) => {
			var fragment_3 = root_12$2();
			var div_11 = first_child(fragment_3);
			div_11.textContent = "First 5 rows of each section; full export contains all epochs.";
			var div_12 = sibling(div_11, 2);
			let classes_4;
			each(div_12, 21, () => get(previewSections), index, ($$anchor, section) => {
				var fragment_4 = root_11$2();
				var node_5 = first_child(fragment_4);
				var consequent_5 = ($$anchor) => {
					var div_13 = root_6$2();
					var text_2 = child(div_13, true);
					reset(div_13);
					template_effect(($0) => set_text(text_2, $0), [() => get(section).title.replace(/^-+\s*|\s*-+$/g, "")]);
					append($$anchor, div_13);
				};
				if_block(node_5, ($$render) => {
					if (get(section).title) $$render(consequent_5);
				});
				var table = sibling(node_5, 2);
				var thead = child(table);
				var tr = child(thead);
				each(tr, 21, () => get(section).headers, index, ($$anchor, header) => {
					var th = root_7$2();
					var text_3 = child(th, true);
					reset(th);
					template_effect(() => set_text(text_3, get(header)));
					append($$anchor, th);
				});
				reset(tr);
				reset(thead);
				var tbody = sibling(thead);
				each(tbody, 21, () => get(section).rows, index, ($$anchor, row) => {
					var tr_1 = root_9$2();
					each(tr_1, 21, () => get(row), index, ($$anchor, cell) => {
						var td = root_8$2();
						var text_4 = child(td, true);
						reset(td);
						template_effect(() => {
							set_attribute(td, "title", get(cell));
							set_text(text_4, get(cell));
						});
						append($$anchor, td);
					});
					reset(tr_1);
					append($$anchor, tr_1);
				});
				reset(tbody);
				reset(table);
				var node_6 = sibling(table, 2);
				var consequent_6 = ($$anchor) => {
					append($$anchor, root_10$2());
				};
				if_block(node_6, ($$render) => {
					if (get(section).truncated) $$render(consequent_6);
				});
				append($$anchor, fragment_4);
			});
			reset(div_12);
			template_effect(() => classes_4 = set_class(div_12, 1, "preview-scroller svelte-1ubkki9", null, classes_4, { maximized: get(isMaximized) }));
			append($$anchor, fragment_3);
		};
		if_block(node_2, ($$render) => {
			if (get(format) === "pdf") $$render(consequent_4);
			else $$render(alternate_1, -1);
		});
		reset(section_4);
		var section_5 = sibling(section_4, 2);
		var label_6 = sibling(child(section_5), 2);
		var input_6 = child(label_6);
		remove_input_defaults(input_6);
		var span_2 = sibling(input_6, 2);
		var text_5 = child(span_2);
		reset(span_2);
		reset(label_6);
		reset(section_5);
		reset(div_3);
		var div_15 = sibling(div_3, 2);
		var button_2 = child(div_15);
		var button_3 = sibling(button_2, 2);
		var node_7 = child(button_3);
		var consequent_8 = ($$anchor) => {
			var fragment_5 = root_13$2();
			var text_6 = first_child(fragment_5);
			var node_8 = sibling(text_6);
			var consequent_7 = ($$anchor) => {
				var text_7 = text();
				template_effect(() => set_text(text_7, `${get(progressPct) ?? ""}%`));
				append($$anchor, text_7);
			};
			if_block(node_8, ($$render) => {
				if (get(progressPct) !== null) $$render(consequent_7);
			});
			template_effect(($0) => set_text(text_6, `Generating ${$0 ?? ""}… `), [() => get(format).toUpperCase()]);
			append($$anchor, fragment_5);
		};
		var alternate_2 = ($$anchor) => {
			append($$anchor, text("Export"));
		};
		if_block(node_7, ($$render) => {
			if (exporting()) $$render(consequent_8);
			else $$render(alternate_2, -1);
		});
		reset(button_3);
		reset(div_15);
		reset(div_1);
		reset(div);
		template_effect(() => {
			classes = set_class(div_1, 1, "modal-content svelte-1ubkki9", null, classes, { maximized: get(isMaximized) });
			classes_1 = set_class(label, 1, "format-option svelte-1ubkki9", null, classes_1, { active: get(format) === "csv" });
			classes_2 = set_class(label_1, 1, "format-option svelte-1ubkki9", null, classes_2, { active: get(format) === "pdf" });
			input_2.disabled = !pricesAvailable();
			input_3.disabled = !validatorsAvailable();
			input_4.disabled = !stakeObjectsAvailable();
			input_5.disabled = !validatorsAvailable() || !get(includeValidators);
			set_attribute(button_1, "title", get(isMaximized) ? "Restore preview size" : "Maximize preview");
			set_attribute(button_1, "aria-label", get(isMaximized) ? "Restore preview size" : "Maximize preview");
			set_text(text$2, get(isMaximized) ? "⤢ Restore" : "⤢ Maximize");
			set_text(text_5, `.${get(format) ?? ""}`);
			button_2.disabled = exporting();
			button_3.disabled = exporting();
		});
		delegated("click", div, function(...$$args) {
			$$props.onCancel?.apply(this, $$args);
		});
		delegated("keydown", div, handleKeydown);
		delegated("click", div_1, (e) => e.stopPropagation());
		delegated("keydown", div_1, (e) => e.stopPropagation());
		delegated("click", button, function(...$$args) {
			$$props.onCancel?.apply(this, $$args);
		});
		bind_group(binding_group, [], input, () => get(format), ($$value) => set(format, $$value));
		bind_group(binding_group, [], input_1, () => get(format), ($$value) => set(format, $$value));
		bind_checked(input_2, () => get(includePrices), ($$value) => set(includePrices, $$value));
		bind_checked(input_3, () => get(includeValidators), ($$value) => set(includeValidators, $$value));
		bind_checked(input_4, () => get(wrapStakeObjects), ($$value) => set(wrapStakeObjects, $$value));
		bind_checked(input_5, () => get(wrapValidators), ($$value) => set(wrapValidators, $$value));
		delegated("click", button_1, () => set(isMaximized, !get(isMaximized)));
		bind_value(input_6, () => get(fileName), ($$value) => set(fileName, $$value));
		delegated("click", button_2, function(...$$args) {
			$$props.onCancel?.apply(this, $$args);
		});
		delegated("click", button_3, handleExport);
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if (open()) $$render(consequent_9);
	});
	append($$anchor, fragment);
	pop();
}
delegate(["click", "keydown"]);
//#endregion
//#region src/lib/pages/staking-rewards/price-fetching.ts
function formatDateForCoinGecko(dateStr) {
	const [date] = dateStr.split(" ");
	const [yyyy, mm, dd] = date.split("-");
	return `${dd}-${mm}-${yyyy}`;
}
var EPOCH_RATE_LIMIT_MS = 5e3;
var MAX_RETRIES = 10;
var RETRY_DELAY_MS = 1e4;
function applyRateLimit(delayMs) {
	return new Promise((resolve) => setTimeout(resolve, delayMs));
}
async function fetchCoinGeckoPrice(dateStr) {
	const url = `https://api.coingecko.com/api/v3/coins/iota/history?date=${dateStr}`;
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) try {
		const res = await fetch(url);
		if (res.ok) {
			const data = await res.json();
			const usd = data?.market_data?.current_price?.["usd"];
			const eur = data?.market_data?.current_price?.["eur"];
			if (typeof usd === "number" || typeof eur === "number") return {
				usd,
				eur
			};
			return null;
		}
		if (res.status === 429) if (attempt < MAX_RETRIES) {
			const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
			console.warn(`Rate limited for date ${dateStr}, retrying in ${delay}ms (attempt ${attempt + 1}/11)`);
			await applyRateLimit(delay);
			continue;
		} else {
			console.warn(`Rate limit exceeded for date ${dateStr} after 11 attempts`);
			return null;
		}
		console.warn(`API error for date ${dateStr}: ${res.status}`);
		return null;
	} catch (error) {
		if (attempt < MAX_RETRIES) {
			const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
			console.warn(`Network error for date ${dateStr}: ${error instanceof Error ? error.message : String(error)}, retrying in ${delay}ms (attempt ${attempt + 1}/11)`);
			await applyRateLimit(delay);
			continue;
		} else {
			console.warn(`Network error for date ${dateStr} after 11 attempts: ${error instanceof Error ? error.message : String(error)}`);
			return null;
		}
	}
	return null;
}
function reloadFromCoinGeckoCache(params) {
	const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
	const newEpochPrices = {};
	for (let i = 0; i < epochs.length; i++) {
		const dateStr = epochEndDates[i];
		if (!dateStr) continue;
		const cached = loadedCache[formatDateForCoinGecko(dateStr)];
		if (!cached) continue;
		if (selectedCurrency === "usd" && typeof cached.usd === "number") newEpochPrices[epochs[i]] = cached.usd;
		else if (selectedCurrency === "eur" && typeof cached.eur === "number") newEpochPrices[epochs[i]] = cached.eur;
	}
	return newEpochPrices;
}
async function fetchAllPrices(params) {
	const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
	let epochPrices = {};
	let cache = { ...loadedCache };
	const now = /* @__PURE__ */ new Date();
	for (let i = 0; i < epochs.length; i++) {
		const epoch = epochs[i];
		const dateStr = epochEndDates[i];
		if (!dateStr) continue;
		if (new Date(dateStr) > now) continue;
		const formatted = formatDateForCoinGecko(dateStr);
		const cached = cache[formatted];
		if (cached) {
			if (selectedCurrency === "usd" && typeof cached.usd === "number") epochPrices[epoch] = cached.usd;
			else if (selectedCurrency === "eur" && typeof cached.eur === "number") epochPrices[epoch] = cached.eur;
			continue;
		}
		let success = false;
		let attempt = 0;
		while (!success && attempt < 5) try {
			const priceData = await fetchCoinGeckoPrice(formatted);
			if (!priceData) throw new Error("No price data for epoch " + epoch);
			const { usd, eur } = priceData;
			if (typeof usd === "number" && selectedCurrency === "usd") epochPrices[epoch] = usd;
			if (typeof eur === "number" && selectedCurrency === "eur") epochPrices[epoch] = eur;
			cache[formatted] = {
				usd,
				eur
			};
			success = true;
		} catch (e) {
			attempt++;
			if (attempt >= 5) return {
				epochPrices,
				updatedCache: cache,
				error: typeof e === "object" && e && "message" in e ? e.message : "Failed to fetch prices"
			};
			await new Promise((r) => setTimeout(r, attempt * 1e4));
		}
		if (i < epochs.length - 1) await applyRateLimit(EPOCH_RATE_LIMIT_MS);
	}
	return {
		epochPrices,
		updatedCache: cache
	};
}
//#endregion
//#region src/lib/pages/staking-rewards/StakingRewardsTable.svelte
var root$1 = from_html(`<div class="action-epoch-group svelte-toncsw"><div class="action-epoch-label svelte-toncsw"> </div> <div class="action-details-text svelte-toncsw"> </div></div>`);
var root_1$1 = from_html(`<div class="actions-section svelte-toncsw"><div class="actions-title svelte-toncsw">Actions:</div> <div class="actions-list svelte-toncsw"></div></div>`);
var root_2$1 = from_html(`<div class="address-hover-inline svelte-toncsw"><button class="close-hover svelte-toncsw" aria-label="Close address info">×</button> <div class="full-address svelte-toncsw"> </div> <div class="principal svelte-toncsw"> </div> <div class="pool-id svelte-toncsw"> </div> <div class="epochs-info svelte-toncsw"> </div> <div class="epochs-info svelte-toncsw"> </div> <!></div>`);
var root_3$1 = from_html(`<div class="validator-hover-inline svelte-toncsw"><button class="close-hover svelte-toncsw" aria-label="Close validator info">×</button> <div class="validator-display-name svelte-toncsw"> </div> <div class="validator-display-pool-id svelte-toncsw"> <button class="copy-btn validator-copy-btn svelte-toncsw" title="Copy pool ID">📋</button></div> <div class="validator-stats svelte-toncsw"><div> </div> <div> </div></div></div>`);
var root_4$1 = from_html(`<div class="action-hover-inline svelte-toncsw"><button class="close-hover svelte-toncsw" aria-label="Close action info">×</button> <div class="action-title"> </div> <div class="action-stake-object svelte-toncsw"> </div> <div class="action-details svelte-toncsw"> </div></div>`);
var root_5$1 = from_html(`<span style="color: red;"> </span>`);
var root_6$1 = from_html(`<span style="color: green;"> </span>`);
var root_7$1 = from_html(`<div class="export-error svelte-toncsw" role="alert"> <button type="button" class="export-error-dismiss svelte-toncsw" aria-label="Dismiss">×</button></div>`);
var root_8$1 = from_html(`<div style="text-align: center; padding: 2rem; color: #bacce6;">No stake transactions for this address.</div>`);
var root_9$1 = from_html(`<div class="header-cell rewards-header svelte-toncsw"> </div> <div class="header-cell rewards-header svelte-toncsw"> </div> <div class="header-cell rewards-header svelte-toncsw"> </div> <div class="header-cell rewards-header svelte-toncsw" title="Cumulative unstake rewards × price on the day they were unstaked + current available rewards × price at this epoch"> </div>`, 1);
var root_10$1 = from_html(`<div class="header-cell validator-header-cell svelte-toncsw"><div class="validator-header svelte-toncsw"><div class="validator-name clickable-validator svelte-toncsw" role="button" tabindex="0"> </div></div></div>`);
var root_11$1 = from_html(`<div class="header-cell stake-header-cell svelte-toncsw"><div class="stake-header svelte-toncsw"><div class="address-container svelte-toncsw"><span class="address svelte-toncsw" role="button" tabindex="0"> <button class="copy-btn svelte-toncsw" title="Copy full address">📋</button></span></div></div></div>`);
var root_12$1 = from_html(`<span class="amount-value svelte-toncsw">pending</span>`);
var root_13$1 = from_html(`<button class="amount-value svelte-toncsw" type="button"> </button> <div class="amount-popup svelte-toncsw"><div> </div> <div class="nano-amount svelte-toncsw"> </div></div>`, 1);
var root_14$1 = from_html(`<div class="table-cell rewards-cell svelte-toncsw"><div class="amount-popup-container svelte-toncsw"><!></div></div>`);
var root_15$1 = from_html(`<div class="table-cell rewards-cell svelte-toncsw"> </div> <div class="table-cell rewards-cell svelte-toncsw"> </div> <div class="table-cell rewards-cell svelte-toncsw"> </div> <div class="table-cell rewards-cell svelte-toncsw"> </div>`, 1);
var root_16$1 = from_html(`<button class="validator-reward-value svelte-toncsw" type="button"> </button> <div class="validator-popup svelte-toncsw"><div> </div> <div> </div> <div> </div> <div class="nano-amount svelte-toncsw"> </div> <div> </div> <div class="nano-amount svelte-toncsw"> </div></div>`, 1);
var root_17$1 = from_html(`<div class="table-cell validator-cell svelte-toncsw"><div class="validator-popup-container svelte-toncsw"><!></div></div>`);
var root_18$1 = from_html(`<span class="stake-value svelte-toncsw">-</span>`);
var root_19 = from_html(`<button class="stake-value svelte-toncsw" type="button"> </button>`);
var root_20 = from_html(`<div class="stake-cell-content svelte-toncsw"><!> <div class="stake-popup svelte-toncsw"><div> </div> <div> </div></div></div>`);
var root_21 = from_html(`<div class="inactive-indicator svelte-toncsw">-</div>`);
var root_22 = from_html(`<span class="principal-change-tooltip svelte-toncsw"><span class="principal-change-icon svelte-toncsw">❗</span> <span class="principal-tooltip-text svelte-toncsw"> </span></span>`);
var root_23 = from_html(`<button class="action-indicator clickable-action svelte-toncsw" type="button"> <!></button>`);
var root_24 = from_html(`<div class="table-cell stake-cell svelte-toncsw"><div class="stake-popup-container svelte-toncsw"><!> <!></div></div>`);
var root_25 = from_html(`<div><div class="data-row svelte-toncsw"><div class="table-cell epoch-cell svelte-toncsw"> </div> <div class="table-cell end-date-cell svelte-toncsw"> </div> <!> <!> <!> <!> <!> <!> <!> <!> <!></div></div>`);
var root_26 = from_html(`<div class="table-container svelte-toncsw"><div class="virtual-table svelte-toncsw"><div class="table-header svelte-toncsw"><div class="header-row svelte-toncsw"><div class="header-cell epoch-header svelte-toncsw">Epoch</div> <div class="header-cell end-date-header svelte-toncsw">End Date</div> <div class="header-cell rewards-header svelte-toncsw">Staked</div> <div class="header-cell rewards-header svelte-toncsw">Rewards</div> <div class="header-cell rewards-header svelte-toncsw">Accumulated</div> <div class="header-cell rewards-header svelte-toncsw">Unstake Rewards</div> <div class="header-cell rewards-header svelte-toncsw">Unstake Total</div> <div class="header-cell rewards-header svelte-toncsw">Available Rewards</div> <!> <!> <!></div></div> <div class="table-body svelte-toncsw"><!></div></div></div>`);
var root_27 = from_html(`<!> <!> <!> <!> <div style="margin-bottom: 8px; text-align: left;">The data may be incomplete or incorrect, so it is advisable to check it against other sources. <br/> Values are estimates due to rounding. Epochs before the first transaction are hidden.</div> <div class="table-controls svelte-toncsw"><div class="controls-left svelte-toncsw"><label class="control-item svelte-toncsw">Currency: <select class="svelte-toncsw"><option>USD</option><option>EUR</option></select></label> <button class="control-item svelte-toncsw"> </button> <!> <!> <label class="toggle-row control-item svelte-toncsw"><div class="toggle-switch svelte-toncsw"><input type="checkbox" class="svelte-toncsw"/> <span class="slider svelte-toncsw"></span></div> <span class="toggle-label">Show Prices</span></label> <label class="toggle-row control-item svelte-toncsw"><div class="toggle-switch svelte-toncsw"><input type="checkbox" class="svelte-toncsw"/> <span class="slider svelte-toncsw"></span></div> <span class="toggle-label">Show Validators</span></label> <label class="toggle-row control-item svelte-toncsw"><div class="toggle-switch svelte-toncsw"><input type="checkbox" class="svelte-toncsw"/> <span class="slider svelte-toncsw"></span></div> <span class="toggle-label">Hide unstaked</span></label> <label class="control-item toggle-row svelte-toncsw"><div class="toggle-switch svelte-toncsw"><input type="checkbox" class="svelte-toncsw"/> <span class="slider svelte-toncsw"></span></div> <span>Compact view</span></label></div> <div class="controls-right svelte-toncsw"><button style="min-width: 120px;" class="svelte-toncsw">Export table...</button> <!></div></div> <!>`, 1);
function StakingRewardsTable($$anchor, $$props) {
	push($$props, true);
	function asNanos(amount) {
		return amount == null || amount === "" ? 0n : BigInt(amount);
	}
	function formatIota(amount, decimals = 2) {
		const bigAmount = asNanos(amount);
		const whole = bigAmount / NANOS_PER_IOTA;
		const decimal = (bigAmount % NANOS_PER_IOTA).toString().padStart(9, "0").slice(0, decimals);
		return `${whole.toLocaleString("en-US")}.${decimal} IOTA`;
	}
	function formatExactIota(amount) {
		const bigAmount = asNanos(amount);
		const whole = bigAmount / NANOS_PER_IOTA;
		const trimmedNano = (bigAmount % NANOS_PER_IOTA).toString().padStart(9, "0").replace(/0+$/, "");
		const wholeStr = whole.toLocaleString("en-US");
		return trimmedNano === "" ? `${wholeStr} IOTA` : `${wholeStr}.${trimmedNano} IOTA`;
	}
	function formatNano(amount) {
		return asNanos(amount).toLocaleString("en-US").replace(/,/g, "_") + " NANO";
	}
	let currentEpoch = prop($$props, "currentEpoch", 3, 0), stakeObjects = prop($$props, "stakeObjects", 19, () => []), validatorInfo = prop($$props, "validatorInfo", 19, () => ({})), showPriceColumns = prop($$props, "showPriceColumns", 15, true), showValidatorColumns = prop($$props, "showValidatorColumns", 15, true), hideUnstaked = prop($$props, "hideUnstaked", 15, false), showCompactView = prop($$props, "showCompactView", 15, true), noTransactionsFound = prop($$props, "noTransactionsFound", 3, false), timeFrameFilteredEpochs = prop($$props, "timeFrameFilteredEpochs", 3, void 0), exportFileName = prop($$props, "exportFileName", 3, ""), previousRewardsNotice = prop($$props, "previousRewardsNotice", 3, "");
	let windowWidth = state(0);
	onMount(() => {
		const updateWidth = () => {
			set(windowWidth, window.innerWidth, true);
		};
		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	});
	let tableData = user_derived(() => computeEpochData(stakeObjects(), validatorInfo(), currentEpoch()));
	let uniqueValidators = user_derived(() => get(tableData).uniqueValidators), epochData = user_derived(() => get(tableData).epochData), validatorPrincipal = user_derived(() => get(tableData).validatorPrincipal), epochs = user_derived(() => get(tableData).epochs);
	let baseEpochs = user_derived(() => timeFrameFilteredEpochs() ?? get(epochs));
	let filteredEpochs = user_derived(() => {
		if (!showCompactView()) return get(baseEpochs);
		const isTimeFrameFiltered = get(baseEpochs).length !== get(epochs).length;
		const firstEpoch = get(baseEpochs)[0];
		const lastEpoch = get(baseEpochs)[get(baseEpochs).length - 1];
		return get(baseEpochs).filter((epoch) => {
			if (epoch === currentEpoch() || epoch === currentEpoch() - 1) return true;
			if (isTimeFrameFiltered && (epoch === firstEpoch || epoch === lastEpoch)) return true;
			if (stakeObjects().some((stakeObject) => isPreActivationInEpoch(stakeObject, epoch, get(epochData)))) return true;
			return stakeObjects().some((stakeObject) => stakeObject.actionByEpoch && stakeObject.actionByEpoch[epoch] && stakeObject.actionByEpoch[epoch].length > 0);
		});
	});
	let filteredEpochEndDates = user_derived(() => {
		if (!showCompactView() && !timeFrameFilteredEpochs()) return get(epochEndDates);
		return get(filteredEpochs).map((epoch) => get(epochEndDates)[get(epochs).indexOf(epoch)]);
	});
	let height = user_derived(() => {
		const maxHeight = get(windowWidth) < 768 ? 600 : 800;
		const contentHeight = get(filteredEpochs).length * 50 + 60;
		return Math.min(contentHeight, maxHeight);
	});
	let headerElement = state(void 0);
	let listElement = state(null);
	let isScrolling = state(false);
	let virtualListContainer = state(null);
	function syncHeaderScroll(event) {
		if (get(isScrolling)) return;
		set(isScrolling, true);
		const scrollLeft = event.target.scrollLeft;
		if (get(virtualListContainer)) get(virtualListContainer).scrollLeft = scrollLeft;
		setTimeout(() => {
			set(isScrolling, false);
		}, 10);
	}
	function syncListScroll(event) {
		if (get(isScrolling)) return;
		set(isScrolling, true);
		const target = event.target;
		if (get(headerElement)) get(headerElement).scrollLeft = target.scrollLeft;
		setTimeout(() => {
			set(isScrolling, false);
		}, 10);
	}
	function handleGlobalScroll(event) {
		const target = event.target;
		if (target && target !== get(headerElement)) {
			if (target.scrollWidth > target.clientWidth && target.scrollLeft !== void 0) {
				set(virtualListContainer, target, true);
				syncListScroll(event);
			}
		}
	}
	function setupScrollSync(node) {
		const scrollHandler = (event) => {
			handleGlobalScroll(event);
		};
		node.addEventListener("scroll", scrollHandler, {
			passive: true,
			capture: true
		});
		return { destroy() {
			node.removeEventListener("scroll", scrollHandler, { capture: true });
		} };
	}
	let selectedStakeObject = state(null);
	let selectedValidator = state(null);
	let selectedAction = state(null);
	let epochEndDates = state(proxy([]));
	let isMainnet = user_derived(() => {
		try {
			return getSelectedNetworkConfig().name?.toLowerCase().includes("mainnet");
		} catch {
			return false;
		}
	});
	let epochTimestampsCache = user_derived(() => get(isMainnet) && Object.keys(mainnet_epoch_timestamps_cache_default).length > 0 ? { ...mainnet_epoch_timestamps_cache_default } : {});
	user_effect(() => {
		if (!get(epochs).length) set(epochEndDates, [], true);
		else fetchEpochTimestampsForDisplay(get(epochs), currentEpoch(), get(epochTimestampsCache)).then(({ epochEndDates: dates }) => {
			set(epochEndDates, dates, true);
		});
	});
	let selectedCurrency = state(proxy(get$1(sharedStakingCurrency)));
	let previousCurrency = state(proxy(get$1(sharedStakingCurrency)));
	user_effect(() => {
		sharedStakingCurrency.set(get(selectedCurrency));
	});
	function reloadPricesFromCache() {
		set(epochPrices, reloadFromCoinGeckoCache({
			epochs: get(epochs),
			epochEndDates: get(epochEndDates),
			selectedCurrency: get(selectedCurrency),
			loadedCache: get(loadedCache)
		}), true);
	}
	user_effect(() => {
		if (!get(isFetchingPrice) && get(selectedCurrency) !== get(previousCurrency)) {
			set(previousCurrency, get(selectedCurrency), true);
			reloadPricesFromCache();
		}
	});
	let isFetchingPrice = state(false);
	let priceError = state("");
	let epochPrices = state(proxy({}));
	let loadedCache = state(proxy(iota_prices_coingecko_default));
	let cumulativeUnstakeFiat = user_derived(() => Object.keys(get(epochPrices)).length > 0 ? computeCumulativeUnstakeFiat(get(filteredEpochs), get(epochData), get(epochPrices)) : {});
	let showExportDialog = state(false);
	let exporting = state(false);
	let exportProgress = state(null);
	function openExportDialog() {
		set(showExportDialog, true);
	}
	let exportError = state("");
	/**
	* Run a synchronous callback after yielding to the browser so the dialog
	* can repaint into its "Generating…" state before the work blocks the
	* thread. Without this yield, the disabled button + label change never
	* paints because the export starts on the same tick as the click.
	*/
	function nextPaint() {
		return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
	}
	async function handleExportConfirm(opts) {
		set(exportError, "");
		set(exporting, true);
		set(exportProgress, null);
		const options = {
			showPriceColumns: opts.includePrices,
			showValidatorColumns: opts.includeValidators,
			epochPrices: get(epochPrices),
			selectedCurrency: get(selectedCurrency),
			fileName: opts.fileName || exportFileName(),
			wrapStakeObjects: opts.wrapStakeObjects,
			wrapValidators: opts.wrapValidators,
			...previousRewardsNotice() && { previousRewardsNotice: previousRewardsNotice() }
		};
		const onProgress = (p) => {
			set(exportProgress, p, true);
		};
		const exporter = opts.format === "pdf" ? exportTableToPDF : exportTableToCSV;
		try {
			await nextPaint();
			await exporter(get(filteredEpochs), get(filteredEpochEndDates), currentEpoch(), stakeObjects(), get(uniqueValidators), get(epochData), options, onProgress);
		} catch (err) {
			console.error("Export failed:", err);
			set(exportError, err instanceof Error ? err.message : opts.format === "pdf" ? "Failed to export PDF" : "Failed to export", true);
		} finally {
			set(exporting, false);
			set(exportProgress, null);
		}
	}
	async function fetchAllPrices$1() {
		showPriceColumns(true);
		set(isFetchingPrice, true);
		set(priceError, "");
		set(epochPrices, {}, true);
		const { epochPrices: prices, updatedCache, error } = await fetchAllPrices({
			epochs: get(epochs),
			epochEndDates: get(epochEndDates),
			currentEpoch: currentEpoch(),
			selectedCurrency: get(selectedCurrency),
			loadedCache: get(loadedCache)
		});
		if (updatedCache) {
			set(loadedCache, updatedCache, true);
			console.log("Copy this to iota-prices-coingecko.json:");
			console.log(JSON.stringify(updatedCache, null, 2));
		}
		if (error) set(priceError, error, true);
		set(epochPrices, prices, true);
		set(isFetchingPrice, false);
		if ($$props.onPricesFetched) $$props.onPricesFetched(prices);
	}
	var fragment = root_27();
	var node_1 = first_child(fragment);
	var consequent_1 = ($$anchor) => {
		var div = root_2$1();
		var button = child(div);
		var div_1 = sibling(button, 2);
		var text = child(div_1, true);
		reset(div_1);
		var div_2 = sibling(div_1, 2);
		var text_1 = child(div_2, true);
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var text_2 = child(div_3);
		reset(div_3);
		var div_4 = sibling(div_3, 2);
		var text_3 = child(div_4);
		reset(div_4);
		var div_5 = sibling(div_4, 2);
		var text_4 = child(div_5);
		reset(div_5);
		var node_2 = sibling(div_5, 2);
		var consequent = ($$anchor) => {
			var div_6 = root_1$1();
			var div_7 = sibling(child(div_6), 2);
			each(div_7, 21, () => Object.entries(get(selectedStakeObject).actionByEpoch).sort(([a], [b]) => Number(a) - Number(b)), index, ($$anchor, $$item) => {
				var $$array = user_derived(() => to_array(get($$item), 2));
				let epoch = () => get($$array)[0];
				let actions = () => get($$array)[1];
				var div_8 = root$1();
				var div_9 = child(div_8);
				var text_5 = child(div_9);
				reset(div_9);
				var div_10 = sibling(div_9, 2);
				var text_6 = child(div_10, true);
				reset(div_10);
				reset(div_8);
				template_effect(($0) => {
					set_text(text_5, `Epoch ${epoch() ?? ""}`);
					set_text(text_6, $0);
				}, [() => formatMultipleActionDetails(actions())]);
				append($$anchor, div_8);
			});
			reset(div_7);
			reset(div_6);
			append($$anchor, div_6);
		};
		var d = user_derived(() => get(selectedStakeObject).actionByEpoch && Object.keys(get(selectedStakeObject).actionByEpoch).length > 0);
		if_block(node_2, ($$render) => {
			if (get(d)) $$render(consequent);
		});
		reset(div);
		template_effect(($0) => {
			set_text(text, get(selectedStakeObject).objectId);
			set_text(text_1, $0);
			set_text(text_2, `Pool: ${get(selectedStakeObject).poolId ?? ""}`);
			set_text(text_3, `First Epoch: ${get(selectedStakeObject).firstEpoch ?? ""}`);
			set_text(text_4, `Last Epoch: ${get(selectedStakeObject).lastEpoch ?? ""}`);
		}, [() => formatPrincipal(getFirstPrincipal(get(selectedStakeObject)))]);
		delegated("click", button, () => set(selectedStakeObject, null));
		append($$anchor, div);
	};
	if_block(node_1, ($$render) => {
		if (get(selectedStakeObject)) $$render(consequent_1);
	});
	var node_3 = sibling(node_1, 2);
	var consequent_2 = ($$anchor) => {
		var div_11 = root_3$1();
		var button_1 = child(div_11);
		var div_12 = sibling(button_1, 2);
		var text_7 = child(div_12, true);
		reset(div_12);
		var div_13 = sibling(div_12, 2);
		var text_8 = child(div_13);
		var button_2 = sibling(text_8);
		reset(div_13);
		var div_14 = sibling(div_13, 2);
		var div_15 = child(div_14);
		var text_9 = child(div_15);
		reset(div_15);
		var div_16 = sibling(div_15, 2);
		var text_10 = child(div_16);
		reset(div_16);
		reset(div_14);
		reset(div_11);
		template_effect(($0, $1) => {
			set_text(text_7, get(selectedValidator).name);
			set_text(text_8, `Pool ID: ${get(selectedValidator).poolId ?? ""} `);
			set_text(text_9, `Total stake objects: ${$0 ?? ""}`);
			set_text(text_10, `Total principal staked: ${$1 ?? ""}`);
		}, [() => stakeObjects().filter((obj) => obj.poolId === get(selectedValidator)?.poolId).length, () => get(selectedValidator) ? getValidatorTotalPrincipal(get(selectedValidator).poolId, get(validatorPrincipal)) : "0"]);
		delegated("click", button_1, () => set(selectedValidator, null));
		delegated("click", button_2, async (e) => {
			e.stopPropagation();
			if (get(selectedValidator)?.poolId) await copyToClipboard(get(selectedValidator).poolId);
		});
		append($$anchor, div_11);
	};
	if_block(node_3, ($$render) => {
		if (get(selectedValidator)) $$render(consequent_2);
	});
	var node_4 = sibling(node_3, 2);
	var consequent_3 = ($$anchor) => {
		var div_17 = root_4$1();
		var button_3 = child(div_17);
		var div_18 = sibling(button_3, 2);
		var text_11 = child(div_18);
		reset(div_18);
		var div_19 = sibling(div_18, 2);
		var text_12 = child(div_19);
		reset(div_19);
		var div_20 = sibling(div_19, 2);
		var text_13 = child(div_20, true);
		reset(div_20);
		reset(div_17);
		template_effect(($0, $1) => {
			set_text(text_11, `Epoch ${get(selectedAction).epoch ?? ""} - ${$0 ?? ""}`);
			set_text(text_12, `Stake Object: ${get(selectedAction).stakeObjectId ?? ""}`);
			set_text(text_13, $1);
		}, [() => getActionNames(get(selectedAction).actions), () => formatMultipleActionDetails(get(selectedAction).actions)]);
		delegated("click", button_3, () => set(selectedAction, null));
		append($$anchor, div_17);
	};
	if_block(node_4, ($$render) => {
		if (get(selectedAction)) $$render(consequent_3);
	});
	var node_5 = sibling(node_4, 2);
	{
		let $0 = user_derived(() => Object.keys(get(epochPrices)).length > 0);
		let $1 = user_derived(() => get(uniqueValidators).length > 0);
		let $2 = user_derived(() => stakeObjects().length > 0);
		ExportDialog(node_5, {
			get open() {
				return get(showExportDialog);
			},
			get defaultFileName() {
				return exportFileName();
			},
			get pricesAvailable() {
				return get($0);
			},
			get validatorsAvailable() {
				return get($1);
			},
			get stakeObjectsAvailable() {
				return get($2);
			},
			get exporting() {
				return get(exporting);
			},
			get exportProgress() {
				return get(exportProgress);
			},
			buildPreview: (opts, previewRowLimit) => buildExportSections({
				epochs: get(filteredEpochs),
				epochEndDates: get(filteredEpochEndDates),
				currentEpoch: currentEpoch(),
				stakeObjects: stakeObjects(),
				uniqueValidators: get(uniqueValidators),
				epochData: get(epochData),
				options: {
					showPriceColumns: opts.includePrices,
					showValidatorColumns: opts.includeValidators,
					epochPrices: get(epochPrices),
					selectedCurrency: get(selectedCurrency),
					wrapStakeObjects: opts.wrapStakeObjects,
					wrapValidators: opts.wrapValidators,
					...previousRewardsNotice() && { previousRewardsNotice: previousRewardsNotice() }
				},
				previewRowLimit
			}),
			onCancel: () => !get(exporting) && set(showExportDialog, false),
			onExport: handleExportConfirm
		});
	}
	var div_21 = sibling(node_5, 4);
	var div_22 = child(div_21);
	var label = child(div_22);
	var select = sibling(child(label));
	var option = child(select);
	option.value = option.__value = "usd";
	var option_1 = sibling(option);
	option_1.value = option_1.__value = "eur";
	reset(select);
	reset(label);
	var button_4 = sibling(label, 2);
	var text_14 = child(button_4, true);
	reset(button_4);
	var node_6 = sibling(button_4, 2);
	var consequent_4 = ($$anchor) => {
		var span = root_5$1();
		var text_15 = child(span, true);
		reset(span);
		template_effect(() => set_text(text_15, get(priceError)));
		append($$anchor, span);
	};
	if_block(node_6, ($$render) => {
		if (get(priceError)) $$render(consequent_4);
	});
	var node_7 = sibling(node_6, 2);
	var consequent_5 = ($$anchor) => {
		var span_1 = root_6$1();
		var text_16 = child(span_1);
		reset(span_1);
		template_effect(($0) => set_text(text_16, `Prices loaded for ${$0 ?? ""} epochs`), [() => Object.keys(get(epochPrices)).length]);
		append($$anchor, span_1);
	};
	var d_1 = user_derived(() => Object.keys(get(epochPrices)).length > 0);
	if_block(node_7, ($$render) => {
		if (get(d_1)) $$render(consequent_5);
	});
	var label_1 = sibling(node_7, 2);
	var div_23 = child(label_1);
	var input = child(div_23);
	remove_input_defaults(input);
	next(2);
	reset(div_23);
	next(2);
	reset(label_1);
	var label_2 = sibling(label_1, 2);
	var div_24 = child(label_2);
	var input_1 = child(div_24);
	remove_input_defaults(input_1);
	next(2);
	reset(div_24);
	next(2);
	reset(label_2);
	var label_3 = sibling(label_2, 2);
	var div_25 = child(label_3);
	var input_2 = child(div_25);
	remove_input_defaults(input_2);
	next(2);
	reset(div_25);
	next(2);
	reset(label_3);
	var label_4 = sibling(label_3, 2);
	var div_26 = child(label_4);
	var input_3 = child(div_26);
	remove_input_defaults(input_3);
	next(2);
	reset(div_26);
	next(2);
	reset(label_4);
	reset(div_22);
	var div_27 = sibling(div_22, 2);
	var button_5 = child(div_27);
	var node_8 = sibling(button_5, 2);
	var consequent_6 = ($$anchor) => {
		var div_28 = root_7$1();
		var text_17 = child(div_28);
		var button_6 = sibling(text_17);
		reset(div_28);
		template_effect(() => set_text(text_17, `Export failed: ${get(exportError) ?? ""} `));
		delegated("click", button_6, () => set(exportError, ""));
		append($$anchor, div_28);
	};
	if_block(node_8, ($$render) => {
		if (get(exportError)) $$render(consequent_6);
	});
	reset(div_27);
	reset(div_21);
	var node_9 = sibling(div_21, 2);
	var consequent_7 = ($$anchor) => {
		append($$anchor, root_8$1());
	};
	var alternate_3 = ($$anchor) => {
		var div_30 = root_26();
		var div_31 = child(div_30);
		var div_32 = child(div_31);
		var div_33 = child(div_32);
		var node_10 = sibling(child(div_33), 16);
		var consequent_8 = ($$anchor) => {
			var fragment_1 = root_9$1();
			var div_34 = first_child(fragment_1);
			var text_18 = child(div_34);
			reset(div_34);
			var div_35 = sibling(div_34, 2);
			var text_19 = child(div_35);
			reset(div_35);
			var div_36 = sibling(div_35, 2);
			var text_20 = child(div_36);
			reset(div_36);
			var div_37 = sibling(div_36, 2);
			var text_21 = child(div_37);
			reset(div_37);
			template_effect(($0, $1, $2, $3) => {
				set_text(text_18, `Price (${$0 ?? ""})`);
				set_text(text_19, `Rewards in ${$1 ?? ""}`);
				set_text(text_20, `Accumulated in ${$2 ?? ""}`);
				set_text(text_21, `Total Earned (${$3 ?? ""})`);
			}, [
				() => get(selectedCurrency).toUpperCase(),
				() => get(selectedCurrency).toUpperCase(),
				() => get(selectedCurrency).toUpperCase(),
				() => get(selectedCurrency).toUpperCase()
			]);
			append($$anchor, fragment_1);
		};
		var d_2 = user_derived(() => showPriceColumns() && Object.keys(get(epochPrices)).length > 0);
		if_block(node_10, ($$render) => {
			if (get(d_2)) $$render(consequent_8);
		});
		var node_11 = sibling(node_10, 2);
		var consequent_9 = ($$anchor) => {
			var fragment_2 = comment();
			each(first_child(fragment_2), 17, () => get(uniqueValidators), index, ($$anchor, validator) => {
				var div_38 = root_10$1();
				var div_39 = child(div_38);
				var div_40 = child(div_39);
				var text_22 = child(div_40, true);
				reset(div_40);
				reset(div_39);
				reset(div_38);
				template_effect(() => set_text(text_22, get(validator).name));
				delegated("click", div_40, () => {
					set(selectedValidator, get(selectedValidator)?.poolId === get(validator).poolId ? null : get(validator), true);
				});
				delegated("keydown", div_40, (e) => {
					if (e.key === "Enter" || e.key === " ") set(selectedValidator, get(selectedValidator)?.poolId === get(validator).poolId ? null : get(validator), true);
				});
				append($$anchor, div_38);
			});
			append($$anchor, fragment_2);
		};
		if_block(node_11, ($$render) => {
			if (showValidatorColumns()) $$render(consequent_9);
		});
		each(sibling(node_11, 2), 17, () => stakeObjects().filter((obj) => !hideUnstaked() || obj.lastEpoch >= currentEpoch()), index, ($$anchor, stakeObject) => {
			var div_41 = root_11$1();
			var div_42 = child(div_41);
			var div_43 = child(div_42);
			var span_2 = child(div_43);
			var text_23 = child(span_2);
			var button_7 = sibling(text_23);
			reset(span_2);
			reset(div_43);
			reset(div_42);
			reset(div_41);
			template_effect(($0, $1) => set_text(text_23, `${$0 ?? ""}..${$1 ?? ""} `), [() => get(stakeObject).objectId.slice(0, 6), () => get(stakeObject).objectId.slice(-3)]);
			delegated("click", span_2, () => {
				set(selectedStakeObject, get(stakeObject), true);
			});
			delegated("keydown", span_2, (e) => {
				if (e.key === "Enter" || e.key === " ") set(selectedStakeObject, get(stakeObject), true);
			});
			delegated("click", button_7, async (e) => {
				e.stopPropagation();
				await copyToClipboard(get(stakeObject).objectId);
			});
			append($$anchor, div_41);
		});
		reset(div_33);
		reset(div_32);
		bind_this(div_32, ($$value) => set(headerElement, $$value), () => get(headerElement));
		var div_44 = sibling(div_32, 2);
		var node_14 = child(div_44);
		{
			const item = ($$anchor, $$arg0) => {
				let index$1 = () => ($$arg0?.()).index;
				let style = () => ($$arg0?.()).style;
				const amountCell = ($$anchor, amount = noop, displayValue = noop) => {
					var div_45 = root_14$1();
					var div_46 = child(div_45);
					var node_15 = child(div_46);
					var consequent_10 = ($$anchor) => {
						append($$anchor, root_12$1());
					};
					var alternate = ($$anchor) => {
						var fragment_3 = root_13$1();
						var button_8 = first_child(fragment_3);
						var text_24 = child(button_8, true);
						reset(button_8);
						var div_47 = sibling(button_8, 2);
						var div_48 = child(div_47);
						var text_25 = child(div_48, true);
						reset(div_48);
						var div_49 = sibling(div_48, 2);
						var text_26 = child(div_49, true);
						reset(div_49);
						reset(div_47);
						template_effect(($0, $1, $2, $3) => {
							set_attribute(button_8, "title", $0);
							set_text(text_24, $1);
							set_text(text_25, $2);
							set_text(text_26, $3);
						}, [
							() => formatExactIota(amount()),
							() => displayValue() ?? (amount() === 0n ? "0" : formatIota(amount(), 2)),
							() => formatExactIota(amount()),
							() => formatNano(amount())
						]);
						delegated("click", button_8, () => copyToClipboard(formatExactIota(amount())));
						delegated("keydown", button_8, (e) => e.key === "Enter" && copyToClipboard(formatExactIota(amount())));
						append($$anchor, fragment_3);
					};
					if_block(node_15, ($$render) => {
						if (get(filteredEpochs)[index$1()] === currentEpoch()) $$render(consequent_10);
						else $$render(alternate, -1);
					});
					reset(div_46);
					reset(div_45);
					append($$anchor, div_45);
				};
				var div_50 = root_25();
				let classes;
				var div_51 = child(div_50);
				var div_52 = child(div_51);
				var text_27 = child(div_52, true);
				reset(div_52);
				var div_53 = sibling(div_52, 2);
				var text_28 = child(div_53, true);
				reset(div_53);
				var node_16 = sibling(div_53, 2);
				amountCell(node_16, () => get(epochData)[get(filteredEpochs)[index$1()]]?.totalStaked ?? 0n);
				var node_17 = sibling(node_16, 2);
				amountCell(node_17, () => get(epochData)[get(filteredEpochs)[index$1()]]?.totalRewards ?? 0n, () => get(epochData)[get(filteredEpochs)[index$1()]]?.display.rewardsDisplay ?? "0");
				var node_18 = sibling(node_17, 2);
				amountCell(node_18, () => get(epochData)[get(filteredEpochs)[index$1()]]?.totalAccumulated ?? 0n, () => get(epochData)[get(filteredEpochs)[index$1()]]?.display.accumulatedDisplay ?? "0");
				var node_19 = sibling(node_18, 2);
				amountCell(node_19, () => get(epochData)[get(filteredEpochs)[index$1()]]?.totalUnstakeRewards ?? 0n, () => get(epochData)[get(filteredEpochs)[index$1()]]?.display.unstakeRewardsDisplay ?? "0");
				var node_20 = sibling(node_19, 2);
				amountCell(node_20, () => get(epochData)[get(filteredEpochs)[index$1()]]?.totalUnstakeAccumulated ?? 0n, () => get(epochData)[get(filteredEpochs)[index$1()]]?.display.unstakeAccumulatedDisplay ?? "0");
				var node_21 = sibling(node_20, 2);
				amountCell(node_21, () => get(epochData)[get(filteredEpochs)[index$1()]]?.availableRewards ?? 0n, () => get(epochData)[get(filteredEpochs)[index$1()]]?.display.availableRewardsDisplay ?? "0");
				var node_22 = sibling(node_21, 2);
				var consequent_12 = ($$anchor) => {
					var fragment_4 = comment();
					var node_23 = first_child(fragment_4);
					var consequent_11 = ($$anchor) => {
						const earned = user_derived(() => get(filteredEpochs)[index$1()] === currentEpoch() ? null : computeEarnedValueForEpoch(get(filteredEpochs)[index$1()], get(epochData), get(cumulativeUnstakeFiat), get(epochPrices)));
						var fragment_5 = root_15$1();
						var div_54 = first_child(fragment_5);
						var text_29 = child(div_54, true);
						reset(div_54);
						var div_55 = sibling(div_54, 2);
						var text_30 = child(div_55, true);
						reset(div_55);
						var div_56 = sibling(div_55, 2);
						var text_31 = child(div_56, true);
						reset(div_56);
						var div_57 = sibling(div_56, 2);
						var text_32 = child(div_57, true);
						reset(div_57);
						template_effect(($0, $1, $2, $3) => {
							set_text(text_29, $0);
							set_text(text_30, $1);
							set_text(text_31, $2);
							set_text(text_32, $3);
						}, [
							() => get(filteredEpochs)[index$1()] === currentEpoch() ? "pending" : get(epochPrices)[get(filteredEpochs)[index$1()]] ? get(epochPrices)[get(filteredEpochs)[index$1()]].toFixed(6) : "no price",
							() => get(filteredEpochs)[index$1()] === currentEpoch() ? "pending" : get(epochPrices)[get(filteredEpochs)[index$1()]] ? `${(nanoToIota(get(epochData)[get(filteredEpochs)[index$1()]]?.totalRewards ?? 0n) * get(epochPrices)[get(filteredEpochs)[index$1()]]).toFixed(2)} ${get(selectedCurrency).toUpperCase()}` : "no price",
							() => get(filteredEpochs)[index$1()] === currentEpoch() ? "pending" : get(epochPrices)[get(filteredEpochs)[index$1()]] ? `${(nanoToIota(get(epochData)[get(filteredEpochs)[index$1()]]?.totalAccumulated ?? 0n) * get(epochPrices)[get(filteredEpochs)[index$1()]]).toFixed(2)} ${get(selectedCurrency).toUpperCase()}` : "no price",
							() => get(filteredEpochs)[index$1()] === currentEpoch() ? "pending" : get(earned) !== null ? `${get(earned).toFixed(2)} ${get(selectedCurrency).toUpperCase()}` : "no price"
						]);
						append($$anchor, fragment_5);
					};
					var d_3 = user_derived(() => showPriceColumns() && Object.keys(get(epochPrices)).length > 0);
					if_block(node_23, ($$render) => {
						if (get(d_3)) $$render(consequent_11);
					});
					append($$anchor, fragment_4);
				};
				var d_4 = user_derived(() => Object.keys(get(epochPrices)).length > 0);
				if_block(node_22, ($$render) => {
					if (get(d_4)) $$render(consequent_12);
				});
				var node_24 = sibling(node_22, 2);
				var consequent_14 = ($$anchor) => {
					var fragment_6 = comment();
					each(first_child(fragment_6), 17, () => get(uniqueValidators), index, ($$anchor, validator) => {
						var div_58 = root_17$1();
						var div_59 = child(div_58);
						var node_26 = child(div_59);
						var consequent_13 = ($$anchor) => {
							append($$anchor, text("pending"));
						};
						var alternate_1 = ($$anchor) => {
							var fragment_7 = root_16$1();
							var button_9 = first_child(fragment_7);
							var text_34 = child(button_9, true);
							reset(button_9);
							var div_60 = sibling(button_9, 2);
							var div_61 = child(div_60);
							var text_35 = child(div_61);
							reset(div_61);
							var div_62 = sibling(div_61, 2);
							var text_36 = child(div_62);
							reset(div_62);
							var div_63 = sibling(div_62, 2);
							var text_37 = child(div_63);
							reset(div_63);
							var div_64 = sibling(div_63, 2);
							var text_38 = child(div_64, true);
							reset(div_64);
							var div_65 = sibling(div_64, 2);
							var text_39 = child(div_65);
							reset(div_65);
							var div_66 = sibling(div_65, 2);
							var text_40 = child(div_66, true);
							reset(div_66);
							reset(div_60);
							template_effect(($0, $1, $2, $3, $4, $5) => {
								set_attribute(button_9, "title", $0);
								set_text(text_34, $1);
								set_text(text_35, `Validator: ${get(validator).name ?? ""}`);
								set_text(text_36, `Pool ID: ${get(validator).poolId ?? ""}`);
								set_text(text_37, `Rewards this epoch: ${$2 ?? ""}`);
								set_text(text_38, $3);
								set_text(text_39, `Accumulated rewards: ${$4 ?? ""}`);
								set_text(text_40, $5);
							}, [
								() => formatExactIota(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorRewards[get(validator).poolId] ?? 0n),
								() => getValidatorRewardsForEpoch(get(validator).poolId, get(filteredEpochs)[index$1()], get(epochData)),
								() => formatExactIota(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorRewards[get(validator).poolId] ?? 0n),
								() => formatNano(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorRewards[get(validator).poolId] ?? 0n),
								() => formatExactIota(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorAccumulated[get(validator).poolId] ?? 0n),
								() => formatNano(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorAccumulated[get(validator).poolId] ?? 0n)
							]);
							delegated("click", button_9, () => copyToClipboard(formatExactIota(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorRewards[get(validator).poolId] ?? 0n)));
							delegated("keydown", button_9, (e) => e.key === "Enter" && copyToClipboard(formatExactIota(get(epochData)[get(filteredEpochs)[index$1()]]?.validatorRewards[get(validator).poolId] ?? 0n)));
							append($$anchor, fragment_7);
						};
						if_block(node_26, ($$render) => {
							if (get(filteredEpochs)[index$1()] === currentEpoch()) $$render(consequent_13);
							else $$render(alternate_1, -1);
						});
						reset(div_59);
						reset(div_58);
						append($$anchor, div_58);
					});
					append($$anchor, fragment_6);
				};
				if_block(node_24, ($$render) => {
					if (showValidatorColumns()) $$render(consequent_14);
				});
				each(sibling(node_24, 2), 17, () => stakeObjects().filter((obj) => !hideUnstaked() || obj.lastEpoch >= currentEpoch()), index, ($$anchor, stakeObject) => {
					var div_67 = root_24();
					var div_68 = child(div_67);
					var node_28 = child(div_68);
					var consequent_16 = ($$anchor) => {
						var div_69 = root_20();
						var node_29 = child(div_69);
						var consequent_15 = ($$anchor) => {
							append($$anchor, root_18$1());
						};
						var alternate_2 = ($$anchor) => {
							var button_10 = root_19();
							var text_41 = child(button_10, true);
							reset(button_10);
							template_effect(($0, $1) => {
								set_attribute(button_10, "title", $0);
								set_text(text_41, $1);
							}, [() => formatExactIota(BigInt(get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]])), () => formatIota(get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]], 2)]);
							delegated("click", button_10, () => copyToClipboard(formatExactIota(BigInt(get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]]))));
							delegated("keydown", button_10, (e) => e.key === "Enter" && copyToClipboard(formatExactIota(BigInt(get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]]))));
							append($$anchor, button_10);
						};
						if_block(node_29, ($$render) => {
							if (!get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]] || get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]] === "0") $$render(consequent_15);
							else $$render(alternate_2, -1);
						});
						var div_70 = sibling(node_29, 2);
						var div_71 = child(div_70);
						var text_42 = child(div_71);
						reset(div_71);
						var div_72 = sibling(div_71, 2);
						var text_43 = child(div_72);
						reset(div_72);
						reset(div_70);
						reset(div_69);
						template_effect(($0, $1) => {
							set_text(text_42, `Rewards this epoch: ${$0 ?? ""}`);
							set_text(text_43, `Accumulated rewards: ${$1 ?? ""}`);
						}, [() => formatIota(get(stakeObject).rewardsByEpoch[get(filteredEpochs)[index$1()]], 9), () => formatIota(get(stakeObject).accumulatedRewards[get(filteredEpochs)[index$1()]], 9)]);
						append($$anchor, div_69);
					};
					var d_5 = user_derived(() => isActiveInEpoch(get(stakeObject), get(filteredEpochs)[index$1()], get(epochData)) && get(filteredEpochs)[index$1()] >= get(stakeObject).firstEpoch && get(filteredEpochs)[index$1()] !== currentEpoch());
					var consequent_17 = ($$anchor) => {
						append($$anchor, text("pending"));
					};
					var d_6 = user_derived(() => isActiveInEpoch(get(stakeObject), get(filteredEpochs)[index$1()] - 1, get(epochData)) && get(filteredEpochs)[index$1()] === currentEpoch() && (!get(stakeObject).actionByEpoch || !get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]] || get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]].length === 0));
					var consequent_18 = ($$anchor) => {
						append($$anchor, root_21());
					};
					if_block(node_28, ($$render) => {
						if (get(d_5)) $$render(consequent_16);
						else if (get(d_6)) $$render(consequent_17, 1);
						else if (!get(stakeObject).actionByEpoch || !get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]] || get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]].length === 0) $$render(consequent_18, 2);
					});
					var node_30 = sibling(node_28, 2);
					var consequent_20 = ($$anchor) => {
						var button_11 = root_23();
						var text_45 = child(button_11);
						var node_31 = sibling(text_45);
						var consequent_19 = ($$anchor) => {
							var span_5 = root_22();
							var span_6 = sibling(child(span_5), 2);
							var text_46 = child(span_6);
							reset(span_6);
							reset(span_5);
							template_effect(($0, $1) => set_text(text_46, `Principal amount changed from
                                                                ${$0 ?? ""} to
                                                                ${$1 ?? ""}`), [() => formatIota(get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()] - 1], 2), () => formatIota(get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()]], 2)]);
							append($$anchor, span_5);
						};
						if_block(node_31, ($$render) => {
							if (get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()]] && get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()] - 1] && get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()]] !== get(stakeObject).principalByEpoch[get(filteredEpochs)[index$1()] - 1]) $$render(consequent_19);
						});
						reset(button_11);
						template_effect(($0) => set_text(text_45, `${$0 ?? ""} `), [() => getActionNames(get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]])]);
						delegated("click", button_11, () => {
							const actionsData = get(stakeObject).actionByEpoch?.[get(filteredEpochs)[index$1()]];
							if (actionsData && actionsData.length > 0) set(selectedAction, {
								actions: actionsData,
								epoch: get(filteredEpochs)[index$1()],
								stakeObjectId: get(stakeObject).objectId
							}, true);
						});
						append($$anchor, button_11);
					};
					if_block(node_30, ($$render) => {
						if (get(stakeObject).actionByEpoch && get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]] && get(stakeObject).actionByEpoch[get(filteredEpochs)[index$1()]].length > 0) $$render(consequent_20);
					});
					reset(div_68);
					reset(div_67);
					append($$anchor, div_67);
				});
				reset(div_51);
				reset(div_50);
				template_effect(() => {
					set_style(div_50, style());
					classes = set_class(div_50, 1, "table-row svelte-toncsw", null, classes, { "highlight-recent": index$1() === get(filteredEpochs).length - 2 });
					set_text(text_27, get(filteredEpochs)[index$1()]);
					set_text(text_28, get(filteredEpochEndDates)[index$1()] || "-");
				});
				append($$anchor, div_50);
			};
			bind_this(List(node_14, {
				get itemCount() {
					return get(filteredEpochs).length;
				},
				itemSize: 50,
				get height() {
					return get(height);
				},
				item,
				$$slots: { item: true }
			}), ($$value) => set(listElement, $$value, true), () => get(listElement));
		}
		reset(div_44);
		action(div_44, ($$node) => setupScrollSync?.($$node));
		reset(div_31);
		reset(div_30);
		template_effect(() => set_style(div_31, `height: ${get(height) + 80}px`));
		event("scroll", div_32, syncHeaderScroll);
		append($$anchor, div_30);
	};
	if_block(node_9, ($$render) => {
		if (noTransactionsFound()) $$render(consequent_7);
		else $$render(alternate_3, -1);
	});
	template_effect(() => {
		button_4.disabled = get(isFetchingPrice) || noTransactionsFound();
		set_text(text_14, get(isFetchingPrice) ? "Fetching... (rate limited)" : "Fetch prices from coingecko");
		button_5.disabled = get(epochs).length === 0 || noTransactionsFound();
	});
	bind_select_value(select, () => get(selectedCurrency), ($$value) => set(selectedCurrency, $$value));
	delegated("click", button_4, fetchAllPrices$1);
	bind_checked(input, showPriceColumns);
	bind_checked(input_1, showValidatorColumns);
	bind_checked(input_2, hideUnstaked);
	bind_checked(input_3, showCompactView);
	delegated("click", button_5, openExportDialog);
	append($$anchor, fragment);
	pop();
}
delegate(["click", "keydown"]);
//#endregion
//#region src/lib/pages/staking-rewards/timeframe.ts
var TIME_FRAME_LABELS = {
	all: "All time",
	"last-3-days": "Last 3 days",
	"last-7-days": "Last 7 days",
	"last-month": "Last month",
	"last-quarter": "Last quarter",
	ytd: "Year to date",
	custom: "Custom dates",
	"custom-epochs": "Custom epochs"
};
/**
* Compute the date range for a given time frame preset.
* "Last 7 days" = rolling 7-day window ending at the reference instant
*                 (start is midnight local time 7 days ago).
* "Last month" = previous calendar month.
* "Last quarter" = previous calendar quarter (Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec).
* "YTD" = January 1 of current year through today.
*/
function getTimeFrameDateRange(timeFrame, referenceDate) {
	if (timeFrame === "all" || timeFrame === "custom") return null;
	const now = referenceDate ?? /* @__PURE__ */ new Date();
	switch (timeFrame) {
		case "last-3-days": return {
			start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
			end: now
		};
		case "last-7-days": return {
			start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
			end: now
		};
		case "last-month": return {
			start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
			end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
		};
		case "last-quarter": {
			const currentQuarter = Math.floor(now.getMonth() / 3);
			const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
			const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
			return {
				start: new Date(year, prevQuarter * 3, 1),
				end: new Date(year, prevQuarter * 3 + 3, 0, 23, 59, 59, 999)
			};
		}
		case "ytd": return {
			start: new Date(now.getFullYear(), 0, 1),
			end: now
		};
		default: return null;
	}
}
/**
* Filter an array of epoch numbers by a time frame using epoch timestamps.
* Returns only epochs whose end timestamp falls within the computed date range.
* For 'custom-epochs', filters by direct epoch number bounds instead.
*/
function filterEpochsByTimeFrame(epochs, epochTimestamps, timeFrame, customRange, referenceDate, customEpochRange) {
	if (timeFrame === "all") return epochs;
	if (timeFrame === "custom-epochs") {
		if (!customEpochRange) return epochs;
		return epochs.filter((epoch) => epoch >= customEpochRange.start && epoch <= customEpochRange.end);
	}
	const range = timeFrame === "custom" ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
	if (!range) return epochs;
	const startTs = Math.floor(range.start.getTime() / 1e3);
	const endTs = Math.floor(range.end.getTime() / 1e3);
	return epochs.filter((epoch) => {
		const ts = epochTimestamps[epoch];
		if (!ts) return false;
		return ts >= startTs && ts <= endTs;
	});
}
/**
* Compute the start epoch for a time frame using the epoch timestamps cache.
* Returns the latest epoch whose timestamp is <= the time frame's start date,
* or undefined if the time frame is 'all' or no matching epoch exists.
* For 'custom-epochs', returns the explicitly-selected start epoch.
*/
function getStartEpochForTimeFrame(epochTimestamps, timeFrame, customRange, referenceDate, customEpochRange) {
	if (timeFrame === "all") return void 0;
	if (timeFrame === "custom-epochs") return customEpochRange?.start;
	const range = timeFrame === "custom" ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
	if (!range) return void 0;
	const startTs = Math.floor(range.start.getTime() / 1e3);
	let best;
	for (const [epochStr, ts] of Object.entries(epochTimestamps)) if (ts <= startTs) {
		const epoch = parseInt(epochStr);
		if (best === void 0 || epoch > best) best = epoch;
	}
	return best;
}
/**
* Map a date range to the inclusive epoch range whose timestamps fall in it.
* Returns null if no epoch in the cache falls inside the range.
*/
function getEpochRangeForDateRange(epochTimestamps, range) {
	const startTs = Math.floor(range.start.getTime() / 1e3);
	const endTs = Math.floor(range.end.getTime() / 1e3);
	let startEpoch;
	let endEpoch;
	for (const [epochStr, ts] of Object.entries(epochTimestamps)) {
		if (ts < startTs || ts > endTs) continue;
		const epoch = parseInt(epochStr);
		if (startEpoch === void 0 || epoch < startEpoch) startEpoch = epoch;
		if (endEpoch === void 0 || epoch > endEpoch) endEpoch = epoch;
	}
	if (startEpoch === void 0 || endEpoch === void 0) return null;
	return {
		start: startEpoch,
		end: endEpoch
	};
}
/**
* Map an epoch range to the date range spanned by their cached timestamps.
* Falls back to the nearest available cached epoch on either side (the smallest
* epoch >= start and the largest epoch <= end) so the mapping still resolves
* when the cache lags behind the live current epoch or the start predates the
* first cached epoch. Returns null only when the cache has no overlap at all.
*/
function getDateRangeForEpochRange(epochTimestamps, epochRange) {
	let startTs;
	let endTs;
	let bestStartEpoch;
	let bestEndEpoch;
	for (const [epochStr, ts] of Object.entries(epochTimestamps)) {
		const epoch = parseInt(epochStr);
		if (epoch >= epochRange.start && (bestStartEpoch === void 0 || epoch < bestStartEpoch)) {
			bestStartEpoch = epoch;
			startTs = ts;
		}
		if (epoch <= epochRange.end && (bestEndEpoch === void 0 || epoch > bestEndEpoch)) {
			bestEndEpoch = epoch;
			endTs = ts;
		}
	}
	if (startTs === void 0 || endTs === void 0) return null;
	return {
		start: /* @__PURE__ */ new Date(startTs * 1e3),
		end: /* @__PURE__ */ new Date(endTs * 1e3)
	};
}
/**
* Get a human-readable description of the active time frame.
*/
function getTimeFrameDescription(timeFrame, customRange, referenceDate, customEpochRange) {
	if (timeFrame === "all") return "";
	if (timeFrame === "custom-epochs") {
		if (!customEpochRange) return "";
		return `Epoch ${customEpochRange.start} to ${customEpochRange.end}`;
	}
	const range = timeFrame === "custom" ? customRange : getTimeFrameDateRange(timeFrame, referenceDate);
	if (!range) return "";
	const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	return `${fmt(range.start)} to ${fmt(range.end)}`;
}
//#endregion
//#region src/lib/pages/staking-rewards/StakingRewards.svelte
var root = from_html(`<input id="address-input" type="text" placeholder="Enter primary address (0x...)" style="width: 100%;"/>`);
var root_1 = from_html(`<div class="error-message svelte-us09jc"><!> <!></div>`);
var root_2 = from_html(`<button class="add-btn svelte-us09jc">Add All Wallet Addresses</button>`);
var root_3 = from_html(`<p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.8; text-align: left !important;">Enter all addresses below, separated by comma, newline, or space:</p> <textarea placeholder="Enter addresses separated by comma, newline, or space (0x...)" rows="4" style="width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-color); color: white; padding: 0.4rem 0.8rem; border-radius: 4px;"></textarea> <!> <div class="address-buttons svelte-us09jc"><!></div>`, 1);
var root_4 = from_html(`<div class="error-message svelte-us09jc"> </div>`);
var root_5 = from_html(`<li><code style="opacity: 0.9;"> </code> </li>`);
var root_6 = from_html(`<p style="margin: 0.5rem 0 0.25rem 0; font-size: 0.9rem; opacity: 0.85;"> </p> <ul style="margin: 0 0 0 1.25rem; padding: 0; font-size: 0.85rem;"></ul>`, 1);
var root_7 = from_html(`<details class="skip-senders-details svelte-us09jc"><summary class="svelte-us09jc"> </summary> <p style="margin: 0.4rem 0 0.25rem 0; font-size: 0.9rem; opacity: 0.8; text-align: left !important;">Sender addresses whose transactions should be skipped:</p> <textarea placeholder="Enter sender addresses separated by comma, newline, or space (0x...)" rows="3" class="skip-senders-textarea svelte-us09jc"></textarea> <!> <!></details>`);
var root_8 = from_html(`<label class="toggle-row svelte-us09jc" style="margin-top: 0.5rem;"><div class="toggle-switch svelte-us09jc"><input type="checkbox" class="svelte-us09jc"/> <span class="slider svelte-us09jc"></span></div> <div style="display: flex; flex-direction: column; line-height: 1.2;"><div style="display: flex; align-items: center; gap: 0.25rem;"><span class="toggle-label">Skip object changes by sender</span> <div class="tooltip-container svelte-us09jc"><span class="info-icon svelte-us09jc">ⓘ</span> <div class="tooltip svelte-us09jc">Transactions from these addresses are skipped when looking for
                                    stake objects — useful for senders that post huge non-staking
                                    transactions and would otherwise dominate fetch time.</div></div></div> <span style="font-size: 0.75rem; opacity: 0.7;">Speeds up received-tx fetch for known-noisy senders</span></div></label> <!>`, 1);
var root_9 = from_html(`<option> </option>`);
var root_10 = from_html(`<label class="timeframe-date svelte-us09jc">From: <input type="date" class="svelte-us09jc"/></label> <label class="timeframe-date svelte-us09jc">To: <input type="date" class="svelte-us09jc"/></label>`, 1);
var root_11 = from_html(`<label class="timeframe-date svelte-us09jc">From epoch: <input type="number" min="0" step="1" placeholder="0" class="epoch-input svelte-us09jc"/></label> <label class="timeframe-date svelte-us09jc">To epoch: <input type="number" min="0" step="1" class="epoch-input svelte-us09jc"/></label>`, 1);
var root_12 = from_html(`<span class="timeframe-mapping svelte-us09jc"> </span>`);
var root_13 = from_html(`<span class="timeframe-info svelte-us09jc"><!> <!> <!></span>`);
var root_14 = from_html(`<label class="toggle-row svelte-us09jc"><div class="toggle-switch svelte-us09jc"><input type="checkbox" class="svelte-us09jc"/> <span class="slider svelte-us09jc"></span></div> <div style="display: flex; flex-direction: column; line-height: 1.2;"><div style="display: flex; align-items: center; gap: 0.25rem;"><span class="toggle-label">Ignore previous rewards</span> <div class="tooltip-container svelte-us09jc"><span class="info-icon svelte-us09jc">ⓘ</span> <div class="tooltip svelte-us09jc">Removes rewards that accrued before the selected time frame.
                                    Accumulated, available, and unstake rewards are re-based to
                                    start at the window, and the amount removed is shown in the
                                    report and exports.</div></div></div> <span style="font-size: 0.75rem; opacity: 0.7;">Report only rewards earned within the selected time frame</span></div></label>`);
var root_15 = from_html(`<div class="info-message svelte-us09jc"> <!></div>`);
var root_16 = from_html(`<div class="loading-message svelte-us09jc">Loading can take minutes, depending on the number of transactions/epochs.</div>`);
var root_17 = from_html(`<div class="info-message svelte-us09jc"> </div>`);
var root_18 = from_html(`<main class="container"><div class="toolbar" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start;"><div class="address-section" style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;"><label class="toggle-row svelte-us09jc" style="margin-bottom: 0.5rem;"><div class="toggle-switch svelte-us09jc"><input type="checkbox" class="svelte-us09jc"/> <span class="slider svelte-us09jc"></span></div> <span>Multiple addresses</span></label> <!> <!></div> <div class="options-section" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;"><label class="toggle-row svelte-us09jc"><div class="toggle-switch svelte-us09jc"><input type="checkbox" class="svelte-us09jc"/> <span class="slider svelte-us09jc"></span></div> <div style="display: flex; flex-direction: column; line-height: 1.2;"><div style="display: flex; align-items: center; gap: 0.25rem;"><span class="toggle-label">Include received</span> <div class="tooltip-container svelte-us09jc"><span class="info-icon svelte-us09jc">ⓘ</span> <div class="tooltip svelte-us09jc">If staking normal, this is not needed, but if StakedIota objects
                                were transferred in a tx like validators get for their rewards, then
                                received txs must be included to find these StakedIota objects.</div></div></div> <span style="font-size: 0.75rem; opacity: 0.7;">Slower, checks received transactions</span></div></label> <div class="timeframe-controls svelte-us09jc"><label class="timeframe-label svelte-us09jc">Time frame: <select class="svelte-us09jc"></select> <div class="tooltip-container svelte-us09jc"><span class="info-icon svelte-us09jc">ⓘ</span> <div class="tooltip svelte-us09jc">A wider frame (especially "All time") fetches and processes more
                            transaction history, so it takes longer for very active addresses.
                            Recent windows are fast.</div></div></label> <!> <!> <!></div> <!> <button style="background: #059669; margin: 0 auto;"> </button></div></div> <!> <!> <!> <!> <!> <div class="summary-section"><!></div> <!> <details><summary>Stake objects:</summary> <!></details> <details><summary>Transactions:</summary> <!></details></main>`);
function StakingRewards($$anchor, $$props) {
	push($$props, false);
	const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
	const $queryParamValues = () => store_get(queryParamValues, "$queryParamValues", $$stores);
	const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
	const $sharedStakingSkipPaginationSenders = () => store_get(sharedStakingSkipPaginationSenders, "$sharedStakingSkipPaginationSenders", $$stores);
	const $sharedStakingSkipPaginationEnabled = () => store_get(sharedStakingSkipPaginationEnabled, "$sharedStakingSkipPaginationEnabled", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const allAddresses = mutable_source();
	const additionalAddresses = mutable_source();
	const invalidAddresses = mutable_source();
	const duplicateAddresses = mutable_source();
	const skipSendersList = mutable_source();
	const skipSendersSet = mutable_source();
	const skipSendersInvalid = mutable_source();
	const skippedSendersTotal = mutable_source();
	const tableData = mutable_source();
	const customDateRange = mutable_source();
	const latestKnownEpoch = mutable_source();
	const customEpochRange = mutable_source();
	const mappedDateRangeForEpochs = mutable_source();
	const dateRangeForEpochMapping = mutable_source();
	const mappedEpochRangeForDates = mutable_source();
	const timeFrameFilteredEpochs = mutable_source();
	const filteredNegativeEpochs = mutable_source();
	const timeFrameFilteredEpochEndDates = mutable_source();
	const rebaseStartEpoch = mutable_source();
	const rebaseResult = mutable_source();
	const displayStakeObjects = mutable_source();
	const previousRewardsRemoved = mutable_source();
	const previousRewardsNotice = mutable_source();
	const displayTableData = mutable_source();
	const chartSkipLastEpoch = mutable_source();
	const filteredTableDataForChart = mutable_source();
	const exportFileName = mutable_source();
	const queryParamValues = usePageQueryParams({
		address: $activeAddress() || "0x5caab122e732ae3e00c374b7653f7d01b840891467cc157ca3f6b776b64c3fc1",
		addresses: "",
		timeFrame: "last-3-days",
		customStart: "",
		customEnd: "",
		customEpochStart: "",
		customEpochEnd: "",
		fetchReceivedTxs: false,
		ignorePreviousRewards: false
	});
	const initialQueryParams = get$1(queryParamValues);
	function isValidTimeFrame(v) {
		return typeof v === "string" && v in TIME_FRAME_LABELS;
	}
	function fmtDate(d) {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	}
	function parseEpochParam(raw) {
		if (!raw) return null;
		const n = parseInt(raw);
		return Number.isFinite(n) ? n : null;
	}
	let address = mutable_source("");
	let textareaValue = mutable_source(initialQueryParams.addresses);
	let useMultipleAddresses = mutable_source(initialQueryParams.addresses.trim() !== "");
	let hasAutoAddedPrimary = mutable_source(false);
	let userHasEditedTextarea = mutable_source(initialQueryParams.addresses.trim() !== "");
	let initialActiveAddress = mutable_source("");
	function updateAddress(newAddress) {
		set(address, newAddress);
		updatePageQueryParams({ address: newAddress || null });
		store_set(activeAddress, newAddress);
	}
	function parseAddresses(value) {
		return value.split(/[, \n]+/).map((s) => s.trim()).filter((s) => s);
	}
	function handleTextareaInput(e) {
		set(textareaValue, e.target.value);
		set(userHasEditedTextarea, true);
	}
	function addAllWalletAddresses() {
		const walletAddresses = $iota_accounts().map((acc) => acc.address).filter((addr) => addr && addr !== "0x");
		const existingAddresses = /* @__PURE__ */ new Set([get(address), ...get(additionalAddresses)]);
		const newAddresses = walletAddresses.filter((addr) => !existingAddresses.has(addr));
		if (newAddresses.length > 0) set(textareaValue, get(textareaValue) + ((get(textareaValue) ? "\n" : "") + newAddresses.join("\n")));
	}
	let epoch = mutable_source("");
	let error = mutable_source("");
	let transactions = mutable_source([]);
	let stakeObjects = mutable_source([]);
	let validatorInfo = mutable_source({});
	let loadingTxs = mutable_source(false);
	let loadingStep = mutable_source(null);
	let fetchReceivedTxs = mutable_source(initialQueryParams.fetchReceivedTxs);
	let ignorePreviousRewards = mutable_source(initialQueryParams.ignorePreviousRewards);
	let showPriceColumns = mutable_source(true);
	let showValidatorColumns = mutable_source(true);
	let noTransactionsFound = mutable_source(false);
	let skipSendersTextarea = mutable_source($sharedStakingSkipPaginationSenders().join("\n"));
	let skippedSendersCounts = mutable_source({});
	let epochEndDates = mutable_source([]);
	let epochTimestamps = mutable_source(mainnet_epoch_timestamps_cache_default);
	let epochPrices = mutable_source({});
	let selectedTimeFrame = mutable_source(isValidTimeFrame(initialQueryParams.timeFrame) ? initialQueryParams.timeFrame : "last-3-days");
	let customDateStart = mutable_source(initialQueryParams.customStart || "");
	let customDateEnd = mutable_source(initialQueryParams.customEnd || "");
	let customEpochStart = mutable_source(parseEpochParam(initialQueryParams.customEpochStart));
	let customEpochEnd = mutable_source(parseEpochParam(initialQueryParams.customEpochEnd));
	function handlePricesFetched(prices) {
		set(epochPrices, prices);
	}
	setInitialExchangeRateCacheFromBinary(exchange_rate_cache_default);
	async function getCurrentEpochAndEndTimestamp() {
		try {
			set(error, "");
			const currentEpochId = await new EpochPTBAnalyzer().getCurrentEpoch();
			if (currentEpochId) set(epoch, parseInt(currentEpochId));
			else set(error, "Failed to fetch current epoch.");
		} catch (err) {
			set(error, err?.toString() ?? "Error fetching current epoch.");
		}
	}
	async function fetchTransactions() {
		set(error, "");
		set(transactions, []);
		set(stakeObjects, []);
		set(validatorInfo, {});
		set(noTransactionsFound, false);
		set(skippedSendersCounts, {});
		set(loadingTxs, true);
		set(loadingStep, "Fetching stake txs...");
		try {
			const skipSendersSnapshot = $sharedStakingSkipPaginationEnabled() ? get(skipSendersSet) : void 0;
			const recordSkippedSender = (sender) => {
				set(skippedSendersCounts, {
					...get(skippedSendersCounts),
					[sender]: (get(skippedSendersCounts)[sender] ?? 0) + 1
				});
			};
			const startEpoch = getStartEpochForTimeFrame(mainnet_epoch_timestamps_cache_default, get(selectedTimeFrame), get(customDateRange), void 0, get(customEpochRange));
			let sentDone = 0;
			let receivedDone = 0;
			const total = get(allAddresses).length;
			const inFlight = /* @__PURE__ */ new Map();
			function renderLoadingStep(phase) {
				const baseDone = phase === "stake" ? sentDone : receivedDone;
				const phaseLabel = phase === "stake" ? "stake" : "received";
				const targetRole = phase === "stake" ? "sent" : "received";
				let foundSoFar = 0;
				for (const p of inFlight.values()) if (p.role === targetRole) foundSoFar += p.transactions;
				if (foundSoFar === 0) {
					set(loadingStep, `Fetching ${phaseLabel} txs ${baseDone}/${total}...`);
					return;
				}
				set(loadingStep, `Fetching ${phaseLabel} txs ${baseDone}/${total} (${foundSoFar} found)...`);
			}
			const allTxsResults = await mapWithConcurrency(get(allAddresses), 10, async (addr) => {
				try {
					const sentKey = `sent:${addr}`;
					inFlight.set(sentKey, {
						role: "sent",
						transactions: 0
					});
					renderLoadingStep("stake");
					const sentTxs = await fetchStakeTransactions(addr, {
						startEpoch,
						skipPaginationSenders: skipSendersSnapshot,
						onSkipPagination: recordSkippedSender,
						onProgress: ({ transactions }) => {
							const entry = inFlight.get(sentKey);
							if (entry) {
								entry.transactions = transactions;
								renderLoadingStep("stake");
							}
						}
					});
					inFlight.delete(sentKey);
					sentDone++;
					renderLoadingStep("stake");
					let receivedTxs = [];
					if (get(fetchReceivedTxs)) {
						const recvKey = `recv:${addr}`;
						inFlight.set(recvKey, {
							role: "received",
							transactions: 0
						});
						renderLoadingStep("received");
						receivedTxs = await fetchReceivedStakeTransactions(addr, {
							startEpoch,
							skipPaginationSenders: skipSendersSnapshot,
							onSkipPagination: recordSkippedSender,
							onProgress: ({ transactions }) => {
								const entry = inFlight.get(recvKey);
								if (entry) {
									entry.transactions = transactions;
									renderLoadingStep("received");
								}
							}
						});
						inFlight.delete(recvKey);
						receivedDone++;
						renderLoadingStep("received");
					}
					return {
						sentTxs,
						receivedTxs,
						address: addr,
						error: null
					};
				} catch (err) {
					console.error(`Failed to fetch transactions for address ${addr}:`, err);
					return {
						sentTxs: [],
						receivedTxs: [],
						address: addr,
						error: err
					};
				}
			});
			const failedAddresses = allTxsResults.filter((r) => r.error);
			if (failedAddresses.length > 0) console.warn(`Failed to fetch transactions for ${failedAddresses.length} address(es)`);
			console.log("All transactions fetched:", allTxsResults);
			set(loadingStep, "Fetching epoch info...");
			await getCurrentEpochAndEndTimestamp();
			let uniqueTxs = allTxsResults.flatMap((result) => [result.sentTxs, ...get(fetchReceivedTxs) ? result.receivedTxs : []]).flat().reduce((acc, tx) => {
				if (!acc.some((t) => t.digest === tx.digest)) acc.push(tx);
				return acc;
			}, []);
			let currentStakeObjects;
			if (startEpoch !== void 0) {
				set(loadingStep, "Fetching current stake objects...");
				currentStakeObjects = await fetchCurrentStakedObjects(get(allAddresses));
				console.log(`Fetched ${currentStakeObjects.length} current stake objects from chain`);
			}
			if (uniqueTxs.length === 0 && (!currentStakeObjects || currentStakeObjects.length === 0)) {
				set(noTransactionsFound, true);
				set(loadingTxs, false);
				set(loadingStep, null);
				return;
			}
			set(loadingStep, "Fetching exchange rates...");
			const result = await processStakeTransactionsWithExchangeRates(uniqueTxs, get(epoch), get(allAddresses), {
				startEpoch,
				currentStakeObjects
			});
			set(stakeObjects, result.stakeObjects);
			set(validatorInfo, result.validatorInfo);
			console.log("Processed stake objects:", get(stakeObjects));
			set(transactions, uniqueTxs);
			console.log("fetching txs complete");
		} catch (err) {
			set(error, err?.toString() ?? "Error fetching transactions.");
		} finally {
			set(loadingTxs, false);
			set(loadingStep, null);
		}
	}
	legacy_pre_effect(() => (get(initialActiveAddress), $activeAddress()), () => {
		if (!get(initialActiveAddress)) set(initialActiveAddress, $activeAddress());
	});
	legacy_pre_effect(() => $queryParamValues(), () => {
		set(address, $queryParamValues().address);
	});
	legacy_pre_effect(() => ($activeAddress(), get(initialActiveAddress), get(address)), () => {
		if ($activeAddress() !== get(initialActiveAddress) && $activeAddress() && get(address) !== $activeAddress()) updateAddress($activeAddress());
	});
	legacy_pre_effect(() => get(useMultipleAddresses), () => {
		if (!get(useMultipleAddresses)) {
			set(hasAutoAddedPrimary, false);
			set(userHasEditedTextarea, false);
		}
	});
	legacy_pre_effect(() => (get(useMultipleAddresses), get(hasAutoAddedPrimary), get(userHasEditedTextarea), get(address), get(textareaValue)), () => {
		if (get(useMultipleAddresses) && !get(hasAutoAddedPrimary) && !get(userHasEditedTextarea) && get(address) && get(textareaValue).trim() === "") {
			set(textareaValue, get(address));
			set(hasAutoAddedPrimary, true);
		}
	});
	legacy_pre_effect(() => (get(useMultipleAddresses), get(textareaValue)), () => {
		set(additionalAddresses, get(useMultipleAddresses) ? parseAddresses(get(textareaValue)) : []);
	});
	legacy_pre_effect(() => (get(useMultipleAddresses), get(additionalAddresses), get(address)), () => {
		set(allAddresses, (() => {
			const addresses = get(useMultipleAddresses) ? get(additionalAddresses) : get(address) ? [get(address)] : [];
			return [...new Set(addresses.filter((addr) => addr && addr.trim() !== ""))];
		})());
	});
	legacy_pre_effect(() => (get(additionalAddresses), isValidIotaAddress), () => {
		set(invalidAddresses, get(additionalAddresses).filter((addr) => !isValidIotaAddress(addr)));
	});
	legacy_pre_effect(() => get(additionalAddresses), () => {
		set(duplicateAddresses, get(additionalAddresses).filter((addr, index) => get(additionalAddresses).indexOf(addr) !== index));
	});
	legacy_pre_effect(() => ($sharedStakingSkipPaginationEnabled(), get(skipSendersTextarea)), () => {
		set(skipSendersList, $sharedStakingSkipPaginationEnabled() ? parseAddresses(get(skipSendersTextarea)) : []);
	});
	legacy_pre_effect(() => get(skipSendersList), () => {
		set(skipSendersSet, new Set(get(skipSendersList)));
	});
	legacy_pre_effect(() => (get(skipSendersList), isValidIotaAddress), () => {
		set(skipSendersInvalid, get(skipSendersList).filter((a) => !isValidIotaAddress(a)));
	});
	legacy_pre_effect(() => get(skipSendersTextarea), () => {
		store_set(sharedStakingSkipPaginationSenders, parseAddresses(get(skipSendersTextarea)));
	});
	legacy_pre_effect(() => get(skippedSendersCounts), () => {
		set(skippedSendersTotal, Object.values(get(skippedSendersCounts)).reduce((a, b) => a + b, 0));
	});
	legacy_pre_effect(() => (get(stakeObjects), get(validatorInfo), get(epoch)), () => {
		set(tableData, computeEpochData(get(stakeObjects), get(validatorInfo), get(epoch) || 1));
	});
	legacy_pre_effect(() => get(selectedTimeFrame), () => {
		updatePageQueryParams({ timeFrame: get(selectedTimeFrame) === "last-3-days" ? null : get(selectedTimeFrame) });
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customDateStart), get(customDateEnd)), () => {
		updatePageQueryParams({
			customStart: get(selectedTimeFrame) === "custom" && get(customDateStart) ? get(customDateStart) : null,
			customEnd: get(selectedTimeFrame) === "custom" && get(customDateEnd) ? get(customDateEnd) : null
		});
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customEpochStart), get(customEpochEnd)), () => {
		updatePageQueryParams({
			customEpochStart: get(selectedTimeFrame) === "custom-epochs" && typeof get(customEpochStart) === "number" && Number.isFinite(get(customEpochStart)) ? String(get(customEpochStart)) : null,
			customEpochEnd: get(selectedTimeFrame) === "custom-epochs" && typeof get(customEpochEnd) === "number" && Number.isFinite(get(customEpochEnd)) ? String(get(customEpochEnd)) : null
		});
	});
	legacy_pre_effect(() => (get(useMultipleAddresses), get(textareaValue)), () => {
		updatePageQueryParams({ addresses: get(useMultipleAddresses) && get(textareaValue).trim() ? get(textareaValue) : null });
	});
	legacy_pre_effect(() => get(fetchReceivedTxs), () => {
		updatePageQueryParams({ fetchReceivedTxs: get(fetchReceivedTxs) ? true : null });
	});
	legacy_pre_effect(() => get(ignorePreviousRewards), () => {
		updatePageQueryParams({ ignorePreviousRewards: get(ignorePreviousRewards) ? true : null });
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customDateStart), get(customDateEnd)), () => {
		set(customDateRange, get(selectedTimeFrame) === "custom" && get(customDateStart) && get(customDateEnd) ? {
			start: /* @__PURE__ */ new Date(get(customDateStart) + "T00:00:00"),
			end: /* @__PURE__ */ new Date(get(customDateEnd) + "T23:59:59.999")
		} : void 0);
	});
	legacy_pre_effect(() => (get(tableData), get(epoch), mainnet_epoch_timestamps_cache_default), () => {
		if (get(tableData).epochs.length > 0) fetchEpochTimestampsForDisplay(get(tableData).epochs, get(epoch) || 1, mainnet_epoch_timestamps_cache_default).then(({ epochEndDates: dates, fetchedEpochTimestamps }) => {
			set(epochEndDates, dates);
			set(epochTimestamps, fetchedEpochTimestamps);
		});
		else set(epochEndDates, []);
	});
	legacy_pre_effect(() => (get(epoch), get(epochTimestamps)), () => {
		set(latestKnownEpoch, (() => {
			if (typeof get(epoch) === "number") return get(epoch);
			const keys = Object.keys(get(epochTimestamps)).map(Number);
			return keys.length > 0 ? Math.max(...keys) : void 0;
		})());
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customEpochStart), get(customEpochEnd), get(latestKnownEpoch)), () => {
		set(customEpochRange, (() => {
			if (get(selectedTimeFrame) !== "custom-epochs") return void 0;
			const startNum = typeof get(customEpochStart) === "number" && Number.isFinite(get(customEpochStart)) ? get(customEpochStart) : null;
			const endNum = typeof get(customEpochEnd) === "number" && Number.isFinite(get(customEpochEnd)) ? get(customEpochEnd) : null;
			const start = startNum ?? 0;
			const end = endNum ?? get(latestKnownEpoch);
			if (end == null || start > end) return void 0;
			return {
				start,
				end
			};
		})());
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customEpochRange), get(epochTimestamps)), () => {
		set(mappedDateRangeForEpochs, get(selectedTimeFrame) === "custom-epochs" && get(customEpochRange) ? getDateRangeForEpochRange(get(epochTimestamps), get(customEpochRange)) : null);
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customDateRange), getTimeFrameDateRange), () => {
		set(dateRangeForEpochMapping, (() => {
			if (get(selectedTimeFrame) === "all" || get(selectedTimeFrame) === "custom-epochs") return null;
			if (get(selectedTimeFrame) === "custom") return get(customDateRange) ?? null;
			return getTimeFrameDateRange(get(selectedTimeFrame));
		})());
	});
	legacy_pre_effect(() => (get(dateRangeForEpochMapping), get(epochTimestamps)), () => {
		set(mappedEpochRangeForDates, get(dateRangeForEpochMapping) ? getEpochRangeForDateRange(get(epochTimestamps), get(dateRangeForEpochMapping)) : null);
	});
	legacy_pre_effect(() => (get(tableData), get(epochTimestamps), get(selectedTimeFrame), get(customDateRange), get(customEpochRange)), () => {
		set(timeFrameFilteredEpochs, filterEpochsByTimeFrame(get(tableData).epochs, get(epochTimestamps), get(selectedTimeFrame), get(customDateRange), void 0, get(customEpochRange)));
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(tableData), get(timeFrameFilteredEpochs)), () => {
		set(filteredNegativeEpochs, get(selectedTimeFrame) === "all" ? get(tableData).negativeAvailableEpochs : get(tableData).negativeAvailableEpochs.filter((e) => get(timeFrameFilteredEpochs).includes(e)));
	});
	legacy_pre_effect(() => (get(timeFrameFilteredEpochs), get(tableData), get(epochEndDates)), () => {
		set(timeFrameFilteredEpochEndDates, get(timeFrameFilteredEpochs).map((ep) => {
			const idx = get(tableData).epochs.indexOf(ep);
			return idx >= 0 ? get(epochEndDates)[idx] : "";
		}));
	});
	legacy_pre_effect(() => (get(ignorePreviousRewards), get(selectedTimeFrame), get(timeFrameFilteredEpochs)), () => {
		set(rebaseStartEpoch, get(ignorePreviousRewards) && get(selectedTimeFrame) !== "all" && get(timeFrameFilteredEpochs).length > 0 ? get(timeFrameFilteredEpochs)[0] : void 0);
	});
	legacy_pre_effect(() => (get(rebaseStartEpoch), get(stakeObjects)), () => {
		set(rebaseResult, get(rebaseStartEpoch) !== void 0 ? rebaselineStakeObjects(get(stakeObjects), get(rebaseStartEpoch)) : null);
	});
	legacy_pre_effect(() => (get(rebaseResult), get(stakeObjects)), () => {
		set(displayStakeObjects, get(rebaseResult) ? get(rebaseResult).stakeObjects : get(stakeObjects));
	});
	legacy_pre_effect(() => get(rebaseResult), () => {
		set(previousRewardsRemoved, get(rebaseResult) ? get(rebaseResult).previousRewardsRemoved : 0n);
	});
	legacy_pre_effect(() => (get(rebaseStartEpoch), get(previousRewardsRemoved), formatNanoAsIota), () => {
		set(previousRewardsNotice, get(rebaseStartEpoch) !== void 0 && get(previousRewardsRemoved) > 0n ? `Previous rewards ignored: ${formatNanoAsIota(get(previousRewardsRemoved))} — accrued before epoch ${get(rebaseStartEpoch)}` : "");
	});
	legacy_pre_effect(() => (get(rebaseResult), get(displayStakeObjects), get(validatorInfo), get(epoch), get(tableData)), () => {
		set(displayTableData, get(rebaseResult) ? computeEpochData(get(displayStakeObjects), get(validatorInfo), get(epoch) || 1) : get(tableData));
	});
	legacy_pre_effect(() => (get(timeFrameFilteredEpochs), get(tableData)), () => {
		set(chartSkipLastEpoch, get(timeFrameFilteredEpochs).length > 0 && get(tableData).epochs.length > 0 && get(timeFrameFilteredEpochs)[get(timeFrameFilteredEpochs).length - 1] === get(tableData).epochs[get(tableData).epochs.length - 1]);
	});
	legacy_pre_effect(() => (get(displayTableData), get(timeFrameFilteredEpochs)), () => {
		set(filteredTableDataForChart, {
			...get(displayTableData),
			epochs: get(timeFrameFilteredEpochs)
		});
	});
	legacy_pre_effect(() => (get(selectedTimeFrame), get(customEpochRange), get(customDateRange), getTimeFrameDateRange), () => {
		set(exportFileName, (() => {
			const today = fmtDate(/* @__PURE__ */ new Date());
			if (get(selectedTimeFrame) === "all") return `staking-rewards-table-${today}`;
			if (get(selectedTimeFrame) === "custom-epochs") {
				if (!get(customEpochRange)) return `staking-rewards-table-${today}`;
				return `staking-rewards-table-epoch-${get(customEpochRange).start}_to_${get(customEpochRange).end}`;
			}
			const range = get(selectedTimeFrame) === "custom" ? get(customDateRange) : getTimeFrameDateRange(get(selectedTimeFrame));
			if (!range) return `staking-rewards-table-${today}`;
			return `staking-rewards-table-${fmtDate(range.start)}_to_${fmtDate(range.end)}`;
		})());
	});
	legacy_pre_effect_reset();
	init();
	var main = root_18();
	var div = child(main);
	var div_1 = child(div);
	var label_1 = child(div_1);
	var div_2 = child(label_1);
	var input = child(div_2);
	remove_input_defaults(input);
	next(2);
	reset(div_2);
	next(2);
	reset(label_1);
	var node = sibling(label_1, 2);
	var consequent = ($$anchor) => {
		var input_1 = root();
		remove_input_defaults(input_1);
		template_effect(() => set_value(input_1, get(address)));
		delegated("input", input_1, (e) => updateAddress(e.target?.value || ""));
		append($$anchor, input_1);
	};
	var alternate = ($$anchor) => {
		var fragment = root_3();
		var textarea = sibling(first_child(fragment), 2);
		remove_textarea_child(textarea);
		var node_1 = sibling(textarea, 2);
		var consequent_3 = ($$anchor) => {
			var div_3 = root_1();
			var node_2 = child(div_3);
			var consequent_1 = ($$anchor) => {
				var text$1 = text();
				template_effect(($0) => set_text(text$1, `Invalid addresses: ${$0 ?? ""}`), [() => (get(invalidAddresses), untrack(() => get(invalidAddresses).join(", ")))]);
				append($$anchor, text$1);
			};
			if_block(node_2, ($$render) => {
				if (get(invalidAddresses), untrack(() => get(invalidAddresses).length > 0)) $$render(consequent_1);
			});
			var node_3 = sibling(node_2, 2);
			var consequent_2 = ($$anchor) => {
				var text_1 = text();
				template_effect(($0) => set_text(text_1, `${(get(invalidAddresses), untrack(() => get(invalidAddresses).length > 0 ? "; " : "")) ?? ""}Duplicate addresses: ${$0 ?? ""}`), [() => (get(duplicateAddresses), untrack(() => get(duplicateAddresses).join(", ")))]);
				append($$anchor, text_1);
			};
			if_block(node_3, ($$render) => {
				if (get(duplicateAddresses), untrack(() => get(duplicateAddresses).length > 0)) $$render(consequent_2);
			});
			reset(div_3);
			append($$anchor, div_3);
		};
		if_block(node_1, ($$render) => {
			if (get(invalidAddresses), get(duplicateAddresses), untrack(() => get(invalidAddresses).length > 0 || get(duplicateAddresses).length > 0)) $$render(consequent_3);
		});
		var div_4 = sibling(node_1, 2);
		var node_4 = child(div_4);
		var consequent_4 = ($$anchor) => {
			var button = root_2();
			delegated("click", button, addAllWalletAddresses);
			append($$anchor, button);
		};
		if_block(node_4, ($$render) => {
			if ($iota_accounts(), untrack(() => $iota_accounts().length > 0)) $$render(consequent_4);
		});
		reset(div_4);
		template_effect(() => set_value(textarea, get(textareaValue)));
		delegated("input", textarea, handleTextareaInput);
		append($$anchor, fragment);
	};
	if_block(node, ($$render) => {
		if (!get(useMultipleAddresses)) $$render(consequent);
		else $$render(alternate, -1);
	});
	var node_5 = sibling(node, 2);
	var consequent_8 = ($$anchor) => {
		var fragment_3 = root_8();
		var label_2 = first_child(fragment_3);
		var div_5 = child(label_2);
		var input_2 = child(div_5);
		remove_input_defaults(input_2);
		next(2);
		reset(div_5);
		next(2);
		reset(label_2);
		var node_6 = sibling(label_2, 2);
		var consequent_7 = ($$anchor) => {
			var details = root_7();
			var summary = child(details);
			var text_2 = child(summary);
			reset(summary);
			var textarea_1 = sibling(summary, 4);
			remove_textarea_child(textarea_1);
			var node_7 = sibling(textarea_1, 2);
			var consequent_5 = ($$anchor) => {
				var div_6 = root_4();
				var text_3 = child(div_6);
				reset(div_6);
				template_effect(($0) => set_text(text_3, `Invalid skip-sender addresses: ${$0 ?? ""}`), [() => (get(skipSendersInvalid), untrack(() => get(skipSendersInvalid).join(", ")))]);
				append($$anchor, div_6);
			};
			if_block(node_7, ($$render) => {
				if (get(skipSendersInvalid), untrack(() => get(skipSendersInvalid).length > 0)) $$render(consequent_5);
			});
			var node_8 = sibling(node_7, 2);
			var consequent_6 = ($$anchor) => {
				var fragment_4 = root_6();
				var p_1 = first_child(fragment_4);
				var text_4 = child(p_1);
				reset(p_1);
				var ul = sibling(p_1, 2);
				each(ul, 5, () => (get(skippedSendersCounts), untrack(() => Object.entries(get(skippedSendersCounts)))), index, ($$anchor, $$item) => {
					var $$array = user_derived(() => to_array(get($$item), 2));
					let sender = () => get($$array)[0];
					let count = () => get($$array)[1];
					var li = root_5();
					var code = child(li);
					var text_5 = child(code, true);
					reset(code);
					var text_6 = sibling(code);
					reset(li);
					template_effect(() => {
						set_text(text_5, sender());
						set_text(text_6, `: ${count() ?? ""}`);
					});
					append($$anchor, li);
				});
				reset(ul);
				template_effect(() => set_text(text_4, `Last fetch skipped pagination for ${get(skippedSendersTotal) ?? ""} transaction${get(skippedSendersTotal) === 1 ? "" : "s"}:`));
				append($$anchor, fragment_4);
			};
			if_block(node_8, ($$render) => {
				if (get(skippedSendersTotal) > 0) $$render(consequent_6);
			});
			reset(details);
			template_effect(() => {
				set_text(text_2, `Skip-sender addresses (${(get(skipSendersList), untrack(() => get(skipSendersList).length)) ?? ""})${get(skippedSendersTotal) > 0 ? ` — last fetch skipped ${get(skippedSendersTotal)} tx${get(skippedSendersTotal) === 1 ? "" : "s"}` : ""}`);
				textarea_1.disabled = get(loadingTxs);
			});
			bind_value(textarea_1, () => get(skipSendersTextarea), ($$value) => set(skipSendersTextarea, $$value));
			append($$anchor, details);
		};
		if_block(node_6, ($$render) => {
			if ($sharedStakingSkipPaginationEnabled()) $$render(consequent_7);
		});
		template_effect(() => input_2.disabled = get(loadingTxs));
		bind_checked(input_2, $sharedStakingSkipPaginationEnabled, ($$value) => store_set(sharedStakingSkipPaginationEnabled, $$value));
		append($$anchor, fragment_3);
	};
	if_block(node_5, ($$render) => {
		if (get(fetchReceivedTxs)) $$render(consequent_8);
	});
	reset(div_1);
	var div_7 = sibling(div_1, 2);
	var label_3 = child(div_7);
	var div_8 = child(label_3);
	var input_3 = child(div_8);
	remove_input_defaults(input_3);
	next(2);
	reset(div_8);
	next(2);
	reset(label_3);
	var div_9 = sibling(label_3, 2);
	var label_4 = child(div_9);
	var select = sibling(child(label_4));
	each(select, 5, () => (deep_read_state(TIME_FRAME_LABELS), untrack(() => Object.entries(TIME_FRAME_LABELS))), index, ($$anchor, $$item) => {
		var $$array_1 = user_derived(() => to_array(get($$item), 2));
		let value = () => get($$array_1)[0];
		let label = () => get($$array_1)[1];
		var option = root_9();
		var text_7 = child(option, true);
		reset(option);
		var option_value = {};
		template_effect(() => {
			set_text(text_7, label());
			if (option_value !== (option_value = value())) option.value = (option.__value = value()) ?? "";
		});
		append($$anchor, option);
	});
	reset(select);
	next(2);
	reset(label_4);
	var node_9 = sibling(label_4, 2);
	var consequent_9 = ($$anchor) => {
		var fragment_5 = root_10();
		var label_5 = first_child(fragment_5);
		var input_4 = sibling(child(label_5));
		remove_input_defaults(input_4);
		reset(label_5);
		var label_6 = sibling(label_5, 2);
		var input_5 = sibling(child(label_6));
		remove_input_defaults(input_5);
		reset(label_6);
		bind_value(input_4, () => get(customDateStart), ($$value) => set(customDateStart, $$value));
		bind_value(input_5, () => get(customDateEnd), ($$value) => set(customDateEnd, $$value));
		append($$anchor, fragment_5);
	};
	if_block(node_9, ($$render) => {
		if (get(selectedTimeFrame) === "custom") $$render(consequent_9);
	});
	var node_10 = sibling(node_9, 2);
	var consequent_10 = ($$anchor) => {
		var fragment_6 = root_11();
		var label_7 = first_child(fragment_6);
		var input_6 = sibling(child(label_7));
		remove_input_defaults(input_6);
		reset(label_7);
		var label_8 = sibling(label_7, 2);
		var input_7 = sibling(child(label_8));
		remove_input_defaults(input_7);
		reset(label_8);
		template_effect(() => set_attribute(input_7, "placeholder", get(latestKnownEpoch) !== void 0 ? `current (${get(latestKnownEpoch)})` : "current"));
		bind_value(input_6, () => get(customEpochStart), ($$value) => set(customEpochStart, $$value));
		bind_value(input_7, () => get(customEpochEnd), ($$value) => set(customEpochEnd, $$value));
		append($$anchor, fragment_6);
	};
	if_block(node_10, ($$render) => {
		if (get(selectedTimeFrame) === "custom-epochs") $$render(consequent_10);
	});
	var node_11 = sibling(node_10, 2);
	var consequent_15 = ($$anchor) => {
		var span = root_13();
		var node_12 = child(span);
		var consequent_11 = ($$anchor) => {
			var text_8 = text();
			template_effect(($0) => set_text(text_8, `Epoch ${(get(customEpochRange), untrack(() => get(customEpochRange).start)) ?? ""} to ${(get(customEpochRange), untrack(() => get(customEpochRange).end)) ?? ""}${$0 ?? ""}`), [() => (get(customEpochEnd), untrack(() => !(typeof get(customEpochEnd) === "number" && Number.isFinite(get(customEpochEnd))) ? " (current)" : ""))]);
			append($$anchor, text_8);
		};
		var alternate_1 = ($$anchor) => {
			var text_9 = text();
			template_effect(($0) => set_text(text_9, $0), [() => (deep_read_state(getTimeFrameDescription), get(selectedTimeFrame), get(customDateRange), get(customEpochRange), untrack(() => getTimeFrameDescription(get(selectedTimeFrame), get(customDateRange), void 0, get(customEpochRange))))]);
			append($$anchor, text_9);
		};
		if_block(node_12, ($$render) => {
			if (get(selectedTimeFrame) === "custom-epochs" && get(customEpochRange)) $$render(consequent_11);
			else $$render(alternate_1, -1);
		});
		var node_13 = sibling(node_12, 2);
		var consequent_12 = ($$anchor) => {
			var span_1 = root_12();
			var text_10 = child(span_1);
			reset(span_1);
			template_effect(($0, $1) => set_text(text_10, `≈ ${$0 ?? ""} to ${$1 ?? ""}`), [() => (get(mappedDateRangeForEpochs), untrack(() => fmtDate(get(mappedDateRangeForEpochs).start))), () => (get(mappedDateRangeForEpochs), untrack(() => fmtDate(get(mappedDateRangeForEpochs).end)))]);
			append($$anchor, span_1);
		};
		var consequent_13 = ($$anchor) => {
			var span_2 = root_12();
			var text_11 = child(span_2);
			reset(span_2);
			template_effect(() => set_text(text_11, `≈ epoch ${(get(mappedEpochRangeForDates), untrack(() => get(mappedEpochRangeForDates).start)) ?? ""} to ${(get(mappedEpochRangeForDates), untrack(() => get(mappedEpochRangeForDates).end)) ?? ""}`));
			append($$anchor, span_2);
		};
		if_block(node_13, ($$render) => {
			if (get(selectedTimeFrame) === "custom-epochs" && get(mappedDateRangeForEpochs)) $$render(consequent_12);
			else if (get(selectedTimeFrame) !== "custom-epochs" && get(mappedEpochRangeForDates)) $$render(consequent_13, 1);
		});
		var node_14 = sibling(node_13, 2);
		var consequent_14 = ($$anchor) => {
			var text_12 = text();
			template_effect(() => set_text(text_12, `(${(get(timeFrameFilteredEpochs), untrack(() => get(timeFrameFilteredEpochs).length)) ?? ""} of ${(get(tableData), untrack(() => get(tableData).epochs.length)) ?? ""} epochs)`));
			append($$anchor, text_12);
		};
		if_block(node_14, ($$render) => {
			if (get(tableData), untrack(() => get(tableData).epochs.length > 0)) $$render(consequent_14);
		});
		reset(span);
		append($$anchor, span);
	};
	if_block(node_11, ($$render) => {
		if (get(selectedTimeFrame) !== "all") $$render(consequent_15);
	});
	reset(div_9);
	var node_15 = sibling(div_9, 2);
	var consequent_16 = ($$anchor) => {
		var label_9 = root_14();
		var div_10 = child(label_9);
		var input_8 = child(div_10);
		remove_input_defaults(input_8);
		next(2);
		reset(div_10);
		next(2);
		reset(label_9);
		bind_checked(input_8, () => get(ignorePreviousRewards), ($$value) => set(ignorePreviousRewards, $$value));
		append($$anchor, label_9);
	};
	if_block(node_15, ($$render) => {
		if (get(selectedTimeFrame) !== "all") $$render(consequent_16);
	});
	var button_1 = sibling(node_15, 2);
	var text_13 = child(button_1, true);
	reset(button_1);
	reset(div_7);
	reset(div);
	var node_16 = sibling(div, 2);
	var consequent_18 = ($$anchor) => {
		var div_11 = root_15();
		var text_14 = child(div_11);
		var node_17 = sibling(text_14);
		var consequent_17 = ($$anchor) => {
			var text_15 = text();
			template_effect(() => set_text(text_15, `and ${(get(allAddresses), untrack(() => get(allAddresses).length - 3)) ?? ""} more`));
			append($$anchor, text_15);
		};
		if_block(node_17, ($$render) => {
			if (get(allAddresses), untrack(() => get(allAddresses).length > 3)) $$render(consequent_17);
		});
		reset(div_11);
		template_effect(($0) => set_text(text_14, `Fetching data for ${(get(allAddresses), untrack(() => get(allAddresses).length)) ?? ""} addresses: ${$0 ?? ""} `), [() => (get(allAddresses), untrack(() => get(allAddresses).slice(0, 3).map((a) => a.slice(0, 8) + "...").join(", ")))]);
		append($$anchor, div_11);
	};
	if_block(node_16, ($$render) => {
		if (get(allAddresses), untrack(() => get(allAddresses).length > 1)) $$render(consequent_18);
	});
	var node_18 = sibling(node_16, 2);
	var consequent_19 = ($$anchor) => {
		append($$anchor, root_16());
	};
	if_block(node_18, ($$render) => {
		if (get(loadingTxs)) $$render(consequent_19);
	});
	var node_19 = sibling(node_18, 2);
	var consequent_20 = ($$anchor) => {
		var div_13 = root_4();
		var text_16 = child(div_13, true);
		reset(div_13);
		template_effect(() => set_text(text_16, get(error)));
		append($$anchor, div_13);
	};
	if_block(node_19, ($$render) => {
		if (get(error)) $$render(consequent_20);
	});
	var node_20 = sibling(node_19, 2);
	var consequent_21 = ($$anchor) => {
		var div_14 = root_4();
		var text_17 = child(div_14);
		reset(div_14);
		template_effect(($0) => set_text(text_17, `Available Rewards went negative at ${(get(filteredNegativeEpochs), untrack(() => get(filteredNegativeEpochs).length)) ?? ""} epoch(s). This is most
            likely because stake objects were received from another address and the incoming transactions
            were not fetched${get(fetchReceivedTxs) ? " completely" : " — try enabling \"Include received\" above and fetching again"}. Offending epoch${(get(filteredNegativeEpochs), untrack(() => get(filteredNegativeEpochs).length === 1 ? "" : "s")) ?? ""}: ${$0 ?? ""}${(get(filteredNegativeEpochs), untrack(() => get(filteredNegativeEpochs).length > 10 ? "…" : "")) ?? ""}`), [() => (get(filteredNegativeEpochs), untrack(() => get(filteredNegativeEpochs).slice(0, 10).join(", ")))]);
		append($$anchor, div_14);
	};
	if_block(node_20, ($$render) => {
		if (get(filteredNegativeEpochs), untrack(() => get(filteredNegativeEpochs).length > 0)) $$render(consequent_21);
	});
	var node_21 = sibling(node_20, 2);
	var consequent_22 = ($$anchor) => {
		var div_15 = root_17();
		var text_18 = child(div_15, true);
		reset(div_15);
		template_effect(() => set_text(text_18, get(previousRewardsNotice)));
		append($$anchor, div_15);
	};
	if_block(node_21, ($$render) => {
		if (get(previousRewardsNotice), get(stakeObjects), untrack(() => get(previousRewardsNotice) && get(stakeObjects).length > 0)) $$render(consequent_22);
	});
	var div_16 = sibling(node_21, 2);
	var node_22 = child(div_16);
	{
		let $0 = derived_safe_equal(() => get(epoch) || 1);
		StakingRewardsTable(node_22, {
			get currentEpoch() {
				return get($0);
			},
			get stakeObjects() {
				return get(displayStakeObjects);
			},
			get validatorInfo() {
				return get(validatorInfo);
			},
			onPricesFetched: handlePricesFetched,
			get noTransactionsFound() {
				return get(noTransactionsFound);
			},
			get timeFrameFilteredEpochs() {
				return get(timeFrameFilteredEpochs);
			},
			get exportFileName() {
				return get(exportFileName);
			},
			get previousRewardsNotice() {
				return get(previousRewardsNotice);
			},
			get showPriceColumns() {
				return get(showPriceColumns);
			},
			set showPriceColumns($$value) {
				set(showPriceColumns, $$value);
			},
			get showValidatorColumns() {
				return get(showValidatorColumns);
			},
			set showValidatorColumns($$value) {
				set(showValidatorColumns, $$value);
			},
			$$legacy: true
		});
	}
	reset(div_16);
	var node_23 = sibling(div_16, 2);
	var consequent_23 = ($$anchor) => {
		StakingRewardsChart($$anchor, {
			get tableData() {
				return get(filteredTableDataForChart);
			},
			get epochEndDates() {
				return get(timeFrameFilteredEpochEndDates);
			},
			get epochPrices() {
				return get(epochPrices);
			},
			get skipLastEpoch() {
				return get(chartSkipLastEpoch);
			}
		});
	};
	if_block(node_23, ($$render) => {
		if (get(stakeObjects), untrack(() => get(stakeObjects).length > 0)) $$render(consequent_23);
	});
	var details_1 = sibling(node_23, 2);
	JsonToggleView(sibling(child(details_1), 2), { get value() {
		return get(stakeObjects);
	} });
	reset(details_1);
	var details_2 = sibling(details_1, 2);
	JsonToggleView(sibling(child(details_2), 2), { get value() {
		return get(transactions);
	} });
	reset(details_2);
	reset(main);
	template_effect(() => {
		input_3.disabled = get(loadingTxs);
		button_1.disabled = get(loadingTxs);
		set_text(text_13, get(loadingTxs) ? get(loadingStep) ?? "Loading..." : "Fetch Data");
	});
	bind_checked(input, () => get(useMultipleAddresses), ($$value) => set(useMultipleAddresses, $$value));
	bind_checked(input_3, () => get(fetchReceivedTxs), ($$value) => set(fetchReceivedTxs, $$value));
	bind_select_value(select, () => get(selectedTimeFrame), ($$value) => set(selectedTimeFrame, $$value));
	delegated("click", button_1, fetchTransactions);
	append($$anchor, main);
	pop();
	$$cleanup();
}
delegate(["input", "click"]);
//#endregion
export { StakingRewards as default };

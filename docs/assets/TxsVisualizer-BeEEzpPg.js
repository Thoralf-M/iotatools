import { B as comment, D as set_class, Dt as pop, E as set_style, I as if_block, Mt as reset, N as each, Ot as push, P as index, Pt as to_array, R as set_text, U as delegate, V as from_html, W as delegated, Y as get, at as user_effect, ct as sibling, ft as set, gt as user_derived, h as bind_value, it as template_effect, jt as next, lt as proxy, n as onDestroy, ot as child, pt as state, r as onMount, st as first_child, v as remove_input_defaults, y as set_attribute, z as append } from "./disclose-version-CpEJO7r1.js";
import { r as getSelectedNetworkConfig, t as getClient } from "./client-BTFoHz6u.js";
import { n as getObjectLink, t as getAddressLink } from "./explorer-links-hyzWVZGi.js";
import { i as TransactionView, y as router } from "./index-NW8u69Uc.js";
import { t as fetchRecentTransactions } from "./fetchTransactions-D9XVVz7p.js";
//#region src/lib/pages/txs-visualizer/TxsVisualizer.svelte
var root = from_html(`<div class="loading">Loading initial transactions...</div>`);
var root_1 = from_html(`<div class="error"> </div>`);
var root_2 = from_html(`<div class="empty">No transactions found.</div>`);
var root_3 = from_html(`<div class="common-call svelte-knun4w"><span class="call-icon svelte-knun4w">⤷</span> <a target="_blank" rel="noopener noreferrer" class="common-call-link svelte-knun4w"> </a> <span class="call-count svelte-knun4w"> </span></div>`);
var root_4 = from_html(`<button class="tx-dot svelte-knun4w"></button>`);
var root_5 = from_html(`<div class="timeline-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><a target="_blank" rel="noopener noreferrer" class="address-link svelte-knun4w"> </a> <span class="tx-count svelte-knun4w"> </span></div> <!></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_6 = from_html(`<div class="timeline-row other-txs-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><a target="_blank" rel="noopener noreferrer" class="address-link other-txs-label svelte-knun4w"> </a> <span class="tx-count svelte-knun4w"> </span></div></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_7 = from_html(`<div class="timeline-row other-txs-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><span class="address-link other-txs-label svelte-knun4w">Other Txs</span> <span class="tx-count svelte-knun4w"> </span></div></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_8 = from_html(`<div class="visualizer-container card svelte-knun4w"><p class="visualizer-desc svelte-knun4w">Addresses with ≥2 transactions are shown as individual rows — the move call invoked
                most often as the first command is listed below the address. <br/> Single-tx
                senders are grouped by their first move call (independent of address), or collected
                under <em>Other Txs</em> if no move call is involved.</p> <div class="timeline-header svelte-knun4w"><div class="address-col svelte-knun4w">Sender/first fn call</div> <div class="timeline-col svelte-knun4w"><span class="time-label start svelte-knun4w"> </span> <span class="time-label mid-1 svelte-knun4w"> </span> <span class="time-label mid-2 svelte-knun4w"> </span> <span class="time-label end svelte-knun4w"> </span></div></div> <div class="timeline-body"><!> <!> <!></div></div>`);
var root_9 = from_html(`<a target="_blank" rel="noopener noreferrer" class="fn-link pkg-link svelte-knun4w"> </a>`);
var root_10 = from_html(`<tr><td class="col-count svelte-knun4w"> </td><td class="col-fn svelte-knun4w"><div class="fn-cell svelte-knun4w"><div class="fn-pkg-part svelte-knun4w"><!></div> <a target="_blank" rel="noopener noreferrer" class="fn-link fn-label svelte-knun4w"> </a></div></td></tr>`);
var root_11 = from_html(`<div class="move-calls-table card svelte-knun4w"><h2 class="table-title svelte-knun4w">Move Function Calls</h2> <div class="fn-table-scroll svelte-knun4w"><table class="fn-table svelte-knun4w"><thead class="svelte-knun4w"><tr class="svelte-knun4w"><th class="col-count svelte-knun4w">Count</th><th class="col-fn svelte-knun4w">Function</th></tr></thead><tbody class="svelte-knun4w"></tbody></table></div></div>`);
var root_12 = from_html(`<div class="modal-overlay svelte-knun4w" role="button" tabindex="0"><div class="modal-content svelte-knun4w" role="dialog" tabindex="-1"><!></div></div>`);
var root_13 = from_html(`<div class="page-container svelte-knun4w"><div class="header svelte-knun4w"><h1>Transactions Visualizer</h1> <p class="subtitle svelte-knun4w">Real-time visualization of programmable transaction blocks</p></div> <div class="controls card svelte-knun4w"><div class="control-group svelte-knun4w"><button> </button> <div class="direction-toggle svelte-knun4w"><button>Future (Newer)</button> <button>Past (Older)</button></div> <button class="btn btn-outline svelte-knun4w" title="Clear and jump to latest">Reset</button></div> <div class="stats-group svelte-knun4w"><div class="stat-row svelte-knun4w"><span class="stat-label svelte-knun4w">PTBs/sec:</span> <span class="stat-value svelte-knun4w"> </span></div> <div class="legend svelte-knun4w"><span class="legend-item svelte-knun4w"><span class="dot highlight svelte-knun4w"></span> Txs with most common contract call</span> <span class="legend-item svelte-knun4w"><span class="dot base svelte-knun4w"></span> Other transactions</span></div></div> <div class="control-group svelte-knun4w"><label>Max Txs: <input type="number" step="100" class="input-small svelte-knun4w"/> <span class="tx-current-count svelte-knun4w"> </span></label> <label>Interval (ms): <input type="number" min="500" step="500" class="input-small svelte-knun4w"/></label></div></div> <!> <!> <!></div>`);
function TxsVisualizer($$anchor, $$props) {
	push($$props, true);
	let transactions = state(proxy([]));
	let isPolling = state(true);
	let timeDirection = state("future");
	let limit = state(2e3);
	let pollingInterval = state(1e3);
	let loading = state(false);
	let error = state("");
	let selectedTransaction = state(null);
	let showTransactionPopup = state(false);
	let pollTimer = null;
	let destroyed = false;
	const VIZ_ROUTE = "/txs-visualizer";
	let isOnRoute = user_derived(() => router.location === VIZ_ROUTE);
	user_effect(() => {
		if (!get(isOnRoute)) {
			if (pollTimer) {
				clearTimeout(pollTimer);
				pollTimer = null;
			}
		} else if (get(isPolling) && get(transactions).length > 0 && !pollTimer) poll();
	});
	let sortedTransactions = user_derived(() => [...get(transactions)].sort((a, b) => parseInt(a.timestamp || "0") - parseInt(b.timestamp || "0")));
	let txsBySender = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const tx of get(sortedTransactions)) {
			if (!map.has(tx.sender)) map.set(tx.sender, []);
			map.get(tx.sender).push(tx);
		}
		return map;
	});
	let addresses = user_derived(() => [...get(txsBySender).keys()].sort((a, b) => (get(txsBySender).get(b)?.length ?? 0) - (get(txsBySender).get(a)?.length ?? 0)));
	let multiTxAddresses = user_derived(() => get(addresses).filter((addr) => (get(txsBySender).get(addr)?.length || 0) > 1));
	let singleTxAddresses = user_derived(() => get(addresses).filter((addr) => (get(txsBySender).get(addr)?.length || 0) === 1));
	let singleTxs = user_derived(() => get(singleTxAddresses).flatMap((addr) => get(txsBySender).get(addr) || []));
	let multiTxCommonCalls = user_derived(() => {
		const result = /* @__PURE__ */ new Map();
		for (const addr of get(multiTxAddresses)) {
			const txs = get(txsBySender).get(addr) || [];
			const counts = /* @__PURE__ */ new Map();
			for (const tx of txs) {
				const txData = tx.rawData?.transaction?.data?.transaction;
				if (txData) {
					const commands = txData.transactions || txData.commands;
					if (commands && Array.isArray(commands)) for (const cmd of commands) {
						const moveCall = cmd.MoveCall || cmd.moveCall;
						if (moveCall) {
							const pkg = moveCall.package;
							const module = moveCall.module;
							const func = moveCall.function;
							const fullCallName = `${pkg}::${module}::${func}`;
							const displayLabel = `${module}::${func}`;
							const current = counts.get(fullCallName) || {
								count: 0,
								pkg,
								label: displayLabel,
								fullCallName
							};
							current.count++;
							counts.set(fullCallName, current);
							break;
						}
					}
				}
			}
			if (counts.size > 0) {
				const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
				result.set(addr, sorted[0]);
			} else result.set(addr, null);
		}
		return result;
	});
	let otherTxsByMoveCall = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		const noMoveCall = [];
		for (const tx of get(singleTxs)) {
			let hasMoveCall = false;
			const txData = tx.rawData?.transaction?.data?.transaction;
			if (txData) {
				const commands = txData.transactions || txData.commands;
				if (commands && Array.isArray(commands)) for (const cmd of commands) {
					const moveCall = cmd.MoveCall || cmd.moveCall;
					if (moveCall) {
						const pkg = moveCall.package;
						const module = moveCall.module;
						const func = moveCall.function;
						const fullCallName = `${pkg}::${module}::${func}`;
						const displayLabel = `${module}::${func}`;
						if (!map.has(fullCallName)) map.set(fullCallName, {
							txs: [],
							pkg,
							label: displayLabel
						});
						map.get(fullCallName).txs.push(tx);
						hasMoveCall = true;
						break;
					}
				}
			}
			if (!hasMoveCall) noMoveCall.push(tx);
		}
		return {
			withMoveCall: Array.from(map.entries()).sort((a, b) => b[1].txs.length - a[1].txs.length),
			noMoveCall
		};
	});
	let moveFunctionCounts = user_derived(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const tx of get(sortedTransactions)) {
			const txData = tx.rawData?.transaction?.data?.transaction;
			if (txData) {
				const commands = txData.transactions || txData.commands;
				if (commands && Array.isArray(commands)) for (const cmd of commands) {
					const moveCall = cmd.MoveCall || cmd.moveCall;
					if (moveCall) {
						const pkg = moveCall.package;
						const module = moveCall.module;
						const func = moveCall.function;
						const fullCallName = `${pkg}::${module}::${func}`;
						const label = `${module}::${func}`;
						const current = counts.get(fullCallName) || {
							pkg,
							module,
							func,
							label,
							fullCallName,
							count: 0
						};
						current.count++;
						counts.set(fullCallName, current);
					}
				}
			}
		}
		return Array.from(counts.values()).sort((a, b) => b.count - a.count);
	});
	let moveFunctionGroups = user_derived(() => {
		const pkgMap = /* @__PURE__ */ new Map();
		for (const entry of get(moveFunctionCounts)) {
			if (!pkgMap.has(entry.pkg)) pkgMap.set(entry.pkg, {
				pkg: entry.pkg,
				totalCount: 0,
				fns: []
			});
			const group = pkgMap.get(entry.pkg);
			group.totalCount += entry.count;
			group.fns.push(entry);
		}
		const sorted = Array.from(pkgMap.values()).sort((a, b) => b.totalCount - a.totalCount);
		let rank = 1;
		for (const group of sorted) for (const fn of group.fns) fn.rank = rank++;
		return sorted;
	});
	let firstMoveCallByDigest = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const tx of get(sortedTransactions)) {
			const txData = tx.rawData?.transaction?.data?.transaction;
			if (txData) {
				const commands = txData.transactions || txData.commands;
				if (commands && Array.isArray(commands)) for (const cmd of commands) {
					const moveCall = cmd.MoveCall || cmd.moveCall;
					if (moveCall) {
						map.set(tx.digest, `${moveCall.package}::${moveCall.module}::${moveCall.function}`);
						break;
					}
				}
			}
		}
		return map;
	});
	let networkConfig = user_derived(getSelectedNetworkConfig);
	let minTime = user_derived(() => {
		if (get(sortedTransactions).length === 0) return 0;
		let min = parseInt(get(sortedTransactions)[0].timestamp || "0");
		for (let i = 1; i < get(sortedTransactions).length; i++) {
			const t = parseInt(get(sortedTransactions)[i].timestamp || "0");
			if (t < min) min = t;
		}
		return min;
	});
	let maxTime = user_derived(() => {
		if (get(sortedTransactions).length === 0) return 0;
		let max = parseInt(get(sortedTransactions)[0].timestamp || "0");
		for (let i = 1; i < get(sortedTransactions).length; i++) {
			const t = parseInt(get(sortedTransactions)[i].timestamp || "0");
			if (t > max) max = t;
		}
		return max;
	});
	let timeRange = user_derived(() => get(maxTime) - get(minTime) || 1);
	let dotDataByDigest = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		const inv = 100 / get(timeRange);
		for (const address of get(multiTxAddresses)) {
			const commonCall = get(multiTxCommonCalls).get(address)?.fullCallName;
			for (const tx of get(txsBySender).get(address) || []) {
				const left = (parseInt(tx.timestamp || "0") - get(minTime)) * inv;
				const color = get(firstMoveCallByDigest).get(tx.digest) === commonCall ? COLOR_HIGHLIGHT : COLOR_BASE;
				map.set(tx.digest, {
					left,
					color
				});
			}
		}
		for (const [, data] of get(otherTxsByMoveCall).withMoveCall) for (const tx of data.txs) {
			const left = (parseInt(tx.timestamp || "0") - get(minTime)) * inv;
			map.set(tx.digest, {
				left,
				color: COLOR_HIGHLIGHT
			});
		}
		for (const tx of get(otherTxsByMoveCall).noMoveCall) {
			const left = (parseInt(tx.timestamp || "0") - get(minTime)) * inv;
			map.set(tx.digest, {
				left,
				color: COLOR_BASE
			});
		}
		return map;
	});
	let ptbsPerSecond = user_derived(() => {
		if (get(sortedTransactions).length < 2 || get(timeRange) === 0) return 0;
		const seconds = get(timeRange) / 1e3;
		return (get(sortedTransactions).length / seconds).toFixed(2);
	});
	async function fetchInitial() {
		set(loading, true);
		set(error, "");
		try {
			const result = await fetchRecentTransactions({
				limit: 50,
				orderBy: "newest"
			});
			set(transactions, result.txs, true);
		} catch (e) {
			set(error, e.message || "Failed to fetch transactions", true);
		} finally {
			set(loading, false);
		}
	}
	async function poll() {
		if (destroyed || !get(isOnRoute) || !get(isPolling) || get(transactions).length === 0) return;
		try {
			let result;
			if (get(timeDirection) === "future") {
				result = await fetchRecentTransactions({
					limit: 50,
					orderBy: "newest",
					afterCheckpoint: Math.max(...get(transactions).map((tx) => tx.checkpoint)).toString()
				});
				if (result.txs.length > 0) {
					const seen = new Set(get(transactions).map((tx) => tx.digest));
					const fresh = result.txs.filter((tx) => !seen.has(tx.digest));
					if (fresh.length > 0) set(transactions, [...get(transactions), ...fresh].slice(-get(limit)), true);
				}
			} else {
				result = await fetchRecentTransactions({
					limit: 50,
					orderBy: "newest",
					beforeCheckpoint: Math.min(...get(transactions).map((tx) => tx.checkpoint)).toString()
				});
				if (result.txs.length > 0) {
					const seen = new Set(get(transactions).map((tx) => tx.digest));
					const fresh = result.txs.filter((tx) => !seen.has(tx.digest));
					if (fresh.length > 0) set(transactions, [...fresh, ...get(transactions)].slice(0, get(limit)), true);
				}
			}
		} catch (e) {
			console.error("Polling error:", e);
		}
		if (!destroyed && get(isOnRoute) && get(isPolling)) pollTimer = setTimeout(poll, get(pollingInterval));
	}
	function togglePolling() {
		set(isPolling, !get(isPolling));
		if (get(isPolling)) poll();
		else if (pollTimer) {
			clearTimeout(pollTimer);
			pollTimer = null;
		}
	}
	function setDirection(dir) {
		set(timeDirection, dir, true);
	}
	async function openTransaction(tx) {
		set(selectedTransaction, tx.rawData, true);
		set(showTransactionPopup, true);
		try {
			const fullTx = await getClient().getTransactionBlock({
				digest: tx.digest,
				options: {
					showInput: true,
					showRawInput: true,
					showEffects: true,
					showEvents: true,
					showObjectChanges: true,
					showBalanceChanges: true
				}
			});
			if (get(showTransactionPopup) && get(selectedTransaction)?.digest === tx.digest) set(selectedTransaction, fullTx, true);
		} catch (e) {
			console.error("Failed to load full transaction:", e);
		}
	}
	function closeTransactionPopup() {
		set(showTransactionPopup, false);
		set(selectedTransaction, null);
	}
	onMount(() => {
		fetchInitial().then(() => {
			if (get(isPolling)) pollTimer = setTimeout(poll, get(pollingInterval));
		});
	});
	onDestroy(() => {
		destroyed = true;
		if (pollTimer) {
			clearTimeout(pollTimer);
			pollTimer = null;
		}
	});
	function formatTime(timestamp) {
		return new Date(parseInt(timestamp)).toLocaleTimeString();
	}
	async function reset$1() {
		set(loading, true);
		set(timeDirection, "future");
		try {
			const result = await fetchRecentTransactions({
				limit: 50,
				orderBy: "newest"
			});
			set(transactions, result.txs, true);
		} catch (e) {
			set(error, e.message || "Failed to reset", true);
		} finally {
			set(loading, false);
		}
	}
	const COLOR_BASE = "#3b82f6";
	const COLOR_HIGHLIGHT = "#bfdbfe";
	var div = root_13();
	var div_1 = sibling(child(div), 2);
	var div_2 = child(div_1);
	var button = child(div_2);
	var text = child(button, true);
	reset(button);
	var div_3 = sibling(button, 2);
	var button_1 = child(div_3);
	var button_2 = sibling(button_1, 2);
	reset(div_3);
	var button_3 = sibling(div_3, 2);
	reset(div_2);
	var div_4 = sibling(div_2, 2);
	var div_5 = child(div_4);
	var span = sibling(child(div_5), 2);
	var text_1 = child(span, true);
	reset(span);
	reset(div_5);
	next(2);
	reset(div_4);
	var div_6 = sibling(div_4, 2);
	var label_1 = child(div_6);
	var input = sibling(child(label_1));
	remove_input_defaults(input);
	var span_1 = sibling(input, 2);
	var text_2 = child(span_1);
	reset(span_1);
	reset(label_1);
	var label_2 = sibling(label_1, 2);
	var input_1 = sibling(child(label_2));
	remove_input_defaults(input_1);
	reset(label_2);
	reset(div_6);
	reset(div_1);
	var node = sibling(div_1, 2);
	var consequent = ($$anchor) => {
		append($$anchor, root());
	};
	var consequent_1 = ($$anchor) => {
		var div_8 = root_1();
		var text_3 = child(div_8, true);
		reset(div_8);
		template_effect(() => set_text(text_3, get(error)));
		append($$anchor, div_8);
	};
	var consequent_2 = ($$anchor) => {
		append($$anchor, root_2());
	};
	var alternate = ($$anchor) => {
		var div_10 = root_8();
		var div_11 = sibling(child(div_10), 2);
		var div_12 = sibling(child(div_11), 2);
		var span_2 = child(div_12);
		var text_4 = child(span_2, true);
		reset(span_2);
		var span_3 = sibling(span_2, 2);
		var text_5 = child(span_3, true);
		reset(span_3);
		var span_4 = sibling(span_3, 2);
		var text_6 = child(span_4, true);
		reset(span_4);
		var span_5 = sibling(span_4, 2);
		var text_7 = child(span_5, true);
		reset(span_5);
		reset(div_12);
		reset(div_11);
		var div_13 = sibling(div_11, 2);
		var node_1 = child(div_13);
		each(node_1, 16, () => get(multiTxAddresses), (address) => address, ($$anchor, address) => {
			var div_14 = root_5();
			var div_15 = child(div_14);
			var div_16 = child(div_15);
			var a_1 = child(div_16);
			var text_8 = child(a_1);
			reset(a_1);
			var span_6 = sibling(a_1, 2);
			var text_9 = child(span_6);
			reset(span_6);
			reset(div_16);
			var node_2 = sibling(div_16, 2);
			var consequent_3 = ($$anchor) => {
				var div_17 = root_3();
				var a_2 = sibling(child(div_17), 2);
				set_style(a_2, "color: #bfdbfe");
				var text_10 = child(a_2, true);
				reset(a_2);
				var span_7 = sibling(a_2, 2);
				var text_11 = child(span_7);
				reset(span_7);
				reset(div_17);
				template_effect(($0, $1, $2) => {
					set_attribute(a_2, "href", $0);
					set_text(text_10, $1);
					set_text(text_11, `(${$2 ?? ""})`);
				}, [
					() => getObjectLink(get(networkConfig), get(multiTxCommonCalls).get(address).pkg),
					() => get(multiTxCommonCalls).get(address).label,
					() => get(multiTxCommonCalls).get(address).count
				]);
				append($$anchor, div_17);
			};
			var d_1 = user_derived(() => get(multiTxCommonCalls).get(address));
			if_block(node_2, ($$render) => {
				if (get(d_1)) $$render(consequent_3);
			});
			reset(div_15);
			var div_18 = sibling(div_15, 2);
			each(sibling(child(div_18), 2), 17, () => get(txsBySender).get(address) || [], (tx) => tx.digest, ($$anchor, tx) => {
				const d = user_derived(() => get(dotDataByDigest).get(get(tx).digest));
				var button_4 = root_4();
				template_effect(($0) => {
					set_style(button_4, `left: ${get(d)?.left ?? 0 ?? ""}%; background-color: ${get(d)?.color ?? COLOR_BASE ?? ""}`);
					set_attribute(button_4, "title", `Tx: ${get(tx).digest ?? ""} Time: ${$0 ?? ""}`);
					set_attribute(button_4, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
				}, [() => formatTime(get(tx).timestamp || "0")]);
				delegated("click", button_4, () => openTransaction(get(tx)));
				append($$anchor, button_4);
			});
			reset(div_18);
			reset(div_14);
			template_effect(($0, $1, $2, $3) => {
				set_attribute(a_1, "href", $0);
				set_attribute(a_1, "title", address);
				set_text(text_8, `${$1 ?? ""}...${$2 ?? ""}`);
				set_text(text_9, `(${$3 ?? ""})`);
			}, [
				() => getAddressLink(get(networkConfig), address),
				() => address.slice(0, 6),
				() => address.slice(-4),
				() => get(txsBySender).get(address)?.length || 0
			]);
			append($$anchor, div_14);
		});
		var node_4 = sibling(node_1, 2);
		each(node_4, 17, () => get(otherTxsByMoveCall).withMoveCall, ([fullCall, data]) => fullCall, ($$anchor, $$item) => {
			var $$array = user_derived(() => to_array(get($$item), 2));
			let fullCall = () => get($$array)[0];
			let data = () => get($$array)[1];
			var div_19 = root_6();
			var div_20 = child(div_19);
			var div_21 = child(div_20);
			var a_3 = child(div_21);
			set_style(a_3, "color: #bfdbfe");
			var text_12 = child(a_3, true);
			reset(a_3);
			var span_8 = sibling(a_3, 2);
			var text_13 = child(span_8);
			reset(span_8);
			reset(div_21);
			reset(div_20);
			var div_22 = sibling(div_20, 2);
			each(sibling(child(div_22), 2), 17, () => data().txs, (tx) => tx.digest, ($$anchor, tx) => {
				const d = user_derived(() => get(dotDataByDigest).get(get(tx).digest));
				var button_5 = root_4();
				template_effect(($0) => {
					set_style(button_5, `left: ${get(d)?.left ?? 0 ?? ""}%; background-color: ${get(d)?.color ?? COLOR_HIGHLIGHT ?? ""}`);
					set_attribute(button_5, "title", `Sender: ${get(tx).sender ?? ""} Tx: ${get(tx).digest ?? ""} Time: ${$0 ?? ""}`);
					set_attribute(button_5, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
				}, [() => formatTime(get(tx).timestamp || "0")]);
				delegated("click", button_5, () => openTransaction(get(tx)));
				append($$anchor, button_5);
			});
			reset(div_22);
			reset(div_19);
			template_effect(($0) => {
				set_attribute(a_3, "href", $0);
				set_attribute(a_3, "title", fullCall());
				set_text(text_12, data().label);
				set_text(text_13, `(${data().txs.length ?? ""})`);
			}, [() => getObjectLink(get(networkConfig), data().pkg)]);
			append($$anchor, div_19);
		});
		var node_6 = sibling(node_4, 2);
		var consequent_4 = ($$anchor) => {
			var div_23 = root_7();
			var div_24 = child(div_23);
			var div_25 = child(div_24);
			var span_9 = sibling(child(div_25), 2);
			var text_14 = child(span_9);
			reset(span_9);
			reset(div_25);
			reset(div_24);
			var div_26 = sibling(div_24, 2);
			each(sibling(child(div_26), 2), 17, () => get(otherTxsByMoveCall).noMoveCall, (tx) => tx.digest, ($$anchor, tx) => {
				const d = user_derived(() => get(dotDataByDigest).get(get(tx).digest));
				var button_6 = root_4();
				template_effect(($0) => {
					set_style(button_6, `left: ${get(d)?.left ?? 0 ?? ""}%; background-color: ${get(d)?.color ?? COLOR_BASE ?? ""}`);
					set_attribute(button_6, "title", `Sender: ${get(tx).sender ?? ""} Tx: ${get(tx).digest ?? ""} Time: ${$0 ?? ""}`);
					set_attribute(button_6, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
				}, [() => formatTime(get(tx).timestamp || "0")]);
				delegated("click", button_6, () => openTransaction(get(tx)));
				append($$anchor, button_6);
			});
			reset(div_26);
			reset(div_23);
			template_effect(() => set_text(text_14, `(${get(otherTxsByMoveCall).noMoveCall.length ?? ""})`));
			append($$anchor, div_23);
		};
		if_block(node_6, ($$render) => {
			if (get(otherTxsByMoveCall).noMoveCall.length > 0) $$render(consequent_4);
		});
		reset(div_13);
		reset(div_10);
		template_effect(($0, $1, $2, $3) => {
			set_text(text_4, $0);
			set_text(text_5, $1);
			set_text(text_6, $2);
			set_text(text_7, $3);
		}, [
			() => formatTime(get(minTime).toString()),
			() => formatTime((get(minTime) + get(timeRange) * .33).toString()),
			() => formatTime((get(minTime) + get(timeRange) * .66).toString()),
			() => formatTime(get(maxTime).toString())
		]);
		append($$anchor, div_10);
	};
	if_block(node, ($$render) => {
		if (get(loading) && get(transactions).length === 0) $$render(consequent);
		else if (get(error)) $$render(consequent_1, 1);
		else if (get(transactions).length === 0) $$render(consequent_2, 2);
		else $$render(alternate, -1);
	});
	var node_8 = sibling(node, 2);
	var consequent_6 = ($$anchor) => {
		var div_27 = root_11();
		var div_28 = sibling(child(div_27), 2);
		var table = child(div_28);
		var tbody = sibling(child(table));
		each(tbody, 21, () => get(moveFunctionGroups), index, ($$anchor, group, gi) => {
			var fragment = comment();
			each(first_child(fragment), 17, () => get(group).fns, index, ($$anchor, entry, fi) => {
				var tr = root_10();
				set_class(tr, 1, `fn-row ${gi % 2 === 0 ? "group-even" : "group-odd"}`, "svelte-knun4w");
				var td = child(tr);
				var text_15 = child(td, true);
				reset(td);
				var td_1 = sibling(td);
				var div_29 = child(td_1);
				var div_30 = child(div_29);
				var node_10 = child(div_30);
				var consequent_5 = ($$anchor) => {
					var a_4 = root_9();
					var text_16 = child(a_4);
					reset(a_4);
					template_effect(($0, $1, $2) => {
						set_attribute(a_4, "href", $0);
						set_attribute(a_4, "title", get(entry).pkg);
						set_text(text_16, `${$1 ?? ""}...${$2 ?? ""}::`);
					}, [
						() => getObjectLink(get(networkConfig), get(entry).pkg),
						() => get(entry).pkg.slice(0, 8),
						() => get(entry).pkg.slice(-4)
					]);
					append($$anchor, a_4);
				};
				if_block(node_10, ($$render) => {
					if (fi === 0) $$render(consequent_5);
				});
				reset(div_30);
				var a_5 = sibling(div_30, 2);
				var text_17 = child(a_5);
				reset(a_5);
				reset(div_29);
				reset(td_1);
				reset(tr);
				template_effect(($0) => {
					set_text(text_15, get(entry).count);
					set_attribute(a_5, "href", `${$0 ?? ""}&module=${get(entry).module ?? ""}`);
					set_attribute(a_5, "title", `${get(entry).pkg ?? ""}&module=${get(entry).module ?? ""}`);
					set_text(text_17, `${get(entry).module ?? ""}::${get(entry).func ?? ""}`);
				}, [() => getObjectLink(get(networkConfig), get(entry).pkg)]);
				append($$anchor, tr);
			});
			append($$anchor, fragment);
		});
		reset(tbody);
		reset(table);
		reset(div_28);
		reset(div_27);
		append($$anchor, div_27);
	};
	if_block(node_8, ($$render) => {
		if (get(moveFunctionGroups).length > 0) $$render(consequent_6);
	});
	var node_11 = sibling(node_8, 2);
	var consequent_7 = ($$anchor) => {
		var div_31 = root_12();
		var div_32 = child(div_31);
		TransactionView(child(div_32), {
			showTypeInfo: true,
			shortPackageIds: true,
			get value() {
				return get(selectedTransaction);
			},
			set value($$value) {
				set(selectedTransaction, $$value, true);
			}
		});
		reset(div_32);
		reset(div_31);
		delegated("click", div_31, closeTransactionPopup);
		delegated("keydown", div_31, (e) => e.key === "Escape" && closeTransactionPopup());
		delegated("click", div_32, (e) => e.stopPropagation());
		delegated("keydown", div_32, (e) => e.stopPropagation());
		append($$anchor, div_31);
	};
	if_block(node_11, ($$render) => {
		if (get(showTransactionPopup) && get(selectedTransaction)) $$render(consequent_7);
	});
	reset(div);
	template_effect(() => {
		set_class(button, 1, `btn ${get(isPolling) ? "btn-danger" : "btn-primary"}`, "svelte-knun4w");
		set_text(text, get(isPolling) ? "Pause" : "Resume");
		set_class(button_1, 1, `btn ${get(timeDirection) === "future" ? "btn-active" : "btn-outline"}`, "svelte-knun4w");
		set_class(button_2, 1, `btn ${get(timeDirection) === "past" ? "btn-active" : "btn-outline"}`, "svelte-knun4w");
		set_text(text_1, get(ptbsPerSecond));
		set_text(text_2, `(${get(sortedTransactions).length ?? ""})`);
	});
	delegated("click", button, togglePolling);
	delegated("click", button_1, () => setDirection("future"));
	delegated("click", button_2, () => setDirection("past"));
	delegated("click", button_3, reset$1);
	bind_value(input, () => get(limit), ($$value) => set(limit, $$value));
	bind_value(input_1, () => get(pollingInterval), ($$value) => set(pollingInterval, $$value));
	append($$anchor, div);
	pop();
}
delegate(["click", "keydown"]);
//#endregion
export { TxsVisualizer as default };

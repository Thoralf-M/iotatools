import { p as push, H as state, J as proxy, r as onMount, g as get, W as onDestroy, a as from_html, s as sibling, c as child, d as if_block, t as template_effect, a5 as set_class, h as set_text, R as user_derived, y as bind_value, l as append, n as pop, o as set, Q as comment, P as first_child, D as TransactionView, E as delegate, L as each, N as index, a4 as set_style, e as set_attribute, S as getAddressLink, x as getSelectedNetworkConfig, M as getObjectLink, am as to_array } from "./index-Cc65UiG4.js";
import { f as fetchRecentTransactions } from "./fetchTransactions-DSfwwNuy.js";
var root_1 = from_html(`<div class="loading">Loading initial transactions...</div>`);
var root_3 = from_html(`<div class="error"> </div>`);
var root_5 = from_html(`<div class="empty">No transactions found.</div>`);
var root_8 = from_html(`<div class="common-call svelte-knun4w"><span class="call-icon svelte-knun4w">⤷</span> <a target="_blank" rel="noopener noreferrer" class="common-call-link svelte-knun4w"> </a> <span class="call-count svelte-knun4w"> </span></div>`);
var root_9 = from_html(`<button class="tx-dot svelte-knun4w"></button>`);
var root_7 = from_html(`<div class="timeline-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><a target="_blank" rel="noopener noreferrer" class="address-link svelte-knun4w"> </a> <span class="tx-count svelte-knun4w"> </span></div> <!></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_11 = from_html(`<button class="tx-dot svelte-knun4w"></button>`);
var root_10 = from_html(`<div class="timeline-row other-txs-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><a target="_blank" rel="noopener noreferrer" class="address-link other-txs-label svelte-knun4w"> </a> <span class="tx-count svelte-knun4w"> </span></div></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_13 = from_html(`<button class="tx-dot svelte-knun4w"></button>`);
var root_12 = from_html(`<div class="timeline-row other-txs-row svelte-knun4w"><div class="address-col svelte-knun4w"><div class="address-row-main svelte-knun4w"><span class="address-link other-txs-label svelte-knun4w">Other Txs</span> <span class="tx-count svelte-knun4w"> </span></div></div> <div class="timeline-col svelte-knun4w"><div class="timeline-line svelte-knun4w"></div> <!></div></div>`);
var root_6 = from_html(`<div class="visualizer-container card svelte-knun4w"><div class="timeline-header svelte-knun4w"><div class="address-col svelte-knun4w">Sender/first fn call</div> <div class="timeline-col svelte-knun4w"><span class="time-label start svelte-knun4w"> </span> <span class="time-label mid-1 svelte-knun4w"> </span> <span class="time-label mid-2 svelte-knun4w"> </span> <span class="time-label end svelte-knun4w"> </span></div></div> <div class="timeline-body"><!> <!> <!></div></div>`);
var root_14 = from_html(`<div class="modal-overlay svelte-knun4w" role="button" tabindex="0"><div class="modal-content svelte-knun4w" role="dialog" tabindex="-1"><!></div></div>`);
var root = from_html(`<div class="page-container svelte-knun4w"><div class="header svelte-knun4w"><h1>Transactions Visualizer</h1> <p class="subtitle svelte-knun4w">Real-time visualization of programmable transaction blocks</p></div> <div class="controls card svelte-knun4w"><div class="control-group svelte-knun4w"><button> </button> <div class="direction-toggle svelte-knun4w"><button>Future (Newer)</button> <button>Past (Older)</button></div> <button class="btn btn-outline svelte-knun4w" title="Clear and jump to latest">Reset</button></div> <div class="stats-group svelte-knun4w"><div class="stat-row svelte-knun4w"><span class="stat-label svelte-knun4w">PTBs/sec:</span> <span class="stat-value svelte-knun4w"> </span></div> <div class="legend svelte-knun4w"><span class="legend-item svelte-knun4w"><span class="dot highlight svelte-knun4w"></span> Txs with most common contract call</span> <span class="legend-item svelte-knun4w"><span class="dot base svelte-knun4w"></span> Other transactions</span></div></div> <div class="control-group svelte-knun4w"><label>Max Txs: <input type="number" step="100" class="input-small svelte-knun4w"/></label> <label>Interval (ms): <input type="number" min="500" step="500" class="input-small svelte-knun4w"/></label></div></div> <!> <!></div>`);
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
  let sortedTransactions = user_derived(() => [...get(transactions)].sort((a, b) => parseInt(a.timestamp || "0") - parseInt(b.timestamp || "0")));
  let addresses = user_derived(() => [...new Set(get(sortedTransactions).map((tx) => tx.sender))].sort((a, b) => {
    const countA = get(sortedTransactions).filter((tx) => tx.sender === a).length;
    const countB = get(sortedTransactions).filter((tx) => tx.sender === b).length;
    return countB - countA;
  }));
  let txsBySender = user_derived(() => {
    const map = /* @__PURE__ */ new Map();
    for (const tx of get(sortedTransactions)) {
      if (!map.has(tx.sender)) {
        map.set(tx.sender, []);
      }
      map.get(tx.sender).push(tx);
    }
    return map;
  });
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
          if (commands && Array.isArray(commands)) {
            for (const cmd of commands) {
              const moveCall = cmd.MoveCall || cmd.moveCall;
              if (moveCall) {
                const pkg = moveCall.package;
                const module = moveCall.module;
                const func = moveCall.function;
                const fullCallName = `${pkg}::${module}::${func}`;
                const displayLabel = `${module}::${func}`;
                const current = counts.get(fullCallName) || { count: 0, pkg, label: displayLabel, fullCallName };
                current.count++;
                counts.set(fullCallName, current);
                break;
              }
            }
          }
        }
      }
      if (counts.size > 0) {
        const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
        result.set(addr, sorted[0]);
      } else {
        result.set(addr, null);
      }
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
        if (commands && Array.isArray(commands)) {
          for (const cmd of commands) {
            const moveCall = cmd.MoveCall || cmd.moveCall;
            if (moveCall) {
              const pkg = moveCall.package;
              const module = moveCall.module;
              const func = moveCall.function;
              const fullCallName = `${pkg}::${module}::${func}`;
              const displayLabel = `${module}::${func}`;
              if (!map.has(fullCallName)) {
                map.set(fullCallName, { txs: [], pkg, label: displayLabel });
              }
              map.get(fullCallName).txs.push(tx);
              hasMoveCall = true;
              break;
            }
          }
        }
      }
      if (!hasMoveCall) {
        noMoveCall.push(tx);
      }
    }
    return {
      withMoveCall: Array.from(map.entries()).sort((a, b) => b[1].txs.length - a[1].txs.length),
      noMoveCall
    };
  });
  let minTime = user_derived(() => get(sortedTransactions).length > 0 ? Math.min(...get(sortedTransactions).map((tx) => parseInt(tx.timestamp || "0"))) : 0);
  let maxTime = user_derived(() => get(sortedTransactions).length > 0 ? Math.max(...get(sortedTransactions).map((tx) => parseInt(tx.timestamp || "0"))) : 0);
  let timeRange = user_derived(() => get(maxTime) - get(minTime) || 1);
  let ptbsPerSecond = user_derived(() => {
    if (get(sortedTransactions).length < 2 || get(timeRange) === 0) return 0;
    const seconds = get(timeRange) / 1e3;
    return (get(sortedTransactions).length / seconds).toFixed(2);
  });
  async function fetchInitial() {
    set(loading, true);
    set(error, "");
    try {
      const result = await fetchRecentTransactions({ limit: 50, orderBy: "newest" });
      set(transactions, result.txs, true);
    } catch (e) {
      set(error, e.message || "Failed to fetch transactions", true);
    } finally {
      set(loading, false);
    }
  }
  async function poll() {
    if (!get(isPolling) || get(transactions).length === 0) return;
    try {
      let result;
      if (get(timeDirection) === "future") {
        const newestCheckpoint = Math.max(...get(transactions).map((tx) => tx.checkpoint));
        result = await fetchRecentTransactions({
          limit: 50,
          orderBy: "newest",
          afterCheckpoint: newestCheckpoint.toString()
        });
        if (result.txs.length > 0) {
          set(transactions, [...get(transactions), ...result.txs].slice(-get(limit)), true);
        }
      } else {
        const oldestCheckpoint = Math.min(...get(transactions).map((tx) => tx.checkpoint));
        result = await fetchRecentTransactions({
          limit: 50,
          orderBy: "newest",
          beforeCheckpoint: oldestCheckpoint.toString()
        });
        if (result.txs.length > 0) {
          set(transactions, [...result.txs, ...get(transactions)].slice(0, get(limit)), true);
        }
      }
    } catch (e) {
      console.error("Polling error:", e);
    }
    if (get(isPolling)) {
      pollTimer = setTimeout(poll, get(pollingInterval));
    }
  }
  function togglePolling() {
    set(isPolling, !get(isPolling));
    if (get(isPolling)) {
      poll();
    } else if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
  }
  function setDirection(dir) {
    set(timeDirection, dir, true);
  }
  function openTransaction(tx) {
    set(selectedTransaction, tx.rawData, true);
    set(showTransactionPopup, true);
  }
  function closeTransactionPopup() {
    set(showTransactionPopup, false);
    set(selectedTransaction, null);
  }
  onMount(() => {
    fetchInitial().then(() => {
      if (get(isPolling)) {
        pollTimer = setTimeout(poll, get(pollingInterval));
      }
    });
  });
  onDestroy(() => {
    if (pollTimer) {
      clearTimeout(pollTimer);
    }
  });
  function formatTime(timestamp) {
    return new Date(parseInt(timestamp)).toLocaleTimeString();
  }
  async function reset() {
    set(loading, true);
    set(timeDirection, "future");
    try {
      const result = await fetchRecentTransactions({ limit: 50, orderBy: "newest" });
      set(transactions, result.txs, true);
    } catch (e) {
      set(error, e.message || "Failed to reset", true);
    } finally {
      set(loading, false);
    }
  }
  const COLOR_BASE = "#3b82f6";
  const COLOR_HIGHLIGHT = "#bfdbfe";
  function getFirstMoveCall(tx) {
    const txData = tx.rawData?.transaction?.data?.transaction;
    if (txData) {
      const commands = txData.transactions || txData.commands;
      if (commands && Array.isArray(commands)) {
        for (const cmd of commands) {
          const moveCall = cmd.MoveCall || cmd.moveCall;
          if (moveCall) {
            return `${moveCall.package}::${moveCall.module}::${moveCall.function}`;
          }
        }
      }
    }
    return void 0;
  }
  var div = root();
  var div_1 = sibling(child(div), 2);
  var div_2 = child(div_1);
  var button = child(div_2);
  button.__click = togglePolling;
  var text = child(button);
  var div_3 = sibling(button, 2);
  var button_1 = child(div_3);
  button_1.__click = () => setDirection("future");
  var button_2 = sibling(button_1, 2);
  button_2.__click = () => setDirection("past");
  var button_3 = sibling(div_3, 2);
  button_3.__click = reset;
  var div_4 = sibling(div_2, 2);
  var div_5 = child(div_4);
  var span = sibling(child(div_5), 2);
  var text_1 = child(span);
  var div_6 = sibling(div_4, 2);
  var label = child(div_6);
  var input = sibling(child(label));
  var label_1 = sibling(label, 2);
  var input_1 = sibling(child(label_1));
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_7 = root_1();
      append($$anchor2, div_7);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment = comment();
      var node_1 = first_child(fragment);
      {
        var consequent_1 = ($$anchor3) => {
          var div_8 = root_3();
          var text_2 = child(div_8);
          template_effect(() => set_text(text_2, get(error)));
          append($$anchor3, div_8);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_2 = first_child(fragment_1);
          {
            var consequent_2 = ($$anchor4) => {
              var div_9 = root_5();
              append($$anchor4, div_9);
            };
            var alternate = ($$anchor4) => {
              var div_10 = root_6();
              var div_11 = child(div_10);
              var div_12 = sibling(child(div_11), 2);
              var span_1 = child(div_12);
              var text_3 = child(span_1);
              var span_2 = sibling(span_1, 2);
              var text_4 = child(span_2);
              var span_3 = sibling(span_2, 2);
              var text_5 = child(span_3);
              var span_4 = sibling(span_3, 2);
              var text_6 = child(span_4);
              var div_13 = sibling(div_11, 2);
              var node_3 = child(div_13);
              each(node_3, 17, () => get(multiTxAddresses), index, ($$anchor5, address) => {
                var div_14 = root_7();
                var div_15 = child(div_14);
                var div_16 = child(div_15);
                var a_1 = child(div_16);
                var text_7 = child(a_1);
                var span_5 = sibling(a_1, 2);
                var text_8 = child(span_5);
                var node_4 = sibling(div_16, 2);
                {
                  var consequent_3 = ($$anchor6) => {
                    var div_17 = root_8();
                    var a_2 = sibling(child(div_17), 2);
                    set_style(a_2, "color: #bfdbfe");
                    var text_9 = child(a_2);
                    var span_6 = sibling(a_2, 2);
                    var text_10 = child(span_6);
                    template_effect(
                      ($0, $1, $2) => {
                        set_attribute(a_2, "href", $0);
                        set_text(text_9, $1);
                        set_text(text_10, `(${$2 ?? ""})`);
                      },
                      [
                        () => getObjectLink(getSelectedNetworkConfig(), get(multiTxCommonCalls).get(get(address)).pkg),
                        () => get(multiTxCommonCalls).get(get(address)).label,
                        () => get(multiTxCommonCalls).get(get(address)).count
                      ]
                    );
                    append($$anchor6, div_17);
                  };
                  if_block(node_4, ($$render) => {
                    if (get(multiTxCommonCalls).get(get(address))) $$render(consequent_3);
                  });
                }
                var div_18 = sibling(div_15, 2);
                var node_5 = sibling(child(div_18), 2);
                each(node_5, 17, () => get(txsBySender).get(get(address)) || [], index, ($$anchor6, tx) => {
                  var button_4 = root_9();
                  button_4.__click = () => openTransaction(get(tx));
                  template_effect(
                    ($0, $1, $2) => {
                      set_style(button_4, `left: ${$0 ?? ""}%; background-color: ${$1 ?? ""}`);
                      set_attribute(button_4, "title", `Tx: ${get(tx).digest ?? ""} Time: ${$2 ?? ""}`);
                      set_attribute(button_4, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
                    },
                    [
                      () => (parseInt(get(tx).timestamp || "0") - get(minTime)) / get(timeRange) * 100,
                      () => getFirstMoveCall(get(tx)) === get(multiTxCommonCalls).get(get(address))?.fullCallName ? COLOR_HIGHLIGHT : COLOR_BASE,
                      () => formatTime(get(tx).timestamp || "0")
                    ]
                  );
                  append($$anchor6, button_4);
                });
                template_effect(
                  ($0, $1, $2, $3) => {
                    set_attribute(a_1, "href", $0);
                    set_attribute(a_1, "title", get(address));
                    set_text(text_7, `${$1 ?? ""}...${$2 ?? ""}`);
                    set_text(text_8, `(${$3 ?? ""})`);
                  },
                  [
                    () => getAddressLink(getSelectedNetworkConfig(), get(address)),
                    () => get(address).slice(0, 6),
                    () => get(address).slice(-4),
                    () => get(txsBySender).get(get(address))?.length || 0
                  ]
                );
                append($$anchor5, div_14);
              });
              var node_6 = sibling(node_3, 2);
              each(node_6, 17, () => get(otherTxsByMoveCall).withMoveCall, index, ($$anchor5, $$item) => {
                var $$array = user_derived(() => to_array(get($$item), 2));
                let fullCall = () => get($$array)[0];
                let data = () => get($$array)[1];
                var div_19 = root_10();
                var div_20 = child(div_19);
                var div_21 = child(div_20);
                var a_3 = child(div_21);
                set_style(a_3, "color: #bfdbfe");
                var text_11 = child(a_3);
                var span_7 = sibling(a_3, 2);
                var text_12 = child(span_7);
                var div_22 = sibling(div_20, 2);
                var node_7 = sibling(child(div_22), 2);
                each(node_7, 17, () => data().txs, index, ($$anchor6, tx) => {
                  var button_5 = root_11();
                  button_5.__click = () => openTransaction(get(tx));
                  template_effect(
                    ($0, $1) => {
                      set_style(button_5, `left: ${$0 ?? ""}%; background-color: #bfdbfe`);
                      set_attribute(button_5, "title", `Sender: ${get(tx).sender ?? ""} Tx: ${get(tx).digest ?? ""} Time: ${$1 ?? ""}`);
                      set_attribute(button_5, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
                    },
                    [
                      () => (parseInt(get(tx).timestamp || "0") - get(minTime)) / get(timeRange) * 100,
                      () => formatTime(get(tx).timestamp || "0")
                    ]
                  );
                  append($$anchor6, button_5);
                });
                template_effect(
                  ($0) => {
                    set_attribute(a_3, "href", $0);
                    set_attribute(a_3, "title", fullCall());
                    set_text(text_11, data().label);
                    set_text(text_12, `(${data().txs.length ?? ""})`);
                  },
                  [() => getObjectLink(getSelectedNetworkConfig(), data().pkg)]
                );
                append($$anchor5, div_19);
              });
              var node_8 = sibling(node_6, 2);
              {
                var consequent_4 = ($$anchor5) => {
                  var div_23 = root_12();
                  var div_24 = child(div_23);
                  var div_25 = child(div_24);
                  var span_8 = sibling(child(div_25), 2);
                  var text_13 = child(span_8);
                  var div_26 = sibling(div_24, 2);
                  var node_9 = sibling(child(div_26), 2);
                  each(node_9, 17, () => get(otherTxsByMoveCall).noMoveCall, index, ($$anchor6, tx) => {
                    var button_6 = root_13();
                    button_6.__click = () => openTransaction(get(tx));
                    template_effect(
                      ($0, $1) => {
                        set_style(button_6, `left: ${$0 ?? ""}%; background-color: #3b82f6`);
                        set_attribute(button_6, "title", `Sender: ${get(tx).sender ?? ""} Tx: ${get(tx).digest ?? ""} Time: ${$1 ?? ""}`);
                        set_attribute(button_6, "aria-label", `View transaction ${get(tx).digest ?? ""}`);
                      },
                      [
                        () => (parseInt(get(tx).timestamp || "0") - get(minTime)) / get(timeRange) * 100,
                        () => formatTime(get(tx).timestamp || "0")
                      ]
                    );
                    append($$anchor6, button_6);
                  });
                  template_effect(() => set_text(text_13, `(${get(otherTxsByMoveCall).noMoveCall.length ?? ""})`));
                  append($$anchor5, div_23);
                };
                if_block(node_8, ($$render) => {
                  if (get(otherTxsByMoveCall).noMoveCall.length > 0) $$render(consequent_4);
                });
              }
              template_effect(
                ($0, $1, $2, $3) => {
                  set_text(text_3, $0);
                  set_text(text_4, $1);
                  set_text(text_5, $2);
                  set_text(text_6, $3);
                },
                [
                  () => formatTime(get(minTime).toString()),
                  () => formatTime((get(minTime) + get(timeRange) * 0.33).toString()),
                  () => formatTime((get(minTime) + get(timeRange) * 0.66).toString()),
                  () => formatTime(get(maxTime).toString())
                ]
              );
              append($$anchor4, div_10);
            };
            if_block(
              node_2,
              ($$render) => {
                if (get(transactions).length === 0) $$render(consequent_2);
                else $$render(alternate, false);
              },
              true
            );
          }
          append($$anchor3, fragment_1);
        };
        if_block(
          node_1,
          ($$render) => {
            if (get(error)) $$render(consequent_1);
            else $$render(alternate_1, false);
          },
          true
        );
      }
      append($$anchor2, fragment);
    };
    if_block(node, ($$render) => {
      if (get(loading) && get(transactions).length === 0) $$render(consequent);
      else $$render(alternate_2, false);
    });
  }
  var node_10 = sibling(node, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_27 = root_14();
      div_27.__click = closeTransactionPopup;
      div_27.__keydown = (e) => e.key === "Escape" && closeTransactionPopup();
      var div_28 = child(div_27);
      div_28.__click = (e) => e.stopPropagation();
      div_28.__keydown = (e) => e.stopPropagation();
      var node_11 = child(div_28);
      TransactionView(node_11, {
        showTypeInfo: true,
        shortPackageIds: true,
        get value() {
          return get(selectedTransaction);
        },
        set value($$value) {
          set(selectedTransaction, $$value, true);
        }
      });
      append($$anchor2, div_27);
    };
    if_block(node_10, ($$render) => {
      if (get(showTransactionPopup) && get(selectedTransaction)) $$render(consequent_5);
    });
  }
  template_effect(() => {
    set_class(button, 1, `btn ${get(isPolling) ? "btn-danger" : "btn-primary"}`, "svelte-knun4w");
    set_text(text, get(isPolling) ? "Pause" : "Resume");
    set_class(button_1, 1, `btn ${get(timeDirection) === "future" ? "btn-active" : "btn-outline"}`, "svelte-knun4w");
    set_class(button_2, 1, `btn ${get(timeDirection) === "past" ? "btn-active" : "btn-outline"}`, "svelte-knun4w");
    set_text(text_1, get(ptbsPerSecond));
  });
  bind_value(input, () => get(limit), ($$value) => set(limit, $$value));
  bind_value(input_1, () => get(pollingInterval), ($$value) => set(pollingInterval, $$value));
  append($$anchor, div);
  pop();
}
delegate(["click", "keydown"]);
export {
  TxsVisualizer as default
};

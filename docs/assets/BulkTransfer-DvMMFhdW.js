import { p as push, w as legacy_pre_effect, g as get, m as mutable_source, j as set, y as legacy_pre_effect_reset, i as init, f as from_html, s as sibling, c as child, S as store_get, b as if_block, C as untrack, t as template_effect, d as set_text, L as set_class, E as bind_value, k as append, l as pop, V as setup_stores, ac as activeAddress, W as isValidIotaAddress, z as each, A as index, n as getClient, af as Transaction, _ as delegate } from "/iota-utils/assets/index-DO6RiV5i.js";
import { b as set_selected } from "/iota-utils/assets/attributes-BvErTupq.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-BRXZfE64.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-DZn2OWEK.js";
import "/iota-utils/assets/transaction-view-CaEnEf4i.js";
import "/iota-utils/assets/iota-nano-conversion-xNveUTFB.js";
const fetchAvailableCoins = async (_, fetchingCoins, fetchError, $activeAddress, availableCoins, extractSymbolFromCoinType) => {
  try {
    set(fetchingCoins, true);
    set(fetchError, "");
    const client = getClient();
    const balances = await client.getAllBalances({ owner: $activeAddress() });
    set(availableCoins, balances.filter((balance) => parseInt(balance.totalBalance) > 0).map((balance) => ({
      coinType: balance.coinType,
      totalBalance: balance.totalBalance,
      symbol: extractSymbolFromCoinType(balance.coinType)
    })));
    console.log("Available coins:", get(availableCoins));
  } catch (err) {
    set(fetchError, err.toString());
    console.error("Error fetching coins:", err);
  } finally {
    set(fetchingCoins, false);
  }
};
const executeBulkTransfer = async (__1, errorMsg, parseTransfers, transfersJson, coinSymbol, coinType, $activeAddress, value) => {
  try {
    set(errorMsg, "");
    let transfers;
    try {
      transfers = parseTransfers(get(transfersJson));
    } catch (parseErr) {
      const errorMessage = parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`Parse error: ${errorMessage}`);
    }
    if (!Array.isArray(transfers) || transfers.length === 0) {
      throw new Error("Transfers must be a non-empty array");
    }
    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      if (!transfer.address || typeof transfer.address !== "string") {
        throw new Error(`Transfer ${i}: address is required and must be a string`);
      }
      if (!isValidIotaAddress(transfer.address)) {
        throw new Error(`Transfer ${i}: invalid IOTA address "${transfer.address}"`);
      }
      if (!transfer.amount || typeof transfer.amount !== "number" || transfer.amount <= 0) {
        throw new Error(`Transfer ${i}: amount is required and must be a positive number`);
      }
    }
    console.log(`Executing bulk transfer to ${transfers.length} recipients using ${get(coinSymbol)}`);
    const txb = new Transaction();
    if (get(coinType) === "0x2::iota::IOTA") {
      const coins = txb.splitCoins(txb.gas, transfers.map((transfer) => transfer.amount));
      transfers.forEach((transfer, index2) => {
        txb.transferObjects([coins[index2]], transfer.address);
      });
    } else {
      const client = getClient();
      const iotaAddress = $activeAddress();
      let totalTransferAmount = transfers.reduce((acc, transfer) => acc + BigInt(transfer.amount), BigInt(0));
      let availableCoins2 = await client.getCoins({ owner: iotaAddress, coinType: get(coinType) });
      if (availableCoins2.data.length === 0) {
        throw new Error(`No ${get(coinSymbol)} coins available for transfer`);
      }
      let selectedAmount = BigInt(0);
      let selectedCoins = [];
      for (const coin of availableCoins2.data) {
        if (selectedAmount >= totalTransferAmount) {
          break;
        }
        selectedAmount += BigInt(coin.balance);
        selectedCoins.push(coin);
      }
      if (selectedAmount < totalTransferAmount) {
        throw new Error(`Not enough ${get(coinSymbol)} coins available for transfer. Available: ${selectedAmount}, Required: ${totalTransferAmount}`);
      }
      const coinOne = txb.object(selectedCoins.shift()?.coinObjectId);
      if (selectedCoins.length > 0) {
        txb.mergeCoins(coinOne, selectedCoins.map((coin) => txb.object(coin.coinObjectId)));
      }
      const coins = txb.splitCoins(coinOne, transfers.map((transfer) => transfer.amount));
      transfers.forEach((transfer, index2) => {
        txb.transferObjects([coins[index2]], transfer.address);
      });
    }
    set(value, await executeTransaction(txb));
  } catch (err) {
    set(errorMsg, err.toString());
    set(value, err.toString());
    console.error(err);
  }
};
function handleJsonChange(__2, parseTransfers, transfersJson, errorMsg) {
  try {
    const transfers = parseTransfers(get(transfersJson));
    if (!Array.isArray(transfers)) {
      throw new Error("Transfers must be an array");
    }
    if (transfers.length === 0) {
      throw new Error("Transfers array cannot be empty");
    }
    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      if (!transfer.address || typeof transfer.address !== "string") {
        throw new Error(`Transfer ${i}: address is required and must be a string`);
      }
      if (!isValidIotaAddress(transfer.address)) {
        throw new Error(`Transfer ${i}: invalid IOTA address "${transfer.address}"`);
      }
      if (!transfer.amount || typeof transfer.amount !== "number" || transfer.amount <= 0) {
        throw new Error(`Transfer ${i}: amount is required and must be a positive number`);
      }
    }
    set(errorMsg, "");
  } catch (err) {
    set(errorMsg, err.toString());
  }
}
var root_1 = from_html(`<div style="color: red; font-size: 0.9rem; margin-top: 0.25rem;"> </div>`);
var on_change = (e, selectCoinFromDropdown) => selectCoinFromDropdown(e.target.value);
var root_3 = from_html(`<option> </option>`);
var root_2 = from_html(`<div style="margin-bottom: 1rem;"><label for="coinDropdown" style="display: inline-block; margin-bottom: 0.5rem; font-weight: bold;">Select from Available Coins:</label> <br/> <select id="coinDropdown" style="padding: 0.5rem; font-family: monospace; font-size: 14px; border: 1px solid #cccccc; min-width: 300px;"><option>-- Select a coin --</option><!></select> <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;"> </div></div>`);
var root_4 = from_html(`<div style="color: red; margin-top: 0.5rem; font-size: 0.9rem;"> </div>`);
var root_5 = from_html(`<div style="margin: 1rem 0; text-align: left; display: inline-block;"> <br/> </div>`);
var root = from_html(`<main><div><h3>Bulk Transfer</h3> <p>Transfer coins to multiple addresses in a single transaction.</p> <div style="margin-bottom: 1rem;"><div style="margin-bottom: 1rem;"><button style="padding: 0.5rem 1rem; margin-bottom: 0.5rem;" class="svelte-12h7i3q"> </button> <!></div> <!></div> <div><details style="margin-bottom: 1rem;"><summary>Example formats</summary> <div style="display: flex; gap: 2rem; justify-content: center;"><div><h4>JSON format:</h4> <pre style="padding: 1rem; text-align: left;"></pre></div> <div><h4>CSV format:</h4> <pre style="padding: 1rem; text-align: left;"></pre></div> <div><h4>Space-separated:</h4> <pre style="padding: 1rem;"></pre></div></div></details> <div style="display: inline-block;"><div style="text-align: left;">Transfers (amount in the smallest unit (NANO for IOTA)) - JSON, CSV, or
                    space-separated:</div> <textarea rows="15" cols="120" placeholder="Enter transfers in JSON, CSV, or space-separated format"></textarea></div> <!></div> <!> <br/> <button class="svelte-12h7i3q">Execute Bulk Transfer</button></div> <!></main>`);
function BulkTransfer($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const totalAmountNano = mutable_source();
  const totalAmountDisplay = mutable_source();
  let transfersJson = mutable_source(`0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900 1000000000
0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11 2000000000`);
  let coinType = mutable_source("0x2::iota::IOTA");
  let coinSymbol = mutable_source("IOTA");
  let availableCoins = mutable_source([]);
  let fetchingCoins = mutable_source(false);
  let fetchError = mutable_source("");
  function extractSymbolFromCoinType(coinType2) {
    if (coinType2 === "0x2::iota::IOTA") {
      return "IOTA";
    } else {
      const parts = coinType2.split("::");
      return parts.length > 2 ? parts[parts.length - 1].toUpperCase() : "TOKEN";
    }
  }
  function selectCoinFromDropdown(selectedCoinType) {
    set(coinType, selectedCoinType);
  }
  function parseTransfers(input) {
    const trimmed = input.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        for (let i = 0; i < parsed.length; i++) {
          const transfer = parsed[i];
          if (!transfer.address || typeof transfer.address !== "string") {
            throw new Error(`Transfer ${i}: address is required and must be a string`);
          }
          if (!isValidIotaAddress(transfer.address)) {
            throw new Error(`Transfer ${i}: invalid IOTA address "${transfer.address}"`);
          }
          if (!transfer.amount || typeof transfer.amount !== "number" || transfer.amount <= 0) {
            throw new Error(`Transfer ${i}: amount is required and must be a positive number`);
          }
        }
        return parsed;
      }
    } catch (e) {
      if (e instanceof SyntaxError) ;
      else {
        throw e;
      }
    }
    const lines = trimmed.split("\n").filter((line) => line.trim());
    const transfers = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (i === 0 && line.toLowerCase().includes("address") && line.toLowerCase().includes("amount")) {
        continue;
      }
      let parts = line.split(",").map((p) => p.trim());
      if (parts.length !== 2) {
        parts = line.split(/\s+/);
      }
      if (parts.length !== 2) {
        throw new Error(`Line ${i + 1}: Expected format "address,amount" or "address amount", got "${line}"`);
      }
      const [address, amountStr] = parts;
      if (!isValidIotaAddress(address)) {
        throw new Error(`Line ${i + 1}: Invalid IOTA address "${address}"`);
      }
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        throw new Error(`Line ${i + 1}: Invalid amount "${amountStr}"`);
      }
      transfers.push({ address, amount });
    }
    return transfers;
  }
  let value = mutable_source({});
  let errorMsg = mutable_source("");
  legacy_pre_effect(() => get(coinType), () => {
    if (get(coinType) === "0x2::iota::IOTA") {
      set(coinSymbol, "IOTA");
    } else {
      const parts = get(coinType).split("::");
      set(coinSymbol, parts.length > 2 ? parts[parts.length - 1].toUpperCase() : "TOKEN");
    }
  });
  legacy_pre_effect(() => get(transfersJson), () => {
    set(totalAmountNano, (() => {
      try {
        const transfers = parseTransfers(get(transfersJson));
        return transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
      } catch {
        return 0;
      }
    })());
  });
  legacy_pre_effect(() => (get(coinType), get(totalAmountNano), get(coinSymbol)), () => {
    set(totalAmountDisplay, get(coinType) === "0x2::iota::IOTA" ? (get(totalAmountNano) / 1e9).toLocaleString() + " IOTA" : get(totalAmountNano).toLocaleString() + ` ${get(coinSymbol)}`);
  });
  legacy_pre_effect_reset();
  init();
  var main = root();
  var div = child(main);
  var div_1 = sibling(child(div), 4);
  var div_2 = child(div_1);
  var button = child(div_2);
  button.__click = [
    fetchAvailableCoins,
    fetchingCoins,
    fetchError,
    $activeAddress,
    availableCoins,
    extractSymbolFromCoinType
  ];
  var text = child(button);
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var div_3 = root_1();
      var text_1 = child(div_3);
      template_effect(() => set_text(text_1, `Error: ${get(fetchError) ?? ""}`));
      append($$anchor2, div_3);
    };
    if_block(node, ($$render) => {
      if (get(fetchError)) $$render(consequent);
    });
  }
  var node_1 = sibling(div_2, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_4 = root_2();
      var select = sibling(child(div_4), 4);
      select.__change = [on_change, selectCoinFromDropdown];
      var option = child(select);
      option.value = option.__value = "";
      var node_2 = sibling(option);
      each(node_2, 1, () => get(availableCoins), index, ($$anchor3, coin) => {
        var option_1 = root_3();
        var text_2 = child(option_1);
        var option_1_value = {};
        template_effect(
          ($0) => {
            set_selected(option_1, (get(coin), get(coinType), untrack(() => get(coin).coinType === get(coinType))));
            set_text(text_2, `${(get(coin), untrack(() => get(coin).symbol)) ?? ""} - Balance: ${$0 ?? ""}`);
            if (option_1_value !== (option_1_value = (get(coin), untrack(() => get(coin).coinType)))) {
              option_1.value = (option_1.__value = (get(coin), untrack(() => get(coin).coinType))) ?? "";
            }
          },
          [
            () => (get(coin), untrack(() => parseInt(get(coin).totalBalance).toLocaleString()))
          ]
        );
        append($$anchor3, option_1);
      });
      var div_5 = sibling(select, 2);
      var text_3 = child(div_5);
      template_effect(() => set_text(text_3, `Selected Token: ${get(coinSymbol) ?? ""}`));
      append($$anchor2, div_4);
    };
    if_block(node_1, ($$render) => {
      if (get(availableCoins), untrack(() => get(availableCoins).length > 0)) $$render(consequent_1);
    });
  }
  var div_6 = sibling(div_1, 2);
  var details = child(div_6);
  var div_7 = sibling(child(details), 2);
  var div_8 = child(div_7);
  var pre = sibling(child(div_8), 2);
  pre.textContent = '[\n    {"address": "0x123...", "amount": 1000000000},\n    {"address": "0x456...", "amount": 2000000000}\n]';
  var div_9 = sibling(div_8, 2);
  var pre_1 = sibling(child(div_9), 2);
  pre_1.textContent = "address,amount\n0x123...,1000000000\n0x456...,2000000000";
  var div_10 = sibling(div_9, 2);
  var pre_2 = sibling(child(div_10), 2);
  pre_2.textContent = "0x123... 1000000000\n0x456... 2000000000";
  var div_11 = sibling(details, 2);
  var textarea = sibling(child(div_11), 2);
  textarea.__input = [handleJsonChange, parseTransfers, transfersJson, errorMsg];
  let classes;
  var node_3 = sibling(div_11, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_12 = root_4();
      var text_4 = child(div_12);
      template_effect(() => set_text(text_4, get(errorMsg)));
      append($$anchor2, div_12);
    };
    if_block(node_3, ($$render) => {
      if (get(errorMsg)) $$render(consequent_2);
    });
  }
  var node_4 = sibling(div_6, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_13 = root_5();
      var text_5 = child(div_13);
      var text_6 = sibling(text_5, 2);
      template_effect(
        ($0) => {
          set_text(text_5, `Transfers: ${$0 ?? ""} `);
          set_text(text_6, ` Amount: ${get(totalAmountDisplay) ?? ""}`);
        },
        [
          () => (get(transfersJson), untrack(() => (() => {
            try {
              const transfers = parseTransfers(get(transfersJson));
              return transfers.length;
            } catch {
              return 0;
            }
          })()))
        ]
      );
      append($$anchor2, div_13);
    };
    if_block(node_4, ($$render) => {
      if (get(totalAmountNano) > 0) $$render(consequent_3);
    });
  }
  var button_1 = sibling(node_4, 4);
  button_1.__click = [
    executeBulkTransfer,
    errorMsg,
    parseTransfers,
    transfersJson,
    coinSymbol,
    coinType,
    $activeAddress,
    value
  ];
  var node_5 = sibling(div, 2);
  TransactionView(node_5, {
    get value() {
      return get(value);
    }
  });
  template_effect(
    ($0) => {
      button.disabled = get(fetchingCoins);
      set_text(text, get(fetchingCoins) ? "Fetching..." : "Fetch Available Coins to send a different coin type");
      classes = set_class(textarea, 1, "svelte-12h7i3q", null, classes, $0);
    },
    [() => ({ error: !!get(errorMsg) })]
  );
  bind_value(textarea, () => get(transfersJson), ($$value) => set(transfersJson, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click", "change", "input"]);
export {
  BulkTransfer as default
};

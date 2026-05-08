import { p as push, o as state, Q as proxy, u as user_effect, s as set, g as get, b as sibling, h as child, i as if_block, t as template_effect, c as set_text, k as delegated, H as bind_value, d as append, l as pop, F as setup_stores, B as getClient, az as Transaction, N as TransactionView, m as user_derived, q as from_html, E as store_get, aq as activeAddress, r as delegate } from "./index-CEjx4nPM.js";
import { I as IotaAmountInput } from "./IotaAmountInput-CPuG4eSo.js";
import { J as JsonToggleView } from "./JsonToggleView-HCdA9ppz.js";
import { e as executeTransaction } from "./transaction-execution-BOeRKIWl.js";
var root_2 = from_html(`<div>No coins available</div>`);
var root = from_html(`<main><div> </div> <button class="svelte-9gxfab">List all IOTA coins</button> <br/> <button class="svelte-9gxfab">Merge all IOTA coins (max 2048 at once)</button> <br/> <span>object count: <input placeholder="0"/></span> <span>amount per object: <div style="display: inline-block; vertical-align: top;"><!></div></span> <br/> <button class="svelte-9gxfab">Split IOTA coins (max 2048)</button> <!></main>`);
function SplitMergeCoins($$anchor, $$props) {
  push($$props, true);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let objectCount = state("1");
  let amountPerObject = state("1000000000");
  let amountPerObjectNumber = state(1e9);
  let value = state(proxy({}));
  let iotaBalance = state(0);
  let isTransactionResult = state(false);
  user_effect(() => {
    set(amountPerObject, get(amountPerObjectNumber).toString(), true);
  });
  const mergeAllIotaCoins = async () => {
    try {
      let client = getClient();
      let coins = await getAllIotaCoins(client, $activeAddress());
      if (coins.length < 2) {
        throw new Error("No coins to consolidate");
      }
      let position = coins.findIndex((c) => parseInt(c.balance) > 5e5);
      let [gasCoinObject] = coins.splice(position, 1);
      let coinObjectIds = coins.slice(0, 1676).map((coin) => {
        return coin.coinObjectId;
      });
      console.log(`Consolidating ${coinObjectIds.length + 1} coins`);
      const tx = new Transaction();
      const chunkSize = 511;
      for (let i = 0; i < coinObjectIds.length; i += chunkSize) {
        const coinObjectIdsChunk = coinObjectIds.slice(i, i + chunkSize);
        tx.mergeCoins(tx.gas, coinObjectIdsChunk);
      }
      tx.setGasPayment([
        {
          objectId: gasCoinObject.coinObjectId,
          version: gasCoinObject.version,
          digest: gasCoinObject.digest
        }
      ]);
      set(value, await executeTransaction(tx), true);
      set(isTransactionResult, true);
    } catch (err) {
      set(value, err.toString(), true);
      set(isTransactionResult, false);
      console.error(err);
    }
  };
  const splitIotaCoins = async () => {
    try {
      const tx = new Transaction();
      const splitAmounts = Array.from({ length: parseInt(get(objectCount)) }, () => parseInt(get(amountPerObject)));
      const coins = tx.splitCoins(tx.gas, splitAmounts);
      let coinArgs = [...Array(splitAmounts.length).keys()].map((i) => {
        return {
          kind: "NestedResult",
          NestedResult: [coins[0].NestedResult[0], i]
        };
      });
      tx.transferObjects(coinArgs, $activeAddress());
      set(value, await executeTransaction(tx), true);
      set(isTransactionResult, true);
    } catch (err) {
      set(value, err.toString(), true);
      set(isTransactionResult, false);
      console.error(err);
    }
  };
  const listAllIotaCoinObjects = async () => {
    try {
      let client = getClient();
      let coins = await getAllIotaCoins(client, $activeAddress());
      set(iotaBalance, 0);
      for (const coin of coins) {
        set(iotaBalance, get(iotaBalance) + parseInt(coin.balance));
      }
      set(value, coins, true);
      set(isTransactionResult, false);
    } catch (err) {
      set(value, err.toString(), true);
      set(isTransactionResult, false);
      console.error(err);
    }
  };
  async function getAllIotaCoins(client, address) {
    let cursor = null;
    const coins = [];
    do {
      const { data, nextCursor } = await client.getCoins({ owner: address, cursor });
      if (!data || !data.length) {
        break;
      }
      coins.push(...data);
      cursor = nextCursor;
    } while (cursor);
    return coins;
  }
  var main = root();
  var div = child(main);
  var text = child(div);
  var button = sibling(div, 2);
  var button_1 = sibling(button, 4);
  var span = sibling(button_1, 4);
  var input = sibling(child(span));
  var span_1 = sibling(span, 2);
  var div_1 = sibling(child(span_1));
  var node = child(div_1);
  IotaAmountInput(node, {
    id: "amount-per-object",
    label: "",
    placeholder: "1000000000",
    get value() {
      return get(amountPerObjectNumber);
    },
    set value($$value) {
      set(amountPerObjectNumber, $$value, true);
    }
  });
  var button_2 = sibling(span_1, 4);
  var node_1 = sibling(button_2, 2);
  {
    var consequent = ($$anchor2) => {
      TransactionView($$anchor2, {
        get value() {
          return get(value);
        }
      });
    };
    var consequent_1 = ($$anchor2) => {
      var div_2 = root_2();
      append($$anchor2, div_2);
    };
    var d = user_derived(() => Array.isArray(get(value)) && get(value).length === 0);
    var alternate = ($$anchor2) => {
      JsonToggleView($$anchor2, {
        get value() {
          return get(value);
        }
      });
    };
    if_block(node_1, ($$render) => {
      if (get(isTransactionResult)) $$render(consequent);
      else if (get(d)) $$render(consequent_1, 1);
      else $$render(alternate, -1);
    });
  }
  template_effect(($0) => set_text(text, `IOTA balance: ${$0 ?? ""}`), [() => (get(iotaBalance) / 1e9).toFixed(9)]);
  delegated("click", button, () => listAllIotaCoinObjects());
  delegated("click", button_1, () => mergeAllIotaCoins());
  bind_value(input, () => get(objectCount), ($$value) => set(objectCount, $$value));
  delegated("click", button_2, () => splitIotaCoins());
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click"]);
export {
  SplitMergeCoins as default
};

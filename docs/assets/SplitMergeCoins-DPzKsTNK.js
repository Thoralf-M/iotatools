import { p as push, i as init, f as from_html, s as sibling, c as child, b as if_block, g as get, m as mutable_source, t as template_effect, d as set_text, e as event, E as bind_value, k as append, l as pop, Q as setup_stores, n as getClient, N as store_get, af as Transaction, j as set, a8 as activeAddress } from "/iota-utils/assets/index-CyX8wKuW.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-BSeCNab1.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-CL-Vu8Z6.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-3s09jlng.js";
import "/iota-utils/assets/transaction-view-y1tO5XHc.js";
import "/iota-utils/assets/attributes-BMB6D7Ei.js";
import "/iota-utils/assets/iota-nano-conversion-BNN0xvws.js";
var root = from_html(`<main><div> </div> <button class="svelte-8fa537">List all IOTA coins</button> <br/> <button class="svelte-8fa537">Merge all IOTA coins (max 2048 at once)</button> <br/> <span>object count: <input placeholder="0"/></span> <span>amount per object: <input placeholder="0"/></span> <br/> <button class="svelte-8fa537">Split IOTA coins (max 2048)</button> <!></main>`);
function SplitMergeCoins($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  let objectCount = mutable_source("1");
  let amountPerObject = mutable_source("1000000000");
  let value = mutable_source({});
  let iotaBalance = mutable_source(0);
  let isTransactionResult = mutable_source(false);
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
      set(value, await executeTransaction(tx));
      set(isTransactionResult, true);
    } catch (err) {
      set(value, err.toString());
      set(isTransactionResult, false);
      console.error(err);
    }
  };
  const splitIotaCoins = async () => {
    try {
      const tx = new Transaction();
      const splitAmounts = new Array(parseInt(get(objectCount))).fill(parseInt(get(amountPerObject)));
      const coins = tx.splitCoins(tx.gas, splitAmounts);
      let coinArgs = [...Array(splitAmounts.length).keys()].map((i) => {
        return {
          kind: "NestedResult",
          NestedResult: [coins[0].NestedResult[0], i]
        };
      });
      tx.transferObjects(coinArgs, $activeAddress());
      set(value, await executeTransaction(tx));
      set(isTransactionResult, true);
    } catch (err) {
      set(value, err.toString());
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
      set(value, coins);
      set(isTransactionResult, false);
    } catch (err) {
      set(value, err.toString());
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
  init();
  var main = root();
  var div = child(main);
  var text = child(div);
  var button = sibling(div, 2);
  var button_1 = sibling(button, 4);
  var span = sibling(button_1, 4);
  var input = sibling(child(span));
  var span_1 = sibling(span, 2);
  var input_1 = sibling(child(span_1));
  var button_2 = sibling(span_1, 4);
  var node = sibling(button_2, 2);
  {
    var consequent = ($$anchor2) => {
      TransactionView($$anchor2, {
        get value() {
          return get(value);
        }
      });
    };
    var alternate = ($$anchor2) => {
      JsonToggleView($$anchor2, {
        get value() {
          return get(value);
        }
      });
    };
    if_block(node, ($$render) => {
      if (get(isTransactionResult)) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  template_effect(($0) => set_text(text, `IOTA balance: ${$0 ?? ""}`), [() => (get(iotaBalance) / 1e9).toFixed(9)]);
  event("click", button, () => listAllIotaCoinObjects());
  event("click", button_1, () => mergeAllIotaCoins());
  bind_value(input, () => get(objectCount), ($$value) => set(objectCount, $$value));
  bind_value(input_1, () => get(amountPerObject), ($$value) => set(amountPerObject, $$value));
  event("click", button_2, () => splitIotaCoins());
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  SplitMergeCoins as default
};

import { p as push, i as init, f as from_html, s as sibling, c as child, b as if_block, g as get, m as mutable_source, t as template_effect, e as set_text, h as event, x as bind_value, k as append, l as pop, v as setup_stores, K as comment, J as first_child, n as set, o as getClient, u as store_get, ai as Transaction, ab as activeAddress } from "./index-D0sA9aJ_.js";
import { J as JsonToggleView } from "./JsonToggleView-Ccga4AYb.js";
import { T as TransactionView } from "./TransactionView-DZsTwtrq.js";
import { e as executeTransaction } from "./transaction-execution-BPBdWtmL.js";
import "./transaction-view-zm5t-sAw.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-Bw0BwmLV.js";
import "./iota-nano-conversion-l_Vt0j2q.js";
var root_3 = from_html(`<div>No coins available</div>`);
var root = from_html(`<main><div> </div> <button class="svelte-13l3djg">List all IOTA coins</button> <br/> <button class="svelte-13l3djg">Merge all IOTA coins (max 2048 at once)</button> <br/> <span>object count: <input placeholder="0"/></span> <span>amount per object: <input placeholder="0"/></span> <br/> <button class="svelte-13l3djg">Split IOTA coins (max 2048)</button> <!></main>`);
function SplitMergeCoins($$anchor, $$props) {
  push($$props, false);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
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
    var alternate_1 = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      {
        var consequent_1 = ($$anchor3) => {
          var div_1 = root_3();
          append($$anchor3, div_1);
        };
        var alternate = ($$anchor3) => {
          JsonToggleView($$anchor3, {
            get value() {
              return get(value);
            }
          });
        };
        if_block(
          node_1,
          ($$render) => {
            if (Array.isArray(get(value)) && get(value).length === 0) $$render(consequent_1);
            else $$render(alternate, false);
          },
          true
        );
      }
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (get(isTransactionResult)) $$render(consequent);
      else $$render(alternate_1, false);
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

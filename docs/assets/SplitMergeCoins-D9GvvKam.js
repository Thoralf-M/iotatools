import { p as push, E as state, F as proxy, Z as user_effect, n as set, g as get, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, e as set_text, x as bind_value, k as append, l as pop, v as setup_stores, o as getClient, r as store_get, ar as Transaction, K as comment, J as first_child, ag as activeAddress, B as delegate } from "./index-Cxp_XvNf.js";
import { I as IotaAmountInput } from "./IotaAmountInput-DtyHMJFD.js";
import { J as JsonToggleView } from "./JsonToggleView-B4XGRE07.js";
import { T as TransactionView } from "./TransactionView-BD_EK1ih.js";
import { e as executeTransaction } from "./transaction-execution-nnRgRXiI.js";
import "./iota-nano-conversion-DsKYfKjg.js";
import "./transaction-view-CfZdYaNq.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-Cz6Manqz.js";
import "./index-CvJZrfk_.js";
import "./formatting-DskCwl5J.js";
var root_3 = from_html(`<div>No coins available</div>`);
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
      const splitAmounts = new Array(parseInt(get(objectCount))).fill(parseInt(get(amountPerObject)));
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
  button.__click = () => listAllIotaCoinObjects();
  var button_1 = sibling(button, 4);
  button_1.__click = () => mergeAllIotaCoins();
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
  button_2.__click = () => splitIotaCoins();
  var node_1 = sibling(button_2, 2);
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
      var node_2 = first_child(fragment_1);
      {
        var consequent_1 = ($$anchor3) => {
          var div_2 = root_3();
          append($$anchor3, div_2);
        };
        var alternate = ($$anchor3) => {
          JsonToggleView($$anchor3, {
            get value() {
              return get(value);
            }
          });
        };
        if_block(
          node_2,
          ($$render) => {
            if (Array.isArray(get(value)) && get(value).length === 0) $$render(consequent_1);
            else $$render(alternate, false);
          },
          true
        );
      }
      append($$anchor2, fragment_1);
    };
    if_block(node_1, ($$render) => {
      if (get(isTransactionResult)) $$render(consequent);
      else $$render(alternate_1, false);
    });
  }
  template_effect(($0) => set_text(text, `IOTA balance: ${$0 ?? ""}`), [() => (get(iotaBalance) / 1e9).toFixed(9)]);
  bind_value(input, () => get(objectCount), ($$value) => set(objectCount, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click"]);
export {
  SplitMergeCoins as default
};

import { p as push, o as state, R as proxy, u as user_effect, s as set, g as get, b as sibling, h as child, i as if_block, t as template_effect, c as set_text, k as delegated, J as bind_value, d as append, l as pop, G as setup_stores, z as getClient, aE as Transaction, aI as addAndRun, Y as comment, X as first_child, q as from_html, F as store_get, au as activeAddress, m as user_derived, r as delegate } from "./index-mBZe89wJ.js";
import { I as IotaAmountInput } from "./IotaAmountInput-D6bYF1oT.js";
import { J as JsonToggleView } from "./JsonToggleView-QX7zZ_3K.js";
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
  let hasListed = state(false);
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
      await addAndRun({
        label: `Merge ${coinObjectIds.length + 1} IOTA coins`,
        transaction: tx
      });
    } catch (err) {
      console.error(err);
      alert(err.toString());
    }
  };
  const splitIotaCoins = async () => {
    try {
      const MAX_PER_COMMAND = 511;
      const total = parseInt(get(objectCount));
      const amount = parseInt(get(amountPerObject));
      const tx = new Transaction();
      let remaining = total;
      while (remaining > 0) {
        const chunkSize = Math.min(remaining, MAX_PER_COMMAND);
        const splitAmounts = Array.from({ length: chunkSize }, () => amount);
        const coins = tx.splitCoins(tx.gas, splitAmounts);
        const commandIndex = coins[0].NestedResult[0];
        const chunkCoinArgs = Array.from({ length: chunkSize }, (_, i) => ({ kind: "NestedResult", NestedResult: [commandIndex, i] }));
        tx.transferObjects(chunkCoinArgs, $activeAddress());
        remaining -= chunkSize;
      }
      await addAndRun({
        label: `Split into ${total} × ${get(amountPerObject)} NANO`,
        transaction: tx
      });
    } catch (err) {
      console.error(err);
      alert(err.toString());
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
      set(hasListed, true);
    } catch (err) {
      set(value, err.toString(), true);
      set(hasListed, true);
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
    var consequent_1 = ($$anchor2) => {
      var fragment = comment();
      var node_2 = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          var div_2 = root_2();
          append($$anchor3, div_2);
        };
        var d = user_derived(() => Array.isArray(get(value)) && get(value).length === 0);
        var alternate = ($$anchor3) => {
          JsonToggleView($$anchor3, {
            get value() {
              return get(value);
            }
          });
        };
        if_block(node_2, ($$render) => {
          if (get(d)) $$render(consequent);
          else $$render(alternate, -1);
        });
      }
      append($$anchor2, fragment);
    };
    if_block(node_1, ($$render) => {
      if (get(hasListed)) $$render(consequent_1);
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

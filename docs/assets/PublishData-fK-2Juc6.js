import { p as push, i as init, s as sibling, k as child, g as get, x as bind_value, e as event, h as append, j as pop, m as mutable_source, l as set, n as from_html, ai as Transaction } from "./index-jgDoxWzR.js";
import { T as TransactionView } from "./TransactionView-q0PSXh2h.js";
import { e as executeTransaction } from "./transaction-execution-BDqJnhsH.js";
import "./transaction-view-B0SLz9hg.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-DsK1s_C0.js";
import "./iota-nano-conversion-DDgUA_oK.js";
var root = from_html(`<main>Publish data as input to a tx <br/> <span>pure input data: <input placeholder="string" size="60"/></span> <br/> <button class="svelte-1dks3s0">publish data in tx</button> <!></main>`);
function PublishData($$anchor, $$props) {
  push($$props, false);
  let pureInputData = mutable_source("some data");
  let value = mutable_source({});
  const publishData = async () => {
    try {
      const tx = new Transaction();
      tx.pure("string", get(pureInputData));
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  init();
  var main = root();
  var span = sibling(child(main), 3);
  var input = sibling(child(span));
  var button = sibling(span, 4);
  var node = sibling(button, 2);
  TransactionView(node, {
    get value() {
      return get(value);
    }
  });
  bind_value(input, () => get(pureInputData), ($$value) => set(pureInputData, $$value));
  event("click", button, () => publishData());
  append($$anchor, main);
  pop();
}
export {
  PublishData as default
};

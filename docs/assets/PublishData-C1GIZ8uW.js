import { p as push, i as init, f as from_html, s as sibling, c as child, g as get, m as mutable_source, x as bind_value, h as event, k as append, l as pop, n as set, al as Transaction } from "./index-D-RZqv3J.js";
import { T as TransactionView } from "./TransactionView-DTeK8h6G.js";
import { e as executeTransaction } from "./transaction-execution-DLoO5Eo2.js";
import "./transaction-view-DP58XTQz.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-Cw-un7E-.js";
import "./iota-nano-conversion-Cbtq0_U7.js";
import "./index-CvJZrfk_.js";
import "./formatting-DskCwl5J.js";
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

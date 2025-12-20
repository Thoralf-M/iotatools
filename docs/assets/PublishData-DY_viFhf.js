import { p as push, i as init, f as from_html, s as sibling, c as child, g as get, m as mutable_source, x as bind_value, h as event, k as append, l as pop, n as set, ai as Transaction } from "./index-Bm1bbLmA.js";
import { T as TransactionView } from "./TransactionView-YZgkkrNI.js";
import { e as executeTransaction } from "./transaction-execution-uEzcQ9au.js";
import "./transaction-view-D1jIjKgJ.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-w4yVhzTV.js";
import "./iota-nano-conversion-D01MXqPm.js";
var root = from_html(`<main>Publish data as input to a tx <br/> <span>pure input data: <input placeholder="string" size="60"/></span> <br/> <button class="svelte-ak526r">publish data in tx</button> <!></main>`);
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

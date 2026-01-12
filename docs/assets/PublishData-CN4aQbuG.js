import { p as push, i as init, f as from_html, s as sibling, c as child, g as get, m as mutable_source, x as bind_value, h as event, k as append, l as pop, n as set, af as Transaction } from "./index-CrBkJ6Na.js";
import { T as TransactionView } from "./TransactionView-Bg_AiS9y.js";
import { e as executeTransaction } from "./transaction-execution-DC_ev4nq.js";
import "./Root-Ch4kcPBT.js";
import "./explorer-links-Bx4a9wSX.js";
import "./transaction-view-CX5wfVGv.js";
import "./TransactionCommands-D2Vwda5a.js";
import "./client-BxSjSZII.js";
import "./iota-nano-conversion-Cbp-fQmb.js";
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

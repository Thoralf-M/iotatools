import { p as push, i as init, f as from_html, s as sibling, c as child, g as get, m as mutable_source, E as bind_value, e as event, j as append, k as pop, l as set, ak as Transaction } from "/iota-utils/assets/index-CiBxPtvV.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-D2lS7W-9.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-DlHjO4ku.js";
import "/iota-utils/assets/transaction-view-CKQQtVAA.js";
import "/iota-utils/assets/iota-nano-conversion-DHerp98d.js";
var root = from_html(`<main>Publish data as input to a tx <br/> <span>pure input data: <input placeholder="string" size="60"/></span> <br/> <button class="svelte-8fa537">publish data in tx</button> <!></main>`);
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

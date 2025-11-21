import { p as push, i as init, f as from_html, s as sibling, c as child, g as get, m as mutable_source, E as bind_value, e as event, k as append, l as pop, ad as Transaction, j as set } from "/iota-utils/assets/index-BgEVLtK2.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-nQ21POgu.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-DIvt0VBj.js";
import "/iota-utils/assets/transaction-view-BMJOg4Yh.js";
import "/iota-utils/assets/b64-BgM4Sqlt.js";
import "/iota-utils/assets/attributes-csk163tA.js";
import "/iota-utils/assets/bcs-CUMl-R6W.js";
import "/iota-utils/assets/hex-BsUxbKPD.js";
import "/iota-utils/assets/iota-nano-conversion-CTSTQk6b.js";
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

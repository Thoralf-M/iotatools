import { p as push, V as prop, m as mutable_source, aX as get, n as set, i as init, a as from_html, s as sibling, c as child, b as if_block, r as store_get, t as template_effect, a5 as set_class, e as set_text, v as delegated, y as bind_value, g as get$1, k as append, l as pop, w as setup_stores, E as delegate, bi as clientConfigErrorMsg, bj as defaultClientConfig, b1 as sharedClientConfig, bk as updateSelectedSignerAccounts, bl as privateKeysErrorMsg, bm as defaultPrivateKeyAccounts, bn as sharedPrivateKeyAccounts, H as state, bo as keypairFromBech32PrivateKey } from "./index-DQQsL319.js";
var root_1 = from_html(`<div style="color: red;"> </div>`);
var root$1 = from_html(`<div><textarea rows="10" style="width: 100%"></textarea> <!> <button> </button></div>`);
function JsonStoreEditor($$anchor, $$props) {
  push($$props, false);
  const $errorStore = () => store_get(errorStore(), "$errorStore", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let store = prop($$props, "store", 8);
  let defaultValue = prop($$props, "defaultValue", 8);
  let errorStore = prop($$props, "errorStore", 8);
  let label = prop($$props, "label", 8, "");
  let onChangeFn = prop($$props, "onChangeFn", 8, () => {
  });
  let jsonText = mutable_source(JSON.stringify(get(store()), null, 2));
  store().subscribe((value) => {
    set(jsonText, JSON.stringify(value, null, 2));
  });
  function handleChange(event) {
    try {
      const parsed = JSON.parse(event.target.value);
      store().set(parsed);
    } catch (e) {
      if (errorStore()) errorStore().set(e.message);
    }
  }
  init();
  var div = root$1();
  var textarea = child(div);
  let classes;
  var node = sibling(textarea, 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      var text = child(div_1);
      template_effect(() => set_text(text, $errorStore()));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (errorStore() && $errorStore()) $$render(consequent);
    });
  }
  var button = sibling(node, 2);
  var text_1 = child(button);
  template_effect(() => {
    classes = set_class(textarea, 1, "svelte-chp9cy", null, classes, { error: errorStore() && $errorStore() });
    set_text(text_1, `Reset ${label() ?? ""}`);
  });
  delegated("input", textarea, handleChange);
  delegated("change", textarea, function(...$$args) {
    onChangeFn()?.apply(this, $$args);
  });
  bind_value(textarea, () => get$1(jsonText), ($$value) => set(jsonText, $$value));
  delegated("click", button, () => store().set(defaultValue()));
  append($$anchor, div);
  pop();
  $$cleanup();
}
delegate(["input", "change", "click"]);
var root = from_html(`<main>Data is stored in your browser's local storage and can be deleted at any time. <div style="flex-direction: column; display: flex; gap: 1rem;"><details style=" margin: 1rem;"><summary style="float:left;"></summary> <!></details> <details style=" margin: 1rem;"><summary style="float:left;"></summary> <button>Add private key:</button> <input type="text" placeholder="iotaprivkey1..." size="75"/> <!></details></div></main>`);
function Settings($$anchor, $$props) {
  push($$props, true);
  let newBech32PrivateKey = state("");
  let error = state("");
  var main = root();
  var div = sibling(child(main));
  var details = child(div);
  var summary = child(details);
  summary.textContent = "Client config:";
  var node = sibling(summary, 2);
  JsonStoreEditor(node, {
    get store() {
      return sharedClientConfig;
    },
    get defaultValue() {
      return defaultClientConfig;
    },
    get errorStore() {
      return clientConfigErrorMsg;
    },
    label: "Client config"
  });
  var details_1 = sibling(details, 2);
  var summary_1 = child(details_1);
  summary_1.textContent = "Private keys:";
  var button = sibling(summary_1, 2);
  var input = sibling(button, 2);
  var text = sibling(input);
  var node_1 = sibling(text);
  JsonStoreEditor(node_1, {
    get store() {
      return sharedPrivateKeyAccounts;
    },
    get defaultValue() {
      return defaultPrivateKeyAccounts;
    },
    get errorStore() {
      return privateKeysErrorMsg;
    },
    label: "Private keys",
    onChangeFn: () => updateSelectedSignerAccounts()
  });
  template_effect(() => set_text(text, ` ${get$1(error) ?? ""} `));
  delegated("click", button, () => {
    sharedPrivateKeyAccounts.update((privateKeys) => {
      try {
        const address = keypairFromBech32PrivateKey(get$1(newBech32PrivateKey)).toIotaAddress();
        set(error, "");
        return {
          ...privateKeys,
          // keep all other keys
          accounts: {
            ...privateKeys.accounts,
            [address]: { bech32PrivateKey: get$1(newBech32PrivateKey), address }
          }
        };
      } catch (e) {
        set(error, `Invalid private key: ${e.message}`);
        return privateKeys;
      }
    });
    updateSelectedSignerAccounts();
    set(newBech32PrivateKey, "");
  });
  bind_value(input, () => get$1(newBech32PrivateKey), ($$value) => set(newBech32PrivateKey, $$value));
  append($$anchor, main);
  pop();
}
delegate(["click"]);
export {
  Settings as default
};

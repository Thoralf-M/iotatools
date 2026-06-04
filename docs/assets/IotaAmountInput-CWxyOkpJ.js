import { p as push, a as prop, o as state, R as proxy, u as user_effect, g as get, s as set, aB as nanoToIota, i as if_block, b as sibling, t as template_effect, W as set_attribute, k as delegated, w as event, J as bind_value, d as append, l as pop, h as child, c as set_text, q as from_html, r as delegate } from "./index-D3R-pqjL.js";
var root_1 = from_html(`<label> </label>`);
var root_2 = from_html(`<div class="iota-display svelte-1xg248d"><span class="iota-value svelte-1xg248d"> </span> <span class="iota-label svelte-1xg248d">IOTA</span></div>`);
var root = from_html(`<div class="iota-amount-input svelte-1xg248d"><!> <div class="input-container svelte-1xg248d"><input type="text" class="nano-input svelte-1xg248d"/> <span class="nano-label svelte-1xg248d">NANO</span></div> <!></div>`);
function IotaAmountInput($$anchor, $$props) {
  push($$props, true);
  let value = prop($$props, "value", 15, 0), label = prop($$props, "label", 3, "Amount"), placeholder = prop($$props, "placeholder", 3, "0");
  let nanoInput = state(proxy(value().toString()));
  let iotaDisplay = state("");
  let iotaDisplayFormatted = state("");
  let isFocused = state(false);
  user_effect(() => {
    if (!get(isFocused)) {
      set(nanoInput, value().toString(), true);
      updateIotaDisplay();
    }
  });
  function updateIotaDisplay() {
    try {
      if (get(nanoInput) && get(nanoInput).trim() !== "") {
        const cleanInput = get(nanoInput).replace(/_/g, "");
        const nanoBigInt = BigInt(cleanInput);
        try {
          const nanoValue = Number(nanoBigInt);
          if (!isNaN(nanoValue) && isFinite(nanoValue)) {
            value(nanoValue);
          } else {
            value(Number.MAX_SAFE_INTEGER);
          }
        } catch {
          value(Number.MAX_SAFE_INTEGER);
        }
        set(iotaDisplay, nanoToIota(cleanInput), true);
        set(iotaDisplayFormatted, get(iotaDisplay).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"), true);
      } else {
        set(iotaDisplay, "");
        set(iotaDisplayFormatted, "");
        value(0);
      }
    } catch (err) {
      set(iotaDisplay, "");
      set(iotaDisplayFormatted, "");
      value(0);
    }
  }
  function handleInput(event2) {
    const target = event2.target;
    set(nanoInput, target.value, true);
    updateIotaDisplay();
  }
  function handleFocus() {
    set(isFocused, true);
  }
  function handleBlur() {
    set(isFocused, false);
  }
  var div = root();
  var node = child(div);
  {
    var consequent = ($$anchor2) => {
      var label_1 = root_1();
      var text = child(label_1);
      template_effect(() => {
        set_attribute(label_1, "for", $$props.id);
        set_text(text, label());
      });
      append($$anchor2, label_1);
    };
    if_block(node, ($$render) => {
      if (label()) $$render(consequent);
    });
  }
  var div_1 = sibling(node, 2);
  var input = child(div_1);
  var node_1 = sibling(div_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_2 = root_2();
      var span = child(div_2);
      var text_1 = child(span);
      template_effect(() => set_text(text_1, get(iotaDisplayFormatted)));
      append($$anchor2, div_2);
    };
    if_block(node_1, ($$render) => {
      if (get(iotaDisplay)) $$render(consequent_1);
    });
  }
  template_effect(() => {
    set_attribute(input, "id", $$props.id);
    set_attribute(input, "placeholder", placeholder());
  });
  delegated("input", input, handleInput);
  event("focus", input, handleFocus);
  event("blur", input, handleBlur);
  bind_value(input, () => get(nanoInput), ($$value) => set(nanoInput, $$value));
  append($$anchor, div);
  pop();
}
delegate(["input"]);
export {
  IotaAmountInput as I
};

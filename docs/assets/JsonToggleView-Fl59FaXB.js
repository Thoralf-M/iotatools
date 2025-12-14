import { p as push, r as prop, i as init, f as from_html, s as sibling, c as child, t as template_effect, C as untrack, x as deep_read_state, g as get, m as mutable_source, d as set_text, e as event, j as append, k as pop, l as set } from "/iota-utils/assets/index-Dj3QlkRo.js";
import { R as Root, f as formatJsonWithCompactArrays } from "/iota-utils/assets/transaction-view-DoiL5EjC.js";
var root = from_html(`<div class="value svelte-tyd1uw"><button class="svelte-tyd1uw">toggle JSON tree</button> <div><!></div> <pre class="svelte-tyd1uw"> </pre></div>`);
function JsonToggleView($$anchor, $$props) {
  push($$props, false);
  let value = prop($$props, "value", 24, () => ({}));
  let showJsonTree = mutable_source(false);
  init();
  var div = root();
  var button = child(div);
  var div_1 = sibling(button, 2);
  var node = child(div_1);
  Root(node, {
    get value() {
      return value();
    },
    defaultExpandedLevel: 1
  });
  var pre = sibling(div_1, 2);
  var text = child(pre);
  template_effect(
    ($0, $1) => {
      div.hidden = $0;
      div_1.hidden = !get(showJsonTree);
      pre.hidden = get(showJsonTree);
      set_text(text, $1);
    },
    [
      () => (deep_read_state(value()), untrack(() => Object.keys(value()).length == 0)),
      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(value()), untrack(() => formatJsonWithCompactArrays(value())))
    ]
  );
  event("click", button, () => set(showJsonTree, !get(showJsonTree)));
  append($$anchor, div);
  pop();
}
export {
  JsonToggleView as J
};

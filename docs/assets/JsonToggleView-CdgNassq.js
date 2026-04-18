import { p as push, a as prop, v as init, b as sibling, b1 as Root, t as template_effect, a0 as deep_read_state, a2 as untrack, b2 as formatJsonWithCompactArrays, V as set_attribute, g as get, c as set_text, w as event, d as append, l as pop, y as mutable_source, h as child, q as from_html, s as set } from "./index-B67ENnAg.js";
var root = from_html(`<div class="value svelte-qre9z5"><button class="svelte-qre9z5">toggle JSON tree</button> <div><!></div> <pre class="svelte-qre9z5"> </pre></div>`);
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
      set_attribute(div, "hidden", $0);
      set_attribute(div_1, "hidden", !get(showJsonTree));
      set_attribute(pre, "hidden", get(showJsonTree));
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

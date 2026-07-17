import { $ as untrack, Dt as pop, G as event, J as deep_read_state, Mt as reset, Ot as push, R as set_text, V as from_html, Y as get, ct as sibling, ft as set, i as prop, it as template_effect, ot as child, s as init, ut as mutable_source, y as set_attribute, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { o as Root, t as formatJsonWithCompactArrays } from "./transaction-view-OeA30yKg.js";
//#region src/lib/components/JsonToggleView.svelte
var root = from_html(`<div class="value svelte-qre9z5"><button class="svelte-qre9z5">toggle JSON tree</button> <div><!></div> <pre class="svelte-qre9z5"> </pre></div>`);
function JsonToggleView($$anchor, $$props) {
	push($$props, false);
	let value = prop($$props, "value", 24, () => ({}));
	let showJsonTree = mutable_source(false);
	init();
	var div = root();
	var button = child(div);
	var div_1 = sibling(button, 2);
	Root(child(div_1), {
		get value() {
			return value();
		},
		defaultExpandedLevel: 1
	});
	reset(div_1);
	var pre = sibling(div_1, 2);
	var text = child(pre, true);
	reset(pre);
	reset(div);
	template_effect(($0, $1) => {
		set_attribute(div, "hidden", $0);
		set_attribute(div_1, "hidden", !get(showJsonTree));
		set_attribute(pre, "hidden", get(showJsonTree));
		set_text(text, $1);
	}, [() => (deep_read_state(value()), untrack(() => Object.keys(value()).length == 0)), () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(value()), untrack(() => formatJsonWithCompactArrays(value())))]);
	event("click", button, () => set(showJsonTree, !get(showJsonTree)));
	append($$anchor, div);
	pop();
}
//#endregion
export { JsonToggleView as t };

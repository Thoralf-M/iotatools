import { Dt as pop, G as event, Mt as reset, Ot as push, V as from_html, Y as get, ct as sibling, ft as set, h as bind_value, ot as child, s as init, ut as mutable_source, v as remove_input_defaults, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { o as Transaction } from "./client-BTFoHz6u.js";
import { t as executeTransaction } from "./transaction-execution-Cg5fkaOd.js";
import { i as TransactionView } from "./index-BOJqqLB8.js";
//#region src/lib/pages/publish-data/PublishData.svelte
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
	remove_input_defaults(input);
	reset(span);
	var button = sibling(span, 4);
	TransactionView(sibling(button, 2), { get value() {
		return get(value);
	} });
	reset(main);
	bind_value(input, () => get(pureInputData), ($$value) => set(pureInputData, $$value));
	event("click", button, () => publishData());
	append($$anchor, main);
	pop();
}
//#endregion
export { PublishData as default };

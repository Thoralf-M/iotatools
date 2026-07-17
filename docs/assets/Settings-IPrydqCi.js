import { Ct as get, D as set_class, Dt as pop, I as if_block, Mt as reset, Ot as push, R as set_text, U as delegate, V as from_html, W as delegated, Y as get$1, _t as remove_textarea_child, ct as sibling, ft as set, h as bind_value, i as prop, it as template_effect, ot as child, pt as state, s as init, ut as mutable_source, v as remove_input_defaults, vt as setup_stores, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { D as keypairFromBech32PrivateKey, E as defaultPrivateKeyAccounts, b as sharedPrivateKeyAccounts, f as clientConfigErrorMsg, g as sharedClientConfig, h as privateKeysErrorMsg, j as defaultClientConfig } from "./client-BTFoHz6u.js";
import { l as updateSelectedSignerAccounts } from "./signer-data-D1Egmbld.js";
//#region src/lib/components/JsonStoreEditor.svelte
var root$1 = from_html(`<div style="color: red;"> </div>`);
var root_1 = from_html(`<div><textarea rows="10" style="width: 100%"></textarea> <!> <button> </button></div>`);
function JsonStoreEditor($$anchor, $$props) {
	push($$props, false);
	const $errorStore = () => store_get(errorStore(), "$errorStore", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let store = prop($$props, "store", 8);
	let defaultValue = prop($$props, "defaultValue", 8);
	let errorStore = prop($$props, "errorStore", 8);
	let label = prop($$props, "label", 8, "");
	let onChangeFn = prop($$props, "onChangeFn", 8, () => {});
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
	var div = root_1();
	var textarea = child(div);
	remove_textarea_child(textarea);
	let classes;
	var node = sibling(textarea, 2);
	var consequent = ($$anchor) => {
		var div_1 = root$1();
		var text = child(div_1, true);
		reset(div_1);
		template_effect(() => set_text(text, $errorStore()));
		append($$anchor, div_1);
	};
	if_block(node, ($$render) => {
		if (errorStore() && $errorStore()) $$render(consequent);
	});
	var button = sibling(node, 2);
	var text_1 = child(button);
	reset(button);
	reset(div);
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
delegate([
	"input",
	"change",
	"click"
]);
//#endregion
//#region src/lib/pages/settings/Settings.svelte
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
	JsonStoreEditor(sibling(summary, 2), {
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
	reset(details);
	var details_1 = sibling(details, 2);
	var summary_1 = child(details_1);
	summary_1.textContent = "Private keys:";
	var button = sibling(summary_1, 2);
	var input = sibling(button, 2);
	remove_input_defaults(input);
	var text = sibling(input);
	JsonStoreEditor(sibling(text), {
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
	reset(details_1);
	reset(div);
	reset(main);
	template_effect(() => set_text(text, ` ${get$1(error) ?? ""} `));
	delegated("click", button, () => {
		sharedPrivateKeyAccounts.update((privateKeys) => {
			try {
				const address = keypairFromBech32PrivateKey(get$1(newBech32PrivateKey)).toIotaAddress();
				set(error, "");
				return {
					...privateKeys,
					accounts: {
						...privateKeys.accounts,
						[address]: {
							bech32PrivateKey: get$1(newBech32PrivateKey),
							address
						}
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
//#endregion
export { Settings as default };

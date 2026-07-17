import { Dt as pop, I as if_block, Mt as reset, N as each, Ot as push, P as index, R as set_text, V as from_html, Y as get, ct as sibling, it as template_effect, ot as child, s as init, st as first_child, vt as setup_stores, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { X as toHex } from "./keypair-DsT3ivIR.js";
import { a as iota_accounts } from "./signer-data-D1Egmbld.js";
//#region src/lib/pages/accounts-list/AccountsList.svelte
var root = from_html(`<p>No accounts connected.</p>`);
var root_1 = from_html(`<tr class="account-block"><td class="account-label svelte-j0dqi" rowspan="2"><span class="account-label-text"> </span></td><td class="account-key svelte-j0dqi">Address:</td><td class="account-value svelte-j0dqi"> </td></tr> <tr class="account-block public-key-row svelte-j0dqi"><td class="account-key svelte-j0dqi">Public Key:</td><td class="account-value svelte-j0dqi"> </td></tr>`, 1);
var root_2 = from_html(`<table class="accounts-table svelte-j0dqi"><tbody></tbody></table>`);
var root_3 = from_html(`<main><div class="wallet-accounts-container svelte-j0dqi"><h2 class="svelte-j0dqi">Connected Wallet Accounts</h2> <!></div></main>`);
function AccountsList($$anchor, $$props) {
	push($$props, false);
	const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	init();
	var main = root_3();
	var div = child(main);
	var node = sibling(child(div), 2);
	var consequent = ($$anchor) => {
		append($$anchor, root());
	};
	var alternate = ($$anchor) => {
		var table = root_2();
		var tbody = child(table);
		each(tbody, 5, $iota_accounts, index, ($$anchor, account) => {
			var fragment = root_1();
			var tr = first_child(fragment);
			var td = child(tr);
			var span = child(td);
			var text = child(span, true);
			reset(span);
			reset(td);
			var td_1 = sibling(td, 2);
			var text_1 = child(td_1, true);
			reset(td_1);
			reset(tr);
			var tr_1 = sibling(tr, 2);
			var td_2 = sibling(child(tr_1));
			var text_2 = child(td_2, true);
			reset(td_2);
			reset(tr_1);
			template_effect(($0) => {
				set_text(text, get(account).label || "Account");
				set_text(text_1, get(account).address);
				set_text(text_2, $0);
			}, [() => "0x" + toHex(new Uint8Array(get(account).publicKey))]);
			append($$anchor, fragment);
		});
		reset(tbody);
		reset(table);
		append($$anchor, table);
	};
	if_block(node, ($$render) => {
		if ($iota_accounts().length === 0) $$render(consequent);
		else $$render(alternate, -1);
	});
	reset(div);
	reset(main);
	append($$anchor, main);
	pop();
	$$cleanup();
}
//#endregion
export { AccountsList as default };

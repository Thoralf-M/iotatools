import { p as push, v as init, b as sibling, h as child, i as if_block, d as append, l as pop, F as store_get, ax as iota_accounts, G as setup_stores, e as each, X as first_child, t as template_effect, aL as toHex, g as get, c as set_text, j as index, q as from_html } from "./index-RlAhZLyw.js";
var root_1 = from_html(`<p>No accounts connected.</p>`);
var root_3 = from_html(`<tr class="account-block"><td class="account-label svelte-j0dqi" rowspan="2"><span class="account-label-text"> </span></td><td class="account-key svelte-j0dqi">Address:</td><td class="account-value svelte-j0dqi"> </td></tr> <tr class="account-block public-key-row svelte-j0dqi"><td class="account-key svelte-j0dqi">Public Key:</td><td class="account-value svelte-j0dqi"> </td></tr>`, 1);
var root_2 = from_html(`<table class="accounts-table svelte-j0dqi"><tbody></tbody></table>`);
var root = from_html(`<main><div class="wallet-accounts-container svelte-j0dqi"><h2 class="svelte-j0dqi">Connected Wallet Accounts</h2> <!></div></main>`);
function AccountsList($$anchor, $$props) {
  push($$props, false);
  const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  init();
  var main = root();
  var div = child(main);
  var node = sibling(child(div), 2);
  {
    var consequent = ($$anchor2) => {
      var p = root_1();
      append($$anchor2, p);
    };
    var alternate = ($$anchor2) => {
      var table = root_2();
      var tbody = child(table);
      each(tbody, 5, $iota_accounts, index, ($$anchor3, account) => {
        var fragment = root_3();
        var tr = first_child(fragment);
        var td = child(tr);
        var span = child(td);
        var text = child(span);
        var td_1 = sibling(td, 2);
        var text_1 = child(td_1);
        var tr_1 = sibling(tr, 2);
        var td_2 = sibling(child(tr_1));
        var text_2 = child(td_2);
        template_effect(
          ($0) => {
            set_text(text, get(account).label || "Account");
            set_text(text_1, get(account).address);
            set_text(text_2, $0);
          },
          [() => "0x" + toHex(new Uint8Array(get(account).publicKey))]
        );
        append($$anchor3, fragment);
      });
      append($$anchor2, table);
    };
    if_block(node, ($$render) => {
      if ($iota_accounts().length === 0) $$render(consequent);
      else $$render(alternate, -1);
    });
  }
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  AccountsList as default
};

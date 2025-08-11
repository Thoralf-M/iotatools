import { p as push, i as init, f as from_html, s as sibling, c as child, b as if_block, V as store_get, k as append, l as pop, U as setup_stores, a2 as iota_accounts, z as each, A as index, G as first_child, t as template_effect, a7 as toHEX, g as get, d as set_text } from "/iota-utils/index-BnYhK8oQ.js";
var root_1 = from_html(`<p>No accounts connected.</p>`);
var root_3 = from_html(`<tr class="account-block"><td class="account-label svelte-ahwfn5" rowspan="2"><span class="account-label-text"> </span></td><td class="account-key svelte-ahwfn5">Address:</td><td class="account-value svelte-ahwfn5"> </td></tr> <tr class="account-block public-key-row svelte-ahwfn5"><td class="account-key svelte-ahwfn5">Public Key:</td><td class="account-value svelte-ahwfn5"> </td></tr>`, 1);
var root_2 = from_html(`<table class="accounts-table svelte-ahwfn5"><tbody></tbody></table>`);
var root = from_html(`<main><div class="wallet-accounts-container svelte-ahwfn5"><h2 class="svelte-ahwfn5">Connected Wallet Accounts</h2> <!></div></main>`);
function AccountsList($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
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
          [() => "0x" + toHEX(new Uint8Array(get(account).publicKey))]
        );
        append($$anchor3, fragment);
      });
      append($$anchor2, table);
    };
    if_block(node, ($$render) => {
      if ($iota_accounts().length === 0) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  AccountsList as default
};

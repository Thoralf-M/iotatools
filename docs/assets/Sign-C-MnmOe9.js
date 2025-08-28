import { p as push, i as init, f as from_html, s as sibling, c as child, b as if_block, g as get, m as mutable_source, e as event, k as append, l as pop, j as set, t as template_effect, d as set_text, ax as fromBase64, ay as TransactionDataBuilder, M as iotaBcs, o as mutate, az as get$1, ae as iota_wallets, ac as activeAddress, af as Transaction } from "/iota-utils/assets/index-DyxRZp83.js";
import { b as bind_this } from "/iota-utils/assets/this-DoU-7r-F.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-B5wzXZc-.js";
import "/iota-utils/assets/transaction-view-BNShn8GZ.js";
import "/iota-utils/assets/iota-nano-conversion-CloFfPVa.js";
var root_1 = from_html(`<div style="margin: 20px 0; padding: 10px; border: 1px solid #e9ecef; border-radius: 4px;"><div style="margin-bottom: 6px; font-weight: bold;"> </div> <div> </div></div>`);
var root_2 = from_html(`<div style="color: red; margin: 10px 0; padding: 10px; border: 1px solid #fcc; border-radius: 4px;"> </div>`);
var root = from_html(`<main><div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64 encoded or message:</span> <button style="padding: 4px 8px; font-size: 12px;">Example tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or message" class="svelte-j05z8l"></textarea></div></div> <div style="margin: 20px 0; display: flex; gap: 10px;"><button style="padding: 8px 16px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign Transaction</button> <button style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign Personal Message</button></div> <!> <!> <!></main>`);
function Sign($$anchor, $$props) {
  push($$props, false);
  let error = mutable_source("");
  let value = mutable_source();
  let signatureResult = mutable_source("");
  let signatureTypeLabel = mutable_source("");
  let txBytesTextarea = mutable_source();
  const exampleTx = "AAACAAgAypo7AAAAAAAg0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpECAgABAQAAAQEDAAAAAAEBANKra+ym7GUCu4vTTXPpQ8bRIIfMk38vrNsEbPtnkEqRAhqhmE/Wz9u5hD63usyXx55ZG8kDHwdq9KNGKDXH3pQ2Mj0AAAAAAAAgnPGssCCNJPH94p+4VvX3Fzp32jLZO9zsO5eMsp4LujqznOy0o0pHmEqaslIo0HQKO7U5nouSh6qph3HYLxK94jM9AAAAAAAAIMX/XZSN7Cn09U1FYXDGPcaUk5v9VkmnwMeY1geClYzW0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpHoAwAAAAAAAOBvPAAAAAAAAA==";
  function insertExampleTx() {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = exampleTx);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
    }
  }
  async function signTransaction() {
    try {
      set(error, "");
      set(signatureResult, "");
      const inputString = get(txBytesTextarea).value.trim();
      if (!inputString) {
        set(error, "Please enter transaction bytes");
        return;
      }
      const wallets = get$1(iota_wallets);
      const senderAddress = get$1(activeAddress);
      if (!wallets || wallets.length === 0) {
        set(error, "No wallet available");
        return;
      }
      if (!wallets[0].signTransaction) {
        set(error, "Current wallet does not support transaction signing");
        return;
      }
      let transactionBytes;
      try {
        transactionBytes = fromBase64(inputString);
      } catch (e) {
        set(error, "Invalid base64 transaction bytes");
        return;
      }
      const result = await wallets[0].signTransaction({
        transaction: Transaction.from(transactionBytes),
        account: { address: senderAddress }
      });
      set(signatureTypeLabel, "Transaction Signature");
      set(signatureResult, result.signature);
    } catch (e) {
      set(error, `Error signing transaction: ${e}`);
      console.error("Error signing transaction:", e);
    }
  }
  async function signPersonalMessage() {
    try {
      set(error, "");
      set(signatureResult, "");
      const inputString = get(txBytesTextarea).value.trim();
      if (!inputString) {
        set(error, "Please enter a message");
        return;
      }
      const wallets = get$1(iota_wallets);
      const senderAddress = get$1(activeAddress);
      if (!wallets || wallets.length === 0) {
        set(error, "No wallet available");
        return;
      }
      if (!wallets[0].signPersonalMessage) {
        set(error, "Current wallet does not support message signing");
        return;
      }
      const messageBytes = new TextEncoder().encode(inputString);
      const result = await wallets[0].signPersonalMessage({ message: messageBytes, account: { address: senderAddress } });
      set(signatureTypeLabel, "Message Signature");
      set(signatureResult, result.signature);
    } catch (e) {
      set(error, `Error signing message: ${e}`);
    }
  }
  init();
  var main = root();
  var div = child(main);
  var div_1 = child(div);
  var button = sibling(child(div_1), 2);
  var div_2 = sibling(div_1, 2);
  var textarea = child(div_2);
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var div_3 = sibling(div, 2);
  var button_1 = child(div_3);
  var button_2 = sibling(button_1, 2);
  var node = sibling(div_3, 2);
  {
    var consequent = ($$anchor2) => {
      var div_4 = root_1();
      var div_5 = child(div_4);
      var text = child(div_5);
      var div_6 = sibling(div_5, 2);
      var text_1 = child(div_6);
      template_effect(() => {
        set_text(text, get(signatureTypeLabel));
        set_text(text_1, get(signatureResult));
      });
      append($$anchor2, div_4);
    };
    if_block(node, ($$render) => {
      if (get(signatureResult)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_7 = root_2();
      var text_2 = child(div_7);
      template_effect(() => set_text(text_2, get(error)));
      append($$anchor2, div_7);
    };
    if_block(node_1, ($$render) => {
      if (get(error)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  TransactionView(node_2, {
    get value() {
      return get(value);
    }
  });
  event("click", button, insertExampleTx);
  event("input", textarea, (event2) => {
    let inputString = event2.target.value;
    try {
      let txBytes = fromBase64(inputString);
      set(value, TransactionDataBuilder.fromBytes(txBytes));
    } catch (e) {
      console.log("error TransactionDataBuilder", e);
      try {
        set(value, iotaBcs.SenderSignedData.parse(fromBase64(inputString))[0]);
      } catch (e2) {
        console.log("error SenderSignedData", e2);
        set(value, e2);
      }
    }
  });
  event("click", button_1, signTransaction);
  event("click", button_2, signPersonalMessage);
  append($$anchor, main);
  pop();
}
export {
  Sign as default
};

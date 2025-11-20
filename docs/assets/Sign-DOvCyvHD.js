import { p as push, w as legacy_pre_effect, N as store_get, g as get, m as mutable_source, j as set, y as legacy_pre_effect_reset, i as init, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, d as set_text, k as append, l as pop, Q as setup_stores, az as fromBase64, aA as TransactionDataBuilder, aa as iotaBcs, aB as get$1, af as iota_wallets, a9 as activeAddress, ag as Transaction, o as mutate, n as getClient, W as delegate } from "/iota-utils/assets/index-C-V7rG3g.js";
import { a as set_value } from "/iota-utils/assets/attributes-Dilt-kPM.js";
import { b as bind_this } from "/iota-utils/assets/this-C0qMyHht.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-2D0bgsG4.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-BS8DwXMM.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "/iota-utils/assets/page-query-params-D2Z86OPH.js";
import "/iota-utils/assets/transaction-view-CiReCa7K.js";
import "/iota-utils/assets/iota-nano-conversion-B3zguGmP.js";
async function dryRunTransaction(_, error, dryRunResult, txBytesInput) {
  try {
    set(error, "");
    set(dryRunResult, "");
    const inputString = get(txBytesInput).trim();
    if (!inputString) {
      set(error, "Please enter transaction bytes");
      return;
    }
    let txBytes;
    try {
      txBytes = fromBase64(inputString);
    } catch (e) {
      set(error, "Invalid base64 transaction bytes");
      return;
    }
    const client = getClient();
    const result = await client.dryRunTransactionBlock({ transactionBlock: txBytes });
    set(dryRunResult, result);
  } catch (e) {
    set(error, `Error dry running transaction: ${e}`);
  }
}
function insertExampleTx(__1, updateTxBytes, exampleTx) {
  updateTxBytes(exampleTx);
}
async function signTransaction(__2, error, signatureResult, txBytesInput, signatureTypeLabel, signatureTextarea) {
  try {
    set(error, "");
    set(signatureResult, "");
    const inputString = get(txBytesInput).trim();
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
    if (get(signatureTextarea)) {
      mutate(signatureTextarea, get(signatureTextarea).value = get(signatureResult));
    }
  } catch (e) {
    set(error, `Error signing transaction: ${e}`);
    console.error("Error signing transaction:", e);
  }
}
async function signPersonalMessage(__3, error, signatureResult, txBytesInput, signatureTypeLabel) {
  try {
    set(error, "");
    set(signatureResult, "");
    const inputString = get(txBytesInput).trim();
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
async function submitSignedTx(__4, error, submitResult, txBytesInput, signatureResult) {
  try {
    set(error, "");
    set(submitResult, null);
    const inputString = get(txBytesInput).trim();
    const signatureString = get(signatureResult).trim();
    if (!inputString) {
      set(error, "Please enter transaction bytes");
      return;
    }
    if (!signatureString) {
      set(error, "Please enter a signature");
      return;
    }
    let txBytes;
    try {
      txBytes = fromBase64(inputString);
    } catch (e) {
      set(error, "Invalid base64 transaction bytes");
      return;
    }
    let bcsSignature;
    try {
      bcsSignature = fromBase64(signatureString);
    } catch (e) {
      set(error, "Invalid base64 signature");
      return;
    }
    const client = getClient();
    const result = await client.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: signatureString,
      options: {
        showBalanceChanges: true,
        showObjectChanges: true,
        showEffects: true,
        showInput: true
      }
    });
    console.log(result);
    set(submitResult, result);
  } catch (e) {
    set(error, `Error submitting signed transaction: ${e}`);
  }
}
var on_input = (e, updateTxBytes) => {
  var _a;
  return updateTxBytes(((_a = e.target) == null ? void 0 : _a.value) || "");
};
var on_click = (__5, dryRunResult) => set(dryRunResult, void 0);
var root_1 = from_html(`<div class="dry-run-result svelte-14s9lix"><button class="dry-run-close svelte-14s9lix" aria-label="Close dry run result" title="Close">&#10005;</button> <div class="dry-run-title">Dry Run Result</div> <!></div>`);
var on_input_1 = (e, signatureResult) => set(signatureResult, e.target.value);
var root_2 = from_html(`<div style="margin: 20px 0;"><!></div>`);
var root_3 = from_html(`<div style="color: red; margin: 10px 0; padding: 10px; border: 1px solid #fcc; border-radius: 4px;"> </div>`);
var root = from_html(`<main><div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64 encoded or message:</span> <button style="padding: 4px 8px; font-size: 12px;">Example tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or message" class="svelte-14s9lix"></textarea></div></div> <div style="margin: 20px 0; display: flex; gap: 10px;"><button style="padding: 8px 16px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign Transaction</button> <button style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign Personal Message</button> <button style="padding: 8px 16px; background: #ffc107; color: #333; border: none; border-radius: 4px; cursor: pointer;">Dry Run Transaction</button></div> <!> <div style="margin: 20px 0;"><div style="margin-bottom: 6px; font-weight: bold;"> </div> <textarea placeholder="Signature (base64)" style="width: 100%; height: 60px;" class="svelte-14s9lix"></textarea> <button style="margin-top: 8px; padding: 8px 16px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit Signed Tx</button></div> <!> <!> <!></main>`);
function Sign($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $queryParamValues = () => store_get(queryParamValues, "$queryParamValues", $$stores);
  const queryParamValues = usePageQueryParams({
    tx: ""
    // Query parameter for transaction bytes
  });
  let error = mutable_source("");
  let value = mutable_source();
  let signatureResult = mutable_source("");
  let signatureTextarea = mutable_source();
  let submitResult = mutable_source(null);
  let signatureTypeLabel = mutable_source("");
  let txBytesInput = mutable_source("");
  let dryRunResult = mutable_source();
  function updateTxBytes(newTxBytes) {
    set(txBytesInput, newTxBytes);
    updatePageQueryParams({ tx: newTxBytes || null });
    processTransactionBytes(newTxBytes);
  }
  function processTransactionBytes(inputString) {
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
  }
  let txBytesTextarea = mutable_source();
  const exampleTx = "AAACAAgAypo7AAAAAAAg0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpECAgABAQAAAQEDAAAAAAEBANKra+ym7GUCu4vTTXPpQ8bRIIfMk38vrNsEbPtnkEqRAhqhmE/Wz9u5hD63usyXx55ZG8kDHwdq9KNGKDXH3pQ2Mj0AAAAAAAAgnPGssCCNJPH94p+4VvX3Fzp32jLZO9zsO5eMsp4LujqznOy0o0pHmEqaslIo0HQKO7U5nouSh6qph3HYLxK94jM9AAAAAAAAIMX/XZSN7Cn09U1FYXDGPcaUk5v9VkmnwMeY1geClYzW0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpHoAwAAAAAAAOBvPAAAAAAAAA==";
  legacy_pre_effect(() => ($queryParamValues(), get(txBytesInput)), () => {
    if ($queryParamValues().tx !== get(txBytesInput)) {
      set(txBytesInput, $queryParamValues().tx);
      processTransactionBytes(get(txBytesInput));
    }
  });
  legacy_pre_effect_reset();
  init();
  var main = root();
  var div = child(main);
  var div_1 = child(div);
  var button = sibling(child(div_1), 2);
  button.__click = [insertExampleTx, updateTxBytes, exampleTx];
  var div_2 = sibling(div_1, 2);
  var textarea = child(div_2);
  textarea.__input = [on_input, updateTxBytes];
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var div_3 = sibling(div, 2);
  var button_1 = child(div_3);
  button_1.__click = [
    signTransaction,
    error,
    signatureResult,
    txBytesInput,
    signatureTypeLabel,
    signatureTextarea
  ];
  var button_2 = sibling(button_1, 2);
  button_2.__click = [
    signPersonalMessage,
    error,
    signatureResult,
    txBytesInput,
    signatureTypeLabel
  ];
  var button_3 = sibling(button_2, 2);
  button_3.__click = [dryRunTransaction, error, dryRunResult, txBytesInput];
  var node = sibling(div_3, 2);
  {
    var consequent = ($$anchor2) => {
      var div_4 = root_1();
      var button_4 = child(div_4);
      button_4.__click = [on_click, dryRunResult];
      var node_1 = sibling(button_4, 4);
      JsonToggleView(node_1, {
        get value() {
          return get(dryRunResult);
        }
      });
      append($$anchor2, div_4);
    };
    if_block(node, ($$render) => {
      if (get(dryRunResult)) $$render(consequent);
    });
  }
  var div_5 = sibling(node, 2);
  var div_6 = child(div_5);
  var text = child(div_6);
  var textarea_1 = sibling(div_6, 2);
  textarea_1.__input = [on_input_1, signatureResult];
  bind_this(textarea_1, ($$value) => set(signatureTextarea, $$value), () => get(signatureTextarea));
  var button_5 = sibling(textarea_1, 2);
  button_5.__click = [
    submitSignedTx,
    error,
    submitResult,
    txBytesInput,
    signatureResult
  ];
  var node_2 = sibling(div_5, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_7 = root_2();
      var node_3 = child(div_7);
      TransactionView(node_3, {
        get value() {
          return get(submitResult);
        }
      });
      append($$anchor2, div_7);
    };
    if_block(node_2, ($$render) => {
      if (get(submitResult)) $$render(consequent_1);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_8 = root_3();
      var text_1 = child(div_8);
      template_effect(() => set_text(text_1, get(error)));
      append($$anchor2, div_8);
    };
    if_block(node_4, ($$render) => {
      if (get(error)) $$render(consequent_2);
    });
  }
  var node_5 = sibling(node_4, 2);
  TransactionView(node_5, {
    get value() {
      return get(value);
    }
  });
  template_effect(() => {
    set_value(textarea, get(txBytesInput));
    set_text(text, get(signatureTypeLabel) || "Signature");
    set_value(textarea_1, get(signatureResult));
  });
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click", "input"]);
export {
  Sign as default
};

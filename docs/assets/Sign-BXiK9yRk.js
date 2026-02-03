import { b as bufferExports } from "./index-CvJZrfk_.js";
import { aB as parseSerializedSignature, y as fromBase64, p as push, O as legacy_pre_effect, r as store_get, g as get, m as mutable_source, n as set, Q as legacy_pre_effect_reset, i as init, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, Z as set_value, e as set_text, k as append, l as pop, v as setup_stores, o as getClient, T as TransactionDataBuilder, u as mutate, z as iotaBcs, A as toBase64, ai as getActiveWallet, aC as get$1, ad as activeAddress, aj as getSelectedChain, al as Transaction, H as each, R as untrack, I as index, B as delegate } from "./index-CDr7_56l.js";
import { b as bind_this } from "./this-CTyDvojv.js";
import { J as JsonToggleView } from "./JsonToggleView-DQHahx-M.js";
import { p as parsePartialSignatures, a as publicKeyFromRawBytes, v as verifyTransactionSignature, b as verifyPersonalMessageSignature, T as TransactionView } from "./TransactionView-BdredupA.js";
import { c as copyToClipboard } from "./formatting-DskCwl5J.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "./page-query-params-Cc8EPqH6.js";
import "./transaction-view-Bd6Jcz_V.js";
import "./explorer-links-Bx4a9wSX.js";
import "./client-pk37ErHK.js";
import "./iota-nano-conversion-B-nf35QL.js";
async function verifySignature(txBytesInput, signatureResult) {
  let status = "checking";
  let error = "";
  let pubkeyPairs = null;
  try {
    const inputString = txBytesInput.trim();
    const signatureString = signatureResult.trim();
    if (!signatureString) {
      status = null;
      return { status, error, pubkeyPairs };
    }
    try {
      const parsed = parseSerializedSignature(signatureString);
      if (parsed.signatureScheme === "MultiSig") {
        const partialSignatures = parsePartialSignatures(parsed.multisig);
        pubkeyPairs = partialSignatures.map((sig) => ({
          signatureScheme: sig.signatureScheme,
          publicKey: sig.publicKey,
          signature: sig.signature
        }));
        status = "valid";
      } else {
        const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
        pubkeyPairs = [
          {
            signatureScheme: parsed.signatureScheme,
            publicKey: pubKey,
            signature: parsed.signature
          }
        ];
      }
    } catch (e) {
      console.error("Error parsing signature:", e);
      status = "invalid";
      error = `Parsing failed: ${e}`;
      return { status, error, pubkeyPairs };
    }
    if (pubkeyPairs && pubkeyPairs.length === 1 && inputString) {
      const pair = pubkeyPairs[0];
      try {
        const txBytes = fromBase64(inputString);
        const verifiedPubKey = await verifyTransactionSignature(txBytes, signatureString);
        if (verifiedPubKey.toBase64() !== pair.publicKey.toBase64()) {
          status = "invalid";
          error = "Public key mismatch";
          return { status, error, pubkeyPairs };
        }
        status = "valid";
      } catch (e) {
        try {
          const messageBytes = new TextEncoder().encode(inputString);
          const verifiedPubKey = await verifyPersonalMessageSignature(
            messageBytes,
            signatureString
          );
          if (verifiedPubKey.toBase64() !== pair.publicKey.toBase64()) {
            status = "invalid";
            error = "Public key mismatch";
            return { status, error, pubkeyPairs };
          }
          status = "valid";
        } catch (e2) {
          status = "invalid";
          error = `Verification failed: ${e2}`;
          return { status, error, pubkeyPairs };
        }
      }
    } else if (pubkeyPairs && pubkeyPairs.length > 1) {
      status = "valid";
    } else {
      status = null;
    }
  } catch (e) {
    status = "invalid";
    error = `Verification error: ${e}`;
  }
  return { status, error, pubkeyPairs };
}
var root_1 = from_html(`<div class="dry-run-result svelte-2sgbh3"><button class="dry-run-close svelte-2sgbh3" aria-label="Close dry run result" title="Close">&#10005;</button> <div class="dry-run-title">Dry Run Result</div> <!></div>`);
var root_2 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">🔍 Verifying signature...</div>`);
var root_3 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">✓ Signature is valid</div>`);
var root_5 = from_html(`<div style="margin-top: 4px; font-size: 12px;"> </div>`);
var root_4 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">✗ Invalid signature <!></div>`);
var root_7 = from_html(`<div class="signature-item svelte-2sgbh3"><div class="signature-header svelte-2sgbh3"> </div> <div class="signature-details svelte-2sgbh3"><div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Public key:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Public key with flag:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Address:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Signature:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div></div></div>`);
var root_6 = from_html(`<div class="signature-details-container svelte-2sgbh3"></div>`);
var root_8 = from_html(`<div style="margin-top: 20px;"><div style="margin-bottom: 6px; font-weight: bold; display: flex; align-items: center; gap: 10px;">Signed Transaction Bytes <button class="copy-button svelte-2sgbh3" style="padding: 4px 10px; font-size: 12px;">Copy</button></div> <textarea readonly="" placeholder="Signed transaction bytes (base64)" class="signature-textarea svelte-2sgbh3" style="height: 100px;"></textarea> <div style="margin-top: 4px; font-size: 12px; color: #666;">This combines the transaction bytes with the signature and can be submitted to
                    the network.</div></div>`);
var root_9 = from_html(`<div style="margin: 20px 0;"><!></div>`);
var root_10 = from_html(`<div style="color: #ef4444; margin: 10px 0;"> </div>`);
var root = from_html(`<main><div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64 encoded or message:</span> <button style="padding: 4px 8px; font-size: 12px;" class="svelte-2sgbh3">Example tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or message" class="svelte-2sgbh3"></textarea></div></div> <div style="margin-top: 20px; display: flex; gap: 10px;"><button class="svelte-2sgbh3">Sign Tx</button> <button class="svelte-2sgbh3">Sign Message</button> <button class="svelte-2sgbh3">Dry Run</button></div> <!> <div><div style="margin-bottom: 6px; font-weight: bold;"> </div> <textarea placeholder="Signature (base64)" class="signature-textarea svelte-2sgbh3"></textarea> <!> <!> <!> <!> <!> <button class="svelte-2sgbh3">Submit Signed Tx</button></div> <!> <!> <!></main>`);
function Sign($$anchor, $$props) {
  push($$props, false);
  const $queryParamValues = () => store_get(queryParamValues, "$queryParamValues", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
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
  let signedTxBytes = mutable_source("");
  let signatureVerificationStatus = mutable_source(null);
  let signatureVerificationError = mutable_source("");
  let signaturePubkeyPairs = mutable_source(null);
  async function dryRunTransaction() {
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
  function updateTxBytes(newTxBytes) {
    set(txBytesInput, newTxBytes);
    updatePageQueryParams({ tx: newTxBytes || null });
    processTransactionBytes(newTxBytes);
  }
  function processTransactionBytes(inputString) {
    if (!inputString) {
      set(value, null);
      return;
    }
    try {
      let txBytes = fromBase64(inputString);
      set(value, TransactionDataBuilder.fromBytes(txBytes));
      mutate(value, get(value).transactionBytes = inputString);
    } catch (e) {
      console.log("error TransactionDataBuilder", e);
      try {
        const signedData = iotaBcs.SenderSignedData.parse(fromBase64(inputString));
        set(value, signedData[0]);
        mutate(value, get(value).rawTransaction = inputString);
        const v1Data = signedData[0].intentMessage.value.V1;
        if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
          const normalizedTxData = {
            version: 2,
            sender: v1Data.sender,
            inputs: v1Data.kind.ProgrammableTransaction.inputs,
            commands: v1Data.kind.ProgrammableTransaction.commands,
            gasData: v1Data.gasData,
            expiration: v1Data.expiration
          };
          const txDataBuilder = new TransactionDataBuilder(normalizedTxData);
          mutate(value, get(value).transactionBytes = toBase64(txDataBuilder.build()));
        }
      } catch (e2) {
        console.log("error SenderSignedData", e2);
        set(value, e2);
      }
    }
  }
  let txBytesTextarea = mutable_source();
  const exampleTx = "AAACAAgAypo7AAAAAAAg0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpECAgABAQAAAQEDAAAAAAEBANKra+ym7GUCu4vTTXPpQ8bRIIfMk38vrNsEbPtnkEqRAhqhmE/Wz9u5hD63usyXx55ZG8kDHwdq9KNGKDXH3pQ2Mj0AAAAAAAAgnPGssCCNJPH94p+4VvX3Fzp32jLZO9zsO5eMsp4LujqznOy0o0pHmEqaslIo0HQKO7U5nouSh6qph3HYLxK94jM9AAAAAAAAIMX/XZSN7Cn09U1FYXDGPcaUk5v9VkmnwMeY1geClYzW0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpHoAwAAAAAAAOBvPAAAAAAAAA==";
  function insertExampleTx() {
    updateTxBytes(exampleTx);
  }
  async function signTransaction() {
    try {
      set(error, "");
      set(signatureResult, "");
      const inputString = get(txBytesInput).trim();
      if (!inputString) {
        set(error, "Please enter transaction bytes");
        return;
      }
      const wallet = getActiveWallet();
      const senderAddress = get$1(activeAddress);
      if (!wallet) {
        set(error, "No wallet available");
        return;
      }
      if (!wallet.signTransaction) {
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
      const result = await wallet.signTransaction({
        transaction: Transaction.from(transactionBytes),
        account: { address: senderAddress },
        // @ts-ignore
        chain: getSelectedChain()
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
  async function signPersonalMessage() {
    try {
      set(error, "");
      set(signatureResult, "");
      const inputString = get(txBytesInput).trim();
      if (!inputString) {
        set(error, "Please enter a message");
        return;
      }
      const wallet = getActiveWallet();
      const senderAddress = get$1(activeAddress);
      if (!wallet) {
        set(error, "No wallet available");
        return;
      }
      if (!wallet.signPersonalMessage) {
        set(error, "Current wallet does not support message signing");
        return;
      }
      const messageBytes = new TextEncoder().encode(inputString);
      const result = await wallet.signPersonalMessage({ message: messageBytes, account: { address: senderAddress } });
      set(signatureTypeLabel, "Message Signature");
      set(signatureResult, result.signature);
    } catch (e) {
      set(error, `Error signing message: ${e}`);
    }
  }
  let verificationTimeout = mutable_source();
  async function verifySignatureLocal() {
    const result = await verifySignature(get(txBytesInput), get(signatureResult));
    set(signatureVerificationStatus, result.status);
    set(signatureVerificationError, result.error);
    set(signaturePubkeyPairs, result.pubkeyPairs);
  }
  function createSignedTxBytes() {
    try {
      if (!get(txBytesInput).trim() || !get(signatureResult).trim()) {
        set(signedTxBytes, "");
        return;
      }
      const txBytes = fromBase64(get(txBytesInput).trim());
      const transactionData = iotaBcs.TransactionData.parse(txBytes);
      const senderSignedData = [
        {
          intentMessage: {
            intent: {
              scope: { TransactionData: null },
              version: { V0: null },
              appId: { Iota: null }
            },
            value: transactionData
          },
          txSignatures: [get(signatureResult).trim()]
          // signature is already base64 encoded
        }
      ];
      const senderSignedDataBytes = iotaBcs.SenderSignedData.serialize(senderSignedData).toBytes();
      set(signedTxBytes, toBase64(senderSignedDataBytes));
    } catch (e) {
      console.error("Error creating signed transaction bytes:", e);
      set(signedTxBytes, "");
    }
  }
  async function submitSignedTx() {
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
  legacy_pre_effect(() => ($queryParamValues(), get(txBytesInput)), () => {
    if ($queryParamValues().tx !== get(txBytesInput)) {
      set(txBytesInput, $queryParamValues().tx);
      processTransactionBytes(get(txBytesInput));
    }
  });
  legacy_pre_effect(() => (get(signatureResult), get(verificationTimeout)), () => {
    if (get(signatureResult).trim() === "") {
      set(signatureVerificationStatus, null);
      set(signaturePubkeyPairs, null);
      set(signedTxBytes, "");
    } else {
      if (get(verificationTimeout)) {
        clearTimeout(get(verificationTimeout));
      }
      set(verificationTimeout, setTimeout(
        () => {
          verifySignatureLocal();
        },
        300
      ));
      createSignedTxBytes();
    }
  });
  legacy_pre_effect_reset();
  init();
  var main = root();
  var div = child(main);
  var div_1 = child(div);
  var button = sibling(child(div_1), 2);
  button.__click = insertExampleTx;
  var div_2 = sibling(div_1, 2);
  var textarea = child(div_2);
  textarea.__input = (e) => updateTxBytes(e.target?.value || "");
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var div_3 = sibling(div, 2);
  var button_1 = child(div_3);
  button_1.__click = signTransaction;
  var button_2 = sibling(button_1, 2);
  button_2.__click = signPersonalMessage;
  var button_3 = sibling(button_2, 2);
  button_3.__click = dryRunTransaction;
  var node = sibling(div_3, 2);
  {
    var consequent = ($$anchor2) => {
      var div_4 = root_1();
      var button_4 = child(div_4);
      button_4.__click = () => set(dryRunResult, void 0);
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
  textarea_1.__input = (e) => set(signatureResult, e.target.value);
  bind_this(textarea_1, ($$value) => set(signatureTextarea, $$value), () => get(signatureTextarea));
  var node_2 = sibling(textarea_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_7 = root_2();
      append($$anchor2, div_7);
    };
    if_block(node_2, ($$render) => {
      if (get(signatureVerificationStatus) === "checking") $$render(consequent_1);
    });
  }
  var node_3 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_8 = root_3();
      append($$anchor2, div_8);
    };
    if_block(node_3, ($$render) => {
      if (get(signatureVerificationStatus) === "valid") $$render(consequent_2);
    });
  }
  var node_4 = sibling(node_3, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_9 = root_4();
      var node_5 = sibling(child(div_9));
      {
        var consequent_3 = ($$anchor3) => {
          var div_10 = root_5();
          var text_1 = child(div_10);
          template_effect(() => set_text(text_1, get(signatureVerificationError)));
          append($$anchor3, div_10);
        };
        if_block(node_5, ($$render) => {
          if (get(signatureVerificationError)) $$render(consequent_3);
        });
      }
      append($$anchor2, div_9);
    };
    if_block(node_4, ($$render) => {
      if (get(signatureVerificationStatus) === "invalid") $$render(consequent_4);
    });
  }
  var node_6 = sibling(node_4, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_11 = root_6();
      each(div_11, 5, () => get(signaturePubkeyPairs), index, ($$anchor3, pair, index2) => {
        var div_12 = root_7();
        var div_13 = child(div_12);
        var text_2 = child(div_13);
        var div_14 = sibling(div_13, 2);
        var div_15 = child(div_14);
        var span = sibling(child(div_15), 2);
        var text_3 = child(span);
        var button_5 = sibling(span, 2);
        button_5.__click = async () => await copyToClipboard(get(pair).publicKey.toBase64());
        var div_16 = sibling(div_15, 2);
        var span_1 = sibling(child(div_16), 2);
        var text_4 = child(span_1);
        var button_6 = sibling(span_1, 2);
        button_6.__click = async () => await copyToClipboard(get(pair).publicKey.toIotaPublicKey());
        var div_17 = sibling(div_16, 2);
        var span_2 = sibling(child(div_17), 2);
        var text_5 = child(span_2);
        var button_7 = sibling(span_2, 2);
        button_7.__click = async () => await copyToClipboard(get(pair).publicKey.toIotaAddress());
        var div_18 = sibling(div_17, 2);
        var span_3 = sibling(child(div_18), 2);
        var text_6 = child(span_3);
        var button_8 = sibling(span_3, 2);
        button_8.__click = async () => await copyToClipboard(bufferExports.Buffer.from(get(pair).signature).toString("base64"));
        template_effect(
          ($0, $1, $2, $3) => {
            set_text(text_2, `Signature #${index2 + 1} (${(get(pair), untrack(() => get(pair).signatureScheme)) ?? ""})`);
            set_text(text_3, $0);
            set_text(text_4, $1);
            set_text(text_5, $2);
            set_text(text_6, $3);
          },
          [
            () => (get(pair), untrack(() => get(pair).publicKey.toBase64())),
            () => (get(pair), untrack(() => get(pair).publicKey.toIotaPublicKey())),
            () => (get(pair), untrack(() => get(pair).publicKey.toIotaAddress())),
            () => (get(pair), untrack(() => bufferExports.Buffer.from(get(pair).signature).toString("base64")))
          ]
        );
        append($$anchor3, div_12);
      });
      append($$anchor2, div_11);
    };
    if_block(node_6, ($$render) => {
      if (get(signaturePubkeyPairs)) $$render(consequent_5);
    });
  }
  var node_7 = sibling(node_6, 2);
  {
    var consequent_6 = ($$anchor2) => {
      var div_19 = root_8();
      var div_20 = child(div_19);
      var button_9 = sibling(child(div_20));
      button_9.__click = async () => await copyToClipboard(get(signedTxBytes));
      var textarea_2 = sibling(div_20, 2);
      template_effect(() => set_value(textarea_2, get(signedTxBytes)));
      append($$anchor2, div_19);
    };
    if_block(node_7, ($$render) => {
      if (get(signedTxBytes)) $$render(consequent_6);
    });
  }
  var button_10 = sibling(node_7, 2);
  button_10.__click = submitSignedTx;
  var node_8 = sibling(div_5, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_21 = root_9();
      var node_9 = child(div_21);
      TransactionView(node_9, {
        get value() {
          return get(submitResult);
        }
      });
      append($$anchor2, div_21);
    };
    if_block(node_8, ($$render) => {
      if (get(submitResult)) $$render(consequent_7);
    });
  }
  var node_10 = sibling(node_8, 2);
  {
    var consequent_8 = ($$anchor2) => {
      var div_22 = root_10();
      var text_7 = child(div_22);
      template_effect(() => set_text(text_7, get(error)));
      append($$anchor2, div_22);
    };
    if_block(node_10, ($$render) => {
      if (get(error)) $$render(consequent_8);
    });
  }
  var node_11 = sibling(node_10, 2);
  TransactionView(node_11, {
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

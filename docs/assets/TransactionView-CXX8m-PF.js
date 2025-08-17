import { a1 as bcs, O as fromB64, p as push, r as prop, w as legacy_pre_effect, j as set, m as mutable_source, x as deep_read_state, g as get, y as legacy_pre_effect_reset, i as init, f as from_html, b as if_block, c as child, k as append, l as pop, G as first_child, s as sibling, C as untrack, t as template_effect, J as set_attribute, d as set_text, I as set_style, K as comment, z as each, A as index, $ as derived_safe_equal, H as text, L as set_class, e as event } from "/iota-utils/assets/index-4fd-VrqG.js";
import { f as formatJsonWithCompactArrays, r as removeKindFields, i as isTransactionData, g as getTransactionData, R as Root } from "/iota-utils/assets/transaction-view-DFglSWHH.js";
import { a as formatNumberWithUnderscores, n as nanoToIota } from "/iota-utils/assets/iota-nano-conversion-KXxdnLTT.js";
function bytesToUtf8(bytes) {
  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Invalid UTF-8";
  }
}
function bcsBytesToInteger(bytes) {
  try {
    const length = bytes.length;
    let type;
    let value;
    switch (length) {
      case 1:
        type = "u8";
        value = bcs.u8().parse(new Uint8Array(bytes)).toString();
        break;
      case 2:
        type = "u16";
        value = bcs.u16().parse(new Uint8Array(bytes)).toString();
        break;
      case 4:
        type = "u32";
        value = bcs.u32().parse(new Uint8Array(bytes)).toString();
        break;
      case 8:
        type = "u64";
        value = bcs.u64().parse(new Uint8Array(bytes)).toString();
        break;
      case 16:
        type = "u128";
        value = bcs.u128().parse(new Uint8Array(bytes)).toString();
        break;
      case 32:
        type = "u256";
        value = bcs.u256().parse(new Uint8Array(bytes)).toString();
        break;
      default:
        if (length <= 8) {
          type = `u${length * 8}`;
          try {
            value = bcs.u64().parse(new Uint8Array(bytes.slice(0, 8))).toString();
          } catch {
            value = `Raw bytes (${length} bytes)`;
          }
        } else {
          type = `bytes(${length})`;
          value = `Raw bytes (${length} bytes)`;
        }
    }
    return { type, value };
  } catch {
    return { type: `bytes(${bytes.length})`, value: "Invalid integer" };
  }
}
function decodeBase64Bytes(base64) {
  try {
    const bytes = fromB64(base64);
    const utf8 = bytesToUtf8(bytes);
    const integer = bcsBytesToInteger(bytes);
    return { bytes, utf8, integer };
  } catch {
    return null;
  }
}
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    const int = parseInt(hex.substr(c, 2), 16);
    bytes.push(int);
  }
  return bytes;
}
var root_2 = from_html(`<span class="time-info svelte-zt1cxl"> </span>`);
var root_3$1 = from_html(`<div class="fee-main"><span class="field-label svelte-zt1cxl">Fee:</span> <span class="gas-fee svelte-zt1cxl"> </span> <span class="field-label svelte-zt1cxl">Storage cost:</span> <span class="field-value svelte-zt1cxl"> </span> <span class="field-label svelte-zt1cxl">Rebate:</span> <span class="field-value svelte-zt1cxl"> </span></div>`);
var root_5 = from_html(`<div class="balance-box negative svelte-zt1cxl"><div class="full-address svelte-zt1cxl"> </div> <div class="amount-value svelte-zt1cxl"> </div></div>`);
var root_6 = from_html(`<div class="balance-box positive svelte-zt1cxl"><div class="full-address svelte-zt1cxl"> </div> <div class="amount-value svelte-zt1cxl"> </div></div>`);
var root_4$1 = from_html(`<div class="section svelte-zt1cxl"><h4 class="svelte-zt1cxl"> </h4> <div class="balance-columns svelte-zt1cxl"><div class="negative-changes svelte-zt1cxl"><h5 class="column-header deleted svelte-zt1cxl"> </h5> <div class="balance-content svelte-zt1cxl"></div></div> <div class="positive-changes svelte-zt1cxl"><h5 class="column-header created svelte-zt1cxl"> </h5> <div class="balance-content svelte-zt1cxl"></div></div></div></div>`);
var root_9 = from_html(`<div class="object-type svelte-zt1cxl"> </div>`);
var root_10 = from_html(`<div class="object-version svelte-zt1cxl"> </div>`);
var root_11 = from_html(`<div class="object-sender svelte-zt1cxl"> </div>`);
var root_12 = from_html(`<details class="state-collapsible svelte-zt1cxl" open><summary class="state-summary svelte-zt1cxl">Previous State:</summary> <div class="object-json svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></details>`);
var root_8 = from_html(`<div class="object-box deleted svelte-zt1cxl"><div class="object-id svelte-zt1cxl"> </div> <!> <!> <!> <!></div>`);
var root_15 = from_html(`<details class="state-collapsible svelte-zt1cxl"><summary class="state-summary svelte-zt1cxl">Previous State:</summary> <div class="object-json svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></details>`);
var root_14 = from_html(`<div class="object-id svelte-zt1cxl"> </div> <!> <details class="state-collapsible svelte-zt1cxl" open><summary class="state-summary svelte-zt1cxl">Current State:</summary> <div class="object-json svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></details>`, 1);
var root_18 = from_html(`<div class="object-type svelte-zt1cxl"> </div>`);
var root_19 = from_html(`<div class="object-owner svelte-zt1cxl"> </div>`);
var root_20 = from_html(`<div class="object-version svelte-zt1cxl"> </div>`);
var root_21 = from_html(`<div class="object-previous-version svelte-zt1cxl"> </div>`);
var root_17 = from_html(`<div class="object-id svelte-zt1cxl"> </div> <!> <!> <!> <!>`, 1);
var root_23 = from_html(`<details class="state-collapsible svelte-zt1cxl"><summary class="state-summary svelte-zt1cxl">Previous State:</summary> <div class="object-json svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></details>`);
var root_22 = from_html(`<div class="object-id svelte-zt1cxl"> </div> <!>`, 1);
var root_13 = from_html(`<div class="object-box mutated svelte-zt1cxl"><!></div>`);
var root_25 = from_html(`<div class="object-id svelte-zt1cxl"> </div> <details class="state-collapsible svelte-zt1cxl" open><summary class="state-summary svelte-zt1cxl">Object State:</summary> <div class="object-json svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></details>`, 1);
var root_28 = from_html(`<div class="object-type svelte-zt1cxl"> </div>`);
var root_29 = from_html(`<div class="object-owner svelte-zt1cxl"> </div>`);
var root_30 = from_html(`<div class="object-version svelte-zt1cxl"> </div>`);
var root_27 = from_html(`<div class="object-id svelte-zt1cxl"> </div> <!> <!> <!>`, 1);
var root_31 = from_html(`<div class="object-id svelte-zt1cxl"> </div>`);
var root_24 = from_html(`<div class="object-box created svelte-zt1cxl"><!></div>`);
var root_7 = from_html(`<div class="section svelte-zt1cxl"><h4 class="svelte-zt1cxl"> </h4> <div class="object-columns-three svelte-zt1cxl"><div class="deleted-objects svelte-zt1cxl"><h5 class="column-header deleted svelte-zt1cxl"> </h5> <div class="object-content svelte-zt1cxl"></div></div> <div class="mutated-objects svelte-zt1cxl"><h5 class="column-header mutated svelte-zt1cxl"> </h5> <div class="object-content svelte-zt1cxl"></div></div> <div class="created-objects svelte-zt1cxl"><h5 class="column-header created svelte-zt1cxl"> </h5> <div class="object-content svelte-zt1cxl"></div></div></div></div>`);
var root_34 = from_html(`<pre class="event-data svelte-zt1cxl"> </pre>`);
var root_33 = from_html(`<div class="event-item svelte-zt1cxl"><span class="event-index svelte-zt1cxl"></span> <span class="event-type svelte-zt1cxl"> </span> <!></div>`);
var root_32 = from_html(`<div class="section svelte-zt1cxl"><details class="events-collapsible svelte-zt1cxl"><summary class="svelte-zt1cxl"> </summary> <div class="events-content"></div></details></div>`);
var root_37 = from_html(`<pre class="svelte-zt1cxl"> </pre>`);
var root_38 = from_html(`<pre class="svelte-zt1cxl"> </pre>`);
var root_36 = from_html(`<div class="command-item svelte-zt1cxl"><span class="command-index svelte-zt1cxl"></span> <span class="command-kind svelte-zt1cxl"> </span> <div class="command-data svelte-zt1cxl"><!></div></div>`);
var root_35 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl"> </span> <div class="commands-list svelte-zt1cxl"></div></div>`);
var root_43 = from_html(`<pre class="svelte-zt1cxl"> </pre>`);
var root_44 = from_html(`<pre class="svelte-zt1cxl"> </pre>`);
var root_45 = from_html(`<pre class="svelte-zt1cxl"> </pre>`);
var root_41 = from_html(`<div class="command-item svelte-zt1cxl"><span class="command-index svelte-zt1cxl"></span> <span class="command-kind svelte-zt1cxl"> </span> <div class="command-data svelte-zt1cxl"><!></div></div>`);
var root_40 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl"> </span> <div class="commands-list svelte-zt1cxl"></div></div>`);
var root_49 = from_html(`<div class="decoded-bytes svelte-zt1cxl"><div class="decoded-item svelte-zt1cxl"><span class="decode-label svelte-zt1cxl">UTF-8:</span> <span class="decode-value svelte-zt1cxl"> </span></div> <div class="decoded-item svelte-zt1cxl"><span class="decode-label svelte-zt1cxl"> </span> <span class="decode-value svelte-zt1cxl"> </span></div> <div class="decoded-item svelte-zt1cxl"><span class="decode-label svelte-zt1cxl">Bytes:</span> <span class="decode-value svelte-zt1cxl"> </span></div></div>`);
var root_47 = from_html(`<div class="input-item svelte-zt1cxl"><span class="input-index svelte-zt1cxl"></span> <span class="input-kind svelte-zt1cxl"> </span> <div class="input-data svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre> <!></div></div>`);
var root_46 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl">Inputs:</span> <div class="inputs-list svelte-zt1cxl"></div></div>`);
var root_52 = from_html(`<div class="input-item svelte-zt1cxl"><span class="input-index svelte-zt1cxl"></span> <span class="input-kind svelte-zt1cxl"> </span> <div class="input-data svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></div>`);
var root_51 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl">Inputs:</span> <div class="inputs-list svelte-zt1cxl"></div></div>`);
var root_56 = from_html(`<span class="separator svelte-zt1cxl">,</span>`);
var root_55 = from_html(`<span class="payment-object svelte-zt1cxl"> </span> <!>`, 1);
var root_53 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl">Gas Data:</span> <div class="gas-info svelte-zt1cxl"><div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Payment:</span> <span class="field-value svelte-zt1cxl"><!></span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Owner:</span> <span class="field-value svelte-zt1cxl"> </span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Price:</span> <span class="field-value svelte-zt1cxl"> </span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Budget:</span> <span class="field-value svelte-zt1cxl"> </span></div></div></div>`);
var root_62 = from_html(`<span class="separator svelte-zt1cxl">,</span>`);
var root_61 = from_html(`<span class="payment-object svelte-zt1cxl"> </span> <!>`, 1);
var root_59 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl">Gas Data:</span> <div class="gas-info svelte-zt1cxl"><div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Payment:</span> <span class="field-value svelte-zt1cxl"><!></span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Owner:</span> <span class="field-value svelte-zt1cxl"> </span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Price:</span> <span class="field-value svelte-zt1cxl"> </span></div> <div class="gas-field svelte-zt1cxl"><span class="field-label svelte-zt1cxl">Budget:</span> <span class="field-value svelte-zt1cxl"> </span></div></div></div>`);
var root_68 = from_html(`<div class="output-bytes svelte-zt1cxl"><span class="bytes-label svelte-zt1cxl">Bytes:</span> <div class="bytes-array svelte-zt1cxl"> </div></div>`);
var root_69 = from_html(`<div class="output-object-type svelte-zt1cxl"><span class="type-label svelte-zt1cxl">Type:</span> <span class="type-value svelte-zt1cxl"> </span></div>`);
var root_67 = from_html(`<div class="reference-output svelte-zt1cxl"><div class="output-header svelte-zt1cxl"><span class="output-index svelte-zt1cxl"></span> <span class="output-type svelte-zt1cxl"> </span></div> <!> <!></div>`);
var root_66 = from_html(`<div class="mutable-references svelte-zt1cxl"><h6 class="svelte-zt1cxl"> </h6> <!></div>`);
var root_72 = from_html(`<div class="return-bytes svelte-zt1cxl"><span class="bytes-label svelte-zt1cxl">Bytes:</span> <div class="bytes-array svelte-zt1cxl"> </div></div>`);
var root_73 = from_html(`<div class="return-object-type svelte-zt1cxl"><span class="type-label svelte-zt1cxl">Type:</span> <span class="type-value svelte-zt1cxl"> </span></div>`);
var root_71 = from_html(`<div class="return-value svelte-zt1cxl"><div class="return-header svelte-zt1cxl"><span class="return-index svelte-zt1cxl"></span></div> <!> <!></div>`);
var root_70 = from_html(`<div class="return-values svelte-zt1cxl"><h6 class="svelte-zt1cxl"> </h6> <!></div>`);
var root_74 = from_html(`<div class="result-raw svelte-zt1cxl"><details class="raw-collapsible svelte-zt1cxl"><summary class="svelte-zt1cxl">Raw Result Data</summary> <pre class="svelte-zt1cxl"> </pre></details></div>`);
var root_65 = from_html(`<div class="dev-inspect-item svelte-zt1cxl"><div class="result-header svelte-zt1cxl"><span class="result-index svelte-zt1cxl"></span></div> <!> <!> <!></div>`);
var root_64 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl"> </span> <div class="dev-inspect-results svelte-zt1cxl"></div></div>`);
var root_76 = from_html(`<div class="raw-result-item svelte-zt1cxl"><div class="raw-result-header svelte-zt1cxl"><span class="raw-result-index svelte-zt1cxl"></span></div> <div class="raw-result-content svelte-zt1cxl"><pre class="svelte-zt1cxl"> </pre></div></div>`);
var root_75 = from_html(`<div class="section svelte-zt1cxl"><span class="svelte-zt1cxl"> </span> <div class="raw-results svelte-zt1cxl"></div></div>`);
var root_1$1 = from_html(`<div class="header-line svelte-zt1cxl"><span class="tx-header svelte-zt1cxl">Transaction</span> <span class="tx-id-short svelte-zt1cxl"> </span> <span class="status svelte-zt1cxl"> </span> <span class="checkpoint-info svelte-zt1cxl"> </span> <!></div> <div class="sender-fee-line svelte-zt1cxl"><div class="sender-section"><span class="field-label svelte-zt1cxl">Sender:</span> <span class="field-value svelte-zt1cxl"> </span></div> <div class="fee-section"><!></div></div> <!> <!> <!> <!> <!> <!> <!> <!>`, 1);
var root_78 = from_html(`<div class="no-data svelte-zt1cxl">No transaction effects data available</div>`);
var root$1 = from_html(`<div class="transaction-effects svelte-zt1cxl"><!></div>`);
function TransactionEffects($$anchor, $$props) {
  push($$props, false);
  const effects = mutable_source();
  const balanceChanges = mutable_source();
  const objectChanges = mutable_source();
  const events = mutable_source();
  const deletedObjects = mutable_source();
  const createdObjects = mutable_source();
  const mutatedObjects = mutable_source();
  const hasValidData = mutable_source();
  let transactionData = prop($$props, "transactionData", 8);
  function formatAmount(amount, coinType) {
    if (!amount) return "";
    const isNegative = amount.startsWith("-");
    const absAmount = amount.replace("-", "");
    let coinTypeStr = "";
    if (typeof coinType === "string") {
      coinTypeStr = coinType;
    } else if (coinType && typeof coinType === "object" && "repr" in coinType) {
      coinTypeStr = coinType.repr;
    }
    let coinSymbol = "Unknown";
    if (coinTypeStr) {
      const parts = coinTypeStr.split("::");
      coinSymbol = parts.length > 2 ? parts[parts.length - 1].toUpperCase() : "Unknown";
    }
    try {
      if (coinTypeStr === "0x2::iota::IOTA") {
        const iotaAmount = nanoToIota(absAmount);
        const prefix = isNegative ? "-" : "+";
        return `${prefix}${iotaAmount} ${coinSymbol}`;
      } else {
        const prefix = isNegative ? "-" : "+";
        const formattedAmount = parseInt(absAmount).toLocaleString();
        return `${prefix}${formattedAmount} ${coinSymbol}`;
      }
    } catch {
      return `${amount} ${coinSymbol}`;
    }
  }
  function formatGasCost(gasSummary) {
    if (!gasSummary) return "";
    const total = BigInt(gasSummary.storageCost || 0) + BigInt(gasSummary.computationCost || 0) - BigInt(gasSummary.storageRebate || 0);
    try {
      return `${nanoToIota(total.toString())} IOTA`;
    } catch {
      return `${formatNumberWithUnderscores(total.toString())} nanos`;
    }
  }
  function getStatusColor(status) {
    const statusString = typeof status === "string" ? status : status?.status;
    switch (statusString?.toUpperCase()) {
      case "SUCCESS":
        return "#28a745";
      case "FAILURE":
      case "FAILED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }
  function getStatusString(status) {
    return typeof status === "string" ? status : status?.status || "Unknown";
  }
  legacy_pre_effect(() => deep_read_state(transactionData()), () => {
    set(effects, transactionData()?.effects);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(balanceChanges, transactionData()?.balanceChanges || get(effects)?.balanceChanges?.nodes || get(effects)?.balanceChanges || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(objectChanges, transactionData()?.objectChanges || get(effects)?.objectChanges?.nodes || get(effects)?.objectChanges || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(events, transactionData()?.events || get(effects)?.events?.nodes || get(effects)?.events || []);
  });
  legacy_pre_effect(() => get(objectChanges), () => {
    set(deletedObjects, get(objectChanges).filter((change) => change.idDeleted === true || change.type === "deleted"));
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    set(createdObjects, [
      ...get(objectChanges).filter((change) => change.idCreated === true || change.type === "created"),
      ...(get(effects)?.created || []).map((obj) => ({
        type: "created",
        objectId: obj.reference?.objectId,
        version: obj.reference?.version,
        digest: obj.reference?.digest,
        owner: obj.owner,
        objectType: ""
      }))
    ]);
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    set(mutatedObjects, [
      ...get(objectChanges).filter((change) => change.idDeleted === false && change.idCreated === false || change.type === "mutated"),
      ...(get(effects)?.mutated || []).map((obj) => ({
        type: "mutated",
        objectId: obj.reference?.objectId,
        version: obj.reference?.version,
        digest: obj.reference?.digest,
        owner: obj.owner,
        objectType: ""
      }))
    ]);
  });
  legacy_pre_effect(() => (get(effects), get(balanceChanges)), () => {
    set(hasValidData, get(effects) && (get(effects).status || get(effects).checkpoint || get(balanceChanges).length > 0));
  });
  legacy_pre_effect_reset();
  init();
  var div = root$1();
  var node = child(div);
  {
    var consequent_47 = ($$anchor2) => {
      var fragment = root_1$1();
      var div_1 = first_child(fragment);
      var span = sibling(child(div_1), 2);
      var text$1 = child(span);
      var span_1 = sibling(span, 2);
      var text_1 = child(span_1);
      var span_2 = sibling(span_1, 2);
      var text_2 = child(span_2);
      var node_1 = sibling(span_2, 2);
      {
        var consequent = ($$anchor3) => {
          var span_3 = root_2();
          var text_3 = child(span_3);
          template_effect(($0) => set_text(text_3, $0), [
            () => (get(effects), deep_read_state(transactionData()), untrack(() => new Date(get(effects).checkpoint?.timestamp || transactionData()?.timestamp).toLocaleString()))
          ]);
          append($$anchor3, span_3);
        };
        if_block(node_1, ($$render) => {
          if (get(effects), deep_read_state(transactionData()), untrack(() => get(effects).checkpoint?.timestamp || transactionData()?.timestamp)) $$render(consequent);
        });
      }
      var div_2 = sibling(div_1, 2);
      var div_3 = child(div_2);
      var span_4 = sibling(child(div_3), 2);
      var text_4 = child(span_4);
      var div_4 = sibling(div_3, 2);
      var node_2 = child(div_4);
      {
        var consequent_1 = ($$anchor3) => {
          var div_5 = root_3$1();
          var span_5 = sibling(child(div_5), 2);
          var text_5 = child(span_5);
          var span_6 = sibling(span_5, 4);
          var text_6 = child(span_6);
          var span_7 = sibling(span_6, 4);
          var text_7 = child(span_7);
          template_effect(
            ($0, $1, $2) => {
              set_text(text_5, $0);
              set_text(text_6, $1);
              set_text(text_7, $2);
            },
            [
              () => (get(effects), untrack(() => formatGasCost(get(effects).gasEffects.gasSummary))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageCost || 0))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageRebate || 0)))
            ]
          );
          append($$anchor3, div_5);
        };
        if_block(node_2, ($$render) => {
          if (get(effects), untrack(() => get(effects).gasEffects?.gasSummary)) $$render(consequent_1);
        });
      }
      var node_3 = sibling(div_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var div_6 = root_4$1();
          var h4 = child(div_6);
          var text_8 = child(h4);
          var div_7 = sibling(h4, 2);
          var div_8 = child(div_7);
          var h5 = child(div_8);
          var text_9 = child(h5);
          var div_9 = sibling(h5, 2);
          each(
            div_9,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_10 = root_5();
              var div_11 = child(div_10);
              var text_10 = child(div_11);
              var div_12 = sibling(div_11, 2);
              var text_11 = child(div_12);
              template_effect(
                ($0) => {
                  set_attribute(div_11, "title", (get(change), untrack(() => get(change).owner?.address)));
                  set_text(text_10, (get(change), untrack(() => get(change).owner?.address)));
                  set_text(text_11, $0);
                },
                [
                  () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
                ]
              );
              append($$anchor4, div_10);
            }
          );
          var div_13 = sibling(div_8, 2);
          var h5_1 = child(div_13);
          var text_12 = child(h5_1);
          var div_14 = sibling(h5_1, 2);
          each(
            div_14,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_15 = root_6();
              var div_16 = child(div_15);
              var text_13 = child(div_16);
              var div_17 = sibling(div_16, 2);
              var text_14 = child(div_17);
              template_effect(
                ($0) => {
                  set_attribute(div_16, "title", (get(change), untrack(() => get(change).owner?.address)));
                  set_text(text_13, (get(change), untrack(() => get(change).owner?.address)));
                  set_text(text_14, $0);
                },
                [
                  () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
                ]
              );
              append($$anchor4, div_15);
            }
          );
          template_effect(
            ($0, $1) => {
              set_text(text_8, `Balance Changes (${(get(balanceChanges), untrack(() => get(balanceChanges).length)) ?? ""}):`);
              set_text(text_9, `Negative Changes (${$0 ?? ""}):`);
              set_text(text_12, `Positive Changes (${$1 ?? ""}):`);
            },
            [
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")).length)),
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")).length))
            ]
          );
          append($$anchor3, div_6);
        };
        if_block(node_3, ($$render) => {
          if (get(balanceChanges), untrack(() => get(balanceChanges).length > 0)) $$render(consequent_2);
        });
      }
      var node_4 = sibling(node_3, 2);
      {
        var consequent_20 = ($$anchor3) => {
          var div_18 = root_7();
          var h4_1 = child(div_18);
          var text_15 = child(h4_1);
          var div_19 = sibling(h4_1, 2);
          var div_20 = child(div_19);
          var h5_2 = child(div_20);
          var text_16 = child(h5_2);
          var div_21 = sibling(h5_2, 2);
          each(div_21, 5, () => get(deletedObjects), index, ($$anchor4, change) => {
            var div_22 = root_8();
            var div_23 = child(div_22);
            var text_17 = child(div_23);
            var node_5 = sibling(div_23, 2);
            {
              var consequent_3 = ($$anchor5) => {
                var div_24 = root_9();
                var text_18 = child(div_24);
                template_effect(() => set_text(text_18, (get(change), untrack(() => get(change).objectType))));
                append($$anchor5, div_24);
              };
              if_block(node_5, ($$render) => {
                if (get(change), untrack(() => get(change).objectType)) $$render(consequent_3);
              });
            }
            var node_6 = sibling(node_5, 2);
            {
              var consequent_4 = ($$anchor5) => {
                var div_25 = root_10();
                var text_19 = child(div_25);
                template_effect(() => set_text(text_19, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                append($$anchor5, div_25);
              };
              if_block(node_6, ($$render) => {
                if (get(change), untrack(() => get(change).version)) $$render(consequent_4);
              });
            }
            var node_7 = sibling(node_6, 2);
            {
              var consequent_5 = ($$anchor5) => {
                var div_26 = root_11();
                var text_20 = child(div_26);
                template_effect(() => set_text(text_20, `Sender: ${(get(change), untrack(() => get(change).sender)) ?? ""}`));
                append($$anchor5, div_26);
              };
              if_block(node_7, ($$render) => {
                if (get(change), untrack(() => get(change).sender)) $$render(consequent_5);
              });
            }
            var node_8 = sibling(node_7, 2);
            {
              var consequent_6 = ($$anchor5) => {
                var details = root_12();
                var div_27 = sibling(child(details), 2);
                var pre = child(div_27);
                var text_21 = child(pre);
                template_effect(($0) => set_text(text_21, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                ]);
                append($$anchor5, details);
              };
              if_block(node_8, ($$render) => {
                if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_6);
              });
            }
            template_effect(() => set_text(text_17, (get(change), untrack(() => get(change).objectId || get(change).address))));
            append($$anchor4, div_22);
          });
          var div_28 = sibling(div_20, 2);
          var h5_3 = child(div_28);
          var text_22 = child(h5_3);
          var div_29 = sibling(h5_3, 2);
          each(div_29, 5, () => get(mutatedObjects), index, ($$anchor4, change) => {
            var div_30 = root_13();
            var node_9 = child(div_30);
            {
              var consequent_8 = ($$anchor5) => {
                var fragment_1 = root_14();
                var div_31 = first_child(fragment_1);
                var text_23 = child(div_31);
                var node_10 = sibling(div_31, 2);
                {
                  var consequent_7 = ($$anchor6) => {
                    var details_1 = root_15();
                    var div_32 = sibling(child(details_1), 2);
                    var pre_1 = child(div_32);
                    var text_24 = child(pre_1);
                    template_effect(($0) => set_text(text_24, $0), [
                      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                    ]);
                    append($$anchor6, details_1);
                  };
                  if_block(node_10, ($$render) => {
                    if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_7);
                  });
                }
                var details_2 = sibling(node_10, 2);
                var div_33 = sibling(child(details_2), 2);
                var pre_2 = child(div_33);
                var text_25 = child(pre_2);
                template_effect(
                  ($0) => {
                    set_text(text_23, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_25, $0);
                  },
                  [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                  ]
                );
                append($$anchor5, fragment_1);
              };
              var alternate_1 = ($$anchor5) => {
                var fragment_2 = comment();
                var node_11 = first_child(fragment_2);
                {
                  var consequent_13 = ($$anchor6) => {
                    var fragment_3 = root_17();
                    var div_34 = first_child(fragment_3);
                    var text_26 = child(div_34);
                    var node_12 = sibling(div_34, 2);
                    {
                      var consequent_9 = ($$anchor7) => {
                        var div_35 = root_18();
                        var text_27 = child(div_35);
                        template_effect(() => set_text(text_27, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_35);
                      };
                      if_block(node_12, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_9);
                      });
                    }
                    var node_13 = sibling(node_12, 2);
                    {
                      var consequent_10 = ($$anchor7) => {
                        var div_36 = root_19();
                        var text_28 = child(div_36);
                        template_effect(() => set_text(text_28, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_36);
                      };
                      if_block(node_13, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_10);
                      });
                    }
                    var node_14 = sibling(node_13, 2);
                    {
                      var consequent_11 = ($$anchor7) => {
                        var div_37 = root_20();
                        var text_29 = child(div_37);
                        template_effect(() => set_text(text_29, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_37);
                      };
                      if_block(node_14, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_11);
                      });
                    }
                    var node_15 = sibling(node_14, 2);
                    {
                      var consequent_12 = ($$anchor7) => {
                        var div_38 = root_21();
                        var text_30 = child(div_38);
                        template_effect(() => set_text(text_30, `Previous Version: ${(get(change), untrack(() => get(change).previousVersion)) ?? ""}`));
                        append($$anchor7, div_38);
                      };
                      if_block(node_15, ($$render) => {
                        if (get(change), untrack(() => get(change).previousVersion)) $$render(consequent_12);
                      });
                    }
                    template_effect(() => set_text(text_26, (get(change), untrack(() => get(change).objectId))));
                    append($$anchor6, fragment_3);
                  };
                  var alternate = ($$anchor6) => {
                    var fragment_4 = root_22();
                    var div_39 = first_child(fragment_4);
                    var text_31 = child(div_39);
                    var node_16 = sibling(div_39, 2);
                    {
                      var consequent_14 = ($$anchor7) => {
                        var details_3 = root_23();
                        var div_40 = sibling(child(details_3), 2);
                        var pre_3 = child(div_40);
                        var text_32 = child(pre_3);
                        template_effect(($0) => set_text(text_32, $0), [
                          () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                        ]);
                        append($$anchor7, details_3);
                      };
                      if_block(node_16, ($$render) => {
                        if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_14);
                      });
                    }
                    template_effect(() => set_text(text_31, (get(change), untrack(() => get(change).address))));
                    append($$anchor6, fragment_4);
                  };
                  if_block(
                    node_11,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_13);
                      else $$render(alternate, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_2);
              };
              if_block(node_9, ($$render) => {
                if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_8);
                else $$render(alternate_1, false);
              });
            }
            append($$anchor4, div_30);
          });
          var div_41 = sibling(div_28, 2);
          var h5_4 = child(div_41);
          var text_33 = child(h5_4);
          var div_42 = sibling(h5_4, 2);
          each(div_42, 5, () => get(createdObjects), index, ($$anchor4, change) => {
            var div_43 = root_24();
            var node_17 = child(div_43);
            {
              var consequent_15 = ($$anchor5) => {
                var fragment_5 = root_25();
                var div_44 = first_child(fragment_5);
                var text_34 = child(div_44);
                var details_4 = sibling(div_44, 2);
                var div_45 = sibling(child(details_4), 2);
                var pre_4 = child(div_45);
                var text_35 = child(pre_4);
                template_effect(
                  ($0) => {
                    set_text(text_34, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_35, $0);
                  },
                  [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                  ]
                );
                append($$anchor5, fragment_5);
              };
              var alternate_3 = ($$anchor5) => {
                var fragment_6 = comment();
                var node_18 = first_child(fragment_6);
                {
                  var consequent_19 = ($$anchor6) => {
                    var fragment_7 = root_27();
                    var div_46 = first_child(fragment_7);
                    var text_36 = child(div_46);
                    var node_19 = sibling(div_46, 2);
                    {
                      var consequent_16 = ($$anchor7) => {
                        var div_47 = root_28();
                        var text_37 = child(div_47);
                        template_effect(() => set_text(text_37, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_47);
                      };
                      if_block(node_19, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_16);
                      });
                    }
                    var node_20 = sibling(node_19, 2);
                    {
                      var consequent_17 = ($$anchor7) => {
                        var div_48 = root_29();
                        var text_38 = child(div_48);
                        template_effect(() => set_text(text_38, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_48);
                      };
                      if_block(node_20, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_17);
                      });
                    }
                    var node_21 = sibling(node_20, 2);
                    {
                      var consequent_18 = ($$anchor7) => {
                        var div_49 = root_30();
                        var text_39 = child(div_49);
                        template_effect(() => set_text(text_39, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_49);
                      };
                      if_block(node_21, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_18);
                      });
                    }
                    template_effect(() => set_text(text_36, (get(change), untrack(() => get(change).objectId))));
                    append($$anchor6, fragment_7);
                  };
                  var alternate_2 = ($$anchor6) => {
                    var div_50 = root_31();
                    var text_40 = child(div_50);
                    template_effect(() => set_text(text_40, (get(change), untrack(() => get(change).address))));
                    append($$anchor6, div_50);
                  };
                  if_block(
                    node_18,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_19);
                      else $$render(alternate_2, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_6);
              };
              if_block(node_17, ($$render) => {
                if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_15);
                else $$render(alternate_3, false);
              });
            }
            append($$anchor4, div_43);
          });
          template_effect(() => {
            set_text(text_15, `Object Changes (${(get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length + get(createdObjects).length + get(mutatedObjects).length + get(deletedObjects).length)) ?? ""}):`);
            set_text(text_16, `Deleted (${(get(deletedObjects), untrack(() => get(deletedObjects).length)) ?? ""}):`);
            set_text(text_22, `Mutated (${(get(mutatedObjects), untrack(() => get(mutatedObjects).length)) ?? ""}):`);
            set_text(text_33, `Created (${(get(createdObjects), untrack(() => get(createdObjects).length)) ?? ""}):`);
          });
          append($$anchor3, div_18);
        };
        if_block(node_4, ($$render) => {
          if (get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length > 0 || get(createdObjects).length > 0 || get(mutatedObjects).length > 0 || get(deletedObjects).length > 0)) $$render(consequent_20);
        });
      }
      var node_22 = sibling(node_4, 2);
      {
        var consequent_22 = ($$anchor3) => {
          var div_51 = root_32();
          var details_5 = child(div_51);
          var summary = child(details_5);
          var text_41 = child(summary);
          var div_52 = sibling(summary, 2);
          each(div_52, 5, () => get(events), index, ($$anchor4, event2, index2) => {
            var div_53 = root_33();
            var span_8 = child(div_53);
            span_8.textContent = `#${index2 + 1}`;
            var span_9 = sibling(span_8, 2);
            var text_42 = child(span_9);
            var node_23 = sibling(span_9, 2);
            {
              var consequent_21 = ($$anchor5) => {
                var pre_5 = root_34();
                var text_43 = child(pre_5);
                template_effect(($0) => set_text(text_43, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), get(event2), untrack(() => formatJsonWithCompactArrays(get(event2).parsedJson)))
                ]);
                append($$anchor5, pre_5);
              };
              if_block(node_23, ($$render) => {
                if (get(event2), untrack(() => get(event2).parsedJson)) $$render(consequent_21);
              });
            }
            template_effect(() => set_text(text_42, (get(event2), untrack(() => get(event2).type || "Unknown"))));
            append($$anchor4, div_53);
          });
          template_effect(() => set_text(text_41, `Events (${(get(events), untrack(() => get(events).length)) ?? ""})`));
          append($$anchor3, div_51);
        };
        if_block(node_22, ($$render) => {
          if (get(events), untrack(() => get(events).length > 0)) $$render(consequent_22);
        });
      }
      var node_24 = sibling(node_22, 2);
      {
        var consequent_24 = ($$anchor3) => {
          var div_54 = root_35();
          var span_10 = child(div_54);
          var text_44 = child(span_10);
          var div_55 = sibling(span_10, 2);
          each(
            div_55,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands)),
            index,
            ($$anchor4, command, index2) => {
              var div_56 = root_36();
              var span_11 = child(div_56);
              span_11.textContent = index2;
              var span_12 = sibling(span_11, 2);
              var text_45 = child(span_12);
              var div_57 = sibling(span_12, 2);
              var node_25 = child(div_57);
              {
                var consequent_23 = ($$anchor5) => {
                  const moveCall = derived_safe_equal(() => (get(command), untrack(() => get(command).MoveCall)));
                  const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                  const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                    function: get(signature),
                    typeArguments: get(moveCall).typeArguments,
                    arguments: get(moveCall).arguments
                  }))));
                  var pre_6 = root_37();
                  var text_46 = child(pre_6);
                  template_effect(($0) => set_text(text_46, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                  ]);
                  append($$anchor5, pre_6);
                };
                var alternate_4 = ($$anchor5) => {
                  var pre_7 = root_38();
                  var text_47 = child(pre_7);
                  template_effect(($0) => set_text(text_47, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(command), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(command))[get(command).$kind])))
                  ]);
                  append($$anchor5, pre_7);
                };
                if_block(node_25, ($$render) => {
                  if (get(command), untrack(() => get(command).$kind === "MoveCall" && get(command).MoveCall)) $$render(consequent_23);
                  else $$render(alternate_4, false);
                });
              }
              template_effect(() => set_text(text_45, (get(command), untrack(() => get(command).$kind))));
              append($$anchor4, div_56);
            }
          );
          template_effect(() => set_text(text_44, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands.length)) ?? ""}):`));
          append($$anchor3, div_54);
        };
        var alternate_7 = ($$anchor3) => {
          var fragment_8 = comment();
          var node_26 = first_child(fragment_8);
          {
            var consequent_27 = ($$anchor4) => {
              var div_58 = root_40();
              var span_13 = child(div_58);
              var text_48 = child(span_13);
              var div_59 = sibling(span_13, 2);
              each(
                div_59,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions)),
                index,
                ($$anchor5, command, index2) => {
                  var div_60 = root_41();
                  var span_14 = child(div_60);
                  span_14.textContent = index2;
                  var span_15 = sibling(span_14, 2);
                  var text_49 = child(span_15);
                  var div_61 = sibling(span_15, 2);
                  var node_27 = child(div_61);
                  {
                    var consequent_26 = ($$anchor6) => {
                      const commandValue = derived_safe_equal(() => (get(command), untrack(() => Object.values(get(command))[0])));
                      var fragment_9 = comment();
                      var node_28 = first_child(fragment_9);
                      {
                        var consequent_25 = ($$anchor7) => {
                          const moveCall = derived_safe_equal(() => get(commandValue));
                          const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                          const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                            function: get(signature),
                            typeArguments: get(moveCall).typeArguments,
                            arguments: get(moveCall).arguments
                          }))));
                          var pre_8 = root_43();
                          var text_50 = child(pre_8);
                          template_effect(($0) => set_text(text_50, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                          ]);
                          append($$anchor7, pre_8);
                        };
                        var alternate_5 = ($$anchor7) => {
                          var pre_9 = root_44();
                          var text_51 = child(pre_9);
                          template_effect(($0) => set_text(text_51, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(commandValue)), untrack(() => formatJsonWithCompactArrays(get(commandValue))))
                          ]);
                          append($$anchor7, pre_9);
                        };
                        if_block(node_28, ($$render) => {
                          if (get(commandValue) && typeof get(commandValue) === "object" && get(commandValue) !== null && "package" in get(commandValue)) $$render(consequent_25);
                          else $$render(alternate_5, false);
                        });
                      }
                      append($$anchor6, fragment_9);
                    };
                    var alternate_6 = ($$anchor6) => {
                      var pre_10 = root_45();
                      var text_52 = child(pre_10);
                      template_effect(($0) => set_text(text_52, $0), [
                        () => (deep_read_state(formatJsonWithCompactArrays), get(command), untrack(() => formatJsonWithCompactArrays(Object.values(get(command))[0])))
                      ]);
                      append($$anchor6, pre_10);
                    };
                    if_block(node_27, ($$render) => {
                      if (get(command), untrack(() => Object.keys(get(command))[0] === "MoveCall")) $$render(consequent_26);
                      else $$render(alternate_6, false);
                    });
                  }
                  template_effect(($0) => set_text(text_49, $0), [
                    () => (get(command), untrack(() => Object.keys(get(command))[0]))
                  ]);
                  append($$anchor5, div_60);
                }
              );
              template_effect(() => set_text(text_48, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions.length)) ?? ""}):`));
              append($$anchor4, div_58);
            };
            if_block(
              node_26,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.transactions?.length)) $$render(consequent_27);
              },
              true
            );
          }
          append($$anchor3, fragment_8);
        };
        if_block(node_24, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands?.length)) $$render(consequent_24);
          else $$render(alternate_7, false);
        });
      }
      var node_29 = sibling(node_24, 2);
      {
        var consequent_30 = ($$anchor3) => {
          var div_62 = root_46();
          var div_63 = sibling(child(div_62), 2);
          each(
            div_63,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs)),
            index,
            ($$anchor4, input, index2) => {
              var div_64 = root_47();
              var span_16 = child(div_64);
              span_16.textContent = index2;
              var span_17 = sibling(span_16, 2);
              var text_53 = child(span_17);
              var div_65 = sibling(span_17, 2);
              var pre_11 = child(div_65);
              var text_54 = child(pre_11);
              var node_30 = sibling(pre_11, 2);
              {
                var consequent_29 = ($$anchor5) => {
                  const decoded = derived_safe_equal(() => (deep_read_state(decodeBase64Bytes), get(input), untrack(() => decodeBase64Bytes(get(input)[get(input).$kind].bytes))));
                  var fragment_10 = comment();
                  var node_31 = first_child(fragment_10);
                  {
                    var consequent_28 = ($$anchor6) => {
                      var div_66 = root_49();
                      var div_67 = child(div_66);
                      var span_18 = sibling(child(div_67), 2);
                      var text_55 = child(span_18);
                      var div_68 = sibling(div_67, 2);
                      var span_19 = child(div_68);
                      var text_56 = child(span_19);
                      var span_20 = sibling(span_19, 2);
                      var text_57 = child(span_20);
                      var div_69 = sibling(div_68, 2);
                      var span_21 = sibling(child(div_69), 2);
                      var text_58 = child(span_21);
                      template_effect(
                        ($0) => {
                          set_text(text_55, (deep_read_state(get(decoded)), untrack(() => get(decoded).utf8)));
                          set_text(text_56, `${(deep_read_state(get(decoded)), untrack(() => get(decoded).integer.type)) ?? ""}:`);
                          set_text(text_57, (deep_read_state(get(decoded)), untrack(() => get(decoded).integer.value)));
                          set_text(text_58, `[${$0 ?? ""}]`);
                        },
                        [
                          () => (deep_read_state(get(decoded)), untrack(() => get(decoded).bytes.join(", ")))
                        ]
                      );
                      append($$anchor6, div_66);
                    };
                    if_block(node_31, ($$render) => {
                      if (get(decoded)) $$render(consequent_28);
                    });
                  }
                  append($$anchor5, fragment_10);
                };
                if_block(node_30, ($$render) => {
                  if (get(input), untrack(() => get(input).$kind === "Pure" && get(input)[get(input).$kind].bytes)) $$render(consequent_29);
                });
              }
              template_effect(
                ($0) => {
                  set_text(text_53, (get(input), untrack(() => get(input).$kind)));
                  set_text(text_54, $0);
                },
                [
                  () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(input), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(input))[get(input).$kind])))
                ]
              );
              append($$anchor4, div_64);
            }
          );
          append($$anchor3, div_62);
        };
        var alternate_8 = ($$anchor3) => {
          var fragment_11 = comment();
          var node_32 = first_child(fragment_11);
          {
            var consequent_31 = ($$anchor4) => {
              var div_70 = root_51();
              var div_71 = sibling(child(div_70), 2);
              each(
                div_71,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.inputs)),
                index,
                ($$anchor5, input, index2) => {
                  const inputData = derived_safe_equal(() => (get(input), untrack(() => ({ valueType: get(input).valueType, value: get(input).value }))));
                  var div_72 = root_52();
                  var span_22 = child(div_72);
                  span_22.textContent = index2;
                  var span_23 = sibling(span_22, 2);
                  var text_59 = child(span_23);
                  var div_73 = sibling(span_23, 2);
                  var pre_12 = child(div_73);
                  var text_60 = child(pre_12);
                  template_effect(
                    ($0) => {
                      set_text(text_59, (get(input), untrack(() => get(input).type)));
                      set_text(text_60, $0);
                    },
                    [
                      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(inputData)), untrack(() => formatJsonWithCompactArrays(get(inputData))))
                    ]
                  );
                  append($$anchor5, div_72);
                }
              );
              append($$anchor4, div_70);
            };
            if_block(
              node_32,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.inputs?.length)) $$render(consequent_31);
              },
              true
            );
          }
          append($$anchor3, fragment_11);
        };
        if_block(node_29, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs?.length)) $$render(consequent_30);
          else $$render(alternate_8, false);
        });
      }
      var node_33 = sibling(node_29, 2);
      {
        var consequent_34 = ($$anchor3) => {
          var div_74 = root_53();
          var div_75 = sibling(child(div_74), 2);
          var div_76 = child(div_75);
          var span_24 = sibling(child(div_76), 2);
          var node_34 = child(span_24);
          {
            var consequent_33 = ($$anchor4) => {
              var fragment_12 = comment();
              var node_35 = first_child(fragment_12);
              each(
                node_35,
                1,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment)),
                index,
                ($$anchor5, payment, index2) => {
                  var fragment_13 = root_55();
                  var span_25 = first_child(fragment_13);
                  var text_61 = child(span_25);
                  var node_36 = sibling(span_25, 2);
                  {
                    var consequent_32 = ($$anchor6) => {
                      var span_26 = root_56();
                      append($$anchor6, span_26);
                    };
                    if_block(node_36, ($$render) => {
                      if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().decodedBCS.intentMessage.value.V1.gasData.payment.length - 1)) $$render(consequent_32);
                    });
                  }
                  template_effect(() => set_text(text_61, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                  append($$anchor5, fragment_13);
                }
              );
              append($$anchor4, fragment_12);
            };
            var alternate_9 = ($$anchor4) => {
              var text_62 = text("N/A");
              append($$anchor4, text_62);
            };
            if_block(node_34, ($$render) => {
              if (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment?.length)) $$render(consequent_33);
              else $$render(alternate_9, false);
            });
          }
          var div_77 = sibling(div_76, 2);
          var span_27 = sibling(child(div_77), 2);
          var text_63 = child(span_27);
          var div_78 = sibling(div_77, 2);
          var span_28 = sibling(child(div_78), 2);
          var text_64 = child(span_28);
          var div_79 = sibling(div_78, 2);
          var span_29 = sibling(child(div_79), 2);
          var text_65 = child(span_29);
          template_effect(
            ($0, $1) => {
              set_text(text_63, (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.owner || "N/A")));
              set_text(text_64, `${$0 ?? ""} nanos`);
              set_text(text_65, `${$1 ?? ""} nanos`);
            },
            [
              () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.price || "0"))),
              () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.budget || "0")))
            ]
          );
          append($$anchor3, div_74);
        };
        var alternate_11 = ($$anchor3) => {
          var fragment_14 = comment();
          var node_37 = first_child(fragment_14);
          {
            var consequent_37 = ($$anchor4) => {
              var div_80 = root_59();
              var div_81 = sibling(child(div_80), 2);
              var div_82 = child(div_81);
              var span_30 = sibling(child(div_82), 2);
              var node_38 = child(span_30);
              {
                var consequent_36 = ($$anchor5) => {
                  var fragment_15 = comment();
                  var node_39 = first_child(fragment_15);
                  each(
                    node_39,
                    1,
                    () => (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment)),
                    index,
                    ($$anchor6, payment, index2) => {
                      var fragment_16 = root_61();
                      var span_31 = first_child(fragment_16);
                      var text_66 = child(span_31);
                      var node_40 = sibling(span_31, 2);
                      {
                        var consequent_35 = ($$anchor7) => {
                          var span_32 = root_62();
                          append($$anchor7, span_32);
                        };
                        if_block(node_40, ($$render) => {
                          if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().input.gasData.payment.length - 1)) $$render(consequent_35);
                        });
                      }
                      template_effect(() => set_text(text_66, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                      append($$anchor6, fragment_16);
                    }
                  );
                  append($$anchor5, fragment_15);
                };
                var alternate_10 = ($$anchor5) => {
                  var text_67 = text("N/A");
                  append($$anchor5, text_67);
                };
                if_block(node_38, ($$render) => {
                  if (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment?.length)) $$render(consequent_36);
                  else $$render(alternate_10, false);
                });
              }
              var div_83 = sibling(div_82, 2);
              var span_33 = sibling(child(div_83), 2);
              var text_68 = child(span_33);
              var div_84 = sibling(div_83, 2);
              var span_34 = sibling(child(div_84), 2);
              var text_69 = child(span_34);
              var div_85 = sibling(div_84, 2);
              var span_35 = sibling(child(div_85), 2);
              var text_70 = child(span_35);
              template_effect(
                ($0, $1) => {
                  set_text(text_68, (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.owner || "N/A")));
                  set_text(text_69, `${$0 ?? ""} nanos`);
                  set_text(text_70, `${$1 ?? ""} nanos`);
                },
                [
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.price || "0"))),
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.budget || "0")))
                ]
              );
              append($$anchor4, div_80);
            };
            if_block(
              node_37,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.gasData)) $$render(consequent_37);
              },
              true
            );
          }
          append($$anchor3, fragment_14);
        };
        if_block(node_33, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.gasData)) $$render(consequent_34);
          else $$render(alternate_11, false);
        });
      }
      var node_41 = sibling(node_33, 2);
      {
        var consequent_45 = ($$anchor3) => {
          var div_86 = root_64();
          var span_36 = child(div_86);
          var text_71 = child(span_36);
          var div_87 = sibling(span_36, 2);
          each(
            div_87,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults)),
            index,
            ($$anchor4, result, index$1) => {
              var div_88 = root_65();
              var div_89 = child(div_88);
              var span_37 = child(div_89);
              span_37.textContent = `Result #${index$1}`;
              var node_42 = sibling(div_89, 2);
              {
                var consequent_40 = ($$anchor5) => {
                  var div_90 = root_66();
                  var h6 = child(div_90);
                  var text_72 = child(h6);
                  var node_43 = sibling(h6, 2);
                  each(
                    node_43,
                    1,
                    () => (get(result), untrack(() => get(result).mutableReferenceOutputs)),
                    index,
                    ($$anchor6, output, outputIndex) => {
                      var div_91 = root_67();
                      var div_92 = child(div_91);
                      var span_38 = child(div_92);
                      span_38.textContent = `Output #${outputIndex}`;
                      var span_39 = sibling(span_38, 2);
                      var text_73 = child(span_39);
                      var node_44 = sibling(div_92, 2);
                      {
                        var consequent_38 = ($$anchor7) => {
                          var div_93 = root_68();
                          var div_94 = sibling(child(div_93), 2);
                          var text_74 = child(div_94);
                          template_effect(($0) => set_text(text_74, `[${$0 ?? ""}]`), [
                            () => (get(output), untrack(() => get(output)[1].join(", ")))
                          ]);
                          append($$anchor7, div_93);
                        };
                        if_block(node_44, ($$render) => {
                          if (get(output), untrack(() => get(output)[1]?.length)) $$render(consequent_38);
                        });
                      }
                      var node_45 = sibling(node_44, 2);
                      {
                        var consequent_39 = ($$anchor7) => {
                          var div_95 = root_69();
                          var span_40 = sibling(child(div_95), 2);
                          var text_75 = child(span_40);
                          template_effect(() => set_text(text_75, (get(output), untrack(() => get(output)[2]))));
                          append($$anchor7, div_95);
                        };
                        if_block(node_45, ($$render) => {
                          if (get(output), untrack(() => get(output)[2])) $$render(consequent_39);
                        });
                      }
                      template_effect(() => set_text(text_73, (get(output), untrack(() => get(output)[0]))));
                      append($$anchor6, div_91);
                    }
                  );
                  template_effect(() => set_text(text_72, `Mutable Reference Outputs (${(get(result), untrack(() => get(result).mutableReferenceOutputs.length)) ?? ""}):`));
                  append($$anchor5, div_90);
                };
                if_block(node_42, ($$render) => {
                  if (get(result), untrack(() => get(result).mutableReferenceOutputs?.length)) $$render(consequent_40);
                });
              }
              var node_46 = sibling(node_42, 2);
              {
                var consequent_43 = ($$anchor5) => {
                  var div_96 = root_70();
                  var h6_1 = child(div_96);
                  var text_76 = child(h6_1);
                  var node_47 = sibling(h6_1, 2);
                  each(node_47, 1, () => (get(result), untrack(() => get(result).returnValues)), index, ($$anchor6, returnValue, returnIndex) => {
                    var div_97 = root_71();
                    var div_98 = child(div_97);
                    var span_41 = child(div_98);
                    span_41.textContent = `Value #${returnIndex}`;
                    var node_48 = sibling(div_98, 2);
                    {
                      var consequent_41 = ($$anchor7) => {
                        var div_99 = root_72();
                        var div_100 = sibling(child(div_99), 2);
                        var text_77 = child(div_100);
                        template_effect(($0) => set_text(text_77, `[${$0 ?? ""}]`), [
                          () => (get(returnValue), untrack(() => get(returnValue)[0].join(", ")))
                        ]);
                        append($$anchor7, div_99);
                      };
                      if_block(node_48, ($$render) => {
                        if (get(returnValue), untrack(() => get(returnValue)[0]?.length)) $$render(consequent_41);
                      });
                    }
                    var node_49 = sibling(node_48, 2);
                    {
                      var consequent_42 = ($$anchor7) => {
                        var div_101 = root_73();
                        var span_42 = sibling(child(div_101), 2);
                        var text_78 = child(span_42);
                        template_effect(() => set_text(text_78, (get(returnValue), untrack(() => get(returnValue)[1]))));
                        append($$anchor7, div_101);
                      };
                      if_block(node_49, ($$render) => {
                        if (get(returnValue), untrack(() => get(returnValue)[1])) $$render(consequent_42);
                      });
                    }
                    append($$anchor6, div_97);
                  });
                  template_effect(() => set_text(text_76, `Return Values (${(get(result), untrack(() => get(result).returnValues.length)) ?? ""}):`));
                  append($$anchor5, div_96);
                };
                if_block(node_46, ($$render) => {
                  if (get(result), untrack(() => get(result).returnValues?.length)) $$render(consequent_43);
                });
              }
              var node_50 = sibling(node_46, 2);
              {
                var consequent_44 = ($$anchor5) => {
                  var div_102 = root_74();
                  var details_6 = child(div_102);
                  var pre_13 = sibling(child(details_6), 2);
                  var text_79 = child(pre_13);
                  template_effect(($0) => set_text(text_79, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), get(result), untrack(() => formatJsonWithCompactArrays(get(result))))
                  ]);
                  append($$anchor5, div_102);
                };
                if_block(node_50, ($$render) => {
                  if (get(result), untrack(() => Object.keys(get(result)).length > 2 || Object.keys(get(result)).length === 1 && !get(result).mutableReferenceOutputs && !get(result).returnValues)) $$render(consequent_44);
                });
              }
              append($$anchor4, div_88);
            }
          );
          template_effect(() => set_text(text_71, `Dev Inspect Results (${(deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults.length)) ?? ""}):`));
          append($$anchor3, div_86);
        };
        if_block(node_41, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.devInspectResults?.length)) $$render(consequent_45);
        });
      }
      var node_51 = sibling(node_41, 2);
      {
        var consequent_46 = ($$anchor3) => {
          var div_103 = root_75();
          var span_43 = child(div_103);
          var text_80 = child(span_43);
          var div_104 = sibling(span_43, 2);
          each(
            div_104,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().results)),
            index,
            ($$anchor4, rawResult, index2) => {
              var div_105 = root_76();
              var div_106 = child(div_105);
              var span_44 = child(div_106);
              span_44.textContent = `Raw Result #${index2}`;
              var div_107 = sibling(div_106, 2);
              var pre_14 = child(div_107);
              var text_81 = child(pre_14);
              template_effect(($0) => set_text(text_81, $0), [
                () => (deep_read_state(formatJsonWithCompactArrays), get(rawResult), untrack(() => formatJsonWithCompactArrays(get(rawResult))))
              ]);
              append($$anchor4, div_105);
            }
          );
          template_effect(() => set_text(text_80, `Raw Results (${(deep_read_state(transactionData()), untrack(() => transactionData().results.length)) ?? ""}):`));
          append($$anchor3, div_103);
        };
        if_block(node_51, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.results?.length)) $$render(consequent_46);
        });
      }
      template_effect(
        ($0, $1, $2) => {
          set_attribute(span, "title", (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
          set_text(text$1, (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
          set_style(span_1, `color: ${$0 ?? ""}`);
          set_text(text_1, $1);
          set_text(text_2, `Checkpoint: ${$2 ?? ""}`);
          set_attribute(span_4, "title", (deep_read_state(transactionData()), untrack(() => transactionData()?.sender)));
          set_text(text_4, (deep_read_state(transactionData()), untrack(() => transactionData()?.sender || "N/A")));
        },
        [
          () => (get(effects), untrack(() => getStatusColor(get(effects).status))),
          () => (get(effects), untrack(() => getStatusString(get(effects).status))),
          () => (deep_read_state(formatNumberWithUnderscores), get(effects), untrack(() => formatNumberWithUnderscores(get(effects).checkpoint?.sequenceNumber || "")))
        ]
      );
      append($$anchor2, fragment);
    };
    var alternate_12 = ($$anchor2) => {
      var fragment_17 = comment();
      var node_52 = first_child(fragment_17);
      {
        var consequent_48 = ($$anchor3) => {
          var div_108 = root_78();
          append($$anchor3, div_108);
        };
        if_block(
          node_52,
          ($$render) => {
            if (!get(hasValidData)) $$render(consequent_48);
          },
          true
        );
      }
      append($$anchor2, fragment_17);
    };
    if_block(node, ($$render) => {
      if (get(effects)) $$render(consequent_47);
      else $$render(alternate_12, false);
    });
  }
  append($$anchor, div);
  pop();
}
var root_1 = from_html(`<div class="formatted-view svelte-150bnt9"><!></div>`);
var root_3 = from_html(`<div class="tree-view svelte-150bnt9"><!></div>`);
var root_4 = from_html(`<div class="json-view svelte-150bnt9"><pre class="svelte-150bnt9"> </pre></div>`);
var root = from_html(`<div class="transaction-view ultra-compact svelte-150bnt9"><div class="view-controls svelte-150bnt9"><button>Formatted View</button> <button>Raw JSON</button> <button>JSON Tree</button></div> <!></div>`);
function TransactionView($$anchor, $$props) {
  push($$props, false);
  let value = prop($$props, "value", 8);
  let viewMode = mutable_source("formatted");
  legacy_pre_effect(() => (deep_read_state(value()), isTransactionData), () => {
    if (value()) {
      if (isTransactionData(value())) {
        set(viewMode, "formatted");
      } else {
        set(viewMode, "json");
      }
    }
  });
  legacy_pre_effect_reset();
  init();
  var div = root();
  var div_1 = child(div);
  var button = child(div_1);
  let classes;
  var button_1 = sibling(button, 2);
  let classes_1;
  var button_2 = sibling(button_1, 2);
  let classes_2;
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_1();
      var node_1 = child(div_2);
      {
        let $0 = derived_safe_equal(() => (deep_read_state(getTransactionData), deep_read_state(value()), untrack(() => getTransactionData(value()))));
        TransactionEffects(node_1, {
          get transactionData() {
            return get($0);
          }
        });
      }
      append($$anchor2, div_2);
    };
    var alternate_1 = ($$anchor2) => {
      var fragment = comment();
      var node_2 = first_child(fragment);
      {
        var consequent_1 = ($$anchor3) => {
          var div_3 = root_3();
          var node_3 = child(div_3);
          Root(node_3, {
            get value() {
              return value();
            },
            defaultExpandedLevel: 1
          });
          append($$anchor3, div_3);
        };
        var alternate = ($$anchor3) => {
          var div_4 = root_4();
          var pre = child(div_4);
          var text2 = child(pre);
          template_effect(($0) => set_text(text2, $0), [
            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(value()), untrack(() => formatJsonWithCompactArrays(value())))
          ]);
          append($$anchor3, div_4);
        };
        if_block(
          node_2,
          ($$render) => {
            if (get(viewMode) === "tree") $$render(consequent_1);
            else $$render(alternate, false);
          },
          true
        );
      }
      append($$anchor2, fragment);
    };
    if_block(node, ($$render) => {
      if (get(viewMode), deep_read_state(isTransactionData), deep_read_state(value()), untrack(() => get(viewMode) === "formatted" && isTransactionData(value()))) $$render(consequent);
      else $$render(alternate_1, false);
    });
  }
  template_effect(
    ($0, $1, $2, $3, $4) => {
      div.hidden = $0;
      button.disabled = $1;
      classes = set_class(button, 1, "svelte-150bnt9", null, classes, $2);
      classes_1 = set_class(button_1, 1, "svelte-150bnt9", null, classes_1, $3);
      classes_2 = set_class(button_2, 1, "svelte-150bnt9", null, classes_2, $4);
    },
    [
      () => (deep_read_state(value()), untrack(() => !value() || Object.keys(value()).length === 0)),
      () => (deep_read_state(isTransactionData), deep_read_state(value()), untrack(() => !isTransactionData(value()))),
      () => ({ active: get(viewMode) === "formatted" }),
      () => ({ active: get(viewMode) === "json" }),
      () => ({ active: get(viewMode) === "tree" })
    ]
  );
  event("click", button, () => set(viewMode, "formatted"));
  event("click", button_1, () => set(viewMode, "json"));
  event("click", button_2, () => set(viewMode, "tree"));
  append($$anchor, div);
  pop();
}
export {
  TransactionView as T,
  bcsBytesToInteger as a,
  bytesToUtf8 as b,
  hexToBytes as h
};

import { p as push, u as onMount, N as store_get, j as set, m as mutable_source, g as get, o as mutate, i as init, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, d as set_text, E as bind_value, e as event, ad as Transaction, at as TransactionDataBuilder, a8 as iotaBcs, k as append, l as pop, Q as setup_stores } from "/iota-utils/assets/index-pHwusbIp.js";
import { b as bind_this } from "/iota-utils/assets/this-DHiozhd5.js";
import { b as bcs, f as fromBase58, t as toBase58 } from "/iota-utils/assets/bcs-B43aCULF.js";
import { b as fromBase64, a as toBase64 } from "/iota-utils/assets/b64-BgM4Sqlt.js";
import { a as toHex } from "/iota-utils/assets/hex-BsUxbKPD.js";
import { t as ternaryToEd25519Hex, c as ternaryToBech32, d as bech32ToTernary, e as ed25519HexToTernary, f as bytesToUtf8, h as bcsBytesToInteger, i as hexToBytes, T as TransactionView } from "/iota-utils/assets/TransactionView-QG7uKgGa.js";
import { n as nanoToIota, i as iotaToNano } from "/iota-utils/assets/iota-nano-conversion-5ps7YHJN.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "/iota-utils/assets/page-query-params-T7IbIqxW.js";
import "/iota-utils/assets/transaction-view-6TG6rbVn.js";
import "/iota-utils/assets/attributes-DCsvkNft.js";
var root_1 = from_html(`<div style="color: red; margin-top: 10px;"> </div>`);
var root = from_html(`<main><div class="wrapper svelte-xku9c2"><div class="box">Bytes:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="bytes like: 1, 2, 3"/></div> <div class="box">Hex:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="hex string"/></div> <div class="box">Base64:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="base64 string"/></div> <div class="box">Base58:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="base58 string"/></div> <div class="box">UTF-8:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="UTF-8 string"/></div> <div class="box"> </div> <div class="box"><input type="string" style="width: 100%;" placeholder="number"/></div></div> <br/> <div class="wrapper svelte-xku9c2"><div class="box">NANO:</div> <div class="box"><input type="string" size="40" placeholder="NANO amount"/> </div> <div class="box">IOTA:</div> <div class="box"><input type="string" size="40" placeholder="IOTA amount"/> </div></div> <br/> <div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64:</span> <button style="padding: 4px 8px; font-size: 12px;">Example signed tx</button> <button style="padding: 4px 8px; font-size: 12px;">Example unsigned tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or JSON" class="svelte-xku9c2"></textarea></div></div> <!> <br/> <span style="float:left">Legacy address conversion:</span> <br/> <div class="wrapper svelte-xku9c2"><div class="box">Address Hex:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="0x6f9e8510b88b0ea4fbc684df90ba310540370a0403067b22cef4971fec3e8bb8"/></div> <div class="box">Address Bech32:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="iota1qpheapgshz9saf8mc6zdly96xyz5qdc2qspsv7ezem6fw8lv869mskn2049"/></div> <div class="box">Legacy address (Ternary):</div> <div class="box"><input type="string" style="width: 100%;" placeholder="TRANSFERCDJWLVPAIXRWNAPXV9WYKVUZWWKXVBE9JBABJ9D9C9F9OEGADYO9CWDAGZHBRWIXLXG9MAJV9RJEOLXSJW"/></div></div> <!></main>`);
function Converter($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
  const queryParamDefaults = {
    hex: "",
    base58: "",
    base64: "",
    utf8: "",
    bcsNumber: "",
    nano: "",
    iota: "",
    txBytes: "",
    addressHex: "",
    addressBech32: "",
    addressTernary: ""
  };
  const pageParams = usePageQueryParams(queryParamDefaults);
  let bytes = mutable_source();
  let hex = mutable_source("");
  let base58 = mutable_source("");
  let base64 = mutable_source("");
  let utf8 = mutable_source("");
  let bcsNumber = mutable_source("");
  let bcsNumberType = mutable_source("");
  let error = mutable_source("");
  let value = mutable_source();
  let nano = mutable_source("");
  let nanoWithUnderscore = mutable_source("");
  let iota = mutable_source("");
  let iotaWithUnderscore = mutable_source("");
  let addressHex = mutable_source("");
  let addressBech32 = mutable_source("");
  let addressTernary = mutable_source("");
  let addressError = mutable_source("");
  let txBytesTextarea = mutable_source();
  const exampleSignedTx = "AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDts1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=";
  const exampleTx = "AAAEAAgAypo7AAAAAAAIAJQ1dwAAAAAAIAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAACAREXOhTD1ALAFUbFQmXDDMBEFMe37BcyQSuxkGbdSdEQMCAAIBAAABAQABAQMAAAAAAQIAAQEDAAABAAEDAAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAAgG17QdHZ+O2o4na/TneylcrvwY7XNDR98PK2ffE16W3cG9SHwAAAAAgOtvL1ilwL7CT/xBDvtdFWeLe23EYPsQOeWmBNM3rMLOOPbshjMcd4lpSlNYarN19Cibrg+b3QfX4zU263nR5UlzYIBoAAAAAIPWQ2HPkYb/8uoCU0bJ+nJUDnnxOrvSuydHPsgLOozz3AACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQDoAwAAAAAAAJBlSwAAAAAAAA==";
  onMount(() => {
    const params = $pageParams();
    if (params.hex) {
      set(hex, params.hex);
      convert(
        1
        /* Hex */
      );
    } else if (params.base58) {
      set(base58, params.base58);
      convert(
        2
        /* Base58 */
      );
    } else if (params.base64) {
      set(base64, params.base64);
      convert(
        3
        /* Base64 */
      );
    } else if (params.utf8) {
      set(utf8, params.utf8);
      convert(
        4
        /* UTF8 */
      );
    } else if (params.bcsNumber) {
      set(bcsNumber, params.bcsNumber);
      convert(
        5
        /* BcsNumber */
      );
    }
    if (params.nano) {
      set(nano, params.nano);
      convertToNano();
    } else if (params.iota) {
      set(iota, params.iota);
      convertToIota();
    }
    if (params.txBytes && get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = params.txBytes);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
    }
    if (params.addressHex) {
      set(addressHex, params.addressHex);
      convertAddress(
        0
        /* Hex */
      );
    } else if (params.addressBech32) {
      set(addressBech32, params.addressBech32);
      convertAddress(
        1
        /* Bech32 */
      );
    } else if (params.addressTernary) {
      set(addressTernary, params.addressTernary);
      convertAddress(
        2
        /* Ternary */
      );
    }
  });
  function insertExampleSignedTx() {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = exampleSignedTx);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
      updatePageQueryParams({ txBytes: exampleSignedTx });
    }
  }
  function insertExampleTx() {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = exampleTx);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
      updatePageQueryParams({ txBytes: exampleTx });
    }
  }
  var SourceType = /* @__PURE__ */ ((SourceType2) => {
    SourceType2[SourceType2["Bytes"] = 0] = "Bytes";
    SourceType2[SourceType2["Hex"] = 1] = "Hex";
    SourceType2[SourceType2["Base58"] = 2] = "Base58";
    SourceType2[SourceType2["Base64"] = 3] = "Base64";
    SourceType2[SourceType2["UTF8"] = 4] = "UTF8";
    SourceType2[SourceType2["BcsNumber"] = 5] = "BcsNumber";
    return SourceType2;
  })(SourceType || {});
  var AddressSourceType = /* @__PURE__ */ ((AddressSourceType2) => {
    AddressSourceType2[AddressSourceType2["Hex"] = 0] = "Hex";
    AddressSourceType2[AddressSourceType2["Bech32"] = 1] = "Bech32";
    AddressSourceType2[AddressSourceType2["Ternary"] = 2] = "Ternary";
    return AddressSourceType2;
  })(AddressSourceType || {});
  function convertAddress(source) {
    set(addressError, "");
    try {
      switch (+source) {
        case 0:
          if (get(addressHex)) {
            let normalizedHex = get(addressHex).trim();
            if (!normalizedHex.startsWith("0x") && !normalizedHex.startsWith("0X")) {
              normalizedHex = "0x" + normalizedHex;
            }
            set(addressTernary, ed25519HexToTernary(normalizedHex));
            set(addressBech32, ternaryToBech32(get(addressTernary)));
            updatePageQueryParams({
              addressHex: get(addressHex),
              addressBech32: null,
              addressTernary: null
            });
          } else {
            set(addressTernary, "");
            set(addressBech32, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
        case 1:
          if (get(addressBech32)) {
            set(addressTernary, bech32ToTernary(get(addressBech32)));
            const hexResult = ternaryToEd25519Hex(get(addressTernary));
            set(addressHex, hexResult.startsWith("0x") ? hexResult : "0x" + hexResult);
            updatePageQueryParams({
              addressBech32: get(addressBech32),
              addressHex: null,
              addressTernary: null
            });
          } else {
            set(addressTernary, "");
            set(addressHex, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
        case 2:
          if (get(addressTernary)) {
            const hexResult = ternaryToEd25519Hex(get(addressTernary));
            set(addressHex, hexResult.startsWith("0x") ? hexResult : "0x" + hexResult);
            set(addressBech32, ternaryToBech32(get(addressTernary)));
            updatePageQueryParams({
              addressTernary: get(addressTernary),
              addressHex: null,
              addressBech32: null
            });
          } else {
            set(addressHex, "");
            set(addressBech32, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
      }
    } catch (err) {
      set(addressError, err.message || err.toString());
    }
  }
  function convert(source) {
    set(error, "");
    try {
      let sourceBytes;
      switch (+source) {
        case 0:
          let bytes_strings = get(bytes).trim().split(",");
          let parsedBytes = [];
          for (let byte_string of bytes_strings) {
            if (Number.isInteger(parseInt(byte_string))) {
              parsedBytes.push(parseInt(byte_string, 10));
            }
          }
          sourceBytes = parsedBytes;
          break;
        case 1:
          if (get(hex).length % 2 != 0) {
            return;
          }
          sourceBytes = hexToBytesLocal(get(hex));
          break;
        case 2:
          sourceBytes = fromBase58(get(base58));
          break;
        case 3:
          sourceBytes = fromBase64(get(base64));
          break;
        case 4:
          sourceBytes = new TextEncoder().encode(get(utf8));
          break;
        case 5:
          if (get(bcsNumber) === "") {
            sourceBytes = [];
            set(bcsNumberType, "");
            break;
          }
          sourceBytes = bcs.u64().serialize(get(bcsNumber)).toBytes();
          break;
      }
      if (source != 0) {
        set(bytes, sourceBytes);
      }
      set(hex, toHex(sourceBytes));
      set(base58, toBase58(sourceBytes));
      set(base64, toBase64(sourceBytes));
      set(utf8, bytesToUtf8(sourceBytes));
      const integerResult = bcsBytesToInteger(sourceBytes);
      set(bcsNumber, integerResult.value);
      if (get(bytes).length === 0) {
        set(bcsNumber, "");
        set(bcsNumberType, "");
      } else {
        set(bcsNumberType, integerResult.type);
      }
    } catch (err) {
      try {
        set(error, JSON.stringify(JSON.parse(err.message).payload.error));
      } catch (e) {
        set(error, err);
      }
    }
    const queryUpdates = {
      hex: null,
      base58: null,
      base64: null,
      utf8: null,
      bcsNumber: null
    };
    switch (+source) {
      case 1:
        if (get(hex)) queryUpdates.hex = get(hex);
        break;
      case 2:
        if (get(base58)) queryUpdates.base58 = get(base58);
        break;
      case 3:
        if (get(base64)) queryUpdates.base64 = get(base64);
        break;
      case 4:
        if (get(utf8)) queryUpdates.utf8 = get(utf8);
        break;
      case 5:
        if (get(bcsNumber)) queryUpdates.bcsNumber = get(bcsNumber);
        break;
    }
    updatePageQueryParams(queryUpdates);
  }
  function hexToBytesLocal(hex2) {
    var re = /^(0[xX])?[A-Fa-f0-9]+$/;
    if (!re.test(hex2)) {
      console.error("invalid hex");
      throw "invalid hex";
    }
    if (hex2.toLowerCase().startsWith("0x")) {
      hex2 = hex2.slice(2, hex2.length);
    }
    return hexToBytes(hex2);
  }
  function convertToIota() {
    set(error, "");
    try {
      if (get(nano)) {
        set(iota, nanoToIota(get(nano)));
        set(iotaWithUnderscore, get(iota).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        set(nanoWithUnderscore, get(nano).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        updatePageQueryParams({ nano: get(nano), iota: null });
      } else {
        set(iota, "");
        updatePageQueryParams({ nano: null, iota: null });
      }
    } catch (err) {
      set(error, err);
    }
  }
  function convertToNano() {
    set(error, "");
    try {
      if (get(iota)) {
        set(nano, iotaToNano(get(iota)));
        set(iotaWithUnderscore, get(iota).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        set(nanoWithUnderscore, get(nano).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        updatePageQueryParams({ iota: get(iota), nano: null });
      } else {
        set(nano, "");
        updatePageQueryParams({ iota: null, nano: null });
      }
    } catch (err) {
      set(error, err);
    }
  }
  init();
  var main = root();
  var div = child(main);
  var div_1 = sibling(child(div), 2);
  var input = child(div_1);
  var div_2 = sibling(div_1, 4);
  var input_1 = child(div_2);
  var div_3 = sibling(div_2, 4);
  var input_2 = child(div_3);
  var div_4 = sibling(div_3, 4);
  var input_3 = child(div_4);
  var div_5 = sibling(div_4, 4);
  var input_4 = child(div_5);
  var div_6 = sibling(div_5, 2);
  var text = child(div_6);
  var div_7 = sibling(div_6, 2);
  var input_5 = child(div_7);
  var div_8 = sibling(div, 4);
  var div_9 = sibling(child(div_8), 2);
  var input_6 = child(div_9);
  var text_1 = sibling(input_6);
  var div_10 = sibling(div_9, 4);
  var input_7 = child(div_10);
  var text_2 = sibling(input_7);
  var div_11 = sibling(div_8, 4);
  var div_12 = child(div_11);
  var button = sibling(child(div_12), 2);
  var button_1 = sibling(button, 2);
  var div_13 = sibling(div_12, 2);
  var textarea = child(div_13);
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var node = sibling(div_11, 2);
  TransactionView(node, {
    get value() {
      return get(value);
    }
  });
  var text_3 = sibling(node, 3);
  var div_14 = sibling(text_3, 5);
  var div_15 = sibling(child(div_14), 2);
  var input_8 = child(div_15);
  var div_16 = sibling(div_15, 4);
  var input_9 = child(div_16);
  var div_17 = sibling(div_16, 4);
  var input_10 = child(div_17);
  var node_1 = sibling(div_14, 2);
  {
    var consequent = ($$anchor2) => {
      var div_18 = root_1();
      var text_4 = child(div_18);
      template_effect(() => set_text(text_4, `Address conversion error: ${get(addressError) ?? ""}`));
      append($$anchor2, div_18);
    };
    if_block(node_1, ($$render) => {
      if (get(addressError)) $$render(consequent);
    });
  }
  template_effect(() => {
    set_text(text, `number (from/to BCS bytes): ${get(bcsNumberType) ?? ""}`);
    set_text(text_1, ` ${get(nanoWithUnderscore) ?? ""}`);
    set_text(text_2, ` ${get(iotaWithUnderscore) ?? ""}`);
    set_text(text_3, ` ${get(error) ?? ""} `);
  });
  bind_value(input, () => get(bytes), ($$value) => set(bytes, $$value));
  event("input", input, () => convert(SourceType.Bytes));
  bind_value(input_1, () => get(hex), ($$value) => set(hex, $$value));
  event("input", input_1, () => convert(SourceType.Hex));
  bind_value(input_2, () => get(base64), ($$value) => set(base64, $$value));
  event("input", input_2, () => convert(SourceType.Base64));
  bind_value(input_3, () => get(base58), ($$value) => set(base58, $$value));
  event("input", input_3, () => convert(SourceType.Base58));
  bind_value(input_4, () => get(utf8), ($$value) => set(utf8, $$value));
  event("input", input_4, () => convert(SourceType.UTF8));
  bind_value(input_5, () => get(bcsNumber), ($$value) => set(bcsNumber, $$value));
  event("input", input_5, () => convert(SourceType.BcsNumber));
  bind_value(input_6, () => get(nano), ($$value) => set(nano, $$value));
  event("input", input_6, () => convertToIota());
  bind_value(input_7, () => get(iota), ($$value) => set(iota, $$value));
  event("input", input_7, () => convertToNano());
  event("click", button, insertExampleSignedTx);
  event("click", button_1, insertExampleTx);
  event("input", textarea, async (event2) => {
    let inputString = event2.target.value;
    if (inputString.trim().startsWith("{")) {
      try {
        let deserializedTxnBuilder;
        try {
          deserializedTxnBuilder = Transaction.from(inputString);
        } catch {
          const jsonData = JSON.parse(inputString);
          deserializedTxnBuilder = Transaction.from(
            // TODO: this is another representation and doesn't work this way:
            // "value": {
            //     "V1": {
            //         "kind": {
            //         "ProgrammableTransaction": {
            jsonData.intentMessage.value
          );
        }
        const txBytes = await deserializedTxnBuilder.build();
        const base64String = toBase64(txBytes);
        if (get(txBytesTextarea)) {
          mutate(txBytesTextarea, get(txBytesTextarea).value = base64String);
        }
        set(value, deserializedTxnBuilder);
        inputString = base64String;
        updatePageQueryParams({ txBytes: base64String });
      } catch (e) {
        console.log("error parsing/serializing JSON", e);
        set(value, e);
      }
    }
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
  bind_value(input_8, () => get(addressHex), ($$value) => set(addressHex, $$value));
  event("input", input_8, () => convertAddress(AddressSourceType.Hex));
  bind_value(input_9, () => get(addressBech32), ($$value) => set(addressBech32, $$value));
  event("input", input_9, () => convertAddress(AddressSourceType.Bech32));
  bind_value(input_10, () => get(addressTernary), ($$value) => set(addressTernary, $$value));
  event("input", input_10, () => convertAddress(AddressSourceType.Ternary));
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  Converter as default
};

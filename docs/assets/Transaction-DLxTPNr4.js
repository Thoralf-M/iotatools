import { p as push, q as onMount, r as store_get, g as get, m as mutable_source, o as mutate, i as init, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, d as set_text, j as append, k as pop, u as setup_stores, l as set, v as getSelectedNetworkConfig, n as getClient, w as fromBase64, x as iotaBcs, T as TransactionDataBuilder, y as toBase64, z as delegate } from "/iota-utils/assets/index-D9eKXWGw.js";
import { b as bind_this } from "/iota-utils/assets/this-CeYJ8Uf4.js";
import { I as IotaGraphQLClient } from "/iota-utils/assets/client-CdaJYALf.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-B9RGeslg.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "/iota-utils/assets/page-query-params-PhZYuIMx.js";
import { g as getTransactionData } from "/iota-utils/assets/transaction-view-WCcFjggq.js";
import "/iota-utils/assets/iota-nano-conversion-BqSiw1-b.js";
var on_click = (_, loadExample, exampleTx) => loadExample(exampleTx);
var on_click_1 = (__1, loadExample, exampleSignedTx) => loadExample(exampleSignedTx);
var root_1 = from_html(`<div class="loading-message svelte-gm9tvi"><div class="spinner svelte-gm9tvi"></div> <span>Loading transaction...</span></div>`);
var root_2 = from_html(`<div class="error-message svelte-gm9tvi"><strong>Error:</strong> </div>`);
var root_4 = from_html(`<span class="input-type-badge svelte-gm9tvi"> </span>`);
var root_3 = from_html(`<div class="transaction-result svelte-gm9tvi"><div class="result-header svelte-gm9tvi"><h3 class="svelte-gm9tvi">Transaction Data</h3> <!></div> <!></div>`);
var root = from_html(`<div class="transaction-page svelte-gm9tvi"><h2 class="svelte-gm9tvi">Transaction Viewer</h2> <div class="input-section svelte-gm9tvi"><label for="tx-input" class="svelte-gm9tvi">Tx digest (base58), Tx bytes (base64), or JSON: <textarea id="tx-input" placeholder="Enter transaction bytes (base64), transaction digest (base58), or JSON..." rows="6" class="svelte-gm9tvi"></textarea></label> <div class="button-group svelte-gm9tvi"><button class="svelte-gm9tvi"> </button> <button class="svelte-gm9tvi"> </button> <div class="divider svelte-gm9tvi"></div> <span class="examples-label svelte-gm9tvi">Examples:</span> <button class="example-btn svelte-gm9tvi">Example Tx (base64)</button> <button class="example-btn svelte-gm9tvi">Example Signed Tx (base64)</button></div></div> <!> <!> <!></div>`);
function Transaction($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
  const queryParamDefaults = { txInput: "" };
  const pageParams = usePageQueryParams(queryParamDefaults);
  let txBytesTextarea = mutable_source();
  let txInput = "";
  let transactionData = mutable_source(null);
  let error = mutable_source("");
  let loading = mutable_source(false);
  let inputType = mutable_source(null);
  let currentCursor = null;
  let hasNextPage = mutable_source(false);
  let loadingLatest = mutable_source(false);
  let loadingPrevious = mutable_source(false);
  onMount(() => {
    const params = $pageParams();
    if (params.txInput && get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = params.txInput);
      const event = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event);
    }
  });
  function detectInputType(input) {
    const trimmed = input.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        JSON.parse(trimmed);
        return "json";
      } catch {
        return null;
      }
    }
    if (/^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(trimmed)) {
      return "base58";
    }
    if (/^[A-Za-z0-9+/]+=*$/.test(trimmed)) {
      return "base64";
    }
    return null;
  }
  async function fetchTransactionByDigest(digest) {
    try {
      set(loading, true);
      set(error, "");
      set(transactionData, null);
      const client = getClient();
      const tx = await client.getTransactionBlock({
        digest,
        options: {
          showInput: true,
          showRawInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
          showRawEffects: true
        }
      });
      set(transactionData, tx);
      if (tx.rawTransaction) {
        try {
          const signedBytes = fromBase64(tx.rawTransaction);
          const signedData = iotaBcs.SenderSignedData.parse(signedBytes);
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
            mutate(transactionData, get(transactionData).transactionBytes = toBase64(txDataBuilder.build()));
          } else {
            mutate(transactionData, get(transactionData).transactionBytes = tx.rawTransaction);
          }
        } catch (e) {
          mutate(transactionData, get(transactionData).transactionBytes = tx.rawTransaction);
        }
      }
      set(inputType, "base58");
      updatePageQueryParams({ txInput: digest });
    } catch (e) {
      set(error, `Failed to fetch transaction: ${e.message || e}`);
      set(transactionData, null);
    } finally {
      set(loading, false);
    }
  }
  async function processInput() {
    const input = txInput.trim();
    if (!input) {
      set(error, "Please enter transaction data");
      return;
    }
    const type = detectInputType(input);
    if (!type) {
      set(error, "Invalid input format. Expected base64 transaction bytes, base58 digest, or JSON.");
      return;
    }
    if (type === "base58") {
      await fetchTransactionByDigest(input);
      return;
    }
    try {
      set(loading, true);
      set(error, "");
      set(transactionData, null);
      if (type === "json") {
        const parsed = JSON.parse(input);
        set(transactionData, parsed);
        set(inputType, "json");
      } else if (type === "base64") {
        let decoded = false;
        try {
          const txBytes = fromBase64(input);
          set(transactionData, TransactionDataBuilder.fromBytes(txBytes));
          mutate(transactionData, get(transactionData).transactionBytes = input);
          set(inputType, "base64");
          decoded = true;
        } catch (e1) {
          console.log("TransactionDataBuilder failed, trying JSON then SenderSignedData:", e1);
          try {
            const jsonData = JSON.parse(input);
            if (jsonData && jsonData.intentMessage && jsonData.txSignatures) {
              set(transactionData, getTransactionData(jsonData));
              set(inputType, "json");
              decoded = true;
            } else {
              throw new Error("Not a signed transaction JSON format");
            }
          } catch (e2) {
            console.log("JSON parsing failed, trying SenderSignedData BCS:", e2);
            try {
              const txBytes = fromBase64(input);
              const signedData = iotaBcs.SenderSignedData.parse(txBytes);
              set(transactionData, signedData[0]);
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
                const transactionBytesForDryRun = toBase64(txDataBuilder.build());
                mutate(transactionData, get(transactionData).transactionBytes = transactionBytesForDryRun);
              } else {
                throw new Error("Unsupported transaction kind");
              }
              set(inputType, "base64");
              decoded = true;
            } catch (e3) {
              console.log("SenderSignedData failed:", e3);
              throw new Error(`Failed to decode base64 transaction. Tried TransactionDataBuilder, JSON, and SenderSignedData formats.`);
            }
          }
        }
      }
      updatePageQueryParams({ txInput: input });
    } catch (e) {
      set(error, `Failed to process transaction: ${e.message || e}`);
      set(transactionData, null);
    } finally {
      set(loading, false);
    }
  }
  async function fetchLatestPTB() {
    var _a, _b, _c, _d;
    try {
      set(loadingLatest, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const graphqlClient = new IotaGraphQLClient({ url: config.graphql });
      const result = await graphqlClient.query({
        query: `
                    query {
                        transactionBlocks(last: 1, filter: {kind: PROGRAMMABLE_TX}) {
                            nodes {
                                digest
                            }
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                `
      });
      const nodes = (_b = (_a = result.data) == null ? void 0 : _a.transactionBlocks) == null ? void 0 : _b.nodes;
      const pageInfo = (_d = (_c = result.data) == null ? void 0 : _c.transactionBlocks) == null ? void 0 : _d.pageInfo;
      if (!nodes || nodes.length === 0) {
        set(error, "No PTB transactions found");
        return;
      }
      const digest = nodes[0].digest;
      currentCursor = (pageInfo == null ? void 0 : pageInfo.startCursor) || null;
      set(hasNextPage, (pageInfo == null ? void 0 : pageInfo.hasPreviousPage) || false);
      txInput = digest;
      if (get(txBytesTextarea)) {
        mutate(txBytesTextarea, get(txBytesTextarea).value = digest);
      }
      await fetchTransactionByDigest(digest);
    } catch (e) {
      set(error, `Failed to fetch latest PTB: ${e.message || e}`);
    } finally {
      set(loadingLatest, false);
    }
  }
  async function fetchPreviousPTB() {
    var _a, _b, _c, _d;
    if (!currentCursor) {
      set(error, "No cursor available for pagination");
      return;
    }
    try {
      set(loadingPrevious, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const graphqlClient = new IotaGraphQLClient({ url: config.graphql });
      const result = await graphqlClient.query({
        query: `
                    query {
                        transactionBlocks(before: "${currentCursor}", last: 1, filter: {kind: PROGRAMMABLE_TX}) {
                            nodes {
                                digest
                            }
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                `
      });
      const nodes = (_b = (_a = result.data) == null ? void 0 : _a.transactionBlocks) == null ? void 0 : _b.nodes;
      const pageInfo = (_d = (_c = result.data) == null ? void 0 : _c.transactionBlocks) == null ? void 0 : _d.pageInfo;
      if (!nodes || nodes.length === 0) {
        set(error, "No more PTB transactions found");
        return;
      }
      const digest = nodes[0].digest;
      currentCursor = (pageInfo == null ? void 0 : pageInfo.startCursor) || null;
      set(hasNextPage, (pageInfo == null ? void 0 : pageInfo.hasPreviousPage) || false);
      txInput = digest;
      if (get(txBytesTextarea)) {
        mutate(txBytesTextarea, get(txBytesTextarea).value = digest);
      }
      await fetchTransactionByDigest(digest);
    } catch (e) {
      set(error, `Failed to fetch previous PTB: ${e.message || e}`);
    } finally {
      set(loadingPrevious, false);
    }
  }
  let inputTimeout = null;
  function handleInput(event) {
    const target = event.target;
    txInput = target.value;
    updatePageQueryParams({ txInput });
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    if (txInput.trim()) {
      inputTimeout = setTimeout(
        () => {
          processInput();
        },
        500
      );
    } else {
      set(transactionData, null);
      set(error, "");
    }
  }
  const exampleSignedTx = "AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDts1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=";
  const exampleTx = "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";
  function loadExample(example) {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = example);
      txInput = example;
      updatePageQueryParams({ txInput: example });
      processInput();
    }
  }
  init();
  var div = root();
  var div_1 = sibling(child(div), 2);
  var label = child(div_1);
  var textarea = sibling(child(label));
  textarea.__input = handleInput;
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var div_2 = sibling(label, 2);
  var button = child(div_2);
  button.__click = fetchLatestPTB;
  var text = child(button);
  var button_1 = sibling(button, 2);
  button_1.__click = fetchPreviousPTB;
  var text_1 = child(button_1);
  var button_2 = sibling(button_1, 6);
  button_2.__click = [on_click, loadExample, exampleTx];
  var button_3 = sibling(button_2, 2);
  button_3.__click = [on_click_1, loadExample, exampleSignedTx];
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_3 = root_1();
      append($$anchor2, div_3);
    };
    if_block(node, ($$render) => {
      if (get(loading)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_4 = root_2();
      var text_2 = sibling(child(div_4));
      template_effect(() => set_text(text_2, ` ${get(error) ?? ""}`));
      append($$anchor2, div_4);
    };
    if_block(node_1, ($$render) => {
      if (get(error)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_5 = root_3();
      var div_6 = child(div_5);
      var node_3 = sibling(child(div_6), 2);
      {
        var consequent_2 = ($$anchor3) => {
          var span = root_4();
          var text_3 = child(span);
          template_effect(() => set_text(text_3, get(inputType)));
          append($$anchor3, span);
        };
        if_block(node_3, ($$render) => {
          if (get(inputType)) $$render(consequent_2);
        });
      }
      var node_4 = sibling(div_6, 2);
      TransactionView(node_4, {
        get value() {
          return get(transactionData);
        }
      });
      append($$anchor2, div_5);
    };
    if_block(node_2, ($$render) => {
      if (get(transactionData) && !get(loading)) $$render(consequent_3);
    });
  }
  template_effect(() => {
    button.disabled = get(loadingLatest);
    set_text(text, get(loadingLatest) ? "Loading..." : "Fetch Latest PTB");
    button_1.disabled = get(loadingPrevious) || !get(hasNextPage);
    set_text(text_1, get(loadingPrevious) ? "Loading..." : "Previous PTB");
  });
  append($$anchor, div);
  pop();
  $$cleanup();
}
delegate(["input", "click"]);
export {
  Transaction as default
};

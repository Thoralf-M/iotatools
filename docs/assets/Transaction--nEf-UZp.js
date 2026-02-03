import { p as push, q as onMount, r as store_get, g as get, m as mutable_source, u as mutate, n as set, i as init, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, e as set_text, k as append, l as pop, v as setup_stores, w as getSelectedNetworkConfig, x as bind_value, o as getClient, y as fromBase64, z as iotaBcs, T as TransactionDataBuilder, A as toBase64, B as delegate } from "./index-CDr7_56l.js";
import { b as bind_this } from "./this-CTyDvojv.js";
import { I as IotaGraphQLClient } from "./client-pk37ErHK.js";
import { g as getTransactionData } from "./transaction-view-Bd6Jcz_V.js";
import { T as TransactionView } from "./TransactionView-BdredupA.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "./page-query-params-Cc8EPqH6.js";
import "./explorer-links-Bx4a9wSX.js";
import "./iota-nano-conversion-B-nf35QL.js";
import "./index-CvJZrfk_.js";
import "./formatting-DskCwl5J.js";
var root_1 = from_html(`<div class="filter-section svelte-1t8rvzv"><div class="filter-row svelte-1t8rvzv"><div class="filter-group svelte-1t8rvzv"><label for="input-object-filter" class="svelte-1t8rvzv">Input Object:</label> <input id="input-object-filter" type="text" placeholder="0x... object ID" class="svelte-1t8rvzv"/></div> <div class="filter-group svelte-1t8rvzv"><label for="function-filter" class="svelte-1t8rvzv">Function (package, package::module, or package::module::function):</label> <input id="function-filter" type="text" placeholder="package::module::function" class="svelte-1t8rvzv"/></div></div></div>`);
var root_2 = from_html(`<div class="error-message svelte-1t8rvzv"><strong>Error:</strong> </div>`);
var root_4 = from_html(`<div class="loading-message svelte-1t8rvzv"><div class="spinner svelte-1t8rvzv"></div> <span>Loading transaction...</span></div>`);
var root_3 = from_html(`<div class="transaction-result svelte-1t8rvzv"><!> <!></div>`);
var root = from_html(`<div class="transaction-page svelte-1t8rvzv"><h2 class="svelte-1t8rvzv">Transaction Viewer</h2> <div class="input-section svelte-1t8rvzv"><label for="tx-input" class="svelte-1t8rvzv">Tx digest (base58), Tx bytes (base64), or JSON: <textarea id="tx-input" placeholder="Enter transaction bytes (base64), transaction digest (base58), or JSON..." rows="6" class="svelte-1t8rvzv"></textarea></label> <div class="button-group svelte-1t8rvzv"><button class="svelte-1t8rvzv"> </button> <button class="svelte-1t8rvzv"> </button> <button class="svelte-1t8rvzv"> </button> <button class="svelte-1t8rvzv">Filter options</button> <div class="divider svelte-1t8rvzv"></div> <span class="examples-label svelte-1t8rvzv">Examples:</span> <button class="example-btn svelte-1t8rvzv">Example Tx (base64)</button> <button class="example-btn svelte-1t8rvzv">Example Signed Tx (base64)</button></div> <!></div> <!> <!></div>`);
function Transaction($$anchor, $$props) {
  push($$props, false);
  const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const queryParamDefaults = { txInput: "", inputObjectFilter: "", functionFilter: "" };
  const pageParams = usePageQueryParams(queryParamDefaults);
  let txBytesTextarea = mutable_source();
  let txInput = "";
  let transactionData = mutable_source(null);
  let error = mutable_source("");
  let loading = mutable_source(false);
  let currentCursor = null;
  let hasPrevious = mutable_source(false);
  let hasNext = mutable_source(false);
  let loadingLatest = mutable_source(false);
  let loadingPrevious = mutable_source(false);
  let loadingNext = mutable_source(false);
  let showFilters = mutable_source(false);
  let inputObjectFilter = mutable_source("");
  let functionFilter = mutable_source("");
  function buildFilter() {
    const filter = { kind: "PROGRAMMABLE_TX" };
    if (get(inputObjectFilter).trim()) {
      filter.inputObject = get(inputObjectFilter).trim();
    }
    if (get(functionFilter).trim()) {
      filter.function = get(functionFilter).trim();
    }
    return filter;
  }
  function hasFilters() {
    return get(inputObjectFilter).trim() || get(functionFilter).trim();
  }
  onMount(() => {
    const params = $pageParams();
    if (params.txInput && get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = params.txInput);
      const event = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event);
    }
    set(inputObjectFilter, params.inputObjectFilter || "");
    set(functionFilter, params.functionFilter || "");
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
      updatePageQueryParams({
        txInput: digest,
        inputObjectFilter: get(inputObjectFilter),
        functionFilter: get(functionFilter)
      });
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
      if (type === "json") {
        const parsed = JSON.parse(input);
        set(transactionData, parsed);
      } else if (type === "base64") {
        let decoded = false;
        try {
          const txBytes = fromBase64(input);
          set(transactionData, TransactionDataBuilder.fromBytes(txBytes));
          mutate(transactionData, get(transactionData).transactionBytes = input);
          decoded = true;
        } catch (e1) {
          console.log("TransactionDataBuilder failed, trying JSON then SenderSignedData:", e1);
          try {
            const jsonData = JSON.parse(input);
            if (jsonData && jsonData.intentMessage && jsonData.txSignatures) {
              set(transactionData, getTransactionData(jsonData));
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
              mutate(transactionData, get(transactionData).rawTransaction = input);
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
              decoded = true;
            } catch (e3) {
              console.log("SenderSignedData failed:", e3);
              throw new Error(`Failed to decode base64 transaction. Tried TransactionDataBuilder, JSON, and SenderSignedData formats.`);
            }
          }
        }
      }
      updatePageQueryParams({
        txInput: input,
        inputObjectFilter: get(inputObjectFilter),
        functionFilter: get(functionFilter)
      });
    } catch (e) {
      set(error, `Failed to process transaction: ${e.message || e}`);
      set(transactionData, null);
    } finally {
      set(loading, false);
    }
  }
  async function fetchLatestPTB() {
    try {
      set(loadingLatest, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const graphqlClient = new IotaGraphQLClient({ url: config.graphql });
      const result = await graphqlClient.query({
        query: `
                    query($filter: TransactionBlockFilter) {
                        transactionBlocks(last: 1, filter: $filter${hasFilters() ? ", scanLimit: 100000000" : ""}) {
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
                `,
        variables: { filter: buildFilter() }
      });
      const nodes = result.data?.transactionBlocks?.nodes;
      const pageInfo = result.data?.transactionBlocks?.pageInfo;
      if (!nodes || nodes.length === 0) {
        set(error, "No PTB transactions found");
        return;
      }
      const digest = nodes[0].digest;
      currentCursor = pageInfo?.startCursor || null;
      set(hasPrevious, pageInfo?.hasPreviousPage || false);
      set(hasNext, false);
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
                    query($cursor: String!, $filter: TransactionBlockFilter) {
                        transactionBlocks(before: $cursor, last: 1, filter: $filter${hasFilters() ? ", scanLimit: 100000000" : ""}) {
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
                `,
        variables: { cursor: currentCursor, filter: buildFilter() }
      });
      const nodes = result.data?.transactionBlocks?.nodes;
      const pageInfo = result.data?.transactionBlocks?.pageInfo;
      if (!nodes || nodes.length === 0) {
        set(error, "No more PTB transactions found");
        return;
      }
      const digest = nodes[0].digest;
      currentCursor = pageInfo?.startCursor || null;
      set(hasPrevious, pageInfo?.hasPreviousPage || false);
      set(hasNext, pageInfo?.hasNextPage || false);
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
  async function fetchNextPTB() {
    if (!currentCursor) {
      set(error, "No cursor available for pagination");
      return;
    }
    try {
      set(loadingNext, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const graphqlClient = new IotaGraphQLClient({ url: config.graphql });
      const result = await graphqlClient.query({
        query: `
                    query($cursor: String!, $filter: TransactionBlockFilter) {
                        transactionBlocks(after: $cursor, first: 1, filter: $filter${hasFilters() ? ", scanLimit: 100000000" : ""}) {
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
                `,
        variables: { cursor: currentCursor, filter: buildFilter() }
      });
      const nodes = result.data?.transactionBlocks?.nodes;
      const pageInfo = result.data?.transactionBlocks?.pageInfo;
      if (!nodes || nodes.length === 0) {
        set(error, "No more PTB transactions found");
        return;
      }
      const digest = nodes[0].digest;
      currentCursor = pageInfo?.startCursor || null;
      set(hasPrevious, pageInfo?.hasPreviousPage || false);
      set(hasNext, pageInfo?.hasNextPage || false);
      txInput = digest;
      if (get(txBytesTextarea)) {
        mutate(txBytesTextarea, get(txBytesTextarea).value = digest);
      }
      await fetchTransactionByDigest(digest);
    } catch (e) {
      set(error, `Failed to fetch next PTB: ${e.message || e}`);
    } finally {
      set(loadingNext, false);
    }
  }
  let inputTimeout = null;
  function handleInput(event) {
    const target = event.target;
    txInput = target.value;
    updatePageQueryParams({
      txInput,
      inputObjectFilter: get(inputObjectFilter),
      functionFilter: get(functionFilter)
    });
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
      updatePageQueryParams({
        txInput: example,
        inputObjectFilter: get(inputObjectFilter),
        functionFilter: get(functionFilter)
      });
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
  var button_2 = sibling(button_1, 2);
  button_2.__click = fetchNextPTB;
  var text_2 = child(button_2);
  var button_3 = sibling(button_2, 2);
  button_3.__click = () => set(showFilters, !get(showFilters));
  var button_4 = sibling(button_3, 6);
  button_4.__click = () => loadExample(exampleTx);
  var button_5 = sibling(button_4, 2);
  button_5.__click = () => loadExample(exampleSignedTx);
  var node = sibling(div_2, 2);
  {
    var consequent = ($$anchor2) => {
      var div_3 = root_1();
      var div_4 = child(div_3);
      var div_5 = child(div_4);
      var input_1 = sibling(child(div_5), 2);
      var div_6 = sibling(div_5, 2);
      var input_2 = sibling(child(div_6), 2);
      template_effect(() => {
        input_1.disabled = get(loading);
        input_2.disabled = get(loading);
      });
      bind_value(input_1, () => get(inputObjectFilter), ($$value) => set(inputObjectFilter, $$value));
      bind_value(input_2, () => get(functionFilter), ($$value) => set(functionFilter, $$value));
      append($$anchor2, div_3);
    };
    if_block(node, ($$render) => {
      if (get(showFilters)) $$render(consequent);
    });
  }
  var node_1 = sibling(div_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_7 = root_2();
      var text_3 = sibling(child(div_7));
      template_effect(() => set_text(text_3, ` ${get(error) ?? ""}`));
      append($$anchor2, div_7);
    };
    if_block(node_1, ($$render) => {
      if (get(error)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_8 = root_3();
      var node_3 = child(div_8);
      {
        var consequent_2 = ($$anchor3) => {
          var div_9 = root_4();
          append($$anchor3, div_9);
        };
        if_block(node_3, ($$render) => {
          if (get(loading)) $$render(consequent_2);
        });
      }
      var node_4 = sibling(node_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          TransactionView($$anchor3, {
            get value() {
              return get(transactionData);
            }
          });
        };
        if_block(node_4, ($$render) => {
          if (get(transactionData)) $$render(consequent_3);
        });
      }
      append($$anchor2, div_8);
    };
    if_block(node_2, ($$render) => {
      if (get(transactionData) || get(loading)) $$render(consequent_4);
    });
  }
  template_effect(() => {
    button.disabled = get(loadingLatest);
    set_text(text, get(loadingLatest) ? "Loading..." : "Fetch Latest PTB");
    button_1.disabled = get(loadingPrevious) || !get(hasPrevious);
    set_text(text_1, get(loadingPrevious) ? "Loading..." : "Previous PTB");
    button_2.disabled = get(loadingNext) || !get(hasNext);
    set_text(text_2, get(loadingNext) ? "Loading..." : "Next PTB");
  });
  append($$anchor, div);
  pop();
  $$cleanup();
}
delegate(["input", "click"]);
export {
  Transaction as default
};

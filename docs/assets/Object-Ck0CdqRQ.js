import { C as render_effect, D as teardown, p as push, E as state, F as proxy, q as onMount, r as store_get, n as set, f as from_html, s as sibling, c as child, G as normalizeIotaAddress, b as if_block, g as get, k as append, l as pop, v as setup_stores, t as template_effect, e as set_text, w as getSelectedNetworkConfig, H as each, I as index, d as set_attribute, J as first_child, j as bind_select_value, K as comment, L as text, B as delegate } from "./index-DPmp7Enz.js";
import { b as bind_this } from "./this-KVY6cC1i.js";
import { I as IotaGraphQLClient } from "./client-BooSyBhg.js";
import { q as queryDynamicFields } from "./dynamic-fields-Dj6hAXxE.js";
import { g as getObjectLink, a as getTransactionLink, b as getAddressLink } from "./explorer-links-Bx4a9wSX.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "./page-query-params-CEcBxckr.js";
import "./index-a-qIJzeT.js";
function bind_property(property, event_name, element, set2, get2) {
  var handler = () => {
    set2(element[property]);
  };
  element.addEventListener(event_name, handler);
  if (get2) {
    render_effect(() => {
      element[property] = get2();
    });
  } else {
    handler();
  }
  if (element === document.body || element === window || element === document) {
    teardown(() => {
      element.removeEventListener(event_name, handler);
    });
  }
}
function detectInputType(input) {
  const trimmed = input.trim();
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    return "hex";
  }
  if (trimmed.includes("::")) {
    return "type";
  }
  return null;
}
async function fetchSingleObjectData(objectId, graphqlUrl) {
  const graphqlClient = new IotaGraphQLClient({
    url: graphqlUrl
  });
  const result = await graphqlClient.query({
    query: `
            query GetObject($id: IotaAddress!) {
                object(address: $id) {
                    address
                    owner {
                        ... on AddressOwner {
                            owner {
                                address
                            }
                        }
                        ... on Shared {
                            initialSharedVersion
                        }
                    }
                    previousTransactionBlock {
                        digest
                    }
                    asMoveObject {
                        contents {
                            type {
                                repr
                            }
                            json
                        }
                    }
                    asMovePackage {
                        modules {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        `,
    variables: {
      id: objectId
    }
  });
  return result.data?.object;
}
async function fetchObjectsByTypeData(type, graphqlUrl, cursor = null, first = 1) {
  const graphqlClient = new IotaGraphQLClient({
    url: graphqlUrl
  });
  const result = await graphqlClient.query({
    query: `
            query GetObjects($type: String!, $cursor: String, $first: Int!) {
                objects(filter: { type: $type }, after: $cursor, first: $first) {
                    nodes {
                        address
                        owner {
                            ... on AddressOwner {
                                owner {
                                    address
                                }
                            }
                            ... on Shared {
                                initialSharedVersion
                            }
                        }
                        previousTransactionBlock {
                            digest
                        }
                        asMoveObject {
                            contents {
                                type {
                                    repr
                                }
                                json
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `,
    variables: {
      type,
      cursor,
      first
    }
  });
  return result.data?.objects || null;
}
async function fetchPackageTypesData(packageId, graphqlUrl) {
  const graphqlClient = new IotaGraphQLClient({
    url: graphqlUrl
  });
  const result = await graphqlClient.query({
    query: `
            query GetPackage($address: IotaAddress!) {
                package(address: $address) {
                    address
                    modules {
                        nodes {
                            name
                            structs {
                                nodes {
                                    name
                                    abilities
                                    typeParameters {
                                        constraints
                                    }
                                    fields {
                                        name
                                        type {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
    variables: {
      address: packageId
    }
  });
  const pkg = result.data?.package;
  if (!pkg) {
    return [];
  }
  const types = [];
  if (pkg.modules && pkg.modules.nodes) {
    pkg.modules.nodes.forEach((module) => {
      if (module.structs && module.structs.nodes) {
        module.structs.nodes.forEach((struct) => {
          if (struct.abilities && struct.abilities.includes("KEY")) {
            types.push({
              fullType: `${pkg.address}::${module.name}::${struct.name}`,
              displayType: `${module.name}::${struct.name}`,
              module: module.name,
              name: struct.name,
              abilities: struct.abilities,
              fields: struct.fields
            });
          }
        });
      }
    });
  }
  return types;
}
var root_1 = from_html(`<div class="error-message svelte-h7f06r"><strong>Error:</strong> </div>`);
var root_2 = from_html(`<div class="loading-message svelte-h7f06r"><div class="spinner svelte-h7f06r"></div> <span>Loading...</span></div>`);
var root_5 = from_html(`<a target="_blank" class="address-link svelte-h7f06r"> </a>`);
var root_4 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Owner:</strong> <span class="svelte-h7f06r"><!></span></div>`);
var root_9 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Last tx:</strong> <span class="svelte-h7f06r"><a target="_blank" class="address-link svelte-h7f06r"> </a></span></div>`);
var root_11 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Type:</strong> <code class="svelte-h7f06r"> </code></div>`);
var root_12 = from_html(`<details class="dynamic-fields-details svelte-h7f06r"><summary class="dynamic-fields-summary svelte-h7f06r"><strong> </strong></summary> <pre class="json-content svelte-h7f06r"> </pre></details>`);
var root_10 = from_html(`<!> <div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Contents:</strong> <button class="dynamic-fields-btn svelte-h7f06r"> </button></div> <pre class="json-content svelte-h7f06r"> </pre> <!>`, 1);
var root_3 = from_html(`<div class="objects-list svelte-h7f06r"><h3 class="svelte-h7f06r">Object Details</h3> <div class="object-item svelte-h7f06r"><details class="object-details svelte-h7f06r"><summary class="object-summary svelte-h7f06r"><code class="object-address svelte-h7f06r"> </code> <button class="explorer-btn svelte-h7f06r">Explorer</button></summary> <div class="object-details-content svelte-h7f06r"><!> <!> <!></div></details></div></div>`);
var root_14 = from_html(`<button class="type-btn svelte-h7f06r"><code class="svelte-h7f06r"> </code></button>`);
var root_13 = from_html(`<div class="package-types svelte-h7f06r"><h3 class="svelte-h7f06r">Package Types</h3> <div class="package-id svelte-h7f06r"><strong class="svelte-h7f06r">Package:</strong> <code class="svelte-h7f06r"> </code></div> <p>Click on a type to search for objects of that type:</p> <div class="types-list"></div></div>`);
var root_16 = from_html(`<button class="load-more-btn svelte-h7f06r"> </button>`);
var root_19 = from_html(`<a target="_blank" class="address-link svelte-h7f06r"> </a>`);
var root_18 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Owner:</strong> <span class="svelte-h7f06r"><!></span></div>`);
var root_23 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Last tx:</strong> <span class="svelte-h7f06r"><a target="_blank" class="address-link svelte-h7f06r"> </a></span></div>`);
var root_25 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Type:</strong> <code class="svelte-h7f06r"> </code></div>`);
var root_26 = from_html(`<details class="dynamic-fields-details svelte-h7f06r"><summary class="dynamic-fields-summary svelte-h7f06r"><strong> </strong></summary> <pre class="json-content svelte-h7f06r"> </pre></details>`);
var root_24 = from_html(`<!> <div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Contents:</strong> <button class="dynamic-fields-btn svelte-h7f06r"> </button></div> <pre class="json-content svelte-h7f06r"> </pre> <!>`, 1);
var root_17 = from_html(`<div class="object-item svelte-h7f06r"><details class="object-details svelte-h7f06r"><summary class="object-summary svelte-h7f06r"><code class="object-address svelte-h7f06r"> </code> <button class="explorer-btn svelte-h7f06r">Explorer</button></summary> <div class="object-details-content svelte-h7f06r"><!> <!> <!></div></details></div>`);
var root_27 = from_html(`<button class="load-more-btn bottom-load-more svelte-h7f06r"> </button>`);
var root_15 = from_html(`<div class="objects-list svelte-h7f06r"><div class="objects-header svelte-h7f06r"><div class="header-controls svelte-h7f06r"><div class="expand-controls svelte-h7f06r"><button class="svelte-h7f06r">Expand All</button> <button class="svelte-h7f06r">Collapse All</button></div> <!> <div class="page-size-control svelte-h7f06r"><label for="page-size" class="svelte-h7f06r">Page Size:</label> <select id="page-size" class="svelte-h7f06r"><option>1</option><option>10</option><option>20</option><option>50</option></select></div></div> <h3 class="svelte-h7f06r"> </h3></div> <!> <!></div>`);
var root = from_html(`<div class="object-page svelte-h7f06r"><h3 class="svelte-h7f06r">Object Viewer</h3> <div class="input-section svelte-h7f06r"><div class="input-header svelte-h7f06r"><label for="object-input" class="svelte-h7f06r">Object ID (hex), Object Type, or Package ID:</label> <div class="examples-section svelte-h7f06r"><span class="svelte-h7f06r">Examples:</span> <div class="button-group svelte-h7f06r"><button class="svelte-h7f06r">IOTA Framework</button> <button class="svelte-h7f06r">System Package</button> <button class="svelte-h7f06r">Clock Object</button> <button class="svelte-h7f06r">IOTA-Names testnet</button> <button class="svelte-h7f06r">IOTA-Names mainnet</button></div></div></div> <input type="text" id="object-input" placeholder="Enter object ID (0x...), type (0x2::coin::Coin), or package ID (0x...)" class="svelte-h7f06r"/></div> <!> <!> <!> <!> <!></div>`);
function Object$1($$anchor, $$props) {
  push($$props, true);
  const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const queryParamDefaults = { objectInput: "", pageSize: "1" };
  const pageParams = usePageQueryParams(queryParamDefaults);
  let objectInputTextarea;
  let objectInput = "";
  let pageSize = state("1");
  let currentInputType = state(null);
  let objectData = state(null);
  let objectsList = state(proxy([]));
  let packageTypes = state(proxy([]));
  let error = state("");
  let loading = state(false);
  let mode = state("single");
  let currentCursor = state(null);
  let hasNext = state(false);
  let loadingNext = state(false);
  let dynamicFieldsMap = state(proxy(/* @__PURE__ */ new Map()));
  let dynamicFieldsLoading = state(proxy(/* @__PURE__ */ new Map()));
  let dynamicFieldsInitiallyOpen = state(proxy(/* @__PURE__ */ new Map()));
  async function fetchSingleObject(objectId) {
    try {
      set(loading, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const obj = await fetchSingleObjectData(objectId, config.graphql);
      if (!obj) {
        set(error, "Object not found");
        set(objectData, null);
        return;
      }
      set(objectData, obj, true);
      set(objectsList, [], true);
      set(packageTypes, [], true);
      set(mode, "single");
    } catch (e) {
      set(error, `Failed to fetch object: ${e.message || e}`);
      set(objectData, null);
    } finally {
      set(loading, false);
    }
  }
  async function queryDynamicFieldsForObject(objectId) {
    get(dynamicFieldsLoading).set(objectId, true);
    set(dynamicFieldsLoading, new Map(get(dynamicFieldsLoading)), true);
    const result = await queryDynamicFields({
      objectId,
      pageSize: 50,
      graphqlUrl: getSelectedNetworkConfig().graphql
    });
    if (result.error) {
      console.error("Error fetching dynamic fields:", result.error);
      get(dynamicFieldsMap).set(objectId, []);
    } else {
      get(dynamicFieldsMap).set(objectId, result.nodes);
      get(dynamicFieldsInitiallyOpen).set(objectId, true);
    }
    get(dynamicFieldsLoading).set(objectId, false);
    set(dynamicFieldsLoading, new Map(get(dynamicFieldsLoading)), true);
    set(dynamicFieldsMap, new Map(get(dynamicFieldsMap)), true);
    set(dynamicFieldsInitiallyOpen, new Map(get(dynamicFieldsInitiallyOpen)), true);
  }
  async function fetchObjectsByType(type, cursor = null) {
    try {
      set(loading, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const objects = await fetchObjectsByTypeData(type, config.graphql, cursor, parseInt(get(pageSize)));
      if (!objects || !objects.nodes) {
        set(error, "No objects found");
        set(objectsList, [], true);
        return;
      }
      if (cursor) {
        const startIndex = get(objectsList).length;
        set(objectsList, [...get(objectsList), ...objects.nodes], true);
        if (get(allExpanded)) {
          objects.nodes.forEach((_, i) => {
            get(expandedObjects)[startIndex + i] = true;
          });
        }
      } else {
        set(objectsList, objects.nodes, true);
        set(expandedObjects, {}, true);
        set(allExpanded, false);
      }
      set(currentCursor, objects.pageInfo.endCursor, true);
      set(hasNext, objects.pageInfo.hasNextPage, true);
      set(objectData, null);
      if (get(mode) !== "package") {
        set(packageTypes, [], true);
        set(mode, "list");
      }
    } catch (e) {
      set(error, `Failed to fetch objects: ${e.message || e}`);
      set(objectsList, [], true);
    } finally {
      set(loading, false);
    }
  }
  async function fetchPackageTypes(packageId) {
    try {
      set(loading, true);
      set(error, "");
      const config = getSelectedNetworkConfig();
      const graphqlClient = new IotaGraphQLClient({ url: config.graphql });
      const types = await fetchPackageTypesData(packageId, config.graphql);
      set(packageTypes, types, true);
      if (types.length === 0) {
        return;
      }
      set(objectData, null);
      set(objectsList, [], true);
      set(mode, "package");
    } catch (e) {
      throw e;
    } finally {
      set(loading, false);
    }
  }
  async function processInput() {
    const input = objectInput.trim();
    if (!input) {
      set(error, "Please enter object ID, type, or package ID");
      return;
    }
    const type = detectInputType(input);
    set(currentInputType, type, true);
    if (!type) {
      set(error, "Invalid input format. Expected hex address (0x...) or type (containing ::)");
      return;
    }
    if (type === "hex") {
      try {
        await fetchSingleObject(input);
        if (get(objectData) && get(objectData).asMovePackage) {
          await fetchPackageTypes(input);
        } else {
          updatePageQueryParams({ objectInput: input });
        }
        return;
      } catch (e) {
        await fetchPackageTypes(input);
      }
    } else if (type === "type") {
      await fetchObjectsByType(input);
    }
    updatePageQueryParams({ objectInput: input });
  }
  async function loadNextPage() {
    if (!get(currentCursor) || !get(hasNext)) return;
    try {
      set(loadingNext, true);
      const input = objectInput.trim();
      await fetchObjectsByType(input, get(currentCursor));
    } finally {
      set(loadingNext, false);
    }
  }
  async function searchType(type) {
    objectInput = type;
    if (objectInputTextarea) {
      objectInputTextarea.value = type;
    }
    await fetchObjectsByType(type);
    updatePageQueryParams({ objectInput: type });
  }
  function handlePageSizeChange() {
    updatePageQueryParams({ pageSize: get(pageSize) });
  }
  const loadExample = async (example) => {
    if (objectInputTextarea) {
      objectInputTextarea.value = example;
      objectInput = example;
      updatePageQueryParams({ objectInput: example });
      await processInput();
    }
  };
  onMount(() => {
    const params = $pageParams();
    if (params.objectInput && objectInputTextarea) {
      objectInputTextarea.value = params.objectInput;
      const event = new Event("input", { bubbles: true });
      objectInputTextarea.dispatchEvent(event);
    }
    set(pageSize, params.pageSize, true);
  });
  let expandedObjects = state(proxy({}));
  let singleObjectExpanded = state(true);
  let inputTimeout = state(null);
  let allExpanded = state(false);
  function expandAllObjects() {
    get(objectsList).forEach((_, i) => get(expandedObjects)[i] = true);
    set(allExpanded, true);
  }
  function collapseAllObjects() {
    set(expandedObjects, {}, true);
    set(allExpanded, false);
  }
  function handleInput(event) {
    const target = event.target;
    objectInput = target.value;
    updatePageQueryParams({ objectInput });
    if (get(inputTimeout)) {
      clearTimeout(get(inputTimeout));
    }
    if (objectInput.trim()) {
      set(
        inputTimeout,
        setTimeout(
          () => {
            processInput();
          },
          500
        ),
        true
      );
    } else {
      set(objectData, null);
      set(objectsList, [], true);
      set(packageTypes, [], true);
      set(error, "");
    }
  }
  var div = root();
  var div_1 = sibling(child(div), 2);
  var div_2 = child(div_1);
  var div_3 = sibling(child(div_2), 2);
  var div_4 = sibling(child(div_3), 2);
  var button = child(div_4);
  button.__click = () => loadExample("0x2");
  var button_1 = sibling(button, 2);
  button_1.__click = () => loadExample("0x3");
  var button_2 = sibling(button_1, 2);
  button_2.__click = () => loadExample(normalizeIotaAddress("0x6"));
  var button_3 = sibling(button_2, 2);
  button_3.__click = () => loadExample("0x7fff6e95f385349bec98d17121ab2bfa3e134f2f0b1ccefc270313415f7835ea");
  var button_4 = sibling(button_3, 2);
  button_4.__click = () => loadExample("0x6d2c743607ef275bd6934fe5c2a7e5179cca6fbd2049cfa79de2310b74f3cf83");
  var input_1 = sibling(div_2, 2);
  input_1.__input = handleInput;
  bind_this(input_1, ($$value) => objectInputTextarea = $$value, () => objectInputTextarea);
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_5 = root_1();
      var text2 = sibling(child(div_5));
      template_effect(() => set_text(text2, ` ${get(error) ?? ""}`));
      append($$anchor2, div_5);
    };
    if_block(node, ($$render) => {
      if (get(error)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_6 = root_2();
      append($$anchor2, div_6);
    };
    if_block(node_1, ($$render) => {
      if (get(loading)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var div_7 = root_3();
      var div_8 = sibling(child(div_7), 2);
      var details = child(div_8);
      var summary = child(details);
      var code = child(summary);
      var text_1 = child(code);
      var button_5 = sibling(code, 2);
      button_5.__click = () => window.open(getObjectLink(getSelectedNetworkConfig(), get(objectData).address), "_blank");
      var div_9 = sibling(summary, 2);
      var node_3 = child(div_9);
      {
        var consequent_4 = ($$anchor3) => {
          var div_10 = root_4();
          var span = sibling(child(div_10), 2);
          var node_4 = child(span);
          {
            var consequent_2 = ($$anchor4) => {
              var a = root_5();
              var text_2 = child(a);
              template_effect(
                ($0) => {
                  set_attribute(a, "href", $0);
                  set_text(text_2, get(objectData).owner.owner.address || get(objectData).owner.owner);
                },
                [
                  () => getAddressLink(getSelectedNetworkConfig(), get(objectData).owner.owner.address || get(objectData).owner.owner)
                ]
              );
              append($$anchor4, a);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment = comment();
              var node_5 = first_child(fragment);
              {
                var consequent_3 = ($$anchor5) => {
                  var text_3 = text();
                  template_effect(() => set_text(text_3, `Shared (v${get(objectData).owner.initialSharedVersion ?? ""})`));
                  append($$anchor5, text_3);
                };
                var alternate = ($$anchor5) => {
                  var text_4 = text();
                  template_effect(($0) => set_text(text_4, $0), [() => JSON.stringify(get(objectData).owner)]);
                  append($$anchor5, text_4);
                };
                if_block(
                  node_5,
                  ($$render) => {
                    if (get(objectData).owner.initialSharedVersion) $$render(consequent_3);
                    else $$render(alternate, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment);
            };
            if_block(node_4, ($$render) => {
              if (get(objectData).owner.owner) $$render(consequent_2);
              else $$render(alternate_1, false);
            });
          }
          append($$anchor3, div_10);
        };
        if_block(node_3, ($$render) => {
          if (get(objectData).owner) $$render(consequent_4);
        });
      }
      var node_6 = sibling(node_3, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var div_11 = root_9();
          var span_1 = sibling(child(div_11), 2);
          var a_1 = child(span_1);
          var text_5 = child(a_1);
          template_effect(
            ($0) => {
              set_attribute(a_1, "href", $0);
              set_text(text_5, get(objectData).previousTransactionBlock.digest);
            },
            [
              () => getTransactionLink(getSelectedNetworkConfig(), get(objectData).previousTransactionBlock.digest)
            ]
          );
          append($$anchor3, div_11);
        };
        if_block(node_6, ($$render) => {
          if (get(objectData).previousTransactionBlock) $$render(consequent_5);
        });
      }
      var node_7 = sibling(node_6, 2);
      {
        var consequent_8 = ($$anchor3) => {
          var fragment_3 = root_10();
          var node_8 = first_child(fragment_3);
          {
            var consequent_6 = ($$anchor4) => {
              var div_12 = root_11();
              var code_1 = sibling(child(div_12), 2);
              var text_6 = child(code_1);
              template_effect(() => set_text(text_6, get(objectData).asMoveObject.contents.type?.repr || "Unknown"));
              append($$anchor4, div_12);
            };
            if_block(node_8, ($$render) => {
              if (get(currentInputType) === "hex") $$render(consequent_6);
            });
          }
          var div_13 = sibling(node_8, 2);
          var button_6 = sibling(child(div_13), 2);
          button_6.__click = () => queryDynamicFieldsForObject(get(objectData).address);
          var text_7 = child(button_6);
          var pre = sibling(div_13, 2);
          var text_8 = child(pre);
          var node_9 = sibling(pre, 2);
          {
            var consequent_7 = ($$anchor4) => {
              var details_1 = root_12();
              var summary_1 = child(details_1);
              var strong = child(summary_1);
              var text_9 = child(strong);
              var pre_1 = sibling(summary_1, 2);
              var text_10 = child(pre_1);
              template_effect(
                ($0, $1, $2) => {
                  details_1.open = $0;
                  set_text(text_9, `Dynamic Fields (${$1 ?? ""})`);
                  set_text(text_10, $2);
                },
                [
                  () => get(dynamicFieldsInitiallyOpen).get(get(objectData).address) || false,
                  () => get(dynamicFieldsMap).get(get(objectData).address).length,
                  () => JSON.stringify(get(dynamicFieldsMap).get(get(objectData).address), null, 2)
                ]
              );
              append($$anchor4, details_1);
            };
            if_block(node_9, ($$render) => {
              if (get(objectData).address && (get(dynamicFieldsMap).get(get(objectData).address)?.length ?? 0) > 0) $$render(consequent_7);
            });
          }
          template_effect(
            ($0, $1, $2) => {
              button_6.disabled = $0;
              set_text(text_7, $1);
              set_text(text_8, $2);
            },
            [
              () => get(dynamicFieldsLoading).get(get(objectData).address) || false,
              () => get(dynamicFieldsLoading).get(get(objectData).address) ? "Loading..." : get(dynamicFieldsMap).has(get(objectData).address) ? `Query Dynamic Fields: ${get(dynamicFieldsMap).get(get(objectData).address)?.length ?? 0}` : "Query Dynamic Fields",
              () => JSON.stringify(get(objectData).asMoveObject.contents.json, null, 2)
            ]
          );
          append($$anchor3, fragment_3);
        };
        if_block(node_7, ($$render) => {
          if (get(objectData).asMoveObject) $$render(consequent_8);
        });
      }
      template_effect(() => set_text(text_1, get(objectData).address));
      bind_property("open", "toggle", details, ($$value) => set(singleObjectExpanded, $$value), () => get(singleObjectExpanded));
      append($$anchor2, div_7);
    };
    if_block(node_2, ($$render) => {
      if (get(mode) === "single" && get(objectData)) $$render(consequent_9);
    });
  }
  var node_10 = sibling(node_2, 2);
  {
    var consequent_10 = ($$anchor2) => {
      var div_14 = root_13();
      var div_15 = sibling(child(div_14), 2);
      var code_2 = sibling(child(div_15), 2);
      var text_11 = child(code_2);
      var div_16 = sibling(div_15, 4);
      each(div_16, 21, () => get(packageTypes), index, ($$anchor3, type) => {
        var button_7 = root_14();
        button_7.__click = () => searchType(get(type).fullType);
        var code_3 = child(button_7);
        var text_12 = child(code_3);
        template_effect(() => set_text(text_12, get(type).displayType));
        append($$anchor3, button_7);
      });
      template_effect(($0) => set_text(text_11, $0), [
        () => get(packageTypes)[0]?.fullType.split("::").slice(0, 1).join("")
      ]);
      append($$anchor2, div_14);
    };
    if_block(node_10, ($$render) => {
      if (get(packageTypes).length > 0) $$render(consequent_10);
    });
  }
  var node_11 = sibling(node_10, 2);
  {
    var consequent_20 = ($$anchor2) => {
      var div_17 = root_15();
      var div_18 = child(div_17);
      var div_19 = child(div_18);
      var div_20 = child(div_19);
      var button_8 = child(div_20);
      button_8.__click = expandAllObjects;
      var button_9 = sibling(button_8, 2);
      button_9.__click = collapseAllObjects;
      var node_12 = sibling(div_20, 2);
      {
        var consequent_11 = ($$anchor3) => {
          var button_10 = root_16();
          button_10.__click = loadNextPage;
          var text_13 = child(button_10);
          template_effect(() => {
            button_10.disabled = get(loadingNext);
            set_text(text_13, get(loadingNext) ? "Loading..." : "Load More");
          });
          append($$anchor3, button_10);
        };
        if_block(node_12, ($$render) => {
          if (get(hasNext)) $$render(consequent_11);
        });
      }
      var div_21 = sibling(node_12, 2);
      var select = sibling(child(div_21), 2);
      select.__change = handlePageSizeChange;
      var option = child(select);
      option.value = option.__value = "1";
      var option_1 = sibling(option);
      option_1.value = option_1.__value = "10";
      var option_2 = sibling(option_1);
      option_2.value = option_2.__value = "20";
      var option_3 = sibling(option_2);
      option_3.value = option_3.__value = "50";
      var h3 = sibling(div_19, 2);
      var text_14 = child(h3);
      var node_13 = sibling(div_18, 2);
      each(node_13, 17, () => get(objectsList), index, ($$anchor3, obj, i) => {
        var div_22 = root_17();
        var details_2 = child(div_22);
        var summary_2 = child(details_2);
        var code_4 = child(summary_2);
        var text_15 = child(code_4);
        var button_11 = sibling(code_4, 2);
        button_11.__click = () => window.open(getObjectLink(getSelectedNetworkConfig(), get(obj).address), "_blank");
        var div_23 = sibling(summary_2, 2);
        var node_14 = child(div_23);
        {
          var consequent_14 = ($$anchor4) => {
            var div_24 = root_18();
            var span_2 = sibling(child(div_24), 2);
            var node_15 = child(span_2);
            {
              var consequent_12 = ($$anchor5) => {
                var a_2 = root_19();
                var text_16 = child(a_2);
                template_effect(
                  ($0) => {
                    set_attribute(a_2, "href", $0);
                    set_text(text_16, get(obj).owner.owner.address || get(obj).owner.owner);
                  },
                  [
                    () => getAddressLink(getSelectedNetworkConfig(), get(obj).owner.owner.address || get(obj).owner.owner)
                  ]
                );
                append($$anchor5, a_2);
              };
              var alternate_3 = ($$anchor5) => {
                var fragment_4 = comment();
                var node_16 = first_child(fragment_4);
                {
                  var consequent_13 = ($$anchor6) => {
                    var text_17 = text();
                    template_effect(() => set_text(text_17, `Shared (v${get(obj).owner.initialSharedVersion ?? ""})`));
                    append($$anchor6, text_17);
                  };
                  var alternate_2 = ($$anchor6) => {
                    var text_18 = text();
                    template_effect(($0) => set_text(text_18, $0), [() => JSON.stringify(get(obj).owner)]);
                    append($$anchor6, text_18);
                  };
                  if_block(
                    node_16,
                    ($$render) => {
                      if (get(obj).owner.initialSharedVersion) $$render(consequent_13);
                      else $$render(alternate_2, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_4);
              };
              if_block(node_15, ($$render) => {
                if (get(obj).owner.owner) $$render(consequent_12);
                else $$render(alternate_3, false);
              });
            }
            append($$anchor4, div_24);
          };
          if_block(node_14, ($$render) => {
            if (get(obj).owner) $$render(consequent_14);
          });
        }
        var node_17 = sibling(node_14, 2);
        {
          var consequent_15 = ($$anchor4) => {
            var div_25 = root_23();
            var span_3 = sibling(child(div_25), 2);
            var a_3 = child(span_3);
            var text_19 = child(a_3);
            template_effect(
              ($0) => {
                set_attribute(a_3, "href", $0);
                set_text(text_19, get(obj).previousTransactionBlock.digest);
              },
              [
                () => getTransactionLink(getSelectedNetworkConfig(), get(obj).previousTransactionBlock.digest)
              ]
            );
            append($$anchor4, div_25);
          };
          if_block(node_17, ($$render) => {
            if (get(obj).previousTransactionBlock) $$render(consequent_15);
          });
        }
        var node_18 = sibling(node_17, 2);
        {
          var consequent_18 = ($$anchor4) => {
            var fragment_7 = root_24();
            var node_19 = first_child(fragment_7);
            {
              var consequent_16 = ($$anchor5) => {
                var div_26 = root_25();
                var code_5 = sibling(child(div_26), 2);
                var text_20 = child(code_5);
                template_effect(() => set_text(text_20, get(obj).asMoveObject.contents.type?.repr || "Unknown"));
                append($$anchor5, div_26);
              };
              if_block(node_19, ($$render) => {
                if (get(currentInputType) === "hex") $$render(consequent_16);
              });
            }
            var div_27 = sibling(node_19, 2);
            var button_12 = sibling(child(div_27), 2);
            button_12.__click = () => queryDynamicFieldsForObject(get(obj).address);
            var text_21 = child(button_12);
            var pre_2 = sibling(div_27, 2);
            var text_22 = child(pre_2);
            var node_20 = sibling(pre_2, 2);
            {
              var consequent_17 = ($$anchor5) => {
                var details_3 = root_26();
                var summary_3 = child(details_3);
                var strong_1 = child(summary_3);
                var text_23 = child(strong_1);
                var pre_3 = sibling(summary_3, 2);
                var text_24 = child(pre_3);
                template_effect(
                  ($0, $1, $2) => {
                    details_3.open = $0;
                    set_text(text_23, `Dynamic Fields (${$1 ?? ""})`);
                    set_text(text_24, $2);
                  },
                  [
                    () => get(dynamicFieldsInitiallyOpen).get(get(obj).address) || false,
                    () => get(dynamicFieldsMap).get(get(obj).address).length,
                    () => JSON.stringify(get(dynamicFieldsMap).get(get(obj).address), null, 2)
                  ]
                );
                append($$anchor5, details_3);
              };
              if_block(node_20, ($$render) => {
                if (get(obj).address && (get(dynamicFieldsMap).get(get(obj).address)?.length ?? 0) > 0) $$render(consequent_17);
              });
            }
            template_effect(
              ($0, $1, $2) => {
                button_12.disabled = $0;
                set_text(text_21, $1);
                set_text(text_22, $2);
              },
              [
                () => get(dynamicFieldsLoading).get(get(obj).address) || false,
                () => get(dynamicFieldsLoading).get(get(obj).address) ? "Loading..." : get(dynamicFieldsMap).has(get(obj).address) ? `Query Dynamic Fields: ${get(dynamicFieldsMap).get(get(obj).address)?.length ?? 0}` : "Query Dynamic Fields",
                () => JSON.stringify(get(obj).asMoveObject.contents.json, null, 2)
              ]
            );
            append($$anchor4, fragment_7);
          };
          if_block(node_18, ($$render) => {
            if (get(obj).asMoveObject) $$render(consequent_18);
          });
        }
        template_effect(() => set_text(text_15, get(obj).address));
        bind_property("open", "toggle", details_2, ($$value) => get(expandedObjects)[i] = $$value, () => get(expandedObjects)[i]);
        append($$anchor3, div_22);
      });
      var node_21 = sibling(node_13, 2);
      {
        var consequent_19 = ($$anchor3) => {
          var button_13 = root_27();
          button_13.__click = loadNextPage;
          var text_25 = child(button_13);
          template_effect(() => {
            button_13.disabled = get(loadingNext);
            set_text(text_25, get(loadingNext) ? "Loading..." : "Load More");
          });
          append($$anchor3, button_13);
        };
        if_block(node_21, ($$render) => {
          if (get(hasNext)) $$render(consequent_19);
        });
      }
      template_effect(() => set_text(text_14, `Objects (${get(objectsList).length ?? ""})`));
      bind_select_value(select, () => get(pageSize), ($$value) => set(pageSize, $$value));
      append($$anchor2, div_17);
    };
    if_block(node_11, ($$render) => {
      if (get(objectsList).length > 0) $$render(consequent_20);
    });
  }
  append($$anchor, div);
  pop();
  $$cleanup();
}
delegate(["click", "input", "change"]);
export {
  Object$1 as default
};

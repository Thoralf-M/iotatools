import { p as push, u as user_effect, s as set, Q as proxy, g as get, G as getSelectedNetworkConfig, b as sibling, h as child, i as if_block, t as template_effect, a9 as set_value, a8 as set_style, c as set_text, k as delegated, H as bind_value, d as append, l as pop, E as store_get, F as setup_stores, o as state, aa as isValidIotaAddress, ab as normalizeIotaObjectId, ac as toBase64, X as comment, W as first_child, e as each, j as index, x as bind_select_value, q as from_html, ad as writable, m as user_derived, r as delegate } from "./index-DAzJXhkf.js";
import { J as JsonToggleView } from "./JsonToggleView-BUN4nP6Z.js";
import { l as layoutToBcs, g as getMoveLayout, d as decodeBcs, a as deriveDynamicFieldIdWithBcs, b as deriveDynamicFieldId, q as queryDynamicFields, e as enhanceFieldsWithLayoutsAndBcs, c as queryDynamicField, f as queryDynamicObjectField } from "./dynamic-fields-Vb-1421U.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "./page-query-params-CmK6_KRZ.js";
import "./index-a-qIJzeT.js";
const defaultStructDefinitions = [
  {
    name: "VectorU8",
    fieldType: "vector<u8>",
    layout: {
      vector: "u8"
    },
    value: "[118,101,99,95,117,56,95,107,101,121]"
  },
  {
    name: "Bool",
    fieldType: "bool",
    layout: "bool",
    value: "true"
  },
  {
    name: "U8",
    fieldType: "u8",
    layout: "u8",
    value: "42"
  },
  {
    name: "U32",
    fieldType: "u32",
    layout: "u32",
    value: "42"
  },
  {
    name: "StringStruct",
    fieldType: "0x1::string::String",
    layout: {
      struct: {
        type: "0x1::string::String",
        fields: [
          {
            name: "bytes",
            layout: { vector: "u8" }
          }
        ]
      }
    },
    value: '"string_key"'
  },
  {
    name: "StructWithDummyField",
    fieldType: "0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef::dynamic_fields::StructWithoutFieldKey",
    layout: {
      struct: {
        type: "0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef::dynamic_fields::StructWithoutFieldKey",
        fields: [
          {
            name: "dummy_field",
            layout: "bool"
          }
        ]
      }
    },
    value: '{"dummy_field": false}'
  },
  {
    name: "Domain",
    fieldType: "0x3ec4826f1d6e0d9f00680b2e9a7a41f03788ee610b3d11c24f41ab0ae71da39f::domain::Domain",
    layout: {
      struct: {
        type: "0x3ec4826f1d6e0d9f00680b2e9a7a41f03788ee610b3d11c24f41ab0ae71da39f::domain::Domain",
        fields: [
          {
            name: "labels",
            layout: {
              vector: {
                struct: {
                  type: "0x1::string::String",
                  fields: [
                    {
                      name: "bytes",
                      layout: { vector: "u8" }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    },
    value: '{"labels": ["iota", "name"]}'
  }
];
var root_1 = from_html(`<div style="color: #d63031; margin-top: 0.25em;"> </div>`);
var root_2 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root_4 = from_html(`<div>No dynamic fields found for this object.</div>`);
var root_6 = from_html(`<button style="margin-top:1em;"> </button>`);
var root_5 = from_html(`<!> <!>`, 1);
var root_10 = from_html(`<div style="color: red; margin-top: 0.5em; font-size: 0.9em;"> </div>`);
var root_13 = from_html(`<span style="font-family: monospace; padding: 2px 4px; border-radius: 2px;"> </span> <span style="color: #666; font-size: 0.9em; margin-left: 0.5em;"> </span>`, 1);
var root_11 = from_html(`<div style="margin-top: 0.5em;"><strong>Decoded value:</strong> <!></div>`);
var root_9 = from_html(`<div style="margin-top: 0.5em;"><button style="padding: 2px 8px; font-size: 0.9em;">Decode BCS</button></div> <!> <!>`, 1);
var root_8 = from_html(`Field BCS (Base64): <input placeholder="Base64 BCS" size="32"/> <!>`, 1);
var root_15 = from_html(`<option> </option>`);
var root_16 = from_html(`<option> </option>`);
var root_17 = from_html(`<div style="color: red; margin-bottom: 0.5em;"> </div>`);
var root_19 = from_html(`<div style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"><strong>Computed BCS Base64 encoded:</strong> <button style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;" title="Copy to clipboard">📋 Copy</button></div>`);
var root_20 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Unable to compute BCS value - check struct definition and value</div>`);
var root_21 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Select a struct type to see computed BCS value</div>`);
var root_14 = from_html(
  `Struct type: Examples apart from Domain are from this package: <a target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;" href="https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields">https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields</a> <br/> In devnet: <a target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;" href="https://explorer.iota.org/object/0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef?module=dynamic_fields&amp;network=devnet">0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef</a> <br/> <select style="margin-right:0.5em;"><!><!></select> <button type="button" style="margin-left:0.5em; padding:2px 8px; font-size:0.9em;">+ Add New</button> <div style="margin-top:1em;"><h4 style="margin-bottom:0.5em;">Selected Struct Definition</h4> <p style="font-size:0.9em; color:#666;">Edit the selected struct. Object should have: name, fieldType, layout (JSON),
                    and value (JSON). The layout defines the structure of the data and will be
                    converted to BCS for serialization.</p> <!> <textarea rows="12" cols="130" style="font-family: monospace;"></textarea></div> <!>`,
  1
);
var root_22 = from_html(`<div style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"><strong>Computed Dynamic Field ID:</strong> <button style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;" title="Copy to clipboard">📋 Copy</button></div>`);
var root_23 = from_html(`<div style="margin-top: 0.5em; color: #666; font-style: italic;">Computing...</div>`);
var root_24 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Enter object ID, field type, and field value to compute dynamic field ID</div>`);
var root_25 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root_26 = from_html(`<h4>dynamicField Result</h4> <!>`, 1);
var root_27 = from_html(`<h4>dynamicObjectField Result</h4> <!>`, 1);
var root_28 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root = from_html(`<main><h2>Dynamic Fields</h2> <div><label>Object ID: <input placeholder="0x..." size="67"/></label> <!> <br/> <label style="margin-left:1em;">Page size: <input type="number" min="1" max="100" style="width:6rem;"/></label> <button> </button> <button style="margin-left:1em;">Get Layouts and BCS Values</button></div> <!> <!> <hr style="margin:2em 0;"/> <h3>Query Dynamic Field / Dynamic Object Field</h3> <div style="margin-bottom:1em;"><label>Field type (primitive or name.type.repr, like
            &lt;package&gt;::&lt;module&gt;::&lt;struct&gt;): <input placeholder="e.g. 0x1::string::String" style="width: 100%"/></label> <br/> <button style="margin-top:0.5em; margin-bottom:1em;"> </button> <br/> <!> <br/> Field value (default is for structs without fields): <div><button type="button" style="margin-right:0.5em; display: inline-block;"> </button></div> <!> <!></div> <div style="margin-bottom:1em;"><button> </button> <button style="margin-left:1em;"> </button></div> <!> <!> <!> <!></main>`);
function DynamicFields($$anchor, $$props) {
  push($$props, true);
  const $queryParamValues = () => store_get(queryParamValues, "$queryParamValues", $$stores);
  const $customStructs = () => store_get(customStructs, "$customStructs", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const queryParamValues = usePageQueryParams({ objectId: "0x5" });
  let objectId = state("");
  let objectIdError = state("");
  user_effect(() => {
    set(objectId, $queryParamValues().objectId, true);
  });
  function updateObjectId(newObjectId) {
    set(objectId, newObjectId, true);
    if (newObjectId && !isValidIotaAddress(normalizeIotaObjectId(newObjectId))) {
      set(objectIdError, "Invalid object id");
    } else {
      set(objectIdError, "");
      updatePageQueryParams({ objectId: newObjectId || null });
    }
  }
  let dynamicFields = state(null);
  let error = state("");
  let loading = state(false);
  let endCursor = null;
  let hasNextPage = state(false);
  let pageSize = state(10);
  let fieldType = state("bool");
  let fieldBcs = state("AA==");
  let dynamicFieldResult = state(null);
  let dynamicObjectFieldResult = state(null);
  let fieldError = state("");
  let fieldLoading = state(false);
  let computedDynamicFieldId = state("");
  let bcsInputMode = state("json");
  let fieldStructType = state("Bool");
  let structDefinitions = proxy([...defaultStructDefinitions]);
  let selectedStructJson = state("");
  let structsError = state("");
  let isUpdatingFromSelection = false;
  user_effect(() => {
    if (!get(selectedStructJson)) {
      updateSelectedStructJson();
    }
  });
  function updateSelectedStructJson() {
    if (isUpdatingFromSelection) return;
    const selected = getSelectedStruct();
    if (selected) {
      isUpdatingFromSelection = true;
      try {
        let valueObj;
        try {
          valueObj = JSON.parse(selected.value);
        } catch {
          valueObj = selected.value;
        }
        set(
          selectedStructJson,
          JSON.stringify(
            {
              name: selected.name,
              fieldType: selected.fieldType,
              layout: selected.layout,
              value: valueObj
            },
            null,
            2
          ),
          true
        );
      } catch (e) {
        console.error("Error updating selected struct JSON:", e);
        set(
          selectedStructJson,
          JSON.stringify(
            {
              name: selected.name,
              fieldType: selected.fieldType,
              layout: {},
              value: {}
            },
            null,
            2
          ),
          true
        );
      }
      isUpdatingFromSelection = false;
    }
  }
  user_effect(() => {
    get(
      fieldStructType
      // Track the dependency
    );
    updateSelectedStructJson();
  });
  user_effect(() => {
    const selected = getSelectedStruct();
    if (selected && selected.fieldType) {
      set(fieldType, selected.fieldType, true);
    }
  });
  function getBcsBase64() {
    if (get(bcsInputMode) === "base64") {
      return get(fieldBcs);
    }
    try {
      const struct = getSelectedStruct();
      if (!struct) throw new Error("Unknown struct type");
      let json;
      if (typeof struct.value === "string") {
        try {
          json = JSON.parse(struct.value);
        } catch {
          json = struct.value;
        }
      } else {
        json = struct.value;
      }
      const bcsSchema = layoutToBcs(struct.layout);
      return toBase64(bcsSchema.serialize(json).toBytes());
    } catch (e) {
      console.error("BCS serialization error:", e);
      return "";
    }
  }
  function computeDynamicFieldId() {
    if (!get(objectId) || !get(fieldType)) {
      return "";
    }
    try {
      if (get(bcsInputMode) === "base64") {
        if (!get(fieldBcs).trim()) return "";
        return deriveDynamicFieldIdWithBcs(get(objectId), get(fieldType), get(fieldBcs));
      } else {
        const struct = getSelectedStruct();
        if (!struct) return "";
        let json;
        if (typeof struct.value === "string") {
          try {
            json = JSON.parse(struct.value);
          } catch {
            json = struct.value;
          }
        } else {
          json = struct.value;
        }
        const bcsSchema = layoutToBcs(struct.layout);
        return deriveDynamicFieldId(get(objectId), get(fieldType), bcsSchema, json);
      }
    } catch (e) {
      console.error("Error computing dynamic field ID:", e);
      return "";
    }
  }
  user_effect(() => {
    get(objectId);
    get(fieldType);
    get(fieldBcs);
    get(fieldStructType);
    get(bcsInputMode);
    set(computedDynamicFieldId, computeDynamicFieldId(), true);
  });
  async function handleQueryDynamicFields(cursor) {
    set(error, "");
    if (!cursor) {
      set(dynamicFields, [], true);
      endCursor = null;
    }
    set(loading, true);
    const result = await queryDynamicFields({
      objectId: get(objectId),
      pageSize: get(pageSize),
      cursor,
      graphqlUrl: getSelectedNetworkConfig().graphql
    });
    if (result.error) {
      set(error, result.error, true);
    } else {
      if (cursor) {
        set(dynamicFields, [...get(dynamicFields), ...result.nodes], true);
      } else {
        set(dynamicFields, result.nodes, true);
        if (result.nodes.length > 0 && result.nodes[0]?.name?.type?.repr) {
          set(fieldType, result.nodes[0].name.type.repr, true);
        }
      }
      set(hasNextPage, result.hasNextPage, true);
      endCursor = result.endCursor;
    }
    set(loading, false);
  }
  function loadMore() {
    if (get(hasNextPage) && endCursor) {
      handleQueryDynamicFields(endCursor);
    }
  }
  async function handleGetLayoutsAndBcsValues() {
    if (!get(dynamicFields) || get(dynamicFields).length === 0) return;
    set(loading, true);
    set(error, "");
    try {
      const updatedFields = await enhanceFieldsWithLayoutsAndBcs(get(dynamicFields), getSelectedNetworkConfig().graphql);
      set(dynamicFields, updatedFields, true);
    } catch (e) {
      set(error, `Error processing layouts: ${e.message || String(e)}`);
    }
    set(loading, false);
  }
  async function handleQueryDynamicField() {
    set(fieldError, "");
    set(dynamicFieldResult, null);
    set(fieldLoading, true);
    const bcsValue = getBcsBase64();
    if (!bcsValue) {
      set(fieldLoading, false);
      return;
    }
    const result = await queryDynamicField({
      objectId: get(objectId),
      fieldType: get(fieldType),
      bcsValue,
      graphqlUrl: getSelectedNetworkConfig().graphql
    });
    if (result.error) {
      set(fieldError, result.error, true);
      set(dynamicFieldResult, null);
    } else {
      set(dynamicFieldResult, result.field, true);
    }
    set(fieldLoading, false);
  }
  async function handleQueryDynamicObjectField() {
    set(fieldError, "");
    set(dynamicObjectFieldResult, null);
    set(fieldLoading, true);
    const bcsValue = getBcsBase64();
    if (!bcsValue) {
      set(fieldLoading, false);
      return;
    }
    const result = await queryDynamicObjectField({
      objectId: get(objectId),
      fieldType: get(fieldType),
      bcsValue,
      graphqlUrl: getSelectedNetworkConfig().graphql
    });
    if (result.error) {
      set(fieldError, result.error, true);
      set(dynamicObjectFieldResult, null);
    } else {
      set(dynamicObjectFieldResult, result.field, true);
    }
    set(fieldLoading, false);
  }
  let customStructs = writable({});
  let layoutType = state("0x2::vec_set::VecSet<u64>");
  let layoutResult = state(null);
  let layoutError = state("");
  let layoutLoading = state(false);
  let decodedFieldValue = state(null);
  let decodeError = state("");
  let isDecodingInProgress = state(false);
  user_effect(() => {
    if (!get(selectedStructJson)) {
      updateSelectedStructJson();
    }
  });
  async function handleGetMoveLayout() {
    set(layoutError, "");
    set(layoutResult, null);
    set(layoutLoading, true);
    const result = await getMoveLayout(get(layoutType), getSelectedNetworkConfig().graphql);
    if (result.error) {
      set(layoutError, result.error, true);
      set(layoutResult, null);
    } else {
      set(layoutResult, { layout: result.layout }, true);
    }
    set(layoutLoading, false);
  }
  function updateStructFromJson() {
    if (!get(selectedStructJson).trim() || isUpdatingFromSelection) return;
    try {
      const parsed = JSON.parse(get(selectedStructJson));
      if (parsed && parsed.name && parsed.value !== void 0) {
        const index2 = structDefinitions.findIndex((s) => s.name === parsed.name);
        if (index2 >= 0) {
          structDefinitions[index2] = {
            ...structDefinitions[index2],
            fieldType: parsed.fieldType || structDefinitions[index2].fieldType,
            layout: parsed.layout || structDefinitions[index2].layout,
            value: typeof parsed.value === "string" ? parsed.value : JSON.stringify(parsed.value)
          };
        } else {
          structDefinitions.push({
            name: parsed.name,
            fieldType: parsed.fieldType || "",
            layout: parsed.layout || { struct: { type: parsed.name, fields: [] } },
            value: typeof parsed.value === "string" ? parsed.value : JSON.stringify(parsed.value)
          });
        }
        set(structsError, "");
      } else {
        set(structsError, "Struct definition must have name and value properties");
      }
    } catch (e) {
      set(structsError, "Invalid JSON in struct definition");
    }
  }
  function getSelectedStruct() {
    return structDefinitions.find((s) => s.name === get(fieldStructType)) || null;
  }
  function addNewStruct() {
    const newName = prompt("Enter new struct name:");
    if (newName && !structDefinitions.find((s) => s.name === newName)) {
      structDefinitions.push({
        name: newName,
        fieldType: "",
        layout: { struct: { type: newName, fields: [] } },
        value: "{}"
      });
      set(fieldStructType, newName, true);
      updateSelectedStructJson();
    }
  }
  let decodeTimeout;
  user_effect(() => {
    if (get(fieldBcs) && get(fieldType) && !get(layoutLoading)) {
      clearTimeout(decodeTimeout);
      decodeTimeout = setTimeout(
        () => {
          decodeFieldBcs();
        },
        300
      );
    }
  });
  let updateStructTimeout;
  user_effect(() => {
    if (get(selectedStructJson) && !isUpdatingFromSelection) {
      clearTimeout(updateStructTimeout);
      updateStructTimeout = setTimeout(
        () => {
          updateStructFromJson();
        },
        500
      );
    }
  });
  user_effect(() => {
    if (get(bcsInputMode) === "json") {
      try {
        const struct = getSelectedStruct();
        if (struct) {
          let json;
          if (typeof struct.value === "string") {
            try {
              json = JSON.parse(struct.value);
            } catch {
              json = struct.value;
            }
          } else {
            json = struct.value;
          }
          const bcsSchema = layoutToBcs(struct.layout);
          bcsSchema.serialize(json).toBytes();
          if (get(fieldError).includes("BCS serialization error")) {
            set(fieldError, "");
          }
        }
      } catch (e) {
        set(fieldError, "BCS serialization error: " + e);
      }
    }
  });
  async function decodeFieldBcs() {
    if (get(isDecodingInProgress)) return;
    set(isDecodingInProgress, true);
    set(decodedFieldValue, null);
    set(decodeError, "");
    if (!get(fieldBcs).trim() || !get(fieldType).trim()) {
      set(isDecodingInProgress, false);
      return;
    }
    try {
      let currentLayout = get(layoutResult)?.layout;
      if (!currentLayout) {
        const result = await getMoveLayout(get(fieldType), getSelectedNetworkConfig().graphql);
        if (result.error) {
          set(decodeError, `Failed to fetch layout: ${result.error}`);
          set(isDecodingInProgress, false);
          return;
        }
        if (!result.layout) {
          set(decodeError, "Layout not found for this type.");
          set(isDecodingInProgress, false);
          return;
        }
        currentLayout = result.layout;
      }
      const decodeResult = decodeBcs(get(fieldBcs), currentLayout);
      if (decodeResult.error) {
        set(decodeError, `Decode error: ${decodeResult.error}`);
      } else {
        set(decodedFieldValue, decodeResult.value, true);
      }
    } catch (e) {
      set(decodeError, `Decode error: ${e.message || String(e)}`);
    } finally {
      set(isDecodingInProgress, false);
    }
  }
  var main = root();
  var div = sibling(child(main), 2);
  var label = child(div);
  var input = sibling(child(label));
  var node = sibling(label, 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      var text = child(div_1);
      template_effect(() => set_text(text, get(objectIdError)));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (get(objectIdError)) $$render(consequent);
    });
  }
  var label_1 = sibling(node, 4);
  var input_1 = sibling(child(label_1));
  var button = sibling(label_1, 2);
  var text_1 = child(button);
  var button_1 = sibling(button, 2);
  var node_1 = sibling(div, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_2 = root_2();
      var text_2 = child(div_2);
      template_effect(() => set_text(text_2, get(error)));
      append($$anchor2, div_2);
    };
    if_block(node_1, ($$render) => {
      if (get(error)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment = comment();
      var node_3 = first_child(fragment);
      {
        var consequent_2 = ($$anchor3) => {
          var div_3 = root_4();
          append($$anchor3, div_3);
        };
        var alternate = ($$anchor3) => {
          var fragment_1 = root_5();
          var node_4 = first_child(fragment_1);
          JsonToggleView(node_4, {
            get value() {
              return get(dynamicFields);
            }
          });
          var node_5 = sibling(node_4, 2);
          {
            var consequent_3 = ($$anchor4) => {
              var button_2 = root_6();
              var text_3 = child(button_2);
              template_effect(() => {
                button_2.disabled = get(loading);
                set_text(text_3, get(loading) ? "Loading..." : "Load more");
              });
              delegated("click", button_2, loadMore);
              append($$anchor4, button_2);
            };
            if_block(node_5, ($$render) => {
              if (get(hasNextPage)) $$render(consequent_3);
            });
          }
          append($$anchor3, fragment_1);
        };
        if_block(node_3, ($$render) => {
          if (get(dynamicFields).length === 0 && !get(loading)) $$render(consequent_2);
          else $$render(alternate, -1);
        });
      }
      append($$anchor2, fragment);
    };
    if_block(node_2, ($$render) => {
      if (get(dynamicFields)) $$render(consequent_4);
    });
  }
  var div_4 = sibling(node_2, 6);
  var label_2 = child(div_4);
  var input_2 = sibling(child(label_2));
  var button_3 = sibling(label_2, 4);
  var text_4 = child(button_3);
  var node_6 = sibling(button_3, 4);
  {
    var consequent_5 = ($$anchor2) => {
      JsonToggleView($$anchor2, {
        get value() {
          return get(layoutResult);
        }
      });
    };
    if_block(node_6, ($$render) => {
      if (get(layoutResult)) $$render(consequent_5);
    });
  }
  var div_5 = sibling(node_6, 4);
  var button_4 = child(div_5);
  var text_5 = child(button_4);
  var node_7 = sibling(div_5, 2);
  {
    var consequent_10 = ($$anchor2) => {
      var fragment_3 = root_8();
      var input_3 = sibling(first_child(fragment_3));
      var node_8 = sibling(input_3, 2);
      {
        var consequent_9 = ($$anchor3) => {
          var fragment_4 = root_9();
          var div_6 = first_child(fragment_4);
          var button_5 = child(div_6);
          var node_9 = sibling(div_6, 2);
          {
            var consequent_6 = ($$anchor4) => {
              var div_7 = root_10();
              var text_6 = child(div_7);
              template_effect(() => set_text(text_6, get(decodeError)));
              append($$anchor4, div_7);
            };
            if_block(node_9, ($$render) => {
              if (get(decodeError)) $$render(consequent_6);
            });
          }
          var node_10 = sibling(node_9, 2);
          {
            var consequent_8 = ($$anchor4) => {
              var div_8 = root_11();
              var node_11 = sibling(child(div_8), 2);
              {
                var consequent_7 = ($$anchor5) => {
                  JsonToggleView($$anchor5, {
                    get value() {
                      return get(decodedFieldValue);
                    }
                  });
                };
                var alternate_1 = ($$anchor5) => {
                  var fragment_6 = root_13();
                  var span = first_child(fragment_6);
                  var text_7 = child(span);
                  var span_1 = sibling(span, 2);
                  var text_8 = child(span_1);
                  template_effect(() => {
                    set_text(text_7, get(decodedFieldValue));
                    set_text(text_8, `(${typeof get(decodedFieldValue)})`);
                  });
                  append($$anchor5, fragment_6);
                };
                if_block(node_11, ($$render) => {
                  if (typeof get(decodedFieldValue) === "object" && get(decodedFieldValue) !== null) $$render(consequent_7);
                  else $$render(alternate_1, -1);
                });
              }
              append($$anchor4, div_8);
            };
            if_block(node_10, ($$render) => {
              if (get(decodedFieldValue) !== null) $$render(consequent_8);
            });
          }
          delegated("click", button_5, decodeFieldBcs);
          append($$anchor3, fragment_4);
        };
        var d = user_derived(() => get(fieldBcs).trim());
        if_block(node_8, ($$render) => {
          if (get(d)) $$render(consequent_9);
        });
      }
      bind_value(input_3, () => get(fieldBcs), ($$value) => set(fieldBcs, $$value));
      append($$anchor2, fragment_3);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_7 = root_14();
      var select = sibling(first_child(fragment_7), 9);
      var node_12 = child(select);
      each(node_12, 17, () => structDefinitions, index, ($$anchor3, structDef) => {
        var option = root_15();
        var text_9 = child(option);
        var option_value = {};
        template_effect(() => {
          set_text(text_9, get(structDef).name);
          if (option_value !== (option_value = get(structDef).name)) {
            option.value = (option.__value = get(structDef).name) ?? "";
          }
        });
        append($$anchor3, option);
      });
      var node_13 = sibling(node_12);
      each(node_13, 1, () => Object.keys($customStructs() || {}), index, ($$anchor3, structType) => {
        var option_1 = root_16();
        var text_10 = child(option_1);
        var option_1_value = {};
        template_effect(() => {
          set_text(text_10, get(structType));
          if (option_1_value !== (option_1_value = get(structType))) {
            option_1.value = (option_1.__value = get(structType)) ?? "";
          }
        });
        append($$anchor3, option_1);
      });
      var button_6 = sibling(select, 2);
      var div_9 = sibling(button_6, 2);
      var node_14 = sibling(child(div_9), 4);
      {
        var consequent_11 = ($$anchor3) => {
          var div_10 = root_17();
          var text_11 = child(div_10);
          template_effect(() => set_text(text_11, get(structsError)));
          append($$anchor3, div_10);
        };
        if_block(node_14, ($$render) => {
          if (get(structsError)) $$render(consequent_11);
        });
      }
      var textarea = sibling(node_14, 2);
      var node_15 = sibling(div_9, 2);
      {
        var consequent_13 = ($$anchor3) => {
          const bcsValue = user_derived(getBcsBase64);
          var fragment_8 = comment();
          var node_16 = first_child(fragment_8);
          {
            var consequent_12 = ($$anchor4) => {
              var div_11 = root_19();
              var text_12 = sibling(child(div_11));
              var button_7 = sibling(text_12);
              template_effect(() => set_text(text_12, ` ${get(bcsValue) ?? ""} `));
              delegated("click", button_7, () => navigator.clipboard.writeText(get(bcsValue)));
              append($$anchor4, div_11);
            };
            var alternate_2 = ($$anchor4) => {
              var div_12 = root_20();
              append($$anchor4, div_12);
            };
            if_block(node_16, ($$render) => {
              if (get(bcsValue)) $$render(consequent_12);
              else $$render(alternate_2, -1);
            });
          }
          append($$anchor3, fragment_8);
        };
        var alternate_3 = ($$anchor3) => {
          var div_13 = root_21();
          append($$anchor3, div_13);
        };
        if_block(node_15, ($$render) => {
          if (get(fieldStructType)) $$render(consequent_13);
          else $$render(alternate_3, -1);
        });
      }
      bind_select_value(select, () => get(fieldStructType), ($$value) => set(fieldStructType, $$value));
      delegated("click", button_6, addNewStruct);
      bind_value(textarea, () => get(selectedStructJson), ($$value) => set(selectedStructJson, $$value));
      append($$anchor2, fragment_7);
    };
    if_block(node_7, ($$render) => {
      if (get(bcsInputMode) === "base64") $$render(consequent_10);
      else $$render(alternate_4, -1);
    });
  }
  var node_17 = sibling(node_7, 2);
  {
    var consequent_14 = ($$anchor2) => {
      var div_14 = root_22();
      var text_13 = sibling(child(div_14));
      var button_8 = sibling(text_13);
      template_effect(() => set_text(text_13, ` ${get(computedDynamicFieldId) ?? ""} `));
      delegated("click", button_8, () => navigator.clipboard.writeText(get(computedDynamicFieldId)));
      append($$anchor2, div_14);
    };
    var consequent_15 = ($$anchor2) => {
      var div_15 = root_23();
      append($$anchor2, div_15);
    };
    var alternate_5 = ($$anchor2) => {
      var div_16 = root_24();
      append($$anchor2, div_16);
    };
    if_block(node_17, ($$render) => {
      if (get(computedDynamicFieldId)) $$render(consequent_14);
      else if (get(objectId) && get(fieldType) && (get(bcsInputMode) === "base64" ? get(fieldBcs) : get(fieldStructType))) $$render(consequent_15, 1);
      else $$render(alternate_5, -1);
    });
  }
  var div_17 = sibling(div_4, 2);
  var button_9 = child(div_17);
  var text_14 = child(button_9);
  var button_10 = sibling(button_9, 2);
  var text_15 = child(button_10);
  var node_18 = sibling(div_17, 2);
  {
    var consequent_16 = ($$anchor2) => {
      var div_18 = root_25();
      var text_16 = child(div_18);
      template_effect(() => set_text(text_16, get(fieldError)));
      append($$anchor2, div_18);
    };
    if_block(node_18, ($$render) => {
      if (get(fieldError)) $$render(consequent_16);
    });
  }
  var node_19 = sibling(node_18, 2);
  {
    var consequent_17 = ($$anchor2) => {
      var fragment_9 = root_26();
      var node_20 = sibling(first_child(fragment_9), 2);
      JsonToggleView(node_20, {
        get value() {
          return get(dynamicFieldResult);
        }
      });
      append($$anchor2, fragment_9);
    };
    if_block(node_19, ($$render) => {
      if (get(dynamicFieldResult)) $$render(consequent_17);
    });
  }
  var node_21 = sibling(node_19, 2);
  {
    var consequent_18 = ($$anchor2) => {
      var fragment_10 = root_27();
      var node_22 = sibling(first_child(fragment_10), 2);
      JsonToggleView(node_22, {
        get value() {
          return get(dynamicObjectFieldResult);
        }
      });
      append($$anchor2, fragment_10);
    };
    if_block(node_21, ($$render) => {
      if (get(dynamicObjectFieldResult)) $$render(consequent_18);
    });
  }
  var node_23 = sibling(node_21, 2);
  {
    var consequent_19 = ($$anchor2) => {
      var div_19 = root_28();
      var text_17 = child(div_19);
      template_effect(() => set_text(text_17, get(layoutError)));
      append($$anchor2, div_19);
    };
    if_block(node_23, ($$render) => {
      if (get(layoutError)) $$render(consequent_19);
    });
  }
  template_effect(
    ($0, $1) => {
      set_value(input, get(objectId));
      set_style(input, get(objectIdError) ? "border-color: #d63031;" : "");
      button.disabled = get(loading) || !get(objectId);
      set_text(text_1, get(loading) ? "Loading..." : "Query Dynamic Fields");
      button_1.disabled = get(loading) || !get(dynamicFields) || get(dynamicFields).length === 0;
      button_3.disabled = get(layoutLoading) || !get(fieldType);
      set_text(text_4, get(layoutLoading) ? "Loading..." : "Get Layout for this type");
      set_text(text_5, get(bcsInputMode) === "base64" ? "Switch to JSON" : "Switch to Base64");
      button_9.disabled = $0;
      set_text(text_14, get(fieldLoading) ? "Loading..." : "Query dynamicField");
      button_10.disabled = $1;
      set_text(text_15, get(fieldLoading) ? "Loading..." : "Query dynamicObjectField");
    },
    [
      () => get(fieldLoading) || !get(objectId) || !get(fieldType) || (get(bcsInputMode) === "base64" ? !get(fieldBcs) : !get(fieldStructType) || getBcsBase64() === ""),
      () => get(fieldLoading) || !get(objectId) || !get(fieldType) || (get(bcsInputMode) === "base64" ? !get(fieldBcs) : !get(fieldStructType) || getBcsBase64() === "")
    ]
  );
  delegated("input", input, (e) => updateObjectId(e.target?.value || ""));
  bind_value(input_1, () => get(pageSize), ($$value) => set(pageSize, $$value));
  delegated("click", button, () => handleQueryDynamicFields());
  delegated("click", button_1, handleGetLayoutsAndBcsValues);
  bind_value(input_2, () => get(fieldType), ($$value) => set(fieldType, $$value));
  delegated("click", button_3, () => {
    set(layoutType, get(fieldType), true);
    handleGetMoveLayout();
  });
  delegated("click", button_4, () => {
    set(bcsInputMode, get(bcsInputMode) === "base64" ? "json" : "base64", true);
  });
  delegated("click", button_9, handleQueryDynamicField);
  delegated("click", button_10, handleQueryDynamicObjectField);
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["input", "click"]);
export {
  DynamicFields as default
};

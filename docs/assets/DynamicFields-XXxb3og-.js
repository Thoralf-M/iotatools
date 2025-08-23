import { M as iotaBcs, N as toB64, O as fromB64, P as blake2b, Q as bytesToHex, p as push, R as proxy, S as user_effect, g as get, T as state, j as set, U as getSelectedNetworkConfig, f as from_html, s as sibling, c as child, b as if_block, t as template_effect, d as set_text, E as bind_value, k as append, l as pop, V as setup_stores, I as comment, G as first_child, z as each, A as index, W as store_get, h as bind_select_value, X as writable, C as untrack, Y as user_derived, Z as delegate } from "/iota-utils/assets/index-C9GeLqyr.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-SuVghi4f.js";
import { I as IotaGraphQLClient, g as graphql } from "/iota-utils/assets/index-DTy3HSaa.js";
import "/iota-utils/assets/transaction-view-hQRLBdds.js";
function toShortTypeString(type) {
  return type?.replace(/0x0{31,}(\d)/g, "0x$1").replace(/,\b/g, ", ");
}
function layoutToBcs(layout) {
  switch (layout) {
    case "address":
      return iotaBcs.Address;
    case "bool":
      return iotaBcs.Bool;
    case "u8":
      return iotaBcs.U8;
    case "u16":
      return iotaBcs.U16;
    case "u32":
      return iotaBcs.U32;
    case "u64":
      return iotaBcs.U64;
    case "u128":
      return iotaBcs.U128;
    case "u256":
      return iotaBcs.U256;
  }
  if ("vector" in layout) {
    const innerType = layoutToBcs(layout.vector);
    const vectorType = iotaBcs.vector(innerType);
    if (layout.vector === "u8") {
      return vectorType.transform({
        input: (value) => {
          if (typeof value === "string") {
            return Array.from(new TextEncoder().encode(value));
          }
          return value;
        },
        output: (value) => {
          if (Array.isArray(value)) {
            return new TextDecoder().decode(new Uint8Array(value));
          }
          return value;
        }
      });
    }
    return vectorType;
  }
  if ("struct" in layout) {
    const fields = {};
    for (const { name, layout: field } of layout.struct.fields) {
      fields[name] = layoutToBcs(field);
    }
    let struct = iotaBcs.struct(layout.struct.type, fields);
    const structName = toShortTypeString(layout.struct.type);
    if (structName === "0x2::object::ID") {
      struct = struct.transform({
        input: (id) => typeof id === "string" ? { bytes: id } : id,
        output: (id) => id.id
      });
    }
    if (structName === "0x1::string::String") {
      struct = struct.transform({
        input: (str) => typeof str === "string" ? { bytes: str } : str,
        output: (obj) => obj.bytes
      });
    }
    return struct;
  }
  throw new Error(`Unknown layout: ${JSON.stringify(layout)}`);
}
function mapJsonToBcs(json, layout) {
  const schema = layoutToBcs(layout);
  return toB64(schema.serialize(json).toBytes());
}
function decodeBcs(bcsBase64, layout) {
  try {
    const schema = layoutToBcs(layout);
    const bcsBytes = new Uint8Array(
      atob(bcsBase64).split("").map((c) => c.charCodeAt(0))
    );
    const value = schema.parse(bcsBytes);
    return { value };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}
function deriveDynamicFieldId(parentObjectId, tag, valueType, value) {
  const typeTagBytes = iotaBcs.TypeTag.serialize(tag).toBytes();
  const valueBcsBytes = valueType.serialize(value).toBytes();
  const valueBcsBytesLen = new Uint8Array(8);
  const view = new DataView(valueBcsBytesLen.buffer);
  view.setUint32(0, valueBcsBytes.length, true);
  const input = new Uint8Array([
    // HashingIntentScope::ChildObjectId
    240,
    ...iotaBcs.Address.serialize(parentObjectId).toBytes(),
    ...valueBcsBytesLen,
    ...valueBcsBytes,
    ...typeTagBytes
  ]);
  const hash = blake2b(input, { dkLen: 32 });
  return `0x${bytesToHex(hash)}`;
}
function deriveDynamicFieldIdWithBcs(parentObjectId, tag, valueBytesB64) {
  const typeTagBytes = iotaBcs.TypeTag.serialize(tag).toBytes();
  const valueBcsBytes = fromB64(valueBytesB64);
  const valueBcsBytesLen = new Uint8Array(8);
  const view = new DataView(valueBcsBytesLen.buffer);
  view.setUint32(0, valueBcsBytes.length, true);
  const input = new Uint8Array([
    // HashingIntentScope::ChildObjectId
    240,
    ...iotaBcs.Address.serialize(parentObjectId).toBytes(),
    ...valueBcsBytesLen,
    ...valueBcsBytes,
    ...typeTagBytes
  ]);
  const hash = blake2b(input, { dkLen: 32 });
  return `0x${bytesToHex(hash)}`;
}
async function queryDynamicFields(options) {
  try {
    const gqlClient = new IotaGraphQLClient({
      url: options.graphqlUrl
    });
    const cursorSection = options.cursor ? `(first: ${options.pageSize}, after: "${options.cursor}")` : `(first: ${options.pageSize})`;
    const objectQuery = `query ($address: IotaAddress!) {
            owner(address: $address) {
                dynamicFields${cursorSection} {
                    nodes {
                        name { type { repr }, json }
                        value {
                            ... on MoveValue { json }
                            ... on MoveObject {
                              contents {
                                type {
                                  repr
                                }
                                json
                              }
                            }
                        }
                    }
                    pageInfo { hasNextPage endCursor }
                }
            }
        }`;
    const result = await gqlClient.query({
      query: graphql(objectQuery),
      variables: { address: options.objectId }
    });
    if (result.errors) {
      return {
        nodes: [],
        hasNextPage: false,
        endCursor: null,
        error: JSON.stringify(result.errors, null, 2)
      };
    }
    const data = result.data?.owner?.dynamicFields;
    return {
      nodes: data?.nodes ?? [],
      hasNextPage: data?.pageInfo?.hasNextPage ?? false,
      endCursor: data?.pageInfo?.endCursor ?? null
    };
  } catch (e) {
    return {
      nodes: [],
      hasNextPage: false,
      endCursor: null,
      error: e.message || String(e)
    };
  }
}
async function getMoveLayout(type, graphqlUrl) {
  try {
    const gqlClient = new IotaGraphQLClient({
      url: graphqlUrl
    });
    const query = `query getLayout($type: String!) {
            type(type: $type) {
                layout
            }
        }`;
    const result = await gqlClient.query({
      query: graphql(query),
      variables: { type }
    });
    if (result.errors) {
      return { error: JSON.stringify(result.errors, null, 2) };
    }
    const typeResult = result.data?.type;
    if (!typeResult?.layout) {
      return { error: "Layout not found for this type" };
    }
    return { layout: typeResult.layout };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}
async function queryDynamicField(options) {
  try {
    const gqlClient = new IotaGraphQLClient({
      url: options.graphqlUrl
    });
    const query = `query ($address: IotaAddress!, $type: String!, $bcs: Base64!) {
            owner(address: $address) {
                dynamicField(name: {type: $type, bcs: $bcs}) {
                    name { type { repr }, json }
                    value { ... on MoveValue { 
                        type {
                          repr
                        }
                        json
                        }
                    }
                }
            }
        }`;
    const result = await gqlClient.query({
      query: graphql(query),
      variables: {
        address: options.objectId,
        type: options.fieldType,
        bcs: options.bcsValue
      }
    });
    if (result.errors) {
      return { error: JSON.stringify(result.errors, null, 2) };
    }
    const fieldResult = result.data?.owner?.dynamicField;
    if (fieldResult === null) {
      return {
        error: "Dynamic field not found. The specified field does not exist on this object."
      };
    }
    return { field: fieldResult };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}
async function queryDynamicObjectField(options) {
  try {
    const gqlClient = new IotaGraphQLClient({
      url: options.graphqlUrl
    });
    const query = `query ($address: IotaAddress!, $name: DynamicFieldName!) {
            owner(address: $address) {
                dynamicObjectField(name: $name) {
                    name { type { repr }, json }
                    value { 
                        ... on MoveObject { 
                            contents { 
                                type {
                                  repr
                                }
                                json 
                            } 
                        }
                    }
                }
            }
        }`;
    const result = await gqlClient.query({
      query: graphql(query),
      variables: {
        address: options.objectId,
        name: { type: options.fieldType, bcs: options.bcsValue }
      }
    });
    if (result.errors) {
      return { error: JSON.stringify(result.errors, null, 2) };
    }
    const objectFieldResult = result.data?.owner?.dynamicObjectField;
    if (objectFieldResult === null) {
      return {
        error: "Dynamic object field not found. The specified field does not exist on this object."
      };
    }
    return { field: objectFieldResult };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}
async function enhanceFieldsWithLayoutsAndBcs(fields, graphqlUrl) {
  return Promise.all(
    fields.map(async (field) => {
      try {
        const fieldType = field.name?.type?.repr;
        if (!fieldType) {
          return { ...field, error: "No type information available" };
        }
        const layoutResult = await getMoveLayout(fieldType, graphqlUrl);
        if (layoutResult.error) {
          return { ...field, error: layoutResult.error };
        }
        const moveLayout = layoutResult.layout;
        let bcsValue = null;
        let bcsError = null;
        try {
          if (field.name?.json) {
            const jsonValue = field.name.json;
            bcsValue = mapJsonToBcs(jsonValue, moveLayout);
          }
        } catch (e) {
          bcsError = `BCS computation error: ${e}`;
        }
        return {
          ...field,
          moveLayout,
          bcsValue,
          bcsError
        };
      } catch (e) {
        return { ...field, error: `Processing error: ${e}` };
      }
    })
  );
}
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
async function handleGetLayoutsAndBcsValues(_, dynamicFields, loading, error) {
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
async function handleQueryDynamicField(__1, fieldError, dynamicFieldResult, fieldLoading, getBcsBase64, objectId, fieldType) {
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
async function handleQueryDynamicObjectField(__2, fieldError, dynamicObjectFieldResult, fieldLoading, getBcsBase64, objectId, fieldType) {
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
function addNewStruct(__3, structDefinitions, fieldStructType, updateSelectedStructJson) {
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
var on_click = (__4, handleQueryDynamicFields) => handleQueryDynamicFields();
var root_1 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root_3 = from_html(`<div>No dynamic fields found for this object.</div>`);
var root_5 = from_html(`<button style="margin-top:1em;"> </button>`);
var root_4 = from_html(`<!> <!>`, 1);
var on_click_1 = (__5, layoutType, fieldType, handleGetMoveLayout) => {
  set(layoutType, get(fieldType), true);
  handleGetMoveLayout();
};
var on_click_2 = (__6, bcsInputMode) => {
  set(bcsInputMode, get(bcsInputMode) === "base64" ? "json" : "base64", true);
};
var root_9 = from_html(`<div style="color: red; margin-top: 0.5em; font-size: 0.9em;"> </div>`);
var root_12 = from_html(`<span style="font-family: monospace; padding: 2px 4px; border-radius: 2px;"> </span> <span style="color: #666; font-size: 0.9em; margin-left: 0.5em;"> </span>`, 1);
var root_10 = from_html(`<div style="margin-top: 0.5em;"><strong>Decoded value:</strong> <!></div>`);
var root_8 = from_html(`<div style="margin-top: 0.5em;"><button style="padding: 2px 8px; font-size: 0.9em;">Decode BCS</button></div> <!> <!>`, 1);
var root_7 = from_html(`Field BCS (Base64): <input placeholder="Base64 BCS" size="32"/> <!>`, 1);
var root_14 = from_html(`<option> </option>`);
var root_15 = from_html(`<option> </option>`);
var root_16 = from_html(`<div style="color: red; margin-bottom: 0.5em;"> </div>`);
var on_click_3 = (__7, bcsValue) => navigator.clipboard.writeText(get(bcsValue));
var root_18 = from_html(`<div style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"><strong>Computed BCS Base64 encoded:</strong> <button style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;" title="Copy to clipboard">📋 Copy</button></div>`);
var root_19 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Unable to compute BCS value - check struct definition and value</div>`);
var root_20 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Select a struct type to see computed BCS value</div>`);
var root_13 = from_html(
  `Struct type: Examples apart from Domain are from this package: <a target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;" href="https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields">https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields</a> <br/> In devnet: <a target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;" href="https://explorer.iota.org/object/0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef?module=dynamic_fields&amp;network=devnet">0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef</a> <br/> <select style="margin-right:0.5em;"><!><!></select> <button type="button" style="margin-left:0.5em; padding:2px 8px; font-size:0.9em;">+ Add New</button> <div style="margin-top:1em;"><h4 style="margin-bottom:0.5em;">Selected Struct Definition</h4> <p style="font-size:0.9em; color:#666;">Edit the selected struct. Object should have: name, fieldType, layout (JSON),
                    and value (JSON). The layout defines the structure of the data and will be
                    converted to BCS for serialization.</p> <!> <textarea rows="12" cols="130" style="font-family: monospace;"></textarea></div> <!>`,
  1
);
var on_click_4 = (__8, computedDynamicFieldId) => navigator.clipboard.writeText(get(computedDynamicFieldId));
var root_21 = from_html(`<div style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"><strong>Computed Dynamic Field ID:</strong> <button style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;" title="Copy to clipboard">📋 Copy</button></div>`);
var root_23 = from_html(`<div style="margin-top: 0.5em; color: #666; font-style: italic;">Computing...</div>`);
var root_24 = from_html(`<div style="margin-top: 0.5em; color: #999; font-style: italic;">Enter object ID, field type, and field value to compute dynamic field ID</div>`);
var root_25 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root_26 = from_html(`<h4>dynamicField Result</h4> <!>`, 1);
var root_27 = from_html(`<h4>dynamicObjectField Result</h4> <!>`, 1);
var root_28 = from_html(`<div style="color: red; margin-top: 1em;"> </div>`);
var root = from_html(`<main><h2>Dynamic Fields</h2> <div><label>Object ID: <input placeholder="0x..." size="67"/></label> <br/> <label style="margin-left:1em;">Page size: <input type="number" min="1" max="100" style="width:6rem;"/></label> <button> </button> <button style="margin-left:1em;">Get Layouts and BCS Values</button></div> <!> <!> <hr style="margin:2em 0;"/> <h3>Query Dynamic Field / Dynamic Object Field</h3> <div style="margin-bottom:1em;"><label>Field type (primitive or name.type.repr, like
            &lt;package&gt;::&lt;module&gt;::&lt;struct&gt;): <input placeholder="e.g. 0x1::string::String" style="width: 100%"/></label> <br/> <button style="margin-top:0.5em; margin-bottom:1em;"> </button> <br/> <!> <br/> Field value (default is for structs without fields): <div><button type="button" style="margin-right:0.5em; display: inline-block;"> </button></div> <!> <!></div> <div style="margin-bottom:1em;"><button> </button> <button style="margin-left:1em;"> </button></div> <!> <!> <!> <!></main>`);
function DynamicFields($$anchor, $$props) {
  push($$props, true);
  const [$$stores, $$cleanup] = setup_stores();
  const $customStructs = () => store_get(customStructs, "$customStructs", $$stores);
  let objectId = state("0x35af1c0c5d8ee4878b2686a35639eba6a830c8a99e2e126df560265122bd6c9c");
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
    get(fieldStructType);
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
      const json = JSON.parse(struct.value);
      const bcsSchema = layoutToBcs(struct.layout);
      return toB64(bcsSchema.serialize(json).toBytes());
    } catch (e) {
      set(fieldError, "BCS serialization error: " + e);
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
        const json = JSON.parse(struct.value);
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
    untrack(() => {
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
    });
  }
  function getSelectedStruct() {
    return structDefinitions.find((s) => s.name === get(fieldStructType)) || null;
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
  var label_1 = sibling(label, 4);
  var input_1 = sibling(child(label_1));
  var button = sibling(label_1, 2);
  button.__click = [on_click, handleQueryDynamicFields];
  var text = child(button);
  var button_1 = sibling(button, 2);
  button_1.__click = [handleGetLayoutsAndBcsValues, dynamicFields, loading, error];
  var node = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      var text_1 = child(div_1);
      template_effect(() => set_text(text_1, get(error)));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (get(error)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var fragment = comment();
      var node_2 = first_child(fragment);
      {
        var consequent_1 = ($$anchor3) => {
          var div_2 = root_3();
          append($$anchor3, div_2);
        };
        var alternate = ($$anchor3) => {
          var fragment_1 = root_4();
          var node_3 = first_child(fragment_1);
          JsonToggleView(node_3, {
            get value() {
              return get(dynamicFields);
            }
          });
          var node_4 = sibling(node_3, 2);
          {
            var consequent_2 = ($$anchor4) => {
              var button_2 = root_5();
              button_2.__click = loadMore;
              var text_2 = child(button_2);
              template_effect(() => {
                button_2.disabled = get(loading);
                set_text(text_2, get(loading) ? "Loading..." : "Load more");
              });
              append($$anchor4, button_2);
            };
            if_block(node_4, ($$render) => {
              if (get(hasNextPage)) $$render(consequent_2);
            });
          }
          append($$anchor3, fragment_1);
        };
        if_block(node_2, ($$render) => {
          if (get(dynamicFields).length === 0 && !get(loading)) $$render(consequent_1);
          else $$render(alternate, false);
        });
      }
      append($$anchor2, fragment);
    };
    if_block(node_1, ($$render) => {
      if (get(dynamicFields)) $$render(consequent_3);
    });
  }
  var div_3 = sibling(node_1, 6);
  var label_2 = child(div_3);
  var input_2 = sibling(child(label_2));
  var button_3 = sibling(label_2, 4);
  button_3.__click = [on_click_1, layoutType, fieldType, handleGetMoveLayout];
  var text_3 = child(button_3);
  var node_5 = sibling(button_3, 4);
  {
    var consequent_4 = ($$anchor2) => {
      JsonToggleView($$anchor2, {
        get value() {
          return get(layoutResult);
        }
      });
    };
    if_block(node_5, ($$render) => {
      if (get(layoutResult)) $$render(consequent_4);
    });
  }
  var div_4 = sibling(node_5, 4);
  var button_4 = child(div_4);
  button_4.__click = [on_click_2, bcsInputMode];
  var text_4 = child(button_4);
  var node_6 = sibling(div_4, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var fragment_3 = root_7();
      var input_3 = sibling(first_child(fragment_3));
      var node_7 = sibling(input_3, 2);
      {
        var consequent_8 = ($$anchor3) => {
          var fragment_4 = root_8();
          var div_5 = first_child(fragment_4);
          var button_5 = child(div_5);
          button_5.__click = decodeFieldBcs;
          var node_8 = sibling(div_5, 2);
          {
            var consequent_5 = ($$anchor4) => {
              var div_6 = root_9();
              var text_5 = child(div_6);
              template_effect(() => set_text(text_5, get(decodeError)));
              append($$anchor4, div_6);
            };
            if_block(node_8, ($$render) => {
              if (get(decodeError)) $$render(consequent_5);
            });
          }
          var node_9 = sibling(node_8, 2);
          {
            var consequent_7 = ($$anchor4) => {
              var div_7 = root_10();
              var node_10 = sibling(child(div_7), 2);
              {
                var consequent_6 = ($$anchor5) => {
                  JsonToggleView($$anchor5, {
                    get value() {
                      return get(decodedFieldValue);
                    }
                  });
                };
                var alternate_1 = ($$anchor5) => {
                  var fragment_6 = root_12();
                  var span = first_child(fragment_6);
                  var text_6 = child(span);
                  var span_1 = sibling(span, 2);
                  var text_7 = child(span_1);
                  template_effect(() => {
                    set_text(text_6, get(decodedFieldValue));
                    set_text(text_7, `(${typeof get(decodedFieldValue)})`);
                  });
                  append($$anchor5, fragment_6);
                };
                if_block(node_10, ($$render) => {
                  if (typeof get(decodedFieldValue) === "object" && get(decodedFieldValue) !== null) $$render(consequent_6);
                  else $$render(alternate_1, false);
                });
              }
              append($$anchor4, div_7);
            };
            if_block(node_9, ($$render) => {
              if (get(decodedFieldValue) !== null) $$render(consequent_7);
            });
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_7, ($$render) => {
          if (get(fieldBcs).trim()) $$render(consequent_8);
        });
      }
      bind_value(input_3, () => get(fieldBcs), ($$value) => set(fieldBcs, $$value));
      append($$anchor2, fragment_3);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_7 = root_13();
      var select = sibling(first_child(fragment_7), 9);
      select.__change = updateSelectedStructJson;
      var node_11 = child(select);
      each(node_11, 17, () => structDefinitions, index, ($$anchor3, structDef) => {
        var option = root_14();
        var text_8 = child(option);
        var option_value = {};
        template_effect(() => {
          set_text(text_8, get(structDef).name);
          if (option_value !== (option_value = get(structDef).name)) {
            option.value = (option.__value = get(structDef).name) ?? "";
          }
        });
        append($$anchor3, option);
      });
      var node_12 = sibling(node_11);
      each(node_12, 1, () => Object.keys($customStructs() || {}), index, ($$anchor3, structType) => {
        var option_1 = root_15();
        var text_9 = child(option_1);
        var option_1_value = {};
        template_effect(() => {
          set_text(text_9, get(structType));
          if (option_1_value !== (option_1_value = get(structType))) {
            option_1.value = (option_1.__value = get(structType)) ?? "";
          }
        });
        append($$anchor3, option_1);
      });
      var button_6 = sibling(select, 2);
      button_6.__click = [
        addNewStruct,
        structDefinitions,
        fieldStructType,
        updateSelectedStructJson
      ];
      var div_8 = sibling(button_6, 2);
      var node_13 = sibling(child(div_8), 4);
      {
        var consequent_10 = ($$anchor3) => {
          var div_9 = root_16();
          var text_10 = child(div_9);
          template_effect(() => set_text(text_10, get(structsError)));
          append($$anchor3, div_9);
        };
        if_block(node_13, ($$render) => {
          if (get(structsError)) $$render(consequent_10);
        });
      }
      var textarea = sibling(node_13, 2);
      textarea.__input = updateStructFromJson;
      var node_14 = sibling(div_8, 2);
      {
        var consequent_12 = ($$anchor3) => {
          const bcsValue = user_derived(getBcsBase64);
          var fragment_8 = comment();
          var node_15 = first_child(fragment_8);
          {
            var consequent_11 = ($$anchor4) => {
              var div_10 = root_18();
              var text_11 = sibling(child(div_10));
              var button_7 = sibling(text_11);
              button_7.__click = [on_click_3, bcsValue];
              template_effect(() => set_text(text_11, ` ${get(bcsValue) ?? ""} `));
              append($$anchor4, div_10);
            };
            var alternate_2 = ($$anchor4) => {
              var div_11 = root_19();
              append($$anchor4, div_11);
            };
            if_block(node_15, ($$render) => {
              if (get(bcsValue)) $$render(consequent_11);
              else $$render(alternate_2, false);
            });
          }
          append($$anchor3, fragment_8);
        };
        var alternate_3 = ($$anchor3) => {
          var div_12 = root_20();
          append($$anchor3, div_12);
        };
        if_block(node_14, ($$render) => {
          if (get(fieldStructType)) $$render(consequent_12);
          else $$render(alternate_3, false);
        });
      }
      bind_select_value(select, () => get(fieldStructType), ($$value) => set(fieldStructType, $$value));
      bind_value(textarea, () => get(selectedStructJson), ($$value) => set(selectedStructJson, $$value));
      append($$anchor2, fragment_7);
    };
    if_block(node_6, ($$render) => {
      if (get(bcsInputMode) === "base64") $$render(consequent_9);
      else $$render(alternate_4, false);
    });
  }
  var node_16 = sibling(node_6, 2);
  {
    var consequent_13 = ($$anchor2) => {
      var div_13 = root_21();
      var text_12 = sibling(child(div_13));
      var button_8 = sibling(text_12);
      button_8.__click = [on_click_4, computedDynamicFieldId];
      template_effect(() => set_text(text_12, ` ${get(computedDynamicFieldId) ?? ""} `));
      append($$anchor2, div_13);
    };
    var alternate_6 = ($$anchor2) => {
      var fragment_9 = comment();
      var node_17 = first_child(fragment_9);
      {
        var consequent_14 = ($$anchor3) => {
          var div_14 = root_23();
          append($$anchor3, div_14);
        };
        var alternate_5 = ($$anchor3) => {
          var div_15 = root_24();
          append($$anchor3, div_15);
        };
        if_block(
          node_17,
          ($$render) => {
            if (get(objectId) && get(fieldType) && (get(bcsInputMode) === "base64" ? get(fieldBcs) : get(fieldStructType))) $$render(consequent_14);
            else $$render(alternate_5, false);
          },
          true
        );
      }
      append($$anchor2, fragment_9);
    };
    if_block(node_16, ($$render) => {
      if (get(computedDynamicFieldId)) $$render(consequent_13);
      else $$render(alternate_6, false);
    });
  }
  var div_16 = sibling(div_3, 2);
  var button_9 = child(div_16);
  button_9.__click = [
    handleQueryDynamicField,
    fieldError,
    dynamicFieldResult,
    fieldLoading,
    getBcsBase64,
    objectId,
    fieldType
  ];
  var text_13 = child(button_9);
  var button_10 = sibling(button_9, 2);
  button_10.__click = [
    handleQueryDynamicObjectField,
    fieldError,
    dynamicObjectFieldResult,
    fieldLoading,
    getBcsBase64,
    objectId,
    fieldType
  ];
  var text_14 = child(button_10);
  var node_18 = sibling(div_16, 2);
  {
    var consequent_15 = ($$anchor2) => {
      var div_17 = root_25();
      var text_15 = child(div_17);
      template_effect(() => set_text(text_15, get(fieldError)));
      append($$anchor2, div_17);
    };
    if_block(node_18, ($$render) => {
      if (get(fieldError)) $$render(consequent_15);
    });
  }
  var node_19 = sibling(node_18, 2);
  {
    var consequent_16 = ($$anchor2) => {
      var fragment_10 = root_26();
      var node_20 = sibling(first_child(fragment_10), 2);
      JsonToggleView(node_20, {
        get value() {
          return get(dynamicFieldResult);
        }
      });
      append($$anchor2, fragment_10);
    };
    if_block(node_19, ($$render) => {
      if (get(dynamicFieldResult)) $$render(consequent_16);
    });
  }
  var node_21 = sibling(node_19, 2);
  {
    var consequent_17 = ($$anchor2) => {
      var fragment_11 = root_27();
      var node_22 = sibling(first_child(fragment_11), 2);
      JsonToggleView(node_22, {
        get value() {
          return get(dynamicObjectFieldResult);
        }
      });
      append($$anchor2, fragment_11);
    };
    if_block(node_21, ($$render) => {
      if (get(dynamicObjectFieldResult)) $$render(consequent_17);
    });
  }
  var node_23 = sibling(node_21, 2);
  {
    var consequent_18 = ($$anchor2) => {
      var div_18 = root_28();
      var text_16 = child(div_18);
      template_effect(() => set_text(text_16, get(layoutError)));
      append($$anchor2, div_18);
    };
    if_block(node_23, ($$render) => {
      if (get(layoutError)) $$render(consequent_18);
    });
  }
  template_effect(
    ($0, $1) => {
      button.disabled = get(loading) || !get(objectId);
      set_text(text, get(loading) ? "Loading..." : "Query Dynamic Fields");
      button_1.disabled = get(loading) || !get(dynamicFields) || get(dynamicFields).length === 0;
      button_3.disabled = get(layoutLoading) || !get(fieldType);
      set_text(text_3, get(layoutLoading) ? "Loading..." : "Get Layout for this type");
      set_text(text_4, get(bcsInputMode) === "base64" ? "Switch to JSON" : "Switch to Base64");
      button_9.disabled = $0;
      set_text(text_13, get(fieldLoading) ? "Loading..." : "Query dynamicField");
      button_10.disabled = $1;
      set_text(text_14, get(fieldLoading) ? "Loading..." : "Query dynamicObjectField");
    },
    [
      () => get(fieldLoading) || !get(objectId) || !get(fieldType) || (get(bcsInputMode) === "base64" ? !get(fieldBcs) : !get(fieldStructType) || getBcsBase64() === ""),
      () => get(fieldLoading) || !get(objectId) || !get(fieldType) || (get(bcsInputMode) === "base64" ? !get(fieldBcs) : !get(fieldStructType) || getBcsBase64() === "")
    ]
  );
  bind_value(input, () => get(objectId), ($$value) => set(objectId, $$value));
  bind_value(input_1, () => get(pageSize), ($$value) => set(pageSize, $$value));
  bind_value(input_2, () => get(fieldType), ($$value) => set(fieldType, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click", "change", "input"]);
export {
  DynamicFields as default
};

import { K as iotaBcs, ac as toBase64, I as IotaGraphQLClient, J as fromBase64, b3 as blake2b, br as bytesToHex } from "./index-BWVyRlg_.js";
import { g as graphql } from "./index-a-qIJzeT.js";
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
  return toBase64(schema.serialize(json).toBytes());
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
  const valueBcsBytes = fromBase64(valueBytesB64);
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
export {
  deriveDynamicFieldIdWithBcs as a,
  deriveDynamicFieldId as b,
  queryDynamicField as c,
  decodeBcs as d,
  enhanceFieldsWithLayoutsAndBcs as e,
  queryDynamicObjectField as f,
  getMoveLayout as g,
  layoutToBcs as l,
  queryDynamicFields as q
};

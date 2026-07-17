import { L as iotaBcs, Q as toBase64, Z as fromBase64 } from "./keypair-DsT3ivIR.js";
import { t as IotaGraphQLClient } from "./client-CmDrt-ez.js";
import { C as bytesToHex } from "./_u64-Dkyx1UQH.js";
import { t as blake2b } from "./blake2-O-wgjgc8.js";
import { t as graphql } from "./2025.2-wBXoWMFy.js";
//#region src/lib/pages/dynamic-fields/bcs-conversion.ts
/**
* Convert type string to short format
*/
function toShortTypeString(type) {
	return type?.replace(/0x0{31,}(\d)/g, "0x$1").replace(/,\b/g, ", ");
}
/**
* Convert MoveTypeLayout to BCS schema
*/
function layoutToBcs(layout) {
	switch (layout) {
		case "address": return iotaBcs.Address;
		case "bool": return iotaBcs.Bool;
		case "u8": return iotaBcs.U8;
		case "u16": return iotaBcs.U16;
		case "u32": return iotaBcs.U32;
		case "u64": return iotaBcs.U64;
		case "u128": return iotaBcs.U128;
		case "u256": return iotaBcs.U256;
	}
	if ("vector" in layout) {
		const innerType = layoutToBcs(layout.vector);
		const vectorType = iotaBcs.vector(innerType);
		if (layout.vector === "u8") return vectorType.transform({
			input: (value) => {
				if (typeof value === "string") return Array.from(new TextEncoder().encode(value));
				return value;
			},
			output: (value) => {
				if (Array.isArray(value)) return new TextDecoder().decode(new Uint8Array(value));
				return value;
			}
		});
		return vectorType;
	}
	if ("struct" in layout) {
		const fields = {};
		for (const { name, layout: field } of layout.struct.fields) fields[name] = layoutToBcs(field);
		let struct = iotaBcs.struct(layout.struct.type, fields);
		const structName = toShortTypeString(layout.struct.type);
		if (structName === "0x2::object::ID") struct = struct.transform({
			input: (id) => typeof id === "string" ? { bytes: id } : id,
			output: (id) => id.id
		});
		if (structName === "0x1::string::String") struct = struct.transform({
			input: (str) => typeof str === "string" ? { bytes: str } : str,
			output: (obj) => obj.bytes
		});
		return struct;
	}
	throw new Error(`Unknown layout: ${JSON.stringify(layout)}`);
}
/**
* Convert JSON to BCS using a Move layout
*/
function mapJsonToBcs(json, layout) {
	return toBase64(layoutToBcs(layout).serialize(json).toBytes());
}
/**
* Decode BCS data using a Move layout
*/
function decodeBcs(bcsBase64, layout) {
	try {
		const schema = layoutToBcs(layout);
		const bcsBytes = new Uint8Array(atob(bcsBase64).split("").map((c) => c.charCodeAt(0)));
		return { value: schema.parse(bcsBytes) };
	} catch (e) {
		return { error: e.message || String(e) };
	}
}
//#endregion
//#region src/lib/utils/dynamic-fields.ts
function deriveDynamicFieldId(parentObjectId, tag, valueType, value) {
	const typeTagBytes = iotaBcs.TypeTag.serialize(tag).toBytes();
	const valueBcsBytes = valueType.serialize(value).toBytes();
	const valueBcsBytesLen = /* @__PURE__ */ new Uint8Array(8);
	new DataView(valueBcsBytesLen.buffer).setUint32(0, valueBcsBytes.length, true);
	return `0x${bytesToHex(blake2b(new Uint8Array([
		240,
		...iotaBcs.Address.serialize(parentObjectId).toBytes(),
		...valueBcsBytesLen,
		...valueBcsBytes,
		...typeTagBytes
	]), { dkLen: 32 }))}`;
}
function deriveDynamicFieldIdWithBcs(parentObjectId, tag, valueBytesB64) {
	const typeTagBytes = iotaBcs.TypeTag.serialize(tag).toBytes();
	const valueBcsBytes = fromBase64(valueBytesB64);
	const valueBcsBytesLen = /* @__PURE__ */ new Uint8Array(8);
	new DataView(valueBcsBytesLen.buffer).setUint32(0, valueBcsBytes.length, true);
	return `0x${bytesToHex(blake2b(new Uint8Array([
		240,
		...iotaBcs.Address.serialize(parentObjectId).toBytes(),
		...valueBcsBytesLen,
		...valueBcsBytes,
		...typeTagBytes
	]), { dkLen: 32 }))}`;
}
/**
* Query dynamic fields for an object
*/
async function queryDynamicFields(options) {
	try {
		const gqlClient = new IotaGraphQLClient({ url: options.graphqlUrl });
		const objectQuery = `query ($address: IotaAddress!) {
            owner(address: $address) {
                dynamicFields${options.cursor ? `(first: ${options.pageSize}, after: "${options.cursor}")` : `(first: ${options.pageSize})`} {
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
		if (result.errors) return {
			nodes: [],
			hasNextPage: false,
			endCursor: null,
			error: JSON.stringify(result.errors, null, 2)
		};
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
/**
* Get the Move layout for a specific type
*/
async function getMoveLayout(type, graphqlUrl) {
	try {
		const result = await new IotaGraphQLClient({ url: graphqlUrl }).query({
			query: graphql(`query getLayout($type: String!) {
            type(type: $type) {
                layout
            }
        }`),
			variables: { type }
		});
		if (result.errors) return { error: JSON.stringify(result.errors, null, 2) };
		const typeResult = result.data?.type;
		if (!typeResult?.layout) return { error: "Layout not found for this type" };
		return { layout: typeResult.layout };
	} catch (e) {
		return { error: e.message || String(e) };
	}
}
/**
* Query a specific dynamic field
*/
async function queryDynamicField(options) {
	try {
		const result = await new IotaGraphQLClient({ url: options.graphqlUrl }).query({
			query: graphql(`query ($address: IotaAddress!, $type: String!, $bcs: Base64!) {
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
        }`),
			variables: {
				address: options.objectId,
				type: options.fieldType,
				bcs: options.bcsValue
			}
		});
		if (result.errors) return { error: JSON.stringify(result.errors, null, 2) };
		const fieldResult = result.data?.owner?.dynamicField;
		if (fieldResult === null) return { error: "Dynamic field not found. The specified field does not exist on this object." };
		return { field: fieldResult };
	} catch (e) {
		return { error: e.message || String(e) };
	}
}
/**
* Query a specific dynamic object field
*/
async function queryDynamicObjectField(options) {
	try {
		const result = await new IotaGraphQLClient({ url: options.graphqlUrl }).query({
			query: graphql(`query ($address: IotaAddress!, $name: DynamicFieldName!) {
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
        }`),
			variables: {
				address: options.objectId,
				name: {
					type: options.fieldType,
					bcs: options.bcsValue
				}
			}
		});
		if (result.errors) return { error: JSON.stringify(result.errors, null, 2) };
		const objectFieldResult = result.data?.owner?.dynamicObjectField;
		if (objectFieldResult === null) return { error: "Dynamic object field not found. The specified field does not exist on this object." };
		return { field: objectFieldResult };
	} catch (e) {
		return { error: e.message || String(e) };
	}
}
/**
* Enhance dynamic fields with layouts and BCS values
*/
async function enhanceFieldsWithLayoutsAndBcs(fields, graphqlUrl) {
	return Promise.all(fields.map(async (field) => {
		try {
			const fieldType = field.name?.type?.repr;
			if (!fieldType) return {
				...field,
				error: "No type information available"
			};
			const layoutResult = await getMoveLayout(fieldType, graphqlUrl);
			if (layoutResult.error) return {
				...field,
				error: layoutResult.error
			};
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
			return {
				...field,
				error: `Processing error: ${e}`
			};
		}
	}));
}
//#endregion
export { queryDynamicField as a, decodeBcs as c, getMoveLayout as i, layoutToBcs as l, deriveDynamicFieldIdWithBcs as n, queryDynamicFields as o, enhanceFieldsWithLayoutsAndBcs as r, queryDynamicObjectField as s, deriveDynamicFieldId as t };

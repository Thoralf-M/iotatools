import { fromBase64, type BcsType } from '@iota/bcs';
import { bcs } from '@iota/iota-sdk/bcs';
import { IotaGraphQLClient, type GraphQLQueryResult } from '@iota/iota-sdk/graphql';
import { graphql, type MoveTypeLayout } from '@iota/iota-sdk/graphql/schemas/2025.2';
import { blake2b } from '@noble/hashes/blake2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

import { mapJsonToBcs } from '../pages/dynamic-fields/bcs-conversion';

// Derive a dynamic field ID
export function deriveDynamicFieldId<T>(
    parentObjectId: string,
    tag: string,
    valueType: BcsType<T>,
    value: T,
): string {
    const typeTagBytes = bcs.TypeTag.serialize(tag).toBytes();
    const valueBcsBytes = valueType.serialize(value).toBytes();

    const valueBcsBytesLen = new Uint8Array(8);
    const view = new DataView(valueBcsBytesLen.buffer);
    view.setUint32(0, valueBcsBytes.length, true); // little-endian

    const input = new Uint8Array([
        // HashingIntentScope::ChildObjectId
        0xf0,
        ...bcs.Address.serialize(parentObjectId).toBytes(),
        ...valueBcsBytesLen,
        ...valueBcsBytes,
        ...typeTagBytes,
    ]);

    const hash = blake2b(input, { dkLen: 32 });

    return `0x${bytesToHex(hash)}`;
}

// Derive a dynamic field ID with value BCS bytes base64 encoded
export function deriveDynamicFieldIdWithBcs(
    parentObjectId: string,
    tag: string,
    valueBytesB64: string,
): string {
    const typeTagBytes = bcs.TypeTag.serialize(tag).toBytes();
    const valueBcsBytes = fromBase64(valueBytesB64);

    const valueBcsBytesLen = new Uint8Array(8);
    const view = new DataView(valueBcsBytesLen.buffer);
    view.setUint32(0, valueBcsBytes.length, true); // little-endian

    const input = new Uint8Array([
        // HashingIntentScope::ChildObjectId
        0xf0,
        ...bcs.Address.serialize(parentObjectId).toBytes(),
        ...valueBcsBytesLen,
        ...valueBcsBytes,
        ...typeTagBytes,
    ]);

    const hash = blake2b(input, { dkLen: 32 });

    return `0x${bytesToHex(hash)}`;
}

export interface DynamicFieldsQueryOptions {
    objectId: string;
    pageSize: number;
    cursor?: string;
    graphqlUrl: string;
}

export interface DynamicFieldsResult {
    nodes: any[];
    hasNextPage: boolean;
    endCursor: string | null;
    error?: string;
}

export interface LayoutResult {
    layout?: MoveTypeLayout;
    error?: string;
}

export interface DynamicFieldQueryOptions {
    objectId: string;
    fieldType: string;
    bcsValue: string;
    graphqlUrl: string;
}

export interface DynamicFieldResult {
    field?: any;
    error?: string;
}

/**
 * Query dynamic fields for an object
 */
export async function queryDynamicFields(
    options: DynamicFieldsQueryOptions,
): Promise<DynamicFieldsResult> {
    try {
        const gqlClient = new IotaGraphQLClient({
            url: options.graphqlUrl,
        });

        const cursorSection = options.cursor
            ? `(first: ${options.pageSize}, after: "${options.cursor}")`
            : `(first: ${options.pageSize})`;

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

        const result: GraphQLQueryResult = await gqlClient.query({
            query: graphql(objectQuery),
            variables: { address: options.objectId },
        });

        if (result.errors) {
            return {
                nodes: [],
                hasNextPage: false,
                endCursor: null,
                error: JSON.stringify(result.errors, null, 2),
            };
        }

        const data = (result.data as any)?.owner?.dynamicFields;
        return {
            nodes: data?.nodes ?? [],
            hasNextPage: data?.pageInfo?.hasNextPage ?? false,
            endCursor: data?.pageInfo?.endCursor ?? null,
        };
    } catch (e: any) {
        return {
            nodes: [],
            hasNextPage: false,
            endCursor: null,
            error: e.message || String(e),
        };
    }
}

/**
 * Get the Move layout for a specific type
 */
export async function getMoveLayout(type: string, graphqlUrl: string): Promise<LayoutResult> {
    try {
        const gqlClient = new IotaGraphQLClient({
            url: graphqlUrl,
        });

        const query = `query getLayout($type: String!) {
            type(type: $type) {
                layout
            }
        }`;

        const result: GraphQLQueryResult = await gqlClient.query({
            query: graphql(query),
            variables: { type },
        });

        if (result.errors) {
            return { error: JSON.stringify(result.errors, null, 2) };
        }

        const typeResult = (result.data as any)?.type;
        if (!typeResult?.layout) {
            return { error: 'Layout not found for this type' };
        }

        return { layout: typeResult.layout };
    } catch (e: any) {
        return { error: e.message || String(e) };
    }
}

/**
 * Query a specific dynamic field
 */
export async function queryDynamicField(
    options: DynamicFieldQueryOptions,
): Promise<DynamicFieldResult> {
    try {
        const gqlClient = new IotaGraphQLClient({
            url: options.graphqlUrl,
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

        const result: GraphQLQueryResult = await gqlClient.query({
            query: graphql(query),
            variables: {
                address: options.objectId,
                type: options.fieldType,
                bcs: options.bcsValue,
            },
        });

        if (result.errors) {
            return { error: JSON.stringify(result.errors, null, 2) };
        }

        const fieldResult = (result.data as any)?.owner?.dynamicField;
        if (fieldResult === null) {
            return {
                error: 'Dynamic field not found. The specified field does not exist on this object.',
            };
        }

        return { field: fieldResult };
    } catch (e: any) {
        return { error: e.message || String(e) };
    }
}

/**
 * Query a specific dynamic object field
 */
export async function queryDynamicObjectField(
    options: DynamicFieldQueryOptions,
): Promise<DynamicFieldResult> {
    try {
        const gqlClient = new IotaGraphQLClient({
            url: options.graphqlUrl,
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

        const result: GraphQLQueryResult = await gqlClient.query({
            query: graphql(query),
            variables: {
                address: options.objectId,
                name: { type: options.fieldType, bcs: options.bcsValue },
            },
        });

        if (result.errors) {
            return { error: JSON.stringify(result.errors, null, 2) };
        }

        const objectFieldResult = (result.data as any)?.owner?.dynamicObjectField;
        if (objectFieldResult === null) {
            return {
                error: 'Dynamic object field not found. The specified field does not exist on this object.',
            };
        }

        return { field: objectFieldResult };
    } catch (e: any) {
        return { error: e.message || String(e) };
    }
}

/**
 * Enhance dynamic fields with layouts and BCS values
 */
export async function enhanceFieldsWithLayoutsAndBcs(
    fields: any[],
    graphqlUrl: string,
): Promise<any[]> {
    return Promise.all(
        fields.map(async (field: any) => {
            try {
                const fieldType = field.name?.type?.repr;
                if (!fieldType) {
                    return { ...field, error: 'No type information available' };
                }

                // Get the move layout for this field type
                const layoutResult = await getMoveLayout(fieldType, graphqlUrl);

                if (layoutResult.error) {
                    return { ...field, error: layoutResult.error };
                }

                const moveLayout = layoutResult.layout!;

                // Compute BCS value using the layout and existing field value
                let bcsValue = null;
                let bcsError = null;

                try {
                    if (field.name?.json) {
                        // field.name.json is already a parsed object, not a JSON string
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
                    bcsError,
                };
            } catch (e) {
                return { ...field, error: `Processing error: ${e}` };
            }
        }),
    );
}

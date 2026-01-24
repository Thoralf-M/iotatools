// IOTA Names data fetching functions
import { Transaction } from '@iota/iota-sdk/transactions';
import { toHex } from '@iota/iota-sdk/utils';

import { getClient } from '../../utils/client';
import { config } from './iota-names-config';
import { createGraphQLClient, queryGraphQl } from './iota-names-graphql';

/**
 * Query for the IOTA Names object ID
 */
export async function queryIotaNamesObjectId() {
    const gqlClient = createGraphQLClient();

    const objectQuery = `{
      objects(filter: {type: "${config.IOTA_NAMES_PACKAGE_ID}::iota_names::IotaNames"}) {
        edges {
          node {
            address
          }
        }
      }
    }`;
    let object = await queryGraphQl(gqlClient, objectQuery, {});
    // @ts-ignore
    if (object.data.objects.edges.length > 0) {
        // @ts-ignore
        config.IOTA_NAMES_OBJECT_ID = object.data.objects.edges[0].node.address;
    } else {
        config.IOTA_NAMES_OBJECT_ID = 'Not found';
    }
}

/**
 * Query for the auction house object ID
 */
export async function queryAuctionObjectId() {
    const gqlClient = createGraphQLClient();

    const objectQuery = `{
      objects(filter: {type: "${config.AUCTION_PACKAGE_ID}::auction::AuctionHouse"}) {
        edges {
          node {
            address
          }
        }
      }
    }`;
    let object = await queryGraphQl(gqlClient, objectQuery, {});
    // @ts-ignore
    config.AUCTION_HOUSE_OBJECT_ID = object.data.objects.edges[0].node.address;
}

/**
 * Query dynamic fields for the IOTA Names object
 */
export async function queryDynamicFields() {
    const gqlClient = createGraphQLClient();

    if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
        await queryIotaNamesObjectId();
    }

    if (config.IOTA_NAMES_OBJECT_ID == 'Not found') {
        throw new Error('IOTA Names object not found on this network');
    }

    const objectQuery = `query ($address: IotaAddress!) {
            owner(address: $address) {
                dynamicFields {
                nodes {
                    name { type {
                            repr
                    } }
                    value {
                    ... on MoveValue {
                        json
                    }
                    }
                }
                }
            }
        }`;
    let dynamicFields: any = await queryGraphQl(gqlClient, objectQuery, {
        address: config.IOTA_NAMES_OBJECT_ID,
    });
    return dynamicFields;
}

/**
 * Resolve an IOTA name to an address
 */
export const resolveAddress = async (nameName: string) => {
    try {
        if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
            await queryIotaNamesObjectId();
        }
        const tx = new Transaction();
        let name = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::name::new`,
            arguments: [tx.pure.string(nameName)],
        });
        let registry = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
            typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
            arguments: [
                tx.sharedObjectRef({
                    objectId: config.IOTA_NAMES_OBJECT_ID,
                    initialSharedVersion: 1,
                    mutable: true,
                }),
            ],
        });
        let nameRecordOption = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::registry::lookup`,
            arguments: [registry, name],
        });
        let nameRecord = tx.moveCall({
            target: `0x1::option::borrow`,
            typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::name_record::NameRecord`],
            arguments: [nameRecordOption],
        });
        let targetAddressOption = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::name_record::target_address`,
            arguments: [nameRecord],
        });
        tx.moveCall({
            target: `0x1::option::borrow`,
            typeArguments: [`address`],
            arguments: [targetAddressOption],
        });

        let client = getClient();
        let txResult = await client.devInspectTransactionBlock({
            sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
            transactionBlock: tx,
        });
        console.log(txResult);
        if (txResult.error) {
            throw new Error(txResult.error);
        }
        let resolvedAddress =
            '0x' + toHex(new Uint8Array(txResult.results?.pop()?.returnValues?.[0][0]!));
        console.log(resolvedAddress);
        return resolvedAddress;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

/**
 * Resolve an address to an IOTA name
 */
export const resolveName = async (address: string) => {
    try {
        if (!address.startsWith('0x')) {
            throw new Error('invalid address');
        }
        if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
            await queryIotaNamesObjectId();
        }
        const tx = new Transaction();
        let registry = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
            typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
            arguments: [
                tx.sharedObjectRef({
                    objectId: config.IOTA_NAMES_OBJECT_ID,
                    initialSharedVersion: 1,
                    mutable: true,
                }),
            ],
        });
        let nameOption = tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::registry::reverse_lookup`,
            arguments: [registry, tx.pure.address(address)],
        });
        let name = tx.moveCall({
            target: `0x1::option::borrow`,
            typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::name::Name`],
            arguments: [nameOption],
        });
        tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::name::to_string`,
            arguments: [name],
        });

        let client = getClient();
        let txResult = await client.devInspectTransactionBlock({
            sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
            transactionBlock: tx,
        });
        console.log(txResult);
        if (txResult.error) {
            throw new Error(txResult.error);
        }
        // .slice(1) to remove the length prefix
        let nameBytes = txResult.results?.pop()?.returnValues?.[0][0]!.slice(1)!;
        let resolvedName = new TextDecoder().decode(new Uint8Array(nameBytes));
        console.log(resolvedName);
        return resolvedName;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

/**
 * Get registry entry for a name
 */
export const getRegistryEntry = async (nameName: string) => {
    try {
        let client = getClient();
        let result = await client.iotaNamesLookup({ name: nameName });
        console.log(result);
        return result || 'No registry entry found';
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

/**
 * Get registered names (internal function)
 */
export async function getRegisteredNamesInner(
    showResult?: boolean,
    onProgress?: (result: any) => void,
    signal?: AbortSignal,
): Promise<object> {
    const gqlClient = createGraphQLClient();

    let dynamicFields = await queryDynamicFields();
    let registration =
        // @ts-ignore
        dynamicFields.data.owner.dynamicFields.nodes.find(
            (v: any) =>
                v.name.type.repr ==
                `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry>`,
        );
    let registryId = registration.value.json.registry.id;

    let res = { total: 0, names: [], registrations: [] };

    let cursorSection = '';
    while (true) {
        // Check if operation was cancelled
        if (signal?.aborted) {
            throw new Error('Operation cancelled');
        }

        let query = `query ($address: IotaAddress) {
            owner(address: $address) {
                dynamicFields${cursorSection} {
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        name {
                            json
                        }
                        value {
                            ... on MoveValue {
                                json
                            }
                        }
                    }
                }
            }
        }`;

        let object = await queryGraphQl(gqlClient, query, {
            address: registryId,
        });

        if (object.errors) {
            break;
        }
        // @ts-ignore
        res.total += object.data.owner.dynamicFields.nodes.length;
        res.names.push(
            // @ts-ignore
            ...object.data.owner.dynamicFields.nodes.map((v) =>
                v.name.json.labels.reverse().join('.'),
            ),
        );
        // @ts-ignore
        res.registrations.push(...object.data.owner.dynamicFields.nodes);

        // Call progress callback if provided
        if (onProgress) {
            onProgress({ ...res });
        }

        // If showResult is true, return after first page to show results immediately
        if (showResult) {
            // Continue fetching in background but return current results
            // Note: This is a simplified approach - in a real implementation you might want to
            // implement proper streaming or pagination UI
            break;
        }

        // @ts-ignore
        if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
            // @ts-ignore
            cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
        } else {
            break;
        }
    }

    return res;
}

/**
 * List registered names
 */
export async function listRegisteredNames(
    onProgress?: (result: any) => void,
    signal?: AbortSignal,
) {
    try {
        return await getRegisteredNamesInner(false, onProgress, signal);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Get reverse registered addresses
 */
export async function getReverseRegisteredAddresses(
    onProgress?: (result: any) => void,
    signal?: AbortSignal,
) {
    try {
        const gqlClient = createGraphQLClient();

        let dynamicFields = await queryDynamicFields();
        let registration =
            // @ts-ignore
            dynamicFields.data.owner.dynamicFields.nodes.find(
                (v: any) =>
                    v.name.type.repr ==
                    `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry>`,
            );
        let reverseRegistryId = registration.value.json.reverse_registry.id;

        let res: { total: number; reverseRegistry: { address: string; name: string }[] } = { total: 0, reverseRegistry: [] };

        let cursorSection = '';
        while (true) {
            // Check if operation was cancelled
            if (signal?.aborted) {
                throw new Error('Operation cancelled');
            }

            let query = `query ($address: IotaAddress) {
                owner(address: $address) {
                    dynamicFields${cursorSection} {
                        pageInfo{
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            name {
                                json
                            }
                            value {
                                ... on MoveValue {
                                    json
                                }
                            }
                        }
                    }
                }
            }`;

            let object = await queryGraphQl(gqlClient, query, {
                address: reverseRegistryId,
            });

            if (object.errors) {
                break;
            }

            // @ts-ignore
            const newEntries = object.data.owner.dynamicFields.nodes.map((v: any) => {
                return {
                    address: v.name.json,
                    name: v.value.json.labels.reverse().join('.'),
                };
            });

            res.total += newEntries.length;
            res.reverseRegistry.push(...newEntries);

            // Call progress callback if provided
            if (onProgress) {
                onProgress({ ...res });
            }

            // @ts-ignore
            if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
                // @ts-ignore
                cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
            } else {
                break;
            }
        }

        return res;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Get dynamic fields
 */
export async function getDynamicFields() {
    try {
        return await queryDynamicFields();
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

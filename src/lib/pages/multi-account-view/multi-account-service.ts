import { getClient, getSelectedNetworkConfig } from '../../utils/client';
import { computeStakingRewards } from '../../utils/staking-utils';
import { GraphQlClient } from '../../utils/wasm-sdk';

export interface ExtendedAccount {
    id: string;
    address: string;
    label: string | undefined;
    objects: ExtendedObject[];
    timelockedObjects: ExtendedObject[];
    stakingRewards: bigint;
    isCollapsed: boolean;
}

export interface ExtendedObject {
    id: string;
    label: string;
    data: any;
    currentOwner: string;
}

const OWNED_OBJECTS_QUERY = `
    query getOwnedObjects($owner: IotaAddress!, $cursor: String) {
        address(address: $owner) {
            objects(after: $cursor) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    address
                    digest
                    version
                    asMoveObject {
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
    }
`;

/**
 * Flatten GraphQL JSON fields to match the old JSON-RPC content.fields shape.
 * GraphQL returns Balance values as { value: "123" } objects, but the old
 * JSON-RPC API returned them as plain strings like "123".
 * Also wraps nested move objects (like staked_iota) in a { fields: { ... } }
 * wrapper to match the old content.fields nesting.
 */
function flattenJsonFields(json: any): any {
    if (json == null || typeof json !== 'object') {
        return json;
    }
    if (Array.isArray(json)) {
        return json.map(flattenJsonFields);
    }
    // If the object has only a "value" key, unwrap it to the plain value
    const keys = Object.keys(json);
    if (keys.length === 1 && keys[0] === 'value') {
        return json.value;
    }
    // Otherwise recursively flatten each property
    const result: any = {};
    for (const key of keys) {
        const val = json[key];
        if (val != null && typeof val === 'object' && !Array.isArray(val)) {
            const valKeys = Object.keys(val);
            // If it's a { value: ... } wrapper, unwrap it
            if (valKeys.length === 1 && valKeys[0] === 'value') {
                result[key] = val.value;
            } else {
                // It's a nested object (like staked_iota) - wrap in { fields: { ... } }
                // to match the old JSON-RPC nesting pattern
                result[key] = { fields: flattenJsonFields(val) };
            }
        } else {
            result[key] = flattenJsonFields(val);
        }
    }
    return result;
}

/**
 * Transform a GraphQL object node into the old JSON-RPC data shape.
 * This preserves compatibility with the MultiAccountView component which
 * accesses obj.data.content.type, obj.data.content.fields, obj.data.objectId, etc.
 */
function transformGraphQlObject(node: any): any {
    const type = node.asMoveObject?.contents?.type?.repr;
    const json = node.asMoveObject?.contents?.json;
    const fields = json ? flattenJsonFields(json) : {};

    return {
        objectId: node.address,
        digest: node.digest,
        version: node.version,
        content: {
            type: type || '',
            fields,
        },
    };
}

/**
 * Compute staking rewards for all accounts
 */
export async function computeAllStakingRewards(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const client = getClient();
        const updatedAccounts = await Promise.all(
            accounts.map(async (account) => {
                // Collect all staked objects (both regular and timelocked)
                const stakedIotaObjects = account.objects.filter(
                    (obj) => obj.label === 'StakedIota',
                );
                const timelockedStakedIotaObjects = account.timelockedObjects.filter(
                    (obj) => obj.label === 'TimelockedStakedIota',
                );
                const allStakedObjects = [...stakedIotaObjects, ...timelockedStakedIotaObjects];

                // Calculate rewards in parallel for all staked objects
                const rewardsPromises = allStakedObjects.map(async (obj) => {
                    try {
                        const stakeData = await computeStakingRewards(
                            client,
                            obj.id,
                            account.address,
                        );
                        return BigInt(stakeData.rewards);
                    } catch (err) {
                        console.warn(`Failed to compute rewards for ${obj.label} ${obj.id}:`, err);
                        return BigInt(0);
                    }
                });

                const rewards = await Promise.all(rewardsPromises);
                const totalRewards = rewards.reduce((sum, reward) => sum + reward, BigInt(0));

                return { ...account, stakingRewards: totalRewards };
            }),
        );
        return updatedAccounts;
    } catch (err: any) {
        console.error('Error computing staking rewards:', err);
        throw err;
    }
}

/**
 * Fetch objects for all accounts using GraphQL
 */
export async function getObjectsForAccounts(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const gqlClient = new GraphQlClient(getSelectedNetworkConfig().graphql);

        // Iterate over accounts, get the owned objects for each account
        const updatedAccounts = await Promise.all(
            accounts.map(async (account) => {
                // Fetch all pages of owned objects
                let allNodes: any[] = [];
                let cursor: string | null = null;
                let hasNextPage = true;

                while (hasNextPage) {
                    const resultStr = await gqlClient.runQuery({
                        query: OWNED_OBJECTS_QUERY,
                        variables: JSON.stringify({
                            owner: account.address,
                            cursor,
                        }),
                    });
                    const result: any = JSON.parse(resultStr);
                    const objectsData = result?.address?.objects;

                    if (!objectsData?.nodes?.length) break;

                    allNodes = allNodes.concat(objectsData.nodes);
                    hasNextPage = objectsData.pageInfo.hasNextPage;
                    cursor = objectsData.pageInfo.endCursor;
                }

                // Map the returned objects to the expected format
                const objects = allNodes.map((node) => {
                    const data = transformGraphQlObject(node);
                    let label = data.content?.type;
                    if (typeof label === 'string') {
                        // Only show the actual type name
                        label = label.split('::').slice(2).join('::');
                    }
                    return {
                        id: data.objectId,
                        label,
                        data,
                        currentOwner: account.address,
                    };
                });

                // separate timelocked objects
                const timelockedObjects: ExtendedObject[] = [];
                const filteredObjects: ExtendedObject[] = [];
                for (const obj of objects) {
                    if (obj.label === 'TimelockedStakedIota' || obj.label.startsWith('TimeLock<')) {
                        timelockedObjects.push(obj);
                    } else {
                        filteredObjects.push(obj);
                    }
                }

                return { ...account, objects: filteredObjects, timelockedObjects };
            }),
        );
        return updatedAccounts;
    } catch (err: any) {
        console.error('Error fetching objects:', err);
        throw err;
    }
}

// Fetch current IOTA price from CoinGecko
export async function fetchCurrentPrice(): Promise<{ usd: number; eur: number } | null> {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/iota';
        const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            const usd = data?.market_data?.current_price?.usd;
            const eur = data?.market_data?.current_price?.eur;

            if (typeof usd === 'number' || typeof eur === 'number') {
                return { usd, eur };
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        console.error('Failed to fetch current price:', err);
        return null;
    }
}

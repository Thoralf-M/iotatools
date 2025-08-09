import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
import { getSelectedNetworkConfig } from '../client';
import { bcs, toB64 } from '@iota/bcs';

async function fetchStakeTransactionsByRole(address: string, role: 'signAddress' | 'recvAddress') {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    let allNodes: any[] = [];
    let cursorSection = '';
    let hasNextPage = true;
    let endCursor = '';
    while (hasNextPage) {
        console.log(`Fetching transactions for address: ${address}, role: ${role}, cursor: ${endCursor}`);

        const query = `
            query ($address: IotaAddress) {
                transactionBlocks(
                    filter: {
                        ${role}: $address
                    }
                    ${cursorSection}
                ) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        digest
                        effects {
                            epoch {
                                epochId
                            }
                            objectChanges {
                                nodes {
                                    idDeleted
                                    idCreated
                                    address
                                    inputState {
                                        asMoveObject {
                                            owner {
                                                ... on AddressOwner {
                                                    owner {
                                                        ... on IOwner {
                                                            address
                                                        }
                                                    }
                                                }
                                            }
                                            contents {
                                                type {
                                                    repr
                                                }
                                                json
                                            }
                                        }
                                    }
                                    outputState {
                                        asMoveObject {
                                            owner {
                                                ... on AddressOwner {
                                                    owner {
                                                        ... on IOwner {
                                                            address
                                                        }
                                                    }
                                                }
                                            }
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
                    }
                }
            }
        `;

        const variables = { address };
        const result = await gqlClient.query({ query, variables });
        const txBlocks = result.data?.transactionBlocks;
        // @ts-ignore
        if (txBlocks?.nodes) {
            // @ts-ignore
            allNodes.push(...txBlocks.nodes);
        }
        // @ts-ignore
        hasNextPage = txBlocks?.pageInfo?.hasNextPage;
        // @ts-ignore
        endCursor = txBlocks?.pageInfo?.endCursor;
        if (hasNextPage && endCursor) {
            cursorSection = `after: \"${endCursor}\"`;
        } else {
            break;
        }
    }
    const stakeTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000003::staking_pool::StakedIota',
        '0x0000000000000000000000000000000000000000000000000000000000000003::timelocked_staking::TimelockedStakedIota'
    ];
    // Filter transactions and their object nodes to only stake-related objects
    const filteredNodes = allNodes
        .map(tx => {
            // @ts-ignore
            const objectNodes: any[] = tx.effects?.objectChanges?.nodes || [];
            // Only keep stake-related objects with matching owner address
            // @ts-ignore
            const stakeObjects = objectNodes.filter((obj: any) => {
                const inputType = obj.inputState?.asMoveObject?.contents?.type?.repr;
                const outputType = obj.outputState?.asMoveObject?.contents?.type?.repr;
                const isStakeType = stakeTypes.includes(inputType) || stakeTypes.includes(outputType);
                if (!isStakeType) return false;
                // Extract owner addresses
                const inputOwner = obj.inputState?.asMoveObject?.owner?.owner?.address;
                const outputOwner = obj.outputState?.asMoveObject?.owner?.owner?.address;
                // Only include if owner matches provided address
                return inputOwner === address || outputOwner === address;
            });
            // If there are stake objects, return a copy of tx with filtered nodes
            if (stakeObjects.length > 0) {
                return {
                    ...tx,
                    effects: {
                        ...tx.effects,
                        objectChanges: {
                            ...tx.effects?.objectChanges,
                            nodes: stakeObjects
                        }
                    }
                };
            }
            return null;
        })
        .filter(tx => tx !== null);
    console.log(`Filtered transactions count: ${filteredNodes.length}`);
    return filteredNodes;
}

export async function fetchStakeTransactions(address: string) {
    return fetchStakeTransactionsByRole(address, 'signAddress');
}

export async function fetchReceivedStakeTransactions(address: string) {
    return fetchStakeTransactionsByRole(address, 'recvAddress');
}

export async function fetchSystemState() {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    const query = `{
        owner(address: "0x5") {
            dynamicFields {
                nodes {
                    value {
                        ... on MoveValue {
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
    // @ts-ignore
    const result = await gqlClient.query({ query });
    // @ts-ignore
    const nodes = result.data?.owner?.dynamicFields?.nodes || [];
    // Return array of { type: { repr }, json }
    return nodes.map((node: any) => node.value);
}

export async function fetchPoolExchangeRates(exchangeRatesId: string, epoch: number, poolId?: string, createOneToOneCache = false) {
    epoch += 1; // + 1 because stake data is computed at the end of an epoch and then inserted with next epoch index
    // Check cache first
    if (poolId && exchangeRateCache.has(poolId)) {
        const cached = exchangeRateCache.get(poolId)!;
        if (cached.epochData[epoch]) {
            // console.log(`Using cached exchange rates for pool ${poolId}, epoch ${epoch}`);
            // Convert from shorter format back to expected format
            const cachedData = cached.epochData[epoch];
            return {
                iota_amount: cachedData.iota,
                pool_token_amount: cachedData.pool
            };
        }
    }

    console.log(`Fetching exchange rates for poolId ${poolId}, epoch ${epoch}, exchangeRatesId ${exchangeRatesId}`);

    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    const epochBcs = toB64(bcs.u64().serialize(epoch).toBytes());
    const query = `query getDynamicFieldObject($parentId: IotaAddress!, $epochBcs: Base64!) {
      owner(address: $parentId) {
        address
        dynamicField(name: {type: \"u64\", bcs: $epochBcs}) {
          value {
            ... on MoveValue {
              json
            }
          }
        }
      }
    }`;
    const variables = { parentId: exchangeRatesId, epochBcs };
    // @ts-ignore
    const result = await gqlClient.query({ query, variables });
    // @ts-ignore
    let data = result.data?.owner?.dynamicField?.value?.json;

    // For pre-staking epochs we want to cache the 1:1 ratio if no data is found as this would otherwise send a request for each epoch in computeStakeRewards()
    if (!data && createOneToOneCache) {
        // If no data found and we want to create a 1:1 cache entry, use 1:1 ratio
        console.log(`No exchange rate data found for pool ${poolId}, epoch ${epoch}. Using 1:1 ratio.`);
        data = {
            iota_amount: '1',
            pool_token_amount: '1'
        };
    }

    // Cache the result if we have data
    if (data && poolId) {
        let cacheEntry = exchangeRateCache.get(poolId);
        if (!cacheEntry) {
            // Create new cache entry for this pool
            cacheEntry = {
                poolId,
                exchangeRateId: exchangeRatesId,
                epochData: {}
            };
            exchangeRateCache.set(poolId, cacheEntry);
        }
        // Add this epoch's data with shorter field names
        cacheEntry.epochData[epoch] = {
            iota: data.iota_amount,
            pool: data.pool_token_amount
        };
        console.log(`Cached exchange rates for pool ${poolId}, epoch ${epoch}`);
    }

    return data;
}

export type ExchangeRateCacheEntry = {
    poolId: string;
    exchangeRateId: string;
    // Map of epoch -> exchange rate data with shorter field names
    epochData: Record<number, { iota: string; pool: string }>;
};

// Cache for exchange rates: `poolId` -> ExchangeRateCacheEntry
const exchangeRateCache = new Map<string, ExchangeRateCacheEntry>();

export function setInitialExchangeRateCache(cacheData: ExchangeRateCacheEntry[]) {
    exchangeRateCache.clear();

    // Safety check for undefined or invalid data
    if (!cacheData || !Array.isArray(cacheData)) {
        console.log('No cache data provided or invalid format');
        return;
    }

    cacheData.forEach(entry => {
        // Additional safety check for each entry
        if (entry && entry.poolId && entry.epochData) {
            exchangeRateCache.set(entry.poolId, entry);
        } else {
            console.warn('Skipping invalid cache entry:', entry);
        }
    });

    // Safe calculation of total epochs with additional checks
    const totalEpochs = cacheData.reduce((sum, entry) => {
        if (entry && entry.epochData && typeof entry.epochData === 'object') {
            return sum + Object.keys(entry.epochData).length;
        }
        return sum;
    }, 0);

    console.log(`Loaded ${cacheData.length} pools with ${totalEpochs} total epoch entries into cache`);
}

export function getExchangeRateCacheStats() {
    const stats = {
        totalEntries: exchangeRateCache.size,
        poolIds: new Set<string>(),
        epochs: new Set<number>(),
        exchangeRateIds: new Set<string>()
    };

    exchangeRateCache.forEach(entry => {
        stats.poolIds.add(entry.poolId);
        stats.exchangeRateIds.add(entry.exchangeRateId);
        Object.keys(entry.epochData).forEach(epochStr => {
            stats.epochs.add(parseInt(epochStr));
        });
    });

    return {
        totalEntries: stats.totalEntries,
        uniquePoolIds: stats.poolIds.size,
        uniqueEpochs: stats.epochs.size,
        uniqueExchangeRateIds: stats.exchangeRateIds.size,
        epochRange: stats.epochs.size > 0 ? {
            min: Math.min(...stats.epochs),
            max: Math.max(...stats.epochs)
        } : null
    };
}

export { exchangeRateCache };

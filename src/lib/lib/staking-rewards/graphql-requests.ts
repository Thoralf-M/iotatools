import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
import { getSelectedNetworkConfig } from '../client';
import { bcs, toB64 } from '@iota/bcs';
import {
    decompressExchangeRateCache,
    compressExchangeRateCache,
    getCompressionStats
} from './binary-cache';

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

// Helper function to parse exchange rate data from the GraphQL response
function parseExchangeRateData(structData: any): { iota: string; pool: string } | null {
    if (!structData?.Struct) return null;

    const struct = structData.Struct;
    let iotaAmount = '';
    let poolTokenAmount = '';

    for (const field of struct) {
        if (field.name === 'iota_amount' && field.value?.Number) {
            iotaAmount = field.value.Number;
        } else if (field.name === 'pool_token_amount' && field.value?.Number) {
            poolTokenAmount = field.value.Number;
        }
    }

    if (iotaAmount && poolTokenAmount) {
        return { iota: iotaAmount, pool: poolTokenAmount };
    }

    return null;
}

// Global flag to track if we've already fetched all exchange rates
let allExchangeRatesFetched = false;

// Function to determine what epochs are missing from cache
function getMissingEpochs(currentEpoch: number): { missingEpochs: Set<number>; maxCachedEpoch: number; shouldUseDynamicFieldFetch: boolean } {
    if (exchangeRateCache.size === 0) {
        return { missingEpochs: new Set(), maxCachedEpoch: 0, shouldUseDynamicFieldFetch: false };
    }

    // Find the maximum epoch we have cached across all pools
    let maxCachedEpoch = 0;
    const allCachedEpochs = new Set<number>();

    exchangeRateCache.forEach(entry => {
        Object.keys(entry.epochData).forEach(epochStr => {
            const epoch = parseInt(epochStr);
            allCachedEpochs.add(epoch);
            if (epoch > maxCachedEpoch) {
                maxCachedEpoch = epoch;
            }
        });
    });

    // Check what epochs are missing from maxCachedEpoch to currentEpoch - 1
    // (currentEpoch doesn't have data available yet)
    const missingEpochs = new Set<number>();
    for (let epoch = maxCachedEpoch + 1; epoch <= currentEpoch; epoch++) {
        missingEpochs.add(epoch);
    }

    // If we have cached data and only missing ≤20 recent epochs, use dynamic field fetch
    const shouldUseDynamicFieldFetch = maxCachedEpoch > 0 && missingEpochs.size <= 20;

    return { missingEpochs, maxCachedEpoch, shouldUseDynamicFieldFetch };
}

// Function to fetch missing epochs using the old dynamic field approach
async function fetchMissingEpochsWithDynamicFields(missingEpochs: Set<number>, requiredPoolIds: Set<string>): Promise<void> {
    console.log(`Fetching ${missingEpochs.size} missing epochs for ${requiredPoolIds.size} required pools using dynamic field approach`);

    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    // Only fetch for the required pools
    for (const poolId of requiredPoolIds) {
        const cacheEntry = exchangeRateCache.get(poolId);
        if (!cacheEntry) {
            console.warn(`No cache entry found for required pool ${poolId}`);
            continue;
        }

        const exchangeRateId = cacheEntry.exchangeRateId;
        if (!exchangeRateId) {
            console.warn(`No exchange rate ID found for pool ${poolId}`);
            continue;
        }

        for (const epoch of missingEpochs) {
            // Skip if we already have this epoch for this pool
            if (cacheEntry.epochData[epoch]) continue;

            try {
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

                const variables = { parentId: exchangeRateId, epochBcs };
                // @ts-ignore
                const result = await gqlClient.query({ query, variables });
                // @ts-ignore
                const data = result.data?.owner?.dynamicField?.value?.json;

                if (data) {
                    cacheEntry.epochData[epoch] = {
                        iota: data.iota_amount,
                        pool: data.pool_token_amount
                    };
                    console.log(`Cached exchange rates for pool ${poolId}, epoch ${epoch}`);
                }
            } catch (err) {
                console.warn(`Failed to fetch exchange rate for pool ${poolId}, epoch ${epoch}:`, err);
            }
        }
    }
}

// Function to fetch all exchange rates for all validators and all epochs in one go
export async function fetchAllExchangeRates(currentEpoch: number, requiredPoolIds?: Set<string>): Promise<void> {
    // Check what we're missing from cache
    const { missingEpochs, maxCachedEpoch, shouldUseDynamicFieldFetch } = getMissingEpochs(currentEpoch);

    // If we already have all data up to currentEpoch (since currentEpoch data isn't available yet), skip
    if (missingEpochs.size === 0 && maxCachedEpoch >= currentEpoch) {
        console.log('All exchange rates already cached, skipping fetch');
        return;
    }

    // If we have cached data and only need a few recent epochs, use dynamic field approach
    if (shouldUseDynamicFieldFetch && requiredPoolIds) {
        console.log(`Using dynamic field approach to fetch ${missingEpochs.size} missing recent epochs for ${requiredPoolIds.size} required pools`);
        await fetchMissingEpochsWithDynamicFields(missingEpochs, requiredPoolIds);
        return;
    }

    // If we already did a full fetch in this session, don't do it again
    if (allExchangeRatesFetched) {
        console.log('Full exchange rates fetch already completed in this session, skipping');
        return;
    }

    console.log(`Fetching all exchange rates for epoch ${currentEpoch} and all historical data (cache has ${exchangeRateCache.size} pools, max epoch: ${maxCachedEpoch})`);

    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    // First, fetch all validators with pagination
    let hasNextValidatorPage = true;
    let validatorCursor = '';

    while (hasNextValidatorPage) {
        const validatorCursorSection = validatorCursor ? `(after: "${validatorCursor}")` : '';

        const query = `query getAllExchangeRates($epochId: Int!) {
            epoch(id: $epochId) {
                epochId
                validatorSet {
                    activeValidators${validatorCursorSection} {
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                        nodes {
                            name
                            address {
                                address
                            }
                            stakingPoolId
                            exchangeRatesTable {
                                address
                                dynamicFields {
                                    pageInfo {
                                        endCursor
                                        hasNextPage
                                    }
                                    nodes {
                                        name {
                                            json
                                        }
                                        value {
                                            ... on MoveValue {
                                                data
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`;

        const variables = { epochId: currentEpoch };
        // @ts-ignore
        const result = await gqlClient.query({ query, variables });
        // @ts-ignore
        const activeValidators = result.data?.epoch?.validatorSet?.activeValidators;

        if (!activeValidators?.nodes) break;

        // Process each validator
        for (const validator of activeValidators.nodes) {
            console.log(`Processing validator: ${validator.name} (${validator.address.address})`);
            console.log(`stakingPoolId: ${validator.stakingPoolId} table id (${validator.exchangeRatesTable?.address})`);

            const poolId = validator.stakingPoolId;
            if (!poolId) continue;

            // Initialize cache entry for this pool
            let cacheEntry = exchangeRateCache.get(poolId);
            if (!cacheEntry) {
                cacheEntry = {
                    poolId,
                    exchangeRateId: validator.exchangeRatesTable?.address || '',
                    epochData: {}
                };
                exchangeRateCache.set(poolId, cacheEntry);
            }

            // Fetch all exchange rates for this validator with pagination
            let hasNextExchangeRatePage = true;
            let exchangeRateCursor = '';
            const exchangeRatesTable = validator.exchangeRatesTable?.dynamicFields;

            if (exchangeRatesTable) {
                // Process initial page
                if (exchangeRatesTable.nodes) {
                    for (const node of exchangeRatesTable.nodes) {
                        const epochFromName = parseInt(node.name?.json);
                        if (!isNaN(epochFromName) && node.value?.data) {
                            const exchangeRateData = parseExchangeRateData(node.value.data);
                            if (exchangeRateData) {
                                cacheEntry.epochData[epochFromName] = exchangeRateData;
                            }
                        }
                    }
                }

                // Check if there are more exchange rate pages for this validator
                hasNextExchangeRatePage = exchangeRatesTable.pageInfo?.hasNextPage || false;
                exchangeRateCursor = exchangeRatesTable.pageInfo?.endCursor || '';

                // Fetch additional exchange rate pages for this validator
                while (hasNextExchangeRatePage) {
                    const exchangeRateQuery = `query getValidatorExchangeRates($exchangeRatesTableId: IotaAddress!, $cursor: String!) {
                        owner(address: $exchangeRatesTableId) {
                            dynamicFields(after: $cursor) {
                                pageInfo {
                                    endCursor
                                    hasNextPage
                                }
                                nodes {
                                    name {
                                        json
                                    }
                                    value {
                                        ... on MoveValue {
                                            data
                                        }
                                    }
                                }
                            }
                        }
                    }`;

                    const exchangeRateVariables = { exchangeRatesTableId: validator.exchangeRatesTable?.address, cursor: exchangeRateCursor };
                    // @ts-ignore
                    const exchangeRateResult = await gqlClient.query({ query: exchangeRateQuery, variables: exchangeRateVariables });
                    // @ts-ignore
                    const dynamicFields = exchangeRateResult.data?.owner?.dynamicFields;

                    if (!dynamicFields?.nodes) break;

                    for (const node of dynamicFields.nodes) {
                        const epochFromName = parseInt(node.name?.json);
                        if (!isNaN(epochFromName) && node.value?.data) {
                            const exchangeRateData = parseExchangeRateData(node.value.data);
                            if (exchangeRateData) {
                                cacheEntry.epochData[epochFromName] = exchangeRateData;
                            }
                        }
                    }

                    hasNextExchangeRatePage = dynamicFields.pageInfo?.hasNextPage || false;
                    exchangeRateCursor = dynamicFields.pageInfo?.endCursor || '';
                }
            }
        }

        // Check if there are more validator pages
        hasNextValidatorPage = activeValidators.pageInfo?.hasNextPage || false;
        validatorCursor = activeValidators.pageInfo?.endCursor || '';
    }

    allExchangeRatesFetched = true;

    const totalPools = exchangeRateCache.size;
    const totalEpochs = Array.from(exchangeRateCache.values()).reduce((sum, entry) =>
        sum + Object.keys(entry.epochData).length, 0
    );

    console.log(`Fetched and cached exchange rates for ${totalPools} pools with ${totalEpochs} total epoch entries`);
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

    // If not in cache and we haven't fetched all data yet, we might need to fetch it
    // But for now, if it's not in cache, we'll just return the fallback
    console.log(`Exchange rate not found in cache for pool ${poolId}, epoch ${epoch}`);

    // For pre-staking epochs we want to cache the 1:1 ratio if no data is found
    if (createOneToOneCache && poolId) {
        console.log(`No exchange rate data found for pool ${poolId}, epoch ${epoch}. Using 1:1 ratio.`);
        const data = {
            iota_amount: '1',
            pool_token_amount: '1'
        };

        // Cache the 1:1 ratio
        let cacheEntry = exchangeRateCache.get(poolId);
        if (!cacheEntry) {
            cacheEntry = {
                poolId,
                exchangeRateId: exchangeRatesId,
                epochData: {}
            };
            exchangeRateCache.set(poolId, cacheEntry);
        }
        cacheEntry.epochData[epoch] = {
            iota: data.iota_amount,
            pool: data.pool_token_amount
        };

        return data;
    }

    return null;
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
    allExchangeRatesFetched = false; // Reset the flag when loading initial cache

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

/**
 * Loads exchange rate cache from binary format (base64 string)
 */
export function setInitialExchangeRateCacheFromBinary(base64Data: string) {
    try {
        const cacheData = decompressExchangeRateCache(base64Data);
        setInitialExchangeRateCache(cacheData);
        console.log('Successfully loaded exchange rate cache from binary format');
    } catch (error) {
        console.error('Failed to load binary cache data:', error);
        throw error;
    }
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

// Function to reset the exchange rate cache and force a fresh fetch
export function resetExchangeRateCache() {
    exchangeRateCache.clear();
    allExchangeRatesFetched = false;
    console.log('Exchange rate cache reset');
}

/**
 * Exports the current exchange rate cache to binary format (base64 string)
 */
export function exportExchangeRateCacheToBinary(): string {
    const cacheArray = Array.from(exchangeRateCache.values());
    return compressExchangeRateCache(cacheArray);
}

/**
 * Gets compression statistics for the current cache
 */
export function getExchangeRateCacheCompressionStats() {
    const cacheArray = Array.from(exchangeRateCache.values());
    return getCompressionStats(cacheArray);
}

/**
 * Exports current cache as JSON (for comparison/backup)
 */
export function exportExchangeRateCacheAsJson(): ExchangeRateCacheEntry[] {
    return Array.from(exchangeRateCache.values());
}

/**
 * Fetches the start timestamp for a given epoch.
 * Returns the UNIX timestamp (seconds) or null if not found.
 */
export async function fetchEpochStartTimestamp(epochId: number): Promise<number | null> {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    const query = `query ($epochId: Int!) { epoch(id: $epochId) { startTimestamp } }`;
    const variables = { epochId };
    // @ts-ignore
    const result = await gqlClient.query({ query, variables });
    // @ts-ignore
    const startTimestamp = result.data?.epoch?.startTimestamp;
    if (typeof startTimestamp === 'string') {
        // Parse ISO string to Date and return seconds since epoch
        return Math.floor(new Date(startTimestamp).getTime() / 1000);
    }
    return null;
}

export { exchangeRateCache };

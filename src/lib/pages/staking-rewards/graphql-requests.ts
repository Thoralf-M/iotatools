import { bcs, toBase64 } from '@iota/bcs';
import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

import { getClient, getSelectedNetworkConfig } from '../../utils/client';
import {
    compressExchangeRateCache,
    decompressExchangeRateCache,
    getCompressionStats,
} from './cache/binary-cache';
import { getInactiveValidatorsWithDeactivationEpoch } from './compute/validator-utils';
import { formatDate } from './formatting';
import { queryWithRetry } from './graphql-retry';

/**
 * Per-request scan window for the address-filtered transactionBlocks query.
 *
 * The `sentAddress`/`recvAddress` filters are scan-based, not index-backed: the
 * server walks a bounded window of transactions per request. Without an explicit
 * `scanLimit`, a window that contains no match returns `endCursor: null` while
 * `hasNextPage` stays true, which stalls cursor-based pagination after the first
 * window. Passing an explicit `scanLimit` makes the server return the
 * scan-boundary cursor for empty windows, so pagination can continue scanning.
 *
 * 20000 is the server's hard maximum (higher values are rejected with
 * "Scan limit exceeds max limit of '20000'").
 */
const SCAN_LIMIT = 20000;

/**
 * Returns the first checkpoint sequence number of the given epoch, or null if
 * the epoch is unknown. Used to translate a startEpoch into an afterCheckpoint
 * filter so the transactionBlocks query can be bounded server-side.
 */
async function fetchFirstCheckpointForEpoch(epochId: number): Promise<number | null> {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    const query = `query ($epochId: UInt53!) {
        epoch(id: $epochId) {
            checkpoints(first: 1) {
                nodes {
                    sequenceNumber
                }
            }
        }
    }`;
    const result = await queryWithRetry(gqlClient, { query, variables: { epochId } });
    // @ts-ignore
    const seq = result.data?.epoch?.checkpoints?.nodes?.[0]?.sequenceNumber;
    if (seq === undefined || seq === null) return null;
    const n = typeof seq === 'number' ? seq : parseInt(seq);
    return Number.isFinite(n) ? n : null;
}

export type FetchStakeTxsOptions = {
    /**
     * If set, restricts the GraphQL transactionBlocks query to checkpoints at or
     * after this epoch's first checkpoint via `afterCheckpoint`. This bounds the
     * fetch server-side — important for received transactions, which can be
     * many thousands without a filter.
     */
    startEpoch?: number;
    /**
     * Called once per fetched page so the UI can show "still working" progress
     * during long paginated fetches.
     */
    onProgress?: (info: { pages: number; transactions: number }) => void;
    /**
     * Senders whose transactions should have their objectChanges pagination
     * skipped — used for known-noisy senders that post huge txs that never
     * carry stake objects. The first page of objectChanges is still inspected;
     * only the recursive drill-down is suppressed.
     */
    skipPaginationSenders?: Set<string>;
    /**
     * Called every time pagination is skipped for a transaction because its
     * sender was in `skipPaginationSenders`. Lets the UI tally per-sender
     * skip counts and surface them after the fetch.
     */
    onSkipPagination?: (senderAddress: string) => void;
};

/**
 * Shape a past StakedIota / TimelockedStakedIota's JSON-RPC fields into the same
 * structure `extractStakeObjectData` reads from a GraphQL `inputState.json`, so a
 * recovered object is processed exactly like a normally-fetched one.
 */
function shapeRecoveredStakeJson(type: string, fields: any): any | null {
    if (!fields) return null;
    const normalizePrincipal = (p: any) =>
        p && typeof p === 'object' ? (p.value ?? p.fields?.value) : p;
    if (type.includes('staking_pool::StakedIota')) {
        return {
            pool_id: fields.pool_id,
            principal: { value: normalizePrincipal(fields.principal) },
            stake_activation_epoch: fields.stake_activation_epoch,
        };
    }
    if (type.includes('timelocked_staking::TimelockedStakedIota')) {
        // Nested struct may arrive as { fields: {...} } or flattened.
        const si = fields.staked_iota?.fields ?? fields.staked_iota;
        if (!si) return null;
        return {
            staked_iota: {
                pool_id: si.pool_id,
                principal: { value: normalizePrincipal(si.principal) },
                stake_activation_epoch: si.stake_activation_epoch,
            },
        };
    }
    return null;
}

/**
 * Backfill `inputState` for unstaked stake objects whose historical version was
 * pruned from GraphQL. Only runs for transactions that call
 * `iota_system::request_withdraw_stake*`, and only for deleted objects with a
 * known input version — keeping the extra JSON-RPC calls bounded to real unstakes.
 */
async function recoverPrunedStakeInputStates(transactions: any[]): Promise<void> {
    type Recovery = { node: any; address: string; version: number };
    const recoveries: Recovery[] = [];

    for (const tx of transactions) {
        const kind = tx?.kind;
        if (kind?.__typename !== 'ProgrammableTransactionBlock') continue;

        const calls = kind.transactions?.nodes ?? [];
        const hasWithdraw = calls.some(
            (c: any) =>
                c?.__typename === 'MoveCallTransaction' &&
                c.module === 'iota_system' &&
                typeof c.functionName === 'string' &&
                c.functionName.startsWith('request_withdraw_stake'),
        );
        if (!hasWithdraw) continue;

        const inputVersions = new Map<string, number>();
        for (const input of kind.inputs?.nodes ?? []) {
            if (
                input?.__typename === 'OwnedOrImmutable' &&
                input.address &&
                input.version != null
            ) {
                inputVersions.set(input.address, Number(input.version));
            }
        }
        if (inputVersions.size === 0) continue;

        for (const node of tx.effects?.objectChanges?.nodes ?? []) {
            const alreadyHasInput = !!node?.inputState?.asMoveObject?.contents;
            if (node?.idDeleted !== true || alreadyHasInput) continue;
            const version = inputVersions.get(node.address);
            if (version == null) continue;
            recoveries.push({ node, address: node.address, version });
        }
    }

    if (recoveries.length === 0) return;

    const client = getClient();
    await Promise.all(
        recoveries.map(async ({ node, address, version }) => {
            try {
                const res = await client.tryGetPastObject({
                    id: address,
                    version,
                    options: { showContent: true, showType: true, showOwner: true },
                });
                if (res.status !== 'VersionFound') return;
                const data: any = res.details;
                const type: string = data?.type ?? data?.content?.type ?? '';
                const json = shapeRecoveredStakeJson(type, data?.content?.fields);
                if (!json) return;
                const ownerAddress =
                    data?.owner && typeof data.owner === 'object'
                        ? data.owner.AddressOwner
                        : undefined;
                // Mirror the GraphQL inputState.asMoveObject shape the processor reads.
                node.inputState = {
                    asMoveObject: {
                        owner: ownerAddress ? { owner: { address: ownerAddress } } : null,
                        contents: { type: { repr: type }, json },
                    },
                };
            } catch (err) {
                console.warn(`Failed to recover pruned input state for ${address}@${version}`, err);
            }
        }),
    );
}

async function fetchStakeTransactionsByRole(
    address: string,
    role: 'sentAddress' | 'recvAddress',
    options: FetchStakeTxsOptions = {},
    batchSize = 1,
) {
    const { startEpoch, onProgress, skipPaginationSenders, onSkipPagination } = options;

    // Translate startEpoch into an `afterCheckpoint` filter so the GraphQL
    // server skips checkpoints before the timeframe entirely. `afterCheckpoint`
    // is exclusive, so use firstCheckpoint - 1 to keep the first checkpoint of
    // startEpoch inclusive. If startEpoch is 0 (or the lookup fails), skip the
    // filter and fetch everything.
    let afterCheckpointFilter = '';
    if (startEpoch !== undefined && startEpoch > 0) {
        try {
            const firstCheckpoint = await fetchFirstCheckpointForEpoch(startEpoch);
            if (firstCheckpoint !== null && firstCheckpoint > 0) {
                afterCheckpointFilter = `\n                        afterCheckpoint: ${firstCheckpoint - 1}`;
            }
        } catch (err) {
            console.warn(
                `Failed to resolve afterCheckpoint for epoch ${startEpoch}; fetching unbounded`,
                err,
            );
        }
    }
    // Reusable objectChanges GraphQL section
    const objectChangesSection = `
        pageInfo {
            hasNextPage
            endCursor
        }
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
    `;
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    let allNodes = [];
    let cursorSection = '';
    // Paginate newest-first (`last`/`before`): the address's stake transactions
    // live near the chain tip, so scanning backward from the tip reaches them in
    // a bounded number of windows. Scanning forward (`first`) would start at
    // genesis (tx #0) and never reach recent activity within a usable request
    // budget. See SCAN_LIMIT for how empty windows are traversed.
    let hasPreviousPage = true;
    let startCursor = '';
    let pageCount = 0;
    while (hasPreviousPage) {
        console.log(
            `Fetching transactions for address: ${address}, role: ${role}, cursor: ${startCursor}`,
        );

        const query = `
            query ($address: IotaAddress) {
                transactionBlocks(
                    filter: {
                        ${role}: $address${afterCheckpointFilter}
                    }
                    last: ${batchSize}${cursorSection}, scanLimit: ${SCAN_LIMIT}
                ) {
                    pageInfo {
                        hasPreviousPage
                        startCursor
                    }
                    nodes {
                        digest
                        sender {
                            address
                        }
                        kind {
                            __typename
                            ... on ProgrammableTransactionBlock {
                                transactions {
                                    nodes {
                                        __typename
                                        ... on MoveCallTransaction {
                                            module
                                            functionName
                                        }
                                    }
                                }
                                inputs {
                                    nodes {
                                        __typename
                                        ... on OwnedOrImmutable {
                                            address
                                            version
                                        }
                                    }
                                }
                            }
                        }
                        effects {
                            timestamp
                            epoch {
                                epochId
                            }
                            objectChanges {
${objectChangesSection}
                            }
                        }
                    }
                }
            }
        `;

        const variables = { address };
        const result = await queryWithRetry(gqlClient, { query, variables });
        if (result.errors) {
            throw new Error(`GraphQL query error: ${JSON.stringify(result.errors)}`);
        }
        const txBlocks = result.data?.transactionBlocks;
        if (
            txBlocks &&
            typeof txBlocks === 'object' &&
            'nodes' in txBlocks &&
            Array.isArray((txBlocks as any).nodes)
        ) {
            // For each transaction, handle objectChanges pagination
            for (const tx of (txBlocks as any).nodes as any[]) {
                const effects = tx.effects;
                if (!effects?.objectChanges) {
                    allNodes.push(tx);
                    continue;
                }
                let objectNodes = Array.isArray(effects.objectChanges.nodes)
                    ? [...effects.objectChanges.nodes]
                    : [];
                let objectHasNextPage = effects.objectChanges.pageInfo?.hasNextPage;
                let objectEndCursor = effects.objectChanges.pageInfo?.endCursor;
                // Skip objectChanges pagination entirely for caller-configured
                // noisy senders whose transactions never carry stake objects but
                // have huge objectChanges sets (paginating through them is the
                // main cost when fetching received txs for an active address).
                const senderAddr = tx.sender?.address;
                if (senderAddr && skipPaginationSenders && skipPaginationSenders.has(senderAddr)) {
                    objectHasNextPage = false;
                    objectEndCursor = undefined;
                    onSkipPagination?.(senderAddr);
                }
                // Paginate objectChanges if needed
                while (objectHasNextPage && objectEndCursor) {
                    const objectChangesQuery = `
                        query ($txDigest: String!, $objectChangesCursor: String) {
                            transactionBlock(digest: $txDigest) {
                                effects {
                                    objectChanges(after: $objectChangesCursor) {
${objectChangesSection}
                                    }
                                }
                            }
                        }
                    `;
                    const objectVariables = {
                        txDigest: tx.digest,
                        objectChangesCursor: objectEndCursor,
                    };
                    const objectResult = await queryWithRetry(gqlClient, {
                        query: objectChangesQuery,
                        variables: objectVariables,
                    });
                    if (objectResult.errors) {
                        throw new Error(`GraphQL query error: ${JSON.stringify(result.errors)}`);
                    }
                    const transactionBlock = objectResult.data?.transactionBlock;
                    let nextObjectChanges = undefined;
                    if (
                        transactionBlock &&
                        typeof transactionBlock === 'object' &&
                        'effects' in transactionBlock &&
                        (transactionBlock as any).effects?.objectChanges
                    ) {
                        nextObjectChanges = (transactionBlock as any).effects.objectChanges;
                    }
                    if (nextObjectChanges && Array.isArray(nextObjectChanges.nodes)) {
                        objectNodes.push(...nextObjectChanges.nodes);
                        objectHasNextPage = nextObjectChanges.pageInfo?.hasNextPage;
                        objectEndCursor = nextObjectChanges.pageInfo?.endCursor;
                    } else {
                        objectHasNextPage = false;
                        objectEndCursor = undefined;
                    }
                }
                // Replace objectChanges.nodes with the full list
                tx.effects.objectChanges.nodes = objectNodes;
                allNodes.push(tx);
            }
        }
        hasPreviousPage =
            txBlocks &&
            typeof txBlocks === 'object' &&
            'pageInfo' in txBlocks &&
            (txBlocks as any).pageInfo?.hasPreviousPage
                ? (txBlocks as any).pageInfo.hasPreviousPage
                : false;
        startCursor =
            txBlocks &&
            typeof txBlocks === 'object' &&
            'pageInfo' in txBlocks &&
            (txBlocks as any).pageInfo?.startCursor
                ? (txBlocks as any).pageInfo.startCursor
                : undefined;
        pageCount++;
        onProgress?.({ pages: pageCount, transactions: allNodes.length });
        if (hasPreviousPage && startCursor) {
            cursorSection = `,before: "${startCursor}"`;
        } else {
            break;
        }
    }
    // Recover input states that GraphQL pruned (a StakedIota created long ago and
    // never modified has its input version pruned from the indexer, so the unstake
    // would otherwise be invisible). The full-node JSON-RPC still retains the past
    // object, so we backfill the missing inputState before the stake-type filter.
    await recoverPrunedStakeInputStates(allNodes);

    const stakeTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000003::staking_pool::StakedIota',
        '0x0000000000000000000000000000000000000000000000000000000000000003::timelocked_staking::TimelockedStakedIota',
    ];
    // Filter transactions to only those that contain stake objects for the given address
    // but keep ALL objects in those transactions for proper analysis
    console.log(`Total transactions fetched: ${allNodes.length}`);
    const filteredNodes = allNodes
        .map((tx) => {
            // @ts-ignore
            const objectNodes: any[] = tx.effects?.objectChanges?.nodes || [];
            // Check if this transaction has any stake-related objects with matching owner address
            // @ts-ignore
            const hasRelevantStakeObjects = objectNodes.some((obj: any) => {
                const inputType = obj.inputState?.asMoveObject?.contents?.type?.repr;
                const outputType = obj.outputState?.asMoveObject?.contents?.type?.repr;
                const isStakeType =
                    stakeTypes.includes(inputType) || stakeTypes.includes(outputType);
                if (!isStakeType) return false;
                // Extract owner addresses
                const inputOwner = obj.inputState?.asMoveObject?.owner?.owner?.address;
                const outputOwner = obj.outputState?.asMoveObject?.owner?.owner?.address;
                // Only include if owner matches provided address
                return inputOwner === address || outputOwner === address;
            });
            // If there are relevant stake objects, return the entire transaction with ALL objects
            if (hasRelevantStakeObjects) {
                return tx; // Return the original transaction with all objects intact
            }
            return null;
        })
        .filter((tx) => tx !== null);
    console.log(`Filtered transactions count: ${filteredNodes.length}`);
    return filteredNodes;
}

export async function fetchStakeTransactions(address: string, options?: FetchStakeTxsOptions) {
    return fetchStakeTransactionsByRole(address, 'sentAddress', options);
}

export async function fetchReceivedStakeTransactions(
    address: string,
    options?: FetchStakeTxsOptions,
) {
    return fetchStakeTransactionsByRole(address, 'recvAddress', options);
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
/**
 * Returns a map of poolId -> Set of missing epochs for each pool.
 * Also returns maxCachedEpoch (across all pools) and shouldUseDynamicFieldFetch flag.
 */
function getMissingEpochs(
    currentEpoch: number,
    requiredPoolIds?: Set<string>,
): {
    missingEpochsPerPool: Map<string, Set<number>>;
    maxCachedEpoch: number;
    shouldUseDynamicFieldFetch: boolean;
} {
    const missingEpochsPerPool = new Map<string, Set<number>>();
    let maxCachedEpoch = 0;
    let totalMissingEpochs = 0;

    // Only check required pools if provided, else all in cache
    const poolIds = requiredPoolIds
        ? Array.from(requiredPoolIds)
        : Array.from(exchangeRateCache.keys());

    for (const poolId of poolIds) {
        let entry = exchangeRateCache.get(poolId);
        // If not in cache, treat all epochs as missing
        let cachedEpochs: Set<number>;
        let poolDeactivationEpoch: number | undefined;
        if (!entry) {
            cachedEpochs = new Set();
        } else {
            cachedEpochs = new Set<number>(Object.keys(entry.epochData).map(Number));
            poolDeactivationEpoch = entry.deactivationEpoch;
            if (cachedEpochs.size > 0) {
                const maxEpoch = Math.max(...cachedEpochs);
                if (maxEpoch > maxCachedEpoch) maxCachedEpoch = maxEpoch;
            }
        }
        // Find missing epochs for this pool, but only from the minimum known epoch onwards
        // This avoids requesting data for epochs before the pool existed
        const missing = new Set<number>();
        let startEpoch = 0;

        // If we have cached epochs, start from the minimum known epoch
        if (cachedEpochs.size > 0) {
            startEpoch = Math.min(...cachedEpochs);
        }

        // Determine the max epoch to check for this pool
        // If the pool is deactivated, don't look for epochs after deactivation
        const maxEpochToCheck =
            poolDeactivationEpoch !== undefined
                ? Math.min(poolDeactivationEpoch, currentEpoch)
                : currentEpoch;

        for (let epoch = startEpoch; epoch < maxEpochToCheck + 1; epoch++) {
            if (!cachedEpochs.has(epoch)) {
                missing.add(epoch);
                totalMissingEpochs++;
            }
        }
        if (missing.size > 0) {
            missingEpochsPerPool.set(poolId, missing);
        }
    }

    // If only missing a reasonable number of epochs, use dynamic field fetch
    // This is more efficient than fetching all validators' entire exchange rate history
    // Threshold: up to 100 individual epoch fetches is still faster than full fetch
    const shouldUseDynamicFieldFetch = maxCachedEpoch > 0 && totalMissingEpochs <= 100;

    return { missingEpochsPerPool, maxCachedEpoch, shouldUseDynamicFieldFetch };
}

// Function to fetch missing epochs using the old dynamic field approach
/**
 * Fetches missing epochs for each pool using dynamic fields, only for epochs not present in cache.
 * @param missingEpochsPerPool Map of poolId -> Set of missing epochs
 */
async function fetchMissingEpochsWithDynamicFields(
    missingEpochsPerPool: Map<string, Set<number>>,
): Promise<void> {
    let totalFetches = 0;
    for (const [poolId, missingEpochs] of missingEpochsPerPool.entries()) {
        let cacheEntry = exchangeRateCache.get(poolId);
        // If not in cache, create a new entry with empty epochData
        if (!cacheEntry) {
            cacheEntry = {
                poolId,
                exchangeRateId: poolId, // fallback, should be set properly by caller if possible
                epochData: {},
            };
            exchangeRateCache.set(poolId, cacheEntry);
        }
        const exchangeRateId = cacheEntry.exchangeRateId;
        if (!exchangeRateId) {
            console.warn(`No exchange rate ID found for pool ${poolId}`);
            continue;
        }
        for (const epoch of missingEpochs) {
            // Always check cache before fetching
            if (cacheEntry.epochData[epoch]) continue;
            try {
                const epochBcs = toBase64(bcs.u64().serialize(epoch).toBytes());
                const query = `query getDynamicFieldObject($parentId: IotaAddress!, $epochBcs: Base64!) {
                                        owner(address: $parentId) {
                                            address
                                            dynamicField(name: {type: "u64", bcs: $epochBcs}) {
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
                const result = await new IotaGraphQLClient({
                    url: getSelectedNetworkConfig().graphql,
                }).query({ query, variables });
                // @ts-ignore
                const data = result.data?.owner?.dynamicField?.value?.json;
                if (data) {
                    cacheEntry.epochData[epoch] = {
                        iota: data.iota_amount,
                        pool: data.pool_token_amount,
                    };
                    totalFetches++;
                    console.log(`Cached exchange rates for pool ${poolId}, epoch ${epoch}`);
                }
            } catch (err) {
                console.warn(
                    `Failed to fetch exchange rate for pool ${poolId}, epoch ${epoch}:`,
                    err,
                );
            }
        }
    }
    console.log(`Fetched ${totalFetches} missing epochs using dynamic field approach.`);
}

// Function to fetch all exchange rates for all validators and all epochs in one go
export async function fetchAllExchangeRates(
    currentEpoch: number,
    requiredPoolIds?: Set<string>,
): Promise<void> {
    // First, check if any required pools might be inactive and need deactivationEpoch set
    // This is important to avoid fetching epochs that don't exist for deactivated pools
    if (requiredPoolIds && requiredPoolIds.size > 0) {
        // Check if any required pools are missing deactivationEpoch info
        const poolsMissingDeactivationInfo = Array.from(requiredPoolIds).filter((poolId) => {
            const entry = exchangeRateCache.get(poolId);
            // If entry doesn't exist or has no deactivationEpoch, we need to check
            return !entry || entry.deactivationEpoch === undefined;
        });

        if (poolsMissingDeactivationInfo.length > 0) {
            console.log(
                `Checking inactive validators for ${poolsMissingDeactivationInfo.length} pools without deactivation info...`,
            );
            try {
                const systemState = (await fetchSystemState())[0];
                const inactiveValidators =
                    await getInactiveValidatorsWithDeactivationEpoch(systemState);

                for (const poolId of poolsMissingDeactivationInfo) {
                    const inactiveInfo = inactiveValidators[poolId];
                    if (inactiveInfo) {
                        let cacheEntry = exchangeRateCache.get(poolId);
                        if (!cacheEntry) {
                            cacheEntry = {
                                poolId,
                                exchangeRateId: inactiveInfo.exchangeRateId,
                                epochData: {},
                                deactivationEpoch: inactiveInfo.deactivationEpoch,
                            };
                            exchangeRateCache.set(poolId, cacheEntry);
                        } else {
                            cacheEntry.deactivationEpoch = inactiveInfo.deactivationEpoch;
                            // Also update exchangeRateId if it was empty
                            if (!cacheEntry.exchangeRateId) {
                                cacheEntry.exchangeRateId = inactiveInfo.exchangeRateId;
                            }
                        }
                        console.log(
                            `Set deactivation epoch ${inactiveInfo.deactivationEpoch} for inactive pool ${poolId}`,
                        );
                    }
                }
            } catch (error) {
                console.warn('Failed to fetch inactive validators:', error);
            }
        }
    }

    // Check what we're missing from cache (per pool)
    const { missingEpochsPerPool, maxCachedEpoch, shouldUseDynamicFieldFetch } = getMissingEpochs(
        currentEpoch,
        requiredPoolIds,
    );

    // If we already have all data up to currentEpoch for all pools, skip
    if (missingEpochsPerPool.size === 0 && maxCachedEpoch >= currentEpoch) {
        console.log('All exchange rates already cached for all pools, skipping fetch');
        return;
    }

    // If we have cached data and only need a few recent epochs, use dynamic field approach
    if (shouldUseDynamicFieldFetch && requiredPoolIds) {
        console.log(
            `Using dynamic field approach to fetch missing recent epochs for required pools`,
        );
        await fetchMissingEpochsWithDynamicFields(missingEpochsPerPool);
        return;
    }
    console.log('missingEpochsPerPool', missingEpochsPerPool);

    // If we already did a full fetch in this session, don't do it again
    if (allExchangeRatesFetched) {
        console.log('Full exchange rates fetch already completed in this session, skipping');
        return;
    }

    console.log(
        `Fetching all exchange rates for epoch ${currentEpoch} and all historical data (cache has ${exchangeRateCache.size} pools, max epoch: ${maxCachedEpoch})`,
    );

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
            console.log(
                `stakingPoolId: ${validator.stakingPoolId} table id (${validator.exchangeRatesTable?.address})`,
            );

            const poolId = validator.stakingPoolId;
            if (!poolId) continue;

            // Initialize cache entry for this pool
            let cacheEntry = exchangeRateCache.get(poolId);
            if (!cacheEntry) {
                cacheEntry = {
                    poolId,
                    exchangeRateId: validator.exchangeRatesTable?.address || '',
                    epochData: {},
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

                    const exchangeRateVariables = {
                        exchangeRatesTableId: validator.exchangeRatesTable?.address,
                        cursor: exchangeRateCursor,
                    };
                    // @ts-ignore
                    const exchangeRateResult = await gqlClient.query({
                        query: exchangeRateQuery,
                        variables: exchangeRateVariables,
                    });
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
    const totalEpochs = Array.from(exchangeRateCache.values()).reduce(
        (sum, entry) => sum + Object.keys(entry.epochData).length,
        0,
    );

    console.log(
        `Fetched and cached exchange rates for ${totalPools} pools with ${totalEpochs} total epoch entries`,
    );

    // After full fetch, check if there are still missing epochs for required pools
    // This can happen if some pools weren't in the activeValidators response
    if (requiredPoolIds && requiredPoolIds.size > 0) {
        const { missingEpochsPerPool: stillMissing } = getMissingEpochs(
            currentEpoch,
            requiredPoolIds,
        );
        if (stillMissing.size > 0) {
            console.log(
                `After full fetch, still missing epochs for ${stillMissing.size} required pools. Fetching via dynamic fields...`,
            );
            await fetchMissingEpochsWithDynamicFields(stillMissing);
        }
    }
}

export async function fetchPoolExchangeRates(
    exchangeRatesId: string,
    epoch: number,
    poolId?: string,
    createOneToOneCache = false,
) {
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
                pool_token_amount: cachedData.pool,
            };
        }
    }

    // If not in cache and we haven't fetched all data yet, we might need to fetch it
    // But for now, if it's not in cache, we'll just return the fallback
    console.log(`Exchange rate not found in cache for pool ${poolId}, epoch ${epoch}`);

    // For pre-staking epochs we want to cache the 1:1 ratio if no data is found
    if (createOneToOneCache && poolId) {
        console.log(
            `No exchange rate data found for pool ${poolId}, epoch ${epoch}. Using 1:1 ratio.`,
        );
        const data = {
            iota_amount: '1',
            pool_token_amount: '1',
        };

        // Cache the 1:1 ratio
        let cacheEntry = exchangeRateCache.get(poolId);
        if (!cacheEntry) {
            cacheEntry = {
                poolId,
                exchangeRateId: exchangeRatesId,
                epochData: {},
            };
            exchangeRateCache.set(poolId, cacheEntry);
        }
        cacheEntry.epochData[epoch] = {
            iota: data.iota_amount,
            pool: data.pool_token_amount,
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
    // Optional deactivation epoch - if set, no exchange rate data exists after this epoch
    deactivationEpoch?: number;
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

    cacheData.forEach((entry) => {
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

    console.log(
        `Loaded ${cacheData.length} pools with ${totalEpochs} total epoch entries into cache`,
    );
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
        exchangeRateIds: new Set<string>(),
    };

    exchangeRateCache.forEach((entry) => {
        stats.poolIds.add(entry.poolId);
        stats.exchangeRateIds.add(entry.exchangeRateId);
        Object.keys(entry.epochData).forEach((epochStr) => {
            stats.epochs.add(parseInt(epochStr));
        });
    });

    return {
        totalEntries: stats.totalEntries,
        uniquePoolIds: stats.poolIds.size,
        uniqueEpochs: stats.epochs.size,
        uniqueExchangeRateIds: stats.exchangeRateIds.size,
        epochRange:
            stats.epochs.size > 0
                ? {
                      min: Math.min(...stats.epochs),
                      max: Math.max(...stats.epochs),
                  }
                : null,
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

/**
 * Fetches the end timestamp for a given epoch.
 * Returns the UNIX timestamp (seconds) or null if not found.
 */
export async function fetchEpochEndTimestamp(epochId: number): Promise<number | null> {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    const query = `query ($epochId: Int!) { epoch(id: $epochId) { endTimestamp } }`;
    const variables = { epochId };
    // @ts-ignore
    const result = await gqlClient.query({ query, variables });
    // @ts-ignore
    const endTimestamp = result.data?.epoch?.endTimestamp;
    if (typeof endTimestamp === 'string') {
        // Parse ISO string to Date and return seconds since epoch
        return Math.floor(new Date(endTimestamp).getTime() / 1000);
    }
    return null;
}

/**
 * Update timestamps cache with all historical epoch timestamps
 */
export async function updateTimestampsCache(
    existingCache?: Record<string, number>,
): Promise<Record<string, number>> {
    console.log('Fetching all epoch timestamps...');

    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    // Get current epoch
    const epochQuery = `query { epoch { epochId } }`;
    // @ts-ignore
    const epochResult = await gqlClient.query({ query: epochQuery });
    // @ts-ignore
    const currentEpoch = epochResult.data?.epoch?.epochId || 1;

    console.log(`Current epoch: ${currentEpoch}`);

    // Start with existing cache or empty object
    const timestamps: Record<string, number> = { ...existingCache };

    // Find missing epochs
    const existingEpochs = Object.keys(timestamps).map((e) => parseInt(e));
    const missingEpochs = [];
    for (let epoch = 1; epoch <= currentEpoch; epoch++) {
        if (!existingEpochs.includes(epoch)) {
            missingEpochs.push(epoch);
        }
    }

    if (missingEpochs.length === 0) {
        console.log('All epochs already cached, no new data to fetch');
        return timestamps;
    }

    console.log(`Fetching timestamps for ${missingEpochs.length} missing epochs...`);

    // Fetch timestamps for missing epochs
    for (const epoch of missingEpochs) {
        try {
            const timestamp = await fetchEpochEndTimestamp(epoch);
            if (timestamp) {
                timestamps[epoch.toString()] = timestamp;
            }
        } catch (e) {
            console.warn(`Failed to fetch timestamp for epoch ${epoch}:`, e);
        }
    }

    console.log(
        `Timestamps cache updated with ${missingEpochs.length} new epochs (total: ${Object.keys(timestamps).length})`,
    );
    return timestamps;
}

/**
 * Fetch timestamps for specific epochs and return formatted dates
 * Reusable function for components that need epoch timestamps
 */
export async function fetchEpochTimestampsForDisplay(
    epochs: number[],
    currentEpoch: number,
    epochTimestampsCache?: Record<number, number>,
): Promise<{
    epochEndDates: string[];
    fetchedEpochTimestamps: Record<number, number>;
}> {
    const promises: Promise<number | null>[] = [];
    const fetchedEpochTimestamps: Record<number, number> = {};

    // Determine if mainnet is selected
    let isMainnet = false;
    try {
        isMainnet = getSelectedNetworkConfig().name?.toLowerCase().includes('mainnet');
    } catch {}

    for (let i = 0; i < epochs.length; i++) {
        const epochNum = epochs[i];
        // Use cache if mainnet and available
        if (isMainnet && epochTimestampsCache && epochTimestampsCache[epochNum]) {
            promises.push(Promise.resolve(epochTimestampsCache[epochNum]));
        } else {
            if (epochNum == currentEpoch) {
                promises.push(fetchEpochStartTimestamp(epochNum));
            } else {
                promises.push(fetchEpochEndTimestamp(epochNum));
            }
        }
    }

    const timestamps = await Promise.all(promises);

    const epochEndDates = timestamps.map((ts, i) => {
        if (!ts) return '';
        // For current epoch, add 24 hours to start timestamp
        if (epochs[i] === currentEpoch) {
            return formatDate(new Date((ts + 24 * 60 * 60) * 1000));
        }
        return formatDate(new Date(ts * 1000));
    });

    // Build checkpoint object for cache
    for (let i = 0; i < epochs.length; i++) {
        if (timestamps[i]) {
            fetchedEpochTimestamps[epochs[i]] = timestamps[i] as number;
        }
    }

    return { epochEndDates, fetchedEpochTimestamps };
}

export { exchangeRateCache };

/**
 * Info about a currently staked object fetched directly from the chain.
 * Used to discover stake objects whose creation transaction predates the fetch range.
 */
export type CurrentStakeInfo = {
    objectId: string;
    poolId: string;
    principal: string;
    stakeActivationEpoch: number;
};

/**
 * Fetch currently staked objects for the given addresses using the JSON-RPC API.
 *
 * This supplements transaction-based discovery: when a time frame filter restricts
 * which transactions are processed, objects created before the filter range would
 * be invisible from transactions alone. Querying current objects catches them.
 *
 * Note: objects that were both created AND unstaked before the fetch range are
 * not found by either method, but they also have no rewards within the range.
 */
export async function fetchCurrentStakedObjects(addresses: string[]): Promise<CurrentStakeInfo[]> {
    const client = getClient();

    const perAddress = await Promise.all(
        addresses.map(async (address) => {
            const results: CurrentStakeInfo[] = [];

            const [stakesRes, timelockedRes] = await Promise.allSettled([
                client.getStakes({ owner: address }),
                client.getTimelockedStakes({ owner: address }),
            ]);

            if (stakesRes.status === 'fulfilled') {
                for (const delegated of stakesRes.value) {
                    for (const stake of delegated.stakes) {
                        if (stake.status === 'Unstaked') continue;
                        results.push({
                            objectId: stake.stakedIotaId,
                            poolId: delegated.stakingPool,
                            principal: stake.principal,
                            stakeActivationEpoch: parseInt(stake.stakeActiveEpoch),
                        });
                    }
                }
            } else {
                console.warn(`Failed to fetch stakes for ${address}:`, stakesRes.reason);
            }

            if (timelockedRes.status === 'fulfilled') {
                for (const delegated of timelockedRes.value) {
                    for (const stake of delegated.stakes) {
                        if (stake.status === 'Unstaked') continue;
                        results.push({
                            objectId: stake.timelockedStakedIotaId,
                            poolId: delegated.stakingPool,
                            principal: stake.principal,
                            stakeActivationEpoch: parseInt(stake.stakeActiveEpoch),
                        });
                    }
                }
            } else {
                console.warn(
                    `Failed to fetch timelocked stakes for ${address}:`,
                    timelockedRes.reason,
                );
            }

            return results;
        }),
    );

    return perAddress.flat();
}

/**
 * Update exchange rates cache with all historical data for all validators
 * This fetches complete data (not just missing entries) for cache initialization
 */
export async function updateExchangeRatesCache(): Promise<void> {
    console.log('Fetching all exchange rates for all validators and epochs...');

    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    // Get current epoch
    const epochQuery = `query { epoch { epochId } }`;
    // @ts-ignore
    const epochResult = await gqlClient.query({ query: epochQuery });
    // @ts-ignore
    const currentEpoch = epochResult.data?.epoch?.epochId;

    if (!currentEpoch) {
        throw new Error('Could not fetch current epoch');
    }

    console.log(`Current epoch: ${currentEpoch}`);

    // Fetch all validators with pagination
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

        console.log(`Processing ${activeValidators.nodes.length} validators...`);

        // Process each validator
        for (const validator of activeValidators.nodes) {
            const poolId = validator.stakingPoolId;
            if (!poolId) continue;

            console.log(`Processing validator: ${validator.name} (${validator.address.address})`);

            // Initialize cache entry for this pool
            let cacheEntry = exchangeRateCache.get(poolId);
            if (!cacheEntry) {
                cacheEntry = {
                    poolId,
                    exchangeRateId: validator.exchangeRatesTable?.address || '',
                    epochData: {},
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
                            if (exchangeRateData && !cacheEntry.epochData[epochFromName]) {
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

                    const exchangeRateVariables = {
                        exchangeRatesTableId: validator.exchangeRatesTable?.address,
                        cursor: exchangeRateCursor,
                    };
                    // @ts-ignore
                    const exchangeRateResult = await gqlClient.query({
                        query: exchangeRateQuery,
                        variables: exchangeRateVariables,
                    });
                    // @ts-ignore
                    const dynamicFields = exchangeRateResult.data?.owner?.dynamicFields;

                    if (!dynamicFields?.nodes) break;

                    // Process additional exchange rate nodes
                    for (const node of dynamicFields.nodes) {
                        const epochFromName = parseInt(node.name?.json);
                        if (!isNaN(epochFromName) && node.value?.data) {
                            const exchangeRateData = parseExchangeRateData(node.value.data);
                            if (exchangeRateData && !cacheEntry.epochData[epochFromName]) {
                                cacheEntry.epochData[epochFromName] = exchangeRateData;
                            }
                        }
                    }

                    hasNextExchangeRatePage = dynamicFields.pageInfo?.hasNextPage || false;
                    exchangeRateCursor = dynamicFields.pageInfo?.endCursor || '';
                }
            }
        }

        hasNextValidatorPage = activeValidators.pageInfo?.hasNextPage || false;
        validatorCursor = activeValidators.pageInfo?.endCursor || '';
    }

    // Fetch inactive validators to get their deactivation epochs
    console.log('Fetching inactive validators to get deactivation epochs...');
    try {
        const systemState = (await fetchSystemState())[0];
        const inactiveValidators = await getInactiveValidatorsWithDeactivationEpoch(systemState);

        for (const [poolId, info] of Object.entries(inactiveValidators)) {
            let cacheEntry = exchangeRateCache.get(poolId);
            if (!cacheEntry) {
                cacheEntry = {
                    poolId,
                    exchangeRateId: info.exchangeRateId,
                    epochData: {},
                    deactivationEpoch: info.deactivationEpoch,
                };
                exchangeRateCache.set(poolId, cacheEntry);
            } else {
                // Update deactivation epoch if not already set
                if (cacheEntry.deactivationEpoch === undefined) {
                    cacheEntry.deactivationEpoch = info.deactivationEpoch;
                }
                // Update exchangeRateId if it was empty
                if (!cacheEntry.exchangeRateId) {
                    cacheEntry.exchangeRateId = info.exchangeRateId;
                }
            }
            console.log(`Set deactivation epoch ${info.deactivationEpoch} for pool ${poolId}`);
        }
        console.log(
            `Processed ${Object.keys(inactiveValidators).length} inactive validators with deactivation epochs`,
        );

        // Fill in exchange rate data for inactive pools whose cache is incomplete.
        // The active-validator loop above only sees currently-active pools, so any
        // epochs between the pool's last active epoch and its deactivationEpoch
        // would otherwise never get fetched.
        for (const [poolId, info] of Object.entries(inactiveValidators)) {
            const cacheEntry = exchangeRateCache.get(poolId);
            if (!cacheEntry || !cacheEntry.exchangeRateId) continue;

            const cachedEpochNums = Object.keys(cacheEntry.epochData).map(Number);
            const maxCached = cachedEpochNums.length > 0 ? Math.max(...cachedEpochNums) : -1;
            if (maxCached >= info.deactivationEpoch) continue;

            console.log(
                `Filling missing exchange rates for inactive pool ${poolId} (cached up to ${maxCached}, deactivated at ${info.deactivationEpoch})`,
            );

            let hasNextPage = true;
            let cursor = '';
            let added = 0;
            while (hasNextPage) {
                const cursorSection = cursor ? `(after: "${cursor}")` : '';
                const query = `query getInactiveExchangeRates($tableId: IotaAddress!) {
                    owner(address: $tableId) {
                        dynamicFields${cursorSection} {
                            pageInfo { endCursor hasNextPage }
                            nodes {
                                name { json }
                                value { ... on MoveValue { data } }
                            }
                        }
                    }
                }`;
                // @ts-ignore
                const result = await gqlClient.query({
                    query,
                    variables: { tableId: cacheEntry.exchangeRateId },
                });
                // @ts-ignore
                const dynamicFields = result.data?.owner?.dynamicFields;
                if (!dynamicFields?.nodes) break;

                for (const node of dynamicFields.nodes) {
                    const epochFromName = parseInt(node.name?.json);
                    if (isNaN(epochFromName)) continue;
                    if (epochFromName > info.deactivationEpoch) continue;
                    if (cacheEntry.epochData[epochFromName]) continue;
                    if (!node.value?.data) continue;
                    const exchangeRateData = parseExchangeRateData(node.value.data);
                    if (exchangeRateData) {
                        cacheEntry.epochData[epochFromName] = exchangeRateData;
                        added++;
                    }
                }

                hasNextPage = dynamicFields.pageInfo?.hasNextPage || false;
                cursor = dynamicFields.pageInfo?.endCursor || '';
            }
            if (added > 0) {
                console.log(`  added ${added} missing epoch(s) for pool ${poolId}`);
            }
        }
    } catch (error) {
        console.warn('Failed to fetch inactive validators:', error);
    }

    console.log(`Exchange rates cache updated with ${exchangeRateCache.size} pools`);
}

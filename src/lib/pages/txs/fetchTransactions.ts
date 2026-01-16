import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

import { getClient, getSelectedNetworkConfig } from '../../utils/client';

// Transaction data interfaces
export interface CreatedObject {
    objectId: string;
    objectType: string;
    version: string;
}

export interface InputObject {
    objectId: string;
    objectType: string;
    version: string;
    isGas?: boolean;
}

export interface MutatedObject {
    objectId: string;
    objectType: string;
    previousVersion: string;
    version: string;
}

export interface TransactionNode {
    digest: string;
    sender: string;
    checkpoint: number;
    timestamp: string;
    createdObjects: CreatedObject[];
    mutatedObjects: MutatedObject[];
    deletedObjects: string[];
    inputObjects: InputObject[];
    recipients: string[]; // Addresses that received objects
    rawData?: any; // Store raw tx data for substring search
}

export async function fetchTransactionByDigest(digest: string): Promise<TransactionNode | null> {
    try {
        const client = getClient();
        const tx = await client.getTransactionBlock({
            digest,
            options: {
                showEffects: true,
                showInput: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });

        if (!tx) return null;

        const checkpoint = tx.checkpoint ? parseInt(tx.checkpoint) : 0;
        const timestamp = tx.timestampMs || '';
        const sender = tx.transaction?.data?.sender || '';

        // Extract created objects
        const createdObjects: CreatedObject[] = [];
        const mutatedObjects: MutatedObject[] = [];
        const deletedObjects: string[] = [];
        const inputObjects: InputObject[] = [];
        const recipients: string[] = [];

        // Build a map of object types from objectChanges
        const objectTypeMap = new Map<string, string>();
        if (tx.objectChanges) {
            for (const change of tx.objectChanges) {
                if (
                    (change.type === 'created' || change.type === 'mutated') &&
                    'objectId' in change &&
                    'objectType' in change
                ) {
                    objectTypeMap.set(change.objectId, change.objectType);
                }
            }
        }

        // Extract input objects from transaction data
        if (tx.transaction?.data?.transaction) {
            const txData = tx.transaction.data.transaction as any;
            if (txData.inputs) {
                for (const input of txData.inputs) {
                    if (input.Object?.ImmOrOwnedObject) {
                        const obj = input.Object.ImmOrOwnedObject;
                        inputObjects.push({
                            objectId: obj.objectId,
                            objectType:
                                obj.objectType || objectTypeMap.get(obj.objectId) || 'Unknown',
                            version: obj.version || '',
                            isGas: false,
                        });
                    }
                }
            }
        }

        // Extract gas payment objects
        if (tx.transaction?.data?.gasData?.payment) {
            for (const gasCoin of tx.transaction.data.gasData.payment) {
                inputObjects.push({
                    objectId: gasCoin.objectId,
                    objectType: objectTypeMap.get(gasCoin.objectId) || 'Unknown',
                    version: gasCoin.version || '',
                    isGas: true,
                });
            }
        }

        // Process object changes
        if (tx.objectChanges) {
            for (const change of tx.objectChanges) {
                if (change.type === 'created' && 'objectId' in change && 'objectType' in change) {
                    createdObjects.push({
                        objectId: change.objectId,
                        objectType: change.objectType,
                        version: (change as any).version || '',
                    });
                    if ((change as any).recipient && (change as any).recipient !== sender) {
                        recipients.push((change as any).recipient);
                    }
                } else if (
                    change.type === 'mutated' &&
                    'objectId' in change &&
                    'objectType' in change
                ) {
                    mutatedObjects.push({
                        objectId: change.objectId,
                        objectType: change.objectType,
                        previousVersion: (change as any).previousVersion || '',
                        version: (change as any).version || '',
                    });
                } else if (change.type === 'deleted' && 'objectId' in change) {
                    deletedObjects.push(change.objectId);
                }
            }
        }

        return {
            digest,
            sender,
            checkpoint,
            timestamp,
            createdObjects,
            mutatedObjects,
            deletedObjects,
            inputObjects,
            recipients: [...new Set(recipients)],
            rawData: tx,
        };
    } catch (e: any) {
        console.error(`Failed to fetch transaction ${digest}:`, e);
        return null;
    }
}

interface FetchTransactionsOptions {
    limit: number;
    cursor?: string | null;
    orderBy: 'newest' | 'oldest';
    afterCheckpoint?: string;
    beforeCheckpoint?: string;
    combineFunctionFilter?: boolean;
    functionFilter?: string;
}

async function fetchTransactionsWithFilter(
    filterParts: string[],
    variables: Record<string, any>,
    options: FetchTransactionsOptions,
    scanLimit?: number,
): Promise<{ txs: TransactionNode[]; nextCursor: string | null; hasMore: boolean }> {
    const config = getSelectedNetworkConfig();
    const graphqlClient = new IotaGraphQLClient({
        url: config.graphql,
    });

    const isNewest = options.orderBy === 'newest';
    const direction = isNewest ? 'last' : 'first';
    const cursorParam = isNewest ? 'before' : 'after';
    const cursorSection = options.cursor ? `, ${cursorParam}: "${options.cursor}"` : '';

    const filterStr = `{ ${filterParts.join(', ')} }`;
    const scanLimitStr = scanLimit ? `, scanLimit: ${scanLimit}` : '';

    const result = await graphqlClient.query({
        query: `
            query GetTransactions($limit: Int!) {
                transactionBlocks(
                    filter: ${filterStr}
                    ${direction}: $limit${cursorSection}${scanLimitStr}
                ) {
                    pageInfo {
                        ${isNewest ? 'hasPreviousPage' : 'hasNextPage'}
                        ${isNewest ? 'startCursor' : 'endCursor'}
                    }
                    nodes {
                        digest
                    }
                }
            }
        `,
        variables: {
            limit: options.limit,
            ...variables,
        },
    });

    const data = result.data as any;
    const allDigests =
        data?.transactionBlocks?.nodes?.map((n: any) => n.digest).filter(Boolean) || [];
    // Limit to the requested number to ensure we don't fetch more than intended
    const digests = allDigests.slice(0, options.limit);
    const hasMore =
        data?.transactionBlocks?.pageInfo?.[isNewest ? 'hasPreviousPage' : 'hasNextPage'] || false;
    const nextCursor =
        data?.transactionBlocks?.pageInfo?.[isNewest ? 'startCursor' : 'endCursor'] || null;

    // Fetch full transaction details
    const txs: TransactionNode[] = [];
    for (const digest of digests) {
        const tx = await fetchTransactionByDigest(digest);
        if (tx) txs.push(tx);
    }

    return { txs, nextCursor, hasMore };
}

export async function fetchTransactionsForAddress(
    address: string,
    options: FetchTransactionsOptions,
): Promise<{ txs: TransactionNode[]; nextCursor: string | null; hasMore: boolean }> {
    const filterParts = [`signAddress: $address`];

    if (options.afterCheckpoint && options.afterCheckpoint.trim()) {
        filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
    }
    if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) {
        filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
    }
    if (options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()) {
        filterParts.push(`function: "${options.functionFilter.trim()}"`);
    }

    const scanLimit =
        options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()
            ? 100000000
            : undefined;

    return fetchTransactionsWithFilter(filterParts, { address }, options, scanLimit);
}

export async function fetchTransactionsByInputObject(
    objectId: string,
    options: FetchTransactionsOptions,
): Promise<{ txs: TransactionNode[]; nextCursor: string | null; hasMore: boolean }> {
    const filterParts = [`inputObject: $objectId`];

    if (options.afterCheckpoint && options.afterCheckpoint.trim()) {
        filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
    }
    if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) {
        filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
    }
    if (options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()) {
        filterParts.push(`function: "${options.functionFilter.trim()}"`);
    }

    const scanLimit =
        options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()
            ? 100000000
            : undefined;

    return fetchTransactionsWithFilter(filterParts, { objectId }, options, scanLimit);
}

export async function fetchTransactionsByFunction(
    options: FetchTransactionsOptions,
): Promise<{ txs: TransactionNode[]; nextCursor: string | null; hasMore: boolean }> {
    const filterParts = [`kind: PROGRAMMABLE_TX`, `function: "${options.functionFilter!.trim()}"`];

    if (options.afterCheckpoint && options.afterCheckpoint.trim()) {
        filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
    }
    if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) {
        filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
    }

    return fetchTransactionsWithFilter(filterParts, {}, options, 100000000);
}

export async function fetchRecentTransactions(
    options: FetchTransactionsOptions,
): Promise<{ txs: TransactionNode[]; nextCursor: string | null; hasMore: boolean }> {
    const filterParts = [`kind: PROGRAMMABLE_TX`];

    if (options.afterCheckpoint && options.afterCheckpoint.trim()) {
        filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
    }
    if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) {
        filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
    }

    return fetchTransactionsWithFilter(filterParts, {}, options);
}

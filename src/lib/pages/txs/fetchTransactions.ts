import { GraphQlClient } from '../../utils/wasm-sdk';

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

const TX_BY_DIGEST_QUERY = `
    query GetTransaction($digest: String!) {
        transactionBlock(digest: $digest) {
            digest
            sender { address }
            effects {
                checkpoint { sequenceNumber }
                timestamp
                objectChanges {
                    nodes {
                        address
                        inputState { asMoveObject { contents { type { repr } } } version }
                        outputState { asMoveObject { contents { type { repr } } } version }
                        idCreated
                        idDeleted
                    }
                }
                gasEffects {
                    gasObject { address version }
                    gasSummary { computationCost storageCost storageRebate }
                }
            }
        }
    }
`;

export async function fetchTransactionByDigest(digest: string): Promise<TransactionNode | null> {
    try {
        const config = getSelectedNetworkConfig();
        const graphqlClient = new GraphQlClient(config.graphql);

        const resultStr = await graphqlClient.runQuery({
            query: TX_BY_DIGEST_QUERY,
            variables: JSON.stringify({ digest }),
        });
        const result: any = JSON.parse(resultStr);
        const tx = result?.transactionBlock;

        if (!tx) return null;

        const checkpoint = tx.effects?.checkpoint?.sequenceNumber
            ? parseInt(tx.effects.checkpoint.sequenceNumber)
            : 0;
        const timestamp = tx.effects?.timestamp || '';
        const sender = tx.sender?.address || '';

        const createdObjects: CreatedObject[] = [];
        const mutatedObjects: MutatedObject[] = [];
        const deletedObjects: string[] = [];
        const inputObjects: InputObject[] = [];
        const recipients: string[] = [];

        const objectChanges = tx.effects?.objectChanges?.nodes || [];
        for (const change of objectChanges) {
            const objectId = change.address;
            const outputType = change.outputState?.asMoveObject?.contents?.type?.repr || 'Unknown';
            const inputType = change.inputState?.asMoveObject?.contents?.type?.repr || 'Unknown';
            const outputVersion = change.outputState?.version?.toString() || '';
            const inputVersion = change.inputState?.version?.toString() || '';

            if (change.idCreated) {
                createdObjects.push({
                    objectId,
                    objectType: outputType,
                    version: outputVersion,
                });
            } else if (change.idDeleted) {
                deletedObjects.push(objectId);
            } else if (change.inputState && change.outputState) {
                mutatedObjects.push({
                    objectId,
                    objectType: outputType,
                    previousVersion: inputVersion,
                    version: outputVersion,
                });
            } else if (change.inputState && !change.outputState) {
                inputObjects.push({
                    objectId,
                    objectType: inputType,
                    version: inputVersion,
                    isGas: false,
                });
            }
        }

        // Mark gas object
        const gasObjectId = tx.effects?.gasEffects?.gasObject?.address;
        if (gasObjectId) {
            const existing = inputObjects.find((o) => o.objectId === gasObjectId);
            if (existing) {
                existing.isGas = true;
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
            rawData: result?.transactionBlock,
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
    const graphqlClient = new GraphQlClient(config.graphql);

    const isNewest = options.orderBy === 'newest';
    const direction = isNewest ? 'last' : 'first';
    const cursorParam = isNewest ? 'before' : 'after';
    const cursorSection = options.cursor ? `, ${cursorParam}: "${options.cursor}"` : '';

    const filterStr = `{ ${filterParts.join(', ')} }`;
    const scanLimitStr = scanLimit ? `, scanLimit: ${scanLimit}` : '';

    // Build variable declarations for the GraphQL query
    const variableDeclarations = ['$limit: Int!'];
    if (variables.address !== undefined) {
        variableDeclarations.push('$address: IotaAddress!');
    }
    if (variables.objectId !== undefined) {
        variableDeclarations.push('$objectId: IotaAddress!');
    }
    const variableDeclarationsStr = variableDeclarations.join(', ');

    const result: any = JSON.parse(await graphqlClient.runQuery({
        query: `
            query GetTransactions(${variableDeclarationsStr}) {
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
        variables: JSON.stringify({
            limit: options.limit,
            ...variables,
        }),
    }));

    const data = result;
    const allDigests =
        data?.transactionBlocks?.nodes?.map((n: any) => n.digest).filter(Boolean) || [];
    // Limit to the requested number to ensure we don't fetch more than intended
    const digests = allDigests.slice(0, options.limit);
    const hasMore =
        data?.transactionBlocks?.pageInfo?.[isNewest ? 'hasPreviousPage' : 'hasNextPage'] || false;
    const nextCursor =
        data?.transactionBlocks?.pageInfo?.[isNewest ? 'startCursor' : 'endCursor'] || null;

    // Fetch full transaction details in parallel
    const txPromises = digests.map((digest: string) => fetchTransactionByDigest(digest));
    const txResults = await Promise.all(txPromises);
    const txs = txResults.filter((tx): tx is TransactionNode => tx !== null);

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

import {
    IotaGraphQLClient,
    type GraphQLQueryOptions,
    type GraphQLQueryResult,
} from '@iota/iota-sdk/graphql';
import { graphql } from '@iota/iota-sdk/graphql/schemas/2025.2';

import { getSelectedNetworkConfig } from '../../utils/client';
import type {
    CheckpointRange,
    RawTransactionBlock,
    TransactionBatchResult,
} from '../../utils/graphql-types';

// Max transaction blocks to request per GraphQL page. The query fetches deeply
// nested connections (balanceChanges, objectChanges -> modules, events) per
// block, so the GraphQL server's estimated output-node count grows quickly with
// the page size. Requesting too many at once trips the server's "Estimated
// output nodes exceeds 10000" guard, so we page in small chunks instead.
const MAX_PAGE_SIZE = 10;

export class GraphQLDataFetcher {
    constructor() {}

    private async queryGraphQl(
        query: string,
        variables: Record<string, any> = {},
    ): Promise<GraphQLQueryResult> {
        const options: GraphQLQueryOptions = {
            query: graphql(query),
            variables,
        };
        return new IotaGraphQLClient({
            url: getSelectedNetworkConfig().graphql,
        }).query(options);
    }

    async getCurrentEpoch(): Promise<string | null> {
        try {
            const currentEpochQuery = `query {
                epoch {
                    epochId
                }
            }`;

            const result = await this.queryGraphQl(currentEpochQuery);

            if (result.errors) {
                console.error('Error fetching current epoch:', result.errors);
                return null;
            }

            // @ts-ignore
            const currentEpochId = result.data?.epoch?.epochId;
            return currentEpochId ? currentEpochId.toString() : null;
        } catch (err: any) {
            console.error('Error fetching current epoch:', err);
            return null;
        }
    }

    async getCheckpointRangeForEpoch(epochNum: number): Promise<CheckpointRange> {
        const checkpointRangeQuery = `query ($epochId: UInt53!) {
            epoch(id: $epochId) {
                checkpoints(first: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
                lastCheckpoints: checkpoints(last: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
            }
        }`;

        const result = await this.queryGraphQl(checkpointRangeQuery, { epochId: epochNum });

        if (result.errors) {
            throw new Error(
                `GraphQL Error: ${result.errors.map((e: any) => e.message).join(', ')}`,
            );
        }

        // @ts-ignore
        const firstCheckpoint = result.data?.epoch?.checkpoints?.nodes?.[0]?.sequenceNumber;
        // @ts-ignore
        const lastCheckpoint = result.data?.epoch?.lastCheckpoints?.nodes?.[0]?.sequenceNumber;

        if (!firstCheckpoint || !lastCheckpoint) {
            throw new Error(`Could not find checkpoint range for epoch ${epochNum}`);
        }

        return { first: firstCheckpoint, last: lastCheckpoint };
    }

    async fetchTransactionBatch(
        checkpointRange: CheckpointRange,
        batchSize: number = MAX_PAGE_SIZE,
        cursor?: string | null,
        inputObject?: string,
        functionFilter?: string,
    ): Promise<TransactionBatchResult> {
        const cursorSection = cursor ? `, after: "${cursor}"` : '';

        // Build filter object dynamically
        const filterParts = [
            `afterCheckpoint: ${checkpointRange.first}`,
            `beforeCheckpoint: ${checkpointRange.last}`,
            `kind: PROGRAMMABLE_TX`,
        ];

        if (inputObject && inputObject.trim()) {
            filterParts.push(`inputObject: "${inputObject.trim()}"`);
        }

        if (functionFilter && functionFilter.trim()) {
            filterParts.push(`function: "${functionFilter.trim()}"`);
        }

        const filterString = filterParts.join(', ');

        // Add scanLimit if optional filters are provided
        const hasOptionalFilters =
            (inputObject && inputObject.trim()) || (functionFilter && functionFilter.trim());
        const scanLimitSection = hasOptionalFilters ? 'scanLimit: 100000000,' : '';

        const txQuery = `query {
                transactionBlocks(
                    ${scanLimitSection}
                    filter: {
                        ${filterString}
                    }
                    first: ${batchSize}${cursorSection}
                ) {
                    nodes {
                        digest
                        sender {
                            address
                        }
                        effects {
                            checkpoint {
                                sequenceNumber
                                timestamp
                            }
                            status
                            balanceChanges{
                                nodes{
                                    owner{
                                        address
                                    }
                                    coinType{
                                        repr
                                    }
                                    amount
                                }
                            }
                            gasEffects{
                              gasSummary{
                                storageCost
                                storageRebate
                                computationCost
                              }
                            }
                            objectChanges {
                                nodes {
                                    idDeleted
                                    idCreated
                                    address
                                    inputState {
                                      asMoveObject {
                                        contents {
                                          json
                                        }
                                      }
                                    }
                                    outputState {
                                        asMoveObject {
                                            contents {
                                                json
                                            }
                                        }
                                        asMovePackage {
                                            modules {
                                                nodes {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            events {
                              nodes {
                                data
                                sendingModule {
                                  package {
                                    address
                                  }
                                }
                              }
                            }
                            transactionBlock {
                                bcs
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`;

        const result = await this.queryGraphQl(txQuery);

        if (result.errors) {
            throw new Error(
                `GraphQL Error: ${result.errors.map((e: any) => e.message).join(', ')}`,
            );
        }

        // @ts-ignore
        const transactionBlocks = result.data?.transactionBlocks?.nodes || [];
        // @ts-ignore
        const hasNextPage = result.data?.transactionBlocks?.pageInfo?.hasNextPage || false;
        // @ts-ignore
        const endCursor = result.data?.transactionBlocks?.pageInfo?.endCursor;

        return {
            transactions: transactionBlocks,
            hasNextPage,
            endCursor,
        };
    }

    async *fetchAllTransactionBlocks(
        checkpointRange: CheckpointRange,
        maxTransactions?: number,
        inputObject?: string,
        functionFilter?: string,
    ): AsyncGenerator<{
        transactions: RawTransactionBlock[];
        isComplete: boolean;
        totalFetched: number;
        hasMore: boolean;
    }> {
        let hasNextPage = true;
        let cursor: string | null = null;
        let totalFetched = 0;

        while (hasNextPage && (!maxTransactions || totalFetched < maxTransactions)) {
            const remainingToFetch = maxTransactions
                ? maxTransactions - totalFetched
                : MAX_PAGE_SIZE;
            const batchSize = Math.min(MAX_PAGE_SIZE, remainingToFetch);

            const batchResult = await this.fetchTransactionBatch(
                checkpointRange,
                batchSize,
                cursor,
                inputObject,
                functionFilter,
            );

            // Process transactions up to the limit
            const transactionsToProcess = maxTransactions
                ? batchResult.transactions.slice(0, remainingToFetch)
                : batchResult.transactions;

            totalFetched += transactionsToProcess.length;
            hasNextPage = batchResult.hasNextPage;
            cursor = batchResult.endCursor;

            const isComplete =
                !hasNextPage || (maxTransactions !== undefined && totalFetched >= maxTransactions);

            yield {
                transactions: transactionsToProcess,
                isComplete,
                totalFetched,
                hasMore: hasNextPage && (!maxTransactions || totalFetched < maxTransactions),
            };

            // Break if we've reached our limit
            if (maxTransactions && totalFetched >= maxTransactions) {
                break;
            }
        }
    }
}

import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
import { getSelectedNetworkConfig } from './client';
import Mainnet0Until90 from './MainnetEndOfEpochPoolExchangeRates0-90.json'

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

export async function fetchEndOfEpochTransactions() {
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
    let allNodes = [];
    let cursorSection = '';
    let hasNextPage = true;
    let endCursor = '';
    // checkpoint 34832389 is the latest checkpoint of epoch 90 (MainnetEndOfEpochPoolExchangeRates0-90.json)
    let mainnetCheckpointFilter = ''
    if (getSelectedNetworkConfig().name === 'mainnet') {
        mainnetCheckpointFilter = ', afterCheckpoint: 34832389';
    }
    while (hasNextPage) {
        const query = `
            query {
                transactionBlocks(
                    filter: {kind: END_OF_EPOCH_TX${mainnetCheckpointFilter}}
                    ${cursorSection}
                ) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        effects {
                            epoch {
                                epochId
                            }
                            objectChanges {
                                nodes {
                                    address
                                    outputState {
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
                    }
                }
            }
        `;
        // @ts-ignore
        const result = await gqlClient.query({ query, variables: {} });
        // @ts-ignore
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
    // Filter for PoolTokenExchangeRate objects
    const filteredNodes = allNodes.map(tx => {
        // @ts-ignore
        const objectNodes: any[] = tx.effects?.objectChanges?.nodes || [];
        const poolTokenObjects = objectNodes.filter((obj: any) => {
            const repr = obj.outputState?.asMoveObject?.contents?.type?.repr;
            return typeof repr === 'string' && repr.includes('staking_pool::PoolTokenExchangeRate');
        });
        if (poolTokenObjects.length > 0) {
            return {
                ...tx,
                effects: {
                    ...tx.effects,
                    objectChanges: {
                        ...tx.effects?.objectChanges,
                        nodes: poolTokenObjects
                    }
                }
            };
        }
        return null;
    }).filter(tx => tx !== null);
    console.log(`Filtered END_OF_EPOCH_TX transactions count: ${filteredNodes.length}`);
    return Mainnet0Until90.concat(filteredNodes);
}

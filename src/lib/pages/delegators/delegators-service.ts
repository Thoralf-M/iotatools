import type { IotaClient } from '@iota/iota-sdk/client';
import type { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
import { graphql } from '@iota/iota-sdk/graphql/schemas/2025.2';

const STAKED_IOTA_TYPE = '0x3::staking_pool::StakedIota';
const TIMELOCKED_STAKED_IOTA_TYPE = '0x3::timelocked_staking::TimelockedStakedIota';

export interface StakedObject {
    id: string;
    poolId: string;
    stakeActivationEpoch: number;
    principal: bigint;
    ownerAddress: string;
    isTimelocked: boolean;
}

export interface ValidatorInfo {
    address: string;
    name: string;
    poolId: string;
}

export interface DelegatorData {
    validators: ValidatorInfo[];
    stakedObjects: StakedObject[];
    totalSupply: bigint;
    currentEpoch: number;
}

export interface ValidatorStats {
    name: string;
    address: string;
    poolId: string;
    stakedObjectCount: number;
    timelockedObjectCount: number;
    uniqueAddresses: number;
    totalStakedAmount: number;
    averageStakedAmount: number;
    averageStakeDuration: number;
    stakePercentage: number;
}

export interface GlobalStats {
    totalStakedObjects: number;
    totalTimelockedObjects: number;
    totalUniqueAddresses: number;
    totalStakedAmount: number;
    averageStakedAmount: number;
    averageStakeDuration: number;
    totalSupply: bigint;
    totalStakePercentage: number;
}

export interface DelegatorStats {
    validators: ValidatorStats[];
    global: GlobalStats;
}

export async function fetchDelegatorData(
    client: IotaClient,
    progressCallback: (
        message: string,
        currentData?: DelegatorData,
        currentStats?: DelegatorStats,
    ) => void,
    isPaused: () => boolean,
    signal: AbortSignal,
): Promise<{ data: DelegatorData; stats: DelegatorStats }> {
    // Get system state to fetch validators and total supply
    progressCallback('Fetching system state and validators...');
    const systemState = await client.getLatestIotaSystemState();
    const totalSupply = BigInt(systemState.iotaTotalSupply);
    const currentEpoch = parseInt(systemState.epoch);

    const validators: ValidatorInfo[] = systemState.activeValidators.map((v) => ({
        address: v.iotaAddress,
        name: v.name || 'Unknown',
        poolId: v.stakingPoolId,
    }));

    progressCallback(`Found ${validators.length} active validators. Fetching staked objects...`);

    // Fetch both StakedIota and TimelockedStakedIota objects
    const stakedObjects: StakedObject[] = [];

    // Fetch StakedIota objects
    await fetchStakedObjectsOfType(
        client,
        STAKED_IOTA_TYPE,
        false,
        stakedObjects,
        (message) => {
            const currentData: DelegatorData = {
                validators,
                stakedObjects: [...stakedObjects],
                totalSupply,
                currentEpoch,
            };
            const currentStats = computeStats(stakedObjects, validators, totalSupply, currentEpoch);
            progressCallback(message, currentData, currentStats);
        },
        isPaused,
        signal,
    );

    // Fetch TimelockedStakedIota objects
    await fetchStakedObjectsOfType(
        client,
        TIMELOCKED_STAKED_IOTA_TYPE,
        true,
        stakedObjects,
        (message) => {
            const currentData: DelegatorData = {
                validators,
                stakedObjects: [...stakedObjects],
                totalSupply,
                currentEpoch,
            };
            const currentStats = computeStats(stakedObjects, validators, totalSupply, currentEpoch);
            progressCallback(message, currentData, currentStats);
        },
        isPaused,
        signal,
    );

    progressCallback('Computing final statistics...');
    const stats = computeStats(stakedObjects, validators, totalSupply, currentEpoch);

    progressCallback('Done!');

    return {
        data: {
            validators,
            stakedObjects,
            totalSupply,
            currentEpoch,
        },
        stats,
    };
}

async function fetchStakedObjectsOfType(
    client: IotaClient,
    objectType: string,
    isTimelocked: boolean,
    stakedObjects: StakedObject[],
    progressCallback: (message: string) => void,
    isPaused: () => boolean,
    signal: AbortSignal,
): Promise<void> {
    const gqlClient = (client as any).transport?.client;
    if (!gqlClient) {
        throw new Error('GraphQL client not available');
    }

    const typeLabel = isTimelocked ? 'TimelockedStakedIota' : 'StakedIota';
    let cursor: string | null = null;
    let pageCount = 0;

    while (true) {
        if (isPaused()) {
            throw new Error('Paused');
        }

        if (signal.aborted) {
            throw new Error('Aborted');
        }

        pageCount++;
        progressCallback(
            `Fetching ${typeLabel} objects (page ${pageCount}, total ${stakedObjects.length} objects)...`,
        );

        const query = `query getStakedIota($type: String, $cursor: String) {
            objects(filter: {type: $type}, after: $cursor) {
                nodes {
                    address
                    owner {
                        ... on AddressOwner {
                            owner {
                                address
                            }
                        }
                    }
                    asMoveObject {
                        contents {
                            json
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }`;

        const result = await queryGraphQL(gqlClient, query, {
            type: objectType,
            cursor: cursor,
        });

        if (result.errors) {
            throw new Error('GraphQL query failed: ' + JSON.stringify(result.errors));
        }

        const objects = result.data.objects.nodes;
        for (const node of objects) {
            try {
                const json = node.asMoveObject?.contents?.json;
                if (!json) continue;

                const ownerAddress = node.owner?.owner?.address;
                if (!ownerAddress) continue;

                let poolId: string;
                let stakeActivationEpoch: number;
                let principal: bigint;

                if (isTimelocked) {
                    // TimelockedStakedIota structure
                    poolId = json.pool_id;
                    stakeActivationEpoch = parseInt(json.stake_activation_epoch || '0');
                    principal = BigInt(json.principal || '0');
                } else {
                    // StakedIota structure
                    poolId = json.pool_id;
                    stakeActivationEpoch = parseInt(json.stake_activation_epoch || '0');
                    principal = BigInt(json.principal?.value || json.principal || '0');
                }

                stakedObjects.push({
                    id: json.id,
                    poolId,
                    stakeActivationEpoch,
                    principal,
                    ownerAddress,
                    isTimelocked,
                });
            } catch (err) {
                console.warn('Error processing node:', err, node);
            }
        }

        const pageInfo = result.data.objects.pageInfo;
        if (!pageInfo.hasNextPage) {
            break;
        }

        cursor = pageInfo.endCursor;
    }

    progressCallback(`Fetched ${stakedObjects.length} ${typeLabel} objects.`);
}

async function queryGraphQL(
    gqlClient: IotaGraphQLClient,
    query: string,
    variables: Record<string, any>,
): Promise<any> {
    const options = {
        query: graphql(query),
        variables,
    };
    return gqlClient.query(options);
}

function computeStats(
    stakedObjects: StakedObject[],
    validators: ValidatorInfo[],
    totalSupply: bigint,
    currentEpoch: number,
): DelegatorStats {
    // Create a map of poolId to validator
    const validatorMap = new Map<string, ValidatorInfo>();
    validators.forEach((v) => validatorMap.set(v.poolId, v));

    // Compute per-validator stats
    const validatorStatsMap = new Map<string, ValidatorStats>();
    validators.forEach((v) => {
        validatorStatsMap.set(v.poolId, {
            name: v.name,
            address: v.address,
            poolId: v.poolId,
            stakedObjectCount: 0,
            timelockedObjectCount: 0,
            uniqueAddresses: 0,
            totalStakedAmount: 0,
            averageStakedAmount: 0,
            averageStakeDuration: 0,
            stakePercentage: 0,
        });
    });

    // Track addresses per validator
    const validatorAddresses = new Map<string, Set<string>>();
    validators.forEach((v) => {
        validatorAddresses.set(v.poolId, new Set());
    });

    // Global stats
    let totalStakedAmount = 0;
    let totalStakeDuration = 0;
    let totalTimelockedCount = 0;
    const globalAddresses = new Set<string>();

    // Process each staked object
    stakedObjects.forEach((obj) => {
        const validatorStats = validatorStatsMap.get(obj.poolId);
        if (!validatorStats) return; // Skip if pool not found

        const amount = Number(obj.principal);
        const duration = currentEpoch - obj.stakeActivationEpoch;

        // Update validator stats
        validatorStats.stakedObjectCount++;
        if (obj.isTimelocked) {
            validatorStats.timelockedObjectCount++;
            totalTimelockedCount++;
        }
        validatorStats.totalStakedAmount += amount;
        validatorStats.averageStakeDuration += duration;

        // Track addresses
        validatorAddresses.get(obj.poolId)?.add(obj.ownerAddress);
        globalAddresses.add(obj.ownerAddress);

        // Update global stats
        totalStakedAmount += amount;
        totalStakeDuration += duration;
    });

    // Finalize validator stats
    const validatorStatsList: ValidatorStats[] = [];
    validatorStatsMap.forEach((stats, poolId) => {
        if (stats.stakedObjectCount > 0) {
            stats.averageStakedAmount = stats.totalStakedAmount / stats.stakedObjectCount;
            stats.averageStakeDuration = stats.averageStakeDuration / stats.stakedObjectCount;
        }
        stats.uniqueAddresses = validatorAddresses.get(poolId)?.size || 0;
        stats.stakePercentage = (stats.totalStakedAmount / Number(totalSupply)) * 100;
        validatorStatsList.push(stats);
    });

    // Sort validators by total staked amount (descending)
    validatorStatsList.sort((a, b) => b.totalStakedAmount - a.totalStakedAmount);

    // Compute global stats
    const globalStats: GlobalStats = {
        totalStakedObjects: stakedObjects.filter((o) => !o.isTimelocked).length,
        totalTimelockedObjects: totalTimelockedCount,
        totalUniqueAddresses: globalAddresses.size,
        totalStakedAmount,
        averageStakedAmount:
            stakedObjects.length > 0 ? totalStakedAmount / stakedObjects.length : 0,
        averageStakeDuration:
            stakedObjects.length > 0 ? totalStakeDuration / stakedObjects.length : 0,
        totalSupply,
        totalStakePercentage: (totalStakedAmount / Number(totalSupply)) * 100,
    };

    return {
        validators: validatorStatsList,
        global: globalStats,
    };
}

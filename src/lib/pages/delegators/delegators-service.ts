// [MIGRATION] IotaClient → GraphQlClient from wasm-sdk
import { GraphQlClient } from '../../utils/wasm-sdk';
// [GAP] graphql tagged template not in WASM SDK - use GraphQlClient.runQuery() with raw strings

import { getClient, getSelectedNetworkConfig } from '../../utils/client';

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
    commissionRate: number;
    nextEpochStake: bigint;
    nextEpochGasPrice: bigint;
    nextEpochCommissionRate: number;
    stakingPoolActivationEpoch: number;
    stakingPoolDeactivationEpoch: number | null;
    stakingPoolIotaBalance: bigint;
    rewardsPool: bigint;
    poolTokenBalance: bigint;
    pendingStake: bigint;
    pendingTotalIotaWithdraw: bigint;
    pendingPoolTokenWithdraw: bigint;
}

export interface DelegatorData {
    validators: ValidatorInfo[];
    stakedObjects: StakedObject[];
    totalSupply: bigint;
    totalStake: bigint;
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
    systemStakePercentage: number;
}

export interface GlobalStats {
    totalStakedObjects: number;
    totalTimelockedObjects: number;
    totalUniqueAddresses: number;
    uniqueStakedIotaAddresses: number;
    uniqueTimelockedAddresses: number;
    totalStakedAmount: number;
    totalNormalStakedAmount: number;
    totalTimelockedAmount: number;
    averageStakedAmount: number;
    averageStakeDuration: number;
    totalSupply: bigint;
    totalStakePercentage: number;
    totalSystemStakePercentage: number;
}

function parseBigIntValue(value: string | number | null | undefined): bigint {
    if (value == null) return 0n;
    if (typeof value === 'number') return BigInt(Math.trunc(value));
    const normalized = value.replace(/_/g, '');
    return normalized ? BigInt(normalized) : 0n;
}

function parseNumberValue(value: string | number | null | undefined, fallback = 0): number {
    if (value == null) return fallback;
    if (typeof value === 'number') return value;
    const normalized = value.replace(/_/g, '');
    const parsed = Number.parseInt(normalized, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

export interface DelegatorStats {
    validators: ValidatorStats[];
    global: GlobalStats;
}

export async function fetchDelegatorData(
    client: GraphQlClient,
    progressCallback: (
        message: string,
        currentData?: DelegatorData,
        currentStats?: DelegatorStats,
    ) => void,
    isPaused: () => boolean,
    signal: AbortSignal,
    resumeType: string | null = null,
    resumeCursor: string | null = null,
    resumeTimelockedCursor: string | null = null,
    resumeStakedObjects: StakedObject[] = [],
): Promise<{
    data: DelegatorData;
    stats: DelegatorStats;
    resumeType?: string;
    resumeCursor?: string | null;
    resumeTimelockedCursor?: string | null;
    resumeStakedObjects?: StakedObject[];
}> {
    // Get system state to fetch validators and total supply
    // Use non-GraphQL client as GraphQL transport has a bug with stakingPoolId
    progressCallback(
        resumeType
            ? 'Resuming fetch, getting system state...'
            : 'Fetching system state and validators...',
    );
    const systemState = await getClient(false).getLatestIotaSystemState();
    const totalSupply = BigInt(systemState.iotaTotalSupply);
    const totalStake = BigInt(systemState.totalStake);
    const currentEpoch = parseInt(systemState.epoch);

    const validators: ValidatorInfo[] = systemState.activeValidators.map((v: any) => {
        return {
            address: v.iotaAddress,
            name: v.name || 'Unknown',
            poolId: v.stakingPoolId,
            commissionRate: parseNumberValue(v.commissionRate),
            nextEpochStake: parseBigIntValue(v.nextEpochStake),
            nextEpochGasPrice: parseBigIntValue(v.nextEpochGasPrice),
            nextEpochCommissionRate: parseNumberValue(v.nextEpochCommissionRate),
            stakingPoolActivationEpoch: parseNumberValue(v.stakingPoolActivationEpoch),
            stakingPoolDeactivationEpoch:
                v.stakingPoolDeactivationEpoch == null
                    ? null
                    : parseNumberValue(v.stakingPoolDeactivationEpoch),
            stakingPoolIotaBalance: parseBigIntValue(v.stakingPoolIotaBalance),
            rewardsPool: parseBigIntValue(v.rewardsPool),
            poolTokenBalance: parseBigIntValue(v.poolTokenBalance),
            pendingStake: parseBigIntValue(v.pendingStake),
            pendingTotalIotaWithdraw: parseBigIntValue(v.pendingTotalIotaWithdraw),
            pendingPoolTokenWithdraw: parseBigIntValue(v.pendingPoolTokenWithdraw),
        };
    });

    progressCallback(
        resumeType
            ? `Resuming, found ${validators.length} active validators. Continuing staked objects...`
            : `Found ${validators.length} active validators. Fetching staked objects...`,
    );

    // Fetch both StakedIota and TimelockedStakedIota objects
    let stakedObjects: StakedObject[] = resumeStakedObjects || [];
    let currentResumeType = resumeType || null;

    // If resuming from parallel fetch (either StakedIota or both), continue in parallel
    if (currentResumeType === 'StakedIota' && resumeTimelockedCursor) {
        // Was paused during parallel fetch - continue both in parallel
        const normalStakedObjects: StakedObject[] = stakedObjects.filter(
            (obj) => !obj.isTimelocked,
        );
        const timelockedStakedObjects: StakedObject[] = stakedObjects.filter(
            (obj) => obj.isTimelocked,
        );

        // Only fetch types that haven't completed (have a cursor)
        const fetchPromises = [];

        if (resumeCursor) {
            // StakedIota not complete, continue fetching
            fetchPromises.push(
                fetchStakedObjectsOfType(
                    STAKED_IOTA_TYPE,
                    false,
                    normalStakedObjects,
                    (message) => {
                        const combined = [...normalStakedObjects, ...timelockedStakedObjects];
                        const currentData: DelegatorData = {
                            validators,
                            stakedObjects: combined,
                            totalSupply,
                            totalStake,
                            currentEpoch,
                        };
                        const currentStats = computeStats(
                            combined,
                            validators,
                            totalSupply,
                            totalStake,
                            currentEpoch,
                        );
                        progressCallback(`[Normal] ${message}`, currentData, currentStats);
                    },
                    isPaused,
                    signal,
                    resumeCursor,
                ),
            );
        } else {
            // StakedIota already complete
            fetchPromises.push(
                Promise.resolve({
                    stakedObjects: normalStakedObjects,
                    cursor: null,
                    paused: false,
                }),
            );
        }

        if (resumeTimelockedCursor) {
            // TimelockedStakedIota not complete, continue fetching
            fetchPromises.push(
                fetchStakedObjectsOfType(
                    TIMELOCKED_STAKED_IOTA_TYPE,
                    true,
                    timelockedStakedObjects,
                    (message) => {
                        const combined = [...normalStakedObjects, ...timelockedStakedObjects];
                        const currentData: DelegatorData = {
                            validators,
                            stakedObjects: combined,
                            totalSupply,
                            totalStake,
                            currentEpoch,
                        };
                        const currentStats = computeStats(
                            combined,
                            validators,
                            totalSupply,
                            totalStake,
                            currentEpoch,
                        );
                        progressCallback(`[Timelocked] ${message}`, currentData, currentStats);
                    },
                    isPaused,
                    signal,
                    resumeTimelockedCursor,
                ),
            );
        } else {
            // TimelockedStakedIota already complete
            fetchPromises.push(
                Promise.resolve({
                    stakedObjects: timelockedStakedObjects,
                    cursor: null,
                    paused: false,
                }),
            );
        }

        const [normalResult, timelockedResult] = await Promise.all(fetchPromises);

        // Handle pause scenarios
        if (normalResult.paused || timelockedResult.paused) {
            const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
            return {
                data: {
                    validators,
                    stakedObjects: combined,
                    totalSupply,
                    totalStake,
                    currentEpoch,
                },
                stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
                resumeType: 'StakedIota', // Always mark as StakedIota for parallel resume
                resumeCursor: normalResult.cursor,
                resumeTimelockedCursor: timelockedResult.cursor,
                resumeStakedObjects: combined,
            };
        }

        // Both completed successfully
        stakedObjects = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
    } else if (currentResumeType) {
        // Sequential resume scenarios (shouldn't happen with parallel fetch)
        if (currentResumeType === 'StakedIota') {
            const result = await fetchStakedObjectsOfType(
                STAKED_IOTA_TYPE,
                false,
                stakedObjects,
                (message) => {
                    const currentData: DelegatorData = {
                        validators,
                        stakedObjects: [...stakedObjects],
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    };
                    const currentStats = computeStats(
                        stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    );
                    progressCallback(message, currentData, currentStats);
                },
                isPaused,
                signal,
                resumeCursor,
            );

            if (result.paused) {
                return {
                    data: {
                        validators,
                        stakedObjects: result.stakedObjects,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    },
                    stats: computeStats(
                        result.stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    ),
                    resumeType: 'StakedIota',
                    resumeCursor: result.cursor,
                    resumeTimelockedCursor,
                    resumeStakedObjects: result.stakedObjects,
                };
            }

            // StakedIota completed, now fetch TimelockedStakedIota
            // Pass the SAME array so both types are combined
            const timelockedResult = await fetchStakedObjectsOfType(
                TIMELOCKED_STAKED_IOTA_TYPE,
                true,
                result.stakedObjects, // This array already has both old and new StakedIota objects
                (message) => {
                    const currentData: DelegatorData = {
                        validators,
                        stakedObjects: [...result.stakedObjects],
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    };
                    const currentStats = computeStats(
                        result.stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    );
                    progressCallback(message, currentData, currentStats);
                },
                isPaused,
                signal,
                resumeTimelockedCursor,
            );

            if (timelockedResult.paused) {
                return {
                    data: {
                        validators,
                        stakedObjects: timelockedResult.stakedObjects,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    },
                    stats: computeStats(
                        timelockedResult.stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    ),
                    resumeType: 'TimelockedStakedIota',
                    resumeCursor: timelockedResult.cursor,
                    resumeTimelockedCursor: timelockedResult.cursor,
                    resumeStakedObjects: timelockedResult.stakedObjects,
                };
            }

            stakedObjects = timelockedResult.stakedObjects;
        } else if (currentResumeType === 'TimelockedStakedIota') {
            const result = await fetchStakedObjectsOfType(
                TIMELOCKED_STAKED_IOTA_TYPE,
                true,
                stakedObjects,
                (message) => {
                    const currentData: DelegatorData = {
                        validators,
                        stakedObjects: [...stakedObjects],
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    };
                    const currentStats = computeStats(
                        stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    );
                    progressCallback(message, currentData, currentStats);
                },
                isPaused,
                signal,
                resumeCursor,
            );

            if (result.paused) {
                return {
                    data: {
                        validators,
                        stakedObjects: result.stakedObjects,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    },
                    stats: computeStats(
                        result.stakedObjects,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    ),
                    resumeType: 'TimelockedStakedIota',
                    resumeCursor: result.cursor,
                    resumeTimelockedCursor: result.cursor,
                    resumeStakedObjects: result.stakedObjects,
                };
            }

            stakedObjects = result.stakedObjects;
        }
    } else {
        // Fresh fetch - run both in parallel
        const normalStakedObjects: StakedObject[] = [];
        const timelockedStakedObjects: StakedObject[] = [];

        const [normalResult, timelockedResult] = await Promise.all([
            fetchStakedObjectsOfType(
                STAKED_IOTA_TYPE,
                false,
                normalStakedObjects,
                (message) => {
                    const combined = [...normalStakedObjects, ...timelockedStakedObjects];
                    const currentData: DelegatorData = {
                        validators,
                        stakedObjects: combined,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    };
                    const currentStats = computeStats(
                        combined,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    );
                    progressCallback(`[Normal] ${message}`, currentData, currentStats);
                },
                isPaused,
                signal,
                null,
            ),
            fetchStakedObjectsOfType(
                TIMELOCKED_STAKED_IOTA_TYPE,
                true,
                timelockedStakedObjects,
                (message) => {
                    const combined = [...normalStakedObjects, ...timelockedStakedObjects];
                    const currentData: DelegatorData = {
                        validators,
                        stakedObjects: combined,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    };
                    const currentStats = computeStats(
                        combined,
                        validators,
                        totalSupply,
                        totalStake,
                        currentEpoch,
                    );
                    progressCallback(`[Timelocked] ${message}`, currentData, currentStats);
                },
                isPaused,
                signal,
                null,
            ),
        ]);

        // Handle pause scenarios
        if (normalResult.paused) {
            const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
            return {
                data: {
                    validators,
                    stakedObjects: combined,
                    totalSupply,
                    totalStake,
                    currentEpoch,
                },
                stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
                resumeType: 'StakedIota',
                resumeCursor: normalResult.cursor,
                resumeTimelockedCursor: timelockedResult.cursor,
                resumeStakedObjects: combined,
            };
        }

        if (timelockedResult.paused) {
            // Normal completed, timelocked paused - include both
            const combined = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
            return {
                data: {
                    validators,
                    stakedObjects: combined,
                    totalSupply,
                    totalStake,
                    currentEpoch,
                },
                stats: computeStats(combined, validators, totalSupply, totalStake, currentEpoch),
                resumeType: 'StakedIota', // Use StakedIota to indicate parallel resume
                resumeCursor: normalResult.cursor, // null since normal completed
                resumeTimelockedCursor: timelockedResult.cursor,
                resumeStakedObjects: combined,
            };
        }

        // Both completed successfully
        stakedObjects = [...normalResult.stakedObjects, ...timelockedResult.stakedObjects];
    }

    progressCallback('Computing final statistics...');
    const stats = computeStats(stakedObjects, validators, totalSupply, totalStake, currentEpoch);

    progressCallback('Done!');

    return {
        data: {
            validators,
            stakedObjects,
            totalSupply,
            totalStake,
            currentEpoch,
        },
        stats,
    };
}

async function fetchStakedObjectsOfType(
    objectType: string,
    isTimelocked: boolean,
    stakedObjects: StakedObject[],
    progressCallback: (message: string) => void,
    isPaused: () => boolean,
    signal: AbortSignal,
    startingCursor: string | null = null,
): Promise<{ stakedObjects: StakedObject[]; cursor: string | null; paused: boolean }> {
    const existingIds = new Set(stakedObjects.map((obj) => obj.id));
    const gqlClient = new GraphQlClient(getSelectedNetworkConfig().graphql);

    const typeLabel = isTimelocked ? 'TimelockedStakedIota' : 'StakedIota';

    // Use provided cursor for resume
    let cursor: string | null = startingCursor;

    while (true) {
        if (isPaused()) {
            return { stakedObjects, cursor, paused: true };
        }

        if (signal.aborted) {
            return { stakedObjects, cursor, paused: true };
        }

        progressCallback(
            `Fetching ${typeLabel} objects (total ${stakedObjects.length} objects)...`,
        );

        const query = `query getStakedIota($type: String, $cursor: String) {
            objects(filter: {type: $type}, after: $cursor) {
                edges {
                    cursor
                    node {
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

        const edges = result.data.objects.edges || [];
        const objects = edges.map((edge: any) => edge.node);

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
                    // TimelockedStakedIota structure - has nested staked_iota object
                    const stakedIota = json.staked_iota;
                    if (!stakedIota) {
                        console.warn('No staked_iota field in timelocked object:', json);
                        continue;
                    }
                    poolId = stakedIota.pool_id || '';
                    stakeActivationEpoch = parseInt(stakedIota.stake_activation_epoch || '0');
                    principal = BigInt(stakedIota.principal?.value || stakedIota.principal || '0');
                } else {
                    // StakedIota structure - flat structure
                    poolId = json.pool_id || '';
                    stakeActivationEpoch = parseInt(json.stake_activation_epoch || '0');
                    principal = BigInt(json.principal?.value || json.principal || '0');
                }

                const objectId = json.id || node.address;
                if (objectId && existingIds.has(objectId)) {
                    continue;
                }

                if (!objectId) {
                    console.warn(`[${typeLabel}] Object missing ID:`, json);
                    continue;
                }

                const obj = {
                    id: objectId,
                    poolId,
                    stakeActivationEpoch,
                    principal,
                    ownerAddress,
                    isTimelocked,
                };

                stakedObjects.push(obj);
                existingIds.add(objectId);
            } catch (err) {
                console.warn('Error processing node:', err, node);
            }
        }

        const pageInfo = result.data.objects.pageInfo || {};
        const lastEdgeCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
        const nextCursor = pageInfo.endCursor || lastEdgeCursor || null;

        // Stop if no more pages
        if (!nextCursor || nextCursor === cursor) {
            break;
        }

        cursor = nextCursor;
    }

    progressCallback(`Fetched ${stakedObjects.length} ${typeLabel} objects.`);
    return { stakedObjects, cursor: null, paused: false };
}

async function queryGraphQL(
    gqlClient: GraphQlClient,
    query: string,
    variables: Record<string, any>,
): Promise<any> {
    const resultStr = await gqlClient.runQuery({
        query,
        variables: JSON.stringify(variables),
    });
    return JSON.parse(resultStr);
}

function computeStats(
    stakedObjects: StakedObject[],
    validators: ValidatorInfo[],
    totalSupply: bigint,
    totalStake: bigint,
    currentEpoch: number,
): DelegatorStats {
    // Create a map of poolId to validator
    const validatorMap = new Map<string, ValidatorInfo>();
    validators.forEach((v) => validatorMap.set(v.poolId, v));

    // Track amounts per validator using BigInt
    const validatorAmounts = new Map<string, bigint>();
    const validatorCounts = new Map<string, number>();
    const validatorTimelockedCounts = new Map<string, number>();
    const validatorDurations = new Map<string, number>();
    const validatorAddresses = new Map<string, Set<string>>();

    // Initialize maps
    validators.forEach((v) => {
        validatorAmounts.set(v.poolId, 0n);
        validatorCounts.set(v.poolId, 0);
        validatorTimelockedCounts.set(v.poolId, 0);
        validatorDurations.set(v.poolId, 0);
        validatorAddresses.set(v.poolId, new Set());
    });

    // Global stats
    let totalStakedAmount = 0n;
    let totalNormalStakedAmount = 0n;
    let totalTimelockedAmount = 0n;
    let totalStakeDuration = 0;
    let totalTimelockedCount = 0;
    const globalAddresses = new Set<string>();
    const stakedIotaAddresses = new Set<string>();
    const timelockedAddresses = new Set<string>();

    // Process each staked object
    stakedObjects.forEach((obj) => {
        const amount = obj.principal;
        const duration = currentEpoch - obj.stakeActivationEpoch;

        // Update validator stats if this poolId exists
        if (validatorAmounts.has(obj.poolId)) {
            validatorAmounts.set(obj.poolId, validatorAmounts.get(obj.poolId)! + amount);
            validatorCounts.set(obj.poolId, validatorCounts.get(obj.poolId)! + 1);
            validatorDurations.set(obj.poolId, validatorDurations.get(obj.poolId)! + duration);
            validatorAddresses.get(obj.poolId)?.add(obj.ownerAddress);

            if (obj.isTimelocked) {
                validatorTimelockedCounts.set(
                    obj.poolId,
                    validatorTimelockedCounts.get(obj.poolId)! + 1,
                );
            }
        }

        if (obj.isTimelocked) {
            totalTimelockedCount++;
            totalTimelockedAmount += amount;
            timelockedAddresses.add(obj.ownerAddress);
        } else {
            totalNormalStakedAmount += amount;
            stakedIotaAddresses.add(obj.ownerAddress);
        }

        globalAddresses.add(obj.ownerAddress);

        // Update global stats
        totalStakedAmount += amount;
        totalStakeDuration += duration;
    });

    // Finalize validator stats
    const validatorStatsList: ValidatorStats[] = [];
    validators.forEach((v) => {
        const poolId = v.poolId;
        const count = validatorCounts.get(poolId) || 0;
        const amount = validatorAmounts.get(poolId) || 0n;
        const duration = validatorDurations.get(poolId) || 0;
        const timelockedCount = validatorTimelockedCounts.get(poolId) || 0;
        const uniqueAddresses = validatorAddresses.get(poolId)?.size || 0;

        const averageStakedAmount = count > 0 ? Number(amount) / count : 0;
        const averageStakeDuration = count > 0 ? duration / count : 0;
        const stakePercentage = (Number(amount) / Number(totalSupply)) * 100;
        const systemStakePercentage =
            totalStake > 0n ? (Number(v.nextEpochStake) / Number(totalStake)) * 100 : 0;

        validatorStatsList.push({
            name: v.name,
            address: v.address,
            poolId: v.poolId,
            stakedObjectCount: count,
            timelockedObjectCount: timelockedCount,
            uniqueAddresses,
            totalStakedAmount: Number(amount),
            averageStakedAmount,
            averageStakeDuration,
            stakePercentage,
            systemStakePercentage,
        });
    });

    // Sort validators by total staked amount (descending)
    validatorStatsList.sort((a, b) => b.totalStakedAmount - a.totalStakedAmount);

    // Compute global stats
    const globalStats: GlobalStats = {
        totalStakedObjects: stakedObjects.filter((o) => !o.isTimelocked).length,
        totalTimelockedObjects: totalTimelockedCount,
        totalUniqueAddresses: globalAddresses.size,
        uniqueStakedIotaAddresses: stakedIotaAddresses.size,
        uniqueTimelockedAddresses: timelockedAddresses.size,
        totalStakedAmount: Number(totalStakedAmount),
        totalNormalStakedAmount: Number(totalNormalStakedAmount),
        totalTimelockedAmount: Number(totalTimelockedAmount),
        averageStakedAmount:
            stakedObjects.length > 0 ? Number(totalStakedAmount) / stakedObjects.length : 0,
        averageStakeDuration:
            stakedObjects.length > 0 ? totalStakeDuration / stakedObjects.length : 0,
        totalSupply,
        totalStakePercentage: (Number(totalStakedAmount) / Number(totalSupply)) * 100,
        totalSystemStakePercentage:
            totalStake > 0n ? (Number(totalStake) / Number(totalSupply)) * 100 : 0,
    };

    return {
        validators: validatorStatsList,
        global: globalStats,
    };
}

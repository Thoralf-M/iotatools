import {
    exchangeRateCache,
    fetchAllExchangeRates,
    fetchPoolExchangeRates,
    fetchSystemState,
    getExchangeRateCacheStats,
} from './graphql-requests';

export type StakeObject = {
    address: string;
    poolId: string;
    // Map of epoch -> principal amount
    principalByEpoch: Record<number, string>;
    // Map of epoch -> exchange rate
    exchangeRatesByEpoch: Record<number, { iota_amount: string; pool_token_amount: string }>;
    // Map of epoch -> new rewards earned in that specific epoch
    rewardsByEpoch: Record<number, string>;
    // Map of epoch -> total accumulated rewards since staking started
    accumulatedRewards: Record<number, string>;
    // Map of epoch -> action string ("Stake", "Unstake", "Transfer", "Transition")
    actionByEpoch?: Record<number, { action: string; digest?: string }>;
    firstEpoch: number;
    lastEpoch: number;
    stakeActivationEpoch: number;
};

export type ValidatorInfo = {
    name: string;
    poolId: string;
};

export type ProcessStakeTransactionsResult = {
    stakeObjects: StakeObject[];
    validatorInfo: Record<string, ValidatorInfo>;
};

// Helper function to calculate IOTA amount from pool tokens using exchange rate
function getIotaAmount(
    exchangeRate:
        | { iota_amount: string; pool_token_amount: string }
        | { iota: string; pool: string },
    tokenAmount: bigint,
): bigint {
    // Handle both formats - new cache format and GraphQL response format
    const iotaAmount =
        'iota' in exchangeRate ? BigInt(exchangeRate.iota) : BigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate ? BigInt(exchangeRate.pool) : BigInt(exchangeRate.pool_token_amount);

    // When either amount is 0, return the token amount (as per Move implementation)
    if (iotaAmount === 0n || poolTokenAmount === 0n) {
        return tokenAmount;
    }

    // Calculate: (iota_amount * token_amount) / pool_token_amount
    return (iotaAmount * tokenAmount) / poolTokenAmount;
}

// Helper function to get pool token amount from IOTA amount using exchange rate
function getTokenAmount(
    exchangeRate:
        | { iota_amount: string; pool_token_amount: string }
        | { iota: string; pool: string },
    iotaAmount: bigint,
): bigint {
    // Handle both formats - new cache format and GraphQL response format
    const iotaAmountBig =
        'iota' in exchangeRate ? BigInt(exchangeRate.iota) : BigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate ? BigInt(exchangeRate.pool) : BigInt(exchangeRate.pool_token_amount);

    // When either amount is 0, return the iota amount
    if (iotaAmountBig === 0n || poolTokenAmount === 0n) {
        return iotaAmount;
    }

    // Calculate: (pool_token_amount * iota_amount) / iota_amount_rate
    return (poolTokenAmount * iotaAmount) / iotaAmountBig;
}

// Compute rewards for a single stake object
async function computeRewardsForStakeObject(
    stakeObject: StakeObject,
    exchangeRateId: string,
): Promise<void> {
    const principalAmount = BigInt(Object.values(stakeObject.principalByEpoch)[0] || '0');

    // Get all epochs with exchange rates, sorted chronologically
    const epochs = Object.keys(stakeObject.exchangeRatesByEpoch)
        .map(Number)
        .sort((a, b) => a - b);

    let previousAccumulatedRewards = 0n;

    // For each epoch where we have exchange rates, compute rewards
    for (const epoch of epochs) {
        const exchangeRate = stakeObject.exchangeRatesByEpoch[epoch];

        try {
            // Get exchange rate at staking epoch (activation epoch)
            let preStakingEpoch = stakeObject.stakeActivationEpoch - 1;
            let preStakingEpochExchangeRate = stakeObject.exchangeRatesByEpoch[preStakingEpoch];

            // If we don't have the pre staking epoch exchange rate, fetch it or use 1:1 ratio
            if (!preStakingEpochExchangeRate) {
                // Try to fetch the exchange rate for the staking epoch
                try {
                    const fetchedRate = await fetchPoolExchangeRates(
                        exchangeRateId,
                        preStakingEpoch,
                        stakeObject.poolId,
                        true,
                    );
                    if (fetchedRate) {
                        preStakingEpochExchangeRate = fetchedRate;
                        stakeObject.exchangeRatesByEpoch[preStakingEpoch] = fetchedRate;
                    } else {
                        // Fallback to 1:1 ratio
                        preStakingEpochExchangeRate = {
                            iota_amount: '1',
                            pool_token_amount: '1',
                        };
                    }
                } catch (err) {
                    console.warn(
                        `Failed to fetch exchange rate for pre staking epoch ${preStakingEpoch}, using 1:1 ratio`,
                    );
                    preStakingEpochExchangeRate = {
                        iota_amount: '1',
                        pool_token_amount: '1',
                    };
                }
            }

            // Step 1: Calculate pool token withdraw amount using exchange rate at pre staking epoch
            const poolTokenWithdrawAmount = getTokenAmount(
                preStakingEpochExchangeRate,
                principalAmount,
            );

            // Step 2: Calculate total IOTA withdraw amount using current epoch exchange rate
            const totalIotaWithdrawAmount = getIotaAmount(exchangeRate, poolTokenWithdrawAmount);

            // Step 3: Calculate total accumulated rewards (total - principal, but not less than 0)
            const currentAccumulatedRewards =
                totalIotaWithdrawAmount > principalAmount
                    ? totalIotaWithdrawAmount - principalAmount
                    : 0n;

            // Step 4: Calculate new rewards for this epoch (difference from previous accumulated)
            const newEpochRewards =
                currentAccumulatedRewards > previousAccumulatedRewards
                    ? currentAccumulatedRewards - previousAccumulatedRewards
                    : 0n;
            // if (epoch == stakeObject.stakeActivationEpoch || epoch == stakeObject.stakeActivationEpoch + 1 || epoch == stakeObject.stakeActivationEpoch + 2) {
            //     console.log(`epoch: ${epoch}`)
            //     console.log("preStakingEpochExchangeRate", preStakingEpochExchangeRate);
            //     console.log("exchangeRate", exchangeRate);
            //     console.log(`principalAmount: ${principalAmount}`)
            //     console.log(`poolTokenWithdrawAmount: ${poolTokenWithdrawAmount}`)
            //     console.log(`totalIotaWithdrawAmount: ${totalIotaWithdrawAmount}`)
            //     console.log(`currentAccumulatedRewards: ${currentAccumulatedRewards}`)
            //     console.log(`previousAccumulatedRewards: ${previousAccumulatedRewards}`)
            //     console.log(`newEpochRewards: ${newEpochRewards}`)
            // }
            // Store both accumulated and epoch-specific rewards
            // If action for this epoch is 'Unstaked', set rewards to '0'
            if (
                stakeObject.actionByEpoch &&
                stakeObject.actionByEpoch[epoch]?.action === 'Unstaked'
            ) {
                stakeObject.accumulatedRewards[epoch] = '0';
                stakeObject.rewardsByEpoch[epoch] = '0';
            } else {
                stakeObject.accumulatedRewards[epoch] = currentAccumulatedRewards.toString();
                stakeObject.rewardsByEpoch[epoch] = newEpochRewards.toString();
            }

            // Update previous accumulated rewards for next iteration
            previousAccumulatedRewards = currentAccumulatedRewards;
        } catch (err) {
            console.error(`Error computing rewards for epoch ${epoch}:`, err);
            stakeObject.accumulatedRewards[epoch] = previousAccumulatedRewards.toString();
            stakeObject.rewardsByEpoch[epoch] = '0';
        }
    }
}

function getCurrentActiveValidatorsExchangeRateIds(systemState: any): Record<string, string> {
    // console.log("systemState", systemState);
    const validatorMap: Record<string, string> = {};
    const activeValidators = systemState?.json?.validators?.active_validators || [];
    for (const validator of activeValidators) {
        const poolId = validator?.staking_pool?.id;
        const exchangeRateId = validator?.staking_pool?.exchange_rates?.id;
        if (poolId && exchangeRateId) {
            validatorMap[poolId] = exchangeRateId;
        }
    }
    return validatorMap;
}

function getValidatorInfo(systemState: any): Record<string, { name: string; poolId: string }> {
    const validatorInfo: Record<string, { name: string; poolId: string }> = {};
    const activeValidators = systemState?.json?.validators?.active_validators || [];
    for (const validator of activeValidators) {
        const poolId = validator?.staking_pool?.id;
        const name = validator?.metadata?.name || 'Unknown Validator';
        if (poolId) {
            validatorInfo[poolId] = { name, poolId };
        }
    }
    return validatorInfo;
}

export async function processStakeTransactionsWithExchangeRates(
    transactions: Array<any>,
    currentEpoch: number,
): Promise<ProcessStakeTransactionsResult> {
    // Get system state to map pool IDs to exchange rate IDs
    const systemState = (await fetchSystemState())[0];
    // TODO: handle inactive validators
    const validatorMap = getCurrentActiveValidatorsExchangeRateIds(systemState);
    const validatorInfo = getValidatorInfo(systemState);

    const stakeObjects = new Map<string, StakeObject>();

    // Process transactions to build stake objects first
    transactions.forEach((transaction) => {
        const epochId = transaction.effects.epoch.epochId;
        const digest = transaction.digest;
        transaction.effects.objectChanges.nodes.forEach((node: any) => {
            const address = node.address;
            const outputState = node.outputState?.asMoveObject?.contents;
            const inputState = node.inputState?.asMoveObject?.contents;
            let poolId: string | undefined = undefined;
            let principal: string | undefined = undefined;
            let stakeActivationEpoch: string | undefined = undefined;

            // Track poolId, principal, stakeActivationEpoch for stake object creation
            if (outputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
                const stakedIota = outputState.json?.staked_iota;
                poolId = stakedIota?.pool_id ?? '';
                principal = stakedIota?.principal?.value ?? '';
                stakeActivationEpoch = stakedIota?.stake_activation_epoch ?? '';
            } else if (outputState?.type?.repr?.includes('staking_pool::StakedIota')) {
                poolId = outputState.json?.pool_id ?? '';
                principal = outputState.json?.principal?.value ?? '';
                stakeActivationEpoch = outputState.json?.stake_activation_epoch ?? '';
            }

            if (poolId && principal && stakeActivationEpoch) {
                if (!stakeObjects.has(address)) {
                    stakeObjects.set(address, {
                        address,
                        poolId,
                        principalByEpoch: {},
                        exchangeRatesByEpoch: {},
                        rewardsByEpoch: {},
                        accumulatedRewards: {},
                        actionByEpoch: {},
                        firstEpoch: epochId,
                        lastEpoch: currentEpoch,
                        stakeActivationEpoch: parseInt(stakeActivationEpoch),
                    });
                }
                const obj = stakeObjects.get(address)!;
                obj.principalByEpoch[epochId] = principal;
                obj.rewardsByEpoch[epochId] = '0';
                obj.accumulatedRewards[epochId] = '0';
            }

            // Handle deletion/transfer
            let inputPoolId: string = '';
            let inputOwner: string | undefined = undefined;
            let outputOwner: string | undefined = undefined;
            let inputAction: string | undefined = undefined;
            if (inputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
                const stakedIota = inputState.json?.staked_iota;
                inputPoolId = stakedIota?.pool_id ?? '';
                inputOwner = node.inputState.asMoveObject?.owner?.owner?.address ?? undefined;
            } else if (inputState?.type?.repr?.includes('staking_pool::StakedIota')) {
                inputPoolId = inputState.json?.pool_id ?? '';
                inputOwner = node.inputState.asMoveObject?.owner?.owner?.address ?? undefined;
            }
            if (outputState) {
                outputOwner = node.outputState.asMoveObject?.owner?.owner?.address ?? undefined;
            }

            // Action detection using idCreated, idDeleted, and owner comparison
            const idCreated = node.idCreated === true;
            const idDeleted = node.idDeleted === true;

            if (inputPoolId) {
                const existing = stakeObjects.get(address);
                if (existing) {
                    if (idCreated) {
                        inputAction = 'Staked';
                    } else if (idDeleted) {
                        inputAction = 'Unstaked';
                        existing.lastEpoch = epochId;
                    } else if (!idCreated && !idDeleted) {
                        if (inputOwner && outputOwner && inputOwner !== outputOwner) {
                            inputAction = 'Transfer';
                            existing.lastEpoch = epochId;
                        } else {
                            inputAction = 'Transition';
                        }
                    }
                    existing.actionByEpoch = existing.actionByEpoch || {};
                    existing.actionByEpoch[epochId] = {
                        action: inputAction ?? 'Unknown',
                        digest,
                    };
                }
            }
        });
    });

    // Extract the required pool IDs from stake objects
    const requiredPoolIds = new Set<string>();
    stakeObjects.forEach((stakeObject) => {
        requiredPoolIds.add(stakeObject.poolId);
    });

    console.log(
        `Found ${stakeObjects.size} stake objects requiring exchange rates for ${requiredPoolIds.size} pools`,
    );

    // Now fetch exchange rates for the required pools only
    await fetchAllExchangeRates(currentEpoch, requiredPoolIds); // Now fetch exchange rates for all active epochs and fill in missing principal entries
    const stakeObjectsArray = Array.from(stakeObjects.values());

    for (const stakeObject of stakeObjectsArray) {
        const exchangeRateId = validatorMap[stakeObject.poolId];
        if (!exchangeRateId) {
            console.warn(`No exchange rate ID found for pool ${stakeObject.poolId}`);
            continue;
        }

        // Generate all epochs where this stake object was active
        // Include the stake activation epoch itself, as that's where the principal is established
        const activeEpochs: number[] = [];
        for (
            let epoch = stakeObject.stakeActivationEpoch;
            epoch <= stakeObject.lastEpoch;
            epoch++
        ) {
            activeEpochs.push(epoch);
        }

        // Fill in missing principal entries by carrying forward the previous epoch's value
        // First, find the initial principal amount from any existing epoch
        let lastKnownPrincipal: string | undefined;
        const existingEpochs = Object.keys(stakeObject.principalByEpoch)
            .map(Number)
            .sort((a, b) => a - b);
        if (existingEpochs.length > 0) {
            lastKnownPrincipal = stakeObject.principalByEpoch[existingEpochs[0]];
        }

        // Fill in all active epochs with principal amounts
        for (const epoch of activeEpochs) {
            if (stakeObject.principalByEpoch[epoch]) {
                // Update the last known principal if we have a value for this epoch
                lastKnownPrincipal = stakeObject.principalByEpoch[epoch];
            } else if (lastKnownPrincipal) {
                // If no entry exists for this epoch, carry forward the last known value
                stakeObject.principalByEpoch[epoch] = lastKnownPrincipal;
                stakeObject.rewardsByEpoch[epoch] = '0';
                stakeObject.accumulatedRewards[epoch] = '0';
            }
        }

        // Fetch exchange rates for epochs where rewards are earned (stakeActivationEpoch onwards)
        const rewardEpochs = activeEpochs.filter(
            (epoch) => epoch >= stakeObject.stakeActivationEpoch,
        );
        for (const epoch of rewardEpochs) {
            if (epoch == currentEpoch) {
                continue; // Skip current epoch as we don't have exchange rates for it yet
            }
            try {
                const exchangeRates = await fetchPoolExchangeRates(
                    exchangeRateId,
                    epoch,
                    stakeObject.poolId,
                );
                if (exchangeRates) {
                    stakeObject.exchangeRatesByEpoch[epoch] = exchangeRates;
                }
            } catch (err) {
                console.error(
                    `Error fetching exchange rates for poolId ${stakeObject.poolId}, epoch ${epoch}:`,
                    err,
                );
            }
        }

        // Compute rewards for each epoch
        await computeRewardsForStakeObject(stakeObject, exchangeRateId);
    }

    // Log the entire cache for copying to a JSON file
    const cacheArray = Array.from(exchangeRateCache.values());
    const cacheStats = getExchangeRateCacheStats();

    console.log('=== EXCHANGE RATE CACHE DATA ===');
    console.log('Cache Statistics:', cacheStats);
    console.log('Copy this data to a JSON file for initial cache loading:');
    console.log(JSON.stringify(cacheArray, null, 2));
    console.log('=== END CACHE DATA ===');

    return {
        stakeObjects: stakeObjectsArray,
        validatorInfo,
    };
}

// Helper function to get total accumulated rewards for a stake object (latest accumulated value)
export function getTotalAccumulatedRewards(stakeObject: StakeObject): string {
    const epochs = Object.keys(stakeObject.accumulatedRewards)
        .map(Number)
        .sort((a, b) => b - a);
    if (epochs.length === 0) return '0';
    return stakeObject.accumulatedRewards[epochs[0]] || '0';
}

// Helper function to calculate total rewards earned across all epochs (sum of epoch-specific rewards)
export function calculateTotalRewards(stakeObject: StakeObject): string {
    let totalRewards = 0n;
    for (const rewardStr of Object.values(stakeObject.rewardsByEpoch)) {
        totalRewards += BigInt(rewardStr);
    }
    return totalRewards.toString();
}

// Helper function to get the latest epoch-specific rewards for a stake object
export function getLatestEpochRewards(stakeObject: StakeObject): string {
    const epochs = Object.keys(stakeObject.rewardsByEpoch)
        .map(Number)
        .sort((a, b) => b - a);
    if (epochs.length === 0) return '0';
    return stakeObject.rewardsByEpoch[epochs[0]] || '0';
}

// Helper function to get the latest accumulated rewards for a stake object (from the most recent epoch)
export function getLatestAccumulatedRewards(stakeObject: StakeObject): string {
    const epochs = Object.keys(stakeObject.accumulatedRewards)
        .map(Number)
        .sort((a, b) => b - a);
    if (epochs.length === 0) return '0';
    return stakeObject.accumulatedRewards[epochs[0]] || '0';
}

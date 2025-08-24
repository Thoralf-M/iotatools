import {
    exchangeRateCache,
    fetchAllExchangeRates,
    fetchPoolExchangeRates,
    fetchSystemState,
    getExchangeRateCacheStats,
} from './graphql-requests';

// Helper function to safely convert to BigInt
function safeBigInt(value: any): bigint {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') {
        try {
            return BigInt(value);
        } catch (e) {
            console.warn(`Failed to convert "${value}" to BigInt:`, e);
            return 0n;
        }
    }
    if (typeof value === 'object' && value?.value) {
        return safeBigInt(value.value);
    }
    console.warn(`Cannot convert ${typeof value} to BigInt:`, value);
    return 0n;
}

export type ActionDetails = {
    action: string;
    digest: string;
    // For Staked and Unstaked actions
    amount?: string;
    totalRewards?: string;
    // For Transfer actions
    fromAddress?: string;
    toAddress?: string;
    // For Transition actions (stake object merges/splits)
    principalChange?: {
        from: string;
        to: string;
    };
    mergedStakeObjects?: Array<{ objectId: string; amount: string }>;
    splitStakeObjects?: Array<{ objectId: string; amount: string }>;
};

export type StakeObject = {
    objectId: string;
    wasOwnedByTargetAddress: boolean;
    poolId: string;
    // Map of epoch -> principal amount
    principalByEpoch: Record<number, string>;
    // Map of epoch -> exchange rate
    exchangeRatesByEpoch: Record<number, { iota_amount: string; pool_token_amount: string }>;
    // Map of epoch -> new rewards earned in that specific epoch
    rewardsByEpoch: Record<number, string>;
    // Map of epoch -> total accumulated rewards since staking started
    accumulatedRewards: Record<number, string>;
    // Map of epoch -> detailed action information
    actionByEpoch?: Record<number, ActionDetails>;
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
        'iota' in exchangeRate
            ? safeBigInt(exchangeRate.iota)
            : safeBigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate
            ? safeBigInt(exchangeRate.pool)
            : safeBigInt(exchangeRate.pool_token_amount);

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
        'iota' in exchangeRate
            ? safeBigInt(exchangeRate.iota)
            : safeBigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate
            ? safeBigInt(exchangeRate.pool)
            : safeBigInt(exchangeRate.pool_token_amount);

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
    // Get all epochs with exchange rates, sorted chronologically
    const epochs = Object.keys(stakeObject.exchangeRatesByEpoch)
        .map(Number)
        .sort((a, b) => a - b);

    let previousAccumulatedRewards = 0n;
    const baselineEpoch = stakeObject.stakeActivationEpoch - 1; // Always use the original baseline epoch

    // Get the baseline exchange rate (from before staking started)
    let baselineExchangeRate = stakeObject.exchangeRatesByEpoch[baselineEpoch];

    // If we don't have the baseline epoch exchange rate, fetch it or use 1:1 ratio
    if (!baselineExchangeRate) {
        // Try to fetch the exchange rate for the baseline epoch
        try {
            const fetchedRate = await fetchPoolExchangeRates(
                exchangeRateId,
                baselineEpoch,
                stakeObject.poolId,
                true,
            );
            if (fetchedRate) {
                baselineExchangeRate = fetchedRate;
                stakeObject.exchangeRatesByEpoch[baselineEpoch] = fetchedRate;
            } else {
                // Fallback to 1:1 ratio
                baselineExchangeRate = {
                    iota_amount: '1',
                    pool_token_amount: '1',
                };
            }
        } catch (err) {
            console.warn(
                `Failed to fetch exchange rate for baseline epoch ${baselineEpoch}, using 1:1 ratio`,
            );
            baselineExchangeRate = {
                iota_amount: '1',
                pool_token_amount: '1',
            };
        }
    }

    // For each epoch where we have exchange rates, compute rewards
    let previousPrincipal = 0n;
    for (const epoch of epochs) {
        const principalAmount = safeBigInt(stakeObject.principalByEpoch[epoch] || '0');
        const exchangeRate = stakeObject.exchangeRatesByEpoch[epoch];

        try {
            // Check if this is a transition epoch (principal amount changed)
            const isTransitionEpoch =
                previousPrincipal !== 0n && principalAmount !== previousPrincipal;

            // Step 1: Calculate pool token withdraw amount using exchange rate at original baseline epoch
            // This ensures that even if principal changes, we still use the original baseline
            const poolTokenWithdrawAmount = getTokenAmount(baselineExchangeRate, principalAmount);

            // Step 2: Calculate total IOTA withdraw amount using current epoch exchange rate
            const totalIotaWithdrawAmount = getIotaAmount(exchangeRate, poolTokenWithdrawAmount);

            // Step 3: Calculate total accumulated rewards (total - principal, but not less than 0)
            const currentAccumulatedRewards =
                totalIotaWithdrawAmount > principalAmount
                    ? totalIotaWithdrawAmount - principalAmount
                    : 0n;

            let newEpochRewards: bigint;

            if (isTransitionEpoch) {
                // In transition epoch, we need to calculate the rewards more carefully
                // The currentAccumulatedRewards is for the new principal amount
                // But we need to subtract what would have been accumulated with the new principal
                // in previous epochs to get just the rewards for this epoch

                // Calculate what the accumulated rewards would have been for the new principal
                // in the previous epoch using the previous epoch's exchange rate
                const previousEpoch = epoch - 1;
                const previousExchangeRate = stakeObject.exchangeRatesByEpoch[previousEpoch];

                if (previousExchangeRate) {
                    const previousPoolTokenAmount = getTokenAmount(
                        baselineExchangeRate,
                        principalAmount,
                    );
                    const previousTotalIotaAmount = getIotaAmount(
                        previousExchangeRate,
                        previousPoolTokenAmount,
                    );
                    const previousAccumulatedForNewPrincipal =
                        previousTotalIotaAmount > principalAmount
                            ? previousTotalIotaAmount - principalAmount
                            : 0n;

                    // The new epoch rewards should be the difference
                    newEpochRewards =
                        currentAccumulatedRewards > previousAccumulatedForNewPrincipal
                            ? currentAccumulatedRewards - previousAccumulatedForNewPrincipal
                            : 0n;
                } else {
                    // Fallback: if we don't have previous epoch exchange rate, use current accumulated
                    newEpochRewards = currentAccumulatedRewards;
                }

                // Reset previous accumulated rewards to handle the principal change
                previousAccumulatedRewards = 0n;
            } else {
                // Step 4: Calculate new rewards for this epoch (difference from previous accumulated)
                newEpochRewards =
                    currentAccumulatedRewards > previousAccumulatedRewards
                        ? currentAccumulatedRewards - previousAccumulatedRewards
                        : 0n;
            }

            // console.log(`epoch: ${epoch}`)
            // console.log("baselineExchangeRate", baselineExchangeRate);
            // console.log("exchangeRate", exchangeRate);
            // console.log(`principalAmount: ${principalAmount}`)
            // console.log(`poolTokenWithdrawAmount: ${poolTokenWithdrawAmount}`)
            // console.log(`totalIotaWithdrawAmount: ${totalIotaWithdrawAmount}`)
            // console.log(`currentAccumulatedRewards: ${currentAccumulatedRewards}`)
            // console.log(`previousAccumulatedRewards: ${previousAccumulatedRewards}`)
            // console.log(`newEpochRewards: ${newEpochRewards}`)

            // Store both accumulated and epoch-specific rewards
            // If action for this epoch is 'Unstaked', set rewards to '0' but record total rewards
            if (
                stakeObject.actionByEpoch &&
                stakeObject.actionByEpoch[epoch]?.action === 'Unstaked'
            ) {
                // Update the action with total rewards at unstaking, epoch -1 because there are only rewards for full epochs.
                // So epoch in which the unstake tx is, will not receive rewards
                stakeObject.actionByEpoch[epoch].totalRewards =
                    stakeObject.accumulatedRewards[epoch - 1];
                stakeObject.accumulatedRewards[epoch] = '0';
                stakeObject.rewardsByEpoch[epoch] = '0';
            } else {
                stakeObject.accumulatedRewards[epoch] = currentAccumulatedRewards.toString();
                stakeObject.rewardsByEpoch[epoch] = newEpochRewards.toString();
            }

            // Update previous accumulated rewards for next iteration
            previousAccumulatedRewards = currentAccumulatedRewards;
            previousPrincipal = principalAmount;
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
    targetAddress: string,
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

        // Collect all stake-related object changes in this transaction for merge/split detection
        const txStakeObjects = new Map<
            string,
            {
                input?: {
                    poolId: string;
                    principal: string;
                    owner?: string;
                    stakeActivationEpoch?: string;
                };
                output?: {
                    poolId: string;
                    principal: string;
                    owner?: string;
                    stakeActivationEpoch?: string;
                };
                idCreated: boolean;
                idDeleted: boolean;
            }
        >();

        // Collect all coin objects created in this transaction (potential unstake rewards)
        const coinObjects: Array<{ address: string; balance: string; owner?: string }> = [];

        // First pass: collect all stake object changes and coin objects
        transaction.effects.objectChanges.nodes.forEach((node: any) => {
            const address = node.address;
            const outputState = node.outputState?.asMoveObject?.contents;
            const inputState = node.inputState?.asMoveObject?.contents;
            const idCreated = node.idCreated === true;
            const idDeleted = node.idDeleted === true;

            // Collect coin objects that were created (potential unstake rewards)
            if (idCreated && outputState?.type?.repr?.includes('::coin::Coin')) {
                let balance = outputState.json?.balance;
                // Handle balance as either string or object with value property
                if (typeof balance === 'object' && balance?.value) {
                    balance = balance.value;
                }
                const owner = node.outputState?.asMoveObject?.owner?.owner?.address;
                if (balance && owner && typeof balance === 'string') {
                    coinObjects.push({ address, balance, owner });
                }
            }

            const stakeData: any = {};

            // Extract input state data
            if (inputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
                const stakedIota = inputState.json?.staked_iota;
                stakeData.input = {
                    poolId: stakedIota?.pool_id ?? '',
                    principal: stakedIota?.principal?.value ?? '',
                    owner: node.inputState.asMoveObject?.owner?.owner?.address,
                    stakeActivationEpoch: stakedIota?.stake_activation_epoch,
                };
            } else if (inputState?.type?.repr?.includes('staking_pool::StakedIota')) {
                stakeData.input = {
                    poolId: inputState.json?.pool_id ?? '',
                    principal: inputState.json?.principal?.value ?? '',
                    owner: node.inputState.asMoveObject?.owner?.owner?.address,
                    stakeActivationEpoch: inputState.json?.stake_activation_epoch,
                };
            }

            // Extract output state data
            if (outputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
                const stakedIota = outputState.json?.staked_iota;
                stakeData.output = {
                    poolId: stakedIota?.pool_id ?? '',
                    principal: stakedIota?.principal?.value ?? '',
                    owner: node.outputState.asMoveObject?.owner?.owner?.address,
                    stakeActivationEpoch: stakedIota?.stake_activation_epoch,
                };
            } else if (outputState?.type?.repr?.includes('staking_pool::StakedIota')) {
                stakeData.output = {
                    poolId: outputState.json?.pool_id ?? '',
                    principal: outputState.json?.principal?.value ?? '',
                    owner: node.outputState.asMoveObject?.owner?.owner?.address,
                    stakeActivationEpoch: outputState.json?.stake_activation_epoch,
                };
            }

            if (stakeData.input || stakeData.output) {
                txStakeObjects.set(address, {
                    ...stakeData,
                    idCreated,
                    idDeleted,
                });
            }
        });

        // Second pass: process each stake object and determine detailed actions
        txStakeObjects.forEach((stakeData, address) => {
            const { input, output, idCreated, idDeleted } = stakeData;

            // Check if this object was ever owned by the target address
            const wasOwnedByTarget =
                input?.owner === targetAddress || output?.owner === targetAddress;

            // Create or update stake objects based on output state
            if (output) {
                if (!stakeObjects.has(address)) {
                    stakeObjects.set(address, {
                        objectId: address,
                        wasOwnedByTargetAddress: wasOwnedByTarget,
                        poolId: output.poolId,
                        principalByEpoch: {},
                        exchangeRatesByEpoch: {},
                        rewardsByEpoch: {},
                        accumulatedRewards: {},
                        actionByEpoch: {},
                        firstEpoch: epochId,
                        lastEpoch: currentEpoch,
                        stakeActivationEpoch: output.stakeActivationEpoch
                            ? parseInt(output.stakeActivationEpoch)
                            : epochId,
                    });
                } else {
                    // Update the flag if this transaction shows target ownership
                    const existing = stakeObjects.get(address)!;
                    if (wasOwnedByTarget) {
                        existing.wasOwnedByTargetAddress = true;
                    }
                    // Preserve the original firstEpoch - only update if this epoch is earlier
                    if (epochId < existing.firstEpoch) {
                        existing.firstEpoch = epochId;
                    }
                }
                const obj = stakeObjects.get(address)!;
                obj.principalByEpoch[epochId] = output.principal;
                obj.rewardsByEpoch[epochId] = '0';
                obj.accumulatedRewards[epochId] = '0';

                // Update stakeActivationEpoch if we have the real value
                if (output.stakeActivationEpoch) {
                    obj.stakeActivationEpoch = parseInt(output.stakeActivationEpoch);
                }
            }

            // Determine action type and create detailed action info
            if (input) {
                // Check if this object was ever owned by the target address
                const wasOwnedByTarget =
                    input?.owner === targetAddress || output?.owner === targetAddress;

                // If this is an input-only object (no output), we still need to track it
                // if it was owned by the target address
                if (!output && wasOwnedByTarget) {
                    if (!stakeObjects.has(address)) {
                        stakeObjects.set(address, {
                            objectId: address,
                            wasOwnedByTargetAddress: true,
                            poolId: input.poolId,
                            principalByEpoch: {},
                            exchangeRatesByEpoch: {},
                            rewardsByEpoch: {},
                            accumulatedRewards: {},
                            actionByEpoch: {},
                            firstEpoch: epochId,
                            lastEpoch: epochId, // This object ends in this epoch
                            stakeActivationEpoch: input.stakeActivationEpoch
                                ? parseInt(input.stakeActivationEpoch)
                                : epochId,
                        });
                    } else {
                        // Update the flag if this transaction shows target ownership
                        const existing = stakeObjects.get(address)!;
                        existing.wasOwnedByTargetAddress = true;
                        // For input-only transactions, this might be the final epoch for this object
                        // But preserve the firstEpoch - only update lastEpoch
                        existing.lastEpoch = epochId;
                    }
                }

                const existing = stakeObjects.get(address);
                if (existing) {
                    // Update the flag if this transaction shows target ownership
                    if (wasOwnedByTarget) {
                        existing.wasOwnedByTargetAddress = true;
                    }

                    let actionDetails: ActionDetails = {
                        action: 'Unknown',
                        digest,
                    };

                    if (idCreated) {
                        actionDetails.action = 'Staked';
                        actionDetails.amount = output?.principal || input.principal;
                    } else if (idDeleted) {
                        actionDetails.action = 'Unstaked';
                        actionDetails.amount = input.principal;
                        // Calculate total rewards at this point (will be filled later after exchange rate processing)
                        actionDetails.totalRewards = '0'; // Placeholder
                        existing.lastEpoch = epochId;
                    } else if (!idCreated && !idDeleted) {
                        if (input.owner && output?.owner && input.owner !== output.owner) {
                            actionDetails.action = 'Transfer';
                            actionDetails.fromAddress = input.owner;
                            actionDetails.toAddress = output.owner;
                            // Only set lastEpoch if transferring AWAY from target address
                            // If transferring TO target address, keep tracking until current epoch
                            if (input.owner === targetAddress && output.owner !== targetAddress) {
                                existing.lastEpoch = epochId;
                            } else if (output.owner === targetAddress) {
                                // Transferring TO target address - continue tracking until current epoch
                                existing.lastEpoch = currentEpoch;
                            }
                        } else {
                            // Check if this is a partial unstake
                            const inputPrincipal = safeBigInt(input.principal);
                            const outputPrincipal = safeBigInt(output?.principal || '0');
                            const principalDecrease = inputPrincipal - outputPrincipal;

                            // Find coins created for this owner in this transaction
                            const ownerCoins = coinObjects.filter(
                                (coin) => coin.owner === input.owner,
                            );
                            const totalCoinBalance = ownerCoins.reduce((sum, coin) => {
                                return sum + safeBigInt(coin.balance);
                            }, 0n);

                            if (principalDecrease > 0n && ownerCoins.length > 0) {
                                // This is a partial unstake
                                actionDetails.action = 'Partial Unstake';
                                actionDetails.amount = principalDecrease.toString(); // Amount unstaked

                                // Calculate rewards: total coins received minus principal decrease
                                const rewards = totalCoinBalance - principalDecrease;
                                if (rewards > 0n) {
                                    actionDetails.totalRewards = rewards.toString();
                                }

                                // Record principal change
                                actionDetails.principalChange = {
                                    from: input.principal,
                                    to: output?.principal || '0',
                                };
                            } else {
                                actionDetails.action = 'Transition';

                                // Check for principal changes
                                if (input.principal !== output?.principal) {
                                    actionDetails.principalChange = {
                                        from: input.principal,
                                        to: output?.principal || '0',
                                    };
                                }
                            }

                            // Detect merged stake objects (deleted objects in this transaction)
                            const mergedObjects: Array<{ objectId: string; amount: string }> = [];
                            const splitObjects: Array<{ objectId: string; amount: string }> = [];

                            txStakeObjects.forEach((otherStakeData, otherAddress) => {
                                if (otherAddress !== address) {
                                    if (otherStakeData.idDeleted && otherStakeData.input) {
                                        // This object was deleted and merged into our current object
                                        mergedObjects.push({
                                            objectId: otherAddress,
                                            amount: otherStakeData.input.principal,
                                        });
                                    } else if (otherStakeData.idCreated && otherStakeData.output) {
                                        // This object was created, potentially split from our current object
                                        splitObjects.push({
                                            objectId: otherAddress,
                                            amount: otherStakeData.output.principal,
                                        });
                                    }
                                }
                            });

                            if (mergedObjects.length > 0) {
                                actionDetails.mergedStakeObjects = mergedObjects;
                            }
                            if (splitObjects.length > 0) {
                                actionDetails.splitStakeObjects = splitObjects;
                            }
                        }
                    }

                    existing.actionByEpoch = existing.actionByEpoch || {};
                    existing.actionByEpoch[epochId] = actionDetails;
                }
            }
        });
    });

    // Extract the required pool IDs from stake objects, but only for objects owned by target address
    const requiredPoolIds = new Set<string>();
    const ownedStakeObjects = new Map<string, StakeObject>();

    stakeObjects.forEach((stakeObject, address) => {
        // Check if this stake object was ever owned by the target address
        if (stakeObject.wasOwnedByTargetAddress) {
            ownedStakeObjects.set(address, stakeObject);
            requiredPoolIds.add(stakeObject.poolId);
        }
    });

    console.log(
        `Found ${ownedStakeObjects.size} owned stake objects (filtered from ${stakeObjects.size} total) requiring exchange rates for ${requiredPoolIds.size} pools`,
    );

    // Now fetch exchange rates for the required pools only
    await fetchAllExchangeRates(currentEpoch, requiredPoolIds);

    // Use the filtered stake objects for the rest of the processing
    const stakeObjectsArray = Array.from(ownedStakeObjects.values());

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
        totalRewards += safeBigInt(rewardStr);
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

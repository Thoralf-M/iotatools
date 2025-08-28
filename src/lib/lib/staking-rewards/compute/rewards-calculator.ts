import { fetchPoolExchangeRates } from '../graphql-requests';
import type { StakeObject } from './types';
import { getIotaAmount, getTokenAmount, safeBigInt } from './utils';

// Compute rewards for a single stake object
export async function computeRewardsForStakeObject(
    stakeObject: StakeObject,
    exchangeRateId: string,
): Promise<void> {
    // Get all epochs with exchange rates, sorted chronologically, but only up to lastEpoch
    const epochs = Object.keys(stakeObject.exchangeRatesByEpoch)
        .map(Number)
        .filter((epoch) => epoch <= stakeObject.lastEpoch)
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

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
        } catch {
            console.warn(
                `Failed to fetch exchange rate for baseline epoch ${baselineEpoch}, using 1:1 ratio`,
            );
            baselineExchangeRate = {
                iota_amount: '1',
                pool_token_amount: '1',
            };
        }
    }

    const accumulatedAtFirst = safeBigInt(
        stakeObject.accumulatedRewards[stakeObject.firstEpoch] || '0',
    );

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
            let currentAccumulatedRewards =
                totalIotaWithdrawAmount > principalAmount
                    ? totalIotaWithdrawAmount - principalAmount
                    : 0n;

            // Adjust for net accumulated from firstEpoch
            currentAccumulatedRewards -= accumulatedAtFirst;

            // For stakes not owned from the beginning (unlocked/transferred), initialize
            // previousAccumulatedRewards on the first owned epoch so we don't attribute
            // pre-ownership accumulated rewards to this epoch. The old object (timelocked or
            // previous owner) earns rewards for this epoch, so the new one yields 0 here.
            if (
                previousAccumulatedRewards === 0n &&
                epoch === stakeObject.firstEpoch &&
                stakeObject.firstEpoch > stakeObject.stakeActivationEpoch
            ) {
                previousAccumulatedRewards = currentAccumulatedRewards;
            }

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
            if (epoch >= stakeObject.firstEpoch) {
                // Check if any action in this epoch is 'Unstaked'
                const epochActions = stakeObject.actionByEpoch?.[epoch] || [];
                const unstakeAction = epochActions.find((a) => a.action === 'Unstaked');
                if (unstakeAction) {
                    // If totalRewards was already calculated in processor.ts, keep it
                    // Otherwise calculate here (backwards compatibility)
                    if (!unstakeAction.totalRewards || unstakeAction.totalRewards === '0') {
                        // Calculate rewards using the unstaked principal amount
                        // Use the previous epoch's exchange rate since you don't earn
                        // rewards for the unstake epoch itself
                        const unstakePrincipal = safeBigInt(unstakeAction.amount || '0');
                        const prevExchangeRate = stakeObject.exchangeRatesByEpoch[epoch - 1];

                        if (prevExchangeRate && unstakePrincipal > 0n) {
                            const poolTokenAmount = getTokenAmount(
                                baselineExchangeRate,
                                unstakePrincipal,
                            );
                            const totalIotaAmount = getIotaAmount(
                                prevExchangeRate,
                                poolTokenAmount,
                            );
                            const prevAccumulatedRewards =
                                totalIotaAmount > unstakePrincipal
                                    ? totalIotaAmount - unstakePrincipal
                                    : 0n;
                            unstakeAction.totalRewards = prevAccumulatedRewards.toString();
                        }
                    }
                    stakeObject.accumulatedRewards[epoch] = '0';
                    stakeObject.rewardsByEpoch[epoch] = '0';
                } else {
                    stakeObject.accumulatedRewards[epoch] = currentAccumulatedRewards.toString();
                    stakeObject.rewardsByEpoch[epoch] = newEpochRewards.toString();
                }

                // Update previous accumulated rewards for next iteration
                previousAccumulatedRewards = currentAccumulatedRewards;
            } else if (stakeObject.firstEpoch > stakeObject.stakeActivationEpoch) {
                // For epochs before firstEpoch on transferred/unlocked stakes,
                // do NOT update previousAccumulatedRewards — it was already set
                // to the pre-ownership baseline (lines 60-73) and must be preserved.
            } else {
                previousAccumulatedRewards = currentAccumulatedRewards;
            }
            previousPrincipal = principalAmount;
        } catch (err) {
            console.error(`Error computing rewards for epoch ${epoch}:`, err);
            if (epoch >= stakeObject.firstEpoch) {
                stakeObject.accumulatedRewards[epoch] = previousAccumulatedRewards.toString();
                stakeObject.rewardsByEpoch[epoch] = '0';
            }
        }
    }

    // Calculate pre-transfer rewards if this stake was transferred to the user
    // These rewards accrued before the user owned the stake and should be subtracted
    // from unstake totals when calculating available rewards
    if (stakeObject.transferredInEpoch !== undefined) {
        const transferEpoch = stakeObject.transferredInEpoch;
        const principalAtTransfer = safeBigInt(stakeObject.principalByEpoch[transferEpoch] || '0');

        // Get exchange rate at transfer epoch (use previous epoch since you don't earn in transfer epoch).
        // Rates are normally only fetched for [firstEpoch, lastEpoch], so for a transferred-in stake
        // the rate at transferEpoch - 1 is typically missing — fetch it on demand.
        let transferExchangeRate = stakeObject.exchangeRatesByEpoch[transferEpoch - 1];
        if (!transferExchangeRate && transferEpoch - 1 >= 0) {
            try {
                const fetched = await fetchPoolExchangeRates(
                    exchangeRateId,
                    transferEpoch - 1,
                    stakeObject.poolId,
                    true,
                );
                if (fetched) {
                    transferExchangeRate = fetched;
                    stakeObject.exchangeRatesByEpoch[transferEpoch - 1] = fetched;
                }
            } catch {
                // Leave transferExchangeRate undefined; preTransferRewards will fall back to '0'
            }
        }

        if (transferExchangeRate && principalAtTransfer > 0n) {
            // Calculate the accumulated rewards at the transfer epoch
            const poolTokenAmount = getTokenAmount(baselineExchangeRate, principalAtTransfer);
            const totalIotaAmount = getIotaAmount(transferExchangeRate, poolTokenAmount);
            const preTransferRewards =
                totalIotaAmount > principalAtTransfer ? totalIotaAmount - principalAtTransfer : 0n;

            stakeObject.preTransferRewards = preTransferRewards.toString();
        } else {
            stakeObject.preTransferRewards = '0';
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

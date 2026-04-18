/**
 * Table computation utilities for staking rewards.
 * This module handles all data computation and provides pre-computed display values.
 */

import type { ActionDetails, StakeObject, ValidatorInfo } from './compute/types';
import { formatNanoAsIota } from './formatting';
import type { EpochData, EpochDataEntry, TableComputationResult } from './types';

/**
 * Get the first principal amount for a stake object.
 */
export function getFirstPrincipal(stakeObject: StakeObject): string {
    const epochs = Object.keys(stakeObject.principalByEpoch).map(Number);
    if (epochs.length === 0) return '';
    const minEpoch = Math.min(...epochs);
    return stakeObject.principalByEpoch[minEpoch];
}

/**
 * Compute display data for an epoch entry.
 */
function computeEpochDisplayData(
    entry: Omit<EpochDataEntry, 'display' | 'availableRewards'>,
    totalPreTransferRewards: bigint,
): { display: EpochDataEntry['display']; availableRewards: bigint; isNegative: boolean } {
    // Calculate available rewards
    const adjustedUnstake =
        entry.totalUnstakeAccumulated > totalPreTransferRewards
            ? entry.totalUnstakeAccumulated - totalPreTransferRewards
            : 0n;
    const rawAvailable = entry.totalAccumulated - adjustedUnstake;
    const isNegative = rawAvailable < 0n;
    const availableRewards = isNegative ? 0n : rawAvailable;

    return {
        availableRewards,
        isNegative,
        display: {
            stakedDisplay: formatNanoAsIota(entry.totalStaked),
            rewardsDisplay: formatNanoAsIota(entry.totalRewards),
            accumulatedDisplay: formatNanoAsIota(entry.totalAccumulated),
            unstakeRewardsDisplay: formatNanoAsIota(entry.totalUnstakeRewards),
            unstakeAccumulatedDisplay: formatNanoAsIota(entry.totalUnstakeAccumulated),
            availableRewardsDisplay: formatNanoAsIota(availableRewards),
        },
    };
}

/**
 * Compute all epoch data for the staking rewards table.
 * Returns pre-computed display values to avoid repeated calculations in UI.
 */
export function computeEpochData(
    stakeObjects: StakeObject[],
    validatorInfo: Record<string, ValidatorInfo>,
    currentEpoch: number,
): TableComputationResult {
    if (stakeObjects.length === 0) {
        return {
            minEpoch: 0,
            uniqueValidators: [],
            epochData: {},
            validatorPrincipal: {},
            epochs: [],
            totalPreTransferRewards: 0n,
            negativeAvailableEpochs: [],
        };
    }

    let minEpoch = Infinity;
    const poolIds = new Set<string>();

    // Find minEpoch and unique validators
    stakeObjects.forEach((stakeObject) => {
        if (stakeObject.firstEpoch < minEpoch) minEpoch = stakeObject.firstEpoch;
        poolIds.add(stakeObject.poolId);
    });

    const finalMinEpoch = minEpoch === Infinity ? 0 : minEpoch;
    const uniqueValidators = Array.from(poolIds).map(
        (poolId) => validatorInfo[poolId] || { name: `Unknown (${poolId.slice(0, 6)}...)`, poolId },
    );

    // Create epoch range
    const epochRange = Array.from({ length: currentEpoch + 1 }, (_, i) => i).slice(finalMinEpoch);
    const epochs = epochRange;

    // Initialize epoch data structure (without display yet - computed later)
    const rawEpochData: Record<number, Omit<EpochDataEntry, 'display' | 'availableRewards'>> = {};
    epochRange.forEach((epoch) => {
        rawEpochData[epoch] = {
            totalRewards: 0n,
            totalAccumulated: 0n,
            totalUnstakeRewards: 0n,
            totalUnstakeAccumulated: 0n,
            totalStaked: 0n,
            validatorRewards: {},
            validatorAccumulated: {},
            stakeRewards: {},
            stakeAccumulated: {},
            preActive: {},
            active: {},
        };
    });

    // Initialize validator principal tracking
    const validatorPrincipal: Record<string, bigint> = {};

    // Process each stake object
    stakeObjects.forEach((stakeObject) => {
        // Calculate validator principal (first time we see this validator)
        if (!validatorPrincipal[stakeObject.poolId]) {
            const firstPrincipal = getFirstPrincipal(stakeObject);
            if (firstPrincipal && firstPrincipal !== '0') {
                try {
                    validatorPrincipal[stakeObject.poolId] = BigInt(firstPrincipal);
                } catch {
                    validatorPrincipal[stakeObject.poolId] = 0n;
                }
            } else {
                validatorPrincipal[stakeObject.poolId] = 0n;
            }
        }

        // Process each epoch for this stake object
        epochRange.forEach((epoch) => {
            // Process rewards
            const rewards = stakeObject.rewardsByEpoch[epoch];
            if (rewards && rewards !== '0') {
                try {
                    rawEpochData[epoch].totalRewards += BigInt(rewards);
                    if (!rawEpochData[epoch].validatorRewards[stakeObject.poolId]) {
                        rawEpochData[epoch].validatorRewards[stakeObject.poolId] = 0n;
                    }
                    rawEpochData[epoch].validatorRewards[stakeObject.poolId] += BigInt(rewards);
                } catch {
                    // Handle BigInt conversion errors silently
                }
            }
            rawEpochData[epoch].stakeRewards[stakeObject.objectId] = rewards || '0';

            // Set active/pre-active status
            rawEpochData[epoch].preActive[stakeObject.objectId] =
                epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
            rawEpochData[epoch].active[stakeObject.objectId] =
                epoch >= stakeObject.firstEpoch && epoch <= stakeObject.lastEpoch;
        });
    });

    // Compute total staked for each epoch
    epochRange.forEach((epoch) => {
        let total = 0n;
        for (const stakeObject of stakeObjects) {
            const principal = stakeObject.principalByEpoch[epoch];
            if (principal && principal !== '0') {
                try {
                    let endPrincipal = BigInt(principal);
                    // Subtract unstaked amounts in this epoch
                    if (stakeObject.actionByEpoch && stakeObject.actionByEpoch[epoch]) {
                        const actions = stakeObject.actionByEpoch[epoch];
                        // Sum up all unstaked amounts in this epoch
                        for (const action of actions) {
                            if (
                                (action.action === 'Unstaked' ||
                                    action.action === 'Partial Unstake') &&
                                action.amount
                            ) {
                                try {
                                    endPrincipal -= BigInt(action.amount);
                                } catch {
                                    // Skip invalid amount
                                }
                            }
                        }
                    }
                    if (endPrincipal > 0n) {
                        total += endPrincipal;
                    }
                } catch {
                    // Skip invalid principal values
                    continue;
                }
            }
        }
        rawEpochData[epoch].totalStaked = total;
    });

    // Compute accumulated rewards for each epoch (totalAccumulated)
    for (let i = 0; i < epochRange.length; i++) {
        const epoch = epochRange[i];
        const prevEpoch = epochRange[i - 1];
        rawEpochData[epoch].totalAccumulated =
            rawEpochData[epoch].totalRewards +
            (prevEpoch !== undefined ? rawEpochData[prevEpoch].totalAccumulated : 0n);
    }

    // Compute validatorAccumulated and stakeAccumulated for each epoch
    stakeObjects.forEach((stakeObject) => {
        epochRange.forEach((epoch, i) => {
            // Validator accumulated
            if (!rawEpochData[epoch].validatorAccumulated[stakeObject.poolId]) {
                rawEpochData[epoch].validatorAccumulated[stakeObject.poolId] = 0n;
            }
            const rewards = stakeObject.rewardsByEpoch[epoch];
            if (rewards && rewards !== '0') {
                rawEpochData[epoch].validatorAccumulated[stakeObject.poolId] += BigInt(rewards);
            }

            // Stake accumulated
            if (!rawEpochData[epoch].stakeAccumulated[stakeObject.objectId]) {
                rawEpochData[epoch].stakeAccumulated[stakeObject.objectId] = '0';
            }
            const stakeRewards = stakeObject.rewardsByEpoch[epoch];
            const prevAccum =
                i > 0
                    ? BigInt(
                          rawEpochData[epochRange[i - 1]].stakeAccumulated[stakeObject.objectId] ||
                              '0',
                      )
                    : 0n;
            const currAccum =
                (stakeRewards && stakeRewards !== '0' ? BigInt(stakeRewards) : 0n) + prevAccum;
            rawEpochData[epoch].stakeAccumulated[stakeObject.objectId] = currAccum.toString();
        });
    });

    // Accumulate validatorAccumulated over epochs
    epochRange.forEach((epoch, i) => {
        if (i > 0) {
            const prevEpoch = epochRange[i - 1];
            Object.keys(rawEpochData[epoch].validatorAccumulated).forEach((poolId) => {
                rawEpochData[epoch].validatorAccumulated[poolId] +=
                    rawEpochData[prevEpoch].validatorAccumulated[poolId] || 0n;
            });
        }
    });

    // Process unstake rewards
    stakeObjects.forEach((stakeObject) => {
        if (stakeObject.actionByEpoch) {
            Object.entries(stakeObject.actionByEpoch).forEach(([epochStr, actions]) => {
                const epoch = parseInt(epochStr);
                // Process each action in the epoch
                for (const actionDetails of actions) {
                    if (
                        epochRange.includes(epoch) &&
                        (actionDetails.action === 'Unstaked' ||
                            actionDetails.action === 'Partial Unstake') &&
                        actionDetails.totalRewards
                    ) {
                        try {
                            const unstakeRewards = BigInt(actionDetails.totalRewards);
                            rawEpochData[epoch].totalUnstakeRewards += unstakeRewards;
                        } catch {
                            // Handle BigInt conversion errors silently
                        }
                    }
                }
            });
        }
    });

    // Compute accumulated unstake rewards for each epoch
    for (let i = 0; i < epochRange.length; i++) {
        const epoch = epochRange[i];
        const prevEpoch = epochRange[i - 1];
        rawEpochData[epoch].totalUnstakeAccumulated =
            rawEpochData[epoch].totalUnstakeRewards +
            (prevEpoch !== undefined ? rawEpochData[prevEpoch].totalUnstakeAccumulated : 0n);
    }

    // Calculate total pre-transfer rewards
    let totalPreTransferRewards = 0n;
    for (const stakeObject of stakeObjects) {
        if (stakeObject.preTransferRewards) {
            try {
                totalPreTransferRewards += BigInt(stakeObject.preTransferRewards);
            } catch {
                // Handle BigInt conversion errors silently
            }
        }
    }

    // Now compute display values for each epoch
    const epochData: EpochData = {};
    const negativeAvailableEpochs: number[] = [];
    epochRange.forEach((epoch) => {
        const raw = rawEpochData[epoch];
        const { display, availableRewards, isNegative } = computeEpochDisplayData(
            raw,
            totalPreTransferRewards,
        );
        if (isNegative) negativeAvailableEpochs.push(epoch);
        epochData[epoch] = {
            ...raw,
            availableRewards,
            display,
        };
    });

    if (negativeAvailableEpochs.length > 0) {
        console.error(
            `[StakingRewards] Available Rewards went negative at ${negativeAvailableEpochs.length} epoch(s) — indicates incorrect ownership/transfer accounting. First offending epochs: ${negativeAvailableEpochs.slice(0, 5).join(', ')}`,
        );
    }

    return {
        minEpoch: finalMinEpoch,
        uniqueValidators,
        epochData,
        validatorPrincipal,
        epochs,
        totalPreTransferRewards,
        negativeAvailableEpochs,
    };
}

// ============================================================================
// Helper functions for accessing epoch data
// These are kept for backward compatibility but now just access pre-computed values
// ============================================================================

/**
 * Check if a stake object is active in a given epoch.
 */
export function isActiveInEpoch(
    stakeObject: StakeObject,
    epoch: number,
    epochData: EpochData,
): boolean {
    return epochData[epoch]?.active[stakeObject.objectId] ?? false;
}

/**
 * Check if a stake object is in pre-activation state in a given epoch.
 */
export function isPreActivationInEpoch(
    stakeObject: StakeObject,
    epoch: number,
    epochData: EpochData,
): boolean {
    return epochData[epoch]?.preActive[stakeObject.objectId] ?? false;
}

/**
 * Get validator rewards for an epoch formatted as IOTA string.
 */
export function getValidatorRewardsForEpoch(
    validatorPoolId: string,
    epoch: number,
    epochData: EpochData,
): string {
    const total = epochData[epoch]?.validatorRewards[validatorPoolId] ?? 0n;
    return formatNanoAsIota(total);
}

/**
 * Get validator total principal formatted as IOTA string.
 */
export function getValidatorTotalPrincipal(
    validatorPoolId: string,
    validatorPrincipal: Record<string, bigint>,
): string {
    const total = validatorPrincipal[validatorPoolId] ?? 0n;
    return formatNanoAsIota(total);
}

/**
 * Format principal amount as a display string.
 */
export function formatPrincipal(principal: string): string {
    if (!principal || principal === '0') return 'N/A';
    try {
        const value = BigInt(principal);
        return 'Initial amount: ' + formatNanoAsIota(value);
    } catch {
        return 'N/A';
    }
}

/**
 * Format action details for display.
 */
export function formatActionDetails(action: ActionDetails): string {
    let details = `Action: ${action.action}\nTransaction: ${action.digest}`;

    if (action.timestamp) {
        details += `\nTime: ${action.timestamp}`;
    }

    if (action.amount) {
        const iotaAmount = formatNanoAsIota(BigInt(action.amount), 9);
        if (action.action === 'Partial Unstake') {
            details += `\nUnstaked Amount: ${iotaAmount}`;
        } else {
            details += `\nAmount: ${iotaAmount}`;
        }
    }

    if (action.totalRewards) {
        const iotaRewards = formatNanoAsIota(BigInt(action.totalRewards), 9);
        if (action.action === 'Partial Unstake') {
            details += `\nUnstake Rewards: ${iotaRewards}`;
        } else {
            details += `\nTotal Rewards: ${iotaRewards}`;
        }
    }

    if (action.fromAddress && action.toAddress) {
        details += `\nFrom: ${action.fromAddress}\nTo: ${action.toAddress}`;
    }

    if (action.principalChange) {
        const fromAmount = formatNanoAsIota(BigInt(action.principalChange.from), 9);
        const toAmount = formatNanoAsIota(BigInt(action.principalChange.to), 9);
        details += `\nPrincipal changed from ${fromAmount} to ${toAmount}`;
    }

    if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
        details += `\nMerged stake objects:`;
        action.mergedStakeObjects.forEach((obj) => {
            const amount = formatNanoAsIota(BigInt(obj.amount), 9);
            details += `\n  - ${obj.objectId}: ${amount}`;
        });
    }

    if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
        details += `\nSplit into stake objects:`;
        action.splitStakeObjects.forEach((obj) => {
            const amount = formatNanoAsIota(BigInt(obj.amount), 9);
            details += `\n  - ${obj.objectId}: ${amount}`;
        });
    }

    return details;
}

/**
 * Format multiple action details for display.
 */
export function formatMultipleActionDetails(actions: ActionDetails[]): string {
    if (actions.length === 0) return '';
    if (actions.length === 1) return formatActionDetails(actions[0]);

    return actions
        .map((action, index) => {
            return `--- Action ${index + 1} ---\n${formatActionDetails(action)}`;
        })
        .join('\n\n');
}

/**
 * Get combined action names for display.
 */
export function getActionNames(actions: ActionDetails[]): string {
    if (actions.length === 0) return '';
    if (actions.length === 1) return actions[0].action;
    return actions.map((a) => a.action).join(', ');
}

/**
 * Check if any action in the array has a specific action type.
 */
export function hasActionType(actions: ActionDetails[] | undefined, actionType: string): boolean {
    if (!actions) return false;
    return actions.some((a) => a.action === actionType);
}

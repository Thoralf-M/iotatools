import type { ActionDetails, StakeObject, ValidatorInfo } from './compute/types';

export type EpochData = Record<
    number,
    {
        totalRewards: bigint;
        totalAccumulated: bigint;
        totalUnstakeRewards: bigint;
        totalUnstakeAccumulated: bigint;
        totalStaked: bigint;
        validatorRewards: Record<string, bigint>;
        validatorAccumulated: Record<string, bigint>;
        stakeRewards: Record<string, string>;
        stakeAccumulated: Record<string, string>;
        preActive: Record<string, boolean>;
        active: Record<string, boolean>;
    }
>;

export type TableComputationResult = {
    minEpoch: number;
    uniqueValidators: ValidatorInfo[];
    epochData: EpochData;
    validatorPrincipal: Record<string, bigint>;
    epochs: number[];
    // Total pre-transfer rewards (rewards that accrued before stakes were transferred to the user)
    // This should be subtracted from unstake totals when calculating available rewards
    totalPreTransferRewards: bigint;
};

/**
 * Get the first principal amount for a stake object
 */
export function getFirstPrincipal(stakeObject: StakeObject): string {
    const epochs = Object.keys(stakeObject.principalByEpoch).map(Number);
    if (epochs.length === 0) return '';
    const minEpoch = Math.min(...epochs);
    return stakeObject.principalByEpoch[minEpoch];
}

/**
 * Compute all epoch data for the staking rewards table
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

    // Initialize epoch data structure
    const epochData: EpochData = {};
    epochRange.forEach((epoch) => {
        epochData[epoch] = {
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
                    epochData[epoch].totalRewards += BigInt(rewards);
                    if (!epochData[epoch].validatorRewards[stakeObject.poolId]) {
                        epochData[epoch].validatorRewards[stakeObject.poolId] = 0n;
                    }
                    epochData[epoch].validatorRewards[stakeObject.poolId] += BigInt(rewards);
                } catch {
                    // Handle BigInt conversion errors silently
                }
            }
            epochData[epoch].stakeRewards[stakeObject.objectId] = rewards || '0';

            // Set active/pre-active status
            epochData[epoch].preActive[stakeObject.objectId] =
                epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
            epochData[epoch].active[stakeObject.objectId] =
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
                                (action.action === 'Unstaked' || action.action === 'Partial Unstake') &&
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
        epochData[epoch].totalStaked = total;
    });

    // Compute accumulated rewards for each epoch (totalAccumulated)
    for (let i = 0; i < epochRange.length; i++) {
        const epoch = epochRange[i];
        const prevEpoch = epochRange[i - 1];
        epochData[epoch].totalAccumulated =
            epochData[epoch].totalRewards +
            (prevEpoch !== undefined ? epochData[prevEpoch].totalAccumulated : 0n);
    }

    // Compute validatorAccumulated and stakeAccumulated for each epoch
    stakeObjects.forEach((stakeObject) => {
        epochRange.forEach((epoch, i) => {
            // Validator accumulated
            if (!epochData[epoch].validatorAccumulated[stakeObject.poolId]) {
                epochData[epoch].validatorAccumulated[stakeObject.poolId] = 0n;
            }
            const rewards = stakeObject.rewardsByEpoch[epoch];
            if (rewards && rewards !== '0') {
                epochData[epoch].validatorAccumulated[stakeObject.poolId] += BigInt(rewards);
            }

            // Stake accumulated
            if (!epochData[epoch].stakeAccumulated[stakeObject.objectId]) {
                epochData[epoch].stakeAccumulated[stakeObject.objectId] = '0';
            }
            const stakeRewards = stakeObject.rewardsByEpoch[epoch];
            const prevAccum =
                i > 0
                    ? BigInt(
                        epochData[epochRange[i - 1]].stakeAccumulated[stakeObject.objectId] ||
                        '0',
                    )
                    : 0n;
            const currAccum =
                (stakeRewards && stakeRewards !== '0' ? BigInt(stakeRewards) : 0n) + prevAccum;
            epochData[epoch].stakeAccumulated[stakeObject.objectId] = currAccum.toString();
        });
    });

    // Accumulate validatorAccumulated over epochs
    epochRange.forEach((epoch, i) => {
        if (i > 0) {
            const prevEpoch = epochRange[i - 1];
            Object.keys(epochData[epoch].validatorAccumulated).forEach((poolId) => {
                epochData[epoch].validatorAccumulated[poolId] +=
                    epochData[prevEpoch].validatorAccumulated[poolId] || 0n;
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
                            epochData[epoch].totalUnstakeRewards += unstakeRewards;
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
        epochData[epoch].totalUnstakeAccumulated =
            epochData[epoch].totalUnstakeRewards +
            (prevEpoch !== undefined ? epochData[prevEpoch].totalUnstakeAccumulated : 0n);
    }

    // Calculate total pre-transfer rewards (rewards that accrued before stakes were transferred to user)
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

    return {
        minEpoch: finalMinEpoch,
        uniqueValidators,
        epochData,
        validatorPrincipal,
        epochs,
        totalPreTransferRewards,
    };
}

/**
 * Check if a stake object is active in a given epoch
 */
export function isActiveInEpoch(
    stakeObject: StakeObject,
    epoch: number,
    epochData: EpochData,
): boolean {
    return epochData[epoch]?.active[stakeObject.objectId] ?? false;
}

/**
 * Check if a stake object is in pre-activation state in a given epoch
 */
export function isPreActivationInEpoch(
    stakeObject: StakeObject,
    epoch: number,
    epochData: EpochData,
): boolean {
    return epochData[epoch]?.preActive[stakeObject.objectId] ?? false;
}

/**
 * Get total rewards for an epoch formatted as IOTA string
 */
export function getTotalRewardsForEpoch(epoch: number, epochData: EpochData): string {
    const total = epochData[epoch]?.totalRewards ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get total accumulated rewards for an epoch formatted as IOTA string
 */
export function getTotalAccumulatedRewardsForEpoch(epoch: number, epochData: EpochData): string {
    const total = epochData[epoch]?.totalAccumulated ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get validator rewards for an epoch formatted as IOTA string
 */
export function getValidatorRewardsForEpoch(
    validatorPoolId: string,
    epoch: number,
    epochData: EpochData,
): string {
    const total = epochData[epoch]?.validatorRewards[validatorPoolId] ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get validator accumulated rewards for an epoch formatted as IOTA string
 */
export function getValidatorAccumulatedRewardsForEpoch(
    validatorPoolId: string,
    epoch: number,
    epochData: EpochData,
): string {
    const total = epochData[epoch]?.validatorAccumulated[validatorPoolId] ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get total unstake rewards for an epoch formatted as IOTA string
 */
export function getTotalUnstakeRewardsForEpoch(epoch: number, epochData: EpochData): string {
    const total = epochData[epoch]?.totalUnstakeRewards ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get total accumulated unstake rewards for an epoch formatted as IOTA string
 */
export function getTotalAccumulatedUnstakeRewardsForEpoch(
    epoch: number,
    epochData: EpochData,
): string {
    const total = epochData[epoch]?.totalUnstakeAccumulated ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get available rewards for an epoch (accumulated - (unstake accumulated - pre-transfer rewards)) formatted as IOTA string
 * Pre-transfer rewards are rewards that accrued before stakes were transferred to the user.
 * These should be subtracted from unstake totals since they were never earned by this user.
 * Returns 0 if the result would be negative.
 */
export function getAvailableRewardsForEpoch(
    epoch: number,
    epochData: EpochData,
    totalPreTransferRewards: bigint = 0n,
): string {
    const accumulated = epochData[epoch]?.totalAccumulated ?? 0n;
    const unstakeAccumulated = epochData[epoch]?.totalUnstakeAccumulated ?? 0n;
    // Subtract pre-transfer rewards from unstake total since those weren't earned by this user
    const adjustedUnstake = unstakeAccumulated > totalPreTransferRewards
        ? unstakeAccumulated - totalPreTransferRewards
        : 0n;
    // Use max(0, ...) to prevent negative values
    const available = accumulated > adjustedUnstake ? accumulated - adjustedUnstake : 0n;
    return available === 0n ? '0' : (Number(available) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get total staked amount for an epoch by summing all principal amounts at the end of the epoch
 */
export function getTotalStakedForEpoch(epoch: number, stakeObjects: StakeObject[]): string {
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
                            (action.action === 'Unstaked' || action.action === 'Partial Unstake') &&
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

    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Get validator total principal formatted as IOTA string
 */
export function getValidatorTotalPrincipal(
    validatorPoolId: string,
    validatorPrincipal: Record<string, bigint>,
): string {
    const total = validatorPrincipal[validatorPoolId] ?? 0n;
    return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
}

/**
 * Format principal amount as a display string
 */
export function formatPrincipal(principal: string): string {
    if (!principal || principal === '0') return 'N/A';
    try {
        const value = BigInt(principal);
        return 'Initial amount: ' + (Number(value) / 1_000_000_000).toFixed(2) + ' IOTA';
    } catch {
        return 'N/A';
    }
}

/**
 * Format action details for display
 */
export function formatActionDetails(action: ActionDetails): string {
    let details = `Action: ${action.action}\nTransaction: ${action.digest}`;

    if (action.timestamp) {
        details += `\nTime: ${action.timestamp}`;
    }

    if (action.amount) {
        const iotaAmount = (Number(action.amount) / 1_000_000_000).toFixed(9);
        if (action.action === 'Partial Unstake') {
            details += `\nUnstaked Amount: ${iotaAmount} IOTA`;
        } else {
            details += `\nAmount: ${iotaAmount} IOTA`;
        }
    }

    if (action.totalRewards) {
        const iotaRewards = (Number(action.totalRewards) / 1_000_000_000).toFixed(9);
        if (action.action === 'Partial Unstake') {
            details += `\nUnstake Rewards: ${iotaRewards} IOTA`;
        } else {
            details += `\nTotal Rewards: ${iotaRewards} IOTA`;
        }
    }

    if (action.fromAddress && action.toAddress) {
        details += `\nFrom: ${action.fromAddress}\nTo: ${action.toAddress}`;
    }

    if (action.principalChange) {
        const fromAmount = (Number(action.principalChange.from) / 1_000_000_000).toFixed(9);
        const toAmount = (Number(action.principalChange.to) / 1_000_000_000).toFixed(9);
        details += `\nPrincipal changed from ${fromAmount} IOTA to ${toAmount} IOTA`;
    }

    if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
        details += `\nMerged stake objects:`;
        action.mergedStakeObjects.forEach((obj) => {
            const amount = (Number(obj.amount) / 1_000_000_000).toFixed(9);
            details += `\n  - ${obj.objectId}: ${amount} IOTA`;
        });
    }

    if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
        details += `\nSplit into stake objects:`;
        action.splitStakeObjects.forEach((obj) => {
            const amount = (Number(obj.amount) / 1_000_000_000).toFixed(9);
            details += `\n  - ${obj.objectId}: ${amount} IOTA`;
        });
    }

    return details;
}

/**
 * Format multiple action details for display
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
 * Get combined action names for display
 */
export function getActionNames(actions: ActionDetails[]): string {
    if (actions.length === 0) return '';
    if (actions.length === 1) return actions[0].action;
    return actions.map((a) => a.action).join(', ');
}

/**
 * Check if any action in the array has a specific action type
 */
export function hasActionType(actions: ActionDetails[] | undefined, actionType: string): boolean {
    if (!actions) return false;
    return actions.some((a) => a.action === actionType);
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

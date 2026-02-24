/**
 * Shared utilities for staking rewards tests and snapshot generation
 */

import type { StakeObject, ValidatorInfo } from './compute/types';
import { formatNumberLocale } from './formatting';
import type { ActionsByEpoch, TableComputationResult } from './types';

// Re-export types for convenience
export type { ActionsByEpoch };

/**
 * Get the max epoch from exchange rate cache data
 */
export function getMaxEpochFromCache(
    exchangeRateCache: Array<{ epochData?: Record<string, unknown> }>,
): number {
    let maxEpoch = 0;
    for (const pool of exchangeRateCache) {
        if (pool.epochData) {
            for (const epochStr of Object.keys(pool.epochData)) {
                const epoch = parseInt(epochStr);
                if (epoch > maxEpoch) maxEpoch = epoch;
            }
        }
    }
    return maxEpoch;
}

/**
 * Collect actions by epoch from stake objects
 */
export function collectActionsByEpoch(
    stakeObjects: StakeObject[],
    validatorInfo: Record<string, ValidatorInfo>,
): ActionsByEpoch {
    const actionsByEpoch: ActionsByEpoch = {};
    for (const stakeObject of stakeObjects) {
        if (stakeObject.actionByEpoch) {
            for (const [epochStr, actions] of Object.entries(stakeObject.actionByEpoch)) {
                const epoch = parseInt(epochStr);
                if (!actionsByEpoch[epoch]) {
                    actionsByEpoch[epoch] = [];
                }
                for (const action of actions) {
                    actionsByEpoch[epoch].push({
                        stakeObjectId: stakeObject.objectId,
                        validator: validatorInfo[stakeObject.poolId]?.name || 'Unknown',
                        action,
                    });
                }
            }
        }
    }
    return actionsByEpoch;
}

/**
 * Generate epoch table output as a string
 */
export function generateEpochTable(
    tableData: TableComputationResult,
    actionsByEpoch: ActionsByEpoch,
): string {
    const lines: string[] = [];

    // Header line
    const header =
        'Epoch    |                 Staked |                Rewards |            Accumulated |        Unstake Rewards |          Unstake Total |      Available Rewards';
    lines.push(header);
    lines.push('-'.repeat(142));

    for (const epoch of tableData.epochs) {
        const data = tableData.epochData[epoch];
        if (!data) continue;

        // Print actions for this epoch BEFORE the epoch line
        if (actionsByEpoch[epoch]) {
            for (const { stakeObjectId, validator, action } of actionsByEpoch[epoch]) {
                let actionStr = `  ▶ [${action.action}]`;
                actionStr += ` ObjId: ${stakeObjectId}`;
                actionStr += ` | TX: ${action.digest}`;
                actionStr += ` | Validator: ${validator}`;
                if (action.amount)
                    actionStr += ` | Amount: ${formatNumberLocale(BigInt(action.amount))}`;
                if (action.totalRewards && action.totalRewards !== '0') {
                    actionStr += ` | Rewards: ${formatNumberLocale(BigInt(action.totalRewards))}`;
                }
                if (action.fromAddress && action.toAddress) {
                    actionStr += ` | From: ${action.fromAddress} To: ${action.toAddress}`;
                }
                if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
                    actionStr += ` | Merged: ${action.mergedStakeObjects.map((m) => m.objectId).join(', ')}`;
                }
                lines.push(actionStr);
            }
        }

        const staked = formatNumberLocale(data.totalStaked).padStart(22);
        const rewards = formatNumberLocale(data.totalRewards).padStart(22);
        const accumulated = formatNumberLocale(data.totalAccumulated).padStart(22);
        const unstakeRewards = formatNumberLocale(data.totalUnstakeRewards).padStart(22);
        const unstakeTotal = formatNumberLocale(data.totalUnstakeAccumulated).padStart(22);
        // Subtract pre-transfer rewards from unstake total since those weren't earned by this user
        const adjustedUnstake =
            data.totalUnstakeAccumulated > tableData.totalPreTransferRewards
                ? data.totalUnstakeAccumulated - tableData.totalPreTransferRewards
                : 0n;
        // Use max(0, ...) to prevent negative values
        const availableRaw =
            data.totalAccumulated > adjustedUnstake ? data.totalAccumulated - adjustedUnstake : 0n;
        const available = formatNumberLocale(availableRaw).padStart(22);

        const epochStr = String(epoch).padEnd(9);
        lines.push(
            `${epochStr}| ${staked} | ${rewards} | ${accumulated} | ${unstakeRewards} | ${unstakeTotal} | ${available}`,
        );
    }

    lines.push('-'.repeat(142));

    return lines.join('\n');
}

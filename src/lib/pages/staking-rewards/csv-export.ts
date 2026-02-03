import type { StakeObject, ValidatorInfo } from './compute/types';
import type { EpochData } from './table-utils';
import {
    getAvailableRewardsForEpoch,
    getTotalAccumulatedRewardsForEpoch,
    getTotalAccumulatedUnstakeRewardsForEpoch,
    getTotalRewardsForEpoch,
    getTotalStakedForEpoch,
    getTotalUnstakeRewardsForEpoch,
    getValidatorRewardsForEpoch,
    isActiveInEpoch,
    isPreActivationInEpoch,
} from './table-utils';

export type ExportOptions = {
    showPriceColumns: boolean;
    showValidatorColumns: boolean;
    epochPrices: Record<number, number>;
    selectedCurrency: 'usd' | 'eur';
};

/**
 * Export table data to CSV format and trigger download
 */
export function exportTableToCSV(
    epochs: number[],
    epochEndDates: string[],
    currentEpoch: number,
    stakeObjects: StakeObject[],
    uniqueValidators: ValidatorInfo[],
    epochData: EpochData,
    options: ExportOptions,
    totalPreTransferRewards: bigint = 0n,
): void {
    const { showPriceColumns, showValidatorColumns, epochPrices, selectedCurrency } = options;

    // Build header row
    let headers = [
        'Epoch',
        'End Date',
        'Staked',
        'Rewards',
        'Accumulated',
        'Unstake Rewards',
        'Unstake Accumulated',
        'Available Rewards',
    ];

    if (showPriceColumns && Object.keys(epochPrices).length > 0) {
        headers.push(
            `Price (${selectedCurrency.toUpperCase()})`,
            `Rewards in ${selectedCurrency.toUpperCase()}`,
            `Accumulated in ${selectedCurrency.toUpperCase()}`,
        );
    }

    if (showValidatorColumns) {
        uniqueValidators.forEach((validator) => {
            headers.push(`Validator: ${validator.name}`);
        });
    }

    stakeObjects.forEach((stakeObject) => {
        headers.push(
            `Stake: ${stakeObject.objectId}`,
            `Action: ${stakeObject.objectId}`,
            `Action Details: ${stakeObject.objectId}`,
        );
    });

    // Build data rows
    const rows: string[][] = [];
    for (let i = 0; i < epochs.length; i++) {
        const epoch = epochs[i];
        const row: string[] = [];

        // Basic epoch data
        row.push(
            epoch.toString(),
            epochEndDates[i] || '-',
            epoch === currentEpoch
                ? 'pending'
                : getTotalStakedForEpoch(epoch, stakeObjects).replace(' IOTA', ''),
            epoch === currentEpoch
                ? 'pending'
                : getTotalRewardsForEpoch(epoch, epochData).replace(' IOTA', ''),
            epoch === currentEpoch
                ? 'pending'
                : getTotalAccumulatedRewardsForEpoch(epoch, epochData).replace(' IOTA', ''),
            epoch === currentEpoch
                ? 'pending'
                : getTotalUnstakeRewardsForEpoch(epoch, epochData).replace(' IOTA', ''),
            epoch === currentEpoch
                ? 'pending'
                : getTotalAccumulatedUnstakeRewardsForEpoch(epoch, epochData).replace(' IOTA', ''),
            epoch === currentEpoch
                ? 'pending'
                : getAvailableRewardsForEpoch(epoch, epochData, totalPreTransferRewards).replace(' IOTA', ''),
        );

        // Price columns
        if (showPriceColumns && Object.keys(epochPrices).length > 0) {
            row.push(
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                        ? epochPrices[epoch].toString()
                        : 'no price',
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                        ? (
                            Number(getTotalRewardsForEpoch(epoch, epochData).replace(' IOTA', '')) *
                            epochPrices[epoch]
                        ).toFixed(4)
                        : 'no price',
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                        ? (
                            Number(
                                getTotalAccumulatedRewardsForEpoch(epoch, epochData).replace(
                                    ' IOTA',
                                    '',
                                ),
                            ) * epochPrices[epoch]
                        ).toFixed(4)
                        : 'no price',
            );
        }

        // Validator columns
        if (showValidatorColumns) {
            uniqueValidators.forEach((validator) => {
                row.push(
                    epoch === currentEpoch
                        ? 'pending'
                        : getValidatorRewardsForEpoch(validator.poolId, epoch, epochData).replace(
                            ' IOTA',
                            '',
                        ),
                );
            });
        }

        // Stake object columns
        stakeObjects.forEach((stakeObject) => {
            if (epoch === currentEpoch) {
                row.push('pending', '', '');
            } else if (isPreActivationInEpoch(stakeObject, epoch, epochData)) {
                row.push('pre-active', '', '');
            } else if (
                isActiveInEpoch(stakeObject, epoch, epochData) &&
                epoch >= stakeObject.firstEpoch
            ) {
                // Add reward amount
                row.push(
                    stakeObject.rewardsByEpoch[epoch] === '0'
                        ? '-'
                        : (Number(stakeObject.rewardsByEpoch[epoch]) / 1_000_000_000).toFixed(4),
                );

                // Add action information
                const actions = stakeObject.actionByEpoch?.[epoch];
                if (actions && actions.length > 0) {
                    // Combine all action names
                    const actionNames = actions.map((a) => a.action).join(', ');
                    row.push(actionNames);

                    // Format action details for CSV - combine all actions
                    const actionDetailsArr: string[] = [];
                    for (const action of actions) {
                        let details = `TX: ${action.digest}`;
                        if (action.amount) {
                            const amount = (Number(action.amount) / 1_000_000_000).toFixed(2);
                            details += ` | Amount: ${amount} IOTA`;
                        }
                        if (action.totalRewards) {
                            const rewards = (Number(action.totalRewards) / 1_000_000_000).toFixed(
                                2,
                            );
                            details += ` | Rewards: ${rewards} IOTA`;
                        }
                        if (action.fromAddress && action.toAddress) {
                            details += ` | From: ${action.fromAddress} To: ${action.toAddress}`;
                        }
                        if (action.principalChange) {
                            const from = (
                                Number(action.principalChange.from) / 1_000_000_000
                            ).toFixed(2);
                            const to = (Number(action.principalChange.to) / 1_000_000_000).toFixed(
                                2,
                            );
                            details += ` | Principal: ${from} → ${to} IOTA`;
                        }
                        if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
                            details += ` | Merged: ${action.mergedStakeObjects.length} objects`;
                        }
                        if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
                            details += ` | Split: ${action.splitStakeObjects.length} objects`;
                        }
                        actionDetailsArr.push(details);
                    }

                    row.push(actionDetailsArr.join(' ;; '));
                } else {
                    row.push('', '');
                }
            } else {
                row.push('-', '', '');
            }
        });

        rows.push(row);
    }

    // Convert to CSV string
    let csvContent = '';
    csvContent += headers.map((h) => '"' + h.replace(/"/g, '""') + '"').join(',') + '\n';
    rows.forEach((row) => {
        csvContent +=
            row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',') + '\n';
    });

    // Download as file
    downloadCSV(csvContent, 'staking-rewards-table.csv');
}

/**
 * Download CSV content as a file
 */
function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

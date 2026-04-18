import { formatNanoAsIotaFullPrecision, nanoToIota } from './formatting';
import { isActiveInEpoch, isPreActivationInEpoch } from './table-utils';
import type { EpochData, ExportOptions, StakeObject, ValidatorInfo } from './types';

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
): void {
    const { showPriceColumns, showValidatorColumns, epochPrices, selectedCurrency, fileNameSuffix } =
        options;

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
        const data = epochData[epoch];

        // Basic epoch data - use full precision values without unit suffix for spreadsheet import
        row.push(
            epoch.toString(),
            epochEndDates[i] || '-',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalStaked)
                  : '0',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalRewards)
                  : '0',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalAccumulated)
                  : '0',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalUnstakeRewards)
                  : '0',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalUnstakeAccumulated)
                  : '0',
            epoch === currentEpoch
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.availableRewards)
                  : '0',
        );

        // Price columns - use nanoToIota for precise float conversion (same as table display)
        if (showPriceColumns && Object.keys(epochPrices).length > 0) {
            const rewardsIota = data ? nanoToIota(data.totalRewards) : 0;
            const accumulatedIota = data ? nanoToIota(data.totalAccumulated) : 0;

            row.push(
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                      ? epochPrices[epoch].toString()
                      : 'no price',
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                      ? (rewardsIota * epochPrices[epoch]).toFixed(4)
                      : 'no price',
                epoch === currentEpoch
                    ? 'pending'
                    : epochPrices[epoch]
                      ? (accumulatedIota * epochPrices[epoch]).toFixed(4)
                      : 'no price',
            );
        }

        // Validator columns - full precision without suffix
        if (showValidatorColumns) {
            uniqueValidators.forEach((validator) => {
                if (epoch === currentEpoch) {
                    row.push('pending');
                } else {
                    const rewards = data?.validatorRewards[validator.poolId] ?? 0n;
                    row.push(formatNanoAsIotaFullPrecision(rewards));
                }
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
                // Add reward amount - full precision
                row.push(
                    stakeObject.rewardsByEpoch[epoch] === '0'
                        ? '-'
                        : formatNanoAsIotaFullPrecision(BigInt(stakeObject.rewardsByEpoch[epoch])),
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
                            details += ` | Amount: ${formatNanoAsIotaFullPrecision(BigInt(action.amount), true)}`;
                        }
                        if (action.totalRewards) {
                            details += ` | Rewards: ${formatNanoAsIotaFullPrecision(BigInt(action.totalRewards), true)}`;
                        }
                        if (action.fromAddress && action.toAddress) {
                            details += ` | From: ${action.fromAddress} To: ${action.toAddress}`;
                        }
                        if (action.principalChange) {
                            const from = formatNanoAsIotaFullPrecision(
                                BigInt(action.principalChange.from),
                                true,
                            );
                            const to = formatNanoAsIotaFullPrecision(
                                BigInt(action.principalChange.to),
                                true,
                            );
                            details += ` | Principal: ${from} → ${to}`;
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
    const suffix = fileNameSuffix?.trim() || new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `staking-rewards-table-${suffix}.csv`);
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

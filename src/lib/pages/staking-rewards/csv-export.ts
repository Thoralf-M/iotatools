import { formatNanoAsIotaFullPrecision, nanoToIota } from './formatting';
import {
    computeCumulativeUnstakeFiat,
    computeEarnedValueForEpoch,
    isActiveInEpoch,
} from './table-utils';
import type { EpochData, ExportOptions, StakeObject, ValidatorInfo } from './types';

/**
 * A single logical table in the export. Multiple sections appear in order:
 * the main epoch table is always first; the long-format stake-object and
 * validator sections are appended when `wrapStakeObjects` / `wrapValidators`
 * are set. CSV serializes each section to lines; PDF renders each as a
 * separate auto-table.
 */
export type ExportSection = {
    /** Optional human-visible title printed above the headers. */
    title?: string;
    headers: string[];
    rows: string[][];
};

export type ExportInputs = {
    epochs: number[];
    epochEndDates: string[];
    currentEpoch: number;
    stakeObjects: StakeObject[];
    uniqueValidators: ValidatorInfo[];
    epochData: EpochData;
    options: ExportOptions;
};

/**
 * Build the full ordered list of export sections from the given inputs.
 * This is pure (no DOM, no I/O) so it can be snapshot-tested and reused by
 * the PDF exporter. The same function drives both CSV and PDF output — they
 * only differ in how they serialize the resulting sections.
 */
export function buildExportSections(inputs: ExportInputs): ExportSection[] {
    const {
        epochs,
        epochEndDates,
        currentEpoch,
        stakeObjects,
        uniqueValidators,
        epochData,
        options,
    } = inputs;
    const {
        showPriceColumns,
        showValidatorColumns,
        epochPrices,
        selectedCurrency,
        wrapStakeObjects = false,
        wrapValidators = false,
    } = options;

    const hasPrices = showPriceColumns && Object.keys(epochPrices).length > 0;
    const currencyLabel = selectedCurrency.toUpperCase();
    const cumulativeUnstakeFiat = hasPrices
        ? computeCumulativeUnstakeFiat(epochs, epochData, epochPrices)
        : {};

    // --- Main table ---------------------------------------------------------
    const mainHeaders = [
        'Epoch',
        'End Date',
        'Staked',
        'Rewards',
        'Accumulated',
        'Unstake Rewards',
        'Unstake Accumulated',
        'Available Rewards',
    ];

    if (hasPrices) {
        mainHeaders.push(
            `Price (${currencyLabel})`,
            `Rewards in ${currencyLabel}`,
            `Accumulated in ${currencyLabel}`,
            `Total Earned (${currencyLabel})`,
        );
    }

    if (showValidatorColumns && !wrapValidators) {
        uniqueValidators.forEach((validator) => {
            mainHeaders.push(`Validator: ${validator.name}`);
        });
    }

    if (!wrapStakeObjects) {
        stakeObjects.forEach((stakeObject) => {
            mainHeaders.push(`Stake: ${stakeObject.objectId}`, `Action: ${stakeObject.objectId}`);
        });
    }

    const mainRows: string[][] = [];
    for (let i = 0; i < epochs.length; i++) {
        const epoch = epochs[i];
        const data = epochData[epoch];
        const isPending = epoch === currentEpoch;
        const row: string[] = [];

        row.push(
            epoch.toString(),
            epochEndDates[i] || '-',
            isPending ? 'pending' : data ? formatNanoAsIotaFullPrecision(data.totalStaked) : '0',
            isPending ? 'pending' : data ? formatNanoAsIotaFullPrecision(data.totalRewards) : '0',
            isPending
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalAccumulated)
                  : '0',
            isPending
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalUnstakeRewards)
                  : '0',
            isPending
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.totalUnstakeAccumulated)
                  : '0',
            isPending
                ? 'pending'
                : data
                  ? formatNanoAsIotaFullPrecision(data.availableRewards)
                  : '0',
        );

        if (hasPrices) {
            const rewardsIota = data ? nanoToIota(data.totalRewards) : 0;
            const accumulatedIota = data ? nanoToIota(data.totalAccumulated) : 0;
            const price = epochPrices[epoch];
            const earned = isPending
                ? null
                : computeEarnedValueForEpoch(epoch, epochData, cumulativeUnstakeFiat, epochPrices);

            row.push(
                isPending ? 'pending' : price ? price.toString() : 'no price',
                isPending ? 'pending' : price ? (rewardsIota * price).toFixed(4) : 'no price',
                isPending ? 'pending' : price ? (accumulatedIota * price).toFixed(4) : 'no price',
                isPending ? 'pending' : earned !== null ? earned.toFixed(4) : 'no price',
            );
        }

        if (showValidatorColumns && !wrapValidators) {
            uniqueValidators.forEach((validator) => {
                if (isPending) {
                    row.push('pending');
                } else {
                    const rewards = data?.validatorRewards[validator.poolId] ?? 0n;
                    row.push(formatNanoAsIotaFullPrecision(rewards));
                }
            });
        }

        if (!wrapStakeObjects) {
            stakeObjects.forEach((stakeObject) => {
                row.push(...buildStakeObjectCells(stakeObject, epoch, currentEpoch, epochData));
            });
        }

        mainRows.push(row);
    }

    const sections: ExportSection[] = [{ headers: mainHeaders, rows: mainRows }];

    if (wrapValidators && showValidatorColumns && uniqueValidators.length > 0) {
        sections.push({
            title: '--- Validators ---',
            headers: ['Epoch', 'End Date', 'Validator', 'Pool ID', 'Rewards'],
            rows: buildValidatorLongRows(
                epochs,
                epochEndDates,
                currentEpoch,
                uniqueValidators,
                epochData,
            ),
        });
    }

    if (wrapStakeObjects && stakeObjects.length > 0) {
        sections.push({
            title: '--- Stake Objects ---',
            headers: ['Epoch', 'End Date', 'Stake Object', 'Reward', 'Action'],
            rows: buildStakeObjectLongRows(
                epochs,
                epochEndDates,
                currentEpoch,
                stakeObjects,
                epochData,
            ),
        });
    }

    return sections;
}

/**
 * Serialize an array of export sections to a single CSV string.
 * Kept pure so callers (including tests) can inspect the output without
 * triggering a download.
 */
export function sectionsToCsv(sections: ExportSection[]): string {
    const parts: string[] = [];
    for (const section of sections) {
        const lines: string[] = [];
        if (section.title) lines.push(csvRow([section.title]));
        lines.push(csvRow(section.headers));
        for (const row of section.rows) lines.push(csvRow(row));
        lines.push('');
        parts.push(lines.join('\n'));
    }
    return parts.join('\n');
}

/**
 * Export table data to CSV format and trigger download.
 *
 * When `wrapStakeObjects` or `wrapValidators` is set, the per-object columns
 * are emitted as extra sections below the main table (long format) instead of
 * as wide columns. This keeps the main table readable when the data is
 * viewed in a PDF or printout.
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
    const sections = buildExportSections({
        epochs,
        epochEndDates,
        currentEpoch,
        stakeObjects,
        uniqueValidators,
        epochData,
        options,
    });
    const csvContent = sectionsToCsv(sections);
    const suffix = options.fileNameSuffix?.trim() || new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `staking-rewards-table-${suffix}.csv`);
}

/**
 * Build the two cells (stake reward / merged action+details) for a stake
 * object in a given epoch. The action name is prepended to its own TX data
 * so the two legacy columns collapse into one without losing information.
 */
function buildStakeObjectCells(
    stakeObject: StakeObject,
    epoch: number,
    currentEpoch: number,
    epochData: EpochData,
): [string, string] {
    if (epoch === currentEpoch) return ['pending', ''];
    if (!isActiveInEpoch(stakeObject, epoch, epochData) || epoch < stakeObject.firstEpoch) {
        return ['-', ''];
    }

    const reward =
        stakeObject.rewardsByEpoch[epoch] === '0'
            ? '-'
            : formatNanoAsIotaFullPrecision(BigInt(stakeObject.rewardsByEpoch[epoch]));

    const actions = stakeObject.actionByEpoch?.[epoch];
    if (!actions || actions.length === 0) return [reward, ''];

    const actionStrings = actions.map((action) => {
        let details = `${action.action}: TX: ${action.digest}`;
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
            const from = formatNanoAsIotaFullPrecision(BigInt(action.principalChange.from), true);
            const to = formatNanoAsIotaFullPrecision(BigInt(action.principalChange.to), true);
            details += ` | Principal: ${from} → ${to}`;
        }
        if (action.mergedStakeObjects && action.mergedStakeObjects.length > 0) {
            details += ` | Merged: ${action.mergedStakeObjects.length} objects`;
        }
        if (action.splitStakeObjects && action.splitStakeObjects.length > 0) {
            details += ` | Split: ${action.splitStakeObjects.length} objects`;
        }
        return details;
    });

    return [reward, actionStrings.join(' ;; ')];
}

function buildStakeObjectLongRows(
    epochs: number[],
    epochEndDates: string[],
    currentEpoch: number,
    stakeObjects: StakeObject[],
    epochData: EpochData,
): string[][] {
    const rows: string[][] = [];
    for (const stakeObject of stakeObjects) {
        for (let i = 0; i < epochs.length; i++) {
            const epoch = epochs[i];
            const [reward, action] = buildStakeObjectCells(
                stakeObject,
                epoch,
                currentEpoch,
                epochData,
            );
            // Skip rows that are both inactive and have no action — they'd be
            // pure noise in the long format.
            if (reward === '-' && !action) continue;
            rows.push([
                epoch.toString(),
                epochEndDates[i] || '-',
                stakeObject.objectId,
                reward,
                action,
            ]);
        }
    }
    return rows;
}

function buildValidatorLongRows(
    epochs: number[],
    epochEndDates: string[],
    currentEpoch: number,
    uniqueValidators: ValidatorInfo[],
    epochData: EpochData,
): string[][] {
    const rows: string[][] = [];
    for (const validator of uniqueValidators) {
        for (let i = 0; i < epochs.length; i++) {
            const epoch = epochs[i];
            const data = epochData[epoch];
            const isPending = epoch === currentEpoch;
            const rewards = data?.validatorRewards[validator.poolId] ?? 0n;
            // Skip epochs where this validator earned nothing (keeps the long
            // section compact — a pending row for the current epoch is kept).
            if (!isPending && rewards === 0n) continue;
            rows.push([
                epoch.toString(),
                epochEndDates[i] || '-',
                validator.name,
                validator.poolId,
                isPending ? 'pending' : formatNanoAsIotaFullPrecision(rewards),
            ]);
        }
    }
    return rows;
}

function csvRow(cells: string[]): string {
    return cells.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',');
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

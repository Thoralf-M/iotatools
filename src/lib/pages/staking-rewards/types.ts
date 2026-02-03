/**
 * Type definitions for staking rewards table computation.
 * Centralizes all types used across table, chart, and CSV export.
 */

import type { ActionDetails, StakeObject, ValidatorInfo } from './compute/types';

/**
 * Pre-computed display values for an epoch.
 * These values are formatted strings ready for display, avoiding repeated calculations.
 */
export type EpochDisplayData = {
    /** Display string for total staked amount (e.g., "1,234.56 IOTA") */
    stakedDisplay: string;
    /** Display string for total rewards this epoch */
    rewardsDisplay: string;
    /** Display string for accumulated rewards */
    accumulatedDisplay: string;
    /** Display string for unstake rewards this epoch */
    unstakeRewardsDisplay: string;
    /** Display string for accumulated unstake rewards */
    unstakeAccumulatedDisplay: string;
    /** Display string for available rewards (accumulated - unstake adjusted) */
    availableRewardsDisplay: string;
};

/**
 * Per-epoch data containing both raw values and display data.
 */
export type EpochDataEntry = {
    // Raw bigint values for calculations
    totalRewards: bigint;
    totalAccumulated: bigint;
    totalUnstakeRewards: bigint;
    totalUnstakeAccumulated: bigint;
    totalStaked: bigint;
    /** Available rewards = accumulated - (unstake accumulated - pre-transfer rewards), min 0 */
    availableRewards: bigint;

    // Per-validator data
    validatorRewards: Record<string, bigint>;
    validatorAccumulated: Record<string, bigint>;

    // Per-stake object data (string values from original data)
    stakeRewards: Record<string, string>;
    stakeAccumulated: Record<string, string>;

    // Status flags per stake object
    preActive: Record<string, boolean>;
    active: Record<string, boolean>;

    // Pre-computed display values
    display: EpochDisplayData;
};

/**
 * Full epoch data mapping epoch number to its data.
 */
export type EpochData = Record<number, EpochDataEntry>;

/**
 * Pre-computed display values for a validator in a specific epoch.
 */
export type ValidatorEpochDisplay = {
    rewardsDisplay: string;
    accumulatedDisplay: string;
};

/**
 * Result of computing all table data.
 */
export type TableComputationResult = {
    /** The earliest epoch with stake data */
    minEpoch: number;
    /** List of unique validators with stake */
    uniqueValidators: ValidatorInfo[];
    /** Per-epoch computed data */
    epochData: EpochData;
    /** Total principal by validator pool ID */
    validatorPrincipal: Record<string, bigint>;
    /** Array of all epochs in range */
    epochs: number[];
    /** Total pre-transfer rewards (rewards that accrued before stakes were transferred to user) */
    totalPreTransferRewards: bigint;
};

/**
 * Chart data point for a specific epoch.
 */
export type ChartDataPoint = {
    x: Date;
    y: number;
};

/**
 * Options for CSV export.
 */
export type ExportOptions = {
    showPriceColumns: boolean;
    showValidatorColumns: boolean;
    epochPrices: Record<number, number>;
    selectedCurrency: 'usd' | 'eur';
};

/**
 * Action grouped by epoch for display purposes.
 */
export type ActionsByEpoch = Record<
    number,
    Array<{ stakeObjectId: string; validator: string; action: ActionDetails }>
>;

// Re-export types from compute for convenience
export type { ActionDetails, StakeObject, ValidatorInfo };

export type ActionDetails = {
    action: string;
    digest: string;
    timestamp?: string; // ISO timestamp for ordering actions chronologically
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
    // Map of epoch -> detailed action information (array to support multiple actions in same epoch)
    actionByEpoch?: Record<number, ActionDetails[]>;
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

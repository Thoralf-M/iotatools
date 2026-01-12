export interface CheckpointRange {
    first: number;
    last: number;
}

export interface RawTransactionBlock {
    digest: string;
    sender?: {
        address: string;
    };
    effects?: {
        checkpoint?: {
            sequenceNumber: number;
            timestamp: string;
        };
        status: string;
        gasEffects?: {
            gasSummary?: {
                storageCost: string;
                storageRebate: string;
                computationCost: string;
            };
        };
        objectChanges?: {
            nodes: any[];
        };
        events?: {
            nodes: any[];
        };
        transactionBlock?: {
            bcs: string;
        };
    };
}

export interface TransactionBatchResult {
    transactions: RawTransactionBlock[];
    hasNextPage: boolean;
    endCursor: string | null;
}

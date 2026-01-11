import type { CheckpointRange } from '../../utils/graphql-types';
import {
    TransactionDataProcessor,
    type DisplayData,
    type ProcessedTransaction,
} from './data-processor';
import { GraphQLDataFetcher } from './graphql-fetcher';

export type { DisplayData };

export class EpochPTBAnalyzer {
    private fetcher: GraphQLDataFetcher;
    private processor: TransactionDataProcessor;
    private stopRequested: boolean = false;

    constructor() {
        this.fetcher = new GraphQLDataFetcher();
        this.processor = new TransactionDataProcessor();
    }

    requestStop(): void {
        this.stopRequested = true;
    }

    private resetStopFlag(): void {
        this.stopRequested = false;
    }

    async getCurrentEpoch(): Promise<string | null> {
        return this.fetcher.getCurrentEpoch();
    }

    async getCheckpointRangeForEpoch(epochNum: number): Promise<CheckpointRange> {
        return this.fetcher.getCheckpointRangeForEpoch(epochNum);
    }

    getCheckpointTransactions(
        checkpointNum: string | number,
        displayData: DisplayData,
    ): ProcessedTransaction[] {
        return this.processor.getCheckpointTransactions(checkpointNum);
    }

    private async resolveCheckpointRange(
        epoch?: string | number,
        startCheckpoint?: string | number,
        endCheckpoint?: string | number,
    ): Promise<CheckpointRange> {
        const epochStr = epoch?.toString();
        const startCheckpointStr = startCheckpoint?.toString();
        const endCheckpointStr = endCheckpoint?.toString();

        if (epochStr && epochStr.trim() !== '') {
            const epochNum = parseInt(epochStr.trim());
            if (isNaN(epochNum) || epochNum < 0) {
                throw new Error('Please enter a valid positive number for epoch');
            }
            return await this.fetcher.getCheckpointRangeForEpoch(epochNum);
        } else if (startCheckpointStr && endCheckpointStr) {
            const startNum = parseInt(startCheckpointStr.trim());
            const endNum = parseInt(endCheckpointStr.trim());

            if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < 0) {
                throw new Error('Please enter valid positive numbers for checkpoint range');
            }

            if (startNum > endNum) {
                throw new Error('Start checkpoint must be less than or equal to end checkpoint');
            }

            return { first: startNum, last: endNum };
        } else {
            throw new Error('Please enter either an epoch number or a checkpoint range');
        }
    }

    async *fetchTransactionBlocksWithProgress(
        checkpointRange: CheckpointRange,
        maxTransactions?: number,
        inputObject?: string,
        functionFilter?: string,
    ): AsyncGenerator<{
        data: DisplayData;
        isComplete: boolean;
        processedTransactions: number;
        processedCheckpoints: number;
        totalCheckpoints: number;
    }> {
        // Reset processor for new analysis
        this.processor.reset();

        for await (const fetchResult of this.fetcher.fetchAllTransactionBlocks(
            checkpointRange,
            maxTransactions,
            inputObject,
            functionFilter,
        )) {
            // Check if stop was requested at the beginning of each iteration
            if (this.stopRequested) {
                console.log('Stopping fetchTransactionBlocksWithProgress due to user request');
                break;
            }

            // Process the batch of transactions
            this.processor.processTransactionBatch(fetchResult.transactions);

            // Calculate progress
            const progress = this.processor.calculateProgress(checkpointRange);

            // Create display data
            const displayData = this.processor.createDisplayData(checkpointRange);

            // Debug logging
            if (fetchResult.isComplete) {
                console.log(
                    `✓ Complete: Covered ${progress.processedCheckpoints} checkpoints in range, ${fetchResult.totalFetched} total transactions`,
                );
            } else {
                const progressPercentage = Math.round(
                    (progress.processedCheckpoints / progress.totalCheckpoints) * 100,
                );
                console.log(
                    `Progress: ${progress.processedCheckpoints}/${progress.totalCheckpoints} checkpoints in range (${progressPercentage}%), ${fetchResult.totalFetched} transactions`,
                );
            }

            yield {
                data: displayData,
                isComplete: fetchResult.isComplete,
                processedTransactions: fetchResult.totalFetched,
                processedCheckpoints: progress.processedCheckpoints,
                totalCheckpoints: progress.totalCheckpoints,
            };
        }
    }

    async fetchAllTransactionBlocks(
        epoch?: string | number,
        startCheckpoint?: string | number,
        endCheckpoint?: string | number,
        onProgress?: (
            data: DisplayData,
            isComplete: boolean,
            processedTransactions: number,
            processedCheckpoints: number,
            totalCheckpoints: number,
        ) => void,
        inputObject?: string,
        functionFilter?: string,
    ): Promise<DisplayData> {
        this.resetStopFlag(); // Reset stop flag at the beginning
        const checkpointRange = await this.resolveCheckpointRange(
            epoch,
            startCheckpoint,
            endCheckpoint,
        );
        let finalData: DisplayData | null = null;

        for await (const progress of this.fetchTransactionBlocksWithProgress(
            checkpointRange,
            undefined,
            inputObject,
            functionFilter,
        )) {
            // Check if stop was requested
            if (this.stopRequested) {
                console.log('Stopping transaction fetch due to user request');
                break;
            }

            finalData = progress.data;
            if (onProgress) {
                onProgress(
                    progress.data,
                    progress.isComplete,
                    progress.processedTransactions,
                    progress.processedCheckpoints,
                    progress.totalCheckpoints,
                );
            }
        }

        return finalData!;
    }

    async fetchLimitedTransactionBlocks(
        transactionLimit: number,
        epoch?: string | number,
        startCheckpoint?: string | number,
        endCheckpoint?: string | number,
        onProgress?: (
            data: DisplayData,
            isComplete: boolean,
            processedTransactions: number,
            processedCheckpoints: number,
            totalCheckpoints: number,
        ) => void,
        inputObject?: string,
        functionFilter?: string,
    ): Promise<DisplayData> {
        this.resetStopFlag(); // Reset stop flag at the beginning
        const checkpointRange = await this.resolveCheckpointRange(
            epoch,
            startCheckpoint,
            endCheckpoint,
        );
        let finalData: DisplayData | null = null;

        for await (const progress of this.fetchTransactionBlocksWithProgress(
            checkpointRange,
            transactionLimit,
            inputObject,
            functionFilter,
        )) {
            // Check if stop was requested
            if (this.stopRequested) {
                console.log('Stopping limited transaction fetch due to user request');
                break;
            }

            finalData = progress.data;
            if (onProgress) {
                onProgress(
                    progress.data,
                    progress.isComplete,
                    progress.processedTransactions,
                    progress.processedCheckpoints,
                    progress.totalCheckpoints,
                );
            }
        }

        return finalData!;
    }
}

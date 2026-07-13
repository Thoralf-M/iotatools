import { base64Decode as fromBase64 } from '../../utils/wasm-sdk';
import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';

import type { CheckpointRange, RawTransactionBlock } from '../../utils/graphql-types';

export interface CheckpointData {
    sequenceNumber: number;
    timestamp: string;
    transactionCount: number;
}

export interface ProcessedTransaction {
    digest: string;
    sender?: string;
    gasUsed?: any;
    timestamp?: string;
    effects?: any;
    decodedBCS?: any;
}

export interface PublishedPackage {
    packageId: string;
    sender: string;
    version: string;
    txId: string;
    modules?: string[];
}

export interface TransactionData {
    totalPTBs: number;
    failedPTBs: number;
    uniqueSenders: Set<string>;
    calledPackages: Set<string>;
    calledFunctions: Set<string>;
    publishedPackages: Map<string, PublishedPackage>;
    senderCounts: Map<string, number>;
    packageCounts: Map<string, number>;
    rawData: any[];
    checkpointData: Map<number, CheckpointData>;
    transactionsByCheckpoint: Map<number, any[]>;
    commandTypeStats: Map<string, { count: number; digests: string[] }>;
}

export interface DisplayData {
    totalPTBs: number;
    failedPTBs: number;
    uniqueSendersCount: number;
    calledPackagesCount: number;
    calledFunctionsCount: number;
    publishedPackagesCount: number;
    uniqueSendersList: { address: string; txCount: number }[];
    calledPackagesList: { package: string; callCount: number }[];
    publishedPackagesList: PublishedPackage[];
    // Transaction IDs are limited to 20 per function
    calledFunctionsList: {
        package: string;
        module: string;
        function: string;
        fullName: string;
        callCount: number;
        transactionIds: string[];
    }[];
    commandTypeStats: { type: string; count: number; digests: string[] }[];
    checkpointRange: { first: number; last: number } | null;
    checkpointData: CheckpointData[];
    transactionsByCheckpoint: Map<number, any[]>;
}

export class TransactionDataProcessor {
    private transactionData: TransactionData;

    constructor() {
        this.transactionData = this.createEmptyTransactionData();
    }

    private createEmptyTransactionData(): TransactionData {
        return {
            totalPTBs: 0,
            failedPTBs: 0,
            uniqueSenders: new Set<string>(),
            calledPackages: new Set<string>(),
            calledFunctions: new Set<string>(),
            publishedPackages: new Map<string, PublishedPackage>(),
            senderCounts: new Map<string, number>(),
            packageCounts: new Map<string, number>(),
            rawData: [],
            checkpointData: new Map<number, CheckpointData>(),
            transactionsByCheckpoint: new Map<number, any[]>(),
            commandTypeStats: new Map<string, { count: number; digests: string[] }>(),
        };
    }

    private resetData(): void {
        this.transactionData = this.createEmptyTransactionData();
    }

    processTransactionBatch(transactions: RawTransactionBlock[]): void {
        for (const tx of transactions) {
            this.processTransactionBlock(tx);
        }
    }

    private processTransactionBlock(tx: RawTransactionBlock): void {
        this.transactionData.totalPTBs++;

        if (tx.effects?.status !== 'SUCCESS') {
            this.transactionData.failedPTBs++;
        }

        // Decode BCS transaction data for PTB analysis
        let decodedData: any = null;
        if (tx.effects?.transactionBlock?.bcs) {
            try {
                decodedData = IotaBcs.SenderSignedData.parse(
                    new Uint8Array(fromBase64(tx.effects.transactionBlock.bcs)),
                )[0];
            } catch (e2) {
                console.warn('Failed to decode BCS data for transaction:', tx.digest, e2);
            }
        }

        // Add decoded data to the transaction for frontend use
        if (decodedData) {
            (tx as any).decodedBCS = decodedData;
        }

        // Track checkpoint data for graphing
        const checkpointSeq = tx.effects?.checkpoint?.sequenceNumber;
        const checkpointTimestamp = tx.effects?.checkpoint?.timestamp;
        if (checkpointSeq !== undefined && checkpointSeq !== null && checkpointTimestamp) {
            if (!this.transactionData.checkpointData.has(checkpointSeq)) {
                this.transactionData.checkpointData.set(checkpointSeq, {
                    sequenceNumber: checkpointSeq,
                    timestamp: checkpointTimestamp,
                    transactionCount: 0,
                });
            }
            this.transactionData.checkpointData.get(checkpointSeq)!.transactionCount++;

            // Store transaction by checkpoint for easy lookup
            if (!this.transactionData.transactionsByCheckpoint.has(checkpointSeq)) {
                this.transactionData.transactionsByCheckpoint.set(checkpointSeq, []);
            }
            this.transactionData.transactionsByCheckpoint.get(checkpointSeq)!.push(tx);
        }

        // Track unique senders and their transaction counts
        let senderAddress = null;
        if (tx.sender?.address) {
            senderAddress = tx.sender.address;
        } else if (decodedData?.intentMessage?.value?.V1?.sender) {
            senderAddress = decodedData.intentMessage.value.V1.sender;
        }

        if (senderAddress) {
            this.transactionData.uniqueSenders.add(senderAddress);
            const currentCount = this.transactionData.senderCounts.get(senderAddress) || 0;
            this.transactionData.senderCounts.set(senderAddress, currentCount + 1);
        }

        // Extract PTB commands for package tracking
        this.extractPTBCommands(decodedData, tx.digest);

        // Extract published packages from transaction
        this.extractPublishedPackages(tx, senderAddress);

        // Store the raw transaction data
        this.transactionData.rawData.push(tx);
    }

    private extractPTBCommands(decodedData: any, txDigest: string): void {
        let ptbCommands: any[] = [];

        if (decodedData?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands) {
            ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
        }

        // Track called packages from decoded PTB commands
        for (const command of ptbCommands) {
            // Track command type and up to 20 digests
            const commandType = Object.keys(command)[0];
            if (commandType) {
                let stats = this.transactionData.commandTypeStats.get(commandType);
                if (!stats) {
                    stats = { count: 0, digests: [] };
                    this.transactionData.commandTypeStats.set(commandType, stats);
                }
                stats.count++;
                if (txDigest && !stats.digests.includes(txDigest) && stats.digests.length < 20) {
                    stats.digests.push(txDigest);
                }
            }

            if (command.MoveCall) {
                const moveCall = command.MoveCall;
                const packageId = moveCall.package;
                const module = moveCall.module;
                const functionName = moveCall.function;

                if (packageId) {
                    this.transactionData.calledPackages.add(packageId);

                    // Count package calls
                    const currentPackageCount =
                        this.transactionData.packageCounts.get(packageId) || 0;
                    this.transactionData.packageCounts.set(packageId, currentPackageCount + 1);

                    // Create full function signature
                    const fullFunctionName = `${packageId}::${module}::${functionName}`;
                    this.transactionData.calledFunctions.add(fullFunctionName);
                }
            }
        }
    }

    private extractPublishedPackages(tx: RawTransactionBlock, senderAddress: string | null): void {
        // Check if transaction has Publish command
        let ptbCommands: any[] = [];
        const decodedData = (tx as any).decodedBCS;

        if (decodedData?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands) {
            ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
        }

        const hasPublishCommand = ptbCommands.some((cmd: any) => cmd.Publish);

        if (!hasPublishCommand || !senderAddress) {
            return;
        }

        // Extract published packages from objectChanges
        const objectChanges = tx.effects?.objectChanges?.nodes || [];
        const txId = tx.digest || '';

        for (const change of objectChanges) {
            // Check for package from asMoveObject
            if (change.outputState?.asMoveObject?.contents?.json?.package) {
                if (!change.outputState?.asMoveObject?.contents?.json?.package.startsWith('0x')) {
                    continue; // Skip without 0x prefix, because then it's not from a publish command
                }
                const packageData = change.outputState.asMoveObject.contents.json;
                const publishedPackage: PublishedPackage = {
                    packageId: packageData.package,
                    sender: senderAddress,
                    version: packageData.version || '1',
                    txId: txId,
                };

                // Use package ID as key to avoid duplicates
                this.transactionData.publishedPackages.set(packageData.package, publishedPackage);
            }

            // Check for modules from asMovePackage
            if (change.outputState?.asMovePackage?.modules?.nodes) {
                // Find the corresponding package ID from the same change or use the address
                const packageId = change.address || change.idCreated;
                if (packageId && packageId.startsWith('0x')) {
                    const moduleNames = change.outputState.asMovePackage.modules.nodes
                        .map((module: any) => module.name)
                        .filter((name: string) => name);

                    // If we already have this package, update it with modules
                    const existingPackage = this.transactionData.publishedPackages.get(packageId);
                    if (existingPackage) {
                        existingPackage.modules = moduleNames;
                    } else {
                        // Create new package entry
                        const publishedPackage: PublishedPackage = {
                            packageId: packageId,
                            sender: senderAddress,
                            version: '1',
                            txId: txId,
                            modules: moduleNames,
                        };
                        this.transactionData.publishedPackages.set(packageId, publishedPackage);
                    }
                }
            }
        }
    }

    createDisplayData(checkpointRange: CheckpointRange): DisplayData {
        // Build detailed function list with call counts and transaction IDs
        const functionMap = new Map<
            string,
            {
                package: string;
                module: string;
                function: string;
                fullName: string;
                callCount: number;
                transactionIds: string[];
            }
        >();

        for (const tx of this.transactionData.rawData) {
            // Extract PTB commands from decoded BCS data
            let ptbCommands: any[] = [];

            // Handle the actual decoded structure: intentMessage.value.V1.kind.ProgrammableTransaction.commands
            if (
                (tx as any).decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction
                    ?.commands
            ) {
                ptbCommands = (tx as any).decodedBCS.intentMessage.value.V1.kind
                    .ProgrammableTransaction.commands;
            }

            // console.log("ptbCommands:", ptbCommands);
            // Process commands to build function map
            for (const command of ptbCommands) {
                if (command.MoveCall) {
                    const moveCall = command.MoveCall;
                    const packageId = moveCall.package;
                    const module = moveCall.module;
                    const functionName = moveCall.function;

                    if (packageId && module && functionName) {
                        const fullFunctionName = `${packageId}::${module}::${functionName}`;
                        if (!functionMap.has(fullFunctionName)) {
                            functionMap.set(fullFunctionName, {
                                package: packageId,
                                module: module,
                                function: functionName,
                                fullName: fullFunctionName,
                                callCount: 0,
                                transactionIds: [],
                            });
                        }
                        const funcData = functionMap.get(fullFunctionName)!;
                        funcData.callCount++;
                        // Add transaction digest to the list if not already present and limit to 20
                        if (
                            !funcData.transactionIds.includes(tx.digest) ||
                            funcData.transactionIds.length > 20
                        ) {
                            funcData.transactionIds.push(tx.digest);
                        }
                    }
                }
            }
        }

        const commandTypeStats = Array.from(this.transactionData.commandTypeStats.entries())
            .map(([type, stat]) => ({
                type,
                count: stat.count,
                digests: stat.digests.slice(0, 20),
            }))
            .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));

        return {
            totalPTBs: this.transactionData.totalPTBs,
            failedPTBs: this.transactionData.failedPTBs,
            uniqueSendersCount: this.transactionData.uniqueSenders.size,
            calledPackagesCount: this.transactionData.calledPackages.size,
            calledFunctionsCount: this.transactionData.calledFunctions.size,
            publishedPackagesCount: this.transactionData.publishedPackages.size,
            uniqueSendersList: Array.from(this.transactionData.senderCounts.entries())
                .map(([address, txCount]) => ({ address, txCount }))
                .sort((a, b) => b.txCount - a.txCount || a.address.localeCompare(b.address)),
            calledPackagesList: Array.from(this.transactionData.packageCounts.entries())
                .map(([packageAddress, callCount]) => ({ package: packageAddress, callCount }))
                .sort((a, b) => b.callCount - a.callCount || a.package.localeCompare(b.package)),
            publishedPackagesList: Array.from(this.transactionData.publishedPackages.values()).sort(
                (a, b) => a.packageId.localeCompare(b.packageId),
            ),
            calledFunctionsList: Array.from(functionMap.values()).sort(
                (a, b) => b.callCount - a.callCount || a.fullName.localeCompare(b.fullName),
            ),
            checkpointRange,
            checkpointData: Array.from(this.transactionData.checkpointData.values()).sort(
                (a, b) => a.sequenceNumber - b.sequenceNumber,
            ),
            transactionsByCheckpoint: this.transactionData.transactionsByCheckpoint,
            commandTypeStats,
        };
    }

    getCheckpointTransactions(checkpointNum: string | number): ProcessedTransaction[] {
        const sequenceNumber = parseInt(checkpointNum.toString());

        const transactions =
            this.transactionData.transactionsByCheckpoint.get(sequenceNumber) || [];

        return transactions.map((tx: any) => ({
            digest: tx.digest,
            sender:
                tx.sender?.address || tx.decodedBCS?.intentMessage?.value?.V1?.sender || 'Unknown',
            gasUsed: tx.effects?.gasEffects?.gasUsed || null,
            timestamp: tx.effects?.checkpoint?.timestamp || null,
            effects: tx.effects || null,
            decodedBCS: tx.decodedBCS || null,
        }));
    }

    calculateProgress(checkpointRange: CheckpointRange): {
        processedCheckpoints: number;
        totalCheckpoints: number;
        minCheckpointSeen: number | null;
        maxCheckpointSeen: number | null;
    } {
        let minCheckpointSeen: number | null = null;
        let maxCheckpointSeen: number | null = null;

        // Find the range of checkpoints we've actually seen
        for (const checkpointSeq of this.transactionData.checkpointData.keys()) {
            if (minCheckpointSeen === null || checkpointSeq < minCheckpointSeen) {
                minCheckpointSeen = checkpointSeq;
            }
            if (maxCheckpointSeen === null || checkpointSeq > maxCheckpointSeen) {
                maxCheckpointSeen = checkpointSeq;
            }
        }

        // Calculate progress based on checkpoint range coverage
        let progressBasedOnRange = 0;
        if (maxCheckpointSeen !== null) {
            progressBasedOnRange = Math.max(0, maxCheckpointSeen - checkpointRange.first + 1);
        }

        const checkpointRangeSize = checkpointRange.last - checkpointRange.first + 1;

        return {
            processedCheckpoints: progressBasedOnRange,
            totalCheckpoints: checkpointRangeSize,
            minCheckpointSeen,
            maxCheckpointSeen,
        };
    }

    reset(): void {
        this.resetData();
    }

    gettotalPTBs(): number {
        return this.transactionData.totalPTBs;
    }
}

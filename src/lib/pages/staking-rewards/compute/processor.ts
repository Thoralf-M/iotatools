import {
    exchangeRateCache,
    fetchAllExchangeRates,
    fetchPoolExchangeRates,
    fetchSystemState,
    type CurrentStakeInfo,
} from '../graphql-requests';
import { computeRewardsForStakeObject } from './rewards-calculator';
import type { ActionDetails, ProcessStakeTransactionsResult, StakeObject } from './types';
import { getIotaAmount, getTokenAmount, safeBigInt } from './utils';
import {
    getCurrentActiveValidatorsExchangeRateIds,
    getInactiveValidatorsExchangeRateIds,
    getValidatorInfo,
} from './validator-utils';

/**
 * Options for time-frame-aware processing.
 *
 * Constraints when a startEpoch is set:
 * - Transactions before startEpoch are skipped during processing.
 * - currentStakeObjects (from getStakes) supplements the transaction-derived
 *   objects to catch stakes whose creation predates startEpoch.
 * - For objects whose creation tx was skipped, firstEpoch is reset DOWN to
 *   stakeActivationEpoch so the rewards calculator treats them identically
 *   to a full (non-filtered) run; otherwise the calculator would assume the
 *   object was transferred at firstEpoch and under-count early rewards.
 * - Processing always runs to currentEpoch (not the display end date) because
 *   objects may be unstaked after the display range. Skipping those transactions
 *   would lose them entirely — they wouldn't appear in current objects either.
 */
export type ProcessingOptions = {
    /** Skip transactions before this epoch. Must still process to currentEpoch. */
    startEpoch?: number;
    /** Currently staked objects fetched via getStakes(). Fills gaps from skipped transactions. */
    currentStakeObjects?: CurrentStakeInfo[];
};

// Types for internal processing
type StakeObjectData = {
    input?: {
        poolId: string;
        principal: string;
        owner?: string;
        stakeActivationEpoch?: string;
    };
    output?: {
        poolId: string;
        principal: string;
        owner?: string;
        stakeActivationEpoch?: string;
    };
    idCreated: boolean;
    idDeleted: boolean;
    isTimelockedInput?: boolean;
};

type CoinObject = {
    address: string;
    balance: string;
    owner?: string;
};

type TimelockObject = {
    address: string;
    lockedAmount: string;
    owner?: string;
};

// Extract stake object data from node state
function extractStakeObjectData(node: any): StakeObjectData | null {
    const outputState = node.outputState?.asMoveObject?.contents;
    const inputState = node.inputState?.asMoveObject?.contents;
    const idCreated = node.idCreated === true;
    const idDeleted = node.idDeleted === true;

    const stakeData: any = {};

    // Extract input state data
    if (inputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
        const stakedIota = inputState.json?.staked_iota;
        stakeData.input = {
            poolId: stakedIota?.pool_id ?? '',
            principal: stakedIota?.principal?.value ?? '',
            owner: node.inputState.asMoveObject?.owner?.owner?.address,
            stakeActivationEpoch: stakedIota?.stake_activation_epoch,
        };
        stakeData.isTimelockedInput = true;
    } else if (inputState?.type?.repr?.includes('staking_pool::StakedIota')) {
        stakeData.input = {
            poolId: inputState.json?.pool_id ?? '',
            principal: inputState.json?.principal?.value ?? '',
            owner: node.inputState.asMoveObject?.owner?.owner?.address,
            stakeActivationEpoch: inputState.json?.stake_activation_epoch,
        };
    }

    // Extract output state data
    if (outputState?.type?.repr?.includes('timelocked_staking::TimelockedStakedIota')) {
        const stakedIota = outputState.json?.staked_iota;
        stakeData.output = {
            poolId: stakedIota?.pool_id ?? '',
            principal: stakedIota?.principal?.value ?? '',
            owner: node.outputState.asMoveObject?.owner?.owner?.address,
            stakeActivationEpoch: stakedIota?.stake_activation_epoch,
        };
    } else if (outputState?.type?.repr?.includes('staking_pool::StakedIota')) {
        stakeData.output = {
            poolId: outputState.json?.pool_id ?? '',
            principal: outputState.json?.principal?.value ?? '',
            owner: node.outputState.asMoveObject?.owner?.owner?.address,
            stakeActivationEpoch: outputState.json?.stake_activation_epoch,
        };
    }

    if (stakeData.input || stakeData.output) {
        return {
            ...stakeData,
            idCreated,
            idDeleted,
        };
    }

    return null;
}

// Extract coin object data from node state
function extractCoinObjectData(node: any): CoinObject | null {
    const address = node.address;
    const outputState = node.outputState?.asMoveObject?.contents;
    const idCreated = node.idCreated === true;

    // Collect coin objects that were created (potential unstake rewards)
    if (idCreated && outputState?.type?.repr?.includes('::coin::Coin')) {
        let balance = outputState.json?.balance;
        // Handle balance as either string or object with value property
        if (typeof balance === 'object' && balance?.value) {
            balance = balance.value;
        }
        const owner = node.outputState?.asMoveObject?.owner?.owner?.address;
        if (balance && owner && typeof balance === 'string') {
            return { address, balance, owner };
        }
    }

    return null;
}

// Extract timelock object data from node state
function extractTimelockObjectData(node: any): TimelockObject | null {
    const address = node.address;
    const outputState = node.outputState?.asMoveObject?.contents;
    const idCreated = node.idCreated === true;

    // Collect timelock objects that were created (potential unstaked principal)
    if (idCreated && outputState?.type?.repr?.includes('::timelock::TimeLock')) {
        let lockedAmount = outputState.json?.locked;
        // Handle locked amount as either string or object with value property
        if (typeof lockedAmount === 'object' && lockedAmount?.value) {
            lockedAmount = lockedAmount.value;
        }
        const owner = node.outputState?.asMoveObject?.owner?.owner?.address;
        if (lockedAmount && owner && typeof lockedAmount === 'string') {
            return { address, lockedAmount, owner };
        }
    }

    return null;
}

// Parse transaction to extract stake and coin object changes
function parseTransactionObjects(transaction: any): {
    txStakeObjects: Map<string, StakeObjectData>;
    coinObjects: CoinObject[];
    timelockObjects: TimelockObject[];
} {
    const txStakeObjects = new Map<string, StakeObjectData>();
    const coinObjects: CoinObject[] = [];
    const timelockObjects: TimelockObject[] = [];

    // First pass: collect all stake object changes, coin objects, and timelock objects
    transaction.effects.objectChanges.nodes.forEach((node: any) => {
        const address = node.address;

        // Extract coin objects
        const coinData = extractCoinObjectData(node);
        if (coinData) {
            coinObjects.push(coinData);
        }

        // Extract timelock objects
        const timelockData = extractTimelockObjectData(node);
        if (timelockData) {
            timelockObjects.push(timelockData);
        }

        // Extract stake objects
        const stakeData = extractStakeObjectData(node);
        if (stakeData) {
            txStakeObjects.set(address, stakeData);
        }
    });

    return { txStakeObjects, coinObjects, timelockObjects };
}

// Create or update stake object based on output state
function createOrUpdateStakeObject(
    stakeObjects: Map<string, StakeObject>,
    address: string,
    input: StakeObjectData['input'],
    output: StakeObjectData['output'],
    epochId: number,
    currentEpoch: number,
    wasOwnedByTarget: boolean,
): void {
    if (!output) return;

    if (!stakeObjects.has(address)) {
        const stakeActivationEpoch = output.stakeActivationEpoch
            ? parseInt(output.stakeActivationEpoch)
            : input?.stakeActivationEpoch
              ? parseInt(input.stakeActivationEpoch)
              : epochId;
        stakeObjects.set(address, {
            objectId: address,
            wasOwnedByTargetAddress: wasOwnedByTarget,
            poolId: output.poolId,
            principalByEpoch: {},
            exchangeRatesByEpoch: {},
            rewardsByEpoch: {},
            accumulatedRewards: {},
            actionByEpoch: {},
            // Only set firstEpoch to this transaction's epoch if target owned the stake
            // Otherwise set to max epoch (will be updated when we see a transaction where target owned it)
            firstEpoch: wasOwnedByTarget ? epochId : currentEpoch,
            lastEpoch: currentEpoch,
            stakeActivationEpoch,
        });
    } else {
        // Update the flag if this transaction shows target ownership
        const existing = stakeObjects.get(address)!;
        if (wasOwnedByTarget) {
            existing.wasOwnedByTargetAddress = true;
            // Only update firstEpoch to an earlier epoch if target owned the stake at that epoch
            if (epochId < existing.firstEpoch) {
                existing.firstEpoch = epochId;
            }
        }
        // Don't automatically update lastEpoch to currentEpoch - let transfer logic handle it
    }

    const obj = stakeObjects.get(address)!;
    obj.principalByEpoch[epochId] = output.principal;
    obj.rewardsByEpoch[epochId] = '0';
    obj.accumulatedRewards[epochId] = '0';

    // Update stakeActivationEpoch if we have the real value
    if (output.stakeActivationEpoch) {
        obj.stakeActivationEpoch = parseInt(output.stakeActivationEpoch);
    } else if (input?.stakeActivationEpoch) {
        obj.stakeActivationEpoch = parseInt(input.stakeActivationEpoch);
    }
}

// Create stake object for input-only transactions (e.g., full unstake where object is deleted)
function createInputOnlyStakeObject(
    stakeObjects: Map<string, StakeObject>,
    address: string,
    input: StakeObjectData['input'],
    epochId: number,
): void {
    if (!input) return;

    if (!stakeObjects.has(address)) {
        stakeObjects.set(address, {
            objectId: address,
            wasOwnedByTargetAddress: true,
            poolId: input.poolId,
            principalByEpoch: {},
            exchangeRatesByEpoch: {},
            rewardsByEpoch: {},
            accumulatedRewards: {},
            actionByEpoch: {},
            firstEpoch: epochId,
            lastEpoch: epochId, // This object ends in this epoch
            stakeActivationEpoch: input.stakeActivationEpoch
                ? parseInt(input.stakeActivationEpoch)
                : epochId,
        });
    } else {
        // Update the flag if this transaction shows target ownership
        const existing = stakeObjects.get(address)!;
        existing.wasOwnedByTargetAddress = true;
        // For input-only transactions, this might be the final epoch for this object
        // But preserve the firstEpoch - only update lastEpoch
        existing.lastEpoch = epochId;
    }

    // Record the input principal so fillMissingPrincipalEntries has an anchor
    // at this epoch (mirrors how createOrUpdateStakeObject records output).
    // Applied in both create and update paths to keep behavior symmetric.
    const obj = stakeObjects.get(address)!;
    if (input.principal) {
        obj.principalByEpoch[epochId] = input.principal;
    }
}

// Helper function to calculate rewards based on principal amount and exchange rates
async function calculateRewardsFromExchangeRates(
    poolId: string,
    principalAmount: bigint,
    stakeActivationEpoch: number,
    currentEpoch: number,
): Promise<{ totalRewards: bigint; success: boolean }> {
    try {
        // Get baseline exchange rate (from before staking started)
        const baselineEpoch = stakeActivationEpoch;
        let baselineExchangeRate;
        let currentExchangeRate;

        // Try to get exchange rates from cache
        const cacheEntry = exchangeRateCache.get(poolId);

        if (cacheEntry && cacheEntry.epochData) {
            // Find baseline and current exchange rates
            const baselineData = cacheEntry.epochData[baselineEpoch];
            const currentData = cacheEntry.epochData[currentEpoch]; // Use previous epoch as "current"

            if (baselineData) {
                baselineExchangeRate = {
                    iota_amount: baselineData.iota,
                    pool_token_amount: baselineData.pool,
                };
            } else {
                // Fallback to 1:1 ratio
                baselineExchangeRate = {
                    iota_amount: '1',
                    pool_token_amount: '1',
                };
            }

            if (currentData) {
                currentExchangeRate = {
                    iota_amount: currentData.iota,
                    pool_token_amount: currentData.pool,
                };
            } else if (
                cacheEntry.deactivationEpoch !== undefined &&
                currentEpoch > cacheEntry.deactivationEpoch
            ) {
                // Pool is deactivated and the requested epoch is past deactivation:
                // exchange rates stop being published at deactivationEpoch, so
                // emergency withdrawals settle at the deactivation-epoch rate.
                // Using the coin-balance fallback here is unreliable for txs that
                // contain multiple operations (overstates rewards), which locks
                // totalUnstakeAccumulated > totalAccumulated for every subsequent
                // epoch.
                const deactivationData = cacheEntry.epochData[cacheEntry.deactivationEpoch];
                if (deactivationData) {
                    currentExchangeRate = {
                        iota_amount: deactivationData.iota,
                        pool_token_amount: deactivationData.pool,
                    };
                } else {
                    return { totalRewards: 0n, success: false };
                }
            } else {
                // If no exchange rate available, we can't calculate rewards
                return { totalRewards: 0n, success: false };
            }
        } else {
            // If no cache entry available, we can't calculate rewards
            return { totalRewards: 0n, success: false };
        }

        // Calculate pool token amount using baseline exchange rate
        const poolTokenAmount = getTokenAmount(baselineExchangeRate, principalAmount);

        // Calculate total IOTA amount using current exchange rate
        const totalIotaAmount = getIotaAmount(currentExchangeRate, poolTokenAmount);

        // Calculate rewards (total - principal)
        const totalRewards =
            totalIotaAmount > principalAmount ? totalIotaAmount - principalAmount : 0n;

        return { totalRewards, success: true };
    } catch (error) {
        console.warn('Failed to calculate rewards from exchange rates:', error);
        return { totalRewards: 0n, success: false };
    }
}

// Determine action details for a stake object transaction
async function determineActionDetails(
    input: StakeObjectData['input'],
    output: StakeObjectData['output'],
    idCreated: boolean,
    idDeleted: boolean,
    digest: string,
    timestamp: string,
    targetAddress: string,
    trackedAddresses: Set<string>,
    currentEpoch: number,
    epochId: number,
    existing: StakeObject,
    coinObjects: CoinObject[],
    timelockObjects: TimelockObject[],
    txStakeObjects: Map<string, StakeObjectData>,
    address: string,
): Promise<ActionDetails> {
    if (!input) {
        return { action: 'Unknown', digest, timestamp };
    }

    let actionDetails: ActionDetails = {
        action: 'Unknown',
        digest,
        timestamp,
    };

    if (idCreated) {
        actionDetails.action = 'Staked';
        actionDetails.amount = output?.principal || input.principal;
    } else if (idDeleted) {
        actionDetails.action = 'Unstaked';
        actionDetails.amount = input.principal;

        // Calculate rewards using exchange rates for the unstaked principal
        // This correctly handles cases where partial unstakes have already occurred
        const principalAmount = safeBigInt(input.principal);
        const exchangeRateResult = await calculateRewardsFromExchangeRates(
            input.poolId,
            principalAmount,
            existing.stakeActivationEpoch,
            epochId, // Use the epoch when unstake happened
        );

        if (exchangeRateResult.success) {
            actionDetails.totalRewards = exchangeRateResult.totalRewards.toString();
        } else {
            // Fallback: try to estimate from coins
            const ownerCoins = coinObjects.filter((coin) => coin.owner === input.owner);
            const totalCoinBalance = ownerCoins.reduce((sum, coin) => {
                return sum + safeBigInt(coin.balance);
            }, 0n);

            // For full unstake, coins contain principal + rewards
            const rewards =
                totalCoinBalance > principalAmount ? totalCoinBalance - principalAmount : 0n;
            actionDetails.totalRewards = rewards.toString();
        }

        existing.lastEpoch = epochId;
    } else if (!idCreated && !idDeleted) {
        if (input.owner && output?.owner && input.owner !== output.owner) {
            actionDetails.action = 'Transfer';
            actionDetails.fromAddress = input.owner;
            actionDetails.toAddress = output.owner;

            const fromTracked = trackedAddresses.has(input.owner);
            const toTracked = trackedAddresses.has(output.owner);

            if (fromTracked && toTracked) {
                // Intra-tracked transfer: same user moving stake between their own
                // addresses. Treat as continuation — don't set transferredInEpoch
                // (no pre-transfer rewards to strip) and don't truncate lastEpoch.
                if (existing.lastEpoch < currentEpoch) {
                    existing.lastEpoch = currentEpoch;
                }
            } else if (existing.wasOwnedByTargetAddress && output.owner !== targetAddress) {
                // Transfer from tracked target to untracked external address:
                // stop tracking rewards from this epoch onwards.
                existing.lastEpoch = epochId;
            } else if (output.owner === targetAddress) {
                // Transfer from untracked external address INTO tracked target:
                // record transfer epoch so pre-transfer rewards are subtracted
                // from Available Rewards.
                existing.transferredInEpoch = epochId;
                if (existing.lastEpoch < currentEpoch) {
                    existing.lastEpoch = currentEpoch;
                }
            }
        } else {
            // Check if this is a partial unstake
            const inputPrincipal = safeBigInt(input.principal);
            const outputPrincipal = safeBigInt(output?.principal || '0');
            const principalDecrease = inputPrincipal - outputPrincipal;

            // Find coins created for this owner in this transaction
            const ownerCoins = coinObjects.filter((coin) => coin.owner === input.owner);
            const totalCoinBalance = ownerCoins.reduce((sum, coin) => {
                return sum + safeBigInt(coin.balance);
            }, 0n);

            // Find timelock objects created for this owner in this transaction
            const ownerTimelocks = timelockObjects.filter(
                (timelock) => timelock.owner === input.owner,
            );
            const totalTimelockAmount = ownerTimelocks.reduce((sum, timelock) => {
                return sum + safeBigInt(timelock.lockedAmount);
            }, 0n);

            // Detect merged stake objects (deleted objects in this transaction) BEFORE calculating rewards
            // This is needed to correctly calculate rewards when coins include merged stakes' principal
            const mergedObjects: Array<{ objectId: string; amount: string }> = [];
            const splitObjects: Array<{ objectId: string; amount: string }> = [];
            let mergedPrincipalTotal = 0n;

            txStakeObjects.forEach((otherStakeData, otherAddress) => {
                if (otherAddress !== address) {
                    if (otherStakeData.idDeleted && otherStakeData.input) {
                        // This object was deleted and merged into our current object
                        mergedObjects.push({
                            objectId: otherAddress,
                            amount: otherStakeData.input.principal,
                        });
                        mergedPrincipalTotal += safeBigInt(otherStakeData.input.principal);
                    } else if (otherStakeData.idCreated && otherStakeData.output) {
                        // This object was created, potentially split from our current object
                        splitObjects.push({
                            objectId: otherAddress,
                            amount: otherStakeData.output.principal,
                        });
                    }
                }
            });

            if (principalDecrease > 0n && ownerCoins.length > 0) {
                // This is a partial unstake
                actionDetails.action = 'Partial Unstake';
                actionDetails.amount = principalDecrease.toString(); // Amount unstaked

                // Calculate rewards based on exchange rates
                const exchangeRateResult = await calculateRewardsFromExchangeRates(
                    input.poolId,
                    principalDecrease, // Use the unstaked amount for reward calculation
                    existing.stakeActivationEpoch,
                    epochId,
                );

                if (exchangeRateResult.success) {
                    actionDetails.totalRewards = exchangeRateResult.totalRewards.toString();
                } else {
                    // Fallback to coin-based calculation if exchange rates are not available
                    console.warn(
                        `Exchange rate calculation failed for pool ${input.poolId}, falling back to coin-based calculation`,
                    );

                    if (totalTimelockAmount > 0n) {
                        // Timelocked staking scenario: coins contain only rewards,
                        // unstaked principal goes into timelock
                        actionDetails.totalRewards = totalCoinBalance.toString();
                    } else {
                        // Normal staking scenario: coins contain principal + rewards
                        // When merged stake objects exist, totalCoinBalance includes their principal + rewards
                        // We need to subtract both the unstaked principal AND the merged principals
                        const totalPrincipalInCoins = principalDecrease + mergedPrincipalTotal;
                        const rewards = totalCoinBalance - totalPrincipalInCoins;
                        if (rewards > 0n) {
                            actionDetails.totalRewards = rewards.toString();
                        }
                    }
                }

                // Record principal change
                actionDetails.principalChange = {
                    from: input.principal,
                    to: output?.principal || '0',
                };
            } else {
                actionDetails.action = 'Transition';

                // Check for principal changes
                if (input.principal !== output?.principal) {
                    actionDetails.principalChange = {
                        from: input.principal,
                        to: output?.principal || '0',
                    };
                }
            }

            if (mergedObjects.length > 0) {
                actionDetails.mergedStakeObjects = mergedObjects;
            }
            if (splitObjects.length > 0) {
                actionDetails.splitStakeObjects = splitObjects;
            }
        }
    }

    return actionDetails;
}

// Process all transactions to build stake objects
async function processTransactions(
    transactions: Array<any>,
    currentEpoch: number,
    targetAddress: string,
    trackedAddresses: Set<string> = new Set([targetAddress]),
): Promise<Map<string, StakeObject>> {
    const stakeObjects = new Map<string, StakeObject>();

    // Sort transactions by epoch and then by timestamp for correct chronological processing
    const sortedTransactions = transactions.sort((a, b) => {
        const epochA = a.effects.epoch.epochId;
        const epochB = b.effects.epoch.epochId;
        if (epochA !== epochB) {
            return epochA - epochB;
        }
        // Within same epoch, sort by timestamp
        const timestampA = a.effects.timestamp || '';
        const timestampB = b.effects.timestamp || '';
        return timestampA.localeCompare(timestampB);
    });

    for (const transaction of sortedTransactions) {
        const epochId = transaction.effects.epoch.epochId;
        const digest = transaction.digest;
        const timestamp = transaction.effects.timestamp || '';

        const { txStakeObjects, coinObjects, timelockObjects } =
            parseTransactionObjects(transaction);

        // Identify timelocked unlock pairs: a deleted TimelockedStakedIota paired with
        // a created/updated StakedIota in the same transaction (matching pool + principal).
        // Maps address -> paired address for both directions.
        const unlockPairs = new Map<string, string>();
        for (const [addr, data] of txStakeObjects) {
            if (!data.idDeleted || !data.isTimelockedInput || !data.input) continue;
            for (const [otherAddr, other] of txStakeObjects) {
                if (
                    other.isTimelockedInput ||
                    other.idDeleted ||
                    !other.output ||
                    unlockPairs.has(otherAddr) ||
                    other.output.poolId !== data.input.poolId ||
                    other.output.principal !== data.input.principal
                )
                    continue;
                unlockPairs.set(addr, otherAddr);
                unlockPairs.set(otherAddr, addr);
                break;
            }
        }

        // Second pass: process each stake object and determine detailed actions
        for (const [address, stakeData] of txStakeObjects) {
            const { input, output, idCreated, idDeleted } = stakeData;

            // Check if this object was ever owned by the target address
            const wasOwnedByTarget =
                input?.owner === targetAddress || output?.owner === targetAddress;

            // Create or update stake objects based on output state
            if (output) {
                createOrUpdateStakeObject(
                    stakeObjects,
                    address,
                    input,
                    output,
                    epochId,
                    currentEpoch,
                    wasOwnedByTarget,
                );

                // Synthesize a Staked action for pure-creation txs (the action
                // block below only runs when `input` is present, so new stake
                // objects created from scratch were missing an action entry at
                // their firstEpoch — leaving pre-active rows blank even when
                // the stake tx itself is known).
                if (idCreated && !input && wasOwnedByTarget) {
                    const existing = stakeObjects.get(address);
                    if (existing) {
                        existing.actionByEpoch = existing.actionByEpoch || {};
                        if (!existing.actionByEpoch[epochId]) {
                            existing.actionByEpoch[epochId] = [];
                        }
                        existing.actionByEpoch[epochId].push({
                            action: 'Staked',
                            digest,
                            timestamp,
                            amount: output.principal,
                        });
                    }
                }
            }

            // Determine action type and create detailed action info
            if (input) {
                // Check if this object was ever owned by the target address
                const wasOwnedByTarget =
                    input?.owner === targetAddress || output?.owner === targetAddress;

                // If this is an input-only object (no output), we still need to track it
                // if it was owned by the target address
                if (!output && wasOwnedByTarget) {
                    createInputOnlyStakeObject(stakeObjects, address, input, epochId);
                }

                const existing = stakeObjects.get(address);
                if (existing) {
                    // Update the flag if this transaction shows target ownership
                    if (wasOwnedByTarget) {
                        existing.wasOwnedByTargetAddress = true;
                    }

                    let actionDetails: ActionDetails;

                    // Timelocked unlock: the deleted TimelockedStakedIota becomes 'Unlocked'
                    // instead of going through the normal action detection
                    if (stakeData.isTimelockedInput && unlockPairs.has(address)) {
                        actionDetails = {
                            action: 'Unlocked',
                            digest,
                            timestamp,
                            amount: input.principal,
                        };
                        existing.lastEpoch = epochId;
                    } else {
                        actionDetails = await determineActionDetails(
                            input,
                            output,
                            idCreated,
                            idDeleted,
                            digest,
                            timestamp,
                            targetAddress,
                            trackedAddresses,
                            currentEpoch,
                            epochId,
                            existing,
                            coinObjects,
                            timelockObjects,
                            txStakeObjects,
                            address,
                        );
                    }

                    existing.actionByEpoch = existing.actionByEpoch || {};
                    if (!existing.actionByEpoch[epochId]) {
                        existing.actionByEpoch[epochId] = [];
                    }
                    existing.actionByEpoch[epochId].push(actionDetails);

                    // Sort actions by timestamp to ensure chronological order
                    existing.actionByEpoch[epochId].sort((a, b) => {
                        const tsA = a.timestamp || '';
                        const tsB = b.timestamp || '';
                        return tsA.localeCompare(tsB);
                    });
                }
            }

            // Add 'Unlocked' action for the StakedIota extracted from a timelocked unlock
            if (output && !stakeData.isTimelockedInput && unlockPairs.has(address)) {
                const existing = stakeObjects.get(address);
                if (existing) {
                    existing.actionByEpoch = existing.actionByEpoch || {};
                    if (!existing.actionByEpoch[epochId]) {
                        existing.actionByEpoch[epochId] = [];
                    }
                    existing.actionByEpoch[epochId].push({
                        action: 'Unlocked',
                        digest,
                        timestamp,
                        amount: output.principal,
                    });
                }
            }
        }
    }

    return stakeObjects;
}

// Finalize lastEpoch for a stake object based on all collected actions
// This is called after merging stake objects from all addresses to ensure
// correct lastEpoch even when multiple actions happen in the same epoch
function finalizeLastEpoch(stakeObject: StakeObject, _currentEpoch: number): void {
    if (!stakeObject.actionByEpoch) return;

    // Get all epochs with actions, sorted
    const epochsWithActions = Object.keys(stakeObject.actionByEpoch)
        .map(Number)
        .sort((a, b) => a - b);

    if (epochsWithActions.length === 0) return;

    // Check each epoch for unstake actions (full unstake takes priority)
    for (const epoch of epochsWithActions) {
        const actions = stakeObject.actionByEpoch[epoch];

        // If there's an Unstaked action, that definitively ends the stake object
        const hasUnstake = actions.some((a) => a.action === 'Unstaked');
        if (hasUnstake) {
            stakeObject.lastEpoch = epoch;
            return; // No need to check further epochs - this object is gone
        }
    }

    // If no unstake found, check for transfers to determine if we should track
    // The lastEpoch should be the last epoch where the object was owned by a target address
    // This is handled during processing, but we need to ensure consistency
}

// Filter stake objects to only include those owned by target address
function filterOwnedStakeObjects(stakeObjects: Map<string, StakeObject>): {
    ownedStakeObjects: Map<string, StakeObject>;
    requiredPoolIds: Set<string>;
} {
    const requiredPoolIds = new Set<string>();
    const ownedStakeObjects = new Map<string, StakeObject>();

    stakeObjects.forEach((stakeObject, address) => {
        // Check if this stake object was ever owned by the target address
        if (stakeObject.wasOwnedByTargetAddress) {
            ownedStakeObjects.set(address, stakeObject);
            requiredPoolIds.add(stakeObject.poolId);
        }
    });

    return { ownedStakeObjects, requiredPoolIds };
}

// Fill in missing principal entries for active epochs
function fillMissingPrincipalEntries(stakeObject: StakeObject): void {
    // Generate all epochs where this stake object was owned by the target address.
    // Use the later of stakeActivationEpoch and firstEpoch as the start:
    // - For regular stakes, firstEpoch <= stakeActivationEpoch, so stakeActivationEpoch is used
    // - For transferred stakes, firstEpoch > stakeActivationEpoch, so firstEpoch is used
    //   (avoids retroactively filling principal for epochs before the target owned the stake)
    const startEpoch = Math.max(stakeObject.stakeActivationEpoch, stakeObject.firstEpoch);
    const activeEpochs: number[] = [];
    for (let epoch = startEpoch; epoch <= stakeObject.lastEpoch; epoch++) {
        activeEpochs.push(epoch);
    }

    // Fill in missing principal entries by carrying forward the previous epoch's value
    // First, find the initial principal amount from any existing epoch
    let lastKnownPrincipal: string | undefined;
    const existingEpochs = Object.keys(stakeObject.principalByEpoch)
        .map(Number)
        .sort((a, b) => a - b);
    if (existingEpochs.length > 0) {
        lastKnownPrincipal = stakeObject.principalByEpoch[existingEpochs[0]];
    }

    // Fill in all active epochs with principal amounts
    for (const epoch of activeEpochs) {
        if (stakeObject.principalByEpoch[epoch]) {
            // Update the last known principal if we have a value for this epoch
            lastKnownPrincipal = stakeObject.principalByEpoch[epoch];
        } else if (lastKnownPrincipal) {
            // If no entry exists for this epoch, carry forward the last known value
            stakeObject.principalByEpoch[epoch] = lastKnownPrincipal;
            stakeObject.rewardsByEpoch[epoch] = '0';
            stakeObject.accumulatedRewards[epoch] = '0';
        }
    }
}

// Fetch exchange rates for a stake object
async function fetchExchangeRatesForStakeObject(
    stakeObject: StakeObject,
    exchangeRateId: string,
    currentEpoch: number,
): Promise<void> {
    // Only fetch exchange rates for epochs where the target owned the stake
    // (same logic as fillMissingPrincipalEntries)
    const startEpoch = Math.max(stakeObject.stakeActivationEpoch, stakeObject.firstEpoch);
    const rewardEpochs: number[] = [];
    for (let epoch = startEpoch; epoch <= stakeObject.lastEpoch; epoch++) {
        rewardEpochs.push(epoch);
    }
    for (const epoch of rewardEpochs) {
        if (epoch == currentEpoch) {
            continue; // Skip current epoch as we don't have exchange rates for it yet
        }
        try {
            const exchangeRates = await fetchPoolExchangeRates(
                exchangeRateId,
                epoch,
                stakeObject.poolId,
            );
            if (exchangeRates) {
                stakeObject.exchangeRatesByEpoch[epoch] = exchangeRates;
            }
        } catch (err) {
            console.error(
                `Error fetching exchange rates for poolId ${stakeObject.poolId}, epoch ${epoch}:`,
                err,
            );
        }
    }
}

// Process stake objects with exchange rates and compute rewards
async function processStakeObjectsWithExchangeRates(
    ownedStakeObjects: Map<string, StakeObject>,
    validatorMap: Record<string, string>,
    currentEpoch: number,
): Promise<StakeObject[]> {
    const stakeObjectsArray = Array.from(ownedStakeObjects.values());

    for (const stakeObject of stakeObjectsArray) {
        const exchangeRateId = validatorMap[stakeObject.poolId];
        if (!exchangeRateId) {
            console.warn(`No exchange rate ID found for pool ${stakeObject.poolId}`);
            continue;
        }

        // Fill in missing principal entries
        fillMissingPrincipalEntries(stakeObject);

        // Fetch exchange rates
        await fetchExchangeRatesForStakeObject(stakeObject, exchangeRateId, currentEpoch);

        // Compute rewards for each epoch
        await computeRewardsForStakeObject(stakeObject, exchangeRateId);
    }

    return stakeObjectsArray;
}

/**
 * Add minimal StakeObject entries for currently-staked objects that aren't
 * already present. Used when a startEpoch filter hides the creation tx of
 * objects that are still on-chain: without this supplementation the rewards
 * pipeline has no record of them.
 */
function supplementMissingStakeObjects(
    allStakeObjects: Map<string, StakeObject>,
    currentStakeObjects: CurrentStakeInfo[],
    currentEpoch: number,
): void {
    for (const current of currentStakeObjects) {
        if (allStakeObjects.has(current.objectId)) continue;
        allStakeObjects.set(current.objectId, {
            objectId: current.objectId,
            wasOwnedByTargetAddress: true,
            poolId: current.poolId,
            principalByEpoch: { [current.stakeActivationEpoch]: current.principal },
            exchangeRatesByEpoch: {},
            rewardsByEpoch: {},
            accumulatedRewards: {},
            firstEpoch: current.stakeActivationEpoch,
            lastEpoch: currentEpoch,
            stakeActivationEpoch: current.stakeActivationEpoch,
        });
    }
}

/**
 * Find the principal an object held BEFORE the first visible action at its
 * firstEpoch. Used to seed principalByEpoch at stakeActivationEpoch when the
 * creation tx is outside the filter window. Returns undefined if no action
 * exposes the pre-action state.
 */
function findPreFirstEpochPrincipal(stakeObject: StakeObject): string | undefined {
    const actions = stakeObject.actionByEpoch?.[stakeObject.firstEpoch] ?? [];
    for (const action of actions) {
        if (action.action === 'Unlocked') continue;
        if (action.principalChange?.from) return action.principalChange.from;
        if (action.action === 'Unstaked' && action.amount) return action.amount;
    }
    return undefined;
}

/**
 * When startEpoch filters out an object's creation tx, the object's firstEpoch
 * lands at whatever tx we first see it in (typically an unstake) rather than
 * at its stakeActivationEpoch. The rewards calculator treats firstEpoch >
 * stakeActivationEpoch as "this object was transferred in", zeroing pre-
 * firstEpoch rewards. Reset firstEpoch down to stakeActivationEpoch for
 * affected objects, and seed a principal entry there so fillMissing... can
 * carry it forward across the gap.
 *
 * Only adjust objects whose firstEpoch action proves pre-existence:
 *   - Object deleted at firstEpoch (lastEpoch == firstEpoch) — must have
 *     existed before to be deletable now (e.g. timelocked wrappers).
 *   - Non-Unlocked action at firstEpoch (Unstaked, Partial Unstake, Transfer,
 *     Transition) — these reveal pre-action state.
 * Unlocked alone on a continuing object is NOT proof — it also appears on
 * newly-unwrapped StakedIotas whose stakeActivationEpoch is inherited from
 * the timelocked predecessor.
 */
function extendFirstEpochToActivation(
    allStakeObjects: Map<string, StakeObject>,
    startEpoch: number,
): void {
    for (const stakeObject of allStakeObjects.values()) {
        const isDeletedAtFirst = stakeObject.lastEpoch === stakeObject.firstEpoch;
        const hasNonUnlockAction =
            stakeObject.actionByEpoch?.[stakeObject.firstEpoch]?.some(
                (a) => a.action !== 'Unlocked',
            ) ?? false;
        const shouldReset =
            (isDeletedAtFirst || hasNonUnlockAction) &&
            stakeObject.stakeActivationEpoch < stakeObject.firstEpoch &&
            stakeObject.firstEpoch >= startEpoch;
        if (!shouldReset) continue;

        // Seed the principal at stakeActivationEpoch with the principal held
        // BEFORE the first visible action — i.e. the action's *input*
        // principal, not its output. Using the output (post-unstake) amount
        // would under-count rewards for pre-firstEpoch epochs: the unstake's
        // `totalRewards` captures rewards against the pre-unstake amount and
        // flows into Unstake Total, so a smaller seed makes
        // Accumulated − Unstake Total come out too low.
        let seedPrincipal = findPreFirstEpochPrincipal(stakeObject);
        if (seedPrincipal === undefined) {
            // Fallback for actions that don't expose pre-action state
            // (e.g. Transfer, which preserves principal — so the earliest-
            // known output equals the input).
            const knownEpochs = Object.keys(stakeObject.principalByEpoch)
                .map(Number)
                .sort((a, b) => a - b);
            if (knownEpochs.length > 0) {
                seedPrincipal = stakeObject.principalByEpoch[knownEpochs[0]];
            }
        }
        if (seedPrincipal !== undefined) {
            stakeObject.principalByEpoch[stakeObject.stakeActivationEpoch] = seedPrincipal;
        }
        stakeObject.firstEpoch = stakeObject.stakeActivationEpoch;
    }
}

export async function processStakeTransactionsWithExchangeRates(
    transactions: Array<any>,
    currentEpoch: number,
    targetAddresses: string | string[],
    options?: ProcessingOptions,
): Promise<ProcessStakeTransactionsResult> {
    // Normalize targetAddresses to always be an array
    const addressArray = Array.isArray(targetAddresses) ? targetAddresses : [targetAddresses];
    const { startEpoch, currentStakeObjects } = options ?? {};

    // When startEpoch is set, filter transactions to skip those before the range.
    // We always keep transactions up to currentEpoch (not just the display end date)
    // because an object unstaked after the display range would be invisible in both
    // current objects and pre-range transactions — losing it entirely.
    let filteredTransactions = transactions;
    if (startEpoch !== undefined) {
        filteredTransactions = transactions.filter((tx) => {
            const txEpoch = tx.effects?.epoch?.epochId;
            return txEpoch === undefined || parseInt(txEpoch) >= startEpoch;
        });
    }

    // Get system state to map pool IDs to exchange rate IDs
    const systemState = (await fetchSystemState())[0];
    const validatorMap = getCurrentActiveValidatorsExchangeRateIds(systemState);
    const inactiveValidatorsMap = await getInactiveValidatorsExchangeRateIds(systemState);
    const allValidatorsMap = { ...validatorMap, ...inactiveValidatorsMap };
    const validatorInfo = getValidatorInfo(systemState);

    // Process transactions to build stake objects for each address and merge them
    // Note: Stake object keys are unique object IDs on the blockchain, so if a stake object
    // appears in transactions for multiple addresses (e.g., was transferred), the later
    // processing will update the wasOwnedByTargetAddress flag to true, which is correct behavior.
    const allStakeObjects = new Map<string, StakeObject>();

    const trackedAddresses = new Set(addressArray);

    for (const targetAddress of addressArray) {
        const stakeObjects = await processTransactions(
            filteredTransactions,
            currentEpoch,
            targetAddress,
            trackedAddresses,
        );

        // Merge stake objects from this address into the combined map
        stakeObjects.forEach((stakeObject, key) => {
            if (allStakeObjects.has(key)) {
                const existing = allStakeObjects.get(key)!;

                // Handle transfers between tracked addresses:
                // When the same stake object appears from multiple tracked addresses,
                // one will have transferredInEpoch set (the new owner) and one won't (the old owner).
                // We should prefer the new owner's version to avoid double-counting rewards.
                const existingIsNewOwner = existing.transferredInEpoch !== undefined;
                const incomingIsNewOwner = stakeObject.transferredInEpoch !== undefined;

                if (!existingIsNewOwner && incomingIsNewOwner) {
                    // The incoming stake object is from the new owner (has transferredInEpoch).
                    // Replace the existing with the incoming to use correct firstEpoch and rewards.
                    // But preserve lastEpoch as the maximum to track the full lifecycle.
                    const maxLastEpoch = Math.max(existing.lastEpoch, stakeObject.lastEpoch);
                    stakeObject.lastEpoch = maxLastEpoch;
                    stakeObject.wasOwnedByTargetAddress = true;
                    allStakeObjects.set(key, stakeObject);
                    return; // Skip the rest of the merge logic
                } else if (existingIsNewOwner && !incomingIsNewOwner) {
                    // The existing stake object is already from the new owner.
                    // Just update lastEpoch if needed and skip the rest.
                    existing.lastEpoch = Math.max(existing.lastEpoch, stakeObject.lastEpoch);
                    existing.wasOwnedByTargetAddress = true;
                    return; // Skip the rest of the merge logic
                }

                // For non-transfer cases (or transfers between non-tracked addresses),
                // use the original merge logic:

                // Update ownership flag - if any address owned it, mark as owned
                if (stakeObject.wasOwnedByTargetAddress) {
                    existing.wasOwnedByTargetAddress = true;
                }

                // Merge firstEpoch: use the minimum (earliest appearance)
                if (stakeObject.firstEpoch < existing.firstEpoch) {
                    existing.firstEpoch = stakeObject.firstEpoch;
                }

                // Merge lastEpoch with smart logic:
                // - Only consider lastEpoch from objects that were actually owned (wasOwnedByTargetAddress = true)
                // - If both owned: use maximum to handle transfers between tracked addresses
                // - If only one owned: use that one's lastEpoch
                // - If neither owned (shouldn't happen after filtering): use minimum as fallback
                if (stakeObject.wasOwnedByTargetAddress && existing.wasOwnedByTargetAddress) {
                    // Both addresses owned this object at some point - use maximum
                    // This handles transfers between tracked addresses correctly
                    existing.lastEpoch = Math.max(stakeObject.lastEpoch, existing.lastEpoch);
                } else if (
                    stakeObject.wasOwnedByTargetAddress &&
                    !existing.wasOwnedByTargetAddress
                ) {
                    // Only the new object was owned, use its lastEpoch
                    existing.lastEpoch = stakeObject.lastEpoch;
                }
                // If only existing was owned, keep existing.lastEpoch (do nothing)

                // Merge the maps
                Object.assign(existing.principalByEpoch, stakeObject.principalByEpoch);
                Object.assign(existing.rewardsByEpoch, stakeObject.rewardsByEpoch);
                Object.assign(existing.accumulatedRewards, stakeObject.accumulatedRewards);
                Object.assign(existing.exchangeRatesByEpoch, stakeObject.exchangeRatesByEpoch);
                if (stakeObject.actionByEpoch) {
                    if (!existing.actionByEpoch) existing.actionByEpoch = {};
                    // Merge action arrays for each epoch
                    for (const [epochStr, actions] of Object.entries(stakeObject.actionByEpoch)) {
                        const epoch = parseInt(epochStr);
                        if (!existing.actionByEpoch[epoch]) {
                            existing.actionByEpoch[epoch] = [];
                        }
                        // Add actions that don't already exist (by digest)
                        for (const action of actions) {
                            const exists = existing.actionByEpoch[epoch].some(
                                (a) => a.digest === action.digest,
                            );
                            if (!exists) {
                                existing.actionByEpoch[epoch].push(action);
                            }
                        }
                        // Sort actions by timestamp to ensure chronological order
                        existing.actionByEpoch[epoch].sort((a, b) => {
                            const tsA = a.timestamp || '';
                            const tsB = b.timestamp || '';
                            return tsA.localeCompare(tsB);
                        });
                    }
                }

                // Merge transferredInEpoch: if the stake was transferred to the user, preserve that epoch
                if (
                    stakeObject.transferredInEpoch !== undefined &&
                    existing.transferredInEpoch === undefined
                ) {
                    existing.transferredInEpoch = stakeObject.transferredInEpoch;
                }

                // Merge preTransferRewards: if the stake has pre-transfer rewards, preserve them
                if (
                    stakeObject.preTransferRewards !== undefined &&
                    existing.preTransferRewards === undefined
                ) {
                    existing.preTransferRewards = stakeObject.preTransferRewards;
                }

                // Ensure the earliest stakeActivationEpoch
                if (stakeObject.stakeActivationEpoch < existing.stakeActivationEpoch) {
                    existing.stakeActivationEpoch = stakeObject.stakeActivationEpoch;
                }
            } else {
                allStakeObjects.set(key, stakeObject);
            }
        });
    }

    // Time-frame-aware post-processing: fill in objects whose creation tx was
    // filtered out, and extend firstEpoch back to stakeActivationEpoch so the
    // rewards calculator sees the same shape it would in a full run.
    if (currentStakeObjects && currentStakeObjects.length > 0) {
        supplementMissingStakeObjects(allStakeObjects, currentStakeObjects, currentEpoch);
    }
    // Reconstruct pre-history for objects whose creation tx was never captured
    // (stakeActivationEpoch < firstEpoch). This happens both for time-frame fetches
    // (creation filtered out) and for "all time" fetches where an old object's
    // creation/input state was pruned and only its unstake survives via recovery.
    // Normal objects (firstEpoch == stakeActivationEpoch) are never touched, so it
    // is safe to run unconditionally; `startEpoch ?? 0` keeps all candidates eligible.
    extendFirstEpochToActivation(allStakeObjects, startEpoch ?? 0);

    // Finalize lastEpoch for all stake objects based on their complete action history
    // This ensures correct behavior when multiple actions happen in the same epoch
    allStakeObjects.forEach((stakeObject) => {
        finalizeLastEpoch(stakeObject, currentEpoch);
    });

    // Filter to only owned stake objects and get required pool IDs
    const { ownedStakeObjects, requiredPoolIds } = filterOwnedStakeObjects(allStakeObjects);

    console.log(
        `Found ${ownedStakeObjects.size} owned stake objects (filtered from ${allStakeObjects.size} total) requiring exchange rates for ${requiredPoolIds.size} pools`,
    );

    // Fetch exchange rates for the required pools
    await fetchAllExchangeRates(currentEpoch, requiredPoolIds);

    // Process stake objects with exchange rates and compute rewards
    const stakeObjectsArray = await processStakeObjectsWithExchangeRates(
        ownedStakeObjects,
        allValidatorsMap,
        currentEpoch,
    );

    // Log the entire cache for copying to a JSON file
    // const cacheArray = Array.from(exchangeRateCache.values());
    // const cacheStats = getExchangeRateCacheStats();

    // console.log('=== EXCHANGE RATE CACHE DATA ===');
    // console.log('Cache Statistics:', cacheStats);
    // console.log('Copy this data to a JSON file for initial cache loading:');
    // console.log(JSON.stringify(cacheArray, null, 2));
    // console.log('=== END CACHE DATA ===');

    return {
        stakeObjects: stakeObjectsArray,
        validatorInfo,
    };
}

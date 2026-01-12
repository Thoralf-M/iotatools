import { bcs } from '@iota/bcs';
import type { IotaClient, IotaObjectData } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_SYSTEM_STATE_OBJECT_ID } from '@iota/iota-sdk/utils';

import { computeStakingRewards, type StakeData } from '../../utils/staking-utils';

export interface RequiredUnstakeAmount {
    amount: bigint;
    timelocked: boolean;
}

/**
 * Build a transaction to stake IOTA with a validator
 */
export function buildStakeTransaction(validatorAddress: string, amount: number): Transaction {
    const tx = new Transaction();
    const stakeCoin = tx.splitCoins(tx.gas, [amount]);
    tx.moveCall({
        target: '0x3::iota_system::request_add_stake',
        arguments: [
            tx.sharedObjectRef({
                objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                initialSharedVersion: 1,
                mutable: true,
            }),
            stakeCoin,
            tx.pure.address(validatorAddress),
        ],
    });
    return tx;
}

/**
 * Build a transaction to unstake a single staked IOTA object
 */
export async function buildUnstakeSingleTransaction(
    client: IotaClient,
    stakedIotaObjectId: string,
): Promise<Transaction> {
    const obj = await client.getObject({
        id: stakedIotaObjectId,
        options: { showContent: true },
    });

    let target;
    // @ts-ignore
    if (obj.data?.content?.type === '0x3::staking_pool::StakedIota') {
        target = '0x3::iota_system::request_withdraw_stake';
    }
    // @ts-ignore
    if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
        target = '0x3::timelocked_staking::request_withdraw_stake';
    }

    if (!target) {
        throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
    }

    const tx = new Transaction();
    tx.moveCall({
        target,
        arguments: [
            tx.sharedObjectRef({
                objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                initialSharedVersion: 1,
                mutable: true,
            }),
            tx.object(stakedIotaObjectId),
        ],
    });

    return tx;
}

/**
 * Build a transaction to unstake a specific amount from a staked object
 */
export function buildSingleObjectUnstakeTransaction(
    stakedIotaObjectId: string,
    unstakeAmount: bigint,
    timelocked: boolean,
    targetAddress: string,
): Transaction {
    const tx = new Transaction();
    const splitStakedIota = tx.moveCall({
        target: timelocked ? '0x3::timelocked_staking::split' : '0x3::staking_pool::split',
        arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)],
    });

    let unstakedBalanceWithRewards;
    if (timelocked) {
        const [timelock, balance] = tx.moveCall({
            target: '0x3::timelocked_staking::request_withdraw_stake_non_entry',
            arguments: [tx.object('0x5'), tx.object(splitStakedIota)],
        });
        tx.moveCall({
            target: '0x2::timelock::transfer_to_sender',
            arguments: [timelock],
            typeArguments: ['0x2::balance::Balance<0x2::iota::IOTA>'],
        });
        unstakedBalanceWithRewards = balance;
    } else {
        const [balance] = tx.moveCall({
            target: '0x3::iota_system::request_withdraw_stake_non_entry',
            arguments: [tx.object('0x5'), splitStakedIota],
        });
        unstakedBalanceWithRewards = balance;
    }

    const [coin] = tx.moveCall({
        target: '0x2::coin::from_balance',
        arguments: [unstakedBalanceWithRewards!],
        typeArguments: ['0x2::iota::IOTA'],
    });
    tx.transferObjects([coin], tx.pure.address(targetAddress));

    return tx;
}

/**
 * Compute the required unstake amount to withdraw a specific amount
 */
export async function computeRequiredUnstakeAmount(
    client: IotaClient,
    stakedIotaObjectId: string,
    targetAmount: bigint,
    activeAddress: string,
): Promise<RequiredUnstakeAmount> {
    const stakeData = await computeStakingRewards(client, stakedIotaObjectId, activeAddress);

    const obj = await client.getObject({
        id: stakedIotaObjectId,
        options: { showContent: true },
    });

    let timelocked = false;
    // @ts-ignore
    if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
        timelocked = true;
    }
    // @ts-ignore
    if (!timelocked && obj.data?.content?.type !== '0x3::staking_pool::StakedIota') {
        throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
    }

    const initialStaked = BigInt(stakeData.initialStakedAmount);
    const rewards = BigInt(stakeData.rewards);
    if (rewards === 0n) throw new Error('No rewards available to withdraw.');

    let initialUnstakeAmount: bigint;
    if (timelocked) {
        initialUnstakeAmount = (targetAmount * initialStaked + rewards - 1n) / rewards;
    } else {
        initialUnstakeAmount =
            (targetAmount * initialStaked + (initialStaked + rewards - 1n)) /
            (initialStaked + rewards);
    }

    return {
        amount: initialUnstakeAmount,
        timelocked,
    };
}

/**
 * Dev inspect a staked object to get stake data
 */
export async function devInspectStakedObject(
    client: IotaClient,
    stakedIotaObjectId: string,
    activeAddress: string,
): Promise<StakeData> {
    return computeStakingRewards(client, stakedIotaObjectId, activeAddress);
}

/**
 * Build a transaction to unstake all staked IOTA objects
 */
export function buildUnstakeAllTransaction(
    stakedIota: any[],
    timelockedStakedIota: any[],
    targetAddress: string,
): Transaction {
    const tx = new Transaction();
    let firstBalance;

    for (const [index, delegatedStake] of stakedIota.entries()) {
        for (const [innerIndex, stake] of delegatedStake.stakes.entries()) {
            const balance = tx.moveCall({
                target: '0x3::iota_system::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), tx.object(stake.stakedIotaId)],
            });
            if (index === 0 && innerIndex === 0) {
                firstBalance = balance;
            } else {
                tx.moveCall({
                    target: '0x2::balance::join',
                    arguments: [firstBalance!, balance],
                    typeArguments: ['0x2::iota::IOTA'],
                });
            }
        }
    }

    for (const [index, delegatedTimelockedStake] of timelockedStakedIota.entries()) {
        for (const [innerIndex, timelockedStake] of delegatedTimelockedStake.stakes.entries()) {
            const [timelock, balance] = tx.moveCall({
                target: '0x3::timelocked_staking::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), tx.object(timelockedStake.timelockedStakedIotaId)],
            });
            tx.moveCall({
                target: '0x2::timelock::transfer_to_sender',
                arguments: [timelock],
                typeArguments: ['0x2::balance::Balance<0x2::iota::IOTA>'],
            });
            if (index === 0 && innerIndex === 0 && !firstBalance) {
                firstBalance = balance;
            } else {
                tx.moveCall({
                    target: '0x2::balance::join',
                    arguments: [firstBalance!, balance],
                    typeArguments: ['0x2::iota::IOTA'],
                });
            }
        }
    }

    const [coin] = tx.moveCall({
        target: '0x2::coin::from_balance',
        arguments: [firstBalance!],
        typeArguments: ['0x2::iota::IOTA'],
    });
    tx.transferObjects([coin], tx.pure.address(targetAddress));

    return tx;
}

/**
 * Get timelocked objects for an address
 */
export async function getTimelockedObjects(
    client: IotaClient,
    address: string,
): Promise<IotaObjectData[]> {
    const ownedObjectPage = await client.getOwnedObjects({
        owner: address,
        filter: {
            StructType: '0x2::timelock::TimeLock<0x2::balance::Balance<0x2::iota::IOTA>>',
        },
        options: {
            showContent: true,
        },
    });

    if (ownedObjectPage.data.length === 0) {
        throw new Error('no timelocked object found');
    }

    return ownedObjectPage.data.map((d) => d.data!);
}

/**
 * Run a simulation to test different unstake amounts
 */
export async function unstakeSpecificAmountSimulation(
    client: IotaClient,
    stakedIotaObjectId: string,
    targetAmount: bigint,
    activeAddress: string,
): Promise<string[]> {
    const { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(
        client,
        stakedIotaObjectId,
        targetAmount,
        activeAddress,
    );

    const results: string[] = [];
    const amountDifferences = [
        -1_000_000_000n,
        -1000n,
        -500n,
        -100n,
        -50n,
        -10n,
        -5n,
        -2n,
        -1n,
        0n,
        1n,
        2n,
        5n,
        10n,
        50n,
        100n,
        500n,
        1000n,
        1_000_000_000n,
        10_000_000_000n,
        1000_000_000_000n,
    ];

    for (const diff of amountDifferences) {
        const unstakeAmount = initialUnstakeAmount + diff;
        const tx = buildSingleObjectUnstakeTransaction(
            stakedIotaObjectId,
            unstakeAmount,
            timelocked,
            activeAddress,
        );

        const txRes = await client.devInspectTransactionBlock({
            sender: activeAddress,
            transactionBlock: tx,
        });

        if (txRes.error) {
            results.push(txRes.error);
            continue;
        }

        const index = timelocked ? 1 : 0;
        // @ts-ignore
        const amountBytes = txRes.results[1].returnValues[index][0];
        const amountString = bcs.u64().parse(new Uint8Array(amountBytes));

        const resString = `Unstake amount with ${diff.toString().padStart(12, ' ')}: ${formatNumber(unstakeAmount)}, would result in: ${formatNumber(BigInt(amountString))} for target amount: ${formatNumber(targetAmount)}`;

        if (unstakeAmount === initialUnstakeAmount) {
            results.push(resString + ' this would be used');
        } else {
            results.push(resString);
        }
    }

    return results;
}

function formatNumber(n: bigint): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

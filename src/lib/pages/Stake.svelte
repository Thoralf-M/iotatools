<script lang="ts">
    import { bcs } from '@iota/bcs';
    import type {
        DelegatedStake,
        DelegatedTimelockedStake,
        IotaObjectData,
    } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_SYSTEM_STATE_OBJECT_ID, isValidIotaAddress } from '@iota/iota-sdk/utils';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { getClient } from '../lib/client';
    import {
        formatNumbersWithUnderscores,
        formatNumberWithUnderscores,
    } from '../lib/iota-nano-conversion';
    import { activeAddress } from '../lib/signer-data';
    import { executeTransaction } from '../lib/transaction-execution';

    let validatorAddress = '0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215';
    const minStakeAmount = 2_000_000_000;
    let amount = minStakeAmount;
    // Will be updated with the result
    let value = {};
    let devInspectValue = {};
    let stakedIotaObjectId = '0x';

    interface StakeData {
        objectId: string;
        initialStakedAmount: string;
        rewards: string;
        totalUnstakeAmount: string;
    }

    const stake = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
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

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    async function unstakeSingle() {
        try {
            const client = getClient();
            let obj = await client.getObject({
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

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function computeRewards(stakedIotaObjectId: string) {
        try {
            let stakeData = await devInspectStakedObject(stakedIotaObjectId);
            stakeData = formatNumbersWithUnderscores(stakeData);
            devInspectValue = stakeData;
        } catch (err: any) {
            devInspectValue = err.toString();
            console.error(err);
        }
    }
    async function unstakeSpecificAmountSimulation(stakedIotaObjectId: string) {
        try {
            let { amount: initialUnstakeAmount, timelocked } =
                await computeRequiredUnstakeAmount(stakedIotaObjectId);

            let results = [];
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
            for (let diff of amountDifferences) {
                let unstakeAmount = initialUnstakeAmount + diff;
                let tx = await buildSingleObjectUnstakeTransaction(
                    stakedIotaObjectId,
                    unstakeAmount,
                    timelocked,
                );

                let txRes = await getClient().devInspectTransactionBlock({
                    sender: $activeAddress,
                    transactionBlock: tx,
                });
                if (txRes.error) {
                    results.push(txRes.error);
                    continue;
                }

                let index = timelocked ? 1 : 0;
                // @ts-ignore
                let amountBytes = txRes.results[1].returnValues[index][0];
                let amountString = bcs.u64().parse(new Uint8Array(amountBytes));

                let resString = `Unstake amount with ${diff.toString().padStart(12, ' ')}: ${formatNumberWithUnderscores(unstakeAmount)}, would result in: ${formatNumberWithUnderscores(amountString)} for target amount: ${formatNumberWithUnderscores(amount)}`;
                if (unstakeAmount == initialUnstakeAmount) {
                    results.push(resString + ' this would be used');
                } else {
                    results.push(resString);
                }
                value = results;
            }

            value = results;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function buildSingleObjectUnstakeTransaction(
        stakedIotaObjectId: string,
        unstakeAmount: bigint,
        timelocked: boolean = false,
    ): Promise<Transaction> {
        const tx = new Transaction();
        let splitStakedIota = tx.moveCall({
            target: timelocked ? '0x3::timelocked_staking::split' : '0x3::staking_pool::split',
            arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)],
        });
        let unstakedBalanceWithRewards;
        if (timelocked) {
            let [timelock, balance] = tx.moveCall({
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
            let [balance] = tx.moveCall({
                target: '0x3::iota_system::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), splitStakedIota],
            });
            unstakedBalanceWithRewards = balance;
        }
        let [coin] = tx.moveCall({
            target: '0x2::coin::from_balance',
            arguments: [unstakedBalanceWithRewards!],
            typeArguments: ['0x2::iota::IOTA'],
        });
        tx.transferObjects([coin], tx.pure.address($activeAddress));
        return tx;
    }
    interface RequiredUnstakeAmount {
        amount: bigint;
        timelocked: boolean;
    }
    async function computeRequiredUnstakeAmount(
        stakedIotaObjectId: string,
    ): Promise<RequiredUnstakeAmount> {
        let stakeData = await devInspectStakedObject(stakedIotaObjectId);

        let obj = await getClient().getObject({
            id: stakedIotaObjectId,
            options: { showContent: true },
        });

        let timelocked = false;
        // @ts-ignore
        if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
            timelocked = true;
        }
        // @ts-ignore
        if (!timelocked && obj.data?.content?.type != '0x3::staking_pool::StakedIota') {
            throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
        }

        let initialStaked = BigInt(stakeData.initialStakedAmount);
        let rewards = BigInt(stakeData.rewards);
        if (rewards === 0n) throw new Error('No rewards available to withdraw.');

        let initialUnstakeAmount: bigint;
        if (timelocked) {
            initialUnstakeAmount = (BigInt(amount) * initialStaked + rewards - 1n) / rewards;
        } else {
            initialUnstakeAmount =
                (BigInt(amount) * initialStaked + (initialStaked + rewards - 1n)) /
                (initialStaked + rewards);
        }
        return {
            amount: initialUnstakeAmount,
            timelocked,
        };
    }
    async function unstakeSpecificAmount(stakedIotaObjectId: string) {
        try {
            let { amount: initialUnstakeAmount, timelocked } =
                await computeRequiredUnstakeAmount(stakedIotaObjectId);

            let tx = await buildSingleObjectUnstakeTransaction(
                stakedIotaObjectId,
                initialUnstakeAmount,
                timelocked,
            );

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function devInspectStakedObject(stakedIotaObjectId: string): Promise<StakeData> {
        const client = getClient();
        let obj = await client.getObject({
            id: stakedIotaObjectId,
            options: { showContent: true },
        });
        let target;
        let timelocked = false;
        // @ts-ignore
        if (obj.data?.content?.type === '0x3::staking_pool::StakedIota') {
            target = '0x3::iota_system::request_withdraw_stake_non_entry';
        }
        // @ts-ignore
        if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
            target = '0x3::timelocked_staking::request_withdraw_stake_non_entry';
            timelocked = true;
        }

        if (!target) {
            throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
        }

        const tx = new Transaction();
        tx.moveCall({
            target,
            arguments: [tx.object('0x5'), tx.object(stakedIotaObjectId)],
        });

        const devInspectResult = await client.devInspectTransactionBlock({
            sender: $activeAddress,
            transactionBlock: tx,
        });

        let index = timelocked ? 1 : 0;
        // @ts-ignore
        let amountBytes = devInspectResult.results[0].returnValues[index][0];
        let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
        let totalUnstakeAmount = BigInt(amountString);

        let initialStakedAmount = BigInt(
            timelocked
                ? // @ts-ignore
                  obj.data!.content!.fields!.staked_iota!.fields.principal
                : // @ts-ignore
                  obj.data!.content!.fields!.principal,
        );
        let res = {
            objectId: stakedIotaObjectId,
            initialStakedAmount: initialStakedAmount.toString(),
            rewards: (timelocked
                ? totalUnstakeAmount
                : totalUnstakeAmount - initialStakedAmount
            ).toString(),
            totalUnstakeAmount: totalUnstakeAmount.toString(),
        };
        return res;
    }
    async function unstakeAll() {
        try {
            let staked = (await listStakedIota())!;

            const tx = new Transaction();
            let firstBalance;
            for (let [index, delegatedStake] of staked.stakedIota.entries()) {
                for (let [innerIndex, stake] of delegatedStake.stakes.entries()) {
                    let balance = tx.moveCall({
                        target: '0x3::iota_system::request_withdraw_stake_non_entry',
                        arguments: [tx.object('0x5'), tx.object(stake.stakedIotaId)],
                    });
                    if (index == 0 && innerIndex == 0) {
                        firstBalance = balance;
                    } else {
                        // Merge additional balances to the first balance, to only get a single coin at the end
                        tx.moveCall({
                            target: '0x2::balance::join',
                            arguments: [firstBalance!, balance],
                            typeArguments: ['0x2::iota::IOTA'],
                        });
                    }
                }
            }
            for (let [index, delegatedTimelockedStake] of staked.timelockedStakedIota.entries()) {
                for (let [
                    innerIndex,
                    timelockedStake,
                ] of delegatedTimelockedStake.stakes.entries()) {
                    let [timelock, balance] = tx.moveCall({
                        target: '0x3::timelocked_staking::request_withdraw_stake_non_entry',
                        arguments: [
                            tx.object('0x5'),
                            tx.object(timelockedStake.timelockedStakedIotaId),
                        ],
                    });
                    tx.moveCall({
                        target: '0x2::timelock::transfer_to_sender',
                        arguments: [timelock],
                        typeArguments: ['0x2::balance::Balance<0x2::iota::IOTA>'],
                    });
                    if (index == 0 && innerIndex == 0 && !firstBalance) {
                        firstBalance = balance;
                    } else {
                        // Merge additional balances to the first balance, to only get a single coin at the end
                        tx.moveCall({
                            target: '0x2::balance::join',
                            arguments: [firstBalance!, balance],
                            typeArguments: ['0x2::iota::IOTA'],
                        });
                    }
                }
            }
            let [coin] = tx.moveCall({
                target: '0x2::coin::from_balance',
                arguments: [firstBalance!],
                typeArguments: ['0x2::iota::IOTA'],
            });
            tx.transferObjects([coin], tx.pure.address($activeAddress));

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    const getTimelockedObjects = async (): Promise<IotaObjectData[]> => {
        const client = getClient();
        // no pagination, but should be fine
        let ownedObjectPage = await client.getOwnedObjects({
            owner: $activeAddress,
            filter: {
                StructType: '0x2::timelock::TimeLock<0x2::balance::Balance<0x2::iota::IOTA>>',
            },
            options: {
                showContent: true,
            },
        });
        if (ownedObjectPage.data.length == 0) {
            throw new Error('no timelocked object found');
        }
        return ownedObjectPage.data.map((d) => d.data!);
    };
    const stakeAllTimelockedObjects = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
            const tx = new Transaction();
            let timelockedObjects = await getTimelockedObjects();

            for (const timelockedObject of timelockedObjects) {
                tx.moveCall({
                    target: '0x3::timelocked_staking::request_add_stake',
                    arguments: [
                        tx.sharedObjectRef({
                            objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                            initialSharedVersion: 1,
                            mutable: true,
                        }),
                        tx.object(timelockedObject.objectId),
                        tx.pure.address(validatorAddress),
                    ],
                });
            }

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    async function listStakedIota(): Promise<
        | {
              stakedIota: DelegatedStake[];
              timelockedStakedIota: DelegatedTimelockedStake[];
              totalRewards: string;
          }
        | undefined
    > {
        try {
            const client = getClient();
            const stakedIota = await client.getStakes({
                owner: $activeAddress,
            });
            let totalRewards = BigInt(0);

            const timelockedStakedIota = await client.getTimelockedStakes({
                owner: $activeAddress,
            });
            if (stakedIota.length == 0 && timelockedStakedIota.length == 0) {
                throw new Error('no staked IOTA found');
            }
            if (stakedIota.length != 0) {
                stakedIotaObjectId = stakedIota[0].stakes[0].stakedIotaId;
            } else {
                stakedIotaObjectId = timelockedStakedIota[0].stakes[0].timelockedStakedIotaId;
            }

            for (let delegatedStake of stakedIota) {
                for (let stake of delegatedStake.stakes) {
                    let stakeData = await devInspectStakedObject(stake.stakedIotaId);
                    totalRewards += BigInt(stakeData.rewards);
                    // @ts-ignore
                    stake.actualRewards = stakeData.rewards;
                    let formattedStake = formatNumbersWithUnderscores(stake);
                    for (const key in formattedStake) {
                        // @ts-ignore
                        stake[key] = formattedStake[key];
                    }
                }
            }

            for (let delegatedTimelockedStake of timelockedStakedIota) {
                for (let timelockedStake of delegatedTimelockedStake.stakes) {
                    let stakeData = await devInspectStakedObject(
                        timelockedStake.timelockedStakedIotaId,
                    );
                    totalRewards += BigInt(stakeData.rewards);
                    // @ts-ignore
                    timelockedStake.actualRewards = stakeData.rewards;
                    let formattedTimelockedStake = formatNumbersWithUnderscores(timelockedStake);
                    for (const key in formattedTimelockedStake) {
                        // @ts-ignore
                        timelockedStake[key] = formattedTimelockedStake[key];
                    }
                }
            }

            let res = {
                stakedIota,
                timelockedStakedIota,
                totalRewards: formatNumberWithUnderscores(totalRewards),
            };
            value = res;

            return res;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
</script>

<main>
    <button on:click={() => listStakedIota()}> list staked IOTA </button>
    <br />
    <span>
        staked object id:
        <input
            bind:value={stakedIotaObjectId}
            placeholder="staked IOTA object id 0x..."
            size="67"
        />
    </span>
    <button on:click={() => computeRewards(stakedIotaObjectId)}> compute real rewards </button>
    {#if Object.keys(devInspectValue).length > 0}
        <div style="text-align: center;">
            <pre style="display: inline-block; text-align: left; margin: 0rem;">{JSON.stringify(
                    devInspectValue,
                    null,
                    2,
                )}</pre>
        </div>
    {/if}
    <hr />
    It's only possible to stake to a candidate or active/committee validator, pending is not possible.
    <br />
    <span>
        validator address:
        <input bind:value={validatorAddress} placeholder="validator address 0x..." size="67" />
    </span>
    <br />
    <span>
        amount (min 1 IOTA, to unstake with rewards even more):
        <input
            type="number"
            bind:value={amount}
            placeholder="amount in NANO"
            min="1000000000"
            style="width: 14rem;"
        />
        <input
            type="number"
            value={(amount / 1_000_000_000).toFixed(9)}
            on:input={(e) => {
                // @ts-ignore
                amount = e.target.value * 1_000_000_000;
            }}
            placeholder="amount in IOTA"
            min="1"
            style="width: 14rem;"
        />
    </span>
    <br />

    <button on:click={() => stake()}> stake </button>
    <button on:click={() => unstakeSingle()}> unstake single object </button>
    <button on:click={() => unstakeAll()}> unstake all </button>
    <button on:click={() => unstakeSpecificAmountSimulation(stakedIotaObjectId)}>
        simulate unstake specific amount
    </button>
    <button on:click={() => unstakeSpecificAmount(stakedIotaObjectId)}>
        unstake specific amount (exact is usually not possible)
    </button>

    <hr />
    <button
        on:click={() => {
            getTimelockedObjects()
                .then((timelockedObjects) => {
                    value = timelockedObjects;
                })
                .catch((err) => {
                    value = err.toString();
                    console.error(err);
                });
        }}
    >
        list timelocked objects
    </button>
    <button on:click={() => stakeAllTimelockedObjects()}> stake all timelocked objects </button>

    <JsonToggleView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

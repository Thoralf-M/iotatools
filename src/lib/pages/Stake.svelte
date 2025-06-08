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
    import { formatNumbersWithUnderscores } from '../lib/iota-nano-conversion';
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
            let stakeData = await devInspectStakedObject(stakedIotaObjectId);

            let unstakeTargetAmount = BigInt(amount);
            let initialStaked = BigInt(stakeData.initialStakedAmount);
            let rewards = BigInt(stakeData.rewards);

            let unstakeAmount = (unstakeTargetAmount * initialStaked) / (initialStaked + rewards);
            unstakeAmount = unstakeAmount - BigInt(300);
            let results = [];
            for (let i = 0; i < 15; i++) {
                unstakeAmount = unstakeAmount + BigInt(i * 10);
                const tx = new Transaction();
                let splitStakedIota = tx.moveCall({
                    target: '0x3::staking_pool::split',
                    arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)],
                });
                let [unstakedBalanceWithRewards] = tx.moveCall({
                    target: '0x3::iota_system::request_withdraw_stake_non_entry',
                    arguments: [tx.object('0x5'), splitStakedIota],
                });
                let [coin] = tx.moveCall({
                    target: '0x2::coin::from_balance',
                    arguments: [unstakedBalanceWithRewards!],
                    typeArguments: ['0x2::iota::IOTA'],
                });
                tx.transferObjects([coin], tx.pure.address($activeAddress));

                let txRes = await getClient().devInspectTransactionBlock({
                    sender: $activeAddress,
                    transactionBlock: tx,
                });
                // @ts-ignore
                let amountBytes = txRes.results[1].returnValues[0][0];
                let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
                results.push(
                    `Unstake amount: ${unstakeAmount.toString()}, would result in: ${amountString} for target amount: ${unstakeTargetAmount}`,
                );
            }

            value = results;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function unstakeSpecificAmount(stakedIotaObjectId: string) {
        try {
            let stakeData = await devInspectStakedObject(stakedIotaObjectId);

            let unstakeTargetAmount = BigInt(amount);
            let initialStaked = BigInt(stakeData.initialStakedAmount);
            let rewards = BigInt(stakeData.rewards);

            let unstakeAmount = (unstakeTargetAmount * initialStaked) / (initialStaked + rewards);
            unstakeAmount = unstakeAmount;
            const tx = new Transaction();
            let splitStakedIota = tx.moveCall({
                target: '0x3::staking_pool::split',
                arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)],
            });
            let [unstakedBalanceWithRewards] = tx.moveCall({
                target: '0x3::iota_system::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), splitStakedIota],
            });
            let [coin] = tx.moveCall({
                target: '0x2::coin::from_balance',
                arguments: [unstakedBalanceWithRewards!],
                typeArguments: ['0x2::iota::IOTA'],
            });
            tx.transferObjects([coin], tx.pure.address($activeAddress));

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
          }
        | undefined
    > {
        try {
            const client = getClient();
            const stakedIota = await client.getStakes({
                owner: $activeAddress,
            });
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
                    // @ts-ignore // TODO: add field to type?
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
                    // @ts-ignore // TODO: add field to type?
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
        <input type="number" bind:value={amount} placeholder="amount in NANO" min="1000000000" />
        <input
            type="number"
            value={(amount / 1_000_000_000).toFixed(9)}
            on:input={(e) => {
                // @ts-ignore
                amount = e.target.value * 1_000_000_000;
            }}
            placeholder="amount in IOTA"
            min="1"
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

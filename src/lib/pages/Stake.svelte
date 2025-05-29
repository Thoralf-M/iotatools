<script lang="ts">
    import type { IotaObjectData } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_SYSTEM_STATE_OBJECT_ID, isValidIotaAddress } from '@iota/iota-sdk/utils';

    import { getClient } from '../lib/client';
    import JsonToggleView from '../lib/JsonToggleView.svelte';
    import { activeAddress, iota_accounts, iota_wallets } from '../SignerData.svelte';

    let validatorAddress = '0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215';
    const minStakeAmount = 1000000000;
    let amount = minStakeAmount;
    // Will be updated with the result
    let value = {};

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

            // @ts-ignore
            let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                },
                account: $iota_accounts.filter((account) => account.address == $activeAddress)[0],
            });
            console.log(txResult);
            value = txResult;
            let client = await getClient();
            // result = JSON.stringify(txResult, null, 2);
            client.waitForTransaction({ digest: txResult.digest }).then(() => {
                console.log('tx block available via api');
            });
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    const getTimelockedObjects = async (): Promise<IotaObjectData[]> => {
        const client = await getClient();
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
            // dry run
            // tx.setSender(
            //     $activeAddress ||
            //         "0x0000000000000000000000000000000000000000000000000000000000000000",
            // );

            // const bytes = await tx.build({ client });
            // const dryRunResult = await client.dryRunTransactionBlock({
            //     transactionBlock: bytes,
            // });
            // console.log(dryRunResult);
            // value = dryRunResult;

            // @ts-ignore
            let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                },
                account: $iota_accounts.filter((account) => account.address == $activeAddress)[0],
            });
            const client = await getClient();
            console.log(txResult);
            value = txResult;
            // result = JSON.stringify(txResult, null, 2);
            client.waitForTransaction({ digest: txResult.digest }).then(() => {
                console.log('tx block available via api');
            });
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
</script>

<main>
    It's only possible to stake to a candidate or active/committee validator, pending is not
    possible.
    <br />
    <span>
        validator address:
        <input bind:value={validatorAddress} placeholder="validator address 0x..." size="67" />
    </span>
    <br />
    <span>
        amount (min 1 IOTA):
        <input type="number" bind:value={amount} placeholder="amount" min="minStakeAmount" />
    </span>
    <br />

    <button on:click={() => stake()}> stake </button>
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

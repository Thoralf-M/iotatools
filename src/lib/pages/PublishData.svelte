<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';

    import { getClient } from '../lib/client';
    import JsonToggleView from '../lib/JsonToggleView.svelte';
    import { activeAddress, iota_accounts, iota_wallets } from '../SignerData.svelte';

    let pureInputData = 'some data';
    // Will be updated with the result
    let value = {};

    const publishData = async () => {
        try {
            const tx = new Transaction();
            tx.pure('string', pureInputData);

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
</script>

<main>
    Publish data as input to a tx
    <br />
    <span>
        pure input data:
        <input bind:value={pureInputData} placeholder="string" size="60" />
    </span>
    <br />

    <button on:click={() => publishData()}> publish data in tx </button>

    <JsonToggleView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { activeAddress, iota_wallets } from '../lib/signer-data';

    let pureInputData = 'some data';
    // Will be updated with the result
    let value = {};

    const publishData = async () => {
        try {
            const tx = new Transaction();
            tx.pure('string', pureInputData);

            let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                },
                account: { address: $activeAddress },
            });
            console.log(txResult);
            value = txResult;
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

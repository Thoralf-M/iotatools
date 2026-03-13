<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';

    import TransactionView from '../../components/TransactionView.svelte';
    import { executeTransaction } from '../../utils/transaction-execution';

    let pureInputData = 'some data';
    // Will be updated with the result
    let value = {};

    const publishData = async () => {
        try {
            const tx = new Transaction();
            tx.pure('string', pureInputData);

            value = await executeTransaction(tx);
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

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

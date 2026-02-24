<script lang="ts">
    import { IotaClient, type CoinStruct, type PaginatedCoins } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';

    import IotaAmountInput from '../../components/IotaAmountInput.svelte';
    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient } from '../../utils/client';
    import { activeAddress } from '../../utils/signer-data';
    import { executeTransaction } from '../../utils/transaction-execution';

    let objectCount = $state('1');
    let amountPerObject = $state('1000000000');
    let amountPerObjectNumber = $state(1000000000);
    // Will be updated with the result
    let value = $state({});
    let iotaBalance = $state(0);
    let isTransactionResult = $state(false);

    // Keep string and number variables in sync
    $effect(() => {
        amountPerObject = amountPerObjectNumber.toString();
    });

    const mergeAllIotaCoins = async () => {
        try {
            let client = getClient();
            let coins = await getAllIotaCoins(client, $activeAddress);
            if (coins.length < 2) {
                throw new Error('No coins to consolidate');
            }

            let position = coins.findIndex((c) => parseInt(c.balance) > 500_000);
            let [gasCoinObject] = coins.splice(position, 1);

            let coinObjectIds = coins.slice(0, 1676).map((coin) => {
                return coin.coinObjectId;
            });
            console.log(`Consolidating ${coinObjectIds.length + 1} coins`);

            const tx = new Transaction();
            const chunkSize = 511;
            for (let i = 0; i < coinObjectIds.length; i += chunkSize) {
                const coinObjectIdsChunk = coinObjectIds.slice(i, i + chunkSize);
                // For many coin objects (> 512) one needs to call mergeCoins() multiple times with a max of 1676 inputs in a single PTB.
                tx.mergeCoins(tx.gas, coinObjectIdsChunk);
            }
            tx.setGasPayment([
                {
                    objectId: gasCoinObject.coinObjectId,
                    version: gasCoinObject.version,
                    digest: gasCoinObject.digest,
                },
            ]);

            value = await executeTransaction(tx);
            isTransactionResult = true;
        } catch (err: any) {
            value = err.toString();
            isTransactionResult = false;
            console.error(err);
        }
    };
    const splitIotaCoins = async () => {
        try {
            const tx = new Transaction();
            const splitAmounts = Array.from({ length: parseInt(objectCount) }, () =>
                parseInt(amountPerObject),
            );
            const coins = tx.splitCoins(tx.gas, splitAmounts);
            let coinArgs = [...Array(splitAmounts.length).keys()].map((i) => {
                return {
                    kind: 'NestedResult',
                    NestedResult: [coins[0].NestedResult[0], i],
                };
            });
            // @ts-ignore
            tx.transferObjects(coinArgs, $activeAddress);

            value = await executeTransaction(tx);
            isTransactionResult = true;
        } catch (err: any) {
            value = err.toString();
            isTransactionResult = false;
            console.error(err);
        }
    };
    const listAllIotaCoinObjects = async () => {
        try {
            let client = getClient();
            let coins = await getAllIotaCoins(client, $activeAddress);
            iotaBalance = 0;
            for (const coin of coins) {
                iotaBalance += parseInt(coin.balance);
            }
            value = coins;
            isTransactionResult = false;
        } catch (err: any) {
            value = err.toString();
            isTransactionResult = false;
            console.error(err);
        }
    };

    async function getAllIotaCoins(client: IotaClient, address: string): Promise<CoinStruct[]> {
        let cursor: string | undefined | null = null;
        const coins: CoinStruct[] = [];
        // keep fetching until cursor is null or undefined
        do {
            const { data, nextCursor }: PaginatedCoins = await client.getCoins({
                owner: address,
                cursor,
            });
            if (!data || !data.length) {
                break;
            }

            coins.push(...data);
            cursor = nextCursor;
        } while (cursor);
        return coins;
    }
</script>

<main>
    <div>IOTA balance: {(iotaBalance / 1000_000_000).toFixed(9)}</div>
    <button onclick={() => listAllIotaCoinObjects()}>List all IOTA coins</button>
    <br />

    <button onclick={() => mergeAllIotaCoins()}>Merge all IOTA coins (max 2048 at once)</button>
    <br />
    <span>
        object count:
        <input bind:value={objectCount} placeholder="0" />
    </span>
    <span>
        amount per object:
        <div style="display: inline-block; vertical-align: top;">
            <IotaAmountInput
                id="amount-per-object"
                label=""
                bind:value={amountPerObjectNumber}
                placeholder="1000000000"
            />
        </div>
    </span>
    <br />
    <button onclick={() => splitIotaCoins()}>Split IOTA coins (max 2048)</button>

    {#if isTransactionResult}
        <TransactionView {value} />
    {:else if Array.isArray(value) && value.length === 0}
        <div>No coins available</div>
    {:else}
        <JsonToggleView {value} />
    {/if}
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

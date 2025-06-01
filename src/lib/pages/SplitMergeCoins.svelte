<script lang="ts">
    import { IotaClient, type CoinStruct, type PaginatedCoins } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { getClient } from '../lib/client';
    import { activeAddress, iota_wallets } from '../lib/signer-data';

    let objectCount = '1';
    let amountPerObject = '1000000000';
    // Will be updated with the result
    let value = {};
    let iotaBalance = 0;

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
    const splitIotaCoins = async () => {
        try {
            const tx = new Transaction();
            const splitAmounts = new Array(parseInt(objectCount)).fill(parseInt(amountPerObject));
            const coins = tx.splitCoins(tx.gas, splitAmounts);
            let coinArgs = [...Array(splitAmounts.length).keys()].map((i) => {
                return {
                    kind: 'NestedResult',
                    NestedResult: [coins[0].NestedResult[0], i],
                };
            });
            // @ts-ignore
            tx.transferObjects(coinArgs, $activeAddress);

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
    const listAllIotaCoinObjects = async () => {
        try {
            let client = getClient();
            let coins = await getAllIotaCoins(client, $activeAddress);
            iotaBalance = 0;
            for (const coin of coins) {
                iotaBalance += parseInt(coin.balance);
            }
            value = coins;
        } catch (err: any) {
            value = err.toString();
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
    <button on:click={() => listAllIotaCoinObjects()}>List all IOTA coins</button>
    <br />

    <button on:click={() => mergeAllIotaCoins()}>Merge all IOTA coins (max 2048 at once)</button>
    <br />
    <span>
        object count:
        <input bind:value={objectCount} placeholder="0" />
    </span>
    <span>
        amount per object:
        <input bind:value={amountPerObject} placeholder="0" />
    </span>
    <br />
    <button on:click={() => splitIotaCoins()}>Split IOTA coins (max 2048)</button>

    <JsonToggleView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

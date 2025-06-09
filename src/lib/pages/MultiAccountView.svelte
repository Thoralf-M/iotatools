<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { getClient } from '../lib/client';
    import { nanoToIota } from '../lib/iota-nano-conversion';
    import { iota_accounts, iota_wallets } from '../lib/signer-data';

    // Will be updated with the result
    let value = $state({});

    interface ExtendedAccount {
        id: string;
        address: string;
        label: string | undefined;
        objects: ExtendedObject[];
        timelockedObjects: ExtendedObject[];
    }

    interface ExtendedObject {
        id: string;
        label: string;
        data: any;
        currentOwner: string;
    }

    let extendedAccounts: ExtendedAccount[] = $state([]);
    let allAccountsTotalBalance = $state(0);

    const syncReset = async () => {
        try {
            extendedAccounts = $iota_accounts.map((account, i) => {
                return {
                    id: account.address,
                    address: account.address,
                    label: account.label,
                    objects: [],
                    timelockedObjects: [],
                };
            });
            await getObjects();
            allAccountsTotalBalance = 0;
            for (let account of extendedAccounts) {
                allAccountsTotalBalance += account.objects.reduce((acc, obj) => {
                    let amountToAdd = 0;
                    if (obj.data.content.fields?.balance) {
                        amountToAdd = Number(nanoToIota(obj.data.content.fields.balance));
                    } else if (obj.data.content.fields?.principal) {
                        amountToAdd = Number(nanoToIota(obj.data.content.fields.principal));
                    }
                    return acc + amountToAdd;
                }, 0);

                allAccountsTotalBalance += account.timelockedObjects.reduce((acc, obj) => {
                    let amountToAdd = 0;
                    if (obj.data.content.fields?.locked) {
                        amountToAdd = Number(nanoToIota(obj.data.content.fields?.locked));
                    } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                        amountToAdd = Number(
                            nanoToIota(obj.data.content.fields.staked_iota.fields.principal),
                        );
                    }
                    return acc + amountToAdd;
                }, 0);
            }
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    function handleDnd(event: CustomEvent<DndEvent<any>>) {
        // Find the account being updated and set its new items
        const idx = extendedAccounts.findIndex(
            // @ts-ignore
            (acc) => acc.address === event.srcElement.classList[0],
        );
        if (idx !== -1) {
            // Make items unique by id
            const seen = new Set();
            const uniqueItems = event.detail.items.filter((item) => {
                if (seen.has(item.id)) {
                    return false;
                }
                seen.add(item.id);
                return true;
            });
            // Create a new array/object to trigger reactivity
            extendedAccounts = [
                ...extendedAccounts.slice(0, idx),
                { ...extendedAccounts[idx], objects: uniqueItems },
                ...extendedAccounts.slice(idx + 1),
            ];
        }
    }

    async function getObjects() {
        try {
            const client = getClient();
            // Iterate over extendedAccounts, get the owned objects for each account and set them in the objects field
            const updatedAccounts = await Promise.all(
                extendedAccounts.map(async (account) => {
                    const result = await client.getOwnedObjects({
                        owner: account.address,
                        options: { showContent: true, showType: true },
                    });

                    // Map the returned objects to the expected format
                    const objects = result.data.map((obj, idx) => {
                        // @ts-ignore
                        let label = obj.data.content?.type;
                        if (typeof label === 'string') {
                            // Only show the actual type name
                            label = label.split('::').slice(2).join('::');
                        }
                        return {
                            // @ts-ignore
                            id: obj.data.objectId,
                            label,
                            data: obj.data,
                            currentOwner: account.address,
                        };
                    });

                    // separate timelocked objects
                    const timelockedObjects: ExtendedObject[] = [];
                    const filteredObjects: ExtendedObject[] = [];
                    for (const obj of objects) {
                        if (
                            obj.label === 'TimelockedStakedIota' ||
                            obj.label.startsWith('TimeLock<')
                        ) {
                            timelockedObjects.push(obj);
                        } else {
                            filteredObjects.push(obj);
                        }
                    }

                    return { ...account, objects: filteredObjects, timelockedObjects };
                }),
            );
            extendedAccounts = updatedAccounts;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    // Get all the objects that were moved from one account to another
    function getMovements(): Map<string, Map<string, ExtendedObject[]>> {
        let movements = new Map<string, Map<string, ExtendedObject[]>>();
        for (const account of extendedAccounts) {
            for (const object of account.objects) {
                if (object.currentOwner !== account.address) {
                    if (!movements.has(object.currentOwner)) {
                        movements.set(object.currentOwner, new Map());
                    }
                    if (!movements.get(object.currentOwner)!.has(account.address)) {
                        movements.get(object.currentOwner)!.set(account.address, []);
                    }
                    movements.get(object.currentOwner)!.get(account.address)!.push(object);
                }
            }
        }
        return movements;
    }
    interface PreparedTransaction {
        sender: string;
        recipients: string[];
        transaction: Transaction;
    }
    async function prepareTxs(): Promise<PreparedTransaction[]> {
        let preparedTxs = [];

        let movements = getMovements();
        for (const movement of movements) {
            const senderAddress = movement[0];

            const tx = new Transaction();
            for (let [to, objects] of movement[1]) {
                // If we transfer all gas coin objects, we have to split the gas from one of the objects
                if (
                    extendedAccounts
                        .find((acc) => acc.address == senderAddress)
                        ?.objects.filter(
                            (obj) => obj.data.content.type === '0x2::coin::Coin<0x2::iota::IOTA>',
                        ).length == 0
                ) {
                    // Get largest gas coin
                    let gasCoin = objects
                        .filter(
                            (obj) => obj.data.content.type === '0x2::coin::Coin<0x2::iota::IOTA>',
                        )
                        .sort((a, b) =>
                            Number(
                                BigInt(b.data.content.fields.balance) -
                                    BigInt(a.data.content.fields.balance),
                            ),
                        )[0];
                    if (!gasCoin) {
                        throw new Error(
                            `No gas coin found for sender ${senderAddress}. Please ensure the account has IOTA coins.`,
                        );
                    }
                    console.log('Using transfer object as gasCoin', gasCoin);
                    tx.setGasPayment([
                        {
                            objectId: gasCoin.id,
                            version: gasCoin.data.version,
                            digest: gasCoin.data.digest,
                        },
                    ]);

                    tx.transferObjects(
                        objects.map((obj) => {
                            if (obj.id === gasCoin.id) {
                                // Replace the gas coin id by the gas argument
                                return tx.gas;
                            } else {
                                return obj.id;
                            }
                        }),
                        to,
                    );
                } else {
                    // Just transfer the objects and let the SDK select the gas
                    tx.transferObjects(
                        objects.map((obj) => obj.id),
                        to,
                    );
                }
            }
            tx.setSender(senderAddress);
            // const txBytes = await tx.build({ client });

            preparedTxs.push({
                sender: senderAddress,
                recipients: Array.from(movement[1].keys()),
                transaction: tx,
            });
        }
        return preparedTxs;
    }
    async function dryRun() {
        try {
            const client = getClient();
            let preparedTxs = await prepareTxs();

            let txResults = [];
            for (const preparedTx of preparedTxs) {
                const { sender, recipients, transaction } = preparedTx;
                console.log(`Dry run moving objects from ${sender} to:`, recipients.join(', '));
                // Perform a dry run
                let dryRunResult = (await client.dryRunTransactionBlock({
                    transactionBlock: await transaction.build({ client }),
                })) as any;
                dryRunResult.sender = sender;
                dryRunResult.recipients = recipients;
                txResults.push(dryRunResult);
            }

            value = { txs: txResults.length, txResults };
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function send() {
        try {
            let preparedTxs = await prepareTxs();

            let txResults = [];
            for (const preparedTx of preparedTxs) {
                const { sender, recipients, transaction } = preparedTx;
                console.log(`Moving objects from ${sender} to:`, recipients.join(', '));

                let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                    transaction,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                        showBalanceChanges: true,
                    },
                    account: { address: sender },
                });
                txResult.sender = sender;
                txResult.recipients = recipients;
                txResults.push(txResult);
            }

            value = { txs: txResults.length, txResults };
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
</script>

<main>
    <span style="float:left">Drag and drop objects between accounts.</span>
    <br />
    <button onclick={syncReset}> sync/reset </button>
    <button onclick={dryRun}> dry run </button>
    <button onclick={send}> send </button>

    <JsonToggleView {value} />

    <br />
    <div style="text-align:left">Balance of all accounts: {allAccountsTotalBalance} IOTA</div>

    <div class="grid">
        {#each extendedAccounts as account (account.id)}
            <div class="account">
                <div class="accountHeader">
                    {account.label ||
                        account.address.slice(0, 6) + '...' + account.address.slice(-4)}: {account.objects.reduce(
                        (acc, obj) => {
                            let amountToAdd = 0;
                            if (obj.data.content.fields?.balance) {
                                amountToAdd = Number(nanoToIota(obj.data.content.fields.balance));
                            } else if (obj.data.content.fields?.principal) {
                                amountToAdd = Number(nanoToIota(obj.data.content.fields.principal));
                            }
                            return acc + amountToAdd;
                        },
                        0,
                    ) +
                        account.timelockedObjects.reduce((acc, obj) => {
                            let amountToAdd = 0;
                            if (obj.data.content.fields?.locked) {
                                amountToAdd = Number(nanoToIota(obj.data.content.fields?.locked));
                            } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                                amountToAdd = Number(
                                    nanoToIota(
                                        obj.data.content.fields.staked_iota.fields.principal,
                                    ),
                                );
                            }
                            return acc + amountToAdd;
                        }, 0) +
                        ' IOTA'}
                </div>
                <div style="text-align: left;">Owned objects ({account.objects.length}):</div>
                <div
                    use:dragHandleZone={{
                        items: account.objects,
                        flipDurationMs: 200,
                    }}
                    onconsider={handleDnd}
                    onfinalize={handleDnd}
                    class={account.id}
                    style="max-height: 300px; overflow-y: auto;"
                >
                    {#each account.objects as item (item.id)}
                        <div style="border-top: 1px solid #525252;">
                            <div
                                use:dragHandle
                                class="handle"
                                style={account.address !== item.currentOwner
                                    ? 'background-color: #19400e;'
                                    : ''}
                            >
                                <span>
                                    {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                        {item.label}: {nanoToIota(
                                            item.data?.content.fields?.balance,
                                        )} IOTA
                                    {:else if item.label == 'StakedIota'}
                                        {item.label}: {nanoToIota(
                                            item.data?.content.fields?.principal,
                                        )}
                                        IOTA
                                    {:else if item.label == 'TimelockedStakedIota'}
                                        {item.label}: {nanoToIota(
                                            item.data.content.fields.staked_iota.fields.principal,
                                        )} IOTA
                                    {:else}
                                        {item.label}
                                    {/if}
                                </span>
                                {#if account.address !== item.currentOwner}
                                    <div>
                                        from: {item.currentOwner.slice(0, 6) +
                                            '...' +
                                            item.currentOwner.slice(-4)}
                                    </div>
                                {/if}
                            </div>
                            <!-- </MaybeDragHandle> -->
                            <div class="item">
                                <details>
                                    <summary>Show object data</summary>
                                    <pre style="font-size:0.7rem;  text-align: left;">
                                        {'\n' + JSON.stringify(item, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    {/each}
                    {#if account.objects.length == 0}
                        <br />
                        <br />
                        <br />
                        <br />
                    {/if}

                    {#if account.timelockedObjects.length != 0}
                        <details>
                            <summary style="color: #ff9991;">Timelocked objects</summary>
                            {#each account.timelockedObjects as item (item.id)}
                                <div style="border-top: 1px solid #525252;">
                                    <span style="word-break: break-all;">
                                        {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                            {item.label}: {nanoToIota(
                                                item.data?.content.fields?.balance,
                                            )} IOTA
                                        {:else if item.label == 'StakedIota'}
                                            {item.label}: {nanoToIota(
                                                item.data?.content.fields?.principal,
                                            )}
                                            IOTA
                                        {:else if item.label == 'TimelockedStakedIota'}
                                            {item.label}: {nanoToIota(
                                                item.data.content.fields.staked_iota.fields
                                                    .principal,
                                            )} IOTA
                                        {:else}
                                            {item.label}
                                        {/if}
                                    </span>
                                    {#if account.address !== item.currentOwner}
                                        <div>
                                            from: {item.currentOwner.slice(0, 6) +
                                                '...' +
                                                item.currentOwner.slice(-4)}
                                        </div>
                                    {/if}
                                </div>
                                <!-- </MaybeDragHandle> -->
                                <div class="item">
                                    <details>
                                        <summary>Show object data</summary>
                                        <pre style="font-size:0.7rem;  text-align: left;">
                                        {'\n' + JSON.stringify(item, null, 2)}
                                    </pre>
                                    </details>
                                </div>
                            {/each}
                        </details>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    .value,
    pre {
        text-align: left;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }
    button {
        margin: 0.5rem;
    }

    .grid {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    .account {
        border: 2px solid #535353;
        border-radius: 12px;
        background-color: #1b2021;
        max-width: 500px;
    }
    .accountHeader {
        border-radius: 12px 12px 0 0;
        font-weight: bold;
        color: #ffffff;
        background-color: rgb(35, 63, 63);
    }
    .handle {
        background-color: #232324;
        overflow-wrap: anywhere;
    }
</style>

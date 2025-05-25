<script lang="ts">
    import type { IotaObjectData } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_SYSTEM_STATE_OBJECT_ID, isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount } from 'svelte';
    import { dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';

    import { getClient } from '../Client.svelte';
    import { nanoToIota } from '../lib/iota-nano-conversion';
    import JsonToggleView from '../lib/JsonToggleView.svelte';
    import { activeAddress, iota_accounts, iota_wallets } from '../SignerData.svelte';

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
            const client = await getClient();
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
                            // @ts-ignore
                            data: obj.data.content!,
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
    async function dryRun() {
        try {
            const client = await getClient();
            let txResults = [];

            let movements = getMovements();
            for (const movement of movements) {
                const senderAddress = movement[0];
                console.log(
                    `Moving objects from ${senderAddress} to:`,
                    Array.from(movement[1].keys()).join(', '),
                );
                const tx = new Transaction();
                for (const [to, objects] of movement[1]) {
                    tx.transferObjects(
                        objects.map((obj) => obj.id),
                        to,
                    );
                }
                tx.setSender(senderAddress);
                const txBytes = await tx.build({ client });
                // Perform a dry run
                const dryRunResult = await client.dryRunTransactionBlock({
                    transactionBlock: txBytes,
                });
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
            const client = await getClient();
            let txResults = [];

            let movements = getMovements();
            for (const movement of movements) {
                const senderAddress = movement[0];
                console.log(
                    `Moving objects from ${senderAddress} to:`,
                    Array.from(movement[1].keys()).join(', '),
                );
                const tx = new Transaction();
                for (const [to, objects] of movement[1]) {
                    tx.transferObjects(
                        objects.map((obj) => obj.id),
                        to,
                    );
                }
                tx.setSender(senderAddress);
                const txBytes = await tx.build({ client });

                // @ts-ignore
                let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                    transaction: txBytes,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                        showBalanceChanges: true,
                    },
                    account: senderAddress,
                });
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
    <button onclick={syncReset}> sync/reset </button>
    <button onclick={dryRun}> dry run </button>
    <button onclick={send}> send </button>

    <JsonToggleView {value} />

    <div class="grid">
        {#each extendedAccounts as account (account.id)}
            <div class="account">
                <div>
                    {account.label ||
                        account.address.slice(0, 6) + '...' + account.address.slice(-4)}
                </div>
                <div
                    use:dragHandleZone={{
                        items: account.objects,
                        flipDurationMs: 200,
                    }}
                    onconsider={handleDnd}
                    onfinalize={handleDnd}
                    class={account.id}
                >
                    {#each account.objects as item (item.id)}
                        <div style="border: 1px solid #525252;">
                            <div
                                use:dragHandle
                                class="handle"
                                style={account.address !== item.currentOwner
                                    ? 'background-color: #19400e;'
                                    : ''}
                            >
                                <span>
                                    {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                        {item.label}: {nanoToIota(item.data?.fields?.balance)} IOTA
                                    {:else if item.label == 'StakedIota'}
                                        {item.label}: {nanoToIota(item.data?.fields?.principal)}
                                        IOTA
                                    {:else if item.label == 'TimelockedStakedIota'}
                                        {item.label}: {nanoToIota(
                                            item.data.fields.staked_iota.fields.principal,
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
                                        {'\n' + JSON.stringify(item.data, null, 2)}
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
                                <div style="border: 1px solid #525252;">
                                    <span style="word-break: break-all;">
                                        {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                            {item.label}: {nanoToIota(item.data?.fields?.balance)} IOTA
                                        {:else if item.label == 'StakedIota'}
                                            {item.label}: {nanoToIota(item.data?.fields?.principal)}
                                            IOTA
                                        {:else if item.label == 'TimelockedStakedIota'}
                                            {item.label}: {nanoToIota(
                                                item.data.fields.staked_iota.fields.principal,
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
                                        {'\n' + JSON.stringify(item.data, null, 2)}
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
        word-break: break-all;
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
        width: 400px;
        min-height: 350px;
    }
    .handle {
        background-color: #232324;
    }
</style>

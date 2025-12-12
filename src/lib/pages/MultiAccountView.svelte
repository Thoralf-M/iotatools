<script lang="ts">
    import { toBase64 } from '@iota/bcs';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient } from '../lib/client';
    import { nanoToIota } from '../lib/iota-nano-conversion';
    import { iota_accounts, iota_wallets } from '../lib/signer-data';
    import { fetchCurrentPrice } from '../lib/staking-rewards/price-fetching';
    import { computeStakingRewards } from '../lib/staking-utils';
    import { calculateGasFee } from '../lib/transaction-execution';

    // Will be updated with the result
    let value = $state({});

    interface ExtendedAccount {
        id: string;
        address: string;
        label: string | undefined;
        objects: ExtendedObject[];
        timelockedObjects: ExtendedObject[];
        stakingRewards: bigint;
        isCollapsed: boolean;
    }

    interface ExtendedObject {
        id: string;
        label: string;
        data: any;
        currentOwner: string;
    }

    let extendedAccounts: ExtendedAccount[] = $state([]);
    let allAccountsTotalBalance = $derived.by(() => {
        let total = BigInt(0);
        for (let account of extendedAccounts) {
            total += account.objects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (obj.data.content.fields?.balance) {
                    amountToAdd = BigInt(obj.data.content.fields.balance);
                } else if (obj.data.content.fields?.principal) {
                    amountToAdd = BigInt(obj.data.content.fields.principal);
                }
                return acc + amountToAdd;
            }, BigInt(0));

            total += account.timelockedObjects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (obj.data.content.fields?.locked) {
                    amountToAdd = BigInt(obj.data.content.fields?.locked);
                } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                    amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
                }
                return acc + amountToAdd;
            }, BigInt(0));

            total += account.stakingRewards;
        }
        return total;
    });

    let allAccountsTotalRewards = $derived.by(() => {
        let total = BigInt(0);
        for (let account of extendedAccounts) {
            total += account.stakingRewards;
        }
        return total;
    });

    let allAccountsTotalIotaCoins = $derived.by(() => {
        let total = BigInt(0);
        for (let account of extendedAccounts) {
            total += account.objects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (
                    obj.data.content.fields?.balance &&
                    obj.data.content.type === '0x2::coin::Coin<0x2::iota::IOTA>'
                ) {
                    amountToAdd = BigInt(obj.data.content.fields.balance);
                }
                return acc + amountToAdd;
            }, BigInt(0));

            total += account.timelockedObjects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (obj.data.content.fields?.locked) {
                    amountToAdd = BigInt(obj.data.content.fields.locked);
                }
                return acc + amountToAdd;
            }, BigInt(0));
        }
        return total;
    });

    let allAccountsTotalStaked = $derived.by(() => {
        let total = BigInt(0);
        for (let account of extendedAccounts) {
            total += account.objects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (obj.data.content.fields?.principal && obj.label === 'StakedIota') {
                    amountToAdd = BigInt(obj.data.content.fields.principal);
                }
                return acc + amountToAdd;
            }, BigInt(0));

            total += account.timelockedObjects.reduce((acc, obj) => {
                let amountToAdd = BigInt(0);
                if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                    amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
                }
                return acc + amountToAdd;
            }, BigInt(0));
        }
        return total;
    });

    let selectedCurrency = $state('USD');
    let currentPrice = $state<{ usd: number; eur: number } | null>(null);

    const syncReset = async () => {
        try {
            // Preserve external accounts (not in $iota_accounts)
            const externalAccounts = extendedAccounts.filter(
                (acc) => !$iota_accounts.some((iotaAcc) => iotaAcc.address === acc.address),
            );
            // Reset only the $iota_accounts
            const iotaAccounts = $iota_accounts.map((account, i) => {
                return {
                    id: account.address,
                    address: account.address,
                    label: account.label,
                    objects: [],
                    timelockedObjects: [],
                    stakingRewards: BigInt(0),
                    isCollapsed: false,
                };
            });
            extendedAccounts = [...iotaAccounts, ...externalAccounts];
            await getObjects();
            await computeAllStakingRewards();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    function handleDnd(event: CustomEvent<DndEvent<any>>, accountId: string) {
        // Find the account being updated and set its new items
        const idx = extendedAccounts.findIndex((acc) => acc.address === accountId);
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

    async function computeAllStakingRewards() {
        try {
            const client = getClient();
            const updatedAccounts = await Promise.all(
                extendedAccounts.map(async (account) => {
                    // Collect all staked objects (both regular and timelocked)
                    const stakedIotaObjects = account.objects.filter(
                        (obj) => obj.label === 'StakedIota',
                    );
                    const timelockedStakedIotaObjects = account.timelockedObjects.filter(
                        (obj) => obj.label === 'TimelockedStakedIota',
                    );
                    const allStakedObjects = [...stakedIotaObjects, ...timelockedStakedIotaObjects];

                    // Calculate rewards in parallel for all staked objects
                    const rewardsPromises = allStakedObjects.map(async (obj) => {
                        try {
                            const stakeData = await computeStakingRewards(
                                client,
                                obj.id,
                                account.address,
                            );
                            return BigInt(stakeData.rewards);
                        } catch (err) {
                            console.warn(
                                `Failed to compute rewards for ${obj.label} ${obj.id}:`,
                                err,
                            );
                            return BigInt(0);
                        }
                    });

                    const rewards = await Promise.all(rewardsPromises);
                    const totalRewards = rewards.reduce((sum, reward) => sum + reward, BigInt(0));

                    return { ...account, stakingRewards: totalRewards };
                }),
            );
            extendedAccounts = updatedAccounts;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
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
                        .sort((a, b) => {
                            const aBal = BigInt(a.data.content.fields.balance);
                            const bBal = BigInt(b.data.content.fields.balance);
                            if (bBal > aBal) return 1;
                            if (bBal < aBal) return -1;
                            return 0;
                        })[0];
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

    async function prepareTxBytes() {
        try {
            const client = getClient();
            let preparedTxs = await prepareTxs();

            let results = [];
            for (const preparedTx of preparedTxs) {
                const { sender, recipients, transaction } = preparedTx;

                let json = JSON.parse(await transaction.toJSON());

                if (transaction.getData().gasData.price == 0) {
                    let referenceGasPrice = await client.getReferenceGasPrice();
                    transaction.setGasPrice(referenceGasPrice);
                }
                if (transaction.getData().gasData.budget == 0) {
                    let gas = await calculateGasFee(transaction);
                    transaction.setGasBudget(BigInt(gas!));
                }

                let transactionBytes = toBase64(await transaction.build({ client }));
                // @ts-ignore
                results.push({ sender, recipients, json, transactionBytes });
            }

            value = { txs: results.length, results };
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    let newAccountAddress = $state('');
    let newAccountError = $state('');

    function addExternalAccount() {
        const address = newAccountAddress.trim();
        newAccountError = '';
        if (!address) {
            newAccountError = 'Address is required.';
            return;
        }
        if (!isValidIotaAddress(address)) {
            newAccountError = 'Invalid IOTA address.';
            return;
        }
        // Prevent duplicates
        if (
            extendedAccounts.some((acc) => acc.address === address) ||
            $iota_accounts.some((acc) => acc.address === address)
        ) {
            newAccountError = 'Account already exists.';
            return;
        }
        extendedAccounts = [
            ...extendedAccounts,
            {
                id: address,
                address,
                label: 'External: ' + address.slice(0, 6) + '...' + address.slice(-4),
                objects: [],
                timelockedObjects: [],
                stakingRewards: BigInt(0),
                isCollapsed: false,
            },
        ];
        newAccountAddress = '';
    }

    function removeAccount(address: string) {
        extendedAccounts = extendedAccounts.filter((acc) => acc.address !== address);
    }

    function getAccountDisplayName(address: string): string {
        const acc = extendedAccounts.find((a) => a.address === address);
        return acc
            ? acc.label || address.slice(0, 6) + '...' + address.slice(-4)
            : address.slice(0, 6) + '...' + address.slice(-4);
    }

    function toggleCollapse(accountId: string) {
        const idx = extendedAccounts.findIndex((acc) => acc.id === accountId);
        if (idx !== -1) {
            extendedAccounts[idx] = {
                ...extendedAccounts[idx],
                isCollapsed: !extendedAccounts[idx].isCollapsed,
            };
        }
    }
</script>

<main class="container">
    <div class="toolbar">
        <div style="display: flex; gap: 0.5rem;">
            <button onclick={syncReset} style="background: #059669;">Sync/Reset</button>
        </div>
        <div
            style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1; flex-wrap: wrap;"
        >
            <input
                type="text"
                placeholder="Enter external address (0x...)"
                bind:value={newAccountAddress}
            />
            <button onclick={addExternalAccount}>Add Account</button>
        </div>

        <div style="display: flex; gap: 0.5rem;">
            <button onclick={dryRun}>Dry Run</button>
            <button onclick={prepareTxBytes}>Prepare Tx Bytes</button>
            <button onclick={send}>Send</button>
        </div>
    </div>

    {#if newAccountError}
        <div style="color: #ef4444; padding: 0 0.5rem;">{newAccountError}</div>
    {/if}

    <TransactionView bind:value />

    <div class="summary-section">
        <div class="summary-header">
            <h3>Balance Breakdown</h3>
            <div class="price-controls">
                <select bind:value={selectedCurrency}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <button onclick={() => fetchCurrentPrice().then((price) => (currentPrice = price))}>
                    Fetch Price
                </button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount (IOTA)</th>
                        <th>Value ({selectedCurrency})</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="total-row" style="background: rgba(16, 185, 129, 0.1);">
                        <td><strong>Total</strong></td>
                        <td><strong>{nanoToIota(allAccountsTotalBalance.toString())}</strong></td>
                        <td>
                            <strong>
                                {currentPrice
                                    ? (
                                          parseFloat(
                                              nanoToIota(allAccountsTotalBalance.toString()),
                                          ) *
                                          (selectedCurrency === 'USD'
                                              ? currentPrice.usd
                                              : currentPrice.eur)
                                      ).toFixed(2)
                                    : '-'}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td>IOTA Coins</td>
                        <td>{nanoToIota(allAccountsTotalIotaCoins.toString())}</td>
                        <td>
                            {currentPrice
                                ? (
                                      parseFloat(nanoToIota(allAccountsTotalIotaCoins.toString())) *
                                      (selectedCurrency === 'USD'
                                          ? currentPrice.usd
                                          : currentPrice.eur)
                                  ).toFixed(2)
                                : '-'}
                        </td>
                    </tr>
                    <tr>
                        <td>Staked</td>
                        <td>{nanoToIota(allAccountsTotalStaked.toString())}</td>
                        <td>
                            {currentPrice
                                ? (
                                      parseFloat(nanoToIota(allAccountsTotalStaked.toString())) *
                                      (selectedCurrency === 'USD'
                                          ? currentPrice.usd
                                          : currentPrice.eur)
                                  ).toFixed(2)
                                : '-'}
                        </td>
                    </tr>
                    <tr>
                        <td>Staking Rewards</td>
                        <td>{nanoToIota(allAccountsTotalRewards.toString())}</td>
                        <td>
                            {currentPrice
                                ? (
                                      parseFloat(nanoToIota(allAccountsTotalRewards.toString())) *
                                      (selectedCurrency === 'USD'
                                          ? currentPrice.usd
                                          : currentPrice.eur)
                                  ).toFixed(2)
                                : '-'}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="accounts-grid">
        {#each extendedAccounts as account (account.id)}
            <div class="account-card">
                <div class="account-header">
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="account-title" title={account.address}>
                                {account.label ||
                                    account.address.slice(0, 6) + '...' + account.address.slice(-4)}
                            </span>
                            <button
                                style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; background: var(--secondary-color); border-radius: 3px;"
                                onclick={() => navigator.clipboard.writeText(account.address)}
                            >
                                Copy Address
                            </button>
                        </div>
                        <div
                            class="account-buttons"
                            style="display: flex; gap: 0.5rem; margin-top: 0.2rem;"
                        >
                            <button
                                style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"
                                onclick={() => toggleCollapse(account.id)}
                            >
                                {account.isCollapsed ? '▶ Expand' : '▼ Collapse'} ({account.objects
                                    .length + account.timelockedObjects.length})
                            </button>
                        </div>
                    </div>
                    <div
                        style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem;"
                    >
                        <button
                            class="danger"
                            style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"
                            onclick={() => removeAccount(account.address)}
                        >
                            Remove
                        </button>
                        <div class="account-balance">
                            {nanoToIota(
                                (
                                    account.objects.reduce((acc, obj) => {
                                        let amountToAdd = BigInt(0);
                                        if (obj.data.content.fields?.balance) {
                                            amountToAdd = BigInt(obj.data.content.fields.balance);
                                        } else if (obj.data.content.fields?.principal) {
                                            amountToAdd = BigInt(obj.data.content.fields.principal);
                                        }
                                        return acc + amountToAdd;
                                    }, BigInt(0)) +
                                    account.timelockedObjects.reduce((acc, obj) => {
                                        let amountToAdd = BigInt(0);
                                        if (obj.data.content.fields?.locked) {
                                            amountToAdd = BigInt(obj.data.content.fields?.locked);
                                        } else if (
                                            obj.data.content.fields?.staked_iota?.fields?.principal
                                        ) {
                                            amountToAdd = BigInt(
                                                obj.data.content.fields.staked_iota.fields
                                                    .principal,
                                            );
                                        }
                                        return acc + amountToAdd;
                                    }, BigInt(0)) +
                                    account.stakingRewards
                                ).toString(),
                            )}
                            <span style="font-size: 0.8em; color: var(--text-muted);">IOTA</span>
                        </div>
                    </div>
                </div>

                {#if !account.isCollapsed}
                    <div
                        use:dragHandleZone={{
                            items: account.objects,
                            flipDurationMs: 200,
                        }}
                        onconsider={(e) => handleDnd(e, account.id)}
                        onfinalize={(e) => handleDnd(e, account.id)}
                        class="object-list"
                    >
                        {#each account.objects as item (item.id)}
                            <div
                                class="object-item"
                                class:foreign={account.address !== item.currentOwner}
                            >
                                <div use:dragHandle class="object-header">
                                    <span class="object-type" title={item.label}>
                                        {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                            IOTA Coin
                                        {:else}
                                            {item.label}
                                        {/if}
                                    </span>
                                    <span class="object-amount">
                                        {#if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                            {nanoToIota(item.data?.content.fields?.balance)}
                                        {:else if item.label == 'StakedIota'}
                                            {nanoToIota(item.data?.content.fields?.principal)}
                                        {:else if item.label == 'TimelockedStakedIota'}
                                            {nanoToIota(
                                                item.data.content.fields.staked_iota.fields
                                                    .principal,
                                            )}
                                        {/if}
                                    </span>
                                </div>

                                <div style="position: relative;">
                                    {#if account.address !== item.currentOwner}
                                        <div
                                            style="position: absolute; left: 0; top: 0; height: 1.2rem; display: flex; align-items: center; font-size: 0.7rem; color: #f59e0b; pointer-events: none;"
                                        >
                                            From: {getAccountDisplayName(item.currentOwner)}
                                        </div>
                                    {/if}
                                    <details class="object-details">
                                        <summary
                                            style="text-align: center; list-style-position: inside;"
                                            >Data</summary
                                        >
                                        <pre>{JSON.stringify(item, null, 2)}</pre>
                                    </details>
                                </div>
                            </div>
                        {/each}

                        {#if account.objects.length === 0 && account.timelockedObjects.length === 0}
                            <div
                                style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;"
                            >
                                No objects
                            </div>
                        {/if}

                        {#if account.timelockedObjects.length != 0}
                            <div
                                style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"
                            >
                                <div
                                    style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;"
                                >
                                    Timelocked
                                </div>
                                {#each account.timelockedObjects as item (item.id)}
                                    <div
                                        class="object-item"
                                        style="border-color: rgba(248, 113, 113, 0.3);"
                                    >
                                        <div class="object-header">
                                            <span class="object-type">{item.label}</span>
                                            <span class="object-amount">
                                                {#if item.label == 'TimelockedStakedIota'}
                                                    {nanoToIota(
                                                        item.data.content.fields.staked_iota.fields
                                                            .principal,
                                                    )}
                                                {:else if item.label.startsWith('Coin<0x2::iota::IOTA>')}
                                                    {nanoToIota(item.data?.content.fields?.balance)}
                                                {/if}
                                            </span>
                                        </div>
                                        <details class="object-details">
                                            <summary>Data</summary>
                                            <pre>{JSON.stringify(item, null, 2)}</pre>
                                        </details>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
        height: 100%;
        box-sizing: border-box;
    }

    @media (min-width: 768px) {
        .container {
            padding: 1rem;
        }
    }

    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        background: var(--background-card);
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }

    .toolbar input {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        flex-grow: 1;
        min-width: 200px;
    }

    .toolbar button {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .toolbar button:hover {
        background: var(--primary-hover);
        border-color: var(--accent-color);
    }

    button.danger {
        background: rgba(220, 53, 69, 0.2);
        border-color: rgba(220, 53, 69, 0.5);
        color: #ffadad;
    }

    button.danger:hover {
        background: rgba(220, 53, 69, 0.4);
    }

    .summary-section {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.75rem;
    }

    @media (max-width: 767px) {
        .summary-section {
            padding: 0.25rem;
        }
    }

    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .summary-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-muted);
    }

    .price-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .price-controls select {
        padding: 0.25rem;
        background-color: #232324;
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    .price-controls button {
        padding: 0.25rem 0.5rem;
        background-color: rgb(36, 47, 77);
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
    }

    .summary-table {
        margin-left: 0;
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .summary-table th,
    .summary-table td {
        padding: 0.25rem 0.5rem;
        text-align: right;
        border-bottom: 1px solid var(--border-color);
    }

    .summary-table th:first-child,
    .summary-table td:first-child {
        text-align: left;
    }

    .summary-table td:not(:first-child) {
        font-family: monospace;
        font-variant-numeric: tabular-nums;
    }

    .summary-table th {
        color: var(--text-muted);
        font-weight: 600;
    }

    .accounts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        padding-bottom: 0.5rem;
    }

    .account-card {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .account-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .account-title {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .account-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .account-balance {
        font-family: monospace;
        color: #4ade80; /* Greenish */
    }

    .object-list {
        flex-grow: 1;
        overflow-y: auto;
        max-height: 300px;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.1);
    }

    .object-item {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        margin-bottom: 0.25rem;
        padding: 0.4rem;
        font-size: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .object-item.foreign {
        border-left: 3px solid #f59e0b; /* Amber for foreign objects */
    }

    .object-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
    }

    .object-type {
        font-weight: 500;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
    }

    .object-amount {
        font-family: monospace;
    }

    .object-details {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }

    details summary {
        cursor: pointer;
        color: var(--accent-color);
    }
</style>

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
    }

    interface ExtendedObject {
        id: string;
        label: string;
        data: any;
        currentOwner: string;
    }

    let extendedAccounts: ExtendedAccount[] = $state([]);
    let allAccountsTotalBalance = $state(BigInt(0));
    let allAccountsTotalRewards = $state(BigInt(0));
    let allAccountsTotalIotaCoins = $state(BigInt(0));
    let allAccountsTotalStaked = $state(BigInt(0));
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
                };
            });
            extendedAccounts = [...iotaAccounts, ...externalAccounts];
            await getObjects();
            await computeAllStakingRewards();
            allAccountsTotalBalance = BigInt(0);
            allAccountsTotalRewards = BigInt(0);
            allAccountsTotalIotaCoins = BigInt(0);
            allAccountsTotalStaked = BigInt(0);
            for (let account of extendedAccounts) {
                // IOTA Coins: balance from regular objects + locked from timelocked objects
                allAccountsTotalIotaCoins += account.objects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (
                        obj.data.content.fields?.balance &&
                        obj.data.content.type === '0x2::coin::Coin<0x2::iota::IOTA>'
                    ) {
                        amountToAdd = BigInt(obj.data.content.fields.balance);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                allAccountsTotalIotaCoins += account.timelockedObjects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (obj.data.content.fields?.locked) {
                        amountToAdd = BigInt(obj.data.content.fields.locked);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                // Staked IOTAs: principal from regular staked + timelocked staked
                allAccountsTotalStaked += account.objects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (obj.data.content.fields?.principal && obj.label === 'StakedIota') {
                        amountToAdd = BigInt(obj.data.content.fields.principal);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                allAccountsTotalStaked += account.timelockedObjects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                        amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                // Total balance includes everything
                allAccountsTotalBalance += account.objects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (obj.data.content.fields?.balance) {
                        amountToAdd = BigInt(obj.data.content.fields.balance);
                    } else if (obj.data.content.fields?.principal) {
                        amountToAdd = BigInt(obj.data.content.fields.principal);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                allAccountsTotalBalance += account.timelockedObjects.reduce((acc, obj) => {
                    let amountToAdd = BigInt(0);
                    if (obj.data.content.fields?.locked) {
                        amountToAdd = BigInt(obj.data.content.fields?.locked);
                    } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
                        amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
                    }
                    return acc + amountToAdd;
                }, BigInt(0));

                // Add staking rewards to balance
                allAccountsTotalBalance += account.stakingRewards;
                allAccountsTotalRewards += account.stakingRewards;
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
            },
        ];
        newAccountAddress = '';
    }

    function removeExternalAccount(address: string) {
        // Only allow removal if not in $iota_accounts
        if ($iota_accounts.some((acc) => acc.address === address)) return;
        extendedAccounts = extendedAccounts.filter((acc) => acc.address !== address);
    }
</script>

<main>
    <span style="float:left">Drag and drop objects between accounts.</span>
    <br />
    <input
        type="text"
        placeholder="Enter external address"
        bind:value={newAccountAddress}
        style="margin:0.5rem;"
        size="67"
    />
    <button onclick={addExternalAccount}>Add External Account</button>
    {#if newAccountError}
        <div style="color: #d63031; margin: 0.5rem;">{newAccountError}</div>
    {/if}
    <br />
    <button onclick={syncReset}> sync/reset </button>
    <button onclick={dryRun}> dry run </button>
    <button onclick={prepareTxBytes}> prepare tx bytes </button>
    <button onclick={send}> send </button>

    <TransactionView {value} />

    <br />
    <div class="balance-breakdown">
        <div class="balance-header">
            <h3>Balance Breakdown for All Accounts</h3>
            <div class="price-controls">
                <select bind:value={selectedCurrency}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <button onclick={() => fetchCurrentPrice().then((price) => (currentPrice = price))}
                    >Fetch price from CoinGecko</button
                >
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount (IOTA)</th>
                    <th>Value ({selectedCurrency})</th>
                </tr>
            </thead>
            <tbody>
                <tr class="total-row">
                    <td><strong>Total IOTA Amount</strong></td>
                    <td><strong>{nanoToIota(allAccountsTotalBalance.toString())}</strong></td>
                    <td
                        ><strong
                            >{currentPrice
                                ? (
                                      parseFloat(nanoToIota(allAccountsTotalBalance.toString())) *
                                      (selectedCurrency === 'USD'
                                          ? currentPrice.usd
                                          : currentPrice.eur)
                                  ).toFixed(2)
                                : '-'}</strong
                        ></td
                    >
                </tr>
                <tr>
                    <td>IOTA Coins</td>
                    <td>{nanoToIota(allAccountsTotalIotaCoins.toString())}</td>
                    <td
                        >{currentPrice
                            ? (
                                  parseFloat(nanoToIota(allAccountsTotalIotaCoins.toString())) *
                                  (selectedCurrency === 'USD' ? currentPrice.usd : currentPrice.eur)
                              ).toFixed(2)
                            : '-'}</td
                    >
                </tr>
                <tr>
                    <td>Staked IOTAs</td>
                    <td>{nanoToIota(allAccountsTotalStaked.toString())}</td>
                    <td
                        >{currentPrice
                            ? (
                                  parseFloat(nanoToIota(allAccountsTotalStaked.toString())) *
                                  (selectedCurrency === 'USD' ? currentPrice.usd : currentPrice.eur)
                              ).toFixed(2)
                            : '-'}</td
                    >
                </tr>
                <tr>
                    <td>Staking Rewards</td>
                    <td>{nanoToIota(allAccountsTotalRewards.toString())}</td>
                    <td
                        >{currentPrice
                            ? (
                                  parseFloat(nanoToIota(allAccountsTotalRewards.toString())) *
                                  (selectedCurrency === 'USD' ? currentPrice.usd : currentPrice.eur)
                              ).toFixed(2)
                            : '-'}</td
                    >
                </tr>
            </tbody>
        </table>
    </div>

    <div class="grid">
        {#each extendedAccounts as account (account.id)}
            <div class="account">
                <div class="accountHeader">
                    {account.label ||
                        account.address.slice(0, 6) + '...' + account.address.slice(-4)}: {nanoToIota(
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
                                        obj.data.content.fields.staked_iota.fields.principal,
                                    );
                                }
                                return acc + amountToAdd;
                            }, BigInt(0)) +
                            account.stakingRewards
                        ).toString(),
                    )} IOTA
                    {#if account.stakingRewards > BigInt(0)}
                        <span style="color: #00d084; font-size: 0.85em;">
                            (+{nanoToIota(account.stakingRewards.toString())} rewards)
                        </span>
                    {/if}
                </div>

                {#if !$iota_accounts.some((acc) => acc.address === account.address)}
                    <button
                        style="margin:0.2rem; background-color: #d63031; "
                        onclick={() => removeExternalAccount(account.address)}
                    >
                        Remove External Account
                    </button>
                    <br />
                {/if}
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
        background-color: rgb(36, 47, 77);
    }
    .balance-breakdown {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background-color: #1b2021;
        border: 1px solid #535353;
        border-radius: 8px;
    }
    .balance-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .balance-header h3 {
        margin: 0;
        color: #ffffff;
        font-size: 1rem;
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
    .price-controls button:hover {
        background-color: rgb(46, 57, 87);
    }
    .balance-breakdown table {
        width: 100%;
        border-collapse: collapse;
        color: #ffffff;
        font-size: 0.9rem;
    }
    .balance-breakdown th,
    .balance-breakdown td {
        padding: 0.25rem 0.5rem;
        text-align: left;
        border-bottom: 1px solid #535353;
    }
    .balance-breakdown th {
        background-color: rgb(36, 47, 77);
        font-weight: bold;
        font-size: 0.85rem;
    }
    .balance-breakdown .total-row {
        background-color: rgba(0, 208, 132, 0.1);
        border-top: 2px solid #00d084;
    }
    .balance-breakdown .total-row td {
        font-weight: bold;
        color: #00d084;
    }
</style>

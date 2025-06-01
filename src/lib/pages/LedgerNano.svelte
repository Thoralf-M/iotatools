<script lang="ts">
    import { toHEX } from '@iota/bcs';
    import type { IotaClient } from '@iota/iota-sdk/client';
    import { messageWithIntent, toSerializedSignature } from '@iota/iota-sdk/cryptography';
    import { Ed25519PublicKey } from '@iota/iota-sdk/keypairs/ed25519';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import IotaLedgerClient from '@iota/ledgerjs-hw-app-iota';
    import TransportWebHID from '@ledgerhq/hw-transport-webhid';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { getClient } from '../lib/client';

    const IOTA_BIP44_COIN_TYPE = 4218;
    const TESTNET_BIP44_COIN_TYPE = 1;
    let coinType = $state(TESTNET_BIP44_COIN_TYPE);
    let accountIndex = $state(0);
    let change = $state(0);
    let addressIndex = $state(0);

    let numberToIncrease = $state(3);
    let accountOrAddress = $state('account');

    let dryRun = $state(true);
    let iotaAmountToSend = $state('1');
    let senderAddress = $state('');
    let recipientAddress = $state('');

    // Will be updated with the result
    let value = $state({});
    type AccountEntry = {
        address: string;
        publicKey: string;
        bip44Path: string;
        totalBalance?: string;
        objectCount?: number;
    };
    let accountEntries: AccountEntry[] = $state([]);

    let ledgerTransport: any;

    async function connect() {
        try {
            ledgerTransport = await TransportWebHID.create();
            console.log(ledgerTransport);
            value = 'connected!';
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function generateAddress() {
        try {
            // @ts-ignore
            const ledgerClient = new IotaLedgerClient(ledgerTransport);
            let bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
            console.log(bip44Path);

            const exists = accountEntries.some((entry) => entry.bip44Path === bip44Path);
            if (exists) {
                return;
            }

            let result = await ledgerClient.getPublicKey(bip44Path);
            console.log(result);
            let publicKey = '0x' + toHEX(result.publicKey);
            let address = '0x' + toHEX(result.address);
            accountEntries.push({
                address: address,
                publicKey: publicKey,
                bip44Path,
            });
            value = accountEntries;
            formatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function generateMultipleAddresses() {
        try {
            if (accountOrAddress == 'account') {
                let finalIndex = accountIndex + numberToIncrease;
                for (accountIndex; accountIndex < finalIndex; accountIndex++) {
                    await generateAddress();
                }
            } else {
                let finalIndex = addressIndex + numberToIncrease;
                for (addressIndex; addressIndex < finalIndex; addressIndex++) {
                    await generateAddress();
                }
            }
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    type AddressWithIndex = {
        address: string;
        internal: boolean;
        index: number;
        totalBalance?: string;
        objectCount?: number;
    };
    type GroupedAccountEntry = [number, AddressWithIndex[]];
    let tableAccounts: GroupedAccountEntry[] = $state([]);
    let expanded: number[] = $state([]);

    function formatAsTable() {
        type GroupedAccounts = {
            [accountIndex: number]: AddressWithIndex[];
        };
        // Group by account index
        let grouped: GroupedAccounts = [];

        for (const address of accountEntries) {
            const match = address.bip44Path.match(/m\/44'\/\d+'\/(\d+)'\/(\d+)'\/(\d+)'?/);
            if (!match) {
                throw new Error('Invalid BIP44 path:' + address.bip44Path);
            }
            const accountIndex = parseInt(match[1]);
            const change = parseInt(match[2]);
            const addressIndex = parseInt(match[3]);

            if (!grouped[accountIndex]) {
                grouped[accountIndex] = [];
            }

            grouped[accountIndex].push({
                address: address.address,
                internal: change == 1,
                index: addressIndex,
                totalBalance: address.totalBalance,
                objectCount: address.objectCount,
            });
            grouped[accountIndex].sort((a, b) => a.index - b.index);
        }

        tableAccounts = Object.entries(grouped).map(([key, value]) => [parseInt(key), value]);
    }
    function toggle(index: number) {
        if (expanded.includes(index)) {
            expanded = expanded.filter((i) => i !== index);
        } else {
            expanded = [...expanded, index];
        }
    }

    function isExpanded(index: number): boolean {
        return expanded.includes(index);
    }
    async function getAllBalances(skipKnown: boolean = false) {
        try {
            const client = getClient();
            for (const entry of accountEntries) {
                // skip if the balance is already known
                if (entry.totalBalance && skipKnown) {
                    continue;
                }
                let page = await client.getBalance({
                    owner: entry.address,
                });
                entry.totalBalance = page.totalBalance;
            }
            formatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function getAllObjects(skipKnown: boolean = false) {
        try {
            const client = getClient();
            for (const entry of accountEntries) {
                // skip if the balance is already known
                if (entry.objectCount && skipKnown) {
                    continue;
                }
                let page = await client.getOwnedObjects({
                    owner: entry.address,
                });
                entry.objectCount = page.data.length;
            }
            formatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function sendAllObjects() {
        try {
            if (!isValidIotaAddress(senderAddress)) {
                throw new Error('invalid sender address');
            }
            if (!isValidIotaAddress(recipientAddress)) {
                throw new Error('invalid recipient address');
            }

            // Get bip path from previously generated address or use from the input fields
            let address = accountEntries.find((addr) => addr.address == senderAddress);
            let bip44Path = address?.bip44Path;
            if (!bip44Path) {
                bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
            }

            const client = getClient();

            const tx = new Transaction();
            let page = await client.getOwnedObjects({
                owner: senderAddress,
                options: {
                    showType: true,
                },
            });
            if (page.data.length == 0) {
                throw new Error('No objects found');
            }

            const gasCoinIndex = page.data.findIndex((o) => {
                return o.data?.type === `0x2::coin::Coin<0x2::iota::IOTA>`;
            });
            let gasCoin = null;
            if (gasCoinIndex !== -1) {
                gasCoin = page.data.splice(gasCoinIndex, 1)[0];
            }
            if (!gasCoin) {
                throw new Error('No gas coin found');
            }

            let objectsToTransfer = page.data.map((o) => o.data?.objectId!);
            // @ts-ignore
            objectsToTransfer.push(tx.gas);
            tx.transferObjects(objectsToTransfer, tx.pure.address(recipientAddress));
            await finishTransaction(tx, bip44Path, client);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function sendIotaAmount() {
        try {
            if (!isValidIotaAddress(senderAddress)) {
                throw new Error('invalid sender address');
            }
            if (!isValidIotaAddress(recipientAddress)) {
                throw new Error('invalid recipient address');
            }

            // Get bip path from previously generated address or use from the input fields
            let address = accountEntries.find((addr) => addr.address == senderAddress);
            let bip44Path = address?.bip44Path;
            if (!bip44Path) {
                bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
            }

            const client = getClient();

            const tx = new Transaction();
            let balance = await client.getBalance({
                owner: senderAddress,
            });

            if (BigInt(balance.totalBalance) < BigInt(iotaAmountToSend)) {
                throw new Error(`Not enough balance ${balance.totalBalance}/${iotaAmountToSend}`);
            }

            const coins = tx.splitCoins(tx.gas, [BigInt(iotaAmountToSend)]);
            tx.transferObjects([coins[0]], tx.pure.address(recipientAddress));
            await finishTransaction(tx, bip44Path, client);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function finishTransaction(tx: Transaction, bip44Path: string, client: IotaClient) {
        try {
            tx.setSender(senderAddress);
            const txBytes = await tx.build({ client });
            if (dryRun) {
                const dryRunResult = await client.dryRunTransactionBlock({
                    transactionBlock: txBytes,
                });
                console.log(dryRunResult);
                value = dryRunResult;
            } else {
                const ledgerClient = new IotaLedgerClient(ledgerTransport);
                let txMessageIntent = messageWithIntent('TransactionData', txBytes);
                const { signature } = await ledgerClient.signTransaction(
                    bip44Path,
                    txMessageIntent,
                );
                const { publicKey } = await ledgerClient.getPublicKey(bip44Path);
                const serializedSignature = toSerializedSignature({
                    signature,
                    signatureScheme: 'ED25519',
                    publicKey: new Ed25519PublicKey(publicKey),
                });
                const result = await client.executeTransactionBlock({
                    transactionBlock: txBytes,
                    signature: serializedSignature,
                    options: {
                        showBalanceChanges: true,
                        showEffects: true,
                    },
                });
                console.log(result);
                value = result;
            }
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
</script>

<main>
    <button onclick={() => connect()}> connect </button>
    <br />
    BIP 44 path: (m/44'/coinType'/accountIndex'/change'/addressIndex')
    <br />
    <input type="number" list="coinTypes" bind:value={coinType} placeholder="BIP-44 coin type" />
    <datalist id="coinTypes">
        <option value={IOTA_BIP44_COIN_TYPE}>IOTA </option>
        <option value={TESTNET_BIP44_COIN_TYPE}>Testnet </option>
    </datalist>

    <input type="number" min="0" bind:value={accountIndex} placeholder="account index" />
    <select bind:value={change}>
        <option value={0}>0</option>
        <option value={1}>1</option>
    </select>
    <input type="number" width="1" min="0" bind:value={addressIndex} placeholder="address index" />

    <button onclick={() => generateAddress()}> generate address </button>
    <br />

    increase
    <select bind:value={accountOrAddress}>
        <option value={'account'}>account</option>
        <option value={'address'}>address</option>
    </select>
    index by:
    <input type="number" min="1" bind:value={numberToIncrease} placeholder="number to generate" />

    <button onclick={() => generateMultipleAddresses()}> generate multiple addresses </button>

    <hr />
    <button onclick={() => getAllBalances(true)}> get unknown balances </button>
    <button onclick={() => getAllBalances()}> get all balances </button>
    <button onclick={() => getAllObjects(true)}> get unknown objects </button>
    <button onclick={() => getAllObjects()}> get all objects </button>
    <hr />

    <div>
        Sender address: <input
            type="string"
            size="70"
            bind:value={senderAddress}
            placeholder="sender address"
        />
    </div>
    <div>
        Recipient address: <input
            type="string"
            size="70"
            bind:value={recipientAddress}
            placeholder="recipient address"
        />
    </div>
    <select bind:value={dryRun}>
        <option value={true}>dry run</option>
        <option value={false}>send</option>
    </select>
    <button onclick={() => sendAllObjects()}> send all objects </button>
    IOTA amount(in Nanos) to send:
    <input type="number" min="0" bind:value={iotaAmountToSend} placeholder="IOTA amount to send" />
    <button onclick={() => sendIotaAmount()}> send IOTA </button>

    <hr />
    <button
        onclick={() => {
            accountEntries = [];
            tableAccounts = [];
            value = '';
        }}
    >
        clear address list
    </button>
    <button
        onclick={() => {
            // expand all sections of the table
            expanded = tableAccounts.map((e) => e[0]);
        }}
    >
        expand all
    </button>
    <button
        onclick={() => {
            // collapse all sections of the table
            expanded = [];
        }}
    >
        collapse all
    </button>
    <JsonToggleView {value} />
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        th,
        td {
            padding: 0.75rem;
            border: 1px solid #ccc;
            text-align: left;
        }
        td.accountEntries {
            font-family: monospace;
        }
        tr.clickable {
            cursor: pointer;
            background-color: #f9f9f9;
        }
        tr.clickable:hover {
            background-color: #eee;
        }
    </style>

    <table>
        <thead>
            <tr>
                <th>Account</th>
                <th>Addresses</th>
            </tr>
        </thead>
        <tbody>
            {#each tableAccounts as [index, addresses]}
                <tr class="clickable" onclick={() => toggle(index)}>
                    <td>Account {index} (addresses: {addresses.length})</td>
                    <td>{isExpanded(index) ? '▼ Click to collapse' : '▶ Click to expand'}</td>
                </tr>
                {#if isExpanded(index)}
                    <tr>
                        <td colspan="2">
                            <table class="inner-table">
                                <thead>
                                    <tr>
                                        <th>Index</th>
                                        <th>Internal</th>
                                        <th>Address</th>
                                        <th>Balance</th>
                                        <th>Owned Objects</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each addresses as addr}
                                        <tr>
                                            <td>{addr.index}</td>
                                            <td>{addr.internal}</td>
                                            <td class="mono">{addr.address}</td>
                                            <td>{addr.totalBalance}</td>
                                            <td>{addr.objectCount}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</main>

<style>
    button {
        margin: 0.5rem;
    }
    .inner-table {
        width: 100%;
        margin-top: 0.5rem;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .inner-table th,
    .inner-table td {
        border: 1px solid #4f4f4f;
        padding: 0.4rem 0.6rem;
        text-align: left;
    }
    .inner-table th,
    td {
        background-color: #262626;
    }

    .mono {
        font-family: monospace;
    }
</style>

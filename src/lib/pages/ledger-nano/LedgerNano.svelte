<script lang="ts">
    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import {
        connectToLedger,
        formatAsTable,
        generateAddress,
        generateMultipleAddresses,
        getAllBalances,
        getAllObjects,
        IOTA_BIP44_COIN_TYPE,
        sendAllObjects,
        sendIotaAmount,
        TESTNET_BIP44_COIN_TYPE,
        type AccountEntry,
        type AddressWithIndex,
        type GroupedAccountEntry,
    } from './ledger-nano-service';

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
    let accountEntries: AccountEntry[] = $state([]);

    async function connect() {
        try {
            value = await connectToLedger();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function handleGenerateAddress() {
        try {
            accountEntries = await generateAddress(
                coinType,
                accountIndex,
                change,
                addressIndex,
                accountEntries,
            );
            value = accountEntries;
            handleFormatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function handleGenerateMultipleAddresses() {
        try {
            accountEntries = await generateMultipleAddresses(
                coinType,
                accountIndex,
                change,
                addressIndex,
                numberToIncrease,
                accountOrAddress,
                accountEntries,
            );
            value = accountEntries;
            handleFormatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    let tableAccounts: GroupedAccountEntry[] = $state([]);
    let expanded: number[] = $state([]);

    function handleFormatAsTable() {
        tableAccounts = formatAsTable(accountEntries);
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
    async function handleGetAllBalances(skipKnown: boolean = false) {
        try {
            accountEntries = await getAllBalances(accountEntries, skipKnown);
            handleFormatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function handleGetAllObjects(skipKnown: boolean = false) {
        try {
            accountEntries = await getAllObjects(accountEntries, skipKnown);
            handleFormatAsTable();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function handleSendAllObjects() {
        try {
            value = await sendAllObjects(
                senderAddress,
                recipientAddress,
                coinType,
                accountIndex,
                change,
                addressIndex,
                accountEntries,
                dryRun,
            );
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function handleSendIotaAmount() {
        try {
            value = await sendIotaAmount(
                senderAddress,
                recipientAddress,
                iotaAmountToSend,
                coinType,
                accountIndex,
                change,
                addressIndex,
                accountEntries,
                dryRun,
            );
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

    <button onclick={() => handleGenerateAddress()}> generate address </button>
    <br />

    increase
    <select bind:value={accountOrAddress}>
        <option value={'account'}>account</option>
        <option value={'address'}>address</option>
    </select>
    index by:
    <input type="number" min="1" bind:value={numberToIncrease} placeholder="number to generate" />

    <button onclick={() => handleGenerateMultipleAddresses()}> generate multiple addresses </button>

    <hr />
    <button onclick={() => handleGetAllBalances(true)}> get unknown balances </button>
    <button onclick={() => handleGetAllBalances()}> get all balances </button>
    <button onclick={() => handleGetAllObjects(true)}> get unknown objects </button>
    <button onclick={() => handleGetAllObjects()}> get all objects </button>
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
    <button onclick={() => handleSendAllObjects()}> send all objects </button>
    IOTA amount(in Nanos) to send:
    <input type="number" min="0" bind:value={iotaAmountToSend} placeholder="IOTA amount to send" />
    <button onclick={() => handleSendIotaAmount()}> send IOTA </button>

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
                                        <th>PublicKey</th>
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
                                            <td class="mono">{addr.publicKey}</td>
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
    input {
        min-width: 6rem;
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
    tr.clickable {
        cursor: pointer;
        background-color: #f9f9f9;
    }
    tr.clickable:hover {
        background-color: #eee;
    }
</style>

<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient } from '../lib/client';
    import { activeAddress } from '../lib/signer-data';
    import { executeTransaction } from '../lib/transaction-execution';

    let transfersJson = `0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900 1000000000
0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11 2000000000`;

    let coinType = '0x2::iota::IOTA'; // Default to IOTA
    let coinSymbol = 'IOTA'; // Display symbol
    let availableCoins: Array<{ coinType: string; totalBalance: string; symbol: string }> = []; // Store fetched coins
    let fetchingCoins = false; // Loading state
    let fetchError = ''; // Error message for fetching

    // Update coin symbol when coin type changes
    $: {
        if (coinType === '0x2::iota::IOTA') {
            coinSymbol = 'IOTA';
        } else {
            // Extract symbol from coin type if possible, otherwise use generic name
            const parts = coinType.split('::');
            coinSymbol = parts.length > 2 ? parts[parts.length - 1].toUpperCase() : 'TOKEN';
        }
    }

    const fetchAvailableCoins = async () => {
        try {
            fetchingCoins = true;
            fetchError = '';
            const client = getClient();
            const balances = await client.getAllBalances({ owner: $activeAddress });

            // Filter out zero balances and format the data
            availableCoins = balances
                .filter((balance) => parseInt(balance.totalBalance) > 0)
                .map((balance) => ({
                    coinType: balance.coinType,
                    totalBalance: balance.totalBalance,
                    symbol: extractSymbolFromCoinType(balance.coinType),
                }));

            console.log('Available coins:', availableCoins);
        } catch (err: any) {
            fetchError = err.toString();
            console.error('Error fetching coins:', err);
        } finally {
            fetchingCoins = false;
        }
    };

    function extractSymbolFromCoinType(coinType: string): string {
        if (coinType === '0x2::iota::IOTA') {
            return 'IOTA';
        } else {
            const parts = coinType.split('::');
            return parts.length > 2 ? parts[parts.length - 1].toUpperCase() : 'TOKEN';
        }
    }

    function selectCoinFromDropdown(selectedCoinType: string) {
        coinType = selectedCoinType;
    }

    function parseTransfers(input: string) {
        const trimmed = input.trim();

        // Try to parse as JSON first
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                // Validate JSON transfers
                for (let i = 0; i < parsed.length; i++) {
                    const transfer = parsed[i];
                    if (!transfer.address || typeof transfer.address !== 'string') {
                        throw new Error(`Transfer ${i}: address is required and must be a string`);
                    }
                    if (!isValidIotaAddress(transfer.address)) {
                        throw new Error(
                            `Transfer ${i}: invalid IOTA address "${transfer.address}"`,
                        );
                    }
                    if (
                        !transfer.amount ||
                        typeof transfer.amount !== 'number' ||
                        transfer.amount <= 0
                    ) {
                        throw new Error(
                            `Transfer ${i}: amount is required and must be a positive number`,
                        );
                    }
                }
                return parsed;
            }
        } catch (e) {
            // If it's a JSON parsing error, throw it
            if (e instanceof SyntaxError) {
                // Not JSON, try simple format
            } else {
                // It's our validation error, re-throw it
                throw e;
            }
        }

        // Parse simple format: "address amount" per line (space or comma separated)
        const lines = trimmed.split('\n').filter((line) => line.trim());
        const transfers = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip header line if it looks like CSV headers
            if (
                i === 0 &&
                line.toLowerCase().includes('address') &&
                line.toLowerCase().includes('amount')
            ) {
                continue;
            }

            // Try comma-separated first (CSV), then space-separated
            let parts = line.split(',').map((p) => p.trim());
            if (parts.length !== 2) {
                parts = line.split(/\s+/);
            }

            if (parts.length !== 2) {
                throw new Error(
                    `Line ${i + 1}: Expected format "address,amount" or "address amount", got "${line}"`,
                );
            }

            const [address, amountStr] = parts;

            // Validate address
            if (!isValidIotaAddress(address)) {
                throw new Error(`Line ${i + 1}: Invalid IOTA address "${address}"`);
            }

            const amount = parseFloat(amountStr);

            if (isNaN(amount) || amount <= 0) {
                throw new Error(`Line ${i + 1}: Invalid amount "${amountStr}"`);
            }

            transfers.push({ address, amount });
        }

        return transfers;
    }

    // Will be updated with the result
    let value = {};
    let errorMsg = '';

    // Compute total amount
    $: totalAmountNano = (() => {
        try {
            const transfers = parseTransfers(transfersJson);
            return transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
        } catch {
            return 0;
        }
    })();

    $: totalAmountDisplay =
        coinType === '0x2::iota::IOTA'
            ? (totalAmountNano / 1_000_000_000).toLocaleString() + ' IOTA'
            : totalAmountNano.toLocaleString() + ` ${coinSymbol}`;

    const executeBulkTransfer = async () => {
        try {
            errorMsg = '';

            // Parse the transfers
            let transfers;
            try {
                transfers = parseTransfers(transfersJson);
            } catch (parseErr) {
                const errorMessage =
                    parseErr instanceof Error ? parseErr.message : String(parseErr);
                throw new Error(`Parse error: ${errorMessage}`);
            }

            // Validate transfers array
            if (!Array.isArray(transfers) || transfers.length === 0) {
                throw new Error('Transfers must be a non-empty array');
            }

            // Validate each transfer object
            for (let i = 0; i < transfers.length; i++) {
                const transfer = transfers[i];
                if (!transfer.address || typeof transfer.address !== 'string') {
                    throw new Error(`Transfer ${i}: address is required and must be a string`);
                }
                if (!isValidIotaAddress(transfer.address)) {
                    throw new Error(`Transfer ${i}: invalid IOTA address "${transfer.address}"`);
                }
                if (
                    !transfer.amount ||
                    typeof transfer.amount !== 'number' ||
                    transfer.amount <= 0
                ) {
                    throw new Error(
                        `Transfer ${i}: amount is required and must be a positive number`,
                    );
                }
            }

            console.log(
                `Executing bulk transfer to ${transfers.length} recipients using ${coinSymbol}`,
            );

            const txb = new Transaction();

            if (coinType === '0x2::iota::IOTA') {
                // For IOTA, use the gas coin like before
                const coins = txb.splitCoins(
                    txb.gas,
                    transfers.map((transfer) => transfer.amount),
                );

                transfers.forEach((transfer, index) => {
                    txb.transferObjects([coins[index]], transfer.address);
                });
            } else {
                // For other coin types, need to get and use existing coins
                const client = getClient();
                const iotaAddress = $activeAddress;

                let totalTransferAmount = transfers.reduce(
                    (acc, transfer) => acc + BigInt(transfer.amount),
                    BigInt(0),
                );

                let availableCoins = await client.getCoins({ owner: iotaAddress, coinType });
                if (availableCoins.data.length === 0) {
                    throw new Error(`No ${coinSymbol} coins available for transfer`);
                }

                let selectedAmount = BigInt(0);
                let selectedCoins = [];
                for (const coin of availableCoins.data) {
                    if (selectedAmount >= totalTransferAmount) {
                        break;
                    }
                    selectedAmount += BigInt(coin.balance);
                    selectedCoins.push(coin);
                }

                if (selectedAmount < totalTransferAmount) {
                    throw new Error(
                        `Not enough ${coinSymbol} coins available for transfer. Available: ${selectedAmount}, Required: ${totalTransferAmount}`,
                    );
                }

                const coinOne = txb.object(selectedCoins.shift()?.coinObjectId!);
                // first, merge the selected coins into the first coin if needed
                if (selectedCoins.length > 0) {
                    txb.mergeCoins(
                        coinOne,
                        selectedCoins.map((coin) => txb.object(coin.coinObjectId)),
                    );
                }
                // split the first coin into multiple coins with the transfer amounts
                const coins = txb.splitCoins(
                    coinOne,
                    transfers.map((transfer) => transfer.amount),
                );
                // next, create a transfer transaction for each coin
                transfers.forEach((transfer, index) => {
                    txb.transferObjects([coins[index]], transfer.address);
                });
            }

            value = await executeTransaction(txb);
        } catch (err: any) {
            errorMsg = err.toString();
            value = err.toString();
            console.error(err);
        }
    };

    function handleJsonChange() {
        try {
            // Parse the transfers
            const transfers = parseTransfers(transfersJson);

            // Validate transfers array
            if (!Array.isArray(transfers)) {
                throw new Error('Transfers must be an array');
            }

            if (transfers.length === 0) {
                throw new Error('Transfers array cannot be empty');
            }

            // Validate each transfer object
            for (let i = 0; i < transfers.length; i++) {
                const transfer = transfers[i];
                if (!transfer.address || typeof transfer.address !== 'string') {
                    throw new Error(`Transfer ${i}: address is required and must be a string`);
                }
                if (!isValidIotaAddress(transfer.address)) {
                    throw new Error(`Transfer ${i}: invalid IOTA address "${transfer.address}"`);
                }
                if (
                    !transfer.amount ||
                    typeof transfer.amount !== 'number' ||
                    transfer.amount <= 0
                ) {
                    throw new Error(
                        `Transfer ${i}: amount is required and must be a positive number`,
                    );
                }
            }

            // Clear error if validation passes
            errorMsg = '';
        } catch (err: any) {
            errorMsg = err.toString();
        }
    }
</script>

<main>
    <div>
        <h3>Bulk Transfer</h3>
        <p>Transfer coins to multiple addresses in a single transaction.</p>

        <!-- Coin Type Selection -->
        <div style="margin-bottom: 1rem;">
            <div style="margin-bottom: 1rem;">
                <button
                    onclick={fetchAvailableCoins}
                    disabled={fetchingCoins}
                    style="padding: 0.5rem 1rem; margin-bottom: 0.5rem;"
                >
                    {fetchingCoins
                        ? 'Fetching...'
                        : 'Fetch Available Coins to send a different coin type'}
                </button>
                {#if fetchError}
                    <div style="color: red; font-size: 0.9rem; margin-top: 0.25rem;">
                        Error: {fetchError}
                    </div>
                {/if}
            </div>

            {#if availableCoins.length > 0}
                <div style="margin-bottom: 1rem;">
                    <label
                        for="coinDropdown"
                        style="display: inline-block; margin-bottom: 0.5rem; font-weight: bold;"
                    >
                        Select from Available Coins:
                    </label>
                    <br />
                    <select
                        id="coinDropdown"
                        onchange={(e) =>
                            selectCoinFromDropdown((e.target as HTMLSelectElement).value)}
                        style="padding: 0.5rem; font-family: monospace; font-size: 14px; border: 1px solid #cccccc; min-width: 300px;"
                    >
                        <option value="">-- Select a coin --</option>
                        {#each availableCoins as coin}
                            <option value={coin.coinType} selected={coin.coinType === coinType}>
                                {coin.symbol} - Balance: {parseInt(
                                    coin.totalBalance,
                                ).toLocaleString()}
                            </option>
                        {/each}
                    </select>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        Selected Token: {coinSymbol}
                    </div>
                </div>
            {/if}
        </div>

        <div>
            <details style="margin-bottom: 1rem;">
                <summary>Example formats</summary>
                <div style="display: flex; gap: 2rem; justify-content: center;">
                    <div>
                        <h4>JSON format:</h4>
                        <pre style="padding: 1rem; text-align: left;">{`[
    {"address": "0x123...", "amount": 1000000000},
    {"address": "0x456...", "amount": 2000000000}
]`}</pre>
                    </div>
                    <div>
                        <h4>CSV format:</h4>
                        <pre style="padding: 1rem; text-align: left;">{`address,amount
0x123...,1000000000
0x456...,2000000000`}</pre>
                    </div>
                    <div>
                        <h4>Space-separated:</h4>
                        <pre style="padding: 1rem;">{`0x123... 1000000000
0x456... 2000000000`}</pre>
                    </div>
                </div>
            </details>
            <div style="display: inline-block;">
                <div style="text-align: left;">
                    Transfers (amount in the smallest unit (NANO for IOTA)) - JSON, CSV, or
                    space-separated:
                </div>
                <textarea
                    bind:value={transfersJson}
                    oninput={handleJsonChange}
                    rows="15"
                    cols="120"
                    class:error={!!errorMsg}
                    placeholder="Enter transfers in JSON, CSV, or space-separated format"
                ></textarea>
            </div>
            {#if errorMsg}
                <div style="color: red; margin-top: 0.5rem; font-size: 0.9rem;">
                    {errorMsg}
                </div>
            {/if}
        </div>

        {#if totalAmountNano > 0}
            <div style="margin: 1rem 0; text-align: left; display: inline-block;">
                Transfers: {(() => {
                    try {
                        const transfers = parseTransfers(transfersJson);
                        return transfers.length;
                    } catch {
                        return 0;
                    }
                })()} <br />
                Amount: {totalAmountDisplay}
            </div>
        {/if}
        <br />

        <button onclick={executeBulkTransfer}>Execute Bulk Transfer</button>
    </div>

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }

    textarea {
        font-family: monospace;
        font-size: 14px;
        padding: 0.5rem;

        border: 1px solid #cccccc;
    }

    textarea.error {
        border-color: #ff4444;
    }

    textarea.error:focus {
        border-color: #ff4444;
        outline: none;
    }
</style>

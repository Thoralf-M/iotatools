<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { executeTransaction } from '../lib/transaction-execution';

    let transfersJson = `0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900 1000000000
0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11 2000000000`;

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

    // Compute total amount in IOTA
    $: totalAmountNano = (() => {
        try {
            const transfers = parseTransfers(transfersJson);
            return transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
        } catch {
            return 0;
        }
    })();

    $: totalAmountIota = totalAmountNano / 1_000_000_000;

    const executeBulkTransfer = async () => {
        try {
            errorMsg = '';

            // Parse the transfers
            let transfers;
            try {
                transfers = parseTransfers(transfersJson);
            } catch (parseErr) {
                throw new Error(`Parse error: ${parseErr.message}`);
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

            console.log(`Executing bulk transfer to ${transfers.length} recipients`);

            const txb = new Transaction();

            // First, split the gas coin into multiple coins
            const coins = txb.splitCoins(
                txb.gas,
                transfers.map((transfer) => transfer.amount),
            );

            // Next, create a transfer transaction for each coin
            transfers.forEach((transfer, index) => {
                txb.transferObjects([coins[index]], transfer.address);
            });

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
        <p>Transfer IOTA to multiple addresses in a single transaction.</p>

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
                    Transfers (amount in NANO) - JSON, CSV, or space-separated:
                </div>
                <textarea
                    bind:value={transfersJson}
                    oninput={handleJsonChange}
                    rows="15"
                    cols="120"
                    class:error={!!errorMsg}
                    style="background-color: #2d2d2d; color: #fff;"
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
                Amount: {totalAmountIota.toLocaleString()} IOTA ({totalAmountNano.toLocaleString()} NANO)
            </div>
        {/if}
        <br />

        <button onclick={executeBulkTransfer}>Execute Bulk Transfer</button>
    </div>

    <JsonToggleView {value} />
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

<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { executeTransaction } from '../lib/transaction-execution';

    let transfersJson = `[
    {
        "address": "0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900",
        "amount": 1000000000
    },
    {
        "address": "0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11",
        "amount": 2000000000
    }
]`;

    // Will be updated with the result
    let value = {};
    let errorMsg = '';

    const executeBulkTransfer = async () => {
        try {
            errorMsg = '';

            // Parse the transfers JSON
            let transfers;
            try {
                transfers = JSON.parse(transfersJson);
            } catch (parseErr) {
                throw new Error('Invalid JSON format for transfers');
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
            // Parse the transfers JSON
            const transfers = JSON.parse(transfersJson);

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

        <div style="margin-bottom: 1rem;">
            <label for="transfers-input">Transfers (amount in NANO):</label>
            <textarea
                id="transfers-input"
                bind:value={transfersJson}
                oninput={handleJsonChange}
                rows="15"
                cols="80"
                class:error={!!errorMsg}
                style="width: 100%; background-color: #2d2d2d; color: #fff;"
                placeholder="Enter transfers as JSON array"
            ></textarea>
            {#if errorMsg}
                <div style="color: red; margin-top: 0.5rem; font-size: 0.9rem;">
                    {errorMsg}
                </div>
            {/if}
        </div>

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
        border-radius: 4px;
        border: 1px solid #cccccc;
    }

    textarea.error {
        border-color: #ff4444;
    }

    textarea.error:focus {
        border-color: #ff4444;
        outline: none;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
</style>

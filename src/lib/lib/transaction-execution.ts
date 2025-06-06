import type {
    DevInspectResults,
    DryRunTransactionBlockResponse,
    IotaTransactionBlockResponse,
    IotaTransactionBlockResponseOptions,
} from '@iota/iota-sdk/client';
import type { Transaction } from '@iota/iota-sdk/transactions';
import { get } from 'svelte/store';

import { getClient } from './client';
import { sharedTransactionExecution, TransactionExecution } from './shared-in-memory';
import { activeAddress, iota_wallets } from './signer-data';

// Execute the transaction based on the selected execution mode and sender address
export async function executeTransaction(
    transaction: Transaction,
    options: IotaTransactionBlockResponseOptions | undefined = {
        showEffects: true,
        showObjectChanges: true,
        showBalanceChanges: true,
    },
): Promise<DevInspectResults | DryRunTransactionBlockResponse | IotaTransactionBlockResponse> {
    const client = getClient();
    const executionMode = get(sharedTransactionExecution);
    const senderAddress = get(activeAddress);
    const wallet = get(iota_wallets);

    transaction.setSenderIfNotSet(senderAddress);

    switch (executionMode) {
        case TransactionExecution.DevInspect:
            return client.devInspectTransactionBlock({
                sender: senderAddress,
                transactionBlock: transaction,
            });
        case TransactionExecution.DryRun:
            let transactionBlock = await transaction.build({ client });
            return client.dryRunTransactionBlock({ transactionBlock });
        case TransactionExecution.Send:
            return wallet[0].signAndExecuteTransaction({
                transaction,
                options,
                account: { address: senderAddress },
            });
        default:
            throw new Error(`Unknown transaction execution mode: ${executionMode}`);
    }
}

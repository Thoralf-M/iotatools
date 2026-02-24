import { toBase64 } from '@iota/bcs';
import type {
    DevInspectResults,
    DryRunTransactionBlockResponse,
    GasCostSummary,
    IotaGasData,
    IotaTransactionBlockResponse,
    IotaTransactionBlockResponseOptions,
    TransactionEffects,
} from '@iota/iota-sdk/client';
import type { Transaction } from '@iota/iota-sdk/transactions';
import { get } from 'svelte/store';

import { getClient, getSelectedChain } from './client';
import { requireMainnetTransactionConfirmation } from './mainnet-transaction-confirmation';
import { sharedTransactionExecution, TransactionExecution } from './shared-in-memory';
import { activeAddress } from './signer-data';
import { getActiveWallet } from './web-wallet';

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

    transaction.setSenderIfNotSet(senderAddress);
    const txSenderAddress = transaction.getData().sender ?? senderAddress;

    switch (executionMode) {
        case TransactionExecution.DevInspect:
            return client.devInspectTransactionBlock({
                sender: txSenderAddress,
                transactionBlock: transaction,
            });
        case TransactionExecution.DryRun:
            let transactionBlock = await transaction.build({ client });
            return client.dryRunTransactionBlock({ transactionBlock });
        case TransactionExecution.Send:
            const wallet = getActiveWallet();
            if (!wallet) {
                throw new Error('No active wallet available');
            }
            await requireMainnetTransactionConfirmation(transaction);
            return wallet.signAndExecuteTransaction({
                transaction,
                options,
                // @ts-ignore
                chain: getSelectedChain(),
                account: { address: txSenderAddress },
            });
        case TransactionExecution.Prepare:
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
            return { json, transactionBytes };
        default:
            throw new Error(`Unknown transaction execution mode: ${executionMode}`);
    }
}

export const calculateGasFee = async (transaction: Transaction) => {
    const client = getClient();
    const txBytes = await transaction.build({ client });
    const txDryRun = await client.dryRunTransactionBlock({
        transactionBlock: txBytes,
    });
    const gasSummary = getGasSummary(txDryRun);
    return gasSummary?.totalGas ?? transaction.getData().gasData.budget;
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};

export type GasSummaryType =
    | (GasCostSummary &
          Optional<IotaGasData> & {
              isSponsored: boolean;
              gasUsed: GasCostSummary;
              totalGas?: string;
              owner?: string;
          })
    | null;

export function getGasSummary(
    transaction: IotaTransactionBlockResponse | DryRunTransactionBlockResponse,
): GasSummaryType {
    const { effects } = transaction;
    if (!effects) return null;
    const totalGas = getTotalGasUsed(effects);
    let sender = undefined;
    let owner = '';
    let gasData = {} as IotaGasData;
    if ('transaction' in transaction && transaction.transaction?.data) {
        sender = transaction.transaction?.data.sender;
        gasData = transaction.transaction.data.gasData;
    } else if ('input' in transaction) {
        sender = transaction.input.sender;
        gasData = transaction.input.gasData;
    }
    owner = gasData?.owner ?? '';

    return {
        ...effects.gasUsed,
        ...gasData,
        owner,
        totalGas: totalGas?.toString(),
        isSponsored: !!owner && !!sender && owner !== sender,
        gasUsed: transaction?.effects!.gasUsed,
    };
}

export function getTotalGasUsed(effects: TransactionEffects): bigint | undefined {
    const gasSummary = effects?.gasUsed;
    return gasSummary
        ? BigInt(gasSummary.computationCost) +
              BigInt(gasSummary.storageCost) -
              BigInt(gasSummary.storageRebate)
        : undefined;
}

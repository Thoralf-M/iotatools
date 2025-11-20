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

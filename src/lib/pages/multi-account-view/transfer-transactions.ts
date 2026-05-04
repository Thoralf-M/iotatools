import { toBase64 } from '@iota/bcs';
import { Transaction } from '@iota/iota-sdk/transactions';
import { get } from 'svelte/store';

import { getClient, getSelectedChain } from '../../utils/client';
import { requireMainnetTransactionConfirmation } from '../../utils/mainnet-transaction-confirmation';
import { sharedTransactionExecution, TransactionExecution } from '../../utils/shared-in-memory';
import { calculateGasFee } from '../../utils/transaction-execution';
import { getActiveWallet } from '../../utils/web-wallet';
import type { ExtendedAccount, ExtendedObject } from './multi-account-service';

const IOTA_COIN_TYPE = '0x2::coin::Coin<0x2::iota::IOTA>';

/** For each sender (current owner), the map of recipient -> objects to send. */
export type Movements = Map<string, Map<string, ExtendedObject[]>>;

/** A single transfer transaction prepared for one sender. */
export interface PreparedTransaction {
    sender: string;
    recipients: string[];
    transaction: Transaction;
}

/** Walk all accounts and collect every object whose `currentOwner` no longer
 *  matches its current account — each such object represents a planned move. */
export function getMovements(extendedAccounts: ExtendedAccount[]): Movements {
    const movements: Movements = new Map();
    for (const account of extendedAccounts) {
        for (const object of account.objects) {
            if (object.currentOwner === account.address) continue;
            if (!movements.has(object.currentOwner)) movements.set(object.currentOwner, new Map());
            const senderMap = movements.get(object.currentOwner)!;
            if (!senderMap.has(account.address)) senderMap.set(account.address, []);
            senderMap.get(account.address)!.push(object);
        }
    }
    return movements;
}

/** Build one transfer transaction per sender. When the sender has no remaining
 *  IOTA coin to pay gas with, the largest IOTA coin among the moving objects
 *  is used as gas (and substituted with `tx.gas` in the transferObjects call). */
export function prepareTransferTransactions(
    extendedAccounts: ExtendedAccount[],
): PreparedTransaction[] {
    const movements = getMovements(extendedAccounts);
    const prepared: PreparedTransaction[] = [];

    for (const [senderAddress, perRecipient] of movements) {
        const tx = new Transaction();
        const senderAccount = extendedAccounts.find((a) => a.address === senderAddress);

        for (const [to, objects] of perRecipient) {
            const senderHasGasCoinLeft =
                senderAccount?.objects.some((obj) => obj.data?.content?.type === IOTA_COIN_TYPE) ??
                false;

            if (!senderHasGasCoinLeft) {
                const gasCoin = objects
                    .filter((obj) => obj.data?.content?.type === IOTA_COIN_TYPE)
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
                    objects.map((obj) => (obj.id === gasCoin.id ? tx.gas : obj.id)),
                    to,
                );
            } else {
                tx.transferObjects(
                    objects.map((obj) => obj.id),
                    to,
                );
            }
        }

        tx.setSender(senderAddress);
        prepared.push({
            sender: senderAddress,
            recipients: Array.from(perRecipient.keys()),
            transaction: tx,
        });
    }
    return prepared;
}

/** Execute (or simulate / dry-run / prepare) a list of prepared transactions
 *  sequentially using the currently-selected execution mode. Each result has
 *  `sender` and `recipients` attached for downstream display. */
export async function executeTransferTransactions(prepared: PreparedTransaction[]): Promise<any[]> {
    const client = getClient();
    const executionMode = get(sharedTransactionExecution);
    const results: any[] = [];

    for (const { sender, recipients, transaction } of prepared) {
        console.log(`Executing transfer from ${sender} to:`, recipients.join(', '));
        let result: any;

        switch (executionMode) {
            case TransactionExecution.DevInspect:
                result = await client.devInspectTransactionBlock({
                    sender,
                    transactionBlock: transaction,
                });
                break;
            case TransactionExecution.DryRun:
                result = await client.dryRunTransactionBlock({
                    transactionBlock: await transaction.build({ client }),
                });
                break;
            case TransactionExecution.Send: {
                const wallet = getActiveWallet();
                if (!wallet) throw new Error('No active wallet available');
                await requireMainnetTransactionConfirmation(transaction);
                result = await wallet.signAndExecuteTransaction({
                    transaction,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                        showBalanceChanges: true,
                    },
                    account: { address: sender },
                    // @ts-ignore
                    chain: getSelectedChain(),
                });
                break;
            }
            case TransactionExecution.Prepare: {
                const json = JSON.parse(await transaction.toJSON());
                if (transaction.getData().gasData.price == 0) {
                    const referenceGasPrice = await client.getReferenceGasPrice();
                    transaction.setGasPrice(referenceGasPrice);
                }
                if (transaction.getData().gasData.budget == 0) {
                    const gas = await calculateGasFee(transaction);
                    transaction.setGasBudget(BigInt(gas!));
                }
                const transactionBytes = toBase64(await transaction.build({ client }));
                result = { json, transactionBytes };
                break;
            }
            default:
                throw new Error(`Unknown transaction execution mode: ${executionMode}`);
        }

        result.sender = sender;
        result.recipients = recipients;
        results.push(result);
    }
    return results;
}

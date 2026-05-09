import { Transaction } from '@iota/iota-sdk/transactions';

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
            // Only count coins whose on-chain owner is still the sender — coins
            // dropped into the sender's card from another account live in
            // `objects` but aren't ours to spend for gas. Without this filter
            // bidirectional transfers (A→B and B→A) misjudge gas availability.
            const senderHasGasCoinLeft =
                senderAccount?.objects.some(
                    (obj) =>
                        obj.currentOwner === senderAddress &&
                        obj.data?.content?.type === IOTA_COIN_TYPE,
                ) ?? false;

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

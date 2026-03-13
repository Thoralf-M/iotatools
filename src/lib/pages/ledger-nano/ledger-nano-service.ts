// Ledger Nano service functions and types
import { Address, toHex } from '../../utils/wasm-sdk';
// [MIGRATION] IotaClient → GraphQlClient from wasm-sdk
import type { GraphQlClient } from '../../utils/wasm-sdk';
// These crypto functions are not yet in the WASM SDK, using old SDK
import { messageWithIntent, toSerializedSignature } from '@iota/iota-sdk/cryptography';
import { Ed25519PublicKey } from '@iota/iota-sdk/keypairs/ed25519';
import { Transaction } from '@iota/iota-sdk/transactions';
import { isValidIotaAddress } from '../../utils/wasm-sdk';
import IotaLedgerClient from '@iota/ledgerjs-hw-app-iota';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

import { getClient, getLegacyClient } from '../../utils/client';

// Constants
export const IOTA_BIP44_COIN_TYPE = 4218;
export const TESTNET_BIP44_COIN_TYPE = 1;

// Types
export type AccountEntry = {
    address: string;
    publicKey: string;
    bip44Path: string;
    totalBalance?: string;
    objectCount?: number;
};

export type AddressWithIndex = {
    address: string;
    publicKey: string;
    internal: boolean;
    index: number;
    totalBalance?: string;
    objectCount?: number;
};

export type GroupedAccountEntry = [number, AddressWithIndex[]];

// Global ledger transport
let ledgerTransport: any;

/**
 * Connect to Ledger device
 */
export async function connectToLedger(): Promise<string> {
    try {
        ledgerTransport = await TransportWebHID.create();
        console.log(ledgerTransport);
        return 'connected!';
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Generate a single address from BIP44 path
 */
export async function generateAddress(
    coinType: number,
    accountIndex: number,
    change: number,
    addressIndex: number,
    accountEntries: AccountEntry[],
): Promise<AccountEntry[]> {
    try {
        // @ts-ignore
        const ledgerClient = new IotaLedgerClient(ledgerTransport);
        let bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
        console.log(bip44Path);

        const exists = accountEntries.some((entry) => entry.bip44Path === bip44Path);
        if (exists) {
            return accountEntries;
        }

        let result = await ledgerClient.getPublicKey(bip44Path);
        console.log(result);
        let publicKey = '0x' + toHex(result.publicKey);
        let address = '0x' + toHex(result.address);
        accountEntries.push({
            address: address,
            publicKey: publicKey,
            bip44Path,
        });
        return accountEntries;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Generate multiple addresses by incrementing account or address index
 */
export async function generateMultipleAddresses(
    coinType: number,
    accountIndex: number,
    change: number,
    addressIndex: number,
    numberToIncrease: number,
    accountOrAddress: string,
    accountEntries: AccountEntry[],
): Promise<AccountEntry[]> {
    try {
        if (accountOrAddress == 'account') {
            let finalIndex = accountIndex + numberToIncrease;
            for (let i = accountIndex; i < finalIndex; i++) {
                accountEntries = await generateAddress(
                    coinType,
                    i,
                    change,
                    addressIndex,
                    accountEntries,
                );
            }
        } else {
            let finalIndex = addressIndex + numberToIncrease;
            for (let i = addressIndex; i < finalIndex; i++) {
                accountEntries = await generateAddress(
                    coinType,
                    accountIndex,
                    change,
                    i,
                    accountEntries,
                );
            }
        }
        return accountEntries;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Format account entries as grouped table data
 */
export function formatAsTable(accountEntries: AccountEntry[]): GroupedAccountEntry[] {
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
            publicKey: address.publicKey,
            internal: change == 1,
            index: addressIndex,
            totalBalance: address.totalBalance,
            objectCount: address.objectCount,
        });
        grouped[accountIndex].sort((a, b) => a.index - b.index);
    }

    return Object.entries(grouped).map(([key, value]) => [parseInt(key), value]);
}

/**
 * Get balances for all account entries
 */
export async function getAllBalances(
    accountEntries: AccountEntry[],
    skipKnown: boolean = false,
): Promise<AccountEntry[]> {
    try {
        const client = getClient();
        for (const entry of accountEntries) {
            // skip if the balance is already known
            if (entry.totalBalance && skipKnown) {
                continue;
            }
            const bal = await client.balance(Address.fromHex(entry.address), undefined);
            entry.totalBalance = (bal ?? 0n).toString();
        }
        return accountEntries;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Get object counts for all account entries
 */
export async function getAllObjects(
    accountEntries: AccountEntry[],
    skipKnown: boolean = false,
): Promise<AccountEntry[]> {
    try {
        const gqlClient = getClient(true);
        for (const entry of accountEntries) {
            // skip if the count is already known
            if (entry.objectCount && skipKnown) {
                continue;
            }
            const resultStr = await gqlClient.runQuery({
                query: `query getOwnedObjectCount($owner: IotaAddress!) {
                    address(address: $owner) {
                        objects {
                            pageInfo { hasNextPage }
                            nodes { address }
                        }
                    }
                }`,
                variables: JSON.stringify({ owner: entry.address }),
            });
            const result = JSON.parse(resultStr);
            entry.objectCount = result?.address?.objects?.nodes?.length ?? 0;
        }
        return accountEntries;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Send all objects from sender to recipient
 */
export async function sendAllObjects(
    senderAddress: string,
    recipientAddress: string,
    coinType: number,
    accountIndex: number,
    change: number,
    addressIndex: number,
    accountEntries: AccountEntry[],
    dryRun: boolean = true,
): Promise<any> {
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

        const gqlClient = getClient(true);

        const tx = new Transaction();
        const resultStr = await gqlClient.runQuery({
            query: `query getOwnedObjects($owner: IotaAddress!) {
                address(address: $owner) {
                    objects {
                        nodes {
                            address
                            contents {
                                type { repr }
                            }
                        }
                    }
                }
            }`,
            variables: JSON.stringify({ owner: senderAddress }),
        });
        const result = JSON.parse(resultStr);
        const objects = result?.address?.objects?.nodes ?? [];
        if (objects.length == 0) {
            throw new Error('No objects found');
        }

        const gasCoinIndex = objects.findIndex((o: any) => {
            return o.contents?.type?.repr?.includes('::coin::Coin<') && o.contents?.type?.repr?.includes('::iota::IOTA>');
        });
        let gasCoin = null;
        if (gasCoinIndex !== -1) {
            gasCoin = objects.splice(gasCoinIndex, 1)[0];
        }
        if (!gasCoin) {
            throw new Error('No gas coin found');
        }

        let objectsToTransfer = objects.map((o: any) => o.address ?? '');
        // @ts-ignore
        objectsToTransfer.push(tx.gas);
        tx.transferObjects(objectsToTransfer, tx.pure.address(recipientAddress));
        return await finishTransaction(tx, bip44Path, senderAddress, gqlClient, dryRun);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Send IOTA amount from sender to recipient
 */
export async function sendIotaAmount(
    senderAddress: string,
    recipientAddress: string,
    iotaAmountToSend: string,
    coinType: number,
    accountIndex: number,
    change: number,
    addressIndex: number,
    accountEntries: AccountEntry[],
    dryRun: boolean = true,
): Promise<any> {
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
        const bal = await client.balance(Address.fromHex(senderAddress), undefined);
        const totalBalance = (bal ?? 0n).toString();

        if (BigInt(totalBalance) < BigInt(iotaAmountToSend)) {
            throw new Error(`Not enough balance ${totalBalance}/${iotaAmountToSend}`);
        }

        const coins = tx.splitCoins(tx.gas, [BigInt(iotaAmountToSend)]);
        tx.transferObjects([coins[0]], tx.pure.address(recipientAddress));
        return await finishTransaction(tx, bip44Path, senderAddress, client, dryRun);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Finish and execute/sign a transaction
 */
export async function finishTransaction(
    tx: Transaction,
    bip44Path: string,
    senderAddress: string,
    client: GraphQlClient,
    dryRun: boolean = true,
): Promise<any> {
    try {
        tx.setSender(senderAddress);
        const legacyClient = getLegacyClient();
        const txBytes = await tx.build({ client: legacyClient });
        if (dryRun) {
            const dryRunResult = await legacyClient.dryRunTransactionBlock({
                transactionBlock: txBytes,
            });
            console.log(dryRunResult);
            return dryRunResult;
        } else {
            const ledgerClient = new IotaLedgerClient(ledgerTransport);
            let txMessageIntent = messageWithIntent('TransactionData', txBytes);
            const { signature } = await ledgerClient.signTransaction(bip44Path, txMessageIntent);
            const { publicKey } = await ledgerClient.getPublicKey(bip44Path);
            const serializedSignature = toSerializedSignature({
                signature,
                signatureScheme: 'ED25519',
                publicKey: new Ed25519PublicKey(publicKey),
            });
            const result = await legacyClient.executeTransactionBlock({
                transactionBlock: txBytes,
                signature: serializedSignature,
                options: {
                    showBalanceChanges: true,
                    showEffects: true,
                },
            });
            console.log(result);
            return result;
        }
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

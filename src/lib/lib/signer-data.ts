import type { IotaTransactionBlockResponseOptions } from '@iota/iota-sdk/client';
import type { Transaction } from '@iota/iota-sdk/transactions';
import type { WalletAccount } from '@iota/wallet-standard';
import { writable, type Writable } from 'svelte/store';

interface TransactionOptions {
    transaction: Uint8Array<ArrayBufferLike> | Transaction;
    options?: IotaTransactionBlockResponseOptions;
    account?: { address: string };
}

export abstract class WalletSigner {
    abstract signAndExecuteTransaction(params: TransactionOptions): Promise<any>;
}

export let iota_wallets: Writable<WalletSigner[]> = writable([]);
// not needed? Just create WalletAccount for signAndExecuteTransaction
export let iota_accounts: Writable<WalletAccount[]> = writable([]);
export let activeAddress: Writable<string> = writable('0x');

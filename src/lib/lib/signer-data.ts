import type { IotaTransactionBlockResponseOptions } from '@iota/iota-sdk/client';
import type { Transaction } from '@iota/iota-sdk/transactions';
import type { IotaSignAndExecuteTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { get, writable, type Writable } from 'svelte/store';

import { PrivateKeyWallet, toWalletAccounts } from './default-private-keys';
import { sharedPrivateKeyAccounts, sharedSignerType, SignerType } from './local-storage-store';
import { connectWallet } from './web-wallet';

interface TransactionOptions {
    transaction: Transaction;
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

function setSigningWithPrivateKeyAccounts() {
    // @ts-ignore
    iota_wallets.set([new PrivateKeyWallet()]);
    iota_accounts.set(toWalletAccounts(get(sharedPrivateKeyAccounts)));
    activeAddress.set(Object.keys(get(sharedPrivateKeyAccounts).accounts)[0]);
}

export function updateSelectedSignerAccounts() {
    if (get(sharedSignerType) == SignerType.Localstorage) {
        setSigningWithPrivateKeyAccounts();
    }
    if (get(sharedSignerType) == SignerType.WebWallet) {
        connectWallet();
    }
}

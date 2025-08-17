import type {
    IotaTransactionBlockResponse,
    IotaTransactionBlockResponseOptions,
} from '@iota/iota-sdk/client';
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
export let iota_accounts: Writable<WalletAccount[]> = writable([]);
export let activeAddress: Writable<string> = writable('0x');

function setSigningWithPrivateKeyAccounts() {
    // @ts-ignore
    iota_wallets.set([new PrivateKeyWallet()]);
    iota_accounts.set(toWalletAccounts(get(sharedPrivateKeyAccounts)));
    activeAddress.set(Object.keys(get(sharedPrivateKeyAccounts).accounts)[0]);
}

export class ForeignAddressWallet {
    async signAndExecuteTransaction(
        params: IotaSignAndExecuteTransactionInput,
    ): Promise<IotaTransactionBlockResponse> {
        // @ts-ignore
        return {
            errors: ['Foreign address wallet cannot sign and execute transactions.'],
        };
    }
}

function setSigningWithForeignAddress(foreignAddress: string) {
    if (!foreignAddress) {
        foreignAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    // @ts-ignore
    iota_wallets.set([new ForeignAddressWallet()]);
    activeAddress.set(foreignAddress);
    iota_accounts.set([
        {
            address: foreignAddress,
            label: 'Foreign Address',
            publicKey: new Uint8Array([]),
            chains: ['iota:mainnet'],
            features: ['iota:signAndExecuteTransaction'],
        },
    ]);
}

export function updateSelectedSignerAccounts(foreignAddress?: string) {
    if (get(sharedSignerType) == SignerType.Localstorage) {
        setSigningWithPrivateKeyAccounts();
    }
    if (get(sharedSignerType) == SignerType.WebWallet) {
        iota_wallets.set([]);
        activeAddress.set('');
        iota_accounts.set([]);
        connectWallet(true);
    }
    if (get(sharedSignerType) == SignerType.ForeignAddress) {
        setSigningWithForeignAddress(foreignAddress!);
    }
}

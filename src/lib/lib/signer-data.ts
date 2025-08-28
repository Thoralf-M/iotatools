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
    abstract signTransaction?(params: {
        transaction: Transaction;
        account: { address: string };
    }): Promise<{ signature: string }>;
    abstract signPersonalMessage?(params: {
        message: Uint8Array;
        account: { address: string };
    }): Promise<{ signature: string }>;
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

export class ExternalAddressWallet {
    async signAndExecuteTransaction(
        params: IotaSignAndExecuteTransactionInput,
    ): Promise<IotaTransactionBlockResponse> {
        // @ts-ignore
        return {
            errors: ['External address wallet cannot sign and execute transactions.'],
        };
    }

    async signTransaction(params: {
        transactionBytes: Uint8Array;
        account: { address: string };
    }): Promise<{ signature: string }> {
        throw new Error('External address wallet cannot sign transactions.');
    }

    async signPersonalMessage(params: {
        message: Uint8Array;
        account: { address: string };
    }): Promise<{ signature: string }> {
        throw new Error('External address wallet cannot sign messages.');
    }
}

function setSigningWithExternalAddress(externalAddress: string) {
    if (!externalAddress) {
        externalAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    // @ts-ignore
    iota_wallets.set([new ExternalAddressWallet()]);
    activeAddress.set(externalAddress);
    iota_accounts.set([
        {
            address: externalAddress,
            label: 'External Address',
            publicKey: new Uint8Array([]),
            chains: ['iota:mainnet'],
            features: ['iota:signAndExecuteTransaction'],
        },
    ]);
}

export function updateSelectedSignerAccounts(externalAddress?: string) {
    if (get(sharedSignerType) == SignerType.Localstorage) {
        setSigningWithPrivateKeyAccounts();
    }
    if (get(sharedSignerType) == SignerType.WebWallet) {
        iota_wallets.set([]);
        activeAddress.set('');
        iota_accounts.set([]);
        connectWallet(true);
    }
    if (get(sharedSignerType) == SignerType.ExternalAddress) {
        setSigningWithExternalAddress(externalAddress!);
    }
}

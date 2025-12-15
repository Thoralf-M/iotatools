import type {
    IotaTransactionBlockResponse,
    IotaTransactionBlockResponseOptions,
} from '@iota/iota-sdk/client';
import type { Transaction } from '@iota/iota-sdk/transactions';
import type { IotaSignAndExecuteTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { get, writable, type Writable } from 'svelte/store';

import { PrivateKeyWallet, toWalletAccounts } from './default-private-keys';
import {
    sharedExternalAddresses,
    sharedPrivateKeyAccounts,
    sharedSelectedAddress,
    sharedSignerType,
    SignerType,
    type ExternalAddress,
    type ExternalAddresses,
} from './local-storage-store';
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

export let iota_wallets: Writable<any[]> = writable([]);
export let iota_accounts: Writable<WalletAccount[]> = writable([]);
export let activeAddress: Writable<string> = writable('0x');

// Persist activeAddress changes
activeAddress.subscribe((address) => {
    const type = get(sharedSignerType);
    if (type && address !== '0x') {
        // avoid persisting initial
        sharedSelectedAddress.update((obj) => ({ ...obj, [type]: address }));
    }
});

// External address management functions
export function addOrUpdateExternalAddress(address: string, alias?: string): void {
    const currentAddresses = get(sharedExternalAddresses);
    const existingIndex = currentAddresses.addresses.findIndex((addr) => addr.address === address);

    if (existingIndex >= 0) {
        // Update existing address
        currentAddresses.addresses[existingIndex] = { address, alias };
    } else {
        // Add new address
        currentAddresses.addresses.push({ address, alias });
    }

    // Set as selected address
    currentAddresses.selectedAddress = address;
    sharedExternalAddresses.set(currentAddresses);

    // Refresh the accounts list if we're in ExternalAddress mode
    if (get(sharedSignerType) === SignerType.ExternalAddress) {
        setSigningWithExternalAddress(address);
    }
}

export function removeExternalAddress(address: string): void {
    const currentAddresses = get(sharedExternalAddresses);
    const filteredAddresses = currentAddresses.addresses.filter((addr) => addr.address !== address);

    let newSelectedAddress = currentAddresses.selectedAddress;
    if (currentAddresses.selectedAddress === address) {
        newSelectedAddress =
            filteredAddresses.length > 0 ? filteredAddresses[0].address : undefined;
    }

    sharedExternalAddresses.set({
        addresses: filteredAddresses,
        selectedAddress: newSelectedAddress,
    });

    // Refresh the accounts list if we're in ExternalAddress mode
    if (get(sharedSignerType) === SignerType.ExternalAddress) {
        setSigningWithExternalAddress(newSelectedAddress);
    }
}

export function selectExternalAddress(address: string): void {
    const currentAddresses = get(sharedExternalAddresses);
    const addressExists = currentAddresses.addresses.some((addr) => addr.address === address);

    if (addressExists) {
        sharedExternalAddresses.set({
            ...currentAddresses,
            selectedAddress: address,
        });

        // Refresh the accounts list if we're in ExternalAddress mode
        if (get(sharedSignerType) === SignerType.ExternalAddress) {
            setSigningWithExternalAddress(address);
        }
    }
}

export function getExternalAddresses(): ExternalAddress[] {
    return get(sharedExternalAddresses).addresses;
}

export function getSelectedExternalAddress(): string | undefined {
    return get(sharedExternalAddresses).selectedAddress;
}

function setSigningWithPrivateKeyAccounts() {
    // @ts-ignore
    iota_wallets.set([new PrivateKeyWallet()]);
    iota_accounts.set(toWalletAccounts(get(sharedPrivateKeyAccounts)));
    const accounts = get(sharedPrivateKeyAccounts).accounts;
    const accountAddresses = Object.keys(accounts);
    const persisted = get(sharedSelectedAddress)[SignerType.Localstorage];
    let addressToUse =
        persisted && accountAddresses.includes(persisted) ? persisted : accountAddresses[0];
    activeAddress.set(addressToUse);
    sharedSelectedAddress.update((obj) => ({ ...obj, [SignerType.Localstorage]: addressToUse }));
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

function getExternalAddressLabel(address: string): string {
    if (address.length < 8) return 'External ' + address;
    return 'External 0x' + address.slice(2, 5) + '...' + address.slice(-3);
}

function setSigningWithExternalAddress(externalAddress?: string) {
    const storedAddresses = get(sharedExternalAddresses);
    let addressToUse = externalAddress || storedAddresses.selectedAddress;

    if (!addressToUse) {
        // Check persisted
        const persisted = get(sharedSelectedAddress)[SignerType.ExternalAddress];
        if (persisted && storedAddresses.addresses.some((a) => a.address === persisted)) {
            addressToUse = persisted;
        }
    }

    if (!addressToUse && storedAddresses.addresses.length > 0) {
        addressToUse = storedAddresses.addresses[0].address;
    }

    if (!addressToUse) {
        // No address to use, set accounts but not activeAddress
        // @ts-ignore
        iota_wallets.set([new ExternalAddressWallet()]);
        // Create accounts from all stored external addresses
        const accounts: WalletAccount[] = storedAddresses.addresses.map((addr) => ({
            address: addr.address,
            label: addr.alias || getExternalAddressLabel(addr.address),
            publicKey: new Uint8Array([]),
            chains: ['iota:mainnet'],
            features: ['iota:signAndExecuteTransaction'],
        }));
        iota_accounts.set(accounts);
        return;
    }

    // @ts-ignore
    iota_wallets.set([new ExternalAddressWallet()]);
    activeAddress.set(addressToUse);

    sharedSelectedAddress.update((obj) => ({ ...obj, [SignerType.ExternalAddress]: addressToUse }));

    // Create accounts from all stored external addresses
    const accounts: WalletAccount[] = storedAddresses.addresses.map((addr) => ({
        address: addr.address,
        label: addr.alias || getExternalAddressLabel(addr.address),
        publicKey: new Uint8Array([]),
        chains: ['iota:mainnet'],
        features: ['iota:signAndExecuteTransaction'],
    }));

    // If there's a current external address that's not in the stored addresses, add it temporarily
    if (
        externalAddress &&
        !storedAddresses.addresses.some((addr) => addr.address === externalAddress)
    ) {
        accounts.push({
            address: externalAddress,
            label: '(not saved)',
            publicKey: new Uint8Array([]),
            chains: ['iota:mainnet'],
            features: ['iota:signAndExecuteTransaction'],
        });
    }

    // If no accounts exist, create a default one
    if (accounts.length === 0) {
        accounts.push({
            address: addressToUse,
            label: getExternalAddressLabel(addressToUse),
            publicKey: new Uint8Array([]),
            chains: ['iota:mainnet'],
            features: ['iota:signAndExecuteTransaction'],
        });
    }

    iota_accounts.set(accounts);
}

export function updateSelectedSignerAccounts(externalAddress?: string) {
    if (get(sharedSignerType) == SignerType.Localstorage) {
        setSigningWithPrivateKeyAccounts();
    }
    if (get(sharedSignerType) == SignerType.WebWallet) {
        iota_wallets.set([]);
        const persisted = get(sharedSelectedAddress)[SignerType.WebWallet];
        activeAddress.set(persisted || '');
        iota_accounts.set([]);
        connectWallet(true);
    }
    if (get(sharedSignerType) == SignerType.ExternalAddress) {
        setSigningWithExternalAddress(externalAddress);
    }
}

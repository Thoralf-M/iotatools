import type { IotaTransactionBlockResponse } from '@iota/iota-sdk/client';
import { decodeIotaPrivateKey, Keypair } from '@iota/iota-sdk/cryptography';
import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';
import { Secp256k1Keypair } from '@iota/iota-sdk/keypairs/secp256k1';
import { Secp256r1Keypair } from '@iota/iota-sdk/keypairs/secp256r1';
import type { IotaSignAndExecuteTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { get } from 'svelte/store';

import { getClient } from './client';
import { sharedPrivateKeyAccounts } from './local-storage-store';

export interface PrivateKeyAccounts {
    accounts: Record<string, PrivateKeyAccount>; // key is the address
}
export interface PrivateKeyAccount {
    bech32PrivateKey: string;
    address: string;
    label?: string;
}

export const defaultPrivateKeyAccounts: PrivateKeyAccounts = {
    accounts: {
        '0x689dae2f77b048dcc08e14d73104ea14222b5be14cc31f34a16a1221f944c1e3': {
            bech32PrivateKey:
                'iotaprivkey1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgfjx8t',
            address: '0x689dae2f77b048dcc08e14d73104ea14222b5be14cc31f34a16a1221f944c1e3',
            label: 'Default Account',
        },
    },
};

export function verifyPrivateKeyAccounts(value: any) {
    if (typeof value !== 'object' || value === null) throw new Error('Config is not an object');
    if (typeof value.accounts !== 'object' || value.accounts === null)
        throw new Error('Config.accounts is not an object');
    for (const [address, account] of Object.entries(value.accounts)) {
        if (typeof account !== 'object' || account === null)
            throw new Error(`Account for ${address} is not an object`);
        const acc = account as PrivateKeyAccount;
        if (typeof acc.bech32PrivateKey !== 'string')
            throw new Error(`Account for ${address} is missing a valid bech32PrivateKey`);
        try {
            acc.address = keypairFromBech32PrivateKey(acc.bech32PrivateKey).toIotaAddress();
            if (address !== acc.address) {
                throw new Error(
                    `Address key ${address} doesn't match derived address from the private key`,
                );
            }
        } catch (error) {
            throw new Error(`Account for ${address} has an invalid IOTA private key: ${error}`);
        }
    }
    return true;
}

export function keypairFromBech32PrivateKey(bech32privateKey: string): Keypair {
    const decoded = decodeIotaPrivateKey(bech32privateKey);
    const schema = decoded.schema;
    const secretKey = decoded.secretKey;
    switch (schema) {
        case 'ED25519':
            return Ed25519Keypair.fromSecretKey(secretKey);
        case 'Secp256k1':
            return Secp256k1Keypair.fromSecretKey(secretKey);
        case 'Secp256r1':
            return Secp256r1Keypair.fromSecretKey(secretKey);
        default:
            throw new Error(`Invalid keypair schema ${schema}`);
    }
}

export function toWalletAccounts(sharedPrivateKeyAccounts: PrivateKeyAccounts): WalletAccount[] {
    return Object.values(sharedPrivateKeyAccounts.accounts).map(
        (account) =>
            ({
                address: account.address,
                label: account.label,
                privKey: account.bech32PrivateKey,
                publicKey: keypairFromBech32PrivateKey(account.bech32PrivateKey)
                    .getPublicKey()
                    .toRawBytes(),
                chains: ['iota:mainnet'],
                features: ['iota:signAndExecuteTransaction'],
            }) as WalletAccount,
    );
}

// Wrapper around the shared private key accounts, so the wallet standard interface can be used
export class PrivateKeyWallet {
    async signAndExecuteTransaction(
        params: IotaSignAndExecuteTransactionInput,
    ): Promise<IotaTransactionBlockResponse> {
        let senderAddress = params.account.address;
        let senderAccount = get(sharedPrivateKeyAccounts).accounts[senderAddress];
        if (!senderAccount) {
            throw new Error(`No account found for address: ${senderAddress}`);
        }
        const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
        let client = getClient();
        return client.signAndExecuteTransaction({
            // @ts-ignore
            transaction: params.transaction,
            signer: keypair,
            options: params.options,
        });
    }
}

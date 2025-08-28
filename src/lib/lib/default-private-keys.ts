import type { IotaTransactionBlockResponse } from '@iota/iota-sdk/client';
import { decodeIotaPrivateKey, Keypair } from '@iota/iota-sdk/cryptography';
import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';
import { Secp256k1Keypair } from '@iota/iota-sdk/keypairs/secp256k1';
import { Secp256r1Keypair } from '@iota/iota-sdk/keypairs/secp256r1';
import type { Transaction } from '@iota/iota-sdk/transactions';
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
    mnemonic?: string;
}

export const defaultPrivateKeyAccounts: PrivateKeyAccounts = {
    accounts: {
        '0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900': {
            bech32PrivateKey:
                'iotaprivkey1qq5eupu4xulxuuf904vjdcwcet0842m9vcjmdng5lt0k25uac6l2x0zczeh',
            address: '0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900',
            label: 'Default Account 0',
            mnemonic:
                'cook robust sound vote gap elite confirm party music mobile fossil history during gesture gauge flat salt female flag dash industry caution stool bulb',
        },
        '0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11': {
            bech32PrivateKey:
                'iotaprivkey1qr9jaf9lywvg8uxwxcec4vqcfqlv3k4z497lqnjntwewprv573lw26wska5',
            address: '0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11',
            label: 'Default Account 1',
            mnemonic:
                'glance old lottery ask thank resemble viable celery ankle measure stairs radar radio february maple safe umbrella doctor stuff outside nominee law edit place',
        },
        '0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522': {
            bech32PrivateKey:
                'iotaprivkey1qrl3rcyrgzur5830wzeklgpsam7qqk4gph8jcqx9ug6ghek7k8zkzpmy5m8',
            address: '0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522',
            label: 'Default Account 2',
            mnemonic:
                'airport easily dignity glove guide because baby shop average camera pledge bonus plug illness junior sell volume nose power derive slight provide cradle hat',
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

    async signTransaction(params: {
        transaction: Transaction;
        account: { address: string };
    }): Promise<{ signature: string }> {
        let senderAddress = params.account.address;
        let senderAccount = get(sharedPrivateKeyAccounts).accounts[senderAddress];
        if (!senderAccount) {
            throw new Error(`No account found for address: ${senderAddress}`);
        }
        const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
        const signature = await keypair.signTransaction(await params.transaction.build());
        return { signature: signature.signature };
    }

    async signPersonalMessage(params: {
        message: Uint8Array;
        account: { address: string };
    }): Promise<{ signature: string }> {
        let senderAddress = params.account.address;
        let senderAccount = get(sharedPrivateKeyAccounts).accounts[senderAddress];
        if (!senderAccount) {
            throw new Error(`No account found for address: ${senderAddress}`);
        }
        const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
        const signature = await keypair.signPersonalMessage(params.message);
        return { signature: signature.signature };
    }
}

import { writable, type Writable } from 'svelte/store';

import {
    defaultClientConfig,
    verifyClientConfig,
    type ClientConfig,
} from './default-client-config';
import {
    defaultPrivateKeyAccounts,
    verifyPrivateKeyAccounts,
    type PrivateKeyAccounts,
} from './default-private-keys';

const CLIENT_CONFIG_KEY = 'clientConfig';
const PRIVATE_KEY_ACCOUNTS_KEY = 'privateKeyAccounts';
const SELECTED_SIGNER_TYPE_KEY = 'selectedSignerType';

export const clientConfigErrorMsg = writable<string>('');
export const sharedClientConfig: Writable<ClientConfig> = persistentWritableStore(
    CLIENT_CONFIG_KEY,
    defaultClientConfig,
    verifyClientConfig,
);

export const privateKeysErrorMsg = writable<string>('');
export const sharedPrivateKeyAccounts: Writable<PrivateKeyAccounts> = persistentWritableStore(
    PRIVATE_KEY_ACCOUNTS_KEY,
    defaultPrivateKeyAccounts,
    verifyPrivateKeyAccounts,
);

export enum SignerType {
    WebWallet = 'WebWallet',
    Localstorage = 'Localstorage',
}
export const selectedSignerType = writable<SignerType>(SignerType.Localstorage);
export const sharedSignerType: Writable<SignerType> = persistentWritableStore(
    SELECTED_SIGNER_TYPE_KEY,
    SignerType.Localstorage,
    (value: any) => {
        if (typeof value !== 'string' || !Object.values(SignerType).includes(value as SignerType)) {
            throw new Error(
                `Invalid signer type: ${value}. Must be one of ${Object.values(SignerType).join(', ')}`,
            );
        }
        return true;
    },
);

// Custom store synced with localStorage
export function persistentWritableStore(
    key: string,
    initialValue: any,
    verificationFn: Function,
): Writable<any> {
    let stored = loadFromLocalStorage(key, initialValue, verificationFn);
    const store = writable(stored);

    store.subscribe((value) => {
        if (typeof localStorage !== 'undefined') {
            try {
                if (verificationFn(value)) {
                    localStorage.setItem(key, JSON.stringify(value));
                    if (key === CLIENT_CONFIG_KEY) {
                        clientConfigErrorMsg.set('');
                    }
                    if (key === PRIVATE_KEY_ACCOUNTS_KEY) {
                        privateKeysErrorMsg.set('');
                    }
                }
            } catch (err: any) {
                console.warn(`Invalid value for localStorage key "${key}":`, value, err);
                if (key === CLIENT_CONFIG_KEY) {
                    clientConfigErrorMsg.set(err.message || String(err));
                }
                if (key === PRIVATE_KEY_ACCOUNTS_KEY) {
                    privateKeysErrorMsg.set(err.message || String(err));
                }
            }
        }
    });
    return store;
}

function loadFromLocalStorage(key: string, initialValue: any, verificationFn: Function) {
    const json = localStorage.getItem(key);
    try {
        let value = json ? JSON.parse(json) : initialValue;
        verificationFn(value);
        return value;
    } catch (err) {
        console.error(`Error parsing localStorage key "${key}, overwriting with default"`, err);
        return initialValue;
    }
}

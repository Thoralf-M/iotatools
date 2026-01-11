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

export interface ExternalAddress {
    address: string;
    alias?: string;
}

export interface ExternalAddresses {
    addresses: ExternalAddress[];
    selectedAddress?: string;
}

function defaultExternalAddresses(): ExternalAddresses {
    return {
        addresses: [],
        selectedAddress: undefined,
    };
}

function verifyExternalAddresses(value: any): boolean {
    if (!value || typeof value !== 'object') {
        throw new Error('External addresses must be an object');
    }

    if (!Array.isArray(value.addresses)) {
        throw new Error('External addresses must contain an array of addresses');
    }

    for (const addr of value.addresses) {
        if (!addr || typeof addr !== 'object') {
            throw new Error('Each external address must be an object');
        }
        if (!addr.address || typeof addr.address !== 'string') {
            throw new Error('Each external address must have a valid address string');
        }
        if (addr.alias !== undefined && typeof addr.alias !== 'string') {
            throw new Error('External address alias must be a string if provided');
        }
    }

    if (value.selectedAddress !== undefined && typeof value.selectedAddress !== 'string') {
        throw new Error('Selected address must be a string if provided');
    }

    return true;
}

const CLIENT_CONFIG_KEY = 'clientConfig';
const PRIVATE_KEY_ACCOUNTS_KEY = 'privateKeyAccounts';
const SELECTED_SIGNER_TYPE_KEY = 'selectedSignerType';
const EXTERNAL_ADDRESSES_KEY = 'externalAddresses';
const IS_PRO_MODE_KEY = 'isProMode';
const SELECTED_ADDRESS_KEY = 'selectedAddress';

export const clientConfigErrorMsg = writable<string>('');
export const sharedClientConfig: Writable<ClientConfig> = persistentWritableStore(
    CLIENT_CONFIG_KEY,
    defaultClientConfig,
    verifyClientConfig,
);

export const isProMode: Writable<boolean> = persistentWritableStore(
    IS_PRO_MODE_KEY,
    false,
    (value: any) => typeof value === 'boolean',
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
    ExternalAddress = 'ExternalAddress',
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

export const externalAddressesErrorMsg = writable<string>('');
export const sharedExternalAddresses: Writable<ExternalAddresses> = persistentWritableStore(
    EXTERNAL_ADDRESSES_KEY,
    defaultExternalAddresses(),
    verifyExternalAddresses,
);

export const selectedAddressErrorMsg = writable<string>('');
export const sharedSelectedAddress: Writable<Record<string, string>> = persistentWritableStore(
    SELECTED_ADDRESS_KEY,
    {},
    (value: any) => {
        if (typeof value !== 'object') {
            throw new Error('Selected address must be an object');
        }
        for (const key in value) {
            if (typeof value[key] !== 'string') {
                throw new Error('Selected address values must be strings');
            }
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
                    if (key === EXTERNAL_ADDRESSES_KEY) {
                        externalAddressesErrorMsg.set('');
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
                if (key === EXTERNAL_ADDRESSES_KEY) {
                    externalAddressesErrorMsg.set(err.message || String(err));
                }
            }
        }
    });
    return store;
}

function loadFromLocalStorage(key: string, initialValue: any, verificationFn: Function) {
    // Check if localStorage is available (not available in Node.js)
    if (typeof localStorage === 'undefined') {
        return initialValue;
    }

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

import { writable, type Writable } from 'svelte/store';
import { defaultClientConfig, isValidClientConfig, type ClientConfig } from './default-client-config';
import { defaultPrivateKeys, isValidPrivateKeys, type PrivateKeys } from './default-private-keys';

const CLIENT_CONFIG_KEY = 'clientConfig';
const PRIVATE_KEYS_KEY = 'privateKeys';

export const clientConfigErrorMsg = writable<string>('');

export const sharedClientConfig: Writable<ClientConfig> = persistentWritableStore(
    CLIENT_CONFIG_KEY,
    defaultClientConfig,
    isValidClientConfig,
);

export const privateKeysErrorMsg = writable<string>('');
export const sharedPrivateKeys: Writable<PrivateKeys> = persistentWritableStore(
    PRIVATE_KEYS_KEY,
    defaultPrivateKeys,
    isValidPrivateKeys,
);

// Custom store synced with localStorage
export function persistentWritableStore(
    key: string,
    initialValue: any,
    validationFn: Function,
): Writable<any> {
    const stored = loadFromLocalStorage(key, initialValue);
    const store = writable(stored);

    store.subscribe((value) => {
        if (typeof localStorage !== 'undefined') {  
            try {
                if (validationFn(value)) {
                    console.log(`Saving localStorage key "${key}"`, value);
                    localStorage.setItem(key, JSON.stringify(value));
                    if (key === CLIENT_CONFIG_KEY) {
                        clientConfigErrorMsg.set('');
                    }
                    if (key === PRIVATE_KEYS_KEY) {
                        privateKeysErrorMsg.set('');
                    }
                }
            } catch (err: any) {
                console.warn(`Invalid value for localStorage key "${key}":`, value, err);
                if (key === CLIENT_CONFIG_KEY) {
                    clientConfigErrorMsg.set(err.message || String(err));
                }
                if (key === PRIVATE_KEYS_KEY) {
                    privateKeysErrorMsg.set(err.message || String(err));
                }
            }
        }
    });
    return store;
}

function loadFromLocalStorage(key: string, initialValue: any) {
    const json = localStorage.getItem(key);
    console.log(`Loading localStorage key "${key}"`, json);
    try {
        return json ? JSON.parse(json) : initialValue;
    } catch (err) {
        console.error(`Error parsing localStorage key "${key}"`, err);
        return initialValue;
    }
}

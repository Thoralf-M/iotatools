import { writable, type Writable } from 'svelte/store';

import { defaultClientConfig, type ClientConfig } from './defaultClientConfig';

export const clientConfigErrorMsg = writable<string>('');

function isValidClientConfig(value: any) {
    if (typeof value !== 'object' || value === null) throw new Error('Config is not an object');
    if (typeof value.selected !== 'string') throw new Error('Config.selected is not a string');
    if (!Array.isArray(value.networks)) throw new Error('Config.networks is not an array');
    for (const [i, network] of value.networks.entries()) {
        if (typeof network.name !== 'string')
            throw new Error(`Config.networks[${i}].name is not a string`);
        if (typeof network.node !== 'string')
            throw new Error(`Config.networks[${i}].node is not a string`);
        if (typeof network.indexer !== 'string')
            throw new Error(`Config.networks[${i}].indexer is not a string`);
        if (typeof network.graphql !== 'string')
            throw new Error(`Config.networks[${i}].graphql is not a string`);
        if (network.faucet && typeof network.faucet !== 'string')
            throw new Error(`Config.networks[${i}].faucet is not a string`);
    }
    return true;
}
export const sharedClientConfig: Writable<ClientConfig> = persistentWritableStore(
    'clientConfig',
    defaultClientConfig,
    isValidClientConfig,
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
                    clientConfigErrorMsg.set('');
                    console.log(`Saving localStorage key "${key}"`, value);
                    localStorage.setItem(key, JSON.stringify(value));
                }
            } catch (err: any) {
                clientConfigErrorMsg.set(err.message || String(err));
                console.warn(`Invalid value for localStorage key "${key}":`, value, err);
                // Optionally, you could set an error store or take other action here
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

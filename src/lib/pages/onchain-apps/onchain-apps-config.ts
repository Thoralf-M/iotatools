import { writable, type Writable } from 'svelte/store';

/**
 * Configuration for the On-Chain Apps page. Stores the ids of the three
 * shared objects created when the `onchain_apps` Move package is deployed
 * to devnet, plus the randomly-generated private key used for signing
 * transactions from within the embedded apps.
 */
export interface OnChainAppsConfig {
    packageId: string;
    registryId: string;
    storageId: string;
}

// Best-effort devnet defaults. Left blank until the Move package is deployed
// and the user pastes in the ids via the Settings panel on the page.
const EMPTY_CONFIG: OnChainAppsConfig = {
    packageId: '',
    registryId: '',
    storageId: '',
};

const CONFIG_KEY = 'onchainAppsConfig';
const RANDOM_KEY_KEY = 'onchainAppsRandomKey';

function loadConfig(): OnChainAppsConfig {
    if (typeof localStorage === 'undefined') return { ...EMPTY_CONFIG };
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        if (!raw) return { ...EMPTY_CONFIG };
        const parsed = JSON.parse(raw);
        return {
            packageId: typeof parsed.packageId === 'string' ? parsed.packageId : '',
            registryId: typeof parsed.registryId === 'string' ? parsed.registryId : '',
            storageId: typeof parsed.storageId === 'string' ? parsed.storageId : '',
        };
    } catch {
        return { ...EMPTY_CONFIG };
    }
}

export const onChainAppsConfig: Writable<OnChainAppsConfig> = writable(loadConfig());

onChainAppsConfig.subscribe((value) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(value));
    } catch (err) {
        console.warn('failed to persist onchain-apps config', err);
    }
});

export function loadRandomKey(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(RANDOM_KEY_KEY);
}

export function saveRandomKey(bech32PrivateKey: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(RANDOM_KEY_KEY, bech32PrivateKey);
}

export function clearRandomKey() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(RANDOM_KEY_KEY);
}

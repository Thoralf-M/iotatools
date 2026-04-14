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

// Canonical devnet deployment ids. If the user hasn't overridden these in the
// config panel the defaults are used automatically.
// After deploying (or re-deploying) the Move package, update the values here.
export const DEFAULT_CONFIG: OnChainAppsConfig = {
    packageId: '0x76f9af5d12803e11caa60a6f7adaca9b59c3674eba1fda3e8af22c97381052f5',
    registryId: '0x6d998e1a16bb43e270a52e048a87c90b7386073e45fbcc6ae190ce674b2b2415',
    storageId: '0xa3bf3f0a63f0389c8d01778e5e65847b1770cd4e5abab201c76890d45e01b37d',
};

const CONFIG_KEY = 'onchainAppsConfig';
const RANDOM_KEY_KEY = 'onchainAppsRandomKey';

function loadConfig(): OnChainAppsConfig {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_CONFIG };
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        if (!raw) return { ...DEFAULT_CONFIG };
        const parsed = JSON.parse(raw);
        // Merge: stored value wins if non-empty, otherwise fall back to default.
        return {
            packageId: parsed.packageId || DEFAULT_CONFIG.packageId,
            registryId: parsed.registryId || DEFAULT_CONFIG.registryId,
            storageId: parsed.storageId || DEFAULT_CONFIG.storageId,
        };
    } catch {
        return { ...DEFAULT_CONFIG };
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

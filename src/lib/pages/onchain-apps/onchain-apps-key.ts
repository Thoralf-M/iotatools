import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';

import {
    deriveAddressFromKeypair,
    keypairFromBech32PrivateKey,
} from '../../utils/default-private-keys';
import { loadRandomKey, saveRandomKey } from './onchain-apps-config';

/**
 * Helpers around the random Ed25519 keypair that we use for signing on the
 * On-Chain Apps page. The key lives in `localStorage` so refreshing the page
 * keeps the user's apps logged in / their balance intact.
 */

export interface RandomKey {
    bech32PrivateKey: string;
    address: string;
}

/** Generate a fresh Ed25519 keypair and persist it to `localStorage`. */
export function generateAndStoreRandomKey(): RandomKey {
    const keypair = Ed25519Keypair.generate();
    const bech32 = keypair.getSecretKey();
    saveRandomKey(bech32);
    return { bech32PrivateKey: bech32, address: keypair.toIotaAddress() };
}

/** Read the stored key if any; otherwise return `null`. */
export function getStoredRandomKey(): RandomKey | null {
    const bech32 = loadRandomKey();
    if (!bech32) return null;
    try {
        const keypair = keypairFromBech32PrivateKey(bech32);
        return { bech32PrivateKey: bech32, address: deriveAddressFromKeypair(keypair) };
    } catch {
        return null;
    }
}

/** Return the stored key, generating a new one if nothing is stored yet. */
export function ensureRandomKey(): RandomKey {
    return getStoredRandomKey() ?? generateAndStoreRandomKey();
}

/** Resolve a bech32 private key to an `Ed25519Keypair`. */
export function keypairFor(bech32PrivateKey: string): Ed25519Keypair {
    const kp = keypairFromBech32PrivateKey(bech32PrivateKey);
    if (!(kp instanceof Ed25519Keypair)) {
        throw new Error('Random key must be Ed25519');
    }
    return kp;
}

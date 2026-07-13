import { initAsync } from '@iota/sdk-wasm';

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initWasmSdk(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = initAsync().then(() => {
        initialized = true;
    });
    return initPromise;
}

export function isWasmInitialized(): boolean {
    return initialized;
}

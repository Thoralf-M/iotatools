import { uniffiInitAsync } from '../../../wasm/src/ts/index.web';

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initWasmSdk(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = uniffiInitAsync().then(() => {
        initialized = true;
    });
    return initPromise;
}

export function isWasmInitialized(): boolean {
    return initialized;
}

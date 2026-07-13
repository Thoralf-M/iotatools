// [GAP] Transaction class not in WASM SDK - use TransactionBuilder + .finish()
type Transaction = any;
import { writable } from 'svelte/store';

import { getSelectedNetworkConfig } from './client';

interface PendingMainnetTransactionConfirmation {
    transactionData: any;
}

export const pendingMainnetTransactionConfirmation =
    writable<PendingMainnetTransactionConfirmation | null>(null);

let pendingResolver: ((confirmed: boolean) => void) | null = null;

export async function requireMainnetTransactionConfirmation(
    transaction: Transaction,
): Promise<void> {
    if (getSelectedNetworkConfig().name !== 'mainnet') {
        return;
    }

    if (pendingResolver) {
        throw new Error('Another transaction confirmation is already in progress');
    }

    let transactionData: any = transaction;
    try {
        transactionData = JSON.parse(await transaction.toJSON());
    } catch {
        // Fallback to raw transaction object when JSON conversion is unavailable.
    }

    const confirmed = await new Promise<boolean>((resolve) => {
        pendingResolver = resolve;
        pendingMainnetTransactionConfirmation.set({ transactionData });
    });

    pendingResolver = null;
    pendingMainnetTransactionConfirmation.set(null);

    if (!confirmed) {
        throw new Error('Transaction cancelled by user');
    }
}

export function confirmMainnetTransaction(): void {
    if (pendingResolver) {
        pendingResolver(true);
    }
}

export function cancelMainnetTransaction(): void {
    if (pendingResolver) {
        pendingResolver(false);
    }
}

import type { Transaction } from '@iota/iota-sdk/transactions';
import { get, writable } from 'svelte/store';

import { sharedTransactionExecution, TransactionExecution } from '../utils/shared-in-memory';
import { executeTransaction } from '../utils/transaction-execution';

export type TrayItemStatus = 'running' | 'success' | 'error';

export interface TrayItem {
    id: string;
    label: string;
    sender?: string;
    recipients?: string[];
    transaction: Transaction;
    /** The mode the dropdown is currently set to — i.e., what the *next*
     *  Run click will use. Changing this MUST NOT alter how the existing
     *  result is presented; that's `lastRunMode`'s job. */
    mode: TransactionExecution;
    /** The mode that produced the current `result` / `error`. `undefined`
     *  before the first run completes. */
    lastRunMode?: TransactionExecution;
    status: TrayItemStatus;
    result?: unknown;
    error?: string;
    createdAt: number;
}

export const trayItems = writable<TrayItem[]>([]);
export const trayOpen = writable<boolean>(false);
export const expandedItemId = writable<string | null>(null);

let counter = 0;
function nextId(): string {
    counter += 1;
    return `tx-${Date.now().toString(36)}-${counter}`;
}

function patchItem(id: string, patch: Partial<TrayItem>) {
    trayItems.update((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
}

async function runItem(id: string): Promise<void> {
    const items = get(trayItems);
    const item = items.find((it) => it.id === id);
    if (!item) return;

    // Snapshot the mode at run-time so a later dropdown change can't
    // retroactively re-label the existing result.
    const runMode = item.mode;
    patchItem(id, { status: 'running', error: undefined, lastRunMode: runMode });
    try {
        if (item.sender) {
            item.transaction.setSenderIfNotSet(item.sender);
        }
        const result = await executeTransaction(item.transaction, undefined, runMode);
        patchItem(id, { status: 'success', result, error: undefined, lastRunMode: runMode });
    } catch (err: any) {
        patchItem(id, {
            status: 'error',
            error: err?.message ?? String(err),
            result: undefined,
            lastRunMode: runMode,
        });
    }
}

/**
 * Add a transaction to the tray and execute it. The result lands on the
 * created card; existing tray items are untouched.
 */
export async function addAndRun(input: {
    label: string;
    transaction: Transaction;
    sender?: string;
    recipients?: string[];
    mode?: TransactionExecution;
}): Promise<string> {
    const mode = input.mode ?? get(sharedTransactionExecution);
    const item: TrayItem = {
        id: nextId(),
        label: input.label,
        sender: input.sender,
        recipients: input.recipients,
        transaction: input.transaction,
        mode,
        status: 'running',
        createdAt: Date.now(),
    };
    trayItems.update((items) => [...items, item]);
    trayOpen.set(true);
    expandedItemId.set(item.id);
    await runItem(item.id);
    return item.id;
}

/** Re-execute an existing tray card with its current mode. Overwrites the card. */
export async function rerun(id: string): Promise<void> {
    expandedItemId.set(id);
    await runItem(id);
}

export function setMode(id: string, mode: TransactionExecution): void {
    patchItem(id, { mode });
}

export function removeItem(id: string): void {
    trayItems.update((items) => items.filter((it) => it.id !== id));
    expandedItemId.update((cur) => (cur === id ? null : cur));
    if (get(trayItems).length === 0) trayOpen.set(false);
}

export function clearTray(): void {
    trayItems.set([]);
    expandedItemId.set(null);
    trayOpen.set(false);
}

export function toggleExpanded(id: string): void {
    expandedItemId.update((cur) => (cur === id ? null : id));
}

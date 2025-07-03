import { writable } from 'svelte/store';

export enum TransactionExecution {
    DevInspect = 'dev-inspect (simulation, free)',
    DryRun = 'dry-run (simulation, free)',
    Send = 'send (transaction, costs gas)',
    Prepare = 'prepare (free)',
}

export const sharedTransactionExecution = writable<TransactionExecution>(
    TransactionExecution.DryRun,
);

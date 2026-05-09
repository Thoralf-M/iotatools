<script lang="ts">
    import {
        expandedItemId,
        removeItem,
        rerun,
        setMode,
        toggleExpanded,
        type TrayItem,
    } from '../stores/transaction-tray';
    import { TransactionExecution } from '../utils/shared-in-memory';
    import TransactionView from './TransactionView.svelte';

    interface Props {
        item: TrayItem;
        index: number;
    }

    let { item, index }: Props = $props();

    let expanded = $derived($expandedItemId === item.id);

    /** On-chain status from the result's effects, when present. Dry-run,
     *  dev-inspect and Send all expose this; Prepare doesn't (no execution). */
    function effectStatus(result: unknown): 'success' | 'failure' | undefined {
        if (!result || typeof result !== 'object') return undefined;
        return (result as any)?.effects?.status?.status;
    }

    /** Three-way outcome that drives badge color AND the controls-hiding flag.
     *  Built from `lastRunMode` (the mode that produced the current result),
     *  not `mode` (what the dropdown is set to for the next run). */
    type Outcome = 'pending' | 'running' | 'success' | 'failure';
    let outcome: Outcome = $derived.by(() => {
        if (!item.lastRunMode) return 'pending';
        if (item.status === 'running') return 'running';
        if (item.status === 'error') return 'failure';
        return effectStatus(item.result) === 'failure' ? 'failure' : 'success';
    });

    // A real Send that completed (success OR on-chain failure) has touched
    // chain state — re-running would either replay the action or fail with
    // already-consumed inputs. Hide the dropdown and Run button so the user
    // can only inspect or remove. Note: gated on `lastRunMode`, not `mode`,
    // so flipping the dropdown to "Send" before clicking Run doesn't trigger.
    let isExecuted = $derived(
        item.status === 'success' && item.lastRunMode === TransactionExecution.Send,
    );

    function statusLabel(item: TrayItem): string {
        if (outcome === 'running') return 'running…';
        if (outcome === 'pending') return 'pending';
        const ranAs = item.lastRunMode ?? item.mode;
        if (outcome === 'failure') {
            switch (ranAs) {
                case TransactionExecution.DevInspect:
                    return 'dev-inspect failed';
                case TransactionExecution.DryRun:
                    return 'dry-run failed';
                case TransactionExecution.Send:
                    return 'execution failed';
                case TransactionExecution.Prepare:
                    return 'prepare failed';
            }
            return 'failed';
        }
        switch (ranAs) {
            case TransactionExecution.DevInspect:
                return 'dev-inspect';
            case TransactionExecution.DryRun:
                return 'dry-run';
            case TransactionExecution.Send:
                return 'executed';
            case TransactionExecution.Prepare:
                return 'prepared bytes';
        }
        return 'done';
    }

    /** Compact labels for the per-card mode picker — the verbose enum values
     *  ("dev-inspect (simulation, free)") force the <select> wide enough to
     *  push the Run / × buttons off-screen on narrow mobile viewports. */
    function modeLabel(mode: TransactionExecution): string {
        switch (mode) {
            case TransactionExecution.DevInspect:
                return 'Dev-inspect';
            case TransactionExecution.DryRun:
                return 'Dry-run';
            case TransactionExecution.Send:
                return 'Send';
            case TransactionExecution.Prepare:
                return 'Prepare bytes';
        }
        return mode;
    }

    function shortAddr(a: string): string {
        if (!a) return '';
        return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
    }
</script>

<div class="card" class:expanded class:running={item.status === 'running'}>
    <button
        type="button"
        class="card-header"
        onclick={() => toggleExpanded(item.id)}
        aria-expanded={expanded}
        title={expanded ? 'Collapse' : 'Click to view details'}
    >
        <span class="caret" class:open={expanded}>▶</span>
        <span class="index">#{index + 1}</span>
        <span class="status status-{outcome}">
            {statusLabel(item)}
        </span>
        <span class="label" title={item.label}>{item.label}</span>
        {#if item.sender}
            <span class="meta" title="Sender: {item.sender}">from {shortAddr(item.sender)}</span>
        {/if}
        {#if item.recipients && item.recipients.length > 0}
            <span class="meta" title={item.recipients.join(', ')}>
                → {item.recipients.length === 1
                    ? shortAddr(item.recipients[0])
                    : `${item.recipients.length} recipients`}
            </span>
        {/if}
    </button>

    <div class="actions">
        {#if !isExecuted}
            <select
                class="mode-select"
                class:send-mode={item.mode === TransactionExecution.Send}
                value={item.mode}
                onchange={(e) =>
                    setMode(item.id, (e.target as HTMLSelectElement).value as TransactionExecution)}
                disabled={item.status === 'running'}
                title="Execution mode for the next run of this transaction"
                onclick={(e) => e.stopPropagation()}
            >
                {#each Object.values(TransactionExecution) as m}
                    <option value={m} title={m}>{modeLabel(m)}</option>
                {/each}
            </select>
            <button
                type="button"
                class="run-btn"
                class:send-mode={item.mode === TransactionExecution.Send}
                onclick={(e) => {
                    e.stopPropagation();
                    rerun(item.id);
                }}
                disabled={item.status === 'running'}
                title="Run again with the selected mode"
            >
                {item.status === 'running' ? '…' : 'Run'}
            </button>
        {/if}
        <button
            type="button"
            class="remove-btn"
            onclick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
            }}
            title="Remove from list"
            aria-label="Remove transaction"
        >
            ✕
        </button>
    </div>

    {#if expanded}
        <div class="detail">
            {#if item.status === 'running'}
                <div class="detail-running">Running…</div>
            {:else if item.status === 'error'}
                <div class="detail-error">{item.error}</div>
            {:else if item.result !== undefined}
                <TransactionView value={item.result} />
            {:else}
                <div class="detail-running">No result yet.</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 0.5rem;
        align-items: center;
        padding: 0.4rem 0.6rem;
        background: rgba(35, 43, 61, 0.4);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        transition:
            border-color 0.15s ease,
            background 0.15s ease;
        min-width: 0;
        max-width: 100%;
    }
    .card:hover {
        border-color: var(--border-hover);
    }
    .card.expanded {
        background: var(--background-card);
        border-color: var(--border-hover);
    }
    .card.running {
        border-color: rgba(59, 130, 246, 0.5);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: 0;
        padding: 0;
        text-align: left;
        color: inherit;
        cursor: pointer;
        min-width: 0;
        flex: 1;
        overflow: hidden;
    }
    .caret {
        display: inline-block;
        font-size: 0.65rem;
        color: var(--text-muted);
        transition: transform 0.15s ease;
        flex-shrink: 0;
    }
    .caret.open {
        transform: rotate(90deg);
    }
    .index {
        color: var(--text-muted);
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
    }
    .status {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-weight: 600;
        flex-shrink: 0;
    }
    .status-pending,
    .status-running {
        background: rgba(59, 130, 246, 0.18);
        color: #93c5fd;
    }
    .status-failure {
        background: rgba(220, 38, 38, 0.2);
        color: #fca5a5;
    }
    .status-success {
        background: rgba(16, 185, 129, 0.18);
        color: #6ee7b7;
    }
    .label {
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
    }
    .meta {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-family: monospace;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
        flex-wrap: wrap;
        justify-content: flex-end;
        min-width: 0;
    }
    .mode-select {
        padding: 0.25rem 0.4rem;
        background: rgba(55, 65, 81, 0.4);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 5px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.75rem;
        cursor: pointer;
        height: 28px;
        max-width: 100%;
    }
    .mode-select:hover:not(:disabled) {
        background: rgba(55, 65, 81, 0.6);
        border-color: rgba(156, 163, 175, 0.35);
    }
    .mode-select.send-mode {
        background: rgba(177, 30, 30, 0.4);
        border-color: rgba(220, 38, 38, 0.4);
    }
    .mode-select option {
        background: rgb(31, 41, 55);
    }

    .run-btn {
        padding: 0.25rem 0.7rem;
        border: 1px solid rgba(156, 163, 175, 0.25);
        border-radius: 5px;
        background: rgba(59, 130, 246, 0.18);
        color: #dbeafe;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        height: 28px;
        transition: all 0.15s ease;
    }
    .run-btn:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.3);
        border-color: rgba(59, 130, 246, 0.45);
    }
    .run-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .run-btn.send-mode {
        background: rgba(220, 38, 38, 0.25);
        color: #fee2e2;
        border-color: rgba(220, 38, 38, 0.4);
    }
    .run-btn.send-mode:hover:not(:disabled) {
        background: rgba(220, 38, 38, 0.4);
    }

    .remove-btn {
        padding: 0;
        width: 28px;
        height: 28px;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 5px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .remove-btn:hover {
        background: rgba(220, 38, 38, 0.2);
        border-color: rgba(220, 38, 38, 0.4);
        color: #fecaca;
    }

    .detail {
        grid-column: 1 / -1;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border-color);
    }
    .detail-running {
        color: var(--text-muted);
        font-style: italic;
        padding: 0.5rem 0;
    }
    .detail-error {
        color: #fca5a5;
        white-space: pre-wrap;
        font-family: monospace;
        font-size: 0.85rem;
        padding: 0.25rem 0;
    }

    @media (max-width: 768px) {
        .card {
            grid-template-columns: minmax(0, 1fr);
        }
        .card-header {
            flex-wrap: wrap;
        }
        .label {
            font-size: 0.8rem;
            flex-basis: 100%;
            order: 5;
        }
        .meta {
            font-size: 0.7rem;
        }
        .actions {
            justify-content: flex-end;
            width: 100%;
        }
        .mode-select {
            flex: 1 1 auto;
            min-width: 0;
        }
        .run-btn,
        .remove-btn {
            flex-shrink: 0;
        }
    }
</style>

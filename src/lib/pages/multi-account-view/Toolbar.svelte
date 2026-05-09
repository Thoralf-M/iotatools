<script lang="ts">
    interface Props {
        newAccountAddress: string;
        numTransfers: number;
        stakingMode: boolean;
        syncing: boolean;
        typeFilter: string;
        hiddenCount: number;
        soloLabel: string | null;
        onSync: () => void;
        onAddExternalAccount: () => void;
        onExecuteTransfers: () => void;
        onClearHidden: () => void;
        onClearSolo: () => void;
    }

    let {
        newAccountAddress = $bindable(),
        numTransfers,
        stakingMode = $bindable(),
        syncing,
        typeFilter = $bindable(),
        hiddenCount,
        soloLabel,
        onSync,
        onAddExternalAccount,
        onExecuteTransfers,
        onClearHidden,
        onClearSolo,
    }: Props = $props();
</script>

<div class="toolbar">
    <div style="display: flex; gap: 0.5rem;">
        <button
            class="sync-button"
            class:syncing
            onclick={onSync}
            disabled={syncing}
            title={syncing
                ? 'Syncing accounts and stakes — please wait.'
                : 'Reload owned objects and recompute staking rewards.'}
        >
            {#if syncing}
                <span class="spinner" aria-hidden="true"></span>
                Syncing…
            {:else}
                Sync/Reset
            {/if}
        </button>
    </div>

    <div style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1; flex-wrap: wrap;">
        <input
            type="text"
            placeholder="Enter external address (0x...)"
            bind:value={newAccountAddress}
        />
        <button onclick={onAddExternalAccount}>Add Account</button>

        <input
            type="text"
            placeholder="Filter by object type (e.g. 0x2 or StakedIota)"
            bind:value={typeFilter}
            title="Partial, case-insensitive match against the full Move type. Empty = no filter."
            style="min-width: 16rem;"
        />
    </div>

    <label class="toggle-row" title="Hide non-staking objects and focus the view on stakes.">
        <div class="toggle-switch">
            <input type="checkbox" bind:checked={stakingMode} />
            <span class="slider"></span>
        </div>
        <span>Staking mode</span>
    </label>

    {#if soloLabel}
        <button class="visibility-btn" onclick={onClearSolo} title="Show all accounts again.">
            Exit solo: {soloLabel}
        </button>
    {/if}

    {#if hiddenCount > 0}
        <button
            class="visibility-btn"
            onclick={onClearHidden}
            title="Unhide accounts that were hidden via the per-card Hide button."
        >
            Show hidden ({hiddenCount})
        </button>
    {/if}

    <div style="display: flex; gap: 0.5rem;">
        <button onclick={onExecuteTransfers} disabled={numTransfers === 0}>
            Execute ({numTransfers}) Transfer{numTransfers !== 1 ? 's' : ''}
        </button>
    </div>
</div>

<style>
    .toggle-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        font-size: 0.9rem;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #475569;
        transition: 0.4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #059669;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #059669;
    }

    input:checked + .slider:before {
        transform: translateX(16px);
    }

    .sync-button {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: #059669;
        color: white;
        border: 1px solid #047857;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        transition:
            background 0.15s,
            opacity 0.15s;
    }

    .sync-button:hover:not(:disabled) {
        background: #047857;
    }

    .sync-button:disabled {
        cursor: not-allowed;
        opacity: 0.85;
    }

    /* Pulsing background communicates "still working" — combined with the
       spinner this makes it visually obvious the sync hasn't finished. */
    .sync-button.syncing {
        animation: pulse 1.4s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            background: rgba(5, 150, 105, 0.4);
        }
        50% {
            background: rgba(5, 150, 105, 0.65);
        }
    }

    .spinner {
        width: 0.85em;
        height: 0.85em;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        flex-shrink: 0;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .visibility-btn {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        background: rgba(99, 102, 241, 0.15);
        border: 1px solid rgba(99, 102, 241, 0.4);
        border-radius: 4px;
        color: #c7d2fe;
        cursor: pointer;
    }

    .visibility-btn:hover {
        background: rgba(99, 102, 241, 0.3);
    }
</style>

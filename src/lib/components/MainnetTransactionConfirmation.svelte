<script lang="ts">
    import {
        cancelMainnetTransaction,
        confirmMainnetTransaction,
        pendingMainnetTransactionConfirmation,
    } from '../utils/mainnet-transaction-confirmation';
    import TransactionView from './TransactionView.svelte';
</script>

{#if $pendingMainnetTransactionConfirmation}
    <div
        class="modal-overlay"
        onclick={cancelMainnetTransaction}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Escape' && cancelMainnetTransaction()}
    >
        <div
            class="modal-content"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mainnet-warning-title"
            tabindex="-1"
        >
            <h3 id="mainnet-warning-title">Mainnet Transaction Warning</h3>
            <p class="warning-text">
                You are connected to mainnet. Always verify the transaction details in your wallet
                before signing.
            </p>

            <div class="transaction-preview">
                <TransactionView value={$pendingMainnetTransactionConfirmation.transactionData} />
            </div>

            <div class="actions">
                <button class="cancel-btn" onclick={cancelMainnetTransaction}>Cancel</button>
                <button class="confirm-btn" onclick={confirmMainnetTransaction}>
                    Confirm and Continue
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 4000;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .modal-content {
        width: min(960px, 96vw);
        max-height: 92vh;
        overflow: auto;
        background: rgba(22, 28, 39, 0.98);
        border: 1px solid rgba(250, 204, 21, 0.4);
        border-radius: 12px;
        padding: 1rem;
        text-align: left;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
    }

    h3 {
        margin: 0 0 0.5rem 0;
        color: rgba(250, 204, 21, 0.95);
    }

    .warning-text {
        margin: 0 0 0.75rem 0;
        color: rgba(255, 255, 255, 0.9);
    }

    .transaction-preview {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        max-height: 58vh;
        overflow: auto;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .cancel-btn {
        border-color: rgba(148, 163, 184, 0.35);
    }

    .confirm-btn {
        border-color: rgba(250, 204, 21, 0.5);
        background: rgba(250, 204, 21, 0.15);
        color: rgba(255, 255, 255, 0.95);
    }

    .confirm-btn:hover {
        border-color: rgba(250, 204, 21, 0.8);
        background: rgba(250, 204, 21, 0.25);
    }
</style>

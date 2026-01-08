<script lang="ts">
    import { iota_wallets } from '../lib/signer-data';
    import { connectWallet, setSelectedWallet } from '../lib/web-wallet';

    let {
        isOpen = $bindable(false),
        onClose,
        onWalletSelected,
    }: {
        isOpen?: boolean;
        onClose: () => void;
        onWalletSelected: (walletIndex: number) => void;
    } = $props();

    async function handleWalletClick(walletIndex: number) {
        setSelectedWallet(walletIndex);
        await connectWallet(false);
        onWalletSelected(walletIndex);
        onClose();
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={onClose}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>Select Wallet</h2>
                <button class="close-btn" onclick={onClose}>✕</button>
            </div>
            <div class="modal-body">
                {#if $iota_wallets.length === 0}
                    <p class="no-wallets">
                        No IOTA wallets detected. Please install a wallet extension.
                    </p>
                {:else}
                    <div class="wallet-list">
                        {#each $iota_wallets as wallet, index}
                            <button class="wallet-item" onclick={() => handleWalletClick(index)}>
                                {#if wallet.icon}
                                    <img src={wallet.icon} alt={wallet.name} class="wallet-icon" />
                                {/if}
                                <div class="wallet-info">
                                    <div class="wallet-name">{wallet.name}</div>
                                    <div class="wallet-version">v{wallet.version}</div>
                                </div>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: rgba(31, 41, 55, 0.95);
        border-radius: 12px;
        border: 1px solid rgba(156, 163, 175, 0.2);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(156, 163, 175, 0.15);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.95);
        font-weight: 600;
    }

    .close-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        transition: color 0.2s ease;
        line-height: 1;
    }

    .close-btn:hover {
        color: rgba(255, 255, 255, 0.9);
    }

    .modal-body {
        padding: 1rem;
        overflow-y: auto;
    }

    .no-wallets {
        text-align: center;
        padding: 2rem;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
    }

    .wallet-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .wallet-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(55, 65, 81, 0.4);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        text-align: left;
    }

    .wallet-item:hover {
        background: rgba(55, 65, 81, 0.6);
        border-color: rgba(59, 130, 246, 0.4);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .wallet-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        object-fit: contain;
    }

    .wallet-info {
        flex: 1;
    }

    .wallet-name {
        font-size: 1rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 0.25rem;
    }

    .wallet-version {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
        .modal-content {
            max-width: 95%;
        }

        .modal-header {
            padding: 1rem;
        }

        .wallet-item {
            padding: 0.75rem;
        }
    }
</style>

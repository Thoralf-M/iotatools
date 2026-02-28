<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount } from 'svelte';

    import {
        isProMode,
        sharedClientConfig,
        sharedSignerType,
        SignerType,
    } from '../utils/local-storage-store';
    import {
        addressFromQuery,
        initQueryParamHandling,
        QUERY_PARAM_KEYS,
        queryAwareClientConfig,
        setQueryParam,
    } from '../utils/query-param-store';
    import { sharedTransactionExecution, TransactionExecution } from '../utils/shared-in-memory';
    import {
        activeAddress,
        addOrUpdateExternalAddress,
        getSelectedExternalAddress,
        iota_accounts,
        updateSelectedSignerAccounts,
    } from '../utils/signer-data';
    import { disconnectWallet } from '../utils/web-wallet';
    import WalletSelectorModal from './WalletSelectorModal.svelte';

    let showWalletSelector = $state(false);

    // Initialize query parameter handling
    onMount(() => {
        initQueryParamHandling();

        // Initialize external address input if needed
        if ($sharedSignerType === SignerType.ExternalAddress) {
            const addressFromURL = $addressFromQuery;
            if (addressFromURL && isValidIotaAddress(addressFromURL)) {
                externalAddressInput = addressFromURL;
                addOrUpdateExternalAddress(addressFromURL);
            } else {
                const selectedAddress = getSelectedExternalAddress();
                if (selectedAddress) {
                    externalAddressInput = selectedAddress;
                    updateSelectedSignerAccounts(selectedAddress);
                }
            }
        }
    });

    // Use query-aware config that responds to URL parameters
    let clientConfig = queryAwareClientConfig;

    let externalAddressInput = $state('');

    // Function to handle network selection changes
    function handleNetworkChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const selectedNetwork = target.value;

        // Update the local storage config
        sharedClientConfig.update((config) => ({
            ...config,
            selected: selectedNetwork,
        }));

        // Also update the URL query parameter
        setQueryParam(QUERY_PARAM_KEYS.NETWORK, selectedNetwork);
    }

    function formatOptionText(account: any): string {
        const label = account.label || 'Account';
        const addressSnippet = `${account.address.slice(0, 8)}...${account.address.slice(-6)}`;
        return `${label} (${addressSnippet})`;
    }

    function handleAddressChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;

        if (value === '__disconnect__') {
            disconnectWallet();
        } else {
            $activeAddress = value;
        }
    }

    function clearExternalAddress() {
        externalAddressInput = '';
        $sharedSignerType = SignerType.Localstorage;
        setQueryParam(QUERY_PARAM_KEYS.SIGNER, null);
        setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
        updateSelectedSignerAccounts();
    }

    function openWalletSelector() {
        showWalletSelector = true;
    }

    function closeWalletSelector() {
        showWalletSelector = false;
    }
</script>

<div class="options-container">
    {#if !$isProMode}
        <div class="option-group">
            {#if $sharedSignerType === SignerType.WebWallet && $iota_accounts.length > 0}
                <select value={$activeAddress} onchange={handleAddressChange} class="select-input">
                    {#each $iota_accounts as account}
                        <option value={account.address}>
                            {formatOptionText(account)}
                        </option>
                    {/each}
                    <option value="__disconnect__">Disconnect</option>
                </select>
            {:else if $sharedSignerType === SignerType.ExternalAddress}
                <div class="external-address-input-wrapper">
                    <input
                        type="text"
                        class="external-address-input-small"
                        placeholder="Address 0x..."
                        value={externalAddressInput}
                        oninput={(e) => {
                            const value = (e.target as HTMLInputElement).value;
                            externalAddressInput = value;
                            if (isValidIotaAddress(value)) {
                                addOrUpdateExternalAddress(value);
                                setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, value);
                                updateSelectedSignerAccounts(value);
                            }
                        }}
                    />
                    <button class="remove-btn-small" onclick={clearExternalAddress}>✕</button>
                </div>
            {:else}
                <button
                    onclick={() => {
                        $sharedSignerType = SignerType.WebWallet;
                        setQueryParam(QUERY_PARAM_KEYS.SIGNER, SignerType.WebWallet);
                        setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
                        updateSelectedSignerAccounts();
                        openWalletSelector();
                    }}
                    class="connect-btn"
                >
                    Connect Web Wallet
                </button>
                <button
                    onclick={() => {
                        $sharedSignerType = SignerType.ExternalAddress;
                        setQueryParam(QUERY_PARAM_KEYS.SIGNER, SignerType.ExternalAddress);

                        const selectedAddress = getSelectedExternalAddress();
                        if (selectedAddress) {
                            externalAddressInput = selectedAddress;
                            setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, selectedAddress);
                            updateSelectedSignerAccounts(selectedAddress);
                        } else {
                            updateSelectedSignerAccounts();
                        }
                    }}
                    class="connect-btn"
                >
                    Use External Address
                </button>
            {/if}
        </div>
    {/if}
    <div class="option-group">
        <label class="option-label" for="network-select">Network:</label>
        <select
            value={$clientConfig.selected}
            onchange={handleNetworkChange}
            class="select-input"
            id="network-select"
        >
            {#each $clientConfig.networks as network}
                <option value={network.name}>{network.name}</option>
            {/each}
        </select>
    </div>

    {#if $isProMode}
        <div class="option-group">
            <label class="option-label" for="transaction-execution-select">Tx execution:</label>
            <select
                bind:value={$sharedTransactionExecution}
                class="select-input {$sharedTransactionExecution === TransactionExecution.Send
                    ? 'send-mode'
                    : ''}"
                id="transaction-execution-select"
            >
                {#each Object.values(TransactionExecution) as signer}
                    <option value={signer}>{signer}</option>
                {/each}
            </select>
        </div>
    {/if}
</div>

<WalletSelectorModal
    isOpen={showWalletSelector}
    onClose={closeWalletSelector}
    onWalletSelected={() => {}}
/>

<style>
    .options-container {
        display: inline-flex;
        gap: 0.5rem;
        align-items: center;
    }

    .option-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .option-label {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        white-space: nowrap;
    }

    .select-input {
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        height: 32px;
    }

    .connect-btn {
        padding: 0.4rem 0.8rem;
        border: 1px solid transparent;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        background: rgba(55, 65, 81, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
    }

    .connect-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
    }

    .external-address-input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 32px;
        width: 35rem;
    }

    .external-address-input-small {
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        font-weight: 400;
        width: 100%;
        transition: all 0.2s ease;
        height: 100%;
    }

    .external-address-input-small:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .remove-btn-small {
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.6);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .remove-btn-small:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
    }

    .select-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .select-input:hover {
        border-color: rgba(156, 163, 175, 0.3);
        background: rgba(55, 65, 81, 0.5);
    }

    .select-input.send-mode {
        background: rgba(177, 30, 30, 0.4);
        border-color: rgba(220, 38, 38, 0.3);
    }

    .select-input.send-mode:focus {
        background: rgba(177, 30, 30, 0.4);
        border-color: #bc2121;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15);
    }

    .select-input.send-mode:hover {
        background: rgba(220, 38, 38, 0.5);
        border-color: rgba(220, 38, 38, 0.4);
    }

    .select-input option {
        background: rgb(31, 41, 55);
        color: rgba(255, 255, 255, 0.9);
        padding: 0.3rem;
    }

    @media (max-width: 768px) {
        .options-container {
            display: flex;
            width: 100%;
            max-width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0;
            align-items: center;
            margin-top: 0;
        }

        .option-group {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
        }

        .option-label {
            white-space: normal;
        }

        .select-input {
            width: auto;
            min-width: 0;
            max-width: 100vw;
        }

        .external-address-input-wrapper {
            width: min(35rem, calc(100vw - 4rem));
        }

        .external-address-input-small {
            max-width: 100%;
        }
    }
</style>

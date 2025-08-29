<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount } from 'svelte';

    import { sharedSignerType, SignerType } from './lib/local-storage-store';
    import { addressFromQuery, QUERY_PARAM_KEYS, setQueryParam } from './lib/query-param-store';
    import {
        activeAddress,
        addOrUpdateExternalAddress,
        getExternalAddresses,
        getSelectedExternalAddress,
        iota_accounts,
        iota_wallets,
        removeExternalAddress,
        selectExternalAddress,
        updateSelectedSignerAccounts,
    } from './lib/signer-data';
    import { connectWallet } from './lib/web-wallet';

    let externalAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
    let externalAlias = '';
    let isAddressValid = false;

    onMount(() => {
        // Initialize external address from query parameter if provided
        const addressFromURL = $addressFromQuery;
        if (addressFromURL && isValidIotaAddress(addressFromURL)) {
            externalAddress = addressFromURL;
        } else {
            // Load selected external address from storage
            const selectedAddress = getSelectedExternalAddress();
            if (selectedAddress) {
                externalAddress = selectedAddress;
                // Find alias for this address
                const storedAddresses = getExternalAddresses();
                const found = storedAddresses.find((addr) => addr.address === selectedAddress);
                if (found?.alias) {
                    externalAlias = found.alias;
                }
            }
        }

        updateSelectedSignerAccounts(externalAddress);
    });

    // Function to handle signer type changes
    function handleSignerChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const selectedSigner = target.value as SignerType;

        // Update the local storage
        sharedSignerType.set(selectedSigner);

        // Update query parameter
        setQueryParam(QUERY_PARAM_KEYS.SIGNER, selectedSigner);

        // If switching away from ExternalAddress, remove the externalAddress parameter
        if (selectedSigner !== SignerType.ExternalAddress) {
            setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
        }

        // Update accounts - for ExternalAddress, let it load stored addresses
        if (selectedSigner === SignerType.ExternalAddress) {
            updateSelectedSignerAccounts(); // Don't force the current input value
        } else {
            updateSelectedSignerAccounts(externalAddress);
        }
    }

    // Function to handle external address changes
    function handleExternalAddressChange() {
        // Only update query parameter if ExternalAddress signer is selected
        if ($sharedSignerType === SignerType.ExternalAddress) {
            if (isValidIotaAddress(externalAddress)) {
                // Update query parameter but don't update accounts yet (wait for user to save)
                setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, externalAddress);
            } else {
                // Clear query parameter if address is invalid
                setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
            }
        }
    }

    // Function to handle adding/updating external address
    function handleAddUpdateExternalAddress() {
        if (isValidIotaAddress(externalAddress)) {
            addOrUpdateExternalAddress(externalAddress, externalAlias || undefined);
            // The addOrUpdateExternalAddress function will automatically update accounts
            // Update query parameter
            setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, externalAddress);
        }
    }

    // Function to handle removing external address
    function handleRemoveExternalAddress() {
        if (externalAddress) {
            removeExternalAddress(externalAddress);
            // The removeExternalAddress function will automatically update accounts
            // Reset to default or first available address
            const remainingAddresses = getExternalAddresses();
            if (remainingAddresses.length > 0) {
                externalAddress = remainingAddresses[0].address;
                externalAlias = remainingAddresses[0].alias || '';
            } else {
                externalAddress =
                    '0x0000000000000000000000000000000000000000000000000000000000000000';
                externalAlias = '';
            }
            // Update query parameter
            setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, externalAddress);
        }
    }

    // Function to handle address selection from dropdown
    function handleAddressSelection() {
        if ($sharedSignerType === SignerType.ExternalAddress && $activeAddress) {
            // Update the input fields to match the selected address
            externalAddress = $activeAddress;
            // Find alias for this address
            const storedAddresses = getExternalAddresses();
            const found = storedAddresses.find((addr) => addr.address === $activeAddress);
            externalAlias = found?.alias || '';

            // Update the selected address in storage
            selectExternalAddress($activeAddress);
            // Update query parameter
            setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, $activeAddress);
        }
    }

    $: isAddressValid = (() => {
        return isValidIotaAddress(externalAddress);
    })();

    // Format option text with proper alignment
    function formatOptionText(account: any): string {
        const label = account.label || 'Account';
        const addressSnippet = `${account.address.slice(0, 8)}...${account.address.slice(-6)}`;

        // Use a more reliable approach: truncate long labels and pad consistently
        const maxDisplayLength = 20; // Maximum characters to show for label
        const truncatedLabel =
            label.length > maxDisplayLength ? label.slice(0, maxDisplayLength - 1) + '…' : label;

        // Pad to a consistent width using non-breaking spaces
        const paddedLabel = truncatedLabel.padEnd(maxDisplayLength + 1, '\u00A0');

        return `${paddedLabel}${addressSnippet}`;
    }
</script>

<main>
    <div class="signer-container">
        <div class="signer-controls">
            <div class="control-row">
                <div class="control-group">
                    <div class="control-inline">
                        <label class="control-label" for="signer-select">Signer:</label>
                        <select
                            bind:value={$sharedSignerType}
                            onchange={handleSignerChange}
                            class="select-input"
                            id="signer-select"
                        >
                            {#each Object.values(SignerType) as signer}
                                <option value={signer}>{signer}</option>
                            {/each}
                        </select>
                        {#if $sharedSignerType == SignerType.WebWallet && $iota_accounts.length == 0}
                            <button onclick={() => connectWallet(false)} class="connect-btn">
                                Connect
                            </button>
                        {/if}
                        {#if $sharedSignerType == SignerType.ExternalAddress}
                            <div class="external-address-wrapper">
                                <div class="external-address-row">
                                    <input
                                        type="text"
                                        class="external-address-input"
                                        class:invalid-address={externalAddress && !isAddressValid}
                                        bind:value={externalAddress}
                                        oninput={handleExternalAddressChange}
                                        placeholder="Paste or type any address (read-only)"
                                    />
                                    <input
                                        type="text"
                                        class="alias-input"
                                        bind:value={externalAlias}
                                        placeholder="Alias (optional)"
                                    />
                                    <button
                                        class="add-update-btn"
                                        disabled={!isAddressValid}
                                        onclick={handleAddUpdateExternalAddress}>Save</button
                                    >
                                    <button
                                        class="remove-btn"
                                        onclick={handleRemoveExternalAddress}
                                        title="Remove current external address">✕</button
                                    >
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="control-group">
                    <div class="control-inline">
                        <label class="control-label" for="address-select">Address:</label>
                        <div class="address-group">
                            <select
                                bind:value={$activeAddress}
                                onchange={handleAddressSelection}
                                class="address-select"
                                id="address-select"
                            >
                                {#each $iota_accounts as account}
                                    <option value={account.address}>
                                        {formatOptionText(account)}
                                    </option>
                                {/each}
                            </select>
                            <span
                                style="font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace; font-size: 0.8em;"
                            >
                                {$activeAddress}
                            </span>
                            <button
                                onclick={() => {
                                    navigator.clipboard.writeText($activeAddress);
                                }}
                                class="copy-btn"
                                title="Copy active address"
                            >
                                📋
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .signer-container {
        background: rgba(31, 41, 55, 0.6);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(156, 163, 175, 0.15);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }

    .signer-container:hover {
        border-color: rgba(156, 163, 175, 0.25);
    }

    .signer-controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .control-inline {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .control-label {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        white-space: nowrap;
        min-width: fit-content;
    }

    .select-input,
    .address-select {
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(3px);
    }

    .select-input:focus,
    .address-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .select-input:hover,
    .address-select:hover {
        border-color: rgba(156, 163, 175, 0.3);
        background: rgba(55, 65, 81, 0.5);
    }

    .select-input option,
    .address-select option {
        background: rgb(31, 41, 55);
        color: rgba(255, 255, 255, 0.9);
        padding: 0.3rem;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        font-size: 0.75rem;
    }

    .address-group {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        word-break: break-all;
        overflow-wrap: anywhere;
    }

    .address-select {
        flex: 1;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        font-size: 0.75rem;
        min-width: 160px;
    }

    .connect-btn,
    .copy-btn {
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
        padding: 0.4rem 0.6rem;
        min-width: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .connect-btn:hover,
    .copy-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
    }

    .copy-btn:hover {
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
    }

    .external-address-input {
        width: 37rem;
        max-width: 100%;
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        font-weight: 400;
        transition: all 0.2s ease;
        backdrop-filter: blur(3px);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
    }

    .external-address-wrapper {
        width: 100%;
    }
    .external-address-row {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .alias-input {
        padding: 0.35rem 0.5rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.75rem;
        min-width: 12rem;
    }

    .remove-btn {
        padding: 0.35rem 0.55rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.6);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        line-height: 1;
    }

    .remove-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
    }

    .add-update-btn {
        padding: 0.35rem 0.55rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.6);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        line-height: 1;
    }
    .add-update-btn:hover:not([disabled]) {
        background: rgba(16, 185, 129, 0.25);
        border-color: rgba(16, 185, 129, 0.45);
    }
    .add-update-btn[disabled] {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .external-address-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .external-address-input:hover {
        border-color: rgba(156, 163, 175, 0.3);
        background: rgba(55, 65, 81, 0.5);
    }

    .invalid-address {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.1) !important;
    }

    .invalid-address:focus {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
    }

    @media (max-width: 768px) {
        .control-row {
            flex-direction: column;
            gap: 0.5rem;
            align-items: stretch;
        }

        .control-inline {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }

        .control-group {
            width: 100%;
        }

        .address-group {
            flex-direction: row;
            width: 100%;
        }

        .address-select {
            min-width: 10rem;
            flex: 1;
        }

        .copy-btn {
            min-width: auto;
            padding: 0.4rem 0.8rem;
        }
    }
</style>

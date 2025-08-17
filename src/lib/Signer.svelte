<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount } from 'svelte';

    import { sharedSignerType, SignerType } from './lib/local-storage-store';
    import {
        activeAddress,
        iota_accounts,
        iota_wallets,
        updateSelectedSignerAccounts,
    } from './lib/signer-data';
    import { connectWallet } from './lib/web-wallet';

    let foreignAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';

    onMount(() => {
        updateSelectedSignerAccounts();
    });

    $: isAddressValid = (() => {
        return isValidIotaAddress(foreignAddress);
    })();
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
                            onchange={() => updateSelectedSignerAccounts(foreignAddress)}
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
                        {#if $sharedSignerType == SignerType.ForeignAddress}
                            <input
                                type="string"
                                class="foreign-address-input"
                                class:invalid-address={!isAddressValid}
                                bind:value={foreignAddress}
                                oninput={() => {
                                    console.log(
                                        'Input changed:',
                                        foreignAddress,
                                        'Valid:',
                                        isValidIotaAddress(foreignAddress),
                                    );
                                    if (isValidIotaAddress(foreignAddress)) {
                                        updateSelectedSignerAccounts(foreignAddress);
                                    }
                                }}
                                placeholder="any address, can't be used for signing"
                            />
                        {/if}
                    </div>
                </div>

                <div class="control-group">
                    <div class="control-inline">
                        <label class="control-label" for="address-select">Address:</label>
                        <div class="address-group">
                            <select
                                bind:value={$activeAddress}
                                class="address-select"
                                id="address-select"
                            >
                                {#each $iota_accounts as account}
                                    <option value={account.address}>
                                        {(account.label || 'Account').padEnd(15, '\u00A0')}
                                        {account.address.slice(0, 8)}...{account.address.slice(-6)}
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
        min-width: 120px;
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

    .foreign-address-input {
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

    .foreign-address-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .foreign-address-input:hover {
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

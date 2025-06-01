<script lang="ts">
    import { sharedSignerType, SignerType } from './lib/local-storage-store';
    import {
        activeAddress,
        iota_accounts,
        iota_wallets,
        updateSelectedSignerAccounts,
    } from './lib/signer-data';
    import { connectWallet } from './lib/web-wallet';

    // Init the first time if localstorage is selected
    updateSelectedSignerAccounts();
</script>

<main>
    <p>
        Signer:
        <select bind:value={$sharedSignerType} onchange={() => updateSelectedSignerAccounts()}>
            {#each Object.values(SignerType) as signer}
                <option value={signer}>{signer}</option>
            {/each}
        </select>
        {#if $sharedSignerType == SignerType.WebWallet && $iota_wallets.length == 0}
            <button onclick={() => connectWallet()}> Connect wallet </button>
        {/if}

        <select bind:value={$activeAddress}>
            {#each $iota_accounts as account}
                <option value={account.address} style="font-family: monospace;">
                    {account.address}
                    {account.label}
                </option>
            {/each}
        </select>
        <button
            onclick={() => {
                navigator.clipboard.writeText($activeAddress);
            }}>Copy active address</button
        >
    </p>
</main>

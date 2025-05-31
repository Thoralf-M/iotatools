<script lang="ts">
    import { PrivateKeyWallet, toWalletAccounts } from './lib/default-private-keys';
    import {
        sharedPrivateKeyAccounts,
        sharedSignerType,
        SignerType,
    } from './lib/local-storage-store';
    import { activeAddress, iota_accounts, iota_wallets } from './lib/signer-data';
    import { connectWallet } from './lib/web-wallet';

    function setSigningWithPrivateKeyAccounts() {
        // @ts-ignore
        $iota_wallets[0] = new PrivateKeyWallet();
        $iota_accounts = toWalletAccounts($sharedPrivateKeyAccounts);
        $activeAddress = Object.keys($sharedPrivateKeyAccounts.accounts)[0];
    }

    function updateSelectedSignerAccounts() {
        if ($sharedSignerType == SignerType.Localstorage) {
            setSigningWithPrivateKeyAccounts();
        }
        if ($sharedSignerType == SignerType.WebWallet) {
            connectWallet();
        }
    }

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
                <option value={account.address}>
                    {account.address}
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

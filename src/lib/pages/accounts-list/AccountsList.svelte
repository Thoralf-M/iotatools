<script lang="ts">
    import { toHex } from '../../utils/wasm-sdk';

    import { iota_accounts } from '../../utils/signer-data';
</script>

<main>
    <div class="wallet-accounts-container">
        <h2>Connected Wallet Accounts</h2>
        {#if $iota_accounts.length === 0}
            <p>No accounts connected.</p>
        {:else}
            <table class="accounts-table">
                <tbody>
                    {#each $iota_accounts as account}
                        <tr class="account-block">
                            <td class="account-label" rowspan="2">
                                <span class="account-label-text">{account.label || 'Account'}</span>
                            </td>
                            <td class="account-key">Address:</td>
                            <td class="account-value">{account.address}</td>
                        </tr>
                        <tr class="account-block public-key-row">
                            <td class="account-key">Public Key:</td>
                            <td class="account-value"
                                >{'0x' + toHex(new Uint8Array(account.publicKey))}</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</main>

<style>
    .wallet-accounts-container {
        background: rgba(31, 41, 55, 0.6);
        border-radius: 8px;
        padding: 1rem 1.5rem;
    }

    .wallet-accounts-container h2 {
        color: #fff;
        font-size: 1.3rem;
    }

    .accounts-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 6px;
        margin: 0 auto;
    }

    .accounts-table td {
        border-bottom: 1px solid #222;
    }

    .account-label {
        font-weight: 600;
        color: #a5b4fc;
        font-size: 1.05em;
        min-width: 160px;
        text-align: right;
        padding-right: 1.2em;
    }

    .account-key {
        color: #38bdf8;
        font-weight: 500;
        text-align: right;
        padding-right: 0.7em;
    }

    .account-value {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        font-size: 1em;
        word-break: break-all;
        color: #fff;
        text-align: left;
    }

    .public-key-row {
        border-bottom: 3px solid #5778a1;
    }

    .public-key-row td {
        background: #263147;
    }

    @media (max-width: 900px) {
        .wallet-accounts-container {
            padding: 0.5rem 0.2rem;
            max-width: 100%;
        }
        .accounts-table td {
            padding: 0.5rem 0.2rem;
            font-size: 0.95rem;
        }
        .account-label,
        .account-key {
            min-width: 80px;
            padding-right: 0.5em;
        }
    }
</style>

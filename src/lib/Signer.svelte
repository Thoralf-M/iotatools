<script lang="ts">
    import { decodeIotaPrivateKey, Keypair } from '@iota/iota-sdk/cryptography';
    import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';
    import { Secp256k1Keypair } from '@iota/iota-sdk/keypairs/secp256k1';
    import { Secp256r1Keypair } from '@iota/iota-sdk/keypairs/secp256r1';
    import { onMount } from 'svelte';

    import { getClient } from './lib/client';
    import { activeAddress, iota_accounts, iota_wallets } from './SignerData.svelte';
    import WebWallet from './WebWallet.svelte';

    class PrivateKeyAccount {
        privKey: string;
        address: string;

        constructor(privKey: string) {
            const keypair = keypairFromBech32PrivateKey(privKey);
            const address = keypair.toIotaAddress();
            this.privKey = privKey;
            this.address = address;
        }

        async signAndExecuteTransaction(params: any) {
            const keypair = keypairFromBech32PrivateKey(this.privKey);
            let client = await getClient();
            return client.signAndExecuteTransaction({
                transaction: params.transaction,
                signer: keypair,
                options: params.options,
            });
        }
    }

    enum Signer {
        WebWallet = 'WebWallet',
        Localstorage = 'Localstorage',
    }
    let initialSelectedSigner =
        (localStorage.getItem('selectedSigner')! as Signer) || Signer.WebWallet;
    let selectedSigner: Signer = $state(initialSelectedSigner);
    function updateSelectedSignerAccounts() {
        localStorage.setItem('selectedSigner', selectedSigner);
        if (selectedSigner == Signer.Localstorage) {
            updateAccountsWithPrivateKeys(privateKeys);
        } else {
            $iota_accounts = [];
            $activeAddress = '';
        }
    }

    let webWalletComponent: WebWallet;
    let connectWallet: any;
    onMount(function () {
        connectWallet = function () {
            webWalletComponent.connectWallet();
        };
    });

    interface PrivateKeys {
        selected: string;
        bech32PrivateKeys: string[];
    }

    let privateKeys: PrivateKeys = JSON.parse(localStorage.getItem('privateKeys')!) || {
        selected: 'iotaprivkey1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgfjx8t',
        bech32PrivateKeys: [
            'iotaprivkey1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgfjx8t',
        ],
    };
    // Init the first time if localstorage is selected
    if (initialSelectedSigner == Signer.Localstorage) {
        updateAccountsWithPrivateKeys(privateKeys);
    }

    let jsonPrivateKeysString = $state(JSON.stringify(privateKeys, null, 2));
    function handlePrivateKeysChange() {
        try {
            privateKeys = JSON.parse(jsonPrivateKeysString);
            if (
                !privateKeys.hasOwnProperty('selected') ||
                !privateKeys.hasOwnProperty('bech32PrivateKeys')
            ) {
                alert(`Missing "selected" or "bech32PrivateKeys" keys`);
            } else {
                updateAccountsWithPrivateKeys(privateKeys);
                localStorage.setItem('privateKeys', JSON.stringify(privateKeys));
                jsonPrivateKeysString = JSON.stringify(privateKeys, null, 2);
            }
        } catch (e) {
            console.error('Invalid JSON', e);
        }
    }
    function updateAccountsWithPrivateKeys(privateKeys: PrivateKeys) {
        $iota_accounts = [];
        for (let privKey of privateKeys.bech32PrivateKeys) {
            // @ts-ignore
            $iota_accounts.push(new PrivateKeyAccount(privKey));
        }

        if ($iota_accounts.length == 0) {
            return;
        }
        if (typeof privateKeys.selected == 'undefined' || privateKeys.selected == '') {
            if ($activeAddress.length != 66) {
                // @ts-ignore
                privateKeys.selected = $iota_accounts[0].privKey;
            } else {
                privateKeys.selected = $iota_accounts.find(
                    (a) => a.address == $activeAddress,
                    // @ts-ignore
                )!.privKey;
            }
        } else {
            // Update selected private key if the selected one was removed
            let exists = $iota_accounts.find(
                // @ts-ignore
                (a) => a.privKey == privateKeys.selected,
            );
            if (typeof exists == 'undefined') {
                // @ts-ignore
                privateKeys.selected = $iota_accounts[0].privKey;
            }
        }
        $activeAddress = keypairFromBech32PrivateKey(privateKeys.selected).toIotaAddress();
        // This is a hack to get the signer working with the same interface as the web wallet, should be refactored
        // @ts-ignore
        $iota_wallets[0] = new PrivateKeyAccount(privateKeys.selected);
    }

    function keypairFromBech32PrivateKey(bech32privateKey: string): Keypair {
        const decoded = decodeIotaPrivateKey(bech32privateKey);
        const schema = decoded.schema;
        const secretKey = decoded.secretKey;
        switch (schema) {
            case 'ED25519':
                return Ed25519Keypair.fromSecretKey(secretKey);
            case 'Secp256k1':
                return Secp256k1Keypair.fromSecretKey(secretKey);
            case 'Secp256r1':
                return Secp256r1Keypair.fromSecretKey(secretKey);
            default:
                throw new Error(`Invalid keypair schema ${schema}`);
        }
    }
</script>

<WebWallet bind:this={webWalletComponent} />

<main>
    <p>
        Signer:
        <select bind:value={selectedSigner} onchange={() => updateSelectedSignerAccounts()}>
            {#each Object.values(Signer) as signer}
                <option value={signer}>{signer}</option>
            {/each}
        </select>
        {#if selectedSigner == Signer.WebWallet}
            <button onclick={() => connectWallet()}> Connect wallet </button>
        {/if}

        <select
            bind:value={$activeAddress}
            onchange={() => {
                activeAddress.set($activeAddress);
                if (selectedSigner == Signer.Localstorage) {
                    privateKeys.selected = $iota_accounts.find(
                        (a) => a.address == $activeAddress,
                        // @ts-ignore
                    )!.privKey;
                    // This is a hack to get the signer working with the same interface as the web wallet, should be refactored
                    // @ts-ignore
                    $iota_wallets[0] = new PrivateKeyAccount(privateKeys.selected);
                    localStorage.setItem('privateKeys', JSON.stringify(privateKeys));
                    jsonPrivateKeysString = JSON.stringify(privateKeys, null, 2);
                }
            }}
        >
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

    {#if selectedSigner == Signer.Localstorage}
        <textarea
            bind:value={jsonPrivateKeysString}
            oninput={handlePrivateKeysChange}
            rows="8"
            cols="100"
        ></textarea>
    {/if}
</main>

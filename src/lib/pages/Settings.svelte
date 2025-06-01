<script lang="ts">
    import JsonStoreEditor from '../components/JsonStoreEditor.svelte';
    import { defaultClientConfig } from '../lib/default-client-config';
    import {
        defaultPrivateKeyAccounts,
        keypairFromBech32PrivateKey,
        type PrivateKeyAccounts,
    } from '../lib/default-private-keys';
    import {
        clientConfigErrorMsg,
        privateKeysErrorMsg,
        sharedClientConfig,
        sharedPrivateKeyAccounts,
    } from '../lib/local-storage-store';

    let newBech32PrivateKey = $state('');
    let error = $state('');
</script>

<main>
    Data is stored in your browser's local storage.
    <JsonStoreEditor
        store={sharedClientConfig}
        defaultValue={defaultClientConfig}
        errorStore={clientConfigErrorMsg}
        label="Client config"
    />

    <button
        onclick={() => {
            sharedPrivateKeyAccounts.update((privateKeys: PrivateKeyAccounts) => {
                try {
                    const address =
                        keypairFromBech32PrivateKey(newBech32PrivateKey).toIotaAddress();
                    error = '';
                    return {
                        ...privateKeys, // keep all other keys
                        accounts: {
                            ...privateKeys.accounts,
                            [address]: { bech32PrivateKey: newBech32PrivateKey, address },
                        },
                    };
                } catch (e: any) {
                    error = `Invalid private key: ${e.message}`;
                    return privateKeys; // return unchanged if error
                }
            });
            newBech32PrivateKey = '';
        }}>Add private key:</button
    >
    <input type="text" placeholder="iotaprivkey1..." size="75" bind:value={newBech32PrivateKey} />
    {error}
    <JsonStoreEditor
        store={sharedPrivateKeyAccounts}
        defaultValue={defaultPrivateKeyAccounts}
        errorStore={privateKeysErrorMsg}
        label="Private keys"
    />
</main>

<script lang="ts">
    import JsonStoreEditor from '../../components/JsonStoreEditor.svelte';
    import { defaultClientConfig } from '../../utils/default-client-config';
    import {
        defaultPrivateKeyAccounts,
        deriveAddressFromKeypair,
        keypairFromBech32PrivateKey,
        type PrivateKeyAccounts,
    } from '../../utils/default-private-keys';
    import {
        clientConfigErrorMsg,
        privateKeysErrorMsg,
        sharedClientConfig,
        sharedPrivateKeyAccounts,
    } from '../../utils/local-storage-store';
    import { updateSelectedSignerAccounts } from '../../utils/signer-data';

    let newBech32PrivateKey = $state('');
    let error = $state('');
</script>

<main>
    Data is stored in your browser's local storage and can be deleted at any time.

    <div style="flex-direction: column; display: flex; gap: 1rem;">
        <details style=" margin: 1rem;">
            <summary style="float:left;">{'Client config'}:</summary>
            <JsonStoreEditor
                store={sharedClientConfig}
                defaultValue={defaultClientConfig}
                errorStore={clientConfigErrorMsg}
                label="Client config"
            />
        </details>

        <details style=" margin: 1rem;">
            <summary style="float:left;">{'Private keys'}:</summary>
            <button
                onclick={() => {
                    sharedPrivateKeyAccounts.update((privateKeys: PrivateKeyAccounts) => {
                        try {
                            const address = deriveAddressFromKeypair(
                                keypairFromBech32PrivateKey(newBech32PrivateKey),
                            );
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
                    updateSelectedSignerAccounts();
                    newBech32PrivateKey = '';
                }}>Add private key:</button
            >
            <input
                type="text"
                placeholder="iotaprivkey1..."
                size="75"
                bind:value={newBech32PrivateKey}
            />
            {error}
            <JsonStoreEditor
                store={sharedPrivateKeyAccounts}
                defaultValue={defaultPrivateKeyAccounts}
                errorStore={privateKeysErrorMsg}
                label="Private keys"
                onChangeFn={() => updateSelectedSignerAccounts()}
            />
        </details>
    </div>
</main>

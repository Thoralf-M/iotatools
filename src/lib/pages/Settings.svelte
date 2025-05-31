<script lang="ts">
    import JsonStoreEditor from '../components/JsonStoreEditor.svelte';
    import { sharedClientConfig, clientConfigErrorMsg, sharedPrivateKeys, privateKeysErrorMsg } from '../lib/local-storage-store';
    import { defaultClientConfig } from '../lib/default-client-config';
    import { defaultPrivateKeys } from '../lib/default-private-keys';
</script>

<main>
    <JsonStoreEditor
        store={sharedClientConfig}
        defaultValue={defaultClientConfig}
        errorStore={clientConfigErrorMsg}
        label="Client config"
    />
    <JsonStoreEditor
        store={sharedPrivateKeys}
        defaultValue={defaultPrivateKeys}
        errorStore={privateKeysErrorMsg}
        label="Private keys"
    />
</main>

<script lang="ts">
    import JsonStoreEditor from '../components/JsonStoreEditor.svelte';
    import { defaultClientConfig } from '../lib/default-client-config';
    import { defaultPrivateKeyAccounts } from '../lib/default-private-keys';
    import {
        clientConfigErrorMsg,
        privateKeysErrorMsg,
        sharedClientConfig,
        sharedPrivateKeyAccounts,
    } from '../lib/local-storage-store';
</script>

<main>
    <JsonStoreEditor
        store={sharedClientConfig}
        defaultValue={defaultClientConfig}
        errorStore={clientConfigErrorMsg}
        label="Client config"
    />
    <JsonStoreEditor
        store={sharedPrivateKeyAccounts}
        defaultValue={defaultPrivateKeyAccounts}
        errorStore={privateKeysErrorMsg}
        label="Private keys"
    />
</main>

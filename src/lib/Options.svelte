<script lang="ts">
    import { sharedClientConfig } from './lib/local-storage-store';
    import { sharedTransactionExecution, TransactionExecution } from './lib/shared-in-memory';
</script>

<main>
    Network: <select bind:value={$sharedClientConfig.selected}>
        {#each $sharedClientConfig.networks as network}
            <option value={network.name}>{network.name}</option>
        {/each}
    </select>
    Transaction execution:
    <select bind:value={$sharedTransactionExecution}>
        {#each Object.values(TransactionExecution) as signer}
            <option value={signer}>{signer}</option>
        {/each}
    </select>
</main>

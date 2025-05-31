<script lang="ts">
    import { sharedClientConfig } from './lib/local-storage-store';
</script>

<main>
    Network: <select bind:value={$sharedClientConfig.selected}>
        {#each $sharedClientConfig.networks as network}
            <option value={network.name}>{network.name}</option>
        {/each}
    </select>
</main>

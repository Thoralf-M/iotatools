<script lang="ts">
    import { sharedClientConfig } from './lib/localStorageStore';
</script>

<main>
    Network: <select bind:value={$sharedClientConfig.selected}>
        {#each $sharedClientConfig.networks as network}
            <option value={network.name}>{network.name}</option>
        {/each}
    </select>
</main>

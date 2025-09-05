<script lang="ts">
    import { onMount } from 'svelte';

    import { sharedClientConfig } from './lib/local-storage-store';
    import {
        initQueryParamHandling,
        QUERY_PARAM_KEYS,
        queryAwareClientConfig,
        setQueryParam,
    } from './lib/query-param-store';
    import { sharedTransactionExecution, TransactionExecution } from './lib/shared-in-memory';

    // Initialize query parameter handling
    onMount(() => {
        initQueryParamHandling();
    });

    // Use query-aware config that responds to URL parameters
    let clientConfig = queryAwareClientConfig;

    // Function to handle network selection changes
    function handleNetworkChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const selectedNetwork = target.value;

        // Update the local storage config
        sharedClientConfig.update((config) => ({
            ...config,
            selected: selectedNetwork,
        }));

        // Also update the URL query parameter
        setQueryParam(QUERY_PARAM_KEYS.NETWORK, selectedNetwork);
    }
</script>

<main>
    <div class="options-container">
        <div class="option-group">
            <label class="option-label" for="network-select">Network:</label>
            <select
                value={$clientConfig.selected}
                on:change={handleNetworkChange}
                class="select-input"
                id="network-select"
            >
                {#each $clientConfig.networks as network}
                    <option value={network.name}>{network.name}</option>
                {/each}
            </select>
        </div>

        <div class="option-group">
            <label class="option-label" for="transaction-execution-select"
                >Transaction execution:</label
            >
            <select
                bind:value={$sharedTransactionExecution}
                class="select-input {$sharedTransactionExecution === TransactionExecution.Send
                    ? 'send-mode'
                    : ''}"
                id="transaction-execution-select"
            >
                {#each Object.values(TransactionExecution) as signer}
                    <option value={signer}>{signer}</option>
                {/each}
            </select>
        </div>
    </div>
</main>

<style>
    .options-container {
        display: inline-flex;
        gap: 1rem;
        align-items: center;
        margin-top: -1rem;
    }

    .option-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .option-label {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        white-space: nowrap;
    }

    .select-input {
        padding: 0.4rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(3px);
        min-width: 120px;
    }

    .select-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        background: rgba(55, 65, 81, 0.6);
    }

    .select-input:hover {
        border-color: rgba(156, 163, 175, 0.3);
        background: rgba(55, 65, 81, 0.5);
    }

    .select-input.send-mode {
        background: rgba(177, 30, 30, 0.4);
        border-color: rgba(220, 38, 38, 0.3);
    }

    .select-input.send-mode:focus {
        background: rgba(177, 30, 30, 0.4);
        border-color: #bc2121;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15);
    }

    .select-input.send-mode:hover {
        background: rgba(220, 38, 38, 0.5);
        border-color: rgba(220, 38, 38, 0.4);
    }

    .select-input option {
        background: rgb(31, 41, 55);
        color: rgba(255, 255, 255, 0.9);
        padding: 0.3rem;
    }

    @media (max-width: 768px) {
        .options-container {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
            align-items: stretch;
        }

        .option-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }

        .select-input {
            width: 100%;
            min-width: unset;
        }
    }
</style>

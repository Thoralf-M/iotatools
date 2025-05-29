<script lang="ts">
    import { get } from 'svelte/store';

    import { defaultClientConfig } from '../lib/defaultClientConfig';
    import JsonToggleView from '../lib/JsonToggleView.svelte';
    import { clientConfigErrorMsg, sharedClientConfig } from '../lib/localStorageStore';

    let jsonText = $state(JSON.stringify(get(sharedClientConfig), null, 2));

    // Watch store and update jsonText if it changes externally
    sharedClientConfig.subscribe((value) => {
        jsonText = JSON.stringify(value, null, 2);
    });

    function handleChange(event: Event) {
        try {
            // @ts-ignore
            const parsed = JSON.parse(event.target.value);
            sharedClientConfig.set(parsed);
        } catch (e) {
            // @ts-ignore
            $clientConfigErrorMsg = e.message;
        }
    }
</script>

<main>
    <button
        onclick={() => {
            $sharedClientConfig = defaultClientConfig;
        }}>Reset networks</button
    >
    <br />
    <span style="float:left"> Client config: </span>
    <textarea
        bind:value={jsonText}
        oninput={handleChange}
        rows="10"
        cols="170"
        class:error={$clientConfigErrorMsg}
    ></textarea>
    {#if $clientConfigErrorMsg}
        <div style="color: red;">{$clientConfigErrorMsg}</div>
    {/if}
    <JsonToggleView value={$sharedClientConfig} />
</main>

<style>
    textarea {
        border: 1px solid #cccccc;
    }
    textarea.error {
        border-color: #ff0000;
    }
    textarea.error:focus {
        outline: #ff0000 solid 1px;
        border-radius: 4px;
    }
</style>

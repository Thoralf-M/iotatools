<script lang="ts">
    import { get, type Writable } from 'svelte/store';

    export let store: Writable<any>;
    export let defaultValue;
    export let errorStore: Writable<string>;
    export let label = 'Config';

    let jsonText = JSON.stringify(get(store), null, 2);

    // Watch store and update jsonText if it changes externally
    store.subscribe((value) => {
        jsonText = JSON.stringify(value, null, 2);
    });

    function handleChange(event: Event) {
        try {
            // @ts-ignore
            const parsed = JSON.parse(event.target.value);
            store.set(parsed);
        } catch (e: any) {
            if (errorStore) errorStore.set(e.message);
        }
    }
</script>

<div>
    <span style="float:left">{label}:</span>
    <textarea
        bind:value={jsonText}
        on:input={handleChange}
        rows="10"
        cols="170"
        class:error={errorStore && $errorStore}
    ></textarea>
    {#if errorStore && $errorStore}
        <div style="color: red;">{$errorStore}</div>
    {/if}
    <button on:click={() => store.set(defaultValue)}>Reset</button>
</div>

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

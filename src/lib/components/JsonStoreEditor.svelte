<script lang="ts">
    import { get, type Writable } from 'svelte/store';

    export let store: Writable<any>;
    export let defaultValue;
    export let errorStore: Writable<string>;
    export let label = '';
    export let onChangeFn: (value: any) => void = () => {};

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
    <textarea
        bind:value={jsonText}
        oninput={handleChange}
        onchange={onChangeFn}
        rows="10"
        style="width: 100%"
        class:error={errorStore && $errorStore}></textarea>
    {#if errorStore && $errorStore}
        <div style="color: red;">{$errorStore}</div>
    {/if}
    <button onclick={() => store.set(defaultValue)}>Reset {label}</button>
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

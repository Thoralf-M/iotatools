<script lang="ts">
    import JSONTree from '@sveltejs/svelte-json-tree';

    export let value: any = {};
    let showJsonTree = true;
</script>

<div class="value" hidden={Object.keys(value).length == 0}>
    <button on:click={() => (showJsonTree = !showJsonTree)}> toggle JSON tree </button>
    <div hidden={!showJsonTree}>
        <JSONTree {value} />
    </div>
    <pre hidden={showJsonTree}>{JSON.stringify(value, null, 2)}</pre>
</div>

<style>
    .value,
    pre {
        text-align: left;
    }
    button {
        margin: 0.5rem;
    }
</style>

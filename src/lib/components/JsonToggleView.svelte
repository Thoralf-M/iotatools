<script lang="ts">
    // @ts-ignore - Module resolution issue with svelte-json-tree
    import JSONTree from '@sveltejs/svelte-json-tree';

    import { formatJsonWithCompactArrays } from '../components/transaction-view';

    export let value: any = {};
    let showJsonTree = false;
</script>

<div class="value" hidden={Object.keys(value).length == 0}>
    <button on:click={() => (showJsonTree = !showJsonTree)}> toggle JSON tree </button>
    <div hidden={!showJsonTree}>
        <JSONTree {value} defaultExpandedLevel={1} />
    </div>
    <pre hidden={showJsonTree}>{formatJsonWithCompactArrays(value)}</pre>
</div>

<style>
    .value,
    pre {
        text-align: left;
        word-break: break-all;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }
    button {
        margin: 0.5rem;
    }
</style>

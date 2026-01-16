<script lang="ts">
    import { onMount } from 'svelte';
    import { location } from 'svelte-spa-router';

    import { navigateWithGlobalParams } from '../utils/query-param-store';

    export let items: any[] = [];

    // Get unique groups from items
    $: groups = Array.from(new Set(items.map((item) => item.group)));

    // Track loaded tab components
    let loadedTabs: Record<string, any> = {};

    // Map route to dynamic import function
    export let tabComponents: Record<string, () => Promise<any>> = {};

    // Load tab component if not loaded
    async function loadTab(route: string) {
        if (!loadedTabs[route] && tabComponents[route]) {
            const mod = await tabComponents[route]();
            loadedTabs[route] = mod.default;
        }
    }

    // Load current tab on mount
    onMount(() => {
        loadTab($location);
    });

    $: loadTab($location);
</script>

<div class="tab-groups-row">
    {#each groups as group}
        <div class="tab-group">
            <div class="group-label">{group}</div>
            <div class="tab-buttons-row">
                {#each items.filter((item) => item.group === group) as item}
                    <button
                        class={$location === item.route ? 'active' : ''}
                        onclick={() => {
                            loadTab(item.route);
                            navigateWithGlobalParams(item.route);
                        }}
                    >
                        {item.label}
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</div>

<div class="tab-contents">
    <div class="pageBox">
        {#each Object.entries(loadedTabs) as [route, TabComponent]}
            <div style="display: {route === $location ? 'block' : 'none'};">
                <svelte:component this={TabComponent} />
            </div>
        {/each}
    </div>
</div>

<style>
    .tab-groups-row {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        margin-bottom: 0.2rem;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-between;
    }
    .tab-group {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        flex: 1 1 0;
        min-width: 0;
        border: 1px solid rgba(156, 163, 175, 0.1);
    }
    .group-label {
        font-weight: 500;
        font-size: 0.75rem;
        color: #8fa1c7;
        margin-bottom: 0.05rem;
        margin-left: 0.3rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        white-space: nowrap;
    }
    .tab-buttons-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.1rem;
        width: 100%;
    }

    .pageBox {
        padding: 0.2rem;
        background: rgba(24, 29, 37, 0.8);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 16px16px 16px 16px;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.2),
            0 2px 4px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        width: 100%;
    }

    @media (min-width: 768px) {
        .pageBox {
            padding: 1.5rem;
        }
    }

    .pageBox:hover {
        border-color: rgba(156, 163, 175, 0.4);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }

    button {
        border: 1px solid rgba(156, 163, 175, 0.1);
        border-radius: 12px;
        display: block;
        padding: 0.5rem 0.7rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.9rem;
        background: rgba(18, 23, 31, 0.8);
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        word-break: break-word;
    }
    button.active {
        background: linear-gradient(135deg, #171a2f 75%, rgb(57, 73, 115));
        border-color: rgba(255, 255, 255, 0.2);
        color: white;
        box-shadow: 0 4px 12px rgba(58, 40, 88, 0.4);
    }
    button:hover {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.1);
        color: rgba(255, 255, 255, 0.95);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        button {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        button {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
        }
    }
</style>

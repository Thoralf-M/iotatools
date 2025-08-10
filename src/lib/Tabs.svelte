<script lang="ts">
    import { link, location } from 'svelte-spa-router';

    let currentRoute = '';
    $: currentRoute = $location;

    export let items: any[] = [];

    // Get unique groups from items
    $: groups = Array.from(new Set(items.map((item) => item.group)));
</script>

<div class="tab-groups-row">
    {#each groups as group}
        <div class="tab-group">
            <div class="group-label">{group}</div>
            <div class="tab-buttons-row">
                {#each items.filter((item) => item.group === group) as item}
                    <a href={item.route} use:link>
                        <button class={$location === item.route ? 'active' : ''}
                            >{item.label}</button
                        >
                    </a>
                {/each}
            </div>
        </div>
    {/each}
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
    a {
        margin: 0;
        padding: 0;
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
        backdrop-filter: blur(5px);
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

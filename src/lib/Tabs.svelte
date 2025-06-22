<script lang="ts">
    export let items: any[] = [];
    let activeTabs = JSON.parse(localStorage.getItem('activeTabs') || '[0]');

    const handleClick = (tabValue: number) => () => {
        activeTabs[0] = tabValue;
        localStorage.setItem('activeTabs', JSON.stringify(activeTabs));
        // Commented part could be used to have multiple tabs at once visible
        // if (activeTabs.includes(tabValue)) {
        //     activeTabs = activeTabs.filter((v) => v != tabValue);
        // } else {
        //     activeTabs = [...activeTabs, tabValue];
        // }
    };
</script>

<ul>
    {#each items as item}
        <li class={activeTabs.includes(item.value) ? 'active' : ''}>
            <button on:click={handleClick(item.value)}>{item.label}</button>
        </li>
    {/each}
</ul>

{#each items as item}
    <div class="pageBox" hidden={!activeTabs.includes(item.value)}>
        <svelte:component this={item.component} />
    </div>
{/each}

<style>
    .pageBox {
        padding: 2rem;
        background: rgba(24, 29, 37, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 16px16px 16px 16px;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.2),
            0 2px 4px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .pageBox:hover {
        border-color: rgba(156, 163, 175, 0.4);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin: 0.1rem;
        list-style: none;
        background: rgba(18, 23, 31, 0.8);
        border-radius: 16px 16px 0 0;
        padding: 0.5rem;
        backdrop-filter: blur(5px);
        gap: 0.25rem;
    }

    li {
        margin-bottom: 0px;
    }

    button {
        border: 1px solid rgba(156, 163, 175, 0.1);
        border-radius: 12px;
        display: block;
        padding: 0.75rem 1.25rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.9rem;
        background: rgba(18, 23, 31, 0.8);
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        position: relative;
        overflow: hidden;
    }

    button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
    }

    button:hover::before {
        left: 100%;
    }

    button:hover {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.1);
        color: rgba(255, 255, 255, 0.95);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    li.active > button {
        background: linear-gradient(135deg, #171a2f, 75%, rgb(57, 73, 115));
        border-color: rgba(255, 255, 255, 0.2);
        color: white;
        box-shadow: 0 4px 12px rgba(58, 40, 88, 0.4);
    }

    li.active > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(58, 40, 88, 0.5);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        ul {
            gap: 0.125rem;
            padding: 0.25rem;
        }

        button {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
        }

        .pageBox {
            padding: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        button {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
        }

        .pageBox {
            padding: 1rem;
        }
    }
</style>

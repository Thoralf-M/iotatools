<script lang="ts">
    import { onMount } from 'svelte';

    import { clearTray, trayItems, trayOpen } from '../stores/transaction-tray';
    import { TransactionExecution } from '../utils/shared-in-memory';
    import TransactionTrayItem from './TransactionTrayItem.svelte';

    const STORAGE_KEY = 'iotatools.tray.heightPx';
    // Floor is just one collapsed card's worth — anything bigger felt wasteful
    // when the user only has a single transaction in the tray. The body has
    // its own overflow-y, so smaller values still let the user scroll through.
    const MIN_HEIGHT = 60;
    const DEFAULT_FRACTION = 0.5; // 50% viewport on first open

    let trayHeight = $state(0); // px; 0 means "use default"
    let dragging = $state(false);
    let dragStartY = 0;
    let dragStartHeight = 0;

    // Bound to the resize handle and the tray-handle row so we can subtract
    // their height from the body cap; without this the user can drag the
    // body taller than the viewport, pushing the resize handle off-screen.
    let resizeHandleEl: HTMLDivElement | undefined = $state();
    let trayHandleEl: HTMLDivElement | undefined = $state();

    onMount(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const n = parseInt(saved, 10);
            if (!Number.isNaN(n)) trayHeight = clamp(n);
        }
        const onResize = () => {
            // Re-clamp on viewport changes (rotation, resize, mobile URL bar
            // appearing) so a previously-saved height that no longer fits
            // doesn't leave the handle off-screen.
            trayHeight = clamp(effectiveHeight());
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });

    function chromeHeight(): number {
        // Sum of everything inside the tray that isn't the body — the body's
        // max height is the viewport minus this so the total tray height can
        // never exceed the viewport (border-top is part of offsetHeight).
        const r = resizeHandleEl?.offsetHeight ?? 10;
        const h = trayHandleEl?.offsetHeight ?? 50;
        return r + h;
    }

    function viewportMax(): number {
        return Math.max(MIN_HEIGHT, window.innerHeight - chromeHeight());
    }

    function clamp(h: number): number {
        return Math.min(Math.max(h, MIN_HEIGHT), viewportMax());
    }

    function effectiveHeight(): number {
        return trayHeight > 0 ? trayHeight : Math.round(window.innerHeight * DEFAULT_FRACTION);
    }

    function onPointerDown(e: PointerEvent) {
        // Activate drag on left button / primary touch / pen.
        if (e.button !== undefined && e.button !== 0) return;
        if (!$trayOpen) trayOpen.set(true);
        dragging = true;
        dragStartY = e.clientY;
        dragStartHeight = effectiveHeight();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        e.preventDefault();
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;
        // Bottom-anchored: dragging up (negative deltaY) grows the tray.
        const next = clamp(dragStartHeight + (dragStartY - e.clientY));
        trayHeight = next;
    }

    function onPointerUp(e: PointerEvent) {
        if (!dragging) return;
        dragging = false;
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            /* not captured */
        }
        try {
            localStorage.setItem(STORAGE_KEY, String(trayHeight));
        } catch {
            /* localStorage may be disabled */
        }
    }

    function onResizeKey(e: KeyboardEvent) {
        const step = e.shiftKey ? 80 : 24;
        if (e.key === 'ArrowUp') {
            trayHeight = clamp(effectiveHeight() + step);
            if (!$trayOpen) trayOpen.set(true);
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            trayHeight = clamp(effectiveHeight() - step);
            e.preventDefault();
        }
    }

    function effectFailed(result: unknown): boolean {
        if (!result || typeof result !== 'object') return false;
        return (result as any)?.effects?.status?.status === 'failure';
    }

    let counts = $derived.by(() => {
        const items = $trayItems;
        let running = 0;
        let error = 0;
        let executed = 0;
        let simulated = 0;
        for (const i of items) {
            if (i.status === 'running') {
                running++;
                continue;
            }
            // JS-level failure OR on-chain failure both count as errors.
            if (i.status === 'error' || effectFailed(i.result)) {
                error++;
                continue;
            }
            // Use `lastRunMode` (what produced the result), not `mode`
            // (the dropdown for the next run) — otherwise flipping the
            // dropdown would re-bucket finished items.
            if (i.lastRunMode === TransactionExecution.Send) executed++;
            else simulated++;
        }
        return { total: items.length, running, error, executed, simulated };
    });

    let bodyStyle = $derived($trayOpen ? `height: ${effectiveHeight()}px;` : '');
</script>

{#if $trayItems.length > 0}
    <div class="tray" class:open={$trayOpen} class:dragging>
        {#if $trayOpen}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <div
                class="resize-handle"
                role="separator"
                aria-orientation="horizontal"
                aria-label="Resize transaction list"
                tabindex="0"
                bind:this={resizeHandleEl}
                onpointerdown={onPointerDown}
                onpointermove={onPointerMove}
                onpointerup={onPointerUp}
                onpointercancel={onPointerUp}
                onkeydown={onResizeKey}
                title="Drag to resize"
            >
                <span class="grip"></span>
            </div>
        {/if}
        <div class="tray-handle" bind:this={trayHandleEl}>
            <button
                type="button"
                class="toggle-btn"
                onclick={() => trayOpen.set(!$trayOpen)}
                aria-expanded={$trayOpen}
                title={$trayOpen ? 'Collapse transaction list' : 'Expand transaction list'}
            >
                <span class="caret" class:open={$trayOpen}>▲</span>
                <span class="title">Transactions ({counts.total})</span>
                <span class="summary">
                    {#if counts.running > 0}
                        <span class="dot dot-running"></span>{counts.running} running
                    {/if}
                    {#if counts.simulated > 0}
                        <span class="dot dot-ok"></span>{counts.simulated} simulated
                    {/if}
                    {#if counts.executed > 0}
                        <span class="dot dot-sent"></span>{counts.executed} executed
                    {/if}
                    {#if counts.error > 0}
                        <span class="dot dot-err"></span>{counts.error} error
                    {/if}
                </span>
                <span class="hint">{$trayOpen ? 'click to collapse' : 'click to expand'}</span>
            </button>
            <button
                type="button"
                class="clear-btn"
                onclick={clearTray}
                title="Remove all transactions from the list"
            >
                Clear all
            </button>
        </div>

        {#if $trayOpen}
            <div class="tray-body" style={bodyStyle}>
                {#each $trayItems as item, i (item.id)}
                    <TransactionTrayItem {item} index={i} />
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .tray {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
        background: rgba(12, 17, 28, 0.97);
        border-top: 1px solid var(--border-hover);
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        max-width: 100vw;
        overflow-x: hidden;
    }
    .tray.dragging {
        user-select: none;
    }

    .resize-handle {
        position: relative;
        height: 10px;
        flex-shrink: 0;
        cursor: ns-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        touch-action: none; /* let pointermove drive the drag */
    }
    .resize-handle:hover,
    .resize-handle:focus-visible {
        background: rgba(255, 255, 255, 0.04);
        outline: none;
    }
    .grip {
        display: block;
        width: 48px;
        height: 4px;
        border-radius: 2px;
        background: rgba(156, 163, 175, 0.35);
        transition:
            background 0.15s ease,
            width 0.15s ease;
    }
    .resize-handle:hover .grip,
    .resize-handle:focus-visible .grip,
    .tray.dragging .grip {
        background: rgba(96, 165, 250, 0.7);
        width: 64px;
    }

    .tray-handle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.4rem 1rem;
        font-size: 0.85rem;
        flex-shrink: 0;
        min-width: 0;
    }
    .toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
        min-width: 0;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        font-size: inherit;
        text-align: left;
        padding: 0.25rem 0.4rem;
        border-radius: 5px;
    }
    .toggle-btn:hover {
        background: rgba(255, 255, 255, 0.04);
    }
    .caret {
        display: inline-block;
        transition: transform 0.2s ease;
        font-size: 0.7rem;
        color: var(--text-muted);
        flex-shrink: 0;
    }
    .caret.open {
        transform: rotate(180deg);
    }
    .title {
        font-weight: 600;
        flex-shrink: 0;
    }
    .summary {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-muted);
        font-size: 0.8rem;
        flex: 1;
        min-width: 0;
    }
    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 0.3rem;
        vertical-align: middle;
    }
    .dot-running {
        background: #60a5fa;
    }
    .dot-ok {
        background: #34d399;
    }
    .dot-sent {
        background: #fb923c;
    }
    .dot-err {
        background: #f87171;
    }
    .hint {
        color: var(--text-muted);
        font-size: 0.7rem;
        font-style: italic;
        margin-right: 0.5rem;
    }
    .clear-btn {
        padding: 0.3rem 0.7rem;
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 5px;
        background: rgba(55, 65, 81, 0.4);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.75rem;
        cursor: pointer;
        flex-shrink: 0;
    }
    .clear-btn:hover {
        background: rgba(220, 38, 38, 0.2);
        border-color: rgba(220, 38, 38, 0.4);
    }

    .tray-body {
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.5rem 1rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-top: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
        .tray-handle {
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.4rem 0.6rem;
        }
        .hint {
            display: none;
        }
        .summary {
            flex-basis: 100%;
            order: 3;
        }
        .tray-body {
            padding: 0.5rem 0.5rem 0.75rem;
        }
    }
</style>

<script lang="ts">
    import { untrack } from 'svelte';

    import type { ExportSection } from './csv-export';
    import { renderSectionsToPdfBlobUrl } from './pdf-export';

    type ExportFormat = 'csv' | 'pdf';

    type PreviewOpts = {
        includePrices: boolean;
        includeValidators: boolean;
        wrapStakeObjects: boolean;
        wrapValidators: boolean;
    };

    let {
        open = false,
        defaultFileName = '',
        pricesAvailable = false,
        validatorsAvailable = false,
        stakeObjectsAvailable = false,
        buildPreview,
        onCancel,
        onExport,
    }: {
        open: boolean;
        /** Default filename stem (no extension) shown when the dialog opens. */
        defaultFileName?: string;
        pricesAvailable?: boolean;
        validatorsAvailable?: boolean;
        stakeObjectsAvailable?: boolean;
        /** Builds the full ExportSection[] the dialog previews. */
        buildPreview: (opts: PreviewOpts) => ExportSection[];
        onCancel: () => void;
        onExport: (opts: {
            format: ExportFormat;
            includePrices: boolean;
            includeValidators: boolean;
            wrapStakeObjects: boolean;
            wrapValidators: boolean;
            fileName: string;
        }) => void;
    } = $props();

    const PREVIEW_ROW_LIMIT = 5;

    let format = $state<ExportFormat>('csv');
    let includePrices = $state(true);
    let includeValidators = $state(true);
    let wrapStakeObjects = $state(true);
    let wrapValidators = $state(true);
    let fileName = $state('');
    let isMaximized = $state(false);

    let effectiveOpts = $derived<PreviewOpts>({
        includePrices: pricesAvailable && includePrices,
        includeValidators: validatorsAvailable && includeValidators,
        wrapStakeObjects: stakeObjectsAvailable && wrapStakeObjects,
        wrapValidators: validatorsAvailable && wrapValidators,
    });

    // Only build a preview while the dialog is open — avoids doing the work
    // in the background when the dialog isn't visible.
    let previewSections = $derived.by(() => (open ? buildPreview(effectiveOpts) : []));

    // PDF preview state. The PDF render is async (dynamic import + autotable),
    // so we debounce toggles and revoke old blob URLs to avoid memory leaks.
    let pdfPreviewUrl = $state<string | null>(null);
    let pdfPreviewLoading = $state(false);
    let pdfPreviewError = $state<string>('');
    const PDF_PREVIEW_DEBOUNCE_MS = 250;
    const PDF_PREVIEW_ROW_LIMIT = 25;

    function truncateSectionsForPreview(sections: ExportSection[]): ExportSection[] {
        return sections.map((s) => ({
            ...s,
            rows: s.rows.slice(0, PDF_PREVIEW_ROW_LIMIT),
        }));
    }

    $effect(() => {
        // Dependencies — re-runs whenever any of these change.
        const shouldRender = open && format === 'pdf';
        const opts = effectiveOpts;

        if (!shouldRender) {
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
                pdfPreviewUrl = null;
            }
            pdfPreviewError = '';
            return;
        }

        let cancelled = false;
        pdfPreviewLoading = true;
        pdfPreviewError = '';

        const timeout = setTimeout(async () => {
            try {
                const sections = truncateSectionsForPreview(buildPreview(opts));
                const url = await renderSectionsToPdfBlobUrl(sections);
                if (cancelled) {
                    URL.revokeObjectURL(url);
                    return;
                }
                if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
                pdfPreviewUrl = url;
            } catch (err) {
                if (!cancelled) {
                    pdfPreviewError = err instanceof Error ? err.message : 'Failed to render PDF';
                }
            } finally {
                if (!cancelled) pdfPreviewLoading = false;
            }
        }, PDF_PREVIEW_DEBOUNCE_MS);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    });

    // Seed the filename field only when the dialog transitions to open —
    // `defaultFileName` is read via `untrack` so a parent-side refresh
    // (e.g. the timeframe changes and pushes a new default while the user is
    // still typing) can't clobber what they've typed.
    $effect(() => {
        if (open) {
            fileName = untrack(() => defaultFileName);
        }
    });

    function handleExport() {
        onExport({
            format,
            includePrices: pricesAvailable && includePrices,
            includeValidators: validatorsAvailable && includeValidators,
            wrapStakeObjects: stakeObjectsAvailable && wrapStakeObjects,
            wrapValidators: validatorsAvailable && wrapValidators,
            fileName,
        });
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') onCancel();
    }
</script>

{#if open}
    <div
        class="modal-overlay"
        role="presentation"
        onclick={onCancel}
        onkeydown={handleKeydown}
        tabindex="-1"
    >
        <div
            class="modal-content"
            class:maximized={isMaximized}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            tabindex="-1"
        >
            <div class="modal-header">
                <h3 id="export-title">Export table</h3>
                <button class="close-btn" aria-label="Close" onclick={onCancel}>×</button>
            </div>

            <div class="modal-body">
                <section>
                    <div class="section-title">Format</div>
                    <div class="format-row">
                        <label class="format-option" class:active={format === 'csv'}>
                            <input type="radio" bind:group={format} value="csv" />
                            <span>CSV</span>
                        </label>
                        <label class="format-option" class:active={format === 'pdf'}>
                            <input type="radio" bind:group={format} value="pdf" />
                            <span>PDF</span>
                        </label>
                    </div>
                </section>

                <section>
                    <div class="section-title">Columns</div>
                    <label class="option">
                        <input
                            type="checkbox"
                            bind:checked={includePrices}
                            disabled={!pricesAvailable}
                        />
                        <span>
                            Include price columns
                            {#if !pricesAvailable}
                                <span class="hint">(fetch prices first)</span>
                            {/if}
                        </span>
                    </label>
                    <label class="option">
                        <input
                            type="checkbox"
                            bind:checked={includeValidators}
                            disabled={!validatorsAvailable}
                        />
                        <span>Include validator columns</span>
                    </label>
                </section>

                <section>
                    <div class="section-title">Layout</div>
                    <p class="section-description">
                        Wrap options move per-object data into extra sections below the main table
                        (one row per epoch × object). Keeps the main table readable for PDF /
                        printout.
                    </p>
                    <label class="option">
                        <input
                            type="checkbox"
                            bind:checked={wrapStakeObjects}
                            disabled={!stakeObjectsAvailable}
                        />
                        <span>Wrap stake objects to rows</span>
                    </label>
                    <label class="option">
                        <input
                            type="checkbox"
                            bind:checked={wrapValidators}
                            disabled={!validatorsAvailable || !includeValidators}
                        />
                        <span>Wrap validators to rows</span>
                    </label>
                </section>

                <section>
                    <div class="preview-header">
                        <div class="section-title">Preview</div>
                        <button
                            type="button"
                            class="maximize-btn"
                            onclick={() => (isMaximized = !isMaximized)}
                            title={isMaximized ? 'Restore preview size' : 'Maximize preview'}
                            aria-label={isMaximized ? 'Restore preview size' : 'Maximize preview'}
                        >
                            {isMaximized ? '⤢ Restore' : '⤢ Maximize'}
                        </button>
                    </div>
                    {#if format === 'pdf'}
                        <div class="preview-hint">
                            First {PDF_PREVIEW_ROW_LIMIT} rows of each section. Full export contains all
                            epochs.
                        </div>
                        <div class="pdf-preview-frame" class:maximized={isMaximized}>
                            {#if pdfPreviewError}
                                <div class="pdf-preview-error">
                                    Failed to render PDF preview: {pdfPreviewError}
                                </div>
                            {:else if pdfPreviewUrl}
                                <iframe
                                    class="pdf-preview-iframe"
                                    src={pdfPreviewUrl}
                                    title="PDF preview"
                                ></iframe>
                                {#if pdfPreviewLoading}
                                    <div class="pdf-preview-overlay">Updating…</div>
                                {/if}
                            {:else}
                                <div class="pdf-preview-loading">Rendering PDF preview…</div>
                            {/if}
                        </div>
                    {:else}
                        <div class="preview-hint">
                            First {PREVIEW_ROW_LIMIT} rows of each section; full export contains all epochs.
                        </div>
                        <div class="preview-scroller" class:maximized={isMaximized}>
                            {#each previewSections as section}
                                {#if section.title}
                                    <div class="preview-section-title">
                                        {section.title.replace(/^-+\s*|\s*-+$/g, '')}
                                    </div>
                                {/if}
                                <table class="preview-table">
                                    <thead>
                                        <tr>
                                            {#each section.headers as header}
                                                <th>{header}</th>
                                            {/each}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each section.rows.slice(0, PREVIEW_ROW_LIMIT) as row}
                                            <tr>
                                                {#each row as cell}
                                                    <td title={cell}>{cell}</td>
                                                {/each}
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                                {#if section.rows.length > PREVIEW_ROW_LIMIT}
                                    <div class="preview-more">
                                        … {section.rows.length - PREVIEW_ROW_LIMIT} more row{section
                                            .rows.length -
                                            PREVIEW_ROW_LIMIT ===
                                        1
                                            ? ''
                                            : 's'}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </section>

                <section>
                    <div class="section-title">Filename</div>
                    <label class="filename-field">
                        <input
                            type="text"
                            bind:value={fileName}
                            placeholder="staking-rewards-table-YYYY-MM-DD"
                        />
                        <span>.{format}</span>
                    </label>
                </section>
            </div>

            <div class="actions">
                <button class="secondary" onclick={onCancel}>Cancel</button>
                <button class="primary" onclick={handleExport}>Export</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 5000;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .modal-content {
        width: min(820px, 96vw);
        max-height: 92vh;
        overflow: auto;
        background: rgba(22, 28, 39, 0.98);
        border: 1px solid rgba(59, 130, 246, 0.4);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        transition:
            width 0.18s ease,
            max-height 0.18s ease;
    }

    .modal-content.maximized {
        width: 96vw;
        max-height: 96vh;
    }

    .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
    }

    .preview-header .section-title {
        margin-bottom: 0;
    }

    .maximize-btn {
        padding: 0.3rem 0.65rem;
        border: 1px solid rgba(156, 163, 175, 0.3);
        border-radius: 4px;
        background: rgba(55, 65, 81, 0.3);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .maximize-btn:hover {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.2);
    }

    .preview-hint {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.55);
        margin-bottom: 0.4rem;
    }

    .preview-scroller {
        max-height: 280px;
        overflow: auto;
        border: 1px solid rgba(156, 163, 175, 0.25);
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.25);
        padding: 0.5rem;
        transition: max-height 0.18s ease;
    }

    .preview-scroller.maximized {
        max-height: 78vh;
    }

    .preview-section-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: rgba(191, 210, 240, 0.9);
        margin: 0.6rem 0 0.3rem;
    }

    .preview-section-title:first-child {
        margin-top: 0;
    }

    .preview-table {
        border-collapse: collapse;
        font-size: 0.72rem;
        font-family: monospace;
        width: max-content;
        min-width: 100%;
    }

    .preview-table th,
    .preview-table td {
        padding: 3px 6px;
        border: 1px solid rgba(156, 163, 175, 0.15);
        text-align: left;
        white-space: nowrap;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .preview-table th {
        background: rgba(59, 130, 246, 0.15);
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        position: sticky;
        top: 0;
    }

    .preview-table td {
        color: rgba(255, 255, 255, 0.75);
    }

    .preview-more {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.45);
        margin-top: 0.25rem;
        padding-left: 0.25rem;
    }

    .pdf-preview-frame {
        position: relative;
        height: 380px;
        border: 1px solid rgba(156, 163, 175, 0.25);
        border-radius: 6px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.25);
        transition: height 0.18s ease;
    }

    .pdf-preview-frame.maximized {
        height: 78vh;
    }

    .pdf-preview-iframe {
        width: 100%;
        height: 100%;
        border: 0;
        background: #fff;
    }

    .pdf-preview-loading,
    .pdf-preview-error {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
        padding: 1rem;
        text-align: center;
    }

    .pdf-preview-error {
        color: rgba(252, 165, 165, 0.9);
    }

    .pdf-preview-overlay {
        position: absolute;
        top: 6px;
        right: 8px;
        background: rgba(0, 0, 0, 0.55);
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 999px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-header h3 {
        margin: 0;
        color: rgba(255, 255, 255, 0.95);
        font-size: 1.15rem;
    }

    .close-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        padding: 0 0.25rem;
    }

    .close-btn:hover {
        color: rgba(255, 255, 255, 1);
    }

    .modal-body {
        color: rgba(255, 255, 255, 0.85);
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        margin-bottom: 1.25rem;
    }

    .section-title {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 0.4rem;
    }

    .section-description {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0 0 0.5rem 0;
        line-height: 1.4;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.25rem 0;
        cursor: pointer;
    }

    .option input[type='checkbox'] {
        cursor: pointer;
    }

    .option input[type='checkbox']:disabled {
        cursor: not-allowed;
    }

    .option input:disabled + span {
        opacity: 0.5;
    }

    .hint {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.8rem;
        margin-left: 0.3rem;
    }

    .filename-field {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-family: monospace;
        font-size: 0.9rem;
    }

    .filename-field input {
        flex: 1;
        min-width: 0;
        padding: 0.4rem 0.55rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(156, 163, 175, 0.3);
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.95);
        font-family: monospace;
    }

    .filename-field input:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.6);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.6rem;
    }

    .actions button {
        padding: 0.55rem 1.2rem;
        border-radius: 6px;
        border: 1px solid rgba(156, 163, 175, 0.35);
        background: rgba(55, 65, 81, 0.3);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .actions .primary {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.22);
    }

    .actions .primary:hover {
        border-color: rgba(59, 130, 246, 0.8);
        background: rgba(59, 130, 246, 0.38);
    }

    .actions .secondary:hover {
        background: rgba(55, 65, 81, 0.55);
    }

    .format-row {
        display: flex;
        gap: 0.5rem;
    }

    .format-option {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid rgba(156, 163, 175, 0.3);
        border-radius: 6px;
        background: rgba(55, 65, 81, 0.25);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .format-option:hover {
        background: rgba(55, 65, 81, 0.45);
    }

    .format-option.active {
        border-color: rgba(59, 130, 246, 0.6);
        background: rgba(59, 130, 246, 0.18);
    }
</style>

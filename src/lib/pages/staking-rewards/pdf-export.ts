import { buildExportSections, type ExportProgressCallback, type ExportSection } from './csv-export';
import type { EpochData, ExportOptions, StakeObject, ValidatorInfo } from './types';

const FONT_SIZE = 8;
const CHAR_WIDTH = FONT_SIZE * 0.55; // approx glyph width at this size, pt
const CELL_PADDING = 4;
const MIN_COL_WIDTH = 55;
// Cap runaway cells (action details, long IDs) — they still wrap inside the
// cell, but we don't let one cell eat the whole page.
const MAX_COL_WIDTH = 220;
const PAGE_MARGIN = 30;
/**
 * Maximum rows fed to a single autoTable call. autoTable is fully synchronous
 * and a 23k-row long-format section can lock the main thread for tens of
 * seconds — chunking lets us await between batches so the UI can repaint and
 * the "Generating PDF…" indicator stays responsive. Continuation chunks pass
 * `showHead: 'never'` and resume at the previous `finalY` so the PDF output
 * is identical to a single-call render.
 */
const ROW_CHUNK_SIZE = 500;

const yieldToBrowser = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Estimate a comfortable width for each column by measuring the longest cell
 * (or header) and converting to points, clamped into [MIN, MAX].
 */
function estimateColumnWidths(section: ExportSection): number[] {
    return section.headers.map((header, i) => {
        let maxChars = header.length;
        for (const row of section.rows) {
            const cell = row[i] ?? '';
            if (cell.length > maxChars) maxChars = cell.length;
        }
        const content = maxChars * CHAR_WIDTH + CELL_PADDING * 2;
        return Math.max(MIN_COL_WIDTH, Math.min(MAX_COL_WIDTH, content));
    });
}

/**
 * Number of leading columns that stay pinned on every horizontal slice (so
 * continuation slices still carry context like epoch/date or stake-object id).
 */
const REPEAT_COLS = 2;

/**
 * Split a section's columns into groups that each fit within the usable page
 * width. The first REPEAT_COLS columns are repeated at the start of every
 * group. Exported for unit testing.
 */
export function splitIntoColumnGroups(colWidths: number[], usableWidth: number): number[][] {
    if (colWidths.length <= REPEAT_COLS) return [colWidths.map((_, i) => i)];

    const repeatIndices = Array.from({ length: REPEAT_COLS }, (_, i) => i);
    const repeatWidth = repeatIndices.reduce((sum, i) => sum + colWidths[i], 0);

    const groups: number[][] = [];
    let current: number[] = [...repeatIndices];
    let currentWidth = repeatWidth;

    for (let i = REPEAT_COLS; i < colWidths.length; i++) {
        const w = colWidths[i];
        // Start a new group when adding this column would overflow — but
        // never emit a group that contains only the repeated columns.
        if (currentWidth + w > usableWidth && current.length > REPEAT_COLS) {
            groups.push(current);
            current = [...repeatIndices, i];
            currentWidth = repeatWidth + w;
        } else {
            current.push(i);
            currentWidth += w;
        }
    }
    groups.push(current);
    return groups;
}

/**
 * Render the given sections into a fresh jsPDF document. Returns the doc so
 * the caller can either trigger download or extract a blob URL for preview.
 * jsPDF + autotable are loaded dynamically to keep them out of the initial
 * bundle.
 */
async function renderSectionsToPdf(sections: ExportSection[], onProgress?: ExportProgressCallback) {
    const [{ jsPDF }, autoTableModule] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
    ]);
    const autoTable = autoTableModule.default;

    // Fixed A4 landscape. Tables wider than this are split into column groups
    // and each group is rendered as its own table — groups stack vertically on
    // the same page whenever there's room, instead of each landing on its own
    // nearly-empty page.
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - PAGE_MARGIN * 2;
    // Leave a little breathing room at the bottom — if a group's estimated
    // height doesn't fit under this, we move it to a fresh page.
    const bottomLimit = pageHeight - PAGE_MARGIN;

    doc.setFontSize(14);
    doc.text('Staking Rewards', 40, 40);

    let startY = 60;
    const rowHeight = FONT_SIZE + CELL_PADDING * 2 + 2;
    const titleHeight = 16;
    const gapAfterTable = 24;

    const rowsTotal = sections.reduce((sum, s) => sum + s.rows.length, 0);
    let rowsDone = 0;
    const reportProgress = () => onProgress?.({ rowsDone, rowsTotal });
    reportProgress();

    for (const section of sections) {
        const colWidths = estimateColumnWidths(section);
        const groups = splitIntoColumnGroups(colWidths, usableWidth);

        for (let g = 0; g < groups.length; g++) {
            const group = groups[g];
            const headers = group.map((i) => section.headers[i]);
            const rows = section.rows.map((row) => group.map((i) => row[i] ?? ''));

            // Show the section title only on its first group to avoid visual
            // duplication (the repeated key columns already signal continuity).
            const isFirstGroup = g === 0;
            const showTitle = isFirstGroup && !!section.title;

            const estimatedHeight =
                (showTitle ? titleHeight : 0) +
                rowHeight +
                Math.min(rows.length, ROW_CHUNK_SIZE) * rowHeight;
            if (startY > 60 && startY + estimatedHeight > bottomLimit) {
                doc.addPage();
                startY = PAGE_MARGIN + 10;
            }

            if (showTitle) {
                doc.setFontSize(11);
                doc.text(section.title!.replace(/^-+\s*|\s*-+$/g, ''), 40, startY);
                startY += titleHeight;
            }

            const columnStyles: Record<number, { cellWidth: number }> = {};
            group.forEach((srcIdx, localIdx) => {
                columnStyles[localIdx] = { cellWidth: colWidths[srcIdx] };
            });

            // Render rows in chunks. autoTable is fully synchronous, so a
            // single call with 20k+ rows would freeze the page for tens of
            // seconds. By calling it once per ROW_CHUNK_SIZE rows and
            // awaiting between batches, the browser gets a chance to repaint
            // (and the "Generating PDF…" label stays alive). Continuation
            // chunks resume at the previous `finalY` and suppress the head so
            // the output is visually identical to a single-call render.
            const chunkCount = rows.length === 0 ? 1 : Math.ceil(rows.length / ROW_CHUNK_SIZE);
            for (let chunk = 0; chunk < chunkCount; chunk++) {
                const sliceStart = chunk * ROW_CHUNK_SIZE;
                const chunkRows = rows.slice(sliceStart, sliceStart + ROW_CHUNK_SIZE);
                const isFirstChunk = chunk === 0;

                autoTable(doc, {
                    startY,
                    head: isFirstChunk ? [headers] : undefined,
                    body: chunkRows,
                    styles: {
                        fontSize: FONT_SIZE,
                        cellPadding: CELL_PADDING,
                        overflow: 'linebreak',
                    },
                    columnStyles,
                    headStyles: { fillColor: [59, 130, 246], textColor: 255, valign: 'middle' },
                    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
                    showHead: isFirstChunk ? 'firstPage' : 'never',
                });
                // @ts-expect-error — autotable augments the doc with lastAutoTable at runtime
                startY = doc.lastAutoTable?.finalY ?? startY;

                // Only count progress on the first column group — subsequent
                // groups re-render the same rows at different columns.
                if (isFirstGroup) {
                    rowsDone += chunkRows.length;
                    reportProgress();
                }

                if (chunk < chunkCount - 1) await yieldToBrowser();
            }
            startY += gapAfterTable;

            // Yield between groups too — wide tables (no-wrap with hundreds of
            // stake-object columns) produce many groups, each its own autoTable
            // call. Without this the UI would still freeze on those tables.
            if (g < groups.length - 1) await yieldToBrowser();
        }
    }

    return doc;
}

/**
 * Render the given sections and return a blob URL pointing to the resulting
 * PDF. Caller is responsible for calling `URL.revokeObjectURL` when done.
 * Used for the in-dialog PDF preview.
 */
export async function renderSectionsToPdfBlobUrl(
    sections: ExportSection[],
    onProgress?: ExportProgressCallback,
): Promise<string> {
    const doc = await renderSectionsToPdf(sections, onProgress);
    return doc.output('bloburl') as unknown as string;
}

/**
 * Export table data as a PDF and trigger download.
 */
export async function exportTableToPDF(
    epochs: number[],
    epochEndDates: string[],
    currentEpoch: number,
    stakeObjects: StakeObject[],
    uniqueValidators: ValidatorInfo[],
    epochData: EpochData,
    options: ExportOptions,
    onProgress?: ExportProgressCallback,
): Promise<void> {
    const sections = buildExportSections({
        epochs,
        epochEndDates,
        currentEpoch,
        stakeObjects,
        uniqueValidators,
        epochData,
        options,
    });
    const doc = await renderSectionsToPdf(sections, onProgress);
    const stem =
        options.fileName?.trim() ||
        `staking-rewards-table-${new Date().toISOString().split('T')[0]}`;
    doc.save(`${stem}.pdf`);
}

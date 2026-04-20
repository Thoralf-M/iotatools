import { buildExportSections, type ExportSection } from './csv-export';
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
async function renderSectionsToPdf(sections: ExportSection[]) {
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
                (showTitle ? titleHeight : 0) + rowHeight + rows.length * rowHeight;
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

            autoTable(doc, {
                startY,
                head: [headers],
                body: rows,
                styles: {
                    fontSize: FONT_SIZE,
                    cellPadding: CELL_PADDING,
                    overflow: 'linebreak',
                },
                columnStyles,
                headStyles: { fillColor: [59, 130, 246], textColor: 255, valign: 'middle' },
                margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
            });
            // @ts-expect-error — autotable augments the doc with lastAutoTable at runtime
            startY = (doc.lastAutoTable?.finalY ?? startY) + gapAfterTable;
        }
    }

    return doc;
}

/**
 * Render the given sections and return a blob URL pointing to the resulting
 * PDF. Caller is responsible for calling `URL.revokeObjectURL` when done.
 * Used for the in-dialog PDF preview.
 */
export async function renderSectionsToPdfBlobUrl(sections: ExportSection[]): Promise<string> {
    const doc = await renderSectionsToPdf(sections);
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
    const doc = await renderSectionsToPdf(sections);
    const stem =
        options.fileName?.trim() ||
        `staking-rewards-table-${new Date().toISOString().split('T')[0]}`;
    doc.save(`${stem}.pdf`);
}

import { describe, expect, it } from 'vitest';

import { splitIntoColumnGroups } from './pdf-export.js';

describe('splitIntoColumnGroups', () => {
    const USABLE = 780; // approximate A4 landscape usable width in points

    it('returns a single group when there are no more than REPEAT_COLS columns', () => {
        expect(splitIntoColumnGroups([100, 120], USABLE)).toEqual([[0, 1]]);
        expect(splitIntoColumnGroups([100], USABLE)).toEqual([[0]]);
    });

    it('returns a single group when all columns fit in one page width', () => {
        const widths = [80, 80, 80, 80, 80]; // 400pt ≪ 780pt
        expect(splitIntoColumnGroups(widths, USABLE)).toEqual([[0, 1, 2, 3, 4]]);
    });

    it('splits wide tables and repeats the first REPEAT_COLS columns in every group', () => {
        // Two 100pt repeat columns + six 200pt data columns = 1400pt total.
        // Usable = 780pt → two groups needed.
        const widths = [100, 100, 200, 200, 200, 200, 200, 200];
        const groups = splitIntoColumnGroups(widths, USABLE);

        expect(groups.length).toBeGreaterThan(1);
        for (const group of groups) {
            expect(group.slice(0, 2)).toEqual([0, 1]);
            const groupWidth = group.reduce((sum, i) => sum + widths[i], 0);
            expect(groupWidth).toBeLessThanOrEqual(USABLE);
        }

        // Every non-repeat column appears exactly once across all groups.
        const seen = new Set<number>();
        for (const group of groups) {
            for (const i of group.slice(2)) {
                expect(seen.has(i)).toBe(false);
                seen.add(i);
            }
        }
        const expectedDataCols = widths.map((_, i) => i).filter((i) => i >= 2);
        expect([...seen].sort((a, b) => a - b)).toEqual(expectedDataCols);
    });

    it('never emits a group containing only the repeated columns', () => {
        // A single data column that on its own already overflows together
        // with the repeat prefix: the split logic must still emit it, not
        // drop it or loop forever.
        const widths = [300, 300, 500]; // repeat prefix = 600pt, + 500 = 1100 > 780
        const groups = splitIntoColumnGroups(widths, USABLE);

        expect(groups).toHaveLength(1);
        expect(groups[0]).toEqual([0, 1, 2]);
    });

    it('preserves column order within each group', () => {
        const widths = [50, 50, 300, 300, 300, 300]; // forces a split
        const groups = splitIntoColumnGroups(widths, USABLE);

        for (const group of groups) {
            for (let i = 1; i < group.length; i++) {
                expect(group[i]).toBeGreaterThan(group[i - 1]);
            }
        }
    });
});

import { describe, expect, it } from 'vitest';

import { DEFAULT_CHUNK_SIZE, splitChunks } from './onchain-apps-client';

describe('splitChunks', () => {
    it('returns a single empty chunk for empty input', () => {
        const chunks = splitChunks(new Uint8Array());
        expect(chunks).toHaveLength(1);
        expect(chunks[0]).toHaveLength(0);
    });

    it('splits bytes into fixed-size slices', () => {
        const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7]);
        const chunks = splitChunks(bytes, 3);
        expect(chunks).toHaveLength(3);
        expect(Array.from(chunks[0])).toEqual([1, 2, 3]);
        expect(Array.from(chunks[1])).toEqual([4, 5, 6]);
        expect(Array.from(chunks[2])).toEqual([7]);
    });

    it('round-trips via concatenation', () => {
        const bytes = new Uint8Array(Array.from({ length: 500 }, (_, i) => i % 256));
        const chunks = splitChunks(bytes, 128);
        expect(chunks.length).toBe(Math.ceil(bytes.length / 128));
        const joined = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
        let offset = 0;
        for (const c of chunks) {
            joined.set(c, offset);
            offset += c.length;
        }
        expect(Array.from(joined)).toEqual(Array.from(bytes));
    });

    it('rejects invalid chunk sizes', () => {
        expect(() => splitChunks(new Uint8Array([1]), 0)).toThrow();
    });

    it('uses a sane default chunk size', () => {
        expect(DEFAULT_CHUNK_SIZE).toBeGreaterThan(1024);
        expect(DEFAULT_CHUNK_SIZE).toBeLessThan(256 * 1024);
    });
});

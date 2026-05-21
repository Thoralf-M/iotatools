import { describe, expect, it } from 'vitest';

import { formatTimeAgo } from './pruning-cutoff';

describe('formatTimeAgo', () => {
    const now = Date.parse('2026-05-21T12:00:00.000Z');

    it('returns "just now" for sub-minute intervals', () => {
        expect(formatTimeAgo(Date.parse('2026-05-21T11:59:30.000Z'), now)).toBe('just now');
        expect(formatTimeAgo(Date.parse('2026-05-21T12:00:00.000Z'), now)).toBe('just now');
    });

    it('formats minutes', () => {
        expect(formatTimeAgo(Date.parse('2026-05-21T11:55:00.000Z'), now)).toBe('5m ago');
        expect(formatTimeAgo(Date.parse('2026-05-21T11:01:00.000Z'), now)).toBe('59m ago');
    });

    it('formats hours', () => {
        expect(formatTimeAgo(Date.parse('2026-05-21T09:00:00.000Z'), now)).toBe('3h ago');
        expect(formatTimeAgo(Date.parse('2026-05-20T13:00:00.000Z'), now)).toBe('23h ago');
    });

    it('formats days', () => {
        expect(formatTimeAgo(Date.parse('2026-05-19T12:00:00.000Z'), now)).toBe('2d ago');
        expect(formatTimeAgo(Date.parse('2026-05-14T12:00:00.000Z'), now)).toBe('7d ago');
    });

    it('handles future timestamps from clock skew', () => {
        expect(formatTimeAgo(Date.parse('2026-05-21T12:05:00.000Z'), now)).toBe('in the future');
    });

    it('returns an empty string for non-finite timestamps', () => {
        expect(formatTimeAgo(NaN, now)).toBe('');
    });
});

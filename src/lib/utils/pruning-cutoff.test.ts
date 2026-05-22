import { describe, expect, it } from 'vitest';

import { formatTimeAgo, formatVerboseAgo } from './pruning-cutoff';

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

describe('formatVerboseAgo', () => {
    const now = Date.parse('2026-05-21T12:00:00.000Z');

    it('returns "just now" for sub-minute intervals', () => {
        expect(formatVerboseAgo(Date.parse('2026-05-21T11:59:30.000Z'), now)).toBe('just now');
    });

    it('pluralises minutes', () => {
        expect(formatVerboseAgo(Date.parse('2026-05-21T11:59:00.000Z'), now)).toBe('1 minute ago');
        expect(formatVerboseAgo(Date.parse('2026-05-21T11:55:00.000Z'), now)).toBe('5 minutes ago');
    });

    it('pluralises hours', () => {
        expect(formatVerboseAgo(Date.parse('2026-05-21T11:00:00.000Z'), now)).toBe('1 hour ago');
        expect(formatVerboseAgo(Date.parse('2026-05-21T09:00:00.000Z'), now)).toBe('3 hours ago');
    });

    it('pluralises days', () => {
        expect(formatVerboseAgo(Date.parse('2026-05-20T12:00:00.000Z'), now)).toBe('1 day ago');
        expect(formatVerboseAgo(Date.parse('2026-03-30T12:00:00.000Z'), now)).toBe('52 days ago');
    });
});

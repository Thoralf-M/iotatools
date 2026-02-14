/**
 * Tests for formatting utility functions
 */

import { describe, expect, it } from 'vitest';

import { formatAddress } from './formatting';

describe('formatAddress', () => {
    it('should format a full address by showing first 8 and last 6 characters', () => {
        const address = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
        const result = formatAddress(address);
        expect(result).toBe('0x1ee12d...d5eb7c');
    });

    it('should return empty string for empty input', () => {
        expect(formatAddress('')).toBe('');
    });

    it('should handle short strings gracefully', () => {
        const short = '0x1234';
        const result = formatAddress(short);
        // With a short string, first 8 overlaps with last 6 but still returns a string
        expect(result).toContain('...');
    });

    it('should handle undefined/null gracefully', () => {
        // @ts-ignore - testing invalid input
        expect(formatAddress(undefined)).toBe('');
        // @ts-ignore - testing invalid input
        expect(formatAddress(null)).toBe('');
    });
});

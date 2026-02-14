/**
 * Tests for IOTA/NANO conversion utility functions
 */

import { describe, expect, it } from 'vitest';

import {
    formatNumbersWithUnderscores,
    formatNumberWithUnderscores,
    iotaToNano,
    nanoToIota,
} from './iota-nano-conversion';

describe('iotaToNano', () => {
    it('should convert whole IOTA amounts to nano', () => {
        expect(iotaToNano('1')).toBe('1000000000');
        expect(iotaToNano('0')).toBe('0');
        expect(iotaToNano('100')).toBe('100000000000');
    });

    it('should convert decimal IOTA amounts to nano', () => {
        expect(iotaToNano('1.5')).toBe('1500000000');
        expect(iotaToNano('0.000000001')).toBe('1');
        expect(iotaToNano('1.123456789')).toBe('1123456789');
    });

    it('should handle underscored input (thousands separator)', () => {
        expect(iotaToNano('1_000')).toBe('1000000000000');
    });

    it('should throw for decimal part exceeding 9 digits', () => {
        expect(() => iotaToNano('1.1234567890')).toThrow('Decimal part exceeds 9 digits');
    });

    it('should handle large amounts', () => {
        expect(iotaToNano('1000000')).toBe('1000000000000000');
    });
});

describe('nanoToIota', () => {
    it('should convert nano to IOTA with decimals', () => {
        expect(nanoToIota('1000000000')).toBe('1.000000000');
        expect(nanoToIota('1500000000')).toBe('1.500000000');
    });

    it('should handle sub-IOTA amounts', () => {
        expect(nanoToIota('1')).toBe('0.000000001');
        expect(nanoToIota('123456789')).toBe('0.123456789');
    });

    it('should convert zero', () => {
        expect(nanoToIota('0')).toBe('0.000000000');
    });

    it('should handle underscored input', () => {
        expect(nanoToIota('1_000_000_000')).toBe('1.000000000');
    });

    it('should handle large values', () => {
        const result = nanoToIota('1000000000000000');
        expect(result).toBe('1000000.000000000');
    });
});

describe('formatNumberWithUnderscores', () => {
    it('should add underscore separators to large numbers', () => {
        expect(formatNumberWithUnderscores(1000000)).toBe('1_000_000');
    });

    it('should not modify small numbers', () => {
        expect(formatNumberWithUnderscores(999)).toBe('999');
    });

    it('should handle string numbers', () => {
        expect(formatNumberWithUnderscores('12345')).toBe('12_345');
    });

    it('should handle zero', () => {
        expect(formatNumberWithUnderscores(0)).toBe('0');
    });
});

describe('formatNumbersWithUnderscores', () => {
    it('should recursively format numbers in objects', () => {
        const input = { a: 1000, b: 'hello', c: { d: 2000000 } };
        const result = formatNumbersWithUnderscores(input);
        expect(result).toEqual({ a: '1_000', b: 'hello', c: { d: '2_000_000' } });
    });

    it('should format numeric strings in objects', () => {
        const input = { amount: '50000' };
        const result = formatNumbersWithUnderscores(input);
        expect(result).toEqual({ amount: '50_000' });
    });

    it('should handle arrays', () => {
        const input = { values: [1000, 2000, 3000] };
        const result = formatNumbersWithUnderscores(input);
        expect(result).toEqual({ values: ['1_000', '2_000', '3_000'] });
    });

    it('should leave non-numeric strings unchanged', () => {
        const input = { name: 'test', address: '0xabc' };
        const result = formatNumbersWithUnderscores(input);
        expect(result).toEqual({ name: 'test', address: '0xabc' });
    });
});

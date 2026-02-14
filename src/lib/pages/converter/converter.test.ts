/**
 * Tests for converter utility functions (encoding, address conversion, etc.)
 */

import { describe, expect, it } from 'vitest';

import {
    bcsBytesToInteger,
    bech32ToTernary,
    bytesToUtf8,
    ed25519HexToTernary,
    hexToBytes,
    ternaryToBech32,
    ternaryToEd25519Hex,
} from './converter';

describe('bytesToUtf8', () => {
    it('should decode ASCII bytes to string', () => {
        const bytes = [72, 101, 108, 108, 111]; // "Hello"
        expect(bytesToUtf8(bytes)).toBe('Hello');
    });

    it('should decode empty array to empty string', () => {
        expect(bytesToUtf8([])).toBe('');
    });

    it('should handle multi-byte UTF-8 characters', () => {
        // "€" in UTF-8 is [0xE2, 0x82, 0xAC]
        const bytes = [0xe2, 0x82, 0xac];
        expect(bytesToUtf8(bytes)).toBe('€');
    });
});

describe('hexToBytes', () => {
    it('should convert hex string to byte array', () => {
        expect(hexToBytes('48656c6c6f')).toEqual([72, 101, 108, 108, 111]);
    });

    it('should handle empty string', () => {
        expect(hexToBytes('')).toEqual([]);
    });

    it('should convert single byte', () => {
        expect(hexToBytes('ff')).toEqual([255]);
        expect(hexToBytes('00')).toEqual([0]);
    });
});

describe('bcsBytesToInteger', () => {
    it('should parse 1-byte as u8', () => {
        const result = bcsBytesToInteger([42]);
        expect(result.type).toBe('u8');
        expect(result.value).toBe('42');
    });

    it('should parse 2-bytes as u16', () => {
        // 256 in little-endian u16 = [0, 1]
        const result = bcsBytesToInteger([0, 1]);
        expect(result.type).toBe('u16');
        expect(result.value).toBe('256');
    });

    it('should parse 4-bytes as u32', () => {
        // 1 in little-endian u32 = [1, 0, 0, 0]
        const result = bcsBytesToInteger([1, 0, 0, 0]);
        expect(result.type).toBe('u32');
        expect(result.value).toBe('1');
    });

    it('should parse 8-bytes as u64', () => {
        // 1 in little-endian u64
        const result = bcsBytesToInteger([1, 0, 0, 0, 0, 0, 0, 0]);
        expect(result.type).toBe('u64');
        expect(result.value).toBe('1');
    });

    it('should handle arbitrary length bytes gracefully', () => {
        const result = bcsBytesToInteger([1, 2, 3]);
        expect(result.type).toBeDefined();
        expect(result.value).toBeDefined();
    });
});

describe('Address conversion roundtrips', () => {
    const testHex = '0x6f9e8510b88b0ea4fbc684df90ba310540370a0403067b22cef4971fec3e8bb8';

    it('should convert hex → ternary → hex roundtrip', () => {
        const ternary = ed25519HexToTernary(testHex);
        expect(ternary).toBeTruthy();
        expect(ternary.startsWith('TRANSFER')).toBe(true);

        const hexBack = ternaryToEd25519Hex(ternary);
        expect(hexBack.toLowerCase()).toBe(testHex.toLowerCase());
    });

    it('should convert hex → ternary → bech32 → ternary roundtrip', () => {
        const ternary = ed25519HexToTernary(testHex);
        const bech32Addr = ternaryToBech32(ternary);
        expect(bech32Addr).toBeTruthy();
        expect(bech32Addr.startsWith('iota')).toBe(true);

        const ternaryBack = bech32ToTernary(bech32Addr);
        expect(ternaryBack).toBe(ternary);
    });

    it('should reject invalid hex address length', () => {
        expect(() => ed25519HexToTernary('0x1234')).toThrow();
    });

    it('should handle hex without 0x prefix', () => {
        const hexWithout = testHex.slice(2);
        const ternary = ed25519HexToTernary(hexWithout);
        expect(ternary.startsWith('TRANSFER')).toBe(true);
    });
});

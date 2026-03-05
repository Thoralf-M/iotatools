/**
 * Tests for move-authenticator utility functions
 */

import { describe, expect, it } from 'vitest';

import { parseMoveAuthenticatorSignature } from './move-authenticator';

describe('parseMoveAuthenticatorSignature', () => {
    it('should parse a versioned V1 MoveAuthenticator signature', () => {
        const signatureBase64 =
            'BwAGAAgqAAAAAAAAAAADAsr+AAYCAaoCu8wABQR0ZXN0AAQBAt6tAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAABAXjP3INNPLl2HCU3ituYUzAGS6qNKC5Z93eUzOyFK7NfAwAAAAAAAAAA';

        const result = parseMoveAuthenticatorSignature(signatureBase64);

        expect(result.version).toBe(1);
        expect(result.callArguments).toHaveLength(6);
        expect(result.objectId).toBe(
            '0x78cfdc834d3cb9761c25378adb985330064baa8d282e59f77794ccec852bb35f',
        );
        expect(result.objectToAuthenticate.$kind).toBe('SharedObject');
    });

    it('should throw an error for non-MoveAuthenticator signatures', () => {
        const invalidSignature = 'AQEA'; // Not starting with 0x07

        expect(() => parseMoveAuthenticatorSignature(invalidSignature)).toThrow(
            'Signature is not a MoveAuthenticator',
        );
    });
});

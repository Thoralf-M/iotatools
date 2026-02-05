/**
 * Tests for move-authenticator utility functions
 */

import { describe, expect, it } from 'vitest';

import { parseMoveAuthenticatorSignature } from './move-authenticator';

describe('parseMoveAuthenticatorSignature', () => {
    it('should parse the first test signature with call arguments correctly', () => {
        const signatureBase64 =
            'BwEAggGAATZmNGZkNTFmY2Y5OWI2YTgwOWQyOTE1ZTk3OWNlY2M2NWJjNjAxNzk1MDY3ZjRmNWVhNGJjZmViYzQ3OTM0NjQ0MDE0ZmVmYjlhN2JkYjUxNDI0ZDNiNzY2MWQzMjk2YTdkNzU2MDZkOTljNjlmNjBiZjNmZmU2YmJjNzhmZjA0AAEBCzaFQuHWZ6N386wUcn94p7IXGQwsB/asY7m9qDMDfEkEAAAAAAAAAAA=';

        const result = parseMoveAuthenticatorSignature(signatureBase64);

        expect(result.callArguments).toEqual([
            '0x80013666346664353166636639396236613830396432393135653937396365636336356263363031373935303637663466356561346263666562633437393334363434303134666566623961376264623531343234643362373636316433323936613764373536303664393963363966363062663366666536626263373866663034',
        ]);
        expect(result.typeArguments).toEqual([]);
        expect(result.objectId).toBe(
            '0x0b368542e1d667a377f3ac14727f78a7b217190c2c07f6ac63b9bda833037c49',
        );
        expect(result.objectToAuthenticate).toEqual({
            $kind: 'SharedObject',
            SharedObject: {
                objectId: '0x0b368542e1d667a377f3ac14727f78a7b217190c2c07f6ac63b9bda833037c49',
                initialSharedVersion: '4',
                mutable: false,
            },
        });
    });

    it('should parse the second test signature correctly', () => {
        const signatureBase64 = 'BwAAAQGPOP0k4FCRs8zwABv14LS5V9DesC7ocZ7rG4d1QdPcfW5pCikAAAAAAA==';

        const result = parseMoveAuthenticatorSignature(signatureBase64);

        expect(result).toEqual({
            callArguments: [],
            typeArguments: [],
            objectToAuthenticate: {
                $kind: 'SharedObject',
                SharedObject: {
                    objectId: '0x8f38fd24e05091b3ccf0001bf5e0b4b957d0deb02ee8719eeb1b877541d3dc7d',
                    initialSharedVersion: '688548206',
                    mutable: false,
                },
            },
            objectId: '0x8f38fd24e05091b3ccf0001bf5e0b4b957d0deb02ee8719eeb1b877541d3dc7d',
        });
    });

    it('should throw an error for non-MoveAuthenticator signatures', () => {
        const invalidSignature = 'AQEA'; // Not starting with 0x07

        expect(() => parseMoveAuthenticatorSignature(invalidSignature)).toThrow(
            'Signature is not a MoveAuthenticator',
        );
    });

});

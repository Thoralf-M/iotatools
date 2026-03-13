import { bcs } from '@iota/bcs';
import { blake2b } from '@noble/hashes/blake2.js';
import { bech32 } from '@scure/base';

export function bytesToUtf8(bytes: number[]): string {
    try {
        return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
        return 'Invalid UTF-8';
    }
}

export function bcsBytesToInteger(bytes: number[]): { type: string; value: string } {
    try {
        const length = bytes.length;
        let type: string;
        let value: string;

        switch (length) {
            case 1:
                type = 'u8';
                value = bcs.u8().parse(new Uint8Array(bytes)).toString();
                break;
            case 2:
                type = 'u16';
                value = bcs.u16().parse(new Uint8Array(bytes)).toString();
                break;
            case 4:
                type = 'u32';
                value = bcs.u32().parse(new Uint8Array(bytes)).toString();
                break;
            case 8:
                type = 'u64';
                value = bcs.u64().parse(new Uint8Array(bytes)).toString();
                break;
            case 16:
                type = 'u128';
                value = bcs.u128().parse(new Uint8Array(bytes)).toString();
                break;
            case 32:
                type = 'u256';
                value = bcs.u256().parse(new Uint8Array(bytes)).toString();
                break;
            default:
                // For other lengths, try u64 as fallback or return raw bytes info
                if (length <= 8) {
                    type = `u${length * 8}`;
                    try {
                        value = bcs
                            .u64()
                            .parse(new Uint8Array(bytes.slice(0, 8)))
                            .toString();
                    } catch {
                        value = `Raw bytes (${length} bytes)`;
                    }
                } else {
                    type = `bytes(${length})`;
                    value = `Raw bytes (${length} bytes)`;
                }
        }

        return { type, value };
    } catch {
        return { type: `bytes(${bytes.length})`, value: 'Invalid integer' };
    }
}

export function hexToBytes(hex: string): number[] {
    const bytes: number[] = [];
    for (let c = 0; c < hex.length; c += 2) {
        const int = parseInt(hex.substr(c, 2), 16);
        bytes.push(int);
    }
    return bytes;
}

const TRYTE_ALPHABET = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const B1T6_TRYTE_VALUE_TO_TRITS: ReadonlyArray<ReadonlyArray<number>> = [
    [-1, -1, -1],
    [0, -1, -1],
    [1, -1, -1],
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 1, -1],
    [0, 1, -1],
    [1, 1, -1],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [-1, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [-1, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
];

const TRYTES_TRITS_LUT: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 0, 0],
    [1, 0, 0],
    [-1, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
    [-1, -1, -1],
    [0, -1, -1],
    [1, -1, -1],
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 1, -1],
    [0, 1, -1],
    [1, 1, -1],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [-1, 0, 0],
];

const B1T6_VALUE_TO_CHAR: string[] = B1T6_TRYTE_VALUE_TO_TRITS.map((pattern) => {
    const idx = TRYTES_TRITS_LUT.findIndex(
        (tritsPattern) =>
            tritsPattern[0] === pattern[0] &&
            tritsPattern[1] === pattern[1] &&
            tritsPattern[2] === pattern[2],
    );

    if (idx === -1) {
        throw new Error('Unable to build b1t6 lookup table.');
    }

    return TRYTE_ALPHABET.charAt(idx);
});

const B1T6_CHAR_TO_VALUE: Record<string, number> = {};
for (let i = 0; i < B1T6_VALUE_TO_CHAR.length; i++) {
    B1T6_CHAR_TO_VALUE[B1T6_VALUE_TO_CHAR[i]] = i;
}

const TRANSFER_PREFIX = 'TRANSFER';
const TRANSFER_SUFFIX = '9';
const ED25519_ADDRESS_SIZE = 32;
const CHECKSUM_SIZE = 4;
const MIGRATION_ADDRESS_LENGTH = 81;

function blake2b256(data: Uint8Array): Uint8Array {
    return new Uint8Array(blake2b(data, { dkLen: 32 }));
}

function b1t6EncodeToTrytes(data: Uint8Array): string {
    let result = '';

    for (let i = 0; i < data.length; i++) {
        const int8 = (data[i] << 24) >> 24;
        const value = int8 + 364;
        const low = value % 27;
        const high = Math.trunc(value / 27);

        result += B1T6_VALUE_TO_CHAR[low] + B1T6_VALUE_TO_CHAR[high];
    }

    return result;
}

function b1t6DecodeTrytes(trytes: string): Uint8Array {
    if (trytes.length % 2 !== 0) {
        throw new Error('Invalid trytes length. Expected an even length.');
    }

    const bytes = new Uint8Array(trytes.length / 2);

    for (let i = 0; i < bytes.length; i++) {
        const low = B1T6_CHAR_TO_VALUE[trytes.charAt(i * 2)];
        const high = B1T6_CHAR_TO_VALUE[trytes.charAt(i * 2 + 1)];

        if (low === undefined || high === undefined) {
            throw new Error('Invalid trytes.');
        }

        const value = low + high * 27;
        let signed = value - 364;

        if (signed < 0) {
            signed += 256;
        }

        bytes[i] = signed;
    }

    return bytes;
}

function normalizeMigrationAddress(ternaryAddr: string): string {
    if (ternaryAddr.length === MIGRATION_ADDRESS_LENGTH + 9) {
        return ternaryAddr.slice(0, MIGRATION_ADDRESS_LENGTH);
    }

    if (ternaryAddr.length !== MIGRATION_ADDRESS_LENGTH) {
        throw new Error(
            `Invalid migration address length: expected ${MIGRATION_ADDRESS_LENGTH} or ${MIGRATION_ADDRESS_LENGTH + 9}, got ${ternaryAddr.length}.`,
        );
    }

    return ternaryAddr;
}

function extractEd25519Address(ternaryAddr: string): Uint8Array {
    const migrationAddr = normalizeMigrationAddress(ternaryAddr);

    if (!migrationAddr.startsWith(TRANSFER_PREFIX)) {
        throw new Error(`Invalid prefix: expected '${TRANSFER_PREFIX}'.`);
    }

    if (!migrationAddr.endsWith(TRANSFER_SUFFIX)) {
        throw new Error(`Invalid suffix: expected '${TRANSFER_SUFFIX}'.`);
    }

    const middleTrytes = migrationAddr.slice(TRANSFER_PREFIX.length, -TRANSFER_SUFFIX.length);
    const decoded = b1t6DecodeTrytes(middleTrytes);

    if (decoded.length !== ED25519_ADDRESS_SIZE + CHECKSUM_SIZE) {
        throw new Error(
            `Invalid decoded length: expected ${ED25519_ADDRESS_SIZE + CHECKSUM_SIZE}, got ${decoded.length}.`,
        );
    }

    const ed25519Address = decoded.slice(0, ED25519_ADDRESS_SIZE);
    const checksum = decoded.slice(ED25519_ADDRESS_SIZE);
    const expectedChecksum = blake2b256(ed25519Address).slice(0, CHECKSUM_SIZE);

    for (let i = 0; i < CHECKSUM_SIZE; i++) {
        if (checksum[i] !== expectedChecksum[i]) {
            throw new Error('Invalid checksum for migration address.');
        }
    }

    return ed25519Address;
}

function encodeMigrationAddress(ed25519Address: Uint8Array): string {
    if (ed25519Address.length !== ED25519_ADDRESS_SIZE) {
        throw new Error(`Expected ${ED25519_ADDRESS_SIZE} bytes for an Ed25519 address.`);
    }

    const hash = blake2b256(ed25519Address);
    const addressWithChecksum = new Uint8Array(ED25519_ADDRESS_SIZE + CHECKSUM_SIZE);
    addressWithChecksum.set(ed25519Address, 0);
    addressWithChecksum.set(hash.slice(0, CHECKSUM_SIZE), ED25519_ADDRESS_SIZE);

    return TRANSFER_PREFIX + b1t6EncodeToTrytes(addressWithChecksum) + TRANSFER_SUFFIX;
}

// function hexToBytes(hex: string): Uint8Array {
//     const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
//     if (normalized.length % 2 !== 0) {
//         throw new Error('Invalid hex string.');
//     }

//     const bytes = new Uint8Array(normalized.length / 2);
//     for (let i = 0; i < bytes.length; i++) {
//         const byte = normalized.slice(i * 2, i * 2 + 2);
//         bytes[i] = parseInt(byte, 16);
//         if (Number.isNaN(bytes[i])) {
//             throw new Error('Invalid hex string.');
//         }
//     }

//     return bytes;
// }

function bytesToHex(bytes: Uint8Array, withPrefix = true): string {
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return withPrefix ? `0x${hex}` : hex;
}

export function bech32ToTernary(bech32Addr: string): string {
    const decoded = bech32.decode(bech32Addr as `${string}1${string}`, 90);
    const payload = new Uint8Array(bech32.fromWords(decoded.words));

    let ed25519Address: Uint8Array;

    if (payload.length === ED25519_ADDRESS_SIZE + 1) {
        if (payload[0] !== 0) {
            throw new Error(`Unsupported address type byte: ${payload[0]}.`);
        }
        ed25519Address = payload.slice(1);
    } else if (payload.length === ED25519_ADDRESS_SIZE) {
        ed25519Address = payload;
    } else {
        throw new Error(
            `Invalid Ed25519 address size: expected ${ED25519_ADDRESS_SIZE} or ${ED25519_ADDRESS_SIZE + 1}, got ${payload.length}.`,
        );
    }

    return encodeMigrationAddress(ed25519Address);
}

export function ternaryToBech32(ternaryAddr: string, hrp: string = 'iota'): string {
    const ed25519Address = extractEd25519Address(ternaryAddr);

    const payloadWithType = new Uint8Array(1 + ED25519_ADDRESS_SIZE);
    payloadWithType[0] = 0;
    payloadWithType.set(ed25519Address, 1);

    return bech32.encode(hrp, bech32.toWords(payloadWithType));
}

export function ed25519HexToTernary(hexAddress: string): string {
    // Strip 0x prefix if present
    const normalizedHex = hexAddress.toLowerCase().startsWith('0x')
        ? hexAddress.slice(2)
        : hexAddress;

    const ed25519Address = hexToBytes(normalizedHex);
    if (ed25519Address.length !== ED25519_ADDRESS_SIZE) {
        throw new Error(
            `Invalid Ed25519 hex length: expected ${ED25519_ADDRESS_SIZE * 2} hex chars.`,
        );
    }

    return encodeMigrationAddress(new Uint8Array(ed25519Address));
}

export function ternaryToEd25519Hex(ternaryAddr: string): string {
    const ed25519Address = extractEd25519Address(ternaryAddr);
    return bytesToHex(ed25519Address);
}

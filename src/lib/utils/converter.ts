import { bcs } from '@iota/bcs';
import { base64Decode as fromBase64 } from './wasm-sdk';

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

export function decodeBase64Bytes(
    base64: string,
): { bytes: number[]; utf8: string; integer: { type: string; value: string } } | null {
    try {
        const rawBytes = fromBase64(base64);
        const bytes = Array.from(new Uint8Array(rawBytes));
        const utf8 = bytesToUtf8(bytes);
        const integer = bcsBytesToInteger(bytes);
        return { bytes, utf8, integer };
    } catch {
        return null;
    }
}

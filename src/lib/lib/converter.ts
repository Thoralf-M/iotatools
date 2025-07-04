import { bcs, fromB64 } from '@iota/bcs';

export function bytesToUtf8(bytes: number[]): string {
    try {
        return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
        return 'Invalid UTF-8';
    }
}

export function bcsBytesToU64(bytes: number[]): string {
    try {
        return bcs.u64().parse(new Uint8Array(bytes)).toString();
    } catch {
        return 'Invalid u64';
    }
}

export function decodeBase64Bytes(
    base64: string,
): { bytes: number[]; utf8: string; u64: string } | null {
    try {
        const bytes = fromB64(base64) as any;
        const utf8 = bytesToUtf8(bytes);
        const u64 = bcsBytesToU64(bytes);
        return { bytes, utf8, u64 };
    } catch {
        return null;
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

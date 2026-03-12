// [GAP] BcsType not available in WASM SDK
type BcsType = any;
// [GAP] @iota/iota-sdk/bcs - Custom BCS schema object not available in WASM SDK
const bcs = null as any; // [GAP] placeholder
// [GAP] MoveTypeLayout type not in WASM SDK
type MoveTypeLayout = any;
import { toB64 } from '../../utils/wasm-sdk';

export interface BcsDecodeResult {
    value?: any;
    error?: string;
}

/**
 * Convert type string to short format
 */
export function toShortTypeString<T extends string | null | undefined>(type?: T): T {
    return type?.replace(/0x0{31,}(\d)/g, '0x$1').replace(/,\b/g, ', ') as T;
}

/**
 * Convert MoveTypeLayout to BCS schema
 */
export function layoutToBcs(layout: MoveTypeLayout): any {
    switch (layout) {
        case 'address':
            return bcs.Address;
        case 'bool':
            return bcs.Bool;
        case 'u8':
            return bcs.U8;
        case 'u16':
            return bcs.U16;
        case 'u32':
            return bcs.U32;
        case 'u64':
            return bcs.U64;
        case 'u128':
            return bcs.U128;
        case 'u256':
            return bcs.U256;
    }

    if ('vector' in layout) {
        const innerType = layoutToBcs(layout.vector);
        const vectorType = bcs.vector(innerType);

        // Special handling for vector<u8> which is often used for string bytes
        if (layout.vector === 'u8') {
            return vectorType.transform({
                input: (value: any) => {
                    // If it's a string, convert to bytes array
                    if (typeof value === 'string') {
                        return Array.from(new TextEncoder().encode(value));
                    }
                    return value;
                },
                output: (value: any) => {
                    // Convert bytes array back to string
                    if (Array.isArray(value)) {
                        return new TextDecoder().decode(new Uint8Array(value));
                    }
                    return value;
                },
            });
        }

        return vectorType;
    }

    if ('struct' in layout) {
        const fields: Record<string, BcsType<any>> = {};

        for (const { name, layout: field } of layout.struct.fields) {
            fields[name] = layoutToBcs(field);
        }

        let struct: any = bcs.struct(layout.struct.type, fields as any);

        const structName = toShortTypeString(layout.struct.type);

        if (structName === '0x2::object::ID') {
            struct = struct.transform({
                input: (id: any) => (typeof id === 'string' ? { bytes: id } : id) as never,
                output: (id: any) => id.id,
            });
        }

        // Handle String type - convert JavaScript string to Move String format
        if (structName === '0x1::string::String') {
            struct = struct.transform({
                input: (str: any) => (typeof str === 'string' ? { bytes: str } : str) as never,
                output: (obj: any) => obj.bytes,
            });
        }

        return struct;
    }

    throw new Error(`Unknown layout: ${JSON.stringify(layout)}`);
}

/**
 * Convert JSON to BCS using a Move layout
 */
export function mapJsonToBcs(json: unknown, layout: MoveTypeLayout): string {
    const schema = layoutToBcs(layout);
    return toB64(schema.serialize(json).toBytes());
}

/**
 * Decode BCS data using a Move layout
 */
export function decodeBcs(bcsBase64: string, layout: MoveTypeLayout): BcsDecodeResult {
    try {
        const schema = layoutToBcs(layout);

        // Decode the base64 BCS data
        const bcsBytes = new Uint8Array(
            atob(bcsBase64)
                .split('')
                .map((c) => c.charCodeAt(0)),
        );

        const value = schema.parse(bcsBytes);
        return { value };
    } catch (e: any) {
        return { error: e.message || String(e) };
    }
}

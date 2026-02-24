/**
 * Binary Exchange Rate Cache Format
 *
 * This module provides efficient binary serialization/deserialization for exchange rate cache data.
 * The binary format significantly reduces storage size compared to JSON.
 *
 * Binary Format Layout:
 *
 * Header (8 bytes):
 * - Magic number (4 bytes): 0x49455243 ("IERC" - Iota Exchange Rate Cache)
 * - Version (1 byte): Format version (currently 2)
 * - Pool count (3 bytes): Number of pools (24-bit unsigned integer, max 16.7M pools)
 *
 * String Table:
 * - String table size (4 bytes): Total size of string table in bytes
 * - String entries: Null-terminated UTF-8 strings for poolIds and exchangeRateIds
 *
 * For each pool:
 * - Pool ID index (2 bytes): Index into string table for poolId
 * - Exchange Rate ID index (2 bytes): Index into string table for exchangeRateId
 * - Deactivation epoch (2 bytes): 0xFFFF if not deactivated, otherwise the epoch number
 * - Epoch count (2 bytes): Number of epochs for this pool
 * - Epoch data entries (variable):
 *   - Epoch number (2 bytes): Epoch as 16-bit unsigned integer
 *   - IOTA amount length (1 byte): Length of IOTA amount string
 *   - IOTA amount (variable): UTF-8 string of IOTA amount
 *   - Pool amount length (1 byte): Length of pool amount string
 *   - Pool amount (variable): UTF-8 string of pool amount
 */

import type { ExchangeRateCacheEntry } from '../graphql-requests';

// Magic number for file format identification
const MAGIC_NUMBER = 0x49455243; // "IERC"
const FORMAT_VERSION = 2; // Version 2 adds deactivationEpoch support
const FORMAT_VERSION_1 = 1; // Legacy version without deactivationEpoch
const NO_DEACTIVATION_EPOCH = 0xffff; // Sentinel value meaning no deactivation

/**
 * Serializes exchange rate cache data to a binary format
 */
export function serializeExchangeRateCache(cacheData: ExchangeRateCacheEntry[]): Uint8Array {
    if (!cacheData || cacheData.length === 0) {
        // Return minimal valid header for empty cache
        const buffer = new ArrayBuffer(12); // Header + empty string table
        const view = new DataView(buffer);
        view.setUint32(0, MAGIC_NUMBER, false); // Big-endian
        view.setUint8(4, FORMAT_VERSION);
        view.setUint32(5, 0, false); // Pool count (24-bit, stored as 32-bit)
        view.setUint32(8, 0, false); // String table size
        return new Uint8Array(buffer);
    }

    // Build string table to deduplicate strings
    const stringMap = new Map<string, number>();
    const strings: string[] = [];

    function addString(str: string): number {
        if (stringMap.has(str)) {
            return stringMap.get(str)!;
        }
        const index = strings.length;
        strings.push(str);
        stringMap.set(str, index);
        return index;
    }

    // Collect all unique strings
    for (const entry of cacheData) {
        addString(entry.poolId);
        addString(entry.exchangeRateId);
    }

    // Calculate string table size
    const stringTableEncoder = new TextEncoder();
    let stringTableSize = 0;
    const encodedStrings: Uint8Array[] = [];
    for (const str of strings) {
        const encoded = stringTableEncoder.encode(str);
        encodedStrings.push(encoded);
        stringTableSize += encoded.length + 1; // +1 for null terminator
    }

    // Calculate total buffer size needed
    let totalSize = 8; // Header
    totalSize += 4; // String table size
    totalSize += stringTableSize; // String table

    for (const entry of cacheData) {
        totalSize += 8; // Pool ID index (2) + Exchange Rate ID index (2) + Deactivation epoch (2) + Epoch count (2)
        for (const [, data] of Object.entries(entry.epochData)) {
            totalSize += 2; // Epoch number
            totalSize += 1 + stringTableEncoder.encode(data.iota).length; // IOTA amount
            totalSize += 1 + stringTableEncoder.encode(data.pool).length; // Pool amount
        }
    }

    // Create buffer and write data
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    let offset = 0;

    // Write header
    view.setUint32(offset, MAGIC_NUMBER, false); // Big-endian
    offset += 4;
    view.setUint8(offset, FORMAT_VERSION);
    offset += 1;

    // Write pool count (24-bit value)
    if (cacheData.length > 0xffffff) {
        throw new Error('Too many pools (max 16,777,215)');
    }
    view.setUint8(offset, (cacheData.length >> 16) & 0xff);
    view.setUint8(offset + 1, (cacheData.length >> 8) & 0xff);
    view.setUint8(offset + 2, cacheData.length & 0xff);
    offset += 3;

    // Write string table size
    view.setUint32(offset, stringTableSize, false);
    offset += 4;

    // Write string table
    const bufferArray = new Uint8Array(buffer);
    for (const encoded of encodedStrings) {
        bufferArray.set(encoded, offset);
        offset += encoded.length;
        bufferArray[offset] = 0; // Null terminator
        offset += 1;
    }

    // Write pool data
    for (const entry of cacheData) {
        const poolIdIndex = stringMap.get(entry.poolId)!;
        const exchangeRateIdIndex = stringMap.get(entry.exchangeRateId)!;
        const epochCount = Object.keys(entry.epochData).length;

        if (poolIdIndex > 0xffff || exchangeRateIdIndex > 0xffff) {
            throw new Error('String table too large (max 65535 strings)');
        }
        if (epochCount > 0xffff) {
            throw new Error('Too many epochs for a pool (max 65535)');
        }

        view.setUint16(offset, poolIdIndex, false);
        offset += 2;
        view.setUint16(offset, exchangeRateIdIndex, false);
        offset += 2;

        // Write deactivation epoch (0xFFFF if not set)
        const deactivationEpoch =
            entry.deactivationEpoch !== undefined ? entry.deactivationEpoch : NO_DEACTIVATION_EPOCH;
        if (
            entry.deactivationEpoch !== undefined &&
            entry.deactivationEpoch >= NO_DEACTIVATION_EPOCH
        ) {
            throw new Error(
                `Deactivation epoch too large: ${entry.deactivationEpoch} (max ${NO_DEACTIVATION_EPOCH - 1})`,
            );
        }
        view.setUint16(offset, deactivationEpoch, false);
        offset += 2;

        view.setUint16(offset, epochCount, false);
        offset += 2;

        // Write epoch data
        for (const [epochStr, data] of Object.entries(entry.epochData)) {
            const epoch = parseInt(epochStr);
            if (epoch > 0xffff) {
                throw new Error(`Epoch number too large: ${epoch} (max 65535)`);
            }

            view.setUint16(offset, epoch, false);
            offset += 2;

            // Write IOTA amount
            const iotaBytes = stringTableEncoder.encode(data.iota);
            if (iotaBytes.length > 255) {
                throw new Error(`IOTA amount string too long: ${iotaBytes.length} bytes (max 255)`);
            }
            view.setUint8(offset, iotaBytes.length);
            offset += 1;
            bufferArray.set(iotaBytes, offset);
            offset += iotaBytes.length;

            // Write pool amount
            const poolBytes = stringTableEncoder.encode(data.pool);
            if (poolBytes.length > 255) {
                throw new Error(`Pool amount string too long: ${poolBytes.length} bytes (max 255)`);
            }
            view.setUint8(offset, poolBytes.length);
            offset += 1;
            bufferArray.set(poolBytes, offset);
            offset += poolBytes.length;
        }
    }

    return new Uint8Array(buffer);
}

/**
 * Deserializes binary exchange rate cache data back to the original format
 */
export function deserializeExchangeRateCache(binaryData: Uint8Array): ExchangeRateCacheEntry[] {
    if (binaryData.length < 8) {
        throw new Error('Invalid binary data: too small for header');
    }

    const view = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
    let offset = 0;

    // Read and validate header
    const magic = view.getUint32(offset, false);
    offset += 4;
    if (magic !== MAGIC_NUMBER) {
        throw new Error(`Invalid binary data: wrong magic number 0x${magic.toString(16)}`);
    }

    const version = view.getUint8(offset);
    offset += 1;
    if (version !== FORMAT_VERSION && version !== FORMAT_VERSION_1) {
        throw new Error(`Unsupported format version: ${version}`);
    }
    const hasDeactivationEpoch = version >= 2;

    // Read pool count (24-bit)
    const poolCount =
        (view.getUint8(offset) << 16) |
        (view.getUint8(offset + 1) << 8) |
        view.getUint8(offset + 2);
    offset += 3;

    if (poolCount === 0) {
        return [];
    }

    // Read string table
    const stringTableSize = view.getUint32(offset, false);
    offset += 4;

    const stringTableEnd = offset + stringTableSize;
    const strings: string[] = [];
    const decoder = new TextDecoder();

    while (offset < stringTableEnd) {
        // Find null terminator
        let stringEnd = offset;
        while (stringEnd < stringTableEnd && binaryData[stringEnd] !== 0) {
            stringEnd++;
        }

        if (stringEnd >= stringTableEnd) {
            throw new Error('Invalid string table: missing null terminator');
        }

        // Decode string
        const stringBytes = binaryData.slice(offset, stringEnd);
        const str = decoder.decode(stringBytes);
        strings.push(str);

        offset = stringEnd + 1; // Skip null terminator
    }

    // Read pool data
    const result: ExchangeRateCacheEntry[] = [];

    for (let poolIndex = 0; poolIndex < poolCount; poolIndex++) {
        const minPoolHeaderSize = hasDeactivationEpoch ? 8 : 6;
        if (offset + minPoolHeaderSize > binaryData.length) {
            throw new Error('Invalid binary data: truncated pool data');
        }

        const poolIdIndex = view.getUint16(offset, false);
        offset += 2;
        const exchangeRateIdIndex = view.getUint16(offset, false);
        offset += 2;

        // Read deactivation epoch if version >= 2
        let deactivationEpoch: number | undefined;
        if (hasDeactivationEpoch) {
            const deactivationEpochRaw = view.getUint16(offset, false);
            offset += 2;
            if (deactivationEpochRaw !== NO_DEACTIVATION_EPOCH) {
                deactivationEpoch = deactivationEpochRaw;
            }
        }

        const epochCount = view.getUint16(offset, false);
        offset += 2;

        if (poolIdIndex >= strings.length || exchangeRateIdIndex >= strings.length) {
            throw new Error('Invalid binary data: string index out of bounds');
        }

        const poolId = strings[poolIdIndex];
        const exchangeRateId = strings[exchangeRateIdIndex];
        const epochData: Record<number, { iota: string; pool: string }> = {};

        // Read epoch data
        for (let epochIndex = 0; epochIndex < epochCount; epochIndex++) {
            if (offset + 2 > binaryData.length) {
                throw new Error('Invalid binary data: truncated epoch data');
            }

            const epoch = view.getUint16(offset, false);
            offset += 2;

            // Read IOTA amount
            if (offset + 1 > binaryData.length) {
                throw new Error('Invalid binary data: truncated IOTA amount length');
            }
            const iotaLength = view.getUint8(offset);
            offset += 1;

            if (offset + iotaLength > binaryData.length) {
                throw new Error('Invalid binary data: truncated IOTA amount');
            }
            const iotaBytes = binaryData.slice(offset, offset + iotaLength);
            const iotaAmount = decoder.decode(iotaBytes);
            offset += iotaLength;

            // Read pool amount
            if (offset + 1 > binaryData.length) {
                throw new Error('Invalid binary data: truncated pool amount length');
            }
            const poolLength = view.getUint8(offset);
            offset += 1;

            if (offset + poolLength > binaryData.length) {
                throw new Error('Invalid binary data: truncated pool amount');
            }
            const poolBytes = binaryData.slice(offset, offset + poolLength);
            const poolAmount = decoder.decode(poolBytes);
            offset += poolLength;

            epochData[epoch] = {
                iota: iotaAmount,
                pool: poolAmount,
            };
        }

        result.push({
            poolId,
            exchangeRateId,
            epochData,
            ...(deactivationEpoch !== undefined && { deactivationEpoch }),
        });
    }

    return result;
}

/**
 * Converts binary data to base64 string for storage/transmission
 */
export function binaryToBase64(binaryData: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < binaryData.length; i++) {
        binary += String.fromCharCode(binaryData[i]);
    }
    return btoa(binary);
}

/**
 * Converts base64 string back to binary data
 */
export function base64ToBinary(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Compresses exchange rate cache and returns base64 string
 */
export function compressExchangeRateCache(cacheData: ExchangeRateCacheEntry[]): string {
    const binaryData = serializeExchangeRateCache(cacheData);
    return binaryToBase64(binaryData);
}

/**
 * Decompresses base64 string back to exchange rate cache data
 */
export function decompressExchangeRateCache(base64Data: string): ExchangeRateCacheEntry[] {
    const binaryData = base64ToBinary(base64Data);
    return deserializeExchangeRateCache(binaryData);
}

/**
 * Gets compression statistics
 */
export function getCompressionStats(cacheData: ExchangeRateCacheEntry[]): {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    savings: string;
} {
    const originalJson = JSON.stringify(cacheData);
    const originalSize = new TextEncoder().encode(originalJson).length;

    const compressed = compressExchangeRateCache(cacheData);
    const compressedSize = new TextEncoder().encode(compressed).length;

    const compressionRatio = originalSize / compressedSize;
    const savings = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

    return {
        originalSize,
        compressedSize,
        compressionRatio,
        savings: `${savings}%`,
    };
}

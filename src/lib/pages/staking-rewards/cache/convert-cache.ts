#!/usr/bin/env node

/**
 * Utility script to convert exchange rate cache from JSON to binary format
 *
 * Usage:
 * node convert-cache.js input.json output.txt
 *
 * This will read the JSON cache file and output a base64-encoded binary format
 * that can be loaded much more efficiently.
 */
import { readFileSync, writeFileSync } from 'fs';

import { compressExchangeRateCache, getCompressionStats } from './binary-cache.js';

function convertCacheFile(inputPath: string, outputPath: string) {
    try {
        console.log(`Reading JSON cache from: ${inputPath}`);

        // Read JSON cache file
        const jsonData = readFileSync(inputPath, 'utf-8');
        const cacheData = JSON.parse(jsonData);

        console.log(`Found ${cacheData.length} cache entries`);

        // Get compression statistics
        const stats = getCompressionStats(cacheData);
        console.log('\nCompression Statistics:');
        console.log(`Original JSON size: ${(stats.originalSize / 1024).toFixed(1)} KB`);
        console.log(`Compressed binary size: ${(stats.compressedSize / 1024).toFixed(1)} KB`);
        console.log(`Compression ratio: ${stats.compressionRatio.toFixed(1)}x`);
        console.log(`Space savings: ${stats.savings}`);

        // Convert to binary format
        console.log('\nConverting to binary format...');
        const binaryBase64 = compressExchangeRateCache(cacheData);

        // Write binary cache file
        console.log(`Writing binary cache to: ${outputPath}`);
        writeFileSync(outputPath, binaryBase64, 'utf-8');

        console.log('\nConversion completed successfully!');
        console.log(
            `File size reduced from ${(stats.originalSize / 1024).toFixed(1)} KB to ${(stats.compressedSize / 1024).toFixed(1)} KB`,
        );
    } catch (error) {
        console.error('Error converting cache file:', error);
        process.exit(1);
    }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        console.log('Usage: node convert-cache.js <input.json> <output.txt>');
        console.log('');
        console.log('Converts exchange rate cache from JSON to binary format');
        console.log('');
        console.log('Example:');
        console.log('  node convert-cache.js exchange-rate-cache.json exchange-rate-cache.bin');
        process.exit(1);
    }

    const [inputPath, outputPath] = args;
    convertCacheFile(inputPath, outputPath);
}

export { convertCacheFile };

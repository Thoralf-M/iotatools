// Helper script to compress and encode exchange rate cache data for Svelte usage
// Usage: fetch staking rewards and open the browser console to see the cached data output.
// Copy the cached data into src/lib/lib/exchange-rate-cache.json and then run:
// ts-node scripts/compress-exchange-rate-cache.ts src/lib/lib/exchange-rate-cache.json src/lib/lib/exchange-rate-cache.json

import { encode as msgpackEncode } from '@msgpack/msgpack';
import { deflate } from 'pako';
import * as fs from 'fs';

function compressExchangeRateCache(data: any): string {
    const binary = msgpackEncode(data);
    const compressed = deflate(binary);
    return Buffer.from(compressed!).toString('base64');
}

function main() {
    const [, , inputPath, outputPath] = process.argv;
    if (!inputPath || !outputPath) {
        console.error('Usage: node compress-exchange-rate-cache.js <input.json> <output.json>');
        process.exit(1);
    }
    const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const base64 = compressExchangeRateCache(inputData);
    fs.writeFileSync(outputPath, JSON.stringify({ data: base64 }, null, 2));
    console.log(`Compressed cache written to ${outputPath}`);
}

main();

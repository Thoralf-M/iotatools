/**
 * Example of how to use the binary exchange rate cache format
 *
 * This file demonstrates loading cache data from binary format
 * and provides backward compatibility with JSON format.
 */

// For production, you would import the binary cache data like this:
// import exchangeRateCacheBinary from '../lib/exchange-rate-cache.bin?raw';

import {
    exportExchangeRateCacheToBinary,
    getExchangeRateCacheCompressionStats,
    setInitialExchangeRateCache,
    setInitialExchangeRateCacheFromBinary,
    type ExchangeRateCacheEntry,
} from '../index';

/**
 * Load cache data with automatic format detection
 */
export function loadExchangeRateCache(data: string | ExchangeRateCacheEntry[]) {
    try {
        if (typeof data === 'string') {
            // Try to load as binary format first
            try {
                setInitialExchangeRateCacheFromBinary(data);
                console.log('Loaded exchange rate cache from binary format');
                return;
            } catch (binaryError) {
                const errorMsg =
                    binaryError instanceof Error ? binaryError.message : 'Unknown error';
                console.log('Binary format failed, trying JSON...', errorMsg);

                // Fallback to JSON format
                try {
                    const jsonData = JSON.parse(data);
                    setInitialExchangeRateCache(jsonData);
                    console.log('Loaded exchange rate cache from JSON format');
                    return;
                } catch (jsonError) {
                    const jsonErrorMsg =
                        jsonError instanceof Error ? jsonError.message : 'Unknown error';
                    throw new Error(
                        `Failed to load cache in both binary and JSON formats: ${jsonErrorMsg}`,
                    );
                }
            }
        } else if (Array.isArray(data)) {
            // Direct cache data array
            setInitialExchangeRateCache(data);
            console.log('Loaded exchange rate cache from direct data');
        } else {
            throw new Error('Invalid cache data format');
        }
    } catch (error) {
        console.error('Failed to load exchange rate cache:', error);
        throw error;
    }
}

/**
 * Export current cache to binary format for storage
 */
export function exportCurrentCacheToBinary(): string {
    return exportExchangeRateCacheToBinary();
}

/**
 * Get compression statistics for current cache
 */
export function getCacheCompressionInfo() {
    return getExchangeRateCacheCompressionStats();
}

/**
 * Example usage in a Svelte component
 */
export const exampleSvelteUsage = `
<script lang="ts">
    import { onMount } from 'svelte';
    import { loadExchangeRateCache } from './cache-loader';
    
    // Option 1: Load from binary cache file (recommended)
    import exchangeRateCacheBinary from '../lib/exchange-rate-cache.bin?raw';
    
    // Option 2: Load from JSON (fallback)
    // import exchangeRateCacheJson from '../lib/exchange-rate-cache.json';
    
    onMount(() => {
        try {
            // Load binary cache (much faster and smaller)
            loadExchangeRateCache(exchangeRateCacheBinary);
        } catch (error) {
            console.error('Failed to load binary cache, falling back to JSON');
            // Fallback to JSON if binary fails
            // loadExchangeRateCache(exchangeRateCacheJson);
        }
    });
</script>
`;

/**
 * Example usage in a Node.js environment
 */
export const exampleNodeUsage = `
import { readFileSync } from 'fs';
import { loadExchangeRateCache } from './cache-loader';

// Load binary cache
try {
    const binaryCache = readFileSync('./exchange-rate-cache.bin', 'utf-8');
    loadExchangeRateCache(binaryCache);
    console.log('Loaded binary cache successfully');
} catch (error) {
    // Fallback to JSON
    const jsonCache = readFileSync('./exchange-rate-cache.json', 'utf-8');
    loadExchangeRateCache(jsonCache);
    console.log('Loaded JSON cache as fallback');
}
`;

/**
 * Conversion script example
 */
export const conversionScriptExample = `
// Convert existing JSON cache to binary format
import { readFileSync, writeFileSync } from 'fs';
import { compressExchangeRateCache } from './binary-cache';

const jsonData = readFileSync('./exchange-rate-cache.json', 'utf-8');
const cacheData = JSON.parse(jsonData);
const binaryData = compressExchangeRateCache(cacheData);

writeFileSync('./exchange-rate-cache.bin', binaryData, 'utf-8');
console.log('Conversion completed!');
`;

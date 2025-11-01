// Price fetching utilities using the CoinGecko API
import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

import { getSelectedNetworkConfig } from '../client';
import { fetchEpochEndTimestamp } from './graphql-requests';

export interface FetchPricesParams {
    epochs: number[]; // list of epoch numbers (index aligned with epochEndDates)
    epochEndDates: string[]; // formatted end date strings 'YYYY-MM-DD HH:mm'
    currentEpoch: number;
    selectedCurrency: 'usd' | 'eur';
    loadedCache: Record<string, { usd: number; eur: number }>; // cache keyed by DD-MM-YYYY
}

export interface FetchPricesResult {
    epochPrices: Record<number, number>;
    updatedCache?: Record<string, { usd: number; eur: number }>; // for persistence
    error?: string;
}

// Helper: format date (YYYY-MM-DD HH:mm) to DD-MM-YYYY for CoinGecko history endpoint
export function formatDateForCoinGecko(dateStr: string): string {
    const [date] = dateStr.split(' ');
    const [yyyy, mm, dd] = date.split('-');
    return `${dd}-${mm}-${yyyy}`;
}

// Helper: format Date object to DD-MM-YYYY for CoinGecko
function formatDateForCoinGeckoFromDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Rate limiting constants
const EPOCH_RATE_LIMIT_MS = 5000; // 5 seconds between epochs
const PRICE_RATE_LIMIT_MS = 1000; // 1 second between price fetches (increased for CoinGecko free tier)
const MAX_RETRIES = 10; // Maximum retries for rate limited requests
const RETRY_DELAY_MS = 10000; // 10 seconds base delay for retries

// Helper: apply rate limiting delay
function applyRateLimit(delayMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
}

// Helper: fetch price data from CoinGecko for a specific date
async function fetchCoinGeckoPrice(dateStr: string): Promise<{ usd: number; eur: number } | null> {
    const url = `https://api.coingecko.com/api/v3/coins/iota/history?date=${dateStr}`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fetch(url);

            if (res.ok) {
                const data = await res.json();
                const usd = data?.market_data?.current_price?.['usd'];
                const eur = data?.market_data?.current_price?.['eur'];

                if (typeof usd === 'number' || typeof eur === 'number') {
                    return { usd, eur };
                }
                return null;
            }

            if (res.status === 429) {
                // Rate limited - wait longer before retry
                if (attempt < MAX_RETRIES) {
                    const delay = RETRY_DELAY_MS * Math.pow(2, attempt); // Exponential backoff
                    console.warn(
                        `Rate limited for date ${dateStr}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
                    );
                    await applyRateLimit(delay);
                    continue;
                } else {
                    console.warn(
                        `Rate limit exceeded for date ${dateStr} after ${MAX_RETRIES + 1} attempts`,
                    );
                    return null;
                }
            }

            // Other HTTP errors - don't retry
            console.warn(`API error for date ${dateStr}: ${res.status}`);
            return null;
        } catch (error) {
            // Network errors (timeouts, connection failures) - retry
            if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt); // Exponential backoff
                console.warn(
                    `Network error for date ${dateStr}: ${error instanceof Error ? error.message : String(error)}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
                );
                await applyRateLimit(delay);
                continue;
            } else {
                console.warn(
                    `Network error for date ${dateStr} after ${MAX_RETRIES + 1} attempts: ${error instanceof Error ? error.message : String(error)}`,
                );
                return null;
            }
        }
    }

    return null;
}

// Helper: fetch prices for multiple dates with rate limiting
async function fetchPricesForDates(
    dateStrings: string[],
): Promise<Record<string, { usd: number; eur: number }>> {
    const pricesCache: Record<string, { usd: number; eur: number }> = {};

    for (const dateStr of dateStrings) {
        try {
            const priceData = await fetchCoinGeckoPrice(dateStr);
            if (priceData) {
                pricesCache[dateStr] = priceData;
            }

            // Rate limiting between price fetches
            await applyRateLimit(PRICE_RATE_LIMIT_MS);
        } catch (e) {
            console.warn(`Failed to fetch price for date ${dateStr}:`, e);
        }
    }

    return pricesCache;
}

// Reload prices strictly from existing CoinGecko cache without hitting network
export function reloadFromCoinGeckoCache(params: {
    epochs: number[];
    epochEndDates: string[];
    selectedCurrency: 'usd' | 'eur';
    loadedCache: Record<string, { usd: number; eur: number }>;
}): Record<number, number> {
    const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
    const newEpochPrices: Record<number, number> = {};
    for (let i = 0; i < epochs.length; i++) {
        const dateStr = epochEndDates[i];
        if (!dateStr) continue;
        const formatted = formatDateForCoinGecko(dateStr); // DD-MM-YYYY
        const cached = loadedCache[formatted];
        if (!cached) continue;
        if (selectedCurrency === 'usd' && typeof cached.usd === 'number')
            newEpochPrices[epochs[i]] = cached.usd;
        else if (selectedCurrency === 'eur' && typeof cached.eur === 'number')
            newEpochPrices[epochs[i]] = cached.eur;
    }
    return newEpochPrices;
}

// Core fetch function handling both providers
export async function fetchAllPrices(params: FetchPricesParams): Promise<FetchPricesResult> {
    const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
    let epochPrices: Record<number, number> = {};

    // CoinGecko (per-day fetch with retry) using history endpoint
    let cache: Record<string, { usd: number; eur: number }> = { ...loadedCache };
    const now = new Date();

    for (let i = 0; i < epochs.length; i++) {
        const epoch = epochs[i];
        const dateStr = epochEndDates[i];
        if (!dateStr) continue;
        const endDate = new Date(dateStr);
        if (endDate > now) continue; // skip future epoch
        const formatted = formatDateForCoinGecko(dateStr); // DD-MM-YYYY
        const cached = cache[formatted];
        if (cached) {
            if (selectedCurrency === 'usd' && typeof cached.usd === 'number')
                epochPrices[epoch] = cached.usd;
            else if (selectedCurrency === 'eur' && typeof cached.eur === 'number')
                epochPrices[epoch] = cached.eur;
            continue;
        }
        let success = false;
        let attempt = 0;
        while (!success && attempt < 5) {
            try {
                const priceData = await fetchCoinGeckoPrice(formatted);
                if (!priceData) throw new Error('No price data for epoch ' + epoch);
                const { usd, eur } = priceData;
                if (typeof usd === 'number' && selectedCurrency === 'usd') epochPrices[epoch] = usd;
                if (typeof eur === 'number' && selectedCurrency === 'eur') epochPrices[epoch] = eur;
                cache[formatted] = { usd, eur };
                success = true;
            } catch (e) {
                attempt++;
                if (attempt >= 5) {
                    return {
                        epochPrices,
                        updatedCache: cache,
                        error:
                            typeof e === 'object' && e && 'message' in (e as any)
                                ? (e as any).message
                                : 'Failed to fetch prices',
                    };
                }
                await new Promise((r) => setTimeout(r, attempt * 10000));
            }
        }
        if (i < epochs.length - 1) {
            await applyRateLimit(EPOCH_RATE_LIMIT_MS); // rate limit mitigation
        }
    }

    return { epochPrices, updatedCache: cache };
}

/**
 * Update prices cache with all historical data
 * This fetches complete price data for cache initialization
 * If existingCache is provided, only fetches missing dates
 */
export async function updatePricesCache(
    existingCache?: Record<string, { usd: number; eur: number }>,
): Promise<Record<string, { usd: number; eur: number }>> {
    console.log('Fetching all historical IOTA prices...');

    // Get current epoch to determine date range
    const gqlClient = new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });

    const epochQuery = `query { epoch { epochId } }`;
    // @ts-ignore
    const epochResult = await gqlClient.query({ query: epochQuery });
    // @ts-ignore
    const currentEpoch = epochResult.data?.epoch?.epochId || 1;

    console.log(`Current epoch: ${currentEpoch}`);

    // Fetch timestamps for all epochs to determine date range
    const timestamps: Record<number, number> = {};
    for (let epoch = 1; epoch <= currentEpoch; epoch++) {
        try {
            const timestamp = await fetchEpochEndTimestamp(epoch);
            if (timestamp) {
                timestamps[epoch] = timestamp;
            }
        } catch (e) {
            console.warn(`Failed to fetch timestamp for epoch ${epoch}:`, e);
        }
    }

    console.log(`Fetched timestamps for ${Object.keys(timestamps).length} epochs`);

    // Generate date range from epoch 1 to current
    const dates = new Set<string>();
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1); // Only fetch data up to yesterday to avoid incomplete CoinGecko data

    Object.values(timestamps).forEach((timestamp) => {
        const date = new Date(timestamp * 1000);
        // Skip dates that are today or in the future
        if (date > yesterday) {
            return;
        }
        const dateStr = formatDateForCoinGeckoFromDate(date);
        dates.add(dateStr);
    });

    console.log(
        `Fetching prices for ${dates.size} dates (up to ${formatDateForCoinGeckoFromDate(yesterday)})...`,
    );

    // Filter out dates that already exist in cache
    const existingCacheKeys = existingCache ? Object.keys(existingCache) : [];
    const missingDates = Array.from(dates).filter((date) => !existingCacheKeys.includes(date));

    if (missingDates.length === 0) {
        console.log('All dates already cached, no new data to fetch');
        return existingCache || {};
    }

    // Sort dates from oldest to newest to fill gaps chronologically
    const sortedMissingDates = missingDates.sort(); // Oldest first

    console.log(
        `Found ${missingDates.length} missing dates, fetching all from oldest to newest...`,
    );

    // Fetch prices for all missing dates
    const newPricesCache = await fetchPricesForDates(sortedMissingDates);

    // Merge with existing cache
    const updatedCache = { ...(existingCache || {}), ...newPricesCache };
    const successCount = Object.keys(newPricesCache).length;

    console.log(
        `Prices cache updated with ${successCount} new dates (total: ${Object.keys(updatedCache).length})`,
    );
    return updatedCache;
}

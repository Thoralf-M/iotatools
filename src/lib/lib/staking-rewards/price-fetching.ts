// Price fetching utilities using the CoinGecko API
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
                const url = `https://api.coingecko.com/api/v3/coins/iota/history?date=${formatted}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('API error for epoch ' + epoch);
                const data = await res.json();
                const usd = data?.market_data?.current_price?.['usd'];
                const eur = data?.market_data?.current_price?.['eur'];
                if (typeof usd !== 'number' && typeof eur !== 'number')
                    throw new Error('No price data for epoch ' + epoch);
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
            await new Promise((r) => setTimeout(r, 5000)); // rate limit mitigation
        }
    }

    return { epochPrices, updatedCache: cache };
}

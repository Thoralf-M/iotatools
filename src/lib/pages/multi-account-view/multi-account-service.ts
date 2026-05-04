import { getClient } from '../../utils/client';
import { computeStakingRewards } from '../../utils/staking-utils';

export interface ExtendedAccount {
    id: string;
    address: string;
    label: string | undefined;
    objects: ExtendedObject[];
    timelockedObjects: ExtendedObject[];
    stakingRewards: bigint;
    isCollapsed: boolean;
}

export interface ExtendedObject {
    id: string;
    label: string;
    data: any;
    currentOwner: string;
}

/**
 * Compute staking rewards for all accounts
 */
export async function computeAllStakingRewards(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const client = getClient();
        const updatedAccounts = await Promise.all(
            accounts.map(async (account) => {
                // Collect all staked objects (both regular and timelocked)
                const stakedIotaObjects = account.objects.filter(
                    (obj) => obj.label === 'StakedIota',
                );
                const timelockedStakedIotaObjects = account.timelockedObjects.filter(
                    (obj) => obj.label === 'TimelockedStakedIota',
                );
                const allStakedObjects = [...stakedIotaObjects, ...timelockedStakedIotaObjects];

                // Calculate rewards in parallel for all staked objects
                const rewardsPromises = allStakedObjects.map(async (obj) => {
                    try {
                        const stakeData = await computeStakingRewards(
                            client,
                            obj.id,
                            account.address,
                        );
                        return BigInt(stakeData.rewards);
                    } catch (err) {
                        console.warn(`Failed to compute rewards for ${obj.label} ${obj.id}:`, err);
                        return BigInt(0);
                    }
                });

                const rewards = await Promise.all(rewardsPromises);
                const totalRewards = rewards.reduce((sum, reward) => sum + reward, BigInt(0));

                return { ...account, stakingRewards: totalRewards };
            }),
        );
        return updatedAccounts;
    } catch (err: any) {
        console.error('Error computing staking rewards:', err);
        throw err;
    }
}

/**
 * Fetch objects for all accounts
 */
export async function getObjectsForAccounts(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const client = getClient();
        // Iterate over accounts, get the owned objects for each account
        const updatedAccounts = await Promise.all(
            accounts.map(async (account) => {
                // Fetch all pages of owned objects
                let allData: any[] = [];
                let cursor: string | null | undefined = null;
                let hasNextPage = true;

                while (hasNextPage) {
                    const result = await client.getOwnedObjects({
                        owner: account.address,
                        options: { showContent: true, showType: true },
                        cursor,
                    });

                    allData = allData.concat(result.data);
                    hasNextPage = result.hasNextPage;
                    cursor = result.nextCursor;
                }

                // Map the returned objects to the expected format
                const objects = allData.map((obj) => {
                    // @ts-ignore
                    let label = obj.data.content?.type;
                    if (typeof label === 'string') {
                        // Only show the actual type name
                        label = label.split('::').slice(2).join('::');
                    }
                    return {
                        // @ts-ignore
                        id: obj.data.objectId,
                        label,
                        data: obj.data,
                        currentOwner: account.address,
                    };
                });

                // separate timelocked objects
                const timelockedObjects: ExtendedObject[] = [];
                const filteredObjects: ExtendedObject[] = [];
                for (const obj of objects) {
                    if (obj.label === 'TimelockedStakedIota' || obj.label.startsWith('TimeLock<')) {
                        timelockedObjects.push(obj);
                    } else {
                        filteredObjects.push(obj);
                    }
                }

                return { ...account, objects: filteredObjects, timelockedObjects };
            }),
        );
        return updatedAccounts;
    } catch (err: any) {
        console.error('Error fetching objects:', err);
        throw err;
    }
}

// ─── IOTA price (CoinGecko) ─────────────────────────────────────────────
// Cached in localStorage so reloads / cross-page navigation don't hammer
// CoinGecko's free tier (which rate-limits aggressively). The "Fetch
// Price" button bypasses the cache when called without `maxAgeMs`.

const PRICE_CACHE_KEY = 'iota-price-cache-v1';
type CachedPrice = { usd: number; eur: number; fetchedAt: number };

function readPriceCache(): CachedPrice | null {
    try {
        const raw = typeof localStorage !== 'undefined' && localStorage.getItem(PRICE_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            parsed &&
            typeof parsed.fetchedAt === 'number' &&
            (typeof parsed.usd === 'number' || typeof parsed.eur === 'number')
        ) {
            return parsed as CachedPrice;
        }
        return null;
    } catch {
        return null;
    }
}

function writePriceCache(price: { usd: number; eur: number }): void {
    try {
        if (typeof localStorage === 'undefined') return;
        const data: CachedPrice = { ...price, fetchedAt: Date.now() };
        localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(data));
    } catch (err) {
        console.warn('Failed to write price cache:', err);
    }
}

/**
 * Fetch the current IOTA price from CoinGecko, optionally serving from a
 * localStorage cache when fresh enough.
 *
 * Pass `maxAgeMs > 0` from auto-fetch paths (component mount, page nav)
 * so reloads within the freshness window reuse the cached value. Omit the
 * option (or pass 0) for the manual "Fetch Price" button so the user can
 * force a refresh.
 *
 * A successful fetch always updates the cache, regardless of whether the
 * call hit the network or not.
 */
export async function fetchCurrentPrice(
    opts: { maxAgeMs?: number } = {},
): Promise<{ usd: number; eur: number } | null> {
    const maxAgeMs = opts.maxAgeMs ?? 0;
    if (maxAgeMs > 0) {
        const cached = readPriceCache();
        if (cached && Date.now() - cached.fetchedAt < maxAgeMs) {
            return { usd: cached.usd, eur: cached.eur };
        }
    }
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/iota';
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const usd = data?.market_data?.current_price?.usd;
            const eur = data?.market_data?.current_price?.eur;
            if (typeof usd === 'number' || typeof eur === 'number') {
                const price = { usd, eur };
                writePriceCache(price);
                return price;
            }
        }
        return null;
    } catch (err) {
        console.error('Failed to fetch current price:', err);
        return null;
    }
}

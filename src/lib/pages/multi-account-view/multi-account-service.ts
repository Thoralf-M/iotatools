import { getClient, getSelectedNetworkConfig } from '../../utils/client';
import { computeStakingRewards } from '../../utils/staking-utils';
import { GraphQlClient } from '../../utils/wasm-sdk';

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

const OWNED_OBJECTS_QUERY = `
    query getOwnedObjects($owner: IotaAddress!, $cursor: String) {
        address(address: $owner) {
            objects(after: $cursor) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    address
                    digest
                    version
                    contents {
                        type {
                            repr
                        }
                        json
                    }
                }
            }
        }
    }
`;

/**
 * Flatten GraphQL JSON fields to match the old JSON-RPC content.fields shape.
 * GraphQL returns Balance values as { value: "123" } objects, but the old
 * JSON-RPC API returned them as plain strings like "123".
 * Also wraps nested move objects (like staked_iota) in a { fields: { ... } }
 * wrapper to match the old content.fields nesting.
 */
function flattenJsonFields(json: any): any {
    if (json == null || typeof json !== 'object') {
        return json;
    }
    if (Array.isArray(json)) {
        return json.map(flattenJsonFields);
    }
    // If the object has only a "value" key, unwrap it to the plain value
    const keys = Object.keys(json);
    if (keys.length === 1 && keys[0] === 'value') {
        return json.value;
    }
    // Otherwise recursively flatten each property
    const result: any = {};
    for (const key of keys) {
        const val = json[key];
        if (val != null && typeof val === 'object' && !Array.isArray(val)) {
            const valKeys = Object.keys(val);
            // If it's a { value: ... } wrapper, unwrap it
            if (valKeys.length === 1 && valKeys[0] === 'value') {
                result[key] = val.value;
            } else {
                // It's a nested object (like staked_iota) - wrap in { fields: { ... } }
                // to match the old JSON-RPC nesting pattern
                result[key] = { fields: flattenJsonFields(val) };
            }
        } else {
            result[key] = flattenJsonFields(val);
        }
    }
    return result;
}

/**
 * Normalize zero-padded addresses in type representations to short form.
 * GraphQL returns e.g. 0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin
 * but the old JSON-RPC API returned 0x2::coin::Coin.
 */
function normalizeTypeRepr(type: string): string {
    return type.replace(/0x0{1,63}([0-9a-fA-F]+)/g, '0x$1');
}

/**
 * Transform a GraphQL object node into the old JSON-RPC data shape.
 * This preserves compatibility with the MultiAccountView component which
 * accesses obj.data.content.type, obj.data.content.fields, obj.data.objectId, etc.
 */
function transformGraphQlObject(node: any): any {
    const rawType = node.contents?.type?.repr;
    const type = rawType ? normalizeTypeRepr(rawType) : '';
    const json = node.contents?.json;
    const fields = json ? flattenJsonFields(json) : {};

    return {
        objectId: node.address,
        digest: node.digest,
        version: node.version,
        content: {
            type,
            fields,
        },
    };
}

/**
 * Compute staking rewards for all accounts
 */
export async function computeAllStakingRewards(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const client = getClient();
        // Process accounts sequentially (WASM GraphQlClient doesn't support concurrent queries)
        const updatedAccounts: ExtendedAccount[] = [];
        for (const account of accounts) {
            const stakedIotaObjects = account.objects.filter((obj) => obj.label === 'StakedIota');
            const timelockedStakedIotaObjects = account.timelockedObjects.filter(
                (obj) => obj.label === 'TimelockedStakedIota',
            );
            const allStakedObjects = [...stakedIotaObjects, ...timelockedStakedIotaObjects];

            let totalRewards = BigInt(0);
            for (const obj of allStakedObjects) {
                try {
                    const stakeData = await computeStakingRewards(client, obj.id, account.address);
                    totalRewards += BigInt(stakeData.rewards);
                } catch (err) {
                    console.warn(`Failed to compute rewards for ${obj.label} ${obj.id}:`, err);
                }
            }

            updatedAccounts.push({ ...account, stakingRewards: totalRewards });
        }
        return updatedAccounts;
    } catch (err: any) {
        console.error('Error computing staking rewards:', err);
        throw err;
    }
}

/**
 * Fetch objects for all accounts using GraphQL
 */
export async function getObjectsForAccounts(
    accounts: ExtendedAccount[],
): Promise<ExtendedAccount[]> {
    try {
        const gqlClient = new GraphQlClient(getSelectedNetworkConfig().graphql);

        // Iterate over accounts sequentially (WASM GraphQlClient doesn't support concurrent queries)
        const updatedAccounts: ExtendedAccount[] = [];
        for (const account of accounts) {
            // Fetch all pages of owned objects
            let allNodes: any[] = [];
            let cursor: string | null = null;
            let hasNextPage = true;

            try {
                while (hasNextPage) {
                    const vars: Record<string, string> = { owner: account.address };
                    if (cursor) vars.cursor = cursor;
                    const resultStr = await gqlClient.runQuery({
                        query: OWNED_OBJECTS_QUERY,
                        variables: JSON.stringify(vars),
                    });
                    const result: any = JSON.parse(resultStr);
                    const objectsData = result?.address?.objects;

                    if (!objectsData?.nodes?.length) break;

                    allNodes = allNodes.concat(objectsData.nodes);
                    hasNextPage = objectsData.pageInfo.hasNextPage;
                    cursor = objectsData.pageInfo.endCursor;
                }
            } catch (err: any) {
                // WASM SDK throws "query yielded no data" for addresses with no on-chain presence
                console.warn(`No objects found for ${account.address}:`, err.message || err);
            }

            // Map the returned objects to the expected format
            const objects = allNodes.map((node) => {
                const data = transformGraphQlObject(node);
                let label = data.content?.type;
                if (typeof label === 'string') {
                    // Only show the actual type name
                    label = label.split('::').slice(2).join('::');
                }
                return {
                    id: data.objectId,
                    label,
                    data,
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

            updatedAccounts.push({ ...account, objects: filteredObjects, timelockedObjects });
        }
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

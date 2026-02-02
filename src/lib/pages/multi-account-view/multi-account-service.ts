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
                const objects = allData.map((obj, idx) => {
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

// Fetch current IOTA price from CoinGecko
export async function fetchCurrentPrice(): Promise<{ usd: number; eur: number } | null> {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/iota';
        const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            const usd = data?.market_data?.current_price?.usd;
            const eur = data?.market_data?.current_price?.eur;

            if (typeof usd === 'number' || typeof eur === 'number') {
                return { usd, eur };
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        console.error('Failed to fetch current price:', err);
        return null;
    }
}

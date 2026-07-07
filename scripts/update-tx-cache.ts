/**
 * Refetch the staking-rewards test transaction cache from mainnet.
 *
 * Fetches sent + received stake transactions for the test address (same flow
 * as the staking-rewards page with "Include received" enabled) and rewrites
 * scripts/staking-rewards-tx-cache.json.
 *
 * Run with: npx tsx scripts/update-tx-cache.ts
 *
 * Afterwards regenerate the dependent snapshots:
 *   npx tsx scripts/gen-snapshot.ts 2>/dev/null | grep -E "^(Epoch|---|  ▶|[0-9]+ +\||Address:)" > src/lib/pages/staking-rewards/__snapshots__/epoch-table.snapshot.txt
 *   npx tsx scripts/gen-export-snapshots.ts
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import {
    fetchReceivedStakeTransactions,
    fetchStakeTransactions,
} from '../src/lib/pages/staking-rewards/index.js';
import { MAINNET_CONFIG, setNetworkConfigOverride } from '../src/lib/utils/network-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

setNetworkConfigOverride(MAINNET_CONFIG);

const TEST_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
const TX_CACHE_PATH = join(__dirname, 'staking-rewards-tx-cache.json');

async function main() {
    const sent = await fetchStakeTransactions(TEST_ADDRESS, {});
    const received = await fetchReceivedStakeTransactions(TEST_ADDRESS, {});

    const transactions: any[] = [];
    const seen = new Set<string>();
    for (const tx of [...sent, ...received]) {
        if (seen.has(tx.digest)) continue;
        seen.add(tx.digest);
        transactions.push(tx);
    }

    const cache = {
        address: TEST_ADDRESS,
        fetchReceivedTxs: true,
        timestamp: new Date().toISOString(),
        transactionCount: transactions.length,
        transactions,
    };
    writeFileSync(TX_CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
    console.error(`Wrote ${transactions.length} transactions to ${TX_CACHE_PATH}`);
}

main();

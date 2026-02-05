/**
 * Generate snapshot for staking rewards test with multiple addresses
 * This includes addresses with Transfer actions to test pre-transfer rewards calculation
 *
 * Run with: npx tsx scripts/gen-snapshot-multi.ts 2>/dev/null | grep -E "^(Epoch|---|  ▶|[0-9]+ +\||Address:)" > src/lib/pages/staking-rewards/__snapshots__/epoch-table-multi.snapshot.txt
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import {
    collectActionsByEpoch,
    computeEpochData,
    fetchReceivedStakeTransactions,
    fetchStakeTransactions,
    generateEpochTable,
    getMaxEpochFromCache,
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
    type ActionsByEpoch,
} from '../src/lib/pages/staking-rewards/index.js';
import { MAINNET_CONFIG, setNetworkConfigOverride } from '../src/lib/utils/network-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

setNetworkConfigOverride(MAINNET_CONFIG);

const TEST_ADDRESSES: string[] = [];

const TX_CACHE_PATH = join(__dirname, 'staking-rewards-tx-cache-multi.json');
const EXCHANGE_RATE_CACHE_PATH = join(
    __dirname,
    '../src/lib/pages/staking-rewards/cache/exchange-rate-cache.json',
);

async function fetchAndCacheTransactions(): Promise<Record<string, unknown[]>> {
    if (existsSync(TX_CACHE_PATH)) {
        const cache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
        return cache.transactionsByAddress;
    }

    const transactionsByAddress: Record<string, unknown[]> = {};

    for (const address of TEST_ADDRESSES) {
        const sentTxs = await fetchStakeTransactions(address);
        const receivedTxs = await fetchReceivedStakeTransactions(address);

        const allTxs = [...sentTxs, ...receivedTxs];
        const uniqueTxs = allTxs.reduce((acc: unknown[], tx: { digest: string }) => {
            if (!acc.some((t: unknown) => (t as { digest: string }).digest === tx.digest)) {
                acc.push(tx);
            }
            return acc;
        }, []);

        transactionsByAddress[address] = uniqueTxs;
    }

    writeFileSync(
        TX_CACHE_PATH,
        JSON.stringify(
            {
                addresses: TEST_ADDRESSES,
                transactionsByAddress,
                generatedAt: new Date().toISOString(),
            },
            null,
            2,
        ),
    );

    return transactionsByAddress;
}

async function main() {
    const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
    setInitialExchangeRateCache(exchangeRateCache);

    const maxEpoch = getMaxEpochFromCache(exchangeRateCache);
    const transactionsByAddress = await fetchAndCacheTransactions();

    // Combine all transactions from all addresses
    const allTransactions: unknown[] = [];
    for (const address of TEST_ADDRESSES) {
        const transactions = transactionsByAddress[address] || [];
        allTransactions.push(...transactions);
    }

    if (allTransactions.length === 0) {
        process.stderr.write('No transactions found for any address\n');
        return;
    }

    // Process all transactions with all addresses at once
    // The processor handles deduplication of stake objects transferred between tracked addresses
    const result = await processStakeTransactionsWithExchangeRates(
        allTransactions,
        maxEpoch,
        TEST_ADDRESSES,
    );

    if (result.stakeObjects.length === 0) {
        process.stderr.write('No stake objects found for any address\n');
        return;
    }

    const actionsByEpoch = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
    const tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);

    const lines: string[] = [];
    lines.push(generateEpochTable(tableData, actionsByEpoch));

    process.stdout.write(lines.join('\n'));
}

main();

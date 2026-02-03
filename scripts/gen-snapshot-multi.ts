/**
 * Generate snapshot for staking rewards test with multiple addresses
 * This includes addresses with Transfer actions to test pre-transfer rewards calculation
 *
 * Run with: npx tsx scripts/gen-snapshot-multi.ts 2>/dev/null | grep -E "^(Epoch|---|  ▶|[0-9]+ +\||Address:)" > src/lib/pages/staking-rewards/__snapshots__/epoch-table-multi.snapshot.txt
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { MAINNET_CONFIG, setNetworkConfigOverride } from '../src/lib/utils/network-config.js';
setNetworkConfigOverride(MAINNET_CONFIG);

import {
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
    fetchStakeTransactions,
    fetchReceivedStakeTransactions,
    computeEpochData,
    getMaxEpochFromCache,
    collectActionsByEpoch,
    generateEpochTable,
    type ActionsByEpoch,
} from '../src/lib/pages/staking-rewards/index.js';

const TEST_ADDRESSES: string[] = [];

const TX_CACHE_PATH = join(__dirname, 'staking-rewards-tx-cache-multi.json');
const EXCHANGE_RATE_CACHE_PATH = join(__dirname, '../src/lib/pages/staking-rewards/cache/exchange-rate-cache.json');

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

    writeFileSync(TX_CACHE_PATH, JSON.stringify({
        addresses: TEST_ADDRESSES,
        transactionsByAddress,
        generatedAt: new Date().toISOString(),
    }, null, 2));

    return transactionsByAddress;
}

async function main() {
    const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
    setInitialExchangeRateCache(exchangeRateCache);

    const maxEpoch = getMaxEpochFromCache(exchangeRateCache);
    const transactionsByAddress = await fetchAndCacheTransactions();

    const allStakeObjects: unknown[] = [];
    const combinedValidatorInfo: Record<string, unknown> = {};
    const actionsByEpoch: ActionsByEpoch = {};

    for (const address of TEST_ADDRESSES) {
        const transactions = transactionsByAddress[address] || [];
        if (transactions.length === 0) continue;

        const result = await processStakeTransactionsWithExchangeRates(transactions as unknown[], maxEpoch, address);

        if (result.stakeObjects.length === 0) continue;

        allStakeObjects.push(...result.stakeObjects);
        Object.assign(combinedValidatorInfo, result.validatorInfo);

        const addressActions = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
        for (const [epochStr, actions] of Object.entries(addressActions)) {
            const epoch = parseInt(epochStr);
            if (!actionsByEpoch[epoch]) actionsByEpoch[epoch] = [];
            actionsByEpoch[epoch].push(...actions);
        }
    }

    if (allStakeObjects.length === 0) {
        process.stderr.write('No stake objects found for any address\n');
        return;
    }

    const tableData = computeEpochData(allStakeObjects as Parameters<typeof computeEpochData>[0], combinedValidatorInfo as Parameters<typeof computeEpochData>[1], maxEpoch);

    const lines: string[] = [];
    lines.push(generateEpochTable(tableData, actionsByEpoch));

    process.stdout.write(lines.join('\n'));
}

main();

/**
 * Generate snapshot for staking rewards test
 *
 * Run with: npx tsx scripts/gen-snapshot.ts 2>/dev/null | grep -E "^(Epoch|---|  ▶|[0-9]+ +\||Address:)" > src/lib/pages/staking-rewards/__snapshots__/epoch-table.snapshot.txt
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { MAINNET_CONFIG, setNetworkConfigOverride } from '../src/lib/utils/network-config.js';
setNetworkConfigOverride(MAINNET_CONFIG);

import {
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
    computeEpochData,
    getMaxEpochFromCache,
    collectActionsByEpoch,
    generateEpochTable,
} from '../src/lib/pages/staking-rewards/index.js';

const TEST_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
const TX_CACHE_PATH = join(__dirname, 'staking-rewards-tx-cache.json');
const EXCHANGE_RATE_CACHE_PATH = join(__dirname, '../src/lib/pages/staking-rewards/cache/exchange-rate-cache.json');

async function main() {
    const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
    setInitialExchangeRateCache(exchangeRateCache);

    const txCache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
    const maxEpoch = getMaxEpochFromCache(exchangeRateCache);

    const result = await processStakeTransactionsWithExchangeRates(txCache.transactions, maxEpoch, TEST_ADDRESS);
    const actionsByEpoch = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
    const tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);
    const table = generateEpochTable(tableData, actionsByEpoch);

    process.stdout.write(table);
}

main();

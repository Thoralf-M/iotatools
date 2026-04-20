/**
 * Generate snapshots for CSV and PDF-sections exports
 *
 * Run with: npx tsx scripts/gen-export-snapshots.ts
 *
 * Writes:
 *   - src/lib/pages/staking-rewards/__snapshots__/csv-export-wide.snapshot.csv
 *   - src/lib/pages/staking-rewards/__snapshots__/csv-export-wrapped.snapshot.csv
 *   - src/lib/pages/staking-rewards/__snapshots__/pdf-export-sections.snapshot.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { buildExportSections, sectionsToCsv } from '../src/lib/pages/staking-rewards/csv-export.js';
import {
    collectActionsByEpoch,
    computeEpochData,
    getMaxEpochFromCache,
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
} from '../src/lib/pages/staking-rewards/index.js';
import { formatDateForCoinGecko } from '../src/lib/pages/staking-rewards/price-fetching.js';
import { sectionsSkeleton } from '../src/lib/pages/staking-rewards/test-utils.js';
import type { ExportOptions } from '../src/lib/pages/staking-rewards/types.js';
import { MAINNET_CONFIG, setNetworkConfigOverride } from '../src/lib/utils/network-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** UTC formatter so regenerated snapshots don't drift with the runner's timezone. */
function formatDateUTC(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
        ` ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
    );
}

setNetworkConfigOverride(MAINNET_CONFIG);

const TEST_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
const TX_CACHE_PATH = join(__dirname, 'staking-rewards-tx-cache.json');
const EXCHANGE_RATE_CACHE_PATH = join(
    __dirname,
    '../src/lib/pages/staking-rewards/cache/exchange-rate-cache.json',
);
const EPOCH_TIMESTAMPS_CACHE_PATH = join(
    __dirname,
    '../src/lib/pages/staking-rewards/cache/mainnet-epoch-timestamps-cache.json',
);
const PRICES_CACHE_PATH = join(
    __dirname,
    '../src/lib/pages/staking-rewards/cache/iota-prices-coingecko.json',
);
const SNAPSHOT_DIR = join(__dirname, '../src/lib/pages/staking-rewards/__snapshots__');

// Narrow window keeps snapshots readable and stable. These epochs exist in
// the committed caches so the snapshot is fully deterministic. Picked to
// overlap a known Unstake + Partial Unstake at epochs 128/146 so the
// snapshots exercise the action-row code path.
const EPOCH_RANGE_START = 125;
const EPOCH_RANGE_END = 150;

async function main() {
    const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
    setInitialExchangeRateCache(exchangeRateCache);
    const epochTimestamps: Record<string, number> = JSON.parse(
        readFileSync(EPOCH_TIMESTAMPS_CACHE_PATH, 'utf-8'),
    );
    const pricesCache: Record<string, { usd: number; eur: number }> = JSON.parse(
        readFileSync(PRICES_CACHE_PATH, 'utf-8'),
    );

    const txCache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
    const maxEpoch = getMaxEpochFromCache(exchangeRateCache);
    const result = await processStakeTransactionsWithExchangeRates(
        txCache.transactions,
        maxEpoch,
        TEST_ADDRESS,
    );
    const tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);
    // collectActionsByEpoch is invoked for parity with the UI pipeline even
    // though buildExportSections reads actions straight off the stake objects.
    collectActionsByEpoch(result.stakeObjects, result.validatorInfo);

    const epochs = tableData.epochs.filter((e) => e >= EPOCH_RANGE_START && e <= EPOCH_RANGE_END);
    const epochEndDates = epochs.map((e) => {
        const ts = epochTimestamps[String(e)];
        return ts ? formatDateUTC(new Date(ts * 1000)) : '';
    });

    const epochPrices: Record<number, number> = {};
    for (let i = 0; i < epochs.length; i++) {
        const key = formatDateForCoinGecko(epochEndDates[i]);
        const entry = pricesCache[key];
        if (entry?.usd !== undefined) epochPrices[epochs[i]] = entry.usd;
    }

    const baseInputs = {
        epochs,
        epochEndDates,
        currentEpoch: maxEpoch,
        stakeObjects: result.stakeObjects,
        uniqueValidators: tableData.uniqueValidators,
        epochData: tableData.epochData,
    };

    const wideOptions: ExportOptions = {
        showPriceColumns: true,
        showValidatorColumns: true,
        epochPrices,
        selectedCurrency: 'usd',
        wrapStakeObjects: false,
        wrapValidators: false,
    };

    const wrappedOptions: ExportOptions = {
        showPriceColumns: true,
        showValidatorColumns: true,
        epochPrices,
        selectedCurrency: 'usd',
        wrapStakeObjects: true,
        wrapValidators: true,
    };

    const wideSections = buildExportSections({ ...baseInputs, options: wideOptions });
    const wrappedSections = buildExportSections({ ...baseInputs, options: wrappedOptions });

    writeFileSync(join(SNAPSHOT_DIR, 'csv-export-wide.snapshot.csv'), sectionsToCsv(wideSections));
    writeFileSync(
        join(SNAPSHOT_DIR, 'csv-export-wrapped.snapshot.csv'),
        sectionsToCsv(wrappedSections),
    );
    writeFileSync(
        join(SNAPSHOT_DIR, 'pdf-export-sections.snapshot.json'),
        JSON.stringify(sectionsSkeleton(wrappedSections), null, 2) + '\n',
    );

    console.log('Wrote CSV (wide + wrapped) and PDF-sections snapshots to', SNAPSHOT_DIR);
}

main();

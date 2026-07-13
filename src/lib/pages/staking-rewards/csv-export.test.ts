/**
 * CSV + PDF export snapshot tests.
 *
 * Regenerate after intentional format changes:
 *   npx tsx scripts/gen-export-snapshots.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// Mock fetchSystemState and fetchAllExchangeRates to avoid WASM initialization in jsdom.
vi.mock('./graphql-requests', async (importOriginal) => {
    const { readFileSync: fsReadFileSync } = await import('fs');
    const { join: pathJoin } = await import('path');
    const cacheData: Array<{ poolId: string; exchangeRateId: string }> = JSON.parse(
        fsReadFileSync(pathJoin(import.meta.dirname, 'cache/exchange-rate-cache.json'), 'utf-8'),
    );
    const validatorNames: Record<string, string> = JSON.parse(
        fsReadFileSync(pathJoin(import.meta.dirname, 'cache/validator-info-cache.json'), 'utf-8'),
    );
    const mockSystemState = {
        json: {
            validators: {
                active_validators: cacheData.map((entry) => ({
                    staking_pool: {
                        id: entry.poolId,
                        exchange_rates: { id: entry.exchangeRateId },
                    },
                    metadata: { name: validatorNames[entry.poolId] || 'Unknown Validator' },
                })),
                inactive_validators: { size: 0 },
            },
        },
    };
    const mod = await importOriginal<typeof import('./graphql-requests')>();
    return {
        ...mod,
        fetchSystemState: vi.fn().mockResolvedValue([mockSystemState]),
        fetchAllExchangeRates: vi.fn().mockResolvedValue(undefined),
    };
});

import { MAINNET_CONFIG, setNetworkConfigOverride } from '../../utils/network-config.js';
import { buildExportSections, sectionsToCsv } from './csv-export.js';
/**
 * UTC date formatter — matches the shape of {@link formatDate} from
 * `formatting.ts` but pins the timezone so snapshot tests are stable
 * regardless of the runner's local time (CI is UTC, dev machines vary).
 */
function formatDateUTC(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
        ` ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
    );
}
import {
    computeEpochData,
    getMaxEpochFromCache,
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
} from './index.js';
import { formatDateForCoinGecko } from './price-fetching.js';
import { sectionsSkeleton } from './test-utils.js';
import type { ExportOptions } from './types.js';

const TEST_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';

const TX_CACHE_PATH = join(__dirname, '../../../../scripts/staking-rewards-tx-cache.json');
const EXCHANGE_RATE_CACHE_PATH = join(__dirname, 'cache/exchange-rate-cache.json');
const EPOCH_TIMESTAMPS_CACHE_PATH = join(__dirname, 'cache/mainnet-epoch-timestamps-cache.json');
const PRICES_CACHE_PATH = join(__dirname, 'cache/iota-prices-coingecko.json');
const SNAPSHOT_DIR = join(__dirname, '__snapshots__');

// Must match gen-export-snapshots.ts.
const EPOCH_RANGE_START = 125;
const EPOCH_RANGE_END = 150;

describe('CSV / PDF export - snapshot', () => {
    let baseInputs: Omit<Parameters<typeof buildExportSections>[0], 'options'>;
    let epochPrices: Record<number, number>;

    beforeAll(async () => {
        setNetworkConfigOverride(MAINNET_CONFIG);

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

        const epochs = tableData.epochs.filter(
            (e) => e >= EPOCH_RANGE_START && e <= EPOCH_RANGE_END,
        );
        const epochEndDates = epochs.map((e) => {
            const ts = epochTimestamps[String(e)];
            return ts ? formatDateUTC(new Date(ts * 1000)) : '';
        });

        epochPrices = {};
        for (let i = 0; i < epochs.length; i++) {
            const key = formatDateForCoinGecko(epochEndDates[i]);
            const entry = pricesCache[key];
            if (entry?.usd !== undefined) epochPrices[epochs[i]] = entry.usd;
        }

        baseInputs = {
            epochs,
            epochEndDates,
            currentEpoch: maxEpoch,
            stakeObjects: result.stakeObjects,
            uniqueValidators: tableData.uniqueValidators,
            epochData: tableData.epochData,
        };
    });

    it('matches the wide CSV snapshot (prices + validators, no wrap)', () => {
        const options: ExportOptions = {
            showPriceColumns: true,
            showValidatorColumns: true,
            epochPrices,
            selectedCurrency: 'usd',
            wrapStakeObjects: false,
            wrapValidators: false,
        };
        const generated = sectionsToCsv(buildExportSections({ ...baseInputs, options }));
        const expected = readFileSync(join(SNAPSHOT_DIR, 'csv-export-wide.snapshot.csv'), 'utf-8');
        expect(generated).toBe(expected);
    });

    it('matches the wrapped CSV snapshot (stake + validator long sections)', () => {
        const options: ExportOptions = {
            showPriceColumns: true,
            showValidatorColumns: true,
            epochPrices,
            selectedCurrency: 'usd',
            wrapStakeObjects: true,
            wrapValidators: true,
        };
        const generated = sectionsToCsv(buildExportSections({ ...baseInputs, options }));
        const expected = readFileSync(
            join(SNAPSHOT_DIR, 'csv-export-wrapped.snapshot.csv'),
            'utf-8',
        );
        expect(generated).toBe(expected);
    });

    // PDF binary output isn't snapshot-stable (timestamps/random IDs get
    // embedded), so we snapshot a compact skeleton of the ExportSection[]
    // structure that jsPDF consumes (titles, headers, row counts, a few
    // sample rows). Full content is already covered by the CSV snapshots
    // above — the PDF test just pins the data contract.
    it('matches the PDF-sections skeleton snapshot (wrapped format)', () => {
        const options: ExportOptions = {
            showPriceColumns: true,
            showValidatorColumns: true,
            epochPrices,
            selectedCurrency: 'usd',
            wrapStakeObjects: true,
            wrapValidators: true,
        };
        const sections = buildExportSections({ ...baseInputs, options });
        const generated = JSON.stringify(sectionsSkeleton(sections), null, 2) + '\n';
        const expected = readFileSync(
            join(SNAPSHOT_DIR, 'pdf-export-sections.snapshot.json'),
            'utf-8',
        );
        expect(generated).toBe(expected);
    });

    it('wide CSV has exactly one header row and no section separators', () => {
        const options: ExportOptions = {
            showPriceColumns: false,
            showValidatorColumns: false,
            epochPrices: {},
            selectedCurrency: 'usd',
        };
        const sections = buildExportSections({ ...baseInputs, options });
        expect(sections).toHaveLength(1);
        expect(sections[0].title).toBeUndefined();
        expect(sections[0].headers[0]).toBe('Epoch');
    });

    it('wrapped mode emits separate sections for stake objects and validators', () => {
        const options: ExportOptions = {
            showPriceColumns: false,
            showValidatorColumns: true,
            epochPrices: {},
            selectedCurrency: 'usd',
            wrapStakeObjects: true,
            wrapValidators: true,
        };
        const sections = buildExportSections({ ...baseInputs, options });
        const titles = sections.map((s) => s.title);
        expect(titles).toEqual([undefined, '--- Validators ---', '--- Stake Objects ---']);
    });

    it('Total Earned column appears when prices are provided', () => {
        const options: ExportOptions = {
            showPriceColumns: true,
            showValidatorColumns: false,
            epochPrices,
            selectedCurrency: 'usd',
        };
        const [main] = buildExportSections({ ...baseInputs, options });
        expect(main.headers).toContain('Total Earned (USD)');
    });

    it('Total Earned column is omitted when no prices are available', () => {
        const options: ExportOptions = {
            showPriceColumns: true,
            showValidatorColumns: false,
            epochPrices: {},
            selectedCurrency: 'usd',
        };
        const [main] = buildExportSections({ ...baseInputs, options });
        expect(main.headers.some((h) => h.startsWith('Total Earned'))).toBe(false);
    });

    it('renders the "previous rewards ignored" notice as the main section title in the CSV', () => {
        const notice = 'Previous rewards ignored: 31.00 IOTA — accrued before epoch 131';
        const options: ExportOptions = {
            showPriceColumns: false,
            showValidatorColumns: false,
            epochPrices: {},
            selectedCurrency: 'usd',
            previousRewardsNotice: notice,
        };
        const sections = buildExportSections({ ...baseInputs, options });
        expect(sections[0].title).toBe(notice);
        // And it makes it into the serialized CSV ahead of the header row.
        const csv = sectionsToCsv([sections[0]]);
        expect(csv.indexOf(notice)).toBeLessThan(csv.indexOf('Epoch'));
    });

    it('omits the notice title when the option is not active', () => {
        const options: ExportOptions = {
            showPriceColumns: false,
            showValidatorColumns: false,
            epochPrices: {},
            selectedCurrency: 'usd',
        };
        const [main] = buildExportSections({ ...baseInputs, options });
        expect(main.title).toBeUndefined();
    });
});

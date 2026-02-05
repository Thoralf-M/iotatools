/**
 * Staking Rewards Calculation Tests (Snapshot-based)
 *
 * This test generates an epoch table from cached data and compares it
 * against a known-good snapshot file.
 *
 * To update the snapshots after intentional changes:
 *   npx tsx scripts/gen-snapshot.ts > src/lib/pages/staking-rewards/__snapshots__/epoch-table.snapshot.txt
 *   npx tsx scripts/gen-snapshot-multi.ts > src/lib/pages/staking-rewards/__snapshots__/epoch-table-multi.snapshot.txt
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';

import { MAINNET_CONFIG, setNetworkConfigOverride } from '../../utils/network-config.js';
import {
    collectActionsByEpoch,
    computeEpochData,
    generateEpochTable,
    getMaxEpochFromCache,
    processStakeTransactionsWithExchangeRates,
    setInitialExchangeRateCache,
    type ActionsByEpoch,
} from './index.js';

// ============================================================================
// Test Configuration
// ============================================================================

const SINGLE_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';
const MULTI_ADDRESSES: string[] = [];

const TX_CACHE_PATH = join(__dirname, '../../../../scripts/staking-rewards-tx-cache.json');
const TX_CACHE_MULTI_PATH = join(
    __dirname,
    '../../../../scripts/staking-rewards-tx-cache-multi.json',
);
const EXCHANGE_RATE_CACHE_PATH = join(__dirname, 'cache/exchange-rate-cache.json');
const SNAPSHOT_PATH = join(__dirname, '__snapshots__/epoch-table.snapshot.txt');
const SNAPSHOT_MULTI_PATH = join(__dirname, '__snapshots__/epoch-table-multi.snapshot.txt');

// ============================================================================
// Test Suite: Single Address
// ============================================================================

describe('Staking Rewards - Single Address', () => {
    let generatedTable: string;
    let expectedSnapshot: string;

    beforeAll(async () => {
        setNetworkConfigOverride(MAINNET_CONFIG);

        const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
        setInitialExchangeRateCache(exchangeRateCache);

        const txCache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
        expect(txCache.address).toBe(SINGLE_ADDRESS);

        const maxEpoch = getMaxEpochFromCache(exchangeRateCache);
        const result = await processStakeTransactionsWithExchangeRates(
            txCache.transactions,
            maxEpoch,
            SINGLE_ADDRESS,
        );
        const actionsByEpoch = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
        const tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);

        generatedTable = generateEpochTable(tableData, actionsByEpoch);
        expectedSnapshot = readFileSync(SNAPSHOT_PATH, 'utf-8').trim();
    });

    it('should match the epoch table snapshot', () => {
        expect(generatedTable).toBe(expectedSnapshot);
    });

    it('should have correct number of lines', () => {
        const lines = generatedTable.split('\n');
        expect(lines.length).toBeGreaterThan(277);
    });

    it('should show correct unstake rewards for epoch 128 (~1,016,491 IOTA)', () => {
        const epoch128Line = generatedTable.split('\n').find((l) => l.trim().startsWith('128'));
        expect(epoch128Line).toBeDefined();
        const unstakeRewards = parseFloat(epoch128Line!.split('|')[4].trim().replace(/,/g, ''));
        expect(unstakeRewards).toBeGreaterThan(1_000_000);
        expect(unstakeRewards).toBeLessThan(1_050_000);
    });

    it('should show correct unstake rewards for epoch 146 (~8,175 IOTA)', () => {
        const epoch146Line = generatedTable.split('\n').find((l) => l.trim().startsWith('146'));
        expect(epoch146Line).toBeDefined();
        const unstakeRewards = parseFloat(epoch146Line!.split('|')[4].trim().replace(/,/g, ''));
        expect(unstakeRewards).toBeGreaterThan(8_000);
        expect(unstakeRewards).toBeLessThan(8_500);
    });

    it('should show final accumulated rewards of ~16,967,301 IOTA at epoch 272', () => {
        const epoch272Line = generatedTable.split('\n').find((l) => l.trim().startsWith('272'));
        expect(epoch272Line).toBeDefined();
        const accumulated = parseFloat(epoch272Line!.split('|')[3].trim().replace(/,/g, ''));
        expect(accumulated).toBeGreaterThan(16_900_000);
        expect(accumulated).toBeLessThan(17_000_000);
    });

    it('should show final unstake total of ~6,363,012 IOTA at epoch 272', () => {
        const epoch272Line = generatedTable.split('\n').find((l) => l.trim().startsWith('272'));
        expect(epoch272Line).toBeDefined();
        const unstakeTotal = parseFloat(epoch272Line!.split('|')[5].trim().replace(/,/g, ''));
        expect(unstakeTotal).toBeGreaterThan(6_300_000);
        expect(unstakeTotal).toBeLessThan(6_400_000);
    });
});

// ============================================================================
// Test Suite: Multiple Addresses (with Transfer actions)
// ============================================================================

// describe('Staking Rewards - Multiple Addresses', () => {
//     let generatedTable: string;
//     let expectedSnapshot: string;
//     let tableData: ReturnType<typeof computeEpochData>;

//     beforeAll(async () => {
//         setNetworkConfigOverride(MAINNET_CONFIG);

//         const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
//         setInitialExchangeRateCache(exchangeRateCache);

//         const txCacheMulti = JSON.parse(readFileSync(TX_CACHE_MULTI_PATH, 'utf-8'));
//         const maxEpoch = getMaxEpochFromCache(exchangeRateCache);

//         const allStakeObjects: Parameters<typeof computeEpochData>[0] = [];
//         const combinedValidatorInfo: Parameters<typeof computeEpochData>[1] = {};
//         const actionsByEpoch: ActionsByEpoch = {};

//         for (const address of MULTI_ADDRESSES) {
//             const transactions = txCacheMulti.transactionsByAddress[address] || [];
//             if (transactions.length === 0) continue;

//             const result = await processStakeTransactionsWithExchangeRates(transactions, maxEpoch, address);
//             if (result.stakeObjects.length === 0) continue;

//             allStakeObjects.push(...result.stakeObjects);
//             Object.assign(combinedValidatorInfo, result.validatorInfo);

//             const addressActions = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
//             for (const [epochStr, actions] of Object.entries(addressActions)) {
//                 const epoch = parseInt(epochStr);
//                 if (!actionsByEpoch[epoch]) actionsByEpoch[epoch] = [];
//                 actionsByEpoch[epoch].push(...actions);
//             }
//         }

//         tableData = computeEpochData(allStakeObjects, combinedValidatorInfo, maxEpoch);

//         const lines: string[] = [];
//         lines.push(generateEpochTable(tableData, actionsByEpoch));

//         generatedTable = lines.join('\n');
//         expectedSnapshot = readFileSync(SNAPSHOT_MULTI_PATH, 'utf-8').trim();
//     });

//     it('should match the epoch table snapshot excluding the latest epoch', () => {
//         const expectedLines = expectedSnapshot.split('\n');
//         expectedLines.splice(-2, 2); // remove last 2 lines
//         const expectedLength = expectedLines.length;
//         const modifiedExpected = expectedLines.join('\n');

//         const truncatedGenerated = generatedTable.split('\n').slice(0, expectedLength).join('\n');
//         expect(truncatedGenerated).toBe(modifiedExpected);
//     });

//     it('should have pre-transfer rewards greater than 0', () => {
//         expect(tableData.totalPreTransferRewards).toBeGreaterThan(0n);
//     });

//     it('should have correct progression of available rewards after unstake with re-stake', () => {
//         // After unstaking in epoch 158, available should be 0 in epoch 159,
//         // then increase with new rewards in 160, 161
//         const epoch159Line = generatedTable.split('\n').find((l) => l.trim().startsWith('159 '));
//         const epoch160Line = generatedTable.split('\n').find((l) => l.trim().startsWith('160 '));
//         const epoch161Line = generatedTable.split('\n').find((l) => l.trim().startsWith('161 '));

//         expect(epoch159Line).toBeDefined();
//         expect(epoch160Line).toBeDefined();
//         expect(epoch161Line).toBeDefined();

//         const available159 = parseFloat(epoch159Line!.split('|')[6].trim().replace(/,/g, ''));
//         const available160 = parseFloat(epoch160Line!.split('|')[6].trim().replace(/,/g, ''));
//         const available161 = parseFloat(epoch161Line!.split('|')[6].trim().replace(/,/g, ''));

//         expect(available159).toBe(0);
//         expect(available160).toBeGreaterThan(0);
//         expect(available161).toBeGreaterThan(available160);
//     });
// });

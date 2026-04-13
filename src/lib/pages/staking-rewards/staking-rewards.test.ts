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
} from './index.js';
import { filterEpochsByTimeFrame, getTimeFrameDateRange, type DateRange } from './timeframe.js';

// ============================================================================
// Test Configuration
// ============================================================================

const SINGLE_ADDRESS = '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c';

const TX_CACHE_PATH = join(__dirname, '../../../../scripts/staking-rewards-tx-cache.json');
const EXCHANGE_RATE_CACHE_PATH = join(__dirname, 'cache/exchange-rate-cache.json');
const SNAPSHOT_PATH = join(__dirname, '__snapshots__/epoch-table.snapshot.txt');

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
        // Remove the last 2 lines (last epoch row + separator) from the snapshot
        // because the latest epoch is not finished and its data changes.
        const expectedLines = expectedSnapshot.split('\n');
        expectedLines.splice(-2, 2);
        const expectedLength = expectedLines.length;
        const modifiedExpected = expectedLines.join('\n');

        const truncatedGenerated = generatedTable.split('\n').slice(0, expectedLength).join('\n');
        expect(truncatedGenerated).toBe(modifiedExpected);
    });

    it('should have correct number of lines', () => {
        const lines = generatedTable.split('\n');
        expect(lines.length).toBeGreaterThan(380);
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
// Test Suite: Time Frame Filtering
// ============================================================================

const EPOCH_TIMESTAMPS_CACHE_PATH = join(__dirname, 'cache/mainnet-epoch-timestamps-cache.json');

// Reference date used across time frame tests (pinned so tests are deterministic)
const REFERENCE_DATE = new Date('2026-04-08T12:00:00Z');

/**
 * Parse epoch data lines from a generated table (formatNumberLocale output).
 * Returns a map of epoch number -> [staked, rewards, accumulated, unstakeRewards, unstakeTotal, available].
 */
function parseEpochLines(table: string): Map<number, string[]> {
    const map = new Map<number, string[]>();
    for (const line of table.split('\n')) {
        const trimmed = line.trim();
        const match = trimmed.match(/^(\d+)\s+\|(.+)$/);
        if (match) {
            map.set(
                parseInt(match[1]),
                match[2].split('|').map((c) => c.trim()),
            );
        }
    }
    return map;
}

function parseSnapshot(): Map<number, string[]> {
    return parseEpochLines(readFileSync(SNAPSHOT_PATH, 'utf-8'));
}

describe('Staking Rewards - Time Frame Filtering', () => {
    let generatedTable: string;
    let tableData: ReturnType<typeof computeEpochData>;
    let epochTimestamps: Record<string, number>;

    beforeAll(async () => {
        setNetworkConfigOverride(MAINNET_CONFIG);

        const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
        setInitialExchangeRateCache(exchangeRateCache);
        epochTimestamps = JSON.parse(readFileSync(EPOCH_TIMESTAMPS_CACHE_PATH, 'utf-8'));

        const txCache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
        expect(txCache.address).toBe(SINGLE_ADDRESS);

        const maxEpoch = getMaxEpochFromCache(exchangeRateCache);
        const result = await processStakeTransactionsWithExchangeRates(
            txCache.transactions,
            maxEpoch,
            SINGLE_ADDRESS,
        );
        const actionsByEpoch = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
        tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);
        generatedTable = generateEpochTable(tableData, actionsByEpoch);
    });

    it('should correctly compute date range for "last-month" (March 2026)', () => {
        const range = getTimeFrameDateRange('last-month', REFERENCE_DATE);
        expect(range).not.toBeNull();
        expect(range!.start.getFullYear()).toBe(2026);
        expect(range!.start.getMonth()).toBe(2); // March (0-indexed)
        expect(range!.start.getDate()).toBe(1);
        expect(range!.end.getMonth()).toBe(2);
        expect(range!.end.getDate()).toBe(31);
    });

    it('should correctly compute date range for "last-quarter" (Q1 2026)', () => {
        const range = getTimeFrameDateRange('last-quarter', REFERENCE_DATE);
        expect(range).not.toBeNull();
        expect(range!.start.getFullYear()).toBe(2026);
        expect(range!.start.getMonth()).toBe(0); // January
        expect(range!.start.getDate()).toBe(1);
        expect(range!.end.getMonth()).toBe(2); // March
        expect(range!.end.getDate()).toBe(31);
    });

    it('should correctly compute date range for "ytd"', () => {
        const range = getTimeFrameDateRange('ytd', REFERENCE_DATE);
        expect(range).not.toBeNull();
        expect(range!.start.getFullYear()).toBe(2026);
        expect(range!.start.getMonth()).toBe(0);
        expect(range!.start.getDate()).toBe(1);
        expect(range!.end.getTime()).toBe(REFERENCE_DATE.getTime());
    });

    it('should return all epochs for "all" time frame', () => {
        const filtered = filterEpochsByTimeFrame(tableData.epochs, epochTimestamps, 'all');
        expect(filtered).toEqual(tableData.epochs);
    });

    it('should filter epochs for "last-month" (March 2026) and match snapshot per-epoch values', () => {
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'last-month',
            undefined,
            REFERENCE_DATE,
        );

        // March 2026 should include roughly epochs 299-329
        expect(filtered.length).toBeGreaterThan(25);
        expect(filtered.length).toBeLessThan(35);

        // Verify all filtered epochs have timestamps in March 2026
        for (const epoch of filtered) {
            const ts = epochTimestamps[epoch];
            expect(ts).toBeDefined();
            const date = new Date(ts * 1000);
            expect(date.getFullYear()).toBe(2026);
            expect(date.getMonth()).toBe(2); // March
        }

        // Verify per-epoch values from generated table match the snapshot
        const generatedLines = parseEpochLines(generatedTable);
        const snapshotLines = parseSnapshot();
        for (const epoch of filtered) {
            const genData = generatedLines.get(epoch);
            const snapData = snapshotLines.get(epoch);
            expect(genData).toBeDefined();
            if (snapData) {
                // Staked and Rewards columns should match exactly
                expect(genData![0]).toBe(snapData[0]); // Staked
                expect(genData![1]).toBe(snapData[1]); // Rewards
            }
        }
    });

    it('should filter epochs for "last-quarter" (Q1 2026) and match snapshot per-epoch values', () => {
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'last-quarter',
            undefined,
            REFERENCE_DATE,
        );

        // Q1 2026 (Jan 1 - Mar 31) should include roughly epochs 240-329
        expect(filtered.length).toBeGreaterThan(80);
        expect(filtered.length).toBeLessThan(100);

        // Verify all filtered epochs are in Q1 2026
        for (const epoch of filtered) {
            const ts = epochTimestamps[epoch];
            const date = new Date(ts * 1000);
            expect(date.getFullYear()).toBe(2026);
            expect(date.getMonth()).toBeLessThanOrEqual(2); // Jan, Feb, or Mar
        }

        // Verify per-epoch rewards match snapshot
        const generatedLines = parseEpochLines(generatedTable);
        const snapshotLines = parseSnapshot();
        for (const epoch of filtered) {
            const genData = generatedLines.get(epoch);
            const snapData = snapshotLines.get(epoch);
            expect(genData).toBeDefined();
            if (snapData) {
                expect(genData![1]).toBe(snapData[1]); // Rewards
            }
        }
    });

    it('should filter epochs for "ytd" and match snapshot per-epoch values', () => {
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'ytd',
            undefined,
            REFERENCE_DATE,
        );

        // YTD from Jan 1 2026 should include epochs from ~240 onwards
        expect(filtered.length).toBeGreaterThan(80);
        expect(filtered[0]).toBeGreaterThanOrEqual(239);

        // Verify per-epoch rewards match snapshot
        const generatedLines = parseEpochLines(generatedTable);
        const snapshotLines = parseSnapshot();
        for (const epoch of filtered) {
            const genData = generatedLines.get(epoch);
            const snapData = snapshotLines.get(epoch);
            expect(genData).toBeDefined();
            if (snapData) {
                expect(genData![1]).toBe(snapData[1]); // Rewards
            }
        }
    });

    it('should filter epochs for custom range (Feb 2026) and match snapshot per-epoch values', () => {
        const customRange: DateRange = {
            start: new Date('2026-02-01T00:00:00'),
            end: new Date('2026-02-28T23:59:59.999'),
        };
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'custom',
            customRange,
        );

        // February 2026 should include roughly epochs 271-298
        expect(filtered.length).toBeGreaterThan(24);
        expect(filtered.length).toBeLessThan(32);

        // Verify all filtered epochs have timestamps in February 2026
        for (const epoch of filtered) {
            const ts = epochTimestamps[epoch];
            const date = new Date(ts * 1000);
            expect(date.getFullYear()).toBe(2026);
            expect(date.getMonth()).toBe(1); // February
        }

        // Verify per-epoch staked and rewards match snapshot
        const generatedLines = parseEpochLines(generatedTable);
        const snapshotLines = parseSnapshot();
        for (const epoch of filtered) {
            const genData = generatedLines.get(epoch);
            const snapData = snapshotLines.get(epoch);
            expect(genData).toBeDefined();
            if (snapData) {
                expect(genData![0]).toBe(snapData[0]); // Staked
                expect(genData![1]).toBe(snapData[1]); // Rewards
            }
        }
    });

    it('should preserve accumulated values (global, not recomputed from timeframe start)', () => {
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'last-quarter',
            undefined,
            REFERENCE_DATE,
        );

        // The first epoch in the filtered range should have accumulated rewards
        // that include all rewards from epoch 0 up to that point (not starting from 0)
        const firstFilteredEpoch = filtered[0];
        const accum = tableData.epochData[firstFilteredEpoch].totalAccumulated;
        // Accumulated at epoch ~240 should be > 15M IOTA in nanos
        expect(accum).toBeGreaterThan(15_000_000n * 1_000_000_000n);

        // The accumulated value in the generated table should match the snapshot
        const generatedLines = parseEpochLines(generatedTable);
        const snapshotLines = parseSnapshot();
        const genData = generatedLines.get(firstFilteredEpoch);
        const snapData = snapshotLines.get(firstFilteredEpoch);
        expect(genData).toBeDefined();
        if (snapData) {
            expect(genData![2]).toBe(snapData[2]); // Accumulated
        }
    });

    it('should return empty array for a time range with no epochs', () => {
        const customRange: DateRange = {
            start: new Date('2020-01-01T00:00:00'),
            end: new Date('2020-12-31T23:59:59'),
        };
        const filtered = filterEpochsByTimeFrame(
            tableData.epochs,
            epochTimestamps,
            'custom',
            customRange,
        );
        expect(filtered).toEqual([]);
    });
});

// ============================================================================
// Test Suite: Reduced Transactions + Current Objects
// ============================================================================

describe('Staking Rewards - Reduced Transactions with Current Objects', () => {
    // Reference epoch table from full processing
    let fullTableData: ReturnType<typeof computeEpochData>;
    let fullGeneratedTable: string;
    let fullStakeObjects: Awaited<
        ReturnType<typeof processStakeTransactionsWithExchangeRates>
    >['stakeObjects'];
    let maxEpoch: number;
    let allTransactions: any[];

    // The epoch at which we split: older transactions are removed,
    // and current objects fill the gap. We pick an epoch after several
    // staking actions have occurred (epochs 0-88 have 56 transactions).
    const START_EPOCH = 100;

    beforeAll(async () => {
        setNetworkConfigOverride(MAINNET_CONFIG);

        const exchangeRateCache = JSON.parse(readFileSync(EXCHANGE_RATE_CACHE_PATH, 'utf-8'));
        setInitialExchangeRateCache(exchangeRateCache);

        const txCache = JSON.parse(readFileSync(TX_CACHE_PATH, 'utf-8'));
        expect(txCache.address).toBe(SINGLE_ADDRESS);
        allTransactions = txCache.transactions;

        maxEpoch = getMaxEpochFromCache(exchangeRateCache);

        // Full processing — the reference result
        const fullResult = await processStakeTransactionsWithExchangeRates(
            allTransactions,
            maxEpoch,
            SINGLE_ADDRESS,
        );
        fullStakeObjects = fullResult.stakeObjects;
        const fullActionsByEpoch = collectActionsByEpoch(
            fullResult.stakeObjects,
            fullResult.validatorInfo,
        );
        fullTableData = computeEpochData(
            fullResult.stakeObjects,
            fullResult.validatorInfo,
            maxEpoch,
        );
        fullGeneratedTable = generateEpochTable(fullTableData, fullActionsByEpoch);
    });

    /**
     * Build CurrentStakeInfo[] from the full processing result.
     * Objects still active at maxEpoch are "currently staked".
     */
    function buildCurrentStakeObjects() {
        return fullStakeObjects
            .filter((obj) => obj.lastEpoch >= maxEpoch)
            .map((obj) => ({
                objectId: obj.objectId,
                poolId: obj.poolId,
                // Use the latest known principal (what getStakes would return)
                principal:
                    obj.principalByEpoch[obj.lastEpoch] ||
                    obj.principalByEpoch[
                        Math.max(
                            ...Object.keys(obj.principalByEpoch)
                                .map(Number)
                                .filter((e) => e <= obj.lastEpoch),
                        )
                    ] ||
                    '0',
                stakeActivationEpoch: obj.stakeActivationEpoch,
            }));
    }

    it('should produce matching per-epoch data from startEpoch onwards', async () => {
        // Filter out transactions before START_EPOCH
        const reducedTxs = allTransactions.filter((tx: any) => {
            const txEpoch = parseInt(tx.effects.epoch.epochId);
            return txEpoch >= START_EPOCH;
        });

        expect(reducedTxs.length).toBeLessThan(allTransactions.length);

        const currentObjects = buildCurrentStakeObjects();
        expect(currentObjects.length).toBeGreaterThan(0);

        // Process with reduced transactions + current objects
        const reducedResult = await processStakeTransactionsWithExchangeRates(
            reducedTxs,
            maxEpoch,
            SINGLE_ADDRESS,
            { startEpoch: START_EPOCH, currentStakeObjects: currentObjects },
        );

        const reducedTableData = computeEpochData(
            reducedResult.stakeObjects,
            reducedResult.validatorInfo,
            maxEpoch,
        );
        const reducedActionsByEpoch = collectActionsByEpoch(
            reducedResult.stakeObjects,
            reducedResult.validatorInfo,
        );
        const reducedTable = generateEpochTable(reducedTableData, reducedActionsByEpoch);

        // Staked and Rewards columns must match EXACTLY at every epoch from
        // START_EPOCH onwards. The seed-principal fix in processor.ts makes
        // reduced-mode produce byte-identical per-epoch values to full-mode
        // for any object that's still on-chain.
        const fullLines = parseEpochLines(fullGeneratedTable);
        const reducedLines = parseEpochLines(reducedTable);

        let comparedEpochs = 0;
        for (const [epoch, fullCols] of fullLines) {
            if (epoch < START_EPOCH) continue;
            const reducedCols = reducedLines.get(epoch);
            expect(reducedCols).toBeDefined();
            expect(reducedCols![0]).toBe(fullCols[0]); // Staked
            expect(reducedCols![1]).toBe(fullCols[1]); // Rewards
            comparedEpochs++;
        }

        expect(comparedEpochs).toBeGreaterThan(200);
    });

    it('should find stake objects not present in reduced transactions via current objects', async () => {
        const reducedTxs = allTransactions.filter((tx: any) => {
            return parseInt(tx.effects.epoch.epochId) >= START_EPOCH;
        });

        // Process WITHOUT current objects — some objects will be missing
        const withoutCurrentResult = await processStakeTransactionsWithExchangeRates(
            reducedTxs,
            maxEpoch,
            SINGLE_ADDRESS,
            { startEpoch: START_EPOCH },
        );

        // Process WITH current objects
        const currentObjects = buildCurrentStakeObjects();
        const withCurrentResult = await processStakeTransactionsWithExchangeRates(
            reducedTxs,
            maxEpoch,
            SINGLE_ADDRESS,
            { startEpoch: START_EPOCH, currentStakeObjects: currentObjects },
        );

        // Identify objects present in `currentObjects` that NO reduced
        // transaction touches — these are the ones the supplementation step
        // is meant to recover.
        const touchedByReducedTxs = new Set<string>();
        for (const tx of reducedTxs) {
            const nodes = tx.effects?.objectChanges?.nodes ?? [];
            for (const node of nodes) {
                if (node?.address) touchedByReducedTxs.add(node.address);
            }
        }

        const recoverableIds = currentObjects
            .map((c) => c.objectId)
            .filter((id) => !touchedByReducedTxs.has(id));

        // The test data must actually exercise the recovery path, or the
        // assertions below prove nothing. Fail loudly if it doesn't.
        expect(recoverableIds.length).toBeGreaterThan(0);

        const withoutIds = new Set(withoutCurrentResult.stakeObjects.map((o) => o.objectId));
        const withIds = new Set(withCurrentResult.stakeObjects.map((o) => o.objectId));

        // Every recoverable object must be present only in the "with" run.
        for (const id of recoverableIds) {
            expect(withoutIds.has(id)).toBe(false);
            expect(withIds.has(id)).toBe(true);
        }

        expect(withCurrentResult.stakeObjects.length).toBeGreaterThan(
            withoutCurrentResult.stakeObjects.length,
        );
    });

    it.each([
        ['epoch-table-from-epoch-10.snapshot.txt'],
        ['epoch-table-from-epoch-200.snapshot.txt'],
    ])(
        'should have matching Staked and Available Rewards at current epoch in %s',
        (reducedSnapshotFile) => {
            // These two columns must agree at the current epoch regardless of
            // how much history the reduced run has:
            //   - Staked depends only on currently-active principals.
            //   - Available Rewards = Accumulated - (Unstake Total - PreTransfer),
            //     which by construction nets out the history of any object that
            //     ever unstaked, so it depends only on the currently-owned set.
            // Other columns (Rewards per epoch, Accumulated, Unstake Total) are
            // expected to differ when pre-startEpoch actions are filtered out.
            const fullSnapshot = readFileSync(
                join(__dirname, '__snapshots__/epoch-table.snapshot.txt'),
                'utf-8',
            );
            const reducedSnapshot = readFileSync(
                join(__dirname, '__snapshots__', reducedSnapshotFile),
                'utf-8',
            );

            const fullSnapLines = parseEpochLines(fullSnapshot);
            const reducedSnapLines = parseEpochLines(reducedSnapshot);

            // Pick the newest epoch present in BOTH snapshot files. This keeps
            // the test robust against cache refreshes updating one snapshot but
            // not the other (e.g. the primary snapshot ends earlier than the
            // reduced ones after a cache update).
            const commonEpochs = [...fullSnapLines.keys()].filter((e) => reducedSnapLines.has(e));
            expect(commonEpochs.length).toBeGreaterThan(0);
            const lastCompletedEpoch = Math.max(...commonEpochs);

            const fullRow = fullSnapLines.get(lastCompletedEpoch)!;
            const reducedRow = reducedSnapLines.get(lastCompletedEpoch)!;

            // Column indices from generateEpochTable:
            //   0=Staked, 1=Rewards, 2=Accumulated, 3=Unstake Rewards,
            //   4=Unstake Total, 5=Available Rewards
            expect(reducedRow[0]).toBe(fullRow[0]); // Staked
            expect(reducedRow[5]).toBe(fullRow[5]); // Available Rewards

            // Sanity: the live full run should reproduce the same values at
            // this epoch — catches drift between cache and primary snapshot.
            const liveFull = parseEpochLines(fullGeneratedTable).get(lastCompletedEpoch);
            expect(liveFull).toBeDefined();
            expect(liveFull![0]).toBe(fullRow[0]);
            expect(liveFull![5]).toBe(fullRow[5]);
        },
    );

    async function runReducedSnapshotTest(startEpoch: number, snapshotFileName: string) {
        const reducedTxs = allTransactions.filter((tx: any) => {
            const txEpoch = parseInt(tx.effects.epoch.epochId);
            return txEpoch >= startEpoch;
        });

        const currentObjects = buildCurrentStakeObjects();

        const result = await processStakeTransactionsWithExchangeRates(
            reducedTxs,
            maxEpoch,
            SINGLE_ADDRESS,
            { startEpoch, currentStakeObjects: currentObjects },
        );
        const actionsByEpoch = collectActionsByEpoch(result.stakeObjects, result.validatorInfo);
        const tableData = computeEpochData(result.stakeObjects, result.validatorInfo, maxEpoch);
        const generated = generateEpochTable(tableData, actionsByEpoch);

        // Assert every epoch in the committed snapshot appears identically in
        // the live output. The live run may cover more epochs after a cache
        // refresh — extensions beyond the committed range are expected and
        // ignored (matches the primary snapshot test's tolerance for cache
        // extensions).
        const expected = readFileSync(join(__dirname, '__snapshots__', snapshotFileName), 'utf-8');
        const expectedByEpoch = parseEpochLines(expected);
        const generatedByEpoch = parseEpochLines(generated);

        expect(expectedByEpoch.size).toBeGreaterThan(0);
        for (const [epoch, expectedCols] of expectedByEpoch) {
            const generatedCols = generatedByEpoch.get(epoch);
            expect(generatedCols, `missing row for epoch ${epoch}`).toBeDefined();
            expect(generatedCols).toEqual(expectedCols);
        }
    }

    it('should match snapshot for reduced transactions starting from epoch 10', async () => {
        await runReducedSnapshotTest(10, 'epoch-table-from-epoch-10.snapshot.txt');
    });

    it('should match snapshot for reduced transactions starting from epoch 200', async () => {
        await runReducedSnapshotTest(200, 'epoch-table-from-epoch-200.snapshot.txt');
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

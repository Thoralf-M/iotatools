import { describe, expect, it } from 'vitest';

import type { StakeObject } from './compute/types';
import { computeEpochData, rebaselineStakeObjects } from './table-utils';

const IOTA = 1_000_000_000n; // 1 IOTA in nano

/**
 * Build the scenario from the feature request: a single stake earning 1 IOTA
 * per epoch from epoch 100, fully unstaked at epoch 140.
 *
 *   - epochs 100..130 (31 epochs) accrue "December" rewards → 31 IOTA
 *   - epochs 131..139 (9 epochs) accrue "January" rewards → 9 IOTA
 *   - epoch 140 is the unstake epoch (no reward earned), realizing 40 IOTA
 */
function buildSingleStakeFullUnstake(): StakeObject {
    const rewardsByEpoch: Record<number, string> = {};
    const accumulatedRewards: Record<number, string> = {};
    let accumulated = 0n;
    for (let epoch = 100; epoch <= 139; epoch++) {
        rewardsByEpoch[epoch] = IOTA.toString();
        accumulated += IOTA;
        accumulatedRewards[epoch] = accumulated.toString();
    }
    // Unstake epoch: rewards/accumulated reset to 0, realized rewards recorded
    // on the action (matches rewards-calculator.ts behaviour).
    rewardsByEpoch[140] = '0';
    accumulatedRewards[140] = '0';

    return {
        objectId: 'obj1',
        wasOwnedByTargetAddress: true,
        poolId: 'pool1',
        principalByEpoch: {},
        exchangeRatesByEpoch: {},
        rewardsByEpoch,
        accumulatedRewards,
        actionByEpoch: {
            140: [{ action: 'Unstaked', digest: '0xabc', totalRewards: (40n * IOTA).toString() }],
        },
        firstEpoch: 100,
        lastEpoch: 140,
        stakeActivationEpoch: 100,
    };
}

describe('rebaselineStakeObjects', () => {
    it('strips pre-window rewards and re-bases the feature-request example', () => {
        const stake = buildSingleStakeFullUnstake();
        // Window = "January" → first displayed epoch is 131.
        const { stakeObjects, previousRewardsRemoved } = rebaselineStakeObjects([stake], 131);

        // 31 IOTA of December rewards removed.
        expect(previousRewardsRemoved).toBe(31n * IOTA);

        const rebased = stakeObjects[0];

        // Per-epoch rewards before the window are zeroed.
        expect(rebased.rewardsByEpoch[130]).toBe('0');
        expect(rebased.rewardsByEpoch[100]).toBe('0');
        // Within the window they are untouched.
        expect(rebased.rewardsByEpoch[131]).toBe(IOTA.toString());
        expect(rebased.rewardsByEpoch[139]).toBe(IOTA.toString());

        // Accumulated re-bases to start at the window.
        expect(rebased.accumulatedRewards[130]).toBe('0');
        expect(rebased.accumulatedRewards[131]).toBe(IOTA.toString()); // 32 - 31
        expect(rebased.accumulatedRewards[139]).toBe((9n * IOTA).toString()); // 40 - 31

        // The unstake at epoch 140 now realizes only the 9 IOTA earned in January.
        expect(rebased.actionByEpoch?.[140][0].totalRewards).toBe((9n * IOTA).toString());
    });

    it('makes the unstake-rewards total reflect only window rewards via computeEpochData', () => {
        const stake = buildSingleStakeFullUnstake();
        const { stakeObjects } = rebaselineStakeObjects([stake], 131);
        const table = computeEpochData(
            stakeObjects,
            { pool1: { name: 'V', poolId: 'pool1' } },
            140,
        );

        // Realized unstake rewards in the window = 9 IOTA (was 40 IOTA).
        expect(table.epochData[140].totalUnstakeRewards).toBe(9n * IOTA);
        // Cumulative rewards earned in the window peak at 9 IOTA before the unstake.
        expect(table.epochData[139].totalAccumulated).toBe(9n * IOTA);
    });

    it('leaves objects that start inside the window untouched (no baseline)', () => {
        const stake = buildSingleStakeFullUnstake();
        // Window starts before the stake's first epoch → nothing to remove.
        const { stakeObjects, previousRewardsRemoved } = rebaselineStakeObjects([stake], 100);
        expect(previousRewardsRemoved).toBe(0n);
        expect(stakeObjects[0].accumulatedRewards[139]).toBe((40n * IOTA).toString());
        expect(stakeObjects[0].actionByEpoch?.[140][0].totalRewards).toBe((40n * IOTA).toString());
    });

    it('does not over-subtract the baseline across multiple window unstakes', () => {
        // Pre-window accrued 10 IOTA; two partial unstakes inside the window each
        // realize 6 IOTA. The 10 IOTA baseline must be absorbed once across both
        // (6 from the first, 4 from the second), never 10 from each.
        const stake: StakeObject = {
            objectId: 'obj1',
            wasOwnedByTargetAddress: true,
            poolId: 'pool1',
            principalByEpoch: {},
            exchangeRatesByEpoch: {},
            rewardsByEpoch: { 50: (10n * IOTA).toString() },
            accumulatedRewards: { 50: (10n * IOTA).toString() },
            actionByEpoch: {
                60: [
                    {
                        action: 'Partial Unstake',
                        digest: '0x1',
                        totalRewards: (6n * IOTA).toString(),
                    },
                ],
                61: [
                    {
                        action: 'Partial Unstake',
                        digest: '0x2',
                        totalRewards: (6n * IOTA).toString(),
                    },
                ],
            },
            firstEpoch: 50,
            lastEpoch: 61,
            stakeActivationEpoch: 50,
        };

        const { stakeObjects, previousRewardsRemoved } = rebaselineStakeObjects([stake], 55);
        expect(previousRewardsRemoved).toBe(10n * IOTA);
        // First unstake fully absorbed (6 - 6 = 0), second partially (6 - 4 = 2).
        expect(stakeObjects[0].actionByEpoch?.[60][0].totalRewards).toBe('0');
        expect(stakeObjects[0].actionByEpoch?.[61][0].totalRewards).toBe((2n * IOTA).toString());
    });
});

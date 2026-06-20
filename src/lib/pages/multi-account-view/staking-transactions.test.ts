import { describe, expect, it } from 'vitest';

import {
    buildSwitchValidatorTransactionMulti,
    buildUnstakeSingleTransaction,
} from './staking-transactions';

const VALIDATOR = '0x' + 'a'.repeat(64);
const stakeId = (n: number) => '0x' + n.toString(16).padStart(64, '0');

/** Count the PTB commands of a given kind. `getData().commands` entries are
 *  discriminated by a single key (e.g. `MoveCall`, `MergeCoins`). */
function countCommands(tx: ReturnType<typeof buildSwitchValidatorTransactionMulti>) {
    const commands = tx.getData().commands as Array<Record<string, unknown>>;
    const moveCallTargets = commands
        .filter((c) => 'MoveCall' in c)
        .map((c) => {
            const mc = c.MoveCall as { package: string; module: string; function: string };
            return `${mc.module}::${mc.function}`;
        });
    const mergeCount = commands.filter((c) => 'MergeCoins' in c).length;
    return { moveCallTargets, mergeCount };
}

describe('buildSwitchValidatorTransactionMulti', () => {
    it('merges multiple stakes into a single new StakedIota (one add_stake, one merge)', () => {
        const tx = buildSwitchValidatorTransactionMulti(
            [stakeId(1), stakeId(2), stakeId(3)],
            VALIDATOR,
        );
        const { moveCallTargets, mergeCount } = countCommands(tx);

        // One withdraw + one from_balance per input stake...
        expect(
            moveCallTargets.filter((t) => t.endsWith('request_withdraw_stake_non_entry')),
        ).toHaveLength(3);
        expect(moveCallTargets.filter((t) => t.endsWith('from_balance'))).toHaveLength(3);
        // ...the coins merged once...
        expect(mergeCount).toBe(1);
        // ...and staked exactly once → a single output StakedIota.
        expect(moveCallTargets.filter((t) => t.endsWith('request_add_stake'))).toHaveLength(1);
    });

    it('does not merge a single stake (no MergeCoins, one add_stake)', () => {
        const tx = buildSwitchValidatorTransactionMulti([stakeId(1)], VALIDATOR);
        const { moveCallTargets, mergeCount } = countCommands(tx);

        expect(mergeCount).toBe(0);
        expect(
            moveCallTargets.filter((t) => t.endsWith('request_withdraw_stake_non_entry')),
        ).toHaveLength(1);
        expect(moveCallTargets.filter((t) => t.endsWith('request_add_stake'))).toHaveLength(1);
    });

    it('builds an unstake (single withdraw, no re-stake)', () => {
        const tx = buildUnstakeSingleTransaction(stakeId(1));
        const commands = tx.getData().commands as Array<Record<string, unknown>>;
        expect(commands.filter((c) => 'MoveCall' in c)).toHaveLength(1);
    });
});

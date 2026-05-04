import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_SYSTEM_STATE_OBJECT_ID } from '@iota/iota-sdk/utils';

/** Build a stake transaction: split `amount` from gas, then add_stake. Mirrors
 *  ../stake/staking-operations.ts but kept here so the multi-account view's
 *  staking flows have a self-contained transaction module. */
export function buildStakeTransaction(
    validatorAddress: string,
    amount: bigint | number,
): Transaction {
    const tx = new Transaction();
    const stakeCoin = tx.splitCoins(tx.gas, [amount]);
    tx.moveCall({
        target: '0x3::iota_system::request_add_stake',
        arguments: [
            tx.sharedObjectRef({
                objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                initialSharedVersion: 1,
                mutable: true,
            }),
            stakeCoin,
            tx.pure.address(validatorAddress),
        ],
    });
    return tx;
}

/** Build a transaction that withdraws a single StakedIota object (full unstake). */
export function buildUnstakeSingleTransaction(stakedIotaObjectId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: '0x3::iota_system::request_withdraw_stake',
        arguments: [
            tx.sharedObjectRef({
                objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                initialSharedVersion: 1,
                mutable: true,
            }),
            tx.object(stakedIotaObjectId),
        ],
    });
    return tx;
}

/** Single PTB that unstakes a StakedIota and immediately stakes the resulting
 *  balance (principal + accumulated rewards) to a new validator.
 *
 *  Caveat: the protocol still requires an epoch boundary for the new stake to
 *  start earning. Even with this single transaction the user loses ≈1 epoch
 *  of rewards relative to staying — surface that to the user with the
 *  breakeven-days computation before they execute. */
export function buildSwitchValidatorTransaction(
    stakedIotaObjectId: string,
    newValidatorAddress: string,
): Transaction {
    return buildSwitchValidatorTransactionMulti([stakedIotaObjectId], newValidatorAddress);
}

/** Multi-stake variant: chains one (withdraw → from_balance → add_stake)
 *  triple per stake into a single PTB. All stakes must belong to the same
 *  sender (set externally with `tx.setSender(...)`). The resulting tx ends
 *  with the same number of new StakedIota objects as it started with, all
 *  delegated to `newValidatorAddress`. */
export function buildSwitchValidatorTransactionMulti(
    stakedIotaObjectIds: string[],
    newValidatorAddress: string,
): Transaction {
    const tx = new Transaction();
    const systemRef = tx.sharedObjectRef({
        objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
        initialSharedVersion: 1,
        mutable: true,
    });
    for (const stakeId of stakedIotaObjectIds) {
        const [balance] = tx.moveCall({
            target: '0x3::iota_system::request_withdraw_stake_non_entry',
            arguments: [systemRef, tx.object(stakeId)],
        });
        const [coin] = tx.moveCall({
            target: '0x2::coin::from_balance',
            arguments: [balance!],
            typeArguments: ['0x2::iota::IOTA'],
        });
        tx.moveCall({
            target: '0x3::iota_system::request_add_stake',
            arguments: [systemRef, coin!, tx.pure.address(newValidatorAddress)],
        });
    }
    return tx;
}

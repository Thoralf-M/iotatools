// [GAP] @iota/bcs custom BCS schema not available in WASM SDK
const bcs = null as any;
// [MIGRATION] IotaClient → GraphQlClient from wasm-sdk
import type { GraphQlClient } from './wasm-sdk';
// [GAP] Transaction class not in WASM SDK - use TransactionBuilder + .finish()
type Transaction = any;

export interface StakeData {
    objectId: string;
    initialStakedAmount: string;
    rewards: string;
    totalUnstakeAmount: string;
}

/**
 * Computes the staking rewards for a staked IOTA object by simulating an unstake transaction.
 * This function works for both regular StakedIota and TimelockedStakedIota objects.
 *
 * @param client - The IOTA client instance
 * @param stakedIotaObjectId - The object ID of the staked IOTA
 * @param senderAddress - The address of the owner (used for devInspect)
 * @returns Promise<StakeData> containing the staking rewards and related data
 */
export async function computeStakingRewards(
    client: GraphQlClient,
    stakedIotaObjectId: string,
    senderAddress: string,
): Promise<StakeData> {
    const obj = await client.getObject({
        id: stakedIotaObjectId,
        options: { showContent: true },
    });
    let target;
    let timelocked = false;
    // @ts-ignore
    if (obj.data?.content?.type === '0x3::staking_pool::StakedIota') {
        target = '0x3::iota_system::request_withdraw_stake_non_entry';
    }
    // @ts-ignore
    if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
        target = '0x3::timelocked_staking::request_withdraw_stake_non_entry';
        timelocked = true;
    }

    if (!target) {
        throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
    }

    const tx = new Transaction();
    tx.moveCall({
        target,
        arguments: [tx.object('0x5'), tx.object(stakedIotaObjectId)],
    });

    const devInspectResult = await client.devInspectTransactionBlock({
        sender: senderAddress,
        transactionBlock: tx,
    });

    let index = timelocked ? 1 : 0;
    // @ts-ignore
    let amountBytes = devInspectResult.results[0].returnValues[index][0];
    let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
    let totalUnstakeAmount = BigInt(amountString);

    let initialStakedAmount = BigInt(
        timelocked
            ? // @ts-ignore
              obj.data!.content!.fields!.staked_iota!.fields.principal
            : // @ts-ignore
              obj.data!.content!.fields!.principal,
    );
    let res = {
        objectId: stakedIotaObjectId,
        initialStakedAmount: initialStakedAmount.toString(),
        rewards: (timelocked
            ? totalUnstakeAmount
            : totalUnstakeAmount - initialStakedAmount
        ).toString(),
        totalUnstakeAmount: totalUnstakeAmount.toString(),
    };
    return res;
}

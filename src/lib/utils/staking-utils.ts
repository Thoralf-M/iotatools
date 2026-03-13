import { bcs } from '@iota/iota-sdk/bcs';
import type { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';

import { GraphQlClient } from './wasm-sdk';
import { getLegacyClient, getSelectedNetworkConfig } from './client';

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
 * @param client - The IOTA client instance (unused - kept for API compat, uses legacy internally)
 * @param stakedIotaObjectId - The object ID of the staked IOTA
 * @param senderAddress - The address of the owner (used for devInspect)
 * @returns Promise<StakeData> containing the staking rewards and related data
 */
export async function computeStakingRewards(
    client: GraphQlClient | IotaClient,
    stakedIotaObjectId: string,
    senderAddress: string,
): Promise<StakeData> {
    // Fetch the object's type and JSON content via GraphQL
    const gqlClient = new GraphQlClient(getSelectedNetworkConfig().graphql);
    const resultStr = await gqlClient.runQuery({
        query: `query GetObject($id: IotaAddress!) {
            object(address: $id) {
                asMoveObject {
                    contents {
                        type { repr }
                        json
                    }
                }
            }
        }`,
        variables: JSON.stringify({ id: stakedIotaObjectId }),
    });
    const objResult: any = JSON.parse(resultStr);
    const contents = objResult?.object?.asMoveObject?.contents;
    const objType: string | null = contents?.type?.repr ?? null;
    const json: any = contents?.json ?? null;

    let target;
    let timelocked = false;
    if (objType === '0x3::staking_pool::StakedIota') {
        target = '0x3::iota_system::request_withdraw_stake_non_entry';
    }
    if (objType === '0x3::timelocked_staking::TimelockedStakedIota') {
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

    const legacy = getLegacyClient();
    const devInspectResult = await legacy.devInspectTransactionBlock({
        sender: senderAddress,
        transactionBlock: tx,
    });

    let index = timelocked ? 1 : 0;
    // @ts-ignore
    let amountBytes = devInspectResult.results[0].returnValues[index][0];
    let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
    let totalUnstakeAmount = BigInt(amountString);

    let initialStakedAmount = BigInt(timelocked ? json.staked_iota.principal : json.principal);
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

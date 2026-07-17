import { o as Transaction } from "./client-BTFoHz6u.js";
import { q as bcs } from "./keypair-DsT3ivIR.js";
//#region src/lib/utils/staking-utils.ts
/**
* Computes the staking rewards for a staked IOTA object by simulating an unstake transaction.
* This function works for both regular StakedIota and TimelockedStakedIota objects.
*
* @param client - The IOTA client instance
* @param stakedIotaObjectId - The object ID of the staked IOTA
* @param senderAddress - The address of the owner (used for devInspect)
* @returns Promise<StakeData> containing the staking rewards and related data
*/
async function computeStakingRewards(client, stakedIotaObjectId, senderAddress) {
	const obj = await client.getObject({
		id: stakedIotaObjectId,
		options: { showContent: true }
	});
	let target;
	let timelocked = false;
	if (obj.data?.content?.type === "0x3::staking_pool::StakedIota") target = "0x3::iota_system::request_withdraw_stake_non_entry";
	if (obj.data?.content?.type === "0x3::timelocked_staking::TimelockedStakedIota") {
		target = "0x3::timelocked_staking::request_withdraw_stake_non_entry";
		timelocked = true;
	}
	if (!target) throw new Error("No staked IOTA object: " + stakedIotaObjectId);
	const tx = new Transaction();
	tx.moveCall({
		target,
		arguments: [tx.object("0x5"), tx.object(stakedIotaObjectId)]
	});
	const devInspectResult = await client.devInspectTransactionBlock({
		sender: senderAddress,
		transactionBlock: tx
	});
	let index = timelocked ? 1 : 0;
	let amountBytes = devInspectResult.results[0].returnValues[index][0];
	let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
	let totalUnstakeAmount = BigInt(amountString);
	let initialStakedAmount = BigInt(timelocked ? obj.data.content.fields.staked_iota.fields.principal : obj.data.content.fields.principal);
	return {
		objectId: stakedIotaObjectId,
		initialStakedAmount: initialStakedAmount.toString(),
		rewards: (timelocked ? totalUnstakeAmount : totalUnstakeAmount - initialStakedAmount).toString(),
		totalUnstakeAmount: totalUnstakeAmount.toString()
	};
}
//#endregion
export { computeStakingRewards as t };

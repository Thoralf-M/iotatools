import { aE as Transaction, aK as bcs } from "./index-C434QNVF.js";
async function computeStakingRewards(client, stakedIotaObjectId, senderAddress) {
  const obj = await client.getObject({
    id: stakedIotaObjectId,
    options: { showContent: true }
  });
  let target;
  let timelocked = false;
  if (obj.data?.content?.type === "0x3::staking_pool::StakedIota") {
    target = "0x3::iota_system::request_withdraw_stake_non_entry";
  }
  if (obj.data?.content?.type === "0x3::timelocked_staking::TimelockedStakedIota") {
    target = "0x3::timelocked_staking::request_withdraw_stake_non_entry";
    timelocked = true;
  }
  if (!target) {
    throw new Error("No staked IOTA object: " + stakedIotaObjectId);
  }
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
  let initialStakedAmount = BigInt(
    timelocked ? (
      // @ts-ignore
      obj.data.content.fields.staked_iota.fields.principal
    ) : (
      // @ts-ignore
      obj.data.content.fields.principal
    )
  );
  let res = {
    objectId: stakedIotaObjectId,
    initialStakedAmount: initialStakedAmount.toString(),
    rewards: (timelocked ? totalUnstakeAmount : totalUnstakeAmount - initialStakedAmount).toString(),
    totalUnstakeAmount: totalUnstakeAmount.toString()
  };
  return res;
}
export {
  computeStakingRewards as c
};

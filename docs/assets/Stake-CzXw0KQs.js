import { p as push, i as init, f as from_html, s as sibling, c as child, b as if_block, g as get, m as mutable_source, t as template_effect, aB as set_value, e as event, E as bind_value, k as append, l as pop, V as setup_stores, d as set_text, j as set, n as getClient, W as store_get, ag as isValidIotaAddress, af as Transaction, aC as IOTA_SYSTEM_STATE_OBJECT_ID, aa as bcs, ac as activeAddress } from "/iota-utils/assets/index-DMTX9T8T.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-DcehgdgU.js";
import { f as formatNumbersWithUnderscores, a as formatNumberWithUnderscores } from "/iota-utils/assets/iota-nano-conversion-Bdstm8a9.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-C1QzcOuF.js";
import "/iota-utils/assets/transaction-view-BjnLkNb0.js";
var root_1 = from_html(`<div style="text-align: center;"><pre style="display: inline-block; text-align: left; margin: 0rem;"> </pre></div>`);
var root = from_html(`<main><button class="svelte-8fa537">list staked IOTA</button> <br/> <span>staked object id: <input placeholder="staked IOTA object id 0x..." size="67"/></span> <button class="svelte-8fa537">compute real rewards</button> <!> <hr/> It's only possible to stake to a candidate or active/committee validator, pending is not possible. <br/> <span>validator address: <input placeholder="validator address 0x..." size="67"/></span> <br/> <span>amount (min 1 IOTA, to unstake with rewards even more): <input type="number" placeholder="amount in NANO" min="1000000000" style="width: 14rem;"/> <input type="number" placeholder="amount in IOTA" min="1" style="width: 14rem;"/></span> <br/> <button class="svelte-8fa537">stake</button> <button class="svelte-8fa537">unstake single object</button> <button class="svelte-8fa537">unstake all</button> <button class="svelte-8fa537">simulate unstake specific amount</button> <button class="svelte-8fa537">unstake specific amount (exact is usually not possible)</button> <hr/> <button class="svelte-8fa537">list timelocked objects</button> <button class="svelte-8fa537">stake all timelocked objects</button> <!></main>`);
function Stake($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  let validatorAddress = mutable_source("0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215");
  const minStakeAmount = 2e9;
  let amount = mutable_source(minStakeAmount);
  let value = mutable_source({});
  let devInspectValue = mutable_source({});
  let stakedIotaObjectId = mutable_source("0x");
  const stake = async () => {
    try {
      if (!isValidIotaAddress(get(validatorAddress))) {
        throw new Error("invalid address");
      }
      const tx = new Transaction();
      const stakeCoin = tx.splitCoins(tx.gas, [get(amount)]);
      tx.moveCall({
        target: "0x3::iota_system::request_add_stake",
        arguments: [
          tx.sharedObjectRef({
            objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
            initialSharedVersion: 1,
            mutable: true
          }),
          stakeCoin,
          tx.pure.address(get(validatorAddress))
        ]
      });
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  async function unstakeSingle() {
    try {
      const client = getClient();
      let obj = await client.getObject({
        id: get(stakedIotaObjectId),
        options: { showContent: true }
      });
      let target;
      if (obj.data?.content?.type === "0x3::staking_pool::StakedIota") {
        target = "0x3::iota_system::request_withdraw_stake";
      }
      if (obj.data?.content?.type === "0x3::timelocked_staking::TimelockedStakedIota") {
        target = "0x3::timelocked_staking::request_withdraw_stake";
      }
      if (!target) {
        throw new Error("No staked IOTA object: " + get(stakedIotaObjectId));
      }
      const tx = new Transaction();
      tx.moveCall({
        target,
        arguments: [
          tx.sharedObjectRef({
            objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
            initialSharedVersion: 1,
            mutable: true
          }),
          tx.object(get(stakedIotaObjectId))
        ]
      });
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function computeRewards(stakedIotaObjectId2) {
    try {
      let stakeData = await devInspectStakedObject(stakedIotaObjectId2);
      stakeData = formatNumbersWithUnderscores(stakeData);
      set(devInspectValue, stakeData);
    } catch (err) {
      set(devInspectValue, err.toString());
      console.error(err);
    }
  }
  async function unstakeSpecificAmountSimulation(stakedIotaObjectId2) {
    try {
      let { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(stakedIotaObjectId2);
      let results = [];
      const amountDifferences = [
        -1000000000n,
        -1000n,
        -500n,
        -100n,
        -50n,
        -10n,
        -5n,
        -2n,
        -1n,
        0n,
        1n,
        2n,
        5n,
        10n,
        50n,
        100n,
        500n,
        1000n,
        1000000000n,
        10000000000n,
        1000000000000n
      ];
      for (let diff of amountDifferences) {
        let unstakeAmount = initialUnstakeAmount + diff;
        let tx = await buildSingleObjectUnstakeTransaction(stakedIotaObjectId2, unstakeAmount, timelocked);
        let txRes = await getClient().devInspectTransactionBlock({ sender: $activeAddress(), transactionBlock: tx });
        if (txRes.error) {
          results.push(txRes.error);
          continue;
        }
        let index = timelocked ? 1 : 0;
        let amountBytes = txRes.results[1].returnValues[index][0];
        let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
        let resString = `Unstake amount with ${diff.toString().padStart(12, " ")}: ${formatNumberWithUnderscores(unstakeAmount)}, would result in: ${formatNumberWithUnderscores(amountString)} for target amount: ${formatNumberWithUnderscores(get(amount))}`;
        if (unstakeAmount == initialUnstakeAmount) {
          results.push(resString + " this would be used");
        } else {
          results.push(resString);
        }
        set(value, results);
      }
      set(value, results);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function buildSingleObjectUnstakeTransaction(stakedIotaObjectId2, unstakeAmount, timelocked = false) {
    const tx = new Transaction();
    let splitStakedIota = tx.moveCall({
      target: timelocked ? "0x3::timelocked_staking::split" : "0x3::staking_pool::split",
      arguments: [tx.object(stakedIotaObjectId2), tx.pure.u64(unstakeAmount)]
    });
    let unstakedBalanceWithRewards;
    if (timelocked) {
      let [timelock, balance] = tx.moveCall({
        target: "0x3::timelocked_staking::request_withdraw_stake_non_entry",
        arguments: [tx.object("0x5"), tx.object(splitStakedIota)]
      });
      tx.moveCall({
        target: "0x2::timelock::transfer_to_sender",
        arguments: [timelock],
        typeArguments: ["0x2::balance::Balance<0x2::iota::IOTA>"]
      });
      unstakedBalanceWithRewards = balance;
    } else {
      let [balance] = tx.moveCall({
        target: "0x3::iota_system::request_withdraw_stake_non_entry",
        arguments: [tx.object("0x5"), splitStakedIota]
      });
      unstakedBalanceWithRewards = balance;
    }
    let [coin] = tx.moveCall({
      target: "0x2::coin::from_balance",
      arguments: [unstakedBalanceWithRewards],
      typeArguments: ["0x2::iota::IOTA"]
    });
    tx.transferObjects([coin], tx.pure.address($activeAddress()));
    return tx;
  }
  async function computeRequiredUnstakeAmount(stakedIotaObjectId2) {
    let stakeData = await devInspectStakedObject(stakedIotaObjectId2);
    let obj = await getClient().getObject({ id: stakedIotaObjectId2, options: { showContent: true } });
    let timelocked = false;
    if (obj.data?.content?.type === "0x3::timelocked_staking::TimelockedStakedIota") {
      timelocked = true;
    }
    if (!timelocked && obj.data?.content?.type != "0x3::staking_pool::StakedIota") {
      throw new Error("No staked IOTA object: " + stakedIotaObjectId2);
    }
    let initialStaked = BigInt(stakeData.initialStakedAmount);
    let rewards = BigInt(stakeData.rewards);
    if (rewards === 0n) throw new Error("No rewards available to withdraw.");
    let initialUnstakeAmount;
    if (timelocked) {
      initialUnstakeAmount = (BigInt(get(amount)) * initialStaked + rewards - 1n) / rewards;
    } else {
      initialUnstakeAmount = (BigInt(get(amount)) * initialStaked + (initialStaked + rewards - 1n)) / (initialStaked + rewards);
    }
    return { amount: initialUnstakeAmount, timelocked };
  }
  async function unstakeSpecificAmount(stakedIotaObjectId2) {
    try {
      let { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(stakedIotaObjectId2);
      let tx = await buildSingleObjectUnstakeTransaction(stakedIotaObjectId2, initialUnstakeAmount, timelocked);
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function devInspectStakedObject(stakedIotaObjectId2) {
    const client = getClient();
    let obj = await client.getObject({ id: stakedIotaObjectId2, options: { showContent: true } });
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
      throw new Error("No staked IOTA object: " + stakedIotaObjectId2);
    }
    const tx = new Transaction();
    tx.moveCall({
      target,
      arguments: [tx.object("0x5"), tx.object(stakedIotaObjectId2)]
    });
    const devInspectResult = await client.devInspectTransactionBlock({ sender: $activeAddress(), transactionBlock: tx });
    let index = timelocked ? 1 : 0;
    let amountBytes = devInspectResult.results[0].returnValues[index][0];
    let amountString = bcs.u64().parse(new Uint8Array(amountBytes));
    let totalUnstakeAmount = BigInt(amountString);
    let initialStakedAmount = BigInt(timelocked ? (
      // @ts-ignore
      obj.data.content.fields.staked_iota.fields.principal
    ) : (
      // @ts-ignore
      obj.data.content.fields.principal
    ));
    let res = {
      objectId: stakedIotaObjectId2,
      initialStakedAmount: initialStakedAmount.toString(),
      rewards: (timelocked ? totalUnstakeAmount : totalUnstakeAmount - initialStakedAmount).toString(),
      totalUnstakeAmount: totalUnstakeAmount.toString()
    };
    return res;
  }
  async function unstakeAll() {
    try {
      let staked = await listStakedIota();
      const tx = new Transaction();
      let firstBalance;
      for (let [index, delegatedStake] of staked.stakedIota.entries()) {
        for (let [innerIndex, stake2] of delegatedStake.stakes.entries()) {
          let balance = tx.moveCall({
            target: "0x3::iota_system::request_withdraw_stake_non_entry",
            arguments: [tx.object("0x5"), tx.object(stake2.stakedIotaId)]
          });
          if (index == 0 && innerIndex == 0) {
            firstBalance = balance;
          } else {
            tx.moveCall({
              target: "0x2::balance::join",
              arguments: [firstBalance, balance],
              typeArguments: ["0x2::iota::IOTA"]
            });
          }
        }
      }
      for (let [index, delegatedTimelockedStake] of staked.timelockedStakedIota.entries()) {
        for (let [innerIndex, timelockedStake] of delegatedTimelockedStake.stakes.entries()) {
          let [timelock, balance] = tx.moveCall({
            target: "0x3::timelocked_staking::request_withdraw_stake_non_entry",
            arguments: [
              tx.object("0x5"),
              tx.object(timelockedStake.timelockedStakedIotaId)
            ]
          });
          tx.moveCall({
            target: "0x2::timelock::transfer_to_sender",
            arguments: [timelock],
            typeArguments: ["0x2::balance::Balance<0x2::iota::IOTA>"]
          });
          if (index == 0 && innerIndex == 0 && !firstBalance) {
            firstBalance = balance;
          } else {
            tx.moveCall({
              target: "0x2::balance::join",
              arguments: [firstBalance, balance],
              typeArguments: ["0x2::iota::IOTA"]
            });
          }
        }
      }
      let [coin] = tx.moveCall({
        target: "0x2::coin::from_balance",
        arguments: [firstBalance],
        typeArguments: ["0x2::iota::IOTA"]
      });
      tx.transferObjects([coin], tx.pure.address($activeAddress()));
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  const getTimelockedObjects = async () => {
    const client = getClient();
    let ownedObjectPage = await client.getOwnedObjects({
      owner: $activeAddress(),
      filter: {
        StructType: "0x2::timelock::TimeLock<0x2::balance::Balance<0x2::iota::IOTA>>"
      },
      options: { showContent: true }
    });
    if (ownedObjectPage.data.length == 0) {
      throw new Error("no timelocked object found");
    }
    return ownedObjectPage.data.map((d) => d.data);
  };
  const stakeAllTimelockedObjects = async () => {
    try {
      if (!isValidIotaAddress(get(validatorAddress))) {
        throw new Error("invalid address");
      }
      const tx = new Transaction();
      let timelockedObjects = await getTimelockedObjects();
      for (const timelockedObject of timelockedObjects) {
        tx.moveCall({
          target: "0x3::timelocked_staking::request_add_stake",
          arguments: [
            tx.sharedObjectRef({
              objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
              initialSharedVersion: 1,
              mutable: true
            }),
            tx.object(timelockedObject.objectId),
            tx.pure.address(get(validatorAddress))
          ]
        });
      }
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  async function listStakedIota() {
    try {
      const client = getClient();
      const stakedIota = await client.getStakes({ owner: $activeAddress() });
      let totalRewards = BigInt(0);
      const timelockedStakedIota = await client.getTimelockedStakes({ owner: $activeAddress() });
      if (stakedIota.length == 0 && timelockedStakedIota.length == 0) {
        throw new Error("no staked IOTA found");
      }
      if (stakedIota.length != 0) {
        set(stakedIotaObjectId, stakedIota[0].stakes[0].stakedIotaId);
      } else {
        set(stakedIotaObjectId, timelockedStakedIota[0].stakes[0].timelockedStakedIotaId);
      }
      for (let delegatedStake of stakedIota) {
        for (let stake2 of delegatedStake.stakes) {
          let stakeData = await devInspectStakedObject(stake2.stakedIotaId);
          totalRewards += BigInt(stakeData.rewards);
          stake2.actualRewards = stakeData.rewards;
          let formattedStake = formatNumbersWithUnderscores(stake2);
          for (const key in formattedStake) {
            stake2[key] = formattedStake[key];
          }
        }
      }
      for (let delegatedTimelockedStake of timelockedStakedIota) {
        for (let timelockedStake of delegatedTimelockedStake.stakes) {
          let stakeData = await devInspectStakedObject(timelockedStake.timelockedStakedIotaId);
          totalRewards += BigInt(stakeData.rewards);
          timelockedStake.actualRewards = stakeData.rewards;
          let formattedTimelockedStake = formatNumbersWithUnderscores(timelockedStake);
          for (const key in formattedTimelockedStake) {
            timelockedStake[key] = formattedTimelockedStake[key];
          }
        }
      }
      let res = {
        stakedIota,
        timelockedStakedIota,
        totalRewards: formatNumberWithUnderscores(totalRewards)
      };
      set(value, res);
      return res;
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  init();
  var main = root();
  var button = child(main);
  var span = sibling(button, 4);
  var input = sibling(child(span));
  var button_1 = sibling(span, 2);
  var node = sibling(button_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div = root_1();
      var pre = child(div);
      var text = child(pre);
      template_effect(($0) => set_text(text, $0), [() => JSON.stringify(get(devInspectValue), null, 2)]);
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (Object.keys(get(devInspectValue)).length > 0) $$render(consequent);
    });
  }
  var span_1 = sibling(node, 6);
  var input_1 = sibling(child(span_1));
  var span_2 = sibling(span_1, 4);
  var input_2 = sibling(child(span_2));
  var input_3 = sibling(input_2, 2);
  var button_2 = sibling(span_2, 4);
  var button_3 = sibling(button_2, 2);
  var button_4 = sibling(button_3, 2);
  var button_5 = sibling(button_4, 2);
  var button_6 = sibling(button_5, 2);
  var button_7 = sibling(button_6, 4);
  var button_8 = sibling(button_7, 2);
  var node_1 = sibling(button_8, 2);
  JsonToggleView(node_1, {
    get value() {
      return get(value);
    }
  });
  template_effect(($0) => set_value(input_3, $0), [() => (get(amount) / 1e9).toFixed(9)]);
  event("click", button, () => listStakedIota());
  bind_value(input, () => get(stakedIotaObjectId), ($$value) => set(stakedIotaObjectId, $$value));
  event("click", button_1, () => computeRewards(get(stakedIotaObjectId)));
  bind_value(input_1, () => get(validatorAddress), ($$value) => set(validatorAddress, $$value));
  bind_value(input_2, () => get(amount), ($$value) => set(amount, $$value));
  event("input", input_3, (e) => {
    set(amount, e.target.value * 1e9);
  });
  event("click", button_2, () => stake());
  event("click", button_3, () => unstakeSingle());
  event("click", button_4, () => unstakeAll());
  event("click", button_5, () => unstakeSpecificAmountSimulation(get(stakedIotaObjectId)));
  event("click", button_6, () => unstakeSpecificAmount(get(stakedIotaObjectId)));
  event("click", button_7, () => {
    getTimelockedObjects().then((timelockedObjects) => {
      set(value, timelockedObjects);
    }).catch((err) => {
      set(value, err.toString());
      console.error(err);
    });
  });
  event("click", button_8, () => stakeAllTimelockedObjects());
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  Stake as default
};

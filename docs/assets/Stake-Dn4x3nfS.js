import { az as Transaction, aA as IOTA_SYSTEM_STATE_OBJECT_ID, aH as bcs, aa as isValidIotaAddress, p as push, $ as legacy_pre_effect, g as get, s as set, a1 as legacy_pre_effect_reset, v as init, b as sibling, h as child, i as if_block, N as TransactionView, t as template_effect, c as set_text, w as event, H as bind_value, d as append, l as pop, F as setup_stores, y as mutable_source, B as getClient, a2 as untrack, m as user_derived, a0 as deep_read_state, n as nanoToIotaFormatted, a8 as set_style, q as from_html, W as first_child, f as formatNumbersWithUnderscores, ax as formatNumberWithUnderscores, E as store_get, aq as activeAddress, X as comment, e as each, j as index } from "./index-DtiGzVAl.js";
import { I as IotaAmountInput } from "./IotaAmountInput-D19GzCRI.js";
import { e as executeTransaction } from "./transaction-execution-Dbw-OnIh.js";
import { c as computeStakingRewards } from "./staking-utils-DiLduGje.js";
function buildStakeTransaction(validatorAddress, amount) {
  const tx = new Transaction();
  const stakeCoin = tx.splitCoins(tx.gas, [amount]);
  tx.moveCall({
    target: "0x3::iota_system::request_add_stake",
    arguments: [
      tx.sharedObjectRef({
        objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
        initialSharedVersion: 1,
        mutable: true
      }),
      stakeCoin,
      tx.pure.address(validatorAddress)
    ]
  });
  return tx;
}
async function buildUnstakeSingleTransaction(client, stakedIotaObjectId) {
  const obj = await client.getObject({
    id: stakedIotaObjectId,
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
    throw new Error("No staked IOTA object: " + stakedIotaObjectId);
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
      tx.object(stakedIotaObjectId)
    ]
  });
  return tx;
}
function buildSingleObjectUnstakeTransaction(stakedIotaObjectId, unstakeAmount, timelocked, targetAddress) {
  const tx = new Transaction();
  const splitStakedIota = tx.moveCall({
    target: timelocked ? "0x3::timelocked_staking::split" : "0x3::staking_pool::split",
    arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)]
  });
  let unstakedBalanceWithRewards;
  if (timelocked) {
    const [timelock, balance] = tx.moveCall({
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
    const [balance] = tx.moveCall({
      target: "0x3::iota_system::request_withdraw_stake_non_entry",
      arguments: [tx.object("0x5"), splitStakedIota]
    });
    unstakedBalanceWithRewards = balance;
  }
  const [coin] = tx.moveCall({
    target: "0x2::coin::from_balance",
    arguments: [unstakedBalanceWithRewards],
    typeArguments: ["0x2::iota::IOTA"]
  });
  tx.transferObjects([coin], tx.pure.address(targetAddress));
  return tx;
}
async function computeRequiredUnstakeAmount(client, stakedIotaObjectId, targetAmount, activeAddress2) {
  const stakeData = await computeStakingRewards(client, stakedIotaObjectId, activeAddress2);
  const obj = await client.getObject({
    id: stakedIotaObjectId,
    options: { showContent: true }
  });
  let timelocked = false;
  if (obj.data?.content?.type === "0x3::timelocked_staking::TimelockedStakedIota") {
    timelocked = true;
  }
  if (!timelocked && obj.data?.content?.type !== "0x3::staking_pool::StakedIota") {
    throw new Error("No staked IOTA object: " + stakedIotaObjectId);
  }
  const initialStaked = BigInt(stakeData.initialStakedAmount);
  const rewards = BigInt(stakeData.rewards);
  if (rewards === 0n) throw new Error("No rewards available to withdraw.");
  let initialUnstakeAmount;
  if (timelocked) {
    initialUnstakeAmount = (targetAmount * initialStaked + rewards - 1n) / rewards;
  } else {
    initialUnstakeAmount = (targetAmount * initialStaked + (initialStaked + rewards - 1n)) / (initialStaked + rewards);
  }
  return {
    amount: initialUnstakeAmount,
    timelocked
  };
}
async function devInspectStakedObject(client, stakedIotaObjectId, activeAddress2) {
  return computeStakingRewards(client, stakedIotaObjectId, activeAddress2);
}
function buildUnstakeAllTransaction(stakedIota, timelockedStakedIota, targetAddress) {
  const tx = new Transaction();
  let firstBalance;
  for (const [index2, delegatedStake] of stakedIota.entries()) {
    for (const [innerIndex, stake] of delegatedStake.stakes.entries()) {
      const balance = tx.moveCall({
        target: "0x3::iota_system::request_withdraw_stake_non_entry",
        arguments: [tx.object("0x5"), tx.object(stake.stakedIotaId)]
      });
      if (index2 === 0 && innerIndex === 0) {
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
  for (const [index2, delegatedTimelockedStake] of timelockedStakedIota.entries()) {
    for (const [innerIndex, timelockedStake] of delegatedTimelockedStake.stakes.entries()) {
      const [timelock, balance] = tx.moveCall({
        target: "0x3::timelocked_staking::request_withdraw_stake_non_entry",
        arguments: [tx.object("0x5"), tx.object(timelockedStake.timelockedStakedIotaId)]
      });
      tx.moveCall({
        target: "0x2::timelock::transfer_to_sender",
        arguments: [timelock],
        typeArguments: ["0x2::balance::Balance<0x2::iota::IOTA>"]
      });
      if (index2 === 0 && innerIndex === 0 && !firstBalance) {
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
  const [coin] = tx.moveCall({
    target: "0x2::coin::from_balance",
    arguments: [firstBalance],
    typeArguments: ["0x2::iota::IOTA"]
  });
  tx.transferObjects([coin], tx.pure.address(targetAddress));
  return tx;
}
async function getTimelockedObjects(client, address) {
  const ownedObjectPage = await client.getOwnedObjects({
    owner: address,
    filter: {
      StructType: "0x2::timelock::TimeLock<0x2::balance::Balance<0x2::iota::IOTA>>"
    },
    options: {
      showContent: true
    }
  });
  if (ownedObjectPage.data.length === 0) {
    throw new Error("no timelocked object found");
  }
  return ownedObjectPage.data.map((d) => d.data);
}
async function unstakeSpecificAmountSimulation(client, stakedIotaObjectId, targetAmount, activeAddress2) {
  const { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(
    client,
    stakedIotaObjectId,
    targetAmount,
    activeAddress2
  );
  const results = [];
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
  for (const diff of amountDifferences) {
    const unstakeAmount = initialUnstakeAmount + diff;
    const tx = buildSingleObjectUnstakeTransaction(
      stakedIotaObjectId,
      unstakeAmount,
      timelocked,
      activeAddress2
    );
    const txRes = await client.devInspectTransactionBlock({
      sender: activeAddress2,
      transactionBlock: tx
    });
    if (txRes.error) {
      results.push(txRes.error);
      continue;
    }
    const index2 = timelocked ? 1 : 0;
    const amountBytes = txRes.results[1].returnValues[index2][0];
    const amountString = bcs.u64().parse(new Uint8Array(amountBytes));
    const resString = `Unstake amount with ${diff.toString().padStart(12, " ")}: ${formatNumber(unstakeAmount)}, would result in: ${formatNumber(BigInt(amountString))} for target amount: ${formatNumber(targetAmount)}`;
    if (unstakeAmount === initialUnstakeAmount) {
      results.push(resString + " this would be used");
    } else {
      results.push(resString);
    }
  }
  return results;
}
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}
function getCommitteeMemberAddresses(systemState) {
  const committeeMemberAddresses = /* @__PURE__ */ new Set();
  if (systemState.committeeMembers && Array.isArray(systemState.committeeMembers)) {
    systemState.committeeMembers.forEach((validator) => {
      committeeMemberAddresses.add(validator.iotaAddress);
    });
  }
  return committeeMemberAddresses;
}
function isValidatorCommitteeMember(validatorAddress, committeeMemberAddresses) {
  return committeeMemberAddresses.has(validatorAddress) || committeeMemberAddresses.size === 0;
}
async function fetchValidatorByAddress(client, address) {
  if (!address || !isValidIotaAddress(address)) return null;
  try {
    const systemState = await client.getLatestIotaSystemState();
    const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);
    for (const validator of systemState.activeValidators) {
      if (validator.iotaAddress === address) {
        const isCommitteeMember = isValidatorCommitteeMember(
          validator.iotaAddress,
          committeeMemberAddresses
        );
        return {
          address: validator.iotaAddress,
          name: validator.name || "Unknown",
          status: isCommitteeMember ? "Committee Member" : "Active Validator",
          stake: validator.stakingPoolIotaBalance
        };
      }
    }
    const validatorCandidatesId = systemState.validatorCandidatesId;
    let hasNextPage = true;
    let nextPageCursor;
    while (hasNextPage) {
      const candidateValidatorsPage = await client.getDynamicFields({
        parentId: validatorCandidatesId,
        cursor: nextPageCursor
      });
      for (const candidateValidator of candidateValidatorsPage.data) {
        try {
          const validatorWrapper = await client.getDynamicFieldObject({
            objectId: validatorCandidatesId,
            name: candidateValidator.name
          });
          const validatorV1 = await client.getDynamicFields({
            parentId: (
              // @ts-ignore
              validatorWrapper.data?.content.fields.value.fields.inner.fields.id.id
            )
          });
          const validatorObject = await client.getObject({
            id: validatorV1.data[0].objectId,
            options: { showContent: true }
          });
          const validator = (
            // @ts-ignore
            validatorObject.data?.content.fields.value.fields
          );
          if (validator.metadata.fields.iota_address === address) {
            return {
              address: validator.metadata.fields.iota_address,
              name: validator.metadata.fields.name || "Unknown",
              status: "Candidate",
              stake: validator.staking_pool.fields.iota_balance
            };
          }
        } catch (err) {
          console.warn("Failed to check candidate validator:", err);
        }
      }
      hasNextPage = candidateValidatorsPage.hasNextPage;
      if (hasNextPage) {
        nextPageCursor = candidateValidatorsPage.nextCursor;
      }
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch validator by address:", err);
    return null;
  }
}
var root_1 = from_html(`<div style="text-align: center;"><pre style="display: inline-block; text-align: left; margin: 0rem;"> </pre></div>`);
var root_3 = from_html(`<p>Loading validators...</p>`);
var root_4 = from_html(`<button class="svelte-qq920f">Load Validators</button>`);
var root_7 = from_html(`<div class="validator-item svelte-qq920f" style="margin: 0.125rem 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" role="button" tabindex="0"><div class="validator-content svelte-qq920f"><span class="validator-address svelte-qq920f"> </span> <span class="validator-status svelte-qq920f" style="color: #2e7d32;"> </span> <span class="validator-name svelte-qq920f"> </span> <span class="validator-stake svelte-qq920f"> </span></div></div>`);
var root_9 = from_html(`<div class="validator-item svelte-qq920f" style="margin: 0.125rem 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" role="button" tabindex="0"><div class="validator-content svelte-qq920f"><span class="validator-address svelte-qq920f"> </span> <span class="validator-status svelte-qq920f" style="color: #f57f17;"> </span> <span class="validator-name svelte-qq920f"> </span> <span class="validator-stake svelte-qq920f"> </span></div></div>`);
var root_11 = from_html(`<div class="validator-item svelte-qq920f" style="margin: 0.125rem 0; border: 1px solid grey; border-radius: 4px; cursor: pointer;" role="button" tabindex="0"><div class="validator-content svelte-qq920f"><span class="validator-address svelte-qq920f"> </span> <span class="validator-status svelte-qq920f" style="color: #c62828;"> </span> <span class="validator-name svelte-qq920f"> </span> <span class="validator-stake svelte-qq920f"> </span></div></div>`);
var root_5 = from_html(`<div><strong>Select a validator:</strong></div> <div style="margin-bottom: 1rem;"><div class="section-header svelte-qq920f" style="font-weight: bold; border: 1px solid grey; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" role="button" tabindex="0"><span class="svelte-qq920f"> </span> <span class="svelte-qq920f"> </span></div> <!></div> <div style="margin-bottom: 1rem;"><div class="section-header svelte-qq920f" style="font-weight: bold; border: 1px solid grey; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" role="button" tabindex="0"><span class="svelte-qq920f"> </span> <span class="svelte-qq920f"> </span></div> <!></div> <div><div class="section-header svelte-qq920f" style="font-weight: bold; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" role="button" tabindex="0"><span class="svelte-qq920f"> </span> <span class="svelte-qq920f"> </span></div> <!></div>`, 1);
var root_2 = from_html(`<div class="validator-selection svelte-qq920f"><!></div>`);
var root_12 = from_html(`<div class="validator-selection svelte-qq920f"><div><strong>Selected Validator:</strong> <button style="margin-left: 1rem; font-size: 0.8em;" class="svelte-qq920f">Change</button></div> <div class="validator-item svelte-qq920f" style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px;"><div class="validator-content svelte-qq920f"><span class="validator-address svelte-qq920f"> </span> <span class="validator-status svelte-qq920f"> </span> <span class="validator-name svelte-qq920f"> </span> <span class="validator-stake svelte-qq920f"> </span></div></div></div>`);
var root = from_html(`<main><button class="svelte-qq920f">list staked IOTA</button> <br/> <span class="svelte-qq920f">staked object id: <input placeholder="staked IOTA object id 0x..." style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;" class="svelte-qq920f"/></span> <button class="svelte-qq920f">compute real rewards</button> <!> <hr/> It's only possible to stake to a candidate or active/committee validator, pending is not possible. <br/> <span class="svelte-qq920f">validator address: <input placeholder="validator address 0x..." style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;" class="svelte-qq920f"/> <button class="svelte-qq920f"> </button></span> <!> <br/> <div style="margin-bottom: 1rem; display: flex; justify-content: center;"><!></div> <br/> <button class="svelte-qq920f">stake</button> <button class="svelte-qq920f">unstake single object</button> <button class="svelte-qq920f">unstake all</button> <button class="svelte-qq920f">simulate unstake specific amount</button> <button class="svelte-qq920f">unstake specific amount (exact is usually not possible)</button> <hr/> <button class="svelte-qq920f">list timelocked objects</button> <button class="svelte-qq920f">stake all timelocked objects</button> <!></main>`);
function Stake($$anchor, $$props) {
  push($$props, false);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let validatorAddress = mutable_source("");
  const minStakeAmount = 2e9;
  let amount = mutable_source(minStakeAmount);
  let value = mutable_source({});
  let devInspectValue = mutable_source({});
  let stakedIotaObjectId = mutable_source("0x");
  let validators = mutable_source([]);
  let loadingValidators = mutable_source(false);
  let showValidatorSelection = mutable_source(false);
  let selectedValidator = mutable_source(null);
  let showCommitteeMembers = mutable_source(true);
  let showActiveValidators = mutable_source(true);
  let showCandidates = mutable_source(true);
  const stake = async () => {
    try {
      if (!isValidIotaAddress(get(validatorAddress))) {
        throw new Error("invalid address");
      }
      const tx = buildStakeTransaction(get(validatorAddress), get(amount));
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  async function unstakeSingle() {
    try {
      const tx = await buildUnstakeSingleTransaction(getClient(), get(stakedIotaObjectId));
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function computeRewards(stakedIotaObjectId2) {
    try {
      let stakeData = await devInspectStakedObject(getClient(), stakedIotaObjectId2, $activeAddress());
      stakeData = formatNumbersWithUnderscores(stakeData);
      set(devInspectValue, stakeData);
    } catch (err) {
      set(devInspectValue, err.toString());
      console.error(err);
    }
  }
  async function unstakeSpecificAmountSim(stakedIotaObjectId2) {
    try {
      const results = await unstakeSpecificAmountSimulation(getClient(), stakedIotaObjectId2, BigInt(get(amount)), $activeAddress());
      set(value, results);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function unstakeSpecificAmount(stakedIotaObjectId2) {
    try {
      const { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(getClient(), stakedIotaObjectId2, BigInt(get(amount)), $activeAddress());
      const tx = buildSingleObjectUnstakeTransaction(stakedIotaObjectId2, initialUnstakeAmount, timelocked, $activeAddress());
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  const handleLoadValidators = async () => {
    try {
      set(loadingValidators, true);
      set(validators, []);
      const client = getClient();
      const systemState = await client.getLatestIotaSystemState();
      console.log("System state structure:", systemState);
      console.log("Validator candidates size:", systemState.validatorCandidatesSize, "ID:", systemState.validatorCandidatesId);
      const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);
      for (const validator of systemState.activeValidators) {
        const isCommitteeMember = isValidatorCommitteeMember(validator.iotaAddress, committeeMemberAddresses);
        get(validators).push({
          address: validator.iotaAddress,
          name: validator.name || "Unknown",
          status: isCommitteeMember ? "Committee Member" : "Active Validator",
          stake: validator.stakingPoolIotaBalance
        });
      }
      const validatorCandidatesId = systemState.validatorCandidatesId;
      let hasNextPage = true;
      let nextPageCursor;
      while (hasNextPage) {
        const candidateValidatorsPage = await client.getDynamicFields({ parentId: validatorCandidatesId, cursor: nextPageCursor });
        console.log("Candidate validators page:", candidateValidatorsPage);
        for (const candidateValidator of candidateValidatorsPage.data) {
          try {
            const validatorWrapper = await client.getDynamicFieldObjectV2({
              parentObjectId: validatorCandidatesId,
              name: candidateValidator.name,
              options: { showContent: true }
            });
            const innerId = validatorWrapper.data.content.fields.value.fields.inner.fields.id.id;
            const validatorV1 = await client.getDynamicFields({ parentId: innerId });
            const validatorObject = await client.getObject({
              id: validatorV1.data[0].objectId,
              options: { showContent: true }
            });
            const validator = (
              // @ts-ignore
              validatorObject.data?.content.fields.value.fields
            );
            get(validators).push({
              address: validator.metadata.fields.iota_address,
              name: validator.metadata.fields.name || "Unknown",
              status: "Candidate",
              stake: validator.staking_pool.fields.iota_balance
            });
          } catch (err) {
            console.warn("Failed to load candidate validator:", err);
          }
        }
        hasNextPage = candidateValidatorsPage.hasNextPage;
        if (hasNextPage) {
          nextPageCursor = candidateValidatorsPage.nextCursor;
        }
      }
      get(validators).sort((a, b) => {
        const statusOrder = { "Committee Member": 0, "Active Validator": 1, Candidate: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    } catch (err) {
      console.error("Failed to load validators:", err);
      set(value, "Failed to load validators: " + err.toString());
    } finally {
      set(loadingValidators, false);
    }
  };
  const selectValidator = (address) => {
    set(validatorAddress, address);
    set(selectedValidator, get(validators).find((v) => v.address === address) || null);
    set(showValidatorSelection, false);
  };
  const findValidatorByAddress = (address) => {
    if (get(validators).length === 0) return null;
    return get(validators).find((v) => v.address === address) || null;
  };
  const handleFetchValidatorByAddress = async (address) => {
    const validator = await fetchValidatorByAddress(getClient(), address);
    if (validator && get(validatorAddress) === validator.address) {
      set(selectedValidator, validator);
    }
  };
  async function unstakeAll() {
    try {
      const staked = await listStakedIota();
      const tx = buildUnstakeAllTransaction(staked.stakedIota, staked.timelockedStakedIota, $activeAddress());
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  const handleGetTimelockedObjects = async () => {
    return getTimelockedObjects(getClient(), $activeAddress());
  };
  const stakeAllTimelockedObjects = async () => {
    try {
      if (!isValidIotaAddress(get(validatorAddress))) {
        throw new Error("invalid address");
      }
      const tx = new Transaction();
      let timelockedObjects = await handleGetTimelockedObjects();
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
          let stakeData = await devInspectStakedObject(getClient(), stake2.stakedIotaId, $activeAddress());
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
          let stakeData = await devInspectStakedObject(getClient(), timelockedStake.timelockedStakedIotaId, $activeAddress());
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
  legacy_pre_effect(() => (get(validatorAddress), isValidIotaAddress), () => {
    if (get(validatorAddress) && isValidIotaAddress(get(validatorAddress))) {
      const foundValidator = findValidatorByAddress(get(validatorAddress));
      if (foundValidator) {
        set(selectedValidator, foundValidator);
      } else {
        handleFetchValidatorByAddress(get(validatorAddress));
      }
    } else {
      set(selectedValidator, null);
    }
  });
  legacy_pre_effect_reset();
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
      template_effect(($0) => set_text(text, $0), [
        () => (get(devInspectValue), untrack(() => JSON.stringify(get(devInspectValue), null, 2)))
      ]);
      append($$anchor2, div);
    };
    var d = user_derived(() => (get(devInspectValue), untrack(() => Object.keys(get(devInspectValue)).length > 0)));
    if_block(node, ($$render) => {
      if (get(d)) $$render(consequent);
    });
  }
  var span_1 = sibling(node, 6);
  var input_1 = sibling(child(span_1));
  var button_2 = sibling(input_1, 2);
  var text_1 = child(button_2);
  var node_1 = sibling(span_1, 2);
  {
    var consequent_6 = ($$anchor2) => {
      var div_1 = root_2();
      var node_2 = child(div_1);
      {
        var consequent_1 = ($$anchor3) => {
          var p = root_3();
          append($$anchor3, p);
        };
        var consequent_2 = ($$anchor3) => {
          var button_3 = root_4();
          event("click", button_3, handleLoadValidators);
          append($$anchor3, button_3);
        };
        var alternate = ($$anchor3) => {
          var fragment = root_5();
          var div_2 = sibling(first_child(fragment), 2);
          var div_3 = child(div_2);
          var span_2 = child(div_3);
          var text_2 = child(span_2);
          var span_3 = sibling(span_2, 2);
          var text_3 = child(span_3);
          var node_3 = sibling(div_3, 2);
          {
            var consequent_3 = ($$anchor4) => {
              var fragment_1 = comment();
              var node_4 = first_child(fragment_1);
              each(
                node_4,
                1,
                () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Committee Member"))),
                index,
                ($$anchor5, validator) => {
                  var div_4 = root_7();
                  var div_5 = child(div_4);
                  var span_4 = child(div_5);
                  var text_4 = child(span_4);
                  var span_5 = sibling(span_4, 2);
                  var text_5 = child(span_5);
                  var span_6 = sibling(span_5, 2);
                  var text_6 = child(span_6);
                  var span_7 = sibling(span_6, 2);
                  var text_7 = child(span_7);
                  template_effect(
                    ($0) => {
                      set_text(text_4, (get(validator), untrack(() => get(validator).address)));
                      set_text(text_5, (get(validator), untrack(() => get(validator).status)));
                      set_text(text_6, (get(validator), untrack(() => get(validator).name)));
                      set_text(text_7, `Current Stake: ${$0 ?? ""} IOTA`);
                    },
                    [
                      () => (deep_read_state(nanoToIotaFormatted), get(validator), untrack(() => nanoToIotaFormatted(get(validator).stake)))
                    ]
                  );
                  event("click", div_4, () => selectValidator(get(validator).address));
                  event("keydown", div_4, (e) => e.key === "Enter" && selectValidator(get(validator).address));
                  append($$anchor5, div_4);
                }
              );
              append($$anchor4, fragment_1);
            };
            if_block(node_3, ($$render) => {
              if (get(showCommitteeMembers)) $$render(consequent_3);
            });
          }
          var div_6 = sibling(div_2, 2);
          var div_7 = child(div_6);
          var span_8 = child(div_7);
          var text_8 = child(span_8);
          var span_9 = sibling(span_8, 2);
          var text_9 = child(span_9);
          var node_5 = sibling(div_7, 2);
          {
            var consequent_4 = ($$anchor4) => {
              var fragment_2 = comment();
              var node_6 = first_child(fragment_2);
              each(
                node_6,
                1,
                () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Active Validator"))),
                index,
                ($$anchor5, validator) => {
                  var div_8 = root_9();
                  var div_9 = child(div_8);
                  var span_10 = child(div_9);
                  var text_10 = child(span_10);
                  var span_11 = sibling(span_10, 2);
                  var text_11 = child(span_11);
                  var span_12 = sibling(span_11, 2);
                  var text_12 = child(span_12);
                  var span_13 = sibling(span_12, 2);
                  var text_13 = child(span_13);
                  template_effect(
                    ($0) => {
                      set_text(text_10, (get(validator), untrack(() => get(validator).address)));
                      set_text(text_11, (get(validator), untrack(() => get(validator).status)));
                      set_text(text_12, (get(validator), untrack(() => get(validator).name)));
                      set_text(text_13, `Current Stake: ${$0 ?? ""} IOTA`);
                    },
                    [
                      () => (deep_read_state(nanoToIotaFormatted), get(validator), untrack(() => nanoToIotaFormatted(get(validator).stake)))
                    ]
                  );
                  event("click", div_8, () => selectValidator(get(validator).address));
                  event("keydown", div_8, (e) => e.key === "Enter" && selectValidator(get(validator).address));
                  append($$anchor5, div_8);
                }
              );
              append($$anchor4, fragment_2);
            };
            if_block(node_5, ($$render) => {
              if (get(showActiveValidators)) $$render(consequent_4);
            });
          }
          var div_10 = sibling(div_6, 2);
          var div_11 = child(div_10);
          var span_14 = child(div_11);
          var text_14 = child(span_14);
          var span_15 = sibling(span_14, 2);
          var text_15 = child(span_15);
          var node_7 = sibling(div_11, 2);
          {
            var consequent_5 = ($$anchor4) => {
              var fragment_3 = comment();
              var node_8 = first_child(fragment_3);
              each(
                node_8,
                1,
                () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Candidate"))),
                index,
                ($$anchor5, validator) => {
                  var div_12 = root_11();
                  var div_13 = child(div_12);
                  var span_16 = child(div_13);
                  var text_16 = child(span_16);
                  var span_17 = sibling(span_16, 2);
                  var text_17 = child(span_17);
                  var span_18 = sibling(span_17, 2);
                  var text_18 = child(span_18);
                  var span_19 = sibling(span_18, 2);
                  var text_19 = child(span_19);
                  template_effect(
                    ($0) => {
                      set_text(text_16, (get(validator), untrack(() => get(validator).address)));
                      set_text(text_17, (get(validator), untrack(() => get(validator).status)));
                      set_text(text_18, (get(validator), untrack(() => get(validator).name)));
                      set_text(text_19, `Current Stake: ${$0 ?? ""} IOTA`);
                    },
                    [
                      () => (deep_read_state(nanoToIotaFormatted), get(validator), untrack(() => nanoToIotaFormatted(get(validator).stake)))
                    ]
                  );
                  event("click", div_12, () => selectValidator(get(validator).address));
                  event("keydown", div_12, (e) => e.key === "Enter" && selectValidator(get(validator).address));
                  append($$anchor5, div_12);
                }
              );
              append($$anchor4, fragment_3);
            };
            if_block(node_7, ($$render) => {
              if (get(showCandidates)) $$render(consequent_5);
            });
          }
          template_effect(
            ($0, $1, $2) => {
              set_text(text_2, `Committee Members (${$0 ?? ""})`);
              set_text(text_3, get(showCommitteeMembers) ? "▼" : "▶");
              set_text(text_8, `Active Validators (${$1 ?? ""})`);
              set_text(text_9, get(showActiveValidators) ? "▼" : "▶");
              set_text(text_14, `Candidate Validators (${$2 ?? ""})`);
              set_text(text_15, get(showCandidates) ? "▼" : "▶");
            },
            [
              () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Committee Member").length)),
              () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Active Validator").length)),
              () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Candidate").length))
            ]
          );
          event("click", div_3, () => set(showCommitteeMembers, !get(showCommitteeMembers)));
          event("keydown", div_3, (e) => e.key === "Enter" && set(showCommitteeMembers, !get(showCommitteeMembers)));
          event("click", div_7, () => set(showActiveValidators, !get(showActiveValidators)));
          event("keydown", div_7, (e) => e.key === "Enter" && set(showActiveValidators, !get(showActiveValidators)));
          event("click", div_11, () => set(showCandidates, !get(showCandidates)));
          event("keydown", div_11, (e) => e.key === "Enter" && set(showCandidates, !get(showCandidates)));
          append($$anchor3, fragment);
        };
        if_block(node_2, ($$render) => {
          if (get(loadingValidators)) $$render(consequent_1);
          else if (get(validators), untrack(() => get(validators).length === 0)) $$render(consequent_2, 1);
          else $$render(alternate, -1);
        });
      }
      append($$anchor2, div_1);
    };
    var consequent_7 = ($$anchor2) => {
      var div_14 = root_12();
      var div_15 = child(div_14);
      var button_4 = sibling(child(div_15), 2);
      var div_16 = sibling(div_15, 2);
      var div_17 = child(div_16);
      var span_20 = child(div_17);
      var text_20 = child(span_20);
      var span_21 = sibling(span_20, 2);
      var text_21 = child(span_21);
      var span_22 = sibling(span_21, 2);
      var text_22 = child(span_22);
      var span_23 = sibling(span_22, 2);
      var text_23 = child(span_23);
      template_effect(
        ($0) => {
          set_text(text_20, (get(selectedValidator), untrack(() => get(selectedValidator).address)));
          set_style(span_21, `color: ${(get(selectedValidator), untrack(() => get(selectedValidator).status === "Committee Member" ? "#2e7d32" : get(selectedValidator).status === "Active Validator" ? "#f57f17" : "#c62828")) ?? ""};`);
          set_text(text_21, (get(selectedValidator), untrack(() => get(selectedValidator).status)));
          set_text(text_22, (get(selectedValidator), untrack(() => get(selectedValidator).name)));
          set_text(text_23, `Current Stake: ${$0 ?? ""} IOTA`);
        },
        [
          () => (deep_read_state(nanoToIotaFormatted), get(selectedValidator), untrack(() => nanoToIotaFormatted(get(selectedValidator).stake)))
        ]
      );
      event("click", button_4, () => {
        set(showValidatorSelection, true);
      });
      append($$anchor2, div_14);
    };
    if_block(node_1, ($$render) => {
      if (get(showValidatorSelection)) $$render(consequent_6);
      else if (get(selectedValidator)) $$render(consequent_7, 1);
    });
  }
  var div_18 = sibling(node_1, 4);
  var node_9 = child(div_18);
  IotaAmountInput(node_9, {
    id: "stake-amount",
    label: "Amount (min 1 IOTA, to unstake with rewards even more)",
    placeholder: "1000000000",
    get value() {
      return get(amount);
    },
    set value($$value) {
      set(amount, $$value);
    },
    $$legacy: true
  });
  var button_5 = sibling(div_18, 4);
  var button_6 = sibling(button_5, 2);
  var button_7 = sibling(button_6, 2);
  var button_8 = sibling(button_7, 2);
  var button_9 = sibling(button_8, 2);
  var button_10 = sibling(button_9, 4);
  var button_11 = sibling(button_10, 2);
  var node_10 = sibling(button_11, 2);
  TransactionView(node_10, {
    get value() {
      return get(value);
    }
  });
  template_effect(() => set_text(text_1, `${get(showValidatorSelection) ? "Hide" : get(selectedValidator) ? "Change" : "Select"} Validator`));
  event("click", button, () => listStakedIota());
  bind_value(input, () => get(stakedIotaObjectId), ($$value) => set(stakedIotaObjectId, $$value));
  event("click", button_1, () => computeRewards(get(stakedIotaObjectId)));
  bind_value(input_1, () => get(validatorAddress), ($$value) => set(validatorAddress, $$value));
  event("click", button_2, () => {
    set(showValidatorSelection, !get(showValidatorSelection));
    if (get(showValidatorSelection)) handleLoadValidators();
  });
  event("click", button_5, () => stake());
  event("click", button_6, () => unstakeSingle());
  event("click", button_7, () => unstakeAll());
  event("click", button_8, () => unstakeSpecificAmountSim(get(stakedIotaObjectId)));
  event("click", button_9, () => unstakeSpecificAmount(get(stakedIotaObjectId)));
  event("click", button_10, () => {
    handleGetTimelockedObjects().then((timelockedObjects) => {
      set(value, timelockedObjects);
    }).catch((err) => {
      set(value, err.toString());
      console.error(err);
    });
  });
  event("click", button_11, () => stakeAllTimelockedObjects());
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  Stake as default
};

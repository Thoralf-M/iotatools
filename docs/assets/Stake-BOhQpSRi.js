import { p as push, w as legacy_pre_effect, g as get, m as mutable_source, T as isValidIotaAddress, l as set, y as legacy_pre_effect_reset, i as init, f as from_html, s as sibling, c as child, b as if_block, C as untrack, t as template_effect, d as set_text, R as set_value, e as event, E as bind_value, j as append, k as pop, S as setup_stores, n as getClient, I as comment, G as first_child, x as deep_read_state, J as set_style, O as store_get, ah as Transaction, aN as IOTA_SYSTEM_STATE_OBJECT_ID, aa as activeAddress, z as each, A as index } from "/iota-utils/assets/index-CZN5jHoS.js";
import { b as bcs } from "/iota-utils/assets/bcs-CK5sreIh.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-B6CkgL0N.js";
import { a as formatNumberWithUnderscores, f as formatNumbersWithUnderscores } from "/iota-utils/assets/iota-nano-conversion-bD-fUK9h.js";
import { c as computeStakingRewards } from "/iota-utils/assets/staking-utils-BYM0yUOH.js";
import { e as executeTransaction } from "/iota-utils/assets/transaction-execution-jjKyv1Vv.js";
import "/iota-utils/assets/b64-BgM4Sqlt.js";
import "/iota-utils/assets/hex-BsUxbKPD.js";
import "/iota-utils/assets/transaction-view-mKkq-L6F.js";
var root_1 = from_html(`<div style="text-align: center;"><pre style="display: inline-block; text-align: left; margin: 0rem;"> </pre></div>`);
var root_3 = from_html(`<p>Loading validators...</p>`);
var root_5 = from_html(`<button class="svelte-1uqnf59">Load Validators</button>`);
var root_9 = from_html(`<div class="validator-item svelte-1uqnf59" style="margin: 0.125rem 0; border: 1px solid grey; border-radius: 4px; cursor: pointer;" role="button" tabindex="0"><div class="validator-content svelte-1uqnf59"><span class="validator-address svelte-1uqnf59"> </span> <span class="validator-status svelte-1uqnf59" style="color: #c62828;"> </span> <span class="validator-name svelte-1uqnf59"> </span> <span class="validator-stake svelte-1uqnf59"> </span></div></div>`);
var root_7 = from_html(`<div style="margin-bottom: 1rem;"><div class="section-header svelte-1uqnf59" style="font-weight: bold; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" role="button" tabindex="0"><span class="svelte-1uqnf59"> </span> <span class="svelte-1uqnf59"> </span></div> <!></div>`);
var root_12 = from_html(`<div class="validator-item svelte-1uqnf59" style="margin: 0.125rem 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" role="button" tabindex="0"><div class="validator-content svelte-1uqnf59"><span class="validator-address svelte-1uqnf59"> </span> <span class="validator-status svelte-1uqnf59"> </span> <span class="validator-name svelte-1uqnf59"> </span> <span class="validator-stake svelte-1uqnf59"> </span></div></div>`);
var root_10 = from_html(`<div><div class="section-header svelte-1uqnf59" style="font-weight: bold; border: 1px solid grey; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" role="button" tabindex="0"><span class="svelte-1uqnf59"> </span> <span class="svelte-1uqnf59"> </span></div> <!></div>`);
var root_6 = from_html(`<div><strong>Select a validator:</strong></div> <!> <!>`, 1);
var root_2 = from_html(`<div class="validator-selection svelte-1uqnf59"><!></div>`);
var root_14 = from_html(`<div class="validator-selection svelte-1uqnf59"><div><strong>Selected Validator:</strong> <button style="margin-left: 1rem; font-size: 0.8em;" class="svelte-1uqnf59">Change</button></div> <div class="validator-item svelte-1uqnf59" style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px;"><div class="validator-content svelte-1uqnf59"><span class="validator-address svelte-1uqnf59"> </span> <span class="validator-status svelte-1uqnf59"> </span> <span class="validator-name svelte-1uqnf59"> </span> <span class="validator-stake svelte-1uqnf59"> </span></div></div></div>`);
var root = from_html(`<main><button class="svelte-1uqnf59">list staked IOTA</button> <br/> <span class="svelte-1uqnf59">staked object id: <input placeholder="staked IOTA object id 0x..." style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;" class="svelte-1uqnf59"/></span> <button class="svelte-1uqnf59">compute real rewards</button> <!> <hr/> It's only possible to stake to a candidate or active/committee validator, pending is not possible. <br/> <span class="svelte-1uqnf59">validator address: <input placeholder="validator address 0x..." style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;" class="svelte-1uqnf59"/> <button class="svelte-1uqnf59"> </button></span> <!> <br/> <span class="svelte-1uqnf59">amount (min 1 IOTA, to unstake with rewards even more): <input type="number" placeholder="amount in NANO" min="1000000000" style="width: 14rem;"/> <input type="number" placeholder="amount in IOTA" min="1" style="width: 14rem;"/></span> <br/> <button class="svelte-1uqnf59">stake</button> <button class="svelte-1uqnf59">unstake single object</button> <button class="svelte-1uqnf59">unstake all</button> <button class="svelte-1uqnf59">simulate unstake specific amount</button> <button class="svelte-1uqnf59">unstake specific amount (exact is usually not possible)</button> <hr/> <button class="svelte-1uqnf59">list timelocked objects</button> <button class="svelte-1uqnf59">stake all timelocked objects</button> <!></main>`);
function Stake($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
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
  let showCandidates = mutable_source(true);
  const getCommitteeMemberAddresses = (systemState) => {
    const committeeMemberAddresses = /* @__PURE__ */ new Set();
    if (systemState.committeeMembers && Array.isArray(systemState.committeeMembers)) {
      systemState.committeeMembers.forEach((validator) => {
        committeeMemberAddresses.add(validator.iotaAddress);
      });
    }
    return committeeMemberAddresses;
  };
  const isValidatorCommitteeMember = (validatorAddress2, committeeMemberAddresses) => {
    return committeeMemberAddresses.has(validatorAddress2) || committeeMemberAddresses.size === 0;
  };
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
    var _a, _b, _c, _d;
    try {
      const client = getClient();
      let obj = await client.getObject({
        id: get(stakedIotaObjectId),
        options: { showContent: true }
      });
      let target;
      if (((_b = (_a = obj.data) == null ? void 0 : _a.content) == null ? void 0 : _b.type) === "0x3::staking_pool::StakedIota") {
        target = "0x3::iota_system::request_withdraw_stake";
      }
      if (((_d = (_c = obj.data) == null ? void 0 : _c.content) == null ? void 0 : _d.type) === "0x3::timelocked_staking::TimelockedStakedIota") {
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
        let index2 = timelocked ? 1 : 0;
        let amountBytes = txRes.results[1].returnValues[index2][0];
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
    var _a, _b, _c, _d;
    let stakeData = await devInspectStakedObject(stakedIotaObjectId2);
    let obj = await getClient().getObject({ id: stakedIotaObjectId2, options: { showContent: true } });
    let timelocked = false;
    if (((_b = (_a = obj.data) == null ? void 0 : _a.content) == null ? void 0 : _b.type) === "0x3::timelocked_staking::TimelockedStakedIota") {
      timelocked = true;
    }
    if (!timelocked && ((_d = (_c = obj.data) == null ? void 0 : _c.content) == null ? void 0 : _d.type) != "0x3::staking_pool::StakedIota") {
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
    return computeStakingRewards(client, stakedIotaObjectId2, $activeAddress());
  }
  const loadValidators = async () => {
    var _a, _b;
    try {
      set(loadingValidators, true);
      set(validators, []);
      const client = getClient();
      const systemState = await client.getLatestIotaSystemState();
      console.log("System state structure:", systemState);
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
        for (const candidateValidator of candidateValidatorsPage.data) {
          try {
            const validatorWrapper = await client.getDynamicFieldObject({
              parentId: validatorCandidatesId,
              name: candidateValidator.name
            });
            const validatorV1 = await client.getDynamicFields({
              parentId: (
                // @ts-ignore
                (_a = validatorWrapper.data) == null ? void 0 : _a.content.fields.value.fields.inner.fields.id.id
              )
            });
            const validatorObject = await client.getObject({
              id: validatorV1.data[0].objectId,
              options: { showContent: true }
            });
            const validator = (
              // @ts-ignore
              (_b = validatorObject.data) == null ? void 0 : _b.content.fields.value.fields
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
  const fetchValidatorByAddress = async (address) => {
    var _a, _b;
    if (!address || !isValidIotaAddress(address)) return null;
    try {
      const client = getClient();
      const systemState = await client.getLatestIotaSystemState();
      const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);
      for (const validator of systemState.activeValidators) {
        if (validator.iotaAddress === address) {
          const isCommitteeMember = isValidatorCommitteeMember(validator.iotaAddress, committeeMemberAddresses);
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
        const candidateValidatorsPage = await client.getDynamicFields({ parentId: validatorCandidatesId, cursor: nextPageCursor });
        for (const candidateValidator of candidateValidatorsPage.data) {
          try {
            const validatorWrapper = await client.getDynamicFieldObject({
              parentId: validatorCandidatesId,
              name: candidateValidator.name
            });
            const validatorV1 = await client.getDynamicFields({
              parentId: (
                // @ts-ignore
                (_a = validatorWrapper.data) == null ? void 0 : _a.content.fields.value.fields.inner.fields.id.id
              )
            });
            const validatorObject = await client.getObject({
              id: validatorV1.data[0].objectId,
              options: { showContent: true }
            });
            const validator = (
              // @ts-ignore
              (_b = validatorObject.data) == null ? void 0 : _b.content.fields.value.fields
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
  };
  async function unstakeAll() {
    try {
      let staked = await listStakedIota();
      const tx = new Transaction();
      let firstBalance;
      for (let [index2, delegatedStake] of staked.stakedIota.entries()) {
        for (let [innerIndex, stake2] of delegatedStake.stakes.entries()) {
          let balance = tx.moveCall({
            target: "0x3::iota_system::request_withdraw_stake_non_entry",
            arguments: [tx.object("0x5"), tx.object(stake2.stakedIotaId)]
          });
          if (index2 == 0 && innerIndex == 0) {
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
      for (let [index2, delegatedTimelockedStake] of staked.timelockedStakedIota.entries()) {
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
          if (index2 == 0 && innerIndex == 0 && !firstBalance) {
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
  legacy_pre_effect(() => (get(validatorAddress), isValidIotaAddress), () => {
    if (get(validatorAddress) && isValidIotaAddress(get(validatorAddress))) {
      const foundValidator = findValidatorByAddress(get(validatorAddress));
      if (foundValidator) {
        set(selectedValidator, foundValidator);
      } else {
        fetchValidatorByAddress(get(validatorAddress)).then((validator) => {
          if (validator && get(validatorAddress) === validator.address) {
            set(selectedValidator, validator);
          }
        });
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
    if_block(node, ($$render) => {
      if (get(devInspectValue), untrack(() => Object.keys(get(devInspectValue)).length > 0)) $$render(consequent);
    });
  }
  var span_1 = sibling(node, 6);
  var input_1 = sibling(child(span_1));
  var button_2 = sibling(input_1, 2);
  var text_1 = child(button_2);
  var node_1 = sibling(span_1, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_1 = root_2();
      var node_2 = child(div_1);
      {
        var consequent_1 = ($$anchor3) => {
          var p = root_3();
          append($$anchor3, p);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment = comment();
          var node_3 = first_child(fragment);
          {
            var consequent_2 = ($$anchor4) => {
              var button_3 = root_5();
              event("click", button_3, loadValidators);
              append($$anchor4, button_3);
            };
            var alternate = ($$anchor4) => {
              var fragment_1 = root_6();
              var node_4 = sibling(first_child(fragment_1), 2);
              {
                var consequent_4 = ($$anchor5) => {
                  var div_2 = root_7();
                  var div_3 = child(div_2);
                  var span_2 = child(div_3);
                  var text_2 = child(span_2);
                  var span_3 = sibling(span_2, 2);
                  var text_3 = child(span_3);
                  var node_5 = sibling(div_3, 2);
                  {
                    var consequent_3 = ($$anchor6) => {
                      var fragment_2 = comment();
                      var node_6 = first_child(fragment_2);
                      each(
                        node_6,
                        1,
                        () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Candidate"))),
                        index,
                        ($$anchor7, validator) => {
                          var div_4 = root_9();
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
                              set_text(text_7, `Current Stake: ${$0 ?? ""} NANO`);
                            },
                            [
                              () => (deep_read_state(formatNumberWithUnderscores), get(validator), untrack(() => formatNumberWithUnderscores(get(validator).stake)))
                            ]
                          );
                          event("click", div_4, () => selectValidator(get(validator).address));
                          event("keydown", div_4, (e) => e.key === "Enter" && selectValidator(get(validator).address));
                          append($$anchor7, div_4);
                        }
                      );
                      append($$anchor6, fragment_2);
                    };
                    if_block(node_5, ($$render) => {
                      if (get(showCandidates)) $$render(consequent_3);
                    });
                  }
                  template_effect(
                    ($0) => {
                      set_text(text_2, `Candidates (${$0 ?? ""})`);
                      set_text(text_3, get(showCandidates) ? "▼" : "▶");
                    },
                    [
                      () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Candidate").length))
                    ]
                  );
                  event("click", div_3, () => set(showCandidates, !get(showCandidates)));
                  event("keydown", div_3, (e) => e.key === "Enter" && set(showCandidates, !get(showCandidates)));
                  append($$anchor5, div_2);
                };
                if_block(node_4, ($$render) => {
                  if (get(validators), untrack(() => get(validators).filter((v) => v.status === "Candidate").length > 0)) $$render(consequent_4);
                });
              }
              var node_7 = sibling(node_4, 2);
              {
                var consequent_6 = ($$anchor5) => {
                  var div_6 = root_10();
                  var div_7 = child(div_6);
                  var span_8 = child(div_7);
                  var text_8 = child(span_8);
                  var span_9 = sibling(span_8, 2);
                  var text_9 = child(span_9);
                  var node_8 = sibling(div_7, 2);
                  {
                    var consequent_5 = ($$anchor6) => {
                      var fragment_3 = comment();
                      var node_9 = first_child(fragment_3);
                      each(
                        node_9,
                        1,
                        () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Committee Member" || v.status === "Active Validator"))),
                        index,
                        ($$anchor7, validator) => {
                          var div_8 = root_12();
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
                              set_style(span_11, `color: ${(get(validator), untrack(() => get(validator).status === "Committee Member" ? "#2e7d32" : "#f57f17")) ?? ""};`);
                              set_text(text_11, (get(validator), untrack(() => get(validator).status)));
                              set_text(text_12, (get(validator), untrack(() => get(validator).name)));
                              set_text(text_13, `Current Stake: ${$0 ?? ""} NANO`);
                            },
                            [
                              () => (deep_read_state(formatNumberWithUnderscores), get(validator), untrack(() => formatNumberWithUnderscores(get(validator).stake)))
                            ]
                          );
                          event("click", div_8, () => selectValidator(get(validator).address));
                          event("keydown", div_8, (e) => e.key === "Enter" && selectValidator(get(validator).address));
                          append($$anchor7, div_8);
                        }
                      );
                      append($$anchor6, fragment_3);
                    };
                    if_block(node_8, ($$render) => {
                      if (get(showCommitteeMembers)) $$render(consequent_5);
                    });
                  }
                  template_effect(
                    ($0) => {
                      set_text(text_8, `Active Validators (${$0 ?? ""})`);
                      set_text(text_9, get(showCommitteeMembers) ? "▼" : "▶");
                    },
                    [
                      () => (get(validators), untrack(() => get(validators).filter((v) => v.status === "Committee Member" || v.status === "Active Validator").length))
                    ]
                  );
                  event("click", div_7, () => set(showCommitteeMembers, !get(showCommitteeMembers)));
                  event("keydown", div_7, (e) => e.key === "Enter" && set(showCommitteeMembers, !get(showCommitteeMembers)));
                  append($$anchor5, div_6);
                };
                if_block(node_7, ($$render) => {
                  if (get(validators), untrack(() => get(validators).filter((v) => v.status === "Committee Member" || v.status === "Active Validator").length > 0)) $$render(consequent_6);
                });
              }
              append($$anchor4, fragment_1);
            };
            if_block(
              node_3,
              ($$render) => {
                if (get(validators), untrack(() => get(validators).length === 0)) $$render(consequent_2);
                else $$render(alternate, false);
              },
              true
            );
          }
          append($$anchor3, fragment);
        };
        if_block(node_2, ($$render) => {
          if (get(loadingValidators)) $$render(consequent_1);
          else $$render(alternate_1, false);
        });
      }
      append($$anchor2, div_1);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_4 = comment();
      var node_10 = first_child(fragment_4);
      {
        var consequent_8 = ($$anchor3) => {
          var div_10 = root_14();
          var div_11 = child(div_10);
          var button_4 = sibling(child(div_11), 2);
          var div_12 = sibling(div_11, 2);
          var div_13 = child(div_12);
          var span_14 = child(div_13);
          var text_14 = child(span_14);
          var span_15 = sibling(span_14, 2);
          var text_15 = child(span_15);
          var span_16 = sibling(span_15, 2);
          var text_16 = child(span_16);
          var span_17 = sibling(span_16, 2);
          var text_17 = child(span_17);
          template_effect(
            ($0) => {
              set_text(text_14, (get(selectedValidator), untrack(() => get(selectedValidator).address)));
              set_style(span_15, `color: ${(get(selectedValidator), untrack(() => get(selectedValidator).status === "Committee Member" ? "#2e7d32" : get(selectedValidator).status === "Active Validator" ? "#f57f17" : "#c62828")) ?? ""};`);
              set_text(text_15, (get(selectedValidator), untrack(() => get(selectedValidator).status)));
              set_text(text_16, (get(selectedValidator), untrack(() => get(selectedValidator).name)));
              set_text(text_17, `Current Stake: ${$0 ?? ""} NANO`);
            },
            [
              () => (deep_read_state(formatNumberWithUnderscores), get(selectedValidator), untrack(() => formatNumberWithUnderscores(get(selectedValidator).stake)))
            ]
          );
          event("click", button_4, () => {
            set(showValidatorSelection, true);
          });
          append($$anchor3, div_10);
        };
        if_block(
          node_10,
          ($$render) => {
            if (get(selectedValidator)) $$render(consequent_8);
          },
          true
        );
      }
      append($$anchor2, fragment_4);
    };
    if_block(node_1, ($$render) => {
      if (get(showValidatorSelection)) $$render(consequent_7);
      else $$render(alternate_2, false);
    });
  }
  var span_18 = sibling(node_1, 4);
  var input_2 = sibling(child(span_18));
  var input_3 = sibling(input_2, 2);
  var button_5 = sibling(span_18, 4);
  var button_6 = sibling(button_5, 2);
  var button_7 = sibling(button_6, 2);
  var button_8 = sibling(button_7, 2);
  var button_9 = sibling(button_8, 2);
  var button_10 = sibling(button_9, 4);
  var button_11 = sibling(button_10, 2);
  var node_11 = sibling(button_11, 2);
  TransactionView(node_11, {
    get value() {
      return get(value);
    }
  });
  template_effect(
    ($0) => {
      set_text(text_1, `${get(showValidatorSelection) ? "Hide" : get(selectedValidator) ? "Change" : "Select"} Validator`);
      set_value(input_3, $0);
    },
    [
      () => (get(amount), untrack(() => (get(amount) / 1e9).toFixed(9)))
    ]
  );
  event("click", button, () => listStakedIota());
  bind_value(input, () => get(stakedIotaObjectId), ($$value) => set(stakedIotaObjectId, $$value));
  event("click", button_1, () => computeRewards(get(stakedIotaObjectId)));
  bind_value(input_1, () => get(validatorAddress), ($$value) => set(validatorAddress, $$value));
  event("click", button_2, () => {
    set(showValidatorSelection, !get(showValidatorSelection));
    if (get(showValidatorSelection)) loadValidators();
  });
  bind_value(input_2, () => get(amount), ($$value) => set(amount, $$value));
  event("input", input_3, (e) => {
    set(amount, e.target.value * 1e9);
  });
  event("click", button_5, () => stake());
  event("click", button_6, () => unstakeSingle());
  event("click", button_7, () => unstakeAll());
  event("click", button_8, () => unstakeSpecificAmountSimulation(get(stakedIotaObjectId)));
  event("click", button_9, () => unstakeSpecificAmount(get(stakedIotaObjectId)));
  event("click", button_10, () => {
    getTimelockedObjects().then((timelockedObjects) => {
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

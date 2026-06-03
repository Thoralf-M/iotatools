import { f as formatNumbersWithUnderscores, p as push, a as prop, u as user_effect, s as set, g as get, b as sibling, i as if_block, e as each, t as template_effect, n as nanoToIotaFormatted, c as set_text, d as append, h as child, j as index, k as delegated, l as pop, m as user_derived, o as state, q as from_html, r as delegate, v as init, w as event, x as bind_select_value, y as mutable_source, z as getClient, A as set_class, B as to_array } from "./index-RlAhZLyw.js";
import { J as JsonToggleView } from "./JsonToggleView-V2L4Z1CG.js";
function extractValidatorRow(validator) {
  const meta = validator.metadata.fields;
  const pool = validator.staking_pool.fields;
  return {
    name: meta.name,
    address: meta.iota_address,
    commissionRate: validator.commission_rate,
    stakingPoolIotaBalance: pool.iota_balance,
    nextEpochStake: validator.next_epoch_stake,
    stakingPoolId: typeof pool.id === "object" ? pool.id.id : pool.id,
    stakingPoolActivationEpoch: pool.activation_epoch,
    stakingPoolDeactivationEpoch: pool.deactivation_epoch,
    rewardsPool: pool.rewards_pool
  };
}
function extractActiveValidatorRow(v) {
  return {
    name: v.name,
    address: v.iotaAddress,
    commissionRate: v.commissionRate,
    stakingPoolIotaBalance: v.stakingPoolIotaBalance,
    nextEpochStake: v.nextEpochStake,
    stakingPoolId: v.stakingPoolId,
    stakingPoolActivationEpoch: v.stakingPoolActivationEpoch ?? "",
    stakingPoolDeactivationEpoch: v.stakingPoolDeactivationEpoch ?? null,
    rewardsPool: v.rewardsPool
  };
}
async function fetchLatestSystemState(client) {
  const apiVersion = await client.getRpcApiVersion() || "";
  const systemState = await client.getLatestIotaSystemState();
  const formattedSystemState = formatNumbersWithUnderscores(systemState);
  const stakeInfo = systemStateStake(systemState);
  const skipKeys = /* @__PURE__ */ new Set(["activeValidators", "committeeMembers"]);
  const baseFields = {};
  for (const [key, val] of Object.entries(systemState)) {
    if (!skipKeys.has(key)) {
      baseFields[key] = val;
    }
  }
  const committeeAddresses = new Set(systemState.committeeMembers.map((m) => m.iotaAddress));
  const validatorByAddress = /* @__PURE__ */ new Map();
  for (const v of systemState.activeValidators) {
    validatorByAddress.set(v.iotaAddress, v);
  }
  const committeeRows = [];
  for (const member of systemState.committeeMembers) {
    const v = validatorByAddress.get(member.iotaAddress);
    if (v) {
      const row = extractActiveValidatorRow(v);
      const commissionPct = parseInt(v.commissionRate) / 100;
      const votingPowerPct = parseInt(v.votingPower) / 100;
      row.effectiveCommission = Math.max(commissionPct, votingPowerPct).toFixed(2);
      committeeRows.push(row);
    }
  }
  const activeValidatorRows = [];
  for (const v of systemState.activeValidators) {
    if (!committeeAddresses.has(v.iotaAddress)) {
      activeValidatorRows.push(extractActiveValidatorRow(v));
    }
  }
  return {
    formattedSystemState,
    stakeInfo: formatNumbersWithUnderscores(stakeInfo),
    apiVersion,
    baseFields: formatNumbersWithUnderscores(baseFields),
    committeeRows,
    activeValidatorRows
  };
}
async function fetchCandidateValidators(client, showAllValidatorData) {
  const systemState = await client.getLatestIotaSystemState();
  let stakeInfo = systemStateStake(systemState);
  stakeInfo.candidateValidatorsStake = 0;
  const validatorCandidatesId = systemState.validatorCandidatesId;
  if (!validatorCandidatesId || validatorCandidatesId === "") {
    return {
      formattedValidators: "No candidate validators",
      stakeInfo: formatNumbersWithUnderscores(stakeInfo),
      validatorRows: []
    };
  }
  let hasNextPage = true;
  let nextPageCursor = null;
  let validatorCandidates = [];
  let validatorRows = [];
  while (hasNextPage) {
    const candidateValidatorsPage = await client.getDynamicFields({
      parentId: validatorCandidatesId,
      cursor: nextPageCursor
    });
    for (const candidateValidator of candidateValidatorsPage.data) {
      const validatorWrapper = await client.getDynamicFieldObjectV2({
        parentObjectId: validatorCandidatesId,
        name: candidateValidator.name,
        options: { showContent: true }
      });
      const innerId = validatorWrapper.data.content.fields.value.fields.inner.fields.id.id;
      const validatorV1 = await client.getDynamicFields({
        parentId: innerId
      });
      const validatorObject = await client.getObject({
        id: validatorV1.data[0].objectId,
        options: { showContent: true }
      });
      const validator = validatorObject.data?.content.fields.value.fields;
      stakeInfo.candidateValidatorsStake += parseInt(
        validator.staking_pool.fields.iota_balance
      );
      validatorRows.push(extractValidatorRow(validator));
      if (!showAllValidatorData) {
        cleanupValidatorFields(validator);
      }
      validatorCandidates.push(validator);
    }
    hasNextPage = candidateValidatorsPage.hasNextPage;
    if (hasNextPage) {
      nextPageCursor = candidateValidatorsPage.nextCursor;
    }
  }
  const formattedValidators = validatorCandidates.length > 0 ? formatNumbersWithUnderscores(validatorCandidates) : "No candidate validators";
  return {
    formattedValidators,
    stakeInfo: formatNumbersWithUnderscores(stakeInfo),
    validatorRows
  };
}
async function fetchPendingValidators(client, showAllValidatorData) {
  const systemState = await client.getLatestIotaSystemState();
  let stakeInfo = systemStateStake(systemState);
  stakeInfo.pendingValidatorsStake = 0;
  const pendingActiveValidatorsId = systemState.pendingActiveValidatorsId;
  let hasNextPage = true;
  let nextPageCursor = null;
  let pendingValidators = [];
  let validatorRows = [];
  while (hasNextPage) {
    const pendingValidatorsPage = await client.getDynamicFields({
      parentId: pendingActiveValidatorsId,
      cursor: nextPageCursor
    });
    for (const pendingValidator of pendingValidatorsPage.data) {
      const validatorObject = await client.getObject({
        id: pendingValidator.objectId,
        options: { showContent: true }
      });
      const validator = validatorObject.data?.content.fields.value.fields;
      stakeInfo.pendingValidatorsStake += parseInt(
        validator.staking_pool.fields.iota_balance
      );
      validatorRows.push(extractValidatorRow(validator));
      if (!showAllValidatorData) {
        cleanupValidatorFields(validator);
      }
      pendingValidators.push(validator);
    }
    hasNextPage = pendingValidatorsPage.hasNextPage;
    if (hasNextPage) {
      nextPageCursor = pendingValidatorsPage.nextCursor;
    }
  }
  const formattedValidators = pendingValidators.length > 0 ? formatNumbersWithUnderscores(pendingValidators) : "No pending validators";
  return {
    formattedValidators,
    stakeInfo: formatNumbersWithUnderscores(stakeInfo),
    validatorRows
  };
}
async function fetchInactiveValidators(client, showAllValidatorData) {
  const systemState = await client.getLatestIotaSystemState();
  const size = systemState.inactivePoolsSize;
  if (parseInt(size) === 0) {
    return { formattedValidators: "No inactive validators", validatorRows: [] };
  }
  const inactiveValidatorsId = systemState.inactivePoolsId;
  let hasNextPage = true;
  let nextPageCursor = null;
  let inactiveValidatorsList = [];
  let validatorRows = [];
  while (hasNextPage) {
    const inactiveValidatorsPage = await client.getDynamicFields({
      parentId: inactiveValidatorsId,
      cursor: nextPageCursor
    });
    for (const inactiveValidator of inactiveValidatorsPage.data) {
      const inactiveValidatorsPage2 = await client.getDynamicFieldObjectV2({
        parentObjectId: inactiveValidatorsId,
        name: { type: "0x2::object::ID", value: inactiveValidator.name.value },
        options: { showContent: true }
      });
      const validatorV1 = await client.getDynamicFields({
        parentId: inactiveValidatorsPage2.data.content.fields.value.fields.inner.fields.id.id
      });
      const validatorObject = await client.getObject({
        id: validatorV1.data[0].objectId,
        options: { showContent: true }
      });
      const validator = validatorObject.data?.content.fields.value.fields;
      validatorRows.push(extractValidatorRow(validator));
      if (!showAllValidatorData) {
        cleanupValidatorFields(validator);
      }
      inactiveValidatorsList.push(validator);
    }
    hasNextPage = inactiveValidatorsPage.hasNextPage;
    if (hasNextPage) {
      nextPageCursor = inactiveValidatorsPage.nextCursor;
    }
  }
  const formattedValidators = inactiveValidatorsList.length > 0 ? formatNumbersWithUnderscores(inactiveValidatorsList) : "No inactive validators";
  validatorRows.sort((a, b) => {
    const aEpoch = parseInt(a.stakingPoolDeactivationEpoch ?? "0");
    const bEpoch = parseInt(b.stakingPoolDeactivationEpoch ?? "0");
    return bEpoch - aEpoch;
  });
  return { formattedValidators, validatorRows };
}
function systemStateStake(systemState) {
  const stakeInfo = {};
  stakeInfo.totalSupply = systemState.iotaTotalSupply;
  stakeInfo.totalStake = systemState.totalStake;
  stakeInfo.pendingStake = "0";
  stakeInfo.nextEpochStake = "0";
  for (const validator of systemState.activeValidators) {
    stakeInfo.pendingStake = (BigInt(stakeInfo.pendingStake) + BigInt(validator.pendingStake)).toString();
    stakeInfo.nextEpochStake = (BigInt(stakeInfo.nextEpochStake) + BigInt(validator.nextEpochStake)).toString();
  }
  return stakeInfo;
}
function cleanupValidatorFields(validator) {
  delete validator.extra_fields;
  delete validator.metadata.type;
  delete validator.metadata.fields.authority_pubkey_bytes;
  delete validator.metadata.fields.next_epoch_authority_pubkey_bytes;
  delete validator.metadata.fields.next_epoch_net_address;
  delete validator.metadata.fields.next_epoch_network_pubkey_bytes;
  delete validator.metadata.fields.next_epoch_p2p_address;
  delete validator.metadata.fields.next_epoch_primary_address;
  delete validator.metadata.fields.next_epoch_proof_of_possession;
  delete validator.metadata.fields.next_epoch_protocol_pubkey_bytes;
  delete validator.metadata.fields.net_address;
  delete validator.metadata.fields.p2p_address;
  delete validator.metadata.fields.primary_address;
  delete validator.metadata.fields.image_url;
  delete validator.metadata.fields.extra_fields;
  delete validator.metadata.fields.network_pubkey_bytes;
  delete validator.metadata.fields.proof_of_possession;
  delete validator.metadata.fields.protocol_pubkey_bytes;
  delete validator.staking_pool.type;
  delete validator.staking_pool.fields.exchange_rates;
  delete validator.staking_pool.fields.extra_fields;
  validator.staking_pool.fields.id = validator.staking_pool.fields.id.id;
}
var root_1$1 = from_html(`<th class="sortable right svelte-7dv5n8">Eff. Commission (<a href="https://github.com/iotaledger/IIPs/blob/main/iips/IIP-0008/IIP-0008.md" target="_blank" rel="noopener noreferrer" class="svelte-7dv5n8">IIP-8</a> </th>`);
var root_2$1 = from_html(`<th class="sortable right svelte-7dv5n8"> </th>`);
var root_3 = from_html(`<th class="sortable right svelte-7dv5n8"> </th>`);
var root_4$1 = from_html(`<th class="sortable right svelte-7dv5n8"> </th>`);
var root_5$1 = from_html(`<th class="sortable right svelte-7dv5n8"> </th>`);
var root_7$1 = from_html(`<td class="right svelte-7dv5n8"> </td>`);
var root_8 = from_html(`<td class="mono right svelte-7dv5n8"> </td>`);
var root_9$1 = from_html(`<td class="right svelte-7dv5n8"> </td>`);
var root_10$1 = from_html(`<td class="right svelte-7dv5n8"> </td>`);
var root_11 = from_html(`<td class="mono right svelte-7dv5n8"> </td>`);
var root_6$1 = from_html(`<tr><td class="name svelte-7dv5n8"> </td><td class="right svelte-7dv5n8"> </td><!><td class="mono right svelte-7dv5n8"> </td><!><!><!><!><td class="mono svelte-7dv5n8"> </td><td class="mono svelte-7dv5n8"> </td></tr>`);
var root$1 = from_html(`<div class="table-wrap svelte-7dv5n8"><table class="svelte-7dv5n8"><thead><tr><th class="sortable svelte-7dv5n8"> </th><th class="sortable right svelte-7dv5n8"> </th><!><th class="sortable right svelte-7dv5n8"> </th><!><!><!><!><th class="sortable svelte-7dv5n8"> </th><th class="svelte-7dv5n8">Staking Pool ID</th></tr></thead><tbody></tbody></table></div>`);
function ValidatorTable($$anchor, $$props) {
  push($$props, true);
  let variant = prop($$props, "variant", 3, "default");
  let showNextEpochStake = user_derived(() => variant() !== "inactive");
  let showRewardsPool = user_derived(() => variant() !== "candidate");
  let showActivationEpoch = user_derived(() => variant() !== "candidate");
  let showDeactivationEpoch = user_derived(() => variant() !== "active" && variant() !== "candidate");
  let showEffectiveCommission = user_derived(() => $$props.rows.length > 0 && $$props.rows[0].effectiveCommission != null);
  let defaultSortKey = user_derived(() => variant() === "inactive" ? null : "stakingPoolIotaBalance");
  let defaultSortAsc = user_derived(() => variant() === "inactive" ? true : false);
  let sortKey = state(void 0);
  let sortAsc = state(true);
  let initialized = state(false);
  user_effect(() => {
    void variant();
    void $$props.rows;
    set(sortKey, get(defaultSortKey), true);
    set(sortAsc, get(defaultSortAsc), true);
    set(initialized, true);
  });
  const bigIntFields = /* @__PURE__ */ new Set([
    "commissionRate",
    "stakingPoolIotaBalance",
    "nextEpochStake",
    "stakingPoolActivationEpoch",
    "stakingPoolDeactivationEpoch",
    "rewardsPool"
  ]);
  const floatFields = /* @__PURE__ */ new Set(["effectiveCommission"]);
  function toggleSort(key) {
    if (get(sortKey) === key) {
      set(sortAsc, !get(sortAsc));
    } else {
      set(sortKey, key, true);
      set(sortAsc, true);
    }
  }
  let sortedRows = user_derived(() => {
    if (!get(sortKey)) return $$props.rows;
    const key = get(sortKey);
    const asc = get(sortAsc);
    const isBigInt = bigIntFields.has(key);
    const isFloat = floatFields.has(key);
    return [...$$props.rows].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      let cmp;
      if (isBigInt) {
        cmp = Number(BigInt(String(aVal) || "0") - BigInt(String(bVal) || "0"));
      } else if (isFloat) {
        cmp = parseFloat(String(aVal) || "0") - parseFloat(String(bVal) || "0");
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return asc ? cmp : -cmp;
    });
  });
  function sortIndicator(key) {
    if (get(sortKey) !== key) return "";
    return get(sortAsc) ? " ▲" : " ▼";
  }
  function formatCommission(rate) {
    return (parseInt(rate) / 100).toFixed(2) + "%";
  }
  var div = root$1();
  var table = child(div);
  var thead = child(table);
  var tr = child(thead);
  var th = child(tr);
  var text = child(th);
  var th_1 = sibling(th);
  var text_1 = child(th_1);
  var node = sibling(th_1);
  {
    var consequent = ($$anchor2) => {
      var th_2 = root_1$1();
      var a_1 = sibling(child(th_2));
      var text_2 = sibling(a_1);
      template_effect(($0) => set_text(text_2, `)${$0 ?? ""}`), [() => sortIndicator("effectiveCommission")]);
      delegated("click", th_2, () => toggleSort("effectiveCommission"));
      delegated("click", a_1, (e) => e.stopPropagation());
      append($$anchor2, th_2);
    };
    if_block(node, ($$render) => {
      if (get(showEffectiveCommission)) $$render(consequent);
    });
  }
  var th_3 = sibling(node);
  var text_3 = child(th_3);
  var node_1 = sibling(th_3);
  {
    var consequent_1 = ($$anchor2) => {
      var th_4 = root_2$1();
      var text_4 = child(th_4);
      template_effect(($0) => set_text(text_4, `Next Epoch Stake${$0 ?? ""}`), [() => sortIndicator("nextEpochStake")]);
      delegated("click", th_4, () => toggleSort("nextEpochStake"));
      append($$anchor2, th_4);
    };
    if_block(node_1, ($$render) => {
      if (get(showNextEpochStake)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1);
  {
    var consequent_2 = ($$anchor2) => {
      var th_5 = root_3();
      var text_5 = child(th_5);
      template_effect(($0) => set_text(text_5, `Activation Epoch${$0 ?? ""}`), [() => sortIndicator("stakingPoolActivationEpoch")]);
      delegated("click", th_5, () => toggleSort("stakingPoolActivationEpoch"));
      append($$anchor2, th_5);
    };
    if_block(node_2, ($$render) => {
      if (get(showActivationEpoch)) $$render(consequent_2);
    });
  }
  var node_3 = sibling(node_2);
  {
    var consequent_3 = ($$anchor2) => {
      var th_6 = root_4$1();
      var text_6 = child(th_6);
      template_effect(($0) => set_text(text_6, `Deactivation Epoch${$0 ?? ""}`), [() => sortIndicator("stakingPoolDeactivationEpoch")]);
      delegated("click", th_6, () => toggleSort("stakingPoolDeactivationEpoch"));
      append($$anchor2, th_6);
    };
    if_block(node_3, ($$render) => {
      if (get(showDeactivationEpoch)) $$render(consequent_3);
    });
  }
  var node_4 = sibling(node_3);
  {
    var consequent_4 = ($$anchor2) => {
      var th_7 = root_5$1();
      var text_7 = child(th_7);
      template_effect(($0) => set_text(text_7, `Rewards Pool${$0 ?? ""}`), [() => sortIndicator("rewardsPool")]);
      delegated("click", th_7, () => toggleSort("rewardsPool"));
      append($$anchor2, th_7);
    };
    if_block(node_4, ($$render) => {
      if (get(showRewardsPool)) $$render(consequent_4);
    });
  }
  var th_8 = sibling(node_4);
  var text_8 = child(th_8);
  var tbody = sibling(thead);
  each(tbody, 21, () => get(sortedRows), index, ($$anchor2, row) => {
    var tr_1 = root_6$1();
    var td = child(tr_1);
    var text_9 = child(td);
    var td_1 = sibling(td);
    var text_10 = child(td_1);
    var node_5 = sibling(td_1);
    {
      var consequent_5 = ($$anchor3) => {
        var td_2 = root_7$1();
        var text_11 = child(td_2);
        template_effect(() => set_text(text_11, `${get(row).effectiveCommission ?? ""}%`));
        append($$anchor3, td_2);
      };
      if_block(node_5, ($$render) => {
        if (get(showEffectiveCommission)) $$render(consequent_5);
      });
    }
    var td_3 = sibling(node_5);
    var text_12 = child(td_3);
    var node_6 = sibling(td_3);
    {
      var consequent_6 = ($$anchor3) => {
        var td_4 = root_8();
        var text_13 = child(td_4);
        template_effect(($0) => set_text(text_13, $0), [() => nanoToIotaFormatted(get(row).nextEpochStake)]);
        append($$anchor3, td_4);
      };
      if_block(node_6, ($$render) => {
        if (get(showNextEpochStake)) $$render(consequent_6);
      });
    }
    var node_7 = sibling(node_6);
    {
      var consequent_7 = ($$anchor3) => {
        var td_5 = root_9$1();
        var text_14 = child(td_5);
        template_effect(() => set_text(text_14, get(row).stakingPoolActivationEpoch ?? "-"));
        append($$anchor3, td_5);
      };
      if_block(node_7, ($$render) => {
        if (get(showActivationEpoch)) $$render(consequent_7);
      });
    }
    var node_8 = sibling(node_7);
    {
      var consequent_8 = ($$anchor3) => {
        var td_6 = root_10$1();
        var text_15 = child(td_6);
        template_effect(() => set_text(text_15, get(row).stakingPoolDeactivationEpoch ?? "-"));
        append($$anchor3, td_6);
      };
      if_block(node_8, ($$render) => {
        if (get(showDeactivationEpoch)) $$render(consequent_8);
      });
    }
    var node_9 = sibling(node_8);
    {
      var consequent_9 = ($$anchor3) => {
        var td_7 = root_11();
        var text_16 = child(td_7);
        template_effect(($0) => set_text(text_16, $0), [() => nanoToIotaFormatted(get(row).rewardsPool)]);
        append($$anchor3, td_7);
      };
      if_block(node_9, ($$render) => {
        if (get(showRewardsPool)) $$render(consequent_9);
      });
    }
    var td_8 = sibling(node_9);
    var text_17 = child(td_8);
    var td_9 = sibling(td_8);
    var text_18 = child(td_9);
    template_effect(
      ($0, $1) => {
        set_text(text_9, get(row).name);
        set_text(text_10, $0);
        set_text(text_12, $1);
        set_text(text_17, get(row).address);
        set_text(text_18, get(row).stakingPoolId);
      },
      [
        () => formatCommission(get(row).commissionRate),
        () => nanoToIotaFormatted(get(row).stakingPoolIotaBalance)
      ]
    );
    append($$anchor2, tr_1);
  });
  template_effect(
    ($0, $1, $2, $3) => {
      set_text(text, `Name${$0 ?? ""}`);
      set_text(text_1, `Commission${$1 ?? ""}`);
      set_text(text_3, `Staked (IOTA)${$2 ?? ""}`);
      set_text(text_8, `Address${$3 ?? ""}`);
    },
    [
      () => sortIndicator("name"),
      () => sortIndicator("commissionRate"),
      () => sortIndicator("stakingPoolIotaBalance"),
      () => sortIndicator("address")
    ]
  );
  delegated("click", th, () => toggleSort("name"));
  delegated("click", th_1, () => toggleSort("commissionRate"));
  delegated("click", th_3, () => toggleSort("stakingPoolIotaBalance"));
  delegated("click", th_8, () => toggleSort("address"));
  append($$anchor, div);
  pop();
}
delegate(["click"]);
var root_1 = from_html(`<div> </div>`);
var root_2 = from_html(`<div class="view-toggle svelte-1aqomq7"><button>Table</button> <button>JSON</button></div>`);
var root_5 = from_html(`<tr><td class="kv-key svelte-1aqomq7"> </td><td class="kv-val mono svelte-1aqomq7"> </td></tr>`);
var root_6 = from_html(`<details class="section svelte-1aqomq7" open=""><summary class="svelte-1aqomq7"><h3 class="svelte-1aqomq7"> </h3></summary> <!></details>`);
var root_7 = from_html(`<details class="section svelte-1aqomq7" open=""><summary class="svelte-1aqomq7"><h3 class="svelte-1aqomq7"> </h3></summary> <!></details>`);
var root_4 = from_html(`<div class="system-state-tables svelte-1aqomq7"><details class="section svelte-1aqomq7" open=""><summary class="svelte-1aqomq7"><h3 class="svelte-1aqomq7">System State</h3></summary> <div class="kv-table-wrap svelte-1aqomq7"><table class="kv-table svelte-1aqomq7"><tbody></tbody></table></div></details> <!> <!></div>`);
var root_10 = from_html(`<tr><td class="kv-key svelte-1aqomq7"> </td><td class="kv-val mono svelte-1aqomq7"> </td><td class="kv-pct mono svelte-1aqomq7"> </td></tr>`);
var root_9 = from_html(`<div class="stake-info-wrap svelte-1aqomq7"><table class="kv-table svelte-1aqomq7"><tbody></tbody></table></div>`);
var root = from_html(`<main><button class="svelte-1aqomq7">get latest IOTA system state</button> <button class="svelte-1aqomq7">candidate validators</button> <button class="svelte-1aqomq7">pending validators</button> <button class="svelte-1aqomq7">inactive validators</button> show full data (set before requesting): <select><option></option><option></option></select> <!> <!> <!> <!></main>`);
function IotaSystemState($$anchor, $$props) {
  push($$props, false);
  let value = mutable_source({});
  let apiVersion = mutable_source("");
  let stakeInfo = mutable_source({});
  let showAllValidatorData = mutable_source(false);
  let validatorRows = mutable_source([]);
  let viewMode = mutable_source("table");
  let tableVariant = mutable_source("default");
  let baseFields = mutable_source({});
  let committeeRows = mutable_source([]);
  let activeValidatorRows = mutable_source([]);
  let hasSystemState = mutable_source(false);
  const nanoFields = /* @__PURE__ */ new Set([
    "iotaTotalSupply",
    "storageFundTotalObjectStorageRebates",
    "storageFundNonRefundableBalance",
    "totalStake",
    "minValidatorJoiningStake",
    "validatorLowStakeThreshold",
    "validatorVeryLowStakeThreshold",
    "safeModeStorageCharges",
    "safeModeComputationCharges",
    "safeModeComputationChargesBurned",
    "safeModeStorageRebates",
    "safeModeNonRefundableStorageFee"
  ]);
  function formatFieldValue(key, val) {
    if (val === null || val === void 0) return "-";
    if (Array.isArray(val)) return val.length === 0 ? "[]" : JSON.stringify(val);
    const str = String(val);
    if (nanoFields.has(key) && /^[\d_]+$/.test(str)) {
      return nanoToIotaFormatted(str.replace(/_/g, "")) + " IOTA";
    }
    return str;
  }
  function stripUnderscores(val) {
    if (val === void 0 || val === null) return "0";
    return String(val).replace(/_/g, "");
  }
  function percentOfSupply(val, supply) {
    const supplyRaw = stripUnderscores(supply);
    const valRaw = stripUnderscores(val);
    if (supplyRaw === "0" || valRaw === "0") return "";
    const pct = BigInt(valRaw) * 10000n / BigInt(supplyRaw);
    return (Number(pct) / 100).toFixed(2) + "%";
  }
  const stakeInfoLabels = {
    totalSupply: "Total Supply",
    totalStake: "Total Stake",
    pendingStake: "Pending Stake",
    nextEpochStake: "Next Epoch Stake",
    candidateValidatorsStake: "Candidate Validators Stake",
    pendingValidatorsStake: "Pending Validators Stake"
  };
  const stakeFieldsWithPct = /* @__PURE__ */ new Set([
    "totalStake",
    "pendingStake",
    "nextEpochStake",
    "candidateValidatorsStake",
    "pendingValidatorsStake"
  ]);
  const getLatestSystemState = async () => {
    try {
      const client = getClient();
      const result = await fetchLatestSystemState(client);
      set(value, result.formattedSystemState);
      set(stakeInfo, result.stakeInfo);
      set(apiVersion, result.apiVersion);
      set(baseFields, result.baseFields);
      set(committeeRows, result.committeeRows);
      set(activeValidatorRows, result.activeValidatorRows);
      set(hasSystemState, true);
      set(validatorRows, []);
      set(tableVariant, "default");
    } catch (err) {
      set(value, err.toString());
      set(validatorRows, []);
      set(hasSystemState, false);
      set(tableVariant, "default");
      console.error(err);
    }
  };
  const getCandidateValidators = async () => {
    try {
      const client = getClient();
      const {
        formattedValidators,
        stakeInfo: newStakeInfo,
        validatorRows: rows
      } = await fetchCandidateValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
      set(stakeInfo, newStakeInfo);
      set(validatorRows, rows);
      set(tableVariant, "candidate");
      set(hasSystemState, false);
    } catch (err) {
      set(value, err.toString());
      set(validatorRows, []);
      set(hasSystemState, false);
      set(tableVariant, "default");
      console.error(err);
    }
  };
  const getPendingValidators = async () => {
    try {
      const client = getClient();
      const {
        formattedValidators,
        stakeInfo: newStakeInfo,
        validatorRows: rows
      } = await fetchPendingValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
      set(stakeInfo, newStakeInfo);
      set(validatorRows, rows);
      set(tableVariant, "candidate");
      set(hasSystemState, false);
    } catch (err) {
      set(value, err.toString());
      set(validatorRows, []);
      set(hasSystemState, false);
      set(tableVariant, "default");
      console.error(err);
    }
  };
  const getInactiveValidators = async () => {
    try {
      const client = getClient();
      const { formattedValidators, validatorRows: rows } = await fetchInactiveValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
      set(validatorRows, rows);
      set(tableVariant, "inactive");
      set(hasSystemState, false);
    } catch (err) {
      set(value, err.toString());
      set(validatorRows, []);
      set(hasSystemState, false);
      set(tableVariant, "default");
      console.error(err);
    }
  };
  init();
  var main = root();
  var button = child(main);
  var button_1 = sibling(button, 2);
  var button_2 = sibling(button_1, 2);
  var button_3 = sibling(button_2, 2);
  var select = sibling(button_3, 2);
  var option = child(select);
  option.textContent = "true";
  option.value = option.__value = true;
  var option_1 = sibling(option);
  option_1.textContent = "false";
  option_1.value = option_1.__value = false;
  var node = sibling(select, 2);
  {
    var consequent = ($$anchor2) => {
      var div = root_1();
      var text = child(div);
      template_effect(() => set_text(text, `API Version: ${get(apiVersion) ?? ""}`));
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (get(apiVersion)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_1 = root_2();
      var button_4 = child(div_1);
      let classes;
      var button_5 = sibling(button_4, 2);
      let classes_1;
      template_effect(() => {
        classes = set_class(button_4, 1, "svelte-1aqomq7", null, classes, { active: get(viewMode) === "table" });
        classes_1 = set_class(button_5, 1, "svelte-1aqomq7", null, classes_1, { active: get(viewMode) === "json" });
      });
      event("click", button_4, () => set(viewMode, "table"));
      event("click", button_5, () => set(viewMode, "json"));
      append($$anchor2, div_1);
    };
    if_block(node_1, ($$render) => {
      if (get(hasSystemState) || get(validatorRows).length > 0) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      JsonToggleView($$anchor2, {
        get value() {
          return get(value);
        }
      });
    };
    var consequent_5 = ($$anchor2) => {
      var div_2 = root_4();
      var details = child(div_2);
      var div_3 = sibling(child(details), 2);
      var table = child(div_3);
      var tbody = child(table);
      each(tbody, 5, () => Object.entries(get(baseFields)), index, ($$anchor3, $$item) => {
        var $$array = user_derived(() => to_array(get($$item), 2));
        let key = () => get($$array)[0];
        let val = () => get($$array)[1];
        var tr = root_5();
        var td = child(tr);
        var text_1 = child(td);
        var td_1 = sibling(td);
        var text_2 = child(td_1);
        template_effect(
          ($0) => {
            set_text(text_1, key());
            set_text(text_2, $0);
          },
          [() => formatFieldValue(key(), val())]
        );
        append($$anchor3, tr);
      });
      var node_3 = sibling(details, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var details_1 = root_6();
          var summary = child(details_1);
          var h3 = child(summary);
          var text_3 = child(h3);
          var node_4 = sibling(summary, 2);
          ValidatorTable(node_4, {
            get rows() {
              return get(committeeRows);
            },
            variant: "active"
          });
          template_effect(() => set_text(text_3, `Committee Members (${get(committeeRows).length ?? ""})`));
          append($$anchor3, details_1);
        };
        if_block(node_3, ($$render) => {
          if (get(committeeRows).length > 0) $$render(consequent_3);
        });
      }
      var node_5 = sibling(node_3, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var details_2 = root_7();
          var summary_1 = child(details_2);
          var h3_1 = child(summary_1);
          var text_4 = child(h3_1);
          var node_6 = sibling(summary_1, 2);
          ValidatorTable(node_6, {
            get rows() {
              return get(activeValidatorRows);
            },
            variant: "active"
          });
          template_effect(() => set_text(text_4, `Other Active Validators (${get(activeValidatorRows).length ?? ""})`));
          append($$anchor3, details_2);
        };
        if_block(node_5, ($$render) => {
          if (get(activeValidatorRows).length > 0) $$render(consequent_4);
        });
      }
      append($$anchor2, div_2);
    };
    var consequent_6 = ($$anchor2) => {
      ValidatorTable($$anchor2, {
        get rows() {
          return get(validatorRows);
        },
        get variant() {
          return get(tableVariant);
        }
      });
    };
    if_block(node_2, ($$render) => {
      if (get(viewMode) === "json" || !get(hasSystemState) && get(validatorRows).length === 0) $$render(consequent_2);
      else if (get(hasSystemState)) $$render(consequent_5, 1);
      else if (get(validatorRows).length > 0) $$render(consequent_6, 2);
    });
  }
  var node_7 = sibling(node_2, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_4 = root_9();
      var table_1 = child(div_4);
      var tbody_1 = child(table_1);
      each(tbody_1, 5, () => Object.entries(get(stakeInfo)), index, ($$anchor3, $$item) => {
        var $$array_1 = user_derived(() => to_array(get($$item), 2));
        let key = () => get($$array_1)[0];
        let val = () => get($$array_1)[1];
        var tr_1 = root_10();
        var td_2 = child(tr_1);
        var text_5 = child(td_2);
        var td_3 = sibling(td_2);
        var text_6 = child(td_3);
        var td_4 = sibling(td_3);
        var text_7 = child(td_4);
        template_effect(
          ($0, $1) => {
            set_text(text_5, stakeInfoLabels[key()] || key());
            set_text(text_6, `${$0 ?? ""} IOTA`);
            set_text(text_7, $1);
          },
          [
            () => nanoToIotaFormatted(stripUnderscores(val())),
            () => stakeFieldsWithPct.has(key()) ? percentOfSupply(val(), get(stakeInfo).totalSupply) : ""
          ]
        );
        append($$anchor3, tr_1);
      });
      append($$anchor2, div_4);
    };
    if_block(node_7, ($$render) => {
      if (get(stakeInfo).totalSupply && get(stakeInfo).totalSupply !== "0") $$render(consequent_7);
    });
  }
  event("click", button, () => getLatestSystemState());
  event("click", button_1, () => getCandidateValidators());
  event("click", button_2, () => getPendingValidators());
  event("click", button_3, () => getInactiveValidators());
  bind_select_value(select, () => get(showAllValidatorData), ($$value) => set(showAllValidatorData, $$value));
  append($$anchor, main);
  pop();
}
export {
  IotaSystemState as default
};

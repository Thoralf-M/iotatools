import { f as formatNumbersWithUnderscores, p as push, i as init, a as from_html, s as sibling, c as child, b as if_block, g as get, m as mutable_source, t as template_effect, d as set_attribute, e as set_text, h as event, j as bind_select_value, k as append, l as pop, n as set, o as getClient } from "./index-DQQsL319.js";
import { J as JsonToggleView } from "./JsonToggleView-DiH1agbI.js";
async function fetchLatestSystemState(client) {
  const apiVersion = await client.getRpcApiVersion() || "";
  const systemState = await client.getLatestIotaSystemState();
  const formattedSystemState = formatNumbersWithUnderscores(systemState);
  const stakeInfo = systemStateStake(systemState);
  return {
    formattedSystemState,
    stakeInfo: formatNumbersWithUnderscores(stakeInfo),
    apiVersion
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
      stakeInfo: formatNumbersWithUnderscores(stakeInfo)
    };
  }
  let hasNextPage = true;
  let nextPageCursor = null;
  let validatorCandidates = [];
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
    stakeInfo: formatNumbersWithUnderscores(stakeInfo)
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
    stakeInfo: formatNumbersWithUnderscores(stakeInfo)
  };
}
async function fetchInactiveValidators(client, showAllValidatorData) {
  const systemState = await client.getLatestIotaSystemState();
  const size = systemState.inactivePoolsSize;
  if (parseInt(size) === 0) {
    return { formattedValidators: "No inactive validators" };
  }
  const inactiveValidatorsId = systemState.inactivePoolsId;
  let hasNextPage = true;
  let nextPageCursor = null;
  let inactiveValidatorsList = [];
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
  return { formattedValidators };
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
var root_1 = from_html(`<div> </div>`);
var root = from_html(`<main><button class="svelte-1aqomq7">get latest IOTA system state</button> <button class="svelte-1aqomq7">candidate validators</button> <button class="svelte-1aqomq7">pending validators</button> <button class="svelte-1aqomq7">inactive validators</button> show full data (set before requesting): <select><option></option><option></option></select> <!> <!> <pre class="value" style="text-align: left"> </pre></main>`);
function IotaSystemState($$anchor, $$props) {
  push($$props, false);
  let value = mutable_source({});
  let apiVersion = mutable_source("");
  let stakeInfo = mutable_source({});
  let showAllValidatorData = mutable_source(false);
  const getLatestSystemState = async () => {
    try {
      const client = getClient();
      const {
        formattedSystemState,
        stakeInfo: newStakeInfo,
        apiVersion: newApiVersion
      } = await fetchLatestSystemState(client);
      set(value, formattedSystemState);
      set(stakeInfo, newStakeInfo);
      set(apiVersion, newApiVersion);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  const getCandidateValidators = async () => {
    try {
      const client = getClient();
      const { formattedValidators, stakeInfo: newStakeInfo } = await fetchCandidateValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
      set(stakeInfo, newStakeInfo);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  const getPendingValidators = async () => {
    try {
      const client = getClient();
      const { formattedValidators, stakeInfo: newStakeInfo } = await fetchPendingValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
      set(stakeInfo, newStakeInfo);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  const getInactiveValidators = async () => {
    try {
      const client = getClient();
      const { formattedValidators } = await fetchInactiveValidators(client, get(showAllValidatorData));
      set(value, formattedValidators);
    } catch (err) {
      set(value, err.toString());
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
  JsonToggleView(node_1, {
    get value() {
      return get(value);
    }
  });
  var pre = sibling(node_1, 2);
  var text_1 = child(pre);
  template_effect(
    ($0) => {
      set_attribute(pre, "hidden", get(stakeInfo).totalSupply === "0");
      set_text(text_1, `
        ${$0 ?? ""}
    `);
    },
    [() => "\n" + JSON.stringify(get(stakeInfo), null, 2)]
  );
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

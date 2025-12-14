import { p as push, i as init, f as from_html, s as sibling, c as child, t as template_effect, g as get, m as mutable_source, a as invalidate_inner_signals, b as if_block, d as set_text, e as event, h as bind_select_value, j as append, k as pop, l as set, n as getClient, o as mutate } from "/iota-utils/assets/index-CuBr6LHS.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-Fs4iYLGv.js";
import { f as formatNumbersWithUnderscores } from "/iota-utils/assets/iota-nano-conversion-OHs0Uriu.js";
import "/iota-utils/assets/transaction-view-ChlGGVEN.js";
var root_1 = from_html(`<div> </div>`);
var root = from_html(`<main><button class="svelte-8fa537">get latest IOTA system state</button> <button class="svelte-8fa537">candidate validators</button> <button class="svelte-8fa537">pending validators</button> show full data (set before requesting): <select><option></option><option></option></select> <!> <!> <pre class="value" style="text-align: left"> </pre></main>`);
function IotaSystemState($$anchor, $$props) {
  push($$props, false);
  let value = mutable_source({});
  let apiVersion = mutable_source("");
  let stakeInfo = mutable_source({
    totalSupply: void 0,
    totalStake: void 0,
    pendingStake: void 0,
    nextEpochStake: void 0,
    candidateValidatorsStake: void 0,
    pendingValidatorsStake: void 0
  });
  const getLatestSystemState = async () => {
    try {
      let client = getClient();
      set(apiVersion, await client.getRpcApiVersion() || "");
      const systemState = await client.getLatestIotaSystemState();
      console.log(systemState);
      set(value, formatNumbersWithUnderscores(systemState));
      set(stakeInfo, systemStateStake(get(stakeInfo), systemState));
      set(stakeInfo, formatNumbersWithUnderscores(get(stakeInfo)));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  let showAllValidatorData = mutable_source(false);
  const getCandidateValidators = async () => {
    var _a, _b;
    try {
      let client = getClient();
      set(apiVersion, await client.getRpcApiVersion() || "");
      const systemState = await client.getLatestIotaSystemState();
      set(stakeInfo, systemStateStake(get(stakeInfo), systemState));
      mutate(stakeInfo, get(stakeInfo).candidateValidatorsStake = 0);
      const validatorCandidatesId = systemState.validatorCandidatesId;
      let hasNextPage = true;
      let nextPageCursor;
      let validatorCandidates = [];
      while (hasNextPage) {
        const candidateValidatorsPage = await client.getDynamicFields({ parentId: validatorCandidatesId, cursor: nextPageCursor });
        for (const candidateValidator of candidateValidatorsPage.data) {
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
          mutate(stakeInfo, get(stakeInfo).candidateValidatorsStake += parseInt(validator.staking_pool.fields.iota_balance));
          if (!get(showAllValidatorData)) {
            cleanupValidatorFields(validator);
          }
          validatorCandidates.push(validator);
          set(value, formatNumbersWithUnderscores(validatorCandidates));
        }
        hasNextPage = candidateValidatorsPage.hasNextPage;
        if (hasNextPage) {
          nextPageCursor = candidateValidatorsPage.nextCursor;
        }
      }
      if (validatorCandidates.length == 0) {
        set(value, "No candidate validators");
      }
      set(stakeInfo, formatNumbersWithUnderscores(get(stakeInfo)));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  const getPendingValidators = async () => {
    var _a;
    try {
      let client = getClient();
      set(apiVersion, await client.getRpcApiVersion() || "");
      const systemState = await client.getLatestIotaSystemState();
      set(stakeInfo, systemStateStake(get(stakeInfo), systemState));
      mutate(stakeInfo, get(stakeInfo).pendingValidatorsStake = 0);
      const pendingActiveValidatorsId = systemState.pendingActiveValidatorsId;
      let hasNextPage = true;
      let nextPageCursor;
      let pendingValidators = [];
      while (hasNextPage) {
        const pendingValidatorsPage = await client.getDynamicFields({ parentId: pendingActiveValidatorsId, cursor: nextPageCursor });
        for (const pendingValidator of pendingValidatorsPage.data) {
          const validatorObject = await client.getObject({
            id: pendingValidator.objectId,
            options: { showContent: true }
          });
          const validator = (
            // @ts-ignore
            (_a = validatorObject.data) == null ? void 0 : _a.content.fields.value.fields
          );
          mutate(stakeInfo, get(stakeInfo).pendingValidatorsStake += parseInt(validator.staking_pool.fields.iota_balance));
          if (!get(showAllValidatorData)) {
            cleanupValidatorFields(validator);
          }
          pendingValidators.push(validator);
          set(value, formatNumbersWithUnderscores(pendingValidators));
        }
        hasNextPage = pendingValidatorsPage.hasNextPage;
        if (hasNextPage) {
          nextPageCursor = pendingValidatorsPage.nextCursor;
        }
      }
      if (pendingValidators.length == 0) {
        set(value, "No pending validators");
      }
      set(stakeInfo, formatNumbersWithUnderscores(get(stakeInfo)));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  function systemStateStake(stakeInfo2, systemState) {
    stakeInfo2.totalSupply = parseInt(systemState.iotaTotalSupply);
    stakeInfo2.totalStake = parseInt(systemState.totalStake);
    stakeInfo2.pendingStake = 0;
    stakeInfo2.nextEpochStake = 0;
    for (const validator of systemState.activeValidators) {
      stakeInfo2.pendingStake += parseInt(validator.pendingStake);
      stakeInfo2.nextEpochStake += parseInt(validator.nextEpochStake);
    }
    return stakeInfo2;
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
    delete validator.staking_pool.fields.id;
  }
  init();
  var main = root();
  var button = child(main);
  var button_1 = sibling(button, 2);
  var button_2 = sibling(button_1, 2);
  var select = sibling(button_2, 2);
  template_effect(() => {
    get(showAllValidatorData);
    invalidate_inner_signals(() => {
    });
  });
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
      pre.hidden = get(stakeInfo).totalSupply == 0;
      set_text(text_1, `
        ${$0 ?? ""}
    `);
    },
    [() => "\n" + JSON.stringify(get(stakeInfo), null, 2)]
  );
  event("click", button, () => getLatestSystemState());
  event("click", button_1, () => getCandidateValidators());
  event("click", button_2, () => getPendingValidators());
  bind_select_value(select, () => get(showAllValidatorData), ($$value) => set(showAllValidatorData, $$value));
  append($$anchor, main);
  pop();
}
export {
  IotaSystemState as default
};

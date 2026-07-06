import { p as push, v as init, b as sibling, h as child, e as each, t as template_effect, c as set_text, g as get, d as append, j as index, w as event, s as set, J as bind_value, l as pop, F as store_get, au as activeAddress, b7 as sharedClientConfig, G as setup_stores, y as mutable_source, ab as isValidIotaAddress, q as from_html } from "./index-BxEuZFuQ.js";
import { r as requestIotaFromFaucetV1, g as getFaucetRequestStatus, a as requestIotaFromFaucetV0 } from "./faucet-JrOhy6oz.js";
import { J as JsonToggleView } from "./JsonToggleView-Cw_Jhcn0.js";
var root_1 = from_html(`<option> </option>`);
var root = from_html(`<main><button class="svelte-1fjps7p">Set to current network and active address</button> <br/> <span>faucet URL: <input type="string" list="faucetUrls" class="faucet-input svelte-1fjps7p" placeholder="faucet URL, like http://127.0.0.1:9123/gas"/> <datalist id="faucetUrls"></datalist></span> <br/> <span>address: <input placeholder="address" class="address-input svelte-1fjps7p"/></span> <br/> <span>amount of requests: <input type="number" placeholder="1" size="4"/></span> <span>milliseconds between requests: <input type="number" placeholder="1000" style="width: 7rem;"/></span> <br/> <button class="svelte-1fjps7p">Request funds</button> <!></main>`);
function Faucet($$anchor, $$props) {
  push($$props, false);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const $sharedClientConfig = () => store_get(sharedClientConfig, "$sharedClientConfig", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let address = mutable_source("0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215");
  let faucetUrl = mutable_source("https://faucet.testnet.iota.cafe/gas");
  let value = mutable_source({});
  let amountOfRequests = mutable_source(1);
  let msBetweenRequests = mutable_source(1e3);
  const requestFundsLoop = async () => {
    for (let i = 0; i < get(amountOfRequests); i++) {
      requestFunds();
      await new Promise((resolve) => setTimeout(resolve, get(msBetweenRequests)));
    }
  };
  const requestFunds = async () => {
    try {
      if (!isValidIotaAddress(get(address))) {
        throw new Error("invalid address");
      }
      try {
        var response = await requestIotaFromFaucetV1({ host: get(faucetUrl), recipient: get(address) });
        let taskId = response.task?.taskId;
        if (error || !taskId) {
          throw new Error(error ?? "Failed, task id not found.");
        }
        console.log(taskId);
        var { status: { status, transferred_gas_objects }, error } = await getFaucetRequestStatus({ host: get(faucetUrl), taskId });
        console.log(status);
        console.log(transferred_gas_objects);
        set(value, transferred_gas_objects);
      } catch (e) {
        console.log(e);
        const faucetResponse = await requestIotaFromFaucetV0({ host: get(faucetUrl), recipient: get(address) });
        console.log(faucetResponse);
        set(value, faucetResponse);
      }
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  };
  init();
  var main = root();
  var button = child(main);
  var span = sibling(button, 4);
  var input = sibling(child(span));
  var datalist = sibling(input, 2);
  each(datalist, 5, () => $sharedClientConfig().networks, index, ($$anchor2, network) => {
    var option = root_1();
    var text = child(option);
    var option_value = {};
    template_effect(() => {
      set_text(text, get(network).name);
      if (option_value !== (option_value = get(network).faucet)) {
        option.value = (option.__value = get(network).faucet) ?? "";
      }
    });
    append($$anchor2, option);
  });
  var span_1 = sibling(span, 4);
  var input_1 = sibling(child(span_1));
  var span_2 = sibling(span_1, 4);
  var input_2 = sibling(child(span_2));
  var span_3 = sibling(span_2, 2);
  var input_3 = sibling(child(span_3));
  var button_1 = sibling(span_3, 4);
  var node = sibling(button_1, 2);
  JsonToggleView(node, {
    get value() {
      return get(value);
    }
  });
  event("click", button, () => {
    set(address, $activeAddress());
    set(faucetUrl, $sharedClientConfig().networks.find((network) => network.name === $sharedClientConfig().selected)?.faucet ?? "http://127.0.0.1:9123/gas");
  });
  bind_value(input, () => get(faucetUrl), ($$value) => set(faucetUrl, $$value));
  bind_value(input_1, () => get(address), ($$value) => set(address, $$value));
  bind_value(input_2, () => get(amountOfRequests), ($$value) => set(amountOfRequests, $$value));
  bind_value(input_3, () => get(msBetweenRequests), ($$value) => set(msBetweenRequests, $$value));
  event("click", button_1, () => requestFundsLoop());
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  Faucet as default
};

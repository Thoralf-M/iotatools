import { aq as get_descriptor, ar as teardown } from "/iota-utils/assets/index-CoXScrZT.js";
function bind_prop(props, prop, value) {
  var desc = get_descriptor(props, prop);
  if (desc && desc.set) {
    props[prop] = value;
    teardown(() => {
      props[prop] = null;
    });
  }
}
export {
  bind_prop as b
};

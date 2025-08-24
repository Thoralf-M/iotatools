import { ar as get_descriptor, as as teardown } from "/iota-utils/assets/index-C6lov13X.js";
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

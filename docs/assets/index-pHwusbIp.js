const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["iota-utils/assets/IotaSystemState-tkGzClFA.js","iota-utils/assets/JsonToggleView-CqCYOITx.js","iota-utils/assets/transaction-view-6TG6rbVn.js","iota-utils/assets/b64-BgM4Sqlt.js","iota-utils/assets/transaction-view-BucjpHvO.css","iota-utils/assets/JsonToggleView-FheaJgbA.css","iota-utils/assets/iota-nano-conversion-5ps7YHJN.js","iota-utils/assets/IotaSystemState-DJm4xoge.css","iota-utils/assets/PTBs-CAHfejg2.js","iota-utils/assets/attributes-DCsvkNft.js","iota-utils/assets/this-DHiozhd5.js","iota-utils/assets/TransactionView-QG7uKgGa.js","iota-utils/assets/bcs-B43aCULF.js","iota-utils/assets/hex-BsUxbKPD.js","iota-utils/assets/TransactionView-B6-FiXL8.css","iota-utils/assets/index-BKg2jvby.js","iota-utils/assets/index-x7zExsIH.js","iota-utils/assets/PTBs-B0NiFlev.css","iota-utils/assets/DynamicFields-BgzyMfYt.js","iota-utils/assets/dynamic-fields-utils-BhUT74ts.js","iota-utils/assets/page-query-params-T7IbIqxW.js","iota-utils/assets/StakingRewards-BOvqj3JF.js","iota-utils/assets/actions-D8sIgFOA.js","iota-utils/assets/props-BRe5kE1R.js","iota-utils/assets/StakingRewards-BDoOf4lc.css","iota-utils/assets/MultiAccountView-DOPXQ8-n.js","iota-utils/assets/transaction-execution-UZL-T7EJ.js","iota-utils/assets/MultiAccountView-D61lEXHE.css","iota-utils/assets/AccountsList-BQ1bLAqN.js","iota-utils/assets/AccountsList-e96FKZJa.css","iota-utils/assets/Keystone-DORQ0Q6c.js","iota-utils/assets/index-DDJ5SC1F.js","iota-utils/assets/Keystone-CLSPZRvC.css","iota-utils/assets/LedgerNano-CYNuz02Z.js","iota-utils/assets/browser-C_sr4ApI.js","iota-utils/assets/LedgerNano-QxKjjy9Y.css","iota-utils/assets/Sign-D8B9Z0KR.js","iota-utils/assets/Sign-BS8dv2WI.css","iota-utils/assets/PublishData-DireB2FG.js","iota-utils/assets/SplitMergeCoins-BVv1KvWt.js","iota-utils/assets/ProgrammableTransactionBlock-ZONyS14M.js","iota-utils/assets/ProgrammableTransactionBlock-Bk61Xysr.css","iota-utils/assets/BulkTransfer-BbCeSQpc.js","iota-utils/assets/BulkTransfer-z2jcn1zs.css","iota-utils/assets/Stake-B9ri6XEC.js","iota-utils/assets/Stake-DD0_RhAF.css","iota-utils/assets/Faucet-CCGRLLQy.js","iota-utils/assets/Converter-DgPDDDcF.js","iota-utils/assets/Converter-BB97tH9s.css","iota-utils/assets/TextAnalyzer-CEsoopXh.js","iota-utils/assets/TextAnalyzer-BeSUleA5.css","iota-utils/assets/Ed25519AddressGeneration-BHrZq6mh.js","iota-utils/assets/Ed25519AddressGeneration-Bk9cmk1E.css","iota-utils/assets/IotaNames-oNvRX-DY.js","iota-utils/assets/Settings-CAr3MXGt.js","iota-utils/assets/Settings-CK220tqd.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _previous, _callbacks, _pending, _deferred, _neutered, _async_effects, _boundary_async_effects, _render_effects, _effects, _block_effects, _dirty_effects, _maybe_dirty_effects, _Batch_instances, traverse_effect_tree_fn, defer_effects_fn, commit_fn, _a;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link2) {
    const fetchOpts = {};
    if (link2.integrity) fetchOpts.integrity = link2.integrity;
    if (link2.referrerPolicy) fetchOpts.referrerPolicy = link2.referrerPolicy;
    if (link2.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link2.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
})();
const DEV = false;
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
function is_function(thing) {
  return typeof thing === "function";
}
const noop = () => {
};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function to_array(value, n) {
  if (Array.isArray(value)) {
    return value;
  }
  if (!(Symbol.iterator in value)) {
    return Array.from(value);
  }
  const array2 = [];
  for (const element of value) {
    array2.push(element);
    if (array2.length === n) break;
  }
  return array2;
}
const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const RENDER_EFFECT = 1 << 3;
const BLOCK_EFFECT = 1 << 4;
const BRANCH_EFFECT = 1 << 5;
const ROOT_EFFECT = 1 << 6;
const BOUNDARY_EFFECT = 1 << 7;
const UNOWNED = 1 << 8;
const DISCONNECTED = 1 << 9;
const CLEAN = 1 << 10;
const DIRTY = 1 << 11;
const MAYBE_DIRTY = 1 << 12;
const INERT = 1 << 13;
const DESTROYED = 1 << 14;
const EFFECT_RAN = 1 << 15;
const EFFECT_TRANSPARENT = 1 << 16;
const INSPECT_EFFECT = 1 << 17;
const HEAD_EFFECT = 1 << 18;
const EFFECT_PRESERVED = 1 << 19;
const USER_EFFECT = 1 << 20;
const REACTION_IS_UPDATING = 1 << 21;
const ASYNC = 1 << 22;
const ERROR_VALUE = 1 << 23;
const STATE_SYMBOL = Symbol("$state");
const LEGACY_PROPS = Symbol("legacy props");
const LOADING_ATTR_SYMBOL = Symbol("");
const STALE_REACTION = new class StaleReactionError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
function await_outside_boundary() {
  {
    throw new Error(`https://svelte.dev/e/await_outside_boundary`);
  }
}
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
function async_derived_orphan() {
  {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function effect_in_teardown(rune) {
  {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function props_invalid_value(key) {
  {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function state_descriptors_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
const EACH_ITEM_REACTIVE = 1;
const EACH_INDEX_REACTIVE = 1 << 1;
const EACH_IS_CONTROLLED = 1 << 2;
const EACH_IS_ANIMATED = 1 << 3;
const EACH_ITEM_IMMUTABLE = 1 << 4;
const PROPS_IS_IMMUTABLE = 1;
const PROPS_IS_RUNES = 1 << 1;
const PROPS_IS_UPDATED = 1 << 2;
const PROPS_IS_BINDABLE = 1 << 3;
const PROPS_IS_LAZY_INITIAL = 1 << 4;
const TEMPLATE_FRAGMENT = 1;
const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
const UNINITIALIZED = Symbol();
const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
function select_multiple_invalid_value() {
  {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
let hydrating = false;
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function not_equal(a, b) {
  return a !== b;
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
let legacy_mode_flag = false;
let tracing_mode_flag = false;
function enable_legacy_mode_flag() {
  legacy_mode_flag = true;
}
let component_context = null;
function set_component_context(context) {
  component_context = context;
}
function getContext(key) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  const context_map = get_or_init_context_map();
  context_map.set(key, context);
  return context;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    c: null,
    e: null,
    s: props,
    x: null,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
}
function pop(component2) {
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component2 !== void 0) {
    context.x = component2;
  }
  component_context = context.p;
  return component2 ?? /** @type {T} */
  {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}
function get_or_init_context_map(name) {
  if (component_context === null) {
    lifecycle_outside_component();
  }
  return component_context.c ?? (component_context.c = new Map(get_parent_context(component_context) || void 0));
}
function get_parent_context(component_context2) {
  let parent = component_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
const adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error) {
  var effect2 = active_effect;
  if (effect2 === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if ((effect2.f & EFFECT_RAN) === 0) {
    if ((effect2.f & BOUNDARY_EFFECT) === 0) {
      if (!effect2.parent && error instanceof Error) {
        apply_adjustments(error);
      }
      throw error;
    }
    effect2.b.error(error);
  } else {
    invoke_error_boundary(error, effect2);
  }
}
function invoke_error_boundary(error, effect2) {
  while (effect2 !== null) {
    if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
      try {
        effect2.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect2 = effect2.parent;
  }
  if (error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}
let micro_tasks = [];
let idle_tasks = [];
function run_micro_tasks() {
  var tasks2 = micro_tasks;
  micro_tasks = [];
  run_all(tasks2);
}
function run_idle_tasks() {
  var tasks2 = idle_tasks;
  idle_tasks = [];
  run_all(tasks2);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0) {
    queueMicrotask(run_micro_tasks);
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  if (micro_tasks.length > 0) {
    run_micro_tasks();
  }
  if (idle_tasks.length > 0) {
    run_idle_tasks();
  }
}
function get_pending_boundary() {
  var boundary2 = (
    /** @type {Effect} */
    active_effect.b
  );
  while (boundary2 !== null && !boundary2.has_pending_snippet()) {
    boundary2 = boundary2.parent;
  }
  if (boundary2 === null) {
    await_outside_boundary();
  }
  return boundary2;
}
// @__NO_SIDE_EFFECTS__
function derived$1(fn) {
  var flags = DERIVED | DIRTY;
  var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
    /** @type {Derived} */
    active_reaction
  ) : null;
  if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
    flags |= UNOWNED;
  } else {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags,
    fn,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      UNINITIALIZED
    ),
    wv: 0,
    parent: parent_derived ?? active_effect,
    ac: null
  };
  return signal;
}
// @__NO_SIDE_EFFECTS__
function async_derived(fn, location2) {
  let parent = (
    /** @type {Effect | null} */
    active_effect
  );
  if (parent === null) {
    async_derived_orphan();
  }
  var boundary = (
    /** @type {Boundary} */
    parent.b
  );
  var promise = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  );
  var signal = source(
    /** @type {V} */
    UNINITIALIZED
  );
  var prev = null;
  var should_suspend = !active_reaction;
  async_effect(() => {
    try {
      var p = fn();
    } catch (error) {
      p = Promise.reject(error);
    }
    var r2 = () => p;
    promise = (prev == null ? void 0 : prev.then(r2, r2)) ?? Promise.resolve(p);
    prev = promise;
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var pending2 = boundary.pending;
    if (should_suspend) {
      boundary.update_pending_count(1);
      if (!pending2) batch.increment();
    }
    const handler = (value, error = void 0) => {
      prev = null;
      if (!pending2) batch.activate();
      if (error) {
        if (error !== STALE_REACTION) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        }
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
      }
      if (should_suspend) {
        boundary.update_pending_count(-1);
        if (!pending2) batch.decrement();
      }
      unset_context();
    };
    promise.then(handler, (e) => handler(null, e || "unknown"));
    if (batch) {
      return () => {
        queueMicrotask(() => batch.neuter());
      };
    }
  });
  return new Promise((fulfil) => {
    function next(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next(promise);
        }
      }
      p.then(go, go);
    }
    next(promise);
  });
}
// @__NO_SIDE_EFFECTS__
function user_derived(fn) {
  const d = /* @__PURE__ */ derived$1(fn);
  push_reaction_value(d);
  return d;
}
// @__NO_SIDE_EFFECTS__
function derived_safe_equal(fn) {
  const signal = /* @__PURE__ */ derived$1(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
function get_derived_parent_effect(derived2) {
  var parent = derived2.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (
        /** @type {Effect} */
        parent
      );
    }
    parent = parent.parent;
  }
  return null;
}
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived2));
  {
    try {
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.v = value;
    derived2.wv = increment_write_version();
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_deriveds !== null) {
    batch_deriveds.set(derived2, derived2.v);
  } else {
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
}
function flatten(sync, async, fn) {
  const d = is_runes() ? derived$1 : derived_safe_equal;
  if (async.length === 0) {
    fn(sync.map(d));
    return;
  }
  var batch = current_batch;
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  var restore = capture();
  var boundary = get_pending_boundary();
  Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then((result) => {
    batch == null ? void 0 : batch.activate();
    restore();
    try {
      fn([...sync.map(d), ...result]);
    } catch (error) {
      if ((parent.f & DESTROYED) === 0) {
        invoke_error_boundary(error, parent);
      }
    }
    batch == null ? void 0 : batch.deactivate();
    unset_context();
  }).catch((error) => {
    boundary.error(error);
  });
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  return function restore() {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
  };
}
function unset_context() {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
}
const batches = /* @__PURE__ */ new Set();
let current_batch = null;
let previous_batch = null;
let batch_deriveds = null;
let effect_pending_updates = /* @__PURE__ */ new Set();
let tasks = [];
function dequeue() {
  const task = (
    /** @type {() => void} */
    tasks.shift()
  );
  if (tasks.length > 0) {
    queueMicrotask(dequeue);
  }
  task();
}
let queued_root_effects = [];
let last_scheduled_effect = null;
let is_flushing = false;
let is_flushing_sync = false;
const _Batch = class _Batch {
  constructor() {
    __privateAdd(this, _Batch_instances);
    /**
     * The current values of any sources that are updated in this batch
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Source, any>}
     */
    __publicField(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any sources that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Source, any>}
     */
    __privateAdd(this, _previous, /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<() => void>}
     */
    __privateAdd(this, _callbacks, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    __privateAdd(this, _pending, 0);
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    __privateAdd(this, _deferred, null);
    /**
     * True if an async effect inside this batch resolved and
     * its parent branch was already deleted
     */
    __privateAdd(this, _neutered, false);
    /**
     * Async effects (created inside `async_derived`) encountered during processing.
     * These run after the rest of the batch has updated, since they should
     * always have the latest values
     * @type {Effect[]}
     */
    __privateAdd(this, _async_effects, []);
    /**
     * The same as `#async_effects`, but for effects inside a newly-created
     * `<svelte:boundary>` — these do not prevent the batch from committing
     * @type {Effect[]}
     */
    __privateAdd(this, _boundary_async_effects, []);
    /**
     * Template effects and `$effect.pre` effects, which run when
     * a batch is committed
     * @type {Effect[]}
     */
    __privateAdd(this, _render_effects, []);
    /**
     * The same as `#render_effects`, but for `$effect` (which runs after)
     * @type {Effect[]}
     */
    __privateAdd(this, _effects, []);
    /**
     * Block effects, which may need to re-run on subsequent flushes
     * in order to update internal sources (e.g. each block items)
     * @type {Effect[]}
     */
    __privateAdd(this, _block_effects, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Effect[]}
     */
    __privateAdd(this, _dirty_effects, []);
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Effect[]}
     */
    __privateAdd(this, _maybe_dirty_effects, []);
    /**
     * A set of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`
     * @type {Set<Effect>}
     */
    __publicField(this, "skipped_effects", /* @__PURE__ */ new Set());
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(root_effects) {
    var _a2;
    queued_root_effects = [];
    previous_batch = null;
    var current_values = null;
    if (batches.size > 1) {
      current_values = /* @__PURE__ */ new Map();
      batch_deriveds = /* @__PURE__ */ new Map();
      for (const [source2, current] of this.current) {
        current_values.set(source2, { v: source2.v, wv: source2.wv });
        source2.v = current;
      }
      for (const batch of batches) {
        if (batch === this) continue;
        for (const [source2, previous] of __privateGet(batch, _previous)) {
          if (!current_values.has(source2)) {
            current_values.set(source2, { v: source2.v, wv: source2.wv });
            source2.v = previous;
          }
        }
      }
    }
    for (const root2 of root_effects) {
      __privateMethod(this, _Batch_instances, traverse_effect_tree_fn).call(this, root2);
    }
    if (__privateGet(this, _async_effects).length === 0 && __privateGet(this, _pending) === 0) {
      __privateMethod(this, _Batch_instances, commit_fn).call(this);
      var render_effects = __privateGet(this, _render_effects);
      var effects = __privateGet(this, _effects);
      __privateSet(this, _render_effects, []);
      __privateSet(this, _effects, []);
      __privateSet(this, _block_effects, []);
      previous_batch = current_batch;
      current_batch = null;
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      if (current_batch === null) {
        current_batch = this;
      } else {
        batches.delete(this);
      }
      (_a2 = __privateGet(this, _deferred)) == null ? void 0 : _a2.resolve();
    } else {
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, __privateGet(this, _render_effects));
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, __privateGet(this, _effects));
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, __privateGet(this, _block_effects));
    }
    if (current_values) {
      for (const [source2, { v, wv }] of current_values) {
        if (source2.wv <= wv) {
          source2.v = v;
        }
      }
      batch_deriveds = null;
    }
    for (const effect2 of __privateGet(this, _async_effects)) {
      update_effect(effect2);
    }
    for (const effect2 of __privateGet(this, _boundary_async_effects)) {
      update_effect(effect2);
    }
    __privateSet(this, _async_effects, []);
    __privateSet(this, _boundary_async_effects, []);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(source2, value) {
    if (!__privateGet(this, _previous).has(source2)) {
      __privateGet(this, _previous).set(source2, value);
    }
    this.current.set(source2, source2.v);
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    previous_batch = null;
    for (const update2 of effect_pending_updates) {
      effect_pending_updates.delete(update2);
      update2();
      if (current_batch !== null) {
        break;
      }
    }
  }
  neuter() {
    __privateSet(this, _neutered, true);
  }
  flush() {
    if (queued_root_effects.length > 0) {
      flush_effects();
    } else {
      __privateMethod(this, _Batch_instances, commit_fn).call(this);
    }
    if (current_batch !== this) {
      return;
    }
    if (__privateGet(this, _pending) === 0) {
      batches.delete(this);
    }
    this.deactivate();
  }
  increment() {
    __privateSet(this, _pending, __privateGet(this, _pending) + 1);
  }
  decrement() {
    __privateSet(this, _pending, __privateGet(this, _pending) - 1);
    if (__privateGet(this, _pending) === 0) {
      for (const e of __privateGet(this, _dirty_effects)) {
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of __privateGet(this, _maybe_dirty_effects)) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      __privateSet(this, _render_effects, []);
      __privateSet(this, _effects, []);
      this.flush();
    } else {
      this.deactivate();
    }
  }
  /** @param {() => void} fn */
  add_callback(fn) {
    __privateGet(this, _callbacks).add(fn);
  }
  settled() {
    return (__privateGet(this, _deferred) ?? __privateSet(this, _deferred, deferred())).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new _Batch();
      batches.add(current_batch);
      if (!is_flushing_sync) {
        _Batch.enqueue(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  /** @param {() => void} task */
  static enqueue(task) {
    if (tasks.length === 0) {
      queueMicrotask(dequeue);
    }
    tasks.unshift(task);
  }
};
_previous = new WeakMap();
_callbacks = new WeakMap();
_pending = new WeakMap();
_deferred = new WeakMap();
_neutered = new WeakMap();
_async_effects = new WeakMap();
_boundary_async_effects = new WeakMap();
_render_effects = new WeakMap();
_effects = new WeakMap();
_block_effects = new WeakMap();
_dirty_effects = new WeakMap();
_maybe_dirty_effects = new WeakMap();
_Batch_instances = new WeakSet();
/**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 */
traverse_effect_tree_fn = function(root2) {
  var _a2;
  root2.f ^= CLEAN;
  var effect2 = root2.first;
  while (effect2 !== null) {
    var flags = effect2.f;
    var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
    var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
    var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect2);
    if (!skip && effect2.fn !== null) {
      if (is_branch) {
        effect2.f ^= CLEAN;
      } else if ((flags & CLEAN) === 0) {
        if ((flags & EFFECT) !== 0) {
          __privateGet(this, _effects).push(effect2);
        } else if ((flags & ASYNC) !== 0) {
          var effects = ((_a2 = effect2.b) == null ? void 0 : _a2.pending) ? __privateGet(this, _boundary_async_effects) : __privateGet(this, _async_effects);
          effects.push(effect2);
        } else if (is_dirty(effect2)) {
          if ((effect2.f & BLOCK_EFFECT) !== 0) __privateGet(this, _block_effects).push(effect2);
          update_effect(effect2);
        }
      }
      var child2 = effect2.first;
      if (child2 !== null) {
        effect2 = child2;
        continue;
      }
    }
    var parent = effect2.parent;
    effect2 = effect2.next;
    while (effect2 === null && parent !== null) {
      effect2 = parent.next;
      parent = parent.parent;
    }
  }
};
/**
 * @param {Effect[]} effects
 */
defer_effects_fn = function(effects) {
  for (const e of effects) {
    const target2 = (e.f & DIRTY) !== 0 ? __privateGet(this, _dirty_effects) : __privateGet(this, _maybe_dirty_effects);
    target2.push(e);
    set_signal_status(e, CLEAN);
  }
  effects.length = 0;
};
/**
 * Append and remove branches to/from the DOM
 */
commit_fn = function() {
  if (!__privateGet(this, _neutered)) {
    for (const fn of __privateGet(this, _callbacks)) {
      fn();
    }
  }
  __privateGet(this, _callbacks).clear();
};
let Batch = _Batch;
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) ;
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        current_batch == null ? void 0 : current_batch.flush();
        if (queued_root_effects.length === 0) {
          last_scheduled_effect = null;
          return (
            /** @type {T} */
            result
          );
        }
      }
      flush_effects();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function flush_effects() {
  var was_updating_effect = is_updating_effect;
  is_flushing = true;
  try {
    var flush_count = 0;
    set_is_updating_effect(true);
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1e3) {
        var updates, entry;
        if (DEV) ;
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
    }
  } finally {
    is_flushing = false;
    set_is_updating_effect(was_updating_effect);
    last_scheduled_effect = null;
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect2 = effects[i++];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
      var n = current_batch ? current_batch.current.size : 0;
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
        if (effect2.teardown === null && effect2.ac === null) {
          unlink_effect(effect2);
        } else {
          effect2.fn = null;
        }
      }
      if (current_batch !== null && current_batch.current.size > n && (effect2.f & USER_EFFECT) !== 0) {
        break;
      }
    }
  }
  while (i < length) {
    schedule_effect(effects[i++]);
  }
}
function schedule_effect(signal) {
  var effect2 = last_scheduled_effect = signal;
  while (effect2.parent !== null) {
    effect2 = effect2.parent;
    var flags = effect2.f;
    if (is_flushing && effect2 === active_effect && (flags & BLOCK_EFFECT) !== 0) {
      return;
    }
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0) return;
      effect2.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect2);
}
const old_values = /* @__PURE__ */ new Map();
function source(v, stack) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  return signal;
}
// @__NO_SIDE_EFFECTS__
function state(v, stack) {
  const s = source(v);
  push_reaction_value(s);
  return s;
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable = false, trackable = true) {
  var _a2;
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s);
  }
  return s;
}
function mutate(source2, value) {
  set(
    source2,
    untrack(() => get$2(source2))
  );
  return value;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !(current_sources == null ? void 0 : current_sources.includes(source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  return internal_set(source2, new_value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if ((source2.f & DERIVED) !== 0) {
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(
          /** @type {Derived} */
          source2
        );
      }
      set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
  }
  return value;
}
function update(source2, d = 1) {
  var value = get$2(source2);
  var result = d === 1 ? value++ : value--;
  set(source2, value);
  return result;
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
    if (!runes && reaction === active_effect) continue;
    var not_dirty = (flags & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags & DERIVED) !== 0) {
      mark_reactions(
        /** @type {Derived} */
        reaction,
        MAYBE_DIRTY
      );
    } else if (not_dirty) {
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = /* @__PURE__ */ state(0);
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", /* @__PURE__ */ state(
      /** @type {any[]} */
      value.length
    ));
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop2, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop2);
        if (s === void 0) {
          s = with_parent(() => {
            var s2 = /* @__PURE__ */ state(descriptor.value);
            sources.set(prop2, s2);
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target2, prop2) {
        var s = sources.get(prop2);
        if (s === void 0) {
          if (prop2 in target2) {
            const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
            sources.set(prop2, s2);
            increment(version);
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target2, prop2, receiver) {
        var _a2;
        if (prop2 === STATE_SYMBOL) {
          return value;
        }
        var s = sources.get(prop2);
        var exists = prop2 in target2;
        if (s === void 0 && (!exists || ((_a2 = get_descriptor(target2, prop2)) == null ? void 0 : _a2.writable))) {
          s = with_parent(() => {
            var p = proxy(exists ? target2[prop2] : UNINITIALIZED);
            var s2 = /* @__PURE__ */ state(p);
            return s2;
          });
          sources.set(prop2, s);
        }
        if (s !== void 0) {
          var v = get$2(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target2, prop2, receiver);
      },
      getOwnPropertyDescriptor(target2, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s) descriptor.value = get$2(s);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop2);
          var value2 = source2 == null ? void 0 : source2.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target2, prop2) {
        var _a2;
        if (prop2 === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop2);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target2, prop2);
        if (s !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target2, prop2)) == null ? void 0 : _a2.writable))) {
          if (s === void 0) {
            s = with_parent(() => {
              var p = has ? proxy(target2[prop2]) : UNINITIALIZED;
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop2, s);
          }
          var value2 = get$2(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target2, prop2, value2, receiver) {
        var _a2;
        var s = sources.get(prop2);
        var has = prop2 in target2;
        if (is_proxied_array && prop2 === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target2) {
              other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(i + "", other_s);
            }
          }
        }
        if (s === void 0) {
          if (!has || ((_a2 = get_descriptor(target2, prop2)) == null ? void 0 : _a2.writable)) {
            s = with_parent(() => /* @__PURE__ */ state(void 0));
            set(s, proxy(value2));
            sources.set(prop2, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
        if (descriptor == null ? void 0 : descriptor.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop2 === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop2);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target2) {
        get$2(version);
        var own_keys = Reflect.ownKeys(target2).filter((key2) => {
          var source3 = sources.get(key2);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key in target2)) {
            own_keys.push(key);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {
  }
  return value;
}
function is$1(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var $window;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = void 0;
    element_prototype.__className = void 0;
    element_prototype.__attributes = null;
    element_prototype.__style = void 0;
    element_prototype.__e = void 0;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = void 0;
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return first_child_getter.call(node);
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function child(node, is_text) {
  {
    return /* @__PURE__ */ get_first_child(node);
  }
}
function first_child(fragment, is_text) {
  {
    var first = (
      /** @type {DocumentFragment} */
      /* @__PURE__ */ get_first_child(
        /** @type {Node} */
        fragment
      )
    );
    if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
    return first;
  }
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = node;
  while (count--) {
    next_sibling = /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(next_sibling);
  }
  {
    return next_sibling;
  }
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  return false;
}
function validate_effect(rune) {
  if (active_effect === null && active_reaction === null) {
    effect_orphan();
  }
  if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown();
  }
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn, sync, push2 = true) {
  var parent = active_effect;
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect2 = {
    ctx: component_context,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: type | DIRTY,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0,
    ac: null
  };
  if (sync) {
    try {
      update_effect(effect2);
      effect2.f |= EFFECT_RAN;
    } catch (e2) {
      destroy_effect(effect2);
      throw e2;
    }
  } else if (fn !== null) {
    schedule_effect(effect2);
  }
  var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & EFFECT_PRESERVED) === 0;
  if (!inert && push2) {
    if (parent !== null) {
      push_effect(effect2, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.effects ?? (derived2.effects = [])).push(effect2);
    }
  }
  return effect2;
}
function teardown(fn) {
  const effect2 = create_effect(RENDER_EFFECT, null, false);
  set_signal_status(effect2, CLEAN);
  effect2.teardown = fn;
  return effect2;
}
function user_effect(fn) {
  validate_effect();
  var flags = (
    /** @type {Effect} */
    active_effect.f
  );
  var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & EFFECT_RAN) === 0;
  if (defer) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    (context.e ?? (context.e = [])).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn, false);
}
function user_pre_effect(fn) {
  validate_effect();
  return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
}
function component_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT, fn, true);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect2, () => {
          destroy_effect(effect2);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect2);
        fulfil(void 0);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function legacy_pre_effect(deps, fn) {
  var context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  var token = { effect: null, ran: false, deps };
  context.l.$.push(token);
  token.effect = render_effect(() => {
    deps();
    if (token.ran) return;
    token.ran = true;
    untrack(fn);
  });
}
function legacy_pre_effect_reset() {
  var context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  render_effect(() => {
    for (var token of context.l.$) {
      token.deps();
      var effect2 = token.effect;
      if ((effect2.f & CLEAN) !== 0) {
        set_signal_status(effect2, MAYBE_DIRTY);
      }
      if (is_dirty(effect2)) {
        update_effect(effect2);
      }
      token.ran = false;
    }
  });
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
}
function render_effect(fn, flags = 0) {
  return create_effect(RENDER_EFFECT | flags, fn, true);
}
function template_effect(fn, sync = [], async = []) {
  flatten(sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get$2)), true);
  });
}
function block$1(fn, flags = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags, fn, true);
  return effect2;
}
function branch(fn, push2 = true) {
  return create_effect(BRANCH_EFFECT, fn, true, push2);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var _a2;
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    (_a2 = effect2.ac) == null ? void 0 : _a2.abort(STALE_REACTION);
    var next = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null && effect2.nodes_end !== null) {
    remove_effect_dom(
      effect2.nodes_start,
      /** @type {TemplateNode} */
      effect2.nodes_end
    );
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.transitions;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = effect2.ac = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next = node === end ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node)
    );
    node.remove();
    node = next;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next = effect2.next;
  if (prev !== null) prev.next = next;
  if (next !== null) next.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next;
    if (parent.last === effect2) parent.last = prev;
  }
}
function pause_effect(effect2, callback) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  run_out_transitions(transitions, () => {
    destroy_effect(effect2);
    if (callback) callback();
  });
}
function run_out_transitions(transitions, fn) {
  var remaining = transitions.length;
  if (remaining > 0) {
    var check2 = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check2);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0) return;
  effect2.f ^= INERT;
  if (effect2.transitions !== null) {
    for (const transition of effect2.transitions) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    pause_children(child2, transitions, transparent ? local : false);
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0) return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    schedule_effect(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  if (effect2.transitions !== null) {
    for (const transition of effect2.transitions) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
let captured_signals = null;
function capture_signals(fn) {
  var previous_captured_signals = captured_signals;
  try {
    captured_signals = /* @__PURE__ */ new Set();
    untrack(fn);
    if (previous_captured_signals !== null) {
      for (var signal of captured_signals) {
        previous_captured_signals.add(signal);
      }
    }
    return captured_signals;
  } finally {
    captured_signals = previous_captured_signals;
  }
}
function invalidate_inner_signals(fn) {
  for (var signal of capture_signals(fn)) {
    internal_set(signal, signal.v);
  }
}
let is_updating_effect = false;
function set_is_updating_effect(value) {
  is_updating_effect = value;
}
let is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
let active_reaction = null;
let untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
let active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
let current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && true) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
let new_deps = null;
let skipped_deps = 0;
let untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
let write_version = 1;
let read_version = 0;
let update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
let skip_reaction = false;
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var _a2;
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var is_unowned = (flags & UNOWNED) !== 0;
    if (dependencies !== null) {
      var i;
      var dependency;
      var is_disconnected = (flags & DISCONNECTED) !== 0;
      var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
      var length = dependencies.length;
      if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        var parent = derived2.parent;
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (is_disconnected || !((_a2 = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _a2.includes(derived2))) {
            (dependency.reactions ?? (dependency.reactions = [])).push(derived2);
          }
        }
        if (is_disconnected) {
          derived2.f ^= DISCONNECTED;
        }
        if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
          derived2.f ^= UNOWNED;
        }
      }
      for (i = 0; i < length; i++) {
        dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
    }
    if (!is_unowned || active_effect !== null && !skip_reaction) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (current_sources == null ? void 0 : current_sources.includes(signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect2,
        false
      );
    } else if (effect2 === reaction) {
      if (root2) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function update_reaction(reaction) {
  var _a2;
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_skip_reaction = skip_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
  active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    reaction.ac.abort(STALE_REACTION);
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var result = (
      /** @type {Function} */
      (0, reaction.fn)()
    );
    var deps = reaction.deps;
    if (new_deps !== null) {
      var i;
      remove_reactions(reaction, skipped_deps);
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (!skip_reaction || // Deriveds that already have reactions can cleanup, so we still add them as reactions
      (flags & DERIVED) !== 0 && /** @type {import('#client').Derived} */
      reaction.reactions !== null) {
        for (i = skipped_deps; i < deps.length; i++) {
          ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    skip_reaction = previous_skip_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index2 = index_of.call(reactions, signal);
    if (index2 !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index2] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !new_deps.includes(dependency))) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
      dependency.f ^= DISCONNECTED;
    }
    destroy_derived_effects(
      /** @type {Derived} **/
      dependency
    );
    remove_reactions(
      /** @type {Derived} **/
      dependency,
      0
    );
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags = effect2.f;
  if ((flags & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  try {
    if ((flags & BLOCK_EFFECT) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    var dep;
    if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
  }
}
async function tick() {
  await Promise.resolve();
  flushSync();
}
function get$2(signal) {
  var flags = signal.f;
  var is_derived = (flags & DERIVED) !== 0;
  captured_signals == null ? void 0 : captured_signals.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && !(current_sources == null ? void 0 : current_sources.includes(signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ?? (active_reaction.deps = [])).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!reactions.includes(active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  } else if (is_derived && /** @type {Derived} */
  signal.deps === null && /** @type {Derived} */
  signal.effects === null) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    var parent = derived2.parent;
    if (parent !== null && (parent.f & UNOWNED) === 0) {
      derived2.f ^= UNOWNED;
    }
  }
  if (is_destroying_effect) {
    if (old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
  } else if (is_derived) {
    derived2 = /** @type {Derived} */
    signal;
    if (batch_deriveds == null ? void 0 : batch_deriveds.has(derived2)) {
      return batch_deriveds.get(derived2);
    }
    if (is_dirty(derived2)) {
      update_derived(derived2);
    }
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED) return true;
  if (derived2.deps === null) return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
const STATUS_MASK = -7169;
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key in value) {
      const prop2 = value[key];
      if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
        deep_read(prop2);
      }
    }
  }
}
function deep_read(value, visited = /* @__PURE__ */ new Set()) {
  if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
  !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key in value) {
      try {
        deep_read(value[key], visited);
      } catch (e) {
      }
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key in descriptors) {
        const get2 = descriptors[key].get;
        if (get2) {
          try {
            get2.call(value);
          } catch (e) {
          }
        }
      }
    }
  }
}
const PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
let listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener(
      "reset",
      (evt) => {
        Promise.resolve().then(() => {
          var _a2;
          if (!evt.defaultPrevented) {
            for (
              const e of
              /**@type {HTMLFormElement} */
              evt.target.elements
            ) {
              (_a2 = e.__on_r) == null ? void 0 : _a2.call(e);
            }
          }
        });
      },
      // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
      { capture: true }
    );
  }
}
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
  element.addEventListener(event2, () => without_reactive_context(handler));
  const prev = element.__on_r;
  if (prev) {
    element.__on_r = () => {
      prev();
      on_reset(true);
    };
  } else {
    element.__on_r = () => on_reset(true);
  }
  add_form_reset_listener();
}
const all_registered_events = /* @__PURE__ */ new Set();
const root_event_handles = /* @__PURE__ */ new Set();
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event2) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event2);
    }
    if (!event2.cancelBubble) {
      return without_reactive_context(() => {
        return handler == null ? void 0 : handler.call(this, event2);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function event(event_name, dom, handler, capture2, passive) {
  var options = { capture: capture2, passive };
  var target_handler = create_event(event_name, dom, handler, options);
  if (dom === document.body || // @ts-ignore
  dom === window || // @ts-ignore
  dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  dom instanceof HTMLMediaElement) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
let last_propagated_event = null;
function handle_event_propagation(event2) {
  var _a2;
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event2.type;
  var path = ((_a2 = event2.composedPath) == null ? void 0 : _a2.call(event2)) || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event2.target
  );
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event2.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event2.target;
  if (current_target === handler_element) return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event2.target === current_target)) {
          if (is_array(delegated)) {
            var [fn, ...data] = delegated;
            fn.apply(current_target, [event2, ...data]);
          } else {
            delegated.call(current_target, event2);
          }
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2.__root = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function create_fragment_from_html(html) {
  var elem = document.createElement("template");
  elem.innerHTML = html.replaceAll("<!>", "<!---->");
  return elem.content;
}
function assign_nodes(start2, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes_start === null) {
    effect2.nodes_start = start2;
    effect2.nodes_end = end;
  }
}
// @__NO_SIDE_EFFECTS__
function from_html(content, flags) {
  var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = /** @type {Node} */
      /* @__PURE__ */ get_first_child(node);
    }
    var clone = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start2 = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(clone)
      );
      var end = (
        /** @type {TemplateNode} */
        clone.lastChild
      );
      assign_nodes(start2, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function text(value = "") {
  {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
}
function comment() {
  var frag = document.createDocumentFragment();
  var start2 = document.createComment("");
  var anchor = create_text();
  frag.append(start2, anchor);
  assign_nodes(start2, anchor);
  return frag;
}
function append(anchor, dom) {
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? value + "" : value;
  if (str !== (text2.__t ?? (text2.__t = text2.nodeValue))) {
    text2.__t = str;
    text2.nodeValue = str + "";
  }
}
function mount(component2, options) {
  return _mount(component2, options);
}
const document_listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target: target2, anchor, props = {}, events, context, intro = true }) {
  init_operations();
  var registered_events = /* @__PURE__ */ new Set();
  var event_handle = (events2) => {
    for (var i = 0; i < events2.length; i++) {
      var event_name = events2[i];
      if (registered_events.has(event_name)) continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      target2.addEventListener(event_name, handle_event_propagation, { passive });
      var n = document_listeners.get(event_name);
      if (n === void 0) {
        document.addEventListener(event_name, handle_event_propagation, { passive });
        document_listeners.set(event_name, 1);
      } else {
        document_listeners.set(event_name, n + 1);
      }
    }
  };
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  var component2 = void 0;
  var unmount = component_root(() => {
    var anchor_node = anchor ?? target2.appendChild(create_text());
    branch(() => {
      if (context) {
        push({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        ctx.c = context;
      }
      if (events) {
        props.$$events = events;
      }
      component2 = Component(anchor_node, props) || {};
      if (context) {
        pop();
      }
    });
    return () => {
      var _a2;
      for (var event_name of registered_events) {
        target2.removeEventListener(event_name, handle_event_propagation);
        var n = (
          /** @type {number} */
          document_listeners.get(event_name)
        );
        if (--n === 0) {
          document.removeEventListener(event_name, handle_event_propagation);
          document_listeners.delete(event_name);
        } else {
          document_listeners.set(event_name, n);
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component2, unmount);
  return component2;
}
let mounted_components = /* @__PURE__ */ new WeakMap();
function if_block(node, fn, elseif = false) {
  var anchor = node;
  var consequent_effect = null;
  var alternate_effect = null;
  var condition = UNINITIALIZED;
  var flags = elseif ? EFFECT_TRANSPARENT : 0;
  var has_branch = false;
  const set_branch = (fn2, flag = true) => {
    has_branch = true;
    update_branch(flag, fn2);
  };
  var offscreen_fragment = null;
  function commit() {
    if (offscreen_fragment !== null) {
      offscreen_fragment.lastChild.remove();
      anchor.before(offscreen_fragment);
      offscreen_fragment = null;
    }
    var active = condition ? consequent_effect : alternate_effect;
    var inactive = condition ? alternate_effect : consequent_effect;
    if (active) {
      resume_effect(active);
    }
    if (inactive) {
      pause_effect(inactive, () => {
        if (condition) {
          alternate_effect = null;
        } else {
          consequent_effect = null;
        }
      });
    }
  }
  const update_branch = (new_condition, fn2) => {
    if (condition === (condition = new_condition)) return;
    var defer = should_defer_append();
    var target2 = anchor;
    if (defer) {
      offscreen_fragment = document.createDocumentFragment();
      offscreen_fragment.append(target2 = create_text());
    }
    if (condition) {
      consequent_effect ?? (consequent_effect = fn2 && branch(() => fn2(target2)));
    } else {
      alternate_effect ?? (alternate_effect = fn2 && branch(() => fn2(target2)));
    }
    if (defer) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var active = condition ? consequent_effect : alternate_effect;
      var inactive = condition ? alternate_effect : consequent_effect;
      if (active) batch.skipped_effects.delete(active);
      if (inactive) batch.skipped_effects.add(inactive);
      batch.add_callback(commit);
    } else {
      commit();
    }
  };
  block$1(() => {
    has_branch = false;
    fn(set_branch);
    if (!has_branch) {
      update_branch(null, null);
    }
  }, flags);
}
function index(_, i) {
  return i;
}
function pause_effects(state2, items, controlled_anchor) {
  var items_map = state2.items;
  var transitions = [];
  var length = items.length;
  for (var i = 0; i < length; i++) {
    pause_children(items[i].e, transitions, true);
  }
  var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      /** @type {Element} */
      controlled_anchor.parentNode
    );
    clear_text_content(parent_node);
    parent_node.append(
      /** @type {Element} */
      controlled_anchor
    );
    items_map.clear();
    link(state2, items[0].prev, items[length - 1].next);
  }
  run_out_transitions(transitions, () => {
    for (var i2 = 0; i2 < length; i2++) {
      var item = items[i2];
      if (!is_controlled) {
        items_map.delete(item.k);
        link(state2, item.prev, item.next);
      }
      destroy_effect(item.e, !is_controlled);
    }
  });
}
function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
  var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    anchor = parent_node.appendChild(create_text());
  }
  var fallback = null;
  var was_empty = false;
  var offscreen_items = /* @__PURE__ */ new Map();
  var each_array = /* @__PURE__ */ derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  var array2;
  var each_effect;
  function commit() {
    reconcile(
      each_effect,
      array2,
      state2,
      offscreen_items,
      anchor,
      render_fn,
      flags,
      get_key,
      get_collection
    );
    if (fallback_fn !== null) {
      if (array2.length === 0) {
        if (fallback) {
          resume_effect(fallback);
        } else {
          fallback = branch(() => fallback_fn(anchor));
        }
      } else if (fallback !== null) {
        pause_effect(fallback, () => {
          fallback = null;
        });
      }
    }
  }
  block$1(() => {
    each_effect ?? (each_effect = /** @type {Effect} */
    active_effect);
    array2 = get$2(each_array);
    var length = array2.length;
    if (was_empty && length === 0) {
      return;
    }
    was_empty = length === 0;
    var item, i, value, key;
    {
      if (should_defer_append()) {
        var keys = /* @__PURE__ */ new Set();
        var batch = (
          /** @type {Batch} */
          current_batch
        );
        for (i = 0; i < length; i += 1) {
          value = array2[i];
          key = get_key(value, i);
          var existing = state2.items.get(key) ?? offscreen_items.get(key);
          if (existing) {
            if ((flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0) {
              update_item(existing, value, i, flags);
            }
          } else {
            item = create_item(
              null,
              state2,
              null,
              null,
              value,
              key,
              i,
              render_fn,
              flags,
              get_collection,
              true
            );
            offscreen_items.set(key, item);
          }
          keys.add(key);
        }
        for (const [key2, item2] of state2.items) {
          if (!keys.has(key2)) {
            batch.skipped_effects.add(item2.e);
          }
        }
        batch.add_callback(commit);
      } else {
        commit();
      }
    }
    get$2(each_array);
  });
}
function reconcile(each_effect, array2, state2, offscreen_items, anchor, render_fn, flags, get_key, get_collection) {
  var _a2, _b, _c, _d;
  var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
  var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
  var length = array2.length;
  var items = state2.items;
  var first = state2.first;
  var current = first;
  var seen2;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key;
  var item;
  var i;
  if (is_animated) {
    for (i = 0; i < length; i += 1) {
      value = array2[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item !== void 0) {
        (_a2 = item.a) == null ? void 0 : _a2.measure();
        (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(item);
      }
    }
  }
  for (i = 0; i < length; i += 1) {
    value = array2[i];
    key = get_key(value, i);
    item = items.get(key);
    if (item === void 0) {
      var pending2 = offscreen_items.get(key);
      if (pending2 !== void 0) {
        offscreen_items.delete(key);
        items.set(key, pending2);
        var next = prev ? prev.next : current;
        link(state2, prev, pending2);
        link(state2, pending2, next);
        move(pending2, next, anchor);
        prev = pending2;
      } else {
        var child_anchor = current ? (
          /** @type {TemplateNode} */
          current.e.nodes_start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state2,
          prev,
          prev === null ? state2.first : prev.next,
          value,
          key,
          i,
          render_fn,
          flags,
          get_collection
        );
      }
      items.set(key, prev);
      matched = [];
      stashed = [];
      current = prev.next;
      continue;
    }
    if (should_update) {
      update_item(item, value, i, flags);
    }
    if ((item.e.f & INERT) !== 0) {
      resume_effect(item.e);
      if (is_animated) {
        (_b = item.a) == null ? void 0 : _b.unfix();
        (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).delete(item);
      }
    }
    if (item !== current) {
      if (seen2 !== void 0 && seen2.has(item)) {
        if (matched.length < stashed.length) {
          var start2 = stashed[0];
          var j;
          prev = start2.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0; j < matched.length; j += 1) {
            move(matched[j], start2, anchor);
          }
          for (j = 0; j < stashed.length; j += 1) {
            seen2.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start2);
          current = start2;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen2.delete(item);
          move(item, current, anchor);
          link(state2, item.prev, item.next);
          link(state2, item, prev === null ? state2.first : prev.next);
          link(state2, prev, item);
          prev = item;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current.k !== key) {
        if ((current.e.f & INERT) === 0) {
          (seen2 ?? (seen2 = /* @__PURE__ */ new Set())).add(current);
        }
        stashed.push(current);
        current = current.next;
      }
      if (current === null) {
        continue;
      }
      item = current;
    }
    matched.push(item);
    prev = item;
    current = item.next;
  }
  if (current !== null || seen2 !== void 0) {
    var to_destroy = seen2 === void 0 ? [] : array_from(seen2);
    while (current !== null) {
      if ((current.e.f & INERT) === 0) {
        to_destroy.push(current);
      }
      current = current.next;
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          (_c = to_destroy[i].a) == null ? void 0 : _c.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          (_d = to_destroy[i].a) == null ? void 0 : _d.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      var _a3;
      if (to_animate === void 0) return;
      for (item of to_animate) {
        (_a3 = item.a) == null ? void 0 : _a3.apply();
      }
    });
  }
  each_effect.first = state2.first && state2.first.e;
  each_effect.last = prev && prev.e;
  for (var unused of offscreen_items.values()) {
    destroy_effect(unused.e);
  }
  offscreen_items.clear();
}
function update_item(item, value, index2, type) {
  if ((type & EACH_ITEM_REACTIVE) !== 0) {
    internal_set(item.v, value);
  }
  if ((type & EACH_INDEX_REACTIVE) !== 0) {
    internal_set(
      /** @type {Value<number>} */
      item.i,
      index2
    );
  } else {
    item.i = index2;
  }
}
function create_item(anchor, state2, prev, next, value, key, index2, render_fn, flags, get_collection, deferred2) {
  var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
  var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
  var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : value;
  var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
  var item = {
    i,
    v,
    k: key,
    a: null,
    // @ts-expect-error
    e: null,
    prev,
    next
  };
  try {
    if (anchor === null) {
      var fragment = document.createDocumentFragment();
      fragment.append(anchor = create_text());
    }
    item.e = branch(() => render_fn(
      /** @type {Node} */
      anchor,
      v,
      i,
      get_collection
    ), hydrating);
    item.e.prev = prev && prev.e;
    item.e.next = next && next.e;
    if (prev === null) {
      if (!deferred2) {
        state2.first = item;
      }
    } else {
      prev.next = item;
      prev.e.next = item.e;
    }
    if (next !== null) {
      next.prev = item;
      next.e.prev = item.e;
    }
    return item;
  } finally {
  }
}
function move(item, next, anchor) {
  var end = item.next ? (
    /** @type {TemplateNode} */
    item.next.e.nodes_start
  ) : anchor;
  var dest = next ? (
    /** @type {TemplateNode} */
    next.e.nodes_start
  ) : anchor;
  var node = (
    /** @type {TemplateNode} */
    item.e.nodes_start
  );
  while (node !== null && node !== end) {
    var next_node = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node)
    );
    dest.before(node);
    node = next_node;
  }
}
function link(state2, prev, next) {
  if (prev === null) {
    state2.first = next;
  } else {
    prev.next = next;
    prev.e.next = next && next.e;
  }
  if (next !== null) {
    next.prev = prev;
    next.e.prev = prev && prev.e;
  }
}
function component(node, get_component, render_fn) {
  var anchor = node;
  var component2;
  var effect2;
  var offscreen_fragment = null;
  var pending_effect = null;
  function commit() {
    if (effect2) {
      pause_effect(effect2);
      effect2 = null;
    }
    if (offscreen_fragment) {
      offscreen_fragment.lastChild.remove();
      anchor.before(offscreen_fragment);
      offscreen_fragment = null;
    }
    effect2 = pending_effect;
    pending_effect = null;
  }
  block$1(() => {
    if (component2 === (component2 = get_component())) return;
    var defer = should_defer_append();
    if (component2) {
      var target2 = anchor;
      if (defer) {
        offscreen_fragment = document.createDocumentFragment();
        offscreen_fragment.append(target2 = create_text());
      }
      pending_effect = branch(() => render_fn(target2, component2));
    }
    if (defer) {
      current_batch.add_callback(commit);
    } else {
      commit();
    }
  }, EFFECT_TRANSPARENT);
}
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx$1() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  if (directives) {
    for (var key in directives) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function to_style(value, styles) {
  return value == null ? null : String(value);
}
function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
  var prev = dom.__className;
  if (prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash, next_classes);
    {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else {
        dom.className = next_class_name;
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (prev !== value) {
    var next_style_attr = to_style(value);
    {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  }
  return next_styles;
}
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == void 0) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is$1(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    // Listen to option element changes
    childList: true,
    subtree: true,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function bind_select_value(select, get2, set2 = get2) {
  var mounting = true;
  listen_to_event_and_reset_event(select, "change", (is_reset) => {
    var query = is_reset ? "[selected]" : ":checked";
    var value;
    if (select.multiple) {
      value = [].map.call(select.querySelectorAll(query), get_option_value);
    } else {
      var selected_option = select.querySelector(query) ?? // will fall back to first non-disabled option if no option is selected
      select.querySelector("option:not([disabled])");
      value = selected_option && get_option_value(selected_option);
    }
    set2(value);
  });
  effect(() => {
    var value = get2();
    select_option(select, value, mounting);
    if (mounting && value === void 0) {
      var selected_option = select.querySelector(":checked");
      if (selected_option !== null) {
        value = get_option_value(selected_option);
        set2(value);
      }
    }
    select.__value = value;
    mounting = false;
  });
  init_select(select);
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}
function bind_value(input, get2, set2 = get2) {
  var runes = is_runes();
  var batches2 = /* @__PURE__ */ new WeakSet();
  listen_to_event_and_reset_event(input, "input", (is_reset) => {
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
    if (runes && value !== (value = get2())) {
      var start2 = input.selectionStart;
      var end = input.selectionEnd;
      input.value = value ?? "";
      if (end !== null) {
        input.selectionStart = start2;
        input.selectionEnd = Math.min(end, input.value.length);
      }
    }
  });
  if (
    // If we are hydrating and the value has since changed,
    // then use the updated value from the input instead.
    // If defaultValue is set, then value == defaultValue
    // TODO Svelte 6: remove input.value check and set to empty string?
    untrack(get2) == null && input.value
  ) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
  }
  render_effect(() => {
    var value = get2();
    if (input === document.activeElement) {
      var batch = (
        /** @type {Batch} */
        previous_batch ?? current_batch
      );
      if (batches2.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
const pending = /* @__PURE__ */ new Set();
function bind_group(inputs, group_index, input, get2, set2 = get2) {
  var is_checkbox = input.getAttribute("type") === "checkbox";
  var binding_group = inputs;
  if (group_index !== null) {
    for (var index2 of group_index) {
      binding_group = binding_group[index2] ?? (binding_group[index2] = []);
    }
  }
  binding_group.push(input);
  listen_to_event_and_reset_event(
    input,
    "change",
    () => {
      var value = input.__value;
      if (is_checkbox) {
        value = get_binding_group_value(binding_group, value, input.checked);
      }
      set2(value);
    },
    // TODO better default value handling
    () => set2(is_checkbox ? [] : null)
  );
  render_effect(() => {
    var value = get2();
    if (is_checkbox) {
      value = value || [];
      input.checked = value.includes(input.__value);
    } else {
      input.checked = is$1(input.__value, value);
    }
  });
  teardown(() => {
    var index3 = binding_group.indexOf(input);
    if (index3 !== -1) {
      binding_group.splice(index3, 1);
    }
  });
  if (!pending.has(binding_group)) {
    pending.add(binding_group);
    queue_micro_task(() => {
      binding_group.sort((a, b) => a.compareDocumentPosition(b) === 4 ? -1 : 1);
      pending.delete(binding_group);
    });
  }
  queue_micro_task(() => {
  });
}
function get_binding_group_value(group, __value, checked) {
  var value = /* @__PURE__ */ new Set();
  for (var i = 0; i < group.length; i += 1) {
    if (group[i].checked) {
      value.add(group[i].__value);
    }
  }
  if (!checked) {
    value.delete(__value);
  }
  return Array.from(value);
}
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
function init(immutable = false) {
  const context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  const callbacks = context.l.u;
  if (!callbacks) return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = (
      /** @type {Record<string, any>} */
      {}
    );
    const d = /* @__PURE__ */ derived$1(() => {
      let changed = false;
      const props2 = context.s;
      for (const key in props2) {
        if (props2[key] !== prev[key]) {
          prev[key] = props2[key];
          changed = true;
        }
      }
      if (changed) version++;
      return version;
    });
    props = () => get$2(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s) get$2(signal);
  }
  props();
}
function subscribe_to_store(store5, run2, invalidate) {
  if (store5 == null) {
    run2(void 0);
    if (invalidate) invalidate(void 0);
    return noop;
  }
  const unsub = untrack(
    () => store5.subscribe(
      run2,
      // @ts-expect-error
      invalidate
    )
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const subscriber_queue = [];
function readable(value, start2) {
  return {
    subscribe: writable(value, start2).subscribe
  };
}
function writable(value, start2 = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set2, update2) || noop;
    }
    run2(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update: update2, subscribe };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set2, update2) => {
    let started = false;
    const values = [];
    let pending2 = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending2) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set2, update2);
      if (auto) {
        set2(result);
      } else {
        cleanup = typeof result === "function" ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store5, i) => subscribe_to_store(
        store5,
        (value) => {
          values[i] = value;
          pending2 &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending2 |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
function get$1(store5) {
  let value;
  subscribe_to_store(store5, (_) => value = _)();
  return value;
}
let is_store_binding = false;
let IS_UNMOUNTED = Symbol();
function store_get(store5, store_name, stores) {
  const entry = stores[store_name] ?? (stores[store_name] = {
    store: null,
    source: /* @__PURE__ */ mutable_source(void 0),
    unsubscribe: noop
  });
  if (entry.store !== store5 && !(IS_UNMOUNTED in stores)) {
    entry.unsubscribe();
    entry.store = store5 ?? null;
    if (store5 == null) {
      entry.source.v = void 0;
      entry.unsubscribe = noop;
    } else {
      var is_synchronous_callback = true;
      entry.unsubscribe = subscribe_to_store(store5, (v) => {
        if (is_synchronous_callback) {
          entry.source.v = v;
        } else {
          set(entry.source, v);
        }
      });
      is_synchronous_callback = false;
    }
  }
  if (store5 && IS_UNMOUNTED in stores) {
    return get$1(store5);
  }
  return get$2(entry.source);
}
function store_set(store5, value) {
  store5.set(value);
  return value;
}
function setup_stores() {
  const stores = {};
  function cleanup() {
    teardown(() => {
      for (var store_name in stores) {
        const ref = stores[store_name];
        ref.unsubscribe();
      }
      define_property(stores, IS_UNMOUNTED, {
        enumerable: false,
        value: true
      });
    });
  }
  return [stores, cleanup];
}
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}
const spread_props_handler = {
  get(target2, key) {
    let i = target2.props.length;
    while (i--) {
      let p = target2.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key in p) return p[key];
    }
  },
  set(target2, key, value) {
    let i = target2.props.length;
    while (i--) {
      let p = target2.props[i];
      if (is_function(p)) p = p();
      const desc = get_descriptor(p, key);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target2, key) {
    let i = target2.props.length;
    while (i--) {
      let p = target2.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key in p) {
        const descriptor = get_descriptor(p, key);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target2, key) {
    if (key === STATE_SYMBOL || key === LEGACY_PROPS) return false;
    for (let p of target2.props) {
      if (is_function(p)) p = p();
      if (p != null && key in p) return true;
    }
    return false;
  },
  ownKeys(target2) {
    const keys = [];
    for (let p of target2.props) {
      if (is_function(p)) p = p();
      if (!p) continue;
      for (const key in p) {
        if (!keys.includes(key)) keys.push(key);
      }
      for (const key of Object.getOwnPropertySymbols(p)) {
        if (!keys.includes(key)) keys.push(key);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key, flags, fallback) {
  var _a2;
  var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
  var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
  var lazy2 = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = (
    /** @type {V} */
    fallback
  );
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy2 ? untrack(
        /** @type {() => V} */
        fallback
      ) : (
        /** @type {V} */
        fallback
      );
    }
    return fallback_value;
  };
  var setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = ((_a2 = get_descriptor(props, key)) == null ? void 0 : _a2.set) ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key];
  }
  if (initial_value === void 0 && fallback !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      if (runes) props_invalid_value();
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key]
      );
      if (value === void 0) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key]
      );
      if (value !== void 0) {
        fallback_value = /** @type {V} */
        void 0;
      }
      return value === void 0 ? fallback_value : value;
    };
  }
  if (runes && (flags & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return function(value, mutation) {
      if (arguments.length > 0) {
        if (!runes || !mutation || legacy_parent || is_store_sub) {
          setter(mutation ? getter() : value);
        }
        return value;
      }
      return getter();
    };
  }
  var overridden = false;
  var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived$1 : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (bindable) get$2(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return function(value, mutation) {
    if (arguments.length > 0) {
      const new_value = mutation ? get$2(d) : runes && bindable ? proxy(value) : value;
      set(d, new_value);
      overridden = true;
      if (fallback_value !== void 0) {
        fallback_value = new_value;
      }
      return value;
    }
    if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
      return d.v;
    }
    return get$2(d);
  };
}
function onMount(fn) {
  if (component_context === null) {
    lifecycle_outside_component();
  }
  if (legacy_mode_flag && component_context.l !== null) {
    init_update_callbacks(component_context).m.push(fn);
  } else {
    user_effect(() => {
      const cleanup = untrack(fn);
      if (typeof cleanup === "function") return (
        /** @type {() => void} */
        cleanup
      );
    });
  }
}
function onDestroy(fn) {
  if (component_context === null) {
    lifecycle_outside_component();
  }
  onMount(() => () => untrack(fn));
}
function create_custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function createEventDispatcher() {
  const active_component_context = component_context;
  if (active_component_context === null) {
    lifecycle_outside_component();
  }
  return (type, detail, options) => {
    var _a2;
    const events = (
      /** @type {Record<string, Function | Function[]>} */
      (_a2 = active_component_context.s.$$events) == null ? void 0 : _a2[
        /** @type {any} */
        type
      ]
    );
    if (events) {
      const callbacks = is_array(events) ? events.slice() : [events];
      const event2 = create_custom_event(
        /** @type {string} */
        type,
        detail,
        options
      );
      for (const fn of callbacks) {
        fn.call(active_component_context.x, event2);
      }
      return !event2.defaultPrevented;
    }
    return true;
  };
}
function init_update_callbacks(context) {
  var l = (
    /** @type {ComponentContextLegacy} */
    context.l
  );
  return l.u ?? (l.u = { a: [], b: [], m: [] });
}
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link2 = document.createElement("link");
        link2.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link2.as = "script";
        }
        link2.crossOrigin = "";
        link2.href = dep;
        if (cspNonce) {
          link2.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link2);
        if (isCss) {
          return new Promise((res, rej) => {
            link2.addEventListener("load", res);
            link2.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const PUBLIC_VERSION = "5";
if (typeof window !== "undefined") {
  ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
}
enable_legacy_mode_flag();
function getLocation() {
  const hashPosition = window.location.href.indexOf("#/");
  let location2 = hashPosition > -1 ? window.location.href.substr(hashPosition + 1) : "/";
  const qsPosition = location2.indexOf("?");
  let querystring = "";
  if (qsPosition > -1) {
    querystring = location2.substr(qsPosition + 1);
    location2 = location2.substr(0, qsPosition);
  }
  return { location: location2, querystring };
}
const loc = readable(
  null,
  // eslint-disable-next-line prefer-arrow-callback
  function start(set2) {
    set2(getLocation());
    const update2 = () => {
      set2(getLocation());
    };
    window.addEventListener("hashchange", update2, false);
    return function stop() {
      window.removeEventListener("hashchange", update2, false);
    };
  }
);
const location = derived(loc, (_loc) => _loc.location);
derived(loc, (_loc) => _loc.querystring);
function wrap$1(args) {
  if (!args) {
    throw Error("Parameter args is required");
  }
  if (!args.component == !args.asyncComponent) {
    throw Error("One and only one of component and asyncComponent is required");
  }
  if (args.component) {
    args.asyncComponent = () => Promise.resolve(args.component);
  }
  if (typeof args.asyncComponent != "function") {
    throw Error("Parameter asyncComponent must be a function");
  }
  if (args.conditions) {
    if (!Array.isArray(args.conditions)) {
      args.conditions = [args.conditions];
    }
    for (let i = 0; i < args.conditions.length; i++) {
      if (!args.conditions[i] || typeof args.conditions[i] != "function") {
        throw Error("Invalid parameter conditions[" + i + "]");
      }
    }
  }
  if (args.loadingComponent) {
    args.asyncComponent.loading = args.loadingComponent;
    args.asyncComponent.loadingParams = args.loadingParams || void 0;
  }
  const obj = {
    component: args.asyncComponent,
    userData: args.userData,
    conditions: args.conditions && args.conditions.length ? args.conditions : void 0,
    props: args.props && Object.keys(args.props).length ? args.props : {},
    _sveltesparouter: true
  };
  return obj;
}
const defaultClientConfig = {
  selected: "testnet",
  networks: [
    {
      name: "mainnet",
      node: "https://api.mainnet.iota.cafe",
      indexer: "https://indexer.mainnet.iota.cafe",
      graphql: "https://graphql.mainnet.iota.cafe",
      explorer: "https://explorer.iota.org"
    },
    {
      name: "localnet",
      node: "http://127.0.0.1:9000",
      indexer: "http://127.0.0.1:9124",
      graphql: "http://127.0.0.1:9125",
      explorer: "https://explorer.iota.org",
      faucet: "http://127.0.0.1:9123/gas"
    },
    {
      name: "testnet",
      node: "https://api.testnet.iota.cafe",
      indexer: "https://indexer.testnet.iota.cafe",
      graphql: "https://graphql.testnet.iota.cafe",
      explorer: "https://explorer.iota.org",
      faucet: "https://faucet.testnet.iota.cafe/gas"
    },
    {
      name: "devnet",
      node: "https://api.devnet.iota.cafe",
      indexer: "https://indexer.devnet.iota.cafe",
      graphql: "https://graphql.devnet.iota.cafe",
      explorer: "https://explorer.iota.org",
      faucet: "https://faucet.devnet.iota.cafe/gas"
    },
    {
      name: "alphanet",
      node: "https://api.iota-rebased-alphanet.iota.cafe",
      indexer: "https://indexer.iota-rebased-alphanet.iota.cafe",
      graphql: "https://graphql.iota-rebased-alphanet.iota.cafe",
      explorer: "https://explorer.iota.org",
      faucet: "https://faucet.iota-rebased-alphanet.iota.cafe/gas"
    }
  ]
};
function verifyClientConfig(value) {
  if (typeof value !== "object" || value === null) throw new Error("Config is not an object");
  if (typeof value.selected !== "string") throw new Error("Config.selected is not a string");
  if (!Array.isArray(value.networks)) throw new Error("Config.networks is not an array");
  for (const [i, network] of value.networks.entries()) {
    if (typeof network.name !== "string")
      throw new Error(`Config.networks[${i}].name is not a string`);
    if (typeof network.node !== "string")
      throw new Error(`Config.networks[${i}].node is not a string`);
    if (typeof network.indexer !== "string")
      throw new Error(`Config.networks[${i}].indexer is not a string`);
    if (typeof network.graphql !== "string")
      throw new Error(`Config.networks[${i}].graphql is not a string`);
    if (typeof network.explorer !== "string")
      throw new Error(`Config.networks[${i}].explorer is not a string`);
    if (network.faucet && typeof network.faucet !== "string")
      throw new Error(`Config.networks[${i}].faucet is not a string`);
  }
  return true;
}
function base(ALPHABET2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  const BASE_MAP = new Uint8Array(256);
  for (let j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (let i = 0; i < ALPHABET2.length; i++) {
    const x = ALPHABET2.charAt(i);
    const xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  const BASE = ALPHABET2.length;
  const LEADER = ALPHABET2.charAt(0);
  const FACTOR = Math.log(BASE) / Math.log(256);
  const iFACTOR = Math.log(256) / Math.log(BASE);
  function encode(source2) {
    if (source2 instanceof Uint8Array) ;
    else if (ArrayBuffer.isView(source2)) {
      source2 = new Uint8Array(source2.buffer, source2.byteOffset, source2.byteLength);
    } else if (Array.isArray(source2)) {
      source2 = Uint8Array.from(source2);
    }
    if (!(source2 instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source2.length === 0) {
      return "";
    }
    let zeroes = 0;
    let length = 0;
    let pbegin = 0;
    const pend = source2.length;
    while (pbegin !== pend && source2[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    const b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      let carry = source2[pbegin];
      let i = 0;
      for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i;
      pbegin++;
    }
    let it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    let str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET2.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source2) {
    if (typeof source2 !== "string") {
      throw new TypeError("Expected String");
    }
    if (source2.length === 0) {
      return new Uint8Array();
    }
    let psz = 0;
    let zeroes = 0;
    let length = 0;
    while (source2[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    const size = (source2.length - psz) * FACTOR + 1 >>> 0;
    const b256 = new Uint8Array(size);
    while (psz < source2.length) {
      const charCode = source2.charCodeAt(psz);
      if (charCode > 255) {
        return;
      }
      let carry = BASE_MAP[charCode];
      if (carry === 255) {
        return;
      }
      let i = 0;
      for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i;
      psz++;
    }
    let it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    const vch = new Uint8Array(zeroes + (size - it4));
    let j = zeroes;
    while (it4 !== size) {
      vch[j++] = b256[it4++];
    }
    return vch;
  }
  function decode(string2) {
    const buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error("Non-base" + BASE + " character");
  }
  return {
    encode,
    decodeUnsafe,
    decode
  };
}
var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58$1 = base(ALPHABET);
const toBase58 = (buffer) => base58$1.encode(buffer);
const fromBase58 = (str) => base58$1.decode(str);
const fromB58 = fromBase58;
function fromBase64(base64String2) {
  return Uint8Array.from(atob(base64String2), (char) => char.charCodeAt(0));
}
const CHUNK_SIZE = 8192;
function toBase64(bytes) {
  if (bytes.length < CHUNK_SIZE) {
    return btoa(String.fromCharCode(...bytes));
  }
  let output = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk2 = bytes.slice(i, i + CHUNK_SIZE);
    output += String.fromCharCode(...chunk2);
  }
  return btoa(output);
}
const toB64 = toBase64;
const fromB64 = fromBase64;
function fromHex(hexStr) {
  var _a2;
  const normalized = hexStr.startsWith("0x") ? hexStr.slice(2) : hexStr;
  const padded = normalized.length % 2 === 0 ? normalized : `0${normalized}}`;
  const intArr = ((_a2 = padded.match(/.{2}/g)) == null ? void 0 : _a2.map((byte) => parseInt(byte, 16))) ?? [];
  return Uint8Array.from(intArr);
}
function toHex(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
const toHEX = toHex;
function ulebEncode(num) {
  const arr = [];
  let len = 0;
  if (num === 0) {
    return [0];
  }
  while (num > 0) {
    arr[len] = num & 127;
    if (num >>= 7) {
      arr[len] |= 128;
    }
    len += 1;
  }
  return arr;
}
function ulebDecode(arr) {
  let total = 0;
  let shift = 0;
  let len = 0;
  while (true) {
    const byte = arr[len];
    len += 1;
    total |= (byte & 127) << shift;
    if ((byte & 128) === 0) {
      break;
    }
    shift += 7;
  }
  return {
    value: total,
    length: len
  };
}
class BcsReader {
  /**
   * @param {Uint8Array} data Data to use as a buffer.
   */
  constructor(data) {
    this.bytePosition = 0;
    this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }
  /**
   * Shift current cursor position by `bytes`.
   *
   * @param {Number} bytes Number of bytes to
   * @returns {this} Self for possible chaining.
   */
  shift(bytes) {
    this.bytePosition += bytes;
    return this;
  }
  /**
   * Read U8 value from the buffer and shift cursor by 1.
   * @returns
   */
  read8() {
    const value = this.dataView.getUint8(this.bytePosition);
    this.shift(1);
    return value;
  }
  /**
   * Read U16 value from the buffer and shift cursor by 2.
   * @returns
   */
  read16() {
    const value = this.dataView.getUint16(this.bytePosition, true);
    this.shift(2);
    return value;
  }
  /**
   * Read U32 value from the buffer and shift cursor by 4.
   * @returns
   */
  read32() {
    const value = this.dataView.getUint32(this.bytePosition, true);
    this.shift(4);
    return value;
  }
  /**
   * Read U64 value from the buffer and shift cursor by 8.
   * @returns
   */
  read64() {
    const value1 = this.read32();
    const value2 = this.read32();
    const result = value2.toString(16) + value1.toString(16).padStart(8, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read U128 value from the buffer and shift cursor by 16.
   */
  read128() {
    const value1 = BigInt(this.read64());
    const value2 = BigInt(this.read64());
    const result = value2.toString(16) + value1.toString(16).padStart(16, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read U128 value from the buffer and shift cursor by 32.
   * @returns
   */
  read256() {
    const value1 = BigInt(this.read128());
    const value2 = BigInt(this.read128());
    const result = value2.toString(16) + value1.toString(16).padStart(32, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read `num` number of bytes from the buffer and shift cursor by `num`.
   * @param num Number of bytes to read.
   */
  readBytes(num) {
    const start2 = this.bytePosition + this.dataView.byteOffset;
    const value = new Uint8Array(this.dataView.buffer, start2, num);
    this.shift(num);
    return value;
  }
  /**
   * Read ULEB value - an integer of varying size. Used for enum indexes and
   * vector lengths.
   * @returns {Number} The ULEB value.
   */
  readULEB() {
    const start2 = this.bytePosition + this.dataView.byteOffset;
    const buffer = new Uint8Array(this.dataView.buffer, start2);
    const { value, length } = ulebDecode(buffer);
    this.shift(length);
    return value;
  }
  /**
   * Read a BCS vector: read a length and then apply function `cb` X times
   * where X is the length of the vector, defined as ULEB in BCS bytes.
   * @param cb Callback to process elements of vector.
   * @returns {Array<Any>} Array of the resulting values, returned by callback.
   */
  readVec(cb) {
    const length = this.readULEB();
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(cb(this, i, length));
    }
    return result;
  }
}
function encodeStr(data, encoding) {
  switch (encoding) {
    case "base58":
      return toBase58(data);
    case "base64":
      return toBase64(data);
    case "hex":
      return toHex(data);
    default:
      throw new Error("Unsupported encoding, supported values are: base64, hex");
  }
}
function splitGenericParameters(str, genericSeparators = ["<", ">"]) {
  const [left, right] = genericSeparators;
  const tok = [];
  let word = "";
  let nestedAngleBrackets = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === left) {
      nestedAngleBrackets++;
    }
    if (char === right) {
      nestedAngleBrackets--;
    }
    if (nestedAngleBrackets === 0 && char === ",") {
      tok.push(word.trim());
      word = "";
      continue;
    }
    word += char;
  }
  tok.push(word.trim());
  return tok;
}
class BcsWriter {
  constructor({
    initialSize = 1024,
    maxSize = Infinity,
    allocateSize = 1024
  } = {}) {
    this.bytePosition = 0;
    this.size = initialSize;
    this.maxSize = maxSize;
    this.allocateSize = allocateSize;
    this.dataView = new DataView(new ArrayBuffer(initialSize));
  }
  ensureSizeOrGrow(bytes) {
    const requiredSize = this.bytePosition + bytes;
    if (requiredSize > this.size) {
      const nextSize = Math.min(this.maxSize, this.size + this.allocateSize);
      if (requiredSize > nextSize) {
        throw new Error(
          `SizeLimitExceeded: Attempting to serialize to BCS, but buffer does not have enough size. Allocated size: ${this.size}, Max size: ${this.maxSize}, Required size: ${requiredSize}`
        );
      }
      this.size = nextSize;
      const nextBuffer = new ArrayBuffer(this.size);
      new Uint8Array(nextBuffer).set(new Uint8Array(this.dataView.buffer));
      this.dataView = new DataView(nextBuffer);
    }
  }
  /**
   * Shift current cursor position by `bytes`.
   *
   * @param {Number} bytes Number of bytes to
   * @returns {this} Self for possible chaining.
   */
  shift(bytes) {
    this.bytePosition += bytes;
    return this;
  }
  /**
   * Write a U8 value into a buffer and shift cursor position by 1.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write8(value) {
    this.ensureSizeOrGrow(1);
    this.dataView.setUint8(this.bytePosition, Number(value));
    return this.shift(1);
  }
  /**
   * Write a U16 value into a buffer and shift cursor position by 2.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write16(value) {
    this.ensureSizeOrGrow(2);
    this.dataView.setUint16(this.bytePosition, Number(value), true);
    return this.shift(2);
  }
  /**
   * Write a U32 value into a buffer and shift cursor position by 4.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write32(value) {
    this.ensureSizeOrGrow(4);
    this.dataView.setUint32(this.bytePosition, Number(value), true);
    return this.shift(4);
  }
  /**
   * Write a U64 value into a buffer and shift cursor position by 8.
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write64(value) {
    toLittleEndian(BigInt(value), 8).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a U128 value into a buffer and shift cursor position by 16.
   *
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write128(value) {
    toLittleEndian(BigInt(value), 16).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a U256 value into a buffer and shift cursor position by 16.
   *
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write256(value) {
    toLittleEndian(BigInt(value), 32).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a ULEB value into a buffer and shift cursor position by number of bytes
   * written.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  writeULEB(value) {
    ulebEncode(value).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a vector into a buffer by first writing the vector length and then calling
   * a callback on each passed value.
   *
   * @param {Array<Any>} vector Array of elements to write.
   * @param {WriteVecCb} cb Callback to call on each element of the vector.
   * @returns {this}
   */
  writeVec(vector, cb) {
    this.writeULEB(vector.length);
    Array.from(vector).forEach((el, i) => cb(this, el, i, vector.length));
    return this;
  }
  /**
   * Adds support for iterations over the object.
   * @returns {Uint8Array}
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.bytePosition; i++) {
      yield this.dataView.getUint8(i);
    }
    return this.toBytes();
  }
  /**
   * Get underlying buffer taking only value bytes (in case initial buffer size was bigger).
   * @returns {Uint8Array} Resulting bcs.
   */
  toBytes() {
    return new Uint8Array(this.dataView.buffer.slice(0, this.bytePosition));
  }
  /**
   * Represent data as 'hex' or 'base64'
   * @param encoding Encoding to use: 'base64' or 'hex'
   */
  toString(encoding) {
    return encodeStr(this.toBytes(), encoding);
  }
}
function toLittleEndian(bigint2, size) {
  const result = new Uint8Array(size);
  let i = 0;
  while (bigint2 > 0) {
    result[i] = Number(bigint2 % BigInt(256));
    bigint2 = bigint2 / BigInt(256);
    i += 1;
  }
  return result;
}
var __typeError$4 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$4 = (obj, member, msg) => member.has(obj) || __typeError$4("Cannot " + msg);
var __privateGet$4 = (obj, member, getter) => (__accessCheck$4(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$4 = (obj, member, value) => member.has(obj) ? __typeError$4("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$4 = (obj, member, value, setter) => (__accessCheck$4(obj, member, "write to private field"), member.set(obj, value), value);
var _write, _serialize, _schema, _bytes;
const _BcsType = class _BcsType2 {
  constructor(options) {
    __privateAdd$4(this, _write);
    __privateAdd$4(this, _serialize);
    this.name = options.name;
    this.read = options.read;
    this.serializedSize = options.serializedSize ?? (() => null);
    __privateSet$4(this, _write, options.write);
    __privateSet$4(this, _serialize, options.serialize ?? ((value, options2) => {
      const writer = new BcsWriter({
        initialSize: this.serializedSize(value) ?? void 0,
        ...options2
      });
      __privateGet$4(this, _write).call(this, value, writer);
      return writer.toBytes();
    }));
    this.validate = options.validate ?? (() => {
    });
  }
  write(value, writer) {
    this.validate(value);
    __privateGet$4(this, _write).call(this, value, writer);
  }
  serialize(value, options) {
    this.validate(value);
    return new SerializedBcs(this, __privateGet$4(this, _serialize).call(this, value, options));
  }
  parse(bytes) {
    const reader = new BcsReader(bytes);
    return this.read(reader);
  }
  fromHex(hex) {
    return this.parse(fromHex(hex));
  }
  fromBase58(b64) {
    return this.parse(fromBase58(b64));
  }
  fromBase64(b64) {
    return this.parse(fromBase64(b64));
  }
  transform({
    name,
    input,
    output,
    validate: validate2
  }) {
    return new _BcsType2({
      name: name ?? this.name,
      read: (reader) => output ? output(this.read(reader)) : this.read(reader),
      write: (value, writer) => __privateGet$4(this, _write).call(this, input ? input(value) : value, writer),
      serializedSize: (value) => this.serializedSize(input ? input(value) : value),
      serialize: (value, options) => __privateGet$4(this, _serialize).call(this, input ? input(value) : value, options),
      validate: (value) => {
        validate2 == null ? void 0 : validate2(value);
        this.validate(input ? input(value) : value);
      }
    });
  }
};
_write = /* @__PURE__ */ new WeakMap();
_serialize = /* @__PURE__ */ new WeakMap();
let BcsType = _BcsType;
const SERIALIZED_BCS_BRAND = Symbol.for("@iota/serialized-bcs");
function isSerializedBcs(obj) {
  return !!obj && typeof obj === "object" && obj[SERIALIZED_BCS_BRAND] === true;
}
class SerializedBcs {
  constructor(type, schema) {
    __privateAdd$4(this, _schema);
    __privateAdd$4(this, _bytes);
    __privateSet$4(this, _schema, type);
    __privateSet$4(this, _bytes, schema);
  }
  // Used to brand SerializedBcs so that they can be identified, even between multiple copies
  // of the @iota/bcs package are installed
  get [SERIALIZED_BCS_BRAND]() {
    return true;
  }
  toBytes() {
    return __privateGet$4(this, _bytes);
  }
  toHex() {
    return toHex(__privateGet$4(this, _bytes));
  }
  toBase64() {
    return toBase64(__privateGet$4(this, _bytes));
  }
  toBase58() {
    return toBase58(__privateGet$4(this, _bytes));
  }
  parse() {
    return __privateGet$4(this, _schema).parse(__privateGet$4(this, _bytes));
  }
}
_schema = /* @__PURE__ */ new WeakMap();
_bytes = /* @__PURE__ */ new WeakMap();
function fixedSizeBcsType({
  size,
  ...options
}) {
  return new BcsType({
    ...options,
    serializedSize: () => size
  });
}
function uIntBcsType({
  readMethod,
  writeMethod,
  ...options
}) {
  return fixedSizeBcsType({
    ...options,
    read: (reader) => reader[readMethod](),
    write: (value, writer) => writer[writeMethod](value),
    validate: (value) => {
      var _a2;
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      (_a2 = options.validate) == null ? void 0 : _a2.call(options, value);
    }
  });
}
function bigUIntBcsType({
  readMethod,
  writeMethod,
  ...options
}) {
  return fixedSizeBcsType({
    ...options,
    read: (reader) => reader[readMethod](),
    write: (value, writer) => writer[writeMethod](BigInt(value)),
    validate: (val) => {
      var _a2;
      const value = BigInt(val);
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      (_a2 = options.validate) == null ? void 0 : _a2.call(options, value);
    }
  });
}
function dynamicSizeBcsType({
  serialize,
  ...options
}) {
  const type = new BcsType({
    ...options,
    serialize,
    write: (value, writer) => {
      for (const byte of type.serialize(value).toBytes()) {
        writer.write8(byte);
      }
    }
  });
  return type;
}
function stringLikeBcsType({
  toBytes: toBytes2,
  fromBytes,
  ...options
}) {
  return new BcsType({
    ...options,
    read: (reader) => {
      const length = reader.readULEB();
      const bytes = reader.readBytes(length);
      return fromBytes(bytes);
    },
    write: (hex, writer) => {
      const bytes = toBytes2(hex);
      writer.writeULEB(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        writer.write8(bytes[i]);
      }
    },
    serialize: (value) => {
      const bytes = toBytes2(value);
      const size = ulebEncode(bytes.length);
      const result = new Uint8Array(size.length + bytes.length);
      result.set(size, 0);
      result.set(bytes, size.length);
      return result;
    },
    validate: (value) => {
      var _a2;
      if (typeof value !== "string") {
        throw new TypeError(`Invalid ${options.name} value: ${value}. Expected string`);
      }
      (_a2 = options.validate) == null ? void 0 : _a2.call(options, value);
    }
  });
}
function lazyBcsType(cb) {
  let lazyType = null;
  function getType() {
    if (!lazyType) {
      lazyType = cb();
    }
    return lazyType;
  }
  return new BcsType({
    name: "lazy",
    read: (data) => getType().read(data),
    serializedSize: (value) => getType().serializedSize(value),
    write: (value, writer) => getType().write(value, writer),
    serialize: (value, options) => getType().serialize(value, options).toBytes()
  });
}
const bcs = {
  /**
   * Creates a BcsType that can be used to read and write an 8-bit unsigned integer.
   * @example
   * bcs.u8().serialize(255).toBytes() // Uint8Array [ 255 ]
   */
  u8(options) {
    return uIntBcsType({
      name: "u8",
      readMethod: "read8",
      writeMethod: "write8",
      size: 1,
      maxValue: 2 ** 8 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 16-bit unsigned integer.
   * @example
   * bcs.u16().serialize(65535).toBytes() // Uint8Array [ 255, 255 ]
   */
  u16(options) {
    return uIntBcsType({
      name: "u16",
      readMethod: "read16",
      writeMethod: "write16",
      size: 2,
      maxValue: 2 ** 16 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 32-bit unsigned integer.
   * @example
   * bcs.u32().serialize(4294967295).toBytes() // Uint8Array [ 255, 255, 255, 255 ]
   */
  u32(options) {
    return uIntBcsType({
      name: "u32",
      readMethod: "read32",
      writeMethod: "write32",
      size: 4,
      maxValue: 2 ** 32 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 64-bit unsigned integer.
   * @example
   * bcs.u64().serialize(1).toBytes() // Uint8Array [ 1, 0, 0, 0, 0, 0, 0, 0 ]
   */
  u64(options) {
    return bigUIntBcsType({
      name: "u64",
      readMethod: "read64",
      writeMethod: "write64",
      size: 8,
      maxValue: 2n ** 64n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 128-bit unsigned integer.
   * @example
   * bcs.u128().serialize(1).toBytes() // Uint8Array [ 1, ..., 0 ]
   */
  u128(options) {
    return bigUIntBcsType({
      name: "u128",
      readMethod: "read128",
      writeMethod: "write128",
      size: 16,
      maxValue: 2n ** 128n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 256-bit unsigned integer.
   * @example
   * bcs.u256().serialize(1).toBytes() // Uint8Array [ 1, ..., 0 ]
   */
  u256(options) {
    return bigUIntBcsType({
      name: "u256",
      readMethod: "read256",
      writeMethod: "write256",
      size: 32,
      maxValue: 2n ** 256n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write boolean values.
   * @example
   * bcs.bool().serialize(true).toBytes() // Uint8Array [ 1 ]
   */
  bool(options) {
    return fixedSizeBcsType({
      name: "bool",
      size: 1,
      read: (reader) => reader.read8() === 1,
      write: (value, writer) => writer.write8(value ? 1 : 0),
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (typeof value !== "boolean") {
          throw new TypeError(`Expected boolean, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType that can be used to read and write unsigned LEB encoded integers
   * @example
   *
   */
  uleb128(options) {
    return dynamicSizeBcsType({
      name: "uleb128",
      read: (reader) => reader.readULEB(),
      serialize: (value) => {
        return Uint8Array.from(ulebEncode(value));
      },
      ...options
    });
  },
  /**
   * Creates a BcsType representing a fixed length byte array
   * @param size The number of bytes this types represents
   * @example
   * bcs.bytes(3).serialize(new Uint8Array([1, 2, 3])).toBytes() // Uint8Array [1, 2, 3]
   */
  bytes(size, options) {
    return fixedSizeBcsType({
      name: `bytes[${size}]`,
      size,
      read: (reader) => reader.readBytes(size),
      write: (value, writer) => {
        for (let i = 0; i < size; i++) {
          writer.write8(value[i] ?? 0);
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== size) {
          throw new TypeError(`Expected array of length ${size}, found ${value.length}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a variable length byte array
   *
   * @example
   * bcs.byteVector().serialize([1, 2, 3]).toBytes() // Uint8Array [3, 1, 2, 3]
   */
  byteVector(options) {
    return new BcsType({
      name: `bytesVector`,
      read: (reader) => {
        const length = reader.readULEB();
        return reader.readBytes(length);
      },
      write: (value, writer) => {
        const array2 = new Uint8Array(value);
        writer.writeULEB(array2.length);
        for (let i = 0; i < array2.length; i++) {
          writer.write8(array2[i] ?? 0);
        }
      },
      ...options,
      serializedSize: (value) => {
        const length = "length" in value ? value.length : null;
        return length == null ? null : ulebEncode(length).length + length;
      },
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType that can ser/de string values.  Strings will be UTF-8 encoded
   * @example
   * bcs.string().serialize('a').toBytes() // Uint8Array [ 1, 97 ]
   */
  string(options) {
    return stringLikeBcsType({
      name: "string",
      toBytes: (value) => new TextEncoder().encode(value),
      fromBytes: (bytes) => new TextDecoder().decode(bytes),
      ...options
    });
  },
  /**
   * Creates a BcsType that represents a fixed length array of a given type
   * @param size The number of elements in the array
   * @param type The BcsType of each element in the array
   * @example
   * bcs.fixedArray(3, bcs.u8()).serialize([1, 2, 3]).toBytes() // Uint8Array [ 1, 2, 3 ]
   */
  fixedArray(size, type, options) {
    return new BcsType({
      name: `${type.name}[${size}]`,
      read: (reader) => {
        const result = new Array(size);
        for (let i = 0; i < size; i++) {
          result[i] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        for (const item of value) {
          type.write(item, writer);
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== size) {
          throw new TypeError(`Expected array of length ${size}, found ${value.length}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing an optional value
   * @param type The BcsType of the optional value
   * @example
   * bcs.option(bcs.u8()).serialize(null).toBytes() // Uint8Array [ 0 ]
   * bcs.option(bcs.u8()).serialize(1).toBytes() // Uint8Array [ 1, 1 ]
   */
  option(type) {
    return bcs.enum(`Option<${type.name}>`, {
      None: null,
      Some: type
    }).transform({
      input: (value) => {
        if (value == null) {
          return { None: true };
        }
        return { Some: value };
      },
      output: (value) => {
        if (value.$kind === "Some") {
          return value.Some;
        }
        return null;
      }
    });
  },
  /**
   * Creates a BcsType representing a variable length vector of a given type
   * @param type The BcsType of each element in the vector
   *
   * @example
   * bcs.vector(bcs.u8()).toBytes([1, 2, 3]) // Uint8Array [ 3, 1, 2, 3 ]
   */
  vector(type, options) {
    return new BcsType({
      name: `vector<${type.name}>`,
      read: (reader) => {
        const length = reader.readULEB();
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        writer.writeULEB(value.length);
        for (const item of value) {
          type.write(item, writer);
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a tuple of a given set of types
   * @param types The BcsTypes for each element in the tuple
   *
   * @example
   * const tuple = bcs.tuple([bcs.u8(), bcs.string(), bcs.bool()])
   * tuple.serialize([1, 'a', true]).toBytes() // Uint8Array [ 1, 1, 97, 1 ]
   */
  tuple(types, options) {
    return new BcsType({
      name: `(${types.map((t) => t.name).join(", ")})`,
      serializedSize: (values) => {
        let total = 0;
        for (let i = 0; i < types.length; i++) {
          const size = types[i].serializedSize(values[i]);
          if (size == null) {
            return null;
          }
          total += size;
        }
        return total;
      },
      read: (reader) => {
        const result = [];
        for (const type of types) {
          result.push(type.read(reader));
        }
        return result;
      },
      write: (value, writer) => {
        for (let i = 0; i < types.length; i++) {
          types[i].write(value[i], writer);
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (!Array.isArray(value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== types.length) {
          throw new TypeError(
            `Expected array of length ${types.length}, found ${value.length}`
          );
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a struct of a given set of fields
   * @param name The name of the struct
   * @param fields The fields of the struct. The order of the fields affects how data is serialized and deserialized
   *
   * @example
   * const struct = bcs.struct('MyStruct', {
   *  a: bcs.u8(),
   *  b: bcs.string(),
   * })
   * struct.serialize({ a: 1, b: 'a' }).toBytes() // Uint8Array [ 1, 1, 97 ]
   */
  struct(name, fields, options) {
    const canonicalOrder = Object.entries(fields);
    return new BcsType({
      name,
      serializedSize: (values) => {
        let total = 0;
        for (const [field, type] of canonicalOrder) {
          const size = type.serializedSize(values[field]);
          if (size == null) {
            return null;
          }
          total += size;
        }
        return total;
      },
      read: (reader) => {
        const result = {};
        for (const [field, type] of canonicalOrder) {
          result[field] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        for (const [field, type] of canonicalOrder) {
          type.write(value[field], writer);
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (typeof value !== "object" || value == null) {
          throw new TypeError(`Expected object, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing an enum of a given set of options
   * @param name The name of the enum
   * @param values The values of the enum. The order of the values affects how data is serialized and deserialized.
   * null can be used to represent a variant with no data.
   *
   * @example
   * const enum = bcs.enum('MyEnum', {
   *   A: bcs.u8(),
   *   B: bcs.string(),
   *   C: null,
   * })
   * enum.serialize({ A: 1 }).toBytes() // Uint8Array [ 0, 1 ]
   * enum.serialize({ B: 'a' }).toBytes() // Uint8Array [ 1, 1, 97 ]
   * enum.serialize({ C: true }).toBytes() // Uint8Array [ 2 ]
   */
  enum(name, values, options) {
    const canonicalOrder = Object.entries(values);
    return new BcsType({
      name,
      read: (reader) => {
        const index2 = reader.readULEB();
        const enumEntry = canonicalOrder[index2];
        if (!enumEntry) {
          throw new TypeError(`Unknown value ${index2} for enum ${name}`);
        }
        const [kind, type] = enumEntry;
        return {
          [kind]: (type == null ? void 0 : type.read(reader)) ?? true,
          $kind: kind
        };
      },
      write: (value, writer) => {
        const [name2, val] = Object.entries(value).filter(
          ([name3]) => Object.hasOwn(values, name3)
        )[0];
        for (let i = 0; i < canonicalOrder.length; i++) {
          const [optionName, optionType] = canonicalOrder[i];
          if (optionName === name2) {
            writer.writeULEB(i);
            optionType == null ? void 0 : optionType.write(val, writer);
            return;
          }
        }
      },
      ...options,
      validate: (value) => {
        var _a2;
        (_a2 = options == null ? void 0 : options.validate) == null ? void 0 : _a2.call(options, value);
        if (typeof value !== "object" || value == null) {
          throw new TypeError(`Expected object, found ${typeof value}`);
        }
        const keys = Object.keys(value).filter(
          (k) => value[k] !== void 0 && Object.hasOwn(values, k)
        );
        if (keys.length !== 1) {
          throw new TypeError(
            `Expected object with one key, but found ${keys.length} for type ${name}}`
          );
        }
        const [variant] = keys;
        if (!Object.hasOwn(values, variant)) {
          throw new TypeError(`Invalid enum variant ${variant}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a map of a given key and value type
   * @param keyType The BcsType of the key
   * @param valueType The BcsType of the value
   * @example
   * const map = bcs.map(bcs.u8(), bcs.string())
   * map.serialize(new Map([[2, 'a']])).toBytes() // Uint8Array [ 1, 2, 1, 97 ]
   */
  map(keyType, valueType) {
    return bcs.vector(bcs.tuple([keyType, valueType])).transform({
      name: `Map<${keyType.name}, ${valueType.name}>`,
      input: (value) => {
        return [...value.entries()];
      },
      output: (value) => {
        const result = /* @__PURE__ */ new Map();
        for (const [key, val] of value) {
          result.set(key, val);
        }
        return result;
      }
    });
  },
  /**
   * Creates a BcsType that wraps another BcsType which is lazily evaluated. This is useful for creating recursive types.
   * @param cb A callback that returns the BcsType
   */
  lazy(cb) {
    return lazyBcsType(cb);
  }
};
const TX_DIGEST_LENGTH = 32;
function isValidTransactionDigest(value) {
  try {
    const buffer = fromB58(value);
    return buffer.length === TX_DIGEST_LENGTH;
  } catch (e) {
    return false;
  }
}
const IOTA_ADDRESS_LENGTH = 32;
function isValidIotaAddress(value) {
  return isHex(value) && getHexByteLength(value) === IOTA_ADDRESS_LENGTH;
}
function isValidIotaObjectId(value) {
  return isValidIotaAddress(value);
}
function parseTypeTag(type) {
  if (!type.includes("::")) return type;
  return parseStructTag(type);
}
function parseStructTag(type) {
  const [address, module] = type.split("::");
  const rest = type.slice(address.length + module.length + 4);
  const name = rest.includes("<") ? rest.slice(0, rest.indexOf("<")) : rest;
  const typeParams = rest.includes("<") ? splitGenericParameters(rest.slice(rest.indexOf("<") + 1, rest.lastIndexOf(">"))).map(
    (typeParam) => parseTypeTag(typeParam.trim())
  ) : [];
  return {
    address: normalizeIotaAddress(address),
    module,
    name,
    typeParams
  };
}
function normalizeStructTag(type) {
  const { address, module, name, typeParams } = typeof type === "string" ? parseStructTag(type) : type;
  const formattedTypeParams = (typeParams == null ? void 0 : typeParams.length) > 0 ? `<${typeParams.map(
    (typeParam) => typeof typeParam === "string" ? typeParam : normalizeStructTag(typeParam)
  ).join(",")}>` : "";
  return `${address}::${module}::${name}${formattedTypeParams}`;
}
function normalizeIotaAddress(value, forceAdd0x = false, validate2 = false) {
  let address = value.toLowerCase().replace(/ /g, "");
  if (!forceAdd0x && address.startsWith("0x")) {
    address = address.slice(2);
  }
  address = `0x${address.padStart(IOTA_ADDRESS_LENGTH * 2, "0")}`;
  if (validate2 && !isValidIotaAddress(address)) {
    throw new Error(`Invalid IOTA address: ${value}`);
  } else {
    return address;
  }
}
function normalizeIotaObjectId(value, forceAdd0x = false, validate2 = false) {
  return normalizeIotaAddress(value, forceAdd0x, validate2);
}
function isHex(value) {
  return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
}
function getHexByteLength(value) {
  return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2;
}
const VECTOR_REGEX = /^vector<(.+)>$/;
const STRUCT_REGEX = /^([^:]+)::([^:]+)::([^<]+)(<(.+)>)?/;
class TypeTagSerializer {
  static parseFromStr(str, normalizeAddress = false) {
    if (str === "address") {
      return { address: null };
    } else if (str === "bool") {
      return { bool: null };
    } else if (str === "u8") {
      return { u8: null };
    } else if (str === "u16") {
      return { u16: null };
    } else if (str === "u32") {
      return { u32: null };
    } else if (str === "u64") {
      return { u64: null };
    } else if (str === "u128") {
      return { u128: null };
    } else if (str === "u256") {
      return { u256: null };
    } else if (str === "signer") {
      return { signer: null };
    }
    const vectorMatch = str.match(VECTOR_REGEX);
    if (vectorMatch) {
      return {
        vector: TypeTagSerializer.parseFromStr(vectorMatch[1], normalizeAddress)
      };
    }
    const structMatch = str.match(STRUCT_REGEX);
    if (structMatch) {
      const address = normalizeAddress ? normalizeIotaAddress(structMatch[1]) : structMatch[1];
      return {
        struct: {
          address,
          module: structMatch[2],
          name: structMatch[3],
          typeParams: structMatch[5] === void 0 ? [] : TypeTagSerializer.parseStructTypeArgs(
            structMatch[5],
            normalizeAddress
          )
        }
      };
    }
    throw new Error(`Encountered unexpected token when parsing type args for ${str}`);
  }
  static parseStructTypeArgs(str, normalizeAddress = false) {
    return splitGenericParameters(str).map(
      (tok) => TypeTagSerializer.parseFromStr(tok, normalizeAddress)
    );
  }
  static tagToString(tag) {
    if ("bool" in tag) {
      return "bool";
    }
    if ("u8" in tag) {
      return "u8";
    }
    if ("u16" in tag) {
      return "u16";
    }
    if ("u32" in tag) {
      return "u32";
    }
    if ("u64" in tag) {
      return "u64";
    }
    if ("u128" in tag) {
      return "u128";
    }
    if ("u256" in tag) {
      return "u256";
    }
    if ("address" in tag) {
      return "address";
    }
    if ("signer" in tag) {
      return "signer";
    }
    if ("vector" in tag) {
      return `vector<${TypeTagSerializer.tagToString(tag.vector)}>`;
    }
    if ("struct" in tag) {
      const struct = tag.struct;
      const typeParams = struct.typeParams.map(TypeTagSerializer.tagToString).join(", ");
      return `${struct.address}::${struct.module}::${struct.name}${typeParams ? `<${typeParams}>` : ""}`;
    }
    throw new Error("Invalid TypeTag");
  }
}
function unsafe_u64(options) {
  return bcs.u64({
    name: "unsafe_u64",
    ...options
  }).transform({
    input: (val) => val,
    output: (val) => Number(val)
  });
}
function optionEnum(type) {
  return bcs.enum("Option", {
    None: null,
    Some: type
  });
}
const Address = bcs.bytes(IOTA_ADDRESS_LENGTH).transform({
  validate: (val) => {
    const address = typeof val === "string" ? val : toHex(val);
    if (!address || !isValidIotaAddress(normalizeIotaAddress(address))) {
      throw new Error(`Invalid IOTA address ${address}`);
    }
  },
  input: (val) => typeof val === "string" ? fromHex(normalizeIotaAddress(val)) : val,
  output: (val) => normalizeIotaAddress(toHex(val))
});
const ObjectDigest = bcs.vector(bcs.u8()).transform({
  name: "ObjectDigest",
  input: (value) => fromBase58(value),
  output: (value) => toBase58(new Uint8Array(value)),
  validate: (value) => {
    if (fromBase58(value).length !== 32) {
      throw new Error("ObjectDigest must be 32 bytes");
    }
  }
});
const IotaObjectRef = bcs.struct("IotaObjectRef", {
  objectId: Address,
  version: bcs.u64(),
  digest: ObjectDigest
});
const SharedObjectRef = bcs.struct("SharedObjectRef", {
  objectId: Address,
  initialSharedVersion: bcs.u64(),
  mutable: bcs.bool()
});
const ObjectArg$3 = bcs.enum("ObjectArg", {
  ImmOrOwnedObject: IotaObjectRef,
  SharedObject: SharedObjectRef,
  Receiving: IotaObjectRef
});
const Owner = bcs.enum("Owner", {
  AddressOwner: Address,
  ObjectOwner: Address,
  Shared: bcs.struct("Shared", {
    initialSharedVersion: bcs.u64()
  }),
  Immutable: null
});
const CallArg$2 = bcs.enum("CallArg", {
  Pure: bcs.struct("Pure", {
    bytes: bcs.vector(bcs.u8()).transform({
      input: (val) => typeof val === "string" ? fromBase64(val) : val,
      output: (val) => toBase64(new Uint8Array(val))
    })
  }),
  Object: ObjectArg$3
});
const InnerTypeTag = bcs.enum("TypeTag", {
  bool: null,
  u8: null,
  u64: null,
  u128: null,
  address: null,
  signer: null,
  vector: bcs.lazy(() => InnerTypeTag),
  struct: bcs.lazy(() => StructTag$1),
  u16: null,
  u32: null,
  u256: null
});
const TypeTag$1 = InnerTypeTag.transform({
  input: (typeTag) => typeof typeTag === "string" ? TypeTagSerializer.parseFromStr(typeTag, true) : typeTag,
  output: (typeTag) => TypeTagSerializer.tagToString(typeTag)
});
const Argument$2 = bcs.enum("Argument", {
  GasCoin: null,
  Input: bcs.u16(),
  Result: bcs.u16(),
  NestedResult: bcs.tuple([bcs.u16(), bcs.u16()])
});
const ProgrammableMoveCall$2 = bcs.struct("ProgrammableMoveCall", {
  package: Address,
  module: bcs.string(),
  function: bcs.string(),
  typeArguments: bcs.vector(TypeTag$1),
  arguments: bcs.vector(Argument$2)
});
const Command$2 = bcs.enum("Command", {
  /**
   * A Move Call - any public Move function can be called via
   * this transaction. The results can be used that instant to pass
   * into the next transaction.
   */
  MoveCall: ProgrammableMoveCall$2,
  /**
   * Transfer vector of objects to a receiver.
   */
  TransferObjects: bcs.struct("TransferObjects", {
    objects: bcs.vector(Argument$2),
    address: Argument$2
  }),
  // /**
  //  * Split `amount` from a `coin`.
  //  */
  SplitCoins: bcs.struct("SplitCoins", {
    coin: Argument$2,
    amounts: bcs.vector(Argument$2)
  }),
  // /**
  //  * Merge Vector of Coins (`sources`) into a `destination`.
  //  */
  MergeCoins: bcs.struct("MergeCoins", {
    destination: Argument$2,
    sources: bcs.vector(Argument$2)
  }),
  // /**
  //  * Publish a Move module.
  //  */
  Publish: bcs.struct("Publish", {
    modules: bcs.vector(
      bcs.vector(bcs.u8()).transform({
        input: (val) => typeof val === "string" ? fromBase64(val) : val,
        output: (val) => toBase64(new Uint8Array(val))
      })
    ),
    dependencies: bcs.vector(Address)
  }),
  // /**
  //  * Build a vector of objects using the input arguments.
  //  * It is impossible to export construct a `vector<T: key>` otherwise,
  //  * so this call serves a utility function.
  //  */
  MakeMoveVec: bcs.struct("MakeMoveVec", {
    type: optionEnum(TypeTag$1).transform({
      input: (val) => val === null ? {
        None: true
      } : {
        Some: val
      },
      output: (val) => val.Some ?? null
    }),
    elements: bcs.vector(Argument$2)
  }),
  Upgrade: bcs.struct("Upgrade", {
    modules: bcs.vector(
      bcs.vector(bcs.u8()).transform({
        input: (val) => typeof val === "string" ? fromBase64(val) : val,
        output: (val) => toBase64(new Uint8Array(val))
      })
    ),
    dependencies: bcs.vector(Address),
    package: Address,
    ticket: Argument$2
  })
});
const ProgrammableTransaction = bcs.struct("ProgrammableTransaction", {
  inputs: bcs.vector(CallArg$2),
  commands: bcs.vector(Command$2)
});
const TransactionKind = bcs.enum("TransactionKind", {
  ProgrammableTransaction,
  ChangeEpoch: null,
  Genesis: null,
  ConsensusCommitPrologue: null
});
const TransactionExpiration$3 = bcs.enum("TransactionExpiration", {
  None: null,
  Epoch: unsafe_u64()
});
const StructTag$1 = bcs.struct("StructTag", {
  address: Address,
  module: bcs.string(),
  name: bcs.string(),
  typeParams: bcs.vector(InnerTypeTag)
});
const GasData$2 = bcs.struct("GasData", {
  payment: bcs.vector(IotaObjectRef),
  owner: Address,
  price: bcs.u64(),
  budget: bcs.u64()
});
const TransactionDataV1 = bcs.struct("TransactionDataV1", {
  kind: TransactionKind,
  sender: Address,
  gasData: GasData$2,
  expiration: TransactionExpiration$3
});
const TransactionData$1 = bcs.enum("TransactionData", {
  V1: TransactionDataV1
});
const IntentScope = bcs.enum("IntentScope", {
  TransactionData: null,
  TransactionEffects: null,
  CheckpointSummary: null,
  PersonalMessage: null
});
const IntentVersion = bcs.enum("IntentVersion", {
  V0: null
});
const AppId = bcs.enum("AppId", {
  Iota: null
});
const Intent = bcs.struct("Intent", {
  scope: IntentScope,
  version: IntentVersion,
  appId: AppId
});
function IntentMessage(T) {
  return bcs.struct(`IntentMessage<${T.name}>`, {
    intent: Intent,
    value: T
  });
}
const CompressedSignature = bcs.enum("CompressedSignature", {
  ED25519: bcs.fixedArray(64, bcs.u8()),
  Secp256k1: bcs.fixedArray(64, bcs.u8()),
  Secp256r1: bcs.fixedArray(64, bcs.u8())
});
const PublicKey$1 = bcs.enum("PublicKey", {
  ED25519: bcs.fixedArray(32, bcs.u8()),
  Secp256k1: bcs.fixedArray(33, bcs.u8()),
  Secp256r1: bcs.fixedArray(33, bcs.u8())
});
const MultiSigPkMap = bcs.struct("MultiSigPkMap", {
  pubKey: PublicKey$1,
  weight: bcs.u8()
});
const MultiSigPublicKey = bcs.struct("MultiSigPublicKey", {
  pk_map: bcs.vector(MultiSigPkMap),
  threshold: bcs.u16()
});
const MultiSig = bcs.struct("MultiSig", {
  sigs: bcs.vector(CompressedSignature),
  bitmap: bcs.u16(),
  multisig_pk: MultiSigPublicKey
});
const base64String = bcs.vector(bcs.u8()).transform({
  input: (val) => typeof val === "string" ? fromBase64(val) : val,
  output: (val) => toBase64(new Uint8Array(val))
});
const SenderSignedTransaction = bcs.struct("SenderSignedTransaction", {
  intentMessage: IntentMessage(TransactionData$1),
  txSignatures: bcs.vector(base64String)
});
const SenderSignedData = bcs.vector(SenderSignedTransaction, {
  name: "SenderSignedData"
});
const PasskeyAuthenticator = bcs.struct("PasskeyAuthenticator", {
  authenticatorData: bcs.vector(bcs.u8()),
  clientDataJson: bcs.string(),
  userSignature: bcs.vector(bcs.u8())
});
const PackageUpgradeError = bcs.enum("PackageUpgradeError", {
  UnableToFetchPackage: bcs.struct("UnableToFetchPackage", { packageId: Address }),
  NotAPackage: bcs.struct("NotAPackage", { objectId: Address }),
  IncompatibleUpgrade: null,
  DigestDoesNotMatch: bcs.struct("DigestDoesNotMatch", { digest: bcs.vector(bcs.u8()) }),
  UnknownUpgradePolicy: bcs.struct("UnknownUpgradePolicy", { policy: bcs.u8() }),
  PackageIDDoesNotMatch: bcs.struct("PackageIDDoesNotMatch", {
    packageId: Address,
    ticketId: Address
  })
});
const ModuleId = bcs.struct("ModuleId", {
  address: Address,
  name: bcs.string()
});
const MoveLocation = bcs.struct("MoveLocation", {
  module: ModuleId,
  function: bcs.u16(),
  instruction: bcs.u16(),
  functionName: bcs.option(bcs.string())
});
const CommandArgumentError = bcs.enum("CommandArgumentError", {
  TypeMismatch: null,
  InvalidBCSBytes: null,
  InvalidUsageOfPureArg: null,
  InvalidArgumentToPrivateEntryFunction: null,
  IndexOutOfBounds: bcs.struct("IndexOutOfBounds", { idx: bcs.u16() }),
  SecondaryIndexOutOfBounds: bcs.struct("SecondaryIndexOutOfBounds", {
    resultIdx: bcs.u16(),
    secondaryIdx: bcs.u16()
  }),
  InvalidResultArity: bcs.struct("InvalidResultArity", { resultIdx: bcs.u16() }),
  InvalidGasCoinUsage: null,
  InvalidValueUsage: null,
  InvalidObjectByValue: null,
  InvalidObjectByMutRef: null,
  SharedObjectOperationNotAllowed: null
});
const TypeArgumentError = bcs.enum("TypeArgumentError", {
  TypeNotFound: null,
  ConstraintNotSatisfied: null
});
const ExecutionFailureStatus = bcs.enum("ExecutionFailureStatus", {
  InsufficientGas: null,
  InvalidGasObject: null,
  InvariantViolation: null,
  FeatureNotYetSupported: null,
  MoveObjectTooBig: bcs.struct("MoveObjectTooBig", {
    objectSize: bcs.u64(),
    maxObjectSize: bcs.u64()
  }),
  MovePackageTooBig: bcs.struct("MovePackageTooBig", {
    objectSize: bcs.u64(),
    maxObjectSize: bcs.u64()
  }),
  CircularObjectOwnership: bcs.struct("CircularObjectOwnership", { object: Address }),
  InsufficientCoinBalance: null,
  CoinBalanceOverflow: null,
  PublishErrorNonZeroAddress: null,
  IotaMoveVerificationError: null,
  MovePrimitiveRuntimeError: bcs.option(MoveLocation),
  MoveAbort: bcs.tuple([MoveLocation, bcs.u64()]),
  VMVerificationOrDeserializationError: null,
  VMInvariantViolation: null,
  FunctionNotFound: null,
  ArityMismatch: null,
  TypeArityMismatch: null,
  NonEntryFunctionInvoked: null,
  CommandArgumentError: bcs.struct("CommandArgumentError", {
    argIdx: bcs.u16(),
    kind: CommandArgumentError
  }),
  TypeArgumentError: bcs.struct("TypeArgumentError", {
    argumentIdx: bcs.u16(),
    kind: TypeArgumentError
  }),
  UnusedValueWithoutDrop: bcs.struct("UnusedValueWithoutDrop", {
    resultIdx: bcs.u16(),
    secondaryIdx: bcs.u16()
  }),
  InvalidPublicFunctionReturnType: bcs.struct("InvalidPublicFunctionReturnType", {
    idx: bcs.u16()
  }),
  InvalidTransferObject: null,
  EffectsTooLarge: bcs.struct("EffectsTooLarge", { currentSize: bcs.u64(), maxSize: bcs.u64() }),
  PublishUpgradeMissingDependency: null,
  PublishUpgradeDependencyDowngrade: null,
  PackageUpgradeError: bcs.struct("PackageUpgradeError", { upgradeError: PackageUpgradeError }),
  WrittenObjectsTooLarge: bcs.struct("WrittenObjectsTooLarge", {
    currentSize: bcs.u64(),
    maxSize: bcs.u64()
  }),
  CertificateDenied: null,
  IotaMoveVerificationTimedout: null,
  SharedObjectOperationNotAllowed: null,
  InputObjectDeleted: null,
  ExecutionCancelledDueToSharedObjectCongestion: bcs.struct(
    "ExecutionCancelledDueToSharedObjectCongestion",
    {
      congestedObjects: bcs.vector(Address)
    }
  ),
  AddressDeniedForCoin: bcs.struct("AddressDeniedForCoin", {
    address: Address,
    coinType: bcs.string()
  }),
  CoinTypeGlobalPause: bcs.struct("CoinTypeGlobalPause", { coinType: bcs.string() }),
  ExecutionCancelledDueToRandomnessUnavailable: null
});
const ExecutionStatus = bcs.enum("ExecutionStatus", {
  Success: null,
  Failed: bcs.struct("ExecutionFailed", {
    error: ExecutionFailureStatus,
    command: bcs.option(bcs.u64())
  })
});
const GasCostSummary = bcs.struct("GasCostSummary", {
  computationCost: bcs.u64(),
  computationCostBurned: bcs.u64(),
  storageCost: bcs.u64(),
  storageRebate: bcs.u64(),
  nonRefundableStorageFee: bcs.u64()
});
const VersionDigest = bcs.tuple([bcs.u64(), ObjectDigest]);
const ObjectIn = bcs.enum("ObjectIn", {
  NotExist: null,
  Exist: bcs.tuple([VersionDigest, Owner])
});
const ObjectOut = bcs.enum("ObjectOut", {
  NotExist: null,
  ObjectWrite: bcs.tuple([ObjectDigest, Owner]),
  PackageWrite: VersionDigest
});
const IDOperation = bcs.enum("IDOperation", {
  None: null,
  Created: null,
  Deleted: null
});
const EffectsObjectChange = bcs.struct("EffectsObjectChange", {
  inputState: ObjectIn,
  outputState: ObjectOut,
  idOperation: IDOperation
});
const UnchangedSharedKind = bcs.enum("UnchangedSharedKind", {
  ReadOnlyRoot: VersionDigest,
  MutateDeleted: bcs.u64(),
  ReadDeleted: bcs.u64(),
  Cancelled: bcs.u64(),
  PerEpochConfig: null
});
const TransactionEffectsV1 = bcs.struct("TransactionEffectsV1", {
  status: ExecutionStatus,
  executedEpoch: bcs.u64(),
  gasUsed: GasCostSummary,
  transactionDigest: ObjectDigest,
  gasObjectIndex: bcs.option(bcs.u32()),
  eventsDigest: bcs.option(ObjectDigest),
  dependencies: bcs.vector(ObjectDigest),
  lamportVersion: bcs.u64(),
  changedObjects: bcs.vector(bcs.tuple([Address, EffectsObjectChange])),
  unchangedSharedObjects: bcs.vector(bcs.tuple([Address, UnchangedSharedKind])),
  auxDataDigest: bcs.option(ObjectDigest)
});
const TransactionEffects = bcs.enum("TransactionEffects", {
  V1: TransactionEffectsV1
});
const iotaBcs = {
  ...bcs,
  U8: bcs.u8(),
  U16: bcs.u16(),
  U32: bcs.u32(),
  U64: bcs.u64(),
  U128: bcs.u128(),
  U256: bcs.u256(),
  ULEB128: bcs.uleb128(),
  Bool: bcs.bool(),
  String: bcs.string(),
  Address,
  AppId,
  Argument: Argument$2,
  CallArg: CallArg$2,
  CompressedSignature,
  GasData: GasData$2,
  Intent,
  IntentMessage,
  IntentScope,
  IntentVersion,
  MultiSig,
  MultiSigPkMap,
  MultiSigPublicKey,
  ObjectArg: ObjectArg$3,
  ObjectDigest,
  Owner,
  ProgrammableMoveCall: ProgrammableMoveCall$2,
  ProgrammableTransaction,
  PublicKey: PublicKey$1,
  SenderSignedData,
  SenderSignedTransaction,
  SharedObjectRef,
  StructTag: StructTag$1,
  IotaObjectRef,
  Command: Command$2,
  TransactionData: TransactionData$1,
  TransactionDataV1,
  TransactionExpiration: TransactionExpiration$3,
  TransactionKind,
  TypeTag: TypeTag$1,
  TransactionEffects,
  PasskeyAuthenticator
};
const SIGNATURE_SCHEME_TO_FLAG = {
  ED25519: 0,
  Secp256k1: 1,
  Secp256r1: 2,
  MultiSig: 3,
  Passkey: 6
};
const SIGNATURE_SCHEME_TO_SIZE = {
  ED25519: 32,
  Secp256k1: 33,
  Secp256r1: 33
};
const SIGNATURE_FLAG_TO_SCHEME = {
  0: "ED25519",
  1: "Secp256k1",
  2: "Secp256r1",
  3: "MultiSig",
  6: "Passkey"
};
const crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes$1(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber$1(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes$1(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber$1(h.outputLen);
  anumber$1(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
const swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n);
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
const swap32IfBE = isLE ? (u) => u : byteSwap32;
const hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function kdfInputToBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function checkOpts(defaults, opts) {
  if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
    throw new Error("options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
class Hash {
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function createOptHasher(hashCons) {
  const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
  const tmp = hashCons({});
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return Uint8Array.from(crypto.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$3 = /* @__PURE__ */ BigInt(0);
const _1n$3 = /* @__PURE__ */ BigInt(1);
function _abool2(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}"`;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function _abytes2(value, length, title = "") {
  const bytes = isBytes$1(value);
  const len = value == null ? void 0 : value.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n$3 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes$1(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  res.length;
  return res;
}
const isPosBig = (n) => typeof n === "bigint" && _0n$3 <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n$3; n >>= _1n$3, len += 1)
    ;
  return len;
}
const bitMask = (n) => (_1n$3 << BigInt(n)) - _1n$3;
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const u8of = (byte) => Uint8Array.of(byte);
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n(0)) => {
    k = h(u8of(0), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8of(1), seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function _validateObject(object2, fields, optFields = {}) {
  if (!object2 || typeof object2 !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object2[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
  Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$2 = BigInt(0), _1n$2 = BigInt(1), _2n$2 = /* @__PURE__ */ BigInt(2), _3n$1 = /* @__PURE__ */ BigInt(3);
const _4n$1 = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _7n = /* @__PURE__ */ BigInt(7);
const _8n = /* @__PURE__ */ BigInt(8), _9n = /* @__PURE__ */ BigInt(9), _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n$2 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n$2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n$2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n$2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n$2, u = _1n$2;
  while (a !== _0n$2) {
    const q = b / a;
    const r2 = b % a;
    const m = x - u * q;
    b = a, a = r2, x = u, u = m;
  }
  const gcd2 = b;
  if (gcd2 !== _1n$2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root2, n) {
  if (!Fp.eql(Fp.sqr(root2), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n$2) / _4n$1;
  const root2 = Fp.pow(n, p1div4);
  assertIsSquare(Fp, root2, n);
  return root2;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n$2);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n$2), v);
  const root2 = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  assertIsSquare(Fp, root2, n);
  return root2;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root2 = Fp.cmov(tv1, tv2, e3);
    assertIsSquare(Fp, root2, n);
    return root2;
  };
}
function tonelliShanks(P) {
  if (P < _3n$1)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n$2;
  let S = 0;
  while (Q % _2n$2 === _0n$2) {
    Q /= _2n$2;
    S++;
  }
  let Z = _2n$2;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n$2) / _2n$2;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n$2 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n$1 === _3n$1)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
const FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  _validateObject(field, opts);
  return field;
}
function FpPow(Fp, num, power) {
  if (power < _0n$2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n$2)
    return Fp.ONE;
  if (power === _1n$2)
    return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n$2) {
    if (power & _1n$2)
      p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n$2;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n$2) / _2n$2;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber$1(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLenOrOpts, isLE2 = false, opts = {}) {
  if (ORDER <= _0n$2)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  let _nbitLength = void 0;
  let _sqrt = void 0;
  let modFromBytes = false;
  let allowedLengths = void 0;
  if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
    if (opts.sqrt || isLE2)
      throw new Error("cannot specify opts in two arguments");
    const _opts = bitLenOrOpts;
    if (_opts.BITS)
      _nbitLength = _opts.BITS;
    if (_opts.sqrt)
      _sqrt = _opts.sqrt;
    if (typeof _opts.isLE === "boolean")
      isLE2 = _opts.isLE;
    if (typeof _opts.modFromBytes === "boolean")
      modFromBytes = _opts.modFromBytes;
    allowedLengths = _opts.allowedLengths;
  } else {
    if (typeof bitLenOrOpts === "number")
      _nbitLength = bitLenOrOpts;
    if (opts.sqrt)
      _sqrt = opts.sqrt;
  }
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n$2,
    ONE: _1n$2,
    allowedLengths,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n$2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n$2,
    // is valid and invertible
    isValidNot0: (num) => !f.is0(num) && f.isValid(num),
    isOdd: (num) => (num & _1n$2) === _1n$2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: _sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes, skipValidation = true) => {
      if (allowedLengths) {
        if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      if (modFromBytes)
        scalar = mod(scalar, ORDER);
      if (!skipValidation) {
        if (!f.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a, b, c) => c ? b : a
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n$2) + _1n$2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state2[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
}
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
const SHA384_IV = /* @__PURE__ */ Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
const SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrSH = (h, l, s) => h >>> s | l << 32 - s;
const rotrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
const rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
const rotr32H = (_h, l) => l;
const rotr32L = (h, _l) => h;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends HashMD {
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
}
const K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
const SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
const SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
class SHA512 extends HashMD {
  constructor(outputLen = 64) {
    super(128, outputLen, 16, false);
    this.Ah = SHA512_IV[0] | 0;
    this.Al = SHA512_IV[1] | 0;
    this.Bh = SHA512_IV[2] | 0;
    this.Bl = SHA512_IV[3] | 0;
    this.Ch = SHA512_IV[4] | 0;
    this.Cl = SHA512_IV[5] | 0;
    this.Dh = SHA512_IV[6] | 0;
    this.Dl = SHA512_IV[7] | 0;
    this.Eh = SHA512_IV[8] | 0;
    this.El = SHA512_IV[9] | 0;
    this.Fh = SHA512_IV[10] | 0;
    this.Fl = SHA512_IV[11] | 0;
    this.Gh = SHA512_IV[12] | 0;
    this.Gl = SHA512_IV[13] | 0;
    this.Hh = SHA512_IV[14] | 0;
    this.Hl = SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class SHA384 extends SHA512 {
  constructor() {
    super(48);
    this.Ah = SHA384_IV[0] | 0;
    this.Al = SHA384_IV[1] | 0;
    this.Bh = SHA384_IV[2] | 0;
    this.Bl = SHA384_IV[3] | 0;
    this.Ch = SHA384_IV[4] | 0;
    this.Cl = SHA384_IV[5] | 0;
    this.Dh = SHA384_IV[6] | 0;
    this.Dl = SHA384_IV[7] | 0;
    this.Eh = SHA384_IV[8] | 0;
    this.El = SHA384_IV[9] | 0;
    this.Fh = SHA384_IV[10] | 0;
    this.Fl = SHA384_IV[11] | 0;
    this.Gh = SHA384_IV[12] | 0;
    this.Gl = SHA384_IV[13] | 0;
    this.Hh = SHA384_IV[14] | 0;
    this.Hl = SHA384_IV[15] | 0;
  }
}
const sha256$1 = /* @__PURE__ */ createHasher(() => new SHA256());
const sha512$1 = /* @__PURE__ */ createHasher(() => new SHA512());
const sha384 = /* @__PURE__ */ createHasher(() => new SHA384());
class HMAC extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    ahash(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$1 = BigInt(0);
const _1n$1 = BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n$1;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
const pointPrecomputes = /* @__PURE__ */ new WeakMap();
const pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n$1)
    throw new Error("invalid wNAF");
}
class wNAF {
  // Parametrized with a given Point class (not individual point)
  constructor(Point2, bits) {
    this.BASE = Point2.BASE;
    this.ZERO = Point2.ZERO;
    this.Fn = Point2.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d = elm;
    while (n > _0n$1) {
      if (n & _1n$1)
        p = p.add(d);
      d = d.double();
      n >>= _1n$1;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts(W, this.bits);
    const points = [];
    let p = point;
    let base2 = p;
    for (let window2 = 0; window2 < windows; window2++) {
      base2 = p;
      points.push(base2);
      for (let i = 1; i < windowSize; i++) {
        base2 = base2.add(p);
        points.push(base2);
      }
      p = base2.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return { p, f };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      if (n === _0n$1)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W, point, transform2) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform2 === "function")
          comp = transform2(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform2) {
    const W = getW(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform2), scalar);
  }
  unsafe(point, scalar, transform2, prev) {
    const W = getW(point);
    if (W === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform2), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P, W) {
    validateW(W, this.bits);
    pointWindowSizes.set(P, W);
    pointPrecomputes.delete(P);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
}
function mulEndoUnsafe(Point2, point, k1, k2) {
  let acc = point;
  let p1 = Point2.ZERO;
  let p2 = Point2.ZERO;
  while (k1 > _0n$1 || k2 > _0n$1) {
    if (k1 & _1n$1)
      p1 = p1.add(acc);
    if (k2 & _1n$1)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n$1;
    k2 >>= _1n$1;
  }
  return { p1, p2 };
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function createField(order, field, isLE2) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE: isLE2 });
  }
}
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n$1))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = "b";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$1) / den;
function _splitEndoScalar(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n;
  const k2neg = k2 < _0n;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n;
  if (k1 < _0n || k1 >= MAX_NUM || k2 < _0n || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  _abool2(optsn.lowS, "lowS");
  _abool2(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
class DERErr extends Error {
  constructor(m = "") {
    super(m);
  }
}
const DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const { Err: E } = DER;
      if (tag < 0 || tag > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong)
        length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length = length << 8 | b;
        pos += lenLen;
        if (length < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const { Err: E } = DER;
      if (num < _0n)
        throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(hex) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = ensureBytes("signature", hex);
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
const _0n = BigInt(0), _1n = BigInt(1), _2n$1 = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
function _normFnElement(Fn, key) {
  const { BYTES: expected } = Fn;
  let num;
  if (typeof key === "bigint") {
    num = key;
  } else {
    let bytes = ensureBytes("private key", key);
    try {
      num = Fn.fromBytes(bytes);
    } catch (error) {
      throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
    }
  }
  if (!Fn.isValidNot0(num))
    throw new Error("invalid private key: out of range [1..N-1]");
  return num;
}
function weierstrassN(params, extraOpts = {}) {
  const validated = _createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  _validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    wrapPrivateKey: "boolean"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp, Fn);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    _abool2(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes(pprefix(hasEvenY), bx);
    } else {
      return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    _abytes2(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const isYOdd = Fp.isOdd(y);
      const isHeadOdd = (head & 1) === 1;
      if (isHeadOdd !== isYOdd)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes || pointToBytes;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ProjectivePoint expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn.ORDER);
  }
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE))
      return { x: X, y: Y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point2(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point2 {
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point2.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex) {
      return Point2.fromBytes(ensureBytes("pointHex", hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point2(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2 } = extraOpts;
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point2, p));
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ(Point2, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p = this;
      if (!Fn.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n || p.is0())
        return Point2.ZERO;
      if (sc === _1n)
        return p;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point2, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
      return sum.is0() ? void 0 : sum;
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      _abool2(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point2, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    // TODO: remove
    get px() {
      return this.X;
    }
    get py() {
      return this.X;
    }
    get pz() {
      return this.Z;
    }
    toRawBytes(isCompressed = true) {
      return this.toBytes(isCompressed);
    }
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    static normalizeZ(points) {
      return normalizeZ(Point2, points);
    }
    static msm(points, scalars) {
      return pippenger(Point2, Fn, points, scalars);
    }
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(_normFnElement(Fn, privateKey));
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
  Point2.Fp = Fp;
  Point2.Fn = Fn;
  const bits = Fn.BITS;
  const wnaf = new wNAF(Point2, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point2.BASE.precompute(8);
  return Point2;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn) {
  return {
    secretKey: Fn.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn.BYTES
  };
}
function ecdh(Point2, ecdhOpts = {}) {
  const { Fn } = Point2;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
  const lengths = Object.assign(getWLengths(Point2.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
  function isValidSecretKey(secretKey) {
    try {
      return !!_normFnElement(Fn, secretKey);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point2.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed = randomBytes_(lengths.seed)) {
    return mapHashToField(_abytes2(seed, lengths.seed, "seed"), Fn.ORDER);
  }
  function getPublicKey(secretKey, isCompressed = true) {
    return Point2.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
  }
  function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point2)
      return true;
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    if (Fn.allowedLengths || secretKey === publicKey)
      return void 0;
    const l = ensureBytes("key", item).length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = _normFnElement(Fn, secretKeyA);
    const b = Point2.fromHex(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils2 = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey,
    // TODO: remove
    isValidPrivateKey: isValidSecretKey,
    randomPrivateKey: randomSecretKey,
    normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
    precompute(windowSize = 8, point = Point2.BASE) {
      return point.precompute(windowSize, false);
    }
  };
  return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point: Point2, utils: utils2, lengths });
}
function ecdsa(Point2, hash, ecdsaOpts = {}) {
  ahash(hash);
  _validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const randomBytes$1 = ecdsaOpts.randomBytes || randomBytes;
  const hmac$1 = ecdsaOpts.hmac || ((key, ...msgs) => hmac(hash, key, concatBytes(...msgs)));
  const { Fp, Fn } = Point2;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  const { keygen, getPublicKey, getSharedSecret, utils: utils2, lengths } = ecdh(Point2, ecdsaOpts);
  const defaultSigOpts = {
    prehash: false,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : false,
    format: void 0,
    //'compact' as ECDSASigFormat,
    extraEntropy: false
  };
  const defaultSigOpts_format = "compact";
  function isBiggerThanHalfOrder(number2) {
    const HALF = CURVE_ORDER >> _1n;
    return number2 > HALF;
  }
  function validateRS(title, num) {
    if (!Fn.isValidNot0(num))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num;
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return _abytes2(bytes, sizer, `${format} signature`);
  }
  class Signature {
    constructor(r2, s, recovery) {
      this.r = validateRS("r", r2);
      this.s = validateRS("s", s);
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts_format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r: r3, s: s2 } = DER.toSig(_abytes2(bytes));
        return new Signature(r3, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = Fn.BYTES;
      const r2 = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn.fromBytes(r2), Fn.fromBytes(s), recid);
    }
    static fromHex(hex, format) {
      return this.fromBytes(hexToBytes(hex), format);
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const FIELD_ORDER = Fp.ORDER;
      const { r: r2, s, recovery: rec } = this;
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const hasCofactor = CURVE_ORDER * _2n$1 < FIELD_ORDER;
      if (hasCofactor && rec > 1)
        throw new Error("recovery id is ambiguous for h>1 curve");
      const radj = rec === 2 || rec === 3 ? r2 + CURVE_ORDER : r2;
      if (!Fp.isValid(radj))
        throw new Error("recovery id 2 or 3 invalid");
      const x = Fp.toBytes(radj);
      const R = Point2.fromBytes(concatBytes(pprefix((rec & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(ensureBytes("msgHash", messageHash));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point2.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts_format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes(DER.hexFromSig(this));
      const r2 = Fn.toBytes(this.r);
      const s = Fn.toBytes(this.s);
      if (format === "recovered") {
        if (this.recovery == null)
          throw new Error("recovery bit must be present");
        return concatBytes(Uint8Array.of(this.recovery), r2, s);
      }
      return concatBytes(r2, s);
    }
    toHex(format) {
      return bytesToHex(this.toBytes(format));
    }
    // TODO: remove
    assertValidity() {
    }
    static fromCompact(hex) {
      return Signature.fromBytes(ensureBytes("sig", hex), "compact");
    }
    static fromDER(hex) {
      return Signature.fromBytes(ensureBytes("sig", hex), "der");
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return this.toBytes("der");
    }
    toDERHex() {
      return bytesToHex(this.toBytes("der"));
    }
    toCompactRawBytes() {
      return this.toBytes("compact");
    }
    toCompactHex() {
      return bytesToHex(this.toBytes("compact"));
    }
  }
  const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
    return Fn.create(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num) {
    aInRange("num < 2^" + fnBits, num, _0n, ORDER_MASK);
    return Fn.toBytes(num);
  }
  function validateMsgAndHash(message, prehash) {
    _abytes2(message, void 0, "message");
    return prehash ? _abytes2(hash(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, privateKey, opts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = _normFnElement(Fn, privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes$1(lengths.secretKey) : extraEntropy;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k))
        return;
      const ik = Fn.inv(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r2 = Fn.create(q.x);
      if (r2 === _0n)
        return;
      const s = Fn.create(ik * Fn.create(m + r2 * d));
      if (s === _0n)
        return;
      let recovery = (q.x === r2 ? 0 : 2) | Number(q.y & _1n);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn.neg(s);
        recovery ^= 1;
      }
      return new Signature(r2, normS, recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts = {}) {
    message = ensureBytes("message", message);
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac$1);
    const sig = drbg(seed, k2sig);
    return sig;
  }
  function tryParsingSig(sg) {
    let sig = void 0;
    const isHex2 = typeof sg === "string" || isBytes$1(sg);
    const isObj = !isHex2 && sg !== null && typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex2 && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    if (isObj) {
      sig = new Signature(sg.r, sg.s);
    } else if (isHex2) {
      try {
        sig = Signature.fromBytes(ensureBytes("sig", sg), "der");
      } catch (derError) {
        if (!(derError instanceof DER.Err))
          throw derError;
      }
      if (!sig) {
        try {
          sig = Signature.fromBytes(ensureBytes("sig", sg), "compact");
        } catch (error) {
          return false;
        }
      }
    }
    if (!sig)
      return false;
    return sig;
  }
  function verify(signature, message, publicKey, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
    publicKey = ensureBytes("publicKey", publicKey);
    message = validateMsgAndHash(ensureBytes("message", message), prehash);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const sig = format === void 0 ? tryParsingSig(signature) : Signature.fromBytes(ensureBytes("sig", signature), format);
    if (sig === false)
      return false;
    try {
      const P = Point2.fromBytes(publicKey);
      if (lowS && sig.hasHighS())
        return false;
      const { r: r2, s } = sig;
      const h = bits2int_modN(message);
      const is2 = Fn.inv(s);
      const u1 = Fn.create(h * is2);
      const u2 = Fn.create(r2 * is2);
      const R = Point2.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0())
        return false;
      const v = Fn.create(R.x);
      return v === r2;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils: utils2,
    lengths,
    Point: Point2,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash
  });
}
function _weierstrass_legacy_opts_to_new(c) {
  const CURVE = {
    a: c.a,
    b: c.b,
    p: c.Fp.ORDER,
    n: c.n,
    h: c.h,
    Gx: c.Gx,
    Gy: c.Gy
  };
  const Fp = c.Fp;
  let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
  const Fn = Field(CURVE.n, {
    BITS: c.nBitLength,
    allowedLengths,
    modFromBytes: c.wrapPrivateKey
  });
  const curveOpts = {
    Fp,
    Fn,
    allowInfinityPoint: c.allowInfinityPoint,
    endo: c.endo,
    isTorsionFree: c.isTorsionFree,
    clearCofactor: c.clearCofactor,
    fromBytes: c.fromBytes,
    toBytes: c.toBytes
  };
  return { CURVE, curveOpts };
}
function _ecdsa_legacy_opts_to_new(c) {
  const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
  const ecdsaOpts = {
    hmac: c.hmac,
    randomBytes: c.randomBytes,
    lowS: c.lowS,
    bits2int: c.bits2int,
    bits2int_modN: c.bits2int_modN
  };
  return { CURVE, curveOpts, hash: c.hash, ecdsaOpts };
}
function _ecdsa_new_output_to_legacy(c, _ecdsa) {
  const Point2 = _ecdsa.Point;
  return Object.assign({}, _ecdsa, {
    ProjectivePoint: Point2,
    CURVE: Object.assign({}, c, nLength(Point2.Fn.ORDER, Point2.Fn.BITS))
  });
}
function weierstrass(c) {
  const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
  const Point2 = weierstrassN(CURVE, curveOpts);
  const signs = ecdsa(Point2, hash, ecdsaOpts);
  return _ecdsa_new_output_to_legacy(c, signs);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function createCurve(curveDef, defHash) {
  const create = (hash) => weierstrass({ ...curveDef, hash });
  return { ...create(defHash), create };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const p256_CURVE = {
  p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
  n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
  h: BigInt(1),
  a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
  b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
  Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
  Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
};
const p384_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
  n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
  h: BigInt(1),
  a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
  b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
  Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
  Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
};
const p521_CURVE = {
  p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
  n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
  h: BigInt(1),
  a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
  b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
  Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
  Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
};
const Fp256 = Field(p256_CURVE.p);
const Fp384 = Field(p384_CURVE.p);
const Fp521 = Field(p521_CURVE.p);
const p256 = createCurve({ ...p256_CURVE, Fp: Fp256, lowS: false }, sha256$1);
createCurve({ ...p384_CURVE, Fp: Fp384, lowS: false }, sha384);
createCurve({ ...p521_CURVE, Fp: Fp521, lowS: false, allowedPrivateKeyLengths: [130, 131, 132] }, sha512$1);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256r1 = p256;
const sha256 = sha256$1;
const BSIGMA = /* @__PURE__ */ Uint8Array.from([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9,
  12,
  5,
  1,
  15,
  14,
  13,
  4,
  10,
  0,
  7,
  6,
  3,
  9,
  2,
  8,
  11,
  13,
  11,
  7,
  14,
  12,
  1,
  3,
  9,
  5,
  0,
  15,
  4,
  8,
  6,
  2,
  10,
  6,
  15,
  14,
  9,
  11,
  3,
  0,
  8,
  12,
  2,
  13,
  7,
  1,
  4,
  10,
  5,
  10,
  2,
  8,
  4,
  7,
  6,
  1,
  5,
  15,
  11,
  9,
  14,
  3,
  12,
  13,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  // Blake1, unused in others
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9
]);
const B2B_IV = /* @__PURE__ */ Uint32Array.from([
  4089235720,
  1779033703,
  2227873595,
  3144134277,
  4271175723,
  1013904242,
  1595750129,
  2773480762,
  2917565137,
  1359893119,
  725511199,
  2600822924,
  4215389547,
  528734635,
  327033209,
  1541459225
]);
const BBUF = /* @__PURE__ */ new Uint32Array(32);
function G1b(a, b, c, d, msg, x) {
  const Xl = msg[x], Xh = msg[x + 1];
  let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
  let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
  let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
  let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
  let ll = add3L(Al, Bl, Xl);
  Ah = add3H(ll, Ah, Bh, Xh);
  Al = ll | 0;
  ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
  ({ Dh, Dl } = { Dh: rotr32H(Dh, Dl), Dl: rotr32L(Dh) });
  ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
  ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
  ({ Bh, Bl } = { Bh: rotrSH(Bh, Bl, 24), Bl: rotrSL(Bh, Bl, 24) });
  BBUF[2 * a] = Al, BBUF[2 * a + 1] = Ah;
  BBUF[2 * b] = Bl, BBUF[2 * b + 1] = Bh;
  BBUF[2 * c] = Cl, BBUF[2 * c + 1] = Ch;
  BBUF[2 * d] = Dl, BBUF[2 * d + 1] = Dh;
}
function G2b(a, b, c, d, msg, x) {
  const Xl = msg[x], Xh = msg[x + 1];
  let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
  let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
  let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
  let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
  let ll = add3L(Al, Bl, Xl);
  Ah = add3H(ll, Ah, Bh, Xh);
  Al = ll | 0;
  ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
  ({ Dh, Dl } = { Dh: rotrSH(Dh, Dl, 16), Dl: rotrSL(Dh, Dl, 16) });
  ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
  ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
  ({ Bh, Bl } = { Bh: rotrBH(Bh, Bl, 63), Bl: rotrBL(Bh, Bl, 63) });
  BBUF[2 * a] = Al, BBUF[2 * a + 1] = Ah;
  BBUF[2 * b] = Bl, BBUF[2 * b + 1] = Bh;
  BBUF[2 * c] = Cl, BBUF[2 * c + 1] = Ch;
  BBUF[2 * d] = Dl, BBUF[2 * d + 1] = Dh;
}
function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
  anumber$1(keyLen);
  if (outputLen < 0 || outputLen > keyLen)
    throw new Error("outputLen bigger than keyLen");
  const { key, salt, personalization } = opts;
  if (key !== void 0 && (key.length < 1 || key.length > keyLen))
    throw new Error("key length must be undefined or 1.." + keyLen);
  if (salt !== void 0 && salt.length !== saltLen)
    throw new Error("salt must be undefined or " + saltLen);
  if (personalization !== void 0 && personalization.length !== persLen)
    throw new Error("personalization must be undefined or " + persLen);
}
class BLAKE2 extends Hash {
  constructor(blockLen, outputLen) {
    super();
    this.finished = false;
    this.destroyed = false;
    this.length = 0;
    this.pos = 0;
    anumber$1(blockLen);
    anumber$1(outputLen);
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.buffer = new Uint8Array(blockLen);
    this.buffer32 = u32(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { blockLen, buffer, buffer32 } = this;
    const len = data.length;
    const offset = data.byteOffset;
    const buf = data.buffer;
    for (let pos = 0; pos < len; ) {
      if (this.pos === blockLen) {
        swap32IfBE(buffer32);
        this.compress(buffer32, 0, false);
        swap32IfBE(buffer32);
        this.pos = 0;
      }
      const take = Math.min(blockLen - this.pos, len - pos);
      const dataOffset = offset + pos;
      if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
        const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
        swap32IfBE(data32);
        for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
          this.length += blockLen;
          this.compress(data32, pos32, false);
        }
        swap32IfBE(data32);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      this.length += take;
      pos += take;
    }
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    const { pos, buffer32 } = this;
    this.finished = true;
    clean(this.buffer.subarray(pos));
    swap32IfBE(buffer32);
    this.compress(buffer32, 0, true);
    swap32IfBE(buffer32);
    const out32 = u32(out);
    this.get().forEach((v, i) => out32[i] = swap8IfBE(v));
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    const { buffer, length, finished, destroyed, outputLen, pos } = this;
    to || (to = new this.constructor({ dkLen: outputLen }));
    to.set(...this.get());
    to.buffer.set(buffer);
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    to.outputLen = outputLen;
    return to;
  }
  clone() {
    return this._cloneInto();
  }
}
class BLAKE2b extends BLAKE2 {
  constructor(opts = {}) {
    const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
    super(128, olen);
    this.v0l = B2B_IV[0] | 0;
    this.v0h = B2B_IV[1] | 0;
    this.v1l = B2B_IV[2] | 0;
    this.v1h = B2B_IV[3] | 0;
    this.v2l = B2B_IV[4] | 0;
    this.v2h = B2B_IV[5] | 0;
    this.v3l = B2B_IV[6] | 0;
    this.v3h = B2B_IV[7] | 0;
    this.v4l = B2B_IV[8] | 0;
    this.v4h = B2B_IV[9] | 0;
    this.v5l = B2B_IV[10] | 0;
    this.v5h = B2B_IV[11] | 0;
    this.v6l = B2B_IV[12] | 0;
    this.v6h = B2B_IV[13] | 0;
    this.v7l = B2B_IV[14] | 0;
    this.v7h = B2B_IV[15] | 0;
    checkBlake2Opts(olen, opts, 64, 16, 16);
    let { key, personalization, salt } = opts;
    let keyLength = 0;
    if (key !== void 0) {
      key = toBytes(key);
      keyLength = key.length;
    }
    this.v0l ^= this.outputLen | keyLength << 8 | 1 << 16 | 1 << 24;
    if (salt !== void 0) {
      salt = toBytes(salt);
      const slt = u32(salt);
      this.v4l ^= swap8IfBE(slt[0]);
      this.v4h ^= swap8IfBE(slt[1]);
      this.v5l ^= swap8IfBE(slt[2]);
      this.v5h ^= swap8IfBE(slt[3]);
    }
    if (personalization !== void 0) {
      personalization = toBytes(personalization);
      const pers = u32(personalization);
      this.v6l ^= swap8IfBE(pers[0]);
      this.v6h ^= swap8IfBE(pers[1]);
      this.v7l ^= swap8IfBE(pers[2]);
      this.v7h ^= swap8IfBE(pers[3]);
    }
    if (key !== void 0) {
      const tmp = new Uint8Array(this.blockLen);
      tmp.set(key);
      this.update(tmp);
    }
  }
  // prettier-ignore
  get() {
    let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
    return [v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h];
  }
  // prettier-ignore
  set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
    this.v0l = v0l | 0;
    this.v0h = v0h | 0;
    this.v1l = v1l | 0;
    this.v1h = v1h | 0;
    this.v2l = v2l | 0;
    this.v2h = v2h | 0;
    this.v3l = v3l | 0;
    this.v3h = v3h | 0;
    this.v4l = v4l | 0;
    this.v4h = v4h | 0;
    this.v5l = v5l | 0;
    this.v5h = v5h | 0;
    this.v6l = v6l | 0;
    this.v6h = v6h | 0;
    this.v7l = v7l | 0;
    this.v7h = v7h | 0;
  }
  compress(msg, offset, isLast) {
    this.get().forEach((v, i) => BBUF[i] = v);
    BBUF.set(B2B_IV, 16);
    let { h, l } = fromBig(BigInt(this.length));
    BBUF[24] = B2B_IV[8] ^ l;
    BBUF[25] = B2B_IV[9] ^ h;
    if (isLast) {
      BBUF[28] = ~BBUF[28];
      BBUF[29] = ~BBUF[29];
    }
    let j = 0;
    const s = BSIGMA;
    for (let i = 0; i < 12; i++) {
      G1b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
      G2b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
      G1b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
      G2b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
      G1b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
      G2b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
      G1b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
      G2b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
      G1b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
      G2b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
      G1b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
      G2b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
      G1b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
      G2b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
      G1b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
      G2b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
    }
    this.v0l ^= BBUF[0] ^ BBUF[16];
    this.v0h ^= BBUF[1] ^ BBUF[17];
    this.v1l ^= BBUF[2] ^ BBUF[18];
    this.v1h ^= BBUF[3] ^ BBUF[19];
    this.v2l ^= BBUF[4] ^ BBUF[20];
    this.v2h ^= BBUF[5] ^ BBUF[21];
    this.v3l ^= BBUF[6] ^ BBUF[22];
    this.v3h ^= BBUF[7] ^ BBUF[23];
    this.v4l ^= BBUF[8] ^ BBUF[24];
    this.v4h ^= BBUF[9] ^ BBUF[25];
    this.v5l ^= BBUF[10] ^ BBUF[26];
    this.v5h ^= BBUF[11] ^ BBUF[27];
    this.v6l ^= BBUF[12] ^ BBUF[28];
    this.v6h ^= BBUF[13] ^ BBUF[29];
    this.v7l ^= BBUF[14] ^ BBUF[30];
    this.v7h ^= BBUF[15] ^ BBUF[31];
    clean(BBUF);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer32);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const blake2b$1 = /* @__PURE__ */ createOptHasher((opts) => new BLAKE2b(opts));
const blake2b = blake2b$1;
function messageWithIntent(scope, message) {
  return iotaBcs.IntentMessage(iotaBcs.fixedArray(message.length, iotaBcs.u8())).serialize({
    intent: {
      scope: { [scope]: true },
      version: { V0: true },
      appId: { Iota: true }
    },
    value: message
  }).toBytes();
}
function bytesEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
class PublicKey {
  /**
   * Checks if two public keys are equal
   */
  equals(publicKey) {
    return bytesEqual(this.toRawBytes(), publicKey.toRawBytes());
  }
  /**
   * Return the base-64 representation of the public key
   */
  toBase64() {
    return toBase64(this.toRawBytes());
  }
  toString() {
    throw new Error(
      "`toString` is not implemented on public keys. Use `toBase64()` or `toRawBytes()` instead."
    );
  }
  /**
   * Return the IOTA representation of the public key encoded in
   * base-64. An IOTA public key is formed by the concatenation
   * of the scheme flag with the raw bytes of the public key
   */
  toIotaPublicKey() {
    const bytes = this.toIotaBytes();
    return toBase64(bytes);
  }
  verifyWithIntent(bytes, signature, intent) {
    const intentMessage = messageWithIntent(intent, bytes);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return this.verify(digest, signature);
  }
  /**
   * Verifies that the signature is valid for the provided PersonalMessage
   */
  verifyPersonalMessage(message, signature) {
    return this.verifyWithIntent(
      iotaBcs.vector(iotaBcs.u8()).serialize(message).toBytes(),
      signature,
      "PersonalMessage"
    );
  }
  /**
   * Verifies that the signature is valid for the provided Transaction
   */
  verifyTransaction(transaction, signature) {
    return this.verifyWithIntent(transaction, signature, "TransactionData");
  }
  /**
   * Returns the bytes representation of the public key
   * prefixed with the signature scheme flag
   */
  toIotaBytes() {
    const rawBytes = this.toRawBytes();
    const iotaBytes = new Uint8Array(rawBytes.length + 1);
    iotaBytes.set([this.flag()]);
    iotaBytes.set(rawBytes, 1);
    return iotaBytes;
  }
  /**
   * Returns the bytes representation of the public key
   * prefixed with the signature scheme flag. If the
   * signature scheme is ED25519, no prefix is set.
   */
  toIotaBytesForAddress() {
    const rawBytes = this.toRawBytes();
    if (this.flag() === SIGNATURE_SCHEME_TO_FLAG["ED25519"]) {
      return rawBytes;
    } else {
      const iotaBytes = new Uint8Array(rawBytes.length + 1);
      iotaBytes.set([this.flag()]);
      iotaBytes.set(rawBytes, 1);
      return iotaBytes;
    }
  }
  /**
   * Return the IOTA address associated with this Ed25519 public key
   */
  toIotaAddress() {
    return normalizeIotaAddress(
      bytesToHex(blake2b(this.toIotaBytesForAddress(), { dkLen: 32 })).slice(
        0,
        IOTA_ADDRESS_LENGTH * 2
      )
    );
  }
}
const PASSKEY_PUBLIC_KEY_SIZE = 33;
const PASSKEY_SIGNATURE_SIZE = 64;
class PasskeyPublicKey extends PublicKey {
  /**
   * Create a new PasskeyPublicKey object
   * @param value passkey public key as buffer or base-64 encoded string
   */
  constructor(value) {
    super();
    if (typeof value === "string") {
      this.data = fromB64(value);
    } else if (value instanceof Uint8Array) {
      this.data = value;
    } else {
      this.data = Uint8Array.from(value);
    }
    if (this.data.length !== PASSKEY_PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${PASSKEY_PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`
      );
    }
  }
  /**
   * Checks if two passkey public keys are equal
   */
  equals(publicKey) {
    return super.equals(publicKey);
  }
  /**
   * Return the byte array representation of the Secp256r1 public key
   */
  toRawBytes() {
    return this.data;
  }
  /**
   * Return the IOTA address associated with this Secp256r1 public key
   */
  flag() {
    return SIGNATURE_SCHEME_TO_FLAG["Passkey"];
  }
  /**
   * Verifies that the signature is valid for for the provided message
   */
  async verify(message, signature) {
    const parsed = parseSerializedPasskeySignature(signature);
    const clientDataJSON = JSON.parse(parsed.clientDataJson);
    if (clientDataJSON.type !== "webauthn.get") {
      return false;
    }
    const parsedChallenge = fromB64(
      clientDataJSON.challenge.replace(/-/g, "+").replace(/_/g, "/")
    );
    if (!bytesEqual(message, parsedChallenge)) {
      return false;
    }
    const pk = parsed.userSignature.slice(1 + PASSKEY_SIGNATURE_SIZE);
    if (!bytesEqual(this.toRawBytes(), pk)) {
      return false;
    }
    const payload = new Uint8Array([
      ...parsed.authenticatorData,
      ...sha256(parsed.clientDataJson)
    ]);
    const sig = parsed.userSignature.slice(1, PASSKEY_SIGNATURE_SIZE + 1);
    return secp256r1.verify(sig, sha256(payload), pk);
  }
}
PasskeyPublicKey.SIZE = PASSKEY_PUBLIC_KEY_SIZE;
function parseSerializedPasskeySignature(signature) {
  const bytes = typeof signature === "string" ? fromB64(signature) : signature;
  if (bytes[0] !== SIGNATURE_SCHEME_TO_FLAG.Passkey) {
    throw new Error("Invalid signature scheme");
  }
  const dec = PasskeyAuthenticator.parse(bytes.slice(1));
  return {
    signatureScheme: "Passkey",
    serializedSignature: toB64(bytes),
    signature: bytes,
    authenticatorData: dec.authenticatorData,
    clientDataJson: dec.clientDataJson,
    userSignature: new Uint8Array(dec.userSignature),
    publicKey: new Uint8Array(dec.userSignature.slice(1 + PASSKEY_SIGNATURE_SIZE))
  };
}
function toSerializedSignature({
  signature,
  signatureScheme,
  publicKey
}) {
  if (!publicKey) {
    throw new Error("`publicKey` is required");
  }
  const pubKeyBytes = publicKey.toRawBytes();
  const serializedSignature = new Uint8Array(1 + signature.length + pubKeyBytes.length);
  serializedSignature.set([SIGNATURE_SCHEME_TO_FLAG[signatureScheme]]);
  serializedSignature.set(signature, 1);
  serializedSignature.set(pubKeyBytes, 1 + signature.length);
  return toBase64(serializedSignature);
}
function parseSerializedSignature(serializedSignature) {
  const bytes = fromBase64(serializedSignature);
  const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  switch (signatureScheme) {
    case "Passkey":
      return parseSerializedPasskeySignature(serializedSignature);
    case "MultiSig":
      const multisig = iotaBcs.MultiSig.parse(bytes.slice(1));
      return {
        serializedSignature,
        signatureScheme,
        multisig,
        bytes
      };
    case "ED25519":
    case "Secp256k1":
    case "Secp256r1":
      const size = SIGNATURE_SCHEME_TO_SIZE[signatureScheme];
      const signature = bytes.slice(1, bytes.length - size);
      const publicKey = bytes.slice(1 + signature.length);
      return {
        serializedSignature,
        signatureScheme,
        signature,
        publicKey,
        bytes
      };
    default:
      throw new Error("Unsupported signature scheme");
  }
}
function pbkdf2Init(hash, _password, _salt, _opts) {
  ahash(hash);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber$1(c);
  anumber$1(dkLen);
  anumber$1(asyncTick);
  if (c < 1)
    throw new Error("iterations (c) should be >= 1");
  const password = kdfInputToBytes(_password);
  const salt = kdfInputToBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  clean(u);
  return DK;
}
function pbkdf2(hash, password, salt, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap2, id);
  const decode = args.map((x) => x.decode).reduce(wrap2, id);
  return { encode, decode };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join$1(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function convertRadix(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
  aArr(data);
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber(d);
    if (d < 0 || d >= from)
      throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to;
      carry = digitBase % to;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
    res.push(0);
  return res.reverse();
}
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
const powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix(num) {
  anumber(num);
  const _256 = 2 ** 8;
  return {
    encode: (bytes) => {
      if (!isBytes(bytes))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes), _256, num);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num, _256));
    }
  };
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function checksum(len, fn) {
  anumber(len);
  afn(fn);
  return {
    encode(data) {
      if (!isBytes(data))
        throw new Error("checksum.encode: input should be Uint8Array");
      const sum = fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes(data))
        throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
const utils = {
  alphabet,
  chain,
  checksum,
  convertRadix,
  convertRadix2,
  radix,
  radix2,
  join: join$1,
  padding
};
const genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join$1(""));
const base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
const createBase58check = (sha2562) => /* @__PURE__ */ chain(checksum(4, (data) => sha2562(sha2562(data))), base58);
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const isJapanese = (wordlist) => wordlist[0] === "あいこくしん";
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError("invalid mnemonic type: " + typeof str);
  return str.normalize("NFKD");
}
function normalize(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function aentropy(ent) {
  abytes(ent, 16, 20, 24, 28, 32);
}
function generateMnemonic(wordlist, strength = 128) {
  anumber$1(strength);
  if (strength % 32 !== 0 || strength > 256)
    throw new TypeError("Invalid entropy");
  return entropyToMnemonic(randomBytes(strength / 8), wordlist);
}
const calcChecksum = (entropy) => {
  const bitsLeft = 8 - entropy.length / 4;
  return new Uint8Array([sha256$1(entropy)[0] >> bitsLeft << bitsLeft]);
};
function getCoder(wordlist) {
  if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== "string")
    throw new Error("Wordlist: expected array of 2048 strings");
  wordlist.forEach((i) => {
    if (typeof i !== "string")
      throw new Error("wordlist: non-string element: " + i);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist));
}
function mnemonicToEntropy(mnemonic, wordlist) {
  const { words } = normalize(mnemonic);
  const entropy = getCoder(wordlist).decode(words);
  aentropy(entropy);
  return entropy;
}
function entropyToMnemonic(entropy, wordlist) {
  aentropy(entropy);
  const words = getCoder(wordlist).encode(entropy);
  return words.join(isJapanese(wordlist) ? "　" : " ");
}
const psalt = (passphrase) => nfkd("mnemonic" + passphrase);
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha512$1, normalize(mnemonic).nfkd, psalt(passphrase), { c: 2048, dkLen: 64 });
}
function isValidHardenedPath(path) {
  if (!new RegExp("^m\\/44'\\/4218'\\/[0-9]+'\\/[0-9]+'\\/[0-9]+'+$").test(path)) {
    return false;
  }
  return true;
}
function isValidBIP32Path(path) {
  if (!new RegExp("^m\\/(54|74)'\\/4218'\\/[0-9]+'\\/[0-9]+\\/[0-9]+$").test(path)) {
    return false;
  }
  return true;
}
function mnemonicToSeed(mnemonics) {
  return mnemonicToSeedSync(mnemonics, "");
}
function mnemonicToSeedHex(mnemonics) {
  return toHex(mnemonicToSeed(mnemonics));
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var dist = {};
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.bech32m = dist.bech32 = void 0;
  const ALPHABET2 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  const ALPHABET_MAP = {};
  for (let z = 0; z < ALPHABET2.length; z++) {
    const x = ALPHABET2.charAt(z);
    ALPHABET_MAP[x] = z;
  }
  function polymodStep(pre) {
    const b = pre >> 25;
    return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
  }
  function prefixChk(prefix) {
    let chk = 1;
    for (let i = 0; i < prefix.length; ++i) {
      const c = prefix.charCodeAt(i);
      if (c < 33 || c > 126)
        return "Invalid prefix (" + prefix + ")";
      chk = polymodStep(chk) ^ c >> 5;
    }
    chk = polymodStep(chk);
    for (let i = 0; i < prefix.length; ++i) {
      const v = prefix.charCodeAt(i);
      chk = polymodStep(chk) ^ v & 31;
    }
    return chk;
  }
  function convert(data, inBits, outBits, pad) {
    let value = 0;
    let bits = 0;
    const maxV = (1 << outBits) - 1;
    const result = [];
    for (let i = 0; i < data.length; ++i) {
      value = value << inBits | data[i];
      bits += inBits;
      while (bits >= outBits) {
        bits -= outBits;
        result.push(value >> bits & maxV);
      }
    }
    if (pad) {
      if (bits > 0) {
        result.push(value << outBits - bits & maxV);
      }
    } else {
      if (bits >= inBits)
        return "Excess padding";
      if (value << outBits - bits & maxV)
        return "Non-zero padding";
    }
    return result;
  }
  function toWords(bytes) {
    return convert(bytes, 8, 5, true);
  }
  function fromWordsUnsafe(words) {
    const res = convert(words, 5, 8, false);
    if (Array.isArray(res))
      return res;
  }
  function fromWords(words) {
    const res = convert(words, 5, 8, false);
    if (Array.isArray(res))
      return res;
    throw new Error(res);
  }
  function getLibraryFromEncoding(encoding) {
    let ENCODING_CONST;
    if (encoding === "bech32") {
      ENCODING_CONST = 1;
    } else {
      ENCODING_CONST = 734539939;
    }
    function encode(prefix, words, LIMIT) {
      LIMIT = LIMIT || 90;
      if (prefix.length + 7 + words.length > LIMIT)
        throw new TypeError("Exceeds length limit");
      prefix = prefix.toLowerCase();
      let chk = prefixChk(prefix);
      if (typeof chk === "string")
        throw new Error(chk);
      let result = prefix + "1";
      for (let i = 0; i < words.length; ++i) {
        const x = words[i];
        if (x >> 5 !== 0)
          throw new Error("Non 5-bit word");
        chk = polymodStep(chk) ^ x;
        result += ALPHABET2.charAt(x);
      }
      for (let i = 0; i < 6; ++i) {
        chk = polymodStep(chk);
      }
      chk ^= ENCODING_CONST;
      for (let i = 0; i < 6; ++i) {
        const v = chk >> (5 - i) * 5 & 31;
        result += ALPHABET2.charAt(v);
      }
      return result;
    }
    function __decode(str, LIMIT) {
      LIMIT = LIMIT || 90;
      if (str.length < 8)
        return str + " too short";
      if (str.length > LIMIT)
        return "Exceeds length limit";
      const lowered = str.toLowerCase();
      const uppered = str.toUpperCase();
      if (str !== lowered && str !== uppered)
        return "Mixed-case string " + str;
      str = lowered;
      const split2 = str.lastIndexOf("1");
      if (split2 === -1)
        return "No separator character for " + str;
      if (split2 === 0)
        return "Missing prefix for " + str;
      const prefix = str.slice(0, split2);
      const wordChars = str.slice(split2 + 1);
      if (wordChars.length < 6)
        return "Data too short";
      let chk = prefixChk(prefix);
      if (typeof chk === "string")
        return chk;
      const words = [];
      for (let i = 0; i < wordChars.length; ++i) {
        const c = wordChars.charAt(i);
        const v = ALPHABET_MAP[c];
        if (v === void 0)
          return "Unknown character " + c;
        chk = polymodStep(chk) ^ v;
        if (i + 6 >= wordChars.length)
          continue;
        words.push(v);
      }
      if (chk !== ENCODING_CONST)
        return "Invalid checksum for " + str;
      return { prefix, words };
    }
    function decodeUnsafe(str, LIMIT) {
      const res = __decode(str, LIMIT);
      if (typeof res === "object")
        return res;
    }
    function decode(str, LIMIT) {
      const res = __decode(str, LIMIT);
      if (typeof res === "object")
        return res;
      throw new Error(res);
    }
    return {
      decodeUnsafe,
      decode,
      encode,
      toWords,
      fromWordsUnsafe,
      fromWords
    };
  }
  dist.bech32 = getLibraryFromEncoding("bech32");
  dist.bech32m = getLibraryFromEncoding("bech32m");
  return dist;
}
var distExports = requireDist();
const PRIVATE_KEY_SIZE = 32;
const IOTA_PRIVATE_KEY_PREFIX = "iotaprivkey";
let Signer$1 = class Signer {
  /**
   * Sign messages with a specific intent. By combining the message bytes with the intent before hashing and signing,
   * it ensures that a signed message is tied to a specific purpose and domain separator is provided
   */
  async signWithIntent(bytes, intent) {
    const intentMessage = messageWithIntent(intent, bytes);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    const signature = toSerializedSignature({
      signature: await this.sign(digest),
      signatureScheme: this.getKeyScheme(),
      publicKey: this.getPublicKey()
    });
    return {
      signature,
      bytes: toBase64(bytes)
    };
  }
  /**
   * Signs provided transaction by calling `signWithIntent()` with a `TransactionData` provided as intent scope
   */
  async signTransaction(bytes) {
    return this.signWithIntent(bytes, "TransactionData");
  }
  /**
   * Signs provided personal message by calling `signWithIntent()` with a `PersonalMessage` provided as intent scope
   */
  async signPersonalMessage(bytes) {
    const { signature } = await this.signWithIntent(
      bcs.vector(bcs.u8()).serialize(bytes).toBytes(),
      "PersonalMessage"
    );
    return {
      bytes: toBase64(bytes),
      signature
    };
  }
  toIotaAddress() {
    return this.getPublicKey().toIotaAddress();
  }
};
class Keypair extends Signer$1 {
}
function decodeIotaPrivateKey(value) {
  const { prefix, words } = distExports.bech32.decode(value);
  if (prefix !== IOTA_PRIVATE_KEY_PREFIX) {
    throw new Error("invalid private key prefix");
  }
  const extendedSecretKey = new Uint8Array(distExports.bech32.fromWords(words));
  const secretKey = extendedSecretKey.slice(1);
  const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[extendedSecretKey[0]];
  return {
    schema: signatureScheme,
    secretKey
  };
}
function encodeIotaPrivateKey(bytes, scheme) {
  if (bytes.length !== PRIVATE_KEY_SIZE) {
    throw new Error("Invalid bytes length");
  }
  const flag = SIGNATURE_SCHEME_TO_FLAG[scheme];
  const privKeyBytes = new Uint8Array(bytes.length + 1);
  privKeyBytes.set([flag]);
  privKeyBytes.set(bytes, 1);
  return distExports.bech32.encode(IOTA_PRIVATE_KEY_PREFIX, distExports.bech32.toWords(privKeyBytes));
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var naclFast = { exports: {} };
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasRequiredNaclFast;
function requireNaclFast() {
  if (hasRequiredNaclFast) return naclFast.exports;
  hasRequiredNaclFast = 1;
  (function(module) {
    (function(nacl2) {
      var gf = function(init2) {
        var i, r2 = new Float64Array(16);
        if (init2) for (i = 0; i < init2.length; i++) r2[i] = init2[i];
        return r2;
      };
      var randombytes = function() {
        throw new Error("no PRNG");
      };
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
      function ts64(x, i, h, l) {
        x[i] = h >> 24 & 255;
        x[i + 1] = h >> 16 & 255;
        x[i + 2] = h >> 8 & 255;
        x[i + 3] = h & 255;
        x[i + 4] = l >> 24 & 255;
        x[i + 5] = l >> 16 & 255;
        x[i + 6] = l >> 8 & 255;
        x[i + 7] = l & 255;
      }
      function vn(x, xi, y, yi, n) {
        var i, d = 0;
        for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
        return (1 & d - 1 >>> 8) - 1;
      }
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      function core_salsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x1 >>> 0 & 255;
        o[5] = x1 >>> 8 & 255;
        o[6] = x1 >>> 16 & 255;
        o[7] = x1 >>> 24 & 255;
        o[8] = x2 >>> 0 & 255;
        o[9] = x2 >>> 8 & 255;
        o[10] = x2 >>> 16 & 255;
        o[11] = x2 >>> 24 & 255;
        o[12] = x3 >>> 0 & 255;
        o[13] = x3 >>> 8 & 255;
        o[14] = x3 >>> 16 & 255;
        o[15] = x3 >>> 24 & 255;
        o[16] = x4 >>> 0 & 255;
        o[17] = x4 >>> 8 & 255;
        o[18] = x4 >>> 16 & 255;
        o[19] = x4 >>> 24 & 255;
        o[20] = x5 >>> 0 & 255;
        o[21] = x5 >>> 8 & 255;
        o[22] = x5 >>> 16 & 255;
        o[23] = x5 >>> 24 & 255;
        o[24] = x6 >>> 0 & 255;
        o[25] = x6 >>> 8 & 255;
        o[26] = x6 >>> 16 & 255;
        o[27] = x6 >>> 24 & 255;
        o[28] = x7 >>> 0 & 255;
        o[29] = x7 >>> 8 & 255;
        o[30] = x7 >>> 16 & 255;
        o[31] = x7 >>> 24 & 255;
        o[32] = x8 >>> 0 & 255;
        o[33] = x8 >>> 8 & 255;
        o[34] = x8 >>> 16 & 255;
        o[35] = x8 >>> 24 & 255;
        o[36] = x9 >>> 0 & 255;
        o[37] = x9 >>> 8 & 255;
        o[38] = x9 >>> 16 & 255;
        o[39] = x9 >>> 24 & 255;
        o[40] = x10 >>> 0 & 255;
        o[41] = x10 >>> 8 & 255;
        o[42] = x10 >>> 16 & 255;
        o[43] = x10 >>> 24 & 255;
        o[44] = x11 >>> 0 & 255;
        o[45] = x11 >>> 8 & 255;
        o[46] = x11 >>> 16 & 255;
        o[47] = x11 >>> 24 & 255;
        o[48] = x12 >>> 0 & 255;
        o[49] = x12 >>> 8 & 255;
        o[50] = x12 >>> 16 & 255;
        o[51] = x12 >>> 24 & 255;
        o[52] = x13 >>> 0 & 255;
        o[53] = x13 >>> 8 & 255;
        o[54] = x13 >>> 16 & 255;
        o[55] = x13 >>> 24 & 255;
        o[56] = x14 >>> 0 & 255;
        o[57] = x14 >>> 8 & 255;
        o[58] = x14 >>> 16 & 255;
        o[59] = x14 >>> 24 & 255;
        o[60] = x15 >>> 0 & 255;
        o[61] = x15 >>> 8 & 255;
        o[62] = x15 >>> 16 & 255;
        o[63] = x15 >>> 24 & 255;
      }
      function core_hsalsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x5 >>> 0 & 255;
        o[5] = x5 >>> 8 & 255;
        o[6] = x5 >>> 16 & 255;
        o[7] = x5 >>> 24 & 255;
        o[8] = x10 >>> 0 & 255;
        o[9] = x10 >>> 8 & 255;
        o[10] = x10 >>> 16 & 255;
        o[11] = x10 >>> 24 & 255;
        o[12] = x15 >>> 0 & 255;
        o[13] = x15 >>> 8 & 255;
        o[14] = x15 >>> 16 & 255;
        o[15] = x15 >>> 24 & 255;
        o[16] = x6 >>> 0 & 255;
        o[17] = x6 >>> 8 & 255;
        o[18] = x6 >>> 16 & 255;
        o[19] = x6 >>> 24 & 255;
        o[20] = x7 >>> 0 & 255;
        o[21] = x7 >>> 8 & 255;
        o[22] = x7 >>> 16 & 255;
        o[23] = x7 >>> 24 & 255;
        o[24] = x8 >>> 0 & 255;
        o[25] = x8 >>> 8 & 255;
        o[26] = x8 >>> 16 & 255;
        o[27] = x8 >>> 24 & 255;
        o[28] = x9 >>> 0 & 255;
        o[29] = x9 >>> 8 & 255;
        o[30] = x9 >>> 16 & 255;
        o[31] = x9 >>> 24 & 255;
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = x[i];
        }
        return 0;
      }
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
      }
      var poly1305 = function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      };
      poly1305.prototype.blocks = function(m, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d2 = c;
          d2 += h0 * r2;
          d2 += h1 * r1;
          d2 += h2 * r0;
          d2 += h3 * (5 * r9);
          d2 += h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7);
          d2 += h6 * (5 * r6);
          d2 += h7 * (5 * r5);
          d2 += h8 * (5 * r4);
          d2 += h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d2;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g = new Uint16Array(10);
        var c, mask, f, i;
        if (this.leftover) {
          i = this.leftover;
          this.buffer[i++] = 1;
          for (; i < 16; i++) this.buffer[i] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i = 2; i < 10; i++) {
          this.h[i] += c;
          c = this.h[i] >>> 13;
          this.h[i] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g[0] = this.h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++) g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i = 1; i < 8; i++) {
          f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
          this.h[i] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m, mpos, bytes) {
        var i, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes)
            want = bytes;
          for (i = 0; i < want; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16)
            return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i = 0; i < bytes; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s = new poly1305(k);
        s.update(m, mpos, n);
        s.finish(out, outpos);
        return 0;
      }
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16);
        crypto_onetimeauth(x, 0, m, mpos, n, k);
        return crypto_verify_16(h, hpos, x, 0);
      }
      function crypto_secretbox(c, m, d, n, k) {
        var i;
        if (d < 32) return -1;
        crypto_stream_xor(c, 0, m, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i = 0; i < 16; i++) c[i] = 0;
        return 0;
      }
      function crypto_secretbox_open(m, c, d, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d < 32) return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
        crypto_stream_xor(m, 0, c, 0, d, n, k);
        for (i = 0; i < 32; i++) m[i] = 0;
        return 0;
      }
      function set25519(r2, a) {
        var i;
        for (i = 0; i < 16; i++) r2[i] = a[i] | 0;
      }
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; i++) t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32), d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      function par25519(a) {
        var d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
      }
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      function S(o, a) {
        M(o, a, a);
      }
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r2, i;
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
        for (i = 0; i < 31; i++) z[i] = n[i];
        z[31] = n[31] & 127 | 64;
        z[0] &= 248;
        unpack25519(x, p);
        for (i = 0; i < 16; i++) {
          b[i] = x[i];
          d[i] = a[i] = c[i] = 0;
        }
        a[0] = d[0] = 1;
        for (i = 254; i >= 0; --i) {
          r2 = z[i >>> 3] >>> (i & 7) & 1;
          sel25519(a, b, r2);
          sel25519(c, d, r2);
          A(e, a, c);
          Z(a, a, c);
          A(c, b, d);
          Z(b, b, d);
          S(d, e);
          S(f, a);
          M(a, c, a);
          M(c, b, e);
          A(e, a, c);
          Z(a, a, c);
          S(b, a);
          Z(c, d, f);
          M(a, c, _121665);
          A(a, a, d);
          M(c, c, a);
          M(a, d, f);
          M(d, b, x);
          S(b, e);
          sel25519(a, b, r2);
          sel25519(c, d, r2);
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i];
          x[i + 32] = c[i];
          x[i + 48] = b[i];
          x[i + 64] = d[i];
        }
        var x32 = x.subarray(32);
        var x16 = x.subarray(16);
        inv25519(x32, x32);
        M(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      function crypto_box_keypair(y, x) {
        randombytes(x, 32);
        return crypto_scalarmult_base(y, x);
      }
      function crypto_box_beforenm(k, y, x) {
        var s = new Uint8Array(32);
        crypto_scalarmult(s, x, y);
        return crypto_core_hsalsa20(k, _0, s, sigma);
      }
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_afternm(c, m, d, n, k);
      }
      function crypto_box_open(m, c, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_open_afternm(m, c, d, n, k);
      }
      var K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
            wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h & 65535;
                d = h >>> 16;
                h = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++) x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
      }
      function add2(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d, p[2], q[2]);
        A(d, d, d);
        Z(e, b, a);
        Z(f, d, c);
        A(g, d, c);
        A(h, b, a);
        M(p[0], e, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e, h);
      }
      function cswap(p, q, b) {
        var i;
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r2, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r2, ty);
        r2[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add2(q, p);
          add2(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var i;
        if (!seeded) randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
        return 0;
      }
      var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
      function modL(r2, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++) x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r2[i] = x[i] & 255;
        }
      }
      function reduce(r2) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++) x[i] = r2[i];
        for (i = 0; i < 64; i++) r2[i] = 0;
        modL(r2, x);
      }
      function crypto_sign(sm, m, n, sk) {
        var d = new Uint8Array(64), h = new Uint8Array(64), r2 = new Uint8Array(64);
        var i, j, x = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; i++) sm[64 + i] = m[i];
        for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
        crypto_hash(r2, sm.subarray(32), n + 32);
        reduce(r2);
        scalarbase(p, r2);
        pack(sm, p);
        for (i = 32; i < 64; i++) sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++) x[i] = 0;
        for (i = 0; i < 32; i++) x[i] = r2[i];
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      function unpackneg(r2, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r2[2], gf1);
        unpack25519(r2[1], p);
        S(num, r2[1]);
        M(den, num, D);
        Z(num, num, r2[2]);
        A(den, r2[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r2[0], t, den);
        S(chk, r2[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) M(r2[0], r2[0], I);
        S(chk, r2[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) return -1;
        if (par25519(r2[0]) === p[31] >> 7) Z(r2[0], gf0, r2[0]);
        M(r2[3], r2[0], r2[1]);
        return 0;
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64) return -1;
        if (unpackneg(q, pk)) return -1;
        for (i = 0; i < n; i++) m[i] = sm[i];
        for (i = 0; i < 32; i++) m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add2(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++) m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++) m[i] = sm[i + 64];
        return n;
      }
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl2.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add: add2,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      }
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = 0;
      }
      nacl2.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl2.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m.length);
        for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl2.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32) return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl2.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl2.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl2.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey);
        return nacl2.secretbox(msg, nonce, k);
      };
      nacl2.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl2.box.after = nacl2.secretbox;
      nacl2.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey);
        return nacl2.secretbox.open(msg, nonce, k);
      };
      nacl2.box.open.after = nacl2.secretbox.open;
      nacl2.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl2.box.nonceLength = crypto_box_NONCEBYTES;
      nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
      nacl2.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl2.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0) return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++) m[i] = tmp[i];
        return m;
      };
      nacl2.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl2.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
        return sig;
      };
      nacl2.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES)
          throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i;
        for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
        for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      nacl2.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl2.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++) sk[i] = seed[i];
        crypto_sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl2.sign.signatureLength = crypto_sign_BYTES;
      nacl2.hash = function(msg) {
        checkArrayTypes(msg);
        var h = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h, msg, msg.length);
        return h;
      };
      nacl2.hash.hashLength = crypto_hash_BYTES;
      nacl2.verify = function(x, y) {
        checkArrayTypes(x, y);
        if (x.length === 0 || y.length === 0) return false;
        if (x.length !== y.length) return false;
        return vn(x, 0, y, 0, x.length) === 0 ? true : false;
      };
      nacl2.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto2 && crypto2.getRandomValues) {
          var QUOTA = 65536;
          nacl2.setPRNG(function(x, n) {
            var i, v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
              crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++) x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof commonjsRequire !== "undefined") {
          crypto2 = require$$0;
          if (crypto2 && crypto2.randomBytes) {
            nacl2.setPRNG(function(x, n) {
              var i, v = crypto2.randomBytes(n);
              for (i = 0; i < n; i++) x[i] = v[i];
              cleanup(v);
            });
          }
        }
      })();
    })(module.exports ? module.exports : self.nacl = self.nacl || {});
  })(naclFast);
  return naclFast.exports;
}
var naclFastExports = requireNaclFast();
const nacl = /* @__PURE__ */ getDefaultExportFromCjs(naclFastExports);
const sha512 = sha512$1;
const ED25519_CURVE = "ed25519 seed";
const HARDENED_OFFSET$1 = 2147483648;
const pathRegex = new RegExp("^m(\\/[0-9]+')+$");
const replaceDerive = (val) => val.replace("'", "");
const getMasterKeyFromSeed = (seed) => {
  const h = hmac.create(sha512, ED25519_CURVE);
  const I = h.update(fromHex(seed)).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
const CKDPriv = ({ key, chainCode }, index2) => {
  const indexBuffer = new ArrayBuffer(4);
  const cv = new DataView(indexBuffer);
  cv.setUint32(0, index2);
  const data = new Uint8Array(1 + key.length + indexBuffer.byteLength);
  data.set(new Uint8Array(1).fill(0));
  data.set(key, 1);
  data.set(new Uint8Array(indexBuffer, 0, indexBuffer.byteLength), key.length + 1);
  const I = hmac.create(sha512, chainCode).update(data).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
const isValidPath = (path) => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path.split("/").slice(1).map(replaceDerive).some(
    isNaN
    /* ts T_T*/
  );
};
const derivePath = (path, seed, offset = HARDENED_OFFSET$1) => {
  if (!isValidPath(path)) {
    throw new Error("Invalid derivation path");
  }
  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path.split("/").slice(1).map(replaceDerive).map((el) => parseInt(el, 10));
  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), {
    key,
    chainCode
  });
};
const PUBLIC_KEY_SIZE = 32;
class Ed25519PublicKey extends PublicKey {
  /**
   * Create a new Ed25519PublicKey object
   * @param value ed25519 public key as buffer or base-64 encoded string
   */
  constructor(value) {
    super();
    if (typeof value === "string") {
      this.data = fromBase64(value);
    } else if (value instanceof Uint8Array) {
      this.data = value;
    } else {
      this.data = Uint8Array.from(value);
    }
    if (this.data.length !== PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`
      );
    }
  }
  /**
   * Checks if two Ed25519 public keys are equal
   */
  equals(publicKey) {
    return super.equals(publicKey);
  }
  /**
   * Return the byte array representation of the Ed25519 public key
   */
  toRawBytes() {
    return this.data;
  }
  /**
   * Return the IOTA address associated with this Ed25519 public key
   */
  flag() {
    return SIGNATURE_SCHEME_TO_FLAG["ED25519"];
  }
  /**
   * Verifies that the signature is valid for the provided message
   */
  async verify(message, signature) {
    let bytes;
    if (typeof signature === "string") {
      const parsed = parseSerializedSignature(signature);
      if (parsed.signatureScheme !== "ED25519") {
        throw new Error("Invalid signature scheme");
      }
      if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) {
        throw new Error("Signature does not match public key");
      }
      bytes = parsed.signature;
    } else {
      bytes = signature;
    }
    return nacl.sign.detached.verify(message, bytes, this.toRawBytes());
  }
}
Ed25519PublicKey.SIZE = PUBLIC_KEY_SIZE;
const DEFAULT_ED25519_DERIVATION_PATH = "m/44'/4218'/0'/0'/0'";
class Ed25519Keypair extends Keypair {
  /**
   * Create a new Ed25519 keypair instance.
   * Generate random keypair if no {@link Ed25519Keypair} is provided.
   *
   * @param keypair Ed25519 keypair
   */
  constructor(keypair) {
    super();
    if (keypair) {
      this.keypair = keypair;
    } else {
      this.keypair = nacl.sign.keyPair();
    }
  }
  /**
   * Get the key scheme of the keypair ED25519
   */
  getKeyScheme() {
    return "ED25519";
  }
  /**
   * Generate a new random Ed25519 keypair
   */
  static generate() {
    return new Ed25519Keypair(nacl.sign.keyPair());
  }
  /**
   * Create a Ed25519 keypair from a raw secret key byte array, also known as seed.
   * This is NOT the private scalar which is result of hashing and bit clamping of
   * the raw secret key.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key as a byte array or Bech32 secret key string
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey, options) {
    if (typeof secretKey === "string") {
      const decoded = decodeIotaPrivateKey(secretKey);
      if (decoded.schema !== "ED25519") {
        throw new Error(`Expected a ED25519 keypair, got ${decoded.schema}`);
      }
      return this.fromSecretKey(decoded.secretKey, options);
    }
    const secretKeyLength = secretKey.length;
    if (secretKeyLength !== PRIVATE_KEY_SIZE) {
      throw new Error(
        `Wrong secretKey size. Expected ${PRIVATE_KEY_SIZE} bytes, got ${secretKeyLength}.`
      );
    }
    const keypair = nacl.sign.keyPair.fromSeed(secretKey);
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode("iota validation");
      const signature = nacl.sign.detached(signData, keypair.secretKey);
      if (!nacl.sign.detached.verify(signData, signature, keypair.publicKey)) {
        throw new Error("provided secretKey is invalid");
      }
    }
    return new Ed25519Keypair(keypair);
  }
  /**
   * The public key for this Ed25519 keypair
   */
  getPublicKey() {
    return new Ed25519PublicKey(this.keypair.publicKey);
  }
  /**
   * The Bech32 secret key string for this Ed25519 keypair
   */
  getSecretKey() {
    return encodeIotaPrivateKey(
      this.keypair.secretKey.slice(0, PRIVATE_KEY_SIZE),
      this.getKeyScheme()
    );
  }
  /**
   * Return the signature for the provided data using Ed25519.
   */
  async sign(data) {
    return nacl.sign.detached(data, this.keypair.secretKey);
  }
  /**
   * Derive Ed25519 keypair from mnemonics and path. The mnemonics must be normalized
   * and validated against the english wordlist.
   *
   * If path is none, it will default to m/44'/4218'/0'/0'/0', otherwise the path must
   * be compliant to SLIP-0010 in form m/44'/4218'/{account_index}'/{change_index}'/{address_index}'.
   */
  static deriveKeypair(mnemonics, path) {
    if (path == null) {
      path = DEFAULT_ED25519_DERIVATION_PATH;
    }
    if (!isValidHardenedPath(path)) {
      throw new Error("Invalid derivation path");
    }
    const { key } = derivePath(path, mnemonicToSeedHex(mnemonics));
    return Ed25519Keypair.fromSecretKey(key);
  }
  /**
   * Derive Ed25519 keypair from mnemonicSeed and path.
   *
   * If path is none, it will default to m/44'/4218'/0'/0'/0', otherwise the path must
   * be compliant to SLIP-0010 in form m/44'/4218'/{account_index}'/{change_index}'/{address_index}'.
   */
  static deriveKeypairFromSeed(seedHex, path) {
    if (path == null) {
      path = DEFAULT_ED25519_DERIVATION_PATH;
    }
    if (!isValidHardenedPath(path)) {
      throw new Error("Invalid derivation path");
    }
    const { key } = derivePath(path, seedHex);
    return Ed25519Keypair.fromSecretKey(key);
  }
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
const secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
const _2n = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n2 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n2, P) * b3 % P;
  const b9 = pow2(b6, _3n2, P) * b3 % P;
  const b11 = pow2(b9, _2n, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n2, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root2 = pow2(t2, _2n, P);
  if (!Fpk1.eql(Fpk1.sqr(root2), y))
    throw new Error("Cannot find square root");
  return root2;
}
const Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
const secp256k1 = createCurve({ ...secp256k1_CURVE, Fp: Fpk1, lowS: true, endo: secp256k1_ENDO }, sha256$1);
const Rho160 = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]);
const Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
const Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
const idxLR = /* @__PURE__ */ (() => {
  const L = [Id160];
  const R = [Pi160];
  const res = [L, R];
  for (let i = 0; i < 4; i++)
    for (let j of res)
      j.push(j[i].map((k) => Rho160[k]));
  return res;
})();
const idxL = /* @__PURE__ */ (() => idxLR[0])();
const idxR = /* @__PURE__ */ (() => idxLR[1])();
const shifts160 = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i) => Uint8Array.from(i));
const shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
const shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
const Kl160 = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
const Kr160 = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
const BUF_160 = /* @__PURE__ */ new Uint32Array(16);
class RIPEMD160 extends HashMD {
  constructor() {
    super(64, 20, 8, true);
    this.h0 = 1732584193 | 0;
    this.h1 = 4023233417 | 0;
    this.h2 = 2562383102 | 0;
    this.h3 = 271733878 | 0;
    this.h4 = 3285377520 | 0;
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      BUF_160[i] = view.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group], hbr = Kr160[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL160[group], sr = shiftsR160[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    clean(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
}
const ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());
/*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const Point = secp256k1.ProjectivePoint;
const base58check = createBase58check(sha256$1);
function bytesToNumber(bytes) {
  abytes(bytes);
  const h = bytes.length === 0 ? "0" : bytesToHex(bytes);
  return BigInt("0x" + h);
}
function numberToBytes(num) {
  if (typeof num !== "bigint")
    throw new Error("bigint expected");
  return hexToBytes(num.toString(16).padStart(64, "0"));
}
const MASTER_SECRET = utf8ToBytes("Bitcoin seed");
const BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
const HARDENED_OFFSET = 2147483648;
const hash160 = (data) => ripemd160(sha256$1(data));
const fromU32 = (data) => createView(data).getUint32(0, false);
const toU32 = (n) => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
    throw new Error("invalid number, should be from 0 to 2**32-1, got " + n);
  }
  const buf = new Uint8Array(4);
  createView(buf).setUint32(0, n, false);
  return buf;
};
class HDKey {
  get fingerprint() {
    if (!this.pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  get privateKey() {
    return this.privKeyBytes || null;
  }
  get publicKey() {
    return this.pubKey || null;
  }
  get privateExtendedKey() {
    const priv = this.privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check.encode(this.serialize(this.versions.private, concatBytes(new Uint8Array([0]), priv)));
  }
  get publicExtendedKey() {
    if (!this.pubKey) {
      throw new Error("No public key");
    }
    return base58check.encode(this.serialize(this.versions.public, this.pubKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    abytes(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
    }
    const I = hmac(sha512$1, MASTER_SECRET, seed);
    return new HDKey({
      versions,
      chainCode: I.slice(32),
      privateKey: I.slice(0, 32)
    });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    const keyBuffer = base58check.decode(base58key);
    const keyView = createView(keyBuffer);
    const version = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new HDKey({ ...opt, privateKey: key.slice(1) });
    } else {
      return new HDKey({ ...opt, publicKey: key });
    }
  }
  static fromJSON(json) {
    return HDKey.fromExtendedKey(json.xpriv);
  }
  constructor(opt) {
    this.depth = 0;
    this.index = 0;
    this.chainCode = null;
    this.parentFingerprint = 0;
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    this.versions = opt.versions || BITCOIN_VERSIONS;
    this.depth = opt.depth || 0;
    this.chainCode = opt.chainCode || null;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) {
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      }
    }
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidPrivateKey(opt.privateKey)) {
        throw new Error("Invalid private key");
      }
      this.privKey = typeof opt.privateKey === "bigint" ? opt.privateKey : bytesToNumber(opt.privateKey);
      this.privKeyBytes = numberToBytes(this.privKey);
      this.pubKey = secp256k1.getPublicKey(opt.privateKey, true);
    } else if (opt.publicKey) {
      this.pubKey = Point.fromHex(opt.publicKey).toRawBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this.pubHash = hash160(this.pubKey);
  }
  derive(path) {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, "").split("/");
    let child2 = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      const m1 = m && m[1];
      if (!m || m.length !== 3 || typeof m1 !== "string")
        throw new Error("invalid child index: " + c);
      let idx = +m1;
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child2 = child2.deriveChild(idx);
    }
    return child2;
  }
  deriveChild(index2) {
    if (!this.pubKey || !this.chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index2);
    if (index2 >= HARDENED_OFFSET) {
      const priv = this.privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes(new Uint8Array([0]), priv, data);
    } else {
      data = concatBytes(this.pubKey, data);
    }
    const I = hmac(sha512$1, this.chainCode, data);
    const childTweak = bytesToNumber(I.slice(0, 32));
    const chainCode = I.slice(32);
    if (!secp256k1.utils.isValidPrivateKey(childTweak)) {
      throw new Error("Tweak bigger than curve order");
    }
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index: index2
    };
    try {
      if (this.privateKey) {
        const added = mod(this.privKey + childTweak, secp256k1.CURVE.n);
        if (!secp256k1.utils.isValidPrivateKey(added)) {
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        }
        opt.privateKey = added;
      } else {
        const added = Point.fromHex(this.pubKey).add(Point.fromPrivateKey(childTweak));
        if (added.equals(Point.ZERO)) {
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        }
        opt.publicKey = added.toRawBytes(true);
      }
      return new HDKey(opt);
    } catch (err) {
      return this.deriveChild(index2 + 1);
    }
  }
  sign(hash) {
    if (!this.privateKey) {
      throw new Error("No privateKey set!");
    }
    abytes(hash, 32);
    return secp256k1.sign(hash, this.privKey).toCompactRawBytes();
  }
  verify(hash, signature) {
    abytes(hash, 32);
    abytes(signature, 64);
    if (!this.publicKey) {
      throw new Error("No publicKey set!");
    }
    let sig;
    try {
      sig = secp256k1.Signature.fromCompact(signature);
    } catch (error) {
      return false;
    }
    return secp256k1.verify(sig, hash, this.publicKey);
  }
  wipePrivateData() {
    this.privKey = void 0;
    if (this.privKeyBytes) {
      this.privKeyBytes.fill(0);
      this.privKeyBytes = void 0;
    }
    return this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version, key) {
    if (!this.chainCode) {
      throw new Error("No chainCode set");
    }
    abytes(key, 33);
    return concatBytes(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
  }
}
const SECP256K1_PUBLIC_KEY_SIZE = 33;
class Secp256k1PublicKey extends PublicKey {
  /**
   * Create a new Secp256k1PublicKey object
   * @param value secp256k1 public key as buffer or base-64 encoded string
   */
  constructor(value) {
    super();
    if (typeof value === "string") {
      this.data = fromBase64(value);
    } else if (value instanceof Uint8Array) {
      this.data = value;
    } else {
      this.data = Uint8Array.from(value);
    }
    if (this.data.length !== SECP256K1_PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${SECP256K1_PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`
      );
    }
  }
  /**
   * Checks if two Secp256k1 public keys are equal
   */
  equals(publicKey) {
    return super.equals(publicKey);
  }
  /**
   * Return the byte array representation of the Secp256k1 public key
   */
  toRawBytes() {
    return this.data;
  }
  /**
   * Return the IOTA address associated with this Secp256k1 public key
   */
  flag() {
    return SIGNATURE_SCHEME_TO_FLAG["Secp256k1"];
  }
  /**
   * Verifies that the signature is valid for the provided message
   */
  async verify(message, signature) {
    let bytes;
    if (typeof signature === "string") {
      const parsed = parseSerializedSignature(signature);
      if (parsed.signatureScheme !== "Secp256k1") {
        throw new Error("Invalid signature scheme");
      }
      if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) {
        throw new Error("Signature does not match public key");
      }
      bytes = parsed.signature;
    } else {
      bytes = signature;
    }
    return secp256k1.verify(
      secp256k1.Signature.fromCompact(bytes),
      sha256(message),
      this.toRawBytes()
    );
  }
}
Secp256k1PublicKey.SIZE = SECP256K1_PUBLIC_KEY_SIZE;
const DEFAULT_SECP256K1_DERIVATION_PATH = "m/54'/4218'/0'/0/0";
class Secp256k1Keypair extends Keypair {
  /**
   * Create a new keypair instance.
   * Generate random keypair if no {@link Secp256k1Keypair} is provided.
   *
   * @param keypair secp256k1 keypair
   */
  constructor(keypair) {
    super();
    if (keypair) {
      this.keypair = keypair;
    } else {
      const secretKey = secp256k1.utils.randomPrivateKey();
      const publicKey = secp256k1.getPublicKey(secretKey, true);
      this.keypair = { publicKey, secretKey };
    }
  }
  /**
   * Get the key scheme of the keypair Secp256k1
   */
  getKeyScheme() {
    return "Secp256k1";
  }
  /**
   * Generate a new random keypair
   */
  static generate() {
    return new Secp256k1Keypair();
  }
  /**
   * Create a keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key. Generating keypairs from a random seed should be done
   * with the {@link Keypair.fromSeed} method.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array  or Bech32 secret key string
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey, options) {
    if (typeof secretKey === "string") {
      const decoded = decodeIotaPrivateKey(secretKey);
      if (decoded.schema !== "Secp256k1") {
        throw new Error(`Expected a Secp256k1 keypair, got ${decoded.schema}`);
      }
      return this.fromSecretKey(decoded.secretKey, options);
    }
    const publicKey = secp256k1.getPublicKey(secretKey, true);
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode("iota validation");
      const msgHash = bytesToHex(blake2b(signData, { dkLen: 32 }));
      const signature = secp256k1.sign(msgHash, secretKey);
      if (!secp256k1.verify(signature, msgHash, publicKey, { lowS: true })) {
        throw new Error("Provided secretKey is invalid");
      }
    }
    return new Secp256k1Keypair({ publicKey, secretKey });
  }
  /**
   * Generate a keypair from a 32 byte seed.
   *
   * @param seed seed byte array
   */
  static fromSeed(seed) {
    const publicKey = secp256k1.getPublicKey(seed, true);
    return new Secp256k1Keypair({ publicKey, secretKey: seed });
  }
  /**
   * The public key for this keypair
   */
  getPublicKey() {
    return new Secp256k1PublicKey(this.keypair.publicKey);
  }
  /**
   * The Bech32 secret key string for this Secp256k1 keypair
   */
  getSecretKey() {
    return encodeIotaPrivateKey(this.keypair.secretKey, this.getKeyScheme());
  }
  /**
   * Return the signature for the provided data.
   */
  async sign(data) {
    const msgHash = sha256(data);
    const sig = secp256k1.sign(msgHash, this.keypair.secretKey, {
      lowS: true
    });
    return sig.toCompactRawBytes();
  }
  /**
   * Derive Secp256k1 keypair from mnemonics and path. The mnemonics must be normalized
   * and validated against the english wordlist.
   *
   * If path is none, it will default to m/54'/4218'/0'/0/0, otherwise the path must
   * be compliant to BIP-32 in form m/54'/4218'/{account_index}'/{change_index}/{address_index}.
   */
  static deriveKeypair(mnemonics, path) {
    if (path == null) {
      path = DEFAULT_SECP256K1_DERIVATION_PATH;
    }
    if (!isValidBIP32Path(path)) {
      throw new Error("Invalid derivation path");
    }
    const key = HDKey.fromMasterSeed(mnemonicToSeed(mnemonics)).derive(path);
    if (key.publicKey == null || key.privateKey == null) {
      throw new Error("Invalid key");
    }
    return new Secp256k1Keypair({
      publicKey: key.publicKey,
      secretKey: key.privateKey
    });
  }
}
const SECP256R1_PUBLIC_KEY_SIZE = 33;
class Secp256r1PublicKey extends PublicKey {
  /**
   * Create a new Secp256r1PublicKey object
   * @param value secp256r1 public key as buffer or base-64 encoded string
   */
  constructor(value) {
    super();
    if (typeof value === "string") {
      this.data = fromBase64(value);
    } else if (value instanceof Uint8Array) {
      this.data = value;
    } else {
      this.data = Uint8Array.from(value);
    }
    if (this.data.length !== SECP256R1_PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${SECP256R1_PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`
      );
    }
  }
  /**
   * Checks if two Secp256r1 public keys are equal
   */
  equals(publicKey) {
    return super.equals(publicKey);
  }
  /**
   * Return the byte array representation of the Secp256r1 public key
   */
  toRawBytes() {
    return this.data;
  }
  /**
   * Return the IOTA address associated with this Secp256r1 public key
   */
  flag() {
    return SIGNATURE_SCHEME_TO_FLAG["Secp256r1"];
  }
  /**
   * Verifies that the signature is valid for the provided message
   */
  async verify(message, signature) {
    let bytes;
    if (typeof signature === "string") {
      const parsed = parseSerializedSignature(signature);
      if (parsed.signatureScheme !== "Secp256r1") {
        throw new Error("Invalid signature scheme");
      }
      if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) {
        throw new Error("Signature does not match public key");
      }
      bytes = parsed.signature;
    } else {
      bytes = signature;
    }
    return secp256r1.verify(
      secp256r1.Signature.fromCompact(bytes),
      sha256(message),
      this.toRawBytes()
    );
  }
}
Secp256r1PublicKey.SIZE = SECP256R1_PUBLIC_KEY_SIZE;
const DEFAULT_SECP256R1_DERIVATION_PATH = "m/74'/4218'/0'/0/0";
class Secp256r1Keypair extends Keypair {
  /**
   * Create a new keypair instance.
   * Generate random keypair if no {@link Secp256r1Keypair} is provided.
   *
   * @param keypair Secp256r1 keypair
   */
  constructor(keypair) {
    super();
    if (keypair) {
      this.keypair = keypair;
    } else {
      const secretKey = secp256r1.utils.randomPrivateKey();
      const publicKey = secp256r1.getPublicKey(secretKey, true);
      this.keypair = { publicKey, secretKey };
    }
  }
  /**
   * Get the key scheme of the keypair Secp256r1
   */
  getKeyScheme() {
    return "Secp256r1";
  }
  /**
   * Generate a new random keypair
   */
  static generate() {
    return new Secp256r1Keypair();
  }
  /**
   * Create a keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key. Generating keypairs from a random seed should be done
   * with the {@link Keypair.fromSeed} method.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array or Bech32 secret key string* @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey, options) {
    if (typeof secretKey === "string") {
      const decoded = decodeIotaPrivateKey(secretKey);
      if (decoded.schema !== "Secp256r1") {
        throw new Error(`Expected a Secp256r1 keypair, got ${decoded.schema}`);
      }
      return this.fromSecretKey(decoded.secretKey, options);
    }
    const publicKey = secp256r1.getPublicKey(secretKey, true);
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode("iota validation");
      const msgHash = bytesToHex(blake2b(signData, { dkLen: 32 }));
      const signature = secp256r1.sign(msgHash, secretKey, { lowS: true });
      if (!secp256r1.verify(signature, msgHash, publicKey, { lowS: true })) {
        throw new Error("Provided secretKey is invalid");
      }
    }
    return new Secp256r1Keypair({ publicKey, secretKey });
  }
  /**
   * Generate a keypair from a 32 byte seed.
   *
   * @param seed seed byte array
   */
  static fromSeed(seed) {
    const publicKey = secp256r1.getPublicKey(seed, true);
    return new Secp256r1Keypair({ publicKey, secretKey: seed });
  }
  /**
   * The public key for this keypair
   */
  getPublicKey() {
    return new Secp256r1PublicKey(this.keypair.publicKey);
  }
  /**
   * The Bech32 secret key string for this Secp256r1 keypair
   */
  getSecretKey() {
    return encodeIotaPrivateKey(this.keypair.secretKey, this.getKeyScheme());
  }
  /**
   * Return the signature for the provided data.
   */
  async sign(data) {
    const msgHash = sha256(data);
    const sig = secp256r1.sign(msgHash, this.keypair.secretKey, {
      lowS: true
    });
    return sig.toCompactRawBytes();
  }
  /**
   * Derive Secp256r1 keypair from mnemonics and path. The mnemonics must be normalized
   * and validated against the english wordlist.
   *
   * If path is none, it will default to m/74'/4218'/0'/0/0, otherwise the path must
   * be compliant to BIP-32 in form m/74'/4218'/{account_index}'/{change_index}/{address_index}.
   */
  static deriveKeypair(mnemonics, path) {
    if (path == null) {
      path = DEFAULT_SECP256R1_DERIVATION_PATH;
    }
    if (!isValidBIP32Path(path)) {
      throw new Error("Invalid derivation path");
    }
    const privateKey = HDKey.fromMasterSeed(mnemonicToSeed(mnemonics)).derive(path).privateKey;
    return Secp256r1Keypair.fromSecretKey(privateKey);
  }
}
const PACKAGE_VERSION = "1.7.0";
const TARGETED_RPC_VERSION = "1.12.0-alpha";
const CODE_TO_ERROR_TYPE = {
  "-32700": "ParseError",
  "-32701": "OversizedRequest",
  "-32702": "OversizedResponse",
  "-32600": "InvalidRequest",
  "-32601": "MethodNotFound",
  "-32602": "InvalidParams",
  "-32603": "InternalError",
  "-32604": "ServerBusy",
  "-32000": "CallExecutionFailed",
  "-32001": "UnknownError",
  "-32003": "SubscriptionClosed",
  "-32004": "SubscriptionClosedWithError",
  "-32005": "BatchesNotSupported",
  "-32006": "TooManySubscriptions",
  "-32050": "TransientError",
  "-32002": "TransactionExecutionClientError"
};
class IotaHTTPTransportError extends Error {
}
class JsonRpcError extends IotaHTTPTransportError {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.type = CODE_TO_ERROR_TYPE[code] ?? "ServerError";
  }
}
class IotaHTTPStatusError extends IotaHTTPTransportError {
  constructor(message, status, statusText) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}
var __typeError$3 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$3 = (obj, member, msg) => member.has(obj) || __typeError$3("Cannot " + msg);
var __privateGet$3 = (obj, member, getter) => (__accessCheck$3(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$3 = (obj, member, value) => member.has(obj) ? __typeError$3("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$3 = (obj, member, value, setter) => (__accessCheck$3(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod$3 = (obj, member, method) => (__accessCheck$3(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet$3(obj, member, value);
  },
  get _() {
    return __privateGet$3(obj, member, getter);
  }
});
var _requestId$1, _disconnects, _webSocket, _connectionPromise, _subscriptions, _pendingRequests, _WebsocketClient_instances, setupWebSocket_fn, reconnect_fn;
function getWebsocketUrl(httpUrl) {
  const url = new URL(httpUrl);
  url.protocol = url.protocol.replace("http", "ws");
  return url.toString();
}
const DEFAULT_CLIENT_OPTIONS = {
  // We fudge the typing because we also check for undefined in the constructor:
  WebSocketConstructor: typeof WebSocket !== "undefined" ? WebSocket : void 0,
  callTimeout: 3e4,
  reconnectTimeout: 3e3,
  maxReconnects: 5
};
class WebsocketClient {
  constructor(endpoint, options = {}) {
    __privateAdd$3(this, _WebsocketClient_instances);
    __privateAdd$3(this, _requestId$1, 0);
    __privateAdd$3(this, _disconnects, 0);
    __privateAdd$3(this, _webSocket, null);
    __privateAdd$3(this, _connectionPromise, null);
    __privateAdd$3(this, _subscriptions, /* @__PURE__ */ new Set());
    __privateAdd$3(this, _pendingRequests, /* @__PURE__ */ new Map());
    this.endpoint = endpoint;
    this.options = { ...DEFAULT_CLIENT_OPTIONS, ...options };
    if (!this.options.WebSocketConstructor) {
      throw new Error("Missing WebSocket constructor");
    }
    if (this.endpoint.startsWith("http")) {
      this.endpoint = getWebsocketUrl(this.endpoint);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async makeRequest(method, params) {
    const webSocket = await __privateMethod$3(this, _WebsocketClient_instances, setupWebSocket_fn).call(this);
    return new Promise((resolve, reject) => {
      __privateSet$3(this, _requestId$1, __privateGet$3(this, _requestId$1) + 1);
      __privateGet$3(this, _pendingRequests).set(__privateGet$3(this, _requestId$1), {
        resolve,
        reject,
        timeout: setTimeout(() => {
          __privateGet$3(this, _pendingRequests).delete(__privateGet$3(this, _requestId$1));
          reject(new Error(`Request timeout: ${method}`));
        }, this.options.callTimeout)
      });
      webSocket.send(JSON.stringify({ jsonrpc: "2.0", id: __privateGet$3(this, _requestId$1), method, params }));
    }).then(({ error, result }) => {
      if (error) {
        throw new JsonRpcError(error.message, error.code);
      }
      return result;
    });
  }
  async subscribe(input) {
    const subscription = new RpcSubscription(input);
    __privateGet$3(this, _subscriptions).add(subscription);
    await subscription.subscribe(this);
    return () => subscription.unsubscribe(this);
  }
}
_requestId$1 = /* @__PURE__ */ new WeakMap();
_disconnects = /* @__PURE__ */ new WeakMap();
_webSocket = /* @__PURE__ */ new WeakMap();
_connectionPromise = /* @__PURE__ */ new WeakMap();
_subscriptions = /* @__PURE__ */ new WeakMap();
_pendingRequests = /* @__PURE__ */ new WeakMap();
_WebsocketClient_instances = /* @__PURE__ */ new WeakSet();
setupWebSocket_fn = function() {
  if (__privateGet$3(this, _connectionPromise)) {
    return __privateGet$3(this, _connectionPromise);
  }
  __privateSet$3(this, _connectionPromise, new Promise((resolve) => {
    var _a2;
    (_a2 = __privateGet$3(this, _webSocket)) == null ? void 0 : _a2.close();
    __privateSet$3(this, _webSocket, new this.options.WebSocketConstructor(this.endpoint));
    __privateGet$3(this, _webSocket).addEventListener("open", () => {
      __privateSet$3(this, _disconnects, 0);
      resolve(__privateGet$3(this, _webSocket));
    });
    __privateGet$3(this, _webSocket).addEventListener("close", () => {
      __privateWrapper(this, _disconnects)._++;
      if (__privateGet$3(this, _disconnects) <= this.options.maxReconnects) {
        setTimeout(() => {
          __privateMethod$3(this, _WebsocketClient_instances, reconnect_fn).call(this);
        }, this.options.reconnectTimeout);
      }
    });
    __privateGet$3(this, _webSocket).addEventListener("message", ({ data }) => {
      let json;
      try {
        json = JSON.parse(data);
      } catch (error) {
        console.error(
          new Error(`Failed to parse RPC message: ${data}`, { cause: error })
        );
        return;
      }
      if ("id" in json && json.id != null && __privateGet$3(this, _pendingRequests).has(json.id)) {
        const { resolve: resolve2, timeout } = __privateGet$3(this, _pendingRequests).get(json.id);
        clearTimeout(timeout);
        resolve2(json);
      } else if ("params" in json) {
        const { params } = json;
        __privateGet$3(this, _subscriptions).forEach((subscription) => {
          if (subscription.subscriptionId === params.subscription) {
            if (params.subscription === subscription.subscriptionId) {
              subscription.onMessage(params.result);
            }
          }
        });
      }
    });
  }));
  return __privateGet$3(this, _connectionPromise);
};
reconnect_fn = async function() {
  var _a2;
  (_a2 = __privateGet$3(this, _webSocket)) == null ? void 0 : _a2.close();
  __privateSet$3(this, _connectionPromise, null);
  return Promise.allSettled(
    [...__privateGet$3(this, _subscriptions)].map((subscription) => subscription.subscribe(this))
  );
};
class RpcSubscription {
  constructor(input) {
    this.subscriptionId = null;
    this.subscribed = false;
    this.input = input;
  }
  onMessage(message) {
    if (this.subscribed) {
      this.input.onMessage(message);
    }
  }
  async unsubscribe(client2) {
    const { subscriptionId } = this;
    this.subscribed = false;
    if (subscriptionId == null) return false;
    this.subscriptionId = null;
    return client2.makeRequest(this.input.unsubscribe, [subscriptionId]);
  }
  async subscribe(client2) {
    this.subscriptionId = null;
    this.subscribed = true;
    const newSubscriptionId = await client2.makeRequest(
      this.input.method,
      this.input.params
    );
    if (this.subscribed) {
      this.subscriptionId = newSubscriptionId;
    }
  }
}
var __typeError$2 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$2 = (obj, member, msg) => member.has(obj) || __typeError$2("Cannot " + msg);
var __privateGet$2 = (obj, member, getter) => (__accessCheck$2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$2 = (obj, member, value) => member.has(obj) ? __typeError$2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$2 = (obj, member, value, setter) => (__accessCheck$2(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod$2 = (obj, member, method) => (__accessCheck$2(obj, member, "access private method"), method);
var _requestId, _options$1, _websocketClient, _IotaHTTPTransport_instances, getWebsocketClient_fn;
class IotaHTTPTransport {
  constructor(options) {
    __privateAdd$2(this, _IotaHTTPTransport_instances);
    __privateAdd$2(this, _requestId, 0);
    __privateAdd$2(this, _options$1);
    __privateAdd$2(this, _websocketClient);
    __privateSet$2(this, _options$1, options);
  }
  fetch(input, init2) {
    const fetchFn = __privateGet$2(this, _options$1).fetch ?? fetch;
    if (!fetchFn) {
      throw new Error(
        "The current environment does not support fetch, you can provide a fetch implementation in the options for IotaHTTPTransport."
      );
    }
    return fetchFn(input, init2);
  }
  async request(input) {
    var _a2, _b;
    __privateSet$2(this, _requestId, __privateGet$2(this, _requestId) + 1);
    const res = await this.fetch(((_a2 = __privateGet$2(this, _options$1).rpc) == null ? void 0 : _a2.url) ?? __privateGet$2(this, _options$1).url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        "Client-Sdk-Version": PACKAGE_VERSION,
        "Client-Target-Api-Version": TARGETED_RPC_VERSION,
        ...(_b = __privateGet$2(this, _options$1).rpc) == null ? void 0 : _b.headers
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: __privateGet$2(this, _requestId),
        method: input.method,
        params: input.params
      })
    });
    if (!res.ok) {
      throw new IotaHTTPStatusError(
        `Unexpected status code: ${res.status}`,
        res.status,
        res.statusText
      );
    }
    const data = await res.json();
    if ("error" in data && data.error != null) {
      throw new JsonRpcError(data.error.message, data.error.code);
    }
    return data.result;
  }
  async subscribe(input) {
    const unsubscribe = await __privateMethod$2(this, _IotaHTTPTransport_instances, getWebsocketClient_fn).call(this).subscribe(input);
    return async () => !!await unsubscribe();
  }
}
_requestId = /* @__PURE__ */ new WeakMap();
_options$1 = /* @__PURE__ */ new WeakMap();
_websocketClient = /* @__PURE__ */ new WeakMap();
_IotaHTTPTransport_instances = /* @__PURE__ */ new WeakSet();
getWebsocketClient_fn = function() {
  var _a2;
  if (!__privateGet$2(this, _websocketClient)) {
    const WebSocketConstructor = __privateGet$2(this, _options$1).WebSocketConstructor ?? WebSocket;
    if (!WebSocketConstructor) {
      throw new Error(
        "The current environment does not support WebSocket, you can provide a WebSocketConstructor in the options for IotaHTTPTransport."
      );
    }
    __privateSet$2(this, _websocketClient, new WebsocketClient(
      ((_a2 = __privateGet$2(this, _options$1).websocket) == null ? void 0 : _a2.url) ?? __privateGet$2(this, _options$1).url,
      {
        WebSocketConstructor,
        ...__privateGet$2(this, _options$1).websocket
      }
    ));
  }
  return __privateGet$2(this, _websocketClient);
};
const IOTA_DECIMALS = 9;
BigInt(1e9);
const MOVE_STDLIB_ADDRESS = "0x1";
const IOTA_FRAMEWORK_ADDRESS = "0x2";
const IOTA_CLOCK_OBJECT_ID = normalizeIotaObjectId("0x6");
const IOTA_TYPE_ARG = `${IOTA_FRAMEWORK_ADDRESS}::iota::IOTA`;
const IOTA_SYSTEM_STATE_OBJECT_ID = normalizeIotaObjectId("0x5");
const OBJECT_MODULE_NAME = "object";
const ID_STRUCT_NAME = "ID";
const STD_ASCII_MODULE_NAME = "ascii";
const STD_ASCII_STRUCT_NAME = "String";
const STD_UTF8_MODULE_NAME = "string";
const STD_UTF8_STRUCT_NAME = "String";
const STD_OPTION_MODULE_NAME = "option";
const STD_OPTION_STRUCT_NAME = "Option";
function isTxContext(param) {
  const struct = typeof param.body === "object" && "datatype" in param.body ? param.body.datatype : null;
  return !!struct && normalizeIotaAddress(struct.package) === normalizeIotaAddress("0x2") && struct.module === "tx_context" && struct.type === "TxContext";
}
function getPureBcsSchema(typeSignature) {
  if (typeof typeSignature === "string") {
    switch (typeSignature) {
      case "address":
        return iotaBcs.Address;
      case "bool":
        return iotaBcs.Bool;
      case "u8":
        return iotaBcs.U8;
      case "u16":
        return iotaBcs.U16;
      case "u32":
        return iotaBcs.U32;
      case "u64":
        return iotaBcs.U64;
      case "u128":
        return iotaBcs.U128;
      case "u256":
        return iotaBcs.U256;
      default:
        throw new Error(`Unknown type signature ${typeSignature}`);
    }
  }
  if ("vector" in typeSignature) {
    if (typeSignature.vector === "u8") {
      return iotaBcs.vector(iotaBcs.U8).transform({
        input: (val) => typeof val === "string" ? new TextEncoder().encode(val) : val,
        output: (val) => val
      });
    }
    const type = getPureBcsSchema(typeSignature.vector);
    return type ? iotaBcs.vector(type) : null;
  }
  if ("datatype" in typeSignature) {
    const pkg = normalizeIotaAddress(typeSignature.datatype.package);
    if (pkg === normalizeIotaAddress(MOVE_STDLIB_ADDRESS)) {
      if (typeSignature.datatype.module === STD_ASCII_MODULE_NAME && typeSignature.datatype.type === STD_ASCII_STRUCT_NAME) {
        return iotaBcs.String;
      }
      if (typeSignature.datatype.module === STD_UTF8_MODULE_NAME && typeSignature.datatype.type === STD_UTF8_STRUCT_NAME) {
        return iotaBcs.String;
      }
      if (typeSignature.datatype.module === STD_OPTION_MODULE_NAME && typeSignature.datatype.type === STD_OPTION_STRUCT_NAME) {
        const type = getPureBcsSchema(typeSignature.datatype.typeParameters[0]);
        return type ? iotaBcs.vector(type) : null;
      }
    }
    if (pkg === normalizeIotaAddress(IOTA_FRAMEWORK_ADDRESS) && typeSignature.datatype.module === OBJECT_MODULE_NAME && typeSignature.datatype.type === ID_STRUCT_NAME) {
      return iotaBcs.Address;
    }
  }
  return null;
}
function normalizedTypeToMoveTypeSignature(type) {
  if (typeof type === "object" && "Reference" in type) {
    return {
      ref: "&",
      body: normalizedTypeToMoveTypeSignatureBody(type.Reference)
    };
  }
  if (typeof type === "object" && "MutableReference" in type) {
    return {
      ref: "&mut",
      body: normalizedTypeToMoveTypeSignatureBody(type.MutableReference)
    };
  }
  return {
    ref: null,
    body: normalizedTypeToMoveTypeSignatureBody(type)
  };
}
function normalizedTypeToMoveTypeSignatureBody(type) {
  if (typeof type === "string") {
    switch (type) {
      case "Address":
        return "address";
      case "Bool":
        return "bool";
      case "U8":
        return "u8";
      case "U16":
        return "u16";
      case "U32":
        return "u32";
      case "U64":
        return "u64";
      case "U128":
        return "u128";
      case "U256":
        return "u256";
      default:
        throw new Error(`Unexpected type ${type}`);
    }
  }
  if ("Vector" in type) {
    return { vector: normalizedTypeToMoveTypeSignatureBody(type.Vector) };
  }
  if ("Struct" in type) {
    return {
      datatype: {
        package: type.Struct.address,
        module: type.Struct.module,
        type: type.Struct.name,
        typeParameters: type.Struct.typeArguments.map(
          normalizedTypeToMoveTypeSignatureBody
        )
      }
    };
  }
  if ("TypeParameter" in type) {
    return { typeParameter: type.TypeParameter };
  }
  throw new Error(`Unexpected type ${JSON.stringify(type)}`);
}
function Pure(data) {
  return {
    $kind: "Pure",
    Pure: {
      bytes: data instanceof Uint8Array ? toBase64(data) : data.toBase64()
    }
  };
}
const Inputs = {
  Pure,
  ObjectRef({ objectId, digest, version }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "ImmOrOwnedObject",
        ImmOrOwnedObject: {
          digest,
          version,
          objectId: normalizeIotaAddress(objectId)
        }
      }
    };
  },
  SharedObjectRef({
    objectId,
    mutable,
    initialSharedVersion
  }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "SharedObject",
        SharedObject: {
          mutable,
          initialSharedVersion,
          objectId: normalizeIotaAddress(objectId)
        }
      }
    };
  },
  ReceivingRef({ objectId, digest, version }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "Receiving",
        Receiving: {
          digest,
          version,
          objectId: normalizeIotaAddress(objectId)
        }
      }
    };
  }
};
var store;
function getGlobalConfig(config2) {
  return {
    lang: (config2 == null ? void 0 : config2.lang) ?? (store == null ? void 0 : store.lang),
    message: config2 == null ? void 0 : config2.message,
    abortEarly: (config2 == null ? void 0 : config2.abortEarly) ?? (store == null ? void 0 : store.abortEarly),
    abortPipeEarly: (config2 == null ? void 0 : config2.abortPipeEarly) ?? (store == null ? void 0 : store.abortPipeEarly)
  };
}
var store2;
function getGlobalMessage(lang) {
  return store2 == null ? void 0 : store2.get(lang);
}
var store3;
function getSchemaMessage(lang) {
  return store3 == null ? void 0 : store3.get(lang);
}
var store4;
function getSpecificMessage(reference, lang) {
  var _a2;
  return (_a2 = store4 == null ? void 0 : store4.get(reference)) == null ? void 0 : _a2.get(lang);
}
function _stringify(input) {
  var _a2, _b;
  const type = typeof input;
  if (type === "string") {
    return `"${input}"`;
  }
  if (type === "number" || type === "bigint" || type === "boolean") {
    return `${input}`;
  }
  if (type === "object" || type === "function") {
    return (input && ((_b = (_a2 = Object.getPrototypeOf(input)) == null ? void 0 : _a2.constructor) == null ? void 0 : _b.name)) ?? "null";
  }
  return type;
}
function _addIssue(context, label, dataset, config2, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected = (other == null ? void 0 : other.expected) ?? context.expects ?? null;
  const received = (other == null ? void 0 : other.received) ?? _stringify(input);
  const issue = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
    // @ts-expect-error
    requirement: context.requirement,
    path: other == null ? void 0 : other.path,
    issues: other == null ? void 0 : other.issues,
    lang: config2.lang,
    abortEarly: config2.abortEarly,
    abortPipeEarly: config2.abortPipeEarly
  };
  const isSchema = context.kind === "schema";
  const message = (other == null ? void 0 : other.message) ?? // @ts-expect-error
  context.message ?? getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? getSchemaMessage(issue.lang) : null) ?? config2.message ?? getGlobalMessage(issue.lang);
  if (message) {
    issue.message = typeof message === "function" ? message(issue) : message;
  }
  if (isSchema) {
    dataset.typed = false;
  }
  if (dataset.issues) {
    dataset.issues.push(issue);
  } else {
    dataset.issues = [issue];
  }
}
function _isValidObjectKey(object2, key) {
  return Object.hasOwn(object2, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
var ValiError = class extends Error {
  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues) {
    super(issues[0].message);
    /**
     * The error issues.
     */
    __publicField(this, "issues");
    this.name = "ValiError";
    this.issues = issues;
  }
};
function check(requirement, message) {
  return {
    kind: "validation",
    type: "check",
    reference: check,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config2) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, "input", dataset, config2);
      }
      return dataset;
    }
  };
}
function integer(message) {
  return {
    kind: "validation",
    type: "integer",
    reference: integer,
    async: false,
    expects: null,
    requirement: Number.isInteger,
    message,
    _run(dataset, config2) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, "integer", dataset, config2);
      }
      return dataset;
    }
  };
}
function transform(operation) {
  return {
    kind: "transformation",
    type: "transform",
    reference: transform,
    async: false,
    operation,
    _run(dataset) {
      dataset.value = this.operation(dataset.value);
      return dataset;
    }
  };
}
function getDefault(schema, dataset, config2) {
  return typeof schema.default === "function" ? (
    // @ts-expect-error
    schema.default(dataset, config2)
  ) : (
    // @ts-expect-error
    schema.default
  );
}
function is(schema, input) {
  return !schema._run({ typed: false, value: input }, { abortEarly: true }).issues;
}
function array(item, message) {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message,
    _run(dataset, config2) {
      var _a2;
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < input.length; key++) {
          const value2 = input[key];
          const itemDataset = this.item._run({ typed: false, value: value2 }, config2);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              (_a2 = dataset.issues) == null ? void 0 : _a2.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = itemDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) {
            dataset.typed = false;
          }
          dataset.value.push(itemDataset.value);
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function bigint(message) {
  return {
    kind: "schema",
    type: "bigint",
    reference: bigint,
    expects: "bigint",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "bigint") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function boolean(message) {
  return {
    kind: "schema",
    type: "boolean",
    reference: boolean,
    expects: "boolean",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "boolean") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function lazy(getter) {
  return {
    kind: "schema",
    type: "lazy",
    reference: lazy,
    expects: "unknown",
    async: false,
    getter,
    _run(dataset, config2) {
      return this.getter(dataset.value)._run(dataset, config2);
    }
  };
}
function literal(literal_, message) {
  return {
    kind: "schema",
    type: "literal",
    reference: literal,
    expects: _stringify(literal_),
    async: false,
    literal: literal_,
    message,
    _run(dataset, config2) {
      if (dataset.value === this.literal) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function nullable(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "nullable",
    reference: nullable,
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === null) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function nullish(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "nullish",
    reference: nullish,
    expects: `${wrapped.expects} | null | undefined`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === null || dataset.value === void 0) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === null || dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function number(message) {
  return {
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function object(entries, message) {
  return {
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    async: false,
    entries,
    message,
    _run(dataset, config2) {
      var _a2;
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const value2 = input[key];
          const valueDataset = this.entries[key]._run(
            { typed: false, value: value2 },
            config2
          );
          if (valueDataset.issues) {
            const pathItem = {
              type: "object",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of valueDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              (_a2 = dataset.issues) == null ? void 0 : _a2.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = valueDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!valueDataset.typed) {
            dataset.typed = false;
          }
          if (valueDataset.value !== void 0 || key in input) {
            dataset.value[key] = valueDataset.value;
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function optional(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `${wrapped.expects} | undefined`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === void 0) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function record(key, value2, message) {
  return {
    kind: "schema",
    type: "record",
    reference: record,
    expects: "Object",
    async: false,
    key,
    value: value2,
    message,
    _run(dataset, config2) {
      var _a2, _b;
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const entryKey in input) {
          if (_isValidObjectKey(input, entryKey)) {
            const entryValue = input[entryKey];
            const keyDataset = this.key._run(
              { typed: false, value: entryKey },
              config2
            );
            if (keyDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "key",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of keyDataset.issues) {
                issue.path = [pathItem];
                (_a2 = dataset.issues) == null ? void 0 : _a2.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = keyDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            const valueDataset = this.value._run(
              { typed: false, value: entryValue },
              config2
            );
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) {
                  issue.path.unshift(pathItem);
                } else {
                  issue.path = [pathItem];
                }
                (_b = dataset.issues) == null ? void 0 : _b.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = valueDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!keyDataset.typed || !valueDataset.typed) {
              dataset.typed = false;
            }
            if (keyDataset.typed) {
              dataset.value[keyDataset.value] = valueDataset.value;
            }
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function string(message) {
  return {
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "string") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function tuple(items, message) {
  return {
    kind: "schema",
    type: "tuple",
    reference: tuple,
    expects: "Array",
    async: false,
    items,
    message,
    _run(dataset, config2) {
      var _a2;
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < this.items.length; key++) {
          const value2 = input[key];
          const itemDataset = this.items[key]._run(
            { typed: false, value: value2 },
            config2
          );
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              (_a2 = dataset.issues) == null ? void 0 : _a2.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = itemDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) {
            dataset.typed = false;
          }
          dataset.value.push(itemDataset.value);
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function _subIssues(datasets) {
  let issues;
  if (datasets) {
    for (const dataset of datasets) {
      if (issues) {
        issues.push(...dataset.issues);
      } else {
        issues = dataset.issues;
      }
    }
  }
  return issues;
}
function union(options, message) {
  return {
    kind: "schema",
    type: "union",
    reference: union,
    expects: [...new Set(options.map((option) => option.expects))].join(" | ") || "never",
    async: false,
    options,
    message,
    _run(dataset, config2) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema._run(
          { typed: false, value: dataset.value },
          config2
        );
        if (optionDataset.typed) {
          if (optionDataset.issues) {
            if (typedDatasets) {
              typedDatasets.push(optionDataset);
            } else {
              typedDatasets = [optionDataset];
            }
          } else {
            validDataset = optionDataset;
            break;
          }
        } else {
          if (untypedDatasets) {
            untypedDatasets.push(optionDataset);
          } else {
            untypedDatasets = [optionDataset];
          }
        }
      }
      if (validDataset) {
        return validDataset;
      }
      if (typedDatasets) {
        if (typedDatasets.length === 1) {
          return typedDatasets[0];
        }
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(typedDatasets)
        });
        dataset.typed = true;
      } else if ((untypedDatasets == null ? void 0 : untypedDatasets.length) === 1) {
        return untypedDatasets[0];
      } else {
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(untypedDatasets)
        });
      }
      return dataset;
    }
  };
}
function unknown() {
  return {
    kind: "schema",
    type: "unknown",
    reference: unknown,
    expects: "unknown",
    async: false,
    _run(dataset) {
      dataset.typed = true;
      return dataset;
    }
  };
}
function parse(schema, input, config2) {
  const dataset = schema._run(
    { typed: false, value: input },
    getGlobalConfig(config2)
  );
  if (dataset.issues) {
    throw new ValiError(dataset.issues);
  }
  return dataset.value;
}
function pipe(...pipe2) {
  return {
    ...pipe2[0],
    pipe: pipe2,
    _run(dataset, config2) {
      for (let index2 = 0; index2 < pipe2.length; index2++) {
        if (dataset.issues && (pipe2[index2].kind === "schema" || pipe2[index2].kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) {
          dataset = pipe2[index2]._run(dataset, config2);
        }
      }
      return dataset;
    }
  };
}
function safeEnum(options) {
  const unionOptions = Object.entries(options).map(([key, value]) => object({ [key]: value }));
  return pipe(
    union(unionOptions),
    transform((value) => ({
      ...value,
      $kind: Object.keys(value)[0]
    }))
  );
}
const IotaAddress = pipe(
  string(),
  transform((value) => normalizeIotaAddress(value)),
  check(isValidIotaAddress)
);
const ObjectID = IotaAddress;
const BCSBytes = string();
const JsonU64 = pipe(
  union([string(), pipe(number(), integer())]),
  check((val) => {
    try {
      BigInt(val);
      return BigInt(val) >= 0 && BigInt(val) <= 18446744073709551615n;
    } catch {
      return false;
    }
  }, "Invalid u64")
);
const ObjectRef$1 = object({
  objectId: IotaAddress,
  version: JsonU64,
  digest: string()
});
const Argument$1 = pipe(
  union([
    object({ GasCoin: literal(true) }),
    object({ Input: pipe(number(), integer()), type: optional(literal("pure")) }),
    object({ Input: pipe(number(), integer()), type: optional(literal("object")) }),
    object({ Result: pipe(number(), integer()) }),
    object({ NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())]) })
  ]),
  transform((value) => ({
    ...value,
    $kind: Object.keys(value)[0]
  }))
  // Defined manually to add `type?: 'pure' | 'object'` to Input
);
const GasData$1 = object({
  budget: nullable(JsonU64),
  price: nullable(JsonU64),
  owner: nullable(IotaAddress),
  payment: nullable(array(ObjectRef$1))
});
const OpenMoveTypeSignatureBody = union([
  literal("address"),
  literal("bool"),
  literal("u8"),
  literal("u16"),
  literal("u32"),
  literal("u64"),
  literal("u128"),
  literal("u256"),
  object({ vector: lazy(() => OpenMoveTypeSignatureBody) }),
  object({
    datatype: object({
      package: string(),
      module: string(),
      type: string(),
      typeParameters: array(lazy(() => OpenMoveTypeSignatureBody))
    })
  }),
  object({ typeParameter: pipe(number(), integer()) })
]);
const OpenMoveTypeSignature = object({
  ref: nullable(union([literal("&"), literal("&mut")])),
  body: OpenMoveTypeSignatureBody
});
const ProgrammableMoveCall$1 = object({
  package: ObjectID,
  module: string(),
  function: string(),
  // snake case in rust
  typeArguments: array(string()),
  arguments: array(Argument$1),
  _argumentTypes: optional(nullable(array(OpenMoveTypeSignature)))
});
const $Intent$1 = object({
  name: string(),
  inputs: record(string(), union([Argument$1, array(Argument$1)])),
  data: record(string(), unknown())
});
const Command$1 = safeEnum({
  MoveCall: ProgrammableMoveCall$1,
  TransferObjects: object({
    objects: array(Argument$1),
    address: Argument$1
  }),
  SplitCoins: object({
    coin: Argument$1,
    amounts: array(Argument$1)
  }),
  MergeCoins: object({
    destination: Argument$1,
    sources: array(Argument$1)
  }),
  Publish: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID)
  }),
  MakeMoveVec: object({
    type: nullable(string()),
    elements: array(Argument$1)
  }),
  Upgrade: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID),
    package: ObjectID,
    ticket: Argument$1
  }),
  $Intent: $Intent$1
});
const ObjectArg$2 = safeEnum({
  ImmOrOwnedObject: ObjectRef$1,
  SharedObject: object({
    objectId: ObjectID,
    // snake case in rust
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRef$1
});
const CallArg$1 = safeEnum({
  Object: ObjectArg$2,
  Pure: object({
    bytes: BCSBytes
  }),
  UnresolvedPure: object({
    value: unknown()
  }),
  UnresolvedObject: object({
    objectId: ObjectID,
    version: optional(nullable(JsonU64)),
    digest: optional(nullable(string())),
    initialSharedVersion: optional(nullable(JsonU64))
  })
});
const NormalizedCallArg$1 = safeEnum({
  Object: ObjectArg$2,
  Pure: object({
    bytes: BCSBytes
  })
});
const TransactionExpiration$2 = safeEnum({
  None: literal(true),
  Epoch: JsonU64
});
const TransactionData = object({
  version: literal(2),
  sender: nullish(IotaAddress),
  expiration: nullish(TransactionExpiration$2),
  gasData: GasData$1,
  inputs: array(CallArg$1),
  commands: array(Command$1)
});
const Commands = {
  MoveCall(input) {
    const [pkg, mod2 = "", fn = ""] = "target" in input ? input.target.split("::") : [input.package, input.module, input.function];
    return {
      $kind: "MoveCall",
      MoveCall: {
        package: pkg,
        module: mod2,
        function: fn,
        typeArguments: input.typeArguments ?? [],
        arguments: input.arguments ?? []
      }
    };
  },
  TransferObjects(objects, address) {
    return {
      $kind: "TransferObjects",
      TransferObjects: {
        objects: objects.map((o) => parse(Argument$1, o)),
        address: parse(Argument$1, address)
      }
    };
  },
  SplitCoins(coin, amounts) {
    return {
      $kind: "SplitCoins",
      SplitCoins: {
        coin: parse(Argument$1, coin),
        amounts: amounts.map((o) => parse(Argument$1, o))
      }
    };
  },
  MergeCoins(destination, sources) {
    return {
      $kind: "MergeCoins",
      MergeCoins: {
        destination: parse(Argument$1, destination),
        sources: sources.map((o) => parse(Argument$1, o))
      }
    };
  },
  Publish({
    modules,
    dependencies
  }) {
    return {
      $kind: "Publish",
      Publish: {
        modules: modules.map(
          (module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))
        ),
        dependencies: dependencies.map((dep) => normalizeIotaObjectId(dep))
      }
    };
  },
  Upgrade({
    modules,
    dependencies,
    package: packageId,
    ticket
  }) {
    return {
      $kind: "Upgrade",
      Upgrade: {
        modules: modules.map(
          (module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))
        ),
        dependencies: dependencies.map((dep) => normalizeIotaObjectId(dep)),
        package: packageId,
        ticket: parse(Argument$1, ticket)
      }
    };
  },
  MakeMoveVec({
    type,
    elements
  }) {
    return {
      $kind: "MakeMoveVec",
      MakeMoveVec: {
        type: type ?? null,
        elements: elements.map((o) => parse(Argument$1, o))
      }
    };
  },
  Intent({
    name,
    inputs = {},
    data = {}
  }) {
    return {
      $kind: "$Intent",
      $Intent: {
        name,
        inputs: Object.fromEntries(
          Object.entries(inputs).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.map((o) => parse(Argument$1, o)) : parse(Argument$1, value)
          ])
        ),
        data
      }
    };
  }
};
const ObjectRef = object({
  digest: string(),
  objectId: string(),
  version: union([pipe(number(), integer()), string(), bigint()])
});
const ObjectArg$1 = safeEnum({
  ImmOrOwned: ObjectRef,
  Shared: object({
    objectId: ObjectID,
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRef
});
const NormalizedCallArg = safeEnum({
  Object: ObjectArg$1,
  Pure: array(pipe(number(), integer()))
});
const TransactionInput = union([
  object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: optional(literal("object"))
  }),
  object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: literal("pure")
  })
]);
const TransactionExpiration$1 = union([
  object({ Epoch: pipe(number(), integer()) }),
  object({ None: nullable(literal(true)) })
]);
const StringEncodedBigint = pipe(
  union([number(), string(), bigint()]),
  check((val) => {
    if (!["string", "number", "bigint"].includes(typeof val)) return false;
    try {
      BigInt(val);
      return true;
    } catch {
      return false;
    }
  })
);
const TypeTag = union([
  object({ bool: nullable(literal(true)) }),
  object({ u8: nullable(literal(true)) }),
  object({ u64: nullable(literal(true)) }),
  object({ u128: nullable(literal(true)) }),
  object({ address: nullable(literal(true)) }),
  object({ signer: nullable(literal(true)) }),
  object({ vector: lazy(() => TypeTag) }),
  object({ struct: lazy(() => StructTag) }),
  object({ u16: nullable(literal(true)) }),
  object({ u32: nullable(literal(true)) }),
  object({ u256: nullable(literal(true)) })
]);
const StructTag = object({
  address: string(),
  module: string(),
  name: string(),
  typeParams: array(TypeTag)
});
const GasConfig = object({
  budget: optional(StringEncodedBigint),
  price: optional(StringEncodedBigint),
  payment: optional(array(ObjectRef)),
  owner: optional(string())
});
const TransactionArgumentTypes = [
  TransactionInput,
  object({ kind: literal("GasCoin") }),
  object({ kind: literal("Result"), index: pipe(number(), integer()) }),
  object({
    kind: literal("NestedResult"),
    index: pipe(number(), integer()),
    resultIndex: pipe(number(), integer())
  })
];
const TransactionArgument = union([...TransactionArgumentTypes]);
const MoveCallTransaction = object({
  kind: literal("MoveCall"),
  target: pipe(
    string(),
    check((target2) => target2.split("::").length === 3)
  ),
  typeArguments: array(string()),
  arguments: array(TransactionArgument)
});
const TransferObjectsTransaction = object({
  kind: literal("TransferObjects"),
  objects: array(TransactionArgument),
  address: TransactionArgument
});
const SplitCoinsTransaction = object({
  kind: literal("SplitCoins"),
  coin: TransactionArgument,
  amounts: array(TransactionArgument)
});
const MergeCoinsTransaction = object({
  kind: literal("MergeCoins"),
  destination: TransactionArgument,
  sources: array(TransactionArgument)
});
const MakeMoveVecTransaction = object({
  kind: literal("MakeMoveVec"),
  type: union([object({ Some: TypeTag }), object({ None: nullable(literal(true)) })]),
  objects: array(TransactionArgument)
});
const PublishTransaction = object({
  kind: literal("Publish"),
  modules: array(array(pipe(number(), integer()))),
  dependencies: array(string())
});
const UpgradeTransaction = object({
  kind: literal("Upgrade"),
  modules: array(array(pipe(number(), integer()))),
  dependencies: array(string()),
  packageId: string(),
  ticket: TransactionArgument
});
const TransactionTypes = [
  MoveCallTransaction,
  TransferObjectsTransaction,
  SplitCoinsTransaction,
  MergeCoinsTransaction,
  PublishTransaction,
  UpgradeTransaction,
  MakeMoveVecTransaction
];
const TransactionType = union([...TransactionTypes]);
object({
  version: literal(1),
  sender: optional(string()),
  expiration: nullish(TransactionExpiration$1),
  gasConfig: GasConfig,
  inputs: array(TransactionInput),
  transactions: array(TransactionType)
});
function serializeV1TransactionData(transactionData) {
  var _a2;
  const inputs = transactionData.inputs.map(
    (input, index2) => {
      if (input.Object) {
        return {
          kind: "Input",
          index: index2,
          value: {
            Object: input.Object.ImmOrOwnedObject ? {
              ImmOrOwned: input.Object.ImmOrOwnedObject
            } : input.Object.Receiving ? {
              Receiving: {
                digest: input.Object.Receiving.digest,
                version: input.Object.Receiving.version,
                objectId: input.Object.Receiving.objectId
              }
            } : {
              Shared: {
                mutable: input.Object.SharedObject.mutable,
                initialSharedVersion: input.Object.SharedObject.initialSharedVersion,
                objectId: input.Object.SharedObject.objectId
              }
            }
          },
          type: "object"
        };
      }
      if (input.Pure) {
        return {
          kind: "Input",
          index: index2,
          value: {
            Pure: Array.from(fromBase64(input.Pure.bytes))
          },
          type: "pure"
        };
      }
      if (input.UnresolvedPure) {
        return {
          kind: "Input",
          type: "pure",
          index: index2,
          value: input.UnresolvedPure.value
        };
      }
      if (input.UnresolvedObject) {
        return {
          kind: "Input",
          type: "object",
          index: index2,
          value: input.UnresolvedObject.objectId
        };
      }
      throw new Error("Invalid input");
    }
  );
  return {
    version: 1,
    sender: transactionData.sender ?? void 0,
    expiration: ((_a2 = transactionData.expiration) == null ? void 0 : _a2.$kind) === "Epoch" ? { Epoch: Number(transactionData.expiration.Epoch) } : transactionData.expiration ? { None: true } : null,
    gasConfig: {
      owner: transactionData.gasData.owner ?? void 0,
      budget: transactionData.gasData.budget ?? void 0,
      price: transactionData.gasData.price ?? void 0,
      payment: transactionData.gasData.payment ?? void 0
    },
    inputs,
    transactions: transactionData.commands.map(
      (command) => {
        if (command.MakeMoveVec) {
          return {
            kind: "MakeMoveVec",
            type: command.MakeMoveVec.type === null ? { None: true } : {
              Some: TypeTagSerializer.parseFromStr(
                command.MakeMoveVec.type
              )
            },
            objects: command.MakeMoveVec.elements.map(
              (arg) => convertTransactionArgument(arg, inputs)
            )
          };
        }
        if (command.MergeCoins) {
          return {
            kind: "MergeCoins",
            destination: convertTransactionArgument(
              command.MergeCoins.destination,
              inputs
            ),
            sources: command.MergeCoins.sources.map(
              (arg) => convertTransactionArgument(arg, inputs)
            )
          };
        }
        if (command.MoveCall) {
          return {
            kind: "MoveCall",
            target: `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`,
            typeArguments: command.MoveCall.typeArguments,
            arguments: command.MoveCall.arguments.map(
              (arg) => convertTransactionArgument(arg, inputs)
            )
          };
        }
        if (command.Publish) {
          return {
            kind: "Publish",
            modules: command.Publish.modules.map((mod2) => Array.from(fromBase64(mod2))),
            dependencies: command.Publish.dependencies
          };
        }
        if (command.SplitCoins) {
          return {
            kind: "SplitCoins",
            coin: convertTransactionArgument(command.SplitCoins.coin, inputs),
            amounts: command.SplitCoins.amounts.map(
              (arg) => convertTransactionArgument(arg, inputs)
            )
          };
        }
        if (command.TransferObjects) {
          return {
            kind: "TransferObjects",
            objects: command.TransferObjects.objects.map(
              (arg) => convertTransactionArgument(arg, inputs)
            ),
            address: convertTransactionArgument(
              command.TransferObjects.address,
              inputs
            )
          };
        }
        if (command.Upgrade) {
          return {
            kind: "Upgrade",
            modules: command.Upgrade.modules.map((mod2) => Array.from(fromBase64(mod2))),
            dependencies: command.Upgrade.dependencies,
            packageId: command.Upgrade.package,
            ticket: convertTransactionArgument(command.Upgrade.ticket, inputs)
          };
        }
        throw new Error(`Unknown transaction ${Object.keys(command)}`);
      }
    )
  };
}
function convertTransactionArgument(arg, inputs) {
  if (arg.$kind === "GasCoin") {
    return { kind: "GasCoin" };
  }
  if (arg.$kind === "Result") {
    return { kind: "Result", index: arg.Result };
  }
  if (arg.$kind === "NestedResult") {
    return {
      kind: "NestedResult",
      index: arg.NestedResult[0],
      resultIndex: arg.NestedResult[1]
    };
  }
  if (arg.$kind === "Input") {
    return inputs[arg.Input];
  }
  throw new Error(`Invalid argument ${Object.keys(arg)}`);
}
function transactionDataFromV1(data) {
  var _a2, _b, _c;
  return parse(TransactionData, {
    version: 2,
    sender: data.sender ?? null,
    expiration: data.expiration ? "Epoch" in data.expiration ? { Epoch: data.expiration.Epoch } : { None: true } : null,
    gasData: {
      owner: data.gasConfig.owner ?? null,
      budget: ((_a2 = data.gasConfig.budget) == null ? void 0 : _a2.toString()) ?? null,
      price: ((_b = data.gasConfig.price) == null ? void 0 : _b.toString()) ?? null,
      payment: ((_c = data.gasConfig.payment) == null ? void 0 : _c.map((ref) => ({
        digest: ref.digest,
        objectId: ref.objectId,
        version: ref.version.toString()
      }))) ?? null
    },
    inputs: data.inputs.map((input) => {
      if (input.kind === "Input") {
        if (is(NormalizedCallArg, input.value)) {
          const value = parse(NormalizedCallArg, input.value);
          if (value.Object) {
            if (value.Object.ImmOrOwned) {
              return {
                Object: {
                  ImmOrOwnedObject: {
                    objectId: value.Object.ImmOrOwned.objectId,
                    version: String(value.Object.ImmOrOwned.version),
                    digest: value.Object.ImmOrOwned.digest
                  }
                }
              };
            }
            if (value.Object.Shared) {
              return {
                Object: {
                  SharedObject: {
                    mutable: value.Object.Shared.mutable ?? null,
                    initialSharedVersion: value.Object.Shared.initialSharedVersion,
                    objectId: value.Object.Shared.objectId
                  }
                }
              };
            }
            if (value.Object.Receiving) {
              return {
                Object: {
                  Receiving: {
                    digest: value.Object.Receiving.digest,
                    version: String(value.Object.Receiving.version),
                    objectId: value.Object.Receiving.objectId
                  }
                }
              };
            }
            throw new Error("Invalid object input");
          }
          return {
            Pure: {
              bytes: toBase64(new Uint8Array(value.Pure))
            }
          };
        }
        if (input.type === "object") {
          return {
            UnresolvedObject: {
              objectId: input.value
            }
          };
        }
        return {
          UnresolvedPure: {
            value: input.value
          }
        };
      }
      throw new Error("Invalid input");
    }),
    commands: data.transactions.map((transaction) => {
      switch (transaction.kind) {
        case "MakeMoveVec":
          return {
            MakeMoveVec: {
              type: "Some" in transaction.type ? TypeTagSerializer.tagToString(transaction.type.Some) : null,
              elements: transaction.objects.map(
                (arg) => parseV1TransactionArgument(arg)
              )
            }
          };
        case "MergeCoins": {
          return {
            MergeCoins: {
              destination: parseV1TransactionArgument(transaction.destination),
              sources: transaction.sources.map(
                (arg) => parseV1TransactionArgument(arg)
              )
            }
          };
        }
        case "MoveCall": {
          const [pkg, mod2, fn] = transaction.target.split("::");
          return {
            MoveCall: {
              package: pkg,
              module: mod2,
              function: fn,
              typeArguments: transaction.typeArguments,
              arguments: transaction.arguments.map(
                (arg) => parseV1TransactionArgument(arg)
              )
            }
          };
        }
        case "Publish": {
          return {
            Publish: {
              modules: transaction.modules.map(
                (mod2) => toBase64(Uint8Array.from(mod2))
              ),
              dependencies: transaction.dependencies
            }
          };
        }
        case "SplitCoins": {
          return {
            SplitCoins: {
              coin: parseV1TransactionArgument(transaction.coin),
              amounts: transaction.amounts.map(
                (arg) => parseV1TransactionArgument(arg)
              )
            }
          };
        }
        case "TransferObjects": {
          return {
            TransferObjects: {
              objects: transaction.objects.map(
                (arg) => parseV1TransactionArgument(arg)
              ),
              address: parseV1TransactionArgument(transaction.address)
            }
          };
        }
        case "Upgrade": {
          return {
            Upgrade: {
              modules: transaction.modules.map(
                (mod2) => toBase64(Uint8Array.from(mod2))
              ),
              dependencies: transaction.dependencies,
              package: transaction.packageId,
              ticket: parseV1TransactionArgument(transaction.ticket)
            }
          };
        }
      }
      throw new Error(`Unknown transaction ${Object.keys(transaction)}`);
    })
  });
}
function parseV1TransactionArgument(arg) {
  switch (arg.kind) {
    case "GasCoin": {
      return { GasCoin: true };
    }
    case "Result":
      return { Result: arg.index };
    case "NestedResult": {
      return { NestedResult: [arg.index, arg.resultIndex] };
    }
    case "Input": {
      return { Input: arg.index };
    }
  }
}
function enumUnion(options) {
  return union(
    Object.entries(options).map(([key, value]) => object({ [key]: value }))
  );
}
const Argument = enumUnion({
  GasCoin: literal(true),
  Input: pipe(number(), integer()),
  Result: pipe(number(), integer()),
  NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())])
});
const GasData = object({
  budget: nullable(JsonU64),
  price: nullable(JsonU64),
  owner: nullable(IotaAddress),
  payment: nullable(array(ObjectRef$1))
});
const ProgrammableMoveCall = object({
  package: ObjectID,
  module: string(),
  function: string(),
  // snake case in rust
  typeArguments: array(string()),
  arguments: array(Argument)
});
const $Intent = object({
  name: string(),
  inputs: record(string(), union([Argument, array(Argument)])),
  data: record(string(), unknown())
});
const Command = enumUnion({
  MoveCall: ProgrammableMoveCall,
  TransferObjects: object({
    objects: array(Argument),
    address: Argument
  }),
  SplitCoins: object({
    coin: Argument,
    amounts: array(Argument)
  }),
  MergeCoins: object({
    destination: Argument,
    sources: array(Argument)
  }),
  Publish: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID)
  }),
  MakeMoveVec: object({
    type: nullable(string()),
    elements: array(Argument)
  }),
  Upgrade: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID),
    package: ObjectID,
    ticket: Argument
  }),
  $Intent
});
const ObjectArg = enumUnion({
  ImmOrOwnedObject: ObjectRef$1,
  SharedObject: object({
    objectId: ObjectID,
    // snake case in rust
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRef$1
});
const CallArg = enumUnion({
  Object: ObjectArg,
  Pure: object({
    bytes: BCSBytes
  }),
  UnresolvedPure: object({
    value: unknown()
  }),
  UnresolvedObject: object({
    objectId: ObjectID,
    version: optional(nullable(JsonU64)),
    digest: optional(nullable(string())),
    initialSharedVersion: optional(nullable(JsonU64))
  })
});
const TransactionExpiration = enumUnion({
  None: literal(true),
  Epoch: JsonU64
});
const SerializedTransactionDataV2 = object({
  version: literal(2),
  sender: nullish(IotaAddress),
  expiration: nullish(TransactionExpiration),
  gasData: GasData,
  inputs: array(CallArg),
  commands: array(Command)
});
const MAX_OBJECTS_PER_FETCH = 50;
const GAS_SAFE_OVERHEAD = 1000n;
const MAX_GAS = 5e10;
async function resolveTransactionData(transactionData, options, next) {
  await normalizeInputs(transactionData, options);
  await resolveObjectReferences(transactionData, options);
  if (!options.onlyTransactionKind) {
    await setGasPrice(transactionData, options);
    await setGasBudget(transactionData, options);
    await setGasPayment(transactionData, options);
  }
  await validate(transactionData);
  return await next();
}
async function setGasPrice(transactionData, options) {
  if (!transactionData.gasConfig.price) {
    transactionData.gasConfig.price = String(await getClient$1(options).getReferenceGasPrice());
  }
}
async function setGasBudget(transactionData, options) {
  if (transactionData.gasConfig.budget) {
    return;
  }
  const dryRunResult = await getClient$1(options).dryRunTransactionBlock({
    transactionBlock: transactionData.build({
      overrides: {
        gasData: {
          budget: String(MAX_GAS),
          payment: []
        }
      }
    })
  });
  if (dryRunResult.effects.status.status !== "success") {
    throw new Error(
      `Dry run failed, could not automatically determine a budget: ${dryRunResult.effects.status.error}`,
      { cause: dryRunResult }
    );
  }
  const safeOverhead = GAS_SAFE_OVERHEAD * BigInt(transactionData.gasConfig.price || 1n);
  const baseComputationCostWithOverhead = BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;
  const gasBudget = baseComputationCostWithOverhead + BigInt(dryRunResult.effects.gasUsed.storageCost) - BigInt(dryRunResult.effects.gasUsed.storageRebate);
  transactionData.gasConfig.budget = String(
    gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead
  );
}
async function setGasPayment(transactionData, options) {
  if (!transactionData.gasConfig.payment) {
    const coins = await getClient$1(options).getCoins({
      owner: transactionData.gasConfig.owner || transactionData.sender,
      coinType: IOTA_TYPE_ARG
    });
    const paymentCoins = coins.data.filter((coin) => {
      const matchingInput = transactionData.inputs.find((input) => {
        var _a2;
        if ((_a2 = input.Object) == null ? void 0 : _a2.ImmOrOwnedObject) {
          return coin.coinObjectId === input.Object.ImmOrOwnedObject.objectId;
        }
        return false;
      });
      return !matchingInput;
    }).map((coin) => ({
      objectId: coin.coinObjectId,
      digest: coin.digest,
      version: coin.version
    }));
    if (!paymentCoins.length) {
      throw new Error("No valid gas coins found for the transaction.");
    }
    transactionData.gasConfig.payment = paymentCoins.map(
      (payment) => parse(ObjectRef$1, payment)
    );
  }
}
async function resolveObjectReferences(transactionData, options) {
  const objectsToResolve = transactionData.inputs.filter((input) => {
    var _a2;
    return input.UnresolvedObject && !(input.UnresolvedObject.version || ((_a2 = input.UnresolvedObject) == null ? void 0 : _a2.initialSharedVersion));
  });
  const dedupedIds = [
    ...new Set(
      objectsToResolve.map((input) => normalizeIotaObjectId(input.UnresolvedObject.objectId))
    )
  ];
  const objectChunks = dedupedIds.length ? chunk(dedupedIds, MAX_OBJECTS_PER_FETCH) : [];
  const resolvedObjects = /* @__PURE__ */ new Map();
  const erroredObjects = /* @__PURE__ */ new Map();
  await Promise.all(
    objectChunks.map(async (chunk2) => {
      var _a2;
      const chunkObjects = await getClient$1(options).multiGetObjects({
        ids: chunk2,
        options: { showOwner: true }
      });
      for (const object2 of chunkObjects) {
        const objectId = (_a2 = object2.data) == null ? void 0 : _a2.objectId;
        if (objectId) {
          if (object2.error || !object2.data) {
            erroredObjects.set(objectId, object2.error);
            return;
          }
          const owner = object2.data.owner;
          const initialSharedVersion = owner && typeof owner === "object" && "Shared" in owner ? owner.Shared.initial_shared_version : null;
          resolvedObjects.set(objectId, {
            objectId,
            digest: object2.data.digest,
            version: object2.data.version,
            initialSharedVersion
          });
        }
      }
    })
  );
  if (erroredObjects.size > 0) {
    throw new Error(
      `The following input objects are invalid: ${Array.from(erroredObjects).join(", ")}`
    );
  }
  for (const [index2, input] of transactionData.inputs.entries()) {
    if (!input.UnresolvedObject) {
      continue;
    }
    let updated;
    const id = normalizeIotaAddress(input.UnresolvedObject.objectId);
    const object2 = resolvedObjects.get(id);
    if (input.UnresolvedObject.initialSharedVersion ?? (object2 == null ? void 0 : object2.initialSharedVersion)) {
      updated = Inputs.SharedObjectRef({
        objectId: id,
        initialSharedVersion: input.UnresolvedObject.initialSharedVersion || (object2 == null ? void 0 : object2.initialSharedVersion),
        mutable: isUsedAsMutable(transactionData, index2)
      });
    } else if (isUsedAsReceiving(transactionData, index2)) {
      updated = Inputs.ReceivingRef(
        {
          objectId: id,
          digest: input.UnresolvedObject.digest ?? (object2 == null ? void 0 : object2.digest),
          version: input.UnresolvedObject.version ?? (object2 == null ? void 0 : object2.version)
        }
      );
    }
    transactionData.inputs[transactionData.inputs.indexOf(input)] = updated ?? Inputs.ObjectRef({
      objectId: id,
      digest: input.UnresolvedObject.digest ?? (object2 == null ? void 0 : object2.digest),
      version: input.UnresolvedObject.version ?? (object2 == null ? void 0 : object2.version)
    });
  }
}
async function normalizeInputs(transactionData, options) {
  const { inputs, commands } = transactionData;
  const moveCallsToResolve = [];
  const moveFunctionsToResolve = /* @__PURE__ */ new Set();
  commands.forEach((command) => {
    if (command.MoveCall) {
      if (command.MoveCall._argumentTypes) {
        return;
      }
      const inputs2 = command.MoveCall.arguments.map((arg) => {
        if (arg.$kind === "Input") {
          return transactionData.inputs[arg.Input];
        }
        return null;
      });
      const needsResolution = inputs2.some(
        (input) => (input == null ? void 0 : input.UnresolvedPure) || (input == null ? void 0 : input.UnresolvedObject)
      );
      if (needsResolution) {
        const functionName = `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`;
        moveFunctionsToResolve.add(functionName);
        moveCallsToResolve.push(command.MoveCall);
      }
    }
    switch (command.$kind) {
      case "SplitCoins":
        command.SplitCoins.amounts.forEach((amount) => {
          normalizeRawArgument(amount, iotaBcs.U64, transactionData);
        });
        break;
      case "TransferObjects":
        normalizeRawArgument(command.TransferObjects.address, iotaBcs.Address, transactionData);
        break;
    }
  });
  const moveFunctionParameters = /* @__PURE__ */ new Map();
  if (moveFunctionsToResolve.size > 0) {
    const client2 = getClient$1(options);
    await Promise.all(
      [...moveFunctionsToResolve].map(async (functionName) => {
        const [packageId, moduleId, functionId] = functionName.split("::");
        const def = await client2.getNormalizedMoveFunction({
          package: packageId,
          module: moduleId,
          function: functionId
        });
        moveFunctionParameters.set(
          functionName,
          def.parameters.map((param) => normalizedTypeToMoveTypeSignature(param))
        );
      })
    );
  }
  if (moveCallsToResolve.length) {
    await Promise.all(
      moveCallsToResolve.map(async (moveCall) => {
        const parameters = moveFunctionParameters.get(
          `${moveCall.package}::${moveCall.module}::${moveCall.function}`
        );
        if (!parameters) {
          return;
        }
        const hasTxContext = parameters.length > 0 && isTxContext(parameters.at(-1));
        const params = hasTxContext ? parameters.slice(0, parameters.length - 1) : parameters;
        moveCall._argumentTypes = params;
      })
    );
  }
  commands.forEach((command) => {
    if (!command.MoveCall) {
      return;
    }
    const moveCall = command.MoveCall;
    const fnName = `${moveCall.package}::${moveCall.module}::${moveCall.function}`;
    const params = moveCall._argumentTypes;
    if (!params) {
      return;
    }
    if (params.length !== command.MoveCall.arguments.length) {
      throw new Error(`Incorrect number of arguments for ${fnName}`);
    }
    params.forEach((param, i) => {
      var _a2, _b;
      const arg = moveCall.arguments[i];
      if (arg.$kind !== "Input") return;
      const input = inputs[arg.Input];
      if (!input.UnresolvedPure && !input.UnresolvedObject) {
        return;
      }
      const inputValue = ((_a2 = input.UnresolvedPure) == null ? void 0 : _a2.value) ?? ((_b = input.UnresolvedObject) == null ? void 0 : _b.objectId);
      const inputIndex = inputs.indexOf(input);
      const schema = getPureBcsSchema(param.body);
      if (schema) {
        arg.type = "pure";
        inputs[inputIndex] = Inputs.Pure(schema.serialize(inputValue));
        return;
      }
      if (typeof inputValue !== "string") {
        throw new Error(
          `Expect the argument to be an object id string, got ${JSON.stringify(
            inputValue,
            null,
            2
          )}`
        );
      }
      arg.type = "object";
      const unresolvedObject = input.UnresolvedPure ? {
        $kind: "UnresolvedObject",
        UnresolvedObject: {
          objectId: inputValue
        }
      } : input;
      inputs[inputIndex] = unresolvedObject;
    });
  });
}
function validate(transactionData) {
  transactionData.inputs.forEach((input, index2) => {
    if (input.$kind !== "Object" && input.$kind !== "Pure") {
      throw new Error(
        `Input at index ${index2} has not been resolved.  Expected a Pure or Object input, but found ${JSON.stringify(
          input
        )}`
      );
    }
  });
}
function normalizeRawArgument(arg, schema, transactionData) {
  if (arg.$kind !== "Input") {
    return;
  }
  const input = transactionData.inputs[arg.Input];
  if (input.$kind !== "UnresolvedPure") {
    return;
  }
  transactionData.inputs[arg.Input] = Inputs.Pure(schema.serialize(input.UnresolvedPure.value));
}
function isUsedAsMutable(transactionData, index2) {
  let usedAsMutable = false;
  transactionData.getInputUses(index2, (arg, tx) => {
    if (tx.MoveCall && tx.MoveCall._argumentTypes) {
      const argIndex = tx.MoveCall.arguments.indexOf(arg);
      usedAsMutable = tx.MoveCall._argumentTypes[argIndex].ref !== "&" || usedAsMutable;
    }
    if (tx.$kind === "MakeMoveVec" || tx.$kind === "MergeCoins" || tx.$kind === "SplitCoins") {
      usedAsMutable = true;
    }
  });
  return usedAsMutable;
}
function isUsedAsReceiving(transactionData, index2) {
  let usedAsReceiving = false;
  transactionData.getInputUses(index2, (arg, tx) => {
    if (tx.MoveCall && tx.MoveCall._argumentTypes) {
      const argIndex = tx.MoveCall.arguments.indexOf(arg);
      usedAsReceiving = isReceivingType(tx.MoveCall._argumentTypes[argIndex]) || usedAsReceiving;
    }
  });
  return usedAsReceiving;
}
function isReceivingType(type) {
  if (typeof type.body !== "object" || !("datatype" in type.body)) {
    return false;
  }
  return type.body.datatype.package === "0x2" && type.body.datatype.module === "transfer" && type.body.datatype.type === "Receiving";
}
function getClient$1(options) {
  if (!options.client) {
    throw new Error(
      `No iota client passed to Transaction#build, but transaction data was not sufficient to build offline.`
    );
  }
  return options.client;
}
function chunk(arr, size) {
  return Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size)
  );
}
function createObjectMethods(makeObject) {
  function object2(value) {
    return makeObject(value);
  }
  object2.system = () => object2("0x5");
  object2.clock = () => object2("0x6");
  object2.random = () => object2("0x8");
  object2.denyList = () => object2("0x403");
  object2.option = ({ type, value }) => (tx) => tx.moveCall({
    typeArguments: [type],
    target: `0x1::option::${value === null ? "none" : "some"}`,
    arguments: value === null ? [] : [tx.object(value)]
  });
  return object2;
}
function createPure(makePure) {
  function pure(typeOrSerializedValue, value) {
    if (typeof typeOrSerializedValue === "string") {
      return makePure(schemaFromName(typeOrSerializedValue).serialize(value));
    }
    if (typeOrSerializedValue instanceof Uint8Array || isSerializedBcs(typeOrSerializedValue)) {
      return makePure(typeOrSerializedValue);
    }
    throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
  }
  pure.u8 = (value) => makePure(iotaBcs.U8.serialize(value));
  pure.u16 = (value) => makePure(iotaBcs.U16.serialize(value));
  pure.u32 = (value) => makePure(iotaBcs.U32.serialize(value));
  pure.u64 = (value) => makePure(iotaBcs.U64.serialize(value));
  pure.u128 = (value) => makePure(iotaBcs.U128.serialize(value));
  pure.u256 = (value) => makePure(iotaBcs.U256.serialize(value));
  pure.bool = (value) => makePure(iotaBcs.Bool.serialize(value));
  pure.string = (value) => makePure(iotaBcs.String.serialize(value));
  pure.address = (value) => makePure(iotaBcs.Address.serialize(value));
  pure.id = pure.address;
  pure.vector = (type, value) => {
    return makePure(iotaBcs.vector(schemaFromName(type)).serialize(value));
  };
  pure.option = (type, value) => {
    return makePure(iotaBcs.option(schemaFromName(type)).serialize(value));
  };
  return pure;
}
function schemaFromName(name) {
  switch (name) {
    case "u8":
      return iotaBcs.u8();
    case "u16":
      return iotaBcs.u16();
    case "u32":
      return iotaBcs.u32();
    case "u64":
      return iotaBcs.u64();
    case "u128":
      return iotaBcs.u128();
    case "u256":
      return iotaBcs.u256();
    case "bool":
      return iotaBcs.bool();
    case "string":
      return iotaBcs.string();
    case "id":
    case "address":
      return iotaBcs.Address;
  }
  const generic = name.match(/^(vector|option)<(.+)>$/);
  if (generic) {
    const [kind, inner] = generic.slice(1);
    if (kind === "vector") {
      return iotaBcs.vector(schemaFromName(inner));
    } else {
      return iotaBcs.option(schemaFromName(inner));
    }
  }
  throw new Error(`Invalid Pure type name: ${name}`);
}
function hashTypedData(typeTag, data) {
  const typeTagBytes = Array.from(`${typeTag}::`).map((e) => e.charCodeAt(0));
  const dataWithTag = new Uint8Array(typeTagBytes.length + data.length);
  dataWithTag.set(typeTagBytes);
  dataWithTag.set(data, typeTagBytes.length);
  return blake2b(dataWithTag, { dkLen: 32 });
}
function prepareIotaAddress(address) {
  return normalizeIotaAddress(address).replace("0x", "");
}
class TransactionDataBuilder {
  constructor(clone) {
    this.version = 2;
    this.sender = (clone == null ? void 0 : clone.sender) ?? null;
    this.expiration = (clone == null ? void 0 : clone.expiration) ?? null;
    this.inputs = (clone == null ? void 0 : clone.inputs) ?? [];
    this.commands = (clone == null ? void 0 : clone.commands) ?? [];
    this.gasData = (clone == null ? void 0 : clone.gasData) ?? {
      budget: null,
      price: null,
      owner: null,
      payment: null
    };
  }
  static fromKindBytes(bytes) {
    const kind = iotaBcs.TransactionKind.parse(bytes);
    const programmableTx = kind.ProgrammableTransaction;
    if (!programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    return TransactionDataBuilder.restore({
      version: 2,
      sender: null,
      expiration: null,
      gasData: {
        budget: null,
        owner: null,
        payment: null,
        price: null
      },
      inputs: programmableTx.inputs,
      commands: programmableTx.commands
    });
  }
  static fromBytes(bytes) {
    const rawData = iotaBcs.TransactionData.parse(bytes);
    const data = rawData == null ? void 0 : rawData.V1;
    const programmableTx = data.kind.ProgrammableTransaction;
    if (!data || !programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    return TransactionDataBuilder.restore({
      version: 2,
      sender: data.sender,
      expiration: data.expiration,
      gasData: data.gasData,
      inputs: programmableTx.inputs,
      commands: programmableTx.commands
    });
  }
  static restore(data) {
    if (data.version === 2) {
      return new TransactionDataBuilder(parse(TransactionData, data));
    } else {
      return new TransactionDataBuilder(parse(TransactionData, transactionDataFromV1(data)));
    }
  }
  /**
   * Generate transaction digest.
   *
   * @param bytes BCS serialized transaction data
   * @returns transaction digest.
   */
  static getDigestFromBytes(bytes) {
    const hash = hashTypedData("TransactionData", bytes);
    return toBase58(hash);
  }
  // @deprecated use gasData instead
  get gasConfig() {
    return this.gasData;
  }
  // @deprecated use gasData instead
  set gasConfig(value) {
    this.gasData = value;
  }
  build({
    maxSizeBytes = Infinity,
    overrides,
    onlyTransactionKind
  } = {}) {
    const inputs = this.inputs;
    const commands = this.commands;
    const kind = {
      ProgrammableTransaction: {
        inputs,
        commands
      }
    };
    if (onlyTransactionKind) {
      return iotaBcs.TransactionKind.serialize(kind, { maxSize: maxSizeBytes }).toBytes();
    }
    const expiration = (overrides == null ? void 0 : overrides.expiration) ?? this.expiration;
    const sender = (overrides == null ? void 0 : overrides.sender) ?? this.sender;
    const gasData = { ...this.gasData, ...overrides == null ? void 0 : overrides.gasConfig, ...overrides == null ? void 0 : overrides.gasData };
    if (!sender) {
      throw new Error("Missing transaction sender");
    }
    if (!gasData.budget) {
      throw new Error("Missing gas budget");
    }
    if (!gasData.payment) {
      throw new Error("Missing gas payment");
    }
    if (!gasData.price) {
      throw new Error("Missing gas price");
    }
    const transactionData = {
      sender: prepareIotaAddress(sender),
      expiration: expiration ? expiration : { None: true },
      gasData: {
        payment: gasData.payment,
        owner: prepareIotaAddress(this.gasData.owner ?? sender),
        price: BigInt(gasData.price),
        budget: BigInt(gasData.budget)
      },
      kind: {
        ProgrammableTransaction: {
          inputs,
          commands
        }
      }
    };
    return iotaBcs.TransactionData.serialize(
      { V1: transactionData },
      { maxSize: maxSizeBytes }
    ).toBytes();
  }
  addInput(type, arg) {
    const index2 = this.inputs.length;
    this.inputs.push(arg);
    return { Input: index2, type, $kind: "Input" };
  }
  getInputUses(index2, fn) {
    this.mapArguments((arg, command) => {
      if (arg.$kind === "Input" && arg.Input === index2) {
        fn(arg, command);
      }
      return arg;
    });
  }
  mapArguments(fn) {
    for (const command of this.commands) {
      switch (command.$kind) {
        case "MoveCall":
          command.MoveCall.arguments = command.MoveCall.arguments.map(
            (arg) => fn(arg, command)
          );
          break;
        case "TransferObjects":
          command.TransferObjects.objects = command.TransferObjects.objects.map(
            (arg) => fn(arg, command)
          );
          command.TransferObjects.address = fn(command.TransferObjects.address, command);
          break;
        case "SplitCoins":
          command.SplitCoins.coin = fn(command.SplitCoins.coin, command);
          command.SplitCoins.amounts = command.SplitCoins.amounts.map(
            (arg) => fn(arg, command)
          );
          break;
        case "MergeCoins":
          command.MergeCoins.destination = fn(command.MergeCoins.destination, command);
          command.MergeCoins.sources = command.MergeCoins.sources.map(
            (arg) => fn(arg, command)
          );
          break;
        case "MakeMoveVec":
          command.MakeMoveVec.elements = command.MakeMoveVec.elements.map(
            (arg) => fn(arg, command)
          );
          break;
        case "Upgrade":
          command.Upgrade.ticket = fn(command.Upgrade.ticket, command);
          break;
        case "$Intent":
          const inputs = command.$Intent.inputs;
          command.$Intent.inputs = {};
          for (const [key, value] of Object.entries(inputs)) {
            command.$Intent.inputs[key] = Array.isArray(value) ? value.map((arg) => fn(arg, command)) : fn(value, command);
          }
          break;
        case "Publish":
          break;
        default:
          throw new Error(
            `Unexpected transaction kind: ${command.$kind}`
          );
      }
    }
  }
  replaceCommand(index2, replacement) {
    if (!Array.isArray(replacement)) {
      this.commands[index2] = replacement;
      return;
    }
    const sizeDiff = replacement.length - 1;
    this.commands.splice(index2, 1, ...replacement);
    if (sizeDiff !== 0) {
      this.mapArguments((arg) => {
        switch (arg.$kind) {
          case "Result":
            if (arg.Result > index2) {
              arg.Result += sizeDiff;
            }
            break;
          case "NestedResult":
            if (arg.NestedResult[0] > index2) {
              arg.NestedResult[0] += sizeDiff;
            }
            break;
        }
        return arg;
      });
    }
  }
  getDigest() {
    const bytes = this.build({ onlyTransactionKind: false });
    return TransactionDataBuilder.getDigestFromBytes(bytes);
  }
  snapshot() {
    return parse(TransactionData, this);
  }
}
function getIdFromCallArg(arg) {
  if (typeof arg === "string") {
    return normalizeIotaAddress(arg);
  }
  if (arg.Object) {
    if (arg.Object.ImmOrOwnedObject) {
      return normalizeIotaAddress(arg.Object.ImmOrOwnedObject.objectId);
    }
    if (arg.Object.Receiving) {
      return normalizeIotaAddress(arg.Object.Receiving.objectId);
    }
    return normalizeIotaAddress(arg.Object.SharedObject.objectId);
  }
  if (arg.UnresolvedObject) {
    return normalizeIotaAddress(arg.UnresolvedObject.objectId);
  }
  return void 0;
}
var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$1 = (obj, member, value, setter) => (__accessCheck$1(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod$1 = (obj, member, method) => (__accessCheck$1(obj, member, "access private method"), method);
var _serializationPlugins, _buildPlugins, _intentResolvers, _data, _Transaction_instances, normalizeTransactionArgument_fn, resolveArgument_fn, prepareBuild_fn, runPlugins_fn;
function createTransactionResult(index2) {
  const baseResult = { $kind: "Result", Result: index2 };
  const nestedResults = [];
  const nestedResultFor = (resultIndex) => nestedResults[resultIndex] ?? (nestedResults[resultIndex] = {
    $kind: "NestedResult",
    NestedResult: [index2, resultIndex]
  });
  return new Proxy(baseResult, {
    set() {
      throw new Error(
        "The transaction result is a proxy, and does not support setting properties directly"
      );
    },
    // TODO: Instead of making this return a concrete argument, we should ideally
    // make it reference-based (so that this gets resolved at build-time), which
    // allows re-ordering transactions.
    get(target2, property) {
      if (property in target2) {
        return Reflect.get(target2, property);
      }
      if (property === Symbol.iterator) {
        return function* () {
          let i = 0;
          while (true) {
            yield nestedResultFor(i);
            i++;
          }
        };
      }
      if (typeof property === "symbol") return;
      const resultIndex = parseInt(property, 10);
      if (Number.isNaN(resultIndex) || resultIndex < 0) return;
      return nestedResultFor(resultIndex);
    }
  });
}
const TRANSACTION_BRAND = Symbol.for("@iota/transaction");
function isTransaction(obj) {
  return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
}
const modulePluginRegistry = {
  buildPlugins: /* @__PURE__ */ new Map(),
  serializationPlugins: /* @__PURE__ */ new Map()
};
const TRANSACTION_REGISTRY_KEY = Symbol.for("@iota/transaction/registry");
function getGlobalPluginRegistry() {
  try {
    const target2 = globalThis;
    if (!target2[TRANSACTION_REGISTRY_KEY]) {
      target2[TRANSACTION_REGISTRY_KEY] = modulePluginRegistry;
    }
    return target2[TRANSACTION_REGISTRY_KEY];
  } catch (e) {
    return modulePluginRegistry;
  }
}
const _Transaction = class _Transaction2 {
  constructor() {
    __privateAdd$1(this, _Transaction_instances);
    __privateAdd$1(this, _serializationPlugins);
    __privateAdd$1(this, _buildPlugins);
    __privateAdd$1(this, _intentResolvers, /* @__PURE__ */ new Map());
    __privateAdd$1(this, _data);
    this.object = createObjectMethods(
      (value) => {
        var _a2, _b;
        if (typeof value === "function") {
          return this.object(value(this));
        }
        if (typeof value === "object" && is(Argument$1, value)) {
          return value;
        }
        const id = getIdFromCallArg(value);
        const inserted = __privateGet$1(this, _data).inputs.find((i) => id === getIdFromCallArg(i));
        if (((_a2 = inserted == null ? void 0 : inserted.Object) == null ? void 0 : _a2.SharedObject) && typeof value === "object" && ((_b = value.Object) == null ? void 0 : _b.SharedObject)) {
          inserted.Object.SharedObject.mutable = inserted.Object.SharedObject.mutable || value.Object.SharedObject.mutable;
        }
        return inserted ? { $kind: "Input", Input: __privateGet$1(this, _data).inputs.indexOf(inserted), type: "object" } : __privateGet$1(this, _data).addInput(
          "object",
          typeof value === "string" ? {
            $kind: "UnresolvedObject",
            UnresolvedObject: { objectId: normalizeIotaAddress(value) }
          } : value
        );
      }
    );
    const globalPlugins = getGlobalPluginRegistry();
    __privateSet$1(this, _data, new TransactionDataBuilder());
    __privateSet$1(this, _buildPlugins, [...globalPlugins.buildPlugins.values()]);
    __privateSet$1(this, _serializationPlugins, [...globalPlugins.serializationPlugins.values()]);
  }
  /**
   * Converts from a serialize transaction kind (built with `build({ onlyTransactionKind: true })`) to a `Transaction` class.
   * Supports either a byte array, or base64-encoded bytes.
   */
  static fromKind(serialized) {
    const tx = new _Transaction2();
    __privateSet$1(tx, _data, TransactionDataBuilder.fromKindBytes(
      typeof serialized === "string" ? fromBase64(serialized) : serialized
    ));
    return tx;
  }
  /**
   * Converts from a serialized transaction format to a `Transaction` class.
   * There are two supported serialized formats:
   * - A string returned from `Transaction#serialize`. The serialized format must be compatible, or it will throw an error.
   * - A byte array (or base64-encoded bytes) containing BCS transaction data.
   */
  static from(transaction) {
    const newTransaction = new _Transaction2();
    if (isTransaction(transaction)) {
      __privateSet$1(newTransaction, _data, new TransactionDataBuilder(transaction.getData()));
    } else if (typeof transaction !== "string" || !transaction.startsWith("{")) {
      __privateSet$1(newTransaction, _data, TransactionDataBuilder.fromBytes(
        typeof transaction === "string" ? fromBase64(transaction) : transaction
      ));
    } else {
      __privateSet$1(newTransaction, _data, TransactionDataBuilder.restore(JSON.parse(transaction)));
    }
    return newTransaction;
  }
  static registerGlobalSerializationPlugin(stepOrStep, step) {
    getGlobalPluginRegistry().serializationPlugins.set(
      stepOrStep,
      step ?? stepOrStep
    );
  }
  static unregisterGlobalSerializationPlugin(name) {
    getGlobalPluginRegistry().serializationPlugins.delete(name);
  }
  static registerGlobalBuildPlugin(stepOrStep, step) {
    getGlobalPluginRegistry().buildPlugins.set(
      stepOrStep,
      step ?? stepOrStep
    );
  }
  static unregisterGlobalBuildPlugin(name) {
    getGlobalPluginRegistry().buildPlugins.delete(name);
  }
  addSerializationPlugin(step) {
    __privateGet$1(this, _serializationPlugins).push(step);
  }
  addBuildPlugin(step) {
    __privateGet$1(this, _buildPlugins).push(step);
  }
  addIntentResolver(intent, resolver) {
    if (__privateGet$1(this, _intentResolvers).has(intent) && __privateGet$1(this, _intentResolvers).get(intent) !== resolver) {
      throw new Error(`Intent resolver for ${intent} already exists`);
    }
    __privateGet$1(this, _intentResolvers).set(intent, resolver);
  }
  setSender(sender) {
    __privateGet$1(this, _data).sender = sender;
  }
  /**
   * Sets the sender only if it has not already been set.
   * This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
   */
  setSenderIfNotSet(sender) {
    if (!__privateGet$1(this, _data).sender) {
      __privateGet$1(this, _data).sender = sender;
    }
  }
  setExpiration(expiration) {
    __privateGet$1(this, _data).expiration = expiration ? parse(TransactionExpiration$2, expiration) : null;
  }
  setGasPrice(price) {
    __privateGet$1(this, _data).gasConfig.price = String(price);
  }
  setGasBudget(budget) {
    __privateGet$1(this, _data).gasConfig.budget = String(budget);
  }
  setGasBudgetIfNotSet(budget) {
    if (__privateGet$1(this, _data).gasData.budget == null) {
      __privateGet$1(this, _data).gasConfig.budget = String(budget);
    }
  }
  setGasOwner(owner) {
    __privateGet$1(this, _data).gasConfig.owner = owner;
  }
  setGasPayment(payments) {
    __privateGet$1(this, _data).gasConfig.payment = payments.map((payment) => parse(ObjectRef$1, payment));
  }
  /** @deprecated Use `getData()` instead. */
  get blockData() {
    return serializeV1TransactionData(__privateGet$1(this, _data).snapshot());
  }
  /** Get a snapshot of the transaction data, in JSON form: */
  getData() {
    return __privateGet$1(this, _data).snapshot();
  }
  // Used to brand transaction classes so that they can be identified, even between multiple copies
  // of the builder.
  get [TRANSACTION_BRAND]() {
    return true;
  }
  // Temporary workaround for the wallet interface accidentally serializing transactions via postMessage
  get pure() {
    Object.defineProperty(this, "pure", {
      enumerable: false,
      value: createPure((value) => {
        if (isSerializedBcs(value)) {
          return __privateGet$1(this, _data).addInput("pure", {
            $kind: "Pure",
            Pure: {
              bytes: value.toBase64()
            }
          });
        }
        return __privateGet$1(this, _data).addInput(
          "pure",
          is(NormalizedCallArg$1, value) ? parse(NormalizedCallArg$1, value) : value instanceof Uint8Array ? Inputs.Pure(value) : { $kind: "UnresolvedPure", UnresolvedPure: { value } }
        );
      })
    });
    return this.pure;
  }
  /** Returns an argument for the gas coin, to be used in a transaction. */
  get gas() {
    return { $kind: "GasCoin", GasCoin: true };
  }
  /**
   * Add a new object input to the transaction using the fully-resolved object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  objectRef(...args) {
    return this.object(Inputs.ObjectRef(...args));
  }
  /**
   * Add a new receiving input to the transaction using the fully-resolved object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  receivingRef(...args) {
    return this.object(Inputs.ReceivingRef(...args));
  }
  /**
   * Add a new shared object input to the transaction using the fully-resolved shared object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  sharedObjectRef(...args) {
    return this.object(Inputs.SharedObjectRef(...args));
  }
  /** Add a transaction to the transaction */
  add(command) {
    if (typeof command === "function") {
      return command(this);
    }
    const index2 = __privateGet$1(this, _data).commands.push(command);
    return createTransactionResult(index2 - 1);
  }
  // Method shorthands:
  splitCoins(coin, amounts) {
    return this.add(
      Commands.SplitCoins(
        typeof coin === "string" ? this.object(coin) : __privateMethod$1(this, _Transaction_instances, resolveArgument_fn).call(this, coin),
        amounts.map(
          (amount) => typeof amount === "number" || typeof amount === "bigint" || typeof amount === "string" ? this.pure.u64(amount) : __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, amount)
        )
      )
    );
  }
  mergeCoins(destination, sources) {
    return this.add(
      Commands.MergeCoins(
        this.object(destination),
        sources.map((src) => this.object(src))
      )
    );
  }
  publish({ modules, dependencies }) {
    return this.add(
      Commands.Publish({
        modules,
        dependencies
      })
    );
  }
  upgrade({
    modules,
    dependencies,
    package: packageId,
    ticket
  }) {
    return this.add(
      Commands.Upgrade({
        modules,
        dependencies,
        package: packageId,
        ticket: this.object(ticket)
      })
    );
  }
  moveCall({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arguments: args,
    ...input
  }) {
    return this.add(
      Commands.MoveCall({
        ...input,
        arguments: args == null ? void 0 : args.map((arg) => __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, arg))
      })
    );
  }
  transferObjects(objects, address) {
    return this.add(
      Commands.TransferObjects(
        objects.map((obj) => this.object(obj)),
        typeof address === "string" ? this.pure.address(address) : __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, address)
      )
    );
  }
  makeMoveVec({
    type,
    elements
  }) {
    return this.add(
      Commands.MakeMoveVec({
        type,
        elements: elements.map((obj) => this.object(obj))
      })
    );
  }
  /**
   * @deprecated Use toJSON instead.
   * For synchronous serialization, you can use `getData()`
   * */
  serialize() {
    return JSON.stringify(serializeV1TransactionData(__privateGet$1(this, _data).snapshot()));
  }
  async toJSON(options = {}) {
    await this.prepareForSerialization(options);
    return JSON.stringify(
      parse(SerializedTransactionDataV2, __privateGet$1(this, _data).snapshot()),
      (_key, value) => typeof value === "bigint" ? value.toString() : value,
      2
    );
  }
  /** Build the transaction to BCS bytes, and sign it with the provided keypair. */
  async sign(options) {
    const { signer, ...buildOptions } = options;
    const bytes = await this.build(buildOptions);
    return signer.signTransaction(bytes);
  }
  /** Build the transaction to BCS bytes. */
  async build(options = {}) {
    await this.prepareForSerialization(options);
    await __privateMethod$1(this, _Transaction_instances, prepareBuild_fn).call(this, options);
    return __privateGet$1(this, _data).build({
      maxSizeBytes: options.maxSizeBytes,
      onlyTransactionKind: options.onlyTransactionKind
    });
  }
  /** Derive transaction digest */
  async getDigest(options = {}) {
    await __privateMethod$1(this, _Transaction_instances, prepareBuild_fn).call(this, options);
    return __privateGet$1(this, _data).getDigest();
  }
  async prepareForSerialization(options) {
    var _a2;
    const intents = /* @__PURE__ */ new Set();
    for (const command of __privateGet$1(this, _data).commands) {
      if (command.$Intent) {
        intents.add(command.$Intent.name);
      }
    }
    const steps = [...__privateGet$1(this, _serializationPlugins)];
    for (const intent of intents) {
      if ((_a2 = options.supportedIntents) == null ? void 0 : _a2.includes(intent)) {
        continue;
      }
      if (!__privateGet$1(this, _intentResolvers).has(intent)) {
        throw new Error(`Missing intent resolver for ${intent}`);
      }
      steps.push(__privateGet$1(this, _intentResolvers).get(intent));
    }
    await __privateMethod$1(this, _Transaction_instances, runPlugins_fn).call(this, steps, options);
  }
};
_serializationPlugins = /* @__PURE__ */ new WeakMap();
_buildPlugins = /* @__PURE__ */ new WeakMap();
_intentResolvers = /* @__PURE__ */ new WeakMap();
_data = /* @__PURE__ */ new WeakMap();
_Transaction_instances = /* @__PURE__ */ new WeakSet();
normalizeTransactionArgument_fn = function(arg) {
  if (isSerializedBcs(arg)) {
    return this.pure(arg);
  }
  return __privateMethod$1(this, _Transaction_instances, resolveArgument_fn).call(this, arg);
};
resolveArgument_fn = function(arg) {
  if (typeof arg === "function") {
    return parse(Argument$1, arg(this));
  }
  return parse(Argument$1, arg);
};
prepareBuild_fn = async function(options) {
  if (!options.onlyTransactionKind && !__privateGet$1(this, _data).sender) {
    throw new Error("Missing transaction sender");
  }
  await __privateMethod$1(this, _Transaction_instances, runPlugins_fn).call(this, [...__privateGet$1(this, _buildPlugins), resolveTransactionData], options);
};
runPlugins_fn = async function(plugins, options) {
  const createNext = (i) => {
    if (i >= plugins.length) {
      return () => {
      };
    }
    const plugin = plugins[i];
    return async () => {
      const next = createNext(i + 1);
      let calledNext = false;
      let nextResolved = false;
      await plugin(__privateGet$1(this, _data), options, async () => {
        if (calledNext) {
          throw new Error(`next() was call multiple times in TransactionPlugin ${i}`);
        }
        calledNext = true;
        await next();
        nextResolved = true;
      });
      if (!calledNext) {
        throw new Error(`next() was not called in TransactionPlugin ${i}`);
      }
      if (!nextResolved) {
        throw new Error(`next() was not awaited in TransactionPlugin ${i}`);
      }
    };
  };
  await createNext(0)();
};
let Transaction = _Transaction;
const IOTA_CLIENT_BRAND = Symbol.for("@iota/IotaClient");
class IotaClient {
  get [IOTA_CLIENT_BRAND]() {
    return true;
  }
  /**
   * Establish a connection to an IOTA RPC endpoint
   *
   * @param options configuration options for the API Client
   */
  constructor(options) {
    this.transport = options.transport ?? new IotaHTTPTransport({ url: options.url });
  }
  async getRpcApiVersion() {
    const resp = await this.transport.request({
      method: "rpc.discover",
      params: []
    });
    return resp.info.version;
  }
  /**
   * Get all Coin<`coin_type`> objects owned by an address.
   */
  async getCoins(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getCoins",
      params: [input.owner, input.coinType, input.cursor, input.limit]
    });
  }
  /**
   * Get all Coin objects owned by an address.
   */
  async getAllCoins(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getAllCoins",
      params: [input.owner, input.cursor, input.limit]
    });
  }
  /**
   * Get the total coin balance for one coin type, owned by the address owner.
   */
  async getBalance(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getBalance",
      params: [input.owner, input.coinType]
    });
  }
  /**
   * Get the total coin balance for all coin types, owned by the address owner.
   */
  async getAllBalances(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getAllBalances",
      params: [input.owner]
    });
  }
  /**
   * Fetch CoinMetadata for a given coin type
   */
  async getCoinMetadata(input) {
    return await this.transport.request({
      method: "iotax_getCoinMetadata",
      params: [input.coinType]
    });
  }
  /**
   *  Fetch total supply for a coin
   */
  async getTotalSupply(input) {
    return await this.transport.request({
      method: "iotax_getTotalSupply",
      params: [input.coinType]
    });
  }
  /**
   *  Fetch circulating supply for a coin
   */
  async getCirculatingSupply() {
    return await this.transport.request({
      method: "iotax_getCirculatingSupply",
      params: []
    });
  }
  /**
   * Invoke any RPC method
   * @param method the method to be invoked
   * @param args the arguments to be passed to the RPC request
   */
  async call(method, params) {
    return await this.transport.request({ method, params });
  }
  /**
   * Get Move function argument types like read, write and full access
   */
  async getMoveFunctionArgTypes(input) {
    return await this.transport.request({
      method: "iota_getMoveFunctionArgTypes",
      params: [input.package, input.module, input.function]
    });
  }
  /**
   * Get a map from module name to
   * structured representations of Move modules
   */
  async getNormalizedMoveModulesByPackage(input) {
    return await this.transport.request({
      method: "iota_getNormalizedMoveModulesByPackage",
      params: [input.package]
    });
  }
  /**
   * Get a structured representation of Move module
   */
  async getNormalizedMoveModule(input) {
    return await this.transport.request({
      method: "iota_getNormalizedMoveModule",
      params: [input.package, input.module]
    });
  }
  /**
   * Get a structured representation of Move function
   */
  async getNormalizedMoveFunction(input) {
    return await this.transport.request({
      method: "iota_getNormalizedMoveFunction",
      params: [input.package, input.module, input.function]
    });
  }
  /**
   * Get a structured representation of Move struct
   */
  async getNormalizedMoveStruct(input) {
    return await this.transport.request({
      method: "iota_getNormalizedMoveStruct",
      params: [input.package, input.module, input.struct]
    });
  }
  /**
   * Get all objects owned by an address
   */
  async getOwnedObjects(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getOwnedObjects",
      params: [
        input.owner,
        {
          filter: input.filter,
          options: input.options
        },
        input.cursor,
        input.limit
      ]
    });
  }
  /**
   * Get details about an object
   */
  async getObject(input) {
    if (!input.id || !isValidIotaObjectId(normalizeIotaObjectId(input.id))) {
      throw new Error("Invalid IOTA Object id");
    }
    return await this.transport.request({
      method: "iota_getObject",
      params: [input.id, input.options]
    });
  }
  async tryGetPastObject(input) {
    return await this.transport.request({
      method: "iota_tryGetPastObject",
      params: [input.id, input.version, input.options]
    });
  }
  /**
   * Batch get details about a list of objects. If any of the object ids are duplicates the call will fail
   */
  async multiGetObjects(input) {
    input.ids.forEach((id) => {
      if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) {
        throw new Error(`Invalid IOTA Object id ${id}`);
      }
    });
    const hasDuplicates = input.ids.length !== new Set(input.ids).size;
    if (hasDuplicates) {
      throw new Error(`Duplicate object ids in batch call ${input.ids}`);
    }
    return await this.transport.request({
      method: "iota_multiGetObjects",
      params: [input.ids, input.options]
    });
  }
  /**
   * Get transaction blocks for a given query criteria
   */
  async queryTransactionBlocks(input) {
    return await this.transport.request({
      method: "iotax_queryTransactionBlocks",
      params: [
        {
          filter: input.filter,
          options: input.options
        },
        input.cursor,
        input.limit,
        (input.order || "descending") === "descending"
      ]
    });
  }
  async getTransactionBlock(input) {
    if (!isValidTransactionDigest(input.digest)) {
      throw new Error("Invalid Transaction digest");
    }
    return await this.transport.request({
      method: "iota_getTransactionBlock",
      params: [input.digest, input.options]
    });
  }
  async multiGetTransactionBlocks(input) {
    input.digests.forEach((d) => {
      if (!isValidTransactionDigest(d)) {
        throw new Error(`Invalid Transaction digest ${d}`);
      }
    });
    const hasDuplicates = input.digests.length !== new Set(input.digests).size;
    if (hasDuplicates) {
      throw new Error(`Duplicate digests in batch call ${input.digests}`);
    }
    return await this.transport.request({
      method: "iota_multiGetTransactionBlocks",
      params: [input.digests, input.options]
    });
  }
  async executeTransactionBlock({
    transactionBlock,
    signature,
    options
  }) {
    const result = await this.transport.request({
      method: "iota_executeTransactionBlock",
      params: [
        typeof transactionBlock === "string" ? transactionBlock : toBase64(transactionBlock),
        Array.isArray(signature) ? signature : [signature],
        options
      ]
    });
    return result;
  }
  async signAndExecuteTransaction({
    transaction,
    signer,
    ...input
  }) {
    let transactionBytes;
    if (transaction instanceof Uint8Array) {
      transactionBytes = transaction;
    } else {
      transaction.setSenderIfNotSet(signer.toIotaAddress());
      transactionBytes = await transaction.build({ client: this });
    }
    const { signature, bytes } = await signer.signTransaction(transactionBytes);
    return this.executeTransactionBlock({
      transactionBlock: bytes,
      signature,
      ...input
    });
  }
  /**
   * Get total number of transactions
   */
  async getTotalTransactionBlocks() {
    const resp = await this.transport.request({
      method: "iota_getTotalTransactionBlocks",
      params: []
    });
    return BigInt(resp);
  }
  /**
   * Getting the reference gas price for the network
   */
  async getReferenceGasPrice() {
    const resp = await this.transport.request({
      method: "iotax_getReferenceGasPrice",
      params: []
    });
    return BigInt(resp);
  }
  /**
   * Return the delegated stakes for an address
   */
  async getStakes(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({ method: "iotax_getStakes", params: [input.owner] });
  }
  /**
   * Return the timelocked delegated stakes for an address
   */
  async getTimelockedStakes(input) {
    if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) {
      throw new Error("Invalid IOTA address");
    }
    return await this.transport.request({
      method: "iotax_getTimelockedStakes",
      params: [input.owner]
    });
  }
  /**
   * Return the delegated stakes queried by id.
   */
  async getStakesByIds(input) {
    input.stakedIotaIds.forEach((id) => {
      if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) {
        throw new Error(`Invalid IOTA Stake id ${id}`);
      }
    });
    return await this.transport.request({
      method: "iotax_getStakesByIds",
      params: [input.stakedIotaIds]
    });
  }
  /**
   * Return the timelocked delegated stakes queried by id.
   */
  async getTimelockedStakesByIds(input) {
    input.timelockedStakedIotaIds.forEach((id) => {
      if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) {
        throw new Error(`Invalid IOTA Timelocked Stake id ${id}`);
      }
    });
    return await this.transport.request({
      method: "iotax_getTimelockedStakesByIds",
      params: [input.timelockedStakedIotaIds]
    });
  }
  /**
   * Return the latest IOTA system state object on networks supporting protocol version `< 5`.
   * These are networks with node software release version `< 0.11`.
   * @deprecated Use `getLatestIotaSystemState` instead.
   */
  async getLatestIotaSystemStateV1() {
    return await this.transport.request({
      method: "iotax_getLatestIotaSystemState",
      params: []
    });
  }
  /**
   * Return the latest IOTA system state object on networks supporting protocol version `>= 5`.
   * These are networks with node software release version `>= 0.11`.
   *
   * You probably want to use `getLatestIotaSystemState` instead to prevent issues with future deprecations
   * or in case the node does not support protocol version `>= 5`.
   */
  async getLatestIotaSystemStateV2() {
    return await this.transport.request({
      method: "iotax_getLatestIotaSystemStateV2",
      params: []
    });
  }
  /**
   * Return the latest supported IOTA system state object.
   *
   * This returns a backwards-compatible system state object that dynamically uses the V1 or V2
   * depending on the protocol version supported by the node. This method will continue to be supported
   * as more protocol versions are released with changes to the system state.
   *
   * This is quite useful in case your app does not know in advance what node is it going to be using,
   * this way you as developer dont need to handle each possible system state variant,
   * this is already handled by this method.
   */
  async getLatestIotaSystemState() {
    const protocolConfig = await this.getProtocolConfig();
    const isV2Supported = Number(protocolConfig.maxSupportedProtocolVersion) >= 5;
    const iotaSystemStateSummary = isV2Supported ? await this.getLatestIotaSystemStateV2() : {
      V1: await this.getLatestIotaSystemStateV1()
    };
    return "V2" in iotaSystemStateSummary ? {
      ...iotaSystemStateSummary.V2,
      committeeMembers: iotaSystemStateSummary.V2.committeeMembers.map(
        (committeeMemberIndex) => iotaSystemStateSummary.V2.activeValidators[Number(committeeMemberIndex)]
      )
    } : {
      ...iotaSystemStateSummary.V1,
      committeeMembers: iotaSystemStateSummary.V1.activeValidators,
      safeModeComputationCharges: iotaSystemStateSummary.V1.safeModeComputationRewards,
      safeModeComputationChargesBurned: iotaSystemStateSummary.V1.safeModeComputationRewards
    };
  }
  /**
   * Get events for a given query criteria
   */
  async queryEvents(input) {
    return await this.transport.request({
      method: "iotax_queryEvents",
      params: [
        input.query,
        input.cursor,
        input.limit,
        (input.order || "descending") === "descending"
      ]
    });
  }
  /**
   * Subscribe to get notifications whenever an event matching the filter occurs
   *
   * @deprecated
   */
  async subscribeEvent(input) {
    return this.transport.subscribe({
      method: "iotax_subscribeEvent",
      unsubscribe: "iotax_unsubscribeEvent",
      params: [input.filter],
      onMessage: input.onMessage
    });
  }
  /**
   * @deprecated
   */
  async subscribeTransaction(input) {
    return this.transport.subscribe({
      method: "iotax_subscribeTransaction",
      unsubscribe: "iotax_unsubscribeTransaction",
      params: [input.filter],
      onMessage: input.onMessage
    });
  }
  /**
   * Runs the transaction block in dev-inspect mode. Which allows for nearly any
   * transaction (or Move call) with any arguments. Detailed results are
   * provided, including both the transaction effects and any return values.
   */
  async devInspectTransactionBlock(input) {
    var _a2;
    let devInspectTxBytes;
    if (isTransaction(input.transactionBlock)) {
      input.transactionBlock.setSenderIfNotSet(input.sender);
      devInspectTxBytes = toBase64(
        await input.transactionBlock.build({
          client: this,
          onlyTransactionKind: true
        })
      );
    } else if (typeof input.transactionBlock === "string") {
      devInspectTxBytes = input.transactionBlock;
    } else if (input.transactionBlock instanceof Uint8Array) {
      devInspectTxBytes = toBase64(input.transactionBlock);
    } else {
      throw new Error("Unknown transaction block format.");
    }
    return await this.transport.request({
      method: "iota_devInspectTransactionBlock",
      params: [input.sender, devInspectTxBytes, (_a2 = input.gasPrice) == null ? void 0 : _a2.toString(), input.epoch]
    });
  }
  /**
   * Dry run a transaction block and return the result.
   */
  async dryRunTransactionBlock(input) {
    return await this.transport.request({
      method: "iota_dryRunTransactionBlock",
      params: [
        typeof input.transactionBlock === "string" ? input.transactionBlock : toBase64(input.transactionBlock)
      ]
    });
  }
  /**
   * Return the list of dynamic field objects owned by an object
   */
  async getDynamicFields(input) {
    if (!input.parentId || !isValidIotaObjectId(normalizeIotaObjectId(input.parentId))) {
      throw new Error("Invalid IOTA Object id");
    }
    return await this.transport.request({
      method: "iotax_getDynamicFields",
      params: [input.parentId, input.cursor, input.limit]
    });
  }
  /**
   * Return the dynamic field object information for a specified object
   * Uses the V2.
   */
  async getDynamicFieldObject(input) {
    return await this.transport.request({
      method: "iotax_getDynamicFieldObjectV2",
      params: [input.parentObjectId, input.name, input.options]
    });
  }
  /**
   * Return the dynamic field object information for a specified object
   * @deprecated `getDynamicFieldObjectV1` is deprecated, prefer to use `getDynamicFieldObject` which uses V2.
   */
  async getDynamicFieldObjectV1(input) {
    return await this.transport.request({
      method: "iotax_getDynamicFieldObject",
      params: [input.parentId, input.name]
    });
  }
  /**
   * Return the dynamic field object information for a specified object with content options.
   */
  async getDynamicFieldObjectV2(input) {
    return await this.transport.request({
      method: "iotax_getDynamicFieldObjectV2",
      params: [input.parentObjectId, input.name, input.options]
    });
  }
  /**
   * Get the sequence number of the latest checkpoint that has been executed
   */
  async getLatestCheckpointSequenceNumber() {
    const resp = await this.transport.request({
      method: "iota_getLatestCheckpointSequenceNumber",
      params: []
    });
    return String(resp);
  }
  /**
   * Returns information about a given checkpoint
   */
  async getCheckpoint(input) {
    return await this.transport.request({ method: "iota_getCheckpoint", params: [input.id] });
  }
  /**
   * Returns historical checkpoints paginated
   */
  async getCheckpoints(input) {
    return await this.transport.request({
      method: "iota_getCheckpoints",
      params: [input.cursor, input == null ? void 0 : input.limit, input.descendingOrder]
    });
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getCommitteeInfo(input) {
    return await this.transport.request({
      method: "iotax_getCommitteeInfo",
      params: [input == null ? void 0 : input.epoch]
    });
  }
  async getNetworkMetrics() {
    return await this.transport.request({ method: "iotax_getNetworkMetrics", params: [] });
  }
  async getAddressMetrics() {
    return await this.transport.request({
      method: "iotax_getLatestAddressMetrics",
      params: []
    });
  }
  async getEpochMetrics(input) {
    return await this.transport.request({
      method: "iotax_getEpochMetrics",
      params: [input == null ? void 0 : input.cursor, input == null ? void 0 : input.limit, input == null ? void 0 : input.descendingOrder]
    });
  }
  async getAllEpochAddressMetrics(input) {
    return await this.transport.request({
      method: "iotax_getAllEpochAddressMetrics",
      params: [input == null ? void 0 : input.descendingOrder]
    });
  }
  async getCheckpointAddressMetrics(input) {
    return await this.transport.request({
      method: "iotax_getCheckpointAddressMetrics",
      params: [input == null ? void 0 : input.checkpoint]
    });
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getEpochs(input) {
    return await this.transport.request({
      method: "iotax_getEpochs",
      params: [input == null ? void 0 : input.cursor, input == null ? void 0 : input.limit, input == null ? void 0 : input.descendingOrder]
    });
  }
  /**
   * Returns list of top move calls by usage
   */
  async getMoveCallMetrics() {
    return await this.transport.request({ method: "iotax_getMoveCallMetrics", params: [] });
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getCurrentEpoch() {
    return await this.transport.request({ method: "iotax_getCurrentEpoch", params: [] });
  }
  async getTotalTransactions() {
    const resp = await this.transport.request({
      method: "iotax_getTotalTransactions",
      params: []
    });
    return String(resp);
  }
  /**
   * Return the Validators APYs
   */
  async getValidatorsApy() {
    return await this.transport.request({ method: "iotax_getValidatorsApy", params: [] });
  }
  async getChainIdentifier() {
    return await this.transport.request({
      method: "iota_getChainIdentifier",
      params: []
    });
  }
  async getProtocolConfig(input) {
    return await this.transport.request({
      method: "iota_getProtocolConfig",
      params: [input == null ? void 0 : input.version]
    });
  }
  /**
   * Returns the participation metrics (total unique addresses with delegated stake in the current epoch).
   */
  async getParticipationMetrics() {
    return await this.transport.request({
      method: "iotax_getParticipationMetrics",
      params: []
    });
  }
  /**
   * Wait for a transaction block result to be available over the API.
   * This can be used in conjunction with `executeTransactionBlock` to wait for the transaction to
   * be available via the API.
   * This currently polls the `getTransactionBlock` API to check for the transaction.
   */
  async waitForTransaction({
    signal,
    timeout = 60 * 1e3,
    pollInterval = 2 * 1e3,
    waitMode,
    ...input
  }) {
    const timeoutSignal = AbortSignal.timeout(timeout);
    const timeoutPromise = new Promise((_, reject) => {
      timeoutSignal.addEventListener("abort", () => reject(timeoutSignal.reason));
    });
    timeoutPromise.catch(() => {
    });
    while (!timeoutSignal.aborted) {
      signal == null ? void 0 : signal.throwIfAborted();
      const wait = async () => {
        await Promise.race([
          new Promise((resolve) => setTimeout(resolve, pollInterval)),
          timeoutPromise
        ]);
      };
      try {
        if (waitMode === "indexed-on-node") {
          const isIndexedOnNode = await this.isTransactionIndexedOnNode({
            digest: input.digest
          });
          if (isIndexedOnNode) {
            return await this.getTransactionBlock(input);
          }
        } else if (waitMode === "checkpoint") {
          const transaction = await this.getTransactionBlock(input);
          if (transaction.checkpoint) {
            return transaction;
          }
        } else {
          return await this.getTransactionBlock(input);
        }
        await wait();
      } catch (e) {
        await wait();
      }
    }
    timeoutSignal.throwIfAborted();
    throw new Error("Unexpected error while waiting for transaction block.");
  }
  /**
   * Return the resolved record for the given name.
   */
  async iotaNamesLookup(input) {
    return await this.transport.request({
      method: "iotax_iotaNamesLookup",
      params: [input.name]
    });
  }
  /**
   * Return the resolved name for the given address.
   */
  async iotaNamesReverseLookup(input) {
    return await this.transport.request({
      method: "iotax_iotaNamesReverseLookup",
      params: [input.address]
    });
  }
  /**
   * Find all registration NFTs for the given address.
   */
  async iotaNamesFindAllRegistrationNFTs(input) {
    return await this.transport.request({
      method: "iotax_iotaNamesFindAllRegistrationNFTs",
      params: [input.address, input.cursor, input.limit, input.options]
    });
  }
  /**
   * Check if a Transaction has been indexed on the Node.
   */
  async isTransactionIndexedOnNode(input) {
    return await this.transport.request({
      method: "iota_isTransactionIndexedOnNode",
      params: [input.digest]
    });
  }
  /**
   * Calls a move view function.
   */
  async view(input) {
    return await this.transport.request({
      method: "iota_view",
      params: [input.functionName, input.typeArgs, input.callArgs]
    });
  }
}
function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}
const QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
const kindValues = new Set(Object.keys(QueryDocumentKeys));
function isNode(maybeNode) {
  const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
var OperationTypeNode;
(function(OperationTypeNode2) {
  OperationTypeNode2["QUERY"] = "query";
  OperationTypeNode2["MUTATION"] = "mutation";
  OperationTypeNode2["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));
var Kind;
(function(Kind2) {
  Kind2["NAME"] = "Name";
  Kind2["DOCUMENT"] = "Document";
  Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
  Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
  Kind2["SELECTION_SET"] = "SelectionSet";
  Kind2["FIELD"] = "Field";
  Kind2["ARGUMENT"] = "Argument";
  Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
  Kind2["INLINE_FRAGMENT"] = "InlineFragment";
  Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
  Kind2["VARIABLE"] = "Variable";
  Kind2["INT"] = "IntValue";
  Kind2["FLOAT"] = "FloatValue";
  Kind2["STRING"] = "StringValue";
  Kind2["BOOLEAN"] = "BooleanValue";
  Kind2["NULL"] = "NullValue";
  Kind2["ENUM"] = "EnumValue";
  Kind2["LIST"] = "ListValue";
  Kind2["OBJECT"] = "ObjectValue";
  Kind2["OBJECT_FIELD"] = "ObjectField";
  Kind2["DIRECTIVE"] = "Directive";
  Kind2["NAMED_TYPE"] = "NamedType";
  Kind2["LIST_TYPE"] = "ListType";
  Kind2["NON_NULL_TYPE"] = "NonNullType";
  Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
  Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
  Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
  Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
  Kind2["FIELD_DEFINITION"] = "FieldDefinition";
  Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
  Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
  Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
  Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
  Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
  Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
  Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
  Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
  Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
  Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
  Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
  Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
  Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
  Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
})(Kind || (Kind = {}));
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""');
  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1;
  const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines = (
    // add leading and trailing new lines only if it improves readability
    !isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes
  );
  let result = "";
  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
  if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
    result += "\n";
  }
  result += escapedValue;
  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }
  return '"""' + result + '"""';
}
const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
function formatValue(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";
    case "object":
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }
  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }
  const seenValues = [...previouslySeenValues, value];
  if (isJSONable(value)) {
    const jsonValue = value.toJSON();
    if (jsonValue !== value) {
      return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
function isJSONable(value) {
  return typeof value.toJSON === "function";
}
function formatObject(object2, seenValues) {
  const entries = Object.entries(object2);
  if (entries.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object2) + "]";
  }
  const properties = entries.map(
    ([key, value]) => key + ": " + formatValue(value, seenValues)
  );
  return "{ " + properties.join(", ") + " }";
}
function formatArray(array2, seenValues) {
  if (array2.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }
  const len = Math.min(MAX_ARRAY_LENGTH, array2.length);
  const remaining = array2.length - len;
  const items = [];
  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array2[i], seenValues));
  }
  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }
  return "[" + items.join(", ") + "]";
}
function getObjectTag(object2) {
  const tag = Object.prototype.toString.call(object2).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object2.constructor === "function") {
    const name = object2.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
}
const escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
];
const BREAK = Object.freeze({});
function visit(root2, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = /* @__PURE__ */ new Map();
  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  let stack = void 0;
  let inArray = Array.isArray(root2);
  let keys = [root2];
  let index2 = -1;
  let edits = [];
  let node = root2;
  let key = void 0;
  let parent = void 0;
  const path = [];
  const ancestors = [];
  do {
    index2++;
    const isLeaving = index2 === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? void 0 : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;
          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;
            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = { ...node };
          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }
      index2 = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else if (parent) {
      key = inArray ? index2 : keys[index2];
      node = parent[key];
      if (node === null || node === void 0) {
        continue;
      }
      path.push(key);
    }
    let result;
    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;
      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
      result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
      if (result === BREAK) {
        break;
      }
      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== void 0) {
        edits.push([key, result]);
        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }
    if (result === void 0 && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;
      stack = {
        inArray,
        index: index2,
        keys,
        edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
      index2 = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== void 0);
  if (edits.length !== 0) {
    return edits[edits.length - 1][1];
  }
  return root2;
}
function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];
  if (typeof kindVisitor === "object") {
    return kindVisitor;
  } else if (typeof kindVisitor === "function") {
    return {
      enter: kindVisitor,
      leave: void 0
    };
  }
  return {
    enter: visitor.enter,
    leave: visitor.leave
  };
}
function print(ast) {
  return visit(ast, printDocASTReducer);
}
const MAX_LINE_LENGTH = 80;
const printDocASTReducer = {
  Name: {
    leave: (node) => node.value
  },
  Variable: {
    leave: (node) => "$" + node.name
  },
  // Document
  Document: {
    leave: (node) => join(node.definitions, "\n\n")
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, " ")
        ],
        " "
      );
      return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections)
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap("", alias, ": ") + name;
      let argsLine = prefix + wrap("(", join(args, ", "), ")");
      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
      }
      return join([argsLine, join(directives, " "), selectionSet], " ");
    }
  },
  Argument: {
    leave: ({ name, value }) => name + ": " + value
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) => join(
      [
        "...",
        wrap("on ", typeCondition),
        join(directives, " "),
        selectionSet
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
      // or removed in the future.
      `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
    )
  },
  // Value
  IntValue: {
    leave: ({ value }) => value
  },
  FloatValue: {
    leave: ({ value }) => value
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value)
  },
  BooleanValue: {
    leave: ({ value }) => value ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value }) => value
  },
  ListValue: {
    leave: ({ values }) => "[" + join(values, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields }) => "{" + join(fields, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name, value }) => name + ": " + value
  },
  // Directive
  Directive: {
    leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name }) => name
  },
  ListType: {
    leave: ({ type }) => "[" + type + "]"
  },
  NonNullType: {
    leave: ({ type }) => type + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ": " + type
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
      [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(
      ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) => join(
      ["extend schema", join(directives, " "), block(operationTypes)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join(
      [
        "extend type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join(
      [
        "extend interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) => join(
      [
        "extend union",
        name,
        join(directives, " "),
        wrap("= ", join(types, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
  }
};
function join(maybeArray, separator = "") {
  var _maybeArray$filter$jo;
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
function block(array2) {
  return wrap("{\n", indent(join(array2, "\n")), "\n}");
}
function wrap(start2, maybeString, end = "") {
  return maybeString != null && maybeString !== "" ? start2 + maybeString + end : "";
}
function indent(str) {
  return wrap("  ", str.replace(/\n/g, "\n  "));
}
function hasMultilineItems(maybeArray) {
  var _maybeArray$some;
  return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
}
var TransactionBlockKindInput = /* @__PURE__ */ ((TransactionBlockKindInput2) => {
  TransactionBlockKindInput2["AuthenticatorStateUpdateV1"] = "AUTHENTICATOR_STATE_UPDATE_V1";
  TransactionBlockKindInput2["ConsensusCommitPrologueV1"] = "CONSENSUS_COMMIT_PROLOGUE_V1";
  TransactionBlockKindInput2["EndOfEpochTx"] = "END_OF_EPOCH_TX";
  TransactionBlockKindInput2["Genesis"] = "GENESIS";
  TransactionBlockKindInput2["ProgrammableTx"] = "PROGRAMMABLE_TX";
  TransactionBlockKindInput2["RandomnessStateUpdate"] = "RANDOMNESS_STATE_UPDATE";
  TransactionBlockKindInput2["SystemTx"] = "SYSTEM_TX";
  return TransactionBlockKindInput2;
})(TransactionBlockKindInput || {});
class TypedDocumentString extends String {
  constructor(value, __meta__) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }
  toString() {
    return this.value;
  }
}
new TypedDocumentString(`
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}
    `, { "fragmentName": "RPC_Checkpoint_Fields" });
new TypedDocumentString(`
    fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}
    `, { "fragmentName": "RPC_CREDENTIAL_FIELDS" });
new TypedDocumentString(`
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  exchangeRatesSize
  exchangeRates {
    contents {
      json
    }
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPool {
    address
  }
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
    fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`, { "fragmentName": "RPC_VALIDATOR_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}
    `, { "fragmentName": "RPC_MOVE_STRUCT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
    `, { "fragmentName": "RPC_MOVE_FUNCTION_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`, { "fragmentName": "RPC_MOVE_MODULE_FIELDS" });
new TypedDocumentString(`
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}
    `, { "fragmentName": "RPC_OBJECT_OWNER_FIELDS" });
new TypedDocumentString(`
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`, { "fragmentName": "RPC_OBJECT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_OBJECT_FIELDS on MoveObject {
  objectId: address
  bcs @include(if: $showBcs)
  contents @include(if: $showType) {
    type {
      repr
    }
  }
  contents @include(if: $showContent) {
    data
    type {
      repr
      layout
      signature
    }
  }
  contents @include(if: $showBcs) {
    bcs
    type {
      repr
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`, { "fragmentName": "RPC_MOVE_OBJECT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}
    `, { "fragmentName": "RPC_STAKE_FIELDS" });
new TypedDocumentString(`
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
    `, { "fragmentName": "RPC_EVENTS_FIELDS" });
new TypedDocumentString(`
    fragment PAGINATE_TRANSACTION_LISTS on TransactionBlock {
  effects {
    events(after: $afterEvents) @include(if: $hasMoreEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    balanceChanges(after: $afterBalanceChanges) @include(if: $hasMoreBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges(after: $afterObjectChanges) @include(if: $hasMoreObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`, { "fragmentName": "PAGINATE_TRANSACTION_LISTS" });
new TypedDocumentString(`
    fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`, { "fragmentName": "RPC_TRANSACTION_FIELDS" });
const GetCheckpointDocument = new TypedDocumentString(`
    query getCheckpoint($id: CheckpointId) {
  checkpoint(id: $id) {
    ...RPC_Checkpoint_Fields
  }
}
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}`);
const GetCheckpointsDocument = new TypedDocumentString(`
    query getCheckpoints($first: Int, $before: String, $last: Int, $after: String) {
  checkpoints(first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...RPC_Checkpoint_Fields
    }
  }
}
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}`);
const PaginateCheckpointTransactionBlocksDocument = new TypedDocumentString(`
    query paginateCheckpointTransactionBlocks($id: CheckpointId, $after: String) {
  checkpoint(id: $id) {
    transactionBlocks(after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        digest
      }
    }
  }
}
    `);
const DevInspectTransactionBlockDocument = new TypedDocumentString(`
    query devInspectTransactionBlock($txBytes: String!, $txMeta: TransactionMetadata!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  dryRunTransactionBlock(txBytes: $txBytes, txMeta: $txMeta) {
    error
    results {
      mutatedReferences {
        input {
          __typename
          ... on Input {
            inputIndex: ix
          }
          ... on Result {
            cmd
            resultIndex: ix
          }
        }
        type {
          repr
        }
        bcs
      }
      returnValues {
        type {
          repr
        }
        bcs
      }
    }
    transaction {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const DryRunTransactionBlockDocument = new TypedDocumentString(`
    query dryRunTransactionBlock($txBytes: String!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  dryRunTransactionBlock(txBytes: $txBytes) {
    error
    transaction {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const ExecuteTransactionBlockDocument = new TypedDocumentString(`
    mutation executeTransactionBlock($txBytes: String!, $signatures: [String!]!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  executeTransactionBlock(txBytes: $txBytes, signatures: $signatures) {
    errors
    effects {
      transactionBlock {
        ...RPC_TRANSACTION_FIELDS
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const GetAllBalancesDocument = new TypedDocumentString(`
    query getAllBalances($owner: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $owner) {
    balances(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        coinObjectCount
        totalBalance
      }
    }
  }
}
    `);
const GetBalanceDocument = new TypedDocumentString(`
    query getBalance($owner: IotaAddress!, $type: String = "0x2::iota::IOTA") {
  address(address: $owner) {
    balance(type: $type) {
      coinType {
        repr
      }
      coinObjectCount
      totalBalance
    }
  }
}
    `);
const GetChainIdentifierDocument = new TypedDocumentString(`
    query getChainIdentifier {
  chainIdentifier
}
    `);
const GetCoinMetadataDocument = new TypedDocumentString(`
    query getCoinMetadata($coinType: String!) {
  coinMetadata(coinType: $coinType) {
    decimals
    name
    symbol
    description
    iconUrl
    address
  }
}
    `);
const GetCoinsDocument = new TypedDocumentString(`
    query getCoins($owner: IotaAddress!, $first: Int, $cursor: String, $type: String = "0x2::iota::IOTA") {
  address(address: $owner) {
    address
    coins(first: $first, after: $cursor, type: $type) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinBalance
        contents {
          type {
            repr
          }
        }
        address
        version
        digest
        previousTransactionBlock {
          digest
        }
      }
    }
  }
}
    `);
const GetCommitteeInfoDocument = new TypedDocumentString(`
    query getCommitteeInfo($epochId: UInt53, $after: String) {
  epoch(id: $epochId) {
    epochId
    validatorSet {
      committeeMembers(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          credentials {
            authorityPubKey
          }
          votingPower
        }
      }
    }
  }
}
    `);
const GetCurrentEpochDocument = new TypedDocumentString(`
    query getCurrentEpoch {
  epoch {
    epochId
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
    }
    totalTransactions
    firstCheckpoint: checkpoints(first: 1) {
      nodes {
        sequenceNumber
      }
    }
    startTimestamp
    endTimestamp
    referenceGasPrice
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  exchangeRatesSize
  exchangeRates {
    contents {
      json
    }
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPool {
    address
  }
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
const PaginateEpochValidatorsDocument = new TypedDocumentString(`
    query paginateEpochValidators($id: UInt53!, $after: String) {
  epoch(id: $id) {
    validatorSet {
      activeValidators(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
    }
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  exchangeRatesSize
  exchangeRates {
    contents {
      json
    }
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPool {
    address
  }
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
const GetTypeLayoutDocument = new TypedDocumentString(`
    query getTypeLayout($type: String!) {
  type(type: $type) {
    layout
  }
}
    `);
const GetDynamicFieldObjectDocument = new TypedDocumentString(`
    query getDynamicFieldObject($parentId: IotaAddress!, $name: DynamicFieldName!, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false) {
  owner(address: $parentId) {
    dynamicObjectField(name: $name) {
      value {
        __typename
        ... on MoveObject {
          owner {
            __typename
            ... on Parent {
              parent {
                address
                digest
                version
                display @include(if: $showDisplay) {
                  key
                  value
                  error
                }
                storageRebate @include(if: $showStorageRebate)
                owner @include(if: $showOwner) {
                  __typename
                  ... on Parent {
                    parent {
                      address
                    }
                  }
                }
                previousTransactionBlock @include(if: $showPreviousTransaction) {
                  digest
                }
                asMoveObject @include(if: $showType) {
                  contents {
                    type {
                      repr
                    }
                  }
                }
                asMoveObject @include(if: $showContent) {
                  contents {
                    data
                    type {
                      repr
                      layout
                      signature
                    }
                  }
                }
                asMoveObject @include(if: $showBcs) {
                  contents {
                    data
                    type {
                      repr
                      layout
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `);
const GetDynamicFieldsDocument = new TypedDocumentString(`
    query getDynamicFields($parentId: IotaAddress!, $first: Int, $cursor: String) {
  owner(address: $parentId) {
    dynamicFields(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name {
          bcs
          json
          type {
            layout
            repr
          }
        }
        value {
          __typename
          ... on MoveValue {
            json
            type {
              repr
            }
          }
          ... on MoveObject {
            contents {
              type {
                repr
              }
              json
            }
            address
            digest
            version
          }
        }
      }
    }
  }
}
    `);
const GetLatestCheckpointSequenceNumberDocument = new TypedDocumentString(`
    query getLatestCheckpointSequenceNumber {
  checkpoint {
    sequenceNumber
  }
}
    `);
const GetLatestIotaSystemStateDocument = new TypedDocumentString(`
    query getLatestIotaSystemState {
  epoch {
    epochId
    startTimestamp
    endTimestamp
    referenceGasPrice
    safeMode {
      enabled
      gasSummary {
        computationCost
        computationCostBurned
        nonRefundableStorageFee
        storageCost
        storageRebate
      }
    }
    storageFund {
      nonRefundableBalance
      totalObjectStorageRebates
    }
    systemStateVersion
    iotaTotalSupply
    iotaTreasuryCapId
    systemParameters {
      minValidatorCount
      maxValidatorCount
      minValidatorJoiningStake
      durationMs
      validatorLowStakeThreshold
      validatorLowStakeGracePeriod
      validatorVeryLowStakeThreshold
    }
    protocolConfigs {
      protocolVersion
    }
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      inactivePoolsSize
      pendingActiveValidatorsSize
      stakingPoolMappingsSize
      validatorCandidatesSize
      pendingRemovals
      totalStake
      stakingPoolMappingsId
      pendingActiveValidatorsId
      validatorCandidatesId
      inactivePoolsId
    }
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  exchangeRatesSize
  exchangeRates {
    contents {
      json
    }
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPool {
    address
  }
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
const GetMoveFunctionArgTypesDocument = new TypedDocumentString(`
    query getMoveFunctionArgTypes($packageId: IotaAddress!, $module: String!, $function: String!) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        fileFormatVersion
        function(name: $function) {
          parameters {
            signature
          }
        }
      }
    }
  }
}
    `);
const GetNormalizedMoveFunctionDocument = new TypedDocumentString(`
    query getNormalizedMoveFunction($packageId: IotaAddress!, $module: String!, $function: String!) {
  object(address: $packageId) {
    address
    asMovePackage {
      module(name: $module) {
        fileFormatVersion
        function(name: $function) {
          ...RPC_MOVE_FUNCTION_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}`);
const GetNormalizedMoveModuleDocument = new TypedDocumentString(`
    query getNormalizedMoveModule($packageId: IotaAddress!, $module: String!) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        ...RPC_MOVE_MODULE_FIELDS
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
const PaginateMoveModuleListsDocument = new TypedDocumentString(`
    query paginateMoveModuleLists($packageId: IotaAddress!, $module: String!, $hasMoreFriends: Boolean!, $hasMoreStructs: Boolean!, $hasMoreFunctions: Boolean!, $afterFriends: String, $afterStructs: String, $afterFunctions: String) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        friends(after: $afterFriends) @include(if: $hasMoreFriends) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name
            package {
              address
            }
          }
        }
        structs(after: $afterStructs) @include(if: $hasMoreStructs) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...RPC_MOVE_STRUCT_FIELDS
          }
        }
        functions(after: $afterFunctions) @include(if: $hasMoreFunctions) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...RPC_MOVE_FUNCTION_FIELDS
          }
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
const GetNormalizedMoveModulesByPackageDocument = new TypedDocumentString(`
    query getNormalizedMoveModulesByPackage($packageId: IotaAddress!, $cursor: String) {
  object(address: $packageId) {
    asMovePackage {
      address
      modules(after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_MOVE_MODULE_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
const GetNormalizedMoveStructDocument = new TypedDocumentString(`
    query getNormalizedMoveStruct($packageId: IotaAddress!, $module: String!, $struct: String!) {
  object(address: $packageId) {
    asMovePackage {
      address
      module(name: $module) {
        fileFormatVersion
        struct(name: $struct) {
          ...RPC_MOVE_STRUCT_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
const GetProtocolConfigDocument = new TypedDocumentString(`
    query getProtocolConfig($protocolVersion: UInt53) {
  protocolConfig(protocolVersion: $protocolVersion) {
    protocolVersion
    configs {
      key
      value
    }
    featureFlags {
      key
      value
    }
  }
}
    `);
const GetReferenceGasPriceDocument = new TypedDocumentString(`
    query getReferenceGasPrice {
  epoch {
    referenceGasPrice
  }
}
    `);
const GetTotalSupplyDocument = new TypedDocumentString(`
    query getTotalSupply($coinType: String!) {
  coinMetadata(coinType: $coinType) {
    supply
    decimals
  }
}
    `);
const GetTotalTransactionBlocksDocument = new TypedDocumentString(`
    query getTotalTransactionBlocks {
  checkpoint {
    networkTotalTransactions
  }
}
    `);
const GetValidatorsApyDocument = new TypedDocumentString(`
    query getValidatorsApy {
  epoch {
    epochId
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          address {
            address
          }
          apy
        }
      }
    }
  }
}
    `);
new TypedDocumentString(`
    query resolveNameServiceAddress($name: String!) {
  resolveIotaNamesAddress(name: $name) {
    address
  }
}
    `);
new TypedDocumentString(`
    query resolveNameServiceNames($address: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $address) {
    iotaNamesRegistrations(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
      }
    }
  }
}
    `);
const IsTransactionIndexedOnNodeDocument = new TypedDocumentString(`
    query IsTransactionIndexedOnNode($digest: String!) {
  isTransactionIndexedOnNode(digest: $digest)
}
    `);
const GetOwnedObjectsDocument = new TypedDocumentString(`
    query getOwnedObjects($owner: IotaAddress!, $limit: Int, $cursor: String, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false, $filter: ObjectFilter) {
  address(address: $owner) {
    objects(first: $limit, after: $cursor, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_MOVE_OBJECT_FIELDS
      }
    }
  }
}
    fragment RPC_MOVE_OBJECT_FIELDS on MoveObject {
  objectId: address
  bcs @include(if: $showBcs)
  contents @include(if: $showType) {
    type {
      repr
    }
  }
  contents @include(if: $showContent) {
    data
    type {
      repr
      layout
      signature
    }
  }
  contents @include(if: $showBcs) {
    bcs
    type {
      repr
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
const GetObjectDocument = new TypedDocumentString(`
    query getObject($id: IotaAddress!, $showBcs: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showStorageRebate: Boolean = false) {
  object(address: $id) {
    ...RPC_OBJECT_FIELDS
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
const TryGetPastObjectDocument = new TypedDocumentString(`
    query tryGetPastObject($id: IotaAddress!, $version: UInt53, $showBcs: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showStorageRebate: Boolean = false) {
  current: object(address: $id) {
    address
    version
  }
  object(address: $id, version: $version) {
    ...RPC_OBJECT_FIELDS
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
const MultiGetObjectsDocument = new TypedDocumentString(`
    query multiGetObjects($ids: [IotaAddress!]!, $limit: Int, $cursor: String, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false) {
  objects(first: $limit, after: $cursor, filter: {objectIds: $ids}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_OBJECT_FIELDS
    }
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
const QueryEventsDocument = new TypedDocumentString(`
    query queryEvents($filter: EventFilter!, $before: String, $after: String, $first: Int, $last: Int) {
  events(
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    nodes {
      ...RPC_EVENTS_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`);
const GetStakesDocument = new TypedDocumentString(`
    query getStakes($owner: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $owner) {
    stakedIotas(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_STAKE_FIELDS
      }
    }
  }
}
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}`);
const GetStakesByIdsDocument = new TypedDocumentString(`
    query getStakesByIds($ids: [IotaAddress!]!, $limit: Int, $cursor: String) {
  objects(first: $limit, after: $cursor, filter: {objectIds: $ids}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      asMoveObject {
        asStakedIota {
          ...RPC_STAKE_FIELDS
        }
      }
    }
  }
}
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}`);
const QueryTransactionBlocksDocument = new TypedDocumentString(`
    query queryTransactionBlocks($first: Int, $last: Int, $before: String, $after: String, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false, $filter: TransactionBlockFilter) {
  transactionBlocks(
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const GetTransactionBlockDocument = new TypedDocumentString(`
    query getTransactionBlock($digest: String!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  transactionBlock(digest: $digest) {
    ...RPC_TRANSACTION_FIELDS
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const MultiGetTransactionBlocksDocument = new TypedDocumentString(`
    query multiGetTransactionBlocks($digests: [String!]!, $limit: Int, $cursor: String, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  transactionBlocks(
    first: $limit
    after: $cursor
    filter: {transactionIds: $digests}
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const PaginateTransactionBlockListsDocument = new TypedDocumentString(`
    query paginateTransactionBlockLists($digest: String!, $hasMoreEvents: Boolean!, $hasMoreBalanceChanges: Boolean!, $hasMoreObjectChanges: Boolean!, $afterEvents: String, $afterBalanceChanges: String, $afterObjectChanges: String) {
  transactionBlock(digest: $digest) {
    ...PAGINATE_TRANSACTION_LISTS
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment PAGINATE_TRANSACTION_LISTS on TransactionBlock {
  effects {
    events(after: $afterEvents) @include(if: $hasMoreEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    balanceChanges(after: $afterBalanceChanges) @include(if: $hasMoreBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges(after: $afterObjectChanges) @include(if: $hasMoreObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
const ViewDocument = new TypedDocumentString(`
    query View($functionName: String!, $typeArgs: [String!], $arguments: [JSON!]) {
  moveViewCall(
    functionName: $functionName
    typeArgs: $typeArgs
    arguments: $arguments
  ) {
    error
    results
  }
}
    `);
function toShortTypeString(type) {
  return type == null ? void 0 : type.replace(/0x0{31,}(\d)/g, "0x$1").replace(/,\b/g, ", ");
}
function isNumericString(value) {
  return /^-?\d+$/.test(value);
}
function layoutToBcs(layout) {
  switch (layout) {
    case "address":
      return iotaBcs.Address;
    case "bool":
      return iotaBcs.Bool;
    case "u8":
      return iotaBcs.U8;
    case "u16":
      return iotaBcs.U16;
    case "u32":
      return iotaBcs.U32;
    case "u64":
      return iotaBcs.U64;
    case "u128":
      return iotaBcs.U128;
    case "u256":
      return iotaBcs.U256;
  }
  if ("vector" in layout) {
    return iotaBcs.vector(layoutToBcs(layout.vector));
  }
  if ("struct" in layout) {
    const fields = {};
    for (const { name, layout: field } of layout.struct.fields) {
      fields[name] = layoutToBcs(field);
    }
    let struct = iotaBcs.struct(layout.struct.type, fields);
    const structName = toShortTypeString(layout.struct.type);
    if (structName === "0x2::object::ID") {
      struct = struct.transform({
        input: (id) => typeof id === "string" ? { bytes: id } : id,
        output: (id) => id.id
      });
      return struct;
    }
  }
  throw new Error(`Unknown layout: ${layout}`);
}
function mapJsonToBcs(json, layout) {
  const schema = layoutToBcs(layout);
  return toBase64(schema.serialize(json).toBytes());
}
function mapGraphQLCheckpointToRpcCheckpoint(checkpoint) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const endOfEpochTx = checkpoint.endOfEpoch.nodes[0];
  let endOfEpochData;
  if (((_a2 = endOfEpochTx == null ? void 0 : endOfEpochTx.kind) == null ? void 0 : _a2.__typename) === "EndOfEpochTransaction" && ((_b = endOfEpochTx.kind) == null ? void 0 : _b.transactions.nodes[0].__typename) === "ChangeEpochTransactionV2") {
    endOfEpochData = {
      epochCommitments: [],
      // TODO
      nextEpochCommittee: ((_e = (_d = (_c = endOfEpochTx.kind.transactions.nodes[0].epoch) == null ? void 0 : _c.validatorSet) == null ? void 0 : _d.committeeMembers) == null ? void 0 : _e.nodes.map(
        (val) => {
          var _a3, _b2;
          return [(_a3 = val.credentials) == null ? void 0 : _a3.authorityPubKey, (_b2 = val.votingPower) == null ? void 0 : _b2.toString()];
        }
      )) ?? [],
      nextEpochProtocolVersion: String(
        (_f = endOfEpochTx.kind.transactions.nodes[0].epoch) == null ? void 0 : _f.protocolConfigs.protocolVersion
      ),
      epochSupplyChange: 0
      // TODO: https://github.com/iotaledger/iota/issues/1738
    };
  }
  return {
    checkpointCommitments: [],
    // TODO
    digest: checkpoint.digest,
    endOfEpochData,
    epoch: String((_g = checkpoint.epoch) == null ? void 0 : _g.epochId),
    epochRollingGasCostSummary: {
      computationCost: (_h = checkpoint.rollingGasSummary) == null ? void 0 : _h.computationCost,
      computationCostBurned: (_i = checkpoint.rollingGasSummary) == null ? void 0 : _i.computationCostBurned,
      nonRefundableStorageFee: (_j = checkpoint.rollingGasSummary) == null ? void 0 : _j.nonRefundableStorageFee,
      storageCost: (_k = checkpoint.rollingGasSummary) == null ? void 0 : _k.storageCost,
      storageRebate: (_l = checkpoint.rollingGasSummary) == null ? void 0 : _l.storageRebate
    },
    networkTotalTransactions: String(checkpoint.networkTotalTransactions),
    ...checkpoint.previousCheckpointDigest ? { previousDigest: checkpoint.previousCheckpointDigest } : {},
    sequenceNumber: String(checkpoint.sequenceNumber),
    timestampMs: new Date(checkpoint.timestamp).getTime().toString(),
    transactions: ((_m = checkpoint.transactionBlocks) == null ? void 0 : _m.nodes.map(
      (transactionBlock) => transactionBlock.digest
    )) ?? [],
    validatorSignature: checkpoint.validatorSignatures
  };
}
function mapOpenMoveType(type) {
  const body = mapNormalizedType(type.body);
  if (type.ref === "&") {
    return {
      Reference: body
    };
  }
  if (type.ref === "&mut") {
    return {
      MutableReference: body
    };
  }
  return body;
}
function mapNormalizedType(type) {
  var _a2;
  switch (type) {
    case "address":
      return "Address";
    case "bool":
      return "Bool";
    case "u8":
      return "U8";
    case "u16":
      return "U16";
    case "u32":
      return "U32";
    case "u64":
      return "U64";
    case "u128":
      return "U128";
    case "u256":
      return "U256";
  }
  if ("vector" in type) {
    return {
      Vector: mapNormalizedType(type.vector)
    };
  }
  if ("typeParameter" in type) {
    return {
      TypeParameter: type.typeParameter
    };
  }
  if ("datatype" in type) {
    return {
      Struct: {
        address: toShortTypeString(type.datatype.package),
        module: type.datatype.module,
        name: type.datatype.type,
        typeArguments: ((_a2 = type.datatype.typeParameters) == null ? void 0 : _a2.map(mapNormalizedType)) ?? []
      }
    };
  }
  throw new Error("Invalid type");
}
function mapNormalizedMoveFunction(fn) {
  var _a2, _b, _c, _d, _e;
  return {
    visibility: `${(_a2 = fn.visibility) == null ? void 0 : _a2[0]}${(_b = fn.visibility) == null ? void 0 : _b.slice(1).toLowerCase()}`,
    isEntry: fn.isEntry,
    typeParameters: ((_c = fn.typeParameters) == null ? void 0 : _c.map((param) => {
      var _a3;
      return {
        abilities: ((_a3 = param.constraints) == null ? void 0 : _a3.map(
          (constraint) => `${constraint[0]}${constraint.slice(1).toLowerCase()}`
        )) ?? []
      };
    })) ?? [],
    return: ((_d = fn.return) == null ? void 0 : _d.map((param) => mapOpenMoveType(param.signature))) ?? [],
    parameters: ((_e = fn.parameters) == null ? void 0 : _e.map((param) => mapOpenMoveType(param.signature))) ?? []
  };
}
function mapNormalizedMoveStruct(struct) {
  var _a2, _b, _c;
  return {
    abilities: {
      abilities: ((_a2 = struct.abilities) == null ? void 0 : _a2.map(
        (ability) => `${ability[0]}${ability.slice(1).toLowerCase()}`
      )) ?? []
    },
    fields: ((_b = struct.fields) == null ? void 0 : _b.map((field) => {
      var _a3;
      return {
        name: field.name,
        type: mapOpenMoveType((_a3 = field.type) == null ? void 0 : _a3.signature)
      };
    })) ?? [],
    typeParameters: ((_c = struct.typeParameters) == null ? void 0 : _c.map((param) => {
      var _a3;
      return {
        isPhantom: param.isPhantom,
        constraints: {
          abilities: (_a3 = param.constraints) == null ? void 0 : _a3.map(
            (constraint) => `${constraint[0]}${constraint.slice(1).toLowerCase()}`
          )
        }
      };
    })) ?? []
  };
}
function mapNormalizedMoveModule(module, address) {
  var _a2, _b, _c;
  const exposedFunctions = {};
  const structs = {};
  (_a2 = module.functions) == null ? void 0 : _a2.nodes.filter(
    (func) => func.visibility === "PUBLIC" || func.isEntry || func.visibility === "FRIEND"
  ).forEach((func) => {
    exposedFunctions[func.name] = mapNormalizedMoveFunction(func);
  });
  (_b = module.structs) == null ? void 0 : _b.nodes.forEach((struct) => {
    structs[struct.name] = mapNormalizedMoveStruct(struct);
  });
  return {
    address: toShortTypeString(address),
    name: module.name,
    fileFormatVersion: module.fileFormatVersion,
    friends: ((_c = module.friends.nodes) == null ? void 0 : _c.map((friend) => ({
      address: toShortTypeString(friend.package.address),
      name: friend.name
    }))) ?? [],
    structs,
    exposedFunctions
  };
}
function moveDataToRpcContent(data, layout) {
  if ("Address" in data) {
    return normalizeIotaAddress(
      data.Address.map((byte) => byte.toString(16).padStart(2, "0")).join("")
    );
  }
  if ("UID" in data) {
    return {
      id: normalizeIotaAddress(
        data.UID.map((byte) => byte.toString(16).padStart(2, "0")).join("")
      )
    };
  }
  if ("ID" in data) {
    return normalizeIotaAddress(
      data.ID.map((byte) => byte.toString(16).padStart(2, "0")).join("")
    );
  }
  if ("Bool" in data) {
    return data.Bool;
  }
  if ("Number" in data) {
    return layout === "u64" || layout === "u128" || layout === "u256" ? String(data.Number) : Number.parseInt(data.Number, 10);
  }
  if ("String" in data) {
    return data.String;
  }
  if ("Vector" in data) {
    if (typeof layout !== "object" || !("vector" in layout)) {
      throw new Error(`Invalid layout for data: ${JSON.stringify(data)}`);
    }
    const itemLayout = layout.vector;
    return data.Vector.map((item) => moveDataToRpcContent(item, itemLayout));
  }
  if ("Option" in data) {
    if (data.Option === null) {
      return null;
    }
    if (typeof layout !== "object" || !("struct" in layout)) {
      throw new Error(`Invalid layout for Option data: ${JSON.stringify(layout)}`);
    }
    const vecField = layout.struct.fields.find((field) => field.name === "vec");
    if (!vecField) {
      throw new Error(`Could not find the expected 'vec' field in the Option layout.`);
    }
    const innerLayout = vecField.layout;
    const innerData = data.Option;
    if (typeof innerLayout === "object" && "vector" in innerLayout && innerData && !("Vector" in innerData)) {
      const itemLayout = innerLayout.vector;
      return moveDataToRpcContent(innerData, itemLayout);
    }
    return moveDataToRpcContent(innerData, innerLayout);
  }
  if ("Struct" in data) {
    const result = {};
    if (typeof layout !== "object" || !("struct" in layout)) {
      throw new Error(`Invalid layout for data: ${JSON.stringify(data)}}`);
    }
    data.Struct.forEach((item, index2) => {
      const { name, layout: itemLayout } = layout.struct.fields[index2];
      result[name] = moveDataToRpcContent(item.value, itemLayout);
    });
    const tag = parseStructTag(layout.struct.type);
    const structName = `${toShortTypeString(tag.address)}::${tag.module}::${tag.name}`;
    switch (structName) {
      case "0x1::string::String":
      case "0x1::ascii::String":
        return result["bytes"];
      case "0x2::url::Url":
        return result["url"];
      case "0x2::object::ID":
        return result["bytes"];
      case "0x2::object::UID":
        return {
          id: result["id"]
        };
      case "0x2::balance::Balance":
        return result["value"];
      case "0x1::option::Option":
        return result["vec"][0] ?? null;
    }
    return {
      type: toShortTypeString(layout.struct.type),
      fields: result
    };
  }
  throw new Error("Invalid move data: " + JSON.stringify(data));
}
function formatDisplay(object2) {
  const display = {
    data: null,
    error: null
  };
  if (object2.display) {
    object2.display.forEach((displayItem) => {
      if (displayItem.error) {
        display.error = displayItem.error;
      } else if (displayItem.value != null) {
        if (!display.data) {
          display.data = {};
        }
        display.data[displayItem.key] = displayItem.value;
      }
    });
  }
  return display;
}
function mapGraphQLOwnerToRpcOwner(owner) {
  var _a2, _b, _c, _d, _e;
  switch (owner == null ? void 0 : owner.__typename) {
    case "AddressOwner":
      return ((_a2 = owner.owner) == null ? void 0 : _a2.asObject) ? {
        ObjectOwner: (_b = owner.owner) == null ? void 0 : _b.asObject.address
      } : {
        AddressOwner: (_d = (_c = owner.owner) == null ? void 0 : _c.asAddress) == null ? void 0 : _d.address
      };
    case "Parent":
      return {
        ObjectOwner: (_e = owner.parent) == null ? void 0 : _e.address
      };
    case "Shared": {
      return {
        Shared: {
          initial_shared_version: String(owner.initialSharedVersion)
        }
      };
    }
    case "Immutable":
      return "Immutable";
  }
  return null;
}
function mapGraphQLObjectToRpcObject(object2, options = {}) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return {
    bcs: (options == null ? void 0 : options.showBcs) ? {
      dataType: "moveObject",
      bcsBytes: (_b = (_a2 = object2.asMoveObject) == null ? void 0 : _a2.contents) == null ? void 0 : _b.bcs,
      version: object2.version,
      type: toShortTypeString((_d = (_c = object2.asMoveObject) == null ? void 0 : _c.contents) == null ? void 0 : _d.type.repr)
    } : void 0,
    content: options.showContent ? {
      dataType: "moveObject",
      ...moveDataToRpcContent(
        (_f = (_e = object2.asMoveObject) == null ? void 0 : _e.contents) == null ? void 0 : _f.data,
        (_h = (_g = object2.asMoveObject) == null ? void 0 : _g.contents) == null ? void 0 : _h.type.layout
      )
    } : void 0,
    digest: object2.digest,
    display: formatDisplay(object2),
    objectId: object2.objectId,
    owner: mapGraphQLOwnerToRpcOwner(object2.owner),
    previousTransaction: (_i = object2.previousTransactionBlock) == null ? void 0 : _i.digest,
    storageRebate: object2.storageRebate,
    type: toShortTypeString((_k = (_j = object2.asMoveObject) == null ? void 0 : _j.contents) == null ? void 0 : _k.type.repr),
    version: String(object2.version)
  };
}
function mapGraphQLMoveObjectToRpcObject(object2, options = {}) {
  var _a2, _b, _c, _d, _e, _f;
  return {
    bcs: (options == null ? void 0 : options.showBcs) ? {
      dataType: "moveObject",
      bcsBytes: (_a2 = object2 == null ? void 0 : object2.contents) == null ? void 0 : _a2.bcs,
      version: object2.version,
      type: toShortTypeString((_b = object2 == null ? void 0 : object2.contents) == null ? void 0 : _b.type.repr)
    } : void 0,
    content: options.showContent ? {
      dataType: "moveObject",
      ...moveDataToRpcContent(
        (_c = object2 == null ? void 0 : object2.contents) == null ? void 0 : _c.data,
        (_d = object2 == null ? void 0 : object2.contents) == null ? void 0 : _d.type.layout
      )
    } : void 0,
    digest: object2.digest,
    display: formatDisplay(object2),
    objectId: object2.objectId,
    owner: mapGraphQLOwnerToRpcOwner(object2.owner),
    previousTransaction: (_e = object2.previousTransactionBlock) == null ? void 0 : _e.digest,
    storageRebate: object2.storageRebate,
    type: toShortTypeString((_f = object2 == null ? void 0 : object2.contents) == null ? void 0 : _f.type.repr),
    version: String(object2.version)
  };
}
function mapGraphQLStakeToRpcStake(stakes) {
  var _a2, _b, _c, _d, _e;
  const delegatedStakes = /* @__PURE__ */ new Map();
  for (const stake of stakes) {
    const pool = (_a2 = stake.contents) == null ? void 0 : _a2.json.pool_id;
    if (!delegatedStakes.has(pool)) {
      delegatedStakes.set(pool, {
        validatorAddress: "",
        // TODO
        stakingPool: pool,
        stakes: []
      });
    }
    const delegatedStake = delegatedStakes.get(pool);
    delegatedStake.stakes.push({
      stakedIotaId: stake.address,
      stakeRequestEpoch: (_b = stake.requestedEpoch) == null ? void 0 : _b.epochId.toString(),
      stakeActiveEpoch: (_c = stake.activatedEpoch) == null ? void 0 : _c.epochId.toString(),
      principal: (_d = stake.principal) == null ? void 0 : _d.value,
      status: stake.stakeStatus.slice(0, 1).toUpperCase() + stake.stakeStatus.slice(1).toLowerCase(),
      estimatedReward: (_e = stake.estimatedReward) == null ? void 0 : _e.value
    });
  }
  return [...delegatedStakes.values()];
}
function mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options, errors) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const effects = ((_a2 = transactionBlock.effects) == null ? void 0 : _a2.bcs) ? mapEffects(transactionBlock.effects.bcs) : null;
  return {
    balanceChanges: (_c = (_b = transactionBlock.effects) == null ? void 0 : _b.balanceChanges) == null ? void 0 : _c.nodes.map((balanceChange) => {
      var _a3, _b2, _c2, _d2, _e2, _f2, _g2;
      return {
        amount: balanceChange == null ? void 0 : balanceChange.amount,
        coinType: toShortTypeString((_a3 = balanceChange == null ? void 0 : balanceChange.coinType) == null ? void 0 : _a3.repr),
        owner: ((_c2 = (_b2 = balanceChange.owner) == null ? void 0 : _b2.asObject) == null ? void 0 : _c2.address) ? {
          ObjectOwner: (_e2 = (_d2 = balanceChange.owner) == null ? void 0 : _d2.asObject) == null ? void 0 : _e2.address
        } : {
          AddressOwner: (_g2 = (_f2 = balanceChange.owner) == null ? void 0 : _f2.asAddress) == null ? void 0 : _g2.address
        }
      };
    }),
    ...typeof ((_e = (_d = transactionBlock.effects) == null ? void 0 : _d.checkpoint) == null ? void 0 : _e.sequenceNumber) === "number" ? { checkpoint: transactionBlock.effects.checkpoint.sequenceNumber.toString() } : {},
    ...((_f = transactionBlock.effects) == null ? void 0 : _f.timestamp) ? { timestampMs: new Date((_g = transactionBlock.effects) == null ? void 0 : _g.timestamp).getTime().toString() } : {},
    digest: transactionBlock.digest,
    ...(options == null ? void 0 : options.showRawEffects) ? {
      rawEffects: ((_h = transactionBlock.effects) == null ? void 0 : _h.bcs) ? Array.from(fromBase64((_i = transactionBlock.effects) == null ? void 0 : _i.bcs)) : void 0
    } : {},
    effects: (options == null ? void 0 : options.showEffects) ? effects : void 0,
    ...errors ? { errors } : {},
    events: ((_k = (_j = transactionBlock.effects) == null ? void 0 : _j.events) == null ? void 0 : _k.nodes.map((event2) => {
      var _a3, _b2, _c2, _d2, _e2;
      return {
        bcs: event2.bcs,
        bcsEncoding: "base64",
        id: {
          eventSeq: "",
          // TODO
          txDigest: ""
          // TODO
        },
        packageId: (_a3 = event2.sendingModule) == null ? void 0 : _a3.package.address,
        parsedJson: event2.json,
        sender: (_b2 = event2.sender) == null ? void 0 : _b2.address,
        timestampMs: new Date(event2.timestamp).getTime().toString(),
        transactionModule: `${(_c2 = event2.sendingModule) == null ? void 0 : _c2.package.address}::${(_d2 = event2.sendingModule) == null ? void 0 : _d2.name}`,
        type: toShortTypeString((_e2 = event2.type) == null ? void 0 : _e2.repr)
      };
    })) ?? [],
    rawTransaction: (options == null ? void 0 : options.showRawInput) ? transactionBlock.rawTransaction : void 0,
    ...(options == null ? void 0 : options.showInput) ? {
      transaction: transactionBlock.rawTransaction && mapTransactionBlockToInput(
        iotaBcs.SenderSignedData.parse(
          fromBase64(transactionBlock.rawTransaction)
        )[0]
      )
    } : {},
    objectChanges: (options == null ? void 0 : options.showObjectChanges) ? mapObjectChanges(transactionBlock, effects) : void 0
  };
}
function mapObjectChanges(transactionBlock, effects) {
  var _a2, _b, _c, _d;
  const changes = [];
  (_a2 = effects == null ? void 0 : effects.mutated) == null ? void 0 : _a2.forEach((mutated) => {
    var _a3, _b2, _c2, _d2, _e, _f, _g, _h;
    const objectChange = (_b2 = (_a3 = transactionBlock.effects) == null ? void 0 : _a3.objectChanges) == null ? void 0 : _b2.nodes.find(
      (change) => change.address === mutated.reference.objectId
    );
    changes.push({
      type: "mutated",
      digest: mutated.reference.digest,
      previousVersion: String((_c2 = objectChange == null ? void 0 : objectChange.inputState) == null ? void 0 : _c2.version),
      objectId: mutated.reference.objectId,
      owner: mutated.owner,
      objectType: toShortTypeString(
        (_f = (_e = (_d2 = objectChange == null ? void 0 : objectChange.outputState) == null ? void 0 : _d2.asMoveObject) == null ? void 0 : _e.contents) == null ? void 0 : _f.type.repr
      ),
      sender: (_g = transactionBlock.sender) == null ? void 0 : _g.address,
      version: (_h = mutated.reference.version) == null ? void 0 : _h.toString()
    });
  });
  (_b = effects == null ? void 0 : effects.created) == null ? void 0 : _b.forEach((created) => {
    var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const objectChange = (_b2 = (_a3 = transactionBlock.effects) == null ? void 0 : _a3.objectChanges) == null ? void 0 : _b2.nodes.find(
      (change) => change.address === created.reference.objectId
    );
    if ((_c2 = objectChange == null ? void 0 : objectChange.outputState) == null ? void 0 : _c2.asMovePackage) {
      changes.push({
        type: "published",
        digest: created.reference.digest,
        version: (_d2 = created.reference.version) == null ? void 0 : _d2.toString(),
        packageId: objectChange.address,
        modules: (_e = objectChange.outputState.asMovePackage.modules) == null ? void 0 : _e.nodes.map(
          (module) => module.name
        )
      });
    } else {
      changes.push({
        type: "created",
        digest: created.reference.digest,
        objectId: created.reference.objectId,
        owner: created.owner,
        objectType: toShortTypeString(
          (_k = (_j = (_i = (_h = (_g = (_f = transactionBlock.effects) == null ? void 0 : _f.objectChanges) == null ? void 0 : _g.nodes.find(
            (change) => change.address === created.reference.objectId
          )) == null ? void 0 : _h.outputState) == null ? void 0 : _i.asMoveObject) == null ? void 0 : _j.contents) == null ? void 0 : _k.type.repr
        ),
        sender: (_l = transactionBlock.sender) == null ? void 0 : _l.address,
        version: (_m = created.reference.version) == null ? void 0 : _m.toString()
      });
    }
  });
  (_c = effects == null ? void 0 : effects.deleted) == null ? void 0 : _c.forEach((deleted) => {
    var _a3, _b2, _c2, _d2, _e, _f, _g, _h;
    changes.push({
      type: "deleted",
      objectId: deleted.objectId,
      objectType: toShortTypeString(
        (_f = (_e = (_d2 = (_c2 = (_b2 = (_a3 = transactionBlock.effects) == null ? void 0 : _a3.objectChanges) == null ? void 0 : _b2.nodes.find(
          (change) => change.address === deleted.objectId
        )) == null ? void 0 : _c2.inputState) == null ? void 0 : _d2.asMoveObject) == null ? void 0 : _e.contents) == null ? void 0 : _f.type.repr
      ),
      sender: (_g = transactionBlock.sender) == null ? void 0 : _g.address,
      version: (_h = deleted.version) == null ? void 0 : _h.toString()
    });
  });
  (_d = effects == null ? void 0 : effects.unwrapped) == null ? void 0 : _d.forEach((unwrapped) => {
    var _a3, _b2, _c2, _d2, _e, _f, _g, _h;
    changes.push({
      type: "wrapped",
      objectId: unwrapped.reference.objectId,
      objectType: toShortTypeString(
        (_f = (_e = (_d2 = (_c2 = (_b2 = (_a3 = transactionBlock.effects) == null ? void 0 : _a3.objectChanges) == null ? void 0 : _b2.nodes.find(
          (change) => change.address === unwrapped.reference.objectId
        )) == null ? void 0 : _c2.outputState) == null ? void 0 : _d2.asMoveObject) == null ? void 0 : _e.contents) == null ? void 0 : _f.type.repr
      ),
      sender: (_g = transactionBlock.sender) == null ? void 0 : _g.address,
      version: (_h = unwrapped.reference.version) == null ? void 0 : _h.toString()
    });
  });
  return changes;
}
function mapTransactionBlockToInput(data) {
  const txData = data.intentMessage.value.V1;
  const programmableTransaction = "ProgrammableTransaction" in txData.kind ? txData.kind.ProgrammableTransaction : null;
  if (!programmableTransaction) {
    return null;
  }
  return {
    txSignatures: data.txSignatures,
    data: {
      gasData: {
        budget: txData.gasData.budget,
        owner: txData.gasData.owner,
        payment: txData.gasData.payment.map((payment) => ({
          digest: payment.digest,
          objectId: payment.objectId,
          version: Number(payment.version)
        })),
        price: txData.gasData.price
      },
      messageVersion: "v1",
      sender: txData.sender,
      transaction: mapProgrammableTransaction(programmableTransaction)
    }
  };
}
function mapProgrammableTransaction(programmableTransaction) {
  return {
    inputs: programmableTransaction.inputs.map(mapTransactionInput),
    kind: "ProgrammableTransaction",
    transactions: programmableTransaction.commands.map(mapTransaction)
  };
}
function mapTransactionInput(input) {
  if (input.Pure) {
    return {
      type: "pure",
      value: iotaBcs.string().parse(fromBase64(input.Pure.bytes))
    };
  }
  if (input.Object.ImmOrOwnedObject) {
    return {
      type: "object",
      digest: input.Object.ImmOrOwnedObject.digest,
      version: input.Object.ImmOrOwnedObject.version,
      objectId: input.Object.ImmOrOwnedObject.objectId,
      objectType: "immOrOwnedObject"
    };
  }
  if (input.Object.SharedObject) {
    return {
      type: "object",
      initialSharedVersion: input.Object.SharedObject.initialSharedVersion,
      objectId: input.Object.SharedObject.objectId,
      mutable: input.Object.SharedObject.mutable,
      objectType: "sharedObject"
    };
  }
  if (input.Object.Receiving) {
    return {
      type: "object",
      digest: input.Object.Receiving.digest,
      version: input.Object.Receiving.version,
      objectId: input.Object.Receiving.objectId,
      objectType: "receiving"
    };
  }
  throw new Error(`Unknown object type: ${input.Object}`);
}
function mapTransaction(transaction) {
  switch (transaction.$kind) {
    case "MoveCall": {
      return {
        MoveCall: {
          arguments: transaction.MoveCall.arguments.map(mapTransactionArgument),
          function: transaction.MoveCall.function,
          module: transaction.MoveCall.module,
          package: transaction.MoveCall.package,
          type_arguments: transaction.MoveCall.typeArguments
        }
      };
    }
    case "MakeMoveVec": {
      return {
        MakeMoveVec: [
          transaction.MakeMoveVec.type,
          transaction.MakeMoveVec.elements.map(mapTransactionArgument)
        ]
      };
    }
    case "MergeCoins": {
      return {
        MergeCoins: [
          mapTransactionArgument(transaction.MergeCoins.destination),
          transaction.MergeCoins.sources.map(mapTransactionArgument)
        ]
      };
    }
    case "Publish": {
      return {
        Publish: transaction.Publish.modules.map((module) => module)
      };
    }
    case "SplitCoins": {
      return {
        SplitCoins: [
          mapTransactionArgument(transaction.SplitCoins.coin),
          transaction.SplitCoins.amounts.map(mapTransactionArgument)
        ]
      };
    }
    case "TransferObjects": {
      return {
        TransferObjects: [
          transaction.TransferObjects.objects.map(mapTransactionArgument),
          mapTransactionArgument(transaction.TransferObjects.address)
        ]
      };
    }
    case "Upgrade": {
      return {
        Upgrade: [
          transaction.Upgrade.modules.map((module) => module),
          transaction.Upgrade.package,
          mapTransactionArgument(transaction.Upgrade.ticket)
        ]
      };
    }
  }
  throw new Error(`Unknown transaction type ${transaction}`);
}
function mapTransactionArgument(arg) {
  switch (arg.$kind) {
    case "GasCoin": {
      return "GasCoin";
    }
    case "Input": {
      return {
        Input: arg.Input
      };
    }
    case "Result": {
      return {
        Result: arg.Result
      };
    }
    case "NestedResult": {
      return {
        NestedResult: arg.NestedResult
      };
    }
  }
  throw new Error(`Unknown argument type ${arg}`);
}
const OBJECT_DIGEST_DELETED = toBase58(Uint8Array.from({ length: 32 }, () => 99));
const OBJECT_DIGEST_WRAPPED = toBase58(Uint8Array.from({ length: 32 }, () => 88));
const OBJECT_DIGEST_ZERO = toBase58(Uint8Array.from({ length: 32 }, () => 0));
const ADDRESS_ZERO = normalizeIotaAddress("0x0");
function mapEffects(data) {
  const effects = iotaBcs.TransactionEffects.parse(fromBase64(data));
  const sharedObjects = effects.V1.unchangedSharedObjects.map(([id, sharedObject]) => {
    switch (sharedObject.$kind) {
      case "ReadOnlyRoot":
        return {
          objectId: id,
          version: Number(sharedObject.ReadOnlyRoot[0]),
          digest: sharedObject.ReadOnlyRoot[1]
        };
      case "MutateDeleted":
        return {
          objectId: id,
          version: Number(sharedObject.MutateDeleted),
          digest: OBJECT_DIGEST_DELETED
        };
      case "ReadDeleted":
        return {
          objectId: id,
          version: Number(sharedObject.ReadDeleted),
          digest: OBJECT_DIGEST_DELETED
        };
      default:
        throw new Error(`Unknown shared object type: ${sharedObject}`);
    }
  });
  effects.V1.changedObjects.filter(([_id, change]) => {
    var _a2;
    return (_a2 = change.inputState.Exist) == null ? void 0 : _a2[1].Shared;
  }).forEach(([id, change]) => {
    sharedObjects.push({
      objectId: id,
      version: Number(change.inputState.Exist[0][0]),
      digest: change.inputState.Exist[0][1]
    });
  });
  const modifiedAtVersions = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist).map(([id, change]) => [id, change.inputState.Exist[0][0]]);
  const created = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.NotExist && (change.outputState.ObjectWrite || change.outputState.PackageWrite) && change.idOperation.Created
  ).map(
    ([objectId, change]) => change.outputState.PackageWrite ? [
      {
        objectId,
        version: Number(change.outputState.PackageWrite[0]),
        digest: change.outputState.PackageWrite[1]
      },
      { $kind: "Immutable", Immutable: true }
    ] : [
      {
        objectId,
        version: Number(effects.V1.lamportVersion),
        digest: change.outputState.ObjectWrite[0]
      },
      change.outputState.ObjectWrite[1]
    ]
  );
  const mutated = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.Exist && (change.outputState.ObjectWrite || change.outputState.PackageWrite)
  ).map(([objectId, change]) => [
    change.outputState.PackageWrite ? {
      objectId,
      version: Number(change.outputState.PackageWrite[0]),
      digest: change.outputState.PackageWrite[1]
    } : {
      objectId,
      version: Number(effects.V1.lamportVersion),
      digest: change.outputState.ObjectWrite[0]
    },
    change.outputState.ObjectWrite ? change.outputState.ObjectWrite[1] : { $kind: "Immutable", Immutable: true }
  ]);
  const unwrapped = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.NotExist && change.outputState.ObjectWrite && change.idOperation.None
  ).map(([objectId, change]) => [
    {
      objectId,
      version: Number(effects.V1.lamportVersion),
      digest: change.outputState.ObjectWrite[0]
    },
    change.outputState.ObjectWrite[1]
  ]);
  const deleted = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.Exist && change.outputState.NotExist && change.idOperation.Deleted
  ).map(([objectId, _change]) => ({
    objectId,
    version: Number(effects.V1.lamportVersion),
    digest: OBJECT_DIGEST_DELETED
  }));
  const unwrappedThenDeleted = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.NotExist && change.outputState.NotExist && change.idOperation.Deleted
  ).map(([objectId, _change]) => ({
    objectId,
    version: Number(effects.V1.lamportVersion),
    digest: OBJECT_DIGEST_DELETED
  }));
  const wrapped = effects.V1.changedObjects.filter(
    ([_id, change]) => change.inputState.Exist && change.outputState.NotExist && change.idOperation.None
  ).map(([objectId, _change]) => ({
    objectId,
    version: Number(effects.V1.lamportVersion),
    digest: OBJECT_DIGEST_WRAPPED
  }));
  const gasObjectFromV1 = effects.V1.gasObjectIndex != null ? effects.V1.changedObjects[effects.V1.gasObjectIndex] : null;
  const gasObject = gasObjectFromV1 ? [
    {
      objectId: gasObjectFromV1[0],
      digest: gasObjectFromV1[1].outputState.ObjectWrite[0],
      version: Number(effects.V1.lamportVersion)
    },
    gasObjectFromV1[1].outputState.ObjectWrite[1]
  ] : [
    {
      objectId: ADDRESS_ZERO,
      version: "0",
      digest: OBJECT_DIGEST_ZERO
    },
    {
      $kind: "AddressOwner",
      AddressOwner: ADDRESS_ZERO
    }
  ];
  return {
    messageVersion: "v1",
    status: effects.V1.status.Success ? {
      status: "success"
    } : {
      status: "failure",
      // TODO: we don't have the error message from bcs effects
      error: effects.V1.status.$kind
    },
    executedEpoch: effects.V1.executedEpoch,
    gasUsed: effects.V1.gasUsed,
    modifiedAtVersions: modifiedAtVersions.map(([objectId, sequenceNumber]) => ({
      objectId,
      sequenceNumber
    })),
    ...sharedObjects.length === 0 ? {} : { sharedObjects },
    transactionDigest: effects.V1.transactionDigest,
    ...created.length === 0 ? {} : {
      created: created.map(([reference, owner]) => ({
        reference,
        owner: mapEffectsOwner(owner)
      }))
    },
    ...mutated.length === 0 ? {} : {
      mutated: mutated.map(([reference, owner]) => ({
        reference,
        owner: mapEffectsOwner(owner)
      }))
    },
    ...unwrapped.length === 0 ? {} : {
      unwrapped: unwrapped.length === 0 ? void 0 : unwrapped.map(([reference, owner]) => ({
        reference,
        owner: mapEffectsOwner(owner)
      }))
    },
    ...deleted.length === 0 ? {} : { deleted },
    ...unwrappedThenDeleted.length === 0 ? {} : { unwrappedThenDeleted },
    ...wrapped.length === 0 ? {} : { wrapped },
    gasObject: {
      reference: gasObject[0],
      owner: mapEffectsOwner(gasObject[1])
    },
    ...effects.V1.eventsDigest ? { eventsDigest: effects.V1.eventsDigest } : {},
    dependencies: effects.V1.dependencies
  };
  function mapEffectsOwner(owner) {
    if (owner.Immutable) {
      return "Immutable";
    } else if (owner.Shared) {
      return { Shared: { initial_shared_version: owner.Shared.initialSharedVersion } };
    } else if (owner.AddressOwner) {
      return { AddressOwner: owner.AddressOwner };
    } else if (owner.ObjectOwner) {
      return { ObjectOwner: owner.ObjectOwner };
    }
    throw new Error(`Unknown owner type: ${owner}`);
  }
}
function mapGraphQlValidatorToRpcValidator(validator) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  return {
    commissionRate: (_a2 = validator.commissionRate) == null ? void 0 : _a2.toString(),
    description: validator.description,
    exchangeRatesId: (_b = validator.exchangeRates) == null ? void 0 : _b.address,
    exchangeRatesSize: (_c = validator.exchangeRatesSize) == null ? void 0 : _c.toString(),
    gasPrice: validator.gasPrice,
    imageUrl: validator.imageUrl,
    name: validator.name,
    netAddress: (_d = validator.credentials) == null ? void 0 : _d.netAddress,
    networkPubkeyBytes: (_e = validator.credentials) == null ? void 0 : _e.networkPubKey,
    nextEpochCommissionRate: (_f = validator.nextEpochCommissionRate) == null ? void 0 : _f.toString(),
    nextEpochGasPrice: validator.nextEpochGasPrice,
    nextEpochNetAddress: (_g = validator.nextEpochCredentials) == null ? void 0 : _g.netAddress,
    nextEpochNetworkPubkeyBytes: (_h = validator.nextEpochCredentials) == null ? void 0 : _h.networkPubKey,
    nextEpochP2pAddress: (_i = validator.nextEpochCredentials) == null ? void 0 : _i.p2PAddress,
    nextEpochPrimaryAddress: (_j = validator.nextEpochCredentials) == null ? void 0 : _j.primaryAddress,
    nextEpochProofOfPossession: (_k = validator.nextEpochCredentials) == null ? void 0 : _k.proofOfPossession,
    nextEpochAuthorityPubkeyBytes: (_l = validator.nextEpochCredentials) == null ? void 0 : _l.authorityPubKey,
    nextEpochStake: validator.nextEpochStake,
    nextEpochProtocolPubkeyBytes: (_m = validator.nextEpochCredentials) == null ? void 0 : _m.protocolPubKey,
    operationCapId: (_n = validator.operationCap) == null ? void 0 : _n.address,
    p2pAddress: (_o = validator.credentials) == null ? void 0 : _o.p2PAddress,
    pendingTotalIotaWithdraw: validator.pendingTotalIotaWithdraw,
    pendingPoolTokenWithdraw: validator.pendingPoolTokenWithdraw,
    poolTokenBalance: validator.poolTokenBalance,
    pendingStake: validator.pendingStake,
    primaryAddress: (_p = validator.credentials) == null ? void 0 : _p.primaryAddress,
    projectUrl: validator.projectUrl,
    proofOfPossessionBytes: (_q = validator.credentials) == null ? void 0 : _q.proofOfPossession,
    authorityPubkeyBytes: (_r = validator.credentials) == null ? void 0 : _r.authorityPubKey,
    protocolPubkeyBytes: (_s = validator.credentials) == null ? void 0 : _s.protocolPubKey,
    rewardsPool: validator.rewardsPool,
    stakingPoolId: (_t = validator.stakingPool) == null ? void 0 : _t.address,
    stakingPoolActivationEpoch: (_u = validator.stakingPoolActivationEpoch) == null ? void 0 : _u.toString(),
    stakingPoolIotaBalance: validator.stakingPoolIotaBalance,
    iotaAddress: validator.address.address,
    votingPower: (_v = validator.votingPower) == null ? void 0 : _v.toString()
  };
}
const RPC_METHODS = {
  async getRpcApiVersion(transport) {
    const res = await transport.graphqlRequest({
      query: "query { __typename }",
      variables: {}
    });
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return {
      info: {
        version: res.headers.get("x-iota-rpc-version") ?? void 0
      }
    };
  },
  async getCoins(transport, [owner, coinType, cursor, limit]) {
    const { nodes: coins, pageInfo } = await transport.graphqlQuery(
      {
        query: GetCoinsDocument,
        variables: {
          owner,
          type: coinType,
          cursor,
          first: limit
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.address) == null ? void 0 : _a2.coins;
      }
    );
    return {
      data: coins.map((coin) => {
        var _a2, _b;
        return {
          balance: coin.coinBalance,
          coinObjectId: coin.address,
          coinType: toShortTypeString(
            normalizeStructTag(parseStructTag((_a2 = coin.contents) == null ? void 0 : _a2.type.repr).typeParams[0])
          ),
          digest: coin.digest,
          previousTransaction: (_b = coin.previousTransactionBlock) == null ? void 0 : _b.digest,
          version: String(coin.version)
        };
      }),
      nextCursor: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage
    };
  },
  async getAllCoins(transport, inputs) {
    const { nodes: coins, pageInfo } = await transport.graphqlQuery(
      {
        query: GetCoinsDocument,
        variables: {
          owner: inputs[0],
          cursor: inputs[1],
          first: inputs[2]
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.address) == null ? void 0 : _a2.coins;
      }
    );
    return {
      data: coins.map((coin) => {
        var _a2, _b;
        return {
          balance: coin.coinBalance,
          coinObjectId: coin.address,
          coinType: toShortTypeString(
            normalizeStructTag(parseStructTag((_a2 = coin.contents) == null ? void 0 : _a2.type.repr).typeParams[0])
          ),
          digest: coin.digest,
          previousTransaction: (_b = coin.previousTransactionBlock) == null ? void 0 : _b.digest,
          version: String(coin.version)
        };
      }),
      nextCursor: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage
    };
  },
  async getBalance(transport, inputs) {
    var _a2;
    const balance = await transport.graphqlQuery(
      {
        query: GetBalanceDocument,
        variables: {
          owner: inputs[0],
          type: inputs[1]
        }
      },
      (data) => {
        var _a3;
        return (_a3 = data.address) == null ? void 0 : _a3.balance;
      }
    );
    return {
      coinType: toShortTypeString((_a2 = balance.coinType) == null ? void 0 : _a2.repr),
      coinObjectCount: balance.coinObjectCount,
      totalBalance: balance.totalBalance
    };
  },
  async getAllBalances(transport, inputs) {
    const balances = await transport.graphqlQuery(
      {
        query: GetAllBalancesDocument,
        variables: {
          owner: inputs[0]
        }
      },
      (data) => {
        var _a2, _b;
        return (_b = (_a2 = data.address) == null ? void 0 : _a2.balances) == null ? void 0 : _b.nodes;
      }
    );
    return balances.map((balance) => {
      var _a2;
      return {
        coinType: toShortTypeString((_a2 = balance.coinType) == null ? void 0 : _a2.repr),
        coinObjectCount: balance.coinObjectCount,
        totalBalance: balance.totalBalance
      };
    });
  },
  async getCoinMetadata(transport, inputs) {
    const metadata = await transport.graphqlQuery(
      {
        query: GetCoinMetadataDocument,
        variables: {
          coinType: inputs[0]
        }
      },
      (data) => data.coinMetadata
    );
    return {
      decimals: metadata.decimals,
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      iconUrl: metadata.iconUrl,
      id: metadata.address
    };
  },
  async getTotalSupply(transport, inputs) {
    const metadata = await transport.graphqlQuery(
      {
        query: GetTotalSupplyDocument,
        variables: {
          coinType: inputs[0]
        }
      },
      (data) => data.coinMetadata
    );
    return {
      value: BigInt(metadata.supply).toString()
    };
  },
  async getMoveFunctionArgTypes(transport, [pkg, module, fn]) {
    const moveModule = await transport.graphqlQuery(
      {
        query: GetMoveFunctionArgTypesDocument,
        variables: {
          module,
          packageId: pkg,
          function: fn
        }
      },
      (data) => {
        var _a2, _b, _c, _d;
        return (_d = (_c = (_b = (_a2 = data.object) == null ? void 0 : _a2.asMovePackage) == null ? void 0 : _b.module) == null ? void 0 : _c.function) == null ? void 0 : _d.parameters;
      }
    );
    return moveModule.map((parameter) => {
      if (!parameter.signature.body.datatype) {
        return "Pure";
      }
      return {
        Object: parameter.signature.ref === "&" ? "ByImmutableReference" : parameter.signature.ref === "&mut" ? "ByMutableReference" : "ByValue"
      };
    });
  },
  async getNormalizedMoveFunction(transport, [pkg, module, fn]) {
    const moveFunction = await transport.graphqlQuery(
      {
        query: GetNormalizedMoveFunctionDocument,
        variables: {
          module,
          packageId: pkg,
          function: fn
        }
      },
      (data) => {
        var _a2, _b, _c;
        return (_c = (_b = (_a2 = data.object) == null ? void 0 : _a2.asMovePackage) == null ? void 0 : _b.module) == null ? void 0 : _c.function;
      }
    );
    return mapNormalizedMoveFunction(moveFunction);
  },
  async getNormalizedMoveModulesByPackage(transport, [pkg]) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const movePackage = await transport.graphqlQuery(
      {
        query: GetNormalizedMoveModulesByPackageDocument,
        variables: {
          packageId: pkg
        }
      },
      (data) => {
        var _a3;
        return (_a3 = data.object) == null ? void 0 : _a3.asMovePackage;
      }
    );
    let hasNextPage = ((_a2 = movePackage.modules) == null ? void 0 : _a2.pageInfo.hasNextPage) ?? false;
    let cursor = (_b = movePackage.modules) == null ? void 0 : _b.pageInfo.endCursor;
    while (hasNextPage) {
      const page = await transport.graphqlQuery(
        {
          query: GetNormalizedMoveModulesByPackageDocument,
          variables: {
            packageId: pkg,
            cursor
          }
        },
        (data) => {
          var _a3;
          return (_a3 = data.object) == null ? void 0 : _a3.asMovePackage;
        }
      );
      (_d = movePackage.modules) == null ? void 0 : _d.nodes.push(...((_c = page.modules) == null ? void 0 : _c.nodes) ?? []);
      hasNextPage = ((_e = page.modules) == null ? void 0 : _e.pageInfo.hasNextPage) ?? false;
      cursor = (_f = page.modules) == null ? void 0 : _f.pageInfo.endCursor;
    }
    const address = toShortTypeString(movePackage.address);
    const modules = {};
    for (const moveModule of ((_g = movePackage.modules) == null ? void 0 : _g.nodes) ?? []) {
      let hasMoreFriends = ((_h = moveModule.friends) == null ? void 0 : _h.pageInfo.hasNextPage) ?? false;
      let hasMoreFunctions = ((_i = moveModule.functions) == null ? void 0 : _i.pageInfo.hasNextPage) ?? false;
      let hasMoreStructs = ((_j = moveModule.structs) == null ? void 0 : _j.pageInfo.hasNextPage) ?? false;
      let afterFriends = (_k = moveModule.friends) == null ? void 0 : _k.pageInfo.endCursor;
      let afterFunctions = (_l = moveModule.functions) == null ? void 0 : _l.pageInfo.endCursor;
      let afterStructs = (_m = moveModule.structs) == null ? void 0 : _m.pageInfo.endCursor;
      while (hasMoreFriends || hasMoreStructs || hasMoreFunctions) {
        const page = await transport.graphqlQuery(
          {
            query: PaginateMoveModuleListsDocument,
            variables: {
              module: moveModule.name,
              packageId: pkg,
              hasMoreFriends,
              hasMoreFunctions,
              hasMoreStructs,
              afterFriends,
              afterFunctions,
              afterStructs
            }
          },
          (data) => {
            var _a3, _b2;
            return (_b2 = (_a3 = data.object) == null ? void 0 : _a3.asMovePackage) == null ? void 0 : _b2.module;
          }
        );
        moveModule.friends.nodes.push(...((_n = page.friends) == null ? void 0 : _n.nodes) ?? []);
        (_p = moveModule.functions) == null ? void 0 : _p.nodes.push(...((_o = page.functions) == null ? void 0 : _o.nodes) ?? []);
        (_r = moveModule.structs) == null ? void 0 : _r.nodes.push(...((_q = page.structs) == null ? void 0 : _q.nodes) ?? []);
        hasMoreFriends = ((_s = page.friends) == null ? void 0 : _s.pageInfo.hasNextPage) ?? false;
        hasMoreFunctions = ((_t = page.functions) == null ? void 0 : _t.pageInfo.hasNextPage) ?? false;
        hasMoreStructs = ((_u = page.structs) == null ? void 0 : _u.pageInfo.hasNextPage) ?? false;
        afterFriends = (_v = page.friends) == null ? void 0 : _v.pageInfo.endCursor;
        afterFunctions = (_w = page.functions) == null ? void 0 : _w.pageInfo.endCursor;
        afterStructs = (_x = page.structs) == null ? void 0 : _x.pageInfo.endCursor;
      }
    }
    (_y = movePackage.modules) == null ? void 0 : _y.nodes.forEach((module) => {
      modules[module.name] = mapNormalizedMoveModule(module, address);
    });
    return modules;
  },
  async getNormalizedMoveModule(transport, [pkg, module]) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const moveModule = await transport.graphqlQuery(
      {
        query: GetNormalizedMoveModuleDocument,
        variables: {
          module,
          packageId: pkg
        }
      },
      (data) => {
        var _a3, _b2;
        return (_b2 = (_a3 = data.object) == null ? void 0 : _a3.asMovePackage) == null ? void 0 : _b2.module;
      }
    );
    let hasMoreFriends = ((_a2 = moveModule.friends) == null ? void 0 : _a2.pageInfo.hasNextPage) ?? false;
    let hasMoreFunctions = ((_b = moveModule.functions) == null ? void 0 : _b.pageInfo.hasNextPage) ?? false;
    let hasMoreStructs = ((_c = moveModule.structs) == null ? void 0 : _c.pageInfo.hasNextPage) ?? false;
    let afterFriends = (_d = moveModule.friends) == null ? void 0 : _d.pageInfo.endCursor;
    let afterFunctions = (_e = moveModule.functions) == null ? void 0 : _e.pageInfo.endCursor;
    let afterStructs = (_f = moveModule.structs) == null ? void 0 : _f.pageInfo.endCursor;
    while (hasMoreFriends || hasMoreStructs || hasMoreFunctions) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateMoveModuleListsDocument,
          variables: {
            module,
            packageId: pkg,
            hasMoreFriends,
            hasMoreFunctions,
            hasMoreStructs,
            afterFriends,
            afterFunctions,
            afterStructs
          }
        },
        (data) => {
          var _a3, _b2;
          return (_b2 = (_a3 = data.object) == null ? void 0 : _a3.asMovePackage) == null ? void 0 : _b2.module;
        }
      );
      moveModule.friends.nodes.push(...((_g = page.friends) == null ? void 0 : _g.nodes) ?? []);
      (_i = moveModule.functions) == null ? void 0 : _i.nodes.push(...((_h = page.functions) == null ? void 0 : _h.nodes) ?? []);
      (_k = moveModule.structs) == null ? void 0 : _k.nodes.push(...((_j = page.structs) == null ? void 0 : _j.nodes) ?? []);
      hasMoreFriends = ((_l = page.friends) == null ? void 0 : _l.pageInfo.hasNextPage) ?? false;
      hasMoreFunctions = ((_m = page.functions) == null ? void 0 : _m.pageInfo.hasNextPage) ?? false;
      hasMoreStructs = ((_n = page.structs) == null ? void 0 : _n.pageInfo.hasNextPage) ?? false;
      afterFriends = (_o = page.friends) == null ? void 0 : _o.pageInfo.endCursor;
      afterFunctions = (_p = page.functions) == null ? void 0 : _p.pageInfo.endCursor;
      afterStructs = (_q = page.structs) == null ? void 0 : _q.pageInfo.endCursor;
    }
    return mapNormalizedMoveModule(moveModule, normalizeIotaAddress(pkg));
  },
  async getNormalizedMoveStruct(transport, [pkg, module, struct]) {
    const moveStruct = await transport.graphqlQuery(
      {
        query: GetNormalizedMoveStructDocument,
        variables: {
          packageId: pkg,
          module,
          struct
        }
      },
      (data) => {
        var _a2, _b, _c;
        return (_c = (_b = (_a2 = data.object) == null ? void 0 : _a2.asMovePackage) == null ? void 0 : _b.module) == null ? void 0 : _c.struct;
      }
    );
    return mapNormalizedMoveStruct(moveStruct);
  },
  async getOwnedObjects(transport, [owner, { filter: inputFilter, options }, cursor, limit]) {
    let filter;
    let typeFilter;
    if (inputFilter) {
      if ("Package" in inputFilter) {
        typeFilter = inputFilter.Package;
      } else if ("MoveModule" in inputFilter) {
        typeFilter = `${inputFilter.MoveModule.package}::${inputFilter.MoveModule.module}`;
      } else if ("StructType" in inputFilter) {
        typeFilter = inputFilter.StructType;
      }
      filter = {
        objectIds: "ObjectIds" in inputFilter ? inputFilter.ObjectIds : "ObjectId" in inputFilter ? [inputFilter.ObjectId] : void 0,
        type: typeFilter,
        owner: "ObjectOwner" in inputFilter ? inputFilter.ObjectOwner : "AddressOwner" in inputFilter ? inputFilter.AddressOwner : void 0
      };
      const unsupportedFilters = [];
      for (const unsupportedFilter of unsupportedFilters) {
        if (unsupportedFilter in inputFilter) {
          throw new UnsupportedParamError("getOwnedObjects", unsupportedFilter);
        }
      }
    }
    const { nodes: objects, pageInfo } = await transport.graphqlQuery(
      {
        query: GetOwnedObjectsDocument,
        variables: {
          owner,
          limit,
          cursor,
          showBcs: options == null ? void 0 : options.showBcs,
          showContent: options == null ? void 0 : options.showContent,
          showDisplay: options == null ? void 0 : options.showDisplay,
          showOwner: options == null ? void 0 : options.showOwner,
          showPreviousTransaction: options == null ? void 0 : options.showPreviousTransaction,
          showStorageRebate: options == null ? void 0 : options.showStorageRebate,
          showType: options == null ? void 0 : options.showType,
          filter
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.address) == null ? void 0 : _a2.objects;
      }
    );
    return {
      hasNextPage: pageInfo.hasNextPage,
      nextCursor: pageInfo.endCursor,
      data: objects.map((object2) => ({
        data: mapGraphQLMoveObjectToRpcObject(object2, options ?? {})
      }))
    };
  },
  async getObject(transport, [id, options]) {
    const object2 = await transport.graphqlQuery(
      {
        query: GetObjectDocument,
        variables: {
          id,
          showBcs: options == null ? void 0 : options.showBcs,
          showContent: options == null ? void 0 : options.showContent,
          showDisplay: options == null ? void 0 : options.showDisplay,
          showOwner: options == null ? void 0 : options.showOwner,
          showPreviousTransaction: options == null ? void 0 : options.showPreviousTransaction,
          showStorageRebate: options == null ? void 0 : options.showStorageRebate,
          showType: options == null ? void 0 : options.showType
        }
      },
      (data) => data.object
    );
    return {
      data: mapGraphQLObjectToRpcObject(object2, options ?? {})
    };
  },
  async tryGetPastObject(transport, [id, version, options]) {
    const data = await transport.graphqlQuery({
      query: TryGetPastObjectDocument,
      variables: {
        id,
        version,
        showBcs: options == null ? void 0 : options.showBcs,
        showContent: options == null ? void 0 : options.showContent,
        showDisplay: options == null ? void 0 : options.showDisplay,
        showOwner: options == null ? void 0 : options.showOwner,
        showPreviousTransaction: options == null ? void 0 : options.showPreviousTransaction,
        showStorageRebate: options == null ? void 0 : options.showStorageRebate,
        showType: options == null ? void 0 : options.showType
      }
    });
    if (!data.current) {
      return {
        details: "Could not find the referenced object",
        status: "ObjectNotExists"
      };
    }
    if (!data.object) {
      return data.current.version < Number(version) ? {
        status: "VersionTooHigh",
        details: {
          asked_version: String(version),
          latest_version: String(data.current.version),
          object_id: data.current.address
        }
      } : {
        status: "VersionNotFound",
        details: [data.current.address, String(version)]
      };
    }
    return {
      status: "VersionFound",
      details: mapGraphQLObjectToRpcObject(data.object, options ?? {})
    };
  },
  async multiGetObjects(transport, [ids, options]) {
    const objects = await transport.graphqlQuery(
      {
        query: MultiGetObjectsDocument,
        variables: {
          ids,
          showBcs: options == null ? void 0 : options.showBcs,
          showContent: options == null ? void 0 : options.showContent,
          showDisplay: options == null ? void 0 : options.showDisplay,
          showOwner: options == null ? void 0 : options.showOwner,
          showPreviousTransaction: options == null ? void 0 : options.showPreviousTransaction,
          showStorageRebate: options == null ? void 0 : options.showStorageRebate,
          showType: options == null ? void 0 : options.showType,
          limit: ids.length
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.objects) == null ? void 0 : _a2.nodes;
      }
    );
    return objects.map((object2) => ({
      data: mapGraphQLObjectToRpcObject(object2, options ?? {})
    }));
  },
  async queryTransactionBlocks(transport, [{ filter, options }, cursor, limit = 20, descending]) {
    const pagination = descending ? {
      last: limit,
      before: cursor
    } : {
      first: limit,
      after: cursor
    };
    const unsupportedFilters = ["FromOrToAddress", "FromAndToAddress", "TransactionKindIn"];
    if (filter) {
      for (const unsupportedFilter of unsupportedFilters) {
        if (unsupportedFilter in filter) {
          throw new UnsupportedParamError("queryTransactionBlocks", unsupportedFilter);
        }
      }
    }
    let graphqlTransactionKindFilter;
    if ("TransactionKind" in filter) {
      switch (filter.TransactionKind) {
        case "ProgrammableTransaction":
          graphqlTransactionKindFilter = TransactionBlockKindInput.ProgrammableTx;
          break;
        case "Genesis":
          graphqlTransactionKindFilter = TransactionBlockKindInput.Genesis;
          break;
        case "ConsensusCommitPrologueV1":
          graphqlTransactionKindFilter = TransactionBlockKindInput.ConsensusCommitPrologueV1;
          break;
        case "AuthenticatorStateUpdateV1":
          graphqlTransactionKindFilter = TransactionBlockKindInput.AuthenticatorStateUpdateV1;
          break;
        case "RandomnessStateUpdate":
          graphqlTransactionKindFilter = TransactionBlockKindInput.RandomnessStateUpdate;
          break;
        case "EndOfEpochTransaction":
          graphqlTransactionKindFilter = TransactionBlockKindInput.EndOfEpochTx;
          break;
        case "SystemTransaction":
          graphqlTransactionKindFilter = TransactionBlockKindInput.SystemTx;
          break;
      }
    }
    const { nodes: transactionBlocks, pageInfo } = await transport.graphqlQuery(
      {
        query: QueryTransactionBlocksDocument,
        variables: {
          ...pagination,
          showBalanceChanges: options == null ? void 0 : options.showBalanceChanges,
          showEffects: options == null ? void 0 : options.showEffects,
          showEvents: options == null ? void 0 : options.showEvents,
          showInput: options == null ? void 0 : options.showInput,
          showObjectChanges: options == null ? void 0 : options.showObjectChanges,
          showRawEffects: options == null ? void 0 : options.showRawEffects,
          showRawInput: options == null ? void 0 : options.showRawInput,
          filter: filter ? {
            atCheckpoint: "Checkpoint" in filter ? Number.parseInt(filter.Checkpoint) : void 0,
            function: "MoveFunction" in filter ? `${filter.MoveFunction.package}::${filter.MoveFunction.module}::${filter.MoveFunction.function}` : void 0,
            inputObject: "InputObject" in filter ? filter.InputObject : void 0,
            changedObject: "ChangedObject" in filter ? filter.ChangedObject : void 0,
            signAddress: "FromAddress" in filter ? filter.FromAddress : void 0,
            recvAddress: "ToAddress" in filter ? filter.ToAddress : void 0,
            kind: graphqlTransactionKindFilter
          } : {}
        }
      },
      (data) => data.transactionBlocks
    );
    for (const transactionBlock of transactionBlocks) {
      await paginateTransactionBlockLists(transport, transactionBlock);
    }
    if (pagination.last) {
      transactionBlocks.reverse();
    }
    return {
      hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
      nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
      data: transactionBlocks.map(
        (transactionBlock) => mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options ?? {})
      )
    };
  },
  async getTransactionBlock(transport, [digest, options]) {
    const transactionBlock = await transport.graphqlQuery(
      {
        query: GetTransactionBlockDocument,
        variables: {
          digest,
          showBalanceChanges: options == null ? void 0 : options.showBalanceChanges,
          showEffects: options == null ? void 0 : options.showEffects,
          showEvents: options == null ? void 0 : options.showEvents,
          showInput: options == null ? void 0 : options.showInput,
          showObjectChanges: options == null ? void 0 : options.showObjectChanges,
          showRawEffects: options == null ? void 0 : options.showRawEffects,
          showRawInput: options == null ? void 0 : options.showRawInput
        }
      },
      (data) => data.transactionBlock
    );
    await paginateTransactionBlockLists(transport, transactionBlock);
    return mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options);
  },
  async multiGetTransactionBlocks(transport, [digests, options]) {
    const transactionBlocks = await transport.graphqlQuery(
      {
        query: MultiGetTransactionBlocksDocument,
        variables: {
          digests,
          showBalanceChanges: options == null ? void 0 : options.showBalanceChanges,
          showEffects: options == null ? void 0 : options.showEffects,
          showEvents: options == null ? void 0 : options.showEvents,
          showInput: options == null ? void 0 : options.showInput,
          showObjectChanges: options == null ? void 0 : options.showObjectChanges,
          showRawEffects: options == null ? void 0 : options.showEffects,
          showRawInput: options == null ? void 0 : options.showRawInput,
          limit: digests.length
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.transactionBlocks) == null ? void 0 : _a2.nodes;
      }
    );
    for (const transactionBlock of transactionBlocks) {
      await paginateTransactionBlockLists(transport, transactionBlock);
    }
    return transactionBlocks.map(
      (transactionBlock) => mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options)
    );
  },
  async getTotalTransactionBlocks(transport) {
    return transport.graphqlQuery(
      {
        query: GetTotalTransactionBlocksDocument
      },
      (data) => {
        var _a2;
        return BigInt((_a2 = data.checkpoint) == null ? void 0 : _a2.networkTotalTransactions);
      }
    );
  },
  async getReferenceGasPrice(transport) {
    const epoch = await transport.graphqlQuery(
      {
        query: GetReferenceGasPriceDocument,
        variables: {}
      },
      (data) => data.epoch
    );
    return BigInt(epoch.referenceGasPrice);
  },
  async getStakes(transport, [owner]) {
    const stakes = await transport.graphqlQuery(
      {
        query: GetStakesDocument,
        variables: {
          owner
        }
      },
      (data) => {
        var _a2, _b;
        return (_b = (_a2 = data.address) == null ? void 0 : _a2.stakedIotas) == null ? void 0 : _b.nodes;
      }
    );
    return mapGraphQLStakeToRpcStake(stakes);
  },
  async getStakesByIds(transport, [stakedIotaIds]) {
    const stakes = await transport.graphqlQuery(
      {
        query: GetStakesByIdsDocument,
        variables: {
          ids: stakedIotaIds
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.objects) == null ? void 0 : _a2.nodes.map((node) => {
          var _a3;
          return (_a3 = node == null ? void 0 : node.asMoveObject) == null ? void 0 : _a3.asStakedIota;
        }).filter(Boolean);
      }
    );
    return mapGraphQLStakeToRpcStake(stakes);
  },
  async getLatestIotaSystemStateV2(transport) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia;
    const systemState = await transport.graphqlQuery(
      {
        query: GetLatestIotaSystemStateDocument
      },
      (data) => data.epoch
    );
    let hasMoreActiveValidators = ((_b = (_a2 = systemState.validatorSet) == null ? void 0 : _a2.activeValidators) == null ? void 0 : _b.pageInfo.hasNextPage) ?? false;
    let afterActiveValidators = (_d = (_c = systemState.validatorSet) == null ? void 0 : _c.activeValidators) == null ? void 0 : _d.pageInfo.endCursor;
    while (hasMoreActiveValidators) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateEpochValidatorsDocument,
          variables: {
            id: systemState.epochId,
            after: afterActiveValidators
          }
        },
        (data) => data.epoch
      );
      (_h = (_e = systemState.validatorSet) == null ? void 0 : _e.activeValidators) == null ? void 0 : _h.nodes.push(
        ...((_g = (_f = page.validatorSet) == null ? void 0 : _f.activeValidators) == null ? void 0 : _g.nodes) ?? []
      );
      hasMoreActiveValidators = ((_j = (_i = page.validatorSet) == null ? void 0 : _i.activeValidators) == null ? void 0 : _j.pageInfo.hasNextPage) ?? false;
      afterActiveValidators = (_l = (_k = page.validatorSet) == null ? void 0 : _k.activeValidators) == null ? void 0 : _l.pageInfo.endCursor;
    }
    let hasMoreCommitteeMembers = ((_n = (_m = systemState.validatorSet) == null ? void 0 : _m.committeeMembers) == null ? void 0 : _n.pageInfo.hasNextPage) ?? false;
    let afterCommitteeMembers = (_p = (_o = systemState.validatorSet) == null ? void 0 : _o.committeeMembers) == null ? void 0 : _p.pageInfo.endCursor;
    while (hasMoreCommitteeMembers) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateEpochValidatorsDocument,
          variables: {
            id: systemState.epochId,
            after: afterCommitteeMembers
          }
        },
        (data) => data.epoch
      );
      (_t = (_q = systemState.validatorSet) == null ? void 0 : _q.committeeMembers) == null ? void 0 : _t.nodes.push(
        ...((_s = (_r = page.validatorSet) == null ? void 0 : _r.committeeMembers) == null ? void 0 : _s.nodes) ?? []
      );
      hasMoreCommitteeMembers = ((_v = (_u = page.validatorSet) == null ? void 0 : _u.committeeMembers) == null ? void 0 : _v.pageInfo.hasNextPage) ?? false;
      afterCommitteeMembers = (_x = (_w = page.validatorSet) == null ? void 0 : _w.committeeMembers) == null ? void 0 : _x.pageInfo.endCursor;
    }
    return {
      V2: {
        activeValidators: (_z = (_y = systemState.validatorSet) == null ? void 0 : _y.activeValidators) == null ? void 0 : _z.nodes.map(
          mapGraphQlValidatorToRpcValidator
        ),
        committeeMembers: (_C = (_B = (_A = systemState.validatorSet) == null ? void 0 : _A.committeeMembers) == null ? void 0 : _B.nodes) == null ? void 0 : _C.map(
          (_, index2) => index2.toString()
        ),
        atRiskValidators: (_E = (_D = systemState.validatorSet) == null ? void 0 : _D.activeValidators.nodes) == null ? void 0 : _E.filter((validator) => validator.atRisk).map((validator) => [
          validator.address.address,
          validator.atRisk.toString()
        ]),
        epoch: String(systemState.epochId),
        epochDurationMs: String(
          new Date(systemState.endTimestamp).getTime() - new Date(systemState.startTimestamp).getTime()
        ),
        epochStartTimestampMs: String(new Date(systemState.startTimestamp).getTime()),
        inactivePoolsSize: String((_F = systemState.validatorSet) == null ? void 0 : _F.inactivePoolsSize),
        iotaTotalSupply: String(systemState.iotaTotalSupply),
        iotaTreasuryCapId: String(systemState.iotaTreasuryCapId),
        maxValidatorCount: String((_G = systemState.systemParameters) == null ? void 0 : _G.maxValidatorCount),
        minValidatorCount: String((_H = systemState.systemParameters) == null ? void 0 : _H.minValidatorCount),
        minValidatorJoiningStake: String(
          (_I = systemState.systemParameters) == null ? void 0 : _I.minValidatorJoiningStake
        ),
        pendingActiveValidatorsSize: String(
          (_J = systemState.validatorSet) == null ? void 0 : _J.pendingActiveValidatorsSize
        ),
        pendingRemovals: ((_L = (_K = systemState.validatorSet) == null ? void 0 : _K.pendingRemovals) == null ? void 0 : _L.map((idx) => String(idx))) ?? [],
        protocolVersion: String((_M = systemState.protocolConfigs) == null ? void 0 : _M.protocolVersion),
        referenceGasPrice: String(systemState.referenceGasPrice),
        safeMode: (_N = systemState.safeMode) == null ? void 0 : _N.enabled,
        safeModeComputationCharges: String(
          (_P = (_O = systemState.safeMode) == null ? void 0 : _O.gasSummary) == null ? void 0 : _P.computationCost
        ),
        safeModeComputationChargesBurned: String(
          (_R = (_Q = systemState.safeMode) == null ? void 0 : _Q.gasSummary) == null ? void 0 : _R.computationCostBurned
        ),
        safeModeNonRefundableStorageFee: String(
          (_T = (_S = systemState.safeMode) == null ? void 0 : _S.gasSummary) == null ? void 0 : _T.nonRefundableStorageFee
        ),
        safeModeStorageRebates: String((_V = (_U = systemState.safeMode) == null ? void 0 : _U.gasSummary) == null ? void 0 : _V.storageRebate),
        safeModeStorageCharges: String((_X = (_W = systemState.safeMode) == null ? void 0 : _W.gasSummary) == null ? void 0 : _X.storageCost),
        stakingPoolMappingsSize: String((_Y = systemState.validatorSet) == null ? void 0 : _Y.stakingPoolMappingsSize),
        storageFundNonRefundableBalance: String(
          (_Z = systemState.storageFund) == null ? void 0 : _Z.nonRefundableBalance
        ),
        storageFundTotalObjectStorageRebates: String(
          (__ = systemState.storageFund) == null ? void 0 : __.totalObjectStorageRebates
        ),
        systemStateVersion: String(systemState.systemStateVersion),
        totalStake: (_$ = systemState.validatorSet) == null ? void 0 : _$.totalStake,
        validatorCandidatesSize: (_ba = (_aa = systemState.validatorSet) == null ? void 0 : _aa.validatorCandidatesSize) == null ? void 0 : _ba.toString(),
        validatorLowStakeGracePeriod: (_ca = systemState.systemParameters) == null ? void 0 : _ca.validatorLowStakeGracePeriod,
        validatorLowStakeThreshold: (_da = systemState.systemParameters) == null ? void 0 : _da.validatorLowStakeThreshold,
        validatorReportRecords: [],
        // TODO
        validatorVeryLowStakeThreshold: (_ea = systemState.systemParameters) == null ? void 0 : _ea.validatorVeryLowStakeThreshold,
        validatorCandidatesId: (_fa = systemState.validatorSet) == null ? void 0 : _fa.validatorCandidatesId,
        inactivePoolsId: (_ga = systemState.validatorSet) == null ? void 0 : _ga.inactivePoolsId,
        pendingActiveValidatorsId: (_ha = systemState.validatorSet) == null ? void 0 : _ha.pendingActiveValidatorsId,
        stakingPoolMappingsId: (_ia = systemState.validatorSet) == null ? void 0 : _ia.stakingPoolMappingsId
      }
    };
  },
  async queryEvents(transport, [query, cursor, limit, descending]) {
    const pagination = descending ? { last: limit, before: cursor } : { first: limit, after: cursor };
    const filter = {
      sender: "Sender" in query ? query.Sender : void 0,
      transactionDigest: "Transaction" in query ? query.Transaction : void 0,
      eventType: "MoveEventType" in query ? query.MoveEventType : void 0,
      emittingModule: "MoveModule" in query ? `${query.MoveModule.package}::${query.MoveModule.module}` : void 0
    };
    if ("MoveEventType" in query) {
      filter.eventType = query.MoveEventType;
    } else if ("MoveEventModule" in query) {
      filter.eventType = `${query.MoveEventModule.package}::${query.MoveEventModule.module}`;
    }
    const unsupportedFilters = [
      "Package",
      "MoveEventField",
      "Any",
      "All",
      "And",
      "Or",
      "TimeRange"
    ];
    if (query) {
      for (const unsupportedFilter of unsupportedFilters) {
        if (unsupportedFilter in query) {
          throw new UnsupportedParamError("queryEvents", unsupportedFilter);
        }
      }
    }
    const { nodes: events, pageInfo } = await transport.graphqlQuery(
      {
        query: QueryEventsDocument,
        variables: {
          ...pagination,
          filter
        }
      },
      (data) => data.events
    );
    if (pagination.last) {
      events.reverse();
    }
    return {
      hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
      nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
      data: events.map((event2) => {
        var _a2, _b, _c, _d, _e;
        return {
          bcs: event2.bcs,
          bcsEncoding: "base64",
          id: {
            eventSeq: "",
            // TODO
            txDigest: ""
            // TODO
          },
          packageId: (_a2 = event2.sendingModule) == null ? void 0 : _a2.package.address,
          parsedJson: event2.json,
          sender: (_b = event2.sender) == null ? void 0 : _b.address,
          timestampMs: new Date(event2.timestamp).getTime().toString(),
          transactionModule: `${(_c = event2.sendingModule) == null ? void 0 : _c.package.address}::${(_d = event2.sendingModule) == null ? void 0 : _d.name}`,
          type: toShortTypeString((_e = event2.type) == null ? void 0 : _e.repr)
        };
      })
    };
  },
  async devInspectTransactionBlock(transport, [sender, devInspectTxBytes, gasPrice]) {
    const { transaction, error, results } = await transport.graphqlQuery(
      {
        query: DevInspectTransactionBlockDocument,
        variables: {
          txBytes: devInspectTxBytes,
          txMeta: {
            gasPrice: Number.parseInt(gasPrice),
            sender
          },
          showEffects: true,
          showEvents: true
        }
      },
      (data) => data.dryRunTransactionBlock
    );
    if (!transaction) {
      throw new Error("Unexpected error during dry run");
    }
    const result = mapGraphQLTransactionBlockToRpcTransactionBlock(transaction, {
      showEffects: true
    });
    return {
      error,
      effects: result.effects,
      events: result.events,
      results: results == null ? void 0 : results.map((result2) => {
        var _a2, _b;
        return {
          mutableReferenceOutputs: (_a2 = result2.mutatedReferences) == null ? void 0 : _a2.map(
            (ref) => [
              ref.input.__typename === "GasCoin" ? "GasCoin" : ref.input.__typename === "Input" ? {
                Input: ref.input.inputIndex
              } : typeof ref.input.resultIndex === "number" ? {
                NestedResult: [ref.input.cmd, ref.input.resultIndex]
              } : {
                Result: ref.input.cmd
              },
              Array.from(fromBase64(ref.bcs)),
              toShortTypeString(ref.type.repr)
            ]
          ),
          returnValues: (_b = result2.returnValues) == null ? void 0 : _b.map((value) => [
            Array.from(fromBase64(value.bcs)),
            toShortTypeString(value.type.repr)
          ])
        };
      })
    };
  },
  async getDynamicFields(transport, [parentId, cursor, limit]) {
    const { nodes: fields, pageInfo } = await transport.graphqlQuery(
      {
        query: GetDynamicFieldsDocument,
        variables: {
          parentId,
          first: limit,
          cursor
        }
      },
      (data) => {
        var _a2;
        return (_a2 = data.owner) == null ? void 0 : _a2.dynamicFields;
      }
    );
    return {
      data: fields.map((field) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        return {
          bcsName: (_a2 = field.name) == null ? void 0 : _a2.bcs,
          bcsEncoding: "base64",
          digest: ((_b = field.value) == null ? void 0 : _b.__typename) === "MoveObject" ? field.value.digest : void 0,
          name: {
            type: toShortTypeString((_c = field.name) == null ? void 0 : _c.type.repr),
            value: (_d = field.name) == null ? void 0 : _d.json
          },
          objectId: ((_e = field.value) == null ? void 0 : _e.__typename) === "MoveObject" ? field.value.address : void 0,
          objectType: ((_f = field.value) == null ? void 0 : _f.__typename) === "MoveObject" ? (_g = field.value.contents) == null ? void 0 : _g.type.repr : (_h = field.value) == null ? void 0 : _h.type.repr,
          type: ((_i = field.value) == null ? void 0 : _i.__typename) === "MoveObject" ? "DynamicObject" : "DynamicField",
          version: ((_j = field.value) == null ? void 0 : _j.__typename) === "MoveObject" ? field.value.version : void 0
        };
      }),
      nextCursor: pageInfo.endCursor ?? null,
      hasNextPage: pageInfo.hasNextPage
    };
  },
  async getDynamicFieldObjectV2(transport, inputs) {
    return await getDynamicFieldObject(transport, inputs);
  },
  /**
   * @deprecated The V1 of this method is deprecated, use `getDynamicFieldObjectV2` instead.
   */
  async getDynamicFieldObject(transport, [parentId, name]) {
    return await getDynamicFieldObject(transport, [
      parentId,
      name,
      {
        // These are the same defaults as in the JSON RPC.
        showBcs: true,
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true
      }
    ]);
  },
  async executeTransactionBlock(transport, [txBytes, signatures, options]) {
    const { effects, errors } = await transport.graphqlQuery(
      {
        query: ExecuteTransactionBlockDocument,
        variables: {
          txBytes,
          signatures,
          showBalanceChanges: options == null ? void 0 : options.showBalanceChanges,
          showEffects: options == null ? void 0 : options.showEffects,
          showEvents: options == null ? void 0 : options.showEvents,
          showInput: options == null ? void 0 : options.showInput,
          showObjectChanges: options == null ? void 0 : options.showObjectChanges,
          showRawEffects: options == null ? void 0 : options.showRawEffects,
          showRawInput: options == null ? void 0 : options.showRawInput
        }
      },
      (data) => data.executeTransactionBlock
    );
    if (!(effects == null ? void 0 : effects.transactionBlock)) {
      const tx = Transaction.from(fromBase64(txBytes));
      return { errors: errors ?? void 0, digest: await tx.getDigest() };
    }
    await paginateTransactionBlockLists(transport, effects.transactionBlock);
    return mapGraphQLTransactionBlockToRpcTransactionBlock(
      effects.transactionBlock,
      options,
      errors
    );
  },
  async dryRunTransactionBlock(transport, [txBytes]) {
    var _a2;
    const tx = Transaction.from(fromBase64(txBytes));
    const { transaction, error } = await transport.graphqlQuery(
      {
        query: DryRunTransactionBlockDocument,
        variables: {
          txBytes,
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true
        }
      },
      (data) => data.dryRunTransactionBlock
    );
    if (error || !transaction) {
      throw new Error(error ?? "Unexpected error during dry run");
    }
    const result = mapGraphQLTransactionBlockToRpcTransactionBlock(
      { ...transaction, digest: await tx.getDigest() },
      {
        showEffects: true,
        showInput: true,
        showObjectChanges: true
      }
    );
    return {
      input: (_a2 = result.transaction) == null ? void 0 : _a2.data,
      balanceChanges: result.balanceChanges,
      effects: result.effects,
      events: result.events,
      objectChanges: result.objectChanges
    };
  },
  async getLatestCheckpointSequenceNumber(transport) {
    const sequenceNumber = await transport.graphqlQuery(
      {
        query: GetLatestCheckpointSequenceNumberDocument
      },
      (data) => {
        var _a2;
        return (_a2 = data.checkpoint) == null ? void 0 : _a2.sequenceNumber;
      }
    );
    return sequenceNumber.toString();
  },
  async getCheckpoint(transport, [id]) {
    const checkpoint = await transport.graphqlQuery(
      {
        query: GetCheckpointDocument,
        variables: {
          id: typeof id === "number" || isNumericString(id) ? {
            sequenceNumber: Number.parseInt(id.toString(), 10)
          } : {
            digest: id
          }
        }
      },
      (data) => data.checkpoint
    );
    await paginateCheckpointLists(transport, checkpoint);
    return mapGraphQLCheckpointToRpcCheckpoint(checkpoint);
  },
  async getCheckpoints(transport, [cursor, limit, descendingOrder]) {
    const pagination = descendingOrder ? { last: limit, before: cursor } : { first: limit, after: cursor };
    const { nodes: checkpoints, pageInfo } = await transport.graphqlQuery(
      {
        query: GetCheckpointsDocument,
        variables: {
          ...pagination
        }
      },
      (data) => data.checkpoints
    );
    for (const checkpoint of checkpoints) {
      await paginateCheckpointLists(transport, checkpoint);
    }
    if (pagination.last) {
      checkpoints.reverse();
    }
    return {
      hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
      nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
      data: checkpoints.map((checkpoint) => mapGraphQLCheckpointToRpcCheckpoint(checkpoint))
    };
  },
  async getCommitteeInfo(transport, [epoch]) {
    var _a2, _b, _c;
    const { validatorSet, epochId } = await transport.graphqlQuery(
      {
        query: GetCommitteeInfoDocument,
        variables: {
          epochId: epoch ? Number.parseInt(epoch) : void 0
        }
      },
      (data) => data.epoch
    );
    let hasNextPage = (_a2 = validatorSet == null ? void 0 : validatorSet.committeeMembers) == null ? void 0 : _a2.pageInfo.hasNextPage;
    let after = (_b = validatorSet == null ? void 0 : validatorSet.committeeMembers) == null ? void 0 : _b.pageInfo.endCursor;
    while (hasNextPage) {
      const page = await transport.graphqlQuery(
        {
          query: GetCommitteeInfoDocument,
          variables: {
            epochId: epoch ? Number.parseInt(epoch) : void 0,
            after
          }
        },
        (data) => {
          var _a3, _b2;
          return (_b2 = (_a3 = data.epoch) == null ? void 0 : _a3.validatorSet) == null ? void 0 : _b2.committeeMembers;
        }
      );
      validatorSet == null ? void 0 : validatorSet.committeeMembers.nodes.push(...page.nodes);
      hasNextPage = page.pageInfo.hasNextPage;
      after = page.pageInfo.endCursor;
    }
    return {
      epoch: epochId.toString(),
      validators: (_c = validatorSet == null ? void 0 : validatorSet.committeeMembers) == null ? void 0 : _c.nodes.map((val) => {
        var _a3;
        return [
          (_a3 = val.credentials) == null ? void 0 : _a3.authorityPubKey,
          String(val.votingPower)
        ];
      })
    };
  },
  async getCurrentEpoch(transport) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const epoch = await transport.graphqlQuery(
      {
        query: GetCurrentEpochDocument
      },
      (data) => data.epoch
    );
    let hasNextPageActiveValidators = (_b = (_a2 = epoch.validatorSet) == null ? void 0 : _a2.activeValidators) == null ? void 0 : _b.pageInfo.hasNextPage;
    let afterActiveValidators = (_d = (_c = epoch.validatorSet) == null ? void 0 : _c.activeValidators) == null ? void 0 : _d.pageInfo.endCursor;
    while (hasNextPageActiveValidators) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateEpochValidatorsDocument,
          variables: {
            id: epoch.epochId,
            after: afterActiveValidators
          }
        },
        (data) => {
          var _a3, _b2;
          return (_b2 = (_a3 = data.epoch) == null ? void 0 : _a3.validatorSet) == null ? void 0 : _b2.activeValidators;
        }
      );
      (_f = (_e = epoch.validatorSet) == null ? void 0 : _e.activeValidators) == null ? void 0 : _f.nodes.push(...page.nodes);
      hasNextPageActiveValidators = page.pageInfo.hasNextPage;
      afterActiveValidators = page.pageInfo.endCursor;
    }
    let hasNextPageCommitteeMembers = (_h = (_g = epoch.validatorSet) == null ? void 0 : _g.committeeMembers) == null ? void 0 : _h.pageInfo.hasNextPage;
    let afterCommitteeMembers = (_j = (_i = epoch.validatorSet) == null ? void 0 : _i.committeeMembers) == null ? void 0 : _j.pageInfo.endCursor;
    while (hasNextPageCommitteeMembers) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateEpochValidatorsDocument,
          variables: {
            id: epoch.epochId,
            after: afterCommitteeMembers
          }
        },
        (data) => {
          var _a3, _b2;
          return (_b2 = (_a3 = data.epoch) == null ? void 0 : _a3.validatorSet) == null ? void 0 : _b2.committeeMembers;
        }
      );
      (_l = (_k = epoch.validatorSet) == null ? void 0 : _k.committeeMembers) == null ? void 0 : _l.nodes.push(...page.nodes);
      hasNextPageCommitteeMembers = page.pageInfo.hasNextPage;
      afterCommitteeMembers = page.pageInfo.endCursor;
    }
    const validatorsAddresses = ((_n = (_m = epoch.validatorSet) == null ? void 0 : _m.activeValidators) == null ? void 0 : _n.nodes.map((val) => val.address.address)) ?? [];
    const committeeMembersAddresses = ((_p = (_o = epoch.validatorSet) == null ? void 0 : _o.committeeMembers) == null ? void 0 : _p.nodes.map((val) => val.address.address)) ?? [];
    const committeeValidatorsIndexes = committeeMembersAddresses.map(
      (val) => {
        var _a3;
        return (_a3 = validatorsAddresses.indexOf(val)) == null ? void 0 : _a3.toString();
      }
    );
    return {
      epoch: String(epoch.epochId),
      validators: (_r = (_q = epoch.validatorSet) == null ? void 0 : _q.activeValidators) == null ? void 0 : _r.nodes.map(
        mapGraphQlValidatorToRpcValidator
      ),
      committeeMembers: committeeValidatorsIndexes,
      epochTotalTransactions: "0",
      // TODO
      firstCheckpointId: (_t = (_s = epoch.firstCheckpoint) == null ? void 0 : _s.nodes[0]) == null ? void 0 : _t.sequenceNumber.toString(),
      endOfEpochInfo: null,
      referenceGasPrice: epoch.referenceGasPrice,
      epochStartTimestamp: new Date(epoch.startTimestamp).getTime().toString()
    };
  },
  async getValidatorsApy(transport) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const epoch = await transport.graphqlQuery(
      {
        query: GetValidatorsApyDocument
      },
      (data) => data.epoch
    );
    let hasNextPage = (_b = (_a2 = epoch.validatorSet) == null ? void 0 : _a2.activeValidators) == null ? void 0 : _b.pageInfo.hasNextPage;
    let after = (_d = (_c = epoch.validatorSet) == null ? void 0 : _c.activeValidators) == null ? void 0 : _d.pageInfo.endCursor;
    while (hasNextPage) {
      const page = await transport.graphqlQuery(
        {
          query: PaginateEpochValidatorsDocument,
          variables: {
            id: epoch.epochId,
            after
          }
        },
        (data) => data.epoch
      );
      (_h = (_e = epoch.validatorSet) == null ? void 0 : _e.activeValidators) == null ? void 0 : _h.nodes.push(
        ...((_g = (_f = page.validatorSet) == null ? void 0 : _f.activeValidators) == null ? void 0 : _g.nodes) ?? []
      );
      hasNextPage = (_j = (_i = page.validatorSet) == null ? void 0 : _i.activeValidators) == null ? void 0 : _j.pageInfo.hasNextPage;
      after = (_l = (_k = page.validatorSet) == null ? void 0 : _k.activeValidators) == null ? void 0 : _l.pageInfo.endCursor;
    }
    return {
      epoch: String(epoch.epochId),
      apys: (_n = (_m = epoch.validatorSet) == null ? void 0 : _m.activeValidators) == null ? void 0 : _n.nodes.map((validator) => ({
        address: validator.address.address,
        apy: typeof validator.apy === "number" ? validator.apy / 100 : null
      }))
    };
  },
  async getChainIdentifier(transport) {
    const identifier = await transport.graphqlQuery(
      {
        query: GetChainIdentifierDocument
      },
      (data) => data.chainIdentifier
    );
    return identifier;
  },
  async getProtocolConfig(transport, [version]) {
    var _a2, _b;
    const protocolConfig = await transport.graphqlQuery(
      {
        query: GetProtocolConfigDocument,
        variables: {
          protocolVersion: version ? Number.parseInt(version) : void 0
        }
      },
      (data) => data.protocolConfig
    );
    const featureFlags = {};
    const attributes = {};
    const configTypeMap = {
      max_arguments: "u32",
      max_gas_payment_objects: "u32",
      max_modules_in_publish: "u32",
      max_programmable_tx_commands: "u32",
      max_pure_argument_size: "u32",
      max_type_argument_depth: "u32",
      max_type_arguments: "u32",
      move_binary_format_version: "u32",
      min_move_binary_format_version: "u32",
      random_beacon_reduction_allowed_delta: "u16",
      random_beacon_dkg_timeout_round: "u32",
      random_beacon_reduction_lower_bound: "u32",
      scoring_decision_cutoff_value: "f64",
      scoring_decision_mad_divisor: "f64",
      group_ops_bls12381_msm_max_len: "u32",
      binary_module_handles: "u16",
      binary_struct_handles: "u16",
      binary_function_handles: "u16",
      binary_function_instantiations: "u16",
      binary_signatures: "u16",
      binary_constant_pool: "u16",
      binary_identifiers: "u16",
      binary_address_identifiers: "u16",
      binary_struct_defs: "u16",
      binary_struct_def_instantiations: "u16",
      binary_function_defs: "u16",
      binary_field_handles: "u16",
      binary_field_instantiations: "u16",
      binary_friend_decls: "u16",
      max_package_dependencies: "u32",
      bridge_should_try_to_finalize_committee: "bool",
      consensus_gc_depth: "u32"
    };
    for (const { key, value } of protocolConfig.configs) {
      attributes[key] = value === null ? null : {
        [configTypeMap[key] ?? "u64"]: value
      };
    }
    for (const { key, value } of protocolConfig.featureFlags) {
      featureFlags[key] = value;
    }
    return {
      maxSupportedProtocolVersion: (_a2 = protocolConfig.protocolVersion) == null ? void 0 : _a2.toString(),
      minSupportedProtocolVersion: "1",
      protocolVersion: (_b = protocolConfig.protocolVersion) == null ? void 0 : _b.toString(),
      attributes,
      featureFlags
    };
  },
  async isTransactionIndexedOnNode(transport, [digest]) {
    const isTransactionIndexedOnNode = await transport.graphqlQuery(
      {
        query: IsTransactionIndexedOnNodeDocument,
        variables: {
          digest
        }
      },
      (data) => data.isTransactionIndexedOnNode
    );
    return isTransactionIndexedOnNode;
  },
  async view(transport, [functionName, typeArgs, callArgs]) {
    return await transport.graphqlQuery(
      {
        query: ViewDocument,
        variables: {
          functionName,
          typeArgs,
          arguments: callArgs
        }
      },
      (data) => {
        if (data.moveViewCall.error) {
          return {
            executionError: data.moveViewCall.error
          };
        } else {
          return {
            functionReturnValues: data.moveViewCall.results
          };
        }
      }
    );
  }
};
class UnsupportedParamError extends Error {
  constructor(method, param) {
    super(`Parameter ${param} is not supported for ${method} in the GraphQL API`);
  }
}
class UnsupportedMethodError extends Error {
  constructor(method) {
    super(`Method ${method} is not supported in the GraphQL API`);
  }
}
async function paginateTransactionBlockLists(transport, transactionBlock) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  let hasMoreEvents = ((_b = (_a2 = transactionBlock.effects) == null ? void 0 : _a2.events) == null ? void 0 : _b.pageInfo.hasNextPage) ?? false;
  let hasMoreBalanceChanges = ((_d = (_c = transactionBlock.effects) == null ? void 0 : _c.balanceChanges) == null ? void 0 : _d.pageInfo.hasNextPage) ?? false;
  let hasMoreObjectChanges = ((_f = (_e = transactionBlock.effects) == null ? void 0 : _e.objectChanges) == null ? void 0 : _f.pageInfo.hasNextPage) ?? false;
  let afterEvents = (_h = (_g = transactionBlock.effects) == null ? void 0 : _g.events) == null ? void 0 : _h.pageInfo.endCursor;
  let afterBalanceChanges = (_j = (_i = transactionBlock.effects) == null ? void 0 : _i.balanceChanges) == null ? void 0 : _j.pageInfo.endCursor;
  let afterObjectChanges = (_l = (_k = transactionBlock.effects) == null ? void 0 : _k.objectChanges) == null ? void 0 : _l.pageInfo.endCursor;
  while (hasMoreEvents || hasMoreBalanceChanges || hasMoreObjectChanges) {
    const page = await transport.graphqlQuery(
      {
        query: PaginateTransactionBlockListsDocument,
        variables: {
          digest: transactionBlock.digest,
          afterEvents,
          afterBalanceChanges,
          afterObjectChanges,
          hasMoreEvents,
          hasMoreBalanceChanges,
          hasMoreObjectChanges
        }
      },
      (data) => {
        var _a3;
        return (_a3 = data.transactionBlock) == null ? void 0 : _a3.effects;
      }
    );
    (_o = (_m = transactionBlock.effects) == null ? void 0 : _m.events) == null ? void 0 : _o.nodes.push(...((_n = page.events) == null ? void 0 : _n.nodes) ?? []);
    (_r = (_p = transactionBlock.effects) == null ? void 0 : _p.balanceChanges) == null ? void 0 : _r.nodes.push(...((_q = page.balanceChanges) == null ? void 0 : _q.nodes) ?? []);
    (_u = (_s = transactionBlock.effects) == null ? void 0 : _s.objectChanges) == null ? void 0 : _u.nodes.push(...((_t = page.objectChanges) == null ? void 0 : _t.nodes) ?? []);
    hasMoreEvents = ((_v = page.events) == null ? void 0 : _v.pageInfo.hasNextPage) ?? false;
    hasMoreBalanceChanges = ((_w = page.balanceChanges) == null ? void 0 : _w.pageInfo.hasNextPage) ?? false;
    hasMoreObjectChanges = ((_x = page.objectChanges) == null ? void 0 : _x.pageInfo.hasNextPage) ?? false;
    afterEvents = (_y = page.events) == null ? void 0 : _y.pageInfo.endCursor;
    afterBalanceChanges = (_z = page.balanceChanges) == null ? void 0 : _z.pageInfo.endCursor;
    afterObjectChanges = (_A = page.objectChanges) == null ? void 0 : _A.pageInfo.endCursor;
  }
}
async function paginateCheckpointLists(transport, checkpoint) {
  var _a2, _b, _c, _d, _e, _f;
  let hasNextPage = checkpoint.transactionBlocks.pageInfo.hasNextPage;
  let after = checkpoint.transactionBlocks.pageInfo.endCursor;
  while (hasNextPage) {
    const page = await transport.graphqlQuery(
      {
        query: PaginateCheckpointTransactionBlocksDocument,
        variables: {
          id: { digest: checkpoint.digest },
          after
        }
      },
      (data) => {
        var _a3;
        return (_a3 = data.checkpoint) == null ? void 0 : _a3.transactionBlocks;
      }
    );
    checkpoint.transactionBlocks.nodes.push(...page.nodes);
    hasNextPage = page.pageInfo.hasNextPage;
    after = page.pageInfo.endCursor;
  }
  const endOfEpochTx = checkpoint.endOfEpoch.nodes[0];
  if (((_a2 = endOfEpochTx == null ? void 0 : endOfEpochTx.kind) == null ? void 0 : _a2.__typename) === "EndOfEpochTransaction" && ((_b = endOfEpochTx.kind) == null ? void 0 : _b.transactions.nodes[0].__typename) === "ChangeEpochTransactionV2" && ((_c = endOfEpochTx.kind.transactions.nodes[0].epoch) == null ? void 0 : _c.epochId)) {
    const validatorSet = endOfEpochTx.kind.transactions.nodes[0].epoch.validatorSet;
    let hasNextPage2 = validatorSet == null ? void 0 : validatorSet.committeeMembers.pageInfo.hasNextPage;
    let after2 = validatorSet == null ? void 0 : validatorSet.committeeMembers.pageInfo.endCursor;
    while (hasNextPage2) {
      const page = await transport.graphqlQuery(
        {
          query: GetCommitteeInfoDocument,
          variables: {
            epochId: (_d = endOfEpochTx.kind.transactions.nodes[0].epoch) == null ? void 0 : _d.epochId,
            after: after2
          }
        },
        (data) => {
          var _a3, _b2;
          return (_b2 = (_a3 = data.epoch) == null ? void 0 : _a3.validatorSet) == null ? void 0 : _b2.committeeMembers;
        }
      );
      validatorSet == null ? void 0 : validatorSet.committeeMembers.nodes.push(...page.nodes);
      hasNextPage2 = (_e = page.pageInfo) == null ? void 0 : _e.hasNextPage;
      after2 = (_f = page.pageInfo) == null ? void 0 : _f.endCursor;
    }
  }
}
async function getDynamicFieldObject(transport, [parentId, name, options]) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  const nameLayout = await transport.graphqlQuery(
    {
      query: GetTypeLayoutDocument,
      variables: {
        type: name.type
      }
    },
    (data) => data.type.layout
  );
  const bcsName = mapJsonToBcs(name.value, nameLayout);
  const parent = await transport.graphqlQuery(
    {
      query: GetDynamicFieldObjectDocument,
      variables: {
        parentId,
        name: {
          type: name.type,
          bcs: bcsName
        },
        showBcs: options == null ? void 0 : options.showBcs,
        showContent: options == null ? void 0 : options.showContent,
        showDisplay: options == null ? void 0 : options.showDisplay,
        showOwner: options == null ? void 0 : options.showOwner,
        showPreviousTransaction: options == null ? void 0 : options.showPreviousTransaction,
        showStorageRebate: options == null ? void 0 : options.showStorageRebate,
        showType: options == null ? void 0 : options.showType
      }
    },
    (data) => {
      var _a3, _b2, _c2, _d2;
      return ((_c2 = (_b2 = (_a3 = data.owner) == null ? void 0 : _a3.dynamicObjectField) == null ? void 0 : _b2.value) == null ? void 0 : _c2.__typename) === "MoveObject" ? ((_d2 = data.owner.dynamicObjectField.value.owner) == null ? void 0 : _d2.__typename) === "Parent" ? data.owner.dynamicObjectField.value.owner.parent : void 0 : void 0;
    }
  );
  return {
    data: {
      content: parent.asMoveObject ? {
        dataType: "moveObject",
        ...moveDataToRpcContent(
          (_b = (_a2 = parent.asMoveObject) == null ? void 0 : _a2.contents) == null ? void 0 : _b.data,
          (_d = (_c = parent.asMoveObject) == null ? void 0 : _c.contents) == null ? void 0 : _d.type.layout
        )
      } : void 0,
      digest: parent == null ? void 0 : parent.digest,
      objectId: parent == null ? void 0 : parent.address,
      type: (parent == null ? void 0 : parent.asMoveObject) ? toShortTypeString((_e = parent.asMoveObject.contents) == null ? void 0 : _e.type.repr) : void 0,
      version: parent == null ? void 0 : parent.version.toString(),
      storageRebate: parent.storageRebate,
      previousTransaction: (_f = parent.previousTransactionBlock) == null ? void 0 : _f.digest,
      owner: ((_g = parent.owner) == null ? void 0 : _g.__typename) === "Parent" ? {
        ObjectOwner: (_h = parent.owner.parent) == null ? void 0 : _h.address
      } : void 0
    }
  };
}
var __typeError2 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck2 = (obj, member, msg) => member.has(obj) || __typeError2("Cannot " + msg);
var __privateGet2 = (obj, member, getter) => (__accessCheck2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd2 = (obj, member, value) => member.has(obj) ? __typeError2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet2 = (obj, member, value, setter) => (__accessCheck2(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod2 = (obj, member, method) => (__accessCheck2(obj, member, "access private method"), method);
var _options, _fallbackTransport, _fallbackMethods, _unsupportedMethods, _IotaClientGraphQLTransport_instances, tryUseFallback_fn;
class IotaClientGraphQLTransport {
  constructor(options) {
    __privateAdd2(this, _IotaClientGraphQLTransport_instances);
    __privateAdd2(this, _options);
    __privateAdd2(this, _fallbackTransport);
    __privateAdd2(this, _fallbackMethods);
    __privateAdd2(this, _unsupportedMethods);
    __privateSet2(this, _options, options);
    __privateSet2(this, _fallbackMethods, options.fallbackMethods || [
      "executeTransactionBlock",
      "dryRunTransactionBlock",
      "devInspectTransactionBlock",
      "getTotalTransactions",
      "getNetworkMetrics",
      "getParticipationMetrics",
      "getMoveCallMetrics",
      "getAllEpochAddressMetrics",
      "getEpochs",
      "getDynamicFieldObjectV2"
    ]);
    __privateSet2(this, _unsupportedMethods, options.unsupportedMethods || ["getOwnedObjects"]);
    if (options.fallbackTransportUrl) {
      __privateSet2(this, _fallbackTransport, new IotaHTTPTransport({
        url: options.fallbackTransportUrl
      }));
    }
  }
  async graphqlQuery(options, getData) {
    const res = await this.graphqlRequest(options);
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    const { data, errors } = await res.json();
    handleGraphQLErrors(errors);
    const extractedData = data && (getData ? getData(data) : data);
    if (extractedData == null) {
      throw new Error("Missing response data");
    }
    return extractedData;
  }
  async graphqlRequest(options) {
    return fetch(__privateGet2(this, _options).url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: typeof options.query === "string" || options.query instanceof TypedDocumentString ? options.query.toString() : print(options.query),
        variables: options.variables,
        extensions: options.extensions,
        operationName: options.operationName
      })
    });
  }
  async request(input) {
    let clientMethod;
    switch (input.method) {
      case "rpc.discover":
        clientMethod = "getRpcApiVersion";
        break;
      case "iotax_getLatestAddressMetrics":
        clientMethod = "getAddressMetrics";
        break;
      default:
        clientMethod = input.method.split("_")[1];
    }
    const allowFallback = __privateGet2(this, _fallbackMethods).includes(clientMethod);
    const isUnsupported = __privateGet2(this, _unsupportedMethods).includes(clientMethod);
    const method = RPC_METHODS[clientMethod];
    if (isUnsupported) {
      return __privateMethod2(this, _IotaClientGraphQLTransport_instances, tryUseFallback_fn).call(this, input);
    }
    if (!method && !allowFallback) {
      throw new UnsupportedMethodError(input.method);
    }
    try {
      if (!method) throw new Error("Missing method");
      return method(this, input.params);
    } catch (error) {
      if (allowFallback || error instanceof UnsupportedParamError) {
        return __privateMethod2(this, _IotaClientGraphQLTransport_instances, tryUseFallback_fn).call(this, input);
      } else {
        throw error;
      }
    }
  }
  async subscribe(input) {
    if (!__privateGet2(this, _fallbackTransport)) {
      throw new UnsupportedMethodError(input.method);
    }
    return __privateGet2(this, _fallbackTransport).subscribe(input);
  }
}
_options = /* @__PURE__ */ new WeakMap();
_fallbackTransport = /* @__PURE__ */ new WeakMap();
_fallbackMethods = /* @__PURE__ */ new WeakMap();
_unsupportedMethods = /* @__PURE__ */ new WeakMap();
_IotaClientGraphQLTransport_instances = /* @__PURE__ */ new WeakSet();
tryUseFallback_fn = async function(input) {
  if (!__privateGet2(this, _fallbackTransport)) {
    throw new UnsupportedMethodError(input.method);
  }
  return __privateGet2(this, _fallbackTransport).request(input);
};
function handleGraphQLErrors(errors) {
  if (!errors || errors.length === 0) return;
  const errorInstances = errors.map((error) => new GraphQLResponseError(error));
  if (errorInstances.length === 1) {
    throw errorInstances[0];
  }
  throw new AggregateError(errorInstances);
}
class GraphQLResponseError extends Error {
  constructor(error) {
    super(error.message);
    this.locations = error.locations;
  }
}
let previousInitializedNodeUrl = "";
let client = void 0;
function getClient(graphql = false) {
  let networkConfig = getSelectedNetworkConfig();
  let selectedNetworkUrl = networkConfig.node;
  if (client == void 0 || selectedNetworkUrl != previousInitializedNodeUrl) {
    let clientOptions;
    if (graphql) {
      clientOptions = {
        transport: new IotaClientGraphQLTransport({
          url: networkConfig.graphql,
          fallbackTransportUrl: selectedNetworkUrl
        })
      };
    } else {
      clientOptions = {
        url: selectedNetworkUrl
      };
    }
    client = new IotaClient(clientOptions);
    previousInitializedNodeUrl = selectedNetworkUrl;
  }
  return client;
}
function getSelectedNetworkConfig() {
  let config = get$1(sharedClientConfig);
  return config.networks.find((network) => network.name == config.selected);
}
const defaultPrivateKeyAccounts = {
  accounts: {
    "0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900": {
      bech32PrivateKey: "iotaprivkey1qq5eupu4xulxuuf904vjdcwcet0842m9vcjmdng5lt0k25uac6l2x0zczeh",
      address: "0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900",
      label: "Default Account 0",
      mnemonic: "cook robust sound vote gap elite confirm party music mobile fossil history during gesture gauge flat salt female flag dash industry caution stool bulb"
    },
    "0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11": {
      bech32PrivateKey: "iotaprivkey1qr9jaf9lywvg8uxwxcec4vqcfqlv3k4z497lqnjntwewprv573lw26wska5",
      address: "0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11",
      label: "Default Account 1",
      mnemonic: "glance old lottery ask thank resemble viable celery ankle measure stairs radar radio february maple safe umbrella doctor stuff outside nominee law edit place"
    },
    "0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522": {
      bech32PrivateKey: "iotaprivkey1qrl3rcyrgzur5830wzeklgpsam7qqk4gph8jcqx9ug6ghek7k8zkzpmy5m8",
      address: "0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522",
      label: "Default Account 2",
      mnemonic: "airport easily dignity glove guide because baby shop average camera pledge bonus plug illness junior sell volume nose power derive slight provide cradle hat"
    }
  }
};
function verifyPrivateKeyAccounts(value) {
  if (typeof value !== "object" || value === null) throw new Error("Config is not an object");
  if (typeof value.accounts !== "object" || value.accounts === null)
    throw new Error("Config.accounts is not an object");
  for (const [address, account] of Object.entries(value.accounts)) {
    if (typeof account !== "object" || account === null)
      throw new Error(`Account for ${address} is not an object`);
    const acc = account;
    if (typeof acc.bech32PrivateKey !== "string")
      throw new Error(`Account for ${address} is missing a valid bech32PrivateKey`);
    try {
      acc.address = keypairFromBech32PrivateKey(acc.bech32PrivateKey).toIotaAddress();
      if (address !== acc.address) {
        throw new Error(
          `Address key ${address} doesn't match derived address from the private key`
        );
      }
    } catch (error) {
      throw new Error(`Account for ${address} has an invalid IOTA private key: ${error}`);
    }
  }
  return true;
}
function keypairFromBech32PrivateKey(bech32privateKey) {
  const decoded = decodeIotaPrivateKey(bech32privateKey);
  const schema = decoded.schema;
  const secretKey = decoded.secretKey;
  switch (schema) {
    case "ED25519":
      return Ed25519Keypair.fromSecretKey(secretKey);
    case "Secp256k1":
      return Secp256k1Keypair.fromSecretKey(secretKey);
    case "Secp256r1":
      return Secp256r1Keypair.fromSecretKey(secretKey);
    default:
      throw new Error(`Invalid keypair schema ${schema}`);
  }
}
function toWalletAccounts(sharedPrivateKeyAccounts2) {
  return Object.values(sharedPrivateKeyAccounts2.accounts).map(
    (account) => ({
      address: account.address,
      label: account.label,
      privKey: account.bech32PrivateKey,
      publicKey: keypairFromBech32PrivateKey(account.bech32PrivateKey).getPublicKey().toRawBytes(),
      chains: ["iota:mainnet"],
      features: ["iota:signAndExecuteTransaction"]
    })
  );
}
class PrivateKeyWallet {
  async signAndExecuteTransaction(params) {
    let senderAddress = params.account.address;
    let senderAccount = get$1(sharedPrivateKeyAccounts).accounts[senderAddress];
    if (!senderAccount) {
      throw new Error(`No account found for address: ${senderAddress}`);
    }
    const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
    let client2 = getClient();
    return client2.signAndExecuteTransaction({
      // @ts-ignore
      transaction: params.transaction,
      signer: keypair,
      options: params.options
    });
  }
  async signTransaction(params) {
    let senderAddress = params.account.address;
    let senderAccount = get$1(sharedPrivateKeyAccounts).accounts[senderAddress];
    if (!senderAccount) {
      throw new Error(`No account found for address: ${senderAddress}`);
    }
    const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
    const signature = await keypair.signTransaction(await params.transaction.build());
    return { signature: signature.signature };
  }
  async signPersonalMessage(params) {
    let senderAddress = params.account.address;
    let senderAccount = get$1(sharedPrivateKeyAccounts).accounts[senderAddress];
    if (!senderAccount) {
      throw new Error(`No account found for address: ${senderAddress}`);
    }
    const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
    const signature = await keypair.signPersonalMessage(params.message);
    return { signature: signature.signature };
  }
}
function defaultExternalAddresses() {
  return {
    addresses: [],
    selectedAddress: void 0
  };
}
function verifyExternalAddresses(value) {
  if (!value || typeof value !== "object") {
    throw new Error("External addresses must be an object");
  }
  if (!Array.isArray(value.addresses)) {
    throw new Error("External addresses must contain an array of addresses");
  }
  for (const addr of value.addresses) {
    if (!addr || typeof addr !== "object") {
      throw new Error("Each external address must be an object");
    }
    if (!addr.address || typeof addr.address !== "string") {
      throw new Error("Each external address must have a valid address string");
    }
    if (addr.alias !== void 0 && typeof addr.alias !== "string") {
      throw new Error("External address alias must be a string if provided");
    }
  }
  if (value.selectedAddress !== void 0 && typeof value.selectedAddress !== "string") {
    throw new Error("Selected address must be a string if provided");
  }
  return true;
}
const CLIENT_CONFIG_KEY = "clientConfig";
const PRIVATE_KEY_ACCOUNTS_KEY = "privateKeyAccounts";
const SELECTED_SIGNER_TYPE_KEY = "selectedSignerType";
const EXTERNAL_ADDRESSES_KEY = "externalAddresses";
const clientConfigErrorMsg = writable("");
const sharedClientConfig = persistentWritableStore(
  CLIENT_CONFIG_KEY,
  defaultClientConfig,
  verifyClientConfig
);
const privateKeysErrorMsg = writable("");
const sharedPrivateKeyAccounts = persistentWritableStore(
  PRIVATE_KEY_ACCOUNTS_KEY,
  defaultPrivateKeyAccounts,
  verifyPrivateKeyAccounts
);
var SignerType = /* @__PURE__ */ ((SignerType2) => {
  SignerType2["WebWallet"] = "WebWallet";
  SignerType2["Localstorage"] = "Localstorage";
  SignerType2["ExternalAddress"] = "ExternalAddress";
  return SignerType2;
})(SignerType || {});
const sharedSignerType = persistentWritableStore(
  SELECTED_SIGNER_TYPE_KEY,
  "Localstorage",
  (value) => {
    if (typeof value !== "string" || !Object.values(SignerType).includes(value)) {
      throw new Error(
        `Invalid signer type: ${value}. Must be one of ${Object.values(SignerType).join(", ")}`
      );
    }
    return true;
  }
);
const externalAddressesErrorMsg = writable("");
const sharedExternalAddresses = persistentWritableStore(
  EXTERNAL_ADDRESSES_KEY,
  defaultExternalAddresses(),
  verifyExternalAddresses
);
function persistentWritableStore(key, initialValue, verificationFn) {
  let stored = loadFromLocalStorage(key, initialValue, verificationFn);
  const store5 = writable(stored);
  store5.subscribe((value) => {
    if (typeof localStorage !== "undefined") {
      try {
        if (verificationFn(value)) {
          localStorage.setItem(key, JSON.stringify(value));
          if (key === CLIENT_CONFIG_KEY) {
            clientConfigErrorMsg.set("");
          }
          if (key === PRIVATE_KEY_ACCOUNTS_KEY) {
            privateKeysErrorMsg.set("");
          }
          if (key === EXTERNAL_ADDRESSES_KEY) {
            externalAddressesErrorMsg.set("");
          }
        }
      } catch (err) {
        console.warn(`Invalid value for localStorage key "${key}":`, value, err);
        if (key === CLIENT_CONFIG_KEY) {
          clientConfigErrorMsg.set(err.message || String(err));
        }
        if (key === PRIVATE_KEY_ACCOUNTS_KEY) {
          privateKeysErrorMsg.set(err.message || String(err));
        }
        if (key === EXTERNAL_ADDRESSES_KEY) {
          externalAddressesErrorMsg.set(err.message || String(err));
        }
      }
    }
  });
  return store5;
}
function loadFromLocalStorage(key, initialValue, verificationFn) {
  if (typeof localStorage === "undefined") {
    return initialValue;
  }
  const json = localStorage.getItem(key);
  try {
    let value = json ? JSON.parse(json) : initialValue;
    verificationFn(value);
    return value;
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}, overwriting with default"`, err);
    return initialValue;
  }
}
const _queryParams = writable({});
function parseQueryParams() {
  if (typeof window === "undefined") return {};
  const params = {};
  let searchParams;
  const hash = window.location.hash;
  if (hash && hash.includes("?")) {
    const queryString = hash.split("?")[1];
    searchParams = new URLSearchParams(queryString);
  } else {
    searchParams = new URLSearchParams(window.location.search);
  }
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  return params;
}
function initQueryParams() {
  if (typeof window === "undefined") return;
  _queryParams.set(parseQueryParams());
  window.addEventListener("popstate", () => {
    _queryParams.set(parseQueryParams());
  });
  window.addEventListener("hashchange", () => {
    _queryParams.set(parseQueryParams());
  });
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    _queryParams.set(parseQueryParams());
  };
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    _queryParams.set(parseQueryParams());
  };
}
initQueryParams();
const queryParams = _queryParams;
const QUERY_PARAM_KEYS = {
  NETWORK: "network",
  SIGNER: "signer",
  EXTERNAL_ADDRESS: "externalAddress"
  // Add more global query param keys here as needed
};
const GLOBAL_QUERY_PARAMS = [
  QUERY_PARAM_KEYS.NETWORK,
  QUERY_PARAM_KEYS.SIGNER,
  QUERY_PARAM_KEYS.EXTERNAL_ADDRESS
];
const useQueryParamNetwork = writable(false);
const useQueryParamSigner = writable(false);
const networkFromQuery = derived(queryParams, ($params) => {
  const network = $params[QUERY_PARAM_KEYS.NETWORK];
  return Array.isArray(network) ? network[0] : network;
});
const signerFromQuery = derived(queryParams, ($params) => {
  const signer = $params[QUERY_PARAM_KEYS.SIGNER];
  return Array.isArray(signer) ? signer[0] : signer;
});
const addressFromQuery = derived(queryParams, ($params) => {
  const address = $params[QUERY_PARAM_KEYS.EXTERNAL_ADDRESS];
  return Array.isArray(address) ? address[0] : address;
});
const queryAwareClientConfig = derived(
  [sharedClientConfig, networkFromQuery, useQueryParamNetwork],
  ([$config, $networkQuery, $useQueryParam]) => {
    if ($networkQuery && $config.networks.some((n) => n.name === $networkQuery)) {
      const newConfig = {
        ...$config,
        selected: $networkQuery
      };
      if (!$useQueryParam) {
        useQueryParamNetwork.set(true);
      }
      return newConfig;
    }
    if (!$networkQuery && $useQueryParam) {
      useQueryParamNetwork.set(false);
    }
    return $config;
  }
);
function initQueryParamHandling() {
  networkFromQuery.subscribe((networkName) => {
    if (networkName) {
      sharedClientConfig.update((config) => {
        if (config.networks.some((n) => n.name === networkName) && config.selected !== networkName) {
          return {
            ...config,
            selected: networkName
          };
        }
        return config;
      });
    }
  });
  signerFromQuery.subscribe((signerName) => {
    if (signerName && Object.values(SignerType).includes(signerName)) {
      sharedSignerType.update((currentSigner) => {
        if (currentSigner !== signerName) {
          useQueryParamSigner.set(true);
          return signerName;
        }
        return currentSigner;
      });
    }
  });
}
function navigateWithGlobalParams(route) {
  if (typeof window === "undefined") return;
  const currentParams = getCurrentQueryParams();
  const globalParams = new URLSearchParams();
  for (const globalKey of GLOBAL_QUERY_PARAMS) {
    const value = currentParams[globalKey];
    if (value) {
      const paramValue = Array.isArray(value) ? value[0] : value;
      globalParams.set(globalKey, paramValue);
    }
  }
  const newHash = globalParams.toString() ? `#${route}?${globalParams.toString()}` : `#${route}`;
  window.location.hash = newHash;
}
function getCurrentQueryParams() {
  if (typeof window === "undefined") return {};
  const params = {};
  let searchParams;
  const hash = window.location.hash;
  if (hash && hash.includes("?")) {
    const queryString = hash.split("?")[1];
    searchParams = new URLSearchParams(queryString);
  } else {
    searchParams = new URLSearchParams(window.location.search);
  }
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  return params;
}
function setQueryParam(key, value) {
  if (typeof window === "undefined") return;
  let url;
  const hash = window.location.hash;
  if (hash && hash.startsWith("#/")) {
    const [route, currentParams] = hash.split("?");
    const searchParams = new URLSearchParams(currentParams || "");
    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;
    window.location.hash = newHash;
  } else {
    url = new URL(window.location.href);
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.history.replaceState({}, "", url.toString());
  }
}
var TransactionExecution = /* @__PURE__ */ ((TransactionExecution2) => {
  TransactionExecution2["DevInspect"] = "dev-inspect (simulation, free)";
  TransactionExecution2["DryRun"] = "dry-run (simulation, free)";
  TransactionExecution2["Send"] = "send (transaction, costs gas)";
  TransactionExecution2["Prepare"] = "prepare (free)";
  return TransactionExecution2;
})(TransactionExecution || {});
const sharedTransactionExecution = writable(
  "dry-run (simulation, free)"
  /* DryRun */
);
var root_1$2 = /* @__PURE__ */ from_html(`<option class="svelte-v9ucm2"> </option>`);
var root_2$2 = /* @__PURE__ */ from_html(`<option class="svelte-v9ucm2"> </option>`);
var root$3 = /* @__PURE__ */ from_html(`<main><div class="options-container svelte-v9ucm2"><div class="option-group svelte-v9ucm2"><label class="option-label svelte-v9ucm2" for="network-select">Network:</label> <select class="select-input svelte-v9ucm2" id="network-select"></select></div> <div class="option-group svelte-v9ucm2"><label class="option-label svelte-v9ucm2" for="transaction-execution-select">Transaction execution:</label> <select id="transaction-execution-select"></select></div></div></main>`);
function Options($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $clientConfig = () => store_get(clientConfig, "$clientConfig", $$stores);
  const $sharedTransactionExecution = () => store_get(sharedTransactionExecution, "$sharedTransactionExecution", $$stores);
  onMount(() => {
    initQueryParamHandling();
  });
  let clientConfig = queryAwareClientConfig;
  function handleNetworkChange(event2) {
    const target2 = event2.target;
    const selectedNetwork = target2.value;
    sharedClientConfig.update((config) => ({ ...config, selected: selectedNetwork }));
    setQueryParam(QUERY_PARAM_KEYS.NETWORK, selectedNetwork);
  }
  init();
  var main = root$3();
  var div = child(main);
  var div_1 = child(div);
  var select = sibling(child(div_1), 2);
  each(select, 5, () => $clientConfig().networks, index, ($$anchor2, network) => {
    var option = root_1$2();
    var text2 = child(option);
    var option_value = {};
    template_effect(() => {
      set_text(text2, get$2(network).name);
      if (option_value !== (option_value = get$2(network).name)) {
        option.value = (option.__value = get$2(network).name) ?? "";
      }
    });
    append($$anchor2, option);
  });
  var select_value;
  init_select(select);
  var div_2 = sibling(div_1, 2);
  var select_1 = sibling(child(div_2), 2);
  template_effect(() => {
    $sharedTransactionExecution();
    invalidate_inner_signals(() => {
    });
  });
  each(select_1, 5, () => Object.values(TransactionExecution), index, ($$anchor2, signer) => {
    var option_1 = root_2$2();
    var text_1 = child(option_1);
    var option_1_value = {};
    template_effect(() => {
      set_text(text_1, get$2(signer));
      if (option_1_value !== (option_1_value = get$2(signer))) {
        option_1.value = (option_1.__value = get$2(signer)) ?? "";
      }
    });
    append($$anchor2, option_1);
  });
  template_effect(() => {
    if (select_value !== (select_value = $clientConfig().selected)) {
      select.value = (select.__value = $clientConfig().selected) ?? "", select_option(select, $clientConfig().selected);
    }
    set_class(select_1, 1, `select-input ${$sharedTransactionExecution() === TransactionExecution.Send ? "send-mode" : ""}`, "svelte-v9ucm2");
  });
  event("change", select, handleNetworkChange);
  bind_select_value(select_1, $sharedTransactionExecution, ($$value) => store_set(sharedTransactionExecution, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
var __classPrivateFieldGet = function(receiver, state2, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state2 === "function" ? receiver !== state2 || !f : !state2.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state2.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state2, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state2 === "function" ? receiver !== state2 || !f : !state2.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state2.set(receiver, value), value;
};
var _AppReadyEvent_detail;
let wallets = void 0;
const registeredWalletsSet = /* @__PURE__ */ new Set();
function addRegisteredWallet(wallet) {
  cachedWalletsArray = void 0;
  registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
  cachedWalletsArray = void 0;
  registeredWalletsSet.delete(wallet);
}
const listeners = {};
function getWallets() {
  if (wallets)
    return wallets;
  wallets = Object.freeze({ register, get, on });
  if (typeof window === "undefined")
    return wallets;
  const api = Object.freeze({ register });
  try {
    window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
  } catch (error) {
    console.error("wallet-standard:register-wallet event listener could not be added\n", error);
  }
  try {
    window.dispatchEvent(new AppReadyEvent(api));
  } catch (error) {
    console.error("wallet-standard:app-ready event could not be dispatched\n", error);
  }
  return wallets;
}
function register(...wallets2) {
  var _a2;
  wallets2 = wallets2.filter((wallet) => !registeredWalletsSet.has(wallet));
  if (!wallets2.length)
    return () => {
    };
  wallets2.forEach((wallet) => addRegisteredWallet(wallet));
  (_a2 = listeners["register"]) == null ? void 0 : _a2.forEach((listener) => guard(() => listener(...wallets2)));
  return function unregister() {
    var _a3;
    wallets2.forEach((wallet) => removeRegisteredWallet(wallet));
    (_a3 = listeners["unregister"]) == null ? void 0 : _a3.forEach((listener) => guard(() => listener(...wallets2)));
  };
}
let cachedWalletsArray;
function get() {
  if (!cachedWalletsArray) {
    cachedWalletsArray = [...registeredWalletsSet];
  }
  return cachedWalletsArray;
}
function on(event2, listener) {
  var _a2;
  ((_a2 = listeners[event2]) == null ? void 0 : _a2.push(listener)) || (listeners[event2] = [listener]);
  return function off() {
    var _a3;
    listeners[event2] = (_a3 = listeners[event2]) == null ? void 0 : _a3.filter((existingListener) => listener !== existingListener);
  };
}
function guard(callback) {
  try {
    callback();
  } catch (error) {
    console.error(error);
  }
}
class AppReadyEvent extends Event {
  get detail() {
    return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
  }
  get type() {
    return "wallet-standard:app-ready";
  }
  constructor(api) {
    super("wallet-standard:app-ready", {
      bubbles: false,
      cancelable: false,
      composed: false
    });
    _AppReadyEvent_detail.set(this, void 0);
    __classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
  }
  /** @deprecated */
  preventDefault() {
    throw new Error("preventDefault cannot be called");
  }
  /** @deprecated */
  stopImmediatePropagation() {
    throw new Error("stopImmediatePropagation cannot be called");
  }
  /** @deprecated */
  stopPropagation() {
    throw new Error("stopPropagation cannot be called");
  }
}
_AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();
const REQUIRED_FEATURES = [
  "standard:connect",
  "standard:events"
];
function isWalletWithRequiredFeatureSet(wallet, additionalFeatures = []) {
  return [...REQUIRED_FEATURES, ...additionalFeatures].every(
    (feature) => feature in wallet.features
  );
}
const features = {
  CONNECT: "standard:connect",
  EVENTS: "standard:events",
  SIGN_AND_EXECUTE_TRANSACTION: "iota:signAndExecuteTransaction",
  SIGN_PERSONAL_MESSAGE: "iota:signPersonalMessage",
  SIGN_TRANSACTION: "iota:signTransaction"
};
function get_wallets() {
  try {
    let iotaWallets = getWallets().get().filter((wallet) => {
      const raw_features = Object.values(features);
      let isWalletWithRequired = isWalletWithRequiredFeatureSet(wallet, raw_features);
      return isWalletWithRequired;
    }).map(
      ({
        accounts,
        chains,
        features: {
          // @ts-ignore
          [features.CONNECT]: { connect },
          // @ts-ignore
          [features.EVENTS]: { on: on2 },
          // @ts-ignore
          [features.SIGN_AND_EXECUTE_TRANSACTION]: { signAndExecuteTransaction },
          // @ts-ignore
          [features.SIGN_PERSONAL_MESSAGE]: { signPersonalMessage },
          // @ts-ignore
          [features.SIGN_TRANSACTION]: {
            // @ts-ignore
            signTransaction
          }
        },
        icon,
        name,
        version
      }) => {
        return {
          accounts,
          chains,
          icon,
          name,
          version,
          connect,
          on: on2,
          signAndExecuteTransaction,
          signPersonalMessage,
          signTransaction,
          features
        };
      }
    );
    console.log("Web wallets found:", iotaWallets);
    iota_wallets.set(iotaWallets);
    if (iota_wallets.length == 0) {
      throw new Error("no web wallet found");
    }
  } catch (err) {
    console.error(err);
  }
}
const connectWallet = async (silent) => {
  get_wallets();
  if (get$1(iota_wallets).length == 0) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    get_wallets();
  }
  let connectResult = await get$1(iota_wallets)[0].connect({ silent: true });
  if (silent && connectResult.accounts && connectResult.accounts.length == 0) {
    return;
  }
  if (connectResult.accounts && connectResult.accounts.length == 0) {
    connectResult = await get$1(iota_wallets)[0].connect({ silent: false });
  }
  console.log("Web wallet accounts:", connectResult);
  iota_accounts.set(connectResult.accounts);
  activeAddress.set(connectResult.accounts[0].address);
};
let iota_wallets = writable([]);
let iota_accounts = writable([]);
let activeAddress = writable("0x");
function addOrUpdateExternalAddress(address, alias) {
  const currentAddresses = get$1(sharedExternalAddresses);
  const existingIndex = currentAddresses.addresses.findIndex((addr) => addr.address === address);
  if (existingIndex >= 0) {
    currentAddresses.addresses[existingIndex] = { address, alias };
  } else {
    currentAddresses.addresses.push({ address, alias });
  }
  currentAddresses.selectedAddress = address;
  sharedExternalAddresses.set(currentAddresses);
  if (get$1(sharedSignerType) === SignerType.ExternalAddress) {
    setSigningWithExternalAddress(address);
  }
}
function removeExternalAddress(address) {
  const currentAddresses = get$1(sharedExternalAddresses);
  const filteredAddresses = currentAddresses.addresses.filter((addr) => addr.address !== address);
  let newSelectedAddress = currentAddresses.selectedAddress;
  if (currentAddresses.selectedAddress === address) {
    newSelectedAddress = filteredAddresses.length > 0 ? filteredAddresses[0].address : void 0;
  }
  sharedExternalAddresses.set({
    addresses: filteredAddresses,
    selectedAddress: newSelectedAddress
  });
  if (get$1(sharedSignerType) === SignerType.ExternalAddress) {
    setSigningWithExternalAddress(newSelectedAddress);
  }
}
function selectExternalAddress(address) {
  const currentAddresses = get$1(sharedExternalAddresses);
  const addressExists = currentAddresses.addresses.some((addr) => addr.address === address);
  if (addressExists) {
    sharedExternalAddresses.set({
      ...currentAddresses,
      selectedAddress: address
    });
    if (get$1(sharedSignerType) === SignerType.ExternalAddress) {
      setSigningWithExternalAddress(address);
    }
  }
}
function getExternalAddresses() {
  return get$1(sharedExternalAddresses).addresses;
}
function getSelectedExternalAddress() {
  return get$1(sharedExternalAddresses).selectedAddress;
}
function setSigningWithPrivateKeyAccounts() {
  iota_wallets.set([new PrivateKeyWallet()]);
  iota_accounts.set(toWalletAccounts(get$1(sharedPrivateKeyAccounts)));
  activeAddress.set(Object.keys(get$1(sharedPrivateKeyAccounts).accounts)[0]);
}
class ExternalAddressWallet {
  async signAndExecuteTransaction(params) {
    return {
      errors: ["External address wallet cannot sign and execute transactions."]
    };
  }
  async signTransaction(params) {
    throw new Error("External address wallet cannot sign transactions.");
  }
  async signPersonalMessage(params) {
    throw new Error("External address wallet cannot sign messages.");
  }
}
function setSigningWithExternalAddress(externalAddress) {
  const storedAddresses = get$1(sharedExternalAddresses);
  let addressToUse = externalAddress || storedAddresses.selectedAddress;
  if (!addressToUse && storedAddresses.addresses.length > 0) {
    addressToUse = storedAddresses.addresses[0].address;
  }
  if (!addressToUse) {
    addressToUse = "0x0000000000000000000000000000000000000000000000000000000000000000";
  }
  iota_wallets.set([new ExternalAddressWallet()]);
  activeAddress.set(addressToUse);
  const accounts = storedAddresses.addresses.map((addr) => ({
    address: addr.address,
    label: addr.alias || "External Address",
    publicKey: new Uint8Array([]),
    chains: ["iota:mainnet"],
    features: ["iota:signAndExecuteTransaction"]
  }));
  if (externalAddress && !storedAddresses.addresses.some((addr) => addr.address === externalAddress)) {
    accounts.push({
      address: externalAddress,
      label: "(not saved)",
      publicKey: new Uint8Array([]),
      chains: ["iota:mainnet"],
      features: ["iota:signAndExecuteTransaction"]
    });
  }
  if (accounts.length === 0) {
    accounts.push({
      address: addressToUse,
      label: "External Address",
      publicKey: new Uint8Array([]),
      chains: ["iota:mainnet"],
      features: ["iota:signAndExecuteTransaction"]
    });
  }
  iota_accounts.set(accounts);
}
function updateSelectedSignerAccounts(externalAddress) {
  if (get$1(sharedSignerType) == SignerType.Localstorage) {
    setSigningWithPrivateKeyAccounts();
  }
  if (get$1(sharedSignerType) == SignerType.WebWallet) {
    iota_wallets.set([]);
    activeAddress.set("");
    iota_accounts.set([]);
    connectWallet(true);
  }
  if (get$1(sharedSignerType) == SignerType.ExternalAddress) {
    setSigningWithExternalAddress(externalAddress);
  }
}
function handleExternalAddressChange(_, $sharedSignerType, externalAddress) {
  if ($sharedSignerType() === SignerType.ExternalAddress) {
    if (isValidIotaAddress(get$2(externalAddress))) {
      setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get$2(externalAddress));
    } else {
      setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
    }
  }
}
function handleAddUpdateExternalAddress(__1, externalAddress, externalAlias) {
  if (isValidIotaAddress(get$2(externalAddress))) {
    addOrUpdateExternalAddress(get$2(externalAddress), get$2(externalAlias) || void 0);
    setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get$2(externalAddress));
  }
}
function handleRemoveExternalAddress(__2, externalAddress, externalAlias) {
  if (get$2(externalAddress)) {
    removeExternalAddress(get$2(externalAddress));
    const remainingAddresses = getExternalAddresses();
    if (remainingAddresses.length > 0) {
      set(externalAddress, remainingAddresses[0].address);
      set(externalAlias, remainingAddresses[0].alias || "");
    } else {
      set(externalAddress, "0x0000000000000000000000000000000000000000000000000000000000000000");
      set(externalAlias, "");
    }
    setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get$2(externalAddress));
  }
}
function handleAddressSelection(__3, $sharedSignerType, $activeAddress, externalAddress, externalAlias) {
  if ($sharedSignerType() === SignerType.ExternalAddress && $activeAddress()) {
    set(externalAddress, $activeAddress());
    const storedAddresses = getExternalAddresses();
    const found = storedAddresses.find((addr) => addr.address === $activeAddress());
    set(externalAlias, (found == null ? void 0 : found.alias) || "");
    selectExternalAddress($activeAddress());
    setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, $activeAddress());
  }
}
var root_1$1 = /* @__PURE__ */ from_html(`<option class="svelte-1kg0reg"> </option>`);
var on_click$1 = () => connectWallet(false);
var root_2$1 = /* @__PURE__ */ from_html(`<button class="connect-btn svelte-1kg0reg">Connect</button>`);
var root_3$1 = /* @__PURE__ */ from_html(`<div class="external-address-wrapper svelte-1kg0reg"><div class="external-address-row svelte-1kg0reg"><input type="text" placeholder="Paste or type any address (read-only)"/> <input type="text" class="alias-input svelte-1kg0reg" placeholder="Alias (optional)"/> <button class="add-update-btn svelte-1kg0reg">Save</button> <button class="remove-btn svelte-1kg0reg" title="Remove current external address">✕</button></div></div>`);
var root_4 = /* @__PURE__ */ from_html(`<option class="svelte-1kg0reg"> </option>`);
var on_click_1 = (__4, $activeAddress) => {
  navigator.clipboard.writeText($activeAddress());
};
var root$2 = /* @__PURE__ */ from_html(`<main><div class="signer-container svelte-1kg0reg"><div class="signer-controls svelte-1kg0reg"><div class="control-row svelte-1kg0reg"><div class="control-group svelte-1kg0reg"><div class="control-inline svelte-1kg0reg"><label class="control-label svelte-1kg0reg" for="signer-select">Signer:</label> <select class="select-input svelte-1kg0reg" id="signer-select"></select> <!> <!></div></div> <div class="control-group svelte-1kg0reg"><div class="control-inline svelte-1kg0reg"><label class="control-label svelte-1kg0reg" for="address-select">Address:</label> <div class="address-group svelte-1kg0reg"><select class="address-select svelte-1kg0reg" id="address-select"></select> <span style="font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace; font-size: 0.8em;"> </span> <button class="copy-btn svelte-1kg0reg" title="Copy active address">📋</button></div></div></div></div></div></div></main>`);
function Signer2($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $addressFromQuery = () => store_get(addressFromQuery, "$addressFromQuery", $$stores);
  const $sharedSignerType = () => store_get(sharedSignerType, "$sharedSignerType", $$stores);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
  let externalAddress = /* @__PURE__ */ mutable_source("0x0000000000000000000000000000000000000000000000000000000000000000");
  let externalAlias = /* @__PURE__ */ mutable_source("");
  let isAddressValid = /* @__PURE__ */ mutable_source(false);
  onMount(() => {
    const addressFromURL = $addressFromQuery();
    if (addressFromURL && isValidIotaAddress(addressFromURL)) {
      set(externalAddress, addressFromURL);
    } else {
      const selectedAddress = getSelectedExternalAddress();
      if (selectedAddress) {
        set(externalAddress, selectedAddress);
        const storedAddresses = getExternalAddresses();
        const found = storedAddresses.find((addr) => addr.address === selectedAddress);
        if (found == null ? void 0 : found.alias) {
          set(externalAlias, found.alias);
        }
      }
    }
    updateSelectedSignerAccounts(get$2(externalAddress));
  });
  function handleSignerChange(event2) {
    const target2 = event2.target;
    const selectedSigner = target2.value;
    sharedSignerType.set(selectedSigner);
    setQueryParam(QUERY_PARAM_KEYS.SIGNER, selectedSigner);
    if (selectedSigner !== SignerType.ExternalAddress) {
      setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
    }
    if (selectedSigner === SignerType.ExternalAddress) {
      updateSelectedSignerAccounts();
    } else {
      updateSelectedSignerAccounts(get$2(externalAddress));
    }
  }
  function formatOptionText(account) {
    const label = account.label || "Account";
    const addressSnippet = `${account.address.slice(0, 8)}...${account.address.slice(-6)}`;
    const maxDisplayLength = 20;
    const truncatedLabel = label.length > maxDisplayLength ? label.slice(0, maxDisplayLength - 1) + "…" : label;
    const paddedLabel = truncatedLabel.padEnd(maxDisplayLength + 1, " ");
    return `${paddedLabel}${addressSnippet}`;
  }
  legacy_pre_effect(() => get$2(externalAddress), () => {
    set(isAddressValid, (() => {
      return isValidIotaAddress(get$2(externalAddress));
    })());
  });
  legacy_pre_effect_reset();
  init();
  var main = root$2();
  var div = child(main);
  var div_1 = child(div);
  var div_2 = child(div_1);
  var div_3 = child(div_2);
  var div_4 = child(div_3);
  var select = sibling(child(div_4), 2);
  template_effect(() => {
    $sharedSignerType();
    invalidate_inner_signals(() => {
    });
  });
  select.__change = handleSignerChange;
  each(
    select,
    5,
    () => (deep_read_state(SignerType), untrack(() => Object.values(SignerType))),
    index,
    ($$anchor2, signer) => {
      var option = root_1$1();
      var text2 = child(option);
      var option_value = {};
      template_effect(() => {
        set_text(text2, get$2(signer));
        if (option_value !== (option_value = get$2(signer))) {
          option.value = (option.__value = get$2(signer)) ?? "";
        }
      });
      append($$anchor2, option);
    }
  );
  var node = sibling(select, 2);
  {
    var consequent = ($$anchor2) => {
      var button = root_2$1();
      button.__click = [on_click$1];
      append($$anchor2, button);
    };
    if_block(node, ($$render) => {
      if ($sharedSignerType(), deep_read_state(SignerType), $iota_accounts(), untrack(() => $sharedSignerType() == SignerType.WebWallet && $iota_accounts().length == 0)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_5 = root_3$1();
      var div_6 = child(div_5);
      var input = child(div_6);
      let classes;
      input.__input = [
        handleExternalAddressChange,
        $sharedSignerType,
        externalAddress
      ];
      var input_1 = sibling(input, 2);
      var button_1 = sibling(input_1, 2);
      button_1.__click = [
        handleAddUpdateExternalAddress,
        externalAddress,
        externalAlias
      ];
      var button_2 = sibling(button_1, 2);
      button_2.__click = [handleRemoveExternalAddress, externalAddress, externalAlias];
      template_effect(
        ($0) => {
          classes = set_class(input, 1, "external-address-input svelte-1kg0reg", null, classes, $0);
          button_1.disabled = !get$2(isAddressValid);
        },
        [
          () => ({
            "invalid-address": get$2(externalAddress) && !get$2(isAddressValid)
          })
        ]
      );
      bind_value(input, () => get$2(externalAddress), ($$value) => set(externalAddress, $$value));
      bind_value(input_1, () => get$2(externalAlias), ($$value) => set(externalAlias, $$value));
      append($$anchor2, div_5);
    };
    if_block(node_1, ($$render) => {
      if ($sharedSignerType(), deep_read_state(SignerType), untrack(() => $sharedSignerType() == SignerType.ExternalAddress)) $$render(consequent_1);
    });
  }
  var div_7 = sibling(div_3, 2);
  var div_8 = child(div_7);
  var div_9 = sibling(child(div_8), 2);
  var select_1 = child(div_9);
  template_effect(() => {
    $activeAddress();
    invalidate_inner_signals(() => {
      $iota_accounts();
    });
  });
  select_1.__change = [
    handleAddressSelection,
    $sharedSignerType,
    $activeAddress,
    externalAddress,
    externalAlias
  ];
  each(select_1, 5, $iota_accounts, index, ($$anchor2, account) => {
    var option_1 = root_4();
    var text_1 = child(option_1);
    var option_1_value = {};
    template_effect(
      ($0) => {
        set_text(text_1, $0);
        if (option_1_value !== (option_1_value = (get$2(account), untrack(() => get$2(account).address)))) {
          option_1.value = (option_1.__value = (get$2(account), untrack(() => get$2(account).address))) ?? "";
        }
      },
      [
        () => (get$2(account), untrack(() => formatOptionText(get$2(account))))
      ]
    );
    append($$anchor2, option_1);
  });
  var span = sibling(select_1, 2);
  var text_2 = child(span);
  var button_3 = sibling(span, 2);
  button_3.__click = [on_click_1, $activeAddress];
  template_effect(() => set_text(text_2, $activeAddress()));
  bind_select_value(select, $sharedSignerType, ($$value) => store_set(sharedSignerType, $$value));
  bind_select_value(select_1, $activeAddress, ($$value) => store_set(activeAddress, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["change", "click", "input"]);
var on_click = (_, loadTab, item) => {
  loadTab(get$2(item).route);
  navigateWithGlobalParams(get$2(item).route);
};
var root_2 = /* @__PURE__ */ from_html(`<button> </button>`);
var root_1 = /* @__PURE__ */ from_html(`<div class="tab-group svelte-1s9ulo2"><div class="group-label svelte-1s9ulo2"> </div> <div class="tab-buttons-row svelte-1s9ulo2"></div></div>`);
var root_3 = /* @__PURE__ */ from_html(`<div><!></div>`);
var root$1 = /* @__PURE__ */ from_html(`<div class="tab-groups-row svelte-1s9ulo2"></div> <div class="tab-contents"><div class="pageBox svelte-1s9ulo2"></div></div>`, 1);
function Tabs($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $location = () => store_get(location, "$location", $$stores);
  const groups = /* @__PURE__ */ mutable_source();
  let currentRoute = /* @__PURE__ */ mutable_source("");
  let items = prop($$props, "items", 24, () => []);
  let loadedTabs = /* @__PURE__ */ mutable_source({});
  let tabComponents = prop($$props, "tabComponents", 24, () => ({}));
  async function loadTab(route) {
    if (!get$2(loadedTabs)[route] && tabComponents()[route]) {
      const mod2 = await tabComponents()[route]();
      mutate(loadedTabs, get$2(loadedTabs)[route] = mod2.default);
    }
  }
  onMount(() => {
    loadTab($location());
  });
  legacy_pre_effect(() => $location(), () => {
    set(currentRoute, $location());
  });
  legacy_pre_effect(() => deep_read_state(items()), () => {
    set(groups, Array.from(new Set(items().map((item) => item.group))));
  });
  legacy_pre_effect(() => $location(), () => {
    loadTab($location());
  });
  legacy_pre_effect_reset();
  init();
  var fragment = root$1();
  var div = first_child(fragment);
  each(div, 5, () => get$2(groups), index, ($$anchor2, group) => {
    var div_1 = root_1();
    var div_2 = child(div_1);
    var text2 = child(div_2);
    var div_3 = sibling(div_2, 2);
    each(
      div_3,
      5,
      () => (deep_read_state(items()), get$2(group), untrack(() => items().filter((item) => item.group === get$2(group)))),
      index,
      ($$anchor3, item) => {
        var button = root_2();
        button.__click = [on_click, loadTab, item];
        var text_1 = child(button);
        template_effect(() => {
          set_class(
            button,
            1,
            clsx(($location(), get$2(item), untrack(() => $location() === get$2(item).route ? "active" : ""))),
            "svelte-1s9ulo2"
          );
          set_text(text_1, (get$2(item), untrack(() => get$2(item).label)));
        });
        append($$anchor3, button);
      }
    );
    template_effect(() => set_text(text2, get$2(group)));
    append($$anchor2, div_1);
  });
  var div_4 = sibling(div, 2);
  var div_5 = child(div_4);
  each(
    div_5,
    5,
    () => (get$2(loadedTabs), untrack(() => Object.entries(get$2(loadedTabs)))),
    index,
    ($$anchor2, $$item) => {
      var $$array = /* @__PURE__ */ user_derived(() => to_array(get$2($$item), 2));
      let route = () => get$2($$array)[0];
      let TabComponent = () => get$2($$array)[1];
      var div_6 = root_3();
      var node = child(div_6);
      component(node, TabComponent, ($$anchor3, $$component) => {
        $$component($$anchor3, {});
      });
      template_effect(() => set_style(div_6, `display: ${route() === $location() ? "block" : "none"};`));
      append($$anchor2, div_6);
    }
  );
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
delegate(["click"]);
var root = /* @__PURE__ */ from_html(`<main class="svelte-1j87mpa"><header class="app-header svelte-1j87mpa"><div class="header-row svelte-1j87mpa"><div class="warning-banner svelte-1j87mpa">Experimental website, use at your own risk.</div> <!></div></header> <div class="app-content svelte-1j87mpa"><!> <!></div> <footer class="app-footer svelte-1j87mpa"><div class="footer-content svelte-1j87mpa"><a href="https://github.com/Thoralf-M/iota-utils" target="_blank" rel="noopener noreferrer" class="github-link svelte-1j87mpa">View on GitHub</a></div></footer></main>`);
function App($$anchor, $$props) {
  push($$props, false);
  const pageImports = {
    IotaSystemState: () => __vitePreload(() => import("./IotaSystemState-tkGzClFA.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0),
    PTBs: () => __vitePreload(() => import("./PTBs-CAHfejg2.js"), true ? __vite__mapDeps([8,9,10,11,2,3,4,12,13,6,14,15,16,17]) : void 0),
    DynamicFields: () => __vitePreload(() => import("./DynamicFields-BgzyMfYt.js"), true ? __vite__mapDeps([18,9,1,2,3,4,5,19,16,20]) : void 0),
    StakingRewards: () => __vitePreload(() => import("./StakingRewards-BOvqj3JF.js"), true ? __vite__mapDeps([21,9,1,2,3,4,5,22,10,23,12,13,16,15,20,19,24]) : void 0),
    MultiAccountView: () => __vitePreload(() => import("./MultiAccountView-DOPXQ8-n.js"), true ? __vite__mapDeps([25,22,3,11,2,4,9,12,13,6,14,26,27]) : void 0),
    AccountsList: () => __vitePreload(() => import("./AccountsList-BQ1bLAqN.js"), true ? __vite__mapDeps([28,13,29]) : void 0),
    Keystone: () => __vitePreload(() => import("./Keystone-DORQ0Q6c.js"), true ? __vite__mapDeps([30,10,31,3,13,23,11,2,4,9,12,6,14,32]) : void 0),
    LedgerNano: () => __vitePreload(() => import("./LedgerNano-CYNuz02Z.js"), true ? __vite__mapDeps([33,13,31,34,1,2,3,4,5,35]) : void 0),
    Sign: () => __vitePreload(() => import("./Sign-D8B9Z0KR.js"), true ? __vite__mapDeps([36,9,10,3,1,2,4,5,11,12,13,6,14,20,37]) : void 0),
    PublishData: () => __vitePreload(() => import("./PublishData-DireB2FG.js"), true ? __vite__mapDeps([38,11,2,3,4,9,12,13,6,14,26,7]) : void 0),
    SplitMergeCoins: () => __vitePreload(() => import("./SplitMergeCoins-BVv1KvWt.js"), true ? __vite__mapDeps([39,1,2,3,4,5,11,9,12,13,6,14,26,7]) : void 0),
    ProgrammableTransactionBlock: () => __vitePreload(() => import("./ProgrammableTransactionBlock-ZONyS14M.js"), true ? __vite__mapDeps([40,10,34,11,2,3,4,9,12,13,6,14,41]) : void 0),
    BulkTransfer: () => __vitePreload(() => import("./BulkTransfer-BbCeSQpc.js"), true ? __vite__mapDeps([42,9,11,2,3,4,12,13,6,14,26,43]) : void 0),
    Stake: () => __vitePreload(() => import("./Stake-B9ri6XEC.js"), true ? __vite__mapDeps([44,9,12,3,13,11,2,4,6,14,26,45]) : void 0),
    Faucet: () => __vitePreload(() => import("./Faucet-CCGRLLQy.js"), true ? __vite__mapDeps([46,1,2,3,4,5,7]) : void 0),
    Converter: () => __vitePreload(() => import("./Converter-DgPDDDcF.js"), true ? __vite__mapDeps([47,10,12,3,13,11,2,4,9,6,14,20,48]) : void 0),
    TextAnalyzer: () => __vitePreload(() => import("./TextAnalyzer-CEsoopXh.js"), true ? __vite__mapDeps([49,50]) : void 0),
    Ed25519AddressGeneration: () => __vitePreload(() => import("./Ed25519AddressGeneration-BHrZq6mh.js"), true ? __vite__mapDeps([51,3,13,52]) : void 0),
    IotaNames: () => __vitePreload(() => import("./IotaNames-oNvRX-DY.js"), true ? __vite__mapDeps([53,16,11,2,3,4,9,12,13,6,14,26,7]) : void 0),
    Settings: () => __vitePreload(() => import("./Settings-CAr3MXGt.js"), true ? __vite__mapDeps([54,55]) : void 0)
  };
  ({
    "/": wrap$1({ asyncComponent: pageImports["IotaSystemState"] }),
    "/iota-system-state": wrap$1({ asyncComponent: pageImports["IotaSystemState"] }),
    "/ptbs": wrap$1({ asyncComponent: pageImports["PTBs"] }),
    "/dynamic-fields": wrap$1({ asyncComponent: pageImports["DynamicFields"] }),
    "/staking-rewards": wrap$1({ asyncComponent: pageImports["StakingRewards"] }),
    "/multi-account-view": wrap$1({ asyncComponent: pageImports["MultiAccountView"] }),
    "/accounts-list": wrap$1({ asyncComponent: pageImports["AccountsList"] }),
    "/keystone": wrap$1({ asyncComponent: pageImports["Keystone"] }),
    "/ledger-nano": wrap$1({ asyncComponent: pageImports["LedgerNano"] }),
    "/sign": wrap$1({ asyncComponent: pageImports["Sign"] }),
    "/publish-data": wrap$1({ asyncComponent: pageImports["PublishData"] }),
    "/split-merge-coins": wrap$1({ asyncComponent: pageImports["SplitMergeCoins"] }),
    "/programmable-transaction-block": wrap$1({ asyncComponent: pageImports["ProgrammableTransactionBlock"] }),
    "/bulk-transfer": wrap$1({ asyncComponent: pageImports["BulkTransfer"] }),
    "/stake": wrap$1({ asyncComponent: pageImports["Stake"] }),
    "/faucet": wrap$1({ asyncComponent: pageImports["Faucet"] }),
    "/converter": wrap$1({ asyncComponent: pageImports["Converter"] }),
    "/text-analyzer": wrap$1({ asyncComponent: pageImports["TextAnalyzer"] }),
    "/address-generation": wrap$1({ asyncComponent: pageImports["Ed25519AddressGeneration"] }),
    "/iota-names": wrap$1({ asyncComponent: pageImports["IotaNames"] }),
    "/settings": wrap$1({ asyncComponent: pageImports["Settings"] })
  });
  let items = [
    {
      label: "IOTA System State",
      route: "/iota-system-state",
      group: "Info"
    },
    { label: "PTBs", route: "/ptbs", group: "Info" },
    {
      label: "Dynamic Fields",
      route: "/dynamic-fields",
      group: "Info"
    },
    {
      label: "Staking Rewards",
      route: "/staking-rewards",
      group: "Info"
    },
    {
      label: "Multi Account View",
      route: "/multi-account-view",
      group: "Wallet"
    },
    {
      label: "Accounts List",
      route: "/accounts-list",
      group: "Wallet"
    },
    { label: "Keystone", route: "/keystone", group: "Wallet" },
    { label: "LedgerNano", route: "/ledger-nano", group: "Wallet" },
    { label: "Sign", route: "/sign", group: "Wallet" },
    {
      label: "Publish Data",
      route: "/publish-data",
      group: "Transactions"
    },
    {
      label: "Split Merge Coins",
      route: "/split-merge-coins",
      group: "Transactions"
    },
    {
      label: "PTB",
      route: "/programmable-transaction-block",
      group: "Transactions"
    },
    {
      label: "Bulk Transfer",
      route: "/bulk-transfer",
      group: "Transactions"
    },
    { label: "Stake", route: "/stake", group: "Transactions" },
    { label: "Faucet", route: "/faucet", group: "Utilities" },
    { label: "Converter", route: "/converter", group: "Utilities" },
    {
      label: "Text Analyzer",
      route: "/text-analyzer",
      group: "Utilities"
    },
    {
      label: "Address generation",
      route: "/address-generation",
      group: "Utilities"
    },
    { label: "IOTA-Names", route: "/iota-names", group: "Other" },
    { label: "⚙ Settings", route: "/settings", group: "Other" }
  ].map((e, index2) => {
    e.value = index2;
    return e;
  });
  init();
  var main = root();
  var header = child(main);
  var div = child(header);
  var node = sibling(child(div), 2);
  Options(node, {});
  var div_1 = sibling(header, 2);
  var node_1 = child(div_1);
  Signer2(node_1, {});
  var node_2 = sibling(node_1, 2);
  {
    let $0 = /* @__PURE__ */ derived_safe_equal(() => ({
      "/iota-system-state": pageImports.IotaSystemState,
      "/ptbs": pageImports.PTBs,
      "/dynamic-fields": pageImports.DynamicFields,
      "/staking-rewards": pageImports.StakingRewards,
      "/multi-account-view": pageImports.MultiAccountView,
      "/accounts-list": pageImports.AccountsList,
      "/keystone": pageImports.Keystone,
      "/ledger-nano": pageImports.LedgerNano,
      "/sign": pageImports.Sign,
      "/publish-data": pageImports.PublishData,
      "/split-merge-coins": pageImports.SplitMergeCoins,
      "/programmable-transaction-block": pageImports.ProgrammableTransactionBlock,
      "/bulk-transfer": pageImports.BulkTransfer,
      "/stake": pageImports.Stake,
      "/faucet": pageImports.Faucet,
      "/converter": pageImports.Converter,
      "/text-analyzer": pageImports.TextAnalyzer,
      "/address-generation": pageImports.Ed25519AddressGeneration,
      "/iota-names": pageImports.IotaNames,
      "/settings": pageImports.Settings
    }));
    Tabs(node_2, {
      get items() {
        return items;
      },
      get tabComponents() {
        return get$2($0);
      }
    });
  }
  append($$anchor, main);
  pop();
}
initQueryParamHandling();
const target = document.getElementById("app");
mount(App, { target });
export {
  create_text as $,
  index as A,
  init_select as B,
  untrack as C,
  select_option as D,
  bind_value as E,
  bind_group as F,
  first_child as G,
  text as H,
  comment as I,
  set_style as J,
  getSelectedNetworkConfig as K,
  set_class as L,
  user_effect as M,
  store_get as N,
  state as O,
  proxy as P,
  setup_stores as Q,
  isValidIotaAddress as R,
  normalizeIotaObjectId as S,
  toB64 as T,
  writable as U,
  user_derived as V,
  delegate as W,
  is_runes as X,
  not_equal as Y,
  safe_not_equal as Z,
  block$1 as _,
  invalidate_inner_signals as a,
  updateSelectedSignerAccounts as a$,
  branch as a0,
  current_batch as a1,
  should_defer_append as a2,
  UNINITIALIZED as a3,
  pause_effect as a4,
  effect as a5,
  derived_safe_equal as a6,
  activeAddress as a7,
  iotaBcs as a8,
  blake2b$1 as a9,
  STATE_SYMBOL as aA,
  hmac as aB,
  sha512 as aC,
  generateMnemonic as aD,
  mnemonicToEntropy as aE,
  entropyToMnemonic as aF,
  decodeIotaPrivateKey as aG,
  Ed25519Keypair as aH,
  mnemonicToSeedSync as aI,
  toHEX as aJ,
  IOTA_CLOCK_OBJECT_ID as aK,
  print as aL,
  sharedTransactionExecution as aM,
  TransactionExecution as aN,
  IOTA_DECIMALS as aO,
  NAMESPACE_HTML as aP,
  LOADING_ATTR_SYMBOL as aQ,
  get_prototype_of as aR,
  get_descriptors as aS,
  getContext as aT,
  setContext as aU,
  store_set as aV,
  component as aW,
  spread_props as aX,
  readable as aY,
  clientConfigErrorMsg as aZ,
  defaultClientConfig as a_,
  bytesToHex as aa,
  iota_accounts as ab,
  iota_wallets as ac,
  Transaction as ad,
  clsx as ae,
  render_effect as af,
  sha256 as ag,
  __vitePreload as ah,
  createEventDispatcher as ai,
  tick as aj,
  base58$1 as ak,
  Ed25519PublicKey as al,
  messageWithIntent as am,
  get_descriptor as an,
  teardown as ao,
  getAugmentedNamespace as ap,
  update as aq,
  toSerializedSignature as ar,
  to_array as as,
  TransactionDataBuilder as at,
  get$1 as au,
  IOTA_SYSTEM_STATE_OBJECT_ID as av,
  sharedClientConfig as aw,
  derived as ax,
  queryParams as ay,
  queue_micro_task as az,
  if_block as b,
  privateKeysErrorMsg as b0,
  defaultPrivateKeyAccounts as b1,
  sharedPrivateKeyAccounts as b2,
  keypairFromBech32PrivateKey as b3,
  child as c,
  set_text as d,
  event as e,
  from_html as f,
  get$2 as g,
  bind_select_value as h,
  init as i,
  set as j,
  append as k,
  pop as l,
  mutable_source as m,
  getClient as n,
  mutate as o,
  push as p,
  getDefaultExportFromCjs as q,
  prop as r,
  sibling as s,
  template_effect as t,
  onMount as u,
  onDestroy as v,
  legacy_pre_effect as w,
  deep_read_state as x,
  legacy_pre_effect_reset as y,
  each as z
};

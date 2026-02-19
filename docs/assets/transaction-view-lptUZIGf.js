import { bm as getContext, bn as setContext, p as push, N as prop, i as init, K as comment, J as first_child, b as if_block, r as store_get, k as append, l as pop, v as setup_stores, f as from_html, c as child, t as template_effect, Y as set_class, h as event, ah as store_set, a2 as writable, q as onMount, P as legacy_pre_effect, n as set, m as mutable_source, Q as deep_read_state, R as legacy_pre_effect_reset, s as sibling, H as each, g as get, S as untrack, af as derived_safe_equal, I as index, e as set_text, aH as clsx, ad as to_array, bo as component, bp as spread_props, bq as readable, y as fromBase64, T as TransactionDataBuilder, z as iotaBcs } from "./index-TW-H4z4v.js";
function slot(anchor, $$props, name, slot_props, fallback_fn) {
  var slot_fn = $$props.$$slots?.[name];
  var is_interop = false;
  if (slot_fn === true) {
    slot_fn = $$props[name === "default" ? "children" : name];
    is_interop = true;
  }
  if (slot_fn === void 0) ;
  else {
    slot_fn(anchor, is_interop ? () => slot_props : slot_props);
  }
}
function stopPropagation(fn) {
  return function(...args) {
    var event2 = (
      /** @type {Event} */
      args[0]
    );
    event2.stopPropagation();
    return fn?.apply(this, args);
  };
}
const STATE = {};
function useState(newState, opts) {
  const currentState = getContext(STATE);
  const _newState = typeof newState === "function" ? newState(currentState) : newState;
  const nextState = { ...currentState, ..._newState };
  if (opts?.expandable)
    nextState.isParentExpanded = nextState.expanded;
  setContext(STATE, nextState);
  return currentState;
}
var root_1$1 = from_html(`<span class="container svelte-oi9p46"><span></span></span>`);
function JSONArrow($$anchor, $$props) {
  push($$props, false);
  const $expandable = () => store_get(expandable, "$expandable", $$stores);
  const $expanded = () => store_get(expanded(), "$expanded", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const { expanded: _expanded, expandable } = useState();
  let expanded = prop($$props, "expanded", 8, _expanded);
  init();
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var span = root_1$1();
      var span_1 = child(span);
      let classes;
      span_1.textContent = "▶";
      template_effect(() => classes = set_class(span_1, 1, "arrow svelte-oi9p46", null, classes, { expanded: $expanded() }));
      event("click", span, (event2) => {
        event2.stopPropagation();
        store_set(expanded(), !$expanded());
      });
      append($$anchor2, span);
    };
    if_block(node, ($$render) => {
      if ($expandable()) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
function Summary($$anchor, $$props) {
  push($$props, false);
  useState({ displayMode: "summary" });
  init();
  var fragment = comment();
  var node = first_child(fragment);
  slot(node, $$props, "default", {});
  append($$anchor, fragment);
  pop();
}
function Expandable($$anchor, $$props) {
  push($$props, false);
  let expanded = prop($$props, "expanded", 8);
  let key = prop($$props, "key", 8);
  const expandable = writable(false);
  useState(({ keyPath, level }) => {
    if (key() !== "[[Entries]]") {
      keyPath = [...keyPath, key()];
      level = level + 1;
    }
    return { keyPath, level, expanded: expanded(), expandable };
  });
  init();
  var fragment = comment();
  var node = first_child(fragment);
  slot(node, $$props, "default", {});
  append($$anchor, fragment);
  pop();
}
var root_9$6 = from_html(`<span class="operator"></span>`);
var root_8$2 = from_html(`<span class="label svelte-1i7rqqe"><!><!><!></span><!>`, 1);
var root_7$4 = from_html(`<li><!></li>`);
var root_6$4 = from_html(`<ul></ul>`);
var root_3$8 = from_html(`<span class="root svelte-1i7rqqe"><!> <!></span> <!>`, 1);
function JSONNested($$anchor, $$props) {
  push($$props, false);
  const $expanded = () => store_get(expanded, "$expanded", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const child_expanded = mutable_source();
  let keys = prop($$props, "keys", 8);
  let shouldShowColon = prop($$props, "shouldShowColon", 24, () => void 0);
  let expandKey = prop($$props, "expandKey", 8, (key) => key);
  let defaultExpanded = prop($$props, "defaultExpanded", 12, false);
  const {
    isParentExpanded,
    displayMode,
    root: root2,
    expanded,
    expandable,
    keyPath,
    level,
    shouldExpandNode
  } = useState({ root: false }, { expandable: true });
  store_set(expandable, true);
  if (displayMode !== "summary") {
    if (!defaultExpanded()) {
      const controlled = shouldExpandNode({ keyPath, level });
      if (controlled !== void 0) {
        defaultExpanded(controlled);
      }
    }
    onMount(() => {
      return isParentExpanded.subscribe((value) => {
        if (!value) expanded.set(false);
        else expanded.set(defaultExpanded());
      });
    });
  }
  function toggleExpand() {
    store_set(expanded, !$expanded());
  }
  legacy_pre_effect(() => (deep_read_state(keys()), writable), () => {
    set(child_expanded, keys().map(() => writable(false)));
  });
  legacy_pre_effect_reset();
  init();
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      slot(node_1, $$props, "summary", {});
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_3$8();
      var span = first_child(fragment_2);
      var node_2 = child(span);
      {
        var consequent_1 = ($$anchor3) => {
          JSONArrow($$anchor3, {
            get expanded() {
              return expanded;
            }
          });
        };
        if_block(node_2, ($$render) => {
          if (root2) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_2, 2);
      Summary(node_3, {
        children: ($$anchor3, $$slotProps) => {
          var fragment_4 = comment();
          var node_4 = first_child(fragment_4);
          slot(
            node_4,
            $$props,
            "preview",
            {
              get root() {
                return root2;
              }
            }
          );
          append($$anchor3, fragment_4);
        },
        $$slots: { default: true }
      });
      var node_5 = sibling(span, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var ul = root_6$4();
          each(ul, 5, keys, index, ($$anchor4, key, index2) => {
            var li = root_7$4();
            let classes;
            var node_6 = child(li);
            {
              let $0 = derived_safe_equal(() => (deep_read_state(expandKey()), get(key), untrack(() => expandKey()(get(key)))));
              Expandable(node_6, {
                get key() {
                  return get($0);
                },
                get expanded() {
                  return get(child_expanded), untrack(() => get(child_expanded)[index2]);
                },
                children: ($$anchor5, $$slotProps) => {
                  var fragment_5 = root_8$2();
                  var span_1 = first_child(fragment_5);
                  var node_7 = child(span_1);
                  JSONArrow(node_7, {});
                  var node_8 = sibling(node_7);
                  slot(
                    node_8,
                    $$props,
                    "item_key",
                    {
                      get key() {
                        return get(key);
                      },
                      index: index2
                    }
                  );
                  var node_9 = sibling(node_8);
                  {
                    var consequent_2 = ($$anchor6) => {
                      var span_2 = root_9$6();
                      span_2.textContent = ": ";
                      append($$anchor6, span_2);
                    };
                    if_block(node_9, ($$render) => {
                      if (deep_read_state(shouldShowColon()), get(key), untrack(() => !shouldShowColon() || shouldShowColon()(get(key)))) $$render(consequent_2);
                    });
                  }
                  var node_10 = sibling(span_1);
                  slot(
                    node_10,
                    $$props,
                    "item_value",
                    {
                      get key() {
                        return get(key);
                      },
                      index: index2
                    }
                  );
                  event("click", span_1, () => get(child_expanded)[index2].update((value) => !value));
                  append($$anchor5, fragment_5);
                },
                $$slots: { default: true }
              });
            }
            template_effect(() => classes = set_class(li, 1, "svelte-1i7rqqe", null, classes, { indent: $expanded() }));
            event("click", li, stopPropagation(() => {
            }));
            append($$anchor4, li);
          });
          event("click", ul, stopPropagation(toggleExpand));
          append($$anchor3, ul);
        };
        if_block(node_5, ($$render) => {
          if ($expanded()) $$render(consequent_3);
        });
      }
      event("click", span, toggleExpand);
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (displayMode === "summary") $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
var root_4$4 = from_html(`<span class="label"> </span>`);
var root_3$7 = from_html(`<!><span class="operator"> </span>`, 1);
var root_6$3 = from_html(`<span class="comma operator svelte-e6kw7z">,</span>`);
var root_5$1 = from_html(`<!> <!>`, 1);
var root_7$3 = from_html(`<span class="comma operator svelte-e6kw7z">,</span> <span class="operator">…</span>`, 1);
var root_8$1 = from_html(`<span class="operator"> </span>`);
var root_2$5 = from_html(`<!> <!> <!> <!>`, 1);
function PreviewList($$anchor, $$props) {
  push($$props, false);
  let list = prop($$props, "list", 8);
  let hasMore = prop($$props, "hasMore", 8);
  let label = prop($$props, "label", 24, () => void 0);
  let prefix = prop($$props, "prefix", 24, () => void 0);
  let postfix = prop($$props, "postfix", 24, () => void 0);
  let root2 = prop($$props, "root", 8, false);
  const { showPreview } = useState();
  init();
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_5 = ($$anchor2) => {
      var fragment_1 = root_2$5();
      var node_1 = first_child(fragment_1);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_2 = root_3$7();
          var node_2 = first_child(fragment_2);
          {
            var consequent = ($$anchor4) => {
              var span = root_4$4();
              var text = child(span);
              template_effect(() => set_text(text, label()));
              append($$anchor4, span);
            };
            if_block(node_2, ($$render) => {
              if (label()) $$render(consequent);
            });
          }
          var span_1 = sibling(node_2);
          var text_1 = child(span_1);
          template_effect(() => set_text(text_1, prefix()));
          append($$anchor3, fragment_2);
        };
        if_block(node_1, ($$render) => {
          if (prefix()) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_1, 2);
      each(node_3, 1, list, index, ($$anchor3, item, index2) => {
        var fragment_3 = root_5$1();
        var node_4 = first_child(fragment_3);
        slot(
          node_4,
          $$props,
          "item",
          {
            get item() {
              return get(item);
            },
            index: index2
          }
        );
        var node_5 = sibling(node_4, 2);
        {
          var consequent_2 = ($$anchor4) => {
            var span_2 = root_6$3();
            append($$anchor4, span_2);
          };
          if_block(node_5, ($$render) => {
            if (deep_read_state(list()), untrack(() => index2 < list().length - 1)) $$render(consequent_2);
          });
        }
        append($$anchor3, fragment_3);
      });
      var node_6 = sibling(node_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var fragment_4 = root_7$3();
          append($$anchor3, fragment_4);
        };
        if_block(node_6, ($$render) => {
          if (hasMore()) $$render(consequent_3);
        });
      }
      var node_7 = sibling(node_6, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var span_3 = root_8$1();
          var text_2 = child(span_3);
          template_effect(() => set_text(text_2, postfix()));
          append($$anchor3, span_3);
        };
        if_block(node_7, ($$render) => {
          if (postfix()) $$render(consequent_4);
        });
      }
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (root2() || showPreview) $$render(consequent_5);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_3$6 = from_html(`<span class="label"> </span>`);
var root_7$2 = from_html(`<span class="property"> </span><span class="operator"></span><!>`, 1);
var root_9$5 = from_html(`<span class="property"> </span>`);
function JSONObjectNode($$anchor, $$props) {
  push($$props, false);
  const keys = mutable_source();
  const previewKeys = mutable_source();
  let value = prop($$props, "value", 8);
  let summary = prop($$props, "summary", 8);
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(keys, Object.getOwnPropertyNames(value()));
  });
  legacy_pre_effect(() => get(keys), () => {
    set(previewKeys, get(keys).slice(0, 5));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return get(keys);
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3$6();
        var text = child(span);
        template_effect(() => set_text(text, summary() ?? "{…}"));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(previewKeys), get(keys), untrack(() => get(previewKeys).length < get(keys).length)));
          let $1 = derived_safe_equal(() => summary() ? `${summary()} {` : "{");
          PreviewList($$anchor2, {
            get list() {
              return get(previewKeys);
            },
            get hasMore() {
              return get($0);
            },
            get prefix() {
              return get($1);
            },
            postfix: "}",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                var fragment_2 = root_7$2();
                var span_1 = first_child(fragment_2);
                var text_1 = child(span_1);
                var span_2 = sibling(span_1);
                span_2.textContent = ": ";
                var node = sibling(span_2);
                JSONNode(node, {
                  get value() {
                    return deep_read_state(value()), deep_read_state(get(item)), untrack(() => value()[get(item)]);
                  }
                });
                template_effect(() => set_text(text_1, get(item)));
                append($$anchor3, fragment_2);
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_3 = root_9$5();
        var text_2 = child(span_3);
        template_effect(() => set_text(text_2, get(key)));
        append($$anchor2, span_3);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        JSONNode($$anchor2, {
          get value() {
            return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
          }
        });
      }
    }
  });
  pop();
}
var root_3$5 = from_html(`<span class="label"> </span>`);
var root_9$4 = from_html(`<span class="property"> </span>`);
function JSONArrayNode($$anchor, $$props) {
  push($$props, false);
  const keys = mutable_source();
  const preview = mutable_source();
  let value = prop($$props, "value", 8);
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(keys, Object.getOwnPropertyNames(value()));
  });
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(preview, value().slice(0, 5));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return get(keys);
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3$5();
        var text = child(span);
        template_effect(() => set_text(text, `Array(${(deep_read_state(value()), untrack(() => value().length)) ?? ""})`));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(preview), deep_read_state(value()), untrack(() => get(preview).length < value().length)));
          PreviewList($$anchor2, {
            get list() {
              return get(preview);
            },
            get hasMore() {
              return get($0);
            },
            get label() {
              return `(${(deep_read_state(value()), untrack(() => value().length)) ?? ""}) `;
            },
            prefix: "[",
            postfix: "]",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                JSONNode($$anchor3, {
                  get value() {
                    return get(item);
                  }
                });
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_1 = root_9$4();
        var text_1 = child(span_1);
        template_effect(($0) => set_text(text_1, $0), [
          () => (deep_read_state(get(key)), untrack(() => String(get(key))))
        ]);
        append($$anchor2, span_1);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        JSONNode($$anchor2, {
          get value() {
            return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
          }
        });
      }
    }
  });
  pop();
}
var root_3$4 = from_html(`<span class="label"> </span>`);
var root_9$3 = from_html(`<span> </span>`);
var root_14$1 = from_html(`<span class="property"> </span>`);
function JSONIterableArrayNode($$anchor, $$props) {
  push($$props, false);
  const previewItems = mutable_source();
  let value = prop($$props, "value", 8);
  let nodeType = prop($$props, "nodeType", 8);
  let indexes = mutable_source([]);
  let items = mutable_source([]);
  const ENTRIES = "[[Entries]]";
  legacy_pre_effect(() => deep_read_state(value()), () => {
    let _indexes = [];
    let _items = [];
    let i = 0;
    for (const entry of value()) {
      _indexes.push(i++);
      _items.push(entry);
    }
    set(indexes, _indexes);
    set(items, _items);
  });
  legacy_pre_effect(() => get(items), () => {
    set(previewItems, get(items).slice(0, 5));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    keys: [ENTRIES, "size"],
    shouldShowColon: (key) => key !== ENTRIES,
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3$4();
        var text = child(span);
        template_effect(() => set_text(text, `${nodeType() ?? ""}(${(get(indexes), untrack(() => get(indexes).length)) ?? ""})`));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(previewItems), get(items), untrack(() => get(previewItems).length < get(items).length)));
          let $1 = derived_safe_equal(() => (deep_read_state(nodeType()), get(indexes), untrack(() => `${nodeType()}(${get(indexes).length}) `)));
          PreviewList($$anchor2, {
            get list() {
              return get(previewItems);
            },
            get hasMore() {
              return get($0);
            },
            get label() {
              return get($1);
            },
            prefix: "{",
            postfix: "}",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                JSONNode($$anchor3, {
                  get value() {
                    return get(item);
                  }
                });
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_1 = root_9$3();
        var text_1 = child(span_1);
        template_effect(() => {
          set_class(span_1, 1, clsx(get(key) === ENTRIES ? "internal" : "property"));
          set_text(text_1, get(key));
        });
        append($$anchor2, span_1);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var fragment_3 = comment();
        var node = first_child(fragment_3);
        {
          var consequent = ($$anchor3) => {
            JSONNested($$anchor3, {
              get keys() {
                return get(indexes);
              },
              defaultExpanded: true,
              $$slots: {
                item_key: ($$anchor4, $$slotProps2) => {
                  const index2 = derived_safe_equal(() => $$slotProps2.key);
                  var span_2 = root_14$1();
                  var text_2 = child(span_2);
                  template_effect(() => set_text(text_2, get(index2)));
                  append($$anchor4, span_2);
                },
                item_value: ($$anchor4, $$slotProps2) => {
                  const index2 = derived_safe_equal(() => $$slotProps2.key);
                  JSONNode($$anchor4, {
                    get value() {
                      return get(items), deep_read_state(get(index2)), untrack(() => get(items)[get(index2)]);
                    }
                  });
                }
              }
            });
          };
          var alternate = ($$anchor3) => {
            JSONNode($$anchor3, {
              get value() {
                return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
              }
            });
          };
          if_block(node, ($$render) => {
            if (get(key) === ENTRIES) $$render(consequent);
            else $$render(alternate, false);
          });
        }
        append($$anchor2, fragment_3);
      }
    }
  });
  pop();
}
var root_3$3 = from_html(`<span color="label"> </span>`);
var root_7$1 = from_html(`<!><span class="operator"></span><!>`, 1);
var root_9$2 = from_html(`<span> </span>`);
var root_14 = from_html(`<span class="property"> </span>`);
var root_18 = from_html(`<span class="operator"></span><!><span class="operator"></span><!><span class="operator"></span>`, 1);
var root_20 = from_html(`<span class="property"> </span>`);
function JSONIterableMapNode($$anchor, $$props) {
  push($$props, false);
  const previewKeys = mutable_source();
  let value = prop($$props, "value", 8);
  useState();
  let indexes = mutable_source([]);
  let keys = mutable_source([]);
  let values = mutable_source([]);
  const ENTRIES = "[[Entries]]";
  legacy_pre_effect(() => deep_read_state(value()), () => {
    let _indexes = [];
    let _keys = [];
    let _values = [];
    let i = 0;
    for (const entry of value()) {
      _indexes.push(i++);
      _keys.push(entry[0]);
      _values.push(entry[1]);
    }
    set(indexes, _indexes);
    set(keys, _keys);
    set(values, _values);
  });
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(previewKeys, Array.from(value().keys()).slice(0, 5));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    keys: [ENTRIES, "size"],
    shouldShowColon: (key) => key !== ENTRIES,
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3$3();
        var text = child(span);
        template_effect(() => set_text(text, `Map(${(get(keys), untrack(() => get(keys).length)) ?? ""})`));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(previewKeys), deep_read_state(value()), untrack(() => get(previewKeys).length < value().size)));
          let $1 = derived_safe_equal(() => (get(keys), untrack(() => `Map(${get(keys).length}) `)));
          PreviewList($$anchor2, {
            get list() {
              return get(previewKeys);
            },
            get hasMore() {
              return get($0);
            },
            get label() {
              return get($1);
            },
            prefix: `{`,
            postfix: "}",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                var fragment_2 = root_7$1();
                var node = first_child(fragment_2);
                JSONNode(node, {
                  get value() {
                    return get(item);
                  }
                });
                var span_1 = sibling(node);
                span_1.textContent = " => ";
                var node_1 = sibling(span_1);
                {
                  let $02 = derived_safe_equal(() => (deep_read_state(value()), deep_read_state(get(item)), untrack(() => value().get(get(item)))));
                  JSONNode(node_1, {
                    get value() {
                      return get($02);
                    }
                  });
                }
                append($$anchor3, fragment_2);
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_2 = root_9$2();
        var text_1 = child(span_2);
        template_effect(() => {
          set_class(span_2, 1, clsx(get(key) === ENTRIES ? "internal" : "property"));
          set_text(text_1, get(key));
        });
        append($$anchor2, span_2);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var fragment_3 = comment();
        var node_2 = first_child(fragment_3);
        {
          var consequent = ($$anchor3) => {
            JSONNested($$anchor3, {
              get keys() {
                return get(indexes);
              },
              expandKey: (index2) => get(keys)[index2],
              defaultExpanded: true,
              $$slots: {
                item_key: ($$anchor4, $$slotProps2) => {
                  const index2 = derived_safe_equal(() => $$slotProps2.key);
                  var span_3 = root_14();
                  var text_2 = child(span_3);
                  template_effect(() => set_text(text_2, get(index2)));
                  append($$anchor4, span_3);
                },
                item_value: ($$anchor4, $$slotProps2) => {
                  const index2 = derived_safe_equal(() => $$slotProps2.key);
                  JSONNested($$anchor4, {
                    keys: ["key", "value"],
                    $$slots: {
                      preview: ($$anchor5, $$slotProps3) => {
                        var fragment_6 = root_18();
                        var span_4 = first_child(fragment_6);
                        span_4.textContent = "{ ";
                        var node_3 = sibling(span_4);
                        JSONNode(node_3, {
                          get value() {
                            return get(keys), deep_read_state(get(index2)), untrack(() => get(keys)[get(index2)]);
                          }
                        });
                        var span_5 = sibling(node_3);
                        span_5.textContent = " => ";
                        var node_4 = sibling(span_5);
                        JSONNode(node_4, {
                          get value() {
                            return get(values), deep_read_state(get(index2)), untrack(() => get(values)[get(index2)]);
                          }
                        });
                        var span_6 = sibling(node_4);
                        span_6.textContent = " }";
                        append($$anchor5, fragment_6);
                      },
                      item_key: ($$anchor5, $$slotProps3) => {
                        const name = derived_safe_equal(() => $$slotProps3.key);
                        var span_7 = root_20();
                        var text_3 = child(span_7);
                        template_effect(() => set_text(text_3, get(name)));
                        append($$anchor5, span_7);
                      },
                      item_value: ($$anchor5, $$slotProps3) => {
                        const name = derived_safe_equal(() => $$slotProps3.key);
                        {
                          let $0 = derived_safe_equal(() => (deep_read_state(get(name)), get(keys), deep_read_state(get(index2)), get(values), untrack(() => get(name) === "key" ? get(keys)[get(index2)] : get(values)[get(index2)])));
                          JSONNode($$anchor5, {
                            get value() {
                              return get($0);
                            }
                          });
                        }
                      }
                    }
                  });
                }
              }
            });
          };
          var alternate = ($$anchor3) => {
            JSONNode($$anchor3, {
              get value() {
                return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
              }
            });
          };
          if_block(node_2, ($$render) => {
            if (get(key) === ENTRIES) $$render(consequent);
            else $$render(alternate, false);
          });
        }
        append($$anchor2, fragment_3);
      }
    }
  });
  pop();
}
var root$2 = from_html(`<span> </span>`);
function JSONValueNode($$anchor, $$props) {
  let value = prop($$props, "value", 8);
  let nodeType = prop($$props, "nodeType", 8);
  var span = root$2();
  var text = child(span);
  template_effect(() => {
    set_class(span, 1, clsx(nodeType()), "svelte-tf7rfy");
    set_text(text, value());
  });
  append($$anchor, span);
}
var root_2$4 = from_html(`<span><!><span class="operator"> </span></span><br/>`, 1);
var root_3$2 = from_html(`<span><!></span>`);
var root$1 = from_html(`<span><!></span>`);
function ErrorStack($$anchor, $$props) {
  push($$props, false);
  const $expanded = () => store_get(expanded, "$expanded", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let stack = prop($$props, "stack", 8);
  const { expanded, expandable } = useState();
  store_set(expandable, true);
  init();
  var span = root$1();
  var node = child(span);
  {
    var consequent = ($$anchor2) => {
      var fragment = comment();
      var node_1 = first_child(fragment);
      each(node_1, 1, stack, index, ($$anchor3, line, index2) => {
        const appendNewLine = derived_safe_equal(() => (deep_read_state(stack()), untrack(() => index2 < stack().length - 1)));
        var fragment_1 = root_2$4();
        var span_1 = first_child(fragment_1);
        set_class(span_1, 1, "svelte-1gtqkel", null, {}, { indent: index2 > 0 });
        var node_2 = child(span_1);
        {
          let $0 = derived_safe_equal(() => get(line) + (get(appendNewLine) ? "\\n" : ""));
          JSONNode(node_2, {
            get value() {
              return get($0);
            }
          });
        }
        var span_2 = sibling(node_2);
        var text = child(span_2);
        template_effect(() => set_text(text, get(appendNewLine) ? " +" : ""));
        append($$anchor3, fragment_1);
      });
      append($$anchor2, fragment);
    };
    var alternate = ($$anchor2) => {
      var span_3 = root_3$2();
      var node_3 = child(span_3);
      {
        let $0 = derived_safe_equal(() => (deep_read_state(stack()), untrack(() => stack()[0] + "…")));
        JSONNode(node_3, {
          get value() {
            return get($0);
          }
        });
      }
      append($$anchor2, span_3);
    };
    if_block(node, ($$render) => {
      if ($expanded()) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  event("click", span, () => store_set(expanded, !$expanded()));
  append($$anchor, span);
  pop();
  $$cleanup();
}
var root_2$3 = from_html(`<span class="label"> </span>`);
var root_4$3 = from_html(`<span class="label"> </span>`);
var root_6$2 = from_html(`<span class="property"> </span>`);
function ErrorNode($$anchor, $$props) {
  push($$props, false);
  const stack = mutable_source();
  let value = prop($$props, "value", 8);
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(stack, value().stack.split("\n"));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    keys: ["message", "stack"],
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_2$3();
        var text = child(span);
        template_effect(($0) => set_text(text, `Error: ${$0 ?? ""}`), [
          () => (deep_read_state(value()), untrack(() => String(value().message)))
        ]);
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        var span_1 = root_4$3();
        var text_1 = child(span_1);
        template_effect(($0) => set_text(text_1, `Error: ${$0 ?? ""}`), [
          () => (deep_read_state(value()), untrack(() => String(value().message)))
        ]);
        append($$anchor2, span_1);
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_2 = root_6$2();
        var text_2 = child(span_2);
        template_effect(() => set_text(text_2, get(key)));
        append($$anchor2, span_2);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var fragment_1 = comment();
        var node = first_child(fragment_1);
        {
          var consequent = ($$anchor3) => {
            ErrorStack($$anchor3, {
              get stack() {
                return get(stack);
              }
            });
          };
          var alternate = ($$anchor3) => {
            JSONNode($$anchor3, {
              get value() {
                return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
              }
            });
          };
          if_block(node, ($$render) => {
            if (get(key) === "stack") $$render(consequent);
            else $$render(alternate, false);
          });
        }
        append($$anchor2, fragment_1);
      }
    }
  });
  pop();
}
function objType(obj, shouldTreatIterableAsObject) {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  if (type === "Object") {
    if (!shouldTreatIterableAsObject && typeof obj[Symbol.iterator] === "function") {
      return "Iterable";
    }
    return obj.constructor.name;
  }
  return type;
}
var root_1 = from_html(`<span class="svelte-1tqswys"> </span>`);
var root_2$2 = from_html(`<span class="svelte-1tqswys"> </span>`);
function JSONStringNode($$anchor, $$props) {
  push($$props, false);
  const serialised = mutable_source();
  let value = prop($$props, "value", 8);
  const map = { "\n": "\\n", "	": "\\t", "\r": "\\r" };
  const { displayMode } = useState();
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(serialised, value().replace(/[\n\t\r]/g, (_) => map[_]));
  });
  legacy_pre_effect_reset();
  init();
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var span = root_1();
      var text = child(span);
      template_effect(($0) => set_text(text, `"${$0 ?? ""}"`), [
        () => (get(serialised), untrack(() => get(serialised).slice(0, 30) + (get(serialised).length > 30 ? "…" : "")))
      ]);
      append($$anchor2, span);
    };
    var alternate = ($$anchor2) => {
      var span_1 = root_2$2();
      var text_1 = child(span_1);
      template_effect(() => set_text(text_1, `"${get(serialised) ?? ""}"`));
      append($$anchor2, span_1);
    };
    if_block(node, ($$render) => {
      if (displayMode === "summary") $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$1 = from_html(`<span class="i svelte-1gun0y1">ƒ</span>`);
var root_5 = from_html(`<span class="fn i svelte-1gun0y1"> </span>`);
var root_6$1 = from_html(`<span class="i svelte-1gun0y1"> </span>`);
var root_4$2 = from_html(`<!><!>`, 1);
var root_8 = from_html(`<span> </span>`);
var root_11 = from_html(`<span class="i svelte-1gun0y1"> </span>`);
function JSONFunctionNode($$anchor, $$props) {
  push($$props, false);
  const str = mutable_source();
  const ctx = mutable_source();
  const keys = mutable_source();
  let value = prop($$props, "value", 8);
  function parseFunction(str2) {
    const match = str2.match(/^(?:(async)\s+)?(?:function)?(\*)?\s*([^(]+)?(\([^)]*\))\s*(=>)?/);
    const isAsync = match?.[1];
    const isGenerator = match?.[2];
    const fnName = match?.[3];
    const args = match?.[4];
    const isArrow = match?.[5];
    const classMatch = str2.match(/^class\s+([^\s]+)/);
    const isClass = classMatch?.[1];
    return { args, isAsync, isGenerator, fnName, isArrow, isClass };
  }
  function getPreview1({ isGenerator, isAsync, isClass }) {
    if (isClass) return `class ${isClass}`;
    return (isAsync ? "async " : "") + "ƒ" + (isGenerator ? "*" : "");
  }
  function getPreview2({ isAsync, isArrow, fnName, args }) {
    return (isArrow && isAsync ? "async" : "") + " " + (fnName ?? "") + args + (isArrow ? " => …" : "");
  }
  const FUNCTION = "[[Function]]";
  const PROTO = "[[Prototype]]";
  function getValue(key) {
    if (key === PROTO) return value().__proto__;
    return value()[key];
  }
  function filterKeys(key) {
    if (key === FUNCTION) return true;
    return getValue(key);
  }
  function toString(value2) {
    try {
      return value2.toString();
    } catch {
      switch (value2.constructor.name) {
        case "AsyncFunction":
          return "async function () {}";
        case "AsyncGeneratorFunction":
          return "async function * () {}";
        case "GeneratorFunction:":
          return "function * () {}";
        default:
          return "function () {}";
      }
    }
  }
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(str, toString(value()));
  });
  legacy_pre_effect(() => get(str), () => {
    set(ctx, parseFunction(get(str)));
  });
  legacy_pre_effect(() => {
  }, () => {
    set(keys, ["length", "name", "prototype", FUNCTION, PROTO].filter(filterKeys));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return get(keys);
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_2$1();
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_4$2();
        var node = first_child(fragment_1);
        {
          var consequent = ($$anchor3) => {
            var span_1 = root_5();
            var text = child(span_1);
            template_effect(($0) => set_text(text, $0), [() => (get(ctx), untrack(() => getPreview1(get(ctx))))]);
            append($$anchor3, span_1);
          };
          if_block(node, ($$render) => {
            if (get(ctx), untrack(() => !get(ctx).isArrow)) $$render(consequent);
          });
        }
        var node_1 = sibling(node);
        {
          var consequent_1 = ($$anchor3) => {
            var span_2 = root_6$1();
            var text_1 = child(span_2);
            template_effect(($0) => set_text(text_1, $0), [() => (get(ctx), untrack(() => getPreview2(get(ctx))))]);
            append($$anchor3, span_2);
          };
          if_block(node_1, ($$render) => {
            if (get(ctx), untrack(() => !get(ctx).isClass)) $$render(consequent_1);
          });
        }
        append($$anchor2, fragment_1);
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_3 = root_8();
        var text_2 = child(span_3);
        template_effect(() => {
          set_class(span_3, 1, clsx(get(key) === FUNCTION || get(key) === PROTO ? "internal" : "property"));
          set_text(text_2, get(key));
        });
        append($$anchor2, span_3);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var fragment_2 = comment();
        var node_2 = first_child(fragment_2);
        {
          var consequent_2 = ($$anchor3) => {
            var span_4 = root_11();
            var text_3 = child(span_4);
            template_effect(() => set_text(text_3, get(str)));
            append($$anchor3, span_4);
          };
          var alternate_1 = ($$anchor3) => {
            var fragment_3 = comment();
            var node_3 = first_child(fragment_3);
            {
              var consequent_3 = ($$anchor4) => {
                {
                  let $0 = derived_safe_equal(() => (deep_read_state(get(key)), untrack(() => getValue(get(key)))));
                  JSONObjectNode($$anchor4, {
                    get value() {
                      return get($0);
                    }
                  });
                }
              };
              var alternate = ($$anchor4) => {
                {
                  let $0 = derived_safe_equal(() => (deep_read_state(get(key)), untrack(() => getValue(get(key)))));
                  JSONNode($$anchor4, {
                    get value() {
                      return get($0);
                    }
                  });
                }
              };
              if_block(
                node_3,
                ($$render) => {
                  if (get(key) === "prototype") $$render(consequent_3);
                  else $$render(alternate, false);
                },
                true
              );
            }
            append($$anchor3, fragment_3);
          };
          if_block(node_2, ($$render) => {
            if (get(key) === FUNCTION) $$render(consequent_2);
            else $$render(alternate_1, false);
          });
        }
        append($$anchor2, fragment_2);
      }
    }
  });
  pop();
}
var root_3$1 = from_html(`<span class="label"> <!> </span>`);
var root_7 = from_html(`<span class="property"> </span><span class="operator"></span><!>`, 1);
var root_9$1 = from_html(`<span> </span>`);
function JSONSvelteStoreNode($$anchor, $$props) {
  push($$props, false);
  const $value = () => store_get(value(), "$value", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const objectKeys = mutable_source();
  const keys = mutable_source();
  const previewKeys = mutable_source();
  const storeValue = mutable_source();
  const isWritableStore = mutable_source();
  let value = prop($$props, "value", 8);
  const STORE_VALUE = "$value";
  function getValue(key) {
    if (key === STORE_VALUE) return get(storeValue);
    return value()[key];
  }
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(objectKeys, Object.getOwnPropertyNames(value()));
  });
  legacy_pre_effect(() => get(objectKeys), () => {
    set(keys, [STORE_VALUE, ...get(objectKeys)]);
  });
  legacy_pre_effect(() => get(objectKeys), () => {
    set(previewKeys, get(objectKeys).slice(0, 5));
  });
  legacy_pre_effect(() => $value(), () => {
    set(storeValue, $value());
  });
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(isWritableStore, typeof value().set === "function");
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return get(keys);
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3$1();
        var text = child(span);
        var node = sibling(text);
        JSONNode(node, {
          get value() {
            return get(storeValue);
          }
        });
        var text_1 = sibling(node, 1, true);
        text_1.nodeValue = ")";
        template_effect(() => set_text(text, get(isWritableStore) ? "writable(" : "readable("));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(previewKeys), get(objectKeys), untrack(() => get(previewKeys).length < get(objectKeys).length)));
          PreviewList($$anchor2, {
            get list() {
              return get(previewKeys);
            },
            get hasMore() {
              return get($0);
            },
            prefix: "{",
            postfix: "}",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                var fragment_2 = root_7();
                var span_1 = first_child(fragment_2);
                var text_2 = child(span_1);
                var span_2 = sibling(span_1);
                span_2.textContent = ": ";
                var node_1 = sibling(span_2);
                JSONNode(node_1, {
                  get value() {
                    return deep_read_state(value()), deep_read_state(get(item)), untrack(() => value()[get(item)]);
                  }
                });
                template_effect(() => set_text(text_2, get(item)));
                append($$anchor3, fragment_2);
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_3 = root_9$1();
        var text_3 = child(span_3);
        template_effect(() => {
          set_class(span_3, 1, clsx(get(key) === STORE_VALUE ? "internal" : "property"));
          set_text(text_3, get(key));
        });
        append($$anchor2, span_3);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        {
          let $0 = derived_safe_equal(() => (deep_read_state(get(key)), untrack(() => getValue(get(key)))));
          JSONNode($$anchor2, {
            get value() {
              return get($0);
            }
          });
        }
      }
    }
  });
  pop();
  $$cleanup();
}
var root_3 = from_html(`<span class="label"> </span>`);
var root_9 = from_html(`<span> </span>`);
function TypedArrayNode($$anchor, $$props) {
  push($$props, false);
  const keys = mutable_source();
  const preview = mutable_source();
  let value = prop($$props, "value", 8);
  let nodeType = prop($$props, "nodeType", 8);
  const TO_STRING_TAG = "Symbol(Symbol.toStringTag)";
  const internalKeys = [
    "buffer",
    "byteLength",
    "byteOffset",
    "length",
    TO_STRING_TAG
  ];
  function getValue(key) {
    if (key === TO_STRING_TAG) {
      return value()[Symbol.toStringTag];
    }
    return value()[key];
  }
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(keys, [...Object.getOwnPropertyNames(value()), ...internalKeys]);
  });
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(preview, value().slice(0, 5));
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return get(keys);
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_3();
        var text = child(span);
        template_effect(() => set_text(text, `${nodeType() ?? ""}(${(deep_read_state(value()), untrack(() => value().length)) ?? ""})`));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        const root2 = derived_safe_equal(() => $$slotProps.root);
        {
          let $0 = derived_safe_equal(() => (get(preview), deep_read_state(value()), untrack(() => get(preview).length < value().length)));
          PreviewList($$anchor2, {
            get list() {
              return get(preview);
            },
            get hasMore() {
              return get($0);
            },
            get label() {
              return `${nodeType() ?? ""}(${(deep_read_state(value()), untrack(() => value().length)) ?? ""}) `;
            },
            prefix: "[",
            postfix: "]",
            get root() {
              return get(root2);
            },
            $$slots: {
              item: ($$anchor3, $$slotProps2) => {
                const item = derived_safe_equal(() => $$slotProps2.item);
                JSONNode($$anchor3, {
                  get value() {
                    return get(item);
                  }
                });
              }
            }
          });
        }
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_1 = root_9();
        var text_1 = child(span_1);
        template_effect(
          ($0, $1) => {
            set_class(span_1, 1, $0);
            set_text(text_1, $1);
          },
          [
            () => clsx((deep_read_state(get(key)), untrack(() => internalKeys.includes(get(key)) ? "internal" : "property"))),
            () => (deep_read_state(get(key)), untrack(() => String(get(key))))
          ]
        );
        append($$anchor2, span_1);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        {
          let $0 = derived_safe_equal(() => (deep_read_state(get(key)), untrack(() => getValue(get(key)))));
          JSONNode($$anchor2, {
            get value() {
              return get($0);
            }
          });
        }
      }
    }
  });
  pop();
}
var root_2 = from_html(`<span class="regex svelte-ck09sa"> </span>`);
var root_4$1 = from_html(`<span class="regex svelte-ck09sa"> </span>`);
var root_6 = from_html(`<span class="internal"> </span>`);
function RegExpNode($$anchor, $$props) {
  push($$props, false);
  const str = mutable_source();
  let value = prop($$props, "value", 8);
  const keys = [
    "lastIndex",
    "dotAll",
    "flags",
    "global",
    "hasIndices",
    "ignoreCase",
    "multiline",
    "source",
    "sticky",
    "unicode"
  ];
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(str, value().toString());
  });
  legacy_pre_effect_reset();
  init();
  JSONNested($$anchor, {
    get keys() {
      return keys;
    },
    $$slots: {
      summary: ($$anchor2, $$slotProps) => {
        var span = root_2();
        var text = child(span);
        template_effect(() => set_text(text, get(str)));
        append($$anchor2, span);
      },
      preview: ($$anchor2, $$slotProps) => {
        var span_1 = root_4$1();
        var text_1 = child(span_1);
        template_effect(() => set_text(text_1, get(str)));
        append($$anchor2, span_1);
      },
      item_key: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        var span_2 = root_6();
        var text_2 = child(span_2);
        template_effect(($0) => set_text(text_2, $0), [
          () => (deep_read_state(get(key)), untrack(() => String(get(key))))
        ]);
        append($$anchor2, span_2);
      },
      item_value: ($$anchor2, $$slotProps) => {
        const key = derived_safe_equal(() => $$slotProps.key);
        JSONNode($$anchor2, {
          get value() {
            return deep_read_state(value()), deep_read_state(get(key)), untrack(() => value()[get(key)]);
          }
        });
      }
    }
  });
  pop();
}
function JSONNode($$anchor, $$props) {
  push($$props, false);
  const $nodeType = () => store_get(nodeType, "$nodeType", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const componentType = mutable_source();
  const props = mutable_source();
  let value = prop($$props, "value", 8);
  const nodeType = writable();
  const { shouldTreatIterableAsObject } = useState();
  function getComponentAndProps(nodeType2, value2) {
    switch (nodeType2) {
      case "Object":
        if (typeof value2.subscribe === "function") return [JSONSvelteStoreNode];
        return [JSONObjectNode];
      case "Error":
        return [ErrorNode];
      case "Array":
        return [JSONArrayNode];
      case "Map":
        return [JSONIterableMapNode];
      case "Iterable":
      case "Set":
        return [JSONIterableArrayNode, { nodeType: nodeType2 }];
      case "Number":
        return [JSONValueNode, { nodeType: nodeType2 }];
      case "String":
        return [JSONStringNode];
      case "Boolean":
        return [
          JSONValueNode,
          { nodeType: nodeType2, value: value2 ? "true" : "false" }
        ];
      case "Date":
        return [
          JSONValueNode,
          { nodeType: nodeType2, value: value2.toISOString() }
        ];
      case "Null":
        return [JSONValueNode, { nodeType: nodeType2, value: "null" }];
      case "Undefined":
        return [JSONValueNode, { nodeType: nodeType2, value: "undefined" }];
      case "Function":
      case "AsyncFunction":
      case "AsyncGeneratorFunction":
      case "GeneratorFunction":
        return [JSONFunctionNode];
      case "Symbol":
        return [
          JSONValueNode,
          { nodeType: nodeType2, value: value2.toString() }
        ];
      case "BigInt":
        return [
          JSONValueNode,
          { nodeType: nodeType2, value: String(value2) + "n" }
        ];
      case "ArrayBuffer":
        return [
          JSONValueNode,
          {
            nodeType: nodeType2,
            value: `ArrayBuffer(${value2.byteLength})`
          }
        ];
      case "BigInt64Array":
      case "BigUint64Array":
      case "Float32Array":
      case "Float64Array":
      case "Int8Array":
      case "Int16Array":
      case "Int32Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Uint16Array":
      case "Uint32Array":
        return [TypedArrayNode, { nodeType: nodeType2 }];
      case "RegExp":
        return [RegExpNode];
      default:
        return [JSONObjectNode, { summary: nodeType2 }];
    }
  }
  legacy_pre_effect(() => deep_read_state(value()), () => {
    store_set(nodeType, objType(value(), shouldTreatIterableAsObject));
  });
  legacy_pre_effect(
    () => (get(componentType), get(props), $nodeType(), deep_read_state(value())),
    () => {
      (($$value) => {
        var $$array = to_array($$value, 2);
        set(componentType, $$array[0]);
        set(props, $$array[1]);
      })(getComponentAndProps($nodeType(), value()));
    }
  );
  legacy_pre_effect_reset();
  init();
  var fragment = comment();
  var node = first_child(fragment);
  component(node, () => get(componentType), ($$anchor2, $$component) => {
    $$component($$anchor2, spread_props(
      {
        get value() {
          return value();
        }
      },
      () => get(props)
    ));
  });
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
function getShouldExpandNode({ defaultExpandedPaths, defaultExpandedLevel }) {
  const defaultExpandedPathsParts = defaultExpandedPaths.map((path) => path.split("."));
  function matchPath(keyPath) {
    outer: for (const parts of defaultExpandedPathsParts) {
      if (keyPath.length > parts.length)
        continue;
      const length = Math.min(keyPath.length, parts.length);
      for (let i = 0; i < length; i++) {
        if (parts[i] !== "*" && parts[i] !== String(keyPath[i]))
          continue outer;
      }
      return true;
    }
    return false;
  }
  return function({ keyPath, level }) {
    return level <= defaultExpandedLevel || matchPath(keyPath);
  };
}
var root_4 = from_html(`<span class="svelte-d9qf8f"> </span>`);
var root = from_html(`<span><!></span>`);
function Root($$anchor, $$props) {
  push($$props, false);
  const expandable = mutable_source();
  const shouldExpandNode = mutable_source();
  let value = prop($$props, "value", 8);
  let shouldShowPreview = prop($$props, "shouldShowPreview", 8, true);
  let shouldTreatIterableAsObject = prop($$props, "shouldTreatIterableAsObject", 8, false);
  let defaultExpandedPaths = prop($$props, "defaultExpandedPaths", 24, () => []);
  let defaultExpandedLevel = prop($$props, "defaultExpandedLevel", 8, 0);
  const expanded = writable(true);
  useState({
    expanded,
    isParentExpanded: readable(true),
    root: true,
    shouldExpandNode: (opts) => get(shouldExpandNode)(opts),
    level: 0,
    keyPath: [],
    showPreview: shouldShowPreview(),
    shouldTreatIterableAsObject: shouldTreatIterableAsObject()
  });
  legacy_pre_effect(() => deep_read_state(value()), () => {
    set(expandable, value() && typeof value() === "object");
  });
  legacy_pre_effect(
    () => (deep_read_state(defaultExpandedPaths()), deep_read_state(defaultExpandedLevel())),
    () => {
      set(shouldExpandNode, getShouldExpandNode({
        defaultExpandedPaths: defaultExpandedPaths(),
        defaultExpandedLevel: defaultExpandedLevel()
      }));
    }
  );
  legacy_pre_effect_reset();
  init();
  var span = root();
  let classes;
  var node = child(span);
  {
    var consequent = ($$anchor2) => {
      Expandable($$anchor2, {
        key: "$",
        get expanded() {
          return expanded;
        },
        children: ($$anchor3, $$slotProps) => {
          JSONNode($$anchor3, {
            get value() {
              return value();
            }
          });
        },
        $$slots: { default: true }
      });
    };
    var alternate_1 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var span_1 = root_4();
          var text = child(span_1);
          template_effect(() => set_text(text, value()));
          append($$anchor3, span_1);
        };
        var alternate = ($$anchor3) => {
          JSONNode($$anchor3, {
            get value() {
              return value();
            }
          });
        };
        if_block(
          node_1,
          ($$render) => {
            if (typeof value() === "string") $$render(consequent_1);
            else $$render(alternate, false);
          },
          true
        );
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(expandable)) $$render(consequent);
      else $$render(alternate_1, false);
    });
  }
  template_effect(() => classes = set_class(span, 1, "svelte-d9qf8f", null, classes, { expandable: get(expandable) }));
  append($$anchor, span);
  pop();
}
function removeKindFields(obj) {
  if (obj === null || obj === void 0) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => removeKindFields(item));
  }
  if (typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "$kind") {
        cleaned[key] = removeKindFields(value);
      }
    }
    return cleaned;
  }
  return obj;
}
function formatJsonWithCompactArrays(obj, indent = 0) {
  const indentStr = "  ".repeat(indent);
  const nextIndentStr = "  ".repeat(indent + 1);
  if (obj === null) return "null";
  if (typeof obj === "undefined") return "undefined";
  if (typeof obj === "string") return JSON.stringify(obj);
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    const allNumbers = obj.every((item) => typeof item === "number");
    if (allNumbers && obj.length > 0) {
      return `[${obj.join(", ")}]`;
    } else if (obj.length === 0) {
      return "[]";
    } else {
      const items = obj.map((item) => nextIndentStr + formatJsonWithCompactArrays(item, indent + 1)).join(",\n");
      return `[
${items}
${indentStr}]`;
    }
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    const items = keys.map((key) => {
      const value = formatJsonWithCompactArrays(obj[key], indent + 1);
      return `${nextIndentStr}${JSON.stringify(key)}: ${value}`;
    }).join(",\n");
    return `{
${items}
${indentStr}}`;
  }
  return String(obj);
}
function normalizeOwner(owner) {
  if (!owner) return null;
  if (typeof owner === "string") {
    return owner;
  }
  if (typeof owner === "object") {
    if (owner.AddressOwner) {
      return owner.AddressOwner;
    }
    if (owner.ObjectOwner) {
      return `Object ${owner.ObjectOwner}`;
    }
    if (owner.Shared) {
      return "Shared";
    }
    if (owner.Immutable) {
      return "Immutable";
    }
  }
  return owner;
}
function convertGraphQLObjectChanges(graphqlObjectChanges) {
  return graphqlObjectChanges.map((change) => {
    let type = "mutated";
    if (change.idCreated) {
      type = "created";
    } else if (change.idDeleted) {
      type = "deleted";
    }
    const objectId = change.idCreated || change.address || change.idDeleted;
    let objectType = "";
    if (change.outputState?.asMoveObject?.contents?.json?.type) {
      objectType = change.outputState.asMoveObject.contents.json.type;
    } else if (change.inputState?.asMoveObject?.contents?.json?.type) {
      objectType = change.inputState.asMoveObject.contents.json.type;
    }
    let fixedInputState = change.inputState;
    let fixedOutputState = change.outputState;
    return {
      // Standard fields for compatibility with other formats
      type,
      objectId,
      version: null,
      // GraphQL doesn't provide version in this format
      digest: null,
      // GraphQL doesn't provide digest in this format
      owner: change.address || null,
      // Use address as owner for GraphQL format
      objectType,
      // Preserve GraphQL-specific structure for the TransactionEffects component
      idCreated: change.idCreated,
      idDeleted: change.idDeleted,
      address: change.address,
      inputState: fixedInputState,
      outputState: fixedOutputState,
      // Mark this as GraphQL data for the component to handle appropriately
      isGraphQLFormat: true
    };
  });
}
function isWebWalletSigningResponse(data) {
  return data && typeof data === "object" && data.digest && data.signature && data.bytes && data.effects && typeof data.digest === "string" && typeof data.signature === "string" && typeof data.bytes === "string" && typeof data.effects === "string";
}
function isTransactionData(data) {
  if (data && typeof data === "object" && data.sender && data.inputs && data.commands && data.gasData) {
    return true;
  }
  if (data && typeof data === "object" && data.json && data.json.sender && data.json.inputs && data.json.commands && data.json.gasData) {
    return true;
  }
  if (data && typeof data === "object" && data.intentMessage && data.txSignatures && data.intentMessage.value) {
    return true;
  }
  if (data && typeof data === "object" && (data.digest || data.effects || data.decodedBCS || data.sender && data.timestamp)) {
    return true;
  }
  if (data && typeof data === "object" && data.jsonrpc && data.result && typeof data.result === "object" && (data.result.effects || data.result.input)) {
    return true;
  }
  if (data && typeof data === "object" && data.jsonrpc && data.result && typeof data.result === "object" && data.result.effects && data.result.results) {
    return true;
  }
  if (data && typeof data === "object" && data.digest && data.sender && data.effects && data.effects.objectChanges && data.effects.objectChanges.nodes) {
    return true;
  }
  if (isWebWalletSigningResponse(data)) {
    return true;
  }
  return false;
}
function getTransactionData(data) {
  if (data && data.digest && data.transaction?.data?.transaction?.kind === "ProgrammableTransaction") {
    const tx = data.transaction.data.transaction;
    const normalized = {
      sender: data.transaction.data.sender,
      inputs: tx.inputs,
      commands: tx.transactions,
      // transactions are the commands in this format
      gasData: data.transaction.data.gasData,
      digest: data.digest,
      // Include signatures if available
      signatures: data.transaction.txSignatures,
      // Include other original data safely, but exclude transaction to avoid recursion
      ...Object.fromEntries(Object.entries(data).filter(([k]) => k !== "transaction"))
    };
    return getTransactionData(normalized);
  }
  if (isWebWalletSigningResponse(data)) {
    let decodedTransaction = null;
    try {
      const txBytes = fromBase64(data.bytes);
      decodedTransaction = TransactionDataBuilder.fromBytes(txBytes);
    } catch (e) {
      console.warn("Failed to decode transaction bytes from web wallet response:", e);
    }
    let decodedEffects = null;
    try {
      decodedEffects = iotaBcs.TransactionEffects.parse(fromBase64(data.effects));
      console.log("Decoded effects from web wallet response:", decodedEffects);
    } catch (e) {
      console.warn("Failed to decode effects from web wallet response:", e);
    }
    const normalized = {
      digest: data.digest,
      sender: decodedTransaction?.sender || null,
      timestamp: null,
      // Web wallet response doesn't include timestamp
      signatures: [data.signature],
      effects: decodedEffects ? {
        transactionDigest: data.digest,
        status: decodedEffects.V1?.status ? { status: decodedEffects.V1.status.$kind.toLowerCase() } : { status: "unknown" },
        executedEpoch: decodedEffects.V1?.executedEpoch,
        gasUsed: decodedEffects.V1?.gasUsed,
        modifiedAtVersions: decodedEffects.V1?.modifiedAtVersions,
        sharedObjects: decodedEffects.V1?.sharedObjects,
        dependencies: decodedEffects.V1?.dependencies,
        checkpoint: {
          sequenceNumber: null,
          timestamp: null
        },
        gasEffects: {
          gasSummary: decodedEffects.V1?.gasUsed
        },
        balanceChanges: {
          nodes: []
        },
        objectChanges: {
          nodes: []
        },
        events: {
          nodes: []
        }
      } : {
        status: { status: "unknown" },
        gasUsed: {
          computationCost: "0",
          storageCost: "0",
          storageRebate: "0",
          nonRefundableStorageFee: "0"
        },
        checkpoint: { sequenceNumber: null, timestamp: null },
        gasEffects: { gasSummary: {} },
        balanceChanges: { nodes: [] },
        objectChanges: { nodes: [] },
        events: { nodes: [] }
      },
      // Include decoded transaction data if available
      ...decodedTransaction ? {
        input: {
          transaction: {
            inputs: decodedTransaction.inputs,
            transactions: decodedTransaction.commands
          },
          gasData: decodedTransaction.gasData
        },
        decodedBCS: {
          intentMessage: {
            value: {
              V1: {
                kind: {
                  ProgrammableTransaction: {
                    inputs: decodedTransaction.inputs,
                    commands: decodedTransaction.commands
                  }
                }
              }
            }
          }
        },
        transactionData: decodedTransaction
      } : {},
      // Include original web wallet response
      webWalletResponse: data
    };
    return normalized;
  }
  if (data && data.digest && data.sender && data.effects && (typeof data.checkpoint === "number" || typeof data.timestampMs === "number")) {
    const objectChanges = data.effects.objectChanges?.nodes ? convertGraphQLObjectChanges(data.effects.objectChanges.nodes) : [];
    const balanceChanges = data.effects.balanceChanges?.nodes || [];
    const events = data.effects.events?.nodes || [];
    let decodedBCS = null;
    if (data.effects.transactionBlock?.bcs) {
      try {
        decodedBCS = iotaBcs.SenderSignedData.parse(
          fromBase64(data.effects.transactionBlock.bcs)
        )[0];
      } catch (e) {
        console.warn("Failed to decode BCS data for transaction:", data.digest, e);
      }
    }
    const checkpointSeqNum = typeof data.checkpoint === "number" ? data.checkpoint : data.effects.checkpoint?.sequenceNumber;
    const checkpointTimestamp = data.timestampMs || data.effects.checkpoint?.timestamp;
    const normalized = {
      digest: data.digest,
      sender: data.sender?.address || data.sender,
      timestamp: checkpointTimestamp,
      effects: {
        transactionDigest: data.digest,
        status: { status: data.effects.status },
        executedEpoch: data.effects.executedEpoch,
        gasUsed: data.effects.gasEffects?.gasSummary,
        checkpoint: {
          sequenceNumber: checkpointSeqNum ?? null,
          timestamp: checkpointTimestamp ?? null
        },
        gasEffects: {
          gasSummary: data.effects.gasEffects?.gasSummary
        },
        balanceChanges: {
          nodes: balanceChanges
        },
        objectChanges: {
          nodes: objectChanges
        },
        events: {
          nodes: events
        },
        // Include transaction block BCS data if available
        transactionBlock: data.effects.transactionBlock
      },
      // Include the original arrays at the top level too for compatibility
      objectChanges,
      balanceChanges,
      events,
      // Include decoded BCS data if available
      decodedBCS,
      // Include original GraphQL data
      graphqlData: data
    };
    return normalized;
  }
  if (data && data.intentMessage && data.txSignatures && data.intentMessage.value) {
    let transactionData;
    if (data.intentMessage.value.V1) {
      const v1Data = data.intentMessage.value.V1;
      if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
        transactionData = {
          version: 1,
          // or extract from somewhere else if available
          sender: v1Data.sender,
          inputs: v1Data.kind.ProgrammableTransaction.inputs,
          commands: v1Data.kind.ProgrammableTransaction.commands,
          gasData: v1Data.gasData,
          expiration: v1Data.expiration,
          // Include signature information
          signatures: data.txSignatures,
          // Include original signed data for reference
          originalSignedData: data
        };
      }
    }
    if (transactionData) {
      return getTransactionData(transactionData);
    }
  }
  if (data && typeof data === "object" && data.json && data.json.sender && data.json.inputs && data.json.commands && data.json.gasData) {
    let txDigest = null;
    let decodedTransaction = null;
    if (data.transactionBytes) {
      try {
        const txBytes = fromBase64(data.transactionBytes);
        decodedTransaction = TransactionDataBuilder.fromBytes(txBytes);
        txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
      } catch (e) {
        console.log("Failed to decode transaction bytes:", e);
      }
    }
    const mergedJson = { ...data.json };
    if (decodedTransaction) {
      mergedJson.gasData = decodedTransaction.gasData;
      mergedJson.expiration = decodedTransaction.expiration;
    }
    const normalizedJson = getTransactionData(mergedJson);
    return {
      ...normalizedJson,
      digest: normalizedJson.digest || txDigest,
      transactionBytes: data.transactionBytes,
      sender: data.sender || normalizedJson.sender,
      recipients: data.recipients
    };
  }
  if (data && data.sender && data.inputs && data.commands && data.gasData) {
    let txDigest = null;
    try {
      let txData = new TransactionDataBuilder(data);
      let txBytes = txData.build();
      txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
    } catch (e) {
      console.log("Failed to build transaction digest:", e);
    }
    const normalized = {
      digest: txDigest,
      sender: data.sender,
      timestamp: null,
      // Create effects structure for compatibility
      effects: {
        status: { status: "pending" },
        gasUsed: {
          computationCost: "0",
          storageCost: "0",
          storageRebate: "0",
          nonRefundableStorageFee: "0"
        },
        gasEffects: {
          gasSummary: {
            computationCost: "0",
            storageCost: "0",
            storageRebate: "0",
            nonRefundableStorageFee: "0"
          }
        },
        balanceChanges: { nodes: [] },
        objectChanges: { nodes: [] },
        events: { nodes: [] }
      },
      // Map inputs and commands to expected paths for TransactionEffects component
      input: {
        transaction: {
          inputs: data.inputs,
          transactions: data.commands
          // commands are called transactions in this path
        },
        gasData: data.gasData
      },
      // Also map to decodedBCS format for consistency, if commands have $kind
      ...data.commands && data.commands[0] && data.commands[0].$kind ? {
        decodedBCS: {
          intentMessage: {
            value: {
              V1: {
                kind: {
                  ProgrammableTransaction: {
                    inputs: data.inputs,
                    commands: data.commands
                  }
                }
              }
            }
          }
        }
      } : {},
      // Include transaction data details
      transactionData: {
        version: data.version,
        sender: data.sender,
        inputs: data.inputs,
        commands: data.commands,
        gasData: data.gasData,
        expiration: data.expiration
      },
      // Include signature info if available
      signatures: data.signatures,
      // Include all original data
      ...data
    };
    return normalized;
  }
  if (data && data.jsonrpc && data.result) {
    const result = data.result;
    let objectChanges;
    if (result.objectChanges !== void 0) {
      objectChanges = result.objectChanges.map((change) => ({
        ...change,
        owner: normalizeOwner(change.owner)
      }));
    } else if (result.effects && (result.effects.created || result.effects.mutated)) {
      objectChanges = [
        ...(result.effects.created || []).map((obj) => ({
          type: "created",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        })),
        ...(result.effects.mutated || []).map((obj) => ({
          type: "mutated",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        }))
      ];
    } else {
      objectChanges = [];
    }
    if (result.effects && result.results) {
      const normalized2 = {
        // Map the fields to match what TransactionEffects expects
        digest: result.effects?.transactionDigest,
        sender: null,
        // Dev inspect doesn't have sender info
        timestamp: null,
        effects: {
          // Selectively include effects properties, excluding created/mutated to avoid conflicts
          transactionDigest: result.effects?.transactionDigest,
          status: result.effects?.status,
          executedEpoch: result.effects?.executedEpoch,
          gasUsed: result.effects?.gasUsed,
          modifiedAtVersions: result.effects?.modifiedAtVersions,
          sharedObjects: result.effects?.sharedObjects,
          dependencies: result.effects?.dependencies,
          checkpoint: {
            sequenceNumber: result.checkpoint?.sequenceNumber || null,
            timestamp: result.timestampMs ? typeof result.timestampMs === "string" ? parseInt(result.timestampMs) : result.timestampMs : null
          },
          // Map gas structure
          gasEffects: {
            gasSummary: result.effects?.gasUsed
          },
          // Map the arrays to the expected structure
          balanceChanges: {
            nodes: []
          },
          objectChanges: {
            nodes: objectChanges
          },
          events: {
            nodes: result.events || []
          }
        },
        // Include the original arrays at the top level too for compatibility
        objectChanges,
        balanceChanges: [],
        events: result.events || [],
        // Add dev inspect specific data
        devInspectResults: result.results,
        // Include other original data safely
        input: result.input,
        timestampMs: result.timestampMs,
        checkpoint: result.checkpoint
      };
      return normalized2;
    }
    const normalized = {
      // Map the fields to match what TransactionEffects expects
      digest: result.effects?.transactionDigest,
      sender: result.input?.sender,
      timestamp: null,
      // JSON-RPC format doesn't include timestamp
      effects: {
        // Selectively include effects properties, excluding created/mutated to avoid conflicts
        transactionDigest: result.effects?.transactionDigest,
        status: result.effects?.status,
        executedEpoch: result.effects?.executedEpoch,
        gasUsed: result.effects?.gasUsed,
        modifiedAtVersions: result.effects?.modifiedAtVersions,
        sharedObjects: result.effects?.sharedObjects,
        dependencies: result.effects?.dependencies,
        checkpoint: {
          sequenceNumber: typeof result.checkpoint === "string" || typeof result.checkpoint === "number" ? result.checkpoint : result.checkpoint?.sequenceNumber || null,
          timestamp: result.timestampMs ? typeof result.timestampMs === "string" ? parseInt(result.timestampMs) : result.timestampMs : null
        },
        // Map gas structure
        gasEffects: {
          gasSummary: result.effects?.gasUsed
        },
        // Map the arrays to the expected structure
        balanceChanges: {
          nodes: result.balanceChanges || []
        },
        objectChanges: {
          nodes: objectChanges
        },
        events: {
          nodes: result.events || []
        }
      },
      // Include the original arrays at the top level too for compatibility
      objectChanges,
      balanceChanges: result.balanceChanges || [],
      events: result.events || [],
      // Include other original data, but exclude potentially conflicting arrays
      input: result.input,
      timestampMs: result.timestampMs,
      checkpoint: result.checkpoint
    };
    return normalized;
  }
  if (data && data.effects) {
    let objectChanges;
    if (data.objectChanges !== void 0) {
      objectChanges = data.objectChanges.map((change) => ({
        ...change,
        owner: normalizeOwner(change.owner)
      }));
    } else if (data.effects && (data.effects.created || data.effects.mutated)) {
      objectChanges = [
        ...(data.effects.created || []).map((obj) => ({
          type: "created",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        })),
        ...(data.effects.mutated || []).map((obj) => ({
          type: "mutated",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        }))
      ];
    } else {
      objectChanges = [];
    }
    const normalized = {
      ...data,
      digest: data.digest || data.effects?.transactionDigest,
      sender: data?.transaction?.data?.sender || data.sender || data.input?.sender,
      objectChanges,
      effects: {
        // Selectively include effects properties, excluding created/mutated to avoid conflicts
        transactionDigest: data.effects?.transactionDigest,
        status: data.effects?.status,
        executedEpoch: data.effects?.executedEpoch,
        gasUsed: data.effects?.gasUsed,
        modifiedAtVersions: data.effects?.modifiedAtVersions,
        sharedObjects: data.effects?.sharedObjects,
        dependencies: data.effects?.dependencies,
        messageVersion: data.effects?.messageVersion,
        gasObject: data.effects?.gasObject,
        eventsDigest: data.effects?.eventsDigest,
        checkpoint: {
          sequenceNumber: typeof data.checkpoint === "string" || typeof data.checkpoint === "number" ? data.checkpoint : data.effects.checkpoint?.sequenceNumber || null,
          timestamp: data.timestampMs ? typeof data.timestampMs === "string" ? parseInt(data.timestampMs) : data.timestampMs : data.effects.checkpoint?.timestamp || null
        },
        gasEffects: data.effects.gasEffects || {
          gasSummary: data.effects?.gasUsed
        },
        objectChanges: {
          nodes: objectChanges
        },
        balanceChanges: {
          nodes: data.balanceChanges || []
        },
        events: {
          nodes: data.events || []
        }
      }
    };
    return normalized;
  }
  return data;
}
export {
  Root as R,
  formatJsonWithCompactArrays as f,
  getTransactionData as g,
  isTransactionData as i,
  removeKindFields as r
};

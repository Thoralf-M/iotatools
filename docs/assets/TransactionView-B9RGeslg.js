import { z as delegate, p as push, V as state, W as proxy, P as comment, N as first_child, b as if_block, g as get, a0 as user_derived, j as append, k as pop, f as from_html, c as child, s as sibling, G as each, H as index, t as template_effect, d as set_text, O as text, S as set_class, af as bind_checked, l as set, v as getSelectedNetworkConfig, ai as fromB64, ae as bcs, R as set_attribute, aD as to_array, aj as blake2b, B as prop, D as legacy_pre_effect, m as mutable_source, E as deep_read_state, F as legacy_pre_effect_reset, i as init, J as untrack, Q as set_style, ac as derived_safe_equal, U as user_effect, n as getClient } from "/iota-utils/assets/index-D9eKXWGw.js";
import { f as formatJsonWithCompactArrays, r as removeKindFields, i as isTransactionData, g as getTransactionData, R as Root } from "/iota-utils/assets/transaction-view-WCcFjggq.js";
import { I as IotaGraphQLClient } from "/iota-utils/assets/client-CdaJYALf.js";
import { a as formatNumberWithUnderscores, n as nanoToIota } from "/iota-utils/assets/iota-nano-conversion-BqSiw1-b.js";
function generateExplorerLink(network, type, id) {
  const networkParam = encodeURIComponent(network.indexer);
  return `${network.explorer}/${type}/${id}?network=${networkParam}`;
}
function getTransactionLink(network, txId) {
  return generateExplorerLink(network, "txBlock", txId);
}
function getObjectLink(network, objectId) {
  return generateExplorerLink(network, "object", objectId);
}
function getAddressLink(network, address) {
  return generateExplorerLink(network, "address", address);
}
function expandAll(__1, commands, expandedCommands) {
  get(commands).forEach((_, i) => get(expandedCommands)[i] = true);
}
function collapseAll(__2, expandedCommands) {
  set(expandedCommands, {}, true);
}
async function loadAllPackages(__3, getUniquePackages, fetchPackageInfo) {
  const packages = getUniquePackages();
  console.log("Loading packages:", packages);
  for (const pkg of packages) {
    await fetchPackageInfo(pkg);
  }
}
var root_7$2 = from_html(`<div class="error-item svelte-1pp25kq"> </div>`);
var root_6$2 = from_html(`<div class="error-banner svelte-1pp25kq"><strong>Package fetch errors:</strong> <!></div>`);
var on_mouseover = (__4, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout = (__5, hoveredId) => set(hoveredId, null);
var root_12$1 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var on_mouseover_1 = (__6, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout_1 = (__7, hoveredId) => set(hoveredId, null);
var root_14$2 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var on_mouseover_2 = (__8, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout_2 = (__9, hoveredId) => set(hoveredId, null);
var root_15$1 = from_html(`<span> </span>`);
var on_mouseover_3 = (__10, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout_3 = (__11, hoveredId) => set(hoveredId, null);
var root_20$1 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var on_mouseover_4 = (__12, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout_4 = (__13, hoveredId) => set(hoveredId, null);
var root_22$1 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var on_mouseover_5 = (__14, hoveredId, segment) => set(hoveredId, get(segment).id ?? null, true);
var on_mouseout_5 = (__15, hoveredId) => set(hoveredId, null);
var root_23$1 = from_html(`<span> </span>`);
var root_16 = from_html(`<span></span>`);
var root_8$1 = from_html(`<div class="command-item svelte-1pp25kq"><span class="command-index svelte-1pp25kq"></span> <button class="expand-btn svelte-1pp25kq"> </button> <div class="command-content svelte-1pp25kq"><span class="command-call"></span> <!></div></div>`);
var root_1$2 = from_html(`<div class="ptb-view svelte-1pp25kq"><div class="ptb-controls svelte-1pp25kq"><div class="controls-group svelte-1pp25kq"><button class="svelte-1pp25kq">Expand All</button> <button class="svelte-1pp25kq">Collapse All</button></div> <div class="controls-divider svelte-1pp25kq"></div> <div class="controls-group svelte-1pp25kq"><button class="svelte-1pp25kq"><!></button> <label class="toggle-row svelte-1pp25kq"><span class="toggle-label svelte-1pp25kq">Show Types</span> <div class="toggle-switch svelte-1pp25kq"><input type="checkbox" class="svelte-1pp25kq"/> <span class="slider svelte-1pp25kq"></span></div></label> <label class="toggle-row svelte-1pp25kq"><span class="toggle-label svelte-1pp25kq">Short IDs</span> <div class="toggle-switch svelte-1pp25kq"><input type="checkbox" class="svelte-1pp25kq"/> <span class="slider svelte-1pp25kq"></span></div></label></div></div> <!> <!></div>`);
var root_24$1 = from_html(`<div class="no-data svelte-1pp25kq">No PTB commands found</div>`);
function TransactionCommands($$anchor, $$props) {
  push($$props, true);
  function getPTB(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (((_c = (_b = (_a = data == null ? void 0 : data.transaction) == null ? void 0 : _a.data) == null ? void 0 : _b.transaction) == null ? void 0 : _c.kind) === "ProgrammableTransaction") {
      return data.transaction.data.transaction;
    }
    if ((_h = (_g = (_f = (_e = (_d = data == null ? void 0 : data.decodedBCS) == null ? void 0 : _d.intentMessage) == null ? void 0 : _e.value) == null ? void 0 : _f.V1) == null ? void 0 : _g.kind) == null ? void 0 : _h.ProgrammableTransaction) {
      return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction;
    }
    if ((_i = data == null ? void 0 : data.input) == null ? void 0 : _i.transaction) {
      return data.input.transaction;
    }
    if ((data == null ? void 0 : data.kind) === "ProgrammableTransaction") {
      return data;
    }
    return null;
  }
  function getInputs(data, ptbData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (ptbData == null ? void 0 : ptbData.inputs) {
      return ptbData.inputs;
    }
    if ((_c = (_b = (_a = data == null ? void 0 : data.transaction) == null ? void 0 : _a.data) == null ? void 0 : _b.transaction) == null ? void 0 : _c.inputs) {
      return data.transaction.data.transaction.inputs;
    }
    if (data == null ? void 0 : data.rawTransaction) {
      try {
        const raw = typeof data.rawTransaction === "string" ? JSON.parse(data.rawTransaction) : data.rawTransaction;
        if (raw == null ? void 0 : raw.inputs) {
          return raw.inputs;
        }
      } catch {
      }
    }
    if ((_i = (_h = (_g = (_f = (_e = (_d = data == null ? void 0 : data.decodedBCS) == null ? void 0 : _d.intentMessage) == null ? void 0 : _e.value) == null ? void 0 : _f.V1) == null ? void 0 : _g.kind) == null ? void 0 : _h.ProgrammableTransaction) == null ? void 0 : _i.inputs) {
      return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs;
    }
    if ((_k = (_j = data == null ? void 0 : data.input) == null ? void 0 : _j.transaction) == null ? void 0 : _k.inputs) {
      return data.input.transaction.inputs;
    }
    return [];
  }
  let ptb = user_derived(() => getPTB($$props.transactionData));
  let inputs = user_derived(() => getInputs($$props.transactionData, get(ptb)));
  let commands = user_derived(() => {
    var _a, _b;
    return ((_a = get(ptb)) == null ? void 0 : _a.commands) || ((_b = get(ptb)) == null ? void 0 : _b.transactions) || [];
  });
  let expandedCommands = state(proxy({}));
  let hoveredId = state(null);
  let packageCache = proxy({});
  let loadingPackages = proxy({});
  let packageErrors = proxy({});
  let shortPackageIds = state(true);
  let showTypeInfo = state(true);
  function toggle(i) {
    get(expandedCommands)[i] = !get(expandedCommands)[i];
  }
  function trimAddress(address) {
    const addr = address.toLowerCase().replace(/^0x/, "");
    const shortened = addr.replace(/^0+/, "") || "0";
    return `0x${shortened}`;
  }
  function decodePureValue(base64Bytes, type) {
    if (!type) return null;
    try {
      const bytes = fromB64(base64Bytes);
      const uint8Array = new Uint8Array(bytes);
      let baseType = type.replace(/^&(mut )?/, "");
      if (baseType === "bool") {
        return bcs.bool().parse(uint8Array).toString();
      } else if (baseType === "u8") {
        return bcs.u8().parse(uint8Array).toString();
      } else if (baseType === "u16") {
        return bcs.u16().parse(uint8Array).toString();
      } else if (baseType === "u32") {
        return bcs.u32().parse(uint8Array).toString();
      } else if (baseType === "u64") {
        return bcs.u64().parse(uint8Array).toString();
      } else if (baseType === "u128") {
        return bcs.u128().parse(uint8Array).toString();
      } else if (baseType === "u256") {
        return bcs.u256().parse(uint8Array).toString();
      } else if (baseType === "address") {
        return `0x${Array.from(uint8Array).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
      } else if (baseType.startsWith("vector<u8>") || baseType === "string") {
        try {
          const str = new TextDecoder().decode(uint8Array);
          if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
            return `"${str}"`;
          }
        } catch {
        }
      }
      return null;
    } catch (e) {
      console.error("Failed to decode pure value:", e, "type:", type);
      return null;
    }
  }
  function isHighlighted(segId, hId) {
    if (!segId || !hId) return false;
    if (segId === hId) return true;
    const parse = (id) => {
      const firstColon = id.indexOf(":");
      if (firstColon === -1) return null;
      const type = id.substring(0, firstColon);
      const path = id.substring(firstColon + 1);
      const pathParts = path.split("::");
      if (pathParts.length !== 3) return { type, pkg: path, mod: "", fun: "" };
      return {
        type,
        pkg: pathParts[0],
        mod: pathParts[1],
        fun: pathParts[2]
      };
    };
    const h = parse(hId);
    const s = parse(segId);
    if (!h || !s) return false;
    if (h.type === "obj") {
      return s.type === "obj" && s.pkg === h.pkg;
    }
    if (h.type === "pkg") {
      return s.type === "pkg" && s.pkg === h.pkg;
    }
    if (h.type === "mod") {
      if (s.pkg !== h.pkg || s.mod !== h.mod) return false;
      return s.type === "pkg" || s.type === "mod";
    }
    if (h.type === "fun") {
      if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
      return s.type === "pkg" || s.type === "mod" || s.type === "fun";
    }
    if (h.type === "struct") {
      if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
      return s.type === "pkg" || s.type === "mod" || s.type === "struct";
    }
    return false;
  }
  async function fetchPackageInfo(packageId) {
    var _a, _b, _c, _d;
    if (packageCache[packageId] || loadingPackages[packageId]) {
      console.log("Skipping package (cached or loading):", packageId);
      return;
    }
    console.log("Fetching package info for:", packageId);
    loadingPackages[packageId] = true;
    packageErrors[packageId] = "";
    try {
      const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
      const query = `
                query PackageQuery($address: IotaAddress!, $functionsCursor: String) {
                    package(address: $address) {
                        address
                        modules {
                            nodes {
                                name
                                functions(first: 20, after: $functionsCursor) {
                                    pageInfo {
                                        hasNextPage
                                        endCursor
                                    }
                                    nodes {
                                        name
                                        visibility
                                        isEntry
                                        typeParameters {
                                            constraints
                                        }
                                        parameters {
                                            repr
                                        }
                                        return {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;
      let allModules = [];
      let hasMorePages = true;
      let cursor = null;
      while (hasMorePages) {
        const result = await gqlClient.query({
          query,
          variables: { address: packageId, functionsCursor: cursor }
        });
        if (!((_a = result.data) == null ? void 0 : _a.package)) {
          packageErrors[packageId] = "Package not found";
          console.error("Package not found:", packageId);
          break;
        }
        const modules = ((_b = result.data.package.modules) == null ? void 0 : _b.nodes) || [];
        hasMorePages = false;
        for (const module of modules) {
          if ((_d = (_c = module.functions) == null ? void 0 : _c.pageInfo) == null ? void 0 : _d.hasNextPage) {
            hasMorePages = true;
            cursor = module.functions.pageInfo.endCursor;
            break;
          }
        }
        if (allModules.length === 0) {
          allModules = modules.map((m) => {
            var _a2;
            return { name: m.name, functions: { nodes: ((_a2 = m.functions) == null ? void 0 : _a2.nodes) || [] } };
          });
        } else {
          modules.forEach((newModule, idx) => {
            var _a2;
            if (allModules[idx]) {
              allModules[idx].functions.nodes.push(...((_a2 = newModule.functions) == null ? void 0 : _a2.nodes) || []);
            }
          });
        }
        if (!hasMorePages) {
          packageCache[packageId] = {
            address: result.data.package.address,
            modules: { nodes: allModules }
          };
          console.log("Package data fetched:", packageId, packageCache[packageId]);
        }
      }
    } catch (error) {
      console.error("Error fetching package:", packageId, error);
      packageErrors[packageId] = error.message || "Failed to fetch package info";
    } finally {
      loadingPackages[packageId] = false;
    }
  }
  function getFunctionInfo(packageId, moduleName, functionName) {
    var _a, _b, _c, _d;
    if (!get(showTypeInfo)) return null;
    const pkg = packageCache[packageId];
    if (!pkg) return null;
    const module = (_b = (_a = pkg.modules) == null ? void 0 : _a.nodes) == null ? void 0 : _b.find((m) => m.name === moduleName);
    if (!module) return null;
    return (_d = (_c = module.functions) == null ? void 0 : _c.nodes) == null ? void 0 : _d.find((f) => f.name === functionName);
  }
  function getUsage(cmdIndex, allCommands) {
    let maxNestedIndex = -1;
    let usedAsResult = false;
    const checkArg = (arg) => {
      if (!arg) return;
      if (arg.Result === cmdIndex) {
        usedAsResult = true;
      }
      if (arg.NestedResult && arg.NestedResult[0] === cmdIndex) {
        maxNestedIndex = Math.max(maxNestedIndex, arg.NestedResult[1]);
      }
    };
    const traverse = (obj) => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        obj.forEach(traverse);
        return;
      }
      if (typeof obj === "object") {
        if ("Result" in obj || "NestedResult" in obj || "Input" in obj || "GasCoin" in obj) {
          checkArg(obj);
        }
        if (obj.$kind === "Result" || obj.$kind === "NestedResult") {
          if (obj.Result === cmdIndex) usedAsResult = true;
          if (obj.NestedResult && obj.NestedResult[0] === cmdIndex) {
            maxNestedIndex = Math.max(maxNestedIndex, obj.NestedResult[1]);
          }
          return;
        }
        Object.values(obj).forEach(traverse);
      }
    };
    for (let i = cmdIndex + 1; i < allCommands.length; i++) {
      traverse(allCommands[i]);
    }
    if (maxNestedIndex !== -1) {
      const segments = [{ type: "text", value: "-> (" }];
      for (let k = 0; k <= maxNestedIndex; k++) {
        if (k > 0) segments.push({ type: "text", value: ", " });
        segments.push({
          type: "result-def",
          value: `Result(${cmdIndex}, ${k})`,
          id: `result:${cmdIndex}:${k}`
        });
      }
      segments.push({ type: "text", value: ")" });
      return segments;
    }
    if (usedAsResult) {
      return [
        { type: "text", value: "-> " },
        {
          type: "result-def",
          value: `Result(${cmdIndex})`,
          id: `result:${cmdIndex}`
        }
      ];
    }
    return [];
  }
  function resolveArgument(arg, full = false, paramType = null) {
    if (arg === null || arg === void 0) return [{ type: "text", value: "undefined" }];
    if (typeof arg === "string") {
      if (arg === "GasCoin") {
        return [{ type: "text", value: "GasCoin" }];
      }
      return [{ type: "text", value: arg }];
    }
    let kind = arg.$kind;
    let value = arg;
    if (!kind) {
      if ("Input" in arg) {
        kind = "Input";
        value = arg.Input;
      } else if ("Result" in arg) {
        kind = "Result";
        value = arg.Result;
      } else if ("NestedResult" in arg) {
        kind = "NestedResult";
        value = arg.NestedResult;
      } else if ("GasCoin" in arg) {
        kind = "GasCoin";
        value = true;
      }
    } else {
      value = arg[kind];
    }
    const segments = [];
    if (paramType) {
      segments.push(...formatType(paramType, full, true));
      segments.push({ type: "text", value: ": " });
    }
    if (kind === "Input") {
      const inputIndex = value;
      const input = get(inputs)[inputIndex];
      if (!input) {
        segments.push({ type: "text", value: `Input(${inputIndex})` });
        return segments;
      }
      if (input.type === "object" && input.objectId) {
        const id = input.objectId;
        const trimmedId = trimAddress(id);
        const shortId = full ? trimmedId : get(shortPackageIds) && trimmedId.length > 9 ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}` : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;
        let prefix = "Object";
        let objectType = "Object";
        if (input.objectType === "immOrOwnedObject") {
          prefix = "ImmOrOwnedObject";
          objectType = "ImmOrOwnedObject";
        } else if (input.objectType === "sharedObject") {
          prefix = "SharedObject";
          objectType = "SharedObject";
        } else if (input.objectType === "receiving") {
          prefix = "Receiving";
          objectType = "Receiving";
        }
        segments.push({ type: "text", value: `${prefix}(` });
        segments.push({
          type: "object-id",
          value: shortId,
          id: `obj:${id}`,
          objectType
        });
        segments.push({ type: "text", value: ")" });
        return segments;
      }
      if (input.type === "pure" && input.value) {
        if (input.valueType) {
          segments.push({ type: "text", value: `Pure(${input.value})` });
        } else {
          const decodedValue = paramType ? decodePureValue(input.value, paramType) : null;
          if (decodedValue) {
            segments.push({ type: "text", value: `Pure(${decodedValue})` });
          } else {
            const valueStr = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
            const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
            segments.push({ type: "text", value: `Pure(${val})` });
          }
        }
        return segments;
      }
      let inputKind = input.$kind;
      let inputValue = input;
      if (!inputKind) {
        if ("Object" in input) {
          inputKind = "Object";
          inputValue = input.Object;
        } else if ("Pure" in input) {
          inputKind = "Pure";
          inputValue = input.Pure;
        }
      } else {
        inputValue = input[inputKind];
      }
      if (inputKind === "Object") {
        let obj = inputValue;
        if (obj.ImmOrOwnedObject) obj = obj.ImmOrOwnedObject;
        else if (obj.SharedObject) obj = obj.SharedObject;
        else if (obj.Receiving) obj = obj.Receiving;
        if (obj && obj.objectId) {
          const id = obj.objectId;
          const trimmedId = trimAddress(id);
          const shortId = full ? trimmedId : get(shortPackageIds) && trimmedId.length > 9 ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}` : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;
          let prefix = "Object";
          let objectType = "Object";
          if (inputValue.ImmOrOwnedObject || input.Object && input.Object.ImmOrOwnedObject) {
            prefix = "ImmOrOwnedObject";
            objectType = "ImmOrOwnedObject";
          } else if (inputValue.SharedObject || input.Object && input.Object.SharedObject) {
            prefix = "SharedObject";
            objectType = "SharedObject";
          } else if (inputValue.Receiving || input.Object && input.Object.Receiving) {
            prefix = "Receiving";
            objectType = "Receiving";
          }
          segments.push({ type: "text", value: `${prefix}(` });
          segments.push({
            type: "object-id",
            value: shortId,
            id: `obj:${id}`,
            objectType
          });
          segments.push({ type: "text", value: ")" });
          return segments;
        }
        segments.push({ type: "text", value: `Object(Input ${inputIndex})` });
        return segments;
      }
      if (inputKind === "Pure") {
        if (inputValue.bytes) {
          const decodedValue = paramType ? decodePureValue(inputValue.bytes, paramType) : null;
          if (decodedValue) {
            segments.push({ type: "text", value: `Pure(${decodedValue})` });
          } else {
            const val = full ? inputValue.bytes : `${inputValue.bytes.slice(0, 10)}...`;
            segments.push({ type: "text", value: `Pure(${val})` });
          }
          return segments;
        }
        segments.push({ type: "text", value: `Pure(Input ${inputIndex})` });
        return segments;
      }
      segments.push({ type: "text", value: `Input(${inputIndex})` });
      return segments;
    }
    if (kind === "Result") {
      segments.push({
        type: "result",
        value: `Result(${value})`,
        id: `result:${value}`
      });
      return segments;
    }
    if (kind === "NestedResult") {
      segments.push({
        type: "result",
        value: `Result(${value[0]}, ${value[1]})`,
        id: `result:${value[0]}:${value[1]}`
      });
      return segments;
    }
    if (kind === "GasCoin") {
      segments.push({ type: "text", value: "GasCoin" });
      return segments;
    }
    segments.push({ type: "text", value: JSON.stringify(arg) });
    return segments;
  }
  function formatType(type, full, interactive = true) {
    const segments = [];
    let refPrefix = "";
    let remainingType = type;
    if (type.startsWith("&mut ")) {
      refPrefix = "&mut ";
      remainingType = type.slice(5);
    } else if (type.startsWith("&")) {
      refPrefix = "&";
      remainingType = type.slice(1);
    }
    if (refPrefix) {
      segments.push({ type: "text", value: refPrefix });
    }
    const genericMatch = remainingType.match(/^([^<]+)<(.+)>$/);
    if (genericMatch) {
      const [_, baseType, innerTypes] = genericMatch;
      segments.push(...formatType(baseType, full, interactive));
      segments.push({ type: "text", value: "<" });
      let depth = 0;
      let current = "";
      const typeParams = [];
      for (let i = 0; i < innerTypes.length; i++) {
        const char = innerTypes[i];
        if (char === "<") depth++;
        else if (char === ">") depth--;
        else if (char === "," && depth === 0) {
          typeParams.push(current.trim());
          current = "";
          continue;
        }
        current += char;
      }
      if (current) typeParams.push(current.trim());
      typeParams.forEach((param, idx) => {
        if (idx > 0) segments.push({ type: "text", value: ", " });
        segments.push(...formatType(param, full, interactive));
      });
      segments.push({ type: "text", value: ">" });
      return segments;
    }
    const parts = remainingType.split("::");
    if (parts.length === 3) {
      const [pkg, mod, struct] = parts;
      let displayPkg = trimAddress(pkg);
      if (get(shortPackageIds) && displayPkg.length > 9) {
        displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
      }
      segments.push({
        type: "package",
        value: displayPkg,
        id: interactive ? `pkg:${pkg}::${mod}::${struct}` : void 0
      });
      segments.push({ type: "text", value: "::" });
      segments.push({
        type: "module",
        value: mod,
        id: interactive ? `mod:${pkg}::${mod}::${struct}` : void 0
      });
      segments.push({ type: "text", value: "::" });
      segments.push({
        type: "struct",
        value: struct,
        id: interactive ? `struct:${pkg}::${mod}::${struct}` : void 0
      });
    } else {
      segments.push({ type: "text", value: remainingType });
    }
    return segments;
  }
  function formatCommand(command, index2, full = false) {
    const kind = command.$kind || Object.keys(command)[0];
    const data = command[kind] || command;
    let segments = [];
    if (kind === "MoveCall") {
      const pkg = data.package;
      const mod = data.module;
      const fun = data.function;
      const typeArgs = data.typeArguments || [];
      const args = data.arguments || [];
      let displayPkg = trimAddress(pkg);
      if (get(shortPackageIds) && displayPkg.length > 9) {
        displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
      }
      segments.push({
        type: "package",
        value: displayPkg,
        id: `pkg:${pkg}::${mod}::${fun}`
      });
      segments.push({ type: "text", value: "::" });
      segments.push({ type: "module", value: mod, id: `mod:${pkg}::${mod}::${fun}` });
      segments.push({ type: "text", value: "::" });
      segments.push({
        type: "function",
        value: fun,
        id: `fun:${pkg}::${mod}::${fun}`
      });
      if (typeArgs.length > 0) {
        segments.push({ type: "text", value: "<" });
        typeArgs.forEach((typeArg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...formatType(typeArg, full));
        });
        segments.push({ type: "text", value: ">" });
      }
      segments.push({ type: "text", value: "(" });
      const funcInfo = getFunctionInfo(pkg, mod, fun);
      const paramTypes = (funcInfo == null ? void 0 : funcInfo.parameters) || [];
      if (full && args.length > 0) {
        segments.push({ type: "text", value: "\n    " });
        args.forEach((arg, i) => {
          var _a;
          if (i > 0) segments.push({ type: "text", value: ",\n    " });
          const paramType = ((_a = paramTypes[i]) == null ? void 0 : _a.repr) || null;
          segments.push(...resolveArgument(arg, full, paramType));
        });
        segments.push({ type: "text", value: "\n)" });
      } else {
        args.forEach((arg, i) => {
          var _a;
          if (i > 0) segments.push({ type: "text", value: ", " });
          const paramType = ((_a = paramTypes[i]) == null ? void 0 : _a.repr) || null;
          segments.push(...resolveArgument(arg, full, paramType));
        });
        segments.push({ type: "text", value: ")" });
      }
      if (funcInfo == null ? void 0 : funcInfo.return) {
        const returnTypes = funcInfo.return;
        if (Array.isArray(returnTypes) && returnTypes.length > 0) {
          segments.push({ type: "text", value: " -> " });
          const usage = getUsage(index2, get(commands));
          const hasNestedResults = usage.length > 0 && usage.some((s) => s.value.includes("Result("));
          if (hasNestedResults) {
            usage.forEach((seg, idx) => {
              if (seg.type === "text" && seg.value.includes("->")) {
                return;
              }
              if (seg.type === "result-def") {
                if (idx > 0 && usage[idx - 1].value !== "(" && !usage[idx - 1].value.includes("->")) segments.push({ type: "text", value: " " });
                segments.push(seg);
                const resultMatch = seg.value.match(/Result\((\d+)(?:, (\d+))?\)/);
                if (resultMatch) {
                  const nestedIdx = resultMatch[2] ? parseInt(resultMatch[2]) : null;
                  const typeInfo = nestedIdx !== null ? returnTypes[nestedIdx] : returnTypes[0];
                  if (typeInfo == null ? void 0 : typeInfo.repr) {
                    segments.push({ type: "text", value: ": " });
                    segments.push(...formatType(typeInfo.repr, full, true));
                  }
                }
              } else {
                segments.push(seg);
              }
            });
          } else {
            segments.push({
              type: "result-def",
              value: `Result(${index2})`,
              id: `result:${index2}`
            });
            segments.push({ type: "text", value: ": " });
            if (returnTypes.length === 1) {
              segments.push(...formatType(returnTypes[0].repr || "unknown", full, true));
            } else {
              segments.push({ type: "text", value: "(" });
              returnTypes.forEach((ret, i) => {
                if (i > 0) segments.push({ type: "text", value: ", " });
                segments.push(...formatType(ret.repr || "unknown", full, true));
              });
              segments.push({ type: "text", value: ")" });
            }
          }
        }
      } else {
        const usage = getUsage(index2, get(commands));
        if (usage.length > 0) {
          segments.push({ type: "text", value: " " });
          segments.push(...usage);
        }
      }
    } else if (kind === "TransferObjects") {
      const objects = Array.isArray(data) ? data[0] : data.objects || [];
      const addressArg = Array.isArray(data) ? data[1] : data.address;
      segments.push({ type: "text", value: "TransferObjects(" });
      if (full) {
        segments.push({ type: "text", value: "\n    [" });
        objects.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "],\n    " });
        segments.push(...resolveArgument(addressArg, full, "address"));
        segments.push({ type: "text", value: "\n)" });
      } else {
        segments.push({ type: "text", value: "[" });
        objects.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "], " });
        segments.push(...resolveArgument(addressArg, full, "address"));
        segments.push({ type: "text", value: ")" });
      }
    } else if (kind === "SplitCoins") {
      const coinArg = Array.isArray(data) ? data[0] : data.coin;
      const amounts = Array.isArray(data) ? data[1] : data.amounts || [];
      segments.push({ type: "text", value: "SplitCoins(" });
      if (full) {
        segments.push({ type: "text", value: "\n    " });
        segments.push(...resolveArgument(coinArg, full));
        segments.push({ type: "text", value: ",\n    [" });
        amounts.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full, "u64"));
        });
        segments.push({ type: "text", value: "]\n)" });
      } else {
        segments.push(...resolveArgument(coinArg, full));
        segments.push({ type: "text", value: ", [" });
        amounts.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full, "u64"));
        });
        segments.push({ type: "text", value: "])" });
      }
      const usage = getUsage(index2, get(commands));
      if (usage.length > 0) {
        segments.push({ type: "text", value: " " });
        segments.push(...usage);
      }
    } else if (kind === "MergeCoins") {
      const destArg = Array.isArray(data) ? data[0] : data.destination;
      const sources = Array.isArray(data) ? data[1] : data.sources || [];
      segments.push({ type: "text", value: "MergeCoins(" });
      if (full) {
        segments.push({ type: "text", value: "\n    " });
        segments.push(...resolveArgument(destArg, full));
        segments.push({ type: "text", value: ",\n    [" });
        sources.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "]\n)" });
      } else {
        segments.push(...resolveArgument(destArg, full));
        segments.push({ type: "text", value: ", [" });
        sources.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "])" });
      }
    } else if (kind === "Publish") {
      const modules = Array.isArray(data) ? data[0] : data.modules || [];
      const dependencies = Array.isArray(data) ? data[1] : data.dependencies || [];
      segments.push({ type: "text", value: "Publish(" });
      if (full) {
        segments.push({ type: "text", value: "\n    [" });
        if (Array.isArray(modules)) {
          modules.forEach((module, i) => {
            if (i > 0) segments.push({ type: "text", value: ", " });
            segments.push({ type: "text", value: `"${module}"` });
          });
        } else {
          segments.push({ type: "text", value: `"${modules}"` });
        }
        segments.push({ type: "text", value: "],\n    [" });
        if (Array.isArray(dependencies)) {
          dependencies.forEach((dep, i) => {
            if (i > 0) segments.push({ type: "text", value: ", " });
            segments.push({ type: "text", value: `"${dep}"` });
          });
        } else {
          segments.push({ type: "text", value: `"${dependencies}"` });
        }
        segments.push({ type: "text", value: "]\n)" });
      } else {
        segments.push({ type: "text", value: "[" });
        if (Array.isArray(modules)) {
          modules.forEach((module, i) => {
            if (i > 0) segments.push({ type: "text", value: ", " });
            segments.push({ type: "text", value: `"${module.slice(0, 10)}..."` });
          });
        } else {
          segments.push({ type: "text", value: `"${modules.slice(0, 10)}..."` });
        }
        segments.push({ type: "text", value: "], [" });
        if (Array.isArray(dependencies)) {
          dependencies.forEach((dep, i) => {
            if (i > 0) segments.push({ type: "text", value: ", " });
            segments.push({ type: "text", value: `"${dep.slice(0, 10)}..."` });
          });
        } else {
          segments.push({ type: "text", value: `"${dependencies.slice(0, 10)}..."` });
        }
        segments.push({ type: "text", value: "])" });
      }
    } else if (kind === "MakeMoveVec") {
      const type = data.type || "Unknown";
      const elements = data.elements || [];
      segments.push({ type: "text", value: "MakeMoveVec<" });
      segments.push(...formatType(type, full));
      segments.push({ type: "text", value: ">(" });
      if (full && elements.length > 0) {
        segments.push({ type: "text", value: "\n    [" });
        elements.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "]\n)" });
      } else {
        segments.push({ type: "text", value: "[" });
        elements.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          segments.push(...resolveArgument(arg, full));
        });
        segments.push({ type: "text", value: "])" });
      }
    } else if (kind === "Upgrade") {
      segments.push({ type: "text", value: "Upgrade(...)" });
    } else {
      segments.push({ type: "text", value: `${kind}(...)` });
    }
    return segments;
  }
  function getUniquePackages() {
    const packages = /* @__PURE__ */ new Set();
    get(commands).forEach((cmd) => {
      const kind = cmd.$kind || Object.keys(cmd)[0];
      if (kind === "MoveCall") {
        const data = cmd[kind] || cmd;
        if (data.package) {
          packages.add(data.package);
        }
      }
    });
    return Array.from(packages);
  }
  function hasPackagesCached() {
    const packages = getUniquePackages();
    return packages.length > 0 && packages.every((pkg) => packageCache[pkg]);
  }
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_10 = ($$anchor2) => {
      var div = root_1$2();
      var div_1 = child(div);
      var div_2 = child(div_1);
      var button = child(div_2);
      button.__click = [expandAll, commands, expandedCommands];
      var button_1 = sibling(button, 2);
      button_1.__click = [collapseAll, expandedCommands];
      var div_3 = sibling(div_2, 4);
      var button_2 = child(div_3);
      button_2.__click = [loadAllPackages, getUniquePackages, fetchPackageInfo];
      var node_1 = child(button_2);
      {
        var consequent = ($$anchor3) => {
          var text$1 = text("Loading...");
          append($$anchor3, text$1);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_2 = first_child(fragment_1);
          {
            var consequent_1 = ($$anchor4) => {
              var text_1 = text("Type info fetched ✓");
              append($$anchor4, text_1);
            };
            var alternate = ($$anchor4) => {
              var text_2 = text("Fetch Type Info");
              append($$anchor4, text_2);
            };
            if_block(
              node_2,
              ($$render) => {
                if (hasPackagesCached()) $$render(consequent_1);
                else $$render(alternate, false);
              },
              true
            );
          }
          append($$anchor3, fragment_1);
        };
        if_block(node_1, ($$render) => {
          if (Object.keys(loadingPackages).some((k) => loadingPackages[k])) $$render(consequent);
          else $$render(alternate_1, false);
        });
      }
      var label = sibling(button_2, 2);
      var div_4 = sibling(child(label), 2);
      var input_1 = child(div_4);
      var label_1 = sibling(label, 2);
      var div_5 = sibling(child(label_1), 2);
      var input_2 = child(div_5);
      var node_3 = sibling(div_1, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var div_6 = root_6$2();
          var node_4 = sibling(child(div_6), 2);
          each(node_4, 17, () => Object.entries(packageErrors).filter(([_, err]) => err), index, ($$anchor4, $$item) => {
            var $$array = user_derived(() => to_array(get($$item), 2));
            let pkg = () => get($$array)[0];
            let err = () => get($$array)[1];
            var div_7 = root_7$2();
            var text_3 = child(div_7);
            template_effect(() => set_text(text_3, `${pkg() ?? ""}: ${err() ?? ""}`));
            append($$anchor4, div_7);
          });
          append($$anchor3, div_6);
        };
        if_block(node_3, ($$render) => {
          if (Object.keys(packageErrors).some((k) => packageErrors[k])) $$render(consequent_2);
        });
      }
      var node_5 = sibling(node_3, 2);
      each(node_5, 17, () => get(commands), index, ($$anchor3, command, i) => {
        var div_8 = root_8$1();
        const formattedSegments = user_derived(() => formatCommand(get(command), i, get(expandedCommands)[i]));
        const arrowIndex = user_derived(() => get(formattedSegments).findIndex((s) => s.type === "text" && s.value.includes(" -> ")));
        var span = child(div_8);
        span.textContent = i;
        var button_3 = sibling(span, 2);
        button_3.__click = () => toggle(i);
        var text_4 = child(button_3);
        var div_9 = sibling(button_3, 2);
        var span_1 = child(div_9);
        each(
          span_1,
          21,
          () => get(formattedSegments).slice(0, get(arrowIndex) === -1 ? get(formattedSegments).length : get(arrowIndex) + 1),
          index,
          ($$anchor4, segment) => {
            var fragment_2 = comment();
            var node_6 = first_child(fragment_2);
            {
              var consequent_3 = ($$anchor5) => {
                var text_5 = text();
                template_effect(() => set_text(text_5, get(segment).value));
                append($$anchor5, text_5);
              };
              var alternate_4 = ($$anchor5) => {
                var fragment_4 = comment();
                var node_7 = first_child(fragment_4);
                {
                  var consequent_4 = ($$anchor6) => {
                    var a = root_12$1();
                    const packageId = user_derived(() => {
                      var _a;
                      return ((_a = get(segment).id) == null ? void 0 : _a.split("::")[0].replace("pkg:", "")) ?? "";
                    });
                    let classes;
                    a.__mouseover = [on_mouseover, hoveredId, segment];
                    a.__mouseout = [on_mouseout, hoveredId];
                    var text_6 = child(a);
                    template_effect(
                      ($0, $1) => {
                        set_attribute(a, "href", $0);
                        classes = set_class(a, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-1pp25kq", classes, $1);
                        set_attribute(a, "title", get(packageId));
                        set_text(text_6, get(segment).value);
                      },
                      [
                        () => getObjectLink(getSelectedNetworkConfig(), get(packageId)),
                        () => ({
                          highlighted: isHighlighted(get(segment).id, get(hoveredId))
                        })
                      ]
                    );
                    append($$anchor6, a);
                  };
                  var alternate_3 = ($$anchor6) => {
                    var fragment_5 = comment();
                    var node_8 = first_child(fragment_5);
                    {
                      var consequent_5 = ($$anchor7) => {
                        var a_1 = root_14$2();
                        const objectId = user_derived(() => {
                          var _a;
                          return ((_a = get(segment).id) == null ? void 0 : _a.replace("obj:", "")) ?? "";
                        });
                        let classes_1;
                        a_1.__mouseover = [on_mouseover_1, hoveredId, segment];
                        a_1.__mouseout = [on_mouseout_1, hoveredId];
                        var text_7 = child(a_1);
                        template_effect(
                          ($0, $1) => {
                            set_attribute(a_1, "href", $0);
                            classes_1 = set_class(a_1, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-1pp25kq", classes_1, $1);
                            set_attribute(a_1, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
                            set_text(text_7, get(segment).value);
                          },
                          [
                            () => getObjectLink(getSelectedNetworkConfig(), get(objectId)),
                            () => ({
                              highlighted: isHighlighted(get(segment).id, get(hoveredId))
                            })
                          ]
                        );
                        append($$anchor7, a_1);
                      };
                      var alternate_2 = ($$anchor7) => {
                        var span_2 = root_15$1();
                        let classes_2;
                        span_2.__mouseover = [on_mouseover_2, hoveredId, segment];
                        span_2.__mouseout = [on_mouseout_2, hoveredId];
                        var text_8 = child(span_2);
                        template_effect(
                          ($0) => {
                            classes_2 = set_class(span_2, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-1pp25kq", classes_2, $0);
                            set_text(text_8, get(segment).value);
                          },
                          [
                            () => ({
                              highlighted: isHighlighted(get(segment).id, get(hoveredId))
                            })
                          ]
                        );
                        append($$anchor7, span_2);
                      };
                      if_block(
                        node_8,
                        ($$render) => {
                          if (get(segment).type === "object-id") $$render(consequent_5);
                          else $$render(alternate_2, false);
                        },
                        true
                      );
                    }
                    append($$anchor6, fragment_5);
                  };
                  if_block(
                    node_7,
                    ($$render) => {
                      if (get(segment).type === "package") $$render(consequent_4);
                      else $$render(alternate_3, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_4);
              };
              if_block(node_6, ($$render) => {
                if (get(segment).type === "text") $$render(consequent_3);
                else $$render(alternate_4, false);
              });
            }
            append($$anchor4, fragment_2);
          }
        );
        var node_9 = sibling(span_1, 2);
        {
          var consequent_9 = ($$anchor4) => {
            var span_3 = root_16();
            let classes_3;
            each(span_3, 21, () => get(formattedSegments).slice(get(arrowIndex) + 1), index, ($$anchor5, segment) => {
              var fragment_6 = comment();
              var node_10 = first_child(fragment_6);
              {
                var consequent_6 = ($$anchor6) => {
                  var text_9 = text();
                  template_effect(() => set_text(text_9, get(segment).value));
                  append($$anchor6, text_9);
                };
                var alternate_7 = ($$anchor6) => {
                  var fragment_8 = comment();
                  var node_11 = first_child(fragment_8);
                  {
                    var consequent_7 = ($$anchor7) => {
                      var a_2 = root_20$1();
                      const packageId = user_derived(() => {
                        var _a;
                        return ((_a = get(segment).id) == null ? void 0 : _a.split("::")[0].replace("pkg:", "")) ?? "";
                      });
                      let classes_4;
                      a_2.__mouseover = [on_mouseover_3, hoveredId, segment];
                      a_2.__mouseout = [on_mouseout_3, hoveredId];
                      var text_10 = child(a_2);
                      template_effect(
                        ($0, $1) => {
                          set_attribute(a_2, "href", $0);
                          classes_4 = set_class(a_2, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-1pp25kq", classes_4, $1);
                          set_attribute(a_2, "title", get(packageId));
                          set_text(text_10, get(segment).value);
                        },
                        [
                          () => getObjectLink(getSelectedNetworkConfig(), get(packageId)),
                          () => ({
                            highlighted: isHighlighted(get(segment).id, get(hoveredId))
                          })
                        ]
                      );
                      append($$anchor7, a_2);
                    };
                    var alternate_6 = ($$anchor7) => {
                      var fragment_9 = comment();
                      var node_12 = first_child(fragment_9);
                      {
                        var consequent_8 = ($$anchor8) => {
                          var a_3 = root_22$1();
                          const objectId = user_derived(() => {
                            var _a;
                            return ((_a = get(segment).id) == null ? void 0 : _a.replace("obj:", "")) ?? "";
                          });
                          let classes_5;
                          a_3.__mouseover = [on_mouseover_4, hoveredId, segment];
                          a_3.__mouseout = [on_mouseout_4, hoveredId];
                          var text_11 = child(a_3);
                          template_effect(
                            ($0, $1) => {
                              set_attribute(a_3, "href", $0);
                              classes_5 = set_class(a_3, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-1pp25kq", classes_5, $1);
                              set_attribute(a_3, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
                              set_text(text_11, get(segment).value);
                            },
                            [
                              () => getObjectLink(getSelectedNetworkConfig(), get(objectId)),
                              () => ({
                                highlighted: isHighlighted(get(segment).id, get(hoveredId))
                              })
                            ]
                          );
                          append($$anchor8, a_3);
                        };
                        var alternate_5 = ($$anchor8) => {
                          var span_4 = root_23$1();
                          let classes_6;
                          span_4.__mouseover = [on_mouseover_5, hoveredId, segment];
                          span_4.__mouseout = [on_mouseout_5, hoveredId];
                          var text_12 = child(span_4);
                          template_effect(
                            ($0) => {
                              classes_6 = set_class(span_4, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-1pp25kq", classes_6, $0);
                              set_text(text_12, get(segment).value);
                            },
                            [
                              () => ({
                                highlighted: isHighlighted(get(segment).id, get(hoveredId))
                              })
                            ]
                          );
                          append($$anchor8, span_4);
                        };
                        if_block(
                          node_12,
                          ($$render) => {
                            if (get(segment).type === "object-id") $$render(consequent_8);
                            else $$render(alternate_5, false);
                          },
                          true
                        );
                      }
                      append($$anchor7, fragment_9);
                    };
                    if_block(
                      node_11,
                      ($$render) => {
                        if (get(segment).type === "package") $$render(consequent_7);
                        else $$render(alternate_6, false);
                      },
                      true
                    );
                  }
                  append($$anchor6, fragment_8);
                };
                if_block(node_10, ($$render) => {
                  if (get(segment).type === "text") $$render(consequent_6);
                  else $$render(alternate_7, false);
                });
              }
              append($$anchor5, fragment_6);
            });
            template_effect(($0) => classes_3 = set_class(span_3, 1, "command-result svelte-1pp25kq", null, classes_3, $0), [
              () => {
                var _a;
                return {
                  "highlighted-row": (_a = get(hoveredId)) == null ? void 0 : _a.startsWith("result:" + i)
                };
              }
            ]);
            append($$anchor4, span_3);
          };
          if_block(node_9, ($$render) => {
            if (get(arrowIndex) !== -1) $$render(consequent_9);
          });
        }
        template_effect(() => set_text(text_4, get(expandedCommands)[i] ? "▼" : "▶"));
        append($$anchor3, div_8);
      });
      template_effect(($0) => button_2.disabled = $0, [
        () => Object.keys(loadingPackages).some((k) => loadingPackages[k]) || hasPackagesCached()
      ]);
      bind_checked(input_1, () => get(showTypeInfo), ($$value) => set(showTypeInfo, $$value));
      bind_checked(input_2, () => get(shortPackageIds), ($$value) => set(shortPackageIds, $$value));
      append($$anchor2, div);
    };
    var alternate_8 = ($$anchor2) => {
      var div_10 = root_24$1();
      append($$anchor2, div_10);
    };
    if_block(node, ($$render) => {
      if (get(commands).length > 0) $$render(consequent_10);
      else $$render(alternate_8, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["click", "mouseover", "mouseout"]);
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
  const wrap = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode = args.map((x) => x.decode).reduce(wrap, id);
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
function join(separator = "") {
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
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
const powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function convertRadix2(data, from, to, padding) {
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
  if (!padding && pos >= from)
    throw new Error("Excess padding");
  if (!padding && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0)
    res.push(carry >>> 0);
  return res;
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
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
const BECH_ALPHABET = /* @__PURE__ */ chain(/* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ join(""));
const POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
// @__NO_SIDE_EFFECTS__
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = /* @__PURE__ */ radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (isBytes(words))
      words = Array.from(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(data).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const { prefix, words } = decode(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode(prefix, toWords(bytes));
  }
  return {
    encode,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
const bech32 = /* @__PURE__ */ genBech32("bech32");
function bytesToUtf8(bytes) {
  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Invalid UTF-8";
  }
}
function bcsBytesToInteger(bytes) {
  try {
    const length = bytes.length;
    let type;
    let value;
    switch (length) {
      case 1:
        type = "u8";
        value = bcs.u8().parse(new Uint8Array(bytes)).toString();
        break;
      case 2:
        type = "u16";
        value = bcs.u16().parse(new Uint8Array(bytes)).toString();
        break;
      case 4:
        type = "u32";
        value = bcs.u32().parse(new Uint8Array(bytes)).toString();
        break;
      case 8:
        type = "u64";
        value = bcs.u64().parse(new Uint8Array(bytes)).toString();
        break;
      case 16:
        type = "u128";
        value = bcs.u128().parse(new Uint8Array(bytes)).toString();
        break;
      case 32:
        type = "u256";
        value = bcs.u256().parse(new Uint8Array(bytes)).toString();
        break;
      default:
        if (length <= 8) {
          type = `u${length * 8}`;
          try {
            value = bcs.u64().parse(new Uint8Array(bytes.slice(0, 8))).toString();
          } catch {
            value = `Raw bytes (${length} bytes)`;
          }
        } else {
          type = `bytes(${length})`;
          value = `Raw bytes (${length} bytes)`;
        }
    }
    return { type, value };
  } catch {
    return { type: `bytes(${bytes.length})`, value: "Invalid integer" };
  }
}
function decodeBase64Bytes(base64) {
  try {
    const bytes = fromB64(base64);
    const utf8 = bytesToUtf8(bytes);
    const integer = bcsBytesToInteger(bytes);
    return { bytes, utf8, integer };
  } catch {
    return null;
  }
}
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    const int = parseInt(hex.substr(c, 2), 16);
    bytes.push(int);
  }
  return bytes;
}
const TRYTE_ALPHABET = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const B1T6_TRYTE_VALUE_TO_TRITS = [
  [-1, -1, -1],
  [0, -1, -1],
  [1, -1, -1],
  [-1, 0, -1],
  [0, 0, -1],
  [1, 0, -1],
  [-1, 1, -1],
  [0, 1, -1],
  [1, 1, -1],
  [-1, -1, 0],
  [0, -1, 0],
  [1, -1, 0],
  [-1, 0, 0],
  [0, 0, 0],
  [1, 0, 0],
  [-1, 1, 0],
  [0, 1, 0],
  [1, 1, 0],
  [-1, -1, 1],
  [0, -1, 1],
  [1, -1, 1],
  [-1, 0, 1],
  [0, 0, 1],
  [1, 0, 1],
  [-1, 1, 1],
  [0, 1, 1],
  [1, 1, 1]
];
const TRYTES_TRITS_LUT = [
  [0, 0, 0],
  [1, 0, 0],
  [-1, 1, 0],
  [0, 1, 0],
  [1, 1, 0],
  [-1, -1, 1],
  [0, -1, 1],
  [1, -1, 1],
  [-1, 0, 1],
  [0, 0, 1],
  [1, 0, 1],
  [-1, 1, 1],
  [0, 1, 1],
  [1, 1, 1],
  [-1, -1, -1],
  [0, -1, -1],
  [1, -1, -1],
  [-1, 0, -1],
  [0, 0, -1],
  [1, 0, -1],
  [-1, 1, -1],
  [0, 1, -1],
  [1, 1, -1],
  [-1, -1, 0],
  [0, -1, 0],
  [1, -1, 0],
  [-1, 0, 0]
];
const B1T6_VALUE_TO_CHAR = B1T6_TRYTE_VALUE_TO_TRITS.map((pattern) => {
  const idx = TRYTES_TRITS_LUT.findIndex(
    (tritsPattern) => tritsPattern[0] === pattern[0] && tritsPattern[1] === pattern[1] && tritsPattern[2] === pattern[2]
  );
  if (idx === -1) {
    throw new Error("Unable to build b1t6 lookup table.");
  }
  return TRYTE_ALPHABET.charAt(idx);
});
const B1T6_CHAR_TO_VALUE = {};
for (let i = 0; i < B1T6_VALUE_TO_CHAR.length; i++) {
  B1T6_CHAR_TO_VALUE[B1T6_VALUE_TO_CHAR[i]] = i;
}
const TRANSFER_PREFIX = "TRANSFER";
const TRANSFER_SUFFIX = "9";
const ED25519_ADDRESS_SIZE = 32;
const CHECKSUM_SIZE = 4;
const MIGRATION_ADDRESS_LENGTH = 81;
function blake2b256(data) {
  return new Uint8Array(blake2b(data, { dkLen: 32 }));
}
function b1t6EncodeToTrytes(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    const int8 = data[i] << 24 >> 24;
    const value = int8 + 364;
    const low = value % 27;
    const high = Math.trunc(value / 27);
    result += B1T6_VALUE_TO_CHAR[low] + B1T6_VALUE_TO_CHAR[high];
  }
  return result;
}
function b1t6DecodeTrytes(trytes) {
  if (trytes.length % 2 !== 0) {
    throw new Error("Invalid trytes length. Expected an even length.");
  }
  const bytes = new Uint8Array(trytes.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const low = B1T6_CHAR_TO_VALUE[trytes.charAt(i * 2)];
    const high = B1T6_CHAR_TO_VALUE[trytes.charAt(i * 2 + 1)];
    if (low === void 0 || high === void 0) {
      throw new Error("Invalid trytes.");
    }
    const value = low + high * 27;
    let signed = value - 364;
    if (signed < 0) {
      signed += 256;
    }
    bytes[i] = signed;
  }
  return bytes;
}
function normalizeMigrationAddress(ternaryAddr) {
  if (ternaryAddr.length === MIGRATION_ADDRESS_LENGTH + 9) {
    return ternaryAddr.slice(0, MIGRATION_ADDRESS_LENGTH);
  }
  if (ternaryAddr.length !== MIGRATION_ADDRESS_LENGTH) {
    throw new Error(
      `Invalid migration address length: expected ${MIGRATION_ADDRESS_LENGTH} or ${MIGRATION_ADDRESS_LENGTH + 9}, got ${ternaryAddr.length}.`
    );
  }
  return ternaryAddr;
}
function extractEd25519Address(ternaryAddr) {
  const migrationAddr = normalizeMigrationAddress(ternaryAddr);
  if (!migrationAddr.startsWith(TRANSFER_PREFIX)) {
    throw new Error(`Invalid prefix: expected '${TRANSFER_PREFIX}'.`);
  }
  if (!migrationAddr.endsWith(TRANSFER_SUFFIX)) {
    throw new Error(`Invalid suffix: expected '${TRANSFER_SUFFIX}'.`);
  }
  const middleTrytes = migrationAddr.slice(TRANSFER_PREFIX.length, -TRANSFER_SUFFIX.length);
  const decoded = b1t6DecodeTrytes(middleTrytes);
  if (decoded.length !== ED25519_ADDRESS_SIZE + CHECKSUM_SIZE) {
    throw new Error(
      `Invalid decoded length: expected ${ED25519_ADDRESS_SIZE + CHECKSUM_SIZE}, got ${decoded.length}.`
    );
  }
  const ed25519Address = decoded.slice(0, ED25519_ADDRESS_SIZE);
  const checksum = decoded.slice(ED25519_ADDRESS_SIZE);
  const expectedChecksum = blake2b256(ed25519Address).slice(0, CHECKSUM_SIZE);
  for (let i = 0; i < CHECKSUM_SIZE; i++) {
    if (checksum[i] !== expectedChecksum[i]) {
      throw new Error("Invalid checksum for migration address.");
    }
  }
  return ed25519Address;
}
function encodeMigrationAddress(ed25519Address) {
  if (ed25519Address.length !== ED25519_ADDRESS_SIZE) {
    throw new Error(`Expected ${ED25519_ADDRESS_SIZE} bytes for an Ed25519 address.`);
  }
  const hash = blake2b256(ed25519Address);
  const addressWithChecksum = new Uint8Array(ED25519_ADDRESS_SIZE + CHECKSUM_SIZE);
  addressWithChecksum.set(ed25519Address, 0);
  addressWithChecksum.set(hash.slice(0, CHECKSUM_SIZE), ED25519_ADDRESS_SIZE);
  return TRANSFER_PREFIX + b1t6EncodeToTrytes(addressWithChecksum) + TRANSFER_SUFFIX;
}
function bytesToHex(bytes, withPrefix = true) {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return withPrefix ? `0x${hex}` : hex;
}
function bech32ToTernary(bech32Addr) {
  const decoded = bech32.decode(bech32Addr, 90);
  const payload = new Uint8Array(bech32.fromWords(decoded.words));
  let ed25519Address;
  if (payload.length === ED25519_ADDRESS_SIZE + 1) {
    if (payload[0] !== 0) {
      throw new Error(`Unsupported address type byte: ${payload[0]}.`);
    }
    ed25519Address = payload.slice(1);
  } else if (payload.length === ED25519_ADDRESS_SIZE) {
    ed25519Address = payload;
  } else {
    throw new Error(
      `Invalid Ed25519 address size: expected ${ED25519_ADDRESS_SIZE} or ${ED25519_ADDRESS_SIZE + 1}, got ${payload.length}.`
    );
  }
  return encodeMigrationAddress(ed25519Address);
}
function ternaryToBech32(ternaryAddr, hrp = "iota") {
  const ed25519Address = extractEd25519Address(ternaryAddr);
  const payloadWithType = new Uint8Array(1 + ED25519_ADDRESS_SIZE);
  payloadWithType[0] = 0;
  payloadWithType.set(ed25519Address, 1);
  return bech32.encode(hrp, bech32.toWords(payloadWithType));
}
function ed25519HexToTernary(hexAddress) {
  const normalizedHex = hexAddress.toLowerCase().startsWith("0x") ? hexAddress.slice(2) : hexAddress;
  const ed25519Address = hexToBytes(normalizedHex);
  if (ed25519Address.length !== ED25519_ADDRESS_SIZE) {
    throw new Error(
      `Invalid Ed25519 hex length: expected ${ED25519_ADDRESS_SIZE * 2} hex chars.`
    );
  }
  return encodeMigrationAddress(new Uint8Array(ed25519Address));
}
function ternaryToEd25519Hex(ternaryAddr) {
  const ed25519Address = extractEd25519Address(ternaryAddr);
  return bytesToHex(ed25519Address);
}
var root_2$1 = from_html(`<span class="time-info svelte-a1c9r5"> </span>`);
var root_3$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="field-value link-style svelte-a1c9r5"> </a>`);
var root_4$1 = from_html(`<span class="field-value svelte-a1c9r5">N/A</span>`);
var root_5$1 = from_html(`<div class="fee-main"><span class="field-label svelte-a1c9r5">Fee:</span> <span class="gas-fee svelte-a1c9r5"> </span> <span class="field-label svelte-a1c9r5">Storage cost:</span> <span class="field-value svelte-a1c9r5"> </span> <span class="field-label svelte-a1c9r5">Rebate:</span> <span class="field-value svelte-a1c9r5"> </span></div>`);
var root_8 = from_html(`<a target="_blank" rel="noopener noreferrer" class="full-address link-style svelte-a1c9r5"> </a>`);
var root_9$1 = from_html(`<div class="full-address svelte-a1c9r5">N/A</div>`);
var root_7$1 = from_html(`<div class="balance-box negative svelte-a1c9r5"><!> <div class="amount-value svelte-a1c9r5"> </div></div>`);
var root_11$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="full-address link-style svelte-a1c9r5"> </a>`);
var root_12 = from_html(`<div class="full-address svelte-a1c9r5">N/A</div>`);
var root_10 = from_html(`<div class="balance-box positive svelte-a1c9r5"><!> <div class="amount-value svelte-a1c9r5"> </div></div>`);
var root_6$1 = from_html(`<div class="section svelte-a1c9r5"><h4 class="svelte-a1c9r5"> </h4> <div class="balance-columns svelte-a1c9r5"><div class="negative-changes svelte-a1c9r5"><h5 class="column-header deleted svelte-a1c9r5"> </h5> <div class="balance-content svelte-a1c9r5"></div></div> <div class="positive-changes svelte-a1c9r5"><h5 class="column-header created svelte-a1c9r5"> </h5> <div class="balance-content svelte-a1c9r5"></div></div></div></div>`);
var root_15 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a>`);
var root_17 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a>`);
var root_18 = from_html(`<div class="object-type svelte-a1c9r5"> </div>`);
var root_19 = from_html(`<div class="object-version svelte-a1c9r5"> </div>`);
var root_20 = from_html(`<div class="object-sender svelte-a1c9r5"> </div>`);
var root_21 = from_html(`<details class="state-collapsible svelte-a1c9r5" open><summary class="state-summary svelte-a1c9r5">Previous State:</summary> <div class="object-json svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></details>`);
var root_14$1 = from_html(`<div class="object-box deleted svelte-a1c9r5"><!> <!> <!> <!> <!></div>`);
var root_24 = from_html(`<details class="state-collapsible svelte-a1c9r5"><summary class="state-summary svelte-a1c9r5">Previous State:</summary> <div class="object-json svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></details>`);
var root_23 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a> <!> <details class="state-collapsible svelte-a1c9r5" open><summary class="state-summary svelte-a1c9r5">Current State:</summary> <div class="object-json svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></details>`, 1);
var root_27 = from_html(`<div class="object-type svelte-a1c9r5"> </div>`);
var root_28 = from_html(`<div class="object-owner svelte-a1c9r5"> </div>`);
var root_29 = from_html(`<div class="object-version svelte-a1c9r5"> </div>`);
var root_30 = from_html(`<div class="object-previous-version svelte-a1c9r5"> </div>`);
var root_26 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a> <!> <!> <!> <!>`, 1);
var root_32 = from_html(`<details class="state-collapsible svelte-a1c9r5"><summary class="state-summary svelte-a1c9r5">Previous State:</summary> <div class="object-json svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></details>`);
var root_31 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a> <!>`, 1);
var root_22 = from_html(`<div class="object-box mutated svelte-a1c9r5"><!></div>`);
var root_34 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a> <details class="state-collapsible svelte-a1c9r5" open><summary class="state-summary svelte-a1c9r5">Object State:</summary> <div class="object-json svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></details>`, 1);
var root_37 = from_html(`<div class="object-type svelte-a1c9r5"> </div>`);
var root_38 = from_html(`<div class="object-owner svelte-a1c9r5"> </div>`);
var root_39 = from_html(`<div class="object-version svelte-a1c9r5"> </div>`);
var root_36 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a> <!> <!> <!>`, 1);
var root_40 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-a1c9r5"> </a>`);
var root_33 = from_html(`<div class="object-box created svelte-a1c9r5"><!></div>`);
var root_13$1 = from_html(`<div class="section svelte-a1c9r5"><h4 class="svelte-a1c9r5"> </h4> <div class="object-columns-three svelte-a1c9r5"><div class="deleted-objects svelte-a1c9r5"><h5 class="column-header deleted svelte-a1c9r5"> </h5> <div class="object-content svelte-a1c9r5"></div></div> <div class="mutated-objects svelte-a1c9r5"><h5 class="column-header mutated svelte-a1c9r5"> </h5> <div class="object-content svelte-a1c9r5"></div></div> <div class="created-objects svelte-a1c9r5"><h5 class="column-header created svelte-a1c9r5"> </h5> <div class="object-content svelte-a1c9r5"></div></div></div></div>`);
var root_43 = from_html(`<pre class="event-data svelte-a1c9r5"> </pre>`);
var root_42 = from_html(`<div class="event-item svelte-a1c9r5"><span class="event-index svelte-a1c9r5"></span> <span class="event-type svelte-a1c9r5"> </span> <!></div>`);
var root_41 = from_html(`<div class="section svelte-a1c9r5"><details class="events-collapsible svelte-a1c9r5"><summary class="svelte-a1c9r5"> </summary> <div class="events-content"></div></details></div>`);
var root_46 = from_html(`<pre class="svelte-a1c9r5"> </pre>`);
var root_47 = from_html(`<pre class="svelte-a1c9r5"> </pre>`);
var root_45 = from_html(`<div class="command-item svelte-a1c9r5"><span class="command-index svelte-a1c9r5"></span> <span class="command-kind svelte-a1c9r5"> </span> <div class="command-data svelte-a1c9r5"><!></div></div>`);
var root_44 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5"> </span> <div class="commands-list svelte-a1c9r5"></div></div>`);
var root_52 = from_html(`<pre class="svelte-a1c9r5"> </pre>`);
var root_53 = from_html(`<pre class="svelte-a1c9r5"> </pre>`);
var root_54 = from_html(`<pre class="svelte-a1c9r5"> </pre>`);
var root_50 = from_html(`<div class="command-item svelte-a1c9r5"><span class="command-index svelte-a1c9r5"></span> <span class="command-kind svelte-a1c9r5"> </span> <div class="command-data svelte-a1c9r5"><!></div></div>`);
var root_49 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5"> </span> <div class="commands-list svelte-a1c9r5"></div></div>`);
var root_58 = from_html(`<div class="decoded-bytes svelte-a1c9r5"><div class="decoded-item svelte-a1c9r5"><span class="decode-label svelte-a1c9r5">UTF-8:</span> <span class="decode-value svelte-a1c9r5"> </span></div> <div class="decoded-item svelte-a1c9r5"><span class="decode-label svelte-a1c9r5"> </span> <span class="decode-value svelte-a1c9r5"> </span></div> <div class="decoded-item svelte-a1c9r5"><span class="decode-label svelte-a1c9r5">Bytes:</span> <span class="decode-value svelte-a1c9r5"> </span></div></div>`);
var root_56 = from_html(`<div class="input-item svelte-a1c9r5"><span class="input-index svelte-a1c9r5"></span> <span class="input-kind svelte-a1c9r5"> </span> <div class="input-data svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre> <!></div></div>`);
var root_55 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5">Inputs:</span> <div class="inputs-list svelte-a1c9r5"></div></div>`);
var root_61 = from_html(`<div class="input-item svelte-a1c9r5"><span class="input-index svelte-a1c9r5"></span> <span class="input-kind svelte-a1c9r5"> </span> <div class="input-data svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></div>`);
var root_60 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5">Inputs:</span> <div class="inputs-list svelte-a1c9r5"></div></div>`);
var root_65 = from_html(`<span class="separator svelte-a1c9r5">,</span>`);
var root_64 = from_html(`<span class="payment-object svelte-a1c9r5"> </span> <!>`, 1);
var root_62 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5">Gas Data:</span> <div class="gas-info svelte-a1c9r5"><div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Payment:</span> <span class="field-value svelte-a1c9r5"><!></span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Owner:</span> <span class="field-value svelte-a1c9r5"> </span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Price:</span> <span class="field-value svelte-a1c9r5"> </span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Budget:</span> <span class="field-value svelte-a1c9r5"> </span></div></div></div>`);
var root_71 = from_html(`<span class="separator svelte-a1c9r5">,</span>`);
var root_70 = from_html(`<span class="payment-object svelte-a1c9r5"> </span> <!>`, 1);
var root_68 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5">Gas Data:</span> <div class="gas-info svelte-a1c9r5"><div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Payment:</span> <span class="field-value svelte-a1c9r5"><!></span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Owner:</span> <span class="field-value svelte-a1c9r5"> </span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Price:</span> <span class="field-value svelte-a1c9r5"> </span></div> <div class="gas-field svelte-a1c9r5"><span class="field-label svelte-a1c9r5">Budget:</span> <span class="field-value svelte-a1c9r5"> </span></div></div></div>`);
var root_77 = from_html(`<div class="output-bytes svelte-a1c9r5"><span class="bytes-label svelte-a1c9r5">Bytes:</span> <div class="bytes-array svelte-a1c9r5"> </div></div>`);
var root_78 = from_html(`<div class="output-object-type svelte-a1c9r5"><span class="type-label svelte-a1c9r5">Type:</span> <span class="type-value svelte-a1c9r5"> </span></div>`);
var root_76 = from_html(`<div class="reference-output svelte-a1c9r5"><div class="output-header svelte-a1c9r5"><span class="output-index svelte-a1c9r5"></span> <span class="output-type svelte-a1c9r5"> </span></div> <!> <!></div>`);
var root_75 = from_html(`<div class="mutable-references svelte-a1c9r5"><h6 class="svelte-a1c9r5"> </h6> <!></div>`);
var root_81 = from_html(`<div class="return-bytes svelte-a1c9r5"><span class="bytes-label svelte-a1c9r5">Bytes:</span> <div class="bytes-array svelte-a1c9r5"> </div></div>`);
var root_82 = from_html(`<div class="return-object-type svelte-a1c9r5"><span class="type-label svelte-a1c9r5">Type:</span> <span class="type-value svelte-a1c9r5"> </span></div>`);
var root_80 = from_html(`<div class="return-value svelte-a1c9r5"><div class="return-header svelte-a1c9r5"><span class="return-index svelte-a1c9r5"></span></div> <!> <!></div>`);
var root_79 = from_html(`<div class="return-values svelte-a1c9r5"><h6 class="svelte-a1c9r5"> </h6> <!></div>`);
var root_83 = from_html(`<div class="result-raw svelte-a1c9r5"><details class="raw-collapsible svelte-a1c9r5"><summary class="svelte-a1c9r5">Raw Result Data</summary> <pre class="svelte-a1c9r5"> </pre></details></div>`);
var root_74 = from_html(`<div class="dev-inspect-item svelte-a1c9r5"><div class="result-header svelte-a1c9r5"><span class="result-index svelte-a1c9r5"></span></div> <!> <!> <!></div>`);
var root_73 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5"> </span> <div class="dev-inspect-results svelte-a1c9r5"></div></div>`);
var root_85 = from_html(`<div class="raw-result-item svelte-a1c9r5"><div class="raw-result-header svelte-a1c9r5"><span class="raw-result-index svelte-a1c9r5"></span></div> <div class="raw-result-content svelte-a1c9r5"><pre class="svelte-a1c9r5"> </pre></div></div>`);
var root_84 = from_html(`<div class="section svelte-a1c9r5"><span class="svelte-a1c9r5"> </span> <div class="raw-results svelte-a1c9r5"></div></div>`);
var root_1$1 = from_html(`<div class="header-line svelte-a1c9r5"><span class="tx-header svelte-a1c9r5">Transaction</span> <a target="_blank" rel="noopener noreferrer" class="tx-id-short svelte-a1c9r5"> </a> <span class="status svelte-a1c9r5"> </span> <span class="checkpoint-info svelte-a1c9r5"> </span> <!></div> <div class="sender-fee-line svelte-a1c9r5"><div class="sender-section"><span class="field-label svelte-a1c9r5">Sender:</span> <!></div> <div class="fee-section"><!></div></div> <!> <!> <!> <!> <!> <!> <!> <!>`, 1);
var root_87 = from_html(`<div class="no-data svelte-a1c9r5">No transaction effects data available</div>`);
var root = from_html(`<div class="transaction-effects svelte-a1c9r5"><!></div>`);
function TransactionEffects($$anchor, $$props) {
  push($$props, false);
  const effects = mutable_source();
  const balanceChanges = mutable_source();
  const objectChanges = mutable_source();
  const events = mutable_source();
  const deletedObjects = mutable_source();
  const createdObjects = mutable_source();
  const mutatedObjects = mutable_source();
  const hasValidData = mutable_source();
  let transactionData = prop($$props, "transactionData", 8);
  function formatAmount(amount, coinType) {
    if (!amount) return "";
    const isNegative = amount.startsWith("-");
    const absAmount = amount.replace("-", "");
    let coinTypeStr = "";
    if (typeof coinType === "string") {
      coinTypeStr = coinType;
    } else if (coinType && typeof coinType === "object" && "repr" in coinType) {
      coinTypeStr = coinType.repr;
    }
    let coinSymbol = "Unknown";
    if (coinTypeStr) {
      const parts = coinTypeStr.split("::");
      coinSymbol = parts.length > 2 ? parts[parts.length - 1].toUpperCase() : "Unknown";
    }
    try {
      if (coinTypeStr === "0x2::iota::IOTA") {
        const iotaAmount = nanoToIota(absAmount);
        const prefix = isNegative ? "-" : "+";
        return `${prefix}${iotaAmount} ${coinSymbol}`;
      } else {
        const prefix = isNegative ? "-" : "+";
        const formattedAmount = parseInt(absAmount).toLocaleString();
        return `${prefix}${formattedAmount} ${coinSymbol}`;
      }
    } catch {
      return `${amount} ${coinSymbol}`;
    }
  }
  function formatGasCost(gasSummary) {
    if (!gasSummary) return "";
    const total = BigInt(gasSummary.storageCost || 0) + BigInt(gasSummary.computationCost || 0) - BigInt(gasSummary.storageRebate || 0);
    try {
      return `${nanoToIota(total.toString())} IOTA`;
    } catch {
      return `${formatNumberWithUnderscores(total.toString())} nanos`;
    }
  }
  function getStatusColor(status) {
    const statusString = typeof status === "string" ? status : status == null ? void 0 : status.status;
    switch (statusString == null ? void 0 : statusString.toUpperCase()) {
      case "SUCCESS":
        return "#28a745";
      case "FAILURE":
      case "FAILED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }
  function getStatusString(status) {
    return typeof status === "string" ? status : (status == null ? void 0 : status.status) || "Unknown";
  }
  legacy_pre_effect(() => deep_read_state(transactionData()), () => {
    var _a;
    set(effects, (_a = transactionData()) == null ? void 0 : _a.effects);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    var _a, _b, _c, _d;
    set(balanceChanges, ((_a = transactionData()) == null ? void 0 : _a.balanceChanges) || ((_c = (_b = get(effects)) == null ? void 0 : _b.balanceChanges) == null ? void 0 : _c.nodes) || ((_d = get(effects)) == null ? void 0 : _d.balanceChanges) || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    var _a, _b, _c, _d;
    set(objectChanges, ((_a = transactionData()) == null ? void 0 : _a.objectChanges) || ((_c = (_b = get(effects)) == null ? void 0 : _b.objectChanges) == null ? void 0 : _c.nodes) || ((_d = get(effects)) == null ? void 0 : _d.objectChanges) || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    var _a, _b, _c, _d;
    set(events, ((_a = transactionData()) == null ? void 0 : _a.events) || ((_c = (_b = get(effects)) == null ? void 0 : _b.events) == null ? void 0 : _c.nodes) || ((_d = get(effects)) == null ? void 0 : _d.events) || []);
  });
  legacy_pre_effect(() => get(objectChanges), () => {
    set(deletedObjects, get(objectChanges).filter((change) => change.idDeleted === true || change.type === "deleted"));
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    var _a;
    set(createdObjects, [
      ...get(objectChanges).filter((change) => change.idCreated === true || change.type === "created"),
      ...(((_a = get(effects)) == null ? void 0 : _a.created) || []).map((obj) => {
        var _a2, _b, _c;
        return {
          type: "created",
          objectId: (_a2 = obj.reference) == null ? void 0 : _a2.objectId,
          version: (_b = obj.reference) == null ? void 0 : _b.version,
          digest: (_c = obj.reference) == null ? void 0 : _c.digest,
          owner: obj.owner,
          objectType: ""
        };
      })
    ]);
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    var _a;
    set(mutatedObjects, [
      ...get(objectChanges).filter((change) => change.idDeleted === false && change.idCreated === false || change.type === "mutated"),
      ...(((_a = get(effects)) == null ? void 0 : _a.mutated) || []).map((obj) => {
        var _a2, _b, _c;
        return {
          type: "mutated",
          objectId: (_a2 = obj.reference) == null ? void 0 : _a2.objectId,
          version: (_b = obj.reference) == null ? void 0 : _b.version,
          digest: (_c = obj.reference) == null ? void 0 : _c.digest,
          owner: obj.owner,
          objectType: ""
        };
      })
    ]);
  });
  legacy_pre_effect(() => (get(effects), get(balanceChanges)), () => {
    set(hasValidData, get(effects) && (get(effects).status || get(effects).checkpoint || get(balanceChanges).length > 0));
  });
  legacy_pre_effect_reset();
  init();
  var div = root();
  var node = child(div);
  {
    var consequent_52 = ($$anchor2) => {
      var fragment = root_1$1();
      var div_1 = first_child(fragment);
      var a = sibling(child(div_1), 2);
      var text$1 = child(a);
      var span = sibling(a, 2);
      var text_1 = child(span);
      var span_1 = sibling(span, 2);
      var text_2 = child(span_1);
      var node_1 = sibling(span_1, 2);
      {
        var consequent = ($$anchor3) => {
          var span_2 = root_2$1();
          var text_3 = child(span_2);
          template_effect(($0) => set_text(text_3, $0), [
            () => (get(effects), deep_read_state(transactionData()), untrack(() => {
              var _a, _b;
              return new Date(((_a = get(effects).checkpoint) == null ? void 0 : _a.timestamp) || ((_b = transactionData()) == null ? void 0 : _b.timestamp)).toLocaleString();
            }))
          ]);
          append($$anchor3, span_2);
        };
        if_block(node_1, ($$render) => {
          if (get(effects), deep_read_state(transactionData()), untrack(() => {
            var _a, _b;
            return ((_a = get(effects).checkpoint) == null ? void 0 : _a.timestamp) || ((_b = transactionData()) == null ? void 0 : _b.timestamp);
          })) $$render(consequent);
        });
      }
      var div_2 = sibling(div_1, 2);
      var div_3 = child(div_2);
      var node_2 = sibling(child(div_3), 2);
      {
        var consequent_1 = ($$anchor3) => {
          var a_1 = root_3$1();
          var text_4 = child(a_1);
          template_effect(
            ($0) => {
              set_attribute(a_1, "href", $0);
              set_attribute(a_1, "title", (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
              set_text(text_4, (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
            },
            [
              () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), deep_read_state(transactionData()), untrack(() => getAddressLink(getSelectedNetworkConfig(), transactionData().sender)))
            ]
          );
          append($$anchor3, a_1);
        };
        var alternate = ($$anchor3) => {
          var span_3 = root_4$1();
          append($$anchor3, span_3);
        };
        if_block(node_2, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a;
            return (_a = transactionData()) == null ? void 0 : _a.sender;
          })) $$render(consequent_1);
          else $$render(alternate, false);
        });
      }
      var div_4 = sibling(div_3, 2);
      var node_3 = child(div_4);
      {
        var consequent_2 = ($$anchor3) => {
          var div_5 = root_5$1();
          var span_4 = sibling(child(div_5), 2);
          var text_5 = child(span_4);
          var span_5 = sibling(span_4, 4);
          var text_6 = child(span_5);
          var span_6 = sibling(span_5, 4);
          var text_7 = child(span_6);
          template_effect(
            ($0, $1, $2) => {
              set_text(text_5, $0);
              set_text(text_6, $1);
              set_text(text_7, $2);
            },
            [
              () => (get(effects), untrack(() => formatGasCost(get(effects).gasEffects.gasSummary))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageCost || 0))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageRebate || 0)))
            ]
          );
          append($$anchor3, div_5);
        };
        if_block(node_3, ($$render) => {
          if (get(effects), untrack(() => {
            var _a;
            return (_a = get(effects).gasEffects) == null ? void 0 : _a.gasSummary;
          })) $$render(consequent_2);
        });
      }
      var node_4 = sibling(div_2, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var div_6 = root_6$1();
          var h4 = child(div_6);
          var text_8 = child(h4);
          var div_7 = sibling(h4, 2);
          var div_8 = child(div_7);
          var h5 = child(div_8);
          var text_9 = child(h5);
          var div_9 = sibling(h5, 2);
          each(
            div_9,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_10 = root_7$1();
              var node_5 = child(div_10);
              {
                var consequent_3 = ($$anchor5) => {
                  var a_2 = root_8();
                  var text_10 = child(a_2);
                  template_effect(
                    ($0) => {
                      set_attribute(a_2, "href", $0);
                      set_attribute(a_2, "title", (get(change), untrack(() => get(change).owner.address)));
                      set_text(text_10, (get(change), untrack(() => get(change).owner.address)));
                    },
                    [
                      () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).owner.address)))
                    ]
                  );
                  append($$anchor5, a_2);
                };
                var alternate_1 = ($$anchor5) => {
                  var div_11 = root_9$1();
                  append($$anchor5, div_11);
                };
                if_block(node_5, ($$render) => {
                  if (get(change), untrack(() => {
                    var _a;
                    return (_a = get(change).owner) == null ? void 0 : _a.address;
                  })) $$render(consequent_3);
                  else $$render(alternate_1, false);
                });
              }
              var div_12 = sibling(node_5, 2);
              var text_11 = child(div_12);
              template_effect(($0) => set_text(text_11, $0), [
                () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
              ]);
              append($$anchor4, div_10);
            }
          );
          var div_13 = sibling(div_8, 2);
          var h5_1 = child(div_13);
          var text_12 = child(h5_1);
          var div_14 = sibling(h5_1, 2);
          each(
            div_14,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_15 = root_10();
              var node_6 = child(div_15);
              {
                var consequent_4 = ($$anchor5) => {
                  var a_3 = root_11$1();
                  var text_13 = child(a_3);
                  template_effect(
                    ($0) => {
                      set_attribute(a_3, "href", $0);
                      set_attribute(a_3, "title", (get(change), untrack(() => get(change).owner.address)));
                      set_text(text_13, (get(change), untrack(() => get(change).owner.address)));
                    },
                    [
                      () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).owner.address)))
                    ]
                  );
                  append($$anchor5, a_3);
                };
                var alternate_2 = ($$anchor5) => {
                  var div_16 = root_12();
                  append($$anchor5, div_16);
                };
                if_block(node_6, ($$render) => {
                  if (get(change), untrack(() => {
                    var _a;
                    return (_a = get(change).owner) == null ? void 0 : _a.address;
                  })) $$render(consequent_4);
                  else $$render(alternate_2, false);
                });
              }
              var div_17 = sibling(node_6, 2);
              var text_14 = child(div_17);
              template_effect(($0) => set_text(text_14, $0), [
                () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
              ]);
              append($$anchor4, div_15);
            }
          );
          template_effect(
            ($0, $1) => {
              set_text(text_8, `Balance Changes (${(get(balanceChanges), untrack(() => get(balanceChanges).length)) ?? ""}):`);
              set_text(text_9, `Negative Changes (${$0 ?? ""}):`);
              set_text(text_12, `Positive Changes (${$1 ?? ""}):`);
            },
            [
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")).length)),
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")).length))
            ]
          );
          append($$anchor3, div_6);
        };
        if_block(node_4, ($$render) => {
          if (get(balanceChanges), untrack(() => get(balanceChanges).length > 0)) $$render(consequent_5);
        });
      }
      var node_7 = sibling(node_4, 2);
      {
        var consequent_25 = ($$anchor3) => {
          var div_18 = root_13$1();
          var h4_1 = child(div_18);
          var text_15 = child(h4_1);
          var div_19 = sibling(h4_1, 2);
          var div_20 = child(div_19);
          var h5_2 = child(div_20);
          var text_16 = child(h5_2);
          var div_21 = sibling(h5_2, 2);
          each(div_21, 5, () => get(deletedObjects), index, ($$anchor4, change) => {
            var div_22 = root_14$1();
            var node_8 = child(div_22);
            {
              var consequent_6 = ($$anchor5) => {
                var a_4 = root_15();
                var text_17 = child(a_4);
                template_effect(
                  ($0) => {
                    set_attribute(a_4, "href", $0);
                    set_text(text_17, (get(change), untrack(() => get(change).objectId)));
                  },
                  [
                    () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                  ]
                );
                append($$anchor5, a_4);
              };
              var alternate_3 = ($$anchor5) => {
                var fragment_1 = comment();
                var node_9 = first_child(fragment_1);
                {
                  var consequent_7 = ($$anchor6) => {
                    var a_5 = root_17();
                    var text_18 = child(a_5);
                    template_effect(
                      ($0) => {
                        set_attribute(a_5, "href", $0);
                        set_text(text_18, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, a_5);
                  };
                  if_block(
                    node_9,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).address)) $$render(consequent_7);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_1);
              };
              if_block(node_8, ($$render) => {
                if (get(change), untrack(() => get(change).objectId)) $$render(consequent_6);
                else $$render(alternate_3, false);
              });
            }
            var node_10 = sibling(node_8, 2);
            {
              var consequent_8 = ($$anchor5) => {
                var div_23 = root_18();
                var text_19 = child(div_23);
                template_effect(() => set_text(text_19, (get(change), untrack(() => get(change).objectType))));
                append($$anchor5, div_23);
              };
              if_block(node_10, ($$render) => {
                if (get(change), untrack(() => get(change).objectType)) $$render(consequent_8);
              });
            }
            var node_11 = sibling(node_10, 2);
            {
              var consequent_9 = ($$anchor5) => {
                var div_24 = root_19();
                var text_20 = child(div_24);
                template_effect(() => set_text(text_20, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                append($$anchor5, div_24);
              };
              if_block(node_11, ($$render) => {
                if (get(change), untrack(() => get(change).version)) $$render(consequent_9);
              });
            }
            var node_12 = sibling(node_11, 2);
            {
              var consequent_10 = ($$anchor5) => {
                var div_25 = root_20();
                var text_21 = child(div_25);
                template_effect(() => set_text(text_21, `Sender: ${(get(change), untrack(() => get(change).sender)) ?? ""}`));
                append($$anchor5, div_25);
              };
              if_block(node_12, ($$render) => {
                if (get(change), untrack(() => get(change).sender)) $$render(consequent_10);
              });
            }
            var node_13 = sibling(node_12, 2);
            {
              var consequent_11 = ($$anchor5) => {
                var details = root_21();
                var div_26 = sibling(child(details), 2);
                var pre = child(div_26);
                var text_22 = child(pre);
                template_effect(($0) => set_text(text_22, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                ]);
                append($$anchor5, details);
              };
              if_block(node_13, ($$render) => {
                if (get(change), untrack(() => {
                  var _a, _b, _c;
                  return (_c = (_b = (_a = get(change).inputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents) == null ? void 0 : _c.json;
                })) $$render(consequent_11);
              });
            }
            append($$anchor4, div_22);
          });
          var div_27 = sibling(div_20, 2);
          var h5_3 = child(div_27);
          var text_23 = child(h5_3);
          var div_28 = sibling(h5_3, 2);
          each(div_28, 5, () => get(mutatedObjects), index, ($$anchor4, change) => {
            var div_29 = root_22();
            var node_14 = child(div_29);
            {
              var consequent_13 = ($$anchor5) => {
                var fragment_2 = root_23();
                var a_6 = first_child(fragment_2);
                var text_24 = child(a_6);
                var node_15 = sibling(a_6, 2);
                {
                  var consequent_12 = ($$anchor6) => {
                    var details_1 = root_24();
                    var div_30 = sibling(child(details_1), 2);
                    var pre_1 = child(div_30);
                    var text_25 = child(pre_1);
                    template_effect(($0) => set_text(text_25, $0), [
                      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                    ]);
                    append($$anchor6, details_1);
                  };
                  if_block(node_15, ($$render) => {
                    if (get(change), untrack(() => {
                      var _a, _b, _c;
                      return (_c = (_b = (_a = get(change).inputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents) == null ? void 0 : _c.json;
                    })) $$render(consequent_12);
                  });
                }
                var details_2 = sibling(node_15, 2);
                var div_31 = sibling(child(details_2), 2);
                var pre_2 = child(div_31);
                var text_26 = child(pre_2);
                template_effect(
                  ($0, $1) => {
                    set_attribute(a_6, "href", $0);
                    set_text(text_24, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_26, $1);
                  },
                  [
                    () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).outputState.asMoveObject.contents.json.id))),
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                  ]
                );
                append($$anchor5, fragment_2);
              };
              var alternate_5 = ($$anchor5) => {
                var fragment_3 = comment();
                var node_16 = first_child(fragment_3);
                {
                  var consequent_18 = ($$anchor6) => {
                    var fragment_4 = root_26();
                    var a_7 = first_child(fragment_4);
                    var text_27 = child(a_7);
                    var node_17 = sibling(a_7, 2);
                    {
                      var consequent_14 = ($$anchor7) => {
                        var div_32 = root_27();
                        var text_28 = child(div_32);
                        template_effect(() => set_text(text_28, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_32);
                      };
                      if_block(node_17, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_14);
                      });
                    }
                    var node_18 = sibling(node_17, 2);
                    {
                      var consequent_15 = ($$anchor7) => {
                        var div_33 = root_28();
                        var text_29 = child(div_33);
                        template_effect(() => set_text(text_29, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_33);
                      };
                      if_block(node_18, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_15);
                      });
                    }
                    var node_19 = sibling(node_18, 2);
                    {
                      var consequent_16 = ($$anchor7) => {
                        var div_34 = root_29();
                        var text_30 = child(div_34);
                        template_effect(() => set_text(text_30, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_34);
                      };
                      if_block(node_19, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_16);
                      });
                    }
                    var node_20 = sibling(node_19, 2);
                    {
                      var consequent_17 = ($$anchor7) => {
                        var div_35 = root_30();
                        var text_31 = child(div_35);
                        template_effect(() => set_text(text_31, `Previous Version: ${(get(change), untrack(() => get(change).previousVersion)) ?? ""}`));
                        append($$anchor7, div_35);
                      };
                      if_block(node_20, ($$render) => {
                        if (get(change), untrack(() => get(change).previousVersion)) $$render(consequent_17);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_7, "href", $0);
                        set_text(text_27, (get(change), untrack(() => get(change).objectId)));
                      },
                      [
                        () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                      ]
                    );
                    append($$anchor6, fragment_4);
                  };
                  var alternate_4 = ($$anchor6) => {
                    var fragment_5 = root_31();
                    var a_8 = first_child(fragment_5);
                    var text_32 = child(a_8);
                    var node_21 = sibling(a_8, 2);
                    {
                      var consequent_19 = ($$anchor7) => {
                        var details_3 = root_32();
                        var div_36 = sibling(child(details_3), 2);
                        var pre_3 = child(div_36);
                        var text_33 = child(pre_3);
                        template_effect(($0) => set_text(text_33, $0), [
                          () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                        ]);
                        append($$anchor7, details_3);
                      };
                      if_block(node_21, ($$render) => {
                        if (get(change), untrack(() => {
                          var _a, _b, _c;
                          return (_c = (_b = (_a = get(change).inputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents) == null ? void 0 : _c.json;
                        })) $$render(consequent_19);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_8, "href", $0);
                        set_text(text_32, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, fragment_5);
                  };
                  if_block(
                    node_16,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_18);
                      else $$render(alternate_4, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_3);
              };
              if_block(node_14, ($$render) => {
                if (get(change), untrack(() => {
                  var _a, _b, _c, _d;
                  return (_d = (_c = (_b = (_a = get(change).outputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents) == null ? void 0 : _c.json) == null ? void 0 : _d.id;
                })) $$render(consequent_13);
                else $$render(alternate_5, false);
              });
            }
            append($$anchor4, div_29);
          });
          var div_37 = sibling(div_27, 2);
          var h5_4 = child(div_37);
          var text_34 = child(h5_4);
          var div_38 = sibling(h5_4, 2);
          each(div_38, 5, () => get(createdObjects), index, ($$anchor4, change) => {
            var div_39 = root_33();
            var node_22 = child(div_39);
            {
              var consequent_20 = ($$anchor5) => {
                var fragment_6 = root_34();
                var a_9 = first_child(fragment_6);
                var text_35 = child(a_9);
                var details_4 = sibling(a_9, 2);
                var div_40 = sibling(child(details_4), 2);
                var pre_4 = child(div_40);
                var text_36 = child(pre_4);
                template_effect(
                  ($0, $1) => {
                    set_attribute(a_9, "href", $0);
                    set_text(text_35, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_36, $1);
                  },
                  [
                    () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).outputState.asMoveObject.contents.json.id))),
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                  ]
                );
                append($$anchor5, fragment_6);
              };
              var alternate_7 = ($$anchor5) => {
                var fragment_7 = comment();
                var node_23 = first_child(fragment_7);
                {
                  var consequent_24 = ($$anchor6) => {
                    var fragment_8 = root_36();
                    var a_10 = first_child(fragment_8);
                    var text_37 = child(a_10);
                    var node_24 = sibling(a_10, 2);
                    {
                      var consequent_21 = ($$anchor7) => {
                        var div_41 = root_37();
                        var text_38 = child(div_41);
                        template_effect(() => set_text(text_38, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_41);
                      };
                      if_block(node_24, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_21);
                      });
                    }
                    var node_25 = sibling(node_24, 2);
                    {
                      var consequent_22 = ($$anchor7) => {
                        var div_42 = root_38();
                        var text_39 = child(div_42);
                        template_effect(() => set_text(text_39, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_42);
                      };
                      if_block(node_25, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_22);
                      });
                    }
                    var node_26 = sibling(node_25, 2);
                    {
                      var consequent_23 = ($$anchor7) => {
                        var div_43 = root_39();
                        var text_40 = child(div_43);
                        template_effect(() => set_text(text_40, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_43);
                      };
                      if_block(node_26, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_23);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_10, "href", $0);
                        set_text(text_37, (get(change), untrack(() => get(change).objectId)));
                      },
                      [
                        () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                      ]
                    );
                    append($$anchor6, fragment_8);
                  };
                  var alternate_6 = ($$anchor6) => {
                    var a_11 = root_40();
                    var text_41 = child(a_11);
                    template_effect(
                      ($0) => {
                        set_attribute(a_11, "href", $0);
                        set_text(text_41, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, a_11);
                  };
                  if_block(
                    node_23,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_24);
                      else $$render(alternate_6, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_7);
              };
              if_block(node_22, ($$render) => {
                if (get(change), untrack(() => {
                  var _a, _b, _c, _d;
                  return (_d = (_c = (_b = (_a = get(change).outputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents) == null ? void 0 : _c.json) == null ? void 0 : _d.id;
                })) $$render(consequent_20);
                else $$render(alternate_7, false);
              });
            }
            append($$anchor4, div_39);
          });
          template_effect(() => {
            set_text(text_15, `Object Changes (${(get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length + get(createdObjects).length + get(mutatedObjects).length + get(deletedObjects).length)) ?? ""}):`);
            set_text(text_16, `Deleted (${(get(deletedObjects), untrack(() => get(deletedObjects).length)) ?? ""}):`);
            set_text(text_23, `Mutated (${(get(mutatedObjects), untrack(() => get(mutatedObjects).length)) ?? ""}):`);
            set_text(text_34, `Created (${(get(createdObjects), untrack(() => get(createdObjects).length)) ?? ""}):`);
          });
          append($$anchor3, div_18);
        };
        if_block(node_7, ($$render) => {
          if (get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length > 0 || get(createdObjects).length > 0 || get(mutatedObjects).length > 0 || get(deletedObjects).length > 0)) $$render(consequent_25);
        });
      }
      var node_27 = sibling(node_7, 2);
      {
        var consequent_27 = ($$anchor3) => {
          var div_44 = root_41();
          var details_5 = child(div_44);
          var summary = child(details_5);
          var text_42 = child(summary);
          var div_45 = sibling(summary, 2);
          each(div_45, 5, () => get(events), index, ($$anchor4, event, index2) => {
            var div_46 = root_42();
            var span_7 = child(div_46);
            span_7.textContent = `#${index2 + 1}`;
            var span_8 = sibling(span_7, 2);
            var text_43 = child(span_8);
            var node_28 = sibling(span_8, 2);
            {
              var consequent_26 = ($$anchor5) => {
                var pre_5 = root_43();
                var text_44 = child(pre_5);
                template_effect(($0) => set_text(text_44, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), get(event), untrack(() => formatJsonWithCompactArrays(get(event).parsedJson)))
                ]);
                append($$anchor5, pre_5);
              };
              if_block(node_28, ($$render) => {
                if (get(event), untrack(() => get(event).parsedJson)) $$render(consequent_26);
              });
            }
            template_effect(() => set_text(text_43, (get(event), untrack(() => get(event).type || "Unknown"))));
            append($$anchor4, div_46);
          });
          template_effect(() => set_text(text_42, `Events (${(get(events), untrack(() => get(events).length)) ?? ""})`));
          append($$anchor3, div_44);
        };
        if_block(node_27, ($$render) => {
          if (get(events), untrack(() => get(events).length > 0)) $$render(consequent_27);
        });
      }
      var node_29 = sibling(node_27, 2);
      {
        var consequent_29 = ($$anchor3) => {
          var div_47 = root_44();
          var span_9 = child(div_47);
          var text_45 = child(span_9);
          var div_48 = sibling(span_9, 2);
          each(
            div_48,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands)),
            index,
            ($$anchor4, command, index2) => {
              var div_49 = root_45();
              var span_10 = child(div_49);
              span_10.textContent = index2;
              var span_11 = sibling(span_10, 2);
              var text_46 = child(span_11);
              var div_50 = sibling(span_11, 2);
              var node_30 = child(div_50);
              {
                var consequent_28 = ($$anchor5) => {
                  var pre_6 = root_46();
                  const moveCall = derived_safe_equal(() => (get(command), untrack(() => get(command).MoveCall)));
                  const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                  const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                    function: get(signature),
                    typeArguments: get(moveCall).typeArguments,
                    arguments: get(moveCall).arguments
                  }))));
                  var text_47 = child(pre_6);
                  template_effect(($0) => set_text(text_47, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                  ]);
                  append($$anchor5, pre_6);
                };
                var alternate_8 = ($$anchor5) => {
                  var pre_7 = root_47();
                  var text_48 = child(pre_7);
                  template_effect(($0) => set_text(text_48, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(command), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(command))[get(command).$kind])))
                  ]);
                  append($$anchor5, pre_7);
                };
                if_block(node_30, ($$render) => {
                  if (get(command), untrack(() => get(command).$kind === "MoveCall" && get(command).MoveCall)) $$render(consequent_28);
                  else $$render(alternate_8, false);
                });
              }
              template_effect(() => set_text(text_46, (get(command), untrack(() => get(command).$kind))));
              append($$anchor4, div_49);
            }
          );
          template_effect(() => set_text(text_45, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands.length)) ?? ""}):`));
          append($$anchor3, div_47);
        };
        var alternate_11 = ($$anchor3) => {
          var fragment_9 = comment();
          var node_31 = first_child(fragment_9);
          {
            var consequent_32 = ($$anchor4) => {
              var div_51 = root_49();
              var span_12 = child(div_51);
              var text_49 = child(span_12);
              var div_52 = sibling(span_12, 2);
              each(
                div_52,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions)),
                index,
                ($$anchor5, command, index2) => {
                  var div_53 = root_50();
                  var span_13 = child(div_53);
                  span_13.textContent = index2;
                  var span_14 = sibling(span_13, 2);
                  var text_50 = child(span_14);
                  var div_54 = sibling(span_14, 2);
                  var node_32 = child(div_54);
                  {
                    var consequent_31 = ($$anchor6) => {
                      var fragment_10 = comment();
                      const commandValue = derived_safe_equal(() => (get(command), untrack(() => Object.values(get(command))[0])));
                      var node_33 = first_child(fragment_10);
                      {
                        var consequent_30 = ($$anchor7) => {
                          var pre_8 = root_52();
                          const moveCall = derived_safe_equal(() => get(commandValue));
                          const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                          const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                            function: get(signature),
                            typeArguments: get(moveCall).typeArguments,
                            arguments: get(moveCall).arguments
                          }))));
                          var text_51 = child(pre_8);
                          template_effect(($0) => set_text(text_51, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                          ]);
                          append($$anchor7, pre_8);
                        };
                        var alternate_9 = ($$anchor7) => {
                          var pre_9 = root_53();
                          var text_52 = child(pre_9);
                          template_effect(($0) => set_text(text_52, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(commandValue)), untrack(() => formatJsonWithCompactArrays(get(commandValue))))
                          ]);
                          append($$anchor7, pre_9);
                        };
                        if_block(node_33, ($$render) => {
                          if (get(commandValue) && typeof get(commandValue) === "object" && get(commandValue) !== null && "package" in get(commandValue)) $$render(consequent_30);
                          else $$render(alternate_9, false);
                        });
                      }
                      append($$anchor6, fragment_10);
                    };
                    var alternate_10 = ($$anchor6) => {
                      var pre_10 = root_54();
                      var text_53 = child(pre_10);
                      template_effect(($0) => set_text(text_53, $0), [
                        () => (deep_read_state(formatJsonWithCompactArrays), get(command), untrack(() => formatJsonWithCompactArrays(Object.values(get(command))[0])))
                      ]);
                      append($$anchor6, pre_10);
                    };
                    if_block(node_32, ($$render) => {
                      if (get(command), untrack(() => Object.keys(get(command))[0] === "MoveCall")) $$render(consequent_31);
                      else $$render(alternate_10, false);
                    });
                  }
                  template_effect(($0) => set_text(text_50, $0), [
                    () => (get(command), untrack(() => Object.keys(get(command))[0]))
                  ]);
                  append($$anchor5, div_53);
                }
              );
              template_effect(() => set_text(text_49, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions.length)) ?? ""}):`));
              append($$anchor4, div_51);
            };
            if_block(
              node_31,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => {
                  var _a, _b, _c, _d;
                  return (_d = (_c = (_b = (_a = transactionData()) == null ? void 0 : _a.input) == null ? void 0 : _b.transaction) == null ? void 0 : _c.transactions) == null ? void 0 : _d.length;
                })) $$render(consequent_32);
              },
              true
            );
          }
          append($$anchor3, fragment_9);
        };
        if_block(node_29, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = transactionData()) == null ? void 0 : _a.decodedBCS) == null ? void 0 : _b.intentMessage) == null ? void 0 : _c.value) == null ? void 0 : _d.V1) == null ? void 0 : _e.kind) == null ? void 0 : _f.ProgrammableTransaction) == null ? void 0 : _g.commands) == null ? void 0 : _h.length;
          })) $$render(consequent_29);
          else $$render(alternate_11, false);
        });
      }
      var node_34 = sibling(node_29, 2);
      {
        var consequent_35 = ($$anchor3) => {
          var div_55 = root_55();
          var div_56 = sibling(child(div_55), 2);
          each(
            div_56,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs)),
            index,
            ($$anchor4, input, index2) => {
              var div_57 = root_56();
              var span_15 = child(div_57);
              span_15.textContent = index2;
              var span_16 = sibling(span_15, 2);
              var text_54 = child(span_16);
              var div_58 = sibling(span_16, 2);
              var pre_11 = child(div_58);
              var text_55 = child(pre_11);
              var node_35 = sibling(pre_11, 2);
              {
                var consequent_34 = ($$anchor5) => {
                  var fragment_11 = comment();
                  const decoded = derived_safe_equal(() => (deep_read_state(decodeBase64Bytes), get(input), untrack(() => decodeBase64Bytes(get(input)[get(input).$kind].bytes))));
                  var node_36 = first_child(fragment_11);
                  {
                    var consequent_33 = ($$anchor6) => {
                      var div_59 = root_58();
                      var div_60 = child(div_59);
                      var span_17 = sibling(child(div_60), 2);
                      var text_56 = child(span_17);
                      var div_61 = sibling(div_60, 2);
                      var span_18 = child(div_61);
                      var text_57 = child(span_18);
                      var span_19 = sibling(span_18, 2);
                      var text_58 = child(span_19);
                      var div_62 = sibling(div_61, 2);
                      var span_20 = sibling(child(div_62), 2);
                      var text_59 = child(span_20);
                      template_effect(
                        ($0) => {
                          set_text(text_56, (deep_read_state(get(decoded)), untrack(() => get(decoded).utf8)));
                          set_text(text_57, `${(deep_read_state(get(decoded)), untrack(() => get(decoded).integer.type)) ?? ""}:`);
                          set_text(text_58, (deep_read_state(get(decoded)), untrack(() => get(decoded).integer.value)));
                          set_text(text_59, `[${$0 ?? ""}]`);
                        },
                        [
                          () => (deep_read_state(get(decoded)), untrack(() => get(decoded).bytes.join(", ")))
                        ]
                      );
                      append($$anchor6, div_59);
                    };
                    if_block(node_36, ($$render) => {
                      if (get(decoded)) $$render(consequent_33);
                    });
                  }
                  append($$anchor5, fragment_11);
                };
                if_block(node_35, ($$render) => {
                  if (get(input), untrack(() => get(input).$kind === "Pure" && get(input)[get(input).$kind].bytes)) $$render(consequent_34);
                });
              }
              template_effect(
                ($0) => {
                  set_text(text_54, (get(input), untrack(() => get(input).$kind)));
                  set_text(text_55, $0);
                },
                [
                  () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(input), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(input))[get(input).$kind])))
                ]
              );
              append($$anchor4, div_57);
            }
          );
          append($$anchor3, div_55);
        };
        var alternate_12 = ($$anchor3) => {
          var fragment_12 = comment();
          var node_37 = first_child(fragment_12);
          {
            var consequent_36 = ($$anchor4) => {
              var div_63 = root_60();
              var div_64 = sibling(child(div_63), 2);
              each(
                div_64,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.inputs)),
                index,
                ($$anchor5, input, index2) => {
                  var div_65 = root_61();
                  const inputData = derived_safe_equal(() => (get(input), untrack(() => ({ valueType: get(input).valueType, value: get(input).value }))));
                  var span_21 = child(div_65);
                  span_21.textContent = index2;
                  var span_22 = sibling(span_21, 2);
                  var text_60 = child(span_22);
                  var div_66 = sibling(span_22, 2);
                  var pre_12 = child(div_66);
                  var text_61 = child(pre_12);
                  template_effect(
                    ($0) => {
                      set_text(text_60, (get(input), untrack(() => get(input).type)));
                      set_text(text_61, $0);
                    },
                    [
                      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(inputData)), untrack(() => formatJsonWithCompactArrays(get(inputData))))
                    ]
                  );
                  append($$anchor5, div_65);
                }
              );
              append($$anchor4, div_63);
            };
            if_block(
              node_37,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => {
                  var _a, _b, _c, _d;
                  return (_d = (_c = (_b = (_a = transactionData()) == null ? void 0 : _a.input) == null ? void 0 : _b.transaction) == null ? void 0 : _c.inputs) == null ? void 0 : _d.length;
                })) $$render(consequent_36);
              },
              true
            );
          }
          append($$anchor3, fragment_12);
        };
        if_block(node_34, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = transactionData()) == null ? void 0 : _a.decodedBCS) == null ? void 0 : _b.intentMessage) == null ? void 0 : _c.value) == null ? void 0 : _d.V1) == null ? void 0 : _e.kind) == null ? void 0 : _f.ProgrammableTransaction) == null ? void 0 : _g.inputs) == null ? void 0 : _h.length;
          })) $$render(consequent_35);
          else $$render(alternate_12, false);
        });
      }
      var node_38 = sibling(node_34, 2);
      {
        var consequent_39 = ($$anchor3) => {
          var div_67 = root_62();
          var div_68 = sibling(child(div_67), 2);
          var div_69 = child(div_68);
          var span_23 = sibling(child(div_69), 2);
          var node_39 = child(span_23);
          {
            var consequent_38 = ($$anchor4) => {
              var fragment_13 = comment();
              var node_40 = first_child(fragment_13);
              each(
                node_40,
                1,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment)),
                index,
                ($$anchor5, payment, index2) => {
                  var fragment_14 = root_64();
                  var span_24 = first_child(fragment_14);
                  var text_62 = child(span_24);
                  var node_41 = sibling(span_24, 2);
                  {
                    var consequent_37 = ($$anchor6) => {
                      var span_25 = root_65();
                      append($$anchor6, span_25);
                    };
                    if_block(node_41, ($$render) => {
                      if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().decodedBCS.intentMessage.value.V1.gasData.payment.length - 1)) $$render(consequent_37);
                    });
                  }
                  template_effect(() => set_text(text_62, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                  append($$anchor5, fragment_14);
                }
              );
              append($$anchor4, fragment_13);
            };
            var alternate_13 = ($$anchor4) => {
              var text_63 = text("N/A");
              append($$anchor4, text_63);
            };
            if_block(node_39, ($$render) => {
              if (deep_read_state(transactionData()), untrack(() => {
                var _a;
                return (_a = transactionData().decodedBCS.intentMessage.value.V1.gasData.payment) == null ? void 0 : _a.length;
              })) $$render(consequent_38);
              else $$render(alternate_13, false);
            });
          }
          var div_70 = sibling(div_69, 2);
          var span_26 = sibling(child(div_70), 2);
          var text_64 = child(span_26);
          var div_71 = sibling(div_70, 2);
          var span_27 = sibling(child(div_71), 2);
          var text_65 = child(span_27);
          var div_72 = sibling(div_71, 2);
          var span_28 = sibling(child(div_72), 2);
          var text_66 = child(span_28);
          template_effect(
            ($0, $1) => {
              set_text(text_64, (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.owner || "N/A")));
              set_text(text_65, `${$0 ?? ""} nanos`);
              set_text(text_66, `${$1 ?? ""} nanos`);
            },
            [
              () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.price || "0"))),
              () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.budget || "0")))
            ]
          );
          append($$anchor3, div_67);
        };
        var alternate_15 = ($$anchor3) => {
          var fragment_15 = comment();
          var node_42 = first_child(fragment_15);
          {
            var consequent_42 = ($$anchor4) => {
              var div_73 = root_68();
              var div_74 = sibling(child(div_73), 2);
              var div_75 = child(div_74);
              var span_29 = sibling(child(div_75), 2);
              var node_43 = child(span_29);
              {
                var consequent_41 = ($$anchor5) => {
                  var fragment_16 = comment();
                  var node_44 = first_child(fragment_16);
                  each(
                    node_44,
                    1,
                    () => (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment)),
                    index,
                    ($$anchor6, payment, index2) => {
                      var fragment_17 = root_70();
                      var span_30 = first_child(fragment_17);
                      var text_67 = child(span_30);
                      var node_45 = sibling(span_30, 2);
                      {
                        var consequent_40 = ($$anchor7) => {
                          var span_31 = root_71();
                          append($$anchor7, span_31);
                        };
                        if_block(node_45, ($$render) => {
                          if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().input.gasData.payment.length - 1)) $$render(consequent_40);
                        });
                      }
                      template_effect(() => set_text(text_67, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                      append($$anchor6, fragment_17);
                    }
                  );
                  append($$anchor5, fragment_16);
                };
                var alternate_14 = ($$anchor5) => {
                  var text_68 = text("N/A");
                  append($$anchor5, text_68);
                };
                if_block(node_43, ($$render) => {
                  if (deep_read_state(transactionData()), untrack(() => {
                    var _a;
                    return (_a = transactionData().input.gasData.payment) == null ? void 0 : _a.length;
                  })) $$render(consequent_41);
                  else $$render(alternate_14, false);
                });
              }
              var div_76 = sibling(div_75, 2);
              var span_32 = sibling(child(div_76), 2);
              var text_69 = child(span_32);
              var div_77 = sibling(div_76, 2);
              var span_33 = sibling(child(div_77), 2);
              var text_70 = child(span_33);
              var div_78 = sibling(div_77, 2);
              var span_34 = sibling(child(div_78), 2);
              var text_71 = child(span_34);
              template_effect(
                ($0, $1) => {
                  set_text(text_69, (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.owner || "N/A")));
                  set_text(text_70, `${$0 ?? ""} nanos`);
                  set_text(text_71, `${$1 ?? ""} nanos`);
                },
                [
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.price || "0"))),
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.budget || "0")))
                ]
              );
              append($$anchor4, div_73);
            };
            if_block(
              node_42,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => {
                  var _a, _b;
                  return (_b = (_a = transactionData()) == null ? void 0 : _a.input) == null ? void 0 : _b.gasData;
                })) $$render(consequent_42);
              },
              true
            );
          }
          append($$anchor3, fragment_15);
        };
        if_block(node_38, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a, _b, _c, _d, _e;
            return (_e = (_d = (_c = (_b = (_a = transactionData()) == null ? void 0 : _a.decodedBCS) == null ? void 0 : _b.intentMessage) == null ? void 0 : _c.value) == null ? void 0 : _d.V1) == null ? void 0 : _e.gasData;
          })) $$render(consequent_39);
          else $$render(alternate_15, false);
        });
      }
      var node_46 = sibling(node_38, 2);
      {
        var consequent_50 = ($$anchor3) => {
          var div_79 = root_73();
          var span_35 = child(div_79);
          var text_72 = child(span_35);
          var div_80 = sibling(span_35, 2);
          each(
            div_80,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults)),
            index,
            ($$anchor4, result, index$1) => {
              var div_81 = root_74();
              var div_82 = child(div_81);
              var span_36 = child(div_82);
              span_36.textContent = `Result #${index$1}`;
              var node_47 = sibling(div_82, 2);
              {
                var consequent_45 = ($$anchor5) => {
                  var div_83 = root_75();
                  var h6 = child(div_83);
                  var text_73 = child(h6);
                  var node_48 = sibling(h6, 2);
                  each(
                    node_48,
                    1,
                    () => (get(result), untrack(() => get(result).mutableReferenceOutputs)),
                    index,
                    ($$anchor6, output, outputIndex) => {
                      var div_84 = root_76();
                      var div_85 = child(div_84);
                      var span_37 = child(div_85);
                      span_37.textContent = `Output #${outputIndex}`;
                      var span_38 = sibling(span_37, 2);
                      var text_74 = child(span_38);
                      var node_49 = sibling(div_85, 2);
                      {
                        var consequent_43 = ($$anchor7) => {
                          var div_86 = root_77();
                          var div_87 = sibling(child(div_86), 2);
                          var text_75 = child(div_87);
                          template_effect(($0) => set_text(text_75, `[${$0 ?? ""}]`), [
                            () => (get(output), untrack(() => get(output)[1].join(", ")))
                          ]);
                          append($$anchor7, div_86);
                        };
                        if_block(node_49, ($$render) => {
                          if (get(output), untrack(() => {
                            var _a;
                            return (_a = get(output)[1]) == null ? void 0 : _a.length;
                          })) $$render(consequent_43);
                        });
                      }
                      var node_50 = sibling(node_49, 2);
                      {
                        var consequent_44 = ($$anchor7) => {
                          var div_88 = root_78();
                          var span_39 = sibling(child(div_88), 2);
                          var text_76 = child(span_39);
                          template_effect(() => set_text(text_76, (get(output), untrack(() => get(output)[2]))));
                          append($$anchor7, div_88);
                        };
                        if_block(node_50, ($$render) => {
                          if (get(output), untrack(() => get(output)[2])) $$render(consequent_44);
                        });
                      }
                      template_effect(() => set_text(text_74, (get(output), untrack(() => get(output)[0]))));
                      append($$anchor6, div_84);
                    }
                  );
                  template_effect(() => set_text(text_73, `Mutable Reference Outputs (${(get(result), untrack(() => get(result).mutableReferenceOutputs.length)) ?? ""}):`));
                  append($$anchor5, div_83);
                };
                if_block(node_47, ($$render) => {
                  if (get(result), untrack(() => {
                    var _a;
                    return (_a = get(result).mutableReferenceOutputs) == null ? void 0 : _a.length;
                  })) $$render(consequent_45);
                });
              }
              var node_51 = sibling(node_47, 2);
              {
                var consequent_48 = ($$anchor5) => {
                  var div_89 = root_79();
                  var h6_1 = child(div_89);
                  var text_77 = child(h6_1);
                  var node_52 = sibling(h6_1, 2);
                  each(node_52, 1, () => (get(result), untrack(() => get(result).returnValues)), index, ($$anchor6, returnValue, returnIndex) => {
                    var div_90 = root_80();
                    var div_91 = child(div_90);
                    var span_40 = child(div_91);
                    span_40.textContent = `Value #${returnIndex}`;
                    var node_53 = sibling(div_91, 2);
                    {
                      var consequent_46 = ($$anchor7) => {
                        var div_92 = root_81();
                        var div_93 = sibling(child(div_92), 2);
                        var text_78 = child(div_93);
                        template_effect(($0) => set_text(text_78, `[${$0 ?? ""}]`), [
                          () => (get(returnValue), untrack(() => get(returnValue)[0].join(", ")))
                        ]);
                        append($$anchor7, div_92);
                      };
                      if_block(node_53, ($$render) => {
                        if (get(returnValue), untrack(() => {
                          var _a;
                          return (_a = get(returnValue)[0]) == null ? void 0 : _a.length;
                        })) $$render(consequent_46);
                      });
                    }
                    var node_54 = sibling(node_53, 2);
                    {
                      var consequent_47 = ($$anchor7) => {
                        var div_94 = root_82();
                        var span_41 = sibling(child(div_94), 2);
                        var text_79 = child(span_41);
                        template_effect(() => set_text(text_79, (get(returnValue), untrack(() => get(returnValue)[1]))));
                        append($$anchor7, div_94);
                      };
                      if_block(node_54, ($$render) => {
                        if (get(returnValue), untrack(() => get(returnValue)[1])) $$render(consequent_47);
                      });
                    }
                    append($$anchor6, div_90);
                  });
                  template_effect(() => set_text(text_77, `Return Values (${(get(result), untrack(() => get(result).returnValues.length)) ?? ""}):`));
                  append($$anchor5, div_89);
                };
                if_block(node_51, ($$render) => {
                  if (get(result), untrack(() => {
                    var _a;
                    return (_a = get(result).returnValues) == null ? void 0 : _a.length;
                  })) $$render(consequent_48);
                });
              }
              var node_55 = sibling(node_51, 2);
              {
                var consequent_49 = ($$anchor5) => {
                  var div_95 = root_83();
                  var details_6 = child(div_95);
                  var pre_13 = sibling(child(details_6), 2);
                  var text_80 = child(pre_13);
                  template_effect(($0) => set_text(text_80, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), get(result), untrack(() => formatJsonWithCompactArrays(get(result))))
                  ]);
                  append($$anchor5, div_95);
                };
                if_block(node_55, ($$render) => {
                  if (get(result), untrack(() => Object.keys(get(result)).length > 2 || Object.keys(get(result)).length === 1 && !get(result).mutableReferenceOutputs && !get(result).returnValues)) $$render(consequent_49);
                });
              }
              append($$anchor4, div_81);
            }
          );
          template_effect(() => set_text(text_72, `Dev Inspect Results (${(deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults.length)) ?? ""}):`));
          append($$anchor3, div_79);
        };
        if_block(node_46, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a, _b;
            return (_b = (_a = transactionData()) == null ? void 0 : _a.devInspectResults) == null ? void 0 : _b.length;
          })) $$render(consequent_50);
        });
      }
      var node_56 = sibling(node_46, 2);
      {
        var consequent_51 = ($$anchor3) => {
          var div_96 = root_84();
          var span_42 = child(div_96);
          var text_81 = child(span_42);
          var div_97 = sibling(span_42, 2);
          each(
            div_97,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().results)),
            index,
            ($$anchor4, rawResult, index2) => {
              var div_98 = root_85();
              var div_99 = child(div_98);
              var span_43 = child(div_99);
              span_43.textContent = `Raw Result #${index2}`;
              var div_100 = sibling(div_99, 2);
              var pre_14 = child(div_100);
              var text_82 = child(pre_14);
              template_effect(($0) => set_text(text_82, $0), [
                () => (deep_read_state(formatJsonWithCompactArrays), get(rawResult), untrack(() => formatJsonWithCompactArrays(get(rawResult))))
              ]);
              append($$anchor4, div_98);
            }
          );
          template_effect(() => set_text(text_81, `Raw Results (${(deep_read_state(transactionData()), untrack(() => transactionData().results.length)) ?? ""}):`));
          append($$anchor3, div_96);
        };
        if_block(node_56, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => {
            var _a, _b;
            return (_b = (_a = transactionData()) == null ? void 0 : _a.results) == null ? void 0 : _b.length;
          })) $$render(consequent_51);
        });
      }
      template_effect(
        ($0, $1, $2, $3) => {
          set_attribute(a, "href", $0);
          set_attribute(a, "title", (deep_read_state(transactionData()), untrack(() => {
            var _a;
            return (_a = transactionData()) == null ? void 0 : _a.digest;
          })));
          set_text(text$1, (deep_read_state(transactionData()), untrack(() => {
            var _a;
            return (_a = transactionData()) == null ? void 0 : _a.digest;
          })));
          set_style(span, `color: ${$1 ?? ""}`);
          set_text(text_1, $2);
          set_text(text_2, `Checkpoint: ${$3 ?? ""}`);
        },
        [
          () => (deep_read_state(transactionData()), deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), untrack(() => {
            var _a;
            return ((_a = transactionData()) == null ? void 0 : _a.digest) ? getTransactionLink(getSelectedNetworkConfig(), transactionData().digest) : "#";
          })),
          () => (get(effects), untrack(() => getStatusColor(get(effects).status))),
          () => (get(effects), untrack(() => getStatusString(get(effects).status))),
          () => (deep_read_state(formatNumberWithUnderscores), get(effects), untrack(() => {
            var _a;
            return formatNumberWithUnderscores(((_a = get(effects).checkpoint) == null ? void 0 : _a.sequenceNumber) || "");
          }))
        ]
      );
      append($$anchor2, fragment);
    };
    var alternate_16 = ($$anchor2) => {
      var fragment_18 = comment();
      var node_57 = first_child(fragment_18);
      {
        var consequent_53 = ($$anchor3) => {
          var div_101 = root_87();
          append($$anchor3, div_101);
        };
        if_block(
          node_57,
          ($$render) => {
            if (!get(hasValidData)) $$render(consequent_53);
          },
          true
        );
      }
      append($$anchor2, fragment_18);
    };
    if_block(node, ($$render) => {
      if (get(effects)) $$render(consequent_52);
      else $$render(alternate_16, false);
    });
  }
  append($$anchor, div);
  pop();
}
async function performDryRun(_, hasTxBytes, isDryRunning, value, dryRunError) {
  if (!get(hasTxBytes) || get(isDryRunning)) return;
  try {
    set(isDryRunning, true);
    const client = getClient();
    const txBytes = value().transactionBytes;
    const dryRunResult = await client.dryRunTransactionBlock({ transactionBlock: txBytes });
    const updatedData = {
      ...value(),
      ...dryRunResult,
      // Keep the original transactionBytes
      transactionBytes: txBytes,
      // Mark that this is from a dry run
      isDryRun: true,
      // Preserve any original metadata that might be important
      originalDigest: value().digest || value().transactionDigest
    };
    value(updatedData);
  } catch (error) {
    console.error("Dry run failed:", error);
    set(dryRunError, `Dry run failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    set(isDryRunning, false);
  }
}
var on_click = (__1, showTxBytes, viewMode) => {
  set(showTxBytes, false);
  set(viewMode, "formatted");
};
var root_2 = from_html(`<button>Formatted View</button>`);
var on_click_1 = (__2, showTxBytes, viewMode) => {
  set(showTxBytes, false);
  set(viewMode, "json");
};
var on_click_2 = (__3, showTxBytes, viewMode) => {
  set(showTxBytes, false);
  set(viewMode, "tree");
};
var on_click_3 = (__4, showTxBytes, viewMode) => {
  set(showTxBytes, false);
  set(viewMode, "commands");
};
var root_3 = from_html(`<button>PTB Commands</button>`);
var on_click_4 = (__5, showTxBytes, viewMode, prevViewMode) => {
  set(showTxBytes, !get(showTxBytes));
  if (!get(showTxBytes)) {
    set(viewMode, get(prevViewMode), true);
  }
};
var root_4 = from_html(`<button>Tx Bytes</button>`);
var root_5 = from_html(`<button class="svelte-kj9b95"> </button>`);
var on_click_5 = (__6, value) => value(null);
var on_click_6 = (__7, dryRunError) => set(dryRunError, "");
var root_6 = from_html(`<div class="error-message svelte-kj9b95"> <button class="svelte-kj9b95">×</button></div>`);
var on_click_7 = (__8, value) => navigator.clipboard.writeText(value().transactionBytes);
var root_7 = from_html(`<div class="tx-bytes-view svelte-kj9b95"><button class="copy-btn svelte-kj9b95">Copy Bytes</button> <pre class="wrap-bytes svelte-kj9b95"> </pre></div>`);
var root_9 = from_html(`<div class="formatted-view svelte-kj9b95"><!></div>`);
var root_11 = from_html(`<div class="tree-view svelte-kj9b95"><!></div>`);
var root_13 = from_html(`<div class="commands-view-container svelte-kj9b95"><!></div>`);
var root_14 = from_html(`<div class="json-view svelte-kj9b95"><pre class="svelte-kj9b95"> </pre></div>`);
var root_1 = from_html(`<div class="transaction-view ultra-compact svelte-kj9b95"><div class="view-controls svelte-kj9b95"><!> <button>Raw JSON</button> <button>JSON Tree</button> <!> <!> <!> <button class="close-btn svelte-kj9b95" style="margin-left: auto;">×</button></div> <!> <!></div>`);
function TransactionView($$anchor, $$props) {
  push($$props, true);
  let value = prop($$props, "value", 15);
  let viewMode = state("formatted");
  let showTxBytes = state(false);
  let prevViewMode = state("formatted");
  let hidden = user_derived(() => !value() || !Object.keys(value() || {}).length);
  let isDryRunning = state(false);
  let dryRunError = state("");
  let hasTxBytes = user_derived(() => value() && typeof value() === "object" && "transactionBytes" in value() && value().transactionBytes);
  let hasDryRunResults = user_derived(() => value() && typeof value() === "object" && "effects" in value() && value().effects);
  user_effect(() => {
    if (value()) {
      if (isTransactionData(value())) {
        set(viewMode, "formatted");
        set(prevViewMode, "formatted");
      } else {
        set(viewMode, "json");
        set(prevViewMode, "json");
      }
      set(showTxBytes, false);
      set(dryRunError, "");
    }
  });
  user_effect(() => {
    if (get(showTxBytes)) {
      if (get(viewMode) !== "txbytes") {
        set(prevViewMode, get(viewMode), true);
        set(viewMode, "txbytes");
      }
    } else if (get(viewMode) === "txbytes") {
      set(viewMode, get(prevViewMode), true);
    }
  });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_9 = ($$anchor2) => {
      var div = root_1();
      var div_1 = child(div);
      var node_1 = child(div_1);
      {
        var consequent = ($$anchor3) => {
          var button = root_2();
          button.__click = [on_click, showTxBytes, viewMode];
          let classes;
          template_effect(($0) => classes = set_class(button, 1, "svelte-kj9b95", null, classes, $0), [() => ({ active: get(viewMode) === "formatted" })]);
          append($$anchor3, button);
        };
        if_block(node_1, ($$render) => {
          if (isTransactionData(value())) $$render(consequent);
        });
      }
      var button_1 = sibling(node_1, 2);
      button_1.__click = [on_click_1, showTxBytes, viewMode];
      let classes_1;
      var button_2 = sibling(button_1, 2);
      button_2.__click = [on_click_2, showTxBytes, viewMode];
      let classes_2;
      var node_2 = sibling(button_2, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var button_3 = root_3();
          button_3.__click = [on_click_3, showTxBytes, viewMode];
          let classes_3;
          template_effect(($0) => classes_3 = set_class(button_3, 1, "svelte-kj9b95", null, classes_3, $0), [() => ({ active: get(viewMode) === "commands" })]);
          append($$anchor3, button_3);
        };
        if_block(node_2, ($$render) => {
          if (isTransactionData(value())) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var button_4 = root_4();
          button_4.__click = [on_click_4, showTxBytes, viewMode, prevViewMode];
          let classes_4;
          template_effect(($0) => classes_4 = set_class(button_4, 1, "svelte-kj9b95", null, classes_4, $0), [() => ({ active: get(showTxBytes) })]);
          append($$anchor3, button_4);
        };
        if_block(node_3, ($$render) => {
          if (get(hasTxBytes)) $$render(consequent_2);
        });
      }
      var node_4 = sibling(node_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var button_5 = root_5();
          button_5.__click = [performDryRun, hasTxBytes, isDryRunning, value, dryRunError];
          var text2 = child(button_5);
          template_effect(() => {
            button_5.disabled = get(isDryRunning);
            set_text(text2, get(isDryRunning) ? "Running..." : get(hasDryRunResults) ? "Re-run Dry" : "Dry Run");
          });
          append($$anchor3, button_5);
        };
        if_block(node_4, ($$render) => {
          if (get(hasTxBytes)) $$render(consequent_3);
        });
      }
      var button_6 = sibling(node_4, 2);
      button_6.__click = [on_click_5, value];
      var node_5 = sibling(div_1, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var div_2 = root_6();
          var text_1 = child(div_2);
          var button_7 = sibling(text_1);
          button_7.__click = [on_click_6, dryRunError];
          template_effect(() => set_text(text_1, `${get(dryRunError) ?? ""} `));
          append($$anchor3, div_2);
        };
        if_block(node_5, ($$render) => {
          if (get(dryRunError)) $$render(consequent_4);
        });
      }
      var node_6 = sibling(node_5, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var div_3 = root_7();
          var button_8 = child(div_3);
          button_8.__click = [on_click_7, value];
          var pre = sibling(button_8, 2);
          var text_2 = child(pre);
          template_effect(() => set_text(text_2, value().transactionBytes));
          append($$anchor3, div_3);
        };
        var alternate_3 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_7 = first_child(fragment_1);
          {
            var consequent_6 = ($$anchor4) => {
              var div_4 = root_9();
              var node_8 = child(div_4);
              {
                let $0 = user_derived(() => getTransactionData(value()));
                TransactionEffects(node_8, {
                  get transactionData() {
                    return get($0);
                  }
                });
              }
              append($$anchor4, div_4);
            };
            var alternate_2 = ($$anchor4) => {
              var fragment_2 = comment();
              var node_9 = first_child(fragment_2);
              {
                var consequent_7 = ($$anchor5) => {
                  var div_5 = root_11();
                  var node_10 = child(div_5);
                  Root(node_10, {
                    get value() {
                      return value();
                    },
                    defaultExpandedLevel: 1
                  });
                  append($$anchor5, div_5);
                };
                var alternate_1 = ($$anchor5) => {
                  var fragment_3 = comment();
                  var node_11 = first_child(fragment_3);
                  {
                    var consequent_8 = ($$anchor6) => {
                      var div_6 = root_13();
                      var node_12 = child(div_6);
                      {
                        let $0 = user_derived(() => getTransactionData(value()));
                        TransactionCommands(node_12, {
                          get transactionData() {
                            return get($0);
                          }
                        });
                      }
                      append($$anchor6, div_6);
                    };
                    var alternate = ($$anchor6) => {
                      var div_7 = root_14();
                      var pre_1 = child(div_7);
                      var text_3 = child(pre_1);
                      template_effect(($0) => set_text(text_3, $0), [() => formatJsonWithCompactArrays(value())]);
                      append($$anchor6, div_7);
                    };
                    if_block(
                      node_11,
                      ($$render) => {
                        if (get(viewMode) === "commands") $$render(consequent_8);
                        else $$render(alternate, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_3);
                };
                if_block(
                  node_9,
                  ($$render) => {
                    if (get(viewMode) === "tree") $$render(consequent_7);
                    else $$render(alternate_1, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_2);
            };
            if_block(
              node_7,
              ($$render) => {
                if (get(viewMode) === "formatted" && isTransactionData(value())) $$render(consequent_6);
                else $$render(alternate_2, false);
              },
              true
            );
          }
          append($$anchor3, fragment_1);
        };
        if_block(node_6, ($$render) => {
          if (get(showTxBytes) && get(hasTxBytes)) $$render(consequent_5);
          else $$render(alternate_3, false);
        });
      }
      template_effect(
        ($0, $1) => {
          classes_1 = set_class(button_1, 1, "svelte-kj9b95", null, classes_1, $0);
          classes_2 = set_class(button_2, 1, "svelte-kj9b95", null, classes_2, $1);
        },
        [
          () => ({ active: get(viewMode) === "json" }),
          () => ({ active: get(viewMode) === "tree" })
        ]
      );
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (!get(hidden)) $$render(consequent_9);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["click"]);
export {
  TransactionView as T,
  getObjectLink as a,
  getAddressLink as b,
  ternaryToBech32 as c,
  bech32ToTernary as d,
  ed25519HexToTernary as e,
  bytesToUtf8 as f,
  getTransactionLink as g,
  bcsBytesToInteger as h,
  hexToBytes as i,
  ternaryToEd25519Hex as t
};

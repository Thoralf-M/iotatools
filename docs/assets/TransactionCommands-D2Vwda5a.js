import { B as delegate, p as push, N as prop, E as state, F as proxy, Z as user_effect, n as set, g as get, a3 as user_derived, K as comment, J as first_child, b as if_block, k as append, l as pop, f as from_html, c as child, s as sibling, H as each, d as set_attribute, I as index, t as template_effect, Y as set_class, e as set_text, L as text, w as getSelectedNetworkConfig, y as fromBase64, a9 as bcs, aa as bind_checked, h as event, av as to_array } from "./index-CrBkJ6Na.js";
import { I as IotaGraphQLClient } from "./client-BxSjSZII.js";
import { g as getObjectLink } from "./explorer-links-Bx4a9wSX.js";
const sharedPackageCache = {};
const sharedLoadingPackages = {};
const sharedPackageErrors = {};
var root_2 = from_html(`<div class="ptb-controls svelte-19ydf4y"><div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y">Expand All</button> <button class="svelte-19ydf4y">Collapse All</button></div> <div class="controls-divider svelte-19ydf4y"></div> <div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y"><!></button> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Show Types</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Short IDs</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label></div></div>`);
var root_8 = from_html(`<div class="error-item svelte-19ydf4y"> </div>`);
var root_7 = from_html(`<div class="error-banner svelte-19ydf4y"><strong>Package fetch errors:</strong> <!></div>`);
var root_13 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_15 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_16 = from_html(`<span> </span>`);
var root_21 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_23 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_24 = from_html(`<span> </span>`);
var root_17 = from_html(`<span></span>`);
var root_9 = from_html(`<div><a class="command-index svelte-19ydf4y"></a> <button class="expand-btn svelte-19ydf4y"> </button> <div class="command-content svelte-19ydf4y"><span class="command-call"></span> <!></div></div>`);
var root_1 = from_html(`<div class="ptb-view svelte-19ydf4y"><!> <!> <!></div>`);
var root_25 = from_html(`<div class="no-data svelte-19ydf4y">No PTB commands found</div>`);
function TransactionCommands($$anchor, $$props) {
  push($$props, true);
  let showControls = prop($$props, "showControls", 3, true), externalExpandedCommands = prop($$props, "expandedCommands", 19, () => void 0);
  function getPTB(data) {
    if (data?.transaction?.data?.transaction?.kind === "ProgrammableTransaction") {
      return data.transaction.data.transaction;
    }
    if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction) {
      return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction;
    }
    if (data?.input?.transaction) {
      return data.input.transaction;
    }
    if (data?.kind === "ProgrammableTransaction") {
      return data;
    }
    return null;
  }
  function getInputs(data, ptbData) {
    if (ptbData?.inputs) {
      return ptbData.inputs;
    }
    if (data?.transaction?.data?.transaction?.inputs) {
      return data.transaction.data.transaction.inputs;
    }
    if (data?.rawTransaction) {
      try {
        const raw = typeof data.rawTransaction === "string" ? JSON.parse(data.rawTransaction) : data.rawTransaction;
        if (raw?.inputs) {
          return raw.inputs;
        }
      } catch {
      }
    }
    if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs) {
      return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs;
    }
    if (data?.input?.transaction?.inputs) {
      return data.input.transaction.inputs;
    }
    return [];
  }
  let ptb = user_derived(() => getPTB($$props.transactionData));
  let inputs = user_derived(() => getInputs($$props.transactionData, get(ptb)));
  let commands = user_derived(() => get(ptb)?.commands || get(ptb)?.transactions || []);
  let expandedCommands = state(proxy({}));
  let hoveredId = state(null);
  let shortPackageIds = user_derived(() => $$props.shortPackageIds ?? true);
  let showTypeInfo = user_derived(() => $$props.showTypeInfo ?? true);
  let hasAutoFetched = state(false);
  user_effect(() => {
    set(expandedCommands, externalExpandedCommands() ? { ...externalExpandedCommands() } : {}, true);
  });
  function toggle(i) {
    get(expandedCommands)[i] = !get(expandedCommands)[i];
  }
  function expandAll() {
    get(commands).forEach((_, i) => get(expandedCommands)[i] = true);
  }
  function collapseAll() {
    set(expandedCommands, {}, true);
  }
  user_effect(() => {
    if ($$props.commandIndex !== null && $$props.commandIndex >= 0) {
      const element = document.getElementById(`command-${$$props.commandIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!get(expandedCommands)[$$props.commandIndex]) {
          get(expandedCommands)[$$props.commandIndex] = true;
        }
      }
    }
  });
  function trimAddress(address) {
    const addr = address.toLowerCase().replace(/^0x/, "");
    const shortened = addr.replace(/^0+/, "") || "0";
    return `0x${shortened}`;
  }
  function decodePureValue(base64Bytes, type) {
    if (!type) return null;
    try {
      const bytes = fromBase64(base64Bytes);
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
    if (sharedPackageCache[packageId] || sharedLoadingPackages[packageId]) {
      console.log("Skipping package (cached or loading):", packageId);
      return;
    }
    console.log("Fetching package info for:", packageId);
    sharedLoadingPackages[packageId] = true;
    sharedPackageErrors[packageId] = "";
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
        if (!result.data?.package) {
          sharedPackageErrors[packageId] = "Package not found";
          console.error("Package not found:", packageId);
          break;
        }
        const modules = result.data.package.modules?.nodes || [];
        hasMorePages = false;
        for (const module of modules) {
          if (module.functions?.pageInfo?.hasNextPage) {
            hasMorePages = true;
            cursor = module.functions.pageInfo.endCursor;
            break;
          }
        }
        if (allModules.length === 0) {
          allModules = modules.map((m) => ({ name: m.name, functions: { nodes: m.functions?.nodes || [] } }));
        } else {
          modules.forEach((newModule, idx) => {
            if (allModules[idx]) {
              allModules[idx].functions.nodes.push(...newModule.functions?.nodes || []);
            }
          });
        }
        if (!hasMorePages) {
          sharedPackageCache[packageId] = {
            address: result.data.package.address,
            modules: { nodes: allModules }
          };
          console.log("Package data fetched:", packageId, sharedPackageCache[packageId]);
        }
      }
    } catch (error) {
      console.error("Error fetching package:", packageId, error);
      sharedPackageErrors[packageId] = error.message || "Failed to fetch package info";
    } finally {
      sharedLoadingPackages[packageId] = false;
    }
  }
  function getFunctionInfo(packageId, moduleName, functionName) {
    if (!get(showTypeInfo)) return null;
    const pkg = sharedPackageCache[packageId];
    if (!pkg) return null;
    const module = pkg.modules?.nodes?.find((m) => m.name === moduleName);
    if (!module) return null;
    return module.functions?.nodes?.find((f) => f.name === functionName);
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
      segments.push(...formatType(paramType, full, true, []));
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
          if (input.valueType === "vector<u8>") {
            try {
              const uint8Array = new Uint8Array(input.value);
              const str = new TextDecoder().decode(uint8Array);
              if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
                const displayStr = full ? `"${str}"` : `"${str.slice(0, 10)}${str.length > 10 ? "..." : ""}"`;
                segments.push({ type: "text", value: `Pure(${displayStr})` });
              } else {
                const byteStr = JSON.stringify(input.value);
                const val = full ? byteStr : `[${input.value.slice(0, 5).join(", ")}${input.value.length > 5 ? ", ..." : ""}]`;
                segments.push({ type: "text", value: `Pure(${val})` });
              }
            } catch (e) {
              const valueStr = JSON.stringify(input.value);
              const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
              segments.push({ type: "text", value: `Pure(${val})` });
            }
          } else {
            const valueStr = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
            const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
            segments.push({ type: "text", value: `Pure(${val})` });
          }
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
  function substituteTypeArgs(typeStr, typeArgs) {
    if (!typeStr) return "unknown";
    return typeStr.replace(/\$(\d+)/g, (match, index2) => {
      const idx = parseInt(index2);
      return typeArgs[idx] || match;
    });
  }
  function formatType(type, full, interactive = true, typeArgs = []) {
    const segments = [];
    if (!type) {
      segments.push({ type: "text", value: "unknown" });
      return segments;
    }
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
      segments.push(...formatType(baseType, full, interactive, typeArgs));
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
        segments.push(...formatType(param, full, interactive, typeArgs));
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
      const typeArgs = data.type_arguments || [];
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
          segments.push(...formatType(typeArg, full, true, typeArgs));
        });
        segments.push({ type: "text", value: ">" });
      }
      segments.push({ type: "text", value: "(" });
      const funcInfo = getFunctionInfo(pkg, mod, fun);
      const paramTypes = funcInfo?.parameters || [];
      if (full && args.length > 0) {
        segments.push({ type: "text", value: "\n    " });
        args.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ",\n    " });
          const paramType = paramTypes[i]?.repr ? substituteTypeArgs(paramTypes[i].repr, typeArgs) : null;
          segments.push(...resolveArgument(arg, full, paramType));
        });
        segments.push({ type: "text", value: "\n)" });
      } else {
        args.forEach((arg, i) => {
          if (i > 0) segments.push({ type: "text", value: ", " });
          const paramType = paramTypes[i]?.repr ? substituteTypeArgs(paramTypes[i].repr, typeArgs) : null;
          segments.push(...resolveArgument(arg, full, paramType));
        });
        segments.push({ type: "text", value: ")" });
      }
      if (funcInfo?.return) {
        const returnTypes = funcInfo.return;
        if (Array.isArray(returnTypes) && returnTypes.length > 0) {
          segments.push({ type: "text", value: "-> " });
          const usage = getUsage(index2, get(commands));
          const hasNestedResults = usage.length > 0 && usage.some((s) => s.value.includes("Result("));
          if (hasNestedResults) {
            usage.forEach((seg, idx) => {
              if (seg.type === "text" && seg.value.includes("->")) {
                return;
              }
              if (seg.type === "result-def") {
                let indent = "  ";
                if (idx === 1) indent = "";
                segments.push({ type: "text", value: indent });
                segments.push(seg);
                const resultMatch = seg.value.match(/Result\((\d+)(?:, (\d+))?\)/);
                if (resultMatch) {
                  const nestedIdx = resultMatch[2] ? parseInt(resultMatch[2]) : null;
                  const typeInfo = nestedIdx !== null ? returnTypes[nestedIdx] : returnTypes[0];
                  if (typeInfo?.repr) {
                    segments.push({ type: "text", value: ": " });
                    const typeSegments = formatType(substituteTypeArgs(typeInfo.repr, typeArgs), full, true, typeArgs);
                    typeSegments.forEach((s) => {
                      s.id = seg.id;
                    });
                    segments.push(...typeSegments);
                  }
                }
              } else {
                if (seg.type === "text" && seg.value === ", ") {
                  segments.push({ type: "text", value: ",\n  " });
                } else {
                  segments.push(seg);
                }
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
              const typeSegments = formatType(substituteTypeArgs(returnTypes[0].repr || "unknown", typeArgs), full, true, typeArgs);
              typeSegments.forEach((s) => s.id = `result:${index2}`);
              segments.push(...typeSegments);
            } else {
              segments.push({ type: "text", value: "(" });
              returnTypes.forEach((ret, i) => {
                if (i > 0) segments.push({ type: "text", value: ", " });
                const typeSegments = formatType(substituteTypeArgs(ret.repr || "unknown", typeArgs), full, true, typeArgs);
                typeSegments.forEach((s) => s.id = `result:${index2}`);
                segments.push(...typeSegments);
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
      const type = Array.isArray(data) ? data[0] : data.type || "Unknown";
      const elements = Array.isArray(data) ? data[1] : data.elements || [];
      segments.push({ type: "text", value: "MakeMoveVec<" });
      segments.push(...formatType(type, full, true, []));
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
      segments.push({ type: "text", value: " -> " });
      segments.push({
        type: "result-def",
        value: `Result(${index2})`,
        id: `result:${index2}`
      });
      segments.push({ type: "text", value: ": vector<" });
      segments.push(...formatType(type, full, true, []));
      segments.push({ type: "text", value: ">" });
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
    return packages.length > 0 && packages.every((pkg) => sharedPackageCache[pkg]);
  }
  async function loadAllPackages() {
    const packages = getUniquePackages();
    console.log("Loading packages:", packages);
    for (const pkg of packages) {
      await fetchPackageInfo(pkg);
    }
  }
  user_effect(() => {
    $$props.transactionData;
    set(hasAutoFetched, false);
  });
  user_effect(() => {
    if (get(commands).length > 0 && !get(hasAutoFetched) && !hasPackagesCached()) {
      set(hasAutoFetched, true);
      loadAllPackages();
    }
  });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_11 = ($$anchor2) => {
      var div = root_1();
      var node_1 = child(div);
      {
        var consequent_2 = ($$anchor3) => {
          var div_1 = root_2();
          var div_2 = child(div_1);
          var button = child(div_2);
          button.__click = expandAll;
          var button_1 = sibling(button, 2);
          button_1.__click = collapseAll;
          var div_3 = sibling(div_2, 4);
          var button_2 = child(div_3);
          button_2.__click = loadAllPackages;
          var node_2 = child(button_2);
          {
            var consequent = ($$anchor4) => {
              var text$1 = text("Loading...");
              append($$anchor4, text$1);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_1 = comment();
              var node_3 = first_child(fragment_1);
              {
                var consequent_1 = ($$anchor5) => {
                  var text_1 = text("Type info fetched ✓");
                  append($$anchor5, text_1);
                };
                var alternate = ($$anchor5) => {
                  var text_2 = text("Fetch Type Info");
                  append($$anchor5, text_2);
                };
                if_block(
                  node_3,
                  ($$render) => {
                    if (hasPackagesCached()) $$render(consequent_1);
                    else $$render(alternate, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_1);
            };
            if_block(node_2, ($$render) => {
              if (Object.keys(sharedLoadingPackages).some((k) => sharedLoadingPackages[k])) $$render(consequent);
              else $$render(alternate_1, false);
            });
          }
          var label = sibling(button_2, 2);
          var div_4 = sibling(child(label), 2);
          var input_1 = child(div_4);
          var label_1 = sibling(label, 2);
          var div_5 = sibling(child(label_1), 2);
          var input_2 = child(div_5);
          template_effect(($0) => button_2.disabled = $0, [
            () => Object.keys(sharedLoadingPackages).some((k) => sharedLoadingPackages[k]) || hasPackagesCached()
          ]);
          bind_checked(input_1, () => get(showTypeInfo), ($$value) => set(showTypeInfo, $$value));
          bind_checked(input_2, () => get(shortPackageIds), ($$value) => set(shortPackageIds, $$value));
          append($$anchor3, div_1);
        };
        if_block(node_1, ($$render) => {
          if (showControls()) $$render(consequent_2);
        });
      }
      var node_4 = sibling(node_1, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var div_6 = root_7();
          var node_5 = sibling(child(div_6), 2);
          each(node_5, 17, () => Object.entries(sharedPackageErrors).filter(([_, err]) => err), index, ($$anchor4, $$item) => {
            var $$array = user_derived(() => to_array(get($$item), 2));
            let pkg = () => get($$array)[0];
            let err = () => get($$array)[1];
            var div_7 = root_8();
            var text_3 = child(div_7);
            template_effect(() => set_text(text_3, `${pkg() ?? ""}: ${err() ?? ""}`));
            append($$anchor4, div_7);
          });
          append($$anchor3, div_6);
        };
        if_block(node_4, ($$render) => {
          if (Object.keys(sharedPackageErrors).some((k) => sharedPackageErrors[k])) $$render(consequent_3);
        });
      }
      var node_6 = sibling(node_4, 2);
      each(node_6, 17, () => get(commands), index, ($$anchor3, command, i) => {
        const formattedSegments = user_derived(() => formatCommand(get(command), i, get(expandedCommands)[i]));
        const arrowIndex = user_derived(() => get(formattedSegments).findIndex((s) => s.type === "text" && s.value.includes(" -> ")));
        var div_8 = root_9();
        let classes;
        set_attribute(div_8, "id", `command-${i}`);
        var a = child(div_8);
        a.__click = (e) => {
          e.preventDefault();
          const hashParts = window.location.hash.split("?");
          const path = hashParts[0];
          const params = new URLSearchParams(hashParts[1] || "");
          params.set("view", "commands");
          params.set("commandIndex", i.toString());
          const fullUrl = window.location.origin + path + "?" + params.toString();
          navigator.clipboard.writeText(fullUrl);
          $$props.onCommandIndexChange(i);
        };
        a.textContent = i;
        var button_3 = sibling(a, 2);
        button_3.__click = () => {
          toggle(i);
          $$props.onCommandIndexChange(null);
        };
        var text_4 = child(button_3);
        var div_9 = sibling(button_3, 2);
        var span = child(div_9);
        each(
          span,
          21,
          () => get(formattedSegments).slice(0, get(arrowIndex) === -1 ? get(formattedSegments).length : get(arrowIndex) + 1),
          index,
          ($$anchor4, segment) => {
            var fragment_2 = comment();
            var node_7 = first_child(fragment_2);
            {
              var consequent_4 = ($$anchor5) => {
                var text_5 = text();
                template_effect(() => set_text(text_5, get(segment).value));
                append($$anchor5, text_5);
              };
              var alternate_4 = ($$anchor5) => {
                var fragment_4 = comment();
                var node_8 = first_child(fragment_4);
                {
                  var consequent_5 = ($$anchor6) => {
                    const packageId = user_derived(() => get(segment).id?.split("::")[0].replace("pkg:", "") ?? "");
                    var a_1 = root_13();
                    let classes_1;
                    a_1.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                    a_1.__mouseout = () => set(hoveredId, null);
                    var text_6 = child(a_1);
                    template_effect(
                      ($0, $1) => {
                        set_attribute(a_1, "href", $0);
                        classes_1 = set_class(a_1, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_1, $1);
                        set_attribute(a_1, "title", get(packageId));
                        set_text(text_6, get(segment).value);
                      },
                      [
                        () => getObjectLink(getSelectedNetworkConfig(), get(packageId)),
                        () => ({
                          highlighted: isHighlighted(get(segment).id, get(hoveredId))
                        })
                      ]
                    );
                    event("focus", a_1, () => set(hoveredId, get(segment).id ?? null, true));
                    event("blur", a_1, () => set(hoveredId, null));
                    append($$anchor6, a_1);
                  };
                  var alternate_3 = ($$anchor6) => {
                    var fragment_5 = comment();
                    var node_9 = first_child(fragment_5);
                    {
                      var consequent_6 = ($$anchor7) => {
                        const objectId = user_derived(() => get(segment).id?.replace("obj:", "") ?? "");
                        var a_2 = root_15();
                        let classes_2;
                        a_2.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                        a_2.__mouseout = () => set(hoveredId, null);
                        var text_7 = child(a_2);
                        template_effect(
                          ($0, $1) => {
                            set_attribute(a_2, "href", $0);
                            classes_2 = set_class(a_2, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_2, $1);
                            set_attribute(a_2, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
                            set_text(text_7, get(segment).value);
                          },
                          [
                            () => getObjectLink(getSelectedNetworkConfig(), get(objectId)),
                            () => ({
                              highlighted: isHighlighted(get(segment).id, get(hoveredId))
                            })
                          ]
                        );
                        event("focus", a_2, () => set(hoveredId, get(segment).id ?? null, true));
                        event("blur", a_2, () => set(hoveredId, null));
                        append($$anchor7, a_2);
                      };
                      var alternate_2 = ($$anchor7) => {
                        var span_1 = root_16();
                        let classes_3;
                        span_1.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                        span_1.__mouseout = () => set(hoveredId, null);
                        var text_8 = child(span_1);
                        template_effect(
                          ($0) => {
                            classes_3 = set_class(span_1, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-19ydf4y", classes_3, $0);
                            set_text(text_8, get(segment).value);
                          },
                          [
                            () => ({
                              highlighted: isHighlighted(get(segment).id, get(hoveredId))
                            })
                          ]
                        );
                        append($$anchor7, span_1);
                      };
                      if_block(
                        node_9,
                        ($$render) => {
                          if (get(segment).type === "object-id") $$render(consequent_6);
                          else $$render(alternate_2, false);
                        },
                        true
                      );
                    }
                    append($$anchor6, fragment_5);
                  };
                  if_block(
                    node_8,
                    ($$render) => {
                      if (get(segment).type === "package") $$render(consequent_5);
                      else $$render(alternate_3, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_4);
              };
              if_block(node_7, ($$render) => {
                if (get(segment).type === "text") $$render(consequent_4);
                else $$render(alternate_4, false);
              });
            }
            append($$anchor4, fragment_2);
          }
        );
        var node_10 = sibling(span, 2);
        {
          var consequent_10 = ($$anchor4) => {
            var span_2 = root_17();
            let classes_4;
            each(span_2, 21, () => get(formattedSegments).slice(get(arrowIndex) + 1), index, ($$anchor5, segment) => {
              var fragment_6 = comment();
              var node_11 = first_child(fragment_6);
              {
                var consequent_7 = ($$anchor6) => {
                  var text_9 = text();
                  template_effect(() => set_text(text_9, get(segment).value));
                  append($$anchor6, text_9);
                };
                var alternate_7 = ($$anchor6) => {
                  var fragment_8 = comment();
                  var node_12 = first_child(fragment_8);
                  {
                    var consequent_8 = ($$anchor7) => {
                      const packageId = user_derived(() => get(segment).id?.split("::")[0].replace("pkg:", "") ?? "");
                      var a_3 = root_21();
                      let classes_5;
                      a_3.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                      a_3.__mouseout = () => set(hoveredId, null);
                      var text_10 = child(a_3);
                      template_effect(
                        ($0, $1) => {
                          set_attribute(a_3, "href", $0);
                          classes_5 = set_class(a_3, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_5, $1);
                          set_attribute(a_3, "title", get(packageId));
                          set_text(text_10, get(segment).value);
                        },
                        [
                          () => getObjectLink(getSelectedNetworkConfig(), get(packageId)),
                          () => ({
                            highlighted: isHighlighted(get(segment).id, get(hoveredId))
                          })
                        ]
                      );
                      event("focus", a_3, () => set(hoveredId, get(segment).id ?? null, true));
                      event("blur", a_3, () => set(hoveredId, null));
                      append($$anchor7, a_3);
                    };
                    var alternate_6 = ($$anchor7) => {
                      var fragment_9 = comment();
                      var node_13 = first_child(fragment_9);
                      {
                        var consequent_9 = ($$anchor8) => {
                          const objectId = user_derived(() => get(segment).id?.replace("obj:", "") ?? "");
                          var a_4 = root_23();
                          let classes_6;
                          a_4.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                          a_4.__mouseout = () => set(hoveredId, null);
                          var text_11 = child(a_4);
                          template_effect(
                            ($0, $1) => {
                              set_attribute(a_4, "href", $0);
                              classes_6 = set_class(a_4, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_6, $1);
                              set_attribute(a_4, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
                              set_text(text_11, get(segment).value);
                            },
                            [
                              () => getObjectLink(getSelectedNetworkConfig(), get(objectId)),
                              () => ({
                                highlighted: isHighlighted(get(segment).id, get(hoveredId))
                              })
                            ]
                          );
                          event("focus", a_4, () => set(hoveredId, get(segment).id ?? null, true));
                          event("blur", a_4, () => set(hoveredId, null));
                          append($$anchor8, a_4);
                        };
                        var alternate_5 = ($$anchor8) => {
                          var span_3 = root_24();
                          let classes_7;
                          span_3.__mouseover = () => set(hoveredId, get(segment).id ?? null, true);
                          span_3.__mouseout = () => set(hoveredId, null);
                          var text_12 = child(span_3);
                          template_effect(
                            ($0) => {
                              classes_7 = set_class(span_3, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-19ydf4y", classes_7, $0);
                              set_text(text_12, get(segment).value);
                            },
                            [
                              () => ({
                                highlighted: isHighlighted(get(segment).id, get(hoveredId))
                              })
                            ]
                          );
                          append($$anchor8, span_3);
                        };
                        if_block(
                          node_13,
                          ($$render) => {
                            if (get(segment).type === "object-id") $$render(consequent_9);
                            else $$render(alternate_5, false);
                          },
                          true
                        );
                      }
                      append($$anchor7, fragment_9);
                    };
                    if_block(
                      node_12,
                      ($$render) => {
                        if (get(segment).type === "package") $$render(consequent_8);
                        else $$render(alternate_6, false);
                      },
                      true
                    );
                  }
                  append($$anchor6, fragment_8);
                };
                if_block(node_11, ($$render) => {
                  if (get(segment).type === "text") $$render(consequent_7);
                  else $$render(alternate_7, false);
                });
              }
              append($$anchor5, fragment_6);
            });
            template_effect(($0) => classes_4 = set_class(span_2, 1, "command-result", null, classes_4, $0), [
              () => ({
                "highlighted-row": get(hoveredId)?.startsWith("result:" + i)
              })
            ]);
            append($$anchor4, span_2);
          };
          if_block(node_10, ($$render) => {
            if (get(arrowIndex) !== -1) $$render(consequent_10);
          });
        }
        template_effect(
          ($0) => {
            classes = set_class(div_8, 1, "command-item svelte-19ydf4y", null, classes, { selected: i === $$props.commandIndex });
            set_attribute(a, "href", $0);
            set_text(text_4, get(expandedCommands)[i] ? "▼" : "▶");
          },
          [
            () => (() => {
              const hashParts = window.location.hash.split("?");
              const path = hashParts[0];
              const params = new URLSearchParams(hashParts[1] || "");
              params.set("view", "commands");
              params.set("commandIndex", i.toString());
              return window.location.origin + path + "?" + params.toString();
            })()
          ]
        );
        append($$anchor3, div_8);
      });
      append($$anchor2, div);
    };
    var alternate_8 = ($$anchor2) => {
      var div_10 = root_25();
      append($$anchor2, div_10);
    };
    if_block(node, ($$render) => {
      if (get(commands).length > 0) $$render(consequent_11);
      else $$render(alternate_8, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["click", "mouseover", "mouseout"]);
export {
  TransactionCommands as T
};

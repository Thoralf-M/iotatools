import { B as delegate, p as push, N as prop, E as state, F as proxy, Z as user_effect, n as set, g as get, L as user_derived, K as comment, J as first_child, b as if_block, k as append, l as pop, f as from_html, c as child, s as sibling, H as each, d as set_attribute, I as index, t as template_effect, Y as set_class, e as set_text, M as text, w as getSelectedNetworkConfig, y as fromBase64, a7 as bcs, ab as bind_checked, h as event, ad as to_array, P as legacy_pre_effect, m as mutable_source, Q as deep_read_state, R as legacy_pre_effect_reset, i as init, S as untrack, X as set_style, af as derived_safe_equal, bb as Signer, A as toBase64, bc as PasskeyPublicKey, bd as Secp256r1PublicKey, be as Secp256k1PublicKey, aA as Ed25519PublicKey, aF as parseSerializedSignature, bf as PublicKey, z as iotaBcs, bg as SIGNATURE_FLAG_TO_SCHEME, bh as SIGNATURE_SCHEME_TO_FLAG, G as normalizeIotaAddress, b6 as bytesToHex, bi as blake2b, bj as bytesEqual, at as toHex, T as TransactionDataBuilder, o as getClient } from "./index-B9yj1ziJ.js";
import { f as formatJsonWithCompactArrays, r as removeKindFields, i as isTransactionData, g as getTransactionData, R as Root } from "./transaction-view-Cdv5G4iT.js";
import { g as getObjectLink, a as getTransactionLink, b as getAddressLink } from "./explorer-links-Bx4a9wSX.js";
import { I as IotaGraphQLClient } from "./client-CXIn3CzC.js";
import { a as formatNumberWithUnderscores, n as nanoToIota } from "./iota-nano-conversion-CxrsBrHh.js";
import { b as bufferExports } from "./index-CvJZrfk_.js";
import { c as copyToClipboard } from "./formatting-DskCwl5J.js";
const sharedPackageCache = {};
const sharedLoadingPackages = {};
const sharedPackageErrors = {};
var root_2$3 = from_html(`<div class="ptb-controls svelte-19ydf4y"><div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y">Expand All</button> <button class="svelte-19ydf4y">Collapse All</button></div> <div class="controls-divider svelte-19ydf4y"></div> <div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y"><!></button> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Show Types</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Short IDs</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label></div></div>`);
var root_8$3 = from_html(`<div class="error-item svelte-19ydf4y"> </div>`);
var root_7$3 = from_html(`<div class="error-banner svelte-19ydf4y"><strong>Package fetch errors:</strong> <!></div>`);
var root_13$2 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_15$2 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_16$2 = from_html(`<span> </span>`);
var root_21$1 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_23$1 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_24$2 = from_html(`<span> </span>`);
var root_17$1 = from_html(`<span></span>`);
var root_9$2 = from_html(`<div><a class="command-index svelte-19ydf4y"></a> <button class="expand-btn svelte-19ydf4y"> </button> <div class="command-content svelte-19ydf4y"><span class="command-call"></span> <!></div></div>`);
var root_1$3 = from_html(`<div class="ptb-view svelte-19ydf4y"><!> <!> <!></div>`);
var root_25$2 = from_html(`<div class="no-data svelte-19ydf4y">No PTB commands found</div>`);
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
      var div = root_1$3();
      var node_1 = child(div);
      {
        var consequent_2 = ($$anchor3) => {
          var div_1 = root_2$3();
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
          var div_6 = root_7$3();
          var node_5 = sibling(child(div_6), 2);
          each(node_5, 17, () => Object.entries(sharedPackageErrors).filter(([_, err]) => err), index, ($$anchor4, $$item) => {
            var $$array = user_derived(() => to_array(get($$item), 2));
            let pkg = () => get($$array)[0];
            let err = () => get($$array)[1];
            var div_7 = root_8$3();
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
        var div_8 = root_9$2();
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
                    var a_1 = root_13$2();
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
                        var a_2 = root_15$2();
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
                        var span_1 = root_16$2();
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
            var span_2 = root_17$1();
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
                      var a_3 = root_21$1();
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
                          var a_4 = root_23$1();
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
                          var span_3 = root_24$2();
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
      var div_10 = root_25$2();
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
    const bytes = fromBase64(base64);
    const utf8 = bytesToUtf8(bytes);
    const integer = bcsBytesToInteger(bytes);
    return { bytes, utf8, integer };
  } catch {
    return null;
  }
}
var root_2$2 = from_html(`<span class="checkpoint-info svelte-1n6aswm"> </span>`);
var root_3$2 = from_html(`<span class="epoch-info svelte-1n6aswm"> </span>`);
var root_4$2 = from_html(`<span class="time-info svelte-1n6aswm"> </span>`);
var root_5$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="field-value link-style svelte-1n6aswm"> </a>`);
var root_6$2 = from_html(`<span class="field-value svelte-1n6aswm">N/A</span>`);
var root_7$2 = from_html(`<div class="fee-main"><span class="field-label svelte-1n6aswm">Fee:</span> <span class="gas-fee svelte-1n6aswm"> </span> <span class="field-label svelte-1n6aswm">Storage cost:</span> <span class="field-value svelte-1n6aswm"> </span> <span class="field-label svelte-1n6aswm">Rebate:</span> <span class="field-value svelte-1n6aswm"> </span></div>`);
var root_10$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="full-address link-style svelte-1n6aswm"> </a>`);
var root_11 = from_html(`<div class="full-address svelte-1n6aswm">N/A</div>`);
var root_9$1 = from_html(`<div class="balance-box negative svelte-1n6aswm"><!> <div class="amount-value svelte-1n6aswm"> </div></div>`);
var root_13$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="full-address link-style svelte-1n6aswm"> </a>`);
var root_14$1 = from_html(`<div class="full-address svelte-1n6aswm">N/A</div>`);
var root_12$1 = from_html(`<div class="balance-box positive svelte-1n6aswm"><!> <div class="amount-value svelte-1n6aswm"> </div></div>`);
var root_8$2 = from_html(`<div class="section svelte-1n6aswm"><h4 class="svelte-1n6aswm"> </h4> <div class="balance-columns svelte-1n6aswm"><div class="negative-changes svelte-1n6aswm"><h5 class="column-header deleted svelte-1n6aswm"> </h5> <div class="balance-content svelte-1n6aswm"></div></div> <div class="positive-changes svelte-1n6aswm"><h5 class="column-header created svelte-1n6aswm"> </h5> <div class="balance-content svelte-1n6aswm"></div></div></div></div>`);
var root_17 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a>`);
var root_19 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a>`);
var root_20$1 = from_html(`<div class="object-type svelte-1n6aswm"> </div>`);
var root_21 = from_html(`<div class="object-version svelte-1n6aswm"> </div>`);
var root_22$1 = from_html(`<div class="object-sender svelte-1n6aswm"> </div>`);
var root_23 = from_html(`<details class="state-collapsible svelte-1n6aswm" open><summary class="state-summary svelte-1n6aswm">Previous State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`);
var root_16$1 = from_html(`<div class="object-box deleted svelte-1n6aswm"><!> <!> <!> <!> <!></div>`);
var root_26 = from_html(`<details class="state-collapsible svelte-1n6aswm"><summary class="state-summary svelte-1n6aswm">Previous State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`);
var root_25$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <details class="state-collapsible svelte-1n6aswm" open><summary class="state-summary svelte-1n6aswm">Current State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`, 1);
var root_29 = from_html(`<div class="object-type svelte-1n6aswm"> </div>`);
var root_30 = from_html(`<div class="object-owner svelte-1n6aswm"> </div>`);
var root_31 = from_html(`<div class="object-version svelte-1n6aswm"> </div>`);
var root_32 = from_html(`<div class="object-previous-version svelte-1n6aswm"> </div>`);
var root_28 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <!> <!> <!>`, 1);
var root_34 = from_html(`<details class="state-collapsible svelte-1n6aswm"><summary class="state-summary svelte-1n6aswm">Previous State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`);
var root_33 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!>`, 1);
var root_24$1 = from_html(`<div class="object-box mutated svelte-1n6aswm"><!></div>`);
var root_36 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <details class="state-collapsible svelte-1n6aswm" open><summary class="state-summary svelte-1n6aswm">Object State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`, 1);
var root_39 = from_html(`<div class="object-type svelte-1n6aswm"> </div>`);
var root_40 = from_html(`<div class="object-owner svelte-1n6aswm"> </div>`);
var root_41 = from_html(`<div class="object-version svelte-1n6aswm"> </div>`);
var root_38 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <!> <!>`, 1);
var root_42 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a>`);
var root_35 = from_html(`<div class="object-box created svelte-1n6aswm"><!></div>`);
var root_15$1 = from_html(`<div class="section svelte-1n6aswm"><h4 class="svelte-1n6aswm"> </h4> <div class="object-columns-three svelte-1n6aswm"><div class="deleted-objects svelte-1n6aswm"><h5 class="column-header deleted svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div> <div class="mutated-objects svelte-1n6aswm"><h5 class="column-header mutated svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div> <div class="created-objects svelte-1n6aswm"><h5 class="column-header created svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div></div></div>`);
var root_45 = from_html(`<pre class="event-data svelte-1n6aswm"> </pre>`);
var root_44 = from_html(`<div class="event-item svelte-1n6aswm"><span class="event-index svelte-1n6aswm"></span> <span class="event-type svelte-1n6aswm"> </span> <!></div>`);
var root_43 = from_html(`<div class="section svelte-1n6aswm"><details class="events-collapsible svelte-1n6aswm"><summary class="svelte-1n6aswm"> </summary> <div class="events-content"></div></details></div>`);
var root_48 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_49 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_47 = from_html(`<div class="command-item svelte-1n6aswm"><span class="command-index svelte-1n6aswm"></span> <span class="command-kind svelte-1n6aswm"> </span> <div class="command-data svelte-1n6aswm"><!></div></div>`);
var root_46 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="commands-list svelte-1n6aswm"></div></div>`);
var root_54 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_55 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_56 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_52 = from_html(`<div class="command-item svelte-1n6aswm"><span class="command-index svelte-1n6aswm"></span> <span class="command-kind svelte-1n6aswm"> </span> <div class="command-data svelte-1n6aswm"><!></div></div>`);
var root_51 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="commands-list svelte-1n6aswm"></div></div>`);
var root_60 = from_html(`<div class="decoded-bytes svelte-1n6aswm"><div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm">UTF-8:</span> <span class="decode-value svelte-1n6aswm"> </span></div> <div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm"> </span> <span class="decode-value svelte-1n6aswm"> </span></div> <div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm">Bytes:</span> <span class="decode-value svelte-1n6aswm"> </span></div></div>`);
var root_58 = from_html(`<div class="input-item svelte-1n6aswm"><span class="input-index svelte-1n6aswm"></span> <span class="input-kind svelte-1n6aswm"> </span> <div class="input-data svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre> <!></div></div>`);
var root_57 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Inputs:</span> <div class="inputs-list svelte-1n6aswm"></div></div>`);
var root_63 = from_html(`<div class="input-item svelte-1n6aswm"><span class="input-index svelte-1n6aswm"></span> <span class="input-kind svelte-1n6aswm"> </span> <div class="input-data svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></div>`);
var root_62 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Inputs:</span> <div class="inputs-list svelte-1n6aswm"></div></div>`);
var root_67 = from_html(`<span class="separator svelte-1n6aswm">,</span>`);
var root_66 = from_html(`<span class="payment-object svelte-1n6aswm"> </span> <!>`, 1);
var root_64 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Gas Data:</span> <div class="gas-info svelte-1n6aswm"><div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Payment:</span> <span class="field-value svelte-1n6aswm"><!></span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Owner:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Price:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Budget:</span> <span class="field-value svelte-1n6aswm"> </span></div></div></div>`);
var root_73 = from_html(`<span class="separator svelte-1n6aswm">,</span>`);
var root_72 = from_html(`<span class="payment-object svelte-1n6aswm"> </span> <!>`, 1);
var root_70 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Gas Data:</span> <div class="gas-info svelte-1n6aswm"><div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Payment:</span> <span class="field-value svelte-1n6aswm"><!></span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Owner:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Price:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Budget:</span> <span class="field-value svelte-1n6aswm"> </span></div></div></div>`);
var root_79 = from_html(`<div class="output-bytes svelte-1n6aswm"><span class="bytes-label svelte-1n6aswm">Bytes:</span> <div class="bytes-array svelte-1n6aswm"> </div></div>`);
var root_80 = from_html(`<div class="output-object-type svelte-1n6aswm"><span class="type-label svelte-1n6aswm">Type:</span> <span class="type-value svelte-1n6aswm"> </span></div>`);
var root_78 = from_html(`<div class="reference-output svelte-1n6aswm"><div class="output-header svelte-1n6aswm"><span class="output-index svelte-1n6aswm"></span> <span class="output-type svelte-1n6aswm"> </span></div> <!> <!></div>`);
var root_77 = from_html(`<div class="mutable-references svelte-1n6aswm"><h6 class="svelte-1n6aswm"> </h6> <!></div>`);
var root_83 = from_html(`<div class="return-bytes svelte-1n6aswm"><span class="bytes-label svelte-1n6aswm">Bytes:</span> <div class="bytes-array svelte-1n6aswm"> </div></div>`);
var root_84 = from_html(`<div class="return-object-type svelte-1n6aswm"><span class="type-label svelte-1n6aswm">Type:</span> <span class="type-value svelte-1n6aswm"> </span></div>`);
var root_82 = from_html(`<div class="return-value svelte-1n6aswm"><div class="return-header svelte-1n6aswm"><span class="return-index svelte-1n6aswm"></span></div> <!> <!></div>`);
var root_81 = from_html(`<div class="return-values svelte-1n6aswm"><h6 class="svelte-1n6aswm"> </h6> <!></div>`);
var root_85 = from_html(`<div class="result-raw svelte-1n6aswm"><details class="raw-collapsible svelte-1n6aswm"><summary class="svelte-1n6aswm">Raw Result Data</summary> <pre class="svelte-1n6aswm"> </pre></details></div>`);
var root_76 = from_html(`<div class="dev-inspect-item svelte-1n6aswm"><div class="result-header svelte-1n6aswm"><span class="result-index svelte-1n6aswm"></span></div> <!> <!> <!></div>`);
var root_75 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="dev-inspect-results svelte-1n6aswm"></div></div>`);
var root_87 = from_html(`<div class="raw-result-item svelte-1n6aswm"><div class="raw-result-header svelte-1n6aswm"><span class="raw-result-index svelte-1n6aswm"></span></div> <div class="raw-result-content svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></div>`);
var root_86 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="raw-results svelte-1n6aswm"></div></div>`);
var root_1$2 = from_html(`<div class="header-line svelte-1n6aswm"><span class="tx-header svelte-1n6aswm">Transaction</span> <a target="_blank" rel="noopener noreferrer" class="tx-id-short svelte-1n6aswm"> </a> <span class="status svelte-1n6aswm"> </span> <!> <!> <!></div> <div class="sender-fee-line svelte-1n6aswm"><div class="sender-section"><span class="field-label svelte-1n6aswm">Sender:</span> <!></div> <div class="fee-section"><!></div></div> <!> <!> <!> <!> <!> <!> <!> <!>`, 1);
var root_89 = from_html(`<div class="no-data svelte-1n6aswm">No transaction effects data available</div>`);
var root = from_html(`<div class="transaction-effects svelte-1n6aswm"><!></div>`);
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
    const statusString = typeof status === "string" ? status : status?.status;
    switch (statusString?.toUpperCase()) {
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
    return typeof status === "string" ? status : status?.status || "Unknown";
  }
  legacy_pre_effect(() => deep_read_state(transactionData()), () => {
    set(effects, transactionData()?.effects);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(balanceChanges, transactionData()?.balanceChanges || get(effects)?.balanceChanges?.nodes || get(effects)?.balanceChanges || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(objectChanges, transactionData()?.objectChanges || get(effects)?.objectChanges?.nodes || get(effects)?.objectChanges || []);
  });
  legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
    set(events, transactionData()?.events || get(effects)?.events?.nodes || get(effects)?.events || []);
  });
  legacy_pre_effect(() => get(objectChanges), () => {
    set(deletedObjects, get(objectChanges).filter((change) => change.idDeleted === true || change.type === "deleted"));
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    set(createdObjects, [
      ...get(objectChanges).filter((change) => change.idCreated === true || change.type === "created"),
      ...(get(effects)?.created || []).map((obj) => ({
        type: "created",
        objectId: obj.reference?.objectId,
        version: obj.reference?.version,
        digest: obj.reference?.digest,
        owner: obj.owner,
        objectType: ""
      }))
    ]);
  });
  legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
    set(mutatedObjects, [
      ...get(objectChanges).filter((change) => change.idDeleted === false && change.idCreated === false || change.type === "mutated"),
      ...(get(effects)?.mutated || []).map((obj) => ({
        type: "mutated",
        objectId: obj.reference?.objectId,
        version: obj.reference?.version,
        digest: obj.reference?.digest,
        owner: obj.owner,
        objectType: ""
      }))
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
    var consequent_54 = ($$anchor2) => {
      var fragment = root_1$2();
      var div_1 = first_child(fragment);
      var a = sibling(child(div_1), 2);
      var text$1 = child(a);
      var span = sibling(a, 2);
      var text_1 = child(span);
      var node_1 = sibling(span, 2);
      {
        var consequent = ($$anchor3) => {
          var span_1 = root_2$2();
          var text_2 = child(span_1);
          template_effect(($0) => set_text(text_2, `Checkpoint: ${$0 ?? ""}`), [
            () => (deep_read_state(formatNumberWithUnderscores), get(effects), untrack(() => formatNumberWithUnderscores(get(effects).checkpoint.sequenceNumber)))
          ]);
          append($$anchor3, span_1);
        };
        if_block(node_1, ($$render) => {
          if (get(effects), untrack(() => get(effects).checkpoint?.sequenceNumber)) $$render(consequent);
        });
      }
      var node_2 = sibling(node_1, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var span_2 = root_3$2();
          var text_3 = child(span_2);
          template_effect(() => set_text(text_3, `Epoch: ${(get(effects), untrack(() => get(effects).executedEpoch)) ?? ""}`));
          append($$anchor3, span_2);
        };
        if_block(node_2, ($$render) => {
          if (get(effects), untrack(() => get(effects).executedEpoch !== void 0)) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var span_3 = root_4$2();
          var text_4 = child(span_3);
          template_effect(($0) => set_text(text_4, $0), [
            () => (get(effects), deep_read_state(transactionData()), untrack(() => new Date(get(effects).checkpoint?.timestamp || transactionData()?.timestamp).toLocaleString()))
          ]);
          append($$anchor3, span_3);
        };
        if_block(node_3, ($$render) => {
          if (get(effects), deep_read_state(transactionData()), untrack(() => get(effects).checkpoint?.timestamp || transactionData()?.timestamp)) $$render(consequent_2);
        });
      }
      var div_2 = sibling(div_1, 2);
      var div_3 = child(div_2);
      var node_4 = sibling(child(div_3), 2);
      {
        var consequent_3 = ($$anchor3) => {
          var a_1 = root_5$1();
          var text_5 = child(a_1);
          template_effect(
            ($0) => {
              set_attribute(a_1, "href", $0);
              set_attribute(a_1, "title", (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
              set_text(text_5, (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
            },
            [
              () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), deep_read_state(transactionData()), untrack(() => getAddressLink(getSelectedNetworkConfig(), transactionData().sender)))
            ]
          );
          append($$anchor3, a_1);
        };
        var alternate = ($$anchor3) => {
          var span_4 = root_6$2();
          append($$anchor3, span_4);
        };
        if_block(node_4, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.sender)) $$render(consequent_3);
          else $$render(alternate, false);
        });
      }
      var div_4 = sibling(div_3, 2);
      var node_5 = child(div_4);
      {
        var consequent_4 = ($$anchor3) => {
          var div_5 = root_7$2();
          var span_5 = sibling(child(div_5), 2);
          var text_6 = child(span_5);
          var span_6 = sibling(span_5, 4);
          var text_7 = child(span_6);
          var span_7 = sibling(span_6, 4);
          var text_8 = child(span_7);
          template_effect(
            ($0, $1, $2) => {
              set_text(text_6, $0);
              set_text(text_7, $1);
              set_text(text_8, $2);
            },
            [
              () => (get(effects), untrack(() => formatGasCost(get(effects).gasEffects.gasSummary))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageCost || 0))),
              () => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageRebate || 0)))
            ]
          );
          append($$anchor3, div_5);
        };
        if_block(node_5, ($$render) => {
          if (get(effects), untrack(() => get(effects).gasEffects?.gasSummary)) $$render(consequent_4);
        });
      }
      var node_6 = sibling(div_2, 2);
      {
        var consequent_7 = ($$anchor3) => {
          var div_6 = root_8$2();
          var h4 = child(div_6);
          var text_9 = child(h4);
          var div_7 = sibling(h4, 2);
          var div_8 = child(div_7);
          var h5 = child(div_8);
          var text_10 = child(h5);
          var div_9 = sibling(h5, 2);
          each(
            div_9,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_10 = root_9$1();
              var node_7 = child(div_10);
              {
                var consequent_5 = ($$anchor5) => {
                  var a_2 = root_10$1();
                  var text_11 = child(a_2);
                  template_effect(
                    ($0) => {
                      set_attribute(a_2, "href", $0);
                      set_attribute(a_2, "title", (get(change), untrack(() => get(change).owner.address)));
                      set_text(text_11, (get(change), untrack(() => get(change).owner.address)));
                    },
                    [
                      () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).owner.address)))
                    ]
                  );
                  append($$anchor5, a_2);
                };
                var alternate_1 = ($$anchor5) => {
                  var div_11 = root_11();
                  append($$anchor5, div_11);
                };
                if_block(node_7, ($$render) => {
                  if (get(change), untrack(() => get(change).owner?.address)) $$render(consequent_5);
                  else $$render(alternate_1, false);
                });
              }
              var div_12 = sibling(node_7, 2);
              var text_12 = child(div_12);
              template_effect(($0) => set_text(text_12, $0), [
                () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
              ]);
              append($$anchor4, div_10);
            }
          );
          var div_13 = sibling(div_8, 2);
          var h5_1 = child(div_13);
          var text_13 = child(h5_1);
          var div_14 = sibling(h5_1, 2);
          each(
            div_14,
            5,
            () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")))),
            index,
            ($$anchor4, change) => {
              var div_15 = root_12$1();
              var node_8 = child(div_15);
              {
                var consequent_6 = ($$anchor5) => {
                  var a_3 = root_13$1();
                  var text_14 = child(a_3);
                  template_effect(
                    ($0) => {
                      set_attribute(a_3, "href", $0);
                      set_attribute(a_3, "title", (get(change), untrack(() => get(change).owner.address)));
                      set_text(text_14, (get(change), untrack(() => get(change).owner.address)));
                    },
                    [
                      () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).owner.address)))
                    ]
                  );
                  append($$anchor5, a_3);
                };
                var alternate_2 = ($$anchor5) => {
                  var div_16 = root_14$1();
                  append($$anchor5, div_16);
                };
                if_block(node_8, ($$render) => {
                  if (get(change), untrack(() => get(change).owner?.address)) $$render(consequent_6);
                  else $$render(alternate_2, false);
                });
              }
              var div_17 = sibling(node_8, 2);
              var text_15 = child(div_17);
              template_effect(($0) => set_text(text_15, $0), [
                () => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))
              ]);
              append($$anchor4, div_15);
            }
          );
          template_effect(
            ($0, $1) => {
              set_text(text_9, `Balance Changes (${(get(balanceChanges), untrack(() => get(balanceChanges).length)) ?? ""}):`);
              set_text(text_10, `Negative Changes (${$0 ?? ""}):`);
              set_text(text_13, `Positive Changes (${$1 ?? ""}):`);
            },
            [
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")).length)),
              () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")).length))
            ]
          );
          append($$anchor3, div_6);
        };
        if_block(node_6, ($$render) => {
          if (get(balanceChanges), untrack(() => get(balanceChanges).length > 0)) $$render(consequent_7);
        });
      }
      var node_9 = sibling(node_6, 2);
      {
        var consequent_27 = ($$anchor3) => {
          var div_18 = root_15$1();
          var h4_1 = child(div_18);
          var text_16 = child(h4_1);
          var div_19 = sibling(h4_1, 2);
          var div_20 = child(div_19);
          var h5_2 = child(div_20);
          var text_17 = child(h5_2);
          var div_21 = sibling(h5_2, 2);
          each(div_21, 5, () => get(deletedObjects), index, ($$anchor4, change) => {
            var div_22 = root_16$1();
            var node_10 = child(div_22);
            {
              var consequent_8 = ($$anchor5) => {
                var a_4 = root_17();
                var text_18 = child(a_4);
                template_effect(
                  ($0) => {
                    set_attribute(a_4, "href", $0);
                    set_text(text_18, (get(change), untrack(() => get(change).objectId)));
                  },
                  [
                    () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                  ]
                );
                append($$anchor5, a_4);
              };
              var alternate_3 = ($$anchor5) => {
                var fragment_1 = comment();
                var node_11 = first_child(fragment_1);
                {
                  var consequent_9 = ($$anchor6) => {
                    var a_5 = root_19();
                    var text_19 = child(a_5);
                    template_effect(
                      ($0) => {
                        set_attribute(a_5, "href", $0);
                        set_text(text_19, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, a_5);
                  };
                  if_block(
                    node_11,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).address)) $$render(consequent_9);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_1);
              };
              if_block(node_10, ($$render) => {
                if (get(change), untrack(() => get(change).objectId)) $$render(consequent_8);
                else $$render(alternate_3, false);
              });
            }
            var node_12 = sibling(node_10, 2);
            {
              var consequent_10 = ($$anchor5) => {
                var div_23 = root_20$1();
                var text_20 = child(div_23);
                template_effect(() => set_text(text_20, (get(change), untrack(() => get(change).objectType))));
                append($$anchor5, div_23);
              };
              if_block(node_12, ($$render) => {
                if (get(change), untrack(() => get(change).objectType)) $$render(consequent_10);
              });
            }
            var node_13 = sibling(node_12, 2);
            {
              var consequent_11 = ($$anchor5) => {
                var div_24 = root_21();
                var text_21 = child(div_24);
                template_effect(() => set_text(text_21, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                append($$anchor5, div_24);
              };
              if_block(node_13, ($$render) => {
                if (get(change), untrack(() => get(change).version)) $$render(consequent_11);
              });
            }
            var node_14 = sibling(node_13, 2);
            {
              var consequent_12 = ($$anchor5) => {
                var div_25 = root_22$1();
                var text_22 = child(div_25);
                template_effect(() => set_text(text_22, `Sender: ${(get(change), untrack(() => get(change).sender)) ?? ""}`));
                append($$anchor5, div_25);
              };
              if_block(node_14, ($$render) => {
                if (get(change), untrack(() => get(change).sender)) $$render(consequent_12);
              });
            }
            var node_15 = sibling(node_14, 2);
            {
              var consequent_13 = ($$anchor5) => {
                var details = root_23();
                var div_26 = sibling(child(details), 2);
                var pre = child(div_26);
                var text_23 = child(pre);
                template_effect(($0) => set_text(text_23, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                ]);
                append($$anchor5, details);
              };
              if_block(node_15, ($$render) => {
                if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_13);
              });
            }
            append($$anchor4, div_22);
          });
          var div_27 = sibling(div_20, 2);
          var h5_3 = child(div_27);
          var text_24 = child(h5_3);
          var div_28 = sibling(h5_3, 2);
          each(div_28, 5, () => get(mutatedObjects), index, ($$anchor4, change) => {
            var div_29 = root_24$1();
            var node_16 = child(div_29);
            {
              var consequent_15 = ($$anchor5) => {
                var fragment_2 = root_25$1();
                var a_6 = first_child(fragment_2);
                var text_25 = child(a_6);
                var node_17 = sibling(a_6, 2);
                {
                  var consequent_14 = ($$anchor6) => {
                    var details_1 = root_26();
                    var div_30 = sibling(child(details_1), 2);
                    var pre_1 = child(div_30);
                    var text_26 = child(pre_1);
                    template_effect(($0) => set_text(text_26, $0), [
                      () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                    ]);
                    append($$anchor6, details_1);
                  };
                  if_block(node_17, ($$render) => {
                    if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_14);
                  });
                }
                var details_2 = sibling(node_17, 2);
                var div_31 = sibling(child(details_2), 2);
                var pre_2 = child(div_31);
                var text_27 = child(pre_2);
                template_effect(
                  ($0, $1) => {
                    set_attribute(a_6, "href", $0);
                    set_text(text_25, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_27, $1);
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
                var node_18 = first_child(fragment_3);
                {
                  var consequent_20 = ($$anchor6) => {
                    var fragment_4 = root_28();
                    var a_7 = first_child(fragment_4);
                    var text_28 = child(a_7);
                    var node_19 = sibling(a_7, 2);
                    {
                      var consequent_16 = ($$anchor7) => {
                        var div_32 = root_29();
                        var text_29 = child(div_32);
                        template_effect(() => set_text(text_29, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_32);
                      };
                      if_block(node_19, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_16);
                      });
                    }
                    var node_20 = sibling(node_19, 2);
                    {
                      var consequent_17 = ($$anchor7) => {
                        var div_33 = root_30();
                        var text_30 = child(div_33);
                        template_effect(() => set_text(text_30, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_33);
                      };
                      if_block(node_20, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_17);
                      });
                    }
                    var node_21 = sibling(node_20, 2);
                    {
                      var consequent_18 = ($$anchor7) => {
                        var div_34 = root_31();
                        var text_31 = child(div_34);
                        template_effect(() => set_text(text_31, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_34);
                      };
                      if_block(node_21, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_18);
                      });
                    }
                    var node_22 = sibling(node_21, 2);
                    {
                      var consequent_19 = ($$anchor7) => {
                        var div_35 = root_32();
                        var text_32 = child(div_35);
                        template_effect(() => set_text(text_32, `Previous Version: ${(get(change), untrack(() => get(change).previousVersion)) ?? ""}`));
                        append($$anchor7, div_35);
                      };
                      if_block(node_22, ($$render) => {
                        if (get(change), untrack(() => get(change).previousVersion)) $$render(consequent_19);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_7, "href", $0);
                        set_text(text_28, (get(change), untrack(() => get(change).objectId)));
                      },
                      [
                        () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                      ]
                    );
                    append($$anchor6, fragment_4);
                  };
                  var alternate_4 = ($$anchor6) => {
                    var fragment_5 = root_33();
                    var a_8 = first_child(fragment_5);
                    var text_33 = child(a_8);
                    var node_23 = sibling(a_8, 2);
                    {
                      var consequent_21 = ($$anchor7) => {
                        var details_3 = root_34();
                        var div_36 = sibling(child(details_3), 2);
                        var pre_3 = child(div_36);
                        var text_34 = child(pre_3);
                        template_effect(($0) => set_text(text_34, $0), [
                          () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))
                        ]);
                        append($$anchor7, details_3);
                      };
                      if_block(node_23, ($$render) => {
                        if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_21);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_8, "href", $0);
                        set_text(text_33, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, fragment_5);
                  };
                  if_block(
                    node_18,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_20);
                      else $$render(alternate_4, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_3);
              };
              if_block(node_16, ($$render) => {
                if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_15);
                else $$render(alternate_5, false);
              });
            }
            append($$anchor4, div_29);
          });
          var div_37 = sibling(div_27, 2);
          var h5_4 = child(div_37);
          var text_35 = child(h5_4);
          var div_38 = sibling(h5_4, 2);
          each(div_38, 5, () => get(createdObjects), index, ($$anchor4, change) => {
            var div_39 = root_35();
            var node_24 = child(div_39);
            {
              var consequent_22 = ($$anchor5) => {
                var fragment_6 = root_36();
                var a_9 = first_child(fragment_6);
                var text_36 = child(a_9);
                var details_4 = sibling(a_9, 2);
                var div_40 = sibling(child(details_4), 2);
                var pre_4 = child(div_40);
                var text_37 = child(pre_4);
                template_effect(
                  ($0, $1) => {
                    set_attribute(a_9, "href", $0);
                    set_text(text_36, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
                    set_text(text_37, $1);
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
                var node_25 = first_child(fragment_7);
                {
                  var consequent_26 = ($$anchor6) => {
                    var fragment_8 = root_38();
                    var a_10 = first_child(fragment_8);
                    var text_38 = child(a_10);
                    var node_26 = sibling(a_10, 2);
                    {
                      var consequent_23 = ($$anchor7) => {
                        var div_41 = root_39();
                        var text_39 = child(div_41);
                        template_effect(() => set_text(text_39, (get(change), untrack(() => get(change).objectType))));
                        append($$anchor7, div_41);
                      };
                      if_block(node_26, ($$render) => {
                        if (get(change), untrack(() => get(change).objectType)) $$render(consequent_23);
                      });
                    }
                    var node_27 = sibling(node_26, 2);
                    {
                      var consequent_24 = ($$anchor7) => {
                        var div_42 = root_40();
                        var text_40 = child(div_42);
                        template_effect(() => set_text(text_40, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
                        append($$anchor7, div_42);
                      };
                      if_block(node_27, ($$render) => {
                        if (get(change), untrack(() => get(change).owner)) $$render(consequent_24);
                      });
                    }
                    var node_28 = sibling(node_27, 2);
                    {
                      var consequent_25 = ($$anchor7) => {
                        var div_43 = root_41();
                        var text_41 = child(div_43);
                        template_effect(() => set_text(text_41, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
                        append($$anchor7, div_43);
                      };
                      if_block(node_28, ($$render) => {
                        if (get(change), untrack(() => get(change).version)) $$render(consequent_25);
                      });
                    }
                    template_effect(
                      ($0) => {
                        set_attribute(a_10, "href", $0);
                        set_text(text_38, (get(change), untrack(() => get(change).objectId)));
                      },
                      [
                        () => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))
                      ]
                    );
                    append($$anchor6, fragment_8);
                  };
                  var alternate_6 = ($$anchor6) => {
                    var a_11 = root_42();
                    var text_42 = child(a_11);
                    template_effect(
                      ($0) => {
                        set_attribute(a_11, "href", $0);
                        set_text(text_42, (get(change), untrack(() => get(change).address)));
                      },
                      [
                        () => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))
                      ]
                    );
                    append($$anchor6, a_11);
                  };
                  if_block(
                    node_25,
                    ($$render) => {
                      if (get(change), untrack(() => get(change).objectId)) $$render(consequent_26);
                      else $$render(alternate_6, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_7);
              };
              if_block(node_24, ($$render) => {
                if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_22);
                else $$render(alternate_7, false);
              });
            }
            append($$anchor4, div_39);
          });
          template_effect(() => {
            set_text(text_16, `Object Changes (${(get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length + get(createdObjects).length + get(mutatedObjects).length + get(deletedObjects).length)) ?? ""}):`);
            set_text(text_17, `Deleted (${(get(deletedObjects), untrack(() => get(deletedObjects).length)) ?? ""}):`);
            set_text(text_24, `Mutated (${(get(mutatedObjects), untrack(() => get(mutatedObjects).length)) ?? ""}):`);
            set_text(text_35, `Created (${(get(createdObjects), untrack(() => get(createdObjects).length)) ?? ""}):`);
          });
          append($$anchor3, div_18);
        };
        if_block(node_9, ($$render) => {
          if (get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length > 0 || get(createdObjects).length > 0 || get(mutatedObjects).length > 0 || get(deletedObjects).length > 0)) $$render(consequent_27);
        });
      }
      var node_29 = sibling(node_9, 2);
      {
        var consequent_29 = ($$anchor3) => {
          var div_44 = root_43();
          var details_5 = child(div_44);
          var summary = child(details_5);
          var text_43 = child(summary);
          var div_45 = sibling(summary, 2);
          each(div_45, 5, () => get(events), index, ($$anchor4, event2, index2) => {
            var div_46 = root_44();
            var span_8 = child(div_46);
            span_8.textContent = `#${index2 + 1}`;
            var span_9 = sibling(span_8, 2);
            var text_44 = child(span_9);
            var node_30 = sibling(span_9, 2);
            {
              var consequent_28 = ($$anchor5) => {
                var pre_5 = root_45();
                var text_45 = child(pre_5);
                template_effect(($0) => set_text(text_45, $0), [
                  () => (deep_read_state(formatJsonWithCompactArrays), get(event2), untrack(() => formatJsonWithCompactArrays(get(event2).parsedJson)))
                ]);
                append($$anchor5, pre_5);
              };
              if_block(node_30, ($$render) => {
                if (get(event2), untrack(() => get(event2).parsedJson)) $$render(consequent_28);
              });
            }
            template_effect(() => set_text(text_44, (get(event2), untrack(() => get(event2).type || "Unknown"))));
            append($$anchor4, div_46);
          });
          template_effect(() => set_text(text_43, `Events (${(get(events), untrack(() => get(events).length)) ?? ""})`));
          append($$anchor3, div_44);
        };
        if_block(node_29, ($$render) => {
          if (get(events), untrack(() => get(events).length > 0)) $$render(consequent_29);
        });
      }
      var node_31 = sibling(node_29, 2);
      {
        var consequent_31 = ($$anchor3) => {
          var div_47 = root_46();
          var span_10 = child(div_47);
          var text_46 = child(span_10);
          var div_48 = sibling(span_10, 2);
          each(
            div_48,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands)),
            index,
            ($$anchor4, command, index2) => {
              var div_49 = root_47();
              var span_11 = child(div_49);
              span_11.textContent = index2;
              var span_12 = sibling(span_11, 2);
              var text_47 = child(span_12);
              var div_50 = sibling(span_12, 2);
              var node_32 = child(div_50);
              {
                var consequent_30 = ($$anchor5) => {
                  const moveCall = derived_safe_equal(() => (get(command), untrack(() => get(command).MoveCall)));
                  const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                  const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                    function: get(signature),
                    typeArguments: get(moveCall).typeArguments,
                    arguments: get(moveCall).arguments
                  }))));
                  var pre_6 = root_48();
                  var text_48 = child(pre_6);
                  template_effect(($0) => set_text(text_48, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                  ]);
                  append($$anchor5, pre_6);
                };
                var alternate_8 = ($$anchor5) => {
                  var pre_7 = root_49();
                  var text_49 = child(pre_7);
                  template_effect(($0) => set_text(text_49, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(command), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(command))[get(command).$kind])))
                  ]);
                  append($$anchor5, pre_7);
                };
                if_block(node_32, ($$render) => {
                  if (get(command), untrack(() => get(command).$kind === "MoveCall" && get(command).MoveCall)) $$render(consequent_30);
                  else $$render(alternate_8, false);
                });
              }
              template_effect(() => set_text(text_47, (get(command), untrack(() => get(command).$kind))));
              append($$anchor4, div_49);
            }
          );
          template_effect(() => set_text(text_46, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands.length)) ?? ""}):`));
          append($$anchor3, div_47);
        };
        var alternate_11 = ($$anchor3) => {
          var fragment_9 = comment();
          var node_33 = first_child(fragment_9);
          {
            var consequent_34 = ($$anchor4) => {
              var div_51 = root_51();
              var span_13 = child(div_51);
              var text_50 = child(span_13);
              var div_52 = sibling(span_13, 2);
              each(
                div_52,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions)),
                index,
                ($$anchor5, command, index2) => {
                  var div_53 = root_52();
                  var span_14 = child(div_53);
                  span_14.textContent = index2;
                  var span_15 = sibling(span_14, 2);
                  var text_51 = child(span_15);
                  var div_54 = sibling(span_15, 2);
                  var node_34 = child(div_54);
                  {
                    var consequent_33 = ($$anchor6) => {
                      const commandValue = derived_safe_equal(() => (get(command), untrack(() => Object.values(get(command))[0])));
                      var fragment_10 = comment();
                      var node_35 = first_child(fragment_10);
                      {
                        var consequent_32 = ($$anchor7) => {
                          const moveCall = derived_safe_equal(() => get(commandValue));
                          const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
                          const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
                            function: get(signature),
                            typeArguments: get(moveCall).typeArguments,
                            arguments: get(moveCall).arguments
                          }))));
                          var pre_8 = root_54();
                          var text_52 = child(pre_8);
                          template_effect(($0) => set_text(text_52, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))
                          ]);
                          append($$anchor7, pre_8);
                        };
                        var alternate_9 = ($$anchor7) => {
                          var pre_9 = root_55();
                          var text_53 = child(pre_9);
                          template_effect(($0) => set_text(text_53, $0), [
                            () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(commandValue)), untrack(() => formatJsonWithCompactArrays(get(commandValue))))
                          ]);
                          append($$anchor7, pre_9);
                        };
                        if_block(node_35, ($$render) => {
                          if (get(commandValue) && typeof get(commandValue) === "object" && get(commandValue) !== null && "package" in get(commandValue)) $$render(consequent_32);
                          else $$render(alternate_9, false);
                        });
                      }
                      append($$anchor6, fragment_10);
                    };
                    var alternate_10 = ($$anchor6) => {
                      var pre_10 = root_56();
                      var text_54 = child(pre_10);
                      template_effect(($0) => set_text(text_54, $0), [
                        () => (deep_read_state(formatJsonWithCompactArrays), get(command), untrack(() => formatJsonWithCompactArrays(Object.values(get(command))[0])))
                      ]);
                      append($$anchor6, pre_10);
                    };
                    if_block(node_34, ($$render) => {
                      if (get(command), untrack(() => Object.keys(get(command))[0] === "MoveCall")) $$render(consequent_33);
                      else $$render(alternate_10, false);
                    });
                  }
                  template_effect(($0) => set_text(text_51, $0), [
                    () => (get(command), untrack(() => Object.keys(get(command))[0]))
                  ]);
                  append($$anchor5, div_53);
                }
              );
              template_effect(() => set_text(text_50, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions.length)) ?? ""}):`));
              append($$anchor4, div_51);
            };
            if_block(
              node_33,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.transactions?.length)) $$render(consequent_34);
              },
              true
            );
          }
          append($$anchor3, fragment_9);
        };
        if_block(node_31, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands?.length)) $$render(consequent_31);
          else $$render(alternate_11, false);
        });
      }
      var node_36 = sibling(node_31, 2);
      {
        var consequent_37 = ($$anchor3) => {
          var div_55 = root_57();
          var div_56 = sibling(child(div_55), 2);
          each(
            div_56,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs)),
            index,
            ($$anchor4, input, index2) => {
              var div_57 = root_58();
              var span_16 = child(div_57);
              span_16.textContent = index2;
              var span_17 = sibling(span_16, 2);
              var text_55 = child(span_17);
              var div_58 = sibling(span_17, 2);
              var pre_11 = child(div_58);
              var text_56 = child(pre_11);
              var node_37 = sibling(pre_11, 2);
              {
                var consequent_36 = ($$anchor5) => {
                  const decoded = derived_safe_equal(() => (deep_read_state(decodeBase64Bytes), get(input), untrack(() => decodeBase64Bytes(get(input)[get(input).$kind].bytes))));
                  var fragment_11 = comment();
                  var node_38 = first_child(fragment_11);
                  {
                    var consequent_35 = ($$anchor6) => {
                      var div_59 = root_60();
                      var div_60 = child(div_59);
                      var span_18 = sibling(child(div_60), 2);
                      var text_57 = child(span_18);
                      var div_61 = sibling(div_60, 2);
                      var span_19 = child(div_61);
                      var text_58 = child(span_19);
                      var span_20 = sibling(span_19, 2);
                      var text_59 = child(span_20);
                      var div_62 = sibling(div_61, 2);
                      var span_21 = sibling(child(div_62), 2);
                      var text_60 = child(span_21);
                      template_effect(
                        ($0) => {
                          set_text(text_57, (deep_read_state(get(decoded)), untrack(() => get(decoded).utf8)));
                          set_text(text_58, `${(deep_read_state(get(decoded)), untrack(() => get(decoded).integer.type)) ?? ""}:`);
                          set_text(text_59, (deep_read_state(get(decoded)), untrack(() => get(decoded).integer.value)));
                          set_text(text_60, `[${$0 ?? ""}]`);
                        },
                        [
                          () => (deep_read_state(get(decoded)), untrack(() => get(decoded).bytes.join(", ")))
                        ]
                      );
                      append($$anchor6, div_59);
                    };
                    if_block(node_38, ($$render) => {
                      if (get(decoded)) $$render(consequent_35);
                    });
                  }
                  append($$anchor5, fragment_11);
                };
                if_block(node_37, ($$render) => {
                  if (get(input), untrack(() => get(input).$kind === "Pure" && get(input)[get(input).$kind].bytes)) $$render(consequent_36);
                });
              }
              template_effect(
                ($0) => {
                  set_text(text_55, (get(input), untrack(() => get(input).$kind)));
                  set_text(text_56, $0);
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
          var node_39 = first_child(fragment_12);
          {
            var consequent_38 = ($$anchor4) => {
              var div_63 = root_62();
              var div_64 = sibling(child(div_63), 2);
              each(
                div_64,
                5,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.inputs)),
                index,
                ($$anchor5, input, index2) => {
                  const inputData = derived_safe_equal(() => (get(input), untrack(() => ({ valueType: get(input).valueType, value: get(input).value }))));
                  var div_65 = root_63();
                  var span_22 = child(div_65);
                  span_22.textContent = index2;
                  var span_23 = sibling(span_22, 2);
                  var text_61 = child(span_23);
                  var div_66 = sibling(span_23, 2);
                  var pre_12 = child(div_66);
                  var text_62 = child(pre_12);
                  template_effect(
                    ($0) => {
                      set_text(text_61, (get(input), untrack(() => get(input).type)));
                      set_text(text_62, $0);
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
              node_39,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.inputs?.length)) $$render(consequent_38);
              },
              true
            );
          }
          append($$anchor3, fragment_12);
        };
        if_block(node_36, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs?.length)) $$render(consequent_37);
          else $$render(alternate_12, false);
        });
      }
      var node_40 = sibling(node_36, 2);
      {
        var consequent_41 = ($$anchor3) => {
          var div_67 = root_64();
          var div_68 = sibling(child(div_67), 2);
          var div_69 = child(div_68);
          var span_24 = sibling(child(div_69), 2);
          var node_41 = child(span_24);
          {
            var consequent_40 = ($$anchor4) => {
              var fragment_13 = comment();
              var node_42 = first_child(fragment_13);
              each(
                node_42,
                1,
                () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment)),
                index,
                ($$anchor5, payment, index2) => {
                  var fragment_14 = root_66();
                  var span_25 = first_child(fragment_14);
                  var text_63 = child(span_25);
                  var node_43 = sibling(span_25, 2);
                  {
                    var consequent_39 = ($$anchor6) => {
                      var span_26 = root_67();
                      append($$anchor6, span_26);
                    };
                    if_block(node_43, ($$render) => {
                      if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().decodedBCS.intentMessage.value.V1.gasData.payment.length - 1)) $$render(consequent_39);
                    });
                  }
                  template_effect(() => set_text(text_63, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                  append($$anchor5, fragment_14);
                }
              );
              append($$anchor4, fragment_13);
            };
            var alternate_13 = ($$anchor4) => {
              var text_64 = text("N/A");
              append($$anchor4, text_64);
            };
            if_block(node_41, ($$render) => {
              if (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment?.length)) $$render(consequent_40);
              else $$render(alternate_13, false);
            });
          }
          var div_70 = sibling(div_69, 2);
          var span_27 = sibling(child(div_70), 2);
          var text_65 = child(span_27);
          var div_71 = sibling(div_70, 2);
          var span_28 = sibling(child(div_71), 2);
          var text_66 = child(span_28);
          var div_72 = sibling(div_71, 2);
          var span_29 = sibling(child(div_72), 2);
          var text_67 = child(span_29);
          template_effect(
            ($0, $1) => {
              set_text(text_65, (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.owner || "N/A")));
              set_text(text_66, `${$0 ?? ""} nanos`);
              set_text(text_67, `${$1 ?? ""} nanos`);
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
          var node_44 = first_child(fragment_15);
          {
            var consequent_44 = ($$anchor4) => {
              var div_73 = root_70();
              var div_74 = sibling(child(div_73), 2);
              var div_75 = child(div_74);
              var span_30 = sibling(child(div_75), 2);
              var node_45 = child(span_30);
              {
                var consequent_43 = ($$anchor5) => {
                  var fragment_16 = comment();
                  var node_46 = first_child(fragment_16);
                  each(
                    node_46,
                    1,
                    () => (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment)),
                    index,
                    ($$anchor6, payment, index2) => {
                      var fragment_17 = root_72();
                      var span_31 = first_child(fragment_17);
                      var text_68 = child(span_31);
                      var node_47 = sibling(span_31, 2);
                      {
                        var consequent_42 = ($$anchor7) => {
                          var span_32 = root_73();
                          append($$anchor7, span_32);
                        };
                        if_block(node_47, ($$render) => {
                          if (deep_read_state(transactionData()), untrack(() => index2 < transactionData().input.gasData.payment.length - 1)) $$render(consequent_42);
                        });
                      }
                      template_effect(() => set_text(text_68, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
                      append($$anchor6, fragment_17);
                    }
                  );
                  append($$anchor5, fragment_16);
                };
                var alternate_14 = ($$anchor5) => {
                  var text_69 = text("N/A");
                  append($$anchor5, text_69);
                };
                if_block(node_45, ($$render) => {
                  if (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment?.length)) $$render(consequent_43);
                  else $$render(alternate_14, false);
                });
              }
              var div_76 = sibling(div_75, 2);
              var span_33 = sibling(child(div_76), 2);
              var text_70 = child(span_33);
              var div_77 = sibling(div_76, 2);
              var span_34 = sibling(child(div_77), 2);
              var text_71 = child(span_34);
              var div_78 = sibling(div_77, 2);
              var span_35 = sibling(child(div_78), 2);
              var text_72 = child(span_35);
              template_effect(
                ($0, $1) => {
                  set_text(text_70, (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.owner || "N/A")));
                  set_text(text_71, `${$0 ?? ""} nanos`);
                  set_text(text_72, `${$1 ?? ""} nanos`);
                },
                [
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.price || "0"))),
                  () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.budget || "0")))
                ]
              );
              append($$anchor4, div_73);
            };
            if_block(
              node_44,
              ($$render) => {
                if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.gasData)) $$render(consequent_44);
              },
              true
            );
          }
          append($$anchor3, fragment_15);
        };
        if_block(node_40, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.gasData)) $$render(consequent_41);
          else $$render(alternate_15, false);
        });
      }
      var node_48 = sibling(node_40, 2);
      {
        var consequent_52 = ($$anchor3) => {
          var div_79 = root_75();
          var span_36 = child(div_79);
          var text_73 = child(span_36);
          var div_80 = sibling(span_36, 2);
          each(
            div_80,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults)),
            index,
            ($$anchor4, result, index$1) => {
              var div_81 = root_76();
              var div_82 = child(div_81);
              var span_37 = child(div_82);
              span_37.textContent = `Result #${index$1}`;
              var node_49 = sibling(div_82, 2);
              {
                var consequent_47 = ($$anchor5) => {
                  var div_83 = root_77();
                  var h6 = child(div_83);
                  var text_74 = child(h6);
                  var node_50 = sibling(h6, 2);
                  each(
                    node_50,
                    1,
                    () => (get(result), untrack(() => get(result).mutableReferenceOutputs)),
                    index,
                    ($$anchor6, output, outputIndex) => {
                      var div_84 = root_78();
                      var div_85 = child(div_84);
                      var span_38 = child(div_85);
                      span_38.textContent = `Output #${outputIndex}`;
                      var span_39 = sibling(span_38, 2);
                      var text_75 = child(span_39);
                      var node_51 = sibling(div_85, 2);
                      {
                        var consequent_45 = ($$anchor7) => {
                          var div_86 = root_79();
                          var div_87 = sibling(child(div_86), 2);
                          var text_76 = child(div_87);
                          template_effect(($0) => set_text(text_76, `[${$0 ?? ""}]`), [
                            () => (get(output), untrack(() => get(output)[1].join(", ")))
                          ]);
                          append($$anchor7, div_86);
                        };
                        if_block(node_51, ($$render) => {
                          if (get(output), untrack(() => get(output)[1]?.length)) $$render(consequent_45);
                        });
                      }
                      var node_52 = sibling(node_51, 2);
                      {
                        var consequent_46 = ($$anchor7) => {
                          var div_88 = root_80();
                          var span_40 = sibling(child(div_88), 2);
                          var text_77 = child(span_40);
                          template_effect(() => set_text(text_77, (get(output), untrack(() => get(output)[2]))));
                          append($$anchor7, div_88);
                        };
                        if_block(node_52, ($$render) => {
                          if (get(output), untrack(() => get(output)[2])) $$render(consequent_46);
                        });
                      }
                      template_effect(() => set_text(text_75, (get(output), untrack(() => get(output)[0]))));
                      append($$anchor6, div_84);
                    }
                  );
                  template_effect(() => set_text(text_74, `Mutable Reference Outputs (${(get(result), untrack(() => get(result).mutableReferenceOutputs.length)) ?? ""}):`));
                  append($$anchor5, div_83);
                };
                if_block(node_49, ($$render) => {
                  if (get(result), untrack(() => get(result).mutableReferenceOutputs?.length)) $$render(consequent_47);
                });
              }
              var node_53 = sibling(node_49, 2);
              {
                var consequent_50 = ($$anchor5) => {
                  var div_89 = root_81();
                  var h6_1 = child(div_89);
                  var text_78 = child(h6_1);
                  var node_54 = sibling(h6_1, 2);
                  each(node_54, 1, () => (get(result), untrack(() => get(result).returnValues)), index, ($$anchor6, returnValue, returnIndex) => {
                    var div_90 = root_82();
                    var div_91 = child(div_90);
                    var span_41 = child(div_91);
                    span_41.textContent = `Value #${returnIndex}`;
                    var node_55 = sibling(div_91, 2);
                    {
                      var consequent_48 = ($$anchor7) => {
                        var div_92 = root_83();
                        var div_93 = sibling(child(div_92), 2);
                        var text_79 = child(div_93);
                        template_effect(($0) => set_text(text_79, `[${$0 ?? ""}]`), [
                          () => (get(returnValue), untrack(() => get(returnValue)[0].join(", ")))
                        ]);
                        append($$anchor7, div_92);
                      };
                      if_block(node_55, ($$render) => {
                        if (get(returnValue), untrack(() => get(returnValue)[0]?.length)) $$render(consequent_48);
                      });
                    }
                    var node_56 = sibling(node_55, 2);
                    {
                      var consequent_49 = ($$anchor7) => {
                        var div_94 = root_84();
                        var span_42 = sibling(child(div_94), 2);
                        var text_80 = child(span_42);
                        template_effect(() => set_text(text_80, (get(returnValue), untrack(() => get(returnValue)[1]))));
                        append($$anchor7, div_94);
                      };
                      if_block(node_56, ($$render) => {
                        if (get(returnValue), untrack(() => get(returnValue)[1])) $$render(consequent_49);
                      });
                    }
                    append($$anchor6, div_90);
                  });
                  template_effect(() => set_text(text_78, `Return Values (${(get(result), untrack(() => get(result).returnValues.length)) ?? ""}):`));
                  append($$anchor5, div_89);
                };
                if_block(node_53, ($$render) => {
                  if (get(result), untrack(() => get(result).returnValues?.length)) $$render(consequent_50);
                });
              }
              var node_57 = sibling(node_53, 2);
              {
                var consequent_51 = ($$anchor5) => {
                  var div_95 = root_85();
                  var details_6 = child(div_95);
                  var pre_13 = sibling(child(details_6), 2);
                  var text_81 = child(pre_13);
                  template_effect(($0) => set_text(text_81, $0), [
                    () => (deep_read_state(formatJsonWithCompactArrays), get(result), untrack(() => formatJsonWithCompactArrays(get(result))))
                  ]);
                  append($$anchor5, div_95);
                };
                if_block(node_57, ($$render) => {
                  if (get(result), untrack(() => Object.keys(get(result)).length > 2 || Object.keys(get(result)).length === 1 && !get(result).mutableReferenceOutputs && !get(result).returnValues)) $$render(consequent_51);
                });
              }
              append($$anchor4, div_81);
            }
          );
          template_effect(() => set_text(text_73, `Dev Inspect Results (${(deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults.length)) ?? ""}):`));
          append($$anchor3, div_79);
        };
        if_block(node_48, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.devInspectResults?.length)) $$render(consequent_52);
        });
      }
      var node_58 = sibling(node_48, 2);
      {
        var consequent_53 = ($$anchor3) => {
          var div_96 = root_86();
          var span_43 = child(div_96);
          var text_82 = child(span_43);
          var div_97 = sibling(span_43, 2);
          each(
            div_97,
            5,
            () => (deep_read_state(transactionData()), untrack(() => transactionData().results)),
            index,
            ($$anchor4, rawResult, index2) => {
              var div_98 = root_87();
              var div_99 = child(div_98);
              var span_44 = child(div_99);
              span_44.textContent = `Raw Result #${index2}`;
              var div_100 = sibling(div_99, 2);
              var pre_14 = child(div_100);
              var text_83 = child(pre_14);
              template_effect(($0) => set_text(text_83, $0), [
                () => (deep_read_state(formatJsonWithCompactArrays), get(rawResult), untrack(() => formatJsonWithCompactArrays(get(rawResult))))
              ]);
              append($$anchor4, div_98);
            }
          );
          template_effect(() => set_text(text_82, `Raw Results (${(deep_read_state(transactionData()), untrack(() => transactionData().results.length)) ?? ""}):`));
          append($$anchor3, div_96);
        };
        if_block(node_58, ($$render) => {
          if (deep_read_state(transactionData()), untrack(() => transactionData()?.results?.length)) $$render(consequent_53);
        });
      }
      template_effect(
        ($0, $1, $2) => {
          set_attribute(a, "href", $0);
          set_attribute(a, "title", (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
          set_text(text$1, (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
          set_style(span, `color: ${$1 ?? ""}`);
          set_text(text_1, $2);
        },
        [
          () => (deep_read_state(transactionData()), deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), untrack(() => transactionData()?.digest ? getTransactionLink(getSelectedNetworkConfig(), transactionData().digest) : "#")),
          () => (get(effects), untrack(() => getStatusColor(get(effects).status))),
          () => (get(effects), untrack(() => getStatusString(get(effects).status)))
        ]
      );
      append($$anchor2, fragment);
    };
    var alternate_16 = ($$anchor2) => {
      var fragment_18 = comment();
      var node_59 = first_child(fragment_18);
      {
        var consequent_55 = ($$anchor3) => {
          var div_101 = root_89();
          append($$anchor3, div_101);
        };
        if_block(
          node_59,
          ($$render) => {
            if (!get(hasValidData)) $$render(consequent_55);
          },
          true
        );
      }
      append($$anchor2, fragment_18);
    };
    if_block(node, ($$render) => {
      if (get(effects)) $$render(consequent_54);
      else $$render(alternate_16, false);
    });
  }
  append($$anchor, div);
  pop();
}
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var _pubkey, _signers;
class MultiSigSigner extends Signer {
  constructor(pubkey, signers = []) {
    super();
    __privateAdd(this, _pubkey);
    __privateAdd(this, _signers);
    __privateSet(this, _pubkey, pubkey);
    __privateSet(this, _signers, signers);
    const uniqueKeys = /* @__PURE__ */ new Set();
    let combinedWeight = 0;
    const weights = pubkey.getPublicKeys().map(({ weight, publicKey }) => ({
      weight,
      address: publicKey.toIotaAddress()
    }));
    for (const signer of signers) {
      const address = signer.toIotaAddress();
      if (uniqueKeys.has(address)) {
        throw new Error(`Can't create MultiSigSigner with duplicate signers`);
      }
      uniqueKeys.add(address);
      const weight = weights.find((w) => w.address === address)?.weight;
      if (!weight) {
        throw new Error(`Signer ${address} is not part of the MultiSig public key`);
      }
      combinedWeight += weight;
    }
    if (combinedWeight < pubkey.getThreshold()) {
      throw new Error(`Combined weight of signers is less than threshold`);
    }
  }
  getKeyScheme() {
    return "MultiSig";
  }
  getPublicKey() {
    return __privateGet(this, _pubkey);
  }
  sign(_data) {
    throw new Error(
      "MultiSigSigner does not support signing directly. Use signTransaction or signPersonalMessage instead"
    );
  }
  signData(_data) {
    throw new Error(
      "MultiSigSigner does not support signing directly. Use signTransaction or signPersonalMessage instead"
    );
  }
  async signTransaction(bytes) {
    const signature = __privateGet(this, _pubkey).combinePartialSignatures(
      await Promise.all(
        __privateGet(this, _signers).map(
          async (signer) => (await signer.signTransaction(bytes)).signature
        )
      )
    );
    return {
      signature,
      bytes: toBase64(bytes)
    };
  }
  async signPersonalMessage(bytes) {
    const signature = __privateGet(this, _pubkey).combinePartialSignatures(
      await Promise.all(
        __privateGet(this, _signers).map(
          async (signer) => (await signer.signPersonalMessage(bytes)).signature
        )
      )
    );
    return {
      signature,
      bytes: toBase64(bytes)
    };
  }
}
_pubkey = /* @__PURE__ */ new WeakMap();
_signers = /* @__PURE__ */ new WeakMap();
async function verifyPersonalMessageSignature(message, signature) {
  const parsedSignature = parseSignature(signature);
  if (!await parsedSignature.publicKey.verifyPersonalMessage(
    message,
    parsedSignature.serializedSignature
  )) {
    throw new Error(`Signature is not valid for the provided message`);
  }
  return parsedSignature.publicKey;
}
async function verifyTransactionSignature(transaction, signature) {
  const parsedSignature = parseSignature(signature);
  if (!await parsedSignature.publicKey.verifyTransaction(
    transaction,
    parsedSignature.serializedSignature
  )) {
    throw new Error(`Signature is not valid for the provided Transaction`);
  }
  return parsedSignature.publicKey;
}
function parseSignature(signature) {
  const parsedSignature = parseSerializedSignature(signature);
  if (parsedSignature.signatureScheme === "MultiSig") {
    return {
      ...parsedSignature,
      publicKey: new MultiSigPublicKey(parsedSignature.multisig.multisig_pk)
    };
  }
  const publicKey = publicKeyFromRawBytes(
    parsedSignature.signatureScheme,
    parsedSignature.publicKey
  );
  return {
    ...parsedSignature,
    publicKey
  };
}
function publicKeyFromRawBytes(signatureScheme, bytes) {
  switch (signatureScheme) {
    case "ED25519":
      return new Ed25519PublicKey(bytes);
    case "Secp256k1":
      return new Secp256k1PublicKey(bytes);
    case "Secp256r1":
      return new Secp256r1PublicKey(bytes);
    case "MultiSig":
      return new MultiSigPublicKey(bytes);
    case "Passkey":
      return new PasskeyPublicKey(bytes);
    default:
      throw new Error(`Unsupported signature scheme ${signatureScheme}`);
  }
}
const MAX_SIGNER_IN_MULTISIG = 10;
const MIN_SIGNER_IN_MULTISIG = 1;
class MultiSigPublicKey extends PublicKey {
  /**
   * Create a new MultiSigPublicKey object
   */
  constructor(value) {
    super();
    if (typeof value === "string") {
      this.rawBytes = fromBase64(value);
      this.multisigPublicKey = iotaBcs.MultiSigPublicKey.parse(this.rawBytes);
    } else if (value instanceof Uint8Array) {
      this.rawBytes = value;
      this.multisigPublicKey = iotaBcs.MultiSigPublicKey.parse(this.rawBytes);
    } else {
      this.multisigPublicKey = value;
      this.rawBytes = iotaBcs.MultiSigPublicKey.serialize(value).toBytes();
    }
    if (this.multisigPublicKey.threshold < 1) {
      throw new Error("Invalid threshold");
    }
    const seenPublicKeys = /* @__PURE__ */ new Set();
    this.publicKeys = this.multisigPublicKey.pk_map.map(({ pubKey, weight }) => {
      const [scheme, bytes] = Object.entries(pubKey).filter(
        ([name]) => name !== "$kind"
      )[0];
      const publicKeyStr = Uint8Array.from(bytes).toString();
      if (seenPublicKeys.has(publicKeyStr)) {
        throw new Error(`Multisig does not support duplicate public keys`);
      }
      seenPublicKeys.add(publicKeyStr);
      if (weight < 1) {
        throw new Error(`Invalid weight`);
      }
      return {
        publicKey: publicKeyFromRawBytes(scheme, Uint8Array.from(bytes)),
        weight
      };
    });
    const totalWeight = this.publicKeys.reduce((sum, { weight }) => sum + weight, 0);
    if (this.multisigPublicKey.threshold > totalWeight) {
      throw new Error(`Unreachable threshold`);
    }
    if (this.publicKeys.length > MAX_SIGNER_IN_MULTISIG) {
      throw new Error(`Max number of signers in a multisig is ${MAX_SIGNER_IN_MULTISIG}`);
    }
    if (this.publicKeys.length < MIN_SIGNER_IN_MULTISIG) {
      throw new Error(`Min number of signers in a multisig is ${MIN_SIGNER_IN_MULTISIG}`);
    }
  }
  /**
   * 	A static method to create a new MultiSig publickey instance from a set of public keys and their associated weights pairs and threshold.
   */
  static fromPublicKeys({
    threshold,
    publicKeys
  }) {
    return new MultiSigPublicKey({
      pk_map: publicKeys.map(({ publicKey, weight }) => {
        const scheme = SIGNATURE_FLAG_TO_SCHEME[publicKey.flag()];
        return {
          pubKey: { [scheme]: Array.from(publicKey.toRawBytes()) },
          weight
        };
      }),
      threshold
    });
  }
  /**
   * Checks if two MultiSig public keys are equal
   */
  equals(publicKey) {
    return super.equals(publicKey);
  }
  /**
   * Return the byte array representation of the MultiSig public key
   */
  toRawBytes() {
    return this.rawBytes;
  }
  getPublicKeys() {
    return this.publicKeys;
  }
  getThreshold() {
    return this.multisigPublicKey.threshold;
  }
  getSigner(...signers) {
    return new MultiSigSigner(this, signers);
  }
  /**
   * Return the IOTA address associated with this MultiSig public key
   */
  toIotaAddress() {
    const maxLength = 1 + (64 + 1) * MAX_SIGNER_IN_MULTISIG + 2;
    const tmp = new Uint8Array(maxLength);
    tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
    tmp.set(iotaBcs.u16().serialize(this.multisigPublicKey.threshold).toBytes(), 1);
    let i = 3;
    for (const { publicKey, weight } of this.publicKeys) {
      const bytes = publicKey.toIotaBytesForAddress();
      tmp.set(bytes, i);
      i += bytes.length;
      tmp.set([weight], i++);
    }
    return normalizeIotaAddress(bytesToHex(blake2b(tmp.slice(0, i), { dkLen: 32 })));
  }
  /**
   * Return the IOTA address associated with this MultiSig public key
   */
  flag() {
    return SIGNATURE_SCHEME_TO_FLAG["MultiSig"];
  }
  /**
   * Verifies that the signature is valid for the provided message
   */
  async verify(message, multisigSignature) {
    const parsed = parseSerializedSignature(multisigSignature);
    if (parsed.signatureScheme !== "MultiSig") {
      throw new Error("Invalid signature scheme");
    }
    const { multisig } = parsed;
    let signatureWeight = 0;
    if (!bytesEqual(
      iotaBcs.MultiSigPublicKey.serialize(this.multisigPublicKey).toBytes(),
      iotaBcs.MultiSigPublicKey.serialize(multisig.multisig_pk).toBytes()
    )) {
      return false;
    }
    for (const { publicKey, weight, signature } of parsePartialSignatures(multisig)) {
      if (!await publicKey.verify(message, signature)) {
        return false;
      }
      signatureWeight += weight;
    }
    return signatureWeight >= this.multisigPublicKey.threshold;
  }
  /**
   * Combines multiple partial signatures into a single multisig, ensuring that each public key signs only once
   * and that all the public keys involved are known and valid, and then serializes multisig into the standard format
   */
  combinePartialSignatures(signatures) {
    if (signatures.length > MAX_SIGNER_IN_MULTISIG) {
      throw new Error(`Max number of signatures in a multisig is ${MAX_SIGNER_IN_MULTISIG}`);
    }
    let bitmap = 0;
    const compressedSignatures = new Array(signatures.length);
    for (let i = 0; i < signatures.length; i++) {
      const parsed = parseSerializedSignature(signatures[i]);
      if (parsed.signatureScheme === "MultiSig") {
        throw new Error("MultiSig is not supported inside MultiSig");
      }
      const publicKey = parsed.publicKey;
      compressedSignatures[i] = {
        [parsed.signatureScheme]: Array.from(
          parsed.signature.map((x) => Number(x))
        )
      };
      let publicKeyIndex;
      for (let j = 0; j < this.publicKeys.length; j++) {
        if (bytesEqual(publicKey, this.publicKeys[j].publicKey.toRawBytes())) {
          if (bitmap & 1 << j) {
            throw new Error("Received multiple signatures from the same public key");
          }
          publicKeyIndex = j;
          break;
        }
      }
      if (publicKeyIndex === void 0) {
        throw new Error("Received signature from unknown public key");
      }
      bitmap |= 1 << publicKeyIndex;
    }
    const multisig = {
      sigs: compressedSignatures,
      bitmap,
      multisig_pk: this.multisigPublicKey
    };
    const bytes = iotaBcs.MultiSig.serialize(multisig, { maxSize: 8192 }).toBytes();
    const tmp = new Uint8Array(bytes.length + 1);
    tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
    tmp.set(bytes, 1);
    return toBase64(tmp);
  }
}
function parsePartialSignatures(multisig) {
  const res = new Array(multisig.sigs.length);
  for (let i = 0; i < multisig.sigs.length; i++) {
    const [signatureScheme, signature] = Object.entries(multisig.sigs[i]).filter(
      ([name]) => name !== "$kind"
    )[0];
    const pkIndex = asIndices(multisig.bitmap).at(i);
    const pair = multisig.multisig_pk.pk_map[pkIndex];
    const pkBytes = Uint8Array.from(Object.values(pair.pubKey)[0]);
    if (signatureScheme === "MultiSig") {
      throw new Error("MultiSig is not supported inside MultiSig");
    }
    const publicKey = publicKeyFromRawBytes(signatureScheme, pkBytes);
    res[i] = {
      signatureScheme,
      signature: Uint8Array.from(signature),
      publicKey,
      weight: pair.weight
    };
  }
  return res;
}
function asIndices(bitmap) {
  if (bitmap < 0 || bitmap > 1024) {
    throw new Error("Invalid bitmap");
  }
  const res = [];
  for (let i = 0; i < 10; i++) {
    if ((bitmap & 1 << i) !== 0) {
      res.push(i);
    }
  }
  return Uint8Array.from(res);
}
function createTypeTagBcs() {
  return iotaBcs.enum("TypeTag", {
    Bool: null,
    U8: null,
    U64: null,
    U128: null,
    Address: null,
    Signer: null,
    Vector: iotaBcs.lazy(() => createTypeTagBcs()),
    Struct: iotaBcs.struct("StructTag", {
      address: iotaBcs.Address,
      module: iotaBcs.string(),
      name: iotaBcs.string(),
      typeParams: iotaBcs.vector(iotaBcs.lazy(() => createTypeTagBcs()))
    }),
    U16: null,
    U32: null,
    U256: null
  });
}
const TypeTagBcs = createTypeTagBcs();
const MoveAuthenticatorBcs = iotaBcs.struct("MoveAuthenticator", {
  call_args: iotaBcs.vector(iotaBcs.CallArg),
  type_args: iotaBcs.vector(TypeTagBcs),
  object_to_authenticate: iotaBcs.CallArg
});
function normalizeCallArg(arg) {
  if (arg.$kind === "Pure") {
    const bytes = typeof arg.Pure.bytes === "string" ? fromBase64(arg.Pure.bytes) : new Uint8Array(arg.Pure.bytes);
    return `0x${toHex(bytes)}`;
  }
  if (arg.$kind === "Object") {
    if (arg.Object.$kind === "SharedObject") {
      return arg.Object.SharedObject.objectId;
    }
    if (arg.Object.$kind === "ImmOrOwnedObject") {
      return arg.Object.ImmOrOwnedObject.objectId;
    }
    if (arg.Object.$kind === "Receiving") {
      return arg.Object.Receiving.objectId;
    }
  }
  return JSON.stringify(arg);
}
function extractObjectId(objectArg) {
  if (objectArg.$kind === "SharedObject") {
    return objectArg.SharedObject.objectId;
  }
  if (objectArg.$kind === "ImmOrOwnedObject") {
    return objectArg.ImmOrOwnedObject.objectId;
  }
  if (objectArg.$kind === "Receiving") {
    return objectArg.Receiving.objectId;
  }
  return "";
}
function parseMoveAuthenticatorSignature(signatureBase64) {
  const bytes = fromBase64(signatureBase64);
  if (bytes[0] !== 7) {
    throw new Error("Signature is not a MoveAuthenticator");
  }
  const data = MoveAuthenticatorBcs.parse(bytes.slice(1));
  if (data.object_to_authenticate.$kind !== "Object") {
    throw new Error("MoveAuthenticator object_to_authenticate is not an Object");
  }
  const objectToAuthenticate = data.object_to_authenticate.Object;
  return {
    callArguments: data.call_args.map(normalizeCallArg),
    typeArguments: data.type_args,
    objectToAuthenticate,
    objectId: extractObjectId(objectToAuthenticate)
  };
}
var root_1$1 = from_html(`<div class="no-signatures svelte-bpsref">No signatures available</div>`);
var root_4$1 = from_html(`<span class="role-badge sender svelte-bpsref">Sender</span>`);
var root_6$1 = from_html(`<span class="role-badge sponsor svelte-bpsref">Gas Sponsor</span>`);
var root_7$1 = from_html(`<div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Authenticated Object ID:</span> <div class="detail-value-container svelte-bpsref"><a class="detail-value link svelte-bpsref" target="_blank" rel="noopener noreferrer"> </a> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Call Arguments:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Type Arguments:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Object to Authenticate:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Full Signature:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div>`, 1);
var root_8$1 = from_html(`<div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Public Key:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Public Key (with flag):</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Address:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Signature Bytes:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Full Signature:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div>`, 1);
var root_3$1 = from_html(`<div class="signature-item svelte-bpsref"><div class="signature-header svelte-bpsref"><span class="signature-title svelte-bpsref"> </span> <!></div> <div class="signature-details svelte-bpsref"><!></div></div>`);
var root_2$1 = from_html(`<div class="signatures-container svelte-bpsref"></div>`);
function TransactionSignatures($$anchor, $$props) {
  push($$props, true);
  let signatures = prop($$props, "signatures", 19, () => []), transactionData = prop($$props, "transactionData", 3, null);
  let parsedSignatures = user_derived(() => {
    const result = [];
    let senderAddress = null;
    let gasSponsorAddress = null;
    if (transactionData()) {
      senderAddress = transactionData().sender;
      gasSponsorAddress = transactionData().gasData?.owner;
    }
    signatures().forEach((sigString, index2) => {
      try {
        const bytes = fromBase64(sigString);
        if (bytes[0] === 7) {
          const parsed2 = parseMoveAuthenticatorSignature(sigString);
          let role = "unknown";
          if (senderAddress && parsed2.objectId === senderAddress) {
            role = "sender";
          } else if (gasSponsorAddress && parsed2.objectId === gasSponsorAddress && gasSponsorAddress !== senderAddress) {
            role = "gas_sponsor";
          } else if (signatures().length === 1) {
            role = "sender";
          } else if (index2 === 0) {
            role = "sender";
          } else if (index2 === 1) {
            role = "gas_sponsor";
          }
          result.push({
            signatureScheme: "MoveAuthenticator",
            publicKey: null,
            // MoveAuthenticator doesn't have a traditional public key
            signature: new Uint8Array(),
            role,
            rawSignature: sigString,
            moveAuthenticator: parsed2
          });
          return;
        }
        const parsed = parseSerializedSignature(sigString);
        if (parsed.signatureScheme === "MultiSig") {
          const partialSignatures = parsePartialSignatures(parsed.multisig);
          partialSignatures.forEach((sig) => {
            result.push({
              signatureScheme: sig.signatureScheme,
              publicKey: sig.publicKey,
              signature: sig.signature,
              role: "unknown",
              rawSignature: sigString
            });
          });
        } else {
          const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
          const address = pubKey.toIotaAddress();
          let role = "unknown";
          if (senderAddress && address === senderAddress) {
            role = "sender";
          } else if (gasSponsorAddress && address === gasSponsorAddress && gasSponsorAddress !== senderAddress) {
            role = "gas_sponsor";
          } else if (signatures().length === 1) {
            role = "sender";
          } else if (index2 === 0) {
            role = "sender";
          } else if (index2 === 1) {
            role = "gas_sponsor";
          }
          result.push({
            signatureScheme: parsed.signatureScheme,
            publicKey: pubKey,
            signature: parsed.signature,
            role,
            rawSignature: sigString
          });
        }
      } catch (e) {
        console.error(`Failed to parse signature ${index2 + 1}:`, e);
      }
    });
    return result;
  });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root_1$1();
      append($$anchor2, div);
    };
    var alternate_2 = ($$anchor2) => {
      var div_1 = root_2$1();
      each(div_1, 21, () => get(parsedSignatures), index, ($$anchor3, sig, index2) => {
        var div_2 = root_3$1();
        var div_3 = child(div_2);
        var span = child(div_3);
        var text2 = child(span);
        var node_1 = sibling(span, 2);
        {
          var consequent_1 = ($$anchor4) => {
            var span_1 = root_4$1();
            append($$anchor4, span_1);
          };
          var alternate = ($$anchor4) => {
            var fragment_1 = comment();
            var node_2 = first_child(fragment_1);
            {
              var consequent_2 = ($$anchor5) => {
                var span_2 = root_6$1();
                append($$anchor5, span_2);
              };
              if_block(
                node_2,
                ($$render) => {
                  if (get(sig).role === "gas_sponsor") $$render(consequent_2);
                },
                true
              );
            }
            append($$anchor4, fragment_1);
          };
          if_block(node_1, ($$render) => {
            if (get(sig).role === "sender") $$render(consequent_1);
            else $$render(alternate, false);
          });
        }
        var div_4 = sibling(div_3, 2);
        var node_3 = child(div_4);
        {
          var consequent_3 = ($$anchor4) => {
            const move = user_derived(() => get(sig).moveAuthenticator);
            var fragment_2 = root_7$1();
            var div_5 = first_child(fragment_2);
            var div_6 = sibling(child(div_5), 2);
            var a = child(div_6);
            var text_1 = child(a);
            var button = sibling(a, 2);
            button.__click = async () => await copyToClipboard(get(move).objectId);
            var div_7 = sibling(div_5, 2);
            var div_8 = sibling(child(div_7), 2);
            var span_3 = child(div_8);
            var text_2 = child(span_3);
            var button_1 = sibling(span_3, 2);
            button_1.__click = async () => await copyToClipboard(JSON.stringify(get(move).callArguments));
            var div_9 = sibling(div_7, 2);
            var div_10 = sibling(child(div_9), 2);
            var span_4 = child(div_10);
            var text_3 = child(span_4);
            var button_2 = sibling(span_4, 2);
            button_2.__click = async () => await copyToClipboard(JSON.stringify(get(move).typeArguments));
            var div_11 = sibling(div_9, 2);
            var div_12 = sibling(child(div_11), 2);
            var span_5 = child(div_12);
            var text_4 = child(span_5);
            var button_3 = sibling(span_5, 2);
            button_3.__click = async () => await copyToClipboard(JSON.stringify(get(move).objectToAuthenticate));
            var div_13 = sibling(div_11, 2);
            var div_14 = sibling(child(div_13), 2);
            var span_6 = child(div_14);
            var text_5 = child(span_6);
            var button_4 = sibling(span_6, 2);
            button_4.__click = async () => await copyToClipboard(get(sig).rawSignature);
            template_effect(
              ($0, $1, $2, $3) => {
                set_attribute(a, "href", $0);
                set_text(text_1, get(move).objectId);
                set_text(text_2, $1);
                set_text(text_3, $2);
                set_text(text_4, $3);
                set_text(text_5, get(sig).rawSignature);
              },
              [
                () => getObjectLink(getSelectedNetworkConfig(), get(move).objectId),
                () => JSON.stringify(get(move).callArguments, null, 2),
                () => JSON.stringify(get(move).typeArguments, null, 2),
                () => JSON.stringify(get(move).objectToAuthenticate, null, 2)
              ]
            );
            append($$anchor4, fragment_2);
          };
          var alternate_1 = ($$anchor4) => {
            var fragment_3 = root_8$1();
            var div_15 = first_child(fragment_3);
            var div_16 = sibling(child(div_15), 2);
            var span_7 = child(div_16);
            var text_6 = child(span_7);
            var button_5 = sibling(span_7, 2);
            button_5.__click = async () => await copyToClipboard(get(sig).publicKey.toBase64());
            var div_17 = sibling(div_15, 2);
            var div_18 = sibling(child(div_17), 2);
            var span_8 = child(div_18);
            var text_7 = child(span_8);
            var button_6 = sibling(span_8, 2);
            button_6.__click = async () => await copyToClipboard(get(sig).publicKey.toIotaPublicKey());
            var div_19 = sibling(div_17, 2);
            var div_20 = sibling(child(div_19), 2);
            var span_9 = child(div_20);
            var text_8 = child(span_9);
            var button_7 = sibling(span_9, 2);
            button_7.__click = async () => await copyToClipboard(get(sig).publicKey.toIotaAddress());
            var div_21 = sibling(div_19, 2);
            var div_22 = sibling(child(div_21), 2);
            var span_10 = child(div_22);
            var text_9 = child(span_10);
            var button_8 = sibling(span_10, 2);
            button_8.__click = async () => await copyToClipboard(bufferExports.Buffer.from(get(sig).signature).toString("base64"));
            var div_23 = sibling(div_21, 2);
            var div_24 = sibling(child(div_23), 2);
            var span_11 = child(div_24);
            var text_10 = child(span_11);
            var button_9 = sibling(span_11, 2);
            button_9.__click = async () => await copyToClipboard(get(sig).rawSignature);
            template_effect(
              ($0, $1, $2, $3) => {
                set_text(text_6, $0);
                set_text(text_7, $1);
                set_text(text_8, $2);
                set_text(text_9, $3);
                set_text(text_10, get(sig).rawSignature);
              },
              [
                () => get(sig).publicKey.toBase64(),
                () => get(sig).publicKey.toIotaPublicKey(),
                () => get(sig).publicKey.toIotaAddress(),
                () => bufferExports.Buffer.from(get(sig).signature).toString("base64")
              ]
            );
            append($$anchor4, fragment_3);
          };
          if_block(node_3, ($$render) => {
            if (get(sig).signatureScheme === "MoveAuthenticator" && get(sig).moveAuthenticator) $$render(consequent_3);
            else $$render(alternate_1, false);
          });
        }
        template_effect(() => set_text(text2, `Signature #${index2 + 1} (${get(sig).signatureScheme ?? ""})`));
        append($$anchor3, div_2);
      });
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (get(parsedSignatures).length === 0) $$render(consequent);
      else $$render(alternate_2, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["click"]);
var root_2 = from_html(`<div class="header-line svelte-1787xw1"><span class="tx-header svelte-1787xw1">Transaction</span> <a target="_blank" rel="noopener noreferrer" class="tx-id-short svelte-1787xw1"> </a></div>`);
var root_3 = from_html(`<button>Formatted View</button>`);
var root_4 = from_html(`<button>PTB Commands</button>`);
var root_5 = from_html(`<button>Signatures</button>`);
var root_6 = from_html(`<button>Tx Bytes</button>`);
var root_7 = from_html(`<button class="svelte-1787xw1"> </button>`);
var root_8 = from_html(`<div class="error-message svelte-1787xw1"> <button class="svelte-1787xw1">×</button></div>`);
var root_10 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Unsigned Transaction (TransactionData)</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_12 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Transaction Bytes</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_15 = from_html(`<span class="signature-label svelte-1787xw1"></span>`);
var root_14 = from_html(`<div class="signature-item svelte-1787xw1"><!> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_13 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong> </strong> <button class="copy-btn svelte-1787xw1">Copy All</button></div> <!></div>`);
var root_16 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Signed Transaction (SenderSignedData)</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_9 = from_html(`<div class="tx-bytes-view svelte-1787xw1"><!> <!> <!></div>`);
var root_18 = from_html(`<div class="signatures-view"><!></div>`);
var root_20 = from_html(`<div class="formatted-view svelte-1787xw1"><!></div>`);
var root_22 = from_html(`<div class="tree-view svelte-1787xw1"><!></div>`);
var root_24 = from_html(`<div class="commands-view-container svelte-1787xw1"><!></div>`);
var root_25 = from_html(`<div class="json-view svelte-1787xw1"><pre class="svelte-1787xw1"> </pre></div>`);
var root_1 = from_html(`<div class="transaction-view ultra-compact svelte-1787xw1"><!> <div class="view-controls svelte-1787xw1"><!> <!> <button>Raw JSON</button> <button>JSON Tree</button> <!> <!> <!> <button class="close-btn svelte-1787xw1" style="margin-left: auto;">×</button></div> <!> <!></div>`);
function TransactionView($$anchor, $$props) {
  push($$props, true);
  let value = prop($$props, "value", 15), showTypeInfo = prop($$props, "showTypeInfo", 3, true), shortPackageIds = prop($$props, "shortPackageIds", 3, true);
  let viewMode = state(proxy(new URLSearchParams(window.location.hash.split("?")[1] || "").get("view") || "formatted"));
  let prevViewMode = state("formatted");
  let commandIndex = state(proxy(parseInt(new URLSearchParams(window.location.hash.split("?")[1] || "").get("commandIndex") || "") || null));
  let hidden = user_derived(() => !value() || typeof value() === "object" && !Object.keys(value() || {}).length);
  let isDryRunning = state(false);
  let dryRunError = state("");
  function isValidTxBytes(str) {
    try {
      const txBytes2 = fromBase64(str);
      TransactionDataBuilder.fromBytes(txBytes2);
      return true;
    } catch {
      return false;
    }
  }
  let hasTxBytes = user_derived(() => value() && (typeof value() === "string" && isValidTxBytes(value()) || typeof value() === "object" && ("transactionBytes" in value() && value().transactionBytes || "rawTransaction" in value() && value().rawTransaction || "bytes" in value() && value().bytes || isTransactionData(value()))));
  let signedTxBytes = user_derived(() => value()?.rawTransaction || "");
  let unsignedTxBytes = user_derived(() => value()?.transactionBytes || value()?.bytes || "");
  let txBytes = user_derived(() => get(unsignedTxBytes) || get(signedTxBytes) || (typeof value() === "string" ? value() : ""));
  let hasDryRunResults = user_derived(() => value() && typeof value() === "object" && "effects" in value() && value().effects);
  let isDryRunResult = user_derived(() => value() && typeof value() === "object" && "effects" in value() && !("transactionBytes" in value() || "rawTransaction" in value() || "bytes" in value()));
  let transactionData = user_derived(() => getTransactionData(value()));
  let hasSignatures = user_derived(() => get(transactionData)?.signatures && Array.isArray(get(transactionData).signatures) && get(transactionData).signatures.length > 0);
  user_effect(() => {
    if (value()) {
      const isTxData = isTransactionData(value());
      const hasBytes = get(hasTxBytes);
      const hasSigs = get(hasSignatures);
      const validModes = isTxData ? ["formatted", "commands", "json", "tree"] : ["json", "tree"];
      if (hasBytes) validModes.push("txbytes");
      if (hasSigs) validModes.push("signatures");
      if (!validModes.includes(get(viewMode))) {
        set(viewMode, isTxData ? "formatted" : "json", true);
      }
      if (!validModes.includes(get(prevViewMode))) {
        set(prevViewMode, get(viewMode), true);
      }
      set(dryRunError, "");
    }
  });
  user_effect(() => {
    const hashParts = window.location.hash.split("?");
    const path = hashParts[0];
    const params = new URLSearchParams(hashParts[1] || "");
    const currentView = params.get("view");
    const currentCommandIndex = params.get("commandIndex");
    const newCommandIndex = get(commandIndex) !== null ? get(commandIndex).toString() : null;
    if (currentView !== get(viewMode) || currentCommandIndex !== newCommandIndex) {
      params.set("view", get(viewMode));
      if (get(commandIndex) !== null) {
        params.set("commandIndex", get(commandIndex).toString());
      } else {
        params.delete("commandIndex");
      }
      window.location.hash = path + "?" + params.toString();
    }
  });
  async function performDryRun() {
    if (!get(hasTxBytes) || get(isDryRunning)) return;
    try {
      set(isDryRunning, true);
      const client = getClient();
      const txBytesValue = get(txBytes);
      const dryRunResult = await client.dryRunTransactionBlock({ transactionBlock: txBytesValue });
      const updatedData = {
        ...value(),
        ...dryRunResult,
        // Keep the original transactionBytes
        transactionBytes: txBytesValue,
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
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_17 = ($$anchor2) => {
      var div = root_1();
      var node_1 = child(div);
      {
        var consequent = ($$anchor3) => {
          var div_1 = root_2();
          var a = sibling(child(div_1), 2);
          var text2 = child(a);
          template_effect(
            ($0) => {
              set_attribute(a, "href", $0);
              set_attribute(a, "title", get(transactionData)?.digest);
              set_text(text2, get(transactionData)?.digest);
            },
            [
              () => get(transactionData)?.digest ? getTransactionLink(getSelectedNetworkConfig(), get(transactionData).digest) : "#"
            ]
          );
          append($$anchor3, div_1);
        };
        if_block(node_1, ($$render) => {
          if (get(transactionData)?.digest) $$render(consequent);
        });
      }
      var div_2 = sibling(node_1, 2);
      var node_2 = child(div_2);
      {
        var consequent_1 = ($$anchor3) => {
          var button = root_3();
          button.__click = () => {
            set(viewMode, "formatted");
          };
          let classes;
          template_effect(() => classes = set_class(button, 1, "svelte-1787xw1", null, classes, { active: get(viewMode) === "formatted" }));
          append($$anchor3, button);
        };
        if_block(node_2, ($$render) => {
          if (isTransactionData(value())) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var button_1 = root_4();
          button_1.__click = () => {
            set(viewMode, "commands");
          };
          let classes_1;
          template_effect(() => classes_1 = set_class(button_1, 1, "svelte-1787xw1", null, classes_1, { active: get(viewMode) === "commands" }));
          append($$anchor3, button_1);
        };
        if_block(node_3, ($$render) => {
          if (isTransactionData(value())) $$render(consequent_2);
        });
      }
      var button_2 = sibling(node_3, 2);
      button_2.__click = () => {
        set(viewMode, "json");
      };
      let classes_2;
      var button_3 = sibling(button_2, 2);
      button_3.__click = () => {
        set(viewMode, "tree");
      };
      let classes_3;
      var node_4 = sibling(button_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var button_4 = root_5();
          button_4.__click = () => {
            set(viewMode, "signatures");
          };
          let classes_4;
          template_effect(() => classes_4 = set_class(button_4, 1, "svelte-1787xw1", null, classes_4, { active: get(viewMode) === "signatures" }));
          append($$anchor3, button_4);
        };
        if_block(node_4, ($$render) => {
          if (get(hasSignatures)) $$render(consequent_3);
        });
      }
      var node_5 = sibling(node_4, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var button_5 = root_6();
          button_5.__click = () => {
            if (get(viewMode) === "txbytes") {
              set(viewMode, get(prevViewMode), true);
            } else {
              set(prevViewMode, get(viewMode), true);
              set(viewMode, "txbytes");
            }
          };
          let classes_5;
          template_effect(() => classes_5 = set_class(button_5, 1, "svelte-1787xw1", null, classes_5, { active: get(viewMode) === "txbytes" }));
          append($$anchor3, button_5);
        };
        if_block(node_5, ($$render) => {
          if (get(hasTxBytes) && !get(isDryRunResult)) $$render(consequent_4);
        });
      }
      var node_6 = sibling(node_5, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var button_6 = root_7();
          button_6.__click = performDryRun;
          var text_1 = child(button_6);
          template_effect(() => {
            button_6.disabled = get(isDryRunning);
            set_text(text_1, get(isDryRunning) ? "Running..." : get(hasDryRunResults) ? "Re-run Dry" : "Dry Run");
          });
          append($$anchor3, button_6);
        };
        if_block(node_6, ($$render) => {
          if (get(hasTxBytes) && !get(isDryRunResult)) $$render(consequent_5);
        });
      }
      var button_7 = sibling(node_6, 2);
      button_7.__click = () => value(null);
      var node_7 = sibling(div_2, 2);
      {
        var consequent_6 = ($$anchor3) => {
          var div_3 = root_8();
          var text_2 = child(div_3);
          var button_8 = sibling(text_2);
          button_8.__click = () => set(dryRunError, "");
          template_effect(() => set_text(text_2, `${get(dryRunError) ?? ""} `));
          append($$anchor3, div_3);
        };
        if_block(node_7, ($$render) => {
          if (get(dryRunError)) $$render(consequent_6);
        });
      }
      var node_8 = sibling(node_7, 2);
      {
        var consequent_12 = ($$anchor3) => {
          var div_4 = root_9();
          var node_9 = child(div_4);
          {
            var consequent_7 = ($$anchor4) => {
              var div_5 = root_10();
              var div_6 = child(div_5);
              var button_9 = sibling(child(div_6), 2);
              button_9.__click = () => navigator.clipboard.writeText(get(unsignedTxBytes));
              var pre = sibling(div_6, 2);
              var text_3 = child(pre);
              template_effect(() => set_text(text_3, get(unsignedTxBytes)));
              append($$anchor4, div_5);
            };
            var alternate = ($$anchor4) => {
              var fragment_1 = comment();
              var node_10 = first_child(fragment_1);
              {
                var consequent_8 = ($$anchor5) => {
                  var div_7 = root_12();
                  var div_8 = child(div_7);
                  var button_10 = sibling(child(div_8), 2);
                  button_10.__click = () => navigator.clipboard.writeText(get(txBytes));
                  var pre_1 = sibling(div_8, 2);
                  var text_4 = child(pre_1);
                  template_effect(() => set_text(text_4, get(txBytes)));
                  append($$anchor5, div_7);
                };
                if_block(
                  node_10,
                  ($$render) => {
                    if (get(txBytes) && !get(signedTxBytes)) $$render(consequent_8);
                  },
                  true
                );
              }
              append($$anchor4, fragment_1);
            };
            if_block(node_9, ($$render) => {
              if (get(unsignedTxBytes)) $$render(consequent_7);
              else $$render(alternate, false);
            });
          }
          var node_11 = sibling(node_9, 2);
          {
            var consequent_10 = ($$anchor4) => {
              var div_9 = root_13();
              var div_10 = child(div_9);
              var strong = child(div_10);
              var text_5 = child(strong);
              var button_11 = sibling(strong, 2);
              button_11.__click = () => navigator.clipboard.writeText(get(transactionData).signatures.join("\n"));
              var node_12 = sibling(div_10, 2);
              each(node_12, 17, () => get(transactionData).signatures, index, ($$anchor5, sig, i) => {
                var div_11 = root_14();
                var node_13 = child(div_11);
                {
                  var consequent_9 = ($$anchor6) => {
                    var span = root_15();
                    span.textContent = `#${i + 1}`;
                    append($$anchor6, span);
                  };
                  if_block(node_13, ($$render) => {
                    if (get(transactionData).signatures.length > 1) $$render(consequent_9);
                  });
                }
                var pre_2 = sibling(node_13, 2);
                var text_6 = child(pre_2);
                template_effect(() => set_text(text_6, get(sig)));
                append($$anchor5, div_11);
              });
              template_effect(() => set_text(text_5, `Signature${get(transactionData).signatures.length > 1 ? "s" : ""} (${get(transactionData).signatures.length ?? ""})`));
              append($$anchor4, div_9);
            };
            if_block(node_11, ($$render) => {
              if (get(transactionData)?.signatures && Array.isArray(get(transactionData).signatures) && get(transactionData).signatures.length > 0) $$render(consequent_10);
            });
          }
          var node_14 = sibling(node_11, 2);
          {
            var consequent_11 = ($$anchor4) => {
              var div_12 = root_16();
              var div_13 = child(div_12);
              var button_12 = sibling(child(div_13), 2);
              button_12.__click = () => navigator.clipboard.writeText(get(signedTxBytes));
              var pre_3 = sibling(div_13, 2);
              var text_7 = child(pre_3);
              template_effect(() => set_text(text_7, get(signedTxBytes)));
              append($$anchor4, div_12);
            };
            if_block(node_14, ($$render) => {
              if (get(signedTxBytes)) $$render(consequent_11);
            });
          }
          append($$anchor3, div_4);
        };
        var alternate_5 = ($$anchor3) => {
          var fragment_2 = comment();
          var node_15 = first_child(fragment_2);
          {
            var consequent_13 = ($$anchor4) => {
              var div_14 = root_18();
              var node_16 = child(div_14);
              TransactionSignatures(node_16, {
                get signatures() {
                  return get(transactionData).signatures;
                },
                get transactionData() {
                  return get(transactionData);
                }
              });
              append($$anchor4, div_14);
            };
            var alternate_4 = ($$anchor4) => {
              var fragment_3 = comment();
              var node_17 = first_child(fragment_3);
              {
                var consequent_14 = ($$anchor5) => {
                  var div_15 = root_20();
                  var node_18 = child(div_15);
                  {
                    let $0 = user_derived(() => getTransactionData(value()));
                    TransactionEffects(node_18, {
                      get transactionData() {
                        return get($0);
                      }
                    });
                  }
                  append($$anchor5, div_15);
                };
                var alternate_3 = ($$anchor5) => {
                  var fragment_4 = comment();
                  var node_19 = first_child(fragment_4);
                  {
                    var consequent_15 = ($$anchor6) => {
                      var div_16 = root_22();
                      var node_20 = child(div_16);
                      {
                        let $0 = user_derived(() => isTransactionData(value()) ? get(transactionData) : value());
                        Root(node_20, {
                          get value() {
                            return get($0);
                          },
                          defaultExpandedLevel: 1
                        });
                      }
                      append($$anchor6, div_16);
                    };
                    var alternate_2 = ($$anchor6) => {
                      var fragment_5 = comment();
                      var node_21 = first_child(fragment_5);
                      {
                        var consequent_16 = ($$anchor7) => {
                          var div_17 = root_24();
                          var node_22 = child(div_17);
                          {
                            let $0 = user_derived(() => getTransactionData(value()));
                            TransactionCommands(node_22, {
                              get transactionData() {
                                return get($0);
                              },
                              get commandIndex() {
                                return get(commandIndex);
                              },
                              onCommandIndexChange: (i) => set(commandIndex, i, true),
                              get showTypeInfo() {
                                return showTypeInfo();
                              },
                              get shortPackageIds() {
                                return shortPackageIds();
                              }
                            });
                          }
                          append($$anchor7, div_17);
                        };
                        var alternate_1 = ($$anchor7) => {
                          var div_18 = root_25();
                          var pre_4 = child(div_18);
                          var text_8 = child(pre_4);
                          template_effect(($0) => set_text(text_8, $0), [
                            () => formatJsonWithCompactArrays(isTransactionData(value()) ? get(transactionData) : value())
                          ]);
                          append($$anchor7, div_18);
                        };
                        if_block(
                          node_21,
                          ($$render) => {
                            if (get(viewMode) === "commands") $$render(consequent_16);
                            else $$render(alternate_1, false);
                          },
                          true
                        );
                      }
                      append($$anchor6, fragment_5);
                    };
                    if_block(
                      node_19,
                      ($$render) => {
                        if (get(viewMode) === "tree") $$render(consequent_15);
                        else $$render(alternate_2, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_4);
                };
                if_block(
                  node_17,
                  ($$render) => {
                    if (get(viewMode) === "formatted" && isTransactionData(value())) $$render(consequent_14);
                    else $$render(alternate_3, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_3);
            };
            if_block(
              node_15,
              ($$render) => {
                if (get(viewMode) === "signatures" && get(hasSignatures)) $$render(consequent_13);
                else $$render(alternate_4, false);
              },
              true
            );
          }
          append($$anchor3, fragment_2);
        };
        if_block(node_8, ($$render) => {
          if (get(viewMode) === "txbytes" && get(hasTxBytes)) $$render(consequent_12);
          else $$render(alternate_5, false);
        });
      }
      template_effect(() => {
        classes_2 = set_class(button_2, 1, "svelte-1787xw1", null, classes_2, { active: get(viewMode) === "json" });
        classes_3 = set_class(button_3, 1, "svelte-1787xw1", null, classes_3, { active: get(viewMode) === "tree" });
      });
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (!get(hidden)) $$render(consequent_17);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["click"]);
export {
  TransactionView as T,
  publicKeyFromRawBytes as a,
  verifyPersonalMessageSignature as b,
  TransactionCommands as c,
  parsePartialSignatures as p,
  verifyTransactionSignature as v
};

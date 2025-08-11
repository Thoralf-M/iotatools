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
var _listeners, _observer, _options, _ResizeObserverSingleton_instances, getObserver_fn;
import { Z as effect, C as untrack, p as push, r as prop, w as legacy_pre_effect, j as set, m as mutable_source, x as deep_read_state, g as get, y as legacy_pre_effect_reset, f as from_html, b as if_block, c as child, s as sibling, z as each, t as template_effect, e as event, k as append, l as pop, J as comment, G as first_child, _ as derived_safe_equal, H as text, i as init, A as index, d as set_text, $ as action, o as mutate, T as getSelectedNetworkConfig, M as toB64, a0 as bcs, V as store_get, E as bind_value, U as setup_stores, a1 as activeAddress, Y as delegate } from "/iota-utils/assets/index-BnYhK8oQ.js";
import { J as JsonToggleView } from "/iota-utils/assets/JsonToggleView-DSuOfcyF.js";
import { s as set_style } from "/iota-utils/assets/style-CPwsKZh8.js";
import { b as bind_this } from "/iota-utils/assets/this-lhlH9jsk.js";
import { s as sanitize_slots, a as slot } from "/iota-utils/assets/transaction-view-D84UYr3l.js";
import { b as bind_prop } from "/iota-utils/assets/props-D-Q2s4a6.js";
import { E as EpochPTBAnalyzer } from "/iota-utils/assets/index-C8LxPBX8.js";
import { I as IotaGraphQLClient } from "/iota-utils/assets/index-BBHJ0dF4.js";
const _ResizeObserverSingleton = class _ResizeObserverSingleton {
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    __privateAdd(this, _ResizeObserverSingleton_instances);
    /** */
    __privateAdd(this, _listeners, /* @__PURE__ */ new WeakMap());
    /** @type {ResizeObserver | undefined} */
    __privateAdd(this, _observer);
    /** @type {ResizeObserverOptions} */
    __privateAdd(this, _options);
    __privateSet(this, _options, options);
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(element, listener) {
    var listeners = __privateGet(this, _listeners).get(element) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    __privateGet(this, _listeners).set(element, listeners);
    __privateMethod(this, _ResizeObserverSingleton_instances, getObserver_fn).call(this).observe(element, __privateGet(this, _options));
    return () => {
      var listeners2 = __privateGet(this, _listeners).get(element);
      listeners2.delete(listener);
      if (listeners2.size === 0) {
        __privateGet(this, _listeners).delete(element);
        __privateGet(this, _observer).unobserve(element);
      }
    };
  }
};
_listeners = new WeakMap();
_observer = new WeakMap();
_options = new WeakMap();
_ResizeObserverSingleton_instances = new WeakSet();
getObserver_fn = function() {
  return __privateGet(this, _observer) ?? __privateSet(this, _observer, new ResizeObserver(
    /** @param {any} entries */
    (entries) => {
      for (var entry of entries) {
        _ResizeObserverSingleton.entries.set(entry.target, entry);
        for (var listener of __privateGet(this, _listeners).get(entry.target) || []) {
          listener(entry);
        }
      }
    }
  ));
};
/** @static */
__publicField(_ResizeObserverSingleton, "entries", /* @__PURE__ */ new WeakMap());
let ResizeObserverSingleton = _ResizeObserverSingleton;
var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "border-box"
});
function bind_element_size(element, type, set2) {
  var unsub = resize_observer_border_box.observe(element, () => set2(element[type]));
  effect(() => {
    untrack(() => set2(element[type]));
    return unsub;
  });
}
new TextEncoder();
const CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  let offset = inputOffset;
  const end = offset + byteLength;
  const units = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      const byte4 = bytes[offset++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }
  return result;
}
const sharedTextDecoder = new TextDecoder();
const TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}
class ExtData {
  constructor(type, data2) {
    this.type = type;
    this.data = data2;
  }
}
class DecodeError extends Error {
  constructor(message) {
    super(message);
    const proto = Object.create(DecodeError.prototype);
    Object.setPrototypeOf(this, proto);
    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: DecodeError.name
    });
  }
}
const UINT32_MAX = 4294967295;
function setInt64(view, offset, value) {
  const high = Math.floor(value / 4294967296);
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
const EXT_TIMESTAMP = -1;
const TIMESTAMP32_MAX_SEC = 4294967296 - 1;
const TIMESTAMP64_MAX_SEC = 17179869184 - 1;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      const rv = new Uint8Array(4);
      const view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      const secHigh = sec / 4294967296;
      const secLow = sec & 4294967295;
      const rv = new Uint8Array(8);
      const view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    const rv = new Uint8Array(12);
    const view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  const msec = date.getTime();
  const sec = Math.floor(msec / 1e3);
  const nsec = (msec - sec * 1e3) * 1e6;
  const nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    const timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data2) {
  const view = new DataView(data2.buffer, data2.byteOffset, data2.byteLength);
  switch (data2.byteLength) {
    case 4: {
      const sec = view.getUint32(0);
      const nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      const nsec30AndSecHigh2 = view.getUint32(0);
      const secLow32 = view.getUint32(4);
      const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      const nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      const sec = getInt64(view, 4);
      const nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data2.length}`);
  }
}
function decodeTimestampExtension(data2) {
  const timeSpec = decodeTimestampToTimeSpec(data2);
  return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
const timestampExtension = {
  type: EXT_TIMESTAMP,
  encode: encodeTimestampExtension,
  decode: decodeTimestampExtension
};
class ExtensionCodec {
  constructor() {
    this.builtInEncoders = [];
    this.builtInDecoders = [];
    this.encoders = [];
    this.decoders = [];
    this.register(timestampExtension);
  }
  register({ type, encode, decode: decode2 }) {
    if (type >= 0) {
      this.encoders[type] = encode;
      this.decoders[type] = decode2;
    } else {
      const index2 = -1 - type;
      this.builtInEncoders[index2] = encode;
      this.builtInDecoders[index2] = decode2;
    }
  }
  tryToEncode(object, context) {
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encodeExt = this.builtInEncoders[i];
      if (encodeExt != null) {
        const data2 = encodeExt(object, context);
        if (data2 != null) {
          const type = -1 - i;
          return new ExtData(type, data2);
        }
      }
    }
    for (let i = 0; i < this.encoders.length; i++) {
      const encodeExt = this.encoders[i];
      if (encodeExt != null) {
        const data2 = encodeExt(object, context);
        if (data2 != null) {
          const type = i;
          return new ExtData(type, data2);
        }
      }
    }
    if (object instanceof ExtData) {
      return object;
    }
    return null;
  }
  decode(data2, type, context) {
    const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decodeExt) {
      return decodeExt(data2, type, context);
    } else {
      return new ExtData(type, data2);
    }
  }
}
ExtensionCodec.defaultCodec = new ExtensionCodec();
function isArrayBufferLike(buffer) {
  return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (isArrayBufferLike(buffer)) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}
function prettyByte(byte) {
  return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}
const DEFAULT_MAX_KEY_LENGTH = 16;
const DEFAULT_MAX_LENGTH_PER_KEY = 16;
class CachedKeyDecoder {
  constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
    this.hit = 0;
    this.miss = 0;
    this.maxKeyLength = maxKeyLength;
    this.maxLengthPerKey = maxLengthPerKey;
    this.caches = [];
    for (let i = 0; i < this.maxKeyLength; i++) {
      this.caches.push([]);
    }
  }
  canBeCached(byteLength) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  }
  find(bytes, inputOffset, byteLength) {
    const records = this.caches[byteLength - 1];
    FIND_CHUNK: for (const record of records) {
      const recordBytes = record.bytes;
      for (let j = 0; j < byteLength; j++) {
        if (recordBytes[j] !== bytes[inputOffset + j]) {
          continue FIND_CHUNK;
        }
      }
      return record.str;
    }
    return null;
  }
  store(bytes, value) {
    const records = this.caches[bytes.length - 1];
    const record = { bytes, str: value };
    if (records.length >= this.maxLengthPerKey) {
      records[Math.random() * records.length | 0] = record;
    } else {
      records.push(record);
    }
  }
  decode(bytes, inputOffset, byteLength) {
    const cachedValue = this.find(bytes, inputOffset, byteLength);
    if (cachedValue != null) {
      this.hit++;
      return cachedValue;
    }
    this.miss++;
    const str = utf8DecodeJs(bytes, inputOffset, byteLength);
    const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
    this.store(slicedCopyOfBytes, str);
    return str;
  }
}
const STATE_ARRAY = "array";
const STATE_MAP_KEY = "map_key";
const STATE_MAP_VALUE = "map_value";
const mapKeyConverter = (key) => {
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }
  throw new DecodeError("The type of key must be string or number but " + typeof key);
};
class StackPool {
  constructor() {
    this.stack = [];
    this.stackHeadPosition = -1;
  }
  get length() {
    return this.stackHeadPosition + 1;
  }
  top() {
    return this.stack[this.stackHeadPosition];
  }
  pushArrayState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_ARRAY;
    state.position = 0;
    state.size = size;
    state.array = new Array(size);
  }
  pushMapState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_MAP_KEY;
    state.readCount = 0;
    state.size = size;
    state.map = {};
  }
  getUninitializedStateFromPool() {
    this.stackHeadPosition++;
    if (this.stackHeadPosition === this.stack.length) {
      const partialState = {
        type: void 0,
        size: 0,
        array: void 0,
        position: 0,
        readCount: 0,
        map: void 0,
        key: null
      };
      this.stack.push(partialState);
    }
    return this.stack[this.stackHeadPosition];
  }
  release(state) {
    const topStackState = this.stack[this.stackHeadPosition];
    if (topStackState !== state) {
      throw new Error("Invalid stack state. Released state is not on top of the stack.");
    }
    if (state.type === STATE_ARRAY) {
      const partialState = state;
      partialState.size = 0;
      partialState.array = void 0;
      partialState.position = 0;
      partialState.type = void 0;
    }
    if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
      const partialState = state;
      partialState.size = 0;
      partialState.map = void 0;
      partialState.readCount = 0;
      partialState.type = void 0;
    }
    this.stackHeadPosition--;
  }
  reset() {
    this.stack.length = 0;
    this.stackHeadPosition = -1;
  }
}
const HEAD_BYTE_REQUIRED = -1;
const EMPTY_VIEW = new DataView(new ArrayBuffer(0));
const EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
  EMPTY_VIEW.getInt8(0);
} catch (e) {
  if (!(e instanceof RangeError)) {
    throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
  }
}
const MORE_DATA = new RangeError("Insufficient data");
const sharedCachedKeyDecoder = new CachedKeyDecoder();
class Decoder {
  constructor(options) {
    this.totalPos = 0;
    this.pos = 0;
    this.view = EMPTY_VIEW;
    this.bytes = EMPTY_BYTES;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack = new StackPool();
    this.entered = false;
    this.extensionCodec = (options == null ? void 0 : options.extensionCodec) ?? ExtensionCodec.defaultCodec;
    this.context = options == null ? void 0 : options.context;
    this.useBigInt64 = (options == null ? void 0 : options.useBigInt64) ?? false;
    this.rawStrings = (options == null ? void 0 : options.rawStrings) ?? false;
    this.maxStrLength = (options == null ? void 0 : options.maxStrLength) ?? UINT32_MAX;
    this.maxBinLength = (options == null ? void 0 : options.maxBinLength) ?? UINT32_MAX;
    this.maxArrayLength = (options == null ? void 0 : options.maxArrayLength) ?? UINT32_MAX;
    this.maxMapLength = (options == null ? void 0 : options.maxMapLength) ?? UINT32_MAX;
    this.maxExtLength = (options == null ? void 0 : options.maxExtLength) ?? UINT32_MAX;
    this.keyDecoder = (options == null ? void 0 : options.keyDecoder) !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
    this.mapKeyConverter = (options == null ? void 0 : options.mapKeyConverter) ?? mapKeyConverter;
  }
  clone() {
    return new Decoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      rawStrings: this.rawStrings,
      maxStrLength: this.maxStrLength,
      maxBinLength: this.maxBinLength,
      maxArrayLength: this.maxArrayLength,
      maxMapLength: this.maxMapLength,
      maxExtLength: this.maxExtLength,
      keyDecoder: this.keyDecoder
    });
  }
  reinitializeState() {
    this.totalPos = 0;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack.reset();
  }
  setBuffer(buffer) {
    const bytes = ensureUint8Array(buffer);
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = 0;
  }
  appendBuffer(buffer) {
    if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
      this.setBuffer(buffer);
    } else {
      const remainingData = this.bytes.subarray(this.pos);
      const newData = ensureUint8Array(buffer);
      const newBuffer = new Uint8Array(remainingData.length + newData.length);
      newBuffer.set(remainingData);
      newBuffer.set(newData, remainingData.length);
      this.setBuffer(newBuffer);
    }
  }
  hasRemaining(size) {
    return this.view.byteLength - this.pos >= size;
  }
  createExtraByteError(posToShow) {
    const { view, pos } = this;
    return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
  }
  /**
   * @throws {@link DecodeError}
   * @throws {@link RangeError}
   */
  decode(buffer) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decode(buffer);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      const object = this.doDecodeSync();
      if (this.hasRemaining(1)) {
        throw this.createExtraByteError(this.pos);
      }
      return object;
    } finally {
      this.entered = false;
    }
  }
  *decodeMulti(buffer) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMulti(buffer);
      return;
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      while (this.hasRemaining(1)) {
        yield this.doDecodeSync();
      }
    } finally {
      this.entered = false;
    }
  }
  async decodeAsync(stream) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decodeAsync(stream);
    }
    try {
      this.entered = true;
      let decoded = false;
      let object;
      for await (const buffer of stream) {
        if (decoded) {
          this.entered = false;
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        try {
          object = this.doDecodeSync();
          decoded = true;
        } catch (e) {
          if (!(e instanceof RangeError)) {
            throw e;
          }
        }
        this.totalPos += this.pos;
      }
      if (decoded) {
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.totalPos);
        }
        return object;
      }
      const { headByte, pos, totalPos } = this;
      throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
    } finally {
      this.entered = false;
    }
  }
  decodeArrayStream(stream) {
    return this.decodeMultiAsync(stream, true);
  }
  decodeStream(stream) {
    return this.decodeMultiAsync(stream, false);
  }
  async *decodeMultiAsync(stream, isArray) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMultiAsync(stream, isArray);
      return;
    }
    try {
      this.entered = true;
      let isArrayHeaderRequired = isArray;
      let arrayItemsLeft = -1;
      for await (const buffer of stream) {
        if (isArray && arrayItemsLeft === 0) {
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        if (isArrayHeaderRequired) {
          arrayItemsLeft = this.readArraySize();
          isArrayHeaderRequired = false;
          this.complete();
        }
        try {
          while (true) {
            yield this.doDecodeSync();
            if (--arrayItemsLeft === 0) {
              break;
            }
          }
        } catch (e) {
          if (!(e instanceof RangeError)) {
            throw e;
          }
        }
        this.totalPos += this.pos;
      }
    } finally {
      this.entered = false;
    }
  }
  doDecodeSync() {
    DECODE: while (true) {
      const headByte = this.readHeadByte();
      let object;
      if (headByte >= 224) {
        object = headByte - 256;
      } else if (headByte < 192) {
        if (headByte < 128) {
          object = headByte;
        } else if (headByte < 144) {
          const size = headByte - 128;
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte < 160) {
          const size = headByte - 144;
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else {
          const byteLength = headByte - 160;
          object = this.decodeString(byteLength, 0);
        }
      } else if (headByte === 192) {
        object = null;
      } else if (headByte === 194) {
        object = false;
      } else if (headByte === 195) {
        object = true;
      } else if (headByte === 202) {
        object = this.readF32();
      } else if (headByte === 203) {
        object = this.readF64();
      } else if (headByte === 204) {
        object = this.readU8();
      } else if (headByte === 205) {
        object = this.readU16();
      } else if (headByte === 206) {
        object = this.readU32();
      } else if (headByte === 207) {
        if (this.useBigInt64) {
          object = this.readU64AsBigInt();
        } else {
          object = this.readU64();
        }
      } else if (headByte === 208) {
        object = this.readI8();
      } else if (headByte === 209) {
        object = this.readI16();
      } else if (headByte === 210) {
        object = this.readI32();
      } else if (headByte === 211) {
        if (this.useBigInt64) {
          object = this.readI64AsBigInt();
        } else {
          object = this.readI64();
        }
      } else if (headByte === 217) {
        const byteLength = this.lookU8();
        object = this.decodeString(byteLength, 1);
      } else if (headByte === 218) {
        const byteLength = this.lookU16();
        object = this.decodeString(byteLength, 2);
      } else if (headByte === 219) {
        const byteLength = this.lookU32();
        object = this.decodeString(byteLength, 4);
      } else if (headByte === 220) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 221) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 222) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 223) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 196) {
        const size = this.lookU8();
        object = this.decodeBinary(size, 1);
      } else if (headByte === 197) {
        const size = this.lookU16();
        object = this.decodeBinary(size, 2);
      } else if (headByte === 198) {
        const size = this.lookU32();
        object = this.decodeBinary(size, 4);
      } else if (headByte === 212) {
        object = this.decodeExtension(1, 0);
      } else if (headByte === 213) {
        object = this.decodeExtension(2, 0);
      } else if (headByte === 214) {
        object = this.decodeExtension(4, 0);
      } else if (headByte === 215) {
        object = this.decodeExtension(8, 0);
      } else if (headByte === 216) {
        object = this.decodeExtension(16, 0);
      } else if (headByte === 199) {
        const size = this.lookU8();
        object = this.decodeExtension(size, 1);
      } else if (headByte === 200) {
        const size = this.lookU16();
        object = this.decodeExtension(size, 2);
      } else if (headByte === 201) {
        const size = this.lookU32();
        object = this.decodeExtension(size, 4);
      } else {
        throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
      }
      this.complete();
      const stack = this.stack;
      while (stack.length > 0) {
        const state = stack.top();
        if (state.type === STATE_ARRAY) {
          state.array[state.position] = object;
          state.position++;
          if (state.position === state.size) {
            object = state.array;
            stack.release(state);
          } else {
            continue DECODE;
          }
        } else if (state.type === STATE_MAP_KEY) {
          if (object === "__proto__") {
            throw new DecodeError("The key __proto__ is not allowed");
          }
          state.key = this.mapKeyConverter(object);
          state.type = STATE_MAP_VALUE;
          continue DECODE;
        } else {
          state.map[state.key] = object;
          state.readCount++;
          if (state.readCount === state.size) {
            object = state.map;
            stack.release(state);
          } else {
            state.key = null;
            state.type = STATE_MAP_KEY;
            continue DECODE;
          }
        }
      }
      return object;
    }
  }
  readHeadByte() {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  }
  complete() {
    this.headByte = HEAD_BYTE_REQUIRED;
  }
  readArraySize() {
    const headByte = this.readHeadByte();
    switch (headByte) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default: {
        if (headByte < 160) {
          return headByte - 144;
        } else {
          throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
        }
      }
    }
  }
  pushMapState(size) {
    if (size > this.maxMapLength) {
      throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
    }
    this.stack.pushMapState(size);
  }
  pushArrayState(size) {
    if (size > this.maxArrayLength) {
      throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
    }
    this.stack.pushArrayState(size);
  }
  decodeString(byteLength, headerOffset) {
    if (!this.rawStrings || this.stateIsMapKey()) {
      return this.decodeUtf8String(byteLength, headerOffset);
    }
    return this.decodeBinary(byteLength, headerOffset);
  }
  /**
   * @throws {@link RangeError}
   */
  decodeUtf8String(byteLength, headerOffset) {
    var _a;
    if (byteLength > this.maxStrLength) {
      throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
    }
    if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
    }
    const offset = this.pos + headerOffset;
    let object;
    if (this.stateIsMapKey() && ((_a = this.keyDecoder) == null ? void 0 : _a.canBeCached(byteLength))) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
    } else {
      object = utf8Decode(this.bytes, offset, byteLength);
    }
    this.pos += headerOffset + byteLength;
    return object;
  }
  stateIsMapKey() {
    if (this.stack.length > 0) {
      const state = this.stack.top();
      return state.type === STATE_MAP_KEY;
    }
    return false;
  }
  /**
   * @throws {@link RangeError}
   */
  decodeBinary(byteLength, headOffset) {
    if (byteLength > this.maxBinLength) {
      throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
    }
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }
    const offset = this.pos + headOffset;
    const object = this.bytes.subarray(offset, offset + byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }
  decodeExtension(size, headOffset) {
    if (size > this.maxExtLength) {
      throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
    }
    const extType = this.view.getInt8(this.pos + headOffset);
    const data2 = this.decodeBinary(
      size,
      headOffset + 1
      /* extType */
    );
    return this.extensionCodec.decode(data2, extType, this.context);
  }
  lookU8() {
    return this.view.getUint8(this.pos);
  }
  lookU16() {
    return this.view.getUint16(this.pos);
  }
  lookU32() {
    return this.view.getUint32(this.pos);
  }
  readU8() {
    const value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  }
  readI8() {
    const value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  }
  readU16() {
    const value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  }
  readI16() {
    const value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  }
  readU32() {
    const value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  }
  readI32() {
    const value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  }
  readU64() {
    const value = getUint64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readI64() {
    const value = getInt64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readU64AsBigInt() {
    const value = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return value;
  }
  readI64AsBigInt() {
    const value = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return value;
  }
  readF32() {
    const value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  }
  readF64() {
    const value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  }
}
function decode(buffer, options) {
  const decoder = new Decoder(options);
  return decoder.decode(buffer);
}
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
function zero$1(buf) {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
const MIN_MATCH$1 = 3;
const MAX_MATCH$1 = 258;
const LENGTH_CODES$1 = 29;
const LITERALS$1 = 256;
const L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
const D_CODES$1 = 30;
const DIST_CODE_LEN = 512;
const static_ltree = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
const static_dtree = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
const _dist_code = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
const _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
const base_length = new Array(LENGTH_CODES$1);
zero$1(base_length);
const base_dist = new Array(D_CODES$1);
zero$1(base_dist);
const adler32 = (adler, buf, len, pos) => {
  let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
  while (len !== 0) {
    n = len > 2e3 ? 2e3 : len;
    len -= n;
    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);
    s1 %= 65521;
    s2 %= 65521;
  }
  return s1 | s2 << 16 | 0;
};
var adler32_1 = adler32;
const makeTable = () => {
  let c, table = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c;
  }
  return table;
};
const crcTable = new Uint32Array(makeTable());
const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;
  crc ^= -1;
  for (let i = pos; i < end; i++) {
    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
  }
  return crc ^ -1;
};
var crc32_1 = crc32;
var messages = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
};
var constants$2 = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var assign = function(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) {
      continue;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be non-object");
    }
    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }
  return obj;
};
var flattenChunks = (chunks) => {
  let len = 0;
  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }
  const result = new Uint8Array(len);
  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
};
var common = {
  assign,
  flattenChunks
};
let STR_APPLY_UIA_OK = true;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__) {
  STR_APPLY_UIA_OK = false;
}
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
}
_utf8len[254] = _utf8len[254] = 1;
var string2buf = (str) => {
  if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }
  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
  }
  buf = new Uint8Array(buf_len);
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    if (c < 128) {
      buf[i++] = c;
    } else if (c < 2048) {
      buf[i++] = 192 | c >>> 6;
      buf[i++] = 128 | c & 63;
    } else if (c < 65536) {
      buf[i++] = 224 | c >>> 12;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    } else {
      buf[i++] = 240 | c >>> 18;
      buf[i++] = 128 | c >>> 12 & 63;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    }
  }
  return buf;
};
const buf2binstring = (buf, len) => {
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }
  let result = "";
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};
var buf2string = (buf, max) => {
  const len = max || buf.length;
  if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }
  let i, out;
  const utf16buf = new Array(len * 2);
  for (out = 0, i = 0; i < len; ) {
    let c = buf[i++];
    if (c < 128) {
      utf16buf[out++] = c;
      continue;
    }
    let c_len = _utf8len[c];
    if (c_len > 4) {
      utf16buf[out++] = 65533;
      i += c_len - 1;
      continue;
    }
    c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
    while (c_len > 1 && i < len) {
      c = c << 6 | buf[i++] & 63;
      c_len--;
    }
    if (c_len > 1) {
      utf16buf[out++] = 65533;
      continue;
    }
    if (c < 65536) {
      utf16buf[out++] = c;
    } else {
      c -= 65536;
      utf16buf[out++] = 55296 | c >> 10 & 1023;
      utf16buf[out++] = 56320 | c & 1023;
    }
  }
  return buf2binstring(utf16buf, out);
};
var utf8border = (buf, max) => {
  max = max || buf.length;
  if (max > buf.length) {
    max = buf.length;
  }
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 192) === 128) {
    pos--;
  }
  if (pos < 0) {
    return max;
  }
  if (pos === 0) {
    return max;
  }
  return pos + _utf8len[buf[pos]] > max ? pos : max;
};
var strings = {
  string2buf,
  buf2string,
  utf8border
};
function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = "";
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}
var zstream = ZStream;
const BAD$1 = 16209;
const TYPE$1 = 16191;
var inffast = function inflate_fast(strm, start) {
  let _in;
  let last;
  let _out;
  let beg;
  let end;
  let dmax;
  let wsize;
  let whave;
  let wnext;
  let s_window;
  let hold;
  let bits;
  let lcode;
  let dcode;
  let lmask;
  let dmask;
  let here;
  let op;
  let len;
  let dist;
  let from;
  let from_source;
  let input, output;
  const state = strm.state;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  dmax = state.dmax;
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;
  top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen:
        for (; ; ) {
          op = here >>> 24;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 255;
          if (op === 0) {
            output[_out++] = here & 65535;
          } else if (op & 16) {
            len = here & 65535;
            op &= 15;
            if (op) {
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
              len += hold & (1 << op) - 1;
              hold >>>= op;
              bits -= op;
            }
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = dcode[hold & dmask];
            dodist:
              for (; ; ) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (op & 16) {
                  dist = here & 65535;
                  op &= 15;
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                  }
                  dist += hold & (1 << op) - 1;
                  if (dist > dmax) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD$1;
                    break top;
                  }
                  hold >>>= op;
                  bits -= op;
                  op = _out - beg;
                  if (dist > op) {
                    op = dist - op;
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD$1;
                        break top;
                      }
                    }
                    from = 0;
                    from_source = s_window;
                    if (wnext === 0) {
                      from += wsize - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    } else if (wnext < op) {
                      from += wsize + wnext - op;
                      op -= wnext;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = 0;
                        if (wnext < len) {
                          op = wnext;
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                    } else {
                      from += wnext - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      len -= 3;
                    }
                    if (len) {
                      output[_out++] = from_source[from++];
                      if (len > 1) {
                        output[_out++] = from_source[from++];
                      }
                    }
                  } else {
                    from = _out - dist;
                    do {
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      len -= 3;
                    } while (len > 2);
                    if (len) {
                      output[_out++] = output[from++];
                      if (len > 1) {
                        output[_out++] = output[from++];
                      }
                    }
                  }
                } else if ((op & 64) === 0) {
                  here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                  continue dodist;
                } else {
                  strm.msg = "invalid distance code";
                  state.mode = BAD$1;
                  break top;
                }
                break;
              }
          } else if ((op & 64) === 0) {
            here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
            continue dolen;
          } else if (op & 32) {
            state.mode = TYPE$1;
            break top;
          } else {
            strm.msg = "invalid literal/length code";
            state.mode = BAD$1;
            break top;
          }
          break;
        }
    } while (_in < last && _out < end);
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
};
const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;
const lbase = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]);
const lext = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]);
const dbase = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]);
const dext = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]);
const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
  const bits = opts.bits;
  let len = 0;
  let sym = 0;
  let min = 0, max = 0;
  let root2 = 0;
  let curr = 0;
  let drop = 0;
  let left = 0;
  let used = 0;
  let huff = 0;
  let incr;
  let fill;
  let low;
  let mask;
  let next;
  let base = null;
  let match;
  const count = new Uint16Array(MAXBITS + 1);
  const offs = new Uint16Array(MAXBITS + 1);
  let extra = null;
  let here_bits, here_op, here_val;
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }
  root2 = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }
  if (root2 > max) {
    root2 = max;
  }
  if (max === 0) {
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    opts.bits = 1;
    return 0;
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }
  if (root2 < min) {
    root2 = min;
  }
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;
  }
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }
  if (type === CODES$1) {
    base = extra = work;
    match = 20;
  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;
  } else {
    base = dbase;
    extra = dext;
    match = 0;
  }
  huff = 0;
  sym = 0;
  len = min;
  next = table_index;
  curr = root2;
  drop = 0;
  low = -1;
  used = 1 << root2;
  mask = used - 1;
  if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
    return 1;
  }
  for (; ; ) {
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    } else {
      here_op = 32 + 64;
      here_val = 0;
    }
    incr = 1 << len - drop;
    fill = 1 << curr;
    min = fill;
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);
    incr = 1 << len - 1;
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }
    sym++;
    if (--count[len] === 0) {
      if (len === max) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }
    if (len > root2 && (huff & mask) !== low) {
      if (drop === 0) {
        drop = root2;
      }
      next += min;
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }
      used += 1 << curr;
      if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
        return 1;
      }
      low = huff & mask;
      table[low] = root2 << 24 | curr << 16 | next - table_index | 0;
    }
  }
  if (huff !== 0) {
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }
  opts.bits = root2;
  return 0;
};
var inftrees = inflate_table;
const CODES = 0;
const LENS = 1;
const DISTS = 2;
const {
  Z_FINISH: Z_FINISH$1,
  Z_BLOCK,
  Z_TREES,
  Z_OK: Z_OK$1,
  Z_STREAM_END: Z_STREAM_END$1,
  Z_NEED_DICT: Z_NEED_DICT$1,
  Z_STREAM_ERROR: Z_STREAM_ERROR$1,
  Z_DATA_ERROR: Z_DATA_ERROR$1,
  Z_MEM_ERROR: Z_MEM_ERROR$1,
  Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;
const HEAD = 16180;
const FLAGS = 16181;
const TIME = 16182;
const OS = 16183;
const EXLEN = 16184;
const EXTRA = 16185;
const NAME = 16186;
const COMMENT = 16187;
const HCRC = 16188;
const DICTID = 16189;
const DICT = 16190;
const TYPE = 16191;
const TYPEDO = 16192;
const STORED = 16193;
const COPY_ = 16194;
const COPY = 16195;
const TABLE = 16196;
const LENLENS = 16197;
const CODELENS = 16198;
const LEN_ = 16199;
const LEN = 16200;
const LENEXT = 16201;
const DIST = 16202;
const DISTEXT = 16203;
const MATCH = 16204;
const LIT = 16205;
const CHECK = 16206;
const LENGTH = 16207;
const DONE = 16208;
const BAD = 16209;
const MEM = 16210;
const SYNC = 16211;
const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
const MAX_WBITS = 15;
const DEF_WBITS = MAX_WBITS;
const zswap32 = (q) => {
  return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
};
function InflateState() {
  this.strm = null;
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;
  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;
  this.hold = 0;
  this.bits = 0;
  this.length = 0;
  this.offset = 0;
  this.extra = 0;
  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;
  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;
  this.lens = new Uint16Array(320);
  this.work = new Uint16Array(288);
  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}
const inflateStateCheck = (strm) => {
  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};
const inflateResetKeep = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = "";
  if (state.wrap) {
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null;
  state.hold = 0;
  state.bits = 0;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
  state.sane = 1;
  state.back = -1;
  return Z_OK$1;
};
const inflateReset = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
};
const inflateReset2 = (strm, windowBits) => {
  let wrap;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};
const inflateInit2 = (strm, windowBits) => {
  if (!strm) {
    return Z_STREAM_ERROR$1;
  }
  const state = new InflateState();
  strm.state = state;
  state.strm = strm;
  state.window = null;
  state.mode = HEAD;
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null;
  }
  return ret;
};
const inflateInit = (strm) => {
  return inflateInit2(strm, DEF_WBITS);
};
let virgin = true;
let lenfix, distfix;
const fixedtables = (state) => {
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);
    let sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }
    inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }
    inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
    virgin = false;
  }
  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};
const updatewindow = (strm, src, end, copy) => {
  let dist;
  const state = strm.state;
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
    state.window = new Uint8Array(state.wsize);
  }
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
};
const inflate$2 = (strm, flush) => {
  let state;
  let input, output;
  let next;
  let put;
  let have, left;
  let hold;
  let bits;
  let _in, _out;
  let copy;
  let from;
  let from_source;
  let here = 0;
  let here_bits, here_op, here_val;
  let last_bits, last_op, last_val;
  let len;
  let ret;
  const hbuf = new Uint8Array(4);
  let opts;
  let n;
  const order = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  }
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  _in = have;
  _out = left;
  ret = Z_OK$1;
  inf_leave:
    for (; ; ) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 2 && hold === 35615) {
            if (state.wbits === 0) {
              state.wbits = 15;
            }
            state.check = 0;
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            hold = 0;
            bits = 0;
            state.mode = FLAGS;
            break;
          }
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 255) << 8) + (hold >> 8)) % 31) {
            strm.msg = "incorrect header check";
            state.mode = BAD;
            break;
          }
          if ((hold & 15) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          hold >>>= 4;
          bits -= 4;
          len = (hold & 15) + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          if (len > 15 || len > state.wbits) {
            strm.msg = "invalid window size";
            state.mode = BAD;
            break;
          }
          state.dmax = 1 << state.wbits;
          state.flags = 0;
          strm.adler = state.check = 1;
          state.mode = hold & 512 ? DICTID : TYPE;
          hold = 0;
          bits = 0;
          break;
        case FLAGS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.flags = hold;
          if ((state.flags & 255) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          if (state.flags & 57344) {
            strm.msg = "unknown header flags set";
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = TIME;
        /* falls through */
        case TIME:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            hbuf[2] = hold >>> 16 & 255;
            hbuf[3] = hold >>> 24 & 255;
            state.check = crc32_1(state.check, hbuf, 4, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = OS;
        /* falls through */
        case OS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.xflags = hold & 255;
            state.head.os = hold >> 8;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = EXLEN;
        /* falls through */
        case EXLEN:
          if (state.flags & 1024) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
          } else if (state.head) {
            state.head.extra = null;
          }
          state.mode = EXTRA;
        /* falls through */
        case EXTRA:
          if (state.flags & 1024) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(
                  input.subarray(
                    next,
                    // extra field is limited to 65536 bytes
                    // - no need for additional size check
                    next + copy
                  ),
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
              }
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        /* falls through */
        case NAME:
          if (state.flags & 2048) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        /* falls through */
        case COMMENT:
          if (state.flags & 4096) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        /* falls through */
        case HCRC:
          if (state.flags & 512) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.check & 65535)) {
              strm.msg = "header crc mismatch";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          strm.adler = state.check = zswap32(hold);
          hold = 0;
          bits = 0;
          state.mode = DICT;
        /* falls through */
        case DICT:
          if (state.havedict === 0) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1;
          state.mode = TYPE;
        /* falls through */
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case TYPEDO:
          if (state.last) {
            hold >>>= bits & 7;
            bits -= bits & 7;
            state.mode = CHECK;
            break;
          }
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.last = hold & 1;
          hold >>>= 1;
          bits -= 1;
          switch (hold & 3) {
            case 0:
              state.mode = STORED;
              break;
            case 1:
              fixedtables(state);
              state.mode = LEN_;
              if (flush === Z_TREES) {
                hold >>>= 2;
                bits -= 2;
                break inf_leave;
              }
              break;
            case 2:
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = "invalid block type";
              state.mode = BAD;
          }
          hold >>>= 2;
          bits -= 2;
          break;
        case STORED:
          hold >>>= bits & 7;
          bits -= bits & 7;
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
            strm.msg = "invalid stored block lengths";
            state.mode = BAD;
            break;
          }
          state.length = hold & 65535;
          hold = 0;
          bits = 0;
          state.mode = COPY_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case COPY_:
          state.mode = COPY;
        /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            output.set(input.subarray(next, next + copy), put);
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          state.mode = TYPE;
          break;
        case TABLE:
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.nlen = (hold & 31) + 257;
          hold >>>= 5;
          bits -= 5;
          state.ndist = (hold & 31) + 1;
          hold >>>= 5;
          bits -= 5;
          state.ncode = (hold & 15) + 4;
          hold >>>= 4;
          bits -= 4;
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = "too many length or distance symbols";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = LENLENS;
        /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.lens[order[state.have++]] = hold & 7;
            hold >>>= 3;
            bits -= 3;
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = { bits: state.lenbits };
          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid code lengths set";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = CODELENS;
        /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_val < 16) {
              hold >>>= here_bits;
              bits -= here_bits;
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                if (state.have === 0) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 3);
                hold >>>= 2;
                bits -= 2;
              } else if (here_val === 17) {
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 3 + (hold & 7);
                hold >>>= 3;
                bits -= 3;
              } else {
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 11 + (hold & 127);
                hold >>>= 7;
                bits -= 7;
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = "invalid bit length repeat";
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
          if (state.mode === BAD) {
            break;
          }
          if (state.lens[256] === 0) {
            strm.msg = "invalid code -- missing end-of-block";
            state.mode = BAD;
            break;
          }
          state.lenbits = 9;
          opts = { bits: state.lenbits };
          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid literal/lengths set";
            state.mode = BAD;
            break;
          }
          state.distbits = 6;
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          state.distbits = opts.bits;
          if (ret) {
            strm.msg = "invalid distances set";
            state.mode = BAD;
            break;
          }
          state.mode = LEN_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case LEN_:
          state.mode = LEN;
        /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            inffast(strm, _out);
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (; ; ) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_op && (here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = "invalid literal/length code";
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        /* falls through */
        case LENEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          state.was = state.length;
          state.mode = DIST;
        /* falls through */
        case DIST:
          for (; ; ) {
            here = state.distcode[hold & (1 << state.distbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = "invalid distance code";
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        /* falls through */
        case DISTEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.offset += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          if (state.offset > state.dmax) {
            strm.msg = "invalid distance too far back";
            state.mode = BAD;
            break;
          }
          state.mode = MATCH;
        /* falls through */
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold |= input[next++] << bits;
              bits += 8;
            }
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (state.wrap & 4 && _out) {
              strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
              state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
            }
            _out = left;
            if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = "incorrect data check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = LENGTH;
        /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
              strm.msg = "incorrect length check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = DONE;
        /* falls through */
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
        /* falls through */
        default:
          return Z_STREAM_ERROR$1;
      }
    }
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap & 4 && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};
const inflateEnd = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};
const inflateGetHeader = (strm, head) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR$1;
  }
  state.head = head;
  head.done = false;
  return Z_OK$1;
};
const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;
  let state;
  let dictid;
  let ret;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }
  if (state.mode === DICT) {
    dictid = 1;
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  return Z_OK$1;
};
var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = "pako inflate (from Nodeca project)";
var inflate_1$2 = {
  inflateReset: inflateReset_1,
  inflateReset2: inflateReset2_1,
  inflateResetKeep: inflateResetKeep_1,
  inflateInit: inflateInit_1,
  inflateInit2: inflateInit2_1,
  inflate: inflate_2$1,
  inflateEnd: inflateEnd_1,
  inflateGetHeader: inflateGetHeader_1,
  inflateSetDictionary: inflateSetDictionary_1,
  inflateInfo
};
function GZheader() {
  this.text = 0;
  this.time = 0;
  this.xflags = 0;
  this.os = 0;
  this.extra = null;
  this.extra_len = 0;
  this.name = "";
  this.comment = "";
  this.hcrc = 0;
  this.done = false;
}
var gzheader = GZheader;
const toString = Object.prototype.toString;
const {
  Z_NO_FLUSH,
  Z_FINISH,
  Z_OK,
  Z_STREAM_END,
  Z_NEED_DICT,
  Z_STREAM_ERROR,
  Z_DATA_ERROR,
  Z_MEM_ERROR
} = constants$2;
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, options || {});
  const opt = this.options;
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );
  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }
  this.header = new gzheader();
  inflate_1$2.inflateGetHeader(this.strm, this.header);
  if (opt.dictionary) {
    if (typeof opt.dictionary === "string") {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) {
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}
Inflate$1.prototype.push = function(data2, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;
  if (this.ended) return false;
  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
  if (toString.call(data2) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data2);
  } else {
    strm.input = data2;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  for (; ; ) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = inflate_1$2.inflate(strm, _flush_mode);
    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);
      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        status = Z_NEED_DICT;
      }
    }
    while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data2[strm.next_in] !== 0) {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }
    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }
    last_avail_out = strm.avail_out;
    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {
        if (this.options.to === "string") {
          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
          this.onData(utf8str);
        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }
    if (status === Z_OK && last_avail_out === 0) continue;
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }
    if (strm.avail_in === 0) break;
  }
  return true;
};
Inflate$1.prototype.onData = function(chunk) {
  this.chunks.push(chunk);
};
Inflate$1.prototype.onEnd = function(status) {
  if (status === Z_OK) {
    if (this.options.to === "string") {
      this.result = this.chunks.join("");
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);
  inflator.push(input);
  if (inflator.err) throw inflator.msg || messages[inflator.err];
  return inflator.result;
}
var inflate_2 = inflate$1;
var inflate_1$1 = {
  inflate: inflate_2
};
const { inflate } = inflate_1$1;
var inflate_1 = inflate;
var root_1$2 = from_html(`<div><!></div>`);
var root$2 = from_html(`<div><!> <div></div> <!></div>`);
function List($$anchor, $$props) {
  const $$slots = sanitize_slots($$props);
  push($$props, false);
  const isVertical = mutable_source();
  const innerSize = mutable_source();
  const itemSizeInternal = mutable_source();
  const size = mutable_source();
  let itemCount = prop($$props, "itemCount", 8);
  let itemSize = prop($$props, "itemSize", 8);
  let height = prop($$props, "height", 8);
  let width = prop($$props, "width", 8, "100%");
  let overScan = prop($$props, "overScan", 8, 1);
  let marginLeft = prop($$props, "marginLeft", 8, 0);
  let marginTop = prop($$props, "marginTop", 8, 0);
  let layout = prop($$props, "layout", 8, "vertical");
  let scrollToIndex = prop($$props, "scrollToIndex", 28, () => void 0);
  let scrollToPosition = prop($$props, "scrollToPosition", 28, () => void 0);
  let scrollToBehavior = prop($$props, "scrollToBehavior", 8, "auto");
  let list = mutable_source();
  let scrollPosition = mutable_source(0);
  let headerHeight = mutable_source(0);
  let offsetHeight = mutable_source(0);
  let clientHeight = mutable_source(0);
  let offsetWidth = mutable_source(0);
  let clientWidth = mutable_source(0);
  let indexes = mutable_source([]);
  const scrollTo = {
    index: (index2) => {
      scrollToIndex(index2);
    },
    position: (position) => {
      scrollToPosition(position);
    }
  };
  const getIndexes = (itemCount2, itemSize2, size2, overScan2, scrollPosition2) => {
    const indexes2 = [];
    const startIndexTemp = ~~(scrollPosition2 / itemSize2);
    const startIndexOverScan = startIndexTemp > overScan2 ? startIndexTemp - overScan2 : 0;
    const startIndex = startIndexOverScan >= 0 ? startIndexOverScan : startIndexTemp;
    const endIndexTemp = Math.min(itemCount2, ~~((scrollPosition2 + size2) / itemSize2));
    const endIndexOverScan = endIndexTemp + overScan2;
    const endIndex = endIndexOverScan < itemCount2 ? endIndexOverScan : itemCount2;
    for (let i = 0; i < endIndex - startIndex; i++) indexes2.push(i + startIndex);
    return indexes2;
  };
  const getItemStyle = (index2) => {
    const ixis = index2 * itemSize();
    return `position: absolute; transform: translate3d(${get(isVertical) ? `${marginLeft()}px, ${ixis + marginTop()}px` : `${ixis + marginLeft()}px, ${marginTop()}px`}, 0px); ${get(itemSizeInternal)} will-change: transform;`;
  };
  const onScroll = ({ currentTarget }) => {
    if (scrollToIndex() === void 0 && scrollToPosition() === void 0) {
      if (get(isVertical)) {
        set(scrollPosition, Math.max(0, currentTarget.scrollTop - get(headerHeight)));
      } else {
        set(scrollPosition, currentTarget.scrollLeft);
      }
    }
  };
  legacy_pre_effect(() => deep_read_state(layout()), () => {
    set(isVertical, layout() === "vertical");
  });
  legacy_pre_effect(
    () => (get(list), deep_read_state(scrollToIndex()), get(isVertical), deep_read_state(itemSize()), get(headerHeight), deep_read_state(marginTop()), deep_read_state(marginLeft()), deep_read_state(scrollToBehavior())),
    () => {
      if (get(list) && scrollToIndex() !== void 0) {
        get(list).scrollTo({
          [get(isVertical) ? "top" : "left"]: scrollToIndex() * itemSize() + get(headerHeight) + (get(isVertical) ? marginTop() : marginLeft()),
          behavior: scrollToBehavior()
        });
        scrollToIndex(void 0);
      }
    }
  );
  legacy_pre_effect(
    () => (get(list), deep_read_state(scrollToPosition()), get(isVertical), get(headerHeight), deep_read_state(scrollToBehavior())),
    () => {
      if (get(list) && scrollToPosition() !== void 0) {
        get(list).scrollTo({
          [get(isVertical) ? "top" : "left"]: scrollToPosition() + get(headerHeight),
          behavior: scrollToBehavior()
        });
        scrollToPosition(void 0);
      }
    }
  );
  legacy_pre_effect(() => (get(isVertical), get(offsetHeight), get(offsetWidth)), () => {
    set(size, get(isVertical) ? get(offsetHeight) : get(offsetWidth));
  });
  legacy_pre_effect(
    () => (deep_read_state(itemCount()), deep_read_state(itemSize()), get(size)),
    () => {
      set(innerSize, Math.max(itemCount() * itemSize(), get(size)));
    }
  );
  legacy_pre_effect(
    () => (get(isVertical), deep_read_state(itemSize()), deep_read_state(marginLeft()), get(clientWidth), deep_read_state(marginTop()), get(clientHeight)),
    () => {
      set(itemSizeInternal, get(isVertical) ? `height: ${itemSize()}px; width: ${marginLeft() > 0 ? `${get(clientWidth) - marginLeft()}px` : "100%"};` : `height: ${marginTop() > 0 ? `${get(clientHeight) - marginTop()}px` : "100%"}; width: ${itemSize()}px;`);
    }
  );
  legacy_pre_effect(
    () => (get(offsetHeight), deep_read_state(itemCount()), deep_read_state(itemSize()), get(size), deep_read_state(overScan()), get(scrollPosition)),
    () => {
      if (get(offsetHeight)) {
        set(indexes, getIndexes(itemCount(), itemSize(), get(size), overScan(), get(scrollPosition)));
      }
    }
  );
  legacy_pre_effect_reset();
  var div = root$2();
  var node = child(div);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1$2();
      var node_1 = child(div_1);
      slot(node_1, $$props, "header", {}, null);
      bind_element_size(div_1, "offsetHeight", ($$value) => set(headerHeight, $$value));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (untrack(() => $$slots.header)) $$render(consequent);
    });
  }
  var div_2 = sibling(node, 2);
  each(div_2, 5, () => get(indexes), (index2) => index2, ($$anchor2, index2) => {
    var fragment = comment();
    const style = derived_safe_equal(() => (get(index2), untrack(() => getItemStyle(get(index2)))));
    var node_2 = first_child(fragment);
    slot(
      node_2,
      $$props,
      "item",
      {
        get index() {
          return get(index2);
        },
        get scrollPosition() {
          return get(scrollPosition);
        },
        get style() {
          return get(style);
        }
      },
      ($$anchor3) => {
        var text$1 = text("Missing template");
        append($$anchor3, text$1);
      }
    );
    append($$anchor2, fragment);
  });
  var node_3 = sibling(div_2, 2);
  slot(node_3, $$props, "footer", {}, null);
  bind_this(div, ($$value) => set(list, $$value), () => get(list));
  template_effect(() => {
    set_style(div, `position: relative; overflow: auto; height: ${height() ?? ""}px; width: ${width() ?? ""};`);
    set_style(div_2, `height: ${get(isVertical) ? `${get(innerSize)}px` : "100%"}; width: ${!get(isVertical) ? `${get(innerSize)}px` : "100%"};`);
  });
  event("scroll", div, onScroll);
  bind_element_size(div, "offsetHeight", ($$value) => set(offsetHeight, $$value));
  bind_element_size(div, "clientHeight", ($$value) => set(clientHeight, $$value));
  bind_element_size(div, "offsetWidth", ($$value) => set(offsetWidth, $$value));
  bind_element_size(div, "clientWidth", ($$value) => set(clientWidth, $$value));
  append($$anchor, div);
  bind_prop($$props, "scrollTo", scrollTo);
  return pop({ scrollTo });
}
var root_1$1 = from_html(`<div class="address-hover-inline svelte-gry24c"><button class="close-hover svelte-gry24c" aria-label="Close address info">×</button> <div class="full-address svelte-gry24c"> </div> <div class="principal svelte-gry24c"> </div> <div class="pool-id svelte-gry24c"> </div> </div>`);
var root_2 = from_html(`<div class="header-cell stake-header-cell svelte-gry24c"><div class="stake-header svelte-gry24c"><div class="address-container svelte-gry24c"><span class="address svelte-gry24c" role="button" tabindex="0"> <button class="copy-btn svelte-gry24c" title="Copy full address">📋</button></span></div></div></div>`);
var root_7 = from_html(`<div class="pre-active-indicator svelte-gry24c">pre-active</div>`);
var root_10 = from_html(`<span class="principal-change-tooltip svelte-gry24c"><span class="principal-change-icon svelte-gry24c">❗</span> <span class="principal-tooltip-text svelte-gry24c"> </span></span>`);
var root_9 = from_html(`<div class="stake-cell-content svelte-gry24c"><span class="stake-value svelte-gry24c"> </span> <!> <div class="stake-popup svelte-gry24c"><div> </div> <div> </div></div></div>`);
var root_11 = from_html(`<div class="inactive-indicator svelte-gry24c">-</div>`);
var root_4 = from_html(`<div class="table-cell stake-cell svelte-gry24c"><div class="stake-popup-container svelte-gry24c"><!></div></div>`);
var root_3 = from_html(`<div slot="item" class="table-row svelte-gry24c"><div class="data-row svelte-gry24c"><div class="table-cell epoch-cell svelte-gry24c"> </div> <div class="table-cell rewards-cell svelte-gry24c"> </div> <div class="table-cell rewards-cell svelte-gry24c"> </div> <!></div></div>`);
var root$1 = from_html(
  `<!> <div style="float: left">Data might be incomplete. Values are estimates due to rounding. Epochs before the first
    transaction are hidden.</div> <br/> <div style="float: left">Transfer history is currently not taken into account, values are computed like the objects were
    always owned by the provided address.</div> <br/> <div class="table-container svelte-gry24c"><div class="virtual-table svelte-gry24c"><div class="table-header svelte-gry24c"><div class="header-row svelte-gry24c"><div class="header-cell epoch-header svelte-gry24c">Epoch</div> <div class="header-cell rewards-header svelte-gry24c">Rewards</div> <div class="header-cell rewards-header svelte-gry24c">Accumulated</div> <!></div></div> <div class="table-body svelte-gry24c"><!></div></div></div>`,
  1
);
function StakingRewardsTable($$anchor, $$props) {
  push($$props, false);
  let currentEpoch = prop($$props, "currentEpoch", 8, 91);
  let stakeObjects = prop($$props, "stakeObjects", 24, () => []);
  function copyToClipboard(text2) {
    navigator.clipboard.writeText(text2);
  }
  let minEpoch = mutable_source(0);
  let epochs = mutable_source([]);
  function isActiveInEpoch(stakeObject, epoch) {
    return epoch >= stakeObject.firstEpoch && epoch <= stakeObject.lastEpoch;
  }
  function isPreActivationInEpoch(stakeObject, epoch) {
    return epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
  }
  function getTotalRewardsForEpoch(epoch) {
    let total = 0n;
    stakeObjects().forEach((stakeObject) => {
      const rewards = stakeObject.rewardsByEpoch[epoch];
      if (rewards && rewards !== "0") {
        try {
          total += BigInt(rewards);
        } catch (e) {
        }
      }
    });
    return total === 0n ? "0" : (Number(total) / 1e9).toFixed(2) + " IOTA";
  }
  function getTotalAccumulatedRewardsForEpoch(epoch) {
    let total = 0n;
    stakeObjects().forEach((stakeObject) => {
      const rewards = stakeObject.accumulatedRewards[epoch];
      if (rewards && rewards !== "0") {
        try {
          total += BigInt(rewards);
        } catch (e) {
        }
      }
    });
    return total === 0n ? "0" : (Number(total) / 1e9).toFixed(2) + " IOTA";
  }
  function formatPrincipal(principal) {
    if (!principal || principal === "0") return "N/A";
    try {
      const value = BigInt(principal);
      return "Initial amount: " + (Number(value) / 1e9).toFixed(2) + " IOTA";
    } catch {
      return "N/A";
    }
  }
  function getFirstPrincipal(stakeObject) {
    const epochs2 = Object.keys(stakeObject.principalByEpoch).map(Number);
    if (epochs2.length === 0) return "";
    const minEpoch2 = Math.min(...epochs2);
    return stakeObject.principalByEpoch[minEpoch2];
  }
  let headerElement = mutable_source();
  let listElement = mutable_source();
  function syncHeaderScroll(event2) {
    var _a, _b, _c, _d;
    const target = event2.target;
    let scrollContainer = null;
    if (get(listElement)) {
      scrollContainer = ((_b = (_a = get(listElement)).querySelector) == null ? void 0 : _b.call(_a, "[data-virtual-list-viewport]")) || ((_d = (_c = get(listElement)).querySelector) == null ? void 0 : _d.call(_c, '[style*="overflow"]'));
    }
    if (scrollContainer && scrollContainer.scrollLeft !== target.scrollLeft) {
      scrollContainer.scrollLeft = target.scrollLeft;
    }
  }
  function syncListScroll(event2) {
    const target = event2.target;
    if (get(headerElement) && get(headerElement).scrollLeft !== target.scrollLeft) {
      mutate(headerElement, get(headerElement).scrollLeft = target.scrollLeft);
    }
  }
  function setupScrollSync(node) {
    const findScrollContainer = () => {
      return node.querySelector('[style*="overflow"]') || node.querySelector("[data-virtual-list-viewport]");
    };
    let scrollContainer = null;
    const timeout = setTimeout(
      () => {
        scrollContainer = findScrollContainer();
        if (scrollContainer) {
          scrollContainer.addEventListener("scroll", syncListScroll);
        }
      },
      100
    );
    return {
      destroy() {
        clearTimeout(timeout);
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", syncListScroll);
        }
      }
    };
  }
  let selectedStakeObject = mutable_source(null);
  legacy_pre_effect(() => deep_read_state(stakeObjects()), () => {
    set(minEpoch, (() => {
      if (stakeObjects().length === 0) return 0;
      let min = Infinity;
      stakeObjects().forEach((stakeObject) => {
        if (stakeObject.firstEpoch < min) min = stakeObject.firstEpoch;
      });
      return min === Infinity ? 0 : min;
    })());
  });
  legacy_pre_effect(() => (deep_read_state(currentEpoch()), get(minEpoch)), () => {
    set(epochs, Array.from({ length: currentEpoch() + 1 }, (_, i) => i).slice(get(minEpoch)));
  });
  legacy_pre_effect_reset();
  init();
  var fragment = root$1();
  var node_1 = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root_1$1();
      var button = child(div);
      var div_1 = sibling(button, 2);
      var text_1 = child(div_1);
      var div_2 = sibling(div_1, 2);
      var text_2 = child(div_2);
      var div_3 = sibling(div_2, 2);
      var text_3 = child(div_3);
      var text_4 = sibling(div_3);
      template_effect(
        ($0) => {
          set_text(text_1, (get(selectedStakeObject), untrack(() => get(selectedStakeObject).address)));
          set_text(text_2, $0);
          set_text(text_3, `Pool: ${(get(selectedStakeObject), untrack(() => get(selectedStakeObject).poolId)) ?? ""}`);
          set_text(text_4, ` First Epoch: ${(get(selectedStakeObject), untrack(() => get(selectedStakeObject).firstEpoch)) ?? ""}
        Last Epoch: ${(get(selectedStakeObject), untrack(() => get(selectedStakeObject).lastEpoch)) ?? ""}`);
        },
        [
          () => (get(selectedStakeObject), untrack(() => formatPrincipal(getFirstPrincipal(get(selectedStakeObject)))))
        ]
      );
      event("click", button, () => set(selectedStakeObject, null));
      append($$anchor2, div);
    };
    if_block(node_1, ($$render) => {
      if (get(selectedStakeObject)) $$render(consequent);
    });
  }
  var div_4 = sibling(node_1, 10);
  var div_5 = child(div_4);
  var div_6 = child(div_5);
  var div_7 = child(div_6);
  var node_2 = sibling(child(div_7), 6);
  each(node_2, 1, stakeObjects, index, ($$anchor2, stakeObject) => {
    var div_8 = root_2();
    var div_9 = child(div_8);
    var div_10 = child(div_9);
    var span = child(div_10);
    var text_5 = child(span);
    var button_1 = sibling(text_5);
    template_effect(($0, $1) => set_text(text_5, `${$0 ?? ""}..${$1 ?? ""} `), [
      () => (get(stakeObject), untrack(() => get(stakeObject).address.slice(0, 6))),
      () => (get(stakeObject), untrack(() => get(stakeObject).address.slice(-3)))
    ]);
    event("click", button_1, (e) => {
      e.stopPropagation();
      copyToClipboard(get(stakeObject).address);
    });
    event("click", span, () => {
      set(selectedStakeObject, get(stakeObject));
    });
    event("keydown", span, (e) => {
      if (e.key === "Enter" || e.key === " ") {
        set(selectedStakeObject, get(stakeObject));
      }
    });
    append($$anchor2, div_8);
  });
  bind_this(div_6, ($$value) => set(headerElement, $$value), () => get(headerElement));
  var div_11 = sibling(div_6, 2);
  var node_3 = child(div_11);
  bind_this(
    List(node_3, {
      get itemCount() {
        return get(epochs), untrack(() => get(epochs).length);
      },
      itemSize: 50,
      height: 800,
      $$slots: {
        item: ($$anchor2, $$slotProps) => {
          var div_12 = root_3();
          const index$1 = derived_safe_equal(() => $$slotProps.index);
          const style = derived_safe_equal(() => $$slotProps.style);
          var div_13 = child(div_12);
          var div_14 = child(div_13);
          var text_6 = child(div_14);
          var div_15 = sibling(div_14, 2);
          var text_7 = child(div_15);
          var div_16 = sibling(div_15, 2);
          var text_8 = child(div_16);
          var node_4 = sibling(div_16, 2);
          each(node_4, 1, stakeObjects, index, ($$anchor3, stakeObject) => {
            var div_17 = root_4();
            var div_18 = child(div_17);
            var node_5 = child(div_18);
            {
              var consequent_1 = ($$anchor4) => {
                var text_9 = text("pending");
                append($$anchor4, text_9);
              };
              var alternate_2 = ($$anchor4) => {
                var fragment_1 = comment();
                var node_6 = first_child(fragment_1);
                {
                  var consequent_2 = ($$anchor5) => {
                    var div_19 = root_7();
                    append($$anchor5, div_19);
                  };
                  var alternate_1 = ($$anchor5) => {
                    var fragment_2 = comment();
                    var node_7 = first_child(fragment_2);
                    {
                      var consequent_4 = ($$anchor6) => {
                        var div_20 = root_9();
                        var span_1 = child(div_20);
                        var text_10 = child(span_1);
                        var node_8 = sibling(span_1, 2);
                        {
                          var consequent_3 = ($$anchor7) => {
                            var span_2 = root_10();
                            var span_3 = sibling(child(span_2), 2);
                            var text_11 = child(span_3);
                            template_effect(
                              ($0, $1) => set_text(text_11, `Principal amount changed from
                                                        ${$0 ?? ""} IOTA to
                                                        ${$1 ?? ""} IOTA`),
                              [
                                () => (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => (Number(get(stakeObject).principalByEpoch[get(epochs)[get(index$1) - 1]]) / 1e9).toFixed(2))),
                                () => (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => (Number(get(stakeObject).principalByEpoch[get(epochs)[get(index$1)]]) / 1e9).toFixed(2)))
                              ]
                            );
                            append($$anchor7, span_2);
                          };
                          if_block(node_8, ($$render) => {
                            if (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => get(stakeObject).principalByEpoch[get(epochs)[get(index$1)]] && get(stakeObject).principalByEpoch[get(epochs)[get(index$1) - 1]] && get(stakeObject).principalByEpoch[get(epochs)[get(index$1)]] !== get(stakeObject).principalByEpoch[get(epochs)[get(index$1) - 1]])) $$render(consequent_3);
                          });
                        }
                        var div_21 = sibling(node_8, 2);
                        var div_22 = child(div_21);
                        var text_12 = child(div_22);
                        var div_23 = sibling(div_22, 2);
                        var text_13 = child(div_23);
                        template_effect(
                          ($0, $1, $2) => {
                            set_text(text_10, $0);
                            set_text(text_12, `Rewards this epoch: ${$1 ?? ""} IOTA`);
                            set_text(text_13, `Accumulated rewards: ${$2 ?? ""} IOTA`);
                          },
                          [
                            () => (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => get(stakeObject).rewardsByEpoch[get(epochs)[get(index$1)]] === "0" ? "-" : (Number(get(stakeObject).rewardsByEpoch[get(epochs)[get(index$1)]]) / 1e9).toFixed(2) + " IOTA")),
                            () => (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => (Number(get(stakeObject).rewardsByEpoch[get(epochs)[get(index$1)]]) / 1e9).toFixed(9))),
                            () => (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => (Number(get(stakeObject).accumulatedRewards[get(epochs)[get(index$1)]]) / 1e9).toFixed(9)))
                          ]
                        );
                        append($$anchor6, div_20);
                      };
                      var alternate = ($$anchor6) => {
                        var div_24 = root_11();
                        append($$anchor6, div_24);
                      };
                      if_block(
                        node_7,
                        ($$render) => {
                          if (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => isActiveInEpoch(get(stakeObject), get(epochs)[get(index$1)]) && get(epochs)[get(index$1)] >= get(stakeObject).firstEpoch)) $$render(consequent_4);
                          else $$render(alternate, false);
                        },
                        true
                      );
                    }
                    append($$anchor5, fragment_2);
                  };
                  if_block(
                    node_6,
                    ($$render) => {
                      if (get(stakeObject), get(epochs), deep_read_state(get(index$1)), untrack(() => isPreActivationInEpoch(get(stakeObject), get(epochs)[get(index$1)]))) $$render(consequent_2);
                      else $$render(alternate_1, false);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_1);
              };
              if_block(node_5, ($$render) => {
                if (get(epochs), deep_read_state(get(index$1)), deep_read_state(currentEpoch()), untrack(() => get(epochs)[get(index$1)] === currentEpoch())) $$render(consequent_1);
                else $$render(alternate_2, false);
              });
            }
            append($$anchor3, div_17);
          });
          template_effect(
            ($0, $1) => {
              set_style(div_12, get(style));
              set_text(text_6, (get(epochs), deep_read_state(get(index$1)), untrack(() => get(epochs)[get(index$1)])));
              set_text(text_7, $0);
              set_text(text_8, $1);
            },
            [
              () => (get(epochs), deep_read_state(get(index$1)), deep_read_state(currentEpoch()), untrack(() => get(epochs)[get(index$1)] === currentEpoch() ? "pending" : getTotalRewardsForEpoch(get(epochs)[get(index$1)]))),
              () => (get(epochs), deep_read_state(get(index$1)), deep_read_state(currentEpoch()), untrack(() => get(epochs)[get(index$1)] === currentEpoch() ? "pending" : getTotalAccumulatedRewardsForEpoch(get(epochs)[get(index$1)])))
            ]
          );
          append($$anchor2, div_12);
        }
      },
      $$legacy: true
    }),
    ($$value) => set(listElement, $$value),
    () => get(listElement)
  );
  action(div_11, ($$node) => setupScrollSync == null ? void 0 : setupScrollSync($$node));
  event("scroll", div_6, syncHeaderScroll);
  append($$anchor, fragment);
  pop();
}
const data = "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";
const exchangeRateCacheRaw = {
  data
};
async function fetchStakeTransactionsByRole(address, role) {
  var _a, _b, _c;
  const gqlClient = new IotaGraphQLClient({
    url: getSelectedNetworkConfig().graphql
  });
  let allNodes = [];
  let cursorSection = "";
  let hasNextPage = true;
  let endCursor = "";
  while (hasNextPage) {
    console.log(`Fetching transactions for address: ${address}, role: ${role}, cursor: ${endCursor}`);
    const query = `
            query ($address: IotaAddress) {
                transactionBlocks(
                    filter: {
                        ${role}: $address
                    }
                    ${cursorSection}
                ) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        digest
                        effects {
                            epoch {
                                epochId
                            }
                            objectChanges {
                                nodes {
                                    idDeleted
                                    idCreated
                                    address
                                    inputState {
                                        asMoveObject {
                                            owner {
                                                ... on AddressOwner {
                                                    owner {
                                                        ... on IOwner {
                                                            address
                                                        }
                                                    }
                                                }
                                            }
                                            contents {
                                                type {
                                                    repr
                                                }
                                                json
                                            }
                                        }
                                    }
                                    outputState {
                                        asMoveObject {
                                            owner {
                                                ... on AddressOwner {
                                                    owner {
                                                        ... on IOwner {
                                                            address
                                                        }
                                                    }
                                                }
                                            }
                                            contents {
                                                type {
                                                    repr
                                                }
                                                json
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;
    const variables = { address };
    const result = await gqlClient.query({ query, variables });
    const txBlocks = (_a = result.data) == null ? void 0 : _a.transactionBlocks;
    if (txBlocks == null ? void 0 : txBlocks.nodes) {
      allNodes.push(...txBlocks.nodes);
    }
    hasNextPage = (_b = txBlocks == null ? void 0 : txBlocks.pageInfo) == null ? void 0 : _b.hasNextPage;
    endCursor = (_c = txBlocks == null ? void 0 : txBlocks.pageInfo) == null ? void 0 : _c.endCursor;
    if (hasNextPage && endCursor) {
      cursorSection = `after: "${endCursor}"`;
    } else {
      break;
    }
  }
  const stakeTypes = [
    "0x0000000000000000000000000000000000000000000000000000000000000003::staking_pool::StakedIota",
    "0x0000000000000000000000000000000000000000000000000000000000000003::timelocked_staking::TimelockedStakedIota"
  ];
  const filteredNodes = allNodes.map((tx) => {
    var _a2, _b2, _c2;
    const objectNodes = ((_b2 = (_a2 = tx.effects) == null ? void 0 : _a2.objectChanges) == null ? void 0 : _b2.nodes) || [];
    const stakeObjects = objectNodes.filter((obj) => {
      var _a3, _b3, _c3, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      const inputType = (_d = (_c3 = (_b3 = (_a3 = obj.inputState) == null ? void 0 : _a3.asMoveObject) == null ? void 0 : _b3.contents) == null ? void 0 : _c3.type) == null ? void 0 : _d.repr;
      const outputType = (_h = (_g = (_f = (_e = obj.outputState) == null ? void 0 : _e.asMoveObject) == null ? void 0 : _f.contents) == null ? void 0 : _g.type) == null ? void 0 : _h.repr;
      const isStakeType = stakeTypes.includes(inputType) || stakeTypes.includes(outputType);
      if (!isStakeType) return false;
      const inputOwner = (_l = (_k = (_j = (_i = obj.inputState) == null ? void 0 : _i.asMoveObject) == null ? void 0 : _j.owner) == null ? void 0 : _k.owner) == null ? void 0 : _l.address;
      const outputOwner = (_p = (_o = (_n = (_m = obj.outputState) == null ? void 0 : _m.asMoveObject) == null ? void 0 : _n.owner) == null ? void 0 : _o.owner) == null ? void 0 : _p.address;
      return inputOwner === address || outputOwner === address;
    });
    if (stakeObjects.length > 0) {
      return {
        ...tx,
        effects: {
          ...tx.effects,
          objectChanges: {
            ...(_c2 = tx.effects) == null ? void 0 : _c2.objectChanges,
            nodes: stakeObjects
          }
        }
      };
    }
    return null;
  }).filter((tx) => tx !== null);
  console.log(`Filtered transactions count: ${filteredNodes.length}`);
  return filteredNodes;
}
async function fetchStakeTransactions(address) {
  return fetchStakeTransactionsByRole(address, "signAddress");
}
async function fetchReceivedStakeTransactions(address) {
  return fetchStakeTransactionsByRole(address, "recvAddress");
}
async function fetchSystemState() {
  var _a, _b, _c;
  const gqlClient = new IotaGraphQLClient({
    url: getSelectedNetworkConfig().graphql
  });
  const query = `{
        owner(address: "0x5") {
            dynamicFields {
                nodes {
                    value {
                        ... on MoveValue {
                            type {
                                repr
                            }
                            json
                        }
                    }
                }
            }
        }
    }`;
  const result = await gqlClient.query({ query });
  const nodes = ((_c = (_b = (_a = result.data) == null ? void 0 : _a.owner) == null ? void 0 : _b.dynamicFields) == null ? void 0 : _c.nodes) || [];
  return nodes.map((node) => node.value);
}
async function fetchPoolExchangeRates(exchangeRatesId, epoch, poolId, createOneToOneCache = false) {
  var _a, _b, _c, _d;
  epoch += 1;
  if (poolId && exchangeRateCache.has(poolId)) {
    const cached = exchangeRateCache.get(poolId);
    if (cached.epochData[epoch]) {
      const cachedData = cached.epochData[epoch];
      return {
        iota_amount: cachedData.iota,
        pool_token_amount: cachedData.pool
      };
    }
  }
  console.log(`Fetching exchange rates for poolId ${poolId}, epoch ${epoch}, exchangeRatesId ${exchangeRatesId}`);
  const gqlClient = new IotaGraphQLClient({
    url: getSelectedNetworkConfig().graphql
  });
  const epochBcs = toB64(bcs.u64().serialize(epoch).toBytes());
  const query = `query getDynamicFieldObject($parentId: IotaAddress!, $epochBcs: Base64!) {
      owner(address: $parentId) {
        address
        dynamicField(name: {type: "u64", bcs: $epochBcs}) {
          value {
            ... on MoveValue {
              json
            }
          }
        }
      }
    }`;
  const variables = { parentId: exchangeRatesId, epochBcs };
  const result = await gqlClient.query({ query, variables });
  let data2 = (_d = (_c = (_b = (_a = result.data) == null ? void 0 : _a.owner) == null ? void 0 : _b.dynamicField) == null ? void 0 : _c.value) == null ? void 0 : _d.json;
  if (!data2 && createOneToOneCache) {
    console.log(`No exchange rate data found for pool ${poolId}, epoch ${epoch}. Using 1:1 ratio.`);
    data2 = {
      iota_amount: "1",
      pool_token_amount: "1"
    };
  }
  if (data2 && poolId) {
    let cacheEntry = exchangeRateCache.get(poolId);
    if (!cacheEntry) {
      cacheEntry = {
        poolId,
        exchangeRateId: exchangeRatesId,
        epochData: {}
      };
      exchangeRateCache.set(poolId, cacheEntry);
    }
    cacheEntry.epochData[epoch] = {
      iota: data2.iota_amount,
      pool: data2.pool_token_amount
    };
    console.log(`Cached exchange rates for pool ${poolId}, epoch ${epoch}`);
  }
  return data2;
}
const exchangeRateCache = /* @__PURE__ */ new Map();
function setInitialExchangeRateCache(cacheData) {
  exchangeRateCache.clear();
  if (!cacheData || !Array.isArray(cacheData)) {
    console.log("No cache data provided or invalid format");
    return;
  }
  cacheData.forEach((entry) => {
    if (entry && entry.poolId && entry.epochData) {
      exchangeRateCache.set(entry.poolId, entry);
    } else {
      console.warn("Skipping invalid cache entry:", entry);
    }
  });
  const totalEpochs = cacheData.reduce((sum, entry) => {
    if (entry && entry.epochData && typeof entry.epochData === "object") {
      return sum + Object.keys(entry.epochData).length;
    }
    return sum;
  }, 0);
  console.log(`Loaded ${cacheData.length} pools with ${totalEpochs} total epoch entries into cache`);
}
function getExchangeRateCacheStats() {
  const stats = {
    totalEntries: exchangeRateCache.size,
    poolIds: /* @__PURE__ */ new Set(),
    epochs: /* @__PURE__ */ new Set(),
    exchangeRateIds: /* @__PURE__ */ new Set()
  };
  exchangeRateCache.forEach((entry) => {
    stats.poolIds.add(entry.poolId);
    stats.exchangeRateIds.add(entry.exchangeRateId);
    Object.keys(entry.epochData).forEach((epochStr) => {
      stats.epochs.add(parseInt(epochStr));
    });
  });
  return {
    totalEntries: stats.totalEntries,
    uniquePoolIds: stats.poolIds.size,
    uniqueEpochs: stats.epochs.size,
    uniqueExchangeRateIds: stats.exchangeRateIds.size,
    epochRange: stats.epochs.size > 0 ? {
      min: Math.min(...stats.epochs),
      max: Math.max(...stats.epochs)
    } : null
  };
}
function getIotaAmount(exchangeRate, tokenAmount) {
  const iotaAmount = "iota" in exchangeRate ? BigInt(exchangeRate.iota) : BigInt(exchangeRate.iota_amount);
  const poolTokenAmount = "pool" in exchangeRate ? BigInt(exchangeRate.pool) : BigInt(exchangeRate.pool_token_amount);
  if (iotaAmount === 0n || poolTokenAmount === 0n) {
    return tokenAmount;
  }
  return iotaAmount * tokenAmount / poolTokenAmount;
}
function getTokenAmount(exchangeRate, iotaAmount) {
  const iotaAmountBig = "iota" in exchangeRate ? BigInt(exchangeRate.iota) : BigInt(exchangeRate.iota_amount);
  const poolTokenAmount = "pool" in exchangeRate ? BigInt(exchangeRate.pool) : BigInt(exchangeRate.pool_token_amount);
  if (iotaAmountBig === 0n || poolTokenAmount === 0n) {
    return iotaAmount;
  }
  return poolTokenAmount * iotaAmount / iotaAmountBig;
}
async function computeRewardsForStakeObject(stakeObject, exchangeRateId) {
  const principalAmount = BigInt(Object.values(stakeObject.principalByEpoch)[0] || "0");
  const epochs = Object.keys(stakeObject.exchangeRatesByEpoch).map(Number).sort((a, b) => a - b);
  let previousAccumulatedRewards = 0n;
  for (const epoch of epochs) {
    const exchangeRate = stakeObject.exchangeRatesByEpoch[epoch];
    try {
      let preStakingEpoch = stakeObject.stakeActivationEpoch - 1;
      let preStakingEpochExchangeRate = stakeObject.exchangeRatesByEpoch[preStakingEpoch];
      if (!preStakingEpochExchangeRate) {
        try {
          const fetchedRate = await fetchPoolExchangeRates(exchangeRateId, preStakingEpoch, stakeObject.poolId, true);
          if (fetchedRate) {
            preStakingEpochExchangeRate = fetchedRate;
            stakeObject.exchangeRatesByEpoch[preStakingEpoch] = fetchedRate;
          } else {
            preStakingEpochExchangeRate = {
              iota_amount: "1",
              pool_token_amount: "1"
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch exchange rate for pre staking epoch ${preStakingEpoch}, using 1:1 ratio`);
          preStakingEpochExchangeRate = {
            iota_amount: "1",
            pool_token_amount: "1"
          };
        }
      }
      const poolTokenWithdrawAmount = getTokenAmount(preStakingEpochExchangeRate, principalAmount);
      const totalIotaWithdrawAmount = getIotaAmount(exchangeRate, poolTokenWithdrawAmount);
      const currentAccumulatedRewards = totalIotaWithdrawAmount > principalAmount ? totalIotaWithdrawAmount - principalAmount : 0n;
      const newEpochRewards = currentAccumulatedRewards > previousAccumulatedRewards ? currentAccumulatedRewards - previousAccumulatedRewards : 0n;
      stakeObject.accumulatedRewards[epoch] = currentAccumulatedRewards.toString();
      stakeObject.rewardsByEpoch[epoch] = newEpochRewards.toString();
      previousAccumulatedRewards = currentAccumulatedRewards;
    } catch (err) {
      console.error(`Error computing rewards for epoch ${epoch}:`, err);
      stakeObject.accumulatedRewards[epoch] = previousAccumulatedRewards.toString();
      stakeObject.rewardsByEpoch[epoch] = "0";
    }
  }
}
function getCurrentActiveValidatorsExchangeRateIds(systemState) {
  var _a, _b, _c, _d, _e;
  const validatorMap = {};
  const activeValidators = ((_b = (_a = systemState == null ? void 0 : systemState.json) == null ? void 0 : _a.validators) == null ? void 0 : _b.active_validators) || [];
  for (const validator of activeValidators) {
    const poolId = (_c = validator == null ? void 0 : validator.staking_pool) == null ? void 0 : _c.id;
    const exchangeRateId = (_e = (_d = validator == null ? void 0 : validator.staking_pool) == null ? void 0 : _d.exchange_rates) == null ? void 0 : _e.id;
    if (poolId && exchangeRateId) {
      validatorMap[poolId] = exchangeRateId;
    }
  }
  return validatorMap;
}
async function processStakeTransactionsWithExchangeRates(transactions, currentEpoch) {
  const systemState = (await fetchSystemState())[0];
  const validatorMap = getCurrentActiveValidatorsExchangeRateIds(systemState);
  const stakeObjects = /* @__PURE__ */ new Map();
  transactions.forEach((transactionSet) => {
    if (!Array.isArray(transactionSet)) return;
    transactionSet.forEach((transaction) => {
      const epochId = transaction.effects.epoch.epochId;
      transaction.effects.objectChanges.nodes.forEach((node) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        const address = node.address;
        const outputState = (_b = (_a = node.outputState) == null ? void 0 : _a.asMoveObject) == null ? void 0 : _b.contents;
        const inputState = (_d = (_c = node.inputState) == null ? void 0 : _c.asMoveObject) == null ? void 0 : _d.contents;
        let poolId = void 0;
        let principal = void 0;
        let stakeActivationEpoch = void 0;
        if ((_f = (_e = outputState == null ? void 0 : outputState.type) == null ? void 0 : _e.repr) == null ? void 0 : _f.includes("timelocked_staking::TimelockedStakedIota")) {
          const stakedIota = (_g = outputState.json) == null ? void 0 : _g.staked_iota;
          poolId = (stakedIota == null ? void 0 : stakedIota.pool_id) ?? "";
          principal = ((_h = stakedIota == null ? void 0 : stakedIota.principal) == null ? void 0 : _h.value) ?? "";
          stakeActivationEpoch = (stakedIota == null ? void 0 : stakedIota.stake_activation_epoch) ?? "";
        } else if ((_j = (_i = outputState == null ? void 0 : outputState.type) == null ? void 0 : _i.repr) == null ? void 0 : _j.includes("staking_pool::StakedIota")) {
          poolId = ((_k = outputState.json) == null ? void 0 : _k.pool_id) ?? "";
          principal = ((_m = (_l = outputState.json) == null ? void 0 : _l.principal) == null ? void 0 : _m.value) ?? "";
          stakeActivationEpoch = ((_n = outputState.json) == null ? void 0 : _n.stake_activation_epoch) ?? "";
        }
        if (poolId && principal && stakeActivationEpoch) {
          if (!stakeObjects.has(address)) {
            stakeObjects.set(address, {
              address,
              poolId,
              principalByEpoch: {},
              exchangeRatesByEpoch: {},
              rewardsByEpoch: {},
              accumulatedRewards: {},
              firstEpoch: epochId,
              lastEpoch: currentEpoch,
              stakeActivationEpoch: parseInt(stakeActivationEpoch)
            });
          }
          const obj = stakeObjects.get(address);
          obj.principalByEpoch[epochId] = principal;
          obj.rewardsByEpoch[epochId] = "0";
          obj.accumulatedRewards[epochId] = "0";
        }
        let inputPoolId = "";
        let inputPrincipal = "";
        if ((_p = (_o = inputState == null ? void 0 : inputState.type) == null ? void 0 : _o.repr) == null ? void 0 : _p.includes("timelocked_staking::TimelockedStakedIota")) {
          const stakedIota = (_q = inputState.json) == null ? void 0 : _q.staked_iota;
          inputPoolId = (stakedIota == null ? void 0 : stakedIota.pool_id) ?? "";
          inputPrincipal = ((_r = stakedIota == null ? void 0 : stakedIota.principal) == null ? void 0 : _r.value) ?? "";
        } else if ((_t = (_s = inputState == null ? void 0 : inputState.type) == null ? void 0 : _s.repr) == null ? void 0 : _t.includes("staking_pool::StakedIota")) {
          inputPoolId = ((_u = inputState.json) == null ? void 0 : _u.pool_id) ?? "";
          inputPrincipal = ((_w = (_v = inputState.json) == null ? void 0 : _v.principal) == null ? void 0 : _w.value) ?? "";
        }
        if (inputPoolId && inputPrincipal && !node.outputState) {
          const existing = stakeObjects.get(address);
          if (existing) {
            existing.lastEpoch = epochId;
          }
        }
      });
    });
  });
  const stakeObjectsArray = Array.from(stakeObjects.values());
  for (const stakeObject of stakeObjectsArray) {
    const exchangeRateId = validatorMap[stakeObject.poolId];
    if (!exchangeRateId) {
      console.warn(`No exchange rate ID found for pool ${stakeObject.poolId}`);
      continue;
    }
    const activeEpochs = [];
    for (let epoch = stakeObject.stakeActivationEpoch; epoch <= stakeObject.lastEpoch; epoch++) {
      activeEpochs.push(epoch);
    }
    let lastKnownPrincipal;
    const existingEpochs = Object.keys(stakeObject.principalByEpoch).map(Number).sort((a, b) => a - b);
    if (existingEpochs.length > 0) {
      lastKnownPrincipal = stakeObject.principalByEpoch[existingEpochs[0]];
    }
    for (const epoch of activeEpochs) {
      if (stakeObject.principalByEpoch[epoch]) {
        lastKnownPrincipal = stakeObject.principalByEpoch[epoch];
      } else if (lastKnownPrincipal) {
        stakeObject.principalByEpoch[epoch] = lastKnownPrincipal;
        stakeObject.rewardsByEpoch[epoch] = "0";
        stakeObject.accumulatedRewards[epoch] = "0";
      }
    }
    const rewardEpochs = activeEpochs.filter((epoch) => epoch >= stakeObject.stakeActivationEpoch);
    for (const epoch of rewardEpochs) {
      if (epoch == currentEpoch) {
        continue;
      }
      try {
        const exchangeRates = await fetchPoolExchangeRates(exchangeRateId, epoch, stakeObject.poolId);
        if (exchangeRates) {
          stakeObject.exchangeRatesByEpoch[epoch] = exchangeRates;
        }
      } catch (err) {
        console.error(
          `Error fetching exchange rates for poolId ${stakeObject.poolId}, epoch ${epoch}:`,
          err
        );
      }
    }
    await computeRewardsForStakeObject(stakeObject, exchangeRateId);
  }
  const cacheArray = Array.from(exchangeRateCache.values());
  const cacheStats = getExchangeRateCacheStats();
  console.log("=== EXCHANGE RATE CACHE DATA ===");
  console.log("Cache Statistics:", cacheStats);
  console.log("Copy this data to a JSON file for initial cache loading:");
  console.log(JSON.stringify(cacheArray, null, 2));
  console.log("=== END CACHE DATA ===");
  return stakeObjectsArray;
}
async function fetchTransactions(_, error, transactions, stakeObjects, loadingTxs, address, getCurrentEpoch, epoch) {
  set(error, "");
  set(transactions, []);
  set(stakeObjects, []);
  set(loadingTxs, true);
  try {
    const sentTxs = await fetchStakeTransactions(get(address));
    const receivedTxs = await fetchReceivedStakeTransactions(get(address));
    await getCurrentEpoch();
    set(stakeObjects, await processStakeTransactionsWithExchangeRates([sentTxs, receivedTxs], get(epoch)));
    console.log(get(stakeObjects));
    set(transactions, [sentTxs, receivedTxs]);
    console.log("fetching txs complete");
  } catch (err) {
    set(error, (err == null ? void 0 : err.toString()) ?? "Error fetching transactions.");
  } finally {
    set(loadingTxs, false);
  }
}
var on_click = (__1, address, $activeAddress) => set(address, $activeAddress());
var root_1 = from_html(`<div class="error-message svelte-1oorb02"> </div>`);
var root = from_html(`<main><div class="input-row svelte-1oorb02"><button class="svelte-1oorb02"> </button> <span class="svelte-1oorb02">address: <input placeholder="address" size="67"/> <button class="svelte-1oorb02">Set to active address</button></span></div> <!> <div><h3>Staking Rewards:</h3> <!></div> <div><h3>Stake objects:</h3> <!></div> <div><h3>Transactions:</h3> <!></div></main>`);
function StakingRewards($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  let address = mutable_source("0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c");
  let epoch = mutable_source("");
  let epochLoading = false;
  let error = mutable_source("");
  let transactions = mutable_source([]);
  let stakeObjects = mutable_source([]);
  let loadingTxs = mutable_source(false);
  function loadExchangeRateCache(base64) {
    const compressed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const binary = inflate_1(compressed);
    return decode(binary);
  }
  const exchangeRateCacheData = loadExchangeRateCache(exchangeRateCacheRaw.data);
  setInitialExchangeRateCache(exchangeRateCacheData);
  async function getCurrentEpoch() {
    try {
      set(error, "");
      epochLoading = true;
      const currentEpochId = await new EpochPTBAnalyzer().getCurrentEpoch();
      if (currentEpochId) {
        set(epoch, parseInt(currentEpochId));
      } else {
        set(error, "Failed to fetch current epoch.");
      }
    } catch (err) {
      set(error, (err == null ? void 0 : err.toString()) ?? "Error fetching current epoch.");
    } finally {
      epochLoading = false;
    }
  }
  init();
  var main = root();
  var div = child(main);
  var button = child(div);
  button.__click = [
    fetchTransactions,
    error,
    transactions,
    stakeObjects,
    loadingTxs,
    address,
    getCurrentEpoch,
    epoch
  ];
  var text2 = child(button);
  var span = sibling(button, 2);
  var input = sibling(child(span));
  var button_1 = sibling(input, 2);
  button_1.__click = [on_click, address, $activeAddress];
  var node = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      var text_1 = child(div_1);
      template_effect(() => set_text(text_1, get(error)));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (get(error)) $$render(consequent);
    });
  }
  var div_2 = sibling(node, 2);
  var node_1 = sibling(child(div_2), 2);
  {
    let $0 = derived_safe_equal(() => get(epoch) || 1);
    StakingRewardsTable(node_1, {
      get currentEpoch() {
        return get($0);
      },
      get stakeObjects() {
        return get(stakeObjects);
      }
    });
  }
  var div_3 = sibling(div_2, 2);
  var node_2 = sibling(child(div_3), 2);
  JsonToggleView(node_2, {
    get value() {
      return get(stakeObjects);
    }
  });
  var div_4 = sibling(div_3, 2);
  var node_3 = sibling(child(div_4), 2);
  JsonToggleView(node_3, {
    get value() {
      return get(transactions);
    }
  });
  template_effect(() => {
    button.disabled = get(loadingTxs);
    set_text(text2, get(loadingTxs) ? "Loading..." : "Fetch data");
  });
  bind_value(input, () => get(address), ($$value) => set(address, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click"]);
export {
  StakingRewards as default
};

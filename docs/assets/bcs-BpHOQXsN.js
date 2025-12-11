import { aj as base58 } from "/iota-utils/assets/index-DGOCfvLw.js";
import { a as toBase64, b as fromBase64 } from "/iota-utils/assets/b64-BgM4Sqlt.js";
import { a as toHex, b as fromHex } from "/iota-utils/assets/hex-BsUxbKPD.js";
const toBase58 = (buffer) => base58.encode(buffer);
const fromBase58 = (str) => base58.decode(str);
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
    const start = this.bytePosition + this.dataView.byteOffset;
    const value = new Uint8Array(this.dataView.buffer, start, num);
    this.shift(num);
    return value;
  }
  /**
   * Read ULEB value - an integer of varying size. Used for enum indexes and
   * vector lengths.
   * @returns {Number} The ULEB value.
   */
  readULEB() {
    const start = this.bytePosition + this.dataView.byteOffset;
    const buffer = new Uint8Array(this.dataView.buffer, start);
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
function toLittleEndian(bigint, size) {
  const result = new Uint8Array(size);
  let i = 0;
  while (bigint > 0) {
    result[i] = Number(bigint % BigInt(256));
    bigint = bigint / BigInt(256);
    i += 1;
  }
  return result;
}
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var _write, _serialize, _schema, _bytes;
const _BcsType = class _BcsType2 {
  constructor(options) {
    __privateAdd(this, _write);
    __privateAdd(this, _serialize);
    this.name = options.name;
    this.read = options.read;
    this.serializedSize = options.serializedSize ?? (() => null);
    __privateSet(this, _write, options.write);
    __privateSet(this, _serialize, options.serialize ?? ((value, options2) => {
      const writer = new BcsWriter({
        initialSize: this.serializedSize(value) ?? void 0,
        ...options2
      });
      __privateGet(this, _write).call(this, value, writer);
      return writer.toBytes();
    }));
    this.validate = options.validate ?? (() => {
    });
  }
  write(value, writer) {
    this.validate(value);
    __privateGet(this, _write).call(this, value, writer);
  }
  serialize(value, options) {
    this.validate(value);
    return new SerializedBcs(this, __privateGet(this, _serialize).call(this, value, options));
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
    validate
  }) {
    return new _BcsType2({
      name: name ?? this.name,
      read: (reader) => output ? output(this.read(reader)) : this.read(reader),
      write: (value, writer) => __privateGet(this, _write).call(this, input ? input(value) : value, writer),
      serializedSize: (value) => this.serializedSize(input ? input(value) : value),
      serialize: (value, options) => __privateGet(this, _serialize).call(this, input ? input(value) : value, options),
      validate: (value) => {
        validate == null ? void 0 : validate(value);
        this.validate(input ? input(value) : value);
      }
    });
  }
};
_write = /* @__PURE__ */ new WeakMap();
_serialize = /* @__PURE__ */ new WeakMap();
let BcsType = _BcsType;
const SERIALIZED_BCS_BRAND = Symbol.for("@iota/serialized-bcs");
class SerializedBcs {
  constructor(type, schema) {
    __privateAdd(this, _schema);
    __privateAdd(this, _bytes);
    __privateSet(this, _schema, type);
    __privateSet(this, _bytes, schema);
  }
  // Used to brand SerializedBcs so that they can be identified, even between multiple copies
  // of the @iota/bcs package are installed
  get [SERIALIZED_BCS_BRAND]() {
    return true;
  }
  toBytes() {
    return __privateGet(this, _bytes);
  }
  toHex() {
    return toHex(__privateGet(this, _bytes));
  }
  toBase64() {
    return toBase64(__privateGet(this, _bytes));
  }
  toBase58() {
    return toBase58(__privateGet(this, _bytes));
  }
  parse() {
    return __privateGet(this, _schema).parse(__privateGet(this, _bytes));
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
      var _a;
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      (_a = options.validate) == null ? void 0 : _a.call(options, value);
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
      var _a;
      const value = BigInt(val);
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      (_a = options.validate) == null ? void 0 : _a.call(options, value);
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
  toBytes,
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
      const bytes = toBytes(hex);
      writer.writeULEB(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        writer.write8(bytes[i]);
      }
    },
    serialize: (value) => {
      const bytes = toBytes(value);
      const size = ulebEncode(bytes.length);
      const result = new Uint8Array(size.length + bytes.length);
      result.set(size, 0);
      result.set(bytes, size.length);
      return result;
    },
    validate: (value) => {
      var _a;
      if (typeof value !== "string") {
        throw new TypeError(`Invalid ${options.name} value: ${value}. Expected string`);
      }
      (_a = options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        const array = new Uint8Array(value);
        writer.writeULEB(array.length);
        for (let i = 0; i < array.length; i++) {
          writer.write8(array[i] ?? 0);
        }
      },
      ...options,
      serializedSize: (value) => {
        const length = "length" in value ? value.length : null;
        return length == null ? null : ulebEncode(length).length + length;
      },
      validate: (value) => {
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
        const index = reader.readULEB();
        const enumEntry = canonicalOrder[index];
        if (!enumEntry) {
          throw new TypeError(`Unknown value ${index} for enum ${name}`);
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
        var _a;
        (_a = options == null ? void 0 : options.validate) == null ? void 0 : _a.call(options, value);
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
export {
  bcs as b,
  fromBase58 as f,
  toBase58 as t
};

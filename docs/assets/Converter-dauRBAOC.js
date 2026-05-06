import { aH as bcs, b3 as blake2b, p as push, C as onMount, s as set, g as get, D as mutate, J as fromBase64, b4 as fromBase58, aI as toHex, b5 as toBase58, L as toBase64, ay as nanoToIota, b6 as iotaToNano, v as init, b as sibling, h as child, i as if_block, N as TransactionView, t as template_effect, c as set_text, H as bind_value, w as event, d as append, l as pop, E as store_get, F as setup_stores, y as mutable_source, q as from_html, az as Transaction, T as TransactionDataBuilder, K as iotaBcs } from "./index-Bq34MODm.js";
import { b as bind_this } from "./this-DwEq-dJt.js";
import { u as usePageQueryParams, a as updatePageQueryParams } from "./page-query-params-Cyv62nc2.js";
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
var root_1 = from_html(`<div class="formatted-value svelte-1dsv85v"> </div>`);
var root_2 = from_html(`<div class="formatted-value svelte-1dsv85v"> </div>`);
var root_3 = from_html(`<div style="color: red; margin-top: 10px;"> </div>`);
var root = from_html(`<main><div class="wrapper svelte-1dsv85v"><div class="box">Bytes:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="bytes like: 1, 2, 3"/></div> <div class="box">Hex:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="hex string"/></div> <div class="box">Base64:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="base64 string"/></div> <div class="box">Base58:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="base58 string"/></div> <div class="box">UTF-8:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="UTF-8 string"/></div> <div class="box"> </div> <div class="box"><input type="string" style="width: 100%;" placeholder="number"/></div></div> <br/> <div class="wrapper svelte-1dsv85v"><div class="box">NANO:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="NANO amount"/> <!></div> <div class="box">IOTA:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="IOTA amount"/> <!></div></div> <br/> <div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64:</span> <button style="padding: 4px 8px; font-size: 12px;">Example signed tx</button> <button style="padding: 4px 8px; font-size: 12px;">Example unsigned tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or JSON" class="svelte-1dsv85v"></textarea></div></div> <!> <br/> <span style="float:left">Legacy address conversion:</span> <br/> <div class="wrapper svelte-1dsv85v"><div class="box">Address Hex:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="0x6f9e8510b88b0ea4fbc684df90ba310540370a0403067b22cef4971fec3e8bb8"/></div> <div class="box">Address Bech32:</div> <div class="box"><input type="string" style="width: 100%;" placeholder="iota1qpheapgshz9saf8mc6zdly96xyz5qdc2qspsv7ezem6fw8lv869mskn2049"/></div> <div class="box">Legacy address (Ternary):</div> <div class="box"><input type="string" style="width: 100%;" placeholder="TRANSFERCDJWLVPAIXRWNAPXV9WYKVUZWWKXVBE9JBABJ9D9C9F9OEGADYO9CWDAGZHBRWIXLXG9MAJV9RJEOLXSJW"/></div></div> <!></main>`);
function Converter($$anchor, $$props) {
  push($$props, false);
  const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const queryParamDefaults = {
    bytes: "",
    hex: "",
    base58: "",
    base64: "",
    utf8: "",
    bcsNumber: "",
    nano: "",
    iota: "",
    txBytes: "",
    addressHex: "",
    addressBech32: "",
    addressTernary: ""
  };
  const pageParams = usePageQueryParams(queryParamDefaults);
  let bytes = mutable_source();
  let hex = mutable_source("");
  let base58 = mutable_source("");
  let base64 = mutable_source("");
  let utf8 = mutable_source("");
  let bcsNumber = mutable_source("");
  let bcsNumberType = mutable_source("");
  let error = mutable_source("");
  let value = mutable_source();
  let nano = mutable_source("");
  let nanoWithUnderscore = mutable_source("");
  let iota = mutable_source("");
  let iotaWithUnderscore = mutable_source("");
  let addressHex = mutable_source("");
  let addressBech32 = mutable_source("");
  let addressTernary = mutable_source("");
  let addressError = mutable_source("");
  let txBytesTextarea = mutable_source();
  const exampleSignedTx = "AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDts1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=";
  const exampleTx = "AAAEAAgAypo7AAAAAAAIAJQ1dwAAAAAAIAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAACAREXOhTD1ALAFUbFQmXDDMBEFMe37BcyQSuxkGbdSdEQMCAAIBAAABAQABAQMAAAAAAQIAAQEDAAABAAEDAAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAAgG17QdHZ+O2o4na/TneylcrvwY7XNDR98PK2ffE16W3cG9SHwAAAAAgOtvL1ilwL7CT/xBDvtdFWeLe23EYPsQOeWmBNM3rMLOOPbshjMcd4lpSlNYarN19Cibrg+b3QfX4zU263nR5UlzYIBoAAAAAIPWQ2HPkYb/8uoCU0bJ+nJUDnnxOrvSuydHPsgLOozz3AACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQDoAwAAAAAAAJBlSwAAAAAAAA==";
  onMount(() => {
    const params = $pageParams();
    if (params.bytes) {
      set(bytes, params.bytes);
      convert(SourceType.Bytes);
    } else if (params.hex) {
      set(hex, params.hex);
      convert(SourceType.Hex);
    } else if (params.base58) {
      set(base58, params.base58);
      convert(SourceType.Base58);
    } else if (params.base64) {
      set(base64, params.base64);
      convert(SourceType.Base64);
    } else if (params.utf8) {
      set(utf8, params.utf8);
      convert(SourceType.UTF8);
    } else if (params.bcsNumber) {
      set(bcsNumber, params.bcsNumber);
      convert(SourceType.BcsNumber);
    }
    if (params.nano) {
      set(nano, params.nano);
      convertToNano();
    } else if (params.iota) {
      set(iota, params.iota);
      convertToIota();
    }
    if (params.txBytes && get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = params.txBytes);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
    }
    if (params.addressHex) {
      set(addressHex, params.addressHex);
      convertAddress(AddressSourceType.Hex);
    } else if (params.addressBech32) {
      set(addressBech32, params.addressBech32);
      convertAddress(AddressSourceType.Bech32);
    } else if (params.addressTernary) {
      set(addressTernary, params.addressTernary);
      convertAddress(AddressSourceType.Ternary);
    }
  });
  function insertExampleSignedTx() {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = exampleSignedTx);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
      updatePageQueryParams({ txBytes: exampleSignedTx });
    }
  }
  function insertExampleTx() {
    if (get(txBytesTextarea)) {
      mutate(txBytesTextarea, get(txBytesTextarea).value = exampleTx);
      const event2 = new Event("input", { bubbles: true });
      get(txBytesTextarea).dispatchEvent(event2);
      updatePageQueryParams({ txBytes: exampleTx });
    }
  }
  const SourceType = {
    Bytes: 0,
    Hex: 1,
    Base58: 2,
    Base64: 3,
    UTF8: 4,
    BcsNumber: 5
  };
  const AddressSourceType = { Hex: 0, Bech32: 1, Ternary: 2 };
  function convertAddress(source) {
    set(addressError, "");
    try {
      switch (+source) {
        case AddressSourceType.Hex:
          if (get(addressHex)) {
            let normalizedHex = get(addressHex).trim();
            if (!normalizedHex.startsWith("0x") && !normalizedHex.startsWith("0X")) {
              normalizedHex = "0x" + normalizedHex;
            }
            set(addressTernary, ed25519HexToTernary(normalizedHex));
            set(addressBech32, ternaryToBech32(get(addressTernary)));
            updatePageQueryParams({
              addressHex: get(addressHex),
              addressBech32: null,
              addressTernary: null
            });
          } else {
            set(addressTernary, "");
            set(addressBech32, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
        case AddressSourceType.Bech32:
          if (get(addressBech32)) {
            set(addressTernary, bech32ToTernary(get(addressBech32)));
            const hexResult = ternaryToEd25519Hex(get(addressTernary));
            set(addressHex, hexResult.startsWith("0x") ? hexResult : "0x" + hexResult);
            updatePageQueryParams({
              addressBech32: get(addressBech32),
              addressHex: null,
              addressTernary: null
            });
          } else {
            set(addressTernary, "");
            set(addressHex, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
        case AddressSourceType.Ternary:
          if (get(addressTernary)) {
            const hexResult = ternaryToEd25519Hex(get(addressTernary));
            set(addressHex, hexResult.startsWith("0x") ? hexResult : "0x" + hexResult);
            set(addressBech32, ternaryToBech32(get(addressTernary)));
            updatePageQueryParams({
              addressTernary: get(addressTernary),
              addressHex: null,
              addressBech32: null
            });
          } else {
            set(addressHex, "");
            set(addressBech32, "");
            updatePageQueryParams({ addressHex: null, addressBech32: null, addressTernary: null });
          }
          break;
      }
    } catch (err) {
      set(addressError, err.message || err.toString());
    }
  }
  function convert(source) {
    set(error, "");
    try {
      let sourceBytes;
      switch (+source) {
        case SourceType.Bytes:
          let bytes_strings = get(bytes).trim().split(",");
          let parsedBytes = [];
          for (let byte_string of bytes_strings) {
            if (Number.isInteger(parseInt(byte_string))) {
              parsedBytes.push(parseInt(byte_string, 10));
            }
          }
          sourceBytes = parsedBytes;
          break;
        case SourceType.Hex:
          if (get(hex).length % 2 != 0) {
            return;
          }
          sourceBytes = hexToBytesLocal(get(hex));
          break;
        case SourceType.Base58:
          sourceBytes = fromBase58(get(base58));
          break;
        case SourceType.Base64:
          sourceBytes = fromBase64(get(base64));
          break;
        case SourceType.UTF8:
          sourceBytes = new TextEncoder().encode(get(utf8));
          break;
        case SourceType.BcsNumber:
          if (get(bcsNumber) === "") {
            sourceBytes = [];
            set(bcsNumberType, "");
            break;
          }
          sourceBytes = bcs.u64().serialize(get(bcsNumber)).toBytes();
          break;
      }
      if (source != SourceType.Bytes) {
        set(bytes, sourceBytes);
      }
      set(hex, toHex(sourceBytes));
      set(base58, toBase58(sourceBytes));
      set(base64, toBase64(sourceBytes));
      set(utf8, bytesToUtf8(sourceBytes));
      const integerResult = bcsBytesToInteger(sourceBytes);
      set(bcsNumber, integerResult.value);
      if (get(bytes).length === 0) {
        set(bcsNumber, "");
        set(bcsNumberType, "");
      } else {
        set(bcsNumberType, integerResult.type);
      }
    } catch (err) {
      try {
        set(error, JSON.stringify(JSON.parse(err.message).payload.error));
      } catch (e) {
        set(error, err);
      }
    }
    const queryUpdates = {
      bytes: null,
      hex: null,
      base58: null,
      base64: null,
      utf8: null,
      bcsNumber: null
    };
    switch (+source) {
      case SourceType.Bytes:
        if (get(bytes)) queryUpdates.bytes = get(bytes);
        break;
      case SourceType.Hex:
        if (get(hex)) queryUpdates.hex = get(hex);
        break;
      case SourceType.Base58:
        if (get(base58)) queryUpdates.base58 = get(base58);
        break;
      case SourceType.Base64:
        if (get(base64)) queryUpdates.base64 = get(base64);
        break;
      case SourceType.UTF8:
        if (get(utf8)) queryUpdates.utf8 = get(utf8);
        break;
      case SourceType.BcsNumber:
        if (get(bcsNumber)) queryUpdates.bcsNumber = get(bcsNumber);
        break;
    }
    updatePageQueryParams(queryUpdates);
  }
  function hexToBytesLocal(hex2) {
    var re = /^(0[xX])?[A-Fa-f0-9]+$/;
    if (!re.test(hex2)) {
      console.error("invalid hex");
      throw "invalid hex";
    }
    if (hex2.toLowerCase().startsWith("0x")) {
      hex2 = hex2.slice(2, hex2.length);
    }
    return hexToBytes(hex2);
  }
  function convertToIota() {
    set(error, "");
    try {
      if (get(nano)) {
        set(iota, nanoToIota(get(nano)));
        set(iotaWithUnderscore, get(iota).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        set(nanoWithUnderscore, get(nano).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        updatePageQueryParams({ nano: get(nano), iota: null });
      } else {
        set(iota, "");
        updatePageQueryParams({ nano: null, iota: null });
      }
    } catch (err) {
      set(error, err);
    }
  }
  function convertToNano() {
    set(error, "");
    try {
      if (get(iota)) {
        set(nano, iotaToNano(get(iota)));
        set(iotaWithUnderscore, get(iota).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        set(nanoWithUnderscore, get(nano).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
        updatePageQueryParams({ iota: get(iota), nano: null });
      } else {
        set(nano, "");
        updatePageQueryParams({ iota: null, nano: null });
      }
    } catch (err) {
      set(error, err);
    }
  }
  init();
  var main = root();
  var div = child(main);
  var div_1 = sibling(child(div), 2);
  var input = child(div_1);
  var div_2 = sibling(div_1, 4);
  var input_1 = child(div_2);
  var div_3 = sibling(div_2, 4);
  var input_2 = child(div_3);
  var div_4 = sibling(div_3, 4);
  var input_3 = child(div_4);
  var div_5 = sibling(div_4, 4);
  var input_4 = child(div_5);
  var div_6 = sibling(div_5, 2);
  var text = child(div_6);
  var div_7 = sibling(div_6, 2);
  var input_5 = child(div_7);
  var div_8 = sibling(div, 4);
  var div_9 = sibling(child(div_8), 2);
  var input_6 = child(div_9);
  var node = sibling(input_6, 2);
  {
    var consequent = ($$anchor2) => {
      var div_10 = root_1();
      var text_1 = child(div_10);
      template_effect(() => set_text(text_1, get(nanoWithUnderscore)));
      append($$anchor2, div_10);
    };
    if_block(node, ($$render) => {
      if (get(nanoWithUnderscore)) $$render(consequent);
    });
  }
  var div_11 = sibling(div_9, 4);
  var input_7 = child(div_11);
  var node_1 = sibling(input_7, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_12 = root_2();
      var text_2 = child(div_12);
      template_effect(() => set_text(text_2, get(iotaWithUnderscore)));
      append($$anchor2, div_12);
    };
    if_block(node_1, ($$render) => {
      if (get(iotaWithUnderscore)) $$render(consequent_1);
    });
  }
  var div_13 = sibling(div_8, 4);
  var div_14 = child(div_13);
  var button = sibling(child(div_14), 2);
  var button_1 = sibling(button, 2);
  var div_15 = sibling(div_14, 2);
  var textarea = child(div_15);
  bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
  var node_2 = sibling(div_13, 2);
  TransactionView(node_2, {
    get value() {
      return get(value);
    }
  });
  var text_3 = sibling(node_2, 3);
  var div_16 = sibling(text_3, 5);
  var div_17 = sibling(child(div_16), 2);
  var input_8 = child(div_17);
  var div_18 = sibling(div_17, 4);
  var input_9 = child(div_18);
  var div_19 = sibling(div_18, 4);
  var input_10 = child(div_19);
  var node_3 = sibling(div_16, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_20 = root_3();
      var text_4 = child(div_20);
      template_effect(() => set_text(text_4, `Address conversion error: ${get(addressError) ?? ""}`));
      append($$anchor2, div_20);
    };
    if_block(node_3, ($$render) => {
      if (get(addressError)) $$render(consequent_2);
    });
  }
  template_effect(() => {
    set_text(text, `number (from/to BCS bytes): ${get(bcsNumberType) ?? ""}`);
    set_text(text_3, ` ${get(error) ?? ""} `);
  });
  bind_value(input, () => get(bytes), ($$value) => set(bytes, $$value));
  event("input", input, () => convert(SourceType.Bytes));
  bind_value(input_1, () => get(hex), ($$value) => set(hex, $$value));
  event("input", input_1, () => convert(SourceType.Hex));
  bind_value(input_2, () => get(base64), ($$value) => set(base64, $$value));
  event("input", input_2, () => convert(SourceType.Base64));
  bind_value(input_3, () => get(base58), ($$value) => set(base58, $$value));
  event("input", input_3, () => convert(SourceType.Base58));
  bind_value(input_4, () => get(utf8), ($$value) => set(utf8, $$value));
  event("input", input_4, () => convert(SourceType.UTF8));
  bind_value(input_5, () => get(bcsNumber), ($$value) => set(bcsNumber, $$value));
  event("input", input_5, () => convert(SourceType.BcsNumber));
  bind_value(input_6, () => get(nano), ($$value) => set(nano, $$value));
  event("input", input_6, () => convertToIota());
  bind_value(input_7, () => get(iota), ($$value) => set(iota, $$value));
  event("input", input_7, () => convertToNano());
  event("click", button, insertExampleSignedTx);
  event("click", button_1, insertExampleTx);
  event("input", textarea, async (event2) => {
    let inputString = event2.target.value;
    if (inputString.trim().startsWith("{")) {
      try {
        let deserializedTxnBuilder;
        try {
          deserializedTxnBuilder = Transaction.from(inputString);
        } catch {
          const jsonData = JSON.parse(inputString);
          deserializedTxnBuilder = Transaction.from(
            // TODO: this is another representation and doesn't work this way:
            // "value": {
            //     "V1": {
            //         "kind": {
            //         "ProgrammableTransaction": {
            jsonData.intentMessage.value
          );
        }
        const txBytes = await deserializedTxnBuilder.build();
        const base64String = toBase64(txBytes);
        if (get(txBytesTextarea)) {
          mutate(txBytesTextarea, get(txBytesTextarea).value = base64String);
        }
        set(value, deserializedTxnBuilder);
        inputString = base64String;
        updatePageQueryParams({ txBytes: base64String });
      } catch (e) {
        console.log("error parsing/serializing JSON", e);
        set(value, e);
      }
    }
    try {
      let txBytes = fromBase64(inputString);
      const txBuilder = TransactionDataBuilder.fromBytes(txBytes);
      set(value, Object.assign(txBuilder, { transactionBytes: inputString }));
    } catch (e) {
      console.log("error TransactionDataBuilder", e);
      try {
        set(value, iotaBcs.SenderSignedData.parse(fromBase64(inputString))[0]);
      } catch (e2) {
        console.log("error SenderSignedData", e2);
        set(value, e2);
      }
    }
  });
  bind_value(input_8, () => get(addressHex), ($$value) => set(addressHex, $$value));
  event("input", input_8, () => convertAddress(AddressSourceType.Hex));
  bind_value(input_9, () => get(addressBech32), ($$value) => set(addressBech32, $$value));
  event("input", input_9, () => convertAddress(AddressSourceType.Bech32));
  bind_value(input_10, () => get(addressTernary), ($$value) => set(addressTernary, $$value));
  event("input", input_10, () => convertAddress(AddressSourceType.Ternary));
  append($$anchor, main);
  pop();
  $$cleanup();
}
export {
  Converter as default
};

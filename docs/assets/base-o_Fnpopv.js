//#region node_modules/.pnpm/@scure+base@2.2.0/node_modules/@scure/base/index.js
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function isArrayOf(isString, arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return true;
	if (isString) return arr.every((item) => typeof item === "string");
	else return arr.every((item) => Number.isSafeInteger(item));
}
function afn(input) {
	if (typeof input !== "function") throw new TypeError("function expected");
	return true;
}
function astr(label, input) {
	if (typeof input !== "string") throw new TypeError(`${label}: string expected`);
	return true;
}
function anumber(n) {
	if (typeof n !== "number") throw new TypeError(`number expected, got ${typeof n}`);
	if (!Number.isSafeInteger(n)) throw new RangeError(`invalid integer: ${n}`);
}
function aArr(input) {
	if (!Array.isArray(input)) throw new TypeError("array expected");
}
function astrArr(label, input) {
	if (!isArrayOf(true, input)) throw new TypeError(`${label}: array of strings expected`);
}
function anumArr(label, input) {
	if (!isArrayOf(false, input)) throw new TypeError(`${label}: array of numbers expected`);
}
/**
* @__NO_SIDE_EFFECTS__
*/
function chain(...args) {
	const id = (a) => a;
	const wrap = (a, b) => (c) => a(b(c));
	return {
		encode: args.map((x) => x.encode).reduceRight(wrap, id),
		decode: args.map((x) => x.decode).reduce(wrap, id)
	};
}
/**
* Encodes integer radix representation to array of strings using alphabet and back.
* Could also be array of strings.
* @__NO_SIDE_EFFECTS__
*/
function alphabet(letters) {
	const lettersA = typeof letters === "string" ? letters.split("") : letters;
	const len = lettersA.length;
	astrArr("alphabet", lettersA);
	const indexes = new Map(lettersA.map((l, i) => [l, i]));
	return {
		encode: (digits) => {
			aArr(digits);
			return digits.map((i) => {
				if (!Number.isSafeInteger(i) || i < 0 || i >= len) throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
				return lettersA[i];
			});
		},
		decode: (input) => {
			aArr(input);
			return input.map((letter) => {
				astr("alphabet.decode", letter);
				const i = indexes.get(letter);
				if (i === void 0) throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
				return i;
			});
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
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
/**
* Pad strings array so it has integer number of bits
* @__NO_SIDE_EFFECTS__
*/
function padding(bits, chr = "=") {
	anumber(bits);
	astr("padding", chr);
	return {
		encode(data) {
			astrArr("padding.encode", data);
			while (data.length * bits % 8) data.push(chr);
			return data;
		},
		decode(input) {
			astrArr("padding.decode", input);
			let end = input.length;
			if (end * bits % 8) throw new Error("padding: invalid, string should have whole number of bytes");
			for (; end > 0 && input[end - 1] === chr; end--) if ((end - 1) * bits % 8 === 0) throw new Error("padding: invalid, string has too much padding");
			return input.slice(0, end);
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
function normalize(fn) {
	afn(fn);
	return {
		encode: (from) => from,
		decode: (to) => fn(to)
	};
}
/**
* Slow: O(n^2) time complexity
*/
function convertRadix(data, from, to) {
	if (from < 2) throw new RangeError(`convertRadix: invalid from=${from}, base cannot be less than 2`);
	if (to < 2) throw new RangeError(`convertRadix: invalid to=${to}, base cannot be less than 2`);
	aArr(data);
	if (!data.length) return [];
	let pos = 0;
	const res = [];
	const digits = Array.from(data, (d) => {
		anumber(d);
		if (d < 0 || d >= from) throw new Error(`invalid integer: ${d}`);
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
			if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) throw new Error("convertRadix: carry overflow");
			const div = digitBase / to;
			carry = digitBase % to;
			const rounded = Math.floor(div);
			digits[i] = rounded;
			if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase) throw new Error("convertRadix: carry overflow");
			if (!done) continue;
			else if (!rounded) pos = i;
			else done = false;
		}
		res.push(carry);
		if (done) break;
	}
	for (let i = 0; i < data.length - 1 && data[i] === 0; i++) res.push(0);
	return res.reverse();
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
	let res = [];
	for (let i = 0; i < 40; i++) res.push(2 ** i);
	return res;
})();
/**
* Implemented with numbers, because BigInt is 5x slower
*/
function convertRadix2(data, from, to, padding) {
	aArr(data);
	if (from <= 0 || from > 32) throw new RangeError(`convertRadix2: wrong from=${from}`);
	if (to <= 0 || to > 32) throw new RangeError(`convertRadix2: wrong to=${to}`);
	if (/* @__PURE__ */ radix2carry(from, to) > 32) throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
	let carry = 0;
	let pos = 0;
	const max = powers[from];
	const mask = powers[to] - 1;
	const res = [];
	for (const n of data) {
		anumber(n);
		if (n >= max) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
		carry = carry << from | n;
		if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
		pos += from;
		for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
		const pow = powers[pos];
		if (pow === void 0) throw new Error("invalid carry");
		carry &= pow - 1;
	}
	carry = carry << to - pos & mask;
	if (!padding && pos >= from) throw new Error("Excess padding");
	if (!padding && carry > 0) throw new Error(`Non-zero padding: ${carry}`);
	if (padding && pos > 0) res.push(carry >>> 0);
	return res;
}
/**
* @__NO_SIDE_EFFECTS__
*/
function radix(num) {
	anumber(num);
	const _256 = 2 ** 8;
	return {
		encode: (bytes) => {
			if (!isBytes(bytes)) throw new TypeError("radix.encode input should be Uint8Array");
			return convertRadix(Array.from(bytes), _256, num);
		},
		decode: (digits) => {
			anumArr("radix.decode", digits);
			return Uint8Array.from(convertRadix(digits, num, _256));
		}
	};
}
/**
* If both bases are power of same number (like `2**8 <-> 2**64`),
* there is a linear algorithm. For now we have implementation for power-of-two bases only.
* @__NO_SIDE_EFFECTS__
*/
function radix2(bits, revPadding = false) {
	anumber(bits);
	if (bits <= 0 || bits > 32) throw new RangeError("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32) throw new RangeError("radix2: carry overflow");
	return {
		encode: (bytes) => {
			if (!isBytes(bytes)) throw new TypeError("radix2.encode input should be Uint8Array");
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
		} catch (e) {}
	};
}
function checksum(len, fn) {
	anumber(len);
	if (len <= 0) throw new RangeError(`checksum length must be positive: ${len}`);
	afn(fn);
	const _fn = fn;
	return {
		encode(data) {
			if (!isBytes(data)) throw new TypeError("checksum.encode: input should be Uint8Array");
			const sum = _fn(data).slice(0, len);
			const res = new Uint8Array(data.length + len);
			res.set(data);
			res.set(sum, data.length);
			return res;
		},
		decode(data) {
			if (!isBytes(data)) throw new TypeError("checksum.decode: input should be Uint8Array");
			const payload = data.slice(0, -len);
			const oldChecksum = data.slice(-len);
			const newChecksum = _fn(payload).slice(0, len);
			for (let i = 0; i < len; i++) if (newChecksum[i] !== oldChecksum[i]) throw new Error("Invalid checksum");
			return payload;
		}
	};
}
/**
* Low-level building blocks used by the exported codecs.
* @example
* Build a radix-32 coder from the low-level helpers.
* ```ts
* import { utils } from '@scure/base';
* utils.radix2(5).encode(Uint8Array.from([1, 2, 3]));
* ```
*/
var utils = /* @__PURE__ */ Object.freeze({
	alphabet,
	chain,
	checksum,
	convertRadix,
	convertRadix2,
	radix,
	radix2,
	join,
	padding
});
chain(radix2(4), alphabet("0123456789ABCDEF"), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join(""), normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
hasBase64Builtin || chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6), join(""));
chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), join(""));
hasBase64Builtin || chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6), join(""));
chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), join(""));
var BECH_ALPHABET = chain(alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join(""));
var POLYMOD_GENERATORS = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function bech32Polymod(pre) {
	const b = pre >> 25;
	let chk = (pre & 33554431) << 5;
	for (let i = 0; i < POLYMOD_GENERATORS.length; i++) if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
	return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
	const len = prefix.length;
	let chk = 1;
	for (let i = 0; i < len; i++) {
		const c = prefix.charCodeAt(i);
		if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
		chk = bech32Polymod(chk) ^ c >> 5;
	}
	chk = bech32Polymod(chk);
	for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
	for (let v of words) chk = bech32Polymod(chk) ^ v;
	for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
	chk ^= encodingConst;
	return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
/**
* @__NO_SIDE_EFFECTS__
*/
function genBech32(encoding) {
	const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
	const _words = radix2(5);
	const fromWords = _words.decode;
	const toWords = _words.encode;
	const fromWordsUnsafe = unsafeWrapper(fromWords);
	function encode(prefix, words, limit = 90) {
		astr("bech32.encode prefix", prefix);
		if (isBytes(words)) words = Array.from(words);
		anumArr("bech32.encode", words);
		const plen = prefix.length;
		if (plen === 0) throw new TypeError(`Invalid prefix length ${plen}`);
		const actualLength = plen + 7 + words.length;
		if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
		const lowered = prefix.toLowerCase();
		const sum = bechChecksum(lowered, words, ENCODING_CONST);
		return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
	}
	function decode(str, limit = 90) {
		astr("bech32.decode input", str);
		const slen = str.length;
		if (slen < 8 || limit !== false && slen > limit) throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
		const lowered = str.toLowerCase();
		if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
		const sepIndex = lowered.lastIndexOf("1");
		if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
		const prefix = lowered.slice(0, sepIndex);
		const data = lowered.slice(sepIndex + 1);
		if (data.length < 6) throw new Error("Data must be at least 6 characters long");
		const words = BECH_ALPHABET.decode(data).slice(0, -6);
		const sum = bechChecksum(prefix, words, ENCODING_CONST);
		if (!data.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
		return {
			prefix,
			words
		};
	}
	const decodeUnsafe = unsafeWrapper(decode);
	function decodeToBytes(str) {
		const { prefix, words } = decode(str, false);
		return {
			prefix,
			words,
			bytes: fromWords(words)
		};
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
/**
* bech32 from BIP 173. Operates on words.
* For high-level helpers, check out {@link https://github.com/paulmillr/scure-btc-signer | scure-btc-signer}.
* @example
* Convert bytes to words, encode them, then decode back.
* ```ts
* const words = bech32.toWords(Uint8Array.from([1, 2, 3]));
* const text = bech32.encode('bc', words);
* bech32.decode(text);
* ```
*/
var bech32 = /* @__PURE__ */ Object.freeze(genBech32("bech32"));
genBech32("bech32m");
/* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")() || chain(radix2(4), alphabet("0123456789abcdef"), join(""), normalize((s) => {
	if (typeof s !== "string" || s.length % 2 !== 0) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
	return s.toLowerCase();
}));
//#endregion
export { utils as n, bech32 as t };

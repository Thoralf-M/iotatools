import { C as bind_select_value, Dt as pop, G as event, Mt as reset, Ot as push, R as set_text, V as from_html, Y as get, ct as sibling, ft as set, h as bind_value, it as template_effect, ot as child, s as init, ut as mutable_source, v as remove_input_defaults, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { Q as toBase64, X as toHex, Y as fromHex, Z as fromBase64, a as decodeIotaPrivateKey, n as Ed25519PublicKey, t as Ed25519Keypair } from "./keypair-DsT3ivIR.js";
import { A as randomBytes, D as createView, E as createHasher, F as utf8ToBytes, O as kdfInputToBytes, S as aoutput, T as clean, _ as split, a as add4L, b as ahash, d as rotrBH, f as rotrBL, g as shrSL, h as shrSH, i as add4H, j as rotr, k as oidNist, m as rotrSL, n as add3H, o as add5H, p as rotrSH, r as add3L, s as add5L, t as add, v as abytes, w as checkOpts, x as anumber, y as aexists } from "./_u64-Dkyx1UQH.js";
import { n as utils } from "./base-o_Fnpopv.js";
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/**
* Shared 32-bit conditional boolean primitive reused by SHA-256, SHA-1, and MD5 `F`.
* Returns bits from `b` when `a` is set, otherwise from `c`.
* The XOR form is equivalent to MD5's `F(X,Y,Z) = XY v not(X)Z` because the masked terms never
* set the same bit.
* @param a - selector word
* @param b - word chosen when selector bit is set
* @param c - word chosen when selector bit is clear
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit choice primitive.
* ```ts
* Chi(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/**
* Shared 32-bit majority primitive reused by SHA-256 and SHA-1.
* Returns bits shared by at least two inputs.
* @param a - first input word
* @param b - second input word
* @param c - third input word
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit majority primitive.
* ```ts
* Maj(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
* Accepts only byte-aligned `Uint8Array` input, even when the underlying spec describes bit
* strings with partial-byte tails.
* @param blockLen - internal block size in bytes
* @param outputLen - digest size in bytes
* @param padOffset - trailing length field size in bytes
* @param isLE - whether length and state words are encoded in little-endian
* @example
* Use a concrete subclass to get the shared Merkle-Damgard update/digest flow.
* ```ts
* import { _SHA1 } from '@noble/hashes/legacy.js';
* const hash = new _SHA1();
* hash.update(new Uint8Array([97, 98, 99]));
* hash.digest();
* ```
*/
var HashMD = class {
	blockLen;
	outputLen;
	canXOF = false;
	padOffset;
	isLE;
	buffer;
	view;
	finished = false;
	length = 0;
	pos = 0;
	destroyed = false;
	constructor(blockLen, outputLen, padOffset, isLE) {
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
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
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to ||= new this.constructor();
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state from RFC 6234 §6.1: the first 32 bits of the fractional parts of the
* square roots of the first eight prime numbers. Exported as a shared table; callers must treat
* it as read-only because constructors copy words from it by index. */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA512 state from RFC 6234 §6.3: eight RFC 64-bit `H(0)` words stored as sixteen
* big-endian 32-bit halves. Derived from the fractional parts of the square roots of the first
* eight prime numbers. Exported as a shared table; callers must treat it as read-only because
* constructors copy halves from it by index. */
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
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
//#endregion
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
/**
* Internal class for HMAC.
* Accepts any byte key, although RFC 2104 §3 recommends keys at least
* `HashLen` bytes long.
*/
var _HMAC = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	canXOF = false;
	finished = false;
	destroyed = false;
	constructor(hash, key) {
		ahash(hash);
		abytes(key, void 0, "key");
		this.iHash = hash.create();
		if (typeof this.iHash.update !== "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
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
		aoutput(out, this);
		this.finished = true;
		const buf = out.subarray(0, this.outputLen);
		this.iHash.digestInto(buf);
		this.oHash.update(buf);
		this.oHash.digestInto(buf);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to ||= Object.create(Object.getPrototypeOf(this), {});
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
};
var hmac = /* @__PURE__ */ (() => {
	const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
	hmac_.create = (hash, key) => new _HMAC(hash, key);
	return hmac_;
})();
//#endregion
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/pbkdf2.js
/**
* PBKDF (RFC 2898). Can be used to create a key from password and salt.
* @module
*/
function pbkdf2Init(hash, _password, _salt, _opts) {
	ahash(hash);
	const { c, dkLen, asyncTick } = checkOpts({
		dkLen: 32,
		asyncTick: 10
	}, _opts);
	anumber(c, "c");
	anumber(dkLen, "dkLen");
	anumber(asyncTick, "asyncTick");
	if (c < 1) throw new Error("iterations (c) must be >= 1");
	if (dkLen < 1) throw new Error("\"dkLen\" must be >= 1");
	if (dkLen > (2 ** 32 - 1) * hash.outputLen) throw new Error("derived key too long");
	const password = kdfInputToBytes(_password, "password");
	const salt = kdfInputToBytes(_salt, "salt");
	const DK = new Uint8Array(dkLen);
	const PRF = hmac.create(hash, password);
	return {
		c,
		dkLen,
		asyncTick,
		DK,
		PRF,
		PRFSalt: PRF._cloneInto().update(salt)
	};
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
	PRF.destroy();
	PRFSalt.destroy();
	if (prfW) prfW.destroy();
	clean(u);
	return DK;
}
/**
* PBKDF2-HMAC: RFC 8018 key derivation function.
* @param hash - hash function that would be used e.g. sha256
* @param password - password from which a derived key is generated;
*   JS string inputs are UTF-8 encoded first
* @param salt - cryptographic salt; JS string inputs are UTF-8 encoded first
* @param opts - PBKDF2 work factor and output settings. `dkLen`, if provided,
*   must be `>= 1` per RFC 8018 §5.2. See {@link Pbkdf2Opt}.
* @returns Derived key bytes.
* @throws If the PBKDF2 iteration count or derived-key settings are invalid. {@link Error}
* @example
* PBKDF2-HMAC: RFC 2898 key derivation function.
* ```ts
* import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const key = pbkdf2(sha256, 'password', 'salt', { dkLen: 32, c: Math.pow(2, 18) });
* ```
*/
function pbkdf2(hash, password, salt, opts) {
	const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
	let prfW;
	const arr = /* @__PURE__ */ new Uint8Array(4);
	const view = createView(arr);
	const u = new Uint8Array(PRF.outputLen);
	for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
		const Ti = DK.subarray(pos, pos + PRF.outputLen);
		view.setInt32(0, ti, false);
		(prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
		Ti.set(u.subarray(0, Ti.length));
		for (let ui = 1; ui < c; ui++) {
			PRF._cloneInto(prfW).update(u).digestInto(u);
			for (let i = 0; i < Ti.length; i++) Ti[i] ^= u[i];
		}
	}
	return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
//#endregion
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out {@link https://www.rfc-editor.org/rfc/rfc4634 | RFC 4634} and
* {@link https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf | FIPS 180-4}.
* @module
*/
/**
* SHA-224 / SHA-256 round constants from RFC 6234 §5.1: the first 32 bits
* of the cube roots of the first 64 primes (2..311).
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
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
/** Reusable SHA-224 / SHA-256 message schedule buffer `W_t` from RFC 6234 §6.2 step 1. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal SHA-224 / SHA-256 compression engine from RFC 6234 §6.2. */
var SHA2_32B = class extends HashMD {
	constructor(outputLen) {
		super(64, outputLen, 8, false);
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
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
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			SHA256_W[i] = (rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10) + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
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
		this.destroyed = true;
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
/** Internal SHA-256 hash class grounded in RFC 6234 §6.2. */
var _SHA256 = class extends SHA2_32B {
	A = SHA256_IV[0] | 0;
	B = SHA256_IV[1] | 0;
	C = SHA256_IV[2] | 0;
	D = SHA256_IV[3] | 0;
	E = SHA256_IV[4] | 0;
	F = SHA256_IV[5] | 0;
	G = SHA256_IV[6] | 0;
	H = SHA256_IV[7] | 0;
	constructor() {
		super(32);
	}
};
var K512 = /* @__PURE__ */ (() => split([
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
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
/** Internal SHA-384 / SHA-512 compression engine from RFC 6234 §6.4. */
var SHA2_64B = class extends HashMD {
	constructor(outputLen) {
		super(128, outputLen, 16, false);
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
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
			const SUMl = add4L(s0l, rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6), SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			SHA512_W_H[i] = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]) | 0;
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
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
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
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		this.destroyed = true;
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/** Internal SHA-512 hash class grounded in RFC 6234 §6.3 and §6.4. */
var _SHA512 = class extends SHA2_64B {
	Ah = SHA512_IV[0] | 0;
	Al = SHA512_IV[1] | 0;
	Bh = SHA512_IV[2] | 0;
	Bl = SHA512_IV[3] | 0;
	Ch = SHA512_IV[4] | 0;
	Cl = SHA512_IV[5] | 0;
	Dh = SHA512_IV[6] | 0;
	Dl = SHA512_IV[7] | 0;
	Eh = SHA512_IV[8] | 0;
	El = SHA512_IV[9] | 0;
	Fh = SHA512_IV[10] | 0;
	Fl = SHA512_IV[11] | 0;
	Gh = SHA512_IV[12] | 0;
	Gl = SHA512_IV[13] | 0;
	Hh = SHA512_IV[14] | 0;
	Hl = SHA512_IV[15] | 0;
	constructor() {
		super(64);
	}
};
/**
* SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
*
* - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
* - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
* - Each sha256 hash is executing 2^18 bit operations.
* - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
* @param msg - message bytes to hash
* @returns Digest bytes.
* @example
* Hash a message with SHA2-256.
* ```ts
* sha256(new Uint8Array([97, 98, 99]));
* ```
*/
var sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
/**
* SHA2-512 hash function from RFC 4634.
* @param msg - message bytes to hash
* @returns Digest bytes.
* @example
* Hash a message with SHA2-512.
* ```ts
* sha512(new Uint8Array([97, 98, 99]));
* ```
*/
var sha512 = /* @__PURE__ */ createHasher(() => new _SHA512(), /* @__PURE__ */ oidNist(3));
//#endregion
//#region node_modules/.pnpm/@scure+bip39@2.2.0/node_modules/@scure/bip39/index.js
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
var isJapanese = (wordlist) => wordlist[0] === "あいこくしん";
function nfkd(str) {
	if (typeof str !== "string") throw new TypeError("invalid mnemonic type: " + typeof str);
	return str.normalize("NFKD");
}
function normalize(str) {
	const norm = nfkd(str);
	const words = norm.split(" ");
	if (![
		12,
		15,
		18,
		21,
		24
	].includes(words.length)) throw new Error("Invalid mnemonic");
	return {
		nfkd: norm,
		words
	};
}
function aentropy(ent) {
	abytes(ent);
	if (![
		16,
		20,
		24,
		28,
		32
	].includes(ent.length)) throw new RangeError("invalid entropy length");
}
/**
* Generate x random words. Uses Cryptographically-Secure Random Number Generator.
* @param wordlist - Imported wordlist for a specific language.
* @param strength - Mnemonic strength, from 128 to 256 bits.
* @returns 12-24 word mnemonic phrase.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Generate a new English mnemonic.
* ```ts
* import { generateMnemonic } from '@scure/bip39';
* import { wordlist } from '@scure/bip39/wordlists/english.js';
* const mnemonic = generateMnemonic(wordlist, 128);
* // 'legal winner thank year wave sausage worth useful legal winner thank yellow'
* ```
*/
function generateMnemonic(wordlist, strength = 128) {
	anumber(strength);
	if (strength % 32 !== 0 || strength > 256) throw new RangeError("Invalid entropy");
	return entropyToMnemonic(randomBytes(strength / 8), wordlist);
}
var calcChecksum = (entropy) => {
	const bitsLeft = 8 - entropy.length / 4;
	return new Uint8Array([sha256(entropy)[0] >> bitsLeft << bitsLeft]);
};
function getCoder(wordlist) {
	if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== "string") throw new TypeError("Wordlist: expected array of 2048 strings");
	wordlist.forEach((i) => {
		if (typeof i !== "string") throw new TypeError("wordlist: non-string element: " + i);
	});
	return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist));
}
/**
* Reversible: Converts mnemonic string to raw entropy in form of byte array.
* @param mnemonic - 12-24 words.
* @param wordlist - Imported wordlist for a specific language.
* @returns Raw entropy bytes.
* @throws If the mnemonic shape or checksum is invalid. {@link Error}
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Decode a mnemonic back into its original entropy bytes.
* ```ts
* import { mnemonicToEntropy } from '@scure/bip39';
* import { wordlist } from '@scure/bip39/wordlists/english.js';
* const mnem = 'legal winner thank year wave sausage worth useful legal winner thank yellow';
* const entropy = mnemonicToEntropy(mnem, wordlist);
* // Produces the original 16-byte entropy payload.
* new Uint8Array([
*   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
*   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f
* ])
* ```
*/
function mnemonicToEntropy(mnemonic, wordlist) {
	const { words } = normalize(mnemonic);
	const entropy = getCoder(wordlist).decode(words);
	aentropy(entropy);
	return entropy;
}
/**
* Reversible: Converts raw entropy in form of byte array to mnemonic string.
* @param entropy - Byte array.
* @param wordlist - Imported wordlist for a specific language.
* @returns 12-24 words.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Convert raw entropy into an English mnemonic.
* ```ts
* import { entropyToMnemonic } from '@scure/bip39';
* import { wordlist } from '@scure/bip39/wordlists/english.js';
* const ent = new Uint8Array([
*   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
*   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f
* ]);
* const mnemonic = entropyToMnemonic(ent, wordlist);
* // 'legal winner thank year wave sausage worth useful legal winner thank yellow'
* ```
*/
function entropyToMnemonic(entropy, wordlist) {
	aentropy(entropy);
	return getCoder(wordlist).encode(entropy).join(isJapanese(wordlist) ? "　" : " ");
}
var psalt = (passphrase) => nfkd("mnemonic" + passphrase);
/**
* Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
* @param mnemonic - 12-24 words.
* @param passphrase - String that will additionally protect the key.
* @returns 64 bytes of key data.
* @throws If the mnemonic shape is invalid. {@link Error}
* @throws On wrong argument types. {@link TypeError}
* @example
* Derive a seed from a mnemonic with the sync PBKDF2 helper.
* ```ts
* const mnem = 'legal winner thank year wave sausage worth useful legal winner thank yellow';
* const seed = mnemonicToSeedSync(mnem, 'password');
* // => new Uint8Array([...64 bytes])
* ```
*/
function mnemonicToSeedSync(mnemonic, passphrase = "") {
	return pbkdf2(sha512, normalize(mnemonic).nfkd, psalt(passphrase), {
		c: 2048,
		dkLen: 64
	});
}
//#endregion
//#region node_modules/.pnpm/@scure+bip39@2.2.0/node_modules/@scure/bip39/wordlists/english.js
/** English BIP39 wordlist. */
var wordlist = /* @__PURE__ */ Object.freeze(`abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n"));
//#endregion
//#region src/lib/pages/ed25519-address-generation/ed25519-hd-key.ts
var ED25519_CURVE = "ed25519 seed";
var HARDENED_OFFSET = 2147483648;
var pathRegex = /* @__PURE__ */ new RegExp("^m(\\/[0-9]+')+$");
var replaceDerive = (val) => val.replace("'", "");
var getMasterKeyFromSeed = (seed) => {
	const I = hmac.create(sha512, utf8ToBytes(ED25519_CURVE)).update(fromHex(seed)).digest();
	return {
		key: I.slice(0, 32),
		chainCode: I.slice(32)
	};
};
var CKDPriv = ({ key, chainCode }, index) => {
	const indexBuffer = /* @__PURE__ */ new ArrayBuffer(4);
	new DataView(indexBuffer).setUint32(0, index);
	const data = new Uint8Array(1 + key.length + indexBuffer.byteLength);
	data.set((/* @__PURE__ */ new Uint8Array(1)).fill(0));
	data.set(key, 1);
	data.set(new Uint8Array(indexBuffer, 0, indexBuffer.byteLength), key.length + 1);
	const I = hmac.create(sha512, chainCode).update(data).digest();
	return {
		key: I.slice(0, 32),
		chainCode: I.slice(32)
	};
};
var isValidPath = (path) => {
	if (!pathRegex.test(path)) return false;
	return !path.split("/").slice(1).map(replaceDerive).some(isNaN);
};
var derivePath = (path, seed, offset = HARDENED_OFFSET) => {
	if (!isValidPath(path)) throw new Error("Invalid derivation path");
	const { key, chainCode } = getMasterKeyFromSeed(seed);
	return path.split("/").slice(1).map(replaceDerive).map((el) => parseInt(el, 10)).reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), {
		key,
		chainCode
	});
};
//#endregion
//#region src/lib/pages/ed25519-address-generation/Ed25519AddressGeneration.svelte
var root = from_html(`<main><div class="svelte-1wkjlsv">For development purposes only, never use with real funds!</div> <br/> <button class="svelte-1wkjlsv">Generate new</button> <button class="svelte-1wkjlsv">Generate new short (&#60;130 chars)</button> <input id="mnemonic" type="string" size="140" placeholder="24 word BIP-39 mnemonic. For development purposes only, never use with real funds!" class="svelte-1wkjlsv"/> <br/> BIP 44 path: <input id="coinType" type="number" list="coinTypes" placeholder="BIP-44 coin type" class="svelte-1wkjlsv"/> <datalist id="coinTypes"><option>IOTA</option><option>Shimmer</option><option>Testnet</option></datalist> <input id="accountIndex" type="number" min="0" placeholder="account index" class="svelte-1wkjlsv"/> <select id="change" class="svelte-1wkjlsv"><option>0</option><option>1</option></select> <input id="addressIndex" type="number" width="1" min="0" placeholder="address index" class="svelte-1wkjlsv"/> <br/> <div class="svelte-1wkjlsv">Insert anything and it will generate/convert what's possible:</div> <div class="svelte-1wkjlsv"><label for="mnemonicEntropy" class="svelte-1wkjlsv">Mnemonic entropy:</label> <input id="mnemonicEntropy" type="string" size="70" placeholder="hex mnemonic entropy" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><label for="seed" class="svelte-1wkjlsv">Seed:</label> <input id="seed" type="string" size="130" placeholder="hex seed" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><label for="privateKeyBech32" class="svelte-1wkjlsv">Private key bech32:</label> <input id="privateKeyBech32" type="string" size="75" placeholder="bech32 iotaprivkey" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><label for="privateKeyHex" class="svelte-1wkjlsv">Private key hex:</label> <input id="privateKeyHex" type="string" size="70" placeholder="hex Ed25519 private key" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><label for="publicKeyBase64" class="svelte-1wkjlsv">Public key base64:</label> <input id="publicKeyBase64" type="string" size="70" placeholder="base64 Ed25519 public key" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><label for="publicKey" class="svelte-1wkjlsv">Public key:</label> <input id="publicKey" type="string" size="70" placeholder="hex Ed25519 public key" class="svelte-1wkjlsv"/></div> <div class="svelte-1wkjlsv"><span class="label svelte-1wkjlsv">Address:</span> <span style="text-align: left;" class="svelte-1wkjlsv"> </span></div> <br/> </main>`);
function Ed25519AddressGeneration($$anchor, $$props) {
	push($$props, false);
	const IOTA_BIP44_COIN_TYPE = 4218;
	const SHIMMER_BIP44_COIN_TYPE = 4219;
	const TESTNET_BIP44_COIN_TYPE = 1;
	let coinType = mutable_source(IOTA_BIP44_COIN_TYPE);
	let accountIndex = mutable_source(0);
	let change = mutable_source(0);
	let addressIndex = mutable_source(0);
	let mnemonic = mutable_source("");
	let mnemonicEntropy = mutable_source("");
	let seed = mutable_source("");
	let privateKeyBech32 = mutable_source("");
	let privateKeyHex = mutable_source("");
	let publicKeyBase64 = mutable_source("");
	let publicKey = mutable_source("");
	let address = mutable_source("");
	let error = mutable_source("");
	const generate = () => {
		tryCatch(generateInner);
	};
	const generateInner = () => {
		set(mnemonic, generateMnemonic(wordlist, 256));
		generateAddressFromMnemonic();
	};
	const generateShort = () => {
		tryCatch(generateShortInner);
	};
	const generateShortInner = () => {
		set(mnemonic, "");
		while (get(mnemonic).length == 0 || get(mnemonic).length > 129) set(mnemonic, generateMnemonic(wordlist, 256));
		generateAddressFromMnemonic();
	};
	const generateFromEntropy = () => {
		tryCatch(generateFromEntropyInner);
	};
	const generateFromEntropyInner = () => {
		set(mnemonic, entropyToMnemonic(fromHex(get(mnemonicEntropy)), wordlist));
		generateSeedAndAddress();
	};
	const generateAddressFromMnemonic = () => {
		tryCatch(generateAddressFromMnemonicInner);
	};
	const generateAddressFromMnemonicInner = () => {
		set(mnemonicEntropy, toHex(mnemonicToEntropy(get(mnemonic), wordlist)));
		generateSeedAndAddress();
	};
	const generateSeedAndAddress = () => {
		tryCatch(generateSeedAndAddressInner);
	};
	const generateSeedAndAddressInner = () => {
		set(seed, toHex(mnemonicToSeedSync(get(mnemonic), "")));
		generateAddressFromSeed();
	};
	const generateAddressFromSeed = () => {
		tryCatch(generateAddressFromSeedInner);
	};
	const generateAddressFromSeedInner = () => {
		let keyPair = deriveKeypairFromSeed(get(seed), `m/44'/${get(coinType)}'/${get(accountIndex)}'/${get(change)}'/${get(addressIndex)}'`);
		set(privateKeyBech32, keyPair.getSecretKey());
		set(privateKeyHex, toHex(keyPair.keypair.secretKey.slice(0, 32)));
		generatePublicKey(keyPair);
	};
	const generateKeysfromHexPrivateKey = () => {
		tryCatch(generateKeysfromHexPrivateKeyInner);
	};
	const generateKeysfromHexPrivateKeyInner = () => {
		let keyPair = Ed25519Keypair.fromSecretKey(fromHex(get(privateKeyHex)));
		set(privateKeyBech32, keyPair.getSecretKey());
		generatePublicKey(keyPair);
	};
	const generateKeysFromBech32PrivateKey = () => {
		tryCatch(generateKeysFromBech32PrivateKeyInner);
	};
	const generateKeysFromBech32PrivateKeyInner = () => {
		const { schema, secretKey } = decodeIotaPrivateKey(get(privateKeyBech32));
		if (schema != "ED25519") throw "unsupported schema: " + schema;
		const keyPair = Ed25519Keypair.fromSecretKey(secretKey);
		set(privateKeyHex, toHex(keyPair.keypair.secretKey.slice(0, 32)));
		generatePublicKey(keyPair);
	};
	const generatePublicKey = (keyPair) => {
		set(error, "");
		try {
			set(publicKeyBase64, toBase64(keyPair.getPublicKey().toRawBytes()));
			set(publicKey, toHex(keyPair.getPublicKey().toRawBytes()));
			set(address, keyPair.getPublicKey().toIotaAddress());
		} catch (err) {
			try {
				set(error, JSON.stringify(JSON.parse(err.message).payload.error));
			} catch (e) {
				set(error, err);
			}
		}
	};
	const addressFromPublicKeyBase64 = () => {
		tryCatch(addressFromPublicKeyBase64Inner);
	};
	const addressFromPublicKeyBase64Inner = () => {
		let bytes = fromBase64(get(publicKeyBase64));
		if (bytes.length == 33) bytes = bytes.slice(1);
		set(publicKey, toHex(bytes));
		set(address, new Ed25519PublicKey(bytes).toIotaAddress());
	};
	const addressFromPublicKey = () => {
		tryCatch(addressFromPublicKeyInner);
	};
	const addressFromPublicKeyInner = () => {
		let bytes = fromHex(get(publicKey));
		set(publicKeyBase64, toBase64(bytes));
		set(address, new Ed25519PublicKey(bytes).toIotaAddress());
	};
	const tryCatch = (fn) => {
		set(error, "");
		try {
			fn();
		} catch (err) {
			try {
				set(error, JSON.stringify(JSON.parse(err.message).payload.error));
			} catch (e) {
				set(error, err);
			}
		}
	};
	function deriveKeypairFromSeed(seedHex, path) {
		const { key } = derivePath(path, seedHex);
		return Ed25519Keypair.fromSecretKey(key);
	}
	init();
	var main = root();
	var button = sibling(child(main), 4);
	var button_1 = sibling(button, 2);
	var input = sibling(button_1, 2);
	remove_input_defaults(input);
	var input_1 = sibling(input, 4);
	remove_input_defaults(input_1);
	var datalist = sibling(input_1, 2);
	var option = child(datalist);
	option.value = option.__value = IOTA_BIP44_COIN_TYPE;
	var option_1 = sibling(option);
	option_1.value = option_1.__value = SHIMMER_BIP44_COIN_TYPE;
	var option_2 = sibling(option_1);
	option_2.value = option_2.__value = TESTNET_BIP44_COIN_TYPE;
	reset(datalist);
	var input_2 = sibling(datalist, 2);
	remove_input_defaults(input_2);
	var select = sibling(input_2, 2);
	var option_3 = child(select);
	option_3.value = option_3.__value = 0;
	var option_4 = sibling(option_3);
	option_4.value = option_4.__value = 1;
	reset(select);
	var input_3 = sibling(select, 2);
	remove_input_defaults(input_3);
	var div = sibling(input_3, 6);
	var input_4 = sibling(child(div), 2);
	remove_input_defaults(input_4);
	reset(div);
	var div_1 = sibling(div, 2);
	var input_5 = sibling(child(div_1), 2);
	remove_input_defaults(input_5);
	reset(div_1);
	var div_2 = sibling(div_1, 2);
	var input_6 = sibling(child(div_2), 2);
	remove_input_defaults(input_6);
	reset(div_2);
	var div_3 = sibling(div_2, 2);
	var input_7 = sibling(child(div_3), 2);
	remove_input_defaults(input_7);
	reset(div_3);
	var div_4 = sibling(div_3, 2);
	var input_8 = sibling(child(div_4), 2);
	remove_input_defaults(input_8);
	reset(div_4);
	var div_5 = sibling(div_4, 2);
	var input_9 = sibling(child(div_5), 2);
	remove_input_defaults(input_9);
	reset(div_5);
	var div_6 = sibling(div_5, 2);
	var span = sibling(child(div_6), 2);
	var text = child(span);
	reset(span);
	reset(div_6);
	var text_1 = sibling(div_6, 3);
	reset(main);
	template_effect(() => {
		set_text(text, ` ${get(address) ?? ""}`);
		set_text(text_1, ` ${get(error) ?? ""}`);
	});
	event("click", button, () => generate());
	event("click", button_1, () => generateShort());
	bind_value(input, () => get(mnemonic), ($$value) => set(mnemonic, $$value));
	event("input", input, () => generateAddressFromMnemonic());
	bind_value(input_1, () => get(coinType), ($$value) => set(coinType, $$value));
	event("input", input_1, () => generateAddressFromSeed());
	bind_value(input_2, () => get(accountIndex), ($$value) => set(accountIndex, $$value));
	event("input", input_2, () => generateAddressFromSeed());
	bind_select_value(select, () => get(change), ($$value) => set(change, $$value));
	event("input", select, () => generateAddressFromSeed());
	bind_value(input_3, () => get(addressIndex), ($$value) => set(addressIndex, $$value));
	event("input", input_3, () => generateAddressFromSeed());
	bind_value(input_4, () => get(mnemonicEntropy), ($$value) => set(mnemonicEntropy, $$value));
	event("input", input_4, () => generateFromEntropy());
	bind_value(input_5, () => get(seed), ($$value) => set(seed, $$value));
	event("input", input_5, () => generateAddressFromSeed());
	bind_value(input_6, () => get(privateKeyBech32), ($$value) => set(privateKeyBech32, $$value));
	event("input", input_6, () => generateKeysFromBech32PrivateKey());
	bind_value(input_7, () => get(privateKeyHex), ($$value) => set(privateKeyHex, $$value));
	event("input", input_7, () => generateKeysfromHexPrivateKey());
	bind_value(input_8, () => get(publicKeyBase64), ($$value) => set(publicKeyBase64, $$value));
	event("input", input_8, () => addressFromPublicKeyBase64());
	bind_value(input_9, () => get(publicKey), ($$value) => set(publicKey, $$value));
	event("input", input_9, () => addressFromPublicKey());
	append($$anchor, main);
	pop();
}
//#endregion
export { Ed25519AddressGeneration as default };

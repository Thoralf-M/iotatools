import { E as createHasher, M as swap32IfBE, N as swap8IfBE, P as u32, S as aoutput, T as clean, c as fromBig, d as rotrBH, f as rotrBL, l as rotr32H, m as rotrSL, n as add3H, p as rotrSH, r as add3L, t as add, u as rotr32L, v as abytes, x as anumber, y as aexists } from "./_u64-Dkyx1UQH.js";
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/_blake.js
/**
* Internal blake permutation table.
* Rows `0..9` serve BLAKE2s, rows `0..11` serve BLAKE2b with `10..11 = 0..1`, and Blake1 also
* reuses the later rows shown below. Blake1 expands rounds `10..15` as `SIGMA[i % 10]`, so rows
* `10..15` intentionally repeat rows `0..5` for the 14-round (256) and 16-round (512) variants.
*/
var BSIGMA = /* @__PURE__ */ Uint8Array.from([
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
//#endregion
//#region node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/blake2.js
/**
* blake2b (64-bit) & blake2s (8 to 32-bit) hash functions.
* b could have been faster, but there is no fast u64 in js, so s is 1.5x faster.
* @module
*/
var B2B_IV = /* @__PURE__ */ Uint32Array.from([
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
var BBUF = /* @__PURE__ */ new Uint32Array(32);
function G1b(a, b, c, d, msg, x) {
	const Xl = msg[x], Xh = msg[x + 1];
	let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
	let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
	let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
	let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
	let ll = add3L(Al, Bl, Xl);
	Ah = add3H(ll, Ah, Bh, Xh);
	Al = ll | 0;
	({Dh, Dl} = {
		Dh: Dh ^ Ah,
		Dl: Dl ^ Al
	});
	({Dh, Dl} = {
		Dh: rotr32H(Dh, Dl),
		Dl: rotr32L(Dh, Dl)
	});
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	({Bh, Bl} = {
		Bh: Bh ^ Ch,
		Bl: Bl ^ Cl
	});
	({Bh, Bl} = {
		Bh: rotrSH(Bh, Bl, 24),
		Bl: rotrSL(Bh, Bl, 24)
	});
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
	({Dh, Dl} = {
		Dh: Dh ^ Ah,
		Dl: Dl ^ Al
	});
	({Dh, Dl} = {
		Dh: rotrSH(Dh, Dl, 16),
		Dl: rotrSL(Dh, Dl, 16)
	});
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	({Bh, Bl} = {
		Bh: Bh ^ Ch,
		Bl: Bl ^ Cl
	});
	({Bh, Bl} = {
		Bh: rotrBH(Bh, Bl, 63),
		Bl: rotrBL(Bh, Bl, 63)
	});
	BBUF[2 * a] = Al, BBUF[2 * a + 1] = Ah;
	BBUF[2 * b] = Bl, BBUF[2 * b + 1] = Bh;
	BBUF[2 * c] = Cl, BBUF[2 * c + 1] = Ch;
	BBUF[2 * d] = Dl, BBUF[2 * d + 1] = Dh;
}
function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
	anumber(keyLen);
	if (outputLen <= 0 || outputLen > keyLen) throw new Error("outputLen bigger than keyLen");
	const { key, salt, personalization } = opts;
	if (key !== void 0 && (key.length < 1 || key.length > keyLen)) throw new Error("\"key\" expected to be undefined or of length=1.." + keyLen);
	if (salt !== void 0) abytes(salt, saltLen, "salt");
	if (personalization !== void 0) abytes(personalization, persLen, "personalization");
}
/** Internal base class for BLAKE2. */
var _BLAKE2 = class {
	buffer;
	buffer32;
	finished = false;
	destroyed = false;
	length = 0;
	pos = 0;
	blockLen;
	outputLen;
	canXOF = false;
	constructor(blockLen, outputLen) {
		anumber(blockLen);
		anumber(outputLen);
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.buffer = new Uint8Array(blockLen);
		this.buffer32 = u32(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes(data);
		const { blockLen, buffer, buffer32 } = this;
		const len = data.length;
		const offset = data.byteOffset;
		const buf = data.buffer;
		for (let pos = 0; pos < len;) {
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
		if (out.byteOffset & 3) throw new RangeError("\"digestInto() output\" expected 4-byte aligned byteOffset, got " + out.byteOffset);
		const state = this.get();
		const out32 = u32(out);
		const full = Math.floor(this.outputLen / 4);
		for (let i = 0; i < full; i++) out32[i] = swap8IfBE(state[i]);
		const tail = this.outputLen % 4;
		if (!tail) return;
		const off = full * 4;
		const word = state[full];
		for (let i = 0; i < tail; i++) out[off + i] = word >>> 8 * i;
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
		to ||= new this.constructor({ dkLen: outputLen });
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
};
/** Internal blake2b hash class with state stored as LE u32 low/high halves. */
var _BLAKE2b = class extends _BLAKE2 {
	v0l = B2B_IV[0] | 0;
	v0h = B2B_IV[1] | 0;
	v1l = B2B_IV[2] | 0;
	v1h = B2B_IV[3] | 0;
	v2l = B2B_IV[4] | 0;
	v2h = B2B_IV[5] | 0;
	v3l = B2B_IV[6] | 0;
	v3h = B2B_IV[7] | 0;
	v4l = B2B_IV[8] | 0;
	v4h = B2B_IV[9] | 0;
	v5l = B2B_IV[10] | 0;
	v5h = B2B_IV[11] | 0;
	v6l = B2B_IV[12] | 0;
	v6h = B2B_IV[13] | 0;
	v7l = B2B_IV[14] | 0;
	v7h = B2B_IV[15] | 0;
	constructor(opts = {}) {
		const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
		super(128, olen);
		checkBlake2Opts(olen, opts, 64, 16, 16);
		let { key, personalization, salt } = opts;
		let keyLength = 0;
		if (key !== void 0) {
			abytes(key, void 0, "key");
			keyLength = key.length;
		}
		this.v0l ^= this.outputLen | keyLength << 8 | 16842752;
		if (salt !== void 0) {
			abytes(salt, void 0, "salt");
			const slt = u32(salt);
			this.v4l ^= swap8IfBE(slt[0]);
			this.v4h ^= swap8IfBE(slt[1]);
			this.v5l ^= swap8IfBE(slt[2]);
			this.v5h ^= swap8IfBE(slt[3]);
		}
		if (personalization !== void 0) {
			abytes(personalization, void 0, "personalization");
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
	get() {
		let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
		return [
			v0l,
			v0h,
			v1l,
			v1h,
			v2l,
			v2h,
			v3l,
			v3h,
			v4l,
			v4h,
			v5l,
			v5h,
			v6l,
			v6h,
			v7l,
			v7h
		];
	}
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
};
/**
* Blake2b hash function. 64-bit. 1.5x slower than blake2s in JS.
* @param msg - message that would be hashed
* @param opts - Optional output, MAC, salt, and personalization settings.
*   `dkLen` must be 1..64 bytes; `salt` and `personalization`, if present,
*   must be 16 bytes each. See {@link Blake2Opts}.
* @returns Digest bytes.
* @example
* Hash a message with Blake2b.
* ```ts
* blake2b(new Uint8Array([97, 98, 99]));
* ```
*/
var blake2b = /* @__PURE__ */ createHasher((opts) => new _BLAKE2b(opts));
//#endregion
export { blake2b as t };

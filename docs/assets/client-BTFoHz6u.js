import { Ct as get, K as active_effect, Tt as writable, X as set_active_effect, Z as set_active_reaction, et as effect_root, q as active_reaction, rt as render_effect } from "./disclose-version-CpEJO7r1.js";
import { A as createHasher, B as isValidIotaAddress, C as Field, D as bytesToHex, E as abytes, G as normalizeStructTag, H as isValidTransactionDigest, I as SIGNATURE_SCHEME_TO_FLAG, J as isSerializedBcs, K as parseStructTag, L as iotaBcs, M as hexToBytes, N as rotl, O as clean, P as utf8ToBytes, Q as toBase64, R as Address, S as HashMD, T as pow2, U as normalizeIotaAddress, V as isValidIotaObjectId, W as normalizeIotaObjectId, X as toHex, Z as fromBase64, _ as secp256r1, a as decodeIotaPrivateKey, b as sha256, c as mnemonicToSeed, et as toBase58, f as PublicKey, g as sha256$1, h as blake2b, i as Signer, j as createView, k as concatBytes, l as parseSerializedSignature, o as encodeIotaPrivateKey, p as bytesEqual, q as bcs, r as Keypair, s as isValidBIP32Path, t as Ed25519Keypair, tt as createBase58check, v as createCurve, w as mod, x as sha512, y as hmac, z as TypeTagSerializer } from "./keypair-DsT3ivIR.js";
//#region node_modules/.pnpm/svelte@5.56.6/node_modules/svelte/src/store/index-client.js
/** @import { Readable, Writable } from './public.js' */
/**
* @template V
* @overload
* @param {() => V} get
* @param {(v: V) => void} set
* @returns {Writable<V>}
*/
/**
* @template V
* @overload
* @param {() => V} get
* @returns {Readable<V>}
*/
/**
* Create a store from a function that returns state, and (to make a writable store), an
* optional second function that sets state.
*
* ```ts
* import { toStore } from 'svelte/store';
*
* let count = $state(0);
*
* const store = toStore(() => count, (v) => (count = v));
* ```
* @template V
* @param {() => V} get
* @param {(v: V) => void} [set]
* @returns {Writable<V> | Readable<V>}
*/
function toStore(get, set) {
	var effect = active_effect;
	var reaction = active_reaction;
	var init_value = get();
	const store = writable(init_value, (set) => {
		var ran = init_value !== get();
		var teardown;
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(reaction);
		set_active_effect(effect);
		try {
			teardown = effect_root(() => {
				render_effect(() => {
					const value = get();
					if (ran) set(value);
				});
			});
		} finally {
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
		ran = true;
		return teardown;
	});
	if (set) return {
		set,
		update: (fn) => set(fn(get())),
		subscribe: store.subscribe
	};
	return { subscribe: store.subscribe };
}
//#endregion
//#region src/lib/utils/default-client-config.ts
var defaultClientConfig = {
	selected: "mainnet",
	networks: [
		{
			name: "mainnet",
			node: "https://api.mainnet.iota.cafe",
			indexer: "https://indexer.mainnet.iota.cafe",
			graphql: "https://graphql.mainnet.iota.cafe",
			explorer: "https://explorer.iota.org"
		},
		{
			name: "localnet",
			node: "http://127.0.0.1:9000",
			indexer: "http://127.0.0.1:9124",
			graphql: "http://127.0.0.1:9125",
			explorer: "https://explorer.iota.org",
			faucet: "http://127.0.0.1:9123/gas"
		},
		{
			name: "testnet",
			node: "https://api.testnet.iota.cafe",
			indexer: "https://indexer.testnet.iota.cafe",
			graphql: "https://graphql.testnet.iota.cafe",
			explorer: "https://explorer.iota.org",
			faucet: "https://faucet.testnet.iota.cafe/gas"
		},
		{
			name: "devnet",
			node: "https://api.devnet.iota.cafe",
			indexer: "https://indexer.devnet.iota.cafe",
			graphql: "https://graphql.devnet.iota.cafe",
			explorer: "https://explorer.iota.org",
			faucet: "https://faucet.devnet.iota.cafe/gas"
		}
	]
};
function verifyClientConfig(value) {
	if (typeof value !== "object" || value === null) throw new Error("Config is not an object");
	if (typeof value.selected !== "string") throw new Error("Config.selected is not a string");
	if (!Array.isArray(value.networks)) throw new Error("Config.networks is not an array");
	for (const [i, network] of value.networks.entries()) {
		if (typeof network.name !== "string") throw new Error(`Config.networks[${i}].name is not a string`);
		if (typeof network.node !== "string") throw new Error(`Config.networks[${i}].node is not a string`);
		if (typeof network.indexer !== "string") throw new Error(`Config.networks[${i}].indexer is not a string`);
		if (typeof network.graphql !== "string") throw new Error(`Config.networks[${i}].graphql is not a string`);
		if (typeof network.explorer !== "string") throw new Error(`Config.networks[${i}].explorer is not a string`);
		if (network.faucet && typeof network.faucet !== "string") throw new Error(`Config.networks[${i}].faucet is not a string`);
	}
	return true;
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/bcs/pure.js
function pureBcsSchemaFromTypeName(name) {
	switch (name) {
		case "u8": return bcs.u8();
		case "u16": return bcs.u16();
		case "u32": return bcs.u32();
		case "u64": return bcs.u64();
		case "u128": return bcs.u128();
		case "u256": return bcs.u256();
		case "bool": return bcs.bool();
		case "string": return bcs.string();
		case "id":
		case "address": return Address;
	}
	const generic = name.match(/^(vector|option)<(.+)>$/);
	if (generic) {
		const [kind, inner] = generic.slice(1);
		if (kind === "vector") return bcs.vector(pureBcsSchemaFromTypeName(inner));
		else return bcs.option(pureBcsSchemaFromTypeName(inner));
	}
	throw new Error(`Invalid Pure type name: ${name}`);
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/secp256k1.js
/**
* SECG secp256k1. See [pdf](https://www.secg.org/sec2-v2.pdf).
*
* Belongs to Koblitz curves: it has efficiently-computable GLV endomorphism ψ,
* check out {@link EndomorphismOpts}. Seems to be rigid (not backdoored).
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1_CURVE = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
};
var _2n = /* @__PURE__ */ BigInt(2);
/**
* √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
* (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
*/
function sqrtMod(y) {
	const P = secp256k1_CURVE.p;
	const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
	const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
	const b2 = y * y * y % P;
	const b3 = b2 * b2 * y % P;
	const b11 = pow2(pow2(pow2(b3, _3n, P) * b3 % P, _3n, P) * b3 % P, _2n, P) * b2 % P;
	const b22 = pow2(b11, _11n, P) * b11 % P;
	const b44 = pow2(b22, _22n, P) * b22 % P;
	const b88 = pow2(b44, _44n, P) * b44 % P;
	const root = pow2(pow2(pow2(pow2(pow2(pow2(b88, _88n, P) * b88 % P, _44n, P) * b44 % P, _3n, P) * b3 % P, _23n, P) * b22 % P, _6n, P) * b2 % P, _2n, P);
	if (!Fpk1.eql(Fpk1.sqr(root), y)) throw new Error("Cannot find square root");
	return root;
}
var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
/**
* secp256k1 curve, ECDSA and ECDH methods.
*
* Field: `2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n`
*
* @example
* ```js
* import { secp256k1 } from '@noble/curves/secp256k1';
* const { secretKey, publicKey } = secp256k1.keygen();
* const msg = new TextEncoder().encode('hello');
* const sig = secp256k1.sign(msg, secretKey);
* const isValid = secp256k1.verify(sig, msg, publicKey) === true;
* ```
*/
var secp256k1 = createCurve({
	...secp256k1_CURVE,
	Fp: Fpk1,
	lowS: true,
	endo: secp256k1_ENDO
}, sha256);
//#endregion
//#region node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/legacy.js
/**

SHA1 (RFC 3174), MD5 (RFC 1321) and RIPEMD160 (RFC 2286) legacy, weak hash functions.
Don't use them in a new protocol. What "weak" means:

- Collisions can be made with 2^18 effort in MD5, 2^60 in SHA1, 2^80 in RIPEMD160.
- No practical pre-image attacks (only theoretical, 2^123.4)
- HMAC seems kinda ok: https://datatracker.ietf.org/doc/html/rfc6151
* @module
*/
var Rho160 = /* @__PURE__ */ Uint8Array.from([
	7,
	4,
	13,
	1,
	10,
	6,
	15,
	3,
	12,
	0,
	9,
	5,
	2,
	14,
	11,
	8
]);
var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
var idxLR = /* @__PURE__ */ (() => {
	const res = [[Id160], [Pi160]];
	for (let i = 0; i < 4; i++) for (let j of res) j.push(j[i].map((k) => Rho160[k]));
	return res;
})();
var idxL = /* @__PURE__ */ (() => idxLR[0])();
var idxR = /* @__PURE__ */ (() => idxLR[1])();
var shifts160 = /* @__PURE__ */ [
	[
		11,
		14,
		15,
		12,
		5,
		8,
		7,
		9,
		11,
		13,
		14,
		15,
		6,
		7,
		9,
		8
	],
	[
		12,
		13,
		11,
		15,
		6,
		9,
		9,
		7,
		12,
		15,
		11,
		13,
		7,
		8,
		7,
		7
	],
	[
		13,
		15,
		14,
		11,
		7,
		7,
		6,
		8,
		13,
		14,
		13,
		12,
		5,
		5,
		6,
		9
	],
	[
		14,
		11,
		12,
		14,
		8,
		6,
		5,
		5,
		15,
		12,
		15,
		14,
		9,
		9,
		8,
		6
	],
	[
		15,
		12,
		13,
		13,
		9,
		5,
		8,
		6,
		14,
		11,
		12,
		11,
		8,
		6,
		5,
		5
	]
].map((i) => Uint8Array.from(i));
var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
var Kl160 = /* @__PURE__ */ Uint32Array.from([
	0,
	1518500249,
	1859775393,
	2400959708,
	2840853838
]);
var Kr160 = /* @__PURE__ */ Uint32Array.from([
	1352829926,
	1548603684,
	1836072691,
	2053994217,
	0
]);
function ripemd_f(group, x, y, z) {
	if (group === 0) return x ^ y ^ z;
	if (group === 1) return x & y | ~x & z;
	if (group === 2) return (x | ~y) ^ z;
	if (group === 3) return x & z | y & ~z;
	return x ^ (y | ~z);
}
var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
var RIPEMD160 = class extends HashMD {
	constructor() {
		super(64, 20, 8, true);
		this.h0 = 1732584193;
		this.h1 = -271733879;
		this.h2 = -1732584194;
		this.h3 = 271733878;
		this.h4 = -1009589776;
	}
	get() {
		const { h0, h1, h2, h3, h4 } = this;
		return [
			h0,
			h1,
			h2,
			h3,
			h4
		];
	}
	set(h0, h1, h2, h3, h4) {
		this.h0 = h0 | 0;
		this.h1 = h1 | 0;
		this.h2 = h2 | 0;
		this.h3 = h3 | 0;
		this.h4 = h4 | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) BUF_160[i] = view.getUint32(offset, true);
		let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
		for (let group = 0; group < 5; group++) {
			const rGroup = 4 - group;
			const hbl = Kl160[group], hbr = Kr160[group];
			const rl = idxL[group], rr = idxR[group];
			const sl = shiftsL160[group], sr = shiftsR160[group];
			for (let i = 0; i < 16; i++) {
				const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
				al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
			}
			for (let i = 0; i < 16; i++) {
				const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
				ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
			}
		}
		this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
	}
	roundClean() {
		clean(BUF_160);
	}
	destroy() {
		this.destroyed = true;
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0);
	}
};
/**
* RIPEMD-160 - a legacy hash function from 1990s.
* * https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
* * https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
*/
var ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());
//#endregion
//#region node_modules/.pnpm/@scure+bip32@1.7.0/node_modules/@scure/bip32/lib/esm/index.js
/**
* @module BIP32 hierarchical deterministic (HD) wallets over secp256k1.
* @example
* ```js
* import { HDKey } from "@scure/bip32";
* const hdkey1 = HDKey.fromMasterSeed(seed);
* const hdkey2 = HDKey.fromExtendedKey(base58key);
* const hdkey3 = HDKey.fromJSON({ xpriv: string });
*
* // props
* [hdkey1.depth, hdkey1.index, hdkey1.chainCode];
* console.log(hdkey2.privateKey, hdkey2.publicKey);
* console.log(hdkey3.derive("m/0/2147483647'/1"));
* const sig = hdkey3.sign(hash);
* hdkey3.verify(hash, sig);
* ```
*/
/*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
var Point = secp256k1.ProjectivePoint;
var base58check = createBase58check(sha256);
function bytesToNumber(bytes) {
	abytes(bytes);
	const h = bytes.length === 0 ? "0" : bytesToHex(bytes);
	return BigInt("0x" + h);
}
function numberToBytes(num) {
	if (typeof num !== "bigint") throw new Error("bigint expected");
	return hexToBytes(num.toString(16).padStart(64, "0"));
}
var MASTER_SECRET = utf8ToBytes("Bitcoin seed");
var BITCOIN_VERSIONS = {
	private: 76066276,
	public: 76067358
};
var HARDENED_OFFSET = 2147483648;
var hash160 = (data) => ripemd160(sha256(data));
var fromU32 = (data) => createView(data).getUint32(0, false);
var toU32 = (n) => {
	if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) throw new Error("invalid number, should be from 0 to 2**32-1, got " + n);
	const buf = /* @__PURE__ */ new Uint8Array(4);
	createView(buf).setUint32(0, n, false);
	return buf;
};
var HDKey = class HDKey {
	get fingerprint() {
		if (!this.pubHash) throw new Error("No publicKey set!");
		return fromU32(this.pubHash);
	}
	get identifier() {
		return this.pubHash;
	}
	get pubKeyHash() {
		return this.pubHash;
	}
	get privateKey() {
		return this.privKeyBytes || null;
	}
	get publicKey() {
		return this.pubKey || null;
	}
	get privateExtendedKey() {
		const priv = this.privateKey;
		if (!priv) throw new Error("No private key");
		return base58check.encode(this.serialize(this.versions.private, concatBytes(new Uint8Array([0]), priv)));
	}
	get publicExtendedKey() {
		if (!this.pubKey) throw new Error("No public key");
		return base58check.encode(this.serialize(this.versions.public, this.pubKey));
	}
	static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
		abytes(seed);
		if (8 * seed.length < 128 || 8 * seed.length > 512) throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
		const I = hmac(sha512, MASTER_SECRET, seed);
		return new HDKey({
			versions,
			chainCode: I.slice(32),
			privateKey: I.slice(0, 32)
		});
	}
	static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
		const keyBuffer = base58check.decode(base58key);
		const keyView = createView(keyBuffer);
		const version = keyView.getUint32(0, false);
		const opt = {
			versions,
			depth: keyBuffer[4],
			parentFingerprint: keyView.getUint32(5, false),
			index: keyView.getUint32(9, false),
			chainCode: keyBuffer.slice(13, 45)
		};
		const key = keyBuffer.slice(45);
		const isPriv = key[0] === 0;
		if (version !== versions[isPriv ? "private" : "public"]) throw new Error("Version mismatch");
		if (isPriv) return new HDKey({
			...opt,
			privateKey: key.slice(1)
		});
		else return new HDKey({
			...opt,
			publicKey: key
		});
	}
	static fromJSON(json) {
		return HDKey.fromExtendedKey(json.xpriv);
	}
	constructor(opt) {
		this.depth = 0;
		this.index = 0;
		this.chainCode = null;
		this.parentFingerprint = 0;
		if (!opt || typeof opt !== "object") throw new Error("HDKey.constructor must not be called directly");
		this.versions = opt.versions || BITCOIN_VERSIONS;
		this.depth = opt.depth || 0;
		this.chainCode = opt.chainCode || null;
		this.index = opt.index || 0;
		this.parentFingerprint = opt.parentFingerprint || 0;
		if (!this.depth) {
			if (this.parentFingerprint || this.index) throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
		}
		if (opt.publicKey && opt.privateKey) throw new Error("HDKey: publicKey and privateKey at same time.");
		if (opt.privateKey) {
			if (!secp256k1.utils.isValidPrivateKey(opt.privateKey)) throw new Error("Invalid private key");
			this.privKey = typeof opt.privateKey === "bigint" ? opt.privateKey : bytesToNumber(opt.privateKey);
			this.privKeyBytes = numberToBytes(this.privKey);
			this.pubKey = secp256k1.getPublicKey(opt.privateKey, true);
		} else if (opt.publicKey) this.pubKey = Point.fromHex(opt.publicKey).toRawBytes(true);
		else throw new Error("HDKey: no public or private key provided");
		this.pubHash = hash160(this.pubKey);
	}
	derive(path) {
		if (!/^[mM]'?/.test(path)) throw new Error("Path must start with \"m\" or \"M\"");
		if (/^[mM]'?$/.test(path)) return this;
		const parts = path.replace(/^[mM]'?\//, "").split("/");
		let child = this;
		for (const c of parts) {
			const m = /^(\d+)('?)$/.exec(c);
			const m1 = m && m[1];
			if (!m || m.length !== 3 || typeof m1 !== "string") throw new Error("invalid child index: " + c);
			let idx = +m1;
			if (!Number.isSafeInteger(idx) || idx >= 2147483648) throw new Error("Invalid index");
			if (m[2] === "'") idx += HARDENED_OFFSET;
			child = child.deriveChild(idx);
		}
		return child;
	}
	deriveChild(index) {
		if (!this.pubKey || !this.chainCode) throw new Error("No publicKey or chainCode set");
		let data = toU32(index);
		if (index >= 2147483648) {
			const priv = this.privateKey;
			if (!priv) throw new Error("Could not derive hardened child key");
			data = concatBytes(new Uint8Array([0]), priv, data);
		} else data = concatBytes(this.pubKey, data);
		const I = hmac(sha512, this.chainCode, data);
		const childTweak = bytesToNumber(I.slice(0, 32));
		const chainCode = I.slice(32);
		if (!secp256k1.utils.isValidPrivateKey(childTweak)) throw new Error("Tweak bigger than curve order");
		const opt = {
			versions: this.versions,
			chainCode,
			depth: this.depth + 1,
			parentFingerprint: this.fingerprint,
			index
		};
		try {
			if (this.privateKey) {
				const added = mod(this.privKey + childTweak, secp256k1.CURVE.n);
				if (!secp256k1.utils.isValidPrivateKey(added)) throw new Error("The tweak was out of range or the resulted private key is invalid");
				opt.privateKey = added;
			} else {
				const added = Point.fromHex(this.pubKey).add(Point.fromPrivateKey(childTweak));
				if (added.equals(Point.ZERO)) throw new Error("The tweak was equal to negative P, which made the result key invalid");
				opt.publicKey = added.toRawBytes(true);
			}
			return new HDKey(opt);
		} catch (err) {
			return this.deriveChild(index + 1);
		}
	}
	sign(hash) {
		if (!this.privateKey) throw new Error("No privateKey set!");
		abytes(hash, 32);
		return secp256k1.sign(hash, this.privKey).toCompactRawBytes();
	}
	verify(hash, signature) {
		abytes(hash, 32);
		abytes(signature, 64);
		if (!this.publicKey) throw new Error("No publicKey set!");
		let sig;
		try {
			sig = secp256k1.Signature.fromCompact(signature);
		} catch (error) {
			return false;
		}
		return secp256k1.verify(sig, hash, this.publicKey);
	}
	wipePrivateData() {
		this.privKey = void 0;
		if (this.privKeyBytes) {
			this.privKeyBytes.fill(0);
			this.privKeyBytes = void 0;
		}
		return this;
	}
	toJSON() {
		return {
			xpriv: this.privateExtendedKey,
			xpub: this.publicExtendedKey
		};
	}
	serialize(version, key) {
		if (!this.chainCode) throw new Error("No chainCode set");
		abytes(key, 33);
		return concatBytes(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/keypairs/secp256k1/publickey.js
var SECP256K1_PUBLIC_KEY_SIZE = 33;
var Secp256k1PublicKey = class extends PublicKey {
	/**
	* Create a new Secp256k1PublicKey object
	* @param value secp256k1 public key as buffer or base-64 encoded string
	*/
	constructor(value) {
		super();
		if (typeof value === "string") this.data = fromBase64(value);
		else if (value instanceof Uint8Array) this.data = value;
		else this.data = Uint8Array.from(value);
		if (this.data.length !== SECP256K1_PUBLIC_KEY_SIZE) throw new Error(`Invalid public key input. Expected ${SECP256K1_PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`);
	}
	/**
	* Checks if two Secp256k1 public keys are equal
	*/
	equals(publicKey) {
		return super.equals(publicKey);
	}
	/**
	* Return the byte array representation of the Secp256k1 public key
	*/
	toRawBytes() {
		return this.data;
	}
	/**
	* Return the IOTA address associated with this Secp256k1 public key
	*/
	flag() {
		return SIGNATURE_SCHEME_TO_FLAG["Secp256k1"];
	}
	/**
	* Verifies that the signature is valid for the provided message
	*/
	async verify(message, signature) {
		let bytes;
		if (typeof signature === "string") {
			const parsed = parseSerializedSignature(signature);
			if (parsed.signatureScheme !== "Secp256k1") throw new Error("Invalid signature scheme");
			if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) throw new Error("Signature does not match public key");
			bytes = parsed.signature;
		} else bytes = signature;
		return secp256k1.verify(secp256k1.Signature.fromCompact(bytes), sha256$1(message), this.toRawBytes());
	}
};
Secp256k1PublicKey.SIZE = SECP256K1_PUBLIC_KEY_SIZE;
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/keypairs/secp256k1/keypair.js
var DEFAULT_SECP256K1_DERIVATION_PATH = "m/54'/4218'/0'/0/0";
var Secp256k1Keypair = class Secp256k1Keypair extends Keypair {
	/**
	* Create a new keypair instance.
	* Generate random keypair if no {@link Secp256k1Keypair} is provided.
	*
	* @param keypair secp256k1 keypair
	*/
	constructor(keypair) {
		super();
		if (keypair) this.keypair = keypair;
		else {
			const secretKey = secp256k1.utils.randomPrivateKey();
			const publicKey = secp256k1.getPublicKey(secretKey, true);
			this.keypair = {
				publicKey,
				secretKey
			};
		}
	}
	/**
	* Get the key scheme of the keypair Secp256k1
	*/
	getKeyScheme() {
		return "Secp256k1";
	}
	/**
	* Generate a new random keypair
	*/
	static generate() {
		return new Secp256k1Keypair();
	}
	/**
	* Create a keypair from a raw secret key byte array.
	*
	* This method should only be used to recreate a keypair from a previously
	* generated secret key. Generating keypairs from a random seed should be done
	* with the {@link Keypair.fromSeed} method.
	*
	* @throws error if the provided secret key is invalid and validation is not skipped.
	*
	* @param secretKey secret key byte array  or Bech32 secret key string
	* @param options: skip secret key validation
	*/
	static fromSecretKey(secretKey, options) {
		if (typeof secretKey === "string") {
			const decoded = decodeIotaPrivateKey(secretKey);
			if (decoded.schema !== "Secp256k1") throw new Error(`Expected a Secp256k1 keypair, got ${decoded.schema}`);
			return this.fromSecretKey(decoded.secretKey, options);
		}
		const publicKey = secp256k1.getPublicKey(secretKey, true);
		if (!options || !options.skipValidation) {
			const msgHash = bytesToHex(blake2b(new TextEncoder().encode("iota validation"), { dkLen: 32 }));
			const signature = secp256k1.sign(msgHash, secretKey);
			if (!secp256k1.verify(signature, msgHash, publicKey, { lowS: true })) throw new Error("Provided secretKey is invalid");
		}
		return new Secp256k1Keypair({
			publicKey,
			secretKey
		});
	}
	/**
	* Generate a keypair from a 32 byte seed.
	*
	* @param seed seed byte array
	*/
	static fromSeed(seed) {
		const publicKey = secp256k1.getPublicKey(seed, true);
		return new Secp256k1Keypair({
			publicKey,
			secretKey: seed
		});
	}
	/**
	* The public key for this keypair
	*/
	getPublicKey() {
		return new Secp256k1PublicKey(this.keypair.publicKey);
	}
	/**
	* The Bech32 secret key string for this Secp256k1 keypair
	*/
	getSecretKey() {
		return encodeIotaPrivateKey(this.keypair.secretKey, this.getKeyScheme());
	}
	/**
	* Return the signature for the provided data.
	*/
	async sign(data) {
		const msgHash = sha256$1(data);
		return secp256k1.sign(msgHash, this.keypair.secretKey, { lowS: true }).toCompactRawBytes();
	}
	/**
	* Derive Secp256k1 keypair from mnemonics and path. The mnemonics must be normalized
	* and validated against the english wordlist.
	*
	* If path is none, it will default to m/54'/4218'/0'/0/0, otherwise the path must
	* be compliant to BIP-32 in form m/54'/4218'/{account_index}'/{change_index}/{address_index}.
	*/
	static deriveKeypair(mnemonics, path) {
		if (path == null) path = DEFAULT_SECP256K1_DERIVATION_PATH;
		if (!isValidBIP32Path(path)) throw new Error("Invalid derivation path");
		const key = HDKey.fromMasterSeed(mnemonicToSeed(mnemonics)).derive(path);
		if (key.publicKey == null || key.privateKey == null) throw new Error("Invalid key");
		return new Secp256k1Keypair({
			publicKey: key.publicKey,
			secretKey: key.privateKey
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/keypairs/secp256r1/publickey.js
var SECP256R1_PUBLIC_KEY_SIZE = 33;
var Secp256r1PublicKey = class extends PublicKey {
	/**
	* Create a new Secp256r1PublicKey object
	* @param value secp256r1 public key as buffer or base-64 encoded string
	*/
	constructor(value) {
		super();
		if (typeof value === "string") this.data = fromBase64(value);
		else if (value instanceof Uint8Array) this.data = value;
		else this.data = Uint8Array.from(value);
		if (this.data.length !== SECP256R1_PUBLIC_KEY_SIZE) throw new Error(`Invalid public key input. Expected ${SECP256R1_PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`);
	}
	/**
	* Checks if two Secp256r1 public keys are equal
	*/
	equals(publicKey) {
		return super.equals(publicKey);
	}
	/**
	* Return the byte array representation of the Secp256r1 public key
	*/
	toRawBytes() {
		return this.data;
	}
	/**
	* Return the IOTA address associated with this Secp256r1 public key
	*/
	flag() {
		return SIGNATURE_SCHEME_TO_FLAG["Secp256r1"];
	}
	/**
	* Verifies that the signature is valid for the provided message
	*/
	async verify(message, signature) {
		let bytes;
		if (typeof signature === "string") {
			const parsed = parseSerializedSignature(signature);
			if (parsed.signatureScheme !== "Secp256r1") throw new Error("Invalid signature scheme");
			if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) throw new Error("Signature does not match public key");
			bytes = parsed.signature;
		} else bytes = signature;
		return secp256r1.verify(secp256r1.Signature.fromCompact(bytes), sha256$1(message), this.toRawBytes());
	}
};
Secp256r1PublicKey.SIZE = SECP256R1_PUBLIC_KEY_SIZE;
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/keypairs/secp256r1/keypair.js
var DEFAULT_SECP256R1_DERIVATION_PATH = "m/74'/4218'/0'/0/0";
var Secp256r1Keypair = class Secp256r1Keypair extends Keypair {
	/**
	* Create a new keypair instance.
	* Generate random keypair if no {@link Secp256r1Keypair} is provided.
	*
	* @param keypair Secp256r1 keypair
	*/
	constructor(keypair) {
		super();
		if (keypair) this.keypair = keypair;
		else {
			const secretKey = secp256r1.utils.randomPrivateKey();
			const publicKey = secp256r1.getPublicKey(secretKey, true);
			this.keypair = {
				publicKey,
				secretKey
			};
		}
	}
	/**
	* Get the key scheme of the keypair Secp256r1
	*/
	getKeyScheme() {
		return "Secp256r1";
	}
	/**
	* Generate a new random keypair
	*/
	static generate() {
		return new Secp256r1Keypair();
	}
	/**
	* Create a keypair from a raw secret key byte array.
	*
	* This method should only be used to recreate a keypair from a previously
	* generated secret key. Generating keypairs from a random seed should be done
	* with the {@link Keypair.fromSeed} method.
	*
	* @throws error if the provided secret key is invalid and validation is not skipped.
	*
	* @param secretKey secret key byte array or Bech32 secret key string* @param secretKey secret key byte array
	* @param options: skip secret key validation
	*/
	static fromSecretKey(secretKey, options) {
		if (typeof secretKey === "string") {
			const decoded = decodeIotaPrivateKey(secretKey);
			if (decoded.schema !== "Secp256r1") throw new Error(`Expected a Secp256r1 keypair, got ${decoded.schema}`);
			return this.fromSecretKey(decoded.secretKey, options);
		}
		const publicKey = secp256r1.getPublicKey(secretKey, true);
		if (!options || !options.skipValidation) {
			const msgHash = bytesToHex(blake2b(new TextEncoder().encode("iota validation"), { dkLen: 32 }));
			const signature = secp256r1.sign(msgHash, secretKey, { lowS: true });
			if (!secp256r1.verify(signature, msgHash, publicKey, { lowS: true })) throw new Error("Provided secretKey is invalid");
		}
		return new Secp256r1Keypair({
			publicKey,
			secretKey
		});
	}
	/**
	* Generate a keypair from a 32 byte seed.
	*
	* @param seed seed byte array
	*/
	static fromSeed(seed) {
		const publicKey = secp256r1.getPublicKey(seed, true);
		return new Secp256r1Keypair({
			publicKey,
			secretKey: seed
		});
	}
	/**
	* The public key for this keypair
	*/
	getPublicKey() {
		return new Secp256r1PublicKey(this.keypair.publicKey);
	}
	/**
	* The Bech32 secret key string for this Secp256r1 keypair
	*/
	getSecretKey() {
		return encodeIotaPrivateKey(this.keypair.secretKey, this.getKeyScheme());
	}
	/**
	* Return the signature for the provided data.
	*/
	async sign(data) {
		const msgHash = sha256$1(data);
		return secp256r1.sign(msgHash, this.keypair.secretKey, { lowS: true }).toCompactRawBytes();
	}
	/**
	* Derive Secp256r1 keypair from mnemonics and path. The mnemonics must be normalized
	* and validated against the english wordlist.
	*
	* If path is none, it will default to m/74'/4218'/0'/0/0, otherwise the path must
	* be compliant to BIP-32 in form m/74'/4218'/{account_index}'/{change_index}/{address_index}.
	*/
	static deriveKeypair(mnemonics, path) {
		if (path == null) path = DEFAULT_SECP256R1_DERIVATION_PATH;
		if (!isValidBIP32Path(path)) throw new Error("Invalid derivation path");
		const privateKey = HDKey.fromMasterSeed(mnemonicToSeed(mnemonics)).derive(path).privateKey;
		return Secp256r1Keypair.fromSecretKey(privateKey);
	}
};
//#endregion
//#region src/lib/utils/default-private-keys.ts
var defaultPrivateKeyAccounts = { accounts: {
	"0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900": {
		bech32PrivateKey: "iotaprivkey1qq5eupu4xulxuuf904vjdcwcet0842m9vcjmdng5lt0k25uac6l2x0zczeh",
		address: "0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900",
		label: "Default Account 0",
		mnemonic: "cook robust sound vote gap elite confirm party music mobile fossil history during gesture gauge flat salt female flag dash industry caution stool bulb"
	},
	"0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11": {
		bech32PrivateKey: "iotaprivkey1qr9jaf9lywvg8uxwxcec4vqcfqlv3k4z497lqnjntwewprv573lw26wska5",
		address: "0x111173a14c3d402c01546c54265c30cc04414c7b7ec1732412bb19066dd49d11",
		label: "Default Account 1",
		mnemonic: "glance old lottery ask thank resemble viable celery ankle measure stairs radar radio february maple safe umbrella doctor stuff outside nominee law edit place"
	},
	"0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522": {
		bech32PrivateKey: "iotaprivkey1qrl3rcyrgzur5830wzeklgpsam7qqk4gph8jcqx9ug6ghek7k8zkzpmy5m8",
		address: "0x2222b466a24399ebcf5ec0f04820812ae20fea1037c736cfec608753aa38b522",
		label: "Default Account 2",
		mnemonic: "airport easily dignity glove guide because baby shop average camera pledge bonus plug illness junior sell volume nose power derive slight provide cradle hat"
	}
} };
function verifyPrivateKeyAccounts(value) {
	if (typeof value !== "object" || value === null) throw new Error("Config is not an object");
	if (typeof value.accounts !== "object" || value.accounts === null) throw new Error("Config.accounts is not an object");
	for (const [address, account] of Object.entries(value.accounts)) {
		if (typeof account !== "object" || account === null) throw new Error(`Account for ${address} is not an object`);
		const acc = account;
		if (typeof acc.bech32PrivateKey !== "string") throw new Error(`Account for ${address} is missing a valid bech32PrivateKey`);
		try {
			acc.address = keypairFromBech32PrivateKey(acc.bech32PrivateKey).toIotaAddress();
			if (address !== acc.address) throw new Error(`Address key ${address} doesn't match derived address from the private key`);
		} catch (error) {
			throw new Error(`Account for ${address} has an invalid IOTA private key: ${error}`);
		}
	}
	return true;
}
function keypairFromBech32PrivateKey(bech32privateKey) {
	const decoded = decodeIotaPrivateKey(bech32privateKey);
	const schema = decoded.schema;
	const secretKey = decoded.secretKey;
	switch (schema) {
		case "ED25519": return Ed25519Keypair.fromSecretKey(secretKey);
		case "Secp256k1": return Secp256k1Keypair.fromSecretKey(secretKey);
		case "Secp256r1": return Secp256r1Keypair.fromSecretKey(secretKey);
		default: throw new Error(`Invalid keypair schema ${schema}`);
	}
}
function toWalletAccounts(sharedPrivateKeyAccounts) {
	return Object.values(sharedPrivateKeyAccounts.accounts).map((account) => ({
		address: account.address,
		label: account.label,
		privKey: account.bech32PrivateKey,
		publicKey: keypairFromBech32PrivateKey(account.bech32PrivateKey).getPublicKey().toRawBytes(),
		chains: ["iota:mainnet"],
		features: ["iota:signAndExecuteTransaction"]
	}));
}
//#endregion
//#region src/lib/utils/local-storage-store.ts
function defaultExternalAddresses() {
	return {
		addresses: [],
		selectedAddress: void 0
	};
}
function verifyExternalAddresses(value) {
	if (!value || typeof value !== "object") throw new Error("External addresses must be an object");
	if (!Array.isArray(value.addresses)) throw new Error("External addresses must contain an array of addresses");
	for (const addr of value.addresses) {
		if (!addr || typeof addr !== "object") throw new Error("Each external address must be an object");
		if (!addr.address || typeof addr.address !== "string") throw new Error("Each external address must have a valid address string");
		if (addr.alias !== void 0 && typeof addr.alias !== "string") throw new Error("External address alias must be a string if provided");
	}
	if (value.selectedAddress !== void 0 && typeof value.selectedAddress !== "string") throw new Error("Selected address must be a string if provided");
	return true;
}
var CLIENT_CONFIG_KEY = "clientConfig";
var PRIVATE_KEY_ACCOUNTS_KEY = "privateKeyAccounts";
var SELECTED_SIGNER_TYPE_KEY = "selectedSignerType";
var EXTERNAL_ADDRESSES_KEY = "externalAddresses";
var IS_PRO_MODE_KEY = "isProMode";
var SELECTED_ADDRESS_KEY = "selectedAddress";
var DISCLAIMER_ACCEPTED_KEY = "disclaimerAccepted";
var STAKING_CURRENCY_KEY = "stakingCurrency";
var MULTI_ACCOUNT_CURRENCY_KEY = "multiAccountCurrency";
var MULTI_ACCOUNT_COMPACT_AMOUNTS_KEY = "multiAccountCompactAmounts";
var STAKING_SKIP_PAGINATION_SENDERS_KEY = "stakingSkipPaginationSenders";
var STAKING_SKIP_PAGINATION_ENABLED_KEY = "stakingSkipPaginationEnabled";
var clientConfigErrorMsg = writable("");
var sharedClientConfig = persistentWritableStore(CLIENT_CONFIG_KEY, defaultClientConfig, verifyClientConfig);
var isProMode = persistentWritableStore(IS_PRO_MODE_KEY, false, (value) => typeof value === "boolean");
var privateKeysErrorMsg = writable("");
var sharedPrivateKeyAccounts = persistentWritableStore(PRIVATE_KEY_ACCOUNTS_KEY, defaultPrivateKeyAccounts, verifyPrivateKeyAccounts);
var SignerType = /* @__PURE__ */ function(SignerType) {
	SignerType["WebWallet"] = "WebWallet";
	SignerType["Localstorage"] = "Localstorage";
	SignerType["ExternalAddress"] = "ExternalAddress";
	return SignerType;
}({});
writable("WebWallet");
var sharedSignerType = persistentWritableStore(SELECTED_SIGNER_TYPE_KEY, "WebWallet", (value) => {
	if (typeof value !== "string" || !Object.values(SignerType).includes(value)) throw new Error(`Invalid signer type: ${value}. Must be one of ${Object.values(SignerType).join(", ")}`);
	return true;
});
var externalAddressesErrorMsg = writable("");
var sharedExternalAddresses = persistentWritableStore(EXTERNAL_ADDRESSES_KEY, defaultExternalAddresses(), verifyExternalAddresses);
writable("");
var sharedSelectedAddress = persistentWritableStore(SELECTED_ADDRESS_KEY, {}, (value) => {
	if (typeof value !== "object") throw new Error("Selected address must be an object");
	for (const key in value) if (typeof value[key] !== "string") throw new Error("Selected address values must be strings");
	return true;
});
var disclaimerAccepted = persistentWritableStore(DISCLAIMER_ACCEPTED_KEY, false, (value) => typeof value === "boolean");
var sharedStakingCurrency = persistentWritableStore(STAKING_CURRENCY_KEY, "usd", (value) => {
	if (value !== "usd" && value !== "eur") throw new Error(`Invalid staking currency: ${value}. Must be 'usd' or 'eur'`);
	return true;
});
var sharedMultiAccountCurrency = persistentWritableStore(MULTI_ACCOUNT_CURRENCY_KEY, "USD", (value) => {
	if (value !== "USD" && value !== "EUR") throw new Error(`Invalid multi-account currency: ${value}. Must be 'USD' or 'EUR'`);
	return true;
});
var sharedMultiAccountCompactAmounts = persistentWritableStore(MULTI_ACCOUNT_COMPACT_AMOUNTS_KEY, false, (value) => typeof value === "boolean");
var sharedStakingSkipPaginationSenders = persistentWritableStore(STAKING_SKIP_PAGINATION_SENDERS_KEY, ["0x5555679093281ffa85c51c24b55fc45ff0f1bb6a57c0bee2c61eae3d5b54ae7c"], (value) => {
	if (!Array.isArray(value)) throw new Error("Staking skip-pagination senders must be an array");
	for (const v of value) if (typeof v !== "string") throw new Error("Staking skip-pagination sender entries must be strings");
	return true;
});
var sharedStakingSkipPaginationEnabled = persistentWritableStore(STAKING_SKIP_PAGINATION_ENABLED_KEY, true, (value) => typeof value === "boolean");
function persistentWritableStore(key, initialValue, verificationFn) {
	const store = writable(loadFromLocalStorage(key, initialValue, verificationFn));
	store.subscribe((value) => {
		if (typeof localStorage !== "undefined") try {
			if (verificationFn(value)) {
				localStorage.setItem(key, JSON.stringify(value));
				if (key === CLIENT_CONFIG_KEY) clientConfigErrorMsg.set("");
				if (key === PRIVATE_KEY_ACCOUNTS_KEY) privateKeysErrorMsg.set("");
				if (key === EXTERNAL_ADDRESSES_KEY) externalAddressesErrorMsg.set("");
			}
		} catch (err) {
			console.warn(`Invalid value for localStorage key "${key}":`, value, err);
			if (key === CLIENT_CONFIG_KEY) clientConfigErrorMsg.set(err.message || String(err));
			if (key === PRIVATE_KEY_ACCOUNTS_KEY) privateKeysErrorMsg.set(err.message || String(err));
			if (key === EXTERNAL_ADDRESSES_KEY) externalAddressesErrorMsg.set(err.message || String(err));
		}
	});
	return store;
}
function loadFromLocalStorage(key, initialValue, verificationFn) {
	if (typeof localStorage === "undefined") return initialValue;
	const json = localStorage.getItem(key);
	try {
		let value = json ? JSON.parse(json) : initialValue;
		verificationFn(value);
		return value;
	} catch (err) {
		console.error(`Error parsing localStorage key "${key}, overwriting with default"`, err);
		return initialValue;
	}
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/client/errors.js
var CODE_TO_ERROR_TYPE = {
	"-32700": "ParseError",
	"-32701": "OversizedRequest",
	"-32702": "OversizedResponse",
	"-32600": "InvalidRequest",
	"-32601": "MethodNotFound",
	"-32602": "InvalidParams",
	"-32603": "InternalError",
	"-32604": "ServerBusy",
	"-32000": "CallExecutionFailed",
	"-32001": "UnknownError",
	"-32003": "SubscriptionClosed",
	"-32004": "SubscriptionClosedWithError",
	"-32005": "BatchesNotSupported",
	"-32006": "TooManySubscriptions",
	"-32050": "TransientError",
	"-32002": "TransactionExecutionClientError"
};
var IotaHTTPTransportError = class extends Error {};
var JsonRpcError = class extends IotaHTTPTransportError {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.type = CODE_TO_ERROR_TYPE[code] ?? "ServerError";
	}
};
var IotaHTTPStatusError = class extends IotaHTTPTransportError {
	constructor(message, status, statusText) {
		super(message);
		this.status = status;
		this.statusText = statusText;
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/client/rpc-websocket-client.js
var __typeError$3 = (msg) => {
	throw TypeError(msg);
};
var __accessCheck$3 = (obj, member, msg) => member.has(obj) || __typeError$3("Cannot " + msg);
var __privateGet$3 = (obj, member, getter) => (__accessCheck$3(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$3 = (obj, member, value) => member.has(obj) ? __typeError$3("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$3 = (obj, member, value, setter) => (__accessCheck$3(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod$3 = (obj, member, method) => (__accessCheck$3(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
	set _(value) {
		__privateSet$3(obj, member, value, setter);
	},
	get _() {
		return __privateGet$3(obj, member, getter);
	}
});
var _requestId$1;
var _disconnects;
var _webSocket;
var _connectionPromise;
var _subscriptions;
var _pendingRequests;
var _WebsocketClient_instances;
var setupWebSocket_fn;
var reconnect_fn;
function getWebsocketUrl(httpUrl) {
	const url = new URL(httpUrl);
	url.protocol = url.protocol.replace("http", "ws");
	return url.toString();
}
var DEFAULT_CLIENT_OPTIONS = {
	WebSocketConstructor: typeof WebSocket !== "undefined" ? WebSocket : void 0,
	callTimeout: 3e4,
	reconnectTimeout: 3e3,
	maxReconnects: 5
};
var WebsocketClient = class {
	constructor(endpoint, options = {}) {
		__privateAdd$3(this, _WebsocketClient_instances);
		__privateAdd$3(this, _requestId$1, 0);
		__privateAdd$3(this, _disconnects, 0);
		__privateAdd$3(this, _webSocket, null);
		__privateAdd$3(this, _connectionPromise, null);
		__privateAdd$3(this, _subscriptions, /* @__PURE__ */ new Set());
		__privateAdd$3(this, _pendingRequests, /* @__PURE__ */ new Map());
		this.endpoint = endpoint;
		this.options = {
			...DEFAULT_CLIENT_OPTIONS,
			...options
		};
		if (!this.options.WebSocketConstructor) throw new Error("Missing WebSocket constructor");
		if (this.endpoint.startsWith("http")) this.endpoint = getWebsocketUrl(this.endpoint);
	}
	async makeRequest(method, params, signal) {
		const webSocket = await __privateMethod$3(this, _WebsocketClient_instances, setupWebSocket_fn).call(this);
		return new Promise((resolve, reject) => {
			__privateSet$3(this, _requestId$1, __privateGet$3(this, _requestId$1) + 1);
			__privateGet$3(this, _pendingRequests).set(__privateGet$3(this, _requestId$1), {
				resolve,
				reject,
				timeout: setTimeout(() => {
					__privateGet$3(this, _pendingRequests).delete(__privateGet$3(this, _requestId$1));
					reject(/* @__PURE__ */ new Error(`Request timeout: ${method}`));
				}, this.options.callTimeout)
			});
			signal?.addEventListener("abort", () => {
				__privateGet$3(this, _pendingRequests).delete(__privateGet$3(this, _requestId$1));
				reject(signal.reason);
			});
			webSocket.send(JSON.stringify({
				jsonrpc: "2.0",
				id: __privateGet$3(this, _requestId$1),
				method,
				params
			}));
		}).then(({ error, result }) => {
			if (error) throw new JsonRpcError(error.message, error.code);
			return result;
		});
	}
	async subscribe(input) {
		const subscription = new RpcSubscription(input);
		__privateGet$3(this, _subscriptions).add(subscription);
		await subscription.subscribe(this);
		return () => subscription.unsubscribe(this);
	}
};
_requestId$1 = /* @__PURE__ */ new WeakMap();
_disconnects = /* @__PURE__ */ new WeakMap();
_webSocket = /* @__PURE__ */ new WeakMap();
_connectionPromise = /* @__PURE__ */ new WeakMap();
_subscriptions = /* @__PURE__ */ new WeakMap();
_pendingRequests = /* @__PURE__ */ new WeakMap();
_WebsocketClient_instances = /* @__PURE__ */ new WeakSet();
setupWebSocket_fn = function() {
	if (__privateGet$3(this, _connectionPromise)) return __privateGet$3(this, _connectionPromise);
	__privateSet$3(this, _connectionPromise, new Promise((resolve) => {
		__privateGet$3(this, _webSocket)?.close();
		__privateSet$3(this, _webSocket, new this.options.WebSocketConstructor(this.endpoint));
		__privateGet$3(this, _webSocket).addEventListener("open", () => {
			__privateSet$3(this, _disconnects, 0);
			resolve(__privateGet$3(this, _webSocket));
		});
		__privateGet$3(this, _webSocket).addEventListener("close", () => {
			__privateWrapper(this, _disconnects)._++;
			if (__privateGet$3(this, _disconnects) <= this.options.maxReconnects) setTimeout(() => {
				__privateMethod$3(this, _WebsocketClient_instances, reconnect_fn).call(this);
			}, this.options.reconnectTimeout);
		});
		__privateGet$3(this, _webSocket).addEventListener("message", ({ data }) => {
			let json;
			try {
				json = JSON.parse(data);
			} catch (error) {
				console.error(new Error(`Failed to parse RPC message: ${data}`, { cause: error }));
				return;
			}
			if ("id" in json && json.id != null && __privateGet$3(this, _pendingRequests).has(json.id)) {
				const { resolve: resolve2, timeout } = __privateGet$3(this, _pendingRequests).get(json.id);
				clearTimeout(timeout);
				resolve2(json);
			} else if ("params" in json) {
				const { params } = json;
				__privateGet$3(this, _subscriptions).forEach((subscription) => {
					if (subscription.subscriptionId === params.subscription) {
						if (params.subscription === subscription.subscriptionId) subscription.onMessage(params.result);
					}
				});
			}
		});
	}));
	return __privateGet$3(this, _connectionPromise);
};
reconnect_fn = async function() {
	__privateGet$3(this, _webSocket)?.close();
	__privateSet$3(this, _connectionPromise, null);
	return Promise.allSettled([...__privateGet$3(this, _subscriptions)].map((subscription) => subscription.subscribe(this)));
};
var RpcSubscription = class {
	constructor(input) {
		this.subscriptionId = null;
		this.subscribed = false;
		this.input = input;
	}
	onMessage(message) {
		if (this.subscribed) this.input.onMessage(message);
	}
	async unsubscribe(client) {
		const { subscriptionId } = this;
		this.subscribed = false;
		if (subscriptionId == null) return false;
		this.subscriptionId = null;
		return client.makeRequest(this.input.unsubscribe, [subscriptionId]);
	}
	async subscribe(client) {
		this.subscriptionId = null;
		this.subscribed = true;
		const newSubscriptionId = await client.makeRequest(this.input.method, this.input.params, this.input.signal);
		if (this.subscribed) this.subscriptionId = newSubscriptionId;
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/client/http-transport.js
var __typeError$2 = (msg) => {
	throw TypeError(msg);
};
var __accessCheck$2 = (obj, member, msg) => member.has(obj) || __typeError$2("Cannot " + msg);
var __privateGet$2 = (obj, member, getter) => (__accessCheck$2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$2 = (obj, member, value) => member.has(obj) ? __typeError$2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$2 = (obj, member, value, setter) => (__accessCheck$2(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod$2 = (obj, member, method) => (__accessCheck$2(obj, member, "access private method"), method);
var _requestId;
var _options$1;
var _websocketClient;
var _IotaHTTPTransport_instances;
var getWebsocketClient_fn;
var IotaHTTPTransport = class {
	constructor(options) {
		__privateAdd$2(this, _IotaHTTPTransport_instances);
		__privateAdd$2(this, _requestId, 0);
		__privateAdd$2(this, _options$1);
		__privateAdd$2(this, _websocketClient);
		__privateSet$2(this, _options$1, options);
	}
	fetch(input, init) {
		const fetchFn = __privateGet$2(this, _options$1).fetch ?? fetch;
		if (!fetchFn) throw new Error("The current environment does not support fetch, you can provide a fetch implementation in the options for IotaHTTPTransport.");
		return fetchFn(input, init);
	}
	async request(input) {
		__privateSet$2(this, _requestId, __privateGet$2(this, _requestId) + 1);
		const executeRequest = async () => {
			const res = await this.fetch(__privateGet$2(this, _options$1).rpc?.url ?? __privateGet$2(this, _options$1).url, {
				method: "POST",
				signal: input.signal,
				headers: {
					"Content-Type": "application/json",
					"Client-Sdk-Type": "typescript",
					...__privateGet$2(this, _options$1).rpc?.headers
				},
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: __privateGet$2(this, _requestId),
					method: input.method,
					params: input.params
				})
			});
			if (!res.ok) throw new IotaHTTPStatusError(`Unexpected status code: ${res.status}`, res.status, res.statusText);
			const data = await res.json();
			if ("error" in data && data.error != null) throw new JsonRpcError(data.error.message, data.error.code);
			return data.result;
		};
		return __privateGet$2(this, _options$1).inspector ? __privateGet$2(this, _options$1).inspector(input, executeRequest) : executeRequest();
	}
	async subscribe(input) {
		const unsubscribe = await __privateMethod$2(this, _IotaHTTPTransport_instances, getWebsocketClient_fn).call(this).subscribe(input);
		if (input.signal) {
			input.signal.throwIfAborted();
			input.signal.addEventListener("abort", () => {
				unsubscribe();
			});
		}
		return async () => !!await unsubscribe();
	}
};
_requestId = /* @__PURE__ */ new WeakMap();
_options$1 = /* @__PURE__ */ new WeakMap();
_websocketClient = /* @__PURE__ */ new WeakMap();
_IotaHTTPTransport_instances = /* @__PURE__ */ new WeakSet();
getWebsocketClient_fn = function() {
	if (!__privateGet$2(this, _websocketClient)) {
		const WebSocketConstructor = __privateGet$2(this, _options$1).WebSocketConstructor ?? WebSocket;
		if (!WebSocketConstructor) throw new Error("The current environment does not support WebSocket, you can provide a WebSocketConstructor in the options for IotaHTTPTransport.");
		__privateSet$2(this, _websocketClient, new WebsocketClient(__privateGet$2(this, _options$1).websocket?.url ?? __privateGet$2(this, _options$1).url, {
			WebSocketConstructor,
			...__privateGet$2(this, _options$1).websocket
		}));
	}
	return __privateGet$2(this, _websocketClient);
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/utils/constants.js
var NANOS_PER_IOTA = BigInt(1e9);
var IOTA_CLOCK_OBJECT_ID = normalizeIotaObjectId("0x6");
var IOTA_TYPE_ARG = `0x2::iota::IOTA`;
var IOTA_SYSTEM_STATE_OBJECT_ID = normalizeIotaObjectId("0x5");
normalizeIotaObjectId("0x8");
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/serializer.js
var OBJECT_MODULE_NAME = "object";
var ID_STRUCT_NAME = "ID";
var STD_ASCII_MODULE_NAME = "ascii";
var STD_ASCII_STRUCT_NAME = "String";
var STD_UTF8_MODULE_NAME = "string";
var STD_UTF8_STRUCT_NAME = "String";
var STD_OPTION_MODULE_NAME = "option";
var STD_OPTION_STRUCT_NAME = "Option";
function isTxContext(param) {
	const struct = typeof param.body === "object" && "datatype" in param.body ? param.body.datatype : null;
	return !!struct && normalizeIotaAddress(struct.package) === normalizeIotaAddress("0x2") && struct.module === "tx_context" && struct.type === "TxContext";
}
function getPureBcsSchema(typeSignature) {
	if (typeof typeSignature === "string") switch (typeSignature) {
		case "address": return iotaBcs.Address;
		case "bool": return iotaBcs.Bool;
		case "u8": return iotaBcs.U8;
		case "u16": return iotaBcs.U16;
		case "u32": return iotaBcs.U32;
		case "u64": return iotaBcs.U64;
		case "u128": return iotaBcs.U128;
		case "u256": return iotaBcs.U256;
		default: throw new Error(`Unknown type signature ${typeSignature}`);
	}
	if ("vector" in typeSignature) {
		if (typeSignature.vector === "u8") return iotaBcs.byteVector().transform({
			input: (val) => typeof val === "string" ? new TextEncoder().encode(val) : val,
			output: (val) => val
		});
		const type = getPureBcsSchema(typeSignature.vector);
		return type ? iotaBcs.vector(type) : null;
	}
	if ("datatype" in typeSignature) {
		const pkg = normalizeIotaAddress(typeSignature.datatype.package);
		if (pkg === normalizeIotaAddress("0x1")) {
			if (typeSignature.datatype.module === STD_ASCII_MODULE_NAME && typeSignature.datatype.type === STD_ASCII_STRUCT_NAME) return iotaBcs.String;
			if (typeSignature.datatype.module === STD_UTF8_MODULE_NAME && typeSignature.datatype.type === STD_UTF8_STRUCT_NAME) return iotaBcs.String;
			if (typeSignature.datatype.module === STD_OPTION_MODULE_NAME && typeSignature.datatype.type === STD_OPTION_STRUCT_NAME) {
				const type = getPureBcsSchema(typeSignature.datatype.typeParameters[0]);
				return type ? iotaBcs.vector(type) : null;
			}
		}
		if (pkg === normalizeIotaAddress("0x2") && typeSignature.datatype.module === OBJECT_MODULE_NAME && typeSignature.datatype.type === ID_STRUCT_NAME) return iotaBcs.Address;
	}
	return null;
}
function normalizedTypeToMoveTypeSignature(type) {
	if (typeof type === "object" && "Reference" in type) return {
		ref: "&",
		body: normalizedTypeToMoveTypeSignatureBody(type.Reference)
	};
	if (typeof type === "object" && "MutableReference" in type) return {
		ref: "&mut",
		body: normalizedTypeToMoveTypeSignatureBody(type.MutableReference)
	};
	return {
		ref: null,
		body: normalizedTypeToMoveTypeSignatureBody(type)
	};
}
function normalizedTypeToMoveTypeSignatureBody(type) {
	if (typeof type === "string") switch (type) {
		case "Address": return "address";
		case "Bool": return "bool";
		case "U8": return "u8";
		case "U16": return "u16";
		case "U32": return "u32";
		case "U64": return "u64";
		case "U128": return "u128";
		case "U256": return "u256";
		default: throw new Error(`Unexpected type ${type}`);
	}
	if ("Vector" in type) return { vector: normalizedTypeToMoveTypeSignatureBody(type.Vector) };
	if ("Struct" in type) return { datatype: {
		package: type.Struct.address,
		module: type.Struct.module,
		type: type.Struct.name,
		typeParameters: type.Struct.typeArguments.map(normalizedTypeToMoveTypeSignatureBody)
	} };
	if ("TypeParameter" in type) return { typeParameter: type.TypeParameter };
	throw new Error(`Unexpected type ${JSON.stringify(type)}`);
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/Inputs.js
function Pure(data) {
	return {
		$kind: "Pure",
		Pure: { bytes: data instanceof Uint8Array ? toBase64(data) : data.toBase64() }
	};
}
var Inputs = {
	Pure,
	ObjectRef({ objectId, digest, version }) {
		return {
			$kind: "Object",
			Object: {
				$kind: "ImmOrOwnedObject",
				ImmOrOwnedObject: {
					digest,
					version,
					objectId: normalizeIotaAddress(objectId)
				}
			}
		};
	},
	SharedObjectRef({ objectId, mutable, initialSharedVersion }) {
		return {
			$kind: "Object",
			Object: {
				$kind: "SharedObject",
				SharedObject: {
					mutable,
					initialSharedVersion,
					objectId: normalizeIotaAddress(objectId)
				}
			}
		};
	},
	ReceivingRef({ objectId, digest, version }) {
		return {
			$kind: "Object",
			Object: {
				$kind: "Receiving",
				Receiving: {
					digest,
					version,
					objectId: normalizeIotaAddress(objectId)
				}
			}
		};
	}
};
//#endregion
//#region node_modules/.pnpm/valibot@1.4.2_typescript@5.9.3/node_modules/valibot/dist/index.mjs
var store$4;
var DEFAULT_CONFIG = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/**
* Returns the global configuration.
*
* @param config The config to merge.
*
* @returns The configuration.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config$1) {
	if (!config$1 && !store$4) return DEFAULT_CONFIG;
	return {
		lang: config$1?.lang ?? store$4?.lang,
		message: config$1?.message,
		abortEarly: config$1?.abortEarly ?? store$4?.abortEarly,
		abortPipeEarly: config$1?.abortPipeEarly ?? store$4?.abortPipeEarly
	};
}
var store$3;
/**
* Returns a global error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalMessage(lang) {
	return store$3?.get(lang);
}
var store$2;
/**
* Returns a schema error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSchemaMessage(lang) {
	return store$2?.get(lang);
}
var store$1;
/**
* Returns a specific error message.
*
* @param reference The identifier reference.
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSpecificMessage(reference, lang) {
	return store$1?.get(reference)?.get(lang);
}
/**
* Stringifies an unknown input to a literal or type string.
*
* @param input The unknown input.
*
* @returns A literal or type string.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}
/**
* Adds an issue to the dataset.
*
* @param context The issue context.
* @param label The issue label.
* @param dataset The input dataset.
* @param config The configuration.
* @param other The optional props.
*
* @internal
*/
function _addIssue(context, label, dataset, config$1, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config$1.lang,
		abortEarly: config$1.abortEarly,
		abortPipeEarly: config$1.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message$1 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
	if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}
var _standardCache = /* @__PURE__ */ new WeakMap();
/**
* Returns the Standard Schema properties.
*
* @param context The schema context.
*
* @returns The Standard Schema properties.
*/
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	let cached = _standardCache.get(context);
	if (!cached) {
		cached = {
			version: 1,
			vendor: "valibot",
			validate(value$1) {
				return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
			}
		};
		_standardCache.set(context, cached);
	}
	return cached;
}
/**
* Disallows inherited object properties and prevents object prototype
* pollution by disallowing certain keys.
*
* @param object The object to check.
* @param key The key to check.
*
* @returns Whether the key is allowed.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isValidObjectKey(object$1, key) {
	return Object.prototype.hasOwnProperty.call(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
/**
* Joins multiple `expects` values with the given separator.
*
* @param values The `expects` values.
* @param separator The separator.
*
* @returns The joined `expects` property.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values$1, separator) {
	const list = [...new Set(values$1)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}
/**
* A Valibot error with useful information.
*/
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};
/* @__NO_SIDE_EFFECTS__ */
function check(requirement, message$1) {
	return {
		kind: "validation",
		type: "check",
		reference: check,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function integer(message$1) {
	return {
		kind: "validation",
		type: "integer",
		reference: integer,
		async: false,
		expects: null,
		requirement: Number.isInteger,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Creates a custom transformation action.
*
* @param operation The transformation operation.
*
* @returns A transform action.
*/
/* @__NO_SIDE_EFFECTS__ */
function transform(operation) {
	return {
		kind: "transformation",
		type: "transform",
		reference: transform,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = this.operation(dataset.value);
			return dataset;
		}
	};
}
var ABORT_EARLY_CONFIG = { abortEarly: true };
/**
* Returns the fallback value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The output dataset if available.
* @param config The config if available.
*
* @returns The fallback value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config$1) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
/**
* Returns the default value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The input dataset if available.
* @param config The config if available.
*
* @returns The default value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config$1) {
	return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
/**
* Checks if the input matches the schema. By using a type predicate, this
* function can be used as a type guard.
*
* @param schema The schema to be used.
* @param input The input to be tested.
*
* @returns Whether the input matches the schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function is(schema, input) {
	return !schema["~run"]({ value: input }, ABORT_EARLY_CONFIG).issues;
}
/* @__NO_SIDE_EFFECTS__ */
function array(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: array,
		expects: "Array",
		async: false,
		item,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function bigint(message$1) {
	return {
		kind: "schema",
		type: "bigint",
		reference: bigint,
		expects: "bigint",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "bigint") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function boolean(message$1) {
	return {
		kind: "schema",
		type: "boolean",
		reference: boolean,
		expects: "boolean",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "boolean") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Creates a lazy schema.
*
* @param getter The schema getter.
*
* @returns A lazy schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function lazy(getter) {
	return {
		kind: "schema",
		type: "lazy",
		reference: lazy,
		expects: "unknown",
		async: false,
		getter,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			return this.getter(dataset.value)["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function literal(literal_, message$1) {
	return {
		kind: "schema",
		type: "literal",
		reference: literal,
		expects: /* @__PURE__ */ _stringify(literal_),
		async: false,
		literal: literal_,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === this.literal) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullable(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullable",
		reference: nullable,
		expects: `(${wrapped.expects} | null)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullish(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullish",
		reference: nullish,
		expects: `(${wrapped.expects} | null | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null || dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null || dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function number(message$1) {
	return {
		kind: "schema",
		type: "number",
		reference: number,
		expects: "number",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function object(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: object,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function record(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "record",
		reference: record,
		expects: "Object",
		async: false,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
					const entryValue = input[entryKey];
					const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function tuple(items, message$1) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Returns the sub issues of the provided datasets for the union issue.
*
* @param datasets The datasets.
*
* @returns The sub issues.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _subIssues(datasets) {
	let issues;
	if (datasets) for (const dataset of datasets) if (issues) for (const issue of dataset.issues) issues.push(issue);
	else issues = dataset.issues;
	return issues;
}
/* @__NO_SIDE_EFFECTS__ */
function union(options, message$1) {
	return {
		kind: "schema",
		type: "union",
		reference: union,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}
/**
* Creates a unknown schema.
*
* @returns A unknown schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function unknown() {
	return {
		kind: "schema",
		type: "unknown",
		reference: unknown,
		expects: "unknown",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
function parse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/data/internal.js
function safeEnum(options) {
	return /* @__PURE__ */ pipe(/* @__PURE__ */ union(Object.entries(options).map(([key, value]) => /* @__PURE__ */ object({ [key]: value }))), /* @__PURE__ */ transform((value) => ({
		...value,
		$kind: Object.keys(value)[0]
	})));
}
var IotaAddress = /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ transform((value) => normalizeIotaAddress(value)), /* @__PURE__ */ check(isValidIotaAddress));
var ObjectID = IotaAddress;
var BCSBytes = /* @__PURE__ */ string();
var JsonU64 = /* @__PURE__ */ pipe(/* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer())]), /* @__PURE__ */ check((val) => {
	try {
		BigInt(val);
		return BigInt(val) >= 0 && BigInt(val) <= 18446744073709551615n;
	} catch {
		return false;
	}
}, "Invalid u64"));
var ObjectRef$1 = /* @__PURE__ */ object({
	objectId: IotaAddress,
	version: JsonU64,
	digest: /* @__PURE__ */ string()
});
var Argument$1 = /* @__PURE__ */ pipe(/* @__PURE__ */ union([
	/* @__PURE__ */ object({ GasCoin: /* @__PURE__ */ literal(true) }),
	/* @__PURE__ */ object({
		Input: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()),
		type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("pure"))
	}),
	/* @__PURE__ */ object({
		Input: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()),
		type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("object"))
	}),
	/* @__PURE__ */ object({ Result: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()) }),
	/* @__PURE__ */ object({ NestedResult: /* @__PURE__ */ tuple([/* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()), /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer())]) })
]), /* @__PURE__ */ transform((value) => ({
	...value,
	$kind: Object.keys(value)[0]
})));
var GasData$1 = /* @__PURE__ */ object({
	budget: /* @__PURE__ */ nullable(JsonU64),
	price: /* @__PURE__ */ nullable(JsonU64),
	owner: /* @__PURE__ */ nullable(IotaAddress),
	payment: /* @__PURE__ */ nullable(/* @__PURE__ */ array(ObjectRef$1))
});
var OpenMoveTypeSignatureBody = /* @__PURE__ */ union([
	/* @__PURE__ */ literal("address"),
	/* @__PURE__ */ literal("bool"),
	/* @__PURE__ */ literal("u8"),
	/* @__PURE__ */ literal("u16"),
	/* @__PURE__ */ literal("u32"),
	/* @__PURE__ */ literal("u64"),
	/* @__PURE__ */ literal("u128"),
	/* @__PURE__ */ literal("u256"),
	/* @__PURE__ */ object({ vector: /* @__PURE__ */ lazy(() => OpenMoveTypeSignatureBody) }),
	/* @__PURE__ */ object({ datatype: /* @__PURE__ */ object({
		package: /* @__PURE__ */ string(),
		module: /* @__PURE__ */ string(),
		type: /* @__PURE__ */ string(),
		typeParameters: /* @__PURE__ */ array(/* @__PURE__ */ lazy(() => OpenMoveTypeSignatureBody))
	}) }),
	/* @__PURE__ */ object({ typeParameter: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()) })
]);
var Command$1 = safeEnum({
	MoveCall: /* @__PURE__ */ object({
		package: ObjectID,
		module: /* @__PURE__ */ string(),
		function: /* @__PURE__ */ string(),
		typeArguments: /* @__PURE__ */ array(/* @__PURE__ */ string()),
		arguments: /* @__PURE__ */ array(Argument$1),
		_argumentTypes: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(/* @__PURE__ */ array(/* @__PURE__ */ object({
			ref: /* @__PURE__ */ nullable(/* @__PURE__ */ union([/* @__PURE__ */ literal("&"), /* @__PURE__ */ literal("&mut")])),
			body: OpenMoveTypeSignatureBody
		}))))
	}),
	TransferObjects: /* @__PURE__ */ object({
		objects: /* @__PURE__ */ array(Argument$1),
		address: Argument$1
	}),
	SplitCoins: /* @__PURE__ */ object({
		coin: Argument$1,
		amounts: /* @__PURE__ */ array(Argument$1)
	}),
	MergeCoins: /* @__PURE__ */ object({
		destination: Argument$1,
		sources: /* @__PURE__ */ array(Argument$1)
	}),
	Publish: /* @__PURE__ */ object({
		modules: /* @__PURE__ */ array(BCSBytes),
		dependencies: /* @__PURE__ */ array(ObjectID)
	}),
	MakeMoveVec: /* @__PURE__ */ object({
		type: /* @__PURE__ */ nullable(/* @__PURE__ */ string()),
		elements: /* @__PURE__ */ array(Argument$1)
	}),
	Upgrade: /* @__PURE__ */ object({
		modules: /* @__PURE__ */ array(BCSBytes),
		dependencies: /* @__PURE__ */ array(ObjectID),
		package: ObjectID,
		ticket: Argument$1
	}),
	$Intent: /* @__PURE__ */ object({
		name: /* @__PURE__ */ string(),
		inputs: /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ union([Argument$1, /* @__PURE__ */ array(Argument$1)])),
		data: /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ unknown())
	})
});
var ObjectArg = safeEnum({
	ImmOrOwnedObject: ObjectRef$1,
	SharedObject: /* @__PURE__ */ object({
		objectId: ObjectID,
		initialSharedVersion: JsonU64,
		mutable: /* @__PURE__ */ boolean()
	}),
	Receiving: ObjectRef$1
});
var CallArg$1 = safeEnum({
	Object: ObjectArg,
	Pure: /* @__PURE__ */ object({ bytes: BCSBytes }),
	UnresolvedPure: /* @__PURE__ */ object({ value: /* @__PURE__ */ unknown() }),
	UnresolvedObject: /* @__PURE__ */ object({
		objectId: ObjectID,
		version: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(JsonU64)),
		digest: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(/* @__PURE__ */ string())),
		initialSharedVersion: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(JsonU64)),
		mutable: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(/* @__PURE__ */ boolean()))
	})
});
var NormalizedCallArg$1 = safeEnum({
	Object: ObjectArg,
	Pure: /* @__PURE__ */ object({ bytes: BCSBytes })
});
var TransactionExpiration$2 = safeEnum({
	None: /* @__PURE__ */ literal(true),
	Epoch: JsonU64
});
var TransactionData = /* @__PURE__ */ object({
	version: /* @__PURE__ */ literal(2),
	sender: /* @__PURE__ */ nullish(IotaAddress),
	expiration: /* @__PURE__ */ nullish(TransactionExpiration$2),
	gasData: GasData$1,
	inputs: /* @__PURE__ */ array(CallArg$1),
	commands: /* @__PURE__ */ array(Command$1)
});
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/Commands.js
var Commands = {
	MoveCall(input) {
		const [pkg, mod = "", fn = ""] = "target" in input ? input.target.split("::") : [
			input.package,
			input.module,
			input.function
		];
		return {
			$kind: "MoveCall",
			MoveCall: {
				package: pkg,
				module: mod,
				function: fn,
				typeArguments: input.typeArguments ?? [],
				arguments: input.arguments ?? []
			}
		};
	},
	TransferObjects(objects, address) {
		return {
			$kind: "TransferObjects",
			TransferObjects: {
				objects: objects.map((o) => parse(Argument$1, o)),
				address: parse(Argument$1, address)
			}
		};
	},
	SplitCoins(coin, amounts) {
		return {
			$kind: "SplitCoins",
			SplitCoins: {
				coin: parse(Argument$1, coin),
				amounts: amounts.map((o) => parse(Argument$1, o))
			}
		};
	},
	MergeCoins(destination, sources) {
		return {
			$kind: "MergeCoins",
			MergeCoins: {
				destination: parse(Argument$1, destination),
				sources: sources.map((o) => parse(Argument$1, o))
			}
		};
	},
	Publish({ modules, dependencies }) {
		return {
			$kind: "Publish",
			Publish: {
				modules: modules.map((module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))),
				dependencies: dependencies.map((dep) => normalizeIotaObjectId(dep))
			}
		};
	},
	Upgrade({ modules, dependencies, package: packageId, ticket }) {
		return {
			$kind: "Upgrade",
			Upgrade: {
				modules: modules.map((module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))),
				dependencies: dependencies.map((dep) => normalizeIotaObjectId(dep)),
				package: packageId,
				ticket: parse(Argument$1, ticket)
			}
		};
	},
	MakeMoveVec({ type, elements }) {
		return {
			$kind: "MakeMoveVec",
			MakeMoveVec: {
				type: type ?? null,
				elements: elements.map((o) => parse(Argument$1, o))
			}
		};
	},
	Intent({ name, inputs = {}, data = {} }) {
		return {
			$kind: "$Intent",
			$Intent: {
				name,
				inputs: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, Array.isArray(value) ? value.map((o) => parse(Argument$1, o)) : parse(Argument$1, value)])),
				data
			}
		};
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/data/v2.js
function enumUnion(options) {
	return /* @__PURE__ */ union(Object.entries(options).map(([key, value]) => /* @__PURE__ */ object({ [key]: value })));
}
var Argument = enumUnion({
	GasCoin: /* @__PURE__ */ literal(true),
	Input: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()),
	Result: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()),
	NestedResult: /* @__PURE__ */ tuple([/* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()), /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer())])
});
var GasData = /* @__PURE__ */ object({
	budget: /* @__PURE__ */ nullable(JsonU64),
	price: /* @__PURE__ */ nullable(JsonU64),
	owner: /* @__PURE__ */ nullable(IotaAddress),
	payment: /* @__PURE__ */ nullable(/* @__PURE__ */ array(ObjectRef$1))
});
var Command = enumUnion({
	MoveCall: /* @__PURE__ */ object({
		package: ObjectID,
		module: /* @__PURE__ */ string(),
		function: /* @__PURE__ */ string(),
		typeArguments: /* @__PURE__ */ array(/* @__PURE__ */ string()),
		arguments: /* @__PURE__ */ array(Argument)
	}),
	TransferObjects: /* @__PURE__ */ object({
		objects: /* @__PURE__ */ array(Argument),
		address: Argument
	}),
	SplitCoins: /* @__PURE__ */ object({
		coin: Argument,
		amounts: /* @__PURE__ */ array(Argument)
	}),
	MergeCoins: /* @__PURE__ */ object({
		destination: Argument,
		sources: /* @__PURE__ */ array(Argument)
	}),
	Publish: /* @__PURE__ */ object({
		modules: /* @__PURE__ */ array(BCSBytes),
		dependencies: /* @__PURE__ */ array(ObjectID)
	}),
	MakeMoveVec: /* @__PURE__ */ object({
		type: /* @__PURE__ */ nullable(/* @__PURE__ */ string()),
		elements: /* @__PURE__ */ array(Argument)
	}),
	Upgrade: /* @__PURE__ */ object({
		modules: /* @__PURE__ */ array(BCSBytes),
		dependencies: /* @__PURE__ */ array(ObjectID),
		package: ObjectID,
		ticket: Argument
	}),
	$Intent: /* @__PURE__ */ object({
		name: /* @__PURE__ */ string(),
		inputs: /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ union([Argument, /* @__PURE__ */ array(Argument)])),
		data: /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ unknown())
	})
});
var CallArg = enumUnion({
	Object: enumUnion({
		ImmOrOwnedObject: ObjectRef$1,
		SharedObject: /* @__PURE__ */ object({
			objectId: ObjectID,
			initialSharedVersion: JsonU64,
			mutable: /* @__PURE__ */ boolean()
		}),
		Receiving: ObjectRef$1
	}),
	Pure: /* @__PURE__ */ object({ bytes: BCSBytes }),
	UnresolvedPure: /* @__PURE__ */ object({ value: /* @__PURE__ */ unknown() }),
	UnresolvedObject: /* @__PURE__ */ object({
		objectId: ObjectID,
		version: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(JsonU64)),
		digest: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(/* @__PURE__ */ string())),
		initialSharedVersion: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(JsonU64)),
		mutable: /* @__PURE__ */ optional(/* @__PURE__ */ nullable(/* @__PURE__ */ boolean()))
	})
});
var TransactionExpiration$1 = enumUnion({
	None: /* @__PURE__ */ literal(true),
	Epoch: JsonU64
});
var SerializedTransactionDataV2 = /* @__PURE__ */ object({
	version: /* @__PURE__ */ literal(2),
	sender: /* @__PURE__ */ nullish(IotaAddress),
	expiration: /* @__PURE__ */ nullish(TransactionExpiration$1),
	gasData: GasData,
	inputs: /* @__PURE__ */ array(CallArg),
	commands: /* @__PURE__ */ array(Command)
});
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/json-rpc-resolver.js
var MAX_OBJECTS_PER_FETCH = 50;
var GAS_SAFE_OVERHEAD = 1000n;
var MAX_GAS = 5e10;
async function resolveTransactionData(transactionData, options, next) {
	await normalizeInputs(transactionData, options);
	await resolveObjectReferences(transactionData, options);
	if (!options.onlyTransactionKind) {
		await setGasPrice(transactionData, options);
		await setGasBudget(transactionData, options);
		await setGasPayment(transactionData, options);
	}
	await validate(transactionData);
	return await next();
}
async function setGasPrice(transactionData, options) {
	if (!transactionData.gasData.price) transactionData.gasData.price = String(await getClient$1(options).getReferenceGasPrice());
}
async function setGasBudget(transactionData, options) {
	if (transactionData.gasData.budget) return;
	const dryRunResult = await getClient$1(options).dryRunTransactionBlock({ transactionBlock: transactionData.build({ overrides: { gasData: {
		budget: String(MAX_GAS),
		payment: []
	} } }) });
	if (dryRunResult.effects.status.status !== "success") throw new Error(`Dry run failed, could not automatically determine a budget: ${dryRunResult.effects.status.error}`, { cause: dryRunResult });
	const safeOverhead = GAS_SAFE_OVERHEAD * BigInt(transactionData.gasData.price || 1n);
	const baseComputationCostWithOverhead = BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;
	const gasBudget = baseComputationCostWithOverhead + BigInt(dryRunResult.effects.gasUsed.storageCost) - BigInt(dryRunResult.effects.gasUsed.storageRebate);
	transactionData.gasData.budget = String(gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead);
}
async function setGasPayment(transactionData, options) {
	if (!transactionData.gasData.payment) {
		const paymentCoins = (await getClient$1(options).getCoins({
			owner: transactionData.gasData.owner || transactionData.sender,
			coinType: IOTA_TYPE_ARG
		})).data.filter((coin) => {
			return !transactionData.inputs.find((input) => {
				if (input.Object?.ImmOrOwnedObject) return coin.coinObjectId === input.Object.ImmOrOwnedObject.objectId;
				return false;
			});
		}).map((coin) => ({
			objectId: coin.coinObjectId,
			digest: coin.digest,
			version: coin.version
		}));
		if (!paymentCoins.length) throw new Error("No valid gas coins found for the transaction.");
		transactionData.gasData.payment = paymentCoins.map((payment) => parse(ObjectRef$1, payment));
	}
}
async function resolveObjectReferences(transactionData, options) {
	const objectsToResolve = transactionData.inputs.filter((input) => {
		return input.UnresolvedObject && !(input.UnresolvedObject.version || input.UnresolvedObject?.initialSharedVersion);
	});
	const dedupedIds = [...new Set(objectsToResolve.map((input) => normalizeIotaObjectId(input.UnresolvedObject.objectId)))];
	const objectChunks = dedupedIds.length ? chunk(dedupedIds, MAX_OBJECTS_PER_FETCH) : [];
	const resolvedObjects = /* @__PURE__ */ new Map();
	const erroredObjects = /* @__PURE__ */ new Map();
	await Promise.all(objectChunks.map(async (chunk2) => {
		const chunkObjects = await getClient$1(options).multiGetObjects({
			ids: chunk2,
			options: { showOwner: true }
		});
		for (const object of chunkObjects) {
			const objectId = object.data?.objectId;
			if (objectId) {
				if (object.error || !object.data) {
					erroredObjects.set(objectId, object.error);
					return;
				}
				const owner = object.data.owner;
				const initialSharedVersion = owner && typeof owner === "object" && "Shared" in owner ? owner.Shared.initial_shared_version : null;
				resolvedObjects.set(objectId, {
					objectId,
					digest: object.data.digest,
					version: object.data.version,
					initialSharedVersion
				});
			}
		}
	}));
	if (erroredObjects.size > 0) throw new Error(`The following input objects are invalid: ${Array.from(erroredObjects).join(", ")}`);
	for (const [index, input] of transactionData.inputs.entries()) {
		if (!input.UnresolvedObject) continue;
		let updated;
		const id = normalizeIotaAddress(input.UnresolvedObject.objectId);
		const object = resolvedObjects.get(id);
		if (input.UnresolvedObject.initialSharedVersion ?? object?.initialSharedVersion) updated = Inputs.SharedObjectRef({
			objectId: id,
			initialSharedVersion: input.UnresolvedObject.initialSharedVersion || object?.initialSharedVersion,
			mutable: input.UnresolvedObject.mutable || isUsedAsMutable(transactionData, index)
		});
		else if (isUsedAsReceiving(transactionData, index)) updated = Inputs.ReceivingRef({
			objectId: id,
			digest: input.UnresolvedObject.digest ?? object?.digest,
			version: input.UnresolvedObject.version ?? object?.version
		});
		transactionData.inputs[transactionData.inputs.indexOf(input)] = updated ?? Inputs.ObjectRef({
			objectId: id,
			digest: input.UnresolvedObject.digest ?? object?.digest,
			version: input.UnresolvedObject.version ?? object?.version
		});
	}
}
async function normalizeInputs(transactionData, options) {
	const { inputs, commands } = transactionData;
	const moveCallsToResolve = [];
	const moveFunctionsToResolve = /* @__PURE__ */ new Set();
	commands.forEach((command) => {
		if (command.MoveCall) {
			if (command.MoveCall._argumentTypes) return;
			if (command.MoveCall.arguments.map((arg) => {
				if (arg.$kind === "Input") return transactionData.inputs[arg.Input];
				return null;
			}).some((input) => input?.UnresolvedPure || input?.UnresolvedObject && typeof input?.UnresolvedObject.mutable !== "boolean")) {
				const functionName = `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`;
				moveFunctionsToResolve.add(functionName);
				moveCallsToResolve.push(command.MoveCall);
			}
		}
		switch (command.$kind) {
			case "SplitCoins":
				command.SplitCoins.amounts.forEach((amount) => {
					normalizeRawArgument(amount, iotaBcs.U64, transactionData);
				});
				break;
			case "TransferObjects":
				normalizeRawArgument(command.TransferObjects.address, iotaBcs.Address, transactionData);
				break;
		}
	});
	const moveFunctionParameters = /* @__PURE__ */ new Map();
	if (moveFunctionsToResolve.size > 0) {
		const client = getClient$1(options);
		await Promise.all([...moveFunctionsToResolve].map(async (functionName) => {
			const [packageId, moduleId, functionId] = functionName.split("::");
			const def = await client.getNormalizedMoveFunction({
				package: packageId,
				module: moduleId,
				function: functionId
			});
			moveFunctionParameters.set(functionName, def.parameters.map((param) => normalizedTypeToMoveTypeSignature(param)));
		}));
	}
	if (moveCallsToResolve.length) await Promise.all(moveCallsToResolve.map(async (moveCall) => {
		const parameters = moveFunctionParameters.get(`${moveCall.package}::${moveCall.module}::${moveCall.function}`);
		if (!parameters) return;
		moveCall._argumentTypes = parameters.length > 0 && isTxContext(parameters.at(-1)) ? parameters.slice(0, parameters.length - 1) : parameters;
	}));
	commands.forEach((command) => {
		if (!command.MoveCall) return;
		const moveCall = command.MoveCall;
		const fnName = `${moveCall.package}::${moveCall.module}::${moveCall.function}`;
		const params = moveCall._argumentTypes;
		if (!params) return;
		if (params.length !== command.MoveCall.arguments.length) throw new Error(`Incorrect number of arguments for ${fnName}`);
		params.forEach((param, i) => {
			const arg = moveCall.arguments[i];
			if (arg.$kind !== "Input") return;
			const input = inputs[arg.Input];
			if (!input.UnresolvedPure && !input.UnresolvedObject) return;
			const inputValue = input.UnresolvedPure?.value ?? input.UnresolvedObject?.objectId;
			const inputIndex = inputs.indexOf(input);
			const schema = getPureBcsSchema(param.body);
			if (schema) {
				arg.type = "pure";
				inputs[inputIndex] = Inputs.Pure(schema.serialize(inputValue));
				return;
			}
			if (typeof inputValue !== "string") throw new Error(`Expect the argument to be an object id string, got ${JSON.stringify(inputValue, null, 2)}`);
			arg.type = "object";
			const unresolvedObject = input.UnresolvedPure ? {
				$kind: "UnresolvedObject",
				UnresolvedObject: { objectId: inputValue }
			} : input;
			inputs[inputIndex] = unresolvedObject;
		});
	});
}
function validate(transactionData) {
	transactionData.inputs.forEach((input, index) => {
		if (input.$kind !== "Object" && input.$kind !== "Pure") throw new Error(`Input at index ${index} has not been resolved.  Expected a Pure or Object input, but found ${JSON.stringify(input)}`);
	});
}
function normalizeRawArgument(arg, schema, transactionData) {
	if (arg.$kind !== "Input") return;
	const input = transactionData.inputs[arg.Input];
	if (input.$kind !== "UnresolvedPure") return;
	transactionData.inputs[arg.Input] = Inputs.Pure(schema.serialize(input.UnresolvedPure.value));
}
function isUsedAsMutable(transactionData, index) {
	let usedAsMutable = false;
	transactionData.getInputUses(index, (arg, tx) => {
		if (tx.MoveCall && tx.MoveCall._argumentTypes) {
			const argIndex = tx.MoveCall.arguments.indexOf(arg);
			usedAsMutable = tx.MoveCall._argumentTypes[argIndex].ref !== "&" || usedAsMutable;
		}
		if (tx.$kind === "MakeMoveVec" || tx.$kind === "MergeCoins" || tx.$kind === "SplitCoins") usedAsMutable = true;
	});
	return usedAsMutable;
}
function isUsedAsReceiving(transactionData, index) {
	let usedAsReceiving = false;
	transactionData.getInputUses(index, (arg, tx) => {
		if (tx.MoveCall && tx.MoveCall._argumentTypes) {
			const argIndex = tx.MoveCall.arguments.indexOf(arg);
			usedAsReceiving = isReceivingType(tx.MoveCall._argumentTypes[argIndex]) || usedAsReceiving;
		}
	});
	return usedAsReceiving;
}
function isReceivingType(type) {
	if (typeof type.body !== "object" || !("datatype" in type.body)) return false;
	return type.body.datatype.package === "0x2" && type.body.datatype.module === "transfer" && type.body.datatype.type === "Receiving";
}
function getClient$1(options) {
	if (!options.client) throw new Error(`No iota client passed to Transaction#build, but transaction data was not sufficient to build offline.`);
	return options.client;
}
function chunk(arr, size) {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/object.js
function createObjectMethods(makeObject) {
	function object(value) {
		return makeObject(value);
	}
	object.system = (options) => {
		const mutable = options?.mutable;
		if (mutable !== void 0) return object(Inputs.SharedObjectRef({
			objectId: "0x5",
			initialSharedVersion: 1,
			mutable
		}));
		return object({
			$kind: "UnresolvedObject",
			UnresolvedObject: {
				objectId: "0x5",
				initialSharedVersion: 1
			}
		});
	};
	object.clock = () => object(Inputs.SharedObjectRef({
		objectId: "0x6",
		initialSharedVersion: 1,
		mutable: false
	}));
	object.random = () => object({
		$kind: "UnresolvedObject",
		UnresolvedObject: {
			objectId: "0x8",
			mutable: false
		}
	});
	object.denyList = (options) => {
		return object({
			$kind: "UnresolvedObject",
			UnresolvedObject: {
				objectId: "0x403",
				mutable: options?.mutable
			}
		});
	};
	object.option = ({ type, value }) => (tx) => tx.moveCall({
		typeArguments: [type],
		target: `0x1::option::${value === null ? "none" : "some"}`,
		arguments: value === null ? [] : [tx.object(value)]
	});
	return object;
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/pure.js
function createPure(makePure) {
	function pure(typeOrSerializedValue, value) {
		if (typeof typeOrSerializedValue === "string") return makePure(pureBcsSchemaFromTypeName(typeOrSerializedValue).serialize(value));
		if (typeOrSerializedValue instanceof Uint8Array || isSerializedBcs(typeOrSerializedValue)) return makePure(typeOrSerializedValue);
		throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
	}
	pure.u8 = (value) => makePure(iotaBcs.U8.serialize(value));
	pure.u16 = (value) => makePure(iotaBcs.U16.serialize(value));
	pure.u32 = (value) => makePure(iotaBcs.U32.serialize(value));
	pure.u64 = (value) => makePure(iotaBcs.U64.serialize(value));
	pure.u128 = (value) => makePure(iotaBcs.U128.serialize(value));
	pure.u256 = (value) => makePure(iotaBcs.U256.serialize(value));
	pure.bool = (value) => makePure(iotaBcs.Bool.serialize(value));
	pure.string = (value) => makePure(iotaBcs.String.serialize(value));
	pure.address = (value) => makePure(iotaBcs.Address.serialize(value));
	pure.id = pure.address;
	pure.vector = (type, value) => {
		return makePure(iotaBcs.vector(pureBcsSchemaFromTypeName(type)).serialize(value));
	};
	pure.option = (type, value) => {
		return makePure(iotaBcs.option(pureBcsSchemaFromTypeName(type)).serialize(value));
	};
	return pure;
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/data/v1.js
var ObjectRef = /* @__PURE__ */ object({
	digest: /* @__PURE__ */ string(),
	objectId: /* @__PURE__ */ string(),
	version: /* @__PURE__ */ union([
		/* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()),
		/* @__PURE__ */ string(),
		/* @__PURE__ */ bigint()
	])
});
var NormalizedCallArg = safeEnum({
	Object: safeEnum({
		ImmOrOwned: ObjectRef,
		Shared: /* @__PURE__ */ object({
			objectId: ObjectID,
			initialSharedVersion: JsonU64,
			mutable: /* @__PURE__ */ boolean()
		}),
		Receiving: ObjectRef
	}),
	Pure: /* @__PURE__ */ array(/* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer()))
});
var TypeTag = /* @__PURE__ */ union([
	/* @__PURE__ */ object({ bool: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ u8: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ u64: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ u128: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ address: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ signer: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ vector: /* @__PURE__ */ lazy(() => TypeTag) }),
	/* @__PURE__ */ object({ struct: /* @__PURE__ */ lazy(() => StructTag) }),
	/* @__PURE__ */ object({ u16: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ u32: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) }),
	/* @__PURE__ */ object({ u256: /* @__PURE__ */ nullable(/* @__PURE__ */ literal(true)) })
]);
var StructTag = /* @__PURE__ */ object({
	address: /* @__PURE__ */ string(),
	module: /* @__PURE__ */ string(),
	name: /* @__PURE__ */ string(),
	typeParams: /* @__PURE__ */ array(TypeTag)
});
function transactionDataFromV1(data) {
	return parse(TransactionData, {
		version: 2,
		sender: data.sender ?? null,
		expiration: data.expiration ? "Epoch" in data.expiration ? { Epoch: data.expiration.Epoch } : { None: true } : null,
		gasData: {
			owner: data.gasConfig.owner ?? null,
			budget: data.gasConfig.budget?.toString() ?? null,
			price: data.gasConfig.price?.toString() ?? null,
			payment: data.gasConfig.payment?.map((ref) => ({
				digest: ref.digest,
				objectId: ref.objectId,
				version: ref.version.toString()
			})) ?? null
		},
		inputs: data.inputs.map((input) => {
			if (input.kind === "Input") {
				if (/* @__PURE__ */ is(NormalizedCallArg, input.value)) {
					const value = parse(NormalizedCallArg, input.value);
					if (value.Object) {
						if (value.Object.ImmOrOwned) return { Object: { ImmOrOwnedObject: {
							objectId: value.Object.ImmOrOwned.objectId,
							version: String(value.Object.ImmOrOwned.version),
							digest: value.Object.ImmOrOwned.digest
						} } };
						if (value.Object.Shared) return { Object: { SharedObject: {
							mutable: value.Object.Shared.mutable ?? null,
							initialSharedVersion: value.Object.Shared.initialSharedVersion,
							objectId: value.Object.Shared.objectId
						} } };
						if (value.Object.Receiving) return { Object: { Receiving: {
							digest: value.Object.Receiving.digest,
							version: String(value.Object.Receiving.version),
							objectId: value.Object.Receiving.objectId
						} } };
						throw new Error("Invalid object input");
					}
					return { Pure: { bytes: toBase64(new Uint8Array(value.Pure)) } };
				}
				if (input.type === "object") return { UnresolvedObject: { objectId: input.value } };
				return { UnresolvedPure: { value: input.value } };
			}
			throw new Error("Invalid input");
		}),
		commands: data.transactions.map((transaction) => {
			switch (transaction.kind) {
				case "MakeMoveVec": return { MakeMoveVec: {
					type: "Some" in transaction.type ? TypeTagSerializer.tagToString(transaction.type.Some) : null,
					elements: transaction.objects.map((arg) => parseV1TransactionArgument(arg))
				} };
				case "MergeCoins": return { MergeCoins: {
					destination: parseV1TransactionArgument(transaction.destination),
					sources: transaction.sources.map((arg) => parseV1TransactionArgument(arg))
				} };
				case "MoveCall": {
					const [pkg, mod, fn] = transaction.target.split("::");
					return { MoveCall: {
						package: pkg,
						module: mod,
						function: fn,
						typeArguments: transaction.typeArguments,
						arguments: transaction.arguments.map((arg) => parseV1TransactionArgument(arg))
					} };
				}
				case "Publish": return { Publish: {
					modules: transaction.modules.map((mod) => toBase64(Uint8Array.from(mod))),
					dependencies: transaction.dependencies
				} };
				case "SplitCoins": return { SplitCoins: {
					coin: parseV1TransactionArgument(transaction.coin),
					amounts: transaction.amounts.map((arg) => parseV1TransactionArgument(arg))
				} };
				case "TransferObjects": return { TransferObjects: {
					objects: transaction.objects.map((arg) => parseV1TransactionArgument(arg)),
					address: parseV1TransactionArgument(transaction.address)
				} };
				case "Upgrade": return { Upgrade: {
					modules: transaction.modules.map((mod) => toBase64(Uint8Array.from(mod))),
					dependencies: transaction.dependencies,
					package: transaction.packageId,
					ticket: parseV1TransactionArgument(transaction.ticket)
				} };
			}
			throw new Error(`Unknown transaction ${Object.keys(transaction)}`);
		})
	});
}
function parseV1TransactionArgument(arg) {
	switch (arg.kind) {
		case "GasCoin": return { GasCoin: true };
		case "Result": return { Result: arg.index };
		case "NestedResult": return { NestedResult: [arg.index, arg.resultIndex] };
		case "Input": return { Input: arg.index };
	}
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/hash.js
function hashTypedData(typeTag, data) {
	const typeTagBytes = Array.from(`${typeTag}::`).map((e) => e.charCodeAt(0));
	const dataWithTag = new Uint8Array(typeTagBytes.length + data.length);
	dataWithTag.set(typeTagBytes);
	dataWithTag.set(data, typeTagBytes.length);
	return blake2b(dataWithTag, { dkLen: 32 });
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/utils.js
function remapCommandArguments(command, inputMapping, commandMapping) {
	const remapArg = (arg) => {
		switch (arg.$kind) {
			case "Input": {
				const newInputIndex = inputMapping.get(arg.Input);
				if (newInputIndex === void 0) throw new Error(`Input ${arg.Input} not found in input mapping`);
				return {
					...arg,
					Input: newInputIndex
				};
			}
			case "Result": {
				const newCommandIndex = commandMapping.get(arg.Result);
				if (newCommandIndex !== void 0) return {
					...arg,
					Result: newCommandIndex
				};
				return arg;
			}
			case "NestedResult": {
				const newCommandIndex = commandMapping.get(arg.NestedResult[0]);
				if (newCommandIndex !== void 0) return {
					...arg,
					NestedResult: [newCommandIndex, arg.NestedResult[1]]
				};
				return arg;
			}
			default: return arg;
		}
	};
	switch (command.$kind) {
		case "MoveCall":
			command.MoveCall.arguments = command.MoveCall.arguments.map(remapArg);
			break;
		case "TransferObjects":
			command.TransferObjects.objects = command.TransferObjects.objects.map(remapArg);
			command.TransferObjects.address = remapArg(command.TransferObjects.address);
			break;
		case "SplitCoins":
			command.SplitCoins.coin = remapArg(command.SplitCoins.coin);
			command.SplitCoins.amounts = command.SplitCoins.amounts.map(remapArg);
			break;
		case "MergeCoins":
			command.MergeCoins.destination = remapArg(command.MergeCoins.destination);
			command.MergeCoins.sources = command.MergeCoins.sources.map(remapArg);
			break;
		case "MakeMoveVec":
			command.MakeMoveVec.elements = command.MakeMoveVec.elements.map(remapArg);
			break;
		case "Upgrade":
			command.Upgrade.ticket = remapArg(command.Upgrade.ticket);
			break;
		case "$Intent": {
			const inputs = command.$Intent.inputs;
			command.$Intent.inputs = {};
			for (const [key, value] of Object.entries(inputs)) command.$Intent.inputs[key] = Array.isArray(value) ? value.map(remapArg) : remapArg(value);
			break;
		}
		case "Publish": break;
	}
}
function getIdFromCallArg(arg) {
	if (typeof arg === "string") return normalizeIotaAddress(arg);
	if (arg.Object) {
		if (arg.Object.ImmOrOwnedObject) return normalizeIotaAddress(arg.Object.ImmOrOwnedObject.objectId);
		if (arg.Object.Receiving) return normalizeIotaAddress(arg.Object.Receiving.objectId);
		return normalizeIotaAddress(arg.Object.SharedObject.objectId);
	}
	if (arg.UnresolvedObject) return normalizeIotaAddress(arg.UnresolvedObject.objectId);
}
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/TransactionData.js
function prepareIotaAddress(address) {
	return normalizeIotaAddress(address).replace("0x", "");
}
var TransactionDataBuilder = class TransactionDataBuilder {
	constructor(clone) {
		this.version = 2;
		this.sender = clone?.sender ?? null;
		this.expiration = clone?.expiration ?? null;
		this.inputs = clone?.inputs ?? [];
		this.commands = clone?.commands ?? [];
		this.gasData = clone?.gasData ?? {
			budget: null,
			price: null,
			owner: null,
			payment: null
		};
	}
	static fromKindBytes(bytes) {
		const programmableTx = iotaBcs.TransactionKind.parse(bytes).ProgrammableTransaction;
		if (!programmableTx) throw new Error("Unable to deserialize from bytes.");
		return TransactionDataBuilder.restore({
			version: 2,
			sender: null,
			expiration: null,
			gasData: {
				budget: null,
				owner: null,
				payment: null,
				price: null
			},
			inputs: programmableTx.inputs,
			commands: programmableTx.commands
		});
	}
	static fromBytes(bytes) {
		const data = iotaBcs.TransactionData.parse(bytes)?.V1;
		const programmableTx = data.kind.ProgrammableTransaction;
		if (!data || !programmableTx) throw new Error("Unable to deserialize from bytes.");
		return TransactionDataBuilder.restore({
			version: 2,
			sender: data.sender,
			expiration: data.expiration,
			gasData: data.gasData,
			inputs: programmableTx.inputs,
			commands: programmableTx.commands
		});
	}
	static restore(data) {
		if (data.version === 2) return new TransactionDataBuilder(parse(TransactionData, data));
		else return new TransactionDataBuilder(parse(TransactionData, transactionDataFromV1(data)));
	}
	/**
	* Generate transaction digest.
	*
	* @param bytes BCS serialized transaction data
	* @returns transaction digest.
	*/
	static getDigestFromBytes(bytes) {
		return toBase58(hashTypedData("TransactionData", bytes));
	}
	build({ maxSizeBytes = Infinity, overrides, onlyTransactionKind } = {}) {
		const inputs = this.inputs;
		const commands = this.commands;
		const kind = { ProgrammableTransaction: {
			inputs,
			commands
		} };
		if (onlyTransactionKind) return iotaBcs.TransactionKind.serialize(kind, { maxSize: maxSizeBytes }).toBytes();
		const expiration = overrides?.expiration ?? this.expiration;
		const sender = overrides?.sender ?? this.sender;
		const gasData = {
			...this.gasData,
			...overrides?.gasConfig,
			...overrides?.gasData
		};
		if (!sender) throw new Error("Missing transaction sender");
		if (!gasData.budget) throw new Error("Missing gas budget");
		if (!gasData.payment) throw new Error("Missing gas payment");
		if (!gasData.price) throw new Error("Missing gas price");
		const transactionData = {
			sender: prepareIotaAddress(sender),
			expiration: expiration ? expiration : { None: true },
			gasData: {
				payment: gasData.payment,
				owner: prepareIotaAddress(this.gasData.owner ?? sender),
				price: BigInt(gasData.price),
				budget: BigInt(gasData.budget)
			},
			kind: { ProgrammableTransaction: {
				inputs,
				commands
			} }
		};
		return iotaBcs.TransactionData.serialize({ V1: transactionData }, { maxSize: maxSizeBytes }).toBytes();
	}
	addInput(type, arg) {
		const index = this.inputs.length;
		this.inputs.push(arg);
		return {
			Input: index,
			type,
			$kind: "Input"
		};
	}
	getInputUses(index, fn) {
		this.mapArguments((arg, command) => {
			if (arg.$kind === "Input" && arg.Input === index) fn(arg, command);
			return arg;
		});
	}
	mapCommandArguments(index, fn) {
		const command = this.commands[index];
		switch (command.$kind) {
			case "MoveCall":
				command.MoveCall.arguments = command.MoveCall.arguments.map((arg) => fn(arg, command, index));
				break;
			case "TransferObjects":
				command.TransferObjects.objects = command.TransferObjects.objects.map((arg) => fn(arg, command, index));
				command.TransferObjects.address = fn(command.TransferObjects.address, command, index);
				break;
			case "SplitCoins":
				command.SplitCoins.coin = fn(command.SplitCoins.coin, command, index);
				command.SplitCoins.amounts = command.SplitCoins.amounts.map((arg) => fn(arg, command, index));
				break;
			case "MergeCoins":
				command.MergeCoins.destination = fn(command.MergeCoins.destination, command, index);
				command.MergeCoins.sources = command.MergeCoins.sources.map((arg) => fn(arg, command, index));
				break;
			case "MakeMoveVec":
				command.MakeMoveVec.elements = command.MakeMoveVec.elements.map((arg) => fn(arg, command, index));
				break;
			case "Upgrade":
				command.Upgrade.ticket = fn(command.Upgrade.ticket, command, index);
				break;
			case "$Intent":
				const inputs = command.$Intent.inputs;
				command.$Intent.inputs = {};
				for (const [key, value] of Object.entries(inputs)) command.$Intent.inputs[key] = Array.isArray(value) ? value.map((arg) => fn(arg, command, index)) : fn(value, command, index);
				break;
			case "Publish": break;
			default: throw new Error(`Unexpected transaction kind: ${command.$kind}`);
		}
	}
	mapArguments(fn) {
		for (const commandIndex of this.commands.keys()) this.mapCommandArguments(commandIndex, fn);
	}
	replaceCommand(index, replacement, resultIndex = index) {
		if (!Array.isArray(replacement)) {
			this.commands[index] = replacement;
			return;
		}
		const sizeDiff = replacement.length - 1;
		this.commands.splice(index, 1, ...structuredClone(replacement));
		this.mapArguments((arg, _command, commandIndex) => {
			if (commandIndex < index + replacement.length) return arg;
			if (typeof resultIndex !== "number") {
				if (arg.$kind === "Result" && arg.Result === index || arg.$kind === "NestedResult" && arg.NestedResult[0] === index) if (!("NestedResult" in arg) || arg.NestedResult[1] === 0) return parse(Argument$1, structuredClone(resultIndex));
				else throw new Error(`Cannot replace command ${index} with a specific result type: NestedResult[${index}, ${arg.NestedResult[1]}] references a nested element that cannot be mapped to the replacement result`);
			}
			switch (arg.$kind) {
				case "Result":
					if (arg.Result === index && typeof resultIndex === "number") arg.Result = resultIndex;
					if (arg.Result > index) arg.Result += sizeDiff;
					break;
				case "NestedResult":
					if (arg.NestedResult[0] === index && typeof resultIndex === "number") return {
						$kind: "NestedResult",
						NestedResult: [resultIndex, arg.NestedResult[1]]
					};
					if (arg.NestedResult[0] > index) arg.NestedResult[0] += sizeDiff;
					break;
			}
			return arg;
		});
	}
	replaceCommandWithTransaction(index, otherTransaction, result) {
		if (result.$kind !== "Result" && result.$kind !== "NestedResult") throw new Error("Result must be of kind Result or NestedResult");
		this.insertTransaction(index, otherTransaction);
		this.replaceCommand(index + otherTransaction.commands.length, [], "Result" in result ? { NestedResult: [result.Result + index, 0] } : { NestedResult: [result.NestedResult[0] + index, result.NestedResult[1]] });
	}
	insertTransaction(atCommandIndex, otherTransaction) {
		const inputMapping = /* @__PURE__ */ new Map();
		const commandMapping = /* @__PURE__ */ new Map();
		for (let i = 0; i < otherTransaction.inputs.length; i++) {
			const otherInput = otherTransaction.inputs[i];
			const id = getIdFromCallArg(otherInput);
			let existingIndex = -1;
			if (id !== void 0) {
				existingIndex = this.inputs.findIndex((input) => getIdFromCallArg(input) === id);
				if (existingIndex !== -1 && this.inputs[existingIndex].Object?.SharedObject && otherInput.Object?.SharedObject) this.inputs[existingIndex].Object.SharedObject.mutable = this.inputs[existingIndex].Object.SharedObject.mutable || otherInput.Object.SharedObject.mutable;
			}
			if (existingIndex !== -1) inputMapping.set(i, existingIndex);
			else {
				const newIndex = this.inputs.length;
				this.inputs.push(otherInput);
				inputMapping.set(i, newIndex);
			}
		}
		for (let i = 0; i < otherTransaction.commands.length; i++) commandMapping.set(i, atCommandIndex + i);
		const remappedCommands = [];
		for (let i = 0; i < otherTransaction.commands.length; i++) {
			const command = structuredClone(otherTransaction.commands[i]);
			remapCommandArguments(command, inputMapping, commandMapping);
			remappedCommands.push(command);
		}
		this.commands.splice(atCommandIndex, 0, ...remappedCommands);
		const sizeDiff = remappedCommands.length;
		if (sizeDiff > 0) this.mapArguments((arg, _command, commandIndex) => {
			if (commandIndex >= atCommandIndex && commandIndex < atCommandIndex + remappedCommands.length) return arg;
			switch (arg.$kind) {
				case "Result":
					if (arg.Result >= atCommandIndex) arg.Result += sizeDiff;
					break;
				case "NestedResult":
					if (arg.NestedResult[0] >= atCommandIndex) arg.NestedResult[0] += sizeDiff;
					break;
			}
			return arg;
		});
	}
	getDigest() {
		const bytes = this.build({ onlyTransactionKind: false });
		return TransactionDataBuilder.getDigestFromBytes(bytes);
	}
	snapshot() {
		return parse(TransactionData, this);
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/transactions/Transaction.js
var __typeError$1 = (msg) => {
	throw TypeError(msg);
};
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$1 = (obj, member, value, setter) => (__accessCheck$1(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod$1 = (obj, member, method) => (__accessCheck$1(obj, member, "access private method"), method);
var _serializationPlugins;
var _buildPlugins;
var _intentResolvers;
var _data;
var _Transaction_instances;
var normalizeTransactionArgument_fn;
var resolveArgument_fn;
var prepareBuild_fn;
var runPlugins_fn;
function createTransactionResult(index, length = Infinity) {
	const baseResult = {
		$kind: "Result",
		Result: index
	};
	const nestedResults = [];
	const nestedResultFor = (resultIndex) => nestedResults[resultIndex] ?? (nestedResults[resultIndex] = {
		$kind: "NestedResult",
		NestedResult: [index, resultIndex]
	});
	return new Proxy(baseResult, {
		set() {
			throw new Error("The transaction result is a proxy, and does not support setting properties directly");
		},
		get(target, property) {
			if (property in target) return Reflect.get(target, property);
			if (property === Symbol.iterator) return function* () {
				let i = 0;
				while (i < length) {
					yield nestedResultFor(i);
					i++;
				}
			};
			if (typeof property === "symbol") return;
			const resultIndex = parseInt(property, 10);
			if (Number.isNaN(resultIndex) || resultIndex < 0) return;
			return nestedResultFor(resultIndex);
		}
	});
}
var TRANSACTION_BRAND = /* @__PURE__ */ Symbol.for("@iota/transaction");
function isTransaction(obj) {
	return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
}
var modulePluginRegistry = {
	buildPlugins: /* @__PURE__ */ new Map(),
	serializationPlugins: /* @__PURE__ */ new Map()
};
var TRANSACTION_REGISTRY_KEY = /* @__PURE__ */ Symbol.for("@iota/transaction/registry");
function getGlobalPluginRegistry() {
	try {
		const target = globalThis;
		if (!target[TRANSACTION_REGISTRY_KEY]) target[TRANSACTION_REGISTRY_KEY] = modulePluginRegistry;
		return target[TRANSACTION_REGISTRY_KEY];
	} catch (e) {
		return modulePluginRegistry;
	}
}
var _Transaction = class _Transaction {
	constructor() {
		__privateAdd$1(this, _Transaction_instances);
		__privateAdd$1(this, _serializationPlugins);
		__privateAdd$1(this, _buildPlugins);
		__privateAdd$1(this, _intentResolvers, /* @__PURE__ */ new Map());
		__privateAdd$1(this, _data);
		/**
		* Add a new object input to the transaction.
		*/
		this.object = createObjectMethods((value) => {
			if (typeof value === "function") return this.object(value(this));
			if (typeof value === "object" && /* @__PURE__ */ is(Argument$1, value)) return value;
			const id = getIdFromCallArg(value);
			const inserted = __privateGet$1(this, _data).inputs.find((i) => id === getIdFromCallArg(i));
			if (inserted?.Object?.SharedObject && typeof value === "object" && value.Object?.SharedObject) inserted.Object.SharedObject.mutable = inserted.Object.SharedObject.mutable || value.Object.SharedObject.mutable;
			return inserted ? {
				$kind: "Input",
				Input: __privateGet$1(this, _data).inputs.indexOf(inserted),
				type: "object"
			} : __privateGet$1(this, _data).addInput("object", typeof value === "string" ? {
				$kind: "UnresolvedObject",
				UnresolvedObject: { objectId: normalizeIotaAddress(value) }
			} : value);
		});
		const globalPlugins = getGlobalPluginRegistry();
		__privateSet$1(this, _data, new TransactionDataBuilder());
		__privateSet$1(this, _buildPlugins, [...globalPlugins.buildPlugins.values()]);
		__privateSet$1(this, _serializationPlugins, [...globalPlugins.serializationPlugins.values()]);
	}
	/**
	* Converts from a serialize transaction kind (built with `build({ onlyTransactionKind: true })`) to a `Transaction` class.
	* Supports either a byte array, or base64-encoded bytes.
	*/
	static fromKind(serialized) {
		const tx = new _Transaction();
		__privateSet$1(tx, _data, TransactionDataBuilder.fromKindBytes(typeof serialized === "string" ? fromBase64(serialized) : serialized));
		return tx;
	}
	/**
	* Converts from a serialized transaction format to a `Transaction` class.
	* There are two supported serialized formats:
	* - A string returned from `Transaction#serialize`. The serialized format must be compatible, or it will throw an error.
	* - A byte array (or base64-encoded bytes) containing BCS transaction data.
	*/
	static from(transaction) {
		const newTransaction = new _Transaction();
		if (isTransaction(transaction)) __privateSet$1(newTransaction, _data, new TransactionDataBuilder(transaction.getData()));
		else if (typeof transaction !== "string" || !transaction.startsWith("{")) __privateSet$1(newTransaction, _data, TransactionDataBuilder.fromBytes(typeof transaction === "string" ? fromBase64(transaction) : transaction));
		else __privateSet$1(newTransaction, _data, TransactionDataBuilder.restore(JSON.parse(transaction)));
		return newTransaction;
	}
	static registerGlobalSerializationPlugin(stepOrName, step) {
		getGlobalPluginRegistry().serializationPlugins.set(stepOrName, step ?? stepOrName);
	}
	static unregisterGlobalSerializationPlugin(name) {
		getGlobalPluginRegistry().serializationPlugins.delete(name);
	}
	static registerGlobalBuildPlugin(stepOrName, step) {
		getGlobalPluginRegistry().buildPlugins.set(stepOrName, step ?? stepOrName);
	}
	static unregisterGlobalBuildPlugin(name) {
		getGlobalPluginRegistry().buildPlugins.delete(name);
	}
	addSerializationPlugin(step) {
		__privateGet$1(this, _serializationPlugins).push(step);
	}
	addBuildPlugin(step) {
		__privateGet$1(this, _buildPlugins).push(step);
	}
	addIntentResolver(intent, resolver) {
		if (__privateGet$1(this, _intentResolvers).has(intent) && __privateGet$1(this, _intentResolvers).get(intent) !== resolver) throw new Error(`Intent resolver for ${intent} already exists`);
		__privateGet$1(this, _intentResolvers).set(intent, resolver);
	}
	setSender(sender) {
		__privateGet$1(this, _data).sender = sender;
	}
	/**
	* Sets the sender only if it has not already been set.
	* This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
	*/
	setSenderIfNotSet(sender) {
		if (!__privateGet$1(this, _data).sender) __privateGet$1(this, _data).sender = sender;
	}
	setExpiration(expiration) {
		__privateGet$1(this, _data).expiration = expiration ? parse(TransactionExpiration$2, expiration) : null;
	}
	setGasPrice(price) {
		__privateGet$1(this, _data).gasData.price = String(price);
	}
	setGasBudget(budget) {
		__privateGet$1(this, _data).gasData.budget = String(budget);
	}
	setGasBudgetIfNotSet(budget) {
		if (__privateGet$1(this, _data).gasData.budget == null) __privateGet$1(this, _data).gasData.budget = String(budget);
	}
	setGasOwner(owner) {
		__privateGet$1(this, _data).gasData.owner = owner;
	}
	setGasPayment(payments) {
		__privateGet$1(this, _data).gasData.payment = payments.map((payment) => parse(ObjectRef$1, payment));
	}
	/** Get a snapshot of the transaction data, in JSON form: */
	getData() {
		return __privateGet$1(this, _data).snapshot();
	}
	get [TRANSACTION_BRAND]() {
		return true;
	}
	get pure() {
		Object.defineProperty(this, "pure", {
			enumerable: false,
			value: createPure((value) => {
				if (isSerializedBcs(value)) return __privateGet$1(this, _data).addInput("pure", {
					$kind: "Pure",
					Pure: { bytes: value.toBase64() }
				});
				return __privateGet$1(this, _data).addInput("pure", /* @__PURE__ */ is(NormalizedCallArg$1, value) ? parse(NormalizedCallArg$1, value) : value instanceof Uint8Array ? Inputs.Pure(value) : {
					$kind: "UnresolvedPure",
					UnresolvedPure: { value }
				});
			})
		});
		return this.pure;
	}
	/** Returns an argument for the gas coin, to be used in a transaction. */
	get gas() {
		return {
			$kind: "GasCoin",
			GasCoin: true
		};
	}
	/**
	* Add a new object input to the transaction using the fully-resolved object reference.
	* If you only have an object ID, use `builder.object(id)` instead.
	*/
	objectRef(...args) {
		return this.object(Inputs.ObjectRef(...args));
	}
	/**
	* Add a new receiving input to the transaction using the fully-resolved object reference.
	* If you only have an object ID, use `builder.object(id)` instead.
	*/
	receivingRef(...args) {
		return this.object(Inputs.ReceivingRef(...args));
	}
	/**
	* Add a new shared object input to the transaction using the fully-resolved shared object reference.
	* If you only have an object ID, use `builder.object(id)` instead.
	*/
	sharedObjectRef(...args) {
		return this.object(Inputs.SharedObjectRef(...args));
	}
	/** Add a transaction to the transaction */
	add(command) {
		if (typeof command === "function") return command(this);
		return createTransactionResult(__privateGet$1(this, _data).commands.push(command) - 1);
	}
	splitCoins(coin, amounts) {
		const command = Commands.SplitCoins(typeof coin === "string" ? this.object(coin) : __privateMethod$1(this, _Transaction_instances, resolveArgument_fn).call(this, coin), amounts.map((amount) => typeof amount === "number" || typeof amount === "bigint" || typeof amount === "string" ? this.pure.u64(amount) : __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, amount)));
		return createTransactionResult(__privateGet$1(this, _data).commands.push(command) - 1, amounts.length);
	}
	mergeCoins(destination, sources) {
		return this.add(Commands.MergeCoins(this.object(destination), sources.map((src) => this.object(src))));
	}
	publish({ modules, dependencies }) {
		return this.add(Commands.Publish({
			modules,
			dependencies
		}));
	}
	upgrade({ modules, dependencies, package: packageId, ticket }) {
		return this.add(Commands.Upgrade({
			modules,
			dependencies,
			package: packageId,
			ticket: this.object(ticket)
		}));
	}
	moveCall({ arguments: args, ...input }) {
		return this.add(Commands.MoveCall({
			...input,
			arguments: args?.map((arg) => __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, arg))
		}));
	}
	transferObjects(objects, address) {
		return this.add(Commands.TransferObjects(objects.map((obj) => this.object(obj)), typeof address === "string" ? this.pure.address(address) : __privateMethod$1(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, address)));
	}
	makeMoveVec({ type, elements }) {
		return this.add(Commands.MakeMoveVec({
			type,
			elements: elements.map((obj) => this.object(obj))
		}));
	}
	async toJSON(options = {}) {
		await this.prepareForSerialization(options);
		return JSON.stringify(parse(SerializedTransactionDataV2, __privateGet$1(this, _data).snapshot()), (_key, value) => typeof value === "bigint" ? value.toString() : value, 2);
	}
	/** Build the transaction to BCS bytes, and sign it with the provided keypair. */
	async sign(options) {
		const { signer, ...buildOptions } = options;
		const bytes = await this.build(buildOptions);
		return signer.signTransaction(bytes);
	}
	/** Build the transaction to BCS bytes. */
	async build(options = {}) {
		await this.prepareForSerialization(options);
		await __privateMethod$1(this, _Transaction_instances, prepareBuild_fn).call(this, options);
		return __privateGet$1(this, _data).build({
			maxSizeBytes: options.maxSizeBytes,
			onlyTransactionKind: options.onlyTransactionKind
		});
	}
	/** Derive transaction digest */
	async getDigest(options = {}) {
		await __privateMethod$1(this, _Transaction_instances, prepareBuild_fn).call(this, options);
		return __privateGet$1(this, _data).getDigest();
	}
	/**
	* Get the signing digest for transaction bytes.
	* This is the Blake2b hash of the intent message that Ledger displays.
	*/
	async getSigningDigest() {
		const transactionBytes = await this.build();
		return "0x" + toHex(Signer.signingDigest(transactionBytes, "TransactionData"));
	}
	async prepareForSerialization(options) {
		const intents = /* @__PURE__ */ new Set();
		for (const command of __privateGet$1(this, _data).commands) if (command.$Intent) intents.add(command.$Intent.name);
		const steps = [...__privateGet$1(this, _serializationPlugins)];
		for (const intent of intents) {
			if (options.supportedIntents?.includes(intent)) continue;
			if (!__privateGet$1(this, _intentResolvers).has(intent)) throw new Error(`Missing intent resolver for ${intent}`);
			steps.push(__privateGet$1(this, _intentResolvers).get(intent));
		}
		await __privateMethod$1(this, _Transaction_instances, runPlugins_fn).call(this, steps, options);
	}
};
_serializationPlugins = /* @__PURE__ */ new WeakMap();
_buildPlugins = /* @__PURE__ */ new WeakMap();
_intentResolvers = /* @__PURE__ */ new WeakMap();
_data = /* @__PURE__ */ new WeakMap();
_Transaction_instances = /* @__PURE__ */ new WeakSet();
normalizeTransactionArgument_fn = function(arg) {
	if (isSerializedBcs(arg)) return this.pure(arg);
	return __privateMethod$1(this, _Transaction_instances, resolveArgument_fn).call(this, arg);
};
resolveArgument_fn = function(arg) {
	if (typeof arg === "function") return parse(Argument$1, arg(this));
	return parse(Argument$1, arg);
};
prepareBuild_fn = async function(options) {
	if (!options.onlyTransactionKind && !__privateGet$1(this, _data).sender) throw new Error("Missing transaction sender");
	await __privateMethod$1(this, _Transaction_instances, runPlugins_fn).call(this, [...__privateGet$1(this, _buildPlugins), resolveTransactionData], options);
};
runPlugins_fn = async function(plugins, options) {
	const createNext = (i) => {
		if (i >= plugins.length) return () => {};
		const plugin = plugins[i];
		return async () => {
			const next = createNext(i + 1);
			let calledNext = false;
			let nextResolved = false;
			await plugin(__privateGet$1(this, _data), options, async () => {
				if (calledNext) throw new Error(`next() was call multiple times in TransactionPlugin ${i}`);
				calledNext = true;
				await next();
				nextResolved = true;
			});
			if (!calledNext) throw new Error(`next() was not called in TransactionPlugin ${i}`);
			if (!nextResolved) throw new Error(`next() was not awaited in TransactionPlugin ${i}`);
		};
	};
	await createNext(0)();
};
var Transaction = _Transaction;
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/client/client.js
var IOTA_CLIENT_BRAND = /* @__PURE__ */ Symbol.for("@iota/IotaClient");
var PROTOCOL_VERSION_V2_SYSTEM_STATE = 5;
var PROTOCOL_VERSION_IIP8 = 20;
function mapValidatorsWithEffectiveCommission(validators, protocolVersion) {
	const isIIP8Active = protocolVersion >= PROTOCOL_VERSION_IIP8;
	return validators.map((v) => ({
		...v,
		effectiveCommissionRate: isIIP8Active ? v.effectiveCommissionRate ?? String(Math.max(Number(v.commissionRate), Number(v.votingPower))) : v.commissionRate
	}));
}
var IotaClient = class {
	get [IOTA_CLIENT_BRAND]() {
		return true;
	}
	/**
	* Establish a connection to an IOTA RPC endpoint
	*
	* @param options configuration options for the API Client
	*/
	constructor(options) {
		this.transport = options.transport ?? new IotaHTTPTransport({ url: options.url });
	}
	async getRpcApiVersion({ signal } = {}) {
		return (await this.transport.request({
			method: "rpc.discover",
			params: [],
			signal
		})).info.version;
	}
	/**
	* Get all Coin<`coin_type`> objects owned by an address.
	*/
	async getCoins(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getCoins",
			params: [
				input.owner,
				input.coinType,
				input.cursor,
				input.limit
			],
			signal: input.signal
		});
	}
	/**
	* Get all Coin objects owned by an address.
	*/
	async getAllCoins(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getAllCoins",
			params: [
				input.owner,
				input.cursor,
				input.limit
			],
			signal: input.signal
		});
	}
	/**
	* Get the total coin balance for one coin type, owned by the address owner.
	*/
	async getBalance(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getBalance",
			params: [input.owner, input.coinType],
			signal: input.signal
		});
	}
	/**
	* Get the total coin balance for all coin types, owned by the address owner.
	*/
	async getAllBalances(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getAllBalances",
			params: [input.owner],
			signal: input.signal
		});
	}
	/**
	* Fetch CoinMetadata for a given coin type
	*/
	async getCoinMetadata(input) {
		return await this.transport.request({
			method: "iotax_getCoinMetadata",
			params: [input.coinType],
			signal: input.signal
		});
	}
	/**
	*  Fetch total supply for a coin
	*/
	async getTotalSupply(input) {
		return await this.transport.request({
			method: "iotax_getTotalSupply",
			params: [input.coinType],
			signal: input.signal
		});
	}
	/**
	*  Fetch circulating supply for a coin
	*/
	async getCirculatingSupply({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getCirculatingSupply",
			params: [],
			signal
		});
	}
	/**
	* Invoke any RPC method
	* @param method the method to be invoked
	* @param args the arguments to be passed to the RPC request
	*/
	async call(method, params, { signal } = {}) {
		return await this.transport.request({
			method,
			params,
			signal
		});
	}
	/**
	* Get Move function argument types like read, write and full access
	*/
	async getMoveFunctionArgTypes(input) {
		return await this.transport.request({
			method: "iota_getMoveFunctionArgTypes",
			params: [
				input.package,
				input.module,
				input.function
			],
			signal: input.signal
		});
	}
	/**
	* Get a map from module name to
	* structured representations of Move modules
	*/
	async getNormalizedMoveModulesByPackage(input) {
		return await this.transport.request({
			method: "iota_getNormalizedMoveModulesByPackage",
			params: [input.package],
			signal: input.signal
		});
	}
	/**
	* Get a structured representation of Move module
	*/
	async getNormalizedMoveModule(input) {
		return await this.transport.request({
			method: "iota_getNormalizedMoveModule",
			params: [input.package, input.module],
			signal: input.signal
		});
	}
	/**
	* Get a structured representation of Move function
	*/
	async getNormalizedMoveFunction(input) {
		return await this.transport.request({
			method: "iota_getNormalizedMoveFunction",
			params: [
				input.package,
				input.module,
				input.function
			],
			signal: input.signal
		});
	}
	/**
	* Get a structured representation of Move struct
	*/
	async getNormalizedMoveStruct(input) {
		return await this.transport.request({
			method: "iota_getNormalizedMoveStruct",
			params: [
				input.package,
				input.module,
				input.struct
			],
			signal: input.signal
		});
	}
	/**
	* Get all objects owned by an address
	*/
	async getOwnedObjects(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getOwnedObjects",
			params: [
				input.owner,
				{
					filter: input.filter,
					options: input.options
				},
				input.cursor,
				input.limit
			],
			signal: input.signal
		});
	}
	/**
	* Get details about an object
	*/
	async getObject(input) {
		if (!input.id || !isValidIotaObjectId(normalizeIotaObjectId(input.id))) throw new Error("Invalid IOTA Object id");
		return await this.transport.request({
			method: "iota_getObject",
			params: [input.id, input.options],
			signal: input.signal
		});
	}
	async tryGetPastObject(input) {
		return await this.transport.request({
			method: "iota_tryGetPastObject",
			params: [
				input.id,
				input.version,
				input.options
			],
			signal: input.signal
		});
	}
	/**
	* Batch get details about a list of objects. If any of the object ids are duplicates the call will fail
	*/
	async multiGetObjects(input) {
		input.ids.forEach((id) => {
			if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) throw new Error(`Invalid IOTA Object id ${id}`);
		});
		if (input.ids.length !== new Set(input.ids).size) throw new Error(`Duplicate object ids in batch call ${input.ids}`);
		return await this.transport.request({
			method: "iota_multiGetObjects",
			params: [input.ids, input.options],
			signal: input.signal
		});
	}
	/**
	* Get transaction blocks for a given query criteria
	*/
	async queryTransactionBlocks(input) {
		return await this.transport.request({
			method: "iotax_queryTransactionBlocks",
			params: [
				{
					filter: input.filter,
					options: input.options
				},
				input.cursor,
				input.limit,
				(input.order || "ascending") === "descending"
			],
			signal: input.signal
		});
	}
	async getTransactionBlock(input) {
		if (!isValidTransactionDigest(input.digest)) throw new Error("Invalid Transaction digest");
		return await this.transport.request({
			method: "iota_getTransactionBlock",
			params: [input.digest, input.options],
			signal: input.signal
		});
	}
	async multiGetTransactionBlocks(input) {
		input.digests.forEach((d) => {
			if (!isValidTransactionDigest(d)) throw new Error(`Invalid Transaction digest ${d}`);
		});
		if (input.digests.length !== new Set(input.digests).size) throw new Error(`Duplicate digests in batch call ${input.digests}`);
		return await this.transport.request({
			method: "iota_multiGetTransactionBlocks",
			params: [input.digests, input.options],
			signal: input.signal
		});
	}
	async executeTransactionBlock({ transactionBlock, signature, options, signal }) {
		return await this.transport.request({
			method: "iota_executeTransactionBlock",
			params: [
				typeof transactionBlock === "string" ? transactionBlock : toBase64(transactionBlock),
				Array.isArray(signature) ? signature : [signature],
				options
			],
			signal
		});
	}
	async signAndExecuteTransaction({ transaction, signer, ...input }) {
		let transactionBytes;
		if (transaction instanceof Uint8Array) transactionBytes = transaction;
		else {
			transaction.setSenderIfNotSet(signer.toIotaAddress());
			transactionBytes = await transaction.build({ client: this });
		}
		const { signature, bytes } = await signer.signTransaction(transactionBytes);
		return this.executeTransactionBlock({
			transactionBlock: bytes,
			signature,
			...input
		});
	}
	/**
	* Get total number of transactions
	*/
	async getTotalTransactionBlocks({ signal } = {}) {
		const resp = await this.transport.request({
			method: "iota_getTotalTransactionBlocks",
			params: [],
			signal
		});
		return BigInt(resp);
	}
	/**
	* Getting the reference gas price for the network
	*/
	async getReferenceGasPrice({ signal } = {}) {
		const resp = await this.transport.request({
			method: "iotax_getReferenceGasPrice",
			params: [],
			signal
		});
		return BigInt(resp);
	}
	/**
	* Return the delegated stakes for an address
	*/
	async getStakes(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getStakes",
			params: [input.owner],
			signal: input.signal
		});
	}
	/**
	* Return the timelocked delegated stakes for an address
	*/
	async getTimelockedStakes(input) {
		if (!input.owner || !isValidIotaAddress(normalizeIotaAddress(input.owner))) throw new Error("Invalid IOTA address");
		return await this.transport.request({
			method: "iotax_getTimelockedStakes",
			params: [input.owner],
			signal: input.signal
		});
	}
	/**
	* Return the delegated stakes queried by id.
	*/
	async getStakesByIds(input) {
		input.stakedIotaIds.forEach((id) => {
			if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) throw new Error(`Invalid IOTA Stake id ${id}`);
		});
		return await this.transport.request({
			method: "iotax_getStakesByIds",
			params: [input.stakedIotaIds],
			signal: input.signal
		});
	}
	/**
	* Return the timelocked delegated stakes queried by id.
	*/
	async getTimelockedStakesByIds(input) {
		input.timelockedStakedIotaIds.forEach((id) => {
			if (!id || !isValidIotaObjectId(normalizeIotaObjectId(id))) throw new Error(`Invalid IOTA Timelocked Stake id ${id}`);
		});
		return await this.transport.request({
			method: "iotax_getTimelockedStakesByIds",
			params: [input.timelockedStakedIotaIds],
			signal: input.signal
		});
	}
	/**
	* Return the latest IOTA system state object on networks supporting protocol version `< 5`.
	* These are networks with node software release version `< 0.11`.
	* @deprecated Use `getLatestIotaSystemState` instead.
	*/
	async getLatestIotaSystemStateV1({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getLatestIotaSystemState",
			params: [],
			signal
		});
	}
	/**
	* Return the latest IOTA system state object on networks supporting protocol version `>= 5`.
	* These are networks with node software release version `>= 0.11`.
	*
	* You probably want to use `getLatestIotaSystemState` instead to prevent issues with future deprecations
	* or in case the node does not support protocol version `>= 5`.
	*/
	async getLatestIotaSystemStateV2({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getLatestIotaSystemStateV2",
			params: [],
			signal
		});
	}
	/**
	* Return the latest supported IOTA system state object.
	*
	* This returns a backwards-compatible system state object that dynamically uses the V1 or V2
	* depending on the protocol version supported by the node. This method will continue to be supported
	* as more protocol versions are released with changes to the system state.
	*
	* This is quite useful in case your app does not know in advance what node is it going to be using,
	* this way you as developer dont need to handle each possible system state variant,
	* this is already handled by this method.
	*/
	async getLatestIotaSystemState({ signal } = {}) {
		const protocolConfig = await this.getProtocolConfig({ signal });
		const iotaSystemStateSummary = Number(protocolConfig.maxSupportedProtocolVersion) >= PROTOCOL_VERSION_V2_SYSTEM_STATE ? await this.getLatestIotaSystemStateV2({ signal }) : { V1: await this.getLatestIotaSystemStateV1({ signal }) };
		const activeValidators = mapValidatorsWithEffectiveCommission(("V2" in iotaSystemStateSummary ? iotaSystemStateSummary.V2 : iotaSystemStateSummary.V1).activeValidators, Number(protocolConfig.protocolVersion));
		return "V2" in iotaSystemStateSummary ? {
			...iotaSystemStateSummary.V2,
			activeValidators,
			committeeMembers: iotaSystemStateSummary.V2.committeeMembers.map((committeeMemberIndex) => activeValidators[Number(committeeMemberIndex)])
		} : {
			...iotaSystemStateSummary.V1,
			activeValidators,
			committeeMembers: activeValidators,
			safeModeComputationCharges: iotaSystemStateSummary.V1.safeModeComputationRewards,
			safeModeComputationChargesBurned: iotaSystemStateSummary.V1.safeModeComputationRewards
		};
	}
	/**
	* Get events for a given query criteria
	*/
	async queryEvents(input) {
		return await this.transport.request({
			method: "iotax_queryEvents",
			params: [
				input.query,
				input.cursor,
				input.limit,
				(input.order || "ascending") === "descending"
			],
			signal: input.signal
		});
	}
	/**
	* Subscribe to get notifications whenever an event matching the filter occurs
	*
	* @deprecated
	*/
	async subscribeEvent(input) {
		return this.transport.subscribe({
			method: "iotax_subscribeEvent",
			unsubscribe: "iotax_unsubscribeEvent",
			params: [input.filter],
			onMessage: input.onMessage,
			signal: input.signal
		});
	}
	/**
	* @deprecated
	*/
	async subscribeTransaction(input) {
		return this.transport.subscribe({
			method: "iotax_subscribeTransaction",
			unsubscribe: "iotax_unsubscribeTransaction",
			params: [input.filter],
			onMessage: input.onMessage,
			signal: input.signal
		});
	}
	/**
	* Runs the transaction block in dev-inspect mode. Which allows for nearly any
	* transaction (or Move call) with any arguments. Detailed results are
	* provided, including both the transaction effects and any return values.
	*/
	async devInspectTransactionBlock(input) {
		let devInspectTxBytes;
		if (isTransaction(input.transactionBlock)) {
			input.transactionBlock.setSenderIfNotSet(input.sender);
			devInspectTxBytes = toBase64(await input.transactionBlock.build({
				client: this,
				onlyTransactionKind: true
			}));
		} else if (typeof input.transactionBlock === "string") devInspectTxBytes = input.transactionBlock;
		else if (input.transactionBlock instanceof Uint8Array) devInspectTxBytes = toBase64(input.transactionBlock);
		else throw new Error("Unknown transaction block format.");
		return await this.transport.request({
			method: "iota_devInspectTransactionBlock",
			params: [
				input.sender,
				devInspectTxBytes,
				input.gasPrice?.toString(),
				input.epoch
			],
			signal: input.signal
		});
	}
	/**
	* Dry run a transaction block and return the result.
	*/
	async dryRunTransactionBlock(input) {
		return await this.transport.request({
			method: "iota_dryRunTransactionBlock",
			params: [typeof input.transactionBlock === "string" ? input.transactionBlock : toBase64(input.transactionBlock)],
			signal: input.signal
		});
	}
	/**
	* Return the list of dynamic field objects owned by an object
	*/
	async getDynamicFields(input) {
		if (!input.parentId || !isValidIotaObjectId(normalizeIotaObjectId(input.parentId))) throw new Error("Invalid IOTA Object id");
		return await this.transport.request({
			method: "iotax_getDynamicFields",
			params: [
				input.parentId,
				input.cursor,
				input.limit
			],
			signal: input.signal
		});
	}
	/**
	* Return the dynamic field object information for a specified object
	* Uses the V2.
	*/
	async getDynamicFieldObject(input) {
		return await this.transport.request({
			method: "iotax_getDynamicFieldObjectV2",
			params: [
				input.parentObjectId,
				input.name,
				input.options
			],
			signal: input.signal
		});
	}
	/**
	* Return the dynamic field object information for a specified object
	* @deprecated `getDynamicFieldObjectV1` is deprecated, prefer to use `getDynamicFieldObject` which uses V2.
	*/
	async getDynamicFieldObjectV1(input) {
		return await this.transport.request({
			method: "iotax_getDynamicFieldObject",
			params: [input.parentId, input.name],
			signal: input.signal
		});
	}
	/**
	* Return the dynamic field object information for a specified object with content options.
	*/
	async getDynamicFieldObjectV2(input) {
		return await this.transport.request({
			method: "iotax_getDynamicFieldObjectV2",
			params: [
				input.parentObjectId,
				input.name,
				input.options
			],
			signal: input.signal
		});
	}
	/**
	* Get the sequence number of the latest checkpoint that has been executed
	*/
	async getLatestCheckpointSequenceNumber({ signal } = {}) {
		const resp = await this.transport.request({
			method: "iota_getLatestCheckpointSequenceNumber",
			params: [],
			signal
		});
		return String(resp);
	}
	/**
	* Returns information about a given checkpoint
	*/
	async getCheckpoint(input) {
		return await this.transport.request({
			method: "iota_getCheckpoint",
			params: [input.id],
			signal: input.signal
		});
	}
	/**
	* Returns historical checkpoints paginated
	*/
	async getCheckpoints(input) {
		return await this.transport.request({
			method: "iota_getCheckpoints",
			params: [
				input.cursor,
				input?.limit,
				input.descendingOrder
			],
			signal: input.signal
		});
	}
	/**
	* Return the committee information for the asked epoch
	*/
	async getCommitteeInfo(input) {
		return await this.transport.request({
			method: "iotax_getCommitteeInfo",
			params: [input?.epoch],
			signal: input?.signal
		});
	}
	async getNetworkMetrics({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getNetworkMetrics",
			params: [],
			signal
		});
	}
	async getAddressMetrics({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getLatestAddressMetrics",
			params: [],
			signal
		});
	}
	async getEpochMetrics(input) {
		return await this.transport.request({
			method: "iotax_getEpochMetrics",
			params: [
				input?.cursor,
				input?.limit,
				input?.descendingOrder
			],
			signal: input?.signal
		});
	}
	async getAllEpochAddressMetrics(input) {
		return await this.transport.request({
			method: "iotax_getAllEpochAddressMetrics",
			params: [input?.descendingOrder],
			signal: input?.signal
		});
	}
	async getCheckpointAddressMetrics(input) {
		return await this.transport.request({
			method: "iotax_getCheckpointAddressMetrics",
			params: [input?.checkpoint],
			signal: input?.signal
		});
	}
	/**
	* Return the committee information for the asked epoch
	*/
	async getEpochs(input) {
		const [epochPage, protocolConfig] = await Promise.all([this.transport.request({
			method: "iotax_getEpochs",
			params: [
				input?.cursor,
				input?.limit,
				input?.descendingOrder
			],
			signal: input?.signal
		}), this.getProtocolConfig({ signal: input?.signal })]);
		const currentProtocolVersion = Number(protocolConfig.protocolVersion);
		return {
			...epochPage,
			data: epochPage.data.map((epoch) => {
				const epochProtocolVersion = epoch.endOfEpochInfo ? Number(epoch.endOfEpochInfo.protocolVersion) : currentProtocolVersion;
				return {
					...epoch,
					validators: mapValidatorsWithEffectiveCommission(epoch.validators, epochProtocolVersion)
				};
			})
		};
	}
	/**
	* Returns list of top move calls by usage
	*/
	async getMoveCallMetrics({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getMoveCallMetrics",
			params: [],
			signal
		});
	}
	/**
	* Return the committee information for the asked epoch
	*/
	async getCurrentEpoch({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getCurrentEpoch",
			params: [],
			signal
		});
	}
	async getTotalTransactions({ signal } = {}) {
		const resp = await this.transport.request({
			method: "iotax_getTotalTransactions",
			params: [],
			signal
		});
		return String(resp);
	}
	/**
	* Return the Validators APYs
	*/
	async getValidatorsApy({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getValidatorsApy",
			params: [],
			signal
		});
	}
	async getChainIdentifier({ signal } = {}) {
		return await this.transport.request({
			method: "iota_getChainIdentifier",
			params: [],
			signal
		});
	}
	async getProtocolConfig(input) {
		return await this.transport.request({
			method: "iota_getProtocolConfig",
			params: [input?.version],
			signal: input?.signal
		});
	}
	/**
	* Returns the participation metrics (total unique addresses with delegated stake in the current epoch).
	*/
	async getParticipationMetrics({ signal } = {}) {
		return await this.transport.request({
			method: "iotax_getParticipationMetrics",
			params: [],
			signal
		});
	}
	/**
	* Wait for a transaction block result to be available over the API.
	* This can be used in conjunction with `executeTransactionBlock` to wait for the transaction to
	* be available via the API.
	* This currently polls the `getTransactionBlock` API to check for the transaction.
	*/
	async waitForTransaction({ signal, timeout = 60 * 1e3, pollInterval = 2 * 1e3, waitMode = "checkpoint", ...input }) {
		const timeoutSignal = AbortSignal.timeout(timeout);
		const timeoutPromise = new Promise((_, reject) => {
			timeoutSignal.addEventListener("abort", () => reject(timeoutSignal.reason));
		});
		timeoutPromise.catch(() => {});
		while (!timeoutSignal.aborted) {
			signal?.throwIfAborted();
			const wait = async () => {
				await Promise.race([new Promise((resolve) => setTimeout(resolve, pollInterval)), timeoutPromise]);
			};
			try {
				if (waitMode === "indexed-on-node") {
					if (await this.isTransactionIndexedOnNode({
						digest: input.digest,
						signal
					})) return await this.getTransactionBlock({
						...input,
						signal
					});
				} else if (waitMode === "checkpoint") {
					const transaction = await this.getTransactionBlock({
						...input,
						signal
					});
					if (transaction.checkpoint) return transaction;
				} else return await this.getTransactionBlock({
					...input,
					signal
				});
				await wait();
			} catch (e) {
				await wait();
			}
		}
		timeoutSignal.throwIfAborted();
		throw new Error("Unexpected error while waiting for transaction block.");
	}
	/**
	* Return the resolved record for the given name.
	*/
	async iotaNamesLookup(input) {
		return await this.transport.request({
			method: "iotax_iotaNamesLookup",
			params: [input.name],
			signal: input.signal
		});
	}
	/**
	* Return the resolved name for the given address.
	*/
	async iotaNamesReverseLookup(input) {
		return await this.transport.request({
			method: "iotax_iotaNamesReverseLookup",
			params: [input.address],
			signal: input.signal
		});
	}
	/**
	* Find all registration NFTs for the given address.
	*/
	async iotaNamesFindAllRegistrationNFTs(input) {
		return await this.transport.request({
			method: "iotax_iotaNamesFindAllRegistrationNFTs",
			params: [
				input.address,
				input.cursor,
				input.limit,
				input.options
			],
			signal: input.signal
		});
	}
	/**
	* Check if a Transaction has been indexed on the Node.
	*/
	async isTransactionIndexedOnNode(input) {
		return await this.transport.request({
			method: "iota_isTransactionIndexedOnNode",
			params: [input.digest],
			signal: input.signal
		});
	}
	/**
	* Calls a move view function.
	*/
	async view(input) {
		return await this.transport.request({
			method: "iota_view",
			params: [
				input.functionName,
				input.typeArgs,
				input.arguments
			],
			signal: input.signal
		});
	}
};
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/jsutils/devAssert.mjs
/** @internal */
function devAssert(condition, message) {
	if (!Boolean(condition)) throw new Error(message);
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/ast.mjs
/** The list of all possible AST node types. */
/** @internal */
var QueryDocumentKeys = {
	Name: [],
	Document: ["definitions"],
	OperationDefinition: [
		"description",
		"name",
		"variableDefinitions",
		"directives",
		"selectionSet"
	],
	VariableDefinition: [
		"description",
		"variable",
		"type",
		"defaultValue",
		"directives"
	],
	Variable: ["name"],
	SelectionSet: ["selections"],
	Field: [
		"alias",
		"name",
		"arguments",
		"directives",
		"selectionSet"
	],
	Argument: ["name", "value"],
	FragmentSpread: ["name", "directives"],
	InlineFragment: [
		"typeCondition",
		"directives",
		"selectionSet"
	],
	FragmentDefinition: [
		"description",
		"name",
		"variableDefinitions",
		"typeCondition",
		"directives",
		"selectionSet"
	],
	IntValue: [],
	FloatValue: [],
	StringValue: [],
	BooleanValue: [],
	NullValue: [],
	EnumValue: [],
	ListValue: ["values"],
	ObjectValue: ["fields"],
	ObjectField: ["name", "value"],
	Directive: ["name", "arguments"],
	NamedType: ["name"],
	ListType: ["type"],
	NonNullType: ["type"],
	SchemaDefinition: [
		"description",
		"directives",
		"operationTypes"
	],
	OperationTypeDefinition: ["type"],
	ScalarTypeDefinition: [
		"description",
		"name",
		"directives"
	],
	ObjectTypeDefinition: [
		"description",
		"name",
		"interfaces",
		"directives",
		"fields"
	],
	FieldDefinition: [
		"description",
		"name",
		"arguments",
		"type",
		"directives"
	],
	InputValueDefinition: [
		"description",
		"name",
		"type",
		"defaultValue",
		"directives"
	],
	InterfaceTypeDefinition: [
		"description",
		"name",
		"interfaces",
		"directives",
		"fields"
	],
	UnionTypeDefinition: [
		"description",
		"name",
		"directives",
		"types"
	],
	EnumTypeDefinition: [
		"description",
		"name",
		"directives",
		"values"
	],
	EnumValueDefinition: [
		"description",
		"name",
		"directives"
	],
	InputObjectTypeDefinition: [
		"description",
		"name",
		"directives",
		"fields"
	],
	DirectiveDefinition: [
		"description",
		"name",
		"arguments",
		"directives",
		"locations"
	],
	SchemaExtension: ["directives", "operationTypes"],
	DirectiveExtension: ["name", "directives"],
	ScalarTypeExtension: ["name", "directives"],
	ObjectTypeExtension: [
		"name",
		"interfaces",
		"directives",
		"fields"
	],
	InterfaceTypeExtension: [
		"name",
		"interfaces",
		"directives",
		"fields"
	],
	UnionTypeExtension: [
		"name",
		"directives",
		"types"
	],
	EnumTypeExtension: [
		"name",
		"directives",
		"values"
	],
	InputObjectTypeExtension: [
		"name",
		"directives",
		"fields"
	],
	TypeCoordinate: ["name"],
	MemberCoordinate: ["name", "memberName"],
	ArgumentCoordinate: [
		"name",
		"fieldName",
		"argumentName"
	],
	DirectiveCoordinate: ["name"],
	DirectiveArgumentCoordinate: ["name", "argumentName"]
};
var kindValues = new Set(Object.keys(QueryDocumentKeys));
/** @internal */
function isNode(maybeNode) {
	const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
	return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
/** An identifier in a GraphQL document. */
/**
* The operation types supported by GraphQL executable definitions.
* @category Kinds
*/
var OperationTypeNode;
(function(OperationTypeNode) {
	OperationTypeNode["QUERY"] = "query";
	OperationTypeNode["MUTATION"] = "mutation";
	OperationTypeNode["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));
/** A variable declaration in an operation or legacy fragment definition. */
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/kinds.mjs
/** @category Kinds */
/** The set of allowed kind values for AST nodes. */
var Kind;
(function(Kind) {
	Kind["NAME"] = "Name";
	Kind["DOCUMENT"] = "Document";
	Kind["OPERATION_DEFINITION"] = "OperationDefinition";
	Kind["VARIABLE_DEFINITION"] = "VariableDefinition";
	Kind["SELECTION_SET"] = "SelectionSet";
	Kind["FIELD"] = "Field";
	Kind["ARGUMENT"] = "Argument";
	Kind["FRAGMENT_SPREAD"] = "FragmentSpread";
	Kind["INLINE_FRAGMENT"] = "InlineFragment";
	Kind["FRAGMENT_DEFINITION"] = "FragmentDefinition";
	Kind["VARIABLE"] = "Variable";
	Kind["INT"] = "IntValue";
	Kind["FLOAT"] = "FloatValue";
	Kind["STRING"] = "StringValue";
	Kind["BOOLEAN"] = "BooleanValue";
	Kind["NULL"] = "NullValue";
	Kind["ENUM"] = "EnumValue";
	Kind["LIST"] = "ListValue";
	Kind["OBJECT"] = "ObjectValue";
	Kind["OBJECT_FIELD"] = "ObjectField";
	Kind["DIRECTIVE"] = "Directive";
	Kind["NAMED_TYPE"] = "NamedType";
	Kind["LIST_TYPE"] = "ListType";
	Kind["NON_NULL_TYPE"] = "NonNullType";
	Kind["SCHEMA_DEFINITION"] = "SchemaDefinition";
	Kind["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
	Kind["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
	Kind["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
	Kind["FIELD_DEFINITION"] = "FieldDefinition";
	Kind["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
	Kind["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
	Kind["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
	Kind["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
	Kind["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
	Kind["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
	Kind["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
	Kind["SCHEMA_EXTENSION"] = "SchemaExtension";
	Kind["DIRECTIVE_EXTENSION"] = "DirectiveExtension";
	Kind["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
	Kind["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
	Kind["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
	Kind["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
	Kind["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
	Kind["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
	Kind["TYPE_COORDINATE"] = "TypeCoordinate";
	Kind["MEMBER_COORDINATE"] = "MemberCoordinate";
	Kind["ARGUMENT_COORDINATE"] = "ArgumentCoordinate";
	Kind["DIRECTIVE_COORDINATE"] = "DirectiveCoordinate";
	Kind["DIRECTIVE_ARGUMENT_COORDINATE"] = "DirectiveArgumentCoordinate";
})(Kind || (Kind = {}));
/**
* Deprecated legacy alias for the enum type representing the possible kind
* values of AST nodes. This alias will be removed in v17. In v17, `Kind` is
* exported as the single public symbol for both the runtime object and the
* corresponding TypeScript type.
* @deprecated Will be removed in v17. In v17, use `Kind` as both the runtime
* value and the type.
*/
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/characterClasses.mjs
/**
* ```
* WhiteSpace ::
*   - "Horizontal Tab (U+0009)"
*   - "Space (U+0020)"
* ```
* @internal
*/
function isWhiteSpace(code) {
	return code === 9 || code === 32;
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/blockString.mjs
/**
* Print a block string in the indented block form by adding a leading and
* trailing blank line. However, if a block string starts with whitespace and is
* a single-line, adding a leading blank line would strip that whitespace.
*
* @internal
*/
function printBlockString(value, options) {
	const escapedValue = value.replace(/"""/g, "\\\"\"\"");
	const lines = escapedValue.split(/\r\n|[\n\r]/g);
	const isSingleLine = lines.length === 1;
	const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
	const hasTrailingTripleQuotes = escapedValue.endsWith("\\\"\"\"");
	const hasTrailingQuote = value.endsWith("\"") && !hasTrailingTripleQuotes;
	const hasTrailingSlash = value.endsWith("\\");
	const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
	const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
	let result = "";
	const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
	if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) result += "\n";
	result += escapedValue;
	if (printAsMultipleLines || forceTrailingNewline) result += "\n";
	return "\"\"\"" + result + "\"\"\"";
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/jsutils/inspect.mjs
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
/**
* Used to print values in error messages.
*
* @internal
*/
function inspect(value) {
	return formatValue(value, []);
}
function formatValue(value, seenValues) {
	switch (typeof value) {
		case "string": return JSON.stringify(value);
		case "function": return value.name ? `[function ${value.name}]` : "[function]";
		case "object": return formatObjectValue(value, seenValues);
		default: return String(value);
	}
}
function formatObjectValue(value, previouslySeenValues) {
	if (value === null) return "null";
	if (previouslySeenValues.includes(value)) return "[Circular]";
	const seenValues = [...previouslySeenValues, value];
	if (isJSONable(value)) {
		const jsonValue = value.toJSON();
		if (jsonValue !== value) return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
	} else if (Array.isArray(value)) return formatArray(value, seenValues);
	return formatObject(value, seenValues);
}
function isJSONable(value) {
	return typeof value.toJSON === "function";
}
function formatObject(object, seenValues) {
	const entries = Object.entries(object);
	if (entries.length === 0) return "{}";
	if (seenValues.length > MAX_RECURSIVE_DEPTH) return "[" + getObjectTag(object) + "]";
	return "{ " + entries.map(([key, value]) => key + ": " + formatValue(value, seenValues)).join(", ") + " }";
}
function formatArray(array, seenValues) {
	if (array.length === 0) return "[]";
	if (seenValues.length > MAX_RECURSIVE_DEPTH) return "[Array]";
	const len = Math.min(MAX_ARRAY_LENGTH, array.length);
	const remaining = array.length - len;
	const items = [];
	for (let i = 0; i < len; ++i) items.push(formatValue(array[i], seenValues));
	if (remaining === 1) items.push("... 1 more item");
	else if (remaining > 1) items.push(`... ${remaining} more items`);
	return "[" + items.join(", ") + "]";
}
function getObjectTag(object) {
	const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
	if (tag === "Object" && typeof object.constructor === "function") {
		const name = object.constructor.name;
		if (typeof name === "string" && name !== "") return name;
	}
	return tag;
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/printString.mjs
/**
* Prints a string as a GraphQL StringValue literal. Replaces control characters
* and excluded characters (" U+0022 and \\ U+005C) with escape sequences.
*
* @internal
*/
function printString(str) {
	return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
/** @internal */
var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
	return escapeSequences[str.charCodeAt(0)];
}
var escapeSequences = [
	"\\u0000",
	"\\u0001",
	"\\u0002",
	"\\u0003",
	"\\u0004",
	"\\u0005",
	"\\u0006",
	"\\u0007",
	"\\b",
	"\\t",
	"\\n",
	"\\u000B",
	"\\f",
	"\\r",
	"\\u000E",
	"\\u000F",
	"\\u0010",
	"\\u0011",
	"\\u0012",
	"\\u0013",
	"\\u0014",
	"\\u0015",
	"\\u0016",
	"\\u0017",
	"\\u0018",
	"\\u0019",
	"\\u001A",
	"\\u001B",
	"\\u001C",
	"\\u001D",
	"\\u001E",
	"\\u001F",
	"",
	"",
	"\\\"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"\\\\",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"\\u007F",
	"\\u0080",
	"\\u0081",
	"\\u0082",
	"\\u0083",
	"\\u0084",
	"\\u0085",
	"\\u0086",
	"\\u0087",
	"\\u0088",
	"\\u0089",
	"\\u008A",
	"\\u008B",
	"\\u008C",
	"\\u008D",
	"\\u008E",
	"\\u008F",
	"\\u0090",
	"\\u0091",
	"\\u0092",
	"\\u0093",
	"\\u0094",
	"\\u0095",
	"\\u0096",
	"\\u0097",
	"\\u0098",
	"\\u0099",
	"\\u009A",
	"\\u009B",
	"\\u009C",
	"\\u009D",
	"\\u009E",
	"\\u009F"
];
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/visitor.mjs
/** @category Visiting */
/** A visitor defines the callbacks called during AST traversal. */
/** A value that can be returned from a visitor function to stop traversal. */
var BREAK = Object.freeze({});
/**
* visit() will walk through an AST using a depth-first traversal, calling
* the visitor's enter function at each node in the traversal, and calling the
* leave function after visiting that node and all of its child nodes.
*
* By returning different values from the enter and leave functions, the
* behavior of the visitor can be altered, including skipping over a sub-tree of
* the AST (by returning false), editing the AST by returning a value or null
* to remove the value, or to stop the whole traversal by returning BREAK.
*
* When using visit() to edit an AST, the original AST will not be modified, and
* a new version of the AST with the changes applied will be returned from the
* visit function.
* @param root - The AST node at which to start traversal.
* @param visitor - The visitor or reducer functions to call while traversing.
* @param visitorKeys - Optional map of child keys to visit for each AST node kind.
* @returns The original AST, an edited AST, or a reduced value depending on the visitor.
* @typeParam N - The root AST node type returned when visiting without reducing.
* @example
* ```ts
* // Return values control traversal: undefined makes no change, false skips
* // a subtree, BREAK stops traversal, null removes a node, and any other
* // value replaces the current node.
* import { Kind, parse, print, visit } from 'graphql/language';
*
* const document = parse('{ hero { name } }');
* const editedAST = visit(document, {
*   Field: (node) => {
*     if (node.name.value === 'hero') {
*       return {
*         ...node,
*         name: { kind: Kind.NAME, value: 'human' },
*       };
*     }
*   },
* });
*
* print(editedAST); // => '{\n  human {\n    name\n  }\n}'
* ```
* @example
* ```ts
* // A named visitor function runs when entering nodes of that kind.
* import { parse, visit } from 'graphql/language';
*
* const document = parse('{ hero { name } }');
* const fieldNames = [];
*
* visit(document, {
*   Field: (node) => {
*     fieldNames.push(node.name.value);
*   },
* });
*
* fieldNames; // => ['hero', 'name']
* ```
* @example
* ```ts
* // A named visitor object can provide separate enter and leave handlers for
* // nodes of that kind.
* import { parse, visit } from 'graphql/language';
*
* const document = parse('{ hero { name } }');
* const events = [];
*
* visit(document, {
*   Field: {
*     enter: (node) => {
*       events.push(`enter:${node.name.value}`);
*     },
*     leave: (node) => {
*       events.push(`leave:${node.name.value}`);
*     },
*   },
* });
*
* events; // => ['enter:hero', 'enter:name', 'leave:name', 'leave:hero']
* ```
* @example
* ```ts
* // Generic enter and leave handlers run for every node.
* import { parse, visit } from 'graphql/language';
*
* const document = parse('{ hero { name } }');
* let enterCount = 0;
* let leaveCount = 0;
*
* visit(document, {
*   enter: (node) => {
*     enterCount += 1;
*   },
*   leave: (node) => {
*     leaveCount += 1;
*   },
* });
*
* enterCount; // => leaveCount
* enterCount > 0; // => true
* ```
*/
/** @internal */
function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
	const enterLeaveMap = /* @__PURE__ */ new Map();
	for (const kind of Object.values(Kind)) enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
	let stack = void 0;
	let inArray = Array.isArray(root);
	let keys = [root];
	let index = -1;
	let edits = [];
	let node = root;
	let key = void 0;
	let parent = void 0;
	const path = [];
	const ancestors = [];
	do {
		index++;
		const isLeaving = index === keys.length;
		const isEdited = isLeaving && edits.length !== 0;
		if (isLeaving) {
			key = ancestors.length === 0 ? void 0 : path[path.length - 1];
			node = parent;
			parent = ancestors.pop();
			if (isEdited) if (inArray) {
				node = node.slice();
				let editOffset = 0;
				for (const [editKey, editValue] of edits) {
					const arrayKey = editKey - editOffset;
					if (editValue === null) {
						node.splice(arrayKey, 1);
						editOffset++;
					} else node[arrayKey] = editValue;
				}
			} else {
				node = { ...node };
				for (const [editKey, editValue] of edits) node[editKey] = editValue;
			}
			index = stack.index;
			keys = stack.keys;
			edits = stack.edits;
			inArray = stack.inArray;
			stack = stack.prev;
		} else if (parent) {
			key = inArray ? index : keys[index];
			node = parent[key];
			if (node === null || node === void 0) continue;
			path.push(key);
		}
		let result;
		if (!Array.isArray(node)) {
			var _enterLeaveMap$get, _enterLeaveMap$get2;
			isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
			const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
			result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
			if (result === BREAK) break;
			if (result === false) {
				if (!isLeaving) {
					path.pop();
					continue;
				}
			} else if (result !== void 0) {
				edits.push([key, result]);
				if (!isLeaving) if (isNode(result)) node = result;
				else {
					path.pop();
					continue;
				}
			}
		}
		if (result === void 0 && isEdited) edits.push([key, node]);
		if (isLeaving) path.pop();
		else {
			var _node$kind;
			stack = {
				inArray,
				index,
				keys,
				edits,
				prev: stack
			};
			inArray = Array.isArray(node);
			keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
			index = -1;
			edits = [];
			if (parent) ancestors.push(parent);
			parent = node;
		}
	} while (stack !== void 0);
	if (edits.length !== 0) return edits[edits.length - 1][1];
	return root;
}
/**
* Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
* @param visitor - The visitor object to inspect.
* @param kind - The AST node kind to resolve handlers for.
* @returns The enter and leave handlers that apply for the given node kind.
* @example
* ```ts
* import { Kind, getEnterLeaveForKind } from 'graphql/language';
*
* const handlers = getEnterLeaveForKind({ Field: () => {} }, Kind.FIELD);
*
* typeof handlers.enter; // => 'function'
* handlers.leave; // => undefined
* ```
*/
function getEnterLeaveForKind(visitor, kind) {
	const kindVisitor = visitor[kind];
	if (typeof kindVisitor === "object") return kindVisitor;
	else if (typeof kindVisitor === "function") return {
		enter: kindVisitor,
		leave: void 0
	};
	return {
		enter: visitor.enter,
		leave: visitor.leave
	};
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.2/node_modules/graphql/language/printer.mjs
/** @category Printing */
/**
* Converts an AST into a string, using one set of reasonable
* formatting rules.
* @param ast - The GraphQL AST node to print.
* @returns A stable string representation of the AST.
* @example
* ```ts
* import { parse, print } from 'graphql';
*
* const ast = parse('{ hero { name } }');
* const text = print(ast);
*
* text; // => '{\n  hero {\n    name\n  }\n}'
* ```
*/
function print(ast) {
	return visit(ast, printDocASTReducer);
}
var MAX_LINE_LENGTH = 80;
var printDocASTReducer = {
	Name: { leave: (node) => node.value },
	Variable: { leave: (node) => "$" + node.name },
	Document: { leave: (node) => join(node.definitions, "\n\n") },
	OperationDefinition: { leave(node) {
		const varDefs = hasMultilineItems(node.variableDefinitions) ? wrap("(\n", join(node.variableDefinitions, "\n"), "\n)") : wrap("(", join(node.variableDefinitions, ", "), ")");
		const prefix = wrap("", node.description, "\n") + join([
			node.operation,
			join([node.name, varDefs]),
			join(node.directives, " ")
		], " ");
		return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
	} },
	VariableDefinition: { leave: ({ variable, type, defaultValue, directives, description }) => wrap("", description, "\n") + variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " ")) },
	SelectionSet: { leave: ({ selections }) => block(selections) },
	Field: { leave({ alias, name, arguments: args, directives, selectionSet }) {
		const prefix = wrap("", alias, ": ") + name;
		let argsLine = prefix + wrap("(", join(args, ", "), ")");
		if (argsLine.length > MAX_LINE_LENGTH) argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
		return join([
			argsLine,
			join(directives, " "),
			selectionSet
		], " ");
	} },
	Argument: { leave: ({ name, value }) => name + ": " + value },
	FragmentSpread: { leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " ")) },
	InlineFragment: { leave: ({ typeCondition, directives, selectionSet }) => join([
		"...",
		wrap("on ", typeCondition),
		join(directives, " "),
		selectionSet
	], " ") },
	FragmentDefinition: { leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet, description }) => wrap("", description, "\n") + `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet },
	IntValue: { leave: ({ value }) => value },
	FloatValue: { leave: ({ value }) => value },
	StringValue: { leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value) },
	BooleanValue: { leave: ({ value }) => value ? "true" : "false" },
	NullValue: { leave: () => "null" },
	EnumValue: { leave: ({ value }) => value },
	ListValue: { leave: ({ values }) => "[" + join(values, ", ") + "]" },
	ObjectValue: { leave: ({ fields }) => "{" + join(fields, ", ") + "}" },
	ObjectField: { leave: ({ name, value }) => name + ": " + value },
	Directive: { leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")") },
	NamedType: { leave: ({ name }) => name },
	ListType: { leave: ({ type }) => "[" + type + "]" },
	NonNullType: { leave: ({ type }) => type + "!" },
	SchemaDefinition: { leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join([
		"schema",
		join(directives, " "),
		block(operationTypes)
	], " ") },
	OperationTypeDefinition: { leave: ({ operation, type }) => operation + ": " + type },
	ScalarTypeDefinition: { leave: ({ description, name, directives }) => wrap("", description, "\n") + join([
		"scalar",
		name,
		join(directives, " ")
	], " ") },
	ObjectTypeDefinition: { leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join([
		"type",
		name,
		wrap("implements ", join(interfaces, " & ")),
		join(directives, " "),
		block(fields)
	], " ") },
	FieldDefinition: { leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " ")) },
	InputValueDefinition: { leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join([
		name + ": " + type,
		wrap("= ", defaultValue),
		join(directives, " ")
	], " ") },
	InterfaceTypeDefinition: { leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join([
		"interface",
		name,
		wrap("implements ", join(interfaces, " & ")),
		join(directives, " "),
		block(fields)
	], " ") },
	UnionTypeDefinition: { leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join([
		"union",
		name,
		join(directives, " "),
		wrap("= ", join(types, " | "))
	], " ") },
	EnumTypeDefinition: { leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join([
		"enum",
		name,
		join(directives, " "),
		block(values)
	], " ") },
	EnumValueDefinition: { leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ") },
	InputObjectTypeDefinition: { leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join([
		"input",
		name,
		join(directives, " "),
		block(fields)
	], " ") },
	DirectiveDefinition: { leave: ({ description, name, arguments: args, directives, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + wrap(" ", join(directives, " ")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ") },
	SchemaExtension: { leave: ({ directives, operationTypes }) => join([
		"extend schema",
		join(directives, " "),
		block(operationTypes)
	], " ") },
	ScalarTypeExtension: { leave: ({ name, directives }) => join([
		"extend scalar",
		name,
		join(directives, " ")
	], " ") },
	ObjectTypeExtension: { leave: ({ name, interfaces, directives, fields }) => join([
		"extend type",
		name,
		wrap("implements ", join(interfaces, " & ")),
		join(directives, " "),
		block(fields)
	], " ") },
	InterfaceTypeExtension: { leave: ({ name, interfaces, directives, fields }) => join([
		"extend interface",
		name,
		wrap("implements ", join(interfaces, " & ")),
		join(directives, " "),
		block(fields)
	], " ") },
	UnionTypeExtension: { leave: ({ name, directives, types }) => join([
		"extend union",
		name,
		join(directives, " "),
		wrap("= ", join(types, " | "))
	], " ") },
	EnumTypeExtension: { leave: ({ name, directives, values }) => join([
		"extend enum",
		name,
		join(directives, " "),
		block(values)
	], " ") },
	InputObjectTypeExtension: { leave: ({ name, directives, fields }) => join([
		"extend input",
		name,
		join(directives, " "),
		block(fields)
	], " ") },
	DirectiveExtension: { leave: ({ name, directives }) => join(["extend directive @" + name, join(directives, " ")], " ") },
	TypeCoordinate: { leave: ({ name }) => name },
	MemberCoordinate: { leave: ({ name, memberName }) => join([name, wrap(".", memberName)]) },
	ArgumentCoordinate: { leave: ({ name, fieldName, argumentName }) => join([
		name,
		wrap(".", fieldName),
		wrap("(", argumentName, ":)")
	]) },
	DirectiveCoordinate: { leave: ({ name }) => join(["@", name]) },
	DirectiveArgumentCoordinate: { leave: ({ name, argumentName }) => join([
		"@",
		name,
		wrap("(", argumentName, ":)")
	]) }
};
/**
* Given maybeArray, print an empty string if it is null or empty, otherwise
* print all items together separated by separator if provided
*
* @internal
*/
function join(maybeArray, separator = "") {
	var _maybeArray$filter$jo;
	return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
/**
* Given array, print each item on its own line, wrapped in an indented `{ }` block.
*
* @internal
*/
function block(array) {
	return wrap("{\n", indent(join(array, "\n")), "\n}");
}
/**
* If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
*
* @internal
*/
function wrap(start, maybeString, end = "") {
	return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
function indent(str) {
	return wrap("  ", str.replace(/\n/g, "\n  "));
}
function hasMultilineItems(maybeArray) {
	var _maybeArray$some;
	/* c8 ignore next */
	return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/generated/queries.js
var TransactionBlockKindInput = /* @__PURE__ */ ((TransactionBlockKindInput2) => {
	TransactionBlockKindInput2["ConsensusCommitPrologueV1"] = "CONSENSUS_COMMIT_PROLOGUE_V1";
	TransactionBlockKindInput2["EndOfEpochTx"] = "END_OF_EPOCH_TX";
	TransactionBlockKindInput2["Genesis"] = "GENESIS";
	TransactionBlockKindInput2["ProgrammableTx"] = "PROGRAMMABLE_TX";
	TransactionBlockKindInput2["RandomnessStateUpdate"] = "RANDOMNESS_STATE_UPDATE";
	TransactionBlockKindInput2["SystemTx"] = "SYSTEM_TX";
	return TransactionBlockKindInput2;
})(TransactionBlockKindInput || {});
var TypedDocumentString = class extends String {
	constructor(value, __meta__) {
		super(value);
		this.value = value;
		this.__meta__ = __meta__;
	}
	toString() {
		return this.value;
	}
};
new TypedDocumentString(`
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}
    `, { "fragmentName": "RPC_Checkpoint_Fields" });
new TypedDocumentString(`
    fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}
    `, { "fragmentName": "RPC_CREDENTIAL_FIELDS" });
new TypedDocumentString(`
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  effectiveCommissionRate
  exchangeRatesSize
  exchangeRatesTable {
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPoolId
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
    fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`, { "fragmentName": "RPC_VALIDATOR_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}
    `, { "fragmentName": "RPC_MOVE_STRUCT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_ENUM_FIELDS on MoveEnum {
  name
  abilities
  typeParameters {
    constraints
    isPhantom
  }
  variants {
    name
    fields {
      name
      type {
        repr
        signature
      }
    }
  }
}
    `, { "fragmentName": "RPC_MOVE_ENUM_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
    `, { "fragmentName": "RPC_MOVE_FUNCTION_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  enums {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_ENUM_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_ENUM_FIELDS on MoveEnum {
  name
  abilities
  typeParameters {
    constraints
    isPhantom
  }
  variants {
    name
    fields {
      name
      type {
        repr
        signature
      }
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`, { "fragmentName": "RPC_MOVE_MODULE_FIELDS" });
new TypedDocumentString(`
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}
    `, { "fragmentName": "RPC_OBJECT_OWNER_FIELDS" });
new TypedDocumentString(`
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`, { "fragmentName": "RPC_OBJECT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_MOVE_OBJECT_FIELDS on MoveObject {
  objectId: address
  bcs @include(if: $showBcs)
  contents @include(if: $showType) {
    type {
      repr
    }
  }
  contents @include(if: $showContent) {
    data
    type {
      repr
      layout
      signature
    }
  }
  contents @include(if: $showBcs) {
    bcs
    type {
      repr
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
    fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`, { "fragmentName": "RPC_MOVE_OBJECT_FIELDS" });
new TypedDocumentString(`
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}
    `, { "fragmentName": "RPC_STAKE_FIELDS" });
new TypedDocumentString(`
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
    `, { "fragmentName": "RPC_EVENTS_FIELDS" });
new TypedDocumentString(`
    fragment PAGINATE_TRANSACTION_LISTS on TransactionBlock {
  effects {
    events(after: $afterEvents) @include(if: $hasMoreEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    balanceChanges(after: $afterBalanceChanges) @include(if: $hasMoreBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges(after: $afterObjectChanges) @include(if: $hasMoreObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`, { "fragmentName": "PAGINATE_TRANSACTION_LISTS" });
new TypedDocumentString(`
    fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`, { "fragmentName": "RPC_TRANSACTION_FIELDS" });
var GetCheckpointDocument = new TypedDocumentString(`
    query getCheckpoint($id: CheckpointId) {
  checkpoint(id: $id) {
    ...RPC_Checkpoint_Fields
  }
}
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}`);
var GetCheckpointsDocument = new TypedDocumentString(`
    query getCheckpoints($first: Int, $before: String, $last: Int, $after: String) {
  checkpoints(first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...RPC_Checkpoint_Fields
    }
  }
}
    fragment RPC_Checkpoint_Fields on Checkpoint {
  digest
  epoch {
    epochId
  }
  rollingGasSummary {
    computationCost
    computationCostBurned
    storageCost
    storageRebate
    nonRefundableStorageFee
  }
  networkTotalTransactions
  previousCheckpointDigest
  sequenceNumber
  timestamp
  validatorSignatures
  transactionBlocks {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      digest
    }
  }
  endOfEpoch: transactionBlocks(last: 1, filter: {kind: END_OF_EPOCH_TX}) {
    nodes {
      kind {
        __typename
        ... on EndOfEpochTransaction {
          transactions(last: 1) {
            nodes {
              __typename
              ... on ChangeEpochTransactionV2 {
                epoch {
                  validatorSet {
                    activeValidators {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                    committeeMembers {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        credentials {
                          authorityPubKey
                        }
                        votingPower
                      }
                    }
                  }
                  protocolConfigs {
                    protocolVersion
                  }
                  epochId
                }
              }
            }
          }
        }
      }
    }
  }
}`);
var PaginateCheckpointTransactionBlocksDocument = new TypedDocumentString(`
    query paginateCheckpointTransactionBlocks($id: CheckpointId, $after: String) {
  checkpoint(id: $id) {
    transactionBlocks(after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        digest
      }
    }
  }
}
    `);
var DevInspectTransactionBlockDocument = new TypedDocumentString(`
    query devInspectTransactionBlock($txBytes: String!, $txMeta: TransactionMetadata!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  dryRunTransactionBlock(txBytes: $txBytes, txMeta: $txMeta) {
    error
    results {
      mutatedReferences {
        input {
          __typename
          ... on Input {
            inputIndex: ix
          }
          ... on Result {
            cmd
            resultIndex: ix
          }
        }
        type {
          repr
        }
        bcs
      }
      returnValues {
        type {
          repr
        }
        bcs
      }
    }
    transaction {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var DryRunTransactionBlockDocument = new TypedDocumentString(`
    query dryRunTransactionBlock($txBytes: String!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  dryRunTransactionBlock(txBytes: $txBytes) {
    error
    transaction {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var ExecuteTransactionBlockDocument = new TypedDocumentString(`
    mutation executeTransactionBlock($txBytes: String!, $signatures: [String!]!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  executeTransactionBlock(txBytes: $txBytes, signatures: $signatures) {
    errors
    effects {
      transactionBlock {
        ...RPC_TRANSACTION_FIELDS
      }
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var GetAllBalancesDocument = new TypedDocumentString(`
    query getAllBalances($owner: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $owner) {
    balances(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        coinObjectCount
        totalBalance
      }
    }
  }
}
    `);
var GetBalanceDocument = new TypedDocumentString(`
    query getBalance($owner: IotaAddress!, $type: String = "0x2::iota::IOTA") {
  address(address: $owner) {
    balance(type: $type) {
      coinType {
        repr
      }
      coinObjectCount
      totalBalance
    }
  }
}
    `);
var GetChainIdentifierDocument = new TypedDocumentString(`
    query getChainIdentifier {
  chainIdentifier
}
    `);
var GetCoinMetadataDocument = new TypedDocumentString(`
    query getCoinMetadata($coinType: String!) {
  coinMetadata(coinType: $coinType) {
    decimals
    name
    symbol
    description
    iconUrl
    address
  }
}
    `);
var GetCoinsDocument = new TypedDocumentString(`
    query getCoins($owner: IotaAddress!, $first: Int, $cursor: String, $type: String = "0x2::iota::IOTA") {
  address(address: $owner) {
    address
    coins(first: $first, after: $cursor, type: $type) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinBalance
        contents {
          type {
            repr
          }
        }
        address
        version
        digest
        previousTransactionBlock {
          digest
        }
      }
    }
  }
}
    `);
var GetCommitteeInfoDocument = new TypedDocumentString(`
    query getCommitteeInfo($epochId: UInt53, $after: String) {
  epoch(id: $epochId) {
    epochId
    validatorSet {
      committeeMembers(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          credentials {
            authorityPubKey
          }
          votingPower
        }
      }
    }
  }
}
    `);
var GetCurrentEpochDocument = new TypedDocumentString(`
    query getCurrentEpoch {
  epoch {
    epochId
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
    }
    totalTransactions
    firstCheckpoint: checkpoints(first: 1) {
      nodes {
        sequenceNumber
      }
    }
    startTimestamp
    endTimestamp
    referenceGasPrice
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  effectiveCommissionRate
  exchangeRatesSize
  exchangeRatesTable {
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPoolId
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
var PaginateEpochValidatorsDocument = new TypedDocumentString(`
    query paginateEpochValidators($id: UInt53!, $after: String) {
  epoch(id: $id) {
    validatorSet {
      activeValidators(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers(after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
    }
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  effectiveCommissionRate
  exchangeRatesSize
  exchangeRatesTable {
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPoolId
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
var GetTypeLayoutDocument = new TypedDocumentString(`
    query getTypeLayout($type: String!) {
  type(type: $type) {
    layout
  }
}
    `);
var GetDynamicFieldObjectDocument = new TypedDocumentString(`
    query getDynamicFieldObject($parentId: IotaAddress!, $name: DynamicFieldName!, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false) {
  owner(address: $parentId) {
    dynamicObjectField(name: $name) {
      value {
        __typename
        ... on MoveObject {
          owner {
            __typename
            ... on Parent {
              parent {
                address
                digest
                version
                display @include(if: $showDisplay) {
                  key
                  value
                  error
                }
                storageRebate @include(if: $showStorageRebate)
                owner @include(if: $showOwner) {
                  __typename
                  ... on Parent {
                    parent {
                      address
                    }
                  }
                }
                previousTransactionBlock @include(if: $showPreviousTransaction) {
                  digest
                }
                asMoveObject @include(if: $showType) {
                  contents {
                    type {
                      repr
                    }
                  }
                }
                asMoveObject @include(if: $showContent) {
                  contents {
                    data
                    type {
                      repr
                      layout
                      signature
                    }
                  }
                }
                asMoveObject @include(if: $showBcs) {
                  contents {
                    data
                    type {
                      repr
                      layout
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `);
var GetDynamicFieldsDocument = new TypedDocumentString(`
    query getDynamicFields($parentId: IotaAddress!, $first: Int, $cursor: String) {
  owner(address: $parentId) {
    dynamicFields(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name {
          bcs
          json
          type {
            layout
            repr
          }
        }
        value {
          __typename
          ... on MoveValue {
            json
            type {
              repr
            }
          }
          ... on MoveObject {
            contents {
              type {
                repr
              }
              json
            }
            address
            digest
            version
          }
        }
      }
    }
  }
}
    `);
var GetLatestCheckpointSequenceNumberDocument = new TypedDocumentString(`
    query getLatestCheckpointSequenceNumber {
  checkpoint {
    sequenceNumber
  }
}
    `);
var GetLatestIotaSystemStateDocument = new TypedDocumentString(`
    query getLatestIotaSystemState {
  epoch {
    epochId
    startTimestamp
    endTimestamp
    referenceGasPrice
    safeMode {
      enabled
      gasSummary {
        computationCost
        computationCostBurned
        nonRefundableStorageFee
        storageCost
        storageRebate
      }
    }
    storageFund {
      nonRefundableBalance
      totalObjectStorageRebates
    }
    systemStateVersion
    iotaTotalSupply
    iotaTreasuryCapId
    systemParameters {
      minValidatorCount
      maxValidatorCount
      minValidatorJoiningStake
      durationMs
      validatorLowStakeThreshold
      validatorLowStakeGracePeriod
      validatorVeryLowStakeThreshold
    }
    protocolConfigs {
      protocolVersion
    }
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      committeeMembers {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_VALIDATOR_FIELDS
        }
      }
      inactivePoolsSize
      pendingActiveValidatorsSize
      stakingPoolMappingsSize
      validatorCandidatesSize
      pendingRemovals
      totalStake
      stakingPoolMappingsId
      pendingActiveValidatorsId
      validatorCandidatesId
      inactivePoolsId
    }
  }
}
    fragment RPC_VALIDATOR_FIELDS on Validator {
  atRisk
  commissionRate
  effectiveCommissionRate
  exchangeRatesSize
  exchangeRatesTable {
    address
  }
  description
  gasPrice
  imageUrl
  name
  credentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochCommissionRate
  nextEpochGasPrice
  nextEpochCredentials {
    ...RPC_CREDENTIAL_FIELDS
  }
  nextEpochStake
  nextEpochCommissionRate
  operationCap {
    address
  }
  pendingPoolTokenWithdraw
  pendingStake
  pendingTotalIotaWithdraw
  poolTokenBalance
  projectUrl
  rewardsPool
  stakingPoolId
  stakingPoolActivationEpoch
  stakingPoolIotaBalance
  address {
    address
  }
  votingPower
}
fragment RPC_CREDENTIAL_FIELDS on ValidatorCredentials {
  netAddress
  networkPubKey
  p2PAddress
  primaryAddress
  authorityPubKey
  proofOfPossession
  protocolPubKey
}`);
var GetMoveFunctionArgTypesDocument = new TypedDocumentString(`
    query getMoveFunctionArgTypes($packageId: IotaAddress!, $module: String!, $function: String!) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        fileFormatVersion
        function(name: $function) {
          parameters {
            signature
          }
        }
      }
    }
  }
}
    `);
var GetNormalizedMoveFunctionDocument = new TypedDocumentString(`
    query getNormalizedMoveFunction($packageId: IotaAddress!, $module: String!, $function: String!) {
  object(address: $packageId) {
    address
    asMovePackage {
      module(name: $module) {
        fileFormatVersion
        function(name: $function) {
          ...RPC_MOVE_FUNCTION_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}`);
var GetNormalizedMoveModuleDocument = new TypedDocumentString(`
    query getNormalizedMoveModule($packageId: IotaAddress!, $module: String!) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        ...RPC_MOVE_MODULE_FIELDS
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  enums {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_ENUM_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
fragment RPC_MOVE_ENUM_FIELDS on MoveEnum {
  name
  abilities
  typeParameters {
    constraints
    isPhantom
  }
  variants {
    name
    fields {
      name
      type {
        repr
        signature
      }
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
var PaginateMoveModuleListsDocument = new TypedDocumentString(`
    query paginateMoveModuleLists($packageId: IotaAddress!, $module: String!, $hasMoreFriends: Boolean!, $hasMoreStructs: Boolean!, $hasMoreFunctions: Boolean!, $hasMoreEnums: Boolean!, $afterFriends: String, $afterStructs: String, $afterFunctions: String, $afterEnums: String) {
  object(address: $packageId) {
    asMovePackage {
      module(name: $module) {
        friends(after: $afterFriends) @include(if: $hasMoreFriends) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name
            package {
              address
            }
          }
        }
        structs(after: $afterStructs) @include(if: $hasMoreStructs) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...RPC_MOVE_STRUCT_FIELDS
          }
        }
        functions(after: $afterFunctions) @include(if: $hasMoreFunctions) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...RPC_MOVE_FUNCTION_FIELDS
          }
        }
        enums(after: $afterEnums) @include(if: $hasMoreEnums) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...RPC_MOVE_ENUM_FIELDS
          }
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_ENUM_FIELDS on MoveEnum {
  name
  abilities
  typeParameters {
    constraints
    isPhantom
  }
  variants {
    name
    fields {
      name
      type {
        repr
        signature
      }
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
var GetNormalizedMoveModulesByPackageDocument = new TypedDocumentString(`
    query getNormalizedMoveModulesByPackage($packageId: IotaAddress!, $cursor: String) {
  object(address: $packageId) {
    asMovePackage {
      address
      modules(after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...RPC_MOVE_MODULE_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_FUNCTION_FIELDS on MoveFunction {
  name
  visibility
  isEntry
  parameters {
    signature
  }
  typeParameters {
    constraints
  }
  return {
    repr
    signature
  }
}
fragment RPC_MOVE_MODULE_FIELDS on MoveModule {
  name
  friends {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      package {
        address
      }
    }
  }
  structs {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_STRUCT_FIELDS
    }
  }
  enums {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_ENUM_FIELDS
    }
  }
  fileFormatVersion
  functions {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_MOVE_FUNCTION_FIELDS
    }
  }
}
fragment RPC_MOVE_ENUM_FIELDS on MoveEnum {
  name
  abilities
  typeParameters {
    constraints
    isPhantom
  }
  variants {
    name
    fields {
      name
      type {
        repr
        signature
      }
    }
  }
}
fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
var GetNormalizedMoveStructDocument = new TypedDocumentString(`
    query getNormalizedMoveStruct($packageId: IotaAddress!, $module: String!, $struct: String!) {
  object(address: $packageId) {
    asMovePackage {
      address
      module(name: $module) {
        fileFormatVersion
        struct(name: $struct) {
          ...RPC_MOVE_STRUCT_FIELDS
        }
      }
    }
  }
}
    fragment RPC_MOVE_STRUCT_FIELDS on MoveStruct {
  name
  abilities
  fields {
    name
    type {
      signature
    }
  }
  typeParameters {
    isPhantom
    constraints
  }
}`);
var GetProtocolConfigDocument = new TypedDocumentString(`
    query getProtocolConfig($protocolVersion: UInt53) {
  protocolConfig(protocolVersion: $protocolVersion) {
    protocolVersion
    configs {
      key
      value
    }
    featureFlags {
      key
      value
    }
  }
}
    `);
var GetReferenceGasPriceDocument = new TypedDocumentString(`
    query getReferenceGasPrice {
  epoch {
    referenceGasPrice
  }
}
    `);
var GetTotalSupplyDocument = new TypedDocumentString(`
    query getTotalSupply($coinType: String!) {
  coinMetadata(coinType: $coinType) {
    supply
    decimals
  }
}
    `);
var GetTotalTransactionBlocksDocument = new TypedDocumentString(`
    query getTotalTransactionBlocks {
  checkpoint {
    networkTotalTransactions
  }
}
    `);
var GetValidatorsApyDocument = new TypedDocumentString(`
    query getValidatorsApy {
  epoch {
    epochId
    validatorSet {
      activeValidators {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          address {
            address
          }
          apy
        }
      }
    }
  }
}
    `);
new TypedDocumentString(`
    query resolveNameServiceAddress($name: String!) {
  resolveIotaNamesAddress(name: $name) {
    address
  }
}
    `);
new TypedDocumentString(`
    query resolveNameServiceNames($address: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $address) {
    iotaNamesRegistrations(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
      }
    }
  }
}
    `);
var IsTransactionIndexedOnNodeDocument = new TypedDocumentString(`
    query IsTransactionIndexedOnNode($digest: String!) {
  isTransactionIndexedOnNode(digest: $digest)
}
    `);
var GetOwnedObjectsDocument = new TypedDocumentString(`
    query getOwnedObjects($owner: IotaAddress!, $limit: Int, $cursor: String, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false, $filter: ObjectFilter) {
  address(address: $owner) {
    objects(first: $limit, after: $cursor, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_MOVE_OBJECT_FIELDS
      }
    }
  }
}
    fragment RPC_MOVE_OBJECT_FIELDS on MoveObject {
  objectId: address
  bcs @include(if: $showBcs)
  contents @include(if: $showType) {
    type {
      repr
    }
  }
  contents @include(if: $showContent) {
    data
    type {
      repr
      layout
      signature
    }
  }
  contents @include(if: $showBcs) {
    bcs
    type {
      repr
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
var GetObjectDocument = new TypedDocumentString(`
    query getObject($id: IotaAddress!, $showBcs: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showStorageRebate: Boolean = false) {
  object(address: $id) {
    ...RPC_OBJECT_FIELDS
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
var TryGetPastObjectDocument = new TypedDocumentString(`
    query tryGetPastObject($id: IotaAddress!, $version: UInt53, $showBcs: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showStorageRebate: Boolean = false) {
  current: object(address: $id) {
    address
    version
  }
  object(address: $id, version: $version) {
    ...RPC_OBJECT_FIELDS
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
var MultiGetObjectsDocument = new TypedDocumentString(`
    query multiGetObjects($ids: [IotaAddress!]!, $limit: Int, $cursor: String, $showBcs: Boolean = false, $showContent: Boolean = false, $showDisplay: Boolean = false, $showType: Boolean = false, $showOwner: Boolean = false, $showPreviousTransaction: Boolean = false, $showStorageRebate: Boolean = false) {
  objects(first: $limit, after: $cursor, filter: {objectIds: $ids}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...RPC_OBJECT_FIELDS
    }
  }
}
    fragment RPC_OBJECT_FIELDS on Object {
  objectId: address
  version
  asMoveObject @include(if: $showType) {
    contents {
      type {
        repr
      }
    }
  }
  asMoveObject @include(if: $showContent) {
    contents {
      data
      type {
        repr
        layout
        signature
      }
    }
  }
  asMoveObject @include(if: $showBcs) {
    contents {
      bcs
      type {
        repr
      }
    }
  }
  owner @include(if: $showOwner) {
    ...RPC_OBJECT_OWNER_FIELDS
  }
  previousTransactionBlock @include(if: $showPreviousTransaction) {
    digest
  }
  storageRebate @include(if: $showStorageRebate)
  digest
  version
  display @include(if: $showDisplay) {
    key
    value
    error
  }
}
fragment RPC_OBJECT_OWNER_FIELDS on ObjectOwner {
  __typename
  ... on AddressOwner {
    owner {
      asObject {
        address
      }
      asAddress {
        address
      }
    }
  }
  ... on Parent {
    parent {
      address
    }
  }
  ... on Shared {
    initialSharedVersion
  }
}`);
var QueryEventsDocument = new TypedDocumentString(`
    query queryEvents($filter: EventFilter!, $before: String, $after: String, $first: Int, $last: Int) {
  events(
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    nodes {
      ...RPC_EVENTS_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}`);
var GetStakesDocument = new TypedDocumentString(`
    query getStakes($owner: IotaAddress!, $limit: Int, $cursor: String) {
  address(address: $owner) {
    stakedIotas(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_STAKE_FIELDS
      }
    }
  }
}
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}`);
var GetStakesByIdsDocument = new TypedDocumentString(`
    query getStakesByIds($ids: [IotaAddress!]!, $limit: Int, $cursor: String) {
  objects(first: $limit, after: $cursor, filter: {objectIds: $ids}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      asMoveObject {
        asStakedIota {
          ...RPC_STAKE_FIELDS
        }
      }
    }
  }
}
    fragment RPC_STAKE_FIELDS on StakedIota {
  principal
  activatedEpoch {
    epochId
    referenceGasPrice
  }
  stakeStatus
  requestedEpoch {
    epochId
  }
  activatedEpoch {
    epochId
  }
  contents {
    json
  }
  address
  estimatedReward
}`);
new TypedDocumentString(`
    query TransactionBlocksByDigests($digests: [String!]!) {
  transactionBlocksByDigests(digests: $digests) {
    digest
  }
}
    `);
var QueryTransactionBlocksDocument = new TypedDocumentString(`
    query queryTransactionBlocks($first: Int, $last: Int, $before: String, $after: String, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false, $filter: TransactionBlockFilter) {
  transactionBlocks(
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var GetTransactionBlockDocument = new TypedDocumentString(`
    query getTransactionBlock($digest: String!, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  transactionBlock(digest: $digest) {
    ...RPC_TRANSACTION_FIELDS
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var MultiGetTransactionBlocksDocument = new TypedDocumentString(`
    query multiGetTransactionBlocks($digests: [String!]!, $limit: Int, $cursor: String, $showBalanceChanges: Boolean = false, $showEffects: Boolean = false, $showRawEffects: Boolean = false, $showEvents: Boolean = false, $showInput: Boolean = false, $showObjectChanges: Boolean = false, $showRawInput: Boolean = false) {
  transactionBlocks(
    first: $limit
    after: $cursor
    filter: {transactionIds: $digests}
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...RPC_TRANSACTION_FIELDS
    }
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment RPC_TRANSACTION_FIELDS on TransactionBlock {
  digest
  rawTransaction: bcs @include(if: $showInput)
  rawTransaction: bcs @include(if: $showRawInput)
  sender {
    address
  }
  signatures
  effects {
    bcs @include(if: $showEffects)
    bcs @include(if: $showObjectChanges)
    bcs @include(if: $showRawEffects)
    events @include(if: $showEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    checkpoint {
      sequenceNumber
    }
    timestamp
    balanceChanges @include(if: $showBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges @include(if: $showObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var PaginateTransactionBlockListsDocument = new TypedDocumentString(`
    query paginateTransactionBlockLists($digest: String!, $hasMoreEvents: Boolean!, $hasMoreBalanceChanges: Boolean!, $hasMoreObjectChanges: Boolean!, $afterEvents: String, $afterBalanceChanges: String, $afterObjectChanges: String) {
  transactionBlock(digest: $digest) {
    ...PAGINATE_TRANSACTION_LISTS
  }
}
    fragment RPC_EVENTS_FIELDS on Event {
  sendingModule {
    package {
      address
    }
    name
  }
  sender {
    address
  }
  type {
    repr
  }
  json
  bcs
  timestamp
}
fragment PAGINATE_TRANSACTION_LISTS on TransactionBlock {
  effects {
    events(after: $afterEvents) @include(if: $hasMoreEvents) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...RPC_EVENTS_FIELDS
      }
    }
    balanceChanges(after: $afterBalanceChanges) @include(if: $hasMoreBalanceChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        coinType {
          repr
        }
        owner {
          asObject {
            address
          }
          asAddress {
            address
          }
        }
        amount
      }
    }
    objectChanges(after: $afterObjectChanges) @include(if: $hasMoreObjectChanges) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        inputState {
          version
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
        }
        outputState {
          asMoveObject {
            contents {
              type {
                repr
              }
            }
          }
          asMovePackage {
            modules(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
}`);
var ViewDocument = new TypedDocumentString(`
    query View($functionName: String!, $typeArgs: [String!], $arguments: [JSON!]) {
  moveViewCall(
    functionName: $functionName
    typeArgs: $typeArgs
    arguments: $arguments
  ) {
    error
    results
  }
}
    `);
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/util.js
function toShortTypeString(type) {
	return type?.replace(/0x0{31,}(\d)/g, "0x$1").replace(/,\b/g, ", ");
}
function isNumericString(value) {
	return /^-?\d+$/.test(value);
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/bcs.js
function layoutToBcs(layout) {
	switch (layout) {
		case "address": return iotaBcs.Address;
		case "bool": return iotaBcs.Bool;
		case "u8": return iotaBcs.U8;
		case "u16": return iotaBcs.U16;
		case "u32": return iotaBcs.U32;
		case "u64": return iotaBcs.U64;
		case "u128": return iotaBcs.U128;
		case "u256": return iotaBcs.U256;
	}
	if ("vector" in layout) return iotaBcs.vector(layoutToBcs(layout.vector));
	if ("struct" in layout) {
		const fields = {};
		for (const { name, layout: field } of layout.struct.fields) fields[name] = layoutToBcs(field);
		let struct = iotaBcs.struct(layout.struct.type, fields);
		if (toShortTypeString(layout.struct.type) === "0x2::object::ID") {
			struct = struct.transform({
				input: (id) => typeof id === "string" ? { bytes: id } : id,
				output: (id) => id.id
			});
			return struct;
		}
	}
	throw new Error(`Unknown layout: ${layout}`);
}
function mapJsonToBcs(json, layout) {
	return toBase64(layoutToBcs(layout).serialize(json).toBytes());
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/checkpoint.js
function mapGraphQLCheckpointToRpcCheckpoint(checkpoint) {
	const endOfEpochTx = checkpoint.endOfEpoch.nodes[0];
	let endOfEpochData;
	if (endOfEpochTx?.kind?.__typename === "EndOfEpochTransaction" && endOfEpochTx.kind?.transactions.nodes[0].__typename === "ChangeEpochTransactionV2") endOfEpochData = {
		epochCommitments: [],
		nextEpochCommittee: endOfEpochTx.kind.transactions.nodes[0].epoch?.validatorSet?.committeeMembers?.nodes.map((val) => [val.credentials?.authorityPubKey, val.votingPower?.toString()]) ?? [],
		nextEpochProtocolVersion: String(endOfEpochTx.kind.transactions.nodes[0].epoch?.protocolConfigs.protocolVersion),
		epochSupplyChange: 0
	};
	return {
		checkpointCommitments: [],
		digest: checkpoint.digest,
		endOfEpochData,
		epoch: String(checkpoint.epoch?.epochId),
		epochRollingGasCostSummary: {
			computationCost: checkpoint.rollingGasSummary?.computationCost,
			computationCostBurned: checkpoint.rollingGasSummary?.computationCostBurned,
			nonRefundableStorageFee: checkpoint.rollingGasSummary?.nonRefundableStorageFee,
			storageCost: checkpoint.rollingGasSummary?.storageCost,
			storageRebate: checkpoint.rollingGasSummary?.storageRebate
		},
		networkTotalTransactions: String(checkpoint.networkTotalTransactions),
		...checkpoint.previousCheckpointDigest ? { previousDigest: checkpoint.previousCheckpointDigest } : {},
		sequenceNumber: String(checkpoint.sequenceNumber),
		timestampMs: new Date(checkpoint.timestamp).getTime().toString(),
		transactions: checkpoint.transactionBlocks?.nodes.map((transactionBlock) => transactionBlock.digest) ?? [],
		validatorSignature: checkpoint.validatorSignatures
	};
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/move.js
function mapOpenMoveType(type) {
	const body = mapNormalizedType(type.body);
	if (type.ref === "&") return { Reference: body };
	if (type.ref === "&mut") return { MutableReference: body };
	return body;
}
function mapNormalizedType(type) {
	switch (type) {
		case "address": return "Address";
		case "bool": return "Bool";
		case "u8": return "U8";
		case "u16": return "U16";
		case "u32": return "U32";
		case "u64": return "U64";
		case "u128": return "U128";
		case "u256": return "U256";
	}
	if ("vector" in type) return { Vector: mapNormalizedType(type.vector) };
	if ("typeParameter" in type) return { TypeParameter: type.typeParameter };
	if ("datatype" in type) return { Struct: {
		address: toShortTypeString(type.datatype.package),
		module: type.datatype.module,
		name: type.datatype.type,
		typeArguments: type.datatype.typeParameters?.map(mapNormalizedType) ?? []
	} };
	throw new Error("Invalid type");
}
function mapNormalizedMoveFunction(fn) {
	return {
		visibility: `${fn.visibility?.[0]}${fn.visibility?.slice(1).toLowerCase()}`,
		isEntry: fn.isEntry,
		typeParameters: fn.typeParameters?.map((param) => ({ abilities: param.constraints?.map((constraint) => `${constraint[0]}${constraint.slice(1).toLowerCase()}`) ?? [] })) ?? [],
		return: fn.return?.map((param) => mapOpenMoveType(param.signature)) ?? [],
		parameters: fn.parameters?.map((param) => mapOpenMoveType(param.signature)) ?? []
	};
}
function mapNormalizedMoveStruct(struct) {
	return {
		abilities: { abilities: struct.abilities?.map((ability) => `${ability[0]}${ability.slice(1).toLowerCase()}`) ?? [] },
		fields: struct.fields?.map((field) => ({
			name: field.name,
			type: mapOpenMoveType(field.type?.signature)
		})) ?? [],
		typeParameters: struct.typeParameters?.map((param) => ({
			isPhantom: param.isPhantom,
			constraints: { abilities: param.constraints?.map((constraint) => `${constraint[0]}${constraint.slice(1).toLowerCase()}`) }
		})) ?? []
	};
}
function mapNormalizedMoveEnum(struct) {
	return {
		abilities: { abilities: struct.abilities?.map((ability) => `${ability[0]}${ability.slice(1).toLowerCase()}`) ?? [] },
		variants: struct.variants?.reduce((acc, variant) => {
			acc[variant.name] = variant.fields?.map((field) => ({
				name: field.name,
				type: mapOpenMoveType(field.type?.signature)
			})) ?? [];
			return acc;
		}, {}) ?? {},
		typeParameters: struct.typeParameters?.map((param) => ({
			isPhantom: param.isPhantom,
			constraints: { abilities: param.constraints?.map((constraint) => `${constraint[0]}${constraint.slice(1).toLowerCase()}`) }
		})) ?? []
	};
}
function mapNormalizedMoveModule(module, address) {
	const exposedFunctions = {};
	const structs = {};
	const enums = {};
	module.functions?.nodes.filter((func) => func.visibility === "PUBLIC" || func.isEntry || func.visibility === "FRIEND").forEach((func) => {
		exposedFunctions[func.name] = mapNormalizedMoveFunction(func);
	});
	module.structs?.nodes.forEach((struct) => {
		structs[struct.name] = mapNormalizedMoveStruct(struct);
	});
	module.enums?.nodes.forEach((_enum) => {
		enums[_enum.name] = mapNormalizedMoveEnum(_enum);
	});
	return {
		address: toShortTypeString(address),
		name: module.name,
		fileFormatVersion: module.fileFormatVersion,
		friends: module.friends.nodes?.map((friend) => ({
			address: toShortTypeString(friend.package.address),
			name: friend.name
		})) ?? [],
		structs,
		...Object.keys(enums).length > 0 ? { enums } : {},
		exposedFunctions
	};
}
function moveDataToRpcContent(data, layout) {
	if ("Address" in data) return normalizeIotaAddress(data.Address.map((byte) => byte.toString(16).padStart(2, "0")).join(""));
	if ("UID" in data) return { id: normalizeIotaAddress(data.UID.map((byte) => byte.toString(16).padStart(2, "0")).join("")) };
	if ("ID" in data) return normalizeIotaAddress(data.ID.map((byte) => byte.toString(16).padStart(2, "0")).join(""));
	if ("Bool" in data) return data.Bool;
	if ("Number" in data) return layout === "u64" || layout === "u128" || layout === "u256" ? String(data.Number) : Number.parseInt(data.Number, 10);
	if ("String" in data) return data.String;
	if ("Vector" in data) {
		if (typeof layout !== "object" || !("vector" in layout)) throw new Error(`Invalid layout for data: ${JSON.stringify(data)}`);
		const itemLayout = layout.vector;
		return data.Vector.map((item) => moveDataToRpcContent(item, itemLayout));
	}
	if ("Option" in data) {
		if (data.Option === null) return null;
		if (typeof layout !== "object" || !("struct" in layout)) throw new Error(`Invalid layout for Option data: ${JSON.stringify(layout)}`);
		const vecField = layout.struct.fields.find((field) => field.name === "vec");
		if (!vecField) throw new Error(`Could not find the expected 'vec' field in the Option layout.`);
		const innerLayout = vecField.layout;
		const innerData = data.Option;
		if (typeof innerLayout === "object" && "vector" in innerLayout && innerData && !("Vector" in innerData)) {
			const itemLayout = innerLayout.vector;
			return moveDataToRpcContent(innerData, itemLayout);
		}
		return moveDataToRpcContent(innerData, innerLayout);
	}
	if ("Struct" in data) {
		const result = {};
		if (typeof layout !== "object" || !("struct" in layout)) throw new Error(`Invalid layout for data: ${JSON.stringify(data)}}`);
		data.Struct.forEach((item, index) => {
			const { name, layout: itemLayout } = layout.struct.fields[index];
			result[name] = moveDataToRpcContent(item.value, itemLayout);
		});
		const tag = parseStructTag(layout.struct.type);
		switch (`${toShortTypeString(tag.address)}::${tag.module}::${tag.name}`) {
			case "0x1::string::String":
			case "0x1::ascii::String": return result["bytes"];
			case "0x2::url::Url": return result["url"];
			case "0x2::object::ID": return result["bytes"];
			case "0x2::object::UID": return { id: result["id"] };
			case "0x2::balance::Balance": return result["value"];
			case "0x1::option::Option": return result["vec"][0] ?? null;
		}
		return {
			type: toShortTypeString(layout.struct.type),
			fields: result
		};
	}
	throw new Error("Invalid move data: " + JSON.stringify(data));
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/display.js
function formatDisplay(object) {
	const display = {
		data: null,
		error: null
	};
	if (object.display) object.display.forEach((displayItem) => {
		if (displayItem.error) display.error = displayItem.error;
		else if (displayItem.value != null) {
			if (!display.data) display.data = {};
			display.data[displayItem.key] = displayItem.value;
		}
	});
	return display;
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/owner.js
function mapGraphQLOwnerToRpcOwner(owner) {
	switch (owner?.__typename) {
		case "AddressOwner": return owner.owner?.asObject ? { ObjectOwner: owner.owner?.asObject.address } : { AddressOwner: owner.owner?.asAddress?.address };
		case "Parent": return { ObjectOwner: owner.parent?.address };
		case "Shared": return { Shared: { initial_shared_version: String(owner.initialSharedVersion) } };
		case "Immutable": return "Immutable";
	}
	return null;
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/object.js
function mapGraphQLObjectToRpcObject(object, options = {}) {
	return {
		bcs: options?.showBcs ? {
			dataType: "moveObject",
			bcsBytes: object.asMoveObject?.contents?.bcs,
			version: object.version,
			type: toShortTypeString(object.asMoveObject?.contents?.type.repr)
		} : void 0,
		content: options.showContent ? {
			dataType: "moveObject",
			...moveDataToRpcContent(object.asMoveObject?.contents?.data, object.asMoveObject?.contents?.type.layout)
		} : void 0,
		digest: object.digest,
		display: formatDisplay(object),
		objectId: object.objectId,
		owner: mapGraphQLOwnerToRpcOwner(object.owner),
		previousTransaction: object.previousTransactionBlock?.digest,
		storageRebate: object.storageRebate,
		type: toShortTypeString(object.asMoveObject?.contents?.type.repr),
		version: String(object.version)
	};
}
function mapGraphQLMoveObjectToRpcObject(object, options = {}) {
	return {
		bcs: options?.showBcs ? {
			dataType: "moveObject",
			bcsBytes: object?.contents?.bcs,
			version: object.version,
			type: toShortTypeString(object?.contents?.type.repr)
		} : void 0,
		content: options.showContent ? {
			dataType: "moveObject",
			...moveDataToRpcContent(object?.contents?.data, object?.contents?.type.layout)
		} : void 0,
		digest: object.digest,
		display: formatDisplay(object),
		objectId: object.objectId,
		owner: mapGraphQLOwnerToRpcOwner(object.owner),
		previousTransaction: object.previousTransactionBlock?.digest,
		storageRebate: object.storageRebate,
		type: toShortTypeString(object?.contents?.type.repr),
		version: String(object.version)
	};
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/stakes.js
function mapGraphQLStakeToRpcStake(stakes) {
	const delegatedStakes = /* @__PURE__ */ new Map();
	for (const stake of stakes) {
		const pool = stake.contents?.json.pool_id;
		if (!delegatedStakes.has(pool)) delegatedStakes.set(pool, {
			validatorAddress: "",
			stakingPool: pool,
			stakes: []
		});
		delegatedStakes.get(pool).stakes.push({
			stakedIotaId: stake.address,
			stakeRequestEpoch: stake.requestedEpoch?.epochId.toString(),
			stakeActiveEpoch: stake.activatedEpoch?.epochId.toString(),
			principal: stake.principal?.value,
			status: stake.stakeStatus.slice(0, 1).toUpperCase() + stake.stakeStatus.slice(1).toLowerCase(),
			estimatedReward: stake.estimatedReward?.value
		});
	}
	return [...delegatedStakes.values()];
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/transaction-block.js
function mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options, errors) {
	const effects = transactionBlock.effects?.bcs ? mapEffects(transactionBlock.effects.bcs) : null;
	return {
		balanceChanges: transactionBlock.effects?.balanceChanges?.nodes.map((balanceChange) => ({
			amount: balanceChange?.amount,
			coinType: toShortTypeString(balanceChange?.coinType?.repr),
			owner: balanceChange.owner?.asObject?.address ? { ObjectOwner: balanceChange.owner?.asObject?.address } : { AddressOwner: balanceChange.owner?.asAddress?.address }
		})),
		...typeof transactionBlock.effects?.checkpoint?.sequenceNumber === "number" ? { checkpoint: transactionBlock.effects.checkpoint.sequenceNumber.toString() } : {},
		...transactionBlock.effects?.timestamp ? { timestampMs: new Date(transactionBlock.effects?.timestamp).getTime().toString() } : {},
		digest: transactionBlock.digest,
		...options?.showRawEffects ? { rawEffects: transactionBlock.effects?.bcs ? Array.from(fromBase64(transactionBlock.effects?.bcs)) : void 0 } : {},
		effects: options?.showEffects ? effects : void 0,
		...errors ? { errors } : {},
		events: transactionBlock.effects?.events?.nodes.map((event) => ({
			bcs: event.bcs,
			bcsEncoding: "base64",
			id: {
				eventSeq: "",
				txDigest: ""
			},
			packageId: event.sendingModule?.package.address,
			parsedJson: event.json,
			sender: event.sender?.address,
			timestampMs: new Date(event.timestamp).getTime().toString(),
			transactionModule: `${event.sendingModule?.package.address}::${event.sendingModule?.name}`,
			type: toShortTypeString(event.type?.repr)
		})) ?? [],
		rawTransaction: options?.showRawInput ? transactionBlock.rawTransaction : void 0,
		...options?.showInput ? { transaction: transactionBlock.rawTransaction && mapTransactionBlockToInput(iotaBcs.SenderSignedData.parse(fromBase64(transactionBlock.rawTransaction))[0]) } : {},
		objectChanges: options?.showObjectChanges ? mapObjectChanges(transactionBlock, effects) : void 0
	};
}
function mapObjectChanges(transactionBlock, effects) {
	const changes = [];
	effects?.mutated?.forEach((mutated) => {
		const objectChange = transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === mutated.reference.objectId);
		changes.push({
			type: "mutated",
			digest: mutated.reference.digest,
			previousVersion: String(objectChange?.inputState?.version),
			objectId: mutated.reference.objectId,
			owner: mutated.owner,
			objectType: toShortTypeString(objectChange?.outputState?.asMoveObject?.contents?.type.repr),
			sender: transactionBlock.sender?.address,
			version: mutated.reference.version?.toString()
		});
	});
	effects?.created?.forEach((created) => {
		const objectChange = transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === created.reference.objectId);
		if (objectChange?.outputState?.asMovePackage) changes.push({
			type: "published",
			digest: created.reference.digest,
			version: created.reference.version?.toString(),
			packageId: objectChange.address,
			modules: objectChange.outputState.asMovePackage.modules?.nodes.map((module) => module.name)
		});
		else changes.push({
			type: "created",
			digest: created.reference.digest,
			objectId: created.reference.objectId,
			owner: created.owner,
			objectType: toShortTypeString(transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === created.reference.objectId)?.outputState?.asMoveObject?.contents?.type.repr),
			sender: transactionBlock.sender?.address,
			version: created.reference.version?.toString()
		});
	});
	effects?.deleted?.forEach((deleted) => {
		changes.push({
			type: "deleted",
			objectId: deleted.objectId,
			objectType: toShortTypeString(transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === deleted.objectId)?.inputState?.asMoveObject?.contents?.type.repr),
			sender: transactionBlock.sender?.address,
			version: deleted.version?.toString()
		});
	});
	effects?.wrapped?.forEach((wrapped) => {
		changes.push({
			type: "wrapped",
			objectId: wrapped.objectId,
			objectType: toShortTypeString(transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === wrapped.objectId)?.inputState?.asMoveObject?.contents?.type.repr),
			sender: transactionBlock.sender?.address,
			version: wrapped.version?.toString()
		});
	});
	effects?.unwrapped?.forEach((unwrapped) => {
		changes.push({
			type: "unwrapped",
			digest: unwrapped.reference.digest,
			objectId: unwrapped.reference.objectId,
			objectType: toShortTypeString(transactionBlock.effects?.objectChanges?.nodes.find((change) => change.address === unwrapped.reference.objectId)?.outputState?.asMoveObject?.contents?.type.repr),
			owner: unwrapped.owner,
			sender: transactionBlock.sender?.address,
			version: unwrapped.reference.version?.toString()
		});
	});
	return changes;
}
function mapTransactionBlockToInput(data) {
	const txData = data.intentMessage.value.V1;
	const programmableTransaction = "ProgrammableTransaction" in txData.kind ? txData.kind.ProgrammableTransaction : null;
	if (!programmableTransaction) return null;
	return {
		txSignatures: data.txSignatures,
		data: {
			gasData: {
				budget: txData.gasData.budget,
				owner: txData.gasData.owner,
				payment: txData.gasData.payment.map((payment) => ({
					digest: payment.digest,
					objectId: payment.objectId,
					version: Number(payment.version)
				})),
				price: txData.gasData.price
			},
			messageVersion: "v1",
			sender: txData.sender,
			transaction: mapProgrammableTransaction(programmableTransaction)
		}
	};
}
function mapProgrammableTransaction(programmableTransaction) {
	return {
		inputs: programmableTransaction.inputs.map(mapTransactionInput),
		kind: "ProgrammableTransaction",
		transactions: programmableTransaction.commands.map(mapTransaction)
	};
}
function mapTransactionInput(input) {
	if (input.Pure) return {
		type: "pure",
		value: Uint8Array.from(fromBase64(input.Pure.bytes))
	};
	if (input.Object.ImmOrOwnedObject) return {
		type: "object",
		digest: input.Object.ImmOrOwnedObject.digest,
		version: input.Object.ImmOrOwnedObject.version,
		objectId: input.Object.ImmOrOwnedObject.objectId,
		objectType: "immOrOwnedObject"
	};
	if (input.Object.SharedObject) return {
		type: "object",
		initialSharedVersion: input.Object.SharedObject.initialSharedVersion,
		objectId: input.Object.SharedObject.objectId,
		mutable: input.Object.SharedObject.mutable,
		objectType: "sharedObject"
	};
	if (input.Object.Receiving) return {
		type: "object",
		digest: input.Object.Receiving.digest,
		version: input.Object.Receiving.version,
		objectId: input.Object.Receiving.objectId,
		objectType: "receiving"
	};
	throw new Error(`Unknown object type: ${input.Object}`);
}
function mapTransaction(transaction) {
	switch (transaction.$kind) {
		case "MoveCall": return { MoveCall: {
			arguments: transaction.MoveCall.arguments.map(mapTransactionArgument),
			function: transaction.MoveCall.function,
			module: transaction.MoveCall.module,
			package: transaction.MoveCall.package,
			type_arguments: transaction.MoveCall.typeArguments
		} };
		case "MakeMoveVec": return { MakeMoveVec: [transaction.MakeMoveVec.type, transaction.MakeMoveVec.elements.map(mapTransactionArgument)] };
		case "MergeCoins": return { MergeCoins: [mapTransactionArgument(transaction.MergeCoins.destination), transaction.MergeCoins.sources.map(mapTransactionArgument)] };
		case "Publish": return { Publish: transaction.Publish.modules.map((module) => module) };
		case "SplitCoins": return { SplitCoins: [mapTransactionArgument(transaction.SplitCoins.coin), transaction.SplitCoins.amounts.map(mapTransactionArgument)] };
		case "TransferObjects": return { TransferObjects: [transaction.TransferObjects.objects.map(mapTransactionArgument), mapTransactionArgument(transaction.TransferObjects.address)] };
		case "Upgrade": return { Upgrade: [
			transaction.Upgrade.modules.map((module) => module),
			transaction.Upgrade.package,
			mapTransactionArgument(transaction.Upgrade.ticket)
		] };
	}
	throw new Error(`Unknown transaction type ${transaction}`);
}
function mapTransactionArgument(arg) {
	switch (arg.$kind) {
		case "GasCoin": return "GasCoin";
		case "Input": return { Input: arg.Input };
		case "Result": return { Result: arg.Result };
		case "NestedResult": return { NestedResult: arg.NestedResult };
	}
	throw new Error(`Unknown argument type ${arg}`);
}
var OBJECT_DIGEST_DELETED = toBase58(Uint8Array.from({ length: 32 }, () => 99));
var OBJECT_DIGEST_WRAPPED = toBase58(Uint8Array.from({ length: 32 }, () => 88));
var OBJECT_DIGEST_ZERO = toBase58(Uint8Array.from({ length: 32 }, () => 0));
var ADDRESS_ZERO = normalizeIotaAddress("0x0");
function mapEffects(data) {
	const effects = iotaBcs.TransactionEffects.parse(fromBase64(data));
	const sharedObjects = effects.V1.unchangedSharedObjects.map(([id, sharedObject]) => {
		switch (sharedObject.$kind) {
			case "ReadOnlyRoot": return {
				objectId: id,
				version: Number(sharedObject.ReadOnlyRoot[0]),
				digest: sharedObject.ReadOnlyRoot[1]
			};
			case "MutateDeleted": return {
				objectId: id,
				version: Number(sharedObject.MutateDeleted),
				digest: OBJECT_DIGEST_DELETED
			};
			case "ReadDeleted": return {
				objectId: id,
				version: Number(sharedObject.ReadDeleted),
				digest: OBJECT_DIGEST_DELETED
			};
			default: throw new Error(`Unknown shared object type: ${sharedObject}`);
		}
	});
	effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist?.[1].Shared).forEach(([id, change]) => {
		sharedObjects.push({
			objectId: id,
			version: Number(change.inputState.Exist[0][0]),
			digest: change.inputState.Exist[0][1]
		});
	});
	const modifiedAtVersions = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist).map(([id, change]) => [id, change.inputState.Exist[0][0]]);
	const created = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.NotExist && (change.outputState.ObjectWrite || change.outputState.PackageWrite) && change.idOperation.Created).map(([objectId, change]) => change.outputState.PackageWrite ? [{
		objectId,
		version: Number(change.outputState.PackageWrite[0]),
		digest: change.outputState.PackageWrite[1]
	}, {
		$kind: "Immutable",
		Immutable: true
	}] : [{
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: change.outputState.ObjectWrite[0]
	}, change.outputState.ObjectWrite[1]]);
	const mutated = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist && (change.outputState.ObjectWrite || change.outputState.PackageWrite)).map(([objectId, change]) => [change.outputState.PackageWrite ? {
		objectId,
		version: Number(change.outputState.PackageWrite[0]),
		digest: change.outputState.PackageWrite[1]
	} : {
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: change.outputState.ObjectWrite[0]
	}, change.outputState.ObjectWrite ? change.outputState.ObjectWrite[1] : {
		$kind: "Immutable",
		Immutable: true
	}]);
	const unwrapped = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.NotExist && change.outputState.ObjectWrite && change.idOperation.None).map(([objectId, change]) => [{
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: change.outputState.ObjectWrite[0]
	}, change.outputState.ObjectWrite[1]]);
	const deleted = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist && change.outputState.NotExist && change.idOperation.Deleted).map(([objectId, _change]) => ({
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: OBJECT_DIGEST_DELETED
	}));
	const unwrappedThenDeleted = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.NotExist && change.outputState.NotExist && change.idOperation.Deleted).map(([objectId, _change]) => ({
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: OBJECT_DIGEST_DELETED
	}));
	const wrapped = effects.V1.changedObjects.filter(([_id, change]) => change.inputState.Exist && change.outputState.NotExist && change.idOperation.None).map(([objectId, _change]) => ({
		objectId,
		version: Number(effects.V1.lamportVersion),
		digest: OBJECT_DIGEST_WRAPPED
	}));
	const gasObjectFromV1 = effects.V1.gasObjectIndex != null ? effects.V1.changedObjects[effects.V1.gasObjectIndex] : null;
	const gasObject = gasObjectFromV1 ? [{
		objectId: gasObjectFromV1[0],
		digest: gasObjectFromV1[1].outputState.ObjectWrite[0],
		version: Number(effects.V1.lamportVersion)
	}, gasObjectFromV1[1].outputState.ObjectWrite[1]] : [{
		objectId: ADDRESS_ZERO,
		version: "0",
		digest: OBJECT_DIGEST_ZERO
	}, {
		$kind: "AddressOwner",
		AddressOwner: ADDRESS_ZERO
	}];
	return {
		messageVersion: "v1",
		status: effects.V1.status.Success ? { status: "success" } : {
			status: "failure",
			error: effects.V1.status.$kind
		},
		executedEpoch: effects.V1.executedEpoch,
		gasUsed: effects.V1.gasUsed,
		modifiedAtVersions: modifiedAtVersions.map(([objectId, sequenceNumber]) => ({
			objectId,
			sequenceNumber
		})),
		...sharedObjects.length === 0 ? {} : { sharedObjects },
		transactionDigest: effects.V1.transactionDigest,
		...created.length === 0 ? {} : { created: created.map(([reference, owner]) => ({
			reference,
			owner: mapEffectsOwner(owner)
		})) },
		...mutated.length === 0 ? {} : { mutated: mutated.map(([reference, owner]) => ({
			reference,
			owner: mapEffectsOwner(owner)
		})) },
		...unwrapped.length === 0 ? {} : { unwrapped: unwrapped.length === 0 ? void 0 : unwrapped.map(([reference, owner]) => ({
			reference,
			owner: mapEffectsOwner(owner)
		})) },
		...deleted.length === 0 ? {} : { deleted },
		...unwrappedThenDeleted.length === 0 ? {} : { unwrappedThenDeleted },
		...wrapped.length === 0 ? {} : { wrapped },
		gasObject: {
			reference: gasObject[0],
			owner: mapEffectsOwner(gasObject[1])
		},
		...effects.V1.eventsDigest ? { eventsDigest: effects.V1.eventsDigest } : {},
		dependencies: effects.V1.dependencies
	};
	function mapEffectsOwner(owner) {
		if (owner.Immutable) return "Immutable";
		else if (owner.Shared) return { Shared: { initial_shared_version: owner.Shared.initialSharedVersion } };
		else if (owner.AddressOwner) return { AddressOwner: owner.AddressOwner };
		else if (owner.ObjectOwner) return { ObjectOwner: owner.ObjectOwner };
		throw new Error(`Unknown owner type: ${owner}`);
	}
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/mappers/validator.js
function mapGraphQlValidatorToRpcValidator(validator) {
	return {
		commissionRate: validator.commissionRate?.toString(),
		effectiveCommissionRate: validator.effectiveCommissionRate?.toString(),
		description: validator.description,
		exchangeRatesId: validator.exchangeRatesTable?.address,
		exchangeRatesSize: validator.exchangeRatesSize?.toString(),
		gasPrice: validator.gasPrice,
		imageUrl: validator.imageUrl,
		name: validator.name,
		netAddress: validator.credentials?.netAddress,
		networkPubkeyBytes: validator.credentials?.networkPubKey,
		nextEpochCommissionRate: validator.nextEpochCommissionRate?.toString(),
		nextEpochGasPrice: validator.nextEpochGasPrice,
		nextEpochNetAddress: validator.nextEpochCredentials?.netAddress,
		nextEpochNetworkPubkeyBytes: validator.nextEpochCredentials?.networkPubKey,
		nextEpochP2pAddress: validator.nextEpochCredentials?.p2PAddress,
		nextEpochPrimaryAddress: validator.nextEpochCredentials?.primaryAddress,
		nextEpochProofOfPossession: validator.nextEpochCredentials?.proofOfPossession,
		nextEpochAuthorityPubkeyBytes: validator.nextEpochCredentials?.authorityPubKey,
		nextEpochStake: validator.nextEpochStake,
		nextEpochProtocolPubkeyBytes: validator.nextEpochCredentials?.protocolPubKey,
		operationCapId: validator.operationCap?.address,
		p2pAddress: validator.credentials?.p2PAddress,
		pendingTotalIotaWithdraw: validator.pendingTotalIotaWithdraw,
		pendingPoolTokenWithdraw: validator.pendingPoolTokenWithdraw,
		poolTokenBalance: validator.poolTokenBalance,
		pendingStake: validator.pendingStake,
		primaryAddress: validator.credentials?.primaryAddress,
		projectUrl: validator.projectUrl,
		proofOfPossessionBytes: validator.credentials?.proofOfPossession,
		authorityPubkeyBytes: validator.credentials?.authorityPubKey,
		protocolPubkeyBytes: validator.credentials?.protocolPubKey,
		rewardsPool: validator.rewardsPool,
		stakingPoolId: validator.stakingPoolId,
		stakingPoolActivationEpoch: validator.stakingPoolActivationEpoch?.toString(),
		stakingPoolIotaBalance: validator.stakingPoolIotaBalance,
		iotaAddress: validator.address.address,
		votingPower: validator.votingPower?.toString()
	};
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/methods.js
var RPC_METHODS = {
	async getRpcApiVersion(transport) {
		const res = await transport.graphqlRequest({
			query: "query { __typename }",
			variables: {}
		});
		if (!res.ok) throw new Error("Failed to fetch");
		return { info: { version: res.headers.get("x-iota-rpc-version") ?? void 0 } };
	},
	async getCoins(transport, [owner, coinType, cursor, limit]) {
		const { nodes: coins, pageInfo } = await transport.graphqlQuery({
			query: GetCoinsDocument,
			variables: {
				owner,
				type: coinType,
				cursor,
				first: limit
			}
		}, (data) => data.address?.coins);
		return {
			data: coins.map((coin) => ({
				balance: coin.coinBalance,
				coinObjectId: coin.address,
				coinType: toShortTypeString(normalizeStructTag(parseStructTag(coin.contents?.type.repr).typeParams[0])),
				digest: coin.digest,
				previousTransaction: coin.previousTransactionBlock?.digest,
				version: String(coin.version)
			})),
			nextCursor: pageInfo.endCursor,
			hasNextPage: pageInfo.hasNextPage
		};
	},
	async getAllCoins(transport, inputs) {
		const { nodes: coins, pageInfo } = await transport.graphqlQuery({
			query: GetCoinsDocument,
			variables: {
				owner: inputs[0],
				cursor: inputs[1],
				first: inputs[2]
			}
		}, (data) => data.address?.coins);
		return {
			data: coins.map((coin) => ({
				balance: coin.coinBalance,
				coinObjectId: coin.address,
				coinType: toShortTypeString(normalizeStructTag(parseStructTag(coin.contents?.type.repr).typeParams[0])),
				digest: coin.digest,
				previousTransaction: coin.previousTransactionBlock?.digest,
				version: String(coin.version)
			})),
			nextCursor: pageInfo.endCursor,
			hasNextPage: pageInfo.hasNextPage
		};
	},
	async getBalance(transport, inputs) {
		try {
			const balance = await transport.graphqlQuery({
				query: GetBalanceDocument,
				variables: {
					owner: inputs[0],
					type: inputs[1]
				}
			}, (data) => data.address?.balance);
			return {
				coinType: toShortTypeString(balance.coinType?.repr) || IOTA_TYPE_ARG,
				coinObjectCount: balance.coinObjectCount || 0,
				totalBalance: balance.totalBalance || 0
			};
		} catch (error) {
			console.warn("GraphQL getBalance failed, falling back to default values:", error);
			return {
				coinType: normalizeStructTag(inputs[1] ?? IOTA_TYPE_ARG),
				coinObjectCount: 0,
				totalBalance: "0"
			};
		}
	},
	async getAllBalances(transport, inputs) {
		return (await transport.graphqlQuery({
			query: GetAllBalancesDocument,
			variables: { owner: inputs[0] }
		}, (data) => data.address?.balances?.nodes)).map((balance) => ({
			coinType: toShortTypeString(balance.coinType?.repr),
			coinObjectCount: balance.coinObjectCount,
			totalBalance: balance.totalBalance
		}));
	},
	async getCoinMetadata(transport, inputs) {
		const metadata = await transport.graphqlQuery({
			query: GetCoinMetadataDocument,
			variables: { coinType: inputs[0] }
		}, (data) => data.coinMetadata);
		return {
			decimals: metadata.decimals,
			name: metadata.name,
			symbol: metadata.symbol,
			description: metadata.description,
			iconUrl: metadata.iconUrl,
			id: metadata.address
		};
	},
	async getTotalSupply(transport, inputs) {
		const metadata = await transport.graphqlQuery({
			query: GetTotalSupplyDocument,
			variables: { coinType: inputs[0] }
		}, (data) => data.coinMetadata);
		return { value: BigInt(metadata.supply).toString() };
	},
	async getMoveFunctionArgTypes(transport, [pkg, module, fn]) {
		return (await transport.graphqlQuery({
			query: GetMoveFunctionArgTypesDocument,
			variables: {
				module,
				packageId: pkg,
				function: fn
			}
		}, (data) => data.object?.asMovePackage?.module?.function?.parameters)).map((parameter) => {
			if (!parameter.signature.body.datatype) return "Pure";
			return { Object: parameter.signature.ref === "&" ? "ByImmutableReference" : parameter.signature.ref === "&mut" ? "ByMutableReference" : "ByValue" };
		});
	},
	async getNormalizedMoveFunction(transport, [pkg, module, fn]) {
		return mapNormalizedMoveFunction(await transport.graphqlQuery({
			query: GetNormalizedMoveFunctionDocument,
			variables: {
				module,
				packageId: pkg,
				function: fn
			}
		}, (data) => data.object?.asMovePackage?.module?.function));
	},
	async getNormalizedMoveModulesByPackage(transport, [pkg]) {
		const movePackage = await transport.graphqlQuery({
			query: GetNormalizedMoveModulesByPackageDocument,
			variables: { packageId: pkg }
		}, (data) => data.object?.asMovePackage);
		let hasNextPage = movePackage.modules?.pageInfo.hasNextPage ?? false;
		let cursor = movePackage.modules?.pageInfo.endCursor;
		while (hasNextPage) {
			const page = await transport.graphqlQuery({
				query: GetNormalizedMoveModulesByPackageDocument,
				variables: {
					packageId: pkg,
					cursor
				}
			}, (data) => data.object?.asMovePackage);
			movePackage.modules?.nodes.push(...page.modules?.nodes ?? []);
			hasNextPage = page.modules?.pageInfo.hasNextPage ?? false;
			cursor = page.modules?.pageInfo.endCursor;
		}
		const address = toShortTypeString(movePackage.address);
		const modules = {};
		for (const moveModule of movePackage.modules?.nodes ?? []) {
			let hasMoreFriends = moveModule.friends?.pageInfo.hasNextPage ?? false;
			let hasMoreFunctions = moveModule.functions?.pageInfo.hasNextPage ?? false;
			let hasMoreStructs = moveModule.structs?.pageInfo.hasNextPage ?? false;
			let hasMoreEnums = moveModule.enums?.pageInfo.hasNextPage ?? false;
			let afterFriends = moveModule.friends?.pageInfo.endCursor;
			let afterFunctions = moveModule.functions?.pageInfo.endCursor;
			let afterStructs = moveModule.structs?.pageInfo.endCursor;
			let afterEnums = moveModule.enums?.pageInfo.endCursor;
			while (hasMoreFriends || hasMoreStructs || hasMoreFunctions || hasMoreEnums) {
				const page = await transport.graphqlQuery({
					query: PaginateMoveModuleListsDocument,
					variables: {
						module: moveModule.name,
						packageId: pkg,
						hasMoreFriends,
						hasMoreFunctions,
						hasMoreStructs,
						hasMoreEnums,
						afterFriends,
						afterFunctions,
						afterStructs,
						afterEnums
					}
				}, (data) => data.object?.asMovePackage?.module);
				moveModule.friends.nodes.push(...page.friends?.nodes ?? []);
				moveModule.functions?.nodes.push(...page.functions?.nodes ?? []);
				moveModule.structs?.nodes.push(...page.structs?.nodes ?? []);
				moveModule.enums?.nodes.push(...page.enums?.nodes ?? []);
				hasMoreFriends = page.friends?.pageInfo.hasNextPage ?? false;
				hasMoreFunctions = page.functions?.pageInfo.hasNextPage ?? false;
				hasMoreStructs = page.structs?.pageInfo.hasNextPage ?? false;
				hasMoreEnums = page.enums?.pageInfo.hasNextPage ?? false;
				afterFriends = page.friends?.pageInfo.endCursor;
				afterFunctions = page.functions?.pageInfo.endCursor;
				afterStructs = page.structs?.pageInfo.endCursor;
				afterEnums = page.enums?.pageInfo.endCursor;
			}
		}
		movePackage.modules?.nodes.forEach((module) => {
			modules[module.name] = mapNormalizedMoveModule(module, address);
		});
		return modules;
	},
	async getNormalizedMoveModule(transport, [pkg, module]) {
		const moveModule = await transport.graphqlQuery({
			query: GetNormalizedMoveModuleDocument,
			variables: {
				module,
				packageId: pkg
			}
		}, (data) => data.object?.asMovePackage?.module);
		let hasMoreFriends = moveModule.friends?.pageInfo.hasNextPage ?? false;
		let hasMoreFunctions = moveModule.functions?.pageInfo.hasNextPage ?? false;
		let hasMoreStructs = moveModule.structs?.pageInfo.hasNextPage ?? false;
		let hasMoreEnums = moveModule.enums?.pageInfo.hasNextPage ?? false;
		let afterFriends = moveModule.friends?.pageInfo.endCursor;
		let afterFunctions = moveModule.functions?.pageInfo.endCursor;
		let afterStructs = moveModule.structs?.pageInfo.endCursor;
		let afterEnums = moveModule.enums?.pageInfo.endCursor;
		while (hasMoreFriends || hasMoreStructs || hasMoreFunctions || hasMoreEnums) {
			const page = await transport.graphqlQuery({
				query: PaginateMoveModuleListsDocument,
				variables: {
					module,
					packageId: pkg,
					hasMoreFriends,
					hasMoreFunctions,
					hasMoreStructs,
					hasMoreEnums,
					afterFriends,
					afterFunctions,
					afterStructs,
					afterEnums
				}
			}, (data) => data.object?.asMovePackage?.module);
			moveModule.friends.nodes.push(...page.friends?.nodes ?? []);
			moveModule.functions?.nodes.push(...page.functions?.nodes ?? []);
			moveModule.structs?.nodes.push(...page.structs?.nodes ?? []);
			moveModule.enums?.nodes.push(...page.enums?.nodes ?? []);
			hasMoreFriends = page.friends?.pageInfo.hasNextPage ?? false;
			hasMoreFunctions = page.functions?.pageInfo.hasNextPage ?? false;
			hasMoreStructs = page.structs?.pageInfo.hasNextPage ?? false;
			hasMoreEnums = page.enums?.pageInfo.hasNextPage ?? false;
			afterFriends = page.friends?.pageInfo.endCursor;
			afterFunctions = page.functions?.pageInfo.endCursor;
			afterStructs = page.structs?.pageInfo.endCursor;
			afterEnums = page.enums?.pageInfo.endCursor;
		}
		return mapNormalizedMoveModule(moveModule, normalizeIotaAddress(pkg));
	},
	async getNormalizedMoveStruct(transport, [pkg, module, struct]) {
		return mapNormalizedMoveStruct(await transport.graphqlQuery({
			query: GetNormalizedMoveStructDocument,
			variables: {
				packageId: pkg,
				module,
				struct
			}
		}, (data) => data.object?.asMovePackage?.module?.struct));
	},
	async getOwnedObjects(transport, [owner, { filter: inputFilter, options }, cursor, limit]) {
		let filter;
		let typeFilter;
		if (inputFilter) {
			if ("Package" in inputFilter) typeFilter = inputFilter.Package;
			else if ("MoveModule" in inputFilter) typeFilter = `${inputFilter.MoveModule.package}::${inputFilter.MoveModule.module}`;
			else if ("StructType" in inputFilter) typeFilter = inputFilter.StructType;
			filter = {
				objectIds: "ObjectIds" in inputFilter ? inputFilter.ObjectIds : "ObjectId" in inputFilter ? [inputFilter.ObjectId] : void 0,
				type: typeFilter,
				owner: "ObjectOwner" in inputFilter ? inputFilter.ObjectOwner : "AddressOwner" in inputFilter ? inputFilter.AddressOwner : void 0
			};
			for (const unsupportedFilter of [
				"MatchAll",
				"MatchAny",
				"MatchNone",
				"Version"
			]) if (unsupportedFilter in inputFilter) throw new UnsupportedParamError("getOwnedObjects", unsupportedFilter);
		}
		const { nodes: objects, pageInfo } = await transport.graphqlQuery({
			query: GetOwnedObjectsDocument,
			variables: {
				owner,
				limit,
				cursor,
				showBcs: options?.showBcs,
				showContent: options?.showContent,
				showDisplay: options?.showDisplay,
				showOwner: options?.showOwner,
				showPreviousTransaction: options?.showPreviousTransaction,
				showStorageRebate: options?.showStorageRebate,
				showType: options?.showType,
				filter
			}
		}, (data) => data.address?.objects);
		return {
			hasNextPage: pageInfo.hasNextPage,
			nextCursor: pageInfo.endCursor,
			data: objects.map((object) => ({ data: mapGraphQLMoveObjectToRpcObject(object, options ?? {}) }))
		};
	},
	async getObject(transport, [id, options]) {
		try {
			return { data: mapGraphQLObjectToRpcObject(await transport.graphqlQuery({
				query: GetObjectDocument,
				variables: {
					id,
					showBcs: options?.showBcs,
					showContent: options?.showContent,
					showDisplay: options?.showDisplay,
					showOwner: options?.showOwner,
					showPreviousTransaction: options?.showPreviousTransaction,
					showStorageRebate: options?.showStorageRebate,
					showType: options?.showType
				}
			}, (data) => data.object), options ?? {}) };
		} catch (_) {
			return { error: {
				code: "notExists",
				object_id: id
			} };
		}
	},
	async tryGetPastObject(transport, [id, version, options]) {
		const data = await transport.graphqlQuery({
			query: TryGetPastObjectDocument,
			variables: {
				id,
				version,
				showBcs: options?.showBcs,
				showContent: options?.showContent,
				showDisplay: options?.showDisplay,
				showOwner: options?.showOwner,
				showPreviousTransaction: options?.showPreviousTransaction,
				showStorageRebate: options?.showStorageRebate,
				showType: options?.showType
			}
		});
		if (!data.current) return {
			details: id,
			status: "ObjectNotExists"
		};
		if (!data.object) return data.current.version < Number(version) ? {
			status: "VersionTooHigh",
			details: {
				asked_version: String(version),
				latest_version: String(data.current.version),
				object_id: data.current.address
			}
		} : {
			status: "VersionNotFound",
			details: [data.current.address, String(version)]
		};
		return {
			status: "VersionFound",
			details: mapGraphQLObjectToRpcObject(data.object, options ?? {})
		};
	},
	async multiGetObjects(transport, [ids, options]) {
		return (await transport.graphqlQuery({
			query: MultiGetObjectsDocument,
			variables: {
				ids,
				showBcs: options?.showBcs,
				showContent: options?.showContent,
				showDisplay: options?.showDisplay,
				showOwner: options?.showOwner,
				showPreviousTransaction: options?.showPreviousTransaction,
				showStorageRebate: options?.showStorageRebate,
				showType: options?.showType,
				limit: ids.length
			}
		}, (data) => data.objects?.nodes)).map((object) => ({ data: mapGraphQLObjectToRpcObject(object, options ?? {}) }));
	},
	async queryTransactionBlocks(transport, [{ filter, options }, cursor, limit = 20, descending]) {
		const pagination = descending ? {
			last: limit,
			before: cursor
		} : {
			first: limit,
			after: cursor
		};
		const unsupportedFilters = [
			"FromOrToAddress",
			"FromAndToAddress",
			"TransactionKindIn"
		];
		if (filter) {
			for (const unsupportedFilter of unsupportedFilters) if (unsupportedFilter in filter) throw new UnsupportedParamError("queryTransactionBlocks", unsupportedFilter);
		}
		let graphqlTransactionKindFilter;
		if ("TransactionKind" in filter) switch (filter.TransactionKind) {
			case "ProgrammableTransaction":
				graphqlTransactionKindFilter = TransactionBlockKindInput.ProgrammableTx;
				break;
			case "Genesis":
				graphqlTransactionKindFilter = TransactionBlockKindInput.Genesis;
				break;
			case "ConsensusCommitPrologueV1":
				graphqlTransactionKindFilter = TransactionBlockKindInput.ConsensusCommitPrologueV1;
				break;
			case "RandomnessStateUpdate":
				graphqlTransactionKindFilter = TransactionBlockKindInput.RandomnessStateUpdate;
				break;
			case "EndOfEpochTransaction":
				graphqlTransactionKindFilter = TransactionBlockKindInput.EndOfEpochTx;
				break;
			case "SystemTransaction":
				graphqlTransactionKindFilter = TransactionBlockKindInput.SystemTx;
				break;
		}
		const { nodes: transactionBlocks, pageInfo } = await transport.graphqlQuery({
			query: QueryTransactionBlocksDocument,
			variables: {
				...pagination,
				showBalanceChanges: options?.showBalanceChanges,
				showEffects: options?.showEffects,
				showEvents: options?.showEvents,
				showInput: options?.showInput,
				showObjectChanges: options?.showObjectChanges,
				showRawEffects: options?.showRawEffects,
				showRawInput: options?.showRawInput,
				filter: filter ? {
					atCheckpoint: "Checkpoint" in filter ? Number.parseInt(filter.Checkpoint) : void 0,
					function: "MoveFunction" in filter ? `${filter.MoveFunction.package}::${filter.MoveFunction.module}::${filter.MoveFunction.function}` : void 0,
					inputObject: "InputObject" in filter ? filter.InputObject : void 0,
					changedObject: "ChangedObject" in filter ? filter.ChangedObject : void 0,
					sentAddress: "FromAddress" in filter ? filter.FromAddress : void 0,
					recvAddress: "ToAddress" in filter ? filter.ToAddress : void 0,
					kind: graphqlTransactionKindFilter
				} : {}
			}
		}, (data) => data.transactionBlocks);
		for (const transactionBlock of transactionBlocks) await paginateTransactionBlockLists(transport, transactionBlock);
		if (pagination.last) transactionBlocks.reverse();
		return {
			hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
			nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
			data: transactionBlocks.map((transactionBlock) => mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options ?? {}))
		};
	},
	async getTransactionBlock(transport, [digest, options]) {
		const transactionBlock = await transport.graphqlQuery({
			query: GetTransactionBlockDocument,
			variables: {
				digest,
				showBalanceChanges: options?.showBalanceChanges,
				showEffects: options?.showEffects,
				showEvents: options?.showEvents,
				showInput: options?.showInput,
				showObjectChanges: options?.showObjectChanges,
				showRawEffects: options?.showRawEffects,
				showRawInput: options?.showRawInput
			}
		}, (data) => data.transactionBlock);
		await paginateTransactionBlockLists(transport, transactionBlock);
		return mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options);
	},
	async multiGetTransactionBlocks(transport, [digests, options]) {
		const transactionBlocks = await transport.graphqlQuery({
			query: MultiGetTransactionBlocksDocument,
			variables: {
				digests,
				showBalanceChanges: options?.showBalanceChanges,
				showEffects: options?.showEffects,
				showEvents: options?.showEvents,
				showInput: options?.showInput,
				showObjectChanges: options?.showObjectChanges,
				showRawEffects: options?.showEffects,
				showRawInput: options?.showRawInput,
				limit: digests.length
			}
		}, (data) => data.transactionBlocks?.nodes);
		for (const transactionBlock of transactionBlocks) await paginateTransactionBlockLists(transport, transactionBlock);
		return transactionBlocks.map((transactionBlock) => mapGraphQLTransactionBlockToRpcTransactionBlock(transactionBlock, options));
	},
	async getTotalTransactionBlocks(transport) {
		return transport.graphqlQuery({ query: GetTotalTransactionBlocksDocument }, (data) => BigInt(data.checkpoint?.networkTotalTransactions));
	},
	async getReferenceGasPrice(transport) {
		const epoch = await transport.graphqlQuery({
			query: GetReferenceGasPriceDocument,
			variables: {}
		}, (data) => data.epoch);
		return BigInt(epoch.referenceGasPrice);
	},
	async getStakes(transport, [owner]) {
		return mapGraphQLStakeToRpcStake(await transport.graphqlQuery({
			query: GetStakesDocument,
			variables: { owner }
		}, (data) => data.address?.stakedIotas?.nodes));
	},
	async getStakesByIds(transport, [stakedIotaIds]) {
		return mapGraphQLStakeToRpcStake(await transport.graphqlQuery({
			query: GetStakesByIdsDocument,
			variables: { ids: stakedIotaIds }
		}, (data) => data.objects?.nodes.map((node) => node?.asMoveObject?.asStakedIota).filter(Boolean)));
	},
	async getLatestIotaSystemStateV2(transport) {
		const systemState = await transport.graphqlQuery({ query: GetLatestIotaSystemStateDocument }, (data) => data.epoch);
		let hasMoreActiveValidators = systemState.validatorSet?.activeValidators?.pageInfo.hasNextPage ?? false;
		let afterActiveValidators = systemState.validatorSet?.activeValidators?.pageInfo.endCursor;
		while (hasMoreActiveValidators) {
			const page = await transport.graphqlQuery({
				query: PaginateEpochValidatorsDocument,
				variables: {
					id: systemState.epochId,
					after: afterActiveValidators
				}
			}, (data) => data.epoch);
			systemState.validatorSet?.activeValidators?.nodes.push(...page.validatorSet?.activeValidators?.nodes ?? []);
			hasMoreActiveValidators = page.validatorSet?.activeValidators?.pageInfo.hasNextPage ?? false;
			afterActiveValidators = page.validatorSet?.activeValidators?.pageInfo.endCursor;
		}
		let hasMoreCommitteeMembers = systemState.validatorSet?.committeeMembers?.pageInfo.hasNextPage ?? false;
		let afterCommitteeMembers = systemState.validatorSet?.committeeMembers?.pageInfo.endCursor;
		while (hasMoreCommitteeMembers) {
			const page = await transport.graphqlQuery({
				query: PaginateEpochValidatorsDocument,
				variables: {
					id: systemState.epochId,
					after: afterCommitteeMembers
				}
			}, (data) => data.epoch);
			systemState.validatorSet?.committeeMembers?.nodes.push(...page.validatorSet?.committeeMembers?.nodes ?? []);
			hasMoreCommitteeMembers = page.validatorSet?.committeeMembers?.pageInfo.hasNextPage ?? false;
			afterCommitteeMembers = page.validatorSet?.committeeMembers?.pageInfo.endCursor;
		}
		return { V2: {
			activeValidators: systemState.validatorSet?.activeValidators?.nodes.map(mapGraphQlValidatorToRpcValidator),
			committeeMembers: systemState.validatorSet?.committeeMembers?.nodes?.map((_, index) => index.toString()),
			atRiskValidators: systemState.validatorSet?.activeValidators.nodes?.filter((validator) => validator.atRisk).map((validator) => [validator.address.address, validator.atRisk.toString()]),
			epoch: String(systemState.epochId),
			epochDurationMs: String(new Date(systemState.endTimestamp).getTime() - new Date(systemState.startTimestamp).getTime()),
			epochStartTimestampMs: String(new Date(systemState.startTimestamp).getTime()),
			inactivePoolsSize: String(systemState.validatorSet?.inactivePoolsSize),
			iotaTotalSupply: String(systemState.iotaTotalSupply),
			iotaTreasuryCapId: String(systemState.iotaTreasuryCapId),
			maxValidatorCount: String(systemState.systemParameters?.maxValidatorCount),
			minValidatorCount: String(systemState.systemParameters?.minValidatorCount),
			minValidatorJoiningStake: String(systemState.systemParameters?.minValidatorJoiningStake),
			pendingActiveValidatorsSize: String(systemState.validatorSet?.pendingActiveValidatorsSize),
			pendingRemovals: systemState.validatorSet?.pendingRemovals?.map((idx) => String(idx)) ?? [],
			protocolVersion: String(systemState.protocolConfigs?.protocolVersion),
			referenceGasPrice: String(systemState.referenceGasPrice),
			safeMode: systemState.safeMode?.enabled,
			safeModeComputationCharges: String(systemState.safeMode?.gasSummary?.computationCost),
			safeModeComputationChargesBurned: String(systemState.safeMode?.gasSummary?.computationCostBurned),
			safeModeNonRefundableStorageFee: String(systemState.safeMode?.gasSummary?.nonRefundableStorageFee),
			safeModeStorageRebates: String(systemState.safeMode?.gasSummary?.storageRebate),
			safeModeStorageCharges: String(systemState.safeMode?.gasSummary?.storageCost),
			stakingPoolMappingsSize: String(systemState.validatorSet?.stakingPoolMappingsSize),
			storageFundNonRefundableBalance: String(systemState.storageFund?.nonRefundableBalance),
			storageFundTotalObjectStorageRebates: String(systemState.storageFund?.totalObjectStorageRebates),
			systemStateVersion: String(systemState.systemStateVersion),
			totalStake: systemState.validatorSet?.totalStake,
			validatorCandidatesSize: systemState.validatorSet?.validatorCandidatesSize?.toString(),
			validatorLowStakeGracePeriod: systemState.systemParameters?.validatorLowStakeGracePeriod,
			validatorLowStakeThreshold: systemState.systemParameters?.validatorLowStakeThreshold,
			validatorReportRecords: [],
			validatorVeryLowStakeThreshold: systemState.systemParameters?.validatorVeryLowStakeThreshold,
			validatorCandidatesId: systemState.validatorSet?.validatorCandidatesId,
			inactivePoolsId: systemState.validatorSet?.inactivePoolsId,
			pendingActiveValidatorsId: systemState.validatorSet?.pendingActiveValidatorsId,
			stakingPoolMappingsId: systemState.validatorSet?.stakingPoolMappingsId
		} };
	},
	async queryEvents(transport, [query, cursor, limit, descending]) {
		const pagination = descending ? {
			last: limit,
			before: cursor
		} : {
			first: limit,
			after: cursor
		};
		const filter = {
			sender: "Sender" in query ? query.Sender : void 0,
			transactionDigest: "Transaction" in query ? query.Transaction : void 0,
			eventType: "MoveEventType" in query ? query.MoveEventType : void 0,
			emittingModule: "MoveModule" in query ? `${query.MoveModule.package}::${query.MoveModule.module}` : void 0
		};
		if ("MoveEventType" in query) filter.eventType = query.MoveEventType;
		else if ("MoveEventModule" in query) filter.eventType = `${query.MoveEventModule.package}::${query.MoveEventModule.module}`;
		const unsupportedFilters = [
			"Package",
			"MoveEventField",
			"Any",
			"All",
			"And",
			"Or",
			"TimeRange"
		];
		if (query) {
			for (const unsupportedFilter of unsupportedFilters) if (unsupportedFilter in query) throw new UnsupportedParamError("queryEvents", unsupportedFilter);
		}
		const { nodes: events, pageInfo } = await transport.graphqlQuery({
			query: QueryEventsDocument,
			variables: {
				...pagination,
				filter
			}
		}, (data) => data.events);
		if (pagination.last) events.reverse();
		return {
			hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
			nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
			data: events.map((event) => ({
				bcs: event.bcs,
				bcsEncoding: "base64",
				id: {
					eventSeq: "",
					txDigest: ""
				},
				packageId: event.sendingModule?.package.address,
				parsedJson: event.json,
				sender: event.sender?.address,
				timestampMs: new Date(event.timestamp).getTime().toString(),
				transactionModule: `${event.sendingModule?.package.address}::${event.sendingModule?.name}`,
				type: toShortTypeString(event.type?.repr)
			}))
		};
	},
	async devInspectTransactionBlock(transport, [sender, devInspectTxBytes, gasPrice]) {
		const { transaction, error, results } = await transport.graphqlQuery({
			query: DevInspectTransactionBlockDocument,
			variables: {
				txBytes: devInspectTxBytes,
				txMeta: {
					gasPrice: Number.parseInt(gasPrice),
					sender
				},
				showEffects: true,
				showEvents: true
			}
		}, (data) => data.dryRunTransactionBlock);
		if (!transaction) throw new Error("Unexpected error during dry run");
		const result = mapGraphQLTransactionBlockToRpcTransactionBlock(transaction, {
			showEffects: true,
			showEvents: true
		});
		return {
			error,
			effects: result.effects,
			events: result.events,
			results: results?.map((result2) => ({
				mutableReferenceOutputs: result2.mutatedReferences?.map((ref) => [
					ref.input.__typename === "GasCoin" ? "GasCoin" : ref.input.__typename === "Input" ? { Input: ref.input.inputIndex } : typeof ref.input.resultIndex === "number" ? { NestedResult: [ref.input.cmd, ref.input.resultIndex] } : { Result: ref.input.cmd },
					Array.from(fromBase64(ref.bcs)),
					toShortTypeString(ref.type.repr)
				]),
				returnValues: result2.returnValues?.map((value) => [Array.from(fromBase64(value.bcs)), toShortTypeString(value.type.repr)])
			}))
		};
	},
	async getDynamicFields(transport, [parentId, cursor, limit]) {
		const { nodes: fields, pageInfo } = await transport.graphqlQuery({
			query: GetDynamicFieldsDocument,
			variables: {
				parentId,
				first: limit,
				cursor
			}
		}, (data) => data.owner?.dynamicFields);
		return {
			data: fields.map((field) => ({
				bcsName: field.name?.bcs,
				bcsEncoding: "base64",
				digest: field.value?.__typename === "MoveObject" ? field.value.digest : void 0,
				name: {
					type: toShortTypeString(field.name?.type.repr),
					value: field.name?.json
				},
				objectId: field.value?.__typename === "MoveObject" ? field.value.address : void 0,
				objectType: field.value?.__typename === "MoveObject" ? field.value.contents?.type.repr : field.value?.type.repr,
				type: field.value?.__typename === "MoveObject" ? "DynamicObject" : "DynamicField",
				version: field.value?.__typename === "MoveObject" ? field.value.version : void 0
			})),
			nextCursor: pageInfo.endCursor ?? null,
			hasNextPage: pageInfo.hasNextPage
		};
	},
	async getDynamicFieldObjectV2(transport, inputs) {
		return await getDynamicFieldObject(transport, inputs);
	},
	/**
	* @deprecated The V1 of this method is deprecated, use `getDynamicFieldObjectV2` instead.
	*/
	async getDynamicFieldObject(transport, [parentId, name]) {
		return await getDynamicFieldObject(transport, [
			parentId,
			name,
			{
				showBcs: true,
				showContent: true,
				showDisplay: true,
				showOwner: true,
				showPreviousTransaction: true,
				showStorageRebate: true,
				showType: true
			}
		]);
	},
	async executeTransactionBlock(transport, [txBytes, signatures, options]) {
		const { effects, errors } = await transport.graphqlQuery({
			query: ExecuteTransactionBlockDocument,
			variables: {
				txBytes,
				signatures,
				showBalanceChanges: options?.showBalanceChanges,
				showEffects: options?.showEffects,
				showEvents: options?.showEvents,
				showInput: options?.showInput,
				showObjectChanges: options?.showObjectChanges,
				showRawEffects: options?.showRawEffects,
				showRawInput: options?.showRawInput
			}
		}, (data) => data.executeTransactionBlock);
		if (!effects?.transactionBlock) {
			const tx = Transaction.from(fromBase64(txBytes));
			return {
				errors: errors ?? void 0,
				digest: await tx.getDigest()
			};
		}
		await paginateTransactionBlockLists(transport, effects.transactionBlock);
		return mapGraphQLTransactionBlockToRpcTransactionBlock(effects.transactionBlock, options, errors);
	},
	async dryRunTransactionBlock(transport, [txBytes]) {
		const tx = Transaction.from(fromBase64(txBytes));
		const { transaction, error } = await transport.graphqlQuery({
			query: DryRunTransactionBlockDocument,
			variables: {
				txBytes,
				showBalanceChanges: true,
				showEffects: true,
				showEvents: true,
				showInput: true,
				showObjectChanges: true
			}
		}, (data) => data.dryRunTransactionBlock);
		if (error || !transaction) throw new Error(error ?? "Unexpected error during dry run");
		const result = mapGraphQLTransactionBlockToRpcTransactionBlock({
			...transaction,
			digest: await tx.getDigest()
		}, {
			showBalanceChanges: true,
			showEffects: true,
			showEvents: true,
			showInput: true,
			showObjectChanges: true
		});
		return {
			input: result.transaction?.data,
			balanceChanges: result.balanceChanges,
			effects: result.effects,
			events: result.events,
			objectChanges: result.objectChanges
		};
	},
	async getLatestCheckpointSequenceNumber(transport) {
		return (await transport.graphqlQuery({ query: GetLatestCheckpointSequenceNumberDocument }, (data) => data.checkpoint?.sequenceNumber)).toString();
	},
	async getCheckpoint(transport, [id]) {
		const checkpoint = await transport.graphqlQuery({
			query: GetCheckpointDocument,
			variables: { id: typeof id === "number" || isNumericString(id) ? { sequenceNumber: Number.parseInt(id.toString(), 10) } : { digest: id } }
		}, (data) => data.checkpoint);
		await paginateCheckpointLists(transport, checkpoint);
		return mapGraphQLCheckpointToRpcCheckpoint(checkpoint);
	},
	async getCheckpoints(transport, [cursor, limit, descendingOrder]) {
		const pagination = descendingOrder ? {
			last: limit,
			before: cursor
		} : {
			first: limit,
			after: cursor
		};
		const { nodes: checkpoints, pageInfo } = await transport.graphqlQuery({
			query: GetCheckpointsDocument,
			variables: { ...pagination }
		}, (data) => data.checkpoints);
		for (const checkpoint of checkpoints) await paginateCheckpointLists(transport, checkpoint);
		if (pagination.last) checkpoints.reverse();
		return {
			hasNextPage: pagination.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage,
			nextCursor: pagination.last ? pageInfo.startCursor : pageInfo.endCursor,
			data: checkpoints.map((checkpoint) => mapGraphQLCheckpointToRpcCheckpoint(checkpoint))
		};
	},
	async getCommitteeInfo(transport, [epoch]) {
		const { validatorSet, epochId } = await transport.graphqlQuery({
			query: GetCommitteeInfoDocument,
			variables: { epochId: epoch ? Number.parseInt(epoch) : void 0 }
		}, (data) => data.epoch);
		let hasNextPage = validatorSet?.committeeMembers?.pageInfo.hasNextPage;
		let after = validatorSet?.committeeMembers?.pageInfo.endCursor;
		while (hasNextPage) {
			const page = await transport.graphqlQuery({
				query: GetCommitteeInfoDocument,
				variables: {
					epochId: epoch ? Number.parseInt(epoch) : void 0,
					after
				}
			}, (data) => data.epoch?.validatorSet?.committeeMembers);
			validatorSet?.committeeMembers.nodes.push(...page.nodes);
			hasNextPage = page.pageInfo.hasNextPage;
			after = page.pageInfo.endCursor;
		}
		return {
			epoch: epochId.toString(),
			validators: validatorSet?.committeeMembers?.nodes.map((val) => [val.credentials?.authorityPubKey, String(val.votingPower)])
		};
	},
	async getCurrentEpoch(transport) {
		const epoch = await transport.graphqlQuery({ query: GetCurrentEpochDocument }, (data) => data.epoch);
		let hasNextPageActiveValidators = epoch.validatorSet?.activeValidators?.pageInfo.hasNextPage;
		let afterActiveValidators = epoch.validatorSet?.activeValidators?.pageInfo.endCursor;
		while (hasNextPageActiveValidators) {
			const page = await transport.graphqlQuery({
				query: PaginateEpochValidatorsDocument,
				variables: {
					id: epoch.epochId,
					after: afterActiveValidators
				}
			}, (data) => data.epoch?.validatorSet?.activeValidators);
			epoch.validatorSet?.activeValidators?.nodes.push(...page.nodes);
			hasNextPageActiveValidators = page.pageInfo.hasNextPage;
			afterActiveValidators = page.pageInfo.endCursor;
		}
		let hasNextPageCommitteeMembers = epoch.validatorSet?.committeeMembers?.pageInfo.hasNextPage;
		let afterCommitteeMembers = epoch.validatorSet?.committeeMembers?.pageInfo.endCursor;
		while (hasNextPageCommitteeMembers) {
			const page = await transport.graphqlQuery({
				query: PaginateEpochValidatorsDocument,
				variables: {
					id: epoch.epochId,
					after: afterCommitteeMembers
				}
			}, (data) => data.epoch?.validatorSet?.committeeMembers);
			epoch.validatorSet?.committeeMembers?.nodes.push(...page.nodes);
			hasNextPageCommitteeMembers = page.pageInfo.hasNextPage;
			afterCommitteeMembers = page.pageInfo.endCursor;
		}
		const validatorsAddresses = epoch.validatorSet?.activeValidators?.nodes.map((val) => val.address.address) ?? [];
		const committeeValidatorsIndexes = (epoch.validatorSet?.committeeMembers?.nodes.map((val) => val.address.address) ?? []).map((val) => validatorsAddresses.indexOf(val)?.toString());
		return {
			epoch: String(epoch.epochId),
			validators: epoch.validatorSet?.activeValidators?.nodes.map(mapGraphQlValidatorToRpcValidator),
			committeeMembers: committeeValidatorsIndexes,
			epochTotalTransactions: "0",
			firstCheckpointId: epoch.firstCheckpoint?.nodes[0]?.sequenceNumber.toString(),
			endOfEpochInfo: null,
			referenceGasPrice: epoch.referenceGasPrice,
			epochStartTimestamp: new Date(epoch.startTimestamp).getTime().toString()
		};
	},
	async getValidatorsApy(transport) {
		const epoch = await transport.graphqlQuery({ query: GetValidatorsApyDocument }, (data) => data.epoch);
		let hasNextPage = epoch.validatorSet?.activeValidators?.pageInfo.hasNextPage;
		let after = epoch.validatorSet?.activeValidators?.pageInfo.endCursor;
		while (hasNextPage) {
			const page = await transport.graphqlQuery({
				query: PaginateEpochValidatorsDocument,
				variables: {
					id: epoch.epochId,
					after
				}
			}, (data) => data.epoch);
			epoch.validatorSet?.activeValidators?.nodes.push(...page.validatorSet?.activeValidators?.nodes ?? []);
			hasNextPage = page.validatorSet?.activeValidators?.pageInfo.hasNextPage;
			after = page.validatorSet?.activeValidators?.pageInfo.endCursor;
		}
		return {
			epoch: String(epoch.epochId),
			apys: epoch.validatorSet?.activeValidators?.nodes.map((validator) => ({
				address: validator.address.address,
				apy: typeof validator.apy === "number" ? validator.apy / 100 : null
			}))
		};
	},
	async getChainIdentifier(transport) {
		return await transport.graphqlQuery({ query: GetChainIdentifierDocument }, (data) => data.chainIdentifier);
	},
	async getProtocolConfig(transport, [version]) {
		const protocolConfig = await transport.graphqlQuery({
			query: GetProtocolConfigDocument,
			variables: { protocolVersion: version ? Number.parseInt(version) : void 0 }
		}, (data) => data.protocolConfig);
		const featureFlags = {};
		const attributes = {};
		const configTypeMap = {
			max_arguments: "u32",
			max_gas_payment_objects: "u32",
			max_modules_in_publish: "u32",
			max_programmable_tx_commands: "u32",
			max_pure_argument_size: "u32",
			max_type_argument_depth: "u32",
			max_type_arguments: "u32",
			move_binary_format_version: "u32",
			min_move_binary_format_version: "u32",
			random_beacon_reduction_allowed_delta: "u16",
			random_beacon_dkg_timeout_round: "u32",
			random_beacon_reduction_lower_bound: "u32",
			scoring_decision_cutoff_value: "f64",
			scoring_decision_mad_divisor: "f64",
			group_ops_bls12381_msm_max_len: "u32",
			binary_module_handles: "u16",
			binary_struct_handles: "u16",
			binary_function_handles: "u16",
			binary_function_instantiations: "u16",
			binary_signatures: "u16",
			binary_constant_pool: "u16",
			binary_identifiers: "u16",
			binary_address_identifiers: "u16",
			binary_struct_defs: "u16",
			binary_struct_def_instantiations: "u16",
			binary_function_defs: "u16",
			binary_field_handles: "u16",
			binary_field_instantiations: "u16",
			binary_friend_decls: "u16",
			max_package_dependencies: "u32",
			bridge_should_try_to_finalize_committee: "bool",
			consensus_gc_depth: "u32",
			scorer_version: "u16"
		};
		for (const { key, value } of protocolConfig.configs) attributes[key] = value === null ? null : { [configTypeMap[key] ?? "u64"]: value };
		for (const { key, value } of protocolConfig.featureFlags) featureFlags[key] = value;
		return {
			maxSupportedProtocolVersion: protocolConfig.protocolVersion?.toString(),
			minSupportedProtocolVersion: "1",
			protocolVersion: protocolConfig.protocolVersion?.toString(),
			attributes,
			featureFlags
		};
	},
	async isTransactionIndexedOnNode(transport, [digest]) {
		return await transport.graphqlQuery({
			query: IsTransactionIndexedOnNodeDocument,
			variables: { digest }
		}, (data) => data.isTransactionIndexedOnNode);
	},
	async view(transport, [functionName, typeArgs, callArgs]) {
		return await transport.graphqlQuery({
			query: ViewDocument,
			variables: {
				functionName,
				typeArgs,
				arguments: callArgs
			}
		}, (data) => {
			if (data.moveViewCall.error) return { executionError: data.moveViewCall.error };
			else return { functionReturnValues: data.moveViewCall.results };
		});
	}
};
var UnsupportedParamError = class extends Error {
	constructor(method, param) {
		super(`Parameter ${param} is not supported for ${method} in the GraphQL API`);
	}
};
var UnsupportedMethodError = class extends Error {
	constructor(method) {
		super(`Method ${method} is not supported in the GraphQL API`);
	}
};
async function paginateTransactionBlockLists(transport, transactionBlock) {
	let hasMoreEvents = transactionBlock.effects?.events?.pageInfo.hasNextPage ?? false;
	let hasMoreBalanceChanges = transactionBlock.effects?.balanceChanges?.pageInfo.hasNextPage ?? false;
	let hasMoreObjectChanges = transactionBlock.effects?.objectChanges?.pageInfo.hasNextPage ?? false;
	let afterEvents = transactionBlock.effects?.events?.pageInfo.endCursor;
	let afterBalanceChanges = transactionBlock.effects?.balanceChanges?.pageInfo.endCursor;
	let afterObjectChanges = transactionBlock.effects?.objectChanges?.pageInfo.endCursor;
	while (hasMoreEvents || hasMoreBalanceChanges || hasMoreObjectChanges) {
		const page = await transport.graphqlQuery({
			query: PaginateTransactionBlockListsDocument,
			variables: {
				digest: transactionBlock.digest,
				afterEvents,
				afterBalanceChanges,
				afterObjectChanges,
				hasMoreEvents,
				hasMoreBalanceChanges,
				hasMoreObjectChanges
			}
		}, (data) => data.transactionBlock?.effects);
		transactionBlock.effects?.events?.nodes.push(...page.events?.nodes ?? []);
		transactionBlock.effects?.balanceChanges?.nodes.push(...page.balanceChanges?.nodes ?? []);
		transactionBlock.effects?.objectChanges?.nodes.push(...page.objectChanges?.nodes ?? []);
		hasMoreEvents = page.events?.pageInfo.hasNextPage ?? false;
		hasMoreBalanceChanges = page.balanceChanges?.pageInfo.hasNextPage ?? false;
		hasMoreObjectChanges = page.objectChanges?.pageInfo.hasNextPage ?? false;
		afterEvents = page.events?.pageInfo.endCursor;
		afterBalanceChanges = page.balanceChanges?.pageInfo.endCursor;
		afterObjectChanges = page.objectChanges?.pageInfo.endCursor;
	}
}
async function paginateCheckpointLists(transport, checkpoint) {
	let hasNextPage = checkpoint.transactionBlocks.pageInfo.hasNextPage;
	let after = checkpoint.transactionBlocks.pageInfo.endCursor;
	while (hasNextPage) {
		const page = await transport.graphqlQuery({
			query: PaginateCheckpointTransactionBlocksDocument,
			variables: {
				id: { digest: checkpoint.digest },
				after
			}
		}, (data) => data.checkpoint?.transactionBlocks);
		checkpoint.transactionBlocks.nodes.push(...page.nodes);
		hasNextPage = page.pageInfo.hasNextPage;
		after = page.pageInfo.endCursor;
	}
	const endOfEpochTx = checkpoint.endOfEpoch.nodes[0];
	if (endOfEpochTx?.kind?.__typename === "EndOfEpochTransaction" && endOfEpochTx.kind?.transactions.nodes[0].__typename === "ChangeEpochTransactionV2" && endOfEpochTx.kind.transactions.nodes[0].epoch?.epochId) {
		const validatorSet = endOfEpochTx.kind.transactions.nodes[0].epoch.validatorSet;
		let hasNextPage2 = validatorSet?.committeeMembers.pageInfo.hasNextPage;
		let after2 = validatorSet?.committeeMembers.pageInfo.endCursor;
		while (hasNextPage2) {
			const page = await transport.graphqlQuery({
				query: GetCommitteeInfoDocument,
				variables: {
					epochId: endOfEpochTx.kind.transactions.nodes[0].epoch?.epochId,
					after: after2
				}
			}, (data) => data.epoch?.validatorSet?.committeeMembers);
			validatorSet?.committeeMembers.nodes.push(...page.nodes);
			hasNextPage2 = page.pageInfo?.hasNextPage;
			after2 = page.pageInfo?.endCursor;
		}
	}
}
async function getDynamicFieldObject(transport, [parentId, name, options]) {
	const nameLayout = await transport.graphqlQuery({
		query: GetTypeLayoutDocument,
		variables: { type: name.type }
	}, (data) => data.type.layout);
	const bcsName = mapJsonToBcs(name.value, nameLayout);
	const parent = await transport.graphqlQuery({
		query: GetDynamicFieldObjectDocument,
		variables: {
			parentId,
			name: {
				type: name.type,
				bcs: bcsName
			},
			showBcs: options?.showBcs,
			showContent: options?.showContent,
			showDisplay: options?.showDisplay,
			showOwner: options?.showOwner,
			showPreviousTransaction: options?.showPreviousTransaction,
			showStorageRebate: options?.showStorageRebate,
			showType: options?.showType
		}
	}, (data) => {
		return data.owner?.dynamicObjectField?.value?.__typename === "MoveObject" ? data.owner.dynamicObjectField.value.owner?.__typename === "Parent" ? data.owner.dynamicObjectField.value.owner.parent : void 0 : void 0;
	});
	return { data: {
		content: parent.asMoveObject ? {
			dataType: "moveObject",
			...moveDataToRpcContent(parent.asMoveObject?.contents?.data, parent.asMoveObject?.contents?.type.layout)
		} : void 0,
		digest: parent?.digest,
		objectId: parent?.address,
		type: parent?.asMoveObject ? toShortTypeString(parent.asMoveObject.contents?.type.repr) : void 0,
		version: parent?.version.toString(),
		storageRebate: parent.storageRebate,
		previousTransaction: parent.previousTransactionBlock?.digest,
		owner: parent.owner?.__typename === "Parent" ? { ObjectOwner: parent.owner.parent?.address } : void 0
	} };
}
//#endregion
//#region node_modules/.pnpm/@iota+graphql-transport@0.18.0_typescript@5.9.3/node_modules/@iota/graphql-transport/dist/esm/transport.js
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _options;
var _fallbackTransport;
var _fallbackMethods;
var _unsupportedMethods;
var _IotaClientGraphQLTransport_instances;
var tryUseFallback_fn;
var IotaClientGraphQLTransport = class {
	constructor(options) {
		__privateAdd(this, _IotaClientGraphQLTransport_instances);
		__privateAdd(this, _options);
		__privateAdd(this, _fallbackTransport);
		__privateAdd(this, _fallbackMethods);
		__privateAdd(this, _unsupportedMethods);
		__privateSet(this, _options, options);
		__privateSet(this, _fallbackMethods, options.fallbackMethods || [
			"executeTransactionBlock",
			"dryRunTransactionBlock",
			"devInspectTransactionBlock",
			"getTotalTransactions",
			"getNetworkMetrics",
			"getParticipationMetrics",
			"getMoveCallMetrics",
			"getAllEpochAddressMetrics",
			"getEpochs",
			"getDynamicFieldObjectV2"
		]);
		__privateSet(this, _unsupportedMethods, options.unsupportedMethods || ["getOwnedObjects"]);
		if (options.fallbackTransportUrl) __privateSet(this, _fallbackTransport, new IotaHTTPTransport({
			url: options.fallbackTransportUrl,
			inspector: options.inspector
		}));
	}
	async graphqlQuery(options, getData) {
		const res = await this.graphqlRequest(options);
		if (!res.ok) throw new Error("Failed to fetch");
		const { data, errors } = await res.json();
		handleGraphQLErrors(errors);
		const extractedData = data && (getData ? getData(data) : data);
		if (extractedData == null) throw new Error("Missing response data");
		return extractedData;
	}
	async graphqlRequest(options) {
		return fetch(__privateGet(this, _options).url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: typeof options.query === "string" || options.query instanceof TypedDocumentString ? options.query.toString() : print(options.query),
				variables: options.variables,
				extensions: options.extensions,
				operationName: options.operationName
			})
		});
	}
	async request(input) {
		const executeRequest = async () => {
			let clientMethod;
			switch (input.method) {
				case "rpc.discover":
					clientMethod = "getRpcApiVersion";
					break;
				case "iotax_getLatestAddressMetrics":
					clientMethod = "getAddressMetrics";
					break;
				default: clientMethod = input.method.split("_")[1];
			}
			const allowFallback = __privateGet(this, _fallbackMethods).includes(clientMethod);
			const isUnsupported = __privateGet(this, _unsupportedMethods).includes(clientMethod);
			const method = RPC_METHODS[clientMethod];
			if (isUnsupported) return await __privateMethod(this, _IotaClientGraphQLTransport_instances, tryUseFallback_fn).call(this, input);
			if (!method && !allowFallback) throw new UnsupportedMethodError(input.method);
			try {
				if (!method) throw new Error("Missing method");
				return await method(this, input.params);
			} catch (error) {
				if (allowFallback || error instanceof UnsupportedParamError) return __privateMethod(this, _IotaClientGraphQLTransport_instances, tryUseFallback_fn).call(this, input);
				else throw error;
			}
		};
		return __privateGet(this, _options).inspector ? __privateGet(this, _options).inspector(input, executeRequest) : executeRequest();
	}
	async subscribe(input) {
		if (!__privateGet(this, _fallbackTransport)) throw new UnsupportedMethodError(input.method);
		return __privateGet(this, _fallbackTransport).subscribe(input);
	}
};
_options = /* @__PURE__ */ new WeakMap();
_fallbackTransport = /* @__PURE__ */ new WeakMap();
_fallbackMethods = /* @__PURE__ */ new WeakMap();
_unsupportedMethods = /* @__PURE__ */ new WeakMap();
_IotaClientGraphQLTransport_instances = /* @__PURE__ */ new WeakSet();
tryUseFallback_fn = async function(input) {
	if (!__privateGet(this, _fallbackTransport)) throw new UnsupportedMethodError(input.method);
	return __privateGet(this, _fallbackTransport).request(input);
};
function handleGraphQLErrors(errors) {
	if (!errors || errors.length === 0) return;
	const errorInstances = errors.map((error) => new GraphQLResponseError(error));
	if (errorInstances.length === 1) throw errorInstances[0];
	throw new AggregateError(errorInstances);
}
var GraphQLResponseError = class extends Error {
	constructor(error) {
		super(error.message);
		this.locations = error.locations;
	}
};
//#endregion
//#region src/lib/utils/network-config.ts
var _overrideNetworkConfig = null;
/**
* Get the current network configuration override.
* Returns null if no override is set.
*/
function getNetworkConfigOverride() {
	return _overrideNetworkConfig;
}
/**
* Check if a network config override is set.
*/
function hasNetworkConfigOverride() {
	return _overrideNetworkConfig !== null;
}
//#endregion
//#region src/lib/utils/client.ts
var previousInitializedNodeUrl = "";
var regularClient = void 0;
var graphqlClient = void 0;
function getClient(graphql = false) {
	let networkConfig = getSelectedNetworkConfig();
	let selectedNetworkUrl = networkConfig.node;
	if (graphql) {
		if (graphqlClient == void 0 || selectedNetworkUrl != previousInitializedNodeUrl) {
			graphqlClient = new IotaClient({ transport: new IotaClientGraphQLTransport({
				url: networkConfig.graphql,
				fallbackTransportUrl: selectedNetworkUrl
			}) });
			previousInitializedNodeUrl = selectedNetworkUrl;
		}
		return graphqlClient;
	} else {
		if (regularClient == void 0 || selectedNetworkUrl != previousInitializedNodeUrl) {
			regularClient = new IotaClient({ url: selectedNetworkUrl });
			previousInitializedNodeUrl = selectedNetworkUrl;
		}
		return regularClient;
	}
}
function getSelectedNetworkConfig() {
	if (hasNetworkConfigOverride()) return getNetworkConfigOverride();
	let config = get(sharedClientConfig);
	return config.networks.find((network) => network.name == config.selected);
}
function getSelectedChain() {
	return `iota:${getSelectedNetworkConfig().name}`;
}
//#endregion
export { Secp256k1PublicKey as A, sharedStakingCurrency as C, keypairFromBech32PrivateKey as D, defaultPrivateKeyAccounts as E, toStore as M, toWalletAccounts as O, sharedSignerType as S, sharedStakingSkipPaginationSenders as T, sharedExternalAddresses as _, IotaClient as a, sharedPrivateKeyAccounts as b, IOTA_CLOCK_OBJECT_ID as c, SignerType as d, clientConfigErrorMsg as f, sharedClientConfig as g, privateKeysErrorMsg as h, print as i, defaultClientConfig as j, Secp256r1PublicKey as k, IOTA_SYSTEM_STATE_OBJECT_ID as l, isProMode as m, getSelectedChain as n, Transaction as o, disclaimerAccepted as p, getSelectedNetworkConfig as r, TransactionDataBuilder as s, getClient as t, NANOS_PER_IOTA as u, sharedMultiAccountCompactAmounts as v, sharedStakingSkipPaginationEnabled as w, sharedSelectedAddress as x, sharedMultiAccountCurrency as y };

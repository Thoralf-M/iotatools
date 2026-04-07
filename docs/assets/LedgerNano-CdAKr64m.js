import { at as getDefaultExportFromCjs, aI as bufferExports, aR as getAugmentedNamespace, aG as toHex, B as getClient, aa as isValidIotaAddress, aE as Transaction, aP as messageWithIntent, aS as toSerializedSignature, aO as Ed25519PublicKey, p as push, c as state, Q as proxy, d as from_html, e as sibling, h as child, g as get, j as each, W as first_child, i as if_block, b as user_derived, t as template_effect, k as set_text, o as delegated, l as append, m as index, H as bind_value, y as bind_select_value, s as set, q as pop, A as to_array, r as delegate } from "./index-BqtqWY7L.js";
import { J as JsonToggleView } from "./JsonToggleView-Bj0v7KtF.js";
import { p as process } from "./browser-vXMD_k_z.js";
var sha256$2 = { exports: {} };
var sha256$1 = sha256$2.exports;
var hasRequiredSha256;
function requireSha256() {
  if (hasRequiredSha256) return sha256$2.exports;
  hasRequiredSha256 = 1;
  (function(module2) {
    (function(root2, factory) {
      var exports$1 = {};
      factory(exports$1);
      var sha2562 = exports$1["default"];
      for (var k in exports$1) {
        sha2562[k] = exports$1[k];
      }
      {
        module2.exports = sha2562;
      }
    })(sha256$1, function(exports$1) {
      exports$1.__esModule = true;
      exports$1.digestLength = 32;
      exports$1.blockSize = 64;
      var K = new Uint32Array([
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
      function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while (len >= 64) {
          a = v[0];
          b = v[1];
          c = v[2];
          d = v[3];
          e = v[4];
          f = v[5];
          g = v[6];
          h = v[7];
          for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
          }
          for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
            u = w[i - 15];
            t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
          }
          for (i = 0; i < 64; i++) {
            t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
            t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          v[0] += a;
          v[1] += b;
          v[2] += c;
          v[3] += d;
          v[4] += e;
          v[5] += f;
          v[6] += g;
          v[7] += h;
          pos += 64;
          len -= 64;
        }
        return pos;
      }
      var Hash = (
        /** @class */
        (function() {
          function Hash2() {
            this.digestLength = exports$1.digestLength;
            this.blockSize = exports$1.blockSize;
            this.state = new Int32Array(8);
            this.temp = new Int32Array(64);
            this.buffer = new Uint8Array(128);
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            this.reset();
          }
          Hash2.prototype.reset = function() {
            this.state[0] = 1779033703;
            this.state[1] = 3144134277;
            this.state[2] = 1013904242;
            this.state[3] = 2773480762;
            this.state[4] = 1359893119;
            this.state[5] = 2600822924;
            this.state[6] = 528734635;
            this.state[7] = 1541459225;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
          };
          Hash2.prototype.clean = function() {
            for (var i = 0; i < this.buffer.length; i++) {
              this.buffer[i] = 0;
            }
            for (var i = 0; i < this.temp.length; i++) {
              this.temp[i] = 0;
            }
            this.reset();
          };
          Hash2.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this.finished) {
              throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
              while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
              }
            }
            if (dataLength >= 64) {
              dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
              dataLength %= 64;
            }
            while (dataLength > 0) {
              this.buffer[this.bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          Hash2.prototype.finish = function(out) {
            if (!this.finished) {
              var bytesHashed = this.bytesHashed;
              var left = this.bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 64 < 56 ? 64 : 128;
              this.buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
              }
              this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
              this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
              this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
              this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
              this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
              this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
              this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
              this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
              hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
              this.finished = true;
            }
            for (var i = 0; i < 8; i++) {
              out[i * 4 + 0] = this.state[i] >>> 24 & 255;
              out[i * 4 + 1] = this.state[i] >>> 16 & 255;
              out[i * 4 + 2] = this.state[i] >>> 8 & 255;
              out[i * 4 + 3] = this.state[i] >>> 0 & 255;
            }
            return this;
          };
          Hash2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          Hash2.prototype._saveState = function(out) {
            for (var i = 0; i < this.state.length; i++) {
              out[i] = this.state[i];
            }
          };
          Hash2.prototype._restoreState = function(from, bytesHashed) {
            for (var i = 0; i < this.state.length; i++) {
              this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
          };
          return Hash2;
        })()
      );
      exports$1.Hash = Hash;
      var HMAC = (
        /** @class */
        (function() {
          function HMAC2(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
              new Hash().update(key).finish(pad).clean();
            } else {
              for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
              }
            }
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54;
            }
            this.inner.update(pad);
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54 ^ 92;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for (var i = 0; i < pad.length; i++) {
              pad[i] = 0;
            }
          }
          HMAC2.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
          };
          HMAC2.prototype.clean = function() {
            for (var i = 0; i < this.istate.length; i++) {
              this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
          };
          HMAC2.prototype.update = function(data) {
            this.inner.update(data);
            return this;
          };
          HMAC2.prototype.finish = function(out) {
            if (this.outer.finished) {
              this.outer.finish(out);
            } else {
              this.inner.finish(out);
              this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
          };
          HMAC2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          return HMAC2;
        })()
      );
      exports$1.HMAC = HMAC;
      function hash(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports$1.hash = hash;
      exports$1["default"] = hash;
      function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports$1.hmac = hmac;
      function fillBuffer(buffer, hmac2, info, counter) {
        var num = counter[0];
        if (num === 0) {
          throw new Error("hkdf: cannot expand more");
        }
        hmac2.reset();
        if (num > 1) {
          hmac2.update(buffer);
        }
        if (info) {
          hmac2.update(info);
        }
        hmac2.update(counter);
        hmac2.finish(buffer);
        counter[0]++;
      }
      var hkdfSalt = new Uint8Array(exports$1.digestLength);
      function hkdf(key, salt, info, length) {
        if (salt === void 0) {
          salt = hkdfSalt;
        }
        if (length === void 0) {
          length = 32;
        }
        var counter = new Uint8Array([1]);
        var okm = hmac(salt, key);
        var hmac_ = new HMAC(okm);
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          if (bufpos === buffer.length) {
            fillBuffer(buffer, hmac_, info, counter);
            bufpos = 0;
          }
          out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
      }
      exports$1.hkdf = hkdf;
      function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for (var i = 0; i * len < dkLen; i++) {
          var c = i + 1;
          ctr[0] = c >>> 24 & 255;
          ctr[1] = c >>> 16 & 255;
          ctr[2] = c >>> 8 & 255;
          ctr[3] = c >>> 0 & 255;
          prf.reset();
          prf.update(salt);
          prf.update(ctr);
          prf.finish(u);
          for (var j = 0; j < len; j++) {
            t[j] = u[j];
          }
          for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
              t[k] ^= u[k];
            }
          }
          for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
          }
        }
        for (var i = 0; i < len; i++) {
          t[i] = u[i] = 0;
        }
        for (var i = 0; i < 4; i++) {
          ctr[i] = 0;
        }
        prf.clean();
        return dk;
      }
      exports$1.pbkdf2 = pbkdf2;
    });
  })(sha256$2);
  return sha256$2.exports;
}
var sha256Exports = requireSha256();
const sha256 = /* @__PURE__ */ getDefaultExportFromCjs(sha256Exports);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _verbose, _Iota_instances, internalGetVersion_fn, sendChunks_fn, handleBlocksProtocol_fn, log_fn;
var LedgerToHost = /* @__PURE__ */ ((LedgerToHost2) => {
  LedgerToHost2[LedgerToHost2["RESULT_ACCUMULATING"] = 0] = "RESULT_ACCUMULATING";
  LedgerToHost2[LedgerToHost2["RESULT_FINAL"] = 1] = "RESULT_FINAL";
  LedgerToHost2[LedgerToHost2["GET_CHUNK"] = 2] = "GET_CHUNK";
  LedgerToHost2[LedgerToHost2["PUT_CHUNK"] = 3] = "PUT_CHUNK";
  return LedgerToHost2;
})(LedgerToHost || {});
class Iota {
  constructor(transport, scrambleKey = "default_iota_scramble_key", verbose = false) {
    __privateAdd(this, _Iota_instances);
    __privateAdd(this, _verbose);
    __privateSet(this, _verbose, verbose);
    this.transport = transport;
    this.transport.decorateAppAPIMethods(
      this,
      ["getPublicKey", "signTransaction", "getVersion"],
      scrambleKey
    );
  }
  /**
   * Retrieves the public key associated with a particular BIP32 path from the Ledger app.
   *
   * @param path - the path to retrieve.
   * @param displayOnDevice - whether or not the address should be displayed on the device.
   *
   */
  async getPublicKey(path, displayOnDevice = false) {
    const cla = 0;
    const ins = displayOnDevice ? 1 : 2;
    const p1 = 0;
    const p2 = 0;
    const payload = buildBip32KeyPayload(path);
    const response = await __privateMethod(this, _Iota_instances, sendChunks_fn).call(this, cla, ins, p1, p2, payload);
    const keySize = response[0];
    const publicKey = response.slice(1, keySize + 1);
    let address = null;
    if (response.length > keySize + 2) {
      const addressSize = response[keySize + 1];
      address = response.slice(keySize + 2, keySize + 2 + addressSize);
    }
    const res = {
      publicKey,
      address
    };
    return res;
  }
  /**
   * Sign a transaction with the key at a BIP32 path.
   *
   * @param txn - The transaction bytes to sign.
   * @param path - The path to use when signing the transaction.
   * @param options - Additional options used for clear signing purposes.
   */
  async signTransaction(path, txn, options) {
    const cla = 0;
    const ins = 3;
    const p1 = 0;
    const p2 = 0;
    if (__privateGet(this, _verbose)) __privateMethod(this, _Iota_instances, log_fn).call(this, txn);
    const rawTxn = bufferExports.Buffer.from(txn);
    const hashSize = bufferExports.Buffer.alloc(4);
    hashSize.writeUInt32LE(rawTxn.length, 0);
    const payloadTxn = bufferExports.Buffer.concat([hashSize, rawTxn]);
    __privateMethod(this, _Iota_instances, log_fn).call(this, "Payload Txn", payloadTxn);
    const bip32KeyPayload = buildBip32KeyPayload(path);
    const payloads = [payloadTxn, bip32KeyPayload];
    const { major } = await __privateMethod(this, _Iota_instances, internalGetVersion_fn).call(this);
    const bcsObjects = options?.bcsObjects ?? [];
    __privateMethod(this, _Iota_instances, log_fn).call(this, "Objects list length", bcsObjects.length);
    __privateMethod(this, _Iota_instances, log_fn).call(this, "App version", major);
    if (major > 0 && bcsObjects.length > 0) {
      const numItems = bufferExports.Buffer.alloc(4);
      numItems.writeUInt32LE(bcsObjects.length, 0);
      let listData = bufferExports.Buffer.from(numItems);
      for (const item of bcsObjects) {
        const rawItem = bufferExports.Buffer.from(item);
        const itemLen = bufferExports.Buffer.alloc(4);
        itemLen.writeUInt32LE(rawItem.length, 0);
        listData = bufferExports.Buffer.concat([listData, itemLen, rawItem]);
      }
      payloads.push(listData);
    }
    const signature = await __privateMethod(this, _Iota_instances, sendChunks_fn).call(this, cla, ins, p1, p2, payloads);
    return { signature };
  }
  /**
   * Retrieve the app version on the attached Ledger device.
   */
  async getVersion() {
    return await __privateMethod(this, _Iota_instances, internalGetVersion_fn).call(this);
  }
}
_verbose = /* @__PURE__ */ new WeakMap();
_Iota_instances = /* @__PURE__ */ new WeakSet();
internalGetVersion_fn = async function() {
  const [major, minor, patch] = await __privateMethod(this, _Iota_instances, sendChunks_fn).call(this, 0, 0, 0, 0, bufferExports.Buffer.alloc(1));
  return {
    major,
    minor,
    patch
  };
};
sendChunks_fn = async function(cla, ins, p1, p2, payload, extraData = /* @__PURE__ */ new Map()) {
  const chunkSize = 180;
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  const parameterList = [];
  let data = new Map(extraData);
  for (let j = 0; j < payload.length; j++) {
    const chunkList = [];
    for (let i = 0; i < payload[j].length; i += chunkSize) {
      const cur = payload[j].slice(i, i + chunkSize);
      chunkList.push(cur);
    }
    let lastHash = bufferExports.Buffer.alloc(32);
    __privateMethod(this, _Iota_instances, log_fn).call(this, lastHash);
    data = chunkList.reduceRight((blocks, chunk) => {
      const linkedChunk = bufferExports.Buffer.concat([lastHash, chunk]);
      __privateMethod(this, _Iota_instances, log_fn).call(this, "Chunk: ", chunk);
      __privateMethod(this, _Iota_instances, log_fn).call(this, "linkedChunk: ", linkedChunk);
      lastHash = bufferExports.Buffer.from(sha256(linkedChunk));
      blocks.set(lastHash.toString("hex"), linkedChunk);
      return blocks;
    }, data);
    parameterList.push(lastHash);
    lastHash = bufferExports.Buffer.alloc(32);
  }
  __privateMethod(this, _Iota_instances, log_fn).call(this, data);
  return await __privateMethod(this, _Iota_instances, handleBlocksProtocol_fn).call(this, cla, ins, p1, p2, bufferExports.Buffer.concat(
    [bufferExports.Buffer.from([
      0
      /* START */
    ])].concat(
      parameterList
    )
  ), data);
};
handleBlocksProtocol_fn = async function(cla, ins, p1, p2, initialPayload, data) {
  let payload = initialPayload;
  let result = bufferExports.Buffer.alloc(0);
  let rv_instruction;
  do {
    __privateMethod(this, _Iota_instances, log_fn).call(this, "Sending payload to ledger: ", payload.toString("hex"));
    const rv = await this.transport.send(cla, ins, p1, p2, payload);
    __privateMethod(this, _Iota_instances, log_fn).call(this, "Received response: ", rv);
    rv_instruction = rv[0];
    const rv_payload = rv.slice(1, rv.length - 2);
    if (!(rv_instruction in LedgerToHost)) {
      throw new TypeError("Unknown instruction returned from ledger");
    }
    switch (rv_instruction) {
      case 0:
      case 1:
        result = bufferExports.Buffer.concat([result, rv_payload]);
        payload = bufferExports.Buffer.from([
          4
          /* RESULT_ACCUMULATING_RESPONSE */
        ]);
        break;
      case 2:
        const chunk = data.get(rv_payload.toString("hex"));
        __privateMethod(this, _Iota_instances, log_fn).call(this, "Getting block ", rv_payload);
        __privateMethod(this, _Iota_instances, log_fn).call(this, "Found block ", chunk);
        if (chunk) {
          payload = bufferExports.Buffer.concat([
            bufferExports.Buffer.from([
              1
              /* GET_CHUNK_RESPONSE_SUCCESS */
            ]),
            chunk
          ]);
        } else {
          payload = bufferExports.Buffer.from([
            2
            /* GET_CHUNK_RESPONSE_FAILURE */
          ]);
        }
        break;
      case 3:
        data.set(
          bufferExports.Buffer.from(sha256(rv_payload)).toString("hex"),
          rv_payload
        );
        payload = bufferExports.Buffer.from([
          3
          /* PUT_CHUNK_RESPONSE */
        ]);
        break;
    }
  } while (rv_instruction !== 1);
  return result;
};
log_fn = function(...args) {
  if (__privateGet(this, _verbose)) console.log(args);
};
function buildBip32KeyPayload(path) {
  const paths = splitPath(path);
  const payload = bufferExports.Buffer.alloc(1 + paths.length * 4);
  payload[0] = paths.length;
  paths.forEach((element, index2) => {
    payload.writeUInt32LE(element, 1 + 4 * index2);
  });
  return payload;
}
function splitPath(path) {
  const result = [];
  const components = path.split("/");
  components.forEach((element) => {
    let number = parseInt(element, 10);
    if (isNaN(number)) {
      return;
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 2147483648;
    }
    result.push(number);
  });
  return result;
}
var events = { exports: {} };
var hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter2() {
    EventEmitter2.init.call(this);
  }
  events.exports = EventEmitter2;
  events.exports.once = once;
  EventEmitter2.EventEmitter = EventEmitter2;
  EventEmitter2.prototype._events = void 0;
  EventEmitter2.prototype._eventsCount = 0;
  EventEmitter2.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter2.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter2.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter2.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var doError = type === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit(
          "newListener",
          type,
          listener.listener ? listener.listener : listener
        );
        events2 = target._events;
      }
      existing = events2[type];
    }
    if (existing === void 0) {
      existing = events2[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter2.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
  EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type, listener) {
    var state2 = { fired: false, wrapFn: void 0, target, type, listener };
    var wrapped = onceWrapper.bind(state2);
    wrapped.listener = listener;
    state2.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter2.prototype.once = function once2(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type];
        if (events2.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type, originalListener || listener);
    }
    return this;
  };
  EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
  EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener") continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type];
    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter2.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  EventEmitter2.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  EventEmitter2.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  EventEmitter2.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter2.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index2) {
    for (; index2 + 1 < list.length; index2++)
      list[index2] = list[index2 + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  return events.exports;
}
var eventsExports = requireEvents();
const EventEmitter = /* @__PURE__ */ getDefaultExportFromCjs(eventsExports);
const deserializers = {};
const addCustomErrorDeserializer = (name, deserializer) => {
  deserializers[name] = deserializer;
};
const createCustomErrorClass = (name) => {
  class CustomErrorClass extends Error {
    cause;
    constructor(message, fields, options) {
      super(message || name, options);
      Object.setPrototypeOf(this, CustomErrorClass.prototype);
      this.name = name;
      if (fields) {
        for (const k in fields) {
          this[k] = fields[k];
        }
      }
      if (options && isObject(options) && "cause" in options && !this.cause) {
        const cause = options.cause;
        this.cause = cause;
        if ("stack" in cause) {
          this.stack = this.stack + "\nCAUSE: " + cause.stack;
        }
      }
    }
  }
  return CustomErrorClass;
};
function isObject(value) {
  return typeof value === "object";
}
const DisconnectedDevice = createCustomErrorClass("DisconnectedDevice");
const DisconnectedDeviceDuringOperation = createCustomErrorClass("DisconnectedDeviceDuringOperation");
const TransportOpenUserCancelled = createCustomErrorClass("TransportOpenUserCancelled");
const TransportRaceCondition = createCustomErrorClass("TransportRaceCondition");
var HwTransportErrorType;
(function(HwTransportErrorType2) {
  HwTransportErrorType2["Unknown"] = "Unknown";
  HwTransportErrorType2["LocationServicesDisabled"] = "LocationServicesDisabled";
  HwTransportErrorType2["LocationServicesUnauthorized"] = "LocationServicesUnauthorized";
  HwTransportErrorType2["BluetoothScanStartFailed"] = "BluetoothScanStartFailed";
})(HwTransportErrorType || (HwTransportErrorType = {}));
class TransportError extends Error {
  id;
  constructor(message, id2) {
    const name = "TransportError";
    super(message || name);
    this.name = name;
    this.message = message;
    this.stack = new Error(message).stack;
    this.id = id2;
  }
}
addCustomErrorDeserializer("TransportError", (e) => new TransportError(e.message, e.id));
const StatusCodes = {
  ACCESS_CONDITION_NOT_FULFILLED: 38916,
  ALGORITHM_NOT_SUPPORTED: 38020,
  CLA_NOT_SUPPORTED: 28160,
  CODE_BLOCKED: 38976,
  CODE_NOT_INITIALIZED: 38914,
  COMMAND_INCOMPATIBLE_FILE_STRUCTURE: 27009,
  CONDITIONS_OF_USE_NOT_SATISFIED: 27013,
  CONTRADICTION_INVALIDATION: 38928,
  CONTRADICTION_SECRET_CODE_STATUS: 38920,
  DEVICE_IN_RECOVERY_MODE: 26159,
  CUSTOM_IMAGE_EMPTY: 26158,
  FILE_ALREADY_EXISTS: 27273,
  FILE_NOT_FOUND: 37892,
  GP_AUTH_FAILED: 25344,
  HALTED: 28586,
  INCONSISTENT_FILE: 37896,
  INCORRECT_DATA: 27264,
  INCORRECT_LENGTH: 26368,
  INCORRECT_P1_P2: 27392,
  INS_NOT_SUPPORTED: 27904,
  DEVICE_NOT_ONBOARDED: 27911,
  DEVICE_NOT_ONBOARDED_2: 26129,
  INVALID_KCV: 38021,
  INVALID_OFFSET: 37890,
  LICENSING: 28482,
  LOCKED_DEVICE: 21781,
  MAX_VALUE_REACHED: 38992,
  MEMORY_PROBLEM: 37440,
  MISSING_CRITICAL_PARAMETER: 26624,
  NO_EF_SELECTED: 37888,
  NOT_ENOUGH_MEMORY_SPACE: 27268,
  OK: 36864,
  PIN_REMAINING_ATTEMPTS: 25536,
  REFERENCED_DATA_NOT_FOUND: 27272,
  SECURITY_STATUS_NOT_SATISFIED: 27010,
  TECHNICAL_PROBLEM: 28416,
  UNKNOWN_APDU: 27906,
  USER_REFUSED_ON_DEVICE: 21761,
  NOT_ENOUGH_SPACE: 20738,
  APP_NOT_FOUND_OR_INVALID_CONTEXT: 20771,
  INVALID_APP_NAME_LENGTH: 26378,
  GEN_AES_KEY_FAILED: 21529,
  INTERNAL_CRYPTO_OPERATION_FAILED: 21530,
  INTERNAL_COMPUTE_AES_CMAC_FAILED: 21531,
  ENCRYPT_APP_STORAGE_FAILED: 21532,
  INVALID_BACKUP_STATE: 26178,
  PIN_NOT_SET: 21762,
  INVALID_BACKUP_LENGTH: 26419,
  INVALID_RESTORE_STATE: 26179,
  INVALID_CHUNK_LENGTH: 26420,
  INVALID_BACKUP_HEADER: 26698,
  // Not documented:
  TRUSTCHAIN_WRONG_SEED: 45063
};
function getAltStatusMessage(code) {
  switch (code) {
    // improve text of most common errors
    case 26368:
      return "Incorrect length";
    case 26624:
      return "Missing critical parameter";
    case 27010:
      return "Security not satisfied (dongle locked or have invalid access rights)";
    case 27013:
      return "Condition of use not satisfied (denied by the user?)";
    case 27264:
      return "Invalid data received";
    case 27392:
      return "Invalid parameter received";
    case 21781:
      return "Locked device";
  }
  if (28416 <= code && code <= 28671) {
    return "Internal error, please report";
  }
}
class TransportStatusError extends Error {
  statusCode;
  statusText;
  /**
   * @param statusCode The error status code coming from a Transport implementation
   * @param options containing:
   *  - canBeMappedToChildError: enable the mapping of TransportStatusError to an error extending/inheriting from it
   *  . Ex: LockedDeviceError. Default to true.
   */
  constructor(statusCode, { canBeMappedToChildError = true } = {}) {
    const statusText = Object.keys(StatusCodes).find((k) => StatusCodes[k] === statusCode) || "UNKNOWN_ERROR";
    const smsg = getAltStatusMessage(statusCode) || statusText;
    const statusCodeStr = statusCode.toString(16);
    const message = `Ledger device: ${smsg} (0x${statusCodeStr})`;
    super(message);
    this.name = "TransportStatusError";
    this.statusCode = statusCode;
    this.statusText = statusText;
    Object.setPrototypeOf(this, TransportStatusError.prototype);
    if (canBeMappedToChildError && statusCode === StatusCodes.LOCKED_DEVICE) {
      return new LockedDeviceError(message);
    }
  }
}
class LockedDeviceError extends TransportStatusError {
  constructor(message) {
    super(StatusCodes.LOCKED_DEVICE, { canBeMappedToChildError: false });
    if (message) {
      this.message = message;
    }
    this.name = "LockedDeviceError";
    Object.setPrototypeOf(this, LockedDeviceError.prototype);
  }
}
addCustomErrorDeserializer("TransportStatusError", (e) => new TransportStatusError(e.statusCode));
let id = 0;
const subscribers = [];
const log = (type, message, data) => {
  const obj = {
    type,
    id: String(++id),
    date: /* @__PURE__ */ new Date()
  };
  if (message)
    obj.message = message;
  dispatch(obj);
};
const trace = ({ type, message, data, context }) => {
  const obj = {
    type,
    id: String(++id),
    date: /* @__PURE__ */ new Date()
  };
  if (message)
    obj.message = message;
  if (data)
    obj.data = data;
  if (context)
    obj.context = context;
  dispatch(obj);
};
class LocalTracer {
  type;
  context;
  constructor(type, context) {
    this.type = type;
    this.context = context;
  }
  trace(message, data) {
    trace({
      type: this.type,
      message,
      data,
      context: this.context
    });
  }
  getContext() {
    return this.context;
  }
  setContext(context) {
    this.context = context;
  }
  updateContext(contextToAdd) {
    this.context = { ...this.context, ...contextToAdd };
  }
  getType() {
    return this.type;
  }
  setType(type) {
    this.type = type;
  }
  /**
   * Create a new instance of the LocalTracer with an updated `type`
   *
   * It does not mutate the calling instance, but returns a new LocalTracer,
   * following a simple builder pattern.
   */
  withType(type) {
    return new LocalTracer(type, this.context);
  }
  /**
   * Create a new instance of the LocalTracer with a new `context`
   *
   * It does not mutate the calling instance, but returns a new LocalTracer,
   * following a simple builder pattern.
   *
   * @param context A TraceContext, that can undefined to reset the context
   */
  withContext(context) {
    return new LocalTracer(this.type, context);
  }
  /**
   * Create a new instance of the LocalTracer with an updated `context`,
   * on which an additional context is merged with the existing one.
   *
   * It does not mutate the calling instance, but returns a new LocalTracer,
   * following a simple builder pattern.
   */
  withUpdatedContext(contextToAdd) {
    return new LocalTracer(this.type, { ...this.context, ...contextToAdd });
  }
}
const listen = (cb) => {
  subscribers.push(cb);
  return () => {
    const i = subscribers.indexOf(cb);
    if (i !== -1) {
      subscribers[i] = subscribers[subscribers.length - 1];
      subscribers.pop();
    }
  };
};
function dispatch(log2) {
  for (let i = 0; i < subscribers.length; i++) {
    try {
      subscribers[i](log2);
    } catch (e) {
      console.error(e);
    }
  }
}
if (typeof window !== "undefined") {
  window.__ledgerLogsListen = listen;
}
const DEFAULT_LOG_TYPE = "transport";
class Transport {
  exchangeTimeout = 3e4;
  unresponsiveTimeout = 15e3;
  deviceModel = null;
  tracer;
  constructor({ context, logType } = {}) {
    this.tracer = new LocalTracer(logType ?? DEFAULT_LOG_TYPE, context);
  }
  /**
   * Check if the transport is supported on the current platform/browser.
   * @returns {Promise<boolean>} A promise that resolves with a boolean indicating support.
   */
  static isSupported;
  /**
   * List all available descriptors for the transport.
   * For a better granularity, checkout `listen()`.
   *
   * @returns {Promise<Array<any>>} A promise that resolves with an array of descriptors.
   * @example
   * TransportFoo.list().then(descriptors => ...)
   */
  static list;
  /**
   * Listen for device events for the transport. The method takes an observer of DescriptorEvent and returns a Subscription.
   * A DescriptorEvent is an object containing a "descriptor" and a "type" field. The "type" field can be "add" or "remove", and the "descriptor" field can be passed to the "open" method.
   * The "listen" method will first emit all currently connected devices and then will emit events as they occur, such as when a USB device is plugged in or a Bluetooth device becomes discoverable.
   * @param {Observer<DescriptorEvent<any>>} observer - An object with "next", "error", and "complete" functions, following the observer pattern.
   * @returns {Subscription} A Subscription object on which you can call ".unsubscribe()" to stop listening to descriptors.
   * @example
  const sub = TransportFoo.listen({
  next: e => {
    if (e.type==="add") {
      sub.unsubscribe();
      const transport = await TransportFoo.open(e.descriptor);
      ...
    }
  },
  error: error => {},
  complete: () => {}
  })
   */
  static listen;
  /**
   * Attempt to create a Transport instance with a specific descriptor.
   * @param {any} descriptor - The descriptor to open the transport with.
   * @param {number} timeout - An optional timeout for the transport connection.
   * @param {TraceContext} context Optional tracing/log context
   * @returns {Promise<Transport>} A promise that resolves with a Transport instance.
   * @example
  TransportFoo.open(descriptor).then(transport => ...)
   */
  static open;
  /**
   * Send data to the device using a low level API.
   * It's recommended to use the "send" method for a higher level API.
   * @param {Buffer} apdu - The data to send.
   * @param {Object} options - Contains optional options for the exchange function
   *  - abortTimeoutMs: stop the exchange after a given timeout. Another timeout exists
   *    to detect unresponsive device (see `unresponsiveTimeout`). This timeout aborts the exchange.
   * @returns {Promise<Buffer>} A promise that resolves with the response data from the device.
   */
  exchange(_apdu, { abortTimeoutMs: _abortTimeoutMs } = {}) {
    throw new Error("exchange not implemented");
  }
  /**
   * Send apdus in batch to the device using a low level API.
   * The default implementation is to call exchange for each apdu.
   * @param {Array<Buffer>} apdus - array of apdus to send.
   * @param {Observer<Buffer>} observer - an observer that will receive the response of each apdu.
   * @returns {Subscription} A Subscription object on which you can call ".unsubscribe()" to stop sending apdus.
   */
  exchangeBulk(apdus, observer) {
    let unsubscribed = false;
    const unsubscribe = () => {
      unsubscribed = true;
    };
    const main = async () => {
      if (unsubscribed)
        return;
      for (const apdu of apdus) {
        const r = await this.exchange(apdu);
        if (unsubscribed)
          return;
        const status = r.readUInt16BE(r.length - 2);
        if (status !== StatusCodes.OK) {
          throw new TransportStatusError(status);
        }
        observer.next(r);
      }
    };
    main().then(() => !unsubscribed && observer.complete(), (e) => !unsubscribed && observer.error(e));
    return { unsubscribe };
  }
  /**
   * Set the "scramble key" for the next data exchanges with the device.
   * Each app can have a different scramble key and it is set internally during instantiation.
   * @param {string} key - The scramble key to set.
   * deprecated This method is no longer needed for modern transports and should be migrated away from.
   * no @ before deprecated as it breaks documentationjs on version 14.0.2
   * https://github.com/documentationjs/documentation/issues/1596
   */
  setScrambleKey(_key) {
  }
  /**
   * Close the connection with the device.
   *
   * Note: for certain transports (hw-transport-node-hid-singleton for ex), once the promise resolved,
   * the transport instance is actually still cached, and the device is disconnected only after a defined timeout.
   * But for the consumer of the Transport, this does not matter and it can consider the transport to be closed.
   *
   * @returns {Promise<void>} A promise that resolves when the transport is closed.
   */
  close() {
    return Promise.resolve();
  }
  _events = new EventEmitter();
  /**
   * Listen for an event on the transport instance.
   * Transport implementations may have specific events. Common events include:
   * "disconnect" : triggered when the transport is disconnected.
   * @param {string} eventName - The name of the event to listen for.
   * @param {(...args: Array<any>) => any} cb - The callback function to be invoked when the event occurs.
   */
  on(eventName, cb) {
    this._events.on(eventName, cb);
  }
  /**
   * Stop listening to an event on an instance of transport.
   */
  off(eventName, cb) {
    this._events.removeListener(eventName, cb);
  }
  emit(event, ...args) {
    this._events.emit(event, ...args);
  }
  /**
   * Enable or not logs of the binary exchange
   */
  setDebugMode() {
    console.warn("setDebugMode is deprecated. use @ledgerhq/logs instead. No logs are emitted in this anymore.");
  }
  /**
   * Set a timeout (in milliseconds) for the exchange call. Only some transport might implement it. (e.g. U2F)
   */
  setExchangeTimeout(exchangeTimeout) {
    this.exchangeTimeout = exchangeTimeout;
  }
  /**
   * Define the delay before emitting "unresponsive" on an exchange that does not respond
   */
  setExchangeUnresponsiveTimeout(unresponsiveTimeout) {
    this.unresponsiveTimeout = unresponsiveTimeout;
  }
  /**
   * Send data to the device using the higher level API.
   *
   * @param {number} cla - The instruction class for the command.
   * @param {number} ins - The instruction code for the command.
   * @param {number} p1 - The first parameter for the instruction.
   * @param {number} p2 - The second parameter for the instruction.
   * @param {Buffer} data - The data to be sent. Defaults to an empty buffer.
   * @param {Array<number>} statusList - A list of acceptable status codes for the response. Defaults to [StatusCodes.OK].
   * @param {Object} options - Contains optional options for the exchange function
   *  - abortTimeoutMs: stop the send after a given timeout. Another timeout exists
   *    to detect unresponsive device (see `unresponsiveTimeout`). This timeout aborts the exchange.
   * @returns {Promise<Buffer>} A promise that resolves with the response data from the device.
   */
  send = async (cla, ins, p1, p2, data = bufferExports.Buffer.alloc(0), statusList = [StatusCodes.OK], { abortTimeoutMs } = {}) => {
    const tracer = this.tracer.withUpdatedContext({ function: "send" });
    if (data.length >= 256) {
      tracer.trace("data.length exceeded 256 bytes limit", { dataLength: data.length });
      throw new TransportError("data.length exceed 256 bytes limit. Got: " + data.length, "DataLengthTooBig");
    }
    const response = await this.exchange(
      // The size of the data is added in 1 byte just before `data`
      bufferExports.Buffer.concat([bufferExports.Buffer.from([cla, ins, p1, p2]), bufferExports.Buffer.from([data.length]), data]),
      { abortTimeoutMs }
    );
    const sw = response.readUInt16BE(response.length - 2);
    if (!statusList.some((s) => s === sw)) {
      throw new TransportStatusError(sw);
    }
    return response;
  };
  /**
   * create() allows to open the first descriptor available or
   * throw if there is none or if timeout is reached.
   * This is a light helper, alternative to using listen() and open() (that you may need for any more advanced usecase)
   * @example
  TransportFoo.create().then(transport => ...)
   */
  static create(openTimeout = 3e3, listenTimeout) {
    return new Promise((resolve, reject) => {
      let found = false;
      const sub = this.listen({
        next: (e) => {
          found = true;
          if (sub)
            sub.unsubscribe();
          if (listenTimeoutId)
            clearTimeout(listenTimeoutId);
          this.open(e.descriptor, openTimeout).then(resolve, reject);
        },
        error: (e) => {
          if (listenTimeoutId)
            clearTimeout(listenTimeoutId);
          reject(e);
        },
        complete: () => {
          if (listenTimeoutId)
            clearTimeout(listenTimeoutId);
          if (!found) {
            reject(new TransportError(this.ErrorMessage_NoDeviceFound, "NoDeviceFound"));
          }
        }
      });
      const listenTimeoutId = listenTimeout ? setTimeout(() => {
        sub.unsubscribe();
        reject(new TransportError(this.ErrorMessage_ListenTimeout, "ListenTimeout"));
      }, listenTimeout) : null;
    });
  }
  // Blocks other exchange to happen concurrently
  exchangeBusyPromise;
  /**
   * Wrapper to make an exchange "atomic" (blocking any other exchange)
   *
   * It also handles "unresponsiveness" by emitting "unresponsive" and "responsive" events.
   *
   * @param f The exchange job, using the transport to run
   * @returns a Promise resolving with the output of the given job
   */
  async exchangeAtomicImpl(f) {
    const tracer = this.tracer.withUpdatedContext({
      function: "exchangeAtomicImpl",
      unresponsiveTimeout: this.unresponsiveTimeout
    });
    if (this.exchangeBusyPromise) {
      tracer.trace("Atomic exchange is already busy");
      throw new TransportRaceCondition("An action was already pending on the Ledger device. Please deny or reconnect.");
    }
    let resolveBusy;
    const busyPromise = new Promise((r) => {
      resolveBusy = r;
    });
    this.exchangeBusyPromise = busyPromise;
    let unresponsiveReached = false;
    const timeout = setTimeout(() => {
      tracer.trace(`Timeout reached, emitting Transport event "unresponsive"`, {
        unresponsiveTimeout: this.unresponsiveTimeout
      });
      unresponsiveReached = true;
      this.emit("unresponsive");
    }, this.unresponsiveTimeout);
    try {
      const res = await f();
      if (unresponsiveReached) {
        tracer.trace("Device was unresponsive, emitting responsive");
        this.emit("responsive");
      }
      return res;
    } finally {
      tracer.trace("Finalize, clearing busy guard");
      clearTimeout(timeout);
      if (resolveBusy)
        resolveBusy();
      this.exchangeBusyPromise = null;
    }
  }
  decorateAppAPIMethods(self, methods, scrambleKey) {
    for (const methodName of methods) {
      self[methodName] = this.decorateAppAPIMethod(methodName, self[methodName], self, scrambleKey);
    }
  }
  _appAPIlock = null;
  decorateAppAPIMethod(methodName, f, ctx, scrambleKey) {
    return async (...args) => {
      const { _appAPIlock } = this;
      if (_appAPIlock) {
        return Promise.reject(new TransportError("Ledger Device is busy (lock " + _appAPIlock + ")", "TransportLocked"));
      }
      try {
        this._appAPIlock = methodName;
        this.setScrambleKey(scrambleKey);
        return await f.apply(ctx, args);
      } finally {
        this._appAPIlock = null;
      }
    };
  }
  /**
   * Sets the context used by the logging/tracing mechanism
   *
   * Useful when re-using (cached) the same Transport instance,
   * but with a new tracing context.
   *
   * @param context A TraceContext, that can undefined to reset the context
   */
  setTraceContext(context) {
    this.tracer = this.tracer.withContext(context);
  }
  /**
   * Updates the context used by the logging/tracing mechanism
   *
   * The update only overrides the key-value that are already defined in the current context.
   *
   * @param contextToAdd A TraceContext that will be added to the current context
   */
  updateTraceContext(contextToAdd) {
    this.tracer.updateContext(contextToAdd);
  }
  /**
   * Gets the tracing context of the transport instance
   */
  getTraceContext() {
    return this.tracer.getContext();
  }
  static ErrorMessage_ListenTimeout = "No Ledger device found (timeout)";
  static ErrorMessage_NoDeviceFound = "No Ledger device found";
}
const Tag = 5;
function asUInt16BE(value) {
  const b = bufferExports.Buffer.alloc(2);
  b.writeUInt16BE(value, 0);
  return b;
}
const initialAcc = {
  data: bufferExports.Buffer.alloc(0),
  dataLength: 0,
  sequence: 0
};
const createHIDframing = (channel, packetSize) => {
  return {
    /**
     * Frames/encodes an APDU message into HID USB packets/frames
     *
     * @param apdu The APDU message to send, in a Buffer containing [cla, ins, p1, p2, data length, data(if not empty)]
     * @returns an array of HID USB frames ready to be sent
     */
    makeBlocks(apdu) {
      let data = bufferExports.Buffer.concat([asUInt16BE(apdu.length), apdu]);
      const blockSize = packetSize - 5;
      const nbBlocks = Math.ceil(data.length / blockSize);
      data = bufferExports.Buffer.concat([data, bufferExports.Buffer.alloc(nbBlocks * blockSize - data.length + 1).fill(0)]);
      const blocks = [];
      for (let i = 0; i < nbBlocks; i++) {
        const head = bufferExports.Buffer.alloc(5);
        head.writeUInt16BE(channel, 0);
        head.writeUInt8(Tag, 2);
        head.writeUInt16BE(i, 3);
        const chunk = data.slice(i * blockSize, (i + 1) * blockSize);
        blocks.push(bufferExports.Buffer.concat([head, chunk]));
      }
      return blocks;
    },
    /**
     * Reduces HID USB packets/frames to one response.
     *
     * @param acc The value resulting from (accumulating) the previous call of reduceResponse.
     *   On first call initialized to `initialAcc`. The accumulator enables handling multi-frames messages.
     * @param chunk Current chunk to reduce into accumulator
     * @returns An accumulator value updated with the current chunk
     */
    reduceResponse(acc, chunk) {
      let { data, dataLength, sequence } = acc || initialAcc;
      if (chunk.readUInt16BE(0) !== channel) {
        throw new TransportError("Invalid channel", "InvalidChannel");
      }
      if (chunk.readUInt8(2) !== Tag) {
        throw new TransportError("Invalid tag", "InvalidTag");
      }
      if (chunk.readUInt16BE(3) !== sequence) {
        throw new TransportError("Invalid sequence", "InvalidSequence");
      }
      if (!acc) {
        dataLength = chunk.readUInt16BE(5);
      }
      sequence++;
      const chunkData = chunk.slice(acc ? 5 : 7);
      data = bufferExports.Buffer.concat([data, chunkData]);
      if (data.length > dataLength) {
        data = data.slice(0, dataLength);
      }
      return {
        data,
        dataLength,
        sequence
      };
    },
    /**
     * Returns the response message that has been reduced from the HID USB frames
     *
     * @param acc The accumulator
     * @returns A Buffer containing the cleaned response message, or null if no response message, or undefined if the
     *   accumulator is incorrect (message length is not valid)
     */
    getReducedResult(acc) {
      if (acc && acc.dataLength === acc.data.length) {
        return acc.data;
      }
    }
  };
};
var re = { exports: {} };
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const SEMVER_SPEC_VERSION = "2.0.0";
  const MAX_LENGTH = 256;
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991;
  const MAX_SAFE_COMPONENT_LENGTH = 16;
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  constants = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
  return constants;
}
const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};

const debug$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const require$$3 = /* @__PURE__ */ getAugmentedNamespace(debug$1);
var hasRequiredRe;
function requireRe() {
  if (hasRequiredRe) return re.exports;
  hasRequiredRe = 1;
  (function(module2, exports$1) {
    const {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = requireConstants();
    const debug2 = require$$3;
    exports$1 = module2.exports = {};
    const re2 = exports$1.re = [];
    const safeRe = exports$1.safeRe = [];
    const src = exports$1.src = [];
    const safeSrc = exports$1.safeSrc = [];
    const t = exports$1.t = {};
    let R = 0;
    const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    const safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    const makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    const createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index2 = R++;
      JSON.stringify(name, index2, value);
      t[name] = index2;
      src[index2] = value;
      safeSrc[index2] = safe;
      re2[index2] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index2] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports$1.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports$1.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports$1.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(re, re.exports);
  return re.exports;
}
var parseOptions_1;
var hasRequiredParseOptions;
function requireParseOptions() {
  if (hasRequiredParseOptions) return parseOptions_1;
  hasRequiredParseOptions = 1;
  const looseOption = Object.freeze({ loose: true });
  const emptyOpts = Object.freeze({});
  const parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  parseOptions_1 = parseOptions;
  return parseOptions_1;
}
var identifiers;
var hasRequiredIdentifiers;
function requireIdentifiers() {
  if (hasRequiredIdentifiers) return identifiers;
  hasRequiredIdentifiers = 1;
  const numeric = /^[0-9]+$/;
  const compareIdentifiers = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };
  const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
  identifiers = {
    compareIdentifiers,
    rcompareIdentifiers
  };
  return identifiers;
}
var semver$2;
var hasRequiredSemver$1;
function requireSemver$1() {
  if (hasRequiredSemver$1) return semver$2;
  hasRequiredSemver$1 = 1;
  const debug2 = require$$3;
  const { MAX_LENGTH, MAX_SAFE_INTEGER } = requireConstants();
  const { safeRe: re2, t } = requireRe();
  const parseOptions = requireParseOptions();
  const { compareIdentifiers } = requireIdentifiers();
  class SemVer {
    constructor(version, options) {
      options = parseOptions(options);
      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError(
          `version is longer than ${MAX_LENGTH} characters`
        );
      }
      JSON.stringify("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m = version.trim().match(options.loose ? re2[t.LOOSE] : re2[t.FULL]);
      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map((id2) => {
          if (/^[0-9]+$/.test(id2)) {
            const num = +id2;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id2;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      JSON.stringify("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.major < other.major) {
        return -1;
      }
      if (this.major > other.major) {
        return 1;
      }
      if (this.minor < other.minor) {
        return -1;
      }
      if (this.minor > other.minor) {
        return 1;
      }
      if (this.patch < other.patch) {
        return -1;
      }
      if (this.patch > other.patch) {
        return 1;
      }
      return 0;
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        JSON.stringify("prerelease compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        JSON.stringify("build compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (identifier) {
          const match = `-${identifier}`.match(this.options.loose ? re2[t.PRERELEASELOOSE] : re2[t.PRERELEASE]);
          if (!match || match[1] !== identifier) {
            throw new Error(`invalid identifier: ${identifier}`);
          }
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  semver$2 = SemVer;
  return semver$2;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  const SemVer = requireSemver$1();
  const parse = (version, options, throwErrors = false) => {
    if (version instanceof SemVer) {
      return version;
    }
    try {
      return new SemVer(version, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  parse_1 = parse;
  return parse_1;
}
var valid_1;
var hasRequiredValid$1;
function requireValid$1() {
  if (hasRequiredValid$1) return valid_1;
  hasRequiredValid$1 = 1;
  const parse = requireParse();
  const valid2 = (version, options) => {
    const v = parse(version, options);
    return v ? v.version : null;
  };
  valid_1 = valid2;
  return valid_1;
}
var clean_1;
var hasRequiredClean;
function requireClean() {
  if (hasRequiredClean) return clean_1;
  hasRequiredClean = 1;
  const parse = requireParse();
  const clean = (version, options) => {
    const s = parse(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  };
  clean_1 = clean;
  return clean_1;
}
var inc_1;
var hasRequiredInc;
function requireInc() {
  if (hasRequiredInc) return inc_1;
  hasRequiredInc = 1;
  const SemVer = requireSemver$1();
  const inc = (version, release, options, identifier, identifierBase) => {
    if (typeof options === "string") {
      identifierBase = identifier;
      identifier = options;
      options = void 0;
    }
    try {
      return new SemVer(
        version instanceof SemVer ? version.version : version,
        options
      ).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  inc_1 = inc;
  return inc_1;
}
var diff_1;
var hasRequiredDiff;
function requireDiff() {
  if (hasRequiredDiff) return diff_1;
  hasRequiredDiff = 1;
  const parse = requireParse();
  const diff = (version1, version2) => {
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
      return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor) {
        return "major";
      }
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch) {
          return "minor";
        }
        return "patch";
      }
    }
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
      return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
      return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
      return prefix + "patch";
    }
    return "prerelease";
  };
  diff_1 = diff;
  return diff_1;
}
var major_1;
var hasRequiredMajor;
function requireMajor() {
  if (hasRequiredMajor) return major_1;
  hasRequiredMajor = 1;
  const SemVer = requireSemver$1();
  const major = (a, loose) => new SemVer(a, loose).major;
  major_1 = major;
  return major_1;
}
var minor_1;
var hasRequiredMinor;
function requireMinor() {
  if (hasRequiredMinor) return minor_1;
  hasRequiredMinor = 1;
  const SemVer = requireSemver$1();
  const minor = (a, loose) => new SemVer(a, loose).minor;
  minor_1 = minor;
  return minor_1;
}
var patch_1;
var hasRequiredPatch;
function requirePatch() {
  if (hasRequiredPatch) return patch_1;
  hasRequiredPatch = 1;
  const SemVer = requireSemver$1();
  const patch = (a, loose) => new SemVer(a, loose).patch;
  patch_1 = patch;
  return patch_1;
}
var prerelease_1;
var hasRequiredPrerelease;
function requirePrerelease() {
  if (hasRequiredPrerelease) return prerelease_1;
  hasRequiredPrerelease = 1;
  const parse = requireParse();
  const prerelease = (version, options) => {
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  prerelease_1 = prerelease;
  return prerelease_1;
}
var compare_1;
var hasRequiredCompare;
function requireCompare() {
  if (hasRequiredCompare) return compare_1;
  hasRequiredCompare = 1;
  const SemVer = requireSemver$1();
  const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
  compare_1 = compare;
  return compare_1;
}
var rcompare_1;
var hasRequiredRcompare;
function requireRcompare() {
  if (hasRequiredRcompare) return rcompare_1;
  hasRequiredRcompare = 1;
  const compare = requireCompare();
  const rcompare = (a, b, loose) => compare(b, a, loose);
  rcompare_1 = rcompare;
  return rcompare_1;
}
var compareLoose_1;
var hasRequiredCompareLoose;
function requireCompareLoose() {
  if (hasRequiredCompareLoose) return compareLoose_1;
  hasRequiredCompareLoose = 1;
  const compare = requireCompare();
  const compareLoose = (a, b) => compare(a, b, true);
  compareLoose_1 = compareLoose;
  return compareLoose_1;
}
var compareBuild_1;
var hasRequiredCompareBuild;
function requireCompareBuild() {
  if (hasRequiredCompareBuild) return compareBuild_1;
  hasRequiredCompareBuild = 1;
  const SemVer = requireSemver$1();
  const compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  compareBuild_1 = compareBuild;
  return compareBuild_1;
}
var sort_1;
var hasRequiredSort;
function requireSort() {
  if (hasRequiredSort) return sort_1;
  hasRequiredSort = 1;
  const compareBuild = requireCompareBuild();
  const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  sort_1 = sort;
  return sort_1;
}
var rsort_1;
var hasRequiredRsort;
function requireRsort() {
  if (hasRequiredRsort) return rsort_1;
  hasRequiredRsort = 1;
  const compareBuild = requireCompareBuild();
  const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  rsort_1 = rsort;
  return rsort_1;
}
var gt_1;
var hasRequiredGt;
function requireGt() {
  if (hasRequiredGt) return gt_1;
  hasRequiredGt = 1;
  const compare = requireCompare();
  const gt = (a, b, loose) => compare(a, b, loose) > 0;
  gt_1 = gt;
  return gt_1;
}
var lt_1;
var hasRequiredLt;
function requireLt() {
  if (hasRequiredLt) return lt_1;
  hasRequiredLt = 1;
  const compare = requireCompare();
  const lt = (a, b, loose) => compare(a, b, loose) < 0;
  lt_1 = lt;
  return lt_1;
}
var eq_1;
var hasRequiredEq;
function requireEq() {
  if (hasRequiredEq) return eq_1;
  hasRequiredEq = 1;
  const compare = requireCompare();
  const eq = (a, b, loose) => compare(a, b, loose) === 0;
  eq_1 = eq;
  return eq_1;
}
var neq_1;
var hasRequiredNeq;
function requireNeq() {
  if (hasRequiredNeq) return neq_1;
  hasRequiredNeq = 1;
  const compare = requireCompare();
  const neq = (a, b, loose) => compare(a, b, loose) !== 0;
  neq_1 = neq;
  return neq_1;
}
var gte_1;
var hasRequiredGte;
function requireGte() {
  if (hasRequiredGte) return gte_1;
  hasRequiredGte = 1;
  const compare = requireCompare();
  const gte = (a, b, loose) => compare(a, b, loose) >= 0;
  gte_1 = gte;
  return gte_1;
}
var lte_1;
var hasRequiredLte;
function requireLte() {
  if (hasRequiredLte) return lte_1;
  hasRequiredLte = 1;
  const compare = requireCompare();
  const lte = (a, b, loose) => compare(a, b, loose) <= 0;
  lte_1 = lte;
  return lte_1;
}
var cmp_1;
var hasRequiredCmp;
function requireCmp() {
  if (hasRequiredCmp) return cmp_1;
  hasRequiredCmp = 1;
  const eq = requireEq();
  const neq = requireNeq();
  const gt = requireGt();
  const gte = requireGte();
  const lt = requireLt();
  const lte = requireLte();
  const cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a === b;
      case "!==":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError(`Invalid operator: ${op}`);
    }
  };
  cmp_1 = cmp;
  return cmp_1;
}
var coerce_1;
var hasRequiredCoerce;
function requireCoerce() {
  if (hasRequiredCoerce) return coerce_1;
  hasRequiredCoerce = 1;
  const SemVer = requireSemver$1();
  const parse = requireParse();
  const { safeRe: re2, t } = requireRe();
  const coerce = (version, options) => {
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version === "number") {
      version = String(version);
    }
    if (typeof version !== "string") {
      return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
      match = version.match(options.includePrerelease ? re2[t.COERCEFULL] : re2[t.COERCE]);
    } else {
      const coerceRtlRegex = options.includePrerelease ? re2[t.COERCERTLFULL] : re2[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
      return null;
    }
    const major = match[2];
    const minor = match[3] || "0";
    const patch = match[4] || "0";
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  coerce_1 = coerce;
  return coerce_1;
}
var lrucache;
var hasRequiredLrucache;
function requireLrucache() {
  if (hasRequiredLrucache) return lrucache;
  hasRequiredLrucache = 1;
  class LRUCache {
    constructor() {
      this.max = 1e3;
      this.map = /* @__PURE__ */ new Map();
    }
    get(key) {
      const value = this.map.get(key);
      if (value === void 0) {
        return void 0;
      } else {
        this.map.delete(key);
        this.map.set(key, value);
        return value;
      }
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      const deleted = this.delete(key);
      if (!deleted && value !== void 0) {
        if (this.map.size >= this.max) {
          const firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  lrucache = LRUCache;
  return lrucache;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range {
    constructor(range2, options) {
      options = parseOptions(options);
      if (range2 instanceof Range) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t.HYPHENRANGELOOSE] : re2[t.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      JSON.stringify("hyphen replace", range2);
      range2 = range2.replace(re2[t.COMPARATORTRIM], comparatorTrimReplace);
      JSON.stringify("comparator trim", range2);
      range2 = range2.replace(re2[t.TILDETRIM], tildeTrimReplace);
      JSON.stringify("tilde trim", range2);
      range2 = range2.replace(re2[t.CARETTRIM], caretTrimReplace);
      JSON.stringify("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          JSON.stringify("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t.COMPARATORLOOSE]);
        });
      }
      JSON.stringify("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range;
  const LRU = requireLrucache();
  const cache = new LRU();
  const parseOptions = requireParseOptions();
  const Comparator = requireComparator();
  const debug2 = require$$3;
  const SemVer = requireSemver$1();
  const {
    safeRe: re2,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = requireRe();
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = requireConstants();
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    comp = comp.replace(re2[t.BUILD], "");
    JSON.stringify("comp", comp, options);
    comp = replaceCarets(comp, options);
    JSON.stringify("caret", comp);
    comp = replaceTildes(comp, options);
    JSON.stringify("tildes", comp);
    comp = replaceXRanges(comp, options);
    JSON.stringify("xrange", comp);
    comp = replaceStars(comp, options);
    JSON.stringify("stars", comp);
    return comp;
  };
  const isX = (id2) => !id2 || id2.toLowerCase() === "x" || id2 === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t.TILDELOOSE] : re2[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      JSON.stringify("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        JSON.stringify("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      JSON.stringify("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    JSON.stringify("caret", comp, options);
    const r = options.loose ? re2[t.CARETLOOSE] : re2[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      JSON.stringify("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        JSON.stringify("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        JSON.stringify("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      JSON.stringify("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    JSON.stringify("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t.XRANGELOOSE] : re2[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      JSON.stringify("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      JSON.stringify("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    JSON.stringify("replaceStars", comp, options);
    return comp.trim().replace(re2[t.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    JSON.stringify("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set2, version, options) => {
    for (let i = 0; i < set2.length; i++) {
      if (!set2[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set2.length; i++) {
        JSON.stringify(set2[i].semver);
        if (set2[i].semver === Comparator.ANY) {
          continue;
        }
        if (set2[i].semver.prerelease.length > 0) {
          const allowed = set2[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY = /* @__PURE__ */ Symbol("SemVer ANY");
  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      options = parseOptions(options);
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      JSON.stringify("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      JSON.stringify("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t.COMPARATORLOOSE] : re2[t.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      JSON.stringify("Comparator.test", version, this.options.loose);
      if (this.semver === ANY || version === ANY) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator;
  const parseOptions = requireParseOptions();
  const { safeRe: re2, t } = requireRe();
  const cmp = requireCmp();
  const debug2 = require$$3;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  return comparator;
}
var satisfies_1;
var hasRequiredSatisfies;
function requireSatisfies() {
  if (hasRequiredSatisfies) return satisfies_1;
  hasRequiredSatisfies = 1;
  const Range = requireRange();
  const satisfies = (version, range2, options) => {
    try {
      range2 = new Range(range2, options);
    } catch (er) {
      return false;
    }
    return range2.test(version);
  };
  satisfies_1 = satisfies;
  return satisfies_1;
}
var toComparators_1;
var hasRequiredToComparators;
function requireToComparators() {
  if (hasRequiredToComparators) return toComparators_1;
  hasRequiredToComparators = 1;
  const Range = requireRange();
  const toComparators = (range2, options) => new Range(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
  toComparators_1 = toComparators;
  return toComparators_1;
}
var maxSatisfying_1;
var hasRequiredMaxSatisfying;
function requireMaxSatisfying() {
  if (hasRequiredMaxSatisfying) return maxSatisfying_1;
  hasRequiredMaxSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const maxSatisfying = (versions, range2, options) => {
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max;
  };
  maxSatisfying_1 = maxSatisfying;
  return maxSatisfying_1;
}
var minSatisfying_1;
var hasRequiredMinSatisfying;
function requireMinSatisfying() {
  if (hasRequiredMinSatisfying) return minSatisfying_1;
  hasRequiredMinSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const minSatisfying = (versions, range2, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  };
  minSatisfying_1 = minSatisfying;
  return minSatisfying_1;
}
var minVersion_1;
var hasRequiredMinVersion;
function requireMinVersion() {
  if (hasRequiredMinVersion) return minVersion_1;
  hasRequiredMinVersion = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const gt = requireGt();
  const minVersion = (range2, loose) => {
    range2 = new Range(range2, loose);
    let minver = new SemVer("0.0.0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = null;
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let setMin = null;
      comparators.forEach((comparator2) => {
        const compver = new SemVer(comparator2.semver.version);
        switch (comparator2.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          /* fallthrough */
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${comparator2.operator}`);
        }
      });
      if (setMin && (!minver || gt(minver, setMin))) {
        minver = setMin;
      }
    }
    if (minver && range2.test(minver)) {
      return minver;
    }
    return null;
  };
  minVersion_1 = minVersion;
  return minVersion_1;
}
var valid;
var hasRequiredValid;
function requireValid() {
  if (hasRequiredValid) return valid;
  hasRequiredValid = 1;
  const Range = requireRange();
  const validRange = (range2, options) => {
    try {
      return new Range(range2, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  valid = validRange;
  return valid;
}
var outside_1;
var hasRequiredOutside;
function requireOutside() {
  if (hasRequiredOutside) return outside_1;
  hasRequiredOutside = 1;
  const SemVer = requireSemver$1();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const gt = requireGt();
  const lt = requireLt();
  const lte = requireLte();
  const gte = requireGte();
  const outside = (version, range2, hilo, options) => {
    version = new SemVer(version, options);
    range2 = new Range(range2, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version, range2, options)) {
      return false;
    }
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator2) => {
        if (comparator2.semver === ANY) {
          comparator2 = new Comparator(">=0.0.0");
        }
        high = high || comparator2;
        low = low || comparator2;
        if (gtfn(comparator2.semver, high.semver, options)) {
          high = comparator2;
        } else if (ltfn(comparator2.semver, low.semver, options)) {
          low = comparator2;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  };
  outside_1 = outside;
  return outside_1;
}
var gtr_1;
var hasRequiredGtr;
function requireGtr() {
  if (hasRequiredGtr) return gtr_1;
  hasRequiredGtr = 1;
  const outside = requireOutside();
  const gtr = (version, range2, options) => outside(version, range2, ">", options);
  gtr_1 = gtr;
  return gtr_1;
}
var ltr_1;
var hasRequiredLtr;
function requireLtr() {
  if (hasRequiredLtr) return ltr_1;
  hasRequiredLtr = 1;
  const outside = requireOutside();
  const ltr = (version, range2, options) => outside(version, range2, "<", options);
  ltr_1 = ltr;
  return ltr_1;
}
var intersects_1;
var hasRequiredIntersects;
function requireIntersects() {
  if (hasRequiredIntersects) return intersects_1;
  hasRequiredIntersects = 1;
  const Range = requireRange();
  const intersects = (r1, r2, options) => {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
  };
  intersects_1 = intersects;
  return intersects_1;
}
var simplify;
var hasRequiredSimplify;
function requireSimplify() {
  if (hasRequiredSimplify) return simplify;
  hasRequiredSimplify = 1;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  simplify = (versions, range2, options) => {
    const set2 = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b) => compare(a, b, options));
    for (const version of v) {
      const included = satisfies(version, range2, options);
      if (included) {
        prev = version;
        if (!first) {
          first = version;
        }
      } else {
        if (prev) {
          set2.push([first, prev]);
        }
        prev = null;
        first = null;
      }
    }
    if (first) {
      set2.push([first, null]);
    }
    const ranges = [];
    for (const [min, max] of set2) {
      if (min === max) {
        ranges.push(min);
      } else if (!max && min === v[0]) {
        ranges.push("*");
      } else if (!max) {
        ranges.push(`>=${min}`);
      } else if (min === v[0]) {
        ranges.push(`<=${max}`);
      } else {
        ranges.push(`${min} - ${max}`);
      }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range2.raw === "string" ? range2.raw : String(range2);
    return simplified.length < original.length ? simplified : range2;
  };
  return simplify;
}
var subset_1;
var hasRequiredSubset;
function requireSubset() {
  if (hasRequiredSubset) return subset_1;
  hasRequiredSubset = 1;
  const Range = requireRange();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  const subset = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options);
        sawNonNull = sawNonNull || isSub !== null;
        if (isSub) {
          continue OUTER;
        }
      }
      if (sawNonNull) {
        return false;
      }
    }
    return true;
  };
  const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
  const minimumVersion = [new Comparator(">=0.0.0")];
  const simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true;
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true;
      } else {
        dom = minimumVersion;
      }
    }
    const eqSet = /* @__PURE__ */ new Set();
    let gt, lt;
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=") {
        gt = higherGT(gt, c, options);
      } else if (c.operator === "<" || c.operator === "<=") {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }
    if (eqSet.size > 1) {
      return null;
    }
    let gtltComp;
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null;
      } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
        return null;
      }
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) {
        return null;
      }
      if (lt && !satisfies(eq, String(lt), options)) {
        return null;
      }
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) {
          return false;
        }
      }
      return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false;
          }
        } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
          return false;
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false;
          }
        } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
          return false;
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false;
      }
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false;
    }
    if (needDomGTPre || needDomLTPre) {
      return false;
    }
    return true;
  };
  const higherGT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
  };
  const lowerLT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
  };
  subset_1 = subset;
  return subset_1;
}
var semver$1;
var hasRequiredSemver;
function requireSemver() {
  if (hasRequiredSemver) return semver$1;
  hasRequiredSemver = 1;
  const internalRe = requireRe();
  const constants2 = requireConstants();
  const SemVer = requireSemver$1();
  const identifiers2 = requireIdentifiers();
  const parse = requireParse();
  const valid2 = requireValid$1();
  const clean = requireClean();
  const inc = requireInc();
  const diff = requireDiff();
  const major = requireMajor();
  const minor = requireMinor();
  const patch = requirePatch();
  const prerelease = requirePrerelease();
  const compare = requireCompare();
  const rcompare = requireRcompare();
  const compareLoose = requireCompareLoose();
  const compareBuild = requireCompareBuild();
  const sort = requireSort();
  const rsort = requireRsort();
  const gt = requireGt();
  const lt = requireLt();
  const eq = requireEq();
  const neq = requireNeq();
  const gte = requireGte();
  const lte = requireLte();
  const cmp = requireCmp();
  const coerce = requireCoerce();
  const Comparator = requireComparator();
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const toComparators = requireToComparators();
  const maxSatisfying = requireMaxSatisfying();
  const minSatisfying = requireMinSatisfying();
  const minVersion = requireMinVersion();
  const validRange = requireValid();
  const outside = requireOutside();
  const gtr = requireGtr();
  const ltr = requireLtr();
  const intersects = requireIntersects();
  const simplifyRange = requireSimplify();
  const subset = requireSubset();
  semver$1 = {
    parse,
    valid: valid2,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants2.RELEASE_TYPES,
    compareIdentifiers: identifiers2.compareIdentifiers,
    rcompareIdentifiers: identifiers2.rcompareIdentifiers
  };
  return semver$1;
}
var semverExports = requireSemver();
const semver = /* @__PURE__ */ getDefaultExportFromCjs(semverExports);
var DeviceModelId;
(function(DeviceModelId2) {
  DeviceModelId2["blue"] = "blue";
  DeviceModelId2["nanoS"] = "nanoS";
  DeviceModelId2["nanoSP"] = "nanoSP";
  DeviceModelId2["nanoX"] = "nanoX";
  DeviceModelId2["stax"] = "stax";
  DeviceModelId2["europa"] = "europa";
  DeviceModelId2["apex"] = "apex";
})(DeviceModelId || (DeviceModelId = {}));
const devices = {
  [DeviceModelId.blue]: {
    id: DeviceModelId.blue,
    productName: "Ledger Blue",
    productIdMM: 0,
    legacyUsbProductId: 0,
    usbOnly: true,
    memorySize: 480 * 1024,
    masks: [822083584, 822149120],
    getBlockSize: (_firwareVersion) => 4 * 1024
  },
  [DeviceModelId.nanoS]: {
    id: DeviceModelId.nanoS,
    productName: "Ledger Nano S",
    productIdMM: 16,
    legacyUsbProductId: 1,
    usbOnly: true,
    memorySize: 320 * 1024,
    masks: [823132160],
    getBlockSize: (firmwareVersion) => semver.lt(semver.coerce(firmwareVersion) ?? "", "2.0.0") ? 4 * 1024 : 2 * 1024
  },
  [DeviceModelId.nanoX]: {
    id: DeviceModelId.nanoX,
    productName: "Ledger Nano X",
    productIdMM: 64,
    legacyUsbProductId: 4,
    usbOnly: false,
    memorySize: 2 * 1024 * 1024,
    masks: [855638016],
    getBlockSize: (_firwareVersion) => 4 * 1024,
    bluetoothSpec: [
      {
        serviceUuid: "13d63400-2c97-0004-0000-4c6564676572",
        notifyUuid: "13d63400-2c97-0004-0001-4c6564676572",
        writeUuid: "13d63400-2c97-0004-0002-4c6564676572",
        writeCmdUuid: "13d63400-2c97-0004-0003-4c6564676572"
      }
    ]
  },
  [DeviceModelId.nanoSP]: {
    id: DeviceModelId.nanoSP,
    productName: "Ledger Nano S Plus",
    productIdMM: 80,
    legacyUsbProductId: 5,
    usbOnly: true,
    memorySize: 1533 * 1024,
    masks: [856686592],
    getBlockSize: (_firmwareVersion) => 32
  },
  [DeviceModelId.apex]: {
    id: DeviceModelId.apex,
    productName: "Ledger Nano Gen5",
    productIdMM: 128,
    legacyUsbProductId: 8,
    usbOnly: false,
    memorySize: 1533 * 1024,
    masks: [859832320],
    getBlockSize: (_firmwareVersion) => 32,
    bluetoothSpec: [
      {
        serviceUuid: "13d63400-2c97-8004-0000-4c6564676572",
        notifyUuid: "13d63400-2c97-8004-0001-4c6564676572",
        writeUuid: "13d63400-2c97-8004-0002-4c6564676572",
        writeCmdUuid: "13d63400-2c97-8004-0003-4c6564676572"
      }
    ]
  },
  [DeviceModelId.stax]: {
    id: DeviceModelId.stax,
    productName: "Ledger Stax",
    productIdMM: 96,
    legacyUsbProductId: 6,
    usbOnly: false,
    memorySize: 1533 * 1024,
    masks: [857735168],
    getBlockSize: (_firmwareVersion) => 32,
    bluetoothSpec: [
      {
        serviceUuid: "13d63400-2c97-6004-0000-4c6564676572",
        notifyUuid: "13d63400-2c97-6004-0001-4c6564676572",
        writeUuid: "13d63400-2c97-6004-0002-4c6564676572",
        writeCmdUuid: "13d63400-2c97-6004-0003-4c6564676572"
      }
    ]
  },
  [DeviceModelId.europa]: {
    id: DeviceModelId.europa,
    productName: "Ledger Flex",
    productIdMM: 112,
    legacyUsbProductId: 7,
    usbOnly: false,
    memorySize: 1533 * 1024,
    masks: [858783744],
    getBlockSize: (_firmwareVersion) => 32,
    bluetoothSpec: [
      {
        serviceUuid: "13d63400-2c97-3004-0000-4c6564676572",
        notifyUuid: "13d63400-2c97-3004-0001-4c6564676572",
        writeUuid: "13d63400-2c97-3004-0002-4c6564676572",
        writeCmdUuid: "13d63400-2c97-3004-0003-4c6564676572"
      }
    ]
  }
};
({
  Blue: DeviceModelId.blue,
  "Nano S": DeviceModelId.nanoS,
  "Nano S Plus": DeviceModelId.nanoSP,
  "Nano X": DeviceModelId.nanoX,
  Stax: DeviceModelId.stax,
  Europa: DeviceModelId.europa
});
const devicesList = Object.values(devices);
const ledgerUSBVendorId = 11415;
const identifyUSBProductId = (usbProductId) => {
  const legacy = devicesList.find((d) => d.legacyUsbProductId === usbProductId);
  if (legacy)
    return legacy;
  const mm = usbProductId >> 8;
  const deviceModel = devicesList.find((d) => d.productIdMM === mm);
  return deviceModel;
};
const bluetoothServices = [];
const serviceUuidToInfos = {};
for (const id2 in devices) {
  const deviceModel = devices[id2];
  const { bluetoothSpec } = deviceModel;
  if (bluetoothSpec) {
    for (let i = 0; i < bluetoothSpec.length; i++) {
      const spec = bluetoothSpec[i];
      bluetoothServices.push(spec.serviceUuid);
      serviceUuidToInfos[spec.serviceUuid] = serviceUuidToInfos[spec.serviceUuid.replace(/-/g, "")] = {
        deviceModel,
        ...spec
      };
    }
  }
}
const ledgerDevices = [
  {
    vendorId: ledgerUSBVendorId
  }
];
const isSupported = () => Promise.resolve(!!(window.navigator && window.navigator.hid));
const getHID = () => {
  const { hid } = navigator;
  if (!hid)
    throw new TransportError("navigator.hid is not supported", "HIDNotSupported");
  return hid;
};
async function requestLedgerDevices() {
  const device = await getHID().requestDevice({
    filters: ledgerDevices
  });
  if (Array.isArray(device))
    return device;
  return [device];
}
async function getLedgerDevices() {
  const devices2 = await getHID().getDevices();
  return devices2.filter((d) => d.vendorId === ledgerUSBVendorId);
}
async function getFirstLedgerDevice() {
  const existingDevices = await getLedgerDevices();
  if (existingDevices.length > 0)
    return existingDevices[0];
  const devices2 = await requestLedgerDevices();
  return devices2[0];
}
class TransportWebHID extends Transport {
  device;
  deviceModel;
  channel = Math.floor(Math.random() * 65535);
  packetSize = 64;
  constructor(device) {
    super();
    this.device = device;
    this.deviceModel = typeof device.productId === "number" ? identifyUSBProductId(device.productId) : void 0;
    device.addEventListener("inputreport", this.onInputReport);
  }
  inputs = [];
  inputCallback;
  read = () => {
    if (this.inputs.length) {
      return Promise.resolve(this.inputs.shift());
    }
    return new Promise((success) => {
      this.inputCallback = success;
    });
  };
  onInputReport = (e) => {
    const buffer = bufferExports.Buffer.from(e.data.buffer);
    if (this.inputCallback) {
      this.inputCallback(buffer);
      this.inputCallback = null;
    } else {
      this.inputs.push(buffer);
    }
  };
  /**
   * Check if WebUSB transport is supported.
   */
  static isSupported = isSupported;
  /**
   * List the WebUSB devices that was previously authorized by the user.
   */
  static list = getLedgerDevices;
  /**
   * Actively listen to WebUSB devices and emit ONE device
   * that was either accepted before, if not it will trigger the native permission UI.
   *
   * Important: it must be called in the context of a UI click!
   */
  static listen = (observer) => {
    let unsubscribed = false;
    getFirstLedgerDevice().then((device) => {
      if (!device) {
        observer.error(new TransportOpenUserCancelled("Access denied to use Ledger device"));
      } else if (!unsubscribed) {
        const deviceModel = typeof device.productId === "number" ? identifyUSBProductId(device.productId) : void 0;
        observer.next({
          type: "add",
          descriptor: device,
          deviceModel
        });
        observer.complete();
      }
    }, (error) => {
      observer.error(new TransportOpenUserCancelled(error.message));
    });
    function unsubscribe() {
      unsubscribed = true;
    }
    return {
      unsubscribe
    };
  };
  /**
   * Similar to create() except it will always display the device permission (even if some devices are already accepted).
   */
  static async request() {
    const [device] = await requestLedgerDevices();
    return TransportWebHID.open(device);
  }
  /**
   * Similar to create() except it will never display the device permission (it returns a Promise<?Transport>, null if it fails to find a device).
   */
  static async openConnected() {
    const devices2 = await getLedgerDevices();
    if (devices2.length === 0)
      return null;
    return TransportWebHID.open(devices2[0]);
  }
  /**
   * Create a Ledger transport with a HIDDevice
   */
  static async open(device) {
    await device.open();
    const transport = new TransportWebHID(device);
    const onDisconnect = (e) => {
      if (device === e.device) {
        getHID().removeEventListener("disconnect", onDisconnect);
        transport._emitDisconnect(new DisconnectedDevice());
      }
    };
    getHID().addEventListener("disconnect", onDisconnect);
    return transport;
  }
  _disconnectEmitted = false;
  _emitDisconnect = (e) => {
    if (this._disconnectEmitted)
      return;
    this._disconnectEmitted = true;
    this.emit("disconnect", e);
  };
  /**
   * Release the transport device
   */
  async close() {
    await this.exchangeBusyPromise;
    this.device.removeEventListener("inputreport", this.onInputReport);
    await this.device.close();
  }
  /**
   * Exchange with the device using APDU protocol.
   * @param apdu
   * @returns a promise of apdu response
   */
  exchange = async (apdu) => {
    const b = await this.exchangeAtomicImpl(async () => {
      const { channel, packetSize } = this;
      log("apdu", "=> " + apdu.toString("hex"));
      const framing = createHIDframing(channel, packetSize);
      const blocks = framing.makeBlocks(apdu);
      for (let i = 0; i < blocks.length; i++) {
        await this.device.sendReport(0, blocks[i]);
      }
      let result;
      let acc;
      while (!(result = framing.getReducedResult(acc))) {
        try {
          const buffer = await this.read();
          acc = framing.reduceResponse(acc, buffer);
        } catch (e) {
          if (e instanceof TransportError && e.id === "InvalidChannel") {
            continue;
          }
          throw e;
        }
      }
      log("apdu", "<= " + result.toString("hex"));
      return result;
    }).catch((e) => {
      if (e && e.message && e.message.includes("write")) {
        this._emitDisconnect(e);
        throw new DisconnectedDeviceDuringOperation(e.message);
      }
      throw e;
    });
    return b;
  };
  setScrambleKey() {
  }
}
const IOTA_BIP44_COIN_TYPE = 4218;
const TESTNET_BIP44_COIN_TYPE = 1;
let ledgerTransport;
async function connectToLedger() {
  try {
    ledgerTransport = await TransportWebHID.create();
    console.log(ledgerTransport);
    return "connected!";
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function generateAddress(coinType, accountIndex, change, addressIndex, accountEntries) {
  try {
    const ledgerClient = new Iota(ledgerTransport);
    let bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
    console.log(bip44Path);
    const exists = accountEntries.some((entry) => entry.bip44Path === bip44Path);
    if (exists) {
      return accountEntries;
    }
    let result = await ledgerClient.getPublicKey(bip44Path);
    console.log(result);
    let publicKey = "0x" + toHex(result.publicKey);
    let address = "0x" + toHex(result.address);
    accountEntries.push({
      address,
      publicKey,
      bip44Path
    });
    return accountEntries;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function generateMultipleAddresses(coinType, accountIndex, change, addressIndex, numberToIncrease, accountOrAddress, accountEntries) {
  try {
    if (accountOrAddress == "account") {
      let finalIndex = accountIndex + numberToIncrease;
      for (let i = accountIndex; i < finalIndex; i++) {
        accountEntries = await generateAddress(
          coinType,
          i,
          change,
          addressIndex,
          accountEntries
        );
      }
    } else {
      let finalIndex = addressIndex + numberToIncrease;
      for (let i = addressIndex; i < finalIndex; i++) {
        accountEntries = await generateAddress(
          coinType,
          accountIndex,
          change,
          i,
          accountEntries
        );
      }
    }
    return accountEntries;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function formatAsTable(accountEntries) {
  let grouped = [];
  for (const address of accountEntries) {
    const match = address.bip44Path.match(/m\/44'\/\d+'\/(\d+)'\/(\d+)'\/(\d+)'?/);
    if (!match) {
      throw new Error("Invalid BIP44 path:" + address.bip44Path);
    }
    const accountIndex = parseInt(match[1]);
    const change = parseInt(match[2]);
    const addressIndex = parseInt(match[3]);
    if (!grouped[accountIndex]) {
      grouped[accountIndex] = [];
    }
    grouped[accountIndex].push({
      address: address.address,
      publicKey: address.publicKey,
      internal: change == 1,
      index: addressIndex,
      totalBalance: address.totalBalance,
      objectCount: address.objectCount
    });
    grouped[accountIndex].sort((a, b) => a.index - b.index);
  }
  return Object.entries(grouped).map(([key, value]) => [parseInt(key), value]);
}
async function getAllBalances(accountEntries, skipKnown = false) {
  try {
    const client = getClient();
    for (const entry of accountEntries) {
      if (entry.totalBalance && skipKnown) {
        continue;
      }
      let page = await client.getBalance({
        owner: entry.address
      });
      entry.totalBalance = page.totalBalance;
    }
    return accountEntries;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getAllObjects(accountEntries, skipKnown = false) {
  try {
    const client = getClient();
    for (const entry of accountEntries) {
      if (entry.objectCount && skipKnown) {
        continue;
      }
      let page = await client.getOwnedObjects({
        owner: entry.address
      });
      entry.objectCount = page.data.length;
    }
    return accountEntries;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function sendAllObjects(senderAddress, recipientAddress, coinType, accountIndex, change, addressIndex, accountEntries, dryRun = true) {
  try {
    if (!isValidIotaAddress(senderAddress)) {
      throw new Error("invalid sender address");
    }
    if (!isValidIotaAddress(recipientAddress)) {
      throw new Error("invalid recipient address");
    }
    let address = accountEntries.find((addr) => addr.address == senderAddress);
    let bip44Path = address?.bip44Path;
    if (!bip44Path) {
      bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
    }
    const client = getClient();
    const tx = new Transaction();
    let page = await client.getOwnedObjects({
      owner: senderAddress,
      options: {
        showType: true
      }
    });
    if (page.data.length == 0) {
      throw new Error("No objects found");
    }
    const gasCoinIndex = page.data.findIndex((o) => {
      return o.data?.type === `0x2::coin::Coin<0x2::iota::IOTA>`;
    });
    let gasCoin = null;
    if (gasCoinIndex !== -1) {
      gasCoin = page.data.splice(gasCoinIndex, 1)[0];
    }
    if (!gasCoin) {
      throw new Error("No gas coin found");
    }
    let objectsToTransfer = page.data.map((o) => o.data?.objectId ?? "");
    objectsToTransfer.push(tx.gas);
    tx.transferObjects(objectsToTransfer, tx.pure.address(recipientAddress));
    return await finishTransaction(tx, bip44Path, senderAddress, client, dryRun);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function sendIotaAmount(senderAddress, recipientAddress, iotaAmountToSend, coinType, accountIndex, change, addressIndex, accountEntries, dryRun = true) {
  try {
    if (!isValidIotaAddress(senderAddress)) {
      throw new Error("invalid sender address");
    }
    if (!isValidIotaAddress(recipientAddress)) {
      throw new Error("invalid recipient address");
    }
    let address = accountEntries.find((addr) => addr.address == senderAddress);
    let bip44Path = address?.bip44Path;
    if (!bip44Path) {
      bip44Path = `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`;
    }
    const client = getClient();
    const tx = new Transaction();
    let balance = await client.getBalance({
      owner: senderAddress
    });
    if (BigInt(balance.totalBalance) < BigInt(iotaAmountToSend)) {
      throw new Error(`Not enough balance ${balance.totalBalance}/${iotaAmountToSend}`);
    }
    const coins = tx.splitCoins(tx.gas, [BigInt(iotaAmountToSend)]);
    tx.transferObjects([coins[0]], tx.pure.address(recipientAddress));
    return await finishTransaction(tx, bip44Path, senderAddress, client, dryRun);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function finishTransaction(tx, bip44Path, senderAddress, client, dryRun = true) {
  try {
    tx.setSender(senderAddress);
    const txBytes = await tx.build({ client });
    if (dryRun) {
      const dryRunResult = await client.dryRunTransactionBlock({
        transactionBlock: txBytes
      });
      console.log(dryRunResult);
      return dryRunResult;
    } else {
      const ledgerClient = new Iota(ledgerTransport);
      let txMessageIntent = messageWithIntent("TransactionData", txBytes);
      const { signature } = await ledgerClient.signTransaction(bip44Path, txMessageIntent);
      const { publicKey } = await ledgerClient.getPublicKey(bip44Path);
      const serializedSignature = toSerializedSignature({
        signature,
        signatureScheme: "ED25519",
        publicKey: new Ed25519PublicKey(publicKey)
      });
      const result = await client.executeTransactionBlock({
        transactionBlock: txBytes,
        signature: serializedSignature,
        options: {
          showBalanceChanges: true,
          showEffects: true
        }
      });
      console.log(result);
      return result;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
var root_3 = from_html(`<tr><td class="svelte-1yhe0ga"> </td><td class="svelte-1yhe0ga"> </td><td class="mono svelte-1yhe0ga"> </td><td class="mono svelte-1yhe0ga"> </td><td class="svelte-1yhe0ga"> </td><td class="svelte-1yhe0ga"> </td></tr>`);
var root_2 = from_html(`<tr><td colspan="2" class="svelte-1yhe0ga"><table class="inner-table svelte-1yhe0ga"><thead><tr><th class="svelte-1yhe0ga">Index</th><th class="svelte-1yhe0ga">Internal</th><th class="svelte-1yhe0ga">Address</th><th class="svelte-1yhe0ga">PublicKey</th><th class="svelte-1yhe0ga">Balance</th><th class="svelte-1yhe0ga">Owned Objects</th></tr></thead><tbody></tbody></table></td></tr>`);
var root_1 = from_html(`<tr class="clickable svelte-1yhe0ga"><td class="svelte-1yhe0ga"> </td><td class="svelte-1yhe0ga"> </td></tr> <!>`, 1);
var root = from_html(`<main><button class="svelte-1yhe0ga">connect</button> <br/> BIP 44 path: (m/44'/coinType'/accountIndex'/change'/addressIndex') <br/> <input type="number" list="coinTypes" placeholder="BIP-44 coin type" class="svelte-1yhe0ga"/> <datalist id="coinTypes"><option>IOTA</option><option>Testnet</option></datalist> <input type="number" min="0" placeholder="account index" class="svelte-1yhe0ga"/> <select><option>0</option><option>1</option></select> <input type="number" width="1" min="0" placeholder="address index" class="svelte-1yhe0ga"/> <button class="svelte-1yhe0ga">generate address</button> <br/> increase <select><option>account</option><option>address</option></select> index by: <input type="number" min="1" placeholder="number to generate" class="svelte-1yhe0ga"/> <button class="svelte-1yhe0ga">generate multiple addresses</button> <hr/> <button class="svelte-1yhe0ga">get unknown balances</button> <button class="svelte-1yhe0ga">get all balances</button> <button class="svelte-1yhe0ga">get unknown objects</button> <button class="svelte-1yhe0ga">get all objects</button> <hr/> <div>Sender address: <input type="string" size="70" placeholder="sender address" class="svelte-1yhe0ga"/></div> <div>Recipient address: <input type="string" size="70" placeholder="recipient address" class="svelte-1yhe0ga"/></div> <select><option>dry run</option><option>send</option></select> <button class="svelte-1yhe0ga">send all objects</button> IOTA amount(in Nanos) to send: <input type="number" min="0" placeholder="IOTA amount to send" class="svelte-1yhe0ga"/> <button class="svelte-1yhe0ga">send IOTA</button> <hr/> <button class="svelte-1yhe0ga">clear address list</button> <button class="svelte-1yhe0ga">expand all</button> <button class="svelte-1yhe0ga">collapse all</button> <!> <table class="svelte-1yhe0ga"><thead><tr><th class="svelte-1yhe0ga">Account</th><th class="svelte-1yhe0ga">Addresses</th></tr></thead><tbody></tbody></table></main>`);
function LedgerNano($$anchor, $$props) {
  push($$props, true);
  let coinType = state(proxy(TESTNET_BIP44_COIN_TYPE));
  let accountIndex = state(0);
  let change = state(0);
  let addressIndex = state(0);
  let numberToIncrease = state(3);
  let accountOrAddress = state("account");
  let dryRun = state(true);
  let iotaAmountToSend = state("1");
  let senderAddress = state("");
  let recipientAddress = state("");
  let value = state(proxy({}));
  let accountEntries = state(proxy([]));
  async function connect() {
    try {
      set(value, await connectToLedger(), true);
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  async function handleGenerateAddress() {
    try {
      set(accountEntries, await generateAddress(get(coinType), get(accountIndex), get(change), get(addressIndex), get(accountEntries)), true);
      set(value, get(accountEntries), true);
      handleFormatAsTable();
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  async function handleGenerateMultipleAddresses() {
    try {
      set(accountEntries, await generateMultipleAddresses(get(coinType), get(accountIndex), get(change), get(addressIndex), get(numberToIncrease), get(accountOrAddress), get(accountEntries)), true);
      set(value, get(accountEntries), true);
      handleFormatAsTable();
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  let tableAccounts = state(proxy([]));
  let expanded = state(proxy([]));
  function handleFormatAsTable() {
    set(tableAccounts, formatAsTable(get(accountEntries)), true);
  }
  function toggle(index2) {
    if (get(expanded).includes(index2)) {
      set(expanded, get(expanded).filter((i) => i !== index2), true);
    } else {
      set(expanded, [...get(expanded), index2], true);
    }
  }
  function isExpanded(index2) {
    return get(expanded).includes(index2);
  }
  async function handleGetAllBalances(skipKnown = false) {
    try {
      set(accountEntries, await getAllBalances(get(accountEntries), skipKnown), true);
      handleFormatAsTable();
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  async function handleGetAllObjects(skipKnown = false) {
    try {
      set(accountEntries, await getAllObjects(get(accountEntries), skipKnown), true);
      handleFormatAsTable();
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  async function handleSendAllObjects() {
    try {
      set(value, await sendAllObjects(get(senderAddress), get(recipientAddress), get(coinType), get(accountIndex), get(change), get(addressIndex), get(accountEntries), get(dryRun)), true);
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  async function handleSendIotaAmount() {
    try {
      set(value, await sendIotaAmount(get(senderAddress), get(recipientAddress), get(iotaAmountToSend), get(coinType), get(accountIndex), get(change), get(addressIndex), get(accountEntries), get(dryRun)), true);
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
    }
  }
  var main = root();
  var button = child(main);
  var input = sibling(button, 6);
  var datalist = sibling(input, 2);
  var option = child(datalist);
  var option_value = {};
  var option_1 = sibling(option);
  var option_1_value = {};
  var input_1 = sibling(datalist, 2);
  var select = sibling(input_1, 2);
  var option_2 = child(select);
  option_2.value = option_2.__value = 0;
  var option_3 = sibling(option_2);
  option_3.value = option_3.__value = 1;
  var input_2 = sibling(select, 2);
  var button_1 = sibling(input_2, 2);
  var select_1 = sibling(button_1, 4);
  var option_4 = child(select_1);
  option_4.value = option_4.__value = "account";
  var option_5 = sibling(option_4);
  option_5.value = option_5.__value = "address";
  var input_3 = sibling(select_1, 2);
  var button_2 = sibling(input_3, 2);
  var button_3 = sibling(button_2, 4);
  var button_4 = sibling(button_3, 2);
  var button_5 = sibling(button_4, 2);
  var button_6 = sibling(button_5, 2);
  var div = sibling(button_6, 4);
  var input_4 = sibling(child(div));
  var div_1 = sibling(div, 2);
  var input_5 = sibling(child(div_1));
  var select_2 = sibling(div_1, 2);
  var option_6 = child(select_2);
  option_6.value = option_6.__value = true;
  var option_7 = sibling(option_6);
  option_7.value = option_7.__value = false;
  var button_7 = sibling(select_2, 2);
  var input_6 = sibling(button_7, 2);
  var button_8 = sibling(input_6, 2);
  var button_9 = sibling(button_8, 4);
  var button_10 = sibling(button_9, 2);
  var button_11 = sibling(button_10, 2);
  var node = sibling(button_11, 2);
  JsonToggleView(node, {
    get value() {
      return get(value);
    }
  });
  var table = sibling(node, 2);
  var tbody = sibling(child(table));
  each(tbody, 21, () => get(tableAccounts), index, ($$anchor2, $$item) => {
    var $$array = user_derived(() => to_array(get($$item), 2));
    let index$1 = () => get($$array)[0];
    let addresses = () => get($$array)[1];
    var fragment = root_1();
    var tr = first_child(fragment);
    var td = child(tr);
    var text = child(td);
    var td_1 = sibling(td);
    var text_1 = child(td_1);
    var node_1 = sibling(tr, 2);
    {
      var consequent = ($$anchor3) => {
        var tr_1 = root_2();
        var td_2 = child(tr_1);
        var table_1 = child(td_2);
        var tbody_1 = sibling(child(table_1));
        each(tbody_1, 21, addresses, index, ($$anchor4, addr) => {
          var tr_2 = root_3();
          var td_3 = child(tr_2);
          var text_2 = child(td_3);
          var td_4 = sibling(td_3);
          var text_3 = child(td_4);
          var td_5 = sibling(td_4);
          var text_4 = child(td_5);
          var td_6 = sibling(td_5);
          var text_5 = child(td_6);
          var td_7 = sibling(td_6);
          var text_6 = child(td_7);
          var td_8 = sibling(td_7);
          var text_7 = child(td_8);
          template_effect(() => {
            set_text(text_2, get(addr).index);
            set_text(text_3, get(addr).internal);
            set_text(text_4, get(addr).address);
            set_text(text_5, get(addr).publicKey);
            set_text(text_6, get(addr).totalBalance);
            set_text(text_7, get(addr).objectCount);
          });
          append($$anchor4, tr_2);
        });
        append($$anchor3, tr_1);
      };
      var d = user_derived(() => isExpanded(index$1()));
      if_block(node_1, ($$render) => {
        if (get(d)) $$render(consequent);
      });
    }
    template_effect(
      ($0) => {
        set_text(text, `Account ${index$1() ?? ""} (addresses: ${addresses().length ?? ""})`);
        set_text(text_1, $0);
      },
      [
        () => isExpanded(index$1()) ? "▼ Click to collapse" : "▶ Click to expand"
      ]
    );
    delegated("click", tr, () => toggle(index$1()));
    append($$anchor2, fragment);
  });
  template_effect(() => {
    if (option_value !== (option_value = IOTA_BIP44_COIN_TYPE)) {
      option.value = (option.__value = IOTA_BIP44_COIN_TYPE) ?? "";
    }
    if (option_1_value !== (option_1_value = TESTNET_BIP44_COIN_TYPE)) {
      option_1.value = (option_1.__value = TESTNET_BIP44_COIN_TYPE) ?? "";
    }
  });
  delegated("click", button, () => connect());
  bind_value(input, () => get(coinType), ($$value) => set(coinType, $$value));
  bind_value(input_1, () => get(accountIndex), ($$value) => set(accountIndex, $$value));
  bind_select_value(select, () => get(change), ($$value) => set(change, $$value));
  bind_value(input_2, () => get(addressIndex), ($$value) => set(addressIndex, $$value));
  delegated("click", button_1, () => handleGenerateAddress());
  bind_select_value(select_1, () => get(accountOrAddress), ($$value) => set(accountOrAddress, $$value));
  bind_value(input_3, () => get(numberToIncrease), ($$value) => set(numberToIncrease, $$value));
  delegated("click", button_2, () => handleGenerateMultipleAddresses());
  delegated("click", button_3, () => handleGetAllBalances(true));
  delegated("click", button_4, () => handleGetAllBalances());
  delegated("click", button_5, () => handleGetAllObjects(true));
  delegated("click", button_6, () => handleGetAllObjects());
  bind_value(input_4, () => get(senderAddress), ($$value) => set(senderAddress, $$value));
  bind_value(input_5, () => get(recipientAddress), ($$value) => set(recipientAddress, $$value));
  bind_select_value(select_2, () => get(dryRun), ($$value) => set(dryRun, $$value));
  delegated("click", button_7, () => handleSendAllObjects());
  bind_value(input_6, () => get(iotaAmountToSend), ($$value) => set(iotaAmountToSend, $$value));
  delegated("click", button_8, () => handleSendIotaAmount());
  delegated("click", button_9, () => {
    set(accountEntries, [], true);
    set(tableAccounts, [], true);
    set(value, "");
  });
  delegated("click", button_10, () => {
    set(expanded, get(tableAccounts).map((e) => e[0]), true);
  });
  delegated("click", button_11, () => {
    set(expanded, [], true);
  });
  append($$anchor, main);
  pop();
}
delegate(["click"]);
export {
  LedgerNano as default
};

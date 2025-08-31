import { ai as sha256, q as getDefaultExportFromCjs, p as push, r as prop, u as onMount, g as get, m as mutable_source, o as mutate, v as onDestroy, w as legacy_pre_effect, x as deep_read_state, y as legacy_pre_effect_reset, i as init, f as from_html, G as first_child, b as if_block, s as sibling, k as append, l as pop, j as set, c as child, C as untrack, t as template_effect, d as set_text, e as event, z as each, K as set_class, a8 as derived_safe_equal, A as index, aj as __vitePreload, ak as createEventDispatcher, al as tick, J as set_style, am as base58, an as fromHEX, ao as Ed25519PublicKey, ap as messageWithIntent, a as invalidate_inner_signals, ah as toHEX, h as bind_select_value, E as bind_value, n as getClient, M as toB64 } from "/iota-utils/assets/index-CoXScrZT.js";
import { b as bind_this } from "/iota-utils/assets/this-BlOo6jbA.js";
import { b as bufferExports } from "/iota-utils/assets/index-rSD_0cGr.js";
import { b as bind_prop } from "/iota-utils/assets/props-uBcWsBAS.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-qyLwCKVm.js";
import "/iota-utils/assets/transaction-view-Cu-HMV3T.js";
import "/iota-utils/assets/attributes-7kmL_FbF.js";
import "/iota-utils/assets/iota-nano-conversion-DZhO2FiK.js";
var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
function clone(configObject) {
  var div, convertBase, parseNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: " ",
    // non-breaking space
    suffix: ""
  }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
  function BigNumber2(v, b) {
    var alphabet, c, caseChanged, e2, i, isNum, len, str, x = this;
    if (!(x instanceof BigNumber2)) return new BigNumber2(v, b);
    if (b == null) {
      if (v && v._isBigNumber === true) {
        x.s = v.s;
        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }
        return;
      }
      if ((isNum = typeof v == "number") && v * 0 == 0) {
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;
        if (v === ~~v) {
          for (e2 = 0, i = v; i >= 10; i /= 10, e2++) ;
          if (e2 > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e2;
            x.c = [v];
          }
          return;
        }
        str = String(v);
      } else {
        if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }
      if ((e2 = str.indexOf(".")) > -1) str = str.replace(".", "");
      if ((i = str.search(/e/i)) > 0) {
        if (e2 < 0) e2 = i;
        e2 += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e2 < 0) {
        e2 = str.length;
      }
    } else {
      intCheck(b, 2, ALPHABET.length, "Base");
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber2(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }
      str = String(v);
      if (isNum = typeof v == "number") {
        if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
        if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
          throw Error(tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }
      alphabet = ALPHABET.slice(0, b);
      e2 = i = 0;
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == ".") {
            if (i > e2) {
              e2 = len;
              continue;
            }
          } else if (!caseChanged) {
            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e2 = 0;
              continue;
            }
          }
          return parseNumeric(x, String(v), isNum, b);
        }
      }
      isNum = false;
      str = convertBase(str, b, 10, x.s);
      if ((e2 = str.indexOf(".")) > -1) str = str.replace(".", "");
      else e2 = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++) ;
    for (len = str.length; str.charCodeAt(--len) === 48; ) ;
    if (str = str.slice(i, ++len)) {
      len -= i;
      if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
        throw Error(tooManyDigits + x.s * v);
      }
      if ((e2 = e2 - i - 1) > MAX_EXP) {
        x.c = x.e = null;
      } else if (e2 < MIN_EXP) {
        x.c = [x.e = 0];
      } else {
        x.e = e2;
        x.c = [];
        i = (e2 + 1) % LOG_BASE;
        if (e2 < 0) i += LOG_BASE;
        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len; ) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }
          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }
        for (; i--; str += "0") ;
        x.c.push(+str);
      }
    } else {
      x.c = [x.e = 0];
    }
  }
  BigNumber2.clone = clone;
  BigNumber2.ROUND_UP = 0;
  BigNumber2.ROUND_DOWN = 1;
  BigNumber2.ROUND_CEIL = 2;
  BigNumber2.ROUND_FLOOR = 3;
  BigNumber2.ROUND_HALF_UP = 4;
  BigNumber2.ROUND_HALF_DOWN = 5;
  BigNumber2.ROUND_HALF_EVEN = 6;
  BigNumber2.ROUND_HALF_CEIL = 7;
  BigNumber2.ROUND_HALF_FLOOR = 8;
  BigNumber2.EUCLID = 9;
  BigNumber2.config = BigNumber2.set = function(obj) {
    var p, v;
    if (obj != null) {
      if (typeof obj == "object") {
        if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }
        if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }
        if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }
        if (obj.hasOwnProperty(p = "RANGE")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error(bignumberError + p + " cannot be zero: " + v);
            }
          }
        }
        if (obj.hasOwnProperty(p = "CRYPTO")) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error(bignumberError + "crypto unavailable");
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error(bignumberError + p + " not true or false: " + v);
          }
        }
        if (obj.hasOwnProperty(p = "MODULO_MODE")) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }
        if (obj.hasOwnProperty(p = "POW_PRECISION")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }
        if (obj.hasOwnProperty(p = "FORMAT")) {
          v = obj[p];
          if (typeof v == "object") FORMAT = v;
          else throw Error(bignumberError + p + " not an object: " + v);
        }
        if (obj.hasOwnProperty(p = "ALPHABET")) {
          v = obj[p];
          if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
            ALPHABET = v;
          } else {
            throw Error(bignumberError + p + " invalid: " + v);
          }
        }
      } else {
        throw Error(bignumberError + "Object expected: " + obj);
      }
    }
    return {
      DECIMAL_PLACES,
      ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO,
      MODULO_MODE,
      POW_PRECISION,
      FORMAT,
      ALPHABET
    };
  };
  BigNumber2.isBigNumber = function(v) {
    if (!v || v._isBigNumber !== true) return false;
    if (!BigNumber2.DEBUG) return true;
    var i, n, c = v.c, e2 = v.e, s = v.s;
    out: if ({}.toString.call(c) == "[object Array]") {
      if ((s === 1 || s === -1) && e2 >= -MAX && e2 <= MAX && e2 === mathfloor(e2)) {
        if (c[0] === 0) {
          if (e2 === 0 && c.length === 1) return true;
          break out;
        }
        i = (e2 + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;
        if (String(c[0]).length == i) {
          for (i = 0; i < c.length; i++) {
            n = c[i];
            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
          }
          if (n !== 0) return true;
        }
      }
    } else if (c === null && e2 === null && (s === null || s === 1 || s === -1)) {
      return true;
    }
    throw Error(bignumberError + "Invalid BigNumber: " + v);
  };
  BigNumber2.maximum = BigNumber2.max = function() {
    return maxOrMin(arguments, -1);
  };
  BigNumber2.minimum = BigNumber2.min = function() {
    return maxOrMin(arguments, 1);
  };
  BigNumber2.random = (function() {
    var pow2_53 = 9007199254740992;
    var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
      return mathfloor(Math.random() * pow2_53);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(dp) {
      var a, b, e2, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
      if (dp == null) dp = DECIMAL_PLACES;
      else intCheck(dp, 0, MAX);
      k = mathceil(dp / LOG_BASE);
      if (CRYPTO) {
        if (crypto.getRandomValues) {
          a = crypto.getRandomValues(new Uint32Array(k *= 2));
          for (; i < k; ) {
            v = a[i] * 131072 + (a[i + 1] >>> 11);
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;
        } else if (crypto.randomBytes) {
          a = crypto.randomBytes(k *= 7);
          for (; i < k; ) {
            v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error(bignumberError + "crypto unavailable");
        }
      }
      if (!CRYPTO) {
        for (; i < k; ) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }
      k = c[--i];
      dp %= LOG_BASE;
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }
      for (; c[i] === 0; c.pop(), i--) ;
      if (i < 0) {
        c = [e2 = 0];
      } else {
        for (e2 = -1; c[0] === 0; c.splice(0, 1), e2 -= LOG_BASE) ;
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++) ;
        if (i < LOG_BASE) e2 -= LOG_BASE - i;
      }
      rand.e = e2;
      rand.c = c;
      return rand;
    };
  })();
  BigNumber2.sum = function() {
    var i = 1, args = arguments, sum = new BigNumber2(args[0]);
    for (; i < args.length; ) sum = sum.plus(args[i++]);
    return sum;
  };
  convertBase = /* @__PURE__ */ (function() {
    var decimal = "0123456789";
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j, arr = [0], arrL, i = 0, len = str.length;
      for (; i < len; ) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn) ;
        arr[0] += alphabet.indexOf(str.charAt(i++));
        for (j = 0; j < arr.length; j++) {
          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }
      return arr.reverse();
    }
    return function(str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet, d, e2, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
      if (i >= 0) {
        k = POW_PRECISION;
        POW_PRECISION = 0;
        str = str.replace(".", "");
        y = new BigNumber2(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;
        y.c = toBaseOut(
          toFixedPoint(coeffToString(x.c), x.e, "0"),
          10,
          baseOut,
          decimal
        );
        y.e = y.c.length;
      }
      xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
      e2 = k = xc.length;
      for (; xc[--k] == 0; xc.pop()) ;
      if (!xc[0]) return alphabet.charAt(0);
      if (i < 0) {
        --e2;
      } else {
        x.c = xc;
        x.e = e2;
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e2 = x.e;
      }
      d = e2 + dp + 1;
      i = xc[d];
      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;
      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
      if (d < 1 || !xc[0]) {
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {
        xc.length = d;
        if (r) {
          for (--baseOut; ++xc[--d] > baseOut; ) {
            xc[d] = 0;
            if (!d) {
              ++e2;
              xc = [1].concat(xc);
            }
          }
        }
        for (k = xc.length; !xc[--k]; ) ;
        for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++])) ;
        str = toFixedPoint(str, e2, alphabet.charAt(0));
      }
      return str;
    };
  })();
  div = /* @__PURE__ */ (function() {
    function multiply(x, k, base) {
      var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
      for (x = x.slice(); i--; ) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }
      if (carry) x = [carry].concat(x);
      return x;
    }
    function compare2(a, b, aL, bL) {
      var i, cmp;
      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {
        for (i = cmp = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return cmp;
    }
    function subtract(a, b, aL, base) {
      var i = 0;
      for (; aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; a.splice(0, 1)) ;
    }
    return function(x, y, dp, rm, base) {
      var cmp, e2, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
      if (!xc || !xc[0] || !yc || !yc[0]) {
        return new BigNumber2(
          // Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
          )
        );
      }
      q = new BigNumber2(s);
      qc = q.c = [];
      e2 = x.e - y.e;
      s = dp + e2 + 1;
      if (!base) {
        base = BASE;
        e2 = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }
      for (i = 0; yc[i] == (xc[i] || 0); i++) ;
      if (yc[i] > (xc[i] || 0)) e2--;
      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;
        n = mathfloor(base / (yc[0] + 1));
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }
        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; rem[remL++] = 0) ;
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        do {
          n = 0;
          cmp = compare2(yc, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
            n = mathfloor(rem0 / yc0);
            if (n > 1) {
              if (n >= base) n = base - 1;
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;
              while (compare2(prod, rem, prodL, remL) == 1) {
                n--;
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {
              if (n == 0) {
                cmp = n = 1;
              }
              prod = yc.slice();
              prodL = prod.length;
            }
            if (prodL < remL) prod = [0].concat(prod);
            subtract(rem, prod, remL, base);
            remL = rem.length;
            if (cmp == -1) {
              while (compare2(yc, rem, yL, remL) < 1) {
                n++;
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          }
          qc[i++] = n;
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);
        more = rem[0] != null;
        if (!qc[0]) qc.splice(0, 1);
      }
      if (base == BASE) {
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++) ;
        round(q, dp + (q.e = i + e2 * LOG_BASE - 1) + 1, rm, more);
      } else {
        q.e = e2;
        q.r = +more;
      }
      return q;
    };
  })();
  function format(n, i, rm, id) {
    var c0, e2, ne, len, str;
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    if (!n.c) return n.toString();
    c0 = n.c[0];
    ne = n.e;
    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
    } else {
      n = round(new BigNumber2(n), i, rm);
      e2 = n.e;
      str = coeffToString(n.c);
      len = str.length;
      if (id == 1 || id == 2 && (i <= e2 || e2 <= TO_EXP_NEG)) {
        for (; len < i; str += "0", len++) ;
        str = toExponential(str, e2);
      } else {
        i -= ne + (id === 2 && e2 > ne);
        str = toFixedPoint(str, e2, "0");
        if (e2 + 1 > len) {
          if (--i > 0) for (str += "."; i--; str += "0") ;
        } else {
          i += e2 - len;
          if (i > 0) {
            if (e2 + 1 == len) str += ".";
            for (; i--; str += "0") ;
          }
        }
      }
    }
    return n.s < 0 && c0 ? "-" + str : str;
  }
  function maxOrMin(args, n) {
    var k, y, i = 1, x = new BigNumber2(args[0]);
    for (; i < args.length; i++) {
      y = new BigNumber2(args[i]);
      if (!y.s || (k = compare$1(x, y)) === n || k === 0 && x.s === n) {
        x = y;
      }
    }
    return x;
  }
  function normalise(n, c, e2) {
    var i = 1, j = c.length;
    for (; !c[--j]; c.pop()) ;
    for (j = c[0]; j >= 10; j /= 10, i++) ;
    if ((e2 = i + e2 * LOG_BASE - 1) > MAX_EXP) {
      n.c = n.e = null;
    } else if (e2 < MIN_EXP) {
      n.c = [n.e = 0];
    } else {
      n.e = e2;
      n.c = c;
    }
    return n;
  }
  parseNumeric = /* @__PURE__ */ (function() {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(x, str, isNum, b) {
      var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {
          s = s.replace(basePrefix, function(m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;
            s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
          }
          if (str != s) return new BigNumber2(s, base);
        }
        if (BigNumber2.DEBUG) {
          throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
        }
        x.s = null;
      }
      x.c = x.e = null;
    };
  })();
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
    if (xc) {
      out: {
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++) ;
        i = sd - d;
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];
          rd = mathfloor(n / pows10[d - j - 1] % 10);
        } else {
          ni = mathceil((i + 1) / LOG_BASE);
          if (ni >= xc.length) {
            if (r) {
              for (; xc.length <= ni; xc.push(0)) ;
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];
            for (d = 1; k >= 10; k /= 10, d++) ;
            i %= LOG_BASE;
            j = i - LOG_BASE + d;
            rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
          }
        }
        r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
        r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xc[0]) {
          xc.length = 0;
          if (r) {
            sd -= x.e + 1;
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {
            xc[0] = x.e = 0;
          }
          return x;
        }
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }
        if (r) {
          for (; ; ) {
            if (ni == 0) {
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++) ;
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++) ;
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }
              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }
        for (i = xc.length; xc[--i] === 0; xc.pop()) ;
      }
      if (x.e > MAX_EXP) {
        x.c = x.e = null;
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }
    return x;
  }
  function valueOf(n) {
    var str, e2 = n.e;
    if (e2 === null) return n.toString();
    str = coeffToString(n.c);
    str = e2 <= TO_EXP_NEG || e2 >= TO_EXP_POS ? toExponential(str, e2) : toFixedPoint(str, e2, "0");
    return n.s < 0 ? "-" + str : str;
  }
  P.absoluteValue = P.abs = function() {
    var x = new BigNumber2(this);
    if (x.s < 0) x.s = 1;
    return x;
  };
  P.comparedTo = function(y, b) {
    return compare$1(this, new BigNumber2(y, b));
  };
  P.decimalPlaces = P.dp = function(dp, rm) {
    var c, n, v, x = this;
    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(new BigNumber2(x), dp + x.e + 1, rm);
    }
    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--) ;
    if (n < 0) n = 0;
    return n;
  };
  P.dividedBy = P.div = function(y, b) {
    return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };
  P.dividedToIntegerBy = P.idiv = function(y, b) {
    return div(this, new BigNumber2(y, b), 0, 1);
  };
  P.exponentiatedBy = P.pow = function(n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
    n = new BigNumber2(n);
    if (n.c && !n.isInteger()) {
      throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
    }
    if (m != null) m = new BigNumber2(m);
    nIsBig = n.e > 14;
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
      y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }
    nIsNeg = n.s < 0;
    if (m) {
      if (m.c ? !m.c[0] : !m.s) return new BigNumber2(NaN);
      isModExp = !nIsNeg && x.isInteger() && m.isInteger();
      if (isModExp) x = x.mod(m);
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
      k = x.s < 0 && isOdd(n) ? -0 : 0;
      if (x.e > -1) k = 1 / k;
      return new BigNumber2(nIsNeg ? 1 / k : k);
    } else if (POW_PRECISION) {
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }
    if (nIsBig) {
      half = new BigNumber2(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }
    y = new BigNumber2(ONE);
    for (; ; ) {
      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;
        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);
        }
      }
      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);
        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }
      x = x.times(x);
      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);
      }
    }
    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);
    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };
  P.integerValue = function(rm) {
    var n = new BigNumber2(this);
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };
  P.isEqualTo = P.eq = function(y, b) {
    return compare$1(this, new BigNumber2(y, b)) === 0;
  };
  P.isFinite = function() {
    return !!this.c;
  };
  P.isGreaterThan = P.gt = function(y, b) {
    return compare$1(this, new BigNumber2(y, b)) > 0;
  };
  P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
    return (b = compare$1(this, new BigNumber2(y, b))) === 1 || b === 0;
  };
  P.isInteger = function() {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };
  P.isLessThan = P.lt = function(y, b) {
    return compare$1(this, new BigNumber2(y, b)) < 0;
  };
  P.isLessThanOrEqualTo = P.lte = function(y, b) {
    return (b = compare$1(this, new BigNumber2(y, b))) === -1 || b === 0;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = function() {
    return this.s < 0;
  };
  P.isPositive = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.c && this.c[0] == 0;
  };
  P.minus = function(y, b) {
    var i, j, t, xLTy, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b) return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
      if (!xc[0] || !yc[0]) {
        return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
          // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
          ROUNDING_MODE == 3 ? -0 : 0
        ));
      }
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }
      t.reverse();
      for (b = a; b--; t.push(0)) ;
      t.reverse();
    } else {
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }
    if (xLTy) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }
    b = (j = yc.length) - (i = xc.length);
    if (b > 0) for (; b--; xc[i++] = 0) ;
    b = BASE - 1;
    for (; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b) ;
        --xc[i];
        xc[j] += BASE;
      }
      xc[j] -= yc[j];
    }
    for (; xc[0] == 0; xc.splice(0, 1), --ye) ;
    if (!xc[0]) {
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }
    return normalise(y, xc, ye);
  };
  P.modulo = P.mod = function(y, b) {
    var q, s, x = this;
    y = new BigNumber2(y, b);
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber2(NaN);
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber2(x);
    }
    if (MODULO_MODE == 9) {
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }
    y = x.minus(q.times(y));
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
    return y;
  };
  P.multipliedBy = P.times = function(y, b) {
    var c, e2, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
    if (!xc || !yc || !xc[0] || !yc[0]) {
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;
        if (!xc || !yc) {
          y.c = y.e = null;
        } else {
          y.c = [0];
          y.e = 0;
        }
      }
      return y;
    }
    e2 = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;
    if (xcL < ycL) {
      zc = xc;
      xc = yc;
      yc = zc;
      i = xcL;
      xcL = ycL;
      ycL = i;
    }
    for (i = xcL + ycL, zc = []; i--; zc.push(0)) ;
    base = BASE;
    sqrtBase = SQRT_BASE;
    for (i = ycL; --i >= 0; ) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;
      for (k = xcL, j = i + k; j > i; ) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }
      zc[j] = c;
    }
    if (c) {
      ++e2;
    } else {
      zc.splice(0, 1);
    }
    return normalise(y, zc, e2);
  };
  P.negated = function() {
    var x = new BigNumber2(this);
    x.s = -x.s || null;
    return x;
  };
  P.plus = function(y, b) {
    var t, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b) return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc) return new BigNumber2(a / 0);
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }
      t.reverse();
      for (; a--; t.push(0)) ;
      t.reverse();
    }
    a = xc.length;
    b = yc.length;
    if (a - b < 0) {
      t = yc;
      yc = xc;
      xc = t;
      b = a;
    }
    for (a = 0; b; ) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }
    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }
    return normalise(y, xc, ye);
  };
  P.precision = P.sd = function(sd, rm) {
    var c, n, v, x = this;
    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(new BigNumber2(x), sd, rm);
    }
    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;
    if (v = c[v]) {
      for (; v % 10 == 0; v /= 10, n--) ;
      for (v = c[0]; v >= 10; v /= 10, n++) ;
    }
    if (sd && x.e + 1 > n) n = x.e + 1;
    return n;
  };
  P.shiftedBy = function(k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times("1e" + k);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n, r, rep, t, x = this, c = x.c, s = x.s, e2 = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }
    s = Math.sqrt(+valueOf(x));
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e2) % 2 == 0) n += "0";
      s = Math.sqrt(+n);
      e2 = bitFloor((e2 + 1) / 2) - (e2 < 0 || e2 % 2);
      if (s == 1 / 0) {
        n = "5e" + e2;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e2;
      }
      r = new BigNumber2(n);
    } else {
      r = new BigNumber2(s + "");
    }
    if (r.c[0]) {
      e2 = r.e;
      s = e2 + dp;
      if (s < 3) s = 0;
      for (; ; ) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));
        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
          if (r.e < e2) --s;
          n = n.slice(s - 3, s + 1);
          if (n == "9999" || !rep && n == "4999") {
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);
              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }
            dp += 4;
            s += 4;
            rep = 1;
          } else {
            if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }
            break;
          }
        }
      }
    }
    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };
  P.toExponential = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };
  P.toFixed = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };
  P.toFormat = function(dp, rm, format2) {
    var str, x = this;
    if (format2 == null) {
      if (dp != null && rm && typeof rm == "object") {
        format2 = rm;
        rm = null;
      } else if (dp && typeof dp == "object") {
        format2 = dp;
        dp = rm = null;
      } else {
        format2 = FORMAT;
      }
    } else if (typeof format2 != "object") {
      throw Error(bignumberError + "Argument not an object: " + format2);
    }
    str = x.toFixed(dp, rm);
    if (x.c) {
      var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
      if (g2) {
        i = g1;
        g1 = g2;
        g2 = i;
        len -= i;
      }
      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = "-" + intPart;
      }
      str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(
        new RegExp("\\d{" + g2 + "}\\B", "g"),
        "$&" + (format2.fractionGroupSeparator || "")
      ) : fractionPart) : intPart;
    }
    return (format2.prefix || "") + str + (format2.suffix || "");
  };
  P.toFraction = function(md) {
    var d, d0, d1, d2, e2, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
    if (md != null) {
      n = new BigNumber2(md);
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
      }
    }
    if (!xc) return new BigNumber2(x);
    d = new BigNumber2(ONE);
    n1 = d0 = new BigNumber2(ONE);
    d1 = n0 = new BigNumber2(ONE);
    s = coeffToString(xc);
    e2 = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e2 % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? e2 > 0 ? d : n1 : n;
    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber2(s);
    n0.c[0] = 0;
    for (; ; ) {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }
    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e2 = e2 * 2;
    r = div(n1, d1, e2, ROUNDING_MODE).minus(x).abs().comparedTo(
      div(n0, d0, e2, ROUNDING_MODE).minus(x).abs()
    ) < 1 ? [n1, d1] : [n0, d0];
    MAX_EXP = exp;
    return r;
  };
  P.toNumber = function() {
    return +valueOf(this);
  };
  P.toPrecision = function(sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };
  P.toString = function(b) {
    var str, n = this, s = n.s, e2 = n.e;
    if (e2 === null) {
      if (s) {
        str = "Infinity";
        if (s < 0) str = "-" + str;
      } else {
        str = "NaN";
      }
    } else {
      if (b == null) {
        str = e2 <= TO_EXP_NEG || e2 >= TO_EXP_POS ? toExponential(coeffToString(n.c), e2) : toFixedPoint(coeffToString(n.c), e2, "0");
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber2(n), DECIMAL_PLACES + e2 + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, "0");
      } else {
        intCheck(b, 2, ALPHABET.length, "Base");
        str = convertBase(toFixedPoint(coeffToString(n.c), e2, "0"), 10, b, s, true);
      }
      if (s < 0 && n.c[0]) str = "-" + str;
    }
    return str;
  };
  P.valueOf = P.toJSON = function() {
    return valueOf(this);
  };
  P._isBigNumber = true;
  P[Symbol.toStringTag] = "BigNumber";
  P[Symbol.for("nodejs.util.inspect.custom")] = P.valueOf;
  if (configObject != null) BigNumber2.set(configObject);
  return BigNumber2;
}
function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}
function coeffToString(a) {
  var s, z, i = 1, j = a.length, r = a[0] + "";
  for (; i < j; ) {
    s = a[i++] + "";
    z = LOG_BASE - s.length;
    for (; z--; s = "0" + s) ;
    r += s;
  }
  for (j = r.length; r.charCodeAt(--j) === 48; ) ;
  return r.slice(0, j + 1 || 1);
}
function compare$1(x, y) {
  var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!i || !j) return null;
  a = xc && !xc[0];
  b = yc && !yc[0];
  if (a || b) return a ? b ? 0 : -j : i;
  if (i != j) return i;
  a = i < 0;
  b = k == l;
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
  if (!b) return k > l ^ a ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
  }
}
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e2) {
  return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e2 < 0 ? "e" : "e+") + e2;
}
function toFixedPoint(str, e2, z) {
  var len, zs;
  if (e2 < 0) {
    for (zs = z + "."; ++e2; zs += z) ;
    str = zs + str;
  } else {
    len = str.length;
    if (++e2 > len) {
      for (zs = z, e2 -= len; --e2; zs += z) ;
      str += zs;
    } else if (e2 < len) {
      str = str.slice(0, e2) + "." + str.slice(e2);
    }
  }
  return str;
}
var BigNumber = clone();
var __extends = /* @__PURE__ */ (function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var InvalidSchemeError = (
  /** @class */
  (function(_super) {
    __extends(InvalidSchemeError2, _super);
    function InvalidSchemeError2() {
      var _this = _super.call(this, "Invalid Scheme") || this;
      _this.name = "InvalidSchemeError";
      return _this;
    }
    return InvalidSchemeError2;
  })(Error)
);
var InvalidPathLengthError = (
  /** @class */
  (function(_super) {
    __extends(InvalidPathLengthError2, _super);
    function InvalidPathLengthError2() {
      var _this = _super.call(this, "Invalid Path") || this;
      _this.name = "InvalidPathLengthError";
      return _this;
    }
    return InvalidPathLengthError2;
  })(Error)
);
var InvalidTypeError = (
  /** @class */
  (function(_super) {
    __extends(InvalidTypeError2, _super);
    function InvalidTypeError2() {
      var _this = _super.call(this, "Invalid Type") || this;
      _this.name = "InvalidTypeError";
      return _this;
    }
    return InvalidTypeError2;
  })(Error)
);
var InvalidSequenceComponentError = (
  /** @class */
  (function(_super) {
    __extends(InvalidSequenceComponentError2, _super);
    function InvalidSequenceComponentError2() {
      var _this = _super.call(this, "Invalid Sequence Component") || this;
      _this.name = "InvalidSequenceComponentError";
      return _this;
    }
    return InvalidSequenceComponentError2;
  })(Error)
);
var InvalidChecksumError = (
  /** @class */
  (function(_super) {
    __extends(InvalidChecksumError2, _super);
    function InvalidChecksumError2() {
      var _this = _super.call(this, "Invalid Checksum") || this;
      _this.name = "InvalidChecksumError";
      return _this;
    }
    return InvalidChecksumError2;
  })(Error)
);
var CRC_TABLE = (function() {
  var c;
  var crcTable = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
})();
var crc32 = function(message) {
  var crc = 0 ^ -1;
  for (var i = 0; i < message.length; i++) {
    crc = crc >>> 8 ^ CRC_TABLE[(crc ^ message[i]) & 255];
  }
  return (crc ^ -1) >>> 0;
};
var sha256Hash = function(data) {
  return bufferExports.Buffer.from(sha256(data));
};
var partition = function(s, n) {
  return s.match(new RegExp(".{1," + n + "}", "g")) || [s];
};
var split = function(s, length) {
  return [s.slice(0, -length), s.slice(-length)];
};
var getCRC = function(message) {
  return crc32(message);
};
var getCRCHex = function(message) {
  return crc32(message).toString(16).padStart(8, "0");
};
var toUint32 = function(number) {
  return number >>> 0;
};
var intToBytes = function(num) {
  var arr = new ArrayBuffer(4);
  var view = new DataView(arr);
  view.setUint32(0, num, false);
  return bufferExports.Buffer.from(arr);
};
var isURType = function(type) {
  return type.split("").every(function(_, index2) {
    var c = type.charCodeAt(index2);
    if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0))
      return true;
    if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0))
      return true;
    if (c === "-".charCodeAt(0))
      return true;
    return false;
  });
};
var arraysEqual = function(ar1, ar2) {
  if (ar1.length !== ar2.length) {
    return false;
  }
  return ar1.every(function(el) {
    return ar2.includes(el);
  });
};
var arrayContains = function(ar1, ar2) {
  return ar2.every(function(v) {
    return ar1.includes(v);
  });
};
var setDifference = function(ar1, ar2) {
  return ar1.filter(function(x) {
    return ar2.indexOf(x) < 0;
  });
};
var bufferXOR = function(a, b) {
  var length = Math.max(a.length, b.length);
  var buffer2 = bufferExports.Buffer.allocUnsafe(length);
  for (var i = 0; i < length; ++i) {
    buffer2[i] = a[i] ^ b[i];
  }
  return buffer2;
};
const typeofs = [
  "string",
  "number",
  "bigint",
  "symbol"
];
const objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "HTMLElement",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function is(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer$1(value)) {
    return "Buffer";
  }
  const objectType = getObjectType(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer$1(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}
class Type {
  /**
   * @param {number} major
   * @param {string} name
   * @param {boolean} terminal
   */
  constructor(major, name, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name;
    this.terminal = terminal;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
  }
}
Type.uint = new Type(0, "uint", true);
Type.negint = new Type(1, "negint", true);
Type.bytes = new Type(2, "bytes", true);
Type.string = new Type(3, "string", true);
Type.array = new Type(4, "array", false);
Type.map = new Type(5, "map", false);
Type.tag = new Type(6, "tag", false);
Type.float = new Type(7, "float", true);
Type.false = new Type(7, "false", true);
Type.true = new Type(7, "true", true);
Type.null = new Type(7, "null", true);
Type.undefined = new Type(7, "undefined", true);
Type.break = new Type(7, "break", true);
class Token {
  /**
   * @param {Type} type
   * @param {any} [value]
   * @param {number} [encodedLength]
   */
  constructor(type, value, encodedLength) {
    this.type = type;
    this.value = value;
    this.encodedLength = encodedLength;
    this.encodedBytes = void 0;
    this.byteValue = void 0;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
}
const useBuffer = globalThis.process && // @ts-ignore
!globalThis.process.browser && // @ts-ignore
globalThis.Buffer && // @ts-ignore
typeof globalThis.Buffer.isBuffer === "function";
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function isBuffer(buf2) {
  return useBuffer && globalThis.Buffer.isBuffer(buf2);
}
function asU8A(buf2) {
  if (!(buf2 instanceof Uint8Array)) {
    return Uint8Array.from(buf2);
  }
  return isBuffer(buf2) ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength) : buf2;
}
const toString = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  ((bytes, start, end) => {
    return end - start > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(bytes.subarray(start, end)).toString("utf8")
    ) : utf8Slice(bytes, start, end);
  })
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  ((bytes, start, end) => {
    return end - start > 64 ? textDecoder.decode(bytes.subarray(start, end)) : utf8Slice(bytes, start, end);
  })
);
const fromString = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  ((string) => {
    return string.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string)
    ) : utf8ToBytes(string);
  })
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  ((string) => {
    return string.length > 64 ? textEncoder.encode(string) : utf8ToBytes(string);
  })
);
const fromArray = (arr) => {
  return Uint8Array.from(arr);
};
const slice = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  ((bytes, start, end) => {
    if (isBuffer(bytes)) {
      return new Uint8Array(bytes.subarray(start, end));
    }
    return bytes.slice(start, end);
  })
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  ((bytes, start, end) => {
    return bytes.slice(start, end);
  })
);
const concat = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  ((chunks, length) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A(globalThis.Buffer.concat(chunks, length));
  })
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  ((chunks, length) => {
    const out = new Uint8Array(length);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  })
);
const alloc = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  ((size) => {
    return globalThis.Buffer.allocUnsafe(size);
  })
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  ((size) => {
    return new Uint8Array(size);
  })
);
function compare(b1, b2) {
  if (isBuffer(b1) && isBuffer(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}
function utf8Slice(buf2, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf2[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf2[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          fourthByte = buf2[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
const MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
const defaultChunkSize = 256;
class Bl {
  /**
   * @param {number} [chunkSize]
   */
  constructor(chunkSize = defaultChunkSize) {
    this.chunkSize = chunkSize;
    this.cursor = 0;
    this.maxCursor = -1;
    this.chunks = [];
    this._initReuseChunk = null;
  }
  reset() {
    this.cursor = 0;
    this.maxCursor = -1;
    if (this.chunks.length) {
      this.chunks = [];
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk);
      this.maxCursor = this._initReuseChunk.length - 1;
    }
  }
  /**
   * @param {Uint8Array|number[]} bytes
   */
  push(bytes) {
    let topChunk = this.chunks[this.chunks.length - 1];
    const newMax = this.cursor + bytes.length;
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
      topChunk.set(bytes, chunkPos);
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
          this.maxCursor = this.cursor - 1;
        }
      }
      if (bytes.length < 64 && bytes.length < this.chunkSize) {
        topChunk = alloc(this.chunkSize);
        this.chunks.push(topChunk);
        this.maxCursor += topChunk.length;
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk;
        }
        topChunk.set(bytes, 0);
      } else {
        this.chunks.push(bytes);
        this.maxCursor += bytes.length;
      }
    }
    this.cursor += bytes.length;
  }
  /**
   * @param {boolean} [reset]
   * @returns {Uint8Array}
   */
  toBytes(reset = false) {
    let byts;
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0];
      if (reset && this.cursor > chunk.length / 2) {
        byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
        this._initReuseChunk = null;
        this.chunks = [];
      } else {
        byts = slice(chunk, 0, this.cursor);
      }
    } else {
      byts = concat(this.chunks, this.cursor);
    }
    if (reset) {
      this.reset();
    }
    return byts;
  }
}
const decodeErrPrefix = "CBOR decode error:";
const encodeErrPrefix = "CBOR encode error:";
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`);
  }
}
const uintBoundaries = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
function encodeUint(buf2, token) {
  return encodeUintValue(buf2, 0, token.value);
}
function encodeUintValue(buf2, major, uint) {
  if (uint < uintBoundaries[0]) {
    const nuint = Number(uint);
    buf2.push([major | nuint]);
  } else if (uint < uintBoundaries[1]) {
    const nuint = Number(uint);
    buf2.push([major | 24, nuint]);
  } else if (uint < uintBoundaries[2]) {
    const nuint = Number(uint);
    buf2.push([major | 25, nuint >>> 8, nuint & 255]);
  } else if (uint < uintBoundaries[3]) {
    const nuint = Number(uint);
    buf2.push([major | 26, nuint >>> 24 & 255, nuint >>> 16 & 255, nuint >>> 8 & 255, nuint & 255]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries[4]) {
      const set2 = [major | 27, 0, 0, 0, 0, 0, 0, 0];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set2[8] = lo & 255;
      lo = lo >> 8;
      set2[7] = lo & 255;
      lo = lo >> 8;
      set2[6] = lo & 255;
      lo = lo >> 8;
      set2[5] = lo & 255;
      set2[4] = hi & 255;
      hi = hi >> 8;
      set2[3] = hi & 255;
      hi = hi >> 8;
      set2[2] = hi & 255;
      hi = hi >> 8;
      set2[1] = hi & 255;
      buf2.push(set2);
    } else {
      throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
    }
  }
}
encodeUint.encodedSize = function encodedSize(token) {
  return encodeUintValue.encodedSize(token.value);
};
encodeUintValue.encodedSize = function encodedSize2(uint) {
  if (uint < uintBoundaries[0]) {
    return 1;
  }
  if (uint < uintBoundaries[1]) {
    return 2;
  }
  if (uint < uintBoundaries[2]) {
    return 3;
  }
  if (uint < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : (
    /* c8 ignore next */
    0
  );
};
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
const neg1b = BigInt(-1);
const pos1b = BigInt(1);
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9);
}
function encodeNegint(buf2, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  encodeUintValue(buf2, token.type.majorEncoded, unsigned);
}
encodeNegint.encodedSize = function encodedSize3(token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  if (unsigned < uintBoundaries[0]) {
    return 1;
  }
  if (unsigned < uintBoundaries[1]) {
    return 2;
  }
  if (unsigned < uintBoundaries[2]) {
    return 3;
  }
  if (unsigned < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : (
    /* c8 ignore next */
    0
  );
};
function toToken$3(data, pos, prefix, length) {
  assertEnoughData(data, pos, prefix + length);
  const buf2 = slice(data, pos + prefix, pos + prefix + length);
  return new Token(Type.bytes, buf2, prefix + length);
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken$3(data, pos, 1, minor);
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken$3(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken$3(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken$3(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeBytes64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
  }
  return toToken$3(data, pos, 9, l);
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type.string ? fromString(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes(buf2, token) {
  const bytes = tokenBytes(token);
  encodeUintValue(buf2, token.type.majorEncoded, bytes.length);
  buf2.push(bytes);
}
encodeBytes.encodedSize = function encodedSize4(token) {
  const bytes = tokenBytes(token);
  return encodeUintValue.encodedSize(bytes.length) + bytes.length;
};
encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
  return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
};
function compareBytes(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}
function toToken$2(data, pos, prefix, length, options) {
  const totLength = prefix + length;
  assertEnoughData(data, pos, totLength);
  const tok = new Token(Type.string, toString(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken$2(data, pos, 1, minor, options);
}
function decodeString8(data, pos, _minor, options) {
  return toToken$2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
function decodeString16(data, pos, _minor, options) {
  return toToken$2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
function decodeString32(data, pos, _minor, options) {
  return toToken$2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
function decodeString64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
  }
  return toToken$2(data, pos, 9, l, options);
}
const encodeString = encodeBytes;
function toToken$1(_data, _pos, prefix, length) {
  return new Token(Type.array, length, prefix);
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken$1(data, pos, 1, minor);
}
function decodeArray8(data, pos, _minor, options) {
  return toToken$1(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeArray16(data, pos, _minor, options) {
  return toToken$1(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeArray32(data, pos, _minor, options) {
  return toToken$1(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeArray64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
  }
  return toToken$1(data, pos, 9, l);
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken$1(data, pos, 1, Infinity);
}
function encodeArray(buf2, token) {
  encodeUintValue(buf2, Type.array.majorEncoded, token.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
encodeArray.encodedSize = function encodedSize5(token) {
  return encodeUintValue.encodedSize(token.value);
};
function toToken(_data, _pos, prefix, length) {
  return new Token(Type.map, length, prefix);
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor);
}
function decodeMap8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeMap16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeMap32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeMap64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
  }
  return toToken(data, pos, 9, l);
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken(data, pos, 1, Infinity);
}
function encodeMap(buf2, token) {
  encodeUintValue(buf2, Type.map.majorEncoded, token.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
encodeMap.encodedSize = function encodedSize6(token) {
  return encodeUintValue.encodedSize(token.value);
};
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1);
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
function encodeTag(buf2, token) {
  encodeUintValue(buf2, Type.tag.majorEncoded, token.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
encodeTag.encodedSize = function encodedSize7(token) {
  return encodeUintValue.encodedSize(token.value);
};
const MINOR_FALSE = 20;
const MINOR_TRUE = 21;
const MINOR_NULL = 22;
const MINOR_UNDEFINED = 23;
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1);
  }
  return new Token(Type.undefined, void 0, 1);
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return new Token(Type.break, void 0, 1);
}
function createToken(value, bytes, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
    }
  }
  return new Token(Type.float, value, bytes);
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options);
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options);
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options);
}
function encodeFloat(buf2, token, options) {
  const float = token.value;
  if (float === false) {
    buf2.push([Type.float.majorEncoded | MINOR_FALSE]);
  } else if (float === true) {
    buf2.push([Type.float.majorEncoded | MINOR_TRUE]);
  } else if (float === null) {
    buf2.push([Type.float.majorEncoded | MINOR_NULL]);
  } else if (float === void 0) {
    buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat16(float);
      decoded = readFloat16(ui8a, 1);
      if (float === decoded || Number.isNaN(float)) {
        ui8a[0] = 249;
        buf2.push(ui8a.slice(0, 3));
        success = true;
      } else {
        encodeFloat32(float);
        decoded = readFloat32(ui8a, 1);
        if (float === decoded) {
          ui8a[0] = 250;
          buf2.push(ui8a.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat64(float);
      decoded = readFloat64(ui8a, 1);
      ui8a[0] = 251;
      buf2.push(ui8a.slice(0, 9));
    }
  }
}
encodeFloat.encodedSize = function encodedSize8(token, options) {
  const float = token.value;
  if (float === false || float === true || float === null || float === void 0) {
    return 1;
  }
  if (!options || options.float64 !== true) {
    encodeFloat16(float);
    let decoded = readFloat16(ui8a, 1);
    if (float === decoded || Number.isNaN(float)) {
      return 3;
    }
    encodeFloat32(float);
    decoded = readFloat32(ui8a, 1);
    if (float === decoded) {
      return 5;
    }
  }
  return 9;
};
const buffer = new ArrayBuffer(9);
const dataView = new DataView(buffer, 1);
const ui8a = new Uint8Array(buffer, 0);
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false);
  } else {
    dataView.setFloat32(0, inp);
    const valu32 = dataView.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | /* sign bit */
        1 << 24 + logicalExponent, false);
      } else {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat16(ui8a2, pos) {
  if (ui8a2.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  }
  const half = (ui8a2[pos] << 8) + ui8a2[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false);
}
function readFloat32(ui8a2, pos) {
  if (ui8a2.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false);
}
function readFloat64(ui8a2, pos) {
  if (ui8a2.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false);
}
encodeFloat.compareTokens = encodeUint.compareTokens;
function invalidMinor(data, pos, minor) {
  throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`);
  };
}
const jump = [];
for (let i = 0; i <= 23; i++) {
  jump[i] = invalidMinor;
}
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let i = 32; i <= 55; i++) {
  jump[i] = invalidMinor;
}
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let i = 64; i <= 87; i++) {
  jump[i] = decodeBytesCompact;
}
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) {
  jump[i] = decodeStringCompact;
}
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) {
  jump[i] = decodeArrayCompact;
}
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let i = 160; i <= 183; i++) {
  jump[i] = decodeMapCompact;
}
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let i = 192; i <= 215; i++) {
  jump[i] = decodeTagCompact;
}
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let i = 224; i <= 243; i++) {
  jump[i] = errorer("simple values are not supported");
}
jump[244] = invalidMinor;
jump[245] = invalidMinor;
jump[246] = invalidMinor;
jump[247] = decodeUndefined;
jump[248] = errorer("simple values are not supported");
jump[249] = decodeFloat16;
jump[250] = decodeFloat32;
jump[251] = decodeFloat64;
jump[252] = invalidMinor;
jump[253] = invalidMinor;
jump[254] = invalidMinor;
jump[255] = decodeBreak;
const quick = [];
for (let i = 0; i < 24; i++) {
  quick[i] = new Token(Type.uint, i, 1);
}
for (let i = -1; i >= -24; i--) {
  quick[31 - i] = new Token(Type.negint, i, 1);
}
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
quick[96] = new Token(Type.string, "", 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, false, 1);
quick[245] = new Token(Type.true, true, 1);
quick[246] = new Token(Type.null, null, 1);
function quickEncodeToken(token) {
  switch (token.type) {
    case Type.false:
      return fromArray([244]);
    case Type.true:
      return fromArray([245]);
    case Type.null:
      return fromArray([246]);
    case Type.bytes:
      if (!token.value.length) {
        return fromArray([64]);
      }
      return;
    case Type.string:
      if (token.value === "") {
        return fromArray([96]);
      }
      return;
    case Type.array:
      if (token.value === 0) {
        return fromArray([128]);
      }
      return;
    case Type.map:
      if (token.value === 0) {
        return fromArray([160]);
      }
      return;
    case Type.uint:
      if (token.value < 24) {
        return fromArray([Number(token.value)]);
      }
      return;
    case Type.negint:
      if (token.value >= -24) {
        return fromArray([31 - Number(token.value)]);
      }
  }
}
const defaultEncodeOptions = {
  float64: false,
  mapSorter,
  quickEncodeToken
};
function makeCborEncoders() {
  const encoders = [];
  encoders[Type.uint.major] = encodeUint;
  encoders[Type.negint.major] = encodeNegint;
  encoders[Type.bytes.major] = encodeBytes;
  encoders[Type.string.major] = encodeString;
  encoders[Type.array.major] = encodeArray;
  encoders[Type.map.major] = encodeMap;
  encoders[Type.tag.major] = encodeTag;
  encoders[Type.float.major] = encodeFloat;
  return encoders;
}
const cborEncoders = makeCborEncoders();
const buf = new Bl();
class Ref {
  /**
   * @param {object|any[]} obj
   * @param {Reference|undefined} parent
   */
  constructor(obj, parent) {
    this.obj = obj;
    this.parent = parent;
  }
  /**
   * @param {object|any[]} obj
   * @returns {boolean}
   */
  includes(obj) {
    let p = this;
    do {
      if (p.obj === obj) {
        return true;
      }
    } while (p = p.parent);
    return false;
  }
  /**
   * @param {Reference|undefined} stack
   * @param {object|any[]} obj
   * @returns {Reference}
   */
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix} object contains circular references`);
    }
    return new Ref(obj, stack);
  }
}
const simpleTokens = {
  null: new Token(Type.null, null),
  undefined: new Token(Type.undefined, void 0),
  true: new Token(Type.true, true),
  false: new Token(Type.false, false),
  emptyArray: new Token(Type.array, 0),
  emptyMap: new Token(Type.map, 0)
};
const typeEncoders = {
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token(Type.float, obj);
    } else if (obj >= 0) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  string(obj, _typ, _options, _refStack) {
    return new Token(Type.string, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens.true : simpleTokens.false;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens.null;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens.undefined;
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  DataView(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyArray, new Token(Type.break)];
      }
      return simpleTokens.emptyArray;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const e2 of obj) {
      entries[i++] = objectToTokens(e2, options, refStack);
    }
    if (options.addBreakTokens) {
      return [new Token(Type.array, obj.length), entries, new Token(Type.break)];
    }
    return [new Token(Type.array, obj.length), entries];
  },
  /**
   * @param {any} obj
   * @param {string} typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Object(obj, typ, options, refStack) {
    const isMap = typ !== "Object";
    const keys = isMap ? obj.keys() : Object.keys(obj);
    const length = isMap ? obj.size : keys.length;
    if (!length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyMap, new Token(Type.break)];
      }
      return simpleTokens.emptyMap;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const key of keys) {
      entries[i++] = [
        objectToTokens(key, options, refStack),
        objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
      ];
    }
    sortMapEntries(entries, options);
    if (options.addBreakTokens) {
      return [new Token(Type.map, length), entries, new Token(Type.break)];
    }
    return [new Token(Type.map, length), entries];
  }
};
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
  typeEncoders[`${typ}Array`] = typeEncoders.DataView;
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj);
  const customTypeEncoder = options && options.typeEncoders && /** @type {OptionalTypeEncoder} */
  options.typeEncoders[typ] || typeEncoders[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter);
  }
}
function mapSorter(e1, e2) {
  const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
  const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
  if (keyToken1.type !== keyToken2.type) {
    return keyToken1.type.compare(keyToken2.type);
  }
  const major = keyToken1.type.major;
  const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2);
  if (tcmp === 0) {
    console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
  }
  return tcmp;
}
function tokensToEncoded(buf2, tokens, encoders, options) {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      tokensToEncoded(buf2, token, encoders, options);
    }
  } else {
    encoders[tokens.type.major](buf2, tokens, options);
  }
}
function encodeCustom(data, encoders, options) {
  const tokens = objectToTokens(data, options);
  if (!Array.isArray(tokens) && options.quickEncodeToken) {
    const quickBytes = options.quickEncodeToken(tokens);
    if (quickBytes) {
      return quickBytes;
    }
    const encoder = encoders[tokens.type.major];
    if (encoder.encodedSize) {
      const size = encoder.encodedSize(tokens, options);
      const buf2 = new Bl(size);
      encoder(buf2, tokens, options);
      if (buf2.chunks.length !== 1) {
        throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
      }
      return asU8A(buf2.chunks[0]);
    }
  }
  buf.reset();
  tokensToEncoded(buf, tokens, encoders, options);
  return buf.toBytes(true);
}
function encode$2(data, options) {
  options = Object.assign({}, defaultEncodeOptions, options);
  return encodeCustom(data, cborEncoders, options);
}
const defaultDecodeOptions = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true
};
class Tokeniser {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const byt = this.data[this._pos];
    let token = quick[byt];
    if (token === void 0) {
      const decoder = jump[byt];
      if (!decoder) {
        throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
      }
      const minor = byt & 31;
      token = decoder(this.data, this._pos, minor, this.options);
    }
    this._pos += token.encodedLength;
    return token;
  }
}
const DONE = Symbol.for("DONE");
const BREAK = Symbol.for("BREAK");
function tokenToArray(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options);
    if (value === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
    }
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options);
    if (key === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
    }
    if (key === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject(tokeniser, options);
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE;
  }
  const token = tokeniser.next();
  if (token.type === Type.break) {
    return BREAK;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options);
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options);
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decodeFirst(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions, options);
  const tokeniser = options.tokenizer || new Tokeniser(data, options);
  const decoded = tokensToObject(tokeniser, options);
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`);
  }
  return [decoded, data.subarray(tokeniser.pos())];
}
function decode$1(data, options) {
  const [decoded, remainder] = decodeFirst(data, options);
  if (remainder.length > 0) {
    throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
  }
  return decoded;
}
var cborEncode = function(data) {
  return bufferExports.Buffer.from(encode$2(data));
};
var cborDecode = function(data) {
  return decode$1(bufferExports.Buffer.isBuffer(data) ? data : bufferExports.Buffer.from(data, "hex"));
};
var UR = (
  /** @class */
  (function() {
    function UR2(_cborPayload, _type) {
      if (_type === void 0) {
        _type = "bytes";
      }
      this._cborPayload = _cborPayload;
      this._type = _type;
      if (!isURType(this._type)) {
        throw new InvalidTypeError();
      }
    }
    UR2.fromBuffer = function(buf2) {
      return new UR2(cborEncode(buf2));
    };
    UR2.from = function(value) {
      return UR2.fromBuffer(bufferExports.Buffer.from(value));
    };
    UR2.prototype.decodeCBOR = function() {
      return cborDecode(this._cborPayload);
    };
    Object.defineProperty(UR2.prototype, "type", {
      get: function() {
        return this._type;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(UR2.prototype, "cbor", {
      get: function() {
        return this._cborPayload;
      },
      enumerable: false,
      configurable: true
    });
    UR2.prototype.equals = function(ur2) {
      return this.type === ur2.type && this.cbor.equals(ur2.cbor);
    };
    return UR2;
  })()
);
class JSBI extends Array {
  constructor(a, b) {
    if (a > JSBI.__kMaxLength) throw new RangeError("Maximum BigInt size exceeded");
    super(a), this.sign = b;
  }
  static BigInt(a) {
    var b = Math.floor, c = Number.isFinite;
    if ("number" == typeof a) {
      if (0 === a) return JSBI.__zero();
      if ((0 | a) === a) return 0 > a ? JSBI.__oneDigit(-a, true) : JSBI.__oneDigit(a, false);
      if (!c(a) || b(a) !== a) throw new RangeError("The number " + a + " cannot be converted to BigInt because it is not an integer");
      return JSBI.__fromDouble(a);
    }
    if ("string" == typeof a) {
      const b2 = JSBI.__fromString(a);
      if (null === b2) throw new SyntaxError("Cannot convert " + a + " to a BigInt");
      return b2;
    }
    if ("boolean" == typeof a) return true === a ? JSBI.__oneDigit(1, false) : JSBI.__zero();
    if ("object" == typeof a) {
      if (a.constructor === JSBI) return a;
      const b2 = JSBI.__toPrimitive(a);
      return JSBI.BigInt(b2);
    }
    throw new TypeError("Cannot convert " + a + " to a BigInt");
  }
  toDebugString() {
    const a = ["BigInt["];
    for (const b of this) a.push((b ? (b >>> 0).toString(16) : b) + ", ");
    return a.push("]"), a.join("");
  }
  toString(a = 10) {
    if (2 > a || 36 < a) throw new RangeError("toString() radix argument must be between 2 and 36");
    return 0 === this.length ? "0" : 0 == (a & a - 1) ? JSBI.__toStringBasePowerOfTwo(this, a) : JSBI.__toStringGeneric(this, a, false);
  }
  static toNumber(a) {
    const b = a.length;
    if (0 === b) return 0;
    if (1 === b) {
      const b2 = a.__unsignedDigit(0);
      return a.sign ? -b2 : b2;
    }
    const c = a.__digit(b - 1), d = JSBI.__clz32(c), e2 = 32 * b - d;
    if (1024 < e2) return a.sign ? -Infinity : 1 / 0;
    let f = e2 - 1, g = c, h = b - 1;
    const i = d + 1;
    let j = 32 === i ? 0 : g << i;
    j >>>= 12;
    const k = i - 12;
    let l = 12 <= i ? 0 : g << 20 + i, m = 20 + i;
    0 < k && 0 < h && (h--, g = a.__digit(h), j |= g >>> 32 - k, l = g << k, m = k), 0 < m && 0 < h && (h--, g = a.__digit(h), l |= g >>> 32 - m, m -= 32);
    const n = JSBI.__decideRounding(a, m, h, g);
    if ((1 === n || 0 === n && 1 == (1 & l)) && (l = l + 1 >>> 0, 0 === l && (j++, 0 != j >>> 20 && (j = 0, f++, 1023 < f)))) return a.sign ? -Infinity : 1 / 0;
    const o = a.sign ? -2147483648 : 0;
    return f = f + 1023 << 20, JSBI.__kBitConversionInts[1] = o | f | j, JSBI.__kBitConversionInts[0] = l, JSBI.__kBitConversionDouble[0];
  }
  static unaryMinus(a) {
    if (0 === a.length) return a;
    const b = a.__copy();
    return b.sign = !a.sign, b;
  }
  static bitwiseNot(a) {
    return a.sign ? JSBI.__absoluteSubOne(a).__trim() : JSBI.__absoluteAddOne(a, true);
  }
  static exponentiate(a, b) {
    if (b.sign) throw new RangeError("Exponent must be positive");
    if (0 === b.length) return JSBI.__oneDigit(1, false);
    if (0 === a.length) return a;
    if (1 === a.length && 1 === a.__digit(0)) return a.sign && 0 == (1 & b.__digit(0)) ? JSBI.unaryMinus(a) : a;
    if (1 < b.length) throw new RangeError("BigInt too big");
    let c = b.__unsignedDigit(0);
    if (1 === c) return a;
    if (c >= JSBI.__kMaxLengthBits) throw new RangeError("BigInt too big");
    if (1 === a.length && 2 === a.__digit(0)) {
      const b2 = 1 + (c >>> 5), d2 = a.sign && 0 != (1 & c), e3 = new JSBI(b2, d2);
      e3.__initializeDigits();
      const f = 1 << (31 & c);
      return e3.__setDigit(b2 - 1, f), e3;
    }
    let d = null, e2 = a;
    for (0 != (1 & c) && (d = a), c >>= 1; 0 !== c; c >>= 1) e2 = JSBI.multiply(e2, e2), 0 != (1 & c) && (null === d ? d = e2 : d = JSBI.multiply(d, e2));
    return d;
  }
  static multiply(a, b) {
    if (0 === a.length) return a;
    if (0 === b.length) return b;
    let c = a.length + b.length;
    32 <= a.__clzmsd() + b.__clzmsd() && c--;
    const d = new JSBI(c, a.sign !== b.sign);
    d.__initializeDigits();
    for (let c2 = 0; c2 < a.length; c2++) JSBI.__multiplyAccumulate(b, a.__digit(c2), d, c2);
    return d.__trim();
  }
  static divide(a, b) {
    if (0 === b.length) throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(a, b)) return JSBI.__zero();
    const c = a.sign !== b.sign, d = b.__unsignedDigit(0);
    let e2;
    if (1 === b.length && 65535 >= d) {
      if (1 === d) return c === a.sign ? a : JSBI.unaryMinus(a);
      e2 = JSBI.__absoluteDivSmall(a, d, null);
    } else e2 = JSBI.__absoluteDivLarge(a, b, true, false);
    return e2.sign = c, e2.__trim();
  }
  static remainder(a, b) {
    if (0 === b.length) throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(a, b)) return a;
    const c = b.__unsignedDigit(0);
    if (1 === b.length && 65535 >= c) {
      if (1 === c) return JSBI.__zero();
      const b2 = JSBI.__absoluteModSmall(a, c);
      return 0 === b2 ? JSBI.__zero() : JSBI.__oneDigit(b2, a.sign);
    }
    const d = JSBI.__absoluteDivLarge(a, b, false, true);
    return d.sign = a.sign, d.__trim();
  }
  static add(a, b) {
    const c = a.sign;
    return c === b.sign ? JSBI.__absoluteAdd(a, b, c) : 0 <= JSBI.__absoluteCompare(a, b) ? JSBI.__absoluteSub(a, b, c) : JSBI.__absoluteSub(b, a, !c);
  }
  static subtract(a, b) {
    const c = a.sign;
    return c === b.sign ? 0 <= JSBI.__absoluteCompare(a, b) ? JSBI.__absoluteSub(a, b, c) : JSBI.__absoluteSub(b, a, !c) : JSBI.__absoluteAdd(a, b, c);
  }
  static leftShift(a, b) {
    return 0 === b.length || 0 === a.length ? a : b.sign ? JSBI.__rightShiftByAbsolute(a, b) : JSBI.__leftShiftByAbsolute(a, b);
  }
  static signedRightShift(a, b) {
    return 0 === b.length || 0 === a.length ? a : b.sign ? JSBI.__leftShiftByAbsolute(a, b) : JSBI.__rightShiftByAbsolute(a, b);
  }
  static unsignedRightShift() {
    throw new TypeError("BigInts have no unsigned right shift; use >> instead");
  }
  static lessThan(a, b) {
    return 0 > JSBI.__compareToBigInt(a, b);
  }
  static lessThanOrEqual(a, b) {
    return 0 >= JSBI.__compareToBigInt(a, b);
  }
  static greaterThan(a, b) {
    return 0 < JSBI.__compareToBigInt(a, b);
  }
  static greaterThanOrEqual(a, b) {
    return 0 <= JSBI.__compareToBigInt(a, b);
  }
  static equal(a, b) {
    if (a.sign !== b.sign) return false;
    if (a.length !== b.length) return false;
    for (let c = 0; c < a.length; c++) if (a.__digit(c) !== b.__digit(c)) return false;
    return true;
  }
  static notEqual(a, b) {
    return !JSBI.equal(a, b);
  }
  static bitwiseAnd(a, b) {
    var c = Math.max;
    if (!a.sign && !b.sign) return JSBI.__absoluteAnd(a, b).__trim();
    if (a.sign && b.sign) {
      const d = c(a.length, b.length) + 1;
      let e2 = JSBI.__absoluteSubOne(a, d);
      const f = JSBI.__absoluteSubOne(b);
      return e2 = JSBI.__absoluteOr(e2, f, e2), JSBI.__absoluteAddOne(e2, true, e2).__trim();
    }
    return a.sign && ([a, b] = [b, a]), JSBI.__absoluteAndNot(a, JSBI.__absoluteSubOne(b)).__trim();
  }
  static bitwiseXor(a, b) {
    var c = Math.max;
    if (!a.sign && !b.sign) return JSBI.__absoluteXor(a, b).__trim();
    if (a.sign && b.sign) {
      const d2 = c(a.length, b.length), e3 = JSBI.__absoluteSubOne(a, d2), f = JSBI.__absoluteSubOne(b);
      return JSBI.__absoluteXor(e3, f, e3).__trim();
    }
    const d = c(a.length, b.length) + 1;
    a.sign && ([a, b] = [b, a]);
    let e2 = JSBI.__absoluteSubOne(b, d);
    return e2 = JSBI.__absoluteXor(e2, a, e2), JSBI.__absoluteAddOne(e2, true, e2).__trim();
  }
  static bitwiseOr(a, b) {
    var c = Math.max;
    const d = c(a.length, b.length);
    if (!a.sign && !b.sign) return JSBI.__absoluteOr(a, b).__trim();
    if (a.sign && b.sign) {
      let c2 = JSBI.__absoluteSubOne(a, d);
      const e3 = JSBI.__absoluteSubOne(b);
      return c2 = JSBI.__absoluteAnd(c2, e3, c2), JSBI.__absoluteAddOne(c2, true, c2).__trim();
    }
    a.sign && ([a, b] = [b, a]);
    let e2 = JSBI.__absoluteSubOne(b, d);
    return e2 = JSBI.__absoluteAndNot(e2, a, e2), JSBI.__absoluteAddOne(e2, true, e2).__trim();
  }
  static asIntN(a, b) {
    if (0 === b.length) return b;
    if (0 === a) return JSBI.__zero();
    if (a >= JSBI.__kMaxLengthBits) return b;
    const c = a + 31 >>> 5;
    if (b.length < c) return b;
    const d = b.__unsignedDigit(c - 1), e2 = 1 << (31 & a - 1);
    if (b.length === c && d < e2) return b;
    if (!((d & e2) === e2)) return JSBI.__truncateToNBits(a, b);
    if (!b.sign) return JSBI.__truncateAndSubFromPowerOfTwo(a, b, true);
    if (0 == (d & e2 - 1)) {
      for (let d2 = c - 2; 0 <= d2; d2--) if (0 !== b.__digit(d2)) return JSBI.__truncateAndSubFromPowerOfTwo(a, b, false);
      return b.length === c && d === e2 ? b : JSBI.__truncateToNBits(a, b);
    }
    return JSBI.__truncateAndSubFromPowerOfTwo(a, b, false);
  }
  static asUintN(a, b) {
    if (0 === b.length) return b;
    if (0 === a) return JSBI.__zero();
    if (b.sign) {
      if (a > JSBI.__kMaxLengthBits) throw new RangeError("BigInt too big");
      return JSBI.__truncateAndSubFromPowerOfTwo(a, b, false);
    }
    if (a >= JSBI.__kMaxLengthBits) return b;
    const c = a + 31 >>> 5;
    if (b.length < c) return b;
    const d = 31 & a;
    if (b.length == c) {
      if (0 === d) return b;
      const a2 = b.__digit(c - 1);
      if (0 == a2 >>> d) return b;
    }
    return JSBI.__truncateToNBits(a, b);
  }
  static ADD(a, b) {
    if (a = JSBI.__toPrimitive(a), b = JSBI.__toPrimitive(b), "string" == typeof a) return "string" != typeof b && (b = b.toString()), a + b;
    if ("string" == typeof b) return a.toString() + b;
    if (a = JSBI.__toNumeric(a), b = JSBI.__toNumeric(b), JSBI.__isBigInt(a) && JSBI.__isBigInt(b)) return JSBI.add(a, b);
    if ("number" == typeof a && "number" == typeof b) return a + b;
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
  static LT(a, b) {
    return JSBI.__compare(a, b, 0);
  }
  static LE(a, b) {
    return JSBI.__compare(a, b, 1);
  }
  static GT(a, b) {
    return JSBI.__compare(a, b, 2);
  }
  static GE(a, b) {
    return JSBI.__compare(a, b, 3);
  }
  static EQ(a, b) {
    for (; ; ) {
      if (JSBI.__isBigInt(a)) return JSBI.__isBigInt(b) ? JSBI.equal(a, b) : JSBI.EQ(b, a);
      if ("number" == typeof a) {
        if (JSBI.__isBigInt(b)) return JSBI.__equalToNumber(b, a);
        if ("object" != typeof b) return a == b;
        b = JSBI.__toPrimitive(b);
      } else if ("string" == typeof a) {
        if (JSBI.__isBigInt(b)) return a = JSBI.__fromString(a), null !== a && JSBI.equal(a, b);
        if ("object" != typeof b) return a == b;
        b = JSBI.__toPrimitive(b);
      } else if ("boolean" == typeof a) {
        if (JSBI.__isBigInt(b)) return JSBI.__equalToNumber(b, +a);
        if ("object" != typeof b) return a == b;
        b = JSBI.__toPrimitive(b);
      } else if ("symbol" == typeof a) {
        if (JSBI.__isBigInt(b)) return false;
        if ("object" != typeof b) return a == b;
        b = JSBI.__toPrimitive(b);
      } else if ("object" == typeof a) {
        if ("object" == typeof b && b.constructor !== JSBI) return a == b;
        a = JSBI.__toPrimitive(a);
      } else return a == b;
    }
  }
  static NE(a, b) {
    return !JSBI.EQ(a, b);
  }
  static __zero() {
    return new JSBI(0, false);
  }
  static __oneDigit(a, b) {
    const c = new JSBI(1, b);
    return c.__setDigit(0, a), c;
  }
  __copy() {
    const a = new JSBI(this.length, this.sign);
    for (let b = 0; b < this.length; b++) a[b] = this[b];
    return a;
  }
  __trim() {
    let a = this.length, b = this[a - 1];
    for (; 0 === b; ) a--, b = this[a - 1], this.pop();
    return 0 === a && (this.sign = false), this;
  }
  __initializeDigits() {
    for (let a = 0; a < this.length; a++) this[a] = 0;
  }
  static __decideRounding(a, b, c, d) {
    if (0 < b) return -1;
    let e2;
    if (0 > b) e2 = -b - 1;
    else {
      if (0 === c) return -1;
      c--, d = a.__digit(c), e2 = 31;
    }
    let f = 1 << e2;
    if (0 == (d & f)) return -1;
    if (f -= 1, 0 != (d & f)) return 1;
    for (; 0 < c; ) if (c--, 0 !== a.__digit(c)) return 1;
    return 0;
  }
  static __fromDouble(a) {
    JSBI.__kBitConversionDouble[0] = a;
    const b = 2047 & JSBI.__kBitConversionInts[1] >>> 20, c = b - 1023, d = (c >>> 5) + 1, e2 = new JSBI(d, 0 > a);
    let f = 1048575 & JSBI.__kBitConversionInts[1] | 1048576, g = JSBI.__kBitConversionInts[0];
    const h = 20, i = 31 & c;
    let j, k = 0;
    if (i < 20) {
      const a2 = h - i;
      k = a2 + 32, j = f >>> a2, f = f << 32 - a2 | g >>> a2, g <<= 32 - a2;
    } else if (i === 20) k = 32, j = f, f = g;
    else {
      const a2 = i - h;
      k = 32 - a2, j = f << a2 | g >>> 32 - a2, f = g << a2;
    }
    e2.__setDigit(d - 1, j);
    for (let b2 = d - 2; 0 <= b2; b2--) 0 < k ? (k -= 32, j = f, f = g) : j = 0, e2.__setDigit(b2, j);
    return e2.__trim();
  }
  static __isWhitespace(a) {
    return !!(13 >= a && 9 <= a) || (159 >= a ? 32 == a : 131071 >= a ? 160 == a || 5760 == a : 196607 >= a ? (a &= 131071, 10 >= a || 40 == a || 41 == a || 47 == a || 95 == a || 4096 == a) : 65279 == a);
  }
  static __fromString(a, b = 0) {
    let c = 0;
    const e2 = a.length;
    let f = 0;
    if (f === e2) return JSBI.__zero();
    let g = a.charCodeAt(f);
    for (; JSBI.__isWhitespace(g); ) {
      if (++f === e2) return JSBI.__zero();
      g = a.charCodeAt(f);
    }
    if (43 === g) {
      if (++f === e2) return null;
      g = a.charCodeAt(f), c = 1;
    } else if (45 === g) {
      if (++f === e2) return null;
      g = a.charCodeAt(f), c = -1;
    }
    if (0 === b) {
      if (b = 10, 48 === g) {
        if (++f === e2) return JSBI.__zero();
        if (g = a.charCodeAt(f), 88 === g || 120 === g) {
          if (b = 16, ++f === e2) return null;
          g = a.charCodeAt(f);
        } else if (79 === g || 111 === g) {
          if (b = 8, ++f === e2) return null;
          g = a.charCodeAt(f);
        } else if (66 === g || 98 === g) {
          if (b = 2, ++f === e2) return null;
          g = a.charCodeAt(f);
        }
      }
    } else if (16 === b && 48 === g) {
      if (++f === e2) return JSBI.__zero();
      if (g = a.charCodeAt(f), 88 === g || 120 === g) {
        if (++f === e2) return null;
        g = a.charCodeAt(f);
      }
    }
    for (; 48 === g; ) {
      if (++f === e2) return JSBI.__zero();
      g = a.charCodeAt(f);
    }
    const h = e2 - f;
    let i = JSBI.__kMaxBitsPerChar[b], j = JSBI.__kBitsPerCharTableMultiplier - 1;
    if (h > 1073741824 / i) return null;
    const k = i * h + j >>> JSBI.__kBitsPerCharTableShift, l = new JSBI(k + 31 >>> 5, false), n = 10 > b ? b : 10, o = 10 < b ? b - 10 : 0;
    if (0 == (b & b - 1)) {
      i >>= JSBI.__kBitsPerCharTableShift;
      const b2 = [], c2 = [];
      let d = false;
      do {
        let h2 = 0, j2 = 0;
        for (; ; ) {
          let b3;
          if (g - 48 >>> 0 < n) b3 = g - 48;
          else if ((32 | g) - 97 >>> 0 < o) b3 = (32 | g) - 87;
          else {
            d = true;
            break;
          }
          if (j2 += i, h2 = h2 << i | b3, ++f === e2) {
            d = true;
            break;
          }
          if (g = a.charCodeAt(f), 32 < j2 + i) break;
        }
        b2.push(h2), c2.push(j2);
      } while (!d);
      JSBI.__fillFromParts(l, b2, c2);
    } else {
      l.__initializeDigits();
      let c2 = false, h2 = 0;
      do {
        let k2 = 0, p = 1;
        for (; ; ) {
          let i2;
          if (g - 48 >>> 0 < n) i2 = g - 48;
          else if ((32 | g) - 97 >>> 0 < o) i2 = (32 | g) - 87;
          else {
            c2 = true;
            break;
          }
          const d = p * b;
          if (4294967295 < d) break;
          if (p = d, k2 = k2 * b + i2, h2++, ++f === e2) {
            c2 = true;
            break;
          }
          g = a.charCodeAt(f);
        }
        j = 32 * JSBI.__kBitsPerCharTableMultiplier - 1;
        const q = i * h2 + j >>> JSBI.__kBitsPerCharTableShift + 5;
        l.__inplaceMultiplyAdd(p, k2, q);
      } while (!c2);
    }
    if (f !== e2) {
      if (!JSBI.__isWhitespace(g)) return null;
      for (f++; f < e2; f++) if (g = a.charCodeAt(f), !JSBI.__isWhitespace(g)) return null;
    }
    return 0 != c && 10 !== b ? null : (l.sign = -1 == c, l.__trim());
  }
  static __fillFromParts(a, b, c) {
    let d = 0, e2 = 0, f = 0;
    for (let g = b.length - 1; 0 <= g; g--) {
      const h = b[g], i = c[g];
      e2 |= h << f, f += i, 32 === f ? (a.__setDigit(d++, e2), f = 0, e2 = 0) : 32 < f && (a.__setDigit(d++, e2), f -= 32, e2 = h >>> i - f);
    }
    if (0 !== e2) {
      if (d >= a.length) throw new Error("implementation bug");
      a.__setDigit(d++, e2);
    }
    for (; d < a.length; d++) a.__setDigit(d, 0);
  }
  static __toStringBasePowerOfTwo(a, b) {
    const c = a.length;
    let d = b - 1;
    d = (85 & d >>> 1) + (85 & d), d = (51 & d >>> 2) + (51 & d), d = (15 & d >>> 4) + (15 & d);
    const e2 = d, f = b - 1, g = a.__digit(c - 1), h = JSBI.__clz32(g);
    let i = 0 | (32 * c - h + e2 - 1) / e2;
    if (a.sign && i++, 268435456 < i) throw new Error("string too long");
    const j = Array(i);
    let k = i - 1, l = 0, m = 0;
    for (let d2 = 0; d2 < c - 1; d2++) {
      const b2 = a.__digit(d2), c2 = (l | b2 << m) & f;
      j[k--] = JSBI.__kConversionChars[c2];
      const g2 = e2 - m;
      for (l = b2 >>> g2, m = 32 - g2; m >= e2; ) j[k--] = JSBI.__kConversionChars[l & f], l >>>= e2, m -= e2;
    }
    const n = (l | g << m) & f;
    for (j[k--] = JSBI.__kConversionChars[n], l = g >>> e2 - m; 0 !== l; ) j[k--] = JSBI.__kConversionChars[l & f], l >>>= e2;
    if (a.sign && (j[k--] = "-"), -1 != k) throw new Error("implementation bug");
    return j.join("");
  }
  static __toStringGeneric(a, b, c) {
    const d = a.length;
    if (0 === d) return "";
    if (1 === d) {
      let d2 = a.__unsignedDigit(0).toString(b);
      return false === c && a.sign && (d2 = "-" + d2), d2;
    }
    const e2 = 32 * d - JSBI.__clz32(a.__digit(d - 1)), f = JSBI.__kMaxBitsPerChar[b], g = f - 1;
    let h = e2 * JSBI.__kBitsPerCharTableMultiplier;
    h += g - 1, h = 0 | h / g;
    const i = h + 1 >> 1, j = JSBI.exponentiate(JSBI.__oneDigit(b, false), JSBI.__oneDigit(i, false));
    let k, l;
    const m = j.__unsignedDigit(0);
    if (1 === j.length && 65535 >= m) {
      k = new JSBI(a.length, false), k.__initializeDigits();
      let c2 = 0;
      for (let b2 = 2 * a.length - 1; 0 <= b2; b2--) {
        const d2 = c2 << 16 | a.__halfDigit(b2);
        k.__setHalfDigit(b2, 0 | d2 / m), c2 = 0 | d2 % m;
      }
      l = c2.toString(b);
    } else {
      const c2 = JSBI.__absoluteDivLarge(a, j, true, true);
      k = c2.quotient;
      const d2 = c2.remainder.__trim();
      l = JSBI.__toStringGeneric(d2, b, true);
    }
    k.__trim();
    let n = JSBI.__toStringGeneric(k, b, true);
    for (; l.length < i; ) l = "0" + l;
    return false === c && a.sign && (n = "-" + n), n + l;
  }
  static __unequalSign(a) {
    return a ? -1 : 1;
  }
  static __absoluteGreater(a) {
    return a ? -1 : 1;
  }
  static __absoluteLess(a) {
    return a ? 1 : -1;
  }
  static __compareToBigInt(a, b) {
    const c = a.sign;
    if (c !== b.sign) return JSBI.__unequalSign(c);
    const d = JSBI.__absoluteCompare(a, b);
    return 0 < d ? JSBI.__absoluteGreater(c) : 0 > d ? JSBI.__absoluteLess(c) : 0;
  }
  static __compareToNumber(a, b) {
    if (b | true) {
      const c = a.sign, d = 0 > b;
      if (c !== d) return JSBI.__unequalSign(c);
      if (0 === a.length) {
        if (d) throw new Error("implementation bug");
        return 0 === b ? 0 : -1;
      }
      if (1 < a.length) return JSBI.__absoluteGreater(c);
      const e2 = Math.abs(b), f = a.__unsignedDigit(0);
      return f > e2 ? JSBI.__absoluteGreater(c) : f < e2 ? JSBI.__absoluteLess(c) : 0;
    }
    return JSBI.__compareToDouble(a, b);
  }
  static __compareToDouble(a, b) {
    if (b !== b) return b;
    if (b === 1 / 0) return -1;
    if (b === -Infinity) return 1;
    const c = a.sign;
    if (c !== 0 > b) return JSBI.__unequalSign(c);
    if (0 === b) throw new Error("implementation bug: should be handled elsewhere");
    if (0 === a.length) return -1;
    JSBI.__kBitConversionDouble[0] = b;
    const d = 2047 & JSBI.__kBitConversionInts[1] >>> 20;
    if (2047 == d) throw new Error("implementation bug: handled elsewhere");
    const e2 = d - 1023;
    if (0 > e2) return JSBI.__absoluteGreater(c);
    const f = a.length;
    let g = a.__digit(f - 1);
    const h = JSBI.__clz32(g), i = 32 * f - h, j = e2 + 1;
    if (i < j) return JSBI.__absoluteLess(c);
    if (i > j) return JSBI.__absoluteGreater(c);
    let k = 1048576 | 1048575 & JSBI.__kBitConversionInts[1], l = JSBI.__kBitConversionInts[0];
    const m = 20, n = 31 - h;
    if (n !== (i - 1) % 31) throw new Error("implementation bug");
    let o, p = 0;
    if (20 > n) {
      const a2 = m - n;
      p = a2 + 32, o = k >>> a2, k = k << 32 - a2 | l >>> a2, l <<= 32 - a2;
    } else if (20 === n) p = 32, o = k, k = l;
    else {
      const a2 = n - m;
      p = 32 - a2, o = k << a2 | l >>> 32 - a2, k = l << a2;
    }
    if (g >>>= 0, o >>>= 0, g > o) return JSBI.__absoluteGreater(c);
    if (g < o) return JSBI.__absoluteLess(c);
    for (let d2 = f - 2; 0 <= d2; d2--) {
      0 < p ? (p -= 32, o = k >>> 0, k = l, l = 0) : o = 0;
      const b2 = a.__unsignedDigit(d2);
      if (b2 > o) return JSBI.__absoluteGreater(c);
      if (b2 < o) return JSBI.__absoluteLess(c);
    }
    if (0 !== k || 0 !== l) {
      if (0 === p) throw new Error("implementation bug");
      return JSBI.__absoluteLess(c);
    }
    return 0;
  }
  static __equalToNumber(a, b) {
    var c = Math.abs;
    return b | 0 === b ? 0 === b ? 0 === a.length : 1 === a.length && a.sign === 0 > b && a.__unsignedDigit(0) === c(b) : 0 === JSBI.__compareToDouble(a, b);
  }
  static __comparisonResultToBool(a, b) {
    switch (b) {
      case 0:
        return 0 > a;
      case 1:
        return 0 >= a;
      case 2:
        return 0 < a;
      case 3:
        return 0 <= a;
    }
    throw new Error("unreachable");
  }
  static __compare(a, b, c) {
    if (a = JSBI.__toPrimitive(a), b = JSBI.__toPrimitive(b), "string" == typeof a && "string" == typeof b) switch (c) {
      case 0:
        return a < b;
      case 1:
        return a <= b;
      case 2:
        return a > b;
      case 3:
        return a >= b;
    }
    if (JSBI.__isBigInt(a) && "string" == typeof b) return b = JSBI.__fromString(b), null !== b && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a, b), c);
    if ("string" == typeof a && JSBI.__isBigInt(b)) return a = JSBI.__fromString(a), null !== a && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a, b), c);
    if (a = JSBI.__toNumeric(a), b = JSBI.__toNumeric(b), JSBI.__isBigInt(a)) {
      if (JSBI.__isBigInt(b)) return JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a, b), c);
      if ("number" != typeof b) throw new Error("implementation bug");
      return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(a, b), c);
    }
    if ("number" != typeof a) throw new Error("implementation bug");
    if (JSBI.__isBigInt(b)) return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(b, a), 2 ^ c);
    if ("number" != typeof b) throw new Error("implementation bug");
    return 0 === c ? a < b : 1 === c ? a <= b : 2 === c ? a > b : 3 === c ? a >= b : void 0;
  }
  __clzmsd() {
    return JSBI.__clz32(this[this.length - 1]);
  }
  static __absoluteAdd(a, b, c) {
    if (a.length < b.length) return JSBI.__absoluteAdd(b, a, c);
    if (0 === a.length) return a;
    if (0 === b.length) return a.sign === c ? a : JSBI.unaryMinus(a);
    let d = a.length;
    (0 === a.__clzmsd() || b.length === a.length && 0 === b.__clzmsd()) && d++;
    const e2 = new JSBI(d, c);
    let f = 0, g = 0;
    for (; g < b.length; g++) {
      const c2 = b.__digit(g), d2 = a.__digit(g), h = (65535 & d2) + (65535 & c2) + f, i = (d2 >>> 16) + (c2 >>> 16) + (h >>> 16);
      f = i >>> 16, e2.__setDigit(g, 65535 & h | i << 16);
    }
    for (; g < a.length; g++) {
      const b2 = a.__digit(g), c2 = (65535 & b2) + f, d2 = (b2 >>> 16) + (c2 >>> 16);
      f = d2 >>> 16, e2.__setDigit(g, 65535 & c2 | d2 << 16);
    }
    return g < e2.length && e2.__setDigit(g, f), e2.__trim();
  }
  static __absoluteSub(a, b, c) {
    if (0 === a.length) return a;
    if (0 === b.length) return a.sign === c ? a : JSBI.unaryMinus(a);
    const d = new JSBI(a.length, c);
    let e2 = 0, f = 0;
    for (; f < b.length; f++) {
      const c2 = a.__digit(f), g = b.__digit(f), h = (65535 & c2) - (65535 & g) - e2;
      e2 = 1 & h >>> 16;
      const i = (c2 >>> 16) - (g >>> 16) - e2;
      e2 = 1 & i >>> 16, d.__setDigit(f, 65535 & h | i << 16);
    }
    for (; f < a.length; f++) {
      const b2 = a.__digit(f), c2 = (65535 & b2) - e2;
      e2 = 1 & c2 >>> 16;
      const g = (b2 >>> 16) - e2;
      e2 = 1 & g >>> 16, d.__setDigit(f, 65535 & c2 | g << 16);
    }
    return d.__trim();
  }
  static __absoluteAddOne(a, b, c = null) {
    const d = a.length;
    null === c ? c = new JSBI(d, b) : c.sign = b;
    let e2 = true;
    for (let f, g = 0; g < d; g++) {
      if (f = a.__digit(g), e2) {
        const a2 = -1 === f;
        f = 0 | f + 1, e2 = a2;
      }
      c.__setDigit(g, f);
    }
    return e2 && c.__setDigitGrow(d, 1), c;
  }
  static __absoluteSubOne(a, b) {
    const c = a.length;
    b = b || c;
    const d = new JSBI(b, false);
    let e2 = true;
    for (let f, g = 0; g < c; g++) {
      if (f = a.__digit(g), e2) {
        const a2 = 0 === f;
        f = 0 | f - 1, e2 = a2;
      }
      d.__setDigit(g, f);
    }
    if (e2) throw new Error("implementation bug");
    for (let e3 = c; e3 < b; e3++) d.__setDigit(e3, 0);
    return d;
  }
  static __absoluteAnd(a, b, c = null) {
    let d = a.length, e2 = b.length, f = e2;
    if (d < e2) {
      f = d;
      const c2 = a, g2 = d;
      a = b, d = e2, b = c2, e2 = g2;
    }
    let g = f;
    null === c ? c = new JSBI(g, false) : g = c.length;
    let h = 0;
    for (; h < f; h++) c.__setDigit(h, a.__digit(h) & b.__digit(h));
    for (; h < g; h++) c.__setDigit(h, 0);
    return c;
  }
  static __absoluteAndNot(a, b, c = null) {
    const d = a.length, e2 = b.length;
    let f = e2;
    d < e2 && (f = d);
    let g = d;
    null === c ? c = new JSBI(g, false) : g = c.length;
    let h = 0;
    for (; h < f; h++) c.__setDigit(h, a.__digit(h) & ~b.__digit(h));
    for (; h < d; h++) c.__setDigit(h, a.__digit(h));
    for (; h < g; h++) c.__setDigit(h, 0);
    return c;
  }
  static __absoluteOr(a, b, c = null) {
    let d = a.length, e2 = b.length, f = e2;
    if (d < e2) {
      f = d;
      const c2 = a, g2 = d;
      a = b, d = e2, b = c2, e2 = g2;
    }
    let g = d;
    null === c ? c = new JSBI(g, false) : g = c.length;
    let h = 0;
    for (; h < f; h++) c.__setDigit(h, a.__digit(h) | b.__digit(h));
    for (; h < d; h++) c.__setDigit(h, a.__digit(h));
    for (; h < g; h++) c.__setDigit(h, 0);
    return c;
  }
  static __absoluteXor(a, b, c = null) {
    let d = a.length, e2 = b.length, f = e2;
    if (d < e2) {
      f = d;
      const c2 = a, g2 = d;
      a = b, d = e2, b = c2, e2 = g2;
    }
    let g = d;
    null === c ? c = new JSBI(g, false) : g = c.length;
    let h = 0;
    for (; h < f; h++) c.__setDigit(h, a.__digit(h) ^ b.__digit(h));
    for (; h < d; h++) c.__setDigit(h, a.__digit(h));
    for (; h < g; h++) c.__setDigit(h, 0);
    return c;
  }
  static __absoluteCompare(a, b) {
    const c = a.length - b.length;
    if (0 != c) return c;
    let d = a.length - 1;
    for (; 0 <= d && a.__digit(d) === b.__digit(d); ) d--;
    return 0 > d ? 0 : a.__unsignedDigit(d) > b.__unsignedDigit(d) ? 1 : -1;
  }
  static __multiplyAccumulate(a, b, c, d) {
    if (0 === b) return;
    const e2 = 65535 & b, f = b >>> 16;
    let g = 0, h = 0, j = 0;
    for (let k = 0; k < a.length; k++, d++) {
      let b2 = c.__digit(d), i = 65535 & b2, l = b2 >>> 16;
      const m = a.__digit(k), n = 65535 & m, o = m >>> 16, p = JSBI.__imul(n, e2), q = JSBI.__imul(n, f), r = JSBI.__imul(o, e2), s = JSBI.__imul(o, f);
      i += h + (65535 & p), l += j + g + (i >>> 16) + (p >>> 16) + (65535 & q) + (65535 & r), g = l >>> 16, h = (q >>> 16) + (r >>> 16) + (65535 & s) + g, g = h >>> 16, h &= 65535, j = s >>> 16, b2 = 65535 & i | l << 16, c.__setDigit(d, b2);
    }
    for (; 0 != g || 0 !== h || 0 !== j; d++) {
      let a2 = c.__digit(d);
      const b2 = (65535 & a2) + h, e3 = (a2 >>> 16) + (b2 >>> 16) + j + g;
      h = 0, j = 0, g = e3 >>> 16, a2 = 65535 & b2 | e3 << 16, c.__setDigit(d, a2);
    }
  }
  static __internalMultiplyAdd(a, b, c, d, e2) {
    let f = c, g = 0;
    for (let h = 0; h < d; h++) {
      const c2 = a.__digit(h), d2 = JSBI.__imul(65535 & c2, b), i = (65535 & d2) + g + f;
      f = i >>> 16;
      const j = JSBI.__imul(c2 >>> 16, b), k = (65535 & j) + (d2 >>> 16) + f;
      f = k >>> 16, g = j >>> 16, e2.__setDigit(h, k << 16 | 65535 & i);
    }
    if (e2.length > d) for (e2.__setDigit(d++, f + g); d < e2.length; ) e2.__setDigit(d++, 0);
    else if (0 !== f + g) throw new Error("implementation bug");
  }
  __inplaceMultiplyAdd(a, b, c) {
    c > this.length && (c = this.length);
    const e2 = 65535 & a, f = a >>> 16;
    let g = 0, h = 65535 & b, j = b >>> 16;
    for (let k = 0; k < c; k++) {
      const a2 = this.__digit(k), b2 = 65535 & a2, c2 = a2 >>> 16, d = JSBI.__imul(b2, e2), i = JSBI.__imul(b2, f), l = JSBI.__imul(c2, e2), m = JSBI.__imul(c2, f), n = h + (65535 & d), o = j + g + (n >>> 16) + (d >>> 16) + (65535 & i) + (65535 & l);
      h = (i >>> 16) + (l >>> 16) + (65535 & m) + (o >>> 16), g = h >>> 16, h &= 65535, j = m >>> 16;
      this.__setDigit(k, 65535 & n | o << 16);
    }
    if (0 != g || 0 !== h || 0 !== j) throw new Error("implementation bug");
  }
  static __absoluteDivSmall(a, b, c) {
    null === c && (c = new JSBI(a.length, false));
    let d = 0;
    for (let e2, f = 2 * a.length - 1; 0 <= f; f -= 2) {
      e2 = (d << 16 | a.__halfDigit(f)) >>> 0;
      const g = 0 | e2 / b;
      d = 0 | e2 % b, e2 = (d << 16 | a.__halfDigit(f - 1)) >>> 0;
      const h = 0 | e2 / b;
      d = 0 | e2 % b, c.__setDigit(f >>> 1, g << 16 | h);
    }
    return c;
  }
  static __absoluteModSmall(a, b) {
    let c = 0;
    for (let d = 2 * a.length - 1; 0 <= d; d--) {
      const e2 = (c << 16 | a.__halfDigit(d)) >>> 0;
      c = 0 | e2 % b;
    }
    return c;
  }
  static __absoluteDivLarge(a, b, d, e2) {
    const f = b.__halfDigitLength(), g = b.length, c = a.__halfDigitLength() - f;
    let h = null;
    d && (h = new JSBI(c + 2 >>> 1, false), h.__initializeDigits());
    const i = new JSBI(f + 2 >>> 1, false);
    i.__initializeDigits();
    const j = JSBI.__clz16(b.__halfDigit(f - 1));
    0 < j && (b = JSBI.__specialLeftShift(b, j, 0));
    const k = JSBI.__specialLeftShift(a, j, 1), l = b.__halfDigit(f - 1);
    let m = 0;
    for (let n, o = c; 0 <= o; o--) {
      n = 65535;
      const a2 = k.__halfDigit(o + f);
      if (a2 !== l) {
        const c2 = (a2 << 16 | k.__halfDigit(o + f - 1)) >>> 0;
        n = 0 | c2 / l;
        let d2 = 0 | c2 % l;
        const e4 = b.__halfDigit(f - 2), g2 = k.__halfDigit(o + f - 2);
        for (; JSBI.__imul(n, e4) >>> 0 > (d2 << 16 | g2) >>> 0 && (n--, d2 += l, !(65535 < d2)); ) ;
      }
      JSBI.__internalMultiplyAdd(b, n, 0, g, i);
      let e3 = k.__inplaceSub(i, o, f + 1);
      0 !== e3 && (e3 = k.__inplaceAdd(b, o, f), k.__setHalfDigit(o + f, k.__halfDigit(o + f) + e3), n--), d && (1 & o ? m = n << 16 : h.__setDigit(o >>> 1, m | n));
    }
    return e2 ? (k.__inplaceRightShift(j), d ? { quotient: h, remainder: k } : k) : d ? h : void 0;
  }
  static __clz16(a) {
    return JSBI.__clz32(a) - 16;
  }
  __inplaceAdd(a, b, c) {
    let d = 0;
    for (let e2 = 0; e2 < c; e2++) {
      const c2 = this.__halfDigit(b + e2) + a.__halfDigit(e2) + d;
      d = c2 >>> 16, this.__setHalfDigit(b + e2, c2);
    }
    return d;
  }
  __inplaceSub(a, b, c) {
    let d = 0;
    if (1 & b) {
      b >>= 1;
      let e2 = this.__digit(b), f = 65535 & e2, g = 0;
      for (; g < c - 1 >>> 1; g++) {
        const c2 = a.__digit(g), h2 = (e2 >>> 16) - (65535 & c2) - d;
        d = 1 & h2 >>> 16, this.__setDigit(b + g, h2 << 16 | 65535 & f), e2 = this.__digit(b + g + 1), f = (65535 & e2) - (c2 >>> 16) - d, d = 1 & f >>> 16;
      }
      const h = a.__digit(g), i = (e2 >>> 16) - (65535 & h) - d;
      d = 1 & i >>> 16, this.__setDigit(b + g, i << 16 | 65535 & f);
      if (b + g + 1 >= this.length) throw new RangeError("out of bounds");
      0 == (1 & c) && (e2 = this.__digit(b + g + 1), f = (65535 & e2) - (h >>> 16) - d, d = 1 & f >>> 16, this.__setDigit(b + a.length, 4294901760 & e2 | 65535 & f));
    } else {
      b >>= 1;
      let e2 = 0;
      for (; e2 < a.length - 1; e2++) {
        const c2 = this.__digit(b + e2), f2 = a.__digit(e2), g2 = (65535 & c2) - (65535 & f2) - d;
        d = 1 & g2 >>> 16;
        const h2 = (c2 >>> 16) - (f2 >>> 16) - d;
        d = 1 & h2 >>> 16, this.__setDigit(b + e2, h2 << 16 | 65535 & g2);
      }
      const f = this.__digit(b + e2), g = a.__digit(e2), h = (65535 & f) - (65535 & g) - d;
      d = 1 & h >>> 16;
      let i = 0;
      0 == (1 & c) && (i = (f >>> 16) - (g >>> 16) - d, d = 1 & i >>> 16), this.__setDigit(b + e2, i << 16 | 65535 & h);
    }
    return d;
  }
  __inplaceRightShift(a) {
    if (0 === a) return;
    let b = this.__digit(0) >>> a;
    const c = this.length - 1;
    for (let e2 = 0; e2 < c; e2++) {
      const c2 = this.__digit(e2 + 1);
      this.__setDigit(e2, c2 << 32 - a | b), b = c2 >>> a;
    }
    this.__setDigit(c, b);
  }
  static __specialLeftShift(a, b, c) {
    const d = a.length, e2 = new JSBI(d + c, false);
    if (0 === b) {
      for (let b2 = 0; b2 < d; b2++) e2.__setDigit(b2, a.__digit(b2));
      return 0 < c && e2.__setDigit(d, 0), e2;
    }
    let f = 0;
    for (let g = 0; g < d; g++) {
      const c2 = a.__digit(g);
      e2.__setDigit(g, c2 << b | f), f = c2 >>> 32 - b;
    }
    return 0 < c && e2.__setDigit(d, f), e2;
  }
  static __leftShiftByAbsolute(a, b) {
    const c = JSBI.__toShiftAmount(b);
    if (0 > c) throw new RangeError("BigInt too big");
    const e2 = c >>> 5, f = 31 & c, g = a.length, h = 0 !== f && 0 != a.__digit(g - 1) >>> 32 - f, j = g + e2 + (h ? 1 : 0), k = new JSBI(j, a.sign);
    if (0 === f) {
      let b2 = 0;
      for (; b2 < e2; b2++) k.__setDigit(b2, 0);
      for (; b2 < j; b2++) k.__setDigit(b2, a.__digit(b2 - e2));
    } else {
      let b2 = 0;
      for (let a2 = 0; a2 < e2; a2++) k.__setDigit(a2, 0);
      for (let c2 = 0; c2 < g; c2++) {
        const g2 = a.__digit(c2);
        k.__setDigit(c2 + e2, g2 << f | b2), b2 = g2 >>> 32 - f;
      }
      if (h) k.__setDigit(g + e2, b2);
      else if (0 !== b2) throw new Error("implementation bug");
    }
    return k.__trim();
  }
  static __rightShiftByAbsolute(a, b) {
    const c = a.length, d = a.sign, e2 = JSBI.__toShiftAmount(b);
    if (0 > e2) return JSBI.__rightShiftByMaximum(d);
    const f = e2 >>> 5, g = 31 & e2;
    let h = c - f;
    if (0 >= h) return JSBI.__rightShiftByMaximum(d);
    let i = false;
    if (d) {
      if (0 != (a.__digit(f) & (1 << g) - 1)) i = true;
      else for (let b2 = 0; b2 < f; b2++) if (0 !== a.__digit(b2)) {
        i = true;
        break;
      }
    }
    if (i && 0 === g) {
      const b2 = a.__digit(c - 1);
      0 == ~b2 && h++;
    }
    let j = new JSBI(h, d);
    if (0 === g) for (let b2 = f; b2 < c; b2++) j.__setDigit(b2 - f, a.__digit(b2));
    else {
      let b2 = a.__digit(f) >>> g;
      const d2 = c - f - 1;
      for (let c2 = 0; c2 < d2; c2++) {
        const e3 = a.__digit(c2 + f + 1);
        j.__setDigit(c2, e3 << 32 - g | b2), b2 = e3 >>> g;
      }
      j.__setDigit(d2, b2);
    }
    return i && (j = JSBI.__absoluteAddOne(j, true, j)), j.__trim();
  }
  static __rightShiftByMaximum(a) {
    return a ? JSBI.__oneDigit(1, true) : JSBI.__zero();
  }
  static __toShiftAmount(a) {
    if (1 < a.length) return -1;
    const b = a.__unsignedDigit(0);
    return b > JSBI.__kMaxLengthBits ? -1 : b;
  }
  static __toPrimitive(a, b = "default") {
    if ("object" != typeof a) return a;
    if (a.constructor === JSBI) return a;
    const c = a[Symbol.toPrimitive];
    if (c) {
      const a2 = c(b);
      if ("object" != typeof a2) return a2;
      throw new TypeError("Cannot convert object to primitive value");
    }
    const d = a.valueOf;
    if (d) {
      const b2 = d.call(a);
      if ("object" != typeof b2) return b2;
    }
    const e2 = a.toString;
    if (e2) {
      const b2 = e2.call(a);
      if ("object" != typeof b2) return b2;
    }
    throw new TypeError("Cannot convert object to primitive value");
  }
  static __toNumeric(a) {
    return JSBI.__isBigInt(a) ? a : +a;
  }
  static __isBigInt(a) {
    return "object" == typeof a && null !== a && a.constructor === JSBI;
  }
  static __truncateToNBits(a, b) {
    const c = a + 31 >>> 5, d = new JSBI(c, b.sign), e2 = c - 1;
    for (let c2 = 0; c2 < e2; c2++) d.__setDigit(c2, b.__digit(c2));
    let f = b.__digit(e2);
    if (0 != (31 & a)) {
      const b2 = 32 - (31 & a);
      f = f << b2 >>> b2;
    }
    return d.__setDigit(e2, f), d.__trim();
  }
  static __truncateAndSubFromPowerOfTwo(a, b, c) {
    var d = Math.min;
    const e2 = a + 31 >>> 5, f = new JSBI(e2, c);
    let g = 0;
    const h = e2 - 1;
    let j = 0;
    for (const e3 = d(h, b.length); g < e3; g++) {
      const a2 = b.__digit(g), c2 = 0 - (65535 & a2) - j;
      j = 1 & c2 >>> 16;
      const d2 = 0 - (a2 >>> 16) - j;
      j = 1 & d2 >>> 16, f.__setDigit(g, 65535 & c2 | d2 << 16);
    }
    for (; g < h; g++) f.__setDigit(g, 0 | -j);
    let k = h < b.length ? b.__digit(h) : 0;
    const l = 31 & a;
    let m;
    if (0 == l) {
      const a2 = 0 - (65535 & k) - j;
      j = 1 & a2 >>> 16;
      const b2 = 0 - (k >>> 16) - j;
      m = 65535 & a2 | b2 << 16;
    } else {
      const a2 = 32 - l;
      k = k << a2 >>> a2;
      const b2 = 1 << 32 - a2, c2 = (65535 & b2) - (65535 & k) - j;
      j = 1 & c2 >>> 16;
      const d2 = (b2 >>> 16) - (k >>> 16) - j;
      m = 65535 & c2 | d2 << 16, m &= b2 - 1;
    }
    return f.__setDigit(h, m), f.__trim();
  }
  __digit(a) {
    return this[a];
  }
  __unsignedDigit(a) {
    return this[a] >>> 0;
  }
  __setDigit(a, b) {
    this[a] = 0 | b;
  }
  __setDigitGrow(a, b) {
    this[a] = 0 | b;
  }
  __halfDigitLength() {
    const a = this.length;
    return 65535 >= this.__unsignedDigit(a - 1) ? 2 * a - 1 : 2 * a;
  }
  __halfDigit(a) {
    return 65535 & this[a >>> 1] >>> ((1 & a) << 4);
  }
  __setHalfDigit(a, b) {
    const c = a >>> 1, d = this.__digit(c), e2 = 1 & a ? 65535 & d | b << 16 : 4294901760 & d | 65535 & b;
    this.__setDigit(c, e2);
  }
  static __digitPow(a, b) {
    let c = 1;
    for (; 0 < b; ) 1 & b && (c *= a), b >>>= 1, a *= a;
    return c;
  }
}
JSBI.__kMaxLength = 33554432, JSBI.__kMaxLengthBits = JSBI.__kMaxLength << 5, JSBI.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], JSBI.__kBitsPerCharTableShift = 5, JSBI.__kBitsPerCharTableMultiplier = 1 << JSBI.__kBitsPerCharTableShift, JSBI.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], JSBI.__kBitConversionBuffer = new ArrayBuffer(8), JSBI.__kBitConversionDouble = new Float64Array(JSBI.__kBitConversionBuffer), JSBI.__kBitConversionInts = new Int32Array(JSBI.__kBitConversionBuffer), JSBI.__clz32 = Math.clz32 || function(a) {
  return 0 === a ? 32 : 0 | 31 - (0 | Math.log(a >>> 0) / Math.LN2);
}, JSBI.__imul = Math.imul || function(c, a) {
  return 0 | c * a;
};
var __spreadArrays$4 = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var MAX_UINT64 = 18446744073709552e3;
var rotl = function(x, k) {
  return JSBI.bitwiseXor(JSBI.asUintN(64, JSBI.leftShift(x, JSBI.BigInt(k))), JSBI.BigInt(JSBI.asUintN(64, JSBI.signedRightShift(x, JSBI.subtract(JSBI.BigInt(64), JSBI.BigInt(k))))));
};
var Xoshiro = (
  /** @class */
  (function() {
    function Xoshiro2(seed) {
      var _this = this;
      this.next = function() {
        return new BigNumber(_this.roll().toString());
      };
      this.nextDouble = function() {
        return new BigNumber(_this.roll().toString()).div(MAX_UINT64 + 1);
      };
      this.nextInt = function(low, high) {
        return Math.floor(_this.nextDouble().toNumber() * (high - low + 1) + low);
      };
      this.nextByte = function() {
        return _this.nextInt(0, 255);
      };
      this.nextData = function(count) {
        return __spreadArrays$4(new Array(count)).map(function() {
          return _this.nextByte();
        });
      };
      var digest = sha256Hash(seed);
      this.s = [JSBI.BigInt(0), JSBI.BigInt(0), JSBI.BigInt(0), JSBI.BigInt(0)];
      this.setS(digest);
    }
    Xoshiro2.prototype.setS = function(digest) {
      for (var i = 0; i < 4; i++) {
        var o = i * 8;
        var v = JSBI.BigInt(0);
        for (var n = 0; n < 8; n++) {
          v = JSBI.asUintN(64, JSBI.leftShift(v, JSBI.BigInt(8)));
          v = JSBI.asUintN(64, JSBI.bitwiseOr(v, JSBI.BigInt(digest[o + n])));
        }
        this.s[i] = JSBI.asUintN(64, v);
      }
    };
    Xoshiro2.prototype.roll = function() {
      var result = JSBI.asUintN(64, JSBI.multiply(rotl(JSBI.asUintN(64, JSBI.multiply(this.s[1], JSBI.BigInt(5))), 7), JSBI.BigInt(9)));
      var t = JSBI.asUintN(64, JSBI.leftShift(this.s[1], JSBI.BigInt(17)));
      this.s[2] = JSBI.asUintN(64, JSBI.bitwiseXor(this.s[2], JSBI.BigInt(this.s[0])));
      this.s[3] = JSBI.asUintN(64, JSBI.bitwiseXor(this.s[3], JSBI.BigInt(this.s[1])));
      this.s[1] = JSBI.asUintN(64, JSBI.bitwiseXor(this.s[1], JSBI.BigInt(this.s[2])));
      this.s[0] = JSBI.asUintN(64, JSBI.bitwiseXor(this.s[0], JSBI.BigInt(this.s[3])));
      this.s[2] = JSBI.asUintN(64, JSBI.bitwiseXor(this.s[2], JSBI.BigInt(t)));
      this.s[3] = JSBI.asUintN(64, rotl(this.s[3], 45));
      return result;
    };
    return Xoshiro2;
  })()
);
var aliasSampling;
var hasRequiredAliasSampling;
function requireAliasSampling() {
  if (hasRequiredAliasSampling) return aliasSampling;
  hasRequiredAliasSampling = 1;
  function Sample(probabilities, outcomes, rng) {
    this.alias = [];
    this.prob = [];
    this.outcomes = outcomes || this.indexedOutcomes(probabilities.length);
    this.rng = rng || Math.random;
    this.precomputeAlias(probabilities);
  }
  Sample.prototype.next = function(numOfSamples) {
    var n = numOfSamples || 1, out = [], i = 0;
    do {
      var c = Math.floor(this.rng() * this.prob.length);
      out[i] = this.outcomes[this.rng() < this.prob[c] ? c : this.alias[c]];
    } while (++i < n);
    return n > 1 ? out : out[0];
  };
  Sample.prototype.precomputeAlias = function(p) {
    var n = p.length, sum = 0, nS = 0, nL = 0, P = [], S = [], L = [], g, i, a;
    for (i = 0; i < n; ++i) {
      if (p[i] < 0) {
        throw "Probability must be a positive: p[" + i + "]=" + p[i];
      }
      sum += p[i];
    }
    if (sum === 0) {
      throw "Probability cannot be zero.";
    }
    for (i = 0; i < n; ++i) {
      P[i] = p[i] * n / sum;
    }
    for (i = n - 1; i >= 0; --i) {
      if (P[i] < 1)
        S[nS++] = i;
      else
        L[nL++] = i;
    }
    while (nS && nL) {
      a = S[--nS];
      g = L[--nL];
      this.prob[a] = P[a];
      this.alias[a] = g;
      P[g] = P[g] + P[a] - 1;
      if (P[g] < 1)
        S[nS++] = g;
      else
        L[nL++] = g;
    }
    while (nL)
      this.prob[L[--nL]] = 1;
    while (nS)
      this.prob[S[--nS]] = 1;
  };
  Sample.prototype.indexedOutcomes = function(n) {
    var o = [];
    for (var i = 0; i < n; i++) o[i] = i;
    return o;
  };
  Sample.prototype.randomInt = function(min, max) {
    return Math.floor(this.rng() * (max - min)) + min;
  };
  aliasSampling = function(probabilities, outcomes, rng) {
    return new Sample(probabilities, outcomes, rng);
  };
  return aliasSampling;
}
var aliasSamplingExports = requireAliasSampling();
const randomSampler = /* @__PURE__ */ getDefaultExportFromCjs(aliasSamplingExports);
var __spreadArrays$3 = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var chooseDegree = function(seqLenth, rng) {
  var degreeProbabilities = __spreadArrays$3(new Array(seqLenth)).map(function(_, index2) {
    return 1 / (index2 + 1);
  });
  var degreeChooser = randomSampler(degreeProbabilities, null, rng.nextDouble);
  return degreeChooser.next() + 1;
};
var shuffle = function(items, rng) {
  var remaining = __spreadArrays$3(items);
  var result = [];
  while (remaining.length > 0) {
    var index2 = rng.nextInt(0, remaining.length - 1);
    var item = remaining[index2];
    remaining.splice(index2, 1);
    result.push(item);
  }
  return result;
};
var chooseFragments = function(seqNum, seqLength, checksum) {
  if (seqNum <= seqLength) {
    return [seqNum - 1];
  } else {
    var seed = bufferExports.Buffer.concat([intToBytes(seqNum), intToBytes(checksum)]);
    var rng = new Xoshiro(seed);
    var degree = chooseDegree(seqLength, rng);
    var indexes = __spreadArrays$3(new Array(seqLength)).map(function(_, index2) {
      return index2;
    });
    var shuffledIndexes = shuffle(indexes, rng);
    return shuffledIndexes.slice(0, degree);
  }
};
var FountainEncoderPart = (
  /** @class */
  (function() {
    function FountainEncoderPart2(_seqNum, _seqLength, _messageLength, _checksum, _fragment) {
      this._seqNum = _seqNum;
      this._seqLength = _seqLength;
      this._messageLength = _messageLength;
      this._checksum = _checksum;
      this._fragment = _fragment;
    }
    Object.defineProperty(FountainEncoderPart2.prototype, "messageLength", {
      get: function() {
        return this._messageLength;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoderPart2.prototype, "fragment", {
      get: function() {
        return this._fragment;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoderPart2.prototype, "seqNum", {
      get: function() {
        return this._seqNum;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoderPart2.prototype, "seqLength", {
      get: function() {
        return this._seqLength;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoderPart2.prototype, "checksum", {
      get: function() {
        return this._checksum;
      },
      enumerable: false,
      configurable: true
    });
    FountainEncoderPart2.prototype.cbor = function() {
      var result = cborEncode([
        this._seqNum,
        this._seqLength,
        this._messageLength,
        this._checksum,
        this._fragment
      ]);
      return bufferExports.Buffer.from(result);
    };
    FountainEncoderPart2.prototype.description = function() {
      return "seqNum:" + this._seqNum + ", seqLen:" + this._seqLength + ", messageLen:" + this._messageLength + ", checksum:" + this._checksum + ", data:" + this._fragment.toString("hex");
    };
    FountainEncoderPart2.fromCBOR = function(cborPayload) {
      var _a = cborDecode(cborPayload), seqNum = _a[0], seqLength = _a[1], messageLength = _a[2], checksum = _a[3], fragment = _a[4];
      if (typeof seqNum !== "number" || typeof seqLength !== "number" || typeof messageLength !== "number" || typeof checksum !== "number" || bufferExports.Buffer.isBuffer(fragment) && fragment.length <= 0) {
        throw new Error("type error");
      }
      return new FountainEncoderPart2(seqNum, seqLength, messageLength, checksum, bufferExports.Buffer.from(fragment));
    };
    return FountainEncoderPart2;
  })()
);
var FountainEncoder = (
  /** @class */
  (function() {
    function FountainEncoder2(message, maxFragmentLength, firstSeqNum, minFragmentLength) {
      if (maxFragmentLength === void 0) {
        maxFragmentLength = 100;
      }
      if (firstSeqNum === void 0) {
        firstSeqNum = 0;
      }
      if (minFragmentLength === void 0) {
        minFragmentLength = 10;
      }
      var fragmentLength = FountainEncoder2.findNominalFragmentLength(message.length, minFragmentLength, maxFragmentLength);
      this._messageLength = message.length;
      this._fragments = FountainEncoder2.partitionMessage(message, fragmentLength);
      this.fragmentLength = fragmentLength;
      this.seqNum = toUint32(firstSeqNum);
      this.checksum = getCRC(message);
    }
    Object.defineProperty(FountainEncoder2.prototype, "fragmentsLength", {
      get: function() {
        return this._fragments.length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoder2.prototype, "fragments", {
      get: function() {
        return this._fragments;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainEncoder2.prototype, "messageLength", {
      get: function() {
        return this._messageLength;
      },
      enumerable: false,
      configurable: true
    });
    FountainEncoder2.prototype.isComplete = function() {
      return this.seqNum >= this._fragments.length;
    };
    FountainEncoder2.prototype.isSinglePart = function() {
      return this._fragments.length === 1;
    };
    FountainEncoder2.prototype.seqLength = function() {
      return this._fragments.length;
    };
    FountainEncoder2.prototype.mix = function(indexes) {
      var _this = this;
      return indexes.reduce(function(result, index2) {
        return bufferXOR(_this._fragments[index2], result);
      }, bufferExports.Buffer.alloc(this.fragmentLength, 0));
    };
    FountainEncoder2.prototype.nextPart = function() {
      this.seqNum = toUint32(this.seqNum + 1);
      var indexes = chooseFragments(this.seqNum, this._fragments.length, this.checksum);
      var mixed = this.mix(indexes);
      return new FountainEncoderPart(this.seqNum, this._fragments.length, this._messageLength, this.checksum, mixed);
    };
    FountainEncoder2.findNominalFragmentLength = function(messageLength, minFragmentLength, maxFragmentLength) {
      if (messageLength <= 0 || minFragmentLength <= 0 || maxFragmentLength < minFragmentLength) {
        throw new Error("invalid fragment or message length");
      }
      var maxFragmentCount = Math.ceil(messageLength / minFragmentLength);
      var fragmentLength = 0;
      for (var fragmentCount = 1; fragmentCount <= maxFragmentCount; fragmentCount++) {
        fragmentLength = Math.ceil(messageLength / fragmentCount);
        if (fragmentLength <= maxFragmentLength) {
          break;
        }
      }
      return fragmentLength;
    };
    FountainEncoder2.partitionMessage = function(message, fragmentLength) {
      var _a;
      var remaining = bufferExports.Buffer.from(message);
      var fragment;
      var _fragments = [];
      while (remaining.length > 0) {
        _a = split(remaining, -fragmentLength), fragment = _a[0], remaining = _a[1];
        fragment = bufferExports.Buffer.alloc(fragmentLength, 0).fill(fragment, 0, fragment.length);
        _fragments.push(fragment);
      }
      return _fragments;
    };
    return FountainEncoder2;
  })()
);
var __spreadArrays$2 = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var bytewords = "ableacidalsoapexaquaarchatomauntawayaxisbackbaldbarnbeltbetabiasbluebodybragbrewbulbbuzzcalmcashcatschefcityclawcodecolacookcostcruxcurlcuspcyandarkdatadaysdelidicedietdoordowndrawdropdrumdulldutyeacheasyechoedgeepicevenexamexiteyesfactfairfernfigsfilmfishfizzflapflewfluxfoxyfreefrogfuelfundgalagamegeargemsgiftgirlglowgoodgraygrimgurugushgyrohalfhanghardhawkheathelphighhillholyhopehornhutsicedideaidleinchinkyintoirisironitemjadejazzjoinjoltjowljudojugsjumpjunkjurykeepkenokeptkeyskickkilnkingkitekiwiknoblamblavalazyleaflegsliarlimplionlistlogoloudloveluaulucklungmainmanymathmazememomenumeowmildmintmissmonknailnavyneednewsnextnoonnotenumbobeyoboeomitonyxopenovalowlspaidpartpeckplaypluspoempoolposepuffpumapurrquadquizraceramprealredorichroadrockroofrubyruinrunsrustsafesagascarsetssilkskewslotsoapsolosongstubsurfswantacotasktaxitenttiedtimetinytoiltombtoystriptunatwinuglyundouniturgeuservastveryvetovialvibeviewvisavoidvowswallwandwarmwaspwavewaxywebswhatwhenwhizwolfworkyankyawnyellyogayurtzapszerozestzinczonezoom";
var bytewordsLookUpTable = [];
var BYTEWORDS_NUM = 256;
var BYTEWORD_LENGTH = 4;
var MINIMAL_BYTEWORD_LENGTH = 2;
var STYLES;
(function(STYLES2) {
  STYLES2["STANDARD"] = "standard";
  STYLES2["URI"] = "uri";
  STYLES2["MINIMAL"] = "minimal";
})(STYLES || (STYLES = {}));
var getWord = function(index2) {
  return bytewords.slice(index2 * BYTEWORD_LENGTH, index2 * BYTEWORD_LENGTH + BYTEWORD_LENGTH);
};
var getMinimalWord = function(index2) {
  var byteword = getWord(index2);
  return "" + byteword[0] + byteword[BYTEWORD_LENGTH - 1];
};
var addCRC = function(string) {
  var crc = getCRCHex(bufferExports.Buffer.from(string, "hex"));
  return "" + string + crc;
};
var encodeWithSeparator = function(word, separator) {
  var crcAppendedWord = addCRC(word);
  var crcWordBuff = bufferExports.Buffer.from(crcAppendedWord, "hex");
  var result = crcWordBuff.reduce(function(result2, w) {
    return __spreadArrays$2(result2, [getWord(w)]);
  }, []);
  return result.join(separator);
};
var encodeMinimal = function(word) {
  var crcAppendedWord = addCRC(word);
  var crcWordBuff = bufferExports.Buffer.from(crcAppendedWord, "hex");
  var result = crcWordBuff.reduce(function(result2, w) {
    return result2 + getMinimalWord(w);
  }, "");
  return result;
};
var decodeWord = function(word, wordLength) {
  if (word.length !== wordLength) {
    throw new Error("'Invalid Bytewords: word.length does not match wordLength provided'");
  }
  var dim = 26;
  if (bytewordsLookUpTable.length === 0) {
    var array_len = dim * dim;
    bytewordsLookUpTable = __spreadArrays$2(new Array(array_len)).map(function() {
      return -1;
    });
    for (var i = 0; i < BYTEWORDS_NUM; i++) {
      var byteword = getWord(i);
      var x_1 = byteword[0].charCodeAt(0) - "a".charCodeAt(0);
      var y_1 = byteword[3].charCodeAt(0) - "a".charCodeAt(0);
      var offset_1 = y_1 * dim + x_1;
      bytewordsLookUpTable[offset_1] = i;
    }
  }
  var x = word[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
  var y = word[wordLength == 4 ? 3 : 1].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
  if (!(0 <= x && x < dim && 0 <= y && y < dim)) {
    throw new Error("Invalid Bytewords: invalid word");
  }
  var offset = y * dim + x;
  var value = bytewordsLookUpTable[offset];
  if (value === -1) {
    throw new Error("Invalid Bytewords: value not in lookup table");
  }
  if (wordLength == BYTEWORD_LENGTH) {
    var byteword = getWord(value);
    var c1 = word[1].toLowerCase();
    var c2 = word[2].toLowerCase();
    if (!(c1 === byteword[1] && c2 === byteword[2])) {
      throw new Error("Invalid Bytewords: invalid middle letters of word");
    }
  }
  return bufferExports.Buffer.from([value]).toString("hex");
};
var _decode = function(string, separator, wordLength) {
  var words = wordLength == BYTEWORD_LENGTH ? string.split(separator) : partition(string, 2);
  var decodedString = words.map(function(word) {
    return decodeWord(word, wordLength);
  }).join("");
  if (decodedString.length < 5) {
    throw new Error("Invalid Bytewords: invalid decoded string length");
  }
  var _a = split(bufferExports.Buffer.from(decodedString, "hex"), 4), body = _a[0], bodyChecksum = _a[1];
  var checksum = getCRCHex(body);
  if (checksum !== bodyChecksum.toString("hex")) {
    throw new Error("Invalid Checksum");
  }
  return body.toString("hex");
};
var decode = function(string, style) {
  if (style === void 0) {
    style = STYLES.MINIMAL;
  }
  switch (style) {
    case STYLES.STANDARD:
      return _decode(string, " ", BYTEWORD_LENGTH);
    case STYLES.URI:
      return _decode(string, "-", BYTEWORD_LENGTH);
    case STYLES.MINIMAL:
      return _decode(string, "", MINIMAL_BYTEWORD_LENGTH);
    default:
      throw new Error("Invalid style " + style);
  }
};
var encode$1 = function(string, style) {
  if (style === void 0) {
    style = STYLES.MINIMAL;
  }
  switch (style) {
    case STYLES.STANDARD:
      return encodeWithSeparator(string, " ");
    case STYLES.URI:
      return encodeWithSeparator(string, "-");
    case STYLES.MINIMAL:
      return encodeMinimal(string);
    default:
      throw new Error("Invalid style " + style);
  }
};
const bytewords$1 = {
  decode,
  encode: encode$1,
  STYLES
};
var __spreadArrays$1 = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var UREncoder = (
  /** @class */
  (function() {
    function UREncoder2(_ur, maxFragmentLength, firstSeqNum, minFragmentLength) {
      this.ur = _ur;
      this.fountainEncoder = new FountainEncoder(_ur.cbor, maxFragmentLength, firstSeqNum, minFragmentLength);
    }
    Object.defineProperty(UREncoder2.prototype, "fragmentsLength", {
      get: function() {
        return this.fountainEncoder.fragmentsLength;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(UREncoder2.prototype, "fragments", {
      get: function() {
        return this.fountainEncoder.fragments;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(UREncoder2.prototype, "messageLength", {
      get: function() {
        return this.fountainEncoder.messageLength;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(UREncoder2.prototype, "cbor", {
      get: function() {
        return this.ur.cbor;
      },
      enumerable: false,
      configurable: true
    });
    UREncoder2.prototype.encodeWhole = function() {
      var _this = this;
      return __spreadArrays$1(new Array(this.fragmentsLength)).map(function() {
        return _this.nextPart();
      });
    };
    UREncoder2.prototype.nextPart = function() {
      var part = this.fountainEncoder.nextPart();
      if (this.fountainEncoder.isSinglePart()) {
        return UREncoder2.encodeSinglePart(this.ur);
      } else {
        return UREncoder2.encodePart(this.ur.type, part);
      }
    };
    UREncoder2.encodeUri = function(scheme, pathComponents) {
      var path = pathComponents.join("/");
      return [scheme, path].join(":");
    };
    UREncoder2.encodeUR = function(pathComponents) {
      return UREncoder2.encodeUri("ur", pathComponents);
    };
    UREncoder2.encodePart = function(type, part) {
      var seq = part.seqNum + "-" + part.seqLength;
      var body = bytewords$1.encode(part.cbor().toString("hex"), bytewords$1.STYLES.MINIMAL);
      return UREncoder2.encodeUR([type, seq, body]);
    };
    UREncoder2.encodeSinglePart = function(ur) {
      var body = bytewords$1.encode(ur.cbor.toString("hex"), bytewords$1.STYLES.MINIMAL);
      return UREncoder2.encodeUR([ur.type, body]);
    };
    return UREncoder2;
  })()
);
var __spreadArrays = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var FountainDecoderPart = (
  /** @class */
  (function() {
    function FountainDecoderPart2(_indexes, _fragment) {
      this._indexes = _indexes;
      this._fragment = _fragment;
    }
    Object.defineProperty(FountainDecoderPart2.prototype, "indexes", {
      get: function() {
        return this._indexes;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FountainDecoderPart2.prototype, "fragment", {
      get: function() {
        return this._fragment;
      },
      enumerable: false,
      configurable: true
    });
    FountainDecoderPart2.fromEncoderPart = function(encoderPart) {
      var indexes = chooseFragments(encoderPart.seqNum, encoderPart.seqLength, encoderPart.checksum);
      var fragment = encoderPart.fragment;
      return new FountainDecoderPart2(indexes, fragment);
    };
    FountainDecoderPart2.prototype.isSimple = function() {
      return this.indexes.length === 1;
    };
    return FountainDecoderPart2;
  })()
);
var FountainDecoder = (
  /** @class */
  (function() {
    function FountainDecoder2() {
      this.result = void 0;
      this.expectedMessageLength = 0;
      this.expectedChecksum = 0;
      this.expectedFragmentLength = 0;
      this.processedPartsCount = 0;
      this.expectedPartIndexes = [];
      this.lastPartIndexes = [];
      this.queuedParts = [];
      this.receivedPartIndexes = [];
      this.mixedParts = [];
      this.simpleParts = [];
    }
    FountainDecoder2.prototype.validatePart = function(part) {
      var _this = this;
      if (this.expectedPartIndexes.length === 0) {
        __spreadArrays(new Array(part.seqLength)).forEach(function(_, index2) {
          return _this.expectedPartIndexes.push(index2);
        });
        this.expectedMessageLength = part.messageLength;
        this.expectedChecksum = part.checksum;
        this.expectedFragmentLength = part.fragment.length;
      } else {
        if (this.expectedPartIndexes.length !== part.seqLength) {
          return false;
        }
        if (this.expectedMessageLength !== part.messageLength) {
          return false;
        }
        if (this.expectedChecksum !== part.checksum) {
          return false;
        }
        if (this.expectedFragmentLength !== part.fragment.length) {
          return false;
        }
      }
      return true;
    };
    FountainDecoder2.prototype.reducePartByPart = function(a, b) {
      if (arrayContains(a.indexes, b.indexes)) {
        var newIndexes = setDifference(a.indexes, b.indexes);
        var newFragment = bufferXOR(a.fragment, b.fragment);
        return new FountainDecoderPart(newIndexes, newFragment);
      } else {
        return a;
      }
    };
    FountainDecoder2.prototype.reduceMixedBy = function(part) {
      var _this = this;
      var newMixed = [];
      this.mixedParts.map(function(_a) {
        var mixedPart = _a.value;
        return _this.reducePartByPart(mixedPart, part);
      }).forEach(function(reducedPart) {
        if (reducedPart.isSimple()) {
          _this.queuedParts.push(reducedPart);
        } else {
          newMixed.push({ key: reducedPart.indexes, value: reducedPart });
        }
      });
      this.mixedParts = newMixed;
    };
    FountainDecoder2.prototype.processSimplePart = function(part) {
      var fragmentIndex = part.indexes[0];
      if (this.receivedPartIndexes.includes(fragmentIndex)) {
        return;
      }
      this.simpleParts.push({ key: part.indexes, value: part });
      this.receivedPartIndexes.push(fragmentIndex);
      if (arraysEqual(this.receivedPartIndexes, this.expectedPartIndexes)) {
        var sortedParts = this.simpleParts.map(function(_a) {
          var value = _a.value;
          return value;
        }).sort(function(a, b) {
          return a.indexes[0] - b.indexes[0];
        });
        var message = FountainDecoder2.joinFragments(sortedParts.map(function(part2) {
          return part2.fragment;
        }), this.expectedMessageLength);
        var checksum = getCRC(message);
        if (checksum === this.expectedChecksum) {
          this.result = message;
        } else {
          this.error = new InvalidChecksumError();
        }
      } else {
        this.reduceMixedBy(part);
      }
    };
    FountainDecoder2.prototype.processMixedPart = function(part) {
      var _this = this;
      if (this.mixedParts.some(function(_a) {
        var indexes = _a.key;
        return arraysEqual(indexes, part.indexes);
      })) {
        return;
      }
      var p2 = this.simpleParts.reduce(function(acc, _a) {
        var p = _a.value;
        return _this.reducePartByPart(acc, p);
      }, part);
      p2 = this.mixedParts.reduce(function(acc, _a) {
        var p = _a.value;
        return _this.reducePartByPart(acc, p);
      }, p2);
      if (p2.isSimple()) {
        this.queuedParts.push(p2);
      } else {
        this.reduceMixedBy(p2);
        this.mixedParts.push({ key: p2.indexes, value: p2 });
      }
    };
    FountainDecoder2.prototype.processQueuedItem = function() {
      if (this.queuedParts.length === 0) {
        return;
      }
      var part = this.queuedParts.shift();
      if (part.isSimple()) {
        this.processSimplePart(part);
      } else {
        this.processMixedPart(part);
      }
    };
    FountainDecoder2.prototype.receivePart = function(encoderPart) {
      if (this.isComplete()) {
        return false;
      }
      if (!this.validatePart(encoderPart)) {
        return false;
      }
      var decoderPart = FountainDecoderPart.fromEncoderPart(encoderPart);
      this.lastPartIndexes = decoderPart.indexes;
      this.queuedParts.push(decoderPart);
      while (!this.isComplete() && this.queuedParts.length > 0) {
        this.processQueuedItem();
      }
      this.processedPartsCount += 1;
      return true;
    };
    FountainDecoder2.prototype.isComplete = function() {
      return Boolean(this.result !== void 0 && this.result.length > 0);
    };
    FountainDecoder2.prototype.isSuccess = function() {
      return Boolean(this.error === void 0 && this.isComplete());
    };
    FountainDecoder2.prototype.resultMessage = function() {
      return this.isSuccess() ? this.result : bufferExports.Buffer.from([]);
    };
    FountainDecoder2.prototype.isFailure = function() {
      return this.error !== void 0;
    };
    FountainDecoder2.prototype.resultError = function() {
      return this.error ? this.error.message : "";
    };
    FountainDecoder2.prototype.expectedPartCount = function() {
      return this.expectedPartIndexes.length;
    };
    FountainDecoder2.prototype.getExpectedPartIndexes = function() {
      return __spreadArrays(this.expectedPartIndexes);
    };
    FountainDecoder2.prototype.getReceivedPartIndexes = function() {
      return __spreadArrays(this.receivedPartIndexes);
    };
    FountainDecoder2.prototype.getLastPartIndexes = function() {
      return __spreadArrays(this.lastPartIndexes);
    };
    FountainDecoder2.prototype.estimatedPercentComplete = function() {
      if (this.isComplete()) {
        return 1;
      }
      var expectedPartCount = this.expectedPartCount();
      if (expectedPartCount === 0) {
        return 0;
      }
      return Math.min(0.99, this.processedPartsCount / (expectedPartCount * 1.75));
    };
    FountainDecoder2.prototype.getProgress = function() {
      if (this.isComplete()) {
        return 1;
      }
      var expectedPartCount = this.expectedPartCount();
      if (expectedPartCount === 0) {
        return 0;
      }
      return this.receivedPartIndexes.length / expectedPartCount;
    };
    FountainDecoder2.joinFragments = function(fragments, messageLength) {
      return bufferExports.Buffer.concat(fragments).slice(0, messageLength);
    };
    return FountainDecoder2;
  })()
);
var URDecoder = (
  /** @class */
  (function() {
    function URDecoder2(fountainDecoder, type) {
      if (fountainDecoder === void 0) {
        fountainDecoder = new FountainDecoder();
      }
      if (type === void 0) {
        type = "bytes";
      }
      this.fountainDecoder = fountainDecoder;
      this.type = type;
      if (!isURType(type)) {
        throw new Error("Invalid UR type");
      }
      this.expected_type = "";
    }
    URDecoder2.decodeBody = function(type, message) {
      var cbor = bytewords$1.decode(message, bytewords$1.STYLES.MINIMAL);
      return new UR(bufferExports.Buffer.from(cbor, "hex"), type);
    };
    URDecoder2.prototype.validatePart = function(type) {
      if (this.expected_type) {
        return this.expected_type === type;
      }
      if (!isURType(type)) {
        return false;
      }
      this.expected_type = type;
      return true;
    };
    URDecoder2.decode = function(message) {
      var _a = this.parse(message), type = _a[0], components = _a[1];
      if (components.length === 0) {
        throw new InvalidPathLengthError();
      }
      var body = components[0];
      return URDecoder2.decodeBody(type, body);
    };
    URDecoder2.parse = function(message) {
      var lowercase = message.toLowerCase();
      var prefix = lowercase.slice(0, 3);
      if (prefix !== "ur:") {
        throw new InvalidSchemeError();
      }
      var components = lowercase.slice(3).split("/");
      var type = components[0];
      if (components.length < 2) {
        throw new InvalidPathLengthError();
      }
      if (!isURType(type)) {
        throw new InvalidTypeError();
      }
      return [type, components.slice(1)];
    };
    URDecoder2.parseSequenceComponent = function(s) {
      var components = s.split("-");
      if (components.length !== 2) {
        throw new InvalidSequenceComponentError();
      }
      var seqNum = toUint32(Number(components[0]));
      var seqLength = Number(components[1]);
      if (seqNum < 1 || seqLength < 1) {
        throw new InvalidSequenceComponentError();
      }
      return [seqNum, seqLength];
    };
    URDecoder2.prototype.receivePart = function(s) {
      if (this.result !== void 0) {
        return false;
      }
      var _a = URDecoder2.parse(s), type = _a[0], components = _a[1];
      if (!this.validatePart(type)) {
        return false;
      }
      if (components.length === 1) {
        this.result = URDecoder2.decodeBody(type, components[0]);
        return true;
      }
      if (components.length !== 2) {
        throw new InvalidPathLengthError();
      }
      var seq = components[0], fragment = components[1];
      var _b = URDecoder2.parseSequenceComponent(seq), seqNum = _b[0], seqLength = _b[1];
      var cbor = bytewords$1.decode(fragment, bytewords$1.STYLES.MINIMAL);
      var part = FountainEncoderPart.fromCBOR(cbor);
      if (seqNum !== part.seqNum || seqLength !== part.seqLength) {
        return false;
      }
      if (!this.fountainDecoder.receivePart(part)) {
        return false;
      }
      if (this.fountainDecoder.isSuccess()) {
        this.result = new UR(this.fountainDecoder.resultMessage(), type);
      } else if (this.fountainDecoder.isFailure()) {
        this.error = new InvalidSchemeError();
      }
      return true;
    };
    URDecoder2.prototype.resultUR = function() {
      return this.result ? this.result : new UR(bufferExports.Buffer.from([]));
    };
    URDecoder2.prototype.isComplete = function() {
      return this.result && this.result.cbor.length > 0 ? true : false;
    };
    URDecoder2.prototype.isSuccess = function() {
      return !this.error && this.isComplete();
    };
    URDecoder2.prototype.isError = function() {
      return this.error !== void 0;
    };
    URDecoder2.prototype.resultError = function() {
      return this.error ? this.error.message : "";
    };
    URDecoder2.prototype.expectedPartCount = function() {
      return this.fountainDecoder.expectedPartCount();
    };
    URDecoder2.prototype.expectedPartIndexes = function() {
      return this.fountainDecoder.getExpectedPartIndexes();
    };
    URDecoder2.prototype.receivedPartIndexes = function() {
      return this.fountainDecoder.getReceivedPartIndexes();
    };
    URDecoder2.prototype.lastPartIndexes = function() {
      return this.fountainDecoder.getLastPartIndexes();
    };
    URDecoder2.prototype.estimatedPercentComplete = function() {
      return this.fountainDecoder.estimatedPercentComplete();
    };
    URDecoder2.prototype.getProgress = function() {
      return this.fountainDecoder.getProgress();
    };
    return URDecoder2;
  })()
);
const qrcode = function(typeNumber, errorCorrectionLevel) {
  const PAD0 = 236;
  const PAD1 = 17;
  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];
  const _this = {};
  const makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    })(_moduleCount);
    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }
    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }
    mapData(_dataCache, maskPattern);
  };
  const setupPositionProbePattern = function(row, col) {
    for (let r = -1; r <= 7; r += 1) {
      if (row + r <= -1 || _moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c += 1) {
        if (col + c <= -1 || _moduleCount <= col + c) continue;
        if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };
  const getBestMaskPattern = function() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i = 0; i < 8; i += 1) {
      makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(_this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  };
  const setupTimingPattern = function() {
    for (let r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = r % 2 == 0;
    }
    for (let c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = c % 2 == 0;
    }
  };
  const setupPositionAdjustPattern = function() {
    const pos = QRUtil.getPatternPosition(_typeNumber);
    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        const row = pos[i];
        const col = pos[j];
        if (_modules[row][col] != null) {
          continue;
        }
        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };
  const setupTypeNumber = function(test) {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (let i = 0; i < 18; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }
    for (let i = 0; i < 18; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };
  const setupTypeInfo = function(test, maskPattern) {
    const data = _errorCorrectionLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 6) {
        _modules[i][8] = mod;
      } else if (i < 8) {
        _modules[i + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod;
      }
    }
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod;
      } else {
        _modules[8][15 - i - 1] = mod;
      }
    }
    _modules[_moduleCount - 8][8] = !test;
  };
  const mapData = function(data, maskPattern) {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col -= 1;
      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (_modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = maskFunc(row, col - c);
            if (mask) {
              dark = !dark;
            }
            _modules[row][col - c] = dark;
            bitIndex -= 1;
            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };
  const createBytes = function(buffer2, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r += 1) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 255 & buffer2.getBuffer()[i + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index2 = 0;
    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index2] = dcdata[r][i];
          index2 += 1;
        }
      }
    }
    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index2] = ecdata[r][i];
          index2 += 1;
        }
      }
    }
    return data;
  };
  const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
    const buffer2 = qrBitBuffer();
    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer2.put(data.getMode(), 4);
      buffer2.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
      data.write(buffer2);
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer2.getLengthInBits() > totalDataCount * 8) {
      throw "code length overflow. (" + buffer2.getLengthInBits() + ">" + totalDataCount * 8 + ")";
    }
    if (buffer2.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer2.put(0, 4);
    }
    while (buffer2.getLengthInBits() % 8 != 0) {
      buffer2.putBit(false);
    }
    while (true) {
      if (buffer2.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer2.put(PAD0, 8);
      if (buffer2.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer2.put(PAD1, 8);
    }
    return createBytes(buffer2, rsBlocks);
  };
  _this.addData = function(data, mode) {
    mode = mode || "Byte";
    let newData = null;
    switch (mode) {
      case "Numeric":
        newData = qrNumber(data);
        break;
      case "Alphanumeric":
        newData = qrAlphaNum(data);
        break;
      case "Byte":
        newData = qr8BitByte(data);
        break;
      case "Kanji":
        newData = qrKanji(data);
        break;
      default:
        throw "mode:" + mode;
    }
    _dataList.push(newData);
    _dataCache = null;
  };
  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + "," + col;
    }
    return _modules[row][col];
  };
  _this.getModuleCount = function() {
    return _moduleCount;
  };
  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber2 = 1;
      for (; typeNumber2 < 40; typeNumber2++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
        const buffer2 = qrBitBuffer();
        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer2.put(data.getMode(), 4);
          buffer2.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer2);
        }
        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer2.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      _typeNumber = typeNumber2;
    }
    makeImpl(false, getBestMaskPattern());
  };
  _this.createTableTag = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    let qrHtml = "";
    qrHtml += '<table style="';
    qrHtml += " border-width: 0px; border-style: none;";
    qrHtml += " border-collapse: collapse;";
    qrHtml += " padding: 0px; margin: " + margin + "px;";
    qrHtml += '">';
    qrHtml += "<tbody>";
    for (let r = 0; r < _this.getModuleCount(); r += 1) {
      qrHtml += "<tr>";
      for (let c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: 0px;";
        qrHtml += " width: " + cellSize + "px;";
        qrHtml += " height: " + cellSize + "px;";
        qrHtml += " background-color: ";
        qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
        qrHtml += ";";
        qrHtml += '"/>';
      }
      qrHtml += "</tr>";
    }
    qrHtml += "</tbody>";
    qrHtml += "</table>";
    return qrHtml;
  };
  _this.createSvgTag = function(cellSize, margin, alt, title) {
    let opts = {};
    if (typeof arguments[0] == "object") {
      opts = arguments[0];
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    alt = typeof alt === "string" ? { text: alt } : alt || {};
    alt.text = alt.text || null;
    alt.id = alt.text ? alt.id || "qrcode-description" : null;
    title = typeof title === "string" ? { text: title } : title || {};
    title.text = title.text || null;
    title.id = title.text ? title.id || "qrcode-title" : null;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c, mc, r, mr, qrSvg = "", rect;
    rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
    qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
    qrSvg += ">";
    qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
    qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';
    for (r = 0; r < _this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < _this.getModuleCount(); c += 1) {
        if (_this.isDark(r, c)) {
          mc = c * cellSize + margin;
          qrSvg += "M" + mc + "," + mr + rect;
        }
      }
    }
    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += "</svg>";
    return qrSvg;
  };
  _this.createDataURL = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    return createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        const c = Math.floor((x - min) / cellSize);
        const r = Math.floor((y - min) / cellSize);
        return _this.isDark(r, c) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };
  _this.createImgTag = function(cellSize, margin, alt) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let img = "";
    img += "<img";
    img += ' src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += ' width="';
    img += size;
    img += '"';
    img += ' height="';
    img += size;
    img += '"';
    if (alt) {
      img += ' alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += "/>";
    return img;
  };
  const escapeXml = function(s) {
    let escaped = "";
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charAt(i);
      switch (c) {
        case "<":
          escaped += "&lt;";
          break;
        case ">":
          escaped += "&gt;";
          break;
        case "&":
          escaped += "&amp;";
          break;
        case '"':
          escaped += "&quot;";
          break;
        default:
          escaped += c;
          break;
      }
    }
    return escaped;
  };
  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r1, r2, p;
    const blocks = {
      "██": "█",
      "█ ": "▀",
      " █": "▄",
      "  ": " "
    };
    const blocksLastLineNoMargin = {
      "██": "▀",
      "█ ": "▀",
      " █": " ",
      "  ": " "
    };
    let ascii = "";
    for (y = 0; y < size; y += 2) {
      r1 = Math.floor((y - min) / cellSize);
      r2 = Math.floor((y + 1 - min) / cellSize);
      for (x = 0; x < size; x += 1) {
        p = "█";
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
          p = " ";
        }
        if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
          p += " ";
        } else {
          p += "█";
        }
        ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
      }
      ascii += "\n";
    }
    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("▀");
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;
    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }
    cellSize -= 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r, p;
    const white = Array(cellSize + 1).join("██");
    const black = Array(cellSize + 1).join("  ");
    let ascii = "";
    let line = "";
    for (y = 0; y < size; y += 1) {
      r = Math.floor((y - min) / cellSize);
      line = "";
      for (x = 0; x < size; x += 1) {
        p = 1;
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
          p = 0;
        }
        line += p ? white : black;
      }
      for (r = 0; r < cellSize; r += 1) {
        ascii += line + "\n";
      }
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? "black" : "white";
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };
  return _this;
};
qrcode.stringToBytes = function(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    bytes.push(c & 255);
  }
  return bytes;
};
qrcode.createStringToBytes = function(unicodeData, numChars) {
  const unicodeMap = (function() {
    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b = bin.read();
      if (b == -1) throw "eof";
      return b;
    };
    let count = 0;
    const unicodeMap2 = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k = String.fromCharCode(b0 << 8 | b1);
      const v = b2 << 8 | b3;
      unicodeMap2[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw count + " != " + numChars;
    }
    return unicodeMap2;
  })();
  const unknownChar = "?".charCodeAt(0);
  return function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        const b = unicodeMap[s.charAt(i)];
        if (typeof b == "number") {
          if ((b & 255) == b) {
            bytes.push(b);
          } else {
            bytes.push(b >>> 8);
            bytes.push(b & 255);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};
const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
const QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
const QRUtil = (function() {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const _this = {};
  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };
  _this.getBCHTypeInfo = function(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
    }
    return (data << 10 | d) ^ G15_MASK;
  };
  _this.getBCHTypeNumber = function(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
    }
    return data << 12 | d;
  };
  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };
  _this.getMaskFunction = function(maskPattern) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i, j) {
          return (i + j) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i, j) {
          return i % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i, j) {
          return j % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i, j) {
          return (i + j) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i, j) {
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i, j) {
          return i * j % 2 + i * j % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i, j) {
          return (i * j % 2 + i * j % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i, j) {
          return (i * j % 3 + (i + j) % 2) % 2 == 0;
        };
      default:
        throw "bad maskPattern:" + maskPattern;
    }
  };
  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a = qrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  };
  _this.getLengthInBits = function(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw "mode:" + mode;
      }
    } else {
      throw "type:" + type;
    }
  };
  _this.getLostPoint = function(qrcode2) {
    const moduleCount = qrcode2.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode2.isDark(row, col);
        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r == 0 && c == 0) {
              continue;
            }
            if (dark == qrcode2.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode2.isDark(row, col)) count += 1;
        if (qrcode2.isDark(row + 1, col)) count += 1;
        if (qrcode2.isDark(row, col + 1)) count += 1;
        if (qrcode2.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode2.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  };
  return _this;
})();
const QRMath = (function() {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
  }
  const _this = {};
  _this.glog = function(n) {
    if (n < 1) {
      throw "glog(" + n + ")";
    }
    return LOG_TABLE[n];
  };
  _this.gexp = function(n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return EXP_TABLE[n];
  };
  return _this;
})();
const qrPolynomial = function(num, shift) {
  if (typeof num.length == "undefined") {
    throw num.length + "/" + shift;
  }
  const _num = (function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num2 = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      _num2[i] = num[i + offset];
    }
    return _num2;
  })();
  const _this = {};
  _this.getAt = function(index2) {
    return _num[index2];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e2) {
    const num2 = new Array(_this.getLength() + e2.getLength() - 1);
    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e2.getLength(); j += 1) {
        num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e2.getAt(j)));
      }
    }
    return qrPolynomial(num2, 0);
  };
  _this.mod = function(e2) {
    if (_this.getLength() - e2.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e2.getAt(0));
    const num2 = new Array(_this.getLength());
    for (let i = 0; i < _this.getLength(); i += 1) {
      num2[i] = _this.getAt(i);
    }
    for (let i = 0; i < e2.getLength(); i += 1) {
      num2[i] ^= QRMath.gexp(QRMath.glog(e2.getAt(i)) + ratio);
    }
    return qrPolynomial(num2, 0).mod(e2);
  };
  return _this;
};
const QRRSBlock = (function() {
  const RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  const qrRSBlock = function(totalCount, dataCount) {
    const _this2 = {};
    _this2.totalCount = totalCount;
    _this2.dataCount = dataCount;
    return _this2;
  };
  const _this = {};
  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (typeof rsBlock == "undefined") {
      throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i += 1) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  return _this;
})();
const qrBitBuffer = function() {
  const _buffer = [];
  let _length = 0;
  const _this = {};
  _this.getBuffer = function() {
    return _buffer;
  };
  _this.getAt = function(index2) {
    const bufIndex = Math.floor(index2 / 8);
    return (_buffer[bufIndex] >>> 7 - index2 % 8 & 1) == 1;
  };
  _this.put = function(num, length) {
    for (let i = 0; i < length; i += 1) {
      _this.putBit((num >>> length - i - 1 & 1) == 1);
    }
  };
  _this.getLengthInBits = function() {
    return _length;
  };
  _this.putBit = function(bit) {
    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }
    if (bit) {
      _buffer[bufIndex] |= 128 >>> _length % 8;
    }
    _length += 1;
  };
  return _this;
};
const qrNumber = function(data) {
  const _mode = QRMode.MODE_NUMBER;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer2) {
    return _data.length;
  };
  _this.write = function(buffer2) {
    const data2 = _data;
    let i = 0;
    while (i + 2 < data2.length) {
      buffer2.put(strToNum(data2.substring(i, i + 3)), 10);
      i += 3;
    }
    if (i < data2.length) {
      if (data2.length - i == 1) {
        buffer2.put(strToNum(data2.substring(i, i + 1)), 4);
      } else if (data2.length - i == 2) {
        buffer2.put(strToNum(data2.substring(i, i + 2)), 7);
      }
    }
  };
  const strToNum = function(s) {
    let num = 0;
    for (let i = 0; i < s.length; i += 1) {
      num = num * 10 + chatToNum(s.charAt(i));
    }
    return num;
  };
  const chatToNum = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    }
    throw "illegal char :" + c;
  };
  return _this;
};
const qrAlphaNum = function(data) {
  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer2) {
    return _data.length;
  };
  _this.write = function(buffer2) {
    const s = _data;
    let i = 0;
    while (i + 1 < s.length) {
      buffer2.put(
        getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)),
        11
      );
      i += 2;
    }
    if (i < s.length) {
      buffer2.put(getCode(s.charAt(i)), 6);
    }
  };
  const getCode = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    } else if ("A" <= c && c <= "Z") {
      return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else {
      switch (c) {
        case " ":
          return 36;
        case "$":
          return 37;
        case "%":
          return 38;
        case "*":
          return 39;
        case "+":
          return 40;
        case "-":
          return 41;
        case ".":
          return 42;
        case "/":
          return 43;
        case ":":
          return 44;
        default:
          throw "illegal char :" + c;
      }
    }
  };
  return _this;
};
const qr8BitByte = function(data) {
  const _mode = QRMode.MODE_8BIT_BYTE;
  const _bytes = qrcode.stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer2) {
    return _bytes.length;
  };
  _this.write = function(buffer2) {
    for (let i = 0; i < _bytes.length; i += 1) {
      buffer2.put(_bytes[i], 8);
    }
  };
  return _this;
};
const qrKanji = function(data) {
  const _mode = QRMode.MODE_KANJI;
  const stringToBytes = qrcode.stringToBytes;
  !(function(c, code) {
    const test = stringToBytes(c);
    if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
      throw "sjis not supported.";
    }
  })("友", 38726);
  const _bytes = stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer2) {
    return ~~(_bytes.length / 2);
  };
  _this.write = function(buffer2) {
    const data2 = _bytes;
    let i = 0;
    while (i + 1 < data2.length) {
      let c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
      if (33088 <= c && c <= 40956) {
        c -= 33088;
      } else if (57408 <= c && c <= 60351) {
        c -= 49472;
      } else {
        throw "illegal char at " + (i + 1) + "/" + c;
      }
      c = (c >>> 8 & 255) * 192 + (c & 255);
      buffer2.put(c, 13);
      i += 2;
    }
    if (i < data2.length) {
      throw "illegal char at " + (i + 1);
    }
  };
  return _this;
};
const byteArrayOutputStream = function() {
  const _bytes = [];
  const _this = {};
  _this.writeByte = function(b) {
    _bytes.push(b & 255);
  };
  _this.writeShort = function(i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };
  _this.writeBytes = function(b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };
  _this.writeString = function(s) {
    for (let i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i));
    }
  };
  _this.toByteArray = function() {
    return _bytes;
  };
  _this.toString = function() {
    let s = "";
    s += "[";
    for (let i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ",";
      }
      s += _bytes[i];
    }
    s += "]";
    return s;
  };
  return _this;
};
const base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = "";
  const _this = {};
  const writeEncoded = function(b) {
    _base64 += String.fromCharCode(encode2(b & 63));
  };
  const encode2 = function(n) {
    if (n < 0) {
      throw "n:" + n;
    } else if (n < 26) {
      return 65 + n;
    } else if (n < 52) {
      return 97 + (n - 26);
    } else if (n < 62) {
      return 48 + (n - 52);
    } else if (n == 62) {
      return 43;
    } else if (n == 63) {
      return 47;
    } else {
      throw "n:" + n;
    }
  };
  _this.writeByte = function(n) {
    _buffer = _buffer << 8 | n & 255;
    _buflen += 8;
    _length += 1;
    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };
  _this.flush = function() {
    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }
    if (_length % 3 != 0) {
      const padlen = 3 - _length % 3;
      for (let i = 0; i < padlen; i += 1) {
        _base64 += "=";
      }
    }
  };
  _this.toString = function() {
    return _base64;
  };
  return _this;
};
const base64DecodeInputStream = function(str) {
  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;
  const _this = {};
  _this.read = function() {
    while (_buflen < 8) {
      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw "unexpected end of file./" + _buflen;
      }
      const c = _str.charAt(_pos);
      _pos += 1;
      if (c == "=") {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\s$/)) {
        continue;
      }
      _buffer = _buffer << 6 | decode2(c.charCodeAt(0));
      _buflen += 6;
    }
    const n = _buffer >>> _buflen - 8 & 255;
    _buflen -= 8;
    return n;
  };
  const decode2 = function(c) {
    if (65 <= c && c <= 90) {
      return c - 65;
    } else if (97 <= c && c <= 122) {
      return c - 97 + 26;
    } else if (48 <= c && c <= 57) {
      return c - 48 + 52;
    } else if (c == 43) {
      return 62;
    } else if (c == 47) {
      return 63;
    } else {
      throw "c:" + c;
    }
  };
  return _this;
};
const gifImage = function(width, height) {
  const _width = width;
  const _height = height;
  const _data = new Array(width * height);
  const _this = {};
  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };
  _this.write = function(out) {
    out.writeString("GIF87a");
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(128);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(255);
    out.writeByte(255);
    out.writeByte(255);
    out.writeString(",");
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    let offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0);
    out.writeString(";");
  };
  const bitOutputStream = function(out) {
    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;
    const _this2 = {};
    _this2.write = function(data, length) {
      if (data >>> length != 0) {
        throw "length over";
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(255 & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this2.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this2;
  };
  const getLZWRaster = function(lzwMinCodeSize) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();
    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    let dataIndex = 0;
    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);
        if (table.size() < 4095) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }
          table.add(s + c);
        }
        s = c;
      }
    }
    bitOut.write(table.indexOf(s), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  const lzwTable = function() {
    const _map = {};
    let _size = 0;
    const _this2 = {};
    _this2.add = function(key) {
      if (_this2.contains(key)) {
        throw "dup key:" + key;
      }
      _map[key] = _size;
      _size += 1;
    };
    _this2.size = function() {
      return _size;
    };
    _this2.indexOf = function(key) {
      return _map[key];
    };
    _this2.contains = function(key) {
      return typeof _map[key] != "undefined";
    };
    return _this2;
  };
  return _this;
};
const createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y));
    }
  }
  const b = byteArrayOutputStream();
  gif.write(b);
  const base64 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();
  return "data:image/gif;base64," + base64;
};
qrcode.stringToBytes;
var root_2$2 = from_html(`<span class="animation-status svelte-p4ja95"> </span> <span class="part-indicator svelte-p4ja95"> </span> <button class="control-btn svelte-p4ja95">Stop Animation</button>`, 1);
var root_4$2 = from_html(`<span class="part-indicator svelte-p4ja95"> </span> <button class="control-btn svelte-p4ja95">Start Animation</button>`, 1);
var root_5$2 = from_html(`<span class="part-indicator svelte-p4ja95">Single QR code - no animation needed</span>`);
var root_3$2 = from_html(`<span class="animation-status svelte-p4ja95">📱 Static QR</span> <!>`, 1);
var root_6$2 = from_html(`<button class="control-btn svelte-p4ja95">Next Part</button>`);
var root_8$2 = from_html(`<div><div class="part-header svelte-p4ja95"><strong class="svelte-p4ja95"></strong> <span> </span> <span class="part-sequence svelte-p4ja95"> </span></div> <code class="part-data svelte-p4ja95"> </code></div>`);
var root_7$2 = from_html(`<div class="all-parts-section svelte-p4ja95"><h4 class="svelte-p4ja95"> </h4> <div class="fountain-explanation svelte-p4ja95"><p class="svelte-p4ja95"><strong class="svelte-p4ja95">📡 Fountain Code Structure:</strong></p> <ul class="svelte-p4ja95"><li class="svelte-p4ja95"><strong class="svelte-p4ja95">Basic Parts:</strong> </li> <li class="svelte-p4ja95"><strong class="svelte-p4ja95">Fountain Parts:</strong> Redundant parts beyond the basic sequence
                            (for error recovery)</li> <li class="svelte-p4ja95"><strong class="svelte-p4ja95">Collection:</strong> You need to collect <em class="svelte-p4ja95"> </em> parts total to decode reliably</li> <li class="svelte-p4ja95"><strong class="svelte-p4ja95">Redundancy:</strong> </li></ul></div> <div class="parts-list svelte-p4ja95"></div></div>`);
var root_1$2 = from_html(`<div class="qr-section svelte-p4ja95"><h3 class="svelte-p4ja95">Scan with Keystone to Sign</h3> <div class="qr-controls svelte-p4ja95"><!> <!></div> <div class="qr-container svelte-p4ja95"><canvas class="qr-canvas svelte-p4ja95" width="400" height="400"></canvas></div> <div class="qr-data svelte-p4ja95"><strong class="svelte-p4ja95">Current UR Data:</strong> <code class="svelte-p4ja95"> </code></div> <!></div>`);
var root_9$2 = from_html(`<div class="error-message svelte-p4ja95"><strong class="svelte-p4ja95">QR Generation Error:</strong> </div>`);
var root$2 = from_html(`<!> <!>`, 1);
function QrGenerator($$anchor, $$props) {
  push($$props, false);
  let cbor = prop($$props, "cbor", 8, "");
  let urType = prop($$props, "urType", 8, "");
  let capacity = prop($$props, "capacity", 8, 500);
  let defaultInterval = prop($$props, "defaultInterval", 8, 200);
  let scanError = prop($$props, "scanError", 12, "");
  let currentQR = mutable_source("");
  let urEncoder = null;
  let qrInterval = null;
  let isAnimated = mutable_source(false);
  let allQRParts = mutable_source([]);
  let currentPartIndex = mutable_source(0);
  let totalBasicParts = mutable_source(0);
  let canvasElement = mutable_source();
  onMount(() => {
    if (get(canvasElement)) {
      mutate(canvasElement, get(canvasElement).width = 400);
      mutate(canvasElement, get(canvasElement).height = 400);
    }
    if (get(currentQR)) {
      updateQRCode(get(currentQR));
    }
  });
  function updateQRCode(value) {
    if (!get(canvasElement) || !value) return;
    try {
      const qr = qrcode(0, "M");
      qr.addData(value);
      qr.make();
      const ctx = get(canvasElement).getContext("2d");
      if (!ctx) return;
      const canvasSize = 400;
      const padding = 10;
      const qrSize = canvasSize - padding * 2;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor(qrSize / moduleCount);
      const actualQRSize = cellSize * moduleCount;
      const offsetX = padding + Math.floor((qrSize - actualQRSize) / 2);
      const offsetY = padding + Math.floor((qrSize - actualQRSize) / 2);
      ctx.fillStyle = "black";
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize);
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  }
  function createAnimatedQR(cborHex, type, maxCapacity) {
    try {
      stopQRAnimation();
      const ur = new UR(bufferExports.Buffer.from(cborHex, "hex"), type);
      urEncoder = new UREncoder(ur, maxCapacity);
      const firstPart = urEncoder.nextPart().toUpperCase();
      console.log("Generated QR part:", firstPart);
      console.log("First part length:", firstPart.length);
      const parts = firstPart.split("/");
      const isSinglePart = parts.length <= 2 || parts.length >= 2 && parts[1] === "1-1";
      if (isSinglePart) {
        console.log("Detected single QR code");
        set(currentQR, firstPart);
        set(isAnimated, false);
        set(allQRParts, [firstPart]);
        set(currentPartIndex, 0);
        set(totalBasicParts, 1);
        scanError("");
        return;
      }
      if (parts.length >= 2) {
        const seqPart = parts[1];
        const [, totalPartsStr] = seqPart.split("-");
        const totalParts = parseInt(totalPartsStr);
        set(totalBasicParts, totalParts);
        if (totalParts > 0 && totalParts <= 100) {
          set(allQRParts, [firstPart]);
          for (let i = 1; i < totalParts; i++) {
            const nextPart2 = urEncoder.nextPart().toUpperCase();
            get(allQRParts).push(nextPart2);
          }
          const targetTotalParts = Math.min(totalParts * 2, 50);
          const additionalParts = targetTotalParts - totalParts;
          for (let i = 0; i < additionalParts; i++) {
            const nextPart2 = urEncoder.nextPart().toUpperCase();
            get(allQRParts).push(nextPart2);
          }
          console.log(`Generated ${get(allQRParts).length} parts for multipart UR:`);
          console.log(`- Basic sequence: 1-${totalParts} to ${totalParts}-${totalParts}`);
          console.log(`- Additional fountain parts: ${totalParts + 1}-${totalParts} to ${get(allQRParts).length}-${totalParts}`);
          console.log("All parts:", get(allQRParts).map((part, idx) => {
            const partInfo = part.split("/");
            return `${idx + 1}: ${partInfo[1]} (${part.substring(0, 30)}...)`;
          }));
          set(currentPartIndex, 0);
          set(currentQR, get(allQRParts)[get(currentPartIndex)]);
          set(isAnimated, get(allQRParts).length > 1);
          if (get(isAnimated)) {
            qrInterval = setInterval(
              () => {
                set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
                set(currentQR, get(allQRParts)[get(currentPartIndex)]);
              },
              defaultInterval()
            );
          }
        } else {
          throw new Error(`Invalid number of parts: ${totalParts}`);
        }
      } else {
        throw new Error("Unable to parse multipart UR format");
      }
      scanError("");
    } catch (error) {
      scanError(error instanceof Error ? error.message : "Failed to create animated QR");
      set(currentQR, "");
      set(isAnimated, false);
      set(allQRParts, []);
      set(currentPartIndex, 0);
    }
  }
  function getPartType(part, totalBasicParts2) {
    const parts = part.split("/");
    if (parts.length >= 2) {
      const seqPart = parts[1];
      const [seqNumStr, seqLenStr] = seqPart.split("-");
      const seqNum = parseInt(seqNumStr);
      const seqLen = parseInt(seqLenStr);
      const isBasic = seqNum >= 1 && seqNum <= totalBasicParts2;
      return { type: isBasic ? "basic" : "fountain", seqNum, seqLen };
    }
    return { type: "basic", seqNum: 1, seqLen: 1 };
  }
  function stopQRAnimation() {
    if (qrInterval) {
      clearInterval(qrInterval);
      qrInterval = null;
    }
    set(isAnimated, false);
    urEncoder = null;
  }
  function startQRAnimation() {
    if (get(allQRParts).length > 1 && !get(isAnimated)) {
      set(isAnimated, true);
      qrInterval = setInterval(
        () => {
          set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
          set(currentQR, get(allQRParts)[get(currentPartIndex)]);
        },
        defaultInterval()
      );
    }
  }
  function nextPart() {
    if (get(allQRParts).length > 1) {
      set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
      set(currentQR, get(allQRParts)[get(currentPartIndex)]);
    }
  }
  function clear() {
    stopQRAnimation();
    set(currentQR, "");
    set(allQRParts, []);
    set(currentPartIndex, 0);
    set(totalBasicParts, 0);
    scanError("");
  }
  onDestroy(() => {
    stopQRAnimation();
  });
  legacy_pre_effect(
    () => (deep_read_state(cbor()), deep_read_state(urType()), deep_read_state(capacity())),
    () => {
      if (cbor() && urType()) {
        createAnimatedQR(cbor(), urType(), capacity());
      }
    }
  );
  legacy_pre_effect(() => (get(currentQR), get(canvasElement)), () => {
    if (get(currentQR) && get(canvasElement)) {
      updateQRCode(get(currentQR));
    }
  });
  legacy_pre_effect_reset();
  init();
  var fragment = root$2();
  var node = first_child(fragment);
  {
    var consequent_4 = ($$anchor2) => {
      var div = root_1$2();
      var div_1 = sibling(child(div), 2);
      var node_1 = child(div_1);
      {
        var consequent = ($$anchor3) => {
          var fragment_1 = root_2$2();
          var span = first_child(fragment_1);
          var text = child(span);
          var span_1 = sibling(span, 2);
          var text_1 = child(span_1);
          var button = sibling(span_1, 2);
          template_effect(() => {
            set_text(text, `🔄 Animated QR (cycling through ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} parts)`);
            set_text(text_1, `Part ${get(currentPartIndex) + 1} of ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""}`);
          });
          event("click", button, stopQRAnimation);
          append($$anchor3, fragment_1);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_2 = root_3$2();
          var node_2 = sibling(first_child(fragment_2), 2);
          {
            var consequent_1 = ($$anchor4) => {
              var fragment_3 = root_4$2();
              var span_2 = first_child(fragment_3);
              var text_2 = child(span_2);
              var button_1 = sibling(span_2, 2);
              template_effect(() => set_text(text_2, `Showing part ${get(currentPartIndex) + 1} of ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} total`));
              event("click", button_1, startQRAnimation);
              append($$anchor4, fragment_3);
            };
            var alternate = ($$anchor4) => {
              var span_3 = root_5$2();
              append($$anchor4, span_3);
            };
            if_block(node_2, ($$render) => {
              if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_1);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, fragment_2);
        };
        if_block(node_1, ($$render) => {
          if (get(isAnimated)) $$render(consequent);
          else $$render(alternate_1, false);
        });
      }
      var node_3 = sibling(node_1, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var button_2 = root_6$2();
          event("click", button_2, nextPart);
          append($$anchor3, button_2);
        };
        if_block(node_3, ($$render) => {
          if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_2);
        });
      }
      var div_2 = sibling(div_1, 2);
      var canvas = child(div_2);
      bind_this(canvas, ($$value) => set(canvasElement, $$value), () => get(canvasElement));
      var div_3 = sibling(div_2, 2);
      var code = sibling(child(div_3), 2);
      var text_3 = child(code);
      var node_4 = sibling(div_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var div_4 = root_7$2();
          var h4 = child(div_4);
          var text_4 = child(h4);
          var div_5 = sibling(h4, 2);
          var ul = sibling(child(div_5), 2);
          var li = child(ul);
          var text_5 = sibling(child(li));
          var li_1 = sibling(li, 4);
          var em = sibling(child(li_1), 2);
          var text_6 = child(em);
          var li_2 = sibling(li_1, 2);
          var text_7 = sibling(child(li_2));
          var div_6 = sibling(div_5, 2);
          each(div_6, 5, () => get(allQRParts), index, ($$anchor4, part, index2) => {
            const partInfo = derived_safe_equal(() => (get(part), get(totalBasicParts), untrack(() => getPartType(get(part), get(totalBasicParts)))));
            var div_7 = root_8$2();
            var div_8 = child(div_7);
            var strong = child(div_8);
            strong.textContent = `Part ${index2 + 1}:`;
            var span_4 = sibling(strong, 2);
            var text_8 = child(span_4);
            var span_5 = sibling(span_4, 2);
            var text_9 = child(span_5);
            var code_1 = sibling(div_8, 2);
            var text_10 = child(code_1);
            template_effect(() => {
              set_class(
                div_7,
                1,
                `part-item ${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).type)) ?? ""}`,
                "svelte-p4ja95"
              );
              set_class(
                span_4,
                1,
                `part-type-badge ${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).type)) ?? ""}`,
                "svelte-p4ja95"
              );
              set_text(text_8, (deep_read_state(get(partInfo)), untrack(() => get(partInfo).type === "basic" ? "📄 Basic" : "🔄 Fountain")));
              set_text(text_9, `(${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).seqNum)) ?? ""}-${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).seqLen)) ?? ""})`);
              set_text(text_10, get(part));
            });
            append($$anchor4, div_7);
          });
          template_effect(() => {
            set_text(text_4, `All UR Parts (${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} total)`);
            set_text(text_5, ` Sequential parts 1-${get(totalBasicParts) ?? ""} to ${get(totalBasicParts) ?? ""}-${get(totalBasicParts) ?? ""}
                            (minimum required)`);
            set_text(text_6, `more than ${get(totalBasicParts) ?? ""}`);
            set_text(text_7, ` Additional fountain parts provide error
                            recovery - any ${get(totalBasicParts) ?? ""}+ parts should work`);
          });
          append($$anchor3, div_4);
        };
        if_block(node_4, ($$render) => {
          if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_3);
        });
      }
      template_effect(() => set_text(text_3, get(currentQR)));
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (get(currentQR)) $$render(consequent_4);
    });
  }
  var node_5 = sibling(node, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_9 = root_9$2();
      var text_11 = sibling(child(div_9));
      template_effect(() => set_text(text_11, ` ${scanError() ?? ""}`));
      append($$anchor2, div_9);
    };
    if_block(node_5, ($$render) => {
      if (scanError()) $$render(consequent_5);
    });
  }
  append($$anchor, fragment);
  bind_prop($$props, "stopQRAnimation", stopQRAnimation);
  bind_prop($$props, "clear", clear);
  return pop({ stopQRAnimation, clear });
}
class e {
  constructor(a, b, c, d, f) {
    this._legacyCanvasSize = e.DEFAULT_CANVAS_SIZE;
    this._preferredCamera = "environment";
    this._maxScansPerSecond = 25;
    this._lastScanTimestamp = -1;
    this._destroyed = this._flashOn = this._paused = this._active = false;
    this.$video = a;
    this.$canvas = document.createElement("canvas");
    c && "object" === typeof c ? this._onDecode = b : (c || d || f ? console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future") : console.warn("Note that the type of the scan result passed to onDecode will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."), this._legacyOnDecode = b);
    b = "object" === typeof c ? c : {};
    this._onDecodeError = b.onDecodeError || ("function" === typeof c ? c : this._onDecodeError);
    this._calculateScanRegion = b.calculateScanRegion || ("function" === typeof d ? d : this._calculateScanRegion);
    this._preferredCamera = b.preferredCamera || f || this._preferredCamera;
    this._legacyCanvasSize = "number" === typeof c ? c : "number" === typeof d ? d : this._legacyCanvasSize;
    this._maxScansPerSecond = b.maxScansPerSecond || this._maxScansPerSecond;
    this._onPlay = this._onPlay.bind(this);
    this._onLoadedMetaData = this._onLoadedMetaData.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._updateOverlay = this._updateOverlay.bind(this);
    a.disablePictureInPicture = true;
    a.playsInline = true;
    a.muted = true;
    let h = false;
    a.hidden && (a.hidden = false, h = true);
    document.body.contains(a) || (document.body.appendChild(a), h = true);
    c = a.parentElement;
    if (b.highlightScanRegion || b.highlightCodeOutline) {
      d = !!b.overlay;
      this.$overlay = b.overlay || document.createElement("div");
      f = this.$overlay.style;
      f.position = "absolute";
      f.display = "none";
      f.pointerEvents = "none";
      this.$overlay.classList.add("scan-region-highlight");
      if (!d && b.highlightScanRegion) {
        this.$overlay.innerHTML = '<svg class="scan-region-highlight-svg" viewBox="0 0 238 238" preserveAspectRatio="none" style="position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"><path d="M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21"/></svg>';
        try {
          this.$overlay.firstElementChild.animate({ transform: [
            "scale(.98)",
            "scale(1.01)"
          ] }, { duration: 400, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
        } catch (m) {
        }
        c.insertBefore(this.$overlay, this.$video.nextSibling);
      }
      b.highlightCodeOutline && (this.$overlay.insertAdjacentHTML("beforeend", '<svg class="code-outline-highlight" preserveAspectRatio="none" style="display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round"><polygon/></svg>'), this.$codeOutlineHighlight = this.$overlay.lastElementChild);
    }
    this._scanRegion = this._calculateScanRegion(a);
    requestAnimationFrame(() => {
      let m = window.getComputedStyle(a);
      "none" === m.display && (a.style.setProperty("display", "block", "important"), h = true);
      "visible" !== m.visibility && (a.style.setProperty("visibility", "visible", "important"), h = true);
      h && (console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."), a.style.opacity = "0", a.style.width = "0", a.style.height = "0", this.$overlay && this.$overlay.parentElement && this.$overlay.parentElement.removeChild(this.$overlay), delete this.$overlay, delete this.$codeOutlineHighlight);
      this.$overlay && this._updateOverlay();
    });
    a.addEventListener("play", this._onPlay);
    a.addEventListener("loadedmetadata", this._onLoadedMetaData);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    window.addEventListener("resize", this._updateOverlay);
    this._qrEnginePromise = e.createQrEngine();
  }
  static set WORKER_PATH(a) {
    console.warn("Setting QrScanner.WORKER_PATH is not required and not supported anymore. Have a look at the README for new setup instructions.");
  }
  static async hasCamera() {
    try {
      return !!(await e.listCameras(false)).length;
    } catch (a) {
      return false;
    }
  }
  static async listCameras(a = false) {
    if (!navigator.mediaDevices) return [];
    let b = async () => (await navigator.mediaDevices.enumerateDevices()).filter((d) => "videoinput" === d.kind), c;
    try {
      a && (await b()).every((d) => !d.label) && (c = await navigator.mediaDevices.getUserMedia({ audio: false, video: true }));
    } catch (d) {
    }
    try {
      return (await b()).map((d, f) => ({ id: d.deviceId, label: d.label || (0 === f ? "Default Camera" : `Camera ${f + 1}`) }));
    } finally {
      c && (console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"), e._stopVideoStream(c));
    }
  }
  async hasFlash() {
    let a;
    try {
      if (this.$video.srcObject) {
        if (!(this.$video.srcObject instanceof MediaStream)) return false;
        a = this.$video.srcObject;
      } else a = (await this._getCameraStream()).stream;
      return "torch" in a.getVideoTracks()[0].getSettings();
    } catch (b) {
      return false;
    } finally {
      a && a !== this.$video.srcObject && (console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream"), e._stopVideoStream(a));
    }
  }
  isFlashOn() {
    return this._flashOn;
  }
  async toggleFlash() {
    this._flashOn ? await this.turnFlashOff() : await this.turnFlashOn();
  }
  async turnFlashOn() {
    if (!this._flashOn && !this._destroyed && (this._flashOn = true, this._active && !this._paused)) try {
      if (!await this.hasFlash()) throw "No flash available";
      await this.$video.srcObject.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: true }] });
    } catch (a) {
      throw this._flashOn = false, a;
    }
  }
  async turnFlashOff() {
    this._flashOn && (this._flashOn = false, await this._restartVideoStream());
  }
  destroy() {
    this.$video.removeEventListener("loadedmetadata", this._onLoadedMetaData);
    this.$video.removeEventListener("play", this._onPlay);
    document.removeEventListener(
      "visibilitychange",
      this._onVisibilityChange
    );
    window.removeEventListener("resize", this._updateOverlay);
    this._destroyed = true;
    this._flashOn = false;
    this.stop();
    e._postWorkerMessage(this._qrEnginePromise, "close");
  }
  async start() {
    if (this._destroyed) throw Error("The QR scanner can not be started as it had been destroyed.");
    if (!this._active || this._paused) {
      if ("https:" !== window.location.protocol && console.warn("The camera stream is only accessible if the page is transferred via https."), this._active = true, !document.hidden) if (this._paused = false, this.$video.srcObject) await this.$video.play();
      else try {
        let { stream: a, facingMode: b } = await this._getCameraStream();
        !this._active || this._paused ? e._stopVideoStream(a) : (this._setVideoMirror(b), this.$video.srcObject = a, await this.$video.play(), this._flashOn && (this._flashOn = false, this.turnFlashOn().catch(() => {
        })));
      } catch (a) {
        if (!this._paused) throw this._active = false, a;
      }
    }
  }
  stop() {
    this.pause();
    this._active = false;
  }
  async pause(a = false) {
    this._paused = true;
    if (!this._active) return true;
    this.$video.pause();
    this.$overlay && (this.$overlay.style.display = "none");
    let b = () => {
      this.$video.srcObject instanceof MediaStream && (e._stopVideoStream(this.$video.srcObject), this.$video.srcObject = null);
    };
    if (a) return b(), true;
    await new Promise((c) => setTimeout(c, 300));
    if (!this._paused) return false;
    b();
    return true;
  }
  async setCamera(a) {
    a !== this._preferredCamera && (this._preferredCamera = a, await this._restartVideoStream());
  }
  static async scanImage(a, b, c, d, f = false, h = false) {
    let m, n = false;
    b && ("scanRegion" in b || "qrEngine" in b || "canvas" in b || "disallowCanvasResizing" in b || "alsoTryWithoutScanRegion" in b || "returnDetailedScanResult" in b) ? (m = b.scanRegion, c = b.qrEngine, d = b.canvas, f = b.disallowCanvasResizing || false, h = b.alsoTryWithoutScanRegion || false, n = true) : b || c || d || f || h ? console.warn("You're using a deprecated api for scanImage which will be removed in the future.") : console.warn("Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true.");
    b = !!c;
    try {
      let p, k;
      [c, p] = await Promise.all([c || e.createQrEngine(), e._loadImage(a)]);
      [d, k] = e._drawToCanvas(p, m, d, f);
      let q;
      if (c instanceof Worker) {
        let g = c;
        b || e._postWorkerMessageSync(g, "inversionMode", "both");
        q = await new Promise((l, v) => {
          let w, u, r, y = -1;
          u = (t) => {
            t.data.id === y && (g.removeEventListener("message", u), g.removeEventListener("error", r), clearTimeout(w), null !== t.data.data ? l({ data: t.data.data, cornerPoints: e._convertPoints(t.data.cornerPoints, m) }) : v(e.NO_QR_CODE_FOUND));
          };
          r = (t) => {
            g.removeEventListener("message", u);
            g.removeEventListener("error", r);
            clearTimeout(w);
            v("Scanner error: " + (t ? t.message || t : "Unknown Error"));
          };
          g.addEventListener("message", u);
          g.addEventListener("error", r);
          w = setTimeout(() => r("timeout"), 1e4);
          let x = k.getImageData(0, 0, d.width, d.height);
          y = e._postWorkerMessageSync(g, "decode", x, [x.data.buffer]);
        });
      } else q = await Promise.race([new Promise((g, l) => window.setTimeout(() => l("Scanner error: timeout"), 1e4)), (async () => {
        try {
          var [g] = await c.detect(d);
          if (!g) throw e.NO_QR_CODE_FOUND;
          return { data: g.rawValue, cornerPoints: e._convertPoints(g.cornerPoints, m) };
        } catch (l) {
          g = l.message || l;
          if (/not implemented|service unavailable/.test(g)) return e._disableBarcodeDetector = true, e.scanImage(a, { scanRegion: m, canvas: d, disallowCanvasResizing: f, alsoTryWithoutScanRegion: h });
          throw `Scanner error: ${g}`;
        }
      })()]);
      return n ? q : q.data;
    } catch (p) {
      if (!m || !h) throw p;
      let k = await e.scanImage(a, { qrEngine: c, canvas: d, disallowCanvasResizing: f });
      return n ? k : k.data;
    } finally {
      b || e._postWorkerMessage(c, "close");
    }
  }
  setGrayscaleWeights(a, b, c, d = true) {
    e._postWorkerMessage(this._qrEnginePromise, "grayscaleWeights", {
      red: a,
      green: b,
      blue: c,
      useIntegerApproximation: d
    });
  }
  setInversionMode(a) {
    e._postWorkerMessage(this._qrEnginePromise, "inversionMode", a);
  }
  static async createQrEngine(a) {
    a && console.warn("Specifying a worker path is not required and not supported anymore.");
    a = () => __vitePreload(() => import("./qr-scanner-worker.min-Bu8FMiXO.js"), true ? [] : void 0).then((c) => c.createWorker());
    if (!(!e._disableBarcodeDetector && "BarcodeDetector" in window && BarcodeDetector.getSupportedFormats && (await BarcodeDetector.getSupportedFormats()).includes("qr_code"))) return a();
    let b = navigator.userAgentData;
    return b && b.brands.some(({ brand: c }) => /Chromium/i.test(c)) && /mac ?OS/i.test(b.platform) && await b.getHighEntropyValues(["architecture", "platformVersion"]).then(({ architecture: c, platformVersion: d }) => /arm/i.test(c || "arm") && 13 <= parseInt(d || "13")).catch(() => true) ? a() : new BarcodeDetector({ formats: ["qr_code"] });
  }
  _onPlay() {
    this._scanRegion = this._calculateScanRegion(this.$video);
    this._updateOverlay();
    this.$overlay && (this.$overlay.style.display = "");
    this._scanFrame();
  }
  _onLoadedMetaData() {
    this._scanRegion = this._calculateScanRegion(this.$video);
    this._updateOverlay();
  }
  _onVisibilityChange() {
    document.hidden ? this.pause() : this._active && this.start();
  }
  _calculateScanRegion(a) {
    let b = Math.round(2 / 3 * Math.min(a.videoWidth, a.videoHeight));
    return { x: Math.round((a.videoWidth - b) / 2), y: Math.round((a.videoHeight - b) / 2), width: b, height: b, downScaledWidth: this._legacyCanvasSize, downScaledHeight: this._legacyCanvasSize };
  }
  _updateOverlay() {
    requestAnimationFrame(() => {
      if (this.$overlay) {
        var a = this.$video, b = a.videoWidth, c = a.videoHeight, d = a.offsetWidth, f = a.offsetHeight, h = a.offsetLeft, m = a.offsetTop, n = window.getComputedStyle(a), p = n.objectFit, k = b / c, q = d / f;
        switch (p) {
          case "none":
            var g = b;
            var l = c;
            break;
          case "fill":
            g = d;
            l = f;
            break;
          default:
            ("cover" === p ? k > q : k < q) ? (l = f, g = l * k) : (g = d, l = g / k), "scale-down" === p && (g = Math.min(g, b), l = Math.min(l, c));
        }
        var [v, w] = n.objectPosition.split(" ").map((r, y) => {
          const x = parseFloat(r);
          return r.endsWith("%") ? (y ? f - l : d - g) * x / 100 : x;
        });
        n = this._scanRegion.width || b;
        q = this._scanRegion.height || c;
        p = this._scanRegion.x || 0;
        var u = this._scanRegion.y || 0;
        k = this.$overlay.style;
        k.width = `${n / b * g}px`;
        k.height = `${q / c * l}px`;
        k.top = `${m + w + u / c * l}px`;
        c = /scaleX\(-1\)/.test(a.style.transform);
        k.left = `${h + (c ? d - v - g : v) + (c ? b - p - n : p) / b * g}px`;
        k.transform = a.style.transform;
      }
    });
  }
  static _convertPoints(a, b) {
    if (!b) return a;
    let c = b.x || 0, d = b.y || 0, f = b.width && b.downScaledWidth ? b.width / b.downScaledWidth : 1;
    b = b.height && b.downScaledHeight ? b.height / b.downScaledHeight : 1;
    for (let h of a) h.x = h.x * f + c, h.y = h.y * b + d;
    return a;
  }
  _scanFrame() {
    !this._active || this.$video.paused || this.$video.ended || ("requestVideoFrameCallback" in this.$video ? this.$video.requestVideoFrameCallback.bind(this.$video) : requestAnimationFrame)(async () => {
      if (!(1 >= this.$video.readyState)) {
        var a = Date.now() - this._lastScanTimestamp, b = 1e3 / this._maxScansPerSecond;
        a < b && await new Promise((d) => setTimeout(d, b - a));
        this._lastScanTimestamp = Date.now();
        try {
          var c = await e.scanImage(this.$video, { scanRegion: this._scanRegion, qrEngine: this._qrEnginePromise, canvas: this.$canvas });
        } catch (d) {
          if (!this._active) return;
          this._onDecodeError(d);
        }
        !e._disableBarcodeDetector || await this._qrEnginePromise instanceof Worker || (this._qrEnginePromise = e.createQrEngine());
        c ? (this._onDecode ? this._onDecode(c) : this._legacyOnDecode && this._legacyOnDecode(c.data), this.$codeOutlineHighlight && (clearTimeout(this._codeOutlineHighlightRemovalTimeout), this._codeOutlineHighlightRemovalTimeout = void 0, this.$codeOutlineHighlight.setAttribute("viewBox", `${this._scanRegion.x || 0} ${this._scanRegion.y || 0} ${this._scanRegion.width || this.$video.videoWidth} ${this._scanRegion.height || this.$video.videoHeight}`), this.$codeOutlineHighlight.firstElementChild.setAttribute(
          "points",
          c.cornerPoints.map(({ x: d, y: f }) => `${d},${f}`).join(" ")
        ), this.$codeOutlineHighlight.style.display = "")) : this.$codeOutlineHighlight && !this._codeOutlineHighlightRemovalTimeout && (this._codeOutlineHighlightRemovalTimeout = setTimeout(() => this.$codeOutlineHighlight.style.display = "none", 100));
      }
      this._scanFrame();
    });
  }
  _onDecodeError(a) {
    a !== e.NO_QR_CODE_FOUND && console.log(a);
  }
  async _getCameraStream() {
    if (!navigator.mediaDevices) throw "Camera not found.";
    let a = /^(environment|user)$/.test(this._preferredCamera) ? "facingMode" : "deviceId", b = [{ width: { min: 1024 } }, { width: { min: 768 } }, {}], c = b.map((d) => Object.assign({}, d, { [a]: { exact: this._preferredCamera } }));
    for (let d of [...c, ...b]) try {
      let f = await navigator.mediaDevices.getUserMedia({ video: d, audio: false }), h = this._getFacingMode(f) || (d.facingMode ? this._preferredCamera : "environment" === this._preferredCamera ? "user" : "environment");
      return { stream: f, facingMode: h };
    } catch (f) {
    }
    throw "Camera not found.";
  }
  async _restartVideoStream() {
    let a = this._paused;
    await this.pause(true) && !a && this._active && await this.start();
  }
  static _stopVideoStream(a) {
    for (let b of a.getTracks()) b.stop(), a.removeTrack(b);
  }
  _setVideoMirror(a) {
    this.$video.style.transform = "scaleX(" + ("user" === a ? -1 : 1) + ")";
  }
  _getFacingMode(a) {
    return (a = a.getVideoTracks()[0]) ? /rear|back|environment/i.test(a.label) ? "environment" : /front|user|face/i.test(a.label) ? "user" : null : null;
  }
  static _drawToCanvas(a, b, c, d = false) {
    c = c || document.createElement("canvas");
    let f = b && b.x ? b.x : 0, h = b && b.y ? b.y : 0, m = b && b.width ? b.width : a.videoWidth || a.width, n = b && b.height ? b.height : a.videoHeight || a.height;
    d || (d = b && b.downScaledWidth ? b.downScaledWidth : m, b = b && b.downScaledHeight ? b.downScaledHeight : n, c.width !== d && (c.width = d), c.height !== b && (c.height = b));
    b = c.getContext("2d", { alpha: false });
    b.imageSmoothingEnabled = false;
    b.drawImage(a, f, h, m, n, 0, 0, c.width, c.height);
    return [c, b];
  }
  static async _loadImage(a) {
    if (a instanceof Image) return await e._awaitImageLoad(a), a;
    if (a instanceof HTMLVideoElement || a instanceof HTMLCanvasElement || a instanceof SVGImageElement || "OffscreenCanvas" in window && a instanceof OffscreenCanvas || "ImageBitmap" in window && a instanceof ImageBitmap) return a;
    if (a instanceof File || a instanceof Blob || a instanceof URL || "string" === typeof a) {
      let b = new Image();
      b.src = a instanceof File || a instanceof Blob ? URL.createObjectURL(a) : a.toString();
      try {
        return await e._awaitImageLoad(b), b;
      } finally {
        (a instanceof File || a instanceof Blob) && URL.revokeObjectURL(b.src);
      }
    } else throw "Unsupported image type.";
  }
  static async _awaitImageLoad(a) {
    a.complete && 0 !== a.naturalWidth || await new Promise((b, c) => {
      let d = (f) => {
        a.removeEventListener("load", d);
        a.removeEventListener("error", d);
        f instanceof ErrorEvent ? c("Image load error") : b();
      };
      a.addEventListener("load", d);
      a.addEventListener("error", d);
    });
  }
  static async _postWorkerMessage(a, b, c, d) {
    return e._postWorkerMessageSync(await a, b, c, d);
  }
  static _postWorkerMessageSync(a, b, c, d) {
    if (!(a instanceof Worker)) return -1;
    let f = e._workerMessageId++;
    a.postMessage({ id: f, type: b, data: c }, d);
    return f;
  }
}
e.DEFAULT_CANVAS_SIZE = 400;
e.NO_QR_CODE_FOUND = "No QR code found";
e._disableBarcodeDetector = false;
e._workerMessageId = 0;
var root_1$1 = from_html(`<button class="action-btn svelte-57l17z">Start Camera</button>`);
var root_2$1 = from_html(`<button class="action-btn danger svelte-57l17z">Stop Camera</button>`);
var root_3$1 = from_html(`<button class="control-btn svelte-57l17z">Reset Scanner</button>`);
var root_5$1 = from_html(`<div class="multipart-message svelte-57l17z"><strong>Multipart mode:</strong> Keep scanning until all parts are collected<br/> <span> </span></div>`);
var root_4$1 = from_html(`<div class="video-container svelte-57l17z"><video autoplay playsinline="" width="500" height="300" class="svelte-57l17z"></video> <p class="scanner-instructions svelte-57l17z">Position the QR code displayed on the Keystone within the camera view</p> <!></div>`, 2);
var root_6$1 = from_html(`<div class="error-message svelte-57l17z"><strong>Error:</strong> </div>`);
var root_7$1 = from_html(`<div class="error-message svelte-57l17z"><strong>Scan Error:</strong> </div>`);
var root_9$1 = from_html(`<div class="multipart-progress svelte-57l17z"><div class="progress-bar svelte-57l17z"><div class="progress-fill svelte-57l17z"></div></div> <span class="progress-text svelte-57l17z"> </span></div>`);
var root_8$1 = from_html(`<div class="debug-info svelte-57l17z"><strong>Debug:</strong> <!></div>`);
var root$1 = from_html(`<div class="qr-scanner svelte-57l17z"><p class="info svelte-57l17z">On your Keystone device, navigate to the IOTA wallet and generate a connection QR code. Then
        use the camera scanner below to scan it and capture your account information.</p> <div class="scanner-controls svelte-57l17z"><!> <button class="control-btn svelte-57l17z">Check Camera</button> <!></div> <!> <!> <!> <!></div>`);
function QrScanner_1($$anchor, $$props) {
  push($$props, false);
  const dispatch = createEventDispatcher();
  let videoElement = mutable_source(null);
  let qrScanner = null;
  let scanning = mutable_source(false);
  let debugInfo = mutable_source("");
  let connectionError = mutable_source("");
  let scanError = mutable_source("");
  let isMultipart = prop($$props, "isMultipart", 8, false);
  let expectedParts = prop($$props, "expectedParts", 8, 0);
  let receivedParts = prop($$props, "receivedParts", 8, 0);
  function initializeScanner() {
    console.log("Initializing scanner, videoElement:", get(videoElement), "qrScanner exists:", !!qrScanner);
    if (!get(videoElement)) {
      console.error("Video element not available");
      return;
    }
    if (qrScanner) {
      console.log("Scanner already exists, destroying old one");
      qrScanner.destroy();
    }
    try {
      qrScanner = new e(
        get(videoElement),
        (result) => {
          console.log("QR code scanned:", result.data);
          dispatch("scanResult", result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true
        }
      );
      console.log("QR Scanner created successfully");
    } catch (error) {
      console.error("Failed to create QR scanner:", error);
      const errorMsg = "Failed to initialize scanner: " + error.message;
      set(connectionError, errorMsg);
      dispatch("connectionError", errorMsg);
    }
  }
  async function checkCameraSupport() {
    try {
      set(debugInfo, "Checking camera support...");
      const hasCamera = await e.hasCamera();
      console.log("Has camera:", hasCamera);
      if (!hasCamera) {
        throw new Error("No camera found on this device");
      }
      const cameras = await e.listCameras(true);
      console.log("Available cameras:", cameras);
      set(debugInfo, `Found ${cameras.length} camera(s): ${cameras.map((c) => c.label).join(", ")}`);
      return true;
    } catch (error) {
      console.error("Camera check failed:", error);
      set(debugInfo, "Camera check failed: " + error.message);
      return false;
    }
  }
  async function startScanning() {
    console.log("Starting scanner...");
    set(debugInfo, "Starting scanner...");
    try {
      set(connectionError, "");
      set(scanError, "");
      dispatch("connectionError", "");
      dispatch("error", "");
      const cameraSupported = await checkCameraSupport();
      if (!cameraSupported) {
        return;
      }
      set(scanning, false);
      if (qrScanner) {
        qrScanner.destroy();
        qrScanner = null;
      }
      set(videoElement, null);
      await tick();
      set(scanning, true);
      set(debugInfo, "Creating video element...");
      await tick();
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (!get(videoElement)) {
        set(debugInfo, "Video element not found after DOM update, waiting longer...");
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      if (!get(videoElement)) {
        const el = document.querySelector("video");
        set(videoElement, el instanceof HTMLVideoElement ? el : null);
      }
      set(debugInfo, "Initializing scanner...");
      initializeScanner();
      if (!qrScanner) {
        throw new Error("Scanner not initialized - video element may not be available");
      }
      set(debugInfo, "Requesting camera permissions...");
      console.log("Starting QR scanner...");
      await qrScanner.start();
      set(debugInfo, "");
      console.log("Scanner started successfully");
    } catch (error) {
      console.error("Failed to start scanning:", error);
      const errorMessage = "Failed to start camera: " + error.message;
      set(scanError, errorMessage);
      set(debugInfo, errorMessage);
      set(scanning, false);
      dispatch("error", get(scanError));
    }
  }
  function stopScanning() {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      qrScanner = null;
    }
    set(scanning, false);
    set(videoElement, null);
  }
  function checkCamera() {
    return checkCameraSupport();
  }
  function reset() {
    stopScanning();
    set(connectionError, "");
    set(scanError, "");
    set(debugInfo, "");
    dispatch("connectionError", "");
    dispatch("error", "");
  }
  onDestroy(() => {
    stopScanning();
  });
  init();
  var div = root$1();
  var div_1 = sibling(child(div), 2);
  var node = child(div_1);
  {
    var consequent = ($$anchor2) => {
      var button = root_1$1();
      event("click", button, startScanning);
      append($$anchor2, button);
    };
    var alternate = ($$anchor2) => {
      var button_1 = root_2$1();
      event("click", button_1, stopScanning);
      append($$anchor2, button_1);
    };
    if_block(node, ($$render) => {
      if (!get(scanning)) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  var button_2 = sibling(node, 2);
  var node_1 = sibling(button_2, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var button_3 = root_3$1();
      event("click", button_3, reset);
      append($$anchor2, button_3);
    };
    if_block(node_1, ($$render) => {
      if (get(connectionError) || get(scanError)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(div_1, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_2 = root_4$1();
      var video = child(div_2);
      video.muted = true;
      bind_this(video, ($$value) => set(videoElement, $$value), () => get(videoElement));
      var node_3 = sibling(video, 4);
      {
        var consequent_2 = ($$anchor3) => {
          var div_3 = root_5$1();
          var span = sibling(child(div_3), 4);
          var text = child(span);
          template_effect(() => set_text(text, `Received ${receivedParts() ?? ""} of ${expectedParts() ?? ""} parts`));
          append($$anchor3, div_3);
        };
        if_block(node_3, ($$render) => {
          if (isMultipart()) $$render(consequent_2);
        });
      }
      append($$anchor2, div_2);
    };
    if_block(node_2, ($$render) => {
      if (get(scanning)) $$render(consequent_3);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_4 = root_6$1();
      var text_1 = sibling(child(div_4));
      template_effect(() => set_text(text_1, ` ${get(connectionError) ?? ""}`));
      append($$anchor2, div_4);
    };
    if_block(node_4, ($$render) => {
      if (get(connectionError)) $$render(consequent_4);
    });
  }
  var node_5 = sibling(node_4, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_5 = root_7$1();
      var text_2 = sibling(child(div_5));
      template_effect(() => set_text(text_2, ` ${get(scanError) ?? ""}`));
      append($$anchor2, div_5);
    };
    if_block(node_5, ($$render) => {
      if (get(scanError)) $$render(consequent_5);
    });
  }
  var node_6 = sibling(node_5, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_6 = root_8$1();
      var text_3 = sibling(child(div_6));
      var node_7 = sibling(text_3);
      {
        var consequent_6 = ($$anchor3) => {
          var div_7 = root_9$1();
          var div_8 = child(div_7);
          var div_9 = child(div_8);
          var span_1 = sibling(div_8, 2);
          var text_4 = child(span_1);
          template_effect(() => {
            set_style(div_9, `width: ${receivedParts() / expectedParts() * 100}%`);
            set_text(text_4, `${receivedParts() ?? ""}/${expectedParts() ?? ""} parts received`);
          });
          append($$anchor3, div_7);
        };
        if_block(node_7, ($$render) => {
          if (isMultipart() && expectedParts() > 0) $$render(consequent_6);
        });
      }
      template_effect(() => set_text(text_3, ` ${get(debugInfo) ?? ""} `));
      append($$anchor2, div_6);
    };
    if_block(node_6, ($$render) => {
      if (get(debugInfo)) $$render(consequent_7);
    });
  }
  event("click", button_2, checkCameraSupport);
  append($$anchor, div);
  bind_prop($$props, "startScanning", startScanning);
  bind_prop($$props, "stopScanning", stopScanning);
  bind_prop($$props, "checkCamera", checkCamera);
  bind_prop($$props, "reset", reset);
  return pop({ startScanning, stopScanning, checkCamera, reset });
}
class RegistryType {
  constructor(type, tag) {
    this.type = type;
    this.tag = tag;
  }
  getTag = () => this.tag;
  getType = () => this.type;
}
const RegistryTypes$2 = {
  UUID: new RegistryType("uuid", 37),
  BYTES: new RegistryType("bytes", void 0),
  CRYPTO_HDKEY: new RegistryType("crypto-hdkey", 303),
  CRYPTO_KEYPATH: new RegistryType("crypto-keypath", 304),
  CRYPTO_COIN_INFO: new RegistryType("crypto-coin-info", 305),
  CRYPTO_ECKEY: new RegistryType("crypto-eckey", 306),
  CRYPTO_OUTPUT: new RegistryType("crypto-output", 308),
  CRYPTO_PSBT: new RegistryType("crypto-psbt", 310),
  CRYPTO_ACCOUNT: new RegistryType("crypto-account", 311),
  CRYPTO_MULTI_ACCOUNTS: new RegistryType("crypto-multi-accounts", 1103),
  QR_HARDWARE_CALL: new RegistryType("qr-hardware-call", 1201),
  KEY_DERIVATION_CALL: new RegistryType("key-derivation-call", 1301),
  KEY_DERIVATION_SCHEMA: new RegistryType("key-derivation-schema", 1302)
};
class ScriptExpression {
  constructor(tag, expression) {
    this.tag = tag;
    this.expression = expression;
  }
  getTag = () => this.tag;
  getExpression = () => this.expression;
  static fromTag = (tag) => {
    const se = Object.values(ScriptExpressions).find((se2) => se2.getTag() === tag);
    return se;
  };
}
const ScriptExpressions = {
  SCRIPT_HASH: new ScriptExpression(400, "sh"),
  WITNESS_SCRIPT_HASH: new ScriptExpression(401, "wsh"),
  PUBLIC_KEY: new ScriptExpression(402, "pk"),
  PUBLIC_KEY_HASH: new ScriptExpression(403, "pkh"),
  WITNESS_PUBLIC_KEY_HASH: new ScriptExpression(404, "wpkh"),
  COMBO: new ScriptExpression(405, "combo"),
  MULTISIG: new ScriptExpression(406, "multi"),
  SORTED_MULTISIG: new ScriptExpression(407, "sortedmulti"),
  ADDRESS: new ScriptExpression(307, "addr"),
  RAW_SCRIPT: new ScriptExpression(408, "raw")
};
class DataItem {
  tag;
  data;
  constructor(data, tag) {
    this.data = data;
    this.tag = tag;
  }
  setTag = (tag) => {
    this.tag = tag;
  };
  clearTag = () => {
    this.tag = void 0;
  };
  getTag = () => {
    return this.tag;
  };
  getData = () => {
    return this.data;
  };
}
var semanticEncoders = [];
var semanticDecoders = {};
function BinaryHex(hex) {
  this.$hex = hex;
}
BinaryHex.prototype = {
  length: function() {
    return this.$hex.length / 2;
  },
  toString: function(format) {
    if (!format || format === "hex" || format === 16) return this.$hex;
    if (format === "utf-8") {
      var encoded = "";
      for (var i = 0; i < this.$hex.length; i += 2) {
        encoded += "%" + this.$hex.substring(i, i + 2);
      }
      return decodeURIComponent(encoded);
    }
    if (format === "latin") {
      var encoded = [];
      for (var i = 0; i < this.$hex.length; i += 2) {
        encoded.push(parseInt(this.$hex.substring(i, i + 2), 16));
      }
      return String.fromCharCode.apply(String, encoded);
    }
    throw new Error("Unrecognised format: " + format);
  }
};
BinaryHex.fromLatinString = function(latinString) {
  var hex = "";
  for (var i = 0; i < latinString.length; i++) {
    var pair = latinString.charCodeAt(i).toString(16);
    if (pair.length === 1) pair = "0" + pair;
    hex += pair;
  }
  return new BinaryHex(hex);
};
BinaryHex.fromUtf8String = function(utf8String) {
  var encoded = encodeURIComponent(utf8String);
  var hex = "";
  for (var i = 0; i < encoded.length; i++) {
    if (encoded.charAt(i) === "%") {
      hex += encoded.substring(i + 1, i + 3);
      i += 2;
    } else {
      var hexPair = encoded.charCodeAt(i).toString(16);
      if (hexPair.length < 2) hexPair = "0" + hexPair;
      hex += hexPair;
    }
  }
  return new BinaryHex(hex);
};
var notImplemented = function(label) {
  return function() {
    throw new Error(label + " not implemented");
  };
};
function Reader() {
}
Reader.prototype = {
  peekByte: notImplemented("peekByte"),
  readByte: notImplemented("readByte"),
  readChunk: notImplemented("readChunk"),
  readFloat16: function() {
    var half = this.readUint16();
    var exponent = (half & 32767) >> 10;
    var mantissa = half & 1023;
    var negative = half & 32768;
    if (exponent === 31) {
      if (mantissa === 0) {
        return negative ? -Infinity : Infinity;
      }
      return NaN;
    }
    var magnitude = exponent ? Math.pow(2, exponent - 25) * (1024 + mantissa) : Math.pow(2, -24) * mantissa;
    return negative ? -magnitude : magnitude;
  },
  readFloat32: function() {
    var intValue = this.readUint32();
    var exponent = (intValue & 2147483647) >> 23;
    var mantissa = intValue & 8388607;
    var negative = intValue & 2147483648;
    if (exponent === 255) {
      if (mantissa === 0) {
        return negative ? -Infinity : Infinity;
      }
      return NaN;
    }
    var magnitude = exponent ? Math.pow(2, exponent - 23 - 127) * (8388608 + mantissa) : Math.pow(2, -23 - 126) * mantissa;
    return negative ? -magnitude : magnitude;
  },
  readFloat64: function() {
    var int1 = this.readUint32(), int2 = this.readUint32();
    var exponent = int1 >> 20 & 2047;
    var mantissa = (int1 & 1048575) * 4294967296 + int2;
    var negative = int1 & 2147483648;
    if (exponent === 2047) {
      if (mantissa === 0) {
        return negative ? -Infinity : Infinity;
      }
      return NaN;
    }
    var magnitude = exponent ? Math.pow(2, exponent - 52 - 1023) * (4503599627370496 + mantissa) : Math.pow(2, -52 - 1022) * mantissa;
    return negative ? -magnitude : magnitude;
  },
  readUint16: function() {
    return this.readByte() * 256 + this.readByte();
  },
  readUint32: function() {
    return this.readUint16() * 65536 + this.readUint16();
  },
  readUint64: function() {
    return this.readUint32() * 4294967296 + this.readUint32();
  }
};
function Writer() {
}
Writer.prototype = {
  writeByte: notImplemented("writeByte"),
  result: notImplemented("result"),
  writeFloat16: notImplemented("writeFloat16"),
  writeFloat32: notImplemented("writeFloat32"),
  writeFloat64: notImplemented("writeFloat64"),
  writeUint16: function(value) {
    this.writeByte(value >> 8 & 255);
    this.writeByte(value & 255);
  },
  writeUint32: function(value) {
    this.writeUint16(value >> 16 & 65535);
    this.writeUint16(value & 65535);
  },
  writeUint64: function(value) {
    if (value >= 9007199254740992 || value <= -9007199254740992) {
      throw new Error(
        "Cannot encode Uint64 of: " + value + " magnitude to big (floating point errors)"
      );
    }
    this.writeUint32(Math.floor(value / 4294967296));
    this.writeUint32(value % 4294967296);
  },
  writeString: notImplemented("writeString"),
  canWriteBinary: function(chunk) {
    return false;
  },
  writeBinary: notImplemented("writeChunk")
};
function readHeaderRaw(reader) {
  var firstByte = reader.readByte();
  var majorType = firstByte >> 5, value = firstByte & 31;
  return { type: majorType, value };
}
function valueFromHeader(header, reader) {
  var value = header.value;
  if (value < 24) {
    return value;
  } else if (value == 24) {
    return reader.readByte();
  } else if (value == 25) {
    return reader.readUint16();
  } else if (value == 26) {
    return reader.readUint32();
  } else if (value == 27) {
    return reader.readUint64();
  } else if (value == 31) {
    return null;
  }
  notImplemented("Additional info: " + value)();
}
function writeHeaderRaw(type, value, writer) {
  writer.writeByte(type << 5 | value);
}
function writeHeader(type, value, writer) {
  var firstByte = type << 5;
  if (value < 24) {
    writer.writeByte(firstByte | value);
  } else if (value < 256) {
    writer.writeByte(firstByte | 24);
    writer.writeByte(value);
  } else if (value < 65536) {
    writer.writeByte(firstByte | 25);
    writer.writeUint16(value);
  } else if (value < 4294967296) {
    writer.writeByte(firstByte | 26);
    writer.writeUint32(value);
  } else {
    writer.writeByte(firstByte | 27);
    writer.writeUint64(value);
  }
}
var stopCode = new Error();
function decodeReader(reader) {
  var header = readHeaderRaw(reader);
  switch (header.type) {
    case 0:
      return valueFromHeader(header, reader);
    case 1:
      return -1 - valueFromHeader(header, reader);
    case 2:
      return reader.readChunk(valueFromHeader(header, reader));
    case 3:
      var buffer2 = reader.readChunk(valueFromHeader(header, reader));
      return buffer2.toString("utf-8");
    case 4:
    case 5:
      var arrayLength = valueFromHeader(header, reader);
      var result = [];
      if (arrayLength !== null) {
        if (header.type === 5) {
          arrayLength *= 2;
        }
        for (var i = 0; i < arrayLength; i++) {
          result[i] = decodeReader(reader);
        }
      } else {
        var item;
        while ((item = decodeReader(reader)) !== stopCode) {
          result.push(item);
        }
      }
      if (header.type === 5) {
        var objResult = {};
        for (var i = 0; i < result.length; i += 2) {
          objResult[result[i]] = result[i + 1];
        }
        return objResult;
      } else {
        return result;
      }
    case 6:
      var tag = valueFromHeader(header, reader);
      var decoder = semanticDecoders[tag];
      var result = decodeReader(reader);
      return decoder ? decoder(result) : result;
    case 7:
      if (header.value === 25) {
        return reader.readFloat16();
      } else if (header.value === 26) {
        return reader.readFloat32();
      } else if (header.value === 27) {
        return reader.readFloat64();
      }
      switch (valueFromHeader(header, reader)) {
        case 20:
          return false;
        case 21:
          return true;
        case 22:
          return null;
        case 23:
          return void 0;
        case null:
          return stopCode;
        default:
          throw new Error("Unknown fixed value: " + header.value);
      }
    default:
      throw new Error("Unsupported header: " + JSON.stringify(header));
  }
  throw new Error("not implemented yet");
}
function encodeWriter(data, writer) {
  for (var i = 0; i < semanticEncoders.length; i++) {
    var replacement = semanticEncoders[i].fn(data);
    if (replacement !== void 0) {
      writeHeader(6, semanticEncoders[i].tag, writer);
      return encodeWriter(replacement, writer);
    }
  }
  if (data && typeof data.toCBOR === "function") {
    data = data.toCBOR();
  }
  if (data === false) {
    writeHeader(7, 20, writer);
  } else if (data === true) {
    writeHeader(7, 21, writer);
  } else if (data === null) {
    writeHeader(7, 22, writer);
  } else if (data === void 0) {
    writeHeader(7, 23, writer);
  } else if (typeof data === "number") {
    if (Math.floor(data) === data && data < 9007199254740992 && data > -9007199254740992) {
      if (data < 0) {
        writeHeader(1, -1 - data, writer);
      } else {
        writeHeader(0, data, writer);
      }
    } else {
      writeHeaderRaw(7, 27, writer);
      writer.writeFloat64(data);
    }
  } else if (typeof data === "string") {
    writer.writeString(data, function(length) {
      writeHeader(3, length, writer);
    });
  } else if (writer.canWriteBinary(data)) {
    writer.writeBinary(data, function(length) {
      writeHeader(2, length, writer);
    });
  } else if (typeof data === "object") {
    if (typeof data.toJSON === "function") {
      data = data.toJSON();
    }
    if (Array.isArray(data)) {
      writeHeader(4, data.length, writer);
      for (var i = 0; i < data.length; i++) {
        encodeWriter(data[i], writer);
      }
    } else {
      var keys = Object.keys(data);
      writeHeader(5, keys.length, writer);
      for (var i = 0; i < keys.length; i++) {
        const number = parseInt(keys[i]);
        if (isNaN(number)) {
          encodeWriter(keys[i], writer);
          encodeWriter(data[keys[i]], writer);
        } else {
          encodeWriter(number, writer);
          encodeWriter(data[keys[i]], writer);
        }
      }
    }
  } else {
    throw new Error("CBOR encoding not supported: " + data);
  }
}
var readerFunctions = [];
var writerFunctions = [];
function addWriter(format, writerFunction) {
  if (typeof format === "string") {
    writerFunctions.push(function(f) {
      if (format === f) return writerFunction(f);
    });
  } else {
    writerFunctions.push(format);
  }
}
function addReader(format, readerFunction) {
  if (typeof format === "string") {
    readerFunctions.push(function(data, f) {
      if (format === f) return readerFunction(data, f);
    });
  } else {
    readerFunctions.push(format);
  }
}
function encodeDataItem(data, format) {
  for (var i = 0; i < writerFunctions.length; i++) {
    var func = writerFunctions[i];
    var writer = func(format);
    if (writer) {
      if (data.getTag() !== void 0) {
        encodeWriter(data, writer);
        return writer.result();
      } else {
        encodeWriter(data.getData(), writer);
        return writer.result();
      }
    }
  }
  throw new Error("Unsupported output format: " + format);
}
function decodeToDataItem$2(data, format) {
  for (var i = 0; i < readerFunctions.length; i++) {
    var func = readerFunctions[i];
    var reader = func(data, format);
    if (reader) {
      const result = decodeReader(reader);
      if (result instanceof DataItem) {
        return result;
      } else {
        return new DataItem(result);
      }
    }
  }
  throw new Error("Unsupported input format: " + format);
}
function addSemanticEncode(tag, fn) {
  if (typeof tag !== "number" || tag % 1 !== 0 || tag < 0) {
    throw new Error("Tag must be a positive integer");
  }
  semanticEncoders.push({ tag, fn });
  return this;
}
function addSemanticDecode(tag, fn) {
  if (typeof tag !== "number" || tag % 1 !== 0 || tag < 0) {
    throw new Error("Tag must be a positive integer");
  }
  semanticDecoders[tag] = fn;
  return this;
}
function BufferReader(buffer2) {
  this.buffer = buffer2;
  this.pos = 0;
}
BufferReader.prototype = Object.create(Reader.prototype);
BufferReader.prototype.peekByte = function() {
  return this.buffer[this.pos];
};
BufferReader.prototype.readByte = function() {
  return this.buffer[this.pos++];
};
BufferReader.prototype.readUint16 = function() {
  var result = this.buffer.readUInt16BE(this.pos);
  this.pos += 2;
  return result;
};
BufferReader.prototype.readUint32 = function() {
  var result = this.buffer.readUInt32BE(this.pos);
  this.pos += 4;
  return result;
};
BufferReader.prototype.readFloat32 = function() {
  var result = this.buffer.readFloatBE(this.pos);
  this.pos += 4;
  return result;
};
BufferReader.prototype.readFloat64 = function() {
  var result = this.buffer.readDoubleBE(this.pos);
  this.pos += 8;
  return result;
};
BufferReader.prototype.readChunk = function(length) {
  var result = bufferExports.Buffer.alloc(length);
  this.buffer.copy(result, 0, this.pos, this.pos += length);
  return result;
};
function BufferWriter(stringFormat) {
  this.byteLength = 0;
  this.defaultBufferLength = 16384;
  this.latestBuffer = bufferExports.Buffer.alloc(this.defaultBufferLength);
  this.latestBufferOffset = 0;
  this.completeBuffers = [];
  this.stringFormat = stringFormat;
}
BufferWriter.prototype = Object.create(Writer.prototype);
BufferWriter.prototype.writeByte = function(value) {
  this.latestBuffer[this.latestBufferOffset++] = value;
  if (this.latestBufferOffset >= this.latestBuffer.length) {
    this.completeBuffers.push(this.latestBuffer);
    this.latestBuffer = bufferExports.Buffer.alloc(this.defaultBufferLength);
    this.latestBufferOffset = 0;
  }
  this.byteLength++;
};
BufferWriter.prototype.writeFloat32 = function(value) {
  var buffer2 = bufferExports.Buffer.alloc(4);
  buffer2.writeFloatBE(value, 0);
  this.writeBuffer(buffer2);
};
BufferWriter.prototype.writeFloat64 = function(value) {
  var buffer2 = bufferExports.Buffer.alloc(8);
  buffer2.writeDoubleBE(value, 0);
  this.writeBuffer(buffer2);
};
BufferWriter.prototype.writeString = function(string, lengthFunc) {
  var buffer2 = bufferExports.Buffer.from(string, "utf-8");
  lengthFunc(buffer2.length);
  this.writeBuffer(buffer2);
};
BufferWriter.prototype.canWriteBinary = function(data) {
  return data instanceof bufferExports.Buffer;
};
BufferWriter.prototype.writeBinary = function(buffer2, lengthFunc) {
  lengthFunc(buffer2.length);
  this.writeBuffer(buffer2);
};
BufferWriter.prototype.writeBuffer = function(chunk) {
  if (!(chunk instanceof bufferExports.Buffer)) throw new TypeError("BufferWriter only accepts Buffers");
  if (!this.latestBufferOffset) {
    this.completeBuffers.push(chunk);
  } else if (this.latestBuffer.length - this.latestBufferOffset >= chunk.length) {
    chunk.copy(this.latestBuffer, this.latestBufferOffset);
    this.latestBufferOffset += chunk.length;
    if (this.latestBufferOffset >= this.latestBuffer.length) {
      this.completeBuffers.push(this.latestBuffer);
      this.latestBuffer = bufferExports.Buffer.alloc(this.defaultBufferLength);
      this.latestBufferOffset = 0;
    }
  } else {
    this.completeBuffers.push(this.latestBuffer.slice(0, this.latestBufferOffset));
    this.completeBuffers.push(chunk);
    this.latestBuffer = bufferExports.Buffer.alloc(this.defaultBufferLength);
    this.latestBufferOffset = 0;
  }
  this.byteLength += chunk.length;
};
BufferWriter.prototype.result = function() {
  var result = bufferExports.Buffer.alloc(this.byteLength);
  var offset = 0;
  for (var i = 0; i < this.completeBuffers.length; i++) {
    var buffer2 = this.completeBuffers[i];
    buffer2.copy(result, offset, 0, buffer2.length);
    offset += buffer2.length;
  }
  if (this.latestBufferOffset) {
    this.latestBuffer.copy(result, offset, 0, this.latestBufferOffset);
  }
  if (this.stringFormat) return result.toString(this.stringFormat);
  return result;
};
if (typeof bufferExports.Buffer === "function") {
  addReader(function(data, format) {
    if (bufferExports.Buffer.isBuffer(data)) {
      return new BufferReader(data);
    }
    if (format === "hex" || format === "base64") {
      var buffer2 = bufferExports.Buffer.from(data, format);
      return new BufferReader(buffer2);
    }
  });
  addWriter(function(format) {
    if (!format || format === "buffer") {
      return new BufferWriter();
    } else if (format === "hex" || format === "base64") {
      return new BufferWriter(format);
    }
  });
}
function HexReader(hex) {
  this.hex = hex;
  this.pos = 0;
}
HexReader.prototype = Object.create(Reader.prototype);
HexReader.prototype.peekByte = function() {
  var pair = this.hex.substring(this.pos, 2);
  return parseInt(pair, 16);
};
HexReader.prototype.readByte = function() {
  var pair = this.hex.substring(this.pos, this.pos + 2);
  this.pos += 2;
  return parseInt(pair, 16);
};
HexReader.prototype.readChunk = function(length) {
  var hex = this.hex.substring(this.pos, this.pos + length * 2);
  this.pos += length * 2;
  if (typeof bufferExports.Buffer === "function") return bufferExports.Buffer.from(hex, "hex");
  return new BinaryHex(hex);
};
function HexWriter(finalFormat) {
  this.$hex = "";
  this.finalFormat = finalFormat || "hex";
}
HexWriter.prototype = Object.create(Writer.prototype);
HexWriter.prototype.writeByte = function(value) {
  if (value < 0 || value > 255) throw new Error("Byte value out of range: " + value);
  var hex = value.toString(16);
  if (hex.length == 1) {
    hex = "0" + hex;
  }
  this.$hex += hex;
};
HexWriter.prototype.canWriteBinary = function(chunk) {
  return chunk instanceof BinaryHex || typeof bufferExports.Buffer === "function" && chunk instanceof bufferExports.Buffer;
};
HexWriter.prototype.writeBinary = function(chunk, lengthFunction) {
  if (chunk instanceof BinaryHex) {
    lengthFunction(chunk.length());
    this.$hex += chunk.$hex;
  } else if (typeof bufferExports.Buffer === "function" && chunk instanceof bufferExports.Buffer) {
    lengthFunction(chunk.length);
    this.$hex += chunk.toString("hex");
  } else {
    throw new TypeError("HexWriter only accepts BinaryHex or Buffers");
  }
};
HexWriter.prototype.result = function() {
  if (this.finalFormat === "buffer" && typeof bufferExports.Buffer === "function") {
    return bufferExports.Buffer.from(this.$hex, "hex");
  }
  return new BinaryHex(this.$hex).toString(this.finalFormat);
};
HexWriter.prototype.writeString = function(string, lengthFunction) {
  var buffer2 = BinaryHex.fromUtf8String(string);
  lengthFunction(buffer2.length());
  this.$hex += buffer2.$hex;
};
addReader(function(data, format) {
  if (data instanceof BinaryHex || data.$hex) {
    return new HexReader(data.$hex);
  }
  if (format === "hex") {
    return new HexReader(data);
  }
});
addWriter(function(format) {
  if (format === "hex") {
    return new HexWriter();
  }
});
const alreadyPatchedTag = [];
const patchTags = (tags) => {
  tags.forEach((tag) => {
    if (alreadyPatchedTag.find((i) => i === tag)) return;
    addSemanticEncode(tag, (data) => {
      if (data instanceof DataItem) {
        if (data.getTag() === tag) {
          return data.getData();
        }
      }
    });
    addSemanticDecode(tag, (data) => {
      return new DataItem(data, tag);
    });
    alreadyPatchedTag.push(tag);
  });
};
const registryTags = Object.values(RegistryTypes$2).filter((r) => !!r.getTag()).map((r) => r.getTag());
const scriptExpressionTags = Object.values(ScriptExpressions).map((se) => se.getTag());
patchTags(registryTags.concat(scriptExpressionTags));
class RegistryItem {
  toCBOR = () => {
    if (this.toDataItem() === void 0) {
      throw new Error(
        `#[ur-registry][RegistryItem][fn.toCBOR]: registry ${this.getRegistryType()}'s method toDataItem returns undefined`
      );
    }
    return encodeDataItem(this.toDataItem());
  };
  toUR = () => {
    return new UR(this.toCBOR(), this.getRegistryType().getType());
  };
  toUREncoder = (maxFragmentLength, firstSeqNum, minFragmentLength) => {
    const ur = this.toUR();
    const urEncoder = new UREncoder(ur, maxFragmentLength, firstSeqNum, minFragmentLength);
    return urEncoder;
  };
}
class CryptoCoinInfo extends RegistryItem {
  constructor(type, network) {
    super();
    this.type = type;
    this.network = network;
  }
  getRegistryType = () => {
    return RegistryTypes$2.CRYPTO_COIN_INFO;
  };
  getType = () => {
    return this.type || 0;
  };
  getNetwork = () => {
    return this.network || 0;
  };
  toDataItem = () => {
    const map = {};
    if (this.type) {
      map[
        "1"
        /* type */
      ] = this.type;
    }
    if (this.network) {
      map[
        "2"
        /* network */
      ] = this.network;
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const type = map[
      "1"
      /* type */
    ];
    const network = map[
      "2"
      /* network */
    ];
    return new CryptoCoinInfo(type, network);
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem$2(_cborPayload);
    return CryptoCoinInfo.fromDataItem(dataItem);
  };
}
function bs58checkBase(checksumFn) {
  function encode2(payload) {
    var payloadU8 = Uint8Array.from(payload);
    var checksum = checksumFn(payloadU8);
    var length = payloadU8.length + 4;
    var both = new Uint8Array(length);
    both.set(payloadU8, 0);
    both.set(checksum.subarray(0, 4), payloadU8.length);
    return base58.encode(both);
  }
  function decodeRaw(buffer2) {
    var payload = buffer2.slice(0, -4);
    var checksum = buffer2.slice(-4);
    var newChecksum = checksumFn(payload);
    if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3])
      return;
    return payload;
  }
  function decodeUnsafe(str) {
    var buffer2 = base58.decodeUnsafe(str);
    if (buffer2 == null)
      return;
    return decodeRaw(buffer2);
  }
  function decode2(str) {
    var buffer2 = base58.decode(str);
    var payload = decodeRaw(buffer2);
    if (payload == null)
      throw new Error("Invalid checksum");
    return payload;
  }
  return {
    encode: encode2,
    decode: decode2,
    decodeUnsafe
  };
}
function sha256x2(buffer2) {
  return sha256(sha256(buffer2));
}
const bs58check = bs58checkBase(sha256x2);
class PathComponent {
  static HARDENED_BIT = 2147483648;
  index;
  wildcard;
  hardened;
  constructor(args) {
    this.index = args.index;
    this.hardened = args.hardened;
    if (this.index !== void 0) {
      this.wildcard = false;
    } else {
      this.wildcard = true;
    }
    if (this.index && (this.index & PathComponent.HARDENED_BIT) !== 0) {
      throw new Error(
        `#[ur-registry][PathComponent][fn.constructor]: Invalid index ${this.index} - most significant bit cannot be set`
      );
    }
  }
  getIndex = () => this.index;
  isWildcard = () => this.wildcard;
  isHardened = () => this.hardened;
}
class CryptoKeypath extends RegistryItem {
  constructor(components = [], sourceFingerprint, depth) {
    super();
    this.components = components;
    this.sourceFingerprint = sourceFingerprint;
    this.depth = depth;
  }
  getRegistryType = () => {
    return RegistryTypes$2.CRYPTO_KEYPATH;
  };
  getPath = () => {
    if (this.components.length === 0) {
      return void 0;
    }
    const components = this.components.map((component) => {
      return `${component.isWildcard() ? "*" : component.getIndex()}${component.isHardened() ? "'" : ""}`;
    });
    return components.join("/");
  };
  getComponents = () => this.components;
  getSourceFingerprint = () => this.sourceFingerprint;
  getDepth = () => this.depth;
  toDataItem = () => {
    const map = {};
    const components = [];
    this.components && this.components.forEach((component) => {
      if (component.isWildcard()) {
        components.push([]);
      } else {
        components.push(component.getIndex());
      }
      components.push(component.isHardened());
    });
    map[
      1
      /* components */
    ] = components;
    if (this.sourceFingerprint) {
      map[
        2
        /* source_fingerprint */
      ] = this.sourceFingerprint.readUInt32BE(0);
    }
    if (this.depth !== void 0) {
      map[
        3
        /* depth */
      ] = this.depth;
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const pathComponents = [];
    const components = map[
      1
      /* components */
    ];
    if (components) {
      for (let i = 0; i < components.length; i += 2) {
        const isHardened = components[i + 1];
        const path = components[i];
        if (typeof path === "number") {
          pathComponents.push(new PathComponent({ index: path, hardened: isHardened }));
        } else {
          pathComponents.push(new PathComponent({ hardened: isHardened }));
        }
      }
    }
    const _sourceFingerprint = map[
      2
      /* source_fingerprint */
    ];
    let sourceFingerprint;
    if (_sourceFingerprint) {
      sourceFingerprint = bufferExports.Buffer.alloc(4);
      sourceFingerprint.writeUInt32BE(_sourceFingerprint, 0);
    }
    const depth = map[
      3
      /* depth */
    ];
    return new CryptoKeypath(pathComponents, sourceFingerprint, depth);
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem$2(_cborPayload);
    return CryptoKeypath.fromDataItem(dataItem);
  };
}
const { encode } = bs58check;
class CryptoHDKey extends RegistryItem {
  master;
  privateKey;
  key;
  chainCode;
  useInfo;
  origin;
  children;
  parentFingerprint;
  name;
  note;
  isECKey = () => {
    return false;
  };
  getKey = () => this.key;
  getChainCode = () => this.chainCode;
  isMaster = () => this.master;
  isPrivateKey = () => !!this.privateKey;
  getUseInfo = () => this.useInfo;
  getOrigin = () => this.origin;
  getChildren = () => this.children;
  getParentFingerprint = () => this.parentFingerprint;
  getName = () => this.name;
  getNote = () => this.note;
  getBip32Key = () => {
    let version;
    let depth;
    let index2 = 0;
    let parentFingerprint = bufferExports.Buffer.alloc(4).fill(0);
    if (this.isMaster()) {
      version = bufferExports.Buffer.from("0488ADE4", "hex");
      depth = 0;
      index2 = 0;
    } else {
      depth = this.getOrigin()?.getComponents().length || this.getOrigin()?.getDepth();
      const paths = this.getOrigin()?.getComponents();
      const lastPath = paths[paths.length - 1];
      if (lastPath) {
        index2 = lastPath.isHardened() ? lastPath.getIndex() + 2147483648 : lastPath.getIndex();
        if (this.getParentFingerprint()) {
          parentFingerprint = this.getParentFingerprint();
        }
      }
      if (this.isPrivateKey()) {
        version = bufferExports.Buffer.from("0488ADE4", "hex");
      } else {
        version = bufferExports.Buffer.from("0488B21E", "hex");
      }
    }
    const depthBuffer = bufferExports.Buffer.alloc(1);
    depthBuffer.writeUInt8(depth, 0);
    const indexBuffer = bufferExports.Buffer.alloc(4);
    indexBuffer.writeUInt32BE(index2, 0);
    const chainCode = this.getChainCode();
    const key = this.getKey();
    return encode(
      bufferExports.Buffer.concat([
        version,
        depthBuffer,
        parentFingerprint,
        indexBuffer,
        chainCode,
        key
      ])
    );
  };
  getRegistryType = () => {
    return RegistryTypes$2.CRYPTO_HDKEY;
  };
  getOutputDescriptorContent = () => {
    let result = "";
    if (this.getOrigin()) {
      if (this.getOrigin()?.getSourceFingerprint() && this.getOrigin()?.getPath()) {
        result += `${this.getOrigin()?.getSourceFingerprint()?.toString("hex")}/${this.getOrigin()?.getPath()}`;
      }
    }
    result += this.getBip32Key();
    if (this.getChildren()) {
      if (this.getChildren()?.getPath()) {
        result += `/${this.getChildren()?.getPath()}`;
      }
    }
    return result;
  };
  constructor(args) {
    super();
    if (args.isMaster) {
      this.setupMasterKey(args);
    } else {
      this.setupDeriveKey(args);
    }
  }
  setupMasterKey = (args) => {
    this.master = true;
    this.key = args.key;
    this.chainCode = args.chainCode;
  };
  setupDeriveKey = (args) => {
    this.master = false;
    this.privateKey = args.isPrivateKey;
    this.key = args.key;
    this.chainCode = args.chainCode;
    this.useInfo = args.useInfo;
    this.origin = args.origin;
    this.children = args.children;
    this.parentFingerprint = args.parentFingerprint;
    this.name = args.name;
    this.note = args.note;
  };
  toDataItem = () => {
    const map = {};
    if (this.master) {
      map[
        1
        /* is_master */
      ] = true;
      map[
        3
        /* key_data */
      ] = this.key;
      map[
        4
        /* chain_code */
      ] = this.chainCode;
    } else {
      if (this.privateKey !== void 0) {
        map[
          2
          /* is_private */
        ] = this.privateKey;
      }
      map[
        3
        /* key_data */
      ] = this.key;
      if (this.chainCode) {
        map[
          4
          /* chain_code */
        ] = this.chainCode;
      }
      if (this.useInfo) {
        const useInfo = this.useInfo.toDataItem();
        useInfo.setTag(this.useInfo.getRegistryType().getTag());
        map[
          5
          /* use_info */
        ] = useInfo;
      }
      if (this.origin) {
        const origin = this.origin.toDataItem();
        origin.setTag(this.origin.getRegistryType().getTag());
        map[
          6
          /* origin */
        ] = origin;
      }
      if (this.children) {
        const children = this.children.toDataItem();
        children.setTag(this.children.getRegistryType().getTag());
        map[
          7
          /* children */
        ] = children;
      }
      if (this.parentFingerprint) {
        map[
          8
          /* parent_fingerprint */
        ] = this.parentFingerprint.readUInt32BE(0);
      }
      if (this.name !== void 0) {
        map[
          9
          /* name */
        ] = this.name;
      }
      if (this.note !== void 0) {
        map[
          10
          /* note */
        ] = this.note;
      }
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const isMaster = !!map[
      1
      /* is_master */
    ];
    const isPrivateKey = map[
      2
      /* is_private */
    ];
    const key = map[
      3
      /* key_data */
    ];
    const chainCode = map[
      4
      /* chain_code */
    ];
    const useInfo = map[
      5
      /* use_info */
    ] ? CryptoCoinInfo.fromDataItem(map[
      5
      /* use_info */
    ]) : void 0;
    const origin = map[
      6
      /* origin */
    ] ? CryptoKeypath.fromDataItem(map[
      6
      /* origin */
    ]) : void 0;
    const children = map[
      7
      /* children */
    ] ? CryptoKeypath.fromDataItem(map[
      7
      /* children */
    ]) : void 0;
    const _parentFingerprint = map[
      8
      /* parent_fingerprint */
    ];
    let parentFingerprint = void 0;
    if (_parentFingerprint) {
      parentFingerprint = bufferExports.Buffer.alloc(4);
      parentFingerprint.writeUInt32BE(_parentFingerprint, 0);
    }
    const name = map[
      9
      /* name */
    ];
    const note = map[
      10
      /* note */
    ];
    return new CryptoHDKey({
      isMaster,
      isPrivateKey,
      key,
      chainCode,
      useInfo,
      origin,
      children,
      parentFingerprint,
      name,
      note
    });
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem$2(_cborPayload);
    return CryptoHDKey.fromDataItem(dataItem);
  };
}
class CryptoMultiAccounts extends RegistryItem {
  constructor(masterFingerprint, keys, device, deviceId, version) {
    super();
    this.masterFingerprint = masterFingerprint;
    this.keys = keys;
    this.device = device;
    this.deviceId = deviceId;
    this.version = version;
  }
  getRegistryType = () => RegistryTypes$2.CRYPTO_MULTI_ACCOUNTS;
  getMasterFingerprint = () => this.masterFingerprint;
  getKeys = () => this.keys;
  getDevice = () => this.device;
  getDeviceId = () => this.deviceId;
  getVersion = () => this.version;
  toDataItem = () => {
    const map = {};
    if (this.masterFingerprint) {
      map[
        1
        /* masterFingerprint */
      ] = this.masterFingerprint.readUInt32BE(0);
    }
    if (this.keys) {
      map[
        2
        /* keys */
      ] = this.keys.map((item) => {
        const dataItem = item.toDataItem();
        dataItem.setTag(item.getRegistryType().getTag());
        return dataItem;
      });
    }
    if (this.device) {
      map[
        3
        /* device */
      ] = this.device;
    }
    if (this.deviceId) {
      map[
        4
        /* deviceId */
      ] = this.deviceId;
    }
    if (this.version) {
      map[
        5
        /* version */
      ] = this.version;
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const masterFingerprint = bufferExports.Buffer.alloc(4);
    const _masterFingerprint = map[
      1
      /* masterFingerprint */
    ];
    if (_masterFingerprint) {
      masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
    }
    const keys = map[
      2
      /* keys */
    ];
    const cryptoHDKeys = keys.map((item) => CryptoHDKey.fromDataItem(item));
    const device = map[
      3
      /* device */
    ];
    const deviceId = map[
      4
      /* deviceId */
    ];
    const version = map[
      5
      /* version */
    ];
    return new CryptoMultiAccounts(masterFingerprint, cryptoHDKeys, device, deviceId, version);
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem$2(_cborPayload);
    return CryptoMultiAccounts.fromDataItem(dataItem);
  };
}
const extend = {
  RegistryTypes: RegistryTypes$2,
  decodeToDataItem: decodeToDataItem$2
};
const ExtendedRegistryTypes = {
  IOTA_SIGN_REQUEST: new RegistryType("iota-sign-request", 8501),
  IOTA_SIGNATURE: new RegistryType("iota-signature", 8502),
  IOTA_SIGN_HASH_REQUEST: new RegistryType("iota-sign-hash-request", 8503)
};
const REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
function validate(uuid) {
  return typeof uuid === "string" && REGEX.test(uuid);
}
function parse(uuid) {
  if (!validate(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255, v / 4294967296 & 255, v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255);
}
const { decodeToDataItem: decodeToDataItem$1, RegistryTypes: RegistryTypes$1 } = extend;
class IotaSignRequest extends RegistryItem {
  requestId;
  intentMessage;
  derivationPaths;
  addresses;
  origin;
  getRegistryType = () => ExtendedRegistryTypes.IOTA_SIGN_REQUEST;
  constructor(args) {
    super();
    this.requestId = args.requestId;
    this.intentMessage = args.intentMessage;
    this.derivationPaths = args.derivationPaths;
    this.addresses = args.addresses;
    this.origin = args.origin;
  }
  getRequestId = () => this.requestId;
  getIntentMessage = () => this.intentMessage;
  getDerivationPaths = () => this.derivationPaths;
  getAddresses = () => this.addresses;
  getOrigin = () => this.origin;
  toDataItem = () => {
    const map = {};
    if (this.requestId) {
      map[
        1
        /* requestId */
      ] = new DataItem(this.requestId, RegistryTypes$1.UUID.getTag());
    }
    map[
      2
      /* intentMessage */
    ] = this.intentMessage;
    const derivationPaths = this.derivationPaths.map((path) => {
      const dataItem = path.toDataItem();
      dataItem.setTag(path.getRegistryType().getTag());
      return dataItem;
    });
    map[
      3
      /* derivationPaths */
    ] = derivationPaths;
    if (this.addresses) {
      map[
        4
        /* addresses */
      ] = this.addresses;
    }
    if (this.origin) {
      map[
        5
        /* origin */
      ] = this.origin;
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const requestId = map[
      1
      /* requestId */
    ] ? map[
      1
      /* requestId */
    ].getData() : void 0;
    return new IotaSignRequest({
      requestId,
      intentMessage: map[
        2
        /* intentMessage */
      ],
      derivationPaths: map[
        3
        /* derivationPaths */
      ].map(
        (path) => CryptoKeypath.fromDataItem(path)
      ),
      addresses: map[
        4
        /* addresses */
      ],
      origin: map[
        5
        /* origin */
      ]
    });
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem$1(_cborPayload);
    return IotaSignRequest.fromDataItem(dataItem);
  };
  static parsePath(path, xfp) {
    const paths = path.replace(/[m|M]\//, "").split("/");
    const pathComponent = paths.map((path2) => {
      const index2 = parseInt(path2.replace("'", ""));
      let isHardened = false;
      if (path2.endsWith("'")) {
        isHardened = true;
      }
      return new PathComponent({ index: index2, hardened: isHardened });
    });
    return new CryptoKeypath(pathComponent, bufferExports.Buffer.from(xfp, "hex"));
  }
  static constructIotaSignRequest(intentMessage, derivationPaths, xfp, uuidString, addresses, origin) {
    return new IotaSignRequest({
      requestId: uuidString ? bufferExports.Buffer.from(parse(uuidString)) : void 0,
      intentMessage,
      derivationPaths: derivationPaths.map((path) => IotaSignRequest.parsePath(path, xfp)),
      addresses,
      origin
    });
  }
}
const { RegistryTypes, decodeToDataItem } = extend;
class IotaSignature extends RegistryItem {
  requestId;
  signature;
  publicKey;
  getRegistryType = () => ExtendedRegistryTypes.IOTA_SIGNATURE;
  constructor(args) {
    super();
    this.requestId = args.requestId;
    this.signature = args.signature;
    this.publicKey = args.publicKey;
  }
  getRequestId = () => this.requestId;
  getSignature = () => this.signature;
  getPublicKey = () => this.publicKey;
  toDataItem = () => {
    const map = {};
    map[
      1
      /* requestId */
    ] = new DataItem(this.requestId, RegistryTypes.UUID.getTag());
    map[
      2
      /* signature */
    ] = this.signature;
    if (this.publicKey) {
      map[
        3
        /* publicKey */
      ] = this.publicKey;
    }
    return new DataItem(map);
  };
  static fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const signature = map[
      2
      /* signature */
    ];
    const requestId = map[
      1
      /* requestId */
    ]?.getData();
    const publicKey = map[
      3
      /* publicKey */
    ];
    return new IotaSignature({
      requestId,
      signature,
      publicKey
    });
  };
  static fromCBOR = (_cborPayload) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return IotaSignature.fromDataItem(dataItem);
  };
}
patchTags(
  Object.values(ExtendedRegistryTypes).filter((rt) => !!rt.getTag()).map((rt) => rt.getTag())
);
const UR_TYPES = {
  IOTA_SIGNATURE: "iota-signature",
  IOTA_SIGN_REQUEST: "iota-sign-request",
  UR_PREFIX: "ur:"
};
const ADDRESS_PREFIXES = {
  HEX: "0x",
  IOTA1Q: "iota1q"
};
const DEFAULT_DERIVATION_PATHS = "m/44'/4218'/0'/0'/0'";
const DEFAULT_MASTER_FINGERPRINT = "70ee3cac";
const DEFAULT_ACCOUNT_ADDRESS = "0xb9cbe931d4569659e5235346a9361642be3c045112bdc2676dd1e74d14d7c0a2";
const DEFAULT_WALLET_ORIGIN = "IOTA Wallet";
const DEFAULT_REQUEST_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
const EXAMPLE_RAW_TRANSACTION_BYTES_1 = "AAACAAgAypo7AAAAAAAgVTsVB+RtZMfs4jACWZp8XfogU5tbYbqiYDYTtMQdQcQCAgABAQAAAQEDAAAAAAEBAFU7FQfkbWTH7OIwAlmafF36IFObW2G6omA2E7TEHUHEAXzaorDJSfN6qSVVUDHjdog/B1KoxmcB+gSwrJ/B44ahuzcAAAAAAAAgTuYTwz7DtRoLbEVHWVZ/ehscmfPcHKW1aFzwWFydTKVVOxUH5G1kx+ziMAJZmnxd+iBTm1thuqJgNhO0xB1BxOgDAAAAAAAA4G88AAAAAAAA";
const EXAMPLE_RAW_TRANSACTION_BYTES_2 = "AAAFAQGpKmeuioxkSs+m3VpNgJiiCwe2Bhy/Nq/42u87qJKRP0VMyxUAAAAAAQAODW5uYWFtbWVlLmlvdGEACICWmAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAAgVTsVB+RtZMfs4jACWZp8XfogU5tbYbqiYDYTtMQdQcQFAOEoSHABhISnoSJVrrtze2uYtH1lK4QuovMkSZ/xY6ZIB3BheW1lbnQRaW5pdF9yZWdpc3RyYXRpb24AAgEAAAEBAAIAAQECAAAe+si/IArMpktiznVVfNcjIxD8jE6pCWBIfSkIBV/JTwhwYXltZW50cxNoYW5kbGVfYmFzZV9wYXltZW50AQcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgRpb3RhBElPVEEAAwEAAAIAAAIBAADhKEhwAYSEp6EiVa67c3trmLR9ZSuELqLzJEmf8WOmSAdwYXltZW50CHJlZ2lzdGVyAAMCAgABAAABAwABAQIDAAEEAFU7FQfkbWTH7OIwAlmafF36IFObW2G6omA2E7TEHUHEAXzaorDJSfN6qSVVUDHjdog/B1KoxmcB+gSwrJ/B44ahuzcAAAAAAAAgTuYTwz7DtRoLbEVHWVZ/ehscmfPcHKW1aFzwWFydTKVVOxUH5G1kx+ziMAJZmnxd+iBTm1thuqJgNhO0xB1BxOgDAAAAAAAAYHZvAAAAAAAA";
const EXAMPLE_SIGNATURE_HEX = "f4b79835417490958c72492723409289b444f3af18274ba484a9eeaca9e760520e453776e5975df058b537476932a45239685f694fc6362fe5af6ba714da6505";
const EXAMPLE_PUBLIC_KEY_HEX = "bfa73107effa14b21ff1b9ae2e6b2e770232b7c29018abbf76475b25395369c0";
const EXAMPLE_DECODE_SIGN_REQUEST_UR = "UR:IOTA-SIGN-REQUEST/OXADTPDAGDWLTPPLWPDEHEFDGULGKOPSJTKEOXLSHPAOHDUOAEAEAEAEAEAOAEAYAESGNYFRAEAEAEAEAECXIDHNWKLNAMUYWLGOGLGWGSAOKOTYGADTNTCWCEDRNDGHHDIDWLTNURWKFRJOFMEOAOAOAEADADAEAEADADAOAEAEADADAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEVTJLFNAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAOYKAEYKAEYKAOCYJOWYFNPSAALYHDCXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSWDFZPTVO";
const EXAMPLE_SIGNATURE_UR = "UR:IOTA-SIGNATURE/OTADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHDFZTDOLDWQZUYGLUYHGCKGOFNIHMTVAONCHENTYKBJOAOHFCAKEJKBNKNLRYTTBTADNDIIYQDWLZEYTAXTBIAOYPSDNBETDLDLKGTMKLAWFFGNTCTJEJPSGIHHKNYLNLUAXAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXYNMEOXBT";
const EXAMPLE_MULTIPART_SIGN_REQUEST_UR = `UR:IOTA-SIGN-REQUEST/1-2/LPADAOCFAONSCYKBBBMWSSHKADGLONADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHKAOEMAEAEAEAEAEAHADADPTDRIOPLLELKIEGETKOLUTHTGTLAMKOEBDATRPAMCERSENPEYATNWSFRPDMOMEFHFEGSSBBZAEAEAEAEADAEBABTJTJTHSHSJNJNIHIHDMINJLJYHSAEAYLAMTMKAEAEAEAEAEADADAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAMADAEAEAEAEAEAEAEAEAECXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSAHAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYBYINJTINJYHEJPIHIOINJKJYJPHSJYINJLJTAEAOADAEAEADADAEAOAEADADAOAEAECKZSSPRSCXBKSFOLGRIDTOKPGOKETSCNCNBEZTLKGLPTASHNFDKIDTAYAHHESOGWAYJOHSKKJNIHJTJYJKBWISHSJTIEJZIHHEIDHSJKIHHEJOHSKKJNIHJTJYADATAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAETONSWTRT
UR:IOTA-SIGN-REQUEST/2-2/LPAOAOCFAONSCYKBBBMWSSHKADGLAEAEAEAEAEAEAEAEAEAEAEAEAOAAINJLJYHSAAGAGWGHFPAEAXADAEAEAOAEAEAOADAEAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYAYJPIHIOINJKJYIHJPAEAXAOAOAEADAEAEADAXAEADADAOAXAEADAAAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEHNKOJLAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAALYHDCXRHSBWLEHTYHFMTHKVWCNGUFGPTENCMFWRNFNAAGYBGRYSAIOJNTTVDGTBBTSRTOEAHJEGAGWGHFPCXHGHSJZJZIHJYWZESHLIH
UR:IOTA-SIGN-REQUEST/3-2/LPAXAOCFAONSCYKBBBMWSSHKADGLONADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHKAOEMAEAEAEAEAEAHADADPTDRIOPLLELKIEGETKOLUTHTGTLAMKOEBDATRPAMCERSENPEYATNWSFRPDMOMEFHFEGSSBBZAEAEAEAEADAEBABTJTJTHSHSJNJNIHIHDMINJLJYHSAEAYLAMTMKAEAEAEAEAEADADAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAMADAEAEAEAEAEAEAEAEAECXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSAHAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYBYINJTINJYHEJPIHIOINJKJYJPHSJYINJLJTAEAOADAEAEADADAEAOAEADADAOAEAECKZSSPRSCXBKSFOLGRIDTOKPGOKETSCNCNBEZTLKGLPTASHNFDKIDTAYAHHESOGWAYJOHSKKJNIHJTJYJKBWISHSJTIEJZIHHEIDHSJKIHHEJOHSKKJNIHJTJYADATAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAETLCKFDIO
UR:IOTA-SIGN-REQUEST/4-2/LPAAAOCFAONSCYKBBBMWSSHKADGLAEAEAEAEAEAEAEAEAEAEAEAEAOAAINJLJYHSAAGAGWGHFPAEAXADAEAEAOAEAEAOADAEAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYAYJPIHIOINJKJYIHJPAEAXAOAOAEADAEAEADAXAEADADAOAXAEADAAAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEHNKOJLAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAALYHDCXRHSBWLEHTYHFMTHKVWCNGUFGPTENCMFWRNFNAAGYBGRYSAIOJNTTVDGTBBTSRTOEAHJEGAGWGHFPCXHGHSJZJZIHJYUERNMWLK`;
function getExampleData() {
  return {
    requestId: DEFAULT_REQUEST_ID,
    walletOrigin: DEFAULT_WALLET_ORIGIN,
    signatureHex: EXAMPLE_SIGNATURE_HEX,
    publicKeyHex: EXAMPLE_PUBLIC_KEY_HEX,
    rawTransactionBytes: EXAMPLE_RAW_TRANSACTION_BYTES_1,
    rawTransactionBytes2: EXAMPLE_RAW_TRANSACTION_BYTES_2,
    decodeSignRequestUR: EXAMPLE_DECODE_SIGN_REQUEST_UR,
    exampleSignatureUR: EXAMPLE_SIGNATURE_UR,
    exampleMultiSignRequestUR: EXAMPLE_MULTIPART_SIGN_REQUEST_UR,
    // Connection data - initially set to defaults but should be overridden by scanning
    derivationPaths: DEFAULT_DERIVATION_PATHS,
    masterFingerprint: DEFAULT_MASTER_FINGERPRINT,
    accountAddress: DEFAULT_ACCOUNT_ADDRESS
  };
}
const TRANSACTION_EXAMPLES = {
  simple: {
    title: "📄 Load Example TX 1 (Simple Transfer)",
    description: "Simple IOTA transaction - coin transfer",
    data: EXAMPLE_RAW_TRANSACTION_BYTES_1
  },
  complex: {
    title: "📄 Load Example TX 2 (Complex)",
    description: "Complex IOTA transaction - domain registration with payments",
    data: EXAMPLE_RAW_TRANSACTION_BYTES_2
  }
};
function extractBuffer(val) {
  if (!val) return bufferExports.Buffer.alloc(0);
  if (bufferExports.Buffer.isBuffer(val)) return val;
  if (typeof val === "object" && val.type === "Buffer" && Array.isArray(val.data)) {
    return bufferExports.Buffer.from(val.data);
  }
  return bufferExports.Buffer.from(val);
}
const uuidParse = (str) => {
  const hex = str.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
};
const uuidStringify = (bytes) => {
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return [
    hex.substr(0, 8),
    hex.substr(8, 4),
    hex.substr(12, 4),
    hex.substr(16, 4),
    hex.substr(20, 12)
  ].join("-");
};
function deriveIotaAddress(publicKeyHex) {
  try {
    if (publicKeyHex === void 0) {
      console.error("deriveIotaAddress called with undefined! This is a bug in the caller.");
      return "Error deriving address";
    }
    if (!publicKeyHex || typeof publicKeyHex !== "string" || publicKeyHex.length === 0) {
      console.error("deriveIotaAddress: Public key is undefined or empty", publicKeyHex);
      return "Error deriving address";
    }
    let cleanHex = publicKeyHex;
    if (cleanHex.startsWith(ADDRESS_PREFIXES.HEX)) {
      cleanHex = cleanHex.slice(2);
    }
    let bytes = fromHEX(cleanHex);
    const publicKey = new Ed25519PublicKey(bytes);
    return publicKey.toIotaAddress();
  } catch (error) {
    console.error("Failed to derive IOTA address:", error, "for public key:", publicKeyHex);
    return "Error deriving address";
  }
}
function createUrProcessorState() {
  return {
    urDecoder: null,
    scannedParts: /* @__PURE__ */ new Set(),
    expectedParts: 0,
    receivedParts: 0,
    isMultipart: false
  };
}
function resetMultipartState(state) {
  state.urDecoder = null;
  state.scannedParts.clear();
  state.receivedParts = 0;
  state.expectedParts = 0;
  state.isMultipart = false;
}
function handleScanResult(data, state) {
  try {
    console.log("Scanned data:", data);
    const lowerData = data.toLowerCase();
    if (!lowerData.startsWith(UR_TYPES.UR_PREFIX)) {
      throw new Error(`Invalid UR format - must start with "${UR_TYPES.UR_PREFIX}" or "UR:"`);
    }
    if (!state.urDecoder) {
      state.urDecoder = new URDecoder();
      state.scannedParts.clear();
      state.receivedParts = 0;
    }
    if (state.scannedParts.has(data)) {
      return {
        success: true,
        debugInfo: "Already scanned this part",
        needsMoreParts: true
      };
    }
    state.scannedParts.add(data);
    state.urDecoder.receivePart(data);
    state.receivedParts = state.scannedParts.size;
    const parts = lowerData.split("/");
    if (parts.length >= 3 && (parts[1].includes("-") || parts[1].match(/\d+-\d+/))) {
      state.isMultipart = true;
      const seqPart = parts[1];
      if (seqPart.includes("-")) {
        const [current, total] = seqPart.split("-").map(Number);
        state.expectedParts = total;
      }
    } else {
      state.isMultipart = false;
    }
    state.isMultipart = !!state.isMultipart;
    state.expectedParts = Number(state.expectedParts);
    state.receivedParts = Number(state.receivedParts);
    if (state.urDecoder.isComplete()) {
      const result = state.urDecoder.resultUR();
      console.log("UR decode complete!", result);
      const type = result.type;
      const cborHex = result.cbor.toString("hex");
      console.log("Final decoded type:", type);
      console.log("Final decoded CBOR hex:", cborHex);
      return processCompleteUR(type, cborHex, state);
    } else {
      console.log(
        `Waiting for more parts... (${state.receivedParts}/${state.expectedParts || "?"})`
      );
      return {
        success: true,
        debugInfo: state.isMultipart ? `Received part (${state.receivedParts}/${state.expectedParts || "?"} parts)` : "Single part UR - processing...",
        needsMoreParts: true
      };
    }
  } catch (error) {
    console.error("Failed to process scanned data:", error);
    return {
      success: false,
      debugInfo: "Scan processing failed: " + error.message,
      connectionError: "Failed to process scan: " + error.message
    };
  }
}
function processCompleteUR(type, cborHex, state) {
  try {
    resetMultipartState(state);
    console.log("Processing UR type:", type, "CBOR hex:", cborHex);
    if (type === UR_TYPES.IOTA_SIGNATURE) {
      const signature = IotaSignature.fromCBOR(bufferExports.Buffer.from(cborHex, "hex"));
      const decodedData = {
        type,
        cborHex,
        specific: {
          requestId: uuidStringify(signature.getRequestId() ?? new Uint8Array()),
          signature: bufferExports.Buffer.from(signature.getSignature() ?? new Uint8Array()).toString(
            "hex"
          ),
          publicKey: bufferExports.Buffer.from(signature.getPublicKey() ?? new Uint8Array()).toString(
            "hex"
          )
        }
      };
      return {
        success: true,
        scanResult: JSON.stringify(decodedData, null, 2),
        debugInfo: "IOTA signature UR processed successfully",
        needsMoreParts: false
      };
    } else {
      return processAccountData(type, cborHex);
    }
  } catch (error) {
    console.error("Failed to process complete UR:", error);
    return {
      success: false,
      debugInfo: "Processing failed: " + error.message,
      connectionError: "Failed to process complete UR: " + error.message
    };
  }
}
function processAccountData(type, cborHex) {
  const onSucceed = ({ type: type2, cbor }) => {
    try {
      console.log("Attempting to parse as multi-accounts...");
      const multiAccounts = CryptoMultiAccounts.fromCBOR(bufferExports.Buffer.from(cbor, "hex"));
      console.log("MultiAccounts: ", multiAccounts);
      const fullMultiAccountsData = JSON.stringify(multiAccounts, null, 2);
      const keystoneAccountData = {
        device: multiAccounts.getDevice() || "Keystone Device",
        masterFingerprint: multiAccounts.getMasterFingerprint()?.toString("hex") || "",
        keys: multiAccounts.getKeys() || []
      };
      if (multiAccounts && multiAccounts.getKeys && multiAccounts.getKeys().length > 0) {
        const firstAccount = multiAccounts.getKeys()[0];
        const connectedDevice = multiAccounts.getDevice() || "Keystone Device";
        const devicePublicKeyBuf = extractBuffer(firstAccount.getKey?.());
        const deviceChainCodeBuf = extractBuffer(firstAccount.getChainCode?.());
        const devicePublicKey = devicePublicKeyBuf && devicePublicKeyBuf.length > 0 ? devicePublicKeyBuf.toString("hex") : void 0;
        const deviceChainCode = deviceChainCodeBuf && deviceChainCodeBuf.length > 0 ? deviceChainCodeBuf.toString("hex") : void 0;
        let accountAddressDecoded = "Error deriving address";
        if (keystoneAccountData.keys && keystoneAccountData.keys.length > 0 && typeof keystoneAccountData.keys[0].getKey === "function") {
          const keyBuf = extractBuffer(keystoneAccountData.keys[0].getKey());
          const keyHex = keyBuf.length > 0 ? keyBuf.toString("hex") : void 0;
          if (typeof keyHex === "string" && keyHex.length > 0) {
            accountAddressDecoded = deriveIotaAddress(keyHex);
          }
        }
        const debugInfo = `Successfully parsed multi-accounts (${multiAccounts.getKeys().length} keys)`;
        return {
          success: true,
          debugInfo,
          connectedDevice,
          devicePublicKey,
          deviceChainCode,
          accountAddress: accountAddressDecoded,
          fullMultiAccountsData,
          keystoneAccountData,
          selectedAccountIndex: 0
        };
      } else {
        return {
          success: true,
          debugInfo: "Connected but no account data found",
          connectedDevice: "Keystone Device",
          devicePublicKey: "Successfully connected",
          deviceChainCode: "",
          accountAddress: "",
          fullMultiAccountsData,
          keystoneAccountData,
          selectedAccountIndex: 0
        };
      }
    } catch (parseError) {
      console.log("Multi-accounts parsing failed, trying as HD Key...");
      try {
        const hdKey = CryptoHDKey.fromCBOR(bufferExports.Buffer.from(cbor, "hex"));
        console.log("HD Key: ", hdKey);
        const fullMultiAccountsData = JSON.stringify(hdKey, null, 2);
        const connectedDevice = hdKey.name || "Keystone Device";
        const hdKeyPublicKeyBuf = extractBuffer(hdKey.bip32Key);
        const hdKeyChainCodeBuf = extractBuffer(hdKey.chainCode);
        const devicePublicKey = hdKeyPublicKeyBuf && hdKeyPublicKeyBuf.length > 0 ? hdKeyPublicKeyBuf.toString("hex") : void 0;
        const deviceChainCode = hdKeyChainCodeBuf && hdKeyChainCodeBuf.length > 0 ? hdKeyChainCodeBuf.toString("hex") : void 0;
        let accountAddress = "Error deriving address";
        if (typeof hdKey.getKey === "function") {
          const keyBuf = extractBuffer(hdKey.getKey());
          const keyHex = keyBuf.length > 0 ? keyBuf.toString("hex") : void 0;
          if (typeof keyHex === "string" && keyHex.length > 0) {
            accountAddress = deriveIotaAddress(keyHex);
          }
        }
        return {
          success: true,
          debugInfo: "Successfully parsed as HD Key",
          connectedDevice,
          devicePublicKey,
          deviceChainCode,
          accountAddress,
          fullMultiAccountsData
        };
      } catch (hdKeyError) {
        const parseErrorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        const hdKeyErrorMsg = hdKeyError instanceof Error ? hdKeyError.message : String(hdKeyError);
        throw new Error(
          `Failed to parse as both multi-accounts and HD Key: ${parseErrorMsg}, ${hdKeyErrorMsg}`
        );
      }
    }
  };
  return onSucceed({ type, cbor: cborHex });
}
var root_2 = from_html(`<option> </option>`);
var root_1 = from_html(`<div class="account-info svelte-18r9j1v"><h2 class="svelte-18r9j1v">Connected Keystone Device</h2> <label for="account-select">Select Account:</label> <select id="account-select" class="svelte-18r9j1v"></select> <div class="account-details svelte-18r9j1v"><p class="svelte-18r9j1v"><strong>Device:</strong> </p> <p class="svelte-18r9j1v"><strong>Master Fingerprint:</strong> <code class="svelte-18r9j1v"> </code></p> <p class="svelte-18r9j1v"><strong>Selected Path:</strong> <code class="svelte-18r9j1v"> </code></p> <p class="svelte-18r9j1v"><strong>Address:</strong> <code class="svelte-18r9j1v"> </code></p></div></div>`);
var root_4 = from_html(`<div class="controls svelte-18r9j1v"><button class="svelte-18r9j1v">Reset Multipart</button></div>`);
var root_5 = from_html(`<div class="success svelte-18r9j1v"><p> </p> <button>Clear Connection</button></div>`);
var root_3 = from_html(`<div class="step-content svelte-18r9j1v"><h2>Step 1: Connect Keystone Device</h2> <p>Display the wallet connect QR code on your Keystone device and scan it with the
                camera below.</p> <!> <!> <button style="margin: 0;">Simulate Scan</button> <!></div>`);
var root_7 = from_html(`<div class="qr-section svelte-18r9j1v"><h3 class="svelte-18r9j1v">3. Scan this QR code with your Keystone device to approve the transaction</h3> <!></div>`);
var root_6 = from_html(`<div class="step-content svelte-18r9j1v"><h2>Step 2: Prepare Transaction</h2> <p>Configure the transaction parameters and generate a signing request QR code.</p> <div class="form-section svelte-18r9j1v"><div class="form-row svelte-18r9j1v"><label for="request-id" class="svelte-18r9j1v">Request ID:</label> <input id="request-id" class="svelte-18r9j1v"/></div> <label for="raw-tx" class="full-width svelte-18r9j1v">Transaction Bytes (Base64):</label> <textarea id="raw-tx" rows="4" class="full-width svelte-18r9j1v"></textarea> <div class="example-buttons svelte-18r9j1v"><button class="svelte-18r9j1v"> </button> <button class="svelte-18r9j1v"> </button></div> <div class="form-row svelte-18r9j1v"><label for="account-address" class="svelte-18r9j1v">Account Address:</label> <input id="account-address" class="svelte-18r9j1v"/></div> <div class="form-row svelte-18r9j1v"><label for="derivation-path" class="svelte-18r9j1v">Derivation Path:</label> <input id="derivation-path" class="svelte-18r9j1v"/></div> <div class="form-row svelte-18r9j1v"><label for="master-fingerprint" class="svelte-18r9j1v">Master Fingerprint:</label> <input id="master-fingerprint" class="svelte-18r9j1v"/></div> <div class="form-row svelte-18r9j1v"><label for="wallet-origin" class="svelte-18r9j1v">Wallet Origin:</label> <input id="wallet-origin" class="svelte-18r9j1v"/></div></div> <!></div>`);
var root_10 = from_html(`<div class="error svelte-18r9j1v"> </div>`);
var root_9 = from_html(`<div class="result svelte-18r9j1v"><h3 class="svelte-18r9j1v">Signature Result:</h3> <pre class="svelte-18r9j1v"> </pre> <button> </button> <!> <!></div>`);
var root_8 = from_html(`<div class="step-content svelte-18r9j1v"><h2>Step 4: Scan Signature</h2> <p>After approving the transaction on your Keystone device, scan the signature QR code
                it displays.</p> <!> <button style="margin: 0;">Simulate Scan</button> <!></div>`);
var root_13 = from_html(`<div class="result svelte-18r9j1v"><h3 class="svelte-18r9j1v">Decoded Data:</h3> <pre class="svelte-18r9j1v"> </pre></div>`);
var root_12 = from_html(`<div class="step-content svelte-18r9j1v"><h2>UR Decode Tool</h2> <p>Decode and analyze UR strings from Keystone devices.</p> <div class="form-section svelte-18r9j1v"><label for="ur-input" class="full-width svelte-18r9j1v">UR String:</label> <textarea id="ur-input" rows="4" placeholder="Paste UR string here..." class="full-width svelte-18r9j1v"></textarea> <div class="example-buttons svelte-18r9j1v"><button class="svelte-18r9j1v">Load Sign Request Example</button> <button class="svelte-18r9j1v">Load Signature Example</button> <button class="svelte-18r9j1v">Load Multipart Example</button></div></div> <!></div>`);
var root_14 = from_html(`<div class="error svelte-18r9j1v"><p> </p></div>`);
var root = from_html(`<div class="keystone-container svelte-18r9j1v"><h1 class="svelte-18r9j1v">Keystone Hardware Wallet - IOTA Integration</h1> <!> <div class="steps svelte-18r9j1v"><button>1. Connect Wallet</button> <button>2. Prepare Transaction</button> <button>4. Scan Signature</button> <button>UR Decode Tool</button></div> <!> <!> <!> <!> <!></div>`);
function Keystone($$anchor, $$props) {
  push($$props, false);
  const isMultipart = mutable_source();
  const expectedParts = mutable_source();
  const receivedParts = mutable_source();
  let activeStep = mutable_source("connect");
  let scanResult = mutable_source("");
  let scanError = mutable_source("");
  let urProcessorState = createUrProcessorState();
  let connectedDevice = mutable_source("");
  let connectionError = mutable_source("");
  let derivationPaths = mutable_source(DEFAULT_DERIVATION_PATHS);
  let masterFingerprint = mutable_source(DEFAULT_MASTER_FINGERPRINT);
  let accountAddress = mutable_source(DEFAULT_ACCOUNT_ADDRESS);
  const exampleData = getExampleData();
  let requestId = mutable_source(exampleData.requestId);
  let rawTransactionBytes = mutable_source("");
  let walletOrigin = mutable_source(exampleData.walletOrigin);
  let keystoneAccountData = mutable_source(null);
  let selectedAccountIndex = mutable_source(0);
  let qrScannerComponent = mutable_source();
  let qrGeneratorComponent = mutable_source();
  let qrCbor = mutable_source("");
  let qrUrType = mutable_source("");
  let showQrGenerator = mutable_source(false);
  let urToDecode = mutable_source("");
  let decodedUrData = mutable_source("");
  let urDecodeError = mutable_source("");
  let transactionResult = mutable_source(null);
  let submitting = mutable_source(false);
  let submitError = mutable_source("");
  function handleScanResult$1(data2) {
    const result = handleScanResult(data2, urProcessorState);
    set(isMultipart, urProcessorState.isMultipart);
    set(expectedParts, urProcessorState.expectedParts);
    set(receivedParts, urProcessorState.receivedParts);
    if (result.success) {
      if (result.needsMoreParts) {
        return;
      }
      if (get(qrScannerComponent)) {
        get(qrScannerComponent).stopScanning();
      }
      if (result.connectedDevice) set(connectedDevice, result.connectedDevice);
      if (result.accountAddress) set(accountAddress, result.accountAddress);
      if (result.keystoneAccountData) {
        set(keystoneAccountData, result.keystoneAccountData);
        console.log("Keystone account data:", get(keystoneAccountData));
        set(selectedAccountIndex, result.selectedAccountIndex || 0);
      }
      if (result.scanResult) set(scanResult, result.scanResult);
      set(connectionError, "");
    } else {
      set(connectionError, result.connectionError || "Unknown error occurred");
    }
  }
  function resetMultipartState$1() {
    resetMultipartState(urProcessorState);
    set(isMultipart, urProcessorState.isMultipart);
    set(expectedParts, urProcessorState.expectedParts);
    set(receivedParts, urProcessorState.receivedParts);
  }
  function clearConnection() {
    set(connectedDevice, "");
    set(accountAddress, "");
    set(derivationPaths, "");
    set(masterFingerprint, "");
    set(connectionError, "");
    set(scanError, "");
    set(keystoneAccountData, null);
    set(selectedAccountIndex, 0);
    resetMultipartState$1();
  }
  function generateSignRequest() {
    try {
      if (!get(rawTransactionBytes) || get(rawTransactionBytes).trim() === "") {
        set(showQrGenerator, false);
        return;
      }
      const useMasterFingerprint = get(masterFingerprint) || DEFAULT_MASTER_FINGERPRINT;
      const useAccountAddress = get(accountAddress) || DEFAULT_ACCOUNT_ADDRESS;
      const txBytes = new Uint8Array(bufferExports.Buffer.from(get(rawTransactionBytes), "base64"));
      const txMessageIntent = messageWithIntent("TransactionData", txBytes);
      const pathString = get(derivationPaths).trim().replace(/^m\//, "");
      const pathSegments = pathString.split("/");
      const pathComponents = pathSegments.filter((part) => part.trim() !== "").map((part) => {
        const isHardened = part.includes("'");
        const index2 = parseInt(part.replace("'", ""));
        return new PathComponent({ index: index2, hardened: isHardened });
      });
      const signKeyPath = new CryptoKeypath(pathComponents, bufferExports.Buffer.from(useMasterFingerprint, "hex"));
      const idBuffer = uuidParse(get(requestId));
      const iotaSignRequest = new IotaSignRequest({
        requestId: bufferExports.Buffer.from(idBuffer),
        intentMessage: bufferExports.Buffer.from(txMessageIntent),
        derivationPaths: [signKeyPath],
        addresses: [
          bufferExports.Buffer.from(useAccountAddress.replace(ADDRESS_PREFIXES.HEX, "").replace(ADDRESS_PREFIXES.IOTA1Q, ""), "hex")
        ],
        origin: get(walletOrigin)
      });
      const cborHex = iotaSignRequest.toCBOR().toString("hex");
      if (!get(keystoneAccountData)) {
        set(scanError, "ℹ️ Using demo values - connect Keystone device for real account data");
      } else {
        set(scanError, "");
      }
      set(qrCbor, cborHex);
      set(qrUrType, UR_TYPES.IOTA_SIGN_REQUEST);
      set(showQrGenerator, true);
    } catch (error) {
      console.error("Error in generateSignRequest:", error);
      set(scanError, error instanceof Error ? error.message : "Failed to generate sign request");
      set(showQrGenerator, false);
    }
  }
  function updateSelectedAccount() {
    if (!get(keystoneAccountData) || !get(keystoneAccountData).keys) {
      return;
    }
    const selectedAccount = get(keystoneAccountData).keys[get(selectedAccountIndex)];
    if (selectedAccount) {
      set(derivationPaths, "");
      set(derivationPaths, selectedAccount.path + "");
      set(masterFingerprint, get(keystoneAccountData).masterFingerprint);
      set(accountAddress, deriveIotaAddress(toHEX(selectedAccount.getKey())));
    }
  }
  function loadExampleUR(type) {
    switch (type) {
      case "signRequest":
        set(urToDecode, EXAMPLE_DECODE_SIGN_REQUEST_UR);
        break;
      case "signature":
        set(urToDecode, EXAMPLE_SIGNATURE_UR);
        break;
      case "multipart":
        set(urToDecode, EXAMPLE_MULTIPART_SIGN_REQUEST_UR);
        break;
    }
    set(decodedUrData, "");
    set(urDecodeError, "");
    decodeUR();
  }
  function decodeUR() {
    try {
      if (!get(urToDecode).trim()) {
        set(urDecodeError, "Please enter a UR to decode");
        set(decodedUrData, "");
        return;
      }
      const urDecoder = new URDecoder();
      const urParts = get(urToDecode).trim().split(/[\n\s]+/);
      for (const part of urParts) {
        if (part.trim()) {
          urDecoder.receivePart(part.trim());
        }
      }
      if (urDecoder.isComplete()) {
        const result = urDecoder.resultUR();
        const type = result.type;
        const cborHex = result.cbor.toString("hex");
        let decodedData = { type, cborHex };
        if (type === UR_TYPES.IOTA_SIGN_REQUEST) {
          const signRequest = IotaSignRequest.fromCBOR(result.cbor);
          decodedData.specific = {
            requestId: uuidStringify(signRequest.getRequestId()),
            intentMessage: bufferExports.Buffer.from(signRequest.getIntentMessage()).toString("hex"),
            derivationPaths: signRequest.getDerivationPaths().map((p) => p.getPath()),
            addresses: signRequest.getAddresses()?.map((a) => bufferExports.Buffer.from(a).toString("hex")) || [],
            origin: signRequest.getOrigin()
          };
        } else if (type === UR_TYPES.IOTA_SIGNATURE) {
          const signature = IotaSignature.fromCBOR(result.cbor);
          decodedData.specific = {
            requestId: uuidStringify(signature.getRequestId()),
            signature: bufferExports.Buffer.from(signature.getSignature()).toString("hex"),
            publicKey: bufferExports.Buffer.from(signature.getPublicKey()).toString("hex")
          };
        }
        set(decodedUrData, JSON.stringify(decodedData, null, 2));
        set(urDecodeError, "");
      } else {
        throw new Error("UR decoding incomplete");
      }
    } catch (error) {
      console.error("Failed to decode UR:", error);
      set(urDecodeError, "Failed to decode UR: " + error.message);
      set(decodedUrData, "");
    }
  }
  async function submitSignedTransaction() {
    set(submitting, true);
    set(submitError, "");
    set(transactionResult, null);
    try {
      const parsed = JSON.parse(get(scanResult));
      const txBytes = new Uint8Array(bufferExports.Buffer.from(get(rawTransactionBytes), "base64"));
      const signatureHex = parsed.specific.signature;
      const publicKeyHex = parsed.specific.key;
      const signatureBytes = bufferExports.Buffer.from(signatureHex, "hex");
      const publicKeyBytes = bufferExports.Buffer.from(publicKeyHex, "hex");
      const bcsSignature = bufferExports.Buffer.concat([bufferExports.Buffer.from([0]), signatureBytes, publicKeyBytes]);
      const result = await getClient().executeTransactionBlock({
        transactionBlock: txBytes,
        signature: toB64(bcsSignature),
        options: {
          showBalanceChanges: true,
          showObjectChanges: true,
          showEffects: true,
          showInput: true
        }
      });
      set(transactionResult, result);
    } catch (error) {
      set(submitError, error instanceof Error ? error.message : String(error));
    } finally {
      set(submitting, false);
    }
  }
  function switchStep(step) {
    set(activeStep, step);
    set(scanError, "");
    resetMultipartState$1();
  }
  const data = getExampleData();
  set(requestId, data.requestId);
  set(walletOrigin, data.walletOrigin);
  const simulatedUrParts = [
    "UR:CRYPTO-MULTI-ACCOUNTS/56-4/LPCSETAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMIDESTIPL",
    "UR:CRYPTO-MULTI-ACCOUNTS/57-4/LPCSESAACFAXBTCYMKWSWELPHDSSDMBEWZHHAYFSIDJZMNOTBYKNWMLODMWFPSTNJKECIDSKHLKBIDIYLUCAPFFYCLZTCSHPRDRNCXLKYAFHJSESNNGMSRMNRNNYRKCHCNEEGMJYJEGRCKSTQZFRVOYLDPHHCSBZHEVOFHBDUYJELESTPLKGMWKNHFAAFWSOESWYWKETJKCWFLWTHHVORKREDPECBYAOEMPAWNWFIAJTSAMSATLACEPAFLVTJOIHKGDYBEOLPTGMBSFHJLSAHGDYNDMKLEKOAMZTEMKBRPREUORPKEKEZTMWWMDYTSKGAYIHOSGWAERNHKRTVLDMETFRCEGAJEWPDTDSHEHKCPADNDJLZSAMVYLDHPTDAHFZBNDNOELBCSPMLRESHGNECTAMFEMNAHWSETAESEGYVWJL",
    "UR:CRYPTO-MULTI-ACCOUNTS/58-4/LPCSFTAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMPRJTIMDY",
    "UR:CRYPTO-MULTI-ACCOUNTS/59-4/LPCSFRAACFAXBTCYMKWSWELPHDSSDMCYTPYNFPDYSPRLAHGEQDGHSKMOYNAHWEWDSBZSDNWNMSSFKNZOJZGLJETBRDDMGHJNKEZOCNMKOERPHGLTZCNLAHONMKRTVWECNBZSYNURGTEHAEUTKBWNLFCTTNJSSSKTCYNETPAEGWWKEEWLOEDMDMCYTPYNFPDYKOCYSKTTTTECINWDLRBBZSLPFLRPTLBKLOPEDKSGISEMDNSEJZRPFSFPPMCFSAKGLESSBEMUYARHFGEOCFBAHYDYRNYALEGYIDYAPEVSFMSPRNBKAXGWENQDVSVEJTQDGWWKEMWLOEDMDMCYTPYNFPDYGURYHPAHLUAYJSFXZSYLTNHEJPATRSEMGHJZCPBKJTPSNBKTSREHLPMYDRFDWDPTIAYTEYDYOTADMNONIYFT",
    "UR:CRYPTO-MULTI-ACCOUNTS/60-4/LPCSFNAACFAXBTCYMKWSWELPHDSSAEBKDRPKGABTPKUYLUWLOEDMDMCYTPYNFPDYROTKGAEESGPRCSNTVDGUUYMONDTDGSENSWFEAXBBHTLDDSRNIASBSWDNDSHTHYCPLSTOOXPYDSKNCKCYSGSGHNVSYLDPUOIDFEKIVDBDMWNERNDMBNGORDHNMNWZAXYTGWWKEHWLOEDMDMCYTPYNFPDYIMLSSSAYRSCKTLESBDHKWLHFJEENCLWTWDYTPRCKWNWKAEECGYWMGABNKOSFASAEDAHNAEDIIEAAMKMTLOKIIDRFLBEOSGDIAXTYRHSPFLMEMHOLOEMHKTTNFRTPKKBDGWWKDYWLOEDMDMCYTPYNFPDYLOADHYRNBSRNDIGEIDLTAOAYUYNSADRPKITSYKPEDSKTEMURNDADPEJTVALY",
    "UR:CRYPTO-MULTI-ACCOUNTS/61-4/LPCSFSAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMJSSFKBNS",
    "UR:CRYPTO-MULTI-ACCOUNTS/62-4/LPCSFMAACFAXBTCYMKWSWELPHDSSOXAOWKAXHDCXPRFWAORSQDOYSKIOWKCTNTAAYLHFDEWKNNPTDTPLDAIAHHBSRKADWTJLLOYAKGROAMTAADDYOTADLECSDWYKCFBEKNYKAHYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPECTAADDLOXAOWKAXHDCXBNWSSNDKTTRTINCTLNBALEJEKGCYTBBSLYSGKTNECLCYBWCSJNNLNLFXHKCYNYHPAMTAADDYOTADLECSDWYKCFBEKNYKAMYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPENTAADDLOXAOWKAXHDCXDTFDGMWTLUZCJSRPYAWEPKPAGLPYRFEYHLASJSHEDILYNLJYPTHTVTYNHKFNLPSTAMTAADDYOTADSNGYPRCT"
  ];
  function simulateScanUrParts() {
    for (const part of simulatedUrParts) {
      handleScanResult$1(part);
    }
  }
  function simulateScanUrPartsSignature() {
    handleScanResult$1(EXAMPLE_SIGNATURE_UR);
  }
  legacy_pre_effect(() => {
  }, () => {
    set(isMultipart, urProcessorState.isMultipart);
  });
  legacy_pre_effect(() => {
  }, () => {
    set(expectedParts, urProcessorState.expectedParts);
  });
  legacy_pre_effect(() => {
  }, () => {
    set(receivedParts, urProcessorState.receivedParts);
  });
  legacy_pre_effect(
    () => (get(requestId), get(rawTransactionBytes), get(accountAddress), get(derivationPaths), get(masterFingerprint), get(walletOrigin)),
    () => {
      if (get(requestId) && get(rawTransactionBytes) && get(accountAddress) && get(derivationPaths) && get(masterFingerprint) && get(walletOrigin)) {
        generateSignRequest();
      }
    }
  );
  legacy_pre_effect(() => get(rawTransactionBytes), () => {
    if (get(rawTransactionBytes) === "" || get(rawTransactionBytes).trim() === "") {
      set(showQrGenerator, false);
      set(qrCbor, "");
      set(qrUrType, "");
    }
  });
  legacy_pre_effect_reset();
  init();
  var div = root();
  var node = sibling(child(div), 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      var select = sibling(child(div_1), 4);
      template_effect(() => {
        get(selectedAccountIndex);
        invalidate_inner_signals(() => {
          get(keystoneAccountData);
        });
      });
      each(
        select,
        5,
        () => (get(keystoneAccountData), untrack(() => get(keystoneAccountData).keys)),
        index,
        ($$anchor3, account, index2) => {
          var option = root_2();
          var text = child(option);
          option.value = option.__value = index2;
          template_effect(($0) => set_text(text, `Account ${index2} - ${(get(account), untrack(() => get(account).path)) ?? ""} - ${$0 ?? ""}`), [
            () => (deep_read_state(deriveIotaAddress), deep_read_state(toHEX), get(account), untrack(() => deriveIotaAddress(toHEX(get(account).getKey()))))
          ]);
          append($$anchor3, option);
        }
      );
      var div_2 = sibling(select, 2);
      var p_1 = child(div_2);
      var text_1 = sibling(child(p_1));
      var p_2 = sibling(p_1, 2);
      var code = sibling(child(p_2), 2);
      var text_2 = child(code);
      var p_3 = sibling(p_2, 2);
      var code_1 = sibling(child(p_3), 2);
      var text_3 = child(code_1);
      var p_4 = sibling(p_3, 2);
      var code_2 = sibling(child(p_4), 2);
      var text_4 = child(code_2);
      template_effect(
        ($0) => {
          set_text(text_1, ` ${(get(keystoneAccountData), untrack(() => get(keystoneAccountData).device)) ?? ""}`);
          set_text(text_2, (get(keystoneAccountData), untrack(() => get(keystoneAccountData).masterFingerprint)));
          set_text(text_3, (get(keystoneAccountData), get(selectedAccountIndex), untrack(() => get(keystoneAccountData).keys[get(selectedAccountIndex)]?.path)));
          set_text(text_4, $0);
        },
        [
          () => (deep_read_state(deriveIotaAddress), deep_read_state(toHEX), get(keystoneAccountData), get(selectedAccountIndex), untrack(() => deriveIotaAddress(toHEX(get(keystoneAccountData).keys[get(selectedAccountIndex)]?.key) || "")))
        ]
      );
      bind_select_value(select, () => get(selectedAccountIndex), ($$value) => set(selectedAccountIndex, $$value));
      event("change", select, updateSelectedAccount);
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (get(keystoneAccountData), untrack(() => get(keystoneAccountData) && get(keystoneAccountData).keys)) $$render(consequent);
    });
  }
  var div_3 = sibling(node, 2);
  var button = child(div_3);
  var button_1 = sibling(button, 2);
  var button_2 = sibling(button_1, 2);
  var button_3 = sibling(button_2, 2);
  var node_1 = sibling(div_3, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_4 = root_3();
      var node_2 = sibling(child(div_4), 4);
      bind_this(
        QrScanner_1(node_2, {
          get isMultipart() {
            return get(isMultipart);
          },
          set isMultipart($$value) {
            set(isMultipart, $$value);
          },
          get expectedParts() {
            return get(expectedParts);
          },
          set expectedParts($$value) {
            set(expectedParts, $$value);
          },
          get receivedParts() {
            return get(receivedParts);
          },
          set receivedParts($$value) {
            set(receivedParts, $$value);
          },
          $$events: {
            scanResult: (event2) => handleScanResult$1(event2.detail),
            error: (event2) => set(scanError, event2.detail),
            connectionError: (event2) => set(connectionError, event2.detail)
          },
          $$legacy: true
        }),
        ($$value) => set(qrScannerComponent, $$value),
        () => get(qrScannerComponent)
      );
      var node_3 = sibling(node_2, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var div_5 = root_4();
          var button_4 = child(div_5);
          event("click", button_4, resetMultipartState$1);
          append($$anchor3, div_5);
        };
        if_block(node_3, ($$render) => {
          if (get(isMultipart)) $$render(consequent_1);
        });
      }
      var button_5 = sibling(node_3, 2);
      var node_4 = sibling(button_5, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var div_6 = root_5();
          var p_5 = child(div_6);
          var text_5 = child(p_5);
          var button_6 = sibling(p_5, 2);
          template_effect(() => set_text(text_5, `✅ Connected to: ${get(connectedDevice) ?? ""}`));
          event("click", button_6, clearConnection);
          append($$anchor3, div_6);
        };
        if_block(node_4, ($$render) => {
          if (get(connectedDevice)) $$render(consequent_2);
        });
      }
      event("click", button_5, simulateScanUrParts);
      append($$anchor2, div_4);
    };
    if_block(node_1, ($$render) => {
      if (get(activeStep) === "connect") $$render(consequent_3);
    });
  }
  var node_5 = sibling(node_1, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_7 = root_6();
      var div_8 = sibling(child(div_7), 4);
      var div_9 = child(div_8);
      var input = sibling(child(div_9), 2);
      var textarea = sibling(div_9, 4);
      var div_10 = sibling(textarea, 2);
      var button_7 = child(div_10);
      var text_6 = child(button_7);
      var button_8 = sibling(button_7, 2);
      var text_7 = child(button_8);
      var div_11 = sibling(div_10, 2);
      var input_1 = sibling(child(div_11), 2);
      var div_12 = sibling(div_11, 2);
      var input_2 = sibling(child(div_12), 2);
      var div_13 = sibling(div_12, 2);
      var input_3 = sibling(child(div_13), 2);
      var div_14 = sibling(div_13, 2);
      var input_4 = sibling(child(div_14), 2);
      var node_6 = sibling(div_8, 2);
      {
        var consequent_4 = ($$anchor3) => {
          var div_15 = root_7();
          var node_7 = sibling(child(div_15), 2);
          bind_this(
            QrGenerator(node_7, {
              get cbor() {
                return get(qrCbor);
              },
              get urType() {
                return get(qrUrType);
              },
              $$legacy: true
            }),
            ($$value) => set(qrGeneratorComponent, $$value),
            () => get(qrGeneratorComponent)
          );
          append($$anchor3, div_15);
        };
        if_block(node_6, ($$render) => {
          if (get(showQrGenerator)) $$render(consequent_4);
        });
      }
      template_effect(() => {
        set_text(text_6, (deep_read_state(TRANSACTION_EXAMPLES), untrack(() => TRANSACTION_EXAMPLES.simple.title)));
        set_text(text_7, (deep_read_state(TRANSACTION_EXAMPLES), untrack(() => TRANSACTION_EXAMPLES.complex.title)));
      });
      bind_value(input, () => get(requestId), ($$value) => set(requestId, $$value));
      bind_value(textarea, () => get(rawTransactionBytes), ($$value) => set(rawTransactionBytes, $$value));
      event("click", button_7, () => set(rawTransactionBytes, TRANSACTION_EXAMPLES.simple.data));
      event("click", button_8, () => set(rawTransactionBytes, TRANSACTION_EXAMPLES.complex.data));
      bind_value(input_1, () => get(accountAddress), ($$value) => set(accountAddress, $$value));
      bind_value(input_2, () => get(derivationPaths), ($$value) => set(derivationPaths, $$value));
      bind_value(input_3, () => get(masterFingerprint), ($$value) => set(masterFingerprint, $$value));
      bind_value(input_4, () => get(walletOrigin), ($$value) => set(walletOrigin, $$value));
      append($$anchor2, div_7);
    };
    if_block(node_5, ($$render) => {
      if (get(activeStep) === "prepare") $$render(consequent_5);
    });
  }
  var node_8 = sibling(node_5, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var div_16 = root_8();
      var node_9 = sibling(child(div_16), 4);
      bind_this(
        QrScanner_1(node_9, {
          get isMultipart() {
            return get(isMultipart);
          },
          set isMultipart($$value) {
            set(isMultipart, $$value);
          },
          get expectedParts() {
            return get(expectedParts);
          },
          set expectedParts($$value) {
            set(expectedParts, $$value);
          },
          get receivedParts() {
            return get(receivedParts);
          },
          set receivedParts($$value) {
            set(receivedParts, $$value);
          },
          $$events: {
            scanResult: (event2) => handleScanResult$1(event2.detail),
            error: (event2) => set(scanError, event2.detail)
          },
          $$legacy: true
        }),
        ($$value) => set(qrScannerComponent, $$value),
        () => get(qrScannerComponent)
      );
      var button_9 = sibling(node_9, 2);
      var node_10 = sibling(button_9, 2);
      {
        var consequent_8 = ($$anchor3) => {
          var div_17 = root_9();
          var pre = sibling(child(div_17), 2);
          var text_8 = child(pre);
          var button_10 = sibling(pre, 2);
          var text_9 = child(button_10);
          var node_11 = sibling(button_10, 2);
          {
            var consequent_6 = ($$anchor4) => {
              var div_18 = root_10();
              var text_10 = child(div_18);
              template_effect(() => set_text(text_10, get(submitError)));
              append($$anchor4, div_18);
            };
            if_block(node_11, ($$render) => {
              if (get(submitError)) $$render(consequent_6);
            });
          }
          var node_12 = sibling(node_11, 2);
          {
            var consequent_7 = ($$anchor4) => {
              TransactionView($$anchor4, {
                get value() {
                  return get(transactionResult);
                }
              });
            };
            if_block(node_12, ($$render) => {
              if (get(transactionResult)) $$render(consequent_7);
            });
          }
          template_effect(() => {
            set_text(text_8, get(scanResult));
            button_10.disabled = get(submitting);
            set_text(text_9, get(submitting) ? "Submitting..." : "Submit Transaction to Network");
          });
          event("click", button_10, submitSignedTransaction);
          append($$anchor3, div_17);
        };
        if_block(node_10, ($$render) => {
          if (get(scanResult)) $$render(consequent_8);
        });
      }
      event("click", button_9, simulateScanUrPartsSignature);
      append($$anchor2, div_16);
    };
    if_block(node_8, ($$render) => {
      if (get(activeStep) === "scan-signature") $$render(consequent_9);
    });
  }
  var node_13 = sibling(node_8, 2);
  {
    var consequent_11 = ($$anchor2) => {
      var div_19 = root_12();
      var div_20 = sibling(child(div_19), 4);
      var textarea_1 = sibling(child(div_20), 2);
      var div_21 = sibling(textarea_1, 2);
      var button_11 = child(div_21);
      var button_12 = sibling(button_11, 2);
      var button_13 = sibling(button_12, 2);
      var node_14 = sibling(div_20, 2);
      {
        var consequent_10 = ($$anchor3) => {
          var div_22 = root_13();
          var pre_1 = sibling(child(div_22), 2);
          var text_11 = child(pre_1);
          template_effect(() => set_text(text_11, get(decodedUrData)));
          append($$anchor3, div_22);
        };
        if_block(node_14, ($$render) => {
          if (get(decodedUrData)) $$render(consequent_10);
        });
      }
      bind_value(textarea_1, () => get(urToDecode), ($$value) => set(urToDecode, $$value));
      event("input", textarea_1, () => decodeUR());
      event("click", button_11, () => loadExampleUR("signRequest"));
      event("click", button_12, () => loadExampleUR("signature"));
      event("click", button_13, () => loadExampleUR("multipart"));
      append($$anchor2, div_19);
    };
    if_block(node_13, ($$render) => {
      if (get(activeStep) === "ur-decode") $$render(consequent_11);
    });
  }
  var node_15 = sibling(node_13, 2);
  {
    var consequent_12 = ($$anchor2) => {
      var div_23 = root_14();
      var p_6 = child(div_23);
      var text_12 = child(p_6);
      template_effect(() => set_text(text_12, get(scanError) || get(connectionError) || get(urDecodeError)));
      append($$anchor2, div_23);
    };
    if_block(node_15, ($$render) => {
      if (get(scanError) || get(connectionError) || get(urDecodeError)) $$render(consequent_12);
    });
  }
  template_effect(() => {
    set_class(button, 1, `step-btn ${get(activeStep) === "connect" ? "active" : ""}`, "svelte-18r9j1v");
    set_class(button_1, 1, `step-btn ${get(activeStep) === "prepare" ? "active" : ""}`, "svelte-18r9j1v");
    set_class(button_2, 1, `step-btn ${get(activeStep) === "scan-signature" ? "active" : ""}`, "svelte-18r9j1v");
    set_class(button_3, 1, `step-btn ${get(activeStep) === "ur-decode" ? "active" : ""}`, "svelte-18r9j1v");
  });
  event("click", button, () => switchStep("connect"));
  event("click", button_1, () => switchStep("prepare"));
  event("click", button_2, () => switchStep("scan-signature"));
  event("click", button_3, () => switchStep("ur-decode"));
  append($$anchor, div);
  pop();
}
export {
  Keystone as default
};

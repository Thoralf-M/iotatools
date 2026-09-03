import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-D3Q5gio6.js";
import { $ as untrack, C as bind_select_value, D as set_class, Dt as pop, E as set_style, G as event, I as if_block, J as deep_read_state, Mt as reset, N as each, Ot as push, P as index, Q as tick, R as set_text, V as from_html, Y as get, _t as remove_textarea_child, ct as sibling, dt as mutate, f as bind_prop, ft as set, h as bind_value, ht as derived_safe_equal, i as prop, it as template_effect, jt as next, n as onDestroy, nt as legacy_pre_effect_reset, ot as child, r as onMount, s as init, st as first_child, t as createEventDispatcher, tt as legacy_pre_effect, u as bind_this, ut as mutable_source, v as remove_input_defaults, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { t as getClient } from "./client-BTFoHz6u.js";
import { Q as toBase64, X as toHex, Y as fromHex, g as sha256, m as messageWithIntent, n as Ed25519PublicKey } from "./keypair-DsT3ivIR.js";
import { f as require_buffer, i as TransactionView, t as __vitePreload } from "./index-BRWluWP1.js";
//#region node_modules/.pnpm/bignumber.js@9.3.1/node_modules/bignumber.js/bignumber.mjs
var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
var mathceil = Math.ceil;
var mathfloor = Math.floor;
var bignumberError = "[BigNumber Error] ";
var tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ";
var BASE = 0x5af3107a4000;
var LOG_BASE = 14;
var MAX_SAFE_INTEGER = 9007199254740991;
var POWS_TEN = [
	1,
	10,
	100,
	1e3,
	1e4,
	1e5,
	1e6,
	1e7,
	1e8,
	1e9,
	1e10,
	1e11,
	0xe8d4a51000,
	0x9184e72a000
];
var SQRT_BASE = 1e7;
var MAX = 1e9;
function clone(configObject) {
	var div, convertBase, parseNumeric, P = BigNumber.prototype = {
		constructor: BigNumber,
		toString: null,
		valueOf: null
	}, ONE = new BigNumber(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
		prefix: "",
		groupSize: 3,
		secondaryGroupSize: 0,
		groupSeparator: ",",
		decimalSeparator: ".",
		fractionGroupSize: 0,
		fractionGroupSeparator: "\xA0",
		suffix: ""
	}, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
	function BigNumber(v, b) {
		var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
		if (!(x instanceof BigNumber)) return new BigNumber(v, b);
		if (b == null) {
			if (v && v._isBigNumber === true) {
				x.s = v.s;
				if (!v.c || v.e > MAX_EXP) x.c = x.e = null;
				else if (v.e < MIN_EXP) x.c = [x.e = 0];
				else {
					x.e = v.e;
					x.c = v.c.slice();
				}
				return;
			}
			if ((isNum = typeof v == "number") && v * 0 == 0) {
				x.s = 1 / v < 0 ? (v = -v, -1) : 1;
				if (v === ~~v) {
					for (e = 0, i = v; i >= 10; i /= 10, e++);
					if (e > MAX_EXP) x.c = x.e = null;
					else {
						x.e = e;
						x.c = [v];
					}
					return;
				}
				str = String(v);
			} else {
				if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
				x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
			}
			if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
			if ((i = str.search(/e/i)) > 0) {
				if (e < 0) e = i;
				e += +str.slice(i + 1);
				str = str.substring(0, i);
			} else if (e < 0) e = str.length;
		} else {
			intCheck(b, 2, ALPHABET.length, "Base");
			if (b == 10 && alphabetHasNormalDecimalDigits) {
				x = new BigNumber(v);
				return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
			}
			str = String(v);
			if (isNum = typeof v == "number") {
				if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
				x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
				if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) throw Error(tooManyDigits + v);
			} else x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
			alphabet = ALPHABET.slice(0, b);
			e = i = 0;
			for (len = str.length; i < len; i++) if (alphabet.indexOf(c = str.charAt(i)) < 0) {
				if (c == ".") {
					if (i > e) {
						e = len;
						continue;
					}
				} else if (!caseChanged) {
					if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
						caseChanged = true;
						i = -1;
						e = 0;
						continue;
					}
				}
				return parseNumeric(x, String(v), isNum, b);
			}
			isNum = false;
			str = convertBase(str, b, 10, x.s);
			if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
			else e = str.length;
		}
		for (i = 0; str.charCodeAt(i) === 48; i++);
		for (len = str.length; str.charCodeAt(--len) === 48;);
		if (str = str.slice(i, ++len)) {
			len -= i;
			if (isNum && BigNumber.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) throw Error(tooManyDigits + x.s * v);
			if ((e = e - i - 1) > MAX_EXP) x.c = x.e = null;
			else if (e < MIN_EXP) x.c = [x.e = 0];
			else {
				x.e = e;
				x.c = [];
				i = (e + 1) % LOG_BASE;
				if (e < 0) i += LOG_BASE;
				if (i < len) {
					if (i) x.c.push(+str.slice(0, i));
					for (len -= LOG_BASE; i < len;) x.c.push(+str.slice(i, i += LOG_BASE));
					i = LOG_BASE - (str = str.slice(i)).length;
				} else i -= len;
				for (; i--; str += "0");
				x.c.push(+str);
			}
		} else x.c = [x.e = 0];
	}
	BigNumber.clone = clone;
	BigNumber.ROUND_UP = 0;
	BigNumber.ROUND_DOWN = 1;
	BigNumber.ROUND_CEIL = 2;
	BigNumber.ROUND_FLOOR = 3;
	BigNumber.ROUND_HALF_UP = 4;
	BigNumber.ROUND_HALF_DOWN = 5;
	BigNumber.ROUND_HALF_EVEN = 6;
	BigNumber.ROUND_HALF_CEIL = 7;
	BigNumber.ROUND_HALF_FLOOR = 8;
	BigNumber.EUCLID = 9;
	BigNumber.config = BigNumber.set = function(obj) {
		var p, v;
		if (obj != null) if (typeof obj == "object") {
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
					if (v) MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
					else throw Error(bignumberError + p + " cannot be zero: " + v);
				}
			}
			if (obj.hasOwnProperty(p = "CRYPTO")) {
				v = obj[p];
				if (v === !!v) if (v) if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) CRYPTO = v;
				else {
					CRYPTO = !v;
					throw Error(bignumberError + "crypto unavailable");
				}
				else CRYPTO = v;
				else throw Error(bignumberError + p + " not true or false: " + v);
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
				} else throw Error(bignumberError + p + " invalid: " + v);
			}
		} else throw Error(bignumberError + "Object expected: " + obj);
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
	BigNumber.isBigNumber = function(v) {
		if (!v || v._isBigNumber !== true) return false;
		if (!BigNumber.DEBUG) return true;
		var i, n, c = v.c, e = v.e, s = v.s;
		out: if ({}.toString.call(c) == "[object Array]") {
			if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
				if (c[0] === 0) {
					if (e === 0 && c.length === 1) return true;
					break out;
				}
				i = (e + 1) % LOG_BASE;
				if (i < 1) i += LOG_BASE;
				if (String(c[0]).length == i) {
					for (i = 0; i < c.length; i++) {
						n = c[i];
						if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
					}
					if (n !== 0) return true;
				}
			}
		} else if (c === null && e === null && (s === null || s === 1 || s === -1)) return true;
		throw Error(bignumberError + "Invalid BigNumber: " + v);
	};
	BigNumber.maximum = BigNumber.max = function() {
		return maxOrMin(arguments, -1);
	};
	BigNumber.minimum = BigNumber.min = function() {
		return maxOrMin(arguments, 1);
	};
	BigNumber.random = (function() {
		var pow2_53 = 9007199254740992;
		var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
			return mathfloor(Math.random() * pow2_53);
		} : function() {
			return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
		};
		return function(dp) {
			var a, b, e, k, v, i = 0, c = [], rand = new BigNumber(ONE);
			if (dp == null) dp = DECIMAL_PLACES;
			else intCheck(dp, 0, MAX);
			k = mathceil(dp / LOG_BASE);
			if (CRYPTO) if (crypto.getRandomValues) {
				a = crypto.getRandomValues(new Uint32Array(k *= 2));
				for (; i < k;) {
					v = a[i] * 131072 + (a[i + 1] >>> 11);
					if (v >= 9e15) {
						b = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(2));
						a[i] = b[0];
						a[i + 1] = b[1];
					} else {
						c.push(v % 0x5af3107a4000);
						i += 2;
					}
				}
				i = k / 2;
			} else if (crypto.randomBytes) {
				a = crypto.randomBytes(k *= 7);
				for (; i < k;) {
					v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
					if (v >= 9e15) crypto.randomBytes(7).copy(a, i);
					else {
						c.push(v % 0x5af3107a4000);
						i += 7;
					}
				}
				i = k / 7;
			} else {
				CRYPTO = false;
				throw Error(bignumberError + "crypto unavailable");
			}
			if (!CRYPTO) for (; i < k;) {
				v = random53bitInt();
				if (v < 9e15) c[i++] = v % 0x5af3107a4000;
			}
			k = c[--i];
			dp %= LOG_BASE;
			if (k && dp) {
				v = POWS_TEN[LOG_BASE - dp];
				c[i] = mathfloor(k / v) * v;
			}
			for (; c[i] === 0; c.pop(), i--);
			if (i < 0) c = [e = 0];
			else {
				for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);
				for (i = 1, v = c[0]; v >= 10; v /= 10, i++);
				if (i < LOG_BASE) e -= LOG_BASE - i;
			}
			rand.e = e;
			rand.c = c;
			return rand;
		};
	})();
	BigNumber.sum = function() {
		var i = 1, args = arguments, sum = new BigNumber(args[0]);
		for (; i < args.length;) sum = sum.plus(args[i++]);
		return sum;
	};
	convertBase = (function() {
		var decimal = "0123456789";
		function toBaseOut(str, baseIn, baseOut, alphabet) {
			var j, arr = [0], arrL, i = 0, len = str.length;
			for (; i < len;) {
				for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);
				arr[0] += alphabet.indexOf(str.charAt(i++));
				for (j = 0; j < arr.length; j++) if (arr[j] > baseOut - 1) {
					if (arr[j + 1] == null) arr[j + 1] = 0;
					arr[j + 1] += arr[j] / baseOut | 0;
					arr[j] %= baseOut;
				}
			}
			return arr.reverse();
		}
		return function(str, baseIn, baseOut, sign, callerIsToString) {
			var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
			if (i >= 0) {
				k = POW_PRECISION;
				POW_PRECISION = 0;
				str = str.replace(".", "");
				y = new BigNumber(baseIn);
				x = y.pow(str.length - i);
				POW_PRECISION = k;
				y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, "0"), 10, baseOut, decimal);
				y.e = y.c.length;
			}
			xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
			e = k = xc.length;
			for (; xc[--k] == 0; xc.pop());
			if (!xc[0]) return alphabet.charAt(0);
			if (i < 0) --e;
			else {
				x.c = xc;
				x.e = e;
				x.s = sign;
				x = div(x, y, dp, rm, baseOut);
				xc = x.c;
				r = x.r;
				e = x.e;
			}
			d = e + dp + 1;
			i = xc[d];
			k = baseOut / 2;
			r = r || d < 0 || xc[d + 1] != null;
			r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
			if (d < 1 || !xc[0]) str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
			else {
				xc.length = d;
				if (r) for (--baseOut; ++xc[--d] > baseOut;) {
					xc[d] = 0;
					if (!d) {
						++e;
						xc = [1].concat(xc);
					}
				}
				for (k = xc.length; !xc[--k];);
				for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++]));
				str = toFixedPoint(str, e, alphabet.charAt(0));
			}
			return str;
		};
	})();
	div = (function() {
		function multiply(x, k, base) {
			var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
			for (x = x.slice(); i--;) {
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
		function compare(a, b, aL, bL) {
			var i, cmp;
			if (aL != bL) cmp = aL > bL ? 1 : -1;
			else for (i = cmp = 0; i < aL; i++) if (a[i] != b[i]) {
				cmp = a[i] > b[i] ? 1 : -1;
				break;
			}
			return cmp;
		}
		function subtract(a, b, aL, base) {
			var i = 0;
			for (; aL--;) {
				a[aL] -= i;
				i = a[aL] < b[aL] ? 1 : 0;
				a[aL] = i * base + a[aL] - b[aL];
			}
			for (; !a[0] && a.length > 1; a.splice(0, 1));
		}
		return function(x, y, dp, rm, base) {
			var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
			if (!xc || !xc[0] || !yc || !yc[0]) return new BigNumber(!x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
			q = new BigNumber(s);
			qc = q.c = [];
			e = x.e - y.e;
			s = dp + e + 1;
			if (!base) {
				base = BASE;
				e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
				s = s / LOG_BASE | 0;
			}
			for (i = 0; yc[i] == (xc[i] || 0); i++);
			if (yc[i] > (xc[i] || 0)) e--;
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
				for (; remL < yL; rem[remL++] = 0);
				yz = yc.slice();
				yz = [0].concat(yz);
				yc0 = yc[0];
				if (yc[1] >= base / 2) yc0++;
				do {
					n = 0;
					cmp = compare(yc, rem, yL, remL);
					if (cmp < 0) {
						rem0 = rem[0];
						if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
						n = mathfloor(rem0 / yc0);
						if (n > 1) {
							if (n >= base) n = base - 1;
							prod = multiply(yc, n, base);
							prodL = prod.length;
							remL = rem.length;
							while (compare(prod, rem, prodL, remL) == 1) {
								n--;
								subtract(prod, yL < prodL ? yz : yc, prodL, base);
								prodL = prod.length;
								cmp = 1;
							}
						} else {
							if (n == 0) cmp = n = 1;
							prod = yc.slice();
							prodL = prod.length;
						}
						if (prodL < remL) prod = [0].concat(prod);
						subtract(rem, prod, remL, base);
						remL = rem.length;
						if (cmp == -1) while (compare(yc, rem, yL, remL) < 1) {
							n++;
							subtract(rem, yL < remL ? yz : yc, remL, base);
							remL = rem.length;
						}
					} else if (cmp === 0) {
						n++;
						rem = [0];
					}
					qc[i++] = n;
					if (rem[0]) rem[remL++] = xc[xi] || 0;
					else {
						rem = [xc[xi]];
						remL = 1;
					}
				} while ((xi++ < xL || rem[0] != null) && s--);
				more = rem[0] != null;
				if (!qc[0]) qc.splice(0, 1);
			}
			if (base == BASE) {
				for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);
				round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
			} else {
				q.e = e;
				q.r = +more;
			}
			return q;
		};
	})();
	function format(n, i, rm, id) {
		var c0, e, ne, len, str;
		if (rm == null) rm = ROUNDING_MODE;
		else intCheck(rm, 0, 8);
		if (!n.c) return n.toString();
		c0 = n.c[0];
		ne = n.e;
		if (i == null) {
			str = coeffToString(n.c);
			str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
		} else {
			n = round(new BigNumber(n), i, rm);
			e = n.e;
			str = coeffToString(n.c);
			len = str.length;
			if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
				for (; len < i; str += "0", len++);
				str = toExponential(str, e);
			} else {
				i -= ne + (id === 2 && e > ne);
				str = toFixedPoint(str, e, "0");
				if (e + 1 > len) {
					if (--i > 0) for (str += "."; i--; str += "0");
				} else {
					i += e - len;
					if (i > 0) {
						if (e + 1 == len) str += ".";
						for (; i--; str += "0");
					}
				}
			}
		}
		return n.s < 0 && c0 ? "-" + str : str;
	}
	function maxOrMin(args, n) {
		var k, y, i = 1, x = new BigNumber(args[0]);
		for (; i < args.length; i++) {
			y = new BigNumber(args[i]);
			if (!y.s || (k = compare$1(x, y)) === n || k === 0 && x.s === n) x = y;
		}
		return x;
	}
	function normalise(n, c, e) {
		var i = 1, j = c.length;
		for (; !c[--j]; c.pop());
		for (j = c[0]; j >= 10; j /= 10, i++);
		if ((e = i + e * LOG_BASE - 1) > MAX_EXP) n.c = n.e = null;
		else if (e < MIN_EXP) n.c = [n.e = 0];
		else {
			n.e = e;
			n.c = c;
		}
		return n;
	}
	parseNumeric = (function() {
		var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
		return function(x, str, isNum, b) {
			var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
			if (isInfinityOrNaN.test(s)) x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
			else {
				if (!isNum) {
					s = s.replace(basePrefix, function(m, p1, p2) {
						base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
						return !b || b == base ? p1 : m;
					});
					if (b) {
						base = b;
						s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
					}
					if (str != s) return new BigNumber(s, base);
				}
				if (BigNumber.DEBUG) throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
				x.s = null;
			}
			x.c = x.e = null;
		};
	})();
	function round(x, sd, rm, r) {
		var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
		if (xc) {
			out: {
				for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
				i = sd - d;
				if (i < 0) {
					i += LOG_BASE;
					j = sd;
					n = xc[ni = 0];
					rd = mathfloor(n / pows10[d - j - 1] % 10);
				} else {
					ni = mathceil((i + 1) / LOG_BASE);
					if (ni >= xc.length) if (r) {
						for (; xc.length <= ni; xc.push(0));
						n = rd = 0;
						d = 1;
						i %= LOG_BASE;
						j = i - LOG_BASE + 1;
					} else break out;
					else {
						n = k = xc[ni];
						for (d = 1; k >= 10; k /= 10, d++);
						i %= LOG_BASE;
						j = i - LOG_BASE + d;
						rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
					}
				}
				r = r || sd < 0 || xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
				r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
				if (sd < 1 || !xc[0]) {
					xc.length = 0;
					if (r) {
						sd -= x.e + 1;
						xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
						x.e = -sd || 0;
					} else xc[0] = x.e = 0;
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
				if (r) for (;;) if (ni == 0) {
					for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
					j = xc[0] += k;
					for (k = 1; j >= 10; j /= 10, k++);
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
				for (i = xc.length; xc[--i] === 0; xc.pop());
			}
			if (x.e > MAX_EXP) x.c = x.e = null;
			else if (x.e < MIN_EXP) x.c = [x.e = 0];
		}
		return x;
	}
	function valueOf(n) {
		var str, e = n.e;
		if (e === null) return n.toString();
		str = coeffToString(n.c);
		str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
		return n.s < 0 ? "-" + str : str;
	}
	P.absoluteValue = P.abs = function() {
		var x = new BigNumber(this);
		if (x.s < 0) x.s = 1;
		return x;
	};
	P.comparedTo = function(y, b) {
		return compare$1(this, new BigNumber(y, b));
	};
	P.decimalPlaces = P.dp = function(dp, rm) {
		var c, n, v, x = this;
		if (dp != null) {
			intCheck(dp, 0, MAX);
			if (rm == null) rm = ROUNDING_MODE;
			else intCheck(rm, 0, 8);
			return round(new BigNumber(x), dp + x.e + 1, rm);
		}
		if (!(c = x.c)) return null;
		n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
		if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
		if (n < 0) n = 0;
		return n;
	};
	P.dividedBy = P.div = function(y, b) {
		return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
	};
	P.dividedToIntegerBy = P.idiv = function(y, b) {
		return div(this, new BigNumber(y, b), 0, 1);
	};
	P.exponentiatedBy = P.pow = function(n, m) {
		var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
		n = new BigNumber(n);
		if (n.c && !n.isInteger()) throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
		if (m != null) m = new BigNumber(m);
		nIsBig = n.e > 14;
		if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
			y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
			return m ? y.mod(m) : y;
		}
		nIsNeg = n.s < 0;
		if (m) {
			if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);
			isModExp = !nIsNeg && x.isInteger() && m.isInteger();
			if (isModExp) x = x.mod(m);
		} else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
			k = x.s < 0 && isOdd(n) ? -0 : 0;
			if (x.e > -1) k = 1 / k;
			return new BigNumber(nIsNeg ? 1 / k : k);
		} else if (POW_PRECISION) k = mathceil(POW_PRECISION / LOG_BASE + 2);
		if (nIsBig) {
			half = new BigNumber(.5);
			if (nIsNeg) n.s = 1;
			nIsOdd = isOdd(n);
		} else {
			i = Math.abs(+valueOf(n));
			nIsOdd = i % 2;
		}
		y = new BigNumber(ONE);
		for (;;) {
			if (nIsOdd) {
				y = y.times(x);
				if (!y.c) break;
				if (k) {
					if (y.c.length > k) y.c.length = k;
				} else if (isModExp) y = y.mod(m);
			}
			if (i) {
				i = mathfloor(i / 2);
				if (i === 0) break;
				nIsOdd = i % 2;
			} else {
				n = n.times(half);
				round(n, n.e + 1, 1);
				if (n.e > 14) nIsOdd = isOdd(n);
				else {
					i = +valueOf(n);
					if (i === 0) break;
					nIsOdd = i % 2;
				}
			}
			x = x.times(x);
			if (k) {
				if (x.c && x.c.length > k) x.c.length = k;
			} else if (isModExp) x = x.mod(m);
		}
		if (isModExp) return y;
		if (nIsNeg) y = ONE.div(y);
		return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
	};
	P.integerValue = function(rm) {
		var n = new BigNumber(this);
		if (rm == null) rm = ROUNDING_MODE;
		else intCheck(rm, 0, 8);
		return round(n, n.e + 1, rm);
	};
	P.isEqualTo = P.eq = function(y, b) {
		return compare$1(this, new BigNumber(y, b)) === 0;
	};
	P.isFinite = function() {
		return !!this.c;
	};
	P.isGreaterThan = P.gt = function(y, b) {
		return compare$1(this, new BigNumber(y, b)) > 0;
	};
	P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
		return (b = compare$1(this, new BigNumber(y, b))) === 1 || b === 0;
	};
	P.isInteger = function() {
		return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
	};
	P.isLessThan = P.lt = function(y, b) {
		return compare$1(this, new BigNumber(y, b)) < 0;
	};
	P.isLessThanOrEqualTo = P.lte = function(y, b) {
		return (b = compare$1(this, new BigNumber(y, b))) === -1 || b === 0;
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
		y = new BigNumber(y, b);
		b = y.s;
		if (!a || !b) return new BigNumber(NaN);
		if (a != b) {
			y.s = -b;
			return x.plus(y);
		}
		var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
		if (!xe || !ye) {
			if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);
			if (!xc[0] || !yc[0]) return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x : ROUNDING_MODE == 3 ? -0 : 0);
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
			for (b = a; b--; t.push(0));
			t.reverse();
		} else {
			j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
			for (a = b = 0; b < j; b++) if (xc[b] != yc[b]) {
				xLTy = xc[b] < yc[b];
				break;
			}
		}
		if (xLTy) {
			t = xc;
			xc = yc;
			yc = t;
			y.s = -y.s;
		}
		b = (j = yc.length) - (i = xc.length);
		if (b > 0) for (; b--; xc[i++] = 0);
		b = BASE - 1;
		for (; j > a;) {
			if (xc[--j] < yc[j]) {
				for (i = j; i && !xc[--i]; xc[i] = b);
				--xc[i];
				xc[j] += BASE;
			}
			xc[j] -= yc[j];
		}
		for (; xc[0] == 0; xc.splice(0, 1), --ye);
		if (!xc[0]) {
			y.s = ROUNDING_MODE == 3 ? -1 : 1;
			y.c = [y.e = 0];
			return y;
		}
		return normalise(y, xc, ye);
	};
	P.modulo = P.mod = function(y, b) {
		var q, s, x = this;
		y = new BigNumber(y, b);
		if (!x.c || !y.s || y.c && !y.c[0]) return new BigNumber(NaN);
		else if (!y.c || x.c && !x.c[0]) return new BigNumber(x);
		if (MODULO_MODE == 9) {
			s = y.s;
			y.s = 1;
			q = div(x, y, 0, 3);
			y.s = s;
			q.s *= s;
		} else q = div(x, y, 0, MODULO_MODE);
		y = x.minus(q.times(y));
		if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
		return y;
	};
	P.multipliedBy = P.times = function(y, b) {
		var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber(y, b)).c;
		if (!xc || !yc || !xc[0] || !yc[0]) {
			if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) y.c = y.e = y.s = null;
			else {
				y.s *= x.s;
				if (!xc || !yc) y.c = y.e = null;
				else {
					y.c = [0];
					y.e = 0;
				}
			}
			return y;
		}
		e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
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
		for (i = xcL + ycL, zc = []; i--; zc.push(0));
		base = BASE;
		sqrtBase = SQRT_BASE;
		for (i = ycL; --i >= 0;) {
			c = 0;
			ylo = yc[i] % sqrtBase;
			yhi = yc[i] / sqrtBase | 0;
			for (k = xcL, j = i + k; j > i;) {
				xlo = xc[--k] % sqrtBase;
				xhi = xc[k] / sqrtBase | 0;
				m = yhi * xlo + xhi * ylo;
				xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
				c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
				zc[j--] = xlo % base;
			}
			zc[j] = c;
		}
		if (c) ++e;
		else zc.splice(0, 1);
		return normalise(y, zc, e);
	};
	P.negated = function() {
		var x = new BigNumber(this);
		x.s = -x.s || null;
		return x;
	};
	P.plus = function(y, b) {
		var t, x = this, a = x.s;
		y = new BigNumber(y, b);
		b = y.s;
		if (!a || !b) return new BigNumber(NaN);
		if (a != b) {
			y.s = -b;
			return x.minus(y);
		}
		var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
		if (!xe || !ye) {
			if (!xc || !yc) return new BigNumber(a / 0);
			if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
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
			for (; a--; t.push(0));
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
		for (a = 0; b;) {
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
			return round(new BigNumber(x), sd, rm);
		}
		if (!(c = x.c)) return null;
		v = c.length - 1;
		n = v * LOG_BASE + 1;
		if (v = c[v]) {
			for (; v % 10 == 0; v /= 10, n--);
			for (v = c[0]; v >= 10; v /= 10, n++);
		}
		if (sd && x.e + 1 > n) n = x.e + 1;
		return n;
	};
	P.shiftedBy = function(k) {
		intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
		return this.times("1e" + k);
	};
	P.squareRoot = P.sqrt = function() {
		var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber("0.5");
		if (s !== 1 || !c || !c[0]) return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : Infinity);
		s = Math.sqrt(+valueOf(x));
		if (s == 0 || s == Infinity) {
			n = coeffToString(c);
			if ((n.length + e) % 2 == 0) n += "0";
			s = Math.sqrt(+n);
			e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
			if (s == Infinity) n = "5e" + e;
			else {
				n = s.toExponential();
				n = n.slice(0, n.indexOf("e") + 1) + e;
			}
			r = new BigNumber(n);
		} else r = new BigNumber(s + "");
		if (r.c[0]) {
			e = r.e;
			s = e + dp;
			if (s < 3) s = 0;
			for (;;) {
				t = r;
				r = half.times(t.plus(div(x, t, dp, 1)));
				if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
					if (r.e < e) --s;
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
	P.toFormat = function(dp, rm, format) {
		var str, x = this;
		if (format == null) if (dp != null && rm && typeof rm == "object") {
			format = rm;
			rm = null;
		} else if (dp && typeof dp == "object") {
			format = dp;
			dp = rm = null;
		} else format = FORMAT;
		else if (typeof format != "object") throw Error(bignumberError + "Argument not an object: " + format);
		str = x.toFixed(dp, rm);
		if (x.c) {
			var i, arr = str.split("."), g1 = +format.groupSize, g2 = +format.secondaryGroupSize, groupSeparator = format.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
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
			str = fractionPart ? intPart + (format.decimalSeparator || "") + ((g2 = +format.fractionGroupSize) ? fractionPart.replace(new RegExp("\\d{" + g2 + "}\\B", "g"), "$&" + (format.fractionGroupSeparator || "")) : fractionPart) : intPart;
		}
		return (format.prefix || "") + str + (format.suffix || "");
	};
	P.toFraction = function(md) {
		var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
		if (md != null) {
			n = new BigNumber(md);
			if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
		}
		if (!xc) return new BigNumber(x);
		d = new BigNumber(ONE);
		n1 = d0 = new BigNumber(ONE);
		d1 = n0 = new BigNumber(ONE);
		s = coeffToString(xc);
		e = d.e = s.length - x.e - 1;
		d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
		md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
		exp = MAX_EXP;
		MAX_EXP = Infinity;
		n = new BigNumber(s);
		n0.c[0] = 0;
		for (;;) {
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
		e = e * 2;
		r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
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
		var str, n = this, s = n.s, e = n.e;
		if (e === null) if (s) {
			str = "Infinity";
			if (s < 0) str = "-" + str;
		} else str = "NaN";
		else {
			if (b == null) str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
			else if (b === 10 && alphabetHasNormalDecimalDigits) {
				n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
				str = toFixedPoint(coeffToString(n.c), n.e, "0");
			} else {
				intCheck(b, 2, ALPHABET.length, "Base");
				str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
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
	if (configObject != null) BigNumber.set(configObject);
	return BigNumber;
}
function bitFloor(n) {
	var i = n | 0;
	return n > 0 || n === i ? i : i - 1;
}
function coeffToString(a) {
	var s, z, i = 1, j = a.length, r = a[0] + "";
	for (; i < j;) {
		s = a[i++] + "";
		z = LOG_BASE - s.length;
		for (; z--; s = "0" + s);
		r += s;
	}
	for (j = r.length; r.charCodeAt(--j) === 48;);
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
	if (n < min || n > max || n !== mathfloor(n)) throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
}
function isOdd(n) {
	var k = n.c.length - 1;
	return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e) {
	return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
}
function toFixedPoint(str, e, z) {
	var len, zs;
	if (e < 0) {
		for (zs = z + "."; ++e; zs += z);
		str = zs + str;
	} else {
		len = str.length;
		if (++e > len) {
			for (zs = z, e -= len; --e; zs += z);
			str += zs;
		} else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
	}
	return str;
}
var BigNumber = clone();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/errors.js
var import_buffer = require_buffer();
var __extends = (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
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
var InvalidSchemeError = function(_super) {
	__extends(InvalidSchemeError, _super);
	function InvalidSchemeError() {
		var _this = _super.call(this, "Invalid Scheme") || this;
		_this.name = "InvalidSchemeError";
		return _this;
	}
	return InvalidSchemeError;
}(Error);
var InvalidPathLengthError = function(_super) {
	__extends(InvalidPathLengthError, _super);
	function InvalidPathLengthError() {
		var _this = _super.call(this, "Invalid Path") || this;
		_this.name = "InvalidPathLengthError";
		return _this;
	}
	return InvalidPathLengthError;
}(Error);
var InvalidTypeError = function(_super) {
	__extends(InvalidTypeError, _super);
	function InvalidTypeError() {
		var _this = _super.call(this, "Invalid Type") || this;
		_this.name = "InvalidTypeError";
		return _this;
	}
	return InvalidTypeError;
}(Error);
var InvalidSequenceComponentError = function(_super) {
	__extends(InvalidSequenceComponentError, _super);
	function InvalidSequenceComponentError() {
		var _this = _super.call(this, "Invalid Sequence Component") || this;
		_this.name = "InvalidSequenceComponentError";
		return _this;
	}
	return InvalidSequenceComponentError;
}(Error);
var InvalidChecksumError = function(_super) {
	__extends(InvalidChecksumError, _super);
	function InvalidChecksumError() {
		var _this = _super.call(this, "Invalid Checksum") || this;
		_this.name = "InvalidChecksumError";
		return _this;
	}
	return InvalidChecksumError;
}(Error);
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/utils.js
var CRC_TABLE = function() {
	var c;
	var crcTable = [];
	for (var n = 0; n < 256; n++) {
		c = n;
		for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		crcTable[n] = c;
	}
	return crcTable;
}();
var crc32 = function(message) {
	var crc = -1;
	for (var i = 0; i < message.length; i++) crc = crc >>> 8 ^ CRC_TABLE[(crc ^ message[i]) & 255];
	return (crc ^ -1) >>> 0;
};
var sha256Hash = function(data) {
	return import_buffer.Buffer.from(sha256(data));
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
	var arr = /* @__PURE__ */ new ArrayBuffer(4);
	new DataView(arr).setUint32(0, num, false);
	return import_buffer.Buffer.from(arr);
};
var isURType = function(type) {
	return type.split("").every(function(_, index) {
		var c = type.charCodeAt(index);
		if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0)) return true;
		if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0)) return true;
		if (c === "-".charCodeAt(0)) return true;
		return false;
	});
};
var arraysEqual = function(ar1, ar2) {
	if (ar1.length !== ar2.length) return false;
	return ar1.every(function(el) {
		return ar2.includes(el);
	});
};
/**
* Checks if ar1 contains all elements of ar2
* @param ar1 the outer array
* @param ar2 the array to be contained in ar1
*/
var arrayContains = function(ar1, ar2) {
	return ar2.every(function(v) {
		return ar1.includes(v);
	});
};
/**
* Returns the difference array of  `ar1` - `ar2`
*/
var setDifference = function(ar1, ar2) {
	return ar1.filter(function(x) {
		return ar2.indexOf(x) < 0;
	});
};
var bufferXOR = function(a, b) {
	var length = Math.max(a.length, b.length);
	var buffer = import_buffer.Buffer.allocUnsafe(length);
	for (var i = 0; i < length; ++i) buffer[i] = a[i] ^ b[i];
	return buffer;
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/is.js
var objectTypeNames = [
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
/**
* @param {any} value
* @returns {string}
*/
function is(value) {
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	if (value === true || value === false) return "boolean";
	const typeOf = typeof value;
	if (typeOf === "string" || typeOf === "number" || typeOf === "bigint" || typeOf === "symbol") return typeOf;
	/* c8 ignore next 3 */
	if (typeOf === "function") return "Function";
	if (Array.isArray(value)) return "Array";
	if (value instanceof Uint8Array) return "Uint8Array";
	if (value.constructor === Object) return "Object";
	const objectType = getObjectType(value);
	if (objectType) return objectType;
	/* c8 ignore next */
	return "Object";
}
/**
* @param {any} value
* @returns {string|undefined}
*/
function getObjectType(value) {
	const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
	if (objectTypeNames.includes(objectTypeName)) return objectTypeName;
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/token.js
var Type = class {
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
		/* c8 ignore next 1 */
		return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
	}
	/**
	* Check equality between two Type instances. Safe to use across different
	* copies of the Type class (e.g., when bundlers duplicate the module).
	* (major, name) uniquely identifies a Type; terminal is implied by these.
	* @param {Type} a
	* @param {Type} b
	* @returns {boolean}
	*/
	static equals(a, b) {
		return a === b || a.major === b.major && a.name === b.name;
	}
};
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
var Token = class {
	/**
	* @param {Type} type
	* @param {any} [value]
	* @param {number} [encodedLength]
	*/
	constructor(type, value, encodedLength) {
		this.type = type;
		this.value = value;
		this.encodedLength = encodedLength;
		/** @type {Uint8Array|undefined} */
		this.encodedBytes = void 0;
		/** @type {Uint8Array|undefined} */
		this.byteValue = void 0;
	}
	/* c8 ignore next 3 */
	toString() {
		return `Token[${this.type}].${this.value}`;
	}
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/byte-utils.js
var useBuffer = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer === "function";
var textEncoder = new TextEncoder();
/**
* @param {Uint8Array} buf
* @returns {boolean}
*/
function isBuffer(buf) {
	return useBuffer && globalThis.Buffer.isBuffer(buf);
}
/**
* @param {Uint8Array|number[]} buf
* @returns {Uint8Array}
*/
function asU8A(buf) {
	/* c8 ignore next */
	if (!(buf instanceof Uint8Array)) return Uint8Array.from(buf);
	return isBuffer(buf) ? new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength) : buf;
}
var FROM_STRING_THRESHOLD_BUFFER = 24;
var FROM_STRING_THRESHOLD_TEXTENCODER = 200;
var fromString = useBuffer ? (string) => {
	return string.length >= FROM_STRING_THRESHOLD_BUFFER ? globalThis.Buffer.from(string) : utf8ToBytes(string);
} : 
/**
* @param {string} string
*/
(string) => {
	return string.length >= FROM_STRING_THRESHOLD_TEXTENCODER ? textEncoder.encode(string) : utf8ToBytes(string);
};
/**
* Buffer variant not fast enough for what we need
* @param {number[]} arr
* @returns {Uint8Array}
*/
var fromArray = (arr) => {
	return Uint8Array.from(arr);
};
var slice = useBuffer ? (bytes, start, end) => {
	if (isBuffer(bytes)) return new Uint8Array(bytes.subarray(start, end));
	return bytes.slice(start, end);
} : 
/**
* @param {Uint8Array} bytes
* @param {number} start
* @param {number} end
*/
(bytes, start, end) => {
	return bytes.slice(start, end);
};
var concat = useBuffer ? (chunks, length) => {
	/* c8 ignore next 1 */
	chunks = chunks.map((c) => c instanceof Uint8Array ? c : globalThis.Buffer.from(c));
	return asU8A(globalThis.Buffer.concat(chunks, length));
} : 
/**
* @param {Uint8Array[]} chunks
* @param {number} length
* @returns {Uint8Array}
*/
(chunks, length) => {
	const out = new Uint8Array(length);
	let off = 0;
	for (let b of chunks) {
		if (off + b.length > out.length) b = b.subarray(0, out.length - off);
		out.set(b, off);
		off += b.length;
	}
	return out;
};
var alloc = useBuffer ? (size) => {
	return globalThis.Buffer.allocUnsafe(size);
} : 
/**
* @param {number} size
* @returns {Uint8Array}
*/
(size) => {
	return new Uint8Array(size);
};
/**
* @param {Uint8Array} b1
* @param {Uint8Array} b2
* @returns {number}
*/
function compare(b1, b2) {
	/* c8 ignore next 5 */
	if (isBuffer(b1) && isBuffer(b2)) return b1.compare(b2);
	for (let i = 0; i < b1.length; i++) {
		if (b1[i] === b2[i]) continue;
		return b1[i] < b2[i] ? -1 : 1;
	}
	return 0;
}
/**
* @param {string} str
* @returns {number[]}
*/
function utf8ToBytes(str) {
	const out = [];
	let p = 0;
	for (let i = 0; i < str.length; i++) {
		let c = str.charCodeAt(i);
		if (c < 128) out[p++] = c;
		else if (c < 2048) {
			out[p++] = c >> 6 | 192;
			out[p++] = c & 63 | 128;
		} else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
			c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
			out[p++] = c >> 18 | 240;
			out[p++] = c >> 12 & 63 | 128;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		} else {
			if (c >= 55296 && c <= 57343) c = 65533;
			out[p++] = c >> 12 | 224;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		}
	}
	return out;
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/bl.js
/**
* Bl is a list of byte chunks, similar to https://github.com/rvagg/bl but for
* writing rather than reading.
* A Bl object accepts set() operations for individual bytes and copyTo() for
* inserting byte arrays. These write operations don't automatically increment
* the internal cursor so its "length" won't be changed. Instead, increment()
* must be called to extend its length to cover the inserted data.
* The toBytes() call will convert all internal memory to a single Uint8Array of
* the correct length, truncating any data that is stored but hasn't been
* included by an increment().
* get() can retrieve a single byte.
* All operations (except toBytes()) take an "offset" argument that will perform
* the write at the offset _from the current cursor_. For most operations this
* will be `0` to write at the current cursor position but it can be ahead of
* the current cursor. Negative offsets probably work but are untested.
*/
var defaultChunkSize = 256;
var Bl = class {
	/**
	* @param {number} [chunkSize]
	*/
	constructor(chunkSize = defaultChunkSize) {
		this.chunkSize = chunkSize;
		/** @type {number} */
		this.cursor = 0;
		/** @type {number} */
		this.maxCursor = -1;
		/** @type {(Uint8Array|number[])[]} */
		this.chunks = [];
		/** @type {Uint8Array|number[]|null} */
		this._initReuseChunk = null;
	}
	reset() {
		this.cursor = 0;
		this.maxCursor = -1;
		if (this.chunks.length) this.chunks = [];
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
		if (this.cursor + bytes.length <= this.maxCursor + 1) {
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
				if (this._initReuseChunk === null) this._initReuseChunk = topChunk;
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
				/* c8 ignore next 2 */
				byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
				this._initReuseChunk = null;
				this.chunks = [];
			} else byts = slice(chunk, 0, this.cursor);
		} else byts = concat(this.chunks, this.cursor);
		if (reset) this.reset();
		return byts;
	}
};
/**
* U8Bl is a buffer list that writes directly to a user-provided Uint8Array.
* It provides the same interface as Bl but writes to a fixed destination.
*/
var U8Bl = class {
	/**
	* @param {Uint8Array} dest
	*/
	constructor(dest) {
		this.dest = dest;
		/** @type {number} */
		this.cursor = 0;
		/** @type {Uint8Array[]} */
		this.chunks = [dest];
	}
	reset() {
		this.cursor = 0;
	}
	/**
	* @param {Uint8Array|number[]} bytes
	*/
	push(bytes) {
		if (this.cursor + bytes.length > this.dest.length) throw new Error("write out of bounds, destination buffer is too small");
		this.dest.set(bytes, this.cursor);
		this.cursor += bytes.length;
	}
	/**
	* @param {boolean} [reset]
	* @returns {Uint8Array}
	*/
	toBytes(reset = false) {
		const byts = this.dest.subarray(0, this.cursor);
		if (reset) this.reset();
		return byts;
	}
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/common.js
var decodeErrPrefix = "CBOR decode error:";
var encodeErrPrefix = "CBOR encode error:";
var uintMinorPrefixBytes = [];
uintMinorPrefixBytes[23] = 1;
uintMinorPrefixBytes[24] = 2;
uintMinorPrefixBytes[25] = 3;
uintMinorPrefixBytes[26] = 5;
uintMinorPrefixBytes[27] = 9;
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} need
*/
function assertEnoughData(data, pos, need) {
	if (data.length - pos < need) throw new Error(`${decodeErrPrefix} not enough data for type`);
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/0uint.js
var uintBoundaries = [
	24,
	256,
	65536,
	4294967296,
	BigInt("18446744073709551616")
];
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} data
* @param {number} offset
* @param {DecodeOptions} options
* @returns {number}
*/
function readUint8(data, offset, options) {
	assertEnoughData(data, offset, 1);
	const value = data[offset];
	if (options.strict === true && value < uintBoundaries[0]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
	return value;
}
/**
* @param {Uint8Array} data
* @param {number} offset
* @param {DecodeOptions} options
* @returns {number}
*/
function readUint16(data, offset, options) {
	assertEnoughData(data, offset, 2);
	const value = data[offset] << 8 | data[offset + 1];
	if (options.strict === true && value < uintBoundaries[1]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
	return value;
}
/**
* @param {Uint8Array} data
* @param {number} offset
* @param {DecodeOptions} options
* @returns {number}
*/
function readUint32(data, offset, options) {
	assertEnoughData(data, offset, 4);
	const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
	if (options.strict === true && value < uintBoundaries[2]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
	return value;
}
/**
* @param {Uint8Array} data
* @param {number} offset
* @param {DecodeOptions} options
* @returns {number|bigint}
*/
function readUint64(data, offset, options) {
	assertEnoughData(data, offset, 8);
	const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
	const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
	const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
	if (options.strict === true && value < uintBoundaries[3]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
	if (value <= Number.MAX_SAFE_INTEGER) return Number(value);
	if (options.allowBigInt === true) return value;
	throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeUint8(data, pos, _minor, options) {
	return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeUint16(data, pos, _minor, options) {
	return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeUint32(data, pos, _minor, options) {
	return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeUint64(data, pos, _minor, options) {
	return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeUint(writer, token) {
	return encodeUintValue(writer, 0, token.value);
}
/**
* @param {ByteWriter} writer
* @param {number} major
* @param {number|bigint} uint
*/
function encodeUintValue(writer, major, uint) {
	if (uint < uintBoundaries[0]) {
		const nuint = Number(uint);
		writer.push([major | nuint]);
	} else if (uint < uintBoundaries[1]) {
		const nuint = Number(uint);
		writer.push([major | 24, nuint]);
	} else if (uint < uintBoundaries[2]) {
		const nuint = Number(uint);
		writer.push([
			major | 25,
			nuint >>> 8,
			nuint & 255
		]);
	} else if (uint < uintBoundaries[3]) {
		const nuint = Number(uint);
		writer.push([
			major | 26,
			nuint >>> 24 & 255,
			nuint >>> 16 & 255,
			nuint >>> 8 & 255,
			nuint & 255
		]);
	} else {
		const buint = BigInt(uint);
		if (buint < uintBoundaries[4]) {
			const set = [
				major | 27,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			let lo = Number(buint & BigInt(4294967295));
			let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
			set[8] = lo & 255;
			lo = lo >> 8;
			set[7] = lo & 255;
			lo = lo >> 8;
			set[6] = lo & 255;
			lo = lo >> 8;
			set[5] = lo & 255;
			set[4] = hi & 255;
			hi = hi >> 8;
			set[3] = hi & 255;
			hi = hi >> 8;
			set[2] = hi & 255;
			hi = hi >> 8;
			set[1] = hi & 255;
			writer.push(set);
		} else throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
	}
}
/**
* @param {Token} token
* @returns {number}
*/
encodeUint.encodedSize = function encodedSize(token) {
	return encodeUintValue.encodedSize(token.value);
};
/**
* @param {number} uint
* @returns {number}
*/
encodeUintValue.encodedSize = function encodedSize(uint) {
	if (uint < uintBoundaries[0]) return 1;
	if (uint < uintBoundaries[1]) return 2;
	if (uint < uintBoundaries[2]) return 3;
	if (uint < uintBoundaries[3]) return 5;
	return 9;
};
/**
* @param {Token} tok1
* @param {Token} tok2
* @returns {number}
*/
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
	return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : 	/* c8 ignore next */ 0;
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/1negint.js
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeNegint8(data, pos, _minor, options) {
	return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeNegint16(data, pos, _minor, options) {
	return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeNegint32(data, pos, _minor, options) {
	return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
var neg1b$1 = BigInt(-1);
var pos1b$1 = BigInt(1);
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeNegint64(data, pos, _minor, options) {
	const int = readUint64(data, pos + 1, options);
	if (typeof int !== "bigint") {
		const value = -1 - int;
		if (value >= Number.MIN_SAFE_INTEGER) return new Token(Type.negint, value, 9);
	}
	if (options.allowBigInt !== true) throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
	return new Token(Type.negint, neg1b$1 - BigInt(int), 9);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeNegint(writer, token) {
	const negint = token.value;
	const unsigned = typeof negint === "bigint" ? negint * neg1b$1 - pos1b$1 : negint * -1 - 1;
	encodeUintValue(writer, token.type.majorEncoded, unsigned);
}
/**
* @param {Token} token
* @returns {number}
*/
encodeNegint.encodedSize = function encodedSize(token) {
	const negint = token.value;
	const unsigned = typeof negint === "bigint" ? negint * neg1b$1 - pos1b$1 : negint * -1 - 1;
	/* c8 ignore next 4 */
	if (unsigned < uintBoundaries[0]) return 1;
	if (unsigned < uintBoundaries[1]) return 2;
	if (unsigned < uintBoundaries[2]) return 3;
	if (unsigned < uintBoundaries[3]) return 5;
	return 9;
};
/**
* @param {Token} tok1
* @param {Token} tok2
* @returns {number}
*/
encodeNegint.compareTokens = function compareTokens(tok1, tok2) {
	return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : 	/* c8 ignore next */ 0;
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/2bytes.js
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} prefix
* @param {number} length
* @returns {Token}
*/
function toToken$3(data, pos, prefix, length) {
	assertEnoughData(data, pos, prefix + length);
	const buf = data.slice(pos + prefix, pos + prefix + length);
	return new Token(Type.bytes, buf, prefix + length);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} minor
* @param {DecodeOptions} _options
* @returns {Token}
*/
function decodeBytesCompact(data, pos, minor, _options) {
	return toToken$3(data, pos, 1, minor);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeBytes8(data, pos, _minor, options) {
	return toToken$3(data, pos, 2, readUint8(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeBytes16(data, pos, _minor, options) {
	return toToken$3(data, pos, 3, readUint16(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeBytes32(data, pos, _minor, options) {
	return toToken$3(data, pos, 5, readUint32(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeBytes64(data, pos, _minor, options) {
	const l = readUint64(data, pos + 1, options);
	if (typeof l === "bigint") throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
	return toToken$3(data, pos, 9, l);
}
/**
* `encodedBytes` allows for caching when we do a byte version of a string
* for key sorting purposes
* @param {Token} token
* @returns {Uint8Array}
*/
function tokenBytes(token) {
	if (token.encodedBytes === void 0) token.encodedBytes = Type.equals(token.type, Type.string) ? fromString(token.value) : token.value;
	return token.encodedBytes;
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeBytes(writer, token) {
	const bytes = tokenBytes(token);
	encodeUintValue(writer, token.type.majorEncoded, bytes.length);
	writer.push(bytes);
}
/**
* @param {Token} token
* @returns {number}
*/
encodeBytes.encodedSize = function encodedSize(token) {
	const bytes = tokenBytes(token);
	return encodeUintValue.encodedSize(bytes.length) + bytes.length;
};
/**
* @param {Token} tok1
* @param {Token} tok2
* @returns {number}
*/
encodeBytes.compareTokens = function compareTokens(tok1, tok2) {
	return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
};
/**
* @param {Uint8Array} b1
* @param {Uint8Array} b2
* @returns {number}
*/
function compareBytes(b1, b2) {
	return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/3string.js
var textDecoder = new TextDecoder();
var ASCII_THRESHOLD = 32;
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* Decode UTF-8 bytes to string. For short ASCII strings (common case for map keys),
* a simple loop is faster than TextDecoder.
* @param {Uint8Array} bytes
* @param {number} start
* @param {number} end
* @returns {string}
*/
function toStr(bytes, start, end) {
	if (end - start < ASCII_THRESHOLD) {
		let str = "";
		for (let i = start; i < end; i++) {
			const c = bytes[i];
			if (c & 128) return textDecoder.decode(bytes.subarray(start, end));
			str += String.fromCharCode(c);
		}
		return str;
	}
	return textDecoder.decode(bytes.subarray(start, end));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} prefix
* @param {number} length
* @param {DecodeOptions} options
* @returns {Token}
*/
function toToken$2(data, pos, prefix, length, options) {
	const totLength = prefix + length;
	assertEnoughData(data, pos, totLength);
	const tok = new Token(Type.string, toStr(data, pos + prefix, pos + totLength), totLength);
	if (options.retainStringBytes === true) tok.byteValue = data.slice(pos + prefix, pos + totLength);
	return tok;
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeStringCompact(data, pos, minor, options) {
	return toToken$2(data, pos, 1, minor, options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeString8(data, pos, _minor, options) {
	return toToken$2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeString16(data, pos, _minor, options) {
	return toToken$2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeString32(data, pos, _minor, options) {
	return toToken$2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeString64(data, pos, _minor, options) {
	const l = readUint64(data, pos + 1, options);
	if (typeof l === "bigint") throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
	return toToken$2(data, pos, 9, l, options);
}
var encodeString = encodeBytes;
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/4array.js
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} _data
* @param {number} _pos
* @param {number} prefix
* @param {number} length
* @returns {Token}
*/
function toToken$1(_data, _pos, prefix, length) {
	return new Token(Type.array, length, prefix);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} minor
* @param {DecodeOptions} _options
* @returns {Token}
*/
function decodeArrayCompact(data, pos, minor, _options) {
	return toToken$1(data, pos, 1, minor);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeArray8(data, pos, _minor, options) {
	return toToken$1(data, pos, 2, readUint8(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeArray16(data, pos, _minor, options) {
	return toToken$1(data, pos, 3, readUint16(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeArray32(data, pos, _minor, options) {
	return toToken$1(data, pos, 5, readUint32(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeArray64(data, pos, _minor, options) {
	const l = readUint64(data, pos + 1, options);
	if (typeof l === "bigint") throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
	return toToken$1(data, pos, 9, l);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeArrayIndefinite(data, pos, _minor, options) {
	if (options.allowIndefinite === false) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
	return toToken$1(data, pos, 1, Infinity);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeArray(writer, token) {
	encodeUintValue(writer, Type.array.majorEncoded, token.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
/**
* @param {Token} token
* @returns {number}
*/
encodeArray.encodedSize = function encodedSize(token) {
	return encodeUintValue.encodedSize(token.value);
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/5map.js
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} _data
* @param {number} _pos
* @param {number} prefix
* @param {number} length
* @returns {Token}
*/
function toToken(_data, _pos, prefix, length) {
	return new Token(Type.map, length, prefix);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} minor
* @param {DecodeOptions} _options
* @returns {Token}
*/
function decodeMapCompact(data, pos, minor, _options) {
	return toToken(data, pos, 1, minor);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeMap8(data, pos, _minor, options) {
	return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeMap16(data, pos, _minor, options) {
	return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeMap32(data, pos, _minor, options) {
	return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeMap64(data, pos, _minor, options) {
	const l = readUint64(data, pos + 1, options);
	if (typeof l === "bigint") throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
	return toToken(data, pos, 9, l);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeMapIndefinite(data, pos, _minor, options) {
	if (options.allowIndefinite === false) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
	return toToken(data, pos, 1, Infinity);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeMap(writer, token) {
	encodeUintValue(writer, Type.map.majorEncoded, token.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
/**
* @param {Token} token
* @returns {number}
*/
encodeMap.encodedSize = function encodedSize(token) {
	return encodeUintValue.encodedSize(token.value);
};
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/6tag.js
/**
* @typedef {import('../interface').ByteWriter} ByteWriter
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} _data
* @param {number} _pos
* @param {number} minor
* @param {DecodeOptions} _options
* @returns {Token}
*/
function decodeTagCompact(_data, _pos, minor, _options) {
	return new Token(Type.tag, minor, 1);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeTag8(data, pos, _minor, options) {
	return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeTag16(data, pos, _minor, options) {
	return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeTag32(data, pos, _minor, options) {
	return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeTag64(data, pos, _minor, options) {
	return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
*/
function encodeTag(writer, token) {
	encodeUintValue(writer, Type.tag.majorEncoded, token.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
/**
* @param {Token} token
* @returns {number}
*/
encodeTag.encodedSize = function encodedSize(token) {
	return encodeUintValue.encodedSize(token.value);
};
/**
* @param {Uint8Array} _data
* @param {number} _pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeUndefined(_data, _pos, _minor, options) {
	if (options.allowUndefined === false) throw new Error(`${decodeErrPrefix} undefined values are not supported`);
	else if (options.coerceUndefinedToNull === true) return new Token(Type.null, null, 1);
	return new Token(Type.undefined, void 0, 1);
}
/**
* @param {Uint8Array} _data
* @param {number} _pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeBreak(_data, _pos, _minor, options) {
	if (options.allowIndefinite === false) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
	return new Token(Type.break, void 0, 1);
}
/**
* @param {number} value
* @param {number} bytes
* @param {DecodeOptions} options
* @returns {Token}
*/
function createToken(value, bytes, options) {
	if (options) {
		if (options.allowNaN === false && Number.isNaN(value)) throw new Error(`${decodeErrPrefix} NaN values are not supported`);
		if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
	}
	return new Token(Type.float, value, bytes);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeFloat16(data, pos, _minor, options) {
	return createToken(readFloat16(data, pos + 1), 3, options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeFloat32(data, pos, _minor, options) {
	return createToken(readFloat32(data, pos + 1), 5, options);
}
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} _minor
* @param {DecodeOptions} options
* @returns {Token}
*/
function decodeFloat64(data, pos, _minor, options) {
	return createToken(readFloat64(data, pos + 1), 9, options);
}
/**
* @param {ByteWriter} writer
* @param {Token} token
* @param {EncodeOptions} options
*/
function encodeFloat(writer, token, options) {
	const float = token.value;
	if (float === false) writer.push([Type.float.majorEncoded | 20]);
	else if (float === true) writer.push([Type.float.majorEncoded | 21]);
	else if (float === null) writer.push([Type.float.majorEncoded | 22]);
	else if (float === void 0) writer.push([Type.float.majorEncoded | 23]);
	else {
		let decoded;
		let success = false;
		if (!options || options.float64 !== true) {
			encodeFloat16(float);
			decoded = readFloat16(ui8a, 1);
			if (float === decoded || Number.isNaN(float)) {
				ui8a[0] = 249;
				writer.push(ui8a.slice(0, 3));
				success = true;
			} else {
				encodeFloat32(float);
				decoded = readFloat32(ui8a, 1);
				if (float === decoded) {
					ui8a[0] = 250;
					writer.push(ui8a.slice(0, 5));
					success = true;
				}
			}
		}
		if (!success) {
			encodeFloat64(float);
			decoded = readFloat64(ui8a, 1);
			ui8a[0] = 251;
			writer.push(ui8a.slice(0, 9));
		}
	}
}
/**
* @param {Token} token
* @param {EncodeOptions} options
* @returns {number}
*/
encodeFloat.encodedSize = function encodedSize(token, options) {
	const float = token.value;
	if (float === false || float === true || float === null || float === void 0) return 1;
	if (!options || options.float64 !== true) {
		encodeFloat16(float);
		let decoded = readFloat16(ui8a, 1);
		if (float === decoded || Number.isNaN(float)) return 3;
		encodeFloat32(float);
		decoded = readFloat32(ui8a, 1);
		if (float === decoded) return 5;
	}
	return 9;
};
var buffer = /* @__PURE__ */ new ArrayBuffer(9);
var dataView = new DataView(buffer, 1);
var ui8a = new Uint8Array(buffer, 0);
/**
* @param {number} inp
*/
function encodeFloat16(inp) {
	if (inp === Infinity) dataView.setUint16(0, 31744, false);
	else if (inp === -Infinity) dataView.setUint16(0, 64512, false);
	else if (Number.isNaN(inp)) dataView.setUint16(0, 32256, false);
	else {
		dataView.setFloat32(0, inp);
		const valu32 = dataView.getUint32(0);
		const exponent = (valu32 & 2139095040) >> 23;
		const mantissa = valu32 & 8388607;
		/* c8 ignore next 6 */
		if (exponent === 255) dataView.setUint16(0, 31744, false);
		else if (exponent === 0) dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
		else {
			const logicalExponent = exponent - 127;
			/* c8 ignore next 6 */
			if (logicalExponent < -24) dataView.setUint16(0, 0);
			else if (logicalExponent < -14) dataView.setUint16(0, (valu32 & 2147483648) >> 16 | 1 << 24 + logicalExponent, false);
			else dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
		}
	}
}
/**
* @param {Uint8Array} ui8a
* @param {number} pos
* @returns {number}
*/
function readFloat16(ui8a, pos) {
	if (ui8a.length - pos < 2) throw new Error(`${decodeErrPrefix} not enough data for float16`);
	const half = (ui8a[pos] << 8) + ui8a[pos + 1];
	if (half === 31744) return Infinity;
	if (half === 64512) return -Infinity;
	if (half === 32256) return NaN;
	const exp = half >> 10 & 31;
	const mant = half & 1023;
	let val;
	if (exp === 0) val = mant * 2 ** -24;
	else if (exp !== 31) val = (mant + 1024) * 2 ** (exp - 25);
	else val = mant === 0 ? Infinity : NaN;
	return half & 32768 ? -val : val;
}
/**
* @param {number} inp
*/
function encodeFloat32(inp) {
	dataView.setFloat32(0, inp, false);
}
/**
* @param {Uint8Array} ui8a
* @param {number} pos
* @returns {number}
*/
function readFloat32(ui8a, pos) {
	if (ui8a.length - pos < 4) throw new Error(`${decodeErrPrefix} not enough data for float32`);
	const offset = (ui8a.byteOffset || 0) + pos;
	return new DataView(ui8a.buffer, offset, 4).getFloat32(0, false);
}
/**
* @param {number} inp
*/
function encodeFloat64(inp) {
	dataView.setFloat64(0, inp, false);
}
/**
* @param {Uint8Array} ui8a
* @param {number} pos
* @returns {number}
*/
function readFloat64(ui8a, pos) {
	if (ui8a.length - pos < 8) throw new Error(`${decodeErrPrefix} not enough data for float64`);
	const offset = (ui8a.byteOffset || 0) + pos;
	return new DataView(ui8a.buffer, offset, 8).getFloat64(0, false);
}
/**
* @param {Token} _tok1
* @param {Token} _tok2
* @returns {number}
*/
encodeFloat.compareTokens = encodeUint.compareTokens;
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/jump.js
/**
* @typedef {import('../interface').DecodeOptions} DecodeOptions
*/
/**
* @param {Uint8Array} data
* @param {number} pos
* @param {number} minor
*/
function invalidMinor(data, pos, minor) {
	throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
/**
* @param {string} msg
* @returns {()=>any}
*/
function errorer(msg) {
	return () => {
		throw new Error(`${decodeErrPrefix} ${msg}`);
	};
}
/** @type {((data:Uint8Array, pos:number, minor:number, options?:DecodeOptions) => any)[]} */
var jump = [];
for (let i = 0; i <= 23; i++) jump[i] = invalidMinor;
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let i = 32; i <= 55; i++) jump[i] = invalidMinor;
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let i = 64; i <= 87; i++) jump[i] = decodeBytesCompact;
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) jump[i] = decodeStringCompact;
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) jump[i] = decodeArrayCompact;
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let i = 160; i <= 183; i++) jump[i] = decodeMapCompact;
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let i = 192; i <= 215; i++) jump[i] = decodeTagCompact;
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let i = 224; i <= 243; i++) jump[i] = errorer("simple values are not supported");
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
/** @type {Token[]} */
var quick = [];
for (let i = 0; i < 24; i++) quick[i] = new Token(Type.uint, i, 1);
for (let i = -1; i >= -24; i--) quick[31 - i] = new Token(Type.negint, i, 1);
quick[64] = new Token(Type.bytes, /* @__PURE__ */ new Uint8Array(0), 1);
quick[96] = new Token(Type.string, "", 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, false, 1);
quick[245] = new Token(Type.true, true, 1);
quick[246] = new Token(Type.null, null, 1);
/**
* @param {Token} token
* @returns {Uint8Array|undefined}
*/
function quickEncodeToken(token) {
	switch (token.type) {
		case Type.false: return fromArray([244]);
		case Type.true: return fromArray([245]);
		case Type.null: return fromArray([246]);
		case Type.bytes:
			if (!token.value.length) return fromArray([64]);
			return;
		case Type.string:
			if (token.value === "") return fromArray([96]);
			return;
		case Type.array:
			if (token.value === 0) return fromArray([128]);
			/* c8 ignore next 2 */
			return;
		case Type.map:
			if (token.value === 0) return fromArray([160]);
			/* c8 ignore next 2 */
			return;
		case Type.uint:
			if (token.value < 24) return fromArray([Number(token.value)]);
			return;
		case Type.negint: if (token.value >= -24) return fromArray([31 - Number(token.value)]);
	}
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/encode.js
/**
* @typedef {import('../interface').EncodeOptions} EncodeOptions
* @typedef {import('../interface').OptionalTypeEncoder} OptionalTypeEncoder
* @typedef {import('../interface').Reference} Reference
* @typedef {import('../interface').StrictTypeEncoder} StrictTypeEncoder
* @typedef {import('../interface').TokenTypeEncoder} TokenTypeEncoder
* @typedef {import('../interface').TokenOrNestedTokens} TokenOrNestedTokens
* @typedef {import('../interface').ByteWriter} ByteWriter
*/
/** @type {EncodeOptions} */
var defaultEncodeOptions = {
	float64: false,
	mapSorter,
	quickEncodeToken
};
/** @type {EncodeOptions} */
var rfc8949EncodeOptions = Object.freeze({
	float64: true,
	mapSorter: rfc8949MapSorter,
	quickEncodeToken
});
/** @returns {TokenTypeEncoder[]} */
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
var cborEncoders = makeCborEncoders();
var defaultWriter = new Bl();
/** @implements {Reference} */
var Ref = class Ref {
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
		/** @type {Reference|undefined} */
		let p = this;
		do
			if (p.obj === obj) return true;
		while (p = p.parent);
		return false;
	}
	/**
	* @param {Reference|undefined} stack
	* @param {object|any[]} obj
	* @returns {Reference}
	*/
	static createCheck(stack, obj) {
		if (stack && stack.includes(obj)) throw new Error(`${encodeErrPrefix} object contains circular references`);
		return new Ref(obj, stack);
	}
};
var simpleTokens = {
	null: new Token(Type.null, null),
	undefined: new Token(Type.undefined, void 0),
	true: new Token(Type.true, true),
	false: new Token(Type.false, false),
	emptyArray: new Token(Type.array, 0),
	emptyMap: new Token(Type.map, 0)
};
/** @type {{[typeName: string]: StrictTypeEncoder}} */
var typeEncoders = {
	/**
	* @param {any} obj
	* @param {string} _typ
	* @param {EncodeOptions} _options
	* @param {Reference} [_refStack]
	* @returns {TokenOrNestedTokens}
	*/
	number(obj, _typ, _options, _refStack) {
		if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) return new Token(Type.float, obj);
		else if (obj >= 0) return new Token(Type.uint, obj);
		else return new Token(Type.negint, obj);
	},
	/**
	* @param {any} obj
	* @param {string} _typ
	* @param {EncodeOptions} _options
	* @param {Reference} [_refStack]
	* @returns {TokenOrNestedTokens}
	*/
	bigint(obj, _typ, _options, _refStack) {
		if (obj >= BigInt(0)) return new Token(Type.uint, obj);
		else return new Token(Type.negint, obj);
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
			if (options.addBreakTokens === true) return [simpleTokens.emptyArray, new Token(Type.break)];
			return simpleTokens.emptyArray;
		}
		refStack = Ref.createCheck(refStack, obj);
		const entries = [];
		let i = 0;
		for (const e of obj) entries[i++] = objectToTokens(e, options, refStack);
		if (options.addBreakTokens) return [
			new Token(Type.array, obj.length),
			entries,
			new Token(Type.break)
		];
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
		const maxLength = isMap ? obj.size : keys.length;
		/** @type {undefined | [TokenOrNestedTokens, TokenOrNestedTokens][]} */
		let entries;
		if (maxLength) {
			entries = new Array(maxLength);
			refStack = Ref.createCheck(refStack, obj);
			const skipUndefined = !isMap && options.ignoreUndefinedProperties;
			let i = 0;
			for (const key of keys) {
				const value = isMap ? obj.get(key) : obj[key];
				if (skipUndefined && value === void 0) continue;
				entries[i++] = [objectToTokens(key, options, refStack), objectToTokens(value, options, refStack)];
			}
			if (i < maxLength) entries.length = i;
		}
		if (!entries?.length) {
			if (options.addBreakTokens === true) return [simpleTokens.emptyMap, new Token(Type.break)];
			return simpleTokens.emptyMap;
		}
		sortMapEntries(entries, options);
		if (options.addBreakTokens) return [
			new Token(Type.map, entries.length),
			entries,
			new Token(Type.break)
		];
		return [new Token(Type.map, entries.length), entries];
	}
};
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) typeEncoders[`${typ}Array`] = typeEncoders.DataView;
/**
* @param {any} obj
* @param {EncodeOptions} [options]
* @param {Reference} [refStack]
* @returns {TokenOrNestedTokens}
*/
function objectToTokens(obj, options = {}, refStack) {
	const typ = is(obj);
	const customTypeEncoder = options && options.typeEncoders && options.typeEncoders[typ] || typeEncoders[typ];
	if (typeof customTypeEncoder === "function") {
		const tokens = customTypeEncoder(obj, typ, options, refStack);
		if (tokens != null) return tokens;
	}
	const typeEncoder = typeEncoders[typ];
	if (!typeEncoder) throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
	return typeEncoder(obj, typ, options, refStack);
}
/**
* @param {TokenOrNestedTokens[]} entries
* @param {EncodeOptions} options
*/
function sortMapEntries(entries, options) {
	if (options.mapSorter) entries.sort(options.mapSorter);
}
/**
* @param {(Token|Token[])[]} e1
* @param {(Token|Token[])[]} e2
* @returns {number}
*/
function mapSorter(e1, e2) {
	/* c8 ignore next 2 */
	const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
	const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
	if (keyToken1.type !== keyToken2.type) return keyToken1.type.compare(keyToken2.type);
	const tcmp = cborEncoders[keyToken1.type.major].compareTokens(keyToken1, keyToken2);
	/* c8 ignore next 5 */
	if (tcmp === 0) console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
	return tcmp;
}
/**
* @typedef {Token & { _keyBytes?: Uint8Array }} TokenEx
*
* @param {(Token|Token[])[]} e1
* @param {(Token|Token[])[]} e2
* @returns {number}
*/
function rfc8949MapSorter(e1, e2) {
	if (e1[0] instanceof Token && e2[0] instanceof Token) {
		const t1 = e1[0];
		const t2 = e2[0];
		if (!t1._keyBytes) t1._keyBytes = encodeRfc8949(t1.value);
		if (!t2._keyBytes) t2._keyBytes = encodeRfc8949(t2.value);
		return compare(t1._keyBytes, t2._keyBytes);
	}
	throw new Error("rfc8949MapSorter: complex key types are not supported yet");
}
/**
* @param {any} data
* @returns {Uint8Array}
*/
function encodeRfc8949(data) {
	return encodeCustom(data, cborEncoders, rfc8949EncodeOptions);
}
/**
* @param {ByteWriter} writer
* @param {TokenOrNestedTokens} tokens
* @param {TokenTypeEncoder[]} encoders
* @param {EncodeOptions} options
*/
function tokensToEncoded(writer, tokens, encoders, options) {
	if (Array.isArray(tokens)) for (const token of tokens) tokensToEncoded(writer, token, encoders, options);
	else encoders[tokens.type.major](writer, tokens, options);
}
var MAJOR_UINT = Type.uint.majorEncoded;
var MAJOR_NEGINT = Type.negint.majorEncoded;
var MAJOR_BYTES = Type.bytes.majorEncoded;
var MAJOR_STRING = Type.string.majorEncoded;
var MAJOR_ARRAY = Type.array.majorEncoded;
var SIMPLE_FALSE = Type.float.majorEncoded | 20;
var SIMPLE_TRUE = Type.float.majorEncoded | 21;
var SIMPLE_NULL = Type.float.majorEncoded | 22;
var SIMPLE_UNDEFINED = Type.float.majorEncoded | 23;
var neg1b = BigInt(-1);
var pos1b = BigInt(1);
/**
* Check if direct encoding can be used for the given options.
* Direct encoding bypasses token creation for most values.
* @param {EncodeOptions} options
* @returns {boolean}
*/
function canDirectEncode(options) {
	return options.addBreakTokens !== true;
}
/**
* Direct encode a value to the writer, bypassing token creation for most types.
* Falls back to token-based encoding for custom type encoders.
* @param {ByteWriter} writer
* @param {any} data
* @param {EncodeOptions} options
* @param {Reference|undefined} refStack
*/
function directEncode(writer, data, options, refStack) {
	const typ = is(data);
	const customEncoder = options.typeEncoders && options.typeEncoders[typ];
	if (customEncoder) {
		const tokens = customEncoder(data, typ, options, refStack);
		if (tokens != null) {
			tokensToEncoded(writer, tokens, cborEncoders, options);
			return;
		}
	}
	switch (typ) {
		case "null":
			writer.push([SIMPLE_NULL]);
			return;
		case "undefined":
			writer.push([SIMPLE_UNDEFINED]);
			return;
		case "boolean":
			writer.push([data ? SIMPLE_TRUE : SIMPLE_FALSE]);
			return;
		case "number":
			if (!Number.isInteger(data) || !Number.isSafeInteger(data)) encodeFloat(writer, new Token(Type.float, data), options);
			else if (data >= 0) encodeUintValue(writer, MAJOR_UINT, data);
			else encodeUintValue(writer, MAJOR_NEGINT, data * -1 - 1);
			return;
		case "bigint":
			if (data >= BigInt(0)) encodeUintValue(writer, MAJOR_UINT, data);
			else encodeUintValue(writer, MAJOR_NEGINT, data * neg1b - pos1b);
			return;
		case "string": {
			const bytes = fromString(data);
			encodeUintValue(writer, MAJOR_STRING, bytes.length);
			writer.push(bytes);
			return;
		}
		case "Uint8Array":
			encodeUintValue(writer, MAJOR_BYTES, data.length);
			writer.push(data);
			return;
		case "Array":
			if (!data.length) {
				writer.push([MAJOR_ARRAY]);
				return;
			}
			refStack = Ref.createCheck(refStack, data);
			encodeUintValue(writer, MAJOR_ARRAY, data.length);
			for (const elem of data) directEncode(writer, elem, options, refStack);
			return;
		case "Object":
		case "Map":
			tokensToEncoded(writer, typeEncoders.Object(data, typ, options, refStack), cborEncoders, options);
			return;
		default: {
			const typeEncoder = typeEncoders[typ];
			if (!typeEncoder) throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
			tokensToEncoded(writer, typeEncoder(data, typ, options, refStack), cborEncoders, options);
		}
	}
}
/**
* @param {any} data
* @param {TokenTypeEncoder[]} encoders
* @param {EncodeOptions} options
* @param {Uint8Array} [destination]
* @returns {Uint8Array}
*/
function encodeCustom(data, encoders, options, destination) {
	const hasDest = destination instanceof Uint8Array;
	let writeTo = hasDest ? new U8Bl(destination) : defaultWriter;
	const tokens = objectToTokens(data, options);
	if (!Array.isArray(tokens) && options.quickEncodeToken) {
		const quickBytes = options.quickEncodeToken(tokens);
		if (quickBytes) {
			if (hasDest) {
				writeTo.push(quickBytes);
				return writeTo.toBytes();
			}
			return quickBytes;
		}
		const encoder = encoders[tokens.type.major];
		if (encoder.encodedSize) {
			const size = encoder.encodedSize(tokens, options);
			if (!hasDest) writeTo = new Bl(size);
			encoder(writeTo, tokens, options);
			/* c8 ignore next 4 */
			if (writeTo.chunks.length !== 1) throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
			return hasDest ? writeTo.toBytes() : asU8A(writeTo.chunks[0]);
		}
	}
	writeTo.reset();
	tokensToEncoded(writeTo, tokens, encoders, options);
	return writeTo.toBytes(true);
}
/**
* @param {any} data
* @param {EncodeOptions} [options]
* @returns {Uint8Array}
*/
function encode$2(data, options) {
	options = Object.assign({}, defaultEncodeOptions, options);
	if (canDirectEncode(options)) {
		defaultWriter.reset();
		directEncode(defaultWriter, data, options, void 0);
		return defaultWriter.toBytes(true);
	}
	return encodeCustom(data, cborEncoders, options);
}
//#endregion
//#region node_modules/.pnpm/cborg@4.5.8/node_modules/cborg/lib/decode.js
/**
* @typedef {import('./token.js').Token} Token
* @typedef {import('../interface').DecodeOptions} DecodeOptions
* @typedef {import('../interface').DecodeTokenizer} DecodeTokenizer
*/
var defaultDecodeOptions = {
	strict: false,
	allowIndefinite: true,
	allowUndefined: true,
	allowBigInt: true
};
/**
* @implements {DecodeTokenizer}
*/
var Tokeniser = class {
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
			/* c8 ignore next 4 */
			if (!decoder) throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
			const minor = byt & 31;
			token = decoder(this.data, this._pos, minor, this.options);
		}
		this._pos += token.encodedLength;
		return token;
	}
};
var DONE = Symbol.for("DONE");
var BREAK = Symbol.for("BREAK");
/**
* @param {Token} token
* @param {DecodeTokenizer} tokeniser
* @param {DecodeOptions} options
* @returns {any|BREAK|DONE}
*/
function tokenToArray(token, tokeniser, options) {
	const arr = [];
	for (let i = 0; i < token.value; i++) {
		const value = tokensToObject(tokeniser, options);
		if (value === BREAK) {
			if (token.value === Infinity) break;
			throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
		}
		if (value === DONE) throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
		arr[i] = value;
	}
	return arr;
}
/**
* @param {Token} token
* @param {DecodeTokenizer} tokeniser
* @param {DecodeOptions} options
* @returns {any|BREAK|DONE}
*/
function tokenToMap(token, tokeniser, options) {
	const useMaps = options.useMaps === true;
	const rejectDuplicateMapKeys = options.rejectDuplicateMapKeys === true;
	const obj = useMaps ? void 0 : {};
	const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
	for (let i = 0; i < token.value; i++) {
		const key = tokensToObject(tokeniser, options);
		if (key === BREAK) {
			if (token.value === Infinity) break;
			throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
		}
		if (key === DONE) throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
		if (!useMaps && typeof key !== "string") throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
		if (rejectDuplicateMapKeys) {
			if (useMaps && m.has(key) || !useMaps && Object.hasOwn(obj, key)) throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
		}
		const value = tokensToObject(tokeniser, options);
		if (value === DONE) throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
		if (useMaps) m.set(key, value);
		else obj[key] = value;
	}
	return useMaps ? m : obj;
}
/**
* @param {DecodeTokenizer} tokeniser
* @param {DecodeOptions} options
* @returns {any|BREAK|DONE}
*/
function tokensToObject(tokeniser, options) {
	if (tokeniser.done()) return DONE;
	const token = tokeniser.next();
	if (Type.equals(token.type, Type.break)) return BREAK;
	if (token.type.terminal) return token.value;
	if (Type.equals(token.type, Type.array)) return tokenToArray(token, tokeniser, options);
	if (Type.equals(token.type, Type.map)) return tokenToMap(token, tokeniser, options);
	if (Type.equals(token.type, Type.tag)) {
		if (options.tags && typeof options.tags[token.value] === "function") {
			const tagged = tokensToObject(tokeniser, options);
			return options.tags[token.value](tagged);
		}
		throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
	}
	/* c8 ignore next */
	throw new Error("unsupported");
}
/**
* @param {Uint8Array} data
* @param {DecodeOptions} [options]
* @returns {[any, Uint8Array]}
*/
function decodeFirst(data, options) {
	if (!(data instanceof Uint8Array)) throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
	options = Object.assign({}, defaultDecodeOptions, options);
	const u8aData = asU8A(data);
	const tokeniser = options.tokenizer || new Tokeniser(u8aData, options);
	const decoded = tokensToObject(tokeniser, options);
	if (decoded === DONE) throw new Error(`${decodeErrPrefix} did not find any content to decode`);
	if (decoded === BREAK) throw new Error(`${decodeErrPrefix} got unexpected break`);
	return [decoded, data.subarray(tokeniser.pos())];
}
/**
* @param {Uint8Array} data
* @param {DecodeOptions} [options]
* @returns {any}
*/
function decode$1(data, options) {
	const [decoded, remainder] = decodeFirst(data, options);
	if (remainder.length > 0) throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
	return decoded;
}
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/cbor.js
var cborEncode = function(data) {
	return import_buffer.Buffer.from(encode$2(data));
};
var cborDecode = function(data) {
	return decode$1(import_buffer.Buffer.isBuffer(data) ? data : import_buffer.Buffer.from(data, "hex"));
};
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/ur.js
var UR = function() {
	function UR(_cborPayload, _type) {
		if (_type === void 0) _type = "bytes";
		this._cborPayload = _cborPayload;
		this._type = _type;
		if (!isURType(this._type)) throw new InvalidTypeError();
	}
	UR.fromBuffer = function(buf) {
		return new UR(cborEncode(buf));
	};
	UR.from = function(value) {
		return UR.fromBuffer(import_buffer.Buffer.from(value));
	};
	UR.prototype.decodeCBOR = function() {
		return cborDecode(this._cborPayload);
	};
	Object.defineProperty(UR.prototype, "type", {
		get: function() {
			return this._type;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(UR.prototype, "cbor", {
		get: function() {
			return this._cborPayload;
		},
		enumerable: false,
		configurable: true
	});
	UR.prototype.equals = function(ur2) {
		return this.type === ur2.type && this.cbor.equals(ur2.cbor);
	};
	return UR;
}();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/xoshiro.js
var import_jsbi_umd = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e, t) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self, e.JSBI = t());
	})(exports, function() {
		"use strict";
		var e = Math.imul, t = Math.clz32;
		function i(e) {
			"@babel/helpers - typeof";
			return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
				return typeof e;
			} : function(e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
			}, i(e);
		}
		function _(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function n(e, t) {
			for (var _, n = 0; n < t.length; n++) _ = t[n], _.enumerable = _.enumerable || !1, _.configurable = !0, "value" in _ && (_.writable = !0), Object.defineProperty(e, _.key, _);
		}
		function l(e, t, i) {
			return t && n(e.prototype, t), i && n(e, i), e;
		}
		function g(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
			e.prototype = Object.create(t && t.prototype, { constructor: {
				value: e,
				writable: !0,
				configurable: !0
			} }), t && u(e, t);
		}
		function a(e) {
			return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
				return e.__proto__ || Object.getPrototypeOf(e);
			}, a(e);
		}
		function u(e, t) {
			return u = Object.setPrototypeOf || function(e, t) {
				return e.__proto__ = t, e;
			}, u(e, t);
		}
		function s() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
			} catch (t) {
				return !1;
			}
		}
		function r() {
			return r = s() ? Reflect.construct : function(e, t, i) {
				var _ = [null];
				_.push.apply(_, t);
				var l = new (Function.bind.apply(e, _))();
				return i && u(l, i.prototype), l;
			}, r.apply(null, arguments);
		}
		function d(e) {
			return -1 !== Function.toString.call(e).indexOf("[native code]");
		}
		function h(e) {
			var t = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
			return h = function(e) {
				function i() {
					return r(e, arguments, a(this).constructor);
				}
				if (null === e || !d(e)) return e;
				if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
				if ("undefined" != typeof t) {
					if (t.has(e)) return t.get(e);
					t.set(e, i);
				}
				return i.prototype = Object.create(e.prototype, { constructor: {
					value: i,
					enumerable: !1,
					writable: !0,
					configurable: !0
				} }), u(i, e);
			}, h(e);
		}
		function b(e) {
			if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return e;
		}
		function m(e, t) {
			return t && ("object" == typeof t || "function" == typeof t) ? t : b(e);
		}
		function c(e) {
			var t = s();
			return function() {
				var i, _ = a(e);
				if (t) {
					var n = a(this).constructor;
					i = Reflect.construct(_, arguments, n);
				} else i = _.apply(this, arguments);
				return m(this, i);
			};
		}
		function v(e, t) {
			if (e) {
				if ("string" == typeof e) return f(e, t);
				var i = Object.prototype.toString.call(e).slice(8, -1);
				return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? f(e, t) : void 0;
			}
		}
		function f(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var _ = 0, n = Array(t); _ < t; _++) n[_] = e[_];
			return n;
		}
		function y(e, t) {
			var _ = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (!_) {
				if (Array.isArray(e) || (_ = v(e)) || t && e && "number" == typeof e.length) {
					_ && (e = _);
					var n = 0, l = function() {};
					return {
						s: l,
						n: function() {
							return n >= e.length ? { done: !0 } : {
								done: !1,
								value: e[n++]
							};
						},
						e: function(t) {
							throw t;
						},
						f: l
					};
				}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			var g, a = !0, u = !1;
			return {
				s: function() {
					_ = _.call(e);
				},
				n: function() {
					var e = _.next();
					return a = e.done, e;
				},
				e: function(t) {
					u = !0, g = t;
				},
				f: function() {
					try {
						a || null == _.return || _.return();
					} finally {
						if (u) throw g;
					}
				}
			};
		}
		var k = function(e) {
			var t = Math.abs, n = Math.max;
			function o(e, t) {
				var i;
				if (_(this, o), e > o.__kMaxLength) throw new RangeError("Maximum BigInt size exceeded");
				return i = a.call(this, e), i.sign = t, i;
			}
			g(o, e);
			var a = c(o);
			return l(o, [
				{
					key: "toDebugString",
					value: function() {
						var e, t = ["BigInt["], i = y(this);
						try {
							for (i.s(); !(e = i.n()).done;) {
								var _ = e.value;
								t.push((_ ? (_ >>> 0).toString(16) : _) + ", ");
							}
						} catch (e) {
							i.e(e);
						} finally {
							i.f();
						}
						return t.push("]"), t.join("");
					}
				},
				{
					key: "toString",
					value: function() {
						var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 10;
						if (2 > e || 36 < e) throw new RangeError("toString() radix argument must be between 2 and 36");
						return 0 === this.length ? "0" : 0 == (e & e - 1) ? o.__toStringBasePowerOfTwo(this, e) : o.__toStringGeneric(this, e, !1);
					}
				},
				{
					key: "__copy",
					value: function() {
						for (var e = new o(this.length, this.sign), t = 0; t < this.length; t++) e[t] = this[t];
						return e;
					}
				},
				{
					key: "__trim",
					value: function() {
						for (var e = this.length, t = this[e - 1]; 0 === t;) e--, t = this[e - 1], this.pop();
						return 0 === e && (this.sign = !1), this;
					}
				},
				{
					key: "__initializeDigits",
					value: function() {
						for (var e = 0; e < this.length; e++) this[e] = 0;
					}
				},
				{
					key: "__clzmsd",
					value: function() {
						return o.__clz32(this[this.length - 1]);
					}
				},
				{
					key: "__inplaceMultiplyAdd",
					value: function(e, t, _) {
						_ > this.length && (_ = this.length);
						for (var n = 65535 & e, l = e >>> 16, g = 0, a = 65535 & t, u = t >>> 16, s = 0; s < _; s++) {
							var r = this.__digit(s), d = 65535 & r, h = r >>> 16, b = o.__imul(d, n), m = o.__imul(d, l), c = o.__imul(h, n), v = o.__imul(h, l), f = a + (65535 & b), y = u + g + (f >>> 16) + (b >>> 16) + (65535 & m) + (65535 & c);
							a = (m >>> 16) + (c >>> 16) + (65535 & v) + (y >>> 16), g = a >>> 16, a &= 65535, u = v >>> 16;
							this.__setDigit(s, 65535 & f | y << 16);
						}
						if (0 !== g || 0 !== a || 0 !== u) throw new Error("implementation bug");
					}
				},
				{
					key: "__inplaceAdd",
					value: function(e, t, _) {
						for (var n, l = 0, g = 0; g < _; g++) n = this.__halfDigit(t + g) + e.__halfDigit(g) + l, l = n >>> 16, this.__setHalfDigit(t + g, n);
						return l;
					}
				},
				{
					key: "__inplaceSub",
					value: function(e, t, _) {
						var n = 0;
						if (1 & t) {
							t >>= 1;
							for (var l = this.__digit(t), g = 65535 & l, o = 0; o < _ - 1 >>> 1; o++) {
								var a = e.__digit(o), u = (l >>> 16) - (65535 & a) - n;
								n = 1 & u >>> 16, this.__setDigit(t + o, u << 16 | 65535 & g), l = this.__digit(t + o + 1), g = (65535 & l) - (a >>> 16) - n, n = 1 & g >>> 16;
							}
							var s = e.__digit(o), r = (l >>> 16) - (65535 & s) - n;
							n = 1 & r >>> 16, this.__setDigit(t + o, r << 16 | 65535 & g);
							if (t + o + 1 >= this.length) throw new RangeError("out of bounds");
							0 == (1 & _) && (l = this.__digit(t + o + 1), g = (65535 & l) - (s >>> 16) - n, n = 1 & g >>> 16, this.__setDigit(t + e.length, 4294901760 & l | 65535 & g));
						} else {
							t >>= 1;
							for (var d = 0; d < e.length - 1; d++) {
								var h = this.__digit(t + d), b = e.__digit(d), m = (65535 & h) - (65535 & b) - n;
								n = 1 & m >>> 16;
								var c = (h >>> 16) - (b >>> 16) - n;
								n = 1 & c >>> 16, this.__setDigit(t + d, c << 16 | 65535 & m);
							}
							var v = this.__digit(t + d), f = e.__digit(d), y = (65535 & v) - (65535 & f) - n;
							n = 1 & y >>> 16;
							var k = 0;
							0 == (1 & _) && (k = (v >>> 16) - (f >>> 16) - n, n = 1 & k >>> 16), this.__setDigit(t + d, k << 16 | 65535 & y);
						}
						return n;
					}
				},
				{
					key: "__inplaceRightShift",
					value: function(e) {
						if (0 !== e) {
							for (var t, _ = this.__digit(0) >>> e, n = this.length - 1, l = 0; l < n; l++) t = this.__digit(l + 1), this.__setDigit(l, t << 32 - e | _), _ = t >>> e;
							this.__setDigit(n, _);
						}
					}
				},
				{
					key: "__digit",
					value: function(e) {
						return this[e];
					}
				},
				{
					key: "__unsignedDigit",
					value: function(e) {
						return this[e] >>> 0;
					}
				},
				{
					key: "__setDigit",
					value: function(e, t) {
						this[e] = 0 | t;
					}
				},
				{
					key: "__setDigitGrow",
					value: function(e, t) {
						this[e] = 0 | t;
					}
				},
				{
					key: "__halfDigitLength",
					value: function() {
						var e = this.length;
						return 65535 >= this.__unsignedDigit(e - 1) ? 2 * e - 1 : 2 * e;
					}
				},
				{
					key: "__halfDigit",
					value: function(e) {
						return 65535 & this[e >>> 1] >>> ((1 & e) << 4);
					}
				},
				{
					key: "__setHalfDigit",
					value: function(e, t) {
						var i = e >>> 1, _ = this.__digit(i), n = 1 & e ? 65535 & _ | t << 16 : 4294901760 & _ | 65535 & t;
						this.__setDigit(i, n);
					}
				}
			], [
				{
					key: "BigInt",
					value: function(e) {
						var t = Math.floor, _ = Number.isFinite;
						if ("number" == typeof e) {
							if (0 === e) return o.__zero();
							if ((0 | e) === e) return 0 > e ? o.__oneDigit(-e, !0) : o.__oneDigit(e, !1);
							if (!_(e) || t(e) !== e) throw new RangeError("The number " + e + " cannot be converted to BigInt because it is not an integer");
							return o.__fromDouble(e);
						}
						if ("string" == typeof e) {
							var n = o.__fromString(e);
							if (null === n) throw new SyntaxError("Cannot convert " + e + " to a BigInt");
							return n;
						}
						if ("boolean" == typeof e) return !0 === e ? o.__oneDigit(1, !1) : o.__zero();
						if ("object" === i(e)) {
							if (e.constructor === o) return e;
							var l = o.__toPrimitive(e);
							return o.BigInt(l);
						}
						throw new TypeError("Cannot convert " + e + " to a BigInt");
					}
				},
				{
					key: "toNumber",
					value: function(e) {
						var t = e.length;
						if (0 === t) return 0;
						if (1 === t) {
							var i = e.__unsignedDigit(0);
							return e.sign ? -i : i;
						}
						var _ = e.__digit(t - 1), n = o.__clz32(_), l = 32 * t - n;
						if (1024 < l) return e.sign ? -Infinity : Infinity;
						var g = l - 1, a = _, u = t - 1, s = n + 1, r = 32 === s ? 0 : a << s;
						r >>>= 12;
						var d = s - 12, h = 12 <= s ? 0 : a << 20 + s, b = 20 + s;
						0 < d && 0 < u && (u--, a = e.__digit(u), r |= a >>> 32 - d, h = a << d, b = d), 0 < b && 0 < u && (u--, a = e.__digit(u), h |= a >>> 32 - b, b -= 32);
						var m = o.__decideRounding(e, b, u, a);
						if ((1 === m || 0 === m && 1 == (1 & h)) && (h = h + 1 >>> 0, 0 === h && (r++, 0 != r >>> 20 && (r = 0, g++, 1023 < g)))) return e.sign ? -Infinity : Infinity;
						var c = e.sign ? -2147483648 : 0;
						return g = g + 1023 << 20, o.__kBitConversionInts[1] = c | g | r, o.__kBitConversionInts[0] = h, o.__kBitConversionDouble[0];
					}
				},
				{
					key: "unaryMinus",
					value: function(e) {
						if (0 === e.length) return e;
						var t = e.__copy();
						return t.sign = !e.sign, t;
					}
				},
				{
					key: "bitwiseNot",
					value: function(e) {
						return e.sign ? o.__absoluteSubOne(e).__trim() : o.__absoluteAddOne(e, !0);
					}
				},
				{
					key: "exponentiate",
					value: function(e, t) {
						if (t.sign) throw new RangeError("Exponent must be positive");
						if (0 === t.length) return o.__oneDigit(1, !1);
						if (0 === e.length) return e;
						if (1 === e.length && 1 === e.__digit(0)) return e.sign && 0 == (1 & t.__digit(0)) ? o.unaryMinus(e) : e;
						if (1 < t.length) throw new RangeError("BigInt too big");
						var i = t.__unsignedDigit(0);
						if (1 === i) return e;
						if (i >= o.__kMaxLengthBits) throw new RangeError("BigInt too big");
						if (1 === e.length && 2 === e.__digit(0)) {
							var _ = 1 + (i >>> 5), l = new o(_, e.sign && 0 != (1 & i));
							l.__initializeDigits();
							var g = 1 << (31 & i);
							return l.__setDigit(_ - 1, g), l;
						}
						var a = null, u = e;
						for (0 != (1 & i) && (a = e), i >>= 1; 0 !== i; i >>= 1) u = o.multiply(u, u), 0 != (1 & i) && (null === a ? a = u : a = o.multiply(a, u));
						return a;
					}
				},
				{
					key: "multiply",
					value: function(e, t) {
						if (0 === e.length) return e;
						if (0 === t.length) return t;
						var _ = e.length + t.length;
						32 <= e.__clzmsd() + t.__clzmsd() && _--;
						var n = new o(_, e.sign !== t.sign);
						n.__initializeDigits();
						for (var l = 0; l < e.length; l++) o.__multiplyAccumulate(t, e.__digit(l), n, l);
						return n.__trim();
					}
				},
				{
					key: "divide",
					value: function(e, t) {
						if (0 === t.length) throw new RangeError("Division by zero");
						if (0 > o.__absoluteCompare(e, t)) return o.__zero();
						var i, _ = e.sign !== t.sign, n = t.__unsignedDigit(0);
						if (1 === t.length && 65535 >= n) {
							if (1 === n) return _ === e.sign ? e : o.unaryMinus(e);
							i = o.__absoluteDivSmall(e, n, null);
						} else i = o.__absoluteDivLarge(e, t, !0, !1);
						return i.sign = _, i.__trim();
					}
				},
				{
					key: "remainder",
					value: function e(t, i) {
						if (0 === i.length) throw new RangeError("Division by zero");
						if (0 > o.__absoluteCompare(t, i)) return t;
						var _ = i.__unsignedDigit(0);
						if (1 === i.length && 65535 >= _) {
							if (1 === _) return o.__zero();
							var n = o.__absoluteModSmall(t, _);
							return 0 === n ? o.__zero() : o.__oneDigit(n, t.sign);
						}
						var e = o.__absoluteDivLarge(t, i, !1, !0);
						return e.sign = t.sign, e.__trim();
					}
				},
				{
					key: "add",
					value: function(e, t) {
						var i = e.sign;
						return i === t.sign ? o.__absoluteAdd(e, t, i) : 0 <= o.__absoluteCompare(e, t) ? o.__absoluteSub(e, t, i) : o.__absoluteSub(t, e, !i);
					}
				},
				{
					key: "subtract",
					value: function(e, t) {
						var i = e.sign;
						return i === t.sign ? 0 <= o.__absoluteCompare(e, t) ? o.__absoluteSub(e, t, i) : o.__absoluteSub(t, e, !i) : o.__absoluteAdd(e, t, i);
					}
				},
				{
					key: "leftShift",
					value: function(e, t) {
						return 0 === t.length || 0 === e.length ? e : t.sign ? o.__rightShiftByAbsolute(e, t) : o.__leftShiftByAbsolute(e, t);
					}
				},
				{
					key: "signedRightShift",
					value: function(e, t) {
						return 0 === t.length || 0 === e.length ? e : t.sign ? o.__leftShiftByAbsolute(e, t) : o.__rightShiftByAbsolute(e, t);
					}
				},
				{
					key: "unsignedRightShift",
					value: function() {
						throw new TypeError("BigInts have no unsigned right shift; use >> instead");
					}
				},
				{
					key: "lessThan",
					value: function(e, t) {
						return 0 > o.__compareToBigInt(e, t);
					}
				},
				{
					key: "lessThanOrEqual",
					value: function(e, t) {
						return 0 >= o.__compareToBigInt(e, t);
					}
				},
				{
					key: "greaterThan",
					value: function(e, t) {
						return 0 < o.__compareToBigInt(e, t);
					}
				},
				{
					key: "greaterThanOrEqual",
					value: function(e, t) {
						return 0 <= o.__compareToBigInt(e, t);
					}
				},
				{
					key: "equal",
					value: function(e, t) {
						if (e.sign !== t.sign) return !1;
						if (e.length !== t.length) return !1;
						for (var _ = 0; _ < e.length; _++) if (e.__digit(_) !== t.__digit(_)) return !1;
						return !0;
					}
				},
				{
					key: "notEqual",
					value: function(e, t) {
						return !o.equal(e, t);
					}
				},
				{
					key: "bitwiseAnd",
					value: function(e, t) {
						if (!e.sign && !t.sign) return o.__absoluteAnd(e, t).__trim();
						if (e.sign && t.sign) {
							var i = n(e.length, t.length) + 1, _ = o.__absoluteSubOne(e, i), l = o.__absoluteSubOne(t);
							return _ = o.__absoluteOr(_, l, _), o.__absoluteAddOne(_, !0, _).__trim();
						}
						if (e.sign) {
							var g = [t, e];
							e = g[0], t = g[1];
						}
						return o.__absoluteAndNot(e, o.__absoluteSubOne(t)).__trim();
					}
				},
				{
					key: "bitwiseXor",
					value: function(e, t) {
						if (!e.sign && !t.sign) return o.__absoluteXor(e, t).__trim();
						if (e.sign && t.sign) {
							var i = n(e.length, t.length), _ = o.__absoluteSubOne(e, i), l = o.__absoluteSubOne(t);
							return o.__absoluteXor(_, l, _).__trim();
						}
						var g = n(e.length, t.length) + 1;
						if (e.sign) {
							var a = [t, e];
							e = a[0], t = a[1];
						}
						var u = o.__absoluteSubOne(t, g);
						return u = o.__absoluteXor(u, e, u), o.__absoluteAddOne(u, !0, u).__trim();
					}
				},
				{
					key: "bitwiseOr",
					value: function(e, t) {
						var i = n(e.length, t.length);
						if (!e.sign && !t.sign) return o.__absoluteOr(e, t).__trim();
						if (e.sign && t.sign) {
							var _ = o.__absoluteSubOne(e, i), l = o.__absoluteSubOne(t);
							return _ = o.__absoluteAnd(_, l, _), o.__absoluteAddOne(_, !0, _).__trim();
						}
						if (e.sign) {
							var g = [t, e];
							e = g[0], t = g[1];
						}
						var a = o.__absoluteSubOne(t, i);
						return a = o.__absoluteAndNot(a, e, a), o.__absoluteAddOne(a, !0, a).__trim();
					}
				},
				{
					key: "asIntN",
					value: function(e, t) {
						if (0 === t.length) return t;
						if (0 === e) return o.__zero();
						if (e >= o.__kMaxLengthBits) return t;
						var _ = e + 31 >>> 5;
						if (t.length < _) return t;
						var n = t.__unsignedDigit(_ - 1), l = 1 << (31 & e - 1);
						if (t.length === _ && n < l) return t;
						if (!((n & l) === l)) return o.__truncateToNBits(e, t);
						if (!t.sign) return o.__truncateAndSubFromPowerOfTwo(e, t, !0);
						if (0 == (n & l - 1)) {
							for (var g = _ - 2; 0 <= g; g--) if (0 !== t.__digit(g)) return o.__truncateAndSubFromPowerOfTwo(e, t, !1);
							return t.length === _ && n === l ? t : o.__truncateToNBits(e, t);
						}
						return o.__truncateAndSubFromPowerOfTwo(e, t, !1);
					}
				},
				{
					key: "asUintN",
					value: function(e, t) {
						if (0 === t.length) return t;
						if (0 === e) return o.__zero();
						if (t.sign) {
							if (e > o.__kMaxLengthBits) throw new RangeError("BigInt too big");
							return o.__truncateAndSubFromPowerOfTwo(e, t, !1);
						}
						if (e >= o.__kMaxLengthBits) return t;
						var i = e + 31 >>> 5;
						if (t.length < i) return t;
						var _ = 31 & e;
						if (t.length == i) {
							if (0 === _) return t;
							if (0 == t.__digit(i - 1) >>> _) return t;
						}
						return o.__truncateToNBits(e, t);
					}
				},
				{
					key: "ADD",
					value: function(e, t) {
						if (e = o.__toPrimitive(e), t = o.__toPrimitive(t), "string" == typeof e) return "string" != typeof t && (t = t.toString()), e + t;
						if ("string" == typeof t) return e.toString() + t;
						if (e = o.__toNumeric(e), t = o.__toNumeric(t), o.__isBigInt(e) && o.__isBigInt(t)) return o.add(e, t);
						if ("number" == typeof e && "number" == typeof t) return e + t;
						throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
					}
				},
				{
					key: "LT",
					value: function(e, t) {
						return o.__compare(e, t, 0);
					}
				},
				{
					key: "LE",
					value: function(e, t) {
						return o.__compare(e, t, 1);
					}
				},
				{
					key: "GT",
					value: function(e, t) {
						return o.__compare(e, t, 2);
					}
				},
				{
					key: "GE",
					value: function(e, t) {
						return o.__compare(e, t, 3);
					}
				},
				{
					key: "EQ",
					value: function(e, t) {
						for (;;) {
							if (o.__isBigInt(e)) return o.__isBigInt(t) ? o.equal(e, t) : o.EQ(t, e);
							if ("number" == typeof e) {
								if (o.__isBigInt(t)) return o.__equalToNumber(t, e);
								if ("object" !== i(t)) return e == t;
								t = o.__toPrimitive(t);
							} else if ("string" == typeof e) {
								if (o.__isBigInt(t)) return e = o.__fromString(e), null !== e && o.equal(e, t);
								if ("object" !== i(t)) return e == t;
								t = o.__toPrimitive(t);
							} else if ("boolean" == typeof e) {
								if (o.__isBigInt(t)) return o.__equalToNumber(t, +e);
								if ("object" !== i(t)) return e == t;
								t = o.__toPrimitive(t);
							} else if ("symbol" === i(e)) {
								if (o.__isBigInt(t)) return !1;
								if ("object" !== i(t)) return e == t;
								t = o.__toPrimitive(t);
							} else if ("object" === i(e)) {
								if ("object" === i(t) && t.constructor !== o) return e == t;
								e = o.__toPrimitive(e);
							} else return e == t;
						}
					}
				},
				{
					key: "NE",
					value: function(e, t) {
						return !o.EQ(e, t);
					}
				},
				{
					key: "__zero",
					value: function() {
						return new o(0, !1);
					}
				},
				{
					key: "__oneDigit",
					value: function(e, t) {
						var i = new o(1, t);
						return i.__setDigit(0, e), i;
					}
				},
				{
					key: "__decideRounding",
					value: function(e, t, i, _) {
						if (0 < t) return -1;
						var n;
						if (0 > t) n = -t - 1;
						else {
							if (0 === i) return -1;
							i--, _ = e.__digit(i), n = 31;
						}
						var l = 1 << n;
						if (0 == (_ & l)) return -1;
						if (l -= 1, 0 != (_ & l)) return 1;
						for (; 0 < i;) if (i--, 0 !== e.__digit(i)) return 1;
						return 0;
					}
				},
				{
					key: "__fromDouble",
					value: function(e) {
						o.__kBitConversionDouble[0] = e;
						var t, _ = (2047 & o.__kBitConversionInts[1] >>> 20) - 1023, n = (_ >>> 5) + 1, l = new o(n, 0 > e), g = 1048575 & o.__kBitConversionInts[1] | 1048576, a = o.__kBitConversionInts[0], u = 20, s = 31 & _, r = 0;
						if (s < u) {
							var d = u - s;
							r = d + 32, t = g >>> d, g = g << 32 - d | a >>> d, a <<= 32 - d;
						} else if (s === u) r = 32, t = g, g = a;
						else {
							var h = s - u;
							r = 32 - h, t = g << h | a >>> 32 - h, g = a << h;
						}
						l.__setDigit(n - 1, t);
						for (var b = n - 2; 0 <= b; b--) 0 < r ? (r -= 32, t = g, g = a) : t = 0, l.__setDigit(b, t);
						return l.__trim();
					}
				},
				{
					key: "__isWhitespace",
					value: function(e) {
						return !!(13 >= e && 9 <= e) || (159 >= e ? 32 == e : 131071 >= e ? 160 == e || 5760 == e : 196607 >= e ? (e &= 131071, 10 >= e || 40 == e || 41 == e || 47 == e || 95 == e || 4096 == e) : 65279 == e);
					}
				},
				{
					key: "__fromString",
					value: function(e) {
						var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0, i = 0, _ = e.length, n = 0;
						if (n === _) return o.__zero();
						for (var l = e.charCodeAt(n); o.__isWhitespace(l);) {
							if (++n === _) return o.__zero();
							l = e.charCodeAt(n);
						}
						if (43 === l) {
							if (++n === _) return null;
							l = e.charCodeAt(n), i = 1;
						} else if (45 === l) {
							if (++n === _) return null;
							l = e.charCodeAt(n), i = -1;
						}
						if (0 === t) {
							if (t = 10, 48 === l) {
								if (++n === _) return o.__zero();
								if (l = e.charCodeAt(n), 88 === l || 120 === l) {
									if (t = 16, ++n === _) return null;
									l = e.charCodeAt(n);
								} else if (79 === l || 111 === l) {
									if (t = 8, ++n === _) return null;
									l = e.charCodeAt(n);
								} else if (66 === l || 98 === l) {
									if (t = 2, ++n === _) return null;
									l = e.charCodeAt(n);
								}
							}
						} else if (16 === t && 48 === l) {
							if (++n === _) return o.__zero();
							if (l = e.charCodeAt(n), 88 === l || 120 === l) {
								if (++n === _) return null;
								l = e.charCodeAt(n);
							}
						}
						for (; 48 === l;) {
							if (++n === _) return o.__zero();
							l = e.charCodeAt(n);
						}
						var g = _ - n, a = o.__kMaxBitsPerChar[t], u = o.__kBitsPerCharTableMultiplier - 1;
						if (g > 1073741824 / a) return null;
						var r = new o((a * g + u >>> o.__kBitsPerCharTableShift) + 31 >>> 5, !1), h = 10 > t ? t : 10, b = 10 < t ? t - 10 : 0;
						if (0 == (t & t - 1)) {
							a >>= o.__kBitsPerCharTableShift;
							var c = [], v = [], f = !1;
							do {
								for (var y, k = 0, D = 0;;) {
									if (y = void 0, l - 48 >>> 0 < h) y = l - 48;
									else if ((32 | l) - 97 >>> 0 < b) y = (32 | l) - 87;
									else {
										f = !0;
										break;
									}
									if (D += a, k = k << a | y, ++n === _) {
										f = !0;
										break;
									}
									if (l = e.charCodeAt(n), 32 < D + a) break;
								}
								c.push(k), v.push(D);
							} while (!f);
							o.__fillFromParts(r, c, v);
						} else {
							r.__initializeDigits();
							var p = !1, B = 0;
							do {
								for (var S, C = 0, A = 1;;) {
									if (S = void 0, l - 48 >>> 0 < h) S = l - 48;
									else if ((32 | l) - 97 >>> 0 < b) S = (32 | l) - 87;
									else {
										p = !0;
										break;
									}
									var T = A * t;
									if (4294967295 < T) break;
									if (A = T, C = C * t + S, B++, ++n === _) {
										p = !0;
										break;
									}
									l = e.charCodeAt(n);
								}
								u = 32 * o.__kBitsPerCharTableMultiplier - 1;
								var m = a * B + u >>> o.__kBitsPerCharTableShift + 5;
								r.__inplaceMultiplyAdd(A, C, m);
							} while (!p);
						}
						if (n !== _) {
							if (!o.__isWhitespace(l)) return null;
							for (n++; n < _; n++) if (l = e.charCodeAt(n), !o.__isWhitespace(l)) return null;
						}
						return 0 !== i && 10 !== t ? null : (r.sign = -1 === i, r.__trim());
					}
				},
				{
					key: "__fillFromParts",
					value: function(e, t, _) {
						for (var n = 0, l = 0, g = 0, o = t.length - 1; 0 <= o; o--) {
							var a = t[o], u = _[o];
							l |= a << g, g += u, 32 === g ? (e.__setDigit(n++, l), g = 0, l = 0) : 32 < g && (e.__setDigit(n++, l), g -= 32, l = a >>> u - g);
						}
						if (0 !== l) {
							if (n >= e.length) throw new Error("implementation bug");
							e.__setDigit(n++, l);
						}
						for (; n < e.length; n++) e.__setDigit(n, 0);
					}
				},
				{
					key: "__toStringBasePowerOfTwo",
					value: function(e, t) {
						var _ = e.length, n = t - 1;
						n = (85 & n >>> 1) + (85 & n), n = (51 & n >>> 2) + (51 & n), n = (15 & n >>> 4) + (15 & n);
						var l = n, g = t - 1, a = e.__digit(_ - 1), u = o.__clz32(a), s = 0 | (32 * _ - u + l - 1) / l;
						if (e.sign && s++, 268435456 < s) throw new Error("string too long");
						for (var r = Array(s), d = s - 1, h = 0, b = 0, m = 0; m < _ - 1; m++) {
							var c = e.__digit(m), v = (h | c << b) & g;
							r[d--] = o.__kConversionChars[v];
							var f = l - b;
							for (h = c >>> f, b = 32 - f; b >= l;) r[d--] = o.__kConversionChars[h & g], h >>>= l, b -= l;
						}
						var y = (h | a << b) & g;
						for (r[d--] = o.__kConversionChars[y], h = a >>> l - b; 0 !== h;) r[d--] = o.__kConversionChars[h & g], h >>>= l;
						if (e.sign && (r[d--] = "-"), -1 !== d) throw new Error("implementation bug");
						return r.join("");
					}
				},
				{
					key: "__toStringGeneric",
					value: function(e, t, _) {
						var n = e.length;
						if (0 === n) return "";
						if (1 === n) {
							var l = e.__unsignedDigit(0).toString(t);
							return !1 === _ && e.sign && (l = "-" + l), l;
						}
						var g = 32 * n - o.__clz32(e.__digit(n - 1)), u = o.__kMaxBitsPerChar[t] - 1, s = g * o.__kBitsPerCharTableMultiplier;
						s += u - 1, s = 0 | s / u;
						var r, d, h = s + 1 >> 1, b = o.exponentiate(o.__oneDigit(t, !1), o.__oneDigit(h, !1)), m = b.__unsignedDigit(0);
						if (1 === b.length && 65535 >= m) {
							r = new o(e.length, !1), r.__initializeDigits();
							for (var c, v = 0, f = 2 * e.length - 1; 0 <= f; f--) c = v << 16 | e.__halfDigit(f), r.__setHalfDigit(f, 0 | c / m), v = 0 | c % m;
							d = v.toString(t);
						} else {
							var y = o.__absoluteDivLarge(e, b, !0, !0);
							r = y.quotient;
							var k = y.remainder.__trim();
							d = o.__toStringGeneric(k, t, !0);
						}
						r.__trim();
						for (var D = o.__toStringGeneric(r, t, !0); d.length < h;) d = "0" + d;
						return !1 === _ && e.sign && (D = "-" + D), D + d;
					}
				},
				{
					key: "__unequalSign",
					value: function(e) {
						return e ? -1 : 1;
					}
				},
				{
					key: "__absoluteGreater",
					value: function(e) {
						return e ? -1 : 1;
					}
				},
				{
					key: "__absoluteLess",
					value: function(e) {
						return e ? 1 : -1;
					}
				},
				{
					key: "__compareToBigInt",
					value: function(e, t) {
						var i = e.sign;
						if (i !== t.sign) return o.__unequalSign(i);
						var _ = o.__absoluteCompare(e, t);
						return 0 < _ ? o.__absoluteGreater(i) : 0 > _ ? o.__absoluteLess(i) : 0;
					}
				},
				{
					key: "__compareToNumber",
					value: function(e, i) {
						if (!0 | i) {
							var _ = e.sign, n = 0 > i;
							if (_ !== n) return o.__unequalSign(_);
							if (0 === e.length) {
								if (n) throw new Error("implementation bug");
								return 0 === i ? 0 : -1;
							}
							if (1 < e.length) return o.__absoluteGreater(_);
							var l = t(i), g = e.__unsignedDigit(0);
							return g > l ? o.__absoluteGreater(_) : g < l ? o.__absoluteLess(_) : 0;
						}
						return o.__compareToDouble(e, i);
					}
				},
				{
					key: "__compareToDouble",
					value: function(e, t) {
						if (t !== t) return t;
						if (t === Infinity) return -1;
						if (t === -Infinity) return 1;
						var i = e.sign;
						if (i !== 0 > t) return o.__unequalSign(i);
						if (0 === t) throw new Error("implementation bug: should be handled elsewhere");
						if (0 === e.length) return -1;
						o.__kBitConversionDouble[0] = t;
						var _ = 2047 & o.__kBitConversionInts[1] >>> 20;
						if (2047 == _) throw new Error("implementation bug: handled elsewhere");
						var n = _ - 1023;
						if (0 > n) return o.__absoluteGreater(i);
						var l = e.length, g = e.__digit(l - 1), a = o.__clz32(g), u = 32 * l - a, s = n + 1;
						if (u < s) return o.__absoluteLess(i);
						if (u > s) return o.__absoluteGreater(i);
						var r = 1048576 | 1048575 & o.__kBitConversionInts[1], d = o.__kBitConversionInts[0], h = 20, b = 31 - a;
						if (b !== (u - 1) % 31) throw new Error("implementation bug");
						var m, c = 0;
						if (b < h) {
							var v = h - b;
							c = v + 32, m = r >>> v, r = r << 32 - v | d >>> v, d <<= 32 - v;
						} else if (b === h) c = 32, m = r, r = d;
						else {
							var f = b - h;
							c = 32 - f, m = r << f | d >>> 32 - f, r = d << f;
						}
						if (g >>>= 0, m >>>= 0, g > m) return o.__absoluteGreater(i);
						if (g < m) return o.__absoluteLess(i);
						for (var y = l - 2; 0 <= y; y--) {
							0 < c ? (c -= 32, m = r >>> 0, r = d, d = 0) : m = 0;
							var k = e.__unsignedDigit(y);
							if (k > m) return o.__absoluteGreater(i);
							if (k < m) return o.__absoluteLess(i);
						}
						if (0 !== r || 0 !== d) {
							if (0 === c) throw new Error("implementation bug");
							return o.__absoluteLess(i);
						}
						return 0;
					}
				},
				{
					key: "__equalToNumber",
					value: function(e, i) {
						return i | 0 === i ? 0 === i ? 0 === e.length : 1 === e.length && e.sign === 0 > i && e.__unsignedDigit(0) === t(i) : 0 === o.__compareToDouble(e, i);
					}
				},
				{
					key: "__comparisonResultToBool",
					value: function(e, t) {
						switch (t) {
							case 0: return 0 > e;
							case 1: return 0 >= e;
							case 2: return 0 < e;
							case 3: return 0 <= e;
						}
						throw new Error("unreachable");
					}
				},
				{
					key: "__compare",
					value: function(e, t, i) {
						if (e = o.__toPrimitive(e), t = o.__toPrimitive(t), "string" == typeof e && "string" == typeof t) switch (i) {
							case 0: return e < t;
							case 1: return e <= t;
							case 2: return e > t;
							case 3: return e >= t;
						}
						if (o.__isBigInt(e) && "string" == typeof t) return t = o.__fromString(t), null !== t && o.__comparisonResultToBool(o.__compareToBigInt(e, t), i);
						if ("string" == typeof e && o.__isBigInt(t)) return e = o.__fromString(e), null !== e && o.__comparisonResultToBool(o.__compareToBigInt(e, t), i);
						if (e = o.__toNumeric(e), t = o.__toNumeric(t), o.__isBigInt(e)) {
							if (o.__isBigInt(t)) return o.__comparisonResultToBool(o.__compareToBigInt(e, t), i);
							if ("number" != typeof t) throw new Error("implementation bug");
							return o.__comparisonResultToBool(o.__compareToNumber(e, t), i);
						}
						if ("number" != typeof e) throw new Error("implementation bug");
						if (o.__isBigInt(t)) return o.__comparisonResultToBool(o.__compareToNumber(t, e), 2 ^ i);
						if ("number" != typeof t) throw new Error("implementation bug");
						return 0 === i ? e < t : 1 === i ? e <= t : 2 === i ? e > t : 3 === i ? e >= t : void 0;
					}
				},
				{
					key: "__absoluteAdd",
					value: function(e, t, _) {
						if (e.length < t.length) return o.__absoluteAdd(t, e, _);
						if (0 === e.length) return e;
						if (0 === t.length) return e.sign === _ ? e : o.unaryMinus(e);
						var n = e.length;
						(0 === e.__clzmsd() || t.length === e.length && 0 === t.__clzmsd()) && n++;
						for (var l = new o(n, _), g = 0, a = 0; a < t.length; a++) {
							var u = t.__digit(a), s = e.__digit(a), r = (65535 & s) + (65535 & u) + g, d = (s >>> 16) + (u >>> 16) + (r >>> 16);
							g = d >>> 16, l.__setDigit(a, 65535 & r | d << 16);
						}
						for (; a < e.length; a++) {
							var h = e.__digit(a), b = (65535 & h) + g, m = (h >>> 16) + (b >>> 16);
							g = m >>> 16, l.__setDigit(a, 65535 & b | m << 16);
						}
						return a < l.length && l.__setDigit(a, g), l.__trim();
					}
				},
				{
					key: "__absoluteSub",
					value: function(e, t, _) {
						if (0 === e.length) return e;
						if (0 === t.length) return e.sign === _ ? e : o.unaryMinus(e);
						for (var n = new o(e.length, _), l = 0, g = 0; g < t.length; g++) {
							var a = e.__digit(g), u = t.__digit(g), s = (65535 & a) - (65535 & u) - l;
							l = 1 & s >>> 16;
							var r = (a >>> 16) - (u >>> 16) - l;
							l = 1 & r >>> 16, n.__setDigit(g, 65535 & s | r << 16);
						}
						for (; g < e.length; g++) {
							var d = e.__digit(g), h = (65535 & d) - l;
							l = 1 & h >>> 16;
							var b = (d >>> 16) - l;
							l = 1 & b >>> 16, n.__setDigit(g, 65535 & h | b << 16);
						}
						return n.__trim();
					}
				},
				{
					key: "__absoluteAddOne",
					value: function(e, t) {
						var _ = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, n = e.length;
						null === _ ? _ = new o(n, t) : _.sign = t;
						for (var l, g = !0, a = 0; a < n; a++) {
							if (l = e.__digit(a), g) {
								var u = -1 === l;
								l = 0 | l + 1, g = u;
							}
							_.__setDigit(a, l);
						}
						return g && _.__setDigitGrow(n, 1), _;
					}
				},
				{
					key: "__absoluteSubOne",
					value: function(e, t) {
						var _ = e.length;
						t = t || _;
						for (var n, l = new o(t, !1), g = !0, a = 0; a < _; a++) {
							if (n = e.__digit(a), g) {
								var u = 0 === n;
								n = 0 | n - 1, g = u;
							}
							l.__setDigit(a, n);
						}
						if (g) throw new Error("implementation bug");
						for (var s = _; s < t; s++) l.__setDigit(s, 0);
						return l;
					}
				},
				{
					key: "__absoluteAnd",
					value: function(e, t) {
						var _ = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, n = e.length, l = t.length, g = l;
						if (n < l) {
							g = n;
							var a = e, u = n;
							e = t, n = l, t = a, l = u;
						}
						var s = g;
						null === _ ? _ = new o(s, !1) : s = _.length;
						for (var r = 0; r < g; r++) _.__setDigit(r, e.__digit(r) & t.__digit(r));
						for (; r < s; r++) _.__setDigit(r, 0);
						return _;
					}
				},
				{
					key: "__absoluteAndNot",
					value: function(e, t) {
						var _ = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, n = e.length, l = t.length, g = l;
						n < l && (g = n);
						var a = n;
						null === _ ? _ = new o(a, !1) : a = _.length;
						for (var u = 0; u < g; u++) _.__setDigit(u, e.__digit(u) & ~t.__digit(u));
						for (; u < n; u++) _.__setDigit(u, e.__digit(u));
						for (; u < a; u++) _.__setDigit(u, 0);
						return _;
					}
				},
				{
					key: "__absoluteOr",
					value: function(e, t) {
						var _ = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, n = e.length, l = t.length, g = l;
						if (n < l) {
							g = n;
							var a = e, u = n;
							e = t, n = l, t = a, l = u;
						}
						var s = n;
						null === _ ? _ = new o(s, !1) : s = _.length;
						for (var r = 0; r < g; r++) _.__setDigit(r, e.__digit(r) | t.__digit(r));
						for (; r < n; r++) _.__setDigit(r, e.__digit(r));
						for (; r < s; r++) _.__setDigit(r, 0);
						return _;
					}
				},
				{
					key: "__absoluteXor",
					value: function(e, t) {
						var _ = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, n = e.length, l = t.length, g = l;
						if (n < l) {
							g = n;
							var a = e, u = n;
							e = t, n = l, t = a, l = u;
						}
						var s = n;
						null === _ ? _ = new o(s, !1) : s = _.length;
						for (var r = 0; r < g; r++) _.__setDigit(r, e.__digit(r) ^ t.__digit(r));
						for (; r < n; r++) _.__setDigit(r, e.__digit(r));
						for (; r < s; r++) _.__setDigit(r, 0);
						return _;
					}
				},
				{
					key: "__absoluteCompare",
					value: function(e, t) {
						var _ = e.length - t.length;
						if (0 != _) return _;
						for (var n = e.length - 1; 0 <= n && e.__digit(n) === t.__digit(n);) n--;
						return 0 > n ? 0 : e.__unsignedDigit(n) > t.__unsignedDigit(n) ? 1 : -1;
					}
				},
				{
					key: "__multiplyAccumulate",
					value: function(e, t, _, n) {
						if (0 !== t) {
							for (var l = 65535 & t, g = t >>> 16, a = 0, u = 0, s = 0, r = 0; r < e.length; r++, n++) {
								var d = _.__digit(n), h = 65535 & d, b = d >>> 16, m = e.__digit(r), c = 65535 & m, v = m >>> 16, f = o.__imul(c, l), y = o.__imul(c, g), k = o.__imul(v, l), D = o.__imul(v, g);
								h += u + (65535 & f), b += s + a + (h >>> 16) + (f >>> 16) + (65535 & y) + (65535 & k), a = b >>> 16, u = (y >>> 16) + (k >>> 16) + (65535 & D) + a, a = u >>> 16, u &= 65535, s = D >>> 16, d = 65535 & h | b << 16, _.__setDigit(n, d);
							}
							for (; 0 !== a || 0 !== u || 0 !== s; n++) {
								var p = _.__digit(n), B = (65535 & p) + u, S = (p >>> 16) + (B >>> 16) + s + a;
								u = 0, s = 0, a = S >>> 16, p = 65535 & B | S << 16, _.__setDigit(n, p);
							}
						}
					}
				},
				{
					key: "__internalMultiplyAdd",
					value: function(e, t, _, l, g) {
						for (var a = _, u = 0, s = 0; s < l; s++) {
							var r = e.__digit(s), d = o.__imul(65535 & r, t), h = (65535 & d) + u + a;
							a = h >>> 16;
							var b = o.__imul(r >>> 16, t), m = (65535 & b) + (d >>> 16) + a;
							a = m >>> 16, u = b >>> 16, g.__setDigit(s, m << 16 | 65535 & h);
						}
						if (g.length > l) for (g.__setDigit(l++, a + u); l < g.length;) g.__setDigit(l++, 0);
						else if (0 !== a + u) throw new Error("implementation bug");
					}
				},
				{
					key: "__absoluteDivSmall",
					value: function(e, t, _) {
						null === _ && (_ = new o(e.length, !1));
						for (var n = 0, l = 2 * e.length - 1; 0 <= l; l -= 2) {
							var g = (n << 16 | e.__halfDigit(l)) >>> 0, a = 0 | g / t;
							n = 0 | g % t, g = (n << 16 | e.__halfDigit(l - 1)) >>> 0;
							var u = 0 | g / t;
							n = 0 | g % t, _.__setDigit(l >>> 1, a << 16 | u);
						}
						return _;
					}
				},
				{
					key: "__absoluteModSmall",
					value: function(e, t) {
						for (var _, n = 0, l = 2 * e.length - 1; 0 <= l; l--) _ = (n << 16 | e.__halfDigit(l)) >>> 0, n = 0 | _ % t;
						return n;
					}
				},
				{
					key: "__absoluteDivLarge",
					value: function(e, t, i, _) {
						var l = t.__halfDigitLength(), n = t.length, g = e.__halfDigitLength() - l, a = null;
						i && (a = new o(g + 2 >>> 1, !1), a.__initializeDigits());
						var s = new o(l + 2 >>> 1, !1);
						s.__initializeDigits();
						var r = o.__clz16(t.__halfDigit(l - 1));
						0 < r && (t = o.__specialLeftShift(t, r, 0));
						for (var d = o.__specialLeftShift(e, r, 1), u = t.__halfDigit(l - 1), h = 0, b = g; 0 <= b; b--) {
							var m = 65535, v = d.__halfDigit(b + l);
							if (v !== u) {
								var f = (v << 16 | d.__halfDigit(b + l - 1)) >>> 0;
								m = 0 | f / u;
								for (var y = 0 | f % u, k = t.__halfDigit(l - 2), D = d.__halfDigit(b + l - 2); o.__imul(m, k) >>> 0 > (y << 16 | D) >>> 0 && (m--, y += u, !(65535 < y)););
							}
							o.__internalMultiplyAdd(t, m, 0, n, s);
							var p = d.__inplaceSub(s, b, l + 1);
							0 !== p && (p = d.__inplaceAdd(t, b, l), d.__setHalfDigit(b + l, d.__halfDigit(b + l) + p), m--), i && (1 & b ? h = m << 16 : a.__setDigit(b >>> 1, h | m));
						}
						return _ ? (d.__inplaceRightShift(r), i ? {
							quotient: a,
							remainder: d
						} : d) : i ? a : void 0;
					}
				},
				{
					key: "__clz16",
					value: function(e) {
						return o.__clz32(e) - 16;
					}
				},
				{
					key: "__specialLeftShift",
					value: function(e, t, _) {
						var l = e.length, n = new o(l + _, !1);
						if (0 === t) {
							for (var g = 0; g < l; g++) n.__setDigit(g, e.__digit(g));
							return 0 < _ && n.__setDigit(l, 0), n;
						}
						for (var a, u = 0, s = 0; s < l; s++) a = e.__digit(s), n.__setDigit(s, a << t | u), u = a >>> 32 - t;
						return 0 < _ && n.__setDigit(l, u), n;
					}
				},
				{
					key: "__leftShiftByAbsolute",
					value: function(e, t) {
						var _ = o.__toShiftAmount(t);
						if (0 > _) throw new RangeError("BigInt too big");
						var n = _ >>> 5, l = 31 & _, g = e.length, a = 0 !== l && 0 != e.__digit(g - 1) >>> 32 - l, u = g + n + (a ? 1 : 0), s = new o(u, e.sign);
						if (0 === l) {
							for (var r = 0; r < n; r++) s.__setDigit(r, 0);
							for (; r < u; r++) s.__setDigit(r, e.__digit(r - n));
						} else {
							for (var h = 0, b = 0; b < n; b++) s.__setDigit(b, 0);
							for (var m, c = 0; c < g; c++) m = e.__digit(c), s.__setDigit(c + n, m << l | h), h = m >>> 32 - l;
							if (a) s.__setDigit(g + n, h);
							else if (0 !== h) throw new Error("implementation bug");
						}
						return s.__trim();
					}
				},
				{
					key: "__rightShiftByAbsolute",
					value: function(e, t) {
						var _ = e.length, n = e.sign, l = o.__toShiftAmount(t);
						if (0 > l) return o.__rightShiftByMaximum(n);
						var g = l >>> 5, a = 31 & l, u = _ - g;
						if (0 >= u) return o.__rightShiftByMaximum(n);
						var s = !1;
						if (n) {
							if (0 != (e.__digit(g) & (1 << a) - 1)) s = !0;
							else for (var r = 0; r < g; r++) if (0 !== e.__digit(r)) {
								s = !0;
								break;
							}
						}
						if (s && 0 === a) 0 == ~e.__digit(_ - 1) && u++;
						var b = new o(u, n);
						if (0 === a) for (var m = g; m < _; m++) b.__setDigit(m - g, e.__digit(m));
						else {
							for (var c, v = e.__digit(g) >>> a, f = _ - g - 1, y = 0; y < f; y++) c = e.__digit(y + g + 1), b.__setDigit(y, c << 32 - a | v), v = c >>> a;
							b.__setDigit(f, v);
						}
						return s && (b = o.__absoluteAddOne(b, !0, b)), b.__trim();
					}
				},
				{
					key: "__rightShiftByMaximum",
					value: function(e) {
						return e ? o.__oneDigit(1, !0) : o.__zero();
					}
				},
				{
					key: "__toShiftAmount",
					value: function(e) {
						if (1 < e.length) return -1;
						var t = e.__unsignedDigit(0);
						return t > o.__kMaxLengthBits ? -1 : t;
					}
				},
				{
					key: "__toPrimitive",
					value: function(e) {
						var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "default";
						if ("object" !== i(e)) return e;
						if (e.constructor === o) return e;
						var _ = e[Symbol.toPrimitive];
						if (_) {
							var n = _(t);
							if ("object" !== i(n)) return n;
							throw new TypeError("Cannot convert object to primitive value");
						}
						var l = e.valueOf;
						if (l) {
							var g = l.call(e);
							if ("object" !== i(g)) return g;
						}
						var a = e.toString;
						if (a) {
							var u = a.call(e);
							if ("object" !== i(u)) return u;
						}
						throw new TypeError("Cannot convert object to primitive value");
					}
				},
				{
					key: "__toNumeric",
					value: function(e) {
						return o.__isBigInt(e) ? e : +e;
					}
				},
				{
					key: "__isBigInt",
					value: function(e) {
						return "object" === i(e) && null !== e && e.constructor === o;
					}
				},
				{
					key: "__truncateToNBits",
					value: function(e, t) {
						for (var _ = e + 31 >>> 5, n = new o(_, t.sign), l = _ - 1, g = 0; g < l; g++) n.__setDigit(g, t.__digit(g));
						var a = t.__digit(l);
						if (0 != (31 & e)) {
							var u = 32 - (31 & e);
							a = a << u >>> u;
						}
						return n.__setDigit(l, a), n.__trim();
					}
				},
				{
					key: "__truncateAndSubFromPowerOfTwo",
					value: function(e, t, _) {
						for (var n = Math.min, l = e + 31 >>> 5, g = new o(l, _), a = 0, u = l - 1, s = 0, r = n(u, t.length); a < r; a++) {
							var d = t.__digit(a), h = 0 - (65535 & d) - s;
							s = 1 & h >>> 16;
							var b = 0 - (d >>> 16) - s;
							s = 1 & b >>> 16, g.__setDigit(a, 65535 & h | b << 16);
						}
						for (; a < u; a++) g.__setDigit(a, 0 | -s);
						var m, c = u < t.length ? t.__digit(u) : 0, v = 31 & e;
						if (0 === v) {
							var f = 0 - (65535 & c) - s;
							s = 1 & f >>> 16;
							var y = 0 - (c >>> 16) - s;
							m = 65535 & f | y << 16;
						} else {
							var k = 32 - v;
							c = c << k >>> k;
							var D = 1 << 32 - k, p = (65535 & D) - (65535 & c) - s;
							s = 1 & p >>> 16;
							var B = (D >>> 16) - (c >>> 16) - s;
							m = 65535 & p | B << 16, m &= D - 1;
						}
						return g.__setDigit(u, m), g.__trim();
					}
				},
				{
					key: "__digitPow",
					value: function(e, t) {
						for (var i = 1; 0 < t;) 1 & t && (i *= e), t >>>= 1, e *= e;
						return i;
					}
				}
			]), o;
		}(h(Array));
		return k.__kMaxLength = 33554432, k.__kMaxLengthBits = k.__kMaxLength << 5, k.__kMaxBitsPerChar = [
			0,
			0,
			32,
			51,
			64,
			75,
			83,
			90,
			96,
			102,
			107,
			111,
			115,
			119,
			122,
			126,
			128,
			131,
			134,
			136,
			139,
			141,
			143,
			145,
			147,
			149,
			151,
			153,
			154,
			156,
			158,
			159,
			160,
			162,
			163,
			165,
			166
		], k.__kBitsPerCharTableShift = 5, k.__kBitsPerCharTableMultiplier = 1 << k.__kBitsPerCharTableShift, k.__kConversionChars = [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z"
		], k.__kBitConversionBuffer = /* @__PURE__ */ new ArrayBuffer(8), k.__kBitConversionDouble = new Float64Array(k.__kBitConversionBuffer), k.__kBitConversionInts = new Int32Array(k.__kBitConversionBuffer), k.__clz32 = t || function(e) {
			var t = Math.LN2, i = Math.log;
			return 0 === e ? 32 : 0 | 31 - (0 | i(e >>> 0) / t);
		}, k.__imul = e || function(e, t) {
			return 0 | e * t;
		}, k;
	});
})))());
var __spreadArrays$4 = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var MAX_UINT64 = 0x10000000000000000;
var rotl = function(x, k) {
	return import_jsbi_umd.default.bitwiseXor(import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.leftShift(x, import_jsbi_umd.default.BigInt(k))), import_jsbi_umd.default.BigInt(import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.signedRightShift(x, import_jsbi_umd.default.subtract(import_jsbi_umd.default.BigInt(64), import_jsbi_umd.default.BigInt(k))))));
};
var Xoshiro = function() {
	function Xoshiro(seed) {
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
		this.s = [
			import_jsbi_umd.default.BigInt(0),
			import_jsbi_umd.default.BigInt(0),
			import_jsbi_umd.default.BigInt(0),
			import_jsbi_umd.default.BigInt(0)
		];
		this.setS(digest);
	}
	Xoshiro.prototype.setS = function(digest) {
		for (var i = 0; i < 4; i++) {
			var o = i * 8;
			var v = import_jsbi_umd.default.BigInt(0);
			for (var n = 0; n < 8; n++) {
				v = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.leftShift(v, import_jsbi_umd.default.BigInt(8)));
				v = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseOr(v, import_jsbi_umd.default.BigInt(digest[o + n])));
			}
			this.s[i] = import_jsbi_umd.default.asUintN(64, v);
		}
	};
	Xoshiro.prototype.roll = function() {
		var result = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.multiply(rotl(import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.multiply(this.s[1], import_jsbi_umd.default.BigInt(5))), 7), import_jsbi_umd.default.BigInt(9)));
		var t = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.leftShift(this.s[1], import_jsbi_umd.default.BigInt(17)));
		this.s[2] = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseXor(this.s[2], import_jsbi_umd.default.BigInt(this.s[0])));
		this.s[3] = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseXor(this.s[3], import_jsbi_umd.default.BigInt(this.s[1])));
		this.s[1] = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseXor(this.s[1], import_jsbi_umd.default.BigInt(this.s[2])));
		this.s[0] = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseXor(this.s[0], import_jsbi_umd.default.BigInt(this.s[3])));
		this.s[2] = import_jsbi_umd.default.asUintN(64, import_jsbi_umd.default.bitwiseXor(this.s[2], import_jsbi_umd.default.BigInt(t)));
		this.s[3] = import_jsbi_umd.default.asUintN(64, rotl(this.s[3], 45));
		return result;
	};
	return Xoshiro;
}();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/fountainUtils.js
var import_alias_sampling = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Library for sampling of random values from a discrete probability distribution, 
	* using the Walker-Vose alias method.
	*
	* Creates a new Sample instance for the given probabilities and outcomes.
	*
	* @param {Array} the probabilities.
	* @param {Array} the outcomes. Index is assumed as outcome if not provided.
	*/
	function Sample(probabilities, outcomes, rng) {
		"use strict";
		this.alias = [];
		this.prob = [];
		this.outcomes = outcomes || this.indexedOutcomes(probabilities.length);
		this.rng = rng || Math.random;
		this.precomputeAlias(probabilities);
	}
	/**
	* Samples outcomes from the underlying probability distribution.
	*
	* @param {int} the number of samples. Optional parameter, defaults to 1.
	* @return {Object} a random outcome according to the underlying probability distribution 
	*                  and the requested number of samples. If the requested number of samples 
	*                  is greater than 1 this method returns an array.
	*/
	Sample.prototype.next = function(numOfSamples) {
		"use strict";
		var n = numOfSamples || 1, out = [], i = 0;
		do {
			var c = Math.floor(this.rng() * this.prob.length);
			out[i] = this.outcomes[this.rng() < this.prob[c] ? c : this.alias[c]];
		} while (++i < n);
		return n > 1 ? out : out[0];
	};
	/**
	* Ported from ransampl.c
	* Scientific Computing Group of JCNS at MLZ Garching.
	* http://apps.jcns.fz-juelich.de/doku/sc/ransampl
	*/
	Sample.prototype.precomputeAlias = function(p) {
		"use strict";
		var n = p.length, sum = 0, nS = 0, nL = 0, P = [], S = [], L = [], g, i, a;
		for (i = 0; i < n; ++i) {
			if (p[i] < 0) throw "Probability must be a positive: p[" + i + "]=" + p[i];
			sum += p[i];
		}
		if (sum === 0) throw "Probability cannot be zero.";
		for (i = 0; i < n; ++i) P[i] = p[i] * n / sum;
		for (i = n - 1; i >= 0; --i) if (P[i] < 1) S[nS++] = i;
		else L[nL++] = i;
		while (nS && nL) {
			a = S[--nS];
			g = L[--nL];
			this.prob[a] = P[a];
			this.alias[a] = g;
			P[g] = P[g] + P[a] - 1;
			if (P[g] < 1) S[nS++] = g;
			else L[nL++] = g;
		}
		while (nL) this.prob[L[--nL]] = 1;
		while (nS) this.prob[S[--nS]] = 1;
	};
	Sample.prototype.indexedOutcomes = function(n) {
		"use strict";
		var o = [];
		for (var i = 0; i < n; i++) o[i] = i;
		return o;
	};
	Sample.prototype.randomInt = function(min, max) {
		"use strict";
		return Math.floor(this.rng() * (max - min)) + min;
	};
	module.exports = function(probabilities, outcomes, rng) {
		"use strict";
		return new Sample(probabilities, outcomes, rng);
	};
})))());
var __spreadArrays$3 = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var chooseDegree = function(seqLenth, rng) {
	return (0, import_alias_sampling.default)(__spreadArrays$3(new Array(seqLenth)).map(function(_, index) {
		return 1 / (index + 1);
	}), null, rng.nextDouble).next() + 1;
};
var shuffle = function(items, rng) {
	var remaining = __spreadArrays$3(items);
	var result = [];
	while (remaining.length > 0) {
		var index = rng.nextInt(0, remaining.length - 1);
		var item = remaining[index];
		remaining.splice(index, 1);
		result.push(item);
	}
	return result;
};
var chooseFragments = function(seqNum, seqLength, checksum) {
	if (seqNum <= seqLength) return [seqNum - 1];
	else {
		var rng = new Xoshiro(import_buffer.Buffer.concat([intToBytes(seqNum), intToBytes(checksum)]));
		var degree = chooseDegree(seqLength, rng);
		return shuffle(__spreadArrays$3(new Array(seqLength)).map(function(_, index) {
			return index;
		}), rng).slice(0, degree);
	}
};
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/fountainEncoder.js
var FountainEncoderPart = function() {
	function FountainEncoderPart(_seqNum, _seqLength, _messageLength, _checksum, _fragment) {
		this._seqNum = _seqNum;
		this._seqLength = _seqLength;
		this._messageLength = _messageLength;
		this._checksum = _checksum;
		this._fragment = _fragment;
	}
	Object.defineProperty(FountainEncoderPart.prototype, "messageLength", {
		get: function() {
			return this._messageLength;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoderPart.prototype, "fragment", {
		get: function() {
			return this._fragment;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoderPart.prototype, "seqNum", {
		get: function() {
			return this._seqNum;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoderPart.prototype, "seqLength", {
		get: function() {
			return this._seqLength;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoderPart.prototype, "checksum", {
		get: function() {
			return this._checksum;
		},
		enumerable: false,
		configurable: true
	});
	FountainEncoderPart.prototype.cbor = function() {
		var result = cborEncode([
			this._seqNum,
			this._seqLength,
			this._messageLength,
			this._checksum,
			this._fragment
		]);
		return import_buffer.Buffer.from(result);
	};
	FountainEncoderPart.prototype.description = function() {
		return "seqNum:" + this._seqNum + ", seqLen:" + this._seqLength + ", messageLen:" + this._messageLength + ", checksum:" + this._checksum + ", data:" + this._fragment.toString("hex");
	};
	FountainEncoderPart.fromCBOR = function(cborPayload) {
		var _a = cborDecode(cborPayload), seqNum = _a[0], seqLength = _a[1], messageLength = _a[2], checksum = _a[3], fragment = _a[4];
		if (typeof seqNum !== "number" || typeof seqLength !== "number" || typeof messageLength !== "number" || typeof checksum !== "number" || import_buffer.Buffer.isBuffer(fragment) && fragment.length <= 0) throw new Error("type error");
		return new FountainEncoderPart(seqNum, seqLength, messageLength, checksum, import_buffer.Buffer.from(fragment));
	};
	return FountainEncoderPart;
}();
var FountainEncoder = function() {
	function FountainEncoder(message, maxFragmentLength, firstSeqNum, minFragmentLength) {
		if (maxFragmentLength === void 0) maxFragmentLength = 100;
		if (firstSeqNum === void 0) firstSeqNum = 0;
		if (minFragmentLength === void 0) minFragmentLength = 10;
		var fragmentLength = FountainEncoder.findNominalFragmentLength(message.length, minFragmentLength, maxFragmentLength);
		this._messageLength = message.length;
		this._fragments = FountainEncoder.partitionMessage(message, fragmentLength);
		this.fragmentLength = fragmentLength;
		this.seqNum = toUint32(firstSeqNum);
		this.checksum = getCRC(message);
	}
	Object.defineProperty(FountainEncoder.prototype, "fragmentsLength", {
		get: function() {
			return this._fragments.length;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoder.prototype, "fragments", {
		get: function() {
			return this._fragments;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainEncoder.prototype, "messageLength", {
		get: function() {
			return this._messageLength;
		},
		enumerable: false,
		configurable: true
	});
	FountainEncoder.prototype.isComplete = function() {
		return this.seqNum >= this._fragments.length;
	};
	FountainEncoder.prototype.isSinglePart = function() {
		return this._fragments.length === 1;
	};
	FountainEncoder.prototype.seqLength = function() {
		return this._fragments.length;
	};
	FountainEncoder.prototype.mix = function(indexes) {
		var _this = this;
		return indexes.reduce(function(result, index) {
			return bufferXOR(_this._fragments[index], result);
		}, import_buffer.Buffer.alloc(this.fragmentLength, 0));
	};
	FountainEncoder.prototype.nextPart = function() {
		this.seqNum = toUint32(this.seqNum + 1);
		var indexes = chooseFragments(this.seqNum, this._fragments.length, this.checksum);
		var mixed = this.mix(indexes);
		return new FountainEncoderPart(this.seqNum, this._fragments.length, this._messageLength, this.checksum, mixed);
	};
	FountainEncoder.findNominalFragmentLength = function(messageLength, minFragmentLength, maxFragmentLength) {
		if (messageLength <= 0 || minFragmentLength <= 0 || maxFragmentLength < minFragmentLength) throw new Error("invalid fragment or message length");
		var maxFragmentCount = Math.ceil(messageLength / minFragmentLength);
		var fragmentLength = 0;
		for (var fragmentCount = 1; fragmentCount <= maxFragmentCount; fragmentCount++) {
			fragmentLength = Math.ceil(messageLength / fragmentCount);
			if (fragmentLength <= maxFragmentLength) break;
		}
		return fragmentLength;
	};
	FountainEncoder.partitionMessage = function(message, fragmentLength) {
		var _a;
		var remaining = import_buffer.Buffer.from(message);
		var fragment;
		var _fragments = [];
		while (remaining.length > 0) {
			_a = split(remaining, -fragmentLength), fragment = _a[0], remaining = _a[1];
			fragment = import_buffer.Buffer.alloc(fragmentLength, 0).fill(fragment, 0, fragment.length);
			_fragments.push(fragment);
		}
		return _fragments;
	};
	return FountainEncoder;
}();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/bytewords.js
var __spreadArrays$2 = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var bytewords = "ableacidalsoapexaquaarchatomauntawayaxisbackbaldbarnbeltbetabiasbluebodybragbrewbulbbuzzcalmcashcatschefcityclawcodecolacookcostcruxcurlcuspcyandarkdatadaysdelidicedietdoordowndrawdropdrumdulldutyeacheasyechoedgeepicevenexamexiteyesfactfairfernfigsfilmfishfizzflapflewfluxfoxyfreefrogfuelfundgalagamegeargemsgiftgirlglowgoodgraygrimgurugushgyrohalfhanghardhawkheathelphighhillholyhopehornhutsicedideaidleinchinkyintoirisironitemjadejazzjoinjoltjowljudojugsjumpjunkjurykeepkenokeptkeyskickkilnkingkitekiwiknoblamblavalazyleaflegsliarlimplionlistlogoloudloveluaulucklungmainmanymathmazememomenumeowmildmintmissmonknailnavyneednewsnextnoonnotenumbobeyoboeomitonyxopenovalowlspaidpartpeckplaypluspoempoolposepuffpumapurrquadquizraceramprealredorichroadrockroofrubyruinrunsrustsafesagascarsetssilkskewslotsoapsolosongstubsurfswantacotasktaxitenttiedtimetinytoiltombtoystriptunatwinuglyundouniturgeuservastveryvetovialvibeviewvisavoidvowswallwandwarmwaspwavewaxywebswhatwhenwhizwolfworkyankyawnyellyogayurtzapszerozestzinczonezoom";
var bytewordsLookUpTable = [];
var BYTEWORDS_NUM = 256;
var BYTEWORD_LENGTH = 4;
var MINIMAL_BYTEWORD_LENGTH = 2;
var STYLES;
(function(STYLES) {
	STYLES["STANDARD"] = "standard";
	STYLES["URI"] = "uri";
	STYLES["MINIMAL"] = "minimal";
})(STYLES || (STYLES = {}));
var getWord = function(index) {
	return bytewords.slice(index * BYTEWORD_LENGTH, index * BYTEWORD_LENGTH + BYTEWORD_LENGTH);
};
var getMinimalWord = function(index) {
	var byteword = getWord(index);
	return "" + byteword[0] + byteword[BYTEWORD_LENGTH - 1];
};
var addCRC = function(string) {
	var crc = getCRCHex(import_buffer.Buffer.from(string, "hex"));
	return "" + string + crc;
};
var encodeWithSeparator = function(word, separator) {
	var crcAppendedWord = addCRC(word);
	return import_buffer.Buffer.from(crcAppendedWord, "hex").reduce(function(result, w) {
		return __spreadArrays$2(result, [getWord(w)]);
	}, []).join(separator);
};
var encodeMinimal = function(word) {
	var crcAppendedWord = addCRC(word);
	return import_buffer.Buffer.from(crcAppendedWord, "hex").reduce(function(result, w) {
		return result + getMinimalWord(w);
	}, "");
};
var decodeWord = function(word, wordLength) {
	if (word.length !== wordLength) throw new Error("'Invalid Bytewords: word.length does not match wordLength provided'");
	var dim = 26;
	if (bytewordsLookUpTable.length === 0) {
		var array_len = dim * dim;
		bytewordsLookUpTable = __spreadArrays$2(new Array(array_len)).map(function() {
			return -1;
		});
		for (var i = 0; i < BYTEWORDS_NUM; i++) {
			var byteword = getWord(i);
			var x_1 = byteword[0].charCodeAt(0) - "a".charCodeAt(0);
			var offset_1 = (byteword[3].charCodeAt(0) - "a".charCodeAt(0)) * dim + x_1;
			bytewordsLookUpTable[offset_1] = i;
		}
	}
	var x = word[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
	var y = word[wordLength == 4 ? 3 : 1].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
	if (!(0 <= x && x < dim && 0 <= y && y < dim)) throw new Error("Invalid Bytewords: invalid word");
	var offset = y * dim + x;
	var value = bytewordsLookUpTable[offset];
	if (value === -1) throw new Error("Invalid Bytewords: value not in lookup table");
	if (wordLength == BYTEWORD_LENGTH) {
		var byteword = getWord(value);
		var c1 = word[1].toLowerCase();
		var c2 = word[2].toLowerCase();
		if (!(c1 === byteword[1] && c2 === byteword[2])) throw new Error("Invalid Bytewords: invalid middle letters of word");
	}
	return import_buffer.Buffer.from([value]).toString("hex");
};
var _decode = function(string, separator, wordLength) {
	var decodedString = (wordLength == BYTEWORD_LENGTH ? string.split(separator) : partition(string, 2)).map(function(word) {
		return decodeWord(word, wordLength);
	}).join("");
	if (decodedString.length < 5) throw new Error("Invalid Bytewords: invalid decoded string length");
	var _a = split(import_buffer.Buffer.from(decodedString, "hex"), 4), body = _a[0], bodyChecksum = _a[1];
	if (getCRCHex(body) !== bodyChecksum.toString("hex")) throw new Error("Invalid Checksum");
	return body.toString("hex");
};
var decode = function(string, style) {
	if (style === void 0) style = STYLES.MINIMAL;
	switch (style) {
		case STYLES.STANDARD: return _decode(string, " ", BYTEWORD_LENGTH);
		case STYLES.URI: return _decode(string, "-", BYTEWORD_LENGTH);
		case STYLES.MINIMAL: return _decode(string, "", MINIMAL_BYTEWORD_LENGTH);
		default: throw new Error("Invalid style " + style);
	}
};
var encode$1 = function(string, style) {
	if (style === void 0) style = STYLES.MINIMAL;
	switch (style) {
		case STYLES.STANDARD: return encodeWithSeparator(string, " ");
		case STYLES.URI: return encodeWithSeparator(string, "-");
		case STYLES.MINIMAL: return encodeMinimal(string);
		default: throw new Error("Invalid style " + style);
	}
};
var bytewords_default = {
	decode,
	encode: encode$1,
	STYLES
};
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/urEncoder.js
var __spreadArrays$1 = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var UREncoder = function() {
	function UREncoder(_ur, maxFragmentLength, firstSeqNum, minFragmentLength) {
		this.ur = _ur;
		this.fountainEncoder = new FountainEncoder(_ur.cbor, maxFragmentLength, firstSeqNum, minFragmentLength);
	}
	Object.defineProperty(UREncoder.prototype, "fragmentsLength", {
		get: function() {
			return this.fountainEncoder.fragmentsLength;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(UREncoder.prototype, "fragments", {
		get: function() {
			return this.fountainEncoder.fragments;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(UREncoder.prototype, "messageLength", {
		get: function() {
			return this.fountainEncoder.messageLength;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(UREncoder.prototype, "cbor", {
		get: function() {
			return this.ur.cbor;
		},
		enumerable: false,
		configurable: true
	});
	UREncoder.prototype.encodeWhole = function() {
		var _this = this;
		return __spreadArrays$1(new Array(this.fragmentsLength)).map(function() {
			return _this.nextPart();
		});
	};
	UREncoder.prototype.nextPart = function() {
		var part = this.fountainEncoder.nextPart();
		if (this.fountainEncoder.isSinglePart()) return UREncoder.encodeSinglePart(this.ur);
		else return UREncoder.encodePart(this.ur.type, part);
	};
	UREncoder.encodeUri = function(scheme, pathComponents) {
		return [scheme, pathComponents.join("/")].join(":");
	};
	UREncoder.encodeUR = function(pathComponents) {
		return UREncoder.encodeUri("ur", pathComponents);
	};
	UREncoder.encodePart = function(type, part) {
		var seq = part.seqNum + "-" + part.seqLength;
		var body = bytewords_default.encode(part.cbor().toString("hex"), bytewords_default.STYLES.MINIMAL);
		return UREncoder.encodeUR([
			type,
			seq,
			body
		]);
	};
	UREncoder.encodeSinglePart = function(ur) {
		var body = bytewords_default.encode(ur.cbor.toString("hex"), bytewords_default.STYLES.MINIMAL);
		return UREncoder.encodeUR([ur.type, body]);
	};
	return UREncoder;
}();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/fountainDecoder.js
var __spreadArrays = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var FountainDecoderPart = function() {
	function FountainDecoderPart(_indexes, _fragment) {
		this._indexes = _indexes;
		this._fragment = _fragment;
	}
	Object.defineProperty(FountainDecoderPart.prototype, "indexes", {
		get: function() {
			return this._indexes;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(FountainDecoderPart.prototype, "fragment", {
		get: function() {
			return this._fragment;
		},
		enumerable: false,
		configurable: true
	});
	FountainDecoderPart.fromEncoderPart = function(encoderPart) {
		var indexes = chooseFragments(encoderPart.seqNum, encoderPart.seqLength, encoderPart.checksum);
		var fragment = encoderPart.fragment;
		return new FountainDecoderPart(indexes, fragment);
	};
	FountainDecoderPart.prototype.isSimple = function() {
		return this.indexes.length === 1;
	};
	return FountainDecoderPart;
}();
var FountainDecoder = function() {
	function FountainDecoder() {
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
	FountainDecoder.prototype.validatePart = function(part) {
		var _this = this;
		if (this.expectedPartIndexes.length === 0) {
			__spreadArrays(new Array(part.seqLength)).forEach(function(_, index) {
				return _this.expectedPartIndexes.push(index);
			});
			this.expectedMessageLength = part.messageLength;
			this.expectedChecksum = part.checksum;
			this.expectedFragmentLength = part.fragment.length;
		} else {
			if (this.expectedPartIndexes.length !== part.seqLength) return false;
			if (this.expectedMessageLength !== part.messageLength) return false;
			if (this.expectedChecksum !== part.checksum) return false;
			if (this.expectedFragmentLength !== part.fragment.length) return false;
		}
		return true;
	};
	FountainDecoder.prototype.reducePartByPart = function(a, b) {
		if (arrayContains(a.indexes, b.indexes)) return new FountainDecoderPart(setDifference(a.indexes, b.indexes), bufferXOR(a.fragment, b.fragment));
		else return a;
	};
	FountainDecoder.prototype.reduceMixedBy = function(part) {
		var _this = this;
		var newMixed = [];
		this.mixedParts.map(function(_a) {
			var mixedPart = _a.value;
			return _this.reducePartByPart(mixedPart, part);
		}).forEach(function(reducedPart) {
			if (reducedPart.isSimple()) _this.queuedParts.push(reducedPart);
			else newMixed.push({
				key: reducedPart.indexes,
				value: reducedPart
			});
		});
		this.mixedParts = newMixed;
	};
	FountainDecoder.prototype.processSimplePart = function(part) {
		var fragmentIndex = part.indexes[0];
		if (this.receivedPartIndexes.includes(fragmentIndex)) return;
		this.simpleParts.push({
			key: part.indexes,
			value: part
		});
		this.receivedPartIndexes.push(fragmentIndex);
		if (arraysEqual(this.receivedPartIndexes, this.expectedPartIndexes)) {
			var sortedParts = this.simpleParts.map(function(_a) {
				return _a.value;
			}).sort(function(a, b) {
				return a.indexes[0] - b.indexes[0];
			});
			var message = FountainDecoder.joinFragments(sortedParts.map(function(part) {
				return part.fragment;
			}), this.expectedMessageLength);
			if (getCRC(message) === this.expectedChecksum) this.result = message;
			else this.error = new InvalidChecksumError();
		} else this.reduceMixedBy(part);
	};
	FountainDecoder.prototype.processMixedPart = function(part) {
		var _this = this;
		if (this.mixedParts.some(function(_a) {
			var indexes = _a.key;
			return arraysEqual(indexes, part.indexes);
		})) return;
		var p2 = this.simpleParts.reduce(function(acc, _a) {
			var p = _a.value;
			return _this.reducePartByPart(acc, p);
		}, part);
		p2 = this.mixedParts.reduce(function(acc, _a) {
			var p = _a.value;
			return _this.reducePartByPart(acc, p);
		}, p2);
		if (p2.isSimple()) this.queuedParts.push(p2);
		else {
			this.reduceMixedBy(p2);
			this.mixedParts.push({
				key: p2.indexes,
				value: p2
			});
		}
	};
	FountainDecoder.prototype.processQueuedItem = function() {
		if (this.queuedParts.length === 0) return;
		var part = this.queuedParts.shift();
		if (part.isSimple()) this.processSimplePart(part);
		else this.processMixedPart(part);
	};
	FountainDecoder.prototype.receivePart = function(encoderPart) {
		if (this.isComplete()) return false;
		if (!this.validatePart(encoderPart)) return false;
		var decoderPart = FountainDecoderPart.fromEncoderPart(encoderPart);
		this.lastPartIndexes = decoderPart.indexes;
		this.queuedParts.push(decoderPart);
		while (!this.isComplete() && this.queuedParts.length > 0) this.processQueuedItem();
		this.processedPartsCount += 1;
		return true;
	};
	FountainDecoder.prototype.isComplete = function() {
		return Boolean(this.result !== void 0 && this.result.length > 0);
	};
	FountainDecoder.prototype.isSuccess = function() {
		return Boolean(this.error === void 0 && this.isComplete());
	};
	FountainDecoder.prototype.resultMessage = function() {
		return this.isSuccess() ? this.result : import_buffer.Buffer.from([]);
	};
	FountainDecoder.prototype.isFailure = function() {
		return this.error !== void 0;
	};
	FountainDecoder.prototype.resultError = function() {
		return this.error ? this.error.message : "";
	};
	FountainDecoder.prototype.expectedPartCount = function() {
		return this.expectedPartIndexes.length;
	};
	FountainDecoder.prototype.getExpectedPartIndexes = function() {
		return __spreadArrays(this.expectedPartIndexes);
	};
	FountainDecoder.prototype.getReceivedPartIndexes = function() {
		return __spreadArrays(this.receivedPartIndexes);
	};
	FountainDecoder.prototype.getLastPartIndexes = function() {
		return __spreadArrays(this.lastPartIndexes);
	};
	FountainDecoder.prototype.estimatedPercentComplete = function() {
		if (this.isComplete()) return 1;
		var expectedPartCount = this.expectedPartCount();
		if (expectedPartCount === 0) return 0;
		return Math.min(.99, this.processedPartsCount / (expectedPartCount * 1.75));
	};
	FountainDecoder.prototype.getProgress = function() {
		if (this.isComplete()) return 1;
		var expectedPartCount = this.expectedPartCount();
		if (expectedPartCount === 0) return 0;
		return this.receivedPartIndexes.length / expectedPartCount;
	};
	FountainDecoder.joinFragments = function(fragments, messageLength) {
		return import_buffer.Buffer.concat(fragments).slice(0, messageLength);
	};
	return FountainDecoder;
}();
//#endregion
//#region node_modules/.pnpm/@gandlaf21+bc-ur@1.1.12/node_modules/@gandlaf21/bc-ur/dist/lib/es6/urDecoder.js
var URDecoder = function() {
	function URDecoder(fountainDecoder, type) {
		if (fountainDecoder === void 0) fountainDecoder = new FountainDecoder();
		if (type === void 0) type = "bytes";
		this.fountainDecoder = fountainDecoder;
		this.type = type;
		if (!isURType(type)) throw new Error("Invalid UR type");
		this.expected_type = "";
	}
	URDecoder.decodeBody = function(type, message) {
		var cbor = bytewords_default.decode(message, bytewords_default.STYLES.MINIMAL);
		return new UR(import_buffer.Buffer.from(cbor, "hex"), type);
	};
	URDecoder.prototype.validatePart = function(type) {
		if (this.expected_type) return this.expected_type === type;
		if (!isURType(type)) return false;
		this.expected_type = type;
		return true;
	};
	URDecoder.decode = function(message) {
		var _a = this.parse(message), type = _a[0], components = _a[1];
		if (components.length === 0) throw new InvalidPathLengthError();
		var body = components[0];
		return URDecoder.decodeBody(type, body);
	};
	URDecoder.parse = function(message) {
		var lowercase = message.toLowerCase();
		if (lowercase.slice(0, 3) !== "ur:") throw new InvalidSchemeError();
		var components = lowercase.slice(3).split("/");
		var type = components[0];
		if (components.length < 2) throw new InvalidPathLengthError();
		if (!isURType(type)) throw new InvalidTypeError();
		return [type, components.slice(1)];
	};
	URDecoder.parseSequenceComponent = function(s) {
		var components = s.split("-");
		if (components.length !== 2) throw new InvalidSequenceComponentError();
		var seqNum = toUint32(Number(components[0]));
		var seqLength = Number(components[1]);
		if (seqNum < 1 || seqLength < 1) throw new InvalidSequenceComponentError();
		return [seqNum, seqLength];
	};
	URDecoder.prototype.receivePart = function(s) {
		if (this.result !== void 0) return false;
		var _a = URDecoder.parse(s), type = _a[0], components = _a[1];
		if (!this.validatePart(type)) return false;
		if (components.length === 1) {
			this.result = URDecoder.decodeBody(type, components[0]);
			return true;
		}
		if (components.length !== 2) throw new InvalidPathLengthError();
		var seq = components[0], fragment = components[1];
		var _b = URDecoder.parseSequenceComponent(seq), seqNum = _b[0], seqLength = _b[1];
		var cbor = bytewords_default.decode(fragment, bytewords_default.STYLES.MINIMAL);
		var part = FountainEncoderPart.fromCBOR(cbor);
		if (seqNum !== part.seqNum || seqLength !== part.seqLength) return false;
		if (!this.fountainDecoder.receivePart(part)) return false;
		if (this.fountainDecoder.isSuccess()) this.result = new UR(this.fountainDecoder.resultMessage(), type);
		else if (this.fountainDecoder.isFailure()) this.error = new InvalidSchemeError();
		return true;
	};
	URDecoder.prototype.resultUR = function() {
		return this.result ? this.result : new UR(import_buffer.Buffer.from([]));
	};
	URDecoder.prototype.isComplete = function() {
		return this.result && this.result.cbor.length > 0 ? true : false;
	};
	URDecoder.prototype.isSuccess = function() {
		return !this.error && this.isComplete();
	};
	URDecoder.prototype.isError = function() {
		return this.error !== void 0;
	};
	URDecoder.prototype.resultError = function() {
		return this.error ? this.error.message : "";
	};
	URDecoder.prototype.expectedPartCount = function() {
		return this.fountainDecoder.expectedPartCount();
	};
	URDecoder.prototype.expectedPartIndexes = function() {
		return this.fountainDecoder.getExpectedPartIndexes();
	};
	URDecoder.prototype.receivedPartIndexes = function() {
		return this.fountainDecoder.getReceivedPartIndexes();
	};
	URDecoder.prototype.lastPartIndexes = function() {
		return this.fountainDecoder.getLastPartIndexes();
	};
	URDecoder.prototype.estimatedPercentComplete = function() {
		return this.fountainDecoder.estimatedPercentComplete();
	};
	URDecoder.prototype.getProgress = function() {
		return this.fountainDecoder.getProgress();
	};
	return URDecoder;
}();
//#endregion
//#region node_modules/.pnpm/qrcode-generator@2.0.4/node_modules/qrcode-generator/dist/qrcode.mjs
/**
* qrcode
* @param typeNumber 1 to 40
* @param errorCorrectionLevel 'L','M','Q','H'
*/
var qrcode = function(typeNumber, errorCorrectionLevel) {
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
		_modules = function(moduleCount) {
			const modules = new Array(moduleCount);
			for (let row = 0; row < moduleCount; row += 1) {
				modules[row] = new Array(moduleCount);
				for (let col = 0; col < moduleCount; col += 1) modules[row][col] = null;
			}
			return modules;
		}(_moduleCount);
		setupPositionProbePattern(0, 0);
		setupPositionProbePattern(_moduleCount - 7, 0);
		setupPositionProbePattern(0, _moduleCount - 7);
		setupPositionAdjustPattern();
		setupTimingPattern();
		setupTypeInfo(test, maskPattern);
		if (_typeNumber >= 7) setupTypeNumber(test);
		if (_dataCache == null) _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
		mapData(_dataCache, maskPattern);
	};
	const setupPositionProbePattern = function(row, col) {
		for (let r = -1; r <= 7; r += 1) {
			if (row + r <= -1 || _moduleCount <= row + r) continue;
			for (let c = -1; c <= 7; c += 1) {
				if (col + c <= -1 || _moduleCount <= col + c) continue;
				if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) _modules[row + r][col + c] = true;
				else _modules[row + r][col + c] = false;
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
			if (_modules[r][6] != null) continue;
			_modules[r][6] = r % 2 == 0;
		}
		for (let c = 8; c < _moduleCount - 8; c += 1) {
			if (_modules[6][c] != null) continue;
			_modules[6][c] = c % 2 == 0;
		}
	};
	const setupPositionAdjustPattern = function() {
		const pos = QRUtil.getPatternPosition(_typeNumber);
		for (let i = 0; i < pos.length; i += 1) for (let j = 0; j < pos.length; j += 1) {
			const row = pos[i];
			const col = pos[j];
			if (_modules[row][col] != null) continue;
			for (let r = -2; r <= 2; r += 1) for (let c = -2; c <= 2; c += 1) if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) _modules[row + r][col + c] = true;
			else _modules[row + r][col + c] = false;
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
			if (i < 6) _modules[i][8] = mod;
			else if (i < 8) _modules[i + 1][8] = mod;
			else _modules[_moduleCount - 15 + i][8] = mod;
		}
		for (let i = 0; i < 15; i += 1) {
			const mod = !test && (bits >> i & 1) == 1;
			if (i < 8) _modules[8][_moduleCount - i - 1] = mod;
			else if (i < 9) _modules[8][15 - i - 1 + 1] = mod;
			else _modules[8][15 - i - 1] = mod;
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
				for (let c = 0; c < 2; c += 1) if (_modules[row][col - c] == null) {
					let dark = false;
					if (byteIndex < data.length) dark = (data[byteIndex] >>> bitIndex & 1) == 1;
					if (maskFunc(row, col - c)) dark = !dark;
					_modules[row][col - c] = dark;
					bitIndex -= 1;
					if (bitIndex == -1) {
						byteIndex += 1;
						bitIndex = 7;
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
	const createBytes = function(buffer, rsBlocks) {
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
			for (let i = 0; i < dcdata[r].length; i += 1) dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
			offset += dcCount;
			const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
			const modPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1).mod(rsPoly);
			ecdata[r] = new Array(rsPoly.getLength() - 1);
			for (let i = 0; i < ecdata[r].length; i += 1) {
				const modIndex = i + modPoly.getLength() - ecdata[r].length;
				ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
			}
		}
		let totalCodeCount = 0;
		for (let i = 0; i < rsBlocks.length; i += 1) totalCodeCount += rsBlocks[i].totalCount;
		const data = new Array(totalCodeCount);
		let index = 0;
		for (let i = 0; i < maxDcCount; i += 1) for (let r = 0; r < rsBlocks.length; r += 1) if (i < dcdata[r].length) {
			data[index] = dcdata[r][i];
			index += 1;
		}
		for (let i = 0; i < maxEcCount; i += 1) for (let r = 0; r < rsBlocks.length; r += 1) if (i < ecdata[r].length) {
			data[index] = ecdata[r][i];
			index += 1;
		}
		return data;
	};
	const createData = function(typeNumber, errorCorrectionLevel, dataList) {
		const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
		const buffer = qrBitBuffer();
		for (let i = 0; i < dataList.length; i += 1) {
			const data = dataList[i];
			buffer.put(data.getMode(), 4);
			buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
			data.write(buffer);
		}
		let totalDataCount = 0;
		for (let i = 0; i < rsBlocks.length; i += 1) totalDataCount += rsBlocks[i].dataCount;
		if (buffer.getLengthInBits() > totalDataCount * 8) throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
		if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
		while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
		while (true) {
			if (buffer.getLengthInBits() >= totalDataCount * 8) break;
			buffer.put(PAD0, 8);
			if (buffer.getLengthInBits() >= totalDataCount * 8) break;
			buffer.put(PAD1, 8);
		}
		return createBytes(buffer, rsBlocks);
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
			default: throw "mode:" + mode;
		}
		_dataList.push(newData);
		_dataCache = null;
	};
	_this.isDark = function(row, col) {
		if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) throw row + "," + col;
		return _modules[row][col];
	};
	_this.getModuleCount = function() {
		return _moduleCount;
	};
	_this.make = function() {
		if (_typeNumber < 1) {
			let typeNumber = 1;
			for (; typeNumber < 40; typeNumber++) {
				const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
				const buffer = qrBitBuffer();
				for (let i = 0; i < _dataList.length; i++) {
					const data = _dataList[i];
					buffer.put(data.getMode(), 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
					data.write(buffer);
				}
				let totalDataCount = 0;
				for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
				if (buffer.getLengthInBits() <= totalDataCount * 8) break;
			}
			_typeNumber = typeNumber;
		}
		makeImpl(false, getBestMaskPattern());
	};
	_this.createTableTag = function(cellSize, margin) {
		cellSize = cellSize || 2;
		margin = typeof margin == "undefined" ? cellSize * 4 : margin;
		let qrHtml = "";
		qrHtml += "<table style=\"";
		qrHtml += " border-width: 0px; border-style: none;";
		qrHtml += " border-collapse: collapse;";
		qrHtml += " padding: 0px; margin: " + margin + "px;";
		qrHtml += "\">";
		qrHtml += "<tbody>";
		for (let r = 0; r < _this.getModuleCount(); r += 1) {
			qrHtml += "<tr>";
			for (let c = 0; c < _this.getModuleCount(); c += 1) {
				qrHtml += "<td style=\"";
				qrHtml += " border-width: 0px; border-style: none;";
				qrHtml += " border-collapse: collapse;";
				qrHtml += " padding: 0px; margin: 0px;";
				qrHtml += " width: " + cellSize + "px;";
				qrHtml += " height: " + cellSize + "px;";
				qrHtml += " background-color: ";
				qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
				qrHtml += ";";
				qrHtml += "\"/>";
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
		qrSvg += "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"";
		qrSvg += !opts.scalable ? " width=\"" + size + "px\" height=\"" + size + "px\"" : "";
		qrSvg += " viewBox=\"0 0 " + size + " " + size + "\" ";
		qrSvg += " preserveAspectRatio=\"xMinYMin meet\"";
		qrSvg += title.text || alt.text ? " role=\"img\" aria-labelledby=\"" + escapeXml([title.id, alt.id].join(" ").trim()) + "\"" : "";
		qrSvg += ">";
		qrSvg += title.text ? "<title id=\"" + escapeXml(title.id) + "\">" + escapeXml(title.text) + "</title>" : "";
		qrSvg += alt.text ? "<description id=\"" + escapeXml(alt.id) + "\">" + escapeXml(alt.text) + "</description>" : "";
		qrSvg += "<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>";
		qrSvg += "<path d=\"";
		for (r = 0; r < _this.getModuleCount(); r += 1) {
			mr = r * cellSize + margin;
			for (c = 0; c < _this.getModuleCount(); c += 1) if (_this.isDark(r, c)) {
				mc = c * cellSize + margin;
				qrSvg += "M" + mc + "," + mr + rect;
			}
		}
		qrSvg += "\" stroke=\"transparent\" fill=\"black\"/>";
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
			} else return 1;
		});
	};
	_this.createImgTag = function(cellSize, margin, alt) {
		cellSize = cellSize || 2;
		margin = typeof margin == "undefined" ? cellSize * 4 : margin;
		const size = _this.getModuleCount() * cellSize + margin * 2;
		let img = "";
		img += "<img";
		img += " src=\"";
		img += _this.createDataURL(cellSize, margin);
		img += "\"";
		img += " width=\"";
		img += size;
		img += "\"";
		img += " height=\"";
		img += size;
		img += "\"";
		if (alt) {
			img += " alt=\"";
			img += escapeXml(alt);
			img += "\"";
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
				case "\"":
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
				if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) p = " ";
				if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) p += " ";
				else p += "█";
				ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
			}
			ascii += "\n";
		}
		if (size % 2 && margin > 0) return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("▀");
		return ascii.substring(0, ascii.length - 1);
	};
	_this.createASCII = function(cellSize, margin) {
		cellSize = cellSize || 1;
		if (cellSize < 2) return _createHalfASCII(margin);
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
				if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) p = 0;
				line += p ? white : black;
			}
			for (r = 0; r < cellSize; r += 1) ascii += line + "\n";
		}
		return ascii.substring(0, ascii.length - 1);
	};
	_this.renderTo2dContext = function(context, cellSize) {
		cellSize = cellSize || 2;
		const length = _this.getModuleCount();
		for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) {
			context.fillStyle = _this.isDark(row, col) ? "black" : "white";
			context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
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
/**
* @param unicodeData base64 string of byte array.
* [16bit Unicode],[16bit Bytes], ...
* @param numChars
*/
qrcode.createStringToBytes = function(unicodeData, numChars) {
	const unicodeMap = function() {
		const bin = base64DecodeInputStream(unicodeData);
		const read = function() {
			const b = bin.read();
			if (b == -1) throw "eof";
			return b;
		};
		let count = 0;
		const unicodeMap = {};
		while (true) {
			const b0 = bin.read();
			if (b0 == -1) break;
			const b1 = read();
			const b2 = read();
			const b3 = read();
			const k = String.fromCharCode(b0 << 8 | b1);
			unicodeMap[k] = b2 << 8 | b3;
			count += 1;
		}
		if (count != numChars) throw count + " != " + numChars;
		return unicodeMap;
	}();
	const unknownChar = "?".charCodeAt(0);
	return function(s) {
		const bytes = [];
		for (let i = 0; i < s.length; i += 1) {
			const c = s.charCodeAt(i);
			if (c < 128) bytes.push(c);
			else {
				const b = unicodeMap[s.charAt(i)];
				if (typeof b == "number") if ((b & 255) == b) bytes.push(b);
				else {
					bytes.push(b >>> 8);
					bytes.push(b & 255);
				}
				else bytes.push(unknownChar);
			}
		}
		return bytes;
	};
};
var QRMode = {
	MODE_NUMBER: 1,
	MODE_ALPHA_NUM: 2,
	MODE_8BIT_BYTE: 4,
	MODE_KANJI: 8
};
var QRErrorCorrectionLevel = {
	L: 1,
	M: 0,
	Q: 3,
	H: 2
};
var QRMaskPattern = {
	PATTERN000: 0,
	PATTERN001: 1,
	PATTERN010: 2,
	PATTERN011: 3,
	PATTERN100: 4,
	PATTERN101: 5,
	PATTERN110: 6,
	PATTERN111: 7
};
var QRUtil = function() {
	const PATTERN_POSITION_TABLE = [
		[],
		[6, 18],
		[6, 22],
		[6, 26],
		[6, 30],
		[6, 34],
		[
			6,
			22,
			38
		],
		[
			6,
			24,
			42
		],
		[
			6,
			26,
			46
		],
		[
			6,
			28,
			50
		],
		[
			6,
			30,
			54
		],
		[
			6,
			32,
			58
		],
		[
			6,
			34,
			62
		],
		[
			6,
			26,
			46,
			66
		],
		[
			6,
			26,
			48,
			70
		],
		[
			6,
			26,
			50,
			74
		],
		[
			6,
			30,
			54,
			78
		],
		[
			6,
			30,
			56,
			82
		],
		[
			6,
			30,
			58,
			86
		],
		[
			6,
			34,
			62,
			90
		],
		[
			6,
			28,
			50,
			72,
			94
		],
		[
			6,
			26,
			50,
			74,
			98
		],
		[
			6,
			30,
			54,
			78,
			102
		],
		[
			6,
			28,
			54,
			80,
			106
		],
		[
			6,
			32,
			58,
			84,
			110
		],
		[
			6,
			30,
			58,
			86,
			114
		],
		[
			6,
			34,
			62,
			90,
			118
		],
		[
			6,
			26,
			50,
			74,
			98,
			122
		],
		[
			6,
			30,
			54,
			78,
			102,
			126
		],
		[
			6,
			26,
			52,
			78,
			104,
			130
		],
		[
			6,
			30,
			56,
			82,
			108,
			134
		],
		[
			6,
			34,
			60,
			86,
			112,
			138
		],
		[
			6,
			30,
			58,
			86,
			114,
			142
		],
		[
			6,
			34,
			62,
			90,
			118,
			146
		],
		[
			6,
			30,
			54,
			78,
			102,
			126,
			150
		],
		[
			6,
			24,
			50,
			76,
			102,
			128,
			154
		],
		[
			6,
			28,
			54,
			80,
			106,
			132,
			158
		],
		[
			6,
			32,
			58,
			84,
			110,
			136,
			162
		],
		[
			6,
			26,
			54,
			82,
			110,
			138,
			166
		],
		[
			6,
			30,
			58,
			86,
			114,
			142,
			170
		]
	];
	const G15 = 1335;
	const G18 = 7973;
	const G15_MASK = 21522;
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
		while (getBCHDigit(d) - getBCHDigit(G15) >= 0) d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
		return (data << 10 | d) ^ G15_MASK;
	};
	_this.getBCHTypeNumber = function(data) {
		let d = data << 12;
		while (getBCHDigit(d) - getBCHDigit(G18) >= 0) d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
		return data << 12 | d;
	};
	_this.getPatternPosition = function(typeNumber) {
		return PATTERN_POSITION_TABLE[typeNumber - 1];
	};
	_this.getMaskFunction = function(maskPattern) {
		switch (maskPattern) {
			case QRMaskPattern.PATTERN000: return function(i, j) {
				return (i + j) % 2 == 0;
			};
			case QRMaskPattern.PATTERN001: return function(i, j) {
				return i % 2 == 0;
			};
			case QRMaskPattern.PATTERN010: return function(i, j) {
				return j % 3 == 0;
			};
			case QRMaskPattern.PATTERN011: return function(i, j) {
				return (i + j) % 3 == 0;
			};
			case QRMaskPattern.PATTERN100: return function(i, j) {
				return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
			};
			case QRMaskPattern.PATTERN101: return function(i, j) {
				return i * j % 2 + i * j % 3 == 0;
			};
			case QRMaskPattern.PATTERN110: return function(i, j) {
				return (i * j % 2 + i * j % 3) % 2 == 0;
			};
			case QRMaskPattern.PATTERN111: return function(i, j) {
				return (i * j % 3 + (i + j) % 2) % 2 == 0;
			};
			default: throw "bad maskPattern:" + maskPattern;
		}
	};
	_this.getErrorCorrectPolynomial = function(errorCorrectLength) {
		let a = qrPolynomial([1], 0);
		for (let i = 0; i < errorCorrectLength; i += 1) a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
		return a;
	};
	_this.getLengthInBits = function(mode, type) {
		if (1 <= type && type < 10) switch (mode) {
			case QRMode.MODE_NUMBER: return 10;
			case QRMode.MODE_ALPHA_NUM: return 9;
			case QRMode.MODE_8BIT_BYTE: return 8;
			case QRMode.MODE_KANJI: return 8;
			default: throw "mode:" + mode;
		}
		else if (type < 27) switch (mode) {
			case QRMode.MODE_NUMBER: return 12;
			case QRMode.MODE_ALPHA_NUM: return 11;
			case QRMode.MODE_8BIT_BYTE: return 16;
			case QRMode.MODE_KANJI: return 10;
			default: throw "mode:" + mode;
		}
		else if (type < 41) switch (mode) {
			case QRMode.MODE_NUMBER: return 14;
			case QRMode.MODE_ALPHA_NUM: return 13;
			case QRMode.MODE_8BIT_BYTE: return 16;
			case QRMode.MODE_KANJI: return 12;
			default: throw "mode:" + mode;
		}
		else throw "type:" + type;
	};
	_this.getLostPoint = function(qrcode) {
		const moduleCount = qrcode.getModuleCount();
		let lostPoint = 0;
		for (let row = 0; row < moduleCount; row += 1) for (let col = 0; col < moduleCount; col += 1) {
			let sameCount = 0;
			const dark = qrcode.isDark(row, col);
			for (let r = -1; r <= 1; r += 1) {
				if (row + r < 0 || moduleCount <= row + r) continue;
				for (let c = -1; c <= 1; c += 1) {
					if (col + c < 0 || moduleCount <= col + c) continue;
					if (r == 0 && c == 0) continue;
					if (dark == qrcode.isDark(row + r, col + c)) sameCount += 1;
				}
			}
			if (sameCount > 5) lostPoint += 3 + sameCount - 5;
		}
		for (let row = 0; row < moduleCount - 1; row += 1) for (let col = 0; col < moduleCount - 1; col += 1) {
			let count = 0;
			if (qrcode.isDark(row, col)) count += 1;
			if (qrcode.isDark(row + 1, col)) count += 1;
			if (qrcode.isDark(row, col + 1)) count += 1;
			if (qrcode.isDark(row + 1, col + 1)) count += 1;
			if (count == 0 || count == 4) lostPoint += 3;
		}
		for (let row = 0; row < moduleCount; row += 1) for (let col = 0; col < moduleCount - 6; col += 1) if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) lostPoint += 40;
		for (let col = 0; col < moduleCount; col += 1) for (let row = 0; row < moduleCount - 6; row += 1) if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) lostPoint += 40;
		let darkCount = 0;
		for (let col = 0; col < moduleCount; col += 1) for (let row = 0; row < moduleCount; row += 1) if (qrcode.isDark(row, col)) darkCount += 1;
		const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
		lostPoint += ratio * 10;
		return lostPoint;
	};
	return _this;
}();
var QRMath = function() {
	const EXP_TABLE = new Array(256);
	const LOG_TABLE = new Array(256);
	for (let i = 0; i < 8; i += 1) EXP_TABLE[i] = 1 << i;
	for (let i = 8; i < 256; i += 1) EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
	for (let i = 0; i < 255; i += 1) LOG_TABLE[EXP_TABLE[i]] = i;
	const _this = {};
	_this.glog = function(n) {
		if (n < 1) throw "glog(" + n + ")";
		return LOG_TABLE[n];
	};
	_this.gexp = function(n) {
		while (n < 0) n += 255;
		while (n >= 256) n -= 255;
		return EXP_TABLE[n];
	};
	return _this;
}();
var qrPolynomial = function(num, shift) {
	if (typeof num.length == "undefined") throw num.length + "/" + shift;
	const _num = function() {
		let offset = 0;
		while (offset < num.length && num[offset] == 0) offset += 1;
		const _num = new Array(num.length - offset + shift);
		for (let i = 0; i < num.length - offset; i += 1) _num[i] = num[i + offset];
		return _num;
	}();
	const _this = {};
	_this.getAt = function(index) {
		return _num[index];
	};
	_this.getLength = function() {
		return _num.length;
	};
	_this.multiply = function(e) {
		const num = new Array(_this.getLength() + e.getLength() - 1);
		for (let i = 0; i < _this.getLength(); i += 1) for (let j = 0; j < e.getLength(); j += 1) num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
		return qrPolynomial(num, 0);
	};
	_this.mod = function(e) {
		if (_this.getLength() - e.getLength() < 0) return _this;
		const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
		const num = new Array(_this.getLength());
		for (let i = 0; i < _this.getLength(); i += 1) num[i] = _this.getAt(i);
		for (let i = 0; i < e.getLength(); i += 1) num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
		return qrPolynomial(num, 0).mod(e);
	};
	return _this;
};
var QRRSBlock = function() {
	const RS_BLOCK_TABLE = [
		[
			1,
			26,
			19
		],
		[
			1,
			26,
			16
		],
		[
			1,
			26,
			13
		],
		[
			1,
			26,
			9
		],
		[
			1,
			44,
			34
		],
		[
			1,
			44,
			28
		],
		[
			1,
			44,
			22
		],
		[
			1,
			44,
			16
		],
		[
			1,
			70,
			55
		],
		[
			1,
			70,
			44
		],
		[
			2,
			35,
			17
		],
		[
			2,
			35,
			13
		],
		[
			1,
			100,
			80
		],
		[
			2,
			50,
			32
		],
		[
			2,
			50,
			24
		],
		[
			4,
			25,
			9
		],
		[
			1,
			134,
			108
		],
		[
			2,
			67,
			43
		],
		[
			2,
			33,
			15,
			2,
			34,
			16
		],
		[
			2,
			33,
			11,
			2,
			34,
			12
		],
		[
			2,
			86,
			68
		],
		[
			4,
			43,
			27
		],
		[
			4,
			43,
			19
		],
		[
			4,
			43,
			15
		],
		[
			2,
			98,
			78
		],
		[
			4,
			49,
			31
		],
		[
			2,
			32,
			14,
			4,
			33,
			15
		],
		[
			4,
			39,
			13,
			1,
			40,
			14
		],
		[
			2,
			121,
			97
		],
		[
			2,
			60,
			38,
			2,
			61,
			39
		],
		[
			4,
			40,
			18,
			2,
			41,
			19
		],
		[
			4,
			40,
			14,
			2,
			41,
			15
		],
		[
			2,
			146,
			116
		],
		[
			3,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			36,
			16,
			4,
			37,
			17
		],
		[
			4,
			36,
			12,
			4,
			37,
			13
		],
		[
			2,
			86,
			68,
			2,
			87,
			69
		],
		[
			4,
			69,
			43,
			1,
			70,
			44
		],
		[
			6,
			43,
			19,
			2,
			44,
			20
		],
		[
			6,
			43,
			15,
			2,
			44,
			16
		],
		[
			4,
			101,
			81
		],
		[
			1,
			80,
			50,
			4,
			81,
			51
		],
		[
			4,
			50,
			22,
			4,
			51,
			23
		],
		[
			3,
			36,
			12,
			8,
			37,
			13
		],
		[
			2,
			116,
			92,
			2,
			117,
			93
		],
		[
			6,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			46,
			20,
			6,
			47,
			21
		],
		[
			7,
			42,
			14,
			4,
			43,
			15
		],
		[
			4,
			133,
			107
		],
		[
			8,
			59,
			37,
			1,
			60,
			38
		],
		[
			8,
			44,
			20,
			4,
			45,
			21
		],
		[
			12,
			33,
			11,
			4,
			34,
			12
		],
		[
			3,
			145,
			115,
			1,
			146,
			116
		],
		[
			4,
			64,
			40,
			5,
			65,
			41
		],
		[
			11,
			36,
			16,
			5,
			37,
			17
		],
		[
			11,
			36,
			12,
			5,
			37,
			13
		],
		[
			5,
			109,
			87,
			1,
			110,
			88
		],
		[
			5,
			65,
			41,
			5,
			66,
			42
		],
		[
			5,
			54,
			24,
			7,
			55,
			25
		],
		[
			11,
			36,
			12,
			7,
			37,
			13
		],
		[
			5,
			122,
			98,
			1,
			123,
			99
		],
		[
			7,
			73,
			45,
			3,
			74,
			46
		],
		[
			15,
			43,
			19,
			2,
			44,
			20
		],
		[
			3,
			45,
			15,
			13,
			46,
			16
		],
		[
			1,
			135,
			107,
			5,
			136,
			108
		],
		[
			10,
			74,
			46,
			1,
			75,
			47
		],
		[
			1,
			50,
			22,
			15,
			51,
			23
		],
		[
			2,
			42,
			14,
			17,
			43,
			15
		],
		[
			5,
			150,
			120,
			1,
			151,
			121
		],
		[
			9,
			69,
			43,
			4,
			70,
			44
		],
		[
			17,
			50,
			22,
			1,
			51,
			23
		],
		[
			2,
			42,
			14,
			19,
			43,
			15
		],
		[
			3,
			141,
			113,
			4,
			142,
			114
		],
		[
			3,
			70,
			44,
			11,
			71,
			45
		],
		[
			17,
			47,
			21,
			4,
			48,
			22
		],
		[
			9,
			39,
			13,
			16,
			40,
			14
		],
		[
			3,
			135,
			107,
			5,
			136,
			108
		],
		[
			3,
			67,
			41,
			13,
			68,
			42
		],
		[
			15,
			54,
			24,
			5,
			55,
			25
		],
		[
			15,
			43,
			15,
			10,
			44,
			16
		],
		[
			4,
			144,
			116,
			4,
			145,
			117
		],
		[
			17,
			68,
			42
		],
		[
			17,
			50,
			22,
			6,
			51,
			23
		],
		[
			19,
			46,
			16,
			6,
			47,
			17
		],
		[
			2,
			139,
			111,
			7,
			140,
			112
		],
		[
			17,
			74,
			46
		],
		[
			7,
			54,
			24,
			16,
			55,
			25
		],
		[
			34,
			37,
			13
		],
		[
			4,
			151,
			121,
			5,
			152,
			122
		],
		[
			4,
			75,
			47,
			14,
			76,
			48
		],
		[
			11,
			54,
			24,
			14,
			55,
			25
		],
		[
			16,
			45,
			15,
			14,
			46,
			16
		],
		[
			6,
			147,
			117,
			4,
			148,
			118
		],
		[
			6,
			73,
			45,
			14,
			74,
			46
		],
		[
			11,
			54,
			24,
			16,
			55,
			25
		],
		[
			30,
			46,
			16,
			2,
			47,
			17
		],
		[
			8,
			132,
			106,
			4,
			133,
			107
		],
		[
			8,
			75,
			47,
			13,
			76,
			48
		],
		[
			7,
			54,
			24,
			22,
			55,
			25
		],
		[
			22,
			45,
			15,
			13,
			46,
			16
		],
		[
			10,
			142,
			114,
			2,
			143,
			115
		],
		[
			19,
			74,
			46,
			4,
			75,
			47
		],
		[
			28,
			50,
			22,
			6,
			51,
			23
		],
		[
			33,
			46,
			16,
			4,
			47,
			17
		],
		[
			8,
			152,
			122,
			4,
			153,
			123
		],
		[
			22,
			73,
			45,
			3,
			74,
			46
		],
		[
			8,
			53,
			23,
			26,
			54,
			24
		],
		[
			12,
			45,
			15,
			28,
			46,
			16
		],
		[
			3,
			147,
			117,
			10,
			148,
			118
		],
		[
			3,
			73,
			45,
			23,
			74,
			46
		],
		[
			4,
			54,
			24,
			31,
			55,
			25
		],
		[
			11,
			45,
			15,
			31,
			46,
			16
		],
		[
			7,
			146,
			116,
			7,
			147,
			117
		],
		[
			21,
			73,
			45,
			7,
			74,
			46
		],
		[
			1,
			53,
			23,
			37,
			54,
			24
		],
		[
			19,
			45,
			15,
			26,
			46,
			16
		],
		[
			5,
			145,
			115,
			10,
			146,
			116
		],
		[
			19,
			75,
			47,
			10,
			76,
			48
		],
		[
			15,
			54,
			24,
			25,
			55,
			25
		],
		[
			23,
			45,
			15,
			25,
			46,
			16
		],
		[
			13,
			145,
			115,
			3,
			146,
			116
		],
		[
			2,
			74,
			46,
			29,
			75,
			47
		],
		[
			42,
			54,
			24,
			1,
			55,
			25
		],
		[
			23,
			45,
			15,
			28,
			46,
			16
		],
		[
			17,
			145,
			115
		],
		[
			10,
			74,
			46,
			23,
			75,
			47
		],
		[
			10,
			54,
			24,
			35,
			55,
			25
		],
		[
			19,
			45,
			15,
			35,
			46,
			16
		],
		[
			17,
			145,
			115,
			1,
			146,
			116
		],
		[
			14,
			74,
			46,
			21,
			75,
			47
		],
		[
			29,
			54,
			24,
			19,
			55,
			25
		],
		[
			11,
			45,
			15,
			46,
			46,
			16
		],
		[
			13,
			145,
			115,
			6,
			146,
			116
		],
		[
			14,
			74,
			46,
			23,
			75,
			47
		],
		[
			44,
			54,
			24,
			7,
			55,
			25
		],
		[
			59,
			46,
			16,
			1,
			47,
			17
		],
		[
			12,
			151,
			121,
			7,
			152,
			122
		],
		[
			12,
			75,
			47,
			26,
			76,
			48
		],
		[
			39,
			54,
			24,
			14,
			55,
			25
		],
		[
			22,
			45,
			15,
			41,
			46,
			16
		],
		[
			6,
			151,
			121,
			14,
			152,
			122
		],
		[
			6,
			75,
			47,
			34,
			76,
			48
		],
		[
			46,
			54,
			24,
			10,
			55,
			25
		],
		[
			2,
			45,
			15,
			64,
			46,
			16
		],
		[
			17,
			152,
			122,
			4,
			153,
			123
		],
		[
			29,
			74,
			46,
			14,
			75,
			47
		],
		[
			49,
			54,
			24,
			10,
			55,
			25
		],
		[
			24,
			45,
			15,
			46,
			46,
			16
		],
		[
			4,
			152,
			122,
			18,
			153,
			123
		],
		[
			13,
			74,
			46,
			32,
			75,
			47
		],
		[
			48,
			54,
			24,
			14,
			55,
			25
		],
		[
			42,
			45,
			15,
			32,
			46,
			16
		],
		[
			20,
			147,
			117,
			4,
			148,
			118
		],
		[
			40,
			75,
			47,
			7,
			76,
			48
		],
		[
			43,
			54,
			24,
			22,
			55,
			25
		],
		[
			10,
			45,
			15,
			67,
			46,
			16
		],
		[
			19,
			148,
			118,
			6,
			149,
			119
		],
		[
			18,
			75,
			47,
			31,
			76,
			48
		],
		[
			34,
			54,
			24,
			34,
			55,
			25
		],
		[
			20,
			45,
			15,
			61,
			46,
			16
		]
	];
	const qrRSBlock = function(totalCount, dataCount) {
		const _this = {};
		_this.totalCount = totalCount;
		_this.dataCount = dataCount;
		return _this;
	};
	const _this = {};
	const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
		switch (errorCorrectionLevel) {
			case QRErrorCorrectionLevel.L: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
			case QRErrorCorrectionLevel.M: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
			case QRErrorCorrectionLevel.Q: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
			case QRErrorCorrectionLevel.H: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
			default: return;
		}
	};
	_this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
		const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
		if (typeof rsBlock == "undefined") throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
		const length = rsBlock.length / 3;
		const list = [];
		for (let i = 0; i < length; i += 1) {
			const count = rsBlock[i * 3 + 0];
			const totalCount = rsBlock[i * 3 + 1];
			const dataCount = rsBlock[i * 3 + 2];
			for (let j = 0; j < count; j += 1) list.push(qrRSBlock(totalCount, dataCount));
		}
		return list;
	};
	return _this;
}();
var qrBitBuffer = function() {
	const _buffer = [];
	let _length = 0;
	const _this = {};
	_this.getBuffer = function() {
		return _buffer;
	};
	_this.getAt = function(index) {
		const bufIndex = Math.floor(index / 8);
		return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
	};
	_this.put = function(num, length) {
		for (let i = 0; i < length; i += 1) _this.putBit((num >>> length - i - 1 & 1) == 1);
	};
	_this.getLengthInBits = function() {
		return _length;
	};
	_this.putBit = function(bit) {
		const bufIndex = Math.floor(_length / 8);
		if (_buffer.length <= bufIndex) _buffer.push(0);
		if (bit) _buffer[bufIndex] |= 128 >>> _length % 8;
		_length += 1;
	};
	return _this;
};
var qrNumber = function(data) {
	const _mode = QRMode.MODE_NUMBER;
	const _data = data;
	const _this = {};
	_this.getMode = function() {
		return _mode;
	};
	_this.getLength = function(buffer) {
		return _data.length;
	};
	_this.write = function(buffer) {
		const data = _data;
		let i = 0;
		while (i + 2 < data.length) {
			buffer.put(strToNum(data.substring(i, i + 3)), 10);
			i += 3;
		}
		if (i < data.length) {
			if (data.length - i == 1) buffer.put(strToNum(data.substring(i, i + 1)), 4);
			else if (data.length - i == 2) buffer.put(strToNum(data.substring(i, i + 2)), 7);
		}
	};
	const strToNum = function(s) {
		let num = 0;
		for (let i = 0; i < s.length; i += 1) num = num * 10 + chatToNum(s.charAt(i));
		return num;
	};
	const chatToNum = function(c) {
		if ("0" <= c && c <= "9") return c.charCodeAt(0) - "0".charCodeAt(0);
		throw "illegal char :" + c;
	};
	return _this;
};
var qrAlphaNum = function(data) {
	const _mode = QRMode.MODE_ALPHA_NUM;
	const _data = data;
	const _this = {};
	_this.getMode = function() {
		return _mode;
	};
	_this.getLength = function(buffer) {
		return _data.length;
	};
	_this.write = function(buffer) {
		const s = _data;
		let i = 0;
		while (i + 1 < s.length) {
			buffer.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
			i += 2;
		}
		if (i < s.length) buffer.put(getCode(s.charAt(i)), 6);
	};
	const getCode = function(c) {
		if ("0" <= c && c <= "9") return c.charCodeAt(0) - "0".charCodeAt(0);
		else if ("A" <= c && c <= "Z") return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
		else switch (c) {
			case " ": return 36;
			case "$": return 37;
			case "%": return 38;
			case "*": return 39;
			case "+": return 40;
			case "-": return 41;
			case ".": return 42;
			case "/": return 43;
			case ":": return 44;
			default: throw "illegal char :" + c;
		}
	};
	return _this;
};
var qr8BitByte = function(data) {
	const _mode = QRMode.MODE_8BIT_BYTE;
	const _bytes = qrcode.stringToBytes(data);
	const _this = {};
	_this.getMode = function() {
		return _mode;
	};
	_this.getLength = function(buffer) {
		return _bytes.length;
	};
	_this.write = function(buffer) {
		for (let i = 0; i < _bytes.length; i += 1) buffer.put(_bytes[i], 8);
	};
	return _this;
};
var qrKanji = function(data) {
	const _mode = QRMode.MODE_KANJI;
	const stringToBytes = qrcode.stringToBytes;
	(function(c, code) {
		const test = stringToBytes(c);
		if (test.length != 2 || (test[0] << 8 | test[1]) != code) throw "sjis not supported.";
	})("友", 38726);
	const _bytes = stringToBytes(data);
	const _this = {};
	_this.getMode = function() {
		return _mode;
	};
	_this.getLength = function(buffer) {
		return ~~(_bytes.length / 2);
	};
	_this.write = function(buffer) {
		const data = _bytes;
		let i = 0;
		while (i + 1 < data.length) {
			let c = (255 & data[i]) << 8 | 255 & data[i + 1];
			if (33088 <= c && c <= 40956) c -= 33088;
			else if (57408 <= c && c <= 60351) c -= 49472;
			else throw "illegal char at " + (i + 1) + "/" + c;
			c = (c >>> 8 & 255) * 192 + (c & 255);
			buffer.put(c, 13);
			i += 2;
		}
		if (i < data.length) throw "illegal char at " + (i + 1);
	};
	return _this;
};
var byteArrayOutputStream = function() {
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
		for (let i = 0; i < len; i += 1) _this.writeByte(b[i + off]);
	};
	_this.writeString = function(s) {
		for (let i = 0; i < s.length; i += 1) _this.writeByte(s.charCodeAt(i));
	};
	_this.toByteArray = function() {
		return _bytes;
	};
	_this.toString = function() {
		let s = "";
		s += "[";
		for (let i = 0; i < _bytes.length; i += 1) {
			if (i > 0) s += ",";
			s += _bytes[i];
		}
		s += "]";
		return s;
	};
	return _this;
};
var base64EncodeOutputStream = function() {
	let _buffer = 0;
	let _buflen = 0;
	let _length = 0;
	let _base64 = "";
	const _this = {};
	const writeEncoded = function(b) {
		_base64 += String.fromCharCode(encode(b & 63));
	};
	const encode = function(n) {
		if (n < 0) throw "n:" + n;
		else if (n < 26) return 65 + n;
		else if (n < 52) return 97 + (n - 26);
		else if (n < 62) return 48 + (n - 52);
		else if (n == 62) return 43;
		else if (n == 63) return 47;
		else throw "n:" + n;
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
			for (let i = 0; i < padlen; i += 1) _base64 += "=";
		}
	};
	_this.toString = function() {
		return _base64;
	};
	return _this;
};
var base64DecodeInputStream = function(str) {
	const _str = str;
	let _pos = 0;
	let _buffer = 0;
	let _buflen = 0;
	const _this = {};
	_this.read = function() {
		while (_buflen < 8) {
			if (_pos >= _str.length) {
				if (_buflen == 0) return -1;
				throw "unexpected end of file./" + _buflen;
			}
			const c = _str.charAt(_pos);
			_pos += 1;
			if (c == "=") {
				_buflen = 0;
				return -1;
			} else if (c.match(/^\s$/)) continue;
			_buffer = _buffer << 6 | decode(c.charCodeAt(0));
			_buflen += 6;
		}
		const n = _buffer >>> _buflen - 8 & 255;
		_buflen -= 8;
		return n;
	};
	const decode = function(c) {
		if (65 <= c && c <= 90) return c - 65;
		else if (97 <= c && c <= 122) return c - 97 + 26;
		else if (48 <= c && c <= 57) return c - 48 + 52;
		else if (c == 43) return 62;
		else if (c == 47) return 63;
		else throw "c:" + c;
	};
	return _this;
};
var gifImage = function(width, height) {
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
		const _this = {};
		_this.write = function(data, length) {
			if (data >>> length != 0) throw "length over";
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
		_this.flush = function() {
			if (_bitLength > 0) _out.writeByte(_bitBuffer);
		};
		return _this;
	};
	const getLZWRaster = function(lzwMinCodeSize) {
		const clearCode = 1 << lzwMinCodeSize;
		const endCode = (1 << lzwMinCodeSize) + 1;
		let bitLength = lzwMinCodeSize + 1;
		const table = lzwTable();
		for (let i = 0; i < clearCode; i += 1) table.add(String.fromCharCode(i));
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
			if (table.contains(s + c)) s = s + c;
			else {
				bitOut.write(table.indexOf(s), bitLength);
				if (table.size() < 4095) {
					if (table.size() == 1 << bitLength) bitLength += 1;
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
		const _this = {};
		_this.add = function(key) {
			if (_this.contains(key)) throw "dup key:" + key;
			_map[key] = _size;
			_size += 1;
		};
		_this.size = function() {
			return _size;
		};
		_this.indexOf = function(key) {
			return _map[key];
		};
		_this.contains = function(key) {
			return typeof _map[key] != "undefined";
		};
		return _this;
	};
	return _this;
};
var createDataURL = function(width, height, getPixel) {
	const gif = gifImage(width, height);
	for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) gif.setPixel(x, y, getPixel(x, y));
	const b = byteArrayOutputStream();
	gif.write(b);
	const base64 = base64EncodeOutputStream();
	const bytes = b.toByteArray();
	for (let i = 0; i < bytes.length; i += 1) base64.writeByte(bytes[i]);
	base64.flush();
	return "data:image/gif;base64," + base64;
};
qrcode.stringToBytes;
//#endregion
//#region src/lib/components/QrGenerator.svelte
var root$2 = from_html(`<span class="animation-status svelte-20q4zc"> </span> <span class="part-indicator svelte-20q4zc"> </span> <button class="control-btn svelte-20q4zc">Stop Animation</button>`, 1);
var root_1$2 = from_html(`<span class="part-indicator svelte-20q4zc"> </span> <button class="control-btn svelte-20q4zc">Start Animation</button>`, 1);
var root_2$2 = from_html(`<span class="part-indicator svelte-20q4zc">Single QR code - no animation needed</span>`);
var root_3$2 = from_html(`<span class="animation-status svelte-20q4zc">📱 Static QR</span> <!>`, 1);
var root_4$2 = from_html(`<button class="control-btn svelte-20q4zc">Next Part</button>`);
var root_5$2 = from_html(`<div><div class="part-header svelte-20q4zc"><strong class="svelte-20q4zc"></strong> <span> </span> <span class="part-sequence svelte-20q4zc"> </span></div> <code class="part-data svelte-20q4zc"> </code></div>`);
var root_6$2 = from_html(`<div class="all-parts-section svelte-20q4zc"><h4 class="svelte-20q4zc"> </h4> <div class="fountain-explanation svelte-20q4zc"><p class="svelte-20q4zc"><strong class="svelte-20q4zc">📡 Fountain Code Structure:</strong></p> <ul class="svelte-20q4zc"><li class="svelte-20q4zc"><strong class="svelte-20q4zc">Basic Parts:</strong> </li> <li class="svelte-20q4zc"><strong class="svelte-20q4zc">Fountain Parts:</strong> Redundant parts beyond the basic sequence
                            (for error recovery)</li> <li class="svelte-20q4zc"><strong class="svelte-20q4zc">Collection:</strong> You need to collect <em class="svelte-20q4zc"> </em> parts total to decode reliably</li> <li class="svelte-20q4zc"><strong class="svelte-20q4zc">Redundancy:</strong> </li></ul></div> <div class="parts-list svelte-20q4zc"></div></div>`);
var root_7$2 = from_html(`<div class="qr-section svelte-20q4zc"><h3 class="svelte-20q4zc">Scan with Keystone to Sign</h3> <div class="qr-controls svelte-20q4zc"><!> <!></div> <div class="qr-container svelte-20q4zc"><canvas class="qr-canvas svelte-20q4zc" width="400" height="400"></canvas></div> <div class="qr-data svelte-20q4zc"><strong class="svelte-20q4zc">Current UR Data:</strong> <code class="svelte-20q4zc"> </code></div> <!></div>`);
var root_8$2 = from_html(`<div class="error-message svelte-20q4zc"><strong class="svelte-20q4zc">QR Generation Error:</strong> </div>`);
var root_9$2 = from_html(`<!> <!>`, 1);
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
	/**
	* Initialize canvas on mount
	*/
	onMount(() => {
		if (get(canvasElement)) {
			mutate(canvasElement, get(canvasElement).width = 400);
			mutate(canvasElement, get(canvasElement).height = 400);
		}
		if (get(currentQR)) updateQRCode(get(currentQR));
	});
	/**
	* Update QR code with new value using qrcode-generator
	*/
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
			for (let row = 0; row < moduleCount; row++) for (let col = 0; col < moduleCount; col++) if (qr.isDark(row, col)) ctx.fillRect(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize);
		} catch (error) {
			console.error("Failed to generate QR code:", error);
		}
	}
	/**
	* Create animated QR code from CBOR and type
	*/
	function createAnimatedQR(cborHex, type, maxCapacity) {
		try {
			stopQRAnimation();
			urEncoder = new UREncoder(new UR(import_buffer.Buffer.from(cborHex, "hex"), type), maxCapacity);
			const firstPart = urEncoder.nextPart().toUpperCase();
			console.log("Generated QR part:", firstPart);
			console.log("First part length:", firstPart.length);
			const parts = firstPart.split("/");
			if (parts.length <= 2 || parts.length >= 2 && parts[1] === "1-1") {
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
				const [, totalPartsStr] = parts[1].split("-");
				const totalParts = parseInt(totalPartsStr);
				set(totalBasicParts, totalParts);
				if (totalParts > 0 && totalParts <= 100) {
					set(allQRParts, [firstPart]);
					for (let i = 1; i < totalParts; i++) {
						const nextPart = urEncoder.nextPart().toUpperCase();
						get(allQRParts).push(nextPart);
					}
					const additionalParts = Math.min(totalParts * 2, 50) - totalParts;
					for (let i = 0; i < additionalParts; i++) {
						const nextPart = urEncoder.nextPart().toUpperCase();
						get(allQRParts).push(nextPart);
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
					if (get(isAnimated)) qrInterval = setInterval(() => {
						set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
						set(currentQR, get(allQRParts)[get(currentPartIndex)]);
					}, defaultInterval());
				} else throw new Error(`Invalid number of parts: ${totalParts}`);
			} else throw new Error("Unable to parse multipart UR format");
			scanError("");
		} catch (error) {
			scanError(error instanceof Error ? error.message : "Failed to create animated QR");
			set(currentQR, "");
			set(isAnimated, false);
			set(allQRParts, []);
			set(currentPartIndex, 0);
		}
	}
	/**
	* Determine if a QR part is basic (sequential) or fountain (redundant)
	*/
	function getPartType(part, totalBasicParts) {
		const parts = part.split("/");
		if (parts.length >= 2) {
			const [seqNumStr, seqLenStr] = parts[1].split("-");
			const seqNum = parseInt(seqNumStr);
			return {
				type: seqNum >= 1 && seqNum <= totalBasicParts ? "basic" : "fountain",
				seqNum,
				seqLen: parseInt(seqLenStr)
			};
		}
		return {
			type: "basic",
			seqNum: 1,
			seqLen: 1
		};
	}
	/**
	* Stop QR animation
	*/
	function stopQRAnimation() {
		if (qrInterval) {
			clearInterval(qrInterval);
			qrInterval = null;
		}
		set(isAnimated, false);
		urEncoder = null;
	}
	/**
	* Start QR animation
	*/
	function startQRAnimation() {
		if (get(allQRParts).length > 1 && !get(isAnimated)) {
			set(isAnimated, true);
			qrInterval = setInterval(() => {
				set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
				set(currentQR, get(allQRParts)[get(currentPartIndex)]);
			}, defaultInterval());
		}
	}
	/**
	* Go to next QR part manually
	*/
	function nextPart() {
		if (get(allQRParts).length > 1) {
			set(currentPartIndex, (get(currentPartIndex) + 1) % get(allQRParts).length);
			set(currentQR, get(allQRParts)[get(currentPartIndex)]);
		}
	}
	/**
	* Clear QR data
	*/
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
	legacy_pre_effect(() => (deep_read_state(cbor()), deep_read_state(urType()), deep_read_state(capacity())), () => {
		if (cbor() && urType()) createAnimatedQR(cbor(), urType(), capacity());
	});
	legacy_pre_effect(() => (get(currentQR), get(canvasElement)), () => {
		if (get(currentQR) && get(canvasElement)) updateQRCode(get(currentQR));
	});
	legacy_pre_effect_reset();
	var $$exports = {
		stopQRAnimation,
		clear
	};
	init();
	var fragment = root_9$2();
	var node = first_child(fragment);
	var consequent_4 = ($$anchor) => {
		var div = root_7$2();
		var div_1 = sibling(child(div), 2);
		var node_1 = child(div_1);
		var consequent = ($$anchor) => {
			var fragment_1 = root$2();
			var span = first_child(fragment_1);
			var text = child(span);
			reset(span);
			var span_1 = sibling(span, 2);
			var text_1 = child(span_1);
			reset(span_1);
			var button = sibling(span_1, 2);
			template_effect(() => {
				set_text(text, `🔄 Animated QR (cycling through ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} parts)`);
				set_text(text_1, `Part ${get(currentPartIndex) + 1} of ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""}`);
			});
			event("click", button, stopQRAnimation);
			append($$anchor, fragment_1);
		};
		var alternate_1 = ($$anchor) => {
			var fragment_2 = root_3$2();
			var node_2 = sibling(first_child(fragment_2), 2);
			var consequent_1 = ($$anchor) => {
				var fragment_3 = root_1$2();
				var span_2 = first_child(fragment_3);
				var text_2 = child(span_2);
				reset(span_2);
				var button_1 = sibling(span_2, 2);
				template_effect(() => set_text(text_2, `Showing part ${get(currentPartIndex) + 1} of ${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} total`));
				event("click", button_1, startQRAnimation);
				append($$anchor, fragment_3);
			};
			var alternate = ($$anchor) => {
				append($$anchor, root_2$2());
			};
			if_block(node_2, ($$render) => {
				if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_1);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment_2);
		};
		if_block(node_1, ($$render) => {
			if (get(isAnimated)) $$render(consequent);
			else $$render(alternate_1, -1);
		});
		var node_3 = sibling(node_1, 2);
		var consequent_2 = ($$anchor) => {
			var button_2 = root_4$2();
			event("click", button_2, nextPart);
			append($$anchor, button_2);
		};
		if_block(node_3, ($$render) => {
			if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_2);
		});
		reset(div_1);
		var div_2 = sibling(div_1, 2);
		bind_this(child(div_2), ($$value) => set(canvasElement, $$value), () => get(canvasElement));
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var code = sibling(child(div_3), 2);
		var text_3 = child(code, true);
		reset(code);
		reset(div_3);
		var node_4 = sibling(div_3, 2);
		var consequent_3 = ($$anchor) => {
			var div_4 = root_6$2();
			var h4 = child(div_4);
			var text_4 = child(h4);
			reset(h4);
			var div_5 = sibling(h4, 2);
			var ul = sibling(child(div_5), 2);
			var li = child(ul);
			var text_5 = sibling(child(li));
			reset(li);
			var li_1 = sibling(li, 4);
			var em = sibling(child(li_1), 2);
			var text_6 = child(em);
			reset(em);
			next();
			reset(li_1);
			var li_2 = sibling(li_1, 2);
			var text_7 = sibling(child(li_2));
			reset(li_2);
			reset(ul);
			reset(div_5);
			var div_6 = sibling(div_5, 2);
			each(div_6, 5, () => get(allQRParts), index, ($$anchor, part, index) => {
				const partInfo = derived_safe_equal(() => (get(part), get(totalBasicParts), untrack(() => getPartType(get(part), get(totalBasicParts)))));
				var div_7 = root_5$2();
				var div_8 = child(div_7);
				var strong = child(div_8);
				strong.textContent = `Part ${index + 1}:`;
				var span_4 = sibling(strong, 2);
				var text_8 = child(span_4, true);
				reset(span_4);
				var span_5 = sibling(span_4, 2);
				var text_9 = child(span_5);
				reset(span_5);
				reset(div_8);
				var code_1 = sibling(div_8, 2);
				var text_10 = child(code_1, true);
				reset(code_1);
				reset(div_7);
				template_effect(() => {
					set_class(div_7, 1, `part-item ${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).type)) ?? ""}`, "svelte-20q4zc");
					set_class(span_4, 1, `part-type-badge ${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).type)) ?? ""}`, "svelte-20q4zc");
					set_text(text_8, (deep_read_state(get(partInfo)), untrack(() => get(partInfo).type === "basic" ? "📄 Basic" : "🔄 Fountain")));
					set_text(text_9, `(${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).seqNum)) ?? ""}-${(deep_read_state(get(partInfo)), untrack(() => get(partInfo).seqLen)) ?? ""})`);
					set_text(text_10, get(part));
				});
				append($$anchor, div_7);
			});
			reset(div_6);
			reset(div_4);
			template_effect(() => {
				set_text(text_4, `All UR Parts (${(get(allQRParts), untrack(() => get(allQRParts).length)) ?? ""} total)`);
				set_text(text_5, ` Sequential parts 1-${get(totalBasicParts) ?? ""} to ${get(totalBasicParts) ?? ""}-${get(totalBasicParts) ?? ""}
                            (minimum required)`);
				set_text(text_6, `more than ${get(totalBasicParts) ?? ""}`);
				set_text(text_7, ` Additional fountain parts provide error
                            recovery - any ${get(totalBasicParts) ?? ""}+ parts should work`);
			});
			append($$anchor, div_4);
		};
		if_block(node_4, ($$render) => {
			if (get(allQRParts), untrack(() => get(allQRParts).length > 1)) $$render(consequent_3);
		});
		reset(div);
		template_effect(() => set_text(text_3, get(currentQR)));
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if (get(currentQR)) $$render(consequent_4);
	});
	var node_5 = sibling(node, 2);
	var consequent_5 = ($$anchor) => {
		var div_9 = root_8$2();
		var text_11 = sibling(child(div_9));
		reset(div_9);
		template_effect(() => set_text(text_11, ` ${scanError() ?? ""}`));
		append($$anchor, div_9);
	};
	if_block(node_5, ($$render) => {
		if (scanError()) $$render(consequent_5);
	});
	append($$anchor, fragment);
	bind_prop($$props, "stopQRAnimation", stopQRAnimation);
	bind_prop($$props, "clear", clear);
	return pop($$exports);
}
//#endregion
//#region node_modules/.pnpm/qr-scanner@1.4.2/node_modules/qr-scanner/qr-scanner.min.js
var e = class e {
	constructor(a, b, c, d, f) {
		this._legacyCanvasSize = e.DEFAULT_CANVAS_SIZE;
		this._preferredCamera = "environment";
		this._maxScansPerSecond = 25;
		this._lastScanTimestamp = -1;
		this._destroyed = this._flashOn = this._paused = this._active = !1;
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
		a.disablePictureInPicture = !0;
		a.playsInline = !0;
		a.muted = !0;
		let h = !1;
		a.hidden && (a.hidden = !1, h = !0);
		document.body.contains(a) || (document.body.appendChild(a), h = !0);
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
				this.$overlay.innerHTML = "<svg class=\"scan-region-highlight-svg\" viewBox=\"0 0 238 238\" preserveAspectRatio=\"none\" style=\"position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round\"><path d=\"M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21\"/></svg>";
				try {
					this.$overlay.firstElementChild.animate({ transform: ["scale(.98)", "scale(1.01)"] }, {
						duration: 400,
						iterations: Infinity,
						direction: "alternate",
						easing: "ease-in-out"
					});
				} catch (m) {}
				c.insertBefore(this.$overlay, this.$video.nextSibling);
			}
			b.highlightCodeOutline && (this.$overlay.insertAdjacentHTML("beforeend", "<svg class=\"code-outline-highlight\" preserveAspectRatio=\"none\" style=\"display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round\"><polygon/></svg>"), this.$codeOutlineHighlight = this.$overlay.lastElementChild);
		}
		this._scanRegion = this._calculateScanRegion(a);
		requestAnimationFrame(() => {
			let m = window.getComputedStyle(a);
			"none" === m.display && (a.style.setProperty("display", "block", "important"), h = !0);
			"visible" !== m.visibility && (a.style.setProperty("visibility", "visible", "important"), h = !0);
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
			return !!(await e.listCameras(!1)).length;
		} catch (a) {
			return !1;
		}
	}
	static async listCameras(a = !1) {
		if (!navigator.mediaDevices) return [];
		let b = async () => (await navigator.mediaDevices.enumerateDevices()).filter((d) => "videoinput" === d.kind), c;
		try {
			a && (await b()).every((d) => !d.label) && (c = await navigator.mediaDevices.getUserMedia({
				audio: !1,
				video: !0
			}));
		} catch (d) {}
		try {
			return (await b()).map((d, f) => ({
				id: d.deviceId,
				label: d.label || (0 === f ? "Default Camera" : `Camera ${f + 1}`)
			}));
		} finally {
			c && (console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"), e._stopVideoStream(c));
		}
	}
	async hasFlash() {
		let a;
		try {
			if (this.$video.srcObject) {
				if (!(this.$video.srcObject instanceof MediaStream)) return !1;
				a = this.$video.srcObject;
			} else a = (await this._getCameraStream()).stream;
			return "torch" in a.getVideoTracks()[0].getSettings();
		} catch (b) {
			return !1;
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
		if (!this._flashOn && !this._destroyed && (this._flashOn = !0, this._active && !this._paused)) try {
			if (!await this.hasFlash()) throw "No flash available";
			await this.$video.srcObject.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: !0 }] });
		} catch (a) {
			throw this._flashOn = !1, a;
		}
	}
	async turnFlashOff() {
		this._flashOn && (this._flashOn = !1, await this._restartVideoStream());
	}
	destroy() {
		this.$video.removeEventListener("loadedmetadata", this._onLoadedMetaData);
		this.$video.removeEventListener("play", this._onPlay);
		document.removeEventListener("visibilitychange", this._onVisibilityChange);
		window.removeEventListener("resize", this._updateOverlay);
		this._destroyed = !0;
		this._flashOn = !1;
		this.stop();
		e._postWorkerMessage(this._qrEnginePromise, "close");
	}
	async start() {
		if (this._destroyed) throw Error("The QR scanner can not be started as it had been destroyed.");
		if (!this._active || this._paused) {
			if ("https:" !== window.location.protocol && console.warn("The camera stream is only accessible if the page is transferred via https."), this._active = !0, !document.hidden) if (this._paused = !1, this.$video.srcObject) await this.$video.play();
			else try {
				let { stream: a, facingMode: b } = await this._getCameraStream();
				!this._active || this._paused ? e._stopVideoStream(a) : (this._setVideoMirror(b), this.$video.srcObject = a, await this.$video.play(), this._flashOn && (this._flashOn = !1, this.turnFlashOn().catch(() => {})));
			} catch (a) {
				if (!this._paused) throw this._active = !1, a;
			}
		}
	}
	stop() {
		this.pause();
		this._active = !1;
	}
	async pause(a = !1) {
		this._paused = !0;
		if (!this._active) return !0;
		this.$video.pause();
		this.$overlay && (this.$overlay.style.display = "none");
		let b = () => {
			this.$video.srcObject instanceof MediaStream && (e._stopVideoStream(this.$video.srcObject), this.$video.srcObject = null);
		};
		if (a) return b(), !0;
		await new Promise((c) => setTimeout(c, 300));
		if (!this._paused) return !1;
		b();
		return !0;
	}
	async setCamera(a) {
		a !== this._preferredCamera && (this._preferredCamera = a, await this._restartVideoStream());
	}
	static async scanImage(a, b, c, d, f = !1, h = !1) {
		let m, n = !1;
		b && ("scanRegion" in b || "qrEngine" in b || "canvas" in b || "disallowCanvasResizing" in b || "alsoTryWithoutScanRegion" in b || "returnDetailedScanResult" in b) ? (m = b.scanRegion, c = b.qrEngine, d = b.canvas, f = b.disallowCanvasResizing || !1, h = b.alsoTryWithoutScanRegion || !1, n = !0) : b || c || d || f || h ? console.warn("You're using a deprecated api for scanImage which will be removed in the future.") : console.warn("Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true.");
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
						t.data.id === y && (g.removeEventListener("message", u), g.removeEventListener("error", r), clearTimeout(w), null !== t.data.data ? l({
							data: t.data.data,
							cornerPoints: e._convertPoints(t.data.cornerPoints, m)
						}) : v(e.NO_QR_CODE_FOUND));
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
					return {
						data: g.rawValue,
						cornerPoints: e._convertPoints(g.cornerPoints, m)
					};
				} catch (l) {
					g = l.message || l;
					if (/not implemented|service unavailable/.test(g)) return e._disableBarcodeDetector = !0, e.scanImage(a, {
						scanRegion: m,
						canvas: d,
						disallowCanvasResizing: f,
						alsoTryWithoutScanRegion: h
					});
					throw `Scanner error: ${g}`;
				}
			})()]);
			return n ? q : q.data;
		} catch (p) {
			if (!m || !h) throw p;
			let k = await e.scanImage(a, {
				qrEngine: c,
				canvas: d,
				disallowCanvasResizing: f
			});
			return n ? k : k.data;
		} finally {
			b || e._postWorkerMessage(c, "close");
		}
	}
	setGrayscaleWeights(a, b, c, d = !0) {
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
		a = () => __vitePreload(() => import("./qr-scanner-worker.min-Cefljozt.js").then((c) => c.createWorker()), []);
		if (!(!e._disableBarcodeDetector && "BarcodeDetector" in window && BarcodeDetector.getSupportedFormats && (await BarcodeDetector.getSupportedFormats()).includes("qr_code"))) return a();
		let b = navigator.userAgentData;
		return b && b.brands.some(({ brand: c }) => /Chromium/i.test(c)) && /mac ?OS/i.test(b.platform) && await b.getHighEntropyValues(["architecture", "platformVersion"]).then(({ architecture: c, platformVersion: d }) => /arm/i.test(c || "arm") && 13 <= parseInt(d || "13")).catch(() => !0) ? a() : new BarcodeDetector({ formats: ["qr_code"] });
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
		return {
			x: Math.round((a.videoWidth - b) / 2),
			y: Math.round((a.videoHeight - b) / 2),
			width: b,
			height: b,
			downScaledWidth: this._legacyCanvasSize,
			downScaledHeight: this._legacyCanvasSize
		};
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
					default: ("cover" === p ? k > q : k < q) ? (l = f, g = l * k) : (g = d, l = g / k), "scale-down" === p && (g = Math.min(g, b), l = Math.min(l, c));
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
					var c = await e.scanImage(this.$video, {
						scanRegion: this._scanRegion,
						qrEngine: this._qrEnginePromise,
						canvas: this.$canvas
					});
				} catch (d) {
					if (!this._active) return;
					this._onDecodeError(d);
				}
				!e._disableBarcodeDetector || await this._qrEnginePromise instanceof Worker || (this._qrEnginePromise = e.createQrEngine());
				c ? (this._onDecode ? this._onDecode(c) : this._legacyOnDecode && this._legacyOnDecode(c.data), this.$codeOutlineHighlight && (clearTimeout(this._codeOutlineHighlightRemovalTimeout), this._codeOutlineHighlightRemovalTimeout = void 0, this.$codeOutlineHighlight.setAttribute("viewBox", `${this._scanRegion.x || 0} ${this._scanRegion.y || 0} ${this._scanRegion.width || this.$video.videoWidth} ${this._scanRegion.height || this.$video.videoHeight}`), this.$codeOutlineHighlight.firstElementChild.setAttribute("points", c.cornerPoints.map(({ x: d, y: f }) => `${d},${f}`).join(" ")), this.$codeOutlineHighlight.style.display = "")) : this.$codeOutlineHighlight && !this._codeOutlineHighlightRemovalTimeout && (this._codeOutlineHighlightRemovalTimeout = setTimeout(() => this.$codeOutlineHighlight.style.display = "none", 100));
			}
			this._scanFrame();
		});
	}
	_onDecodeError(a) {
		a !== e.NO_QR_CODE_FOUND && console.log(a);
	}
	async _getCameraStream() {
		if (!navigator.mediaDevices) throw "Camera not found.";
		let a = /^(environment|user)$/.test(this._preferredCamera) ? "facingMode" : "deviceId", b = [
			{ width: { min: 1024 } },
			{ width: { min: 768 } },
			{}
		], c = b.map((d) => Object.assign({}, d, { [a]: { exact: this._preferredCamera } }));
		for (let d of [...c, ...b]) try {
			let f = await navigator.mediaDevices.getUserMedia({
				video: d,
				audio: !1
			});
			return {
				stream: f,
				facingMode: this._getFacingMode(f) || (d.facingMode ? this._preferredCamera : "environment" === this._preferredCamera ? "user" : "environment")
			};
		} catch (f) {}
		throw "Camera not found.";
	}
	async _restartVideoStream() {
		let a = this._paused;
		await this.pause(!0) && !a && this._active && await this.start();
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
	static _drawToCanvas(a, b, c, d = !1) {
		c = c || document.createElement("canvas");
		let f = b && b.x ? b.x : 0, h = b && b.y ? b.y : 0, m = b && b.width ? b.width : a.videoWidth || a.width, n = b && b.height ? b.height : a.videoHeight || a.height;
		d || (d = b && b.downScaledWidth ? b.downScaledWidth : m, b = b && b.downScaledHeight ? b.downScaledHeight : n, c.width !== d && (c.width = d), c.height !== b && (c.height = b));
		b = c.getContext("2d", { alpha: !1 });
		b.imageSmoothingEnabled = !1;
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
		a.postMessage({
			id: f,
			type: b,
			data: c
		}, d);
		return f;
	}
};
e.DEFAULT_CANVAS_SIZE = 400;
e.NO_QR_CODE_FOUND = "No QR code found";
e._disableBarcodeDetector = !1;
e._workerMessageId = 0;
//#endregion
//#region src/lib/components/QrScanner.svelte
var root$1 = from_html(`<button class="action-btn svelte-9udi3b">Start Camera</button>`);
var root_1$1 = from_html(`<button class="action-btn danger svelte-9udi3b">Stop Camera</button>`);
var root_2$1 = from_html(`<button class="control-btn svelte-9udi3b">Reset Scanner</button>`);
var root_3$1 = from_html(`<div class="multipart-message svelte-9udi3b"><strong>Multipart mode:</strong> Keep scanning until all parts are collected<br/> <span> </span></div>`);
var root_4$1 = from_html(`<div class="video-container svelte-9udi3b"><video autoplay="" playsinline="" width="500" height="300" class="svelte-9udi3b"></video> <p class="scanner-instructions svelte-9udi3b">Position the QR code displayed on the Keystone within the camera view</p> <!></div>`, 2);
var root_5$1 = from_html(`<div class="error-message svelte-9udi3b"><strong>Error:</strong> </div>`);
var root_6$1 = from_html(`<div class="error-message svelte-9udi3b"><strong>Scan Error:</strong> </div>`);
var root_7$1 = from_html(`<div class="multipart-progress svelte-9udi3b"><div class="progress-bar svelte-9udi3b"><div class="progress-fill svelte-9udi3b"></div></div> <span class="progress-text svelte-9udi3b"> </span></div>`);
var root_8$1 = from_html(`<div class="debug-info svelte-9udi3b"><strong>Debug:</strong> <!></div>`);
var root_9$1 = from_html(`<div class="qr-scanner svelte-9udi3b"><p class="info svelte-9udi3b">On your Keystone device, navigate to the IOTA wallet and generate a connection QR code. Then
        use the camera scanner below to scan it and capture your account information.</p> <div class="scanner-controls svelte-9udi3b"><!> <button class="control-btn svelte-9udi3b">Check Camera</button> <!></div> <!> <!> <!> <!></div>`);
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
	/**
	* Initialize QR scanner
	*/
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
			qrScanner = new e(get(videoElement), (result) => {
				console.log("QR code scanned:", result.data);
				dispatch("scanResult", result.data);
			}, {
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true
			});
			console.log("QR Scanner created successfully");
		} catch (error) {
			console.error("Failed to create QR scanner:", error);
			const errorMsg = "Failed to initialize scanner: " + error.message;
			set(connectionError, errorMsg);
			dispatch("connectionError", errorMsg);
		}
	}
	/**
	* Check camera support and permissions
	*/
	async function checkCameraSupport() {
		try {
			set(debugInfo, "Checking camera support...");
			const hasCamera = await e.hasCamera();
			console.log("Has camera:", hasCamera);
			if (!hasCamera) throw new Error("No camera found on this device");
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
	/**
	* Start QR code scanning
	*/
	async function startScanning() {
		console.log("Starting scanner...");
		set(debugInfo, "Starting scanner...");
		try {
			set(connectionError, "");
			set(scanError, "");
			dispatch("connectionError", "");
			dispatch("error", "");
			if (!await checkCameraSupport()) return;
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
			if (!qrScanner) throw new Error("Scanner not initialized - video element may not be available");
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
	/**
	* Stop QR code scanning
	*/
	function stopScanning() {
		if (qrScanner) {
			qrScanner.stop();
			qrScanner.destroy();
			qrScanner = null;
		}
		set(scanning, false);
		set(videoElement, null);
	}
	/**
	* Check camera support (exposed function)
	*/
	function checkCamera() {
		return checkCameraSupport();
	}
	/**
	* Reset scanner state
	*/
	function reset$1() {
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
	var $$exports = {
		startScanning,
		stopScanning,
		checkCamera,
		reset: reset$1
	};
	init();
	var div = root_9$1();
	var div_1 = sibling(child(div), 2);
	var node = child(div_1);
	var consequent = ($$anchor) => {
		var button = root$1();
		event("click", button, startScanning);
		append($$anchor, button);
	};
	var alternate = ($$anchor) => {
		var button_1 = root_1$1();
		event("click", button_1, stopScanning);
		append($$anchor, button_1);
	};
	if_block(node, ($$render) => {
		if (!get(scanning)) $$render(consequent);
		else $$render(alternate, -1);
	});
	var button_2 = sibling(node, 2);
	var node_1 = sibling(button_2, 2);
	var consequent_1 = ($$anchor) => {
		var button_3 = root_2$1();
		event("click", button_3, reset$1);
		append($$anchor, button_3);
	};
	if_block(node_1, ($$render) => {
		if (get(connectionError) || get(scanError)) $$render(consequent_1);
	});
	reset(div_1);
	var node_2 = sibling(div_1, 2);
	var consequent_3 = ($$anchor) => {
		var div_2 = root_4$1();
		var video = child(div_2);
		video.muted = true;
		bind_this(video, ($$value) => set(videoElement, $$value), () => get(videoElement));
		var node_3 = sibling(video, 4);
		var consequent_2 = ($$anchor) => {
			var div_3 = root_3$1();
			var span = sibling(child(div_3), 4);
			var text = child(span);
			reset(span);
			reset(div_3);
			template_effect(() => set_text(text, `Received ${receivedParts() ?? ""} of ${expectedParts() ?? ""} parts`));
			append($$anchor, div_3);
		};
		if_block(node_3, ($$render) => {
			if (isMultipart()) $$render(consequent_2);
		});
		reset(div_2);
		append($$anchor, div_2);
	};
	if_block(node_2, ($$render) => {
		if (get(scanning)) $$render(consequent_3);
	});
	var node_4 = sibling(node_2, 2);
	var consequent_4 = ($$anchor) => {
		var div_4 = root_5$1();
		var text_1 = sibling(child(div_4));
		reset(div_4);
		template_effect(() => set_text(text_1, ` ${get(connectionError) ?? ""}`));
		append($$anchor, div_4);
	};
	if_block(node_4, ($$render) => {
		if (get(connectionError)) $$render(consequent_4);
	});
	var node_5 = sibling(node_4, 2);
	var consequent_5 = ($$anchor) => {
		var div_5 = root_6$1();
		var text_2 = sibling(child(div_5));
		reset(div_5);
		template_effect(() => set_text(text_2, ` ${get(scanError) ?? ""}`));
		append($$anchor, div_5);
	};
	if_block(node_5, ($$render) => {
		if (get(scanError)) $$render(consequent_5);
	});
	var node_6 = sibling(node_5, 2);
	var consequent_7 = ($$anchor) => {
		var div_6 = root_8$1();
		var text_3 = sibling(child(div_6));
		var node_7 = sibling(text_3);
		var consequent_6 = ($$anchor) => {
			var div_7 = root_7$1();
			var div_8 = child(div_7);
			var div_9 = child(div_8);
			reset(div_8);
			var span_1 = sibling(div_8, 2);
			var text_4 = child(span_1);
			reset(span_1);
			reset(div_7);
			template_effect(() => {
				set_style(div_9, `width: ${receivedParts() / expectedParts() * 100}%`);
				set_text(text_4, `${receivedParts() ?? ""}/${expectedParts() ?? ""} parts received`);
			});
			append($$anchor, div_7);
		};
		if_block(node_7, ($$render) => {
			if (isMultipart() && expectedParts() > 0) $$render(consequent_6);
		});
		reset(div_6);
		template_effect(() => set_text(text_3, ` ${get(debugInfo) ?? ""} `));
		append($$anchor, div_6);
	};
	if_block(node_6, ($$render) => {
		if (get(debugInfo)) $$render(consequent_7);
	});
	reset(div);
	event("click", button_2, checkCameraSupport);
	append($$anchor, div);
	bind_prop($$props, "startScanning", startScanning);
	bind_prop($$props, "stopScanning", stopScanning);
	bind_prop($$props, "checkCamera", checkCamera);
	bind_prop($$props, "reset", reset$1);
	return pop($$exports);
}
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/RegistryType.ts
var RegistryType = class {
	type;
	tag;
	constructor(type, tag) {
		this.type = type;
		this.tag = tag;
	}
	getTag = () => this.tag;
	getType = () => this.type;
};
var RegistryTypes$3 = {
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
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/ScriptExpression.ts
var ScriptExpression = class {
	tag;
	expression;
	constructor(tag, expression) {
		this.tag = tag;
		this.expression = expression;
	}
	getTag = () => this.tag;
	getExpression = () => this.expression;
	static fromTag = (tag) => {
		return Object.values(ScriptExpressions).find((se) => se.getTag() === tag);
	};
};
var ScriptExpressions = {
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
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/lib/DataItem.ts
var DataItem = class {
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
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/lib/cbor-sync.js
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
			for (var i = 0; i < this.$hex.length; i += 2) encoded += "%" + this.$hex.substring(i, i + 2);
			return decodeURIComponent(encoded);
		}
		if (format === "latin") {
			var encoded = [];
			for (var i = 0; i < this.$hex.length; i += 2) encoded.push(parseInt(this.$hex.substring(i, i + 2), 16));
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
	for (var i = 0; i < encoded.length; i++) if (encoded.charAt(i) === "%") {
		hex += encoded.substring(i + 1, i + 3);
		i += 2;
	} else {
		var hexPair = encoded.charCodeAt(i).toString(16);
		if (hexPair.length < 2) hexPair = "0" + hexPair;
		hex += hexPair;
	}
	return new BinaryHex(hex);
};
var notImplemented = function(label) {
	return function() {
		throw new Error(label + " not implemented");
	};
};
function Reader() {}
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
			if (mantissa === 0) return negative ? -Infinity : Infinity;
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
			if (mantissa === 0) return negative ? -Infinity : Infinity;
			return NaN;
		}
		var magnitude = exponent ? Math.pow(2, exponent - 23 - 127) * (8388608 + mantissa) : Math.pow(2, -149) * mantissa;
		return negative ? -magnitude : magnitude;
	},
	readFloat64: function() {
		var int1 = this.readUint32(), int2 = this.readUint32();
		var exponent = int1 >> 20 & 2047;
		var mantissa = (int1 & 1048575) * 4294967296 + int2;
		var negative = int1 & 2147483648;
		if (exponent === 2047) {
			if (mantissa === 0) return negative ? -Infinity : Infinity;
			return NaN;
		}
		var magnitude = exponent ? Math.pow(2, exponent - 52 - 1023) * (4503599627370496 + mantissa) : Math.pow(2, -1074) * mantissa;
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
function Writer() {}
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
		if (value >= 9007199254740992 || value <= -9007199254740992) throw new Error("Cannot encode Uint64 of: " + value + " magnitude to big (floating point errors)");
		this.writeUint32(Math.floor(value / 4294967296));
		this.writeUint32(value % 4294967296);
	},
	writeString: notImplemented("writeString"),
	canWriteBinary: function(_chunk) {
		return false;
	},
	writeBinary: notImplemented("writeChunk")
};
function readHeaderRaw(reader) {
	var firstByte = reader.readByte();
	return {
		type: firstByte >> 5,
		value: firstByte & 31
	};
}
function valueFromHeader(header, reader) {
	var value = header.value;
	if (value < 24) return value;
	else if (value == 24) return reader.readByte();
	else if (value == 25) return reader.readUint16();
	else if (value == 26) return reader.readUint32();
	else if (value == 27) return reader.readUint64();
	else if (value == 31) return null;
	notImplemented("Additional info: " + value)();
}
function writeHeaderRaw(type, value, writer) {
	writer.writeByte(type << 5 | value);
}
function writeHeader(type, value, writer) {
	var firstByte = type << 5;
	if (value < 24) writer.writeByte(firstByte | value);
	else if (value < 256) {
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
var stopCode = /* @__PURE__ */ new Error();
function decodeReader(reader) {
	var header = readHeaderRaw(reader);
	switch (header.type) {
		case 0: return valueFromHeader(header, reader);
		case 1: return -1 - valueFromHeader(header, reader);
		case 2: return reader.readChunk(valueFromHeader(header, reader));
		case 3: return reader.readChunk(valueFromHeader(header, reader)).toString("utf-8");
		case 4:
		case 5:
			var arrayLength = valueFromHeader(header, reader);
			var result = [];
			if (arrayLength !== null) {
				if (header.type === 5) arrayLength *= 2;
				for (var i = 0; i < arrayLength; i++) result[i] = decodeReader(reader);
			} else {
				var item;
				while ((item = decodeReader(reader)) !== stopCode) result.push(item);
			}
			if (header.type === 5) {
				var objResult = {};
				for (var i = 0; i < result.length; i += 2) objResult[result[i]] = result[i + 1];
				return objResult;
			} else return result;
		case 6:
			var decoder = semanticDecoders[valueFromHeader(header, reader)];
			var result = decodeReader(reader);
			return decoder ? decoder(result) : result;
		case 7:
			if (header.value === 25) return reader.readFloat16();
			else if (header.value === 26) return reader.readFloat32();
			else if (header.value === 27) return reader.readFloat64();
			switch (valueFromHeader(header, reader)) {
				case 20: return false;
				case 21: return true;
				case 22: return null;
				case 23: return;
				case null: return stopCode;
				default: throw new Error("Unknown fixed value: " + header.value);
			}
		default: throw new Error("Unsupported header: " + JSON.stringify(header));
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
	if (data && typeof data.toCBOR === "function") data = data.toCBOR();
	if (data === false) writeHeader(7, 20, writer);
	else if (data === true) writeHeader(7, 21, writer);
	else if (data === null) writeHeader(7, 22, writer);
	else if (data === void 0) writeHeader(7, 23, writer);
	else if (typeof data === "number") if (Math.floor(data) === data && data < 9007199254740992 && data > -9007199254740992) if (data < 0) writeHeader(1, -1 - data, writer);
	else writeHeader(0, data, writer);
	else {
		writeHeaderRaw(7, 27, writer);
		writer.writeFloat64(data);
	}
	else if (typeof data === "string") writer.writeString(data, function(length) {
		writeHeader(3, length, writer);
	});
	else if (writer.canWriteBinary(data)) writer.writeBinary(data, function(length) {
		writeHeader(2, length, writer);
	});
	else if (typeof data === "object") {
		if (config.useToJSON && typeof data.toJSON === "function") data = data.toJSON();
		if (Array.isArray(data)) {
			writeHeader(4, data.length, writer);
			for (var i = 0; i < data.length; i++) encodeWriter(data[i], writer);
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
	} else throw new Error("CBOR encoding not supported: " + data);
}
var readerFunctions = [];
var writerFunctions = [];
var config = { useToJSON: true };
function addWriter(format, writerFunction) {
	if (typeof format === "string") writerFunctions.push(function(f) {
		if (format === f) return writerFunction(f);
	});
	else writerFunctions.push(format);
}
function addReader(format, readerFunction) {
	if (typeof format === "string") readerFunctions.push(function(data, f) {
		if (format === f) return readerFunction(data, f);
	});
	else readerFunctions.push(format);
}
function encodeDataItem(data, format) {
	for (var i = 0; i < writerFunctions.length; i++) {
		var func = writerFunctions[i];
		var writer = func(format);
		if (writer) if (data.getTag() !== void 0) {
			encodeWriter(data, writer);
			return writer.result();
		} else {
			encodeWriter(data.getData(), writer);
			return writer.result();
		}
	}
	throw new Error("Unsupported output format: " + format);
}
function decodeToDataItem$3(data, format) {
	for (var i = 0; i < readerFunctions.length; i++) {
		var func = readerFunctions[i];
		var reader = func(data, format);
		if (reader) {
			const result = decodeReader(reader);
			if (result instanceof DataItem) return result;
			else return new DataItem(result);
		}
	}
	throw new Error("Unsupported input format: " + format);
}
function addSemanticEncode(tag, fn) {
	if (typeof tag !== "number" || tag % 1 !== 0 || tag < 0) throw new Error("Tag must be a positive integer");
	semanticEncoders.push({
		tag,
		fn
	});
	return this;
}
function addSemanticDecode(tag, fn) {
	if (typeof tag !== "number" || tag % 1 !== 0 || tag < 0) throw new Error("Tag must be a positive integer");
	semanticDecoders[tag] = fn;
	return this;
}
function BufferReader(buffer) {
	this.buffer = buffer;
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
	var result = import_buffer.Buffer.alloc(length);
	this.buffer.copy(result, 0, this.pos, this.pos += length);
	return result;
};
function BufferWriter(stringFormat) {
	this.byteLength = 0;
	this.defaultBufferLength = 16384;
	this.latestBuffer = import_buffer.Buffer.alloc(this.defaultBufferLength);
	this.latestBufferOffset = 0;
	this.completeBuffers = [];
	this.stringFormat = stringFormat;
}
BufferWriter.prototype = Object.create(Writer.prototype);
BufferWriter.prototype.writeByte = function(value) {
	this.latestBuffer[this.latestBufferOffset++] = value;
	if (this.latestBufferOffset >= this.latestBuffer.length) {
		this.completeBuffers.push(this.latestBuffer);
		this.latestBuffer = import_buffer.Buffer.alloc(this.defaultBufferLength);
		this.latestBufferOffset = 0;
	}
	this.byteLength++;
};
BufferWriter.prototype.writeFloat32 = function(value) {
	var buffer = import_buffer.Buffer.alloc(4);
	buffer.writeFloatBE(value, 0);
	this.writeBuffer(buffer);
};
BufferWriter.prototype.writeFloat64 = function(value) {
	var buffer = import_buffer.Buffer.alloc(8);
	buffer.writeDoubleBE(value, 0);
	this.writeBuffer(buffer);
};
BufferWriter.prototype.writeString = function(string, lengthFunc) {
	var buffer = import_buffer.Buffer.from(string, "utf-8");
	lengthFunc(buffer.length);
	this.writeBuffer(buffer);
};
BufferWriter.prototype.canWriteBinary = function(data) {
	return data instanceof import_buffer.Buffer;
};
BufferWriter.prototype.writeBinary = function(buffer, lengthFunc) {
	lengthFunc(buffer.length);
	this.writeBuffer(buffer);
};
BufferWriter.prototype.writeBuffer = function(chunk) {
	if (!(chunk instanceof import_buffer.Buffer)) throw new TypeError("BufferWriter only accepts Buffers");
	if (!this.latestBufferOffset) this.completeBuffers.push(chunk);
	else if (this.latestBuffer.length - this.latestBufferOffset >= chunk.length) {
		chunk.copy(this.latestBuffer, this.latestBufferOffset);
		this.latestBufferOffset += chunk.length;
		if (this.latestBufferOffset >= this.latestBuffer.length) {
			this.completeBuffers.push(this.latestBuffer);
			this.latestBuffer = import_buffer.Buffer.alloc(this.defaultBufferLength);
			this.latestBufferOffset = 0;
		}
	} else {
		this.completeBuffers.push(this.latestBuffer.slice(0, this.latestBufferOffset));
		this.completeBuffers.push(chunk);
		this.latestBuffer = import_buffer.Buffer.alloc(this.defaultBufferLength);
		this.latestBufferOffset = 0;
	}
	this.byteLength += chunk.length;
};
BufferWriter.prototype.result = function() {
	var result = import_buffer.Buffer.alloc(this.byteLength);
	var offset = 0;
	for (var i = 0; i < this.completeBuffers.length; i++) {
		var buffer = this.completeBuffers[i];
		buffer.copy(result, offset, 0, buffer.length);
		offset += buffer.length;
	}
	if (this.latestBufferOffset) this.latestBuffer.copy(result, offset, 0, this.latestBufferOffset);
	if (this.stringFormat) return result.toString(this.stringFormat);
	return result;
};
if (typeof import_buffer.Buffer === "function") {
	addReader(function(data, format) {
		if (import_buffer.Buffer.isBuffer(data)) return new BufferReader(data);
		if (format === "hex" || format === "base64") return new BufferReader(import_buffer.Buffer.from(data, format));
	});
	addWriter(function(format) {
		if (!format || format === "buffer") return new BufferWriter();
		else if (format === "hex" || format === "base64") return new BufferWriter(format);
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
	if (typeof import_buffer.Buffer === "function") return import_buffer.Buffer.from(hex, "hex");
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
	if (hex.length == 1) hex = "0" + hex;
	this.$hex += hex;
};
HexWriter.prototype.canWriteBinary = function(chunk) {
	return chunk instanceof BinaryHex || typeof import_buffer.Buffer === "function" && chunk instanceof import_buffer.Buffer;
};
HexWriter.prototype.writeBinary = function(chunk, lengthFunction) {
	if (chunk instanceof BinaryHex) {
		lengthFunction(chunk.length());
		this.$hex += chunk.$hex;
	} else if (typeof import_buffer.Buffer === "function" && chunk instanceof import_buffer.Buffer) {
		lengthFunction(chunk.length);
		this.$hex += chunk.toString("hex");
	} else throw new TypeError("HexWriter only accepts BinaryHex or Buffers");
};
HexWriter.prototype.result = function() {
	if (this.finalFormat === "buffer" && typeof import_buffer.Buffer === "function") return import_buffer.Buffer.from(this.$hex, "hex");
	return new BinaryHex(this.$hex).toString(this.finalFormat);
};
HexWriter.prototype.writeString = function(string, lengthFunction) {
	var buffer = BinaryHex.fromUtf8String(string);
	lengthFunction(buffer.length());
	this.$hex += buffer.$hex;
};
addReader(function(data, format) {
	if (data instanceof BinaryHex || data.$hex) return new HexReader(data.$hex);
	if (format === "hex") return new HexReader(data);
});
addWriter(function(format) {
	if (format === "hex") return new HexWriter();
});
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/utils.ts
var alreadyPatchedTag = [];
var patchTags = (tags) => {
	tags.forEach((tag) => {
		if (alreadyPatchedTag.find((i) => i === tag)) return;
		addSemanticEncode(tag, (data) => {
			if (data instanceof DataItem) {
				if (data.getTag() === tag) return data.getData();
			}
		});
		addSemanticDecode(tag, (data) => {
			return new DataItem(data, tag);
		});
		alreadyPatchedTag.push(tag);
	});
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/patchCBOR.ts
var registryTags = Object.values(RegistryTypes$3).filter((r) => !!r.getTag()).map((r) => r.getTag());
var scriptExpressionTags = Object.values(ScriptExpressions).map((se) => se.getTag());
patchTags(registryTags.concat(scriptExpressionTags));
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/RegistryItem.ts
var RegistryItem = class {
	toCBOR = () => {
		if (this.toDataItem() === void 0) throw new Error(`#[ur-registry][RegistryItem][fn.toCBOR]: registry ${this.getRegistryType()}'s method toDataItem returns undefined`);
		return encodeDataItem(this.toDataItem());
	};
	toUR = () => {
		return new UR(this.toCBOR(), this.getRegistryType().getType());
	};
	toUREncoder = (maxFragmentLength, firstSeqNum, minFragmentLength) => {
		return new UREncoder(this.toUR(), maxFragmentLength, firstSeqNum, minFragmentLength);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/CryptoCoinInfo.ts
var CryptoCoinInfo = class CryptoCoinInfo extends RegistryItem {
	type;
	network;
	getRegistryType = () => {
		return RegistryTypes$3.CRYPTO_COIN_INFO;
	};
	constructor(type, network) {
		super();
		this.type = type;
		this.network = network;
	}
	getType = () => {
		return this.type || 0;
	};
	getNetwork = () => {
		return this.network || 0;
	};
	toDataItem = () => {
		const map = {};
		if (this.type) map["1"] = this.type;
		if (this.network) map["2"] = this.network;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const type = map["1"];
		const network = map["2"];
		return new CryptoCoinInfo(type, network);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return CryptoCoinInfo.fromDataItem(dataItem);
	};
};
//#endregion
//#region node_modules/.pnpm/base-x@5.0.1/node_modules/base-x/src/esm/index.js
function base(ALPHABET) {
	if (ALPHABET.length >= 255) throw new TypeError("Alphabet too long");
	const BASE_MAP = /* @__PURE__ */ new Uint8Array(256);
	for (let j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (let i = 0; i < ALPHABET.length; i++) {
		const x = ALPHABET.charAt(i);
		const xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	const BASE = ALPHABET.length;
	const LEADER = ALPHABET.charAt(0);
	const FACTOR = Math.log(BASE) / Math.log(256);
	const iFACTOR = Math.log(256) / Math.log(BASE);
	function encode(source) {
		if (source instanceof Uint8Array) {} else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		let zeroes = 0;
		let length = 0;
		let pbegin = 0;
		const pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		const b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			let carry = source[pbegin];
			let i = 0;
			for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		let it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		let str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return /* @__PURE__ */ new Uint8Array();
		let psz = 0;
		let zeroes = 0;
		let length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		const size = (source.length - psz) * FACTOR + 1 >>> 0;
		const b256 = new Uint8Array(size);
		while (psz < source.length) {
			const charCode = source.charCodeAt(psz);
			if (charCode > 255) return;
			let carry = BASE_MAP[charCode];
			if (carry === 255) return;
			let i = 0;
			for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		let it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		const vch = new Uint8Array(zeroes + (size - it4));
		let j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	function decode(string) {
		const buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error("Non-base" + BASE + " character");
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var esm_default$1 = base("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
//#endregion
//#region node_modules/.pnpm/bs58check@4.0.0/node_modules/bs58check/src/esm/base.js
function base_default(checksumFn) {
	function encode(payload) {
		var payloadU8 = Uint8Array.from(payload);
		var checksum = checksumFn(payloadU8);
		var length = payloadU8.length + 4;
		var both = new Uint8Array(length);
		both.set(payloadU8, 0);
		both.set(checksum.subarray(0, 4), payloadU8.length);
		return esm_default$1.encode(both);
	}
	function decodeRaw(buffer) {
		var payload = buffer.slice(0, -4);
		var checksum = buffer.slice(-4);
		var newChecksum = checksumFn(payload);
		if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) return;
		return payload;
	}
	function decodeUnsafe(str) {
		var buffer = esm_default$1.decodeUnsafe(str);
		if (buffer == null) return;
		return decodeRaw(buffer);
	}
	function decode(str) {
		var payload = decodeRaw(esm_default$1.decode(str));
		if (payload == null) throw new Error("Invalid checksum");
		return payload;
	}
	return {
		encode,
		decode,
		decodeUnsafe
	};
}
//#endregion
//#region node_modules/.pnpm/bs58check@4.0.0/node_modules/bs58check/src/esm/index.js
function sha256x2(buffer) {
	return sha256(sha256(buffer));
}
var esm_default = base_default(sha256x2);
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/PathComponent.ts
var PathComponent = class PathComponent {
	static HARDENED_BIT = 2147483648;
	index;
	wildcard;
	hardened;
	constructor(args) {
		this.index = args.index;
		this.hardened = args.hardened;
		if (this.index !== void 0) this.wildcard = false;
		else this.wildcard = true;
		if (this.index && (this.index & PathComponent.HARDENED_BIT) !== 0) throw new Error(`#[ur-registry][PathComponent][fn.constructor]: Invalid index ${this.index} - most significant bit cannot be set`);
	}
	getIndex = () => this.index;
	isWildcard = () => this.wildcard;
	isHardened = () => this.hardened;
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/CryptoKeypath.ts
var CryptoKeypath = class CryptoKeypath extends RegistryItem {
	components;
	sourceFingerprint;
	depth;
	getRegistryType = () => {
		return RegistryTypes$3.CRYPTO_KEYPATH;
	};
	constructor(components = [], sourceFingerprint, depth) {
		super();
		this.components = components;
		this.sourceFingerprint = sourceFingerprint;
		this.depth = depth;
	}
	getPath = () => {
		if (this.components.length === 0) return;
		return this.components.map((component) => {
			return `${component.isWildcard() ? "*" : component.getIndex()}${component.isHardened() ? "'" : ""}`;
		}).join("/");
	};
	getComponents = () => this.components;
	getSourceFingerprint = () => this.sourceFingerprint;
	getDepth = () => this.depth;
	toDataItem = () => {
		const map = {};
		const components = [];
		this.components?.forEach((component) => {
			if (component.isWildcard()) components.push([]);
			else components.push(component.getIndex());
			components.push(component.isHardened());
		});
		map[1] = components;
		if (this.sourceFingerprint) map[2] = this.sourceFingerprint.readUInt32BE(0);
		if (this.depth !== void 0) map[3] = this.depth;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const pathComponents = [];
		const components = map[1];
		if (components) for (let i = 0; i < components.length; i += 2) {
			const isHardened = components[i + 1];
			const path = components[i];
			if (typeof path === "number") pathComponents.push(new PathComponent({
				index: path,
				hardened: isHardened
			}));
			else pathComponents.push(new PathComponent({ hardened: isHardened }));
		}
		const _sourceFingerprint = map[2];
		let sourceFingerprint;
		if (_sourceFingerprint) {
			sourceFingerprint = import_buffer.Buffer.alloc(4);
			sourceFingerprint.writeUInt32BE(_sourceFingerprint, 0);
		}
		const depth = map[3];
		return new CryptoKeypath(pathComponents, sourceFingerprint, depth);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return CryptoKeypath.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/CryptoHDKey.ts
var { encode } = esm_default;
var CryptoHDKey = class CryptoHDKey extends RegistryItem {
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
		let index = 0;
		let parentFingerprint = import_buffer.Buffer.alloc(4).fill(0);
		if (this.isMaster()) {
			version = import_buffer.Buffer.from("0488ADE4", "hex");
			depth = 0;
			index = 0;
		} else {
			depth = this.getOrigin()?.getComponents().length || this.getOrigin()?.getDepth();
			const paths = this.getOrigin()?.getComponents();
			const lastPath = paths[paths.length - 1];
			if (lastPath) {
				index = lastPath.isHardened() ? lastPath.getIndex() + 2147483648 : lastPath.getIndex();
				if (this.getParentFingerprint()) parentFingerprint = this.getParentFingerprint();
			}
			if (this.isPrivateKey()) version = import_buffer.Buffer.from("0488ADE4", "hex");
			else version = import_buffer.Buffer.from("0488B21E", "hex");
		}
		const depthBuffer = import_buffer.Buffer.alloc(1);
		depthBuffer.writeUInt8(depth, 0);
		const indexBuffer = import_buffer.Buffer.alloc(4);
		indexBuffer.writeUInt32BE(index, 0);
		const chainCode = this.getChainCode();
		const key = this.getKey();
		return encode(import_buffer.Buffer.concat([
			version,
			depthBuffer,
			parentFingerprint,
			indexBuffer,
			chainCode,
			key
		]));
	};
	getRegistryType = () => {
		return RegistryTypes$3.CRYPTO_HDKEY;
	};
	getOutputDescriptorContent = () => {
		let result = "";
		if (this.getOrigin()) {
			if (this.getOrigin()?.getSourceFingerprint() && this.getOrigin()?.getPath()) result += `${this.getOrigin()?.getSourceFingerprint()?.toString("hex")}/${this.getOrigin()?.getPath()}`;
		}
		result += this.getBip32Key();
		if (this.getChildren()) {
			if (this.getChildren()?.getPath()) result += `/${this.getChildren()?.getPath()}`;
		}
		return result;
	};
	constructor(args) {
		super();
		if (args.isMaster) this.setupMasterKey(args);
		else this.setupDeriveKey(args);
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
			map[1] = true;
			map[3] = this.key;
			map[4] = this.chainCode;
		} else {
			if (this.privateKey !== void 0) map[2] = this.privateKey;
			map[3] = this.key;
			if (this.chainCode) map[4] = this.chainCode;
			if (this.useInfo) {
				const useInfo = this.useInfo.toDataItem();
				useInfo.setTag(this.useInfo.getRegistryType().getTag());
				map[5] = useInfo;
			}
			if (this.origin) {
				const origin = this.origin.toDataItem();
				origin.setTag(this.origin.getRegistryType().getTag());
				map[6] = origin;
			}
			if (this.children) {
				const children = this.children.toDataItem();
				children.setTag(this.children.getRegistryType().getTag());
				map[7] = children;
			}
			if (this.parentFingerprint) map[8] = this.parentFingerprint.readUInt32BE(0);
			if (this.name !== void 0) map[9] = this.name;
			if (this.note !== void 0) map[10] = this.note;
		}
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const isMaster = !!map[1];
		const isPrivateKey = map[2];
		const key = map[3];
		const chainCode = map[4];
		const useInfo = map[5] ? CryptoCoinInfo.fromDataItem(map[5]) : void 0;
		const origin = map[6] ? CryptoKeypath.fromDataItem(map[6]) : void 0;
		const children = map[7] ? CryptoKeypath.fromDataItem(map[7]) : void 0;
		const _parentFingerprint = map[8];
		let parentFingerprint = void 0;
		if (_parentFingerprint) {
			parentFingerprint = import_buffer.Buffer.alloc(4);
			parentFingerprint.writeUInt32BE(_parentFingerprint, 0);
		}
		const name = map[9];
		const note = map[10];
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
		const dataItem = decodeToDataItem$3(_cborPayload);
		return CryptoHDKey.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/extended/CryptoMultiAccounts.ts
var CryptoMultiAccounts = class CryptoMultiAccounts extends RegistryItem {
	masterFingerprint;
	keys;
	device;
	deviceId;
	version;
	getRegistryType = () => RegistryTypes$3.CRYPTO_MULTI_ACCOUNTS;
	constructor(masterFingerprint, keys, device, deviceId, version) {
		super();
		this.masterFingerprint = masterFingerprint;
		this.keys = keys;
		this.device = device;
		this.deviceId = deviceId;
		this.version = version;
	}
	getMasterFingerprint = () => this.masterFingerprint;
	getKeys = () => this.keys;
	getDevice = () => this.device;
	getDeviceId = () => this.deviceId;
	getVersion = () => this.version;
	toDataItem = () => {
		const map = {};
		if (this.masterFingerprint) map[1] = this.masterFingerprint.readUInt32BE(0);
		if (this.keys) map[2] = this.keys.map((item) => {
			const dataItem = item.toDataItem();
			dataItem.setTag(item.getRegistryType().getTag());
			return dataItem;
		});
		if (this.device) map[3] = this.device;
		if (this.deviceId) map[4] = this.deviceId;
		if (this.version) map[5] = this.version;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const masterFingerprint = import_buffer.Buffer.alloc(4);
		const _masterFingerprint = map[1];
		if (_masterFingerprint) masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
		const cryptoHDKeys = map[2].map((item) => CryptoHDKey.fromDataItem(item));
		const device = map[3];
		const deviceId = map[4];
		const version = map[5];
		return new CryptoMultiAccounts(masterFingerprint, cryptoHDKeys, device, deviceId, version);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return CryptoMultiAccounts.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/extended/DerivationSchema.ts
var Curve = /* @__PURE__ */ function(Curve) {
	Curve[Curve["secp256k1"] = 0] = "secp256k1";
	Curve[Curve["ed25519"] = 1] = "ed25519";
	return Curve;
}({});
var DerivationAlgorithm = /* @__PURE__ */ function(DerivationAlgorithm) {
	DerivationAlgorithm[DerivationAlgorithm["slip10"] = 0] = "slip10";
	DerivationAlgorithm[DerivationAlgorithm["bip32ed25519"] = 1] = "bip32ed25519";
	return DerivationAlgorithm;
}({});
var KeyDerivationSchema = class KeyDerivationSchema extends RegistryItem {
	keypath;
	curve;
	algo;
	chainType;
	getRegistryType = () => RegistryTypes$3.KEY_DERIVATION_SCHEMA;
	constructor(keypath, curve = 0, algo = 0, chainType) {
		super();
		this.keypath = keypath;
		this.curve = curve;
		this.algo = algo;
		this.chainType = chainType;
	}
	getKeypath = () => this.keypath;
	getCurve = () => this.curve;
	getAlgo = () => this.algo;
	getChainType = () => this.chainType || "";
	toDataItem = () => {
		const map = {};
		const dataItem = this.getKeypath().toDataItem();
		dataItem.setTag(this.getKeypath().getRegistryType().getTag());
		map[1] = dataItem;
		map[2] = this.curve;
		map[3] = this.algo;
		if (this.chainType) map[4] = this.chainType;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const keypaths = CryptoKeypath.fromDataItem(map[1]);
		const curve = map[2];
		const algo = map[3];
		const chainType = map[4];
		return new KeyDerivationSchema(keypaths, curve, algo, chainType);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return KeyDerivationSchema.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/extended/KeyDerivation.ts
var KeyDerivation = class KeyDerivation extends RegistryItem {
	schemas;
	getRegistryType = () => RegistryTypes$3.KEY_DERIVATION_CALL;
	constructor(schemas) {
		super();
		this.schemas = schemas;
	}
	getSchemas = () => this.schemas;
	toDataItem = () => {
		const map = {};
		map[1] = this.schemas.map((schema) => {
			const dataItem = schema.toDataItem();
			dataItem.setTag(schema.getRegistryType().getTag());
			return dataItem;
		});
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const schemas = dataItem.getData()[1].map((keypath) => KeyDerivationSchema.fromDataItem(keypath));
		return new KeyDerivation(schemas);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return KeyDerivation.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/extended/QRHardwareCall.ts
var QRHardwareCallType = /* @__PURE__ */ function(QRHardwareCallType) {
	QRHardwareCallType[QRHardwareCallType["KeyDerivation"] = 0] = "KeyDerivation";
	return QRHardwareCallType;
}({});
var QRHardwareCallVersion = /* @__PURE__ */ function(QRHardwareCallVersion) {
	QRHardwareCallVersion[QRHardwareCallVersion["V0"] = 0] = "V0";
	QRHardwareCallVersion[QRHardwareCallVersion["V1"] = 1] = "V1";
	return QRHardwareCallVersion;
}({});
var QRHardwareCall = class QRHardwareCall extends RegistryItem {
	type;
	params;
	origin;
	version;
	getRegistryType = () => RegistryTypes$3.QR_HARDWARE_CALL;
	constructor(type, params, origin, version) {
		super();
		this.type = type;
		this.params = params;
		this.origin = origin;
		this.version = version;
	}
	getType = () => this.type;
	getParams = () => this.params;
	getOrigin = () => this.origin;
	getVersion = () => this.version;
	toDataItem = () => {
		const map = {};
		map[1] = this.type;
		const param = this.params.toDataItem();
		param.setTag(this.params.getRegistryType().getTag());
		map[2] = param;
		if (this.origin) map[3] = this.origin;
		if (this.version) map[4] = this.version;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const type = map[1] || 0;
		let params;
		switch (type) {
			case 0: params = KeyDerivation.fromDataItem(map[2]);
		}
		const origin = map[3];
		const version = map[4];
		return new QRHardwareCall(type, params, origin, version);
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$3(_cborPayload);
		return QRHardwareCall.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/bc-ur-registry/index.ts
var extend = {
	RegistryTypes: RegistryTypes$3,
	RegistryItem,
	RegistryType,
	decodeToDataItem: decodeToDataItem$3,
	encodeDataItem,
	cbor: {
		addReader,
		addSemanticDecode,
		addSemanticEncode,
		addWriter,
		patchTags
	}
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/RegistryType.ts
var ExtendedRegistryTypes = {
	IOTA_SIGN_REQUEST: new RegistryType("iota-sign-request", 8501),
	IOTA_SIGNATURE: new RegistryType("iota-signature", 8502),
	IOTA_SIGN_HASH_REQUEST: new RegistryType("iota-sign-hash-request", 8503)
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/IotaKeyDerivationCall.ts
var pathToKeypath = (path) => {
	return new CryptoKeypath(path.replace(/[m|M]\//, "").split("/").map((path) => {
		return new PathComponent({
			index: parseInt(path.replace("'", ""), 10),
			hardened: path.endsWith("'")
		});
	}));
};
var generateKeyDerivationCall = ({ schemas, origin }) => {
	const keyDerivation = new KeyDerivation(schemas.map(({ path, curve = Curve.ed25519, algo = DerivationAlgorithm.slip10, chainType = "IOTA" }) => {
		if (curve !== Curve.ed25519 || algo !== DerivationAlgorithm.slip10) throw new Error("Only ed25519 curve with SLIP-10 algorithm is supported for IOTA");
		return new KeyDerivationSchema(pathToKeypath(path), curve, algo, chainType);
	}));
	return new QRHardwareCall(QRHardwareCallType.KeyDerivation, keyDerivation, origin, QRHardwareCallVersion.V1).toUR();
};
//#endregion
//#region node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
//#endregion
//#region node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/validate.js
function validate(uuid) {
	return typeof uuid === "string" && regex_default.test(uuid);
}
//#endregion
//#region node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/parse.js
function parse(uuid) {
	if (!validate(uuid)) throw TypeError("Invalid UUID");
	let v;
	return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255, v / 4294967296 & 255, v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255);
}
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/IotaSignRequest.ts
var { decodeToDataItem: decodeToDataItem$2, RegistryTypes: RegistryTypes$2 } = extend;
var IotaSignRequest = class IotaSignRequest extends RegistryItem {
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
		if (this.requestId) map[1] = new DataItem(this.requestId, RegistryTypes$2.UUID.getTag());
		map[2] = this.intentMessage;
		map[3] = this.derivationPaths.map((path) => {
			const dataItem = path.toDataItem();
			dataItem.setTag(path.getRegistryType().getTag());
			return dataItem;
		});
		if (this.addresses) map[4] = this.addresses;
		if (this.origin) map[5] = this.origin;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const requestId = map[1] ? map[1].getData() : void 0;
		return new IotaSignRequest({
			requestId,
			intentMessage: map[2],
			derivationPaths: map[3].map((path) => CryptoKeypath.fromDataItem(path)),
			addresses: map[4],
			origin: map[5]
		});
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$2(_cborPayload);
		return IotaSignRequest.fromDataItem(dataItem);
	};
	static parsePath(path, xfp) {
		return new CryptoKeypath(path.replace(/[m|M]\//, "").split("/").map((path) => {
			const index = parseInt(path.replace("'", ""));
			let isHardened = false;
			if (path.endsWith("'")) isHardened = true;
			return new PathComponent({
				index,
				hardened: isHardened
			});
		}), import_buffer.Buffer.from(xfp, "hex"));
	}
	static constructIotaSignRequest(intentMessage, derivationPaths, xfp, uuidString, addresses, origin) {
		return new IotaSignRequest({
			requestId: uuidString ? import_buffer.Buffer.from(parse(uuidString)) : void 0,
			intentMessage,
			derivationPaths: derivationPaths.map((path) => IotaSignRequest.parsePath(path, xfp)),
			addresses,
			origin
		});
	}
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/IotaSignature.ts
var { RegistryTypes: RegistryTypes$1, decodeToDataItem: decodeToDataItem$1 } = extend;
var IotaSignature = class IotaSignature extends RegistryItem {
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
		map[1] = new DataItem(this.requestId, RegistryTypes$1.UUID.getTag());
		map[2] = this.signature;
		if (this.publicKey) map[3] = this.publicKey;
		return new DataItem(map);
	};
	static fromDataItem = (dataItem) => {
		const map = dataItem.getData();
		const signature = map[2];
		const requestId = map[1]?.getData();
		const publicKey = map[3];
		return new IotaSignature({
			requestId,
			signature,
			publicKey
		});
	};
	static fromCBOR = (_cborPayload) => {
		const dataItem = decodeToDataItem$1(_cborPayload);
		return IotaSignature.fromDataItem(dataItem);
	};
};
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/IotaSignHashRequest.ts
var { decodeToDataItem, RegistryTypes } = extend;
//#endregion
//#region src/lib/pages/keystone/bc-ur-registry-iota/src/index.ts
patchTags(Object.values(ExtendedRegistryTypes).filter((rt) => !!rt.getTag()).map((rt) => rt.getTag()));
//#endregion
//#region src/lib/pages/keystone/keystone.ts
/**
* Keystone Hardware Wallet - Example Data and Constants
* Contains default values, example transactions, and sample URs for testing
*/
var UR_TYPES = {
	IOTA_SIGNATURE: "iota-signature",
	IOTA_SIGN_REQUEST: "iota-sign-request",
	UR_PREFIX: "ur:"
};
var ADDRESS_PREFIXES = {
	HEX: "0x",
	IOTA1Q: "iota1q"
};
var DEFAULT_DERIVATION_PATHS = "m/44'/4218'/0'/0'/0'";
var DEFAULT_MASTER_FINGERPRINT = "70ee3cac";
var DEFAULT_ACCOUNT_ADDRESS = "0xb9cbe931d4569659e5235346a9361642be3c045112bdc2676dd1e74d14d7c0a2";
var DEFAULT_WALLET_ORIGIN = "IOTA Wallet";
var DEFAULT_REQUEST_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
var EXAMPLE_RAW_TRANSACTION_BYTES_1 = "AAACAAgAypo7AAAAAAAgVTsVB+RtZMfs4jACWZp8XfogU5tbYbqiYDYTtMQdQcQCAgABAQAAAQEDAAAAAAEBAFU7FQfkbWTH7OIwAlmafF36IFObW2G6omA2E7TEHUHEAXzaorDJSfN6qSVVUDHjdog/B1KoxmcB+gSwrJ/B44ahuzcAAAAAAAAgTuYTwz7DtRoLbEVHWVZ/ehscmfPcHKW1aFzwWFydTKVVOxUH5G1kx+ziMAJZmnxd+iBTm1thuqJgNhO0xB1BxOgDAAAAAAAA4G88AAAAAAAA";
var EXAMPLE_RAW_TRANSACTION_BYTES_2 = "AAAFAQGpKmeuioxkSs+m3VpNgJiiCwe2Bhy/Nq/42u87qJKRP0VMyxUAAAAAAQAODW5uYWFtbWVlLmlvdGEACICWmAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAAgVTsVB+RtZMfs4jACWZp8XfogU5tbYbqiYDYTtMQdQcQFAOEoSHABhISnoSJVrrtze2uYtH1lK4QuovMkSZ/xY6ZIB3BheW1lbnQRaW5pdF9yZWdpc3RyYXRpb24AAgEAAAEBAAIAAQECAAAe+si/IArMpktiznVVfNcjIxD8jE6pCWBIfSkIBV/JTwhwYXltZW50cxNoYW5kbGVfYmFzZV9wYXltZW50AQcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgRpb3RhBElPVEEAAwEAAAIAAAIBAADhKEhwAYSEp6EiVa67c3trmLR9ZSuELqLzJEmf8WOmSAdwYXltZW50CHJlZ2lzdGVyAAMCAgABAAABAwABAQIDAAEEAFU7FQfkbWTH7OIwAlmafF36IFObW2G6omA2E7TEHUHEAXzaorDJSfN6qSVVUDHjdog/B1KoxmcB+gSwrJ/B44ahuzcAAAAAAAAgTuYTwz7DtRoLbEVHWVZ/ehscmfPcHKW1aFzwWFydTKVVOxUH5G1kx+ziMAJZmnxd+iBTm1thuqJgNhO0xB1BxOgDAAAAAAAAYHZvAAAAAAAA";
var EXAMPLE_SIGNATURE_HEX = "f4b79835417490958c72492723409289b444f3af18274ba484a9eeaca9e760520e453776e5975df058b537476932a45239685f694fc6362fe5af6ba714da6505";
var EXAMPLE_PUBLIC_KEY_HEX = "bfa73107effa14b21ff1b9ae2e6b2e770232b7c29018abbf76475b25395369c0";
var EXAMPLE_DECODE_SIGN_REQUEST_UR = "UR:IOTA-SIGN-REQUEST/OXADTPDAGDWLTPPLWPDEHEFDGULGKOPSJTKEOXLSHPAOHDUOAEAEAEAEAEAOAEAYAESGNYFRAEAEAEAEAECXIDHNWKLNAMUYWLGOGLGWGSAOKOTYGADTNTCWCEDRNDGHHDIDWLTNURWKFRJOFMEOAOAOAEADADAEAEADADAOAEAEADADAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEVTJLFNAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAOYKAEYKAEYKAOCYJOWYFNPSAALYHDCXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSWDFZPTVO";
var EXAMPLE_SIGNATURE_UR = "UR:IOTA-SIGNATURE/OTADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHDFZTDOLDWQZUYGLUYHGCKGOFNIHMTVAONCHENTYKBJOAOHFCAKEJKBNKNLRYTTBTADNDIIYQDWLZEYTAXTBIAOYPSDNBETDLDLKGTMKLAWFFGNTCTJEJPSGIHHKNYLNLUAXAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXYNMEOXBT";
var EXAMPLE_MULTIPART_SIGN_REQUEST_UR = `UR:IOTA-SIGN-REQUEST/1-2/LPADAOCFAONSCYKBBBMWSSHKADGLONADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHKAOEMAEAEAEAEAEAHADADPTDRIOPLLELKIEGETKOLUTHTGTLAMKOEBDATRPAMCERSENPEYATNWSFRPDMOMEFHFEGSSBBZAEAEAEAEADAEBABTJTJTHSHSJNJNIHIHDMINJLJYHSAEAYLAMTMKAEAEAEAEAEADADAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAMADAEAEAEAEAEAEAEAEAECXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSAHAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYBYINJTINJYHEJPIHIOINJKJYJPHSJYINJLJTAEAOADAEAEADADAEAOAEADADAOAEAECKZSSPRSCXBKSFOLGRIDTOKPGOKETSCNCNBEZTLKGLPTASHNFDKIDTAYAHHESOGWAYJOHSKKJNIHJTJYJKBWISHSJTIEJZIHHEIDHSJKIHHEJOHSKKJNIHJTJYADATAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAETONSWTRT
UR:IOTA-SIGN-REQUEST/2-2/LPAOAOCFAONSCYKBBBMWSSHKADGLAEAEAEAEAEAEAEAEAEAEAEAEAOAAINJLJYHSAAGAGWGHFPAEAXADAEAEAOAEAEAOADAEAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYAYJPIHIOINJKJYIHJPAEAXAOAOAEADAEAEADAXAEADADAOAXAEADAAAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEHNKOJLAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAALYHDCXRHSBWLEHTYHFMTHKVWCNGUFGPTENCMFWRNFNAAGYBGRYSAIOJNTTVDGTBBTSRTOEAHJEGAGWGHFPCXHGHSJZJZIHJYWZESHLIH
UR:IOTA-SIGN-REQUEST/3-2/LPAXAOCFAONSCYKBBBMWSSHKADGLONADTPDAGDNDCAWMGTFRKIGRPMNDUTDNBTKGFSSBJNAOHKAOEMAEAEAEAEAEAHADADPTDRIOPLLELKIEGETKOLUTHTGTLAMKOEBDATRPAMCERSENPEYATNWSFRPDMOMEFHFEGSSBBZAEAEAEAEADAEBABTJTJTHSHSJNJNIHIHDMINJLJYHSAEAYLAMTMKAEAEAEAEAEADADAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAMADAEAEAEAEAEAEAEAEAECXGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSAHAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYBYINJTINJYHEJPIHIOINJKJYJPHSJYINJLJTAEAOADAEAEADADAEAOAEADADAOAEAECKZSSPRSCXBKSFOLGRIDTOKPGOKETSCNCNBEZTLKGLPTASHNFDKIDTAYAHHESOGWAYJOHSKKJNIHJTJYJKBWISHSJTIEJZIHHEIDHSJKIHHEJOHSKKJNIHJTJYADATAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAETLCKFDIO
UR:IOTA-SIGN-REQUEST/4-2/LPAAAOCFAONSCYKBBBMWSSHKADGLAEAEAEAEAEAEAEAEAEAEAEAEAOAAINJLJYHSAAGAGWGHFPAEAXADAEAEAOAEAEAOADAEAEVYDEFDJOADLRLROSOYCPGOPLRKJKKGJEMKQZKIIHDNLRDMOEWFDKGANEWNIAOLFDATJOHSKKJNIHJTJYAYJPIHIOINJKJYIHJPAEAXAOAOAEADAEAEADAXAEADADAOAXAEADAAAEGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSADKETNOEPFSOGAWFKNPTDAGOGDEHVLKOLOFHATGMPDSWIOADZSAAPFPSNESEVLLNOYRKEMAEAEAEAEAEAECXGLVABWSRFMSRRECYBDJZFEFLHKHFLBKNCWCENLWFUOCEONREISHHWTHDHHNTGSONGOFRBZATVEJNIESTWPVODYAOHKNYKEHLZSCXGUNDHPHSRDOEHNENBWQZSSCAFPSSVSAXAEAEAEAEAEAEHNKOJLAEAEAEAEAEAEAXLYTAADDYOEADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAALYHDCXRHSBWLEHTYHFMTHKVWCNGUFGPTENCMFWRNFNAAGYBGRYSAIOJNTTVDGTBBTSRTOEAHJEGAGWGHFPCXHGHSJZJZIHJYUERNMWLK`;
/**
* Initialize form fields with example data
* This function sets default values for transaction-related fields only.
* Account-related values should only be populated after scanning Keystone account data.
*/
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
		derivationPaths: DEFAULT_DERIVATION_PATHS,
		masterFingerprint: DEFAULT_MASTER_FINGERPRINT,
		accountAddress: DEFAULT_ACCOUNT_ADDRESS
	};
}
/**
* Get example transaction descriptions for UI display
*/
var TRANSACTION_EXAMPLES = {
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
//#endregion
//#region src/lib/pages/keystone/ur-processor.ts
/**
* Utility to extract Buffer from Buffer, {type: 'Buffer', data: [...]}, or array-like
*/
function extractBuffer(val) {
	if (!val) return import_buffer.Buffer.alloc(0);
	if (import_buffer.Buffer.isBuffer(val)) return val;
	if (typeof val === "object" && val.type === "Buffer" && Array.isArray(val.data)) return import_buffer.Buffer.from(val.data);
	return import_buffer.Buffer.from(val);
}
/**
* UUID utility functions
*/
var uuidParse = (str) => {
	const hex = str.replace(/-/g, "");
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	for (let i = 0; i < 16; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
	return bytes;
};
var uuidStringify = (bytes) => {
	const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
	return [
		hex.substr(0, 8),
		hex.substr(8, 4),
		hex.substr(12, 4),
		hex.substr(16, 4),
		hex.substr(20, 12)
	].join("-");
};
/**
* Derive IOTA address from public key
* This converts an Ed25519 public key to an IOTA address using blake2b hash
*/
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
		if (cleanHex.startsWith(ADDRESS_PREFIXES.HEX)) cleanHex = cleanHex.slice(2);
		return new Ed25519PublicKey(fromHex(cleanHex)).toIotaAddress();
	} catch (error) {
		console.error("Failed to derive IOTA address:", error, "for public key:", publicKeyHex);
		return "Error deriving address";
	}
}
/**
* Create a new UR processor state
*/
function createUrProcessorState() {
	return {
		urDecoder: null,
		scannedParts: /* @__PURE__ */ new Set(),
		expectedParts: 0,
		receivedParts: 0,
		isMultipart: false
	};
}
/**
* Reset multipart UR state
*/
function resetMultipartState(state) {
	state.urDecoder = null;
	state.scannedParts.clear();
	state.receivedParts = 0;
	state.expectedParts = 0;
	state.isMultipart = false;
}
/**
* Handle scanned QR code result with multipart UR support
*/
function handleScanResult(data, state) {
	try {
		console.log("Scanned data:", data);
		const lowerData = data.toLowerCase();
		if (!lowerData.startsWith(UR_TYPES.UR_PREFIX)) throw new Error(`Invalid UR format - must start with "${UR_TYPES.UR_PREFIX}" or "UR:"`);
		if (!state.urDecoder) {
			state.urDecoder = new URDecoder();
			state.scannedParts.clear();
			state.receivedParts = 0;
		}
		if (state.scannedParts.has(data)) return {
			success: true,
			debugInfo: "Already scanned this part",
			needsMoreParts: true
		};
		state.scannedParts.add(data);
		state.urDecoder.receivePart(data);
		state.receivedParts = state.scannedParts.size;
		const parts = lowerData.split("/");
		if (parts.length >= 3 && (parts[1].includes("-") || parts[1].match(/\d+-\d+/))) {
			state.isMultipart = true;
			const seqPart = parts[1];
			if (seqPart.includes("-")) {
				const [, total] = seqPart.split("-").map(Number);
				state.expectedParts = total;
			}
		} else state.isMultipart = false;
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
			console.log(`Waiting for more parts... (${state.receivedParts}/${state.expectedParts || "?"})`);
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
/**
* Process complete UR data (either single or multipart)
*/
function processCompleteUR(type, cborHex, state) {
	try {
		resetMultipartState(state);
		console.log("Processing UR type:", type, "CBOR hex:", cborHex);
		if (type === UR_TYPES.IOTA_SIGNATURE) {
			const signature = IotaSignature.fromCBOR(import_buffer.Buffer.from(cborHex, "hex"));
			const signatureBytes = signature.getSignature();
			const publicKeyBytes = signature.getPublicKey();
			let signatureBase64 = toBase64(import_buffer.Buffer.concat([
				import_buffer.Buffer.from([0]),
				signatureBytes,
				publicKeyBytes
			]));
			console.log("signaturebase64", signatureBase64);
			const decodedData = {
				type,
				cborHex,
				specific: {
					signatureBase64,
					requestId: uuidStringify(signature.getRequestId() ?? /* @__PURE__ */ new Uint8Array()),
					signature: import_buffer.Buffer.from(signature.getSignature() ?? /* @__PURE__ */ new Uint8Array()).toString("hex"),
					publicKey: import_buffer.Buffer.from(signature.getPublicKey() ?? /* @__PURE__ */ new Uint8Array()).toString("hex")
				}
			};
			return {
				success: true,
				scanResult: JSON.stringify(decodedData, null, 2),
				debugInfo: "IOTA signature UR processed successfully",
				needsMoreParts: false
			};
		} else return processAccountData(type, cborHex);
	} catch (error) {
		console.error("Failed to process complete UR:", error);
		return {
			success: false,
			debugInfo: "Processing failed: " + error.message,
			connectionError: "Failed to process complete UR: " + error.message
		};
	}
}
/**
* Process account data UR (multi-accounts or HD key)
*/
function processAccountData(type, cborHex) {
	const onSucceed = ({ cbor }) => {
		try {
			console.log("Attempting to parse as multi-accounts...");
			const multiAccounts = CryptoMultiAccounts.fromCBOR(import_buffer.Buffer.from(cbor, "hex"));
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
				let bip32Key = "m/44'/4218'/0'/0'/0'";
				try {
					const origin = firstAccount.getOrigin();
					if (origin) {
						const pathComponents = origin.getComponents();
						let pathString = "m/";
						for (const comp of pathComponents) {
							pathString += comp.getIndex();
							if (comp.isHardened()) pathString += "'";
							pathString += "/";
						}
						pathString = pathString.slice(0, -1);
						bip32Key = pathString;
					}
				} catch {}
				if (keystoneAccountData.keys && keystoneAccountData.keys.length > 0 && typeof keystoneAccountData.keys[0].getKey === "function") {
					const keyBuf = extractBuffer(keystoneAccountData.keys[0].getKey());
					const keyHex = keyBuf.length > 0 ? keyBuf.toString("hex") : void 0;
					if (typeof keyHex === "string" && keyHex.length > 0) accountAddressDecoded = deriveIotaAddress(keyHex);
				}
				return {
					success: true,
					debugInfo: `Successfully parsed multi-accounts (${multiAccounts.getKeys().length} keys)`,
					connectedDevice,
					devicePublicKey,
					deviceChainCode,
					accountAddress: accountAddressDecoded,
					accountAddressBip32Path: bip32Key,
					fullMultiAccountsData,
					keystoneAccountData
				};
			} else return {
				success: true,
				debugInfo: "Connected but no account data found",
				connectedDevice: "Keystone Device",
				devicePublicKey: "Successfully connected",
				deviceChainCode: "",
				accountAddress: "",
				accountAddressBip32Path: "",
				fullMultiAccountsData,
				keystoneAccountData
			};
		} catch (parseError) {
			console.log("Multi-accounts parsing failed, trying as HD Key...");
			try {
				const hdKey = CryptoHDKey.fromCBOR(import_buffer.Buffer.from(cbor, "hex"));
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
					if (typeof keyHex === "string" && keyHex.length > 0) accountAddress = deriveIotaAddress(keyHex);
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
				throw new Error(`Failed to parse as both multi-accounts and HD Key: ${parseErrorMsg}, ${hdKeyErrorMsg}`);
			}
		}
	};
	return onSucceed({
		type,
		cbor: cborHex
	});
}
//#endregion
//#region src/lib/pages/keystone/Keystone.svelte
var root = from_html(`<option> </option>`);
var root_1 = from_html(`<div class="account-info svelte-jv4zjt"><h2 class="svelte-jv4zjt">Connected Keystone Device</h2> <label for="account-select">Select Account:</label> <select id="account-select" class="svelte-jv4zjt"></select> <div class="account-details svelte-jv4zjt"><p class="svelte-jv4zjt"><strong>Device:</strong> </p> <p class="svelte-jv4zjt"><strong>Master Fingerprint:</strong> <code class="svelte-jv4zjt"> </code></p> <p class="svelte-jv4zjt"><strong>Selected Path:</strong> <code class="svelte-jv4zjt"> </code></p> <p class="svelte-jv4zjt"><strong>Address:</strong> <code class="svelte-jv4zjt"> </code></p></div></div>`);
var root_2 = from_html(`<div class="controls svelte-jv4zjt"><button class="svelte-jv4zjt">Reset Multipart</button></div>`);
var root_3 = from_html(`<div class="success svelte-jv4zjt"><p> </p> <button>Clear Connection</button></div>`);
var root_4 = from_html(`<div class="step-content svelte-jv4zjt"><h2>Step 1: Connect Keystone Device</h2> <p>Display the wallet connect QR code on your Keystone device and scan it with the
                camera below.</p> <!> <!> <button style="margin: 0;">Simulate Scan</button> <!></div>`);
var root_5 = from_html(`<div class="qr-section svelte-jv4zjt"><h3 class="svelte-jv4zjt">3. Scan this QR code with your Keystone device to approve the transaction</h3> <!></div>`);
var root_6 = from_html(`<div class="step-content svelte-jv4zjt"><h2>Step 2: Prepare Transaction</h2> <p>Configure the transaction parameters and generate a signing request QR code.</p> <div class="form-section svelte-jv4zjt"><div class="form-row svelte-jv4zjt"><label for="request-id" class="svelte-jv4zjt">Request ID:</label> <input id="request-id" class="svelte-jv4zjt"/></div> <label for="raw-tx" class="full-width svelte-jv4zjt">Transaction Bytes (Base64):</label> <textarea id="raw-tx" rows="4" class="full-width svelte-jv4zjt"></textarea> <div class="example-buttons svelte-jv4zjt"><button class="svelte-jv4zjt"> </button> <button class="svelte-jv4zjt"> </button></div> <div class="form-row svelte-jv4zjt"><label for="account-address" class="svelte-jv4zjt">Account Address:</label> <input id="account-address" class="svelte-jv4zjt"/></div> <div class="form-row svelte-jv4zjt"><label for="derivation-path" class="svelte-jv4zjt">Derivation Path:</label> <input id="derivation-path" class="svelte-jv4zjt"/></div> <div class="form-row svelte-jv4zjt"><label for="master-fingerprint" class="svelte-jv4zjt">Master Fingerprint:</label> <input id="master-fingerprint" class="svelte-jv4zjt"/></div> <div class="form-row svelte-jv4zjt"><label for="wallet-origin" class="svelte-jv4zjt">Wallet Origin:</label> <input id="wallet-origin" class="svelte-jv4zjt"/></div></div> <!></div>`);
var root_7 = from_html(`<div class="error svelte-jv4zjt"> </div>`);
var root_8 = from_html(`<div class="result svelte-jv4zjt"><h3 class="svelte-jv4zjt">Signature Result:</h3> <pre class="svelte-jv4zjt"> </pre> <button> </button> <!> <!></div>`);
var root_9 = from_html(`<div class="step-content svelte-jv4zjt"><h2>Step 4: Scan Signature</h2> <p>After approving the transaction on your Keystone device, scan the signature QR code
                it displays.</p> <!> <button style="margin: 0;">Simulate Scan</button> <!></div>`);
var root_10 = from_html(`<div class="result svelte-jv4zjt"><h3 class="svelte-jv4zjt">KeyDerivationCall UR:</h3> <div class="qr-section svelte-jv4zjt"><h3 class="svelte-jv4zjt">Scan this QR code with your Keystone device</h3> <!></div> <pre class="svelte-jv4zjt"> </pre></div>`);
var root_11 = from_html(`<div class="step-content svelte-jv4zjt"><h2>Key Derivation Tool</h2> <p>Derive a key using a specific path and generate a KeyDerivationCall UR.</p> <div class="form-section svelte-jv4zjt"><div class="form-row svelte-jv4zjt"><label for="derive-path" class="svelte-jv4zjt">Derivation Path:</label> <input id="derive-path" class="svelte-jv4zjt"/></div> <div class="form-row svelte-jv4zjt"><label for="derive-origin" class="svelte-jv4zjt">Origin:</label> <input id="derive-origin" class="svelte-jv4zjt"/></div> <button>Generate KeyDerivationCall UR</button></div> <!> <!></div>`);
var root_12 = from_html(`<div class="result svelte-jv4zjt"><h3 class="svelte-jv4zjt">Decoded Data:</h3> <pre class="svelte-jv4zjt"> </pre></div>`);
var root_13 = from_html(`<div class="step-content svelte-jv4zjt"><h2>UR Decode Tool</h2> <p>Decode and analyze UR strings from Keystone devices.</p> <div class="form-section svelte-jv4zjt"><label for="ur-input" class="full-width svelte-jv4zjt">UR String:</label> <textarea id="ur-input" rows="4" placeholder="Paste UR string here..." class="full-width svelte-jv4zjt"></textarea> <div class="example-buttons svelte-jv4zjt"><button class="svelte-jv4zjt">Load Sign Request Example</button> <button class="svelte-jv4zjt">Load Signature Example</button> <button class="svelte-jv4zjt">Load Multipart Example</button></div></div> <!></div>`);
var root_14 = from_html(`<div class="error svelte-jv4zjt"><p> </p></div>`);
var root_15 = from_html(`<div class="keystone-container svelte-jv4zjt"><h1 class="svelte-jv4zjt">Keystone Hardware Wallet - IOTA Integration</h1> <!> <div class="steps svelte-jv4zjt"><button>1. Connect Wallet</button> <button>2. Prepare Transaction</button> <button>4. Scan Signature</button> <button>UR Decode Tool</button> <button>Address generation</button></div> <!> <!> <!> <!> <!> <!></div>`);
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
	let derivePath = mutable_source("m/44'/4218'/0'/0'/0'");
	let deriveOrigin = mutable_source(get(walletOrigin));
	let deriveResult = mutable_source("");
	let deriveError = mutable_source("");
	function handleDeriveKey() {
		try {
			const ur = generateKeyDerivationCall({
				schemas: [{ path: get(derivePath) }],
				origin: get(deriveOrigin)
			});
			set(deriveResult, JSON.stringify({
				type: ur.type,
				cborHex: ur.cbor.toString("hex")
			}, null, 2));
			set(deriveError, "");
		} catch (e) {
			set(deriveError, e instanceof Error ? e.message : String(e));
			set(deriveResult, "");
		}
	}
	/**
	* Handle scanned QR code result with multipart UR support
	*/
	function handleScanResult$1(data) {
		const result = handleScanResult(data, urProcessorState);
		set(isMultipart, urProcessorState.isMultipart);
		set(expectedParts, urProcessorState.expectedParts);
		set(receivedParts, urProcessorState.receivedParts);
		if (result.success) {
			if (result.needsMoreParts) return;
			if (get(qrScannerComponent)) get(qrScannerComponent).stopScanning();
			if (result.connectedDevice) set(connectedDevice, result.connectedDevice);
			if (result.accountAddress) set(accountAddress, result.accountAddress);
			if (result.accountAddressBip32Path) set(derivationPaths, result.accountAddressBip32Path);
			if (result.keystoneAccountData) {
				set(keystoneAccountData, result.keystoneAccountData);
				if (get(keystoneAccountData).keys) {
					for (const key of get(keystoneAccountData).keys) if (key.origin && key.origin.components) {
						const pathComponents = key.origin.components;
						let pathString = "m/";
						for (const comp of pathComponents) {
							pathString += comp.index;
							if (comp.hardened) pathString += "'";
							pathString += "/";
						}
						pathString = pathString.slice(0, -1);
						key.path = pathString;
					}
				}
				console.log("Keystone account data:", JSON.stringify(get(keystoneAccountData), null, 2));
				console.log("Keystone account data:", get(keystoneAccountData));
			}
			if (result.scanResult) set(scanResult, result.scanResult);
			set(connectionError, "");
		} else set(connectionError, result.connectionError || "Unknown error occurred");
	}
	/**
	* Reset multipart UR state
	*/
	function resetMultipartState$1() {
		resetMultipartState(urProcessorState);
		set(isMultipart, urProcessorState.isMultipart);
		set(expectedParts, urProcessorState.expectedParts);
		set(receivedParts, urProcessorState.receivedParts);
	}
	/**
	* Clear connection state
	*/
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
	/**
	* Generate an IOTA sign request QR code
	*/
	function generateSignRequest() {
		try {
			if (!get(rawTransactionBytes) || get(rawTransactionBytes).trim() === "") {
				set(showQrGenerator, false);
				return;
			}
			const useMasterFingerprint = get(masterFingerprint) || "70ee3cac";
			const useAccountAddress = get(accountAddress) || "0xb9cbe931d4569659e5235346a9361642be3c045112bdc2676dd1e74d14d7c0a2";
			const txMessageIntent = messageWithIntent("TransactionData", new Uint8Array(import_buffer.Buffer.from(get(rawTransactionBytes), "base64")));
			const signKeyPath = new CryptoKeypath(get(derivationPaths).trim().replace(/^m\//, "").split("/").filter((part) => part.trim() !== "").map((part) => {
				const isHardened = part.includes("'");
				return new PathComponent({
					index: parseInt(part.replace("'", "")),
					hardened: isHardened
				});
			}), import_buffer.Buffer.from(useMasterFingerprint, "hex"));
			const idBuffer = uuidParse(get(requestId));
			const cborHex = new IotaSignRequest({
				requestId: import_buffer.Buffer.from(idBuffer),
				intentMessage: import_buffer.Buffer.from(txMessageIntent),
				derivationPaths: [signKeyPath],
				addresses: [import_buffer.Buffer.from(useAccountAddress.replace(ADDRESS_PREFIXES.HEX, "").replace(ADDRESS_PREFIXES.IOTA1Q, ""), "hex")],
				origin: get(walletOrigin)
			}).toCBOR().toString("hex");
			if (!get(keystoneAccountData)) set(scanError, "ℹ️ Using demo values - connect Keystone device for real account data");
			else set(scanError, "");
			set(qrCbor, cborHex);
			set(qrUrType, UR_TYPES.IOTA_SIGN_REQUEST);
			set(showQrGenerator, true);
		} catch (error) {
			console.error("Error in generateSignRequest:", error);
			set(scanError, error instanceof Error ? error.message : "Failed to generate sign request");
			set(showQrGenerator, false);
		}
	}
	/**
	* Update form fields when account selection changes
	*/
	function updateSelectedAccount() {
		if (!get(keystoneAccountData) || !get(keystoneAccountData).keys) return;
		const selectedAccount = get(keystoneAccountData).keys[get(selectedAccountIndex)];
		if (selectedAccount) {
			console.log("selectedAccount", selectedAccount);
			set(derivationPaths, "");
			set(derivationPaths, selectedAccount.path + "");
			set(masterFingerprint, get(keystoneAccountData).masterFingerprint);
			set(accountAddress, deriveIotaAddress(toHex(selectedAccount.getKey())));
		}
	}
	/**
	* UR Decoding functions
	*/
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
			for (const part of urParts) if (part.trim()) urDecoder.receivePart(part.trim());
			if (urDecoder.isComplete()) {
				const result = urDecoder.resultUR();
				const type = result.type;
				let decodedData = {
					type,
					cborHex: result.cbor.toString("hex")
				};
				if (type === UR_TYPES.IOTA_SIGN_REQUEST) {
					const signRequest = IotaSignRequest.fromCBOR(result.cbor);
					decodedData.specific = {
						requestId: uuidStringify(signRequest.getRequestId()),
						intentMessage: import_buffer.Buffer.from(signRequest.getIntentMessage()).toString("hex"),
						derivationPaths: signRequest.getDerivationPaths().map((p) => p.getPath()),
						addresses: signRequest.getAddresses()?.map((a) => import_buffer.Buffer.from(a).toString("hex")) || [],
						origin: signRequest.getOrigin()
					};
				} else if (type === UR_TYPES.IOTA_SIGNATURE) {
					const signature = IotaSignature.fromCBOR(result.cbor);
					const signatureBytes = signature.getSignature();
					const publicKeyBytes = signature.getPublicKey();
					let signatureBase64 = toBase64(import_buffer.Buffer.concat([
						import_buffer.Buffer.from([0]),
						signatureBytes,
						publicKeyBytes
					]));
					console.log("signaturebase64", signatureBase64);
					decodedData.specific = {
						signatureBase64,
						requestId: uuidStringify(signature.getRequestId()),
						signature: import_buffer.Buffer.from(signature.getSignature()).toString("hex"),
						publicKey: import_buffer.Buffer.from(signature.getPublicKey()).toString("hex")
					};
				}
				set(decodedUrData, JSON.stringify(decodedData, null, 2));
				set(urDecodeError, "");
			} else throw new Error("UR decoding incomplete");
		} catch (error) {
			console.error("Failed to decode UR:", error);
			set(urDecodeError, "Failed to decode UR: " + error.message);
			set(decodedUrData, "");
		}
	}
	/**
	* Submit the signed transaction to the network
	*/
	async function submitSignedTransaction() {
		set(submitting, true);
		set(submitError, "");
		set(transactionResult, null);
		try {
			const parsed = JSON.parse(get(scanResult));
			console.log("rawTransactionBytes", get(rawTransactionBytes));
			const txBytes = new Uint8Array(import_buffer.Buffer.from(get(rawTransactionBytes), "base64"));
			const signatureBase64 = parsed.specific.signatureBase64;
			console.log("signatureBase64", signatureBase64);
			const result = await getClient().executeTransactionBlock({
				transactionBlock: txBytes,
				signature: signatureBase64,
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
		for (const part of simulatedUrParts) handleScanResult$1(part);
	}
	function simulateScanUrPartsSignature() {
		handleScanResult$1(EXAMPLE_SIGNATURE_UR);
	}
	legacy_pre_effect(() => {}, () => {
		set(isMultipart, urProcessorState.isMultipart);
	});
	legacy_pre_effect(() => {}, () => {
		set(expectedParts, urProcessorState.expectedParts);
	});
	legacy_pre_effect(() => {}, () => {
		set(receivedParts, urProcessorState.receivedParts);
	});
	legacy_pre_effect(() => (get(requestId), get(rawTransactionBytes), get(accountAddress), get(derivationPaths), get(masterFingerprint), get(walletOrigin)), () => {
		if (get(requestId) && get(rawTransactionBytes) && get(accountAddress) && get(derivationPaths) && get(masterFingerprint) && get(walletOrigin)) generateSignRequest();
	});
	legacy_pre_effect(() => get(rawTransactionBytes), () => {
		if (get(rawTransactionBytes) === "" || get(rawTransactionBytes).trim() === "") {
			set(showQrGenerator, false);
			set(qrCbor, "");
			set(qrUrType, "");
		}
	});
	legacy_pre_effect_reset();
	init();
	var div = root_15();
	var node = sibling(child(div), 2);
	var consequent = ($$anchor) => {
		var div_1 = root_1();
		var select = sibling(child(div_1), 4);
		each(select, 5, () => (get(keystoneAccountData), untrack(() => get(keystoneAccountData).keys)), index, ($$anchor, account, index) => {
			var option = root();
			var text = child(option);
			reset(option);
			option.value = option.__value = index;
			template_effect(($0) => set_text(text, `Account ${(get(account), untrack(() => get(account).path)) ?? ""} - ${$0 ?? ""}`), [() => (deep_read_state(deriveIotaAddress), deep_read_state(toHex), get(account), untrack(() => deriveIotaAddress(toHex(get(account).getKey()))))]);
			append($$anchor, option);
		});
		reset(select);
		var div_2 = sibling(select, 2);
		var p_1 = child(div_2);
		var text_1 = sibling(child(p_1));
		reset(p_1);
		var p_2 = sibling(p_1, 2);
		var code = sibling(child(p_2), 2);
		var text_2 = child(code, true);
		reset(code);
		reset(p_2);
		var p_3 = sibling(p_2, 2);
		var code_1 = sibling(child(p_3), 2);
		var text_3 = child(code_1, true);
		reset(code_1);
		reset(p_3);
		var p_4 = sibling(p_3, 2);
		var code_2 = sibling(child(p_4), 2);
		var text_4 = child(code_2, true);
		reset(code_2);
		reset(p_4);
		reset(div_2);
		reset(div_1);
		template_effect(($0) => {
			set_text(text_1, ` ${(get(keystoneAccountData), untrack(() => get(keystoneAccountData).device)) ?? ""}`);
			set_text(text_2, (get(keystoneAccountData), untrack(() => get(keystoneAccountData).masterFingerprint)));
			set_text(text_3, (get(keystoneAccountData), get(selectedAccountIndex), untrack(() => get(keystoneAccountData).keys[get(selectedAccountIndex)]?.path)));
			set_text(text_4, $0);
		}, [() => (deep_read_state(deriveIotaAddress), deep_read_state(toHex), get(keystoneAccountData), get(selectedAccountIndex), untrack(() => deriveIotaAddress(toHex(get(keystoneAccountData).keys[get(selectedAccountIndex)]?.key) || "")))]);
		bind_select_value(select, () => get(selectedAccountIndex), ($$value) => set(selectedAccountIndex, $$value));
		event("change", select, updateSelectedAccount);
		append($$anchor, div_1);
	};
	if_block(node, ($$render) => {
		if (get(keystoneAccountData), untrack(() => get(keystoneAccountData) && get(keystoneAccountData).keys)) $$render(consequent);
	});
	var div_3 = sibling(node, 2);
	var button = child(div_3);
	var button_1 = sibling(button, 2);
	var button_2 = sibling(button_1, 2);
	var button_3 = sibling(button_2, 2);
	var button_4 = sibling(button_3, 2);
	reset(div_3);
	var node_1 = sibling(div_3, 2);
	var consequent_3 = ($$anchor) => {
		var div_4 = root_4();
		var node_2 = sibling(child(div_4), 4);
		bind_this(QrScanner_1(node_2, {
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
				scanResult: (event) => handleScanResult$1(event.detail),
				error: (event) => set(scanError, event.detail),
				connectionError: (event) => set(connectionError, event.detail)
			},
			$$legacy: true
		}), ($$value) => set(qrScannerComponent, $$value), () => get(qrScannerComponent));
		var node_3 = sibling(node_2, 2);
		var consequent_1 = ($$anchor) => {
			var div_5 = root_2();
			var button_5 = child(div_5);
			reset(div_5);
			event("click", button_5, resetMultipartState$1);
			append($$anchor, div_5);
		};
		if_block(node_3, ($$render) => {
			if (get(isMultipart)) $$render(consequent_1);
		});
		var button_6 = sibling(node_3, 2);
		var node_4 = sibling(button_6, 2);
		var consequent_2 = ($$anchor) => {
			var div_6 = root_3();
			var p_5 = child(div_6);
			var text_5 = child(p_5);
			reset(p_5);
			var button_7 = sibling(p_5, 2);
			reset(div_6);
			template_effect(() => set_text(text_5, `✅ Connected to: ${get(connectedDevice) ?? ""}`));
			event("click", button_7, clearConnection);
			append($$anchor, div_6);
		};
		if_block(node_4, ($$render) => {
			if (get(connectedDevice)) $$render(consequent_2);
		});
		reset(div_4);
		event("click", button_6, simulateScanUrParts);
		append($$anchor, div_4);
	};
	if_block(node_1, ($$render) => {
		if (get(activeStep) === "connect") $$render(consequent_3);
	});
	var node_5 = sibling(node_1, 2);
	var consequent_5 = ($$anchor) => {
		var div_7 = root_6();
		var div_8 = sibling(child(div_7), 4);
		var div_9 = child(div_8);
		var input = sibling(child(div_9), 2);
		remove_input_defaults(input);
		reset(div_9);
		var textarea = sibling(div_9, 4);
		remove_textarea_child(textarea);
		var div_10 = sibling(textarea, 2);
		var button_8 = child(div_10);
		var text_6 = child(button_8, true);
		reset(button_8);
		var button_9 = sibling(button_8, 2);
		var text_7 = child(button_9, true);
		reset(button_9);
		reset(div_10);
		var div_11 = sibling(div_10, 2);
		var input_1 = sibling(child(div_11), 2);
		remove_input_defaults(input_1);
		reset(div_11);
		var div_12 = sibling(div_11, 2);
		var input_2 = sibling(child(div_12), 2);
		remove_input_defaults(input_2);
		reset(div_12);
		var div_13 = sibling(div_12, 2);
		var input_3 = sibling(child(div_13), 2);
		remove_input_defaults(input_3);
		reset(div_13);
		var div_14 = sibling(div_13, 2);
		var input_4 = sibling(child(div_14), 2);
		remove_input_defaults(input_4);
		reset(div_14);
		reset(div_8);
		var node_6 = sibling(div_8, 2);
		var consequent_4 = ($$anchor) => {
			var div_15 = root_5();
			bind_this(QrGenerator(sibling(child(div_15), 2), {
				get cbor() {
					return get(qrCbor);
				},
				get urType() {
					return get(qrUrType);
				},
				$$legacy: true
			}), ($$value) => set(qrGeneratorComponent, $$value), () => get(qrGeneratorComponent));
			reset(div_15);
			append($$anchor, div_15);
		};
		if_block(node_6, ($$render) => {
			if (get(showQrGenerator)) $$render(consequent_4);
		});
		reset(div_7);
		template_effect(() => {
			set_text(text_6, (deep_read_state(TRANSACTION_EXAMPLES), untrack(() => TRANSACTION_EXAMPLES.simple.title)));
			set_text(text_7, (deep_read_state(TRANSACTION_EXAMPLES), untrack(() => TRANSACTION_EXAMPLES.complex.title)));
		});
		bind_value(input, () => get(requestId), ($$value) => set(requestId, $$value));
		bind_value(textarea, () => get(rawTransactionBytes), ($$value) => set(rawTransactionBytes, $$value));
		event("click", button_8, () => set(rawTransactionBytes, TRANSACTION_EXAMPLES.simple.data));
		event("click", button_9, () => set(rawTransactionBytes, TRANSACTION_EXAMPLES.complex.data));
		bind_value(input_1, () => get(accountAddress), ($$value) => set(accountAddress, $$value));
		bind_value(input_2, () => get(derivationPaths), ($$value) => set(derivationPaths, $$value));
		bind_value(input_3, () => get(masterFingerprint), ($$value) => set(masterFingerprint, $$value));
		bind_value(input_4, () => get(walletOrigin), ($$value) => set(walletOrigin, $$value));
		append($$anchor, div_7);
	};
	if_block(node_5, ($$render) => {
		if (get(activeStep) === "prepare") $$render(consequent_5);
	});
	var node_8 = sibling(node_5, 2);
	var consequent_9 = ($$anchor) => {
		var div_16 = root_9();
		var node_9 = sibling(child(div_16), 4);
		bind_this(QrScanner_1(node_9, {
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
				scanResult: (event) => handleScanResult$1(event.detail),
				error: (event) => set(scanError, event.detail)
			},
			$$legacy: true
		}), ($$value) => set(qrScannerComponent, $$value), () => get(qrScannerComponent));
		var button_10 = sibling(node_9, 2);
		var node_10 = sibling(button_10, 2);
		var consequent_8 = ($$anchor) => {
			var div_17 = root_8();
			var pre = sibling(child(div_17), 2);
			var text_8 = child(pre, true);
			reset(pre);
			var button_11 = sibling(pre, 2);
			var text_9 = child(button_11, true);
			reset(button_11);
			var node_11 = sibling(button_11, 2);
			var consequent_6 = ($$anchor) => {
				var div_18 = root_7();
				var text_10 = child(div_18, true);
				reset(div_18);
				template_effect(() => set_text(text_10, get(submitError)));
				append($$anchor, div_18);
			};
			if_block(node_11, ($$render) => {
				if (get(submitError)) $$render(consequent_6);
			});
			var node_12 = sibling(node_11, 2);
			var consequent_7 = ($$anchor) => {
				TransactionView($$anchor, { get value() {
					return get(transactionResult);
				} });
			};
			if_block(node_12, ($$render) => {
				if (get(transactionResult)) $$render(consequent_7);
			});
			reset(div_17);
			template_effect(() => {
				set_text(text_8, get(scanResult));
				button_11.disabled = get(submitting);
				set_text(text_9, get(submitting) ? "Submitting..." : "Submit Transaction to Network");
			});
			event("click", button_11, submitSignedTransaction);
			append($$anchor, div_17);
		};
		if_block(node_10, ($$render) => {
			if (get(scanResult)) $$render(consequent_8);
		});
		reset(div_16);
		event("click", button_10, simulateScanUrPartsSignature);
		append($$anchor, div_16);
	};
	if_block(node_8, ($$render) => {
		if (get(activeStep) === "scan-signature") $$render(consequent_9);
	});
	var node_13 = sibling(node_8, 2);
	var consequent_12 = ($$anchor) => {
		var div_19 = root_11();
		var div_20 = sibling(child(div_19), 4);
		var div_21 = child(div_20);
		var input_5 = sibling(child(div_21), 2);
		remove_input_defaults(input_5);
		reset(div_21);
		var div_22 = sibling(div_21, 2);
		var input_6 = sibling(child(div_22), 2);
		remove_input_defaults(input_6);
		reset(div_22);
		var button_12 = sibling(div_22, 2);
		reset(div_20);
		var node_14 = sibling(div_20, 2);
		var consequent_10 = ($$anchor) => {
			var div_23 = root_10();
			var div_24 = sibling(child(div_23), 2);
			var node_15 = sibling(child(div_24), 2);
			{
				let $0 = derived_safe_equal(() => (get(deriveResult), untrack(() => JSON.parse(get(deriveResult)).cborHex)));
				let $1 = derived_safe_equal(() => (get(deriveResult), untrack(() => JSON.parse(get(deriveResult)).type)));
				QrGenerator(node_15, {
					get cbor() {
						return get($0);
					},
					get urType() {
						return get($1);
					}
				});
			}
			reset(div_24);
			var pre_1 = sibling(div_24, 2);
			var text_11 = child(pre_1, true);
			reset(pre_1);
			reset(div_23);
			template_effect(() => set_text(text_11, get(deriveResult)));
			append($$anchor, div_23);
		};
		if_block(node_14, ($$render) => {
			if (get(deriveResult)) $$render(consequent_10);
		});
		var node_16 = sibling(node_14, 2);
		var consequent_11 = ($$anchor) => {
			var div_25 = root_7();
			var text_12 = child(div_25, true);
			reset(div_25);
			template_effect(() => set_text(text_12, get(deriveError)));
			append($$anchor, div_25);
		};
		if_block(node_16, ($$render) => {
			if (get(deriveError)) $$render(consequent_11);
		});
		reset(div_19);
		bind_value(input_5, () => get(derivePath), ($$value) => set(derivePath, $$value));
		bind_value(input_6, () => get(deriveOrigin), ($$value) => set(deriveOrigin, $$value));
		event("click", button_12, handleDeriveKey);
		append($$anchor, div_19);
	};
	if_block(node_13, ($$render) => {
		if (get(activeStep) === "key-derivation") $$render(consequent_12);
	});
	var node_17 = sibling(node_13, 2);
	var consequent_14 = ($$anchor) => {
		var div_26 = root_13();
		var div_27 = sibling(child(div_26), 4);
		var textarea_1 = sibling(child(div_27), 2);
		remove_textarea_child(textarea_1);
		var div_28 = sibling(textarea_1, 2);
		var button_13 = child(div_28);
		var button_14 = sibling(button_13, 2);
		var button_15 = sibling(button_14, 2);
		reset(div_28);
		reset(div_27);
		var node_18 = sibling(div_27, 2);
		var consequent_13 = ($$anchor) => {
			var div_29 = root_12();
			var pre_2 = sibling(child(div_29), 2);
			var text_13 = child(pre_2, true);
			reset(pre_2);
			reset(div_29);
			template_effect(() => set_text(text_13, get(decodedUrData)));
			append($$anchor, div_29);
		};
		if_block(node_18, ($$render) => {
			if (get(decodedUrData)) $$render(consequent_13);
		});
		reset(div_26);
		bind_value(textarea_1, () => get(urToDecode), ($$value) => set(urToDecode, $$value));
		event("input", textarea_1, () => decodeUR());
		event("click", button_13, () => loadExampleUR("signRequest"));
		event("click", button_14, () => loadExampleUR("signature"));
		event("click", button_15, () => loadExampleUR("multipart"));
		append($$anchor, div_26);
	};
	if_block(node_17, ($$render) => {
		if (get(activeStep) === "ur-decode") $$render(consequent_14);
	});
	var node_19 = sibling(node_17, 2);
	var consequent_15 = ($$anchor) => {
		var div_30 = root_14();
		var p_6 = child(div_30);
		var text_14 = child(p_6, true);
		reset(p_6);
		reset(div_30);
		template_effect(() => set_text(text_14, get(scanError) || get(connectionError) || get(urDecodeError)));
		append($$anchor, div_30);
	};
	if_block(node_19, ($$render) => {
		if (get(scanError) || get(connectionError) || get(urDecodeError)) $$render(consequent_15);
	});
	reset(div);
	template_effect(() => {
		set_class(button, 1, `step-btn ${get(activeStep) === "connect" ? "active" : ""}`, "svelte-jv4zjt");
		set_class(button_1, 1, `step-btn ${get(activeStep) === "prepare" ? "active" : ""}`, "svelte-jv4zjt");
		set_class(button_2, 1, `step-btn ${get(activeStep) === "scan-signature" ? "active" : ""}`, "svelte-jv4zjt");
		set_class(button_3, 1, `step-btn ${get(activeStep) === "ur-decode" ? "active" : ""}`, "svelte-jv4zjt");
		set_class(button_4, 1, `step-btn ${get(activeStep) === "key-derivation" ? "active" : ""}`, "svelte-jv4zjt");
	});
	event("click", button, () => switchStep("connect"));
	event("click", button_1, () => switchStep("prepare"));
	event("click", button_2, () => switchStep("scan-signature"));
	event("click", button_3, () => switchStep("ur-decode"));
	event("click", button_4, () => switchStep("key-derivation"));
	append($$anchor, div);
	pop();
}
//#endregion
export { Keystone as default };

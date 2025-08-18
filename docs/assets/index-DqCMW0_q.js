import { aG as print } from "/iota-utils/assets/index-CMiBu1ib.js";
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value2) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value2);
var __privateSet = (obj, member, value2, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value2), value2);
var _url, _queries, _headers, _fetch;
class IotaGraphQLRequestError extends Error {
}
class IotaGraphQLClient {
  constructor({
    url,
    fetch: fetchFn = fetch,
    headers = {},
    queries = {}
  }) {
    __privateAdd(this, _url);
    __privateAdd(this, _queries);
    __privateAdd(this, _headers);
    __privateAdd(this, _fetch);
    __privateSet(this, _url, url);
    __privateSet(this, _queries, queries);
    __privateSet(this, _headers, headers);
    __privateSet(this, _fetch, (...args) => fetchFn(...args));
  }
  async query(options) {
    const res = await __privateGet(this, _fetch).call(this, __privateGet(this, _url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...__privateGet(this, _headers)
      },
      body: JSON.stringify({
        query: typeof options.query === "string" ? String(options.query) : print(options.query),
        variables: options.variables,
        extensions: options.extensions,
        operationName: options.operationName
      })
    });
    if (!res.ok) {
      throw new IotaGraphQLRequestError(
        `GraphQL request failed: ${res.statusText} (${res.status})`
      );
    }
    return await res.json();
  }
  async execute(query, options) {
    return this.query({
      ...options,
      query: __privateGet(this, _queries)[query]
    });
  }
}
_url = /* @__PURE__ */ new WeakMap();
_queries = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_fetch = /* @__PURE__ */ new WeakMap();
var e$1 = {
  DOCUMENT: "Document",
  FRAGMENT_DEFINITION: "FragmentDefinition"
};
class GraphQLError extends Error {
  constructor(e2, r, i2, n2, t2, a2, o2) {
    if (super(e2), this.name = "GraphQLError", this.message = e2, t2) {
      this.path = t2;
    }
    if (r) {
      this.nodes = Array.isArray(r) ? r : [r];
    }
    if (i2) {
      this.source = i2;
    }
    if (n2) {
      this.positions = n2;
    }
    if (a2) {
      this.originalError = a2;
    }
    var l = o2;
    if (!l && a2) {
      var d = a2.extensions;
      if (d && "object" == typeof d) {
        l = d;
      }
    }
    this.extensions = l || {};
  }
  toJSON() {
    return {
      ...this,
      message: this.message
    };
  }
  toString() {
    return this.message;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
}
var i;
var n;
function error(e2) {
  return new GraphQLError(`Syntax Error: Unexpected token at ${n} in ${e2}`);
}
function advance(e2) {
  if (e2.lastIndex = n, e2.test(i)) {
    return i.slice(n, n = e2.lastIndex);
  }
}
var t = / +(?=[^\s])/y;
function blockString(e2) {
  var r = e2.split("\n");
  var i2 = "";
  var n2 = 0;
  var a2 = 0;
  var o2 = r.length - 1;
  for (var l = 0; l < r.length; l++) {
    if (t.lastIndex = 0, t.test(r[l])) {
      if (l && (!n2 || t.lastIndex < n2)) {
        n2 = t.lastIndex;
      }
      a2 = a2 || l, o2 = l;
    }
  }
  for (var d = a2; d <= o2; d++) {
    if (d !== a2) {
      i2 += "\n";
    }
    i2 += r[d].slice(n2).replace(/\\"""/g, '"""');
  }
  return i2;
}
function ignored() {
  for (var e2 = 0 | i.charCodeAt(n++); 9 === e2 || 10 === e2 || 13 === e2 || 32 === e2 || 35 === e2 || 44 === e2 || 65279 === e2; e2 = 0 | i.charCodeAt(n++)) {
    if (35 === e2) {
      for (; (e2 = 0 | i.charCodeAt(n++)) && 10 !== e2 && 13 !== e2; ) {
      }
    }
  }
  n--;
}
function name() {
  var e2 = n;
  for (var r = 0 | i.charCodeAt(n++); r >= 48 && r <= 57 || r >= 65 && r <= 90 || 95 === r || r >= 97 && r <= 122; r = 0 | i.charCodeAt(n++)) {
  }
  if (e2 === n - 1) {
    throw error("Name");
  }
  var t2 = i.slice(e2, --n);
  return ignored(), t2;
}
function nameNode() {
  return {
    kind: "Name",
    value: name()
  };
}
var a$1 = /(?:"""|(?:[\s\S]*?[^\\])""")/y;
var o = /(?:(?:\.\d+)?[eE][+-]?\d+|\.\d+)/y;
function value(e2) {
  var r;
  switch (i.charCodeAt(n)) {
    case 91:
      n++, ignored();
      var t2 = [];
      for (; 93 !== i.charCodeAt(n); ) {
        t2.push(value(e2));
      }
      return n++, ignored(), {
        kind: "ListValue",
        values: t2
      };
    case 123:
      n++, ignored();
      var l = [];
      for (; 125 !== i.charCodeAt(n); ) {
        var d = nameNode();
        if (58 !== i.charCodeAt(n++)) {
          throw error("ObjectField");
        }
        ignored(), l.push({
          kind: "ObjectField",
          name: d,
          value: value(e2)
        });
      }
      return n++, ignored(), {
        kind: "ObjectValue",
        fields: l
      };
    case 36:
      if (e2) {
        throw error("Variable");
      }
      return n++, {
        kind: "Variable",
        name: nameNode()
      };
    case 34:
      if (34 === i.charCodeAt(n + 1) && 34 === i.charCodeAt(n + 2)) {
        if (n += 3, null == (r = advance(a$1))) {
          throw error("StringValue");
        }
        return ignored(), {
          kind: "StringValue",
          value: blockString(r.slice(0, -3)),
          block: true
        };
      } else {
        var u = n;
        var s;
        n++;
        var c = false;
        for (s = 0 | i.charCodeAt(n++); 92 === s && (n++, c = true) || 10 !== s && 13 !== s && 34 !== s && s; s = 0 | i.charCodeAt(n++)) {
        }
        if (34 !== s) {
          throw error("StringValue");
        }
        return r = i.slice(u, n), ignored(), {
          kind: "StringValue",
          value: c ? JSON.parse(r) : r.slice(1, -1),
          block: false
        };
      }
    case 45:
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      var v = n++;
      var f;
      for (; (f = 0 | i.charCodeAt(n++)) >= 48 && f <= 57; ) {
      }
      var m = i.slice(v, --n);
      if (46 === (f = i.charCodeAt(n)) || 69 === f || 101 === f) {
        if (null == (r = advance(o))) {
          throw error("FloatValue");
        }
        return ignored(), {
          kind: "FloatValue",
          value: m + r
        };
      } else {
        return ignored(), {
          kind: "IntValue",
          value: m
        };
      }
    case 110:
      if (117 === i.charCodeAt(n + 1) && 108 === i.charCodeAt(n + 2) && 108 === i.charCodeAt(n + 3)) {
        return n += 4, ignored(), {
          kind: "NullValue"
        };
      } else {
        break;
      }
    case 116:
      if (114 === i.charCodeAt(n + 1) && 117 === i.charCodeAt(n + 2) && 101 === i.charCodeAt(n + 3)) {
        return n += 4, ignored(), {
          kind: "BooleanValue",
          value: true
        };
      } else {
        break;
      }
    case 102:
      if (97 === i.charCodeAt(n + 1) && 108 === i.charCodeAt(n + 2) && 115 === i.charCodeAt(n + 3) && 101 === i.charCodeAt(n + 4)) {
        return n += 5, ignored(), {
          kind: "BooleanValue",
          value: false
        };
      } else {
        break;
      }
  }
  return {
    kind: "EnumValue",
    value: name()
  };
}
function arguments_(e2) {
  if (40 === i.charCodeAt(n)) {
    var r = [];
    n++, ignored();
    do {
      var t2 = nameNode();
      if (58 !== i.charCodeAt(n++)) {
        throw error("Argument");
      }
      ignored(), r.push({
        kind: "Argument",
        name: t2,
        value: value(e2)
      });
    } while (41 !== i.charCodeAt(n));
    return n++, ignored(), r;
  }
}
function directives(e2) {
  if (64 === i.charCodeAt(n)) {
    var r = [];
    do {
      n++, r.push({
        kind: "Directive",
        name: nameNode(),
        arguments: arguments_(e2)
      });
    } while (64 === i.charCodeAt(n));
    return r;
  }
}
function type() {
  var e2 = 0;
  for (; 91 === i.charCodeAt(n); ) {
    e2++, n++, ignored();
  }
  var r = {
    kind: "NamedType",
    name: nameNode()
  };
  do {
    if (33 === i.charCodeAt(n)) {
      n++, ignored(), r = {
        kind: "NonNullType",
        type: r
      };
    }
    if (e2) {
      if (93 !== i.charCodeAt(n++)) {
        throw error("NamedType");
      }
      ignored(), r = {
        kind: "ListType",
        type: r
      };
    }
  } while (e2--);
  return r;
}
function selectionSetStart() {
  if (123 !== i.charCodeAt(n++)) {
    throw error("SelectionSet");
  }
  return ignored(), selectionSet();
}
function selectionSet() {
  var e2 = [];
  do {
    if (46 === i.charCodeAt(n)) {
      if (46 !== i.charCodeAt(++n) || 46 !== i.charCodeAt(++n)) {
        throw error("SelectionSet");
      }
      switch (n++, ignored(), i.charCodeAt(n)) {
        case 64:
          e2.push({
            kind: "InlineFragment",
            typeCondition: void 0,
            directives: directives(false),
            selectionSet: selectionSetStart()
          });
          break;
        case 111:
          if (110 === i.charCodeAt(n + 1)) {
            n += 2, ignored(), e2.push({
              kind: "InlineFragment",
              typeCondition: {
                kind: "NamedType",
                name: nameNode()
              },
              directives: directives(false),
              selectionSet: selectionSetStart()
            });
          } else {
            e2.push({
              kind: "FragmentSpread",
              name: nameNode(),
              directives: directives(false)
            });
          }
          break;
        case 123:
          n++, ignored(), e2.push({
            kind: "InlineFragment",
            typeCondition: void 0,
            directives: void 0,
            selectionSet: selectionSet()
          });
          break;
        default:
          e2.push({
            kind: "FragmentSpread",
            name: nameNode(),
            directives: directives(false)
          });
      }
    } else {
      var r = nameNode();
      var t2 = void 0;
      if (58 === i.charCodeAt(n)) {
        n++, ignored(), t2 = r, r = nameNode();
      }
      var a2 = arguments_(false);
      var o2 = directives(false);
      var l = void 0;
      if (123 === i.charCodeAt(n)) {
        n++, ignored(), l = selectionSet();
      }
      e2.push({
        kind: "Field",
        alias: t2,
        name: r,
        arguments: a2,
        directives: o2,
        selectionSet: l
      });
    }
  } while (125 !== i.charCodeAt(n));
  return n++, ignored(), {
    kind: "SelectionSet",
    selections: e2
  };
}
function variableDefinitions() {
  if (ignored(), 40 === i.charCodeAt(n)) {
    var e2 = [];
    n++, ignored();
    do {
      var r = void 0;
      if (34 === i.charCodeAt(n)) {
        r = value(true);
      }
      if (36 !== i.charCodeAt(n++)) {
        throw error("Variable");
      }
      var t2 = nameNode();
      if (58 !== i.charCodeAt(n++)) {
        throw error("VariableDefinition");
      }
      ignored();
      var a2 = type();
      var o2 = void 0;
      if (61 === i.charCodeAt(n)) {
        n++, ignored(), o2 = value(true);
      }
      ignored();
      var l = {
        kind: "VariableDefinition",
        variable: {
          kind: "Variable",
          name: t2
        },
        type: a2,
        defaultValue: o2,
        directives: directives(true)
      };
      if (r) {
        l.description = r;
      }
      e2.push(l);
    } while (41 !== i.charCodeAt(n));
    return n++, ignored(), e2;
  }
}
function fragmentDefinition(e2) {
  var r = nameNode();
  if (111 !== i.charCodeAt(n++) || 110 !== i.charCodeAt(n++)) {
    throw error("FragmentDefinition");
  }
  ignored();
  var t2 = {
    kind: "FragmentDefinition",
    name: r,
    typeCondition: {
      kind: "NamedType",
      name: nameNode()
    },
    directives: directives(false),
    selectionSet: selectionSetStart()
  };
  if (e2) {
    t2.description = e2;
  }
  return t2;
}
function definitions() {
  var e2 = [];
  do {
    var r = void 0;
    if (34 === i.charCodeAt(n)) {
      r = value(true);
    }
    if (123 === i.charCodeAt(n)) {
      if (r) {
        throw error("Document");
      }
      n++, ignored(), e2.push({
        kind: "OperationDefinition",
        operation: "query",
        name: void 0,
        variableDefinitions: void 0,
        directives: void 0,
        selectionSet: selectionSet()
      });
    } else {
      var t2 = name();
      switch (t2) {
        case "fragment":
          e2.push(fragmentDefinition(r));
          break;
        case "query":
        case "mutation":
        case "subscription":
          var a2;
          var o2 = void 0;
          if (40 !== (a2 = i.charCodeAt(n)) && 64 !== a2 && 123 !== a2) {
            o2 = nameNode();
          }
          var l = {
            kind: "OperationDefinition",
            operation: t2,
            name: o2,
            variableDefinitions: variableDefinitions(),
            directives: directives(false),
            selectionSet: selectionSetStart()
          };
          if (r) {
            l.description = r;
          }
          e2.push(l);
          break;
        default:
          throw error("Document");
      }
    }
  } while (n < i.length);
  return e2;
}
function parse(e2, r) {
  if (i = e2.body ? e2.body : e2, n = 0, ignored(), r) ;
  else {
    return {
      kind: "Document",
      definitions: definitions(),
      loc: {
        start: 0,
        end: i.length,
        startToken: void 0,
        endToken: void 0,
        source: {
          body: i,
          name: "graphql.web",
          locationOffset: {
            line: 1,
            column: 1
          }
        }
      }
    };
  }
}
var a = 0;
var e = /* @__PURE__ */ new Set();
function initGraphQLTada() {
  function graphql2(t2, i2) {
    var o2 = parse(t2).definitions;
    var s = /* @__PURE__ */ new Set();
    for (var f of i2 || []) {
      for (var u of f.definitions) {
        if (u.kind === e$1.FRAGMENT_DEFINITION && !s.has(u)) {
          o2.push(u);
          s.add(u);
        }
      }
    }
    var d;
    if ((d = o2[0].kind === e$1.FRAGMENT_DEFINITION) && o2[0].directives) {
      o2[0].directives = o2[0].directives.filter((r) => "_unmask" !== r.name.value);
    }
    var c;
    return {
      kind: e$1.DOCUMENT,
      definitions: o2,
      get loc() {
        if (!c && d) {
          var r = t2 + function concatLocSources(r2) {
            try {
              a++;
              var n2 = "";
              for (var t3 of r2) {
                if (!e.has(t3)) {
                  e.add(t3);
                  var { loc: i3 } = t3;
                  if (i3) {
                    n2 += i3.source.body;
                  }
                }
              }
              return n2;
            } finally {
              if (0 == --a) {
                e.clear();
              }
            }
          }(i2 || []);
          return {
            start: 0,
            end: r.length,
            source: {
              body: r,
              name: "GraphQLTada",
              locationOffset: {
                line: 1,
                column: 1
              }
            }
          };
        }
        return c;
      },
      set loc(r) {
        c = r;
      }
    };
  }
  graphql2.scalar = function scalar(r, n2) {
    return n2;
  };
  graphql2.persisted = function persisted(n2, a2) {
    return {
      kind: e$1.DOCUMENT,
      definitions: a2 ? a2.definitions : [],
      documentId: n2
    };
  };
  return graphql2;
}
initGraphQLTada();
const graphql = initGraphQLTada();
export {
  IotaGraphQLClient as I,
  graphql as g
};

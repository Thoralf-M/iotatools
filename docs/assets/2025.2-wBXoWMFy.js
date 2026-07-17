import "./rolldown-runtime-D3Q5gio6.js";
//#region node_modules/.pnpm/@0no-co+graphql.web@1.3.2_graphql@16.14.2/node_modules/@0no-co/graphql.web/dist/graphql.web.mjs
var e$1 = {
	NAME: "Name",
	DOCUMENT: "Document",
	OPERATION_DEFINITION: "OperationDefinition",
	VARIABLE_DEFINITION: "VariableDefinition",
	SELECTION_SET: "SelectionSet",
	FIELD: "Field",
	ARGUMENT: "Argument",
	FRAGMENT_SPREAD: "FragmentSpread",
	INLINE_FRAGMENT: "InlineFragment",
	FRAGMENT_DEFINITION: "FragmentDefinition",
	VARIABLE: "Variable",
	INT: "IntValue",
	FLOAT: "FloatValue",
	STRING: "StringValue",
	BOOLEAN: "BooleanValue",
	NULL: "NullValue",
	ENUM: "EnumValue",
	LIST: "ListValue",
	OBJECT: "ObjectValue",
	OBJECT_FIELD: "ObjectField",
	DIRECTIVE: "Directive",
	NAMED_TYPE: "NamedType",
	LIST_TYPE: "ListType",
	NON_NULL_TYPE: "NonNullType"
};
var GraphQLError = class extends Error {
	constructor(e, r, i, n, t, a, o) {
		if (super(e), this.name = "GraphQLError", this.message = e, t) this.path = t;
		if (r) this.nodes = Array.isArray(r) ? r : [r];
		if (i) this.source = i;
		if (n) this.positions = n;
		if (a) this.originalError = a;
		var l = o;
		if (!l && a) {
			var d = a.extensions;
			if (d && "object" == typeof d) l = d;
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
};
var i;
var n$1;
function error(e) {
	return new GraphQLError(`Syntax Error: Unexpected token at ${n$1} in ${e}`);
}
function advance(e) {
	if (e.lastIndex = n$1, e.test(i)) return i.slice(n$1, n$1 = e.lastIndex);
}
var t$1 = / +(?=[^\s])/y;
function blockString(e) {
	var r = e.split("\n");
	var i = "";
	var n = 0;
	var a = 0;
	var o = r.length - 1;
	for (var l = 0; l < r.length; l++) if (t$1.lastIndex = 0, t$1.test(r[l])) {
		if (l && (!n || t$1.lastIndex < n)) n = t$1.lastIndex;
		a = a || l, o = l;
	}
	for (var d = a; d <= o; d++) {
		if (d !== a) i += "\n";
		i += r[d].slice(n).replace(/\\"""/g, "\"\"\"");
	}
	return i;
}
function ignored() {
	for (var e = 0 | i.charCodeAt(n$1++); 9 === e || 10 === e || 13 === e || 32 === e || 35 === e || 44 === e || 65279 === e; e = 0 | i.charCodeAt(n$1++)) if (35 === e) for (; (e = 0 | i.charCodeAt(n$1++)) && 10 !== e && 13 !== e;);
	n$1--;
}
function name() {
	var e = n$1;
	for (var r = 0 | i.charCodeAt(n$1++); r >= 48 && r <= 57 || r >= 65 && r <= 90 || 95 === r || r >= 97 && r <= 122; r = 0 | i.charCodeAt(n$1++));
	if (e === n$1 - 1) throw error("Name");
	var t = i.slice(e, --n$1);
	return ignored(), t;
}
function nameNode() {
	return {
		kind: "Name",
		value: name()
	};
}
var a = /(?:"""|(?:[\s\S]*?[^\\])""")/y;
var o = /(?:(?:\.\d+)?[eE][+-]?\d+|\.\d+)/y;
function value(e) {
	var r;
	switch (i.charCodeAt(n$1)) {
		case 91:
			n$1++, ignored();
			var t = [];
			for (; 93 !== i.charCodeAt(n$1);) t.push(value(e));
			return n$1++, ignored(), {
				kind: "ListValue",
				values: t
			};
		case 123:
			n$1++, ignored();
			var l = [];
			for (; 125 !== i.charCodeAt(n$1);) {
				var d = nameNode();
				if (58 !== i.charCodeAt(n$1++)) throw error("ObjectField");
				ignored(), l.push({
					kind: "ObjectField",
					name: d,
					value: value(e)
				});
			}
			return n$1++, ignored(), {
				kind: "ObjectValue",
				fields: l
			};
		case 36:
			if (e) throw error("Variable");
			return n$1++, {
				kind: "Variable",
				name: nameNode()
			};
		case 34: if (34 === i.charCodeAt(n$1 + 1) && 34 === i.charCodeAt(n$1 + 2)) {
			if (n$1 += 3, null == (r = advance(a))) throw error("StringValue");
			return ignored(), {
				kind: "StringValue",
				value: blockString(r.slice(0, -3)),
				block: !0
			};
		} else {
			var u = n$1;
			var s;
			n$1++;
			var c = !1;
			for (s = 0 | i.charCodeAt(n$1++); 92 === s && (n$1++, c = !0) || 10 !== s && 13 !== s && 34 !== s && s; s = 0 | i.charCodeAt(n$1++));
			if (34 !== s) throw error("StringValue");
			return r = i.slice(u, n$1), ignored(), {
				kind: "StringValue",
				value: c ? JSON.parse(r) : r.slice(1, -1),
				block: !1
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
			var v = n$1++;
			var f;
			for (; (f = 0 | i.charCodeAt(n$1++)) >= 48 && f <= 57;);
			var m = i.slice(v, --n$1);
			if (46 === (f = i.charCodeAt(n$1)) || 69 === f || 101 === f) {
				if (null == (r = advance(o))) throw error("FloatValue");
				return ignored(), {
					kind: "FloatValue",
					value: m + r
				};
			} else return ignored(), {
				kind: "IntValue",
				value: m
			};
		case 110: if (117 === i.charCodeAt(n$1 + 1) && 108 === i.charCodeAt(n$1 + 2) && 108 === i.charCodeAt(n$1 + 3)) return n$1 += 4, ignored(), { kind: "NullValue" };
		else break;
		case 116: if (114 === i.charCodeAt(n$1 + 1) && 117 === i.charCodeAt(n$1 + 2) && 101 === i.charCodeAt(n$1 + 3)) return n$1 += 4, ignored(), {
			kind: "BooleanValue",
			value: !0
		};
		else break;
		case 102: if (97 === i.charCodeAt(n$1 + 1) && 108 === i.charCodeAt(n$1 + 2) && 115 === i.charCodeAt(n$1 + 3) && 101 === i.charCodeAt(n$1 + 4)) return n$1 += 5, ignored(), {
			kind: "BooleanValue",
			value: !1
		};
		else break;
	}
	return {
		kind: "EnumValue",
		value: name()
	};
}
function arguments_(e) {
	if (40 === i.charCodeAt(n$1)) {
		var r = [];
		n$1++, ignored();
		do {
			var t = nameNode();
			if (58 !== i.charCodeAt(n$1++)) throw error("Argument");
			ignored(), r.push({
				kind: "Argument",
				name: t,
				value: value(e)
			});
		} while (41 !== i.charCodeAt(n$1));
		return n$1++, ignored(), r;
	}
}
function directives(e) {
	if (64 === i.charCodeAt(n$1)) {
		var r = [];
		do
			n$1++, r.push({
				kind: "Directive",
				name: nameNode(),
				arguments: arguments_(e)
			});
		while (64 === i.charCodeAt(n$1));
		return r;
	}
}
function type() {
	var e = 0;
	for (; 91 === i.charCodeAt(n$1);) e++, n$1++, ignored();
	var r = {
		kind: "NamedType",
		name: nameNode()
	};
	do {
		if (33 === i.charCodeAt(n$1)) n$1++, ignored(), r = {
			kind: "NonNullType",
			type: r
		};
		if (e) {
			if (93 !== i.charCodeAt(n$1++)) throw error("NamedType");
			ignored(), r = {
				kind: "ListType",
				type: r
			};
		}
	} while (e--);
	return r;
}
function selectionSetStart() {
	if (123 !== i.charCodeAt(n$1++)) throw error("SelectionSet");
	return ignored(), selectionSet();
}
function selectionSet() {
	var e = [];
	do
		if (46 === i.charCodeAt(n$1)) {
			if (46 !== i.charCodeAt(++n$1) || 46 !== i.charCodeAt(++n$1)) throw error("SelectionSet");
			switch (n$1++, ignored(), i.charCodeAt(n$1)) {
				case 64:
					e.push({
						kind: "InlineFragment",
						typeCondition: void 0,
						directives: directives(!1),
						selectionSet: selectionSetStart()
					});
					break;
				case 111:
					if (110 === i.charCodeAt(n$1 + 1)) n$1 += 2, ignored(), e.push({
						kind: "InlineFragment",
						typeCondition: {
							kind: "NamedType",
							name: nameNode()
						},
						directives: directives(!1),
						selectionSet: selectionSetStart()
					});
					else e.push({
						kind: "FragmentSpread",
						name: nameNode(),
						directives: directives(!1)
					});
					break;
				case 123:
					n$1++, ignored(), e.push({
						kind: "InlineFragment",
						typeCondition: void 0,
						directives: void 0,
						selectionSet: selectionSet()
					});
					break;
				default: e.push({
					kind: "FragmentSpread",
					name: nameNode(),
					directives: directives(!1)
				});
			}
		} else {
			var r = nameNode();
			var t = void 0;
			if (58 === i.charCodeAt(n$1)) n$1++, ignored(), t = r, r = nameNode();
			var a = arguments_(!1);
			var o = directives(!1);
			var l = void 0;
			if (123 === i.charCodeAt(n$1)) n$1++, ignored(), l = selectionSet();
			e.push({
				kind: "Field",
				alias: t,
				name: r,
				arguments: a,
				directives: o,
				selectionSet: l
			});
		}
	while (125 !== i.charCodeAt(n$1));
	return n$1++, ignored(), {
		kind: "SelectionSet",
		selections: e
	};
}
function variableDefinitions() {
	if (ignored(), 40 === i.charCodeAt(n$1)) {
		var e = [];
		n$1++, ignored();
		do {
			var r = void 0;
			if (34 === i.charCodeAt(n$1)) r = value(!0);
			if (36 !== i.charCodeAt(n$1++)) throw error("Variable");
			var t = nameNode();
			if (58 !== i.charCodeAt(n$1++)) throw error("VariableDefinition");
			ignored();
			var a = type();
			var o = void 0;
			if (61 === i.charCodeAt(n$1)) n$1++, ignored(), o = value(!0);
			ignored();
			var l = {
				kind: "VariableDefinition",
				variable: {
					kind: "Variable",
					name: t
				},
				type: a,
				defaultValue: o,
				directives: directives(!0)
			};
			if (r) l.description = r;
			e.push(l);
		} while (41 !== i.charCodeAt(n$1));
		return n$1++, ignored(), e;
	}
}
function fragmentDefinition(e) {
	var r = nameNode();
	if (111 !== i.charCodeAt(n$1++) || 110 !== i.charCodeAt(n$1++)) throw error("FragmentDefinition");
	ignored();
	var t = {
		kind: "FragmentDefinition",
		name: r,
		typeCondition: {
			kind: "NamedType",
			name: nameNode()
		},
		directives: directives(!1),
		selectionSet: selectionSetStart()
	};
	if (e) t.description = e;
	return t;
}
function definitions() {
	var e = [];
	do {
		var r = void 0;
		if (34 === i.charCodeAt(n$1)) r = value(!0);
		if (123 === i.charCodeAt(n$1)) {
			if (r) throw error("Document");
			n$1++, ignored(), e.push({
				kind: "OperationDefinition",
				operation: "query",
				name: void 0,
				variableDefinitions: void 0,
				directives: void 0,
				selectionSet: selectionSet()
			});
		} else {
			var t = name();
			switch (t) {
				case "fragment":
					e.push(fragmentDefinition(r));
					break;
				case "query":
				case "mutation":
				case "subscription":
					var a;
					var o = void 0;
					if (40 !== (a = i.charCodeAt(n$1)) && 64 !== a && 123 !== a) o = nameNode();
					var l = {
						kind: "OperationDefinition",
						operation: t,
						name: o,
						variableDefinitions: variableDefinitions(),
						directives: directives(!1),
						selectionSet: selectionSetStart()
					};
					if (r) l.description = r;
					e.push(l);
					break;
				default: throw error("Document");
			}
		}
	} while (n$1 < i.length);
	return e;
}
function parse(e, r) {
	if (i = e.body ? e.body : e, n$1 = 0, ignored(), r && r.noLocation) return {
		kind: "Document",
		definitions: definitions()
	};
	else return {
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
//#endregion
//#region node_modules/.pnpm/gql.tada@1.11.2_graphql@16.14.2_typescript@5.9.3/node_modules/gql.tada/dist/gql-tada.mjs
var n = 0;
var e = /* @__PURE__ */ new Set();
function initGraphQLTada() {
	function graphql(t, i) {
		var o = parse(t).definitions;
		var s = /* @__PURE__ */ new Set();
		for (var d of i || []) for (var f of d.definitions) if (f.kind === e$1.FRAGMENT_DEFINITION && !s.has(f)) {
			o.push(f);
			s.add(f);
		}
		var c;
		if ((c = o[0].kind === e$1.FRAGMENT_DEFINITION) && o[0].directives) o[0].directives = o[0].directives.filter(((r) => "_unmask" !== r.name.value));
		var u;
		return {
			kind: e$1.DOCUMENT,
			definitions: o,
			get loc() {
				if (!u && c) {
					var r = t + function concatLocSources(r) {
						try {
							n++;
							var a = "";
							for (var t of r) if (!e.has(t)) {
								e.add(t);
								var { loc: i } = t;
								if (i) a += i.source.body;
							}
							return a;
						} finally {
							if (0 == --n) e.clear();
						}
					}(i || []);
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
				return u;
			},
			set loc(r) {
				u = r;
			}
		};
	}
	graphql.scalar = function scalar(r, a) {
		return a;
	};
	graphql.persisted = function persisted(a, n) {
		return {
			kind: e$1.DOCUMENT,
			definitions: n ? n.definitions : [],
			documentId: a
		};
	};
	return graphql;
}
initGraphQLTada();
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/graphql/schemas/2025.2/index.js
var graphql = initGraphQLTada();
//#endregion
export { graphql as t };

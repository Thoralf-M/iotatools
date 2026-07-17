import { i as print } from "./client-BTFoHz6u.js";
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/graphql/client.js
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _url;
var _queries;
var _headers;
var _fetch;
var _inspector;
var IotaGraphQLRequestError = class extends Error {};
var IotaGraphQLClient = class {
	constructor({ url, fetch: fetchFn = fetch, headers = {}, queries = {}, inspector }) {
		__privateAdd(this, _url);
		__privateAdd(this, _queries);
		__privateAdd(this, _headers);
		__privateAdd(this, _fetch);
		__privateAdd(this, _inspector);
		__privateSet(this, _url, url);
		__privateSet(this, _queries, queries);
		__privateSet(this, _headers, headers);
		__privateSet(this, _fetch, (...args) => fetchFn(...args));
		__privateSet(this, _inspector, inspector);
	}
	async query(options) {
		const executeRequest = async () => {
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
			if (!res.ok) throw new IotaGraphQLRequestError(`GraphQL request failed: ${res.statusText} (${res.status})`);
			return await res.json();
		};
		return __privateGet(this, _inspector) ? __privateGet(this, _inspector).call(this, {
			method: options.operationName ?? "graphql",
			params: options.variables ? [options.variables] : []
		}, executeRequest) : executeRequest();
	}
	async execute(query, options) {
		return this.query({
			...options,
			query: __privateGet(this, _queries)[query]
		});
	}
};
_url = /* @__PURE__ */ new WeakMap();
_queries = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_fetch = /* @__PURE__ */ new WeakMap();
_inspector = /* @__PURE__ */ new WeakMap();
//#endregion
export { IotaGraphQLClient as t };

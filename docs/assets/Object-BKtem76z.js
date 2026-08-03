import { B as comment, C as bind_select_value, Dt as pop, H as text, I as if_block, Mt as reset, N as each, Ot as push, P as index, R as set_text, U as delegate, V as from_html, W as delegated, Y as get, ct as sibling, ft as set, gt as user_derived, it as template_effect, l as bind_property, lt as proxy, ot as child, pt as state, r as onMount, st as first_child, u as bind_this, vt as setup_stores, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import { r as getSelectedNetworkConfig, t as getClient } from "./client-BTFoHz6u.js";
import { U as normalizeIotaAddress } from "./keypair-DsT3ivIR.js";
import { n as getObjectLink, r as getTransactionLink, t as getAddressLink } from "./explorer-links-hyzWVZGi.js";
import { t as IotaGraphQLClient } from "./client-CmDrt-ez.js";
import { n as updatePageQueryParams, r as usePageQueryParams } from "./page-query-params-CxGJt8hH.js";
import { o as queryDynamicFields } from "./dynamic-fields-huZLT6c7.js";
import { n as getIotaNamesPackageId } from "./iota-names-config-OaNo1Bz2.js";
//#region src/lib/pages/object/objectUtils.ts
function detectInputType(input) {
	const trimmed = input.trim();
	if (/^0x[0-9a-fA-F]+$/.test(trimmed)) return "hex";
	if (trimmed.includes("::")) return "type";
	return null;
}
async function fetchSingleObjectData(objectId, graphqlUrl) {
	const object = (await new IotaGraphQLClient({ url: graphqlUrl }).query({
		query: `
            query GetObject($id: IotaAddress!) {
                object(address: $id) {
                    address
                    digest
                    version
                    owner {
                        __typename
                        ... on AddressOwner {
                            owner {
                                address
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
                    previousTransactionBlock {
                        digest
                    }
                    asMoveObject {
                        contents {
                            type {
                                repr
                            }
                            json
                        }
                    }
                    asMovePackage {
                        modules {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        `,
		variables: { id: objectId }
	})).data?.object;
	if (object?.owner?.__typename === "Parent" && !object.owner.parent) try {
		const rpcOwner = (await getClient().getObject({
			id: objectId,
			options: { showOwner: true }
		})).data?.owner;
		if (rpcOwner && typeof rpcOwner === "object" && "ObjectOwner" in rpcOwner) object.owner.parent = { address: rpcOwner.ObjectOwner };
	} catch {}
	return object;
}
async function fetchObjectsByTypeData(type, graphqlUrl, cursor = null, first = 1) {
	return (await new IotaGraphQLClient({ url: graphqlUrl }).query({
		query: `
            query GetObjects($type: String!, $cursor: String, $first: Int!) {
                objects(filter: { type: $type }, after: $cursor, first: $first) {
                    nodes {
                        address
                        digest
                        version
                        owner {
                            __typename
                            ... on AddressOwner {
                                owner {
                                    address
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
                        previousTransactionBlock {
                            digest
                        }
                        asMoveObject {
                            contents {
                                type {
                                    repr
                                }
                                json
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `,
		variables: {
			type,
			cursor,
			first
		}
	})).data?.objects || null;
}
async function fetchPackageVersionsData(packageAddress, graphqlUrl, cursor = null, first = 10) {
	return (await new IotaGraphQLClient({ url: graphqlUrl }).query({
		query: `
            query GetPackageVersions($address: IotaAddress!, $cursor: String, $first: Int!) {
                packageVersions(address: $address, after: $cursor, first: $first) {
                    nodes {
                        address
                        version
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `,
		variables: {
			address: packageAddress,
			cursor,
			first
		}
	})).data?.packageVersions || null;
}
async function fetchPackageTypesData(packageId, graphqlUrl) {
	const pkg = (await new IotaGraphQLClient({ url: graphqlUrl }).query({
		query: `
            query GetPackage($address: IotaAddress!) {
                package(address: $address) {
                    address
                    modules {
                        nodes {
                            name
                            structs {
                                nodes {
                                    name
                                    abilities
                                    typeParameters {
                                        constraints
                                    }
                                    fields {
                                        name
                                        type {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
		variables: { address: packageId }
	})).data?.package;
	if (!pkg) return [];
	const types = [];
	if (pkg.modules && pkg.modules.nodes) pkg.modules.nodes.forEach((module) => {
		if (module.structs && module.structs.nodes) module.structs.nodes.forEach((struct) => {
			if (struct.abilities && struct.abilities.includes("KEY")) types.push({
				fullType: `${pkg.address}::${module.name}::${struct.name}`,
				displayType: `${module.name}::${struct.name}`,
				module: module.name,
				name: struct.name,
				abilities: struct.abilities,
				fields: struct.fields
			});
		});
	});
	return types;
}
//#endregion
//#region src/lib/pages/object/Object.svelte
var root = from_html(`<div class="error-message svelte-h7f06r"><strong>Error:</strong> </div>`);
var root_1 = from_html(`<div class="loading-message svelte-h7f06r"><div class="spinner svelte-h7f06r"></div> <span>Loading...</span></div>`);
var root_2 = from_html(`<div class="loading-message svelte-h7f06r" style="padding: 0.5rem; margin: 0.25rem 0;"><div class="spinner svelte-h7f06r"></div> <span>Loading types...</span></div>`);
var root_3 = from_html(`<button class="type-btn svelte-h7f06r"><code class="svelte-h7f06r"> </code></button>`);
var root_4 = from_html(`<p class="types-hint svelte-h7f06r">Click on a type to search for objects of that type:</p> <div class="types-list svelte-h7f06r"></div>`, 1);
var root_5 = from_html(`<p class="no-types svelte-h7f06r">No new types in this version</p>`);
var root_6 = from_html(`<div class="version-types svelte-h7f06r"><!></div>`);
var root_7 = from_html(`<div class="version-item svelte-h7f06r"><div class="version-header svelte-h7f06r"><button class="version-toggle-btn svelte-h7f06r"><span class="version-arrow svelte-h7f06r"> </span> <strong> </strong> <code class="version-address svelte-h7f06r"> </code></button> <button class="explorer-btn svelte-h7f06r">Explorer</button></div> <!></div>`);
var root_8 = from_html(`<button class="load-more-btn svelte-h7f06r" style="margin-top: 0.5rem;"> </button>`);
var root_9 = from_html(`<div class="package-types svelte-h7f06r"><h3 class="svelte-h7f06r"> </h3> <!> <!></div>`);
var root_10 = from_html(`<strong class="svelte-h7f06r">Version:</strong> <code class="svelte-h7f06r"> </code>`, 1);
var root_11 = from_html(`<strong class="svelte-h7f06r">Digest:</strong> <code class="svelte-h7f06r"> </code>`, 1);
var root_12 = from_html(`<div class="detail-row svelte-h7f06r"><!> <!></div>`);
var root_13 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Last tx:</strong> <span class="svelte-h7f06r"><a target="_blank" class="address-link svelte-h7f06r"> </a></span></div>`);
var root_14 = from_html(`<li class="svelte-h7f06r"> </li>`);
var root_15 = from_html(`<!> <!> <div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Package</strong></div> <div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Modules:</strong> <ul class="svelte-h7f06r"></ul></div>`, 1);
var root_16 = from_html(`<span class="owner-type svelte-h7f06r">Address</span> <a target="_blank" class="address-link svelte-h7f06r"> </a>`, 1);
var root_17 = from_html(`<a target="_blank" class="address-link svelte-h7f06r"> </a>`);
var root_18 = from_html(`<span class="owner-type svelte-h7f06r">Object</span> <!>`, 1);
var root_19 = from_html(`<span class="owner-type svelte-h7f06r">Shared</span> `, 1);
var root_20 = from_html(`<span class="owner-type svelte-h7f06r">Immutable</span>`);
var root_21 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Owner:</strong> <span class="svelte-h7f06r"><!></span></div>`);
var root_22 = from_html(`<div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Type:</strong> <code class="svelte-h7f06r"> </code></div>`);
var root_23 = from_html(`<details class="dynamic-fields-details svelte-h7f06r"><summary class="dynamic-fields-summary svelte-h7f06r"><strong> </strong></summary> <pre class="json-content svelte-h7f06r"> </pre></details>`);
var root_24 = from_html(`<!> <div class="detail-row svelte-h7f06r"><strong class="svelte-h7f06r">Contents:</strong> <button class="dynamic-fields-btn svelte-h7f06r"> </button></div> <pre class="json-content svelte-h7f06r"> </pre> <!>`, 1);
var root_25 = from_html(`<!> <!> <!> <!>`, 1);
var root_26 = from_html(`<div class="objects-list svelte-h7f06r"><h3 class="svelte-h7f06r">Object Details</h3> <div class="object-item svelte-h7f06r"><details class="object-details svelte-h7f06r"><summary class="object-summary svelte-h7f06r"><code class="object-address svelte-h7f06r"> </code> <button class="explorer-btn svelte-h7f06r">Explorer</button></summary> <div class="object-details-content svelte-h7f06r"><!></div></details></div></div>`);
var root_27 = from_html(`<button class="load-more-btn svelte-h7f06r"> </button>`);
var root_28 = from_html(`<div class="object-item svelte-h7f06r"><details class="object-details svelte-h7f06r"><summary class="object-summary svelte-h7f06r"><code class="object-address svelte-h7f06r"> </code> <button class="explorer-btn svelte-h7f06r">Explorer</button></summary> <div class="object-details-content svelte-h7f06r"><!> <!> <!> <!></div></details></div>`);
var root_29 = from_html(`<button class="load-more-btn bottom-load-more svelte-h7f06r"> </button>`);
var root_30 = from_html(`<div class="objects-list svelte-h7f06r"><div class="objects-header svelte-h7f06r"><div class="header-controls svelte-h7f06r"><div class="expand-controls svelte-h7f06r"><button class="svelte-h7f06r">Expand All</button> <button class="svelte-h7f06r">Collapse All</button></div> <!> <div class="page-size-control svelte-h7f06r"><label for="page-size" class="svelte-h7f06r">Page Size:</label> <select id="page-size" class="svelte-h7f06r"><option>1</option><option>5</option><option>10</option><option>20</option><option>50</option></select></div></div> <h3 class="svelte-h7f06r"> </h3></div> <!> <!></div>`);
var root_31 = from_html(`<div class="object-page svelte-h7f06r"><h3 class="svelte-h7f06r">Object Viewer</h3> <div class="input-section svelte-h7f06r"><div class="input-header svelte-h7f06r"><label for="object-input" class="svelte-h7f06r">Object ID (hex), Object Type, or Package ID:</label> <div class="examples-section svelte-h7f06r"><span class="svelte-h7f06r">Examples:</span> <div class="button-group svelte-h7f06r"><button class="svelte-h7f06r">IOTA Framework</button> <button class="svelte-h7f06r">System Package</button> <button class="svelte-h7f06r">Clock Object</button> <button class="svelte-h7f06r">IOTA-Names</button></div></div></div> <input type="text" id="object-input" placeholder="Enter object ID (0x...), type (0x2::coin::Coin), or package ID (0x...)" class="svelte-h7f06r"/></div> <!> <!> <!> <!> <!></div>`);
function Object$1($$anchor, $$props) {
	push($$props, true);
	const $pageParams = () => store_get(pageParams, "$pageParams", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const pageParams = usePageQueryParams({
		objectInput: "",
		pageSize: "5"
	});
	let objectInputTextarea;
	let objectInput = "";
	let pageSize = state("1");
	let currentInputType = state(null);
	let objectData = state(null);
	let objectsList = state(proxy([]));
	let packageTypes = state(proxy([]));
	let error = state("");
	let loading = state(false);
	let mode = state("single");
	let currentCursor = state(null);
	let hasNext = state(false);
	let loadingNext = state(false);
	let packageVersions = state(proxy([]));
	let packageVersionsCursor = state(null);
	let packageVersionsHasNext = state(false);
	let packageVersionsLoading = state(false);
	let packageTypesPerVersion = state(proxy(/* @__PURE__ */ new Map()));
	let packageTypesLoadingMap = state(proxy(/* @__PURE__ */ new Map()));
	let expandedVersions = state(proxy({}));
	let dynamicFieldsMap = state(proxy(/* @__PURE__ */ new Map()));
	let dynamicFieldsLoading = state(proxy(/* @__PURE__ */ new Map()));
	let dynamicFieldsInitiallyOpen = state(proxy(/* @__PURE__ */ new Map()));
	async function fetchSingleObject(objectId) {
		try {
			set(loading, true);
			set(error, "");
			const obj = await fetchSingleObjectData(objectId, getSelectedNetworkConfig().graphql);
			if (!obj) {
				set(error, "Object not found");
				set(objectData, null);
				return;
			}
			set(objectData, obj, true);
			set(objectsList, [], true);
			set(packageTypes, [], true);
			set(mode, "single");
		} catch (e) {
			set(error, `Failed to fetch object: ${e.message || e}`);
			set(objectData, null);
		} finally {
			set(loading, false);
		}
	}
	async function queryDynamicFieldsForObject(objectId) {
		get(dynamicFieldsLoading).set(objectId, true);
		set(dynamicFieldsLoading, new Map(get(dynamicFieldsLoading)), true);
		const result = await queryDynamicFields({
			objectId,
			pageSize: 50,
			graphqlUrl: getSelectedNetworkConfig().graphql
		});
		if (result.error) {
			console.error("Error fetching dynamic fields:", result.error);
			get(dynamicFieldsMap).set(objectId, []);
		} else {
			get(dynamicFieldsMap).set(objectId, result.nodes);
			get(dynamicFieldsInitiallyOpen).set(objectId, true);
		}
		get(dynamicFieldsLoading).set(objectId, false);
		set(dynamicFieldsLoading, new Map(get(dynamicFieldsLoading)), true);
		set(dynamicFieldsMap, new Map(get(dynamicFieldsMap)), true);
		set(dynamicFieldsInitiallyOpen, new Map(get(dynamicFieldsInitiallyOpen)), true);
	}
	async function fetchObjectsByType(type, cursor = null) {
		try {
			set(loading, true);
			set(error, "");
			const objects = await fetchObjectsByTypeData(type, getSelectedNetworkConfig().graphql, cursor, parseInt(get(pageSize)));
			if (!objects || !objects.nodes) {
				set(error, "No objects found");
				set(objectsList, [], true);
				return;
			}
			if (cursor) {
				const startIndex = get(objectsList).length;
				set(objectsList, [...get(objectsList), ...objects.nodes], true);
				if (get(allExpanded)) objects.nodes.forEach((_, i) => {
					get(expandedObjects)[startIndex + i] = true;
				});
			} else {
				set(objectsList, objects.nodes, true);
				set(expandedObjects, {}, true);
				set(allExpanded, false);
			}
			set(currentCursor, objects.pageInfo.endCursor, true);
			set(hasNext, objects.pageInfo.hasNextPage, true);
			set(objectData, null);
			if (get(mode) !== "package") {
				set(packageTypes, [], true);
				set(mode, "list");
			}
		} catch (e) {
			set(error, `Failed to fetch objects: ${e.message || e}`);
			set(objectsList, [], true);
		} finally {
			set(loading, false);
		}
	}
	async function fetchPackageVersions(packageId, cursor = null) {
		try {
			if (!cursor) {
				set(loading, true);
				set(packageVersions, [], true);
				set(packageTypesPerVersion, /* @__PURE__ */ new Map(), true);
				set(expandedVersions, {}, true);
			} else set(packageVersionsLoading, true);
			set(error, "");
			const result = await fetchPackageVersionsData(packageId, getSelectedNetworkConfig().graphql, cursor, 10);
			if (!result || !result.nodes || result.nodes.length === 0) {
				if (!cursor) throw new Error("Not a package");
				return;
			}
			if (cursor) {
				const startIndex = get(packageVersions).length;
				set(packageVersions, [...get(packageVersions), ...result.nodes], true);
				await Promise.all(result.nodes.map((v) => fetchTypesForVersion(v.address)));
				for (let i = startIndex; i < get(packageVersions).length; i++) if (getNewTypesForVersion(i).length > 0) get(expandedVersions)[i] = true;
			} else set(packageVersions, result.nodes, true);
			set(packageVersionsCursor, result.pageInfo.endCursor, true);
			set(packageVersionsHasNext, result.pageInfo.hasNextPage, true);
			if (!cursor && get(packageVersions).length > 0) {
				await Promise.all(get(packageVersions).map((v) => fetchTypesForVersion(v.address)));
				for (let i = 0; i < get(packageVersions).length; i++) if (getNewTypesForVersion(i).length > 0) get(expandedVersions)[i] = true;
			}
			set(objectsList, [], true);
			set(mode, "package");
		} finally {
			set(loading, false);
			set(packageVersionsLoading, false);
		}
	}
	async function fetchTypesForVersion(versionAddress) {
		if (get(packageTypesPerVersion).has(versionAddress)) return;
		get(packageTypesLoadingMap).set(versionAddress, true);
		set(packageTypesLoadingMap, new Map(get(packageTypesLoadingMap)), true);
		try {
			const types = await fetchPackageTypesData(versionAddress, getSelectedNetworkConfig().graphql);
			get(packageTypesPerVersion).set(versionAddress, types);
			set(packageTypesPerVersion, new Map(get(packageTypesPerVersion)), true);
		} catch (e) {
			get(packageTypesPerVersion).set(versionAddress, []);
			set(packageTypesPerVersion, new Map(get(packageTypesPerVersion)), true);
		} finally {
			get(packageTypesLoadingMap).set(versionAddress, false);
			set(packageTypesLoadingMap, new Map(get(packageTypesLoadingMap)), true);
		}
	}
	async function loadMoreVersions() {
		if (!get(packageVersionsCursor) || !get(packageVersionsHasNext)) return;
		await fetchPackageVersions(objectInput.trim(), get(packageVersionsCursor));
	}
	async function toggleVersionExpand(index, versionAddress) {
		get(expandedVersions)[index] = !get(expandedVersions)[index];
		if (get(expandedVersions)[index]) {
			const fetchPromises = [];
			for (let j = 0; j <= index; j++) fetchPromises.push(fetchTypesForVersion(get(packageVersions)[j].address));
			await Promise.all(fetchPromises);
		}
	}
	function isVersionTypesLoading(index) {
		for (let j = 0; j <= index; j++) if (get(packageTypesLoadingMap).get(get(packageVersions)[j].address)) return true;
		return false;
	}
	function isVersionTypesReady(index) {
		for (let j = 0; j <= index; j++) if (!get(packageTypesPerVersion).has(get(packageVersions)[j].address)) return false;
		return true;
	}
	function getNewTypesForVersion(index) {
		const versionAddress = get(packageVersions)[index].address;
		const types = get(packageTypesPerVersion).get(versionAddress) ?? [];
		const earlierTypes = /* @__PURE__ */ new Set();
		for (let j = 0; j < index; j++) (get(packageTypesPerVersion).get(get(packageVersions)[j].address) ?? []).forEach((t) => earlierTypes.add(t.displayType));
		return types.filter((t) => !earlierTypes.has(t.displayType));
	}
	async function processInput() {
		const input = objectInput.trim();
		if (!input) {
			set(error, "Please enter object ID, type, or package ID");
			return;
		}
		const type = detectInputType(input);
		set(currentInputType, type, true);
		if (!type) {
			set(error, "Invalid input format. Expected hex address (0x...) or type (containing ::)");
			return;
		}
		if (type === "hex") try {
			await fetchSingleObject(input);
			if (get(objectData) && get(objectData).asMovePackage) await fetchPackageVersions(input);
			else updatePageQueryParams({ objectInput: input });
			return;
		} catch (e) {
			await fetchPackageVersions(input);
		}
		else if (type === "type") await fetchObjectsByType(input);
		updatePageQueryParams({ objectInput: input });
	}
	async function loadNextPage() {
		if (!get(currentCursor) || !get(hasNext)) return;
		try {
			set(loadingNext, true);
			await fetchObjectsByType(objectInput.trim(), get(currentCursor));
		} finally {
			set(loadingNext, false);
		}
	}
	async function searchType(type) {
		objectInput = type;
		if (objectInputTextarea) objectInputTextarea.value = type;
		await fetchObjectsByType(type);
		updatePageQueryParams({ objectInput: type });
	}
	function handlePageSizeChange() {
		updatePageQueryParams({ pageSize: get(pageSize) });
	}
	const loadExample = async (example) => {
		if (objectInputTextarea) {
			objectInputTextarea.value = example;
			objectInput = example;
			updatePageQueryParams({ objectInput: example });
			await processInput();
		}
	};
	onMount(() => {
		const params = $pageParams();
		if (params.objectInput && objectInputTextarea) {
			objectInputTextarea.value = params.objectInput;
			const event = new Event("input", { bubbles: true });
			objectInputTextarea.dispatchEvent(event);
		}
		set(pageSize, params.pageSize, true);
	});
	let expandedObjects = state(proxy({}));
	let singleObjectExpanded = state(true);
	let inputTimeout = state(null);
	let allExpanded = state(false);
	function expandAllObjects() {
		get(objectsList).forEach((_, i) => get(expandedObjects)[i] = true);
		set(allExpanded, true);
	}
	function collapseAllObjects() {
		set(expandedObjects, {}, true);
		set(allExpanded, false);
	}
	function handleInput(event) {
		objectInput = event.target.value;
		updatePageQueryParams({ objectInput });
		if (get(inputTimeout)) clearTimeout(get(inputTimeout));
		if (objectInput.trim()) set(inputTimeout, setTimeout(() => {
			processInput();
		}, 500), true);
		else {
			set(objectData, null);
			set(objectsList, [], true);
			set(packageTypes, [], true);
			set(packageVersions, [], true);
			set(packageTypesPerVersion, /* @__PURE__ */ new Map(), true);
			set(error, "");
		}
	}
	var div = root_31();
	var div_1 = sibling(child(div), 2);
	var div_2 = child(div_1);
	var div_3 = sibling(child(div_2), 2);
	var div_4 = sibling(child(div_3), 2);
	var button = child(div_4);
	var button_1 = sibling(button, 2);
	var button_2 = sibling(button_1, 2);
	var button_3 = sibling(button_2, 2);
	reset(div_4);
	reset(div_3);
	reset(div_2);
	var input_1 = sibling(div_2, 2);
	bind_this(input_1, ($$value) => objectInputTextarea = $$value, () => objectInputTextarea);
	reset(div_1);
	var node = sibling(div_1, 2);
	var consequent = ($$anchor) => {
		var div_5 = root();
		var text = sibling(child(div_5));
		reset(div_5);
		template_effect(() => set_text(text, ` ${get(error) ?? ""}`));
		append($$anchor, div_5);
	};
	if_block(node, ($$render) => {
		if (get(error)) $$render(consequent);
	});
	var node_1 = sibling(node, 2);
	var consequent_1 = ($$anchor) => {
		append($$anchor, root_1());
	};
	if_block(node_1, ($$render) => {
		if (get(loading)) $$render(consequent_1);
	});
	var node_2 = sibling(node_1, 2);
	var consequent_7 = ($$anchor) => {
		var div_7 = root_9();
		var h3 = child(div_7);
		var text_1 = child(h3);
		reset(h3);
		var node_3 = sibling(h3, 2);
		each(node_3, 17, () => get(packageVersions), index, ($$anchor, ver, i) => {
			var div_8 = root_7();
			var div_9 = child(div_8);
			var button_4 = child(div_9);
			var span = child(button_4);
			var text_2 = child(span, true);
			reset(span);
			var strong = sibling(span, 2);
			var text_3 = child(strong);
			reset(strong);
			var code = sibling(strong, 2);
			var text_4 = child(code, true);
			reset(code);
			reset(button_4);
			var button_5 = sibling(button_4, 2);
			reset(div_9);
			var node_4 = sibling(div_9, 2);
			var consequent_5 = ($$anchor) => {
				var div_10 = root_6();
				var node_5 = child(div_10);
				var consequent_2 = ($$anchor) => {
					append($$anchor, root_2());
				};
				var d = user_derived(() => isVersionTypesLoading(i));
				var consequent_4 = ($$anchor) => {
					const newTypes = user_derived(() => getNewTypesForVersion(i));
					var fragment = comment();
					var node_6 = first_child(fragment);
					var consequent_3 = ($$anchor) => {
						var fragment_1 = root_4();
						var div_12 = sibling(first_child(fragment_1), 2);
						each(div_12, 21, () => get(newTypes), index, ($$anchor, type) => {
							var button_6 = root_3();
							var code_1 = child(button_6);
							var text_5 = child(code_1, true);
							reset(code_1);
							reset(button_6);
							template_effect(() => set_text(text_5, get(type).displayType));
							delegated("click", button_6, () => searchType(get(type).fullType));
							append($$anchor, button_6);
						});
						reset(div_12);
						append($$anchor, fragment_1);
					};
					var alternate = ($$anchor) => {
						append($$anchor, root_5());
					};
					if_block(node_6, ($$render) => {
						if (get(newTypes).length > 0) $$render(consequent_3);
						else $$render(alternate, -1);
					});
					append($$anchor, fragment);
				};
				var d_1 = user_derived(() => isVersionTypesReady(i));
				if_block(node_5, ($$render) => {
					if (get(d)) $$render(consequent_2);
					else if (get(d_1)) $$render(consequent_4, 1);
				});
				reset(div_10);
				append($$anchor, div_10);
			};
			if_block(node_4, ($$render) => {
				if (get(expandedVersions)[i]) $$render(consequent_5);
			});
			reset(div_8);
			template_effect(() => {
				set_text(text_2, get(expandedVersions)[i] ? "▼" : "▶");
				set_text(text_3, `v${get(ver).version ?? ""}`);
				set_text(text_4, get(ver).address);
			});
			delegated("click", button_4, () => toggleVersionExpand(i, get(ver).address));
			delegated("click", button_5, () => window.open(getObjectLink(getSelectedNetworkConfig(), get(ver).address), "_blank"));
			append($$anchor, div_8);
		});
		var node_7 = sibling(node_3, 2);
		var consequent_6 = ($$anchor) => {
			var button_7 = root_8();
			var text_6 = child(button_7, true);
			reset(button_7);
			template_effect(() => {
				button_7.disabled = get(packageVersionsLoading);
				set_text(text_6, get(packageVersionsLoading) ? "Loading..." : "Load More Versions");
			});
			delegated("click", button_7, loadMoreVersions);
			append($$anchor, button_7);
		};
		if_block(node_7, ($$render) => {
			if (get(packageVersionsHasNext)) $$render(consequent_6);
		});
		reset(div_7);
		template_effect(() => set_text(text_1, `Package Versions (${get(packageVersions).length ?? ""}${get(packageVersionsHasNext) ? "+" : ""})`));
		append($$anchor, div_7);
	};
	if_block(node_2, ($$render) => {
		if (get(packageVersions).length > 0) $$render(consequent_7);
	});
	var node_8 = sibling(node_2, 2);
	var consequent_26 = ($$anchor) => {
		var div_13 = root_26();
		var div_14 = sibling(child(div_13), 2);
		var details = child(div_14);
		var summary = child(details);
		var code_2 = child(summary);
		var text_7 = child(code_2, true);
		reset(code_2);
		var button_8 = sibling(code_2, 2);
		reset(summary);
		var div_15 = sibling(summary, 2);
		var node_9 = child(div_15);
		var consequent_12 = ($$anchor) => {
			var fragment_2 = root_15();
			var node_10 = first_child(fragment_2);
			var consequent_10 = ($$anchor) => {
				var div_16 = root_12();
				var node_11 = child(div_16);
				var consequent_8 = ($$anchor) => {
					var fragment_3 = root_10();
					var code_3 = sibling(first_child(fragment_3), 2);
					var text_8 = child(code_3, true);
					reset(code_3);
					template_effect(() => set_text(text_8, get(objectData).version));
					append($$anchor, fragment_3);
				};
				if_block(node_11, ($$render) => {
					if (get(objectData).version) $$render(consequent_8);
				});
				var node_12 = sibling(node_11, 2);
				var consequent_9 = ($$anchor) => {
					var fragment_4 = root_11();
					var code_4 = sibling(first_child(fragment_4), 2);
					var text_9 = child(code_4, true);
					reset(code_4);
					template_effect(() => set_text(text_9, get(objectData).digest));
					append($$anchor, fragment_4);
				};
				if_block(node_12, ($$render) => {
					if (get(objectData).digest) $$render(consequent_9);
				});
				reset(div_16);
				append($$anchor, div_16);
			};
			if_block(node_10, ($$render) => {
				if (get(objectData).version || get(objectData).digest) $$render(consequent_10);
			});
			var node_13 = sibling(node_10, 2);
			var consequent_11 = ($$anchor) => {
				var div_17 = root_13();
				var span_1 = sibling(child(div_17), 2);
				var a = child(span_1);
				var text_10 = child(a, true);
				reset(a);
				reset(span_1);
				reset(div_17);
				template_effect(($0) => {
					set_attribute(a, "href", $0);
					set_text(text_10, get(objectData).previousTransactionBlock.digest);
				}, [() => getTransactionLink(getSelectedNetworkConfig(), get(objectData).previousTransactionBlock.digest)]);
				append($$anchor, div_17);
			};
			if_block(node_13, ($$render) => {
				if (get(objectData).previousTransactionBlock) $$render(consequent_11);
			});
			var div_18 = sibling(node_13, 4);
			var ul = sibling(child(div_18), 2);
			each(ul, 21, () => get(objectData).asMovePackage.modules.nodes, index, ($$anchor, module) => {
				var li = root_14();
				var text_11 = child(li, true);
				reset(li);
				template_effect(() => set_text(text_11, get(module).name));
				append($$anchor, li);
			});
			reset(ul);
			reset(div_18);
			append($$anchor, fragment_2);
		};
		var alternate_3 = ($$anchor) => {
			var fragment_5 = root_25();
			var node_14 = first_child(fragment_5);
			var consequent_15 = ($$anchor) => {
				var div_19 = root_12();
				var node_15 = child(div_19);
				var consequent_13 = ($$anchor) => {
					var fragment_6 = root_10();
					var code_5 = sibling(first_child(fragment_6), 2);
					var text_12 = child(code_5, true);
					reset(code_5);
					template_effect(() => set_text(text_12, get(objectData).version));
					append($$anchor, fragment_6);
				};
				if_block(node_15, ($$render) => {
					if (get(objectData).version) $$render(consequent_13);
				});
				var node_16 = sibling(node_15, 2);
				var consequent_14 = ($$anchor) => {
					var fragment_7 = root_11();
					var code_6 = sibling(first_child(fragment_7), 2);
					var text_13 = child(code_6, true);
					reset(code_6);
					template_effect(() => set_text(text_13, get(objectData).digest));
					append($$anchor, fragment_7);
				};
				if_block(node_16, ($$render) => {
					if (get(objectData).digest) $$render(consequent_14);
				});
				reset(div_19);
				append($$anchor, div_19);
			};
			if_block(node_14, ($$render) => {
				if (get(objectData).version || get(objectData).digest) $$render(consequent_15);
			});
			var node_17 = sibling(node_14, 2);
			var consequent_21 = ($$anchor) => {
				var div_20 = root_21();
				var span_2 = sibling(child(div_20), 2);
				var node_18 = child(span_2);
				var consequent_16 = ($$anchor) => {
					var fragment_8 = root_16();
					var a_1 = sibling(first_child(fragment_8), 2);
					var text_14 = child(a_1, true);
					reset(a_1);
					template_effect(($0) => {
						set_attribute(a_1, "href", $0);
						set_text(text_14, get(objectData).owner.owner.address || get(objectData).owner.owner);
					}, [() => getAddressLink(getSelectedNetworkConfig(), get(objectData).owner.owner.address || get(objectData).owner.owner)]);
					append($$anchor, fragment_8);
				};
				var consequent_18 = ($$anchor) => {
					var fragment_9 = root_18();
					var node_19 = sibling(first_child(fragment_9), 2);
					var consequent_17 = ($$anchor) => {
						var a_2 = root_17();
						var text_15 = child(a_2, true);
						reset(a_2);
						template_effect(($0) => {
							set_attribute(a_2, "href", $0);
							set_text(text_15, get(objectData).owner.parent.address);
						}, [() => getObjectLink(getSelectedNetworkConfig(), get(objectData).owner.parent.address)]);
						append($$anchor, a_2);
					};
					var alternate_1 = ($$anchor) => {
						append($$anchor, text("(parent not accessible)"));
					};
					if_block(node_19, ($$render) => {
						if (get(objectData).owner.parent?.address) $$render(consequent_17);
						else $$render(alternate_1, -1);
					});
					append($$anchor, fragment_9);
				};
				var consequent_19 = ($$anchor) => {
					var fragment_10 = root_19();
					var text_17 = sibling(first_child(fragment_10));
					template_effect(() => set_text(text_17, ` (v${get(objectData).owner.initialSharedVersion ?? ""})`));
					append($$anchor, fragment_10);
				};
				var consequent_20 = ($$anchor) => {
					append($$anchor, root_20());
				};
				var alternate_2 = ($$anchor) => {
					var text_18 = text();
					template_effect(($0) => set_text(text_18, $0), [() => JSON.stringify(get(objectData).owner)]);
					append($$anchor, text_18);
				};
				if_block(node_18, ($$render) => {
					if (get(objectData).owner.__typename === "AddressOwner") $$render(consequent_16);
					else if (get(objectData).owner.__typename === "Parent") $$render(consequent_18, 1);
					else if (get(objectData).owner.__typename === "Shared") $$render(consequent_19, 2);
					else if (get(objectData).owner.__typename === "Immutable") $$render(consequent_20, 3);
					else $$render(alternate_2, -1);
				});
				reset(span_2);
				reset(div_20);
				append($$anchor, div_20);
			};
			if_block(node_17, ($$render) => {
				if (get(objectData).owner) $$render(consequent_21);
			});
			var node_20 = sibling(node_17, 2);
			var consequent_22 = ($$anchor) => {
				var div_21 = root_13();
				var span_4 = sibling(child(div_21), 2);
				var a_3 = child(span_4);
				var text_19 = child(a_3, true);
				reset(a_3);
				reset(span_4);
				reset(div_21);
				template_effect(($0) => {
					set_attribute(a_3, "href", $0);
					set_text(text_19, get(objectData).previousTransactionBlock.digest);
				}, [() => getTransactionLink(getSelectedNetworkConfig(), get(objectData).previousTransactionBlock.digest)]);
				append($$anchor, div_21);
			};
			if_block(node_20, ($$render) => {
				if (get(objectData).previousTransactionBlock) $$render(consequent_22);
			});
			var node_21 = sibling(node_20, 2);
			var consequent_25 = ($$anchor) => {
				var fragment_12 = root_24();
				var node_22 = first_child(fragment_12);
				var consequent_23 = ($$anchor) => {
					var div_22 = root_22();
					var code_7 = sibling(child(div_22), 2);
					var text_20 = child(code_7, true);
					reset(code_7);
					reset(div_22);
					template_effect(() => set_text(text_20, get(objectData).asMoveObject.contents.type?.repr || "Unknown"));
					append($$anchor, div_22);
				};
				if_block(node_22, ($$render) => {
					if (get(currentInputType) === "hex") $$render(consequent_23);
				});
				var div_23 = sibling(node_22, 2);
				var button_9 = sibling(child(div_23), 2);
				var text_21 = child(button_9, true);
				reset(button_9);
				reset(div_23);
				var pre = sibling(div_23, 2);
				var text_22 = child(pre, true);
				reset(pre);
				var node_23 = sibling(pre, 2);
				var consequent_24 = ($$anchor) => {
					var details_1 = root_23();
					var summary_1 = child(details_1);
					var strong_1 = child(summary_1);
					var text_23 = child(strong_1);
					reset(strong_1);
					reset(summary_1);
					var pre_1 = sibling(summary_1, 2);
					var text_24 = child(pre_1, true);
					reset(pre_1);
					reset(details_1);
					template_effect(($0, $1, $2) => {
						details_1.open = $0;
						set_text(text_23, `Dynamic Fields (${$1 ?? ""})`);
						set_text(text_24, $2);
					}, [
						() => get(dynamicFieldsInitiallyOpen).get(get(objectData).address) || false,
						() => get(dynamicFieldsMap).get(get(objectData).address).length,
						() => JSON.stringify(get(dynamicFieldsMap).get(get(objectData).address), null, 2)
					]);
					append($$anchor, details_1);
				};
				var d_2 = user_derived(() => get(objectData).address && (get(dynamicFieldsMap).get(get(objectData).address)?.length ?? 0) > 0);
				if_block(node_23, ($$render) => {
					if (get(d_2)) $$render(consequent_24);
				});
				template_effect(($0, $1, $2) => {
					button_9.disabled = $0;
					set_text(text_21, $1);
					set_text(text_22, $2);
				}, [
					() => get(dynamicFieldsLoading).get(get(objectData).address) || false,
					() => get(dynamicFieldsLoading).get(get(objectData).address) ? "Loading..." : get(dynamicFieldsMap).has(get(objectData).address) ? `Query Dynamic Fields: ${get(dynamicFieldsMap).get(get(objectData).address)?.length ?? 0}` : "Query Dynamic Fields",
					() => JSON.stringify(get(objectData).asMoveObject.contents.json, null, 2)
				]);
				delegated("click", button_9, () => queryDynamicFieldsForObject(get(objectData).address));
				append($$anchor, fragment_12);
			};
			if_block(node_21, ($$render) => {
				if (get(objectData).asMoveObject) $$render(consequent_25);
			});
			append($$anchor, fragment_5);
		};
		if_block(node_9, ($$render) => {
			if (get(objectData).asMovePackage) $$render(consequent_12);
			else $$render(alternate_3, -1);
		});
		reset(div_15);
		reset(details);
		reset(div_14);
		reset(div_13);
		template_effect(() => set_text(text_7, get(objectData).address));
		delegated("click", button_8, () => window.open(getObjectLink(getSelectedNetworkConfig(), get(objectData).address), "_blank"));
		bind_property("open", "toggle", details, ($$value) => set(singleObjectExpanded, $$value), () => get(singleObjectExpanded));
		append($$anchor, div_13);
	};
	if_block(node_8, ($$render) => {
		if (get(objectData)) $$render(consequent_26);
	});
	var node_24 = sibling(node_8, 2);
	var consequent_39 = ($$anchor) => {
		var div_24 = root_30();
		var div_25 = child(div_24);
		var div_26 = child(div_25);
		var div_27 = child(div_26);
		var button_10 = child(div_27);
		var button_11 = sibling(button_10, 2);
		reset(div_27);
		var node_25 = sibling(div_27, 2);
		var consequent_27 = ($$anchor) => {
			var button_12 = root_27();
			var text_25 = child(button_12, true);
			reset(button_12);
			template_effect(() => {
				button_12.disabled = get(loadingNext);
				set_text(text_25, get(loadingNext) ? "Loading..." : "Load More");
			});
			delegated("click", button_12, loadNextPage);
			append($$anchor, button_12);
		};
		if_block(node_25, ($$render) => {
			if (get(hasNext)) $$render(consequent_27);
		});
		var div_28 = sibling(node_25, 2);
		var select = sibling(child(div_28), 2);
		var option = child(select);
		option.value = option.__value = "1";
		var option_1 = sibling(option);
		option_1.value = option_1.__value = "5";
		var option_2 = sibling(option_1);
		option_2.value = option_2.__value = "10";
		var option_3 = sibling(option_2);
		option_3.value = option_3.__value = "20";
		var option_4 = sibling(option_3);
		option_4.value = option_4.__value = "50";
		reset(select);
		reset(div_28);
		reset(div_26);
		var h3_1 = sibling(div_26, 2);
		var text_26 = child(h3_1);
		reset(h3_1);
		reset(div_25);
		var node_26 = sibling(div_25, 2);
		each(node_26, 17, () => get(objectsList), index, ($$anchor, obj, i) => {
			var div_29 = root_28();
			var details_2 = child(div_29);
			var summary_2 = child(details_2);
			var code_8 = child(summary_2);
			var text_27 = child(code_8, true);
			reset(code_8);
			var button_13 = sibling(code_8, 2);
			reset(summary_2);
			var div_30 = sibling(summary_2, 2);
			var node_27 = child(div_30);
			var consequent_30 = ($$anchor) => {
				var div_31 = root_12();
				var node_28 = child(div_31);
				var consequent_28 = ($$anchor) => {
					var fragment_13 = root_10();
					var code_9 = sibling(first_child(fragment_13), 2);
					var text_28 = child(code_9, true);
					reset(code_9);
					template_effect(() => set_text(text_28, get(obj).version));
					append($$anchor, fragment_13);
				};
				if_block(node_28, ($$render) => {
					if (get(obj).version) $$render(consequent_28);
				});
				var node_29 = sibling(node_28, 2);
				var consequent_29 = ($$anchor) => {
					var fragment_14 = root_11();
					var code_10 = sibling(first_child(fragment_14), 2);
					var text_29 = child(code_10, true);
					reset(code_10);
					template_effect(() => set_text(text_29, get(obj).digest));
					append($$anchor, fragment_14);
				};
				if_block(node_29, ($$render) => {
					if (get(obj).digest) $$render(consequent_29);
				});
				reset(div_31);
				append($$anchor, div_31);
			};
			if_block(node_27, ($$render) => {
				if (get(obj).version || get(obj).digest) $$render(consequent_30);
			});
			var node_30 = sibling(node_27, 2);
			var consequent_33 = ($$anchor) => {
				var div_32 = root_21();
				var span_5 = sibling(child(div_32), 2);
				var node_31 = child(span_5);
				var consequent_31 = ($$anchor) => {
					var a_4 = root_17();
					var text_30 = child(a_4, true);
					reset(a_4);
					template_effect(($0) => {
						set_attribute(a_4, "href", $0);
						set_text(text_30, get(obj).owner.owner.address || get(obj).owner.owner);
					}, [() => getAddressLink(getSelectedNetworkConfig(), get(obj).owner.owner.address || get(obj).owner.owner)]);
					append($$anchor, a_4);
				};
				var consequent_32 = ($$anchor) => {
					var text_31 = text();
					template_effect(() => set_text(text_31, `Shared (v${get(obj).owner.initialSharedVersion ?? ""})`));
					append($$anchor, text_31);
				};
				var alternate_4 = ($$anchor) => {
					var text_32 = text();
					template_effect(($0) => set_text(text_32, $0), [() => JSON.stringify(get(obj).owner)]);
					append($$anchor, text_32);
				};
				if_block(node_31, ($$render) => {
					if (get(obj).owner.owner) $$render(consequent_31);
					else if (get(obj).owner.initialSharedVersion) $$render(consequent_32, 1);
					else $$render(alternate_4, -1);
				});
				reset(span_5);
				reset(div_32);
				append($$anchor, div_32);
			};
			if_block(node_30, ($$render) => {
				if (get(obj).owner) $$render(consequent_33);
			});
			var node_32 = sibling(node_30, 2);
			var consequent_34 = ($$anchor) => {
				var div_33 = root_13();
				var span_6 = sibling(child(div_33), 2);
				var a_5 = child(span_6);
				var text_33 = child(a_5, true);
				reset(a_5);
				reset(span_6);
				reset(div_33);
				template_effect(($0) => {
					set_attribute(a_5, "href", $0);
					set_text(text_33, get(obj).previousTransactionBlock.digest);
				}, [() => getTransactionLink(getSelectedNetworkConfig(), get(obj).previousTransactionBlock.digest)]);
				append($$anchor, div_33);
			};
			if_block(node_32, ($$render) => {
				if (get(obj).previousTransactionBlock) $$render(consequent_34);
			});
			var node_33 = sibling(node_32, 2);
			var consequent_37 = ($$anchor) => {
				var fragment_17 = root_24();
				var node_34 = first_child(fragment_17);
				var consequent_35 = ($$anchor) => {
					var div_34 = root_22();
					var code_11 = sibling(child(div_34), 2);
					var text_34 = child(code_11, true);
					reset(code_11);
					reset(div_34);
					template_effect(() => set_text(text_34, get(obj).asMoveObject.contents.type?.repr || "Unknown"));
					append($$anchor, div_34);
				};
				if_block(node_34, ($$render) => {
					if (get(currentInputType) === "hex") $$render(consequent_35);
				});
				var div_35 = sibling(node_34, 2);
				var button_14 = sibling(child(div_35), 2);
				var text_35 = child(button_14, true);
				reset(button_14);
				reset(div_35);
				var pre_2 = sibling(div_35, 2);
				var text_36 = child(pre_2, true);
				reset(pre_2);
				var node_35 = sibling(pre_2, 2);
				var consequent_36 = ($$anchor) => {
					var details_3 = root_23();
					var summary_3 = child(details_3);
					var strong_2 = child(summary_3);
					var text_37 = child(strong_2);
					reset(strong_2);
					reset(summary_3);
					var pre_3 = sibling(summary_3, 2);
					var text_38 = child(pre_3, true);
					reset(pre_3);
					reset(details_3);
					template_effect(($0, $1, $2) => {
						details_3.open = $0;
						set_text(text_37, `Dynamic Fields (${$1 ?? ""})`);
						set_text(text_38, $2);
					}, [
						() => get(dynamicFieldsInitiallyOpen).get(get(obj).address) || false,
						() => get(dynamicFieldsMap).get(get(obj).address).length,
						() => JSON.stringify(get(dynamicFieldsMap).get(get(obj).address), null, 2)
					]);
					append($$anchor, details_3);
				};
				var d_3 = user_derived(() => get(obj).address && (get(dynamicFieldsMap).get(get(obj).address)?.length ?? 0) > 0);
				if_block(node_35, ($$render) => {
					if (get(d_3)) $$render(consequent_36);
				});
				template_effect(($0, $1, $2) => {
					button_14.disabled = $0;
					set_text(text_35, $1);
					set_text(text_36, $2);
				}, [
					() => get(dynamicFieldsLoading).get(get(obj).address) || false,
					() => get(dynamicFieldsLoading).get(get(obj).address) ? "Loading..." : get(dynamicFieldsMap).has(get(obj).address) ? `Query Dynamic Fields: ${get(dynamicFieldsMap).get(get(obj).address)?.length ?? 0}` : "Query Dynamic Fields",
					() => JSON.stringify(get(obj).asMoveObject.contents.json, null, 2)
				]);
				delegated("click", button_14, () => queryDynamicFieldsForObject(get(obj).address));
				append($$anchor, fragment_17);
			};
			if_block(node_33, ($$render) => {
				if (get(obj).asMoveObject) $$render(consequent_37);
			});
			reset(div_30);
			reset(details_2);
			reset(div_29);
			template_effect(() => set_text(text_27, get(obj).address));
			delegated("click", button_13, () => window.open(getObjectLink(getSelectedNetworkConfig(), get(obj).address), "_blank"));
			bind_property("open", "toggle", details_2, ($$value) => get(expandedObjects)[i] = $$value, () => get(expandedObjects)[i]);
			append($$anchor, div_29);
		});
		var node_36 = sibling(node_26, 2);
		var consequent_38 = ($$anchor) => {
			var button_15 = root_29();
			var text_39 = child(button_15, true);
			reset(button_15);
			template_effect(() => {
				button_15.disabled = get(loadingNext);
				set_text(text_39, get(loadingNext) ? "Loading..." : "Load More");
			});
			delegated("click", button_15, loadNextPage);
			append($$anchor, button_15);
		};
		if_block(node_36, ($$render) => {
			if (get(hasNext)) $$render(consequent_38);
		});
		reset(div_24);
		template_effect(() => set_text(text_26, `Objects (${get(objectsList).length ?? ""})`));
		delegated("click", button_10, expandAllObjects);
		delegated("click", button_11, collapseAllObjects);
		delegated("change", select, handlePageSizeChange);
		bind_select_value(select, () => get(pageSize), ($$value) => set(pageSize, $$value));
		append($$anchor, div_24);
	};
	if_block(node_24, ($$render) => {
		if (get(objectsList).length > 0) $$render(consequent_39);
	});
	reset(div);
	delegated("click", button, () => loadExample("0x2"));
	delegated("click", button_1, () => loadExample("0x3"));
	delegated("click", button_2, () => loadExample(normalizeIotaAddress("0x6")));
	delegated("click", button_3, () => loadExample(getIotaNamesPackageId()));
	delegated("input", input_1, handleInput);
	append($$anchor, div);
	pop();
	$$cleanup();
}
delegate([
	"click",
	"input",
	"change"
]);
//#endregion
export { Object$1 as default };

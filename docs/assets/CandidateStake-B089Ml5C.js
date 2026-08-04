import { C as bind_select_value, D as set_class, Dt as pop, E as set_style, I as if_block, Mt as reset, N as each, Ot as push, P as index, R as set_text, U as delegate, V as from_html, W as delegated, Y as get, at as user_effect, ct as sibling, ft as set, gt as user_derived, h as bind_value, it as template_effect, jt as next, lt as proxy, ot as child, pt as state, r as onMount, st as first_child, v as remove_input_defaults, vt as setup_stores, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import { g as sharedClientConfig, o as Transaction, r as getSelectedNetworkConfig, t as getClient } from "./client-BTFoHz6u.js";
import { n as getObjectLink, t as getAddressLink } from "./explorer-links-hyzWVZGi.js";
import { t as executeTransaction } from "./transaction-execution-Cg5fkaOd.js";
import { t as activeAddress } from "./signer-data-D1Egmbld.js";
import { i as TransactionView, s as formatAddress } from "./index-RSDd7ke0.js";
//#region src/lib/pages/candidate-stake/candidate-stake-config.ts
var DEVNET_PACKAGE_ID = "0x5b8e73954c18a0d743e967de27e588ddcae6b7d060098e7a2e55c5d269cf76c1";
var TESTNET_PACKAGE_ID = "0xfc65701aeba619e4c1e33c58738874fd76330e8a50cf6a7d34626d198407c653";
var MAINNET_PACKAGE_ID = "0x82db91a26597e11d40afcbee6e71d2d7816de6513fe3a95d9e56bea0aca59f04";
function getCandidateStakePackageId() {
	switch (getSelectedNetworkConfig().name) {
		case "mainnet": return MAINNET_PACKAGE_ID;
		case "testnet": return TESTNET_PACKAGE_ID;
		case "devnet": return DEVNET_PACKAGE_ID;
		default: return "";
	}
}
function getGraphqlUrl() {
	return getSelectedNetworkConfig().graphql;
}
//#endregion
//#region src/lib/pages/candidate-stake/candidate-stake-data.ts
var POOL_QUERY = `
  query ($type: String!, $after: String) {
    objects(filter: { type: $type }, first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        address
        asMoveObject {
          contents { json }
        }
      }
    }
  }
`;
function parseFields(json) {
	const deposits = json["deposits"] ?? [];
	return {
		creator: String(json["creator"] ?? ""),
		target_validator: String(json["target_validator"] ?? ""),
		total_principal: String(json["total_principal"] ?? "0"),
		max_deposits: String(json["max_deposits"] ?? "1000"),
		deposits: deposits.map((d) => ({
			depositor: String(d["depositor"] ?? ""),
			principal_amount: String(d["principal_amount"] ?? "0")
		}))
	};
}
async function fetchPools(packageId, graphqlUrl) {
	const type = `${packageId}::candidate_stake::CandidateStake`;
	if (graphqlUrl) {
		const result = [];
		let after = null;
		let hasNext = true;
		while (hasNext) {
			const json = await (await fetch(graphqlUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: POOL_QUERY,
					variables: {
						type,
						after
					}
				})
			})).json();
			if (json.errors?.length) throw new Error(json.errors[0].message);
			const objects = json.data?.objects;
			if (!objects) break;
			for (const node of objects.nodes) {
				const fields = node.asMoveObject?.contents?.json;
				if (!fields) continue;
				result.push({
					objectId: node.address,
					fields: parseFields(fields)
				});
			}
			hasNext = objects.pageInfo.hasNextPage;
			after = objects.pageInfo.endCursor;
		}
		return result;
	}
	const client = getClient();
	const events = await client.queryEvents({
		query: { MoveEventModule: {
			package: packageId,
			module: "candidate_stake"
		} },
		limit: 50
	});
	const objectIds = /* @__PURE__ */ new Set();
	for (const ev of events.data) {
		const parsed = ev.parsedJson;
		if (parsed?.["pool_id"]) objectIds.add(parsed["pool_id"]);
	}
	if (objectIds.size === 0) return [];
	const objects = await client.multiGetObjects({
		ids: [...objectIds],
		options: { showContent: true }
	});
	const result = [];
	for (const obj of objects) {
		const content = obj.data?.content;
		if (!content || content.dataType !== "moveObject") continue;
		result.push({
			objectId: obj.data.objectId,
			fields: content.fields
		});
	}
	return result;
}
async function fetchActiveValidators() {
	const state = await getClient().getLatestIotaSystemState();
	const map = /* @__PURE__ */ new Map();
	for (const v of state.activeValidators) map.set(v.iotaAddress, v);
	return map;
}
async function fetchCandidate(client, tableId, name) {
	const wrapperContent = (await client.getDynamicFieldObject({
		parentObjectId: tableId,
		name,
		options: { showContent: true }
	})).data?.content;
	if (!wrapperContent || wrapperContent.dataType !== "moveObject") return null;
	const value = wrapperContent.fields["value"];
	const inner = (value?.["fields"])?.["inner"] ?? value?.["inner"];
	const innerId = ((inner?.["fields"] ?? inner)?.["id"])?.["id"];
	if (typeof innerId !== "string") return null;
	const versionedFields = await client.getDynamicFields({ parentId: innerId });
	if (!versionedFields.data.length) return null;
	const versionEntry = versionedFields.data[0];
	const validatorContent = (await client.getDynamicFieldObject({
		parentObjectId: innerId,
		name: versionEntry.name,
		options: { showContent: true }
	})).data?.content;
	if (!validatorContent || validatorContent.dataType !== "moveObject") return null;
	const v1 = validatorContent.fields["value"]?.["fields"];
	if (!v1) return null;
	const meta = v1["metadata"]?.["fields"] ?? v1["metadata"];
	if (!meta) return null;
	return {
		iotaAddress: String(meta["iota_address"] ?? String(name.value)),
		name: String(meta["name"] ?? "Unknown"),
		description: String(meta["description"] ?? ""),
		imageUrl: String(meta["image_url"] ?? ""),
		projectUrl: String(meta["project_url"] ?? ""),
		stakingPoolIotaBalance: String((v1["staking_pool"]?.["fields"])?.["iota_balance"] ?? "0"),
		commissionRate: String(v1["commission_rate"] ?? "0")
	};
}
async function fetchCandidateValidators() {
	const client = getClient();
	const state = await client.getLatestIotaSystemState();
	const tableId = state.validatorCandidatesId;
	if (Number(state.validatorCandidatesSize) === 0) return [];
	const candidates = [];
	let cursor = null;
	let hasNext = true;
	while (hasNext) {
		const page = await client.getDynamicFields({
			parentId: tableId,
			cursor: cursor ?? void 0
		});
		for (const field of page.data) try {
			const candidate = await fetchCandidate(client, tableId, field.name);
			if (candidate) candidates.push(candidate);
		} catch {
			continue;
		}
		cursor = page.nextCursor;
		hasNext = page.hasNextPage;
	}
	return candidates;
}
async function fetchStakedObjects(address) {
	const stakes = await getClient().getStakes({ owner: address });
	const result = [];
	for (const group of stakes) for (const stake of group.stakes) result.push({
		objectId: stake.stakedIotaId,
		principal: stake.principal,
		validatorAddress: group.validatorAddress
	});
	return result;
}
//#endregion
//#region src/lib/pages/candidate-stake/CandidateStake.svelte
var root = from_html(`<a target="_blank" rel="noreferrer" class="pkg-link svelte-fmaoys"> </a>`);
var root_1 = from_html(`<input type="text" placeholder="Package ID (0x...)" style="min-width: 300px;"/>`);
var root_2 = from_html(`<div class="lightbox svelte-fmaoys"><img alt="CandidateStake flow diagram" class="svelte-fmaoys"/></div>`);
var root_3 = from_html(`<p class="muted svelte-fmaoys">Loading pools...</p>`);
var root_4 = from_html(`<p class="error-text svelte-fmaoys"> </p>`);
var root_5 = from_html(`<p class="muted svelte-fmaoys" style="text-align: center; padding: 1rem;">No pools found for this package.</p>`);
var root_6 = from_html(`<div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Description:</span> <span class="detail-value svelte-fmaoys"> </span></div>`);
var root_7 = from_html(`<div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Website:</span> <span class="detail-value svelte-fmaoys"><a target="_blank" rel="noreferrer" class="svelte-fmaoys"> </a></span></div>`);
var root_8 = from_html(`<div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Commission:</span> <span class="detail-value svelte-fmaoys"> </span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Pool balance:</span> <span class="detail-value svelte-fmaoys"> </span></div> <!>`, 1);
var root_9 = from_html(`<span class="you-badge svelte-fmaoys">you</span>`);
var root_10 = from_html(`<div class="my-deposits svelte-fmaoys">Your deposits: <strong> </strong> </div>`);
var root_11 = from_html(`<option class="svelte-fmaoys"> </option>`);
var root_12 = from_html(`<select class="svelte-fmaoys"><option class="svelte-fmaoys">Select StakedIota to deposit...</option><!></select> <button title="Add your StakedIota to this pool" class="svelte-fmaoys">Deposit</button>`, 1);
var root_13 = from_html(`<span class="action-hint svelte-fmaoys">No StakedIota in wallet — stake IOTA to a validator
                                                first</span>`);
var root_14 = from_html(`<button class="secondary svelte-fmaoys" title="Returns all your deposited StakedIota back to your wallet"> </button>`);
var root_15 = from_html(`<!> <div class="card-actions svelte-fmaoys"><div class="action-row svelte-fmaoys" style="justify-content: space-between;"><div class="action-row svelte-fmaoys"><!></div> <!></div> <div class="admin-actions svelte-fmaoys"><div class="action-row svelte-fmaoys"><button class="secondary svelte-fmaoys">Destroy Empty</button> <span class="admin-label svelte-fmaoys">Creator only:</span> <button class="svelte-fmaoys"> </button> <button class="danger svelte-fmaoys">Cancel Pool</button></div></div></div>`, 1);
var root_16 = from_html(`<div class="pool-tx-result svelte-fmaoys"><!></div>`);
var root_17 = from_html(`<div class="pool-card svelte-fmaoys"><div class="progress-bar svelte-fmaoys"><div></div></div> <div class="pool-details svelte-fmaoys"><span class="details-heading svelte-fmaoys">Target Validator Info</span> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Name:</span> <span class="detail-value svelte-fmaoys"> </span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Address:</span> <span class="detail-value svelte-fmaoys"><a target="_blank" rel="noreferrer" class="svelte-fmaoys"> </a></span></div> <!> <!></div> <div class="pool-details svelte-fmaoys"><div class="details-heading-row svelte-fmaoys"><span class="details-heading svelte-fmaoys">Pool Info</span> <span> </span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Pool ID:</span> <span class="detail-value svelte-fmaoys"><a target="_blank" rel="noreferrer" class="svelte-fmaoys"> </a></span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Total staked:</span> <span class="detail-value svelte-fmaoys"> </span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Deposits:</span> <span class="detail-value svelte-fmaoys"> </span></div> <div class="detail-row svelte-fmaoys"><span class="detail-label svelte-fmaoys">Creator:</span> <span class="detail-value svelte-fmaoys"><a target="_blank" rel="noreferrer" class="svelte-fmaoys"> </a> <!></span></div></div> <!> <!> <!></div>`);
var root_18 = from_html(`<div class="section svelte-fmaoys"><h3 class="section-title svelte-fmaoys"> </h3> <!></div>`);
var root_19 = from_html(`<p class="muted svelte-fmaoys">Select a signer above to create a pool.</p>`);
var root_20 = from_html(`<p class="muted svelte-fmaoys">Loading candidates...</p>`);
var root_21 = from_html(`<div class="form-row svelte-fmaoys"><select class="svelte-fmaoys"><option class="svelte-fmaoys">Select candidate validator...</option><!></select> <button> </button></div>`);
var root_22 = from_html(`<p class="muted svelte-fmaoys">All candidate validators already have a pool.</p>`);
var root_23 = from_html(`<p class="muted svelte-fmaoys">No candidate validators found on this network.</p>`);
var root_24 = from_html(`<!> <div class="section svelte-fmaoys"><h3 class="section-title svelte-fmaoys">Create Pool</h3> <!> <!> <!></div> <details class="faq-section svelte-fmaoys"><summary class="svelte-fmaoys">FAQ</summary> <dl class="svelte-fmaoys"><dt class="svelte-fmaoys">What do I need to deposit?</dt> <dd class="svelte-fmaoys">You need existing <code class="svelte-fmaoys">StakedIota</code> objects in your wallet. These are obtained
                    by staking IOTA to any validator. You deposit these objects into a pool — they stay
                    staked to their original validator until the pool executes.</dd> <dt class="svelte-fmaoys">Can I withdraw my deposit?</dt> <dd class="svelte-fmaoys">Yes, at any time before the pool is executed. Your <code class="svelte-fmaoys">StakedIota</code> objects are returned directly to your wallet. Withdrawal is all-or-nothing.</dd> <dt class="svelte-fmaoys">What happens when the threshold is reached?</dt> <dd class="svelte-fmaoys">Once total deposits reach 2,000,000 IOTA, the pool creator can trigger the
                    restaking. All deposits are unstaked and restaked to the target candidate
                    validator. Each depositor receives their new <code class="svelte-fmaoys">StakedIota</code> back (including
                    any accrued rewards).</dd> <dt class="svelte-fmaoys">How much staking reward do I miss?</dt> <dd class="svelte-fmaoys">Your deposits remain staked until execution, so you keep earning rewards up to
                    that point. After restaking, the candidate becomes an active validator only in
                    the second following epoch and can only start earning rewards from then on, so
                    you miss at least two epochs of rewards during the transition, but nothing
                    before.</dd> <dt class="svelte-fmaoys">What happens if the pool is full (1,000 deposits)?</dt> <dd class="svelte-fmaoys">You can still deposit — but only if your deposit is strictly larger than the
                    current smallest deposit. The smallest deposit gets evicted.</dd> <dt class="svelte-fmaoys">Who can cancel a pool?</dt> <dd class="svelte-fmaoys">Only the pool creator. Cancelling returns all deposits and destroys the pool.</dd> <dt class="svelte-fmaoys">What does "Destroy Empty" do?</dt> <dd class="svelte-fmaoys">It cleans up a pool object that has no deposits left. It does not move any funds
                    — it simply deletes the empty on-chain object.</dd></dl></details>`, 1);
var root_25 = from_html(`<p class="muted svelte-fmaoys" style="text-align: center; padding: 2rem;">Enter a package ID above to get started.</p>`);
var root_26 = from_html(`<div class="container svelte-fmaoys"><div class="toolbar"><div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; width: 100%; justify-content: space-between;"><!> <button>Refresh Data</button></div></div> <details class="info-section svelte-fmaoys"><summary class="svelte-fmaoys">About CandidateStake</summary> <p class="intro-text svelte-fmaoys">Pool your staked IOTA to help a candidate validator reach the 2,000,000 IOTA minimum
            required to join the active validator set. Deposit your existing <code class="svelte-fmaoys">StakedIota</code> objects into a pool — they remain staked to their original validator and continue earning
            rewards until the pool is executed. You stay in full control and can withdraw at any time.
            Once the threshold is reached, the pool creator can trigger the restaking. <a target="_blank" rel="noreferrer" class="svelte-fmaoys">View smart contract on GitHub</a></p>  <picture class="flow-picture svelte-fmaoys"><source media="(max-width: 768px)" srcset="./candidate-stake-flow-mobile.svg"/> <img class="flow-diagram svelte-fmaoys" src="./candidate-stake-flow.svg" alt="CandidateStake flow diagram"/></picture> <!></details> <!></div>`);
function CandidateStake($$anchor, $$props) {
	push($$props, true);
	const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
	const $sharedClientConfig = () => store_get(sharedClientConfig, "$sharedClientConfig", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const THRESHOLD = 2e6;
	const NANOS_PER_IOTA = 1e9;
	const GITHUB_REPO = "https://github.com/Thoralf-M/candidate-stake";
	let packageId = state("");
	let customPackageId = state("");
	let pools = state(proxy([]));
	let activeValidators = state(proxy(/* @__PURE__ */ new Map()));
	let candidateValidators = state(proxy([]));
	let stakedObjects = state(proxy([]));
	let loading = state(false);
	let loadingCandidates = state(false);
	let error = state("");
	let lightbox = state(false);
	let selectedStakes = proxy({});
	let poolErrors = proxy({});
	let poolTxResults = proxy({});
	let poolPending = proxy({});
	let newPoolValidator = state("");
	let createError = state("");
	let createTxResult = state(null);
	let createPending = state(false);
	function formatIota(nanos) {
		return ((typeof nanos === "string" ? Number(nanos) : nanos) / NANOS_PER_IOTA).toLocaleString(void 0, { maximumFractionDigits: 2 });
	}
	function updatePackageId() {
		const detected = getCandidateStakePackageId();
		set(packageId, detected || get(customPackageId), true);
	}
	let initialLoadDone = false;
	async function loadPools() {
		if (!get(packageId)) {
			set(pools, [], true);
			return;
		}
		if (!initialLoadDone) set(loading, true);
		set(error, "");
		try {
			const graphqlUrl = getGraphqlUrl();
			set(pools, await fetchPools(get(packageId), graphqlUrl), true);
		} catch (err) {
			set(error, err.message || String(err), true);
			set(pools, [], true);
		} finally {
			set(loading, false);
		}
	}
	async function loadValidators() {
		try {
			set(activeValidators, await fetchActiveValidators(), true);
		} catch (err) {
			console.error("Failed to load validators:", err);
		}
	}
	async function loadCandidates() {
		if (!initialLoadDone) set(loadingCandidates, true);
		try {
			set(candidateValidators, await fetchCandidateValidators(), true);
		} catch (err) {
			console.error("Failed to load candidate validators:", err);
		} finally {
			set(loadingCandidates, false);
		}
	}
	async function loadStakedObjects() {
		if (!$activeAddress() || $activeAddress() === "0x") {
			set(stakedObjects, [], true);
			return;
		}
		try {
			set(stakedObjects, await fetchStakedObjects($activeAddress()), true);
		} catch (err) {
			console.error("Failed to load staked objects:", err);
		}
	}
	async function refreshAll() {
		await Promise.all([
			loadPools(),
			loadValidators(),
			loadCandidates(),
			loadStakedObjects()
		]);
		initialLoadDone = true;
	}
	function getAllValidators() {
		const all = new Map(get(activeValidators));
		for (const c of get(candidateValidators)) if (!all.has(c.iotaAddress)) all.set(c.iotaAddress, {
			...c,
			nextEpochCommissionRate: c.commissionRate
		});
		return all;
	}
	let allValidators = user_derived(getAllValidators);
	let existingTargets = user_derived(() => new Set(get(pools).map((p) => p.fields.target_validator)));
	let availableCandidates = user_derived(() => get(candidateValidators).filter((c) => !get(existingTargets).has(c.iotaAddress)));
	async function waitForTxAndRefresh(result) {
		const digest = result?.digest;
		if (digest) await getClient().waitForTransaction({
			digest,
			waitMode: "checkpoint"
		});
		await refreshAll();
	}
	async function execPoolAction(poolId, buildTx) {
		poolErrors[poolId] = "";
		poolTxResults[poolId] = null;
		poolPending[poolId] = true;
		try {
			const tx = new Transaction();
			buildTx(tx);
			const result = await executeTransaction(tx);
			poolTxResults[poolId] = result;
			await waitForTxAndRefresh(result);
		} catch (err) {
			poolErrors[poolId] = err.message || String(err);
		} finally {
			poolPending[poolId] = false;
		}
	}
	function deposit(poolId) {
		const stakeId = selectedStakes[poolId];
		if (!stakeId) return;
		selectedStakes[poolId] = "";
		execPoolAction(poolId, (tx) => {
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::deposit`,
				arguments: [tx.object(poolId), tx.object(stakeId)]
			});
		});
	}
	function withdraw(poolId) {
		execPoolAction(poolId, (tx) => {
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::withdraw`,
				arguments: [tx.object(poolId)]
			});
		});
	}
	function executeRestake(poolId) {
		execPoolAction(poolId, (tx) => {
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::execute`,
				arguments: [tx.object(poolId), tx.object("0x5")]
			});
		});
	}
	function cancelPool(poolId) {
		execPoolAction(poolId, (tx) => {
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::cancel`,
				arguments: [tx.object(poolId)]
			});
		});
	}
	function destroyEmpty(poolId) {
		execPoolAction(poolId, (tx) => {
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::destroy_empty`,
				arguments: [tx.object(poolId)]
			});
		});
	}
	async function createPool() {
		if (!get(newPoolValidator)) return;
		set(createError, "");
		set(createTxResult, null);
		set(createPending, true);
		try {
			const tx = new Transaction();
			tx.moveCall({
				target: `${get(packageId)}::candidate_stake::create`,
				arguments: [tx.pure.address(get(newPoolValidator))]
			});
			const result = await executeTransaction(tx);
			set(createTxResult, result, true);
			set(newPoolValidator, "");
			await waitForTxAndRefresh(result);
		} catch (err) {
			set(createError, err.message || String(err), true);
		} finally {
			set(createPending, false);
		}
	}
	onMount(() => {
		updatePackageId();
		refreshAll();
	});
	user_effect(() => {
		$sharedClientConfig().selected;
		updatePackageId();
		refreshAll();
	});
	user_effect(() => {
		$activeAddress();
		loadStakedObjects();
	});
	var div = root_26();
	var div_1 = child(div);
	var div_2 = child(div_1);
	var node = child(div_2);
	var consequent = ($$anchor) => {
		var a = root();
		var text = child(a);
		reset(a);
		template_effect(($0, $1) => {
			set_attribute(a, "href", $0);
			set_attribute(a, "title", get(packageId));
			set_text(text, `Package: ${$1 ?? ""}`);
		}, [() => getObjectLink(getSelectedNetworkConfig(), get(packageId)), () => formatAddress(get(packageId))]);
		append($$anchor, a);
	};
	var d_1 = user_derived(() => getCandidateStakePackageId());
	var alternate = ($$anchor) => {
		var input = root_1();
		remove_input_defaults(input);
		delegated("input", input, () => {
			updatePackageId();
			loadPools();
		});
		bind_value(input, () => get(customPackageId), ($$value) => set(customPackageId, $$value));
		append($$anchor, input);
	};
	if_block(node, ($$render) => {
		if (get(d_1)) $$render(consequent);
		else $$render(alternate, -1);
	});
	var button = sibling(node, 2);
	reset(div_2);
	reset(div_1);
	var details = sibling(div_1, 2);
	var p_1 = sibling(child(details), 2);
	set_attribute(sibling(child(p_1), 3), "href", GITHUB_REPO);
	reset(p_1);
	var picture = sibling(p_1, 2);
	var node_1 = sibling(picture, 2);
	var consequent_1 = ($$anchor) => {
		var div_3 = root_2();
		set_attribute(child(div_3), "src", window.innerWidth <= 768 ? "./candidate-stake-flow-mobile.svg" : "./candidate-stake-flow.svg");
		reset(div_3);
		delegated("click", div_3, () => set(lightbox, false));
		append($$anchor, div_3);
	};
	if_block(node_1, ($$render) => {
		if (get(lightbox)) $$render(consequent_1);
	});
	reset(details);
	var node_2 = sibling(details, 2);
	var consequent_21 = ($$anchor) => {
		var fragment = root_24();
		var node_3 = first_child(fragment);
		var consequent_2 = ($$anchor) => {
			append($$anchor, root_3());
		};
		var consequent_3 = ($$anchor) => {
			var p_3 = root_4();
			var text_1 = child(p_3, true);
			reset(p_3);
			template_effect(() => set_text(text_1, get(error)));
			append($$anchor, p_3);
		};
		var consequent_4 = ($$anchor) => {
			append($$anchor, root_5());
		};
		var alternate_2 = ($$anchor) => {
			var div_4 = root_18();
			var h3 = child(div_4);
			var text_2 = child(h3);
			reset(h3);
			each(sibling(h3, 2), 17, () => get(pools), (pool) => pool.objectId, ($$anchor, pool) => {
				const fields = user_derived(() => get(pool).fields);
				const totalPrincipal = user_derived(() => Number(get(fields).total_principal));
				const thresholdNanos = user_derived(() => THRESHOLD * NANOS_PER_IOTA);
				const progress = user_derived(() => Math.min(100, get(totalPrincipal) / get(thresholdNanos) * 100));
				const isReady = user_derived(() => get(totalPrincipal) >= get(thresholdNanos));
				const isCreator = user_derived(() => $activeAddress() === get(fields).creator);
				const myDeposits = user_derived(() => get(fields).deposits.filter((d) => d.depositor === $activeAddress()));
				const myTotal = user_derived(() => get(myDeposits).reduce((sum, d) => sum + Number(d.principal_amount), 0));
				const validator = user_derived(() => get(allValidators).get(get(fields).target_validator));
				const isPending = user_derived(() => poolPending[get(pool).objectId] ?? false);
				var div_5 = root_17();
				var div_6 = child(div_5);
				var div_7 = child(div_6);
				let classes;
				reset(div_6);
				var div_8 = sibling(div_6, 2);
				var div_9 = sibling(child(div_8), 2);
				var span = sibling(child(div_9), 2);
				var text_3 = child(span, true);
				reset(span);
				reset(div_9);
				var div_10 = sibling(div_9, 2);
				var span_1 = sibling(child(div_10), 2);
				var a_2 = child(span_1);
				var text_4 = child(a_2, true);
				reset(a_2);
				reset(span_1);
				reset(div_10);
				var node_5 = sibling(div_10, 2);
				var consequent_5 = ($$anchor) => {
					var div_11 = root_6();
					var span_2 = sibling(child(div_11), 2);
					var text_5 = child(span_2, true);
					reset(span_2);
					reset(div_11);
					template_effect(() => set_text(text_5, get(validator).description));
					append($$anchor, div_11);
				};
				if_block(node_5, ($$render) => {
					if (get(validator)?.description) $$render(consequent_5);
				});
				var node_6 = sibling(node_5, 2);
				var consequent_7 = ($$anchor) => {
					var fragment_1 = root_8();
					var div_12 = first_child(fragment_1);
					var span_3 = sibling(child(div_12), 2);
					var text_6 = child(span_3);
					reset(span_3);
					reset(div_12);
					var div_13 = sibling(div_12, 2);
					var span_4 = sibling(child(div_13), 2);
					var text_7 = child(span_4);
					reset(span_4);
					reset(div_13);
					var node_7 = sibling(div_13, 2);
					var consequent_6 = ($$anchor) => {
						var div_14 = root_7();
						var span_5 = sibling(child(div_14), 2);
						var a_3 = child(span_5);
						var text_8 = child(a_3, true);
						reset(a_3);
						reset(span_5);
						reset(div_14);
						template_effect(() => {
							set_attribute(a_3, "href", get(validator).projectUrl);
							set_text(text_8, get(validator).projectUrl);
						});
						append($$anchor, div_14);
					};
					if_block(node_7, ($$render) => {
						if (get(validator).projectUrl) $$render(consequent_6);
					});
					template_effect(($0, $1) => {
						set_text(text_6, `${$0 ?? ""}%`);
						set_text(text_7, `${$1 ?? ""} IOTA`);
					}, [() => Number(get(validator).commissionRate) / 100, () => formatIota(get(validator).stakingPoolIotaBalance)]);
					append($$anchor, fragment_1);
				};
				if_block(node_6, ($$render) => {
					if (get(validator)) $$render(consequent_7);
				});
				reset(div_8);
				var div_15 = sibling(div_8, 2);
				var div_16 = child(div_15);
				var span_6 = sibling(child(div_16), 2);
				let classes_1;
				var text_9 = child(span_6, true);
				reset(span_6);
				reset(div_16);
				var div_17 = sibling(div_16, 2);
				var span_7 = sibling(child(div_17), 2);
				var a_4 = child(span_7);
				var text_10 = child(a_4, true);
				reset(a_4);
				reset(span_7);
				reset(div_17);
				var div_18 = sibling(div_17, 2);
				var span_8 = sibling(child(div_18), 2);
				var text_11 = child(span_8);
				reset(span_8);
				reset(div_18);
				var div_19 = sibling(div_18, 2);
				var span_9 = sibling(child(div_19), 2);
				var text_12 = child(span_9, true);
				reset(span_9);
				reset(div_19);
				var div_20 = sibling(div_19, 2);
				var span_10 = sibling(child(div_20), 2);
				var a_5 = child(span_10);
				var text_13 = child(a_5, true);
				reset(a_5);
				var node_8 = sibling(a_5, 2);
				var consequent_8 = ($$anchor) => {
					append($$anchor, root_9());
				};
				if_block(node_8, ($$render) => {
					if (get(isCreator)) $$render(consequent_8);
				});
				reset(span_10);
				reset(div_20);
				reset(div_15);
				var node_9 = sibling(div_15, 2);
				var consequent_12 = ($$anchor) => {
					var fragment_2 = root_15();
					var node_10 = first_child(fragment_2);
					var consequent_9 = ($$anchor) => {
						var div_21 = root_10();
						var strong = sibling(child(div_21));
						var text_14 = child(strong);
						reset(strong);
						var text_15 = sibling(strong);
						reset(div_21);
						template_effect(($0) => {
							set_text(text_14, `${$0 ?? ""} IOTA`);
							set_text(text_15, ` (${get(myDeposits).length ?? ""} deposit${get(myDeposits).length > 1 ? "s" : ""})`);
						}, [() => formatIota(get(myTotal))]);
						append($$anchor, div_21);
					};
					if_block(node_10, ($$render) => {
						if (get(myDeposits).length > 0) $$render(consequent_9);
					});
					var div_22 = sibling(node_10, 2);
					var div_23 = child(div_22);
					var div_24 = child(div_23);
					var node_11 = child(div_24);
					var consequent_10 = ($$anchor) => {
						var fragment_3 = root_12();
						var select = first_child(fragment_3);
						var option = child(select);
						option.value = option.__value = "";
						each(sibling(option), 17, () => get(stakedObjects), index, ($$anchor, s) => {
							var option_1 = root_11();
							var text_16 = child(option_1);
							reset(option_1);
							var option_1_value = {};
							template_effect(($0, $1) => {
								set_text(text_16, `${$0 ?? ""} — ${$1 ?? ""} IOTA`);
								if (option_1_value !== (option_1_value = get(s).objectId)) option_1.value = (option_1.__value = get(s).objectId) ?? "";
							}, [() => formatAddress(get(s).objectId), () => formatIota(get(s).principal)]);
							append($$anchor, option_1);
						});
						reset(select);
						var button_1 = sibling(select, 2);
						template_effect(() => button_1.disabled = !selectedStakes[get(pool).objectId] || get(isPending));
						bind_select_value(select, () => selectedStakes[get(pool).objectId], ($$value) => selectedStakes[get(pool).objectId] = $$value);
						delegated("click", button_1, () => deposit(get(pool).objectId));
						append($$anchor, fragment_3);
					};
					var alternate_1 = ($$anchor) => {
						append($$anchor, root_13());
					};
					if_block(node_11, ($$render) => {
						if (get(stakedObjects).length > 0) $$render(consequent_10);
						else $$render(alternate_1, -1);
					});
					reset(div_24);
					var node_13 = sibling(div_24, 2);
					var consequent_11 = ($$anchor) => {
						var button_2 = root_14();
						var text_17 = child(button_2);
						reset(button_2);
						template_effect(($0) => {
							button_2.disabled = get(isPending);
							set_text(text_17, `Withdraw All (${$0 ?? ""} IOTA)`);
						}, [() => formatIota(get(myTotal))]);
						delegated("click", button_2, () => withdraw(get(pool).objectId));
						append($$anchor, button_2);
					};
					if_block(node_13, ($$render) => {
						if (get(myDeposits).length > 0) $$render(consequent_11);
					});
					reset(div_23);
					var div_25 = sibling(div_23, 2);
					var div_26 = child(div_25);
					var button_3 = child(div_26);
					var button_4 = sibling(button_3, 4);
					var text_18 = child(button_4, true);
					reset(button_4);
					var button_5 = sibling(button_4, 2);
					reset(div_26);
					reset(div_25);
					reset(div_22);
					template_effect(($0, $1) => {
						button_3.disabled = get(fields).deposits.length > 0 || get(isPending);
						set_attribute(button_3, "title", get(fields).deposits.length > 0 ? "Pool still has deposits — withdraw or cancel first" : "Clean up this empty pool object");
						button_4.disabled = !get(isCreator) || !get(isReady) || get(isPending);
						set_attribute(button_4, "title", $0);
						set_text(text_18, $1);
						button_5.disabled = !get(isCreator) || get(isPending);
						set_attribute(button_5, "title", get(isCreator) ? "Return all deposits to their owners and destroy this pool" : "Only the pool creator can cancel");
					}, [() => !get(isCreator) ? "Only the pool creator can execute" : get(isReady) ? "Unstake all deposits and restake to the target validator" : `${formatIota(get(thresholdNanos) - get(totalPrincipal))} IOTA still needed`, () => get(isReady) ? "Restake to Target Validator" : `Restake (${formatIota(get(thresholdNanos) - get(totalPrincipal))} IOTA remaining)`]);
					delegated("click", button_3, () => destroyEmpty(get(pool).objectId));
					delegated("click", button_4, () => executeRestake(get(pool).objectId));
					delegated("click", button_5, () => cancelPool(get(pool).objectId));
					append($$anchor, fragment_2);
				};
				if_block(node_9, ($$render) => {
					if ($activeAddress() && $activeAddress() !== "0x") $$render(consequent_12);
				});
				var node_14 = sibling(node_9, 2);
				var consequent_13 = ($$anchor) => {
					var div_27 = root_16();
					TransactionView(child(div_27), { get value() {
						return poolTxResults[get(pool).objectId];
					} });
					reset(div_27);
					append($$anchor, div_27);
				};
				if_block(node_14, ($$render) => {
					if (poolTxResults[get(pool).objectId]) $$render(consequent_13);
				});
				var node_16 = sibling(node_14, 2);
				var consequent_14 = ($$anchor) => {
					var p_5 = root_4();
					var text_19 = child(p_5, true);
					reset(p_5);
					template_effect(() => set_text(text_19, poolErrors[get(pool).objectId]));
					append($$anchor, p_5);
				};
				if_block(node_16, ($$render) => {
					if (poolErrors[get(pool).objectId]) $$render(consequent_14);
				});
				reset(div_5);
				template_effect(($0, $1, $2, $3, $4, $5, $6) => {
					classes = set_class(div_7, 1, "fill svelte-fmaoys", null, classes, { complete: get(isReady) });
					set_style(div_7, `width: ${get(progress) ?? ""}%`);
					set_text(text_3, get(validator)?.name ?? "Unknown");
					set_attribute(a_2, "href", $0);
					set_attribute(a_2, "title", get(fields).target_validator);
					set_text(text_4, get(fields).target_validator);
					classes_1 = set_class(span_6, 1, "badge svelte-fmaoys", null, classes_1, {
						ready: get(isReady),
						pending: !get(isReady)
					});
					set_text(text_9, $1);
					set_attribute(a_4, "href", $2);
					set_attribute(a_4, "title", get(pool).objectId);
					set_text(text_10, get(pool).objectId);
					set_text(text_11, `${$3 ?? ""} / ${$4 ?? ""}
                                    IOTA (${$5 ?? ""}%)`);
					set_text(text_12, get(fields).deposits.length);
					set_attribute(a_5, "href", $6);
					set_attribute(a_5, "title", get(fields).creator);
					set_text(text_13, get(fields).creator);
				}, [
					() => getAddressLink(getSelectedNetworkConfig(), get(fields).target_validator),
					() => get(isReady) ? "Ready" : `${get(progress).toFixed(1)}%`,
					() => getObjectLink(getSelectedNetworkConfig(), get(pool).objectId),
					() => formatIota(get(fields).total_principal),
					() => THRESHOLD.toLocaleString(),
					() => get(progress).toFixed(2),
					() => getAddressLink(getSelectedNetworkConfig(), get(fields).creator)
				]);
				append($$anchor, div_5);
			});
			reset(div_4);
			template_effect(() => set_text(text_2, `Pools (${get(pools).length ?? ""})`));
			append($$anchor, div_4);
		};
		if_block(node_3, ($$render) => {
			if (get(loading)) $$render(consequent_2);
			else if (get(error)) $$render(consequent_3, 1);
			else if (get(pools).length === 0) $$render(consequent_4, 2);
			else $$render(alternate_2, -1);
		});
		var div_28 = sibling(node_3, 2);
		var node_17 = sibling(child(div_28), 2);
		var consequent_15 = ($$anchor) => {
			append($$anchor, root_19());
		};
		var consequent_16 = ($$anchor) => {
			append($$anchor, root_20());
		};
		var consequent_17 = ($$anchor) => {
			var div_29 = root_21();
			var select_1 = child(div_29);
			var option_2 = child(select_1);
			option_2.value = option_2.__value = "";
			each(sibling(option_2), 17, () => get(availableCandidates), index, ($$anchor, v) => {
				var option_3 = root_11();
				var text_20 = child(option_3);
				reset(option_3);
				var option_3_value = {};
				template_effect(($0) => {
					set_text(text_20, `${get(v).name ?? ""} (${$0 ?? ""})`);
					if (option_3_value !== (option_3_value = get(v).iotaAddress)) option_3.value = (option_3.__value = get(v).iotaAddress) ?? "";
				}, [() => formatAddress(get(v).iotaAddress)]);
				append($$anchor, option_3);
			});
			reset(select_1);
			var button_6 = sibling(select_1, 2);
			var text_21 = child(button_6, true);
			reset(button_6);
			reset(div_29);
			template_effect(() => {
				button_6.disabled = !get(newPoolValidator) || get(createPending);
				set_text(text_21, get(createPending) ? "Creating..." : "Create");
			});
			bind_select_value(select_1, () => get(newPoolValidator), ($$value) => set(newPoolValidator, $$value));
			delegated("click", button_6, createPool);
			append($$anchor, div_29);
		};
		var consequent_18 = ($$anchor) => {
			append($$anchor, root_22());
		};
		var alternate_3 = ($$anchor) => {
			append($$anchor, root_23());
		};
		if_block(node_17, ($$render) => {
			if (!$activeAddress() || $activeAddress() === "0x") $$render(consequent_15);
			else if (get(loadingCandidates)) $$render(consequent_16, 1);
			else if (get(availableCandidates).length > 0) $$render(consequent_17, 2);
			else if (get(candidateValidators).length > 0) $$render(consequent_18, 3);
			else $$render(alternate_3, -1);
		});
		var node_19 = sibling(node_17, 2);
		var consequent_19 = ($$anchor) => {
			TransactionView($$anchor, { get value() {
				return get(createTxResult);
			} });
		};
		if_block(node_19, ($$render) => {
			if (get(createTxResult)) $$render(consequent_19);
		});
		var node_20 = sibling(node_19, 2);
		var consequent_20 = ($$anchor) => {
			var p_10 = root_4();
			var text_22 = child(p_10, true);
			reset(p_10);
			template_effect(() => set_text(text_22, get(createError)));
			append($$anchor, p_10);
		};
		if_block(node_20, ($$render) => {
			if (get(createError)) $$render(consequent_20);
		});
		reset(div_28);
		next(2);
		append($$anchor, fragment);
	};
	var alternate_4 = ($$anchor) => {
		append($$anchor, root_25());
	};
	if_block(node_2, ($$render) => {
		if (get(packageId)) $$render(consequent_21);
		else $$render(alternate_4, -1);
	});
	reset(div);
	delegated("click", button, refreshAll);
	delegated("click", picture, () => set(lightbox, true));
	append($$anchor, div);
	pop();
	$$cleanup();
}
delegate(["input", "click"]);
//#endregion
export { CandidateStake as default };

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/IotaSystemState-BYb61VcE.js","assets/disclose-version-CpEJO7r1.js","assets/legacy-DxVWxrJw.js","assets/client-BTFoHz6u.js","assets/keypair-DsT3ivIR.js","assets/JsonToggleView-I_OHyvOi.js","assets/transaction-view-OeA30yKg.js","assets/transaction-view-QnfdbPMt.css","assets/JsonToggleView-fMnnpuwH.css","assets/IotaSystemState-BfNZQdbT.css","assets/Transaction-ClZy4dNj.js","assets/client-CmDrt-ez.js","assets/page-query-params-C6Zq69Gt.js","assets/Transaction-C3qqeLeC.css","assets/Object-BkE_nZwH.js","assets/explorer-links-hyzWVZGi.js","assets/dynamic-fields-huZLT6c7.js","assets/_u64-Dkyx1UQH.js","assets/blake2-O-wgjgc8.js","assets/2025.2-wBXoWMFy.js","assets/rolldown-runtime-D3Q5gio6.js","assets/iota-names-config-OaNo1Bz2.js","assets/Object-Cm2HqrT3.css","assets/PTBs-DaU_ZiMJ.js","assets/auto-DlIbMOkz.js","assets/chartjs-plugin-zoom.esm-DAYqusPu.js","assets/programmable-transaction-block-DR8mHtC0.js","assets/PTBs-BR8oWVMI.css","assets/DynamicFields-B7T7iFM5.js","assets/StakingRewards-Nu6kVNlM.js","assets/signer-data-D1Egmbld.js","assets/exchange-rate-cache-BGYGoWx4.js","assets/StakingRewards-DLusDUtW.css","assets/Delegators-DnBGQy51.js","assets/Delegators-Bx4FWy7Y.css","assets/MultiAccountView-D8I9je_k.js","assets/staking-utils-Bq8uBoCa.js","assets/MultiAccountView-CfPnW0HL.css","assets/AccountsList-BTh0dcos.js","assets/AccountsList-D_5TDH-k.css","assets/Keystone-DsnI1Xct.js","assets/Keystone-MAtRA5__.css","assets/LedgerNano-BpkOMmlP.js","assets/browser-YKkc2bFt.js","assets/LedgerNano-DxMn_A-p.css","assets/Sign-cLla8y2n.js","assets/Sign-gBDkjJRU.css","assets/PublishData-Gg-rxGXC.js","assets/transaction-execution-Cg5fkaOd.js","assets/mainnet-transaction-confirmation-bplSEzLB.js","assets/PublishData-BUyY-awq.css","assets/SplitMergeCoins-B5T0WqHi.js","assets/IotaAmountInput-DQbOcWgp.js","assets/IotaAmountInput-Bij3EnSl.css","assets/SplitMergeCoins-CvE6aQEn.css","assets/ProgrammableTransactionBlock-Cjze8PYD.js","assets/ProgrammableTransactionBlock-Crg99Ooq.css","assets/BulkTransfer-CsdvMlME.js","assets/BulkTransfer-TuDD_85L.css","assets/Stake-8C_Ch4bz.js","assets/Stake-C1pWE9FU.css","assets/Faucet-d2a1BJWZ.js","assets/faucet-DG92jVSx.js","assets/Faucet-wqo-zmbr.css","assets/Converter-D28MhnLp.js","assets/base-o_Fnpopv.js","assets/Converter-C6_fp2gw.css","assets/TextAnalyzer-wSQSHW76.js","assets/TextAnalyzer-DLUiTKjF.css","assets/Ed25519AddressGeneration-BUTRs3Yp.js","assets/Ed25519AddressGeneration-CG0-AGej.css","assets/IotaNames-Cddw8uib.js","assets/IotaNames-DeEf_Tms.css","assets/CandidateStake-tLulkV0P.js","assets/CandidateStake-4osXjqf7.css","assets/Settings-IPrydqCi.js","assets/Settings-C3eTkciY.css","assets/Txs-8GwNxghr.js","assets/fetchTransactions-D9XVVz7p.js","assets/Txs-8Q5elMyh.css","assets/TxsVisualizer-CGWoO2QS.js","assets/TxsVisualizer-DRjH37ny.css","assets/Impressum-8l1HLATd.js","assets/Datenschutz-Bd4742cF.js","assets/Disclaimer-gEOR4ZRh.js","assets/Disclaimer-MTqRAUq1.css","assets/OnChainApps-izxJMXne.js","assets/OnChainApps-BhEeh98N.css"])))=>i.map(i=>d[i]);
import { t as __commonJSMin } from "./rolldown-runtime-D3Q5gio6.js";
import { $ as untrack, A as component, B as comment, C as bind_select_value, Ct as get$1, D as set_class, Dt as pop, E as set_style, G as event, H as text, I as if_block, J as deep_read_state, L as mount, Mt as reset, N as each, Nt as noop, O as clsx, Ot as push, P as index, Pt as to_array, R as set_text, S as set_value, St as derived, T as select_option, Tt as writable, U as delegate, V as from_html, W as delegated, Y as get, at as user_effect, ct as sibling, dt as mutate, ft as set, gt as user_derived, h as bind_value, ht as derived_safe_equal, i as prop, it as template_effect, jt as next, lt as proxy, n as onDestroy, nt as legacy_pre_effect_reset, ot as child, p as bind_checked, pt as state, r as onMount, s as init, st as first_child, tt as legacy_pre_effect, u as bind_this, ut as mutable_source, v as remove_input_defaults, vt as setup_stores, w as init_select, xt as store_set, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { A as Secp256k1PublicKey, M as toStore, S as sharedSignerType, d as SignerType, g as sharedClientConfig, k as Secp256r1PublicKey, m as isProMode, p as disclaimerAccepted, r as getSelectedNetworkConfig, s as TransactionDataBuilder, t as getClient } from "./client-BTFoHz6u.js";
import { B as isValidIotaAddress, D as bytesToHex, F as SIGNATURE_FLAG_TO_SCHEME, I as SIGNATURE_SCHEME_TO_FLAG, L as iotaBcs, Q as toBase64, U as normalizeIotaAddress, Y as fromHex, Z as fromBase64, d as PasskeyPublicKey, f as PublicKey, h as blake2b, i as Signer$1, l as parseSerializedSignature, n as Ed25519PublicKey, p as bytesEqual, q as bcs } from "./keypair-DsT3ivIR.js";
import { n as confirmMainnetTransaction, r as pendingMainnetTransactionConfirmation, t as cancelMainnetTransaction } from "./mainnet-transaction-confirmation-bplSEzLB.js";
import { a as splitObjectChanges, i as removeKindFields, n as getTransactionData, o as Root, r as isTransactionData, t as formatJsonWithCompactArrays } from "./transaction-view-OeA30yKg.js";
import { n as getObjectLink, r as getTransactionLink, t as getAddressLink } from "./explorer-links-hyzWVZGi.js";
import { t as IotaGraphQLClient } from "./client-CmDrt-ez.js";
import { n as TransactionExecution, r as sharedTransactionExecution, t as executeTransaction } from "./transaction-execution-Cg5fkaOd.js";
import { a as iota_accounts, c as selectExternalAddress, d as disconnectWallet, i as getSelectedExternalAddress, l as updateSelectedSignerAccounts, n as addOrUpdateExternalAddress, o as iota_wallets, p as setSelectedWallet, r as getExternalAddresses, s as removeExternalAddress, t as activeAddress, u as connectWallet } from "./signer-data-D1Egmbld.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/.pnpm/svelte-spa-router@5.1.1_svelte@5.56.6/node_modules/svelte-spa-router/dist/Router.svelte
var RouterStateImpl = class {
	#_loc = state(getLocation());
	get _loc() {
		return get(this.#_loc);
	}
	set _loc(value) {
		set(this.#_loc, value);
	}
	#_location = user_derived(() => this._loc.location);
	get _location() {
		return get(this.#_location);
	}
	set _location(value) {
		set(this.#_location, value);
	}
	#_querystring = user_derived(() => this._loc.querystring);
	get _querystring() {
		return get(this.#_querystring);
	}
	set _querystring(value) {
		set(this.#_querystring, value);
	}
	#_params = state(void 0);
	get _params() {
		return get(this.#_params);
	}
	set _params(value) {
		set(this.#_params, value);
	}
	get loc() {
		return this._loc;
	}
	/** The current location (excluding querystring) */
	get location() {
		return this._location;
	}
	/** The current querystring */
	get querystring() {
		return this._querystring;
	}
	get params() {
		return this._params;
	}
	constructor() {
		if (typeof window !== "undefined") window.addEventListener("hashchange", () => {
			this._loc = getLocation();
		});
		else console.warn("[svelte-spa-router] window 'window' is not defined, skipping initiation");
	}
};
/** Router state object, containing the current location, querystring and params. */
var router = new RouterStateImpl();
/** Returns the current location from the hash. */
function getLocation() {
	const currentHref = typeof window !== "undefined" ? window.location.href : "";
	const hashPosition = currentHref.indexOf("#/");
	let location = hashPosition > -1 ? currentHref.substr(hashPosition + 1) : "/";
	const qsPosition = location.indexOf("?");
	let querystring = "";
	if (qsPosition > -1) {
		querystring = location.substr(qsPosition + 1);
		location = location.substr(0, qsPosition);
	}
	return {
		location,
		querystring
	};
}
//#endregion
//#region node_modules/.pnpm/svelte-spa-router@5.1.1_svelte@5.56.6/node_modules/svelte-spa-router/dist/wrap.js
/**
* Wraps a component to enable multiple capabilities:
*
* 1. Using dynamically-imported components (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
* 2. Adding route pre-conditions (e.g. `{conditions: [...]}`).
* 3. Adding static props that are passed to the component.
* 4. Adding custom userData, which is passed to callback props (e.g. `onRouteLoaded`) or to route pre-conditions.
*/
function wrap(args) {
	if (!args) throw Error("Parameter args is required");
	if (!args.component == !args.asyncComponent) throw Error("One and only one of component and asyncComponent is required");
	if (args.component) {
		const sync = args.component;
		args.asyncComponent = () => Promise.resolve(sync);
	}
	if (typeof args.asyncComponent != "function") throw Error("Parameter asyncComponent must be a function");
	let conditions;
	if (args.conditions) {
		const arr = Array.isArray(args.conditions) ? args.conditions : [args.conditions];
		for (let i = 0; i < arr.length; i++) if (!arr[i] || typeof arr[i] != "function") throw Error("Invalid parameter conditions[" + i + "]");
		conditions = arr;
	}
	const asyncComponent = args.asyncComponent;
	if (args.loadingComponent) {
		asyncComponent.loading = args.loadingComponent;
		asyncComponent.loadingParams = args.loadingParams || void 0;
	}
	const wrapped = {
		component: asyncComponent,
		userData: args.userData,
		conditions: conditions?.length ? conditions : void 0,
		props: args.props && Object.keys(args.props).length ? args.props : {}
	};
	Object.defineProperty(wrapped, "_sveltesparouter", {
		value: true,
		writable: false,
		enumerable: false,
		configurable: false
	});
	return wrapped;
}
//#endregion
//#region src/lib/components/DisclaimerModal.svelte
var root$14 = from_html(`<p>This website is an <strong>experimental tool</strong> for interacting with the
                        IOTA blockchain. By using this website, you acknowledge and agree to the following:</p> <ul class="svelte-fgcc0w"><li class="svelte-fgcc0w"><strong>No warranty:</strong> This software is provided "as is" without any
                            warranty. Use it at your own risk.</li> <li class="svelte-fgcc0w"><strong>No financial advice:</strong> Nothing on this website constitutes
                            financial, investment, legal, or tax advice.</li> <li class="svelte-fgcc0w"><strong>Blockchain data:</strong> Data is retrieved from public blockchain
                            nodes and displayed as-is. We make no guarantees about its accuracy or completeness.</li> <li class="svelte-fgcc0w"><strong>Irreversible transactions:</strong> Blockchain transactions cannot
                            be reversed. You are solely responsible for verifying all transaction details
                            before signing.</li> <li class="svelte-fgcc0w"><strong>Key security:</strong> If you use local key storage, your private
                            keys are stored only in your browser. You are responsible for securing your
                            device.</li> <li class="svelte-fgcc0w"><strong>No liability:</strong> The operators shall not be liable for any damages
                            arising from the use of this website, including loss of funds.</li></ul>`, 1);
var root_1$11 = from_html(`<p>Diese Website ist ein <strong>experimentelles Werkzeug</strong> zur Interaktion
                        mit der IOTA-Blockchain. Durch die Nutzung dieser Website erkennen Sie Folgendes
                        an und stimmen zu:</p> <ul class="svelte-fgcc0w"><li class="svelte-fgcc0w"><strong>Keine Gewährleistung:</strong> Diese Software wird "wie besehen" ohne
                            jegliche Garantie bereitgestellt. Die Nutzung erfolgt auf eigenes Risiko.</li> <li class="svelte-fgcc0w"><strong>Keine Finanzberatung:</strong> Nichts auf dieser Website stellt eine
                            Finanz-, Anlage-, Rechts- oder Steuerberatung dar.</li> <li class="svelte-fgcc0w"><strong>Blockchain-Daten:</strong> Daten werden von öffentlichen Blockchain-Knoten
                            abgerufen und unverändert angezeigt. Wir übernehmen keine Garantie für deren
                            Richtigkeit oder Vollständigkeit.</li> <li class="svelte-fgcc0w"><strong>Unumkehrbare Transaktionen:</strong> Blockchain-Transaktionen können
                            nicht rückgängig gemacht werden. Sie sind allein für die Überprüfung aller
                            Transaktionsdetails vor dem Signieren verantwortlich.</li> <li class="svelte-fgcc0w"><strong>Schlüsselsicherheit:</strong> Bei Nutzung der lokalen Schlüsselspeicherung
                            werden Ihre privaten Schlüssel nur in Ihrem Browser gespeichert. Sie sind
                            für die Sicherung Ihres Geräts verantwortlich.</li> <li class="svelte-fgcc0w"><strong>Keine Haftung:</strong> Die Betreiber haften nicht für Schäden, die
                            aus der Nutzung dieser Website entstehen, einschließlich Verlust von Guthaben.</li></ul>`, 1);
var root_2$11 = from_html(`<div class="modal-overlay svelte-fgcc0w"><div class="modal-content svelte-fgcc0w" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title"><div class="modal-header svelte-fgcc0w"><h3 id="disclaimer-title" class="svelte-fgcc0w"> </h3> <div class="lang-toggle svelte-fgcc0w"><button>English</button> <button>Deutsch</button></div></div> <div class="modal-body svelte-fgcc0w"><!></div> <div class="actions svelte-fgcc0w"><button class="agree-btn svelte-fgcc0w"> </button></div></div></div>`);
function DisclaimerModal($$anchor, $$props) {
	push($$props, true);
	const $disclaimerAccepted = () => store_get(disclaimerAccepted, "$disclaimerAccepted", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let lang = state("en");
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_1 = ($$anchor) => {
		var div = root_2$11();
		var div_1 = child(div);
		var div_2 = child(div_1);
		var h3 = child(div_2);
		var text = child(h3, true);
		reset(h3);
		var div_3 = sibling(h3, 2);
		var button = child(div_3);
		let classes;
		var button_1 = sibling(button, 2);
		let classes_1;
		reset(div_3);
		reset(div_2);
		var div_4 = sibling(div_2, 2);
		var node_1 = child(div_4);
		var consequent = ($$anchor) => {
			var fragment_1 = root$14();
			next(2);
			append($$anchor, fragment_1);
		};
		var alternate = ($$anchor) => {
			var fragment_2 = root_1$11();
			next(2);
			append($$anchor, fragment_2);
		};
		if_block(node_1, ($$render) => {
			if (get(lang) === "en") $$render(consequent);
			else $$render(alternate, -1);
		});
		reset(div_4);
		var div_5 = sibling(div_4, 2);
		var button_2 = child(div_5);
		var text_1 = child(button_2, true);
		reset(button_2);
		reset(div_5);
		reset(div_1);
		reset(div);
		template_effect(() => {
			set_text(text, get(lang) === "en" ? "Disclaimer" : "Haftungsausschluss");
			classes = set_class(button, 1, "svelte-fgcc0w", null, classes, { active: get(lang) === "en" });
			classes_1 = set_class(button_1, 1, "svelte-fgcc0w", null, classes_1, { active: get(lang) === "de" });
			set_text(text_1, get(lang) === "en" ? "I Understand and Agree" : "Ich verstehe und stimme zu");
		});
		delegated("click", button, () => set(lang, "en"));
		delegated("click", button_1, () => set(lang, "de"));
		delegated("click", button_2, () => disclaimerAccepted.set(true));
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if (!$disclaimerAccepted()) $$render(consequent_1);
	});
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate(["click"]);
//#endregion
//#region src/lib/utils/shared-caches.ts
var sharedPackageCache = {};
var sharedLoadingPackages = {};
var sharedPackageErrors = {};
//#endregion
//#region src/lib/components/TransactionCommands.svelte
var root$13 = from_html(`<div class="ptb-controls svelte-19ydf4y"><div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y">Expand All</button> <button class="svelte-19ydf4y">Collapse All</button></div> <div class="controls-divider svelte-19ydf4y"></div> <div class="controls-group svelte-19ydf4y"><button class="svelte-19ydf4y"><!></button> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Show Types</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label> <label class="toggle-row svelte-19ydf4y"><span class="toggle-label svelte-19ydf4y">Short IDs</span> <div class="toggle-switch svelte-19ydf4y"><input type="checkbox" class="svelte-19ydf4y"/> <span class="slider svelte-19ydf4y"></span></div></label></div></div>`);
var root_1$10 = from_html(`<div class="error-item svelte-19ydf4y"> </div>`);
var root_2$10 = from_html(`<div class="error-banner svelte-19ydf4y"><strong>Package fetch errors:</strong> <!></div>`);
var root_3$10 = from_html(`<a target="_blank" rel="noopener noreferrer"> </a>`);
var root_4$9 = from_html(`<span> </span>`);
var root_5$7 = from_html(`<span></span>`);
var root_6$7 = from_html(`<div><a class="command-index svelte-19ydf4y"></a> <button class="expand-btn svelte-19ydf4y"> </button> <div class="command-content svelte-19ydf4y"><span class="command-call"></span> <!></div></div>`);
var root_7$5 = from_html(`<div class="ptb-view svelte-19ydf4y"><!> <!> <!></div>`);
var root_8$3 = from_html(`<div class="no-data svelte-19ydf4y">No PTB commands found</div>`);
function TransactionCommands($$anchor, $$props) {
	push($$props, true);
	let showControls = prop($$props, "showControls", 3, true), externalExpandedCommands = prop($$props, "expandedCommands", 3, void 0);
	function getPTB(data) {
		if (data?.transaction?.data?.transaction?.kind === "ProgrammableTransaction") return data.transaction.data.transaction;
		if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction) return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction;
		if (data?.input?.transaction) return data.input.transaction;
		if (data?.kind === "ProgrammableTransaction") return data;
		return null;
	}
	function getInputs(data, ptbData) {
		if (ptbData?.inputs) return ptbData.inputs;
		if (data?.transaction?.data?.transaction?.inputs) return data.transaction.data.transaction.inputs;
		if (data?.rawTransaction) try {
			const raw = typeof data.rawTransaction === "string" ? JSON.parse(data.rawTransaction) : data.rawTransaction;
			if (raw?.inputs) return raw.inputs;
		} catch {}
		if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs) return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs;
		if (data?.input?.transaction?.inputs) return data.input.transaction.inputs;
		return [];
	}
	let ptb = user_derived(() => getPTB($$props.transactionData));
	let inputs = user_derived(() => getInputs($$props.transactionData, get(ptb)));
	let commands = user_derived(() => get(ptb)?.commands || get(ptb)?.transactions || []);
	let expandedCommands = state(proxy({}));
	let hoveredId = state(null);
	let shortPackageIds = user_derived(() => $$props.shortPackageIds ?? true);
	let showTypeInfo = user_derived(() => $$props.showTypeInfo ?? true);
	let hasAutoFetched = state(false);
	user_effect(() => {
		set(expandedCommands, externalExpandedCommands() ? { ...externalExpandedCommands() } : {}, true);
	});
	function toggle(i) {
		get(expandedCommands)[i] = !get(expandedCommands)[i];
	}
	function expandAll() {
		get(commands).forEach((_, i) => get(expandedCommands)[i] = true);
	}
	function collapseAll() {
		set(expandedCommands, {}, true);
	}
	user_effect(() => {
		if ($$props.commandIndex !== null && $$props.commandIndex >= 0) {
			const element = document.getElementById(`command-${$$props.commandIndex}`);
			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
				if (!get(expandedCommands)[$$props.commandIndex]) get(expandedCommands)[$$props.commandIndex] = true;
			}
		}
	});
	function trimAddress(address) {
		return `0x${address.toLowerCase().replace(/^0x/, "").replace(/^0+/, "") || "0"}`;
	}
	function decodePureValue(base64Bytes, type) {
		if (!type) return null;
		try {
			const bytes = fromBase64(base64Bytes);
			const uint8Array = new Uint8Array(bytes);
			let baseType = type.replace(/^&(mut )?/, "");
			if (baseType === "bool") return bcs.bool().parse(uint8Array).toString();
			else if (baseType === "u8") return bcs.u8().parse(uint8Array).toString();
			else if (baseType === "u16") return bcs.u16().parse(uint8Array).toString();
			else if (baseType === "u32") return bcs.u32().parse(uint8Array).toString();
			else if (baseType === "u64") return bcs.u64().parse(uint8Array).toString();
			else if (baseType === "u128") return bcs.u128().parse(uint8Array).toString();
			else if (baseType === "u256") return bcs.u256().parse(uint8Array).toString();
			else if (baseType === "address") return `0x${Array.from(uint8Array).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
			else if (baseType.startsWith("vector<u8>") || baseType === "string") try {
				const str = new TextDecoder().decode(uint8Array);
				if (/^[\x20-\x7E\n\r\t]*$/.test(str)) return `"${str}"`;
			} catch {}
			return null;
		} catch (e) {
			console.error("Failed to decode pure value:", e, "type:", type);
			return null;
		}
	}
	function isHighlighted(segId, hId) {
		if (!segId || !hId) return false;
		if (segId === hId) return true;
		const parse = (id) => {
			const firstColon = id.indexOf(":");
			if (firstColon === -1) return null;
			const type = id.substring(0, firstColon);
			const path = id.substring(firstColon + 1);
			const pathParts = path.split("::");
			if (pathParts.length !== 3) return {
				type,
				pkg: path,
				mod: "",
				fun: ""
			};
			return {
				type,
				pkg: pathParts[0],
				mod: pathParts[1],
				fun: pathParts[2]
			};
		};
		const h = parse(hId);
		const s = parse(segId);
		if (!h || !s) return false;
		if (h.type === "obj") return s.type === "obj" && s.pkg === h.pkg;
		if (h.type === "pkg") return s.type === "pkg" && s.pkg === h.pkg;
		if (h.type === "mod") {
			if (s.pkg !== h.pkg || s.mod !== h.mod) return false;
			return s.type === "pkg" || s.type === "mod";
		}
		if (h.type === "fun") {
			if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
			return s.type === "pkg" || s.type === "mod" || s.type === "fun";
		}
		if (h.type === "struct") {
			if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
			return s.type === "pkg" || s.type === "mod" || s.type === "struct";
		}
		return false;
	}
	async function fetchPackageInfo(packageId) {
		if (sharedPackageCache[packageId] || sharedLoadingPackages[packageId]) {
			console.log("Skipping package (cached or loading):", packageId);
			return;
		}
		console.log("Fetching package info for:", packageId);
		sharedLoadingPackages[packageId] = true;
		sharedPackageErrors[packageId] = "";
		try {
			const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
			const query = `
                query PackageQuery($address: IotaAddress!, $functionsCursor: String) {
                    package(address: $address) {
                        address
                        modules {
                            nodes {
                                name
                                functions(first: 20, after: $functionsCursor) {
                                    pageInfo {
                                        hasNextPage
                                        endCursor
                                    }
                                    nodes {
                                        name
                                        visibility
                                        isEntry
                                        typeParameters {
                                            constraints
                                        }
                                        parameters {
                                            repr
                                        }
                                        return {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;
			let allModules = [];
			let hasMorePages = true;
			let cursor = null;
			while (hasMorePages) {
				const result = await gqlClient.query({
					query,
					variables: {
						address: packageId,
						functionsCursor: cursor
					}
				});
				if (!result.data?.package) {
					sharedPackageErrors[packageId] = "Package not found";
					console.error("Package not found:", packageId);
					break;
				}
				const modules = result.data.package.modules?.nodes || [];
				hasMorePages = false;
				for (const module of modules) if (module.functions?.pageInfo?.hasNextPage) {
					hasMorePages = true;
					cursor = module.functions.pageInfo.endCursor;
					break;
				}
				if (allModules.length === 0) allModules = modules.map((m) => ({
					name: m.name,
					functions: { nodes: m.functions?.nodes || [] }
				}));
				else modules.forEach((newModule, idx) => {
					if (allModules[idx]) allModules[idx].functions.nodes.push(...newModule.functions?.nodes || []);
				});
				if (!hasMorePages) {
					sharedPackageCache[packageId] = {
						address: result.data.package.address,
						modules: { nodes: allModules }
					};
					console.log("Package data fetched:", packageId, sharedPackageCache[packageId]);
				}
			}
		} catch (error) {
			console.error("Error fetching package:", packageId, error);
			sharedPackageErrors[packageId] = error.message || "Failed to fetch package info";
		} finally {
			sharedLoadingPackages[packageId] = false;
		}
	}
	function getFunctionInfo(packageId, moduleName, functionName) {
		if (!get(showTypeInfo)) return null;
		const pkg = sharedPackageCache[packageId];
		if (!pkg) return null;
		const module = pkg.modules?.nodes?.find((m) => m.name === moduleName);
		if (!module) return null;
		return module.functions?.nodes?.find((f) => f.name === functionName);
	}
	function getUsage(cmdIndex, allCommands) {
		let maxNestedIndex = -1;
		let usedAsResult = false;
		const checkArg = (arg) => {
			if (!arg) return;
			if (arg.Result === cmdIndex) usedAsResult = true;
			if (arg.NestedResult && arg.NestedResult[0] === cmdIndex) maxNestedIndex = Math.max(maxNestedIndex, arg.NestedResult[1]);
		};
		const traverse = (obj) => {
			if (!obj) return;
			if (Array.isArray(obj)) {
				obj.forEach(traverse);
				return;
			}
			if (typeof obj === "object") {
				if ("Result" in obj || "NestedResult" in obj || "Input" in obj || "GasCoin" in obj) checkArg(obj);
				if (obj.$kind === "Result" || obj.$kind === "NestedResult") {
					if (obj.Result === cmdIndex) usedAsResult = true;
					if (obj.NestedResult && obj.NestedResult[0] === cmdIndex) maxNestedIndex = Math.max(maxNestedIndex, obj.NestedResult[1]);
					return;
				}
				Object.values(obj).forEach(traverse);
			}
		};
		for (let i = cmdIndex + 1; i < allCommands.length; i++) traverse(allCommands[i]);
		if (maxNestedIndex !== -1) {
			const segments = [{
				type: "text",
				value: "-> ("
			}];
			for (let k = 0; k <= maxNestedIndex; k++) {
				if (k > 0) segments.push({
					type: "text",
					value: ", "
				});
				segments.push({
					type: "result-def",
					value: `Result(${cmdIndex}, ${k})`,
					id: `result:${cmdIndex}:${k}`
				});
			}
			segments.push({
				type: "text",
				value: ")"
			});
			return segments;
		}
		if (usedAsResult) return [{
			type: "text",
			value: "-> "
		}, {
			type: "result-def",
			value: `Result(${cmdIndex})`,
			id: `result:${cmdIndex}`
		}];
		return [];
	}
	function resolveArgument(arg, full = false, paramType = null) {
		if (arg === null || arg === void 0) return [{
			type: "text",
			value: "undefined"
		}];
		if (typeof arg === "string") {
			if (arg === "GasCoin") return [{
				type: "text",
				value: "GasCoin"
			}];
			return [{
				type: "text",
				value: arg
			}];
		}
		let kind = arg.$kind;
		let value = arg;
		if (!kind) {
			if ("Input" in arg) {
				kind = "Input";
				value = arg.Input;
			} else if ("Result" in arg) {
				kind = "Result";
				value = arg.Result;
			} else if ("NestedResult" in arg) {
				kind = "NestedResult";
				value = arg.NestedResult;
			} else if ("GasCoin" in arg) {
				kind = "GasCoin";
				value = true;
			}
		} else value = arg[kind];
		const segments = [];
		if (paramType) {
			segments.push(...formatType(paramType, full, true, []));
			segments.push({
				type: "text",
				value: ": "
			});
		}
		if (kind === "Input") {
			const inputIndex = value;
			const input = get(inputs)[inputIndex];
			if (!input) {
				segments.push({
					type: "text",
					value: `Input(${inputIndex})`
				});
				return segments;
			}
			if (input.type === "object" && input.objectId) {
				const id = input.objectId;
				const trimmedId = trimAddress(id);
				const shortId = full ? trimmedId : get(shortPackageIds) && trimmedId.length > 9 ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}` : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;
				let prefix = "Object";
				let objectType = "Object";
				if (input.objectType === "immOrOwnedObject") {
					prefix = "ImmOrOwnedObject";
					objectType = "ImmOrOwnedObject";
				} else if (input.objectType === "sharedObject") {
					prefix = "SharedObject";
					objectType = "SharedObject";
				} else if (input.objectType === "receiving") {
					prefix = "Receiving";
					objectType = "Receiving";
				}
				segments.push({
					type: "text",
					value: `${prefix}(`
				});
				segments.push({
					type: "object-id",
					value: shortId,
					id: `obj:${id}`,
					objectType
				});
				segments.push({
					type: "text",
					value: ")"
				});
				return segments;
			}
			if (input.type === "pure" && input.value) {
				if (input.valueType) if (input.valueType === "vector<u8>") try {
					const uint8Array = new Uint8Array(input.value);
					const str = new TextDecoder().decode(uint8Array);
					if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
						const displayStr = full ? `"${str}"` : `"${str.slice(0, 10)}${str.length > 10 ? "..." : ""}"`;
						segments.push({
							type: "text",
							value: `Pure(${displayStr})`
						});
					} else {
						const byteStr = JSON.stringify(input.value);
						const val = full ? byteStr : `[${input.value.slice(0, 5).join(", ")}${input.value.length > 5 ? ", ..." : ""}]`;
						segments.push({
							type: "text",
							value: `Pure(${val})`
						});
					}
				} catch (e) {
					const valueStr = JSON.stringify(input.value);
					const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
					segments.push({
						type: "text",
						value: `Pure(${val})`
					});
				}
				else {
					const valueStr = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
					const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
					segments.push({
						type: "text",
						value: `Pure(${val})`
					});
				}
				else {
					const decodedValue = paramType ? decodePureValue(input.value, paramType) : null;
					if (decodedValue) segments.push({
						type: "text",
						value: `Pure(${decodedValue})`
					});
					else {
						const valueStr = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
						const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
						segments.push({
							type: "text",
							value: `Pure(${val})`
						});
					}
				}
				return segments;
			}
			let inputKind = input.$kind;
			let inputValue = input;
			if (!inputKind) {
				if ("Object" in input) {
					inputKind = "Object";
					inputValue = input.Object;
				} else if ("Pure" in input) {
					inputKind = "Pure";
					inputValue = input.Pure;
				}
			} else inputValue = input[inputKind];
			if (inputKind === "Object") {
				let obj = inputValue;
				if (obj.ImmOrOwnedObject) obj = obj.ImmOrOwnedObject;
				else if (obj.SharedObject) obj = obj.SharedObject;
				else if (obj.Receiving) obj = obj.Receiving;
				if (obj && obj.objectId) {
					const id = obj.objectId;
					const trimmedId = trimAddress(id);
					const shortId = full ? trimmedId : get(shortPackageIds) && trimmedId.length > 9 ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}` : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;
					let prefix = "Object";
					let objectType = "Object";
					if (inputValue.ImmOrOwnedObject || input.Object && input.Object.ImmOrOwnedObject) {
						prefix = "ImmOrOwnedObject";
						objectType = "ImmOrOwnedObject";
					} else if (inputValue.SharedObject || input.Object && input.Object.SharedObject) {
						prefix = "SharedObject";
						objectType = "SharedObject";
					} else if (inputValue.Receiving || input.Object && input.Object.Receiving) {
						prefix = "Receiving";
						objectType = "Receiving";
					}
					segments.push({
						type: "text",
						value: `${prefix}(`
					});
					segments.push({
						type: "object-id",
						value: shortId,
						id: `obj:${id}`,
						objectType
					});
					segments.push({
						type: "text",
						value: ")"
					});
					return segments;
				}
				segments.push({
					type: "text",
					value: `Object(Input ${inputIndex})`
				});
				return segments;
			}
			if (inputKind === "Pure") {
				if (inputValue.bytes) {
					const decodedValue = paramType ? decodePureValue(inputValue.bytes, paramType) : null;
					if (decodedValue) segments.push({
						type: "text",
						value: `Pure(${decodedValue})`
					});
					else {
						const val = full ? inputValue.bytes : `${inputValue.bytes.slice(0, 10)}...`;
						segments.push({
							type: "text",
							value: `Pure(${val})`
						});
					}
					return segments;
				}
				segments.push({
					type: "text",
					value: `Pure(Input ${inputIndex})`
				});
				return segments;
			}
			segments.push({
				type: "text",
				value: `Input(${inputIndex})`
			});
			return segments;
		}
		if (kind === "Result") {
			segments.push({
				type: "result",
				value: `Result(${value})`,
				id: `result:${value}`
			});
			return segments;
		}
		if (kind === "NestedResult") {
			segments.push({
				type: "result",
				value: `Result(${value[0]}, ${value[1]})`,
				id: `result:${value[0]}:${value[1]}`
			});
			return segments;
		}
		if (kind === "GasCoin") {
			segments.push({
				type: "text",
				value: "GasCoin"
			});
			return segments;
		}
		segments.push({
			type: "text",
			value: JSON.stringify(arg)
		});
		return segments;
	}
	function substituteTypeArgs(typeStr, typeArgs) {
		if (!typeStr) return "unknown";
		return typeStr.replace(/\$(\d+)/g, (match, index) => {
			return typeArgs[parseInt(index)] || match;
		});
	}
	function formatType(type, full, interactive = true, typeArgs = []) {
		const segments = [];
		if (!type) {
			segments.push({
				type: "text",
				value: "unknown"
			});
			return segments;
		}
		let refPrefix = "";
		let remainingType = type;
		if (type.startsWith("&mut ")) {
			refPrefix = "&mut ";
			remainingType = type.slice(5);
		} else if (type.startsWith("&")) {
			refPrefix = "&";
			remainingType = type.slice(1);
		}
		if (refPrefix) segments.push({
			type: "text",
			value: refPrefix
		});
		const genericMatch = remainingType.match(/^([^<]+)<(.+)>$/);
		if (genericMatch) {
			const [_, baseType, innerTypes] = genericMatch;
			segments.push(...formatType(baseType, full, interactive, typeArgs));
			segments.push({
				type: "text",
				value: "<"
			});
			let depth = 0;
			let current = "";
			const typeParams = [];
			for (let i = 0; i < innerTypes.length; i++) {
				const char = innerTypes[i];
				if (char === "<") depth++;
				else if (char === ">") depth--;
				else if (char === "," && depth === 0) {
					typeParams.push(current.trim());
					current = "";
					continue;
				}
				current += char;
			}
			if (current) typeParams.push(current.trim());
			typeParams.forEach((param, idx) => {
				if (idx > 0) segments.push({
					type: "text",
					value: ", "
				});
				segments.push(...formatType(param, full, interactive, typeArgs));
			});
			segments.push({
				type: "text",
				value: ">"
			});
			return segments;
		}
		const parts = remainingType.split("::");
		if (parts.length === 3) {
			const [pkg, mod, struct] = parts;
			let displayPkg = trimAddress(pkg);
			if (get(shortPackageIds) && displayPkg.length > 9) displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
			segments.push({
				type: "package",
				value: displayPkg,
				id: interactive ? `pkg:${pkg}::${mod}::${struct}` : void 0
			});
			segments.push({
				type: "text",
				value: "::"
			});
			segments.push({
				type: "module",
				value: mod,
				id: interactive ? `mod:${pkg}::${mod}::${struct}` : void 0
			});
			segments.push({
				type: "text",
				value: "::"
			});
			segments.push({
				type: "struct",
				value: struct,
				id: interactive ? `struct:${pkg}::${mod}::${struct}` : void 0
			});
		} else segments.push({
			type: "text",
			value: remainingType
		});
		return segments;
	}
	function formatCommand(command, index, full = false) {
		const kind = command.$kind || Object.keys(command)[0];
		const data = command[kind] || command;
		let segments = [];
		if (kind === "MoveCall") {
			const pkg = data.package;
			const mod = data.module;
			const fun = data.function;
			const typeArgs = data.type_arguments || [];
			const args = data.arguments || [];
			let displayPkg = trimAddress(pkg);
			if (get(shortPackageIds) && displayPkg.length > 9) displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
			segments.push({
				type: "package",
				value: displayPkg,
				id: `pkg:${pkg}::${mod}::${fun}`
			});
			segments.push({
				type: "text",
				value: "::"
			});
			segments.push({
				type: "module",
				value: mod,
				id: `mod:${pkg}::${mod}::${fun}`
			});
			segments.push({
				type: "text",
				value: "::"
			});
			segments.push({
				type: "function",
				value: fun,
				id: `fun:${pkg}::${mod}::${fun}`
			});
			if (typeArgs.length > 0) {
				segments.push({
					type: "text",
					value: "<"
				});
				typeArgs.forEach((typeArg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...formatType(typeArg, full, true, typeArgs));
				});
				segments.push({
					type: "text",
					value: ">"
				});
			}
			segments.push({
				type: "text",
				value: "("
			});
			const funcInfo = getFunctionInfo(pkg, mod, fun);
			const paramTypes = funcInfo?.parameters || [];
			if (full && args.length > 0) {
				segments.push({
					type: "text",
					value: "\n    "
				});
				args.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ",\n    "
					});
					const paramType = paramTypes[i]?.repr ? substituteTypeArgs(paramTypes[i].repr, typeArgs) : null;
					segments.push(...resolveArgument(arg, full, paramType));
				});
				segments.push({
					type: "text",
					value: "\n)"
				});
			} else {
				args.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					const paramType = paramTypes[i]?.repr ? substituteTypeArgs(paramTypes[i].repr, typeArgs) : null;
					segments.push(...resolveArgument(arg, full, paramType));
				});
				segments.push({
					type: "text",
					value: ")"
				});
			}
			if (funcInfo?.return) {
				const returnTypes = funcInfo.return;
				if (Array.isArray(returnTypes) && returnTypes.length > 0) {
					segments.push({
						type: "text",
						value: "-> "
					});
					const usage = getUsage(index, get(commands));
					if (usage.some((s) => s.value.includes("Result("))) usage.forEach((seg, idx) => {
						if (seg.type === "text" && seg.value.includes("->")) return;
						if (seg.type === "result-def") {
							let indent = "  ";
							if (idx === 1) indent = "";
							segments.push({
								type: "text",
								value: indent
							});
							segments.push(seg);
							const resultMatch = seg.value.match(/Result\((\d+)(?:, (\d+))?\)/);
							if (resultMatch) {
								const nestedIdx = resultMatch[2] ? parseInt(resultMatch[2]) : null;
								const typeInfo = nestedIdx !== null ? returnTypes[nestedIdx] : returnTypes[0];
								if (typeInfo?.repr) {
									segments.push({
										type: "text",
										value: ": "
									});
									const typeSegments = formatType(substituteTypeArgs(typeInfo.repr, typeArgs), full, true, typeArgs);
									typeSegments.forEach((s) => {
										s.id = seg.id;
									});
									segments.push(...typeSegments);
								}
							}
						} else if (seg.type === "text" && seg.value === ", ") segments.push({
							type: "text",
							value: ",\n  "
						});
						else segments.push(seg);
					});
					else {
						segments.push({
							type: "result-def",
							value: `Result(${index})`,
							id: `result:${index}`
						});
						segments.push({
							type: "text",
							value: ": "
						});
						if (returnTypes.length === 1) {
							const typeSegments = formatType(substituteTypeArgs(returnTypes[0].repr || "unknown", typeArgs), full, true, typeArgs);
							typeSegments.forEach((s) => s.id = `result:${index}`);
							segments.push(...typeSegments);
						} else {
							segments.push({
								type: "text",
								value: "("
							});
							returnTypes.forEach((ret, i) => {
								if (i > 0) segments.push({
									type: "text",
									value: ", "
								});
								const typeSegments = formatType(substituteTypeArgs(ret.repr || "unknown", typeArgs), full, true, typeArgs);
								typeSegments.forEach((s) => s.id = `result:${index}`);
								segments.push(...typeSegments);
							});
							segments.push({
								type: "text",
								value: ")"
							});
						}
					}
				}
			} else {
				const usage = getUsage(index, get(commands));
				if (usage.length > 0) {
					segments.push({
						type: "text",
						value: " "
					});
					segments.push(...usage);
				}
			}
		} else if (kind === "TransferObjects") {
			const objects = Array.isArray(data) ? data[0] : data.objects || [];
			const addressArg = Array.isArray(data) ? data[1] : data.address;
			segments.push({
				type: "text",
				value: "TransferObjects("
			});
			if (full) {
				segments.push({
					type: "text",
					value: "\n    ["
				});
				objects.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "],\n    "
				});
				segments.push(...resolveArgument(addressArg, full, "address"));
				segments.push({
					type: "text",
					value: "\n)"
				});
			} else {
				segments.push({
					type: "text",
					value: "["
				});
				objects.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "], "
				});
				segments.push(...resolveArgument(addressArg, full, "address"));
				segments.push({
					type: "text",
					value: ")"
				});
			}
		} else if (kind === "SplitCoins") {
			const coinArg = Array.isArray(data) ? data[0] : data.coin;
			const amounts = Array.isArray(data) ? data[1] : data.amounts || [];
			segments.push({
				type: "text",
				value: "SplitCoins("
			});
			if (full) {
				segments.push({
					type: "text",
					value: "\n    "
				});
				segments.push(...resolveArgument(coinArg, full));
				segments.push({
					type: "text",
					value: ",\n    ["
				});
				amounts.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full, "u64"));
				});
				segments.push({
					type: "text",
					value: "]\n)"
				});
			} else {
				segments.push(...resolveArgument(coinArg, full));
				segments.push({
					type: "text",
					value: ", ["
				});
				amounts.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full, "u64"));
				});
				segments.push({
					type: "text",
					value: "])"
				});
			}
			const usage = getUsage(index, get(commands));
			if (usage.length > 0) {
				segments.push({
					type: "text",
					value: " "
				});
				segments.push(...usage);
			}
		} else if (kind === "MergeCoins") {
			const destArg = Array.isArray(data) ? data[0] : data.destination;
			const sources = Array.isArray(data) ? data[1] : data.sources || [];
			segments.push({
				type: "text",
				value: "MergeCoins("
			});
			if (full) {
				segments.push({
					type: "text",
					value: "\n    "
				});
				segments.push(...resolveArgument(destArg, full));
				segments.push({
					type: "text",
					value: ",\n    ["
				});
				sources.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "]\n)"
				});
			} else {
				segments.push(...resolveArgument(destArg, full));
				segments.push({
					type: "text",
					value: ", ["
				});
				sources.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "])"
				});
			}
		} else if (kind === "Publish") {
			const modules = Array.isArray(data) ? data[0] : data.modules || [];
			const dependencies = Array.isArray(data) ? data[1] : data.dependencies || [];
			segments.push({
				type: "text",
				value: "Publish("
			});
			if (full) {
				segments.push({
					type: "text",
					value: "\n    ["
				});
				if (Array.isArray(modules)) modules.forEach((module, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push({
						type: "text",
						value: `"${module}"`
					});
				});
				else segments.push({
					type: "text",
					value: `"${modules}"`
				});
				segments.push({
					type: "text",
					value: "],\n    ["
				});
				if (Array.isArray(dependencies)) dependencies.forEach((dep, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push({
						type: "text",
						value: `"${dep}"`
					});
				});
				else segments.push({
					type: "text",
					value: `"${dependencies}"`
				});
				segments.push({
					type: "text",
					value: "]\n)"
				});
			} else {
				segments.push({
					type: "text",
					value: "["
				});
				if (Array.isArray(modules)) modules.forEach((module, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push({
						type: "text",
						value: `"${module.slice(0, 10)}..."`
					});
				});
				else segments.push({
					type: "text",
					value: `"${modules.slice(0, 10)}..."`
				});
				segments.push({
					type: "text",
					value: "], ["
				});
				if (Array.isArray(dependencies)) dependencies.forEach((dep, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push({
						type: "text",
						value: `"${dep.slice(0, 10)}..."`
					});
				});
				else segments.push({
					type: "text",
					value: `"${dependencies.slice(0, 10)}..."`
				});
				segments.push({
					type: "text",
					value: "])"
				});
			}
		} else if (kind === "MakeMoveVec") {
			const type = Array.isArray(data) ? data[0] : data.type || "Unknown";
			const elements = Array.isArray(data) ? data[1] : data.elements || [];
			segments.push({
				type: "text",
				value: "MakeMoveVec<"
			});
			segments.push(...formatType(type, full, true, []));
			segments.push({
				type: "text",
				value: ">("
			});
			if (full && elements.length > 0) {
				segments.push({
					type: "text",
					value: "\n    ["
				});
				elements.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "]\n)"
				});
			} else {
				segments.push({
					type: "text",
					value: "["
				});
				elements.forEach((arg, i) => {
					if (i > 0) segments.push({
						type: "text",
						value: ", "
					});
					segments.push(...resolveArgument(arg, full));
				});
				segments.push({
					type: "text",
					value: "])"
				});
			}
			segments.push({
				type: "text",
				value: " -> "
			});
			segments.push({
				type: "result-def",
				value: `Result(${index})`,
				id: `result:${index}`
			});
			segments.push({
				type: "text",
				value: ": vector<"
			});
			segments.push(...formatType(type, full, true, []));
			segments.push({
				type: "text",
				value: ">"
			});
		} else if (kind === "Upgrade") segments.push({
			type: "text",
			value: "Upgrade(...)"
		});
		else segments.push({
			type: "text",
			value: `${kind}(...)`
		});
		return segments;
	}
	function getUniquePackages() {
		const packages = /* @__PURE__ */ new Set();
		get(commands).forEach((cmd) => {
			const kind = cmd.$kind || Object.keys(cmd)[0];
			if (kind === "MoveCall") {
				const data = cmd[kind] || cmd;
				if (data.package) packages.add(data.package);
			}
		});
		return Array.from(packages);
	}
	function hasPackagesCached() {
		const packages = getUniquePackages();
		return packages.length > 0 && packages.every((pkg) => sharedPackageCache[pkg]);
	}
	async function loadAllPackages() {
		const packages = getUniquePackages();
		console.log("Loading packages:", packages);
		for (const pkg of packages) await fetchPackageInfo(pkg);
	}
	user_effect(() => {
		$$props.transactionData;
		set(hasAutoFetched, false);
	});
	user_effect(() => {
		if (get(commands).length > 0 && !get(hasAutoFetched) && !hasPackagesCached()) {
			set(hasAutoFetched, true);
			loadAllPackages();
		}
	});
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_11 = ($$anchor) => {
		var div = root_7$5();
		var node_1 = child(div);
		var consequent_2 = ($$anchor) => {
			var div_1 = root$13();
			var div_2 = child(div_1);
			var button = child(div_2);
			var button_1 = sibling(button, 2);
			reset(div_2);
			var div_3 = sibling(div_2, 4);
			var button_2 = child(div_3);
			var node_2 = child(button_2);
			var consequent = ($$anchor) => {
				append($$anchor, text("Loading..."));
			};
			var d = user_derived(() => Object.keys(sharedLoadingPackages).some((k) => sharedLoadingPackages[k]));
			var consequent_1 = ($$anchor) => {
				append($$anchor, text("Type info fetched ✓"));
			};
			var d_1 = user_derived(() => hasPackagesCached());
			var alternate = ($$anchor) => {
				append($$anchor, text("Fetch Type Info"));
			};
			if_block(node_2, ($$render) => {
				if (get(d)) $$render(consequent);
				else if (get(d_1)) $$render(consequent_1, 1);
				else $$render(alternate, -1);
			});
			reset(button_2);
			var label = sibling(button_2, 2);
			var div_4 = sibling(child(label), 2);
			var input_1 = child(div_4);
			remove_input_defaults(input_1);
			next(2);
			reset(div_4);
			reset(label);
			var label_1 = sibling(label, 2);
			var div_5 = sibling(child(label_1), 2);
			var input_2 = child(div_5);
			remove_input_defaults(input_2);
			next(2);
			reset(div_5);
			reset(label_1);
			reset(div_3);
			reset(div_1);
			template_effect(($0) => button_2.disabled = $0, [() => Object.keys(sharedLoadingPackages).some((k) => sharedLoadingPackages[k]) || hasPackagesCached()]);
			delegated("click", button, expandAll);
			delegated("click", button_1, collapseAll);
			delegated("click", button_2, loadAllPackages);
			bind_checked(input_1, () => get(showTypeInfo), ($$value) => set(showTypeInfo, $$value));
			bind_checked(input_2, () => get(shortPackageIds), ($$value) => set(shortPackageIds, $$value));
			append($$anchor, div_1);
		};
		if_block(node_1, ($$render) => {
			if (showControls()) $$render(consequent_2);
		});
		var node_3 = sibling(node_1, 2);
		var consequent_3 = ($$anchor) => {
			var div_6 = root_2$10();
			each(sibling(child(div_6), 2), 17, () => Object.entries(sharedPackageErrors).filter(([_, err]) => err), index, ($$anchor, $$item) => {
				var $$array = user_derived(() => to_array(get($$item), 2));
				let pkg = () => get($$array)[0];
				let err = () => get($$array)[1];
				var div_7 = root_1$10();
				var text_3 = child(div_7);
				reset(div_7);
				template_effect(() => set_text(text_3, `${pkg() ?? ""}: ${err() ?? ""}`));
				append($$anchor, div_7);
			});
			reset(div_6);
			append($$anchor, div_6);
		};
		var d_2 = user_derived(() => Object.keys(sharedPackageErrors).some((k) => sharedPackageErrors[k]));
		if_block(node_3, ($$render) => {
			if (get(d_2)) $$render(consequent_3);
		});
		each(sibling(node_3, 2), 17, () => get(commands), index, ($$anchor, command, i) => {
			const formattedSegments = user_derived(() => formatCommand(get(command), i, get(expandedCommands)[i]));
			const arrowIndex = user_derived(() => get(formattedSegments).findIndex((s) => s.type === "text" && s.value.includes(" -> ")));
			var div_8 = root_6$7();
			let classes;
			set_attribute(div_8, "id", `command-${i}`);
			var a = child(div_8);
			a.textContent = i;
			var button_3 = sibling(a, 2);
			var text_4 = child(button_3, true);
			reset(button_3);
			var div_9 = sibling(button_3, 2);
			var span = child(div_9);
			each(span, 21, () => get(formattedSegments).slice(0, get(arrowIndex) === -1 ? get(formattedSegments).length : get(arrowIndex) + 1), index, ($$anchor, segment) => {
				var fragment_1 = comment();
				var node_6 = first_child(fragment_1);
				var consequent_4 = ($$anchor) => {
					var text_5 = text();
					template_effect(() => set_text(text_5, get(segment).value));
					append($$anchor, text_5);
				};
				var consequent_5 = ($$anchor) => {
					const packageId = user_derived(() => get(segment).id?.split("::")[0].replace("pkg:", "") ?? "");
					var a_1 = root_3$10();
					let classes_1;
					var text_6 = child(a_1, true);
					reset(a_1);
					template_effect(($0, $1) => {
						set_attribute(a_1, "href", $0);
						classes_1 = set_class(a_1, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_1, $1);
						set_attribute(a_1, "title", get(packageId));
						set_text(text_6, get(segment).value);
					}, [() => getObjectLink(getSelectedNetworkConfig(), get(packageId)), () => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
					delegated("mouseover", a_1, () => set(hoveredId, get(segment).id ?? null, true));
					delegated("mouseout", a_1, () => set(hoveredId, null));
					event("focus", a_1, () => set(hoveredId, get(segment).id ?? null, true));
					event("blur", a_1, () => set(hoveredId, null));
					append($$anchor, a_1);
				};
				var consequent_6 = ($$anchor) => {
					const objectId = user_derived(() => get(segment).id?.replace("obj:", "") ?? "");
					var a_2 = root_3$10();
					let classes_2;
					var text_7 = child(a_2, true);
					reset(a_2);
					template_effect(($0, $1) => {
						set_attribute(a_2, "href", $0);
						classes_2 = set_class(a_2, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_2, $1);
						set_attribute(a_2, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
						set_text(text_7, get(segment).value);
					}, [() => getObjectLink(getSelectedNetworkConfig(), get(objectId)), () => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
					delegated("mouseover", a_2, () => set(hoveredId, get(segment).id ?? null, true));
					delegated("mouseout", a_2, () => set(hoveredId, null));
					event("focus", a_2, () => set(hoveredId, get(segment).id ?? null, true));
					event("blur", a_2, () => set(hoveredId, null));
					append($$anchor, a_2);
				};
				var alternate_1 = ($$anchor) => {
					var span_1 = root_4$9();
					let classes_3;
					var text_8 = child(span_1, true);
					reset(span_1);
					template_effect(($0) => {
						classes_3 = set_class(span_1, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-19ydf4y", classes_3, $0);
						set_text(text_8, get(segment).value);
					}, [() => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
					delegated("mouseover", span_1, () => set(hoveredId, get(segment).id ?? null, true));
					delegated("mouseout", span_1, () => set(hoveredId, null));
					append($$anchor, span_1);
				};
				if_block(node_6, ($$render) => {
					if (get(segment).type === "text") $$render(consequent_4);
					else if (get(segment).type === "package") $$render(consequent_5, 1);
					else if (get(segment).type === "object-id") $$render(consequent_6, 2);
					else $$render(alternate_1, -1);
				});
				append($$anchor, fragment_1);
			});
			reset(span);
			var node_7 = sibling(span, 2);
			var consequent_10 = ($$anchor) => {
				var span_2 = root_5$7();
				let classes_4;
				each(span_2, 21, () => get(formattedSegments).slice(get(arrowIndex) + 1), index, ($$anchor, segment) => {
					var fragment_3 = comment();
					var node_8 = first_child(fragment_3);
					var consequent_7 = ($$anchor) => {
						var text_9 = text();
						template_effect(() => set_text(text_9, get(segment).value));
						append($$anchor, text_9);
					};
					var consequent_8 = ($$anchor) => {
						const packageId = user_derived(() => get(segment).id?.split("::")[0].replace("pkg:", "") ?? "");
						var a_3 = root_3$10();
						let classes_5;
						var text_10 = child(a_3, true);
						reset(a_3);
						template_effect(($0, $1) => {
							set_attribute(a_3, "href", $0);
							classes_5 = set_class(a_3, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_5, $1);
							set_attribute(a_3, "title", get(packageId));
							set_text(text_10, get(segment).value);
						}, [() => getObjectLink(getSelectedNetworkConfig(), get(packageId)), () => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
						delegated("mouseover", a_3, () => set(hoveredId, get(segment).id ?? null, true));
						delegated("mouseout", a_3, () => set(hoveredId, null));
						event("focus", a_3, () => set(hoveredId, get(segment).id ?? null, true));
						event("blur", a_3, () => set(hoveredId, null));
						append($$anchor, a_3);
					};
					var consequent_9 = ($$anchor) => {
						const objectId = user_derived(() => get(segment).id?.replace("obj:", "") ?? "");
						var a_4 = root_3$10();
						let classes_6;
						var text_11 = child(a_4, true);
						reset(a_4);
						template_effect(($0, $1) => {
							set_attribute(a_4, "href", $0);
							classes_6 = set_class(a_4, 1, `interactive-ref ${get(segment).type ?? ""}-ref link-style`, "svelte-19ydf4y", classes_6, $1);
							set_attribute(a_4, "title", `${get(segment).objectType || "Object"}: ${get(objectId)}`);
							set_text(text_11, get(segment).value);
						}, [() => getObjectLink(getSelectedNetworkConfig(), get(objectId)), () => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
						delegated("mouseover", a_4, () => set(hoveredId, get(segment).id ?? null, true));
						delegated("mouseout", a_4, () => set(hoveredId, null));
						event("focus", a_4, () => set(hoveredId, get(segment).id ?? null, true));
						event("blur", a_4, () => set(hoveredId, null));
						append($$anchor, a_4);
					};
					var alternate_2 = ($$anchor) => {
						var span_3 = root_4$9();
						let classes_7;
						var text_12 = child(span_3, true);
						reset(span_3);
						template_effect(($0) => {
							classes_7 = set_class(span_3, 1, `interactive-ref ${get(segment).type ?? ""}-ref`, "svelte-19ydf4y", classes_7, $0);
							set_text(text_12, get(segment).value);
						}, [() => ({ highlighted: isHighlighted(get(segment).id, get(hoveredId)) })]);
						delegated("mouseover", span_3, () => set(hoveredId, get(segment).id ?? null, true));
						delegated("mouseout", span_3, () => set(hoveredId, null));
						append($$anchor, span_3);
					};
					if_block(node_8, ($$render) => {
						if (get(segment).type === "text") $$render(consequent_7);
						else if (get(segment).type === "package") $$render(consequent_8, 1);
						else if (get(segment).type === "object-id") $$render(consequent_9, 2);
						else $$render(alternate_2, -1);
					});
					append($$anchor, fragment_3);
				});
				reset(span_2);
				template_effect(($0) => classes_4 = set_class(span_2, 1, "command-result", null, classes_4, $0), [() => ({ "highlighted-row": get(hoveredId)?.startsWith("result:" + i) })]);
				append($$anchor, span_2);
			};
			if_block(node_7, ($$render) => {
				if (get(arrowIndex) !== -1) $$render(consequent_10);
			});
			reset(div_9);
			reset(div_8);
			template_effect(($0) => {
				classes = set_class(div_8, 1, "command-item svelte-19ydf4y", null, classes, { selected: i === $$props.commandIndex });
				set_attribute(a, "href", $0);
				set_text(text_4, get(expandedCommands)[i] ? "▼" : "▶");
			}, [() => (() => {
				const hashParts = window.location.hash.split("?");
				const path = hashParts[0];
				const params = new URLSearchParams(hashParts[1] || "");
				params.set("view", "commands");
				params.set("commandIndex", i.toString());
				return window.location.origin + path + "?" + params.toString();
			})()]);
			delegated("click", a, (e) => {
				e.preventDefault();
				const hashParts = window.location.hash.split("?");
				const path = hashParts[0];
				const params = new URLSearchParams(hashParts[1] || "");
				params.set("view", "commands");
				params.set("commandIndex", i.toString());
				const fullUrl = window.location.origin + path + "?" + params.toString();
				navigator.clipboard.writeText(fullUrl);
				$$props.onCommandIndexChange(i);
			});
			delegated("click", button_3, () => {
				toggle(i);
				$$props.onCommandIndexChange(null);
			});
			append($$anchor, div_8);
		});
		reset(div);
		append($$anchor, div);
	};
	var alternate_3 = ($$anchor) => {
		append($$anchor, root_8$3());
	};
	if_block(node, ($$render) => {
		if (get(commands).length > 0) $$render(consequent_11);
		else $$render(alternate_3, -1);
	});
	append($$anchor, fragment);
	pop();
}
delegate([
	"click",
	"mouseover",
	"mouseout"
]);
//#endregion
//#region src/lib/utils/converter.ts
function bytesToUtf8(bytes) {
	try {
		return new TextDecoder().decode(new Uint8Array(bytes));
	} catch {
		return "Invalid UTF-8";
	}
}
function bcsBytesToInteger(bytes) {
	try {
		const length = bytes.length;
		let type;
		let value;
		switch (length) {
			case 1:
				type = "u8";
				value = bcs.u8().parse(new Uint8Array(bytes)).toString();
				break;
			case 2:
				type = "u16";
				value = bcs.u16().parse(new Uint8Array(bytes)).toString();
				break;
			case 4:
				type = "u32";
				value = bcs.u32().parse(new Uint8Array(bytes)).toString();
				break;
			case 8:
				type = "u64";
				value = bcs.u64().parse(new Uint8Array(bytes)).toString();
				break;
			case 16:
				type = "u128";
				value = bcs.u128().parse(new Uint8Array(bytes)).toString();
				break;
			case 32:
				type = "u256";
				value = bcs.u256().parse(new Uint8Array(bytes)).toString();
				break;
			default: if (length <= 8) {
				type = `u${length * 8}`;
				try {
					value = bcs.u64().parse(new Uint8Array(bytes.slice(0, 8))).toString();
				} catch {
					value = `Raw bytes (${length} bytes)`;
				}
			} else {
				type = `bytes(${length})`;
				value = `Raw bytes (${length} bytes)`;
			}
		}
		return {
			type,
			value
		};
	} catch {
		return {
			type: `bytes(${bytes.length})`,
			value: "Invalid integer"
		};
	}
}
function decodeBase64Bytes(base64) {
	try {
		const bytes = fromBase64(base64);
		return {
			bytes,
			utf8: bytesToUtf8(bytes),
			integer: bcsBytesToInteger(bytes)
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/lib/utils/iota-nano-conversion.ts
function iotaToNano(iota) {
	const [intPart, decPart = ""] = iota.replace(/_/g, "").split(".");
	if (decPart.length > 9) throw new Error("Decimal part exceeds 9 digits");
	const combined = intPart + (decPart + "0".repeat(9)).slice(0, 9);
	return BigInt(combined).toString();
}
function formatBigIntWithDecimal(bigint, decimalPlaces) {
	const str = bigint.toString();
	const len = str.length;
	if (len <= decimalPlaces) return `0.${str.padStart(decimalPlaces, "0")}`;
	return `${str.slice(0, len - decimalPlaces)}.${str.slice(len - decimalPlaces)}`;
}
var nanoToIota = (nano) => {
	return formatBigIntWithDecimal(BigInt(nano.replace(/_/g, "")), 9);
};
var nanoToIotaFormatted = (nano) => {
	const [intPart, decPart] = nanoToIota(nano).split(".");
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "_");
	if (!decPart) return formattedInt;
	return `${formattedInt}.${decPart.replace(/(\d{3})(?=\d)/g, "$1_")}`;
};
function formatNumberWithUnderscores(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}
function formatNumbersWithUnderscores(obj) {
	function process(value) {
		if (Array.isArray(value)) return value.map(process);
		else if (value !== null && typeof value === "object") {
			const newObj = {};
			for (const key in value) newObj[key] = process(value[key]);
			return newObj;
		} else if (typeof value === "number" || typeof value === "string" && /^\d+$/.test(value)) return formatNumberWithUnderscores(value);
		else return value;
	}
	return process(obj);
}
//#endregion
//#region src/lib/components/TransactionEffects.svelte
var root$12 = from_html(`<span class="status-error svelte-1n6aswm"> </span>`);
var root_1$9 = from_html(`<span class="checkpoint-info svelte-1n6aswm"> </span>`);
var root_2$9 = from_html(`<span class="epoch-info svelte-1n6aswm"> </span>`);
var root_3$9 = from_html(`<span class="time-info svelte-1n6aswm"> </span>`);
var root_4$8 = from_html(`<a target="_blank" rel="noopener noreferrer" class="field-value link-style svelte-1n6aswm"> </a>`);
var root_5$6 = from_html(`<span class="field-value svelte-1n6aswm">N/A</span>`);
var root_6$6 = from_html(`<div class="fee-main"><span class="field-label svelte-1n6aswm">Fee:</span> <span class="gas-fee svelte-1n6aswm"> </span> <span class="field-label svelte-1n6aswm">Storage cost:</span> <span class="field-value svelte-1n6aswm"> </span> <span class="field-label svelte-1n6aswm">Rebate:</span> <span class="field-value svelte-1n6aswm"> </span></div>`);
var root_7$4 = from_html(`<a target="_blank" rel="noopener noreferrer" class="full-address link-style svelte-1n6aswm"> </a>`);
var root_8$2 = from_html(`<div class="full-address svelte-1n6aswm">N/A</div>`);
var root_9$2 = from_html(`<div class="balance-box negative svelte-1n6aswm"><!> <div class="amount-value svelte-1n6aswm"> </div></div>`);
var root_10$2 = from_html(`<div class="balance-box positive svelte-1n6aswm"><!> <div class="amount-value svelte-1n6aswm"> </div></div>`);
var root_11$1 = from_html(`<div class="section svelte-1n6aswm"><h4 class="svelte-1n6aswm"> </h4> <div class="balance-columns svelte-1n6aswm"><div class="negative-changes svelte-1n6aswm"><h5 class="column-header deleted svelte-1n6aswm"> </h5> <div class="balance-content svelte-1n6aswm"></div></div> <div class="positive-changes svelte-1n6aswm"><h5 class="column-header created svelte-1n6aswm"> </h5> <div class="balance-content svelte-1n6aswm"></div></div></div></div>`);
var root_12$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a>`);
var root_13$1 = from_html(`<div class="object-type svelte-1n6aswm"> </div>`);
var root_14$1 = from_html(`<div class="object-version svelte-1n6aswm"> </div>`);
var root_15$1 = from_html(`<div class="object-sender svelte-1n6aswm"> </div>`);
var root_16$1 = from_html(`<details class="state-collapsible svelte-1n6aswm" open=""><summary class="state-summary svelte-1n6aswm">Previous State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`);
var root_17$1 = from_html(`<div class="object-box deleted svelte-1n6aswm"><!> <!> <!> <!> <!></div>`);
var root_18$1 = from_html(`<details class="state-collapsible svelte-1n6aswm"><summary class="state-summary svelte-1n6aswm">Previous State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`);
var root_19$1 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <details class="state-collapsible svelte-1n6aswm" open=""><summary class="state-summary svelte-1n6aswm">Current State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`, 1);
var root_20$1 = from_html(`<div class="object-owner svelte-1n6aswm"> </div>`);
var root_21$1 = from_html(`<div class="object-previous-version svelte-1n6aswm"> </div>`);
var root_22 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <!> <!> <!>`, 1);
var root_23 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!>`, 1);
var root_24 = from_html(`<div class="object-box mutated svelte-1n6aswm"><!></div>`);
var root_25 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <details class="state-collapsible svelte-1n6aswm" open=""><summary class="state-summary svelte-1n6aswm">Object State:</summary> <div class="object-json svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></details>`, 1);
var root_26 = from_html(`<a target="_blank" rel="noopener noreferrer" class="object-id link-style svelte-1n6aswm"> </a> <!> <!> <!>`, 1);
var root_27 = from_html(`<div class="object-box created svelte-1n6aswm"><!></div>`);
var root_28 = from_html(`<div class="section svelte-1n6aswm"><h4 class="svelte-1n6aswm"> </h4> <div class="object-columns-three svelte-1n6aswm"><div class="deleted-objects svelte-1n6aswm"><h5 class="column-header deleted svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div> <div class="mutated-objects svelte-1n6aswm"><h5 class="column-header mutated svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div> <div class="created-objects svelte-1n6aswm"><h5 class="column-header created svelte-1n6aswm"> </h5> <div class="object-content svelte-1n6aswm"></div></div></div></div>`);
var root_29 = from_html(`<pre class="event-data svelte-1n6aswm"> </pre>`);
var root_30 = from_html(`<div class="event-item svelte-1n6aswm"><span class="event-index svelte-1n6aswm"></span> <span class="event-type svelte-1n6aswm"> </span> <!></div>`);
var root_31 = from_html(`<div class="section svelte-1n6aswm"><details class="events-collapsible svelte-1n6aswm"><summary class="svelte-1n6aswm"> </summary> <div class="events-content"></div></details></div>`);
var root_32 = from_html(`<pre class="svelte-1n6aswm"> </pre>`);
var root_33 = from_html(`<div class="command-item svelte-1n6aswm"><span class="command-index svelte-1n6aswm"></span> <span class="command-kind svelte-1n6aswm"> </span> <div class="command-data svelte-1n6aswm"><!></div></div>`);
var root_34 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="commands-list svelte-1n6aswm"></div></div>`);
var root_35 = from_html(`<div class="decoded-bytes svelte-1n6aswm"><div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm">UTF-8:</span> <span class="decode-value svelte-1n6aswm"> </span></div> <div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm"> </span> <span class="decode-value svelte-1n6aswm"> </span></div> <div class="decoded-item svelte-1n6aswm"><span class="decode-label svelte-1n6aswm">Bytes:</span> <span class="decode-value svelte-1n6aswm"> </span></div></div>`);
var root_36 = from_html(`<div class="input-item svelte-1n6aswm"><span class="input-index svelte-1n6aswm"></span> <span class="input-kind svelte-1n6aswm"> </span> <div class="input-data svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre> <!></div></div>`);
var root_37 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Inputs:</span> <div class="inputs-list svelte-1n6aswm"></div></div>`);
var root_38 = from_html(`<div class="input-item svelte-1n6aswm"><span class="input-index svelte-1n6aswm"></span> <span class="input-kind svelte-1n6aswm"> </span> <div class="input-data svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></div>`);
var root_39 = from_html(`<span class="separator svelte-1n6aswm">,</span>`);
var root_40 = from_html(`<span class="payment-object svelte-1n6aswm"> </span> <!>`, 1);
var root_41 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm">Gas Data:</span> <div class="gas-info svelte-1n6aswm"><div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Payment:</span> <span class="field-value svelte-1n6aswm"><!></span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Owner:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Price:</span> <span class="field-value svelte-1n6aswm"> </span></div> <div class="gas-field svelte-1n6aswm"><span class="field-label svelte-1n6aswm">Budget:</span> <span class="field-value svelte-1n6aswm"> </span></div></div></div>`);
var root_42 = from_html(`<div class="output-bytes svelte-1n6aswm"><span class="bytes-label svelte-1n6aswm">Bytes:</span> <div class="bytes-array svelte-1n6aswm"> </div></div>`);
var root_43 = from_html(`<div class="output-object-type svelte-1n6aswm"><span class="type-label svelte-1n6aswm">Type:</span> <span class="type-value svelte-1n6aswm"> </span></div>`);
var root_44 = from_html(`<div class="reference-output svelte-1n6aswm"><div class="output-header svelte-1n6aswm"><span class="output-index svelte-1n6aswm"></span> <span class="output-type svelte-1n6aswm"> </span></div> <!> <!></div>`);
var root_45 = from_html(`<div class="mutable-references svelte-1n6aswm"><h6 class="svelte-1n6aswm"> </h6> <!></div>`);
var root_46 = from_html(`<div class="return-bytes svelte-1n6aswm"><span class="bytes-label svelte-1n6aswm">Bytes:</span> <div class="bytes-array svelte-1n6aswm"> </div></div>`);
var root_47 = from_html(`<div class="return-object-type svelte-1n6aswm"><span class="type-label svelte-1n6aswm">Type:</span> <span class="type-value svelte-1n6aswm"> </span></div>`);
var root_48 = from_html(`<div class="return-value svelte-1n6aswm"><div class="return-header svelte-1n6aswm"><span class="return-index svelte-1n6aswm"></span></div> <!> <!></div>`);
var root_49 = from_html(`<div class="return-values svelte-1n6aswm"><h6 class="svelte-1n6aswm"> </h6> <!></div>`);
var root_50 = from_html(`<div class="result-raw svelte-1n6aswm"><details class="raw-collapsible svelte-1n6aswm"><summary class="svelte-1n6aswm">Raw Result Data</summary> <pre class="svelte-1n6aswm"> </pre></details></div>`);
var root_51 = from_html(`<div class="dev-inspect-item svelte-1n6aswm"><div class="result-header svelte-1n6aswm"><span class="result-index svelte-1n6aswm"></span></div> <!> <!> <!></div>`);
var root_52 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="dev-inspect-results svelte-1n6aswm"></div></div>`);
var root_53 = from_html(`<div class="raw-result-item svelte-1n6aswm"><div class="raw-result-header svelte-1n6aswm"><span class="raw-result-index svelte-1n6aswm"></span></div> <div class="raw-result-content svelte-1n6aswm"><pre class="svelte-1n6aswm"> </pre></div></div>`);
var root_54 = from_html(`<div class="section svelte-1n6aswm"><span class="svelte-1n6aswm"> </span> <div class="raw-results svelte-1n6aswm"></div></div>`);
var root_55 = from_html(`<div class="header-line svelte-1n6aswm"><span class="tx-header svelte-1n6aswm">Transaction</span> <a target="_blank" rel="noopener noreferrer" class="tx-id-short svelte-1n6aswm"> </a> <span class="status svelte-1n6aswm"> </span> <!> <!> <!> <!></div> <div class="sender-fee-line svelte-1n6aswm"><div class="sender-section"><span class="field-label svelte-1n6aswm">Sender:</span> <!></div> <div class="fee-section"><!></div></div> <!> <!> <!> <!> <!> <!> <!> <!>`, 1);
var root_56 = from_html(`<div class="no-data svelte-1n6aswm">No transaction effects data available</div>`);
var root_57 = from_html(`<div class="transaction-effects svelte-1n6aswm"><!></div>`);
function TransactionEffects($$anchor, $$props) {
	push($$props, false);
	const effects = mutable_source();
	const balanceChanges = mutable_source();
	const objectChanges = mutable_source();
	const events = mutable_source();
	const split = mutable_source();
	const deletedObjects = mutable_source();
	const createdObjects = mutable_source();
	const mutatedObjects = mutable_source();
	const hasValidData = mutable_source();
	let transactionData = prop($$props, "transactionData", 8);
	function formatAmount(amount, coinType) {
		if (!amount) return "";
		const isNegative = amount.startsWith("-");
		const absAmount = amount.replace("-", "");
		let coinTypeStr = "";
		if (typeof coinType === "string") coinTypeStr = coinType;
		else if (coinType && typeof coinType === "object" && "repr" in coinType) coinTypeStr = coinType.repr;
		let coinSymbol = "Unknown";
		if (coinTypeStr) {
			const parts = coinTypeStr.split("::");
			coinSymbol = parts.length > 2 ? parts[parts.length - 1].toUpperCase() : "Unknown";
		}
		try {
			if (coinTypeStr === "0x2::iota::IOTA") {
				const iotaAmount = nanoToIota(absAmount);
				return `${isNegative ? "-" : "+"}${iotaAmount} ${coinSymbol}`;
			} else return `${isNegative ? "-" : "+"}${parseInt(absAmount).toLocaleString()} ${coinSymbol}`;
		} catch {
			return `${amount} ${coinSymbol}`;
		}
	}
	function formatGasCost(gasSummary) {
		if (!gasSummary) return "";
		const total = BigInt(gasSummary.storageCost || 0) + BigInt(gasSummary.computationCost || 0) - BigInt(gasSummary.storageRebate || 0);
		try {
			return `${nanoToIota(total.toString())} IOTA`;
		} catch {
			return `${formatNumberWithUnderscores(total.toString())} nanos`;
		}
	}
	function getBalanceChangeAddress(owner) {
		if (!owner) return "";
		if (typeof owner === "string") return owner;
		return owner.address || owner.AddressOwner || owner.ObjectOwner || "";
	}
	function getStatusColor(status) {
		switch ((typeof status === "string" ? status : status?.status)?.toUpperCase()) {
			case "SUCCESS": return "#28a745";
			case "FAILURE":
			case "FAILED": return "#dc3545";
			default: return "#6c757d";
		}
	}
	function getStatusString(status) {
		return typeof status === "string" ? status : status?.status || "Unknown";
	}
	function getStatusError(status, fallbackErrors) {
		const err = typeof status === "object" ? status?.error : null;
		if (err) return err;
		if (Array.isArray(fallbackErrors) && fallbackErrors.length > 0) return fallbackErrors.join("; ");
		return "";
	}
	legacy_pre_effect(() => deep_read_state(transactionData()), () => {
		set(effects, transactionData()?.effects);
	});
	legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
		set(balanceChanges, transactionData()?.balanceChanges || get(effects)?.balanceChanges?.nodes || get(effects)?.balanceChanges || []);
	});
	legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
		set(objectChanges, transactionData()?.objectChanges || get(effects)?.objectChanges?.nodes || get(effects)?.objectChanges || []);
	});
	legacy_pre_effect(() => (deep_read_state(transactionData()), get(effects)), () => {
		set(events, transactionData()?.events || get(effects)?.events?.nodes || get(effects)?.events || []);
	});
	legacy_pre_effect(() => (get(objectChanges), get(effects)), () => {
		set(split, splitObjectChanges(get(objectChanges), get(effects)));
	});
	legacy_pre_effect(() => get(split), () => {
		set(deletedObjects, get(split).deleted);
	});
	legacy_pre_effect(() => get(split), () => {
		set(createdObjects, get(split).created);
	});
	legacy_pre_effect(() => get(split), () => {
		set(mutatedObjects, get(split).mutated);
	});
	legacy_pre_effect(() => (get(effects), get(balanceChanges)), () => {
		set(hasValidData, get(effects) && (get(effects).status || get(effects).checkpoint || get(balanceChanges).length > 0));
	});
	legacy_pre_effect_reset();
	init();
	var div = root_57();
	var node = child(div);
	var consequent_55 = ($$anchor) => {
		var fragment = root_55();
		var div_1 = first_child(fragment);
		var a = sibling(child(div_1), 2);
		var text$3 = child(a, true);
		reset(a);
		var span = sibling(a, 2);
		var text_1 = child(span, true);
		reset(span);
		var node_1 = sibling(span, 2);
		var consequent = ($$anchor) => {
			var span_1 = root$12();
			var text_2 = child(span_1, true);
			reset(span_1);
			template_effect(($0, $1) => {
				set_attribute(span_1, "title", $0);
				set_text(text_2, $1);
			}, [() => (get(effects), deep_read_state(transactionData()), untrack(() => getStatusError(get(effects).status, transactionData()?.errors))), () => (get(effects), deep_read_state(transactionData()), untrack(() => getStatusError(get(effects).status, transactionData()?.errors)))]);
			append($$anchor, span_1);
		};
		var d = user_derived(() => (get(effects), deep_read_state(transactionData()), untrack(() => getStatusError(get(effects).status, transactionData()?.errors))));
		if_block(node_1, ($$render) => {
			if (get(d)) $$render(consequent);
		});
		var node_2 = sibling(node_1, 2);
		var consequent_1 = ($$anchor) => {
			var span_2 = root_1$9();
			var text_3 = child(span_2);
			reset(span_2);
			template_effect(($0) => set_text(text_3, `Checkpoint: ${$0 ?? ""}`), [() => (deep_read_state(formatNumberWithUnderscores), get(effects), untrack(() => formatNumberWithUnderscores(get(effects).checkpoint.sequenceNumber)))]);
			append($$anchor, span_2);
		};
		if_block(node_2, ($$render) => {
			if (get(effects), untrack(() => get(effects).checkpoint?.sequenceNumber)) $$render(consequent_1);
		});
		var node_3 = sibling(node_2, 2);
		var consequent_2 = ($$anchor) => {
			var span_3 = root_2$9();
			var text_4 = child(span_3);
			reset(span_3);
			template_effect(() => set_text(text_4, `Epoch: ${(get(effects), untrack(() => get(effects).executedEpoch)) ?? ""}`));
			append($$anchor, span_3);
		};
		if_block(node_3, ($$render) => {
			if (get(effects), untrack(() => get(effects).executedEpoch !== void 0)) $$render(consequent_2);
		});
		var node_4 = sibling(node_3, 2);
		var consequent_3 = ($$anchor) => {
			var span_4 = root_3$9();
			var text_5 = child(span_4, true);
			reset(span_4);
			template_effect(($0) => set_text(text_5, $0), [() => (get(effects), deep_read_state(transactionData()), untrack(() => new Date(get(effects).checkpoint?.timestamp || transactionData()?.timestamp).toLocaleString()))]);
			append($$anchor, span_4);
		};
		if_block(node_4, ($$render) => {
			if (get(effects), deep_read_state(transactionData()), untrack(() => get(effects).checkpoint?.timestamp || transactionData()?.timestamp)) $$render(consequent_3);
		});
		reset(div_1);
		var div_2 = sibling(div_1, 2);
		var div_3 = child(div_2);
		var node_5 = sibling(child(div_3), 2);
		var consequent_4 = ($$anchor) => {
			var a_1 = root_4$8();
			var text_6 = child(a_1, true);
			reset(a_1);
			template_effect(($0) => {
				set_attribute(a_1, "href", $0);
				set_attribute(a_1, "title", (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
				set_text(text_6, (deep_read_state(transactionData()), untrack(() => transactionData().sender)));
			}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), deep_read_state(transactionData()), untrack(() => getAddressLink(getSelectedNetworkConfig(), transactionData().sender)))]);
			append($$anchor, a_1);
		};
		var alternate = ($$anchor) => {
			append($$anchor, root_5$6());
		};
		if_block(node_5, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.sender)) $$render(consequent_4);
			else $$render(alternate, -1);
		});
		reset(div_3);
		var div_4 = sibling(div_3, 2);
		var node_6 = child(div_4);
		var consequent_5 = ($$anchor) => {
			var div_5 = root_6$6();
			var span_6 = sibling(child(div_5), 2);
			var text_7 = child(span_6, true);
			reset(span_6);
			var span_7 = sibling(span_6, 4);
			var text_8 = child(span_7, true);
			reset(span_7);
			var span_8 = sibling(span_7, 4);
			var text_9 = child(span_8, true);
			reset(span_8);
			reset(div_5);
			template_effect(($0, $1, $2) => {
				set_text(text_7, $0);
				set_text(text_8, $1);
				set_text(text_9, $2);
			}, [
				() => (get(effects), untrack(() => formatGasCost(get(effects).gasEffects.gasSummary))),
				() => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageCost || 0))),
				() => (deep_read_state(nanoToIota), get(effects), untrack(() => nanoToIota(get(effects).gasEffects.gasSummary.storageRebate || 0)))
			]);
			append($$anchor, div_5);
		};
		if_block(node_6, ($$render) => {
			if (get(effects), untrack(() => get(effects).gasEffects?.gasSummary)) $$render(consequent_5);
		});
		reset(div_4);
		reset(div_2);
		var node_7 = sibling(div_2, 2);
		var consequent_8 = ($$anchor) => {
			var div_6 = root_11$1();
			var h4 = child(div_6);
			var text_10 = child(h4);
			reset(h4);
			var div_7 = sibling(h4, 2);
			var div_8 = child(div_7);
			var h5 = child(div_8);
			var text_11 = child(h5);
			reset(h5);
			var div_9 = sibling(h5, 2);
			each(div_9, 5, () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")))), index, ($$anchor, change) => {
				const addr = derived_safe_equal(() => (get(change), untrack(() => getBalanceChangeAddress(get(change).owner))));
				var div_10 = root_9$2();
				var node_8 = child(div_10);
				var consequent_6 = ($$anchor) => {
					var a_2 = root_7$4();
					var text_12 = child(a_2, true);
					reset(a_2);
					template_effect(($0) => {
						set_attribute(a_2, "href", $0);
						set_attribute(a_2, "title", get(addr));
						set_text(text_12, get(addr));
					}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), deep_read_state(get(addr)), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(addr))))]);
					append($$anchor, a_2);
				};
				var alternate_1 = ($$anchor) => {
					append($$anchor, root_8$2());
				};
				if_block(node_8, ($$render) => {
					if (get(addr)) $$render(consequent_6);
					else $$render(alternate_1, -1);
				});
				var div_12 = sibling(node_8, 2);
				var text_13 = child(div_12, true);
				reset(div_12);
				reset(div_10);
				template_effect(($0) => set_text(text_13, $0), [() => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))]);
				append($$anchor, div_10);
			});
			reset(div_9);
			reset(div_8);
			var div_13 = sibling(div_8, 2);
			var h5_1 = child(div_13);
			var text_14 = child(h5_1);
			reset(h5_1);
			var div_14 = sibling(h5_1, 2);
			each(div_14, 5, () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")))), index, ($$anchor, change) => {
				const addr = derived_safe_equal(() => (get(change), untrack(() => getBalanceChangeAddress(get(change).owner))));
				var div_15 = root_10$2();
				var node_9 = child(div_15);
				var consequent_7 = ($$anchor) => {
					var a_3 = root_7$4();
					var text_15 = child(a_3, true);
					reset(a_3);
					template_effect(($0) => {
						set_attribute(a_3, "href", $0);
						set_attribute(a_3, "title", get(addr));
						set_text(text_15, get(addr));
					}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), deep_read_state(get(addr)), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(addr))))]);
					append($$anchor, a_3);
				};
				var alternate_2 = ($$anchor) => {
					append($$anchor, root_8$2());
				};
				if_block(node_9, ($$render) => {
					if (get(addr)) $$render(consequent_7);
					else $$render(alternate_2, -1);
				});
				var div_17 = sibling(node_9, 2);
				var text_16 = child(div_17, true);
				reset(div_17);
				reset(div_15);
				template_effect(($0) => set_text(text_16, $0), [() => (get(change), untrack(() => formatAmount(get(change).amount, get(change).coinType)))]);
				append($$anchor, div_15);
			});
			reset(div_14);
			reset(div_13);
			reset(div_7);
			reset(div_6);
			template_effect(($0, $1) => {
				set_text(text_10, `Balance Changes (${(get(balanceChanges), untrack(() => get(balanceChanges).length)) ?? ""}):`);
				set_text(text_11, `Negative Changes (${$0 ?? ""}):`);
				set_text(text_14, `Positive Changes (${$1 ?? ""}):`);
			}, [() => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => change.amount.startsWith("-")).length)), () => (get(balanceChanges), untrack(() => get(balanceChanges).filter((change) => !change.amount.startsWith("-")).length))]);
			append($$anchor, div_6);
		};
		if_block(node_7, ($$render) => {
			if (get(balanceChanges), untrack(() => get(balanceChanges).length > 0)) $$render(consequent_8);
		});
		var node_10 = sibling(node_7, 2);
		var consequent_28 = ($$anchor) => {
			var div_18 = root_28();
			var h4_1 = child(div_18);
			var text_17 = child(h4_1);
			reset(h4_1);
			var div_19 = sibling(h4_1, 2);
			var div_20 = child(div_19);
			var h5_2 = child(div_20);
			var text_18 = child(h5_2);
			reset(h5_2);
			var div_21 = sibling(h5_2, 2);
			each(div_21, 5, () => get(deletedObjects), index, ($$anchor, change) => {
				var div_22 = root_17$1();
				var node_11 = child(div_22);
				var consequent_9 = ($$anchor) => {
					var a_4 = root_12$1();
					var text_19 = child(a_4, true);
					reset(a_4);
					template_effect(($0) => {
						set_attribute(a_4, "href", $0);
						set_text(text_19, (get(change), untrack(() => get(change).objectId)));
					}, [() => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))]);
					append($$anchor, a_4);
				};
				var consequent_10 = ($$anchor) => {
					var a_5 = root_12$1();
					var text_20 = child(a_5, true);
					reset(a_5);
					template_effect(($0) => {
						set_attribute(a_5, "href", $0);
						set_text(text_20, (get(change), untrack(() => get(change).address)));
					}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))]);
					append($$anchor, a_5);
				};
				if_block(node_11, ($$render) => {
					if (get(change), untrack(() => get(change).objectId)) $$render(consequent_9);
					else if (get(change), untrack(() => get(change).address)) $$render(consequent_10, 1);
				});
				var node_12 = sibling(node_11, 2);
				var consequent_11 = ($$anchor) => {
					var div_23 = root_13$1();
					var text_21 = child(div_23, true);
					reset(div_23);
					template_effect(() => set_text(text_21, (get(change), untrack(() => get(change).objectType))));
					append($$anchor, div_23);
				};
				if_block(node_12, ($$render) => {
					if (get(change), untrack(() => get(change).objectType)) $$render(consequent_11);
				});
				var node_13 = sibling(node_12, 2);
				var consequent_12 = ($$anchor) => {
					var div_24 = root_14$1();
					var text_22 = child(div_24);
					reset(div_24);
					template_effect(() => set_text(text_22, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
					append($$anchor, div_24);
				};
				if_block(node_13, ($$render) => {
					if (get(change), untrack(() => get(change).version)) $$render(consequent_12);
				});
				var node_14 = sibling(node_13, 2);
				var consequent_13 = ($$anchor) => {
					var div_25 = root_15$1();
					var text_23 = child(div_25);
					reset(div_25);
					template_effect(() => set_text(text_23, `Sender: ${(get(change), untrack(() => get(change).sender)) ?? ""}`));
					append($$anchor, div_25);
				};
				if_block(node_14, ($$render) => {
					if (get(change), untrack(() => get(change).sender)) $$render(consequent_13);
				});
				var node_15 = sibling(node_14, 2);
				var consequent_14 = ($$anchor) => {
					var details = root_16$1();
					var div_26 = sibling(child(details), 2);
					var pre = child(div_26);
					var text_24 = child(pre, true);
					reset(pre);
					reset(div_26);
					reset(details);
					template_effect(($0) => set_text(text_24, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))]);
					append($$anchor, details);
				};
				if_block(node_15, ($$render) => {
					if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_14);
				});
				reset(div_22);
				append($$anchor, div_22);
			});
			reset(div_21);
			reset(div_20);
			var div_27 = sibling(div_20, 2);
			var h5_3 = child(div_27);
			var text_25 = child(h5_3);
			reset(h5_3);
			var div_28 = sibling(h5_3, 2);
			each(div_28, 5, () => get(mutatedObjects), index, ($$anchor, change) => {
				var div_29 = root_24();
				var node_16 = child(div_29);
				var consequent_16 = ($$anchor) => {
					var fragment_1 = root_19$1();
					var a_6 = first_child(fragment_1);
					var text_26 = child(a_6, true);
					reset(a_6);
					var node_17 = sibling(a_6, 2);
					var consequent_15 = ($$anchor) => {
						var details_1 = root_18$1();
						var div_30 = sibling(child(details_1), 2);
						var pre_1 = child(div_30);
						var text_27 = child(pre_1, true);
						reset(pre_1);
						reset(div_30);
						reset(details_1);
						template_effect(($0) => set_text(text_27, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))]);
						append($$anchor, details_1);
					};
					if_block(node_17, ($$render) => {
						if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_15);
					});
					var details_2 = sibling(node_17, 2);
					var div_31 = sibling(child(details_2), 2);
					var pre_2 = child(div_31);
					var text_28 = child(pre_2, true);
					reset(pre_2);
					reset(div_31);
					reset(details_2);
					template_effect(($0, $1) => {
						set_attribute(a_6, "href", $0);
						set_text(text_26, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
						set_text(text_28, $1);
					}, [() => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).outputState.asMoveObject.contents.json.id))), () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))]);
					append($$anchor, fragment_1);
				};
				var consequent_21 = ($$anchor) => {
					var fragment_2 = root_22();
					var a_7 = first_child(fragment_2);
					var text_29 = child(a_7, true);
					reset(a_7);
					var node_18 = sibling(a_7, 2);
					var consequent_17 = ($$anchor) => {
						var div_32 = root_13$1();
						var text_30 = child(div_32, true);
						reset(div_32);
						template_effect(() => set_text(text_30, (get(change), untrack(() => get(change).objectType))));
						append($$anchor, div_32);
					};
					if_block(node_18, ($$render) => {
						if (get(change), untrack(() => get(change).objectType)) $$render(consequent_17);
					});
					var node_19 = sibling(node_18, 2);
					var consequent_18 = ($$anchor) => {
						var div_33 = root_20$1();
						var text_31 = child(div_33);
						reset(div_33);
						template_effect(() => set_text(text_31, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
						append($$anchor, div_33);
					};
					if_block(node_19, ($$render) => {
						if (get(change), untrack(() => get(change).owner)) $$render(consequent_18);
					});
					var node_20 = sibling(node_19, 2);
					var consequent_19 = ($$anchor) => {
						var div_34 = root_14$1();
						var text_32 = child(div_34);
						reset(div_34);
						template_effect(() => set_text(text_32, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
						append($$anchor, div_34);
					};
					if_block(node_20, ($$render) => {
						if (get(change), untrack(() => get(change).version)) $$render(consequent_19);
					});
					var node_21 = sibling(node_20, 2);
					var consequent_20 = ($$anchor) => {
						var div_35 = root_21$1();
						var text_33 = child(div_35);
						reset(div_35);
						template_effect(() => set_text(text_33, `Previous Version: ${(get(change), untrack(() => get(change).previousVersion)) ?? ""}`));
						append($$anchor, div_35);
					};
					if_block(node_21, ($$render) => {
						if (get(change), untrack(() => get(change).previousVersion)) $$render(consequent_20);
					});
					template_effect(($0) => {
						set_attribute(a_7, "href", $0);
						set_text(text_29, (get(change), untrack(() => get(change).objectId)));
					}, [() => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))]);
					append($$anchor, fragment_2);
				};
				var alternate_3 = ($$anchor) => {
					var fragment_3 = root_23();
					var a_8 = first_child(fragment_3);
					var text_34 = child(a_8, true);
					reset(a_8);
					var node_22 = sibling(a_8, 2);
					var consequent_22 = ($$anchor) => {
						var details_3 = root_18$1();
						var div_36 = sibling(child(details_3), 2);
						var pre_3 = child(div_36);
						var text_35 = child(pre_3, true);
						reset(pre_3);
						reset(div_36);
						reset(details_3);
						template_effect(($0) => set_text(text_35, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).inputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))]);
						append($$anchor, details_3);
					};
					if_block(node_22, ($$render) => {
						if (get(change), untrack(() => get(change).inputState?.asMoveObject?.contents?.json)) $$render(consequent_22);
					});
					template_effect(($0) => {
						set_attribute(a_8, "href", $0);
						set_text(text_34, (get(change), untrack(() => get(change).address)));
					}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))]);
					append($$anchor, fragment_3);
				};
				if_block(node_16, ($$render) => {
					if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_16);
					else if (get(change), untrack(() => get(change).objectId)) $$render(consequent_21, 1);
					else $$render(alternate_3, -1);
				});
				reset(div_29);
				append($$anchor, div_29);
			});
			reset(div_28);
			reset(div_27);
			var div_37 = sibling(div_27, 2);
			var h5_4 = child(div_37);
			var text_36 = child(h5_4);
			reset(h5_4);
			var div_38 = sibling(h5_4, 2);
			each(div_38, 5, () => get(createdObjects), index, ($$anchor, change) => {
				var div_39 = root_27();
				var node_23 = child(div_39);
				var consequent_23 = ($$anchor) => {
					var fragment_4 = root_25();
					var a_9 = first_child(fragment_4);
					var text_37 = child(a_9, true);
					reset(a_9);
					var details_4 = sibling(a_9, 2);
					var div_40 = sibling(child(details_4), 2);
					var pre_4 = child(div_40);
					var text_38 = child(pre_4, true);
					reset(pre_4);
					reset(div_40);
					reset(details_4);
					template_effect(($0, $1) => {
						set_attribute(a_9, "href", $0);
						set_text(text_37, (get(change), untrack(() => get(change).outputState.asMoveObject.contents.json.id)));
						set_text(text_38, $1);
					}, [() => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).outputState.asMoveObject.contents.json.id))), () => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(change), untrack(() => formatJsonWithCompactArrays(removeKindFields(Object.fromEntries(Object.entries({ ...get(change).outputState.asMoveObject.contents.json }).filter(([key]) => key !== "id"))))))]);
					append($$anchor, fragment_4);
				};
				var consequent_27 = ($$anchor) => {
					var fragment_5 = root_26();
					var a_10 = first_child(fragment_5);
					var text_39 = child(a_10, true);
					reset(a_10);
					var node_24 = sibling(a_10, 2);
					var consequent_24 = ($$anchor) => {
						var div_41 = root_13$1();
						var text_40 = child(div_41, true);
						reset(div_41);
						template_effect(() => set_text(text_40, (get(change), untrack(() => get(change).objectType))));
						append($$anchor, div_41);
					};
					if_block(node_24, ($$render) => {
						if (get(change), untrack(() => get(change).objectType)) $$render(consequent_24);
					});
					var node_25 = sibling(node_24, 2);
					var consequent_25 = ($$anchor) => {
						var div_42 = root_20$1();
						var text_41 = child(div_42);
						reset(div_42);
						template_effect(() => set_text(text_41, `Owner: ${(get(change), untrack(() => get(change).owner.AddressOwner || get(change).owner)) ?? ""}`));
						append($$anchor, div_42);
					};
					if_block(node_25, ($$render) => {
						if (get(change), untrack(() => get(change).owner)) $$render(consequent_25);
					});
					var node_26 = sibling(node_25, 2);
					var consequent_26 = ($$anchor) => {
						var div_43 = root_14$1();
						var text_42 = child(div_43);
						reset(div_43);
						template_effect(() => set_text(text_42, `Version: ${(get(change), untrack(() => get(change).version)) ?? ""}`));
						append($$anchor, div_43);
					};
					if_block(node_26, ($$render) => {
						if (get(change), untrack(() => get(change).version)) $$render(consequent_26);
					});
					template_effect(($0) => {
						set_attribute(a_10, "href", $0);
						set_text(text_39, (get(change), untrack(() => get(change).objectId)));
					}, [() => (deep_read_state(getObjectLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getObjectLink(getSelectedNetworkConfig(), get(change).objectId)))]);
					append($$anchor, fragment_5);
				};
				var alternate_4 = ($$anchor) => {
					var a_11 = root_12$1();
					var text_43 = child(a_11, true);
					reset(a_11);
					template_effect(($0) => {
						set_attribute(a_11, "href", $0);
						set_text(text_43, (get(change), untrack(() => get(change).address)));
					}, [() => (deep_read_state(getAddressLink), deep_read_state(getSelectedNetworkConfig), get(change), untrack(() => getAddressLink(getSelectedNetworkConfig(), get(change).address)))]);
					append($$anchor, a_11);
				};
				if_block(node_23, ($$render) => {
					if (get(change), untrack(() => get(change).outputState?.asMoveObject?.contents?.json?.id)) $$render(consequent_23);
					else if (get(change), untrack(() => get(change).objectId)) $$render(consequent_27, 1);
					else $$render(alternate_4, -1);
				});
				reset(div_39);
				append($$anchor, div_39);
			});
			reset(div_38);
			reset(div_37);
			reset(div_19);
			reset(div_18);
			template_effect(() => {
				set_text(text_17, `Object Changes (${(get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length + get(createdObjects).length + get(mutatedObjects).length + get(deletedObjects).length)) ?? ""}):`);
				set_text(text_18, `Deleted (${(get(deletedObjects), untrack(() => get(deletedObjects).length)) ?? ""}):`);
				set_text(text_25, `Mutated (${(get(mutatedObjects), untrack(() => get(mutatedObjects).length)) ?? ""}):`);
				set_text(text_36, `Created (${(get(createdObjects), untrack(() => get(createdObjects).length)) ?? ""}):`);
			});
			append($$anchor, div_18);
		};
		if_block(node_10, ($$render) => {
			if (get(objectChanges), get(createdObjects), get(mutatedObjects), get(deletedObjects), untrack(() => get(objectChanges).length > 0 || get(createdObjects).length > 0 || get(mutatedObjects).length > 0 || get(deletedObjects).length > 0)) $$render(consequent_28);
		});
		var node_27 = sibling(node_10, 2);
		var consequent_30 = ($$anchor) => {
			var div_44 = root_31();
			var details_5 = child(div_44);
			var summary = child(details_5);
			var text_44 = child(summary);
			reset(summary);
			var div_45 = sibling(summary, 2);
			each(div_45, 5, () => get(events), index, ($$anchor, event, index) => {
				var div_46 = root_30();
				var span_9 = child(div_46);
				span_9.textContent = `#${index + 1}`;
				var span_10 = sibling(span_9, 2);
				var text_45 = child(span_10, true);
				reset(span_10);
				var node_28 = sibling(span_10, 2);
				var consequent_29 = ($$anchor) => {
					var pre_5 = root_29();
					var text_46 = child(pre_5, true);
					reset(pre_5);
					template_effect(($0) => set_text(text_46, $0), [() => (deep_read_state(formatJsonWithCompactArrays), get(event), untrack(() => formatJsonWithCompactArrays(get(event).parsedJson)))]);
					append($$anchor, pre_5);
				};
				if_block(node_28, ($$render) => {
					if (get(event), untrack(() => get(event).parsedJson)) $$render(consequent_29);
				});
				reset(div_46);
				template_effect(() => set_text(text_45, (get(event), untrack(() => get(event).type || "Unknown"))));
				append($$anchor, div_46);
			});
			reset(div_45);
			reset(details_5);
			reset(div_44);
			template_effect(() => set_text(text_44, `Events (${(get(events), untrack(() => get(events).length)) ?? ""})`));
			append($$anchor, div_44);
		};
		if_block(node_27, ($$render) => {
			if (get(events), untrack(() => get(events).length > 0)) $$render(consequent_30);
		});
		var node_29 = sibling(node_27, 2);
		var consequent_32 = ($$anchor) => {
			var div_47 = root_34();
			var span_11 = child(div_47);
			var text_47 = child(span_11);
			reset(span_11);
			var div_48 = sibling(span_11, 2);
			each(div_48, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands)), index, ($$anchor, command, index) => {
				var div_49 = root_33();
				var span_12 = child(div_49);
				span_12.textContent = index;
				var span_13 = sibling(span_12, 2);
				var text_48 = child(span_13, true);
				reset(span_13);
				var div_50 = sibling(span_13, 2);
				var node_30 = child(div_50);
				var consequent_31 = ($$anchor) => {
					const moveCall = derived_safe_equal(() => (get(command), untrack(() => get(command).MoveCall)));
					const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
					const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
						function: get(signature),
						typeArguments: get(moveCall).typeArguments,
						arguments: get(moveCall).arguments
					}))));
					var pre_6 = root_32();
					var text_49 = child(pre_6, true);
					reset(pre_6);
					template_effect(($0) => set_text(text_49, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))]);
					append($$anchor, pre_6);
				};
				var alternate_5 = ($$anchor) => {
					var pre_7 = root_32();
					var text_50 = child(pre_7, true);
					reset(pre_7);
					template_effect(($0) => set_text(text_50, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(command), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(command))[get(command).$kind])))]);
					append($$anchor, pre_7);
				};
				if_block(node_30, ($$render) => {
					if (get(command), untrack(() => get(command).$kind === "MoveCall" && get(command).MoveCall)) $$render(consequent_31);
					else $$render(alternate_5, -1);
				});
				reset(div_50);
				reset(div_49);
				template_effect(() => set_text(text_48, (get(command), untrack(() => get(command).$kind))));
				append($$anchor, div_49);
			});
			reset(div_48);
			reset(div_47);
			template_effect(() => set_text(text_47, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands.length)) ?? ""}):`));
			append($$anchor, div_47);
		};
		var consequent_35 = ($$anchor) => {
			var div_51 = root_34();
			var span_14 = child(div_51);
			var text_51 = child(span_14);
			reset(span_14);
			var div_52 = sibling(span_14, 2);
			each(div_52, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions)), index, ($$anchor, command, index) => {
				var div_53 = root_33();
				var span_15 = child(div_53);
				span_15.textContent = index;
				var span_16 = sibling(span_15, 2);
				var text_52 = child(span_16, true);
				reset(span_16);
				var div_54 = sibling(span_16, 2);
				var node_31 = child(div_54);
				var consequent_34 = ($$anchor) => {
					const commandValue = derived_safe_equal(() => (get(command), untrack(() => Object.values(get(command))[0])));
					var fragment_6 = comment();
					var node_32 = first_child(fragment_6);
					var consequent_33 = ($$anchor) => {
						const moveCall = derived_safe_equal(() => get(commandValue));
						const signature = derived_safe_equal(() => (deep_read_state(get(moveCall)), untrack(() => `${get(moveCall).package}::${get(moveCall).module}::${get(moveCall).function}`)));
						const cleanData = derived_safe_equal(() => (deep_read_state(get(signature)), deep_read_state(get(moveCall)), untrack(() => ({
							function: get(signature),
							typeArguments: get(moveCall).typeArguments,
							arguments: get(moveCall).arguments
						}))));
						var pre_8 = root_32();
						var text_53 = child(pre_8, true);
						reset(pre_8);
						template_effect(($0) => set_text(text_53, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), deep_read_state(get(cleanData)), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(cleanData)))))]);
						append($$anchor, pre_8);
					};
					var alternate_6 = ($$anchor) => {
						var pre_9 = root_32();
						var text_54 = child(pre_9, true);
						reset(pre_9);
						template_effect(($0) => set_text(text_54, $0), [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(commandValue)), untrack(() => formatJsonWithCompactArrays(get(commandValue))))]);
						append($$anchor, pre_9);
					};
					if_block(node_32, ($$render) => {
						if (get(commandValue) && typeof get(commandValue) === "object" && get(commandValue) !== null && "package" in get(commandValue)) $$render(consequent_33);
						else $$render(alternate_6, -1);
					});
					append($$anchor, fragment_6);
				};
				var d_1 = user_derived(() => (get(command), untrack(() => Object.keys(get(command))[0] === "MoveCall")));
				var alternate_7 = ($$anchor) => {
					var pre_10 = root_32();
					var text_55 = child(pre_10, true);
					reset(pre_10);
					template_effect(($0) => set_text(text_55, $0), [() => (deep_read_state(formatJsonWithCompactArrays), get(command), untrack(() => formatJsonWithCompactArrays(Object.values(get(command))[0])))]);
					append($$anchor, pre_10);
				};
				if_block(node_31, ($$render) => {
					if (get(d_1)) $$render(consequent_34);
					else $$render(alternate_7, -1);
				});
				reset(div_54);
				reset(div_53);
				template_effect(($0) => set_text(text_52, $0), [() => (get(command), untrack(() => Object.keys(get(command))[0]))]);
				append($$anchor, div_53);
			});
			reset(div_52);
			reset(div_51);
			template_effect(() => set_text(text_51, `Tx commands (${(deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.transactions.length)) ?? ""}):`));
			append($$anchor, div_51);
		};
		if_block(node_29, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands?.length)) $$render(consequent_32);
			else if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.transactions?.length)) $$render(consequent_35, 1);
		});
		var node_33 = sibling(node_29, 2);
		var consequent_38 = ($$anchor) => {
			var div_55 = root_37();
			var div_56 = sibling(child(div_55), 2);
			each(div_56, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs)), index, ($$anchor, input, index) => {
				var div_57 = root_36();
				var span_17 = child(div_57);
				span_17.textContent = index;
				var span_18 = sibling(span_17, 2);
				var text_56 = child(span_18, true);
				reset(span_18);
				var div_58 = sibling(span_18, 2);
				var pre_11 = child(div_58);
				var text_57 = child(pre_11, true);
				reset(pre_11);
				var node_34 = sibling(pre_11, 2);
				var consequent_37 = ($$anchor) => {
					const decoded = derived_safe_equal(() => (deep_read_state(decodeBase64Bytes), get(input), untrack(() => decodeBase64Bytes(get(input)[get(input).$kind].bytes))));
					var fragment_7 = comment();
					var node_35 = first_child(fragment_7);
					var consequent_36 = ($$anchor) => {
						var div_59 = root_35();
						var div_60 = child(div_59);
						var span_19 = sibling(child(div_60), 2);
						var text_58 = child(span_19, true);
						reset(span_19);
						reset(div_60);
						var div_61 = sibling(div_60, 2);
						var span_20 = child(div_61);
						var text_59 = child(span_20);
						reset(span_20);
						var span_21 = sibling(span_20, 2);
						var text_60 = child(span_21, true);
						reset(span_21);
						reset(div_61);
						var div_62 = sibling(div_61, 2);
						var span_22 = sibling(child(div_62), 2);
						var text_61 = child(span_22);
						reset(span_22);
						reset(div_62);
						reset(div_59);
						template_effect(($0) => {
							set_text(text_58, (deep_read_state(get(decoded)), untrack(() => get(decoded).utf8)));
							set_text(text_59, `${(deep_read_state(get(decoded)), untrack(() => get(decoded).integer.type)) ?? ""}:`);
							set_text(text_60, (deep_read_state(get(decoded)), untrack(() => get(decoded).integer.value)));
							set_text(text_61, `[${$0 ?? ""}]`);
						}, [() => (deep_read_state(get(decoded)), untrack(() => get(decoded).bytes.join(", ")))]);
						append($$anchor, div_59);
					};
					if_block(node_35, ($$render) => {
						if (get(decoded)) $$render(consequent_36);
					});
					append($$anchor, fragment_7);
				};
				if_block(node_34, ($$render) => {
					if (get(input), untrack(() => get(input).$kind === "Pure" && get(input)[get(input).$kind].bytes)) $$render(consequent_37);
				});
				reset(div_58);
				reset(div_57);
				template_effect(($0) => {
					set_text(text_56, (get(input), untrack(() => get(input).$kind)));
					set_text(text_57, $0);
				}, [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(removeKindFields), get(input), untrack(() => formatJsonWithCompactArrays(removeKindFields(get(input))[get(input).$kind])))]);
				append($$anchor, div_57);
			});
			reset(div_56);
			reset(div_55);
			append($$anchor, div_55);
		};
		var consequent_39 = ($$anchor) => {
			var div_63 = root_37();
			var div_64 = sibling(child(div_63), 2);
			each(div_64, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().input.transaction.inputs)), index, ($$anchor, input, index) => {
				const computed_const = derived_safe_equal(() => {
					const { type: _type, ...inputData } = get(input);
					return {
						_type,
						inputData
					};
				});
				var div_65 = root_38();
				var span_23 = child(div_65);
				span_23.textContent = index;
				var span_24 = sibling(span_23, 2);
				var text_62 = child(span_24, true);
				reset(span_24);
				var div_66 = sibling(span_24, 2);
				var pre_12 = child(div_66);
				var text_63 = child(pre_12, true);
				reset(pre_12);
				reset(div_66);
				reset(div_65);
				template_effect(($0) => {
					set_text(text_62, (get(input), untrack(() => get(input).type)));
					set_text(text_63, $0);
				}, [() => (deep_read_state(formatJsonWithCompactArrays), deep_read_state(get(computed_const).inputData), untrack(() => formatJsonWithCompactArrays(get(computed_const).inputData)))]);
				append($$anchor, div_65);
			});
			reset(div_64);
			reset(div_63);
			append($$anchor, div_63);
		};
		if_block(node_33, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs?.length)) $$render(consequent_38);
			else if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.transaction?.inputs?.length)) $$render(consequent_39, 1);
		});
		var node_36 = sibling(node_33, 2);
		var consequent_42 = ($$anchor) => {
			var div_67 = root_41();
			var div_68 = sibling(child(div_67), 2);
			var div_69 = child(div_68);
			var span_25 = sibling(child(div_69), 2);
			var node_37 = child(span_25);
			var consequent_41 = ($$anchor) => {
				var fragment_8 = comment();
				each(first_child(fragment_8), 1, () => (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment)), index, ($$anchor, payment, index) => {
					var fragment_9 = root_40();
					var span_26 = first_child(fragment_9);
					var text_64 = child(span_26);
					reset(span_26);
					var node_39 = sibling(span_26, 2);
					var consequent_40 = ($$anchor) => {
						append($$anchor, root_39());
					};
					if_block(node_39, ($$render) => {
						if (deep_read_state(transactionData()), untrack(() => index < transactionData().decodedBCS.intentMessage.value.V1.gasData.payment.length - 1)) $$render(consequent_40);
					});
					template_effect(() => set_text(text_64, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
					append($$anchor, fragment_9);
				});
				append($$anchor, fragment_8);
			};
			var alternate_8 = ($$anchor) => {
				append($$anchor, text("N/A"));
			};
			if_block(node_37, ($$render) => {
				if (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.payment?.length)) $$render(consequent_41);
				else $$render(alternate_8, -1);
			});
			reset(span_25);
			reset(div_69);
			var div_70 = sibling(div_69, 2);
			var span_28 = sibling(child(div_70), 2);
			var text_66 = child(span_28, true);
			reset(span_28);
			reset(div_70);
			var div_71 = sibling(div_70, 2);
			var span_29 = sibling(child(div_71), 2);
			var text_67 = child(span_29);
			reset(span_29);
			reset(div_71);
			var div_72 = sibling(div_71, 2);
			var span_30 = sibling(child(div_72), 2);
			var text_68 = child(span_30);
			reset(span_30);
			reset(div_72);
			reset(div_68);
			reset(div_67);
			template_effect(($0, $1) => {
				set_text(text_66, (deep_read_state(transactionData()), untrack(() => transactionData().decodedBCS.intentMessage.value.V1.gasData.owner || "N/A")));
				set_text(text_67, `${$0 ?? ""} nanos`);
				set_text(text_68, `${$1 ?? ""} nanos`);
			}, [() => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.price || "0"))), () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().decodedBCS.intentMessage.value.V1.gasData.budget || "0")))]);
			append($$anchor, div_67);
		};
		var consequent_45 = ($$anchor) => {
			var div_73 = root_41();
			var div_74 = sibling(child(div_73), 2);
			var div_75 = child(div_74);
			var span_31 = sibling(child(div_75), 2);
			var node_40 = child(span_31);
			var consequent_44 = ($$anchor) => {
				var fragment_10 = comment();
				each(first_child(fragment_10), 1, () => (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment)), index, ($$anchor, payment, index) => {
					var fragment_11 = root_40();
					var span_32 = first_child(fragment_11);
					var text_69 = child(span_32);
					reset(span_32);
					var node_42 = sibling(span_32, 2);
					var consequent_43 = ($$anchor) => {
						append($$anchor, root_39());
					};
					if_block(node_42, ($$render) => {
						if (deep_read_state(transactionData()), untrack(() => index < transactionData().input.gasData.payment.length - 1)) $$render(consequent_43);
					});
					template_effect(() => set_text(text_69, `${(get(payment), untrack(() => get(payment).objectId)) ?? ""} (v${(get(payment), untrack(() => get(payment).version)) ?? ""})`));
					append($$anchor, fragment_11);
				});
				append($$anchor, fragment_10);
			};
			var alternate_9 = ($$anchor) => {
				append($$anchor, text("N/A"));
			};
			if_block(node_40, ($$render) => {
				if (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.payment?.length)) $$render(consequent_44);
				else $$render(alternate_9, -1);
			});
			reset(span_31);
			reset(div_75);
			var div_76 = sibling(div_75, 2);
			var span_34 = sibling(child(div_76), 2);
			var text_71 = child(span_34, true);
			reset(span_34);
			reset(div_76);
			var div_77 = sibling(div_76, 2);
			var span_35 = sibling(child(div_77), 2);
			var text_72 = child(span_35);
			reset(span_35);
			reset(div_77);
			var div_78 = sibling(div_77, 2);
			var span_36 = sibling(child(div_78), 2);
			var text_73 = child(span_36);
			reset(span_36);
			reset(div_78);
			reset(div_74);
			reset(div_73);
			template_effect(($0, $1) => {
				set_text(text_71, (deep_read_state(transactionData()), untrack(() => transactionData().input.gasData.owner || "N/A")));
				set_text(text_72, `${$0 ?? ""} nanos`);
				set_text(text_73, `${$1 ?? ""} nanos`);
			}, [() => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.price || "0"))), () => (deep_read_state(formatNumberWithUnderscores), deep_read_state(transactionData()), untrack(() => formatNumberWithUnderscores(transactionData().input.gasData.budget || "0")))]);
			append($$anchor, div_73);
		};
		if_block(node_36, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.decodedBCS?.intentMessage?.value?.V1?.gasData)) $$render(consequent_42);
			else if (deep_read_state(transactionData()), untrack(() => transactionData()?.input?.gasData)) $$render(consequent_45, 1);
		});
		var node_43 = sibling(node_36, 2);
		var consequent_53 = ($$anchor) => {
			var div_79 = root_52();
			var span_37 = child(div_79);
			var text_74 = child(span_37);
			reset(span_37);
			var div_80 = sibling(span_37, 2);
			each(div_80, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults)), index, ($$anchor, result, index$2) => {
				var div_81 = root_51();
				var div_82 = child(div_81);
				var span_38 = child(div_82);
				span_38.textContent = `Result #${index$2}`;
				reset(div_82);
				var node_44 = sibling(div_82, 2);
				var consequent_48 = ($$anchor) => {
					var div_83 = root_45();
					var h6 = child(div_83);
					var text_75 = child(h6);
					reset(h6);
					each(sibling(h6, 2), 1, () => (get(result), untrack(() => get(result).mutableReferenceOutputs)), index, ($$anchor, output, outputIndex) => {
						var div_84 = root_44();
						var div_85 = child(div_84);
						var span_39 = child(div_85);
						span_39.textContent = `Output #${outputIndex}`;
						var span_40 = sibling(span_39, 2);
						var text_76 = child(span_40, true);
						reset(span_40);
						reset(div_85);
						var node_46 = sibling(div_85, 2);
						var consequent_46 = ($$anchor) => {
							var div_86 = root_42();
							var div_87 = sibling(child(div_86), 2);
							var text_77 = child(div_87);
							reset(div_87);
							reset(div_86);
							template_effect(($0) => set_text(text_77, `[${$0 ?? ""}]`), [() => (get(output), untrack(() => get(output)[1].join(", ")))]);
							append($$anchor, div_86);
						};
						if_block(node_46, ($$render) => {
							if (get(output), untrack(() => get(output)[1]?.length)) $$render(consequent_46);
						});
						var node_47 = sibling(node_46, 2);
						var consequent_47 = ($$anchor) => {
							var div_88 = root_43();
							var span_41 = sibling(child(div_88), 2);
							var text_78 = child(span_41, true);
							reset(span_41);
							reset(div_88);
							template_effect(() => set_text(text_78, (get(output), untrack(() => get(output)[2]))));
							append($$anchor, div_88);
						};
						if_block(node_47, ($$render) => {
							if (get(output), untrack(() => get(output)[2])) $$render(consequent_47);
						});
						reset(div_84);
						template_effect(() => set_text(text_76, (get(output), untrack(() => get(output)[0]))));
						append($$anchor, div_84);
					});
					reset(div_83);
					template_effect(() => set_text(text_75, `Mutable Reference Outputs (${(get(result), untrack(() => get(result).mutableReferenceOutputs.length)) ?? ""}):`));
					append($$anchor, div_83);
				};
				if_block(node_44, ($$render) => {
					if (get(result), untrack(() => get(result).mutableReferenceOutputs?.length)) $$render(consequent_48);
				});
				var node_48 = sibling(node_44, 2);
				var consequent_51 = ($$anchor) => {
					var div_89 = root_49();
					var h6_1 = child(div_89);
					var text_79 = child(h6_1);
					reset(h6_1);
					each(sibling(h6_1, 2), 1, () => (get(result), untrack(() => get(result).returnValues)), index, ($$anchor, returnValue, returnIndex) => {
						var div_90 = root_48();
						var div_91 = child(div_90);
						var span_42 = child(div_91);
						span_42.textContent = `Value #${returnIndex}`;
						reset(div_91);
						var node_50 = sibling(div_91, 2);
						var consequent_49 = ($$anchor) => {
							var div_92 = root_46();
							var div_93 = sibling(child(div_92), 2);
							var text_80 = child(div_93);
							reset(div_93);
							reset(div_92);
							template_effect(($0) => set_text(text_80, `[${$0 ?? ""}]`), [() => (get(returnValue), untrack(() => get(returnValue)[0].join(", ")))]);
							append($$anchor, div_92);
						};
						if_block(node_50, ($$render) => {
							if (get(returnValue), untrack(() => get(returnValue)[0]?.length)) $$render(consequent_49);
						});
						var node_51 = sibling(node_50, 2);
						var consequent_50 = ($$anchor) => {
							var div_94 = root_47();
							var span_43 = sibling(child(div_94), 2);
							var text_81 = child(span_43, true);
							reset(span_43);
							reset(div_94);
							template_effect(() => set_text(text_81, (get(returnValue), untrack(() => get(returnValue)[1]))));
							append($$anchor, div_94);
						};
						if_block(node_51, ($$render) => {
							if (get(returnValue), untrack(() => get(returnValue)[1])) $$render(consequent_50);
						});
						reset(div_90);
						append($$anchor, div_90);
					});
					reset(div_89);
					template_effect(() => set_text(text_79, `Return Values (${(get(result), untrack(() => get(result).returnValues.length)) ?? ""}):`));
					append($$anchor, div_89);
				};
				if_block(node_48, ($$render) => {
					if (get(result), untrack(() => get(result).returnValues?.length)) $$render(consequent_51);
				});
				var node_52 = sibling(node_48, 2);
				var consequent_52 = ($$anchor) => {
					var div_95 = root_50();
					var details_6 = child(div_95);
					var pre_13 = sibling(child(details_6), 2);
					var text_82 = child(pre_13, true);
					reset(pre_13);
					reset(details_6);
					reset(div_95);
					template_effect(($0) => set_text(text_82, $0), [() => (deep_read_state(formatJsonWithCompactArrays), get(result), untrack(() => formatJsonWithCompactArrays(get(result))))]);
					append($$anchor, div_95);
				};
				var d_2 = user_derived(() => (get(result), untrack(() => Object.keys(get(result)).length > 2 || Object.keys(get(result)).length === 1 && !get(result).mutableReferenceOutputs && !get(result).returnValues)));
				if_block(node_52, ($$render) => {
					if (get(d_2)) $$render(consequent_52);
				});
				reset(div_81);
				append($$anchor, div_81);
			});
			reset(div_80);
			reset(div_79);
			template_effect(() => set_text(text_74, `Dev Inspect Results (${(deep_read_state(transactionData()), untrack(() => transactionData().devInspectResults.length)) ?? ""}):`));
			append($$anchor, div_79);
		};
		if_block(node_43, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.devInspectResults?.length)) $$render(consequent_53);
		});
		var node_53 = sibling(node_43, 2);
		var consequent_54 = ($$anchor) => {
			var div_96 = root_54();
			var span_44 = child(div_96);
			var text_83 = child(span_44);
			reset(span_44);
			var div_97 = sibling(span_44, 2);
			each(div_97, 5, () => (deep_read_state(transactionData()), untrack(() => transactionData().results)), index, ($$anchor, rawResult, index) => {
				var div_98 = root_53();
				var div_99 = child(div_98);
				var span_45 = child(div_99);
				span_45.textContent = `Raw Result #${index}`;
				reset(div_99);
				var div_100 = sibling(div_99, 2);
				var pre_14 = child(div_100);
				var text_84 = child(pre_14, true);
				reset(pre_14);
				reset(div_100);
				reset(div_98);
				template_effect(($0) => set_text(text_84, $0), [() => (deep_read_state(formatJsonWithCompactArrays), get(rawResult), untrack(() => formatJsonWithCompactArrays(get(rawResult))))]);
				append($$anchor, div_98);
			});
			reset(div_97);
			reset(div_96);
			template_effect(() => set_text(text_83, `Raw Results (${(deep_read_state(transactionData()), untrack(() => transactionData().results.length)) ?? ""}):`));
			append($$anchor, div_96);
		};
		if_block(node_53, ($$render) => {
			if (deep_read_state(transactionData()), untrack(() => transactionData()?.results?.length)) $$render(consequent_54);
		});
		template_effect(($0, $1, $2) => {
			set_attribute(a, "href", $0);
			set_attribute(a, "title", (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
			set_text(text$3, (deep_read_state(transactionData()), untrack(() => transactionData()?.digest)));
			set_style(span, `color: ${$1 ?? ""}`);
			set_text(text_1, $2);
		}, [
			() => (deep_read_state(transactionData()), deep_read_state(getTransactionLink), deep_read_state(getSelectedNetworkConfig), untrack(() => transactionData()?.digest ? getTransactionLink(getSelectedNetworkConfig(), transactionData().digest) : "#")),
			() => (get(effects), untrack(() => getStatusColor(get(effects).status))),
			() => (get(effects), untrack(() => getStatusString(get(effects).status)))
		]);
		append($$anchor, fragment);
	};
	var consequent_56 = ($$anchor) => {
		append($$anchor, root_56());
	};
	if_block(node, ($$render) => {
		if (get(effects)) $$render(consequent_55);
		else if (!get(hasValidData)) $$render(consequent_56, 1);
	});
	reset(div);
	append($$anchor, div);
	pop();
}
//#endregion
//#region node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js
var require_base64_js = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray;
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
	var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	for (var i = 0, len = code.length; i < len; ++i) {
		lookup[i] = code[i];
		revLookup[code.charCodeAt(i)] = i;
	}
	revLookup["-".charCodeAt(0)] = 62;
	revLookup["_".charCodeAt(0)] = 63;
	function getLens(b64) {
		var len = b64.length;
		if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
		var validLen = b64.indexOf("=");
		if (validLen === -1) validLen = len;
		var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
		return [validLen, placeHoldersLen];
	}
	function byteLength(b64) {
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function _byteLength(b64, validLen, placeHoldersLen) {
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function toByteArray(b64) {
		var tmp;
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
		var curByte = 0;
		var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
		var i;
		for (i = 0; i < len; i += 4) {
			tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
			arr[curByte++] = tmp >> 16 & 255;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 2) {
			tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 1) {
			tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		return arr;
	}
	function tripletToBase64(num) {
		return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
	}
	function encodeChunk(uint8, start, end) {
		var tmp;
		var output = [];
		for (var i = start; i < end; i += 3) {
			tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
			output.push(tripletToBase64(tmp));
		}
		return output.join("");
	}
	function fromByteArray(uint8) {
		var tmp;
		var len = uint8.length;
		var extraBytes = len % 3;
		var parts = [];
		var maxChunkLength = 16383;
		for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
		if (extraBytes === 1) {
			tmp = uint8[len - 1];
			parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
		} else if (extraBytes === 2) {
			tmp = (uint8[len - 2] << 8) + uint8[len - 1];
			parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
		}
		return parts.join("");
	}
}));
//#endregion
//#region node_modules/.pnpm/ieee754@1.2.1/node_modules/ieee754/index.js
var require_ieee754 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
		var e, m;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var nBits = -7;
		var i = isLE ? nBytes - 1 : 0;
		var d = isLE ? -1 : 1;
		var s = buffer[offset + i];
		i += d;
		e = s & (1 << -nBits) - 1;
		s >>= -nBits;
		nBits += eLen;
		for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
		m = e & (1 << -nBits) - 1;
		e >>= -nBits;
		nBits += mLen;
		for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
		if (e === 0) e = 1 - eBias;
		else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
		else {
			m = m + Math.pow(2, mLen);
			e = e - eBias;
		}
		return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};
	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
		var e, m, c;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
		var i = isLE ? 0 : nBytes - 1;
		var d = isLE ? 1 : -1;
		var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
		value = Math.abs(value);
		if (isNaN(value) || value === Infinity) {
			m = isNaN(value) ? 1 : 0;
			e = eMax;
		} else {
			e = Math.floor(Math.log(value) / Math.LN2);
			if (value * (c = Math.pow(2, -e)) < 1) {
				e--;
				c *= 2;
			}
			if (e + eBias >= 1) value += rt / c;
			else value += rt * Math.pow(2, 1 - eBias);
			if (value * c >= 2) {
				e++;
				c /= 2;
			}
			if (e + eBias >= eMax) {
				m = 0;
				e = eMax;
			} else if (e + eBias >= 1) {
				m = (value * c - 1) * Math.pow(2, mLen);
				e = e + eBias;
			} else {
				m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
				e = 0;
			}
		}
		for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8);
		e = e << mLen | m;
		eLen += mLen;
		for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8);
		buffer[offset + i - d] |= s * 128;
	};
}));
//#endregion
//#region node_modules/.pnpm/buffer@6.0.3/node_modules/buffer/index.js
/*!
* The buffer module from node.js, for the browser.
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
var require_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64 = require_base64_js();
	var ieee754 = require_ieee754();
	var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	var K_MAX_LENGTH = 2147483647;
	exports.kMaxLength = K_MAX_LENGTH;
	/**
	* If `Buffer.TYPED_ARRAY_SUPPORT`:
	*   === true    Use Uint8Array implementation (fastest)
	*   === false   Print warning and recommend using `buffer` v4.x which has an Object
	*               implementation (most compatible, even IE6)
	*
	* Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	* Opera 11.6+, iOS 4.2+.
	*
	* We report that the browser does not support typed arrays if the are not subclassable
	* using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	* (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	* for __proto__ and has a buggy typed array implementation.
	*/
	Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
	if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
	function typedArraySupport() {
		try {
			const arr = /* @__PURE__ */ new Uint8Array(1);
			const proto = { foo: function() {
				return 42;
			} };
			Object.setPrototypeOf(proto, Uint8Array.prototype);
			Object.setPrototypeOf(arr, proto);
			return arr.foo() === 42;
		} catch (e) {
			return false;
		}
	}
	Object.defineProperty(Buffer.prototype, "parent", {
		enumerable: true,
		get: function() {
			if (!Buffer.isBuffer(this)) return void 0;
			return this.buffer;
		}
	});
	Object.defineProperty(Buffer.prototype, "offset", {
		enumerable: true,
		get: function() {
			if (!Buffer.isBuffer(this)) return void 0;
			return this.byteOffset;
		}
	});
	function createBuffer(length) {
		if (length > K_MAX_LENGTH) throw new RangeError("The value \"" + length + "\" is invalid for option \"size\"");
		const buf = new Uint8Array(length);
		Object.setPrototypeOf(buf, Buffer.prototype);
		return buf;
	}
	/**
	* The Buffer constructor returns instances of `Uint8Array` that have their
	* prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	* `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	* and the `Uint8Array` methods. Square bracket notation works as expected -- it
	* returns a single octet.
	*
	* The `Uint8Array` prototype remains unmodified.
	*/
	function Buffer(arg, encodingOrOffset, length) {
		if (typeof arg === "number") {
			if (typeof encodingOrOffset === "string") throw new TypeError("The \"string\" argument must be of type string. Received type number");
			return allocUnsafe(arg);
		}
		return from(arg, encodingOrOffset, length);
	}
	Buffer.poolSize = 8192;
	function from(value, encodingOrOffset, length) {
		if (typeof value === "string") return fromString(value, encodingOrOffset);
		if (ArrayBuffer.isView(value)) return fromArrayView(value);
		if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
		if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
		if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
		if (typeof value === "number") throw new TypeError("The \"value\" argument must not be of type number. Received type number");
		const valueOf = value.valueOf && value.valueOf();
		if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
		const b = fromObject(value);
		if (b) return b;
		if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
		throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
	}
	/**
	* Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	* if value is a number.
	* Buffer.from(str[, encoding])
	* Buffer.from(array)
	* Buffer.from(buffer)
	* Buffer.from(arrayBuffer[, byteOffset[, length]])
	**/
	Buffer.from = function(value, encodingOrOffset, length) {
		return from(value, encodingOrOffset, length);
	};
	Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
	Object.setPrototypeOf(Buffer, Uint8Array);
	function assertSize(size) {
		if (typeof size !== "number") throw new TypeError("\"size\" argument must be of type number");
		else if (size < 0) throw new RangeError("The value \"" + size + "\" is invalid for option \"size\"");
	}
	function alloc(size, fill, encoding) {
		assertSize(size);
		if (size <= 0) return createBuffer(size);
		if (fill !== void 0) return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
		return createBuffer(size);
	}
	/**
	* Creates a new filled Buffer instance.
	* alloc(size[, fill[, encoding]])
	**/
	Buffer.alloc = function(size, fill, encoding) {
		return alloc(size, fill, encoding);
	};
	function allocUnsafe(size) {
		assertSize(size);
		return createBuffer(size < 0 ? 0 : checked(size) | 0);
	}
	/**
	* Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	* */
	Buffer.allocUnsafe = function(size) {
		return allocUnsafe(size);
	};
	/**
	* Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	*/
	Buffer.allocUnsafeSlow = function(size) {
		return allocUnsafe(size);
	};
	function fromString(string, encoding) {
		if (typeof encoding !== "string" || encoding === "") encoding = "utf8";
		if (!Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
		const length = byteLength(string, encoding) | 0;
		let buf = createBuffer(length);
		const actual = buf.write(string, encoding);
		if (actual !== length) buf = buf.slice(0, actual);
		return buf;
	}
	function fromArrayLike(array) {
		const length = array.length < 0 ? 0 : checked(array.length) | 0;
		const buf = createBuffer(length);
		for (let i = 0; i < length; i += 1) buf[i] = array[i] & 255;
		return buf;
	}
	function fromArrayView(arrayView) {
		if (isInstance(arrayView, Uint8Array)) {
			const copy = new Uint8Array(arrayView);
			return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
		}
		return fromArrayLike(arrayView);
	}
	function fromArrayBuffer(array, byteOffset, length) {
		if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("\"offset\" is outside of buffer bounds");
		if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("\"length\" is outside of buffer bounds");
		let buf;
		if (byteOffset === void 0 && length === void 0) buf = new Uint8Array(array);
		else if (length === void 0) buf = new Uint8Array(array, byteOffset);
		else buf = new Uint8Array(array, byteOffset, length);
		Object.setPrototypeOf(buf, Buffer.prototype);
		return buf;
	}
	function fromObject(obj) {
		if (Buffer.isBuffer(obj)) {
			const len = checked(obj.length) | 0;
			const buf = createBuffer(len);
			if (buf.length === 0) return buf;
			obj.copy(buf, 0, 0, len);
			return buf;
		}
		if (obj.length !== void 0) {
			if (typeof obj.length !== "number" || numberIsNaN(obj.length)) return createBuffer(0);
			return fromArrayLike(obj);
		}
		if (obj.type === "Buffer" && Array.isArray(obj.data)) return fromArrayLike(obj.data);
	}
	function checked(length) {
		if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
		return length | 0;
	}
	function SlowBuffer(length) {
		if (+length != length) length = 0;
		return Buffer.alloc(+length);
	}
	Buffer.isBuffer = function isBuffer(b) {
		return b != null && b._isBuffer === true && b !== Buffer.prototype;
	};
	Buffer.compare = function compare(a, b) {
		if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
		if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
		if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("The \"buf1\", \"buf2\" arguments must be one of type Buffer or Uint8Array");
		if (a === b) return 0;
		let x = a.length;
		let y = b.length;
		for (let i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
			x = a[i];
			y = b[i];
			break;
		}
		if (x < y) return -1;
		if (y < x) return 1;
		return 0;
	};
	Buffer.isEncoding = function isEncoding(encoding) {
		switch (String(encoding).toLowerCase()) {
			case "hex":
			case "utf8":
			case "utf-8":
			case "ascii":
			case "latin1":
			case "binary":
			case "base64":
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le": return true;
			default: return false;
		}
	};
	Buffer.concat = function concat(list, length) {
		if (!Array.isArray(list)) throw new TypeError("\"list\" argument must be an Array of Buffers");
		if (list.length === 0) return Buffer.alloc(0);
		let i;
		if (length === void 0) {
			length = 0;
			for (i = 0; i < list.length; ++i) length += list[i].length;
		}
		const buffer = Buffer.allocUnsafe(length);
		let pos = 0;
		for (i = 0; i < list.length; ++i) {
			let buf = list[i];
			if (isInstance(buf, Uint8Array)) if (pos + buf.length > buffer.length) {
				if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
				buf.copy(buffer, pos);
			} else Uint8Array.prototype.set.call(buffer, buf, pos);
			else if (!Buffer.isBuffer(buf)) throw new TypeError("\"list\" argument must be an Array of Buffers");
			else buf.copy(buffer, pos);
			pos += buf.length;
		}
		return buffer;
	};
	function byteLength(string, encoding) {
		if (Buffer.isBuffer(string)) return string.length;
		if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
		if (typeof string !== "string") throw new TypeError("The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type " + typeof string);
		const len = string.length;
		const mustMatch = arguments.length > 2 && arguments[2] === true;
		if (!mustMatch && len === 0) return 0;
		let loweredCase = false;
		for (;;) switch (encoding) {
			case "ascii":
			case "latin1":
			case "binary": return len;
			case "utf8":
			case "utf-8": return utf8ToBytes(string).length;
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le": return len * 2;
			case "hex": return len >>> 1;
			case "base64": return base64ToBytes(string).length;
			default:
				if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length;
				encoding = ("" + encoding).toLowerCase();
				loweredCase = true;
		}
	}
	Buffer.byteLength = byteLength;
	function slowToString(encoding, start, end) {
		let loweredCase = false;
		if (start === void 0 || start < 0) start = 0;
		if (start > this.length) return "";
		if (end === void 0 || end > this.length) end = this.length;
		if (end <= 0) return "";
		end >>>= 0;
		start >>>= 0;
		if (end <= start) return "";
		if (!encoding) encoding = "utf8";
		while (true) switch (encoding) {
			case "hex": return hexSlice(this, start, end);
			case "utf8":
			case "utf-8": return utf8Slice(this, start, end);
			case "ascii": return asciiSlice(this, start, end);
			case "latin1":
			case "binary": return latin1Slice(this, start, end);
			case "base64": return base64Slice(this, start, end);
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le": return utf16leSlice(this, start, end);
			default:
				if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
				encoding = (encoding + "").toLowerCase();
				loweredCase = true;
		}
	}
	Buffer.prototype._isBuffer = true;
	function swap(b, n, m) {
		const i = b[n];
		b[n] = b[m];
		b[m] = i;
	}
	Buffer.prototype.swap16 = function swap16() {
		const len = this.length;
		if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
		for (let i = 0; i < len; i += 2) swap(this, i, i + 1);
		return this;
	};
	Buffer.prototype.swap32 = function swap32() {
		const len = this.length;
		if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
		for (let i = 0; i < len; i += 4) {
			swap(this, i, i + 3);
			swap(this, i + 1, i + 2);
		}
		return this;
	};
	Buffer.prototype.swap64 = function swap64() {
		const len = this.length;
		if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
		for (let i = 0; i < len; i += 8) {
			swap(this, i, i + 7);
			swap(this, i + 1, i + 6);
			swap(this, i + 2, i + 5);
			swap(this, i + 3, i + 4);
		}
		return this;
	};
	Buffer.prototype.toString = function toString() {
		const length = this.length;
		if (length === 0) return "";
		if (arguments.length === 0) return utf8Slice(this, 0, length);
		return slowToString.apply(this, arguments);
	};
	Buffer.prototype.toLocaleString = Buffer.prototype.toString;
	Buffer.prototype.equals = function equals(b) {
		if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
		if (this === b) return true;
		return Buffer.compare(this, b) === 0;
	};
	Buffer.prototype.inspect = function inspect() {
		let str = "";
		const max = exports.INSPECT_MAX_BYTES;
		str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
		if (this.length > max) str += " ... ";
		return "<Buffer " + str + ">";
	};
	if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
	Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
		if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
		if (!Buffer.isBuffer(target)) throw new TypeError("The \"target\" argument must be one of type Buffer or Uint8Array. Received type " + typeof target);
		if (start === void 0) start = 0;
		if (end === void 0) end = target ? target.length : 0;
		if (thisStart === void 0) thisStart = 0;
		if (thisEnd === void 0) thisEnd = this.length;
		if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
		if (thisStart >= thisEnd && start >= end) return 0;
		if (thisStart >= thisEnd) return -1;
		if (start >= end) return 1;
		start >>>= 0;
		end >>>= 0;
		thisStart >>>= 0;
		thisEnd >>>= 0;
		if (this === target) return 0;
		let x = thisEnd - thisStart;
		let y = end - start;
		const len = Math.min(x, y);
		const thisCopy = this.slice(thisStart, thisEnd);
		const targetCopy = target.slice(start, end);
		for (let i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
			x = thisCopy[i];
			y = targetCopy[i];
			break;
		}
		if (x < y) return -1;
		if (y < x) return 1;
		return 0;
	};
	function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
		if (buffer.length === 0) return -1;
		if (typeof byteOffset === "string") {
			encoding = byteOffset;
			byteOffset = 0;
		} else if (byteOffset > 2147483647) byteOffset = 2147483647;
		else if (byteOffset < -2147483648) byteOffset = -2147483648;
		byteOffset = +byteOffset;
		if (numberIsNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1;
		if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
		if (byteOffset >= buffer.length) if (dir) return -1;
		else byteOffset = buffer.length - 1;
		else if (byteOffset < 0) if (dir) byteOffset = 0;
		else return -1;
		if (typeof val === "string") val = Buffer.from(val, encoding);
		if (Buffer.isBuffer(val)) {
			if (val.length === 0) return -1;
			return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
		} else if (typeof val === "number") {
			val = val & 255;
			if (typeof Uint8Array.prototype.indexOf === "function") if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
			else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
			return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
		}
		throw new TypeError("val must be string, number or Buffer");
	}
	function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
		let indexSize = 1;
		let arrLength = arr.length;
		let valLength = val.length;
		if (encoding !== void 0) {
			encoding = String(encoding).toLowerCase();
			if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
				if (arr.length < 2 || val.length < 2) return -1;
				indexSize = 2;
				arrLength /= 2;
				valLength /= 2;
				byteOffset /= 2;
			}
		}
		function read(buf, i) {
			if (indexSize === 1) return buf[i];
			else return buf.readUInt16BE(i * indexSize);
		}
		let i;
		if (dir) {
			let foundIndex = -1;
			for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
				if (foundIndex === -1) foundIndex = i;
				if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
			} else {
				if (foundIndex !== -1) i -= i - foundIndex;
				foundIndex = -1;
			}
		} else {
			if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
			for (i = byteOffset; i >= 0; i--) {
				let found = true;
				for (let j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
					found = false;
					break;
				}
				if (found) return i;
			}
		}
		return -1;
	}
	Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
		return this.indexOf(val, byteOffset, encoding) !== -1;
	};
	Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
		return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
	};
	Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
		return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
	};
	function hexWrite(buf, string, offset, length) {
		offset = Number(offset) || 0;
		const remaining = buf.length - offset;
		if (!length) length = remaining;
		else {
			length = Number(length);
			if (length > remaining) length = remaining;
		}
		const strLen = string.length;
		if (length > strLen / 2) length = strLen / 2;
		let i;
		for (i = 0; i < length; ++i) {
			const parsed = parseInt(string.substr(i * 2, 2), 16);
			if (numberIsNaN(parsed)) return i;
			buf[offset + i] = parsed;
		}
		return i;
	}
	function utf8Write(buf, string, offset, length) {
		return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}
	function asciiWrite(buf, string, offset, length) {
		return blitBuffer(asciiToBytes(string), buf, offset, length);
	}
	function base64Write(buf, string, offset, length) {
		return blitBuffer(base64ToBytes(string), buf, offset, length);
	}
	function ucs2Write(buf, string, offset, length) {
		return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}
	Buffer.prototype.write = function write(string, offset, length, encoding) {
		if (offset === void 0) {
			encoding = "utf8";
			length = this.length;
			offset = 0;
		} else if (length === void 0 && typeof offset === "string") {
			encoding = offset;
			length = this.length;
			offset = 0;
		} else if (isFinite(offset)) {
			offset = offset >>> 0;
			if (isFinite(length)) {
				length = length >>> 0;
				if (encoding === void 0) encoding = "utf8";
			} else {
				encoding = length;
				length = void 0;
			}
		} else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
		const remaining = this.length - offset;
		if (length === void 0 || length > remaining) length = remaining;
		if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
		if (!encoding) encoding = "utf8";
		let loweredCase = false;
		for (;;) switch (encoding) {
			case "hex": return hexWrite(this, string, offset, length);
			case "utf8":
			case "utf-8": return utf8Write(this, string, offset, length);
			case "ascii":
			case "latin1":
			case "binary": return asciiWrite(this, string, offset, length);
			case "base64": return base64Write(this, string, offset, length);
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le": return ucs2Write(this, string, offset, length);
			default:
				if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
				encoding = ("" + encoding).toLowerCase();
				loweredCase = true;
		}
	};
	Buffer.prototype.toJSON = function toJSON() {
		return {
			type: "Buffer",
			data: Array.prototype.slice.call(this._arr || this, 0)
		};
	};
	function base64Slice(buf, start, end) {
		if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
		else return base64.fromByteArray(buf.slice(start, end));
	}
	function utf8Slice(buf, start, end) {
		end = Math.min(buf.length, end);
		const res = [];
		let i = start;
		while (i < end) {
			const firstByte = buf[i];
			let codePoint = null;
			let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
			if (i + bytesPerSequence <= end) {
				let secondByte, thirdByte, fourthByte, tempCodePoint;
				switch (bytesPerSequence) {
					case 1:
						if (firstByte < 128) codePoint = firstByte;
						break;
					case 2:
						secondByte = buf[i + 1];
						if ((secondByte & 192) === 128) {
							tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
							if (tempCodePoint > 127) codePoint = tempCodePoint;
						}
						break;
					case 3:
						secondByte = buf[i + 1];
						thirdByte = buf[i + 2];
						if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
							tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
							if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) codePoint = tempCodePoint;
						}
						break;
					case 4:
						secondByte = buf[i + 1];
						thirdByte = buf[i + 2];
						fourthByte = buf[i + 3];
						if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
							tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
							if (tempCodePoint > 65535 && tempCodePoint < 1114112) codePoint = tempCodePoint;
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
			i += bytesPerSequence;
		}
		return decodeCodePointsArray(res);
	}
	var MAX_ARGUMENTS_LENGTH = 4096;
	function decodeCodePointsArray(codePoints) {
		const len = codePoints.length;
		if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
		let res = "";
		let i = 0;
		while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
		return res;
	}
	function asciiSlice(buf, start, end) {
		let ret = "";
		end = Math.min(buf.length, end);
		for (let i = start; i < end; ++i) ret += String.fromCharCode(buf[i] & 127);
		return ret;
	}
	function latin1Slice(buf, start, end) {
		let ret = "";
		end = Math.min(buf.length, end);
		for (let i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
		return ret;
	}
	function hexSlice(buf, start, end) {
		const len = buf.length;
		if (!start || start < 0) start = 0;
		if (!end || end < 0 || end > len) end = len;
		let out = "";
		for (let i = start; i < end; ++i) out += hexSliceLookupTable[buf[i]];
		return out;
	}
	function utf16leSlice(buf, start, end) {
		const bytes = buf.slice(start, end);
		let res = "";
		for (let i = 0; i < bytes.length - 1; i += 2) res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
		return res;
	}
	Buffer.prototype.slice = function slice(start, end) {
		const len = this.length;
		start = ~~start;
		end = end === void 0 ? len : ~~end;
		if (start < 0) {
			start += len;
			if (start < 0) start = 0;
		} else if (start > len) start = len;
		if (end < 0) {
			end += len;
			if (end < 0) end = 0;
		} else if (end > len) end = len;
		if (end < start) end = start;
		const newBuf = this.subarray(start, end);
		Object.setPrototypeOf(newBuf, Buffer.prototype);
		return newBuf;
	};
	function checkOffset(offset, ext, length) {
		if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
		if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
	}
	Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) checkOffset(offset, byteLength, this.length);
		let val = this[offset];
		let mul = 1;
		let i = 0;
		while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
		return val;
	};
	Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) checkOffset(offset, byteLength, this.length);
		let val = this[offset + --byteLength];
		let mul = 1;
		while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
		return val;
	};
	Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 1, this.length);
		return this[offset];
	};
	Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 2, this.length);
		return this[offset] | this[offset + 1] << 8;
	};
	Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 2, this.length);
		return this[offset] << 8 | this[offset + 1];
	};
	Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
	};
	Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};
	Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
		offset = offset >>> 0;
		validateNumber(offset, "offset");
		const first = this[offset];
		const last = this[offset + 7];
		if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
		const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
		const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
		return BigInt(lo) + (BigInt(hi) << BigInt(32));
	});
	Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
		offset = offset >>> 0;
		validateNumber(offset, "offset");
		const first = this[offset];
		const last = this[offset + 7];
		if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
		const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
		const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
		return (BigInt(hi) << BigInt(32)) + BigInt(lo);
	});
	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) checkOffset(offset, byteLength, this.length);
		let val = this[offset];
		let mul = 1;
		let i = 0;
		while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
		mul *= 128;
		if (val >= mul) val -= Math.pow(2, 8 * byteLength);
		return val;
	};
	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) checkOffset(offset, byteLength, this.length);
		let i = byteLength;
		let mul = 1;
		let val = this[offset + --i];
		while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
		mul *= 128;
		if (val >= mul) val -= Math.pow(2, 8 * byteLength);
		return val;
	};
	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 1, this.length);
		if (!(this[offset] & 128)) return this[offset];
		return (255 - this[offset] + 1) * -1;
	};
	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 2, this.length);
		const val = this[offset] | this[offset + 1] << 8;
		return val & 32768 ? val | 4294901760 : val;
	};
	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 2, this.length);
		const val = this[offset + 1] | this[offset] << 8;
		return val & 32768 ? val | 4294901760 : val;
	};
	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};
	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};
	Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
		offset = offset >>> 0;
		validateNumber(offset, "offset");
		const first = this[offset];
		const last = this[offset + 7];
		if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
		const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
		return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
	});
	Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
		offset = offset >>> 0;
		validateNumber(offset, "offset");
		const first = this[offset];
		const last = this[offset + 7];
		if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
		const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
		return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
	});
	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return ieee754.read(this, offset, true, 23, 4);
	};
	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 4, this.length);
		return ieee754.read(this, offset, false, 23, 4);
	};
	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 8, this.length);
		return ieee754.read(this, offset, true, 52, 8);
	};
	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
		offset = offset >>> 0;
		if (!noAssert) checkOffset(offset, 8, this.length);
		return ieee754.read(this, offset, false, 52, 8);
	};
	function checkInt(buf, value, offset, ext, max, min) {
		if (!Buffer.isBuffer(buf)) throw new TypeError("\"buffer\" argument must be a Buffer instance");
		if (value > max || value < min) throw new RangeError("\"value\" argument is out of bounds");
		if (offset + ext > buf.length) throw new RangeError("Index out of range");
	}
	Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
		value = +value;
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) {
			const maxBytes = Math.pow(2, 8 * byteLength) - 1;
			checkInt(this, value, offset, byteLength, maxBytes, 0);
		}
		let mul = 1;
		let i = 0;
		this[offset] = value & 255;
		while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
		return offset + byteLength;
	};
	Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
		value = +value;
		offset = offset >>> 0;
		byteLength = byteLength >>> 0;
		if (!noAssert) {
			const maxBytes = Math.pow(2, 8 * byteLength) - 1;
			checkInt(this, value, offset, byteLength, maxBytes, 0);
		}
		let i = byteLength - 1;
		let mul = 1;
		this[offset + i] = value & 255;
		while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
		return offset + byteLength;
	};
	Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
		this[offset] = value & 255;
		return offset + 1;
	};
	Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
		this[offset] = value & 255;
		this[offset + 1] = value >>> 8;
		return offset + 2;
	};
	Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
		this[offset] = value >>> 8;
		this[offset + 1] = value & 255;
		return offset + 2;
	};
	Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
		this[offset + 3] = value >>> 24;
		this[offset + 2] = value >>> 16;
		this[offset + 1] = value >>> 8;
		this[offset] = value & 255;
		return offset + 4;
	};
	Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
		this[offset] = value >>> 24;
		this[offset + 1] = value >>> 16;
		this[offset + 2] = value >>> 8;
		this[offset + 3] = value & 255;
		return offset + 4;
	};
	function wrtBigUInt64LE(buf, value, offset, min, max) {
		checkIntBI(value, min, max, buf, offset, 7);
		let lo = Number(value & BigInt(4294967295));
		buf[offset++] = lo;
		lo = lo >> 8;
		buf[offset++] = lo;
		lo = lo >> 8;
		buf[offset++] = lo;
		lo = lo >> 8;
		buf[offset++] = lo;
		let hi = Number(value >> BigInt(32) & BigInt(4294967295));
		buf[offset++] = hi;
		hi = hi >> 8;
		buf[offset++] = hi;
		hi = hi >> 8;
		buf[offset++] = hi;
		hi = hi >> 8;
		buf[offset++] = hi;
		return offset;
	}
	function wrtBigUInt64BE(buf, value, offset, min, max) {
		checkIntBI(value, min, max, buf, offset, 7);
		let lo = Number(value & BigInt(4294967295));
		buf[offset + 7] = lo;
		lo = lo >> 8;
		buf[offset + 6] = lo;
		lo = lo >> 8;
		buf[offset + 5] = lo;
		lo = lo >> 8;
		buf[offset + 4] = lo;
		let hi = Number(value >> BigInt(32) & BigInt(4294967295));
		buf[offset + 3] = hi;
		hi = hi >> 8;
		buf[offset + 2] = hi;
		hi = hi >> 8;
		buf[offset + 1] = hi;
		hi = hi >> 8;
		buf[offset] = hi;
		return offset + 8;
	}
	Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
		return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
	});
	Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
		return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
	});
	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) {
			const limit = Math.pow(2, 8 * byteLength - 1);
			checkInt(this, value, offset, byteLength, limit - 1, -limit);
		}
		let i = 0;
		let mul = 1;
		let sub = 0;
		this[offset] = value & 255;
		while (++i < byteLength && (mul *= 256)) {
			if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
			this[offset + i] = (value / mul >> 0) - sub & 255;
		}
		return offset + byteLength;
	};
	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) {
			const limit = Math.pow(2, 8 * byteLength - 1);
			checkInt(this, value, offset, byteLength, limit - 1, -limit);
		}
		let i = byteLength - 1;
		let mul = 1;
		let sub = 0;
		this[offset + i] = value & 255;
		while (--i >= 0 && (mul *= 256)) {
			if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
			this[offset + i] = (value / mul >> 0) - sub & 255;
		}
		return offset + byteLength;
	};
	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
		if (value < 0) value = 255 + value + 1;
		this[offset] = value & 255;
		return offset + 1;
	};
	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
		this[offset] = value & 255;
		this[offset + 1] = value >>> 8;
		return offset + 2;
	};
	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
		this[offset] = value >>> 8;
		this[offset + 1] = value & 255;
		return offset + 2;
	};
	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
		this[offset] = value & 255;
		this[offset + 1] = value >>> 8;
		this[offset + 2] = value >>> 16;
		this[offset + 3] = value >>> 24;
		return offset + 4;
	};
	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
		if (value < 0) value = 4294967295 + value + 1;
		this[offset] = value >>> 24;
		this[offset + 1] = value >>> 16;
		this[offset + 2] = value >>> 8;
		this[offset + 3] = value & 255;
		return offset + 4;
	};
	Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
		return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
	});
	Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
		return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
	});
	function checkIEEE754(buf, value, offset, ext, max, min) {
		if (offset + ext > buf.length) throw new RangeError("Index out of range");
		if (offset < 0) throw new RangeError("Index out of range");
	}
	function writeFloat(buf, value, offset, littleEndian, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
		ieee754.write(buf, value, offset, littleEndian, 23, 4);
		return offset + 4;
	}
	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
		return writeFloat(this, value, offset, true, noAssert);
	};
	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
		return writeFloat(this, value, offset, false, noAssert);
	};
	function writeDouble(buf, value, offset, littleEndian, noAssert) {
		value = +value;
		offset = offset >>> 0;
		if (!noAssert) checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
		ieee754.write(buf, value, offset, littleEndian, 52, 8);
		return offset + 8;
	}
	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
		return writeDouble(this, value, offset, true, noAssert);
	};
	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
		return writeDouble(this, value, offset, false, noAssert);
	};
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
		if (!Buffer.isBuffer(target)) throw new TypeError("argument should be a Buffer");
		if (!start) start = 0;
		if (!end && end !== 0) end = this.length;
		if (targetStart >= target.length) targetStart = target.length;
		if (!targetStart) targetStart = 0;
		if (end > 0 && end < start) end = start;
		if (end === start) return 0;
		if (target.length === 0 || this.length === 0) return 0;
		if (targetStart < 0) throw new RangeError("targetStart out of bounds");
		if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
		if (end < 0) throw new RangeError("sourceEnd out of bounds");
		if (end > this.length) end = this.length;
		if (target.length - targetStart < end - start) end = target.length - targetStart + start;
		const len = end - start;
		if (this === target && typeof Uint8Array.prototype.copyWithin === "function") this.copyWithin(targetStart, start, end);
		else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
		return len;
	};
	Buffer.prototype.fill = function fill(val, start, end, encoding) {
		if (typeof val === "string") {
			if (typeof start === "string") {
				encoding = start;
				start = 0;
				end = this.length;
			} else if (typeof end === "string") {
				encoding = end;
				end = this.length;
			}
			if (encoding !== void 0 && typeof encoding !== "string") throw new TypeError("encoding must be a string");
			if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
			if (val.length === 1) {
				const code = val.charCodeAt(0);
				if (encoding === "utf8" && code < 128 || encoding === "latin1") val = code;
			}
		} else if (typeof val === "number") val = val & 255;
		else if (typeof val === "boolean") val = Number(val);
		if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
		if (end <= start) return this;
		start = start >>> 0;
		end = end === void 0 ? this.length : end >>> 0;
		if (!val) val = 0;
		let i;
		if (typeof val === "number") for (i = start; i < end; ++i) this[i] = val;
		else {
			const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
			const len = bytes.length;
			if (len === 0) throw new TypeError("The value \"" + val + "\" is invalid for argument \"value\"");
			for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
		}
		return this;
	};
	var errors = {};
	function E(sym, getMessage, Base) {
		errors[sym] = class NodeError extends Base {
			constructor() {
				super();
				Object.defineProperty(this, "message", {
					value: getMessage.apply(this, arguments),
					writable: true,
					configurable: true
				});
				this.name = `${this.name} [${sym}]`;
				this.stack;
				delete this.name;
			}
			get code() {
				return sym;
			}
			set code(value) {
				Object.defineProperty(this, "code", {
					configurable: true,
					enumerable: true,
					value,
					writable: true
				});
			}
			toString() {
				return `${this.name} [${sym}]: ${this.message}`;
			}
		};
	}
	E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
		if (name) return `${name} is outside of buffer bounds`;
		return "Attempt to access memory outside buffer bounds";
	}, RangeError);
	E("ERR_INVALID_ARG_TYPE", function(name, actual) {
		return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
	}, TypeError);
	E("ERR_OUT_OF_RANGE", function(str, range, input) {
		let msg = `The value of "${str}" is out of range.`;
		let received = input;
		if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) received = addNumericalSeparator(String(input));
		else if (typeof input === "bigint") {
			received = String(input);
			if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) received = addNumericalSeparator(received);
			received += "n";
		}
		msg += ` It must be ${range}. Received ${received}`;
		return msg;
	}, RangeError);
	function addNumericalSeparator(val) {
		let res = "";
		let i = val.length;
		const start = val[0] === "-" ? 1 : 0;
		for (; i >= start + 4; i -= 3) res = `_${val.slice(i - 3, i)}${res}`;
		return `${val.slice(0, i)}${res}`;
	}
	function checkBounds(buf, offset, byteLength) {
		validateNumber(offset, "offset");
		if (buf[offset] === void 0 || buf[offset + byteLength] === void 0) boundsError(offset, buf.length - (byteLength + 1));
	}
	function checkIntBI(value, min, max, buf, offset, byteLength) {
		if (value > max || value < min) {
			const n = typeof min === "bigint" ? "n" : "";
			let range;
			if (byteLength > 3) if (min === 0 || min === BigInt(0)) range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
			else range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength + 1) * 8 - 1}${n}`;
			else range = `>= ${min}${n} and <= ${max}${n}`;
			throw new errors.ERR_OUT_OF_RANGE("value", range, value);
		}
		checkBounds(buf, offset, byteLength);
	}
	function validateNumber(value, name) {
		if (typeof value !== "number") throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
	}
	function boundsError(value, length, type) {
		if (Math.floor(value) !== value) {
			validateNumber(value, type);
			throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
		}
		if (length < 0) throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
		throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
	}
	var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
	function base64clean(str) {
		str = str.split("=")[0];
		str = str.trim().replace(INVALID_BASE64_RE, "");
		if (str.length < 2) return "";
		while (str.length % 4 !== 0) str = str + "=";
		return str;
	}
	function utf8ToBytes(string, units) {
		units = units || Infinity;
		let codePoint;
		const length = string.length;
		let leadSurrogate = null;
		const bytes = [];
		for (let i = 0; i < length; ++i) {
			codePoint = string.charCodeAt(i);
			if (codePoint > 55295 && codePoint < 57344) {
				if (!leadSurrogate) {
					if (codePoint > 56319) {
						if ((units -= 3) > -1) bytes.push(239, 191, 189);
						continue;
					} else if (i + 1 === length) {
						if ((units -= 3) > -1) bytes.push(239, 191, 189);
						continue;
					}
					leadSurrogate = codePoint;
					continue;
				}
				if (codePoint < 56320) {
					if ((units -= 3) > -1) bytes.push(239, 191, 189);
					leadSurrogate = codePoint;
					continue;
				}
				codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
			} else if (leadSurrogate) {
				if ((units -= 3) > -1) bytes.push(239, 191, 189);
			}
			leadSurrogate = null;
			if (codePoint < 128) {
				if ((units -= 1) < 0) break;
				bytes.push(codePoint);
			} else if (codePoint < 2048) {
				if ((units -= 2) < 0) break;
				bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
			} else if (codePoint < 65536) {
				if ((units -= 3) < 0) break;
				bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
			} else if (codePoint < 1114112) {
				if ((units -= 4) < 0) break;
				bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
			} else throw new Error("Invalid code point");
		}
		return bytes;
	}
	function asciiToBytes(str) {
		const byteArray = [];
		for (let i = 0; i < str.length; ++i) byteArray.push(str.charCodeAt(i) & 255);
		return byteArray;
	}
	function utf16leToBytes(str, units) {
		let c, hi, lo;
		const byteArray = [];
		for (let i = 0; i < str.length; ++i) {
			if ((units -= 2) < 0) break;
			c = str.charCodeAt(i);
			hi = c >> 8;
			lo = c % 256;
			byteArray.push(lo);
			byteArray.push(hi);
		}
		return byteArray;
	}
	function base64ToBytes(str) {
		return base64.toByteArray(base64clean(str));
	}
	function blitBuffer(src, dst, offset, length) {
		let i;
		for (i = 0; i < length; ++i) {
			if (i + offset >= dst.length || i >= src.length) break;
			dst[i + offset] = src[i];
		}
		return i;
	}
	function isInstance(obj, type) {
		return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
	}
	function numberIsNaN(obj) {
		return obj !== obj;
	}
	var hexSliceLookupTable = (function() {
		const alphabet = "0123456789abcdef";
		const table = new Array(256);
		for (let i = 0; i < 16; ++i) {
			const i16 = i * 16;
			for (let j = 0; j < 16; ++j) table[i16 + j] = alphabet[i] + alphabet[j];
		}
		return table;
	})();
	function defineBigIntMethod(fn) {
		return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
	}
	function BufferBigIntNotDefined() {
		throw new Error("BigInt not supported");
	}
}));
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/multisig/signer.js
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _pubkey;
var _signers;
var MultiSigSigner = class extends Signer$1 {
	constructor(pubkey, signers = []) {
		super();
		__privateAdd(this, _pubkey);
		__privateAdd(this, _signers);
		__privateSet(this, _pubkey, pubkey);
		__privateSet(this, _signers, signers);
		const uniqueKeys = /* @__PURE__ */ new Set();
		let combinedWeight = 0;
		const weights = pubkey.getPublicKeys().map(({ weight, publicKey }) => ({
			weight,
			address: publicKey.toIotaAddress()
		}));
		for (const signer of signers) {
			const address = signer.toIotaAddress();
			if (uniqueKeys.has(address)) throw new Error(`Can't create MultiSigSigner with duplicate signers`);
			uniqueKeys.add(address);
			const weight = weights.find((w) => w.address === address)?.weight;
			if (!weight) throw new Error(`Signer ${address} is not part of the MultiSig public key`);
			combinedWeight += weight;
		}
		if (combinedWeight < pubkey.getThreshold()) throw new Error(`Combined weight of signers is less than threshold`);
	}
	getKeyScheme() {
		return "MultiSig";
	}
	getPublicKey() {
		return __privateGet(this, _pubkey);
	}
	sign(_data) {
		throw new Error("MultiSigSigner does not support signing directly. Use signTransaction or signPersonalMessage instead");
	}
	signData(_data) {
		throw new Error("MultiSigSigner does not support signing directly. Use signTransaction or signPersonalMessage instead");
	}
	async signTransaction(bytes) {
		return {
			signature: __privateGet(this, _pubkey).combinePartialSignatures(await Promise.all(__privateGet(this, _signers).map(async (signer) => (await signer.signTransaction(bytes)).signature))),
			bytes: toBase64(bytes)
		};
	}
	async signPersonalMessage(bytes) {
		return {
			signature: __privateGet(this, _pubkey).combinePartialSignatures(await Promise.all(__privateGet(this, _signers).map(async (signer) => (await signer.signPersonalMessage(bytes)).signature))),
			bytes: toBase64(bytes)
		};
	}
};
_pubkey = /* @__PURE__ */ new WeakMap();
_signers = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/keypairs/move-authenticator/publickey.js
var MoveAuthenticatorPublicKey = class extends PublicKey {
	/**
	* Creates a new MoveAuthenticatorPublicKey from an account object ID.
	*
	* @param authenticatedObjectId - The object ID as bytes (32 bytes)
	*/
	constructor(authenticatedObjectId) {
		super();
		if (typeof authenticatedObjectId === "string") this.authenticatedObjectId = fromHex(authenticatedObjectId);
		else this.authenticatedObjectId = authenticatedObjectId;
	}
	/**
	* Return the byte array representation of the object ID
	*/
	toRawBytes() {
		return this.authenticatedObjectId;
	}
	/**
	* Return the signature scheme flag for MoveAuthenticator
	*/
	flag() {
		return SIGNATURE_SCHEME_TO_FLAG.MoveAuthenticator;
	}
	/**
	* Return the IOTA address for this MoveAuthenticator.
	* Unlike other key types, the address IS the object ID directly,
	* not a hash of (flag || publicKey). This matches the Rust implementation:
	* `IotaAddress::from(object_id)`.
	*/
	toIotaAddress() {
		return normalizeIotaAddress(bytesToHex(this.authenticatedObjectId));
	}
	/**
	* Verification is not supported for MoveAuthenticator as it uses account abstraction.
	* The verification happens on-chain via the authenticator function.
	*/
	async verify(_data, _signature) {
		throw new Error("Verification is not supported for MoveAuthenticator. Verification happens on-chain via the authenticator function.");
	}
};
//#endregion
//#region node_modules/.pnpm/@iota+iota-sdk@1.15.0_typescript@5.9.3/node_modules/@iota/iota-sdk/dist/esm/verify/verify.js
async function verifyPersonalMessageSignature(message, signature, options = {}) {
	const parsedSignature = parseSignature(signature);
	if (!await parsedSignature.publicKey.verifyPersonalMessage(message, parsedSignature.serializedSignature)) throw new Error(`Signature is not valid for the provided message`);
	if (options?.address && !parsedSignature.publicKey.verifyAddress(options.address)) throw new Error(`Signature is not valid for the provided address`);
	return parsedSignature.publicKey;
}
async function verifyTransactionSignature(transaction, signature, options = {}) {
	const parsedSignature = parseSignature(signature);
	if (!await parsedSignature.publicKey.verifyTransaction(transaction, parsedSignature.serializedSignature)) throw new Error(`Signature is not valid for the provided Transaction`);
	if (options?.address && !parsedSignature.publicKey.verifyAddress(options.address)) throw new Error(`Signature is not valid for the provided address`);
	return parsedSignature.publicKey;
}
function parseSignature(signature) {
	const parsedSignature = parseSerializedSignature(signature);
	if (parsedSignature.signatureScheme === "MultiSig") return {
		...parsedSignature,
		publicKey: new MultiSigPublicKey(parsedSignature.multisig.multisig_pk)
	};
	if (parsedSignature.signatureScheme === "MoveAuthenticator") {
		const moveAuth = parsedSignature.moveAuthenticator;
		let authenticatedObjectId;
		if (moveAuth.$kind === "V1") {
			const { objectToAuthenticate } = moveAuth.V1;
			authenticatedObjectId = objectToAuthenticate.Object?.$kind === "ImmOrOwnedObject" ? objectToAuthenticate.Object.ImmOrOwnedObject.objectId : objectToAuthenticate.Object?.$kind === "Receiving" ? objectToAuthenticate.Object.Receiving.objectId : objectToAuthenticate.Object?.SharedObject?.objectId;
		} else throw new Error(`Unsupported MoveAuthenticator version: ${moveAuth.$kind}`);
		return {
			...parsedSignature,
			publicKey: new MoveAuthenticatorPublicKey(authenticatedObjectId)
		};
	}
	const publicKey = publicKeyFromRawBytes(parsedSignature.signatureScheme, parsedSignature.publicKey);
	return {
		...parsedSignature,
		publicKey
	};
}
function publicKeyFromRawBytes(signatureScheme, bytes) {
	switch (signatureScheme) {
		case "ED25519": return new Ed25519PublicKey(bytes);
		case "Secp256k1": return new Secp256k1PublicKey(bytes);
		case "Secp256r1": return new Secp256r1PublicKey(bytes);
		case "MultiSig": return new MultiSigPublicKey(bytes);
		case "Passkey": return new PasskeyPublicKey(bytes);
		case "MoveAuthenticator": return new MoveAuthenticatorPublicKey(bytes);
		default: throw new Error(`Unsupported signature scheme ${signatureScheme}`);
	}
}
var MultiSigPublicKey = class MultiSigPublicKey extends PublicKey {
	/**
	* Create a new MultiSigPublicKey object
	*/
	constructor(value) {
		super();
		if (typeof value === "string") {
			this.rawBytes = fromBase64(value);
			this.multisigPublicKey = iotaBcs.MultiSigPublicKey.parse(this.rawBytes);
		} else if (value instanceof Uint8Array) {
			this.rawBytes = value;
			this.multisigPublicKey = iotaBcs.MultiSigPublicKey.parse(this.rawBytes);
		} else {
			this.multisigPublicKey = value;
			this.rawBytes = iotaBcs.MultiSigPublicKey.serialize(value).toBytes();
		}
		if (this.multisigPublicKey.threshold < 1) throw new Error("Invalid threshold");
		const seenPublicKeys = /* @__PURE__ */ new Set();
		this.publicKeys = this.multisigPublicKey.pk_map.map(({ pubKey, weight }) => {
			const [scheme, bytes] = Object.entries(pubKey).filter(([name]) => name !== "$kind")[0];
			const publicKeyStr = Uint8Array.from(bytes).toString();
			if (seenPublicKeys.has(publicKeyStr)) throw new Error(`Multisig does not support duplicate public keys`);
			seenPublicKeys.add(publicKeyStr);
			if (weight < 1) throw new Error(`Invalid weight`);
			return {
				publicKey: publicKeyFromRawBytes(scheme, Uint8Array.from(bytes)),
				weight
			};
		});
		const totalWeight = this.publicKeys.reduce((sum, { weight }) => sum + weight, 0);
		if (this.multisigPublicKey.threshold > totalWeight) throw new Error(`Unreachable threshold`);
		if (this.publicKeys.length > 10) throw new Error(`Max number of signers in a multisig is 10`);
		if (this.publicKeys.length < 1) throw new Error(`Min number of signers in a multisig is 1`);
	}
	/**
	* 	A static method to create a new MultiSig publickey instance from a set of public keys and their associated weights pairs and threshold.
	*/
	static fromPublicKeys({ threshold, publicKeys }) {
		return new MultiSigPublicKey({
			pk_map: publicKeys.map(({ publicKey, weight }) => {
				return {
					pubKey: { [SIGNATURE_FLAG_TO_SCHEME[publicKey.flag()]]: publicKey.toRawBytes() },
					weight
				};
			}),
			threshold
		});
	}
	/**
	* Checks if two MultiSig public keys are equal
	*/
	equals(publicKey) {
		return super.equals(publicKey);
	}
	/**
	* Return the byte array representation of the MultiSig public key
	*/
	toRawBytes() {
		return this.rawBytes;
	}
	getPublicKeys() {
		return this.publicKeys;
	}
	getThreshold() {
		return this.multisigPublicKey.threshold;
	}
	getSigner(...signers) {
		return new MultiSigSigner(this, signers);
	}
	/**
	* Return the IOTA address associated with this MultiSig public key
	*/
	toIotaAddress() {
		const tmp = /* @__PURE__ */ new Uint8Array(653);
		tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
		tmp.set(iotaBcs.u16().serialize(this.multisigPublicKey.threshold).toBytes(), 1);
		let i = 3;
		for (const { publicKey, weight } of this.publicKeys) {
			const bytes = publicKey.toIotaBytesForAddress();
			tmp.set(bytes, i);
			i += bytes.length;
			tmp.set([weight], i++);
		}
		return normalizeIotaAddress(bytesToHex(blake2b(tmp.slice(0, i), { dkLen: 32 })));
	}
	/**
	* Return the IOTA address associated with this MultiSig public key
	*/
	flag() {
		return SIGNATURE_SCHEME_TO_FLAG["MultiSig"];
	}
	/**
	* Verifies that the signature is valid for the provided message
	*/
	async verify(message, multisigSignature) {
		const parsed = parseSerializedSignature(multisigSignature);
		if (parsed.signatureScheme !== "MultiSig") throw new Error("Invalid signature scheme");
		const { multisig } = parsed;
		let signatureWeight = 0;
		if (!bytesEqual(iotaBcs.MultiSigPublicKey.serialize(this.multisigPublicKey).toBytes(), iotaBcs.MultiSigPublicKey.serialize(multisig.multisig_pk).toBytes())) return false;
		for (const { publicKey, weight, signature } of parsePartialSignatures(multisig)) {
			if (!await publicKey.verify(message, signature)) return false;
			signatureWeight += weight;
		}
		return signatureWeight >= this.multisigPublicKey.threshold;
	}
	/**
	* Combines multiple partial signatures into a single multisig, ensuring that each public key signs only once
	* and that all the public keys involved are known and valid, and then serializes multisig into the standard format
	*/
	combinePartialSignatures(signatures) {
		if (signatures.length > 10) throw new Error(`Max number of signatures in a multisig is 10`);
		let bitmap = 0;
		const compressedSignatures = new Array(signatures.length);
		for (let i = 0; i < signatures.length; i++) {
			const parsed = parseSerializedSignature(signatures[i]);
			if (parsed.signatureScheme === "MultiSig") throw new Error("MultiSig is not supported inside MultiSig");
			if (parsed.signatureScheme === "MoveAuthenticator") throw new Error("MoveAuthenticator is not supported inside MultiSig");
			const publicKey = parsed.publicKey;
			compressedSignatures[i] = { [parsed.signatureScheme]: parsed.signature };
			let publicKeyIndex;
			for (let j = 0; j < this.publicKeys.length; j++) if (bytesEqual(publicKey, this.publicKeys[j].publicKey.toRawBytes())) {
				if (bitmap & 1 << j) throw new Error("Received multiple signatures from the same public key");
				publicKeyIndex = j;
				break;
			}
			if (publicKeyIndex === void 0) throw new Error("Received signature from unknown public key");
			bitmap |= 1 << publicKeyIndex;
		}
		const multisig = {
			sigs: compressedSignatures,
			bitmap,
			multisig_pk: this.multisigPublicKey
		};
		const bytes = iotaBcs.MultiSig.serialize(multisig, { maxSize: 8192 }).toBytes();
		const tmp = new Uint8Array(bytes.length + 1);
		tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
		tmp.set(bytes, 1);
		return toBase64(tmp);
	}
};
function parsePartialSignatures(multisig) {
	const res = new Array(multisig.sigs.length);
	for (let i = 0; i < multisig.sigs.length; i++) {
		const [signatureScheme, signature] = Object.entries(multisig.sigs[i]).filter(([name]) => name !== "$kind")[0];
		const pkIndex = asIndices(multisig.bitmap).at(i);
		const pair = multisig.multisig_pk.pk_map[pkIndex];
		const pkBytes = Uint8Array.from(Object.values(pair.pubKey)[0]);
		if (signatureScheme === "MultiSig") throw new Error("MultiSig is not supported inside MultiSig");
		res[i] = {
			signatureScheme,
			signature,
			publicKey: publicKeyFromRawBytes(signatureScheme, pkBytes),
			weight: pair.weight
		};
	}
	return res;
}
function asIndices(bitmap) {
	if (bitmap < 0 || bitmap > 1024) throw new Error("Invalid bitmap");
	const res = [];
	for (let i = 0; i < 10; i++) if ((bitmap & 1 << i) !== 0) res.push(i);
	return Uint8Array.from(res);
}
//#endregion
//#region src/lib/utils/formatting.ts
var import_buffer = require_buffer();
/**
* Format an address for display by showing first 8 and last 6 characters
*/
function formatAddress(address) {
	if (!address) return "";
	return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
/**
* Copy text to clipboard
*/
async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch (e) {
		console.error("Failed to copy", e);
	}
}
//#endregion
//#region src/lib/components/MoveAuthenticatorDetails.svelte
var root$11 = from_html(`<div class="detail-row svelte-1g6aura"><span class="detail-label svelte-1g6aura">Version:</span> <div class="detail-value-container svelte-1g6aura"><span class="detail-value svelte-1g6aura"> </span></div></div> <div class="detail-row svelte-1g6aura"><span class="detail-label svelte-1g6aura">Authenticated Object ID:</span> <div class="detail-value-container svelte-1g6aura"><a class="detail-value link svelte-1g6aura" target="_blank" rel="noopener noreferrer"> </a> <button class="copy-btn svelte-1g6aura">Copy</button></div></div> <div class="detail-row svelte-1g6aura"><span class="detail-label svelte-1g6aura">Call Arguments:</span> <div class="detail-value-container svelte-1g6aura"><span class="detail-value wrap svelte-1g6aura"> </span> <button class="copy-btn svelte-1g6aura">Copy</button></div></div> <div class="detail-row svelte-1g6aura"><span class="detail-label svelte-1g6aura">Type Arguments:</span> <div class="detail-value-container svelte-1g6aura"><span class="detail-value wrap svelte-1g6aura"> </span> <button class="copy-btn svelte-1g6aura">Copy</button></div></div> <div class="detail-row svelte-1g6aura"><span class="detail-label svelte-1g6aura">Object to Authenticate:</span> <div class="detail-value-container svelte-1g6aura"><span class="detail-value wrap svelte-1g6aura"> </span> <button class="copy-btn svelte-1g6aura">Copy</button></div></div>`, 1);
function MoveAuthenticatorDetails($$anchor, $$props) {
	push($$props, true);
	function extractObjectId(objectArg) {
		if ("SharedObject" in objectArg) return objectArg.SharedObject.objectId;
		if ("ImmOrOwnedObject" in objectArg) return objectArg.ImmOrOwnedObject.objectId;
		if ("Receiving" in objectArg) return objectArg.Receiving.objectId;
		throw new Error("Unknown ObjectArg variant");
	}
	let authenticatedObjectId = user_derived(() => extractObjectId($$props.data.objectToAuthenticate));
	var fragment = root$11();
	var div = first_child(fragment);
	var div_1 = sibling(child(div), 2);
	var span = child(div_1);
	var text = child(span, true);
	reset(span);
	reset(div_1);
	reset(div);
	var div_2 = sibling(div, 2);
	var div_3 = sibling(child(div_2), 2);
	var a = child(div_3);
	var text_1 = child(a, true);
	reset(a);
	var button = sibling(a, 2);
	reset(div_3);
	reset(div_2);
	var div_4 = sibling(div_2, 2);
	var div_5 = sibling(child(div_4), 2);
	var span_1 = child(div_5);
	var text_2 = child(span_1, true);
	reset(span_1);
	var button_1 = sibling(span_1, 2);
	reset(div_5);
	reset(div_4);
	var div_6 = sibling(div_4, 2);
	var div_7 = sibling(child(div_6), 2);
	var span_2 = child(div_7);
	var text_3 = child(span_2, true);
	reset(span_2);
	var button_2 = sibling(span_2, 2);
	reset(div_7);
	reset(div_6);
	var div_8 = sibling(div_6, 2);
	var div_9 = sibling(child(div_8), 2);
	var span_3 = child(div_9);
	var text_4 = child(span_3, true);
	reset(span_3);
	var button_3 = sibling(span_3, 2);
	reset(div_9);
	reset(div_8);
	template_effect(($0, $1, $2, $3) => {
		set_text(text, $$props.data.version);
		set_attribute(a, "href", $0);
		set_text(text_1, get(authenticatedObjectId));
		set_text(text_2, $1);
		set_text(text_3, $2);
		set_text(text_4, $3);
	}, [
		() => getObjectLink(getSelectedNetworkConfig(), get(authenticatedObjectId)),
		() => JSON.stringify($$props.data.callArgs, null, 2),
		() => JSON.stringify($$props.data.typeArgs, null, 2),
		() => JSON.stringify($$props.data.objectToAuthenticate, null, 2)
	]);
	delegated("click", button, async () => await copyToClipboard(get(authenticatedObjectId)));
	delegated("click", button_1, async () => await copyToClipboard(JSON.stringify($$props.data.callArgs)));
	delegated("click", button_2, async () => await copyToClipboard(JSON.stringify($$props.data.typeArgs)));
	delegated("click", button_3, async () => await copyToClipboard(JSON.stringify($$props.data.objectToAuthenticate)));
	append($$anchor, fragment);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/components/TransactionSignatures.svelte
var keyDetails = ($$anchor, publicKey = noop, signature = noop) => {
	var fragment = root$10();
	var div = first_child(fragment);
	var div_1 = sibling(child(div), 2);
	var span = child(div_1);
	var text = child(span, true);
	reset(span);
	var button = sibling(span, 2);
	reset(div_1);
	reset(div);
	var div_2 = sibling(div, 2);
	var div_3 = sibling(child(div_2), 2);
	var span_1 = child(div_3);
	var text_1 = child(span_1, true);
	reset(span_1);
	var button_1 = sibling(span_1, 2);
	reset(div_3);
	reset(div_2);
	var div_4 = sibling(div_2, 2);
	var div_5 = sibling(child(div_4), 2);
	var span_2 = child(div_5);
	var text_2 = child(span_2, true);
	reset(span_2);
	var button_2 = sibling(span_2, 2);
	reset(div_5);
	reset(div_4);
	var div_6 = sibling(div_4, 2);
	var div_7 = sibling(child(div_6), 2);
	var span_3 = child(div_7);
	var text_3 = child(span_3, true);
	reset(span_3);
	var button_3 = sibling(span_3, 2);
	reset(div_7);
	reset(div_6);
	template_effect(($0, $1, $2, $3) => {
		set_text(text, $0);
		set_text(text_1, $1);
		set_text(text_2, $2);
		set_text(text_3, $3);
	}, [
		() => publicKey().toBase64(),
		() => publicKey().toIotaPublicKey(),
		() => publicKey().toIotaAddress(),
		() => import_buffer.Buffer.from(signature()).toString("base64")
	]);
	delegated("click", button, async () => await copyToClipboard(publicKey().toBase64()));
	delegated("click", button_1, async () => await copyToClipboard(publicKey().toIotaPublicKey()));
	delegated("click", button_2, async () => await copyToClipboard(publicKey().toIotaAddress()));
	delegated("click", button_3, async () => await copyToClipboard(import_buffer.Buffer.from(signature()).toString("base64")));
	append($$anchor, fragment);
};
var root$10 = from_html(`<div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Public Key:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Public Key (with flag):</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Address:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Signature Bytes:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div>`, 1);
var root_1$8 = from_html(`<div class="no-signatures svelte-bpsref">No signatures available</div>`);
var root_2$8 = from_html(`<div class="collapse-all-bar svelte-bpsref"><button class="collapse-all-btn svelte-bpsref" type="button"> </button></div>`);
var root_3$8 = from_html(`<span class="signature-address svelte-bpsref"> </span>`);
var root_4$7 = from_html(`<button class="copy-btn svelte-bpsref">Copy</button>`);
var root_5$5 = from_html(`<div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Threshold:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span></div></div>`);
var root_6$5 = from_html(`<div class="member-item svelte-bpsref"><div class="member-header svelte-bpsref"> </div> <!></div>`);
var root_7$3 = from_html(`<div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">MultiSig Address:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value svelte-bpsref"> </span> <!></div></div> <!> <div class="members-label svelte-bpsref"> </div> <!>`, 1);
var root_8$1 = from_html(`<div class="signature-details svelte-bpsref"><!> <div class="detail-row svelte-bpsref"><span class="detail-label svelte-bpsref">Full Signature:</span> <div class="detail-value-container svelte-bpsref"><span class="detail-value wrap svelte-bpsref"> </span> <button class="copy-btn svelte-bpsref">Copy</button></div></div></div>`);
var root_9$1 = from_html(`<div class="signature-item svelte-bpsref"><button type="button"><span class="chevron svelte-bpsref"> </span> <span class="signature-title svelte-bpsref"> </span> <span> </span> <!></button> <!></div>`);
var root_10$1 = from_html(`<div class="signatures-container svelte-bpsref"><!> <!></div>`);
function TransactionSignatures($$anchor, $$props) {
	push($$props, true);
	function extractObjectId(objectArg) {
		if ("SharedObject" in objectArg) return objectArg.SharedObject.objectId;
		if ("ImmOrOwnedObject" in objectArg) return objectArg.ImmOrOwnedObject.objectId;
		if ("Receiving" in objectArg) return objectArg.Receiving.objectId;
		throw new Error("Unknown ObjectArg variant");
	}
	let signatures = prop($$props, "signatures", 19, () => []), transactionData = prop($$props, "transactionData", 3, null);
	function determineRole(address, senderAddress, gasSponsorAddress, index, total) {
		if (address && senderAddress && address === senderAddress) return "sender";
		if (address && gasSponsorAddress && address === gasSponsorAddress && gasSponsorAddress !== senderAddress) return "gas_sponsor";
		if (total === 1) return "sender";
		if (index === 0) return "sender";
		if (index === 1) return "gas_sponsor";
		return "unknown";
	}
	let parsedSignatures = user_derived(() => {
		const result = [];
		let senderAddress = null;
		let gasSponsorAddress = null;
		if (transactionData()) {
			senderAddress = transactionData().sender;
			gasSponsorAddress = transactionData().gasData?.owner;
		}
		const total = signatures().length;
		signatures().forEach((sigString, index) => {
			try {
				const parsed = parseSerializedSignature(sigString);
				if (parsed.signatureScheme === "MoveAuthenticator") {
					const v1 = parsed.moveAuthenticator.V1;
					if (v1.objectToAuthenticate.$kind !== "Object") throw new Error("MoveAuthenticator objectToAuthenticate must be an Object");
					const objectArg = v1.objectToAuthenticate.Object;
					const authenticatedObjectId = extractObjectId(objectArg);
					result.push({
						signatureScheme: "MoveAuthenticator",
						role: determineRole(authenticatedObjectId, senderAddress, gasSponsorAddress, index, total),
						rawSignature: sigString,
						address: authenticatedObjectId,
						moveAuthenticator: {
							version: "V1",
							callArgs: v1.callArgs,
							typeArgs: v1.typeArgs,
							objectToAuthenticate: objectArg
						}
					});
					return;
				}
				if (parsed.signatureScheme === "MultiSig") {
					const partialSignatures = parsePartialSignatures(parsed.multisig);
					let address = null;
					let threshold;
					try {
						const multiSigPublicKey = new MultiSigPublicKey(parsed.multisig.multisig_pk);
						address = multiSigPublicKey.toIotaAddress();
						threshold = multiSigPublicKey.getThreshold();
					} catch (e) {
						console.error("Failed to derive multisig address:", e);
					}
					result.push({
						signatureScheme: "MultiSig",
						role: determineRole(address, senderAddress, gasSponsorAddress, index, total),
						rawSignature: sigString,
						address,
						threshold,
						members: partialSignatures.map((sig) => ({
							signatureScheme: sig.signatureScheme,
							publicKey: sig.publicKey,
							signature: sig.signature,
							weight: sig.weight
						}))
					});
					return;
				}
				const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
				const address = pubKey.toIotaAddress();
				result.push({
					signatureScheme: parsed.signatureScheme,
					role: determineRole(address, senderAddress, gasSponsorAddress, index, total),
					rawSignature: sigString,
					address,
					publicKey: pubKey,
					signature: parsed.signature
				});
			} catch (e) {
				console.error(`Failed to parse signature ${index + 1}:`, e);
			}
		});
		return result;
	});
	function roleLabel(role) {
		if (role === "sender") return "Sender";
		if (role === "gas_sponsor") return "Gas Sponsor";
		return "Unknown role";
	}
	function memberLabel(member, index) {
		return `Member #${index + 1} (${member.signatureScheme}) · weight ${member.weight}`;
	}
	let collapsed = state(proxy({}));
	function toggleCollapsed(index) {
		get(collapsed)[index] = !get(collapsed)[index];
	}
	let allCollapsed = user_derived(() => get(parsedSignatures).length > 0 && get(parsedSignatures).every((_, index) => get(collapsed)[index]));
	function setAllCollapsed(value) {
		const next = {};
		get(parsedSignatures).forEach((_, index) => {
			next[index] = value;
		});
		set(collapsed, next, true);
	}
	var fragment_1 = comment();
	var node = first_child(fragment_1);
	var consequent = ($$anchor) => {
		append($$anchor, root_1$8());
	};
	var alternate = ($$anchor) => {
		var div_9 = root_10$1();
		var node_1 = child(div_9);
		var consequent_1 = ($$anchor) => {
			var div_10 = root_2$8();
			var button_4 = child(div_10);
			var text_4 = child(button_4, true);
			reset(button_4);
			reset(div_10);
			template_effect(() => set_text(text_4, get(allCollapsed) ? "Expand all" : "Collapse all"));
			delegated("click", button_4, () => setAllCollapsed(!get(allCollapsed)));
			append($$anchor, div_10);
		};
		if_block(node_1, ($$render) => {
			if (get(parsedSignatures).length > 1) $$render(consequent_1);
		});
		each(sibling(node_1, 2), 17, () => get(parsedSignatures), index, ($$anchor, sig, index$1) => {
			var div_11 = root_9$1();
			var button_5 = child(div_11);
			let classes;
			var span_4 = child(button_5);
			var text_5 = child(span_4, true);
			reset(span_4);
			var span_5 = sibling(span_4, 2);
			var text_6 = child(span_5);
			reset(span_5);
			var span_6 = sibling(span_5, 2);
			var text_7 = child(span_6, true);
			reset(span_6);
			var node_3 = sibling(span_6, 2);
			var consequent_2 = ($$anchor) => {
				var span_7 = root_3$8();
				var text_8 = child(span_7, true);
				reset(span_7);
				template_effect(() => set_text(text_8, get(sig).address));
				append($$anchor, span_7);
			};
			if_block(node_3, ($$render) => {
				if (get(sig).address) $$render(consequent_2);
			});
			reset(button_5);
			var node_4 = sibling(button_5, 2);
			var consequent_8 = ($$anchor) => {
				var div_12 = root_8$1();
				var node_5 = child(div_12);
				var consequent_3 = ($$anchor) => {
					MoveAuthenticatorDetails($$anchor, { get data() {
						return get(sig).moveAuthenticator;
					} });
				};
				var consequent_6 = ($$anchor) => {
					var fragment_3 = root_7$3();
					var div_13 = first_child(fragment_3);
					var div_14 = sibling(child(div_13), 2);
					var span_8 = child(div_14);
					var text_9 = child(span_8, true);
					reset(span_8);
					var node_6 = sibling(span_8, 2);
					var consequent_4 = ($$anchor) => {
						var button_6 = root_4$7();
						delegated("click", button_6, async () => await copyToClipboard(get(sig).address ?? ""));
						append($$anchor, button_6);
					};
					if_block(node_6, ($$render) => {
						if (get(sig).address) $$render(consequent_4);
					});
					reset(div_14);
					reset(div_13);
					var node_7 = sibling(div_13, 2);
					var consequent_5 = ($$anchor) => {
						var div_15 = root_5$5();
						var div_16 = sibling(child(div_15), 2);
						var span_9 = child(div_16);
						var text_10 = child(span_9, true);
						reset(span_9);
						reset(div_16);
						reset(div_15);
						template_effect(() => set_text(text_10, get(sig).threshold));
						append($$anchor, div_15);
					};
					if_block(node_7, ($$render) => {
						if (get(sig).threshold !== void 0) $$render(consequent_5);
					});
					var div_17 = sibling(node_7, 2);
					var text_11 = child(div_17);
					reset(div_17);
					each(sibling(div_17, 2), 17, () => get(sig).members, index, ($$anchor, member, memberIndex) => {
						var div_18 = root_6$5();
						var div_19 = child(div_18);
						var text_12 = child(div_19, true);
						reset(div_19);
						keyDetails(sibling(div_19, 2), () => get(member).publicKey, () => get(member).signature);
						reset(div_18);
						template_effect(($0) => set_text(text_12, $0), [() => memberLabel(get(member), memberIndex)]);
						append($$anchor, div_18);
					});
					template_effect(() => {
						set_text(text_9, get(sig).address ?? "unknown");
						set_text(text_11, `Member signatures (${get(sig).members.length ?? ""})`);
					});
					append($$anchor, fragment_3);
				};
				var consequent_7 = ($$anchor) => {
					keyDetails($$anchor, () => get(sig).publicKey, () => get(sig).signature);
				};
				if_block(node_5, ($$render) => {
					if (get(sig).signatureScheme === "MoveAuthenticator" && get(sig).moveAuthenticator) $$render(consequent_3);
					else if (get(sig).signatureScheme === "MultiSig" && get(sig).members) $$render(consequent_6, 1);
					else if (get(sig).publicKey && get(sig).signature) $$render(consequent_7, 2);
				});
				var div_20 = sibling(node_5, 2);
				var div_21 = sibling(child(div_20), 2);
				var span_10 = child(div_21);
				var text_13 = child(span_10, true);
				reset(span_10);
				var button_7 = sibling(span_10, 2);
				reset(div_21);
				reset(div_20);
				reset(div_12);
				template_effect(() => set_text(text_13, get(sig).rawSignature));
				delegated("click", button_7, async () => await copyToClipboard(get(sig).rawSignature));
				append($$anchor, div_12);
			};
			if_block(node_4, ($$render) => {
				if (!get(collapsed)[index$1]) $$render(consequent_8);
			});
			reset(div_11);
			template_effect(($0) => {
				classes = set_class(button_5, 1, "signature-header svelte-bpsref", null, classes, { collapsed: get(collapsed)[index$1] });
				set_attribute(button_5, "aria-expanded", !get(collapsed)[index$1]);
				set_text(text_5, get(collapsed)[index$1] ? "▶" : "▼");
				set_text(text_6, `Signature #${index$1 + 1} (${get(sig).signatureScheme ?? ""})`);
				set_class(span_6, 1, `role-badge ${get(sig).role ?? ""}`, "svelte-bpsref");
				set_text(text_7, $0);
			}, [() => roleLabel(get(sig).role)]);
			delegated("click", button_5, () => toggleCollapsed(index$1));
			append($$anchor, div_11);
		});
		reset(div_9);
		append($$anchor, div_9);
	};
	if_block(node, ($$render) => {
		if (get(parsedSignatures).length === 0) $$render(consequent);
		else $$render(alternate, -1);
	});
	append($$anchor, fragment_1);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/components/TransactionView.svelte
var root$9 = from_html(`<div class="dry-run-banner svelte-1787xw1"><!> <br/>The execution mode can be changed at the top.</div>`);
var root_1$7 = from_html(`<div class="header-line svelte-1787xw1"><span class="tx-header svelte-1787xw1">Transaction</span> <a target="_blank" rel="noopener noreferrer" class="tx-id-short svelte-1787xw1"> </a></div>`);
var root_2$7 = from_html(`<button>Formatted View</button>`);
var root_3$7 = from_html(`<button>PTB Commands</button>`);
var root_4$6 = from_html(`<button>Raw TX JSON</button>`);
var root_5$4 = from_html(`<button>Signatures</button>`);
var root_6$4 = from_html(`<button>Tx Bytes</button>`);
var root_7$2 = from_html(`<button class="svelte-1787xw1"> </button>`);
var root_8 = from_html(`<div class="error-message svelte-1787xw1"> <button class="svelte-1787xw1">×</button></div>`);
var root_9 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Unsigned Transaction (TransactionData)</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_10 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Transaction Bytes</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_11 = from_html(`<span class="signature-label svelte-1787xw1"></span>`);
var root_12 = from_html(`<div class="signature-item svelte-1787xw1"><!> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_13 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong> </strong> <button class="copy-btn svelte-1787xw1">Copy All</button></div> <!></div>`);
var root_14 = from_html(`<div class="tx-bytes-section svelte-1787xw1"><div class="tx-bytes-header svelte-1787xw1"><strong>Signed Transaction (SenderSignedData)</strong> <button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="wrap-bytes svelte-1787xw1"> </pre></div>`);
var root_15 = from_html(`<div class="tx-bytes-view svelte-1787xw1"><!> <!> <!></div>`);
var root_16 = from_html(`<div class="signatures-view"><!></div>`);
var root_17 = from_html(`<div class="formatted-view svelte-1787xw1"><!></div>`);
var root_18 = from_html(`<div class="tree-view svelte-1787xw1"><div class="json-view-header svelte-1787xw1"><button class="copy-btn svelte-1787xw1">Copy</button></div> <!></div>`);
var root_19 = from_html(`<div class="commands-view-container svelte-1787xw1"><!></div>`);
var root_20 = from_html(`<div class="json-view svelte-1787xw1"><div class="json-view-header svelte-1787xw1"><button class="copy-btn svelte-1787xw1">Copy</button></div> <pre class="svelte-1787xw1"> </pre></div>`);
var root_21 = from_html(`<div class="transaction-view ultra-compact svelte-1787xw1"><!> <!> <div class="view-controls svelte-1787xw1"><!> <!> <button>Raw JSON</button> <!> <button>JSON Tree</button> <!> <!> <!> <button class="close-btn svelte-1787xw1" style="margin-left: auto;">×</button></div> <!> <!></div>`);
function TransactionView($$anchor, $$props) {
	push($$props, true);
	let value = prop($$props, "value", 15), showTypeInfo = prop($$props, "showTypeInfo", 3, true), shortPackageIds = prop($$props, "shortPackageIds", 3, true);
	let viewMode = state(proxy(new URLSearchParams(window.location.hash.split("?")[1] || "").get("view") || "formatted"));
	let prevViewMode = state("formatted");
	let commandIndex = state(proxy(parseInt(new URLSearchParams(window.location.hash.split("?")[1] || "").get("commandIndex") || "") || null));
	let hidden = user_derived(() => !value() || typeof value() === "object" && !Object.keys(value() || {}).length);
	let isDryRunning = state(false);
	let dryRunError = state("");
	function isValidTxBytes(str) {
		try {
			const txBytes = fromBase64(str);
			TransactionDataBuilder.fromBytes(txBytes);
			return true;
		} catch {
			return false;
		}
	}
	let hasTxBytes = user_derived(() => value() && (typeof value() === "string" && isValidTxBytes(value()) || typeof value() === "object" && ("transactionBytes" in value() && value().transactionBytes || "rawTransaction" in value() && value().rawTransaction || "bytes" in value() && value().bytes || isTransactionData(value()))));
	let signedTxBytes = user_derived(() => value()?.rawTransaction || "");
	let unsignedTxBytes = user_derived(() => value()?.transactionBytes || value()?.bytes || "");
	let txBytes = user_derived(() => get(unsignedTxBytes) || get(signedTxBytes) || (typeof value() === "string" ? value() : ""));
	let hasDryRunResults = user_derived(() => value() && typeof value() === "object" && "effects" in value() && value().effects);
	let isDryRunResult = user_derived(() => value() && typeof value() === "object" && "effects" in value() && !("transactionBytes" in value() || "rawTransaction" in value() || "bytes" in value()) && !("digest" in value()));
	let isDevInspectResult = user_derived(() => get(isDryRunResult) && value() && typeof value() === "object" && "results" in value());
	let isPreparedTxBytes = user_derived(() => value() && typeof value() === "object" && "json" in value() && "transactionBytes" in value() && !("effects" in value()));
	let transactionData = user_derived(() => getTransactionData(value()));
	const RAW_TX_EXCLUDED_FIELDS = /* @__PURE__ */ new Set([
		"effects",
		"decodedBCS",
		"transactionBytes",
		"bytes",
		"rawTransaction",
		"isDryRun",
		"originalDigest",
		"webWalletResponse",
		"transactionData"
	]);
	let rawTxJsonData = user_derived(() => get(transactionData) ? Object.fromEntries(Object.entries(get(transactionData)).filter(([k]) => !RAW_TX_EXCLUDED_FIELDS.has(k))) : null);
	let hasSignatures = user_derived(() => get(transactionData)?.signatures && Array.isArray(get(transactionData).signatures) && get(transactionData).signatures.length > 0);
	user_effect(() => {
		if (value()) {
			const isTxData = isTransactionData(value());
			const hasBytes = get(hasTxBytes);
			const hasSigs = get(hasSignatures);
			const validModes = isTxData ? [
				"formatted",
				"commands",
				"json",
				"rawtxjson",
				"tree"
			] : ["json", "tree"];
			if (hasBytes) validModes.push("txbytes");
			if (hasSigs) validModes.push("signatures");
			if (!validModes.includes(get(viewMode))) set(viewMode, isTxData ? "formatted" : "json", true);
			if (!validModes.includes(get(prevViewMode))) set(prevViewMode, get(viewMode), true);
			set(dryRunError, "");
		}
	});
	user_effect(() => {
		const hashParts = window.location.hash.split("?");
		const path = hashParts[0];
		const params = new URLSearchParams(hashParts[1] || "");
		const currentView = params.get("view");
		const currentCommandIndex = params.get("commandIndex");
		const newCommandIndex = get(commandIndex) !== null ? get(commandIndex).toString() : null;
		if (currentView !== get(viewMode) || currentCommandIndex !== newCommandIndex) {
			params.set("view", get(viewMode));
			if (get(commandIndex) !== null) params.set("commandIndex", get(commandIndex).toString());
			else params.delete("commandIndex");
			window.location.hash = path + "?" + params.toString();
		}
	});
	function extractUnsignedTxBytes(bytes) {
		if (!bytes) return bytes;
		try {
			TransactionDataBuilder.fromBytes(fromBase64(bytes));
			return bytes;
		} catch {
			const txData = iotaBcs.SenderSignedData.parse(fromBase64(bytes))[0].intentMessage.value;
			return toBase64(iotaBcs.TransactionData.serialize(txData).toBytes());
		}
	}
	async function performDryRun() {
		if (!get(hasTxBytes) || get(isDryRunning)) return;
		try {
			set(isDryRunning, true);
			const dryRunResult = await getClient().dryRunTransactionBlock({ transactionBlock: extractUnsignedTxBytes(get(txBytes)) });
			const updatedData = {
				...value(),
				...dryRunResult,
				transactionBytes: get(txBytes),
				isDryRun: true,
				originalDigest: value().digest || value().transactionDigest
			};
			value(updatedData);
		} catch (error) {
			console.error("Dry run failed:", error);
			set(dryRunError, `Dry run failed: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			set(isDryRunning, false);
		}
	}
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_22 = ($$anchor) => {
		var div = root_21();
		var node_1 = child(div);
		var consequent_2 = ($$anchor) => {
			var div_1 = root$9();
			var node_2 = child(div_1);
			var consequent = ($$anchor) => {
				append($$anchor, text("Prepared Tx Bytes — This transaction was not sent to the network."));
			};
			var consequent_1 = ($$anchor) => {
				append($$anchor, text("Dev Inspect — This transaction was simulated and not sent to the network."));
			};
			var alternate = ($$anchor) => {
				append($$anchor, text("Dry Run — This transaction was simulated and not sent to the network."));
			};
			if_block(node_2, ($$render) => {
				if (get(isPreparedTxBytes)) $$render(consequent);
				else if (get(isDevInspectResult) || get(transactionData)?.devInspectResults) $$render(consequent_1, 1);
				else $$render(alternate, -1);
			});
			next(3);
			reset(div_1);
			append($$anchor, div_1);
		};
		if_block(node_1, ($$render) => {
			if (get(isDryRunResult) || get(transactionData)?.isDryRun || get(isPreparedTxBytes)) $$render(consequent_2);
		});
		var node_3 = sibling(node_1, 2);
		var consequent_3 = ($$anchor) => {
			var div_2 = root_1$7();
			var a = sibling(child(div_2), 2);
			var text_3 = child(a, true);
			reset(a);
			reset(div_2);
			template_effect(($0) => {
				set_attribute(a, "href", $0);
				set_attribute(a, "title", get(transactionData)?.digest);
				set_text(text_3, get(transactionData)?.digest);
			}, [() => get(transactionData)?.digest ? getTransactionLink(getSelectedNetworkConfig(), get(transactionData).digest) : "#"]);
			append($$anchor, div_2);
		};
		if_block(node_3, ($$render) => {
			if (get(transactionData)?.digest) $$render(consequent_3);
		});
		var div_3 = sibling(node_3, 2);
		var node_4 = child(div_3);
		var consequent_4 = ($$anchor) => {
			var button = root_2$7();
			let classes;
			template_effect(() => classes = set_class(button, 1, "svelte-1787xw1", null, classes, { active: get(viewMode) === "formatted" }));
			delegated("click", button, () => {
				set(viewMode, "formatted");
			});
			append($$anchor, button);
		};
		var d = user_derived(() => isTransactionData(value()));
		if_block(node_4, ($$render) => {
			if (get(d)) $$render(consequent_4);
		});
		var node_5 = sibling(node_4, 2);
		var consequent_5 = ($$anchor) => {
			var button_1 = root_3$7();
			let classes_1;
			template_effect(() => classes_1 = set_class(button_1, 1, "svelte-1787xw1", null, classes_1, { active: get(viewMode) === "commands" }));
			delegated("click", button_1, () => {
				set(viewMode, "commands");
			});
			append($$anchor, button_1);
		};
		var d_1 = user_derived(() => isTransactionData(value()));
		if_block(node_5, ($$render) => {
			if (get(d_1)) $$render(consequent_5);
		});
		var button_2 = sibling(node_5, 2);
		let classes_2;
		var node_6 = sibling(button_2, 2);
		var consequent_6 = ($$anchor) => {
			var button_3 = root_4$6();
			let classes_3;
			template_effect(() => classes_3 = set_class(button_3, 1, "svelte-1787xw1", null, classes_3, { active: get(viewMode) === "rawtxjson" }));
			delegated("click", button_3, () => {
				set(viewMode, "rawtxjson");
			});
			append($$anchor, button_3);
		};
		var d_2 = user_derived(() => isTransactionData(value()));
		if_block(node_6, ($$render) => {
			if (get(d_2)) $$render(consequent_6);
		});
		var button_4 = sibling(node_6, 2);
		let classes_4;
		var node_7 = sibling(button_4, 2);
		var consequent_7 = ($$anchor) => {
			var button_5 = root_5$4();
			let classes_5;
			template_effect(() => classes_5 = set_class(button_5, 1, "svelte-1787xw1", null, classes_5, { active: get(viewMode) === "signatures" }));
			delegated("click", button_5, () => {
				set(viewMode, "signatures");
			});
			append($$anchor, button_5);
		};
		if_block(node_7, ($$render) => {
			if (get(hasSignatures)) $$render(consequent_7);
		});
		var node_8 = sibling(node_7, 2);
		var consequent_8 = ($$anchor) => {
			var button_6 = root_6$4();
			let classes_6;
			template_effect(() => classes_6 = set_class(button_6, 1, "svelte-1787xw1", null, classes_6, { active: get(viewMode) === "txbytes" }));
			delegated("click", button_6, () => {
				if (get(viewMode) === "txbytes") set(viewMode, get(prevViewMode), true);
				else {
					set(prevViewMode, get(viewMode), true);
					set(viewMode, "txbytes");
				}
			});
			append($$anchor, button_6);
		};
		if_block(node_8, ($$render) => {
			if (get(hasTxBytes) && !get(isDryRunResult)) $$render(consequent_8);
		});
		var node_9 = sibling(node_8, 2);
		var consequent_9 = ($$anchor) => {
			var button_7 = root_7$2();
			var text_4 = child(button_7, true);
			reset(button_7);
			template_effect(() => {
				button_7.disabled = get(isDryRunning);
				set_text(text_4, get(isDryRunning) ? "Running..." : get(hasDryRunResults) ? "Re-run Dry" : "Dry Run");
			});
			delegated("click", button_7, performDryRun);
			append($$anchor, button_7);
		};
		if_block(node_9, ($$render) => {
			if (get(hasTxBytes) && !get(isDryRunResult)) $$render(consequent_9);
		});
		var button_8 = sibling(node_9, 2);
		reset(div_3);
		var node_10 = sibling(div_3, 2);
		var consequent_10 = ($$anchor) => {
			var div_4 = root_8();
			var text_5 = child(div_4);
			var button_9 = sibling(text_5);
			reset(div_4);
			template_effect(() => set_text(text_5, `${get(dryRunError) ?? ""} `));
			delegated("click", button_9, () => set(dryRunError, ""));
			append($$anchor, div_4);
		};
		if_block(node_10, ($$render) => {
			if (get(dryRunError)) $$render(consequent_10);
		});
		var node_11 = sibling(node_10, 2);
		var consequent_16 = ($$anchor) => {
			var div_5 = root_15();
			var node_12 = child(div_5);
			var consequent_11 = ($$anchor) => {
				var div_6 = root_9();
				var div_7 = child(div_6);
				var button_10 = sibling(child(div_7), 2);
				reset(div_7);
				var pre = sibling(div_7, 2);
				var text_6 = child(pre, true);
				reset(pre);
				reset(div_6);
				template_effect(() => set_text(text_6, get(unsignedTxBytes)));
				delegated("click", button_10, () => navigator.clipboard.writeText(get(unsignedTxBytes)));
				append($$anchor, div_6);
			};
			var consequent_12 = ($$anchor) => {
				var div_8 = root_10();
				var div_9 = child(div_8);
				var button_11 = sibling(child(div_9), 2);
				reset(div_9);
				var pre_1 = sibling(div_9, 2);
				var text_7 = child(pre_1, true);
				reset(pre_1);
				reset(div_8);
				template_effect(() => set_text(text_7, get(txBytes)));
				delegated("click", button_11, () => navigator.clipboard.writeText(get(txBytes)));
				append($$anchor, div_8);
			};
			if_block(node_12, ($$render) => {
				if (get(unsignedTxBytes)) $$render(consequent_11);
				else if (get(txBytes) && !get(signedTxBytes)) $$render(consequent_12, 1);
			});
			var node_13 = sibling(node_12, 2);
			var consequent_14 = ($$anchor) => {
				var div_10 = root_13();
				var div_11 = child(div_10);
				var strong = child(div_11);
				var text_8 = child(strong);
				reset(strong);
				var button_12 = sibling(strong, 2);
				reset(div_11);
				each(sibling(div_11, 2), 17, () => get(transactionData).signatures, index, ($$anchor, sig, i) => {
					var div_12 = root_12();
					var node_15 = child(div_12);
					var consequent_13 = ($$anchor) => {
						var span = root_11();
						span.textContent = `#${i + 1}`;
						append($$anchor, span);
					};
					if_block(node_15, ($$render) => {
						if (get(transactionData).signatures.length > 1) $$render(consequent_13);
					});
					var pre_2 = sibling(node_15, 2);
					var text_9 = child(pre_2, true);
					reset(pre_2);
					reset(div_12);
					template_effect(() => set_text(text_9, get(sig)));
					append($$anchor, div_12);
				});
				reset(div_10);
				template_effect(() => set_text(text_8, `Signature${get(transactionData).signatures.length > 1 ? "s" : ""} (${get(transactionData).signatures.length ?? ""})`));
				delegated("click", button_12, () => navigator.clipboard.writeText(get(transactionData).signatures.join("\n")));
				append($$anchor, div_10);
			};
			var d_3 = user_derived(() => get(transactionData)?.signatures && Array.isArray(get(transactionData).signatures) && get(transactionData).signatures.length > 0);
			if_block(node_13, ($$render) => {
				if (get(d_3)) $$render(consequent_14);
			});
			var node_16 = sibling(node_13, 2);
			var consequent_15 = ($$anchor) => {
				var div_13 = root_14();
				var div_14 = child(div_13);
				var button_13 = sibling(child(div_14), 2);
				reset(div_14);
				var pre_3 = sibling(div_14, 2);
				var text_10 = child(pre_3, true);
				reset(pre_3);
				reset(div_13);
				template_effect(() => set_text(text_10, get(signedTxBytes)));
				delegated("click", button_13, () => navigator.clipboard.writeText(get(signedTxBytes)));
				append($$anchor, div_13);
			};
			if_block(node_16, ($$render) => {
				if (get(signedTxBytes)) $$render(consequent_15);
			});
			reset(div_5);
			append($$anchor, div_5);
		};
		var consequent_17 = ($$anchor) => {
			var div_15 = root_16();
			TransactionSignatures(child(div_15), {
				get signatures() {
					return get(transactionData).signatures;
				},
				get transactionData() {
					return get(transactionData);
				}
			});
			reset(div_15);
			append($$anchor, div_15);
		};
		var consequent_18 = ($$anchor) => {
			var div_16 = root_17();
			var node_18 = child(div_16);
			{
				let $0 = user_derived(() => getTransactionData(value()));
				TransactionEffects(node_18, { get transactionData() {
					return get($0);
				} });
			}
			reset(div_16);
			append($$anchor, div_16);
		};
		var d_4 = user_derived(() => get(viewMode) === "formatted" && isTransactionData(value()));
		var consequent_19 = ($$anchor) => {
			var div_17 = root_18();
			var div_18 = child(div_17);
			var button_14 = child(div_18);
			reset(div_18);
			var node_19 = sibling(div_18, 2);
			{
				let $0 = user_derived(() => isTransactionData(value()) ? get(transactionData) : value());
				Root(node_19, {
					get value() {
						return get($0);
					},
					defaultExpandedLevel: 1
				});
			}
			reset(div_17);
			delegated("click", button_14, () => navigator.clipboard.writeText(formatJsonWithCompactArrays(isTransactionData(value()) ? get(transactionData) : value())));
			append($$anchor, div_17);
		};
		var consequent_20 = ($$anchor) => {
			var div_19 = root_19();
			var node_20 = child(div_19);
			{
				let $0 = user_derived(() => getTransactionData(value()));
				TransactionCommands(node_20, {
					get transactionData() {
						return get($0);
					},
					get commandIndex() {
						return get(commandIndex);
					},
					onCommandIndexChange: (i) => set(commandIndex, i, true),
					get showTypeInfo() {
						return showTypeInfo();
					},
					get shortPackageIds() {
						return shortPackageIds();
					}
				});
			}
			reset(div_19);
			append($$anchor, div_19);
		};
		var consequent_21 = ($$anchor) => {
			var div_20 = root_20();
			var div_21 = child(div_20);
			var button_15 = child(div_21);
			reset(div_21);
			var pre_4 = sibling(div_21, 2);
			var text_11 = child(pre_4, true);
			reset(pre_4);
			reset(div_20);
			template_effect(($0) => set_text(text_11, $0), [() => formatJsonWithCompactArrays(get(rawTxJsonData))]);
			delegated("click", button_15, () => navigator.clipboard.writeText(formatJsonWithCompactArrays(get(rawTxJsonData))));
			append($$anchor, div_20);
		};
		var d_5 = user_derived(() => get(viewMode) === "rawtxjson" && isTransactionData(value()));
		var alternate_1 = ($$anchor) => {
			var div_22 = root_20();
			var div_23 = child(div_22);
			var button_16 = child(div_23);
			reset(div_23);
			var pre_5 = sibling(div_23, 2);
			var text_12 = child(pre_5, true);
			reset(pre_5);
			reset(div_22);
			template_effect(($0) => set_text(text_12, $0), [() => formatJsonWithCompactArrays(isTransactionData(value()) ? get(transactionData) : value())]);
			delegated("click", button_16, () => navigator.clipboard.writeText(formatJsonWithCompactArrays(isTransactionData(value()) ? get(transactionData) : value())));
			append($$anchor, div_22);
		};
		if_block(node_11, ($$render) => {
			if (get(viewMode) === "txbytes" && get(hasTxBytes)) $$render(consequent_16);
			else if (get(viewMode) === "signatures" && get(hasSignatures)) $$render(consequent_17, 1);
			else if (get(d_4)) $$render(consequent_18, 2);
			else if (get(viewMode) === "tree") $$render(consequent_19, 3);
			else if (get(viewMode) === "commands") $$render(consequent_20, 4);
			else if (get(d_5)) $$render(consequent_21, 5);
			else $$render(alternate_1, -1);
		});
		reset(div);
		template_effect(() => {
			classes_2 = set_class(button_2, 1, "svelte-1787xw1", null, classes_2, { active: get(viewMode) === "json" });
			classes_4 = set_class(button_4, 1, "svelte-1787xw1", null, classes_4, { active: get(viewMode) === "tree" });
		});
		delegated("click", button_2, () => {
			set(viewMode, "json");
		});
		delegated("click", button_4, () => {
			set(viewMode, "tree");
		});
		delegated("click", button_8, () => value(null));
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if (!get(hidden)) $$render(consequent_22);
	});
	append($$anchor, fragment);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/components/MainnetTransactionConfirmation.svelte
var root$8 = from_html(`<div class="modal-overlay svelte-1rplmhz" role="button" tabindex="0"><div class="modal-content svelte-1rplmhz" role="dialog" aria-modal="true" aria-labelledby="mainnet-warning-title" tabindex="-1"><h3 id="mainnet-warning-title" class="svelte-1rplmhz">Mainnet Transaction Warning</h3> <p class="warning-text svelte-1rplmhz">You are connected to mainnet. Always verify the transaction details in your wallet
                before signing.</p> <div class="transaction-preview svelte-1rplmhz"><!></div> <div class="actions svelte-1rplmhz"><button class="cancel-btn svelte-1rplmhz">Cancel</button> <button class="confirm-btn svelte-1rplmhz">Confirm and Continue</button></div></div></div>`);
function MainnetTransactionConfirmation($$anchor, $$props) {
	push($$props, false);
	const $pendingMainnetTransactionConfirmation = () => store_get(pendingMainnetTransactionConfirmation, "$pendingMainnetTransactionConfirmation", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	init();
	var fragment = comment();
	var node = first_child(fragment);
	var consequent = ($$anchor) => {
		var div = root$8();
		var div_1 = child(div);
		var div_2 = sibling(child(div_1), 4);
		TransactionView(child(div_2), { get value() {
			return $pendingMainnetTransactionConfirmation().transactionData;
		} });
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var button = child(div_3);
		var button_1 = sibling(button, 2);
		reset(div_3);
		reset(div_1);
		reset(div);
		delegated("click", div, function(...$$args) {
			cancelMainnetTransaction?.apply(this, $$args);
		});
		delegated("keydown", div, (e) => e.key === "Escape" && cancelMainnetTransaction());
		delegated("click", div_1, (e) => e.stopPropagation());
		delegated("keydown", div_1, (e) => e.stopPropagation());
		delegated("click", button, function(...$$args) {
			cancelMainnetTransaction?.apply(this, $$args);
		});
		delegated("click", button_1, function(...$$args) {
			confirmMainnetTransaction?.apply(this, $$args);
		});
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if ($pendingMainnetTransactionConfirmation()) $$render(consequent);
	});
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate(["click", "keydown"]);
//#endregion
//#region src/lib/utils/query-params.ts
var _queryParams = writable({});
function parseQueryParams() {
	if (typeof window === "undefined") return {};
	const params = {};
	let searchParams;
	const hash = window.location.hash;
	if (hash && hash.includes("?")) {
		const queryString = hash.split("?")[1];
		searchParams = new URLSearchParams(queryString);
	} else searchParams = new URLSearchParams(window.location.search);
	for (const [key, value] of searchParams.entries()) if (params[key]) if (Array.isArray(params[key])) params[key].push(value);
	else params[key] = [params[key], value];
	else params[key] = value;
	return params;
}
function initQueryParams() {
	if (typeof window === "undefined") return;
	_queryParams.set(parseQueryParams());
	window.addEventListener("popstate", () => {
		_queryParams.set(parseQueryParams());
	});
	window.addEventListener("hashchange", () => {
		_queryParams.set(parseQueryParams());
	});
	const originalPushState = history.pushState;
	const originalReplaceState = history.replaceState;
	history.pushState = function(...args) {
		originalPushState.apply(history, args);
		_queryParams.set(parseQueryParams());
	};
	history.replaceState = function(...args) {
		originalReplaceState.apply(history, args);
		_queryParams.set(parseQueryParams());
	};
}
initQueryParams();
var queryParams = _queryParams;
//#endregion
//#region src/lib/utils/query-param-store.ts
var QUERY_PARAM_KEYS = {
	NETWORK: "network",
	SIGNER: "signer",
	EXTERNAL_ADDRESS: "externalAddress"
};
var GLOBAL_QUERY_PARAMS = [
	QUERY_PARAM_KEYS.NETWORK,
	QUERY_PARAM_KEYS.SIGNER,
	QUERY_PARAM_KEYS.EXTERNAL_ADDRESS
];
var useQueryParamNetwork = writable(false);
var useQueryParamSigner = writable(false);
var networkFromQuery = derived(queryParams, ($params) => {
	const network = $params[QUERY_PARAM_KEYS.NETWORK];
	return Array.isArray(network) ? network[0] : network;
});
var signerFromQuery = derived(queryParams, ($params) => {
	const signer = $params[QUERY_PARAM_KEYS.SIGNER];
	return Array.isArray(signer) ? signer[0] : signer;
});
var addressFromQuery = derived(queryParams, ($params) => {
	const address = $params[QUERY_PARAM_KEYS.EXTERNAL_ADDRESS];
	return Array.isArray(address) ? address[0] : address;
});
var queryAwareClientConfig = derived([
	sharedClientConfig,
	networkFromQuery,
	useQueryParamNetwork
], ([$config, $networkQuery, $useQueryParam]) => {
	if ($networkQuery && $config.networks.some((n) => n.name === $networkQuery)) {
		const newConfig = {
			...$config,
			selected: $networkQuery
		};
		if (!$useQueryParam) useQueryParamNetwork.set(true);
		return newConfig;
	}
	if (!$networkQuery && $useQueryParam) useQueryParamNetwork.set(false);
	return $config;
});
function initQueryParamHandling() {
	networkFromQuery.subscribe((networkName) => {
		if (networkName) sharedClientConfig.update((config) => {
			if (config.networks.some((n) => n.name === networkName) && config.selected !== networkName) return {
				...config,
				selected: networkName
			};
			return config;
		});
	});
	signerFromQuery.subscribe((signerName) => {
		if (signerName && Object.values(SignerType).includes(signerName)) sharedSignerType.update((currentSigner) => {
			if (currentSigner !== signerName) {
				useQueryParamSigner.set(true);
				return signerName;
			}
			return currentSigner;
		});
	});
}
/**
* Navigate to a route while preserving global query parameters
* and clearing page-specific parameters
*/
function navigateWithGlobalParams(route) {
	if (typeof window === "undefined") return;
	const currentParams = getCurrentQueryParams();
	const globalParams = new URLSearchParams();
	for (const globalKey of GLOBAL_QUERY_PARAMS) {
		const value = currentParams[globalKey];
		if (value) {
			const paramValue = Array.isArray(value) ? value[0] : value;
			globalParams.set(globalKey, paramValue);
		}
	}
	const newHash = globalParams.toString() ? `#${route}?${globalParams.toString()}` : `#${route}`;
	window.location.hash = newHash;
}
/**
* Get current query parameters from URL
*/
function getCurrentQueryParams() {
	if (typeof window === "undefined") return {};
	const params = {};
	let searchParams;
	const hash = window.location.hash;
	if (hash && hash.includes("?")) {
		const queryString = hash.split("?")[1];
		searchParams = new URLSearchParams(queryString);
	} else searchParams = new URLSearchParams(window.location.search);
	for (const [key, value] of searchParams.entries()) if (params[key]) if (Array.isArray(params[key])) params[key].push(value);
	else params[key] = [params[key], value];
	else params[key] = value;
	return params;
}
function setQueryParam(key, value) {
	if (typeof window === "undefined") return;
	let url;
	const hash = window.location.hash;
	if (hash && hash.startsWith("#/")) {
		const [route, currentParams] = hash.split("?");
		const searchParams = new URLSearchParams(currentParams || "");
		if (value === null) searchParams.delete(key);
		else searchParams.set(key, value);
		const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;
		window.location.hash = newHash;
	} else {
		url = new URL(window.location.href);
		if (value === null) url.searchParams.delete(key);
		else url.searchParams.set(key, value);
		window.history.replaceState({}, "", url.toString());
	}
}
//#endregion
//#region src/lib/utils/pruning-cutoff.ts
var PROBE_TX_KIND = "ConsensusCommitPrologueV1";
async function fetchPruningCutoff(rpcUrl, signal) {
	const res = await fetch(rpcUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "iotax_queryTransactionBlocks",
			params: [
				{ filter: { TransactionKind: PROBE_TX_KIND } },
				null,
				1,
				false
			]
		}),
		signal
	});
	if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
	const data = await res.json();
	if (data?.error) throw new Error(data.error.message || "RPC error");
	const first = data?.result?.data?.[0];
	if (!first?.checkpoint || !first?.timestampMs) return null;
	return {
		checkpoint: Number(first.checkpoint),
		timestampMs: Number(first.timestampMs)
	};
}
/**
* Verbose "X days ago" / "X hours ago" / "X minutes ago" — used on the chip,
* where the relative-time label is the primary signal rather than a subscript.
*/
function formatVerboseAgo(timestampMs, now = Date.now()) {
	if (!Number.isFinite(timestampMs)) return "";
	const diffMs = now - timestampMs;
	if (diffMs < 0) return "in the future";
	const minute = 6e4;
	const hour = 60 * minute;
	const day = 24 * hour;
	if (diffMs < minute) return "just now";
	if (diffMs < hour) {
		const m = Math.floor(diffMs / minute);
		return `${m} minute${m === 1 ? "" : "s"} ago`;
	}
	if (diffMs < day) {
		const h = Math.floor(diffMs / hour);
		return `${h} hour${h === 1 ? "" : "s"} ago`;
	}
	const d = Math.floor(diffMs / day);
	return `${d} day${d === 1 ? "" : "s"} ago`;
}
/**
* Human-readable date-only, e.g. "21 May 2026" or "May 21, 2026" — used on
* the compact chip.
*/
function formatReadableDate(timestampMs) {
	if (!Number.isFinite(timestampMs)) return "";
	return new Date(timestampMs).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
/**
* Human-readable date+time, used inside the tooltip where precision is
* useful and space is not a constraint.
*/
function formatReadableDateTime(timestampMs) {
	if (!Number.isFinite(timestampMs)) return "";
	return new Date(timestampMs).toLocaleString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
//#endregion
//#region src/lib/components/PruningCutoff.svelte
var root$7 = from_html(`<span><span class="label svelte-1x1mjxu">Pruning:</span> <span class="value svelte-1x1mjxu"> </span> <span class="info-icon svelte-1x1mjxu" aria-hidden="true">ⓘ</span></span> <div class="tooltip svelte-1x1mjxu" role="tooltip"><div class="tooltip-title svelte-1x1mjxu"><!></div> <div class="tooltip-body svelte-1x1mjxu"><!></div> <div class="tooltip-section svelte-1x1mjxu"><div class="tooltip-section-title good svelte-1x1mjxu">Still available for all checkpoints:</div> <ul class="svelte-1x1mjxu"><li class="svelte-1x1mjxu">Direct transaction lookup by digest</li> <li class="svelte-1x1mjxu">Direct checkpoint lookup by sequence number / digest</li> <li class="svelte-1x1mjxu">Object lookup by ID (current and past versions)</li> <li class="svelte-1x1mjxu">Current network / system state, validators, balances</li></ul></div> <div class="tooltip-section svelte-1x1mjxu"><div class="tooltip-section-title bad svelte-1x1mjxu"><!></div> <ul class="svelte-1x1mjxu"><li class="svelte-1x1mjxu">Transactions filtered by kind / sender / recipient / input / changed obj</li> <li class="svelte-1x1mjxu">Events filtered by module / sender / type</li> <li class="svelte-1x1mjxu">GraphQL queries that rely on those same filtered indexes</li></ul></div> <div class="tooltip-footer svelte-1x1mjxu">Probed via <code class="svelte-1x1mjxu">iotax_queryTransactionBlocks</code> with <code class="svelte-1x1mjxu">TransactionKind=ConsensusCommitPrologueV1</code> ascending — that kind is emitted
                once per consensus commit, so the oldest result tracks the actual filtered-index pruning
                watermark.</div></div>`, 1);
var root_1$6 = from_html(`<span class="pruning-cutoff loading svelte-1x1mjxu" title="Querying oldest available checkpoint">Pruning cutoff: …</span>`);
var root_2$6 = from_html(`<span class="pruning-cutoff error svelte-1x1mjxu">Pruning cutoff: n/a</span>`);
var root_3$6 = from_html(`<div class="pruning-cutoff-container svelte-1x1mjxu" role="group" aria-label="Pruning cutoff"><!></div>`);
function PruningCutoff($$anchor, $$props) {
	push($$props, true);
	const NO_PRUNING_BELOW = 2;
	let cutoff = state(null);
	let loading = state(false);
	let error = state(null);
	let abortController = null;
	let currentNetwork = state("");
	let currentIndexerUrl = "";
	async function load(indexerUrl) {
		if (abortController) abortController.abort();
		abortController = new AbortController();
		set(loading, true);
		try {
			const result = await fetchPruningCutoff(indexerUrl, abortController.signal);
			set(cutoff, result, true);
			set(error, null);
		} catch (e) {
			if (e?.name !== "AbortError") {
				set(error, e?.message || String(e), true);
				set(cutoff, null);
			}
		} finally {
			set(loading, false);
		}
	}
	const unsubscribe = queryAwareClientConfig.subscribe((config) => {
		const network = config.networks.find((n) => n.name === config.selected);
		if (!network) return;
		if (network.name === get(currentNetwork) && network.indexer === currentIndexerUrl) return;
		set(currentNetwork, network.name, true);
		currentIndexerUrl = network.indexer;
		set(cutoff, null);
		set(error, null);
		load(network.indexer);
	});
	onDestroy(() => {
		unsubscribe();
		if (abortController) abortController.abort();
	});
	const formatter = new Intl.NumberFormat("en-US");
	let chipEl = state(null);
	let mobileTooltipTop = state("4rem");
	function recomputeTooltipPosition() {
		if (!get(chipEl)) return;
		const rect = get(chipEl).getBoundingClientRect();
		set(mobileTooltipTop, `${rect.bottom + 8}px`);
	}
	var div = root_3$6();
	let styles;
	var node = child(div);
	var consequent_3 = ($$anchor) => {
		const noPruning = user_derived(() => get(cutoff).checkpoint < NO_PRUNING_BELOW);
		const tooltipAge = user_derived(() => formatVerboseAgo(get(cutoff).timestampMs));
		const dateOnly = user_derived(() => formatReadableDate(get(cutoff).timestampMs));
		const dateTime = user_derived(() => formatReadableDateTime(get(cutoff).timestampMs));
		var fragment = root$7();
		var span = first_child(fragment);
		let classes;
		var span_1 = sibling(child(span), 2);
		var text$1 = child(span_1, true);
		reset(span_1);
		next(2);
		reset(span);
		bind_this(span, ($$value) => set(chipEl, $$value), () => get(chipEl));
		var div_1 = sibling(span, 2);
		var div_2 = child(div_1);
		var node_1 = child(div_2);
		var consequent = ($$anchor) => {
			var text_1 = text();
			template_effect(() => set_text(text_1, `No pruning on ${get(currentNetwork) ?? ""}`));
			append($$anchor, text_1);
		};
		var alternate = ($$anchor) => {
			var text_2 = text();
			template_effect(($0) => set_text(text_2, `Pruning cutoff on ${get(currentNetwork) ?? ""}: checkpoint #${$0 ?? ""}`), [() => formatter.format(get(cutoff).checkpoint)]);
			append($$anchor, text_2);
		};
		if_block(node_1, ($$render) => {
			if (get(noPruning)) $$render(consequent);
			else $$render(alternate, -1);
		});
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var node_2 = child(div_3);
		var consequent_1 = ($$anchor) => {
			append($$anchor, text("The indexer still holds filtered-query data back to genesis. Everything below is\n                    currently retrievable for the entire chain history."));
		};
		var alternate_1 = ($$anchor) => {
			var text_4 = text();
			template_effect(($0) => set_text(text_4, `The indexer has pruned filtered-query indexes older than checkpoint #${$0 ?? ""} (${get(dateTime) ?? ""}${get(tooltipAge) ? `, ${get(tooltipAge)}` : ""}).`), [() => formatter.format(get(cutoff).checkpoint)]);
			append($$anchor, text_4);
		};
		if_block(node_2, ($$render) => {
			if (get(noPruning)) $$render(consequent_1);
			else $$render(alternate_1, -1);
		});
		reset(div_3);
		var div_4 = sibling(div_3, 4);
		var div_5 = child(div_4);
		var node_3 = child(div_5);
		var consequent_2 = ($$anchor) => {
			append($$anchor, text("Will be the first to go once pruning kicks in:"));
		};
		var alternate_2 = ($$anchor) => {
			append($$anchor, text("Pruned below the cutoff (filtered indexes only):"));
		};
		if_block(node_3, ($$render) => {
			if (get(noPruning)) $$render(consequent_2);
			else $$render(alternate_2, -1);
		});
		reset(div_5);
		next(2);
		reset(div_4);
		next(2);
		reset(div_1);
		template_effect(() => {
			classes = set_class(span, 1, "pruning-cutoff svelte-1x1mjxu", null, classes, { "no-pruning": get(noPruning) });
			set_text(text$1, get(noPruning) ? "none" : get(dateOnly));
		});
		append($$anchor, fragment);
	};
	var consequent_4 = ($$anchor) => {
		append($$anchor, root_1$6());
	};
	var consequent_5 = ($$anchor) => {
		var span_3 = root_2$6();
		template_effect(() => set_attribute(span_3, "title", `Failed to fetch oldest available checkpoint: ${get(error)}`));
		append($$anchor, span_3);
	};
	if_block(node, ($$render) => {
		if (get(cutoff)) $$render(consequent_3);
		else if (get(loading)) $$render(consequent_4, 1);
		else if (get(error)) $$render(consequent_5, 2);
	});
	reset(div);
	template_effect(() => styles = set_style(div, "", styles, { "--mobile-tooltip-top": get(mobileTooltipTop) }));
	event("mouseenter", div, recomputeTooltipPosition);
	delegated("focusin", div, recomputeTooltipPosition);
	append($$anchor, div);
	pop();
}
delegate(["focusin"]);
//#endregion
//#region src/lib/components/WalletSelectorModal.svelte
var root$6 = from_html(`<p class="no-wallets svelte-vpllyd">No IOTA wallets detected. Please install a wallet extension.</p>`);
var root_1$5 = from_html(`<img class="wallet-icon svelte-vpllyd"/>`);
var root_2$5 = from_html(`<button class="wallet-item svelte-vpllyd"><!> <div class="wallet-info svelte-vpllyd"><div class="wallet-name svelte-vpllyd"> </div> <div class="wallet-version svelte-vpllyd"> </div></div></button>`);
var root_3$5 = from_html(`<div class="wallet-list svelte-vpllyd"></div>`);
var root_4$5 = from_html(`<div class="modal-backdrop svelte-vpllyd"><div class="modal-content svelte-vpllyd"><div class="modal-header svelte-vpllyd"><h2 class="svelte-vpllyd">Select Wallet</h2> <button class="close-btn svelte-vpllyd">✕</button></div> <div class="modal-body svelte-vpllyd"><!></div></div></div>`);
function WalletSelectorModal($$anchor, $$props) {
	push($$props, true);
	const $iota_wallets = () => store_get(iota_wallets, "$iota_wallets", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let isOpen = prop($$props, "isOpen", 11, false);
	async function handleWalletClick(walletIndex) {
		setSelectedWallet(walletIndex);
		await connectWallet(false);
		$$props.onWalletSelected(walletIndex);
		$$props.onClose();
	}
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_2 = ($$anchor) => {
		var div = root_4$5();
		var div_1 = child(div);
		var div_2 = child(div_1);
		var button = sibling(child(div_2), 2);
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		var node_1 = child(div_3);
		var consequent = ($$anchor) => {
			append($$anchor, root$6());
		};
		var alternate = ($$anchor) => {
			var div_4 = root_3$5();
			each(div_4, 5, $iota_wallets, index, ($$anchor, wallet, index) => {
				var button_1 = root_2$5();
				var node_2 = child(button_1);
				var consequent_1 = ($$anchor) => {
					var img = root_1$5();
					template_effect(() => {
						set_attribute(img, "src", get(wallet).icon);
						set_attribute(img, "alt", get(wallet).name);
					});
					append($$anchor, img);
				};
				if_block(node_2, ($$render) => {
					if (get(wallet).icon) $$render(consequent_1);
				});
				var div_5 = sibling(node_2, 2);
				var div_6 = child(div_5);
				var text = child(div_6, true);
				reset(div_6);
				var div_7 = sibling(div_6, 2);
				var text_1 = child(div_7);
				reset(div_7);
				reset(div_5);
				reset(button_1);
				template_effect(() => {
					set_text(text, get(wallet).name);
					set_text(text_1, `v${get(wallet).version ?? ""}`);
				});
				delegated("click", button_1, () => handleWalletClick(index));
				append($$anchor, button_1);
			});
			reset(div_4);
			append($$anchor, div_4);
		};
		if_block(node_1, ($$render) => {
			if ($iota_wallets().length === 0) $$render(consequent);
			else $$render(alternate, -1);
		});
		reset(div_3);
		reset(div_1);
		reset(div);
		delegated("click", div, function(...$$args) {
			$$props.onClose?.apply(this, $$args);
		});
		delegated("click", div_1, (e) => e.stopPropagation());
		delegated("click", button, function(...$$args) {
			$$props.onClose?.apply(this, $$args);
		});
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if (isOpen()) $$render(consequent_2);
	});
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate(["click"]);
//#endregion
//#region src/lib/components/Options.svelte
var root$5 = from_html(`<option class="svelte-fsrm4y"> </option>`);
var root_1$4 = from_html(`<select class="select-input svelte-fsrm4y"><!><option class="svelte-fsrm4y">Disconnect</option></select>`);
var root_2$4 = from_html(`<div class="external-address-input-wrapper svelte-fsrm4y"><input type="text" class="external-address-input-small svelte-fsrm4y" placeholder="Address 0x..."/> <button class="remove-btn-small svelte-fsrm4y">✕</button></div>`);
var root_3$4 = from_html(`<button class="connect-btn svelte-fsrm4y">Connect Web Wallet</button> <button class="connect-btn svelte-fsrm4y">Use External Address</button>`, 1);
var root_4$4 = from_html(`<div class="option-group svelte-fsrm4y"><!></div>`);
var root_5$3 = from_html(`<div class="option-group svelte-fsrm4y"><label class="option-label svelte-fsrm4y" for="transaction-execution-select">Tx execution:</label> <select id="transaction-execution-select"></select></div>`);
var root_6$3 = from_html(`<div class="options-container svelte-fsrm4y"><!> <div class="option-group svelte-fsrm4y"><label class="option-label svelte-fsrm4y" for="network-select">Network:</label> <select class="select-input svelte-fsrm4y" id="network-select"></select> <!></div> <!></div> <!>`, 1);
function Options($$anchor, $$props) {
	push($$props, true);
	const $sharedSignerType = () => store_get(sharedSignerType, "$sharedSignerType", $$stores);
	const $addressFromQuery = () => store_get(addressFromQuery, "$addressFromQuery", $$stores);
	const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
	const $isProMode = () => store_get(isProMode, "$isProMode", $$stores);
	const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
	const $clientConfig = () => store_get(clientConfig, "$clientConfig", $$stores);
	const $sharedTransactionExecution = () => store_get(sharedTransactionExecution, "$sharedTransactionExecution", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let showWalletSelector = state(false);
	onMount(() => {
		initQueryParamHandling();
		if ($sharedSignerType() === SignerType.ExternalAddress) {
			const addressFromURL = $addressFromQuery();
			if (addressFromURL && isValidIotaAddress(addressFromURL)) {
				set(externalAddressInput, addressFromURL, true);
				addOrUpdateExternalAddress(addressFromURL);
			} else {
				const selectedAddress = getSelectedExternalAddress();
				if (selectedAddress) {
					set(externalAddressInput, selectedAddress, true);
					updateSelectedSignerAccounts(selectedAddress);
				}
			}
		}
	});
	let clientConfig = queryAwareClientConfig;
	let externalAddressInput = state("");
	function handleNetworkChange(event) {
		const selectedNetwork = event.target.value;
		sharedClientConfig.update((config) => ({
			...config,
			selected: selectedNetwork
		}));
		setQueryParam(QUERY_PARAM_KEYS.NETWORK, selectedNetwork);
	}
	function formatOptionText(account) {
		return `${account.label || "Account"} (${`${account.address.slice(0, 8)}...${account.address.slice(-6)}`})`;
	}
	function handleAddressChange(event) {
		const value = event.target.value;
		if (value === "__disconnect__") disconnectWallet();
		else store_set(activeAddress, value);
	}
	function clearExternalAddress() {
		set(externalAddressInput, "");
		store_set(sharedSignerType, SignerType.Localstorage);
		setQueryParam(QUERY_PARAM_KEYS.SIGNER, null);
		setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
		updateSelectedSignerAccounts();
	}
	function openWalletSelector() {
		set(showWalletSelector, true);
	}
	function closeWalletSelector() {
		set(showWalletSelector, false);
	}
	var fragment = root_6$3();
	var div = first_child(fragment);
	var node = child(div);
	var consequent_2 = ($$anchor) => {
		var div_1 = root_4$4();
		var node_1 = child(div_1);
		var consequent = ($$anchor) => {
			var select = root_1$4();
			var node_2 = child(select);
			each(node_2, 1, $iota_accounts, index, ($$anchor, account) => {
				var option = root$5();
				var text = child(option, true);
				reset(option);
				var option_value = {};
				template_effect(($0) => {
					set_text(text, $0);
					if (option_value !== (option_value = get(account).address)) option.value = (option.__value = get(account).address) ?? "";
				}, [() => formatOptionText(get(account))]);
				append($$anchor, option);
			});
			var option_1 = sibling(node_2);
			option_1.value = option_1.__value = "__disconnect__";
			reset(select);
			var select_value;
			init_select(select);
			template_effect(() => {
				if (select_value !== (select_value = $activeAddress())) select.value = (select.__value = $activeAddress()) ?? "", select_option(select, $activeAddress());
			});
			delegated("change", select, handleAddressChange);
			append($$anchor, select);
		};
		var consequent_1 = ($$anchor) => {
			var div_2 = root_2$4();
			var input = child(div_2);
			remove_input_defaults(input);
			var button = sibling(input, 2);
			reset(div_2);
			template_effect(() => set_value(input, get(externalAddressInput)));
			delegated("input", input, (e) => {
				const value = e.target.value;
				set(externalAddressInput, value, true);
				if (isValidIotaAddress(value)) {
					addOrUpdateExternalAddress(value);
					setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, value);
					updateSelectedSignerAccounts(value);
				}
			});
			delegated("click", button, clearExternalAddress);
			append($$anchor, div_2);
		};
		var alternate = ($$anchor) => {
			var fragment_1 = root_3$4();
			var button_1 = first_child(fragment_1);
			var button_2 = sibling(button_1, 2);
			delegated("click", button_1, () => {
				store_set(sharedSignerType, SignerType.WebWallet);
				setQueryParam(QUERY_PARAM_KEYS.SIGNER, SignerType.WebWallet);
				setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
				updateSelectedSignerAccounts();
				openWalletSelector();
			});
			delegated("click", button_2, () => {
				store_set(sharedSignerType, SignerType.ExternalAddress);
				setQueryParam(QUERY_PARAM_KEYS.SIGNER, SignerType.ExternalAddress);
				const selectedAddress = getSelectedExternalAddress();
				if (selectedAddress) {
					set(externalAddressInput, selectedAddress, true);
					setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, selectedAddress);
					updateSelectedSignerAccounts(selectedAddress);
				} else updateSelectedSignerAccounts();
			});
			append($$anchor, fragment_1);
		};
		if_block(node_1, ($$render) => {
			if ($sharedSignerType() === SignerType.WebWallet && $iota_accounts().length > 0) $$render(consequent);
			else if ($sharedSignerType() === SignerType.ExternalAddress) $$render(consequent_1, 1);
			else $$render(alternate, -1);
		});
		reset(div_1);
		append($$anchor, div_1);
	};
	if_block(node, ($$render) => {
		if (!$isProMode()) $$render(consequent_2);
	});
	var div_3 = sibling(node, 2);
	var select_1 = sibling(child(div_3), 2);
	each(select_1, 5, () => $clientConfig().networks, index, ($$anchor, network) => {
		var option_2 = root$5();
		var text_1 = child(option_2, true);
		reset(option_2);
		var option_2_value = {};
		template_effect(() => {
			set_text(text_1, get(network).name);
			if (option_2_value !== (option_2_value = get(network).name)) option_2.value = (option_2.__value = get(network).name) ?? "";
		});
		append($$anchor, option_2);
	});
	reset(select_1);
	var select_1_value;
	init_select(select_1);
	PruningCutoff(sibling(select_1, 2), {});
	reset(div_3);
	var node_4 = sibling(div_3, 2);
	var consequent_3 = ($$anchor) => {
		var div_4 = root_5$3();
		var select_2 = sibling(child(div_4), 2);
		each(select_2, 21, () => Object.values(TransactionExecution), index, ($$anchor, signer) => {
			var option_3 = root$5();
			var text_2 = child(option_3, true);
			reset(option_3);
			var option_3_value = {};
			template_effect(() => {
				set_text(text_2, get(signer));
				if (option_3_value !== (option_3_value = get(signer))) option_3.value = (option_3.__value = get(signer)) ?? "";
			});
			append($$anchor, option_3);
		});
		reset(select_2);
		reset(div_4);
		template_effect(() => set_class(select_2, 1, `select-input ${$sharedTransactionExecution() === TransactionExecution.Send ? "send-mode" : ""}`, "svelte-fsrm4y"));
		bind_select_value(select_2, $sharedTransactionExecution, ($$value) => store_set(sharedTransactionExecution, $$value));
		append($$anchor, div_4);
	};
	if_block(node_4, ($$render) => {
		if ($isProMode()) $$render(consequent_3);
	});
	reset(div);
	WalletSelectorModal(sibling(div, 2), {
		get isOpen() {
			return get(showWalletSelector);
		},
		onClose: closeWalletSelector,
		onWalletSelected: () => {}
	});
	template_effect(() => {
		if (select_1_value !== (select_1_value = $clientConfig().selected)) select_1.value = (select_1.__value = $clientConfig().selected) ?? "", select_option(select_1, $clientConfig().selected);
	});
	delegated("change", select_1, handleNetworkChange);
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate([
	"change",
	"input",
	"click"
]);
//#endregion
//#region src/lib/components/Signer.svelte
var root$4 = from_html(`<option class="svelte-1g4o6u2"> </option>`);
var root_1$3 = from_html(`<button class="connect-btn svelte-1g4o6u2">Connect</button>`);
var root_2$3 = from_html(`<button class="disconnect-btn svelte-1g4o6u2">Disconnect</button>`);
var root_3$3 = from_html(`<div class="control-group svelte-1g4o6u2"><div class="control-inline svelte-1g4o6u2"><label class="control-label svelte-1g4o6u2" for="signer-select">Signer:</label> <select class="select-input svelte-1g4o6u2" id="signer-select"></select> <!> <!></div></div>`);
var root_4$3 = from_html(`<div class="external-address-wrapper svelte-1g4o6u2"><div class="external-address-row svelte-1g4o6u2"><input type="text" placeholder="Paste or type any address (read-only)"/> <input type="text" class="alias-input svelte-1g4o6u2" placeholder="Alias (optional)"/> <button class="add-update-btn svelte-1g4o6u2">Save</button> <button class="remove-btn svelte-1g4o6u2" title="Remove current external address">✕</button></div></div>`);
var root_5$2 = from_html(`<div class="control-group svelte-1g4o6u2"><div class="control-inline svelte-1g4o6u2"><label class="control-label svelte-1g4o6u2" for="address-select">Address:</label> <div class="address-group svelte-1g4o6u2"><select class="address-select svelte-1g4o6u2" id="address-select"></select> <span class="active-address-text svelte-1g4o6u2"> </span> <button class="copy-btn svelte-1g4o6u2" title="Copy active address">📋</button></div></div></div>`);
var root_6$2 = from_html(`<div class="signer-container svelte-1g4o6u2"><div class="signer-controls svelte-1g4o6u2"><div class="control-row svelte-1g4o6u2"><!> <!> <!></div></div></div>`);
var root_7$1 = from_html(`<main><!></main> <!>`, 1);
function Signer($$anchor, $$props) {
	push($$props, true);
	const $addressFromQuery = () => store_get(addressFromQuery, "$addressFromQuery", $$stores);
	const $sharedSignerType = () => store_get(sharedSignerType, "$sharedSignerType", $$stores);
	const $isProMode = () => store_get(isProMode, "$isProMode", $$stores);
	const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
	const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let externalAddress = state("0x0000000000000000000000000000000000000000000000000000000000000000");
	let externalAlias = state("");
	let showWalletSelector = state(false);
	onMount(() => {
		const addressFromURL = $addressFromQuery();
		if (addressFromURL && isValidIotaAddress(addressFromURL)) set(externalAddress, addressFromURL, true);
		else {
			const selectedAddress = getSelectedExternalAddress();
			if (selectedAddress) {
				set(externalAddress, selectedAddress, true);
				const found = getExternalAddresses().find((addr) => addr.address === selectedAddress);
				if (found?.alias) set(externalAlias, found.alias, true);
			}
		}
		updateSelectedSignerAccounts(get(externalAddress));
	});
	function handleSignerChange(event) {
		const selectedSigner = event.target.value;
		sharedSignerType.set(selectedSigner);
		setQueryParam(QUERY_PARAM_KEYS.SIGNER, selectedSigner);
		if (selectedSigner !== SignerType.ExternalAddress) setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
		if (selectedSigner === SignerType.ExternalAddress) updateSelectedSignerAccounts();
		else updateSelectedSignerAccounts(get(externalAddress));
	}
	function handleExternalAddressChange() {
		if ($sharedSignerType() === SignerType.ExternalAddress) if (isValidIotaAddress(get(externalAddress))) {
			setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get(externalAddress));
			if (!$isProMode()) {
				addOrUpdateExternalAddress(get(externalAddress), get(externalAlias) || void 0);
				updateSelectedSignerAccounts(get(externalAddress));
			}
		} else setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, null);
	}
	function handleAddUpdateExternalAddress() {
		if (isValidIotaAddress(get(externalAddress))) {
			addOrUpdateExternalAddress(get(externalAddress), get(externalAlias) || void 0);
			setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get(externalAddress));
		}
	}
	function handleRemoveExternalAddress() {
		if (get(externalAddress)) {
			removeExternalAddress(get(externalAddress));
			const remainingAddresses = getExternalAddresses();
			if (remainingAddresses.length > 0) {
				set(externalAddress, remainingAddresses[0].address, true);
				set(externalAlias, remainingAddresses[0].alias || "", true);
			} else {
				set(externalAddress, "0x0000000000000000000000000000000000000000000000000000000000000000");
				set(externalAlias, "");
			}
			setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, get(externalAddress));
		}
	}
	function handleAddressSelection() {
		if ($sharedSignerType() === SignerType.ExternalAddress && $activeAddress()) {
			set(externalAddress, $activeAddress(), true);
			const found = getExternalAddresses().find((addr) => addr.address === $activeAddress());
			set(externalAlias, found?.alias || "", true);
			selectExternalAddress($activeAddress());
			setQueryParam(QUERY_PARAM_KEYS.EXTERNAL_ADDRESS, $activeAddress());
		}
	}
	let isAddressValid = user_derived(() => isValidIotaAddress(get(externalAddress)));
	function formatOptionText(account) {
		const label = account.label || "Account";
		const addressSnippet = `${account.address.slice(0, 8)}...${account.address.slice(-6)}`;
		const maxDisplayLength = 20;
		return `${(label.length > maxDisplayLength ? label.slice(0, maxDisplayLength - 1) + "…" : label).padEnd(21, "\xA0")}${addressSnippet}`;
	}
	function handleDisconnectWallet() {
		disconnectWallet();
	}
	function openWalletSelector() {
		set(showWalletSelector, true);
	}
	function closeWalletSelector() {
		set(showWalletSelector, false);
	}
	var fragment = root_7$1();
	var main = first_child(fragment);
	var node = child(main);
	var consequent_5 = ($$anchor) => {
		var div = root_6$2();
		var div_1 = child(div);
		var div_2 = child(div_1);
		var node_1 = child(div_2);
		var consequent_2 = ($$anchor) => {
			var div_3 = root_3$3();
			var div_4 = child(div_3);
			var select = sibling(child(div_4), 2);
			each(select, 21, () => Object.values(SignerType), index, ($$anchor, signer) => {
				var option = root$4();
				var text = child(option, true);
				reset(option);
				var option_value = {};
				template_effect(() => {
					set_text(text, get(signer));
					if (option_value !== (option_value = get(signer))) option.value = (option.__value = get(signer)) ?? "";
				});
				append($$anchor, option);
			});
			reset(select);
			var node_2 = sibling(select, 2);
			var consequent = ($$anchor) => {
				var button = root_1$3();
				delegated("click", button, openWalletSelector);
				append($$anchor, button);
			};
			if_block(node_2, ($$render) => {
				if ($sharedSignerType() == SignerType.WebWallet && $iota_accounts().length == 0) $$render(consequent);
			});
			var node_3 = sibling(node_2, 2);
			var consequent_1 = ($$anchor) => {
				var button_1 = root_2$3();
				delegated("click", button_1, handleDisconnectWallet);
				append($$anchor, button_1);
			};
			if_block(node_3, ($$render) => {
				if ($sharedSignerType() == SignerType.WebWallet && $iota_accounts().length > 0) $$render(consequent_1);
			});
			reset(div_4);
			reset(div_3);
			delegated("change", select, handleSignerChange);
			bind_select_value(select, $sharedSignerType, ($$value) => store_set(sharedSignerType, $$value));
			append($$anchor, div_3);
		};
		if_block(node_1, ($$render) => {
			if ($isProMode()) $$render(consequent_2);
		});
		var node_4 = sibling(node_1, 2);
		var consequent_3 = ($$anchor) => {
			var div_5 = root_4$3();
			var div_6 = child(div_5);
			var input = child(div_6);
			remove_input_defaults(input);
			let classes;
			var input_1 = sibling(input, 2);
			remove_input_defaults(input_1);
			var button_2 = sibling(input_1, 2);
			var button_3 = sibling(button_2, 2);
			reset(div_6);
			reset(div_5);
			template_effect(() => {
				classes = set_class(input, 1, "external-address-input svelte-1g4o6u2", null, classes, { "invalid-address": get(externalAddress) && !get(isAddressValid) });
				button_2.disabled = !get(isAddressValid);
			});
			delegated("input", input, handleExternalAddressChange);
			bind_value(input, () => get(externalAddress), ($$value) => set(externalAddress, $$value));
			bind_value(input_1, () => get(externalAlias), ($$value) => set(externalAlias, $$value));
			delegated("click", button_2, handleAddUpdateExternalAddress);
			delegated("click", button_3, handleRemoveExternalAddress);
			append($$anchor, div_5);
		};
		if_block(node_4, ($$render) => {
			if ($sharedSignerType() == SignerType.ExternalAddress) $$render(consequent_3);
		});
		var node_5 = sibling(node_4, 2);
		var consequent_4 = ($$anchor) => {
			var div_7 = root_5$2();
			var div_8 = child(div_7);
			var div_9 = sibling(child(div_8), 2);
			var select_1 = child(div_9);
			each(select_1, 5, $iota_accounts, index, ($$anchor, account) => {
				var option_1 = root$4();
				var text_1 = child(option_1, true);
				reset(option_1);
				var option_1_value = {};
				template_effect(($0) => {
					set_text(text_1, $0);
					if (option_1_value !== (option_1_value = get(account).address)) option_1.value = (option_1.__value = get(account).address) ?? "";
				}, [() => formatOptionText(get(account))]);
				append($$anchor, option_1);
			});
			reset(select_1);
			var span = sibling(select_1, 2);
			var text_2 = child(span, true);
			reset(span);
			var button_4 = sibling(span, 2);
			reset(div_9);
			reset(div_8);
			reset(div_7);
			template_effect(() => set_text(text_2, $activeAddress()));
			delegated("change", select_1, handleAddressSelection);
			bind_select_value(select_1, $activeAddress, ($$value) => store_set(activeAddress, $$value));
			delegated("click", button_4, () => {
				navigator.clipboard.writeText($activeAddress());
			});
			append($$anchor, div_7);
		};
		if_block(node_5, ($$render) => {
			if ($isProMode()) $$render(consequent_4);
		});
		reset(div_2);
		reset(div_1);
		reset(div);
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if ($isProMode()) $$render(consequent_5);
	});
	reset(main);
	WalletSelectorModal(sibling(main, 2), {
		get isOpen() {
			return get(showWalletSelector);
		},
		onClose: closeWalletSelector,
		onWalletSelected: () => {}
	});
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate([
	"change",
	"click",
	"input"
]);
//#endregion
//#region src/lib/components/Tabs.svelte
var root$3 = from_html(`<a class="tab-link svelte-126ak3w"> </a>`);
var root_1$2 = from_html(`<button> </button>`);
var root_2$2 = from_html(`<div class="tab-group svelte-126ak3w"><div class="group-label svelte-126ak3w"> </div> <div class="tab-buttons-row svelte-126ak3w"></div></div>`);
var root_3$2 = from_html(`<div><!></div>`);
var root_4$2 = from_html(`<div class="tab-groups-row svelte-126ak3w"></div> <div class="tab-contents"><div class="pageBox svelte-126ak3w"></div></div>`, 1);
function Tabs($$anchor, $$props) {
	push($$props, false);
	const $location = () => store_get(location, "$location", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const groups = mutable_source();
	const location = toStore(() => router.location);
	let items = prop($$props, "items", 24, () => []);
	let loadedTabs = mutable_source({});
	let tabComponents = prop($$props, "tabComponents", 24, () => ({}));
	async function loadTab(route) {
		if (!get(loadedTabs)[route] && tabComponents()[route]) try {
			const mod = await tabComponents()[route]();
			mutate(loadedTabs, get(loadedTabs)[route] = mod.default);
		} catch (error) {
			console.error("Failed to load tab module:", error);
			const reloadKey = "tab_chunk_reload_attempted";
			if (!sessionStorage.getItem(reloadKey)) {
				sessionStorage.setItem(reloadKey, "1");
				window.location.reload();
			}
		}
	}
	onMount(() => {
		loadTab($location());
	});
	legacy_pre_effect(() => deep_read_state(items()), () => {
		set(groups, Array.from(new Set(items().map((item) => item.group))));
	});
	legacy_pre_effect(() => $location(), () => {
		loadTab($location());
	});
	legacy_pre_effect_reset();
	init();
	var fragment = root_4$2();
	var div = first_child(fragment);
	each(div, 5, () => get(groups), index, ($$anchor, group) => {
		var div_1 = root_2$2();
		var div_2 = child(div_1);
		var text = child(div_2, true);
		reset(div_2);
		var div_3 = sibling(div_2, 2);
		each(div_3, 5, () => (deep_read_state(items()), get(group), untrack(() => items().filter((item) => item.group === get(group)))), index, ($$anchor, item) => {
			var fragment_1 = comment();
			var node = first_child(fragment_1);
			var consequent = ($$anchor) => {
				var a = root$3();
				var text_1 = child(a, true);
				reset(a);
				template_effect(() => {
					set_attribute(a, "href", (get(item), untrack(() => get(item).href)));
					set_text(text_1, (get(item), untrack(() => get(item).label)));
				});
				append($$anchor, a);
			};
			var alternate = ($$anchor) => {
				var button = root_1$2();
				var text_2 = child(button, true);
				reset(button);
				template_effect(() => {
					set_class(button, 1, clsx(($location(), get(item), untrack(() => $location() === get(item).route ? "active" : ""))), "svelte-126ak3w");
					set_text(text_2, (get(item), untrack(() => get(item).label)));
				});
				delegated("click", button, () => {
					loadTab(get(item).route);
					navigateWithGlobalParams(get(item).route);
				});
				append($$anchor, button);
			};
			if_block(node, ($$render) => {
				if (get(item), untrack(() => get(item).href)) $$render(consequent);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment_1);
		});
		reset(div_3);
		reset(div_1);
		template_effect(() => set_text(text, get(group)));
		append($$anchor, div_1);
	});
	reset(div);
	var div_4 = sibling(div, 2);
	var div_5 = child(div_4);
	each(div_5, 5, () => (get(loadedTabs), untrack(() => Object.entries(get(loadedTabs)))), index, ($$anchor, $$item) => {
		var $$array = user_derived(() => to_array(get($$item), 2));
		let route = () => get($$array)[0];
		let TabComponent = () => get($$array)[1];
		var div_6 = root_3$2();
		component(child(div_6), TabComponent, ($$anchor, $$component) => {
			$$component($$anchor, {});
		});
		reset(div_6);
		template_effect(() => set_style(div_6, `display: ${route() === $location() ? "block" : "none"};`));
		append($$anchor, div_6);
	});
	reset(div_5);
	reset(div_4);
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate(["click"]);
//#endregion
//#region src/lib/stores/transaction-tray.ts
var trayItems = writable([]);
var trayOpen = writable(false);
var expandedItemId = writable(null);
var counter = 0;
function nextId() {
	counter += 1;
	return `tx-${Date.now().toString(36)}-${counter}`;
}
function patchItem(id, patch) {
	trayItems.update((items) => items.map((it) => it.id === id ? {
		...it,
		...patch
	} : it));
}
async function runItem(id) {
	const item = get$1(trayItems).find((it) => it.id === id);
	if (!item) return;
	const runMode = item.mode;
	patchItem(id, {
		status: "running",
		error: void 0,
		lastRunMode: runMode
	});
	try {
		if (item.sender) item.transaction.setSenderIfNotSet(item.sender);
		patchItem(id, {
			status: "success",
			result: await executeTransaction(item.transaction, void 0, runMode),
			error: void 0,
			lastRunMode: runMode
		});
	} catch (err) {
		patchItem(id, {
			status: "error",
			error: err?.message ?? String(err),
			result: void 0,
			lastRunMode: runMode
		});
	}
}
/**
* Add a transaction to the tray and execute it. The result lands on the
* created card; existing tray items are untouched.
*/
async function addAndRun(input) {
	const mode = input.mode ?? get$1(sharedTransactionExecution);
	const item = {
		id: nextId(),
		label: input.label,
		sender: input.sender,
		recipients: input.recipients,
		transaction: input.transaction,
		mode,
		status: "running",
		createdAt: Date.now()
	};
	trayItems.update((items) => [...items, item]);
	trayOpen.set(true);
	expandedItemId.set(item.id);
	await runItem(item.id);
	return item.id;
}
/** Re-execute an existing tray card with its current mode. Overwrites the card. */
async function rerun(id) {
	expandedItemId.set(id);
	await runItem(id);
}
function setMode(id, mode) {
	patchItem(id, { mode });
}
function removeItem(id) {
	trayItems.update((items) => items.filter((it) => it.id !== id));
	expandedItemId.update((cur) => cur === id ? null : cur);
	if (get$1(trayItems).length === 0) trayOpen.set(false);
}
function clearTray() {
	trayItems.set([]);
	expandedItemId.set(null);
	trayOpen.set(false);
}
function toggleExpanded(id) {
	expandedItemId.update((cur) => cur === id ? null : id);
}
//#endregion
//#region src/lib/components/TransactionTrayItem.svelte
var root$2 = from_html(`<span class="meta svelte-ujayxv"> </span>`);
var root_1$1 = from_html(`<option class="svelte-ujayxv"> </option>`);
var root_2$1 = from_html(`<select title="Execution mode for the next run of this transaction"></select> <button type="button" title="Run again with the selected mode"> </button>`, 1);
var root_3$1 = from_html(`<div class="detail-running svelte-ujayxv">Running…</div>`);
var root_4$1 = from_html(`<div class="detail-error svelte-ujayxv"> </div>`);
var root_5$1 = from_html(`<div class="detail-running svelte-ujayxv">No result yet.</div>`);
var root_6$1 = from_html(`<div class="detail svelte-ujayxv"><!></div>`);
var root_7 = from_html(`<div><button type="button" class="card-header svelte-ujayxv"><span>▶</span> <span class="index svelte-ujayxv"> </span> <span> </span> <span class="label svelte-ujayxv"> </span> <!> <!></button> <div class="actions svelte-ujayxv"><!> <button type="button" class="remove-btn svelte-ujayxv" title="Remove from list" aria-label="Remove transaction">✕</button></div> <!></div>`);
function TransactionTrayItem($$anchor, $$props) {
	push($$props, true);
	const $expandedItemId = () => store_get(expandedItemId, "$expandedItemId", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let expanded = user_derived(() => $expandedItemId() === $$props.item.id);
	/** On-chain status from the result's effects, when present. Dry-run,
	*  dev-inspect and Send all expose this; Prepare doesn't (no execution). */
	function effectStatus(result) {
		if (!result || typeof result !== "object") return void 0;
		return result?.effects?.status?.status;
	}
	/** Three-way outcome that drives badge color AND the controls-hiding flag.
	*  Built from `lastRunMode` (the mode that produced the current result),
	*  not `mode` (what the dropdown is set to for the next run). */
	let outcome = user_derived(() => {
		if (!$$props.item.lastRunMode) return "pending";
		if ($$props.item.status === "running") return "running";
		if ($$props.item.status === "error") return "failure";
		return effectStatus($$props.item.result) === "failure" ? "failure" : "success";
	});
	let isExecuted = user_derived(() => $$props.item.status === "success" && $$props.item.lastRunMode === TransactionExecution.Send);
	function statusLabel(item) {
		if (get(outcome) === "running") return "running…";
		if (get(outcome) === "pending") return "pending";
		const ranAs = item.lastRunMode ?? item.mode;
		if (get(outcome) === "failure") {
			switch (ranAs) {
				case TransactionExecution.DevInspect: return "dev-inspect failed";
				case TransactionExecution.DryRun: return "dry-run failed";
				case TransactionExecution.Send: return "execution failed";
				case TransactionExecution.Prepare: return "prepare failed";
			}
			return "failed";
		}
		switch (ranAs) {
			case TransactionExecution.DevInspect: return "dev-inspect";
			case TransactionExecution.DryRun: return "dry-run";
			case TransactionExecution.Send: return "executed";
			case TransactionExecution.Prepare: return "prepared bytes";
		}
		return "done";
	}
	/** Compact labels for the per-card mode picker — the verbose enum values
	*  ("dev-inspect (simulation, free)") force the <select> wide enough to
	*  push the Run / × buttons off-screen on narrow mobile viewports. */
	function modeLabel(mode) {
		switch (mode) {
			case TransactionExecution.DevInspect: return "Dev-inspect";
			case TransactionExecution.DryRun: return "Dry-run";
			case TransactionExecution.Send: return "Send";
			case TransactionExecution.Prepare: return "Prepare bytes";
		}
		return mode;
	}
	function shortAddr(a) {
		if (!a) return "";
		return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
	}
	var div = root_7();
	let classes;
	var button = child(div);
	var span = child(button);
	let classes_1;
	var span_1 = sibling(span, 2);
	var text = child(span_1);
	reset(span_1);
	var span_2 = sibling(span_1, 2);
	var text_1 = child(span_2, true);
	reset(span_2);
	var span_3 = sibling(span_2, 2);
	var text_2 = child(span_3, true);
	reset(span_3);
	var node = sibling(span_3, 2);
	var consequent = ($$anchor) => {
		var span_4 = root$2();
		var text_3 = child(span_4);
		reset(span_4);
		template_effect(($0) => {
			set_attribute(span_4, "title", `Sender: ${$$props.item.sender ?? ""}`);
			set_text(text_3, `from ${$0 ?? ""}`);
		}, [() => shortAddr($$props.item.sender)]);
		append($$anchor, span_4);
	};
	if_block(node, ($$render) => {
		if ($$props.item.sender) $$render(consequent);
	});
	var node_1 = sibling(node, 2);
	var consequent_1 = ($$anchor) => {
		var span_5 = root$2();
		var text_4 = child(span_5);
		reset(span_5);
		template_effect(($0, $1) => {
			set_attribute(span_5, "title", $0);
			set_text(text_4, `→ ${$1 ?? ""}`);
		}, [() => $$props.item.recipients.join(", "), () => $$props.item.recipients.length === 1 ? shortAddr($$props.item.recipients[0]) : `${$$props.item.recipients.length} recipients`]);
		append($$anchor, span_5);
	};
	if_block(node_1, ($$render) => {
		if ($$props.item.recipients && $$props.item.recipients.length > 0) $$render(consequent_1);
	});
	reset(button);
	var div_1 = sibling(button, 2);
	var node_2 = child(div_1);
	var consequent_2 = ($$anchor) => {
		var fragment = root_2$1();
		var select = first_child(fragment);
		let classes_2;
		each(select, 21, () => Object.values(TransactionExecution), index, ($$anchor, m) => {
			var option = root_1$1();
			var text_5 = child(option, true);
			reset(option);
			var option_value = {};
			template_effect(($0) => {
				set_attribute(option, "title", get(m));
				set_text(text_5, $0);
				if (option_value !== (option_value = get(m))) option.value = (option.__value = get(m)) ?? "";
			}, [() => modeLabel(get(m))]);
			append($$anchor, option);
		});
		reset(select);
		var select_value;
		init_select(select);
		var button_1 = sibling(select, 2);
		let classes_3;
		var text_6 = child(button_1, true);
		reset(button_1);
		template_effect(() => {
			classes_2 = set_class(select, 1, "mode-select svelte-ujayxv", null, classes_2, { "send-mode": $$props.item.mode === TransactionExecution.Send });
			select.disabled = $$props.item.status === "running";
			if (select_value !== (select_value = $$props.item.mode)) select.value = (select.__value = $$props.item.mode) ?? "", select_option(select, $$props.item.mode);
			classes_3 = set_class(button_1, 1, "run-btn svelte-ujayxv", null, classes_3, { "send-mode": $$props.item.mode === TransactionExecution.Send });
			button_1.disabled = $$props.item.status === "running";
			set_text(text_6, $$props.item.status === "running" ? "…" : "Run");
		});
		delegated("change", select, (e) => setMode($$props.item.id, e.target.value));
		delegated("click", select, (e) => e.stopPropagation());
		delegated("click", button_1, (e) => {
			e.stopPropagation();
			rerun($$props.item.id);
		});
		append($$anchor, fragment);
	};
	if_block(node_2, ($$render) => {
		if (!get(isExecuted)) $$render(consequent_2);
	});
	var button_2 = sibling(node_2, 2);
	reset(div_1);
	var node_3 = sibling(div_1, 2);
	var consequent_6 = ($$anchor) => {
		var div_2 = root_6$1();
		var node_4 = child(div_2);
		var consequent_3 = ($$anchor) => {
			append($$anchor, root_3$1());
		};
		var consequent_4 = ($$anchor) => {
			var div_4 = root_4$1();
			var text_7 = child(div_4, true);
			reset(div_4);
			template_effect(() => set_text(text_7, $$props.item.error));
			append($$anchor, div_4);
		};
		var consequent_5 = ($$anchor) => {
			TransactionView($$anchor, { get value() {
				return $$props.item.result;
			} });
		};
		var alternate = ($$anchor) => {
			append($$anchor, root_5$1());
		};
		if_block(node_4, ($$render) => {
			if ($$props.item.status === "running") $$render(consequent_3);
			else if ($$props.item.status === "error") $$render(consequent_4, 1);
			else if ($$props.item.result !== void 0) $$render(consequent_5, 2);
			else $$render(alternate, -1);
		});
		reset(div_2);
		append($$anchor, div_2);
	};
	if_block(node_3, ($$render) => {
		if (get(expanded)) $$render(consequent_6);
	});
	reset(div);
	template_effect(($0) => {
		classes = set_class(div, 1, "card svelte-ujayxv", null, classes, {
			expanded: get(expanded),
			running: $$props.item.status === "running"
		});
		set_attribute(button, "aria-expanded", get(expanded));
		set_attribute(button, "title", get(expanded) ? "Collapse" : "Click to view details");
		classes_1 = set_class(span, 1, "caret svelte-ujayxv", null, classes_1, { open: get(expanded) });
		set_text(text, `#${$$props.index + 1}`);
		set_class(span_2, 1, `status status-${get(outcome) ?? ""}`, "svelte-ujayxv");
		set_text(text_1, $0);
		set_attribute(span_3, "title", $$props.item.label);
		set_text(text_2, $$props.item.label);
	}, [() => statusLabel($$props.item)]);
	delegated("click", button, () => toggleExpanded($$props.item.id));
	delegated("click", button_2, (e) => {
		e.stopPropagation();
		removeItem($$props.item.id);
	});
	append($$anchor, div);
	pop();
	$$cleanup();
}
delegate(["click", "change"]);
//#endregion
//#region src/lib/components/TransactionTray.svelte
var root$1 = from_html(`<div class="resize-handle svelte-1bcgql0" role="separator" aria-orientation="horizontal" aria-label="Resize transaction list" tabindex="0" title="Drag to resize"><span class="grip svelte-1bcgql0"></span></div>`);
var root_1 = from_html(`<span class="dot dot-running svelte-1bcgql0"></span> `, 1);
var root_2 = from_html(`<span class="dot dot-ok svelte-1bcgql0"></span> `, 1);
var root_3 = from_html(`<span class="dot dot-sent svelte-1bcgql0"></span> `, 1);
var root_4 = from_html(`<span class="dot dot-err svelte-1bcgql0"></span> `, 1);
var root_5 = from_html(`<div class="tray-body svelte-1bcgql0"></div>`);
var root_6 = from_html(`<div><!> <div class="tray-handle svelte-1bcgql0"><button type="button" class="toggle-btn svelte-1bcgql0"><span>▲</span> <span class="title svelte-1bcgql0"> </span> <span class="summary svelte-1bcgql0"><!> <!> <!> <!></span> <span class="hint svelte-1bcgql0"> </span></button> <button type="button" class="clear-btn svelte-1bcgql0" title="Remove all transactions from the list">Clear all</button></div> <!></div>`);
function TransactionTray($$anchor, $$props) {
	push($$props, true);
	const $trayOpen = () => store_get(trayOpen, "$trayOpen", $$stores);
	const $trayItems = () => store_get(trayItems, "$trayItems", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const STORAGE_KEY = "iotatools.tray.heightPx";
	const MIN_HEIGHT = 60;
	const DEFAULT_FRACTION = .5;
	let trayHeight = state(0);
	let dragging = state(false);
	let dragStartY = 0;
	let dragStartHeight = 0;
	let resizeHandleEl = state(void 0);
	let trayHandleEl = state(void 0);
	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			const n = parseInt(saved, 10);
			if (!Number.isNaN(n)) set(trayHeight, clamp(n), true);
		}
		const onResize = () => {
			set(trayHeight, clamp(effectiveHeight()), true);
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	});
	function chromeHeight() {
		return (get(resizeHandleEl)?.offsetHeight ?? 10) + (get(trayHandleEl)?.offsetHeight ?? 50);
	}
	function viewportMax() {
		return Math.max(MIN_HEIGHT, window.innerHeight - chromeHeight());
	}
	function clamp(h) {
		return Math.min(Math.max(h, MIN_HEIGHT), viewportMax());
	}
	function effectiveHeight() {
		return get(trayHeight) > 0 ? get(trayHeight) : Math.round(window.innerHeight * DEFAULT_FRACTION);
	}
	function onPointerDown(e) {
		if (e.button !== void 0 && e.button !== 0) return;
		if (!$trayOpen()) trayOpen.set(true);
		set(dragging, true);
		dragStartY = e.clientY;
		dragStartHeight = effectiveHeight();
		e.target.setPointerCapture(e.pointerId);
		e.preventDefault();
	}
	function onPointerMove(e) {
		if (!get(dragging)) return;
		const next = clamp(dragStartHeight + (dragStartY - e.clientY));
		set(trayHeight, next, true);
	}
	function onPointerUp(e) {
		if (!get(dragging)) return;
		set(dragging, false);
		try {
			e.target.releasePointerCapture(e.pointerId);
		} catch {}
		try {
			localStorage.setItem(STORAGE_KEY, String(get(trayHeight)));
		} catch {}
	}
	function onResizeKey(e) {
		const step = e.shiftKey ? 80 : 24;
		if (e.key === "ArrowUp") {
			set(trayHeight, clamp(effectiveHeight() + step), true);
			if (!$trayOpen()) trayOpen.set(true);
			e.preventDefault();
		} else if (e.key === "ArrowDown") {
			set(trayHeight, clamp(effectiveHeight() - step), true);
			e.preventDefault();
		}
	}
	function effectFailed(result) {
		if (!result || typeof result !== "object") return false;
		return result?.effects?.status?.status === "failure";
	}
	let counts = user_derived(() => {
		const items = $trayItems();
		let running = 0;
		let error = 0;
		let executed = 0;
		let simulated = 0;
		for (const i of items) {
			if (i.status === "running") {
				running++;
				continue;
			}
			if (i.status === "error" || effectFailed(i.result)) {
				error++;
				continue;
			}
			if (i.lastRunMode === TransactionExecution.Send) executed++;
			else simulated++;
		}
		return {
			total: items.length,
			running,
			error,
			executed,
			simulated
		};
	});
	let bodyStyle = user_derived(() => $trayOpen() ? `height: ${effectiveHeight()}px;` : "");
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_6 = ($$anchor) => {
		var div = root_6();
		let classes;
		var node_1 = child(div);
		var consequent = ($$anchor) => {
			var div_1 = root$1();
			bind_this(div_1, ($$value) => set(resizeHandleEl, $$value), () => get(resizeHandleEl));
			delegated("pointerdown", div_1, onPointerDown);
			delegated("pointermove", div_1, onPointerMove);
			delegated("pointerup", div_1, onPointerUp);
			event("pointercancel", div_1, onPointerUp);
			delegated("keydown", div_1, onResizeKey);
			append($$anchor, div_1);
		};
		if_block(node_1, ($$render) => {
			if ($trayOpen()) $$render(consequent);
		});
		var div_2 = sibling(node_1, 2);
		var button = child(div_2);
		var span = child(button);
		let classes_1;
		var span_1 = sibling(span, 2);
		var text = child(span_1);
		reset(span_1);
		var span_2 = sibling(span_1, 2);
		var node_2 = child(span_2);
		var consequent_1 = ($$anchor) => {
			var fragment_1 = root_1();
			var text_1 = sibling(first_child(fragment_1));
			template_effect(() => set_text(text_1, `${get(counts).running ?? ""} running`));
			append($$anchor, fragment_1);
		};
		if_block(node_2, ($$render) => {
			if (get(counts).running > 0) $$render(consequent_1);
		});
		var node_3 = sibling(node_2, 2);
		var consequent_2 = ($$anchor) => {
			var fragment_2 = root_2();
			var text_2 = sibling(first_child(fragment_2));
			template_effect(() => set_text(text_2, `${get(counts).simulated ?? ""} simulated`));
			append($$anchor, fragment_2);
		};
		if_block(node_3, ($$render) => {
			if (get(counts).simulated > 0) $$render(consequent_2);
		});
		var node_4 = sibling(node_3, 2);
		var consequent_3 = ($$anchor) => {
			var fragment_3 = root_3();
			var text_3 = sibling(first_child(fragment_3));
			template_effect(() => set_text(text_3, `${get(counts).executed ?? ""} executed`));
			append($$anchor, fragment_3);
		};
		if_block(node_4, ($$render) => {
			if (get(counts).executed > 0) $$render(consequent_3);
		});
		var node_5 = sibling(node_4, 2);
		var consequent_4 = ($$anchor) => {
			var fragment_4 = root_4();
			var text_4 = sibling(first_child(fragment_4));
			template_effect(() => set_text(text_4, `${get(counts).error ?? ""} error`));
			append($$anchor, fragment_4);
		};
		if_block(node_5, ($$render) => {
			if (get(counts).error > 0) $$render(consequent_4);
		});
		reset(span_2);
		var span_3 = sibling(span_2, 2);
		var text_5 = child(span_3, true);
		reset(span_3);
		reset(button);
		var button_1 = sibling(button, 2);
		reset(div_2);
		bind_this(div_2, ($$value) => set(trayHandleEl, $$value), () => get(trayHandleEl));
		var node_6 = sibling(div_2, 2);
		var consequent_5 = ($$anchor) => {
			var div_3 = root_5();
			each(div_3, 7, $trayItems, (item) => item.id, ($$anchor, item, i) => {
				TransactionTrayItem($$anchor, {
					get item() {
						return get(item);
					},
					get index() {
						return get(i);
					}
				});
			});
			reset(div_3);
			template_effect(() => set_style(div_3, get(bodyStyle)));
			append($$anchor, div_3);
		};
		if_block(node_6, ($$render) => {
			if ($trayOpen()) $$render(consequent_5);
		});
		reset(div);
		template_effect(() => {
			classes = set_class(div, 1, "tray svelte-1bcgql0", null, classes, {
				open: $trayOpen(),
				dragging: get(dragging)
			});
			set_attribute(button, "aria-expanded", $trayOpen());
			set_attribute(button, "title", $trayOpen() ? "Collapse transaction list" : "Expand transaction list");
			classes_1 = set_class(span, 1, "caret svelte-1bcgql0", null, classes_1, { open: $trayOpen() });
			set_text(text, `Transactions (${get(counts).total ?? ""})`);
			set_text(text_5, $trayOpen() ? "click to collapse" : "click to expand");
		});
		delegated("click", button, () => trayOpen.set(!$trayOpen()));
		delegated("click", button_1, function(...$$args) {
			clearTray?.apply(this, $$args);
		});
		append($$anchor, div);
	};
	if_block(node, ($$render) => {
		if ($trayItems().length > 0) $$render(consequent_6);
	});
	append($$anchor, fragment);
	pop();
	$$cleanup();
}
delegate([
	"pointerdown",
	"pointermove",
	"pointerup",
	"keydown",
	"click"
]);
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return import.meta.resolve(specifier);
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			).href;
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			dep = importMetaResolve(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/App.svelte
var root = from_html(`<main><header class="app-header svelte-1n46o8q"><div class="header-row svelte-1n46o8q"><div class="warning-banner svelte-1n46o8q">Experimental website, use at your own risk.</div> <div class="header-controls svelte-1n46o8q"><!> <div class="pro-toggle svelte-1n46o8q"><button class="pro-mode-btn svelte-1n46o8q"> </button></div></div></div></header> <div class="app-content svelte-1n46o8q"><!> <!></div> <footer class="app-footer svelte-1n46o8q"><div class="footer-content svelte-1n46o8q"><a href="https://github.com/Thoralf-M/iotatools" target="_blank" rel="noopener noreferrer" class="github-link svelte-1n46o8q">View on GitHub</a> <button class="impressum-link svelte-1n46o8q">Impressum</button> <button class="datenschutz-link svelte-1n46o8q">Datenschutz</button> <button class="disclaimer-link svelte-1n46o8q">Disclaimer</button></div></footer> <!> <!> <!></main>`);
function App($$anchor, $$props) {
	push($$props, false);
	const $isProMode = () => store_get(isProMode, "$isProMode", $$stores);
	const $trayItems = () => store_get(trayItems, "$trayItems", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const items = mutable_source();
	const pageImports = {
		IotaSystemState: () => __vitePreload(() => import("./IotaSystemState-BYb61VcE.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9])),
		Transaction: () => __vitePreload(() => import("./Transaction-ClZy4dNj.js"), __vite__mapDeps([10,1,2,3,4,6,7,11,12,13])),
		Object: () => __vitePreload(() => import("./Object-BkE_nZwH.js"), __vite__mapDeps([14,1,3,4,15,11,12,16,17,18,19,20,21,22])),
		PTBs: () => __vitePreload(() => import("./PTBs-DaU_ZiMJ.js"), __vite__mapDeps([23,1,2,3,4,15,24,25,20,26,11,19,27])),
		DynamicFields: () => __vitePreload(() => import("./DynamicFields-B7T7iFM5.js"), __vite__mapDeps([28,1,3,4,12,5,2,6,7,8,16,11,17,18,19,20])),
		StakingRewards: () => __vitePreload(() => import("./StakingRewards-Nu6kVNlM.js"), __vite__mapDeps([29,1,2,3,4,30,20,12,24,5,6,7,8,31,11,16,17,18,19,25,26,32])),
		Delegators: () => __vitePreload(() => import("./Delegators-DnBGQy51.js"), __vite__mapDeps([33,1,2,3,4,11,19,20,24,34])),
		MultiAccountView: () => __vitePreload(() => import("./MultiAccountView-D8I9je_k.js"), __vite__mapDeps([35,1,3,4,30,20,12,24,31,11,16,17,18,19,36,25,37])),
		AccountsList: () => __vitePreload(() => import("./AccountsList-BTh0dcos.js"), __vite__mapDeps([38,1,2,4,30,20,3,39])),
		Keystone: () => __vitePreload(() => import("./Keystone-DsnI1Xct.js"), __vite__mapDeps([40,20,1,2,3,4,41])),
		LedgerNano: () => __vitePreload(() => import("./LedgerNano-BpkOMmlP.js"), __vite__mapDeps([42,20,1,3,4,43,5,2,6,7,8,44])),
		Sign: () => __vitePreload(() => import("./Sign-cLla8y2n.js"), __vite__mapDeps([45,1,2,3,4,30,20,12,5,6,7,8,46])),
		PublishData: () => __vitePreload(() => import("./PublishData-Gg-rxGXC.js"), __vite__mapDeps([47,1,2,3,4,48,49,30,20,50])),
		SplitMergeCoins: () => __vitePreload(() => import("./SplitMergeCoins-B5T0WqHi.js"), __vite__mapDeps([51,1,3,4,30,20,5,2,6,7,8,52,53,54])),
		ProgrammableTransactionBlock: () => __vitePreload(() => import("./ProgrammableTransactionBlock-Cjze8PYD.js"), __vite__mapDeps([55,20,1,3,4,43,49,30,56])),
		BulkTransfer: () => __vitePreload(() => import("./BulkTransfer-CsdvMlME.js"), __vite__mapDeps([57,1,2,3,4,30,20,58])),
		Stake: () => __vitePreload(() => import("./Stake-8C_Ch4bz.js"), __vite__mapDeps([59,1,2,3,4,30,20,52,53,36,60])),
		Faucet: () => __vitePreload(() => import("./Faucet-d2a1BJWZ.js"), __vite__mapDeps([61,1,2,3,4,30,20,5,6,7,8,62,63])),
		Converter: () => __vitePreload(() => import("./Converter-D28MhnLp.js"), __vite__mapDeps([64,1,2,3,4,12,18,17,65,66])),
		TextAnalyzer: () => __vitePreload(() => import("./TextAnalyzer-wSQSHW76.js"), __vite__mapDeps([67,1,68])),
		Ed25519AddressGeneration: () => __vitePreload(() => import("./Ed25519AddressGeneration-BUTRs3Yp.js"), __vite__mapDeps([69,1,2,4,17,65,70])),
		IotaNames: () => __vitePreload(() => import("./IotaNames-Cddw8uib.js"), __vite__mapDeps([71,1,3,4,11,48,49,30,20,19,52,53,21,72])),
		CandidateStake: () => __vitePreload(() => import("./CandidateStake-tLulkV0P.js"), __vite__mapDeps([73,1,3,4,15,48,49,30,20,74])),
		Settings: () => __vitePreload(() => import("./Settings-IPrydqCi.js"), __vite__mapDeps([75,1,2,3,4,30,20,76])),
		Txs: () => __vitePreload(() => import("./Txs-8GwNxghr.js"), __vite__mapDeps([77,1,3,4,6,2,7,15,11,12,19,20,16,17,18,78,79])),
		TxsVisualizer: () => __vitePreload(() => import("./TxsVisualizer-CGWoO2QS.js"), __vite__mapDeps([80,1,3,4,15,78,11,81])),
		Impressum: () => __vitePreload(() => import("./Impressum-8l1HLATd.js"), __vite__mapDeps([82,1,2])),
		Datenschutz: () => __vitePreload(() => import("./Datenschutz-Bd4742cF.js"), __vite__mapDeps([83,1,2])),
		Disclaimer: () => __vitePreload(() => import("./Disclaimer-gEOR4ZRh.js"), __vite__mapDeps([84,1,85])),
		OnChainApps: () => __vitePreload(() => import("./OnChainApps-izxJMXne.js"), __vite__mapDeps([86,1,3,4,12,62,87]))
	};
	wrap({ asyncComponent: pageImports["IotaSystemState"] }), wrap({ asyncComponent: pageImports["IotaSystemState"] }), wrap({ asyncComponent: pageImports["Transaction"] }), wrap({ asyncComponent: pageImports["Object"] }), wrap({ asyncComponent: pageImports["PTBs"] }), wrap({ asyncComponent: pageImports["DynamicFields"] }), wrap({ asyncComponent: pageImports["StakingRewards"] }), wrap({ asyncComponent: pageImports["Delegators"] }), wrap({ asyncComponent: pageImports["MultiAccountView"] }), wrap({ asyncComponent: pageImports["AccountsList"] }), wrap({ asyncComponent: pageImports["Keystone"] }), wrap({ asyncComponent: pageImports["LedgerNano"] }), wrap({ asyncComponent: pageImports["Sign"] }), wrap({ asyncComponent: pageImports["PublishData"] }), wrap({ asyncComponent: pageImports["SplitMergeCoins"] }), wrap({ asyncComponent: pageImports["ProgrammableTransactionBlock"] }), wrap({ asyncComponent: pageImports["BulkTransfer"] }), wrap({ asyncComponent: pageImports["Stake"] }), wrap({ asyncComponent: pageImports["Faucet"] }), wrap({ asyncComponent: pageImports["Converter"] }), wrap({ asyncComponent: pageImports["TextAnalyzer"] }), wrap({ asyncComponent: pageImports["Ed25519AddressGeneration"] }), wrap({ asyncComponent: pageImports["IotaNames"] }), wrap({ asyncComponent: pageImports["CandidateStake"] }), wrap({ asyncComponent: pageImports["Settings"] }), wrap({ asyncComponent: pageImports["Txs"] }), wrap({ asyncComponent: pageImports["TxsVisualizer"] }), wrap({ asyncComponent: pageImports["Impressum"] }), wrap({ asyncComponent: pageImports["Datenschutz"] }), wrap({ asyncComponent: pageImports["Disclaimer"] }), wrap({ asyncComponent: pageImports["OnChainApps"] });
	const allItems = [
		{
			label: "IOTA System State",
			route: "/iota-system-state",
			group: "Info"
		},
		{
			label: "Transaction",
			route: "/transaction",
			group: "Info"
		},
		{
			label: "Object",
			route: "/object",
			group: "Info"
		},
		{
			label: "PTBs",
			route: "/ptbs",
			group: "Info"
		},
		{
			label: "Dynamic Fields",
			route: "/dynamic-fields",
			group: "Info"
		},
		{
			label: "Staking Rewards",
			route: "/staking-rewards",
			group: "Info"
		},
		{
			label: "Delegators",
			route: "/delegators",
			group: "Info"
		},
		{
			label: "Txs",
			route: "/txs",
			group: "Info"
		},
		{
			label: "Txs Visualizer",
			route: "/txs-visualizer",
			group: "Info"
		},
		{
			label: "Multi Account View",
			route: "/multi-account-view",
			group: "Wallet"
		},
		{
			label: "Accounts List",
			route: "/accounts-list",
			group: "Wallet"
		},
		{
			label: "Keystone",
			route: "/keystone",
			group: "Wallet"
		},
		{
			label: "LedgerNano",
			route: "/ledger-nano",
			group: "Wallet"
		},
		{
			label: "Sign",
			route: "/sign",
			group: "Wallet"
		},
		{
			label: "Publish Data",
			route: "/publish-data",
			group: "Transactions"
		},
		{
			label: "Split Merge Coins",
			route: "/split-merge-coins",
			group: "Transactions"
		},
		{
			label: "PTB",
			route: "/programmable-transaction-block",
			group: "Transactions"
		},
		{
			label: "Bulk Transfer",
			route: "/bulk-transfer",
			group: "Transactions"
		},
		{
			label: "Stake",
			route: "/stake",
			group: "Transactions"
		},
		{
			label: "Faucet",
			route: "/faucet",
			group: "Utilities"
		},
		{
			label: "Converter",
			route: "/converter",
			group: "Utilities"
		},
		{
			label: "Text Analyzer",
			route: "/text-analyzer",
			group: "Utilities"
		},
		{
			label: "Address generation",
			route: "/address-generation",
			group: "Utilities"
		},
		{
			label: "On-Chain Apps",
			route: "/onchain-apps",
			group: "Other"
		},
		{
			label: "IOTA-Names",
			route: "/iota-names",
			group: "Other"
		},
		{
			label: "Candidate Stake",
			route: "/candidate-stake",
			group: "Other"
		},
		{
			label: "⚙ Settings",
			route: "/settings",
			group: "Other"
		},
		{
			label: "Explorer ↗",
			href: "/explorer/",
			group: "Other"
		}
	];
	legacy_pre_effect(() => $isProMode(), () => {
		set(items, $isProMode() ? allItems.map((e, index) => ({
			...e,
			value: index
		})) : allItems.filter((e) => [
			"Transaction",
			"Staking Rewards",
			"Txs Visualizer",
			"Explorer ↗",
			"Multi Account View",
			"Sign",
			"Split Merge Coins",
			"Bulk Transfer"
		].includes(e.label)).map((e, index) => ({
			...e,
			value: index,
			group: ""
		})));
	});
	legacy_pre_effect_reset();
	init();
	var main = root();
	let classes;
	var header = child(main);
	var div = child(header);
	var div_1 = sibling(child(div), 2);
	var node = child(div_1);
	Options(node, {});
	var div_2 = sibling(node, 2);
	var button = child(div_2);
	var text = child(button, true);
	reset(button);
	reset(div_2);
	reset(div_1);
	reset(div);
	reset(header);
	var div_3 = sibling(header, 2);
	var node_1 = child(div_3);
	Signer(node_1, {});
	var node_2 = sibling(node_1, 2);
	{
		let $0 = derived_safe_equal(() => untrack(() => ({
			"/iota-system-state": pageImports.IotaSystemState,
			"/transaction": pageImports.Transaction,
			"/object": pageImports.Object,
			"/ptbs": pageImports.PTBs,
			"/dynamic-fields": pageImports.DynamicFields,
			"/staking-rewards": pageImports.StakingRewards,
			"/delegators": pageImports.Delegators,
			"/txs-visualizer": pageImports.TxsVisualizer,
			"/multi-account-view": pageImports.MultiAccountView,
			"/accounts-list": pageImports.AccountsList,
			"/keystone": pageImports.Keystone,
			"/ledger-nano": pageImports.LedgerNano,
			"/sign": pageImports.Sign,
			"/publish-data": pageImports.PublishData,
			"/split-merge-coins": pageImports.SplitMergeCoins,
			"/programmable-transaction-block": pageImports.ProgrammableTransactionBlock,
			"/bulk-transfer": pageImports.BulkTransfer,
			"/stake": pageImports.Stake,
			"/faucet": pageImports.Faucet,
			"/converter": pageImports.Converter,
			"/text-analyzer": pageImports.TextAnalyzer,
			"/address-generation": pageImports.Ed25519AddressGeneration,
			"/iota-names": pageImports.IotaNames,
			"/candidate-stake": pageImports.CandidateStake,
			"/settings": pageImports.Settings,
			"/txs": pageImports.Txs,
			"/impressum": pageImports.Impressum,
			"/datenschutz": pageImports.Datenschutz,
			"/disclaimer": pageImports.Disclaimer,
			"/onchain-apps": pageImports.OnChainApps
		})));
		Tabs(node_2, {
			get items() {
				return get(items);
			},
			get tabComponents() {
				return get($0);
			}
		});
	}
	reset(div_3);
	var footer = sibling(div_3, 2);
	var div_4 = child(footer);
	var button_1 = sibling(child(div_4), 2);
	var button_2 = sibling(button_1, 2);
	var button_3 = sibling(button_2, 2);
	reset(div_4);
	reset(footer);
	var node_3 = sibling(footer, 2);
	DisclaimerModal(node_3, {});
	var node_4 = sibling(node_3, 2);
	MainnetTransactionConfirmation(node_4, {});
	TransactionTray(sibling(node_4, 2), {});
	reset(main);
	template_effect(() => {
		classes = set_class(main, 1, "svelte-1n46o8q", null, classes, { "has-tray": $trayItems().length > 0 });
		set_text(text, $isProMode() ? "Disable Pro Mode" : "Enable Pro Mode");
	});
	delegated("click", button, () => store_set(isProMode, !$isProMode()));
	delegated("click", button_1, () => navigateWithGlobalParams("/impressum"));
	delegated("click", button_2, () => navigateWithGlobalParams("/datenschutz"));
	delegated("click", button_3, () => navigateWithGlobalParams("/disclaimer"));
	append($$anchor, main);
	pop();
	$$cleanup();
}
delegate(["click"]);
//#endregion
//#region src/main.ts
initQueryParamHandling();
mount(App, { target: document.getElementById("app") });
//#endregion
export { nanoToIotaFormatted as _, MoveAuthenticatorDetails as a, parsePartialSignatures as c, verifyTransactionSignature as d, require_buffer as f, nanoToIota as g, iotaToNano as h, TransactionView as i, publicKeyFromRawBytes as l, formatNumbersWithUnderscores as m, addAndRun as n, copyToClipboard as o, formatNumberWithUnderscores as p, queryParams as r, formatAddress as s, __vitePreload as t, verifyPersonalMessageSignature as u, TransactionCommands as v, router as y };

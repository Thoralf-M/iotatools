import "./rolldown-runtime-D3Q5gio6.js";
import { Ct as get$1, Tt as writable } from "./disclose-version-CpEJO7r1.js";
import { D as keypairFromBech32PrivateKey, O as toWalletAccounts, S as sharedSignerType, _ as sharedExternalAddresses, b as sharedPrivateKeyAccounts, d as SignerType, t as getClient, x as sharedSelectedAddress } from "./client-BTFoHz6u.js";
//#region node_modules/.pnpm/@wallet-standard+app@1.1.1/node_modules/@wallet-standard/app/lib/esm/wallets.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AppReadyEvent_detail;
var wallets = void 0;
var registeredWalletsSet = /* @__PURE__ */ new Set();
function addRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.delete(wallet);
}
var listeners = {};
/**
* Get an API for {@link Wallets.get | getting}, {@link Wallets.on | listening for}, and
* {@link Wallets.register | registering} {@link "@wallet-standard/base".Wallet | Wallets}.
*
* When called for the first time --
*
* This dispatches a {@link "@wallet-standard/base".WindowAppReadyEvent} to notify each Wallet that the app is ready
* to register it.
*
* This also adds a listener for {@link "@wallet-standard/base".WindowRegisterWalletEvent} to listen for a notification
* from each Wallet that the Wallet is ready to be registered by the app.
*
* This combination of event dispatch and listener guarantees that each Wallet will be registered synchronously as soon
* as the app is ready whether the app loads before or after each Wallet.
*
* @return API for getting, listening for, and registering Wallets.
*
* @group App
*/
function getWallets() {
	if (wallets) return wallets;
	wallets = Object.freeze({
		register,
		get,
		on
	});
	if (typeof window === "undefined") return wallets;
	const api = Object.freeze({ register });
	try {
		window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
	} catch (error) {
		console.error("wallet-standard:register-wallet event listener could not be added\n", error);
	}
	try {
		window.dispatchEvent(new AppReadyEvent(api));
	} catch (error) {
		console.error("wallet-standard:app-ready event could not be dispatched\n", error);
	}
	return wallets;
}
function register(...wallets) {
	wallets = wallets.filter((wallet) => !registeredWalletsSet.has(wallet));
	if (!wallets.length) return () => {};
	wallets.forEach((wallet) => addRegisteredWallet(wallet));
	listeners["register"]?.forEach((listener) => guard(() => listener(...wallets)));
	return function unregister() {
		wallets.forEach((wallet) => removeRegisteredWallet(wallet));
		listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets)));
	};
}
var cachedWalletsArray;
function get() {
	if (!cachedWalletsArray) cachedWalletsArray = [...registeredWalletsSet];
	return cachedWalletsArray;
}
function on(event, listener) {
	listeners[event]?.push(listener) || (listeners[event] = [listener]);
	return function off() {
		listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
	};
}
function guard(callback) {
	try {
		callback();
	} catch (error) {
		console.error(error);
	}
}
var AppReadyEvent = class extends Event {
	get detail() {
		return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
	}
	get type() {
		return "wallet-standard:app-ready";
	}
	constructor(api) {
		super("wallet-standard:app-ready", {
			bubbles: false,
			cancelable: false,
			composed: false
		});
		_AppReadyEvent_detail.set(this, void 0);
		__classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
	}
	/** @deprecated */
	preventDefault() {
		throw new Error("preventDefault cannot be called");
	}
	/** @deprecated */
	stopImmediatePropagation() {
		throw new Error("stopImmediatePropagation cannot be called");
	}
	/** @deprecated */
	stopPropagation() {
		throw new Error("stopPropagation cannot be called");
	}
};
_AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/.pnpm/@iota+wallet-standard@0.4.4_typescript@5.9.3/node_modules/@iota/wallet-standard/dist/esm/detect.js
var REQUIRED_FEATURES = ["standard:connect", "standard:events"];
function isWalletWithRequiredFeatureSet(wallet, additionalFeatures = []) {
	return [...REQUIRED_FEATURES, ...additionalFeatures].every((feature) => feature in wallet.features);
}
//#endregion
//#region src/lib/utils/web-wallet.ts
var selectedWalletIndex = writable(0);
var currentWalletUnsubscribe = null;
var features = {
	CONNECT: "standard:connect",
	EVENTS: "standard:events",
	SIGN_AND_EXECUTE_TRANSACTION: "iota:signAndExecuteTransaction",
	SIGN_PERSONAL_MESSAGE: "iota:signPersonalMessage",
	SIGN_TRANSACTION: "iota:signTransaction"
};
function get_wallets() {
	try {
		let iotaWallets = getWallets().get().filter((wallet) => {
			return isWalletWithRequiredFeatureSet(wallet, Object.values(features));
		}).map(({ accounts, chains, features: { [features.CONNECT]: { connect }, [features.EVENTS]: { on }, [features.SIGN_AND_EXECUTE_TRANSACTION]: { signAndExecuteTransaction }, [features.SIGN_PERSONAL_MESSAGE]: { signPersonalMessage }, [features.SIGN_TRANSACTION]: { signTransaction } }, icon, name, version }) => {
			return {
				accounts,
				chains,
				icon,
				name,
				version,
				connect,
				on,
				signAndExecuteTransaction,
				signPersonalMessage,
				signTransaction,
				features
			};
		});
		console.log("Web wallets found:", iotaWallets);
		iota_wallets.set(iotaWallets);
		if (iota_wallets.length == 0) throw new Error("no web wallet found");
	} catch (err) {
		console.error(err);
	}
}
var getActiveWallet = () => {
	const wallets = get$1(iota_wallets);
	return wallets[get$1(selectedWalletIndex)] || wallets[0];
};
function setupWalletListener() {
	if (currentWalletUnsubscribe) {
		currentWalletUnsubscribe();
		currentWalletUnsubscribe = null;
	}
	const wallet = getActiveWallet();
	if (wallet) currentWalletUnsubscribe = wallet.on("change", ({ accounts }) => {
		if (accounts) {
			iota_accounts.set(accounts);
			const currentActive = get$1(activeAddress);
			if (!accounts.map((a) => a.address).includes(currentActive)) {
				const newAddress = accounts[0]?.address || "";
				activeAddress.set(newAddress);
				sharedSelectedAddress.update((obj) => ({
					...obj,
					[SignerType.WebWallet]: newAddress
				}));
			}
		}
	});
}
var setSelectedWallet = (index) => {
	selectedWalletIndex.set(index);
	const wallets = get$1(iota_wallets);
	if (wallets[index]) {
		if (typeof localStorage !== "undefined") localStorage.setItem("selectedWalletName", wallets[index].name);
	}
	setupWalletListener();
};
var connectWallet = async (silent) => {
	get_wallets();
	if (get$1(iota_wallets).length == 0) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		get_wallets();
	}
	if (typeof localStorage !== "undefined") {
		const savedWalletName = localStorage.getItem("selectedWalletName");
		if (savedWalletName) {
			const savedIndex = get$1(iota_wallets).findIndex((w) => w.name === savedWalletName);
			if (savedIndex >= 0) selectedWalletIndex.set(savedIndex);
		}
	}
	setupWalletListener();
	const wallet = getActiveWallet();
	if (!wallet) {
		console.error("No wallet available");
		return;
	}
	let connectResult;
	try {
		connectResult = await wallet.connect({ silent: true });
	} catch (error) {
		console.warn("Silent connect failed, trying with prompt:", error);
		connectResult = await wallet.connect({ silent: false });
	}
	if (silent && connectResult.accounts && connectResult.accounts.length == 0) return;
	if (connectResult.accounts && connectResult.accounts.length == 0) connectResult = await wallet.connect({ silent: false });
	console.log("Web wallet accounts:", connectResult);
	iota_accounts.set(connectResult.accounts);
	const currentActive = get$1(activeAddress);
	const accountAddresses = connectResult.accounts.map((a) => a.address);
	const persisted = get$1(sharedSelectedAddress)[SignerType.WebWallet];
	let addressToUse = persisted && accountAddresses.includes(persisted) ? persisted : accountAddresses.includes(currentActive) ? currentActive : connectResult.accounts[0].address;
	activeAddress.set(addressToUse);
	sharedSelectedAddress.update((obj) => ({
		...obj,
		[SignerType.WebWallet]: addressToUse
	}));
};
var disconnectWallet = () => {
	if (currentWalletUnsubscribe) {
		currentWalletUnsubscribe();
		currentWalletUnsubscribe = null;
	}
	iota_accounts.set([]);
	activeAddress.set("");
	selectedWalletIndex.set(0);
	if (typeof localStorage !== "undefined") localStorage.removeItem("selectedWalletName");
};
//#endregion
//#region src/lib/utils/signer-data.ts
var PrivateKeyWallet = class {
	async signAndExecuteTransaction(params) {
		const privateKeyAccounts = get$1(sharedPrivateKeyAccounts);
		let senderAddress = params.account.address;
		let senderAccount = privateKeyAccounts.accounts[senderAddress];
		if (!senderAccount) throw new Error(`No account found for address: ${senderAddress}`);
		const keypair = keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey);
		return getClient().signAndExecuteTransaction({
			transaction: params.transaction,
			signer: keypair,
			options: params.options
		});
	}
	async signTransaction(params) {
		const privateKeyAccounts = get$1(sharedPrivateKeyAccounts);
		let senderAddress = params.account.address;
		let senderAccount = privateKeyAccounts.accounts[senderAddress];
		if (!senderAccount) throw new Error(`No account found for address: ${senderAddress}`);
		return { signature: (await keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey).signTransaction(await params.transaction.build())).signature };
	}
	async signPersonalMessage(params) {
		const privateKeyAccounts = get$1(sharedPrivateKeyAccounts);
		let senderAddress = params.account.address;
		let senderAccount = privateKeyAccounts.accounts[senderAddress];
		if (!senderAccount) throw new Error(`No account found for address: ${senderAddress}`);
		return { signature: (await keypairFromBech32PrivateKey(senderAccount.bech32PrivateKey).signPersonalMessage(params.message)).signature };
	}
};
var iota_wallets = writable([]);
var iota_accounts = writable([]);
var activeAddress = writable("0x");
activeAddress.subscribe((address) => {
	const type = get$1(sharedSignerType);
	if (type && address !== "0x") sharedSelectedAddress.update((obj) => ({
		...obj,
		[type]: address
	}));
});
function addOrUpdateExternalAddress(address, alias) {
	const currentAddresses = get$1(sharedExternalAddresses);
	const existingIndex = currentAddresses.addresses.findIndex((addr) => addr.address === address);
	if (existingIndex >= 0) currentAddresses.addresses[existingIndex] = {
		address,
		alias
	};
	else currentAddresses.addresses.push({
		address,
		alias
	});
	currentAddresses.selectedAddress = address;
	sharedExternalAddresses.set(currentAddresses);
	if (get$1(sharedSignerType) === SignerType.ExternalAddress) setSigningWithExternalAddress(address);
}
function removeExternalAddress(address) {
	const currentAddresses = get$1(sharedExternalAddresses);
	const filteredAddresses = currentAddresses.addresses.filter((addr) => addr.address !== address);
	let newSelectedAddress = currentAddresses.selectedAddress;
	if (currentAddresses.selectedAddress === address) newSelectedAddress = filteredAddresses.length > 0 ? filteredAddresses[0].address : void 0;
	sharedExternalAddresses.set({
		addresses: filteredAddresses,
		selectedAddress: newSelectedAddress
	});
	if (get$1(sharedSignerType) === SignerType.ExternalAddress) setSigningWithExternalAddress(newSelectedAddress);
}
function selectExternalAddress(address) {
	const currentAddresses = get$1(sharedExternalAddresses);
	if (currentAddresses.addresses.some((addr) => addr.address === address)) {
		sharedExternalAddresses.set({
			...currentAddresses,
			selectedAddress: address
		});
		if (get$1(sharedSignerType) === SignerType.ExternalAddress) setSigningWithExternalAddress(address);
	}
}
function getExternalAddresses() {
	return get$1(sharedExternalAddresses).addresses;
}
function getSelectedExternalAddress() {
	return get$1(sharedExternalAddresses).selectedAddress;
}
function setSigningWithPrivateKeyAccounts() {
	iota_wallets.set([new PrivateKeyWallet()]);
	iota_accounts.set(toWalletAccounts(get$1(sharedPrivateKeyAccounts)));
	const accounts = get$1(sharedPrivateKeyAccounts).accounts;
	const accountAddresses = Object.keys(accounts);
	const persisted = get$1(sharedSelectedAddress)[SignerType.Localstorage];
	let addressToUse = persisted && accountAddresses.includes(persisted) ? persisted : accountAddresses[0];
	activeAddress.set(addressToUse);
	sharedSelectedAddress.update((obj) => ({
		...obj,
		[SignerType.Localstorage]: addressToUse
	}));
}
var ExternalAddressWallet = class {
	async signAndExecuteTransaction(_params) {
		return { errors: ["External address wallet cannot sign and execute transactions."] };
	}
	async signTransaction(_params) {
		throw new Error("External address wallet cannot sign transactions.");
	}
	async signPersonalMessage(_params) {
		throw new Error("External address wallet cannot sign messages.");
	}
};
function getExternalAddressLabel(address) {
	if (address.length < 8) return "External " + address;
	return "External 0x" + address.slice(2, 5) + "..." + address.slice(-3);
}
function setSigningWithExternalAddress(externalAddress) {
	const storedAddresses = get$1(sharedExternalAddresses);
	let addressToUse = externalAddress || storedAddresses.selectedAddress;
	if (!addressToUse) {
		const persisted = get$1(sharedSelectedAddress)[SignerType.ExternalAddress];
		if (persisted && storedAddresses.addresses.some((a) => a.address === persisted)) addressToUse = persisted;
	}
	if (!addressToUse && storedAddresses.addresses.length > 0) addressToUse = storedAddresses.addresses[0].address;
	if (!addressToUse) {
		iota_wallets.set([new ExternalAddressWallet()]);
		const accounts = storedAddresses.addresses.map((addr) => ({
			address: addr.address,
			label: addr.alias || getExternalAddressLabel(addr.address),
			publicKey: new Uint8Array([]),
			chains: ["iota:mainnet"],
			features: ["iota:signAndExecuteTransaction"]
		}));
		iota_accounts.set(accounts);
		return;
	}
	iota_wallets.set([new ExternalAddressWallet()]);
	activeAddress.set(addressToUse);
	sharedSelectedAddress.update((obj) => ({
		...obj,
		[SignerType.ExternalAddress]: addressToUse
	}));
	const accounts = storedAddresses.addresses.map((addr) => ({
		address: addr.address,
		label: addr.alias || getExternalAddressLabel(addr.address),
		publicKey: new Uint8Array([]),
		chains: ["iota:mainnet"],
		features: ["iota:signAndExecuteTransaction"]
	}));
	if (externalAddress && !storedAddresses.addresses.some((addr) => addr.address === externalAddress)) accounts.push({
		address: externalAddress,
		label: "(not saved)",
		publicKey: new Uint8Array([]),
		chains: ["iota:mainnet"],
		features: ["iota:signAndExecuteTransaction"]
	});
	if (accounts.length === 0) accounts.push({
		address: addressToUse,
		label: getExternalAddressLabel(addressToUse),
		publicKey: new Uint8Array([]),
		chains: ["iota:mainnet"],
		features: ["iota:signAndExecuteTransaction"]
	});
	iota_accounts.set(accounts);
}
function updateSelectedSignerAccounts(externalAddress) {
	if (get$1(sharedSignerType) == SignerType.Localstorage) setSigningWithPrivateKeyAccounts();
	if (get$1(sharedSignerType) == SignerType.WebWallet) {
		iota_wallets.set([]);
		const persisted = get$1(sharedSelectedAddress)[SignerType.WebWallet];
		activeAddress.set(persisted || "");
		iota_accounts.set([]);
		connectWallet(true);
	}
	if (get$1(sharedSignerType) == SignerType.ExternalAddress) setSigningWithExternalAddress(externalAddress);
}
//#endregion
export { iota_accounts as a, selectExternalAddress as c, disconnectWallet as d, getActiveWallet as f, getSelectedExternalAddress as i, updateSelectedSignerAccounts as l, addOrUpdateExternalAddress as n, iota_wallets as o, setSelectedWallet as p, getExternalAddresses as r, removeExternalAddress as s, activeAddress as t, connectWallet as u };

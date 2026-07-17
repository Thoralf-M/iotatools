import { r as getSelectedNetworkConfig } from "./client-BTFoHz6u.js";
//#region src/lib/pages/iota-names/iota-names-config.ts
var DEVNET_PACKAGE_ID = "0x742d00d422294ca697c53662f571f8dc328296d62db2211e2bd05a1857c13e06";
var TESTNET_PACKAGE_ID = "0x7fff6e95f385349bec98d17121ab2bfa3e134f2f0b1ccefc270313415f7835ea";
var MAINNET_PACKAGE_ID = "0x6d2c743607ef275bd6934fe5c2a7e5179cca6fbd2049cfa79de2310b74f3cf83";
var config = {
	IOTA_NAMES_PACKAGE_ID: TESTNET_PACKAGE_ID,
	AUCTION_PACKAGE_ID: "",
	AUCTION_HOUSE_OBJECT_ID: "",
	COUPONS_PACKAGE_ID: "",
	PAYMENTS_PACKAGE_ID: "",
	SUBNAME_PACKAGE_ID: "",
	IOTA_NAMES_OBJECT_ID: "",
	SUBNAME_PROXY_PACKAGE_ID: ""
};
/**
* Reset all package IDs and object IDs
*/
function resetPackageIds() {
	config.IOTA_NAMES_OBJECT_ID = "";
	config.PAYMENTS_PACKAGE_ID = "";
	config.SUBNAME_PACKAGE_ID = "";
	config.SUBNAME_PROXY_PACKAGE_ID = "";
	config.AUCTION_PACKAGE_ID = "";
	config.COUPONS_PACKAGE_ID = "";
}
/**
* Set package ID to Mainnet
*/
function setMainnetPackageId() {
	config.IOTA_NAMES_PACKAGE_ID = MAINNET_PACKAGE_ID;
	resetPackageIds();
}
/**
* Set package ID to Testnet
*/
function setTestnetPackageId() {
	config.IOTA_NAMES_PACKAGE_ID = TESTNET_PACKAGE_ID;
	resetPackageIds();
}
/**
* Set package ID to Devnet
*/
function setDevnetPackageId() {
	config.IOTA_NAMES_PACKAGE_ID = DEVNET_PACKAGE_ID;
	resetPackageIds();
}
/**
* Set custom package ID
*/
function setCustomPackageId(packageId) {
	config.IOTA_NAMES_PACKAGE_ID = packageId;
	resetPackageIds();
}
/**
* Get the IOTA Names package ID based on the selected network
*/
function getIotaNamesPackageId() {
	const network = getSelectedNetworkConfig();
	if (network.name === "mainnet") setMainnetPackageId();
	else if (network.name === "testnet") setTestnetPackageId();
	else if (network.name === "devnet") setDevnetPackageId();
	else setCustomPackageId("");
	return config.IOTA_NAMES_PACKAGE_ID;
}
//#endregion
export { getIotaNamesPackageId as n, setCustomPackageId as r, config as t };

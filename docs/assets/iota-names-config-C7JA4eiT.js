import { x as getSelectedNetworkConfig } from "./index-FamLcqZt.js";
const DEVNET_PACKAGE_ID = "0xb9d617f24c84826bf660a2f4031951678cc80c264aebc4413459fb2a95ada9ba";
const TESTNET_PACKAGE_ID = "0x7fff6e95f385349bec98d17121ab2bfa3e134f2f0b1ccefc270313415f7835ea";
const MAINNET_PACKAGE_ID = "0x6d2c743607ef275bd6934fe5c2a7e5179cca6fbd2049cfa79de2310b74f3cf83";
const config = {
  IOTA_NAMES_PACKAGE_ID: TESTNET_PACKAGE_ID,
  AUCTION_PACKAGE_ID: "",
  AUCTION_HOUSE_OBJECT_ID: "",
  COUPONS_PACKAGE_ID: "",
  PAYMENTS_PACKAGE_ID: "",
  SUBNAME_PACKAGE_ID: "",
  IOTA_NAMES_OBJECT_ID: "",
  SUBNAME_PROXY_PACKAGE_ID: ""
};
function resetPackageIds() {
  config.IOTA_NAMES_OBJECT_ID = "";
  config.PAYMENTS_PACKAGE_ID = "";
  config.SUBNAME_PACKAGE_ID = "";
  config.SUBNAME_PROXY_PACKAGE_ID = "";
  config.AUCTION_PACKAGE_ID = "";
  config.COUPONS_PACKAGE_ID = "";
}
function setMainnetPackageId() {
  config.IOTA_NAMES_PACKAGE_ID = MAINNET_PACKAGE_ID;
  resetPackageIds();
}
function setTestnetPackageId() {
  config.IOTA_NAMES_PACKAGE_ID = TESTNET_PACKAGE_ID;
  resetPackageIds();
}
function setDevnetPackageId() {
  config.IOTA_NAMES_PACKAGE_ID = DEVNET_PACKAGE_ID;
  resetPackageIds();
}
function setCustomPackageId(packageId) {
  config.IOTA_NAMES_PACKAGE_ID = packageId;
  resetPackageIds();
}
function getIotaNamesPackageId() {
  const network = getSelectedNetworkConfig();
  if (network.name === "mainnet") {
    setMainnetPackageId();
  } else if (network.name === "testnet") {
    setTestnetPackageId();
  } else if (network.name === "devnet") {
    setDevnetPackageId();
  } else {
    setCustomPackageId("");
  }
  return config.IOTA_NAMES_PACKAGE_ID;
}
export {
  config as c,
  getIotaNamesPackageId as g,
  setCustomPackageId as s
};

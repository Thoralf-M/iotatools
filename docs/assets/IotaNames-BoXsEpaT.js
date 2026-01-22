import { w as getSelectedNetworkConfig, ai as Transaction, o as getClient, aw as toHex, b0 as IOTA_CLOCK_OBJECT_ID, p as push, q as onMount, P as legacy_pre_effect, R as legacy_pre_effect_reset, i as init, s as sibling, k as child, g as get, b as if_block, x as bind_value, h as append, j as pop, u as store_get, aP as sharedClientConfig, v as setup_stores, m as mutable_source, l as set, H as each, K as comment, J as first_child, S as untrack, t as template_effect, d as set_text, I as index, n as from_html, ad as activeAddress, B as delegate } from "./index-jgDoxWzR.js";
import { T as TransactionView } from "./TransactionView-q0PSXh2h.js";
import { I as IotaGraphQLClient } from "./client-DsK1s_C0.js";
import { g as graphql } from "./index-a-qIJzeT.js";
import { e as executeTransaction } from "./transaction-execution-BDqJnhsH.js";
import "./transaction-view-B0SLz9hg.js";
import "./explorer-links-Bx4a9wSX.js";
import "./iota-nano-conversion-DDgUA_oK.js";
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
async function queryGraphQl(gqlClient, query, variables) {
  const options = {
    query: graphql(query),
    variables
  };
  return gqlClient.query(options);
}
function createGraphQLClient() {
  return new IotaGraphQLClient({
    url: getSelectedNetworkConfig().graphql
  });
}
async function queryIotaNamesObjectId() {
  const gqlClient = createGraphQLClient();
  const objectQuery = `{
      objects(filter: {type: "${config.IOTA_NAMES_PACKAGE_ID}::iota_names::IotaNames"}) {
        edges {
          node {
            address
          }
        }
      }
    }`;
  let object = await queryGraphQl(gqlClient, objectQuery, {});
  if (object.data.objects.edges.length > 0) {
    config.IOTA_NAMES_OBJECT_ID = object.data.objects.edges[0].node.address;
  } else {
    config.IOTA_NAMES_OBJECT_ID = "Not found";
  }
}
async function queryAuctionObjectId() {
  const gqlClient = createGraphQLClient();
  const objectQuery = `{
      objects(filter: {type: "${config.AUCTION_PACKAGE_ID}::auction::AuctionHouse"}) {
        edges {
          node {
            address
          }
        }
      }
    }`;
  let object = await queryGraphQl(gqlClient, objectQuery, {});
  config.AUCTION_HOUSE_OBJECT_ID = object.data.objects.edges[0].node.address;
}
async function queryDynamicFields() {
  const gqlClient = createGraphQLClient();
  if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
    await queryIotaNamesObjectId();
  }
  if (config.IOTA_NAMES_OBJECT_ID == "Not found") {
    throw new Error("IOTA Names object not found on this network");
  }
  const objectQuery = `query ($address: IotaAddress!) {
            owner(address: $address) {
                dynamicFields {
                nodes {
                    name { type {
                            repr
                    } }
                    value {
                    ... on MoveValue {
                        json
                    }
                    }
                }
                }
            }
        }`;
  let dynamicFields = await queryGraphQl(gqlClient, objectQuery, {
    address: config.IOTA_NAMES_OBJECT_ID
  });
  return dynamicFields;
}
const resolveAddress = async (nameName) => {
  try {
    if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
      await queryIotaNamesObjectId();
    }
    const tx = new Transaction();
    let name = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::name::new`,
      arguments: [tx.pure.string(nameName)]
    });
    let registry = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
      typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
      arguments: [
        tx.sharedObjectRef({
          objectId: config.IOTA_NAMES_OBJECT_ID,
          initialSharedVersion: 1,
          mutable: true
        })
      ]
    });
    let nameRecordOption = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::registry::lookup`,
      arguments: [registry, name]
    });
    let nameRecord = tx.moveCall({
      target: `0x1::option::borrow`,
      typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::name_record::NameRecord`],
      arguments: [nameRecordOption]
    });
    let targetAddressOption = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::name_record::target_address`,
      arguments: [nameRecord]
    });
    tx.moveCall({
      target: `0x1::option::borrow`,
      typeArguments: [`address`],
      arguments: [targetAddressOption]
    });
    let client = getClient();
    let txResult = await client.devInspectTransactionBlock({
      sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionBlock: tx
    });
    console.log(txResult);
    if (txResult.error) {
      throw new Error(txResult.error);
    }
    let resolvedAddress = "0x" + toHex(new Uint8Array(txResult.results?.pop()?.returnValues?.[0][0]));
    console.log(resolvedAddress);
    return resolvedAddress;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const resolveName = async (address) => {
  try {
    if (!address.startsWith("0x")) {
      throw new Error("invalid address");
    }
    if (config.IOTA_NAMES_OBJECT_ID.length == 0) {
      await queryIotaNamesObjectId();
    }
    const tx = new Transaction();
    let registry = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
      typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
      arguments: [
        tx.sharedObjectRef({
          objectId: config.IOTA_NAMES_OBJECT_ID,
          initialSharedVersion: 1,
          mutable: true
        })
      ]
    });
    let nameOption = tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::registry::reverse_lookup`,
      arguments: [registry, tx.pure.address(address)]
    });
    let name = tx.moveCall({
      target: `0x1::option::borrow`,
      typeArguments: [`${config.IOTA_NAMES_PACKAGE_ID}::name::Name`],
      arguments: [nameOption]
    });
    tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::name::to_string`,
      arguments: [name]
    });
    let client = getClient();
    let txResult = await client.devInspectTransactionBlock({
      sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionBlock: tx
    });
    console.log(txResult);
    if (txResult.error) {
      throw new Error(txResult.error);
    }
    let nameBytes = txResult.results?.pop()?.returnValues?.[0][0].slice(1);
    let resolvedName = new TextDecoder().decode(new Uint8Array(nameBytes));
    console.log(resolvedName);
    return resolvedName;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const getRegistryEntry = async (nameName) => {
  try {
    let client = getClient();
    let result = await client.iotaNamesLookup({ name: nameName });
    console.log(result);
    return result || "No registry entry found";
  } catch (err) {
    console.error(err);
    throw err;
  }
};
async function getRegisteredNamesInner(showResult, onProgress, signal) {
  const gqlClient = createGraphQLClient();
  let dynamicFields = await queryDynamicFields();
  let registration = (
    // @ts-ignore
    dynamicFields.data.owner.dynamicFields.nodes.find(
      (v) => v.name.type.repr == `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry>`
    )
  );
  let registryId = registration.value.json.registry.id;
  let res = { total: 0, names: [], registrations: [] };
  let cursorSection = "";
  while (true) {
    if (signal?.aborted) {
      throw new Error("Operation cancelled");
    }
    let query = `query ($address: IotaAddress) {
            owner(address: $address) {
                dynamicFields${cursorSection} {
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        name {
                            json
                        }
                        value {
                            ... on MoveValue {
                                json
                            }
                        }
                    }
                }
            }
        }`;
    let object = await queryGraphQl(gqlClient, query, {
      address: registryId
    });
    if (object.errors) {
      break;
    }
    res.total += object.data.owner.dynamicFields.nodes.length;
    res.names.push(
      ...object.data.owner.dynamicFields.nodes.map(
        (v) => v.name.json.labels.reverse().join(".")
      )
    );
    res.registrations.push(...object.data.owner.dynamicFields.nodes);
    if (onProgress) {
      onProgress({ ...res });
    }
    if (showResult) {
      break;
    }
    if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
      cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
    } else {
      break;
    }
  }
  return res;
}
async function listRegisteredNames(onProgress, signal) {
  try {
    return await getRegisteredNamesInner(false, onProgress, signal);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getReverseRegisteredAddresses() {
  try {
    const gqlClient = createGraphQLClient();
    let dynamicFields = await queryDynamicFields();
    let registration = (
      // @ts-ignore
      dynamicFields.data.owner.dynamicFields.nodes.find(
        (v) => v.name.type.repr == `${config.IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${config.IOTA_NAMES_PACKAGE_ID}::registry::Registry>`
      )
    );
    let reverseRegistryId = registration.value.json.reverse_registry.id;
    let query = `query ($address: IotaAddress) {
            owner(address: $address) {
                dynamicFields {
                    nodes {
                        name {
                            json
                        }
                        value {
                            ... on MoveValue {
                                json
                            }
                        }
                    }
                }
            }
        }`;
    let object = await queryGraphQl(gqlClient, query, {
      address: reverseRegistryId
    });
    let res = {};
    res.total = object.data.owner.dynamicFields.nodes.length;
    res.reverseRegistry = object.data.owner.dynamicFields.nodes.map((v) => {
      return {
        address: v.name.json,
        name: v.value.json.labels.reverse().join(".")
      };
    });
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getDynamicFields() {
  try {
    return await queryDynamicFields();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getPackageIds() {
  try {
    let parsePackageId = function(moduleStruct, dynamicFields2) {
      return dynamicFields2.filter((d) => d.name.type.repr.includes(moduleStruct)).map((d) => {
        let type = d.name.type.repr;
        let index2 = type.indexOf("<");
        return type.slice(index2 + 1, index2 + 67);
      })[0];
    };
    let dynamicFields = (await queryDynamicFields()).data.owner.dynamicFields.nodes;
    try {
      config.AUCTION_PACKAGE_ID = parsePackageId("auction::AuctionAuth", dynamicFields);
      config.COUPONS_PACKAGE_ID = parsePackageId("coupon_house::CouponHouse", dynamicFields);
    } catch (e) {
      console.error(e);
    }
    config.PAYMENTS_PACKAGE_ID = parsePackageId("payments::PaymentsConfig", dynamicFields);
    config.SUBNAME_PACKAGE_ID = parsePackageId("subnames::SubnamesAuth", dynamicFields);
    config.SUBNAME_PROXY_PACKAGE_ID = parsePackageId(
      "subname_proxy::SubnameProxyAuth",
      dynamicFields
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function registerName(nameName, activeAddress2) {
  try {
    await getPackageIds();
    let dynamicFields = await queryDynamicFields();
    let priceConfig = (
      // @ts-ignore
      dynamicFields.data.owner.dynamicFields.nodes.filter(
        (d) => d.name.type.repr.includes("pricing_config::PricingConfig")
      )[0].value.json
    );
    let nameLabels = nameName.split(".");
    let length = nameLabels[0].length;
    if (length < 3) {
      throw new Error("name too short (minimum 3 characters)");
    }
    let price = 0;
    for (const pricing of priceConfig.pricing.contents) {
      if (length >= parseInt(pricing.key.pos0) && length <= parseInt(pricing.key.pos1)) {
        price = pricing.value;
        break;
      }
    }
    let tx = new Transaction();
    if (nameLabels.length == 2) {
      const paymentIntent = tx.moveCall({
        target: `${config.IOTA_NAMES_PACKAGE_ID}::payment::init_registration`,
        arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)]
      });
      const payment = tx.splitCoins(tx.gas, [price]);
      const receipt = tx.moveCall({
        target: `${config.PAYMENTS_PACKAGE_ID}::payments::handle_base_payment`,
        arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), paymentIntent, payment],
        typeArguments: [
          "0x0000000000000000000000000000000000000000000000000000000000000002::iota::IOTA"
        ]
      });
      const nft = tx.moveCall({
        target: `${config.IOTA_NAMES_PACKAGE_ID}::payment::register`,
        arguments: [
          receipt,
          tx.object(config.IOTA_NAMES_OBJECT_ID),
          tx.object(IOTA_CLOCK_OBJECT_ID)
        ]
      });
      tx.transferObjects([nft], tx.pure.address(activeAddress2));
    } else {
      let isParentSubname = nameLabels.length > 3;
      nameLabels.shift();
      let parentNameName = nameLabels.join(".");
      let parentNft = await getNft(parentNameName);
      let expirationNextMonthTimestampMs = Date.now() + 1e3 * 60 * 60 * 24 * 30;
      if (isParentSubname) {
        const client = getClient();
        const outputs = await client.getOwnedObjects({
          owner: activeAddress2,
          options: { showContent: true, showType: true }
        });
        const subnameOutputs = outputs.data.filter(
          (output) => (
            // @ts-ignore
            output.data.content.type.includes("SubNameRegistration")
          )
        );
        let subnameNft = subnameOutputs.find(
          (e) => (
            // @ts-ignore
            e.data.content.fields.nft.fields.name == parentNameName
          )
        );
        parentNft = subnameNft?.data?.objectId;
        expirationNextMonthTimestampMs = // @ts-ignore
        subnameNft.data.content.fields.nft.fields.expiration_timestamp_ms;
      }
      let allowChildCreation = true;
      let allowTimeExtension = true;
      const subNft = tx.moveCall({
        target: isParentSubname ? `${config.SUBNAME_PROXY_PACKAGE_ID}::subname_proxy::new` : `${config.SUBNAME_PACKAGE_ID}::subnames::new`,
        arguments: [
          tx.object(config.IOTA_NAMES_OBJECT_ID),
          tx.object(parentNft),
          tx.object(IOTA_CLOCK_OBJECT_ID),
          tx.pure.string(nameName),
          tx.pure.u64(expirationNextMonthTimestampMs),
          tx.pure.bool(allowChildCreation),
          tx.pure.bool(allowTimeExtension)
        ]
      });
      tx.transferObjects([subNft], tx.pure.address(activeAddress2));
    }
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function setTargetAddress(nameName, address) {
  try {
    await getPackageIds();
    let registered = await getRegisteredNamesInner();
    let registrationIndex = registered.registrations.findIndex(
      (e) => e.name.json.labels.join(".") == nameName
    );
    if (registrationIndex == -1) {
      throw new Error("name not found");
    }
    let nft_id = (
      // @ts-ignore
      registered.registrations[registrationIndex].value.json.nft_id
    );
    let tx = new Transaction();
    tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::controller::set_target_address`,
      arguments: [
        tx.object(config.IOTA_NAMES_OBJECT_ID),
        tx.object(nft_id),
        tx.pure.option("address", address),
        tx.object("0x6")
      ]
    });
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getNft(nameName) {
  let registered = await getRegisteredNamesInner();
  let registrationIndex = registered.registrations.findIndex(
    (e) => e.name.json.labels.join(".") == nameName
  );
  if (registrationIndex == -1) {
    throw new Error("name not found");
  }
  return registered.registrations[registrationIndex].value.json.nft_id;
}
async function setReverseLookup(nameName) {
  try {
    await getPackageIds();
    let tx = new Transaction();
    tx.moveCall({
      target: `${config.IOTA_NAMES_PACKAGE_ID}::controller::set_reverse_lookup`,
      arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)]
    });
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function timeAgo(timestamp) {
  const now = (/* @__PURE__ */ new Date()).getTime();
  const diff = now - timestamp;
  const isFuture = diff < 0;
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let timeString = "";
  if (days > 0) {
    const remainingHours = hours % 24;
    timeString = `${days} day${days > 1 ? "s" : ""} ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    timeString = `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    timeString = `${minutes} minute${minutes > 1 ? "s" : ""} ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
  } else {
    timeString = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  return isFuture ? `in ${timeString}` : `${timeString} ago`;
}
async function startAuctionAndPlaceBid(nameName, bidPrice) {
  try {
    await getPackageIds();
    await queryAuctionObjectId();
    let nameLabels = nameName.split(".");
    if (nameLabels.length != 2) {
      throw new Error("can only start an auction for names with 2 labels (name.iota)");
    }
    let tx = new Transaction();
    const payment = tx.splitCoins(tx.gas, [bidPrice]);
    tx.moveCall({
      target: `${config.AUCTION_PACKAGE_ID}::auction::start_auction_and_place_bid`,
      arguments: [
        tx.object(config.AUCTION_HOUSE_OBJECT_ID),
        tx.object(config.IOTA_NAMES_OBJECT_ID),
        tx.pure.string(nameName),
        payment,
        tx.object("0x6")
      ]
    });
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function placeBid(nameName, bidPrice) {
  try {
    await getPackageIds();
    await queryAuctionObjectId();
    let nameLabels = nameName.split(".");
    if (nameLabels.length != 2) {
      throw new Error("can only bid for names with 2 labels (name.iota)");
    }
    let tx = new Transaction();
    const payment = tx.splitCoins(tx.gas, [bidPrice]);
    tx.moveCall({
      target: `${config.AUCTION_PACKAGE_ID}::auction::place_bid`,
      arguments: [
        tx.object(config.AUCTION_HOUSE_OBJECT_ID),
        tx.pure.string(nameName),
        payment,
        tx.object("0x6")
      ]
    });
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function claim(nameName, activeAddress2) {
  try {
    await getPackageIds();
    await queryAuctionObjectId();
    let nameLabels = nameName.split(".");
    if (nameLabels.length != 2) {
      throw new Error("can only claim names with 2 labels (name.iota)");
    }
    let tx = new Transaction();
    let nft = tx.moveCall({
      target: `${config.AUCTION_PACKAGE_ID}::auction::claim`,
      arguments: [
        tx.object(config.AUCTION_HOUSE_OBJECT_ID),
        tx.pure.string(nameName),
        tx.object("0x6")
      ]
    });
    tx.transferObjects([nft], tx.pure.address(activeAddress2));
    return await executeTransaction(tx);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function listAuctions() {
  try {
    await getPackageIds();
    await queryAuctionObjectId();
    let client = getClient();
    let object = await client.getObject({
      id: config.AUCTION_HOUSE_OBJECT_ID,
      options: { showContent: true, showPreviousTransaction: true }
    });
    let res = {
      objectId: "",
      previousTransaction: "",
      balance: 0,
      auctionNames: [],
      unclaimedAuctionNames: [],
      auctions: [],
      unclaimedAuctions: []
    };
    res.objectId = object.data?.objectId;
    res.previousTransaction = object.data?.previousTransaction;
    res.balance = object.data?.content?.fields?.balance;
    let linked_table_id = (
      // @ts-ignore
      object.data.content.fields.auctions.fields.id.id
    );
    const gqlClient = createGraphQLClient();
    let cursorSection = "";
    while (true) {
      let query = `{
                owner(
                    address: "${linked_table_id}"
                ) {
                    dynamicFields${cursorSection} {
                        pageInfo{
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            value {
                                ... on MoveValue {
                                    json
                                }
                            }
                        }
                    }
                }
            }`;
      let object2 = await queryGraphQl(gqlClient, query, {
        address: config.IOTA_NAMES_OBJECT_ID
      });
      if (object2.errors) {
        break;
      }
      let now = (/* @__PURE__ */ new Date()).getTime();
      for (let auctionNode of object2.data.owner.dynamicFields.nodes) {
        let auction = auctionNode.value.json;
        delete auction["prev"];
        delete auction["next"];
        delete auction["value"]["name"];
        delete auction["value"]["nft"]["name"];
        let auctionEndTime = Number(auction.value.end_timestamp_ms);
        auction.endsIn = timeAgo(auctionEndTime);
        if (auctionEndTime < now) {
          res.unclaimedAuctions.push(auction);
          res.unclaimedAuctionNames.push(
            auction.value.nft.name_str + " " + auction.value.winner
          );
        } else {
          res.auctions.push(auction);
          res.auctionNames.push(auction.value.nft.name_str + " " + auction.endsIn);
        }
      }
      if (object2.data.owner.dynamicFields.pageInfo.hasNextPage) {
        cursorSection = `(after: "${object2.data.owner.dynamicFields.pageInfo.endCursor}")`;
      } else {
        break;
      }
    }
    res.auctions.sort(
      (a, b) => Number(a.value.end_timestamp_ms) - Number(b.value.end_timestamp_ms)
    );
    res.unclaimedAuctions.sort(
      (a, b) => Number(a.value.end_timestamp_ms) - Number(b.value.end_timestamp_ms)
    );
    res.auctionNames = res.auctions.map(
      (auction) => auction.value.nft.name_str + " " + auction.endsIn
    );
    res.unclaimedAuctionNames = res.unclaimedAuctions.map(
      (auction) => auction.value.nft.name_str + " " + auction.value.winner
    );
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
var root_3 = from_html(` <br/>`, 1);
var root_1 = from_html(`<details><summary>IOTA-Names IDs</summary> <div> <br/> <!></div></details>`);
var root_4 = from_html(`<button style="background-color: #ff6b6b; color: white;" class="svelte-il8nsm">Cancel fetching names</button>`);
var root_5 = from_html(`<button class="svelte-il8nsm">list registered names</button>`);
var root = from_html(`<main><span>IotaNames package id: <input placeholder="package id 0x..." size="67"/></span> <br/> <br/> <span>address: <input placeholder="address 0x..." size="67"/></span> <span>name: <input placeholder="name.iota"/></span> <br/> <br/> <!> General information: <!> <button class="svelte-il8nsm">get reverse registered addresses</button> <button class="svelte-il8nsm">show package ids</button> <button class="svelte-il8nsm">get dynamic fields</button> <hr/> Resolver: <button class="svelte-il8nsm">get registry entry (by name)</button> <button class="svelte-il8nsm">resolve name (by address)</button> <button class="svelte-il8nsm">resolve address (by name)</button> <hr/> Tx actions: <button class="svelte-il8nsm">register name</button> <button class="svelte-il8nsm">set target address</button> <button class="svelte-il8nsm">set reverse lookup</button> <hr/> Auction: <span>bid price: <input type="number" placeholder="0" style="width: 14rem;"/></span> <button class="svelte-il8nsm">start auction and place bid</button> <button class="svelte-il8nsm">place bid</button> <button class="svelte-il8nsm">claim</button> <button class="svelte-il8nsm">list auctions</button> <!></main>`);
function IotaNames($$anchor, $$props) {
  push($$props, false);
  const $sharedClientConfig = () => store_get(sharedClientConfig, "$sharedClientConfig", $$stores);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let address = mutable_source("0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900");
  let nameName = mutable_source("name.iota");
  let bidPrice = mutable_source(1e7);
  let showIotaNamesIds = mutable_source(false);
  let value = mutable_source({});
  let isFetchingNames = mutable_source(false);
  let abortController = null;
  let localIotaNamesPackageId = mutable_source(config.IOTA_NAMES_PACKAGE_ID);
  let packageIds = mutable_source({ ...config });
  function updatePackageIdForNetwork() {
    const network = getSelectedNetworkConfig();
    if (network.name === "mainnet") {
      setMainnetPackageId();
    } else if (network.name === "testnet") {
      setTestnetPackageId();
    } else if (network.name === "devnet") {
      setDevnetPackageId();
    } else if (network.name === "localnet") {
      setCustomPackageId("");
    }
    set(localIotaNamesPackageId, config.IOTA_NAMES_PACKAGE_ID);
    set(packageIds, { ...config });
  }
  onMount(() => {
    updatePackageIdForNetwork();
  });
  const handleResolveAddress = async () => {
    try {
      set(value, await resolveAddress(get(nameName)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleResolveName = async () => {
    try {
      set(value, await resolveName(get(address)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleGetRegistryEntry = async () => {
    try {
      set(value, await getRegistryEntry(get(nameName)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleListRegisteredNames = async () => {
    try {
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();
      set(isFetchingNames, true);
      set(value, { total: 0, names: [], registrations: [], loading: true });
      const finalResult = await listRegisteredNames(
        (progressResult) => {
          set(value, { ...progressResult, loading: true });
        },
        abortController.signal
      );
      set(value, { ...finalResult, loading: false });
    } catch (err) {
      if (err.name === "AbortError" || err.message === "Operation cancelled") {
        set(value, { ...get(value), loading: false, cancelled: true });
      } else {
        set(value, err.toString());
      }
    } finally {
      set(isFetchingNames, false);
      abortController = null;
    }
  };
  const handleGetReverseRegisteredAddresses = async () => {
    try {
      set(value, await getReverseRegisteredAddresses());
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleGetDynamicFields = async () => {
    try {
      set(value, await getDynamicFields());
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleToggleIotaNamesIds = async () => {
    set(showIotaNamesIds, true);
    try {
      await getPackageIds();
      set(packageIds, { ...config });
      console.log("Package IDs loaded:", config);
    } catch (err) {
      set(value, "Error loading package IDs: " + err.toString());
      console.error("Error in getPackageIds:", err);
    }
    document.querySelector("details")?.setAttribute("open", "true");
  };
  const handleRegisterName = async () => {
    try {
      set(value, await registerName(get(nameName), $activeAddress()));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleSetTargetAddress = async () => {
    try {
      set(value, await setTargetAddress(get(nameName), get(address)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleSetReverseLookup = async () => {
    try {
      set(value, await setReverseLookup(get(nameName)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleStartAuctionAndPlaceBid = async () => {
    try {
      set(value, await startAuctionAndPlaceBid(get(nameName), get(bidPrice)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handlePlaceBid = async () => {
    try {
      set(value, await placeBid(get(nameName), get(bidPrice)));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleClaim = async () => {
    try {
      set(value, await claim(get(nameName), $activeAddress()));
    } catch (err) {
      set(value, err.toString());
    }
  };
  const handleCancelFetch = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  const handleListAuctions = async () => {
    try {
      set(value, await listAuctions());
    } catch (err) {
      set(value, err.toString());
    }
  };
  legacy_pre_effect(() => $sharedClientConfig(), () => {
    $sharedClientConfig().selected, updatePackageIdForNetwork();
  });
  legacy_pre_effect_reset();
  init();
  var main = root();
  var span = child(main);
  var input = sibling(child(span));
  input.__change = () => {
    setCustomPackageId(get(localIotaNamesPackageId));
  };
  var span_1 = sibling(span, 6);
  var input_1 = sibling(child(span_1));
  var span_2 = sibling(span_1, 2);
  var input_2 = sibling(child(span_2));
  var node = sibling(span_2, 6);
  {
    var consequent_1 = ($$anchor2) => {
      var details = root_1();
      var div = sibling(child(details), 2);
      var text = child(div);
      var node_1 = sibling(text, 3);
      each(
        node_1,
        1,
        () => (get(packageIds), untrack(() => [
          ["Payments", get(packageIds).PAYMENTS_PACKAGE_ID],
          ["Subname", get(packageIds).SUBNAME_PACKAGE_ID],
          ["Subname Proxy", get(packageIds).SUBNAME_PROXY_PACKAGE_ID],
          ["Auction", get(packageIds).AUCTION_PACKAGE_ID],
          ["Coupons", get(packageIds).COUPONS_PACKAGE_ID]
        ])),
        index,
        ($$anchor3, item) => {
          var fragment = comment();
          var node_2 = first_child(fragment);
          {
            var consequent = ($$anchor4) => {
              var fragment_1 = root_3();
              var text_1 = first_child(fragment_1);
              template_effect(() => set_text(text_1, `${(get(item), untrack(() => get(item)[0])) ?? ""} Package ID: ${(get(item), untrack(() => get(item)[1])) ?? ""} `));
              append($$anchor4, fragment_1);
            };
            if_block(node_2, ($$render) => {
              if (get(item), untrack(() => get(item)[1] && get(item)[1].length != 0)) $$render(consequent);
            });
          }
          append($$anchor3, fragment);
        }
      );
      template_effect(() => set_text(text, `IotaNames Object ID: ${(get(packageIds), untrack(() => get(packageIds).IOTA_NAMES_OBJECT_ID)) ?? ""} `));
      append($$anchor2, details);
    };
    if_block(node, ($$render) => {
      if (get(showIotaNamesIds)) $$render(consequent_1);
    });
  }
  var node_3 = sibling(node, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var button = root_4();
      button.__click = handleCancelFetch;
      append($$anchor2, button);
    };
    var alternate = ($$anchor2) => {
      var button_1 = root_5();
      button_1.__click = handleListRegisteredNames;
      append($$anchor2, button_1);
    };
    if_block(node_3, ($$render) => {
      if (get(isFetchingNames)) $$render(consequent_2);
      else $$render(alternate, false);
    });
  }
  var button_2 = sibling(node_3, 2);
  button_2.__click = handleGetReverseRegisteredAddresses;
  var button_3 = sibling(button_2, 2);
  button_3.__click = handleToggleIotaNamesIds;
  var button_4 = sibling(button_3, 2);
  button_4.__click = handleGetDynamicFields;
  var button_5 = sibling(button_4, 4);
  button_5.__click = handleGetRegistryEntry;
  var button_6 = sibling(button_5, 2);
  button_6.__click = handleResolveName;
  var button_7 = sibling(button_6, 2);
  button_7.__click = handleResolveAddress;
  var button_8 = sibling(button_7, 4);
  button_8.__click = handleRegisterName;
  var button_9 = sibling(button_8, 2);
  button_9.__click = handleSetTargetAddress;
  var button_10 = sibling(button_9, 2);
  button_10.__click = handleSetReverseLookup;
  var span_3 = sibling(button_10, 4);
  var input_3 = sibling(child(span_3));
  var button_11 = sibling(span_3, 2);
  button_11.__click = handleStartAuctionAndPlaceBid;
  var button_12 = sibling(button_11, 2);
  button_12.__click = handlePlaceBid;
  var button_13 = sibling(button_12, 2);
  button_13.__click = handleClaim;
  var button_14 = sibling(button_13, 2);
  button_14.__click = handleListAuctions;
  var node_4 = sibling(button_14, 2);
  TransactionView(node_4, {
    get value() {
      return get(value);
    }
  });
  bind_value(input, () => get(localIotaNamesPackageId), ($$value) => set(localIotaNamesPackageId, $$value));
  bind_value(input_1, () => get(address), ($$value) => set(address, $$value));
  bind_value(input_2, () => get(nameName), ($$value) => set(nameName, $$value));
  bind_value(input_3, () => get(bidPrice), ($$value) => set(bidPrice, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["change", "click"]);
export {
  IotaNames as default
};

import { I as IotaGraphQLClient, x as getSelectedNetworkConfig, aD as Transaction, o as getClient, aF as toHex, bg as IOTA_CLOCK_OBJECT_ID, p as push, H as state, J as proxy, q as onMount, a6 as user_effect, r as store_get, a as from_html, b as if_block, g as get, c as child, s as sibling, n as set, D as TransactionView, t as template_effect, e as set_text, v as delegated, y as bind_value, k as append, l as pop, w as setup_stores, b0 as sharedClientConfig, L as each, R as comment, Q as first_child, O as index, ap as activeAddress, E as delegate } from "./index-BumFSv15.js";
import { I as IotaAmountInput } from "./IotaAmountInput-DEyFXtuO.js";
import { c as config, s as setCustomPackageId, g as getIotaNamesPackageId } from "./iota-names-config-Cr_9i2PR.js";
import { g as graphql } from "./index-a-qIJzeT.js";
import { e as executeTransaction } from "./transaction-execution-Ca2jd4Qh.js";
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
async function getReverseRegisteredAddresses(onProgress, signal) {
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
    let res = {
      total: 0,
      reverseRegistry: []
    };
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
        address: reverseRegistryId
      });
      if (object.errors) {
        break;
      }
      const newEntries = object.data.owner.dynamicFields.nodes.map((v) => {
        return {
          address: v.name.json,
          name: v.value.json.labels.reverse().join(".")
        };
      });
      res.total += newEntries.length;
      res.reverseRegistry.push(...newEntries);
      if (onProgress) {
        onProgress({ ...res });
      }
      if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
        cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
      } else {
        break;
      }
    }
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
        parentNft = subnameNft?.data?.objectId ?? "";
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
var root_1 = from_html(`<div style="display: flex; gap: 1.5rem; padding-right: 1rem; border-right: 1px solid var(--border-color); align-items: center;"><div style="display: flex; flex-direction: column;"><span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Registered Names</span> <span style="font-family: monospace; font-weight: 600; color: #4ade80;"> </span></div> <div style="display: flex; flex-direction: column;"><span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Reverse Lookups</span> <span style="font-family: monospace; font-weight: 600; color: #4ade80;"> </span></div></div>`);
var root_4 = from_html(`<div> </div>`);
var root_2 = from_html(`<div class="card" style="margin-bottom: 0.5rem;"><div class="card-header"><h3>IOTA-Names Details</h3></div> <div class="card-body" style="font-family: monospace; font-size: 0.85rem;"><div> </div> <!></div></div>`);
var root_5 = from_html(`<button class="danger">Cancel fetching names</button>`);
var root_6 = from_html(`<button>list registered names</button>`);
var root_7 = from_html(`<button class="danger">Cancel fetching reverse addresses</button>`);
var root_8 = from_html(`<button>get reverse registered addresses</button>`);
var root_10 = from_html(`<div class="badge">Loading...</div>`);
var root_12 = from_html(`<tr><td style="white-space: nowrap;"> </td><td style="font-family: monospace; font-size: 0.8rem; white-space: nowrap; word-break: normal;"> </td><td><button style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Details</button></td></tr>`);
var root_14 = from_html(`<tr><td style="white-space: nowrap;"> </td><td>-</td><td><button style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Details</button></td></tr>`);
var root_9 = from_html(`<div class="table-container scrollable"><table class="data-table"><thead style="position: sticky; top: 0; z-index: 10;"><tr><th colspan="3" style="background: var(--background-card); border-bottom: 1px solid var(--border-color); padding: 0.75rem 1rem;"><div style="display: flex; justify-content: space-between; align-items: center;"><h3 style="margin: 0; font-size: 1rem; color: var(--text-muted);"> </h3> <!></div></th></tr><tr style="background: var(--background-card);"><th style="min-width: 250px;">Name</th><th>Target Address</th><th style="min-width: 100px;">Actions</th></tr></thead><tbody><!></tbody></table></div>`);
var root_16 = from_html(`<div class="badge">Loading...</div>`);
var root_17 = from_html(`<tr><td style="font-family: monospace; font-size: 0.8rem; white-space: nowrap; word-break: normal;"> </td><td style="white-space: nowrap;"> </td></tr>`);
var root_15 = from_html(`<div class="table-container scrollable"><table class="data-table"><thead style="position: sticky; top: 0; z-index: 10;"><tr><th colspan="2" style="background: var(--background-card); border-bottom: 1px solid var(--border-color); padding: 0.75rem 1rem;"><div style="display: flex; justify-content: space-between; align-items: center;"><h3 style="margin: 0; font-size: 1rem; color: var(--text-muted);"> </h3> <!></div></th></tr><tr style="background: var(--background-card);"><th>Address</th><th style="min-width: 250px;">Name</th></tr></thead><tbody></tbody></table></div>`);
var root = from_html(`<div class="container"><div class="toolbar" style="margin-bottom: 0.5rem;"><!> <div class="toolbar-group"><label for="package-id">IotaNames Package ID</label> <input id="package-id" placeholder="package id 0x..."/></div> <div style="display: flex; gap: 0.5rem; align-self: flex-end;"><button> </button> <button>get dynamic fields</button></div></div> <!> <div class="toolbar" style="margin-bottom: 1rem;"><div class="toolbar-group"><label for="address">Address</label> <input id="address" placeholder="0x..."/></div> <div class="toolbar-group"><label for="name">Name</label> <input id="name" placeholder="name.iota"/></div> <div class="toolbar-group" style="min-width: 300px;"><!></div></div> <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem;"><div class="card"><div class="card-header"><h3>Resolver</h3></div> <div class="card-body actions"><button>get registry entry (by name)</button> <button>resolve name (by address)</button> <button>resolve address (by name)</button></div></div> <div class="card"><div class="card-header"><h3>Account & Actions</h3></div> <div class="card-body actions"><button>register name</button> <button>set target address</button> <button>set reverse lookup</button></div></div> <div class="card"><div class="card-header"><h3>Auction</h3></div> <div class="card-body actions"><button>start auction and place bid</button> <button>place bid</button> <button>claim</button> <button>list auctions</button></div></div> <div class="card"><div class="card-header"><h3>Debug & Tools</h3></div> <div class="card-body actions"><!> <!></div></div></div> <!> <!> <!></div>`);
function IotaNames($$anchor, $$props) {
  push($$props, true);
  const $sharedClientConfig = () => store_get(sharedClientConfig, "$sharedClientConfig", $$stores);
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let address = state("0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900");
  let nameName = state("name.iota");
  let bidPrice = state(1e7);
  let showIotaNamesIds = state(false);
  let value = state(proxy({}));
  let isFetchingNames = state(false);
  let isFetchingReverseAddresses = state(false);
  let abortController = null;
  let localIotaNamesPackageId = state(proxy(config.IOTA_NAMES_PACKAGE_ID));
  let packageIds = state(proxy({ ...config }));
  let registrySize = state(null);
  let reverseRegistrySize = state(null);
  async function updatePackageIdForNetwork() {
    getIotaNamesPackageId();
    set(localIotaNamesPackageId, config.IOTA_NAMES_PACKAGE_ID, true);
    set(packageIds, { ...config }, true);
    try {
      const dynamicFields = await getDynamicFields();
      const nodes = dynamicFields.data.owner.dynamicFields.nodes;
      const registryNode = nodes.find((node) => node.name.type.repr.includes("::registry::Registry"));
      if (registryNode && registryNode.value.json) {
        set(registrySize, parseInt(registryNode.value.json.registry.size, 10), true);
        set(reverseRegistrySize, parseInt(registryNode.value.json.reverse_registry.size, 10), true);
      } else {
        set(registrySize, null);
        set(reverseRegistrySize, null);
      }
    } catch (err) {
      console.error("Error fetching dynamic fields:", err);
      set(registrySize, null);
      set(reverseRegistrySize, null);
    }
  }
  onMount(async () => {
    await updatePackageIdForNetwork();
  });
  user_effect(() => {
    $sharedClientConfig().selected;
    updatePackageIdForNetwork();
  });
  const handleResolveAddress = async () => {
    try {
      set(value, await resolveAddress(get(nameName)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleResolveName = async () => {
    try {
      set(value, await resolveName(get(address)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleGetRegistryEntry = async () => {
    try {
      set(value, await getRegistryEntry(get(nameName)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleListRegisteredNames = async () => {
    try {
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();
      set(isFetchingNames, true);
      set(value, { total: 0, names: [], registrations: [], loading: true }, true);
      const finalResult = await listRegisteredNames(
        (progressResult) => {
          set(value, { ...progressResult, loading: true }, true);
        },
        abortController.signal
      );
      set(value, { ...finalResult, loading: false }, true);
    } catch (err) {
      if (err.name === "AbortError" || err.message === "Operation cancelled") {
        set(value, { ...get(value), loading: false, cancelled: true }, true);
      } else {
        set(value, err.toString(), true);
      }
    } finally {
      set(isFetchingNames, false);
      abortController = null;
    }
  };
  const handleGetReverseRegisteredAddresses = async () => {
    try {
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();
      set(isFetchingReverseAddresses, true);
      set(value, { total: 0, reverseRegistry: [], loading: true }, true);
      const finalResult = await getReverseRegisteredAddresses(
        (progressResult) => {
          set(value, { ...progressResult, loading: true }, true);
        },
        abortController.signal
      );
      set(value, { ...finalResult, loading: false }, true);
    } catch (err) {
      if (err.name === "AbortError" || err.message === "Operation cancelled") {
        set(value, { ...get(value), loading: false, cancelled: true }, true);
      } else {
        set(value, err.toString(), true);
      }
    } finally {
      set(isFetchingReverseAddresses, false);
      abortController = null;
    }
  };
  const handleGetDynamicFields = async () => {
    try {
      set(value, await getDynamicFields(), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleToggleIotaNamesIds = async () => {
    set(showIotaNamesIds, !get(showIotaNamesIds));
    if (get(showIotaNamesIds)) {
      try {
        await getPackageIds();
        set(packageIds, { ...config }, true);
      } catch (err) {
        set(value, "Error loading package IDs: " + err.toString());
        console.error("Error in getPackageIds:", err);
      }
    }
  };
  const handleRegisterName = async () => {
    try {
      set(value, await registerName(get(nameName), $activeAddress()), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleSetTargetAddress = async () => {
    try {
      set(value, await setTargetAddress(get(nameName), get(address)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleSetReverseLookup = async () => {
    try {
      set(value, await setReverseLookup(get(nameName)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleStartAuctionAndPlaceBid = async () => {
    try {
      set(value, await startAuctionAndPlaceBid(get(nameName), get(bidPrice)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handlePlaceBid = async () => {
    try {
      set(value, await placeBid(get(nameName), get(bidPrice)), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleClaim = async () => {
    try {
      set(value, await claim(get(nameName), $activeAddress()), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  const handleCancelFetch = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  const handleListAuctions = async () => {
    try {
      set(value, await listAuctions(), true);
    } catch (err) {
      set(value, err.toString(), true);
    }
  };
  var div = root();
  var div_1 = child(div);
  var node_1 = child(div_1);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_1();
      var div_3 = child(div_2);
      var span = sibling(child(div_3), 2);
      var text = child(span);
      var div_4 = sibling(div_3, 2);
      var span_1 = sibling(child(div_4), 2);
      var text_1 = child(span_1);
      template_effect(() => {
        set_text(text, get(registrySize));
        set_text(text_1, get(reverseRegistrySize));
      });
      append($$anchor2, div_2);
    };
    if_block(node_1, ($$render) => {
      if (get(registrySize) !== null && get(reverseRegistrySize) !== null) $$render(consequent);
    });
  }
  var div_5 = sibling(node_1, 2);
  var input = sibling(child(div_5), 2);
  var div_6 = sibling(div_5, 2);
  var button = child(div_6);
  var text_2 = child(button);
  var button_1 = sibling(button, 2);
  var node_2 = sibling(div_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_7 = root_2();
      var div_8 = sibling(child(div_7), 2);
      var div_9 = child(div_8);
      var text_3 = child(div_9);
      var node_3 = sibling(div_9, 2);
      each(
        node_3,
        17,
        () => [
          ["Payments", get(packageIds).PAYMENTS_PACKAGE_ID],
          ["Subname", get(packageIds).SUBNAME_PACKAGE_ID],
          ["Subname Proxy", get(packageIds).SUBNAME_PROXY_PACKAGE_ID],
          ["Auction", get(packageIds).AUCTION_PACKAGE_ID],
          ["Coupons", get(packageIds).COUPONS_PACKAGE_ID]
        ],
        index,
        ($$anchor3, item) => {
          var fragment = comment();
          var node_4 = first_child(fragment);
          {
            var consequent_1 = ($$anchor4) => {
              var div_10 = root_4();
              var text_4 = child(div_10);
              template_effect(() => set_text(text_4, `${get(item)[0] ?? ""} Package ID: ${get(item)[1] ?? ""}`));
              append($$anchor4, div_10);
            };
            if_block(node_4, ($$render) => {
              if (get(item)[1] && get(item)[1].length != 0) $$render(consequent_1);
            });
          }
          append($$anchor3, fragment);
        }
      );
      template_effect(() => set_text(text_3, `IotaNames Object ID: ${get(packageIds).IOTA_NAMES_OBJECT_ID ?? ""}`));
      append($$anchor2, div_7);
    };
    if_block(node_2, ($$render) => {
      if (get(showIotaNamesIds)) $$render(consequent_2);
    });
  }
  var div_11 = sibling(node_2, 2);
  var div_12 = child(div_11);
  var input_1 = sibling(child(div_12), 2);
  var div_13 = sibling(div_12, 2);
  var input_2 = sibling(child(div_13), 2);
  var div_14 = sibling(div_13, 2);
  var node_5 = child(div_14);
  IotaAmountInput(node_5, {
    id: "bid-price",
    label: "Bid Price",
    placeholder: "0",
    get value() {
      return get(bidPrice);
    },
    set value($$value) {
      set(bidPrice, $$value, true);
    }
  });
  var div_15 = sibling(div_11, 2);
  var div_16 = child(div_15);
  var div_17 = sibling(child(div_16), 2);
  var button_2 = child(div_17);
  var button_3 = sibling(button_2, 2);
  var button_4 = sibling(button_3, 2);
  var div_18 = sibling(div_16, 2);
  var div_19 = sibling(child(div_18), 2);
  var button_5 = child(div_19);
  var button_6 = sibling(button_5, 2);
  var button_7 = sibling(button_6, 2);
  var div_20 = sibling(div_18, 2);
  var div_21 = sibling(child(div_20), 2);
  var button_8 = child(div_21);
  var button_9 = sibling(button_8, 2);
  var button_10 = sibling(button_9, 2);
  var button_11 = sibling(button_10, 2);
  var div_22 = sibling(div_20, 2);
  var div_23 = sibling(child(div_22), 2);
  var node_6 = child(div_23);
  {
    var consequent_3 = ($$anchor2) => {
      var button_12 = root_5();
      delegated("click", button_12, handleCancelFetch);
      append($$anchor2, button_12);
    };
    var alternate = ($$anchor2) => {
      var button_13 = root_6();
      delegated("click", button_13, handleListRegisteredNames);
      append($$anchor2, button_13);
    };
    if_block(node_6, ($$render) => {
      if (get(isFetchingNames)) $$render(consequent_3);
      else $$render(alternate, false);
    });
  }
  var node_7 = sibling(node_6, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var button_14 = root_7();
      delegated("click", button_14, handleCancelFetch);
      append($$anchor2, button_14);
    };
    var alternate_1 = ($$anchor2) => {
      var button_15 = root_8();
      delegated("click", button_15, handleGetReverseRegisteredAddresses);
      append($$anchor2, button_15);
    };
    if_block(node_7, ($$render) => {
      if (get(isFetchingReverseAddresses)) $$render(consequent_4);
      else $$render(alternate_1, false);
    });
  }
  var node_8 = sibling(div_15, 2);
  {
    var consequent_7 = ($$anchor2) => {
      var div_24 = root_9();
      var table = child(div_24);
      var thead = child(table);
      var tr = child(thead);
      var th = child(tr);
      var div_25 = child(th);
      var h3 = child(div_25);
      var text_5 = child(h3);
      var node_9 = sibling(h3, 2);
      {
        var consequent_5 = ($$anchor3) => {
          var div_26 = root_10();
          append($$anchor3, div_26);
        };
        if_block(node_9, ($$render) => {
          if (get(value).loading) $$render(consequent_5);
        });
      }
      var tbody = sibling(thead);
      var node_10 = child(tbody);
      {
        var consequent_6 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_11 = first_child(fragment_1);
          each(node_11, 17, () => get(value).registrations, index, ($$anchor4, reg, i) => {
            var tr_1 = root_12();
            var td = child(tr_1);
            var text_6 = child(td);
            var td_1 = sibling(td);
            var text_7 = child(td_1);
            var td_2 = sibling(td_1);
            var button_16 = child(td_2);
            template_effect(() => {
              set_text(text_6, get(value).names[i]);
              set_text(text_7, get(reg).value?.json?.target_address || "-");
            });
            delegated("click", button_16, () => {
              set(nameName, get(value).names[i], true);
              handleGetRegistryEntry();
            });
            append($$anchor4, tr_1);
          });
          append($$anchor3, fragment_1);
        };
        var alternate_2 = ($$anchor3) => {
          var fragment_2 = comment();
          var node_12 = first_child(fragment_2);
          each(node_12, 17, () => get(value).names, index, ($$anchor4, name) => {
            var tr_2 = root_14();
            var td_3 = child(tr_2);
            var text_8 = child(td_3);
            var td_4 = sibling(td_3, 2);
            var button_17 = child(td_4);
            template_effect(() => set_text(text_8, get(name)));
            delegated("click", button_17, () => {
              set(nameName, get(name), true);
              handleGetRegistryEntry();
            });
            append($$anchor4, tr_2);
          });
          append($$anchor3, fragment_2);
        };
        if_block(node_10, ($$render) => {
          if (get(value).registrations && get(value).registrations.length > 0) $$render(consequent_6);
          else $$render(alternate_2, false);
        });
      }
      template_effect(() => set_text(text_5, `Registered Names (${get(value).total ?? ""})`));
      append($$anchor2, div_24);
    };
    if_block(node_8, ($$render) => {
      if (get(value)?.names) $$render(consequent_7);
    });
  }
  var node_13 = sibling(node_8, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var div_27 = root_15();
      var table_1 = child(div_27);
      var thead_1 = child(table_1);
      var tr_3 = child(thead_1);
      var th_1 = child(tr_3);
      var div_28 = child(th_1);
      var h3_1 = child(div_28);
      var text_9 = child(h3_1);
      var node_14 = sibling(h3_1, 2);
      {
        var consequent_8 = ($$anchor3) => {
          var div_29 = root_16();
          append($$anchor3, div_29);
        };
        if_block(node_14, ($$render) => {
          if (get(value).loading) $$render(consequent_8);
        });
      }
      var tbody_1 = sibling(thead_1);
      each(tbody_1, 21, () => get(value).reverseRegistry, index, ($$anchor3, entry) => {
        var tr_4 = root_17();
        var td_5 = child(tr_4);
        var text_10 = child(td_5);
        var td_6 = sibling(td_5);
        var text_11 = child(td_6);
        template_effect(() => {
          set_text(text_10, get(entry).address);
          set_text(text_11, get(entry).name);
        });
        append($$anchor3, tr_4);
      });
      template_effect(() => set_text(text_9, `Reverse Registered Addresses (${get(value).total ?? ""})`));
      append($$anchor2, div_27);
    };
    if_block(node_13, ($$render) => {
      if (get(value)?.reverseRegistry) $$render(consequent_9);
    });
  }
  var node_15 = sibling(node_13, 2);
  TransactionView(node_15, {
    get value() {
      return get(value);
    }
  });
  template_effect(() => set_text(text_2, `${get(showIotaNamesIds) ? "hide" : "show"} package ids`));
  delegated("change", input, () => {
    setCustomPackageId(get(localIotaNamesPackageId));
  });
  bind_value(input, () => get(localIotaNamesPackageId), ($$value) => set(localIotaNamesPackageId, $$value));
  delegated("click", button, handleToggleIotaNamesIds);
  delegated("click", button_1, handleGetDynamicFields);
  bind_value(input_1, () => get(address), ($$value) => set(address, $$value));
  bind_value(input_2, () => get(nameName), ($$value) => set(nameName, $$value));
  delegated("click", button_2, handleGetRegistryEntry);
  delegated("click", button_3, handleResolveName);
  delegated("click", button_4, handleResolveAddress);
  delegated("click", button_5, handleRegisterName);
  delegated("click", button_6, handleSetTargetAddress);
  delegated("click", button_7, handleSetReverseLookup);
  delegated("click", button_8, handleStartAuctionAndPlaceBid);
  delegated("click", button_9, handlePlaceBid);
  delegated("click", button_10, handleClaim);
  delegated("click", button_11, handleListAuctions);
  append($$anchor, div);
  pop();
  $$cleanup();
}
delegate(["change", "click"]);
export {
  IotaNames as default
};

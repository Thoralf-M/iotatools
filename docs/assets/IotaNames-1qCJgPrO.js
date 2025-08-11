import { p as push, i as init, f as from_html, s as sibling, c as child, m as mutable_source, b as if_block, g as get, V as store_get, E as bind_value, k as append, l as pop, U as setup_stores, a1 as activeAddress, T as getSelectedNetworkConfig, j as set, a4 as Transaction, n as getClient, z as each, A as index, t as template_effect, d as set_text, a7 as toHEX, a5 as isValidIotaAddress, aE as IOTA_CLOCK_OBJECT_ID, Y as delegate, J as comment, G as first_child } from "/assets/index-BnYhK8oQ.js";
import { I as IotaGraphQLClient, g as graphql } from "/assets/index-BBHJ0dF4.js";
import { T as TransactionView } from "/iota-utils/TransactionView-BslK_vRY.js";
import { e as executeTransaction } from "/iota-utils/transaction-execution-CVwcsiKm.js";
import "/iota-utils/transaction-view-D84UYr3l.js";
import "/iota-utils/style-CPwsKZh8.js";
import "/iota-utils/iota-nano-conversion-BN70dJwt.js";
const resolveAddress = async (_, IOTA_NAMES_OBJECT_ID, queryIotaNamesObjectId, IOTA_NAMES_PACKAGE_ID, nameName, value) => {
  var _a, _b, _c;
  try {
    if (get(IOTA_NAMES_OBJECT_ID).length == 0) {
      await queryIotaNamesObjectId();
    }
    const tx = new Transaction();
    let name = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::name::new`,
      arguments: [tx.pure.string(get(nameName))]
    });
    let registry = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::iota_names::registry`,
      typeArguments: [`${get(IOTA_NAMES_PACKAGE_ID)}::registry::Registry`],
      arguments: [
        tx.sharedObjectRef({
          objectId: get(IOTA_NAMES_OBJECT_ID),
          initialSharedVersion: 1,
          mutable: true
        })
      ]
    });
    let nameRecordOption = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::registry::lookup`,
      arguments: [registry, name]
    });
    let nameRecord = tx.moveCall({
      target: `0x1::option::borrow`,
      typeArguments: [`${get(IOTA_NAMES_PACKAGE_ID)}::name_record::NameRecord`],
      arguments: [nameRecordOption]
    });
    let targetAddressOption = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::name_record::target_address`,
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
    let resolvedAddress = "0x" + toHEX(new Uint8Array((_c = (_b = (_a = txResult.results) == null ? void 0 : _a.pop()) == null ? void 0 : _b.returnValues) == null ? void 0 : _c[0][0]));
    console.log(resolvedAddress);
    set(value, resolvedAddress);
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
};
const resolveName = async (__1, address, IOTA_NAMES_OBJECT_ID, queryIotaNamesObjectId, IOTA_NAMES_PACKAGE_ID, value) => {
  var _a, _b, _c;
  try {
    if (!isValidIotaAddress(get(address))) {
      throw new Error("invalid address");
    }
    if (get(IOTA_NAMES_OBJECT_ID).length == 0) {
      await queryIotaNamesObjectId();
    }
    const tx = new Transaction();
    let registry = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::iota_names::registry`,
      typeArguments: [`${get(IOTA_NAMES_PACKAGE_ID)}::registry::Registry`],
      arguments: [
        tx.sharedObjectRef({
          objectId: get(IOTA_NAMES_OBJECT_ID),
          initialSharedVersion: 1,
          mutable: true
        })
      ]
    });
    let nameOption = tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::registry::reverse_lookup`,
      arguments: [registry, tx.pure.address(get(address))]
    });
    let name = tx.moveCall({
      target: `0x1::option::borrow`,
      typeArguments: [`${get(IOTA_NAMES_PACKAGE_ID)}::name::Name`],
      arguments: [nameOption]
    });
    tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::name::to_string`,
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
    let nameBytes = (_c = (_b = (_a = txResult.results) == null ? void 0 : _a.pop()) == null ? void 0 : _b.returnValues) == null ? void 0 : _c[0][0].slice(1);
    let resolvedName = new TextDecoder().decode(new Uint8Array(nameBytes));
    console.log(resolvedName);
    set(value, resolvedName);
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
};
async function listRegisteredNames(__2, getRegisteredNamesInner, value) {
  try {
    await getRegisteredNamesInner(true);
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
async function getReverseRegisteredAddresses(__3, queryDynamicFields, IOTA_NAMES_PACKAGE_ID, queryGraphQl, value) {
  try {
    const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
    let dynamicFields = await queryDynamicFields();
    let registration = (
      // @ts-ignore
      dynamicFields.data.owner.dynamicFields.nodes.find((v) => v.name.type.repr == `${get(IOTA_NAMES_PACKAGE_ID)}::iota_names::RegistryKey<${get(IOTA_NAMES_PACKAGE_ID)}::registry::Registry>`)
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
    let object = await queryGraphQl(gqlClient, query, { address: reverseRegistryId });
    let res = {};
    res.total = object.data.owner.dynamicFields.nodes.length;
    res.reverseRegistry = object.data.owner.dynamicFields.nodes.map((v) => {
      return {
        address: v.name.json,
        name: v.value.json.labels.reverse().join(".")
      };
    });
    set(value, res);
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
async function getDynamicFields(__4, value, queryDynamicFields) {
  try {
    set(value, await queryDynamicFields());
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
async function toggleIotaNamesIds(__5, showIotaNamesIds, getPackageIds) {
  var _a;
  set(showIotaNamesIds, true);
  await getPackageIds();
  (_a = document.querySelector("details")) == null ? void 0 : _a.setAttribute("open", "true");
}
async function registerName(__6, getPackageIds, queryDynamicFields, nameName, IOTA_NAMES_PACKAGE_ID, IOTA_NAMES_OBJECT_ID, PAYMENTS_PACKAGE_ID, $activeAddress, getNft, SUBNAME_PROXY_PACKAGE_ID, SUBNAME_PACKAGE_ID, value) {
  var _a;
  try {
    await getPackageIds();
    let dynamicFields = await queryDynamicFields();
    let priceConfig = (
      // @ts-ignore
      dynamicFields.data.owner.dynamicFields.nodes.filter((d) => d.name.type.repr.includes("pricing_config::PricingConfig"))[0].value.json
    );
    let nameLabels = get(nameName).split(".");
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
        target: `${get(IOTA_NAMES_PACKAGE_ID)}::payment::init_registration`,
        arguments: [
          tx.object(get(IOTA_NAMES_OBJECT_ID)),
          tx.pure.string(get(nameName))
        ]
      });
      const payment = tx.splitCoins(tx.gas, [price]);
      const receipt = tx.moveCall({
        target: `${get(PAYMENTS_PACKAGE_ID)}::payments::handle_base_payment`,
        arguments: [
          tx.object(get(IOTA_NAMES_OBJECT_ID)),
          paymentIntent,
          payment
        ],
        typeArguments: [
          "0x0000000000000000000000000000000000000000000000000000000000000002::iota::IOTA"
        ]
      });
      const nft = tx.moveCall({
        target: `${get(IOTA_NAMES_PACKAGE_ID)}::payment::register`,
        arguments: [
          receipt,
          tx.object(get(IOTA_NAMES_OBJECT_ID)),
          tx.object(IOTA_CLOCK_OBJECT_ID)
        ]
      });
      tx.transferObjects([nft], tx.pure.address($activeAddress()));
    } else {
      let isParentSubname = nameLabels.length > 3;
      nameLabels.shift();
      let parentNameName = nameLabels.join(".");
      let parentNft = await getNft(parentNameName);
      let expirationNextMonthTimestampMs = Date.now() + 1e3 * 60 * 60 * 24 * 30;
      if (isParentSubname) {
        const client = getClient();
        const outputs = await client.getOwnedObjects({
          owner: $activeAddress(),
          options: { showContent: true, showType: true }
        });
        const subnameOutputs = outputs.data.filter((output) => output.data.content.type.includes("SubNameRegistration"));
        let subnameNft = subnameOutputs.find((e) => e.data.content.fields.nft.fields.name == parentNameName);
        parentNft = (_a = subnameNft == null ? void 0 : subnameNft.data) == null ? void 0 : _a.objectId;
        expirationNextMonthTimestampMs = // @ts-ignore
        subnameNft.data.content.fields.nft.fields.expiration_timestamp_ms;
      }
      let allowChildCreation = true;
      let allowTimeExtension = true;
      const subNft = tx.moveCall({
        target: isParentSubname ? `${get(SUBNAME_PROXY_PACKAGE_ID)}::subname_proxy::new` : `${get(SUBNAME_PACKAGE_ID)}::subnames::new`,
        arguments: [
          tx.object(get(IOTA_NAMES_OBJECT_ID)),
          tx.object(parentNft),
          tx.object(IOTA_CLOCK_OBJECT_ID),
          tx.pure.string(get(nameName)),
          tx.pure.u64(expirationNextMonthTimestampMs),
          tx.pure.bool(allowChildCreation),
          tx.pure.bool(allowTimeExtension)
        ]
      });
      tx.transferObjects([subNft], tx.pure.address($activeAddress()));
    }
    set(value, await executeTransaction(tx));
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
async function setTargetAddress(__7, getPackageIds, getRegisteredNamesInner, nameName, IOTA_NAMES_PACKAGE_ID, IOTA_NAMES_OBJECT_ID, address, value) {
  try {
    await getPackageIds();
    let registered = await getRegisteredNamesInner();
    let registrationIndex = registered.registrations.findIndex((e) => e.name.json.labels.join(".") == get(nameName));
    if (registrationIndex == -1) {
      throw new Error("name not found");
    }
    let nft_id = (
      // @ts-ignore
      registered.registrations[registrationIndex].value.json.nft_id
    );
    let tx = new Transaction();
    tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::controller::set_target_address`,
      arguments: [
        tx.object(get(IOTA_NAMES_OBJECT_ID)),
        tx.object(nft_id),
        tx.pure.option("address", get(address)),
        tx.object("0x6")
      ]
    });
    set(value, await executeTransaction(tx));
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
async function setReverseLookup(__8, getPackageIds, IOTA_NAMES_PACKAGE_ID, IOTA_NAMES_OBJECT_ID, nameName, value) {
  try {
    await getPackageIds();
    let tx = new Transaction();
    tx.moveCall({
      target: `${get(IOTA_NAMES_PACKAGE_ID)}::controller::set_reverse_lookup`,
      arguments: [
        tx.object(get(IOTA_NAMES_OBJECT_ID)),
        tx.pure.string(get(nameName))
      ]
    });
    set(value, await executeTransaction(tx));
  } catch (err) {
    set(value, err.toString());
    console.error(err);
  }
}
var on_change = (
  // @ts-ignore
  (__9, IOTA_NAMES_OBJECT_ID, PAYMENTS_PACKAGE_ID, SUBNAME_PACKAGE_ID, SUBNAME_PROXY_PACKAGE_ID, AUCTION_PACKAGE_ID, COUPONS_PACKAGE_ID) => {
    set(IOTA_NAMES_OBJECT_ID, "");
    set(PAYMENTS_PACKAGE_ID, "");
    set(SUBNAME_PACKAGE_ID, "");
    set(SUBNAME_PROXY_PACKAGE_ID, "");
    set(AUCTION_PACKAGE_ID, "");
    set(COUPONS_PACKAGE_ID, "");
  }
);
var root_3 = from_html(` <br/>`, 1);
var root_1 = from_html(`<details><summary>IOTA-Names IDs</summary> <div> <br/> <!></div></details>`);
var root = from_html(`<main><span>IotaNames package id (default for devnet): <input placeholder="package id 0x..." size="67"/></span> <br/> <br/> <span>address: <input placeholder="address 0x..." size="67"/></span> <span>name: <input placeholder="name.iota"/></span> <br/> <br/> <!> General information: <button class="svelte-8fa537">list registered names</button> <button class="svelte-8fa537">get reverse registered addresses</button> <button class="svelte-8fa537">show package ids</button> <button class="svelte-8fa537">get dynamic fields</button> <hr/> Resolver: <button class="svelte-8fa537">resolve address (by name)</button> <button class="svelte-8fa537">resolve name (by address)</button> <hr/> Tx actions: <button class="svelte-8fa537">register name</button> <button class="svelte-8fa537">set target address</button> <button class="svelte-8fa537">set reverse lookup</button> <hr/> Auction: <span>bid price: <input type="number" placeholder="0" style="width: 14rem;"/></span> <button class="svelte-8fa537">start auction and place bid</button> <button class="svelte-8fa537">place bid</button> <button class="svelte-8fa537">claim</button> <button class="svelte-8fa537">list auctions</button> <!></main>`);
function IotaNames($$anchor, $$props) {
  push($$props, false);
  const [$$stores, $$cleanup] = setup_stores();
  const $activeAddress = () => store_get(activeAddress, "$activeAddress", $$stores);
  let address = mutable_source("0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900");
  let nameName = mutable_source("name.iota");
  let bidPrice = mutable_source(1e7);
  let IOTA_NAMES_PACKAGE_ID = mutable_source("0xb9d617f24c84826bf660a2f4031951678cc80c264aebc4413459fb2a95ada9ba");
  let AUCTION_PACKAGE_ID = mutable_source("");
  let AUCTION_HOUSE_OBJECT_ID = "";
  let COUPONS_PACKAGE_ID = mutable_source("");
  let PAYMENTS_PACKAGE_ID = mutable_source("");
  let SUBNAME_PACKAGE_ID = mutable_source("");
  let IOTA_NAMES_OBJECT_ID = mutable_source("");
  let SUBNAME_PROXY_PACKAGE_ID = mutable_source("");
  let showIotaNamesIds = mutable_source(false);
  let value = mutable_source({});
  async function queryIotaNamesObjectId() {
    const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
    const objectQuery = `{
          objects(filter: {type: "${get(IOTA_NAMES_PACKAGE_ID)}::iota_names::IotaNames"}) {
            edges {
              node {
                address
              }
            }
          }
        }`;
    let object = await queryGraphQl(gqlClient, objectQuery, {});
    set(IOTA_NAMES_OBJECT_ID, object.data.objects.edges[0].node.address);
  }
  async function queryAuctionObjectId() {
    const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
    const objectQuery = `{
          objects(filter: {type: "${get(AUCTION_PACKAGE_ID)}::auction::AuctionHouse"}) {
            edges {
              node {
                address
              }
            }
          }
        }`;
    let object = await queryGraphQl(gqlClient, objectQuery, {});
    AUCTION_HOUSE_OBJECT_ID = object.data.objects.edges[0].node.address;
  }
  async function queryGraphQl(gqlClient, query, variables) {
    const options = { query: graphql(query), variables };
    return gqlClient.query(options);
  }
  async function getRegisteredNamesInner(showResult) {
    const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
    let dynamicFields = await queryDynamicFields();
    let registration = (
      // @ts-ignore
      dynamicFields.data.owner.dynamicFields.nodes.find((v) => v.name.type.repr == `${get(IOTA_NAMES_PACKAGE_ID)}::iota_names::RegistryKey<${get(IOTA_NAMES_PACKAGE_ID)}::registry::Registry>`)
    );
    let registryId = registration.value.json.registry.id;
    let res = { total: 0, names: [], registrations: [] };
    let cursorSection = "";
    while (true) {
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
      let object = await queryGraphQl(gqlClient, query, { address: registryId });
      if (object.errors) {
        break;
      }
      res.total += object.data.owner.dynamicFields.nodes.length;
      res.names.push(...object.data.owner.dynamicFields.nodes.map((v) => v.name.json.labels.reverse().join(".")));
      res.registrations.push(...object.data.owner.dynamicFields.nodes);
      if (showResult) {
        set(value, res);
      }
      if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
        cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
      } else {
        break;
      }
    }
    return res;
  }
  async function queryDynamicFields() {
    const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
    if (get(IOTA_NAMES_OBJECT_ID).length == 0) {
      await queryIotaNamesObjectId();
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
    let dynamicFields = await queryGraphQl(gqlClient, objectQuery, { address: get(IOTA_NAMES_OBJECT_ID) });
    return dynamicFields;
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
        set(AUCTION_PACKAGE_ID, parsePackageId("auction::AuctionAuth", dynamicFields));
        set(COUPONS_PACKAGE_ID, parsePackageId("coupon_house::CouponHouse", dynamicFields));
      } catch (e) {
        console.error(e);
      }
      set(PAYMENTS_PACKAGE_ID, parsePackageId("payments::PaymentsConfig", dynamicFields));
      set(SUBNAME_PACKAGE_ID, parsePackageId("subnames::SubnamesAuth", dynamicFields));
      set(SUBNAME_PROXY_PACKAGE_ID, parsePackageId("subname_proxy::SubnameProxyAuth", dynamicFields));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function getNft(nameName2) {
    let registered = await getRegisteredNamesInner();
    let registrationIndex = registered.registrations.findIndex((e) => e.name.json.labels.join(".") == nameName2);
    if (registrationIndex == -1) {
      throw new Error("name not found");
    }
    return registered.registrations[registrationIndex].value.json.nft_id;
  }
  async function startAuctionAndPlaceBid() {
    try {
      await getPackageIds();
      await queryAuctionObjectId();
      let nameLabels = get(nameName).split(".");
      if (nameLabels.length != 2) {
        throw new Error("can only start an auction for names with 2 labels (name.iota)");
      }
      let tx = new Transaction();
      const payment = tx.splitCoins(tx.gas, [get(bidPrice)]);
      tx.moveCall({
        target: `${get(AUCTION_PACKAGE_ID)}::auction::start_auction_and_place_bid`,
        arguments: [
          tx.object(AUCTION_HOUSE_OBJECT_ID),
          tx.object(get(IOTA_NAMES_OBJECT_ID)),
          tx.pure.string(get(nameName)),
          payment,
          tx.object("0x6")
        ]
      });
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function placeBid() {
    try {
      await getPackageIds();
      await queryAuctionObjectId();
      let nameLabels = get(nameName).split(".");
      if (nameLabels.length != 2) {
        throw new Error("can only bid for names with 2 labels (name.iota)");
      }
      let tx = new Transaction();
      const payment = tx.splitCoins(tx.gas, [get(bidPrice)]);
      tx.moveCall({
        target: `${get(AUCTION_PACKAGE_ID)}::auction::place_bid`,
        arguments: [
          tx.object(AUCTION_HOUSE_OBJECT_ID),
          tx.pure.string(get(nameName)),
          payment,
          tx.object("0x6")
        ]
      });
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function claim() {
    try {
      await getPackageIds();
      await queryAuctionObjectId();
      let nameLabels = get(nameName).split(".");
      if (nameLabels.length != 2) {
        throw new Error("can only claim names with 2 labels (name.iota)");
      }
      let tx = new Transaction();
      let nft = tx.moveCall({
        target: `${get(AUCTION_PACKAGE_ID)}::auction::claim`,
        arguments: [
          tx.object(AUCTION_HOUSE_OBJECT_ID),
          tx.pure.string(get(nameName)),
          tx.object("0x6")
        ]
      });
      tx.transferObjects([nft], tx.pure.address($activeAddress()));
      set(value, await executeTransaction(tx));
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  async function listAuctions() {
    var _a, _b, _c, _d, _e;
    try {
      await getPackageIds();
      await queryAuctionObjectId();
      let client = getClient();
      let object = await client.getObject({
        id: AUCTION_HOUSE_OBJECT_ID,
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
      res.objectId = (_a = object.data) == null ? void 0 : _a.objectId;
      res.previousTransaction = (_b = object.data) == null ? void 0 : _b.previousTransaction;
      res.balance = (_e = (_d = (_c = object.data) == null ? void 0 : _c.content) == null ? void 0 : _d.fields) == null ? void 0 : _e.balance;
      let linked_table_id = (
        // @ts-ignore
        object.data.content.fields.auctions.fields.id.id
      );
      const gqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
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
        let object2 = await queryGraphQl(gqlClient, query, { address: get(IOTA_NAMES_OBJECT_ID) });
        if (object2.errors) {
          break;
        }
        let now = /* @__PURE__ */ (/* @__PURE__ */ new Date()).getTime();
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
            res.unclaimedAuctionNames.push(auction.value.nft.name_str + " " + auction.value.winner);
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
      set(value, res);
    } catch (err) {
      set(value, err.toString());
      console.error(err);
    }
  }
  function timeAgo(timestamp) {
    const now = /* @__PURE__ */ (/* @__PURE__ */ new Date()).getTime();
    const diff = timestamp - now;
    const seconds = Math.abs(diff) / 1e3;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    if (diff > 0) {
      if (months >= 1) return `in ${Math.round(months)} month${months > 1 ? "s" : ""}`;
      if (days >= 1) return `in ${Math.round(days)} day${days > 1 ? "s" : ""}`;
      if (hours >= 1) return `in ${Math.round(hours)} hour${hours > 1 ? "s" : ""}`;
      if (minutes >= 1) return `in ${Math.round(minutes)} minute${minutes > 1 ? "s" : ""}`;
      return `in ${Math.round(seconds)} second${seconds > 1 ? "s" : ""}`;
    } else {
      if (months >= 1) return `${Math.round(months)} month${months > 1 ? "s" : ""} ago`;
      if (days >= 1) return `${Math.round(days)} day${days > 1 ? "s" : ""} ago`;
      if (hours >= 1) return `${Math.round(hours)} hour${hours > 1 ? "s" : ""} ago`;
      if (minutes >= 1) return `${Math.round(minutes)} minute${minutes > 1 ? "s" : ""} ago`;
      return `${Math.round(seconds)} second${seconds > 1 ? "s" : ""} ago`;
    }
  }
  init();
  var main = root();
  var span = child(main);
  var input = sibling(child(span));
  input.__change = [
    on_change,
    IOTA_NAMES_OBJECT_ID,
    PAYMENTS_PACKAGE_ID,
    SUBNAME_PACKAGE_ID,
    SUBNAME_PROXY_PACKAGE_ID,
    AUCTION_PACKAGE_ID,
    COUPONS_PACKAGE_ID
  ];
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
        () => [
          ["Payments", get(PAYMENTS_PACKAGE_ID)],
          ["Subname", get(SUBNAME_PACKAGE_ID)],
          ["Subname Proxy", get(SUBNAME_PROXY_PACKAGE_ID)],
          ["Auction", get(AUCTION_PACKAGE_ID)],
          ["Coupons", get(COUPONS_PACKAGE_ID)]
        ],
        index,
        ($$anchor3, item) => {
          var fragment = comment();
          var node_2 = first_child(fragment);
          {
            var consequent = ($$anchor4) => {
              var fragment_1 = root_3();
              var text_1 = first_child(fragment_1);
              template_effect(() => set_text(text_1, `${get(item)[0] ?? ""} Package ID: ${get(item)[1] ?? ""} `));
              append($$anchor4, fragment_1);
            };
            if_block(node_2, ($$render) => {
              if (get(item)[1].length != 0) $$render(consequent);
            });
          }
          append($$anchor3, fragment);
        }
      );
      template_effect(() => set_text(text, `IotaNames Object ID: ${get(IOTA_NAMES_OBJECT_ID) ?? ""} `));
      append($$anchor2, details);
    };
    if_block(node, ($$render) => {
      if (get(showIotaNamesIds)) $$render(consequent_1);
    });
  }
  var button = sibling(node, 2);
  button.__click = [listRegisteredNames, getRegisteredNamesInner, value];
  var button_1 = sibling(button, 2);
  button_1.__click = [
    getReverseRegisteredAddresses,
    queryDynamicFields,
    IOTA_NAMES_PACKAGE_ID,
    queryGraphQl,
    value
  ];
  var button_2 = sibling(button_1, 2);
  button_2.__click = [toggleIotaNamesIds, showIotaNamesIds, getPackageIds];
  var button_3 = sibling(button_2, 2);
  button_3.__click = [getDynamicFields, value, queryDynamicFields];
  var button_4 = sibling(button_3, 4);
  button_4.__click = [
    resolveAddress,
    IOTA_NAMES_OBJECT_ID,
    queryIotaNamesObjectId,
    IOTA_NAMES_PACKAGE_ID,
    nameName,
    value
  ];
  var button_5 = sibling(button_4, 2);
  button_5.__click = [
    resolveName,
    address,
    IOTA_NAMES_OBJECT_ID,
    queryIotaNamesObjectId,
    IOTA_NAMES_PACKAGE_ID,
    value
  ];
  var button_6 = sibling(button_5, 4);
  button_6.__click = [
    registerName,
    getPackageIds,
    queryDynamicFields,
    nameName,
    IOTA_NAMES_PACKAGE_ID,
    IOTA_NAMES_OBJECT_ID,
    PAYMENTS_PACKAGE_ID,
    $activeAddress,
    getNft,
    SUBNAME_PROXY_PACKAGE_ID,
    SUBNAME_PACKAGE_ID,
    value
  ];
  var button_7 = sibling(button_6, 2);
  button_7.__click = [
    setTargetAddress,
    getPackageIds,
    getRegisteredNamesInner,
    nameName,
    IOTA_NAMES_PACKAGE_ID,
    IOTA_NAMES_OBJECT_ID,
    address,
    value
  ];
  var button_8 = sibling(button_7, 2);
  button_8.__click = [
    setReverseLookup,
    getPackageIds,
    IOTA_NAMES_PACKAGE_ID,
    IOTA_NAMES_OBJECT_ID,
    nameName,
    value
  ];
  var span_3 = sibling(button_8, 4);
  var input_3 = sibling(child(span_3));
  var button_9 = sibling(span_3, 2);
  button_9.__click = startAuctionAndPlaceBid;
  var button_10 = sibling(button_9, 2);
  button_10.__click = placeBid;
  var button_11 = sibling(button_10, 2);
  button_11.__click = claim;
  var button_12 = sibling(button_11, 2);
  button_12.__click = listAuctions;
  var node_3 = sibling(button_12, 2);
  TransactionView(node_3, {
    get value() {
      return get(value);
    }
  });
  bind_value(input, () => get(IOTA_NAMES_PACKAGE_ID), ($$value) => set(IOTA_NAMES_PACKAGE_ID, $$value));
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

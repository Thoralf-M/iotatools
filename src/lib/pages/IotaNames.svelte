<script lang="ts">
    import {
        IotaGraphQLClient,
        type GraphQLQueryOptions,
        type GraphQLQueryResult,
    } from '@iota/iota-sdk/graphql';
    import { graphql } from '@iota/iota-sdk/graphql/schemas/2025.2';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_CLOCK_OBJECT_ID, isValidIotaAddress, toHEX } from '@iota/iota-sdk/utils';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient, getSelectedNetworkConfig } from '../lib/client';
    import { activeAddress } from '../lib/signer-data';
    import { executeTransaction } from '../lib/transaction-execution';

    let address = '0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900';
    let nameName = 'name.iota';
    let bidPrice = 10000000;
    let DEVNET_PACKAGE_ID = '0xb9d617f24c84826bf660a2f4031951678cc80c264aebc4413459fb2a95ada9ba';
    let TESTNET_PACKAGE_ID = '0x7fff6e95f385349bec98d17121ab2bfa3e134f2f0b1ccefc270313415f7835ea';
    let IOTA_NAMES_PACKAGE_ID = TESTNET_PACKAGE_ID;
    let AUCTION_PACKAGE_ID = '';
    let AUCTION_HOUSE_OBJECT_ID = '';
    let COUPONS_PACKAGE_ID = '';
    let PAYMENTS_PACKAGE_ID = '';
    let SUBNAME_PACKAGE_ID = '';
    let IOTA_NAMES_OBJECT_ID = '';
    let SUBNAME_PROXY_PACKAGE_ID = '';
    let showIotaNamesIds = false;
    // Will be updated with the result
    let value = {};

    const resolveAddress = async () => {
        try {
            if (IOTA_NAMES_OBJECT_ID.length == 0) {
                await queryIotaNamesObjectId();
            }
            const tx = new Transaction();
            let name = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::name::new`,
                arguments: [tx.pure.string(nameName)],
            });
            let registry = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
                typeArguments: [`${IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
                arguments: [
                    tx.sharedObjectRef({
                        objectId: IOTA_NAMES_OBJECT_ID,
                        initialSharedVersion: 1,
                        mutable: true,
                    }),
                ],
            });
            let nameRecordOption = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::registry::lookup`,
                arguments: [registry, name],
            });
            let nameRecord = tx.moveCall({
                target: `0x1::option::borrow`,
                typeArguments: [`${IOTA_NAMES_PACKAGE_ID}::name_record::NameRecord`],
                arguments: [nameRecordOption],
            });
            let targetAddressOption = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::name_record::target_address`,
                arguments: [nameRecord],
            });
            tx.moveCall({
                target: `0x1::option::borrow`,
                typeArguments: [`address`],
                arguments: [targetAddressOption],
            });

            let client = getClient();
            let txResult = await client.devInspectTransactionBlock({
                sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
                transactionBlock: tx,
            });
            console.log(txResult);
            if (txResult.error) {
                throw new Error(txResult.error);
            }
            let resolvedAddress =
                '0x' + toHEX(new Uint8Array(txResult.results?.pop()?.returnValues?.[0][0]!));
            console.log(resolvedAddress);
            value = resolvedAddress;
            // result = JSON.stringify(txResult, null, 2);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    const resolveName = async () => {
        try {
            if (!isValidIotaAddress(address)) {
                throw new Error('invalid address');
            }
            if (IOTA_NAMES_OBJECT_ID.length == 0) {
                await queryIotaNamesObjectId();
            }
            const tx = new Transaction();
            let registry = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::iota_names::registry`,
                typeArguments: [`${IOTA_NAMES_PACKAGE_ID}::registry::Registry`],
                arguments: [
                    tx.sharedObjectRef({
                        objectId: IOTA_NAMES_OBJECT_ID,
                        initialSharedVersion: 1,
                        mutable: true,
                    }),
                ],
            });
            let nameOption = tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::registry::reverse_lookup`,
                arguments: [registry, tx.pure.address(address)],
            });
            let name = tx.moveCall({
                target: `0x1::option::borrow`,
                typeArguments: [`${IOTA_NAMES_PACKAGE_ID}::name::Name`],
                arguments: [nameOption],
            });
            tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::name::to_string`,
                arguments: [name],
            });

            let client = getClient();
            let txResult = await client.devInspectTransactionBlock({
                sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
                transactionBlock: tx,
            });
            console.log(txResult);
            if (txResult.error) {
                throw new Error(txResult.error);
            }
            // .slice(1) to remove the length prefix
            let nameBytes = txResult.results?.pop()?.returnValues?.[0][0]!.slice(1)!;
            let resolvedName = new TextDecoder().decode(new Uint8Array(nameBytes));
            console.log(resolvedName);
            value = resolvedName;
            // result = JSON.stringify(txResult, null, 2);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    async function queryIotaNamesObjectId() {
        const gqlClient = new IotaGraphQLClient({
            url: getSelectedNetworkConfig().graphql,
        });

        const objectQuery = `{
          objects(filter: {type: "${IOTA_NAMES_PACKAGE_ID}::iota_names::IotaNames"}) {
            edges {
              node {
                address
              }
            }
          }
        }`;
        let object: GraphQLQueryResult = await queryGraphQl(gqlClient, objectQuery, {});
        // @ts-ignore
        IOTA_NAMES_OBJECT_ID = object.data.objects.edges[0].node.address;
    }
    async function queryAuctionObjectId() {
        const gqlClient = new IotaGraphQLClient({
            url: getSelectedNetworkConfig().graphql,
        });

        const objectQuery = `{
          objects(filter: {type: "${AUCTION_PACKAGE_ID}::auction::AuctionHouse"}) {
            edges {
              node {
                address
              }
            }
          }
        }`;
        let object: GraphQLQueryResult = await queryGraphQl(gqlClient, objectQuery, {});
        // @ts-ignore
        AUCTION_HOUSE_OBJECT_ID = object.data.objects.edges[0].node.address;
    }
    async function queryGraphQl(
        gqlClient: IotaGraphQLClient,
        query: string,
        variables: Record<string, any>,
    ): Promise<GraphQLQueryResult> {
        const options: GraphQLQueryOptions = {
            query: graphql(query),
            variables,
        };
        return gqlClient.query(options);
    }
    async function getRegisteredNamesInner(showResult?: boolean): Promise<object> {
        const gqlClient = new IotaGraphQLClient({
            url: getSelectedNetworkConfig().graphql,
        });

        let dynamicFields = await queryDynamicFields();
        let registration =
            // @ts-ignore
            dynamicFields.data.owner.dynamicFields.nodes.find(
                (v: any) =>
                    v.name.type.repr ==
                    `${IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${IOTA_NAMES_PACKAGE_ID}::registry::Registry>`,
            );
        let registryId = registration.value.json.registry.id;

        let res = { total: 0, names: [], registrations: [] };

        let cursorSection = '';
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

            let object: GraphQLQueryResult = await queryGraphQl(gqlClient, query, {
                address: registryId,
            });

            if (object.errors) {
                break;
            }
            // @ts-ignore
            res.total += object.data.owner.dynamicFields.nodes.length;
            res.names.push(
                // @ts-ignore
                ...object.data.owner.dynamicFields.nodes.map((v) =>
                    v.name.json.labels.reverse().join('.'),
                ),
            );
            // @ts-ignore
            res.registrations.push(...object.data.owner.dynamicFields.nodes);

            if (showResult) {
                value = res;
            }
            // @ts-ignore
            if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
                // @ts-ignore
                cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
            } else {
                break;
            }
        }

        return res;
    }
    async function listRegisteredNames() {
        try {
            await getRegisteredNamesInner(true);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function getReverseRegisteredAddresses() {
        try {
            const gqlClient = new IotaGraphQLClient({
                url: getSelectedNetworkConfig().graphql,
            });

            let dynamicFields = await queryDynamicFields();
            let registration =
                // @ts-ignore
                dynamicFields.data.owner.dynamicFields.nodes.find(
                    (v: any) =>
                        v.name.type.repr ==
                        `${IOTA_NAMES_PACKAGE_ID}::iota_names::RegistryKey<${IOTA_NAMES_PACKAGE_ID}::registry::Registry>`,
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

            let object: GraphQLQueryResult = await queryGraphQl(gqlClient, query, {
                address: reverseRegistryId,
            });

            let res = {};
            // @ts-ignore
            res.total = object.data.owner.dynamicFields.nodes.length;
            // @ts-ignore
            res.reverseRegistry = object.data.owner.dynamicFields.nodes.map((v: any) => {
                return {
                    address: v.name.json,
                    name: v.value.json.labels.reverse().join('.'),
                };
            });
            value = res;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function getDynamicFields() {
        try {
            value = await queryDynamicFields();
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function queryDynamicFields(): Promise<GraphQLQueryResult> {
        const gqlClient = new IotaGraphQLClient({
            url: getSelectedNetworkConfig().graphql,
        });

        if (IOTA_NAMES_OBJECT_ID.length == 0) {
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
        let dynamicFields: any = await queryGraphQl(gqlClient, objectQuery, {
            address: IOTA_NAMES_OBJECT_ID,
        });
        return dynamicFields;
    }
    async function toggleIotaNamesIds() {
        showIotaNamesIds = true;
        await getPackageIds();
        // open the details element
        document.querySelector('details')?.setAttribute('open', 'true');
    }
    async function getPackageIds() {
        try {
            // @ts-ignore
            let dynamicFields = (await queryDynamicFields()).data.owner.dynamicFields.nodes;
            // Don't want to fail everything if auction/coupons are not existing
            try {
                AUCTION_PACKAGE_ID = parsePackageId('auction::AuctionAuth', dynamicFields);
                COUPONS_PACKAGE_ID = parsePackageId('coupon_house::CouponHouse', dynamicFields);
            } catch (e) {
                console.error(e);
            }
            PAYMENTS_PACKAGE_ID = parsePackageId('payments::PaymentsConfig', dynamicFields);
            SUBNAME_PACKAGE_ID = parsePackageId('subnames::SubnamesAuth', dynamicFields);
            SUBNAME_PROXY_PACKAGE_ID = parsePackageId(
                'subname_proxy::SubnameProxyAuth',
                dynamicFields,
            );

            function parsePackageId(moduleStruct: string, dynamicFields: object[]): string {
                return dynamicFields
                    .filter((d: any) => d.name.type.repr.includes(moduleStruct))
                    .map((d: any) => {
                        let type: string = d.name.type.repr;
                        let index = type.indexOf('<');
                        return type.slice(index + 1, index + 67);
                    })[0];
            }
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function registerName() {
        try {
            await getPackageIds();
            let dynamicFields = await queryDynamicFields();
            let priceConfig =
                // @ts-ignore
                dynamicFields.data.owner.dynamicFields.nodes.filter((d: any) =>
                    d.name.type.repr.includes('pricing_config::PricingConfig'),
                )[0].value.json;
            let nameLabels = nameName.split('.');
            let length = nameLabels[0].length;
            if (length < 3) {
                throw new Error('name too short (minimum 3 characters)');
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
                    target: `${IOTA_NAMES_PACKAGE_ID}::payment::init_registration`,
                    arguments: [tx.object(IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)],
                });

                const payment = tx.splitCoins(tx.gas, [price]);
                const receipt = tx.moveCall({
                    target: `${PAYMENTS_PACKAGE_ID}::payments::handle_base_payment`,
                    arguments: [tx.object(IOTA_NAMES_OBJECT_ID), paymentIntent, payment],
                    typeArguments: [
                        '0x0000000000000000000000000000000000000000000000000000000000000002::iota::IOTA',
                    ],
                });
                const nft = tx.moveCall({
                    target: `${IOTA_NAMES_PACKAGE_ID}::payment::register`,
                    arguments: [
                        receipt,
                        tx.object(IOTA_NAMES_OBJECT_ID),
                        tx.object(IOTA_CLOCK_OBJECT_ID),
                    ],
                });
                tx.transferObjects([nft], tx.pure.address($activeAddress));
            } else {
                // Subnames
                let isParentSubname = nameLabels.length > 3;
                nameLabels.shift();
                let parentNameName = nameLabels.join('.')!;
                let parentNft = await getNft(parentNameName);

                let expirationNextMonthTimestampMs = Date.now() + 1000 * 60 * 60 * 24 * 30;

                if (isParentSubname) {
                    // parent NFT is wrapped in Subname NFT, so the subname NFT must be provided
                    const client = getClient();
                    const outputs = await client.getOwnedObjects({
                        owner: $activeAddress,
                        options: { showContent: true, showType: true },
                    });
                    // Find the output that contains the parentNft id
                    const subnameOutputs = outputs.data.filter((output) =>
                        // @ts-ignore
                        output.data.content.type.includes('SubNameRegistration'),
                    );
                    let subnameNft = subnameOutputs.find(
                        (e) =>
                            // @ts-ignore
                            e.data.content.fields.nft.fields.name == parentNameName,
                    );
                    parentNft = subnameNft?.data?.objectId!;
                    // Expiration time can be at most the same as the parent
                    expirationNextMonthTimestampMs =
                        // @ts-ignore
                        subnameNft.data.content.fields.nft.fields.expiration_timestamp_ms;
                }

                let allowChildCreation = true;
                let allowTimeExtension = true;
                const subNft = tx.moveCall({
                    target: isParentSubname
                        ? `${SUBNAME_PROXY_PACKAGE_ID}::subname_proxy::new`
                        : `${SUBNAME_PACKAGE_ID}::subnames::new`,
                    arguments: [
                        tx.object(IOTA_NAMES_OBJECT_ID),
                        tx.object(parentNft),
                        tx.object(IOTA_CLOCK_OBJECT_ID),
                        tx.pure.string(nameName),
                        tx.pure.u64(expirationNextMonthTimestampMs),
                        tx.pure.bool(allowChildCreation),
                        tx.pure.bool(allowTimeExtension),
                    ],
                });
                tx.transferObjects([subNft], tx.pure.address($activeAddress));
            }

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function setTargetAddress() {
        try {
            await getPackageIds();

            let registered = await getRegisteredNamesInner();
            // @ts-ignore
            let registrationIndex = registered.registrations.findIndex(
                (e: any) => e.name.json.labels.join('.') == nameName,
            );
            if (registrationIndex == -1) {
                throw new Error('name not found');
            }
            let nft_id =
                // @ts-ignore
                registered.registrations[registrationIndex].value.json.nft_id;

            let tx = new Transaction();
            tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::controller::set_target_address`,
                arguments: [
                    tx.object(IOTA_NAMES_OBJECT_ID),
                    tx.object(nft_id),
                    tx.pure.option('address', address),
                    tx.object('0x6'),
                ],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function getNft(nameName: string): Promise<string> {
        let registered = await getRegisteredNamesInner();
        // @ts-ignore
        let registrationIndex = registered.registrations.findIndex(
            (e: any) => e.name.json.labels.join('.') == nameName,
        );
        if (registrationIndex == -1) {
            throw new Error('name not found');
        }
        // @ts-ignore
        return registered.registrations[registrationIndex].value.json.nft_id;
    }
    async function setReverseLookup() {
        try {
            await getPackageIds();

            let tx = new Transaction();
            tx.moveCall({
                target: `${IOTA_NAMES_PACKAGE_ID}::controller::set_reverse_lookup`,
                arguments: [tx.object(IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function startAuctionAndPlaceBid() {
        try {
            await getPackageIds();
            await queryAuctionObjectId();
            let nameLabels = nameName.split('.');
            if (nameLabels.length != 2) {
                throw new Error('can only start an auction for names with 2 labels (name.iota)');
            }

            let tx = new Transaction();
            const payment = tx.splitCoins(tx.gas, [bidPrice]);
            tx.moveCall({
                target: `${AUCTION_PACKAGE_ID}::auction::start_auction_and_place_bid`,
                arguments: [
                    tx.object(AUCTION_HOUSE_OBJECT_ID),
                    tx.object(IOTA_NAMES_OBJECT_ID),
                    tx.pure.string(nameName),
                    payment,
                    tx.object('0x6'),
                ],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function placeBid() {
        try {
            await getPackageIds();
            await queryAuctionObjectId();
            let nameLabels = nameName.split('.');
            if (nameLabels.length != 2) {
                throw new Error('can only bid for names with 2 labels (name.iota)');
            }

            let tx = new Transaction();
            const payment = tx.splitCoins(tx.gas, [bidPrice]);
            tx.moveCall({
                target: `${AUCTION_PACKAGE_ID}::auction::place_bid`,
                arguments: [
                    tx.object(AUCTION_HOUSE_OBJECT_ID),
                    tx.pure.string(nameName),
                    payment,
                    tx.object('0x6'),
                ],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function claim() {
        try {
            await getPackageIds();
            await queryAuctionObjectId();
            let nameLabels = nameName.split('.');
            if (nameLabels.length != 2) {
                throw new Error('can only claim names with 2 labels (name.iota)');
            }

            let tx = new Transaction();
            let nft = tx.moveCall({
                target: `${AUCTION_PACKAGE_ID}::auction::claim`,
                arguments: [
                    tx.object(AUCTION_HOUSE_OBJECT_ID),
                    tx.pure.string(nameName),
                    tx.object('0x6'),
                ],
            });
            tx.transferObjects([nft], tx.pure.address($activeAddress));

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function listAuctions() {
        try {
            await getPackageIds();
            await queryAuctionObjectId();
            let client = getClient();
            let object = await client.getObject({
                id: AUCTION_HOUSE_OBJECT_ID,
                options: { showContent: true, showPreviousTransaction: true },
            });
            let res: any = {
                objectId: '',
                previousTransaction: '',
                balance: 0,
                auctionNames: [],
                unclaimedAuctionNames: [],
                auctions: [],
                unclaimedAuctions: [],
            };
            res.objectId = object.data?.objectId;
            res.previousTransaction = object.data?.previousTransaction;
            // @ts-ignore
            res.balance = object.data?.content?.fields?.balance;
            let linked_table_id =
                // @ts-ignore
                object.data.content.fields.auctions.fields.id.id;

            const gqlClient = new IotaGraphQLClient({
                url: getSelectedNetworkConfig().graphql,
            });
            let cursorSection = '';
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

                let object: GraphQLQueryResult = await queryGraphQl(gqlClient, query, {
                    address: IOTA_NAMES_OBJECT_ID,
                });

                if (object.errors) {
                    break;
                }
                let now = new Date().getTime();
                // @ts-ignore
                for (let auctionNode of object.data.owner.dynamicFields.nodes) {
                    // @ts-ignore
                    let auction = auctionNode.value.json;
                    delete auction['prev'];
                    delete auction['next'];
                    delete auction['value']['name'];
                    delete auction['value']['nft']['name'];
                    // @ts-ignore
                    let auctionEndTime = Number(auction.value.end_timestamp_ms);
                    auction.endsIn = timeAgo(auctionEndTime);

                    if (auctionEndTime < now) {
                        res.unclaimedAuctions.push(auction);
                        res.unclaimedAuctionNames.push(
                            auction.value.nft.name_str + ' ' + auction.value.winner,
                        );
                    } else {
                        res.auctions.push(auction);
                        res.auctionNames.push(auction.value.nft.name_str + ' ' + auction.endsIn);
                    }
                }

                // @ts-ignore
                if (object.data.owner.dynamicFields.pageInfo.hasNextPage) {
                    // @ts-ignore
                    cursorSection = `(after: "${object.data.owner.dynamicFields.pageInfo.endCursor}")`;
                } else {
                    break;
                }
            }

            value = res;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    function timeAgo(timestamp: number): string {
        const now = new Date().getTime();
        const diff = timestamp - now;

        const seconds = Math.abs(diff) / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const months = days / 30;

        if (diff > 0) {
            // Future times (e.g., "in 2 days")
            if (months >= 1) return `in ${Math.round(months)} month${months > 1 ? 's' : ''}`;
            if (days >= 1) return `in ${Math.round(days)} day${days > 1 ? 's' : ''}`;
            if (hours >= 1) return `in ${Math.round(hours)} hour${hours > 1 ? 's' : ''}`;
            if (minutes >= 1) return `in ${Math.round(minutes)} minute${minutes > 1 ? 's' : ''}`;
            return `in ${Math.round(seconds)} second${seconds > 1 ? 's' : ''}`;
        } else {
            // Past times (e.g., "1 day ago")
            if (months >= 1) return `${Math.round(months)} month${months > 1 ? 's' : ''} ago`;
            if (days >= 1) return `${Math.round(days)} day${days > 1 ? 's' : ''} ago`;
            if (hours >= 1) return `${Math.round(hours)} hour${hours > 1 ? 's' : ''} ago`;
            if (minutes >= 1) return `${Math.round(minutes)} minute${minutes > 1 ? 's' : ''} ago`;
            return `${Math.round(seconds)} second${seconds > 1 ? 's' : ''} ago`;
        }
    }
</script>

<main>
    <span>
        IotaNames package id (default for testnet):
        <input
            bind:value={IOTA_NAMES_PACKAGE_ID}
            onchange={() => {
                IOTA_NAMES_OBJECT_ID = '';
                PAYMENTS_PACKAGE_ID = '';
                SUBNAME_PACKAGE_ID = '';
                SUBNAME_PROXY_PACKAGE_ID = '';
                AUCTION_PACKAGE_ID = '';
                COUPONS_PACKAGE_ID = '';
            }}
            placeholder="package id 0x..."
            size="67"
        />
        <button
            onclick={() => {
                IOTA_NAMES_PACKAGE_ID = TESTNET_PACKAGE_ID;
                IOTA_NAMES_OBJECT_ID = '';
                PAYMENTS_PACKAGE_ID = '';
                SUBNAME_PACKAGE_ID = '';
                SUBNAME_PROXY_PACKAGE_ID = '';
                AUCTION_PACKAGE_ID = '';
                COUPONS_PACKAGE_ID = '';
            }}>Testnet</button
        >
        <button
            onclick={() => {
                IOTA_NAMES_PACKAGE_ID = DEVNET_PACKAGE_ID;
                IOTA_NAMES_OBJECT_ID = '';
                PAYMENTS_PACKAGE_ID = '';
                SUBNAME_PACKAGE_ID = '';
                SUBNAME_PROXY_PACKAGE_ID = '';
                AUCTION_PACKAGE_ID = '';
                COUPONS_PACKAGE_ID = '';
            }}>Devnet</button
        >
    </span>
    <br />
    <br />
    <span>
        address:
        <input bind:value={address} placeholder="address 0x..." size="67" />
    </span>
    <span>
        name:
        <input bind:value={nameName} placeholder="name.iota" />
    </span>
    <br />
    <br />

    {#if showIotaNamesIds}
        <details>
            <summary>IOTA-Names IDs</summary>
            <div>
                IotaNames Object ID: {IOTA_NAMES_OBJECT_ID}
                <br />
                {#each [['Payments', PAYMENTS_PACKAGE_ID], ['Subname', SUBNAME_PACKAGE_ID], ['Subname Proxy', SUBNAME_PROXY_PACKAGE_ID], ['Auction', AUCTION_PACKAGE_ID], ['Coupons', COUPONS_PACKAGE_ID]] as item}
                    {#if item[1].length != 0}
                        {item[0]} Package ID: {item[1]}
                        <br />
                    {/if}
                {/each}
            </div>
        </details>
    {/if}

    General information:
    <button onclick={listRegisteredNames}> list registered names </button>
    <button onclick={getReverseRegisteredAddresses}> get reverse registered addresses </button>
    <button onclick={toggleIotaNamesIds}> show package ids </button>
    <button onclick={getDynamicFields}> get dynamic fields </button>
    <hr />
    Resolver:
    <button onclick={resolveAddress}> resolve address (by name) </button>
    <button onclick={resolveName}> resolve name (by address) </button>
    <hr />
    Tx actions:
    <button onclick={registerName}> register name </button>
    <button onclick={setTargetAddress}> set target address </button>
    <button onclick={setReverseLookup}> set reverse lookup </button>
    <hr />
    Auction:
    <span>
        bid price:
        <input bind:value={bidPrice} type="number" placeholder="0" style="width: 14rem;" />
    </span>
    <button onclick={startAuctionAndPlaceBid}> start auction and place bid </button>
    <button onclick={placeBid}> place bid </button>
    <button onclick={claim}> claim </button>
    <button onclick={listAuctions}> list auctions </button>

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

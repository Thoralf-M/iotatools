// IOTA Names transaction functions
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_CLOCK_OBJECT_ID } from '../../utils/wasm-sdk';

import { executeTransaction } from '../../utils/transaction-execution';
import { createGraphQLClient, queryGraphQl } from './iota-names-graphql';
import { config } from './iota-names-config';
import { getRegisteredNamesInner, queryDynamicFields } from './iota-names-data';

/**
 * Get package IDs from dynamic fields
 */
export async function getPackageIds() {
    try {
        // @ts-ignore
        let dynamicFields = (await queryDynamicFields()).owner.dynamicFields.nodes;
        // Don't want to fail everything if auction/coupons are not existing
        try {
            config.AUCTION_PACKAGE_ID = parsePackageId('auction::AuctionAuth', dynamicFields);
            config.COUPONS_PACKAGE_ID = parsePackageId('coupon_house::CouponHouse', dynamicFields);
        } catch (e) {
            console.error(e);
        }
        config.PAYMENTS_PACKAGE_ID = parsePackageId('payments::PaymentsConfig', dynamicFields);
        config.SUBNAME_PACKAGE_ID = parsePackageId('subnames::SubnamesAuth', dynamicFields);
        config.SUBNAME_PROXY_PACKAGE_ID = parsePackageId(
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
        console.error(err);
        throw err;
    }
}

/**
 * Register a name
 */
export async function registerName(nameName: string, activeAddress: string) {
    try {
        await getPackageIds();
        let dynamicFields = await queryDynamicFields();
        let priceConfig =
            // @ts-ignore
            dynamicFields.owner.dynamicFields.nodes.filter((d: any) =>
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
                target: `${config.IOTA_NAMES_PACKAGE_ID}::payment::init_registration`,
                arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)],
            });

            const payment = tx.splitCoins(tx.gas, [price]);
            const receipt = tx.moveCall({
                target: `${config.PAYMENTS_PACKAGE_ID}::payments::handle_base_payment`,
                arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), paymentIntent, payment],
                typeArguments: [
                    '0x0000000000000000000000000000000000000000000000000000000000000002::iota::IOTA',
                ],
            });
            const nft = tx.moveCall({
                target: `${config.IOTA_NAMES_PACKAGE_ID}::payment::register`,
                arguments: [
                    receipt,
                    tx.object(config.IOTA_NAMES_OBJECT_ID),
                    tx.object(IOTA_CLOCK_OBJECT_ID),
                ],
            });
            tx.transferObjects([nft], tx.pure.address(activeAddress));
        } else {
            // Subnames
            let isParentSubname = nameLabels.length > 3;
            nameLabels.shift();
            let parentNameName = nameLabels.join('.')!;
            let parentNft = await getNft(parentNameName);

            let expirationNextMonthTimestampMs = Date.now() + 1000 * 60 * 60 * 24 * 30;

            if (isParentSubname) {
                // parent NFT is wrapped in Subname NFT, so the subname NFT must be provided
                const gqlClient = createGraphQLClient();
                let allNodes: any[] = [];
                let cursor: string | null = null;
                let hasNextPage = true;
                while (hasNextPage) {
                    const cursorSection = cursor ? `(after: "${cursor}")` : '';
                    const query = `{
                        address(address: "${activeAddress}") {
                            objects${cursorSection} {
                                pageInfo { hasNextPage endCursor }
                                nodes {
                                    address
                                    contents {
                                        type { repr }
                                        json
                                    }
                                }
                            }
                        }
                    }`;
                    const result = await queryGraphQl(gqlClient, query, {});
                    const objects = result.address.objects;
                    allNodes.push(...objects.nodes);
                    hasNextPage = objects.pageInfo.hasNextPage;
                    cursor = objects.pageInfo.endCursor;
                }
                // Find the output that contains the parentNft id
                const subnameOutputs = allNodes.filter((node: any) =>
                    node.contents?.type?.repr?.includes('SubNameRegistration'),
                );
                let subnameNft = subnameOutputs.find(
                    (node: any) => node.contents?.json?.nft?.name == parentNameName,
                );
                parentNft = subnameNft?.address ?? '';
                // Expiration time can be at most the same as the parent
                expirationNextMonthTimestampMs =
                    subnameNft?.contents?.json?.nft?.expiration_timestamp_ms;
            }

            let allowChildCreation = true;
            let allowTimeExtension = true;
            const subNft = tx.moveCall({
                target: isParentSubname
                    ? `${config.SUBNAME_PROXY_PACKAGE_ID}::subname_proxy::new`
                    : `${config.SUBNAME_PACKAGE_ID}::subnames::new`,
                arguments: [
                    tx.object(config.IOTA_NAMES_OBJECT_ID),
                    tx.object(parentNft),
                    tx.object(IOTA_CLOCK_OBJECT_ID),
                    tx.pure.string(nameName),
                    tx.pure.u64(expirationNextMonthTimestampMs),
                    tx.pure.bool(allowChildCreation),
                    tx.pure.bool(allowTimeExtension),
                ],
            });
            tx.transferObjects([subNft], tx.pure.address(activeAddress));
        }

        return await executeTransaction(tx);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Set target address for a name
 */
export async function setTargetAddress(nameName: string, address: string) {
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
            target: `${config.IOTA_NAMES_PACKAGE_ID}::controller::set_target_address`,
            arguments: [
                tx.object(config.IOTA_NAMES_OBJECT_ID),
                tx.object(nft_id),
                tx.pure.option('address', address),
                tx.object('0x6'),
            ],
        });

        return await executeTransaction(tx);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * Get NFT ID for a name
 */
export async function getNft(nameName: string): Promise<string> {
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

/**
 * Set reverse lookup for current address
 */
export async function setReverseLookup(nameName: string) {
    try {
        await getPackageIds();

        let tx = new Transaction();
        tx.moveCall({
            target: `${config.IOTA_NAMES_PACKAGE_ID}::controller::set_reverse_lookup`,
            arguments: [tx.object(config.IOTA_NAMES_OBJECT_ID), tx.pure.string(nameName)],
        });

        return await executeTransaction(tx);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

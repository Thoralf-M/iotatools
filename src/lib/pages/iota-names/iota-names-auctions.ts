// IOTA Names auction functions
import { Transaction } from '@iota/iota-sdk/transactions';

import { getClient } from '../../utils/client';
import { executeTransaction } from '../../utils/transaction-execution';
import { config } from './iota-names-config';
import { queryAuctionObjectId } from './iota-names-data';
import { createGraphQLClient, queryGraphQl } from './iota-names-graphql';
import { getPackageIds } from './iota-names-transactions';
import { timeAgo } from './iota-names-utils';

/**
 * Start auction and place bid
 */
export async function startAuctionAndPlaceBid(nameName: string, bidPrice: number) {
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
            target: `${config.AUCTION_PACKAGE_ID}::auction::start_auction_and_place_bid`,
            arguments: [
                tx.object(config.AUCTION_HOUSE_OBJECT_ID),
                tx.object(config.IOTA_NAMES_OBJECT_ID),
                tx.pure.string(nameName),
                payment,
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
 * Place bid on auction
 */
export async function placeBid(nameName: string, bidPrice: number) {
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
            target: `${config.AUCTION_PACKAGE_ID}::auction::place_bid`,
            arguments: [
                tx.object(config.AUCTION_HOUSE_OBJECT_ID),
                tx.pure.string(nameName),
                payment,
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
 * Claim won auction
 */
export async function claim(nameName: string, activeAddress: string) {
    try {
        await getPackageIds();
        await queryAuctionObjectId();
        let nameLabels = nameName.split('.');
        if (nameLabels.length != 2) {
            throw new Error('can only claim names with 2 labels (name.iota)');
        }

        let tx = new Transaction();
        let nft = tx.moveCall({
            target: `${config.AUCTION_PACKAGE_ID}::auction::claim`,
            arguments: [
                tx.object(config.AUCTION_HOUSE_OBJECT_ID),
                tx.pure.string(nameName),
                tx.object('0x6'),
            ],
        });
        tx.transferObjects([nft], tx.pure.address(activeAddress));

        return await executeTransaction(tx);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

/**
 * List auctions
 */
export async function listAuctions() {
    try {
        await getPackageIds();
        await queryAuctionObjectId();
        let client = getClient();
        let object = await client.getObject({
            id: config.AUCTION_HOUSE_OBJECT_ID,
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

        const gqlClient = createGraphQLClient();
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

            let object = await queryGraphQl(gqlClient, query, {
                address: config.IOTA_NAMES_OBJECT_ID,
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

        return res;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

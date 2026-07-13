// IOTA Names auction functions
import { Transaction } from '@iota/iota-sdk/transactions';

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
        const gqlClient = createGraphQLClient();
        const objectQuery = `{
            object(address: "${config.AUCTION_HOUSE_OBJECT_ID}") {
                address
                previousTransactionBlock { digest }
                asMoveObject {
                    contents {
                        json
                    }
                }
            }
        }`;
        const objectResult = await queryGraphQl(gqlClient, objectQuery, {});
        let res: any = {
            objectId: '',
            previousTransaction: '',
            balance: 0,
            auctionNames: [],
            unclaimedAuctionNames: [],
            auctions: [],
            unclaimedAuctions: [],
        };
        res.objectId = objectResult.object?.address;
        res.previousTransaction = objectResult.object?.previousTransactionBlock?.digest;
        res.balance = objectResult.object?.asMoveObject?.contents?.json?.balance;
        let linked_table_id = objectResult.object?.asMoveObject?.contents?.json?.auctions?.id?.id;

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

            let object = await queryGraphQl(gqlClient, query, {});

            let now = new Date().getTime();
            // @ts-ignore
            for (let auctionNode of object.owner.dynamicFields.nodes) {
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
            if (object.owner.dynamicFields.pageInfo.hasNextPage) {
                // @ts-ignore
                cursorSection = `(after: "${object.owner.dynamicFields.pageInfo.endCursor}")`;
            } else {
                break;
            }
        }

        // Sort auctions by end time, lowest first
        res.auctions.sort(
            (a: any, b: any) => Number(a.value.end_timestamp_ms) - Number(b.value.end_timestamp_ms),
        );
        res.unclaimedAuctions.sort(
            (a: any, b: any) => Number(a.value.end_timestamp_ms) - Number(b.value.end_timestamp_ms),
        );

        // Rebuild the names arrays in sorted order
        res.auctionNames = res.auctions.map(
            (auction: any) => auction.value.nft.name_str + ' ' + auction.endsIn,
        );
        res.unclaimedAuctionNames = res.unclaimedAuctions.map(
            (auction: any) => auction.value.nft.name_str + ' ' + auction.value.winner,
        );

        return res;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

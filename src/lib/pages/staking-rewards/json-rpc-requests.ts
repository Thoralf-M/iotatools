import { IotaClient } from '@iota/iota-sdk/client';

import { getSelectedNetworkConfig } from '../../utils/client';
import { mapWithConcurrency, withRetry } from './graphql-retry';

/**
 * Stake transaction fetching via JSON-RPC (`iotax_queryTransactionBlocks`).
 *
 * This replaces the previous GraphQL `transactionBlocks` implementation: the
 * public GraphQL indexer prunes transactions older than roughly one month and
 * silently returns empty results for pruned ranges, while JSON-RPC falls back
 * to an archival KV store and still serves the full history (see
 * https://github.com/iotaledger/iota/issues/11855). Once GraphQL gains the
 * same archival fallback for address-filtered transaction queries
 * (https://github.com/iotaledger/iota/issues/11937), this module can be
 * migrated back to GraphQL.
 *
 * Only the `FromOrToAddress` filter has the archival fallback
 * (iotaledger/iota#11807) — `FromAddress`/`ToAddress` alone query the pruned
 * lookup tables directly and silently lose everything older than the retention
 * window. So both roles query `FromOrToAddress` and split sent vs. received
 * client-side by the transaction sender.
 *
 * The results are shaped exactly like the GraphQL `transactionBlocks` nodes the
 * rewards processor consumes (see compute/processor.ts), so everything
 * downstream of the fetch is unchanged.
 */

/** Page size for iotax_queryTransactionBlocks (server max is 50). */
const TX_PAGE_SIZE = 50;
/** Batch size for iota_tryMultiGetPastObjects requests. */
const PAST_OBJECT_BATCH_SIZE = 50;
/** Concurrent past-object batches per address fetch. */
const PAST_OBJECT_CONCURRENCY = 4;

const STAKED_IOTA_MARKER = 'staking_pool::StakedIota';
const TIMELOCKED_STAKED_IOTA_MARKER = 'timelocked_staking::TimelockedStakedIota';

export type FetchStakeTxsOptions = {
    /**
     * If set, stops the (newest-first) pagination once a transaction executed
     * before this epoch is reached, bounding the fetch server-side.
     */
    startEpoch?: number;
    /**
     * Called once per fetched page so the UI can show "still working" progress
     * during long paginated fetches.
     */
    onProgress?: (info: { pages: number; transactions: number }) => void;
    /**
     * Senders whose transactions should be skipped entirely when they touch
     * stake objects — used for known-noisy senders that post huge txs that
     * never carry stake objects relevant to the queried address. Skipping
     * avoids the past-object content lookups for those transactions.
     */
    skipPaginationSenders?: Set<string>;
    /**
     * Called every time a transaction is skipped because its sender was in
     * `skipPaginationSenders`. Lets the UI tally per-sender skip counts and
     * surface them after the fetch.
     */
    onSkipPagination?: (senderAddress: string) => void;
};

// The indexer JSON-RPC endpoint (not the fullnode) is required here: it keeps
// an archival fallback for past object versions, while the fullnode prunes
// them and answers with ObjectNotExists for anything old.
let indexerClient: IotaClient | undefined = undefined;
let indexerClientUrl = '';

function getIndexerClient(): IotaClient {
    const url = getSelectedNetworkConfig().indexer;
    if (!indexerClient || indexerClientUrl !== url) {
        indexerClient = new IotaClient({ url });
        indexerClientUrl = url;
    }
    return indexerClient;
}

function isStakeObjectType(objectType: unknown): boolean {
    return (
        typeof objectType === 'string' &&
        (objectType.includes(STAKED_IOTA_MARKER) ||
            objectType.includes(TIMELOCKED_STAKED_IOTA_MARKER))
    );
}

/** Unwrap JSON-RPC Move field values that may arrive as string, { value } or { fields: { value } }. */
function unwrapFieldValue(value: any): any {
    if (value && typeof value === 'object') {
        return value.value ?? value.fields?.value;
    }
    return value;
}

/**
 * Shape a past object's JSON-RPC fields into the `contents.json` structure the
 * processor reads from GraphQL nodes. Returns null for object types the
 * processor doesn't consume.
 */
function buildContentsJson(type: string, fields: any): any | null {
    if (!fields) return null;
    if (type.includes(STAKED_IOTA_MARKER)) {
        return {
            pool_id: fields.pool_id,
            principal: { value: unwrapFieldValue(fields.principal) },
            stake_activation_epoch: fields.stake_activation_epoch,
        };
    }
    if (type.includes(TIMELOCKED_STAKED_IOTA_MARKER)) {
        // Nested struct may arrive as { fields: {...} } or flattened.
        const stakedIota = fields.staked_iota?.fields ?? fields.staked_iota;
        if (!stakedIota) return null;
        return {
            staked_iota: {
                pool_id: stakedIota.pool_id,
                principal: { value: unwrapFieldValue(stakedIota.principal) },
                stake_activation_epoch: stakedIota.stake_activation_epoch,
            },
        };
    }
    if (type.includes('::coin::Coin')) {
        return { balance: unwrapFieldValue(fields.balance) };
    }
    if (type.includes('::timelock::TimeLock')) {
        return { locked: unwrapFieldValue(fields.locked) };
    }
    return null;
}

/**
 * Map a past object (from iota_tryMultiGetPastObjects) to the GraphQL
 * `inputState`/`outputState` shape the processor reads.
 */
function buildObjectState(pastObject: any): any | undefined {
    if (!pastObject) return undefined;
    const type: string = pastObject.type ?? pastObject.content?.type ?? '';
    const ownerAddress =
        pastObject.owner && typeof pastObject.owner === 'object'
            ? pastObject.owner.AddressOwner
            : undefined;
    return {
        asMoveObject: {
            owner: ownerAddress ? { owner: { address: ownerAddress } } : null,
            contents: {
                type: { repr: type },
                json: buildContentsJson(type, pastObject.content?.fields),
            },
        },
    };
}

type PastObjectRequest = { objectId: string; version: string };

/**
 * Fetch object contents at specific versions in batches. Returns a map keyed
 * by `objectId@version`; requests whose version wasn't found are absent.
 */
async function fetchPastObjects(requests: PastObjectRequest[]): Promise<Map<string, any>> {
    const client = getIndexerClient();
    const unique = new Map<string, PastObjectRequest>();
    for (const request of requests) {
        unique.set(`${request.objectId}@${request.version}`, request);
    }
    const uniqueRequests = Array.from(unique.values());
    const chunks: PastObjectRequest[][] = [];
    for (let i = 0; i < uniqueRequests.length; i += PAST_OBJECT_BATCH_SIZE) {
        chunks.push(uniqueRequests.slice(i, i + PAST_OBJECT_BATCH_SIZE));
    }

    const results = new Map<string, any>();
    await mapWithConcurrency(chunks, PAST_OBJECT_CONCURRENCY, async (chunk) => {
        const response = await withRetry(
            () =>
                client.call<any[]>('iota_tryMultiGetPastObjects', [
                    chunk,
                    { showContent: true, showType: true, showOwner: true },
                ]),
            'Past objects request',
        );
        for (let i = 0; i < chunk.length; i++) {
            const result = response?.[i];
            if (result?.status === 'VersionFound') {
                results.set(`${chunk[i].objectId}@${chunk[i].version}`, result.details);
            } else {
                console.warn(
                    `Past object ${chunk[i].objectId}@${chunk[i].version} not available:`,
                    result?.status,
                );
            }
        }
        return undefined;
    });
    return results;
}

/** Input/output versions of one object change, resolved from the tx effects. */
type ChangeVersions = {
    change: any;
    inputVersion?: string;
    outputVersion?: string;
};

/**
 * Map of objectId -> the version it had before the transaction, from
 * `effects.modifiedAtVersions`.
 */
function buildModifiedAtMap(tx: any): Map<string, string> {
    return new Map<string, string>(
        (tx.effects?.modifiedAtVersions ?? []).map((entry: any) => [
            entry.objectId,
            entry.sequenceNumber,
        ]),
    );
}

/**
 * Resolve which object versions represent the input and output state of an
 * object change. Input versions come from `effects.modifiedAtVersions` (the
 * version each object had before the transaction), output versions from the
 * change itself.
 */
function resolveChangeVersions(modifiedAt: Map<string, string>, change: any): ChangeVersions {
    const resolved: ChangeVersions = { change };
    if (change.type !== 'created') {
        resolved.inputVersion = change.previousVersion ?? modifiedAt.get(change.objectId);
    }
    if (change.type !== 'deleted' && change.type !== 'wrapped') {
        resolved.outputVersion = change.version;
    }
    return resolved;
}

/**
 * Fetch all transactions for an address in the given role, newest first,
 * stopping at `startEpoch` when set.
 *
 * Always queries `FromOrToAddress` — the only address filter with an archival
 * fallback for pruned history — and splits by role client-side: a transaction
 * counts as sent when its sender is the queried address, as received
 * otherwise. Their union is exactly the `FromOrToAddress` result, so nothing
 * is lost by the split (a self-send is covered by the sent role).
 */
async function fetchTransactionPages(
    address: string,
    role: 'FromAddress' | 'ToAddress',
    startEpoch: number | undefined,
    onProgress: FetchStakeTxsOptions['onProgress'],
): Promise<any[]> {
    const client = getIndexerClient();
    const transactions: any[] = [];
    let cursor: string | null | undefined = undefined;
    let hasNextPage = true;
    let pageCount = 0;
    while (hasNextPage) {
        console.log(
            `Fetching transactions for address: ${address}, role: ${role}, cursor: ${cursor ?? ''}`,
        );
        const page: any = await withRetry(
            () =>
                client.queryTransactionBlocks({
                    filter: { FromOrToAddress: { addr: address } },
                    options: { showEffects: true, showObjectChanges: true },
                    order: 'descending',
                    cursor,
                    limit: TX_PAGE_SIZE,
                }),
            'Transaction query',
        );
        let reachedStartEpoch = false;
        for (const tx of page.data ?? []) {
            const epoch = parseInt(tx.effects?.executedEpoch ?? '');
            if (
                startEpoch !== undefined &&
                startEpoch > 0 &&
                Number.isFinite(epoch) &&
                epoch < startEpoch
            ) {
                reachedStartEpoch = true;
                break;
            }
            const sender = tx.objectChanges?.[0]?.sender;
            const matchesRole = role === 'FromAddress' ? sender === address : sender !== address;
            if (matchesRole) transactions.push(tx);
        }
        pageCount++;
        onProgress?.({ pages: pageCount, transactions: transactions.length });
        hasNextPage = !reachedStartEpoch && page.hasNextPage && !!page.nextCursor;
        cursor = page.nextCursor;
    }
    return transactions;
}

async function fetchStakeTransactionsByRole(
    address: string,
    role: 'FromAddress' | 'ToAddress',
    options: FetchStakeTxsOptions = {},
) {
    const { startEpoch, onProgress, skipPaginationSenders, onSkipPagination } = options;

    const rawTransactions = await fetchTransactionPages(address, role, startEpoch, onProgress);
    console.log(`Total transactions fetched: ${rawTransactions.length}`);

    // Only transactions that touch a stake object can be relevant; the object
    // types are already part of the query response, so this pre-filter is free.
    const candidates = rawTransactions.filter((tx) => {
        const isCandidate = (tx.objectChanges ?? []).some((change: any) =>
            isStakeObjectType(change.objectType),
        );
        if (!isCandidate) return false;
        const sender = tx.objectChanges?.[0]?.sender;
        if (sender && skipPaginationSenders?.has(sender)) {
            onSkipPagination?.(sender);
            return false;
        }
        return true;
    });

    // Resolve the input/output versions of every stake object change and fetch
    // their contents, so ownership and principal can be inspected.
    const stakeChangeVersions = new Map<string, ChangeVersions[]>();
    const stakeObjectRequests: PastObjectRequest[] = [];
    for (const tx of candidates) {
        const modifiedAt = buildModifiedAtMap(tx);
        const versions = (tx.objectChanges ?? [])
            .filter((change: any) => isStakeObjectType(change.objectType))
            .map((change: any) => resolveChangeVersions(modifiedAt, change));
        stakeChangeVersions.set(tx.digest, versions);
        for (const entry of versions) {
            if (entry.inputVersion) {
                stakeObjectRequests.push({
                    objectId: entry.change.objectId,
                    version: entry.inputVersion,
                });
            }
            if (entry.outputVersion) {
                stakeObjectRequests.push({
                    objectId: entry.change.objectId,
                    version: entry.outputVersion,
                });
            }
        }
    }
    const stakeObjectContents = await fetchPastObjects(stakeObjectRequests);

    const buildNode = (entry: ChangeVersions): any => ({
        idCreated: entry.change.type === 'created',
        idDeleted: entry.change.type === 'deleted',
        address: entry.change.objectId,
        inputState: entry.inputVersion
            ? buildObjectState(
                  stakeObjectContents.get(`${entry.change.objectId}@${entry.inputVersion}`),
              )
            : undefined,
        outputState: entry.outputVersion
            ? buildObjectState(
                  stakeObjectContents.get(`${entry.change.objectId}@${entry.outputVersion}`),
              )
            : undefined,
    });

    // Keep only transactions where a stake object was owned by the queried
    // address before or after the transaction — the same filter the previous
    // GraphQL implementation applied.
    const relevantTransactions = candidates.filter((tx) => {
        const nodes = (stakeChangeVersions.get(tx.digest) ?? []).map(buildNode);
        return nodes.some((node) => {
            const inputOwner = node.inputState?.asMoveObject?.owner?.owner?.address;
            const outputOwner = node.outputState?.asMoveObject?.owner?.owner?.address;
            return inputOwner === address || outputOwner === address;
        });
    });

    // For the relevant transactions, additionally fetch created coins and
    // timelocks: the processor uses them to attribute unstake rewards and
    // unstaked timelocked principal.
    const payoutChangeVersions = new Map<string, ChangeVersions[]>();
    const payoutRequests: PastObjectRequest[] = [];
    for (const tx of relevantTransactions) {
        const modifiedAt = buildModifiedAtMap(tx);
        const versions = (tx.objectChanges ?? [])
            .filter(
                (change: any) =>
                    change.type === 'created' &&
                    typeof change.objectType === 'string' &&
                    (change.objectType.includes('::coin::Coin') ||
                        change.objectType.includes('::timelock::TimeLock')),
            )
            .map((change: any) => resolveChangeVersions(modifiedAt, change));
        payoutChangeVersions.set(tx.digest, versions);
        for (const entry of versions) {
            if (entry.outputVersion) {
                payoutRequests.push({
                    objectId: entry.change.objectId,
                    version: entry.outputVersion,
                });
            }
        }
    }
    const payoutContents = await fetchPastObjects(payoutRequests);

    // Assemble the GraphQL-shaped transaction nodes the processor consumes.
    const filteredNodes = relevantTransactions.map((tx) => {
        const stakeNodes = (stakeChangeVersions.get(tx.digest) ?? []).map(buildNode);
        const payoutNodes = (payoutChangeVersions.get(tx.digest) ?? []).map((entry) => ({
            idCreated: true,
            idDeleted: false,
            address: entry.change.objectId,
            inputState: undefined,
            outputState: entry.outputVersion
                ? buildObjectState(
                      payoutContents.get(`${entry.change.objectId}@${entry.outputVersion}`),
                  )
                : undefined,
        }));
        return {
            digest: tx.digest,
            sender: { address: tx.objectChanges?.[0]?.sender ?? '' },
            effects: {
                timestamp: tx.timestampMs
                    ? new Date(Number(tx.timestampMs)).toISOString()
                    : undefined,
                epoch: { epochId: parseInt(tx.effects?.executedEpoch ?? '0') },
                objectChanges: { nodes: [...stakeNodes, ...payoutNodes] },
            },
        };
    });
    console.log(`Filtered transactions count: ${filteredNodes.length}`);
    return filteredNodes;
}

export async function fetchStakeTransactions(address: string, options?: FetchStakeTxsOptions) {
    return fetchStakeTransactionsByRole(address, 'FromAddress', options);
}

export async function fetchReceivedStakeTransactions(
    address: string,
    options?: FetchStakeTxsOptions,
) {
    return fetchStakeTransactionsByRole(address, 'ToAddress', options);
}

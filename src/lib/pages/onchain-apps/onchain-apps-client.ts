import { fromBase64 } from '@iota/bcs';
import type { IotaClient, IotaObjectResponse } from '@iota/iota-sdk/client';
import { bcs } from '@iota/iota-sdk/bcs';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_CLOCK_OBJECT_ID } from '@iota/iota-sdk/utils';

/**
 * Network helpers for the On-Chain Apps page. Two responsibilities:
 *
 * 1. Reading the list of published apps, their metadata, and their bytes
 *    from the shared `Registry` + `App` objects.
 * 2. Building programmable transactions for publishing / updating apps.
 *
 * We try hard not to depend on any external indexer: every read goes through
 * the standard JSON-RPC client (`IotaClient`).
 */

/** Publicly visible metadata for an app, as shown in the list view. */
export interface AppMetadata {
    id: string;
    name: string;
    description: string;
    contentType: string;
    appVersion: number;
    packageVersion: number;
    publishedAtMs: number;
    updatedAtMs: number;
    chunkCount: number;
    totalSize: number;
    publisher: string;
}

/**
 * Soft chunk size used by the UI when splitting a payload for upload. The
 * Move contract enforces a hard cap of 256 KiB; we stay well below that so
 * every single tx fits comfortably in the transaction size limit.
 */
export const DEFAULT_CHUNK_SIZE = 96 * 1024; // 96 KiB

/** Split `bytes` into chunks of at most `chunkSize` bytes. */
export function splitChunks(
    bytes: Uint8Array,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
): Uint8Array[] {
    if (chunkSize <= 0) throw new Error('chunkSize must be > 0');
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push(bytes.slice(i, i + chunkSize));
    }
    if (chunks.length === 0) chunks.push(new Uint8Array());
    return chunks;
}

function fieldsOf(obj: IotaObjectResponse): any {
    const content = obj.data?.content as any;
    if (!content || content.dataType !== 'moveObject') {
        throw new Error(`Object ${obj.data?.objectId ?? '?'} is not a move object`);
    }
    return content.fields;
}

function asNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number(value);
    if (typeof value === 'bigint') return Number(value);
    return Number(value);
}

function parseApp(obj: IotaObjectResponse): AppMetadata {
    const fields = fieldsOf(obj);
    return {
        id: obj.data!.objectId,
        name: String(fields.name ?? ''),
        description: String(fields.description ?? ''),
        contentType: String(fields.content_type ?? ''),
        appVersion: asNumber(fields.app_version),
        packageVersion: asNumber(fields.package_version),
        publishedAtMs: asNumber(fields.published_at_ms),
        updatedAtMs: asNumber(fields.updated_at_ms),
        chunkCount: asNumber(fields.chunk_count),
        totalSize: asNumber(fields.total_size),
        publisher: String(fields.publisher ?? ''),
    };
}

/**
 * Read the registry's `count` field and every `IndexKey { index }` dynamic
 * field to recover the list of registered app ids.
 */
export async function listAppIds(client: IotaClient, registryId: string): Promise<string[]> {
    const ids: string[] = [];
    let cursor: string | null | undefined = null;
    do {
        const page = await client.getDynamicFields({
            parentId: registryId,
            cursor: cursor ?? null,
        });
        // Only interested in IndexKey entries; AppIdKey are the reverse index.
        const indexEntries = page.data.filter((f) =>
            /::registry::IndexKey$/.test(String(f.name?.type ?? '')),
        );
        if (indexEntries.length > 0) {
            const wrappers = await client.multiGetObjects({
                ids: indexEntries.map((f) => f.objectId),
                options: { showContent: true },
            });
            // Sort by index so the UI shows them in publish order.
            const parsed = wrappers
                .map((w) => {
                    const f = fieldsOf(w) as any;
                    const idx = asNumber(f?.name?.fields?.index ?? f?.name?.index ?? 0);
                    const appId: string =
                        typeof f?.value === 'string' ? f.value : String(f?.value ?? '');
                    return { idx, appId };
                })
                .filter((x) => !!x.appId);
            parsed.sort((a, b) => a.idx - b.idx);
            for (const p of parsed) ids.push(p.appId);
        }
        cursor = page.hasNextPage ? (page.nextCursor ?? null) : null;
    } while (cursor);
    return ids;
}

/** Fetch the metadata for a batch of app ids. */
export async function fetchAppMetadatas(
    client: IotaClient,
    appIds: string[],
): Promise<AppMetadata[]> {
    if (appIds.length === 0) return [];
    const results: AppMetadata[] = [];
    // multiGetObjects supports up to 50 ids per call.
    for (let i = 0; i < appIds.length; i += 50) {
        const batch = appIds.slice(i, i + 50);
        const responses = await client.multiGetObjects({
            ids: batch,
            options: { showContent: true },
        });
        for (const r of responses) {
            if (!r.data) continue;
            try {
                const meta = parseApp(r);
                // Skip entries that have no name and no content — these are
                // incomplete uploads or garbage registry entries.
                if (!meta.name && meta.totalSize === 0 && meta.chunkCount === 0) {
                    console.warn('skipping empty app entry', r.data.objectId);
                    continue;
                }
                results.push(meta);
            } catch (err) {
                console.warn('failed to parse app', r, err);
            }
        }
    }
    return results;
}

/** Fetch full metadata for a single app. */
export async function fetchAppMetadata(client: IotaClient, appId: string): Promise<AppMetadata> {
    const resp = await client.getObject({ id: appId, options: { showContent: true } });
    if (!resp.data) throw new Error(`App ${appId} not found`);
    return parseApp(resp);
}

/** An `AppCap` owned by the signer, paired with the `App` it controls. */
export interface OwnedAppCap {
    capId: string;
    appId: string;
    app: AppMetadata | null;
}

/**
 * Enumerate every `AppCap` held by `owner` and resolve each of them to the
 * matching `App`. Apps whose `App` object has been deleted / is unreadable
 * are still returned with `app: null` so the UI can surface stale caps.
 */
export async function fetchOwnedAppCaps(
    client: IotaClient,
    packageId: string,
    owner: string,
): Promise<OwnedAppCap[]> {
    if (!packageId || !owner || owner === '0x') return [];
    const caps: { capId: string; appId: string }[] = [];
    let cursor: string | null | undefined = null;
    do {
        const page = await client.getOwnedObjects({
            owner,
            filter: { StructType: `${packageId}::app::AppCap` },
            options: { showContent: true, showType: true },
            cursor: cursor ?? null,
        });
        for (const item of page.data) {
            if (!item.data) continue;
            try {
                const fields = fieldsOf(item);
                const appId = String(fields.app_id ?? '');
                if (!appId) continue;
                caps.push({ capId: item.data.objectId, appId });
            } catch (err) {
                console.warn('failed to parse AppCap', item, err);
            }
        }
        cursor = page.hasNextPage ? (page.nextCursor ?? null) : null;
    } while (cursor);

    if (caps.length === 0) return [];
    const appMetas = await fetchAppMetadatas(
        client,
        caps.map((c) => c.appId),
    );
    const byId = new Map(appMetas.map((m) => [m.id, m]));
    return caps.map((c) => ({
        capId: c.capId,
        appId: c.appId,
        app: byId.get(c.appId) ?? null,
    }));
}

function toUint8(value: unknown): Uint8Array {
    if (value == null) return new Uint8Array();
    if (value instanceof Uint8Array) return value;
    if (Array.isArray(value)) return new Uint8Array(value as number[]);
    if (typeof value === 'string') {
        try {
            return fromBase64(value);
        } catch {
            return new TextEncoder().encode(value);
        }
    }
    throw new Error('unknown bytes encoding');
}

/** Load every chunk of an app and concatenate them into a single blob. */
export async function fetchAppContent(client: IotaClient, app: AppMetadata): Promise<Uint8Array> {
    if (app.chunkCount === 0) return new Uint8Array();
    const buffers: Uint8Array[] = new Array(app.chunkCount);

    // Enumerate all dynamic fields in pages so we have the wrapper object ids
    // (chunks are stored as `Field<ChunkKey, vector<u8>>` objects hanging off
    // the App).
    const entries: { index: number; objectId: string }[] = [];
    let cursor: string | null | undefined = null;
    do {
        const page = await client.getDynamicFields({ parentId: app.id, cursor: cursor ?? null });
        for (const f of page.data) {
            // We only care about ChunkKey entries; skip anything else that
            // might be hanging off the object (Display, etc.).
            if (!/::app::ChunkKey$/.test(String(f.name?.type ?? ''))) continue;
            const idxStr = (f.name as any)?.value?.index ?? (f.name as any)?.value;
            const idx = asNumber(idxStr);
            entries.push({ index: idx, objectId: f.objectId });
        }
        cursor = page.hasNextPage ? (page.nextCursor ?? null) : null;
    } while (cursor);

    if (entries.length !== app.chunkCount) {
        console.warn(
            `app ${app.id} advertises ${app.chunkCount} chunks but registry lists ${entries.length}`,
        );
    }

    // Batch-fetch the wrapper objects in groups of 50.
    for (let i = 0; i < entries.length; i += 50) {
        const batch = entries.slice(i, i + 50);
        const responses = await client.multiGetObjects({
            ids: batch.map((b) => b.objectId),
            options: { showContent: true },
        });
        for (let j = 0; j < responses.length; j++) {
            const resp = responses[j];
            const entry = batch[j];
            if (!resp.data) continue;
            const fields = fieldsOf(resp) as any;
            buffers[entry.index] = toUint8(fields.value);
        }
    }

    const totalLen = buffers.reduce((sum, b) => sum + (b?.length ?? 0), 0);
    const out = new Uint8Array(totalLen);
    let offset = 0;
    for (const b of buffers) {
        if (!b) continue;
        out.set(b, offset);
        offset += b.length;
    }
    return out;
}

// === Transaction building ===

function chunksArgument(tx: Transaction, chunks: Uint8Array[]) {
    // `vector<vector<u8>>` serialized via BCS.
    const bytes = bcs
        .vector(bcs.vector(bcs.u8()))
        .serialize(chunks.map((c) => Array.from(c)))
        .toBytes();
    return tx.pure(bytes);
}

export interface PublishParams {
    packageId: string;
    registryId: string;
    name: string;
    description: string;
    contentType: string;
    firstChunks: Uint8Array[];
}

/**
 * Build a PTB that creates a new `App`, shares it, registers it in the
 * registry, and transfers the `AppCap` to the sender. Only the *first*
 * batch of chunks is attached here; subsequent chunks (if any) are added
 * via `buildAppendChunksTx` in follow-up transactions.
 */
export function buildPublishTx(params: PublishParams): Transaction {
    const tx = new Transaction();
    const appType = `${params.packageId}::app::App`;

    const [app, cap] = tx.moveCall({
        target: `${params.packageId}::app::create_app`,
        arguments: [
            tx.pure.string(params.name),
            tx.pure.string(params.description),
            tx.pure.string(params.contentType),
            chunksArgument(tx, params.firstChunks),
            tx.object(IOTA_CLOCK_OBJECT_ID),
        ],
    });

    // `object::id<App>(&app): ID` so we can hand it to the registry before sharing.
    const appId = tx.moveCall({
        target: `0x2::object::id`,
        typeArguments: [appType],
        arguments: [app],
    });
    tx.moveCall({
        target: `${params.packageId}::registry::register`,
        arguments: [tx.object(params.registryId), appId],
    });

    tx.moveCall({
        target: `0x2::transfer::public_share_object`,
        typeArguments: [appType],
        arguments: [app],
    });
    tx.transferObjects([cap], tx.moveCall({ target: `0x2::tx_context::sender`, arguments: [] }));

    return tx;
}

export interface AppendChunksParams {
    packageId: string;
    appId: string;
    appCapId: string;
    chunks: Uint8Array[];
}

/** Build a PTB that appends more chunks to an existing app. */
export function buildAppendChunksTx(params: AppendChunksParams): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: `${params.packageId}::app::append_chunks`,
        arguments: [
            tx.object(params.appId),
            tx.object(params.appCapId),
            chunksArgument(tx, params.chunks),
            tx.object(IOTA_CLOCK_OBJECT_ID),
        ],
    });
    return tx;
}

export interface UpdateAppParams {
    packageId: string;
    appId: string;
    appCapId: string;
    name: string;
    description: string;
    contentType: string;
    chunks: Uint8Array[];
}

/** Build a PTB that replaces an app's name/description/contents. */
export function buildUpdateAppTx(params: UpdateAppParams): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: `${params.packageId}::app::update_app`,
        arguments: [
            tx.object(params.appId),
            tx.object(params.appCapId),
            tx.pure.string(params.name),
            tx.pure.string(params.description),
            tx.pure.string(params.contentType),
            chunksArgument(tx, params.chunks),
            tx.object(IOTA_CLOCK_OBJECT_ID),
        ],
    });
    return tx;
}

export interface GenericStorageSetParams {
    packageId: string;
    storageId: string;
    appId: string;
    key: string;
    value: Uint8Array;
    shared?: boolean;
}

/**
 * Build a PTB that writes a key/value pair into the shared generic storage
 * (per-user by default; pass `shared: true` for app-level shared state).
 */
export function buildStorageSetTx(params: GenericStorageSetParams): Transaction {
    const tx = new Transaction();
    const target = params.shared
        ? `${params.packageId}::generic_storage::set_shared`
        : `${params.packageId}::generic_storage::set`;
    tx.moveCall({
        target,
        arguments: [
            tx.object(params.storageId),
            tx.pure.address(params.appId),
            tx.pure.string(params.key),
            tx.pure(bcs.vector(bcs.u8()).serialize(Array.from(params.value)).toBytes()),
        ],
    });
    return tx;
}

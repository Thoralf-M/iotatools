import type { IotaClient } from '@iota/iota-sdk/client';

import { getLegacyClient } from '../../utils/client';

// --- Pool types ---

export interface DepositFields {
    depositor: string;
    principal_amount: string;
}

export interface PoolFields {
    creator: string;
    target_validator: string;
    deposits: DepositFields[];
    total_principal: string;
    max_deposits: string;
}

export interface PoolData {
    objectId: string;
    fields: PoolFields;
}

// --- Validator types ---

export interface ValidatorSummary {
    iotaAddress: string;
    name: string;
    description: string;
    imageUrl: string;
    projectUrl: string;
    stakingPoolIotaBalance: string;
    commissionRate: string;
    nextEpochCommissionRate: string;
}

export interface CandidateValidator {
    iotaAddress: string;
    name: string;
    description: string;
    imageUrl: string;
    projectUrl: string;
    stakingPoolIotaBalance: string;
    commissionRate: string;
}

export interface StakedIotaInfo {
    objectId: string;
    principal: string;
    validatorAddress: string;
}

// --- GraphQL pool fetching ---

const POOL_QUERY = `
  query ($type: String!, $after: String) {
    objects(filter: { type: $type }, first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        address
        asMoveObject {
          contents { json }
        }
      }
    }
  }
`;

interface GqlNode {
    address: string;
    asMoveObject?: {
        contents?: {
            json?: Record<string, unknown>;
        };
    };
}

interface GqlResponse {
    data?: {
        objects?: {
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
            nodes: GqlNode[];
        };
    };
    errors?: { message: string }[];
}

function parseFields(json: Record<string, unknown>): PoolFields {
    const deposits = (json['deposits'] as Array<Record<string, unknown>> | undefined) ?? [];
    return {
        creator: String(json['creator'] ?? ''),
        target_validator: String(json['target_validator'] ?? ''),
        total_principal: String(json['total_principal'] ?? '0'),
        max_deposits: String(json['max_deposits'] ?? '1000'),
        deposits: deposits.map((d) => ({
            depositor: String(d['depositor'] ?? ''),
            principal_amount: String(d['principal_amount'] ?? '0'),
        })),
    };
}

export async function fetchPools(packageId: string, graphqlUrl: string): Promise<PoolData[]> {
    const type = `${packageId}::candidate_stake::CandidateStake`;

    if (graphqlUrl) {
        const result: PoolData[] = [];
        let after: string | null = null;
        let hasNext = true;

        while (hasNext) {
            const resp = await fetch(graphqlUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: POOL_QUERY,
                    variables: { type, after },
                }),
            });
            const json = (await resp.json()) as GqlResponse;
            if (json.errors?.length) throw new Error(json.errors[0]!.message);
            const objects = json.data?.objects;
            if (!objects) break;

            for (const node of objects.nodes) {
                const fields = node.asMoveObject?.contents?.json;
                if (!fields) continue;
                result.push({
                    objectId: node.address,
                    fields: parseFields(fields),
                });
            }

            hasNext = objects.pageInfo.hasNextPage;
            after = objects.pageInfo.endCursor;
        }
        return result;
    }

    // Fallback: no GraphQL URL, try via events
    const client = getLegacyClient();
    const events = await client.queryEvents({
        query: { MoveEventModule: { package: packageId, module: 'candidate_stake' } },
        limit: 50,
    });
    const objectIds = new Set<string>();
    for (const ev of events.data) {
        const parsed = ev.parsedJson as Record<string, string> | undefined;
        if (parsed?.['pool_id']) objectIds.add(parsed['pool_id']);
    }
    if (objectIds.size === 0) return [];
    const objects = await client.multiGetObjects({
        ids: [...objectIds],
        options: { showContent: true },
    });
    const result: PoolData[] = [];
    for (const obj of objects) {
        const content = obj.data?.content;
        if (!content || content.dataType !== 'moveObject') continue;
        result.push({
            objectId: obj.data!.objectId,
            fields: content.fields as unknown as PoolFields,
        });
    }
    return result;
}

// --- Validators ---

export async function fetchActiveValidators(): Promise<Map<string, ValidatorSummary>> {
    const client = getLegacyClient();
    const state = await client.getLatestIotaSystemState();
    const map = new Map<string, ValidatorSummary>();
    for (const v of state.activeValidators) {
        map.set(v.iotaAddress, v as unknown as ValidatorSummary);
    }
    return map;
}

// --- Candidate validators ---

async function fetchCandidate(
    client: IotaClient,
    tableId: string,
    name: { type: string; value: unknown },
): Promise<CandidateValidator | null> {
    const wrapperObj = await client.getDynamicFieldObject({
        parentObjectId: tableId,
        name,
        options: { showContent: true },
    });
    const wrapperContent = wrapperObj.data?.content;
    if (!wrapperContent || wrapperContent.dataType !== 'moveObject') return null;
    const wrapperFields = wrapperContent.fields as Record<string, unknown>;

    const value = wrapperFields['value'] as Record<string, unknown> | undefined;
    const inner = (value?.['fields'] as Record<string, unknown>)?.['inner'] ?? value?.['inner'];
    const innerFields = (inner as Record<string, unknown>)?.['fields'] ?? inner;
    const innerId = ((innerFields as Record<string, unknown>)?.['id'] as Record<string, unknown>)?.[
        'id'
    ];
    if (typeof innerId !== 'string') return null;

    const versionedFields = await client.getDynamicFields({ parentId: innerId });
    if (!versionedFields.data.length) return null;
    const versionEntry = versionedFields.data[0]!;

    const validatorObj = await client.getDynamicFieldObject({
        parentObjectId: innerId,
        name: versionEntry.name,
        options: { showContent: true },
    });
    const validatorContent = validatorObj.data?.content;
    if (!validatorContent || validatorContent.dataType !== 'moveObject') return null;
    const vFields = validatorContent.fields as Record<string, unknown>;

    const v1 = (vFields['value'] as Record<string, unknown>)?.['fields'] as
        | Record<string, unknown>
        | undefined;
    if (!v1) return null;

    const meta = ((v1['metadata'] as Record<string, unknown>)?.['fields'] ?? v1['metadata']) as
        | Record<string, unknown>
        | undefined;
    if (!meta) return null;

    return {
        iotaAddress: String(meta['iota_address'] ?? String(name.value)),
        name: String(meta['name'] ?? 'Unknown'),
        description: String(meta['description'] ?? ''),
        imageUrl: String(meta['image_url'] ?? ''),
        projectUrl: String(meta['project_url'] ?? ''),
        stakingPoolIotaBalance: String(
            (
                (v1['staking_pool'] as Record<string, unknown>)?.['fields'] as Record<
                    string,
                    unknown
                >
            )?.['iota_balance'] ?? '0',
        ),
        commissionRate: String(v1['commission_rate'] ?? '0'),
    };
}

export async function fetchCandidateValidators(): Promise<CandidateValidator[]> {
    const client = getLegacyClient();
    const state = await client.getLatestIotaSystemState();
    const tableId = state.validatorCandidatesId;
    const size = Number(state.validatorCandidatesSize);
    if (size === 0) return [];

    const candidates: CandidateValidator[] = [];
    let cursor: string | null | undefined = null;
    let hasNext = true;

    while (hasNext) {
        const page = await client.getDynamicFields({
            parentId: tableId,
            cursor: cursor ?? undefined,
        });

        for (const field of page.data) {
            try {
                const candidate = await fetchCandidate(client, tableId, field.name);
                if (candidate) candidates.push(candidate);
            } catch {
                continue;
            }
        }

        cursor = page.nextCursor;
        hasNext = page.hasNextPage;
    }

    return candidates;
}

// --- Staked objects ---

export async function fetchStakedObjects(address: string): Promise<StakedIotaInfo[]> {
    const client = getLegacyClient();
    const stakes = await client.getStakes({ owner: address });
    const result: StakedIotaInfo[] = [];
    for (const group of stakes) {
        for (const stake of group.stakes) {
            result.push({
                objectId: stake.stakedIotaId,
                principal: stake.principal,
                validatorAddress: group.validatorAddress,
            });
        }
    }
    return result;
}

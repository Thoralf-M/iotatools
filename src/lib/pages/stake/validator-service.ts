import type { GraphQlClient } from '../../utils/wasm-sdk';
import { isValidIotaAddress } from '../../utils/wasm-sdk';

export interface ValidatorInfo {
    address: string;
    name: string;
    status: 'Committee Member' | 'Active Validator' | 'Candidate';
    stake: string;
}

// GraphQL query to fetch active validators and committee members from the current epoch
const VALIDATORS_QUERY = `
    query {
        epoch {
            validatorSet {
                activeValidators {
                    nodes {
                        name
                        description
                        address { address }
                        votingPower
                        gasPrice
                        stakingPoolIotaBalance
                        rewardsPool
                        poolTokenBalance
                        pendingStake
                        nextEpochStake
                        nextEpochGasPrice
                        nextEpochCommission
                        exchangeRatesSize
                    }
                }
                committeeMembers {
                    nodes {
                        address { address }
                    }
                }
            }
        }
    }
`;

// GraphQL query to paginate dynamic fields (used for candidate validators)
const DYNAMIC_FIELDS_QUERY = `
    query ($parentId: IotaAddress!, $cursor: String) {
        object(address: $parentId) {
            dynamicFields(after: $cursor) {
                nodes {
                    name { json }
                    value {
                        ... on MoveObject {
                            contents { json }
                        }
                    }
                }
                pageInfo { hasNextPage endCursor }
            }
        }
    }
`;

/**
 * Run a GraphQL query against the client and parse the JSON result.
 * runQuery() returns only the data field content (no {data:} wrapper).
 */
async function queryGraphQL(
    client: GraphQlClient,
    query: string,
    variables?: Record<string, any>,
): Promise<any> {
    const resultStr = await client.runQuery({
        query,
        variables: variables ? JSON.stringify(variables) : undefined,
    });
    return JSON.parse(resultStr);
}

/**
 * Get committee member addresses from the GraphQL validator set response.
 * Works with both the old systemState shape (for Stake.svelte compatibility)
 * and the new GraphQL committeeMembers array.
 */
export function getCommitteeMemberAddresses(systemState: any): Set<string> {
    const committeeMemberAddresses = new Set<string>();

    if (systemState.committeeMembers && Array.isArray(systemState.committeeMembers)) {
        systemState.committeeMembers.forEach((validator: any) => {
            // Support both old shape (iotaAddress) and new GraphQL shape (address)
            const addr = validator.iotaAddress || validator.address;
            if (addr) {
                committeeMemberAddresses.add(addr);
            }
        });
    }

    return committeeMemberAddresses;
}

/**
 * Determine if a validator is a committee member
 */
export function isValidatorCommitteeMember(
    validatorAddress: string,
    committeeMemberAddresses: Set<string>,
): boolean {
    return committeeMemberAddresses.has(validatorAddress) || committeeMemberAddresses.size === 0;
}

/**
 * Fetch candidate validators by traversing the dynamic fields on the
 * validator_candidates table from the system object (0x5).
 */
async function fetchCandidateValidatorsList(client: GraphQlClient): Promise<ValidatorInfo[]> {
    const candidates: ValidatorInfo[] = [];

    // Get the system object to find the validator_candidates table ID
    const sysResult = await queryGraphQL(
        client,
        `query { object(address: "0x5") { asMoveObject { contents { json } } } }`,
    );
    const sysJson = sysResult?.object?.asMoveObject?.contents?.json;
    const validatorCandidatesId = sysJson?.validator_candidates?.fields?.id?.id;

    if (!validatorCandidatesId) {
        return candidates;
    }

    // Paginate through the dynamic fields of the candidates table
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
        const dfResult = await queryGraphQL(client, DYNAMIC_FIELDS_QUERY, {
            parentId: validatorCandidatesId,
            cursor,
        });
        const dynamicFields = dfResult?.object?.dynamicFields;
        const nodes = dynamicFields?.nodes || [];

        for (const node of nodes) {
            try {
                const validatorData = node?.value?.contents?.json;
                if (!validatorData) continue;

                const validator = validatorData?.value?.fields || validatorData;
                const metadata = validator?.metadata?.fields || validator?.metadata;
                const stakingPool = validator?.staking_pool?.fields || validator?.staking_pool;

                const address = metadata?.iota_address;
                const name = metadata?.name || 'Unknown';
                const stake = stakingPool?.iota_balance || '0';

                if (address) {
                    candidates.push({ address, name, status: 'Candidate', stake });
                }
            } catch (err) {
                console.warn('Failed to load candidate validator:', err);
            }
        }

        hasNextPage = dynamicFields?.pageInfo?.hasNextPage || false;
        cursor = dynamicFields?.pageInfo?.endCursor || null;
    }

    return candidates;
}

/**
 * Load all validators from the system state via GraphQL
 */
export async function loadValidators(client: GraphQlClient): Promise<ValidatorInfo[]> {
    const validators: ValidatorInfo[] = [];

    const result = await queryGraphQL(client, VALIDATORS_QUERY);
    const validatorSet = result?.epoch?.validatorSet;
    const activeNodes = validatorSet?.activeValidators?.nodes || [];
    const committeeMemberNodes = validatorSet?.committeeMembers?.nodes || [];

    // Build the set of committee member addresses
    const committeeMemberAddresses = new Set<string>();
    for (const member of committeeMemberNodes) {
        const addr = member?.address?.address;
        if (addr) {
            committeeMemberAddresses.add(addr);
        }
    }

    // Add active validators
    for (const v of activeNodes) {
        const addr = v.address?.address;
        if (!addr) continue;

        const isCommitteeMember = isValidatorCommitteeMember(addr, committeeMemberAddresses);
        validators.push({
            address: addr,
            name: v.name || 'Unknown',
            status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
            stake: v.stakingPoolIotaBalance || '0',
        });
    }

    // Add candidate validators
    try {
        const candidates = await fetchCandidateValidatorsList(client);
        validators.push(...candidates);
    } catch (err) {
        console.warn('Failed to load candidate validators:', err);
    }

    // Sort validators: Committee members first, then active validators, then candidates
    validators.sort((a, b) => {
        const statusOrder: Record<ValidatorInfo['status'], number> = {
            'Committee Member': 0,
            'Active Validator': 1,
            Candidate: 2,
        };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return validators;
}

/**
 * Fetch a single validator by address via GraphQL
 */
export async function fetchValidatorByAddress(
    client: GraphQlClient,
    address: string,
): Promise<ValidatorInfo | null> {
    if (!address || !isValidIotaAddress(address)) return null;

    try {
        const result = await queryGraphQL(client, VALIDATORS_QUERY);
        const validatorSet = result?.epoch?.validatorSet;
        const activeNodes = validatorSet?.activeValidators?.nodes || [];
        const committeeMemberNodes = validatorSet?.committeeMembers?.nodes || [];

        // Build the set of committee member addresses
        const committeeMemberAddresses = new Set<string>();
        for (const member of committeeMemberNodes) {
            const addr = member?.address?.address;
            if (addr) {
                committeeMemberAddresses.add(addr);
            }
        }

        // Check in active validators first
        for (const v of activeNodes) {
            const addr = v.address?.address;
            if (addr === address) {
                const isCommitteeMember = isValidatorCommitteeMember(
                    addr,
                    committeeMemberAddresses,
                );
                return {
                    address: addr,
                    name: v.name || 'Unknown',
                    status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
                    stake: v.stakingPoolIotaBalance || '0',
                };
            }
        }

        // Check in candidate validators
        const candidates = await fetchCandidateValidatorsList(client);
        for (const candidate of candidates) {
            if (candidate.address === address) {
                return candidate;
            }
        }

        return null;
    } catch (err) {
        console.warn('Failed to fetch validator by address:', err);
        return null;
    }
}

import type { GraphQlClientInterface } from '../../utils/wasm-sdk';
import { formatNumbersWithUnderscores } from '../../utils/iota-nano-conversion';

export interface StakeInfo {
    totalSupply?: string;
    totalStake?: string;
    pendingStake?: string;
    nextEpochStake?: string;
    candidateValidatorsStake?: number;
    pendingValidatorsStake?: number;
}

// GraphQL query to fetch the system state object (0x5) contents + epoch/validator data
const SYSTEM_STATE_QUERY = `
    query GetSystemState {
        object(address: "0x5") {
            asMoveObject {
                contents {
                    json
                    type { repr }
                }
            }
        }
        epoch {
            epochId
            totalGasFees
            referenceGasPrice
            startTimestamp
            endTimestamp
            validatorSet {
                totalStake
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
                        pendingTotalIotaWithdraw
                        nextEpochStake
                        nextEpochGasPrice
                        nextEpochCommission
                        exchangeRatesSize
                        atRisk
                    }
                }
            }
        }
        checkpoint {
            sequenceNumber
        }
    }
`;

export async function fetchLatestSystemState(client: GraphQlClientInterface): Promise<{
    formattedSystemState: any;
    stakeInfo: StakeInfo;
    apiVersion: string;
}> {
    const serviceConfig = await client.serviceConfig();
    const apiVersion = serviceConfig.version || '';

    const resultStr = await client.runQuery({
        query: SYSTEM_STATE_QUERY,
        variables: undefined,
    });
    const result: any = JSON.parse(resultStr);

    const systemObjectJson = result?.object?.asMoveObject?.contents?.json;
    const epochData = result?.epoch;
    const validatorSet = epochData?.validatorSet;

    // Build a system state summary combining the on-chain object and epoch data
    const systemState: any = {
        ...(systemObjectJson || {}),
        epoch: epochData?.epochId,
        referenceGasPrice: epochData?.referenceGasPrice,
        totalStake: validatorSet?.totalStake,
        activeValidators: (validatorSet?.activeValidators?.nodes || []).map((v: any) => ({
            name: v.name,
            description: v.description,
            iotaAddress: v.address?.address,
            votingPower: v.votingPower,
            gasPrice: v.gasPrice,
            stakingPoolIotaBalance: v.stakingPoolIotaBalance,
            rewardsPool: v.rewardsPool,
            poolTokenBalance: v.poolTokenBalance,
            pendingStake: v.pendingStake,
            pendingTotalIotaWithdraw: v.pendingTotalIotaWithdraw,
            nextEpochStake: v.nextEpochStake,
            nextEpochGasPrice: v.nextEpochGasPrice,
            nextEpochCommission: v.nextEpochCommission,
            exchangeRatesSize: v.exchangeRatesSize,
            atRisk: v.atRisk,
        })),
    };

    const formattedSystemState = formatNumbersWithUnderscores(systemState);
    const stakeInfo = systemStateStake(systemState);
    return {
        formattedSystemState,
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        apiVersion,
    };
}

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

async function fetchSystemObjectJson(client: GraphQlClientInterface): Promise<any> {
    const sysResultStr = await client.runQuery({
        query: `query { object(address: "0x5") { asMoveObject { contents { json } } } }`,
        variables: undefined,
    });
    return JSON.parse(sysResultStr)?.object?.asMoveObject?.contents?.json;
}

async function fetchDynamicFieldValidators(
    client: GraphQlClientInterface,
    parentId: string,
    showAllValidatorData: boolean,
): Promise<any[]> {
    let validators: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
        const dfResultStr = await client.runQuery({
            query: DYNAMIC_FIELDS_QUERY,
            variables: JSON.stringify({ parentId, cursor }),
        });
        const dfResult: any = JSON.parse(dfResultStr);
        const dynamicFields = dfResult?.object?.dynamicFields;
        const nodes = dynamicFields?.nodes || [];

        for (const node of nodes) {
            const validatorData = node?.value?.contents?.json;
            if (validatorData) {
                const validator = validatorData?.value?.fields || validatorData;
                if (!showAllValidatorData) {
                    cleanupValidatorFields(validator);
                }
                validators.push(validator);
            }
        }

        hasNextPage = dynamicFields?.pageInfo?.hasNextPage || false;
        cursor = dynamicFields?.pageInfo?.endCursor || null;
    }

    return validators;
}

export async function fetchCandidateValidators(
    client: GraphQlClientInterface,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
}> {
    const { stakeInfo: baseStakeInfo } = await fetchLatestSystemState(client);
    let stakeInfo = { ...baseStakeInfo, candidateValidatorsStake: 0 };

    const sysJson = await fetchSystemObjectJson(client);
    const validatorCandidatesId = sysJson?.validator_candidates?.fields?.id?.id;

    if (!validatorCandidatesId) {
        return {
            formattedValidators: 'No candidate validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        };
    }

    const validatorCandidates = await fetchDynamicFieldValidators(
        client,
        validatorCandidatesId,
        showAllValidatorData,
    );

    for (const v of validatorCandidates) {
        if (v?.staking_pool?.fields?.iota_balance) {
            stakeInfo.candidateValidatorsStake! += parseInt(v.staking_pool.fields.iota_balance);
        }
    }

    return {
        formattedValidators:
            validatorCandidates.length > 0
                ? formatNumbersWithUnderscores(validatorCandidates)
                : 'No candidate validators',
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
    };
}

export async function fetchPendingValidators(
    client: GraphQlClientInterface,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
}> {
    const { stakeInfo: baseStakeInfo } = await fetchLatestSystemState(client);
    let stakeInfo = { ...baseStakeInfo, pendingValidatorsStake: 0 };

    const sysJson = await fetchSystemObjectJson(client);
    const pendingActiveValidatorsId = sysJson?.pending_active_validators?.fields?.id?.id;

    if (!pendingActiveValidatorsId) {
        return {
            formattedValidators: 'No pending validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        };
    }

    const pendingValidators = await fetchDynamicFieldValidators(
        client,
        pendingActiveValidatorsId,
        showAllValidatorData,
    );

    for (const v of pendingValidators) {
        if (v?.staking_pool?.fields?.iota_balance) {
            stakeInfo.pendingValidatorsStake! += parseInt(v.staking_pool.fields.iota_balance);
        }
    }

    return {
        formattedValidators:
            pendingValidators.length > 0
                ? formatNumbersWithUnderscores(pendingValidators)
                : 'No pending validators',
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
    };
}

export async function fetchInactiveValidators(
    client: GraphQlClientInterface,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
}> {
    const sysJson = await fetchSystemObjectJson(client);
    const inactivePoolsSize = sysJson?.inactive_pools?.fields?.size;
    const inactiveValidatorsId = sysJson?.inactive_pools?.fields?.id?.id;

    if (!inactiveValidatorsId || parseInt(inactivePoolsSize || '0') === 0) {
        return { formattedValidators: 'No inactive validators' };
    }

    const inactiveValidatorsList = await fetchDynamicFieldValidators(
        client,
        inactiveValidatorsId,
        showAllValidatorData,
    );

    return {
        formattedValidators:
            inactiveValidatorsList.length > 0
                ? formatNumbersWithUnderscores(inactiveValidatorsList)
                : 'No inactive validators',
    };
}

function systemStateStake(systemState: any): StakeInfo {
    const stakeInfo: StakeInfo = {};
    stakeInfo.totalSupply = systemState.iotaTotalSupply || systemState.iota_total_supply;
    stakeInfo.totalStake = systemState.totalStake || systemState.total_stake;
    stakeInfo.pendingStake = '0';
    stakeInfo.nextEpochStake = '0';

    const validators = systemState.activeValidators || [];
    for (const validator of validators) {
        stakeInfo.pendingStake = (
            BigInt(stakeInfo.pendingStake!) + BigInt(validator.pendingStake || '0')
        ).toString();
        stakeInfo.nextEpochStake = (
            BigInt(stakeInfo.nextEpochStake!) + BigInt(validator.nextEpochStake || '0')
        ).toString();
    }

    return stakeInfo;
}

function cleanupValidatorFields(validator: any) {
    if (!validator) return;
    delete validator.extra_fields;
    if (validator.metadata) {
        delete validator.metadata.type;
        if (validator.metadata.fields) {
            delete validator.metadata.fields.authority_pubkey_bytes;
            delete validator.metadata.fields.next_epoch_authority_pubkey_bytes;
            delete validator.metadata.fields.next_epoch_net_address;
            delete validator.metadata.fields.next_epoch_network_pubkey_bytes;
            delete validator.metadata.fields.next_epoch_p2p_address;
            delete validator.metadata.fields.next_epoch_primary_address;
            delete validator.metadata.fields.next_epoch_proof_of_possession;
            delete validator.metadata.fields.next_epoch_protocol_pubkey_bytes;
            delete validator.metadata.fields.net_address;
            delete validator.metadata.fields.p2p_address;
            delete validator.metadata.fields.primary_address;
            delete validator.metadata.fields.image_url;
            delete validator.metadata.fields.extra_fields;
            delete validator.metadata.fields.network_pubkey_bytes;
            delete validator.metadata.fields.proof_of_possession;
            delete validator.metadata.fields.protocol_pubkey_bytes;
        }
    }
    if (validator.staking_pool) {
        delete validator.staking_pool.type;
        if (validator.staking_pool.fields) {
            delete validator.staking_pool.fields.exchange_rates;
            delete validator.staking_pool.fields.extra_fields;
            if (validator.staking_pool.fields.id) {
                validator.staking_pool.fields.id = validator.staking_pool.fields.id.id;
            }
        }
    }
}

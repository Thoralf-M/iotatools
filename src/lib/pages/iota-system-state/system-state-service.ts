import type { IotaValidatorSummary } from '@iota/iota-sdk/client';
import type { GraphQlClientInterface } from '../../utils/wasm-sdk';
import { getLegacyClient } from '../../utils/client';
import { formatNumbersWithUnderscores } from '../../utils/iota-nano-conversion';

export interface StakeInfo {
    totalSupply?: string;
    totalStake?: string;
    pendingStake?: string;
    nextEpochStake?: string;
    candidateValidatorsStake?: number;
    pendingValidatorsStake?: number;
}

export interface ValidatorTableRow {
    name: string;
    address: string;
    commissionRate: string;
    stakingPoolIotaBalance: string;
    nextEpochStake: string;
    stakingPoolId: string;
    stakingPoolActivationEpoch: string;
    stakingPoolDeactivationEpoch: string | null;
    rewardsPool: string;
    effectiveCommission?: string;
}

function extractValidatorRow(validator: any): ValidatorTableRow {
    const meta = validator.metadata.fields;
    const pool = validator.staking_pool.fields;
    return {
        name: meta.name,
        address: meta.iota_address,
        commissionRate: validator.commission_rate,
        stakingPoolIotaBalance: pool.iota_balance,
        nextEpochStake: validator.next_epoch_stake,
        stakingPoolId: typeof pool.id === 'object' ? pool.id.id : pool.id,
        stakingPoolActivationEpoch: pool.activation_epoch,
        stakingPoolDeactivationEpoch: pool.deactivation_epoch,
        rewardsPool: pool.rewards_pool,
    };
}

function extractActiveValidatorRow(v: IotaValidatorSummary): ValidatorTableRow {
    return {
        name: v.name,
        address: v.iotaAddress,
        commissionRate: v.commissionRate,
        stakingPoolIotaBalance: v.stakingPoolIotaBalance,
        nextEpochStake: v.nextEpochStake,
        stakingPoolId: v.stakingPoolId,
        stakingPoolActivationEpoch: v.stakingPoolActivationEpoch ?? '',
        stakingPoolDeactivationEpoch: v.stakingPoolDeactivationEpoch ?? null,
        rewardsPool: v.rewardsPool,
    };
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
                        nextEpochCommissionRate
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
    baseFields: Record<string, any>;
    committeeRows: ValidatorTableRow[];
    activeValidatorRows: ValidatorTableRow[];
}> {
    const apiVersion = '';

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
            nextEpochCommissionRate: v.nextEpochCommissionRate,
            exchangeRatesSize: v.exchangeRatesSize,
            atRisk: v.atRisk,
        })),
    };

    const formattedSystemState = formatNumbersWithUnderscores(systemState);
    const stakeInfo = systemStateStake(systemState);

    // Extract base scalar fields (everything except activeValidators and committeeMembers)
    const skipKeys = new Set(['activeValidators', 'committeeMembers']);
    const baseFields: Record<string, any> = {};
    for (const [key, val] of Object.entries(systemState)) {
        if (!skipKeys.has(key)) {
            baseFields[key] = val;
        }
    }

    // Build committee address set
    const committeeAddresses = new Set(systemState.committeeMembers.map((m: any) => m.iotaAddress));

    // Validator lookup by address
    const validatorByAddress = new Map<string, IotaValidatorSummary>();
    for (const v of systemState.activeValidators) {
        validatorByAddress.set(v.iotaAddress, v);
    }

    // Committee rows (cross-referenced with active validators for full info)
    const committeeRows: ValidatorTableRow[] = [];
    for (const member of systemState.committeeMembers) {
        const v = validatorByAddress.get(member.iotaAddress);
        if (v) {
            const row = extractActiveValidatorRow(v);
            // IIP-8: effective commission = max(commission%, VP%)
            // votingPower is in basis points (total sums to 10000)
            const commissionPct = parseInt(v.commissionRate) / 100;
            const votingPowerPct = parseInt(v.votingPower) / 100;
            row.effectiveCommission = Math.max(commissionPct, votingPowerPct).toFixed(2);
            committeeRows.push(row);
        }
    }

    // Active validators excluding committee members
    const activeValidatorRows: ValidatorTableRow[] = [];
    for (const v of systemState.activeValidators) {
        if (!committeeAddresses.has(v.iotaAddress)) {
            activeValidatorRows.push(extractActiveValidatorRow(v));
        }
    }

    return {
        formattedSystemState,
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        apiVersion,
        baseFields: formatNumbersWithUnderscores(baseFields) as Record<string, any>,
        committeeRows,
        activeValidatorRows,
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

async function fetchSystemObjectJson(): Promise<any> {
    const systemState = await getLegacyClient().getLatestIotaSystemState();
    return systemState;
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
    validatorRows: ValidatorTableRow[];
}> {
    const { stakeInfo: baseStakeInfo } = await fetchLatestSystemState(client);
    let stakeInfo = { ...baseStakeInfo, candidateValidatorsStake: 0 };

    const sysJson = await fetchSystemObjectJson();
    const validatorCandidatesId = sysJson?.validatorCandidatesId;

    if (!validatorCandidatesId) {
        return {
            formattedValidators: 'No candidate validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
            validatorRows: [],
        };
    }

    const validatorCandidates = await fetchDynamicFieldValidators(
        client,
        validatorCandidatesId,
        showAllValidatorData,
    );

    for (const v of validatorCandidates) {
        const iotaBalance = v?.staking_pool?.fields?.iota_balance || v?.staking_pool?.iota_balance;
        if (iotaBalance) {
            stakeInfo.candidateValidatorsStake! += parseInt(iotaBalance);
        }
    }

    const validatorRows: ValidatorTableRow[] = [];
    return {
        formattedValidators:
            validatorCandidates.length > 0
                ? formatNumbersWithUnderscores(validatorCandidates)
                : 'No candidate validators',
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        validatorRows,
    };
}

export async function fetchPendingValidators(
    client: GraphQlClientInterface,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
    validatorRows: ValidatorTableRow[];
}> {
    const { stakeInfo: baseStakeInfo } = await fetchLatestSystemState(client);
    let stakeInfo = { ...baseStakeInfo, pendingValidatorsStake: 0 };

    const sysJson = await fetchSystemObjectJson();
    const pendingActiveValidatorsId = sysJson?.pending_active_validators?.fields?.id?.id;

    if (!pendingActiveValidatorsId) {
        return {
            formattedValidators: 'No pending validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
            validatorRows: [],
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

    const validatorRows: ValidatorTableRow[] = [];
    return {
        formattedValidators:
            pendingValidators.length > 0
                ? formatNumbersWithUnderscores(pendingValidators)
                : 'No pending validators',
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        validatorRows,
    };
}

export async function fetchInactiveValidators(
    client: GraphQlClientInterface,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    validatorRows: ValidatorTableRow[];
}> {
    const sysJson = await fetchSystemObjectJson();
    const inactivePoolsSize = sysJson?.inactive_pools?.fields?.size;
    const inactiveValidatorsId = sysJson?.inactive_pools?.fields?.id?.id;

    if (!inactiveValidatorsId || parseInt(inactivePoolsSize || '0') === 0) {
        return { formattedValidators: 'No inactive validators', validatorRows: [] };
    }

    const inactiveValidatorsList = await fetchDynamicFieldValidators(
        client,
        inactiveValidatorsId,
        showAllValidatorData,
    );

    const validatorRows: ValidatorTableRow[] = inactiveValidatorsList
        .map((v) => extractValidatorRow(v))
        .sort((a, b) => {
            const aEpoch = parseInt(a.stakingPoolDeactivationEpoch ?? '0');
            const bEpoch = parseInt(b.stakingPoolDeactivationEpoch ?? '0');
            return bEpoch - aEpoch;
        });

    return {
        formattedValidators:
            inactiveValidatorsList.length > 0
                ? formatNumbersWithUnderscores(inactiveValidatorsList)
                : 'No inactive validators',
        validatorRows,
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

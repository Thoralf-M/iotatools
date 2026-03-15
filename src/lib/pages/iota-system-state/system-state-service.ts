import type {
    IotaClient,
    IotaValidatorSummary,
    LatestIotaSystemStateSummary,
} from '@iota/iota-sdk/client';

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

export async function fetchLatestSystemState(client: IotaClient): Promise<{
    formattedSystemState: any;
    stakeInfo: StakeInfo;
    apiVersion: string;
    baseFields: Record<string, any>;
    committeeRows: ValidatorTableRow[];
    activeValidatorRows: ValidatorTableRow[];
}> {
    const apiVersion = (await client.getRpcApiVersion()) || '';
    const systemState = await client.getLatestIotaSystemState();
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
    const committeeAddresses = new Set(systemState.committeeMembers.map((m) => m.iotaAddress));

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

export async function fetchCandidateValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
    validatorRows: ValidatorTableRow[];
}> {
    const systemState = await client.getLatestIotaSystemState();
    let stakeInfo = systemStateStake(systemState);
    stakeInfo.candidateValidatorsStake = 0;

    const validatorCandidatesId = systemState.validatorCandidatesId;
    if (!validatorCandidatesId || validatorCandidatesId === '') {
        return {
            formattedValidators: 'No candidate validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
            validatorRows: [],
        };
    }

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let validatorCandidates: any[] = [];
    let validatorRows: ValidatorTableRow[] = [];

    while (hasNextPage) {
        const candidateValidatorsPage = await client.getDynamicFields({
            parentId: validatorCandidatesId,
            cursor: nextPageCursor,
        });

        for (const candidateValidator of candidateValidatorsPage.data) {
            const validatorWrapper = await client.getDynamicFieldObjectV2({
                parentObjectId: validatorCandidatesId,
                name: candidateValidator.name,
                options: { showContent: true },
            });

            const innerId = (validatorWrapper.data as any).content.fields.value.fields.inner.fields
                .id.id;
            const validatorV1 = await client.getDynamicFields({
                parentId: innerId,
            });

            const validatorObject = await client.getObject({
                id: validatorV1.data[0].objectId,
                options: { showContent: true },
            });

            const validator = (validatorObject.data as any)?.content.fields.value.fields;

            stakeInfo.candidateValidatorsStake! += parseInt(
                validator.staking_pool.fields.iota_balance,
            );

            validatorRows.push(extractValidatorRow(validator));

            if (!showAllValidatorData) {
                cleanupValidatorFields(validator);
            }
            validatorCandidates.push(validator);
        }

        hasNextPage = candidateValidatorsPage.hasNextPage;
        if (hasNextPage) {
            nextPageCursor = candidateValidatorsPage.nextCursor;
        }
    }

    const formattedValidators =
        validatorCandidates.length > 0
            ? formatNumbersWithUnderscores(validatorCandidates)
            : 'No candidate validators';

    return {
        formattedValidators,
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        validatorRows,
    };
}

export async function fetchPendingValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
    validatorRows: ValidatorTableRow[];
}> {
    const systemState = await client.getLatestIotaSystemState();
    let stakeInfo = systemStateStake(systemState);
    stakeInfo.pendingValidatorsStake = 0;

    const pendingActiveValidatorsId = systemState.pendingActiveValidatorsId;

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let pendingValidators: any[] = [];
    let validatorRows: ValidatorTableRow[] = [];

    while (hasNextPage) {
        const pendingValidatorsPage = await client.getDynamicFields({
            parentId: pendingActiveValidatorsId,
            cursor: nextPageCursor,
        });

        for (const pendingValidator of pendingValidatorsPage.data) {
            const validatorObject = await client.getObject({
                id: pendingValidator.objectId,
                options: { showContent: true },
            });

            const validator = (validatorObject.data as any)?.content.fields.value.fields;

            stakeInfo.pendingValidatorsStake! += parseInt(
                validator.staking_pool.fields.iota_balance,
            );

            validatorRows.push(extractValidatorRow(validator));

            if (!showAllValidatorData) {
                cleanupValidatorFields(validator);
            }
            pendingValidators.push(validator);
        }

        hasNextPage = pendingValidatorsPage.hasNextPage;
        if (hasNextPage) {
            nextPageCursor = pendingValidatorsPage.nextCursor;
        }
    }

    const formattedValidators =
        pendingValidators.length > 0
            ? formatNumbersWithUnderscores(pendingValidators)
            : 'No pending validators';

    return {
        formattedValidators,
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        validatorRows,
    };
}

export async function fetchInactiveValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    validatorRows: ValidatorTableRow[];
}> {
    const systemState = await client.getLatestIotaSystemState();
    const size = systemState.inactivePoolsSize;
    if (parseInt(size) === 0) {
        return { formattedValidators: 'No inactive validators', validatorRows: [] };
    }

    const inactiveValidatorsId = systemState.inactivePoolsId;

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let inactiveValidatorsList: any[] = [];
    let validatorRows: ValidatorTableRow[] = [];

    while (hasNextPage) {
        const inactiveValidatorsPage = await client.getDynamicFields({
            parentId: inactiveValidatorsId,
            cursor: nextPageCursor,
        });

        for (const inactiveValidator of inactiveValidatorsPage.data) {
            const inactiveValidatorsPage = await client.getDynamicFieldObjectV2({
                parentObjectId: inactiveValidatorsId,
                name: { type: '0x2::object::ID', value: inactiveValidator.name.value },
                options: { showContent: true },
            });

            const validatorV1 = await client.getDynamicFields({
                parentId: (inactiveValidatorsPage.data as any).content.fields.value.fields.inner
                    .fields.id.id,
            });

            const validatorObject = await client.getObject({
                id: validatorV1.data[0].objectId,
                options: { showContent: true },
            });

            const validator = (validatorObject.data as any)?.content.fields.value.fields;

            validatorRows.push(extractValidatorRow(validator));

            if (!showAllValidatorData) {
                cleanupValidatorFields(validator);
            }
            inactiveValidatorsList.push(validator);
        }

        hasNextPage = inactiveValidatorsPage.hasNextPage;
        if (hasNextPage) {
            nextPageCursor = inactiveValidatorsPage.nextCursor;
        }
    }

    const formattedValidators =
        inactiveValidatorsList.length > 0
            ? formatNumbersWithUnderscores(inactiveValidatorsList)
            : 'No inactive validators';

    validatorRows.sort((a, b) => {
        const aEpoch = parseInt(a.stakingPoolDeactivationEpoch ?? '0');
        const bEpoch = parseInt(b.stakingPoolDeactivationEpoch ?? '0');
        return bEpoch - aEpoch;
    });

    return { formattedValidators, validatorRows };
}

function systemStateStake(systemState: LatestIotaSystemStateSummary): StakeInfo {
    const stakeInfo: StakeInfo = {};
    stakeInfo.totalSupply = systemState.iotaTotalSupply;
    stakeInfo.totalStake = systemState.totalStake;
    stakeInfo.pendingStake = '0';
    stakeInfo.nextEpochStake = '0';

    for (const validator of systemState.activeValidators) {
        stakeInfo.pendingStake = (
            BigInt(stakeInfo.pendingStake!) + BigInt(validator.pendingStake)
        ).toString();
        stakeInfo.nextEpochStake = (
            BigInt(stakeInfo.nextEpochStake!) + BigInt(validator.nextEpochStake)
        ).toString();
    }

    return stakeInfo;
}

// Remove fields from the validator to have a cleaner output
function cleanupValidatorFields(validator: any) {
    delete validator.extra_fields;
    delete validator.metadata.type;
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
    delete validator.staking_pool.type;
    delete validator.staking_pool.fields.exchange_rates;
    delete validator.staking_pool.fields.extra_fields;
    validator.staking_pool.fields.id = validator.staking_pool.fields.id.id;
}

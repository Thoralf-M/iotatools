import type { IotaClient, LatestIotaSystemStateSummary } from '@iota/iota-sdk/client';

import { formatNumbersWithUnderscores } from '../../utils/iota-nano-conversion';

export interface StakeInfo {
    totalSupply?: string;
    totalStake?: string;
    pendingStake?: string;
    nextEpochStake?: string;
    candidateValidatorsStake?: number;
    pendingValidatorsStake?: number;
}

export async function fetchLatestSystemState(client: IotaClient): Promise<{
    formattedSystemState: any;
    stakeInfo: StakeInfo;
    apiVersion: string;
}> {
    const apiVersion = (await client.getRpcApiVersion()) || '';
    const systemState = await client.getLatestIotaSystemState();
    const formattedSystemState = formatNumbersWithUnderscores(systemState);
    const stakeInfo = systemStateStake(systemState);
    return {
        formattedSystemState,
        stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        apiVersion,
    };
}

export async function fetchCandidateValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
}> {
    const systemState = await client.getLatestIotaSystemState();
    let stakeInfo = systemStateStake(systemState);
    stakeInfo.candidateValidatorsStake = 0;

    const validatorCandidatesId = systemState.validatorCandidatesId;
    if (!validatorCandidatesId || validatorCandidatesId === '') {
        return {
            formattedValidators: 'No candidate validators',
            stakeInfo: formatNumbersWithUnderscores(stakeInfo) as StakeInfo,
        };
    }

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let validatorCandidates: any[] = [];

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
    };
}

export async function fetchPendingValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
    stakeInfo: StakeInfo;
}> {
    const systemState = await client.getLatestIotaSystemState();
    let stakeInfo = systemStateStake(systemState);
    stakeInfo.pendingValidatorsStake = 0;

    const pendingActiveValidatorsId = systemState.pendingActiveValidatorsId;

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let pendingValidators: any[] = [];

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
    };
}

export async function fetchInactiveValidators(
    client: IotaClient,
    showAllValidatorData: boolean,
): Promise<{
    formattedValidators: any;
}> {
    const systemState = await client.getLatestIotaSystemState();
    const size = systemState.inactivePoolsSize;
    if (parseInt(size) === 0) {
        return { formattedValidators: 'No inactive validators' };
    }

    const inactiveValidatorsId = systemState.inactivePoolsId;

    let hasNextPage = true;
    let nextPageCursor: string | null = null;
    let inactiveValidatorsList: any[] = [];

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

    return { formattedValidators };
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

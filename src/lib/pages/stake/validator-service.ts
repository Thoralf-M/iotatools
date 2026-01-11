import type { IotaClient } from '@iota/iota-sdk/client';
import { isValidIotaAddress } from '@iota/iota-sdk/utils';

export interface ValidatorInfo {
    address: string;
    name: string;
    status: 'Committee Member' | 'Active Validator' | 'Candidate';
    stake: string;
}

/**
 * Get committee member addresses from system state
 */
export function getCommitteeMemberAddresses(systemState: any): Set<string> {
    const committeeMemberAddresses = new Set<string>();

    if (systemState.committeeMembers && Array.isArray(systemState.committeeMembers)) {
        systemState.committeeMembers.forEach((validator: any) => {
            committeeMemberAddresses.add(validator.iotaAddress);
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
 * Load all validators from the system state
 */
export async function loadValidators(client: IotaClient): Promise<ValidatorInfo[]> {
    const validators: ValidatorInfo[] = [];
    const systemState = await client.getLatestIotaSystemState();

    const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);

    // Add active validators
    for (const validator of systemState.activeValidators) {
        const isCommitteeMember = isValidatorCommitteeMember(
            validator.iotaAddress,
            committeeMemberAddresses,
        );
        validators.push({
            address: validator.iotaAddress,
            name: validator.name || 'Unknown',
            status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
            stake: validator.stakingPoolIotaBalance,
        });
    }

    // Add candidate validators
    const validatorCandidatesId = systemState.validatorCandidatesId;
    let hasNextPage = true;
    let nextPageCursor;

    while (hasNextPage) {
        const candidateValidatorsPage = await client.getDynamicFields({
            parentId: validatorCandidatesId,
            cursor: nextPageCursor,
        });

        for (const candidateValidator of candidateValidatorsPage.data) {
            try {
                const validatorWrapper = await client.getDynamicFieldObject({
                    objectId: validatorCandidatesId,
                    name: candidateValidator.name,
                } as any);

                const validatorV1 = await client.getDynamicFields({
                    parentId:
                        // @ts-ignore
                        validatorWrapper.data?.content.fields.value.fields.inner.fields.id.id,
                });

                const validatorObject = await client.getObject({
                    id: validatorV1.data[0].objectId,
                    options: { showContent: true },
                });

                const validator =
                    // @ts-ignore
                    validatorObject.data?.content.fields.value.fields;

                validators.push({
                    address: validator.metadata.fields.iota_address,
                    name: validator.metadata.fields.name || 'Unknown',
                    status: 'Candidate',
                    stake: validator.staking_pool.fields.iota_balance,
                });
            } catch (err) {
                console.warn('Failed to load candidate validator:', err);
            }
        }

        hasNextPage = candidateValidatorsPage.hasNextPage;
        if (hasNextPage) {
            nextPageCursor = candidateValidatorsPage.nextCursor;
        }
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
 * Fetch a single validator by address
 */
export async function fetchValidatorByAddress(
    client: IotaClient,
    address: string,
): Promise<ValidatorInfo | null> {
    if (!address || !isValidIotaAddress(address)) return null;

    try {
        const systemState = await client.getLatestIotaSystemState();
        const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);

        // Check in active validators first
        for (const validator of systemState.activeValidators) {
            if (validator.iotaAddress === address) {
                const isCommitteeMember = isValidatorCommitteeMember(
                    validator.iotaAddress,
                    committeeMemberAddresses,
                );

                return {
                    address: validator.iotaAddress,
                    name: validator.name || 'Unknown',
                    status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
                    stake: validator.stakingPoolIotaBalance,
                };
            }
        }

        // Check in candidate validators
        const validatorCandidatesId = systemState.validatorCandidatesId;
        let hasNextPage = true;
        let nextPageCursor;

        while (hasNextPage) {
            const candidateValidatorsPage = await client.getDynamicFields({
                parentId: validatorCandidatesId,
                cursor: nextPageCursor,
            });

            for (const candidateValidator of candidateValidatorsPage.data) {
                try {
                    const validatorWrapper = await client.getDynamicFieldObject({
                        objectId: validatorCandidatesId,
                        name: candidateValidator.name,
                    } as any);

                    const validatorV1 = await client.getDynamicFields({
                        parentId:
                            // @ts-ignore
                            validatorWrapper.data?.content.fields.value.fields.inner.fields.id.id,
                    });

                    const validatorObject = await client.getObject({
                        id: validatorV1.data[0].objectId,
                        options: { showContent: true },
                    });

                    const validator =
                        // @ts-ignore
                        validatorObject.data?.content.fields.value.fields;

                    if (validator.metadata.fields.iota_address === address) {
                        return {
                            address: validator.metadata.fields.iota_address,
                            name: validator.metadata.fields.name || 'Unknown',
                            status: 'Candidate',
                            stake: validator.staking_pool.fields.iota_balance,
                        };
                    }
                } catch (err) {
                    console.warn('Failed to check candidate validator:', err);
                }
            }

            hasNextPage = candidateValidatorsPage.hasNextPage;
            if (hasNextPage) {
                nextPageCursor = candidateValidatorsPage.nextCursor;
            }
        }

        return null;
    } catch (err) {
        console.warn('Failed to fetch validator by address:', err);
        return null;
    }
}

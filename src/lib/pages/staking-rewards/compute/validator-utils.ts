import { getSelectedNetworkConfig } from '../../../utils/client';
import { queryDynamicField, queryDynamicFields } from '../../../utils/dynamic-fields';
import type { ValidatorInfo } from './types';

export function getCurrentActiveValidatorsExchangeRateIds(
    systemState: any,
): Record<string, string> {
    // console.log("systemState", systemState);
    const validatorMap: Record<string, string> = {};
    const activeValidators = systemState?.json?.validators?.active_validators || [];
    for (const validator of activeValidators) {
        const poolId = validator?.staking_pool?.id;
        const exchangeRateId = validator?.staking_pool?.exchange_rates?.id;
        if (poolId && exchangeRateId) {
            validatorMap[poolId] = exchangeRateId;
        }
    }
    return validatorMap;
}

export interface InactiveValidatorInfo {
    exchangeRateId: string;
    deactivationEpoch: number;
}

export async function getInactiveValidatorsExchangeRateIds(
    systemState: any,
): Promise<Record<string, string>> {
    const validatorMap: Record<string, string> = {};
    if (systemState?.json?.validators?.inactive_validators.size == 0) {
        return validatorMap;
    }
    const inactiveValidatorsId = systemState?.json?.validators?.inactive_validators.id;
    let dynamicFields = await queryDynamicFields({
        objectId: inactiveValidatorsId,
        pageSize: 50,
        graphqlUrl: getSelectedNetworkConfig().graphql,
    });
    for (const node of dynamicFields.nodes) {
        const result = await queryDynamicField({
            objectId: node.value.json.inner.id,
            fieldType: 'u64',
            bcsValue: 'AQAAAAAAAAA=',
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });
        if (result.error) {
            throw new Error('Failed to fetch inactive validator: ' + result.error);
        }
        let poolId = result.field.value.json.staking_pool.id;
        let exchangeRateId = result.field.value.json.staking_pool.exchange_rates.id;
        validatorMap[poolId] = exchangeRateId;
    }

    return validatorMap;
}

/**
 * Fetches inactive validators with their exchange rate IDs and deactivation epochs.
 * This information can be used to avoid fetching exchange rate data for epochs after deactivation.
 * @param systemState The system state object from GraphQL
 * @returns Map of poolId -> { exchangeRateId, deactivationEpoch }
 */
export async function getInactiveValidatorsWithDeactivationEpoch(
    systemState: any,
): Promise<Record<string, InactiveValidatorInfo>> {
    const validatorMap: Record<string, InactiveValidatorInfo> = {};
    if (systemState?.json?.validators?.inactive_validators.size == 0) {
        return validatorMap;
    }
    const inactiveValidatorsId = systemState?.json?.validators?.inactive_validators.id;
    let dynamicFields = await queryDynamicFields({
        objectId: inactiveValidatorsId,
        pageSize: 50,
        graphqlUrl: getSelectedNetworkConfig().graphql,
    });
    for (const node of dynamicFields.nodes) {
        const result = await queryDynamicField({
            objectId: node.value.json.inner.id,
            fieldType: 'u64',
            bcsValue: 'AQAAAAAAAAA=',
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });
        if (result.error) {
            throw new Error('Failed to fetch inactive validator: ' + result.error);
        }
        const stakingPool = result.field.value.json.staking_pool;
        const poolId = stakingPool.id;
        const exchangeRateId = stakingPool.exchange_rates.id;
        const deactivationEpoch = parseInt(stakingPool.deactivation_epoch);

        if (!isNaN(deactivationEpoch)) {
            validatorMap[poolId] = {
                exchangeRateId,
                deactivationEpoch,
            };
        }
    }

    return validatorMap;
}

export function getValidatorInfo(systemState: any): Record<string, ValidatorInfo> {
    const validatorInfo: Record<string, ValidatorInfo> = {};
    const activeValidators = systemState?.json?.validators?.active_validators || [];
    for (const validator of activeValidators) {
        const poolId = validator?.staking_pool?.id;
        const name = validator?.metadata?.name || 'Unknown Validator';
        if (poolId) {
            validatorInfo[poolId] = { name, poolId };
        }
    }
    return validatorInfo;
}

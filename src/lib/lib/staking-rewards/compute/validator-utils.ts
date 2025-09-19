import type { ValidatorInfo } from './types';
import { queryDynamicField, queryDynamicFields } from '../../dynamic-fields/dynamic-fields-utils';
import { getSelectedNetworkConfig } from '../../client';

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

export async function getInactiveValidatorsExchangeRateIds(
    systemState: any,
): Promise<Record<string, string>> {
    const validatorMap: Record<string, string> = {};
    if (systemState?.json?.validators?.inactive_validators.size == 0) {
        return validatorMap;
    }
    const inactiveValidatorsId = systemState?.json?.validators?.inactive_validators.id;
    let dynamicFields = await queryDynamicFields({ objectId: inactiveValidatorsId, pageSize: 50, graphqlUrl: getSelectedNetworkConfig().graphql, })
    for (const node of dynamicFields.nodes) {
        const result = await queryDynamicField({
            objectId: node.value.json.inner.id,
            fieldType: "u64",
            bcsValue: "AQAAAAAAAAA=",
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });
        if (result.error) {
            throw new Error("Failed to fetch inactive validator: " + result.error);
        }
        let poolId = result.field.value.json.staking_pool.id
        let exchangeRateId = result.field.value.json.staking_pool.exchange_rates.id
        validatorMap[poolId] = exchangeRateId;
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

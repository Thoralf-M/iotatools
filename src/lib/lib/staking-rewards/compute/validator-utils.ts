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

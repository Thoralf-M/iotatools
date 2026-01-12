// Helper function to safely convert to BigInt
export function safeBigInt(value: any): bigint {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') {
        try {
            return BigInt(value);
        } catch (e) {
            console.warn(`Failed to convert "${value}" to BigInt:`, e);
            return 0n;
        }
    }
    if (typeof value === 'object' && value?.value) {
        return safeBigInt(value.value);
    }
    console.warn(`Cannot convert ${typeof value} to BigInt:`, value);
    return 0n;
}

// Helper function to calculate IOTA amount from pool tokens using exchange rate
export function getIotaAmount(
    exchangeRate:
        | { iota_amount: string; pool_token_amount: string }
        | { iota: string; pool: string },
    tokenAmount: bigint,
): bigint {
    // Handle both formats - new cache format and GraphQL response format
    const iotaAmount =
        'iota' in exchangeRate
            ? safeBigInt(exchangeRate.iota)
            : safeBigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate
            ? safeBigInt(exchangeRate.pool)
            : safeBigInt(exchangeRate.pool_token_amount);

    // When either amount is 0, return the token amount (as per Move implementation)
    if (iotaAmount === 0n || poolTokenAmount === 0n) {
        return tokenAmount;
    }

    // Calculate: (iota_amount * token_amount) / pool_token_amount
    return (iotaAmount * tokenAmount) / poolTokenAmount;
}

// Helper function to get pool token amount from IOTA amount using exchange rate
export function getTokenAmount(
    exchangeRate:
        | { iota_amount: string; pool_token_amount: string }
        | { iota: string; pool: string },
    iotaAmount: bigint,
): bigint {
    // Handle both formats - new cache format and GraphQL response format
    const iotaAmountBig =
        'iota' in exchangeRate
            ? safeBigInt(exchangeRate.iota)
            : safeBigInt(exchangeRate.iota_amount);
    const poolTokenAmount =
        'pool' in exchangeRate
            ? safeBigInt(exchangeRate.pool)
            : safeBigInt(exchangeRate.pool_token_amount);

    // When either amount is 0, return the iota amount
    if (iotaAmountBig === 0n || poolTokenAmount === 0n) {
        return iotaAmount;
    }

    // Calculate: (pool_token_amount * iota_amount) / iota_amount_rate
    return (poolTokenAmount * iotaAmount) / iotaAmountBig;
}

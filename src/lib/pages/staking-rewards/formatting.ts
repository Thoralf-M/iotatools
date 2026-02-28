/**
 * Formatting utilities for staking rewards display.
 * Centralizes all IOTA amount formatting logic.
 */

const NANO_TO_IOTA = 1_000_000_000;

/**
 * Format a nano amount (bigint) as IOTA with specified decimal places.
 * @param nanoAmount The amount in nano IOTA
 * @param decimals Number of decimal places (default 2)
 * @param includeSuffix Whether to include " IOTA" suffix
 */
export function formatNanoAsIota(
    nanoAmount: bigint,
    decimals: number = 2,
    includeSuffix: boolean = true,
): string {
    if (nanoAmount === 0n) return '0';
    const whole = nanoAmount / BigInt(NANO_TO_IOTA);
    const nano = nanoAmount % BigInt(NANO_TO_IOTA);
    const nanoStr = nano.toString().padStart(9, '0');
    const decimal = nanoStr.slice(0, decimals);
    const wholeStr = whole.toLocaleString('en-US');
    const formatted = `${wholeStr}.${decimal}`;
    return includeSuffix ? `${formatted} IOTA` : formatted;
}

/**
 * Format a bigint value as a locale-formatted number with specified decimal places.
 * Used primarily for test output and snapshots.
 */
export function formatNumberLocale(value: bigint, decimals: number = 9): string {
    const num = Number(value) / Math.pow(10, decimals);
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/**
 * Convert nano IOTA to IOTA number (for chart display).
 */
export function nanoToIota(nanoAmount: bigint): number {
    return Number(nanoAmount) / NANO_TO_IOTA;
}

/**
 * Convert nano string to IOTA number.
 */
export function nanoStringToIota(nanoAmount: string | undefined): number {
    if (!nanoAmount || nanoAmount === '0') return 0;
    try {
        return nanoToIota(BigInt(nanoAmount));
    } catch {
        return 0;
    }
}

/**
 * Format a date for display in the table.
 */
export function formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * Format a nano amount as IOTA with full precision (no trailing zeros).
 * Used for CSV export where maximum precision is needed.
 * @param nanoAmount The amount in nano IOTA
 * @param includeSuffix Whether to include " IOTA" suffix (default false for CSV)
 */
export function formatNanoAsIotaFullPrecision(
    nanoAmount: bigint,
    includeSuffix: boolean = false,
): string {
    if (nanoAmount === 0n) return '0';
    const whole = nanoAmount / BigInt(NANO_TO_IOTA);
    const nano = nanoAmount % BigInt(NANO_TO_IOTA);
    const wholeStr = whole.toString();
    const nanoStr = nano.toString().padStart(9, '0');
    const trimmedNano = nanoStr.replace(/0+$/, '');
    if (trimmedNano === '') {
        return includeSuffix ? `${wholeStr} IOTA` : wholeStr;
    }
    const formatted = `${wholeStr}.${trimmedNano}`;
    return includeSuffix ? `${formatted} IOTA` : formatted;
}

/**
 * Format a price value with the specified currency.
 */
export function formatPrice(value: number, currency: 'usd' | 'eur' = 'usd'): string {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
}

/**
 * Calculate price value (IOTA amount * price).
 */
export function calculatePriceValue(iotaAmount: number, price: number): number {
    return iotaAmount * price;
}

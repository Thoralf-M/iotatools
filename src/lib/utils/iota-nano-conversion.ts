import { IOTA_DECIMALS } from '@iota/iota-sdk/utils';

export function iotaToNano(iota: string): string {
    const [intPart, decPart = ''] = iota.replace(/_/g, '').split('.');
    if (decPart.length > 9) {
        throw new Error('Decimal part exceeds 9 digits');
    }

    // Pad or trim the decimal part to 9 digits
    const paddedDec = (decPart + '0'.repeat(IOTA_DECIMALS)).slice(0, 9);

    // Combine the parts
    const combined = intPart + paddedDec;

    return BigInt(combined).toString();
}

function formatBigIntWithDecimal(bigint: bigint, decimalPlaces: number): string {
    const str = bigint.toString();
    const len = str.length;

    if (len <= decimalPlaces) {
        // Pad with zeros on the left if necessary
        const padded = str.padStart(decimalPlaces, '0');
        return `0.${padded}`;
    }

    const intPart = str.slice(0, len - decimalPlaces);
    const decimalPart = str.slice(len - decimalPlaces);
    return `${intPart}.${decimalPart}`;
}

export const nanoToIota = (nano: string): string => {
    return formatBigIntWithDecimal(BigInt(nano.replace(/_/g, '')), IOTA_DECIMALS);
};

// Add _ as a thousands separator
export function formatNumberWithUnderscores(n: any) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

export function formatNumbersWithUnderscores(obj: object): any {
    // Recursively process the object
    function process(value: object): object {
        if (Array.isArray(value)) {
            return value.map(process);
        } else if (value !== null && typeof value === 'object') {
            const newObj = {};
            for (const key in value) {
                // @ts-ignore
                newObj[key] = process(value[key]);
            }
            return newObj;
        } else if (
            typeof value === 'number' ||
            (typeof value === 'string' && /^\d+$/.test(value))
        ) {
            return formatNumberWithUnderscores(value);
        } else {
            return value;
        }
    }

    return process(obj);
}

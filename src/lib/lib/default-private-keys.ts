import { decodeIotaPrivateKey } from '@iota/iota-sdk/cryptography';

export interface PrivateKeys {
    selected: string;
    bech32PrivateKeys: string[];
}

export const defaultPrivateKeys: PrivateKeys = {
        selected: 'iotaprivkey1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgfjx8t',
        bech32PrivateKeys: [
            'iotaprivkey1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgfjx8t',
        ],
}

export function isValidPrivateKeys(value: any) {
    if (typeof value !== 'object' || value === null) throw new Error('Config is not an object');
    if (typeof value.selected !== 'string') throw new Error('Config.selected is not a string');
    if (!Array.isArray(value.bech32PrivateKeys)) throw new Error('Config.bech32PrivateKeys is not an array');
    for (const [i, key] of value.bech32PrivateKeys.entries()) {
        if (typeof key !== 'string')
            throw new Error(`Config.bech32PrivateKeys[${i}] is not a string`);
        try {
            decodeIotaPrivateKey(key);
        } catch (error) {
            throw new Error(`Config.bech32PrivateKeys[${i}] is not a valid IOTA private key: ${error}`);
        }
    }
    return true;
}
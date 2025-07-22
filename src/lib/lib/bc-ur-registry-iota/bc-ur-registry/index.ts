import './patchCBOR';

import { Buffer } from 'buffer/';

import { Bytes } from './Bytes';
import { CryptoAccount } from './CryptoAccount';
import {
    CryptoCoinInfo,
    Network as CryptoCoinInfoNetwork,
    Type as CryptoCoinInfoType,
} from './CryptoCoinInfo';
import { CryptoECKey } from './CryptoECKey';
import { CryptoHDKey } from './CryptoHDKey';
import { CryptoKeypath } from './CryptoKeypath';
import { CryptoOutput } from './CryptoOutput';
import { CryptoPSBT } from './CryptoPSBT';
import { URRegistryDecoder } from './Decoder';
import { CryptoMultiAccounts } from './extended/CryptoMultiAccounts';
import {
    addReader,
    addSemanticDecode,
    addSemanticEncode,
    addWriter,
    decodeToDataItem,
    encodeDataItem,
} from './lib';
import { MultiKey } from './MultiKey';
import { PathComponent } from './PathComponent';
import { RegistryItem } from './RegistryItem';
import { RegistryType, RegistryTypes } from './RegistryType';
import { ScriptExpressions } from './ScriptExpression';
import { patchTags } from './utils';

export { DataItem } from './lib';

const URlib = {
    URRegistryDecoder,
    Bytes,
    CryptoAccount,
    CryptoHDKey,
    CryptoMultiAccounts,
    CryptoKeypath,
    CryptoCoinInfo,
    CryptoCoinInfoType,
    CryptoCoinInfoNetwork,
    CryptoECKey,
    CryptoOutput,
    CryptoPSBT,
    MultiKey,
    ScriptExpressions,
    PathComponent,
};

const cbor = {
    addReader,
    addSemanticDecode,
    addSemanticEncode,
    addWriter,
    patchTags,
};

const extend = {
    RegistryTypes,
    RegistryItem,
    RegistryType,

    decodeToDataItem,
    encodeDataItem,

    cbor,
};

export {
    URRegistryDecoder,
    Bytes,
    CryptoAccount,
    CryptoHDKey,
    CryptoMultiAccounts,
    CryptoKeypath,
    CryptoCoinInfo,
    CryptoCoinInfoType,
    CryptoCoinInfoNetwork,
    CryptoECKey,
    CryptoOutput,
    CryptoPSBT,
    MultiKey,
    ScriptExpressions,
    PathComponent,
    extend,
    Buffer,
};

export * from './errors';
export * from './Decoder';
export * from './lib';
export * from './CryptoAccount';
export * from './CryptoPSBT';
export * from './CryptoHDKey';
export * from './extended/CryptoMultiAccounts';
export * from './extended/QRHardwareCall';
export * from './extended/KeyDerivation';
export * from './extended/DerivationSchema';
export * from './CryptoOutput';
export * from './CryptoCoinInfo';
export * from './CryptoECKey';
export * from './MultiKey';
export * from './CryptoKeypath';
export * from './patchCBOR';
export * from './PathComponent';
export * from './RegistryItem';
export * from './RegistryType';
export * from './types';
export * from './utils';

export default URlib;

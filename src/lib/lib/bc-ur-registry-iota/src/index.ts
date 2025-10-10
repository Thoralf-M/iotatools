import { patchTags } from '../bc-ur-registry';
import { ExtendedRegistryTypes } from './RegistryType';

export * from '../bc-ur-registry';

patchTags(
    Object.values(ExtendedRegistryTypes)
        .filter((rt) => !!rt.getTag())
        .map((rt) => rt.getTag()) as number[],
);

export { generateKeyDerivationCall } from './IotaKeyDerivationCall';
export { IotaSignRequest } from './IotaSignRequest';
export { IotaSignature } from './IotaSignature';
export { IotaSignHashRequest } from './IotaSignHashRequest';

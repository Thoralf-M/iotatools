import { UR } from '@gandlaf21/bc-ur';

import {
    CryptoKeypath,
    Curve,
    DerivationAlgorithm,
    KeyDerivation,
    KeyDerivationSchema,
    PathComponent,
    QRHardwareCall,
    QRHardwareCallType,
    QRHardwareCallVersion,
} from '../bc-ur-registry';

export { Curve, DerivationAlgorithm, QRHardwareCallVersion };

export const pathToKeypath = (path: string): CryptoKeypath => {
    const paths = path.replace(/[m|M]\//, '').split('/');
    const pathComponents = paths.map((path) => {
        const index = parseInt(path.replace("'", ''), 10);
        const isHardened = path.endsWith("'");
        return new PathComponent({ index, hardened: isHardened });
    });
    return new CryptoKeypath(pathComponents);
};

export interface IotaKeySchema {
    path: string;
    curve?: Curve;
    algo?: DerivationAlgorithm;
    chainType?: string;
}

export interface IotaKeyDerivationCallArgs {
    schemas: IotaKeySchema[];
    origin?: string;
}

export const generateKeyDerivationCall = ({ schemas, origin }: IotaKeyDerivationCallArgs): UR => {
    const keyDerivationSchemas = schemas.map(
        ({
            path,
            curve = Curve.ed25519, // IOTA typically uses ed25519
            algo = DerivationAlgorithm.slip10,
            chainType = 'IOTA',
        }) => {
            // For IOTA, only ed25519 + slip10 is supported
            if (curve !== Curve.ed25519 || algo !== DerivationAlgorithm.slip10) {
                throw new Error('Only ed25519 curve with SLIP-10 algorithm is supported for IOTA');
            }
            return new KeyDerivationSchema(pathToKeypath(path), curve, algo, chainType);
        },
    );
    const keyDerivation = new KeyDerivation(keyDerivationSchemas);
    const hardwareCall = new QRHardwareCall(
        QRHardwareCallType.KeyDerivation,
        keyDerivation,
        origin,
        QRHardwareCallVersion.V1,
    );
    return hardwareCall.toUR();
};

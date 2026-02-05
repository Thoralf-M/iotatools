import { BcsType, fromBase64, toHex } from '@iota/bcs';
import { bcs } from '@iota/iota-sdk/bcs';

type ObjectArg =
    | {
        $kind: 'ImmOrOwnedObject';
        ImmOrOwnedObject: {
            objectId: string;
            version: string;
            digest: string;
        };
    }
    | {
        $kind: 'SharedObject';
        SharedObject: {
            objectId: string;
            initialSharedVersion: string;
            mutable: boolean;
        };
    }
    | {
        $kind: 'Receiving';
        Receiving: {
            objectId: string;
            version: string;
            digest: string;
        };
    };

type CallArg =
    | { $kind: 'Pure'; Pure: { bytes: number[] } }
    | { $kind: 'Object'; Object: ObjectArg };

export type MoveAuthenticatorInfo = {
    callArguments: string[];
    typeArguments: string[];
    objectToAuthenticate: ObjectArg;
    objectId: string;
};

// Custom TypeTag parser that handles the type tag bytes without fully decoding nested structures
// This is needed because the SDK's TypeTag BCS can have compatibility issues
function createTypeTagBcs(): BcsType<string> {
    return bcs.enum('TypeTag', {
        Bool: null,
        U8: null,
        U64: null,
        U128: null,
        Address: null,
        Signer: null,
        Vector: bcs.lazy(() => createTypeTagBcs()),
        Struct: bcs.struct('StructTag', {
            address: bcs.Address,
            module: bcs.string(),
            name: bcs.string(),
            typeParams: bcs.vector(bcs.lazy(() => createTypeTagBcs())),
        }),
        U16: null,
        U32: null,
        U256: null,
    }) as unknown as BcsType<string>;
}

const TypeTagBcs = createTypeTagBcs();

const MoveAuthenticatorBcs = bcs.struct('MoveAuthenticator', {
    call_args: bcs.vector(bcs.CallArg),
    type_args: bcs.vector(TypeTagBcs),
    object_to_authenticate: bcs.CallArg,
});

function normalizeCallArg(arg: CallArg): string {
    if (arg.$kind === 'Pure') {
        // Pure bytes can be number[] from BCS parsing
        const bytes =
            typeof arg.Pure.bytes === 'string'
                ? fromBase64(arg.Pure.bytes)
                : new Uint8Array(arg.Pure.bytes);
        return `0x${toHex(bytes)}`;
    }

    if (arg.$kind === 'Object') {
        if (arg.Object.$kind === 'SharedObject') {
            return arg.Object.SharedObject.objectId;
        }
        if (arg.Object.$kind === 'ImmOrOwnedObject') {
            return arg.Object.ImmOrOwnedObject.objectId;
        }
        if (arg.Object.$kind === 'Receiving') {
            return arg.Object.Receiving.objectId;
        }
    }

    return JSON.stringify(arg);
}

function extractObjectId(objectArg: ObjectArg): string {
    if (objectArg.$kind === 'SharedObject') {
        return objectArg.SharedObject.objectId;
    }
    if (objectArg.$kind === 'ImmOrOwnedObject') {
        return objectArg.ImmOrOwnedObject.objectId;
    }
    if (objectArg.$kind === 'Receiving') {
        return objectArg.Receiving.objectId;
    }

    return '';
}

export function parseMoveAuthenticatorSignature(signatureBase64: string): MoveAuthenticatorInfo {
    const bytes = fromBase64(signatureBase64);

    if (bytes[0] !== 0x07) {
        throw new Error('Signature is not a MoveAuthenticator');
    }

    const data = MoveAuthenticatorBcs.parse(bytes.slice(1)) as unknown as {
        call_args: CallArg[];
        type_args: string[];
        object_to_authenticate: CallArg;
    };

    if (data.object_to_authenticate.$kind !== 'Object') {
        throw new Error('MoveAuthenticator object_to_authenticate is not an Object');
    }

    const objectToAuthenticate = data.object_to_authenticate.Object;

    return {
        callArguments: data.call_args.map(normalizeCallArg),
        typeArguments: data.type_args,
        objectToAuthenticate,
        objectId: extractObjectId(objectToAuthenticate),
    };
}

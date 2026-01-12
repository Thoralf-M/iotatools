declare module '@gandlaf21/bc-ur' {
    export class UR {
        constructor(data: Uint8Array, type: string);
        type: string;
        cbor: Buffer;
        data: Uint8Array;
    }

    export class UREncoder {
        constructor(
            ur: UR,
            maxFragmentLength?: number,
            firstSeqNum?: number,
            minFragmentLength?: number,
        );
        encodeWhole(): string;
        nextPart(): string;
        isComplete(): boolean;
    }

    export class URDecoder {
        constructor();
        receivePart(part: string): boolean;
        isComplete(): boolean;
        resultUR(): UR;
        resultRegistryType(): any; // Adjust based on actual return type
    }
}

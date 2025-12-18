declare module '@gandlaf21/bc-ur' {
  export class UR {
    constructor(cbor: any, type: string);
    type: string;
    cbor: any;
  }

  export class UREncoder {
    constructor(ur: UR, maxFragmentLength?: number, firstSeqNum?: number, minFragmentLength?: number);
    // Add methods as needed
  }

  export class URDecoder {
    receivePart(data: any): void;
    isComplete(): boolean;
    resultUR(): UR;
    // Add other methods
  }
}
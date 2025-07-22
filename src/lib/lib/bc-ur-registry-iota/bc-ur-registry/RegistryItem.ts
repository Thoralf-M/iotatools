import { UR, UREncoder } from '@gandlaf21/bc-ur';

import { DataItem, encodeDataItem } from './lib';
import { RegistryType } from './RegistryType';

export abstract class RegistryItem {
    abstract getRegistryType: () => RegistryType;
    abstract toDataItem: () => DataItem;
    public toCBOR = () => {
        if (this.toDataItem() === undefined) {
            throw new Error(
                `#[ur-registry][RegistryItem][fn.toCBOR]: registry ${this.getRegistryType()}'s method toDataItem returns undefined`,
            );
        }
        return encodeDataItem(this.toDataItem());
    };

    public toUR = () => {
        return new UR(this.toCBOR(), this.getRegistryType().getType());
    };

    public toUREncoder = (
        maxFragmentLength?: number,
        firstSeqNum?: number,
        minFragmentLength?: number,
    ) => {
        const ur = this.toUR();
        const urEncoder = new UREncoder(ur, maxFragmentLength, firstSeqNum, minFragmentLength);
        return urEncoder;
    };
}

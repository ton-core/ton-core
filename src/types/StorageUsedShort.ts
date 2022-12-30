
// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L225
// storage_used_short$_ cells:(VarUInteger 7) 
//  bits:(VarUInteger 7) = StorageUsedShort;

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

export type StorageUsedShort = {
    cells: bigint,
    bits: bigint
};

export function loadStorageUsedShort(slice: Slice): StorageUsedShort {
    let cells = slice.loadVarUintBig(3);
    let bits = slice.loadVarUintBig(3);
    return {
        cells,
        bits
    };
}

export function storeStorageUsedShort(src: StorageUsedShort) {
    return (builder: Builder) => {
        builder.storeVarUint(src.cells, 3);
        builder.storeVarUint(src.bits, 3);
    }
}
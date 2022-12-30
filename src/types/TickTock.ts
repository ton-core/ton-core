
// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L139

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

// tick_tock$_ tick:Bool tock:Bool = TickTock;
export type TickTock = {
    tick: boolean;
    tock: boolean;
}

export function loadTickTock(slice: Slice): TickTock {
    return {
        tick: slice.loadBit(),
        tock: slice.loadBit()
    };
}

export function storeTickTock(src: TickTock) {
    return (builder: Builder) => {
        builder.storeBit(src.tick);
        builder.storeBit(src.tock);
    }
}
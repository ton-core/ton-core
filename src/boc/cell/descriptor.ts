import { BitString } from "../BitString";
import { Cell } from "../Cell";
import { bitsToPaddedBuffer } from "../utils/paddedBits";

export function getRefsDescriptor(refs: Cell[], exotic: boolean, level: number) {
    return refs.length + (exotic ? 1 : 0) * 8 + level * 32;
}

export function getBitsDescriptor(bits: BitString) {
    let len = bits.length;
    return Math.ceil(len / 8) + Math.floor(len / 8);
}

export function getRepr(bits: BitString, refs: Cell[], level: number, exotic: boolean) {

    // Allocate
    const bitsLen = Math.ceil(bits.length / 8);
    const repr = Buffer.alloc(2 + bitsLen + (2 + 32) * refs.length);

    // Write descriptors
    let reprCursor = 0;
    repr[reprCursor++] = getRefsDescriptor(refs, exotic, level);
    repr[reprCursor++] = getBitsDescriptor(bits);

    // Write bits
    bitsToPaddedBuffer(bits).copy(repr, reprCursor);
    reprCursor += bitsLen;

    // Write refs
    for (const c of refs) {
        const md = c.depth(level);
        repr[reprCursor++] = Math.floor(md / 256);
        repr[reprCursor++] = md % 256;
    }
    for (const c of refs) {
        c.hash(level).copy(repr, reprCursor);
        reprCursor += 32;
    }

    // Result
    return repr;
}
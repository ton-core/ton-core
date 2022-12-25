import { Cell } from "../Cell";
import { bitsToPaddedBuffer } from "../utils/paddedBits";

export function getRefsDescriptor(cell: Cell) {
    return cell.refs.length + (cell.isExotic ? 1 : 0) * 8 + cell.level * 32;
}

export function getBitsDescriptor(cell: Cell) {
    let len = cell.bits.length;
    return Math.ceil(len / 8) + Math.floor(len / 8);
}

export function getRepr(cell: Cell) {

    // Allocate
    const bitsLen = Math.ceil(cell.bits.length / 8);
    const repr = Buffer.alloc(2 + bitsLen + (2 + 32) * cell.refs.length);

    // Write descriptors
    let reprCursor = 0;
    repr[reprCursor++] = getRefsDescriptor(cell);
    repr[reprCursor++] = getBitsDescriptor(cell);

    // Write bits
    bitsToPaddedBuffer(cell.bits).copy(repr, reprCursor);
    reprCursor += bitsLen;

    // Write refs
    for (const c of cell.refs) {
        const md = c.depth;
        repr[reprCursor++] = Math.floor(md / 256);
        repr[reprCursor++] = md % 256;
    }
    for (const c of cell.refs) {
        c.hash().copy(repr, reprCursor);
        reprCursor += 32;
    }

    // Result
    return repr;
}
import { BitString } from "./BitString";
import { CellType } from "./CellType";
import { bitsToPaddedBuffer } from "./utils/paddedBits";
import { sha256_sync } from 'ton-crypto';

function getRefsDescriptor(cell: Cell) {
    return cell.refs.length + (cell.isExotic ? 1 : 0) * 8 + cell.level * 32;
}

function getBitsDescriptor(cell: Cell) {
    let len = cell.bits.length;
    if (cell.isExotic) {
        len += 8;
    }
    return Math.ceil(len / 8) + Math.floor(len / 8);
}

function getRepr(cell: Cell) {

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

export class Cell {

    readonly type: CellType;
    readonly bits: BitString;
    readonly refs: Cell[];
    readonly depth: number;
    readonly level: number;

    // Cached hash
    private _hash: Buffer | null = null;
    private _hashComputing = false;

    constructor(opts?: { type?: CellType, bits?: BitString, refs?: Cell[] }) {

        // Load parameters
        if (opts && opts.type) {
            this.type = opts.type;
        } else {
            this.type = CellType.Ordinary;
        }
        if (opts && opts.bits) {
            this.bits = opts.bits;
        } else {
            this.bits = new BitString(Buffer.alloc(0), 0, 0);
        }
        if (opts && opts.refs) {
            this.refs = opts.refs;
        } else {
            this.refs = [];
        }

        // Compute depth
        let d = 0;
        if (this.refs.length > 0) {
            for (let ref of this.refs) {
                d = Math.max(ref.depth, d);
            }
            d++;
        }
        this.depth = d;

        // Compute level
        let l = 0;
        // TODO: Implement for non-ordinary cells
        this.level = l;
    }

    get isExotic() {
        return this.type !== CellType.Ordinary;
    }

    hash = (): Buffer => {

        // Check if hash is already computed
        if (this._hash) {
            return this._hash;
        }
        if (this._hashComputing) {
            throw new Error("Cell cicrucular reference detected"); // Should not happen
        }
        this._hashComputing = true;
        let repr = getRepr(this);
        let h = sha256_sync(repr);
        this._hashComputing = false;
        this._hash = h;
        return h;
    }
}
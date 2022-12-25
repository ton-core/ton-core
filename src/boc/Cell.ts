import inspectSymbol from 'symbol.inspect';
import { BitString } from "./BitString";
import { CellType } from "./CellType";
import { sha256_sync } from 'ton-crypto';
import { Slice } from "./Slice";
import { getRepr } from './cell/descriptor';

/**
 * Cell as described in TVM spec
 */
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
            this.refs = [...opts.refs];
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

    /**
     * Check if cell is exotic
     */
    get isExotic() {
        return this.type !== CellType.Ordinary;
    }

    /**
     * Beging cell parsing
     * @returns a new slice
     */
    beginParse = () => {
        return new Slice(this);
    }

    /**
     * Compute cell hash
     * @returns cell hash
     */
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

    equals = (other: Cell): boolean => {
        return this.hash().equals(other.hash());
    }

    toString(indent?: string): string {
        let id = indent || '';
        let s = id + 'x{' + this.bits.toString() + '}';
        for (let k in this.refs) {
            const i = this.refs[k];
            s += '\n' + i.toString(id + ' ');
        }
        return s;
    }

    [inspectSymbol] = () => this.toString()
}
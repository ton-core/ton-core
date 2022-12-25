import inspectSymbol from 'symbol.inspect';
import { BitString } from "./BitString";
import { CellType } from "./CellType";
import { sha256_sync } from 'ton-crypto';
import { Slice } from "./Slice";
import { getRepr } from './cell/descriptor';
import { resolveExotic } from './cell/resolveExotic';

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

    constructor(opts?: { exotic?: boolean, bits?: BitString, refs?: Cell[] }) {

        // Resolve bits
        let bits = BitString.EMPTY;
        if (opts && opts.bits) {
            bits = opts.bits;
        }

        // Resolve refs
        let refs: Cell[] = [];
        if (opts && opts.refs) {
            refs = opts.refs;
        }

        // Resolve type
        let type = CellType.Ordinary;
        let level = 0;
        let depth = 0;
        if (opts && opts.exotic) {
            let resolved = resolveExotic(bits, refs);
            type = resolved.type;
            depth = resolved.depth;
            level = resolved.level;
        } else {

            // Check correctness
            if (refs.length > 4) {
                throw new Error("Invalid number of references");
            }
            if (bits.length > 1023) {
                throw new Error("Invalid number of bits");
            }

            // Calculate depth
            let d = 0;
            if (refs.length > 0) {
                for (let ref of refs) {
                    d = Math.max(ref.depth, d);
                }
                d++;
            }
            depth = d;

            // Calculate level
            let l = 0;
            if (refs.length > 0) {
                for (let ref of refs) {
                    l = Math.max(ref.level, l);
                }
            }
            level = l;
        }

        // Set fields
        this.type = type;
        this.bits = bits;
        this.refs = refs;
        this.depth = depth;
        this.level = level;
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
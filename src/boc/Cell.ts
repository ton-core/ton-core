import inspectSymbol from 'symbol.inspect';
import { BitString } from "./BitString";
import { CellType } from "./CellType";
import { sha256_sync } from 'ton-crypto';
import { Slice } from "./Slice";
import { getRepr } from './cell/descriptor';
import { LevelMask } from './cell/LevelMask';

/**
 * Cell as described in TVM spec
 */
export class Cell {

    // Public properties
    readonly type: CellType;
    readonly bits: BitString;
    readonly refs: Cell[];
    readonly mask: LevelMask;

    // Level and depth information
    private _hashes: Buffer[] = [];
    private _depths: number[] = [];

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
        let hashes: Buffer[];
        let depths: number[];
        let mask: LevelMask;
        let type = CellType.Ordinary;
        if (opts && opts.exotic) {
            // let resolved = resolveExotic(bits, refs);
            // type = resolved.type;
            // mask = new LevelMask(0);
            throw Error('Unsupported');
        } else {

            // Check correctness
            if (refs.length > 4) {
                throw new Error("Invalid number of references");
            }
            if (bits.length > 1023) {
                throw new Error("Invalid number of bits");
            }

            // Calculate level
            let l = 0;
            if (refs.length > 0) {
                for (let ref of refs) {
                    l = l | ref.level();
                }
            }
            mask = new LevelMask(l);

            // Calculate depth
            depths = [];
            for (let i = 0; i <= mask.level; i++) {
                let d = 0;
                if (refs.length > 0) {
                    for (let ref of refs) {
                        d = Math.max(ref.depth(i), d);
                    }
                    d++;
                }
                depths.push(d);
            }

            // Calculate hashes
            hashes = [];
            for (let i = 0; i <= mask.level; i++) {
                let repr = getRepr(bits, refs, i, false);
                hashes.push(sha256_sync(repr));
            }
        }

        // Set fields
        this.type = type;
        this.bits = bits;
        this.refs = refs;
        this.mask = mask;
        this._depths = depths;
        this._hashes = hashes;
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
     * Get cell hash
     * @returns cell hash
     */
    hash = (level: number = 3): Buffer => {
        return this._hashes[Math.min(this._hashes.length - 1, level)];
    }

    depth = (level: number = 3): number => {
        return this._depths[Math.min(this._depths.length - 1, level)];
    }

    level = (): number => {
        return this.mask.level;
    }

    equals = (other: Cell): boolean => {
        return this.hash().equals(other.hash());
    }

    toString(indent?: string): string {
        let id = indent || '';
        let s = id + (this.isExotic ? 'e' : 'x') + '{' + this.bits.toString() + '}';
        for (let k in this.refs) {
            const i = this.refs[k];
            s += '\n' + i.toString(id + ' ');
        }
        return s;
    }

    [inspectSymbol] = () => this.toString()
}
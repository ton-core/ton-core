import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";

export type ExoticPruned = {
    level: number;
    pruned: { depth: number, hash: Buffer }[]
}

export function exoticPruned(bits: BitString, refs: Cell[]): ExoticPruned {

    let reader = new BitReader(bits);

    // Check type
    let type = reader.loadUint(8);
    if (type !== 1) {
        throw new Error(`Pruned branch cell must have type 1, got "${type}"`);
    }

    // Check refs
    if (refs.length !== 0) {
        throw new Error(`Pruned Branch cell can't has refs, got "${refs.length}"`);
    }

    // Check level
    let level = 32 - Math.clz32(reader.loadUint(8));
    if (level < 1 || level > 3) {
        throw new Error(`Pruned Branch cell level must be >= 1 and <= 3, got "${level}"`);
    }

    // Read pruned
    const size = 8 + 8 + (level * (256 /* Hash */ + 16 /* Depth */));
    if (bits.length !== size) {
        throw new Error(`Pruned branch cell must have exactly ${size} bits, got "${bits.length}"`);
    }
    let pruned: { depth: number, hash: Buffer }[] = [];
    for (let i = 0; i < level; i++) {
        pruned.push({
            hash: reader.loadBuffer(32),
            depth: reader.loadUint(16)
        });
    }

    return {
        level,
        pruned
    };
}
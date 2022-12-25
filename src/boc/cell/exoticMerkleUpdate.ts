import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";

export function exoticMerkleUpdate(bits: BitString, refs: Cell[]) {
    const reader = new BitReader(bits);

    // type + hash + hash + depth + depth
    const size = 8 + (2 * (256 + 16));

    if (bits.length !== size) {
        throw new Error(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "${bits.length}"`);
    }

    if (refs.length !== 2) {
        throw new Error(`Merkle Update cell must have exactly 2 refs, got "${refs.length}"`);
    }

    let type = reader.loadUint(8);
    if (type !== 4) {
        throw new Error(`Merkle Update cell type must be exactly 4, got "${type}"`)
    }

    const proofHash1 = reader.loadBuffer(32);
    const proofHash2 = reader.loadBuffer(32);
    const proofDepth1 = reader.loadUint(16);
    const proofDepth2 = reader.loadUint(16);

    return {
        proofDepth1,
        proofDepth2,
        proofHash1,
        proofHash2
    };
}
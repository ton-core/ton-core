import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";
import { CellType } from "../CellType";

const HASH_BITS = 256;
const DEPTH_BITS = 16;

function resolvePruned(bits: BitString, refs: Cell[], reader: BitReader): { type: CellType, depth: number, level: number } {

    // type + mask + (higher hashes * (hash + depth))
    const minSize = 8 + 8 + (1 * (HASH_BITS + DEPTH_BITS));

    if (bits.length < minSize) {
        throw new Error(`Pruned Branch cell can't has less than (8 + 8 + 256 + 16) bits, got "${bits.length}"`);
    }

    if (refs.length !== 0) {
        throw new Error(`Pruned Branch cell can't has refs, got "${refs.length}"`);
    }

    // Check type
    let type = reader.loadUint(8);
    if (type !== 1) {
        throw new Error(`Pruned branch cell must have type 1, got "${type}"`);
    }

    // Check level
    let level = 32 - Math.clz32(reader.loadUint(8));

    // Check size
    const size = 8 + 8 + (level * (HASH_BITS + DEPTH_BITS));
    if (bits.length !== size) {
        throw new Error(`Pruned branch cell must have exactly ${size} bits, got "${bits.length}"`);
    }

    // Resolve depth
    let depth = 0;
    for (let i = 0; i < level; i++) {
        const hash = reader.loadBuffer(32);
        depth = reader.loadUint(16);
        // depth = Math.max(depth, d);
    }
    depth++;

    return {
        type: CellType.PrunedBranch,
        depth,
        level
    };
}

function resolveMerkleProof(bits: BitString, refs: Cell[], reader: BitReader): { type: CellType, depth: number, level: number } {

    // type + hash + depth
    const size = 8 + HASH_BITS + DEPTH_BITS;

    if (bits.length !== size) {
        throw new Error(`Merkle Proof cell must have exactly (8 + 256 + 16) bits, got "${bits.length}"`);
    }

    if (refs.length !== 1) {
        throw new Error(`Merkle Proof cell must have exactly 1 ref, got "${refs.length}"`);
    }

    // Check type
    let type = reader.loadUint(8);
    if (type !== 3) {
        throw new Error(`Merkle Proof cell must have type 3, got "${type}"`);
    }

    // Check data
    const proofHash = reader.loadBuffer(32);
    const proofDepth = reader.loadUint(16);
    const refHash = refs[0].hash()
    const refDepth = refs[0].depth;

    if (!proofHash.equals(refHash)) {
        throw new Error(`Merkle Proof cell ref hash must be exactly "${proofHash.toString('hex')}", got "${refHash.toString('hex')}"`);
    }

    if (proofDepth !== refDepth) {
        throw new Error(`Merkle Proof cell ref depth must be exactly "${proofDepth}", got "${refDepth}"`);
    }

    const depth = proofDepth;
    const level = Math.max(refs[0].level - 1, 0);

    return {
        type: CellType.MerkleProof,
        depth,
        level
    };
}

function resolveMerkleUpdate(bits: BitString, refs: Cell[], reader: BitReader): { type: CellType, depth: number, level: number } {
    return {
        type: CellType.MerkleProof,
        depth: 0,
        level: 0
    };
}

export function resolveExotic(bits: BitString, refs: Cell[]): { type: CellType, depth: number, level: number } {
    let reader = new BitReader(bits);
    let type = reader.preloadUint(8);

    if (type === 1) {
        return resolvePruned(bits, refs, reader);
    }

    if (type === 2) {
        throw new Error('Library cell must be loaded automatically');
    }

    if (type === 3) {
        return resolveMerkleProof(bits, refs, reader);
    }

    if (type === 4) {
        return resolveMerkleUpdate(bits, refs, reader);
    }

    throw Error('Invalid exotic cell type: ' + type);
}
import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";
import { CellType } from "../CellType";
import { exoticMerkleProof } from "./exoticMerkleProof";
import { exoticMerkleUpdate } from "./exoticMerkleUpdate";
import { exoticPruned } from "./exoticPruned";
import { LevelMask } from "./LevelMask";

function resolvePruned(bits: BitString, refs: Cell[]): { type: CellType, depths: number[], hashes: Buffer[], mask: LevelMask } {

    // Parse pruned cell
    let pruned = exoticPruned(bits, refs);

    // Calculate parameters
    let depths: number[] = [];
    let hashes: Buffer[] = [];
    let mask = new LevelMask(pruned.mask);
    for (let i = 0; i < pruned.pruned.length; i++) {
        depths.push(pruned.pruned[i].depth);
        hashes.push(pruned.pruned[i].hash);
    }

    return {
        type: CellType.PrunedBranch,
        depths,
        hashes,
        mask
    };
}

function resolveMerkleProof(bits: BitString, refs: Cell[]): { type: CellType, depths: number[], hashes: Buffer[], mask: LevelMask } {

    // Parse merkle proof cell
    let merkleProof = exoticMerkleProof(bits, refs);

    // Calculate parameters
    let depths: number[] = [];
    let hashes: Buffer[] = [];
    let mask = new LevelMask(refs[0].level() >> 1);

    return {
        type: CellType.MerkleProof,
        depths,
        hashes,
        mask
    };
}

function resolveMerkleUpdate(bits: BitString, refs: Cell[]): { type: CellType, depths: number[], hashes: Buffer[], mask: LevelMask } {

    // Parse merkle proof cell
    let merkleUpdate = exoticMerkleUpdate(bits, refs);

    // Calculate parameters
    let depths: number[] = [];
    let hashes: Buffer[] = [];
    let mask = new LevelMask((refs[0].level() | refs[1].level()) >> 1);

    return {
        type: CellType.MerkleUpdate,
        depths,
        hashes,
        mask
    };
}

export function resolveExotic(bits: BitString, refs: Cell[]): { type: CellType, depths: number[], hashes: Buffer[], mask: LevelMask } {
    let reader = new BitReader(bits);
    let type = reader.preloadUint(8);

    if (type === 1) {
        return resolvePruned(bits, refs);
    }

    if (type === 2) {
        throw new Error('Library cell must be loaded automatically');
    }

    if (type === 3) {
        return resolveMerkleProof(bits, refs);
    }

    if (type === 4) {
        return resolveMerkleUpdate(bits, refs);
    }

    throw Error('Invalid exotic cell type: ' + type);
}
import { BitString } from "../BitString";
import { CellType } from "../CellType";
import { Cell } from '../Cell';
import { LevelMask } from "./LevelMask";
import { exoticPruned } from "./exoticPruned";
import { exoticMerkleProof } from "./exoticMerkleProof";
import { getRepr } from "./descriptor";
import { sha256_sync } from "ton-crypto";
import { exoticMerkleUpdate } from "./exoticMerkleUpdate";

//
// This function replicates unknown logic of resolving cell data
// https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/vm/cells/DataCell.cpp#L214
//
export function wonderCalculator(type: CellType, bits: BitString, refs: Cell[]): { mask: LevelMask, hashes: Buffer[], depths: number[] } {

    //
    // Resolving level mask
    //

    let levelMask: LevelMask;
    if (type === CellType.Ordinary) {
        let mask = 0;
        for (let r of refs) {
            mask = mask | r.mask.value;
        }
        levelMask = new LevelMask(mask);
    } else if (type === CellType.PrunedBranch) {

        // Parse pruned
        let loaded = exoticPruned(bits, refs);

        // Load level
        levelMask = new LevelMask(loaded.level);
    } else if (type === CellType.MerkleProof) {

        // Parse proof
        let loaded = exoticMerkleProof(bits, refs);

        // Load level
        levelMask = new LevelMask(refs[0].mask.value >> 1);
    } else if (type === CellType.MerkleUpdate) {

        // Parse update
        let loaded = exoticMerkleUpdate(bits, refs);

        // Load level
        levelMask = new LevelMask((refs[0].mask.value | refs[1].mask.value) >> 1);
    } else {
        throw new Error("Unsupported exotic type");
    }

    //
    // Calculate hashes and depths
    // NOTE: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/vm/cells/DataCell.cpp#L214
    //

    let depths: number[] = [];
    let hashes: Buffer[] = [];

    let hashCount = type === CellType.PrunedBranch ? 1 : levelMask.hashCount;
    let totalHashCount = levelMask.hashCount;
    let hashIOffset = totalHashCount - hashCount;
    for (let levelI = 0, hashI = 0; levelI <= levelMask.level; levelI++, hashI++) {

        // TODO: Check if this line makes sense
        // if (!level_mask.is_significant(level_i)) {
        //   continue;
        // }

        if (hashI < hashIOffset) {
            continue;
        }

        //
        // Bits
        //

        let currentBits: BitString;
        if (hashI === hashIOffset) {
            if (!(levelI === 0 || type === CellType.PrunedBranch)) {
                throw Error('Invalid');
            }
            currentBits = bits;
        } else {
            if (!(levelI !== 0 && type !== CellType.PrunedBranch)) {
                throw Error('Invalid: ' + levelI + ', ' + type);
            }
            currentBits = new BitString(hashes[hashI - hashIOffset - 1], 0, 256);
        }

        //
        // Depth
        //

        let currentDepth = 0;
        for (let c of refs) {
            let childDepth: number;
            if (type == CellType.MerkleProof || type == CellType.MerkleUpdate) {
                childDepth = c.depth(levelI + 1);
            } else {
                childDepth = c.depth(levelI);
            }
            currentDepth = Math.max(currentDepth, childDepth);
        }
        if (refs.length > 0) {
            currentDepth++;
        }

        //
        // Hash
        //

        let repr = getRepr(currentBits, refs, levelI, type);
        let hash = sha256_sync(repr);

        //
        // Persist next
        //

        let destI = hashI - hashIOffset;
        depths[destI] = currentDepth;
        hashes[destI] = hash;
    }

    return {
        mask: levelMask,
        hashes,
        depths
    };
}
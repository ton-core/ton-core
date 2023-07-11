import { beginCell, Builder } from '../boc/Builder';
import { Cell } from '../boc/Cell';
import { Slice } from '../boc/Slice';
import { DictionaryKeyTypes, Dictionary, DictionaryKey } from './Dictionary';
import { readUnaryLength } from './utils/readUnaryLength';

function convertToPrunedBranch(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(1, 8)
            .storeUint(1, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(288),
    });
}

function convertToMerkleProof(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(3, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(280),
        refs: [c],
    });
}

function doGenerateMerkleProof(
    key: bigint,
    prefix: string,
    slice: Slice,
    n: number,
    proof: Builder,
    keySize: number
) {
    const copy = slice.clone();

    // Reading label
    let lb0 = slice.loadBit() ? 1 : 0;
    let prefixLength = 0;
    let pp = prefix;

    if (lb0 === 0) {
        // Short label detected
        prefixLength = readUnaryLength(slice);
        for (let i = 0; i < prefixLength; i++) {
            pp += slice.loadBit() ? '1' : '0';
        }
    } else {
        let lb1 = slice.loadBit() ? 1 : 0;
        if (lb1 === 0) {
            // Long label detected
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += slice.loadBit() ? '1' : '0';
            }
        } else {
            // Same label detected
            let bit = slice.loadBit() ? '1' : '0';
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += bit;
            }
        }
    }

    if (n - prefixLength === 0) {
        if (key == BigInt('0b' + pp)) {
            return copy.asCell();
        }
    } else {
        let left = slice.loadRef();
        let right = slice.loadRef();
        if ((key & BigInt(1 << (n - prefixLength - 1))) === BigInt(0)) {
            proof.storeRef(
                doGenerateMerkleProof(
                    key,
                    pp + '0',
                    left.beginParse(),
                    n - prefixLength - 1,
                    beginCell(),
                    keySize
                )
            );
            proof.storeRef(convertToPrunedBranch(right));
        } else {
            proof.storeRef(convertToPrunedBranch(left));
            proof.storeRef(
                doGenerateMerkleProof(
                    key,
                    pp + '1',
                    right.beginParse(),
                    n - prefixLength - 1,
                    beginCell(),
                    keySize
                )
            );
        }
    }

    return proof.storeBits(copy.clone().loadBits(copy.remainingBits)).endCell();
}

export function generateMerkleProof<K extends DictionaryKeyTypes, V>(
    dict: Dictionary<K, V>,
    key: K
): Cell {
    if (dict['_key'] === null) {
        throw new Error('no key object');
    }
    const keyObj: DictionaryKey<K> = dict['_key'];
    return convertToMerkleProof(
        doGenerateMerkleProof(
            keyObj.serialize(key),
            '',
            beginCell().storeDictDirect(dict).endCell().beginParse(),
            keyObj.bits,
            beginCell(),
            keyObj.bits
        )
    );
}

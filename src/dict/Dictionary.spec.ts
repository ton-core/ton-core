import { beginCell, Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Dictionary } from "./Dictionary";
import fs from 'fs';

function storeBits(builder: Builder, src: string) {
    for (let s of src) {
        if (s === '0') {
            builder.storeBit(0);
        } else {
            builder.storeBit(1);
        }
    }
    return builder;
}

describe('Dictionary', () => {
    it('should parse and serialize dict from example', () => {
        let root = storeBits(beginCell(), '11001000')
            .storeRef(storeBits(beginCell(), '011000')
                .storeRef(storeBits(beginCell(), '1010011010000000010101001'))
                .storeRef(storeBits(beginCell(), '1010000010000000100100001'))
            )
            .storeRef(storeBits(beginCell(), '1011111011111101111100100001'))
            .endCell();

        // Unpack
        let dict = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.Uint(16), root.beginParse());
        expect(dict.get(13n)).toBe(169n);
        expect(dict.get(17n)).toBe(289n);
        expect(dict.get(239n)).toBe(57121n);

        // Pack
        let builder = beginCell();
        dict.storeDirect(builder);
        let packed = builder.endCell();

        // Compare
        expect(packed.equals(root)).toBe(true);
    });

    it('should parse config', () => {
        let cell = Cell.fromBoc(Buffer.from(fs.readFileSync(__dirname + '/__testdata__/config.txt', 'utf-8'), 'base64'))[0];
        let configs = cell.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());
        let ids: number[] = [0, 1, 2, 4, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 28, 29, 31, 32, 34, 71, 72, -999, -71];
        let keys = configs.keys();
        for (let i of ids) {
            expect(keys).toContain(BigInt(i));
            expect(configs.get(BigInt(i))).not.toBeUndefined();
            expect(configs.has(BigInt(i))).toBe(true);
        }
    });

    it('should parse bridge config', () => {
        let cell = Cell.fromBoc(Buffer.from(fs.readFileSync(__dirname + '/__testdata__/config.txt', 'utf-8'), 'base64'))[0];
        let configs = cell.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());

        for (let i of [71n, 72n]) {
            let r = configs.get(i)!;
            let config = r.beginParse();
            let bridgeAddress = config.loadBuffer(32);
            let oracleMultisigAddress = config.loadBuffer(32);
            let oracles = config.loadDict(Dictionary.Keys.Uint(256), Dictionary.Values.Buffer(32));
            let externalChainAddress = config.loadBuffer(32);
            // console.warn(oracles);
        }
    });
});
import { beginCell, Builder } from "../boc/Builder";
import { Dictionary } from "./Dictionary";

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
});
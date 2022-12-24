import { BitBuilder } from "../BitBuilder";
import { BitString } from "../BitString";

export function bitsToPaddedBuffer(bits: BitString) {

    // Create builder
    let builder = new BitBuilder(Math.ceil(bits.length / 8) * 8);
    builder.writeBits(bits);

    // Apply padding
    let padding = Math.ceil(bits.length / 8) * 8 - bits.length;
    for (let i = 0; i < padding; i++) {
        if (i === 0) {
            builder.writeBit(1);
        } else {
            builder.writeBit(0);
        }
    }

    return builder.buffer();
}
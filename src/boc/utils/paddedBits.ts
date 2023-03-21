/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BitBuilder } from "../BitBuilder";
import { BitString } from "../BitString";

export function bitsToPaddedBuffer(bits: BitString) {
    let complete_byte_bits = Math.ceil(bits.length / 8) * 8;
    // Create builder
    let builder = new BitBuilder(complete_byte_bits);
    builder.writeBits(bits);

    // Apply padding
    let padding = complete_byte_bits - bits.length;
    for (let i = 0; i < padding; i++) {
        if (i === 0) {
            builder.writeBit(1);
        } else {
            builder.writeBit(0);
        }
    }

    return builder.buffer();
}

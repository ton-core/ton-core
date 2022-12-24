import { BitBuilder } from "./BitBuilder";
import { BitString } from "./BitString";

export class BitReader {

    private _bits: BitString;
    private _offset = 0;

    constructor(bits: BitString) {
        this._bits = bits;
    }

    readBit = (): boolean => {
        let r = this._bits.at(this._offset);
        this._offset++;
        return r;
    }

    skip(bits: number) {
        for (let i = 0; i < bits; i++) {
            this.readBit();
        }
    }

    readBits(bits: number) {
        let builder = new BitBuilder();
        for (let i = 0; i < bits; i++) {
            builder.writeBit(this.readBit());
        }
        return builder.build();
    }

    readUint(bits: number): bigint {
        if (bits == 0) {
            return 0n;
        }

        let res = 0n;
        for (let i = 0; i < bits; i++) {
            if (this.readBit()) {
                res += 1n << BigInt(bits - i - 1);
            }
        }
        return res;
    }

    readUintNumber(bits: number) {
        return Number(this.readUint(bits));
    }
}
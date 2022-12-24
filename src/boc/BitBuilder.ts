import { BitString } from "./BitString";

export class BitBuilder {
    private _buffer: Buffer;
    private _length: number;

    constructor(size: number = 1023) {
        this._buffer = Buffer.alloc(Math.ceil(size / 8));
        this._length = 0;
    }

    writeBit = (value: boolean | number) => {

        // Check overflow
        let n = this._length;
        if (n > this._buffer.length * 8) {
            throw new Error("BitBuilder overflow");
        }

        // Set bit
        if (value === true || value > 0) {
            this._buffer[(n / 8) | 0] |= 1 << (7 - (n % 8));
        }

        // Advance
        this._length++;
    }

    writeBits(src: BitString) {
        for (let i = 0; i < src.length; i++) {
            this.writeBit(src.at(i));
        }
    }

    build() {
        return new BitString(this._buffer, 0, this._length);
    }

    buffer() {
        if (this._length % 8 !== 0) {
            throw new Error("BitBuilder buffer is not byte aligned");
        }
        return this._buffer.subarray(0, this._length / 8);
    }
}
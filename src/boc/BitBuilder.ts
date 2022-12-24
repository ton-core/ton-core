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

    writeUint(value: bigint | number, bits: number) {

        // Check input
        let v = BigInt(value);
        let vBits = (1n << BigInt(bits));
        if (v < 0 || v >= vBits) {
            throw Error(`bitLength is too small for a value ${value}. Got ${bits}`);
        }

        // Convert number to bits
        let b: boolean[] = [];
        while (v > 0) {
            b.push(v % 2n === 1n);
            v /= 2n;
        }

        // Write bits
        for (let i = 0; i < bits; i++) {
            let off = bits - i - 1;
            if (off < b.length) {
                this.writeBit(b[off]);
            } else {
                this.writeBit(false);
            }
        }
    }

    writeInt(value: bigint | number, bits: number) {

        // Check input
        let v = BigInt(value);
        let vBits = 1n << (BigInt(bits) - 1n);
        if (v < -vBits || v >= vBits) {
            throw Error(`value is out of range for ${bits} bits. Got ${value}`);
        }

        // Write sign
        if (v < 0) {
            this.writeBit(true);
            v = -v;
        } else {
            this.writeBit(false);
        }

        // Write value
        this.writeUint(v, bits - 1);
    }

    writeBuffer(src: Buffer) {
        for (let i = 0; i < src.length; i++) {
            this.writeInt(src[i], 8);
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
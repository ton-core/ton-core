import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { BitBuilder } from "./BitBuilder";
import { BitString } from "./BitString";

/**
 * Class for reading bit strings
 */
export class BitReader {

    private _bits: BitString;
    private _offset = 0;

    constructor(bits: BitString) {
        this._bits = bits;
    }

    /**
     * Skip bits
     * @param bits number of bits to skip
     */
    skip(bits: number) {
        for (let i = 0; i < bits; i++) {
            this.loadBit();
        }
    }

    /**
     * Load a single bit
     * @returns true if the bit is set, false otherwise
     */
    loadBit(): boolean {
        let r = this._bits.at(this._offset);
        this._offset++;
        return r;
    }

    /**
     * Preload bit
     * @returns true if the bit is set, false otherwise
     */
    preloadBit() {
        return this._bits.at(this._offset);
    }

    /**
     * Load bit string
     * @param bits number of bits to read
     * @returns new bitstring
     */
    loadBits(bits: number) {
        let builder = new BitBuilder();
        for (let i = 0; i < bits; i++) {
            builder.writeBit(this.loadBit());
        }
        return builder.build();
    }

    /**
     * Preload bit string
     * @param bits number of bits to read
     * @returns new bitstring
     */
    preloadBits(bits: number) {
        let builder = new BitBuilder();
        for (let i = 0; i < bits; i++) {
            builder.writeBit(this._bits.at(this._offset + i));
        }
        return builder.build();
    }

    /**
     * Load buffer
     * @param bytes number of bytes
     * @returns new buffer
     */
    loadBuffer(bytes: number) {
        let buf = this._preloadBuffer(bytes, this._offset);
        this._offset += bytes * 8;
        return buf;
    }

    /**
     * Preload buffer
     * @param bytes number of bytes
     * @returns new buffer
     */
    preloadBuffer(bytes: number) {
        return this._preloadBuffer(bytes, this._offset);
    }

    /**
     * Load uint value
     * @param bits uint bits
     * @returns read value as bigint
     */
    loadUint(bits: number): bigint {
        let loaded = this.preloadUint(bits);
        this._offset += bits;
        return loaded;
    }

    /**
     * Preload uint value
     * @param bits uint bits
     * @returns read value as bigint
     */
    preloadUint(bits: number): bigint {
        return this._preloadUint(bits, this._offset);
    }

    /**
     * Load int value
     * @param bits int bits
     * @returns read value as bigint
     */
    loadInt(bits: number): bigint {
        let res = this._preloadInt(bits, this._offset);
        this._offset += bits;
        return res;
    }

    /**
     * Preload int value
     * @param bits int bits
     * @returns read value as bigint
     */
    preloadInt(bits: number): bigint {
        return this._preloadInt(bits, this._offset);
    }

    /**
     * Load varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarUint(bits: number): bigint {
        let size = Number(this.loadUint(bits));
        return this.loadUint(size * 8);
    }

    /**
     * Preload varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarUint(bits: number): bigint {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadUint(size * 8, this._offset + bits);
    }

    /**
     * Load varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarInt(bits: number): bigint {
        let size = Number(this.loadUint(bits));
        return this.loadInt(size * 8);
    }

    /**
     * Preload varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarInt(bits: number): bigint {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadInt(size * 8, this._offset + bits);
    }

    /**
     * Load coins value
     * @returns read value as bigint
     */
    loadCoins() {
        return this.loadVarUint(4);
    }

    /**
     * Preload coins value
     * @returns read value as bigint
     */
    preloadCoins() {
        return this.preloadVarUint(4);
    }

    /**
     * Load Address
     * @returns Address
     */
    loadAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 2) {
            return this._loadInternalAddress();
        } else {
            throw new Error("Invalid address");
        }
    }

    /**
     * Load internal address
     * @returns Address or null
     */
    loadMaybeAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        } else if (type === 2) {
            return this._loadInternalAddress();
        } else {
            throw new Error("Invalid address");
        }
    }

    /**
     * Load external address
     * @returns ExternalAddress
     */
    loadExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 1) {
            return this._loadExternalAddress();
        } else {
            throw new Error("Invalid address");
        }
    }

    /**
     * Load external address
     * @returns ExternalAddress or null
     */
    loadMaybeExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        } else if (type === 1) {
            return this._loadExternalAddress();
        } else {
            throw new Error("Invalid address");
        }
    }

    /**
     * Read address of any type
     * @returns Address or ExternalAddress or null
     */
    loadAddressAny() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        } else if (type === 2) {
            return this._loadInternalAddress();
        } else if (type === 1) {
            return this._loadExternalAddress();
        } else if (type === 3) {
            throw Error('Unsupported');
        } else {
            throw Error('Unreachable');
        }
    }

    /**
     * Preload int from specific offset
     * @param bits bits to preload
     * @param offset offset to start from
     * @returns read value as bigint
     */
    private _preloadInt(bits: number, offset: number): bigint {
        if (bits == 0) {
            return 0n;
        }
        let sign = this._bits.at(offset);
        let res = 0n;
        for (let i = 0; i < bits - 1; i++) {
            if (this._bits.at(offset + 1 + i)) {
                res += 1n << BigInt(bits - i - 1 - 1);
            }
        }
        if (sign) {
            res = res - (1n << BigInt(bits - 1));
        }
        return res;
    }

    /**
     * Preload uint from specific offset
     * @param bits bits to preload
     * @param offset offset to start from
     * @returns read value as bigint
     */
    private _preloadUint(bits: number, offset: number): bigint {
        if (bits == 0) {
            return 0n;
        }
        let res = 0n;
        for (let i = 0; i < bits; i++) {
            if (this._bits.at(offset + i)) {
                res += 1n << BigInt(bits - i - 1);
            }
        }
        return res;
    }

    private _preloadBuffer(bytes: number, offset: number): Buffer {
        let buf = Buffer.alloc(bytes);
        for (let i = 0; i < bytes; i++) {
            buf[i] = Number(this._preloadUint(8, offset + i * 8));
        }
        return buf;
    }

    private _loadInternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 2) {
            throw Error('Invalid address');
        }

        // No Anycast supported
        if (this._preloadUint(1, this._offset + 2) !== 0n) {
            throw Error('Invalid address');
        }

        // Read address
        let wc = Number(this._preloadInt(8, this._offset + 3));
        let hash = this._preloadBuffer(32, this._offset + 11);

        // Update offset
        this._offset += 267;

        return new Address(wc, hash);
    }

    private _loadExternalAddress() {

        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 1) {
            throw Error('Invalid address');
        }

        // Load length
        let l = this._preloadUint(9, this._offset + 2);

        // Load address
        let value = this._preloadUint(Number(l), this._offset + 9);

        // Update offset
        this._offset += 9 + Number(l);

        return new ExternalAddress(value);
    }
}
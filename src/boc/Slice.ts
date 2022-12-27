import { BitReader } from "./BitReader";
import { beginCell } from "./Builder";
import { Cell } from "./Cell";

/**
 * Slice is a class that allows to read cell data
 */
export class Slice {
    private _reader: BitReader;
    private _refs: Cell[];

    constructor(reader: BitReader, refs: Cell[]) {
        this._reader = reader;
        this._refs = refs;
    }

    /**
     * Get remaining bits
     */
    get remainingBits() {
        return this._reader.remaining;
    }

    /**
     * Get remaining refs
     */
    get remainingRefs() {
        return this._refs.length;
    }

    /**
     * Skip bits
     * @param bits 
     */
    skip(bits: number) {
        this._reader.skip(bits);
    }

    /**
     * Load a single bit
     * @returns true or false depending on the bit value
     */
    loadBit() {
        return this._reader.loadBit();
    }

    /**
     * Preload a signle bit
     * @returns true or false depending on the bit value
     */
    preloadBit() {
        return this._reader.preloadBit();
    }

    /**
     * Load bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    loadBits(bits: number) {
        return this._reader.loadBits(bits);
    }

    /**
     * Preload bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    preloadBits(bits: number) {
        return this._reader.preloadBits(bits);
    }

    /**
     * Load uint
     * @param bits number of bits to read 
     * @returns uint value
     */
    loadUint(bits: number) {
        return this._reader.loadUint(bits);
    }

    /**
     * Load uint
     * @param bits number of bits to read 
     * @returns uint value
     */
    loadUintBig(bits: number) {
        return this._reader.loadUintBig(bits);
    }

    /**
     * Preload uint
     * @param bits number of bits to read 
     * @returns uint value
     */
    preloadUint(bits: number) {
        return this._reader.preloadUint(bits);
    }

    /**
     * Preload uint
     * @param bits number of bits to read 
     * @returns uint value
     */
    preloadUintBig(bits: number) {
        return this._reader.preloadUintBig(bits);
    }

    /**
     * Load int
     * @param bits number of bits to read 
     * @returns int value
     */
    loadInt(bits: number) {
        return this._reader.loadInt(bits);
    }

    /**
     * Load int
     * @param bits number of bits to read 
     * @returns int value
     */
    loadIntBig(bits: number) {
        return this._reader.loadIntBig(bits);
    }

    /**
     * Preload int
     * @param bits number of bits to read 
     * @returns int value
     */
    preloadInt(bits: number) {
        return this._reader.preloadInt(bits);
    }

    /**
     * Preload int
     * @param bits number of bits to read 
     * @returns int value
     */
    preloadIntBig(bits: number) {
        return this._reader.preloadIntBig(bits);
    }

    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUint(bits: number) {
        return this._reader.loadVarUint(bits);
    }

    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUintBig(bits: number) {
        return this._reader.loadVarUintBig(bits);
    }

    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUint(bits: number) {
        return this._reader.preloadVarUint(bits);
    }

    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUintBig(bits: number) {
        return this._reader.preloadVarUintBig(bits);
    }

    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarInt(bits: number) {
        return this._reader.loadVarInt(bits);
    }


    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarIntBig(bits: number) {
        return this._reader.loadVarIntBig(bits);
    }

    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarInt(bits: number) {
        return this._reader.preloadVarInt(bits);
    }

    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarIntBig(bits: number) {
        return this._reader.preloadVarIntBig(bits);
    }

    /**
     * Load coins
     * @returns coins value
     */
    loadCoins() {
        return this._reader.loadCoins();
    }

    /**
     * Preload coins
     * @returns coins value
     */
    preloadCoins() {
        return this._reader.preloadCoins();
    }

    /**
     * Load internal Address
     * @returns Address
     */
    loadAddress() {
        return this._reader.loadAddress();
    }

    /**
     * Load optional internal Address
     * @returns Address or null
     */
    loadMaybeAddress() {
        return this._reader.loadMaybeAddress();
    }

    /**
     * Load external address
     * @returns ExternalAddress
     */
    loadExternalAddress() {
        return this._reader.loadExternalAddress();
    }

    /**
     * Load optional external address
     * @returns ExternalAddress or null
     */
    loadMaybeExternalAddress() {
        return this._reader.loadMaybeExternalAddress();
    }

    /**
     * Load address
     * @returns Address, ExternalAddress or null
     */
    loadAddressAny() {
        return this._reader.loadAddressAny();
    }

    /**
     * Load reference
     * @returns Cell
     */
    loadRef() {
        if (this._refs.length === 0) {
            throw new Error("No more references");
        }
        return this._refs.shift()!!;
    }

    /**
     * Preload reference
     * @returns Cell
     */
    preloadRef() {
        if (this._refs.length === 0) {
            throw new Error("No more references");
        }
        return this._refs[0];
    }

    /**
     * Load optional reference
     * @returns Cell or null
     */
    loadMaybeRef() {
        if (this.loadBit()) {
            return this.loadRef();
        } else {
            return null;
        }
    }

    /**
     * Preload optional reference
     * @returns Cell or null
     */
    preloadMaybeRef() {
        if (this.preloadBit()) {
            return this.preloadRef();
        } else {
            return null;
        }
    }

    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    loadBuffer(bytes: number) {
        return this._reader.loadBuffer(bytes);
    }

    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    preloadBuffer(bytes: number) {
        return this._reader.preloadBuffer(bytes);
    }

    /**
     * Convert slice to cell
     */
    asCell() {
        return beginCell().storeSlice(this).endCell();
    }

    /**
     * 
     * @returns 
     */
    asBuilder() {
        return beginCell().storeSlice(this);
    }

    /**
     * Clone slice
     * @returns cloned slice
     */
    clone() {
        return new Slice(this._reader.clone(), [...this._refs]);
    }
}
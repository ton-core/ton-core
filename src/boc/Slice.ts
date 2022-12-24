import { BitReader } from "./BitReader";
import { Cell } from "./Cell";

/**
 * Slice is a class that allows to read cell data
 */
export class Slice {
    private _reader: BitReader;
    private _refs: Cell[];

    constructor(cell: Cell) {
        this._reader = new BitReader(cell.bits);
        this._refs = [...cell.refs];
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
     * Preload uint
     * @param bits number of bits to read 
     * @returns uint value
     */
    preloadUint(bits: number) {
        return this._reader.preloadUint(bits);
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
     * Preload int
     * @param bits number of bits to read 
     * @returns int value
     */
    preloadInt(bits: number) {
        return this._reader.preloadInt(bits);
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
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUint(bits: number) {
        return this._reader.preloadVarUint(bits);
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
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarInt(bits: number) {
        return this._reader.preloadVarInt(bits);
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
    loadMaybeCell() {
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
    preloadMaybeCell() {
        if (this.preloadBit()) {
            return this.preloadRef();
        } else {
            return null;
        }
    }
}
import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { BitBuilder } from "./BitBuilder";
import { BitString } from "./BitString";
import { Cell } from "./Cell";

/**
 * Start building a cell
 * @returns a new builder
 */
export function beginCell() {
    return new Builder();
}

/**
 * Builder for Cells
 */
export class Builder {
    private _bits: BitBuilder;
    private _refs: Cell[];

    constructor() {
        this._bits = new BitBuilder();
        this._refs = [];
    }

    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     * @returns this builder
     */
    storeBit(value: boolean | number) {
        this._bits.writeBit(value);
        return this;
    }

    /**
     * Write bits from BitString
     * @param src source bits
     * @returns this builder
     */
    storeBits(src: BitString) {
        this._bits.writeBits(src);
        return this;
    }

    /**
     * Store Buffer
     * @param src source buffer
     * @returns this builder
     */
    storeBuffer(src: Buffer) {
        this._bits.writeBuffer(src);
        return this;
    }

    /**
     * Store uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeUint(value: bigint | number, bits: number) {
        this._bits.writeUint(value, bits);
        return this;
    }

    /**
     * Store int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeInt(value: bigint | number, bits: number) {
        this._bits.writeInt(value, bits);
        return this;
    }

    /**
     * Store varuint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarUint(value: number | bigint, bits: number) {
        this._bits.writeVarUint(value, bits);
        return this;
    }

    /**
     * Store varint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarInt(value: number | bigint, bits: number) {
        this._bits.writeVarInt(value, bits);
        return this;
    }

    /**
     * Store coins value
     * @param amount amount of coins
     * @returns this builder
     */
    storeCoins(amount: number | bigint) {
        this._bits.writeCoins(amount);
        return this;
    }

    /**
     * Store address
     * @param addres address to store 
     * @returns this builder
     */
    storeAddress(address: Address | ExternalAddress | null) {
        this._bits.writeAddress(address);
        return this;
    }

    /**
     * Store reference
     * @param cell cell or builder to store
     */
    storeRef(cell: Cell | Builder) {

        // Check refs
        if (this._refs.length >= 4) {
            throw new Error("Too many references");
        }

        // Store reference
        if (cell instanceof Cell) {
            this._refs.push(cell);
        } else if (cell instanceof Builder) {
            this._refs.push(cell.endCell());
        } else {
            throw new Error("Invalid argument");
        }
    }

    /**
     * Store reference if not null
     * @param cell cell or builder to store
     */
    storeMaybeRef(cell: Cell | Builder | null) {
        if (cell) {
            this.storeBit(1);
            this.storeRef(cell);
        } else {
            this.storeBit(0);
        }
    }

    /**
     * Complete cell
     * @returns cell
     */
    endCell() {
        return new Cell({
            bits: this._bits.build(),
            refs: this._refs
        });
    }
}
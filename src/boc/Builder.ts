import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { BitBuilder } from "./BitBuilder";
import { BitString } from "./BitString";
import { Writable } from "./Writable";
import { Cell } from "./Cell";
import { Slice } from "./Slice";
import { writeString } from "./utils/strings";

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
     * Bits written so far
     */
    get bits() {
        return this._bits.length;
    }

    /**
     * References written so far
     */
    get refs() {
        return this._refs.length;
    }

    /**
     * Available bits
     */
    get availableBits() {
        return 1023 - this.bits;
    }

    /**
     * Available references
     */
    get availableRefs() {
        return 4 - this.refs;
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
     * @returns this builder
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

        return this;
    }

    /**
     * Store reference if not null
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeMaybeRef(cell: Cell | Builder | null) {
        if (cell) {
            this.storeBit(1);
            this.storeRef(cell);
        } else {
            this.storeBit(0);
        }

        return this;
    }

    /**
     * Store slice it in this builder
     * @param src source slice
     */
    storeSlice(src: Slice) {
        let c = src.clone();
        if (c.remainingBits > 0) {
            this.storeBits(c.loadBits(c.remainingBits));
        }
        while (c.remainingRefs > 0) {
            this.storeRef(c.loadRef());
        }
        return this;
    }

    /**
     * Store slice in this builder if not null
     * @param src source slice
     */
    storeMaybeSlice(src: Slice | null) {
        if (src) {
            this.storeBit(1);
            this.storeSlice(src);
        } else {
            this.storeBit(0);
        }
        return this;
    }

    /**
     * Store builder
     * @param src builder to store
     * @returns this builder
     */
    storeBuilder(src: Builder) {
        return this.storeSlice(src.endCell().beginParse());
    }

    /**
     * Store builder if not null
     * @param src builder to store
     * @returns this builder
     */
    storeMaybeBuilder(src: Builder | null) {
        if (src) {
            this.storeBit(1);
            this.storeBuilder(src);
        } else {
            this.storeBit(0);
        }
        return this;
    }

    /**
     * Store writer or builder
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeWritable(writer: ((builder: Builder) => void) | Writable) {
        if (typeof writer === 'object') {
            writer.writeTo(this);
        } else {
            writer(this);
        }
        return this;
    }

    /**
     * Store writer or builder if not null
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeMaybeWritable(writer: ((builder: Builder) => void) | Writable | null) {
        if (writer) {
            this.storeBit(1);
            this.storeWritable(writer);
        } else {
            this.storeBit(0);
        }
        return this;
    }

    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeStringTail(src: string) {
        writeString(src, this);
        return this;
    }

    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringTail(src: string | null) {
        if (src !== null) {
            this.storeBit(1);
            writeString(src, this);
        } else {
            this.storeBit(0);
        }
        return this;
    }

    /**
     * Store string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeStringRefTail(src: string) {
        this.storeRef(beginCell()
            .storeStringTail(src));
        return this;
    }

    /**
     * Store maybe string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringRefTail(src: string | null) {
        if (src !== null) {
            this.storeBit(1);
            this.storeStringRefTail(src);
        } else {
            this.storeBit(0);
        }
        return this;
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

    /**
     * Convert to cell
     * @returns cell
     */
    asCell() {
        return this.endCell();
    }

    /**
     * Convert to slice
     * @returns slice
     */
    asSlice() {
        return this.endCell().beginParse();
    }
}
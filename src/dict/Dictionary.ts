import { Address } from "../address/Address";
import { beginCell, Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { parseDict } from "./parseDict";
import { serializeDict } from "./serializeDict";

export type DictionaryKey<K> = {
    bits: number;
    serialize(src: K): bigint;
    parse(src: bigint): K;
}

export type DictionaryValue<V> = {
    serialize(src: V, builder: Builder): void;
    parse(src: Slice): V;
}


export class Dictionary<K, V> {
    static Keys = {

        /**
         * Standard address key
         * @returns DictionaryKey<Address> 
         */
        Address: () => {
            return createAddressKey();
        },

        /**
         * Create standard integer key
         * @param bits number of bits. Default is 257.
         * @returns DictionaryKey<bigint>
         */
        Int: (bits?: number | null | undefined) => {
            return createIntKey(bits);
        },

        /**
         * Create standard unsigned integer key
         * @param bits number of bits. Default is 256.
         * @returns DictionaryKey<bigint>
         */
        Uint: (bits?: number | null | undefined) => {
            return createUintKey(bits);
        },

        /**
         * Create standard buffer key
         * @param bytes number of bytes of a buffer
         * @returns DictionaryKey<Buffer>
         */
        Buffer: (bytes: number) => {
            return createBufferKey(bytes);
        }
    }

    static Values = {
        /**
         * Create standard integer value
         * @param bits number of bits. Default is 257.
         * @returns DictionaryValue<bigint>
         */
        Int: (bits?: number | null | undefined) => {
            return createIntValue(bits);
        },

        /**
         * Create standard unsigned integer value
         * @param bits number of bits. Default is 256.
         * @returns DictionaryValue<bigint>
         */
        Uint: (bits?: number | null | undefined) => {
            return createUintValue(bits);
        },

        /**
         * Create standard boolean value
         * @returns DictionaryValue<boolean>
         */
        Bool: () => {
            return createBooleanValue();
        },

        /**
         * Create standard address value
         * @returns DictionaryValue<Address>
         */
        Address: () => {
            return createAddressValue();
        },

        /**
         * Create standard cell value
         * @returns DictionaryValue<Cell>
         */
        Cell: () => {
            return createCellValue();
        },

        /**
         * Create Builder value
         * @param bytes number of bytes of a buffer
         * @returns DictionaryValue<Builder>
         */
        Buffer: (bytes: number) => {
            return createBufferValue(bytes);
        },

        /**
         * Create dictionary value
         * @param key 
         * @param value 
         */
        Dictionary: <K, V>(key: DictionaryKey<K>, value: DictionaryValue<V>) => {
            return createDictionaryValue(key, value);
        }
    };

    /**
     * Create an empty map
     * @param key key type
     * @param value value type
     * @returns Dictionary<K, V>
     */
    static empty<K, V>(key: DictionaryKey<K>, value: DictionaryValue<V>): Dictionary<K, V> {
        return new Dictionary<K, V>(key, value, new Map());
    }

    /**
     * Load dictionary from slice
     * @param key key description
     * @param value value description
     * @param src slice
     * @returns Dictionary<K, V>
     */
    static load<K, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice): Dictionary<K, V> {
        let cell = sc.loadMaybeRef();
        if (cell) {
            return Dictionary.loadDirect<K, V>(key, value, cell.beginParse());
        } else {
            return Dictionary.empty<K, V>(key, value);
        }
    }

    /**
     * Low level method for rare dictionaries from system contracts. 
     * Loads dictionary from slice directly without going to the ref.
     * 
     * @param key key description
     * @param value value description
     * @param sc slice
     * @returns Dictionary<K, V>
     */
    static loadDirect<K, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice): Dictionary<K, V> {
        let values = parseDict(sc, key.bits, value.parse);
        return new Dictionary(key, value, values);
    }

    private readonly _key: DictionaryKey<K>;
    private readonly _value: DictionaryValue<V>;
    private readonly _map: Map<bigint, V>;

    private constructor(key: DictionaryKey<K>, value: DictionaryValue<V>, values: Map<bigint, V>) {
        this._key = key;
        this._value = value;
        this._map = values;
    }

    get size() {
        return this._map.size;
    }

    get(key: K): V | undefined {
        return this._map.get(this._key.serialize(key));
    }

    has(key: K): boolean {
        return this._map.has(this._key.serialize(key));
    }

    set(key: K, value: V): this {
        this._map.set(this._key.serialize(key), value)
        return this;
    }

    delete(key: K) {
        const k = this._key.serialize(key);
        return this._map.delete(k)
    }

    clear() {
        this._map.clear();
    }

    *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const [k, v] of this._map) {
            const key = this._key.parse(k);
            yield [key, v]
        }
    }

    keys() {
        return Array.from(this._map.keys()).map((v) => this._key.parse(v));
    }

    values() {
        return Array.from(this._map.values());
    }

    store(builder: Builder) {
        if (this._map.size === 0) {
            builder.storeBit(0);
        } else {
            builder.storeBit(1);
            let dd = beginCell();
            serializeDict(this._map, this._key.bits, this._value.serialize, dd);
            builder.storeRef(dd.endCell());
        }
    }

    storeDirect(builder: Builder) {
        if (this._map.size === 0) {
            throw Error('Cannot store empty dictionary directly');
        }
        serializeDict(this._map, this._key.bits, this._value.serialize, builder);
    }
}

//
// Keys and Values
//

function createAddressKey(): DictionaryKey<Address> {
    return {
        bits: 267,
        serialize: (src) => {
            return beginCell().storeAddress(src).endCell().beginParse().preloadUintBig(267);
        },
        parse: (src) => {
            return beginCell().storeUint(src, 267).endCell().beginParse().loadAddress();
        }
    }
}

function createIntKey(bits: number | null | undefined): DictionaryKey<bigint> {
    const bt = (bits === null || bits === undefined) ? 257 : bits;
    return {
        bits: bt,
        serialize: (src) => {
            return beginCell().storeInt(src, bt).endCell().beginParse().loadUintBig(bt);
        },
        parse: (src) => {
            return beginCell().storeUint(src, bt).endCell().beginParse().loadIntBig(bt);
        }
    }
}

function createUintKey(bits: number | null | undefined): DictionaryKey<bigint> {
    const bt = (bits === null || bits === undefined) ? 256 : bits;
    return {
        bits: bt,
        serialize: (src) => {
            return beginCell().storeUint(src, bt).endCell().beginParse().loadUintBig(bt);
        },
        parse: (src) => {
            return beginCell().storeUint(src, bt).endCell().beginParse().loadUintBig(bt);
        }
    }
}

function createBufferKey(bytes: number): DictionaryKey<Buffer> {
    return {
        bits: bytes * 8,
        serialize: (src) => {
            return beginCell().storeBuffer(src).endCell().beginParse().loadUintBig(bytes * 8);
        },
        parse: (src) => {
            return beginCell().storeUint(src, bytes * 8).endCell().beginParse().loadBuffer(bytes);
        }
    }
}

function createIntValue(bits: number | null | undefined): DictionaryValue<bigint> {
    const bt = (bits === null || bits === undefined) ? 257 : bits;
    return {
        serialize: (src, buidler) => {
            buidler.storeInt(src, bt);
        },
        parse: (src) => {
            return src.loadIntBig(bt);
        }
    }
}

function createUintValue(bits: number | null | undefined): DictionaryValue<bigint> {
    const bt = (bits === null || bits === undefined) ? 256 : bits;
    return {
        serialize: (src, buidler) => {
            buidler.storeUint(src, bt);
        },
        parse: (src) => {
            return src.loadUintBig(bt);
        }
    }
}

function createBooleanValue(): DictionaryValue<boolean> {
    return {
        serialize: (src, buidler) => {
            buidler.storeBit(src);
        },
        parse: (src) => {
            return src.loadBit();
        }
    }
}

function createAddressValue(): DictionaryValue<Address> {
    return {
        serialize: (src, buidler) => {
            buidler.storeAddress(src);
        },
        parse: (src) => {
            return src.loadAddress();
        }
    }
}

function createCellValue(): DictionaryValue<Cell> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(src);
        },
        parse: (src) => {
            return src.loadRef();
        }
    }
}

function createDictionaryValue<K, V>(key: DictionaryKey<K>, value: DictionaryValue<V>): DictionaryValue<Dictionary<K, V>> {
    return {
        serialize: (src, buidler) => {
            src.store(buidler);
        },
        parse: (src) => {
            return Dictionary.load(key, value, src);
        }
    }
}

function createBufferValue(size: number): DictionaryValue<Buffer> {
    return {
        serialize: (src, buidler) => {
            if (src.length !== size) {
                throw Error('Invalid buffer size');
            }
            buidler.storeBuffer(src);
        },
        parse: (src) => {
            return src.loadBuffer(size);
        }
    }
}
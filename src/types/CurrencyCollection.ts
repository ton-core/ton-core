import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { Dictionary } from "../dict/Dictionary";

// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L120
// extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
//  = ExtraCurrencyCollection;
//  currencies$_ grams:Grams other:ExtraCurrencyCollection 
//            = CurrencyCollection;

export type CurrencyCollection = { extraCurrencies: Dictionary<number, bigint>, coins: bigint };

export function loadCurrencyCollection(slice: Slice): CurrencyCollection {
    const coins = slice.loadCoins();
    const extraCurrencies = slice.loadDict(Dictionary.Keys.Uint(32), Dictionary.Values.BigVarUint(5 /* log2(32) */));
    return { extraCurrencies, coins };
}

export function storeCurrencyCollection(collection: CurrencyCollection) {
    return (builder: Builder) => {
        builder.storeCoins(collection.coins);
        builder.storeDict(collection.extraCurrencies);
    }
}
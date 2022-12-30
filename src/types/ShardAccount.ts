import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { Maybe } from "../utils/maybe";
import { Account, loadAccount, storeAccount } from "./Account";

// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L256
// account_descr$_ account:^Account last_trans_hash:bits256 
//  last_trans_lt:uint64 = ShardAccount;

export type ShardAccount = {
    account?: Maybe<Account>;
    lastTransactionHash: bigint;
    lastTransactionLt: bigint;
};

export function loadShardAccount(slice: Slice): ShardAccount {
    let accSc = slice.loadRef().beginParse();
    return {
        account: accSc.loadBit() ? loadAccount(accSc) : undefined,
        lastTransactionHash: slice.loadUintBig(256),
        lastTransactionLt: slice.loadUintBig(64)
    };
}

export function storeShardAccount(src: ShardAccount) {
    return (builder: Builder) => {
        if (src.account) {
            builder.storeBit(true);
            builder.store(storeAccount(src.account));
        } else {
            builder.storeBit(false);
        }
        builder.storeUint(src.lastTransactionHash, 256);
        builder.storeUint(src.lastTransactionLt, 64);
    };
}
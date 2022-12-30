import { Account } from "./Account";

// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L256
// account_descr$_ account:^Account last_trans_hash:bits256 
//  last_trans_lt:uint64 = ShardAccount;
export type ShardAccount = {
    account: Account;
    lastTransactionHash: Buffer;
    lastTransactionLt: bigint;
};
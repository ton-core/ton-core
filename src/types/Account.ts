// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L231
// account_none$0 = Account;
// account$1 addr:MsgAddressInt storage_stat:StorageInfo storage:AccountStorage = Account;

import { Address } from "../address/Address"
import { AccountStorage } from "./AccountStorage"
import { StorageInfo } from "./StorageInto"

export type Account = {
    addr: Address,
    storageStats: StorageInfo,
    storage: AccountStorage
}
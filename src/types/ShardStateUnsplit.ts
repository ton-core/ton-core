// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L396
// shard_state#9023afe2 global_id:int32
//  shard_id:ShardIdent 
//  seq_no:uint32 vert_seq_no:#
//  gen_utime:uint32 gen_lt:uint64
//  min_ref_mc_seqno:uint32
//  out_msg_queue_info:^OutMsgQueueInfo
//  before_split:(## 1)
//  accounts:^ShardAccounts
//  ^[ overload_history:uint64 underload_history:uint64
//  total_balance:CurrencyCollection
//  total_validator_fees:CurrencyCollection
//  libraries:(HashmapE 256 LibDescr)
//  master_ref:(Maybe BlkMasterInfo) ]
//  custom:(Maybe ^McStateExtra)
//  = ShardStateUnsplit;

import { ShardIdent } from "./ShardIdent"

export type ShardStateUnsplit = {
    globalId: number,
    shardId: ShardIdent,
    seqno: number,
    vertSeqNo: number,
    genUtime: number,
    genLt: bigint,
    minRefMcSeqno: number,
    beforeSplit: boolean,
    accounts: Map<string, RawShardAccountRef>,
    extras: RawMasterChainStateExtra | null
}

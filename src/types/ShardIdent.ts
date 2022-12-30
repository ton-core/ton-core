// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L384
// shard_ident$00 shard_pfx_bits:(#<= 60) 
//  workchain_id:int32 shard_prefix:uint64 = ShardIdent;
export type ShardIdent = {
    shardPrefixBits: number,
    workchainId: number,
    shardPrefix: bigint
}
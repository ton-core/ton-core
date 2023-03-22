/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { CellType } from "../boc/CellType";
import { Slice } from "../boc/Slice";
import { Dictionary, DictionaryValue } from "../dict/Dictionary";
import { CurrencyCollection, loadCurrencyCollection } from "./CurrencyCollection";

// Source: https://github.com/ton-foundation/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L509
// _ config_addr:bits256 config:^(Hashmap 32 ^Cell) 
//  = ConfigParams;
// Source: https://github.com/ton-foundation/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L534
// masterchain_state_extra#cc26
//  shard_hashes:ShardHashes
//  config:ConfigParams
//  ^[ flags:(## 16) { flags <= 1 }
//     validator_info:ValidatorInfo
//     prev_blocks:OldMcBlocksInfo
//     after_key_block:Bool
//     last_key_block:(Maybe ExtBlkRef)
//     block_create_stats:(flags . 0)?BlockCreateStats ]
//  global_balance:CurrencyCollection
// = McStateExtra;

export type MasterchainStateExtra = {
    configAddress: bigint;
    config: Dictionary<number, Cell>;
    globalBalance: CurrencyCollection;
    prev_blocks?: Dictionary<number, OldMcBlocks>;
};

export function loadMasterchainStateExtra(cs: Slice): MasterchainStateExtra {

    // Check magic
    if (cs.loadUint(16) !== 0xcc26) {
        throw Error('Invalid data');
    }

    // Skip shard_hashes
    if (cs.loadBit()) {
        cs.loadRef();
    }

    // Read config
    let configAddress = cs.loadUintBig(256);
    let config = Dictionary.load(Dictionary.Keys.Int(32), Dictionary.Values.Cell(), cs);

    // Read prev_blocks partially
    let prev_blocks: Dictionary<number, OldMcBlocks> | undefined = undefined;
    const refCell = cs.loadRef();
    if (refCell.type === CellType.Ordinary) {
        const slice = refCell.beginParse();
        const flags = slice.loadUint(16);
        if (flags > 1) {
        throw Error("flags > 1");
        }

        // skip some data
        const validator_info = loadValidatorInfo(slice);
        prev_blocks = loadOldMcBlocksInfo(slice);
        const after_key_block = slice.loadBoolean();
        // data.last_key_block = loadMaybe(cell_r1, tr1, loadExtBlkRef);
        // if (data.flags & 1)
        //   data.block_create_stats = loadBlockCreateStats(cell_r1, tr1);
    }

    // Rad global balance
    const globalBalance = loadCurrencyCollection(cs);

    return {
        config,
        configAddress,
        globalBalance,
        prev_blocks
    };
}

function loadValidatorInfo(cs: Slice) {
    const validator_list_hash_short = cs.loadUint(32);
    const catchain_seqno = cs.loadUint(32);
    const nx_cc_updated = cs.loadBoolean();
  
    return { validator_list_hash_short, catchain_seqno, nx_cc_updated };
  }
  
  export interface ExtBlkRef {
    end_lt: number;
    seq_no: number;
    root_hash: string;
    file_hash: string;
  }
  
  // duplicate of function in example
  function loadExtBlkRef(slice: Slice): ExtBlkRef {
    return {
      end_lt: slice.loadUint(64),
      seq_no: slice.loadUint(32),
      root_hash: slice.loadBuffer(32).toString('hex'),
      file_hash: slice.loadBuffer(32).toString('hex'),
    };
  }
  
  function loadKeyExtBlkRef(slice: Slice) {
    const key = slice.loadBoolean();
    const blk_ref = loadExtBlkRef(slice);
    return { key, blk_ref };
  }
  
  function loadKeyMaxLt(slice: Slice) {
    const key = slice.loadBoolean();
    const max_end_lt = slice.loadUint(64);
    return {
      key,
      max_end_lt,
    };
  }
  
  interface OldMcBlocks {
    extra: ReturnType<typeof loadKeyMaxLt>;
    value: ReturnType<typeof loadKeyExtBlkRef>;
  }
  
  export function loadOldMcBlocks(slice: Slice): OldMcBlocks {
    return {
      extra: loadKeyMaxLt(slice),
      value: loadKeyExtBlkRef(slice),
    };
  }
  
  export function storeOldMcBlocks(src: OldMcBlocks) {
    return (builder: Builder) => {
      // builder.storeBit(src.public);
      // builder.storeRef(src.root);
    };
  }
  
  export const OldMcBlocksValue: DictionaryValue<OldMcBlocks> = {
    serialize(src, builder) {
      storeOldMcBlocks(src)(builder);
    },
    parse(src) {
      return loadOldMcBlocks(src);
    },
  };
  
  function loadOldMcBlocksInfo(slice: Slice) {
    return slice.loadDict(Dictionary.Keys.Uint(32), OldMcBlocksValue);
  }
  
import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { CurrencyCollection, loadCurrencyCollection, storeCurrencyCollection } from "./CurrencyCollection";


// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123
// int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
//  src:MsgAddressInt dest:MsgAddressInt 
//  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
//  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
// ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt 
//  import_fee:Grams = CommonMsgInfo;
// ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
//  created_lt:uint64 created_at:uint32 = CommonMsgInfo;

export type CommonMessageInfo =
    | CommonMessageInfoInternal
    | CommonMessageInfoExternalOut
    | CommonMessageInfoExternalIn;

export type CommonMessageInfoInternal = {
    type: 'internal',
    ihrDisabled: boolean,
    bounce: boolean,
    bounced: boolean,
    src: Address,
    dest: Address,
    value: CurrencyCollection,
    ihrFee: bigint,
    fwdFee: bigint,
    createdLt: bigint,
    createdAt: number
};

export type CommonMessageInfoExternalIn = {
    type: 'external-in',
    src: ExternalAddress | null,
    dest: Address,
    importFee: bigint
};

export type CommonMessageInfoExternalOut = {
    type: 'external-out',
    src: Address,
    dest: ExternalAddress | null,
    createdLt: bigint,
    createdAt: number
};

export function loadCommonMessageInfo(slice: Slice): CommonMessageInfo {

    // Internal message
    if (!slice.loadBit()) {

        const ihrDisabled = slice.loadBit();
        const bounce = slice.loadBit();
        const bounced = slice.loadBit();
        const src = slice.loadAddress();
        const dest = slice.loadAddress();
        const value = loadCurrencyCollection(slice);
        const ihrFee = slice.loadCoins();
        const fwdFee = slice.loadCoins();
        const createdLt = slice.loadUintBig(64);
        const createdAt = slice.loadUint(32);

        return {
            type: 'internal',
            ihrDisabled,
            bounce,
            bounced,
            src,
            dest,
            value,
            ihrFee,
            fwdFee,
            createdLt,
            createdAt,
        };
    }

    // External In mesage
    if (!slice.loadBit()) {
        const src = slice.loadMaybeExternalAddress();
        const dest = slice.loadAddress()!;
        const importFee = slice.loadCoins();

        return {
            type: 'external-in',
            src,
            dest,
            importFee,
        };
    }

    // External Out message
    const src = slice.loadAddress()!;
    const dest = slice.loadMaybeExternalAddress();
    const createdLt = slice.loadUintBig(64);
    const createdAt = slice.loadUint(32);

    return {
        type: 'external-out',
        src,
        dest,
        createdLt,
        createdAt,
    };
}

export function storeCommonMessageInfo(source: CommonMessageInfo) {
    return (builder: Builder) => {
        if (source.type === 'internal') {
            builder.storeBit(0);
            builder.storeBit(source.ihrDisabled);
            builder.storeBit(source.bounce);
            builder.storeBit(source.bounced);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.store(storeCurrencyCollection(source.value));
            builder.storeCoins(source.ihrFee);
            builder.storeCoins(source.fwdFee);
            builder.storeUint(source.createdLt, 64);
            builder.storeUint(source.createdAt, 32);
        } else if (source.type === 'external-in') {
            builder.storeBit(1);
            builder.storeBit(0);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.storeCoins(source.importFee);
        } else if (source.type === 'external-out') {
            builder.storeBit(1);
            builder.storeBit(1);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.storeUint(source.createdLt, 64);
            builder.storeUint(source.createdAt, 32);
        } else {
            throw new Error('Unknown CommonMessageInfo type');
        }
    }
}
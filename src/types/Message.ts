import { beginCell, Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { DictionaryValue } from "../dict/Dictionary";
import { Maybe } from "../utils/maybe";
import { CommonMessageInfo, loadCommonMessageInfo, storeCommonMessageInfo } from "./CommonMessageInfo";
import { loadStateInit, StateInit, storeStateInit } from "./StateInit";

// Source: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L147
// message$_ {X:Type} info:CommonMsgInfo
//  init:(Maybe (Either StateInit ^StateInit))
//  body:(Either X ^X) = Message X;

export type Message = {
    info: CommonMessageInfo,
    init?: Maybe<StateInit>,
    body: Cell
};

export function loadMessage(slice: Slice): Message {
    const info = loadCommonMessageInfo(slice);
    let init: StateInit | null = null;
    if (slice.loadBit()) {
        if (!slice.loadBit()) {
            init = loadStateInit(slice);
        } else {
            init = loadStateInit(slice.loadRef().beginParse());
        }
    }
    const body = slice.loadBit() ? slice.loadRef() : slice.asCell();

    return {
        info,
        init,
        body
    };
}

export function storeMessage(message: Message, opts?: { forceRef?: boolean }) {
    return (builder: Builder) => {

        // Store CommonMsgInfo
        builder.store(storeCommonMessageInfo(message.info));

        // Store init
        if (message.init) {
            builder.storeBit(true);
            let initCell = beginCell().store(storeStateInit(message.init));
            if (builder.availableBits - 2 /* At least on byte for body */ >= initCell.bits) {
                builder.storeBit(false);
                builder.storeBuilder(initCell);
            } else {
                builder.storeBit(true);
                builder.storeRef(initCell);
            }
        } else {
            builder.storeBit(false);
        }

        // Store body
        let needRef = false;
        if (opts && opts.forceRef) {
            needRef = true;
        } else {
            if (builder.availableBits - 1 /* At least on byte for body */ >= message.body.bits.length) {
                needRef = false;
            } else {
                needRef = true;
            }
        }
        if (needRef) {
            builder.storeBit(true);
            builder.storeRef(message.body);
        } else {
            builder.storeBit(false);
            builder.storeBuilder(message.body.asBuilder());
        }
    };
}

export const MessageValue: DictionaryValue<Message> = {
    serialize(src, builder) {
        builder.storeRef(beginCell()
            .store(storeMessage(src)));
    },
    parse(slice) {
        return loadMessage(slice.loadRef().beginParse());
    }
}
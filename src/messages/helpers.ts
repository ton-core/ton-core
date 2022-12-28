import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { Maybe } from "../utils/maybe";
import { CellMessage } from "./CellMessage";
import { CommonMessageInfo } from "./CommonMessageInfo";
import { EmptyMessage } from "./EmptyMessage";
import { InternalMessage } from "./InternalMessage";
import { ExternalMessage } from './ExternalMessage';
import { StateInit } from "./StateInit";
import { CommentMessage } from "./CommentMessage";
import { beginCell } from "../boc/Builder";

export function internal(src: {
    to: Address | string,
    amount: bigint,
    bounce?: Maybe<boolean>,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Cell
}) {

    // Resolve bounce
    let bounce = true;
    if (src.bounce !== null && src.bounce !== undefined) {
        bounce = src.bounce;
    }

    // Resolve address
    let to: Address;
    if (typeof src.to === 'string') {
        to = Address.parse(src.to);
    } else if (Address.isAddress(src.to)) {
        to = src.to;
    } else {
        throw new Error(`Invalid address ${src.to}`);
    }

    // Create message
    return new InternalMessage({
        to: to,
        value: src.amount,
        bounce: src.bounce || false,
        body: new CommonMessageInfo({
            stateInit: src.init ? new StateInit(src.init) : null,
            body: src.body ? new CellMessage(src.body) : new EmptyMessage()
        })
    });
}

export function external(src: {
    to: Address | string,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Cell
}) {

    // Resolve address
    let to: Address;
    if (typeof src.to === 'string') {
        to = Address.parse(src.to);
    } else if (Address.isAddress(src.to)) {
        to = src.to;
    } else {
        throw new Error(`Invalid address ${src.to}`);
    }

    return new ExternalMessage({
        to: to,
        body: new CommonMessageInfo({
            stateInit: src.init ? new StateInit(src.init) : null,
            body: src.body ? new CellMessage(src.body) : new EmptyMessage()
        })
    });
}

export function comment(src: string) {
    return beginCell()
        .storeWritable(new CommentMessage(src))
        .endCell();
}
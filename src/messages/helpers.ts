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
import { toNano } from "../utils/convert";
import { Message } from "./Message";

export function internal(src: {
    to: Address | string,
    value: bigint | string,
    bounce?: Maybe<boolean>,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Maybe<Cell | string>
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

    // Resolve value
    let value: bigint;
    if (typeof src.value === 'string') {
        value = toNano(src.value);
    } else {
        value = src.value;
    }

    // Resolve body
    let body: Message = new EmptyMessage();
    if (typeof src.body === 'string') {
        body = new CommentMessage(src.body);
    } else if (src.body) {
        body = new CellMessage(src.body);
    }

    // Create message
    return new InternalMessage({
        to: to,
        value,
        bounce: src.bounce || false,
        body: new CommonMessageInfo({
            stateInit: src.init ? new StateInit(src.init) : null,
            body
        })
    });
}

export function external(src: {
    to: Address | string,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Maybe<Cell>
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
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

export function internal(src: {
    to: Address,
    amount: bigint,
    bounce?: Maybe<boolean>,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Cell
}) {
    let bounce = true;
    if (src.bounce !== null && src.bounce !== undefined) {
        bounce = src.bounce;
    }
    return new InternalMessage({
        to: src.to,
        value: src.amount,
        bounce: src.bounce || false,
        body: new CommonMessageInfo({
            stateInit: src.init ? new StateInit(src.init) : null,
            body: src.body ? new CellMessage(src.body) : new EmptyMessage()
        })
    });
}

export function external(src: {
    to: Address,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Cell
}) {
    return new ExternalMessage({
        to: src.to,
        body: new CommonMessageInfo({
            stateInit: src.init ? new StateInit(src.init) : null,
            body: src.body ? new CellMessage(src.body) : new EmptyMessage()
        })
    });
}

export function comment(src: string) {
    return new CommentMessage(src);
}
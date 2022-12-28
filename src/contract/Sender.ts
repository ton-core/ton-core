import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { SendMode } from "../messages/SendMode";
import { StateInit } from "../messages/StateInit";

export type SenderArguments = {
    amount: bigint,
    to: Address,
    sendMode?: SendMode,
    bounce?: boolean,
    init?: StateInit,
    body?: Cell
}

export interface Sender {
    readonly address?: Address;
    send(args: SenderArguments): Promise<void>;
}
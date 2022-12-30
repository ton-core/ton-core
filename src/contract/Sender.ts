import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { SendMode } from "../types/SendMode";
import { Maybe } from "../utils/maybe";

export type SenderArguments = {
    value: bigint,
    to: Address,
    sendMode?: Maybe<SendMode>,
    bounce?: Maybe<boolean>,
    init?: Maybe<{ code?: Maybe<Cell>, data?: Maybe<Cell> }>,
    body?: Maybe<Cell>
}

export interface Sender {
    readonly address?: Address;
    send(args: SenderArguments): Promise<void>;
}
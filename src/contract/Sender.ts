import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { SendMode } from "../messages/SendMode";
import { StateInit } from "../messages/StateInit";

export interface Sender {
    readonly address?: Address;
    send(args: { amount: bigint, mode: SendMode, to: Address, stateInit?: StateInit, body?: Cell }): Promise<void>;
}
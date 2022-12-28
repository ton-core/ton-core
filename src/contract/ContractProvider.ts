import { Cell } from "../boc/Cell";
import { SendMode } from "../messages/SendMode";
import { TupleReader } from "../tuple/reader";
import { TupleItem } from "../tuple/tuple";
import { Maybe } from "../utils/maybe";
import { AccountState } from "./AccountState";
import { Sender } from './Sender';

export interface ContractProvider {
    getState(): Promise<AccountState>;
    get(name: string, args: TupleItem[]): Promise<{ stack: TupleReader }>;
    external(message: Cell): Promise<void>;
    internal(via: Sender, args: { value: bigint | string, bounce?: Maybe<boolean>, sendMode?: SendMode, body?: Cell | string }): Promise<void>;
}
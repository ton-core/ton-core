import { Cell } from "../boc/Cell";
import { TupleReader } from "../tuple/reader";
import { TupleItem } from "../tuple/tuple";
import { AccountState } from "./AccountState";
import { Sender } from "./Sender";

export interface ContractProvider {
    getState(): Promise<AccountState>;
    callGetMethod(name: string, args: TupleItem[]): Promise<{ stack: TupleReader }>;
    send(message: Cell, via?: Sender): Promise<void>;
}
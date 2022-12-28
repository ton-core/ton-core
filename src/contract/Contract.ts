import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { Maybe } from "../utils/maybe";

export interface Contract {
    readonly address: Address;
    readonly init?: Maybe<{ code: Cell, data: Cell }>;
}
import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { StateInit } from "../messages/StateInit";
import { Address } from "./Address";

export function contractAddress(workchain: number, init: { code: Cell, data: Cell }) {
    let hash = beginCell()
        .storeWritable(new StateInit({ code: init.code, data: init.data }))
        .endCell()
        .hash();
    return new Address(workchain, hash);
}
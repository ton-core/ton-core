import { beginCell } from "../boc/Builder";
import { StateInit, storeStateInit } from "../types/StateInit";
import { Address } from "./Address";

export function contractAddress(workchain: number, init: StateInit) {
    let hash = beginCell()
        .store(storeStateInit(init))
        .endCell()
        .hash();
    return new Address(workchain, hash);
}
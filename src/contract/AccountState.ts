import { Cell } from "../boc/Cell";
import { Maybe } from "../utils/maybe";

export type AccountState = {
    balance: bigint,
    last: { lt: bigint, hash: Buffer } | null,
    state: { type: 'uninit' } | { type: 'active', code: Maybe<Cell>, data: Maybe<Cell> } | { type: 'frozen', stateHash: Buffer }
};
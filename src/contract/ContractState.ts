import { Maybe } from "../utils/maybe";

export type ContractState = {
    balance: bigint,
    last: { lt: bigint, hash: Buffer } | null,
    state: { type: 'uninit' } | { type: 'active', code: Maybe<Buffer>, data: Maybe<Buffer> } | { type: 'frozen', stateHash: Buffer }
};
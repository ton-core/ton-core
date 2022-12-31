import { inspect } from "util";
import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { loadShardAccount, storeShardAccount } from "./ShardAccount";

describe('ShardAccount', () => {
    it('should parse tonkite cell', () => {
        const boc = Buffer.from('te6cckEBBAEA7wABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAnfACD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqCAkCIGAAAACAAAAAAAAAAGgN4Lazp2QAAE0ACAwCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjPUU3w=', 'base64');
        const cell = Cell.fromBoc(boc)[0];
        const shardAccount = loadShardAccount(cell.beginParse());
        const stored = beginCell().store(storeShardAccount(shardAccount)).endCell();
        expect(cell.equals(stored)).toBe(true);
    });
});
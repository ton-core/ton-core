import { beginCell } from "../boc/Builder";
import { testAddress, testExternalAddress } from "../utils/testAddress";
import { CommonMessageInfo, loadCommonMessageInfo, storeCommonMessageInfo } from "./CommonMessageInfo";

describe('CommonMessageInfo', () => {
    it('should serialize external-in messages', () => {
        let msg: CommonMessageInfo = {
            type: 'external-in',
            src: testExternalAddress('addr-2'),
            dest: testAddress(0, 'addr-1'),
            importFee: 0n
        };
        let cell = beginCell().store(storeCommonMessageInfo(msg)).endCell();
        let msg2 = loadCommonMessageInfo(cell.beginParse());
        let cell2 = beginCell().store(storeCommonMessageInfo(msg2)).endCell();
        expect(cell.equals(cell2)).toBe(true);
    });
});
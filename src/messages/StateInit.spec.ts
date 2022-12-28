import { beginCell } from "../boc/Builder";
import { StateInit } from "./StateInit";

describe('StateInit', () => {
    it('shoild serialize to match golden-1', () => {
        let boc = beginCell()
            .storeWritable(new StateInit({
                code: beginCell().storeUint(1, 8).endCell(),
                data: beginCell().storeUint(2, 8).endCell()
            }))
            .endCell()
            .toBoc({ idx: false, crc32: true });
        expect(boc.toString('base64')).toEqual('te6cckEBAwEACwACATQCAQACAgACAX/38hg=')
    });
});
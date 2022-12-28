import { beginCell } from "../boc/Builder";
import { Address } from "./Address";
import { contractAddress } from "./contractAddress";

describe('contractAddress', () => {
    it('should resolve address correctly', () => {
        let addr = contractAddress(0, { code: beginCell().storeUint(1, 8).endCell(), data: beginCell().storeUint(2, 8).endCell() });
        expect(addr.equals(Address.parse('EQCSY_vTjwGrlvTvkfwhinJ60T2oiwgGn3U7Tpw24kupIhHz')));
    });
});
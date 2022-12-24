import { crc16 } from "./crc16";

describe('crc16', () => {
    it('should match test vector', () => {
        expect(crc16(Buffer.from('123456789'))).toEqual(Buffer.from('31c3', 'hex'));
    });
});
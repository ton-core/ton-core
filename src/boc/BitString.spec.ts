import { BitString } from './BitString';

describe('BitString', () => {
    it('should read bits', () => {
        let bs = new BitString(Buffer.from([0b10101010]), 0, 8);
        expect(bs.at(0)).toBe(true);
        expect(bs.at(1)).toBe(false);
        expect(bs.at(2)).toBe(true);
        expect(bs.at(3)).toBe(false);
        expect(bs.at(4)).toBe(true);
        expect(bs.at(5)).toBe(false);
        expect(bs.at(6)).toBe(true);
        expect(bs.at(7)).toBe(false);
        expect(bs.toString()).toEqual('AA');
    });
    it('should equals', () => {
        let a = new BitString(Buffer.from([0b10101010]), 0, 8);
        let b = new BitString(Buffer.from([0b10101010]), 0, 8);
        let c = new BitString(Buffer.from([0, 0b10101010]), 8, 8);
        expect(a.equals(b)).toBe(true);
        expect(b.equals(a)).toBe(true);
        expect(a.equals(c)).toBe(true);
        expect(c.equals(a)).toBe(true);
        expect(a.toString()).toEqual('AA');
        expect(b.toString()).toEqual('AA');
        expect(c.toString()).toEqual('AA');
    });
    it('should format strings', () => {
        expect(new BitString(Buffer.from([0b00000000]), 0, 1).toString()).toEqual('4_');
        expect(new BitString(Buffer.from([0b10000000]), 0, 1).toString()).toEqual('C_');
        expect(new BitString(Buffer.from([0b11000000]), 0, 2).toString()).toEqual('E_');
        expect(new BitString(Buffer.from([0b11100000]), 0, 3).toString()).toEqual('F_');
        expect(new BitString(Buffer.from([0b11100000]), 0, 4).toString()).toEqual('E');
        expect(new BitString(Buffer.from([0b11101000]), 0, 5).toString()).toEqual('EC_');
    });
});
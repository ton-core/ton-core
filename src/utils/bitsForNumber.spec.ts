import { bitsForNumber } from "./bitsForNumber";

describe('bitsForNumber', () => {
    it('should work', () => {
        expect(bitsForNumber(0, 'int')).toBe(1);
        expect(bitsForNumber(1, 'int')).toBe(2);
        expect(bitsForNumber(-1, 'int')).toBe(1);
        expect(bitsForNumber(-2, 'int')).toBe(3);
    });
});
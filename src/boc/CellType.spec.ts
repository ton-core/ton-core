import { CellType } from './CellType';

describe('CellType', () => {
    it('should match values in c++ code', () => {
        expect(CellType.Ordinary).toBe(-1);
        expect(CellType.PrunedBranch).toBe(1);
        expect(CellType.MerkleProof).toBe(3);
        expect(CellType.MerkleUpdate).toBe(4);
    });
});
import { exoticMerkleUpdate } from '../boc/cell/exoticMerkleUpdate';
import { Dictionary } from './Dictionary';
import { generateMerkleUpdate } from './generateMerkleUpdate';

describe('Merkle Updates', () => {
    it('should generate merkle updates', () => {
        let d = Dictionary.empty(
            Dictionary.Keys.Uint(8),
            Dictionary.Values.Uint(32)
        );
        d.set(1, 11);
        d.set(2, 22);
        d.set(3, 33);
        d.set(4, 44);
        d.set(5, 55);

        for (let k = 1; k <= 5; k++) {
            const update = generateMerkleUpdate(d, k, d.get(k)! * 2);
            expect(
                exoticMerkleUpdate(update.bits, update.refs).proofHash1
            ).toEqual(
                Buffer.from(
                    'ee41b86bd71f8224ebd01848b4daf4cd46d3bfb3e119d8b865ce7c2802511de3',
                    'hex'
                )
            );
            d.set(k, Math.floor(d.get(k)! / 2));
        }
    });
});

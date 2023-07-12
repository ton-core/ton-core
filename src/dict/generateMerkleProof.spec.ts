import { exoticMerkleProof } from '../boc/cell/exoticMerkleProof';
import { Dictionary } from './Dictionary';
import { generateMerkleProof } from './generateMerkleProof';

describe('Merkle Proofs', () => {
    it('should generate merkle proofs from dictionary', () => {
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
            const proof = generateMerkleProof(d, k);
            expect(exoticMerkleProof(proof.bits, proof.refs).proofHash).toEqual(
                Buffer.from(
                    'ee41b86bd71f8224ebd01848b4daf4cd46d3bfb3e119d8b865ce7c2802511de3',
                    'hex'
                )
            );
        }
    });
});

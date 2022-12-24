import { randomInt } from 'crypto';
import Prando from 'prando';
import { testAddress } from '../utils/testAddress';
import { BitBuilder } from './BitBuilder';
import { BitReader } from './BitReader';

describe('BitReader', () => {
    it('should read uints from builder', () => {
        let prando = new Prando('test-1');
        for (let i = 0; i < 1000; i++) {
            let a = prando.nextInt(0, 281474976710655);
            let b = prando.nextInt(0, 281474976710655);
            let builder = new BitBuilder();
            builder.writeUint(a, 48);
            builder.writeUint(b, 48);
            let bits = builder.build();
            let reader = new BitReader(bits);
            expect(Number(reader.preloadUint(48))).toEqual(a);
            expect(Number(reader.loadUint(48))).toEqual(a);
            expect(Number(reader.preloadUint(48))).toEqual(b);
            expect(Number(reader.loadUint(48))).toEqual(b);
        }
    });
    it('should read ints from builder', () => {
        let prando = new Prando('test-2');
        for (let i = 0; i < 1000; i++) {
            let a = prando.nextInt(-281474976710655, 281474976710655);
            let b = prando.nextInt(-281474976710655, 281474976710655);
            let builder = new BitBuilder();
            builder.writeInt(a, 49);
            builder.writeInt(b, 49);
            let bits = builder.build();
            let reader = new BitReader(bits);
            expect(Number(reader.preloadInt(49))).toEqual(a);
            expect(Number(reader.loadInt(49))).toEqual(a);
            expect(Number(reader.preloadInt(49))).toEqual(b);
            expect(Number(reader.loadInt(49))).toEqual(b);
        }
    });
    it('should read var uints from builder', () => {
        let prando = new Prando('test-3');
        for (let i = 0; i < 1000; i++) {
            let sizeBits = prando.nextInt(4, 8);
            let a = prando.nextInt(0, 281474976710655);
            let b = prando.nextInt(0, 281474976710655);
            let builder = new BitBuilder();
            builder.writeVarUint(a, sizeBits);
            builder.writeVarUint(b, sizeBits);
            let bits = builder.build();
            let reader = new BitReader(bits);
            expect(Number(reader.preloadVarUint(sizeBits))).toEqual(a);
            expect(Number(reader.loadVarUint(sizeBits))).toEqual(a);
            expect(Number(reader.preloadVarUint(sizeBits))).toEqual(b);
            expect(Number(reader.loadVarUint(sizeBits))).toEqual(b);
        }
    });
    it('should read var ints from builder', () => {
        let prando = new Prando('test-4');
        for (let i = 0; i < 1000; i++) {
            let sizeBits = prando.nextInt(4, 8);
            let a = prando.nextInt(-281474976710655, 281474976710655);
            let b = prando.nextInt(-281474976710655, 281474976710655);
            let builder = new BitBuilder();
            builder.writeVarInt(a, sizeBits);
            builder.writeVarInt(b, sizeBits);
            let bits = builder.build();
            let reader = new BitReader(bits);
            expect(Number(reader.preloadVarInt(sizeBits))).toEqual(a);
            expect(Number(reader.loadVarInt(sizeBits))).toEqual(a);
            expect(Number(reader.preloadVarInt(sizeBits))).toEqual(b);
            expect(Number(reader.loadVarInt(sizeBits))).toEqual(b);
        }
    });
    it('should read coins from builder', () => {
        let prando = new Prando('test-5');
        for (let i = 0; i < 1000; i++) {
            let a = prando.nextInt(0, 281474976710655);
            let b = prando.nextInt(0, 281474976710655);
            let builder = new BitBuilder();
            builder.writeCoins(a);
            builder.writeCoins(b);
            let bits = builder.build();
            let reader = new BitReader(bits);
            expect(Number(reader.preloadCoins())).toEqual(a);
            expect(Number(reader.loadCoins())).toEqual(a);
            expect(Number(reader.preloadCoins())).toEqual(b);
            expect(Number(reader.loadCoins())).toEqual(b);
        }
    });

    it('should read address from builder', () => {
        for (let i = 0; i < 1000; i++) {
            let a = randomInt(20) === 0 ? testAddress(-1, 'test-1-' + i) : null;
            let b = testAddress(0, 'test-2-' + i);
            let builder = new BitBuilder();
            builder.writeAddress(a);
            builder.writeAddress(b);
            let bits = builder.build();
            let reader = new BitReader(bits);
            if (a) {
                expect(reader.loadMaybeAddress()!.toString()).toEqual(a.toString());
            } else {
                expect(reader.loadMaybeAddress()).toBeNull();
            }
            expect(reader.loadAddress().toString()).toEqual(b.toString());
        }
    });
});
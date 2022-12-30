import Prando from "prando";
import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { bitsForNumber } from "./bitsForNumber";

export function testAddress(workchain: number, seed: string) {
    const random = new Prando(seed);
    const hash = Buffer.alloc(32);
    for (let i = 0; i < hash.length; i++) {
        hash[i] = random.nextInt(0, 255);
    }
    return new Address(workchain, hash);
}


export function testExternalAddress(seed: string) {
    const random = new Prando(seed);
    const hash = Buffer.alloc(32);
    for (let i = 0; i < hash.length; i++) {
        hash[i] = random.nextInt(0, 255);
    }
    let v = BigInt('0x' + hash.toString('hex'));
    return new ExternalAddress(v, bitsForNumber(v, 'uint'));
}

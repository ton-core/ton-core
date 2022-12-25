import { deserializeBoc, serializeBoc } from "./serialization";

describe('boc', () => {
    it('should boc', () => {
        let b1 = deserializeBoc(Buffer.from('te6cckEBAQEABwAACQHW80Vgb11ZoQ==', 'base64'));
        let b2 = deserializeBoc(Buffer.from('te6cckEBAgEADgABCQHW80VgAQAHdWtbOOjL63Q=', 'base64'));
        let b3 = deserializeBoc(Buffer.from('te6ccsEBAgEADgAIDgEJAdbzRWABAAd1a1s4yDmZeQ==', 'base64'));

        let r1 = serializeBoc(b1[0], { idx: false, crc32c: true }).toString('base64');
        console.warn(r1);
        let r2 = serializeBoc(b2[0], { idx: true, crc32c: true }).toString('base64');
        console.warn(r2);
        let r3 = serializeBoc(b3[0], { idx: true, crc32c: true }).toString('base64');
        console.warn(r3);
    });
});
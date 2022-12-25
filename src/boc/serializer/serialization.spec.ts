import { deserializeBoc } from "./serialization";

describe('boc', () => {
    it('should boc', () => {
        deserializeBoc(Buffer.from('te6cckEBAQEABwAACQHW80Vgb11ZoQ==', 'base64'));
        deserializeBoc(Buffer.from('te6cckEBAgEADgABCQHW80VgAQAHdWtbOOjL63Q=', 'base64'));
        deserializeBoc(Buffer.from('te6ccsEBAgEADgAIDgEJAdbzRWABAAd1a1s4yDmZeQ==', 'base64'));
    });
});
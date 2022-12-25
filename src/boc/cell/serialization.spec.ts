import { deserializeBoc, parseBoc, serializeBoc } from "./serialization";
import fs from 'fs';
import { beginCell } from "../Builder";

const wallets: string[] = [
    'B5EE9C72410101010044000084FF0020DDA4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED5441FDF089',
    'B5EE9C724101010100530000A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54D0E2786F',
    'B5EE9C7241010101005F0000BAFF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54B5B86E42',
    'B5EE9C724101010100570000AAFF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54A1370BB6',
    'B5EE9C724101010100630000C2FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54044CD7A1',
    'B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0',
    'B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD'
];

describe('boc', () => {

    it('should parse wallet code', () => {
        for (let w of wallets) {
            let c = deserializeBoc(Buffer.from(w, 'hex'))[0];
            let b = serializeBoc(c, { idx: false, crc32: true });
            let c2 = deserializeBoc(b)[0];
            expect(c2.equals(c)).toBe(true);
        }
    });

    it('should parse largeBoc.txt', () => {
        let boc = Buffer.from(fs.readFileSync(__dirname + '/__testdata__/largeBoc.txt', 'utf8'), 'base64');
        let c = deserializeBoc(boc)[0];
        serializeBoc(c, { idx: false, crc32: true });
    });

    it('should parse manyCells.txt', () => {
        let boc = Buffer.from(fs.readFileSync(__dirname + '/__testdata__/manyCells.txt', 'utf8'), 'base64');
        let c = deserializeBoc(boc)[0];
        let b = serializeBoc(c, { idx: false, crc32: true });
        let c2 = deserializeBoc(b)[0];
        expect(c2.equals(c)).toBe(true);
    });

    it('should parse veryLarge.boc', () => {
        let boc = fs.readFileSync(__dirname + '/__testdata__/veryLarge.boc');
        let c = deserializeBoc(boc)[0];
        let b = serializeBoc(c, { idx: false, crc32: true });
        let c2 = deserializeBoc(b)[0];
        expect(c2.equals(c)).toBe(true);
    });

    it('should parse accountState.txt', () => {
        let boc = Buffer.from(fs.readFileSync(__dirname + '/__testdata__/accountState.txt', 'utf8'), 'base64');
        let c = deserializeBoc(boc)[0];
        let b = serializeBoc(c, { idx: false, crc32: true });
        let c2 = deserializeBoc(b)[0];
        expect(c2.equals(c)).toBe(true);
    });

    it('should serialize single cell with a empty bits', () => {
        let cell = beginCell().endCell();
        expect(cell.toString()).toBe('x{}');
        expect(serializeBoc(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEAAgAAAA==');
        expect(serializeBoc(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEAAgAAAEysuc0=');
        expect(serializeBoc(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEAAgAAAAA=');
        expect(serializeBoc(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEAAgAAAAC1U5ck');
        expect(deserializeBoc(Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6cckEBAQEAAgAAAEysuc0=', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccoEBAQEAAgAAAAA=', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccsEBAQEAAgAAAAC1U5ck', 'base64'))[0].equals(cell)).toBe(true);
    });

    it('should serialize single cell with a number of byte-aligned bits', () => {
        let cell = beginCell().storeUint(123456789, 32).endCell();
        expect(cell.toString()).toBe('x{075BCD15}');
        expect(serializeBoc(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEABgAACAdbzRU=');
        expect(serializeBoc(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEABgAACAdbzRVRblCS');
        expect(serializeBoc(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEABgAAAAgHW80V');
        expect(serializeBoc(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEABgAAAAgHW80Vyf0TAA==');
        expect(deserializeBoc(Buffer.from('te6ccgEBAQEABgAACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6cckEBAQEABgAACAdbzRVRblCS', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccoEBAQEABgAAAAgHW80V', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccsEBAQEABgAAAAgHW80Vyf0TAA==', 'base64'))[0].equals(cell)).toBe(true);
    });

    it('should serialize single cell with a number of non-aligned bits', () => {
        let cell = beginCell().storeUint(123456789, 34).endCell();
        expect(cell.toString()).toBe('x{01D6F3456_}');
        expect(serializeBoc(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEABwAACQHW80Vg');
        expect(serializeBoc(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEABwAACQHW80Vgb11ZoQ==');
        expect(serializeBoc(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEABwAAAAkB1vNFYA==');
        expect(serializeBoc(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEABwAAAAkB1vNFYMkX0oY=');
        expect(deserializeBoc(Buffer.from('te6ccgEBAQEABwAACQHW80Vg', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6cckEBAQEABwAACQHW80Vgb11ZoQ==', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccoEBAQEABwAAAAkB1vNFYA==', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccsEBAQEABwAAAAkB1vNFYMkX0oY=', 'base64'))[0].equals(cell)).toBe(true);
    });

    it('should serialize single cell with a single reference', () => {
        let refCell = beginCell()
            .storeUint(123456789, 32)
            .endCell();
        let cell = beginCell()
            .storeUint(987654321, 32)
            .storeRef(refCell)
            .endCell();
        expect(cell.toString()).toBe('x{3ADE68B1}\n x{075BCD15}');
        expect(serializeBoc(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAgEADQABCDreaLEBAAgHW80V');
        expect(serializeBoc(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAgEADQABCDreaLEBAAgHW80VSW/75w==');
        expect(serializeBoc(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAgEADQAABwEIOt5osQEACAdbzRU=');
        expect(serializeBoc(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAgEADQAABwEIOt5osQEACAdbzRWZVy8t');
        expect(deserializeBoc(Buffer.from('te6ccgEBAgEADQABCDreaLEBAAgHW80V', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6cckEBAgEADQABCDreaLEBAAgHW80VSW/75w==', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccoEBAgEADQAABwEIOt5osQEACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccsEBAgEADQAABwEIOt5osQEACAdbzRWZVy8t', 'base64'))[0].equals(cell)).toBe(true);
    });

    it('should serialize single cell with multiple references', () => {
        let refCell = beginCell()
            .storeUint(123456789, 32)
            .endCell();
        let cell = beginCell()
            .storeUint(987654321, 32)
            .storeRef(refCell)
            .storeRef(refCell)
            .storeRef(refCell)
            .endCell();
        expect(cell.toString()).toBe('x{3ADE68B1}\n x{075BCD15}\n x{075BCD15}\n x{075BCD15}');
        expect(serializeBoc(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAgEADwADCDreaLEBAQEACAdbzRU=');
        expect(serializeBoc(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAgEADwADCDreaLEBAQEACAdbzRWpQD2p');
        expect(serializeBoc(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAgEADwAACQMIOt5osQEBAQAIB1vNFQ==');
        expect(serializeBoc(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAgEADwAACQMIOt5osQEBAQAIB1vNFT/vUE4=');
        expect(deserializeBoc(Buffer.from('te6ccgEBAgEADwADCDreaLEBAQEACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6cckEBAgEADwADCDreaLEBAQEACAdbzRWpQD2p', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccoEBAgEADwAACQMIOt5osQEBAQAIB1vNFQ==', 'base64'))[0].equals(cell)).toBe(true);
        expect(deserializeBoc(Buffer.from('te6ccsEBAgEADwAACQMIOt5osQEBAQAIB1vNFT/vUE4=', 'base64'))[0].equals(cell)).toBe(true);
    });
});
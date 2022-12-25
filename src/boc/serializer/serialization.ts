import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";

function resolveCellSize(reader: BitReader, offBytes: number) {

    // Save
    reader.save();

    // D1
    const d1 = reader.loadUint(8);
    const refs = d1 % 8;
    
    // D2
    const d2 = reader.loadUint(8);
    const dataBytesize = Math.ceil(d2 / 2);

    // Reset
    reader.reset();

    return refs * offBytes + dataBytesize + 2;
}

function parseBoc(src: BitReader) {
    let magic = src.loadUint(32);
    if (magic === 0x68ff65f3) {
        let size = src.loadUint(8);
        let offBytes = src.loadUint(8);
        let cells = src.loadUint(size * 8);
        let roots = src.loadUint(size * 8); // Must be 1
        let absent = src.loadUint(size * 8);
        let totalCellSize = src.loadUint(offBytes * 8);
        let index = src.loadBuffer(cells * offBytes);
        let cellData = src.loadBuffer(totalCellSize);
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root: [0]
        };
    } else if (magic === 0xacc3a728) {
        let size = src.loadUint(8);
        let offBytes = src.loadUint(8);
        let cells = src.loadUint(size * 8);
        let roots = src.loadUint(size * 8); // Must be 1
        let absent = src.loadUint(size * 8);
        let totalCellSize = src.loadUint(offBytes * 8);
        let index = src.loadBuffer(cells * offBytes);
        let cellData = src.loadBuffer(totalCellSize);
        let crc32c = src.loadUint(32);
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root: [0]
        };
    } else if (magic === 0xb5ee9c72) {
        let hasIdx = src.loadUint(1);
        let hasCrc32c = src.loadUint(1);
        let hasCacheBits = src.loadUint(1);
        let flags = src.loadUint(2); // Must be 0
        let size = src.loadUint(3);
        let offBytes = src.loadUint(8);
        let cells = src.loadUint(size * 8);
        let roots = src.loadUint(size * 8);
        let absent = src.loadUint(size * 8);
        let totalCellSize = src.loadUint(offBytes * 8);
        let root: number[] = [];
        for (let i = 0; i < roots; i++) {
            root.push(src.loadUint(size * 8));
        }
        let index: Buffer | null = null;
        if (hasIdx) {
            index = src.loadBuffer(cells * offBytes);
        }
        let cellData = src.loadBuffer(totalCellSize);
        let crc32c: number | null = null
        if (hasCrc32c) {
            crc32c = src.loadUint(32);
        }
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root
        };
    } else {
        throw Error('Invalid magic');
    }
}

export function deserializeBoc(src: Buffer) {
    let srcReader = new BitReader(new BitString(src, 0, src.length * 8));
    let boc = parseBoc(srcReader);
    let reader = new BitReader(new BitString(boc.cellData, 0, boc.cellData.length * 8));

    // Index
    let getOffset: (id: number) => number;
    if (boc.index) {
        let indexReader = new BitReader(new BitString(boc.index, 0, boc.index.length * 8));
        getOffset = (id: number) => {
            indexReader.reset();
            indexReader.skip(id * boc.offBytes * 8);
            return indexReader.loadUint(boc.offBytes * 8);
        }
    } else {
        let index: number[] = [];
        let offset = 0;
        for (let i = 0; i < boc.cells; i++) {
            let size = resolveCellSize(reader, boc.offBytes);
            index.push(offset);
            offset += size;
            reader.skip(size * 8);
        }
        getOffset = (id: number) => {
            if (id < 0 || id >= index.length) {
                throw Error('Invalid cell id: ' + id);
            }
            return index[id];
        };
    }

    // Load cell
    let loadCell = (id: number): Cell => {

        console.warn('loading cell ' + id);

        // Go to cell
        const offset = getOffset(id);
        reader.reset();
        reader.skip(offset * 8);

        // Load descriptor
        const d1 = reader.loadUint(8);
        const d2 = reader.loadUint(8);
        // const isExotic = !!(d1 & 8);
        const refNum = d1 % 8;
        const dataBytesize = Math.ceil(d2 / 2);
        const fullfilledBits = !!(d2 % 2);

        console.warn({ d1, d2, refNum, dataBytesize, fullfilledBits });

        // Load bits size
        let totalBits = dataBytesize * 8;
        if (fullfilledBits) {

            // Load padding
            let paddedBits = 0;
            while (true) {

                // Read last bit
                reader.skip(totalBits - paddedBits - 1);
                let bt = reader.preloadBit();
                reader.skip(-(totalBits - paddedBits - 1));

                // Update number of bits
                paddedBits++;

                // Check if last bit is set: exit loop
                if (bt) {
                    break;
                }
            }

            // Update total bits
            totalBits = totalBits - paddedBits;
        }

        // Load bits
        let bits = reader.loadBits(totalBits);
        reader.skip(dataBytesize * 8 - totalBits);

        // Load refs
        let refs: Cell[] = [];
        let refId: number[] = [];
        for (let i = 0; i < refNum; i++) {
            refId.push(reader.loadUint(boc.offBytes * 8));
        }
        for (let r of refId) {
            refs.push(loadCell(r));
        }

        // Return
        return new Cell({ bits, refs });
    }

    // Load roots
    let roots: Cell[] = [];
    for (let i = 0; i < boc.root.length; i++) {
        roots.push(loadCell(boc.root[i]));
    }

    console.warn(boc.root);
    console.warn(roots);

    // Return
    return roots;
}
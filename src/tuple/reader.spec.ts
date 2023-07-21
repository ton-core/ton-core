/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TupleReader } from "./reader";
import { TupleItem } from "./tuple";
import fs from 'fs';

describe('tuple', () => {
    it('should read cons', () => {
        const cons: TupleItem[] = [
            {
                "type": "tuple",
                "items": [
                    {
                        "type": "tuple",
                        "items": [
                            { "type": "int", "value": BigInt(1) },
                            { "type": "int", "value": BigInt(1) },
                        ]
                    },
                    {
                        "type": "tuple",
                        "items": [
                            {
                                "type": "tuple",
                                "items": [
                                    { "type": "int", "value": BigInt(2) },
                                ]
                            },
                            {
                                "type": "tuple",
                                "items": [
                                    {
                                        "type": "tuple",
                                        "items": [
                                            { "type": "int", "value": BigInt(3) },
                                        ]
                                    },
                                    { "type": "null" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
        const r = new TupleReader(cons);

        const items: TupleItem[] = [
            {
                "type": "tuple",
                "items": [
                    {
                        "type": "int",
                        "value": BigInt(1)
                    },
                    {
                        "type": "int",
                        "value": BigInt(1)
                    }
                ]
            },
            {
                "type": "tuple",
                "items": [
                    {
                        "type": "int",
                        "value": BigInt(2)
                    }
                ]
            },
            {
                "type": "tuple",
                "items": [
                    {
                        "type": "int",
                        "value": BigInt(3)
                    }
                ]
            }
        ]

        expect(r.readCons()).toEqual(items);
    });

    it('should read ultra deep cons', () => {
        let fContent = fs.readFileSync('./src/tuple/ultra_deep_cons.json');
        const cons: TupleItem[] = JSON.parse(fContent.toString());

        const result = [];
        for (let index = 0; index < 187; index++) {
            if (![11,82,116,154].includes(index)) {
                result.push({"type":"int","value": index.toString()})
            }
        }

        expect(new TupleReader(cons).readCons()).toEqual(result);
    });

    it('should raise error', () => {

        const cons: TupleItem[] = [
            {
                "type": "null"
            }
        ]
        const r = new TupleReader(cons);
        const b = new TupleReader(cons)
        console.log(expect(b.readCons()).rejects);
        async function wrapped() {
            return b.readCons()
        };
        expect(wrapped()).rejects.toThrowError('Const consists only from tuple elements');
    });
})
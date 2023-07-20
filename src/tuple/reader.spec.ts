/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TupleReader } from "./reader";
import { TupleItem } from "./tuple";

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

})
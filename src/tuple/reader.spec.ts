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
                    { "type": "null"}
                  ]
                },
                {
                  "type": "tuple",
                  "items": [
                    {
                      "type": "tuple",
                      "items": [
                        { "type": "int", "value": BigInt(2)},
                        { "type": "null"}
                      ]
                    },
                    {
                        "type": "tuple",
                        "items": [
                          {
                            "type": "tuple",
                            "items": [
                              { "type": "int", "value": BigInt(3)},
                              { "type": "null"}
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
            { type: 'int', value: 1n },
            { type: 'int', value: 2n },
            { type: 'int', value: 3n }
        ]

        expect(r.readCons()).toEqual(items);
    });

})
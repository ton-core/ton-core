/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell } from "../boc/Builder";
import { ActionSendMsg, ActionSetCode, OutAction, OutList } from "./Block";
import { SendMode } from "./SendMode";
import { MessageRelaxed, storeMessageRelaxed} from "./MessageRelaxed";

const mockMessageRelaxed1: MessageRelaxed = {
    info: {
        type: 'external-out',
        createdLt: 0n,
        createdAt: 0
    },
    body: beginCell().storeUint(0,8).endCell()
}

const mockMessageRelaxed2: MessageRelaxed = {
    info: {
        type: 'external-out',
        createdLt: 1n,
        createdAt: 1
    },
    body: beginCell().storeUint(1,8).endCell()
}

const mockSetCodeCel = beginCell().storeUint(123, 8).endCell();

describe('Block', () => {
    it('Should serialize out list', () => {
        const sendMode1 = SendMode.PAY_GAS_SEPARATELY;
        const sendMode2 = SendMode.IGNORE_ERRORS;

        const actions = [
            OutAction.sendMsg(sendMode1, mockMessageRelaxed1),
            OutAction.sendMsg(sendMode2, mockMessageRelaxed2),
            OutAction.setCode(mockSetCodeCel)
        ]

        const actual = new OutList(actions).cell;

        // tvm handles actions from c5 in reversed order
        const expected =
            beginCell()
                .storeRef(
                    beginCell()
                        .storeRef(
                            beginCell()
                                .storeRef(beginCell().endCell())
                                .storeUint(ActionSendMsg.tag, 32)
                                .storeUint(sendMode1, 8)
                                .storeRef(beginCell().store(storeMessageRelaxed(mockMessageRelaxed1)).endCell())
                                .endCell()
                        )
                        .storeUint(ActionSendMsg.tag, 32)
                        .storeUint(sendMode2, 8)
                        .storeRef(beginCell().store(storeMessageRelaxed(mockMessageRelaxed2)).endCell())
                        .endCell()
                )
                .storeUint(ActionSetCode.tag, 32)
                .storeRef(mockSetCodeCel)
                .endCell()



        expect(actual.equals(expected)).toBeTruthy();
    });
});

/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { SendMode } from "./SendMode";
import { MessageRelaxed, storeMessageRelaxed } from "./MessageRelaxed";
import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";

/*
action_send_msg#0ec3c86d mode:(## 8)
  out_msg:^(MessageRelaxed Any) = OutAction;
*/
export class ActionSendMsg {
    public static readonly tag = 0x0ec3c86d;

    public readonly tag = ActionSendMsg.tag;

    public serialized: Cell;

    constructor(public readonly mode: SendMode, public readonly outMsg: MessageRelaxed) {
        this.serialized = beginCell()
            .storeUint(this.tag, 32)
            .storeUint(this.mode, 8)
            .storeRef(beginCell().store(storeMessageRelaxed(this.outMsg)).endCell())
            .endCell();
    }
}

/*
action_set_code#ad4de08e new_code:^Cell = OutAction;
 */
export class ActionSetCode {
    public static readonly tag = 0xad4de08e;

    public readonly tag = ActionSetCode.tag;

    public readonly serialized: Cell;

    constructor(public readonly newCode: Cell) {
        this.serialized = beginCell().storeUint(this.tag, 32).storeRef(this.newCode).endCell();
    }
}

export type OutAction = ActionSendMsg | ActionSetCode;
export const OutAction = {
    sendMsg(...args: ConstructorParameters<typeof ActionSendMsg>) {
        return new ActionSendMsg(...args);
    },
    setCode(...args: ConstructorParameters<typeof ActionSetCode>) {
        return new ActionSetCode(...args);
    }
}

/*
out_list_empty$_ = OutList 0;
out_list$_ {n:#} prev:^(OutList n) action:OutAction
  = OutList (n + 1);
 */
export class OutList {
    public readonly cell: Cell;

    constructor(public readonly actions: OutAction[]) {
        this.cell = actions.reduce((cell, action) => beginCell()
                .storeRef(cell)
                .storeSlice(action.serialized.beginParse())
                .endCell(),
            beginCell().endCell()
        )
    }
}

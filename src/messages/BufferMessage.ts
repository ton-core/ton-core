import { Builder } from "../boc/Builder";
import { Message } from "./Message";

export class BufferMessage implements Message {

    readonly payload: Buffer;

    constructor(payload: Buffer) {
        this.payload = payload;
    }

    writeTo(builder: Builder) {
        builder.storeBuffer(this.payload);
    }
}
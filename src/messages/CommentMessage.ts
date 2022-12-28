import { Builder } from "../boc/Builder";
import { Message } from "./Message";

export class CommentMessage implements Message {

    readonly comment: string;

    constructor(comment: string) {
        this.comment = comment;
    }

    writeTo(builder: Builder) {
        if (this.comment.length > 0) {
            builder.storeUint(0, 32);
            builder.storeStringTail(this.comment);
        }
    }
}
import { Builder } from "../boc/Builder";
import { Message } from "./Message";

export class EmptyMessage implements Message {
    writeTo(builder: Builder) {
        // Nothing to do
    }
}
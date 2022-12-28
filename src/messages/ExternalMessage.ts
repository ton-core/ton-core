import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { Builder } from "../boc/Builder";
import { CommonMessageInfo } from "./CommonMessageInfo";
import { Message } from "./Message";

export class ExternalMessage implements Message {

    readonly from: ExternalAddress | null;
    readonly to: Address;
    readonly importFee: number;
    readonly body: CommonMessageInfo;

    constructor(opts: { to: Address, from?: ExternalAddress | null, importFee?: number | null, body: CommonMessageInfo }) {
        this.to = opts.to;
        this.body = opts.body;
        if (opts.from !== undefined && opts.from !== null) {
            this.from = opts.from;
        } else {
            this.from = null;
        }
        if (opts.importFee !== undefined && opts.importFee !== null) {
            this.importFee = opts.importFee;
        } else {
            this.importFee = 0;
        }
    }

    writeTo(builder: Builder) {
        builder.storeUint(2, 2);
        builder.storeAddress(this.from);
        builder.storeAddress(this.to);
        builder.storeCoins(this.importFee);
        this.body.writeTo(builder);
    }
}
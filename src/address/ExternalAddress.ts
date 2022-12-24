export class ExternalAddress {

    static isAddress(src: any): src is ExternalAddress {
        return src instanceof ExternalAddress;
    }

    readonly value: bigint;

    constructor(value: bigint) {
        this.value = value;
    }
}
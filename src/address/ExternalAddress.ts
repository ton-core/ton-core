import inspectSymbol from 'symbol.inspect';
export class ExternalAddress {

    static isAddress(src: any): src is ExternalAddress {
        return src instanceof ExternalAddress;
    }

    readonly value: bigint;
    readonly bits: number;

    constructor(value: bigint, bits: number) {
        this.value = value;
        this.bits = bits;
    }

    toString() {
        return `External<${this.bits}:${this.value}>`;
    }

    [inspectSymbol] = () => this.toString()
}
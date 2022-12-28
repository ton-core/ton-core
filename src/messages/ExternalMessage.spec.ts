import { Address } from "../address/Address";
import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { CellMessage } from "./CellMessage";
import { CommonMessageInfo } from "./CommonMessageInfo";
import { ExternalMessage } from "./ExternalMessage";

describe('ExternalMessage', () => {
    it('shoild serialize to match golden-1', () => {
        let res = beginCell()
            .storeWritable(new ExternalMessage({
                to: Address.parse('EQAkqKp1V_cOpgvcNu-5y1KsSveNy58FjaL4POeBjSQ_Gu_d'),
                body: new CommonMessageInfo({})
            }))
            .endCell()
            .toBoc({ idx: false, crc32: true });
        expect(res.toString('base64')).toEqual('te6cckEBAQEAJQAARYgASVFU6q/uHUwXuG3fc5alWJXvG5c+CxtF8HnPAxpIfjQEG2i8ew==')
    });
    it('shoild serialize to match golden-2', () => {
        let tx = Cell.fromBoc(Buffer.from('te6cckEBAgEAjwABinF3ovFrqpVfDWhXa1BoTqBl0fROXsosW4xahiH66H1BCUtLNfESvxX4p8wDXOVfn6BngOOkIKtsl/xRikiWVAYAAAAAAAEAimIAfVB8+bTQBiK23CPgun88qVhKE8Wjgw89qOm3byfv9kEh3NZQAAAAAAAAAAAAAAAAAAAAAAAASGVsbG8sIHdvcmxkIRo9Wv0=', 'base64'))[0];
        let res = beginCell()
            .storeWritable(new ExternalMessage({
                to: Address.parse('EQAkqKp1V_cOpgvcNu-5y1KsSveNy58FjaL4POeBjSQ_Gu_d'),
                body: new CommonMessageInfo({
                    body: new CellMessage(tx)
                })
            }))
            .endCell()
            .toBoc({ idx: false, crc32: true });
        expect(res.toString('base64')).toEqual('te6cckEBAgEAsgABz4gASVFU6q/uHUwXuG3fc5alWJXvG5c+CxtF8HnPAxpIfjQDi70Xi11UqvhrQrtag0J1Ay6PonL2UWLcYtQxD9dD6ghKWlmviJX4r8U+YBrnKvz9AzwHHSEFW2S/4oxSRLKgMAAAAAAEAQCKYgB9UHz5tNAGIrbcI+C6fzypWEoTxaODDz2o6bdvJ+/2QSHc1lAAAAAAAAAAAAAAAAAAAAAAAABIZWxsbywgd29ybGQh6SuDXQ==');
    });
});
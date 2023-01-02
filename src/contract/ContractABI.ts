import { Maybe } from "../utils/maybe";

export type ABIError = {
    message: string
};

export type ContractABI = {
    errors?: Maybe<{ [key: number]: ABIError }>,
};
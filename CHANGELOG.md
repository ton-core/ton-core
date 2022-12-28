# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.16.0] - 2022-12-28

## Added
- Added `Contract`, `ContractProvider` and `AccountState` types

## [0.15.0] - 2022-12-28

## Added
- Added `SendMode`
- Added `safeSign` and `safeSignVerify`

## [0.14.2] - 2022-12-28

## Fixed
- Fixed mutation of a `Cell` when reading from a `Slice` clone

## [0.14.1] - 2022-12-28

## Fixed
- improved return types in `loadDict` and `loadDictDirect`

## [0.14.0] - 2022-12-28

## Added
- `Dictionary`, `DictionaryKey` and `DictionaryValue` to work with TVM dicts
- `loadDict` and `loadDictDirect` to `Slice`
- `storeDict` and `storeDictDirect` to `Builder`

## [0.13.0] - 2022-12-28

## Fixed
- Critical issue in calculating `StateInit` and `contractAddress`

## [0.12.0] - 2022-12-28

## Added
- `toNano` and `fromNano` helper methods
- `crc16` and `crc32c` checksum functions that compatible with TON
- `base32Decode` and `base32Encode` for base32 encoding/decoding
- Messages: `StateInit`, `InternalMessage`, `ExternalMessage`, `EmptyMessage`, `CommentMessage`, `CommonMessageInfo`, `CellMessage`, `BufferMessage`
- `contractAddress` function for calculation of an address
- `storeStringTail`, `storeMaybeStringTail`, `storeStringRefTail`, `storeMaybeStringRefTail` in `Builder`
- `loadStringTail`, `loadMaybeStringTail`, `loadStringRefTail`, `loadMaybeStringRefTail` in `Slice`

## Fixed
- `availableBits` in `Builder`

## [0.11.0] - 2022-12-27

## Added
- `Tuple` object with serialization

## [0.10.1] - 2022-12-27

## Fix
- Hotfix for config contract proofs

## [0.10.0] - 2022-12-27
## Fix
- Fix reading of external addresses in `BitReader`

## [0.9.0] - 2022-12-27

## Changed
- `loadMaybeCell`/`loadCell` -> `loadMaybeRef`/`loadRef` in `Slice`

## [0.8.0] - 2022-12-27
## Added
- `asSlice` to `Builder` and `Cell`
- `asCell` to `Builder` and `Slice`
- `asBuilder` to `Cell` and `Slice`

## [0.7.0] - 2022-12-27

## Added
- `clone` function to `Slice`

## [0.6.0] - 2022-12-27

## Changed
- `loadCoins` and `preloadCoins` returns `bigint` instead of `number`

## [0.5.0] - 2022-12-27

## Added
- `availableBits` and `availableRefs` in `Builder`

## [0.4.0] - 2022-12-27

## Added
- `length` in `BitBuilder`
- `bits` and `refs` in `Builder`
- `storeBuilder` and `storeMaybeBuilder` in `Builder`

## [0.3.0] - 2022-12-27

## Added
- `remaining` in `BitReader`
- `remainingBits`, `remainingRefs`, `loadBuffer` and `preloadBuffer` in `Slice`
- `Writable` type that provides an abstraction of something that could be written to `Builder`
- `storeSlice`, `storeMaybeSlice`, `storeWritable`, `storeMaybeWritable` in `Builder`
## [0.2.0] - 2022-12-27

## Added
- `fromBoc` and `toBoc` to `Cell` for parsing and serializing cells to a BOC.

## [0.1.0] - 2022-12-27
## Added
- `Cell`, `Builder`, `Slice` primitives
- `BitString`, `BitReader`, `BitBuilder` functions
- `exoticMerkleProof`, `exoticMerkleUpdate`, `exoticPruned` functions to parse exotic cells

## [0.0.2]

## Added

- `Address` type that represents TON Standard Address

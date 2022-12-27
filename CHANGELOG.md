# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

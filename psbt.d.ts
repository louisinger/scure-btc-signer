import * as P from 'micro-packed';
import { type Bytes } from './utils.js';
export declare const TaprootControlBlock: P.CoderType<P.StructInput<{
    version: number;
    internalKey: Uint8Array;
    merklePath: Uint8Array[];
}>>;
export declare const PSBTGlobal: {
    readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
        version: number;
        inputs: P.StructInput<{
            txid: any;
            index: any;
            finalScriptSig: any;
            sequence: any;
        }>[];
        outputs: P.StructInput<{
            amount: any;
            script: any;
        }>[];
        lockTime: number;
    }>>, readonly [0], readonly [0], false];
    readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        fingerprint: number;
        path: number[];
    }>>, readonly [], readonly [0, 2], false];
    readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
    readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
    readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
    readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
    readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
};
export declare const PSBTInput: {
    readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
        version: number;
        segwitFlag: boolean | undefined;
        inputs: P.StructInput<{
            txid: any;
            index: any;
            finalScriptSig: any;
            sequence: any;
        }>[];
        outputs: P.StructInput<{
            amount: any;
            script: any;
        }>[];
        witnesses: P.Option<Uint8Array[][]>;
        lockTime: number;
    }>>, readonly [], readonly [0, 2], false];
    readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
        amount: bigint;
        script: Uint8Array;
    }>>, readonly [], readonly [0, 2], false];
    readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
    readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        fingerprint: number;
        path: number[];
    }>>, readonly [], readonly [0, 2], false];
    readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
    readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
    readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
    readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
    readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
        pubKey: Uint8Array;
        leafHash: Uint8Array;
    }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
        version: number;
        internalKey: Uint8Array;
        merklePath: Uint8Array[];
    }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        hashes: Uint8Array[];
        der: P.StructInput<{
            fingerprint: any;
            path: any;
        }>;
    }>>, readonly [], readonly [0, 2], false];
    readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
};
export declare const PSBTInputFinalKeys: (keyof TransactionInput)[];
export declare const PSBTInputUnsignedKeys: (keyof TransactionInput)[];
export declare const PSBTOutput: {
    readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        fingerprint: number;
        path: number[];
    }>>, readonly [], readonly [0, 2], false];
    readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
    readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
    readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
        depth: number;
        version: number;
        script: Uint8Array;
    }>[]>, readonly [], readonly [0, 2], false];
    readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        hashes: Uint8Array[];
        der: P.StructInput<{
            fingerprint: any;
            path: any;
        }>;
    }>>, readonly [], readonly [0, 2], false];
    readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
};
export declare const PSBTOutputUnsignedKeys: (keyof typeof PSBTOutput)[];
type PSBTKeyCoder = P.CoderType<any> | false;
type PSBTKeyMapInfo = Readonly<[
    number,
    PSBTKeyCoder,
    any,
    readonly number[],
    readonly number[],
    boolean
]>;
type PSBTKeyMap = Record<string, PSBTKeyMapInfo>;
declare const PSBTUnknownKey: P.CoderType<P.StructInput<{
    type: number;
    key: Uint8Array;
}>>;
type PSBTUnknownFields = {
    unknown?: [P.UnwrapCoder<typeof PSBTUnknownKey>, Bytes][];
};
export type PSBTKeyMapKeys<T extends PSBTKeyMap> = {
    -readonly [K in keyof T]?: T[K][1] extends false ? P.UnwrapCoder<T[K][2]> : [P.UnwrapCoder<T[K][1]>, P.UnwrapCoder<T[K][2]>][];
} & PSBTUnknownFields;
declare function PSBTKeyMap<T extends PSBTKeyMap>(psbtEnum: T): P.CoderType<PSBTKeyMapKeys<T>>;
export declare const PSBTInputCoder: P.CoderType<PSBTKeyMapKeys<{
    readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
        version: number;
        segwitFlag: boolean | undefined;
        inputs: P.StructInput<{
            txid: any;
            index: any;
            finalScriptSig: any;
            sequence: any;
        }>[];
        outputs: P.StructInput<{
            amount: any;
            script: any;
        }>[];
        witnesses: P.Option<Uint8Array[][]>;
        lockTime: number;
    }>>, readonly [], readonly [0, 2], false];
    readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
        amount: bigint;
        script: Uint8Array;
    }>>, readonly [], readonly [0, 2], false];
    readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
    readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        fingerprint: number;
        path: number[];
    }>>, readonly [], readonly [0, 2], false];
    readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
    readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
    readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
    readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
    readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
    readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
        pubKey: Uint8Array;
        leafHash: Uint8Array;
    }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
        version: number;
        internalKey: Uint8Array;
        merklePath: Uint8Array[];
    }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        hashes: Uint8Array[];
        der: P.StructInput<{
            fingerprint: any;
            path: any;
        }>;
    }>>, readonly [], readonly [0, 2], false];
    readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
}>>;
export type ExtendType<T, E> = {
    [K in keyof T]: K extends keyof E ? E[K] | T[K] : T[K];
};
export type RequireType<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
export type TransactionInput = P.UnwrapCoder<typeof PSBTInputCoder>;
export type TransactionInputUpdate = ExtendType<TransactionInput, {
    nonWitnessUtxo?: string | Bytes;
    txid?: string;
}>;
export declare const PSBTOutputCoder: P.CoderType<PSBTKeyMapKeys<{
    readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        fingerprint: number;
        path: number[];
    }>>, readonly [], readonly [0, 2], false];
    readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
    readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
    readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
        depth: number;
        version: number;
        script: Uint8Array;
    }>[]>, readonly [], readonly [0, 2], false];
    readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
        hashes: Uint8Array[];
        der: P.StructInput<{
            fingerprint: any;
            path: any;
        }>;
    }>>, readonly [], readonly [0, 2], false];
    readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
}>>;
export type TransactionOutput = P.UnwrapCoder<typeof PSBTOutputCoder>;
export type TransactionOutputUpdate = ExtendType<TransactionOutput, {
    script?: string;
}>;
export type TransactionOutputRequired = {
    script: Bytes;
    amount: bigint;
};
export declare const _RawPSBTV0: P.CoderType<P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}>>;
export declare const _RawPSBTV2: P.CoderType<P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}>>;
export type PSBTRaw = typeof _RawPSBTV0 | typeof _RawPSBTV2;
export declare const _DebugPSBT: P.CoderType<P.StructInput<{
    magic: undefined;
    items: Record<string, string | Uint8Array>[];
}>>;
export declare function cleanPSBTFields<T extends PSBTKeyMap>(version: number, info: T, lst: PSBTKeyMapKeys<T>): PSBTKeyMapKeys<T>;
export declare function mergeKeyMap<T extends PSBTKeyMap>(psbtEnum: T, val: PSBTKeyMapKeys<T>, cur?: PSBTKeyMapKeys<T>, allowedFields?: (keyof PSBTKeyMapKeys<T>)[], allowUnknown?: boolean): PSBTKeyMapKeys<T>;
export declare const RawPSBTV0: P.CoderType<P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}> | P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}>>;
export declare const RawPSBTV2: P.CoderType<P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}> | P.StructInput<{
    magic: undefined;
    global: PSBTKeyMapKeys<{
        readonly unsignedTx: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            inputs: any;
            outputs: any;
            lockTime: any;
        }>>, readonly [0], readonly [0], false];
        readonly xpub: readonly [1, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly txVersion: readonly [2, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly fallbackLocktime: readonly [3, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly inputCount: readonly [4, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly outputCount: readonly [5, false, P.CoderType<number>, readonly [2], readonly [2], false];
        readonly txModifiable: readonly [6, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly version: readonly [251, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>;
    inputs: PSBTKeyMapKeys<{
        readonly nonWitnessUtxo: readonly [0, false, P.CoderType<P.StructInput<{
            version: any;
            segwitFlag: any;
            inputs: any;
            outputs: any;
            witnesses: any;
            lockTime: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly witnessUtxo: readonly [1, false, P.CoderType<P.StructInput<{
            amount: any;
            script: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly partialSig: readonly [2, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sighashType: readonly [3, false, P.CoderType<number>, readonly [], readonly [0, 2], false];
        readonly redeemScript: readonly [4, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [6, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly finalScriptSig: readonly [7, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly finalScriptWitness: readonly [8, false, P.CoderType<Uint8Array[]>, readonly [], readonly [0, 2], false];
        readonly porCommitment: readonly [9, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly ripemd160: readonly [10, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly sha256: readonly [11, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash160: readonly [12, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly hash256: readonly [13, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly txid: readonly [14, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly index: readonly [15, false, P.CoderType<number>, readonly [2], readonly [2], true];
        readonly sequence: readonly [16, false, P.CoderType<number>, readonly [], readonly [2], true];
        readonly requiredTimeLocktime: readonly [17, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly requiredHeightLocktime: readonly [18, false, P.CoderType<number>, readonly [], readonly [2], false];
        readonly tapKeySig: readonly [19, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapScriptSig: readonly [20, P.CoderType<P.StructInput<{
            pubKey: any;
            leafHash: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapLeafScript: readonly [21, P.CoderType<P.StructInput<{
            version: any;
            internalKey: any;
            merklePath: any;
        }>>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [22, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly tapInternalKey: readonly [23, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapMerkleRoot: readonly [24, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
    outputs: PSBTKeyMapKeys<{
        readonly redeemScript: readonly [0, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly witnessScript: readonly [1, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly bip32Derivation: readonly [2, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            fingerprint: any;
            path: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly amount: readonly [3, false, P.CoderType<bigint>, readonly [2], readonly [2], true];
        readonly script: readonly [4, false, P.CoderType<Uint8Array>, readonly [2], readonly [2], true];
        readonly tapInternalKey: readonly [5, false, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
        readonly tapTree: readonly [6, false, P.CoderType<P.StructInput<{
            depth: any;
            version: any;
            script: any;
        }>[]>, readonly [], readonly [0, 2], false];
        readonly tapBip32Derivation: readonly [7, P.CoderType<Uint8Array>, P.CoderType<P.StructInput<{
            hashes: any;
            der: any;
        }>>, readonly [], readonly [0, 2], false];
        readonly proprietary: readonly [252, P.CoderType<Uint8Array>, P.CoderType<Uint8Array>, readonly [], readonly [0, 2], false];
    }>[];
}>>;
export {};
//# sourceMappingURL=psbt.d.ts.map
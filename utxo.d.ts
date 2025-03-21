import * as P from 'micro-packed';
import * as psbt from './psbt.js';
import { RawOutput } from './script.js';
import { SignatureHash, Transaction, type TxOpts } from './transaction.js';
import { type Bytes, NETWORK } from './utils.js';
export type PSBTInputs = psbt.PSBTKeyMapKeys<typeof psbt.PSBTInput>;
export declare function getPrevOut(input: psbt.TransactionInput): P.UnwrapCoder<typeof RawOutput>;
export declare function normalizeInput(i: psbt.TransactionInputUpdate, cur?: psbt.TransactionInput, allowedFields?: (keyof psbt.TransactionInput)[], disableScriptCheck?: boolean, allowUnknown?: boolean): psbt.TransactionInput;
export declare function getInputType(input: psbt.TransactionInput, allowLegacyWitnessUtxo?: boolean): {
    type: string;
    txType: string;
    last: {
        type: "p2a";
        script: Bytes;
    } | {
        type: "pk";
        pubkey: Bytes;
    } | {
        type: "pkh";
        hash: Bytes;
    } | {
        type: "wpkh";
        hash: Bytes;
    } | {
        type: "ms";
        pubkeys: Bytes[];
        m: number;
    } | {
        type: "tr";
        pubkey: Bytes;
    } | {
        type: "tr_ns";
        pubkeys: Bytes[];
    } | {
        type: "tr_ms";
        pubkeys: Bytes[];
        m: number;
    } | {
        type: "unknown";
        script: Bytes;
    };
    lastScript: Uint8Array;
    defaultSighash: SignatureHash.ALL;
    sighash: number;
} | {
    txType: string;
    type: string;
    last: {
        type: "tr";
        pubkey: Bytes;
    };
    lastScript: Uint8Array;
    defaultSighash: SignatureHash.DEFAULT;
    sighash: number;
};
export declare const toVsize: (weight: number) => number;
export type Output = {
    address: string;
    amount: bigint;
} | {
    script: Uint8Array;
    amount: bigint;
};
export type Accumulated = {
    indices: number[];
    fee: bigint | undefined;
    weight: number;
    total: bigint;
} | undefined;
export declare const _cmpBig: (a: bigint, b: bigint) => 0 | 1 | -1;
export type EstimatorOpts = TxOpts & {
    feePerByte: bigint;
    changeAddress: string;
    alwaysChange?: boolean;
    bip69?: boolean;
    network?: typeof NETWORK;
    dust?: number;
    dustRelayFeeRate?: bigint;
    createTx?: boolean;
    requiredInputs?: psbt.TransactionInputUpdate[];
    allowSameUtxo?: boolean;
};
type SortStrategy = 'Newest' | 'Oldest' | 'Smallest' | 'Biggest';
type ExactStrategy = `exact${SortStrategy}`;
type AccumStrategy = `accum${SortStrategy}`;
export type SelectionStrategy = 'all' | 'default' | AccumStrategy | `${ExactStrategy}/${AccumStrategy}`;
export declare class _Estimator {
    private baseWeight;
    private changeWeight;
    private amount;
    private requiredIndices;
    private normalizedInputs;
    private dust;
    private outputs;
    private opts;
    constructor(inputs: psbt.TransactionInputUpdate[], outputs: Output[], opts: EstimatorOpts);
    private checkInputIdx;
    private sortIndices;
    private sortOutputs;
    private getSatoshi;
    get biggest(): number[];
    get smallest(): number[];
    get oldest(): number[];
    get newest(): number[];
    accumulate(indices: number[], exact?: boolean, skipNegative?: boolean, all?: boolean): Accumulated;
    default(): Accumulated;
    private select;
    result(strategy: SelectionStrategy): ({
        inputs: psbt.PSBTKeyMapKeys<{
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
        }>[];
        outputs: Output[];
        fee: bigint | undefined;
        weight: number;
        change: boolean;
    } & {
        tx: Transaction | undefined;
    }) | undefined;
}
export declare function selectUTXO(inputs: psbt.TransactionInputUpdate[], outputs: Output[], strategy: SelectionStrategy, opts: EstimatorOpts): ({
    inputs: psbt.PSBTKeyMapKeys<{
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
    }>[];
    outputs: Output[];
    fee: bigint | undefined;
    weight: number;
    change: boolean;
} & {
    tx: Transaction | undefined;
}) | undefined;
export {};
//# sourceMappingURL=utxo.d.ts.map
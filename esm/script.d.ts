import * as P from 'micro-packed';
export declare const MAX_SCRIPT_BYTE_LENGTH = 520;
export declare enum OP {
    OP_0 = 0,
    PUSHDATA1 = 76,
    PUSHDATA2 = 77,
    PUSHDATA4 = 78,
    '1NEGATE' = 79,
    RESERVED = 80,
    OP_1 = 81,
    OP_2 = 82,
    OP_3 = 83,
    OP_4 = 84,
    OP_5 = 85,
    OP_6 = 86,
    OP_7 = 87,
    OP_8 = 88,
    OP_9 = 89,
    OP_10 = 90,
    OP_11 = 91,
    OP_12 = 92,
    OP_13 = 93,
    OP_14 = 94,
    OP_15 = 95,
    OP_16 = 96,
    NOP = 97,
    VER = 98,
    IF = 99,
    NOTIF = 100,
    VERIF = 101,
    VERNOTIF = 102,
    ELSE = 103,
    ENDIF = 104,
    VERIFY = 105,
    RETURN = 106,
    TOALTSTACK = 107,
    FROMALTSTACK = 108,
    '2DROP' = 109,
    '2DUP' = 110,
    '3DUP' = 111,
    '2OVER' = 112,
    '2ROT' = 113,
    '2SWAP' = 114,
    IFDUP = 115,
    DEPTH = 116,
    DROP = 117,
    DUP = 118,
    NIP = 119,
    OVER = 120,
    PICK = 121,
    ROLL = 122,
    ROT = 123,
    SWAP = 124,
    TUCK = 125,
    CAT = 126,
    SUBSTR = 127,
    LEFT = 128,
    RIGHT = 129,
    SIZE = 130,
    INVERT = 131,
    AND = 132,
    OR = 133,
    XOR = 134,
    EQUAL = 135,
    EQUALVERIFY = 136,
    RESERVED1 = 137,
    RESERVED2 = 138,
    '1ADD' = 139,
    '1SUB' = 140,
    '2MUL' = 141,
    '2DIV' = 142,
    NEGATE = 143,
    ABS = 144,
    NOT = 145,
    '0NOTEQUAL' = 146,
    ADD = 147,
    SUB = 148,
    MUL = 149,
    DIV = 150,
    MOD = 151,
    LSHIFT = 152,
    RSHIFT = 153,
    BOOLAND = 154,
    BOOLOR = 155,
    NUMEQUAL = 156,
    NUMEQUALVERIFY = 157,
    NUMNOTEQUAL = 158,
    LESSTHAN = 159,
    GREATERTHAN = 160,
    LESSTHANOREQUAL = 161,
    GREATERTHANOREQUAL = 162,
    MIN = 163,
    MAX = 164,
    WITHIN = 165,
    RIPEMD160 = 166,
    SHA1 = 167,
    SHA256 = 168,
    HASH160 = 169,
    HASH256 = 170,
    CODESEPARATOR = 171,
    CHECKSIG = 172,
    CHECKSIGVERIFY = 173,
    CHECKMULTISIG = 174,
    CHECKMULTISIGVERIFY = 175,
    NOP1 = 176,
    CHECKLOCKTIMEVERIFY = 177,
    CHECKSEQUENCEVERIFY = 178,
    NOP4 = 179,
    NOP5 = 180,
    NOP6 = 181,
    NOP7 = 182,
    NOP8 = 183,
    NOP9 = 184,
    NOP10 = 185,
    CHECKSIGADD = 186,
    INVALID = 255
}
export type ScriptOP = keyof typeof OP | Uint8Array | number;
export type ScriptType = ScriptOP[];
export declare function ScriptNum(bytesLimit?: number, forceMinimal?: boolean): P.CoderType<bigint>;
export declare function OpToNum(op: ScriptOP, bytesLimit?: number, forceMinimal?: boolean): number | undefined;
export declare const Script: P.CoderType<ScriptType>;
export declare const CompactSize: P.CoderType<bigint>;
export declare const CompactSizeLen: P.CoderType<number>;
export declare const VarBytes: P.CoderType<Uint8Array>;
export declare const RawWitness: P.CoderType<Uint8Array[]>;
export declare const BTCArray: <T>(t: P.CoderType<T>) => P.CoderType<T[]>;
export declare const RawInput: P.CoderType<P.StructInput<{
    txid: Uint8Array;
    index: number;
    finalScriptSig: Uint8Array;
    sequence: number;
}>>;
export declare const RawOutput: P.CoderType<P.StructInput<{
    amount: bigint;
    script: Uint8Array;
}>>;
declare const _RawTx: P.CoderType<P.StructInput<{
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
}>>;
export declare const RawTx: typeof _RawTx;
export declare const RawOldTx: P.CoderType<P.StructInput<{
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
}>>;
export {};
//# sourceMappingURL=script.d.ts.map
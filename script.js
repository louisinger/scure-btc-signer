"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawOldTx = exports.RawTx = exports.RawOutput = exports.RawInput = exports.BTCArray = exports.RawWitness = exports.VarBytes = exports.CompactSizeLen = exports.CompactSize = exports.Script = exports.OP = exports.MAX_SCRIPT_BYTE_LENGTH = void 0;
exports.ScriptNum = ScriptNum;
exports.OpToNum = OpToNum;
const P = require("micro-packed");
const utils_js_1 = require("./utils.js");
exports.MAX_SCRIPT_BYTE_LENGTH = 520;
// prettier-ignore
var OP;
(function (OP) {
    OP[OP["OP_0"] = 0] = "OP_0";
    OP[OP["PUSHDATA1"] = 76] = "PUSHDATA1";
    OP[OP["PUSHDATA2"] = 77] = "PUSHDATA2";
    OP[OP["PUSHDATA4"] = 78] = "PUSHDATA4";
    OP[OP["1NEGATE"] = 79] = "1NEGATE";
    OP[OP["RESERVED"] = 80] = "RESERVED";
    OP[OP["OP_1"] = 81] = "OP_1";
    OP[OP["OP_2"] = 82] = "OP_2";
    OP[OP["OP_3"] = 83] = "OP_3";
    OP[OP["OP_4"] = 84] = "OP_4";
    OP[OP["OP_5"] = 85] = "OP_5";
    OP[OP["OP_6"] = 86] = "OP_6";
    OP[OP["OP_7"] = 87] = "OP_7";
    OP[OP["OP_8"] = 88] = "OP_8";
    OP[OP["OP_9"] = 89] = "OP_9";
    OP[OP["OP_10"] = 90] = "OP_10";
    OP[OP["OP_11"] = 91] = "OP_11";
    OP[OP["OP_12"] = 92] = "OP_12";
    OP[OP["OP_13"] = 93] = "OP_13";
    OP[OP["OP_14"] = 94] = "OP_14";
    OP[OP["OP_15"] = 95] = "OP_15";
    OP[OP["OP_16"] = 96] = "OP_16";
    // Control
    OP[OP["NOP"] = 97] = "NOP";
    OP[OP["VER"] = 98] = "VER";
    OP[OP["IF"] = 99] = "IF";
    OP[OP["NOTIF"] = 100] = "NOTIF";
    OP[OP["VERIF"] = 101] = "VERIF";
    OP[OP["VERNOTIF"] = 102] = "VERNOTIF";
    OP[OP["ELSE"] = 103] = "ELSE";
    OP[OP["ENDIF"] = 104] = "ENDIF";
    OP[OP["VERIFY"] = 105] = "VERIFY";
    OP[OP["RETURN"] = 106] = "RETURN";
    // Stack
    OP[OP["TOALTSTACK"] = 107] = "TOALTSTACK";
    OP[OP["FROMALTSTACK"] = 108] = "FROMALTSTACK";
    OP[OP["2DROP"] = 109] = "2DROP";
    OP[OP["2DUP"] = 110] = "2DUP";
    OP[OP["3DUP"] = 111] = "3DUP";
    OP[OP["2OVER"] = 112] = "2OVER";
    OP[OP["2ROT"] = 113] = "2ROT";
    OP[OP["2SWAP"] = 114] = "2SWAP";
    OP[OP["IFDUP"] = 115] = "IFDUP";
    OP[OP["DEPTH"] = 116] = "DEPTH";
    OP[OP["DROP"] = 117] = "DROP";
    OP[OP["DUP"] = 118] = "DUP";
    OP[OP["NIP"] = 119] = "NIP";
    OP[OP["OVER"] = 120] = "OVER";
    OP[OP["PICK"] = 121] = "PICK";
    OP[OP["ROLL"] = 122] = "ROLL";
    OP[OP["ROT"] = 123] = "ROT";
    OP[OP["SWAP"] = 124] = "SWAP";
    OP[OP["TUCK"] = 125] = "TUCK";
    // Splice
    OP[OP["CAT"] = 126] = "CAT";
    OP[OP["SUBSTR"] = 127] = "SUBSTR";
    OP[OP["LEFT"] = 128] = "LEFT";
    OP[OP["RIGHT"] = 129] = "RIGHT";
    OP[OP["SIZE"] = 130] = "SIZE";
    // Boolean logic
    OP[OP["INVERT"] = 131] = "INVERT";
    OP[OP["AND"] = 132] = "AND";
    OP[OP["OR"] = 133] = "OR";
    OP[OP["XOR"] = 134] = "XOR";
    OP[OP["EQUAL"] = 135] = "EQUAL";
    OP[OP["EQUALVERIFY"] = 136] = "EQUALVERIFY";
    OP[OP["RESERVED1"] = 137] = "RESERVED1";
    OP[OP["RESERVED2"] = 138] = "RESERVED2";
    // Numbers
    OP[OP["1ADD"] = 139] = "1ADD";
    OP[OP["1SUB"] = 140] = "1SUB";
    OP[OP["2MUL"] = 141] = "2MUL";
    OP[OP["2DIV"] = 142] = "2DIV";
    OP[OP["NEGATE"] = 143] = "NEGATE";
    OP[OP["ABS"] = 144] = "ABS";
    OP[OP["NOT"] = 145] = "NOT";
    OP[OP["0NOTEQUAL"] = 146] = "0NOTEQUAL";
    OP[OP["ADD"] = 147] = "ADD";
    OP[OP["SUB"] = 148] = "SUB";
    OP[OP["MUL"] = 149] = "MUL";
    OP[OP["DIV"] = 150] = "DIV";
    OP[OP["MOD"] = 151] = "MOD";
    OP[OP["LSHIFT"] = 152] = "LSHIFT";
    OP[OP["RSHIFT"] = 153] = "RSHIFT";
    OP[OP["BOOLAND"] = 154] = "BOOLAND";
    OP[OP["BOOLOR"] = 155] = "BOOLOR";
    OP[OP["NUMEQUAL"] = 156] = "NUMEQUAL";
    OP[OP["NUMEQUALVERIFY"] = 157] = "NUMEQUALVERIFY";
    OP[OP["NUMNOTEQUAL"] = 158] = "NUMNOTEQUAL";
    OP[OP["LESSTHAN"] = 159] = "LESSTHAN";
    OP[OP["GREATERTHAN"] = 160] = "GREATERTHAN";
    OP[OP["LESSTHANOREQUAL"] = 161] = "LESSTHANOREQUAL";
    OP[OP["GREATERTHANOREQUAL"] = 162] = "GREATERTHANOREQUAL";
    OP[OP["MIN"] = 163] = "MIN";
    OP[OP["MAX"] = 164] = "MAX";
    OP[OP["WITHIN"] = 165] = "WITHIN";
    // Crypto
    OP[OP["RIPEMD160"] = 166] = "RIPEMD160";
    OP[OP["SHA1"] = 167] = "SHA1";
    OP[OP["SHA256"] = 168] = "SHA256";
    OP[OP["HASH160"] = 169] = "HASH160";
    OP[OP["HASH256"] = 170] = "HASH256";
    OP[OP["CODESEPARATOR"] = 171] = "CODESEPARATOR";
    OP[OP["CHECKSIG"] = 172] = "CHECKSIG";
    OP[OP["CHECKSIGVERIFY"] = 173] = "CHECKSIGVERIFY";
    OP[OP["CHECKMULTISIG"] = 174] = "CHECKMULTISIG";
    OP[OP["CHECKMULTISIGVERIFY"] = 175] = "CHECKMULTISIGVERIFY";
    // Expansion
    OP[OP["NOP1"] = 176] = "NOP1";
    OP[OP["CHECKLOCKTIMEVERIFY"] = 177] = "CHECKLOCKTIMEVERIFY";
    OP[OP["CHECKSEQUENCEVERIFY"] = 178] = "CHECKSEQUENCEVERIFY";
    OP[OP["NOP4"] = 179] = "NOP4";
    OP[OP["NOP5"] = 180] = "NOP5";
    OP[OP["NOP6"] = 181] = "NOP6";
    OP[OP["NOP7"] = 182] = "NOP7";
    OP[OP["NOP8"] = 183] = "NOP8";
    OP[OP["NOP9"] = 184] = "NOP9";
    OP[OP["NOP10"] = 185] = "NOP10";
    // BIP 342
    OP[OP["CHECKSIGADD"] = 186] = "CHECKSIGADD";
    // Invalid
    OP[OP["INVALID"] = 255] = "INVALID";
})(OP || (exports.OP = OP = {}));
// We can encode almost any number as ScriptNum, however, parsing will be a problem
// since we can't know if buffer is a number or something else.
function ScriptNum(bytesLimit = 6, forceMinimal = false) {
    return P.wrap({
        encodeStream: (w, value) => {
            if (value === 0n)
                return;
            const neg = value < 0;
            const val = BigInt(value);
            const nums = [];
            for (let abs = neg ? -val : val; abs; abs >>= 8n)
                nums.push(Number(abs & 0xffn));
            if (nums[nums.length - 1] >= 0x80)
                nums.push(neg ? 0x80 : 0);
            else if (neg)
                nums[nums.length - 1] |= 0x80;
            w.bytes(new Uint8Array(nums));
        },
        decodeStream: (r) => {
            const len = r.leftBytes;
            if (len > bytesLimit)
                throw new Error(`ScriptNum: number (${len}) bigger than limit=${bytesLimit}`);
            if (len === 0)
                return 0n;
            if (forceMinimal) {
                const data = r.bytes(len, true);
                // MSB is zero (without sign bit) -> not minimally encoded
                if ((data[data.length - 1] & 0x7f) === 0) {
                    // exception
                    if (len <= 1 || (data[data.length - 2] & 0x80) === 0)
                        throw new Error('Non-minimally encoded ScriptNum');
                }
            }
            let last = 0;
            let res = 0n;
            for (let i = 0; i < len; ++i) {
                last = r.byte();
                res |= BigInt(last) << (8n * BigInt(i));
            }
            if (last >= 0x80) {
                res &= (2n ** BigInt(len * 8) - 1n) >> 1n;
                res = -res;
            }
            return res;
        },
    });
}
function OpToNum(op, bytesLimit = 4, forceMinimal = true) {
    if (typeof op === 'number')
        return op;
    if ((0, utils_js_1.isBytes)(op)) {
        try {
            const val = ScriptNum(bytesLimit, forceMinimal).decode(op);
            if (val > Number.MAX_SAFE_INTEGER)
                return;
            return Number(val);
        }
        catch (e) {
            return;
        }
    }
    return;
}
// Converts script bytes to parsed script
// 5221030000000000000000000000000000000000000000000000000000000000000001210300000000000000000000000000000000000000000000000000000000000000022103000000000000000000000000000000000000000000000000000000000000000353ae
// =>
// OP_2
//   030000000000000000000000000000000000000000000000000000000000000001
//   030000000000000000000000000000000000000000000000000000000000000002
//   030000000000000000000000000000000000000000000000000000000000000003
//   OP_3
//   CHECKMULTISIG
exports.Script = P.wrap({
    encodeStream: (w, value) => {
        for (let o of value) {
            if (typeof o === 'string') {
                if (OP[o] === undefined)
                    throw new Error(`Unknown opcode=${o}`);
                w.byte(OP[o]);
                continue;
            }
            else if (typeof o === 'number') {
                if (o === 0x00) {
                    w.byte(0x00);
                    continue;
                }
                else if (1 <= o && o <= 16) {
                    w.byte(OP.OP_1 - 1 + o);
                    continue;
                }
            }
            // Encode big numbers
            if (typeof o === 'number')
                o = ScriptNum().encode(BigInt(o));
            if (!(0, utils_js_1.isBytes)(o))
                throw new Error(`Wrong Script OP=${o} (${typeof o})`);
            // Bytes
            const len = o.length;
            if (len < OP.PUSHDATA1)
                w.byte(len);
            else if (len <= 0xff) {
                w.byte(OP.PUSHDATA1);
                w.byte(len);
            }
            else if (len <= 0xffff) {
                w.byte(OP.PUSHDATA2);
                w.bytes(P.U16LE.encode(len));
            }
            else {
                w.byte(OP.PUSHDATA4);
                w.bytes(P.U32LE.encode(len));
            }
            w.bytes(o);
        }
    },
    decodeStream: (r) => {
        const out = [];
        while (!r.isEnd()) {
            const cur = r.byte();
            // if 0 < cur < 78
            if (OP.OP_0 < cur && cur <= OP.PUSHDATA4) {
                let len;
                if (cur < OP.PUSHDATA1)
                    len = cur;
                else if (cur === OP.PUSHDATA1)
                    len = P.U8.decodeStream(r);
                else if (cur === OP.PUSHDATA2)
                    len = P.U16LE.decodeStream(r);
                else if (cur === OP.PUSHDATA4)
                    len = P.U32LE.decodeStream(r);
                else
                    throw new Error('Should be not possible');
                out.push(r.bytes(len));
            }
            else if (cur === 0x00) {
                out.push(0);
            }
            else if (OP.OP_1 <= cur && cur <= OP.OP_16) {
                out.push(cur - (OP.OP_1 - 1));
            }
            else {
                const op = OP[cur];
                if (op === undefined)
                    throw new Error(`Unknown opcode=${cur.toString(16)}`);
                out.push(op);
            }
        }
        return out;
    },
});
// BTC specific variable length integer encoding
// https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
const CSLimits = {
    0xfd: [0xfd, 2, 253n, 65535n],
    0xfe: [0xfe, 4, 65536n, 4294967295n],
    0xff: [0xff, 8, 4294967296n, 18446744073709551615n],
};
exports.CompactSize = P.wrap({
    encodeStream: (w, value) => {
        if (typeof value === 'number')
            value = BigInt(value);
        if (0n <= value && value <= 252n)
            return w.byte(Number(value));
        for (const [flag, bytes, start, stop] of Object.values(CSLimits)) {
            if (start > value || value > stop)
                continue;
            w.byte(flag);
            for (let i = 0; i < bytes; i++)
                w.byte(Number((value >> (8n * BigInt(i))) & 0xffn));
            return;
        }
        throw w.err(`VarInt too big: ${value}`);
    },
    decodeStream: (r) => {
        const b0 = r.byte();
        if (b0 <= 0xfc)
            return BigInt(b0);
        const [_, bytes, start] = CSLimits[b0];
        let num = 0n;
        for (let i = 0; i < bytes; i++)
            num |= BigInt(r.byte()) << (8n * BigInt(i));
        if (num < start)
            throw r.err(`Wrong CompactSize(${8 * bytes})`);
        return num;
    },
});
// Same thing, but in number instead of bigint. Checks for safe integer inside
exports.CompactSizeLen = P.apply(exports.CompactSize, P.coders.numberBigint);
// ui8a of size <CompactSize>
exports.VarBytes = P.bytes(exports.CompactSize);
// SegWit v0 stack of witness buffers
exports.RawWitness = P.array(exports.CompactSizeLen, exports.VarBytes);
// Array of size <CompactSize>
const BTCArray = (t) => P.array(exports.CompactSize, t);
exports.BTCArray = BTCArray;
exports.RawInput = P.struct({
    txid: P.bytes(32, true), // hash(prev_tx),
    index: P.U32LE, // output number of previous tx
    finalScriptSig: exports.VarBytes, // btc merges input and output script, executes it. If ok = tx passes
    sequence: P.U32LE, // ?
});
exports.RawOutput = P.struct({ amount: P.U64LE, script: exports.VarBytes });
// https://en.bitcoin.it/wiki/Protocol_documentation#tx
const _RawTx = P.struct({
    version: P.I32LE,
    segwitFlag: P.flag(new Uint8Array([0x00, 0x01])),
    inputs: (0, exports.BTCArray)(exports.RawInput),
    outputs: (0, exports.BTCArray)(exports.RawOutput),
    witnesses: P.flagged('segwitFlag', P.array('inputs/length', exports.RawWitness)),
    // < 500000000	Block number at which this transaction is unlocked
    // >= 500000000	UNIX timestamp at which this transaction is unlocked
    // Handled as part of PSBTv2
    lockTime: P.U32LE,
});
function validateRawTx(tx) {
    if (tx.segwitFlag && tx.witnesses && !tx.witnesses.length)
        throw new Error('Segwit flag with empty witnesses array');
    return tx;
}
exports.RawTx = P.validate(_RawTx, validateRawTx);
// Pre-SegWit serialization format (for PSBTv0)
exports.RawOldTx = P.struct({
    version: P.I32LE,
    inputs: (0, exports.BTCArray)(exports.RawInput),
    outputs: (0, exports.BTCArray)(exports.RawOutput),
    lockTime: P.U32LE,
});
//# sourceMappingURL=script.js.map